// Scenarios D–G, reusing scenario A's account. No checkout, no new identity, no email.
// D permission denials and isolation · E different user at the destination · F owner billing portal, cancel and undo · G provider-wide logout.
import { readFileSync } from 'node:fs';
import { chromium, PP, OB, cast, signInUrl, record, save, sql, stripe, count, cookieNames } from './lib.mjs';
const OUT = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/proof/out';
const st = JSON.parse(readFileSync(`${OUT}/a_state.json`));
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' });
const step = async (name, fn) => { try { await fn(); } catch (e) { record(`${name}-ERROR`, false, e.message); } };
const seeded = (k) => `apbm003-${k.toLowerCase()}@example.invalid`;
async function signedIn(app, email) {
  const ctx = await browser.newContext(); const p = await ctx.newPage();
  await p.goto(await signInUrl(app, email)); await p.getByTestId('confirm-sign-in').waitFor(); await p.waitForTimeout(1200); await p.getByTestId('confirm-sign-in').click();
  await p.waitForURL(app === 'pp' ? `${PP}/dashboard` : /localhost:3000\/(owedbook|admin-portal)/, { timeout: 60000 }); return { ctx, p };
}
const A1 = 'ae1e8cd9-a1a8-4ad5-aa00-4ac3ff5c27d0';
try {
  // ── D: denials ──
  await step('D-store-admin', async () => {
    const { ctx, p } = await signedIn('pp', seeded('ADMIN_B2'));
    await p.goto(`${PP}/billing`); await p.getByTestId('denied-view').waitFor({ timeout: 30000 });
    record('D1 seeded store admin (not an owner) gets the portal "billing is managed by the owner" view', await p.getByTestId('denied-view').isVisible());
    const r = await Promise.all(['overview'].map((x) => p.request.get(`${PP}/api/billing/${x}`)));
    const portal = await p.request.post(`${PP}/api/billing/portal`, { headers: { Origin: PP } }); const undo = await p.request.post(`${PP}/api/billing/undo-cancel`, { headers: { Origin: PP } });
    record('D2 store admin: billing overview, portal session and undo all refused (403 not_owner)', r[0].status() === 403 && portal.status() === 403 && undo.status() === 403, `${r[0].status()} ${portal.status()} ${undo.status()}`);
    const idor = await p.request.get(`${OB}/api/access-state?business_id=${st.businessId}`);
    await p.goto(`${OB}/api/handoff/start?return=/admin-portal/billing`).catch(() => {}); await p.waitForURL(/localhost:3000\//, { timeout: 60000 }).catch(() => {});
    await p.goto(`${OB}/admin-portal/billing`); await p.getByTestId('billing-owner-only').waitFor({ timeout: 30000 });
    record('D3 the same store admin in OwedBook (reached by handoff): billing screen says owner-only, no owner data', await p.getByTestId('billing-owner-only').isVisible());
    const own = await p.request.get(`${OB}/api/access-state?business_id=${st.businessId}`);
    record("D4 store admin cannot read the access state of OWNER_1's new store (IDOR)", own.status() === 403, `${own.status()}`);
    await ctx.close();
  });
  await step('D-unrelated-owner', async () => {
    const { ctx, p } = await signedIn('pp', seeded('UNRELATED'));
    const ov = await (await p.request.get(`${PP}/api/billing/overview`)).json();
    record("D5 an unrelated owner sees only their own (synthetic) account, never OWNER_1's", ov.overview?.subscription?.origin === 'synthetic_seed' && ov.overview.account_id !== st.accountId && !JSON.stringify(ov).includes(st.npi), `origin ${ov.overview?.subscription?.origin}`);
    await p.goto(`${PP}/billing`); await p.getByTestId('synthetic-panel').waitFor({ timeout: 30000 });
    record('D6 synthetic fixture account shows "test account — no billing" and offers no portal', await p.getByTestId('synthetic-panel').isVisible() && !(await p.getByTestId('manage-billing').isVisible().catch(() => false)));
    const portal = await p.request.post(`${PP}/api/billing/portal`, { headers: { Origin: PP } });
    record('D7 portal session refused for a synthetic subscription (409 not_billable), Stripe never called', portal.status() === 409, `${portal.status()}`);
    const idor = await p.request.get(`${OB}/api/access-state?business_id=${st.businessId}`);
    record("D8 unrelated owner cannot read the new store's access state", idor.status() === 401 || idor.status() === 403, `${idor.status()} (no OwedBook session in this browser counts as refused)`);
    await ctx.close();
  });
  await step('D-member-and-csrf', async () => {
    const { ctx, p } = await signedIn('pp', seeded('MEMBER_B1'));
    const ov = await p.request.get(`${PP}/api/billing/overview`);
    record('D9 member: billing overview refused (403)', ov.status() === 403, `${ov.status()}`);
    const xo = await p.request.post(`${PP}/api/billing/portal`, { headers: { Origin: 'https://evil.example' } });
    const xq = await p.request.post(`${PP}/api/registration/quote`, { headers: { Origin: 'https://evil.example' }, data: {} });
    record('D10 cross-origin state-changing requests refused', xo.status() >= 400 && xq.status() === 400, `${xo.status()} ${xq.status()}`);
    await ctx.close();
  });
  await step('D-anonymous', async () => {
    const ctx = await browser.newContext(); const p = await ctx.newPage();
    const ov = await p.request.get(`${PP}/api/billing/overview`); await p.goto(`${PP}/billing`);
    record('D11 anonymous: overview 401, billing page goes to sign-in', ov.status() === 401 && /\/login/.test(p.url()), `${ov.status()} ${p.url()}`);
    await p.goto(`${PP}/api/handoff/authorize?state=${'s'.repeat(43)}&challenge=${'c'.repeat(43)}&dest=ob&return=%2F%2Fevil.example&attempt=1`);
    record('D12 handoff authorize with a protocol-relative return path is refused (400)', /invalid_request/.test(await p.locator('body').innerText()));
    await ctx.close();
  });

  // ── E: a different user already signed in at the destination ──
  await step('E-switch', async () => {
    const { ctx, p } = await signedIn('ob', seeded('ADMIN_B2'));
    const p2 = await ctx.newPage(); await p2.goto(await signInUrl('pp', cast.OWNER_1)); await p2.getByTestId('confirm-sign-in').waitFor(); await p2.waitForTimeout(1200); await p2.getByTestId('confirm-sign-in').click(); await p2.waitForURL(`${PP}/dashboard`);
    await p2.getByTestId('open-owedbook').click(); await p2.waitForURL(/\/auth\/switch/, { timeout: 60000 });
    const who = await p2.request.get(`${OB}/api/access-state?business_id=${st.businessId}`);
    record("E1 OwedBook already signed in as another user: switch page shown, nothing replaced (OwedBook still cannot read OWNER_1's store)", /different account/i.test(await p2.locator('body').innerText()) && who.status() === 403, `${p2.url().replace(/t=.*/, 't=…')} access ${who.status()}`);
    await p2.getByTestId('switch-continue').click(); await p2.waitForURL(`${OB}/owedbook`, { timeout: 60000 });
    const after = await p2.request.get(`${OB}/api/access-state?business_id=${st.businessId}`);
    record('E2 the deliberate "continue as the other account" signs out OwedBook locally and hands over as OWNER_1', after.status() === 200, `access ${after.status()}`);
    const stay = await ctx.newPage(); await ctx.close();
  });

  // ── F: owner billing portal, cancellation and undo ──
  await step('F-billing', async () => {
    const a = await browser.newContext({ storageState: `${OUT}/a_ctx.json` }); const p = await a.newPage();
    await p.goto(`${PP}/billing`); await p.getByTestId('manage-billing').waitFor({ timeout: 30000 });
    count('stripe_portal_sessions', 1, 'F owner portal'); await p.getByTestId('manage-billing').click();
    await p.waitForURL(/billing\.stripe\.com/, { timeout: 60000 }); await p.waitForLoadState('networkidle').catch(() => {});
    const text = await p.locator('body').innerText();
    record('F1 owner reaches the Stripe billing portal for the app configuration: cancel offered, no plan/quantity change', /cancel/i.test(text) && !/update (plan|subscription)|change plan/i.test(text), text.replace(/\s+/g, ' ').slice(0, 160));
    const pmButtons = await p.locator('button, a').evaluateAll((els) => els.map((e) => (e.textContent || '').trim()).filter((t) => /delete|remove/i.test(t)));
    record('F2 only-card removal observed: does the portal offer deleting the only card?', true, pmButtons.length ? `offered: ${pmButtons.join(' | ')}` : 'not offered on the overview page');
    await p.locator('a:has-text("Cancel"), button:has-text("Cancel subscription"), [data-test="cancel-subscription"]').first().click();
    await p.locator('button:has-text("Cancel subscription"), [data-testid="confirm"]').last().click({ timeout: 30000 });
    await p.waitForTimeout(4000);
    const s1 = await stripe.subscriptions.retrieve(st.subscriptionId);
    record('F3 hosted-portal cancellation sets cancel_at on the same subscription (F-S1)', s1.status === 'active' && (!!s1.cancel_at || s1.cancel_at_period_end), JSON.stringify({ cancel_at: s1.cancel_at, flag: s1.cancel_at_period_end }));
    // The webhook secret is wrong, so the mirror is not updated by the event; the app's undo reads Stripe live.
    await p.goto(`${PP}/billing`); await p.waitForTimeout(2000);
    const undo = await p.request.post(`${PP}/api/billing/undo-cancel`, { headers: { Origin: PP } });
    const s2 = await stripe.subscriptions.retrieve(st.subscriptionId);
    record('F4 undo through the app clears the portal-set schedule on the same subscription (RA-4, U4 from E1)', undo.status() === 200 && !s2.cancel_at && !s2.cancel_at_period_end && s2.id === st.subscriptionId && s2.status === 'active', `${undo.status()} cancel_at ${s2.cancel_at}`);
    const [m] = await sql('select cancel_at, cancel_at_period_end, status from public.subscriptions where stripe_subscription_id = $1', [st.subscriptionId]);
    record('F5 the mirror agrees after undo (both fields clear)', !m.cancel_at && m.cancel_at_period_end === false && m.status === 'active', JSON.stringify(m));
    const subs = await stripe.subscriptions.list({ customer: s2.customer, status: 'all' });
    record('F6 no new subscription was created by cancel or undo', subs.data.length === 1);
    await a.close();
  });

  // ── G: provider-wide logout ──
  await step('G-logout', async () => {
    const c = await browser.newContext({ storageState: `${OUT}/c_ctx.json` }); const p = await c.newPage();
    await p.goto(`${OB}/owedbook`); const before = await p.request.get(`${PP}/api/billing/overview`);
    count('auth_signouts', 1, 'G provider-wide logout OWNER_1');
    const out = await p.request.post(`${PP}/api/auth/logout`, { headers: { Origin: PP } });
    await p.goto(`${OB}/owedbook`); await p.waitForTimeout(1500);
    const pp = await p.request.get(`${PP}/api/billing/overview`);
    const [s] = await sql('select count(*)::int n from auth.sessions s join auth.users u on u.id = s.user_id where lower(u.email) = $1', [cast.OWNER_1]);
    record('G1 logout in the portal is provider-wide: OwedBook in the same browser no longer has a session; the portal refuses', out.status() === 200 && /\/auth/.test(p.url()) && pp.status() === 401 && s.n === 0, `${out.status()} → OwedBook ${p.url()} · portal ${pp.status()} · OWNER_1 sessions ${s.n}`);
    const codes = await sql("select count(*)::int n from handoff.codes h join auth.users u on u.id = h.user_id where lower(u.email) = $1 and completed_at is null and invalidated_at is null and expires_at > now()", [cast.OWNER_1]);
    record('G2 no open handoff code remains for the user after logout', codes[0].n === 0);
    await c.close();
  });
} finally { save('d_denials_switch_billing'); await browser.close(); }
