// APBM007A r05 — engineering proof against real SCRATCH SQL for F-Q4-003, F-Q4-004 and F-Q4-002, inside ONE
// transaction that is always rolled back. The portal modules are transpiled from a source tree given as argv[2] (the
// tested copy, or the same copy with the candidate files swapped in for the control). Real: tables, unique indexes,
// operation_lease, provision_paid_registration, npi_reserve / npi_bind / npi_release_unpaid. Substituted: the database
// client (pg adapter), Stripe (modelled), the Auth admin API and the mailer. No Auth row is created: the Auth substitute
// maps the synthetic draft address to ONE existing synthetic SCRATCH identity without an account (only its ID is read).
// No network (fetch is the Auth substitute and refuses anything else). The SCRATCH URL is read in memory, never printed.
const fs = require('fs'), vm = require('vm'), crypto = require('crypto'), assert = require('assert/strict');
const OB = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev';
const SRC = process.argv[2], OUT = process.argv[3], LABEL = process.argv[4] || 'repair';
const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
const env = require(OB + '/node_modules/dotenv').parse(fs.readFileSync(OB + '/.env.local'));
const { Client } = require(OB + '/node_modules/pg');
const ts = require(SRC + '/node_modules/typescript');
if (!String(env.APBM_SCRATCH_DB_URL || '').includes(SCRATCH_REF)) throw new Error('TARGET_NOT_SCRATCH');
const db = new Client({ connectionString: env.APBM_SCRATCH_DB_URL });
const report = { label: LABEL, environment: `SCRATCH (${SCRATCH_REF}), single transaction, rolled back`, source: SRC.replace('/home/moose/NEXTJS/CYBER_PHARMA/', ''), scenarios: [], auth_writes: 0, network_calls: 0 };

// ── pg adapter ──
const TABLES = ['registration_drafts', 'checkout_operations', 'npi_reservations', 'accounts', 'notification_operations', 'businesses', 'user_businesses', 'billing_customers', 'subscriptions'];
const name = (x) => { if (!/^[a-z_][a-z0-9_]*$/.test(x)) throw new Error('SQL_NAME'); return '"' + x + '"'; };
let sp = 0;
// One connection carries every concurrent run, so each statement (with its savepoint) is one atomic unit behind a mutex.
// Runs still interleave between statements, as separate requests do; only a single statement is indivisible, as in
// PostgreSQL. (Attempt 1 interleaved savepoints across runs and aborted the transaction: instrument fault, preserved.)
let chain = Promise.resolve();
const atomic = (fn) => { const p = chain.then(fn, fn); chain = p.catch(() => undefined); return p; };
async function stmt(sql, values) {
  return atomic(async () => {
    const s = 'eng' + (++sp);
    await db.query('SAVEPOINT ' + s);
    try { const r = await db.query(sql, values); await db.query('RELEASE SAVEPOINT ' + s); return r; }
    catch (e) { await db.query('ROLLBACK TO SAVEPOINT ' + s); throw e; }
  });
}
function from(table) {
  if (!TABLES.includes(table)) throw new Error('TABLE_NOT_ALLOWED ' + table);
  let mode = 'select', cols = '*', payload = {}, order = '', limit = '';
  const where = [], args = [];
  const b = {
    select(c = '*') { cols = c; return b; }, insert(p) { mode = 'insert'; payload = p; return b; }, update(p) { mode = 'update'; payload = p; return b; },
    eq(k, v) { args.push(v); where.push(name(k) + '=$' + args.length); return b; },
    in(k, v) { args.push(v); where.push(name(k) + '=ANY($' + args.length + ')'); return b; },
    order(k, o) { order = ' ORDER BY ' + name(k) + (o && o.ascending ? ' ASC' : ' DESC'); return b; },
    limit(n) { limit = ' LIMIT ' + Number(n); return b; },
    maybeSingle() { return run(true); }, single() { return run(true); },
    then(ok, bad) { return run(false).then(ok, bad); },
  };
  async function run(single) {
    const sel = cols === '*' ? '*' : cols.split(',').map((c) => name(c.trim())).join(',');
    let sql, values = args;
    if (mode === 'select') sql = `SELECT ${sel} FROM public.${name(table)}${where.length ? ' WHERE ' + where.join(' AND ') : ''}${order}${limit}`;
    else if (mode === 'insert') { const keys = Object.keys(payload); values = Object.values(payload); sql = `INSERT INTO public.${name(table)}(${keys.map(name).join(',')}) VALUES(${keys.map((_, i) => '$' + (i + 1)).join(',')}) RETURNING ${sel}`; }
    else { if (!where.length) throw new Error('UNSCOPED_UPDATE'); const keys = Object.keys(payload); values = [...args, ...Object.values(payload)]; sql = `UPDATE public.${name(table)} SET ${keys.map((k, i) => name(k) + '=$' + (args.length + i + 1)).join(',')} WHERE ${where.join(' AND ')} RETURNING ${sel}`; }
    try { const r = await stmt(sql, values); const rows = JSON.parse(JSON.stringify(r.rows)); return { data: single ? rows[0] || null : rows, error: null }; }
    catch (e) { return { data: null, error: { code: e.code } }; }
  }
  return b;
}
const hooks = {};
const RPCS = ['npi_reserve', 'npi_bind', 'npi_release_unpaid', 'operation_lease', 'provision_paid_registration'];
async function rpc(fn, a) {
  if (!RPCS.includes(fn)) throw new Error('RPC_NOT_ALLOWED ' + fn);
  if (fn === 'provision_paid_registration' && hooks.beforeProvision) await hooks.beforeProvision();
  if (fn === 'npi_reserve') return (await stmt('SELECT * FROM public.npi_reserve($1,$2)', [a.p_draft, a.p_npi])).rows;
  const keys = Object.keys(a);
  const vals = Object.values(a).map((v) => (v && typeof v === 'object' ? JSON.stringify(v) : v));
  return (await stmt(`SELECT public.${name(fn)}(${keys.map((k, i) => name(k) + ' => $' + (i + 1)).join(',')}) AS v`, vals)).rows[0].v;
}

