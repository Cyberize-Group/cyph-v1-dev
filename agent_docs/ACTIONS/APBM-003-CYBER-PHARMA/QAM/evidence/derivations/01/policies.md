# policies.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Method: replay every `create policy` / `drop policy` statement over scripts/db-bootstrap-baseline.sql then supabase/migrations/0001…0052 in order (SQL comments stripped); the surviving set is the expected pg_policies content on a from-scratch replay.

**Expected permissive policies in public = 15.** Stacking (two permissive policies for one table×command): none.

Expected per table:

| table | command | policy | created in |
|---|---|---|---|
| aac_reference | SELECT | aac_reference_select_authenticated | supabase/migrations/0023_rls_aac_reference.sql |
| accounts | SELECT | account_select_member_or_owner | supabase/migrations/0048_ownership.sql |
| businesses | SELECT | business_select_member_or_owner | supabase/migrations/0048_ownership.sql |
| businesses | UPDATE | business_update_admin | supabase/migrations/0019_rls_businesses.sql |
| ful_reference | SELECT | ful_reference_select_authenticated | supabase/migrations/0025_rls_ful_reference.sql |
| pbm_info | SELECT | pbm_info_select_authenticated | supabase/migrations/0026_rls_pbm_info.sql |
| profiles | UPDATE | Profiles are updatable by owner or superadmins | scripts/db-bootstrap-baseline.sql |
| profiles | SELECT | Profiles are viewable by owner or superadmins | scripts/db-bootstrap-baseline.sql |
| reference_dataset_versions | SELECT | reference_dataset_versions_select_authenticated | supabase/migrations/0027_rls_reference_dataset_versions.sql |
| report_files | SELECT | report_files_select_member | supabase/migrations/0022_rls_report_files.sql |
| subscriptions | SELECT | subscription_select_member_or_owner | supabase/migrations/0048_ownership.sql |
| system_config | SELECT | config_select_scoped_state | supabase/migrations/0052_system_config.sql |
| user_businesses | SELECT | user_business_select_self_or_owner | supabase/migrations/0048_ownership.sql |
| user_roles | SELECT | Users can read their own role | scripts/db-bootstrap-baseline.sql |
| wac_reference | SELECT | wac_reference_select_authenticated | supabase/migrations/0024_rls_wac_reference.sql |

Tables with 0 policies after replay (relevant: user_data must be 0, audit_logs must have no SELECT): user_data=0, audit_logs=0.

Owner reach present (policy name contains 'owner'): accounts.account_select_member_or_owner, businesses.business_select_member_or_owner, profiles.Profiles are updatable by owner or superadmins, profiles.Profiles are viewable by owner or superadmins, subscriptions.subscription_select_member_or_owner, user_businesses.user_business_select_self_or_owner.

Replay log:

- scripts/db-bootstrap-baseline.sql: CREATE user_roles.Users can read their own role FOR SELECT
- scripts/db-bootstrap-baseline.sql: CREATE profiles.Profiles are viewable by owner or superadmins FOR SELECT
- scripts/db-bootstrap-baseline.sql: CREATE profiles.Profiles are updatable by owner or superadmins FOR UPDATE
- supabase/migrations/0017_rls_user_businesses.sql: CREATE user_businesses.ub_select_self FOR SELECT
- supabase/migrations/0018_rls_accounts.sql: CREATE accounts.account_select_member FOR SELECT
- supabase/migrations/0019_rls_businesses.sql: CREATE businesses.business_select_member FOR SELECT
- supabase/migrations/0019_rls_businesses.sql: CREATE businesses.business_update_admin FOR UPDATE
- supabase/migrations/0020_rls_subscriptions.sql: CREATE subscriptions.subscription_select_account_member FOR SELECT
- supabase/migrations/0021_rls_user_data.sql: CREATE user_data.user_data_select_member FOR SELECT
- supabase/migrations/0021_rls_user_data.sql: CREATE user_data.user_data_insert_member FOR INSERT
- supabase/migrations/0021_rls_user_data.sql: CREATE user_data.user_data_update_member FOR UPDATE
- supabase/migrations/0021_rls_user_data.sql: CREATE user_data.user_data_delete_admin FOR DELETE
- supabase/migrations/0022_rls_report_files.sql: CREATE report_files.report_files_select_member FOR SELECT
- supabase/migrations/0023_rls_aac_reference.sql: CREATE aac_reference.aac_reference_select_authenticated FOR SELECT
- supabase/migrations/0024_rls_wac_reference.sql: CREATE wac_reference.wac_reference_select_authenticated FOR SELECT
- supabase/migrations/0025_rls_ful_reference.sql: CREATE ful_reference.ful_reference_select_authenticated FOR SELECT
- supabase/migrations/0026_rls_pbm_info.sql: CREATE pbm_info.pbm_info_select_authenticated FOR SELECT
- supabase/migrations/0027_rls_reference_dataset_versions.sql: CREATE reference_dataset_versions.reference_dataset_versions_select_authenticated FOR SELECT
- supabase/migrations/0029_rls_audit_logs.sql: CREATE audit_logs.audit_logs_select_admin FOR SELECT
- supabase/migrations/0048_ownership.sql: DROP accounts.account_select_member
- supabase/migrations/0048_ownership.sql: CREATE accounts.account_select_member_or_owner FOR SELECT
- supabase/migrations/0048_ownership.sql: DROP businesses.business_select_member
- supabase/migrations/0048_ownership.sql: CREATE businesses.business_select_member_or_owner FOR SELECT
- supabase/migrations/0048_ownership.sql: DROP user_businesses.ub_select_self
- supabase/migrations/0048_ownership.sql: CREATE user_businesses.user_business_select_self_or_owner FOR SELECT
- supabase/migrations/0048_ownership.sql: DROP subscriptions.subscription_select_account_member
- supabase/migrations/0048_ownership.sql: CREATE subscriptions.subscription_select_member_or_owner FOR SELECT
- supabase/migrations/0050_claim_read_fence.sql: DROP user_data.user_data_select_member
- supabase/migrations/0050_claim_read_fence.sql: DROP user_data.user_data_insert_member
- supabase/migrations/0050_claim_read_fence.sql: DROP user_data.user_data_update_member
- supabase/migrations/0050_claim_read_fence.sql: DROP user_data.user_data_delete_admin
- supabase/migrations/0051_admin_reads.sql: DROP audit_logs.audit_logs_select_admin
- supabase/migrations/0052_system_config.sql: CREATE system_config.config_select_scoped_state FOR SELECT
