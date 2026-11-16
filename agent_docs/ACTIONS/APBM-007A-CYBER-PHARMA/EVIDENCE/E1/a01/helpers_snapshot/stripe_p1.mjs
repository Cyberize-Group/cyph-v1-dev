// P1 catalogue comparison. Resumable: every mutation is a named step stored in out/stripe_state.json with a fixed idempotency key.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { say, W, ATTEMPT } from './lib.mjs'; import { client, rd, wr, assertAccount } from './stripe_lib.mjs';
const SF = `${W}/out/stripe_state.json`; export const S = existsSync(SF) ? JSON.parse(readFileSync(SF)) : {};
const save = () => writeFileSync(SF, JSON.stringify(S, null, 1));
export const s = client(); await assertAccount(s);
const md = { apbm: ATTEMPT, label: 'E1_ONLY' };
export async function step(name, fn) { if (S[name]) return S[name]; const r = await wr(name, () => fn({ idempotencyKey: `${ATTEMPT}:${name}` })); if (r.livemode === true) throw new Error('STOP: livemode object'); S[name] = r.id || true; save(); return S[name]; }
export const lines = inv => inv.lines.data.map(l => ({ d: l.description, amt: l.amount, qty: l.quantity, proration: l.parent?.subscription_item_details?.proration ?? l.proration ?? null }));
export const sum = inv => ({ subtotal: inv.subtotal, total: inv.total, discount: (inv.total_discount_amounts || []).reduce((a, d) => a + d.amount, 0), amount_due: inv.amount_due });
if (process.argv[2] === 'create') {
  const pA1 = await step('prodA1', o => s.products.create({ name: 'E1_ONLY OwedBook first store (cand A)', metadata: { ...md, cand: 'A', part: 'first' } }, o));
  const prA1 = await step('priceA1', o => s.prices.create({ product: pA1, currency: 'usd', unit_amount: 9900, recurring: { interval: 'month' }, lookup_key: `${ATTEMPT}_a_first`, metadata: md }, o));
  const pA2 = await step('prodA2', o => s.products.create({ name: 'E1_ONLY OwedBook additional store (cand A)', metadata: { ...md, cand: 'A', part: 'additional' } }, o));
  const prA2 = await step('priceA2', o => s.prices.create({ product: pA2, currency: 'usd', unit_amount: 4900, recurring: { interval: 'month' }, lookup_key: `${ATTEMPT}_a_additional`, metadata: md }, o));
  const pB = await step('prodB', o => s.products.create({ name: 'E1_ONLY OwedBook stores (cand B graduated)', metadata: { ...md, cand: 'B' } }, o));
  const prB = await step('priceB', o => s.prices.create({ product: pB, currency: 'usd', recurring: { interval: 'month', usage_type: 'licensed' }, billing_scheme: 'tiered', tiers_mode: 'graduated', tiers: [{ up_to: 1, unit_amount: 9900 }, { up_to: 'inf', unit_amount: 4900 }], lookup_key: `${ATTEMPT}_b_stores`, metadata: md }, o));
  const cpn = await step('coupon', o => s.coupons.create({ percent_off: 10, duration: 'once', name: 'E1_ONLY 10pct once', metadata: md }, o));
  await step('promo', o => s.promotionCodes.create({ promotion: { type: 'coupon', coupon: cpn }, code: 'E1ONLYA01TEN', metadata: md }, o));
  const out = { ids: S, fresh: {} };
  const dummy = await step('custA', o => s.customers.create({ name: 'E1_ONLY probe customer A', payment_method: 'pm_card_visa', invoice_settings: { default_payment_method: 'pm_card_visa' }, metadata: { ...md, cand: 'A' } }, o));
  await step('custB', o => s.customers.create({ name: 'E1_ONLY probe customer B', payment_method: 'pm_card_visa', invoice_settings: { default_payment_method: 'pm_card_visa' }, metadata: { ...md, cand: 'B' } }, o));
  for (const n of [1, 2, 3]) for (const withCoupon of [false, true]) {
    const itemsA = [{ price: prA1, quantity: 1 }, ...(n > 1 ? [{ price: prA2, quantity: n - 1 }] : [])], itemsB = [{ price: prB, quantity: n }];
    for (const [cand, items, cust] of [['A', itemsA, S.custA], ['B', itemsB, S.custB]]) {
      if (withCoupon && n === 2) continue;
      const inv = await rd(`preview ${cand} n=${n} coupon=${withCoupon}`, () => s.invoices.createPreview({ customer: cust, subscription_details: { items }, ...(withCoupon ? { discounts: [{ coupon: cpn }] } : {}) }));
      out.fresh[`${cand}_n${n}${withCoupon ? '_coupon' : ''}`] = { ...sum(inv), lines: lines(inv) };
    } }
  say(out);
}
