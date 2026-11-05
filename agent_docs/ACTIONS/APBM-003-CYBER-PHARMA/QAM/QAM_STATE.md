# QAM_STATE — `APBM-003-CYBER-PHARMA`

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: Architect creates; each seat appends dated entries for its own transitions.** A small index into authoritative records; references authority, never grants it. Not a dispatcher.

## State vocabulary

`READY FOR ENGINEERING` → `ENGINEERING COMPLETE — AWAITING QA BRANCH` → `READY FOR RECON` → `Q1 COMPLETE — AWAITING QA LEAD REVIEW` → (`Q1 AMENDMENTS REQUESTED` → `Q1 AMENDED — AWAITING QA LEAD BINDING`) | `HOLD` → `APPROVED — NOT RELEASED` → `RELEASED FOR Q2` → `Q2 COMPLETE — AWAITING ADJUDICATION` → (conditional: `REPAIR RULED — AWAITING COMMIT` → `RETEST SCOPE APPROVED — NOT RELEASED` → `RELEASED FOR Q4` → `Q4 COMPLETE — AWAITING ADJUDICATION`) → `VERDICT ISSUED — CLEANUP PENDING` → `CLEANUP EXECUTED — AWAITING ACCEPTANCE` → `CLEANUP ACCEPTED — RELEASED TO CLOSEOUT` → `CLOSED`. `STOPPED (STOP-*)` may interrupt any phase.

## Current state (latest entry wins)

| Field | Value |
|---|---|
| Phase | `READY FOR ENGINEERING` (set at packaging; `READY FOR RECON` is recorded by the Director only after the engineering handoff **and** `qa/apbm-003-cyber-pharma` exists at the completed candidate) |
| Attempt | Q1 0 / Q2 0 / Q4 0 |
| Engineering branch / QA branch | `apbm-003-cyber-pharma` / `qa/apbm-003-cyber-pharma` (NOT RECORDED until the Director creates it) |
| Baseline | NOT RECORDED (expected short `5234abe`; full SHA from E1) |
| Candidate (tested product SHA) | `PENDING` |
| QA execution HEAD | NOT RECORDED |
| Evidence / closeout commit | NOT RECORDED |
| Contract identity | `../APBM_ACCEPTANCE_SPEC.md` DRAFT; FINAL hash NOT RECORDED |
| Plan identity (SHA-256 of bound `QAM_TEST_PLAN.md`) | NOT RECORDED |
| Approval record | NOT RECORDED |
| Release reference (Director) | NOT RECORDED |
| Latest package | NOT RECORDED |
| Latest package SHA-256 (external receipt) | NOT RECORDED |
| Active stop | none |
| Next owner | Engineer (Cody) |
| Next permitted action | Cody: E1, then E2 per `../APBM_ENTRY.md`; complete manifest + handoff at E2 completion |

Rule before any resumed instruction (§15): compare prerequisites to disk and identities above; a completed cleanup or test is reported, not rerun; unknown state is reported with the exact discrepancy.

## Package snapshots

The `QAM_STATE.md` inside a review ZIP is the immutable pre-export snapshot; the ZIP's SHA-256 lives only in the external receipt (`HANDOFFS/README.md`) and the subsequent live entry here. Never rebuild a ZIP to embed its own hash.

## Transition log (append-only; newest last)

| Date / time | Seat | From → To | Identity touched | Record / receipt |
|---|---|---|---|---|
| 2026-11-05 · Asia/Dhaka | Architect (Friday) | — → `READY FOR ENGINEERING` | baseline NOT RECORDED | QAM instantiated from template set v0.3 (QAM_PLAYBOOK v1.0) |
