> Execution update: the transaction wrapper and exact conditional commands are now implemented in `../dev-bootstrap-execution/HANDOFF.md`. Rehearsal remains blocked; original SQL and baseline requirements below are unchanged.

# Minimal DEV-specific 0047 bootstrap — proposal for review

Status: PREPARED, NOT EXECUTED. Shared DEV remains untouched except authorized metadata reads. Tony retains Git and DEV APPLY. Target: CyberPharma_Dev_v1 `yrsuwikjnbmvpznrgydb`; confirmed SCRATCH `ihgcsrypblqkwommrkgj`; pilot `cwdzijswchlwfvxxrlzb` excluded. Preparation date: 2026-11-06T07:24:08.484314+00:00.

## Exact proposed changes

`PROPOSED_BOOTSTRAP.sql` is the complete proposed SQL body, SHA-256 `ccaa16a3701752a4895705e1dca5456d5eb3171b3c8750cc43001f9ff9b4b3e4`. It contains no COMMIT and must never be pasted into an autocommit SQL editor. Execute only through a separately reviewed transaction wrapper after the prerequisites below; this task does not release execution. `PLAN_MANIFEST.json` pins all 47 source inputs, the starting catalog and final catalog. No historical migration or product code was changed for this proposal.

1. Assert the exact two-table preflight catalog, native migration version and absence of APBM ledger. Acquire the same advisory lock as the forward runner and locks on preserved tables in a coordinated maintenance window; capture private preservation fingerprints before any DDL.
2. Remove exactly three public-schema default-privilege entries owned by supabase_admin (tables, sequences, functions; grantees postgres/anon/authenticated/service_role). Existing object grants, global default grants and role memberships stay unchanged. This is required only for strict approved fingerprint parity and is currently privilege-blocked.
3. Assume postgres locally for DDL so new object owners match the approved baseline. Replace only handle_new_user() and rls_auto_enable() with the approved definitions using CREATE OR REPLACE, preserving OIDs/dependencies. handle_new_user differs only in comments/formatting; no existing role assignment or user row is updated. rls_auto_enable changes from SECURITY DEFINER / pg_catalog search_path / multi-command exception-logging implementation to the approved invoker / CREATE TABLE implementation. That behavior change needs explicit review; no silent function normalization is used.
4. Create the 14 missing tables: aac_reference, accounts, apa_memberships, audit_logs, businesses, ful_reference, pbm_info, pending_registrations, reference_dataset_versions, report_files, subscriptions, user_businesses, user_data, wac_reference. Reuse approved 0002–0014, 0016–0027 and 0029–0047 SQL without changing historical files. Create update_updated_at from the approved catalog, avoiding the unnecessary 0001 baseline-assert replay. Create audit_logs directly in its final 0028 shape; omit obsolete 0015 plus 0028's assertion/drop prefix. No existing object is dropped or recreated.
5. The resulting missing objects comprise 230 columns, 46 constraints, 37 indexes, 16 policies, 11 functions, 28 non-internal public-table triggers and audit_logs_id_seq. All 14 new tables must remain empty; defining audit functions does not invoke them.
6. Leave profiles, user_roles, app_role, user_roles_id_seq (including current value), their three policies, Auth user/identity data, Auth trigger definitions, event-trigger registration/tags, existing object ACLs and native migration history intact. The preflight proves their public definitions already match; reconciliation is assertion-only for matching objects. The broader ensure_rls event registration remains unchanged; the approved function itself filters CREATE TABLE. No CREATE/ALTER ROLE, role remap, backfill, signup-setting change, seed or ledger initialization is included.

## Exact-baseline blocker

Read-only `DEV_METADATA.json` confirms current_user postgres has BYPASSRLS but is neither a member of nor able to use supabase_admin. The three extra default ACLs belong to that managed role. PostgreSQL permits changing a role's defaults only as that role, a member, or a sufficiently privileged operator; existing object privileges are unaffected by default-privilege changes. Source: https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html .

The SQL explicitly fails before mutation with the current role. Tony must obtain a supported privileged path able to alter these specific defaults and then SET ROLE postgres, and rehearse it on the disposable restored target. Do not grant managed-role membership, directly edit pg_catalog, bypass the guard, or treat the remaining three differences as a PASS. If the provider does not permit that change, JARVIS must approve a narrowly defined baseline exception and separately update the verifier contract; no exception or replacement fingerprint is implemented here. The committed 0047 fingerprint stays authoritative.

## Proof required BEFORE COMMIT and BEFORE ledger initialization

`checks.mjs` provides executable checks, not a mutation runner:

- verifyInputs(): rejects changed pinned SQL/source/catalog bytes.
- assertTarget(env, target): exact DEV/SCRATCH SQL+API identity; pilot and cross-target substitutions fail. Use existing loadEnv complete-prefix checks; no credential fallback.
- assertBefore(client): exact live starting catalog `da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b`, APBM ledger absent, native version exactly 20261012053902.
- lockPreserved(client): locks every existing Auth table, profiles, user_roles and native migration ledger for the short transaction. A lock/permission failure aborts; no escalation or disabling of protections.
- capturePreservation(client, privateSalt): row counts and salted SHA-256 fingerprints for every Auth table, profiles, user_roles and native ledger; user_roles sequence value/is_called/settings; Auth triggers; all event-trigger registrations; role attributes/memberships and global defaults. Only salted row hashes leave PostgreSQL; private salt and detailed comparison receipts must stay in a 0600 file outside Git/ZIP. No real user values belong in APBM evidence.
- assertAfter(client, before, privateSalt): exact approved public catalog `f83deb44e94e4f4ca8ac3168120477aebaef1cd8d7af3ae8644085c3c05e22ec` (16 tables, 19 policies, 13 functions), every preservation fingerprint/metadata value identical, all 14 new tables empty, APBM ledger still absent.

