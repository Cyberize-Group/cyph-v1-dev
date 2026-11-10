#!/usr/bin/env node
// QAM Q2 T-14/T-17/T-18/T-19/T-20 (Claudy): cast and access matrix on SCRATCH with REAL password logins through the
// publishable key (never the secret key for any graded cell); ground truth and audit deltas via the service DB connection.
// Runs under qa-shim with --credential-file (the seed's private /tmp cast file). Tokens live in process memory only.
//   node cast-matrix.mjs <out.json> [--attack-flip]   (--attack-flip: one expectation deliberately inverted → must report FAIL)
import { createRequire } from 'node:module'; import { join } from 'node:path'; import { readFileSync, writeFileSync, lstatSync } from 'node:fs';
if (process.env.APBM_TARGET !== 'scratch' || process.env.APBM_PROJECT_REF !== 'ihgcsrypblqkwommrkgj' || !process.env.QAH_DB_URL) { console.error('run under qa-shim (scratch)'); process.exit(2); }
const cred = process.env.APBM_CREDENTIAL_FILE; if (!cred?.startsWith('/tmp/') || lstatSync(cred).mode & 0o077) { console.error('private 0600 cast credential file required'); process.exit(2); }
const credentials = JSON.parse(readFileSync(cred, 'utf8')); if (credentials.projectRef !== 'ihgcsrypblqkwommrkgj') { console.error('cast file target mismatch'); process.exit(3); }
const require = createRequire(join(process.cwd(), 'package.json')); const pg = require('pg'); const { createClient } = require('@supabase/supabase-js');
const out = process.argv[2]; const flip = process.argv.includes('--attack-flip');
const db = new pg.Client({ connectionString: process.env.QAH_DB_URL }); await db.connect(); const q = async (s, p) => (await db.query(s, p)).rows;
const checks = []; let fails = 0; const check = (n, ok, d) => { checks.push({ name: n, result: ok ? 'PASS' : 'FAIL', detail: d }); if (!ok) fails++; console.log(`${ok ? 'PASS' : 'FAIL'} ${n} ${d ?? ''}`); };
const stores = Object.fromEntries((await q(`select id::text id, pharmacy_name from public.businesses`)).map(r => [r.pharmacy_name.replace('SYNTHETIC STORE ', ''), r.id]));
const accounts = Object.fromEntries((await q(`select id::text id, name from public.accounts`)).map(r => [r.name.replace('SYNTHETIC ACCOUNT ', ''), r.id]));
// ---- T-14 exact cast (expected from evidence/derivations/01/cast.md)
const EXP_VISIBLE = { OWNER1: ['A1'], OWNER3: ['B1', 'B2', 'B3'], ADMIN_B2: ['B2'], ADMIN_B3: ['B3'], MEMBER_B1: ['B1'], MEMBER_B2B3: ['B2', 'B3'], UNRELATED: ['C1'] };
const EXP_ADMIN = { OWNER1: ['A1'], OWNER3: ['B1', 'B2', 'B3'], ADMIN_B2: ['B2'], ADMIN_B3: ['B3'], MEMBER_B1: [], MEMBER_B2B3: [], UNRELATED: ['C1'] };
const EXP_JUNCTIONS = [['OWNER1', 'A1', 'admin'], ['OWNER3', 'B1', 'admin'], ['ADMIN_B2', 'B2', 'admin'], ['ADMIN_B3', 'B3', 'admin'], ['MEMBER_B1', 'B1', 'member'], ['MEMBER_B2B3', 'B2', 'member'], ['MEMBER_B2B3', 'B3', 'member'], ['UNRELATED', 'C1', 'admin']];
const EXP_OWNERS = { A: 'OWNER1', B: 'OWNER3', C: 'UNRELATED' };
const users = Object.fromEntries((await q(`select id::text id, email from public.profiles where email like 'apbm003-%@example.invalid'`)).map(r => [r.email.replace('apbm003-', '').replace('@example.invalid', '').toUpperCase(), r.id]));
const CAST_EMAILS = ['owner1', 'owner3', 'admin_b2', 'admin_b3', 'member_b1', 'member_b2b3', 'unrelated'].map(h => `apbm003-${h}@example.invalid`);
const authUsers = await q(`select count(*)::int n, count(*) filter (where email = any($1::text[]))::int cast_n, count(*) filter (where email = any($1::text[]) and raw_user_meta_data ? 'role')::int cast_with_role_key, count(*) filter (where email ilike 'apbm003-operator%')::int operator_n, count(*) filter (where email <> all($1::text[]))::int other_preexisting from auth.users`, [CAST_EMAILS]);
check('T-14 auth.users seeded cast = exactly the 7 handles (one each), no OPERATOR, no metadata role key on any cast user', authUsers[0].cast_n === 7 && Object.keys(users).length === 7 && !('OPERATOR' in users) && authUsers[0].cast_with_role_key === 0 && authUsers[0].operator_n === 0, JSON.stringify({ ...authUsers[0], handles: Object.keys(users).sort(), note: 'other_preexisting = non-seed users already on the disposable SCRATCH (reset.mjs preserves them by design)' }));
const roles = await q(`select u.role::text, count(*)::int n from public.user_roles u join public.profiles p on p.id=u.user_id where p.email like 'apbm003-%@example.invalid' group by 1`);
check('T-14 user_roles = 7 × member', roles.length === 1 && roles[0].role === 'member' && roles[0].n === 7, JSON.stringify(roles));
const acct = await q(`select a.name, p.email from public.accounts a join public.profiles p on p.id=a.owner_user_id order by a.name`);
check('T-14 accounts 3 with owners A/OWNER1 B/OWNER3 C/UNRELATED', acct.length === 3 && acct.every(a => EXP_OWNERS[a.name.replace('SYNTHETIC ACCOUNT ', '')] === a.email.replace('apbm003-', '').replace('@example.invalid', '').toUpperCase()), JSON.stringify(acct));
const biz = await q(`select b.pharmacy_name, a.name acct from public.businesses b join public.accounts a on a.id=b.account_id order by 1`);
check('T-14 businesses 5 = A1(A) B1,B2,B3(B) C1(C)', JSON.stringify(biz.map(b => b.pharmacy_name.slice(-2) + '(' + b.acct.slice(-1) + ')')) === JSON.stringify(['A1(A)', 'B1(B)', 'B2(B)', 'B3(B)', 'C1(C)']), JSON.stringify(biz));
const junct = (await q(`select p.email, b.pharmacy_name, ub.role from public.user_businesses ub join public.profiles p on p.id=ub.user_id join public.businesses b on b.id=ub.business_id`)).map(r => [r.email.replace('apbm003-', '').replace('@example.invalid', '').toUpperCase(), r.pharmacy_name.slice(-2), r.role].join(':')).sort();
const expJ = EXP_JUNCTIONS.map(j => j.join(':')).sort();
check('T-14 user_businesses = exactly the 8 SFC §2 junction rows', JSON.stringify(junct) === JSON.stringify(expJ), JSON.stringify(junct));
{ const wrong = [...expJ]; wrong[1] = 'OWNER3:B2:admin'; check('T-14 negative control: a deliberately wrong expected junction table must mismatch', JSON.stringify(junct) !== JSON.stringify(wrong.sort()), 'mismatch detected'); }
check('T-14 profiles 7 for the cast', (await q(`select count(*)::int n from public.profiles where email like 'apbm003-%@example.invalid'`))[0].n === 7, '');
// ---- helpers
const auditCount = async (uid, fn) => Number((await q(`select count(*)::int n from public.audit_logs where action='read_page' and actor_user_id=$1 ${fn ? "and context->>'fn'=$2" : ''}`, fn ? [uid, fn] : [uid]))[0].n);
const totalAudit = async () => Number((await q(`select count(*)::int n from public.audit_logs`))[0].n);
const snapshot = async (table, where = '', params = []) => JSON.stringify((await q(`select to_jsonb(t) r from public.${table} t ${where} order by id`, params)).map(r => r.r));
const clients = {};
for (const [who, idn] of Object.entries(credentials.identities)) {
  const c = createClient(process.env.QAH_SUPABASE_URL, process.env.QAH_PUBLISHABLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const r = await c.auth.signInWithPassword({ email: idn.email, password: idn.password });
  check(`login ${who} via publishable key`, !r.error && r.data.user.id === users[who], r.error ? `error ${r.error.status}` : 'ok');
  clients[who] = c;
}
const anon = createClient(process.env.QAH_SUPABASE_URL, process.env.QAH_PUBLISHABLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const denied = r => r.error && r.error.code === '42501';
// ---- T-17 per identity
for (const [who, visible] of Object.entries(EXP_VISIBLE)) {
  const c = clients[who]; const uid = users[who]; const own = stores[visible[0]];
  const scope = await c.rpc('tenant_stores');
  let expectScope = visible.map(s => stores[s]).sort(); if (flip && who === 'OWNER3') expectScope = ['B1', 'B2'].map(s => stores[s]).sort(); // --attack-flip inverts one expectation
  check(`T-17c ${who} tenant_stores = exactly ${visible.join(',')}`, !scope.error && JSON.stringify(scope.data.map(r => r.id).sort()) === JSON.stringify(expectScope), scope.error ? `error ${scope.error.code}` : `got ${scope.data.length} stores`);
  const sel = await c.from('user_data').select('id').limit(1);
  check(`T-17a ${who} direct SELECT user_data → 42501 (not an empty set)`, denied(sel), `code=${sel.error?.code} rows=${sel.data?.length}`);
  const auditSel = await c.from('audit_logs').select('id').limit(1);
  check(`T-17a ${who} direct SELECT audit_logs → 42501`, denied(auditSel), `code=${auditSel.error?.code}`);
  const prof = await c.from('profiles').select('id').limit(5);
  check(`T-17 control ${who} SELECT profiles allowed (probe distinguishes deny from empty)`, !prof.error && prof.data.length >= 1, `rows=${prof.data?.length}`);
  // mutations: never trust RETURNING; verify with service-side snapshot AFTER
  const before = await snapshot('user_data', 'where business_id=$1', [own]);
  const row = (await q(`select id from public.user_data where business_id=$1 order by id limit 1`, [own]))[0].id;
  const ins = await c.from('user_data').insert({ business_id: own, script: 'QA-DENIED' });
  const upd = await c.from('user_data').update({ owed: 999 }).eq('id', row);
  const del = await c.from('user_data').delete().eq('id', row);
  check(`T-17b ${who} INSERT/UPDATE/DELETE user_data → 42501 ×3, rows unchanged (service-side read after)`, denied(ins) && denied(upd) && denied(del) && (await snapshot('user_data', 'where business_id=$1', [own])) === before, `codes ${ins.error?.code}/${upd.error?.code}/${del.error?.code}`);
  const acctId = (await q(`select account_id::text a from public.businesses where id=$1`, [own]))[0].a;
  const aBefore = await snapshot('accounts', 'where id=$1', [acctId]), sBefore = await snapshot('subscriptions', 'where account_id=$1', [acctId]);
  const subId = (await q(`select id from public.subscriptions where account_id=$1 limit 1`, [acctId]))[0].id;
  const aSafe = await c.from('accounts').update({ name: 'QA-DENIED' }).eq('id', acctId);
  const sSafe = await c.from('subscriptions').update({ cancel_at_period_end: true }).eq('id', subId);
  const sEnt = await c.from('subscriptions').update({ status: 'active', current_period_end: '2099-01-01T00:00:00Z' }).eq('id', subId);
  const aIns = await c.from('accounts').insert({ name: 'QA-DENIED', owner_user_id: uid });
  const sDel = await c.from('subscriptions').delete().eq('id', subId);
  check(`T-17b/AC-104 ${who} accounts/subscriptions UPDATE (safe + entitlement) / INSERT / DELETE → 42501, unchanged`, denied(aSafe) && denied(sSafe) && denied(sEnt) && denied(aIns) && denied(sDel) && (await snapshot('accounts', 'where id=$1', [acctId])) === aBefore && (await snapshot('subscriptions', 'where account_id=$1', [acctId])) === sBefore, `codes ${aSafe.error?.code}/${sSafe.error?.code}/${sEnt.error?.code}/${aIns.error?.code}/${sDel.error?.code}`);
  const auditBefore = await snapshot('audit_logs', 'where id > (select max(id)-5 from public.audit_logs)');
  const aiIns = await c.from('audit_logs').insert({ actor_role: 'authenticated', table_name: 'qa', action: 'insert' });
  check(`T-17 observation ${who} INSERT audit_logs (privilege granted by default ACL) → denied by FORCE RLS 42501, no row`, denied(aiIns) && (await snapshot('audit_logs', 'where id > (select max(id)-5 from public.audit_logs)')) === auditBefore, `code=${aiIns.error?.code}`);
  const cfg = await c.from('system_config').select('key,value'); check(`T-17 ${who} system_config scoped read (0052) = 2 rows`, !cfg.error && cfg.data.length === 2, `rows=${cfg.data?.length}`);
  const cfgW = await c.from('system_config').update({ value: 1 }).eq('state', 'AL'); check(`T-17 ${who} system_config UPDATE → 42501`, denied(cfgW), `code=${cfgW.error?.code}`);
  // wrapper success + exact audit
  const b = await auditCount(uid, 'owedbook_rows'); const rows = await c.rpc('owedbook_rows', { p_business_id: own, p_tab: 'commercial_dollars' });
  check(`T-17/T-20 ${who} owedbook_rows(${visible[0]}) succeeds: total 50, 25 rows, +1 read_page`, !rows.error && rows.data.total === 50 && rows.data.rows.length === 25 && rows.data.rows.every(r => r.report_file === null && r.aac === null && r.federal_expected === null && r.federal_diff === null) && (await auditCount(uid, 'owedbook_rows')) - b === 1, rows.error ? `error ${rows.error.code}` : `audit +${(await auditCount(uid, 'owedbook_rows')) - b}`);
  for (const fn of ['owedbook_kpis', 'owedbook_summary', 'owedbook_pbm_options']) { const bb = await auditCount(uid, fn); const r = await c.rpc(fn, { p_business_id: own }); check(`T-20 ${who} ${fn} +1`, !r.error && (await auditCount(uid, fn)) - bb === 1, r.error ? `error ${r.error.code}` : ''); }
  // foreign store → refused, +0
  const foreign = Object.keys(stores).find(s => !visible.includes(s)); const tb = await totalAudit(); const f = await c.rpc('owedbook_rows', { p_business_id: stores[foreign], p_tab: 'commercial_dollars' });
  check(`T-18 ${who} owedbook_rows(${foreign}) → 'not a member of business', +0 audit`, f.error?.message === 'not a member of business' && (await totalAudit()) === tb, `msg=${f.error?.message}`);
  // T-19 admin RPCs
  const admin = EXP_ADMIN[who];
  for (const fn of ['admin_stores', 'admin_members', 'admin_billing_status', 'admin_audit']) {
    const bb = await auditCount(uid, fn); const r = await c.rpc(fn, { p_business_id: own }); const allowed = admin.length > 0;
    check(`T-19 ${who} ${fn}(${visible[0]}) ${allowed ? 'allowed +1' : 'denied 42501 +0'}`, allowed ? !r.error && (await auditCount(uid, fn)) - bb === 1 : r.error?.code === '42501' && (await auditCount(uid, fn)) - bb === 0, r.error ? `code=${r.error.code}` : 'ok');
    if (allowed && fn === 'admin_audit' && !r.error) {
      const ids = r.data.rows.map(x => Number(x.id)); const snap = Number(r.data.snapshot_id);
      check(`T-19 ${who} admin_audit snapshot excludes its own new row`, ids.every(i => i <= snap), `max id ${Math.max(...ids, 0)} ≤ snapshot ${snap}`);
      const permitted = new Set((who === 'OWNER3' ? ['B1', 'B2', 'B3'] : visible).map(s => stores[s])); const ownerAcct = who === 'OWNER3' ? accounts.B : who === 'OWNER1' ? accounts.A : who === 'UNRELATED' ? accounts.C : null;
      const scoped = r.data.rows.every(x => (x.business_id && permitted.has(x.business_id)) || (x.business_id === null && ownerAcct && (x.table_name === 'accounts' ? x.row_id === ownerAcct : true)));
      check(`T-19 ${who} admin_audit rows scoped to permitted stores (${who === 'OWNER3' ? 'B1∪B2∪B3 ∪ account-B NULL-business rows' : visible.join(',')}), never A/C of others`, scoped, `${r.data.rows.length} rows, ${r.data.rows.filter(x => x.business_id === null).length} NULL-business rows`);
    }
  }
}
// ---- T-18 owner reach specifics
{ const o = clients.OWNER3, uid = users.OWNER3; const nj = await q(`select count(*)::int n from public.user_businesses where user_id=$1 and business_id in ($2,$3)`, [uid, stores.B2, stores.B3]);
  check('T-18 OWNER3 has no junction row for B2/B3 (reach by ownership alone)', nj[0].n === 0, '');
  for (const s of ['B2', 'B3']) { const b = await auditCount(uid, 'owedbook_rows'); const r = await o.rpc('owedbook_rows', { p_business_id: stores[s], p_tab: 'commercial_dollars' }); check(`T-18 OWNER3 → owedbook_rows(${s}) succeeds without junction, +1`, !r.error && r.data.total === 50 && (await auditCount(uid, 'owedbook_rows')) - b === 1, r.error?.message ?? ''); }
  for (const s of ['A1', 'C1']) { const tb = await totalAudit(); const r = await o.rpc('owedbook_rows', { p_business_id: stores[s], p_tab: 'commercial_dollars' }); check(`T-18 OWNER3 → owedbook_rows(${s}) refused 'not a member of business', +0`, r.error?.message === 'not a member of business' && (await totalAudit()) === tb, r.error?.message ?? 'ALLOWED'); }
  const b2 = await auditCount(uid, 'admin_members'); const am = await o.rpc('admin_members', { p_business_id: stores.B2 }); check('T-19 OWNER3 admin_members(B2) ok +1 (owner without junction)', !am.error && (await auditCount(uid, 'admin_members')) - b2 === 1, am.error?.code ?? '');
  for (const [who, s] of [['UNRELATED', 'A1'], ['UNRELATED', 'B1'], ['OWNER1', 'B1'], ['MEMBER_B2B3', 'B1']]) { const tb = await totalAudit(); const r = await clients[who].rpc('owedbook_rows', { p_business_id: stores[s], p_tab: 'commercial_dollars' }); check(`T-18 ${who} → ${s} refused, +0`, r.error?.message === 'not a member of business' && (await totalAudit()) === tb, r.error?.message ?? 'ALLOWED'); }
  const ab = await auditCount(users.ADMIN_B2, 'admin_members'); const a3 = await clients.ADMIN_B2.rpc('admin_members', { p_business_id: stores.B3 }); check('T-19 ADMIN_B2 admin_members(B3) → 42501, +0', a3.error?.code === '42501' && (await auditCount(users.ADMIN_B2, 'admin_members')) === ab, a3.error?.code ?? 'ALLOWED');
  const ua = await clients.UNRELATED.rpc('admin_audit', { p_business_id: stores.B1 }); check('T-19 UNRELATED admin_audit(B1) → 42501', ua.error?.code === '42501', ua.error?.code ?? 'ALLOWED');
  const adm = await clients.ADMIN_B2.rpc('admin_audit', { p_business_id: stores.B2, p_limit: 100 }); check('T-19 ADMIN_B2 admin_audit returns only business_id=B2 rows (no NULL-business account rows)', !adm.error && adm.data.rows.every(x => x.business_id === stores.B2), `${adm.data?.rows?.length} rows`);
  const tsB = await totalAudit(); await o.rpc('tenant_stores'); check('T-19 tenant_stores adds 0 audit rows', (await totalAudit()) === tsB, '');
  // T-20 retry and rejected
  const kb = await auditCount(uid, 'owedbook_kpis'); await o.rpc('owedbook_kpis', { p_business_id: stores.B2 }); await o.rpc('owedbook_kpis', { p_business_id: stores.B2 }); check('T-20 lost-response retry (same call twice) → 2 committed read_page rows', (await auditCount(uid, 'owedbook_kpis')) - kb === 2, '');
  const tb2 = await totalAudit(); const bad = await o.rpc('admin_audit', { p_business_id: stores.B2, p_limit: 101 }); check('T-20 rejected call (invalid limit 22023) → 0 rows', bad.error?.code === '22023' && (await totalAudit()) === tb2, bad.error?.code ?? '');
  for (const fn of ['tenant_stores', 'owedbook_kpis', 'owedbook_rows', 'admin_stores', 'admin_audit']) { const r = await anon.rpc(fn, fn === 'tenant_stores' ? {} : { p_business_id: stores.A1, ...(fn === 'owedbook_rows' ? { p_tab: 'commercial_dollars' } : {}) }); check(`T-17 anon ${fn} refused`, !!r.error, r.error?.code ?? 'ALLOWED'); }
}
// ---- observation probe: TRUNCATE privilege held by authenticated (SQL-level, rolled back; SCRATCH only)
{ await db.query('BEGIN'); let code = 'EXECUTED'; try { await db.query('SET LOCAL ROLE authenticated'); await db.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ role: 'authenticated', sub: users.OWNER3 })]); await db.query('TRUNCATE public.user_data'); } catch (e) { code = e.code; } finally { await db.query('ROLLBACK'); }
  const n = Number((await q(`select count(*)::int n from public.user_data`))[0].n);
  check('OBSERVATION authenticated role TRUNCATE public.user_data (SQL-level, inside a rolled-back transaction)', code !== 'EXECUTED', `result=${code === 'EXECUTED' ? 'TRUNCATE EXECUTED (privilege effective; RLS does not govern TRUNCATE)' : 'denied ' + code}; rows after rollback=${n}`);
  await db.query('BEGIN'); let code2 = 'EXECUTED'; try { await db.query('SET LOCAL ROLE authenticated'); await db.query('TRUNCATE public.audit_logs'); } catch (e) { code2 = e.code; } finally { await db.query('ROLLBACK'); }
  check('OBSERVATION authenticated role TRUNCATE public.audit_logs → blocked by BEFORE TRUNCATE guard (P0001)', code2 === 'P0001', `result=${code2}`); }
for (const c of Object.values(clients)) await c.auth.signOut().catch(() => {});
await db.end();
const summary = { ranAt: new Date().toISOString(), projectRef: 'ihgcsrypblqkwommrkgj', attackFlip: flip, pass: checks.filter(c => c.result === 'PASS').length, fail: fails, checks };
if (out) writeFileSync(out, JSON.stringify(summary, null, 2) + '\n'); console.log(`summary: ${summary.pass} PASS / ${fails} FAIL${flip ? ' (attack-flip run: FAIL expected)' : ''}`);
process.exit(fails ? 1 : 0);
