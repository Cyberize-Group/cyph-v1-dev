# QAM_MANIFEST — `APBM-003-CYBER-PHARMA` (Engineer's factual completion record)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: Engineer (Cody)**, written as part of E2 and **before the Director commits**. Facts and labeled **CLAIMs** only. No test plan, no Q1 finding, no Q2 result, no QA Lead decision, no certification.

**Engineer (seat, runtime):** Cody / NOT RECORDED · **Recorded at:** NOT RECORDED · **Working directory for every command below:** NOT RECORDED

## 1. Identity (facts)

| Field | Value |
|---|---|
| Baseline (full SHA) | NOT RECORDED |
| Implementation identity | `PENDING` — the candidate does not exist until the Director commits; after the commit Q1 resolves it from the receipt and reconciles against §2. Factual amendments after handoff go in §8, dated. No documentation commit is made just to embed its own SHA |
| Engineering branch | `apbm-003-cyber-pharma` |
| Intended QA branch | `qa/apbm-003-cyber-pharma` — Director creates it at the completed candidate, after this handoff |
| HEAD at handoff | NOT RECORDED |

## 2. Complete change inventory at handoff (facts; before the Director commits)

| Part | Command (working dir) | Output stored at | Count |
|---|---|---|---|
| 2.1 Committed since baseline | `git diff --name-status <BASELINE>..HEAD` (+ `git log --oneline <BASELINE>..HEAD`) | NOT RECORDED | |
| 2.2 Staged, not committed | `git diff --cached --name-status` | NOT RECORDED | |
| 2.3 Unstaged modifications | `git diff --name-status` | NOT RECORDED | |
| 2.4 Untracked files | `git ls-files --others --exclude-standard` | NOT RECORDED | |
| 2.5 Whole tree snapshot | `git status --porcelain` | NOT RECORDED | — |

Consolidated inventory (one row per path across 2.1–2.4):

| Path | Where | Status (A/M/D) | What changed | Authorized by (AC / ruling / stage) |
|---|---|---|---|---|
| NOT RECORDED | | | | |

Paths outside the authorized scope: NOT RECORDED. Paths expected to stay uncommitted: NOT RECORDED.

## 3. Claimed behavior and self-verification (CLAIMs) — one row per AC (AC-101 … AC-903)

| Claim | Self-verification command (working dir) | Engineer result | Evidence link | AC(s) |
|---|---|---|---|---|
| NOT RECORDED | | CLAIM: | | |

## 4. Reproduction (exact commands)

| Step | Command | Working directory |
|---|---|---|
| Install | NOT RECORDED | |
| Build | NOT RECORDED | |
| Serve | NOT RECORDED | |
| From-scratch replay on SCRATCH | NOT RECORDED | |
| Seed reset + run | NOT RECORDED | |
| `rls:prove` / `audit:prove` / `db-verify` | NOT RECORDED | |
| Tests / board | NOT RECORDED | |
| Deploy (the authorized workflow) | NOT RECORDED | |

## 5. Environment the QA body needs (facts; no secret values)

| Item | Value |
|---|---|
| Targets | SCRATCH (ref) / DEV (ref) / STAGING (URL, revision) — NOT RECORDED |
| Services and prerequisites | NOT RECORDED |
| Migrations / fixtures / seed state | NOT RECORDED |
| Roles and identities (handles only) | OWNER1, OWNER3, ADMIN_B2, ADMIN_B3, MEMBER_B1, MEMBER_B2B3, UNRELATED (+OPERATOR if authorized) |
| Credentials needed (key names only) | per `QAM_ENTRY.md` §4 — Director creates `.env.qa.local`; values never written here |
| Ports / resources | NOT RECORDED |
| Runtime and tool versions used | NOT RECORDED |

## 6. Known limitations, unresolved issues, preserved paths, rollback

| Item | Detail |
|---|---|
| Known limitations | NOT RECORDED |
| Unresolved issues | NOT RECORDED |
| Preserved / untouched paths relevant to QA | migrations 0001–0047; auth path; historical module folders — confirm |
| Rollback dependencies | DEV backup record `../EVIDENCE/apply/03_BACKUP_RECORD.md` |
| Not done by engineering | NOT RECORDED |

## 7. Meaning of each engineering evidence item (CLAIMs)

| Evidence path | What it shows (CLAIM) | How QA re-derives it |
|---|---|---|
| NOT RECORDED | | |

## 8. Factual amendments after handoff (dated; Engineer only)

| Date | Owner | Field amended | Old → new | Reason |
|---|---|---|---|---|
| | | | | |
