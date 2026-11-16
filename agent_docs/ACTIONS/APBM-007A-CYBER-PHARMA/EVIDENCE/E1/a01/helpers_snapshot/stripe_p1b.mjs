import { say } from './lib.mjs'; import { rd } from './stripe_lib.mjs'; import { s, S, step, lines, sum } from './stripe_p1.mjs';
const out = {};
const subA = await step('subA', o => s.subscriptions.create({ customer: S.custA, items: [{ price: S.priceA1, quantity: 1 }], payment_behavior: 'error_if_incomplete', metadata: { apbm: 'apbm007a_e1_a01', cand: 'A' } }, o));
const subB = await step('subB', o => s.subscriptions.create({ customer: S.custB, items: [{ price: S.priceB, quantity: 1 }], payment_behavior: 'error_if_incomplete', metadata: { apbm: 'apbm007a_e1_a01', cand: 'B' } }, o));
const get = async id => rd('sub.retrieve', () => s.subscriptions.retrieve(id, { expand: ['latest_invoice'] }));
const view = x => ({ status: x.status, cancel_at_period_end: x.cancel_at_period_end, cancel_at: x.cancel_at, items: x.items.data.map(i => ({ price: i.price.id === S.priceA1 ? 'A1' : i.price.id === S.priceA2 ? 'A2' : 'B', qty: i.quantity })), discounts: x.discounts?.length, latestInvoice: x.latest_invoice && { status: x.latest_invoice.status, total: x.latest_invoice.total, paid: x.latest_invoice.amount_paid } });
let a = await get(subA), b = await get(subB); out.initial = { A: view(a), B: view(b) };
const now = () => Math.floor(Date.now() / 1000);
// quantity path 1→2→3→2→1 with a proration preview before each change
const itemA1 = a.items.data[0].id, itemB = b.items.data[0].id; let itemA2 = S.itemA2 || null; out.changes = [];
for (const [from, to] of [[1, 2], [2, 3], [3, 2], [2, 1]]) {
  const itemsA = to === 1 ? [{ id: itemA2, deleted: true }] : itemA2 ? [{ id: itemA2, quantity: to - 1 }] : [{ price: S.priceA2, quantity: to - 1 }];
  const itemsB = [{ id: itemB, quantity: to }];
  const rec = { change: `${from}→${to}` };
  for (const [cand, sub, items] of [['A', subA, itemsA], ['B', subB, itemsB]]) {
    const pd = now();
    const pv = await rd(`proration preview ${cand} ${from}->${to}`, () => s.invoices.createPreview({ subscription: sub, subscription_details: { items, proration_behavior: 'create_prorations', proration_date: pd } }));
    const pl = lines(pv); rec[cand] = { prorationLines: pl.filter(l => l.proration).map(l => [l.d, l.amt]), prorationNet: pl.filter(l => l.proration).reduce((x, l) => x + l.amt, 0), nextRegular: pl.filter(l => !l.proration).reduce((x, l) => x + l.amt, 0) };
    await step(`${cand}_qty_${from}_${to}`, o => s.subscriptions.update(sub, { items, proration_behavior: 'create_prorations', proration_date: pd }, o));
    const after = await get(sub); rec[cand].after = view(after).items;
    if (cand === 'A' && !itemA2 && to > 1) { itemA2 = after.items.data.find(i => i.price.id === S.priceA2).id; S.itemA2 = itemA2; }
    if (cand === 'A' && to === 1) { itemA2 = null; }
  }
  out.changes.push(rec);
}
// cancel at period end, then undo, then apply promotion code, then rest state = scheduled cancellation
for (const [cand, sub] of [['A', subA], ['B', subB]]) {
  await step(`${cand}_cancel_sched`, o => s.subscriptions.update(sub, { cancel_at_period_end: true }, o)); const c1 = view(await get(sub));
  await step(`${cand}_cancel_undo`, o => s.subscriptions.update(sub, { cancel_at_period_end: false }, o)); const c2 = view(await get(sub));
  await step(`${cand}_promo_apply`, o => s.subscriptions.update(sub, { discounts: [{ promotion_code: S.promo }] }, o)); const c3 = view(await get(sub));
  const up = await rd(`upcoming ${cand}`, () => s.invoices.createPreview({ subscription: sub }));
  await step(`${cand}_rest_cancel_sched`, o => s.subscriptions.update(sub, { cancel_at_period_end: true }, o)); const c4 = view(await get(sub));
  out['cancel_' + cand] = { scheduled: [c1.status, c1.cancel_at_period_end, !!c1.cancel_at], undone: [c2.status, c2.cancel_at_period_end, c2.cancel_at], promoApplied: c3.discounts, upcoming: { ...sum(up), lines: lines(up).map(l => [l.d, l.amt]) }, rest: [c4.status, c4.cancel_at_period_end, c4.cancel_at && new Date(c4.cancel_at * 1000).toISOString().slice(0, 10)] };
}
say(out);
