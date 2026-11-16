// Read-only DEV inspection through the data API with the server key. GET/HEAD only; no RPC calls (audited RPCs write audit rows).
import { loadApp, say, apiRef, DEV_REF, count } from './lib.mjs';
const e = loadApp('ob'); if (apiRef(e.NEXT_PUBLIC_SUPABASE_URL) !== DEV_REF) throw new Error('STOP: not DEV');
const H = { apikey: e.SUPABASE_SECRET_KEY, Authorization: `Bearer ${e.SUPABASE_SECRET_KEY}` };
const get = async (path, extra = {}) => { count('supabase_read', 1, path.split('?')[0]); const r = await fetch(e.NEXT_PUBLIC_SUPABASE_URL + path, { headers: { ...H, ...extra }, signal: AbortSignal.timeout(30000) }); return r; };
const out = {};
const root = await get('/rest/v1/'); out.openapiStatus = root.status;
if (root.ok) { const j = await root.json(); const paths = Object.keys(j.paths || {}); out.tables = paths.filter(p => !p.startsWith('/rpc/') && p !== '/').map(p => p.slice(1)).sort(); out.rpcs = paths.filter(p => p.startsWith('/rpc/')).map(p => p.slice(5)).sort();
  out.businessesCols = Object.keys(j.definitions?.businesses?.properties || {}); out.subscriptionsCols = Object.keys(j.definitions?.subscriptions?.properties || {}); out.accountsCols = Object.keys(j.definitions?.accounts?.properties || {}); out.pendingRegCols = Object.keys(j.definitions?.pending_registrations?.properties || {}); out.apaCols = Object.keys(j.definitions?.apa_memberships?.properties || {}); }
for (const t of ['accounts','businesses','user_businesses','subscriptions','pending_registrations','apa_memberships','user_roles','profiles','user_data','audit_logs','system_config']) {
  const r = await get(`/rest/v1/${t}?select=*`, { Prefer: 'count=exact', Range: '0-0', 'Range-Unit': 'items' }); out['count_' + t] = r.headers.get('content-range') || `status ${r.status}`; await r.arrayBuffer(); }
const b = await get('/rest/v1/businesses?select=npi,ncpdp,status,stripe_customer_id,account_id'); if (b.ok) { const rows = await b.json(); const npis = rows.map(r => r.npi); const dup = npis.filter((n, i) => n != null && npis.indexOf(n) !== i);
  out.npi = { stores: rows.length, nullNpi: npis.filter(n => n == null).length, duplicateNpiValues: new Set(dup).size, nonTenDigit: npis.filter(n => n != null && !/^\d{10}$/.test(n)).length, nullNcpdp: rows.filter(r => r.ncpdp == null).length, storesWithStripeCustomer: rows.filter(r => r.stripe_customer_id).length, statuses: [...new Set(rows.map(r => r.status))], accounts: new Set(rows.map(r => r.account_id)).size }; }
const s = await get('/rest/v1/subscriptions?select=status,stripe_subscription_id,stripe_customer_id'); if (s.ok) { const rows = await s.json(); out.subs = { n: rows.length, statuses: [...new Set(rows.map(r => r.status))], withStripeSubId: rows.filter(r => r.stripe_subscription_id).length, idShapes: [...new Set(rows.map(r => (r.stripe_subscription_id || '').slice(0, 4)))] }; }
for (const schema of ['apbm_migrations', 'auth']) { const r = await get('/rest/v1/' + (schema === 'auth' ? 'sessions' : 'ledger') + '?select=*&limit=1', { 'Accept-Profile': schema }); out['schema_' + schema] = `status ${r.status} ${(await r.text()).slice(0, 160)}`; }
say(out);
