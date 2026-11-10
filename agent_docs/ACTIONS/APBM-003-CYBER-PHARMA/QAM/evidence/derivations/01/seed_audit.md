# seed_audit.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Method: count the rows generate.mjs constructs per stamped table and the fixed-row inserts in run.mjs.

- datasets: `['aac','wac','ful','pbm_info'].map(...)` → 4
- aac: `[0.123456,0.654321].map` → 2
- wac: `[15,40,70,120].map` → 4
- ful: one literal row → 1
- pbms: `[0,1,2].map` → 3
- claims: `stores.flatMap(store => Array.from({length:50}...))` with 5 stores → 250
- config: `[['dispensing_fee',10.64],['brand_multiplier',0.96]]` → 2
- run.mjs: accounts 3 (A,B,C), businesses = stores.length = 5, junctions literal list = 8, subscriptions 3

Stamped tables (audit_stamp triggers, see catalog_counts.md): accounts, businesses, user_businesses, pending_registrations, user_data, report_files, accounts, subscriptions, apa_memberships, reference_dataset_versions, aac_reference, wac_reference, ful_reference, pbm_info, system_config. user_roles and profiles carry no audit_stamp trigger → their inserts add 0 rows.

**Expected audit rows per seed:run = 285** (accounts 3 + businesses 5 + user_businesses 8 + subscriptions 3 + reference_dataset_versions 4 + aac_reference 2 + wac_reference 4 + ful_reference 1 + pbm_info 3 + system_config 2 + user_data 250), all actor_role='service_role' (run.mjs sets request.jwt.claims role service_role) and actor_user_id IS NULL (no auth.uid()).

Source check: run.mjs hard-codes expectedAuditedInserts=285 and asserts the same — the QA count above is computed independently from the generator arrays and matches.
