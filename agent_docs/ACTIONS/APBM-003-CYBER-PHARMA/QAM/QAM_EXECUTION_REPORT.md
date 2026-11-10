# QAM_EXECUTION_REPORT — `APBM-003-CYBER-PHARMA` (Q2 attempt 01)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: QA Executor (Claudy).** Measurements, attempts, stops, helper corrections, limitations. **No self-certification.**

**Executor:** Claudy / Claude Code (Fable 5.1) · **Start:** 2026-11-09 09:15 +06 (entry check), 09:25 (T-00) · **End:** 2026-11-09 10:45 +06 · **Working directory:** `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` (repo root, branch `qa/apbm-003`); product commands (`npm ci`, `next build`, Jest, harness, seed, runner) executed in a QA copy of HEAD's tracked tree made with `git archive HEAD` at `/tmp/claude-1000/…/scratchpad/qa-tree` (byte-identical product; empty `.env.local`; no secret copied) so Cody's `:3137` standalone server under the repo's `.next/` was never disturbed. Helper evidence written into the copy's `QAM/evidence/<lane>` was copied back verbatim.

## 1. Entry verification
| Check | Value | Evidence |
|---|---|---|
| Approved plan SHA-256 = `QAM_APPROVAL.md` §2 | `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` — MATCH (bound by Friday 2026-11-07 17:00 +06) | `evidence/identity/02/t00_repin.txt` |
| Current full HEAD on `qa/apbm-003` | `4d64504e85c56f1c987a703dd94575f489cb99ce` ("APBM-003 QA: record release commit SHA") | same |
| Candidate = approved candidate | `308247a24e6ddd455842da5cd2e21541d7eae2c1`; ancestor of HEAD (`merge-base --is-ancestor` exit 0); the 3 commits above it (`051344c`, `189df31`, `4d64504`) touch only `agent_docs/` | same; `git diff 308247a HEAD -- . :(exclude)agent_docs` = 0 lines |
| Targets = approved targets | SCRATCH `ihgcsrypblqkwommrkgj` (URL-side ref + SQL-side "DEV fingerprint absent" fence before every destructive step); DEV `yrsuwikjnbmvpznrgydb` (URL-side ref + SQL-side 7-cast-uid fingerprint, READ ONLY, ROLLBACK, statement filter); LOCAL `127.0.0.1:3138`; STAGING none | `evidence/identity/02/{scratch_shim_fence_attack.txt,ro_sql_fence_attacks.txt}` (both fences attacked once: wrong ref → refused, nothing run) |
| Director release present | `QAM_APPROVAL.md` §3 (Tony, 2026-11-09, commit `189df312…`): Q2 released; R-10 SCRATCH destruction authorized; SCRATCH signup posture UNKNOWN → AC-404 SCRATCH half BLOCKED; `APBM_RULINGS.md` C-01/C-02 present; `QAM_STATE.md` = `RELEASED FOR Q2`; `.env.qa.local` RESULT PASS 21/21 mode 0600 | `evidence/identity/02/t00_repin.txt` |
| Candidate → HEAD classification (complete diff) | 48 paths, all `agent_docs/**` (QAM records, Q1/Q1b packages, RESPONSES, SESSIONS, APBM_RULINGS §C); product content 0 lines | `evidence/identity/02/t00_repin.txt` |
| **Q4 only:** repaired candidate … | n/a | |
| Changeable readiness rows rechecked | PF-1.2, 1.3, 1.6, 3.2, 4.1, 4.2, 4.4, 4.6, 4.7, 5.1 (+5.2, 5.3) recorded in `QAM_PREFLIGHT.md` Result/Evidence cells as "Q2"; PF-1.3 remains FAIL (inherited, 69→71 dirty paths, all `agent_docs/`, none product); PF-4.7 PARTIAL (DEV PASS, SCRATCH BLOCKED) | `QAM_PREFLIGHT.md`; `evidence/identity/02/{git_status_porcelain_q2_start.txt,dirty_diff_vs_q1.txt}` |
| Q1 instrument evidence reused / setup repeated | Q1 `identity/01` reused as the baseline for the dirty-state diff and the lockfile/package.json diffs (re-run in Q2 anyway); everything else executed fresh in Q2 | `evidence/identity/02/` |

Derivation artifacts (AM-1/AM-2) were written **before** any graded test: `evidence/derivations/01/{board.md,policies.md,catalog_counts.md,seed_audit.md,cast.md,money_rules.md,ui_dispatch_counts.md,allowlist.md,allowlist.json,matrix_delta.md}` (09:27–09:29 +06; T-01 started 09:35, Group B 09:35, Group C 09:51).