// ── controlled Auth substitute (no Auth writes) ──
let SYNTH_USER = null;   // an existing synthetic SCRATCH identity without an account
const authUsers = [];    // the substitute's view: { id, email, created_at, app_metadata }
let createCalls = 0;
const authAdmin = { createUser: async (p) => {
  createCalls++;
  if (hooks.beforeCreateUser) await hooks.beforeCreateUser();
  if (authUsers.some((u) => u.email === p.email)) return { data: null, error: { status: 422, code: 'email_exists' } };
  const u = { id: SYNTH_USER, email: p.email, created_at: new Date().toISOString(), app_metadata: p.app_metadata || {} };
  authUsers.push(u);
  if (hooks.afterCreateUser) await hooks.afterCreateUser();
  return { data: { user: { id: u.id } }, error: null };
} };
global.fetch = async (url) => {
  const u = String(url);
  if (!u.startsWith(`https://${SCRATCH_REF}.supabase.co/auth/v1/admin/users?`)) { report.network_calls++; throw new Error('NETWORK_FORBIDDEN'); }
  const email = decodeURIComponent(u.split('filter=')[1] || '');
  if (hooks.onLookup) await hooks.onLookup();
  return { ok: true, status: 200, json: async () => ({ users: authUsers.filter((x) => x.email === email).map((x) => ({ ...x })) }) };
};
// ── mailer substitute: Supabase's per-address interval, a second link within 60 s → 429 ──
const mailLog = [];
const accessEmail = { sendSignInLink: async (email) => {
  await Promise.resolve();
  const recent = mailLog.some((m) => m.email === email && m.result === 'ok' && Date.now() - m.at < 60000);
  mailLog.push({ email, at: Date.now(), result: recent ? '429' : 'ok' });
  return recent ? { ok: false, code: '429' } : { ok: true };
} };

