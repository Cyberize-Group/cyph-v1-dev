// Read-only preservation snapshot for an upgrade rehearsal or the DEV apply checkpoint: row identities and content
// hashes of the pre-007A tables, plus index and Auth-user identities. Prints and stores hashes only.
import pg from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/node_modules/pg/lib/index.js';
import { loadEnv, evidencePath } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/scripts/rls-harness/lib/env.mjs';
import { writeFileSync } from 'node:fs'; import { createHash } from 'node:crypto';
const env = loadEnv(); const label = process.argv[2]; if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('label required');
const c = new pg.Client({ connectionString: env.DB_URL, connectionTimeoutMillis: 10000 }); await c.connect();
const h = v => createHash('sha256').update(v).digest('hex'); const out = { projectRef: env.projectRef, label, at: new Date().toISOString(), tables: {} };
try { await c.query('BEGIN READ ONLY');
  const tables = ['accounts', 'businesses', 'user_businesses', 'user_roles', 'profiles', 'user_data', 'report_files', 'pbm_info', 'aac_reference', 'wac_reference', 'ful_reference', 'reference_dataset_versions', 'system_config', 'pending_registrations', 'apa_memberships'];
  for (const t of tables) { const r = (await c.query(`select count(*)::int n, coalesce(string_agg(to_jsonb(x)::text, '|' order by x.id::text), '') body from public.${t} x`)).rows[0]; out.tables[t] = { rows: r.n, contentSHA256: h(r.body) }; }
  // subscriptions gain columns: compare the pre-007A columns only
  const s = (await c.query("select count(*)::int n, coalesce(string_agg(concat_ws('~', id, account_id, coalesce(stripe_customer_id,''), coalesce(stripe_subscription_id,''), coalesce(status,''), coalesce(current_period_end::text,''), cancel_at_period_end, created_at), '|' order by id::text), '') body from public.subscriptions")).rows[0];
  out.tables.subscriptions_pre007a_columns = { rows: s.n, contentSHA256: h(s.body) };
  const a = (await c.query("select count(*)::int n, max(id) max_id from public.audit_logs")).rows[0]; out.auditLogs = { rows: a.n, maxId: String(a.max_id) };
  const u = (await c.query("select count(*)::int n, coalesce(string_agg(id::text, '|' order by id::text), '') ids from auth.users")).rows[0]; out.authUsers = { count: u.n, idSetSHA256: h(u.ids) };
  const i = (await c.query("select coalesce(string_agg(indexname || ' ' || indexdef, '|' order by indexname), '') d, count(*)::int n from pg_indexes where schemaname = 'public'")).rows[0]; out.indexes = { count: i.n, definitionSHA256: h(i.d) };
  out.indexNames = (await c.query("select indexname from pg_indexes where schemaname = 'public' order by 1")).rows.map(r => r.indexname);
  out.ledger = (await c.query('select count(*)::int n, max(name) last from apbm_migrations.ledger')).rows[0];
  await c.query('ROLLBACK');
} finally { await c.end(); }
writeFileSync(evidencePath(`preserve-${label}.json`), JSON.stringify(out, null, 2) + '\n'); console.log(JSON.stringify({ label, ledger: out.ledger, authUsers: out.authUsers.count, audit: out.auditLogs.rows, indexes: out.indexes.count }));
