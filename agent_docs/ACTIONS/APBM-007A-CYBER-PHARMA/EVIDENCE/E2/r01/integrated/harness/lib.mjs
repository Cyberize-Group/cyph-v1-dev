// Integrated-proof helpers. Credentials are read into memory only; nothing secret is printed or written.
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const PPR = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1', OBR = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev';
const reqPP = createRequire(PPR + '/package.json'), reqOB = createRequire(OBR + '/package.json');
export const { chromium } = reqPP('@playwright/test');
const { createClient } = reqPP('@supabase/supabase-js'); const Stripe = reqPP('stripe'); const pg = reqOB('pg');
const parse = (f) => Object.fromEntries(readFileSync(f, 'utf8').split(/\r?\n/).map((l) => l.match(/^\s*(?:export\s+)?([A-Za-z0-9_]+)\s*=\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].trim().replace(/^(['"])(.*)\1$/, '$2')]));
const pp = parse(PPR + '/.env.local'), ob = parse(OBR + '/.env.local');
const inbox = parse('/home/moose/.config/cyph/apbm007a-test-inboxes.env');
const DEV = 'yrsuwikjnbmvpznrgydb';
if (new URL(pp.NEXT_PUBLIC_SUPABASE_URL).hostname !== `${DEV}.supabase.co` || ob.NEXT_PUBLIC_SUPABASE_URL !== pp.NEXT_PUBLIC_SUPABASE_URL) throw new Error('STOP: not DEV');
export const OB = 'http://localhost:3000', PP = 'http://localhost:3001';
export const cast = { OWNER_1: inbox.OWNER_1.toLowerCase(), OWNER_2: inbox.OWNER_2.toLowerCase(), STORE_ADMIN: inbox.STORE_ADMIN.toLowerCase(), MEMBER: inbox.MEMBER.toLowerCase() };
export const admin = createClient(pp.NEXT_PUBLIC_SUPABASE_URL, pp.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
export const stripe = new Stripe(pp.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia', timeout: 20000, maxNetworkRetries: 0 });
if (!pp.STRIPE_SECRET_KEY.startsWith('sk_test_')) throw new Error('STOP: not a test key');
const secrets = [pp.SUPABASE_SECRET_KEY, pp.STRIPE_SECRET_KEY, pp.STRIPE_WEBHOOK_SECRET, ob.APBM_DEV_DB_URL, ...Object.values(cast)].filter((v) => v && v.length > 6);
export const scrub = (x) => { let s = typeof x === 'string' ? x : JSON.stringify(x, null, 1); for (const v of secrets) s = s.split(v).join('<R>'); return s.replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '<JWT>').replace(/token_hash=[A-Za-z0-9_-]+/g, 'token_hash=<R>').replace(/pi_[A-Za-z0-9]+_secret_[A-Za-z0-9]+/g, '<CS>'); };
export const alias = (email) => Object.entries(cast).find(([, v]) => v === (email || '').toLowerCase())?.[0] ?? (email?.endsWith('@example.invalid') ? email : 'OTHER');
// ── read-only DEV SQL ──
export async function sql(text, params = []) {
  const c = new pg.Client({ connectionString: ob.APBM_DEV_DB_URL, connectionTimeoutMillis: 10000 }); await c.connect();
  try { await c.query('BEGIN READ ONLY'); const r = await c.query(text, params); await c.query('ROLLBACK'); return r.rows; } finally { await c.end(); }
}
// ── effect counters, cumulative across the E2 run ──
const CF = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/out/counters.json';
export function count(key, n = 1, note = '') {
  const d = JSON.parse(readFileSync(CF)); d[key] ??= { used: 0 }; if (typeof d[key] !== 'object') d[key] = { used: 0 };
  d[key].used = (d[key].used ?? 0) + n; writeFileSync(CF, JSON.stringify(d, null, 1));
  appendFileSync('/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/proof/out/effects.log', `${new Date().toISOString()} ${key} +${n} ${note}\n`);
  return d[key];
}
export function ceiling(key, max) { const d = JSON.parse(readFileSync(CF)); if ((d[key]?.used ?? 0) >= max) throw new Error(`ALLOWANCE EXHAUSTED: ${key}`); }
/** A one-time sign-in token for an EXISTING identity, minted by the admin API (no email). Returns the confirm URL for an app. */
export async function signInUrl(app, email) {
  ceiling('auth_session_attempts', 100); count('auth_session_attempts', 1, `confirm-link ${alias(email)} ${app}`);
  const u = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (!u.data.users.some((x) => (x.email || '').toLowerCase() === email)) throw new Error('STOP: identity does not exist; no creation authorised');
  const g = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  if (g.error) throw new Error('generateLink ' + g.error.status);
  return `${app === 'pp' ? PP : OB}/api/auth/confirm?token_hash=${g.data.properties.hashed_token}&type=magiclink`;
}
export const results = []; export function record(name, ok, detail = '') { results.push({ name, status: ok ? 'PASS' : 'FAIL', detail: scrub(detail).slice(0, 300) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + scrub(detail).slice(0, 200) : ''}`); return ok; }
export function save(name) { writeFileSync(`/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/proof/out/${name}.json`, scrub({ at: new Date().toISOString(), results })); }
export function freshNpi() { for (;;) { const nine = '1' + String(Math.floor(Math.random() * 1e8)).padStart(8, '0'); for (let d = 0; d < 10; d++) { const s = '80840' + nine + d; let t = 0, dbl = false; for (let i = s.length - 1; i >= 0; i--) { let x = +s[i]; if (dbl) { x *= 2; if (x > 9) x -= 9; } t += x; dbl = !dbl; } if (t % 10 === 0) return nine + d; } } }
export const cookieNames = async (ctx) => (await ctx.cookies()).map((c) => `${c.name}@${new URL(c.domain.startsWith('http') ? c.domain : 'http://' + c.domain).hostname}`);
