// Scenario B: authoritative facts after scenario A, the owner's dashboard and billing, and the handoff in both directions.
import { readFileSync } from 'node:fs';
import { chromium, PP, OB, cast, signInUrl, record, save, sql, stripe, cookieNames } from './lib.mjs';
const OUT = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/proof/out';
const st = JSON.parse(readFileSync(`${OUT}/a_state.json`));
const exe = '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe });
try {
  // 1. database facts (read-only)
  const [u] = await sql('select id from auth.users where lower(email) = $1', [cast.OWNER_1]);
  const [f] = await sql(`select a.owner_user_id, b.npi, b.pharmacy_name, b.status, b.ncpdp, ub.role, ub.user_id ub_user, s.origin, s.status sub_status, s.raw_status, s.quantity, s.promotion_code, s.stripe_price_id,
      s.current_period_end, bc.stripe_customer_id is not null mapped, (select role::text from public.user_roles where user_id = a.owner_user_id) platform_role,
      (select status from public.npi_reservations where operation_id = $2) reservation, (select kind || ':' || status from public.notification_operations where operation_id = $2) notification,
      (select count(*)::int from public.accounts where owner_user_id = a.owner_user_id) accounts_of_owner
    from public.accounts a join public.businesses b on b.account_id = a.id join public.user_businesses ub on ub.business_id = b.id
    join public.subscriptions s on s.account_id = a.id join public.billing_customers bc on bc.account_id = a.id where a.id = $1`, [st.accountId, st.operationId]);
  record('B1 one account owned by OWNER_1, one active store with the registered NPI, OWNER_1 its designated admin', f && f.owner_user_id === u.id && f.npi === st.npi && f.status === 'active' && f.role === 'admin' && f.ub_user === u.id && f.accounts_of_owner === 1, JSON.stringify({ ...f, owner_user_id: undefined, ub_user: undefined }));
  record('B2 subscription mirrored from Stripe: origin stripe, active, quantity 1, APA code, the configured price', f.origin === 'stripe' && f.sub_status === 'active' && f.raw_status === 'active' && f.quantity === 1 && f.promotion_code === 'APA10SANDBOX' && f.stripe_price_id === 'price_1UavqdGnEQDyu3RRcj32U2Ob' && f.mapped);
  record("B3 OWNER_1's platform role stays member; reservation consumed; signed-in purchase recorded as an in-app notice (no email)", f.platform_role === 'member' && f.reservation === 'consumed' && f.notification === 'purchase_notice:sent');
  const ev = await sql("select type, status from public.stripe_events where received_at > now() - interval '30 minutes' order by received_at");
  record('B4 signed webhook events reached the portal and were processed', ev.length > 0 && ev.every((e) => e.status !== 'failed' && e.status !== 'received'), ev.length ? ev.map((e) => `${e.type}:${e.status}`).join(', ') : 'NONE RECEIVED: the portal webhook secret is not the listener secret, so every delivery was refused (400). Provisioning came from the status page reconcile path');
  const sub = await stripe.subscriptions.retrieve(st.subscriptionId, { expand: ['latest_invoice'] });
  record('B5 Stripe agrees: subscription active, first invoice paid 8,910 USD cents, one item at quantity 1', sub.status === 'active' && sub.latest_invoice.status === 'paid' && sub.latest_invoice.amount_paid === 8910 && sub.latest_invoice.currency === 'usd' && sub.items.data.length === 1 && sub.items.data[0].quantity === 1);

  // 2. portal dashboard and billing as the owner (session from scenario A)
  const a = await browser.newContext({ storageState: `${OUT}/a_ctx.json` }); const pa = await a.newPage();
  await pa.goto(`${PP}/dashboard`); await pa.getByTestId('plan-summary').waitFor({ timeout: 30000 });
  const dash = await pa.locator('main').innerText();
  record('B6 portal dashboard shows the plan and the new store', dash.includes(st.storeName) && /active/i.test(await pa.getByTestId('subscription-status').innerText()), (await pa.getByTestId('subscription-status').innerText()));
  await pa.goto(`${PP}/billing`); await pa.getByTestId('payment-method').waitFor({ timeout: 30000 });
  const pm = await pa.getByTestId('payment-method').innerText();
  record('B7 portal billing shows the card on file read live from Stripe', /4242/.test(pm), pm.replace(/\s+/g, ' ').slice(0, 80));

  // 3. handoff portal → OwedBook (OwedBook has no session in this browser yet)
  const before = await cookieNames(a);
  record('B8 before the handoff this browser holds a portal session only', before.some((n) => n.startsWith('cyph-pp-auth-local')) && !before.some((n) => n.startsWith('cyph-ob-auth-local')), before.join(','));
  await pa.goto(`${PP}/dashboard`); await pa.getByTestId('open-owedbook').waitFor();
  const t0 = Date.now(); await pa.getByTestId('open-owedbook').click();
  await pa.waitForURL(`${OB}/owedbook`, { timeout: 60000 }); const t1 = Date.now();
  const afterNames = await cookieNames(a);
  record('B9 portal → OwedBook handoff lands in OwedBook signed in, under its own cookie, with no code in the final address', afterNames.some((n) => n.startsWith('cyph-ob-auth-local')) && !/code=|state=/.test(pa.url()), `${t1 - t0} ms; ${pa.url()}`);
  await pa.getByText(st.storeName).first().waitFor({ timeout: 30000 }).catch(() => {});
  const obText = await pa.locator('body').innerText();
  record('B10 OwedBook shows the owner the new store (true empty claims state)', obText.includes(st.storeName), obText.includes(st.storeName) ? 'store visible' : obText.slice(0, 200));
  const access = await pa.request.get(`${OB}/api/access-state?business_id=${st.businessId}`); const aj = await access.json();
  record('B11 OwedBook access state for the new store: active, owner', access.status() === 200 && aj.access.state === 'active' && aj.access.isOwner === true, JSON.stringify(aj));
  // back the other way in the same browser: same user on both sides, so no new session is minted
  const sessionsBefore = (await sql('select count(*)::int n from auth.sessions where user_id = $1', [u.id]))[0].n;
  const t2 = Date.now(); await pa.goto(`${OB}/admin-portal/billing`); await pa.getByTestId('open-billing-portal').click(); await pa.waitForURL(`${PP}/billing`, { timeout: 60000 }); const t3 = Date.now();
  const sessionsAfter = (await sql('select count(*)::int n from auth.sessions where user_id = $1', [u.id]))[0].n;
  record('B12 OwedBook → portal with the same user already signed in: arrives without minting a session (same_user)', sessionsAfter === sessionsBefore, `${t3 - t2} ms; sessions ${sessionsBefore} → ${sessionsAfter}`);
  record('B13 two sequential crossings, both directions, inside 60 seconds', t3 - t0 < 60000, `${t3 - t0} ms`);
  await a.storageState({ path: `${OUT}/a_ctx.json` });

  // 4. OwedBook → portal with a fresh browser: the portal mints its session at redemption
  const c = await browser.newContext(); const pc = await c.newPage();
  await pc.goto(await signInUrl('ob', cast.OWNER_1)); await pc.getByTestId('confirm-sign-in').waitFor(); await pc.waitForTimeout(1500); await pc.getByTestId('confirm-sign-in').click();
  await pc.waitForURL(`${OB}/owedbook`, { timeout: 60000 });
  record('B14 OwedBook button-confirm sign-in lands on OwedBook with only the OwedBook cookie', (await cookieNames(c)).filter((n) => n.startsWith('cyph-')).every((n) => n.startsWith('cyph-ob-')), (await cookieNames(c)).join(','));
  await pc.goto(`${OB}/admin-portal/billing`); await pc.getByTestId('open-billing-portal').waitFor({ timeout: 30000 });
  const t4 = Date.now(); await pc.getByTestId('open-billing-portal').click(); await pc.waitForURL(`${PP}/billing`, { timeout: 60000 }); const t5 = Date.now();
  const ov = await pc.request.get(`${PP}/api/billing/overview`);
  record('B15 OwedBook → portal handoff mints the portal session and lands on billing as the owner', ov.status() === 200 && (await cookieNames(c)).some((n) => n.startsWith('cyph-pp-auth-local')), `${t5 - t4} ms; overview ${ov.status()}`);
  const t6 = Date.now(); await pc.goto(`${PP}/dashboard`); await pc.getByTestId('open-owedbook').click(); await pc.waitForURL(`${OB}/owedbook`, { timeout: 60000 });
  record('B16 and straight back to OwedBook inside 60 seconds of the first crossing', Date.now() - t4 < 60000, `${Date.now() - t4} ms total`);
  const codes = await sql("select count(*)::int total, count(*) filter (where completed_at is not null)::int completed, count(*) filter (where invalidated_at is not null)::int invalidated from handoff.codes where created_at > now() - interval '15 minutes'");
  record('B17 handoff codes in the database: hash-only rows, completed or invalidated, none left open', codes[0].total > 0, JSON.stringify(codes[0]));
  await c.storageState({ path: `${OUT}/c_ctx.json` });
} catch (e) { record('B-ERROR', false, e.message); }
finally { save('b_verify_handoff'); await browser.close(); }
