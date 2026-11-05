# APPLY_CHECKPOINT — APBM-003-CYBER-PHARMA (declared Director stop inside E2)

**Executor:** the Director (Tony), hands on the terminal. **Prepared by:** Cody at the end of stage 5 (exact commands, in order, with expected output). **Verified by:** Claudy in Q2 (AC-401..AC-405). **Why a stop:** this is the first time the real schema touches the shared dev project; it cannot be undone by a script, so it is a human's hands with a backup underneath.

This file is the procedure. Each numbered step is one terminal message from an agent to the Director: one command, wait for the paste, label whose turn it is. Full paths every time.

## 0. Prerequisites (all must be true before step 1)

| # | Condition | Evidence file |
|---|---|---|
| A-0.1 | `APBM_STATE.md` = `E2 PAUSED — APPLY CHECKPOINT (Director)`; stage 5 green on SCRATCH (`EVIDENCE/E2/stage-5/`) | — |
| A-0.2 | DA-2: "Allow new users to sign up" OFF on DEV **and** SCRATCH; curl proof | `EVIDENCE/apply/DA-2_SUPABASE_SIGNUP_DISABLED.md` |
| A-0.3 | DEV project identified by ref (from the dashboard URL or `supabase projects list`); never by a label | `EVIDENCE/apply/01_TARGET_IDENTITY.txt` |
| A-0.4 | DEV current state recorded read-only: tables, policies, `handle_new_user()` text | `EVIDENCE/apply/02_DEV_BEFORE.txt` |
| A-0.5 | A backup of DEV exists (dashboard backup or `pg_dump` of `public` + `auth` schema metadata as the Director chooses) and its location is recorded (never its contents) | `EVIDENCE/apply/03_BACKUP_RECORD.md` |
| A-0.6 | Rehearsal: the full forward chain plus seed applied to a **throwaway clone** bootstrapped like DEV (2-table baseline + the metadata trigger), then `db-verify`, `rls:prove`, `audit:prove` green there | `EVIDENCE/apply/04_REHEARSAL.txt` |

## 1. Apply (DEV)

| Step | Who | Command / action | Expected |
|---|---|---|---|
| 1 | YOU | `set -a; source .env.local; set +a` (DEV keys under their own prefix; names recorded in `EVIDENCE/env/ENV_NOTE.md`) | no output |
| 2 | YOU | the repo's `db:apply` command against DEV (exact invocation prepared by Cody from E1 Q2.4), forward-only, never reset | applies `0001`–last; summary line pasted |
| 3 | YOU | catalog check (Cody prepares the query file) | table count, policy count, function count = the FINAL spec numbers (AC-402) |
| 4 | YOU | `pg_get_functiondef('public.handle_new_user')` | equals the OD-7 migration text (AC-404) |
| 5 | YOU | seed on DEV: `seed:run` once (never `seed:reset` here unless a re-run is being deliberately performed under §5) | cast present; row counts per store = FINAL spec (AC-403) |
| 6 | YOU | `rls:prove` and `audit:prove` against DEV with the QA env prefix | green (AC-403) |
| 7 | YOU | E-4 default-ACL probe (Cody prepares: what `anon` and `authenticated` can see on the new tables with no policy match) | nothing (AC-405) |

Every pasted output goes into `EVIDENCE/apply/` as `05_APPLY.txt`, `06_CATALOG.txt`, `07_TRIGGER.txt`, `08_SEED.txt`, `09_PROVE.txt`, `10_ACL.txt`. No secret values appear in any of them (the Director checks before saving).

## 2. If anything in §1 is not as expected

Stop at that step. Do not continue to the next. Record the discrepancy in `EVIDENCE/apply/STOP.md` (step, expected, observed). Options, in order: (a) the discrepancy is a known rehearsal difference → Cody explains, Director decides; (b) the chain failed mid-way → restore from the §0.5 backup, record the restore, return to E2 as a stage-5 defect; (c) unknown → `STOP-ENV`, JARVIS adjudicates. Never "fix forward" on DEV by hand.

## 3. Completion

| Step | Who | Action |
|---|---|---|
| 8 | YOU | commit `EVIDENCE/apply/**` on `apbm-003-cyber-pharma` with the suggested message; paste the receipt |
| 9 | YOU | `APBM_STATE.md` → `APPLY COMPLETE` then `E2 RESUMED` (one entry each, dated) |
| 10 | CODY | resumes at stage 6 against DEV |

## 4. Director touches budgeted for this checkpoint

Seven terminal steps plus one commit. Recorded in `EVIDENCE/E2/METRICS.md` by purpose ("credentialed apply").

## 5. Re-run procedure (tester reseed requests after Target One)

Same prerequisites §0.2–§0.5; `seed:reset` then `seed:run` on DEV under the Director's hands; audit rows from prior runs remain (by design); `EVIDENCE/apply/RESEED_<date>.txt`. Never from a shell habit, never by an agent.

🥄
