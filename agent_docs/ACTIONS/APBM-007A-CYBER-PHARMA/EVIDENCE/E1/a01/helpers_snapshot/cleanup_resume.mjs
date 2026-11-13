import { writeFileSync } from 'node:fs'; import { say, W, scrub } from './lib.mjs'; import { s, S, step, rd } from './portal_lib.mjs';
const rc = {}; const cfg = S.portalConfigB;
await step('cleanup_coupon_retry', o => s.coupons.del(S.coupon, {}, o).then(r => ({ id: r.deleted ? 'deleted' : 'not-deleted' })));
// portal config deactivation refused by Stripe: it became the account default (see receipts)
for (const k of ['subA', 'subB']) { const x = await rd('sub.retrieve', () => s.subscriptions.retrieve(S[k])); rc[k] = { id: S[k], status: x.status, ended: !!x.ended_at }; }
for (const k of ['priceA1', 'priceA2', 'priceB']) rc[k] = { id: S[k], active: (await rd('price.retrieve', () => s.prices.retrieve(S[k]))).active };
for (const k of ['prodA1', 'prodA2', 'prodB']) rc[k] = { id: S[k], active: (await rd('product.retrieve', () => s.products.retrieve(S[k]))).active };
rc.promo = { id: S.promo, active: (await rd('promo.retrieve', () => s.promotionCodes.retrieve(S.promo))).active };
rc.coupon = { id: S.coupon, state: S.cleanup_coupon_retry, stillRetrievable: await rd('coupon.retrieve', () => s.coupons.retrieve(S.coupon).then(() => true, e => e.statusCode === 404 ? false : 'error ' + e.statusCode)) };
{ const c = await rd('portal.config.retrieve', () => s.billingPortal.configurations.retrieve(cfg)); rc.portalConfig = { id: cfg, active: c.active, is_default: c.is_default, deactivation: 'REFUSED by Stripe: cannot deactivate the default configuration' }; }
rc.customersRetained = [S.custA, S.custB];
const [p, pr, pc, cp] = await Promise.all([rd('products.list active', () => s.products.list({ active: true, limit: 10 })), rd('prices.list active', () => s.prices.list({ active: true, limit: 10 })), rd('portal.list', () => s.billingPortal.configurations.list({ active: true, limit: 10 })), rd('coupons.list', () => s.coupons.list({ limit: 10 }))]);
rc.sandboxAfter = { activeProducts: p.data.length, activePrices: pr.data.length, activePortalConfigs: pc.data.length, coupons: cp.data.length };
say({ cleanupReceipts: rc }); writeFileSync(`${W}/out/cleanup_receipts.json`, scrub({ cleanupReceipts: rc }));
