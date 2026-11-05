# QAM_PREFLIGHT — `APBM-003-CYBER-PHARMA` (executable readiness checks)

> Instantiated from TEMPLATE SET v0.3 under QAM_PLAYBOOK v1.0 §5 and §8. **Owner: Architect (Friday) authors the rows; the QA Executor (Claudy) records only the Result and Evidence cells in Q1 and rechecks changeable rows at Q2/Q4 entry.** A row the Executor believes is wrong is a GAP/QUESTION in `QAM_RECON_REPORT.md` §4, not an edit. Every result starts `NOT RUN`.

**Executor:** Claudy · **Run at:** NOT RECORDED · **Working directory:** repo root of the `qa/apbm-003-cyber-pharma` checkout · **Results file:** `evidence/preflight/<attempt>/PREFLIGHT_RESULTS.txt`

Q1 is read-only toward product and live business data. SCRATCH destructive work, DEV login probes and STAGING browser work are authorized only where a row says so and only in Q2 under the approved plan.

## Section 1 — Repository and identity

| # | Check | Command (working dir) | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-1.1 | Repository and branch | `git rev-parse --abbrev-ref HEAD` | `qa/apbm-003-cyber-pharma` | read-only | NOT RUN | |
| PF-1.2 | Full HEAD, baseline, candidate | `git rev-parse HEAD`; `git log --oneline <BASELINE>..HEAD` | candidate per Director receipt | read-only | NOT RUN | |
| PF-1.3 | Tracked and untracked state | `git status --porcelain` | empty | read-only | NOT RUN | |
| PF-1.4 | Candidate ancestry | `git merge-base --is-ancestor <CANDIDATE> HEAD` | exit 0 | read-only | NOT RUN | |
| PF-1.5 | Candidate reconciled against the handoff inventory (manifest §2) | `git diff --name-status <BASELINE>..<CANDIDATE>` vs manifest rows | every path accounted for; differences → GAP | read-only | NOT RUN | |
| PF-1.6 | Candidate → HEAD classification | `git diff <CANDIDATE>..HEAD` (full content) | only `QAM/**` and governed bookkeeping; any product content → `STOP-IDENTITY` | read-only | NOT RUN | |
| PF-1.7 | Migrations `0001`–`0047` byte-identical to baseline | `git diff <BASELINE>..<CANDIDATE> -- supabase/migrations/00{01..47}*` | empty | read-only | NOT RUN | |
| PF-1.8 | Protected auth path byte-identical to baseline | `git diff <BASELINE>..<CANDIDATE> -- src/proxy.ts utils/supabase app/api/auth` (+ `protectPage` file) | empty | read-only | NOT RUN | |

## Section 2 — Contract and handoff

| # | Check | How | Expected | Result | Evidence |
|---|---|---|---|---|---|
| PF-2.1 | Spec and contracts carry the FINAL stamp; hashes match `QAM_ENTRY.md` §2 as recorded at resolution | `sha256sum ../APBM_ACCEPTANCE_SPEC.md ../CONTRACTS/*.md` | match | NOT RUN | |
| PF-2.2 | Ruling lane read; R-01..R-10 and §C errata listed; no `<<E1>>` placeholder remains in the frozen text | grep `<<E1>>` | 0 hits | NOT RUN | |
| PF-2.3 | Protected paths and permitted effects understood | read `QAM_ENTRY.md` §3 | — | NOT RUN | |
| PF-2.4 | Governing bodies resolve with version + hash | `GOVERNING/README.md` rows | all resolve | NOT RUN | |
| PF-2.5 | Manifest and handoff complete: every AC-1xx..9xx has a CLAIM row; four-part inventory present; no secret values | read | complete or GAP rows | NOT RUN | |
| PF-2.6 | APPLY checkpoint evidence present (`../EVIDENCE/apply/01…10`, DA-2 file, backup record, rehearsal) | ls | present | NOT RUN | |

## Section 3 — Runtime, tools, resources

