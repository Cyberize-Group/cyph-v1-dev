# catalog_counts.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Method: replay `create/drop table`, `create [or replace]/drop function`, `create trigger`, `create unique index` over bootstrap + 0001…0052.

**Expected tables in public = 17**: aac_reference, accounts, apa_memberships, audit_logs, businesses, ful_reference, pbm_info, pending_registrations, profiles, reference_dataset_versions, report_files, subscriptions, system_config, user_businesses, user_data, user_roles, wac_reference.

**Expected functions in public = 19**: admin_audit, admin_billing_status, admin_members, admin_stores, audit_logs_immutable, audit_write, handle_new_user, is_account_member, is_admin_of, is_member_of, is_owner_of_account, my_business_ids, owedbook_kpis, owedbook_pbm_options, owedbook_rows, owedbook_summary, rls_auto_enable, tenant_stores, update_updated_at.

**Expected audit_write() stamping triggers = 14** (named audit_write in 0031–0043, audit_stamp in 0052) on: aac_reference, accounts, apa_memberships, businesses, ful_reference, pbm_info, pending_registrations, reference_dataset_versions, report_files, subscriptions, system_config, user_businesses, user_data, wac_reference.

All triggers (30):
- accounts.set_updated_at (before update → update_updated_at) — supabase/migrations/0002_accounts.sql
- businesses.set_updated_at (before update → update_updated_at) — supabase/migrations/0003_businesses.sql
- user_businesses.set_updated_at (before update → update_updated_at) — supabase/migrations/0004_user_businesses.sql
- pending_registrations.set_updated_at (before update → update_updated_at) — supabase/migrations/0005_pending_registrations.sql
- subscriptions.set_updated_at (before update → update_updated_at) — supabase/migrations/0006_subscriptions.sql
- apa_memberships.set_updated_at (before update → update_updated_at) — supabase/migrations/0007_apa_memberships.sql
- reference_dataset_versions.set_updated_at (before update → update_updated_at) — supabase/migrations/0008_reference_dataset_versions.sql
- aac_reference.set_updated_at (before update → update_updated_at) — supabase/migrations/0009_aac_reference.sql
- wac_reference.set_updated_at (before update → update_updated_at) — supabase/migrations/0010_wac_reference.sql
- ful_reference.set_updated_at (before update → update_updated_at) — supabase/migrations/0011_ful_reference.sql
- pbm_info.set_updated_at (before update → update_updated_at) — supabase/migrations/0012_pbm_info.sql
- user_data.set_updated_at (before update → update_updated_at) — supabase/migrations/0013_user_data.sql
- report_files.set_updated_at (before update → update_updated_at) — supabase/migrations/0014_report_files.sql
- audit_logs.set_updated_at (before update → update_updated_at) — supabase/migrations/0015_audit_logs.sql
- audit_logs.audit_logs_immutable (before update or delete → audit_logs_immutable) — supabase/migrations/0028_audit_logs_reshape.sql
- audit_logs.audit_logs_no_truncate (before truncate → audit_logs_immutable) — supabase/migrations/0028_audit_logs_reshape.sql
- businesses.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0031_audit_stamp_businesses.sql
- user_businesses.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0032_audit_stamp_user_businesses.sql
- pending_registrations.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0033_audit_stamp_pending_registrations.sql
- user_data.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0034_audit_stamp_user_data.sql
- report_files.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0035_audit_stamp_report_files.sql
- accounts.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0036_audit_stamp_accounts.sql
- subscriptions.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0037_audit_stamp_subscriptions.sql
- apa_memberships.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0038_audit_stamp_apa_memberships.sql
- reference_dataset_versions.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0039_audit_stamp_reference_dataset_versions.sql
- aac_reference.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0040_audit_stamp_aac_reference.sql
- wac_reference.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0041_audit_stamp_wac_reference.sql
- ful_reference.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0042_audit_stamp_ful_reference.sql
- pbm_info.audit_write (after insert or update or delete → audit_write) — supabase/migrations/0043_audit_stamp_pbm_info.sql
- system_config.audit_stamp (after insert or update or delete → audit_write) — supabase/migrations/0052_system_config.sql

Unique indexes:
- user_businesses.user_businesses_one_admin (business_id) where role='admin' — supabase/migrations/0048_ownership.sql

Note: the bootstrap file may create helper/system objects that the catalog verifier filters by prokind='f' and relkind in ('r','p'); observed counts are compared to these expectations and any difference is explained in the test evidence, never reinterpreted.
