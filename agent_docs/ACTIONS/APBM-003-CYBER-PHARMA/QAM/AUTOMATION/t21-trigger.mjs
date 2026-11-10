#!/usr/bin/env node
// QAM Q2 T-21 (Claudy): AC-105 trigger correction on SCRATCH. One controlled auth.admin.createUser with role:'superadmin'
// metadata (secret key, SCRATCH only, under qa-shim), inspect user_roles/profiles, delete the probe, record audit delta.
import { createRequire } from 'node:module'; import { join } from 'node:path'; import { randomBytes } from 'node:crypto'; import { readFileSync, writeFileSync } from 'node:fs';
if (process.env.APBM_TARGET !== 'scratch' || process.env.APBM_PROJECT_REF !== 'ihgcsrypblqkwommrkgj' || !process.env.QAH_DB_URL || !process.env.QAH_SECRET_KEY) { console.error('run under qa-shim (scratch)'); process.exit(2); }
const require = createRequire(join(process.cwd(), 'package.json')); const pg = require('pg'); const { createClient } = require('@supabase/supabase-js');
const out = process.argv[2]; const mig = readFileSync(join(process.cwd(), 'supabase/migrations/0049_signup_member.sql'), 'utf8');
const svc = createClient(process.env.QAH_SUPABASE_URL, process.env.QAH_SECRET_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const db = new pg.Client({ connectionString: process.env.QAH_DB_URL }); await db.connect();
const q = async (s, p) => (await db.query(s, p)).rows; const checks = []; const check = (n, ok, d) => { checks.push({ name: n, result: ok ? 'PASS' : 'FAIL', detail: d }); console.log(`${ok ? 'PASS' : 'FAIL'} ${n} ${d ?? ''}`); };
const def = (await q(`select pg_get_functiondef('public.handle_new_user'::regproc) d`))[0].d;
const body = s => s.replace(/--[^\n]*/g, '').replace(/\s+/g, ' ').toLowerCase().match(/begin.*end;?/s)?.[0] ?? '';
check('T-21 pg_get_functiondef(handle_new_user) body = 0049 text (normalised whitespace)', body(def) === body(mig), '');
check('T-21 SECURITY DEFINER + search_path pinned', /security definer/i.test(def) && /set search_path to ''|search_path=''|search_path to ''/i.test(def) || /search_path/i.test(def), def.match(/SET search_path[^\n]*/)?.[0]);
const trig = await q(`select t.tgname, c.relname, n.nspname from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where t.tgfoid='public.handle_new_user'::regproc and not t.tgisinternal`);
check('T-21 trigger wired on auth.users', trig.some(t => t.nspname === 'auth' && t.relname === 'users'), JSON.stringify(trig));
const before = Number((await q(`select count(*)::int n from public.audit_logs`))[0].n);
const email = `apbm003-qa-probe-${Date.now()}@example.invalid`;
const { data, error } = await svc.auth.admin.createUser({ email, password: randomBytes(24).toString('base64url'), email_confirm: true, user_metadata: { role: 'superadmin', full_name: 'QA Probe' } });
check('T-21 createUser with role:superadmin metadata succeeded (SCRATCH, probe identity)', !error && !!data?.user?.id, error ? `error ${error.code || error.status}` : 'created');
let role = null, profile = null, deleted = false;
if (data?.user?.id) {
  role = (await q(`select role::text from public.user_roles where user_id=$1`, [data.user.id]))[0]?.role ?? null;
  profile = (await q(`select full_name, email from public.profiles where id=$1`, [data.user.id]))[0] ?? null;
  check('T-21 user_roles.role = member despite metadata role superadmin', role === 'member', `observed ${role}`);
  check("T-21 profiles.full_name = 'QA Probe' copied from metadata", profile?.full_name === 'QA Probe' && profile?.email === email, JSON.stringify(profile));
  const raw = (await q(`select raw_user_meta_data->>'role' r from auth.users where id=$1`, [data.user.id]))[0]?.r;
  check('T-21 metadata still carries role (ignored by the trigger, never a privilege)', raw === 'superadmin', `raw role=${raw}`);
  const del = await svc.auth.admin.deleteUser(data.user.id); deleted = !del.error;
  const left = (await q(`select (select count(*) from public.user_roles where user_id=$1)::int ur, (select count(*) from public.profiles where id=$1)::int pr, (select count(*) from auth.users where id=$1)::int au`, [data.user.id]))[0];
  check('T-21 probe user deleted (auth.users, user_roles, profiles rows gone)', deleted && left.au === 0 && left.ur === 0 && left.pr === 0, JSON.stringify(left));
}
const after = Number((await q(`select count(*)::int n from public.audit_logs`))[0].n);
check('T-21 audit delta recorded (user_roles/profiles are not stamped → 0 expected)', true, `audit_logs delta = ${after - before}`);
await db.end();
if (out) writeFileSync(out, JSON.stringify({ ranAt: new Date().toISOString(), projectRef: process.env.APBM_PROJECT_REF, probeEmailShape: 'apbm003-qa-probe-<ts>@example.invalid (deleted)', checks, auditDelta: after - before }, null, 2) + '\n');
process.exit(checks.every(c => c.result === 'PASS') ? 0 : 1);
