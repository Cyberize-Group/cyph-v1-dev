#!/usr/bin/env node
// QAM Q4 derivation (Claudy): re-derives the A01 exact allowlist with the C-03 scope amendment applied
// (DemoMarker.tsx + BillingScreen.tsx permitted for F-01 copy only; OwedBookContext.tsx already on the A01 list,
// F-05 guard declared in manifest §8). Writes evidence/derivations/02/allowlist.{md,json} BEFORE T-04 runs (AM-1).
// Reads the Q2 allowlist.json (derived from the A01 text) and APBM_RULINGS.md §C text; never an engineering receipt.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'; import { join, resolve, dirname } from 'node:path'; import { fileURLToPath } from 'node:url'; import { createHash } from 'node:crypto';
const here = dirname(fileURLToPath(import.meta.url)); const qam = resolve(here, '..'); const mod = resolve(qam, '..');
const out = join(qam, 'evidence', 'derivations', '02'); mkdirSync(out, { recursive: true });
const q2 = JSON.parse(readFileSync(join(qam, 'evidence/derivations/01/allowlist.json'), 'utf8'));
const rulings = readFileSync(join(mod, 'APBM_RULINGS.md'), 'utf8');
const c03 = rulings.match(/\*\*C-03[^]*?(?=\n\n)/)?.[0] || ''; if (!/DemoMarker\.tsx/.test(c03) || !/BillingScreen\.tsx/.test(c03)) { console.error('C-03 text not found in APBM_RULINGS.md'); process.exit(2); }
const c03Files = ['src/components/admin-portal/DemoMarker.tsx', 'src/components/admin-portal/BillingScreen.tsx'];
const existing = [...q2.existing, ...c03Files]; const protectedPaths = q2.protectedPaths.filter(p => !/DemoMarker|BillingScreen/.test(p));
const stamp = `Derived by Claudy (QA Executor) at ${new Date().toISOString()} for Q4 from evidence/derivations/01/allowlist.json (A01 transcription, C-01) plus APBM_RULINGS.md §C C-03 (sha256 of APBM_RULINGS.md: ${createHash('sha256').update(rulings).digest('hex')}).`;
writeFileSync(join(out, 'allowlist.json'), JSON.stringify({ existing, newFiles: q2.newFiles, a02: q2.a02, c03: c03Files, protectedPaths, repairScope: { c03CopyOnly: c03Files, f05Guard: 'src/components/owedbook/OwedBookContext.tsx (A01 existing list; manifest §8 declares the guard TAKEN)' } }, null, 2) + '\n');
writeFileSync(join(out, 'allowlist.md'), `# allowlist.md — [QA-derived] Q4\n\n${stamp}\n\nC-03 text as read:\n\n> ${c03.replace(/\n/g, '\n> ')}\n\nExisting files permitted (${existing.length} = A01 ${q2.existing.length} + C-03 2):\n${existing.map(p => '- ' + p).join('\n')}\n\nNew files (${q2.newFiles.length}, unchanged from Q2): see allowlist.json.\n\nA02: ${q2.a02.join(', ')}.\n\nProtected (must show no change baseline→repaired candidate):\n${protectedPaths.map(p => '- ' + p).join('\n')}\n\nT-04 expectation (Q4): every product path in \`git diff --name-only af2c7e5..dc44429f\` (excluding agent_docs/) ⊆ existing ∪ newFiles ∪ a02; the repair diff 308247a2..dc44429f product paths = exactly the two C-03 files + OwedBookContext.tsx; no migration, seed, harness, service, auth or test path in the repair diff (else STOP-CONTRACT).\n`);
console.log('wrote', out);
