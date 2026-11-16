// APBM007A r04 — engineering proof of the F-Q4-001 repair against real SCRATCH SQL (tables, unique indexes and the
// npi_reserve / npi_bind / npi_release_unpaid functions), inside ONE transaction that is always rolled back.
// The repaired portal modules (registration.ts, checkout.ts and their real dependencies) are transpiled from the tested
// disposable copy; only the database client is replaced by a pg adapter and Stripe by the same modelled provider as the
// unit suite. No network (fetch blocked), no Auth table read or write, synthetic example.test email, no live provider.
// The SCRATCH connection string is read in memory from the OwedBook env file and never printed or written.
const fs = require('fs'), vm = require('vm'), crypto = require('crypto'), assert = require('assert/strict');
const OB = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev';
const SRC = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r04/pp';
const OUT = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r04/proof/scratch_checkout_candidate_control.json';
const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
const env = require(OB + '/node_modules/dotenv').parse(fs.readFileSync(OB + '/.env.local'));
const { Client } = require(OB + '/node_modules/pg');
const ts = require(SRC + '/node_modules/typescript');
if (!String(env.APBM_SCRATCH_DB_URL || '').includes(SCRATCH_REF)) throw new Error('TARGET_NOT_SCRATCH');
const db = new Client({ connectionString: env.APBM_SCRATCH_DB_URL });
const report = { environment: `SCRATCH (${SCRATCH_REF}), single transaction, rolled back`, source: 'candidate checkout.ts 4cd96c8 swapped into the copy (control)', provider: 'modelled Stripe (same semantics as the unit suite)', scenarios: [], auth_reads: 0, auth_writes: 0, network_calls: 0 };

// ── pg adapter for the narrow query-builder surface the modules use ──
const TABLES = ['registration_drafts', 'checkout_operations', 'npi_reservations', 'accounts'];
const name = (x) => { if (!/^[a-z_][a-z0-9_]*$/.test(x)) throw new Error('SQL_NAME'); return '"' + x + '"'; };
let sp = 0;
function from(table) {
  if (!TABLES.includes(table)) throw new Error('TABLE_NOT_ALLOWED ' + table);
  let mode = 'select', cols = '*', payload = {}, order = '', limit = '';
  const where = [], args = [];
  const b = {
    select(c = '*') { cols = c; return b; }, insert(p) { mode = 'insert'; payload = p; return b; }, update(p) { mode = 'update'; payload = p; return b; },
    eq(k, v) { args.push(v); where.push(name(k) + '=$' + args.length); return b; },
    order(k, o) { order = ' ORDER BY ' + name(k) + (o && o.ascending ? ' ASC' : ' DESC'); return b; },
    limit(n) { limit = ' LIMIT ' + Number(n); return b; },
    maybeSingle() { return run(true); }, single() { return run(true); },
    then(ok, bad) { return run(false).then(ok, bad); },
  };
  async function run(single) {
    const sel = cols === '*' ? '*' : cols.split(',').map((c) => name(c.trim())).join(',');
    let sql, values = args;
    if (mode === 'select') sql = `SELECT ${sel} FROM public.${name(table)}${where.length ? ' WHERE ' + where.join(' AND ') : ''}${order}${limit}`;
    else if (mode === 'insert') {
      const keys = Object.keys(payload); values = Object.values(payload);
      sql = `INSERT INTO public.${name(table)}(${keys.map(name).join(',')}) VALUES(${keys.map((_, i) => '$' + (i + 1)).join(',')}) RETURNING ${sel}`;
    } else {
      if (!where.length) throw new Error('UNSCOPED_UPDATE');
      const keys = Object.keys(payload); values = [...args, ...Object.values(payload)];
      sql = `UPDATE public.${name(table)} SET ${keys.map((k, i) => name(k) + '=$' + (args.length + i + 1)).join(',')} WHERE ${where.join(' AND ')} RETURNING ${sel}`;
    }
    const s = 'eng' + (++sp);
    await db.query('SAVEPOINT ' + s);
    try {
      const r = await db.query(sql, values);
      await db.query('RELEASE SAVEPOINT ' + s);
      const rows = JSON.parse(JSON.stringify(r.rows));
      return { data: single ? rows[0] || null : rows, error: null };
    } catch (e) { await db.query('ROLLBACK TO SAVEPOINT ' + s); return { data: null, error: { code: e.code } }; }
  }
  return b;
}
const RPCS = ['npi_reserve', 'npi_bind', 'npi_release_unpaid'];
async function rpc(fn, a) {
  if (!RPCS.includes(fn)) throw new Error('RPC_NOT_ALLOWED ' + fn);
  if (fn === 'npi_reserve') return (await db.query('SELECT * FROM public.npi_reserve($1,$2)', [a.p_draft, a.p_npi])).rows;
  const keys = Object.keys(a);
  return (await db.query(`SELECT public.${name(fn)}(${keys.map((k, i) => name(k) + ' => $' + (i + 1)).join(',')}) AS v`, Object.values(a))).rows[0].v;
}

