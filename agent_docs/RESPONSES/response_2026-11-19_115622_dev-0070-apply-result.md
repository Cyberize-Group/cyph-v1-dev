# DEV migration 0070 — apply result (APBM-007B)

**Result: APPLIED · ALL PRESCRIBED CHECKS PASS · DEV ready for the manual walkthrough.**
Director release 2026-11-19 (target DEV `yrsuwikjnbmvpznrgydb` only; `main` @ `64295a7` accepted; clean-tree waiver for records only).
Sheet: Portal `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/DEV_APPLY_0070/DEV_APPLY_0070_RELEASE.md`, manifest SHA-256 `134d815d95b0c63d4e60ba604e30fa8e4d2c29ce1e1954f09401c9c2d749d8f2`.
Evidence lane: OwedBook `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-0070/`.

## Pre-apply record (waived files, preserved unchanged)

| Path | SHA-256 |
|---|---|
| `RECOVERY.md` | `4f050cea243f9b0afbb55d2fc6198e195a451de1b0279073228838e8aca42a75` |
| `agent_docs/SESSIONS/session_2026-11-19.md` (pre-apply snapshot; appended after) | `04ef309151df724db92e2c04d6c61113a2937c337a73f09bf8d597281a80ab5c` |
| `agent_docs/RESPONSES/response_2026-11-19_112946_recovery-refresh-plan.md` | `9818f2bf2a8cd71a03be8df1d302b1b78a3ed78a25bf21e942bc3110587c3ad0` |
| `agent_docs/RESPONSES/response_2026-11-19_114015_dev-0070-preflight.md` | `1de531578b9a15b4b0552b9cf7dff067e63b91cc0bdc5378d5aa5cfa802ae8fa` |
| `…/EVIDENCE/apply/dev-preflight-0070/catalog.json` | `05d14b61631b9ab99a704c58849f9846b3f828005ca8ae1b70a672561d34914a` |
| `…/EVIDENCE/apply/dev-preflight-0070/guard-preflight.json` | `97dd81ab9b29125106f299810ef67d5738a547b98ad2c2c164bf66265877e06c` |

No change since preflight: HEAD `64295a7`; only tracked change `RECOVERY.md`; nothing under `supabase/`, `scripts/`, `src/`, `e2e/`, package files, `next.config.js`; 0070 and manifest hashes unchanged; `.env.local` last modified 2026-11-17; Portal sheet folder clean; no app process running. Re-verified after apply: all six hashes unchanged.

## Results

| Step | Result |
|---|---|
| 1 Target + catalogue | DEV ref, read-only on, catalogue `4a1c1719…35b5bf` = r05, 34/14/99 — PASS |
| 2 Guard preflight | inventory = manifest, 70 files, read-only on, ledger 69, unchanged prefix, last 0069; preservation = r05 post — PASS |
| 3 Apply | `Committed 0070_007b_consent_deadline_paid_time.sql`; receipt `forward-apply-1795067652247.json`, status **PASS**, committed `["0070_007b_consent_deadline_paid_time.sql"]`, 05:54:05Z → 05:54:12Z |
| 4 Ledger / after-catalogue | ledger **70 = manifest** (last row 0070, `de0b51c6…edce81`); catalogue `21c2e80d7c71ffdf0758f2cbb99c435eb407960c3cca91022519cab27ddfdee1` (34 tables / 14 policies / 101 functions, +2 = the two new 0070 functions) — PASS |
| 5 Guard post | ledger 70, unchanged prefix, last 0070; deployment identity `["yrsuwikjnbmvpznrgydb"]`; test ref constant true; enabled test contexts 0; billing_now real time; no table without RLS; no new-table anon/authenticated grant; no unpinned SECURITY DEFINER; 007A compat functions all 1; businesses without identity 0; **every preservation_equal true** (incl. `audit_logs`); **DEV test-clock enable refused 42501** — PASS. `ledger_69_equals_manifest` false by design (ignored per sheet) |
| 6 Compatibility (rolled back) | members 11, scope equal 11, no scope diffs, owedbook_rows 14 ok, owedbook_summary 14 ok, owner_billing_overview 7 ok, access states active 6 / past_due_reminder 1 — **identical to r05** |
| 7 SCRATCH reference | SCRATCH ledger 70 = manifest; catalogue `38b8a8de…ef84a6` (34/14/101); **differing sections: none** |

## Failed or incomplete

None. One non-failure: step 5 printed a `pg` DeprecationWarning (concurrent `client.query` in the guard's `Promise.all`); output and exit 0 unaffected.

## Walkthrough readiness

DEV is at 70, so the sheet §0 rule is met. OwedBook `main` `64295a7` and Portal `main` `0443fda` (= `origin/main`, clean) both carry 007B code. From here on, app use against DEV adds `audit_logs` rows (expected).

## Effects

DEV: one committed transaction (0070 + its ledger row). Steps 1, 2, 4, 5 and 7 read-only; step 5 probe and step 6 rolled back. No reset, data correction, source edit, Git mutation, server start, Stripe/mail effect or deployment. No credential printed.
