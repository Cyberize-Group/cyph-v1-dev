// Read-only DEV SQL inspection. Identity is verified BEFORE any catalog read. One READ ONLY transaction, rolled back.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'; import { createHash } from 'node:crypto';
import { loadApp, reqOB, sqlRef, apiRef, DEV_REF, ROOT, W, scrub, count } from './lib.mjs'; import { cast, findUser, say } from './sb_lib.mjs';
const pg = reqOB('pg'); const e = loadApp('ob'); const out = { identity: {} };
if (!e.APBM_DEV_DB_URL) throw new Error('APBM_DEV_DB_URL absent');
const u = new URL(e.APBM_DEV_DB_URL);
out.identity.urlProjectRef = sqlRef(e.APBM_DEV_DB_URL); out.identity.matchesDEV = out.identity.urlProjectRef === DEV_REF; out.identity.matchesAppApiRef = out.identity.urlProjectRef === apiRef(e.NEXT_PUBLIC_SUPABASE_URL);
out.identity.hostKind = u.hostname.includes('pooler') ? 'pooler' : 'direct'; out.identity.port = u.port; out.identity.db = u.pathname;
if (!out.identity.matchesDEV || !out.identity.matchesAppApiRef) { say(out); throw new Error('STOP: database URL is not the DEV project'); }
const apiIds = {}; for (const [r, em] of Object.entries(cast)) apiIds[r] = (await findUser(em))?.id;
const c = new pg.Client({ connectionString: e.APBM_DEV_DB_URL, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } });
const q = async (sql, p) => { count('supabase_read', 1, 'sql'); return (await c.query(sql, p)).rows; };
try { await c.connect(); await c.query('BEGIN READ ONLY'); await c.query("SET LOCAL statement_timeout='20s'");
  const ro = (await q('SHOW transaction_read_only'))[0].transaction_read_only; if (ro !== 'on') throw new Error('STOP: not read-only');
  const who = (await q("select current_database() db, current_user usr, split_part(version(),' ',2) pgv"))[0];
  // positive cross-check with the API: the four identities created through the API must exist here with the same IDs
  const seen = (await q('select id::text from auth.users where id = any($1::uuid[])', [Object.values(apiIds)])).length;
  Object.assign(out.identity, { transactionReadOnly: ro, database: who.db, role: who.usr, postgres: who.pgv, apiCreatedIdentitiesFoundInThisDatabase: `${seen}/4` });
  if (seen !== 4) throw new Error('STOP: API/SQL identity cross-check failed');
  // ---- ledger
  const dir = `${ROOT}/cyph-v1-dev/supabase/migrations`; const files = readdirSync(dir).filter(f => /^\d{4}_.*\.sql$/.test(f)).sort().map(f => ({ name: f, sha: createHash('sha256').update(readFileSync(`${dir}/${f}`)).digest('hex') }));
  const led = await q('select name, sha256, applied_at from apbm_migrations.ledger order by name'); const norm = n => n.replace(/\.sql$/, '');
  const lm = new Map(led.map(r => [norm(r.name), r]));
  out.ledger = { rows: led.length, sourceFiles: files.length, first: led[0]?.name, last: led.at(-1)?.name, appliedRange: [led.map(r => r.applied_at).sort()[0], led.map(r => r.applied_at).sort().at(-1)].map(d => new Date(d).toISOString()),
    missingFromLedger: files.filter(f => !lm.has(norm(f.name))).map(f => f.name), extraInLedger: led.filter(r => !files.some(f => norm(f.name) === norm(r.name))).map(r => r.name), checksumMismatch: files.filter(f => lm.has(norm(f.name)) && lm.get(norm(f.name)).sha256 !== f.sha).map(f => f.name) };
  out.ledger.otherMigrationTables = await q("select schemaname||'.'||tablename t from pg_tables where tablename ilike '%migration%' or schemaname in ('supabase_migrations') order by 1");
  // ---- trigger
  const fn = (await q("select pg_get_functiondef(p.oid) def, p.prosecdef, p.proconfig, pg_get_userbyid(p.proowner) owner, p.proacl::text acl from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='handle_new_user'"))[0];
  const src49 = readFileSync(`${dir}/0049_signup_member.sql`, 'utf8'); const body = s => (s.match(/\$\$([\s\S]*?)\$\$/)?.[1] || s.match(/\$[a-z_]+\$([\s\S]*?)\$[a-z_]+\$/)?.[1] || '').replace(/\s+/g, ' ').trim();
  out.trigger = { functionPresent: !!fn, securityDefiner: fn?.prosecdef, config: fn?.proconfig, owner: fn?.owner, acl: fn?.acl, bodyEqualsMigration0049: body(fn?.def || '') === body(src49), insertsMember: /'member'/.test(fn?.def || ''), readsRoleFromMetadata: /raw_user_meta_data\s*->>?\s*'role'/.test(fn?.def || ''),
    triggersOnAuthUsers: await q("select t.tgname, t.tgenabled, p.proname from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace join pg_proc p on p.oid=t.tgfoid where n.nspname='auth' and c.relname='users' and not t.tgisinternal") };
  // ---- grants
  out.grants = { tables: await q("select table_name t, grantee g, string_agg(privilege_type, ',' order by privilege_type) p from information_schema.role_table_grants where table_schema='public' and grantee in ('anon','authenticated','PUBLIC') group by 1,2 order by 1,2"),
    defaultAcls: await q("select pg_get_userbyid(d.defaclrole) owner, n.nspname ns, d.defaclobjtype typ, d.defaclacl::text acl from pg_default_acl d left join pg_namespace n on n.oid=d.defaclnamespace where n.nspname='public' or n.nspname is null order by 1,3"),
    functions: await q("select p.proname f, pg_get_function_identity_arguments(p.oid) args, p.prosecdef secdef, p.proconfig cfg, pg_get_userbyid(p.proowner) owner, has_function_privilege('anon', p.oid, 'execute') anon, has_function_privilege('authenticated', p.oid, 'execute') auth from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prokind='f' order by 1"),
    rlsAutoEnable: (await q("select pg_get_functiondef(p.oid) def, t.evtname, t.evtevent from pg_proc p join pg_namespace n on n.oid=p.pronamespace left join pg_event_trigger t on t.evtfoid=p.oid where n.nspname='public' and p.proname='rls_auto_enable'")).map(r => ({ eventTrigger: r.evtname, event: r.evtevent, lines: r.def.split('\n').length })) };
  // ---- RLS / policies / indexes
  out.rls = await q("select c.relname t, c.relrowsecurity rls, c.relforcerowsecurity force, (select count(*)::int from pg_policies p where p.schemaname='public' and p.tablename=c.relname) policies from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' order by 1");
  out.policies = await q("select tablename t, policyname p, cmd, roles::text r from pg_policies where schemaname='public' and tablename in ('accounts','businesses','user_businesses','subscriptions','user_data','audit_logs') order by 1,2");
  out.indexes = await q("select tablename t, indexname i, indexdef d from pg_indexes where schemaname='public' and tablename in ('businesses','subscriptions','user_businesses','accounts') order by 1,2");
  // ---- auth.sessions
  const sess = await q("select user_id::text u, count(*)::int n, max(created_at) latest from auth.sessions where user_id = any($1::uuid[]) group by 1", [Object.values(apiIds)]);
  out.authSessions = { readableByThisRole: true, columns: (await q("select column_name from information_schema.columns where table_schema='auth' and table_name='sessions' order by ordinal_position")).map(r => r.column_name),
    liveSessionsByLabel: Object.fromEntries(Object.entries(apiIds).map(([r, id]) => [r, sess.find(s => s.u === id)?.n || 0])), totalSessionsAllUsers: (await q('select count(*)::int n from auth.sessions'))[0].n,
    privilege: (await q("select has_table_privilege('postgres','auth.sessions','select') postgres, has_table_privilege('authenticated','auth.sessions','select') authenticated, has_table_privilege('service_role','auth.sessions','select') service_role, has_schema_privilege('authenticated','auth','usage') auth_schema_usage_authenticated"))[0] };
  // ---- user population (no addresses): classify by creation day and tenant standing
  out.users = await q("select u.created_at::date::text created, count(*)::int users, count(*) filter (where r.role='member')::int member, count(*) filter (where r.role='admin')::int admin, count(*) filter (where r.role='superadmin')::int superadmin, count(*) filter (where exists (select 1 from public.user_businesses ub where ub.user_id=u.id))::int with_membership, count(*) filter (where exists (select 1 from public.accounts a where a.owner_user_id=u.id))::int owns_account, count(*) filter (where u.encrypted_password is not null and u.encrypted_password<>'')::int has_password from auth.users u left join public.user_roles r on r.user_id=u.id group by 1 order by 1");
  await c.query('ROLLBACK');
} finally { await c.end().catch(() => {}); }
writeFileSync(`${W}/out/db_readonly_result.json`, scrub(out)); say(out);