## 2. Execution log (plan order)
| Test ID | AC(s) | Command / steps (working dir) | Started | Result | Evidence path | Note |
|---|---|---|---|---|---|---|
| T-00 | all | PF-1.x re-run; `git diff 308247a HEAD`; dirty-state diff vs Q1; plan hash; §2/§3/§C/state/env on disk (repo root) | 09:25 | PASS | `evidence/identity/02/t00_repin.txt` | HEAD ≠ candidate SHA but product content identical; dispatch `RELEASED FOR Q2` satisfied |
| T-01 | AC-803 | `npm ci` (QA tree) · `next build` real mode via `AUTOMATION/launch-dev-real.mjs` · `npx tsc --noEmit` · `npx eslint .` · `NEXT_PUBLIC_APBM_DATA_MODE=mock npx jest --runInBand --ci` | 09:33–09:41 | PASS | `evidence/board/01/*` | ci exit 0 (854 pkgs, lockfile sha unchanged); build exit 0; tsc 0 errors; lint 0 errors / 34 warnings; Jest 39 suites / 196 tests, 0 skipped, 0 failed; controls: broken scratch test fails, skip-grep 0 |
| T-02 | AC-804 | `git diff af2c7e5..308247a -- package-lock.json` / `package.json` | 09:37 | PASS | `evidence/identity/02/{lockfile_diff.txt,package_json_diff.txt,t02_dependencies.txt}` | lockfile 0 lines; scripts-only; control diff 13 560 lines on a known lockfile commit |
| T-03 | AC-301, AC-501 | grep over `src/**` + classification; service greps | 09:33 | PASS | `evidence/reads/01/grep_user_data.txt` | 0 direct reads; baseline control assumption wrong (0 hits at `af2c7e5`) → pattern proven on a known positive (F-07f) |
| T-04 | AC-502 | allowlist comparison (`allowlist.json`) of 56 product paths | 09:33 | PASS | `evidence/identity/02/allowlist_check.json` | 0 outside; protected untouched; fake path flagged |
| T-05 | AC-506, AC-107 | auth-path diffs; route find; `user_roles` grep | 09:33 | PASS | `evidence/identity/02/t05_auth_routes.txt` | control diff 439 lines across the auth path's own history |
| T-06 | AC-101 | migrations 0001–0047 diff | 09:33 | PASS | `evidence/identity/02/t06_migrations_0001_0047.txt` | 0 lines |
| T-07 | AC-206 | generator source review + planted-reference control | 09:33 | PASS | `evidence/seed/01/generator_review.md` | |
| T-08 | AC-205 | `AUTOMATION/money-rules.mjs --mocks` on candidate and baseline fixtures | 09:37 | PASS | `evidence/seed/01/{mocks_money_rules.json,mocks_money_rules_baseline_control.json}` | 0/50 vs baseline 150/150 failures |
| T-09 | AC-801 (part) | harness diff review + flips derivation | 09:33 | PASS | `evidence/regression/01/{harness_diff_review.md,harness_diff.patch}`; `derivations/01/matrix_delta.md` | 13 flips exactly; the single `15` hit is a timestamp slice |
| T-10 | AC-101 | shim → `apply-forward inventory` · `scratch-reset` · `dev-verify` · `apply` ×2 · tamper A/B (copy) · restore · `scratch-reset --through 47` · control query · `apply` (0048–0052) · `dev-verify` · `apply` (no-op) | 09:35, 09:45 | PASS | `evidence/schema/01/*` | 52 committed; no-ops 0; both tampers refused; forward 5 committed; catalog `66782ff9…` |
| T-11 | AC-102, 103, 106, 107, 405 | `AUTOMATION/t11_catalog.sql` via `scratch-sql.mjs` (rollback); 0047 control; no-account probe | 09:46, 10:40 | PASS | `evidence/schema/01/{catalog.json,catalog_control_at_47.json,no_account_no_junction.json}` | 15 policies, 0 on `user_data`; grants observation → F-02 |
| T-12 | AC-201 | `seed:reset` · `seed:run` (private /tmp cast file) · `seed:verify` · QA hash · reset · run · `verify --compare` · QA hash · poison/revert/touch | 09:50–09:52 | PASS | `evidence/seed/01/*` | hashes equal; attack detected by both comparators |
| T-13 | AC-202 | `seed:scan`; poison stored columns; `seed:verify`; revert; `verify --compare` | 09:52, 10:02 | PASS | `evidence/privacy/01/*` | first poison used a non-existent column (HC-2) |
| T-14 | AC-203 | cast SQL inside `cast-matrix.mjs` | 09:52, 10:02 | PASS | `evidence/seed/01/cast.json` | first run counted all `auth.users` (HC-3) |
| T-15 | AC-204 | `money-rules.mjs --scratch`; poison; `seed:verify`; revert | 09:52, 10:01 | PASS | `evidence/seed/01/money_rules_*.json` | first run 130 false failures from a DATE typing bug (HC-1) |
| T-16 | AC-207 | audit counts before/after each run/reset; attribution; by-table; intact check; source grep | 09:50–10:03 | PASS | `evidence/audit/01/seed_audit.json` | reset adds 285 `delete` stamps (F-07e) |
| T-17 | AC-302, 104, 102 | `cast-matrix.mjs` (7 real logins, publishable key) | 09:52, 10:02 | PASS | `evidence/audit/01/{direct_denials.json,cast_matrix.log}` | 172 PASS / 1 FAIL where the FAIL is the TRUNCATE **observation** probe (F-02); `--attack-flip` run FAILs as required |
| T-18 | AC-303 | in `cast-matrix.mjs` | 10:02 | PASS | `evidence/audit/01/owner_reach.json` | |
| T-19 | AC-305, 603 | in `cast-matrix.mjs` + T-11 shape rows | 10:02 | PASS | `evidence/audit/01/admin_rpcs.json` | |
| T-20 | AC-304 (SQL level) | in `cast-matrix.mjs` | 10:02 | PASS | `evidence/audit/01/operation_counts.json` | retry 2, rejected 0 |
| T-21 | AC-105 | `AUTOMATION/t21-trigger.mjs` (secret key, SCRATCH) | 09:52 | PASS | `evidence/schema/01/trigger.json` | probe deleted |
| T-22 | AC-106 | SQL via `scratch-sql.mjs --continue-on-error` (rolled back) | 09:52, 09:57 | PASS | `evidence/schema/01/one_admin.json` | first run lacked savepoints (HC-7) |
| T-23 | AC-801 | shim → `npm run rls:prove -- APBM_QA`; corrupted-expectation harness run (copy); `npm run audit:prove` | 10:03–10:07 | PASS | `evidence/regression/01/*` | 320 cells GREEN, 15 observed policies, 28 attacks; corruption → RED exit 3; audit:prove 8/8 |
| T-24 | AC-802 | shim → `db-verify.mjs`, `--probes` | 10:07 | PASS | `evidence/regression/01/db_verify*.log` | ALL GREEN ×2 |
| T-30 | AC-401, 402, 403, 405 | `AUTOMATION/dev-apply-check.mjs` (every statement through `ro-sql.sh`) | 09:39–09:44 | PASS (AC-401 restore clause = ACCEPTED LIMITATION) | `evidence/apply/01/*` | first runs: json_agg line-wrap and privilege-word filter corrections (HC-8, HC-9) |
| T-31 | AC-404, 405 | same + `GET /auth/v1/settings` (apikey only) | 09:39 | PARTIAL: a/b/c PASS, d BLOCKED | `evidence/apply/01/signup_settings.json` | SCRATCH half BLOCKED — owner Director |
| T-32 | AC-501, MR-14 | real-mode build (QA tree) + serve `:3138` + bundle scan (+ fixture control) | 09:35, 09:51 | PASS | `evidence/deploy/01/{BUILD.json,build.log,bundle_scan.json,server.log}` | 0 SCRATCH refs, 7 DEV refs, 0 secret patterns |
| T-33 | AC-503, 504, 601, 603 | `AUTOMATION/role-matrix.mjs --phase matrix` (7 identities; rerun for MEMBER_B1/UNRELATED after HC-4) | 09:57, 10:05, 10:22 | PASS | `evidence/browser/01/{matrix*.json,*.log,shots/,har/}` | run 2: 109/111 (2 instrument failures); rerun 41/41 |
| T-34 | AC-505 | `--phase spoof` | 10:12 | PASS | `evidence/reads/01/spoof.json` | 7/7 |
| T-35 | AC-507 | `--phase r016` | 10:13 | PASS | `evidence/reads/01/r016.json` | 6/6 |
| T-36 | AC-602 | `--phase nomut` | 10:15 | PASS | `evidence/admin/01/no_mutation.json` | 9/9; 9 tables unchanged |
| T-37 | AC-304, 403, 504 | `--phase counts` | 10:11 | PASS | `evidence/audit/01/dev_operation_counts.json` | 18/18 = derivation |
| T-38 | AC-601, 902, R-5 | label assertions inside `matrix` | 10:05 | PASS (as the plan defines: pre-known defect observed) | `evidence/browser/01/labels/*` | → F-01, AC-601 ADJUDICATE |
| T-39 | KIP-1, AC-503 | `--phase authwalk` (rerun with UI logout, HC-5) | 10:16, 10:23 | PARTIAL: 12 PASS / 2 FAIL | `evidence/browser/01/auth_walk.json` | cross-tab sign-out not propagated → F-06 |
| T-40 | AC-503, SR-4 | `--phase responsive` (14 viewport×theme cells; OWNER3 rerun after HC-6) | 10:17, 10:25 | PASS | `evidence/browser/01/{responsive.json,responsive_run2_owner3.json,responsive/}` | all `scrollWidth ≤ width`; themes verified on `html.dark`; keyboard order follows DOM (pager before tabs) |
| T-41 | AC-506 (local) | curl against `:3138` | 09:51 | PASS | `evidence/reads/01/routes.txt` | `/moose-portal` 404, `/signup`/`/register` 404, `/auth` 200 |
| §3 mock pass | AC-501, AC-205 | stop `:3138` → mock build → serve → `--phase mockmode` → stop | 10:25 | PASS | `evidence/browser/01/mock_mode/*` | the helper's 2-minute audit window overlapped the responsive rerun (29 rows); the windowed query (0 rows) and the HAR (0 RPC) prove the kill switch (HC-10) |
| T-50 | AC-901, 902, 903 | read + pattern scan | 09:37 | FAIL (expected, R-1) | `evidence/identity/02/records_check.md` | → F-03 |
| H-1 | Director smoke | — | — | DEFERRED (Director; not waived, not PASS) | `AC_EVIDENCE_MATRIX.md` note | |
| H-2 | CRV on STAGING | — | — | NOT RUN (Gate D) | — | |