// ── modelled Stripe ──
const err = (type, message, param) => Object.assign(new Error(message), { type, param });
const P = { customers: new Map(), sessions: new Map(), keys: new Map(), lose: null, n: 0, subs: new Map() };
const resetWorld = () => { P.customers.clear(); P.sessions.clear(); P.keys.clear(); P.subs.clear(); P.lose = null; authUsers.length = 0; mailLog.length = 0; createCalls = 0; for (const k of Object.keys(hooks)) delete hooks[k]; };
const nowS = () => Math.floor(Date.now() / 1000);
async function idem(kind, key, params, make) {
  const fp = JSON.stringify(params), saved = P.keys.get(key);
  if (saved && saved.inFlight) throw err('StripeIdempotencyError', 'in progress');
  if (saved) { if (saved.params !== fp) throw err('StripeIdempotencyError', 'different parameters'); return { ...saved.result }; }
  const entry = { params: fp, inFlight: true }; P.keys.set(key, entry);
  await Promise.resolve();
  let result; try { result = make(); } catch (e) { P.keys.delete(key); throw e; }
  entry.result = { ...result }; entry.inFlight = false;
  if (P.lose && P.lose.kind === kind) { P.lose = null; throw err('StripeConnectionError', 'answer lost'); }
  return { ...result };
}
const provider = {
  accounts: { retrieveCurrent: async () => ({ id: 'acct_eng' }) },
  promotionCodes: { list: async (p) => ({ data: p.code === 'APA10ENG' ? [{ id: 'promo_eng', code: 'APA10ENG', expires_at: null, promotion: { coupon: { valid: true, percent_off: 10 } } }] : [] }) },
  customers: { create: (p, o) => idem('customer', o.idempotencyKey, p, () => { const c = { id: 'cus_E' + (++P.n), ...p }; P.customers.set(c.id, c); return c; }) },
  checkout: { sessions: {
    create: (p, o) => idem('session', o.idempotencyKey, p, () => {
      if (p.expires_at < nowS() + 1800 || p.expires_at > nowS() + 86400) throw err('StripeInvalidRequestError', 'expires_at', 'expires_at');
      const id = 'cs_test_E' + (++P.n);
      const s = { id, url: 'https://checkout.stripe.test/c/pay/' + id, status: 'open', payment_status: 'unpaid', amount_total: p.discounts ? 8910 : 9900, currency: 'usd', livemode: false, mode: 'subscription', customer: p.customer, client_reference_id: p.client_reference_id, expires_at: p.expires_at, subscription: null, metadata: p.metadata };
      P.sessions.set(id, s); return s;
    }),
    retrieve: async (id) => ({ ...P.sessions.get(id) }),
    expire: async (id) => { const s = P.sessions.get(id); if (!s || s.status !== 'open') throw err('StripeInvalidRequestError', 'not open'); s.status = 'expired'; return { ...s }; },
  } },
  subscriptions: { retrieve: async (id) => JSON.parse(JSON.stringify(P.subs.get(id))) },
};
function pay(sessionId, priceId) {   // the buyer pays: session complete, subscription active, first invoice paid
  const s = P.sessions.get(sessionId); const subId = 'sub_E' + (++P.n);
  Object.assign(s, { status: 'complete', payment_status: 'paid', subscription: subId });
  P.subs.set(subId, { id: subId, customer: s.customer, status: 'active', cancel_at_period_end: false, cancel_at: null, metadata: s.metadata,
    items: { data: [{ id: 'si_E' + P.n, price: { id: priceId }, quantity: 1, current_period_start: nowS(), current_period_end: nowS() + 2592000 }] },
    latest_invoice: { id: 'in_E' + P.n, status: 'paid', currency: 'usd', amount_paid: s.amount_total } });
}

