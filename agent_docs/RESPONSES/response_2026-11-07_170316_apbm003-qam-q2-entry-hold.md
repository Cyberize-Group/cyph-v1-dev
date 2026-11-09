# APBM-003 QAM Q2 — entry check: release not on disk, Q2 not started (Claudy, 2026-11-07 17:03 +06)

**Passed:** plan SHA-256 `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` matches the file; HEAD `051344c8` differs from candidate `308247a` only under `agent_docs/` (product content identical); `.env.qa.local` PASS (21/21 keys, 0600, ignored, untracked).

**Not on disk (QAM_STATE §15 comparison):**
| Prerequisite | Where expected | Found |
|---|---|---|
| Lead binding: amended plan hash | `QAM_APPROVAL.md` §2 "Plan identity" | NOT RECORDED |
| Director release statement, records commit, credential file by key names, source | `QAM_APPROVAL.md` §3 (4 rows) | NOT RECORDED |
| State `APPROVED — NOT RELEASED` → `RELEASED FOR Q2` | `QAM_STATE.md` | absent (latest: `Q1 AMENDED — AWAITING QA LEAD BINDING`) |
| §C errata R-2 (A01 in force) and R-6 (AC-401 limitation) — release condition 3 | `APBM_RULINGS.md` §C | "(none yet)" |
| R-10 confirmation and AM-6 SCRATCH signup posture — release condition 2 | §3 release statement | absent |

Commit `051344c` "bind plan 194538a7, Director Q2 release" contains the QA-lane files but no §2/§3 rows. `QAM_ENTRY.md` dispatch: without §3, "Do not start Q2"; `QAM_APPROVAL.md`: "an empty decision means no approval exists". SCRATCH destruction and DEV logins were therefore not begun. No test ran; nothing touched on any target, `:3137`, product or Git.

**To release (then Q2 runs in one campaign):** Lead writes the §2 plan-identity row; Director writes the four §3 rows (release statement naming R-10 confirmation and SCRATCH signup ON/OFF; credential keys by name), appends the §C errata, records `RELEASED FOR Q2` in `QAM_STATE.md`, commits. Evidence: `QAM/evidence/identity/02/q2_entry_check.txt`.
