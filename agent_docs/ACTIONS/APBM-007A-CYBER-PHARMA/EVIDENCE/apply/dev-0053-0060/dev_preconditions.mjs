// Read-only DEV preconditions for the 0053–0060 apply checkpoint. One read-only transaction, rolled back. Counts only.
import pg from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/node_modules/pg/lib/index.js';
import { loadEnv, evidencePath, DEV_REF } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/scripts/rls-harness/lib/env.mjs';
import { writeFileSync } from 'node:fs';
const env = loadEnv(); if (env.target !== 'dev' || env.projectRef !== DEV_REF) throw new Error('DEV only');
const c = new pg.Client({ connectionString: env.DB_URL, connectionTimeoutMillis: 10000 }); await c.connect();
const one = async (sql, p = []) => (await c.query(sql, p)).rows[0]; const out = { projectRef: env.projectRef, at: new Date().toISOString() };
try { await c.query('BEGIN READ ONLY'); out.readOnly = (await one('show transaction_read_only')).transaction_read_only;
  out.ledger = await one('select count(*)::int rows, max(name) last from apbm_migrations.ledger');
  out.npi = await one("select (select count(*)::int from (select npi from public.businesses group by npi having count(*) > 1) d) duplicates, (select count(*)::int from public.businesses where npi is null) nulls, (select count(*)::int from public.businesses) stores");
  out.policyBusinessUpdateAdmin = (await one("select count(*)::int n from pg_policies where schemaname='public' and tablename='businesses' and policyname='business_update_admin'")).n;
  out.customerStoreUpdatesInAudit = (await one("select count(*)::int n from public.audit_logs where table_name='businesses' and action='update' and actor_role='authenticated'")).n;
  out.subscriptions = await one(`select count(*)::int total,
     count(*) filter (where stripe_customer_id is not null or stripe_subscription_id is not null or stripe_checkout_session_id is not null)::int stripe_linked,
     count(*) filter (where (id, account_id, status) in (('f273325d-14b7-4921-aa99-9b4dda4eed1f'::uuid,'a6d4b0a2-62fe-4dc0-ab57-5a2255d6b129'::uuid,'active'),('324794d8-c96d-4cbb-a146-e2d83c371492'::uuid,'fcb3c889-26ae-4e5e-a003-4b5186aab94b'::uuid,'trialing'),('7252e65c-4616-4ece-ad1b-90883aba0cb0'::uuid,'6d6c91c3-93fc-4d61-a2b7-234944ffd51a'::uuid,'past_due')))::int exact_fixture_matches,
     (select count(*)::int from (select account_id from public.subscriptions where status <> 'canceled' group by 1 having count(*) > 1) x) accounts_with_two_current from public.subscriptions`);
  out.nameCollisions = (await c.query("select n.nspname || '.' || c.relname name from pg_class c join pg_namespace n on n.oid = c.relnamespace where (n.nspname = 'public' and c.relname in ('billing_customers','registration_drafts','npi_reservations','checkout_operations','stripe_events','notification_operations','uq_businesses_npi','subscriptions_one_current')) or n.nspname = 'handoff'")).rows.map(r => r.name);
  out.schemaHandoffExists = (await one("select count(*)::int n from pg_namespace where nspname = 'handoff'")).n;
  out.functionCollisions = (await c.query("select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname in ('npi_is_valid','npi_reserve','npi_bind','npi_release_unpaid','operation_lease','subscription_mirror_apply','subscription_grace_start','subscription_grace_clear','provision_paid_registration','handoff_issue','handoff_claim','handoff_complete','handoff_fail','handoff_invalidate_user','account_access_state','store_access_state','owner_billing_overview')")).rows.map(r => r.proname);
  out.triggerFunctionsPresent = (await one("select count(*)::int n from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname in ('rls_auto_enable','update_updated_at','audit_logs_immutable','audit_write','is_owner_of_account','is_admin_of','my_business_ids')")).n;
  out.ownersWithMoreThanOneAccount = (await one("select count(*)::int n from (select owner_user_id from public.accounts group by 1 having count(*) > 1) x")).n;
  out.authSessionsReadableByThisRole = (await one("select has_table_privilege(current_user, 'auth.sessions', 'SELECT') ok")).ok;
  out.currentUser = (await one('select current_user u')).u; out.serverVersion = (await one('show server_version')).server_version;
  await c.query('ROLLBACK');
} finally { await c.end(); }
writeFileSync(evidencePath('dev-preconditions.json'), JSON.stringify(out, null, 2) + '\n'); console.log(JSON.stringify(out));
