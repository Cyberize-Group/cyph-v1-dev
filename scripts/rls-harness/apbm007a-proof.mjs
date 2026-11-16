#!/usr/bin/env node
// APBM007A database proof on confirmed SCRATCH: handoff codes, NPI reservation, provisioning, mirror, grace, access state.
// Service-role RPC for the service-only functions, real user sessions where a real session row is required.
// Runs after the synthetic seed. Creates its own labelled rows and identities; never targets DEV.
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { loadEnv, assertScratch, evidencePath } from './lib/env.mjs';
import { anonClient, serviceClient, pgClient } from './lib/db.mjs';

const env = loadEnv(); assertScratch(env);
const privatePath = process.env.APBM_CREDENTIAL_FILE;
if (!privatePath || !privatePath.startsWith('/tmp/') || lstatSync(privatePath).isSymbolicLink() || (lstatSync(privatePath).mode & 0o077)) throw new Error('private 0600 cast credentials required');
const credentials = JSON.parse(readFileSync(privatePath)); assert.equal(credentials.projectRef, env.projectRef);
const m = JSON.parse(readFileSync(evidencePath('seed-map.json')));
const svc = serviceClient(env); const db = await pgClient(env); const checks = [];
const check = (name, condition) => { assert.ok(condition, name); checks.push({ name, status: 'PASS' }); };
const b64u = buf => buf.toString('base64url'); const sha = v => createHash('sha256').update(v).digest();
const hex = buf => '\\x' + buf.toString('hex');
const rpc = async (fn, args) => { const r = await svc.rpc(fn, args); if (r.error) throw Object.assign(new Error(`${fn}: ${r.error.code} ${r.error.message}`), { code: r.error.code }); return r.data; };
const claimsOf = jwt => JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
const login = async who => { const c = anonClient(env); const id = credentials.identities[who]; const r = await c.auth.signInWithPassword({ email: id.email, password: id.password }); assert.equal(r.error, null, `login ${who}`); const cl = claimsOf(r.data.session.access_token); return { client: c, jwt: r.data.session.access_token, user: cl.sub, session: cl.session_id }; };
const RUN = 'apbm007a-proof-' + Date.now(); const madeUsers = [];

// A code as the destination and the source would build it.
const newCode = () => { const code = b64u(randomBytes(32)), state = b64u(randomBytes(32)), verifier = b64u(randomBytes(32)); return { code, state, verifier, codeHash: hex(sha(code)), stateHash: hex(sha(state)), challenge: b64u(sha(verifier)) }; };
const issue = (s, k, over = {}) => rpc('handoff_issue', { p_user: s.user, p_session: s.session, p_source: 'ob', p_dest: 'pp', p_env: 'local', p_challenge: k.challenge, p_state_hash: k.stateHash, p_return: '/dashboard', p_code_hash: k.codeHash, p_attempt: 1, ...over });
const claim = async (k, over = {}) => (await rpc('handoff_claim', { p_code_hash: k.codeHash, p_verifier: k.verifier, p_state_hash: k.stateHash, p_dest: 'pp', p_env: 'local', ...over }))[0];

