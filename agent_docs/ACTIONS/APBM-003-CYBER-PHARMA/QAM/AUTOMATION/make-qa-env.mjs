#!/usr/bin/env node
/**
 * make-qa-env.mjs — Director-run generator for `.env.qa.local` (APBM-003-CYBER-PHARMA, QAM lane).
 *
 * Reads existing authorised sources and writes the declared QA_* key names.
 * Sources (by key name only):
 *   .env.local       RLS_REPLICA_*  → QA_SCRATCH_*      APBM_DEV_* → QA_DEV_*
 *   cast JSON (0600) identities.<HANDLE>.{email,password} → QA_<HANDLE>_EMAIL / QA_<HANDLE>_PASSWORD
 *
 * Guarantees:
 *   - Every input is validated first; on any failure the process exits non-zero with a list of
 *     CODE KEY_NAME lines and NO file is touched (an existing output stays byte-identical).
 *   - Refuses unless the SCRATCH ref resolves to ihgcsrypblqkwommrkgj and the DEV ref to
 *     yrsuwikjnbmvpznrgydb. Refs are derived from the URL host (`<ref>.supabase.co`,
 *     `db.<ref>.supabase.co`) or, for pooler hosts (`*.pooler.supabase.com`), from the user name
 *     `postgres.<ref>`. Only the ref is ever printed.
 *   - Refuses to overwrite an existing output without --force. --force skips ONLY the exists check.
 *   - Writes to a temp file next to the output with mode 0600, fsyncs, then renames atomically.
 *   - stdout/stderr carry key names, source key names, refs, paths and codes. Never a value.
 *
 * Usage (Director only):
 *   node agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/make-qa-env.mjs \
 *        --cast /tmp/apbm003-dev-v2-cast-<stamp>.json [--env-local .env.local] [--out .env.qa.local] \
 *        [--dev-db-source APBM_DEV_DB_URL|APBM_DEV_DB_CONNECTION_STR|APBM_DEV_DB_POOL] [--force]
 *   node .../make-qa-env.mjs --self-test        (synthetic fixtures only; touches nothing real)
 *
 * The QA Executor never runs the non-self-test mode (PF-3.6 / AM-7). This file is QA-lane only.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
const DEV_REF = 'yrsuwikjnbmvpznrgydb';
const HANDLES = ['OWNER1', 'OWNER3', 'ADMIN_B2', 'ADMIN_B3', 'MEMBER_B1', 'MEMBER_B2B3', 'UNRELATED'];
const DEV_DB_SOURCES = ['APBM_DEV_DB_URL', 'APBM_DEV_DB_CONNECTION_STR', 'APBM_DEV_DB_POOL'];

/** target key → { src, ref: expected ref or null } ; QA_DEV_DB_URL's src is chosen by --dev-db-source */
function mapping(devDbSource) {
  return [
    { key: 'QA_SCRATCH_SUPABASE_URL', src: 'RLS_REPLICA_SUPABASE_URL', ref: SCRATCH_REF },
    { key: 'QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY', src: 'RLS_REPLICA_PUBLISHABLE_KEY', ref: null },
    { key: 'QA_SCRATCH_SECRET_KEY', src: 'RLS_REPLICA_SECRET_KEY', ref: null },
    { key: 'QA_SCRATCH_DB_URL', src: 'RLS_REPLICA_DB_URL', ref: SCRATCH_REF },
    { key: 'QA_DEV_SUPABASE_URL', src: 'APBM_DEV_SUPABASE_URL', ref: DEV_REF },
    { key: 'QA_DEV_SUPABASE_PUBLISHABLE_KEY', src: 'APBM_DEV_PUBLISHABLE_KEY', ref: null },
    { key: 'QA_DEV_DB_URL', src: devDbSource, ref: DEV_REF },
  ];
}

