#!/usr/bin/env node
// QAM Q2 SCRATCH env shim (Claudy; plan §2 legend, AM-5). Maps QA_SCRATCH_* from .env.qa.local onto the
// product harness's complete-prefix contract (RLS_HARNESS_PREFIX=QAH_, QAH_DB_URL/SUPABASE_URL/
// PUBLISHABLE_KEY/SECRET_KEY, APBM_TARGET, APBM_PROJECT_REF, APBM_ALLOW_DESTRUCTIVE, APBM_EVIDENCE_DIR)
// and spawns ONE command inside the QA tree. Before any destructive step it asserts, URL-side AND
// SQL-side, that the connection is SCRATCH (ref ihgcsrypblqkwommrkgj) and NOT DEV (DEV cast
// fingerprint absent). Never prints a value.
//   node qa-shim.mjs --tree <qa-tree> --evidence <lane e.g. schema/01> [--credential-file <path>] [--attack-wrong-ref] -- <cmd> [args...]
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { existsSync, realpathSync, mkdirSync } from 'node:fs';
import { loadQaEnv, assertTarget, SCRATCH_REF, DEV_REF, DEV_CAST_UIDS, redact, sqlRef, apiRef } from './qa-env.mjs';
const argv = process.argv.slice(2); const sep = argv.indexOf('--'); const opts = argv.slice(0, sep < 0 ? argv.length : sep); const cmd = sep < 0 ? [] : argv.slice(sep + 1);
const opt = n => { const i = opts.indexOf(n); return i < 0 ? undefined : opts[i + 1]; };
const tree = resolve(opt('--tree') || '.'); const lane = opt('--evidence'); const credFile = opt('--credential-file'); const attack = opts.includes('--attack-wrong-ref');
if (!lane || !cmd.length) { console.error('usage: qa-shim --tree <dir> --evidence <lane> [--credential-file f] [--attack-wrong-ref] -- cmd...'); process.exit(2); }
if (realpathSync(tree) !== tree || !existsSync(join(tree, 'package.json'))) { console.error('STOP-ENV tree must be a real directory holding package.json'); process.exit(2); }
const env = loadQaEnv();
let DB_URL = env.QA_SCRATCH_DB_URL, SUPABASE_URL = env.QA_SCRATCH_SUPABASE_URL;
if (attack) { // swap the ref inside the SCRATCH URLs for the DEV ref: the fence must refuse without connecting anywhere
  DB_URL = DB_URL.split(SCRATCH_REF).join(DEV_REF); SUPABASE_URL = SUPABASE_URL.split(SCRATCH_REF).join(DEV_REF);
}
try {
  const probe = { ...env, QA_SCRATCH_DB_URL: DB_URL, QA_SCRATCH_SUPABASE_URL: SUPABASE_URL };
  assertTarget(probe, 'scratch');
  if (sqlRef(DB_URL) === DEV_REF || apiRef(SUPABASE_URL) === DEV_REF) throw new Error('STOP-IDENTITY shared DEV cannot be SCRATCH');
} catch (e) { console.error(`qa-shim: ${redact(e.message)} — refused; nothing spawned`); process.exit(3); }
// SQL-side: connect once, confirm the DEV cast fingerprint is ABSENT and the server is reachable
const require = createRequire(join(tree, 'package.json'));
const pg = require('pg');
const client = new pg.Client({ connectionString: DB_URL, connectionTimeoutMillis: 10000 });
try {
  await client.connect();
  const r = await client.query('select count(*)::int n from auth.users where id = any($1::uuid[])', [DEV_CAST_UIDS]);
  if (r.rows[0].n !== 0) { console.error('qa-shim: STOP-IDENTITY SQL-side fence: DEV cast fingerprint PRESENT on the target — refusing destructive step'); process.exit(3); }
  console.log(`qa-shim: SCRATCH fence OK (url-side ref=${SCRATCH_REF}; sql-side DEV fingerprint absent)`);
} catch (e) { if (e?.code === 'ERR_UNHANDLED' ) throw e; console.error(`qa-shim: fence connection failed: ${redact(e.message || e.code)}`); process.exit(3); } finally { await client.end().catch(() => {}); }
const evidenceDir = join(tree, 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence', lane); mkdirSync(evidenceDir, { recursive: true });
const childEnv = { ...process.env, RLS_HARNESS_PREFIX: 'QAH_', QAH_DB_URL: DB_URL, QAH_SUPABASE_URL: SUPABASE_URL, QAH_PUBLISHABLE_KEY: env.QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY, QAH_SECRET_KEY: env.QA_SCRATCH_SECRET_KEY, APBM_TARGET: 'scratch', APBM_PROJECT_REF: SCRATCH_REF, APBM_ALLOW_DESTRUCTIVE: SCRATCH_REF, APBM_EVIDENCE_DIR: evidenceDir, NEXT_TELEMETRY_DISABLED: '1' };
if (credFile) childEnv.APBM_CREDENTIAL_FILE = credFile;
for (const k of ['QA_SCRATCH_DB_URL', 'QA_SCRATCH_SECRET_KEY', 'QA_DEV_DB_URL']) delete childEnv[k];
console.log(`qa-shim: spawning in ${tree}: ${cmd.join(' ')} (evidence → ${evidenceDir.split('/agent_docs/')[1]})`);
const r = spawnSync(cmd[0], cmd.slice(1), { cwd: tree, stdio: 'inherit', env: childEnv });
process.exit(r.status ?? 1);
