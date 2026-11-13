import { loadApp, say } from './lib.mjs';
const e = loadApp('ob');
const r = await fetch(e.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/settings', { headers: { apikey: e.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY }, signal: AbortSignal.timeout(30000) });
say({ status: r.status, settings: await r.json() });
