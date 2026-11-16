// Minimal authenticated smoke on DEV after the 0053–0060 apply. Three seeded cast identities; sessions are minted
// from an admin-generated one-time token (no password read or changed, no email sent, no identity created) and
// signed out at the end. Reads only, plus one UPDATE that must be DENIED. The audited read functions append their
// normal audit rows. No token is printed or stored.
import assert from 'node:assert/strict'; import { writeFileSync } from 'node:fs';
import pg from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/node_modules/pg/lib/index.js';
import { createClient } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/node_modules/@supabase/supabase-js/dist/index.mjs';
import { loadEnv, evidencePath, DEV_REF } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/scripts/rls-harness/lib/env.mjs';
import { uid } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/scripts/seed/generate.mjs';
const env = loadEnv(); if (env.target !== 'dev' || env.projectRef !== DEV_REF) throw new Error('DEV only');
const opt = { auth: { autoRefreshToken: false, persistSession: false } };
const svc = createClient(env.SUPABASE_URL, env.SECRET_KEY, opt); const db = new pg.Client({ connectionString: env.DB_URL }); await db.connect();
const checks = []; const check = (name, ok) => { assert.ok(ok, name); checks.push({ name, status: 'PASS' }); };
const B = Object.fromEntries(['A1', 'B1', 'B2', 'B3', 'C1'].map(s => [s, uid('store:' + s)]));
const counters = { sessions: 0, signOuts: 0, identitiesCreated: 0, emails: 0 };
const usersBefore = (await db.query('select count(*)::int n from auth.users')).rows[0].n;
const snap = async () => (await db.query("select md5(coalesce(string_agg(to_jsonb(b)::text, '|' order by b.id), '')) h from public.businesses b")).rows[0].h;
async function session(who) {
  const email = `apbm003-${who.toLowerCase()}@example.invalid`;
  const link = await svc.auth.admin.generateLink({ type: 'magiclink', email }); assert.equal(link.error, null, `link ${who}`);
  const c = createClient(env.SUPABASE_URL, env.PUBLISHABLE_KEY, opt);
  const v = await c.auth.verifyOtp({ token_hash: link.data.properties.hashed_token, type: 'magiclink' }); assert.equal(v.error, null, `verify ${who}`); counters.sessions++;
  assert.equal(v.data.user.email, email); return c;
}
const clients = {};
try {
  for (const who of ['OWNER3', 'ADMIN_B2', 'MEMBER_B1']) clients[who] = await session(who);
  for (const [who, rows] of [['OWNER3', 1], ['ADMIN_B2', 0], ['MEMBER_B1', 0]]) { const r = await clients[who].from('subscriptions').select('id,origin'); check(`${who} reads ${rows} subscription row(s)`, !r.error && r.data.length === rows && r.data.every(x => x.origin === 'synthetic_seed')); }
  const before = await snap();
  for (const [who, store] of [['ADMIN_B2', 'B2'], ['OWNER3', 'B1']]) { const r = await clients[who].from('businesses').update({ pharmacy_name: 'SMOKE-DENIED' }).eq('id', B[store]); check(`${who} store update denied (42501)`, r.error?.code === '42501'); }
  check('stores unchanged after the denied updates', (await snap()) === before);
  const ownerBilling = await clients.OWNER3.rpc('admin_billing_status', { p_business_id: B.B1 }); check('owner admin_billing_status allowed', !ownerBilling.error && ownerBilling.data.subscriptions.length === 1 && ownerBilling.data.subscriptions[0].origin === 'synthetic_seed');
  const adminBilling = await clients.ADMIN_B2.rpc('admin_billing_status', { p_business_id: B.B2 }); check('store admin admin_billing_status denied', adminBilling.error?.code === '42501');
  const ownerStores = await clients.OWNER3.rpc('admin_stores', {}); check('owner admin_stores: three stores with subscription status', !ownerStores.error && ownerStores.data.length === 3 && ownerStores.data.every(s => 'subscription_status' in s));
  const adminStores = await clients.ADMIN_B2.rpc('admin_stores', {}); check('store admin admin_stores: one store, no billing field', !adminStores.error && adminStores.data.length === 1 && !('subscription_status' in adminStores.data[0]) && adminStores.data[0].name);
  const access = await clients.MEMBER_B1.rpc('store_access_state', { p_business_id: B.B1 }); check('member store_access_state: active, synthetic, no billing detail', !access.error && access.data.state === 'active' && access.data.origin === 'synthetic_seed' && access.data.is_owner === false && !('subscription' in access.data));
  const foreign = await clients.MEMBER_B1.rpc('store_access_state', { p_business_id: B.C1 }); check("member refused another account's store", foreign.error?.code === '42501');
  const overview = await clients.OWNER3.rpc('owner_billing_overview'); check('owner billing overview: synthetic subscription, three stores', !overview.error && overview.data.subscription.origin === 'synthetic_seed' && overview.data.stores.length === 3 && overview.data.access.state === 'active');
  const denied = await clients.ADMIN_B2.rpc('owner_billing_overview'); check('store admin billing overview denied', denied.error?.code === '42501');
  for (const [fn, args] of [['npi_reserve', { p_draft: B.B1, p_npi: '1234567893' }], ['handoff_invalidate_user', { p_user: B.B1 }], ['provision_paid_registration', { p_operation: B.B1, p_owner_user: B.B1, p_sub: {} }]]) { const r = await clients.OWNER3.rpc(fn, args); check(`customer cannot execute ${fn}`, r.error?.code === '42501'); }
  for (const t of ['billing_customers', 'registration_drafts', 'checkout_operations', 'stripe_events']) { const r = await clients.OWNER3.from(t).select('*').limit(1); check(`customer cannot read ${t}`, r.error?.code === '42501'); }
  const kpis = await clients.MEMBER_B1.rpc('owedbook_kpis', { p_business_id: B.B1 }); check('existing claims read still works for a member', !kpis.error && Number(kpis.data[0].commercial_scripts) === 50);
  const scopes = await clients.OWNER3.rpc('tenant_stores'); check('existing store scope unchanged for the owner', !scopes.error && scopes.data.length === 3);
  const members = await clients.ADMIN_B2.rpc('admin_members', { p_business_id: B.B2 }); check('existing member list still works for a store admin', !members.error && members.data.length >= 1);
} finally {
  for (const c of Object.values(clients)) { const r = await c.auth.signOut({ scope: 'local' }); if (!r.error) counters.signOuts++; }
  counters.identitiesCreated = (await db.query('select count(*)::int n from auth.users')).rows[0].n - usersBefore; await db.end();
}
writeFileSync(evidencePath('dev-authenticated-smoke.json'), JSON.stringify({ status: 'PASS', projectRef: env.projectRef, at: new Date().toISOString(), counters, checks }, null, 2) + '\n');
console.log(`${checks.length} authenticated checks PASS`, JSON.stringify(counters));
