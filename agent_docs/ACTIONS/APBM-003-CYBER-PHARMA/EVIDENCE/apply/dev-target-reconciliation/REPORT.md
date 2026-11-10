# DEV target correction and read-only preflight

Checked 2026-11-06T06:54:58.877142+00:00; apbm-003 at 49dec499d665125bb8764ccc8ea498c5fdfcdcd1. **BLOCKED for DEV APPLY**. Connectivity and target fencing PASS; baseline parity FAIL.

## Target and validation

- Confirmed DEV: CyberPharma_Dev_v1 `yrsuwikjnbmvpznrgydb`.
- Vibe Cody pilot: `cwdzijswchlwfvxxrlzb`, rejected as DEV.
- SCRATCH: `ihgcsrypblqkwommrkgj`, rejected as DEV.
- Existing 23 target/output controls rerun with corrected DEV constant; 14 additional DEV acceptance/rejection checks pass. No destructive proof ran. See fencing-results.json and dev-fencing-results.json.
- All 34 committed source hashes at the checkpoint match; all 52 migration inventory checksums match. Only product source edit: DEV_REF in scripts/rls-harness/lib/env.mjs. Previous SHA-256 `83299949ee5915a620d6001b6e463a87486a51ec71108842a31d1c7a3a3273e0`; new `b7837245804eebdfcd7f5aa778b04ab150aadf6c130f1014a9c593de2a5dbd95`. SOURCE_HASHES.json now binds the corrected runner. Historical receipts remain unchanged.
- SQL catalog/ledger reads ran inside read-only transactions; API health GET returned 200. No authenticated sessions, RPCs, business data reads, migrations, ledger initialization, seeding or database writes.

## Exact baseline differences

| Public catalog category | Expected 0047 | Live | Difference |
|---|---:|---:|---|
| Tables (excluding sequences) | 16 | 2 | 14 missing; only profiles/user_roles present |
| Columns | 238 | 8 | 230 missing |
| Policies | 19 | 3 | 16 missing |
| Functions | 13 | 2 | 11 missing; both remaining definitions differ |
| Constraints | 51 | 5 | 46 missing |
| Indexes | 40 | 3 | 37 missing |
| Non-internal public-table triggers | 28 | 0 | 28 missing |
| Default ACL entries | 3 | 6 | 3 extra supabase_admin entries |
| Enum labels | 3 | 3 | Match |

Missing public tables: aac_reference, accounts, apa_memberships, audit_logs, businesses, ful_reference, pbm_info, pending_registrations, reference_dataset_versions, report_files, subscriptions, user_businesses, user_data, wac_reference. The audit_logs sequence is also absent.

`handle_new_user` has formatting/comments differences; it still reads metadata role in this pre-0049 state. `rls_auto_enable` materially differs: SECURITY DEFINER/search_path, additional command types, exception handling and logging. No normalization or baseline acceptance was inferred.

Expected catalog SHA-256: `f83deb44e94e4f4ca8ac3168120477aebaef1cd8d7af3ae8644085c3c05e22ec`.
Live catalog SHA-256: `da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b`.

APBM ledger is absent (0 entries versus approved 47-entry history). Native supabase_migrations.schema_migrations exists with version `20261012053902` only. This native entry does not establish 0001–0047 parity. Full object/field differences: baseline-diff.json. Read-only snapshot: catalog.json. Commands/mapping: read-only-preflight.mjs; outcome: preflight.json.

## Configuration and signup evidence

The local APBM_DEV_DB_URL still uses the direct host, not the working pooler; APBM_DEV_DB_POOL is the successful Session pooler. Three missing runner names: APBM_DEV_SUPABASE_URL, APBM_DEV_PUBLISHABLE_KEY, APBM_DEV_SECRET_KEY. Preflight explicitly maps APBM_DEV_DB_POOL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY into an isolated config object. No fallback was added to loadEnv; no credential values were logged or saved. Tony must reconcile the complete APBM_DEV_ prefix locally before the standard runner can pass.

No DEV signup-disabled receipt found in current APBM evidence; EVIDENCE/apply/DA-2_SUPABASE_SIGNUP_DISABLED.md is absent. Actual signup status was not probed or changed. Launch-only waiver remains recorded; supply checkpoint evidence or explicit checkpoint ruling.

## Next action

Tony/JARVIS must approve how this two-table database reaches the required historical baseline; the existing 0048–0052 forward procedure is blocked. Before any database writes, back up the affected public/Auth state and permissions/history, restore on a confirmed disposable target, demonstrate recoverability and rehearse the separately approved reconciliation plus forward/seed/verifier sequence. Do not stamp 47 historical migrations as applied, replay/reset DEV, or replace the expected catalog to force acceptance. Current SCRATCH partial-failure proof is not an affected-DEV restore rehearsal. Tony alone commits and authorizes/executes DEV APPLY. Stage 6 remains paused.
