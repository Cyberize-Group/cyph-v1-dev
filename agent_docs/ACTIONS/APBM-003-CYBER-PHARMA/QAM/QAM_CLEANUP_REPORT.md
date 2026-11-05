# QAM_CLEANUP_REPORT — `APBM-003-CYBER-PHARMA` (required closure operation)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owners: QA Lead records the cleanup point (§0), retention decisions (§3 Decision column) and acceptance (§4); the QA Executor (Claudy) executes under that authority and records §1, §2 and the Executed?/Evidence columns.** Cleanup is a closure operation, not another campaign. Sequence: product verdict (`QAM_CERTIFICATION.md` §1–§3) → this cleanup → acceptance (§4) + durable records committed → release to closeout.

## 0. Authority (QA Lead)
| Field | Value |
|---|---|
| Product verdict issued (ref to certificate §1) | NOT RECORDED |
| Cleanup point approved by / at | NOT RECORDED |
| Applicable policy | QAM_PLAYBOOK §14; QA_PLAYBOOK §14 (Final Environment Reset Rule); RRM_PLAYBOOK §10 as adopted; Director-protected `RECOVERY.md` / `agent_docs/SESSIONS/**` fence |
| Director-reported items (e.g. QA password rotation, QC-5) — recorded as reported | NOT RECORDED |

## 1. Routine phase-exit hygiene (Executor)
| Item | Q1 exit | Q2 exit | Q4 exit | Evidence |
|---|---|---|---|---|
| Owned browsers closed | NOT RECORDED | NOT RECORDED | NOT RECORDED | |
| Owned QA servers / processes stopped | NOT RECORDED | NOT RECORDED | NOT RECORDED | |
| Declared transient auth state removed | NOT RECORDED | NOT RECORDED | NOT RECORDED | |

## 2. Credential and auth-state cleanup (Executor; record the actual order)
| Step | Action | Result | Evidence |
|---|---|---|---|
| 1 | Value scan of retained outputs **while `.env.qa.local` still exists** (scanner validated with fixture + control) | NOT RUN | |
| 2 | Resolve / quarantine actual leaks (safe counts/locations only) | NOT RUN | |
| 3 | Delete `.env.qa.local` and owned auth state under the declared authority | NOT RUN | |
| 4 | Verify removal (already absent = verified absent) | NOT RUN | |
| 5 | Pattern-scan retained outputs and the final export | NOT RUN | |

Never preserve credential values or their hashes. After deletion, do not claim a new value scan.

## 3. Retention (QA Lead decides; Executor executes)
| Item | Decision (KEEP / REMOVE / QUARANTINE) | Reason | Executed? | Evidence |
|---|---|---|---|---|
| Durable evidence package sufficient for certification, reproduction, audit | NOT RECORDED | | | |
| Failed attempts | NOT RECORDED | | | |
| Useful helpers under `AUTOMATION/` (Playwright matrix, direct-read probes, comparator attacks) | NOT RECORDED | | | |
| Disposable debris (builds, deps, caches, raw traces, browser profiles, Playwright browsers in the QA lane) | NOT RECORDED | | | |
| SCRATCH project state after QA (left seeded / reset — Director decides) | NOT RECORDED | | | |
| Unrelated processes / editor recovery files | not touched | | | |
| Protected `RECOVERY.md` / `agent_docs/SESSIONS/**` | not touched | | | |

## 4. Final state and acceptance
| Field | Value | Owner |
|---|---|---|
| Product / tests / contract unchanged during cleanup (diff) | NOT RECORDED | Executor |
| Working tree after cleanup | NOT RECORDED | Executor |
| Cleanup **accepted** (date, QA Lead) | NOT RECORDED | QA Lead |
| Durable records committed (Director; SHA) | NOT RECORDED | Director |
| Released to Architect closeout (certificate §4) | NOT RECORDED | QA Lead |