| # | Check | Command (working dir) | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-3.1 | Runtime versions | `node --version; npm --version` | per `../EVIDENCE/E1/COUNTS.md` | read-only | NOT RUN | |
| PF-3.2 | Dependency setup from lockfile (QA-controlled) | `npm ci` | exit 0; lockfile unchanged after | authorized: Y (QA checkout) | NOT RUN | |
| PF-3.3 | Playwright and browsers available in the QA lane | `npx playwright --version`; install browsers under `AUTOMATION/` policy | available | local only | NOT RUN | |
| PF-3.4 | `psql` / Supabase CLI available for catalog probes | `psql --version`; `supabase --version` | available | read-only | NOT RUN | |
| PF-3.5 | Evidence lanes writable; protected paths not touched | touch/rm a probe file under `QAM/evidence/`; `git status` shows only QA lane | as stated | QA lane only | NOT RUN | |
| PF-3.6 | `.env.local` is **not** read, hashed or copied by any QA helper | review helper sources | no access | — | NOT RUN | |

## Section 4 — Targets, configuration, readiness, roles, data

| # | Check | How | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-4.1 | SCRATCH resolved by project ref from `QA_SCRATCH_*` keys; unpaused; ready for a catalog query (an HTTP 200 proves nothing) | `select 1` via `QA_SCRATCH_DB_URL` | ref recorded; query returns | read-only | NOT RUN | |
| PF-4.2 | DEV resolved by project ref (= `../EVIDENCE/apply/01_TARGET_IDENTITY.txt`); migration state = applied chain; cast present | read-only catalog query with `QA_DEV_*` publishable key through the app's own paths or a read-only probe the plan authorizes | matches apply evidence | read-only | NOT RUN | |
| PF-4.3 | STAGING URL serves the candidate revision (image digest ↔ commit from `../EVIDENCE/deploy/`) | `curl -sI` + revision record | matches | read-only | NOT RUN | |
| PF-4.4 | Cast identities exist on the target (E-17): `OWNER1`, `OWNER3`, `ADMIN_B2`, `ADMIN_B3`, `MEMBER_B1`, `MEMBER_B2B3`, `UNRELATED` (+ `OPERATOR` only if authorized) | Director-verified at the seed run; Executor confirms by a bounded login probe only in Q2 | exist | Q2: bounded login (creates session/audit rows, acknowledged) | NOT RUN | |
| PF-4.5 | Suitable test data: per-store row counts and coverage per the FINAL `../CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` §3 | read-only counts through wrappers or the plan's authorized probe | matches | read-only | NOT RUN | |
| PF-4.6 | `.env.qa.local` declared, **ignored and untracked**, schema valid, no values echoed | `git check-ignore -v .env.qa.local`; `git ls-files --error-unmatch .env.qa.local` (expect failure); key-name check | ignored; untracked; keys per `QAM_ENTRY.md` §4 | read-only; no values printed | NOT RUN | |
| PF-4.7 | DA-2: "Allow new users to sign up" OFF on DEV and SCRATCH | `../EVIDENCE/apply/DA-2_SUPABASE_SIGNUP_DISABLED.md` + an independent signup attempt in Q2 (expect rejection) | OFF | Q2 probe | NOT RUN | |

## Section 5 — Browser, instrumentation, auth probes

| # | Check | How | Expected | Authorized effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-5.1 | Browser driver launches; both themes and 375px viewport reachable in the app | Playwright smoke on STAGING login page (no sign-in in Q1) | works | local only | NOT RUN | |
| PF-5.2 | Privacy scanner validated with a synthetic leak fixture **and** a clean control | run the scanner on both | fixture detected; control clean | local only | NOT RUN | |
| PF-5.3 | Permitted auth probe (bounded login/logout with one cast identity) | Q2 only, per plan | works; session/audit activity acknowledged | Q2 | NOT RUN | |
| PF-5.4 | Instruments the plan will rely on exist and can fail: `rls:prove`, `audit:prove`, `db-verify`, the seed comparator, the identity scanner | locate; plan one deliberate attack each (SR-8) | located | read-only in Q1 | NOT RUN | |

## Section 6 — Packaging and recovery

| # | Check | How | Expected | Result | Evidence |
|---|---|---|---|---|---|
| PF-6.1 | Can produce a safe review package (dry run of `QAM_PACKAGING.md`, exclusions honored) | dry run | index + hashes verified | NOT RUN | |
| PF-6.2 | Can recover after interruption (`QAM_STATE.md` readable; evidence lane durable) | read | — | NOT RUN | |

## Outcome

| Field | Value |
|---|---|
| Blockers (GAP / QUESTION / BLOCKED with owner and exact resolution) | NOT RECORDED |
| Readiness for Q1 planning | NOT RECORDED |
| Rows to recheck at Q2 entry | PF-1.2, PF-1.3, PF-1.6, PF-4.1, PF-4.2, PF-4.3, PF-4.6 |

*Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3.*
