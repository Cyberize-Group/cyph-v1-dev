// Fake token (never valid): enter through GET /api/auth/confirm like a real link, then watch.
import { chromium, PP } from './lib.mjs';
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' }); const ctx = await browser.newContext();
const page = await ctx.newPage(); const logs = []; let n = 0;
page.on('request', (r) => { if (r.isNavigationRequest() && n++ < 8) logs.push(`nav ${r.method()} ${r.url().replace(/token_hash=[^&]+/, 'token_hash=FAKE')} from=${r.redirectedFrom()?.url().replace(/token_hash=[^&]+/, 'token_hash=FAKE') ?? ''}`); });
page.on('response', async (r) => { if (r.request().isNavigationRequest() && n < 9) logs.push(`  <- ${r.status()} loc=${r.headers()['location'] ?? ''} set-cookie=${(r.headers()['set-cookie'] ?? '').split(';')[0].slice(0, 40)}`); });
await page.goto(`${PP}/api/auth/confirm?token_hash=${'f'.repeat(56)}&type=magiclink`); await page.waitForTimeout(4000);
console.log('navigations:', n); console.log(logs.join('\n'));
await browser.close();
