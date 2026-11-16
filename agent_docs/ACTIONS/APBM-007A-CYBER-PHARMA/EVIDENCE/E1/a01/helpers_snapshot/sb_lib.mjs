import { loadApp, reqOB, apiRef, DEV_REF, count, ceiling, scrub } from './lib.mjs'; import { loadCast } from './cast.mjs';
export const { createClient } = reqOB('@supabase/supabase-js');
export const env = loadApp('ob'); if (apiRef(env.NEXT_PUBLIC_SUPABASE_URL) !== DEV_REF) throw new Error('STOP: not DEV');
export const cast = loadCast();
export const say = x => { let s = scrub(x); console.log(s); };
// scrub() replaces any email with <EMAIL>; alias() gives a stable label
export const alias = email => Object.entries(cast).find(([, v]) => v === (email || '').toLowerCase())?.[0] || 'NON_CAST';
export const admin = () => createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
export const anon = (opts = {}) => createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { autoRefreshToken: false, persistSession: false, ...opts } });
export const sid = id => id ? id.slice(0, 8) + '…' : null;
export async function adminGet(path) { count('supabase_read', 1, path.split('?')[0]); const r = await fetch(env.NEXT_PUBLIC_SUPABASE_URL + path, { headers: { apikey: env.SUPABASE_SECRET_KEY, Authorization: `Bearer ${env.SUPABASE_SECRET_KEY}` }, signal: AbortSignal.timeout(30000) }); return { status: r.status, body: await r.json().catch(() => null) }; }
export async function findUser(email) { const r = await adminGet('/auth/v1/admin/users?per_page=50&filter=' + encodeURIComponent(email)); if (r.status !== 200) throw new Error('admin lookup failed ' + r.status); return (r.body.users || []).find(u => (u.email || '').toLowerCase() === email) || null; }
export const claims = t => JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString());
export { count, ceiling };
