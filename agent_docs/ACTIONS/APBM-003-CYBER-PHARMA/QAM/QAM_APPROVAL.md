# QAM_APPROVAL — `APBM-003-CYBER-PHARMA` (QA Lead decisions and Director releases)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owners: §1, §2 and the QA Lead columns of §4 — QA Lead only; §3 and the Director columns of §4 — Director.** Transcription by the Executor only when expressly instructed, attributed. **An empty decision means no approval exists.**

## 1. QA Lead review of the Q1 package
| Field | Value |
|---|---|
| Q1 package reviewed (path, SHA-256, member count) | `QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip` (delivered copy `APBM-003-CYBER-PHARMA_Q1_REVIEW_01_20261107T145615.zip`) · SHA-256 `845de226ce1c3e8a608fa4a0649c3c4aa11c12b1eb09513b8ba66b3ed50770a9` · 65 members (64 indexed + `FILE_INDEX.json`) |
| Reviewed the actual package, not only the summary | YES. All 64 indexed member hashes re-verified against `FILE_INDEX.json`; plan hash `8bc53eba…ff8a9` re-verified; secret-pattern scan run by the Lead: 0 secret values (only the role name `service_role` inside grant catalog output). Files read in full: `REVIEW_START_HERE.md`, `QAM_RECON_REPORT.md`, `evidence/preflight/01/PREFLIGHT_RESULTS.txt`, `QAM_TEST_PLAN.md`; spot-checked `APBM_ACCEPTANCE_SPEC.md` (AC-302/304/401/403/405/601/602/902), `E2_AMENDMENT_A01.md`, `SEED_AND_FIXTURE_CONTRACT.md` §3, `IMPLEMENTED_OPERATION_PLAN.md`. |
| Decision | **APPROVED WITH EXACT AMENDMENTS** (AM-1 … AM-6 below). Q1b bookkeeping only; no third shot. |
| Blockers (if HOLD) | n/a |
| Exact amendments (if any) | see table below; Claudy applies verbatim, records in plan §8 with diff, re-binds (new SHA-256), sets `Q1 AMENDED — AWAITING QA LEAD BINDING` |
| Q1b bookkeeping | After amendments: Lead records the amended plan SHA-256 in §2 and sets `APPROVED — NOT RELEASED`. Director then completes §3. |
| Decision source (QA Lead seat holder, runtime, date, TZ) | **Friday** (QA Lead seat for this module; also Module Architect — hats recorded separately below) · claude.ai (Fable 5.1) · 2026-11-07 · Asia/Dhaka |
| Transcribed by (if applicable) | Director (Tony) copies this file into `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_APPROVAL.md`; attributed to Friday |

### Exact amendments (AM-1 … AM-6) — Claudy applies these edits to `QAM_TEST_PLAN.md` and nothing else

