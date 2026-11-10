# APBM-003 post-restore read-only comparison — historical failed attempt

> **2026-11-06 update: comparison PASS.** The subsequent run finished at 13:03:08 UTC with 30/30 table fingerprints and complete recorded catalog/role preservation matching. See PASS_20261106T130308Z.json and [the current handoff](CLONE_SAFETY_HANDOFF.md). The failed attempt below and RESULT.json are retained unchanged as historical evidence. The outbound-action inspection also passed; the current handoff records its scope, the remaining DB_URL configuration mismatch and the dashboard cost-review step.

Date: 2026-11-06. Target: CyberPharma_Dev_v1 `yrsuwikjnbmvpznrgydb`.
Director reports an in-place restore to scheduled backup **2026-11-06 07:37:54 UTC**. That restore point is Director-provided, not independently confirmed through provider management access.

## Completed checks

- Later archive retained unchanged; SHA-256 matches its receipt: `1d33881a1b49f85d20ecee6514a56f94552055efd6dc19f58942b12316dda692`.
- Private preservation proof retained unchanged; SHA-256 matches: `da66a9e80edf45999acae890f4f933dee27d356d68c4bff260d21165012c2600`.
- Both private files remain mode 0600 at the location recorded in ../dev-restored-rehearsal/SNAPSHOT_BACKUP.json. No private contents were copied into evidence or printed. Existing `/tmp` storage remains temporary, not a durable external backup.
- pg_restore 17.11 reads the archive inventory. All 30 preserved tables have TABLE DATA entries; all four required auth.users indexes have INDEX entries. See RECOVERY_COVERAGE.json.
- APBM_DEV_DB_URL, APBM_DEV_DB_POOL and API URL identify the expected project. Both SQL variables contain the same password; DB_URL is the direct endpoint and DB_POOL the Session pooler. The read-only comparison explicitly selected DB_POOL in memory, without changing environment files.
- API health returned HTTP 200 from GET /auth/v1/health using apikey only. No user login/session or RPC occurred. This establishes API responsiveness, not database comparison success.

## Exact blocker and differences

The Session pooler rejected SQL authentication with PostgreSQL code **28P01: password authentication failed**. No SQL comparison query could begin. The cause of credential rejection is not established; do not infer that the restore necessarily changed the password.

Therefore current Auth users/identities, profiles, user_roles, the 30 table fingerprints, sequences, role memberships and schema/catalog differences are **UNVERIFIED**, not unchanged and not confirmed lost. The four indexes' current presence is likewise unverified. RESULT.json preserves the failed attempt and backup checks.

**Next action for Tony:** confirm the provider restore is complete, then verify the current project database password and update APBM_DEV_DB_POOL and APBM_DEV_DB_URL locally to the same working Session pooler URL for `yrsuwikjnbmvpznrgydb`. Do not send credentials in chat. Once connectivity works, rerun this read-only comparison against the same retained proof. No new backup should replace the comparison reference.

## What the later backup can recover

The retained snapshot completed at **2026-11-06 10:46:52.259 UTC**. Completion time is not an exact snapshot acquisition timestamp. The archive contains the later snapshot of all 30 preserved tables: 27 Auth tables, public.profiles, public.user_roles, and supabase_migrations.schema_migrations. Thus it supplies a recovery source for recorded Auth users/identities/authentication records, profiles and application-role assignments, and native migration history. Data added or changed after that snapshot is not covered.

It also contains the captured public/Auth schema objects and all four auth.users indexes: idx_users_created_at_desc, idx_users_email, idx_users_last_sign_in_at_desc and idx_users_name. None is omitted. Any restore needs a supported path for managed Auth ownership/permissions; archive readability does not prove a successful restore. The three-entry ACL exception is unchanged.

The private proof separately records row fingerprints/counts, sequences, role attributes/memberships, triggers and catalog state for verification. Database-global role metadata in this proof is not a globals restore script. Provider Auth settings, API keys, Storage file contents and unrelated schemas/services are outside the claimed backup coverage. No automatic restoration of those is implied.

Without current SQL access we cannot identify which later rows/changes need recovery. The comparison will report table-level count/fingerprint differences; the saved aggregate fingerprints alone cannot identify individual changed rows. Any selective row recovery would require a separately authorized private archive inspection/restore and plan.

## Stop and files

No imports, migrations, seeding, ledger initialization, authenticated user probes, DEV writes, Git mutations or stage-6 work occurred. New local evidence only: compare.mjs, RESULT.json, RECOVERY_COVERAGE.json and this report. compare.mjs passed node --check. The SQL connection request used default_transaction_read_only=on; the intended data comparison uses REPEATABLE READ READ ONLY. No write fallback exists.
