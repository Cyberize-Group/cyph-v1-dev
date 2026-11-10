# QAM_RECON_REPORT — `APBM-003-CYBER-PHARMA` (Q1, attempt 01)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: QA Executor (Claudy).** Independent Q1 observations, contradictions and readiness. Q1 produces no verdict. A successful login during recon does not satisfy the later acceptance walk.

**Executor:** Claudy (Claude Code, Fable 5.1) · **Start:** 2026-11-07 14:36 +06 · **End:** 2026-11-07 15:05 +06 · **Working directory:** `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` · **Preflight results:** `evidence/preflight/01/PREFLIGHT_RESULTS.txt`

## 0. Director sequencing exception (recorded, not inferred)

| Item | Record |
|---|---|
| Ruling (relayed by JARVIS, 2026-11-07 ~14:30 +06) | Independent QA begins **before** Tony's manual app smoke because Tony is unwell. The manual smoke is **DEFERRED — not waived, not PASS**. Findings from his later testing join one consolidated engineering rework. Final Director acceptance remains **PENDING**. |
| QAM gates bypassed by this ruling | `QAM_STATE.md` was never advanced past `READY FOR ENGINEERING`; no `ENGINEERING COMPLETE — AWAITING QA BRANCH` or `READY FOR RECON` entry exists; `QAM_MANIFEST.md` and `HANDOFFS/ENGINEERING_HANDOFF.md` are unfilled. The Director's ruling is the authority for starting Q1 now; it does not fill those records (see R-1). |
| Scope of this assignment | **QAM SHOT 1 ONLY** — recon and plan. No Q2 execution, browser runs, authenticated probes or application fixes. |
| Branch | `qa/apbm-003`, pre-created by the Director; disposable, never merged. Tony retains Git. |
| Embedded QAM located at | `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/` (canonical entry `QAM_ENTRY.md`; routing `QAM/CLAUDE.md` = `QAM/AGENTS.md`). Present and complete as a template set. |