Label mapping to governing vocabulary: none needed (PASS · FAIL · BLOCKED · NOT RUN · ADJUDICATE only; "PARTIAL" above is a row summary whose parts carry the five labels in the matrix).

## 3. Helper corrections
| # | Helper | Failed attempt preserved at | Correction | Verified how | Assertion weakened? (must be No) |
|---|---|---|---|---|---|
| HC-1 | `money-rules.mjs --scratch` | `evidence/seed/01/money_rules_250.json` (first run overwritten; the 130 `rule7 aac_date_used` failures are quoted in this report and in F-07 context) | DATE columns were compared as JS `Date` strings; now parsed as text (`pg.types.setTypeParser(1082)`) and sliced to the calendar date | rerun 250/0; poison → 1 failure; revert → 0 | No (rule added: `wac_date_used` now also checked) |
| HC-2 | T-13 poison SQL | `evidence/privacy/01/poison.json` (first attempt error 42703, preserved in the chain log) | poison used `date_of_birth`, not a `user_data` column; replaced by existing patient/contact columns | poisoned verify fails on the identity-scan assertion; clean control passes | No |
| HC-3 | `cast-matrix.mjs` T-14 | `evidence/audit/01/cast_matrix.log` (first run FAIL line) | counted every `auth.users` row; the disposable SCRATCH holds 5 pre-existing non-seed users and a BIM-002 user; check scoped to the 7 seeded cast emails (each once, no OPERATOR, no role key) and the others reported as context | rerun 172 PASS | No |
| HC-4 | `role-matrix.mjs` matrix | `evidence/browser/01/matrix_run2_all.json`, `shots/matrix_MEMBER_B1_FAIL_MEMBER_B1_filters.png`, `debug_pbm_MEMBER_B1.json` | `selectOption` fired a synthetic `change` on an already-selected store (a native select does not) which nulls the PBM options (F-05); helper now selects only when the value differs | rerun MEMBER_B1/UNRELATED 41/41 | No |
| HC-5 | `role-matrix.mjs` authwalk | `evidence/browser/01/authwalk_run1.log` (UI logout path not reached → API logout) | avatar menu located via `header [aria-haspopup=menu]` → `menuitem Logout` | rerun: UI logout true; cross-tab FAIL stands (F-06) | No |
| HC-6 | `role-matrix.mjs` responsive keyboard | `evidence/browser/01/responsive.json` (run 1 FAIL row) | expected order assumed tabs before pager; DOM/visual order is Store select → pager → tabs → sort buttons; check now asserts that order and reachability | rerun 16/16 | No (order still asserted) |
| HC-7 | `scratch-sql.mjs --continue-on-error` | `evidence/schema/01/one_admin.json` (first run: 25P02 after the first expected 23505) | per-statement SAVEPOINT/ROLLBACK TO | rerun shows 23505, 23505, member insert OK, rolled back | No |
| HC-8 | `dev-apply-check.mjs` | `evidence/apply/01/t30_t31_run.log` (first runs) | `json_agg` text wraps lines → join before parse; `roles` array normalisation (`{a}` vs JSON array) | catalog projection equality PASS | No |
| HC-9 | `dev-apply-check.mjs` / `ro-sql.sh` | same | privilege-word literals in the grants query were refused by the ro-sql statement filter; query rewritten over `information_schema.role_table_grants`; filter tightened (data-modifying CTEs refused) | happy path, UPDATE and CTE refusals, SQL-fence attack all recorded | No |
| HC-10 | `role-matrix.mjs` mockmode | `evidence/browser/01/mock_mode/mockmode.json` (5th check FAIL) | the "last 2 minutes" audit window overlapped the responsive rerun; proof taken from the run-window query (0 rows) and the HAR (0 RPC) — `audit_window_check.txt`, `har_rpc_check.json` | both 0 | No |
| HC-11 | `qa-env.mjs` / `ro-sql.sh` | — (see F-04) | `.env.qa.local` values are written as `KEY='value'  # <- SOURCE`; parsers now honour the quotes/comment | loader lengths/refs OK; ro-sql happy path | No |
| HC-12 | `privacy-scan.mjs` | `evidence/privacy/01/evidence_scan.json` (earlier FAIL runs) | env-assignment pattern required a credential-shaped value (a bare public project ref is not a value); self-source excluded; fixture updated | fixture 6/6, control 0, evidence/AUTOMATION/package 0 hits | No |

