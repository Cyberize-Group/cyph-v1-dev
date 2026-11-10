#!/usr/bin/env node
// QAM T-04 (Q4): Git product-path lists vs the Q4-derived allowlist. --attack adds a fake path → must be flagged.
//   node t04-allowlist.mjs --out <json> [--attack]
import { readFileSync, writeFileSync } from 'node:fs'; import { execSync } from 'node:child_process'; import { join, resolve, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)); const qam = resolve(here, '..'); const repo = resolve(qam, '../../../..');
const a = process.argv.slice(2); const opt = n => { const i = a.indexOf(n); return i < 0 ? undefined : a[i + 1]; }; const attack = a.includes('--attack');
const BASE = 'af2c7e5225d2d78925fd392e29a58b6bde830263', ORIG = '308247a24e6ddd455842da5cd2e21541d7eae2c1', CAND = 'dc44429f466dedcf35023342f68624c6cee062f0';
const al = JSON.parse(readFileSync(join(qam, 'evidence/derivations/02/allowlist.json'), 'utf8'));
const allowed = new Set([...al.existing, ...al.newFiles, ...al.a02]);
const git = args => execSync(`git ${args}`, { cwd: repo, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const product = l => l.filter(p => !p.startsWith('agent_docs/') && !p.startsWith('_SKILLS/'));
let full = product(git(`diff --name-only ${BASE}..${CAND}`)); let repair = product(git(`diff --name-only ${ORIG}..${CAND}`));
if (attack) { full = [...full, 'src/utils/supabase/client.ts']; repair = [...repair, 'supabase/migrations/0053_fake.sql']; }
const outside = full.filter(p => !allowed.has(p));
const expectedRepair = [...al.c03, 'src/components/owedbook/OwedBookContext.tsx'].sort();
const repairExact = JSON.stringify([...repair].sort()) === JSON.stringify(expectedRepair);
const forbidden = repair.filter(p => /^(supabase\/|scripts\/|src\/services\/|src\/__tests__\/|src\/utils\/|src\/app\/api\/|src\/proxy|src\/app\/\(auth\)|package)/.test(p));
const r = { attack, baseline: BASE, original: ORIG, repaired: CAND, fullProductPaths: full.length, outsideAllowlist: outside, repairProductPaths: repair, expectedRepair, repairExact, forbiddenInRepair: forbidden, protectedUnchanged: Object.fromEntries(['src/proxy.ts', 'src/utils/supabase', 'src/app/api/auth', 'src/app/(auth)', 'next.config.js', 'package-lock.json'].map(p => [p, git(`diff --name-only ${BASE}..${CAND} -- "${p}"`).length === 0])), migrations0001_0047Unchanged: git(`diff --name-only ${BASE}..${CAND} -- supabase/migrations`).filter(f => /\/00(0[1-9]|[1-3]\d|4[0-7])_/.test(f)).length === 0 };
r.result = !outside.length && repairExact && !forbidden.length && Object.values(r.protectedUnchanged).every(Boolean) && r.migrations0001_0047Unchanged ? 'PASS' : (forbidden.length || !repairExact ? 'FAIL (STOP-CONTRACT candidate)' : 'FAIL');
writeFileSync(opt('--out'), JSON.stringify(r, null, 2) + '\n'); console.log(JSON.stringify({ attack, result: r.result, fullProductPaths: full.length, outside: outside.length, repairExact, forbidden }));
process.exit(r.result === 'PASS' ? 0 : 1);
