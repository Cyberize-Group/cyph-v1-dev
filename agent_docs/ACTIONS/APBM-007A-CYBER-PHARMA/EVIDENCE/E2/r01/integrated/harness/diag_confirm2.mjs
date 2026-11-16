// No real token: a dummy confirmation context cookie, to observe the confirm page's behaviour safely.
import { chromium, PP } from './lib.mjs';
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' }); const ctx = await browser.newContext();
await ctx.addCookies([{ name: 'cyph-pp-cf-local', value: encodeURIComponent(JSON.stringify({ h: 'a'.repeat(56), y: 'magiclink', n: '/dashboard', c: 'c'.repeat(43) })), domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }]);
const page = await ctx.newPage(); let docs = 0; const logs = [];
page.on('response', (r) => { if (r.request().resourceType() === 'document') { docs++; if (docs < 4) logs.push(`doc ${r.status()} ${r.url()}`); } });
page.on('request', (r) => { if (r.isNavigationRequest() && docs < 4) logs.push(`nav-req ${r.method()} ${r.url()} redirectedFrom=${r.redirectedFrom()?.url() ?? ''}`); });
page.on('console', (m) => logs.push(m.type() + ': ' + m.text().slice(0, 220)));
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message.slice(0, 220)));
await page.goto(PP + '/auth/confirm'); await page.waitForTimeout(1500); docs = 0;
page.on('request', (r) => { if (r.url().includes('/auth/confirm')) logs.push(`after-click req ${r.method()} ${r.url()} type=${r.resourceType()}`); });
await page.getByTestId('confirm-sign-in').click(); await page.waitForTimeout(4000);
console.log('document loads in 5s:', docs); console.log(logs.slice(0, 25).join('\n'));
await browser.close();
