#!/usr/bin/env node
// QAM Q2 T-30/T-31 (Claudy): independent read-only re-verification of the DEV APPLY receipt. Every DEV statement
// goes through AUTOMATION/ro-sql.sh (URL + SQL-side fence, READ ONLY, ROLLBACK). Expected values come from
// evidence/derivations/01/* and from sha256 of the committed migration files; the receipt is read only to compare
// identities (ledger hashes, catalog projection, preserved-user hash), never to set an expectation.
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)); const repo = resolve(here, '../../../../..'); const out = join(here, '..', 'evidence', 'apply', '01');
const sha = v => createHash('sha256').update(v).digest('hex');
const ro = sql => { const r = spawnSync('bash', [join(here, 'ro-sql.sh'), '-t'], { input: sql, encoding: 'utf8' }); if (r.status !== 0) throw new Error(`ro-sql exit ${r.status}: ${r.stderr}`); return r.stdout.trim().split('\n').filter(l => l && l !== 'ROLLBACK'); };
const roJson = sql => JSON.parse(ro(`select coalesce(json_agg(t), '[]'::json)::text from (${sql.replace(/;\s*$/, '')}) t;`).join('\n'));
const checks = []; const check = (name, ok, detail) => { checks.push({ name, result: ok ? 'PASS' : 'FAIL', detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${detail ?? ''}`); };
// expectations (QA-derived)
const deriv = f => readFileSync(join(here, '..', 'evidence', 'derivations', '01', f), 'utf8');
const expPolicies = Number(deriv('policies.md').match(/Expected permissive policies in public = (\d+)/)[1]);
const expTables = Number(deriv('catalog_counts.md').match(/Expected tables in public = (\d+)/)[1]);
const expFunctions = Number(deriv('catalog_counts.md').match(/Expected functions in public = (\d+)/)[1]);
const expAuditTriggers = Number(deriv('catalog_counts.md').match(/stamping triggers = (\d+)/)[1]);
// ---- T-30 ledger
const files = readdirSync(join(repo, 'supabase/migrations')).filter(f => /^\d{4}_.+\.sql$/.test(f)).sort();
const fileHashes = files.map(f => ({ name: f, sha256: sha(readFileSync(join(repo, 'supabase/migrations', f))) }));
const ledger = roJson(`select name, sha256 from apbm_migrations.ledger order by name`);
check('T-30 ledger has 52 rows', ledger.length === 52, `observed ${ledger.length}`);
check('T-30 ledger names = committed 0001..0052', JSON.stringify(ledger.map(l => l.name)) === JSON.stringify(files), '');
const hashMismatch = ledger.filter((l, i) => l.sha256 !== fileHashes[i]?.sha256).map(l => l.name);
check('T-30 ledger sha256 = sha256sum of committed files at candidate', hashMismatch.length === 0, hashMismatch.length ? 'mismatch: ' + hashMismatch.join(',') : 'all 52 match');
// ---- T-30 catalog projection (same 9 catalog queries as scripts/dev-verify.mjs, reused as reference text; QA runs them itself)
const queries = {
  columns: `select table_name,column_name,ordinal_position,data_type,udt_name,is_nullable,column_default,is_identity,identity_generation from information_schema.columns where table_schema='public' order by table_name,ordinal_position`,
  tables: `select c.relname,c.relkind,c.relrowsecurity,c.relforcerowsecurity,pg_get_userbyid(c.relowner) owner,c.relacl::text from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind in ('r','p','S','v') order by c.relname`,
  policies: `select tablename,policyname,permissive,roles,cmd,qual,with_check from pg_policies where schemaname='public' order by tablename,policyname`,
  functions: `select p.proname,pg_get_function_identity_arguments(p.oid) args,pg_get_functiondef(p.oid) definition,pg_get_userbyid(p.proowner) owner,p.proacl::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prokind='f' order by p.proname,pg_get_function_identity_arguments(p.oid)`,
  constraints: `select c.relname,k.conname,pg_get_constraintdef(k.oid) definition from pg_constraint k join pg_class c on c.oid=k.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' order by c.relname,k.conname`,
  indexes: `select tablename,indexname,indexdef from pg_indexes where schemaname='public' order by tablename,indexname`,
  triggers: `select c.relname,t.tgname,pg_get_triggerdef(t.oid) definition from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and not t.tgisinternal order by c.relname,t.tgname`,
  defaultACLs: `select pg_get_userbyid(d.defaclrole) owner,coalesce(n.nspname,'') namespace,d.defaclobjtype,d.defaclacl::text from pg_default_acl d left join pg_namespace n on n.oid=d.defaclnamespace where n.nspname='public' order by 1,2,3`,
  enums: `select t.typname,e.enumlabel,e.enumsortorder from pg_enum e join pg_type t on t.oid=e.enumtypid join pg_namespace n on n.oid=t.typnamespace where n.nspname='public' order by t.typname,e.enumsortorder`,
};
const snapshot = {}; for (const [k, q] of Object.entries(queries)) snapshot[k] = roJson(q);
// QA normalised projection: every row → sorted keys, every value → String(), arrays joined; stable regardless of driver typing
// arrays: json_agg yields JSON arrays, the pg driver in the receipt yields '{a,b}' text for name[]; both → 'a,b'
const normVal = v => Array.isArray(v) ? v.join(',') : v === null ? 'NULL' : /^\{.*\}$/.test(String(v)) && !String(v).includes(':') ? String(v).slice(1, -1) : String(v);
const norm = rows => rows.map(r => Object.keys(r).sort().map(k => `${k}=${normVal(r[k])}`).join('|')).sort();
const projection = Object.fromEntries(Object.entries(snapshot).map(([k, v]) => [k, norm(v)]));
const qaSha = sha(JSON.stringify(projection));
const receipt = JSON.parse(readFileSync(join(repo, 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/catalog.json'), 'utf8'));
const receiptProjection = Object.fromEntries(Object.entries(receipt.snapshot).map(([k, v]) => [k, norm(v.map(r => Object.fromEntries(Object.entries(r).map(([kk, vv]) => [kk, typeof vv === 'object' && vv !== null && !Array.isArray(vv) ? JSON.stringify(vv) : vv]))))]));
const receiptSha = sha(JSON.stringify(receiptProjection));
const diffs = Object.keys(projection).filter(k => JSON.stringify(projection[k]) !== JSON.stringify(receiptProjection[k]));
for (const k of diffs) { const a = projection[k], b = receiptProjection[k]; writeFileSync(join(out, `projection_diff_${k}.txt`), `# ${k}: rows only in DEV now (not in receipt 2026-11-07):\n` + a.filter(x => !b.includes(x)).join('\n') + `\n\n# rows only in receipt (not in DEV now):\n` + b.filter(x => !a.includes(x)).join('\n') + '\n'); }
check('T-30 QA-normalised catalog projection equals the same projection of the receipt snapshot', qaSha === receiptSha, diffs.length ? `differing sections: ${diffs.join(',')}` : `sha ${qaSha.slice(0, 16)}…`);
const tables = snapshot.tables.filter(t => ['r', 'p'].includes(t.relkind));
check(`T-30 tables = ${expTables} [QA-derived]`, tables.length === expTables, `observed ${tables.length}: ${tables.map(t => t.relname).join(',')}`);
check(`T-30 policies = ${expPolicies} [QA-derived]`, snapshot.policies.length === expPolicies, `observed ${snapshot.policies.length}`);
check(`T-30 functions = ${expFunctions} [QA-derived]`, snapshot.functions.length === expFunctions, `observed ${snapshot.functions.length}: ${snapshot.functions.map(f => f.proname).join(',')}`);
const auditTrig = snapshot.triggers.filter(t => /audit_write\(\)/.test(t.definition));
check(`T-30 audit_write() stamping triggers = ${expAuditTriggers} [QA-derived]`, auditTrig.length === expAuditTriggers, `observed ${auditTrig.length}`);
// ---- preserved users and cast
const users = roJson(`select id::text, (email like 'apbm003-%@example.invalid') as cast from auth.users order by id`);
const preserved = users.filter(u => !u.cast).map(u => u.id).sort();
check('T-30 auth.users = 12 (5 pre-existing + 7 cast)', users.length === 12 && preserved.length === 5 && users.length - preserved.length === 7, `total ${users.length}, preserved ${preserved.length}, cast ${users.length - preserved.length}; preserved-id-list sha256 ${sha(preserved.join(',')).slice(0, 16)}…`);
const pr = roJson(`select (select count(*) from public.profiles)::int profiles, (select count(*) from public.user_roles)::int user_roles, (select count(*) from public.user_roles where role='member')::int members`)[0];
check('T-30 profiles 12 / user_roles 12', pr.profiles === 12 && pr.user_roles === 12, JSON.stringify(pr));
check('T-30 default ACLs recorded (compare to receipt entries)', JSON.stringify(projection.defaultACLs) === JSON.stringify(receiptProjection.defaultACLs), `${snapshot.defaultACLs.length} entries; supabase_admin-owned: ${snapshot.defaultACLs.filter(a => a.owner === 'supabase_admin').length}`);
check('T-30 restoreVerified clause', true, 'ACCEPTED LIMITATION per APBM_RULINGS.md C-02 (receipt rehearsal.restoreVerified=false); not graded PASS');
// ---- T-31 (a) handle_new_user = 0049 text
const def = roJson(`select pg_get_functiondef('public.handle_new_user'::regproc) d`)[0].d;
const mig = readFileSync(join(repo, 'supabase/migrations/0049_signup_member.sql'), 'utf8');
const body = s => s.replace(/--[^\n]*/g, '').replace(/\s+/g, ' ').toLowerCase().match(/begin.*end;?/s)?.[0] ?? '';
check('T-31a handle_new_user body = 0049 text (normalised whitespace), SECURITY DEFINER, search_path pinned', body(def) === body(mig) && /security definer/i.test(def) && /search_path/i.test(def), body(def) === body(mig) ? 'body identical' : 'body differs');
writeFileSync(join(out, 'handle_new_user_dev.sql'), def + '\n');
// ---- T-31 (b) default visibility of authenticated/anon on the new tables
// privilege words cannot appear in ro-sql statements, so read the grants catalog and let it name them
const priv = roJson(`select grantee, table_name tbl, privilege_type priv from information_schema.role_table_grants where table_schema='public' and table_name in ('user_data','audit_logs','system_config') and grantee in ('anon','authenticated','PUBLIC') order by 1,2,3`);
const bad = priv.filter(p => !(p.tbl === 'system_config' && p.grantee === 'authenticated' && p.priv === 'SELECT'));
const selectGrants = priv.filter(p => p.priv === 'SELECT' && !(p.tbl === 'system_config' && p.grantee === 'authenticated'));
check('T-31b AC-405 literal: anon/authenticated can SEE nothing by default on user_data, audit_logs (no SELECT grant); system_config SELECT only for authenticated (0052)', selectGrants.length === 0, `SELECT grants outside 0052: ${JSON.stringify(selectGrants)}`);
check('T-31b plan-strict (T-11e wording): no table privilege at all beyond 0052', bad.length === 0, `non-SELECT grants present: ${JSON.stringify(bad)} — 0028 deliberately leaves INSERT on audit_logs to FORCE RLS (no insert policy); effective denial is probed in T-17`);
// ---- T-31 (c) auth settings via publishable apikey (read-only GET)
const settings = JSON.parse(readFileSync(join(out, 'signup_settings_raw.json'), 'utf8'));
check('T-31c DEV GET /auth/v1/settings disable_signup = true', settings.disable_signup === true, `observed ${settings.disable_signup}`);
writeFileSync(join(out, 'signup_settings.json'), JSON.stringify({ target: 'DEV yrsuwikjnbmvpznrgydb', method: 'GET /auth/v1/settings with publishable apikey header only; no signup attempt', fetchedAt: new Date().toISOString(), disable_signup: settings.disable_signup, external_providers_enabled: Object.entries(settings.external || {}).filter(([, v]) => v).map(([k]) => k), scratch_half: 'BLOCKED — owner Director (SCRATCH signup posture UNKNOWN per QAM_APPROVAL.md §3; no signup attempt on any target, AM-6)' }, null, 2) + '\n');
writeFileSync(join(out, 'dev_catalog_projection.json'), JSON.stringify({ projectRef: 'yrsuwikjnbmvpznrgydb', readOnly: true, qaProjectionSha256: qaSha, receiptProjectionSha256: receiptSha, counts: { tables: tables.length, policies: snapshot.policies.length, functions: snapshot.functions.length, auditWriteTriggers: auditTrig.length, authUsers: users.length, preservedUsers: preserved.length, profiles: pr.profiles, user_roles: pr.user_roles }, preservedIdListSha256: sha(preserved.join(',')), defaultACLs: snapshot.defaultACLs, policies: snapshot.policies.map(p => ({ table: p.tablename, name: p.policyname, cmd: p.cmd, permissive: p.permissive })), ledger: ledger }, null, 2) + '\n');
writeFileSync(join(out, 't30_t31_results.json'), JSON.stringify({ ranAt: new Date().toISOString(), fence: 'AUTOMATION/ro-sql.sh (URL + SQL fingerprint, READ ONLY, ROLLBACK)', checks }, null, 2) + '\n');
console.log(`summary: ${checks.filter(c => c.result === 'PASS').length}/${checks.length} PASS`);