// ── modelled Stripe (same semantics as src/__tests__/apbm007a-checkout-recovery.test.ts) ──
const err = (type, message, param) => Object.assign(new Error(message), { type, param });
const P = { customers: new Map(), sessions: new Map(), keys: new Map(), lose: null, n: 0 };
const resetProvider = () => { P.customers.clear(); P.sessions.clear(); P.keys.clear(); P.lose = null; };
let clock = Date.now();
const nowS = () => Math.floor(clock / 1000);
async function idem(kind, key, params, make) {
  if (P.lose && P.lose.kind === kind && P.lose.when === 'before') { P.lose = null; throw err('StripeConnectionError', 'never reached'); }
  const fp = JSON.stringify(params), saved = P.keys.get(key);
  if (saved && saved.inFlight) throw err('StripeIdempotencyError', 'in progress');
  if (saved) { if (saved.params !== fp) throw err('StripeIdempotencyError', 'different parameters'); return { ...saved.result }; }
  const entry = { params: fp, inFlight: true }; P.keys.set(key, entry);
  await Promise.resolve();
  let result; try { result = make(); } catch (e) { P.keys.delete(key); throw e; }
  entry.result = { ...result }; entry.inFlight = false;
  if (P.lose && P.lose.kind === kind && P.lose.when === 'after') { P.lose = null; throw err('StripeConnectionError', 'answer lost'); }
  return { ...result };
}
const live = (id) => { const s = P.sessions.get(id); if (s && s.status === 'open' && nowS() >= s.expires_at) s.status = 'expired'; return s; };
const provider = {
  accounts: { retrieveCurrent: async () => ({ id: 'acct_eng' }) },
  customers: { create: (p, o) => idem('customer', o.idempotencyKey, p, () => { const c = { id: 'cus_E' + (++P.n), ...p }; P.customers.set(c.id, c); return c; }) },
  checkout: { sessions: {
    create: (p, o) => idem('session', o.idempotencyKey, p, () => {
      if (p.expires_at < nowS() + 1800 || p.expires_at > nowS() + 86400) throw err('StripeInvalidRequestError', 'expires_at', 'expires_at');
      const id = 'cs_test_E' + (++P.n);
      const s = { id, url: 'https://checkout.stripe.test/c/pay/' + id, status: 'open', payment_status: 'unpaid', amount_total: p.discounts ? 8910 : 9900, currency: 'usd', livemode: false, customer: p.customer, client_reference_id: p.client_reference_id, expires_at: p.expires_at };
      P.sessions.set(id, s); return s;
    }),
    retrieve: async (id) => ({ ...live(id) }),
    expire: async (id) => { const s = live(id); if (!s || s.status !== 'open') throw err('StripeInvalidRequestError', 'not open'); s.status = 'expired'; return { ...s }; },
  } },
};

// ── module loader: real portal modules from the tested copy, db stubbed ──
const cache = {};
const stubs = { '@/server/db': { admin: () => ({ from }), rpc: async (fn, a) => rpc(fn, a), bytea: (b) => '\\x' + b.toString('hex') } };
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
global.fetch = async () => { report.network_calls++; throw new Error('NETWORK_FORBIDDEN'); };
Object.assign(process.env, { STRIPE_SECRET_KEY: 'sk_test_eng_placeholder', STRIPE_PRICE_STORES: 'price_eng', STRIPE_PORTAL_CONFIGURATION: 'bpc_eng', STRIPE_EXPECTED_ACCOUNT: 'acct_eng', STRIPE_WEBHOOK_SECRET: 'whsec_eng', NEXT_PUBLIC_SUPABASE_URL: `https://${SCRATCH_REF}.supabase.co`, NEXT_PUBLIC_APP_ENV: 'local' });
const realNow = Date.now; Date.now = () => clock;

