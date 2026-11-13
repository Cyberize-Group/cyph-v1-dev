// Read-only SCRATCH identity check. One connection attempt per database. Prints no credential, URL or host.
import { writeFileSync } from 'node:fs'; import { loadApp, reqOB, sqlRef, apiRef, keyClass, DEV_REF, SCRATCH_REF, W, scrub, say, count } from './lib.mjs';
const pg = reqOB('pg'); const e = loadApp('ob'); const out = { at: new Date().toISOString(), recordedScratchRef: SCRATCH_REF, devRef: DEV_REF };
const NEED = ['APBM_SCRATCH_DB_URL', 'APBM_SCRATCH_SUPABASE_URL', 'APBM_SCRATCH_PUBLISHABLE_KEY', 'APBM_SCRATCH_SECRET_KEY'];
out.present = Object.fromEntries(NEED.map(n => [n, !!e[n]])); out.missing = NEED.filter(n => !e[n]);
const u = new URL(e.APBM_SCRATCH_DB_URL); const ref = sqlRef(e.APBM_SCRATCH_DB_URL);
out.url = { refEqualsRecorded: ref === SCRATCH_REF, refDiffersFromDev: ref !== DEV_REF, hostKind: /pooler\.supabase\.com$/.test(u.hostname) ? 'pooler' : /^db\./.test(u.hostname) ? 'direct' : 'other', port: u.port, database: u.pathname, sameStringAsDevUrl: e.APBM_SCRATCH_DB_URL === e.APBM_DEV_DB_URL };
if (e.APBM_SCRATCH_SUPABASE_URL) out.apiUrlRefEqualsRecorded = apiRef(e.APBM_SCRATCH_SUPABASE_URL) === SCRATCH_REF;
if (e.APBM_SCRATCH_PUBLISHABLE_KEY) out.publishableKeyClass = keyClass(e.APBM_SCRATCH_PUBLISHABLE_KEY).replace(/ref=(\w+)/, (m, r) => 'ref ' + (r === SCRATCH_REF ? 'equals SCRATCH' : 'MISMATCH'));
if (e.APBM_SCRATCH_SECRET_KEY) out.secretKeyClass = keyClass(e.APBM_SCRATCH_SECRET_KEY).replace(/ref=(\w+)/, (m, r) => 'ref ' + (r === SCRATCH_REF ? 'equals SCRATCH' : 'MISMATCH'));
if (!out.url.refEqualsRecorded || !out.url.refDiffersFromDev) { say(out); throw new Error('STOP: SCRATCH URL reference check failed; not connecting'); }
async function probe(url, label) { const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } }); const r = {};
  const q = async s => { count('supabase_read', 1, 'sql ' + label); return (await c.query(s)).rows; };
  try { await c.connect(); await c.query('BEGIN READ ONLY'); await c.query("SET LOCAL statement_timeout='20s'"); r.readOnly = (await q('SHOW transaction_read_only'))[0].transaction_read_only;
    r.systemIdentifier = await q('select system_identifier::text s from pg_control_system()').then(x => x[0].s, () => 'unavailable');
    r.version = (await q('show server_version'))[0].server_version; r.db = (await q('select current_database() d, current_user u'))[0];
    r.authUsers = await q('select count(*)::int n from auth.users').then(x => x[0].n, x => 'err ' + x.code); await c.query('ROLLBACK').catch(() => {}); await c.query('BEGIN READ ONLY');
    r.publicTables = (await q("select count(*)::int n from information_schema.tables where table_schema='public' and table_type='BASE TABLE'"))[0].n;
    r.ledger = await q("select count(*)::int n, max(name) last from apbm_migrations.ledger").then(x => x[0], x => 'none (' + x.code + ')'); await c.query('ROLLBACK').catch(() => {}); await c.query('BEGIN READ ONLY');
    r.apbm003Cast = await q("select count(*)::int n from auth.users where email like 'apbm003-%@example.invalid'").then(x => x[0].n, x => 'err ' + x.code); await c.query('ROLLBACK').catch(() => {}); await c.query('BEGIN READ ONLY');
    r.e1Identities = await q("select count(*)::int n from auth.users where created_at >= '2026-11-12T00:00:00Z' or created_at >= '2026-11-11T00:00:00Z'").then(x => x[0].n, x => 'err ' + x.code);
    await c.query('ROLLBACK').catch(() => {});
  } catch (x) { r.error = { code: x.code, msg: String(x.message).slice(0, 120) }; } finally { await c.end().catch(() => {}); } return r; }
out.scratch = await probe(e.APBM_SCRATCH_DB_URL, 'scratch'); if (!out.scratch.error) out.dev = await probe(e.APBM_DEV_DB_URL, 'dev');
if (out.dev) out.distinct = { systemIdentifierDiffers: out.scratch.systemIdentifier !== out.dev.systemIdentifier && out.scratch.systemIdentifier !== 'unavailable' };
say(out); writeFileSync(`${W}/out/scratch_identity_result.json`, scrub(out));