| # | Location | Exact edit (before → after) | Why |
|---|---|---|---|
| AM-1 | §"Independence rule used throughout", append a sentence | → add: "Every value marked **[QA-derived]** has a derivation artifact at `evidence/derivations/01/<value>.md` created **before** the test that grades it runs, citing the exact SQL/source file and lines counted. A derived value whose artifact is missing, or which was obtained by reading an engineering receipt, grades the affected AC `ADJUDICATE`, never `PASS`." | Makes recon R-3 acceptable without a numbers erratum: the grading reference is QA's derivation, provably. |
| AM-2 | T-37, expected-result cell | Remove the two bracketed clauses "[+1 `admin_stores(id)` if the detail screen calls it — verify from source before grading]" and "(derive from `AuditScreen.tsx` at Q2 entry)" → replace with: "all per-operation counts fixed in `evidence/derivations/01/ui_dispatch_counts.md` from the component source at `308247a` before T-33 starts; no count is set or changed after a DEV observation". Same artifact also backs T-20's UI-level numbers. | Expected values must be frozen before observation (SR-1, SR-9). |
| AM-3 | T-01, expected-result cell | "≥ 36 suites / 178 tests baseline (stage-6 baseline log) **and** = 39/196 or more, 0 skipped, 0 failed (count derived by listing `src/__tests__/**` files: 39)" → "suites = number of test files under `src/__tests__/**` at `308247a` (counted at Q2 entry, recorded in `evidence/derivations/01/board.md`); tests = Jest's reported total; **0 skipped, 0 failed**; record both numbers. Engineering's 39/196 and the 36/178 baseline are context, not the expected value." | Ambiguous expectation; engineering numbers were leaking into the expected cell. |
| AM-4 | T-32 procedure cell and §"Writes required" LOCAL row | "standalone server started by QA on `127.0.0.1:3137` after stopping Cody's process **only with Director consent** (otherwise port 3138)" → "QA serves on **`127.0.0.1:3138`**. Cody's `:3137` process is not stopped, signalled or inspected beyond `ss`. Any change to this requires a Director instruction recorded in `QAM_APPROVAL.md` §3." Update the LOCAL row and T-41 accordingly. | Handoff rule: do not disrupt Tony's running server; removes a judgement call from the executor. |
| AM-5 | §5 Stop conditions, append | → add: "`AUTOMATION/ro-sql.sh` asserts, before every DEV statement, that the connection's project ref resolves to `yrsuwikjnbmvpznrgydb` (SQL-side check, not env-label) and runs with `SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY` plus `BEGIN READ ONLY`; any assertion failure is `STOP-IDENTITY` (immediate). The SCRATCH shim asserts ref `ihgcsrypblqkwommrkgj` the same way before any destructive step. Both assertions are themselves attacked once (wrong ref → refusal) and the refusal logged under `evidence/identity/02/`." | Two-layer target fence for the one privileged DEV path QA holds (`QA_DEV_DB_URL`). |
| AM-6 | §1 row AC-404, and T-31 | AC-404 "DEV definition yes; DA-2 read-only only" → "DEV: definition + read-only `GET /auth/v1/settings` (T-31). SCRATCH: a live signup attempt (expect rejection) is permitted **only if** the Director's §3 release states SCRATCH signup is OFF; otherwise the SCRATCH half is `BLOCKED — owner Director`, never N/A." | Resolves recon R-11 in the plan text rather than leaving it to a chat ruling. |
| AM-7 | `QAM_PREFLIGHT.md` PF-3.6, PF-4.6; plan §5 | As drafted in `QAM/HANDOFFS/Q1b_AM-7_DRAFT.md`: (a) PF-3.6 named Director-run exemption for `QAM/AUTOMATION/make-qa-env.mjs` (Executor runs self-test only); (b) PF-4.6 = ignored and untracked by exit code via `check-qa-env.sh`, keys per `QAM_ENTRY.md` §4 plus `QA_DEV_DB_URL`, `QA_STAGING_URL` optional, undeclared key = FAIL; (c) STOP-ENV widened to match. **Name ruling:** `QAM_ENTRY.md` §4 names govern (`QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY`, `QA_DEV_SUPABASE_PUBLISHABLE_KEY`); the shorter forms in this file's earlier §2 text were a Lead transcription error and are corrected below. Approved by Friday 2026-11-07 16:45 +06 via Director relay; applied by Claudy 16:54. | Credentials come from existing authorized sources with no manual re-entry; preflight is not bypassed, it is amended. |