## 1. Identity resolved independently
| Field | Value | Evidence |
|---|---|---|
| Repository / branch | `Cyberize-Group/cyph-v1-dev` / `qa/apbm-003` (note: QAM_ENTRY names `qa/apbm-003`; the template header of this file and `QA_HANDOFF.md` say `qa/apbm-003-cyber-pharma`; R-04 says `apbm-003-cyber-pharma`. The branch that exists is `apbm-003` / `qa/apbm-003`.) | `evidence/identity/01/branch.txt` |
| Full HEAD at recon | `308247a24e6ddd455842da5cd2e21541d7eae2c1` (committed 2026-11-07 13:53:25 +06) | `evidence/identity/01/head.txt` |
| Baseline | `af2c7e5225d2d78925fd392e29a58b6bde830263` (verified ancestor; 5 commits to HEAD) | `evidence/identity/01/log_baseline_to_head.txt` |
| Candidate (from the Director's release message, `READY_308247a.json`, `RUN_CONTEXT.json`) | `308247a24e6ddd455842da5cd2e21541d7eae2c1` — the commit the DEV APPLY runner was fenced to | `EVIDENCE/apply/dev-executor-v2/READY_308247a.json` |
| Candidate → HEAD classification (complete diff) | **empty** (candidate = HEAD) | `evidence/identity/01/candidate_to_head_diff.txt` |
| Candidate reconciled against the handoff inventory (manifest §2) | manifest §2 is empty → reconciled against Git: 410 paths changed since baseline, **57 outside `agent_docs/`**: 5 new migrations 0048–0052, 6 seed scripts, 3 new scripts, 15 harness files, 15 components/app files, 3 services, 3 types, 1 mocks file, 5 test files, `package.json` (scripts only). Every one of the 57 is inside the A01 exact allowlist + A02 two test files. **Unchanged:** lockfile, `next.config.*`, migrations 0001–0047, auth path (`src/proxy.ts`, `src/utils/supabase/**`, `src/app/api/auth/**`, `src/utils/app-role.ts`, `src/app/(auth)/**`). | `evidence/identity/01/baseline_to_candidate_name_status.txt`, `*_diff.txt` |
| Application source vs released commit (Director item) | **no differences**: no modified or untracked file outside `agent_docs/` | `evidence/identity/01/inherited_dirty_baseline_status.txt` |
| Tracked / untracked state (inherited dirty baseline) | **69 inherited paths at QA start, all under `agent_docs/`**: 3 tracked modified (`APBM_JOURNAL.md`, `APBM_STATE.md`, `PHASE_3_CAMPAIGN_JOURNAL.md`) + 66 untracked (`EVIDENCE/apply/**` ten directories incl. the final receipt dir `DEV_V2_20261107T080333Z_1347924/`, ten `RESPONSES/response_2026-11-06/07_*`). Preserved untouched; not cleaned, staged, stashed or committed. QA-generated paths are confined to `QAM/**` and `agent_docs/SESSIONS/session_2026-11-07.md` + this session's `RESPONSES/` file, and are listed separately. | `evidence/identity/01/inherited_dirty_baseline_status.txt`, `qa_generated_paths_status.txt` |

## 2. Contract, scope and governing versions as read
| Item | Identity read | Notes |
|---|---|---|
| Frozen spec + contracts | `APBM_ACCEPTANCE_SPEC.md` `1079516…`; OAC `f71a48b…`; SFC `3fbcd12…`; TRC `3d7fb15…`; SUCCESSION `07ef12e…`; A01 `b0a45a0…` (full hashes in `evidence/identity/01/contract_hashes_as_read.txt`). **Status DRAFT — CLAIM STATUS; no FINAL stamp.** 44 ACs (AC-101…AC-903). | SPEC/OAC/SFC/A01 hashes equal `EVIDENCE/E2/COMMITTED_CONTRACT_HASHES.json` at `01bd66d`. 18 `<<E1>>` placeholders remain. |
| Rulings in force | R-01…R-10 (§A); A02 (two test files), A03 (DEV = `yrsuwikjnbmvpznrgydb`; `cwdzijswchlwfvxxrlzb` excluded; SCRATCH = `ihgcsrypblqkwommrkgj`), A04/A05 (apply preparation), Stage-6 release on SCRATCH (2026-11-06T13:58Z), Director E2 release 2026-11-05T15:08Z (supersedes pre-coding FINAL stamp). §C errata: none. A01 marked "NOT IN FORCE" in §D yet approved by the Director release message and implemented → see R-2. | `APBM_RULINGS.md` hash `43dd527…` (differs from the `01bd66d` receipt because entries were appended; append-only respected). |
| Protected paths | per `QAM_ENTRY.md` §3 | conflict with repo protocol noted in R-7 |
| Governing bodies resolved? | by name yes; 3 without hash (QA_PLAYBOOK v1.1, template set v0.3, BIM-003 wrapper contract). Hub bodies not in this checkout. | `GOVERNING/README.md` |
| Engineer handoff completeness | **INCOMPLETE as a QAM record**: `QAM_MANIFEST.md` and `HANDOFFS/ENGINEERING_HANDOFF.md` are unfilled templates. The engineering claims exist elsewhere: `APBM_ACCEPTANCE_LEDGER.md` (one claim row per AC), `EVIDENCE/E2/stage-6/HANDOFF.md`, `EVIDENCE/E2/HANDOFF_SUMMARY.json`, `EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md`, the DEV receipt directory. | AC-901 → engineering evidence gap |

### 2a. DEV APPLY receipt — independently read (engineering evidence, not QA results)
| Claim | What the receipt actually says | QA reading |
|---|---|---|
| Ledger through 0052 | `dev-v2-final-1794039263719.json`: `ledgerEntries: 52`, `status: PASS`, `finishedAt 2026-11-07T08:14:23.719Z`, `projectRef yrsuwikjnbmvpznrgydb`, `bundleSHA256 8bdb753…` | consistent; QA re-reads the live ledger in Q2 (needs read-only SQL) |
| 250 synthetic claims | `seed-verify.json`: user_data 250, accounts 3, businesses 5, user_businesses 8, profiles/user_roles 7, independentArithmetic 250/0, identityFindings 0, contentSHA256 `f7f1270…` (= Stage-6 SCRATCH content hash) | consistent; arithmetic is the generator's own instrument → QA recomputes independently |
| 19 Owner + 154 authenticated checks PASS | `owner-proof.json` 19 named checks, auditDelta 4; `authenticated-reads.json` 154/154 PASS | engineering instruments; QA designs its own |
| Existing data and Auth indexes preserved | `preservation`: 30 tables, additive only (auth.users 5 preserved + 7 added, profiles/user_roles same), `authIndexesUnchanged: true` | consistent |
| Restore rehearsal | `rehearsal.kind: SYNTHETIC_APPLICATION_REHEARSAL_NOT_DEV_RESTORE`, `restoreVerified: false`, reused from 2026-11-06 | **AC-401 "restore … demonstrated" is not met literally** — declared by engineering, Director accepted; QA records it as an accepted limitation, not a PASS |
| Signup disabled | `signup.disabled: true` at 08:13:48Z via GET settings; earlier `DEV_SIGNUP_CHECKPOINT.json` 07:43Z showed `disableSignup: false` (BLOCKED) | setting changed between 07:43Z and 08:00Z by the Director; QA re-reads in Q2; no DA-2 evidence for SCRATCH |
| Declared DEV effects | probes: 8 login/logout sessions, 52 audited read rows; `sharedDevWritesAttempted: true` for probes phase (the declared bounded effects) | consistent with AC-403 (A01 revision) |
| Managed ACL exception | `retainedManagedEntries: 3`, `conditionalACLAcceptanceSatisfied: true` | JARVIS-accepted deviation from the 0047 fingerprint; QA grades AC-405 against this ruling, not the draft text |

### 2b. Frontend target (Director item 4)
Built standalone bundle: **7 files reference Dev v1 `yrsuwikjnbmvpznrgydb`, 0 reference SCRATCH `ihgcsrypblqkwommrkgj`**; `.next/BUILD_ID` = `dev-manual-smoke/BUILD.json` buildId; server listening `127.0.0.1:3137`, `/auth` 200, `/moose-portal` 404; `.env.local` `NEXT_PUBLIC_SUPABASE_URL` and `APBM_DEV_SUPABASE_URL` both resolve to Dev v1 (refs only read). Stale SCRATCH build reported by Cody at 08:17Z was already replaced. **Stale configuration still present:** `RLS_REPLICA_*` SCRATCH keys remain in `.env.local` (harness use; not read by the app in real mode) and `APBM_DEV_DB_URL` appears twice. The running server is Cody's process; Q2 rebuilds and serves under QA control before any browser test. Evidence `evidence/preflight/01/frontend_target_check.txt`.

## 3. Readiness results (summary of `QAM_PREFLIGHT.md`)
| Section | Rows | Passed | Failed / GAP / BLOCKED | Partial | Not run (Q2) / N/A | Blocking Q1? |
|---|---|---|---|---|---|---|
| 1 Repo/identity | 8 | 6 | 2 (PF-1.3 inherited dirt; PF-1.5 GAP) | 0 | 0 | no |
| 2 Contract/handoff | 6 | 1 | 3 (PF-2.1, 2.2, 2.5) | 2 | 0 | no (grading-basis decision for Q2) |
| 3 Runtime/tools | 6 | 4 | 0 | 1 | 1 | no |
| 4 Targets/credentials | 7 | 0 | 2 (PF-4.1 BLOCKED, PF-4.6) | 3 | 2 | **Q2 blocker** |
| 5 Browser/instruments | 4 | 1 | 0 | 1 | 2 | no |
| 6 Packaging/recovery | 2 | 2 | 0 | 0 | 0 | no |

## 4. Unresolved details, contradictions and challenged claims
| # | Type | Detail | Sources in conflict | Owner | Exact resolution needed | Blocks |
|---|---|---|---|---|---|---|
| R-1 | GAP (engineering evidence) | `QAM_MANIFEST.md` / `ENGINEERING_HANDOFF.md` unfilled; `QAM_STATE.md` never advanced; `APBM_STATE.md` says `E1 COMPLETE` in its table while dated entries say `APPLY COMPLETE` | QAM §7 duties vs. actual records | Cody (then Director commit) | Cody fills manifest §1–§7 and handoff from existing evidence (claims only); AC-901 graded FAIL until then | Q2 grading of AC-901/903 only |
| R-2 | CONTRACT | A01 is labelled "DRAFT / NOT IN FORCE" in `APBM_RULINGS.md` §D and in every contract overlay, yet the Director release (2026-11-05T15:08Z) approved "corrected A01 scope/exact allowlist" and the product implements it (AC-104/302/403/502 behave per A01). No FINAL stamp exists. | `APBM_RULINGS.md` §D vs. `APBM_STATE.md` release entry | JARVIS / Director | one §C erratum row stating: A01-1…A01-7 + exact file list are the grading text for AC-104, 302, 403, 502 (and the 18 `<<E1>>` values below) | **Q2 grading basis** |
| R-3 | CONTRACT | 18 `<<E1>>` placeholders remain in SPEC/OAC/SFC. Engineering supplies the values in `EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md` (17 tables / 15 policies / 19 functions / 14 triggers; 7 users / 3 accounts / 5 stores / 8 junctions / 50 claims per store; 285 seed audit events; per-operation UI dispatch counts 3/1/3/3; baseline board 36 suites/178 tests). QA cannot grade literal counts against engineering's own numbers without a ruling. | SPEC `<<E1>>` vs. engineering plan | QA Lead + JARVIS | accept the plan's **§2 "Independently derived expected result" column** as the grading reference for Q2, or record the numbers as a §C erratum | **Q2 grading basis** |
| R-4 | ENV / AUTHORITY | No `.env.qa.local`. SCRATCH only under `RLS_REPLICA_*`, DEV under `APBM_DEV_*`, cast credentials only in `/tmp/apbm003-dev-v2-cast-20261107T080333Z-1347924.json` (0600, exists). SR-5 forbids reusing engineering prefixes / `NEXT_PUBLIC_*`. QAM §4 also lists **no DEV SQL key**, yet AC-402/404/405 and PF-4.2 need catalog reads. | QAM §4 key list vs. AC-4xx needs | Director | create `.env.qa.local` with `QA_SCRATCH_*`, `QA_DEV_SUPABASE_URL`, `QA_DEV_PUBLISHABLE_KEY`, **plus `QA_DEV_DB_URL` (read-only use declared)** and `QA_<HANDLE>_EMAIL/PASSWORD` for the seven handles; or rule that QA may read the existing 0600 cast file by path | **Q2 release** |
| R-5 | SCOPE (truthful display) | `DemoMarker.tsx` renders "Demo · mock data" in admin headers and `BillingScreen.tsx` says "Visual only — no real charge is made in this demo" **in real mode on DEV**. Both are outside the A01 allowlist; Cody's copy-only amendment is unapproved; both unchanged since baseline. The TRC §2 limitations list promises "synthetic data" labelling, so this is a real-data-truthfulness defect, not cosmetic. | A01 allowlist vs. AC-601/602/902 truthful states | Director (scope) → JARVIS (§C) | approve the two-file copy amendment now so it joins the consolidated rework; QA will record it as finding regardless | no (recorded as pre-known finding) |
| R-6 | CONTRACT | AC-401 requires "restore … rehearsal on disposable target demonstrated"; receipt records `restoreVerified: false` (synthetic application rehearsal, not a DEV restore; SCRATCH lacks 4 `auth.users` indexes). Director accepted and executed APPLY anyway. | AC-401 text vs. receipt | Director / JARVIS | §C row: AC-401 restore clause accepted as limitation (or ruled N/A) | Q2 grading of AC-401 |
| R-7 | PROTOCOL | QAM §3 lists `RECOVERY.md` and `agent_docs/SESSIONS/**` as paths **never written by any QA seat**; the repository protocol (`CLAUDE.local.md`) **requires** a session log and `RECOVERY.md` update each session. Resolution applied in Q1: session log + `RESPONSES/` written (the QAM's own packaging rule indexes "repo-required response/session records"); **`RECOVERY.md` not written** and left stale (last 2026-10-22). | QAM §3 vs. `CLAUDE.local.md` | Architect (Friday) | one line in `QAM_ENTRY.md` §3 or a ruling on which protocol governs these two records | no |
| R-8 | IDENTITY (naming) | Branch names: R-04 `apbm-003-cyber-pharma`; QAM_ENTRY `qa/apbm-003`; recon/handoff templates `qa/apbm-003-cyber-pharma`; actual `apbm-003` / `qa/apbm-003`. | R-04 vs. actual | Architect | record actual names as the identity; no rename | no |
| R-9 | EVIDENCE | PF-2.6 named files (`01_TARGET_IDENTITY.txt`, `DA-2_…`, `03_BACKUP_RECORD.md`) do not exist; equivalents exist under `DEV_V2_…/`. No DA-2 evidence for SCRATCH at all. | QAM preflight rows vs. evidence layout | Architect / Director | accept the receipt directory as the APPLY evidence root; state SCRATCH signup posture | no |
| R-10 | SIDE EFFECT (SCRATCH) | SCRATCH currently holds the Stage-6 fixtures and the rehearsal state. QA's from-scratch replay and seed reset (AC-101/201) destroy them. Repo evidence of Stage 6 is complete; the SCRATCH database state itself is not evidence. | engineering's live SCRATCH state vs. destructive QA | Director | confirm destructive QA on `ihgcsrypblqkwommrkgj` is released at Q2 (QAM §3 already permits it) | Q2 release |
| R-11 | DA-2 probe | PF-4.7 asks for "an independent signup attempt in Q2 (expect rejection)". If the setting were wrong, the attempt would **create an auth user on shared DEV** — a write the Director forbade. | PF-4.7 vs. Director boundaries | Director | QA default: **read-only** `GET /auth/v1/settings` only on DEV; live signup attempt only on SCRATCH, and only if ruled | Q2 |
| R-12 | SEAT | QA Lead seat holder is not recorded anywhere; `QAM_APPROVAL.md` §1 (plan decision) and §3 (Director release) are empty. The assignment says "JARVIS/Tony approval". | QAM §3 seats vs. assignment | JARVIS / Director | QA Lead identity recorded with the §1 decision; Director release in §3 | **Q2 release** |

Engineer claims challenged (claim → observed → consequence for the plan):
- "Existing data and Auth indexes preserved" → receipt counts only (30 tables additive, 4 indexes). → QA adds an independent read-only fingerprint comparison of the 5 pre-existing `auth.users` ids / `profiles` / `user_roles` rows against the receipt (counts and hashes only, no row export) — T-30.
- "154 authenticated checks PASS" → the instrument is engineering's (`dev-verify.mjs authenticatedReads`) and shares code with the product's `env.mjs`. → QA writes its own matrix probe under `AUTOMATION/` with a deliberate wrong-expectation attack (SR-8) — T-17/T-33.
- "34 browser checks PASS" → run at **1440×1000, one theme, 4 of 7 identities, on SCRATCH with a development server**; phone viewport 390 for OWNER3 only; no keyboard, no dark theme, no OWNER1/ADMIN_B3/MEMBER_B2B3, no forced-fetch-failure in browser, no hard-refresh auth walk. → full matrix in plan §4.
- "KPI failures never become zeros" → component tests only. → browser-level fault injection (route abort on `owedbook_kpis`) on DEV — T-35.
- "Scope is request-local; stale responses rejected" → unit tests. → browser rapid store switch with network throttling and response-order inversion — T-33c.
- "Independent arithmetic 250/0" → performed by `scripts/seed/verify.mjs`, the seed's own sibling. → QA recomputes the seven money rules from raw wrapper rows + reference tables with its own SQL/JS (T-15), on SCRATCH (full 250) and DEV (read-only via wrappers, sample).

## 5. Stops raised in Q1
| Stop ID | Phase / time | Identity | Affected checks | Evidence | Owner | Required resolution | Safe resume point |
|---|---|---|---|---|---|---|---|
| none | | | | | | | |

No STOP is raised: the Director's explicit sequencing ruling covers starting Q1 without the QAM state transitions, and every other contradiction is a Q2-release condition, listed in §4.

## 6. What cannot yet be tested, and why
| AC / area | Reason | What would enable it | Owner |
|---|---|---|---|
| AC-701, AC-702, AC-703 (STAGING / Gate D) | no deployment exists; Gate D follows Gate Q and a separate staging approval | certified candidate deployed; `EVIDENCE/deploy/` approval | Director |
| AC-506 STAGING half (`/moose-portal` 404 on the deployed service) | same | same | Director |
| AC-401 restore demonstration | receipt records `restoreVerified: false`; SCRATCH cannot host the 4 auth indexes | R-6 ruling or a disposable target with owner privileges | Director / JARVIS |
| AC-404 DA-2 on SCRATCH | no SCRATCH signup evidence | R-11 ruling | Director |
| §10 Director eyes-on walk (CRV) and Tony's manual smoke | **DEFERRED by the Director — not waived, not PASS**; counted as human check H-1/H-2 in plan §2 and §4 | Tony recovers; results join the consolidated rework | Director |
| AC-901/902/903 full PASS | manifest/handoff/TRC §2 unfilled; `APBM_STATE.md` is not `E2 COMPLETE — AWAITING QA BRANCH` | Cody completes records; Director commits | Cody / Director |

## 7. Readiness statement and decision requested
Readiness for Q2 planning approval: **READY FOR PLAN REVIEW**. Candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1` is resolved, identical to HEAD, with migrations 0001–0047, the auth path and the lockfile byte-identical to baseline and every product change inside the A01+A02 allowlist. The DEV receipt is internally consistent and is treated as engineering evidence only. Q2 cannot start until R-4 (credential file incl. read-only DEV SQL), R-2/R-3 (grading basis), R-12 (QA Lead decision + Director release) are recorded; R-10/R-11 need a one-line Director confirmation.

Decision requested from the QA Lead: review `QAM_TEST_PLAN.md` (draft; SHA-256 in `HANDOFFS/README.md` receipt) and `HANDOFFS/APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip`; **approve, approve with exact amendments, or hold.** Then the Director records the Q2 release in `QAM_APPROVAL.md` §3 and creates `.env.qa.local`.
