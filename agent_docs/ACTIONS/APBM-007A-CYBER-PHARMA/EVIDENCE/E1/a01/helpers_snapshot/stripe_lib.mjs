import { loadApp, reqPP, count, ceiling, keyClass, STRIPE_ACCT } from './lib.mjs';
const Stripe = reqPP('stripe');
import { readFileSync } from 'node:fs'; import { W } from './lib.mjs';
export const SDK_VERSION = JSON.parse(readFileSync(W + '/baseline/pp/node_modules/stripe/package.json')).version;
export function client() { const e = loadApp('pp'); if (keyClass(e.STRIPE_SECRET_KEY) !== 'sk_test_…') throw new Error('STOP: Stripe key is not a test secret key');
  return new Stripe(e.STRIPE_SECRET_KEY, { maxNetworkRetries: 0, timeout: 30000 }); }
export async function rd(note, fn) { ceiling('stripe_read', 200); count('stripe_read', 1, note); return fn(); }
export async function wr(note, fn) { ceiling('stripe_mutate', 100); count('stripe_mutate', 1, note); return fn(); }
export async function assertAccount(s) { const a = await rd('account.retrieve', () => s.accounts.retrieve()); if (a.id !== STRIPE_ACCT) throw new Error('STOP: Stripe account mismatch'); return a; }