try {
  // ───────────────────────── 1. Handoff ─────────────────────────
  const a = await login('OWNER3');
  let k = newCode(); check('handoff issue for a live source session', await issue(a, k) === 'issued');
  const stored = (await db.query('select code_hash, challenge, expires_at - created_at ttl from handoff.codes order by created_at desc limit 1')).rows[0];
  check('only the hash of the code is stored', Buffer.compare(stored.code_hash, sha(k.code)) === 0 && !JSON.stringify(stored).includes(k.code));
  check('code lifetime is 60 seconds', stored.ttl.seconds === 60 || (stored.ttl.minutes === 1 && !stored.ttl.seconds));
  for (const [label, over] of [['wrong verifier', { p_verifier: b64u(randomBytes(32)) }], ['wrong state', { p_state_hash: hex(sha('other')) }], ['wrong audience', { p_dest: 'ob' }], ['wrong environment', { p_env: 'staging' }]]) {
    check(`${label} is rejected`, (await claim(k, over)).outcome === 'rejected');
  }
  const won = await claim(k);
  check('correct caller still claims after four bad bindings (code was not consumed)', won.outcome === 'claimed' && won.user_id === a.user && won.return_path === '/dashboard' && won.attempt === 1);
  check('a claimed code cannot be claimed again', (await claim(k)).outcome === 'rejected');
  check('completion succeeds once', await rpc('handoff_complete', { p_claim_id: won.claim_id, p_dest_session: randomUUID() }) === 'ok');
  check('completion cannot repeat', await rpc('handoff_complete', { p_claim_id: won.claim_id, p_dest_session: randomUUID() }) === 'revoked');

  k = newCode(); await issue(a, k);
  const race = await Promise.all(Array.from({ length: 6 }, () => claim(k)));
  check('six concurrent correct claims: exactly one wins', race.filter(r => r.outcome === 'claimed').length === 1 && race.filter(r => r.outcome === 'rejected').length === 5);

  k = newCode(); await issue(a, k); await db.query("update handoff.codes set expires_at = now() - interval '1 second' where code_hash = $1", [sha(k.code)]);
  check('an expired code is rejected', (await claim(k)).outcome === 'rejected');

  for (const bad of ['//evil.example', '/a//b', 'https://evil.example', '/a?b=1', '/a\\b', '/%2f%2fevil']) {
    let code; try { await issue(a, newCode(), { p_return: bad }); } catch (e) { code = e.code; }
    check(`return path ${JSON.stringify(bad)} cannot be stored`, code === '23514');
  }
  let sameApp; try { await issue(a, newCode(), { p_dest: 'ob' }); } catch (e) { sameApp = e.code; }
  check('source and destination must differ', sameApp === '23514');
  check('issue refuses a session that does not exist', await issue({ user: a.user, session: randomUUID() }, newCode()) === 'source_signed_out');
  const other = await login('MEMBER_B1');
  check("issue refuses another user's session", await issue({ user: a.user, session: other.session }, newCode()) === 'source_signed_out');

  // logout before the claim
  k = newCode(); await issue(a, k);
  check('logout invalidates pending codes', await rpc('handoff_invalidate_user', { p_user: a.user }) >= 1);
  check('a code invalidated by logout is rejected', (await claim(k)).outcome === 'rejected');
  // logout after the claim, before completion
  k = newCode(); await issue(a, k); let c2 = await claim(k); assert.equal(c2.outcome, 'claimed');
  await rpc('handoff_invalidate_user', { p_user: a.user });
  check('logout after claim: completion is revoked', await rpc('handoff_complete', { p_claim_id: c2.claim_id, p_dest_session: randomUUID() }) === 'revoked');
  // a failed claim never becomes usable
  k = newCode(); await issue(a, k); c2 = await claim(k); await rpc('handoff_fail', { p_claim_id: c2.claim_id, p_reason: 'mint_failed' });
  check('a failed claim cannot complete', await rpc('handoff_complete', { p_claim_id: c2.claim_id, p_dest_session: randomUUID() }) === 'revoked');
  check('a failed claim cannot be claimed again', (await claim(k)).outcome === 'rejected');

  // FC-2: per-session revocation. Two sessions of one user; revoke one; the other must stay valid.
  const s1 = await login('ADMIN_B2'), s2 = await login('ADMIN_B2');
  check('two logins give two sessions', s1.session !== s2.session);
  const local = await svc.auth.admin.signOut(s1.jwt, 'local');
  check('per-session sign-out call accepted', !local.error);
  const g1 = await anonClient(env).auth.getUser(s1.jwt), g2 = await anonClient(env).auth.getUser(s2.jwt);
  check('the revoked session is rejected by getUser', !!g1.error);
  check('the other session of the same user stays valid', !g2.error && g2.data.user.id === s2.user);
  const rows = (await db.query('select id from auth.sessions where user_id = $1', [s2.user])).rows.map(r => r.id);
  check('auth.sessions lost exactly the revoked session', !rows.includes(s1.session) && rows.includes(s2.session));

  // source session ended elsewhere (provider sign-out without our function): claim and completion both fail on auth.sessions
  const src = await login('ADMIN_B3'); k = newCode(); await issue(src, k); const k2 = newCode(); await issue(src, k2); const cl = await claim(k2); assert.equal(cl.outcome, 'claimed');
  await svc.auth.admin.signOut(src.jwt, 'global');
  check('source signed out elsewhere: unclaimed code is rejected', (await claim(k)).outcome === 'rejected');
  check('source signed out elsewhere: claimed code cannot complete', await rpc('handoff_complete', { p_claim_id: cl.claim_id, p_dest_session: randomUUID() }) === 'revoked');

  // per-user issue limit: 10 in 60 seconds
  const lim = await login('MEMBER_B2B3'); const outcomes = [];
  for (let i = 0; i < 11; i++) outcomes.push(await issue(lim, newCode()));
  check('eleventh issue inside a minute is refused', outcomes.slice(0, 10).every(o => o === 'issued') && outcomes[10] === 'slow_down');

  // retention never removes a live row and is bounded
  await db.query("update handoff.codes set created_at = now() - interval '25 hours', expires_at = now() - interval '25 hours' + interval '60 seconds' where invalidated_at is not null or completed_at is not null");
  const before = (await db.query('select count(*)::int n from handoff.codes')).rows[0].n; k = newCode(); await issue(a, k);
  const after = (await db.query("select count(*)::int n, count(*) filter (where created_at < now() - interval '24 hours')::int old from handoff.codes")).rows[0];
  check('old finished rows are removed opportunistically on issue', after.old === 0 && after.n < before + 1);
  check('the row just issued is still claimable after retention ran', (await claim(k)).outcome === 'claimed');

  // ───────────────────────── 2. NPI reservation ─────────────────────────
  const NPI = ['1234567893', '1245319599', '1679576722', '1003000126'];
  const draft = async (over = {}) => (await svc.from('registration_drafts').insert({ secret_hash: hex(sha(randomBytes(32))), pharmacy_name: `${RUN} store`, owner_email: `${RUN}@example.invalid`.toLowerCase(), owner_first_name: 'Synthetic', owner_last_name: 'Owner', address: '1 Test St', city: 'Testville', state: 'AL', zip: '35004', ...over }).select('id').single()).data.id;
  const reserve = async (d, npi) => (await rpc('npi_reserve', { p_draft: d, p_npi: npi }))[0];
  const drafts = []; for (let i = 0; i < 6; i++) drafts.push(await draft());
  check('wrong-length NPI is invalid', (await reserve(drafts[0], '123456789')).outcome === 'invalid');
  check('wrong check digit is invalid', (await reserve(drafts[0], '1234567890')).outcome === 'invalid');
  const raceR = await Promise.all(drafts.map(d => reserve(d, NPI[0])));
  check('six registrants racing for one NPI: exactly one holds it', raceR.filter(r => r.outcome === 'held').length === 1 && raceR.filter(r => r.outcome === 'unavailable').length === 5);
  const holder = drafts[raceR.findIndex(r => r.outcome === 'held')], loser = drafts.find(d => d !== holder);
  check('the holder re-reserving keeps its hold', (await reserve(holder, NPI[0])).outcome === 'held');
  await db.query("update public.npi_reservations set expires_at = now() - interval '1 minute' where draft_id = $1 and status = 'held'", [holder]);
  const taken = await reserve(loser, NPI[0]);
  check('an expired unbound hold frees lazily for the next registrant', taken.outcome === 'held');
  check('the expired hold is recorded as released, not deleted', (await db.query("select status from public.npi_reservations where draft_id = $1", [holder])).rows[0].status === 'released');
  check('changing NPI lets go of the earlier hold', (await reserve(loser, NPI[1])).outcome === 'held' && (await db.query("select count(*)::int n from public.npi_reservations where draft_id = $1 and status = 'held'", [loser])).rows[0].n === 1);

  const mkOp = async (d, npi, over = {}) => { await svc.from('registration_drafts').update({ npi }).eq('id', d); const r = await svc.from('checkout_operations').insert({ idempotency_key: `${RUN}-${randomBytes(8).toString('hex')}`, draft_id: d, draft_revision: 1, npi, expected_total_cents: 9900, expected_currency: 'usd', expected_price_id: 'price_proof', status: 'checkout_open', ...over }).select('id').single(); assert.equal(r.error, null, r.error?.message); return r.data.id; };
  const opA = await mkOp(loser, NPI[1]);
  check('a second unresolved operation for the same draft is refused', (await svc.from('checkout_operations').insert({ idempotency_key: `${RUN}-second-key-000000`, draft_id: loser, draft_revision: 1, npi: NPI[1], expected_total_cents: 9900, expected_currency: 'usd', expected_price_id: 'price_proof' })).error?.code === '23505');
  check('hold binds to its checkout operation', await rpc('npi_bind', { p_draft: loser, p_operation: opA, p_checkout_expires: new Date(Date.now() + 30 * 60000).toISOString() }) === 'bound');
  const third = drafts.find(d => d !== holder && d !== loser);
  check('a bound NPI is unavailable to others', (await reserve(third, NPI[1])).outcome === 'unavailable');
  await db.query("update public.npi_reservations set expires_at = now() - interval '1 minute' where operation_id = $1", [opA]);
  const proof = await reserve(third, NPI[1]);
  check('an expired bound reservation is NOT freed by time: proof is demanded', proof.outcome === 'needs_proof' && proof.blocking_operation_id === opA);
  check('release is refused while the checkout is not proven unpaid', await rpc('npi_release_unpaid', { p_operation: opA }) === 'not_proven_unpaid');
  await svc.from('checkout_operations').update({ status: 'paid' }).eq('id', opA);
  check('a paid operation never releases its reservation', await rpc('npi_release_unpaid', { p_operation: opA }) === 'not_proven_unpaid' && (await reserve(third, NPI[1])).outcome === 'needs_proof');
  await svc.from('checkout_operations').update({ status: 'expired_unpaid' }).eq('id', opA);
  check('proof of an unpaid expired checkout releases it', await rpc('npi_release_unpaid', { p_operation: opA }) === 'released');
  check('the NPI is then available', (await reserve(third, NPI[1])).outcome === 'held');

  // ───────────────────────── 3. Provisioning ─────────────────────────
  const newOwner = async tag => { const r = await svc.auth.admin.createUser({ email: `${RUN}-${tag}@example.invalid`, email_confirm: true }); assert.equal(r.error, null, r.error?.message); madeUsers.push(r.data.user.id); return r.data.user.id; };
  const paidOp = async (npi, tag) => { const d = await draft({ pharmacy_name: `${RUN} ${tag}` }); assert.equal((await reserve(d, npi)).outcome, 'held'); const cus = `cus_${tag}${Date.now()}`, sub = `sub_${tag}${Date.now()}`; const op = await mkOp(d, npi, { status: 'paid', stripe_customer_id: cus, stripe_subscription_id: sub, stripe_checkout_session_id: `cs_test_${tag}${Date.now()}` }); assert.equal(await rpc('npi_bind', { p_draft: d, p_operation: op, p_checkout_expires: new Date(Date.now() + 1800000).toISOString() }), 'bound'); return { d, op, cus, sub }; };
  const subJson = (x, over = {}) => ({ customer_id: x.cus, subscription_id: x.sub, status: 'active', raw_status: 'active', quantity: 1, price_id: 'price_proof', item_id: 'si_proof', current_period_start: '2026-11-12T00:00:00Z', current_period_end: '2026-12-12T00:00:00Z', cancel_at_period_end: false, cancel_at: null, latest_invoice_id: 'in_proof1', latest_invoice_status: 'paid', verified_at: '2026-11-12T00:00:10Z', policy_version: 'access-v1', ...over });
  const counts = async () => (await db.query("select (select count(*) from public.accounts)::int a,(select count(*) from public.businesses)::int b,(select count(*) from public.user_businesses)::int ub,(select count(*) from public.subscriptions)::int s,(select count(*) from public.billing_customers)::int bc")).rows[0];
  const owner = await newOwner('owner'); const x = await paidOp(NPI[2], 'one'); const c0 = await counts();
  check('provisioning refuses a mismatched customer/subscription mapping', (await rpc('provision_paid_registration', { p_operation: x.op, p_owner_user: owner, p_sub: subJson(x, { customer_id: 'cus_other' }) })).outcome === 'mapping_mismatch');
  check('provisioning refuses a missing owner identity', (await rpc('provision_paid_registration', { p_operation: x.op, p_owner_user: randomUUID(), p_sub: subJson(x) })).outcome === 'owner_missing');
  check('refused provisioning wrote nothing', JSON.stringify(await counts()) === JSON.stringify(c0));
  const three = await Promise.all([1, 2, 3].map(() => rpc('provision_paid_registration', { p_operation: x.op, p_owner_user: owner, p_sub: subJson(x) })));
  check('three concurrent provisioning calls: one creates, the rest find it done', three.filter(r => r.outcome === 'provisioned').length === 1 && three.filter(r => r.outcome === 'already_provisioned').length === 2);
  const c1 = await counts();
  check('exactly one account, store, admin membership, mapping and subscription were created', c1.a === c0.a + 1 && c1.b === c0.b + 1 && c1.ub === c0.ub + 1 && c1.s === c0.s + 1 && c1.bc === c0.bc + 1);
  const made = three.find(r => r.outcome === 'provisioned');
  const facts = (await db.query(`select a.owner_user_id, b.npi, b.status, b.ncpdp, ub.role, ub.user_id, s.origin, s.status sub_status, s.quantity, bc.stripe_customer_id,
     (select role::text from public.user_roles where user_id = a.owner_user_id) platform_role,
     (select status from public.npi_reservations where operation_id = $2) reservation, (select status from public.checkout_operations where id = $2) op_status
     from public.accounts a join public.businesses b on b.account_id = a.id join public.user_businesses ub on ub.business_id = b.id
     join public.subscriptions s on s.account_id = a.id join public.billing_customers bc on bc.account_id = a.id where a.id = $1`, [made.account_id, x.op])).rows;
  check('provisioned facts are exact', facts.length === 1 && facts[0].owner_user_id === owner && facts[0].npi === NPI[2] && facts[0].status === 'active' && facts[0].ncpdp === null && facts[0].role === 'admin' && facts[0].user_id === owner && facts[0].origin === 'stripe' && facts[0].sub_status === 'active' && facts[0].quantity === 1 && facts[0].stripe_customer_id === x.cus && facts[0].reservation === 'consumed' && facts[0].op_status === 'provisioned');
  check("the new owner's platform role stays member", facts[0].platform_role === 'member');
  const again = await rpc('provision_paid_registration', { p_operation: x.op, p_owner_user: owner, p_sub: subJson(x) });
  check('repeating provisioning is a no-op with the same identifiers', again.outcome === 'already_provisioned' && again.account_id === made.account_id && JSON.stringify(await counts()) === JSON.stringify(c1));
  const y = await paidOp(NPI[3], 'two');
  check('an owner who already has an account cannot be given a second one', (await rpc('provision_paid_registration', { p_operation: y.op, p_owner_user: owner, p_sub: subJson(y) })).outcome === 'owner_has_account' && JSON.stringify(await counts()) === JSON.stringify(c1));
  check('a registered NPI is unavailable to a new draft', (await reserve(await draft(), NPI[2])).outcome === 'unavailable');
  let dup; try { await db.query('BEGIN'); await db.query("insert into public.businesses(account_id, npi, pharmacy_name) values ($1,$2,'dup')", [made.account_id, NPI[2]]); } catch (e) { dup = e.code; } finally { await db.query('ROLLBACK'); }
  check('a second store with the same NPI is refused by the unique index', dup === '23505');
  let unpaid = await mkOp(await draft(), '1881697407'); // never reserved, never paid
  check('an unpaid operation cannot be provisioned', (await rpc('provision_paid_registration', { p_operation: unpaid, p_owner_user: await newOwner('unpaid'), p_sub: subJson({ cus: null, sub: null }) })).outcome === 'not_paid');
  await db.query('BEGIN'); await db.query("update public.businesses set pharmacy_name = pharmacy_name where id = $1", [m.businesses.A1]); await db.query("update public.businesses set status = status where id = any($1)", [Object.values(m.businesses)]); await db.query('ROLLBACK');
  check('the five legacy fixture stores remain updatable by trusted SQL (no CHECK on their NPI)', true);

  // ───────────────────────── 4. Mirror, grace and access state ─────────────────────────
  const apply = (p, at) => rpc('subscription_mirror_apply', { p_stripe_subscription_id: x.sub, p: subJson(x, p), p_verified_at: at });
  const state = async () => rpc('account_access_state', { p_account: made.account_id });
  check('a newer read is applied', await apply({ cancel_at: '2026-12-12T00:00:00Z' }, '2026-11-12T01:00:00Z') === 'applied');
  check('portal-style cancellation (cancel_at only) reads as scheduled', (await state()).cancel_scheduled === true && (await state()).state === 'active');
  check('an older read cannot overwrite a newer one', await apply({ cancel_at: null }, '2026-11-12T00:30:00Z') === 'stale' && (await state()).cancel_scheduled === true);
  check('undo clears the schedule', await apply({ cancel_at: null, cancel_at_period_end: false }, '2026-11-12T02:00:00Z') === 'applied' && (await state()).cancel_scheduled === false);
  check('an unknown subscription is reported, not created', await rpc('subscription_mirror_apply', { p_stripe_subscription_id: 'sub_unknown', p: subJson(x), p_verified_at: '2026-11-12T02:00:00Z' }) === 'unknown_subscription');
  const fail = at => rpc('subscription_grace_start', { p_stripe_subscription_id: x.sub, p_invoice: 'in_renew1', p_failed_at: at });
  await apply({ status: 'past_due', raw_status: 'past_due', latest_invoice_id: 'in_renew1', latest_invoice_status: 'open' }, '2026-11-12T03:00:00Z');
  check('first renewal failure starts grace', await fail(new Date().toISOString()) === 'started' && (await state()).state === 'grace' && (await state()).read_only === false);
  const g0 = (await db.query('select grace_started_at from public.subscriptions where stripe_subscription_id = $1', [x.sub])).rows[0].grace_started_at;
  check("Stripe's retry of the same invoice does not restart the clock", await fail(new Date(Date.now() + 3 * 86400000).toISOString()) === 'unchanged' && +(await db.query('select grace_started_at from public.subscriptions where stripe_subscription_id = $1', [x.sub])).rows[0].grace_started_at === +g0);
  await db.query("update public.subscriptions set grace_started_at = now() - interval '7 days 1 minute' where stripe_subscription_id = $1", [x.sub]);
  check('after seven days the state is read-only, computed from server time', (await state()).state === 'read_only' && (await state()).read_only === true);
  check('payment of a different invoice does not clear the delinquency', await rpc('subscription_grace_clear', { p_stripe_subscription_id: x.sub, p_invoice: 'in_other' }) === 'unchanged');
  check('payment of the failed invoice clears it', await rpc('subscription_grace_clear', { p_stripe_subscription_id: x.sub, p_invoice: 'in_renew1' }) === 'cleared');
  await apply({ status: 'active', raw_status: 'active', latest_invoice_id: 'in_renew1', latest_invoice_status: 'paid' }, '2026-11-12T04:00:00Z');
  check('access returns to active after recovery', (await state()).state === 'active');
  check('a late failure event for the paid invoice does not reopen grace', await fail(new Date().toISOString()) === 'unchanged' && (await state()).state === 'active');
  check('ending the subscription gives the retained read-only state', await apply({ status: 'canceled', raw_status: 'canceled' }, '2026-11-12T05:00:00Z') === 'applied' && (await state()).state === 'ended' && (await state()).read_only === true);
  check('a stale active event cannot revive an ended subscription', await apply({ status: 'active', raw_status: 'active' }, '2026-11-12T06:00:00Z') === 'stale' && (await state()).state === 'ended');
  const synth = await rpc('account_access_state', { p_account: m.accounts.C });
  check('the synthetic past-due fixture shows a reminder with no grace clock', synth.state === 'past_due_reminder' && synth.origin === 'synthetic_seed' && synth.read_only === false && synth.grace_ends_at === null);
  let badRow; try { await db.query('BEGIN'); await db.query("insert into public.subscriptions(account_id, status) values ($1,'canceled')", [m.accounts.A]); } catch (e) { badRow = e.code; } finally { await db.query('ROLLBACK'); }
  check("a 'stripe' subscription row without Stripe identifiers is refused", badRow === '23514');
  let second; try { await db.query('BEGIN'); await db.query("insert into public.subscriptions(account_id, status, origin) values ($1,'active','synthetic_seed')", [m.accounts.A]); } catch (e) { second = e.code; } finally { await db.query('ROLLBACK'); }
  check('a second current subscription for one account is refused', second === '23505');

  writeFileSync(evidencePath('apbm007a-db-proof.json'), JSON.stringify({ status: 'PASS', projectRef: env.projectRef, run: RUN, checks }, null, 2) + '\n');
  console.log(`${checks.length} APBM007A database checks PASS`);
} catch (e) {
  writeFileSync(evidencePath('apbm007a-db-proof.json'), JSON.stringify({ status: 'FAIL', completed: checks, error: e.code || e.message }, null, 2) + '\n'); throw e;
} finally { await db.query('ROLLBACK').catch(() => {}); await db.end(); }
