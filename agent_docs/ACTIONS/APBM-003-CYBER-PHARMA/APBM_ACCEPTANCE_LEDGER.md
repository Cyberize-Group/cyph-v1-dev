# APBM_ACCEPTANCE_LEDGER — APBM-003-CYBER-PHARMA

**Owner:** Cody maintains engineering claims; the independent dispositions column links `QAM/AC_EVIDENCE_MATRIX.md` and `QAM/FINDINGS.md` and is never filled by Engineering. One row per AC in `APBM_ACCEPTANCE_SPEC.md`. Rows are created at E2; nothing is prefilled.

| AC | Engineering claim (CLAIM; stage; evidence path) | Independent QA status (link to matrix row) | QA Lead disposition (link) |
|---|---|---|---|
| AC-101 … AC-903 | NOT RECORDED | NOT RECORDED | NOT RECORDED |


## 2026-11-05T15:56:21.628148+00:00 — stages 1–5 engineering claims

Director release supersedes the draft pre-coding FINAL gate. Counts/names are implementation evidence in EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; no contract stamp or independent QA certification asserted.

| AC | Engineering claim | Independent QA | QA Lead |
|---|---|---|---|
| AC-101 | CLAIM PASS (SCRATCH): 52-file replay, protected 0001–0047, ledger/no-op/partial-failure recovery; stage-5/rls and stage-5/recovery. | NOT RUN by Claudy | NOT RECORDED |
| AC-102 | CLAIM PASS (SCRATCH): owner helper/union and real no-account/no-junction negative; stage-3/NO_ACCOUNT_NO_JUNCTION.json, stage-5/audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-103 | CLAIM PASS (SCRATCH): 15 exact policies, one per operation, owner reach; stage-5/rls and catalog-approved.json. | NOT RUN by Claudy | NOT RECORDED |
| AC-104 | CLAIM PASS (SCRATCH): owner/admin/member account/subscription mutation denial without RETURNING; trusted unchanged-state proof; stage-5/audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-105 | CLAIM PASS (SCRATCH): exact trigger body and malicious metadata role produces member; stage-2/trigger-proof.json. DEV pending. | NOT RUN by Claudy | NOT RECORDED |
| AC-106 | CLAIM PASS (SCRATCH): duplicate admin INSERT and UPDATE rejected; stage-5/audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-107 | CLAIM PASS (SCRATCH/source): no new policy uses platform roles; only 0049 touches user_roles; protected platform/auth code unchanged. | NOT RUN by Claudy | NOT RECORDED |
| AC-201 | CLAIM PASS (SCRATCH): identical canonical reseed hashes with new Auth UUIDs; comparator poison detected; stage-5/reseed and audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-202 | CLAIM PASS (SCRATCH/local): all stored seeded columns scanned, clean control and synthetic patient-field poison; stage-5/audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-203 | CLAIM PASS (SCRATCH): seven named customers/no Operator, explicit roles/profiles, 3 accounts/5 stores/8 junctions; seed receipts. Non-seed Auth users preserved. | NOT RUN by Claudy | NOT RECORDED |
| AC-204 | CLAIM PASS engineering instrument (SCRATCH): independent SQL 0/250 money failures, all chip/sign coverage, 3 PBMs+unmatched; generator five poisoned controls. Independent Claudy arithmetic pending. | NOT RUN by Claudy | NOT RECORDED |
| AC-205 | CLAIM PARTIAL: synthetic A1 mock generated, decimal money audit 0/50. Six legacy fixture-test failures require two-file scope amendment; stage-5/local-board. | NOT RUN by Claudy | NOT RECORDED |
| AC-206 | CLAIM PASS source: scripts/seed/README.md and deterministic generator construction/reset boundary. | NOT RUN by Claudy | NOT RECORDED |
| AC-207 | CLAIM PASS (SCRATCH): each seed 285 service_role/NULL-actor events, reset never deletes/truncates audit rows; seed/reset receipts. | NOT RUN by Claudy | NOT RECORDED |
| AC-301 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-302 | CLAIM PASS (SCRATCH): direct SELECT 42501, all customer claim writes denied, seven legacy cells flipped with trusted unchanged-state checks; stage-5/rls and audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-303 | CLAIM PASS (SCRATCH): OWNER3 reads B2/B3 by ownership, refuses A1; unrelated refuses A/B; stage-5/audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-304 | CLAIM PARTIAL: SQL RPC counts/retry/rollback verified independently. Actual stage-6 UI dispatch and DEV checks pending; IMPLEMENTED_OPERATION_PLAN.md. | NOT RUN by Claudy | NOT RECORDED |
| AC-305 | CLAIM PASS (SCRATCH): four named admin RPCs scoped/audited, member/unrelated denial; stage-5/audit-final. | NOT RUN by Claudy | NOT RECORDED |
| AC-401 | PENDING Director DEV APPLY prerequisites/receipt; no DEV operation performed. See EVIDENCE/E2/DEV_APPLY_HANDOFF.md. | NOT RUN by Claudy | NOT RECORDED |
| AC-402 | PENDING Director DEV APPLY prerequisites/receipt; no DEV operation performed. See EVIDENCE/E2/DEV_APPLY_HANDOFF.md. | NOT RUN by Claudy | NOT RECORDED |
| AC-403 | PENDING Director DEV APPLY prerequisites/receipt; no DEV operation performed. See EVIDENCE/E2/DEV_APPLY_HANDOFF.md. | NOT RUN by Claudy | NOT RECORDED |
| AC-404 | PENDING Director DEV APPLY prerequisites/receipt; no DEV operation performed. See EVIDENCE/E2/DEV_APPLY_HANDOFF.md. | NOT RUN by Claudy | NOT RECORDED |
| AC-405 | PENDING Director DEV APPLY prerequisites/receipt; no DEV operation performed. See EVIDENCE/E2/DEV_APPLY_HANDOFF.md. | NOT RUN by Claudy | NOT RECORDED |
| AC-501 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-502 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-503 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-504 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-505 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-506 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-507 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-601 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-602 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-603 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-701 | PENDING post-Gate-Q staging approval/deployment and separate Gate D. | NOT RUN by Claudy | NOT RECORDED |
| AC-702 | PENDING post-Gate-Q staging approval/deployment and separate Gate D. | NOT RUN by Claudy | NOT RECORDED |
| AC-703 | PENDING post-Gate-Q staging approval/deployment and separate Gate D. | NOT RUN by Claudy | NOT RECORDED |
| AC-801 | CLAIM engineering PASS: rls:prove and audit:prove from scratch, 320 cells, 28 attacks, 279 APBM checks; independent QA-controlled rerun pending. | NOT RUN by Claudy | NOT RECORDED |
| AC-802 | CLAIM PASS (SCRATCH): exact 15-policy AC7 and structural oracle; stage-5/audit-final/audit-8.log. | NOT RUN by Claudy | NOT RECORDED |
| AC-803 | BLOCKED current full suite: baseline 36/178 green; current 34 suites/172 tests pass, 2 suites/6 tests fail on changed fixtures. Tsc/lint green. Two-file allowlist amendment pending. | NOT RUN by Claudy | NOT RECORDED |
| AC-804 | CLAIM PASS: dependencies and lockfile unchanged; package scripts only. | NOT RUN by Claudy | NOT RECORDED |
| AC-901 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-902 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |
| AC-903 | PENDING stages 6–8 after Tony APPLY receipt; no completion claim. | NOT RUN by Claudy | NOT RECORDED |


## 2026-11-06 — A02 checkpoint correction

This entry supersedes the stage-5 stale-fixture local test blocker only. AC-205/502 fixture validation: PASS at this checkpoint (50 A1 mock rows, three synthetic PBMs plus unmatched claims, federal fields NULL and Federal rows empty; production seed counts unchanged). AC-803 local board: PASS, 36/36 suites and 178/178 tests, no skipped tests; build/typecheck/lint pass (33 lint warnings). AC-507 remains pending stage 6: current zero-KPI rejection fallback assertion remains enabled and passing, to be replaced when its UI implementation changes. Independent Gate Q and final acceptance remain pending. Evidence: EVIDENCE/E2/test-amendment-A02/.
