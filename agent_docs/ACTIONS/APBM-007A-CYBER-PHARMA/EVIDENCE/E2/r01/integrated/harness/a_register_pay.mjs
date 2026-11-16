// Scenario A: OWNER_1 (existing DEV identity) signs in to the portal by the button-confirm flow, registers one store
// while signed in, applies the APA sandbox code, pays on Stripe's hosted page, and is provisioned by the signed webhook.
import { writeFileSync } from 'node:fs';
import { chromium, PP, OB, cast, signInUrl, record, save, sql, freshNpi, stripe, count, cookieNames } from './lib.mjs';
import { payOnStripe } from './stripe_pay.mjs';
const OUT = '/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/proof/out';
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' }); const ctx = await browser.newContext(); const page = await ctx.newPage();
const npi = freshNpi(); const storeName = `SYNTHETIC E2 STORE ${npi.slice(-4)}`;
writeFileSync(`${OUT}/a_state.json`, JSON.stringify({ npi, storeName }));
try {
  // 1. sign-in link landing: GET shows a button and redeems nothing
  const url = await signInUrl('pp', cast.OWNER_1);
  await page.goto(url);
  record('A1 link GET lands on the clean confirm page (no token in the address)', page.url() === `${PP}/auth/confirm`, page.url());
  const before = await page.request.get(`${PP}/api/billing/overview`);
  record('A2 no session exists before the button is pressed', before.status() === 401, `overview ${before.status()}`);
  await page.waitForLoadState('networkidle'); await page.getByTestId('confirm-sign-in').click(); await page.waitForURL(`${PP}/dashboard`, { timeout: 45000 });
  const names = await cookieNames(ctx);
  record('A3 the button POST signs in to the portal only (cookie cyph-pp-auth-local, no OwedBook cookie)', names.some((n) => n.startsWith('cyph-pp-auth-local')) && !names.some((n) => n.startsWith('cyph-ob-auth')), names.join(','));
  const after = await page.request.get(`${PP}/api/billing/overview`);
  record('A4 signed in; not yet an owner (billing refused)', after.status() === 403, `overview ${after.status()}`);
  // 2. replay of the same link in a fresh browser: used up
  const ctx2 = await browser.newContext(); const p2 = await ctx2.newPage(); await p2.goto(url);
  if (p2.url().endsWith('/auth/confirm')) { await p2.getByTestId('confirm-sign-in').click(); }
  await p2.waitForURL(/link-expired/, { timeout: 30000 });
  record('A5 the same link pressed again elsewhere is refused (link-expired)', p2.url().endsWith('/auth/link-expired'), p2.url()); await ctx2.close();
  // 3. registration through the UI
  // client screens: wait for hydration before typing, and confirm each step by its address
  const step = async (re, act) => { for (let i = 0; i < 3; i++) { await act(); try { await page.waitForURL(re, { timeout: 15000 }); return; } catch { await page.waitForTimeout(1000); } } throw new Error('step did not advance to ' + re); };
  await page.goto(`${PP}/register/plan`); await page.waitForLoadState('networkidle');
  await step(/register\/owner/, () => page.getByRole('button', { name: /continue/i }).click()); await page.waitForLoadState('networkidle');
  await page.getByLabel('First name').fill('Synthetic'); await page.getByLabel('Last name').fill('Owner One');
  await page.getByLabel('Work email').fill(cast.OWNER_1); await page.getByLabel('Mobile phone').fill('205-555-0110');
  await page.locator('#owner-declaration').check();
  await step(/register\/pharmacy/, () => page.getByRole('button', { name: /continue/i }).click()); await page.waitForLoadState('networkidle');
  await page.getByLabel('Pharmacy name').fill(storeName); await page.getByLabel('Street address').fill('1 Synthetic Way');
  await page.getByLabel('City').fill('Testville'); await page.locator('#ph-state').selectOption('AL').catch(async () => { await page.getByLabel('State').fill('AL'); });
  await page.getByLabel('ZIP').fill('35004'); await page.getByLabel('NPI').fill(npi); await page.getByLabel('Store phone').fill('205-555-0111');
  const lib = page.getByText('Liberty', { exact: true }); if (await lib.isVisible().catch(() => false)) await lib.click(); else await page.locator('#ph-software').selectOption('Liberty').catch(() => {});
  await step(/register\/review/, () => page.getByRole('button', { name: /continue|save/i }).last().click()); await page.waitForLoadState('networkidle');
  await page.getByTestId('due-today').waitFor();
  const base = await page.getByTestId('due-today').innerText();
  record('A6 server quote for one store is $99.00', /99\.00/.test(base), base);
  await page.locator('#code').fill('NOTACODE'); await page.getByRole('button', { name: 'Apply' }).click(); await page.waitForTimeout(1500);
  record('A7 a code outside the allowlist is refused with one generic message', /can.t be applied/i.test(await page.locator('#code-msg').innerText()), await page.locator('#code-msg').innerText());
  await page.locator('#code').fill('APA10SANDBOX'); await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByTestId('discount').waitFor({ timeout: 20000 });
  const due = await page.getByTestId('due-today').innerText();
  record('A8 the APA sandbox fixture takes 10% off the first invoice: $89.10', /89\.10/.test(due), due);
  await page.getByTestId('continue-payment').click(); await page.waitForTimeout(800);
  record('A9 checkout is refused until all three consents are given', await page.getByTestId('consent-error').isVisible().catch(() => false));
  for (const id of ['c1', 'c2', 'c3']) await page.locator('#' + id).check();
  await page.getByTestId('continue-payment').click();
  await payOnStripe(page, '4242424242424242', `${OUT}/a_stripe_filled.png`);
  count('stripe_checkout_sessions_completed', 1, 'A paid 4242');
  await page.waitForURL(`${PP}/register/activation`, { timeout: 90000 });
  record('A10 Stripe returns to the portal status page', true, page.url());
  await page.screenshot({ path: `${OUT}/a_activation_initial.png`, fullPage: true });
  // 4. wait for the signed webhook to provision
  let op; for (let i = 0; i < 45; i++) { [op] = await sql("select o.id, o.status, o.last_error_code, o.owner_was_existing, o.account_id, o.business_id, o.stripe_subscription_id, o.expected_total_cents from public.checkout_operations o where o.npi = $1", [npi]); if (op?.status === 'provisioned' || op?.status === 'attention') break; await page.waitForTimeout(2000); }
  writeFileSync(`${OUT}/a_state.json`, JSON.stringify({ npi, storeName, operationId: op?.id, accountId: op?.account_id, businessId: op?.business_id, subscriptionId: op?.stripe_subscription_id }));
  record('A11 the operation is provisioned', op?.status === 'provisioned', JSON.stringify({ status: op?.status, err: op?.last_error_code, existing: op?.owner_was_existing, total: op?.expected_total_cents }));
  await page.getByTestId('activation-signed-in').waitFor({ timeout: 30000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}/a_activation_done.png`, fullPage: true });
  record('A12 the status page shows the signed-in completion (no sign-in email needed)', await page.getByTestId('activation-signed-in').isVisible().catch(() => false));
} catch (e) { record('A-ERROR', false, e.message); await page.screenshot({ path: `${OUT}/a_error.png`, fullPage: true }).catch(() => {}); }
finally { save('a_register_pay'); await ctx.storageState({ path: `${OUT}/a_ctx.json` }); await browser.close(); }
