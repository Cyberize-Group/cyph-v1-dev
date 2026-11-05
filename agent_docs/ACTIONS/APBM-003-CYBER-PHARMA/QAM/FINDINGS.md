# FINDINGS — `APBM-003-CYBER-PHARMA`

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owners: §1 QA Executor (Claudy) records and proposes; §2 QA Lead dispositions; §3 conditional repair routing — Executor proposes, QA Lead classifies, Architect (JARVIS) rules scope, Engineer (Cody) repairs on the QA branch, Director commits, Executor re-pins and retests.** A proposal is never a work order.

## 1. Findings (QA Executor)
| ID | Phase / attempt | AC(s) | Observation | Expected (independently derived) | Reproduction (exact, working dir) | Evidence | Proposed class | Proposed severity | Blocks other checks? |
|---|---|---|---|---|---|---|---|---|---|
| F-01 | | | | | | | | | |

Class vocabulary (§11): acceptance failure · regression · environment/setup issue · instrument issue · contract gap · proven pre-existing defect · follow-up finding · enhancement · observation. "While I'm here" items are recorded as **observation**, unranked, never widened into scope.

## 2. Dispositions (QA Lead only)
| Finding | Class (final) | Severity (final) | Disposition | Inherited-condition evidence | Affects verdict? | Routed to |
|---|---|---|---|---|---|---|
| F-01 | NOT RECORDED | | NOT RECORDED | | | |

Inherited conditions require evidence; never charged to this module nor waived if release-blocking without the governing disposition. Risk acceptance follows Director authority and is recorded in `QAM_CERTIFICATION.md`.

## 3. Conditional repair routing (only when §2 dispositions a genuine product defect)

### 3.1 Repair proposal (Executor draft; a proposal, not a work order)
| Finding(s) | AC(s) | Evidence | Suggested allowed-file list | Suggested retest scope | Contract question, if any |
|---|---|---|---|---|---|
| NOT RECORDED | | | | | |

### 3.2 Chain of authority (each step dated and seated) — findings are consolidated into **one** repair assignment where practical
| Step | Seat | Record | Date |
|---|---|---|---|
| Disposition: product defect | QA Lead | §2 row | NOT RECORDED |
| Consolidated repair instruction (exact allowed/forbidden paths, required checks) | JARVIS | `../APBM_RULINGS.md` §C row | NOT RECORDED |
| Writer transfer QA → Engineering recorded | Claudy → Cody | `HANDOFFS/QA_HANDOFF.md` | NOT RECORDED |
| Repair on `qa/apbm-003-cyber-pharma`, approved paths only; self-verification; `QAM_MANIFEST.md` §8 amended — state `REPAIR RULED — AWAITING COMMIT` (nobody retests) | Cody | commit(s) `PENDING` | NOT RECORDED |
| Commit of the repair | Director | receipt | NOT RECORDED |
| Writer transfer Engineering → QA recorded | Cody → Claudy | `HANDOFFS/QA_HANDOFF.md` | NOT RECORDED |
| Retest-scope approval (plan §7 bound in `QAM_APPROVAL.md` §4) | QA Lead | | NOT RECORDED |
| Q4 release | Director | `QAM_APPROVAL.md` §4 | NOT RECORDED |
| Re-pin; Q4 (repair diff + affected ACs + full required regression) | Claudy | `QAM_EXECUTION_REPORT.md` (Q4), new package | NOT RECORDED |
| Re-adjudication | QA Lead | §2 appended rows | NOT RECORDED |

Repairs stay on the QA branch; nothing goes back to the engineering branch; all prior attempts preserved under `evidence/`.
