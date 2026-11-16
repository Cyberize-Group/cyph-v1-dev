# F-Q4-001 (AC-011) — engineering repair r04

| Field | Value |
|---|---|
| Seat | Engineering repair seat (Claude), on `qa/apbm-007a` in the existing checkouts |
| Authority | JARVIS single bounded repair, F-Q4-001 / AC-011, 16 November 2026 |
| Source verdict | QA Lead (Friday) disposition recorded in `QAM/FINDINGS.md`: "F-Q4-001: acceptance failure AC-011, MEDIUM, not r03 regression". This record changes no QA finding, verdict or certificate, and engineering evidence closes nothing |
| Evidence package | `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REVIEW_a02.zip`, SHA-256 `c989104b2694ceba7ea474dfaaa7b1b269596ba944d24aa4eb35646cc7884c33` (verified); `evidence/Q4/a02/checkout-timeout.json` and `checkout-timeout-same-key.json` |
| Reviewed pair | OwedBook `f637ba4086c1e906e008b8892c880ec6489bba9a`; Payment Portal `357c274284f48ed5ad3bf8407ca0a14d0d9b99e8` (product `4cd96c82da59a093d1330307f5a27836b17f1df5`). OwedBook product unchanged |
| Governing | QAM_PLAYBOOK §11 (repair on the QA line, retest covers the diff, affected ACs and required regression; final live validation on the final candidate); RRM_PLAYBOOK §§7, 9 (Director performs every Git mutation; no quiet scope expansion) |
| Schema | No change. Applied migrations untouched |

## 1. Confirmed cause

`src/server/checkout.ts` at `4cd96c8` (byte-unchanged since r01):

1. `startCheckout` claims an operation (status `created`), then `ensureSession` creates the customer and the Checkout session with idempotency keys derived from the operation (`<op>:customer`, `<op>:session`).
2. If Stripe creates the session but its answer is lost, the operation stays `created` with no session recorded. The customer is recorded in QA's run, because its answer arrived.
3. A retry with a **different** operation key took this branch:
   - **Condition:** "`created` and no session" was taken to mean that no payment page was ever shown.
   - **Release:** it called `proveUnpaidAndRelease`, which set `expiredUnpaid = !op.stripe_checkout_session_id`, so a missing local reference counted as proof. The operation was marked `expired_unpaid` and its NPI released.
   - **New operation:** a new one was inserted under the new key. Its derived keys are new, so Stripe created a second customer and a second session.

   This matches QA's `checkout-timeout.json`: 2 customers, 2 sessions, the first operation `expired_unpaid` with `stripe_checkout_session_id: null`.
4. **Related defect in the same path.** On every attempt `ensureSession` recomputed the session's `expires_at` from the current time. Stripe returns the original object for a repeated idempotency key only when every parameter is identical, and refuses the request otherwise. So even a same-key retry after a lost answer would be refused by real Stripe once a second had passed. QA's same-key check passed because its provider adapter does not compare parameters. The repair's modelled provider does, and the candidate fails that test (`candidate_control_tests.json`).

**Other callers checked:**
- `npi_reserve` (0056) asks for proof only for a `checkout_bound` reservation, which exists only after a session is recorded.
- `provisioning.ts` releases only on a retrieved expired, unpaid session.
- `abandonCheckout` acts only on drafts in `checkout_started`, which implies a recorded session.

The unsafe inference was therefore reached only through the different-key branch.

## 2. Repair

`src/server/checkout.ts` (+95 −41). Nothing else in the product changes.

