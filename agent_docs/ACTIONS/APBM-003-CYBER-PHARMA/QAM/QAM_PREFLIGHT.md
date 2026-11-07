> **Proposed A01 alignment — DRAFT:** Read `../E2_AMENDMENT_A01.md` before this inherited draft. Its identity, exact file list, deferred customer writes, safe target/checkpoint rules and independent Gate Q/Gate D requirements replace contradictory proposals here only upon approval. No result, FINAL stamp or release is recorded.

# QAM_PREFLIGHT — `APBM-003-CYBER-PHARMA` (executable readiness checks)

> Instantiated from TEMPLATE SET v0.3 under QAM_PLAYBOOK v1.0 §5 and §8. **Owner: Architect (Friday) authors the rows; the QA Executor (Claudy) records only the Result and Evidence cells in Q1 and rechecks changeable rows at Q2/Q4 entry.** A row the Executor believes is wrong is a GAP/QUESTION in `QAM_RECON_REPORT.md` §4, not an edit. Every result starts `NOT RUN`.

**Executor:** Claudy (Claude Code, Fable 5.1) · **Run at:** 2026-11-07 14:36–14:43 +06 (Q1 attempt 01) · **Working directory:** repo root of the `qa/apbm-003` checkout · **Results file:** `evidence/preflight/<attempt>/PREFLIGHT_RESULTS.txt`

Q1 is read-only toward product and live business data. SCRATCH destructive work, DEV login probes and STAGING browser work are authorized only where a row says so and only in Q2 under the approved plan.

## Section 1 — Repository and identity

| # | Check | Command (working dir) | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-1.1 | Repository and branch | `git rev-parse --abbrev-ref HEAD` | `qa/apbm-003` | read-only | PASS | `qa/apbm-003` |
| PF-1.2 | Full HEAD, baseline, candidate | `git rev-parse HEAD`; `git log --oneline <BASELINE>..HEAD` | candidate per Director receipt | read-only | PASS | HEAD = candidate `308247a…` (5 commits since baseline) |
| PF-1.3 | Tracked and untracked state | `git status --porcelain` | empty | read-only | FAIL (inherited) | 69 inherited dirty paths, all `agent_docs/`; preserved; see identity/01 |
| PF-1.4 | Candidate ancestry | `git merge-base --is-ancestor <CANDIDATE> HEAD` | exit 0 | read-only | PASS | identical |
| PF-1.5 | Candidate reconciled against the handoff inventory (manifest §2) | `git diff --name-status <BASELINE>..<CANDIDATE>` vs manifest rows | every path accounted for; differences → GAP | read-only | GAP | manifest §2 empty; reconciled vs git: 57 product paths all inside A01+A02 allowlist |
| PF-1.6 | Candidate → HEAD classification | `git diff <CANDIDATE>..HEAD` (full content) | only `QAM/**` and governed bookkeeping; any product content → `STOP-IDENTITY` | read-only | PASS | 0 lines |
| PF-1.7 | Migrations `0001`–`0047` byte-identical to baseline | `git diff <BASELINE>..<CANDIDATE> -- supabase/migrations/00{01..47}*` | empty | read-only | PASS | 0 lines |
| PF-1.8 | Protected auth path byte-identical to baseline | `git diff <BASELINE>..<CANDIDATE> -- src/proxy.ts utils/supabase app/api/auth` (+ `protectPage` file) | empty | read-only | PASS | 0 lines |
## Section 2 — Contract and handoff

