import { say } from './lib.mjs'; import { rd } from './stripe_lib.mjs'; import { s, S, sum } from './stripe_p1.mjs';
const o = {}; for (const [c, items, cust] of [['A', [{ price: S.priceA1, quantity: 1 }, { price: S.priceA2, quantity: 2 }], S.custA], ['B', [{ price: S.priceB, quantity: 3 }], S.custB]]) o[c + '_n3_coupon'] = sum(await rd('preview n3 coupon ' + c, () => s.invoices.createPreview({ customer: cust, subscription_details: { items }, discounts: [{ coupon: S.coupon }] })));
// negative: portal session without any configuration (documents the G4 dependency) is NOT dispatched — would be a mutation attempt.
say(o);
