# APBM-003 — reviewed DEV executor v2

**Executor adaptation complete; DEV APPLY remains BLOCKED because the saved signup-disabled setting is not observed.** On 2026-11-07, the live release check and two independent uncached Auth-settings reads (publishable and secret key, both HTTP 200, cache status DYNAMIC) still report `disable_signup=false` for `yrsuwikjnbmvpznrgydb`. Both DB variables are identical working Session poolers and match the API target. Backup/preservation, schema, grants, privileges and all four Auth indexes pass. No waiver is requested or recorded. See `DEV_SIGNUP_CHECKPOINT.json` and `VALIDATION.json`.

This handoff supersedes the previous `dev-bootstrap-execution/DEV_COMMANDS.sh` and its full-restore receipt gate. Use the v2 commands below. Cody has run only local tests and live read-only DEV checks. Tony retains Git and executes all DEV writes.

## Accepted scope and evidence

- Reuse the accepted narrow rehearsal completed `2026-11-06T15:02:40.230Z` and handed off about 9:13 PM local: `../dev-application-rehearsal/RESULT.json`. No rehearsal was repeated. The proof covers synthetic starting-state preservation, bootstrap rollback, 0047 before ledger, 0048–0052, seed, 19 Owner and 154 real-client checks. It is not a physical restoration or full provider recovery proof; v2 records `restoreVerified: false`.
- JARVIS's current ruling accepts exactly the three recorded `supabase_admin` default ACL entries on DEV, conditional on effective privileges/RLS and real-client RPC/cross-store denial proofs. `RULING.md` records that direction. The executor requires all three unchanged payloads; missing/partial/duplicate/fourth/modified entries fail. All other catalog checks remain exact.
- `DEV_APPLICATION_BOOTSTRAP.sql` performs the same SQL operations as the accepted SCRATCH application body. Only comments differ. It does not execute the three old managed ACL revocations, create managed roles, or change any Auth index. It keeps the existing owner foreign-key behavior.
- All four existing Auth indexes are checked for exact definitions, non-unique status, validity, readiness and liveness before bootstrap, inside its transaction, after bootstrap, and throughout later verification. All Auth-user indexes are also compared with the captured original set.
- Current live read-only check: original DEV public catalog and absent APBM ledger match; all 30 retained table fingerprints and metadata match the private backup; all four indexes pass; current effective table/function grants and schema usage pass. Read-only settings report signup enabled.
- 67 local guard/transaction tests PASS, including target/mode fencing, exact ACL exception limits, index changes, preserved-row multiplicity, explicit signup scope, effective-grant failures, rollback and unknown COMMIT. Tests use synthetic adapters and make no database calls. `TEST_RESULTS.json` contains the individual results.
- `BUNDLE_INPUTS.json` pins the application sources, migrations, accepted rehearsal receipts, backup receipt, expected catalogs, executor, SQL and command scripts. The existing 56 application/source hashes are unchanged. Expected DEV catalogs retain the three approved managed ACL entries; their normalized 0047/0051/0052 contents exactly match the reviewed canonical catalogs.

## One outstanding prerequisite

Tony reports signup disabled; current API observations disagree. Failed checkpoint: `SAVED_SIGNUP_DISABLED_SETTING_NOT_OBSERVED` (the existing executor reports `DEV_SIGNUP_CHECKPOINT_WAIVER_REQUIRED`). The requirement is disabled signup; no waiver is needed or being sought.