function npiFrom(seed) {   // check-digit-valid NPI (Luhn over 80840 + nine digits), synthetic range
  for (let n = seed; ; n++) {
    const nine = String(n).padStart(9, '0'); let sum = 0;
    [...('80840' + nine)].reverse().forEach((x, i) => { let d = +x; if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; } sum += d; });
    const check = (10 - (sum % 10)) % 10;
    return nine + check;
  }
}
const consents = { termsAccepted: true, recurringChargeAccepted: true, priceChangeAccepted: true };
const key = (t) => ('eng_r04_' + t + '_' + crypto.randomBytes(6).toString('hex')).slice(0, 60);
const opsFor = async (draftId) => (await db.query('SELECT id,status,draft_revision,stripe_customer_id,stripe_checkout_session_id,last_error_code FROM public.checkout_operations WHERE draft_id=$1 ORDER BY draft_revision, created_at, id'  /* one transaction: created_at is equal */, [draftId])).rows;
const reservationsFor = async (draftId) => (await db.query('SELECT status, operation_id FROM public.npi_reservations WHERE draft_id=$1 ORDER BY created_at', [draftId])).rows;

(async () => {
  await db.connect();
  const ident = (await db.query("select current_database() db, (select count(*) from public.checkout_operations) ops_before")).rows[0];
  report.target = { database: ident.db, project_ref_in_url: true, checkout_operations_before: Number(ident.ops_before) };
  await db.query('BEGIN');
  try {
    const reg = load('@/server/registration'), co = load('@/server/checkout');
    load('@/server/stripeClient').__setStripeForTests(provider, true);
    async function newDraft(label, seed) {
      const npi = npiFrom(seed);
      const saved = await reg.saveDraft(undefined, { owner: { firstName: 'Eng', lastName: 'Proof R04', email: `eng.proof.r04.${label}@example.test`, mobile: '(555) 010-0177', ownerDeclarationAccepted: true }, pharmacy: { name: 'R04 Synthetic ' + label, street: '1 Test Lane', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0178', npi, ncpdp: '', software: 'Liberty' } }, null);
      await reg.requestQuote(saved.newSecret, 'price_eng');
      return { secret: saved.newSecret, id: saved.draft.id, npi };
    }
    async function scenario(title, fn) {
      resetProvider();
      const entry = { title };
      try { Object.assign(entry, await fn()); entry.status = 'PASS'; } catch (e) { entry.status = 'FAIL'; entry.error = String(e.message).slice(0, 300); }
      report.scenarios.push(entry);
    }

    await scenario('lost session answer, then a retry with a different key: one customer, one session, one operation', async () => {
      const d = await newDraft('a', 197116000);
      P.lose = { kind: 'session', when: 'after' };
      await assert.rejects(co.startCheckout(d.secret, { consents, operationKey: key('a1') }, null), (e) => e.code === 'provider_unavailable');
      const afterLoss = await opsFor(d.id);
      clock += 7000;
      const { url } = await co.startCheckout(d.secret, { consents, operationKey: key('a2') }, null);
      const ops = await opsFor(d.id), res = await reservationsFor(d.id), [session] = [...P.sessions.values()];
      assert.equal(P.customers.size, 1); assert.equal(P.sessions.size, 1); assert.equal(ops.length, 1);
      assert.equal(ops[0].id, afterLoss[0].id); assert.equal(ops[0].status, 'checkout_open'); assert.equal(ops[0].stripe_checkout_session_id, session.id);
      assert.equal(url, session.url); assert.ok(!ops.some((o) => o.status === 'expired_unpaid'));
      assert.deepEqual(res.map((r) => [r.status, r.operation_id]), [['checkout_bound', ops[0].id]]);
      return { after_loss: afterLoss.map((o) => ({ status: o.status, customer_recorded: !!o.stripe_customer_id, session_recorded: !!o.stripe_checkout_session_id })), provider_counts: { customers: P.customers.size, sessions: P.sessions.size }, operations: ops.map((o) => ({ id: o.id, status: o.status, session: o.stripe_checkout_session_id })), reservations: res.map((r) => r.status) };
    });

    await scenario('same-key retry after a lost session answer, seconds later: original session returned', async () => {
      const d = await newDraft('b', 197117000);
      const k = key('b1');
      P.lose = { kind: 'session', when: 'after' };
      await assert.rejects(co.startCheckout(d.secret, { consents, operationKey: k }, null));
      clock += 9000;
      const { url } = await co.startCheckout(d.secret, { consents, operationKey: k }, null);
      const ops = await opsFor(d.id);
      assert.equal(P.customers.size, 1); assert.equal(P.sessions.size, 1); assert.equal(ops.length, 1); assert.equal(url, [...P.sessions.values()][0].url);
      return { provider_counts: { customers: P.customers.size, sessions: P.sessions.size }, operations: ops.map((o) => o.status) };
    });

    await scenario('lost session answer, draft edited, different key: earlier attempt settled with Stripe, same customer, one open operation', async () => {
      const d = await newDraft('c', 197118000);
      P.lose = { kind: 'session', when: 'after' };
      await assert.rejects(co.startCheckout(d.secret, { consents, operationKey: key('c1') }, null));
      clock += 60000;
      await reg.saveDraft(d.secret, { owner: { firstName: 'Eng', lastName: 'Proof R04', email: 'eng.proof.r04.c@example.test', mobile: '(555) 010-0177', ownerDeclarationAccepted: true }, pharmacy: { name: 'R04 Synthetic c East', street: '1 Test Lane', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0178', npi: d.npi, ncpdp: '', software: 'Liberty' } }, null);
      await reg.requestQuote(d.secret, 'price_eng');
      await co.startCheckout(d.secret, { consents, operationKey: key('c2') }, null);
      const ops = await opsFor(d.id), res = await reservationsFor(d.id);
      assert.equal(ops.length, 2); assert.equal(ops[0].status, 'expired_unpaid'); assert.ok(ops[0].stripe_checkout_session_id);
      assert.equal(P.sessions.get(ops[0].stripe_checkout_session_id).status, 'expired');
      assert.equal(ops[1].status, 'checkout_open'); assert.equal(ops[1].draft_revision, 2); assert.equal(ops[1].stripe_customer_id, ops[0].stripe_customer_id);
      assert.equal(P.customers.size, 1); assert.equal(P.sessions.size, 2);
      assert.equal(ops.filter((o) => ['created', 'checkout_open'].includes(o.status)).length, 1);
      assert.ok(res.some((r) => r.status === 'checkout_bound' && r.operation_id === ops[1].id));
      return { provider_counts: { customers: P.customers.size, sessions: P.sessions.size }, operations: ops.map((o) => ({ status: o.status, revision: o.draft_revision, session_recorded: !!o.stripe_checkout_session_id })), reservations: res.map((r) => r.status) };
    });

    await scenario('no recorded session: proveUnpaidAndRelease keeps the operation and its reservation', async () => {
      const d = await newDraft('d', 197119000);
      P.lose = { kind: 'session', when: 'after' };
      await assert.rejects(co.startCheckout(d.secret, { consents, operationKey: key('d1') }, null));
      const [op] = await opsFor(d.id);
      clock += 3 * 3600 * 1000;
      assert.equal(await co.proveUnpaidAndRelease(op.id), 'kept');
      const after = await opsFor(d.id);
      assert.equal(after[0].status, 'created');
      return { operations: after.map((o) => o.status) };
    });
  } finally {
    await db.query('ROLLBACK');
    report.rolled_back = true;
    const left = (await db.query("select count(*) n from public.registration_drafts where owner_email like 'eng.proof.r04.%@example.test'")).rows[0].n;
    report.engineering_rows_after_rollback = Number(left);
    await db.end();
    Date.now = realNow;
    report.ran_at = new Date().toISOString();
    fs.writeFileSync(OUT, JSON.stringify(report, null, 1));
    console.log(JSON.stringify({ scenarios: report.scenarios.map((s) => [s.status, s.title, s.error]), rolled_back: report.rolled_back, rows_left: report.engineering_rows_after_rollback, network_calls: report.network_calls }, null, 1));
  }
})().catch((e) => { console.error('STOP', e.message); process.exit(1); });
