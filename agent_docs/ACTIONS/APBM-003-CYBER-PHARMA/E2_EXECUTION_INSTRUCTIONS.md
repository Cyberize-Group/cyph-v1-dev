> **Proposed A01 alignment — DRAFT:** Read `E2_AMENDMENT_A01.md` before this inherited draft. Its identity, exact file list, deferred customer writes, safe target/checkpoint rules and independent Gate Q/Gate D requirements replace contradictory proposals here only upon approval. No result, FINAL stamp or release is recorded.

# E2_EXECUTION_INSTRUCTIONS — APBM-003-CYBER-PHARMA (Shot 2 of 4)

**Seat:** Cody, Engineering Executor. **Starts only when** `APBM_STATE.md` reads `E2 APPROVED` with the Director's approval reference and JARVIS's FINAL stamp on `APBM_ACCEPTANCE_SPEC.md`. **Ends when** the factual engineering/QAM handoff is complete and `APBM_STATE.md` reads `E2 COMPLETE — AWAITING QA BRANCH`.
**Method:** APBM_PLAYBOOK v1.0 §7 (one continuous execution). Internal stages are checkpoints for you, not stopping points for the Director — except stage 5, which is a **declared Director stop**. Do not return for "say go for the next chunk".

## 1. Preflight (machine-checkable, first thing, recorded in `EVIDENCE/E2/PREFLIGHT.md`)

| # | Check | Expected |
|---|---|---|
| E2-P1 | Branch `apbm-003`, HEAD = the approved candidate base, tree clean | yes |
| E2-P2 | `APBM_STATE.md` = `E2 APPROVED`; `APBM_ACCEPTANCE_SPEC.md` carries the FINAL stamp; every `<<E1>>` resolved | yes |
| E2-P3 | `.env.local` present with SCRATCH keys under the CF-8 prefix (names only); `set -a; source .env.local; set +a` works | yes |
| E2-P4 | SCRATCH unpaused and reachable for the required operation (not just an HTTP 200) | yes |
| E2-P5 | Baseline board: build, tsc, lint, full suite green at the baseline numbers from E1 (a red baseline is a finding, not something to repair silently) | green |
| E2-P6 | Protected paths listed in `APBM_ENTRY.md` §4 untouched (hash snapshot taken) | snapshot saved |
| E2-P7 | A01 readiness: inspect target fencing and output paths before any proof; legacy runners must not write historical evidence or use mixed-target fallbacks. Implement authorized runner safety before SCRATCH proofs; no destructive DEV invocation | green |

Any red readiness row: stop and aggregate. After readiness passes, perform stage 0 runner fencing within the exact allowlist; prove target/output rejection locally and on a disposable target before any destructive proof. E2-P7 is a safety-review gate, not a demand to run unfenced legacy tools.

## 2. The eight stages (each ends: instrument green → `EVIDENCE/E2/stage-N/` → journal entry → ledger rows updated)

| Stage | Build | Instrument that must be green before the next stage | Allowed write surface |
|---|---|---|---|
| 1 Ownership delta | Migrations `0048+` per A01 ownership rules: helper, replaced SELECT policies, all customer billing/account writes denied, one-admin index and governed system_config schema | from-scratch replay on SCRATCH; reviewed SCRATCH catalog verifier (no npm audit:catalog script exists); the A01 expected-change list applied to the matrix as **expected**, not yet proven | Stage 1 exact allowlist |
| 2 Trigger correction | OD-7 migration redefining `handle_new_user()` | `pg_get_functiondef` equals migration text; a metadata-role signup on SCRATCH lands as `member` | Exact allowlist for this stage |
| 3 Read-audit closure | Drop the BIM-002 member SELECT policy on `user_data`; revoke `SELECT` from `authenticated`; admin read paths as SECURITY DEFINER functions logging `read_page` (names per O-04/O-06 resolution) | direct-read denial for owner/admin/member tokens; wrapper calls succeed; OAC §4 counts observed on SCRATCH | Exact allowlist for this stage |
| 4 Seed + fixtures | Generator, `seed:reset`/`seed:run`, identity scan, canonical-hash comparator, `scripts/seed/README.md`; `mocks/owedbook.ts` regenerated (if R-05 confirmed) | AC-201..AC-207 self-checks; RRM-002 money-rule audit 0 failures on the new mocks; comparator attacked once | Stage 4 exact allowlist |
| 5 Harness rework + **DECLARED STOP** | CF-8/CF-9 repairs; matrix updated to certified-plus-expected-change; `rls:prove` + `audit:prove` green from scratch on SCRATCH; `db-verify` AC7 green | all three green; evidence packaged as `EVIDENCE/E2/stage-5/` | Stage 5 exact allowlist |
| **STOP** | Record `APBM_STATE.md` → `E2 PAUSED — APPLY CHECKPOINT (Director)` with the exact files the Director will run (`APPLY_CHECKPOINT.md`), then stop. **Resume only** when the Director records `APPLY COMPLETE` with the evidence file paths in `EVIDENCE/apply/` and sets state `E2 RESUMED` | — | — |
| 6 Service swap + admin reads | `services/owedbook.ts` → wrappers; `services/adminDemo.ts` read methods → real; write methods → explicit "unavailable" state; R-016 states in the O-04 files only; store picker from `my_business_ids()` through a wrapper or RPC E1 named | against DEV: AC-503/504/505/507/601..603 self-checks with the cast; component diff limited to O-04 | Stage 6 exact allowlist |
| 7 Board + regression | — | build, tsc, lint 0 errors, full suite green, 0 skipped; lockfile unchanged (AC-804); protected-path hashes unchanged (E2-P6) | Stage 7 exact allowlist |
| 8 Candidate + deployment-package handoff | Prepare deployment artifacts and rollback/config instructions without cloud effects. Complete engineering manifest/handoff and draft tester limitations; Tony commits candidate and cuts qa/apbm-003 at its full SHA for Claudy. | Local board and package integrity pass; candidate identity pinned before Q1 | Stage 8 exact allowlist only |

