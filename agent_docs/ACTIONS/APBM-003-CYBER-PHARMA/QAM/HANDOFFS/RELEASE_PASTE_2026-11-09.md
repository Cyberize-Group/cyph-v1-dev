# Paste-ready text for the Q2 release (Tony, 2026-11-09)

## A. Append to `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md`, section §C (replace "(none yet)" if present)

| ID | Erratum | Authority | Date | Effect |
|---|---|---|---|---|
| C-01 | `E2_AMENDMENT_A01.md` (rulings A01-1…A01-7 and its exact file list) is **in force** as the grading text for AC-104, AC-302, AC-403 and AC-502, and resolves the `<<E1>>` placeholders in the spec, OAC and SFC through the QA plan's derivation artifacts (QAM_APPROVAL AM-1). The §D "DRAFT / NOT IN FORCE" label is superseded. | Director (Tony); recorded on QA Lead request (recon R-2) | 2026-11-09 | QA grades against A01; no FINAL stamp is manufactured retroactively |
| C-02 | AC-401's "restore … rehearsal on disposable target demonstrated" clause is **accepted as a limitation, not met**: the DEV APPLY receipt records `restoreVerified: false` (synthetic application rehearsal; SCRATCH lacks four `auth.users` indexes). QA grades AC-401's other clauses and records the restore clause as ACCEPTED LIMITATION. Carried to the Phase 8 production package. | Director (Tony); recon R-6 | 2026-11-09 | AC-401 cannot PASS in full; it is not FAIL |

## B. Append to `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md` transition log (two rows, newest last)

| 2026-11-09 · Asia/Dhaka | QA Lead (Friday) | `Q1 AMENDED — AWAITING QA LEAD BINDING` → `APPROVED — NOT RELEASED` | plan `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` bound to candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1` | `QAM_APPROVAL.md` §1–§2 |
| 2026-11-09 · Asia/Dhaka | Director (Tony) | `APPROVED — NOT RELEASED` → `RELEASED FOR Q2` | same identities; SCRATCH destructive authorized; SCRATCH signup posture UNKNOWN → AC-404 SCRATCH half BLOCKED | `QAM_APPROVAL.md` §3; `APBM_RULINGS.md` C-01, C-02 |

Also update the "Current state" table in `QAM_STATE.md`: Phase = `RELEASED FOR Q2`; Plan identity = `194538a7…cfea4`; Approval record = `QAM_APPROVAL.md` §1–§2 (Friday); Release reference = `QAM_APPROVAL.md` §3 (Tony, 2026-11-09); Next owner = QA Executor (Claudy); Next permitted action = run the bound plan from T-00.