function parseArgs(argv) {
  const a = { force: false, selfTest: false, envLocal: null, cast: null, out: null, devDbSource: 'APBM_DEV_DB_URL' };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--force') a.force = true;
    else if (t === '--self-test') a.selfTest = true;
    else if (t === '--env-local') a.envLocal = argv[++i];
    else if (t === '--cast') a.cast = argv[++i];
    else if (t === '--out') a.out = argv[++i];
    else if (t === '--dev-db-source') a.devDbSource = argv[++i];
    else { console.error(`USAGE_ERROR unknown argument ${t}`); process.exit(2); }
  }
  return a;
}

/** Parse a dotenv-style file into Map<key, string[]> (all occurrences kept, in order). Values stay in memory only. */
function parseEnv(text) {
  const m = new Map();
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!m.has(key)) m.set(key, []);
    m.get(key).push(val);
  }
  return m;
}

/** Derive a Supabase project ref from a URL; returns null when it cannot. Never throws with content. */
function refOf(value) {
  let u;
  try { u = new URL(value); } catch { return null; }
  const host = u.hostname.toLowerCase();
  let m = host.match(/^(?:db\.)?([a-z0-9]{20})\.supabase\.co$/);
  if (m) return m[1];
  if (/\.pooler\.supabase\.com$/.test(host)) {
    const user = decodeURIComponent(u.username || '');
    m = user.match(/^postgres\.([a-z0-9]{20})$/);
    if (m) return m[1];
  }
  return null;
}

function quote(v) {
  // single-quote for the shell/dotenv; escape embedded single quotes
  return `'${String(v).replace(/'/g, `'\\''`)}'`;
}

/** Validate everything; returns { failures: string[], output: Map<key,value>, refs } */
function build(opts) {
  const failures = [];
  const out = new Map();
  const srcByKey = new Map();
  const refs = {};
  if (!DEV_DB_SOURCES.includes(opts.devDbSource)) failures.push(`BAD_DEV_DB_SOURCE ${opts.devDbSource}`);
  const map = mapping(opts.devDbSource);

  // .env.local
  let env = null;
  try { env = parseEnv(fs.readFileSync(opts.envLocal, 'utf8')); }
  catch { failures.push(`SOURCE_UNREADABLE env-local ${opts.envLocal}`); }
  if (env) {
    for (const { key, src, ref } of map) {
      const vals = env.get(src);
      if (!vals) { failures.push(`MISSING_KEY ${src}`); continue; }
      const nonEmpty = vals.filter((v) => v.length > 0);
      if (nonEmpty.length === 0) { failures.push(`EMPTY_KEY ${src}`); continue; }
      if (new Set(nonEmpty).size > 1) { failures.push(`DUPLICATE_CONFLICT ${src}`); continue; }
      const v = nonEmpty[0];
      if (ref) {
        const got = refOf(v);
        if (!got) { failures.push(`REF_UNRESOLVED ${src}`); continue; }
        if (got !== ref) { failures.push(`REF_MISMATCH ${src} expected=${ref} got=${got}`); continue; }
        refs[src] = got;
      }
      out.set(key, v); srcByKey.set(key, src);
    }
  }

  // cast file
  let cast = null;
  try { cast = JSON.parse(fs.readFileSync(opts.cast, 'utf8')); }
  catch { failures.push(`SOURCE_UNREADABLE_OR_UNPARSABLE cast ${opts.cast}`); }
  if (cast && typeof cast === 'object') {
    if (typeof cast.projectRef !== 'string' || cast.projectRef !== DEV_REF) {
      failures.push(`CAST_REF_MISMATCH projectRef expected=${DEV_REF} got=${typeof cast.projectRef === 'string' && /^[a-z0-9]{20}$/.test(cast.projectRef) ? cast.projectRef : '<unparsable>'}`);
    }
    const ids = cast.identities && typeof cast.identities === 'object' ? cast.identities : {};
    for (const h of HANDLES) {
      const id = ids[h];
      if (!id || typeof id !== 'object') { failures.push(`CAST_MISSING_HANDLE ${h}`); continue; }
      for (const f of ['email', 'password']) {
        if (typeof id[f] !== 'string' || id[f].length === 0) failures.push(`CAST_EMPTY_FIELD ${h}.${f}`);
        else { out.set(`QA_${h}_${f.toUpperCase()}`, id[f]); srcByKey.set(`QA_${h}_${f.toUpperCase()}`, `identities.${h}.${f}`); }
      }
    }
    const extra = Object.keys(ids).filter((h) => !HANDLES.includes(h));
    if (extra.length) failures.push(`CAST_UNEXPECTED_HANDLE ${extra.join(',')}`);
  } else if (cast !== null) failures.push('CAST_NOT_AN_OBJECT');

  return { failures, out, srcByKey, refs };
}

function render(out, srcByKey, opts) {
  const lines = [
    '# .env.qa.local — generated by QAM/AUTOMATION/make-qa-env.mjs (APBM-003-CYBER-PHARMA)',
    `# generated_at=${new Date().toISOString()} sources: env-local=${path.basename(opts.envLocal)} cast=${path.basename(opts.cast)}`,
    `# SCRATCH ref ${SCRATCH_REF} (destructive QA) · DEV ref ${DEV_REF} (QA_DEV_DB_URL: READ-ONLY USE DECLARED, ro-sql.sh fence)`,
    '# ignored by .gitignore (.env*.local); never commit; values never copied into evidence.',
  ];
  for (const [k, v] of out) lines.push(`${k}=${quote(v)}  # <- ${srcByKey.get(k)}`);
  return lines.join('\n') + '\n';
}