### QA Lead rulings on recon items in the Lead's lane
| Recon item | Ruling |
|---|---|
| R-3 (grading basis for 18 `<<E1>>` values) | The plan's **[QA-derived]** column is the grading reference for Q2, **conditional on AM-1 artifacts**. No numbers erratum is required from JARVIS for grading; R-2 (A01 in-force erratum) remains JARVIS/Director's and is still required before Q2 for AC-104/302/403/502. |
| R-5 (DemoMarker / BillingScreen copy) | Plan handling approved: T-38 records it as a pre-known finding against AC-601/602/902. Lead recommends the Director approve the two-file copy amendment now so it enters the consolidated rework; §7 anticipated retest scope stands. |
| R-6 (AC-401 restore clause) | Lead will grade AC-401 restore clause as **accepted limitation (not PASS)** once the Director/JARVIS §C row exists; absent that row at Q2, AC-401 = `ADJUDICATE`. |
| R-12 (seat holder) | QA Lead = **Friday**, recorded here. |
| Browser reductions (§4) | Accepted as stated: full viewport×theme for OWNER3, MEMBER_B1, UNRELATED (+ MEMBER_B2B3 at 375); desktop/one theme for OWNER1, ADMIN_B2, ADMIN_B3, because their scope predicate is covered for all seven identities at the SQL layer (T-17/T-19). |
| DEV declared effects | Accepted: ≤ 28 login/logout sessions, ≈ 150–250 `audit_logs.read_page` rows, auth session metadata; zero rows elsewhere (T-36 proves). Director confirms in §3. |

### Architect-hat rulings (Friday as Module Architect; recorded here for traceability, to be mirrored into `QAM_ENTRY.md` §3 / `APBM_RULINGS.md` §C by the Director's commit)
| Recon item | Ruling |
|---|---|
| R-7 (protected paths vs repo protocol) | `agent_docs/SESSIONS/**` and `agent_docs/RESPONSES/**` session/response records required by `CLAUDE.local.md` **may** be written by the QA Executor; `RECOVERY.md` stays protected for QA seats (Director/Engineer own it). One line to that effect goes in `QAM_ENTRY.md` §3. |
| R-8 (branch names) | Actual identities are the record: engineering `apbm-003`, QA `qa/apbm-003`. No rename. §C erratum notes R-04's long-form names as the template default not used by this repo. |
| R-9 (APPLY evidence layout) | `EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/` is accepted as the APPLY evidence root for PF-2.6 / AC-4xx; the three template filenames are not required. SCRATCH signup posture is a Director statement (AM-6). |

## 2. Binding
| Field | Value |
|---|---|
| Product candidate (full SHA) | `308247a24e6ddd455842da5cd2e21541d7eae2c1` (= HEAD of `qa/apbm-003` at Q1; re-pinned at Q2 entry, T-00) |
| Plan identity: `QAM_TEST_PLAN.md` SHA-256 after amendments | **`194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4`** (AM-1…AM-7 applied) — **BOUND by Friday, 2026-11-07 17:00 +06.** History: Q1 draft `8bc53eba…ff8a9` → after AM-1…6 `e8c4d5ac…ce061` → bound hash above. State: `APPROVED — NOT RELEASED`. |
| Contract identity and rulings in force | `APBM_ACCEPTANCE_SPEC.md` + `CONTRACTS/*` + `E2_AMENDMENT_A01.md` at the hashes in `QAM/evidence/identity/01/contract_hashes_as_read.txt`; rulings R-01…R-10, A01–A05, Stage-6 and E2 releases; **required before Q2:** §C erratum for R-2 (A01 in force as grading text) and R-6 (AC-401 limitation) |
| Environment / target identities | SCRATCH `ihgcsrypblqkwommrkgj` (destructive QA) · DEV `yrsuwikjnbmvpznrgydb` (read-only + declared bounded effects) · LOCAL QA server `127.0.0.1:3138` · STAGING none (Gate D out of scope) |
| Limitations accepted at approval | AC-701/702/703 and AC-506 STAGING half untested (no deployment); AC-401 restore clause = accepted limitation pending §C; AC-901/902/903 expected FAIL until Cody fills manifest/handoff/TRC §2 (R-1); Tony's manual smoke H-1 **DEFERRED — not waived, not PASS**; QA Lead and Module Architect seats held by the same person (Friday), with Executor independence (Claudy) and contract authority (JARVIS) unchanged |
| Required release conditions | (1) `.env.qa.local` generated by the Director via `make-qa-env.mjs` with the 21 keys per `QAM_ENTRY.md` §4 + `QA_DEV_DB_URL` (sourced from `APBM_DEV_DB_POOL`, session pooler — same connection mode the APPLY runner used; read-only use declared) — **DONE 2026-11-07 16:51 +06: generator WROTE 21 keys mode 0600; checker IGNORED yes / UNTRACKED yes / 21 of 21 / RESULT PASS**; (2) Director confirms destructive QA on SCRATCH (R-10) and states SCRATCH signup posture (AM-6); (3) §C errata for R-2 and R-6 committed, or §3 states they are pending (affected ACs then grade ADJUDICATE); (4) Director release statement in §3 with the commit SHA. Cody's R-1 records may land in parallel; they gate only AC-9xx grading. |