## 4. Stops
| Stop ID | Phase / time | Identity | Affected checks | Evidence | Owner | Required resolution | Safe resume point | Resolved? |
|---|---|---|---|---|---|---|---|---|
| none | — | — | — | — | — | — | — | — |

No §5 stop condition fired. The Executor's credential-handling incident (two DB connection strings echoed into the Claude Code tool output / session transcript while debugging the env-file format; nothing written to any QAM file) is recorded as **F-04** with a rotation recommendation; it is not a plan stop and did not halt the campaign.

## 5. Human checks and Director touches (declared; counted)
| # | Purpose | Declared in plan? | When requested | Count |
|---|---|---|---|---|
| 1 | Director eyes-on CRV walk on STAGING (spec §10) | yes | not yet (Gate D) | 0 |
| 2 | Tony's manual app smoke (H-1) | yes (DEFERRED, not waived, not PASS) | — | 0 |

Actual sign-in counts per role (real `/auth` form logins on `:3138` against Dev v1, plus SCRATCH logins inside `cast-matrix.mjs`): DEV — OWNER3 26, MEMBER_B1 9, UNRELATED 4, MEMBER_B2B3 2, OWNER1 1, ADMIN_B2 1, ADMIN_B3 1 (**44** sessions; the plan estimated ≤ 28 — the overrun comes from phase reruns after helper corrections) — `evidence/browser/01/signins.json`. DEV `read_page` rows added by QA: 337 → see `evidence/audit/01/dev_operation_counts.json` and the attribution query (all OWNER3/MEMBER_B1/UNRELATED/MEMBER_B2B3 rows carry the acting uid, business id and `context.fn`). DEV business tables unchanged (T-36 hashes; HAR 0 table POSTs). SCRATCH: destroyed and reseeded as planned (final state: `audit:prove` seed in place).