function atomicWrite0600(outPath, content) {
  const dir = path.dirname(path.resolve(outPath));
  const tmp = path.join(dir, `.env.qa.local.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`);
  let fd = null;
  try {
    fd = fs.openSync(tmp, 'wx', 0o600);
    fs.writeSync(fd, content);
    fs.fsyncSync(fd);
    fs.closeSync(fd); fd = null;
    fs.chmodSync(tmp, 0o600);
    fs.renameSync(tmp, outPath);
  } catch (e) {
    try { if (fd !== null) fs.closeSync(fd); } catch {}
    try { fs.unlinkSync(tmp); } catch {}
    throw new Error('WRITE_FAILED');
  }
}

function generate(opts) {
  const repoRoot = findRepoRoot();
  opts.envLocal = path.resolve(opts.envLocal || path.join(repoRoot, '.env.local'));
  opts.out = path.resolve(opts.out || path.join(repoRoot, '.env.qa.local'));
  if (!opts.cast) { console.error('USAGE_ERROR --cast <path> is required'); return 2; }
  opts.cast = path.resolve(opts.cast);

  const { failures, out, srcByKey, refs } = build(opts);
  if (fs.existsSync(opts.out) && !opts.force) failures.push(`EXISTS ${opts.out} (use --force to overwrite)`);
  if (failures.length) {
    console.error('REFUSED — nothing written. Failing items:');
    for (const f of failures) console.error(`  ${f}`);
    return 1;
  }
  atomicWrite0600(opts.out, render(out, srcByKey, opts));
  console.log(`WROTE ${opts.out} mode=0600 keys=${out.size}`);
  console.log(`SCRATCH ref ${refs.RLS_REPLICA_SUPABASE_URL} · DEV ref ${refs.APBM_DEV_SUPABASE_URL}`);
  for (const [k] of out) console.log(`  ${k} <- ${srcByKey.get(k)}`);
  return 0;
}

function findRepoRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  // AUTOMATION/ → QAM/ → APBM-003-CYBER-PHARMA/ → ACTIONS/ → agent_docs/ → repo root
  return path.resolve(here, '..', '..', '..', '..', '..');
}

