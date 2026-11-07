# APBM-003 — QAM SHOT 1 (recon + test plan) — Q1 attempt 01

**Seat:** Claudy (QA Executor), Claude Code / Fable 5.1 · **Date:** 2026-11-07 · **Branch:** `qa/apbm-003` @ `308247a24e6ddd455842da5cd2e21541d7eae2c1` · **Q2 NOT started.**

## Readiness summary

Q1 is complete and the plan is ready for QA Lead review. The embedded QAM exists at `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/` and was followed. The Director's sequencing exception is recorded in `QAM_STATE.md`, the recon report and the plan: independent QA runs before Tony's manual smoke, the smoke is **deferred, not waived, not PASS**, final acceptance remains pending.

| Item | Finding |
|---|---|
| Candidate | `308247a24e6ddd455842da5cd2e21541d7eae2c1` = HEAD of `qa/apbm-003`; candidate→HEAD diff empty |
| Application source vs released commit | no differences; no modified or untracked file outside `agent_docs/` |
| Inherited dirty tree | 69 paths, all `agent_docs/` (3 tracked modified, 66 untracked apply evidence + responses); preserved untouched; listed in `QAM/evidence/identity/01/inherited_dirty_baseline_status.txt` |
| Protected paths | migrations 0001–0047, auth path (`src/proxy.ts`, `src/utils/supabase/**`, `src/app/api/auth/**`, `src/app/(auth)/**`), lockfile: byte-identical to baseline `af2c7e5` |
| Product delta | 57 non-`agent_docs` paths, all inside the A01 exact allowlist + A02 two test files + `package.json` scripts |
| Frontend target | built bundle + standalone server: 7 files reference Dev v1 `yrsuwikjnbmvpznrgydb`, 0 reference SCRATCH; BUILD_ID matches `dev-manual-smoke/BUILD.json`; `/auth` 200, `/moose-portal` 404. Stale SCRATCH build already replaced. Stale config remaining: `RLS_REPLICA_*` SCRATCH keys still in `.env.local` (harness use), `APBM_DEV_DB_URL` duplicated. Running server is Cody's process; Q2 rebuilds under QA control. |
| DEV APPLY receipt | internally consistent (ledger 52, 250 claims, 7 users added, 30 tables additive, 4 auth indexes unchanged, signup disabled at 08:13Z). Treated as engineering evidence. Notable: `restoreVerified: false` (synthetic rehearsal, not a DEV restore) — AC-401 restore clause not literally met. |
| Engineering records | `QAM_MANIFEST.md` and `ENGINEERING_HANDOFF.md` are unfilled templates; `QAM_STATE.md` was never advanced; claims live in the acceptance ledger and Stage-6 handoff instead → AC-901 evidence gap |
| Contract | DRAFT, no FINAL stamp (superseded by the Director release); 18 `<<E1>>` placeholders remain; A01 labelled "not in force" yet implemented → grading-basis ruling needed |

## Concrete blockers for Q2 (none for Q1)

1. **Credentials (R-4).** No `.env.qa.local`. Director must create it with `QA_SCRATCH_*`, `QA_DEV_SUPABASE_URL`, `QA_DEV_PUBLISHABLE_KEY`, **plus `QA_DEV_DB_URL` (read-only use)** for the AC-4xx catalog checks, and the seven `QA_<HANDLE>_EMAIL/PASSWORD` pairs. Alternative: a ruling that QA may read the existing 0600 cast file by path.
2. **Grading basis (R-2/R-3).** One ruling that A01 + the engineering-derived counts (17 tables / 15 policies / 19 functions / 285 seed events / 3-1-3-3 UI dispatch) are the reference, or acceptance of the plan's "QA-derived expected" column.
3. **Seats and release (R-12).** QA Lead decision in `QAM_APPROVAL.md` §1; Director release in §3.
4. **Director confirmations (R-10, R-11).** Destructive QA on SCRATCH wipes the current Stage-6 fixture state; DEV signup check stays read-only (GET settings), no live signup attempt on DEV.

## Product defects vs deferred scope vs evidence gaps (pre-known, not yet graded)

| Class | Item |
|---|---|
| Product defect (truthful display), scope amendment pending | `DemoMarker.tsx` "Demo · mock data" and `BillingScreen.tsx` "no real charge is made in this demo" render in real mode on DEV; both outside the A01 allowlist (R-5). Recommend approving the two-file copy amendment now so it joins the consolidated rework. |
| Deferred scope | STAGING / Gate D (AC-701–703, AC-506 staging half): no deployment. Tony's manual smoke (H-1) and CRV walk (H-2): Director-deferred. |
| Engineering evidence gaps | manifest/handoff unfilled (AC-901), TRC §2 unfilled (AC-902), `APBM_STATE.md` not at `E2 COMPLETE` (AC-903); restore not demonstrated (AC-401, R-6); no DA-2 evidence for SCRATCH (R-9). |
| Protocol conflict | QAM §3 protects `RECOVERY.md` and `SESSIONS/**`; repo protocol requires them. Session log and response file written; **`RECOVERY.md` left untouched** (stale since 2026-10-22) pending Architect ruling (R-7). |

