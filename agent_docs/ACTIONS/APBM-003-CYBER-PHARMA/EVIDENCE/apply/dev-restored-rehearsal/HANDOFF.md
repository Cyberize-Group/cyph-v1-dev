# APBM-003 continuation — restore rehearsal pending

> **2026-11-06 current update:** DEV was restored in place to the Director-reported 07:37:54 UTC scheduled backup. The subsequent 13:03 UTC comparison matches all 30 retained table fingerprints, roles and public/Auth catalogs, including all four required Auth indexes. The private backup/proof hashes still match. A read-only outbound-action inspection found no configured automatic external action. See [the current clone-safety handoff](../dev-post-restore/CLONE_SAFETY_HANDOFF.md) for evidence and Tony's exact dashboard step: select the 07:37:54 backup under Restore to a New Project and review the cost before creation. APBM_DEV_DB_URL still needs the working Session pooler value. No clone or rehearsal has run. The prior SCRATCH index blocker below remains historical and applies to that existing SCRATCH target; it is not evidence of missing indexes on restored DEV.

Verified 2026-11-06T10:53:00.001293+00:00, cyph-v1-dev / apbm-003 @ 49dec499d665125bb8764ccc8ea498c5fdfcdcd1. Shared DEV `yrsuwikjnbmvpznrgydb` remained read-only. Confirmed disposable target `ihgcsrypblqkwommrkgj` also received only read-only inspection; no restore or mutation began.

## Completed evidence

- Explicit tools: /usr/lib/postgresql/17/bin/pg_dump and /usr/lib/postgresql/17/bin/pg_restore both report 17.11. Tool/server major compatibility passes against 17.6.
- All four APBM_DEV_ credential names are populated and validate against the DEV project. Both API keys also passed read-only requests (HTTP 200): a zero-row profiles SELECT for the publishable key and schema introspection for the secret key, with no login/signup/RPC/session. The file's APBM_DEV_DB_URL still uses the direct host, so this run explicitly binds it **in memory** to the verified working APBM_DEV_DB_POOL, with the complete prefix and matching API ref. No .env edit or loader fallback was introduced. Persist the working pooler in APBM_DEV_DB_URL for the standard commands.
- First private archive succeeded. A second, authoritative archive and preservation fingerprints were captured from one exported REPEATABLE READ / READ ONLY snapshot, covering all 30 public/Auth/native-ledger tables. pg_restore 17.11 can read its TOC. Archive SHA-256: `1d33881a1b49f85d20ecee6514a56f94552055efd6dc19f58942b12316dda692`. Private archive, salt and fingerprints remain outside the repo under a 0700 directory with 0600 files. Location is recorded locally in SNAPSHOT_BACKUP.json; no backup data is in this handoff. Provider Auth settings/secrets are not represented as covered by a database dump.
- Source and target Auth columns (271), constraints, trigger definitions, relation ACLs/owners/RLS, function definitions/ACLs, policies and managed Auth migration rows match. Auth table data can be ordered without foreign-key cycles. Existing managed Auth structures could therefore be reused for data loading **except that four source indexes are absent on the target**.
- Independent narrow ACL evaluator is implemented in acl-exception.mjs, with 16 local controls PASS. It allows only the exact three identified supabase_admin/public default ACL rows, rejects altered grant payloads, partial/duplicate/extra entries, every other public-catalog difference, and any DEV/pilot target. Strict shared-DEV verification and original baseline remain unchanged. This is local evaluator validation, not a live restored-copy PASS.

## Exact restore blocker and next action

Missing on SCRATCH, all on auth.users:

1. idx_users_created_at_desc
2. idx_users_email
3. idx_users_last_sign_in_at_desc
4. idx_users_name

The target postgres role is not a superuser or table owner and cannot inherit or SET ROLE to supabase_auth_admin. It also cannot create objects in the auth schema. A generic pg_restore cannot recreate these indexes with the supplied credential. The three-default-ACL exception does not authorize silently dropping four additional Auth objects from the restored comparison.

**Tony: use a provider-supported auth.users-owner/privileged path on SCRATCH only to execute SCRATCH_AUTH_INDEX_PREREQUISITE.sql, or supply that supported restore path.** The file contains the exact four CREATE INDEX statements taken from the source metadata, wrapped in a transaction. Do not grant managed-role membership or edit system catalogs as a workaround. No shared DEV index change is requested. After those indexes match, resume the private restore and verify users/profiles/roles/data preservation before any bootstrap/ledger stage. If the provider cannot supply this path, a further explicit ruling or a different confirmed restore target is needed; none is inferred here.

Also persist the working pooler URL in APBM_DEV_DB_URL; the other three APBM_DEV_ values now validate. Do not send credentials in chat.

## Stopped stages

Restore NOT_RUN; live ACL exception evaluation NOT_RUN; 0047 baseline verification on a restored copy NOT_RUN; ledger initialization NOT_RUN; 0048–0052 NOT_RUN; seed/Owner/authenticated verifier NOT_RUN. Earlier SCRATCH evidence remains preserved for reuse, not relabelled as this rehearsal.

After restoration, use the candidate exception only on the disposable copy, retain all other canonical 0047 checks and prove effective app grants/RLS/RPC access. The existing strict bootstrap runner still intentionally requires exact managed-ACL parity and is **not** yet wired to this experimental evaluator; do not run its old write sequence expecting it to bypass the restriction. Integration and live proof remain after the restore gate. No shared-DEV baseline exception or apply command has been released.

## DEV signup evidence — separate status

No DEV signup-disabled evidence or explicit DEV checkpoint waiver is on file. Actual signup status was not probed or changed. This is reported separately and did not cause the restore stop. The earlier launch waiver remains historical.

## Privacy and review

CONFIG_CHECK.json, backup-tool-check.json, SNAPSHOT_BACKUP.json, AUTH_RESTORE_COMPATIBILITY.json, AUTH_MANAGED_OBJECT_PARITY.json, AUTH_INDEX_DIFFERENCES.json and AUTH_INDEX_RESTORE_PRIVILEGE.json contain sanitized metadata/evidence. They do not contain Auth rows, passwords, tokens or dump contents. Snapshot backup code is reviewable in snapshot-backup.mjs. All live queries and pg_dump used read-only source transactions. No Git commit or product-code modification occurred this turn.
