// Inspect the card option on an open Checkout page reached through the app, then go back to editing. Card data is not entered.
import { chromium, PP, cast, signInUrl } from './lib.mjs';
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ storageState: 'out/a_ctx.json' }); const page = await ctx.newPage();
await page.goto(PP + '/register/review'); await page.waitForLoadState('networkidle');
for (const id of ['c1', 'c2', 'c3']) await page.locator('#' + id).check().catch(() => {});
await page.getByTestId('continue-payment').click(); await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 }); await page.waitForLoadState('networkidle');
const info = await page.evaluate(() => [...document.querySelectorAll('input[type=radio], button, [role=radio]')].slice(0, 25).map((e) => `${e.tagName} id=${e.id} name=${e.getAttribute('name')} value=${e.getAttribute('value')} testid=${e.getAttribute('data-testid')} aria=${e.getAttribute('aria-label')} text=${(e.textContent || '').trim().slice(0, 30)}`));
console.log(info.join('\n'));
await ctx.storageState({ path: 'out/a_ctx.json' }); await browser.close();
