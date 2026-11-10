#!/usr/bin/env node
// QAM Q2 local QA server launcher (Claudy; T-32, AM-4). Modelled on EVIDENCE/apply/dev-manual-smoke/launch.mjs,
// not importing it. Builds/serves the QA tree in REAL (or mock, §3) mode against Dev v1 using ONLY the
// QA_DEV_* public keys from .env.qa.local. Port is fixed at 3138; :3137 is never touched. No SUPABASE_SECRET_KEY
// is placed in the environment. Never prints a value.
//   node launch-dev-real.mjs --tree <qa-tree> --mode real|mock build|serve [--record <file>]
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { loadQaEnv, assertTarget, DEV_REF } from './qa-env.mjs';
const a = process.argv.slice(2); const opt = n => { const i = a.indexOf(n); return i < 0 ? undefined : a[i + 1]; };
const tree = resolve(opt('--tree') || '.'); const mode = opt('--mode') || 'real'; const action = a.find(x => x === 'build' || x === 'serve'); const record = opt('--record');
if (!action || !['real', 'mock'].includes(mode)) { console.error('usage: --tree <dir> --mode real|mock build|serve [--record file]'); process.exit(2); }
const env = loadQaEnv(); assertTarget(env, 'dev');
const PORT = '3138';
const childEnv = { ...process.env, HOSTNAME: '127.0.0.1', PORT, NEXT_PUBLIC_APBM_DATA_MODE: mode, NEXT_PUBLIC_SUPABASE_URL: env.QA_DEV_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: env.QA_DEV_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${PORT}`, NEXT_TELEMETRY_DISABLED: '1' };
delete childEnv.SUPABASE_SECRET_KEY; for (const k of Object.keys(childEnv)) if (/^(QA_|RLS_REPLICA_|APBM_DEV_)/.test(k)) delete childEnv[k];
if (action === 'build') {
  const r = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { cwd: tree, stdio: 'inherit', env: childEnv });
  const buildId = r.status === 0 ? readFileSync(join(tree, '.next/BUILD_ID'), 'utf8').trim() : null;
  const rec = { status: r.status === 0 ? 'PASS' : 'FAIL', exit: r.status, projectRef: DEV_REF, mode, port: PORT, buildId, builtAt: new Date().toISOString(), tree, secretKeyInEnv: false, envKeysPassed: ['NEXT_PUBLIC_APBM_DATA_MODE', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SITE_URL'] };
  if (record) { mkdirSync(dirname(record), { recursive: true }); writeFileSync(record, JSON.stringify(rec, null, 2) + '\n'); }
  console.log(JSON.stringify(rec)); process.exit(r.status ?? 1);
}
// serve
if (record) { const rec = JSON.parse(readFileSync(record, 'utf8')); if (rec.mode !== mode || rec.buildId !== readFileSync(join(tree, '.next/BUILD_ID'), 'utf8').trim()) { console.error('build record does not match .next/BUILD_ID or mode'); process.exit(2); } }
cpSync(join(tree, '.next/static'), join(tree, '.next/standalone/.next/static'), { recursive: true });
if (existsSync(join(tree, 'public'))) cpSync(join(tree, 'public'), join(tree, '.next/standalone/public'), { recursive: true });
const child = spawn(process.execPath, ['.next/standalone/server.js'], { cwd: tree, stdio: 'inherit', env: childEnv });
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => child.kill(s));
child.on('exit', c => process.exit(c ?? 1));
