// QAM Q2 shared loader (Claudy). Reads .env.qa.local from the REAL repo root into process memory.
// Never prints a value. Exposes project-ref resolvers used by every QA helper (own implementation,
// modelled on scripts/rls-harness/lib/env.mjs; not imported from product code).
import { readFileSync, lstatSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
export const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
export const DEV_REF = 'yrsuwikjnbmvpznrgydb';
export const HANDLES = ['OWNER1', 'OWNER3', 'ADMIN_B2', 'ADMIN_B3', 'MEMBER_B1', 'MEMBER_B2B3', 'UNRELATED'];
export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
export const qamRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function apiRef(value) { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.hostname.match(/^([a-z0-9]{20})\.supabase\.co$/)?.[1] : undefined; } catch { return undefined; } }
export function sqlRef(value) { try { const u = new URL(value); if (!['postgres:', 'postgresql:'].includes(u.protocol)) return undefined; return u.hostname.match(/^db\.([a-z0-9]{20})\.supabase\.co$/)?.[1] || (/^[a-z0-9-]+\.pooler\.supabase\.com$/.test(u.hostname) ? decodeURIComponent(u.username).match(/^postgres\.([a-z0-9]{20})$/)?.[1] : undefined); } catch { return undefined; } }
export function loadQaEnv() {
  const file = join(repoRoot, '.env.qa.local');
  const st = lstatSync(file);
  if (st.isSymbolicLink() || (st.mode & 0o077)) throw new Error('STOP-ENV .env.qa.local must be a regular 0600 file');
  const env = {};
  // value forms written by make-qa-env.mjs: KEY='value'  # <- SOURCE   (also accept "value" and bare values)
  for (const line of readFileSync(file, 'utf8').split('\n')) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/); if (!m) continue; const rest = m[2]; let v; const q = rest.match(/^'([^']*)'/) || rest.match(/^"([^"]*)"/); if (q) v = q[1]; else v = rest.split(/\s+#/)[0].trim(); env[m[1]] = v; }
  const need = ['QA_SCRATCH_SUPABASE_URL', 'QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY', 'QA_SCRATCH_SECRET_KEY', 'QA_SCRATCH_DB_URL', 'QA_DEV_SUPABASE_URL', 'QA_DEV_SUPABASE_PUBLISHABLE_KEY', 'QA_DEV_DB_URL', ...HANDLES.flatMap(h => [`QA_${h}_EMAIL`, `QA_${h}_PASSWORD`])];
  const missing = need.filter(k => !env[k]?.trim());
  if (missing.length) throw new Error('STOP-ENV missing keys: ' + missing.join(','));
  return env;
}
export function assertTarget(env, target) {
  const ref = target === 'scratch' ? SCRATCH_REF : DEV_REF;
  const prefix = target === 'scratch' ? 'QA_SCRATCH_' : 'QA_DEV_';
  const problems = [];
  if (apiRef(env[prefix + 'SUPABASE_URL']) !== ref) problems.push(prefix + 'SUPABASE_URL ref');
  if (sqlRef(env[prefix + 'DB_URL']) !== ref) problems.push(prefix + 'DB_URL ref');
  const pub = env[prefix + 'SUPABASE_PUBLISHABLE_KEY'];
  if (pub.startsWith('sb_secret_')) problems.push(prefix + 'SUPABASE_PUBLISHABLE_KEY is a secret key');
  if (pub.split('.').length === 3) { try { const c = JSON.parse(Buffer.from(pub.split('.')[1], 'base64url').toString()); if (c.role !== 'anon' || c.ref !== ref) problems.push(prefix + 'SUPABASE_PUBLISHABLE_KEY claims'); } catch { problems.push(prefix + 'SUPABASE_PUBLISHABLE_KEY malformed'); } }
  else if (!pub.startsWith('sb_publishable_')) problems.push(prefix + 'SUPABASE_PUBLISHABLE_KEY format');
  if (target === 'scratch') { const sec = env.QA_SCRATCH_SECRET_KEY; if (sec.split('.').length === 3) { try { const c = JSON.parse(Buffer.from(sec.split('.')[1], 'base64url').toString()); if (c.role !== 'service_role' || c.ref !== ref) problems.push('QA_SCRATCH_SECRET_KEY claims'); } catch { problems.push('QA_SCRATCH_SECRET_KEY malformed'); } } else if (!sec.startsWith('sb_secret_')) problems.push('QA_SCRATCH_SECRET_KEY format'); if (sec === pub) problems.push('QA_SCRATCH_SECRET_KEY equals publishable'); }
  if (problems.length) throw new Error(`STOP-IDENTITY ${target} fence: ` + problems.join('; '));
  return ref;
}
// DEV cast uid fingerprint (identity fence only; source: EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-map.json, the Director's APPLY receipt).
export const DEV_CAST_UIDS = ['eadf5edc-3f00-4151-a3e5-823990ea0300', '1d512afb-abc7-4083-8b49-06e6a41a3401', '1185e570-f8d7-4c06-ad40-205d232c8002', '4d2b3fc9-a2a2-4540-a008-094211503dd7', '1b4ffd9e-c023-4960-9e04-1eab0aa4fdd2', 'efe49114-095e-4d3d-8f9a-c767f34098af', 'c322c8da-85af-44fa-8b98-375c22385f9d'];
export const redact = s => String(s).replace(/(postgres(?:ql)?:\/\/)[^\s'"]+/g, '$1<redacted>').replace(/sb_(secret|publishable)_[A-Za-z0-9_-]+/g, 'sb_$1_<redacted>').replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '<jwt-redacted>');
