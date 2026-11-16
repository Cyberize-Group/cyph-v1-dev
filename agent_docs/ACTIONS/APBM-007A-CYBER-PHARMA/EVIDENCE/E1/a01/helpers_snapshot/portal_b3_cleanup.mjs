import { writeFileSync } from 'node:fs'; import { say, W, scrub } from './lib.mjs'; import { s, S, step, rd, config, session, browser, snap, subView } from './portal_lib.mjs';
const out = {}; const cfg = await config();
const cur = await rd('sub.retrieve', () => s.subscriptions.retrieve(S.subB));
await step('B_portal_qty3', o => s.subscriptions.update(S.subB, { items: [{ id: cur.items.data[0].id, quantity: 3 }], proration_behavior: 'none' }, o));
const url = await session(S.custB, cfg); const { b, page } = await browser();
try { await page.goto(url, { timeout: 30000 }); const v = await snap(page, 'B7_home_qty3'); out.portalAtThreeStores = { priceLine: v.text.filter(t => /per month|Qty|First 1|Next|each|\$1/.test(t)).slice(0, 14), controls: v.controls.filter(c => !/Powered|Terms|Privacy|Sandbox|Nov 12/.test(c)) }; } finally { await b.close(); }
// ---- cleanup of exact owned objects
const rc = {};
for (const k of ['subA', 'subB']) { await step(`cleanup_cancel_${k}`, o => s.subscriptions.cancel(S[k], { invoice_now: false, prorate: false }, o)); const x = await rd('sub.retrieve', () => s.subscriptions.retrieve(S[k])); rc[k] = { id: S[k], status: x.status, ended: !!x.ended_at }; }
for (const k of ['priceA1', 'priceA2', 'priceB']) { await step(`cleanup_archive_${k}`, o => s.prices.update(S[k], { active: false, lookup_key: null }, o).catch(() => s.prices.update(S[k], { active: false }))); rc[k] = { id: S[k], active: (await rd('price.retrieve', () => s.prices.retrieve(S[k]))).active }; }
for (const k of ['prodA1', 'prodA2', 'prodB']) { await step(`cleanup_archive_${k}`, o => s.products.update(S[k], { active: false }, o)); rc[k] = { id: S[k], active: (await rd('product.retrieve', () => s.products.retrieve(S[k]))).active }; }
await step('cleanup_promo', o => s.promotionCodes.update(S.promo, { active: false }, o)); rc.promo = { id: S.promo, active: (await rd('promo.retrieve', () => s.promotionCodes.retrieve(S.promo))).active };
await step('cleanup_coupon', o => s.coupons.del(S.coupon, o).then(r => ({ id: 'deleted', ...r }))); rc.coupon = { id: S.coupon, deleted: true };
await step('cleanup_portal_config', o => s.billingPortal.configurations.update(cfg, { active: false }, o)); rc.portalConfig = { id: cfg, active: (await rd('portal.config.retrieve', () => s.billingPortal.configurations.retrieve(cfg))).active };
rc.customersRetained = [S.custA, S.custB];
const [p, pr, pc] = await Promise.all([rd('products.list active', () => s.products.list({ active: true, limit: 10 })), rd('prices.list active', () => s.prices.list({ active: true, limit: 10 })), rd('portal.list', () => s.billingPortal.configurations.list({ active: true, limit: 10 }))]);
rc.sandboxAfter = { activeProducts: p.data.length, activePrices: pr.data.length, activePortalConfigs: pc.data.length };
out.cleanupReceipts = rc; say(out); writeFileSync(`${W}/out/portal_b3_cleanup_result.json`, scrub(out));