/* ---------------------------------------------------------------- self-test (synthetic fixtures only) */
function selfTest() {
  const self = fileURLToPath(import.meta.url);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-env-selftest-'));
  const results = [];
  const SYN = []; // every synthetic secret value we plant; none may appear in any process output
  const syn = (tag) => { const v = `SYNTHETIC_${tag}_${crypto.randomBytes(8).toString('hex')}`; SYN.push(v); return v; };
  const pw = (h) => syn(`PW_${h}`);

  const goodEnv = (over = {}) => {
    const base = {
      RLS_REPLICA_SUPABASE_URL: `https://${SCRATCH_REF}.supabase.co`,
      RLS_REPLICA_PUBLISHABLE_KEY: syn('SCRATCH_PUB'),
      RLS_REPLICA_SECRET_KEY: syn('SCRATCH_SECRET'),
      RLS_REPLICA_DB_URL: ['postgresql:', '', 'postgres.' + SCRATCH_REF + ':' + syn('SCRATCH_DBPW') + '@aws-1-ap-south-1.pooler.supabase.com:6543', 'postgres'].join('/'),
      APBM_DEV_SUPABASE_URL: `https://${DEV_REF}.supabase.co`,
      APBM_DEV_PUBLISHABLE_KEY: syn('DEV_PUB'),
      APBM_DEV_DB_URL: ['postgresql:', '', 'postgres:' + syn('DEV_DBPW') + '@db.' + DEV_REF + '.supabase.co:5432', 'postgres'].join('/'),
      UNRELATED_KEY: syn('UNRELATED'),
    };
    const o = { ...base, ...over };
    return Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
  };
  const goodCast = (over = {}) => {
    const identities = {};
    for (const h of HANDLES) identities[h] = { id: crypto.randomUUID(), email: `${h.toLowerCase()}@synthetic.invalid`, password: pw(h) };
    return JSON.stringify({ projectRef: DEV_REF, identities, ...over }, null, 2);
  };
  const w = (name, content) => { const p = path.join(dir, name); fs.writeFileSync(p, content, { mode: 0o600 }); return p; };
  const run = (args) => {
    const r = spawnSync(process.execPath, [self, ...args], { encoding: 'utf8' });
    const all = (r.stdout || '') + (r.stderr || '');
    const leaked = SYN.filter((v) => all.includes(v));
    return { code: r.status, out: all, leaked };
  };
  const sha = (p) => fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') : null;
  const check = (name, cond, extra = '') => { results.push([cond ? 'PASS' : 'FAIL', name, extra]); };

  const env = w('env.good', goodEnv());
  const cast = w('cast.good.json', goodCast());

  // 1 happy path
  { const out = path.join(dir, 'out1.env'); const r = run(['--env-local', env, '--cast', cast, '--out', out]);
    const txt = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
    const mode = fs.existsSync(out) ? (fs.statSync(out).mode & 0o777) : null;
    const expectKeys = [...mapping('APBM_DEV_DB_URL').map((m) => m.key), ...HANDLES.flatMap((h) => [`QA_${h}_EMAIL`, `QA_${h}_PASSWORD`])];
    const allKeys = expectKeys.every((k) => new RegExp(`^${k}=`, 'm').test(txt));
    const valuesLanded = SYN.filter((v) => v.startsWith('SYNTHETIC_PW_') || v.startsWith('SYNTHETIC_SCRATCH_SECRET')).every((v) => txt.includes(v));
    check('1 happy path: exit 0', r.code === 0);
    check('1 happy path: all 21 declared keys present in file', allKeys, `keys=${expectKeys.length}`);
    check('1 happy path: values landed in file (not elsewhere)', valuesLanded);
    check('1 happy path: file mode 0600', mode === 0o600, `mode=${mode === null ? 'none' : mode.toString(8)}`);
    check('1 happy path: no secret in stdout/stderr', r.leaked.length === 0 && !txt.split('\n').some((l) => l && r.out.includes(l.split('=')[1] ?? '\u0000')));
    check('1 happy path: UNRELATED_KEY not copied', !txt.includes('UNRELATED_KEY'));
    check('1 happy path: pooler-form SCRATCH DB URL ref derived from user name', r.out.includes(`SCRATCH ref ${SCRATCH_REF}`));
  }
  // 2 missing key
  { const e2 = w('env.missing', goodEnv({ RLS_REPLICA_SECRET_KEY: undefined })); const out = path.join(dir, 'out2.env');
    const r = run(['--env-local', e2, '--cast', cast, '--out', out]);
    check('2 missing key: non-zero exit', r.code !== 0);
    check('2 missing key: names RLS_REPLICA_SECRET_KEY', r.out.includes('MISSING_KEY RLS_REPLICA_SECRET_KEY'));
    check('2 missing key: no file created', !fs.existsSync(out));
    check('2 missing key: no secret in output', r.leaked.length === 0);
  }
  // 3 wrong ref (DEV URL points at SCRATCH ref)
  { const e3 = w('env.wrongref', goodEnv({ APBM_DEV_SUPABASE_URL: `https://${SCRATCH_REF}.supabase.co` })); const out = path.join(dir, 'out3.env');
    const r = run(['--env-local', e3, '--cast', cast, '--out', out]);
    check('3 wrong ref: non-zero exit', r.code !== 0);
    check('3 wrong ref: REF_MISMATCH APBM_DEV_SUPABASE_URL reported', r.out.includes(`REF_MISMATCH APBM_DEV_SUPABASE_URL expected=${DEV_REF} got=${SCRATCH_REF}`));
    check('3 wrong ref: no file created', !fs.existsSync(out));
    check('3 wrong ref: no secret in output', r.leaked.length === 0);
  }
  // 4 existing file preserved on validation failure even with --force
  { const out = w('out4.env', `PRE_EXISTING_SENTINEL=${syn('SENTINEL')}\n`); const before = sha(out);
    const e4 = w('env.missing2', goodEnv({ APBM_DEV_PUBLISHABLE_KEY: '' }));
    const r = run(['--env-local', e4, '--cast', cast, '--out', out, '--force']);
    check('4 preserve on failure (--force, EMPTY_KEY): non-zero exit', r.code !== 0 && r.out.includes('EMPTY_KEY APBM_DEV_PUBLISHABLE_KEY'));
    check('4 preserve on failure: existing file byte-identical', sha(out) === before);
    check('4 preserve on failure: no secret in output', r.leaked.length === 0);
    // 5 exists without --force
    const r5 = run(['--env-local', env, '--cast', cast, '--out', out]);
    check('5 exists without --force: refused with EXISTS', r5.code !== 0 && r5.out.includes('EXISTS '));
    check('5 exists without --force: file byte-identical', sha(out) === before);
    // 6 --force overwrites, mode 0600
    const r6 = run(['--env-local', env, '--cast', cast, '--out', out, '--force']);
    check('6 --force: exit 0 and overwritten', r6.code === 0 && sha(out) !== before && fs.readFileSync(out, 'utf8').includes('QA_OWNER3_PASSWORD='));
    check('6 --force: mode 0600', (fs.statSync(out).mode & 0o777) === 0o600);
    check('6 --force: no secret in output', r6.leaked.length === 0);
  }
  // 7 duplicate conflicting key
  { const e7 = w('env.dup', goodEnv() + 'APBM_DEV_DB_URL=' + ['postgresql:', '', 'postgres.' + DEV_REF + ':' + syn('DEV_DBPW2') + '@aws-1-us-east-1.pooler.supabase.com:6543', 'postgres'].join('/') + '\n');
    const out = path.join(dir, 'out7.env'); const r = run(['--env-local', e7, '--cast', cast, '--out', out]);
    check('7 duplicate conflicting APBM_DEV_DB_URL: refused by name', r.code !== 0 && r.out.includes('DUPLICATE_CONFLICT APBM_DEV_DB_URL') && !fs.existsSync(out));
    check('7 duplicate: no secret in output', r.leaked.length === 0);
    // 7b duplicate identical is accepted
    const base7b = goodEnv(); // build once: goodEnv() mints fresh synthetic values on every call
    const e7b = w('env.dupsame', base7b + base7b.split('\n').find((l) => l.startsWith('APBM_DEV_DB_URL=')) + '\n');
    const r7b = run(['--env-local', e7b, '--cast', cast, '--out', path.join(dir, 'out7b.env')]);
    check('7b duplicate identical APBM_DEV_DB_URL: accepted', r7b.code === 0 && r7b.leaked.length === 0);
  }
  // 8 cast problems: wrong projectRef, missing handle, unparsable
  { const c8 = w('cast.wrongref.json', goodCast({ projectRef: SCRATCH_REF })); const out = path.join(dir, 'out8.env');
    const r = run(['--env-local', env, '--cast', c8, '--out', out]);
    check('8a cast projectRef mismatch: refused', r.code !== 0 && r.out.includes('CAST_REF_MISMATCH') && !fs.existsSync(out) && r.leaked.length === 0);
    const cj = JSON.parse(goodCast()); delete cj.identities.MEMBER_B2B3; cj.identities.OWNER1.password = '';
    const c8b = w('cast.missing.json', JSON.stringify(cj));
    const r2 = run(['--env-local', env, '--cast', c8b, '--out', out]);
    check('8b cast missing handle / empty field: both named', r2.code !== 0 && r2.out.includes('CAST_MISSING_HANDLE MEMBER_B2B3') && r2.out.includes('CAST_EMPTY_FIELD OWNER1.password') && !fs.existsSync(out) && r2.leaked.length === 0);
    const c8c = w('cast.bad.json', `{ "projectRef": "${DEV_REF}", "identities": { "OWNER1": { "password": "${syn('BADJSON')}" `);
    const r3 = run(['--env-local', env, '--cast', c8c, '--out', out]);
    check('8c cast unparsable: refused without echoing content', r3.code !== 0 && r3.out.includes('SOURCE_UNREADABLE_OR_UNPARSABLE cast') && r3.leaked.length === 0);
  }
  // 9 bad --dev-db-source
  { const r = run(['--env-local', env, '--cast', cast, '--out', path.join(dir, 'out9.env'), '--dev-db-source', 'SUPABASE_SECRET_KEY']);
    check('9 disallowed --dev-db-source: refused', r.code !== 0 && r.out.includes('BAD_DEV_DB_SOURCE SUPABASE_SECRET_KEY') && r.leaked.length === 0);
  }
  // 10 no stray temp files left
  { const stray = fs.readdirSync(dir).filter((f) => f.includes('.tmp-')); check('10 no temp files left behind', stray.length === 0); }

  fs.rmSync(dir, { recursive: true, force: true });
  let fails = 0;
  for (const [st, name, extra] of results) { if (st === 'FAIL') fails++; console.log(`${st}  ${name}${extra ? `  (${extra})` : ''}`); }
  console.log(`SELF-TEST ${fails === 0 ? 'PASS' : 'FAIL'}: ${results.length - fails}/${results.length} checks; synthetic values planted=${SYN.length}; fixture dir removed`);
  return fails === 0 ? 0 : 1;
}

/* ---------------------------------------------------------------- main */
try {
  const opts = parseArgs(process.argv.slice(2));
  process.exit(opts.selfTest ? selfTest() : generate(opts));
} catch (e) {
  // Never print e.message: it could carry content. Print only the class.
  console.error(`UNEXPECTED ${e && e.constructor ? e.constructor.name : 'Error'} — nothing written`);
  process.exit(3);
}
