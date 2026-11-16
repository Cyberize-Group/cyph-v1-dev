// Read-only logical export of DEV's public tables and migration ledger to a PRIVATE file outside every repository
// (0600, in a 0700 folder). A safety copy for the 0053–0060 apply; NOT a pg_dump and not restore-rehearsed.
// The evidence receipt holds only the path, size, row counts and SHA-256 — never row content.
import pg from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/node_modules/pg/lib/index.js';
import { loadEnv, evidencePath, DEV_REF } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/scripts/rls-harness/lib/env.mjs';
import { writeFileSync, mkdirSync, chmodSync, statSync } from 'node:fs'; import { createHash } from 'node:crypto'; import { gzipSync } from 'node:zlib';
const env = loadEnv(); if (env.target !== 'dev' || env.projectRef !== DEV_REF) throw new Error('DEV only');
const dir = '/home/moose/.config/cyph/backups'; mkdirSync(dir, { recursive: true, mode: 0o700 }); chmodSync(dir, 0o700);
const c = new pg.Client({ connectionString: env.DB_URL, connectionTimeoutMillis: 10000 }); await c.connect();
const out = { projectRef: env.projectRef, takenAt: new Date().toISOString(), kind: 'logical-json-export', tables: {} }; const receipt = { projectRef: env.projectRef, takenAt: out.takenAt, kind: out.kind, tables: {} };
try { await c.query('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
  const tables = (await c.query("select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' order by 1")).rows.map(r => r.relname);
  for (const t of tables) { const rows = (await c.query(`select to_jsonb(x) j from public.${t} x order by 1`)).rows.map(r => r.j); out.tables['public.' + t] = rows; receipt.tables['public.' + t] = rows.length; }
  const led = (await c.query('select name, sha256, applied_at from apbm_migrations.ledger order by name')).rows; out.tables['apbm_migrations.ledger'] = led; receipt.tables['apbm_migrations.ledger'] = led.length;
  out.authUserIds = (await c.query('select id from auth.users order by 1')).rows.map(r => r.id); receipt.authUserIds = out.authUserIds.length;
  await c.query('ROLLBACK');
} finally { await c.end(); }
const body = gzipSync(Buffer.from(JSON.stringify(out))); const file = `${dir}/apbm007a-dev-pre-0053-${out.takenAt.replace(/[:.]/g, '').slice(0, 15)}Z.json.gz`;
writeFileSync(file, body, { mode: 0o600, flag: 'wx' });
Object.assign(receipt, { file, bytes: statSync(file).size, mode: (statSync(file).mode & 0o777).toString(8), sha256: createHash('sha256').update(body).digest('hex'), note: 'Private; never copied into a repository or a package. Not a pg_dump; restore not rehearsed.' });
writeFileSync(evidencePath('dev-logical-export-receipt.json'), JSON.stringify(receipt, null, 2) + '\n'); console.log(JSON.stringify({ file, bytes: receipt.bytes, mode: receipt.mode, tables: Object.keys(receipt.tables).length, rows: Object.values(receipt.tables).reduce((a, b) => a + b, 0) }));
