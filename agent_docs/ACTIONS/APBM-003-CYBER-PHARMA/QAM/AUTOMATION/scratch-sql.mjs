#!/usr/bin/env node
// QAM Q2: run SQL on SCRATCH under qa-shim (reads QAH_DB_URL supplied by the shim; refuses to run otherwise).
// Usage (inside shim): node scratch-sql.mjs [--json] [--commit] < statements.sql
// Without --commit everything runs in one transaction that is ROLLED BACK (read-only probes); with --commit the
// transaction commits (destructive steps the plan authorizes on SCRATCH only). Prints result rows as JSON lines.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
if (process.env.APBM_TARGET !== 'scratch' || process.env.APBM_PROJECT_REF !== 'ihgcsrypblqkwommrkgj' || !process.env.QAH_DB_URL) { console.error('scratch-sql: must run under qa-shim (scratch)'); process.exit(2); }
const require = createRequire(join(process.cwd(), 'package.json')); const pg = require('pg');
const sql = readFileSync(0, 'utf8'); const commit = process.argv.includes('--commit');
const c = new pg.Client({ connectionString: process.env.QAH_DB_URL, connectionTimeoutMillis: 10000 });
await c.connect(); const out = [];
try { await c.query('BEGIN'); await c.query("SET LOCAL statement_timeout='60s'");
  const stmts = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
  const cont = process.argv.includes('--continue-on-error');
  for (const s of stmts) { if (cont) await c.query('SAVEPOINT qa'); try { const r = await c.query(s); out.push({ sql: s.slice(0, 120), rowCount: r.rowCount, rows: r.rows }); if (cont) await c.query('RELEASE SAVEPOINT qa'); } catch (e) { out.push({ sql: s.slice(0, 120), error: { code: e.code, message: String(e.message).replace(/postgres(ql)?:\/\/\S+/g, '<redacted>') } }); if (!cont) throw e; await c.query('ROLLBACK TO SAVEPOINT qa'); } }
  await c.query(commit ? 'COMMIT' : 'ROLLBACK'); out.push({ transaction: commit ? 'COMMIT' : 'ROLLBACK' });
} catch (e) { await c.query('ROLLBACK').catch(() => {}); out.push({ transaction: 'ROLLBACK (error)', error: { code: e.code, message: String(e.message).replace(/postgres(ql)?:\/\/\S+/g, '<redacted>') } }); process.exitCode = 1; }
finally { await c.end(); console.log(JSON.stringify(out, null, 2)); }
