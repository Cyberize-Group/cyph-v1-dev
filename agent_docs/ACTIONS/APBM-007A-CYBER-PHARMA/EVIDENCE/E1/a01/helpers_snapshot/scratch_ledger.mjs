// Read-only: re-verify SCRATCH connection/identity (session pooler) and compare the full ledger with the 52 source files. One attempt.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'; import { createHash } from 'node:crypto';
import { loadApp, reqOB, sqlRef, DEV_REF, SCRATCH_REF, ROOT, W, scrub, say, count } from './lib.mjs';
const pg = reqOB('pg'); const e = loadApp('ob'); const u = new URL(e.APBM_SCRATCH_DB_URL); const ref = sqlRef(e.APBM_SCRATCH_DB_URL);
const out = { at: new Date().toISOString(), url: { refEqualsRecorded: ref === SCRATCH_REF, refDiffersFromDev: ref !== DEV_REF, hostKind: /pooler\.supabase\.com$/.test(u.hostname) ? 'pooler' : 'other', port: u.port, database: u.pathname } };
if (!out.url.refEqualsRecorded || !out.url.refDiffersFromDev) { say(out); throw new Error('STOP'); }
const dir = `${ROOT}/cyph-v1-dev/supabase/migrations`; const files = readdirSync(dir).filter(f => /^\d{4}_.*\.sql$/.test(f)).sort().map(f => ({ name: f, sha: createHash('sha256').update(readFileSync(`${dir}/${f}`)).digest('hex') }));
const c = new pg.Client({ connectionString: e.APBM_SCRATCH_DB_URL, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } }); const q = async s => { count('supabase_read', 1, 'sql scratch'); return (await c.query(s)).rows; };
try { await c.connect(); await c.query('BEGIN READ ONLY'); await c.query("SET LOCAL statement_timeout='20s'"); out.readOnly = (await q('SHOW transaction_read_only'))[0].transaction_read_only;
  out.systemIdentifier = (await q('select system_identifier::text s from pg_control_system()'))[0].s; out.sameClusterAsEarlierScratchCheck = out.systemIdentifier === '7606130613603586966'; out.differsFromDevCluster = out.systemIdentifier !== '7634664568297872568';
  const led = await q('select name, sha256, applied_at from apbm_migrations.ledger order by name'); const norm = n => n.replace(/\.sql$/, ''); const lm = new Map(led.map(r => [norm(r.name), r]));
  const ap = led.map(r => new Date(r.applied_at).toISOString()).sort();
  out.ledger = { rows: led.length, sourceFiles: files.length, distinctNames: lm.size, first: led[0]?.name, last: led.at(-1)?.name, appliedRange: [ap[0], ap.at(-1)],
    namesAndChecksumsEqual: files.filter(f => lm.get(norm(f.name))?.sha256 === f.sha).length,
    missingFromLedger: files.filter(f => !lm.has(norm(f.name))).map(f => f.name), extraInLedger: led.filter(r => !files.some(f => norm(f.name) === norm(r.name))).map(r => r.name), checksumMismatch: files.filter(f => lm.has(norm(f.name)) && lm.get(norm(f.name)).sha256 !== f.sha).map(f => f.name) };
  out.sourceSetDigest = createHash('sha256').update(files.map(f => f.name + ' ' + f.sha).join('\n')).digest('hex');
  await c.query('ROLLBACK'); } catch (x) { out.error = { code: x.code, msg: String(x.message).slice(0, 120) }; } finally { await c.end().catch(() => {}); }
say(out); writeFileSync(`${W}/out/scratch_ledger_result.json`, scrub(out));