## 6. Remaining untested areas
| AC / area | Reason | Owner |
|---|---|---|
| AC-701, AC-702, AC-703; AC-506 STAGING half | no deployment; Gate D is after Gate Q | Director |
| AC-404 SCRATCH live-signup half | SCRATCH signup posture UNKNOWN (§3); no attempt on any target | Director (state OFF, then QA attempts a rejected signup on SCRATCH) |
| AC-401 restore clause | ACCEPTED LIMITATION (C-02) | Director / JARVIS (Phase 8) |
| AC-403 "direct SELECT denial with authenticated tokens" **on DEV** | proven with real tokens on SCRATCH (T-17) against a catalog projection identical to DEV (T-30); the bound T-30/T-37 steps include no DEV token probe | QA Lead (accept or request a bounded DEV probe) |
| H-1 manual smoke, H-2 CRV | deferred / Gate D | Director |
| AC-901/902/903 PASS | records unfilled (F-03) | Cody / Director |

## 7. Final identities and inventory
| Field | Value |
|---|---|
| HEAD at end | `4d64504e85c56f1c987a703dd94575f489cb99ce` (unchanged; no Git mutation by QA) |
| `git status --porcelain` at end (only QA lane dirty) | all dirty paths under `agent_docs/`; product paths 0 — `evidence/identity/02/git_status_porcelain_q2_end.txt` (taken before packaging; the package files add `QAM/HANDOFFS/*Q2*`) |
| Final changed-file inventory (QA lane) | `QAM/QAM_EXECUTION_REPORT.md`, `QAM/AC_EVIDENCE_MATRIX.md`, `QAM/FINDINGS.md` (§1, §3.1), `QAM/QAM_PREFLIGHT.md` (Result/Evidence cells only), `QAM/QAM_STATE.md` (Executor entries), `QAM/AUTOMATION/{README.md,qa-env.mjs,qa-shim.mjs,ro-sql.sh,scratch-sql.mjs,launch-dev-real.mjs,derive.mjs,money-rules.mjs,seed-hash.mjs,cast-matrix.mjs,t21-trigger.mjs,t11_catalog.sql,dev-apply-check.mjs,role-matrix.mjs,debug-pbm-options.mjs,privacy-scan.mjs,inventory.mjs,build-package.mjs}`, `QAM/evidence/**` (lanes identity/02, derivations/01, board/01, schema/01, seed/01, audit/01, apply/01, reads/01, admin/01, browser/01, deploy/01, regression/01, privacy/01, INVENTORY.md), `QAM/HANDOFFS/{REVIEW_START_HERE_Q2_01.md,FILE_INDEX_Q2_01.json,APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip,README.md}`, `agent_docs/SESSIONS/session_2026-11-07.md`, `agent_docs/RESPONSES/response_2026-11-09_*_apbm003-qam-q2-execution.md` |
| Evidence inventory | `evidence/INVENTORY.md` (353 files; privacy scan 0 hits) |
| Package | `HANDOFFS/APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip` — SHA-256 recorded **outside** this report (`HANDOFFS/README.md` external receipt and the subsequent live `QAM_STATE.md` entry) |

