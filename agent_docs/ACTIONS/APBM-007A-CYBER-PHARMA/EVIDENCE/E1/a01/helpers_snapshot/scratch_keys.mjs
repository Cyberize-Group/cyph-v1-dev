// Read-only: do the SCRATCH API keys work against the SCRATCH API URL? Two GETs, nothing printed but status.
import { loadApp, apiRef, SCRATCH_REF, count, say } from './lib.mjs';
const e = loadApp('ob'); if (apiRef(e.APBM_SCRATCH_SUPABASE_URL) !== SCRATCH_REF) throw new Error('STOP');
const get = async (p, k) => { count('supabase_read', 1, 'scratch ' + p.split('?')[0]); const r = await fetch(e.APBM_SCRATCH_SUPABASE_URL + p, { headers: { apikey: k, Authorization: `Bearer ${k}` }, signal: AbortSignal.timeout(20000) }); return r.status; };
say({ publishableKey_authSettings: await get('/auth/v1/settings', e.APBM_SCRATCH_PUBLISHABLE_KEY), secretKey_adminUsersPage1: await get('/auth/v1/admin/users?per_page=1', e.APBM_SCRATCH_SECRET_KEY), secretEqualsDevSecret: e.APBM_SCRATCH_SECRET_KEY === e.SUPABASE_SECRET_KEY, publishableEqualsDev: e.APBM_SCRATCH_PUBLISHABLE_KEY === e.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY });
