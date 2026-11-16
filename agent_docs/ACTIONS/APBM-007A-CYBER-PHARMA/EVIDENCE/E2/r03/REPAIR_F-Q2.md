# F-Q2-001 and F-Q2-002 — engineering repair r03

| Field | Value |
|---|---|
| Seat | Engineering repair seat (Claude), on `qa/apbm-007a` in both checkouts |
| Authority | JARVIS consolidated Q2 repair (16 November 2026) and its completion instruction; Director approval of temporary production servers on 3100/3101 in disposable copies |
| Source verdict | Friday (QA Lead) adjudicated Q2 a01 **FAIL**, as relayed by JARVIS. The adjudication text is not yet in the repository: `QAM/QAM_STATE.md` still reads "awaiting Lead adjudication". This record changes no QA finding, result, approval or certificate, and engineering checks close nothing |
| Findings | F-Q2-001 (registration cannot reach review; AC-007, AC-009, AC-034 and dependent purchase proofs). F-Q2-002 (undo with both cancellation fields set; RA-4 / AC-030). No other product change |
| Reviewed bases | Payment Portal `9d938f62bff6172f9332ae6c67775e4b8feea379`; OwedBook `37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40`. OwedBook product unchanged |
| Branch rule | QAM_PLAYBOOK §11 and RRM_PLAYBOOK §§7 and 9: repairs are made on the QA line. Engineering's 16 November messages asking for a switch to `apbm-007a` followed the r02 practice and are superseded; no branch was switched |
| Schema | No change. Migrations untouched |

## 1. F-Q2-001 — confirmed cause

QA's candidate explanation (STOP-002) is confirmed. `src/components/portal/register/PharmacyStepView.tsx` at `9d938f6`:

1. On a first registration no server draft exists, so `useRegistrationDraft` loads `draft = null` when the pharmacy page mounts. The owner details exist only in the tab's session store (`registrationSession`).
2. The page derives `owner = session.owner ?? ownerFromDraft(draft)`, and an effect calls `router.replace('/register/owner')` whenever that owner is invalid.
3. After a successful save the page called `registrationSession.clearForms()` and then `router.push('/register/review')`. Clearing the store re-rendered the page while it was still mounted. Its owner was now an empty session plus the stale `null` draft, so the guard fired `router.replace('/register/owner')`.
4. The App Router applies the most recent navigation, so the browser went back to the owner step. The server draft stayed saved (owner, pharmacy and NPI), review never mounted and no quote was requested (`quote_total_cents` NULL). This matches both QA attempts exactly.
5. The r01 unit test mocked the router and asserted only that `push('/register/review')` was called, so it passed while the browser ended on the owner step.

A returning draft did not show the defect, because the stale draft was already complete. Production versus development: the code path is the same in both modes. No development-mode comparison was run, because the instruction requires a production build.

### Same-pattern inspection of other transitions

| Transition | Finding |
|---|---|
| Owner step (`OwnerView.tsx`) | Saves to the session and pushes to pharmacy. It clears nothing and has no guard that reads state it has just cleared. Not affected |
| Review (`ReviewView.tsx`) | Mounts after navigation and fetches its own draft; `draftIsComplete` reads that fresh draft. Its redirect to the owner step for an incomplete or missing draft is correct and is kept. Not affected |
| Activation (`ActivationView.tsx`) | Clears forms only when the server reports the draft `complete`; no guard depends on the cleared state. Not affected |
| Draft hook (`useRegistrationDraft.ts`) | Correct by itself; it exposes `setDraft`, which the pharmacy step now uses. Unchanged |

## 2. F-Q2-001 — repair

`PharmacyStepView.tsx` (+11 −3):
- **State synchronization.** On a successful save, the page adopts the server's answer as its current draft (`setDraft(result.value)`) before it clears the temporary form input.
- **Navigation.** A `saved` ref is set at the same moment. The owner-guard effect returns early once set, so a completed save cannot start a competing navigation.

Unchanged:
- The owner guard for every unsaved state.
- Review's completeness redirect.
- Server validation (`saveDraft`, `requestQuote` completeness check).
- The draft cookie isolation.
- The NPI reservation.
- The three explicit consents, all unticked on arrival.

Either change alone passes every test (poison controls M2, M3). Both are kept: the first repairs the stale state, the second makes the leaving page inert.

### Regression that reproduces the transition

