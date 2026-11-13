// Private recipient sidecar parser. Fail closed. Values stay in memory; registered with the scrubber via alias map.
import { readFileSync, statSync, lstatSync } from 'node:fs'; import { execFileSync } from 'node:child_process'; import { dirname } from 'node:path';
const F = '/home/moose/.config/cyph/apbm007a-test-inboxes.env'; const ROLES = ['OWNER_1', 'OWNER_2', 'STORE_ADMIN', 'MEMBER'];
export function loadCast() {
  const st = lstatSync(F); if (st.isSymbolicLink() || !st.isFile()) throw new Error('CAST: not a regular file');
  if (st.mode & 0o077) throw new Error('CAST: file must be owner-only');
  try { execFileSync('git', ['-C', dirname(F), 'rev-parse', '--is-inside-work-tree'], { stdio: 'pipe' }); throw new Error('INSIDE'); } catch (e) { if (e.message === 'INSIDE') throw new Error('CAST: file is inside a Git repository'); }
  const out = {}; for (const line of readFileSync(F, 'utf8').split(/\r?\n/)) { const t = line.trim(); if (!t || t.startsWith('#')) continue; const m = t.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (!m) throw new Error('CAST: malformed line'); if (!ROLES.includes(m[1]) || out[m[1]]) throw new Error('CAST: unexpected or repeated key'); out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '').toLowerCase(); }
  for (const r of ROLES) { if (!out[r] || !/^[^@\s+]+@[^@\s]+\.[a-z]{2,}$/.test(out[r])) throw new Error(`CAST: ${r} missing, malformed or plus-tagged`); }
  if (new Set(Object.values(out)).size !== 4) throw new Error('CAST: addresses not distinct');
  return out;
}
export const dirMode = () => (statSync(dirname(F)).mode & 0o777).toString(8);
