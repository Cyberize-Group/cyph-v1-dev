# APBM-003 — post-restore preservation and clone safety handoff

2026-11-06. DEV: CyberPharma_Dev_v1 (`yrsuwikjnbmvpznrgydb`).

**PASS — recorded preservation comparison and inspected database outbound-action gate.** Proceed to the dashboard restore-point/cost review. This is not a project-creation action, a 0047 baseline PASS, or authorization to write shared DEV.

## Recorded preservation result

The read-only comparison completed at **2026-11-06T13:03:08.140Z**, after the Director-reported in-place restoration to **2026-11-06 07:37:54 UTC**. Its full sanitized result, previously returned in chat without filesystem writes, is now preserved verbatim in PASS_20261106T130308Z.json. The old failed RESULT.json remains historical evidence; it is not the current result.

- All **30/30** preserved table counts and salted fingerprints match the retained pre-restore snapshot. This includes five Auth users, five identities, five profiles and five application-role rows.
- Database role attributes (30 roles), memberships (21), sequences, triggers and migration records match. Public catalog SHA-256 remains `da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b`.
- Auth columns, constraints, relation ownership/ACL/RLS, functions, policies and all 111 index definitions match. All four required auth.users indexes are present with exact definitions, valid, ready, live and nonunique.
- APBM ledger remains absent. The approved 0047 bootstrap/rehearsal has not run.

The private archive and proof were rehashed again during this follow-up and still match their original receipts:

- Archive: `1d33881a1b49f85d20ecee6514a56f94552055efd6dc19f58942b12316dda692`.
- Private proof: `da66a9e80edf45999acae890f4f933dee27d356d68c4bff260d21165012c2600`.

They remain intact at the private location in ../dev-restored-rehearsal/SNAPSHOT_BACKUP.json. No private data was moved, uploaded or included in documentation. Existing /tmp retention is temporary, not an off-host backup guarantee.

## Connection variable result

**APBM_DEV_DB_URL is still the direct endpoint on disk**, not the Session pooler. APBM_DEV_DB_POOL is the working Session pooler. Both SQL refs and the API ref match DEV. This inspection used an explicit in-memory mapping from DB_POOL and connected successfully; .env.local was not edited.

Tony's local follow-up: copy the existing working APBM_DEV_DB_POOL value into APBM_DEV_DB_URL, preserving valid dotenv quoting. Do not paste credentials in chat. This mismatch affects the standard runner configuration, not the database outbound-action finding or ability to review a clone in the dashboard.

## Outbound-action inspection

Primary inspection: **13:07:22–13:07:38 UTC**; targeted review completed **13:08:48 UTC**. SQL transactions were read-only. The primary inspection also used REPEATABLE READ and row_security=off, so an RLS-hidden relation would fail rather than silently count as empty. No inspected query failed.

| Area | Result |
|---|---|
| Scheduled jobs | pg_cron and pgAgent are not installed; cron.job and pgagent.pga_job do not exist. The only non-template database is postgres, matching cron.database_name. |
| HTTP queue and webhook hooks | pg_net is not installed; net.http_request_queue, net._http_response and supabase_functions.hooks are absent. No outbound/webhook user trigger found. |
| Wrappers and remote database connections | No foreign-data wrappers, foreign servers, foreign tables or logical-replication subscriptions. |
| Stored functions/triggers | Inspected 110 function/procedure definitions, 13 noninternal table triggers and seven event triggers. No configured automatic external request found. |
| Provider function false positives | grant_pg_net_access/grant_pg_cron_access manage extension permissions; they do not invoke HTTP. pgrst_ddl_watch/pgrst_drop_watch issue local NOTIFY for schema reload. Dynamic-SQL helpers are not scheduled jobs. |
| Storage/Realtime/Vault | Zero buckets, storage objects, Realtime subscription rows and Vault secrets. The storage lifecycle trigger responds to bucket writes, not a scheduled outbound request. |
| Startup configuration | Provider preloads include pg_cron/pg_net, but their database extensions, job catalog and queue are absent. The authenticator override contains supautils/safeupdate; no custom startup library override found. |

Receipts: OUTBOUND_CHECK.json and OUTBOUND_FOLLOWUP.json. Inspection code: outbound-check.mjs. No job commands, webhook payloads, FDW connection options, Auth records or credentials are in the receipts. Functions were inspected, never executed.

**Conclusion:** no database-configured automatic outbound action was identified that should fire in the proposed physical clone. Preloaded provider libraries alone are not evidence of a configured job. This is a point-in-time database finding, not certification of the provider infrastructure or external automation. Provider-side Auth settings, organization webhooks and external schedulers are outside SQL visibility; do not attach the new project to application traffic or external integrations before target verification. Supabase documents that copied database jobs/extensions can run immediately and cannot be excluded during physical restoration. [Official clone documentation](https://supabase.com/docs/guides/platform/clone-project).

## Exact dashboard step for Tony

1. Select **CyberPharma_Dev_v1**, and verify the project ref is **yrsuwikjnbmvpznrgydb**.
2. Open **Database → Backups → Restore to a New Project**. Use this tab, not the in-place restore control.
3. Select the scheduled backup **2026-11-06 07:37:54 UTC**, if it is still offered. Open its Restore review and inspect the new-project cost preview. Stop before the final creation confirmation and record the selected timestamp and incremental compute/disk/add-on quote. Current account eligibility, continued backup availability and exact cost have not been verified from SQL. If that point is absent or the tab is unavailable, report that instead of choosing a different point or enabling an add-on.
4. Once the point and cost are accepted, Tony can confirm restoration to a **new disposable project**. Cody has neither created a project nor clicked a confirmation. After creation, record its new project ref and scoped credentials locally. The new ref needs explicit target fencing; do not silently replace the existing SCRATCH pin.
5. Before any write rehearsal, compare the clone with the retained fingerprints, all four Auth indexes and complete catalog. Preserve all indexes and the exact existing three-entry ACL exception; do not broaden it. Only then resume the already specified bootstrap/0047/ledger/migration/seed rehearsal sequence on the disposable copy.

The selected backup time is supported by Tony's restore report plus the exact preservation match after restoration. The new clone still requires its own verification; current DEV matching does not prove a future clone matches.

## Separate status and boundaries

DEV signup evidence remains unavailable; no signup setting was inspected or changed. The prior launch waiver remains recorded. No shared DEV writes, imports, migrations, seed, user-authentication probes, project creation, Git mutation or stage-6 work occurred. This turn writes only the authorized documentation/evidence record.