## 8. Metrics (§17)
| Measure | Value |
|---|---|
| Preparation (Architect) | NOT RECORDED (not the Executor's measure) |
| Q1 · Review/wait · Q2 execution · Packaging · Repair · Cleanup | Q1 2026-11-07 14:36–15:05 (+ Q1b 16:05–16:54) · wait 2026-11-07 17:03 → 2026-11-09 09:15 · Q2 execution 09:15–10:45 (≈ 1 h 30 min) · packaging 10:45–11:00 · repair — · cleanup pending (QA Lead) |
| Director touches by purpose · helper corrections · product repairs · stops · retries · skipped checks · remaining gaps | Director touches 0 (H-1 deferred) · helper corrections 12 (HC-1…HC-12; all failed attempts preserved; no assertion weakened) · product repairs 0 · stops 0 · retries: phases rerun after helper corrections — T-13, T-15, T-17 group, T-33 (2 identities), T-39, T-40 (OWNER3) · skipped checks 0 (AC-404 SCRATCH half BLOCKED by release; AC-7xx NOT RUN by scope) · remaining gaps §6 |

## 9. Summary for the QA Lead (no verdict)
Totals by label (44 ACs): **PASS 35 · FAIL 3 (AC-901/902/903, records) · BLOCKED 1 (AC-404 SCRATCH half) · NOT RUN 3 (AC-701/702/703) · ADJUDICATE 2 (AC-401 restore clause per C-02; AC-601 truthful-display defect F-01)**. Findings by proposed class: `FINDINGS.md` §1 — F-01 contract/scope gap (R-5 demo labels over live data), F-02 proven pre-existing defect → follow-up (TRUNCATE/REFERENCES/TRIGGER grants to `anon`/`authenticated`; `authenticated` can TRUNCATE `user_data` at SQL level), F-03 acceptance failure (records), F-04 observation (Executor credential-handling incident; rotate the two DB passwords), F-05 observation (same-store `selectStore` nulls options), F-06 proven pre-existing defect → follow-up (cross-tab sign-out not propagated), F-07 observation (plan-text corrections), F-08 observation (AC-404 SCRATCH half blocked). Recommendation (supporting evidence only): the product behaviour the module set out to deliver — owner reach, audited closure of every claim read on both layers, exact cast/seed, scoped admin reads, truthful fetch states, no real-mode mutation — held under independent re-derivation on SCRATCH, DEV (read-only) and the real app; the open items are the inherited admin demo labels (F-01), the unfilled handoff records (F-03), the Director's SCRATCH signup posture (AC-404) and two pre-existing hardening items (F-02, F-06). Decision requested: adjudicate `FINDINGS.md` and `AC_EVIDENCE_MATRIX.md`.

---

# Q4 attempt 01 — retest of the repaired candidate (Claudy, 2026-11-09 12:13–12:45 +06)

Scope authority: `QAM_APPROVAL.md` §4 (Friday retest scope; Tony release "Q4 released — 2026-11-09, candidate dc44429f, credential file unchanged per C-05(b)"); `APBM_RULINGS.md` C-03/C-04/C-05; `QAM/HANDOFFS/QA_HANDOFF.md` writer Cody → Claudy; bound plan unchanged `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` (§7 is the retest table). Q2 attempt 01 sections above are untouched; this section records Q4 only.

## Q4.1 Entry verification
| Check | Result | Evidence |
|---|---|---|
| Records on disk: `QAM_STATE.md` latest = `RELEASED FOR Q4`; `QAM_APPROVAL.md` §4 row (retest scope + release); `APBM_RULINGS.md` C-03, C-04, C-05; `QA_HANDOFF.md` Cody → Claudy | all present — no hold | `evidence/identity/03/t00_repin_q4.txt` |
| T-00 re-pin: HEAD `c5061d9f75fa242a3d14913c08d6bbad7173c638` = repaired candidate `dc44429f466dedcf35023342f68624c6cee062f0` + 1 records-only commit; product diff candidate..HEAD 0 paths; plan SHA = bound | PASS | same |
| Repair diff `308247a2..dc44429f`: 59 paths, product paths exactly `src/components/admin-portal/BillingScreen.tsx`, `src/components/admin-portal/DemoMarker.tsx`, `src/components/owedbook/OwedBookContext.tsx` (+4/−1, +3/−1, +1/−1); migration/seed/harness/service/auth/test paths 0 → **no STOP-CONTRACT** | PASS | `identity/03/{repair_diff_product.patch,repair_diff_name_status_all.txt}` |
| Repaired file SHA-256 = manifest §8 (3/3); F-05 guard declared TAKEN in §8 → T-33 OwedBook leg required | PASS | `t00_repin_q4.txt`, `records_check_q4.md` |
| `check-qa-env.sh` | RESULT PASS (ignored, untracked, 21/21 keys, mode 0600) — file unchanged per C-05(b) | `t00_repin_q4.txt` |
| AC-404 posture | C-04: DEV half PASS stands, SCRATCH half N/A; **no signup attempt on any target** | `APBM_RULINGS.md` C-04 |

## Q4.2 Execution log (§4 order)
| Time (+06) | Test | Target | Result | Evidence |
|---|---|---|---|---|
| 12:17 | T-00 re-pin, STOP-CONTRACT diff check, credential checker | LOCAL | PASS | `evidence/identity/03/` |
| 12:18 | Allowlist re-derived with C-03 (+ `OwedBookContext.tsx` already A01) — written before T-04 (AM-1) | LOCAL | written | `evidence/derivations/02/allowlist.{md,json}` |
| 12:18 | T-04 allowlist: 58 product paths `af2c7e5..dc44429f` ⊆ allowlist (Q2: 56 + the two C-03 files); repair diff exactly the three files; protected paths + 0001–0047 unchanged; `--attack` → `FAIL (STOP-CONTRACT candidate)` exit 1 | LOCAL | PASS (control FAILs) | `identity/03/{allowlist_check_q4.json,allowlist_check_q4_attack.json,product_paths_baseline_to_repaired.txt}` |
| 12:18–12:21 | T-01 board in a fresh QA copy of HEAD (`git archive`, empty `.env.local`): `npm ci` 854 packages, lockfile SHA unchanged; `next build` real PASS (`BUILD_real.json`); `tsc --noEmit` 0; `eslint .` 0 errors / 34 warnings; Jest **39 suites / 196 tests, 0 skipped, 0 failed** (expected suites 39 = test files minus `jest.setup.ts`); controls: `.skip|xit|xdescribe` 0, broken-assertion scratch test fails (exit 1) | LOCAL | PASS | `evidence/board/02/{ci.log,build.log,tsc.log,lint.log,jest.log,jest-results.json,negative_controls.txt,tree_identity.txt,BUILD_real.json}` |
| 12:22 | T-50 records: manifest §3 44 CLAIM rows / 44 ACs, §2 four-part inventory (2.1–2.4), §8 repair amendment with matching hashes, 0 NOT RECORDED; handoff 44 AC rows; TRC §2 filled (staging "pending Gate D" per the Lead's §3, limitations incl. F-06/C-05c, F-02/C-05a, AC-401/C-02); journal stage 8 + repair entries; `APBM_STATE.md` literal present; six records scan 0 hits | LOCAL | PASS (observation F-09) | `identity/03/records_check_q4.md` |
| 12:22 | T-32-equivalent QA server: real build served on `127.0.0.1:3138` (`:3137` untouched) | LOCAL | up | `board/02/serve_real.log` |
| 12:23 | T-38 component-level copy check in both data modes (QA jest file outside `src/__tests__`): mock keeps "Demo · mock data" / "Visual only…"; real shows "Synthetic test data" / "Billing actions are unavailable in this release"; control fails | LOCAL | PASS 5/5 | `browser/02/labels/{copy_modes_component.json,copy_modes_component.log,copy_modes.test.tsx.txt}` |
| 12:24–12:29 | T-33 admin leg + T-38 labels, OWNER3 × {1440×900, 375×812} × {light, dark}: theme class, My Stores exactly B1–B3, store detail B3 roster, audit viewer only permitted stores, billing 3 read-only lines (Price/Plan/Billing dates unavailable, buttons disabled, no `$` amounts), settings/invite unavailable, **every header pill "Synthetic test data" and 0 × "Demo · mock data"; billing footer "Billing actions are unavailable in this release" and 0 × "Visual only…"**; no horizontal overflow; 4 logouts | DEV via `:3138` | **70 PASS / 0 FAIL** | `browser/02/{admin.json,admin_run1.log,shots/admin_OWNER3_*,har/admin_*}` |
| 12:30–12:36 | T-33 OwedBook leg OWNER3 (1440 light): picker exactly B1,B2,B3; 3 × (Total 50, 25 rows of that store, KPI non-zero); Updated 17; Federal unavailable; Summary 3 PBMs + note; status 10, date 6, empty state, PBM 13; sort; pager; **F-05 guard: same-store re-select keeps 3 PBM options, no "No options", audit +0; control switch B1→B2 refetches (3 options, audit +3 kpis/pbm_options/rows)**; T-33c stale fence B1→B2→B3 inverted → only B3 rows | DEV via `:3138` | **21 PASS / 0 FAIL** (run 3; runs 1–2 instrument failures HC-Q4-1/2) | `browser/02/{owedbook.json,owedbook_run3.log,owedbook_run1_instrument_fail.json,owedbook_run2_instrument_fail.json,shots/owedbook_*}` |
| 12:36 | T-36 no-mutation (billing screen touched by C-03): Upload/Add store/Manage payment/Cancel disabled; member actions text; invite/settings unavailable; 9 tables counts+hashes unchanged; `audit_logs` grew only by `read_page`; HAR 0 POST to `/rest/v1/<table>` | DEV via `:3138` | **10 PASS / 0 FAIL** | `admin/02/no_mutation.json`, `browser/02/{nomut.json,nomut_run1.log,har/nomut_*}` |
| 12:37 | Instrument control: `q4-matrix.mjs --phase admin --attack-flip` (expects the OLD demo copy) | DEV via `:3138` | **FAIL as required** (12 FAIL / 58 PASS) | `browser/02/{admin_attack_flip.json,admin_attack_flip.log}` |
| 12:38 | Real-build bundle check: 0 `sb_secret_`, 0 `SUPABASE_SECRET_KEY` in client static; new copy strings present | LOCAL | PASS | `deploy/02/bundle_check_q4.txt` |
| 12:38–12:41 | §3 mock pass on a mock build (`BUILD_mock.json`): "Synthetic demo data" picker copy unchanged, A1 fixture rows, admin gate unchanged (member → `/owedbook`), 0 `read_page` rows and 0 `/rest/*` calls to Dev v1 | LOCAL (mock) | **6 PASS / 0 FAIL** (run 2; run 1 HC-Q4-3) | `browser/02/mock_mode/{mockmode.json,mockmode_run2.log,mockmode_run1_instrument_fail.json,shots/}` |
| 12:41 | `:3138` stopped; `:3137` (pid 1355455) untouched throughout | LOCAL | done | `audit/02/dev_effects_q4.txt` |
| 12:42 | DEV declared-effects tally (read-only): window from 06:15Z — 264 `read_page` rows, all actor OWNER3 (admin_audit 8 · admin_billing_status 27 · admin_members 9 · admin_stores 53 · owedbook_kpis 57 · owedbook_pbm_options 34 · owedbook_rows 73 · owedbook_summary 3); 0 non-`read_page` rows; business table counts unchanged (3/5/8/3/250/12/12/2/0) | DEV (ro-sql) | within declared effects | `audit/02/dev_effects_q4.txt` |
| 12:43 | Carry-forward register: 357 Q2/01 evidence members re-hashed against `FILE_INDEX_Q2_01.json` → 0 changed, 0 missing; applicability per lane stated | LOCAL | PASS | `evidence/carry_forward/Q2_01_carry_forward.md` |

SCRATCH `ihgcsrypblqkwommrkgj` was **not touched** in Q4 (no SCRATCH command ran; all Group B evidence carried). No seed, no `/tmp` cast file.

## Q4.3 Helper corrections (failed attempts preserved; no assertion weakened)
| ID | Symptom | Cause | Correction | Preserved |
|---|---|---|---|---|
| HC-Q4-1 | F-05 checks reported 0 PBM options | the picker renders checkbox `<label>`s inside `[data-testid=multiselect-panel]`, not `role=option` | count labels inside the panel | `browser/02/owedbook_run1_instrument_fail.json`, `owedbook_run1.log` |
| HC-Q4-2 | F-05 checks reported 1 option | the MultiSelect keeps the last search text ("SYNTHETIC PBM 1" from the filter step) across open/close, so the list was filtered | clear the search box before counting | `owedbook_run2_instrument_fail.json`, `owedbook_run2.log` |
| HC-Q4-3 | mock phase: `ENOENT` reading the HAR | Playwright writes the HAR on context close; the read happened before `closeCtx` | read after close (as `nomut` already did) | `mock_mode/mockmode_run1_instrument_fail.json`, `mockmode_run1.log` |
| (records scan) | first whole-module scan showed 8 hits | `--exclude` replaced the default exclusion regex, pulling in Cody's engineering test fixtures and the scanner's own source | graded scan restricted to copies of the six handoff records → 0 hits | `identity/03/records_check_q4.md` (note kept) |

## Q4.4 Stops
None. STOP-CONTRACT check (repair diff ⊆ the three declared files) negative; `t04-allowlist.mjs --attack` proves it would fire.

## Q4.5 Declared effects and human checks
| Item | Value |
|---|---|
| DEV sign-ins (OWNER3 only) | 14 (admin 4 · owedbook 3 runs · nomut 1 · attack-flip 4 · mock 2) — `browser/02/signins.json` (12) + `browser/02/mock_mode/signins.json` (2) |
| DEV rows written | `audit_logs` `read_page` 264 (OWNER3); auth sessions for the 14 logins; nothing else (`audit/02/dev_effects_q4.txt`) |
| SCRATCH | untouched |
| LOCAL | `127.0.0.1:3138` real then mock build, stopped; `:3137` untouched |
| Director touches | 0 in Q4 (H-1 manual smoke still DEFERRED; H-2 CRV Gate D) |
| Credentials | `.env.qa.local` values in process memory only; privacy scan of `evidence/` and `AUTOMATION/` 0 hits (`privacy/01/*_scan_q4.json`) |

## Q4.6 Remaining untested areas
| AC / area | Reason | Owner |
|---|---|---|
| AC-701/702/703; AC-506 STAGING half | no deployment; Gate D after Gate Q | Director |
| AC-401 restore clause | ACCEPTED LIMITATION (C-02); carried to Phase 8 | Director / JARVIS |
| AC-403 DEV token probe | as in Q2 §6 (Lead accepted the SCRATCH proof + identical catalog projection) | QA Lead |
| H-1, H-2 | deferred / Gate D | Director |
| Other identities' browser legs on the repaired candidate | not in the §4 scope; carried from Q2/01 (only OWNER3 legs re-run; `OwedBookContext` change exercised by OWNER3 incl. the F-05 path) | — |

## Q4.7 Final identities and inventory
| Field | Value |
|---|---|
| HEAD at end | `c5061d9f75fa242a3d14913c08d6bbad7173c638` (unchanged; no Git mutation by QA) |
| Repaired candidate | `dc44429f466dedcf35023342f68624c6cee062f0` (original `308247a24e6ddd455842da5cd2e21541d7eae2c1`) |
| QA lane files changed in Q4 | `QAM_EXECUTION_REPORT.md` (this section), `AC_EVIDENCE_MATRIX.md`, `FINDINGS.md` §1 (F-09, F-10 + Q4 status note), `QAM_STATE.md`, `AUTOMATION/{derive-q4.mjs,t04-allowlist.mjs,q4-matrix.mjs,inventory.mjs (lane label),README.md}`, `evidence/{identity/03,derivations/02,board/02,browser/02,admin/02,audit/02,deploy/02,carry_forward,privacy/01/*_q4.json,INVENTORY.md}`, `HANDOFFS/{REVIEW_START_HERE_Q4_01.md,FILE_INDEX_Q4_01.json,APBM-003-CYBER-PHARMA_Q4_REVIEW_01.zip,README.md}` |
| Package | `HANDOFFS/APBM-003-CYBER-PHARMA_Q4_REVIEW_01.zip` — SHA-256 recorded **outside** this report |

## Q4.8 Metrics
| Measure | Value |
|---|---|
| Wait · Q4 execution · packaging | wait 2026-11-09 10:56 → 12:13 · execution 12:13–12:45 (≈ 32 min) · packaging 12:45–13:00 |
| Helper corrections · product repairs · stops · retries · skipped checks | 3 (HC-Q4-1…3) + 1 scan-scope correction · 0 · 0 · OwedBook leg ×3, mock phase ×2 (all instrument-caused, logged) · 0 |

## Q4.9 Summary for the QA Lead (no verdict)
All §4 retest rows PASS on the repaired candidate: board 39/196; allowlist with C-03 (58 paths; repair diff exactly the three files); truthful real-mode copy on every admin screen at 1440 and 375 in both themes with the mock copy proven unchanged at component level and on a mock build; T-36 no-mutation; OWNER3 OwedBook leg including the stale fence and the F-05 guard (same-store re-select is a no-op: options kept, audit +0); T-50 records complete. AC-404 relabelled PASS (DEV) / N/A (SCRATCH) per C-04 without any signup attempt. Matrix totals (44): **PASS 41 · FAIL 0 · BLOCKED 0 · NOT RUN 3 (AC-701/702/703) · ADJUDICATE 0** — AC-401 is labelled PASS on the Lead's Q2 disposition (restore clause ACCEPTED LIMITATION per C-02), which the Lead may restate. New observations only: F-09 (manifest §1 / handoff header carry "PENDING Director commit" for the repaired SHA — inherent to pre-commit records; the SHA is in `QAM_APPROVAL.md` §4 and `QAM_STATE.md`) and F-10 (375 px billing rows: the disabled "Cancel" button is clipped at the card's right edge; pre-existing `BillingRow` layout, not a C-03 regression; low). Nothing in Q4 changes the C-05 risk acceptances.
