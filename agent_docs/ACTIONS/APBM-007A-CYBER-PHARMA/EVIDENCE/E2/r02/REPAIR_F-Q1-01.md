# F-Q1-01 webhook recovery — engineering repair r02

| Field | Value |
|---|---|
| Authority | JARVIS → Engineering consolidated repair, 13 November 2026; Director restored both checkouts to `apbm-007a` after backing up QA's files |
| Bases | OwedBook `e30e216` (no product change in r02); Payment Portal `2bb13b9` |
| Finding | F-Q1-01 (QA source observation, Lead-classified candidate acceptance failure against AC-014/AC-015) |
| Layer of proof | Unit (in-memory database and Stripe fakes, real signature library), plus one read-only DEV query. No live effect |
| Schema | No change. Migrations 0053–0060 untouched; the repair uses the existing `stripe_events` states and the existing immutable `audit_logs` |

## 1. Root cause

In `src/server/webhook.ts` at `2bb13b9`:

| # | Line(s) | Defect |
|---|---|---|
| 1 | 48, 61, 80, 94, 100, 117 | A supported event whose object had no mapping in the database returned `unmapped`, was finished as `ignored` and answered 200. A missing mapping was treated as proof the object was not ours, so Stripe never retried and nothing stayed visible as unfinished |
| 2 | 39 | The duplicate check treated `ignored` as final, so a redelivery of such an event was also answered 200 `duplicate` |
| 3 | 117–120 | A subscription event that found its operation busy returned `pending` and was finished as `processed` |
| 4 | 53 (found during repair) | The failure path wrote `failed` unconditionally, so a late failure from one delivery could overwrite a row that a concurrent delivery had already processed |
| 5 | 81–83, 95–97 (found during repair) | `checkout.session.completed` and a first-invoice `invoice.paid` whose payment the operation could not yet see as settled (`pending`) were finished as processed, although the event's work was not done |

## 2. Final behaviour

Only finished work is acknowledged. There is no background worker, so no unfinished event is ever answered 2xx.

| Outcome of an attempt | Ledger row | HTTP |
|---|---|---|
| Transition applied | `processed`, operation recorded | 200 |
| Unsupported verified type | `ignored` / `unsupported` | 200 |
| Object positively not this application's | `ignored` / `foreign` or `foreign_environment` | 200 |
| Invoice with no subscription | `ignored` / `no_subscription` | 200 |
| Ours or unresolved, mapping not recorded yet | `failed` / `awaiting_mapping`, attempts + 1 | 503 |
| Operation busy (another worker holds the lease) | `failed` / `busy` | 503 |
| Completion event, payment not yet settled | `failed` / `awaiting_settlement` | 503 |
| Provider or database failure | `failed` / error code | 500 |
| Duplicate of a final row | unchanged | 200 `duplicate` |
| Duplicate of an unfinished row, or of a pre-repair `ignored`/`unmapped` row | processed again | as above |

A failure write never replaces a `processed` row, and an `ignored` result never replaces one.

### Owned, unresolved and foreign

A missing mapping alone never makes an object foreign. For a supported event with no mapping, the server decides from trusted evidence, in this order:

1. **Database.** The customer or subscription is known to this database (checkout operation, `billing_customers` or the subscription mirror) → ours, retry.
2. **Ownership marker on the Stripe object.** Read back with our secret key by authenticated retrieval. Checkout writes `apbm_run`, `apbm_operation` and, from r02, `apbm_db` (this database's project) on the customer, the session and the subscription when it creates them.
   - Marker present → ours, retry.
   - Exception: every marker names a different database → `foreign_environment` (another environment sharing the sandbox).
   - A marker without `apbm_db` (any object created before r02) → ours, retry.
3. **Neither.** No link in the database and no marker on the session, the subscription or the customer → `foreign`.

The marker only decides between retry and foreign. It never provisions. Provisioning still needs the database operation and the operation's existing checks of session, customer, price, amount and currency.

### Retry responsibility and recovery

- **Retries.** Stripe retries a non-2xx answer. The test-mode retry window is shorter than live mode's, and the local Stripe CLI listener does not redeliver at all. So the durable recovery path is the operator command, using the unfinished rows the ledger keeps.
- **`node scripts/operator-reconcile.mjs --list`.** Lists unresolved operations plus `events.unfinished` (`received`/`failed`) and `events.suspect` (see below).
- **`node scripts/operator-reconcile.mjs --event <evt_ID>`.** Re-runs one exact recorded event:
  - It refuses unknown or malformed IDs, final rows that are not suspect, live-mode or other-account events, and a type that differs from the ledger.
  - It retrieves the event from Stripe (kept for 30 days) and runs the same decision as a delivery.
  - Before it changes any final row, it writes an audit record (`audit_logs`, `table_name stripe_events`, old row and new row, `context.fn stripe_event_recovery`). If that write fails, the row is not finalised.
  - A recovered row also keeps `recovered_from_<status>[_<code>]` in `error_code`.
  - Nothing is deleted or reset.
- **Suspect rows from before the repair.** `ignored`/`unmapped`, and `processed` `customer.subscription.*` rows that carry an operation and no code (the only path where "busy" was recorded as processed). Re-running them is safe because every transition is idempotent.
- **DEV today** (read-only, 07:16 UTC; `dev_event_ledger_readonly.json`):
  - 2 rows, both `customer.subscription.updated`, processed through the mirror with no operation;
  - 0 suspect rows and 0 unfinished rows;
  - 5 `expired_unpaid` operations and 1 `provisioned`.
  
  No DEV recovery is needed and none was run.

## 3. Proofs (unit layer)

File: Payment Portal `src/__tests__/apbm007a-webhook-recovery.test.ts`. The saga is modelled by its contract: lease → busy, unsettled → pending, provisioned once, already provisioned → no new effect. Real exactly-once provisioning is the SQL proved on SCRATCH by `cyph-v1-dev/scripts/rls-harness/apbm007a-proof.mjs`; it is reused, not rerun.

| Required proof | Tests | Result |
|---|---|---|
| a. Late mapping, then successful recovery | `a.` ×4: unmapped paid session → 503 `awaiting_mapping`, mapping added, redelivery provisions; marker with nothing in the database stays retryable; owned customer with an unmirrored subscription; renewal invoice with our marker on an unmirrored subscription | PASS |
| b. Duplicate before and after recovery | `b.`: two deliveries before mapping are both 503 (attempts 2) and listed unfinished; operator recovery processes; the next delivery is 200 `duplicate`; recovery again is `already_final`; 1 provisioning | PASS |
| c. Busy operation, then recovery | `c.` ×4: busy subscription event is 503 `busy`, never processed; busy checkout event retryable; a late busy cannot regress a row a concurrent delivery finished; unsettled completion stays retryable, and a failed first invoice is final and provisions nothing | PASS |
| d. Genuinely foreign sandbox object | `d.` ×4: no database link and no marker on the session or customer (the customer is actually read) → `ignored`/`foreign`, and the duplicate stays final; another environment's marker → `foreign_environment`; a marker without an environment is not foreign; foreign renewal invoice ignored; non-subscription invoice `no_subscription`; unsupported type | PASS (fixture objects; live sandbox object NOT RUN) |
| e. Recovery of incorrectly finalised historical events | `e.` ×4: the list holds exactly the two suspect rows; each is recovered with its earlier state in the row and in an audit record; refusals change nothing; a redelivery of a pre-repair `ignored`/`unmapped` row is processed and audited; an audit failure leaves the row unfinished, then succeeds | PASS |
| f. No duplicate provisioning or billing effects | `f.`: three distinct events × (busy, success, duplicate, recovery) → 1 provisioning; renewal paid twice → idempotent SQL, no grace start; the fake Stripe client exposes retrieval only, so any mutation would throw; checkout writes the marker on all three objects | PASS |

Poison controls (`mutation_controls.txt`): seven deliberate regressions, each caught by at least one test, with the file restored byte for byte.

### 3a. G5 reminder record (Amendment A1-3), added in r02

**Correction to r01.** r01 `ENGINEERING_HANDOFF.md` item I1 said the reminder was "an in-app banner plus a notification record". In fact only the banner existed (OwedBook `AccessBanner` from `store_access_state`); no code wrote a `renewal_reminder` notification.

Because A1-3 makes that record a 007A requirement, r02 adds it:
- **Trigger.** A renewal `invoice.payment_failed` whose invoice is open and attempted records one `notification_operations` row for the account owner.
- **Row contents.** Kind `renewal_reminder`, dedupe key `renewal_reminder:<invoice>`, status `pending`, `last_error_code` `email_deferred_007b`.
- **Retries.** The row is written on retries too, so a failed first write is completed; it stays one row per invoice.
- **No email.** Nothing is sent.

| Tests | Result |
|---|---|
| `G5 renewal reminder record` ×2: two failure events for one invoice record one pending reminder for the owner; a paid renewal records none | PASS |

The Director may drop this addition independently: it is one function in `webhook.ts` and two tests.

## 4. Checks

| Check | Result |
|---|---|
| Focused suites (`apbm007a-webhook-recovery`, `apbm007a-server`) | 61 of 61 (`focused_tests.json`) |
| Full portal unit suite | 412 of 412, 20 suites (390 at r01 + 22 new) |
| Portal typecheck | clean |
| Portal lint | 0 errors; 24 warnings, none in a changed file (carried I7) |
| Portal production build (disposable copy, placeholder credentials) | PASS; both changed routes compiled; client bundle has no server key, Stripe secret, webhook secret, admin client or `api.stripe.com` |
| OwedBook | No product change, so not rerun (r01: 276 tests, lint 0 errors, typecheck clean, build clean) |

## 5. Changed product paths (Payment Portal)

| Path | Change |
|---|---|
| `src/server/webhook.ts` | Dispositions, classification, guarded ledger writes, `recoverEvent`, `listUnfinishedEvents`; renewal reminder record (A1-3) |
| `src/server/stripeMirror.ts` | `RUN_TAG` moved here; `ENV_TAG` (database project from `NEXT_PUBLIC_SUPABASE_URL`) |
| `src/server/checkout.ts` | Marker with `apbm_db` on customer, session and subscription; imports `RUN_TAG` |
| `src/server/operator.ts` | Re-exports the event list and recovery |
| `src/app/api/operator/operations/route.ts` | GET also lists events; POST accepts `eventId` |
| `scripts/operator-reconcile.mjs` | `--event <evt_ID>`; `--list` includes events |
| `src/__tests__/apbm007a-webhook-recovery.test.ts` | New: proofs a–f, G5 reminder record, ledger rules (22 tests) |
| `src/__tests__/apbm007a-server.test.ts` | Fake builder supports `neq`; busy now 503 with `failed`/`busy`; unsupported type carries `unsupported` |

## 6. Effects

- One read-only DEV transaction, rolled back.
- Zero Stripe calls, zero emails, zero identities.
- No SCRATCH use, no server started.
- No Git operation.

## 7. Remaining limitations and live validation needed

| ID | Limitation |
|---|---|
| L1 | **Live validation NOT RUN.** Still needed against real objects and databases: a real foreign sandbox object; late mapping and busy lease against real rows; Stripe's own redelivery; `--event` against the running portal. QA T-015 owns these (approved SCRATCH fixtures; a recorded unowned sandbox object) |
| L2 | Objects created before r02 carry `apbm_run` without `apbm_db`, including SCRATCH integration-test objects in the shared sandbox. In an environment that does not know them they classify as `awaiting_mapping` and stay visible as unfinished. The operator cannot choose an outcome, so dismissing such a row needs a Director-approved disposition |
| L3 | Existing before r02, not introduced. If a Checkout session is created but its ID is never recorded on the operation (a crash between Stripe's answer and the database write), its later events stay `awaiting_mapping`, visible, and tooling cannot attach the session. The buyer never received that session's URL, so it cannot have been paid. A later attempt with a new key closes such an operation as unpaid (`checkout.ts` stale-attempt path). Not repaired here (outside the bounded scope) |
| L4 | Stripe's test-mode retries are fewer than live mode's, and the CLI listener does not redeliver; the operator command is the durable path locally |
| L5 | The suspect scan covers the oldest 1,000 final rows and 200 unfinished rows; enough for sandbox volumes |
| L6 | `isSuspect` over-approximates processed subscription events that reached an operation; a re-run is idempotent and audited |
| L7 | `attempts` is a read-then-write diagnostic counter, not atomic |