// ── module loader ──
const cache = {};
const stubs = { '@/server/db': { admin: () => ({ from, auth: { admin: authAdmin } }), rpc: async (fn, a) => rpc(fn, a), bytea: (b) => '\\x' + b.toString('hex') }, '@/server/accessEmail': accessEmail };
function load(id) {
  if (stubs[id]) return stubs[id];
  if (cache[id]) return cache[id].exports;
  if (!id.startsWith('@/')) return require(require.resolve(id, { paths: [SRC] }));
  if (id.startsWith('@/utils/supabase')) throw new Error('SUPABASE_CLIENT_FORBIDDEN');
  const file = SRC + '/src/' + id.slice(2) + '.ts';
  const m = { exports: {} }; cache[id] = m;
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  vm.runInThisContext('(function(require,module,exports){' + js + '\n})')(load, m, m.exports);
  return m.exports;
}
Object.assign(process.env, { APA_PROMOTION_CODES: 'APA10ENG', STRIPE_SECRET_KEY: 'sk_test_eng_placeholder', STRIPE_PRICE_STORES: 'price_eng', STRIPE_PORTAL_CONFIGURATION: 'bpc_eng', STRIPE_EXPECTED_ACCOUNT: 'acct_eng', STRIPE_WEBHOOK_SECRET: 'whsec_eng', NEXT_PUBLIC_SUPABASE_URL: `https://${SCRATCH_REF}.supabase.co`, NEXT_PUBLIC_APP_ENV: 'local', SUPABASE_SECRET_KEY: 'eng-substitute-key-not-used-for-network' });

