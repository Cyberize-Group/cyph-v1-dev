import { say } from './lib.mjs'; import { s, S, step, config, session, browser, snap, subView } from './portal_lib.mjs';
const out = {}; const cfg = await config(); out.config = cfg;
await step('B_portal_prep_clear_cancel', o => s.subscriptions.update(S.subB, { cancel_at_period_end: false }, o)); out.apiBefore = await subView(S.subB);
const url = await session(S.custB, cfg); const { b, page } = await browser();
try { await page.goto(url, { timeout: 30000 }); out.home = await snap(page, 'B1_home'); } finally { await b.close(); }
say(out);
