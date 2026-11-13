// Scenario H (B4 closure): signed webhook delivery on OWNER_1's existing paid subscription, through a cancel in the
// hosted billing portal and an undo from the app's banner. No checkout, no payment, no identity.
import { readFileSync } from 'node:fs';
import { chromium, PP, cast, signInUrl, record, save, sql, stripe, count } from './lib.mjs';
const OUT = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/proof/out';
const st = JSON.parse(readFileSync(`${OUT}/a_state.json`));
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext(); const p = await ctx.newPage();
const events = (since) => sql("select event_id, type, status, attempts, error_code, object_id, to_char(received_at at time zone 'UTC','HH24:MI:SS') t from public.stripe_events where received_at > $1 order by received_at", [since]);
const mirror = async () => (await sql('select status, raw_status, cancel_at, cancel_at_period_end, verified_at from public.subscriptions where stripe_subscription_id = $1', [st.subscriptionId]))[0];
const waitFor = async (fn, ms = 60000) => { const end = Date.now() + ms; let v; while (Date.now() < end) { v = await fn(); if (v) return v; await p.waitForTimeout(2000); } return v; };
try {
  const pre = await stripe.subscriptions.retrieve(st.subscriptionId);
  record('H0 starting point: the existing subscription is active with no cancellation scheduled', pre.status === 'active' && !pre.cancel_at && !pre.cancel_at_period_end);
  const m0 = await mirror(); const t0 = new Date();
  await p.goto(await signInUrl('pp', cast.OWNER_1)); await p.getByTestId('confirm-sign-in').waitFor(); await p.waitForTimeout(1500); await p.getByTestId('confirm-sign-in').click(); await p.waitForURL(`${PP}/dashboard`, { timeout: 60000 });
  await p.goto(`${PP}/billing`); await p.getByTestId('manage-billing').waitFor({ timeout: 30000 });
  count('stripe_portal_sessions', 1, 'H owner portal'); await p.getByTestId('manage-billing').click();
  await p.waitForURL(/billing\.stripe\.com/, { timeout: 60000 }); await p.waitForLoadState('networkidle').catch(() => {});
  await p.locator('a:has-text("Cancel"), button:has-text("Cancel subscription"), [data-test="cancel-subscription"]').first().click();
  await p.locator('button:has-text("Cancel subscription"), [data-testid="confirm"]').last().click({ timeout: 30000 });
  const tCancel = new Date();
  const s1 = await waitFor(async () => { const x = await stripe.subscriptions.retrieve(st.subscriptionId); return x.cancel_at || x.cancel_at_period_end ? x : null; }, 30000);
  record('H1 hosted-portal cancellation scheduled on Stripe (cancel_at set, same subscription)', !!s1 && s1.id === st.subscriptionId && s1.status === 'active', JSON.stringify({ cancel_at: s1?.cancel_at, flag: s1?.cancel_at_period_end }));
  const ev1 = await waitFor(async () => { const e = await events(t0); return e.some((x) => x.type === 'customer.subscription.updated' && x.object_id === st.subscriptionId && x.status === 'processed') ? e : null; });
  record('H2 the signed customer.subscription.updated event reached the portal and was recorded as processed', !!ev1, JSON.stringify((ev1 || await events(t0)).map((x) => `${x.type}:${x.status}${x.error_code ? ':' + x.error_code : ''}`)));
  const m1 = await waitFor(async () => { const m = await mirror(); return m.cancel_at ? m : null; }, 30000);
  record('H3 the mirror was updated by the webhook: cancel_at set, flag false, still active, newer verification time', !!m1 && m1.cancel_at_period_end === false && m1.status === 'active' && new Date(m1.verified_at) > new Date(m0.verified_at), JSON.stringify(m1 ? { cancel_at: m1.cancel_at, flag: m1.cancel_at_period_end, status: m1.status } : await mirror()));
  // back to the app: the banner offers undo because the mirror now knows
  await p.goto(`${PP}/billing`); await p.getByTestId('undo-cancel').waitFor({ timeout: 30000 });
  record('H4 the app shows the scheduled cancellation with an Undo button (from the webhook-updated mirror)', await p.getByTestId('undo-cancel').isVisible(), (await p.getByTestId('dashboard-banners').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 120));
  const tUndo = new Date(); await p.getByTestId('undo-cancel').click();
  const s2 = await waitFor(async () => { const x = await stripe.subscriptions.retrieve(st.subscriptionId); return !x.cancel_at && !x.cancel_at_period_end ? x : null; }, 30000);
  record('H5 undo from the banner cleared the schedule on the same subscription; still active', !!s2 && s2.status === 'active' && s2.id === st.subscriptionId);
  const ev2 = await waitFor(async () => { const e = await events(tUndo); return e.some((x) => x.type === 'customer.subscription.updated' && x.status === 'processed') ? e : null; });
  record('H6 the undo produced a second signed event, recorded as processed', !!ev2, JSON.stringify((ev2 || await events(tUndo)).map((x) => `${x.type}:${x.status}`)));
  const m2 = await mirror();
  record('H7 the mirror ends clear and active', !m2.cancel_at && m2.cancel_at_period_end === false && m2.status === 'active', JSON.stringify({ cancel_at: m2.cancel_at, flag: m2.cancel_at_period_end, status: m2.status }));
  await p.goto(`${PP}/billing`); await p.getByTestId('plan-summary').waitFor({ timeout: 30000 });
  record('H8 the billing page no longer shows a cancellation', !(await p.getByTestId('undo-cancel').isVisible().catch(() => false)));
  const all = await events(t0);
  record('H9 no event in this window failed or stayed unprocessed; a duplicate delivery would have been a no-op', all.length > 0 && all.every((x) => x.status === 'processed' || x.status === 'ignored'), `${all.length} events: ` + all.map((x) => `${x.t} ${x.type}:${x.status} attempts=${x.attempts}`).join(' | '));
  const subs = await stripe.subscriptions.list({ customer: s2.customer, status: 'all' });
  record('H10 still exactly one subscription for the customer; nothing new was created or charged', subs.data.length === 1 && subs.data[0].status === 'active');
} catch (e) { record('H-ERROR', false, e.message); await p.screenshot({ path: `${OUT}/h_error.png`, fullPage: true }).catch(() => {}); }
finally { save('h_webhook_cancel_undo'); await browser.close(); }
