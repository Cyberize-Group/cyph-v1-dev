// APBM-003: complete credentials, explicit target, bounded output; no DEV fallback.
import { readFileSync, existsSync, lstatSync, mkdirSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, isAbsolute, sep } from 'node:path';
import dotenv from 'dotenv';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const harnessRoot = join(repoRoot, 'scripts/rls-harness');
export const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
export const DEV_REF = 'yrsuwikjnbmvpznrgydb'; // CyberPharma_Dev_v1; the Vibe pilot is not a permitted DEV target.
const logicalNames = ['DB_URL', 'SUPABASE_URL', 'PUBLISHABLE_KEY', 'SECRET_KEY'];
const fail = message => { throw new Error(`FAIL-CLOSED: ${message}`); };
export function apiRef(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && !u.search && !u.hash && (u.pathname === '/' || !u.pathname) ? u.hostname.match(/^([a-z0-9]{20})\.supabase\.co$/)?.[1] : undefined; } catch { return undefined; }
}
export function sqlRef(value) {
  try { const u = new URL(value); if (!['postgres:', 'postgresql:'].includes(u.protocol) || u.pathname !== '/postgres') return undefined;
    return u.hostname.match(/^db\.([a-z0-9]{20})\.supabase\.co$/)?.[1] || (/^[a-z0-9-]+\.pooler\.supabase\.com$/.test(u.hostname) ? decodeURIComponent(u.username).match(/^postgres\.([a-z0-9]{20})$/)?.[1] : undefined);
  } catch { return undefined; }
}
export function validateConfig(raw, { prefix, target, projectRef, sharedDevRef = DEV_REF } = {}) {
  if (!/^[A-Z][A-Z0-9_]*_$/.test(prefix || '')) fail('explicit complete credential prefix required');
  if (!['scratch', 'dev'].includes(target)) fail('APBM_TARGET must be scratch or dev');
  if (projectRef !== (target === 'scratch' ? SCRATCH_REF : DEV_REF)) fail('target is not the Director-approved project');
  const out = {};
  for (const name of logicalNames) { if (!raw[prefix + name]?.trim()) fail(`missing ${prefix + name}; no fallback permitted`); out[name] = raw[prefix + name].trim(); }
  if (apiRef(out.SUPABASE_URL) !== projectRef || sqlRef(out.DB_URL) !== projectRef) fail('SQL/API/approved project identity mismatch');
  if (target === 'scratch' && (projectRef === sharedDevRef || projectRef === DEV_REF)) fail('shared DEV cannot be SCRATCH');
  if (out.PUBLISHABLE_KEY === out.SECRET_KEY || out.PUBLISHABLE_KEY.startsWith('sb_secret_')) fail('user key cannot be a service/secret key');
  for (const [key, role] of [['PUBLISHABLE_KEY', 'anon'], ['SECRET_KEY', 'service_role']]) {
    if (out[key].split('.').length === 3) {
      let claims; try { claims = JSON.parse(Buffer.from(out[key].split('.')[1], 'base64url').toString()); } catch { fail(`malformed ${prefix + key}`); }
      if (claims.role !== role || claims.ref !== projectRef) fail(`${prefix + key} role/project mismatch`);
    } else if (!out[key].startsWith(key === 'PUBLISHABLE_KEY' ? 'sb_publishable_' : 'sb_secret_')) fail(`unrecognized ${prefix + key} format`);
  }
  return Object.freeze({ ...out, prefix, target, projectRef });
}
export function evidenceRoot(requested = process.env.APBM_EVIDENCE_DIR) {
  if (!requested || !isAbsolute(requested)) fail('APBM_EVIDENCE_DIR must be an absolute path');
  const root = resolve(requested);
  const allowed = ['agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2', 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence', 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply'].map(p => join(repoRoot, p));
  if (!allowed.some(base => root === base || root.startsWith(base + sep))) fail('evidence must stay in the current APBM E2/APPLY/QA lane');
  let cursor = repoRoot;
  if (realpathSync(repoRoot) !== repoRoot) fail('repository symlink not permitted');
  for (const part of relative(repoRoot, root).split(sep)) { cursor = join(cursor, part); if (existsSync(cursor) && (lstatSync(cursor).isSymbolicLink() || !lstatSync(cursor).isDirectory())) fail('evidence ancestor must be a real directory'); }
  return root;
}
export function evidencePath(name) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(name) || name.includes('..')) fail('unsafe evidence filename');
  const root = evidenceRoot();
  mkdirSync(root, { recursive: true });
  const file = join(root, name);
  if (existsSync(file) && (lstatSync(file).isSymbolicLink() || !lstatSync(file).isFile())) fail('evidence file must be regular');
  return file;
}
export function loadEnv(prefix = process.env.RLS_HARNESS_PREFIX) {
  const raw = dotenv.parse(readFileSync(join(repoRoot, '.env.local')));
  const supplied = logicalNames.filter(n => process.env[prefix + n] !== undefined);
  if (supplied.length && supplied.length !== logicalNames.length) fail('partial process credential override prohibited');
  if (supplied.length) for (const n of logicalNames) raw[prefix + n] = process.env[prefix + n];
  const env = validateConfig(raw, { prefix, target: process.env.APBM_TARGET, projectRef: process.env.APBM_PROJECT_REF, sharedDevRef: apiRef(raw.NEXT_PUBLIC_SUPABASE_URL) });
  evidenceRoot();
  return env;
}
export function assertScratch(env) { if (env.target !== 'scratch' || env.projectRef !== SCRATCH_REF || sqlRef(env.DB_URL) !== SCRATCH_REF || apiRef(env.SUPABASE_URL) !== SCRATCH_REF) fail('destructive operation requires confirmed SCRATCH'); }
export function safeLabel(label) { if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(label)) fail('invalid run label'); return label; }
export const CAST_PASSWORD = process.env.APBM_CAST_PASSWORD;