Exact next action: open [Dev v1 Auth settings](https://supabase.com/dashboard/project/yrsuwikjnbmvpznrgydb/auth/providers), confirm the project ref, turn **Allow new users to sign up** off and save. Then request a read-only recheck. This is the global signup switch described in [Supabase's official configuration documentation](https://supabase.com/docs/guides/auth/general-configuration). `Confirm Email` is a separate setting. No signup attempt was made and no setting was changed by Cody.

The coordinated maintenance confirmation below remains Tony's execution-time responsibility. Keep app/Auth user activity and provider Auth migrations paused through final verification. `auth.schema_migrations` is SELECT-only for `postgres`: its ACCESS SHARE lock blocks schema changes but cannot block a provider's concurrent ledger inserts. Its exact salted fingerprint is checked before/after bootstrap and subsequent phases; any drift stops the run. All other 29 preserved tables keep SHARE ROW EXCLUSIVE locks during bootstrap. No row, metadata or baseline check was dropped; no managed write privilege was granted. This lock adjustment is locally tested, not a repeated database rehearsal. PostgreSQL 17's lock-privilege rules are documented [here](https://www.postgresql.org/docs/17/sql-lock.html). It prevents concurrent app/Auth activity from invalidating preservation comparisons. The conditional ACL ruling is not declared satisfied on DEV until the final effective-grants and real-client proof receipt passes.

## Exact ordered commands for Tony

The exact scoped staging/commit commands are in `GIT_RELEASE_COMMANDS.md`. `RELEASE_PATHS.txt` contains literal files: executor-required inputs, the previously reviewed Stage 6 source/evidence, the accepted narrow rehearsal evidence, current APBM handoff/state records and this checkpoint. It covers every currently modified tracked file; it excludes credentials, private backups, unrelated untracked files, and the two pending copy-only files. The initial index must be empty. Cody does not stage or commit.

`GIT_INPUT_PATHS.txt` remains the runtime input list; use the broader, finite `RELEASE_PATHS.txt` for this documentation-inclusive review commit. `RELEASE_SHA256.json` records reviewed bytes. Historical reports may retain their original BLOCKED statuses; the current checkpoint remains explicitly BLOCKED until the saved signup setting is verified.

After the signup check is cleared and you have committed the reviewed files, execute the following **in the approved maintenance window**. Setting the confirmation and running the script is your write step; Cody does not run it:

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
export APBM_RELEASED_RUNNER_COMMIT="$(git rev-parse HEAD)"
export APBM_DEV_MAINTENANCE_READY=yrsuwikjnbmvpznrgydb
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RUN_DEV_APPLY.sh
```

`RUN_DEV_APPLY.sh` is the exact ordered command file, with `set -euo pipefail`. It performs:

1. Read-only current checks: target, both pooler variables, reviewed hashes, accepted rehearsal, signup evidence/waiver, backup/live equality, original catalog, absent ledger and indexes.
2. Read-only capture of private row fingerprints, roles/metadata and all Auth-user index definitions into a fresh 0600 `/tmp/apbm003-dev-v2-preservation-*.json`.
3. Tony-confirmed bootstrap in one transaction. Takes write-blocking locks on 29 preserved tables and ACCESS SHARE on SELECT-only `auth.schema_migrations`; checks original catalog and backup/preservation again; executes the application SQL; checks normalized 0047, exact effective grants, indexes, unchanged rows/metadata and 14 empty new tables **before COMMIT**. A second read-only check verifies the committed state.
4. Independent 0047 verification **before APBM ledger initialization**.
5. Initialize the exact 47 migration hashes, then verify catalog/preservation/indexes and ledger again.
6. Apply only 0048–0052, each migration and ledger row in its own transaction; verify exact 0052 catalog, grants/RLS, indexes and preservation.
7. Create the seven approved test accounts/roles and synthetic slice once; verify 250 claims, independent arithmetic, seed hash, attribution and original-row preservation. A collision or nonempty new table stops before seeding.
8. Explicit real-client Owner and bounded verifier proofs: Owner access without junction rows, scoped RPC grants, direct-read denial and cross-store denial. Expected effects: eight login/logout sessions and 52 audited read inserts. Seed separately creates seven identities and 285 insert audit rows.
9. Read-only final receipt requires 19 Owner checks, 154 user checks, seed verification, effective grants/RLS, preserved rows and unchanged indexes. Only then does it mark the conditional ACL acceptance satisfied on DEV. Tony's manual app smoke is still pending.

Each phase writes a timestamped receipt. The script prints the run directory. `RUN_CONTEXT.json` records only paths and the reviewed commit, never credentials. Keep the private preservation and cast files intact. Do not rerun the whole script after a partial failure.

## Test-account and role recreation steps — retained

The approved synthetic test accounts are recreated by step 7 through `scripts/seed/run.mjs`, using Supabase's administrative user API, with fresh private passwords and confirmed synthetic emails. Do not insert Auth rows manually or delete/recreate the five preserved original DEV users.

| Test handle | Global `user_roles.role` | Tenant role/access recreated by seed |
|---|---|---|
| OWNER1 | member | Account A owner; A1 admin junction |
| OWNER3 | member | Account B owner; B1 admin junction; B2/B3 access via unchanged owner FK behavior, no fabricated junctions |
| ADMIN_B2 | member | B2 admin |
| ADMIN_B3 | member | B3 admin |
| MEMBER_B1 | member | B1 member |
| MEMBER_B2B3 | member | B2 and B3 member |
| UNRELATED | member | Account C owner; C1 admin; denied access outside that account |

There is no Operator account. Profiles, global roles, accounts and tenant junctions are explicitly established by the approved seed and verified afterward. Its private 0600 `APBM_CREDENTIAL_FILE` is the login source for Owner/access proofs and Tony's smoke test; passwords never enter Git or chat. Existing global roles remain unchanged; “Owner” is an account relationship, not a new enum/global superadmin role.

If an existing test account/role must be recovered outside this seven-user cast, stop and identify the exact account and intended role privately for a separately reviewed repair. Do not overwrite a preserved user, infer admin privileges from email/metadata, or use a broad role update. If seed partially fails after Auth creation, preserve the cast file and receipts; inspect the exact survivors before any scoped repair. There is no automatic delete/reset/recreation retry on shared DEV.

## Verification and recovery commands

For a failure, keep the original run directory and private proof. Set the original directory printed by the apply script; recovery loads the private proof/cast paths from its `RUN_CONTEXT.json` without printing credentials:

```bash
export APBM_EVIDENCE_DIR='/absolute/original/DEV_V2_run_directory'
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh inspect
```

Inspection is read-only and does not require the signup waiver. It rechecks target/bundle/backup hashes, original indexes, ledger hashes and recognized catalogs, with preserved rows when the private proof exists. It classifies:

- `ORIGINAL_NO_LEDGER`: bootstrap did not persist. For a reported rollback, correct the cause and review a fresh run. For `UNKNOWN_COMMIT_OUTCOME`, inspect first; never assume rollback.
- `BASELINE_0047_NO_LEDGER`: bootstrap persisted with matching rows/indexes. After reviewing its receipt, continue with the original proof from ledger initialization; never replay bootstrap.
- `MATCH_47`: historical ledger initialized; continue with forward apply after review.
- `MATCH_51`: exact previously rehearsed partial boundary before 0052; only this remaining-chain recovery is packaged below.
- `MATCH_52`: forward DDL completed. Inspect seed/probe receipts and cast before choosing the next stage. Do not rerun the seed blindly.
- `UNRECOGNIZED_STOP_FOR_REVIEW`: stop and obtain a reviewed diagnosis/continuation. No missing schema is manufactured or accepted as a new baseline.

For the exact `MATCH_51` case, once Tony reviews the failed 0052 receipt and approves the remaining-chain action:

```bash
export APBM_RELEASED_RUNNER_COMMIT="$(git rev-parse HEAD)"
export APBM_DEV_MAINTENANCE_READY=yrsuwikjnbmvpznrgydb
export APBM_DIRECTOR_RECOVERY=yrsuwikjnbmvpznrgydb
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh resume-0052
```

This checks the exact 0051 catalog/ledger/rows/indexes, runs only the remaining 0052 migration and verifies 0052. It never edits ledger history or resets/replays DEV. Earlier successfully committed migrations remain after any forward failure. Other partial boundaries require a reviewed continuation; no automatic “skip failed migration” exists.

If you need to continue a recognized clean checkpoint, first restore `RLS_HARNESS_PREFIX=APBM_DEV_`, `APBM_TARGET=dev`, `APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb`, the original evidence/proof/cast paths from `RUN_CONTEXT.json`, reviewed commit and maintenance confirmation. Run the exact remaining phase commands from `RUN_DEV_APPLY.sh`, with Tony's explicit `APBM_DIRECTOR_APPLY`/probe confirmations. Each phase independently rejects the wrong state. Do not run the top-level script again, because it allocates new context and expects the untouched starting database.

A full DEV-backup restoration is not certified by the accepted narrow proof. If recovery requires restoring actual DEV data/provider internals, Tony/DevOps must separately validate that recovery operation. The retained private backup and four existing Auth indexes remain intact; no support ticket/new project/index recreation is requested. No new `pg_restore` command is authorized here.

## Stopping point

Cody stops with this executor, tests, read-only release evidence and commands. Shared DEV has no new schema, ledger, seed or authenticated-probe writes from this work. Product code, the pending copy-only edits, Git and cloud settings remain untouched. Independent Gate Q and deployed-revision Gate D remain separate from DEV APPLY and Tony's manual smoke.
