import { writeFileSync } from 'node:fs'; import { say, W, scrub } from './lib.mjs'; import { S, config, session, browser, snap, subView } from './portal_lib.mjs';
const out = { steps: [] }; const cfg = await config(); const url = await session(S.custB, cfg); const { b, page } = await browser();
const brief = v => ({ path: v.path, text: v.text.filter(t => /cancel|renew|subscription|keep|confirm|ends|billing date|update|quantity|plan|promo/i.test(t)).slice(0, 25), controls: v.controls.filter(c => !/Powered|Terms|Privacy|Sandbox/.test(c)) });
try { await page.goto(url, { timeout: 30000 }); await page.waitForLoadState('networkidle').catch(() => {});
  await page.getByText('Cancel subscription', { exact: true }).first().click(); out.steps.push({ step: 'cancel page', ...brief(await snap(page, 'B2_cancel_confirm')) });
  const confirm = page.locator('button:has-text("Cancel subscription"), [data-testid="confirm"]').first(); await confirm.click(); out.steps.push({ step: 'after confirm', ...brief(await snap(page, 'B3_after_cancel')), api: await subView(S.subB) });
  // dismiss any feedback prompt and return to the overview
  for (const label of ['No thanks', 'Skip', 'Not now', 'Close', 'Done', 'Return', 'Back']) { const el = page.getByText(label, { exact: false }).first(); if (await el.isVisible().catch(() => false)) { if (label === 'Return') break; await el.click().catch(() => {}); out.dismissed = label; break; } }
  await page.goto(url, { timeout: 30000 }).catch(() => {}); out.steps.push({ step: 'overview after cancel', ...brief(await snap(page, 'B4_overview_canceled')) });
  const renew = page.getByText(/Renew subscription|Don.t cancel subscription|Renew/i).first();
  if (await renew.isVisible().catch(() => false)) { await renew.click(); out.steps.push({ step: 'renew page', ...brief(await snap(page, 'B5_renew_confirm')) });
    const rc = page.locator('button:has-text("Renew"), [data-testid="confirm"]').first(); if (await rc.isVisible().catch(() => false)) await rc.click(); out.steps.push({ step: 'after renew', ...brief(await snap(page, 'B6_after_renew')), api: await subView(S.subB) }); }
  else out.renewControl = 'NOT VISIBLE';
} catch (e) { out.error = String(e.message).slice(0, 300); out.steps.push({ step: 'at error', ...brief(await snap(page, 'B_error').catch(() => ({ path: '?', text: [], controls: [] }))) }); out.apiAtError = await subView(S.subB); } finally { await b.close(); }
say(out); writeFileSync(`${W}/out/portal_b2_result.json`, scrub(out));