function npiFrom(seed) { const nine = String(seed).padStart(9, '0'); let sum = 0; [...('80840' + nine)].reverse().forEach((x, i) => { let d = +x; if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; } sum += d; }); return nine + ((10 - (sum % 10)) % 10); }
const consents = { termsAccepted: true, recurringChargeAccepted: true, priceChangeAccepted: true };
const key = (t) => ('eng_r05_' + t + '_' + crypto.randomBytes(6).toString('hex'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const q = async (sql, args) => (await stmt(sql, args)).rows;

(async () => {
  await db.connect();
  await db.query('BEGIN');
  try {
    SYNTH_USER = (await q("select u.id from auth.users u where u.email like '%@example.invalid' and not exists (select 1 from public.accounts a where a.owner_user_id = u.id) order by u.id limit 1"))[0]?.id;
    if (!SYNTH_USER) throw new Error('NO_SYNTHETIC_IDENTITY');
    report.synthetic_identity = 'existing SCRATCH synthetic identity without an account (ID only; no Auth write)';
    const reg = load('@/server/registration'), co = load('@/server/checkout'), prov = load('@/server/provisioning'), operator = load('@/server/operator');
    load('@/server/stripeClient').__setStripeForTests(provider, true);
    const ownerOf = (label) => ({ firstName: 'Eng', lastName: 'Proof R05', email: `eng.proof.r05.${label}@example.test`, mobile: '(555) 010-0177', ownerDeclarationAccepted: true });
    async function paidOperation(label, seed) {
      const npi = npiFrom(seed);
      const saved = await reg.saveDraft(undefined, { owner: ownerOf(label), pharmacy: { name: 'R05 Synthetic ' + label, street: '1 Test Lane', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0178', npi, ncpdp: '', software: 'Liberty' } }, null);
      await reg.requestQuote(saved.newSecret, 'price_eng');
      await co.startCheckout(saved.newSecret, { consents, operationKey: key(label) }, null);
      const [op] = await q('select * from public.checkout_operations where draft_id=$1', [saved.draft.id]);
      pay(op.stripe_checkout_session_id, 'price_eng');
      return { op, draftId: saved.draft.id, secret: saved.newSecret, npi };
    }
    const entities = async (opId) => {
      const [o] = await q('select status, last_error_code, owner_user_id, owner_was_existing, account_id, business_id from public.checkout_operations where id=$1', [opId]);
      const accounts = await q('select id from public.accounts where owner_user_id=$1', [SYNTH_USER]);
      const ids = accounts.map((a) => a.id);
      const n = async (t, col) => (await q(`select count(*)::int n from public.${t} where ${col} = any($1)`, [ids]))[0].n;
      const stores = await q('select id from public.businesses where account_id = any($1)', [ids]);
      return { operation: { status: o.status, last_error_code: o.last_error_code, owner_is_synthetic_identity: o.owner_user_id === SYNTH_USER, owner_was_existing: o.owner_was_existing },
        counts: { accounts: ids.length, stores: stores.length, admins: (await q("select count(*)::int n from public.user_businesses where business_id = any($1) and role='admin'", [stores.map((s) => s.id)]))[0].n, mappings: await n('billing_customers', 'account_id'), subscriptions: await n('subscriptions', 'account_id') },
        notifications: await q('select kind, status, attempts, last_error_code from public.notification_operations where operation_id=$1', [opId]) };
    };
    const ONE = { accounts: 1, stores: 1, admins: 1, mappings: 1, subscriptions: 1 };
    async function scenario(title, fn) {
      resetWorld();
      await atomic(() => db.query('SAVEPOINT scenario'));
      const entry = { title };
      try { Object.assign(entry, await fn()); entry.status = 'PASS'; } catch (e) { entry.status = 'FAIL'; entry.error = String(e.message).replace(/\s+/g, ' ').slice(0, 400); if (e.observed) entry.observed = e.observed; }
      await chain; await atomic(() => db.query('ROLLBACK TO SAVEPOINT scenario'));   // each scenario starts from the same SCRATCH state
      report.scenarios.push(entry);
    }
    const check = async (fn, observe) => { try { await fn(); } catch (e) { e.observed = await observe(); throw e; } };

    await scenario('F-Q4-003: three webhook events and a status poll at once', async () => {
      const { op } = await paidOperation('a', 196116000);
      const results = await Promise.all([1, 2, 3, 4].map(() => prov.advanceOperation(op.id)));
      const e = await entities(op.id);
      await check(async () => {
        assert.deepEqual(results, ['provisioned', 'provisioned', 'provisioned', 'provisioned']);
        assert.equal(e.operation.status, 'provisioned'); assert.equal(e.operation.owner_was_existing, false); assert.deepEqual(e.counts, ONE);
        assert.equal(createCalls, 1);
        assert.deepEqual(e.notifications.map((x) => [x.kind, x.status, x.attempts]), [['access_link', 'sent', 1]]); assert.deepEqual(mailLog.map((m) => m.result), ['ok']);
      }, async () => ({ results, ...e, create_calls: createCalls, mail: mailLog.map((m) => m.result) }));
      return { results, ...e, create_calls: createCalls, mail: mailLog.map((m) => m.result) };
    });

    await scenario('F-Q4-003: the reconstructed DEV interleaving (second run starts after the identity is created)', async () => {
      const { op } = await paidOperation('b', 196117000);
      // Deterministic schedule (attempt 1 left the order to timing): run A is about to create the identity; run B starts
      // now, so any snapshot B takes predates the identity, and B's address lookup is held until A's create completes.
      // B's lookup is answered only once A has recorded the identity and reached the provisioning call, so that whatever
      // B writes lands between A's 'provisioning' write and the provisioning function, the order behind DEV 25acbfb9.
      let second = null, lookups = 0, bAtLookup, aAtProvision;
      const bReached = new Promise((r) => { bAtLookup = r; }), provisioning = new Promise((r) => { aAtProvision = r; });
      hooks.beforeCreateUser = async () => { if (second) return; second = prov.advanceOperation(op.id); await Promise.race([bReached, sleep(1500)]); };
      hooks.onLookup = async () => { if (++lookups === 2) { bAtLookup(); await provisioning; } };
      hooks.beforeProvision = async () => { aAtProvision(); await Promise.race([second, sleep(400)]); };
      const first = await prov.advanceOperation(op.id);
      const results = [first, await second];
      const e = await entities(op.id);
      await check(async () => { assert.deepEqual(results, ['provisioned', 'provisioned']); assert.equal(e.operation.status, 'provisioned'); assert.equal(e.operation.owner_was_existing, false); assert.deepEqual(e.counts, ONE); }, async () => ({ results, ...e }));
      return { results, ...e };
    });

    await scenario('AC-038: recovery of a row left by the race (DEV 25acbfb9 equivalent), twice', async () => {
      const { op } = await paidOperation('c', 196118000);
      const [sub] = [...P.subs.values()];
      await q("update public.checkout_operations set status='attention', last_error_code='not_paid', owner_user_id=$2, owner_was_existing=true, stripe_subscription_id=$3, stripe_invoice_id=$4 where id=$1", [op.id, SYNTH_USER, sub.id, sub.latest_invoice.id]);
      authUsers.push({ id: SYNTH_USER, email: 'eng.proof.r05.c@example.test', created_at: new Date(Date.now() + 1000).toISOString(), app_metadata: {} });   // created by the old code after the operation began; no marker
      await q("insert into public.notification_operations(kind, dedupe_key, operation_id, user_id, status, attempts, sent_at) values ('access_link', $1, $2, $3, 'sent', 1, now())", [`access:${op.id}`, op.id, SYNTH_USER]);
      const first = await operator.reconcileOne(op.id);
      const afterFirst = await entities(op.id);
      const again = await operator.reconcileOne(op.id);
      const e = await entities(op.id);
      await check(async () => {
        assert.equal(first.result, 'provisioned'); assert.equal(again.result, 'provisioned'); assert.deepEqual(afterFirst.counts, ONE); assert.deepEqual(e.counts, ONE);
        assert.equal(e.operation.owner_was_existing, false); assert.equal(e.operation.owner_is_synthetic_identity, true); assert.equal(createCalls, 0); assert.deepEqual(mailLog, []);
      }, async () => ({ first, again, ...e, create_calls: createCalls, mail: mailLog.length }));
      return { first: { result: first.result, before: first.before, after: first.after }, again: { result: again.result, before: again.before, after: again.after }, ...e, create_calls: createCalls, mails: mailLog.length };
    });

    await scenario('AC-038 protection: the same row whose identity existed before the operation is not recovered', async () => {
      const { op } = await paidOperation('d', 196119000);
      const [sub] = [...P.subs.values()];
      await q("update public.checkout_operations set status='attention', last_error_code='not_paid', owner_user_id=$2, owner_was_existing=true, stripe_subscription_id=$3, stripe_invoice_id=$4 where id=$1", [op.id, SYNTH_USER, sub.id, sub.latest_invoice.id]);
      authUsers.push({ id: SYNTH_USER, email: 'eng.proof.r05.d@example.test', created_at: '2026-01-01T00:00:00Z', app_metadata: {} });
      const r = await operator.reconcileOne(op.id);
      const e = await entities(op.id);
      await check(async () => { assert.equal(r.result, 'attention'); assert.equal(e.operation.last_error_code, 'owner_signin_required'); assert.equal(e.counts.accounts, 0); }, async () => ({ r, ...e }));
      return { result: r.result, ...e };
    });

    await scenario('F-Q4-004: a poll and a resend at the same moment send one link; the result stays sent', async () => {
      const { op } = await paidOperation('e', 196120000);
      await prov.advanceOperation(op.id);
      await q("update public.notification_operations set status='failed', last_error_code='429' where operation_id=$1", [op.id]);
      mailLog.length = 0;
      const [fresh] = await q('select * from public.checkout_operations where id=$1', [op.id]);
      // The real set_updated_at trigger stamps every update with now(), so the application clock is moved two minutes on
      // (past the 60-second resend interval) instead of back-dating the row. (Attempt 2 back-dated it: instrument fault.)
      const realNow = Date.now; Date.now = () => realNow() + 120000;
      let results; try { results = await Promise.all([prov.ensureAccessNotification(fresh, { resend: true }), prov.ensureAccessNotification(fresh, { resend: true })]); } finally { Date.now = realNow; }
      const e = await entities(op.id);
      await check(async () => { assert.deepEqual(mailLog.map((m) => m.result), ['ok']); assert.deepEqual(e.notifications.map((x) => [x.status, x.attempts]), [['sent', 2]]); }, async () => ({ results, mail: mailLog.map((m) => m.result), notifications: e.notifications }));
      return { results, mail: mailLog.map((m) => m.result), notifications: e.notifications };
    });

    await scenario('F-Q4-002: same-key retry after the draft is edited and re-quoted with the APA code', async () => {
      const npi = npiFrom(196121000);
      const pharmacy = { name: 'R05 Synthetic f', street: '1 Test Lane', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0178', npi, ncpdp: '', software: 'Liberty' };
      const saved = await reg.saveDraft(undefined, { owner: ownerOf('f'), pharmacy }, null);
      await reg.requestQuote(saved.newSecret, 'price_eng');
      const k = key('f');
      P.lose = { kind: 'session' };
      await assert.rejects(co.startCheckout(saved.newSecret, { consents, operationKey: k }, null));
      await reg.saveDraft(saved.newSecret, { owner: ownerOf('f'), pharmacy: { ...pharmacy, name: 'R05 Synthetic f East' } }, null);
      await reg.requestQuote(saved.newSecret, 'price_eng', 'APA10ENG');
      const { url } = await co.startCheckout(saved.newSecret, { consents, operationKey: k }, null);
      const ops = await q('select id, status, draft_revision, expected_total_cents, idempotency_key, stripe_customer_id, stripe_checkout_session_id from public.checkout_operations where draft_id=$1 order by draft_revision', [saved.draft.id]);
      const [draft] = await q('select revision, consent_revision, quote_total_cents, status from public.registration_drafts where id=$1', [saved.draft.id]);
      const res = await q('select status, operation_id from public.npi_reservations where draft_id=$1', [saved.draft.id]);
      const view = { operations: ops.map((o) => ({ status: o.status, revision: o.draft_revision, total: o.expected_total_cents, successor_key: o.idempotency_key !== k && o.idempotency_key.startsWith(k + '_n'), session_amount: o.stripe_checkout_session_id ? P.sessions.get(o.stripe_checkout_session_id).amount_total : null, session_status: o.stripe_checkout_session_id ? P.sessions.get(o.stripe_checkout_session_id).status : null })), draft, returned_url_is_current_session: ops.length > 1 && url === P.sessions.get(ops[1].stripe_checkout_session_id)?.url, reservations: res.map((r) => [r.status, r.operation_id === ops.at(-1).id]), customers: P.customers.size };
      await check(async () => {
        assert.equal(ops.length, 2); assert.equal(ops[0].status, 'expired_unpaid'); assert.equal(P.sessions.get(ops[0].stripe_checkout_session_id).status, 'expired');
        assert.equal(ops[1].status, 'checkout_open'); assert.equal(ops[1].expected_total_cents, 8910); assert.equal(P.sessions.get(ops[1].stripe_checkout_session_id).amount_total, 8910);
        assert.equal(url, P.sessions.get(ops[1].stripe_checkout_session_id).url); assert.equal(draft.consent_revision, draft.revision); assert.equal(P.customers.size, 1);
        assert.ok(res.some((r) => r.status === 'checkout_bound' && r.operation_id === ops[1].id));
      }, async () => view);
      return view;
    });
  } catch (e) { report.stop = String(e.message).slice(0, 300); throw e;
  } finally {
    await chain.catch(() => undefined);
    await db.query('ROLLBACK');
    report.rolled_back = true;
    report.engineering_rows_after_rollback = Number((await db.query("select count(*) n from public.registration_drafts where owner_email like 'eng.proof.r05.%@example.test'")).rows[0].n);   // outside any savepoint: the transaction is over
    await db.end();
    report.ran_at = new Date().toISOString();
    fs.writeFileSync(OUT, JSON.stringify(report, null, 1));
    console.log(JSON.stringify({ label: LABEL, scenarios: report.scenarios.map((s) => [s.status, s.title, s.error ? s.error.slice(0, 160) : undefined]), rolled_back: report.rolled_back, rows_left: report.engineering_rows_after_rollback, network_calls: report.network_calls }, null, 1));
  }
})().catch((e) => { console.error('STOP', e.message); process.exit(1); });