## 3. Director release (Q2)
| Field | Value |
|---|---|
| Records committed (files, commit SHA on `qa/apbm-003`) | This file (`QAM/QAM_APPROVAL.md`), `QAM/QAM_STATE.md` (entries `APPROVED — NOT RELEASED` and `RELEASED FOR Q2`), `../APBM_RULINGS.md` §C rows C-01 and C-02, Claudy's Q2-entry-hold records (`QAM/evidence/identity/02/`, session and response logs). Commit SHA: **189df312faf89d34649eb0dfafaece391eaf0c57** on `qa/apbm-003`. Prior commit `051344c8` carried the QA lane without these rows (Claudy's Q2 entry check of 2026-11-07 17:03 correctly held). |
| Release statement | **Q2 is released** against candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1` and bound plan `194538a7…cfea4`. (R-10) Destructive QA on SCRATCH `ihgcsrypblqkwommrkgj` is authorized: the current Stage-6 fixture state there may be destroyed; repo evidence of Stage 6 is complete. (AM-6) **SCRATCH signup posture: UNKNOWN — not verified.** DEV's signup-disabled evidence is DEV-only and is not reused for SCRATCH. Therefore the SCRATCH live-signup half of AC-404 is `BLOCKED — owner Director`; no signup attempt is made on SCRATCH or DEV. DEV `yrsuwikjnbmvpznrgydb` effects are limited to the plan's declared login/logout sessions and audited-read rows. Tony's manual smoke (H-1) remains DEFERRED — not waived, not PASS. §C rows C-01 (A01 in force as grading text) and C-02 (AC-401 restore clause accepted as limitation) are recorded in `APBM_RULINGS.md` under Director authority with this release. |
| Credential file created (`.env.qa.local`; keys by name) | Generated 2026-11-07 16:51 +06 by `QAM/AUTOMATION/make-qa-env.mjs` (`--dev-db-source APBM_DEV_DB_POOL`); mode 0600; ignored and untracked; 21 keys: `QA_SCRATCH_SUPABASE_URL`, `QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY`, `QA_SCRATCH_SECRET_KEY`, `QA_SCRATCH_DB_URL`, `QA_DEV_SUPABASE_URL`, `QA_DEV_SUPABASE_PUBLISHABLE_KEY`, `QA_DEV_DB_URL`, and `QA_<HANDLE>_EMAIL` / `QA_<HANDLE>_PASSWORD` for OWNER1, OWNER3, ADMIN_B2, ADMIN_B3, MEMBER_B1, MEMBER_B2B3, UNRELATED. Checker `RESULT PASS`. No value recorded anywhere. |
| Release source (Director, date, TZ) | Tony (Director) · 2026-11-09 · Asia/Dhaka. Text prepared by Friday (QA Lead) from the Director's answers; the Director's commit is the signature. |

## 4. Later decisions (append-only; Q4 retest scope, repaired candidates)
| Date | QA Lead decision (retest scope approved; plan §7 SHA-256) | Repaired candidate (full SHA) | Director release for Q4 | Recorded by |
|---|---|---|---|---|
| | NOT RECORDED | | NOT RECORDED | |

🥄
