#!/usr/bin/env node
// QAM Q2 privacy scanner (Claudy; PF-5.2, QAM_PACKAGING §5). Scans a directory tree for credential-shaped content:
// sb_secret_/sb_publishable_ keys, JWTs, connection strings with passwords, and env-style assignments of the declared key names.
// Validates itself against a synthetic leak fixture (built at runtime) and a clean control before scanning. Prints counts and
// file paths only, never the matched value.   node privacy-scan.mjs <dir> [--out report.json] [--exclude <regex>]
import { readdirSync, readFileSync, statSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path'; import { tmpdir } from 'node:os';
const a = process.argv.slice(2); const dir = a[0]; const opt = n => { const i = a.indexOf(n); return i < 0 ? undefined : a[i + 1]; };
const exclude = opt('--exclude') ? new RegExp(opt('--exclude')) : /(^|\/)(node_modules|\.next|\.git)(\/|$)|\.(png|jpg|jpeg|gif|webp|zip|woff2?|ttf|ico|pdf)$|(^|\/)privacy-scan\.mjs$/; // the scanner's own source holds the fixture text
const PATTERNS = {
  sb_secret: /sb_secret_[A-Za-z0-9_-]{12,}/g,
  sb_publishable: /sb_publishable_[A-Za-z0-9_-]{12,}/g,
  jwt: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
  pg_url_with_password: /postgres(?:ql)?:\/\/[^:\/\s'"]+:[^@\s'"]+@/g,
  // an assignment counts only when the value looks like a credential: URL/connection string, sb_ key, JWT, or ≥32 opaque chars (a bare project ref is a public identifier)
  env_assignment: /^(?:QA_|RLS_REPLICA_|APBM_DEV_|SUPABASE_SECRET|NEXT_PUBLIC_SUPABASE)[A-Z0-9_]*\s*=\s*['"]?(?:https?:|postgres|sb_|eyJ|\S{32,})\S*/gm,
  // a literal password field with a concrete value; template-literal placeholders (${…}) are code, not values
  cast_password_field: /"password"\s*:\s*"(?!\$\{)[^"$]{8,}"/g,
};
const scan = root => { const hits = {}; let files = 0; const walk = p => { for (const e of readdirSync(p)) { const f = join(p, e); const rel = relative(root, f); if (exclude.test(rel) || exclude.test(f)) continue; const st = statSync(f); if (st.isDirectory()) { walk(f); continue; } if (st.size > 50 * 1024 * 1024) continue; files++; let text; try { text = readFileSync(f, 'utf8'); } catch { continue; } for (const [k, re] of Object.entries(PATTERNS)) { const n = (text.match(re) || []).length; if (n) (hits[k] ||= []).push({ file: rel, count: n }); } } }; walk(root); return { files, hits, total: Object.values(hits).reduce((s, v) => s + v.reduce((x, y) => x + y.count, 0), 0) }; };
// self-validation
const fx = mkdtempSync(join(tmpdir(), 'qa-privacy-')); const b64 = s => Buffer.from(s).toString('base64url');
writeFileSync(join(fx, 'leak.txt'), ['sb_' + 'secret_' + 'QAFIXTURE' + 'x'.repeat(20), 'sb_' + 'publishable_' + 'QAFIXTURE' + 'y'.repeat(20), 'eyJ' + b64('{"alg":"HS256"}') + '.' + b64('{"role":"anon","ref":"qafixture"}') + '.' + 'z'.repeat(20), 'postgresql:' + '//' + 'user:pass@host/db', 'QA_SCRATCH_SECRET_KEY' + '=' + 'sb_' + 'secret_' + 'QAFIXTURE' + 'q'.repeat(24), '{"password": "fixture-password-123"}'].join('\n'));
writeFileSync(join(fx, 'clean.txt'), 'Keys by name only: QA_SCRATCH_SECRET_KEY, QA_DEV_DB_URL. Hosts: db.example.supabase.co. No values here.\n');
const fixture = scan(fx); rmSync(fx, { recursive: true, force: true });
const fixtureOk = Object.keys(PATTERNS).every(k => fixture.hits[k]?.some(h => h.file === 'leak.txt')) && !Object.values(fixture.hits).flat().some(h => h.file === 'clean.txt');
const result = scan(dir);
const report = { scannedDir: dir, filesScanned: result.files, patterns: Object.keys(PATTERNS), validation: { fixtureDetectedAllPatterns: fixtureOk, fixturePatternsHit: Object.keys(fixture.hits).length, cleanControlHits: Object.values(fixture.hits).flat().filter(h => h.file === 'clean.txt').length }, hits: result.hits, totalHits: result.total, result: fixtureOk && result.total === 0 ? 'PASS' : 'FAIL' };
if (opt('--out')) writeFileSync(opt('--out'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ filesScanned: report.filesScanned, validation: report.validation, totalHits: report.totalHits, hits: Object.fromEntries(Object.entries(report.hits).map(([k, v]) => [k, v.map(h => `${h.file}×${h.count}`)])), result: report.result }));
process.exit(report.result === 'PASS' ? 0 : 1);
