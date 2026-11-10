# APBM-003 DEV APPLY resume — BLOCKED

Fresh read-only checks completed **2026-11-06T14:41:19.340Z**. Repo `cyph-v1-dev`, branch `apbm-003`, HEAD `49dec499d665125bb8764ccc8ea498c5fdfcdcd1`; existing Stage 6 and earlier documentation changes remain uncommitted. Tony retains shared DEV writes and Git authority. The Director accepts Stage 6 on SCRATCH and assigns the manual app smoke test to Tony tomorrow morning. The two copy-only changes remain pending separate approval and untouched.

## Verified now

- Both private backup files still match their original SHA-256 receipts and retain 0600 permissions. Archive SHA: `1d33881a1b49f85d20ecee6514a56f94552055efd6dc19f58942b12316dda692`; private proof SHA: `da66a9e80edf45999acae890f4f933dee27d356d68c4bff260d21165012c2600`. No archive/proof was replaced or edited.
- PostgreSQL pg_dump and pg_restore at `/usr/lib/postgresql/17/bin/` both report 17.11; DEV and SCRATCH servers report 17.6.
- All 56 current source-manifest hashes match. Historical Stage 6 proof, private backup, E1 and the recorded 30/30 post-restore comparison remain preserved.
- DEV `yrsuwikjnbmvpznrgydb` SQL/API refs agree. A read-only connection using APBM_DEV_DB_POOL succeeds. DEV's pre-bootstrap public catalog is unchanged (`da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b`); APBM ledger remains absent. All four required Auth indexes are present with exact definitions and valid/ready/live flags.
- Existing approved disposable SCRATCH `ihgcsrypblqkwommrkgj` is reachable and still matches its 0052 catalog (`66782ff92213415443d428ade161b165e04a5aba29999453cb0ab34a7160d061`). It has not been restored from the DEV archive. No other approved clone/restore target or corresponding credential set is recorded in the checked handoff/environment.

## Consolidated blockers and exact next actions

### 1. Restore target cannot recreate four required Auth indexes

Fresh inspection confirms SCRATCH still lacks:

- `idx_users_created_at_desc`
- `idx_users_email`
- `idx_users_last_sign_in_at_desc`
- `idx_users_name`

Its postgres credential is not a superuser, cannot CREATE in auth, and cannot inherit or SET ROLE to the auth.users owner, supabase_auth_admin. DEV has the same privilege limitation. A logical restore using these credentials cannot preserve all four indexes. No restore has begun; the existing SCRATCH fixtures are intact.

**Tony's next action:** ask Supabase support to recreate the four exact definitions on existing SCRATCH through a supported owner/privileged path, using [SCRATCH_AUTH_INDEX_PREREQUISITE.sql](../dev-restored-rehearsal/SCRATCH_AUTH_INDEX_PREREQUISITE.sql). The ready-to-send request is in [CLONE_REVIEW.md](../dev-restored-rehearsal/CLONE_REVIEW.md), under Conditional support request. Ask them to verify definitions and validity, and not modify DEV. Alternatively identify an already existing, explicitly approved disposable target with a supported restore path; no paid project should be created for this task. Do not grant managed-role membership, edit system catalogs, or omit the indexes.

### 2. Standard DEV runner variable is still direct

APBM_DEV_DB_URL still contains the direct endpoint on disk. APBM_DEV_DB_POOL contains the working Session pooler. Their project refs agree, but the values differ. This read-only check used an explicit in-memory mapping; it did not edit .env.local or introduce runner fallback.

**Tony's next action:** copy the existing APBM_DEV_DB_POOL value into APBM_DEV_DB_URL locally, with valid dotenv quoting. Both should hold the same working Session pooler URL for `yrsuwikjnbmvpznrgydb`. Keep credentials out of chat.

### 3. Fresh DEV signup evidence does not meet the disabled-signup checkpoint

GET `/auth/v1/settings` on the pinned DEV API, using publishable apikey only, returned HTTP 200 and **disable_signup=false** at **2026-11-06T14:41:17.347Z**. This verifies the reported global disable flag is off; no signup attempt, login/session or settings mutation was performed. It does not test whether any particular registration method succeeds.

**Tony's next action:** supply a **DEV APPLY checkpoint-specific waiver**, or have the setting disabled under your authority and let Cody reverify it. The recorded waiver was for E2 launch. The existing `checkpoint-receipt.mjs` explicitly requires signupDisposition `evidence` or `director-checkpoint-waiver`, a reference and maintenanceReady=true before DEV commands. No checkpoint receipt with that disposition is on file. This evidence is now present; a disabled-signup PASS is not.

### 4. Managed default ACL execution/verification is still unresolved

The strict bootstrap SQL and runner require a supported operator able to reconcile the three supabase_admin public default ACL entries. The supplied roles do not have that authority. The exact three-entry exception evaluator exists and passed its recorded local tests, but it is authorized for SCRATCH evaluation only and is not integrated into the strict transaction runner. No DEV baseline exception is authorized or inferred.

**Tony's next action:** obtain the supported privileged execution path for the three managed ACL changes required by the strict DEV bootstrap, or route the execution/verification question to JARVIS for an explicit ruling. Do not execute changes on shared DEV now. After the Auth-index restore gate is cleared, Cody must finish the authorized SCRATCH exception integration and live proof before issuing a complete rehearsal receipt. The exception will not be expanded to other objects or additional entries.

## Rehearsal and command-release status

Restored-copy preservation, bootstrap to 0047, ledger initialization, 0048–0052, synthetic seed and Owner verification for **this restore rehearsal** are all **NOT RUN**. Prior Stage 5/6 SCRATCH checks remain valid historical implementation evidence; they are not relabelled as a DEV-backup restore rehearsal.

`DEV_COMMANDS.sh` and `REHEARSAL_COMMANDS.sh` remain conditional, gated templates, **not released commands to run tonight**. The strict runner's backup/rehearsal/checkpoint receipt gates must remain in place. A private archive hash alone is not a completed affected-state recovery receipt. No PASS receipt was fabricated or gate bypassed. Once the supported target and prerequisites pass, complete the requested sequence and regenerate the reviewed source/bundle-bound commands for Tony.

Only read-only SQL catalog queries and the read-only Auth settings GET ran this turn. No restore, import, seed, migration, ledger initialization, authenticated probe, project creation or database write occurred on either target. No Git mutation or product-source edit occurred. Credentials and backup contents remain private.

Evidence: READINESS.json, SOURCE_CHECK.json, readiness.mjs. Existing backup receipt: ../dev-restored-rehearsal/SNAPSHOT_BACKUP.json. Recorded preservation PASS: ../dev-post-restore/PASS_20261106T130308Z.json.
