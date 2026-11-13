// Scenario H, second part: undo from the app's banner, recording the API response; then the second signed event.
import { readFileSync } from 'node:fs';
import { chromium, PP, cast, signInUrl, record, save, sql, stripe, results } from './lib.mjs';
const OUT = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/proof/out';
const st = JSON.parse(readFileSync(`${OUT}/a_state.json`));
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext(); const p = await ctx.newPage();
const events = (since) => sql("select type, status, attempts, error_code, to_char(received_at at time zone 'UTC','HH24:MI:SS') t from public.stripe_events where received_at > $1 order by received_at", [since]);
const mirror = async () => (await sql('select status, cancel_at, cancel_at_period_end from public.subscriptions where stripe_subscription_id = $1', [st.subscriptionId]))[0];
const waitFor = async (fn, ms = 60000) => { const end = Date.now() + ms; let v; while (Date.now() < end) { v = await fn(); if (v) return v; await p.waitForTimeout(2000); } return v; };
const api = []; p.on('response', async (r) => { if (r.url().includes('/api/billing/undo-cancel')) api.push(`${r.status()} ${await r.text().catch(() => '')}`); });
try {
  await p.goto(await signInUrl('pp', cast.OWNER_1)); await p.getByTestId('confirm-sign-in').waitFor(); await p.waitForTimeout(1500); await p.getByTestId('confirm-sign-in').click(); await p.waitForURL(`${PP}/dashboard`, { timeout: 60000 });
  await p.goto(`${PP}/billing`); await p.getByTestId('undo-cancel').waitFor({ timeout: 30000 }); await p.waitForLoadState('networkidle').catch(() => {}); await p.waitForTimeout(1500);
  const tUndo = new Date(); await p.getByTestId('undo-cancel').click();
  await waitFor(async () => api.length > 0, 30000);
  record('H5a the Undo button posts to the app and the app answers', api.length > 0 && api[0].startsWith('200'), api.join(' | ') || 'no request seen');
  const s2 = await waitFor(async () => { const x = await stripe.subscriptions.retrieve(st.subscriptionId); return !x.cancel_at && !x.cancel_at_period_end ? x : null; }, 30000);
  record('H5 undo from the banner cleared the schedule on the same subscription; still active', !!s2 && s2.status === 'active');
  const ev2 = await waitFor(async () => { const e = await events(tUndo); return e.some((x) => x.type === 'customer.subscription.updated' && x.status === 'processed') ? e : null; });
  record('H6 the undo produced a second signed event, recorded as processed', !!ev2, JSON.stringify((ev2 || await events(tUndo)).map((x) => `${x.t} ${x.type}:${x.status}`)));
  const m2 = await mirror();
  record('H7 the mirror ends clear and active', !m2.cancel_at && m2.cancel_at_period_end === false && m2.status === 'active', JSON.stringify(m2));
  await p.goto(`${PP}/billing`); await p.getByTestId('plan-summary').waitFor({ timeout: 30000 });
  record('H8 the billing page no longer shows a cancellation', !(await p.getByTestId('undo-cancel').isVisible().catch(() => false)));
  const subs = await stripe.subscriptions.list({ customer: s2?.customer ?? (await stripe.subscriptions.retrieve(st.subscriptionId)).customer, status: 'all' });
  record('H10 still exactly one subscription for the customer, active; nothing new created or charged', subs.data.length === 1 && subs.data[0].status === 'active');
} catch (e) { record('H2-ERROR', false, e.message); await p.screenshot({ path: `${OUT}/h2_error.png`, fullPage: true }).catch(() => {}); }
finally { save('h2_undo_banner'); await browser.close(); }