| Part | Change |
|---|---|
| Unknown outcome is resumed, not released | In `startCheckout`, an open operation in `created` with no session has an unknown provider outcome. A retry with **any** key now resumes that same operation when it is for the draft's current revision. Its own idempotency keys return Stripe's original customer and session. No release and no new operation. A different key is still refused for every other open operation (for example `checkout_open`) |
| Identical parameters on every retry | New `sessionFor` stores the planned expiry in `checkout_operations.checkout_expires_at` before the first session create and reuses it on every retry, so the repeated key carries identical parameters. The line item uses the operation's own `expected_price_id`. If Stripe rejects the stored expiry in validation (no longer 30 minutes ahead), Stripe kept no result under the key, so no session was created with it: a fresh expiry is planned once |
| Fresh state after a replay | A resumed create re-reads the session, because a replayed answer is the original, possibly stale, snapshot. If the session has already lapsed, it is recorded, the operation is released on that provider proof (expired, unpaid), and the buyer gets `expired` (refresh the quote). The next attempt starts cleanly |
| Draft edited after the lost attempt | When the open attempt is for an older revision, `settleEarlierAttempt` settles it with Stripe before any new attempt. Its own keys return (or create) its session; an open session is expired through Stripe; the operation is released only on that proof. The new attempt reuses the same customer (`stripe_customer_id` carried on insert). One open operation per draft holds throughout (unique index 0057) |
| No inference from a missing reference | `proveUnpaidAndRelease` returns `kept` when no session is recorded; it no longer treats a missing reference as unpaid |
| Customer helper | `customerFor` holds the unchanged customer create (same key, same parameters) for reuse |