| # | Check | How | Expected | Result | Evidence |
|---|---|---|---|---|---|
| PF-2.1 | Spec and contracts carry the FINAL stamp; hashes match `QAM_ENTRY.md` §2 as recorded at resolution | `sha256sum ../APBM_ACCEPTANCE_SPEC.md ../CONTRACTS/*.md` | match | FAIL | no FINAL stamp; DRAFT hashes recorded; release superseded stamp |
| PF-2.2 | Ruling lane read; R-01..R-10 and §C errata listed; no `<<E1>>` placeholder remains in the frozen text | grep `<<E1>>` | 0 hits | FAIL | 18 `<<E1>>` remain (SPEC 8, SFC 5, OAC 5) |
| PF-2.3 | Protected paths and permitted effects understood | read `QAM_ENTRY.md` §3 | — | PASS | QAM/CLAUDE.md did not auto-load in this runtime; fallback path used |
| PF-2.4 | Governing bodies resolve with version + hash | `GOVERNING/README.md` rows | all resolve | PARTIAL | 3 bodies without hash |
| PF-2.5 | Manifest and handoff complete: every AC-1xx..9xx has a CLAIM row; four-part inventory present; no secret values | read | complete or GAP rows | FAIL | manifest + handoff unfilled templates; claims live in ledger/stage-6 HANDOFF |
| PF-2.6 | APPLY checkpoint evidence present (`../EVIDENCE/apply/01…10`, DA-2 file, backup record, rehearsal) | ls | present | PARTIAL | named files absent; equivalents in DEV_V2_20261107T080333Z_1347924/ |
## Section 3 — Runtime, tools, resources

| # | Check | Command (working dir) | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-3.1 | Runtime versions | `node --version; npm --version` | per `../EVIDENCE/E1/COUNTS.md` | read-only | PASS | node v22.14.0 / npm 10.9.2 |
| PF-3.2 | Dependency setup from lockfile (QA-controlled) | `npm ci` | exit 0; lockfile unchanged after | authorized: Y (QA checkout) | NOT RUN (Q2) | write to node_modules deferred |
| PF-3.3 | Playwright and browsers available in the QA lane | `npx playwright --version`; install browsers under `AUTOMATION/` policy | available | local only | PASS | Playwright 1.59.1, chromium-1217 (shared cache) |
| PF-3.4 | `psql` / Supabase CLI available for catalog probes | `psql --version`; `supabase --version` | available | read-only | PARTIAL | psql 17.11; supabase CLI absent (not required) |
| PF-3.5 | Evidence lanes writable; protected paths not touched | touch/rm a probe file under `QAM/evidence/`; `git status` shows only QA lane | as stated | QA lane only | PASS | QA lane only |
| PF-3.6 | `.env.local` is **not** read, hashed or copied by any QA helper, **except `AUTOMATION/make-qa-env.mjs` when run by the Director** (named exemption, AM-7a; the Executor runs it only in `--self-test` mode against synthetic fixtures; stdout/stderr carry key names, source key names, project refs and codes, never values) | review helper sources | no access | — | PASS (note) | key names + project-ref substrings read once for Director item 4; no values |
## Section 4 — Targets, configuration, readiness, roles, data