A later reviewed executor must run the following sequence in ONE transaction; it is an implementation requirement, not an already-built or released apply command:

```javascript
verifyInputs();
assertTarget(env, approvedTarget); // after loadEnv; no mixed prefixes
await client.query('BEGIN');
try {
  await client.query("SET LOCAL lock_timeout='5s'");
  await client.query("SET LOCAL statement_timeout='120s'");
  await client.query("SET LOCAL TIME ZONE 'UTC'");
  await client.query("SET LOCAL search_path=public,pg_catalog");
  // Must be true; stop if another runner owns the APBM lock.
  const locked = await client.query('SELECT pg_try_advisory_xact_lock(342003,1) locked');
  if (!locked.rows[0].locked) throw new Error('APBM runner already active');
  await lockPreserved(client);
  await assertBefore(client);
  const before = await capturePreservation(client, privateSalt);
  await client.query(pinnedBootstrapSql);
  const receipt = await assertAfter(client, before, privateSalt);
  // Only the separately released operator may commit after all checks pass.
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  // Emit a sanitized error class only; never log client/connection/error objects.
  throw error;
}
```

Do not run the SQL body standalone: structural counts alone are insufficient. The exact catalog and preservation checks must gate COMMIT. After commit, repeat checks in a fresh read-only transaction using the retained private before-proof. Keep ledger absent through this independent receipt. On disconnect/unknown commit outcome: reconnect read-only, classify exact before/after state and preservation, stop for Tony; never blindly rerun. On any failed SQL/check, roll back the entire transaction, including default ACL/function changes. The proposed script never calls nextval/setval on the existing sequence; confirm its value did not change. No reset or reverse data migration is proposed.

Only after Tony/JARVIS accept the independent exact baseline and preservation receipt may the existing guarded init-ledger --through 47 be separately released. Record this as verified state adoption via the bootstrap, not a claim that each original historical migration was individually executed. The native Supabase migration row remains unchanged. No 0048–0052 operation belongs in this bootstrap transaction.

## Focused restore rehearsal — remaining work

1. Complete the runner APBM_DEV_ variables locally and use the working pooler for DB_URL; current preflight discrepancy remains recorded. Confirm the privileged default-ACL path before scheduling changes. DEV signup evidence or an explicit checkpoint ruling also remains pending; no signup setting is changed by this plan.
2. Tony obtains a private, consistent backup of current public profiles/user_roles data and sequence, all Auth tables/state necessary for recovery, native migration history, role assignments/grants, two function definitions, Auth/event triggers, global and per-schema ACLs. Include provider-dependent Auth configuration/secret coverage and exclusions in the private recovery inventory. Capture counts/salted fingerprints in the same maintenance window; keep users/emails/password hashes/tokens outside the pack. This is current DEV-specific affected state, not a new synthetic seed or full historical replay.
3. Restore onto a separately confirmed disposable target (the designated SCRATCH may be used only after its existing evidence/artifacts are preserved and Tony approves that restore). Prove restored Auth/public rows, sequence, native history and trigger definitions match the private before-proof; separately record provider-managed role/config differences without overwriting managed identities. Verify the restored two-table public catalog matches the starting fingerprint. A cross-project row restore alone does not prove Auth-provider configuration recovery or successful logins; no login probe is authorized here.
4. On that restored target, run one injected failure after some missing objects/functions/default ACL changes, before COMMIT. ROLLBACK must restore the exact starting catalog, ACLs, functions, preserved rows/sequence/history, and absent APBM ledger. Record only hashes/counts/status, not restored data. This tests the new single-transaction bootstrap boundary; do not rerun the full legacy proof matrix.
5. Run one successful bootstrap with the before/after checks above. Verify strict 0047 catalog, preserved data/roles and 14 empty new tables in-transaction and again from a fresh read-only connection after commit. Keep the APBM ledger absent. Test that rerun is rejected by the starting fingerprint, and that an incorrect preserved-data receipt fails even with a matching catalog.
6. Demonstrate restore recovery of the DEV-specific before-state once on the disposable target from the actual private backup. Show restored users/identities/roles/profiles, sequence and managed/default ACL/function definitions match the before-proof. Record backup integrity/location/time and restore evidence without dumping data into APBM. If the provider cannot restore managed ACL/function metadata, document that exact blocker; do not label recovery proven.
7. Return this focused receipt for Tony/JARVIS review. Shared DEV execution remains Tony-only and requires the reviewed wrapper plus approved backup/restore evidence. Existing 0048–0052 forward commands remain blocked until the bootstrap and independent baseline proof are complete.

## Reused proof and actual validation

Reuse existing E2 stage-5 RLS matrix (320 cells/28 attacks), audited real-user proof (279 checks), seed/reseed equivalence and partial-failure recovery evidence. They establish the approved 0047/0052 implementation semantics and remain unchanged; they do NOT establish restore of this DEV's current users/data or privileges to reconcile its managed ACLs. No full SCRATCH replay or new seed was run for this proposal.

Actual work this turn: read-only DEV metadata inspection, exact SQL proposal generation, pinned-source validation, JS syntax checks and 15 local static/negative-control tests in STATIC_RESULTS.json. These tests reject pilot/SCRATCH-as-DEV, schema drift, pre-existing ledger, and changed preservation data even with matching schema. No database SQL mutation, restore rehearsal, authenticated proof, Git commit or .env edit occurred. No claim of database rehearsal success is made.
