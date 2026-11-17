#!/usr/bin/env node
// APBM-007B — isolated migration rehearsal on the LOCAL disposable Supabase database only. cwd: OwedBook repository root.
//
//   node scripts/apbm007b/migrate-rehearsal.mjs --help
//   node scripts/apbm007b/migrate-rehearsal.mjs fresh   --db <local url> [--through NNNN] [--fault-at <file>] [--seed]
//   node scripts/apbm007b/migrate-rehearsal.mjs forward --db <local url> [--through NNNN] [--fault-at <file>]
//   node scripts/apbm007b/migrate-rehearsal.mjs ledger  --db <local url>
//
// `fresh` drops and rebuilds the LOCAL public schema with the same reset/bootstrap DDL as scripts/apply-forward.mjs
// scratch-reset, then applies the chain in per-file transactions with a ledger row (same rules: no transaction
// boundary inside a file, ordered unchanged prefix). `forward` resumes from the ledger. `--fault-at` makes that one
// file fail after its SQL ran, proving it rolls back with no ledger row. `--seed` loads synthetic two-account fixtures
// after 0060 (for upgrade-shaped rehearsal on the local copy). The target must be 127.0.0.1/localhost; SCRATCH, DEV
// and every remote host are refused. Receipts: printed JSON (no credentials exist for the local database).
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i < 0 ? undefined : args[i + 1]; };
if (!args.length || args.includes('--help')) { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const command = args[0];
if (!['fresh', 'forward', 'ledger'].includes(command)) { console.error('FAIL-CLOSED: command must be fresh, forward or ledger'); process.exit(2); }
const db = arg('--db');
let host; try { host = new URL(db).hostname; } catch { host = null; }
if (!db || !['127.0.0.1', 'localhost'].includes(host)) { console.error('FAIL-CLOSED: --db must be the local rehearsal database (127.0.0.1/localhost)'); process.exit(2); }

const sha256 = (b) => createHash('sha256').update(b).digest('hex');
const directory = join(repoRoot, 'supabase/migrations');
const files = readdirSync(directory).filter((n) => /^\d{4}_.+\.sql$/.test(n)).sort().map((name, i) => {
  if (Number(name.slice(0, 4)) !== i + 1) throw new Error('migration inventory is not contiguous');
  return { name, sha256: sha256(readFileSync(join(directory, name))) };
});
const through = Number(arg('--through') || files.length);
const faultAt = arg('--fault-at');

const client = new pg.Client({ connectionString: db });
const receipt = { command, target: 'local-rehearsal', startedAt: new Date().toISOString(), committed: [], status: 'RUNNING' };
let current = null;
try {
  await client.connect();
  await client.query("set statement_timeout = '120s'");
  if (command === 'fresh') {
    await client.query('BEGIN');
    await client.query('DROP EVENT TRIGGER IF EXISTS ensure_rls; DROP SCHEMA IF EXISTS apbm_migrations CASCADE; DROP SCHEMA IF EXISTS handoff CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    await client.query('GRANT USAGE ON SCHEMA public TO postgres,anon,authenticated,service_role; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres,anon,authenticated,service_role; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres,anon,authenticated,service_role; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres,anon,authenticated,service_role;');
    await client.query(readFileSync(join(repoRoot, 'scripts/db-bootstrap-baseline.sql'), 'utf8'));
    await client.query('CREATE SCHEMA apbm_migrations; REVOKE ALL ON SCHEMA apbm_migrations FROM public,anon,authenticated,service_role; CREATE TABLE apbm_migrations.ledger(name text PRIMARY KEY,sha256 text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now());');
    await client.query('COMMIT');
  }
  const applied = (await client.query('select name, sha256 from apbm_migrations.ledger order by name')).rows;
  if (applied.some((f, i) => f.name !== files[i]?.name || f.sha256 !== files[i]?.sha256)) throw new Error('ledger is not an unchanged ordered prefix');
  if (command !== 'ledger') {
    for (const f of files.slice(applied.length, through)) {
      current = f.name;
      const sql = readFileSync(join(directory, f.name), 'utf8');
      if (/^\s*(COMMIT|ROLLBACK|START\s+TRANSACTION)\s*;/im.test(sql)) throw new Error('migration contains transaction boundary');
      await client.query('BEGIN');
      await client.query(sql);
      if (f.name === faultAt) await client.query('select 1/0');
      await client.query('insert into apbm_migrations.ledger(name, sha256) values ($1, $2)', [f.name, f.sha256]);
      await client.query('COMMIT');
      receipt.committed.push(f.name);
      if (args.includes('--seed') && f.name.startsWith('0060_')) { await client.query(readFileSync(join(repoRoot, 'scripts/apbm007b/rehearsal-seed.sql'), 'utf8')); receipt.seeded = true; }
    }
  }
  receipt.status = 'PASS';
} catch (e) {
  await client.query('ROLLBACK').catch(() => {});
  receipt.status = current === faultAt && /division by zero/.test(e.message) ? 'FAULT_INJECTED_ROLLED_BACK' : 'STOP_PARTIAL_FAILURE';
  receipt.failedMigration = current; receipt.errorCode = e.code ?? null; receipt.message = String(e.message).slice(0, 400);
} finally {
  try { receipt.ledger = (await client.query('select count(*)::int n, max(name) last from apbm_migrations.ledger')).rows[0]; } catch { /* absent */ }
  receipt.finishedAt = new Date().toISOString();
  await client.end().catch(() => {});
  console.log(JSON.stringify(receipt, null, 1));
  if (!['PASS', 'FAULT_INJECTED_ROLLED_BACK'].includes(receipt.status)) process.exitCode = 1;
}