| # | Check | How | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-4.1 | SCRATCH resolved by project ref from `QA_SCRATCH_*` keys; unpaused; ready for a catalog query (an HTTP 200 proves nothing) | `select 1` via `QA_SCRATCH_DB_URL` | ref recorded; query returns | read-only | BLOCKED | no `.env.qa.local`; SCRATCH only under `RLS_REPLICA_*` |
| PF-4.2 | DEV resolved by project ref (= `../EVIDENCE/apply/01_TARGET_IDENTITY.txt`); migration state = applied chain; cast present | read-only catalog query with `QA_DEV_*` publishable key through the app's own paths or a read-only probe the plan authorizes | matches apply evidence | read-only | PARTIAL | ref confirmed via receipt/bundle; live catalog needs read-only SQL key |
| PF-4.3 | Gate D only, after Gate Q and separate deployment approval: verify actual Cloud Run revision/digest against certified candidate; not a Q1/Q2 prerequisite | revision/image provenance plus browser checks | exact match | bounded session/audit reads | N/A (Gate D) |  |
| PF-4.4 | Cast identities exist on the target (E-17): `OWNER1`, `OWNER3`, `ADMIN_B2`, `ADMIN_B3`, `MEMBER_B1`, `MEMBER_B2B3`, `UNRELATED` (+ `OPERATOR` only if authorized) | Director-verified at the seed run; Executor confirms by a bounded login probe only in Q2 | exist | Q2: bounded login (creates session/audit rows, acknowledged) | NOT RUN (Q2) | receipt claims 7 cast users |
| PF-4.5 | Suitable test data: per-store row counts and coverage per the FINAL `../CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` §3 | read-only counts through wrappers or the plan's authorized probe | matches | read-only | PARTIAL | receipt counts only; QA re-derivation Q2 |
| PF-4.6 | `.env.qa.local` declared, **ignored and untracked**, schema valid, no values echoed | `git check-ignore -v .env.qa.local`; `git ls-files --error-unmatch .env.qa.local` (expect failure); key-name check | **ignored and untracked by exit code** (`git check-ignore -q` = 0, any rule; `git ls-files --error-unmatch` ≠ 0, via `AUTOMATION/check-qa-env.sh`); **keys per `QAM_ENTRY.md` §4 + `QA_DEV_DB_URL`** (read-only use declared); `QA_STAGING_URL` optional while no STAGING is deployed; any undeclared key name = FAIL (AM-7b) | read-only; no values printed | FAIL | file present (mtime 2026-11-07 15:51, mode 664): ignored `.gitignore:28`, untracked, but 4 undeclared / 21 missing keys — `evidence/env/01/check-qa-env_current.txt`; recheck after the Director's generator run |
| PF-4.7 | DA-2: "Allow new users to sign up" OFF on DEV and SCRATCH | `../EVIDENCE/apply/DA-2_SUPABASE_SIGNUP_DISABLED.md` + an independent signup attempt in Q2 (expect rejection) | OFF | Q2 probe | PARTIAL | receipt disabled:true 08:13Z; no QA check yet |
## Section 5 — Browser, instrumentation, auth probes

| # | Check | How | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-5.1 | Browser driver launches; both themes and 375px viewport reachable in the app | Playwright smoke on STAGING login page (no sign-in in Q1) | works | local only | PARTIAL | server 3137 up, /auth 200, /moose-portal 404; no browser launched |
| PF-5.2 | Privacy scanner validated with a synthetic leak fixture **and** a clean control | run the scanner on both | fixture detected; control clean | local only | NOT RUN (Q2) |  |
| PF-5.3 | Permitted auth probe (bounded login/logout with one cast identity) | Q2 only, per plan | works; session/audit activity acknowledged | Q2 | NOT RUN (Q2) |  |
| PF-5.4 | Instruments the plan will rely on exist and can fail: `rls:prove`, `audit:prove`, `db-verify`, the seed comparator, the identity scanner | locate; plan one deliberate attack each (SR-8) | located | read-only in Q1 | PASS | all instruments located |
## Section 6 — Packaging and recovery

| # | Check | How | Expected | Result | Evidence |
|---|---|---|---|---|---|
| PF-6.1 | Can produce a safe review package (dry run of `QAM_PACKAGING.md`, exclusions honored) | dry run | index + hashes verified | PASS | Q1 package built |
| PF-6.2 | Can recover after interruption (`QAM_STATE.md` readable; evidence lane durable) | read | — | PASS |  |
## Outcome

| Field | Value |
|---|---|
| Blockers (GAP / QUESTION / BLOCKED with owner and exact resolution) | Q2 blockers: `.env.qa.local` (Director); read-only DEV SQL path (Director/Architect); grading basis for 18 `<<E1>>` placeholders (QA Lead/JARVIS); manifest/handoff unfilled (Cody, AC-901). Full list `evidence/preflight/01/PREFLIGHT_RESULTS.txt` |
| Readiness for Q1 planning | READY — candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1` resolved and identical to HEAD |
| Rows to recheck at Q2 entry | PF-1.2, PF-1.3, PF-1.6, PF-4.1, PF-4.2, PF-4.3, PF-4.6 |

*Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3.*