`src/__tests__/portal-registration-journey.test.tsx` (new, 8 tests, 271 lines). It mounts the real owner, pharmacy and review pages behind a small working router that behaves like the App Router in the two ways that matter:
- a navigation lands asynchronously, so the requesting page stays mounted and keeps running effects;
- a later navigation replaces one that has not landed yet.

A stateful fake serves the draft and quote endpoints. Each test asserts the page the journey ends on and what it shows, not which router methods were called.

| Test | Old candidate | Repair |
|---|---|---|
| Owner, then pharmacy, lands on review with the server quote and stays there | FAIL: ends on `/register/owner` | PASS |
| Saved details survive a refresh of review; the current quote is reused | FAIL | PASS |
| Edit pharmacy from review, change, return: new value, revision 2, new quote; edit owner, Back, return: revision 3 | FAIL | PASS |
| Review with no saved draft goes to the owner step | PASS | PASS |
| Pharmacy step with no owner details goes to the owner step | PASS | PASS |
| Owner typed but never saved: hand-typed review URL goes back to owner | PASS | PASS |
| Save refused by the server (`npi_unavailable`): stays on pharmacy, keeps input, nothing saved | PASS | PASS |
| Saved draft without a pharmacy does not open review | PASS | PASS |

`portal-owner.test.tsx`: the existing save test also asserts that no `replace` follows the save (FAIL on the old candidate, PASS on the repair).

## 3. F-Q2-002 — cause and repair

**Cause.** `undoCancellation` in `src/server/billing.ts` at `9d938f6` built one patch: `cancel_at_period_end=false` if the flag was set, otherwise `cancel_at=''`. With both set, only the flag was cleared. The date stayed set and the call ended `provider_unavailable`, matching QA's `billing-independent.json`.

**Repair** (`billing.ts`, one function, +23 −16):
1. Retrieve the subscription. Keep the existing refusals: an ended subscription → `expired`; another customer's subscription → `provider_unavailable`.
2. If the flag is set, update `cancel_at_period_end=false`, then retrieve again.
3. If `cancel_at` is still set, update `cancel_at=''`, then retrieve again.
4. Mirror the subscription. Return success only if the last read shows both fields clear on the same subscription; otherwise raise `provider_unavailable`.

Properties:
- The two parameters are never sent in one call.
- If Stripe clears the date together with the flag, no second update is sent.
- Each update uses a fresh random idempotency key (`undo:<subscription>:<uuid>`), so the cached-key replay found on 13 November cannot recur.
- A failure part-way is reported, and a retry reads the real state and finishes only what remains.

Unchanged:
- Owner-only authority (`owner_billing_overview`).
- The route's same-origin check, rate limit and sign-in requirement.
- Refusal of synthetic subscriptions.

