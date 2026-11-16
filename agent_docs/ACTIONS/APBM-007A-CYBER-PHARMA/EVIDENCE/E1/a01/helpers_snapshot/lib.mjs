// APBM007A E1 helper library. Loads ONLY named Stripe/Supabase connection/API-key fields
// from the two apps' ignored .env.local files into process memory. Never prints values.
import { readFileSync, statSync, appendFileSync, existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
export const ROOT = '/home/moose/NEXTJS/CYBER_PHARMA';
export const W = `${ROOT}/APBM007A_E1_WORK/a01`;
export const ATTEMPT = 'apbm007a_e1_a01';
export const DEV_REF = 'yrsuwikjnbmvpznrgydb', SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
export const STRIPE_ACCT = 'acct_1RxzixGnEQDyu3RR';
export const reqOB = createRequire(`${W}/baseline/ob/package.json`);
export const reqPP = createRequire(`${W}/baseline/pp/package.json`);
const NAMES = {
  ob: ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SECRET_KEY',
       'APBM_DEV_DB_URL','APBM_DEV_SUPABASE_URL','APBM_DEV_PUBLISHABLE_KEY','APBM_DEV_SECRET_KEY',
       'APBM_SCRATCH_DB_URL','APBM_SCRATCH_SUPABASE_URL','APBM_SCRATCH_PUBLISHABLE_KEY','APBM_SCRATCH_SECRET_KEY'],
  pp: ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SECRET_KEY',
       'STRIPE_SECRET_KEY','NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY','STRIPE_WEBHOOK_SECRET'],
};
const FILES = { ob: `${ROOT}/cyph-v1-dev/.env.local`, pp: `${ROOT}/cyph-payment-portal-dev-v1/.env.local` };
const secrets = new Set();
export function loadApp(app) {
  const want = new Set(NAMES[app]); const out = {};
  for (const line of readFileSync(FILES[app], 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/); if (!m || !want.has(m[1])) continue;
    let v = m[2].trim(); if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v) { out[m[1]] = v; if (v.length >= 8) secrets.add(v); try { const u = new URL(v); if (u.password) secrets.add(decodeURIComponent(u.password)), secrets.add(u.password); } catch {} }
  }
  return out;
}
export const fileMode = app => (statSync(FILES[app]).mode & 0o777).toString(8);
export function scrub(x) { let s = typeof x === 'string' ? x : JSON.stringify(x, null, 1); for (const v of secrets) s = s.split(v).join('<REDACTED>');
  return s.replace(/\b(sk|rk|pk|whsec)_(test|live)_[A-Za-z0-9]+/g, '$1_$2_<REDACTED>').replace(/sb_(secret|publishable)_[A-Za-z0-9_-]+/g, 'sb_$1_<REDACTED>').replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '<JWT>').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/gi, '<EMAIL>'); }
export const say = x => console.log(scrub(x));
export function apiRef(v) { try { return new URL(v).hostname.match(/^([a-z0-9]{20})\.supabase\.co$/)?.[1]; } catch { return undefined; } }
export function sqlRef(v) { try { const u = new URL(v); return u.hostname.match(/^db\.([a-z0-9]{20})\.supabase\.co$/)?.[1] || decodeURIComponent(u.username).match(/^postgres\.([a-z0-9]{20})$/)?.[1]; } catch { return undefined; } }
export function keyClass(v) { if (!v) return 'ABSENT'; if (v.split('.').length === 3) { try { const c = JSON.parse(Buffer.from(v.split('.')[1], 'base64url').toString()); return `legacy-jwt role=${c.role} ref=${c.ref}`; } catch { return 'malformed-jwt'; } }
  for (const p of ['sb_publishable_','sb_secret_','sk_test_','sk_live_','rk_test_','rk_live_','pk_test_','pk_live_','whsec_']) if (v.startsWith(p)) return p + '…'; return 'unrecognized'; }
// effect counters (every dispatch counts, including failures)
const CFILE = `${W}/out/counters.json`;
export function count(key, n = 1, note = '') { const c = existsSync(CFILE) ? JSON.parse(readFileSync(CFILE)) : {}; c[key] = (c[key] || 0) + n; writeFileSync(CFILE, JSON.stringify(c, null, 1));
  appendFileSync(`${W}/out/effects.log`, `${new Date().toISOString()} ${key} +${n} ${note}\n`); return c[key]; }
export function ceiling(key, max) { const c = existsSync(CFILE) ? JSON.parse(readFileSync(CFILE)) : {}; if ((c[key] || 0) >= max) throw new Error(`ALLOWANCE EXHAUSTED: ${key} ${c[key]}/${max}`); }
