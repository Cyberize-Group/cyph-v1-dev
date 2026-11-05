# QAM_TEST_PLAN — `APBM-003-CYBER-PHARMA`

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: QA Executor (Claudy) drafts independently in Q1; the QA Lead amends and approves.** The approval is recorded in `QAM_APPROVAL.md` so this plan's hash is not self-referential. Plan edits never modify the frozen contract.

| Field | Value |
|---|---|
| Plan status | `DRAFT (Q1)` → `AMENDED PER QA LEAD` → `BOUND` |
| Drafted by / at | Claudy / NOT RECORDED |
| Inputs | contract + rulings; `QAM_RISK_REQUIREMENTS.md` (QAM-SR v1.0 + §2 MR-1..MR-15); source; `QAM_RECON_REPORT.md`; Cody's claims |
| Candidate the plan binds to | NOT RECORDED |
| Target / environment identity | SCRATCH ref / DEV ref / STAGING revision — NOT RECORDED |
| Amendment record | §8 |

## 1. Scope and applicability (every AC-101 … AC-903 has a row)
| AC | In scope | Test ID(s) | If not testable: ruling needed from |
|---|---|---|---|
| NOT RECORDED | | | |

## 2. Tests (risk / dependency order)
| Test ID | AC(s) | Objective | Independently derived expected result (source) | Procedure (command · working dir / steps) | Negative control | Evidence to capture | Depends on | Human check? |
|---|---|---|---|---|---|---|---|---|
| T-01 | | | | | | | | |

## 3. Required board and regression scope
| Suite / check | Command (working dir) | Why required | Evidence |
|---|---|---|---|
| build / tsc / lint / full Jest suite | | | `evidence/board/` |
| `rls:prove` (certified matrix + E1 expected-change list) · `audit:prove` · `db-verify` | | | `evidence/regression/` |

## 4. Browser / API / data coverage matrix
| Role | Route / workflow | Data / filter state | Viewport | Theme | Checks | Test ID |
|---|---|---|---|---|---|---|
| NOT RECORDED | | | | | | |

Reductions and why: NOT RECORDED. Sign-in strategy per SR-5. Actual sign-in counts recorded.

## 5. Stop conditions for execution
QAM_PLAYBOOK §11 `STOP-*` table applies. Module-specific triggers: any evidence of a real (non-synthetic) record on any target (`STOP-PRIVACY`); undeclared DEV effects beyond bounded session/audited read probes (`STOP-AUTHORITY`); at Gate D only: candidate ≠ deployed revision (`STOP-IDENTITY`); no deployed revision required for Gate Q.

## 6. Cannot yet be tested
| AC / area | Reason | Enabler | Owner |
|---|---|---|---|
| NOT RECORDED | | | |

## 7. Conditional Q4 retest scope (only if a repair is ruled)
| Repair ruling ID | Repair diff (paths) | Affected ACs | Full required regression | Carried-forward evidence (SHA / attempt) | Live validation reserved for the final candidate |
|---|---|---|---|---|---|
| NOT RECORDED | | | | | |

## 8. Amendments (QA Lead)
| # | Exact edit (before → after) | Supplied by / date | Applied by / date | Material? |
|---|---|---|---|---|
| none | | | | |