**Tests** (`apbm007a-server.test.ts`, +9). They use a mutable provider fake that changes stored state on update and refuses an update carrying both parameters:
- both set, provider keeps the date (two updates, three reads plus the mirror's read, distinct keys);
- both set, provider clears the date with the flag (one update);
- flag only, date only and already clear (exact updates; ends clear);
- failure after the flag is cleared, then retry (date cleared with a new key);
- failure on the first update, then retry;
- date still set after both updates (no success; mirror still runs);
- ended or other-customer subscription refused before any update.

The earlier undo tests are unchanged and pass.

## 4. Changed product paths (Payment Portal)

| Path | Change |
|---|---|
| `src/components/portal/register/PharmacyStepView.tsx` | F-Q2-001 state adoption and saved guard |
| `src/server/billing.ts` | F-Q2-002 sequential undo |
| `src/__tests__/portal-registration-journey.test.tsx` | New journey regression (8) |
| `src/__tests__/apbm007a-server.test.ts` | Undo regressions (+9) |
| `src/__tests__/portal-owner.test.tsx` | Save test asserts no return to the owner step |

Full diff: `product.patch` (SHA-256 `7dd89a125981a8f5cc93ae455097572ab24332f353344b49bff5b2006aefdc00`).

## 5. Validation and provenance

The repair was built and tested in the disposable copy `ARCHIVE/APBM007A_E2_WORK/r03/pp`, then transferred. `provenance.json` records, for each of the five files, the candidate blob and SHA-256 in the QA checkout, the tested copy and the proof-build copy. All three are equal.

| Check | Result |
|---|---|
| Full unit suite, tested copy | 429 of 429, 21 suites (412 at r02 + 17) |
| Full unit suite, QA checkout after transfer | 429 of 429 |
| Focused suites, QA checkout | 69 of 69 (`focused_tests.json`) |
| Typecheck | clean |
| Lint | 0 errors; 24 warnings, the same count as the candidate (the `set-state-in-effect` warning in `PharmacyStepView` is on a candidate line) |
| Production build (proof copy) | pass, Next.js 16.4.3, BUILD_ID `5PHBDZwHVyF0Ahf3kcXjj` (`build_proof_pp.log`) |
| Client bundle scan | 0 secret values, 0 forbidden names (`bundle_scan.json`) |
| Poison controls | M1 and M4–M9 caught; M2 and M3 are equivalent fixes, as expected; files restored byte for byte (`mutation_controls.txt`) |

**Proof-build provenance.** The proof copy equals the tested copy except `src/lib/appIdentity.ts`, whose frozen local origin table points at 3100/3101 (`proof_harness.patch`). QA's servers hold 3000/3001 and same-origin checks compare the request origin with that table. This line is harness-only and is in no commit. The build ran after the last source edit (source 09:43:26, build 09:45:16, Asia/Dhaka). `next start` printed its standard warning that an `output: standalone` build is meant to run with `node .next/standalone/server.js`; it served every route used, and QA's own servers on 3000/3001 use the same `next start` command (`proof_server_3101.log`).

## 6. Production-browser proof (engineering, not independent)

`browser/walk.json` and four screenshots; helper `helpers/walk-registration.mjs`.

**Setup:**
- Server: `next start -p 3101` on the proof build.
- Browser: Playwright Chromium, fresh context (no cookies or storage), 1440×1000.
- Run: 16 November 2026, 03:46:14–03:46:42 UTC.
- Synthetic details: owner `eng.proof.r03@example.test`, synthetic pharmacy, generated check-digit-valid NPI `1373398746`. No QA inbox, cast or identity.
- Safety: the checkout endpoint and every Stripe host were blocked at the network layer and counted.

**Route sequence:** plan → owner → pharmacy → **review** → (refresh) **review** → pharmacy → **review** → owner → pharmacy → owner → pharmacy → **review**

| Point | Evidence |
|---|---|
| No prior draft | First three draft reads returned `draft: null` |
| First arrival | `/register/review`, heading "Review and pay", due today **$99.00**. Server quote revision 1: 9900 USD, no code, not expired |
| After refresh | Same page, same quote; no new quote requested |
| Edit pharmacy and return | Prefilled name and NPI; changed name shown; revision 2, new server quote $99.00 |
| Edit owner, Back, return | Owner prefilled, declaration still ticked; Back kept input; revision 3, new server quote $99.00 |
| Stop | On review; 0 consents ticked; payment button never pressed; 0 checkout requests attempted; 0 console errors |

Each arrival held review for 3 s before the screenshot. No in-browser reproduction against the old candidate was run, because it would spend another draft. The failure is reproduced by QA's two attempts and by the regression test (§2).

## 7. Effects (accurate ledger)

| Target | Effect |
|---|---|
| DEV database | 1 synthetic registration draft through the normal API (3 saves, so revisions 1–3; 3 quote writes) and 1 NPI reservation for `1373398746`. Left in place as an abandoned draft; not deleted (no unsolicited cleanup) |
| DEV Auth | 0 identities, 0 sessions, 0 emails. The approved brand-new DEV identity stays reserved for QA |
| Stripe | 0 mutations, 0 Checkout sessions, 0 payments. A quote without a code makes no Stripe call; the NPI reservation reads Stripe only when another operation blocks the NPI, so no read was expected. Reads were not separately counted |
| Local | Temporary production server on 3101 (disposable proof copy), started and stopped by Engineering. QA's servers on 3000, 3001 and 3457, QA's `.next` folders and env files untouched |
| Git | None. Nothing staged, committed, stashed or switched |

## 8. QA work preserved

**Inventory** (16 November 2026, 10:06 Asia/Dhaka):
- OwedBook: 5,011 uncommitted QA paths, all under `QAM/`:
  - 180 records, reports, evidence, helpers and ZIPs;
  - 3,130 files in the disposable build mirrors `AUTOMATION/a02/build-owedbook|build-portal`;
  - 1,701 files in the npm cache `AUTOMATION/a02/.npm`.
- Payment Portal: no tracked or untracked change; one ignored QA output, `test-results/transition-matrix.json`.

**Private backup** outside the repositories: `~/APBM007A_QA_BACKUPS/q2_r03_20261116_100605/` (mode 700).
- A byte copy of the 180 QA records and the portal output, and a hard-link snapshot of the 4,831 regenerable mirror and cache files. Free disk was 345 MB against 611 MB, so a byte copy of the regenerable trees did not fit; a hard link protects against deletion and renaming, not against in-place edits.
- `SHA256SUMS.before`: 5,012 entries, SHA-256 `15ad0e3f813cc9b0cb4f95d1e41045368d64a6b7859aeae81df1b2e65ef46404`. Both copies verified against it.
- Env files, the QA cast file, auth state and browser profiles were not copied or hashed.

**Running QA helpers.** `Q2-a01/new-owner.cjs` (PID 2035625) and `new-owner-retry.cjs` (PID 2036628) are children of Cody's Codex app-server, sleeping since 15 November, with no TCP socket in their process trees. They were not stopped. They cannot see this repair: QA's portal server runs QA's own build, and these source edits do not change a running `next start`.

The after-work check against the manifest is recorded in `qa_preservation.json`.

## 9. Erratum (Amendment A1 evidence-impact wording)

Friday's B2 ruling (`QAM/QAM_APPROVAL.md`) and JARVIS's instruction:
- "by Q1" in the A1 evidence-impact column means "by independent QA in Q2"; this also covers "fresh independent Q1 evidence" in A1-1.
- Under B3, independent SQL and fixture proofs are SCRATCH-only; DEV gets only application-mediated effects in the capsule.

Recorded as erratum E-A1-1 under Amendment A1 in `APBM_RULINGS.md` and in `AMENDMENT_LEDGER.md`. The original wording is preserved, and the Director-approved deferrals (A1-2 G2, A1-3 reminder email, CARRY_FORWARD_007B O-1 and O-2) are unchanged.

## 10. Remaining limitations

| ID | Limitation |
|---|---|
| L1 | Live sandbox verification of the undo is NOT RUN (reserved for independent QA). Whether both fields can be set together in the live hosted-portal flow, and whether Stripe clears the date with the flag, are not proved live; both branches are handled and unit-tested |
| L2 | The browser proof is engineering evidence: one Chromium run at 1440×1000, light theme, on a proof build with a harness-only origin. Not independent; other browsers, viewports and themes NOT RUN |
| L3 | OwedBook was not started; the pre-payment walk does not reach it. Purchase, provisioning, access email and handoff after payment stay with QA's new-owner journey |
| L4 | The DEV draft and NPI hold from the proof remain until their normal expiry or a Director disposition; they could make the synthetic NPI `1373398746` unavailable to another draft meanwhile |
| L5 | A partial undo failure leaves the flag cleared and the date set until the owner retries; the existing generic error copy is shown (no new UI copy in scope) |
| L6 | Development-mode behaviour was not compared (production build required) |
| L7 | The pre-existing lint warning `set-state-in-effect` in `PharmacyStepView` (candidate line) is left as it was (no unrelated cleanup) |

## 11. Retest impact for independent QA

The product commit changes the portal, so QA rebinds the pair after Tony's commits and reruns:

| Area | Required |
|---|---|
| Portal build baseline | Fresh install, typecheck, lint, unit and production build at the new product commit from a QA-controlled build |
| F-Q2-001 / AC-007, AC-009, AC-034 | Public registration from a fresh context: owner, pharmacy, review with the current server quote; refresh; edit, back and return; incomplete-registration and deep-link negatives; consent gating |
| Dependent journeys | The new-owner purchase blocked by F-Q2-001 (AC-013, AC-016, AC-018 and the provisioning and paid-billing proofs) with the reserved DEV identity under QA's capsule |
| F-Q2-002 / RA-4, AC-030 | Undo from flag-only, date-only, both-set (if reachable) and already-clear states on the same subscription, re-read live in the sandbox; partial-failure behaviour by QA's independent unit adapter |
| Regression | The plan's required regression. `webhook.ts`, `checkout.ts`, `operator.ts` and every OwedBook file are byte-unchanged from `9d938f6` / `37f6c0d`, so carrying their evidence forward is QA's call with provenance; `billing.ts` also holds the portal-session and payment-method functions (unchanged lines) |

Not claimed: any acceptance result, Gate Q, or closure of F-Q2-001 or F-Q2-002. Tony commits; Cody binds the new pair and retests under Friday's authority. No deployment before 007B.