## Proposed tests (plan §2; 42 tests + 2 human checks)

- **Group A, local read-only (T-00…T-09):** identity re-pin, QA-controlled board (`npm ci`, build, tsc, lint, Jest ≥ 39/196, 0 skipped), lockfile, direct-`user_data` grep with baseline negative control, allowlist check, protected paths, generator review, mocks money-rule audit, harness-diff review (13 flips only).
- **Group B, SCRATCH destructive (T-10…T-24):** from-scratch replay + no-op + tamper refusal; catalog assertions (one permissive policy per command, 15 policies, owner helper, partial unique admin index, ACLs); seed twice + comparator attack; identity scan + poisoned fixture; exact cast; QA arithmetic over all 250 rows; 285 seed audit rows; direct SELECT/INSERT/UPDATE/DELETE denial for all 7 tokens (42501, unchanged rows) + wrapper success; owner reach; admin RPC scope/audit; per-operation audit counts incl. forced retry; `handle_new_user` metadata-role probe; second-admin rejection; QA-controlled `rls:prove`/`audit:prove` with deliberate corruption; `db-verify --probes`.
- **Group C, DEV read-only + bounded effects (T-30…T-41):** receipt re-verification (ledger checksums, catalog hash, pre-existing 5 users preserved); DEV trigger text, ACLs, signup GET; QA build + bundle scan (0 SCRATCH refs, no secret patterns); browser matrix for all 7 identities (store picker exact scope, 50 claims/store, tabs, filters, sort, pager, Summary note, Federal unavailable, admin views scoped, member redirect, no foreign Supabase host, stale-response fence); parameter spoof via route interception and direct REST; R-016 fault injection (KPIs/rows/stores/options aborted → error states, never zeros; Refresh re-fetches +3 audit rows); write controls → table hashes unchanged; per-UI-operation audit counts; synthetic labelling and demo-copy truthfulness; KIP-1 production-mode auth walk with hard refreshes and cross-tab logout; viewports 1440/1280/768/375 × light/dark, no horizontal scroll at 375, keyboard reach; hidden routes 404.
- **Group D:** records check (AC-9xx); **H-1 Tony's manual smoke — deferred, Director-recorded; H-2 CRV — after Gate D.**

**Writes declared before execution:** SCRATCH only for resets, replay, seed, attack mutations, probes. DEV: zero business writes, zero DDL, zero Auth changes; only login/logout sessions (≤ 28) and `audit_logs.read_page` rows (≈ 150–250) from successful audited RPCs. Local: `npm ci`, QA build, Playwright.

## What I did not do

No Q2 execution, no browser run, no authenticated probe, no login, no SQL against any target, no product or test edit, no Git mutation, no cleaning or staging of inherited files. `.env.local` was read for key names and project-ref substrings only.

## Deliverables (QA-generated; distinguishable from inherited material)

| Path | Role |
|---|---|
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RECON_REPORT.md` | recon, 12 unresolved items R-1…R-12 · SHA-256 `69244312f6222bcd408e7d6d156fca8059b617e61f9711b9d08703bf8e2bf0cf` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md` | DRAFT plan · SHA-256 `8bc53eba9a80cb716c954c2bd83d149d22650c17e0694901b549cd96aaaff8a9` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md` | result/evidence cells filled |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md` §3 | Executor reading X-1…X-13 |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md` | Director exception + `Q1 COMPLETE — AWAITING QA LEAD REVIEW` + package receipt |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AC_EVIDENCE_MATRIX.md` | header + H-1 deferred note (all rows NOT RUN) |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/`, `evidence/identity/01/` | preflight results, Git identity evidence, frontend target check |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip` | 65 members, 155,612 bytes · SHA-256 `845de226ce1c3e8a608fa4a0649c3c4aa11c12b1eb09513b8ba66b3ed50770a9` (receipt in `HANDOFFS/README.md`; `FILE_INDEX_Q1_01.json`, `REVIEW_START_HERE_Q1_01.md`) |
| `/home/moose/Downloads/APBM-003-CYBER-PHARMA_Q1_REVIEW_01_20261107T145615.zip` | byte-identical JARVIS copy (same SHA-256); privacy scan validated with fixture (5/5) and clean control (0), 0 hits |
| `agent_docs/SESSIONS/session_2026-11-07.md` | session log (repo protocol) |

Decision requested: **QA Lead — approve / approve with exact amendments / hold the plan. Director — items 1–4 above. STOP after Q1; Q2 waits for the recorded approval and release.**