**Preserved:**
- concurrency (unique key, one open operation per draft, Stripe's in-flight key conflict);
- draft isolation (cookie secret);
- authorization (signed-in owner check on new attempts);
- pricing and the quote check (the amount must equal the operation's expected total, else `attention`);
- consent (all three required before any provider call; recorded against the revision);
- expiry handling (an expired quote refused; an expired session released only on proof);
- reservation-lost handling (the session is expired through Stripe);
- later legitimate attempts after a proven release.

**Pre-existing behaviour left unchanged (outside F-Q4-001):** a retry with the **same** key after the draft was edited still resumes the earlier operation, as at `4cd96c8`. Noted as L5.

## 3. Regression proof

### Unit layer — `src/__tests__/apbm007a-checkout-recovery.test.ts` (new, 15 tests, local in-memory fixtures)

The real `checkout.ts` and `registration.ts` run against an in-memory model of `checkout_operations` and `registration_drafts`. The model enforces the unique idempotency key and one open operation per draft, as in 0057; the NPI functions are stubbed. The modelled Stripe behaves like the real provider where it matters:
- **Repeated key:** identical parameters replay the saved original; different parameters are refused; a key still in flight is a conflict.
- **Validation:** a rejection saves nothing under the key.
- **Lost answer:** the object is created and saved, then the answer is lost.

| Test | Candidate `4cd96c8` | Repair |
|---|---|---|
| Lost session answer, different-key retry: original URL; 1 customer, 1 session, 1 operation (same ID, original key); `checkout_open`; no `expired_unpaid`; no release; one `npi_bind`; draft `checkout_started`; only `<op>:customer` and `<op>:session` keys used | FAIL | PASS |
| Lost customer answer, different-key retry: same customer | FAIL | PASS |
| Same-key retry 9 s later: original session (identical parameters) | FAIL | PASS |
| Two concurrent different-key retries: 1 / 1 / 1 | FAIL | PASS |
| Request that never reached Stripe, resumed 10 min later: fresh expiry, one session | FAIL | PASS |
| Lost session that lapsed: released only on provider proof (session recorded), `expired`; later attempt clean | FAIL | PASS |
| Draft edited: earlier attempt expired through Stripe and released on proof; new operation for revision 2 with the same customer; 1 customer, 2 sessions, 2 operations, one open | FAIL | PASS |
| Draft edited with the customer answer also lost and the email changed: nothing duplicated or released | FAIL | PASS |
| `proveUnpaidAndRelease` with no recorded session → `kept` | FAIL | PASS |
| A new key cannot bypass an operation with a recorded session | PASS | PASS |
| Double submit with one key: 1 / 1 / 1 | PASS | PASS |
| Missing consent and a stale quote refused before any provider call | PASS | PASS |
| Foreign draft secret reaches nothing | PASS | PASS |
| Lost reservation still expires the session through Stripe | PASS | PASS |
| Open session kept; expired unpaid session released | PASS | PASS |

Every F-Q4-001 test asserts the provider object counts, the operation count and identities, and that no `expired_unpaid` operation lacks a recorded session.

**Poison controls** (`mutation_controls.txt`): nine mutations of the repaired file, each caught. Each control refuses to run if its anchor is not unique or the file is unchanged.

| Control | Mutation |
|---|---|
| M1 | Candidate file |
| M2 | No resume on a different key |
| M3 | Expiry recomputed |
| M4 | Missing reference treated as unpaid |
| M5 | Stale replay not re-read |
| M6 | Resume regardless of revision |
| M7 | Earlier attempt not expired before release |
| M8 | Customer not carried |
| M9 | No fresh expiry after a validation rejection |

### SCRATCH layer — real SQL, modelled provider (`scratch_checkout_recovery.json`)

`helpers/scratch-checkout-recovery.cjs` runs the repaired modules (from the tested copy, same bytes as the checkout) against SCRATCH `ihgcsrypblqkwommrkgj`:
- real tables, the 0057 unique indexes and `npi_reserve` / `npi_bind` / `npi_release_unpaid`;
- one transaction, always rolled back;
- synthetic `example.test` drafts and NPIs;
- no Auth table access, no network (`fetch` blocked, 0 calls).

0 engineering rows remained after rollback.

| Scenario | Repair | Candidate control |
|---|---|---|
| Lost session answer, different key | PASS: 1 customer, 1 session, 1 operation `checkout_open`, reservation `checkout_bound` to it | FAIL: 2 customers (QA's result reproduced) |
| Same key, 9 s later | PASS | FAIL: refused for changed parameters |
| Draft edited, different key | PASS: earlier `expired_unpaid` with its session recorded and expired; new `checkout_open` at revision 2 with the same customer; reservation bound to the new operation | FAIL: earlier operation marked unpaid with no session recorded |
| No recorded session, `proveUnpaidAndRelease` | PASS: `kept` | FAIL: `released` |

The control ran the same harness with the candidate `checkout.ts` swapped into the copy, then restored it byte for byte (`scratch_checkout_candidate_control.json`). Inside one transaction `created_at` is constant, so operations are ordered by `draft_revision`; an earlier ordering by ID was corrected before these runs.

## 4. Validation and tested-byte provenance

`provenance.json`: for both files, the candidate blob and the SHA-256 in the QA checkout, the tested copy (`ARCHIVE/APBM007A_E2_WORK/r04/pp`) and the build copy (`r04/build-pp`). All equal. There is no proof-only source difference this round.

| Check | Result |
|---|---|
| Full unit suite, tested copy | 444 of 444, 22 suites (429 + 15) |
| Full unit suite, QA checkout after transfer | 444 of 444 |
| Focused recovery suite, QA checkout | 15 of 15 (`focused_tests.json`) |
| Candidate control | 9 of 15 fail on `4cd96c8` (`candidate_control_tests.json`) |
| Typecheck | clean |
| Lint | 0 errors; 24 warnings, the same as the candidate; none in the changed files |
| Production build | pass, Next.js 16.4.3, BUILD_ID `IpvtWyXeUrtmKwYZLjxZq` (`build_pp.log`); placeholder Supabase values and canary server secrets only |
| Client bundle scan | 0 canary values, 0 server-only names, no `api.stripe.com`, `idempotencyKey` or `checkout_operations` in client code (`bundle_scan.txt`) |

Repair diff: `product.patch` (SHA-256 `ea8c60acc9eded4a5c86d36ab42d3aa439458e339ef8e8586df8032a4383e9c7`).

## 5. Effects

| Target | Effect |
|---|---|
| Stripe | None. No live object or mutation |
| SCRATCH | Two rolled-back transactions (repair run and candidate control); 0 rows left; no Auth access; sequence increments, if any, not restored by PostgreSQL |
| DEV | None. QA's reserved new DEV identity untouched |
| Auth, email, Checkout purchase, payment | None |
| Local | No server started. QA's servers on 3000 and 3001, the Stripe listener and the server on 3457 untouched |
| Git | None. Nothing staged or committed |

## 6. QA work preserved

**Inventory** (16 November 2026, 11:47 Asia/Dhaka):
- OwedBook: 3,422 uncommitted QA paths, all under `QAM/` (248 MB).
- Payment Portal: no change except the ignored QA output `test-results/transition-matrix.json`.

No QA file changed in the 20 minutes before writing, and `QAM_STATE.md` reads "Q4_REVIEW_a03 return; no further effects until direction". No QA automation process was running.

**Private backup:** `~/APBM007A_QA_BACKUPS/q4_r04_20261116_114741/` (mode 700).
- A full byte copy, with `SHA256SUMS.before`: 3,423 entries, SHA-256 `e019f6bd0bd9da7eca463a01b8b751cb7cb24e7dfeb2281ec6649fcdadde2562`.
- Env files, cast and inbox files, auth state and browser profiles were not copied or hashed.

The after-work verification is in `qa_preservation.json`.

## 7. Remaining limitations

| ID | Limitation |
|---|---|
| L1 | No live provider run (out of bounds). Stripe's idempotency semantics (replay with identical parameters, refusal of changed parameters, no saved result for a validation rejection, in-flight conflict) are modelled from its documented behaviour, not observed live |
| L2 | Stripe keeps idempotency keys for at least 24 hours. A retry of an unknown-outcome attempt later than that could create a second session (and, if the customer answer had also been lost, a second customer) under the same operation. The lost session was never shown to the buyer, so it cannot have been paid |
| L3 | If the customer answer was lost and the draft's email or name is then edited, the earlier attempt cannot be settled until its key expires: the retry is refused (`provider_unavailable`) without duplicating or releasing anything (tested) |
| L4 | An unknown-outcome attempt is never released by `proveUnpaidAndRelease`; it is resumed by its own draft. Its unbound NPI hold still expires by the existing 30-minute rule in `npi_reserve` (unchanged) |
| L5 | Pre-existing, unchanged: a **same**-key retry after the draft was edited resumes the earlier operation for the earlier revision. Not part of F-Q4-001; reported for Lead disposition |
| L6 | The SCRATCH integration suite `apbm007a-scratch.itest.ts` was not rerun: it creates SCRATCH Auth identities and the ceiling is reached. The rolled-back SCRATCH harness covers the repaired path without identities |
| L7 | The operator command does not attach a lost session to a `created` operation; recovery is by the buyer's retry (either key) |

## 8. Retest impact for independent QA

| Area | Required |
|---|---|
| Build identity | After Tony's commits, the portal must be rebuilt and restarted on the repaired candidate before Friday binds the pair; QA's fresh install, typecheck, lint, unit and build at the new product commit |
| F-Q4-001 / AC-011 | QA's `checkout-timeout` and same-key runs against the new candidate. QA's provider adapter must compare parameters on a repeated key, as Stripe does, to measure the same-key path faithfully |
| Affected behaviour | Double submit, a different key against an operation with a recorded session, expired quote, consent, reservation-lost, abandon or edit after checkout, and expiry release through provisioning or webhook |
| Regression | The plan's required regression. Only `checkout.ts` changed; `registration.ts`, `provisioning.ts`, `webhook.ts`, `billing.ts`, the registration UI and every OwedBook file are byte-unchanged from `4cd96c8` / `f637ba4` |
| Held live journeys | Purchases, the new-owner journey, paid billing and the Director session remain as Friday holds them, released only after binding |

Not claimed: any acceptance result, Gate Q, or closure of F-Q4-001. Tony commits; Friday binds the pair and owns independent retest and certification. No deployment before 007B.
