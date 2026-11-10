# APBM-003 — restore-to-new-project review

2026-11-06. Checkout: `cyph-v1-dev`, `apbm-003`, `49dec499d665125bb8764ccc8ea498c5fdfcdcd1`.

**BLOCKED on account-level availability, restore-point evidence and cost quote.** No project was created. No database, cloud configuration or Git mutation occurred in this review. Existing backup and E1/SCRATCH evidence remain unchanged.

## Retained backup

At 2026-11-06T12:36:13.530447Z, the archive and private preservation proof both still match SNAPSHOT_BACKUP.json, with file permissions 0600. Archive SHA-256: `1d33881a1b49f85d20ecee6514a56f94552055efd6dc19f58942b12316dda692`.

The authoritative private location remains recorded in SNAPSHOT_BACKUP.json. Nothing was deleted, replaced, uploaded or included in a review ZIP. It is under `/tmp`, so this retention is not a durable off-host backup guarantee.

The snapshot covers 30 public/Auth/native-ledger tables. Its completion time is **2026-11-06 10:46:52.259 UTC**, not an exact exported-snapshot wall-clock timestamp. Public catalog SHA-256 is `da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b`. Provider Auth configuration is outside the dump.

## Availability, point and price

Supabase documents Restore to a New Project for paid plans with physical backups. A project created by this feature cannot itself be a clone source. The new project mirrors compute/disk resources and stays in the source region. Database data, indexes and Auth records transfer; Auth settings/API keys and other non-database services require separate configuration. Binary restoration can immediately start copied jobs/extensions with external effects; inspect those dependencies read-only before approving creation. [Official clone documentation](https://supabase.com/docs/guides/platform/clone-project).

For **CyberPharma_Dev_v1 / yrsuwikjnbmvpznrgydb**, the plan, physical-backup status, source eligibility, backup inventory, PITR window and quote are **UNVERIFIED**. Local evidence records PostgreSQL 17.6, but that alone does not establish account entitlement. No management credential or connected Supabase account is available to this session. A Supabase integration exists but is not installed/connected; its account/backup coverage must also be checked after connection. Database/API application keys do not establish access to these management details.

**Selected restore point: none.** The local pg_dump is not a provider-managed physical restore point. Do not choose 10:46:52 merely because it is the backup completion time. Obtain available UTC backup timestamps or the PITR window; choose a candidate only if its state can be verified against the retained snapshot. If no point reproduces the recorded state, stop and use the supported SCRATCH index path or obtain approval for a new snapshot/rehearsal baseline. Never silently accept a newer/older state.

Published compute examples are Micro **$0.01344/hour (~$10/month)** and Small **$0.0206/hour (~$15/month)**. Partial hours bill as full hours. These are examples, not a quote for Dev v1; disk/resources, usage, credits and taxes affect the incremental bill. [Compute billing](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

PITR, if needed, is separately priced at **$0.137/hour (~$100/month)** for seven-day retention; do not enable it or assume it supplies a historical point without account evidence. [Backup/PITR documentation](https://supabase.com/docs/guides/platform/backups).

**Tony's exact next action:** open the Dev v1 project's Database → Backups → Restore to a New Project tab. Supply the eligibility/plan, available UTC backup timestamps or PITR range, and the cost-preview breakdown (compute, disk and any add-ons), without confirming creation. Include whether Dev v1 was itself created by restoration. Alternatively enable authenticated account access with the necessary read capabilities. No secrets are needed in chat. Cody will assess the candidate point and quote before a separate creation approval.

## Verification gates for a proposed disposable clone

1. Record Tony's approved new disposable project ref. Check SQL username/host and API URL agree. Reject DEV `yrsuwikjnbmvpznrgydb`, pilot `cwdzijswchlwfvxxrlzb` and any unintended project. The new ref is not covered automatically by the existing SCRATCH pin; explicit fencing and negative controls must pass before write rehearsal. Read-only inspection comes first.
2. Compare **all four exact index definitions** in AUTH_INDEX_DIFFERENCES.json with the clone's `pg_get_indexdef`. Require the correct `auth.users` relation, btree method, nonunique status, column/expression, DESC ordering and partial-index predicate; also require `pg_index.indisvalid`, `indisready` and `indislive`. A same-named but invalid or altered index fails. Compare the rest of the Auth index inventory as well; all four required definitions are reproduced below.
3. Before bootstrap, compare all 30 table fingerprints and row counts using the retained private salt and the existing capturePreservation algorithm. Keep Auth rows, password hashes and per-table private fingerprints out of logs. Check user IDs, identities, profiles, role assignments, native migration rows, sequence values/is_called, roles/memberships, triggers, constraints, functions/ACLs, policies and relation ownership/RLS. Capture provider-induced differences explicitly; do not normalize away unexplained data or metadata changes. A mismatch fails preservation. Review Auth configuration separately because it is not a database-preservation result.
4. Verify restored **pre-bootstrap** public catalog equals `da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b`. The source is not yet 0047. Confirm the APBM ledger remains absent and native ledger matches the saved snapshot.
5. On the approved disposable copy only, rehearse the forward bootstrap and rollback/recovery. Then require canonical **0047** public parity against `f83deb44e94e4f4ca8ac3168120477aebaef1cd8d7af3ae8644085c3c05e22ec`, preserved original data, and empty newly created tables. Apply only the already specified three-entry supabase_admin default-ACL exception, with exact payload matching, if needed. The exception evaluator must be explicitly integrated and independently proved; the existing strict runner does not yet use it. No index omission or additional exception is allowed. Check effective anon/authenticated/service grants, RLS denials and allowed RPC behavior with real client credentials, with expected audit/session effects declared. No shared-DEV exception is inferred.
6. Only after 0047 verification, initialize the APBM ledger and rehearse 0048–0052, synthetic seed, Owner access and verifier on that disposable target. Preserve pre-seed proof; synthetic seeding is a later deliberate change. Reuse the earlier SCRATCH implementation evidence while separately reporting this restored-copy proof. Stage 6 and shared DEV APPLY remain stopped.

## Conditional support request — send if cloning is unavailable or no point matches

Subject: Supported recreation of four auth.users indexes on disposable SCRATCH for a DEV restore rehearsal

We need to rehearse a logical restore of CyberPharma_Dev_v1 (`yrsuwikjnbmvpznrgydb`) into our confirmed disposable SCRATCH project (`ihgcsrypblqkwommrkgj`). Please do not modify the source DEV project.

Read-only catalog comparison identified exactly four source auth.users indexes missing on SCRATCH. Our target postgres role is not a superuser or auth.users owner, cannot create in auth, and cannot inherit or SET ROLE to the managed owner role. We have not attempted privilege escalation or omitted these indexes. Please recreate the following exact indexes on SCRATCH through a supported privileged/owner operation, or provide a supported restoration mechanism that preserves them:

```sql
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';
CREATE INDEX idx_users_created_at_desc ON auth.users USING btree (created_at DESC);
CREATE INDEX idx_users_email ON auth.users USING btree (email);
CREATE INDEX idx_users_last_sign_in_at_desc ON auth.users USING btree (last_sign_in_at DESC);
CREATE INDEX idx_users_name ON auth.users USING btree (((raw_user_meta_data ->> 'name'::text))) WHERE ((raw_user_meta_data ->> 'name'::text) IS NOT NULL);
COMMIT;
```

Please check existing definitions first and stop on conflicts rather than replace or drop an existing index. Confirm each index is valid, ready, live, nonunique, and matches the supplied definition. Please preserve all Auth users/data and other managed objects. We are not requesting role-membership grants, direct system-catalog edits, omitted indexes or any wider ACL exception. Our separate rehearsal ruling covers only three already identified supabase_admin public default-ACL entries and does not authorize additional differences. Return a sanitized completion/verification receipt or explain the supported alternative. No credentials or backup contents are attached.

This is a draft for Tony to send; Cody has not contacted support.

## DEV signup evidence — separate

No DEV signup-disabled evidence or explicit DEV-checkpoint waiver is on file in the current handoff. The previous E2 launch waiver remains recorded. Actual signup configuration was not queried or changed. Signup status is not the cause of the clone-availability stop.