Stages 1–5 use confirmed SCRATCH after stage 0 fencing. The Director DEV APPLY stop remains inside E2. Stages 6–7 use authorized DEV reads (audit/session effects declared). Stage 8 prepares the candidate/deployment package locally. E2 does not deploy. Claudy independently tests Gate Q on the identified candidate; only afterward may separately approved deployment publish that certified candidate, followed by Gate D on the actual revision. No DEV reset is authorized.


### Exact stage permissions (ceiling)

The finite file list in E2_AMENDMENT_A01.md §Exact proposed file permissions is the ONLY product-file ceiling. Relative filenames in its parenthetical groups resolve to the explicitly named directory; they are individual files, not globs. The following assigns that finite list to stages. Both the stage assignment and finite list must permit a file. No broader path in any older plan, table or entry expands permission. New filenames require a recorded amendment. Package.json changes are scripts only; no dependencies/lockfile changes.

| Stage | Subset of that finite list |
|---|---|
| 0 Runner fencing, before any destructive proof | The individually listed scripts/rls-harness files, scripts/db-verify.mjs, scripts/apply-forward.mjs, scripts/dev-verify.mjs, package.json scripts. Target identity/fail-closed prefix and output-root fencing first; no product feature changes. |
| 1 | 0048_ownership.sql and 0052_system_config.sql only under supabase/migrations; src/types/supabase.ts |
| 2 | supabase/migrations/0049_signup_member.sql |
| 3 | supabase/migrations/0050_claim_read_fence.sql and 0051_admin_reads.sql; src/types/supabase.ts |
| 4 | The six named scripts/seed files; src/mocks/owedbook.ts; package.json scripts |
| 5 | Same runner-file subset as stage 0; three explicitly named apbm test files for instrument validation |
| 6 | The individually named src/services, src/types, OwedBook components, StoreSelector, admin layout, global navigation and admin-portal component files; three named apbm tests |
| 7 | Only the three named apbm test files; approved test/build artifacts. Any product repair returns to its owning stage and permissions. |
| 8 | Dockerfile, cloudbuild.yaml, deploy.sh, deploy.config.json, DEPLOYMENT_PLAYBOOK.md, .dockerignore — local preparation only; APBM evidence, manifest and engineering handoff |

Documentation/evidence writes remain confined to APBM authorized lanes. Test/build caches may be written only as recorded bounded artifacts after E2 release; never use that allowance to edit product outside the list. Deployment configuration values await target approval; no speculative secrets or cloud changes.

## 3. Rules that do not bend

- One active writer: you, on `apbm-003`. Record every owned process and temp path at handoff.
- Git: read-only inspection allowed; **every mutation is the Director's.** Prepare exact scoped commands (paths listed, never `git add .`; `git add -A` is the Director's adopted form) and suggested messages per stage; the Director commits per stage.
- Protected paths (`APBM_ENTRY.md` §4): never written. Migrations `0001`–`0047` never edited; append only.
- No secrets in any file, log, screenshot or package. `.env.local` is never printed, hashed or copied.
- Frozen contract: if a stage reveals the spec is wrong, record the observation with file:line in `EVIDENCE/E2/CONTRACT_QUESTIONS.md`, continue unaffected work, and route it through `APBM_RULINGS.md` §C via JARVIS. You do not reinterpret an AC.
- Instruments: attack each new oracle once (comparator, scanner, counts) and keep the failing run.
- `git --no-pager` for anything pasted to a human; temp-then-move for any redirect into a tracked file (BIM-003 lesson).
- Do not install dependencies, change `next.config.*`, touch the auth path, or add a package without a ruling.

## 4. Stop conditions (record `STOP-*` with phase, time, identity, affected checks, evidence, owner, resolution, safe resume point; aggregate; return)

STOP-IDENTITY (wrong branch/HEAD/target) · STOP-CONTRACT (an AC cannot be built as written) · STOP-ENV (SCRATCH/DEV/cloud unreachable or paused) · STOP-AUTH (credential missing or would have to be exposed) · STOP-AUTHORITY (a needed change is outside the allowed write surface) · STOP-INSTRUMENT (an oracle cannot be trusted) · STOP-PRIVACY (any real-looking data or secret surfaces) · the declared APPLY stop (not a failure; a scheduled Director checkpoint).

A failing self-check is a defect to fix inside the stage, not a stop — unless fixing it needs a ruling.

## 5. Handoff duties (part of E2, not a later task)

`QAM/QAM_MANIFEST.md` §1–§8 and `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` §1–§6 per QAM_PLAYBOOK §7: identity with the candidate `PENDING`, the four-part change inventory, every AC as a CLAIM with command/working dir/result/evidence, reproduction from a clean clone, environment and key **names**, limitations, meaning of each evidence item. `APBM_ACCEPTANCE_LEDGER.md` updated. `APBM_JOURNAL.md` stage entries. Metrics (wall-clock per stage, Director touches by purpose, self-repairs, stops) in `EVIDENCE/E2/METRICS.md`. One indexed ZIP `EVIDENCE/APBM-003-CYBER-PHARMA_E2_COMPLETION_01.zip` and a Git reminder listing the exact paths for the Director's candidate commit.

🥄
