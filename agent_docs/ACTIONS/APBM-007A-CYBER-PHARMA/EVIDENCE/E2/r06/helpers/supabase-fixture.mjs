// APBM007A r06 — a local stand-in for the Supabase Auth and PostgREST endpoints the two apps call during the
// engineering browser walk. FIXTURE PROOF ONLY: it answers from synthetic fixtures, writes nothing anywhere, and
// refuses (and logs) every request it does not model, so an unexpected call shows up in the evidence instead of
// reaching a real service. No real project, key, identity or email is involved.
//   node supabase-fixture.mjs <port> <log file>
// Scenario switch (from the walk script, not the browser): GET /__scenario/<paid|synthetic|nonowner>
import http from 'node:http';
import fs from 'node:fs';

const PORT = Number(process.argv[2] || 54399);
const LOG = process.argv[3];
const ALLOWED_ORIGINS = ['http://localhost:3100', 'http://localhost:3101'];
export const TOKEN = 'fixture-access-token';
const USER = { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', aud: 'authenticated', role: 'authenticated', email: 'owner.fixture@example.test',
  app_metadata: { provider: 'email' }, user_metadata: { full_name: 'Fixture Owner' }, created_at: '2026-11-01T00:00:00Z' };
const STORE = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const ACCOUNT = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
// owner_billing_overview().subscription for a paid, active Stripe subscription: the field set of 0060.
const PAID = { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', origin: 'stripe', status: 'active', raw_status: 'active', quantity: 1,
  current_period_start: '2026-11-16T05:47:00+00:00', current_period_end: '2026-12-16T05:47:00+00:00', cancel_at: null, cancel_at_period_end: false,
  paid_through: '2026-12-16T05:47:00+00:00', latest_invoice_status: 'paid', grace_started_at: null, verified_at: '2026-11-16T05:47:05+00:00' };
const SYNTHETIC = { ...PAID, origin: 'synthetic_seed', raw_status: null, quantity: null, latest_invoice_status: null };
let scenario = 'paid';

const capability = () => (scenario === 'nonowner' ? 'admin' : 'owner');
const RPC = {
  tenant_stores: () => [{ id: STORE, account_id: ACCOUNT, name: 'Fixture Main Street Pharmacy', capability: capability() }],
  admin_stores: () => [{ id: STORE, account_id: ACCOUNT, name: 'Fixture Main Street Pharmacy', ncpdp: null, npi: '1234567893', status: 'active', member_count: 1,
    ...(capability() === 'owner' ? { subscription_status: 'active' } : {}) }],
  owner_billing_overview: () => ({ account_id: ACCOUNT, access: { state: 'active', read_only: false, origin: scenario === 'synthetic' ? 'synthetic_seed' : 'stripe', policy_version: 'access-v1' },
    subscription: scenario === 'synthetic' ? SYNTHETIC : PAID, stores: [{ id: STORE, name: 'Fixture Main Street Pharmacy', npi: '1234567893', status: 'active' }] }),
  admin_audit: () => ({ rows: [{ id: 1, occurred_at: '2026-11-16T05:50:00Z', actor_user_id: USER.id, business_id: STORE, table_name: 'subscriptions', row_id: null, action: 'read_page', context: {} }], snapshot_id: 1 }),
  admin_members: () => [{ id: USER.id, business_id: STORE, name: 'Fixture Owner', email: USER.email, role: 'admin' }],
  store_access_state: () => ({ state: 'active', read_only: false, origin: 'stripe', policy_version: 'access-v1', is_owner: capability() === 'owner' }),
};

const log = (entry) => { if (LOG) fs.appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), scenario, ...entry }) + '\n'); };
const cors = (req) => {
  const o = req.headers.origin;
  return ALLOWED_ORIGINS.includes(o) ? { 'Access-Control-Allow-Origin': o, 'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, accept-profile, content-profile, prefer, accept, x-supabase-api-version',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS', Vary: 'Origin' } : {};
};
const send = (req, res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json', ...cors(req) }); res.end(body === undefined ? '' : JSON.stringify(body)); };

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === 'OPTIONS') { res.writeHead(204, cors(req)); return res.end(); }
  if (url.pathname.startsWith('/__scenario/')) { scenario = url.pathname.split('/').pop(); log({ control: 'scenario' }); return send(req, res, 200, { scenario }); }
  const authed = (req.headers.authorization || '') === `Bearer ${TOKEN}`;
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    const entry = { method: req.method, path: url.pathname, from: req.headers.origin ? 'browser' : 'server', authed };
    if (req.method === 'GET' && url.pathname === '/auth/v1/user') { log({ ...entry, answer: authed ? 200 : 401 }); return authed ? send(req, res, 200, USER) : send(req, res, 401, { code: 401, error_code: 'bad_jwt', msg: 'fixture: no session' }); }
    if (req.method === 'GET' && url.pathname === '/rest/v1/user_roles') {
      log({ ...entry, answer: 200 });
      const one = (req.headers.accept || '').includes('vnd.pgrst.object');
      return send(req, res, 200, one ? { role: 'admin' } : [{ role: 'admin' }]);
    }
    const m = url.pathname.match(/^\/rest\/v1\/rpc\/([a-z_]+)$/);
    if (req.method === 'POST' && m && RPC[m[1]] && authed) { log({ ...entry, rpc: m[1], answer: 200 }); return send(req, res, 200, RPC[m[1]]()); }
    log({ ...entry, rpc: m ? m[1] : undefined, answer: 404, refused: true });
    return send(req, res, 404, { code: 'PGRST202', message: 'fixture: not modelled' });
  });
}).listen(PORT, '127.0.0.1', () => console.log(`fixture on ${PORT}`));
