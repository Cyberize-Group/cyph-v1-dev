// No token used: loads the public link-expired page and the plan page and watches for self-reloads and console errors.
import { chromium, PP } from './lib.mjs';
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' }); const ctx = await browser.newContext();
for (const path of ['/auth/link-expired', '/register/plan', '/login']) {
  const page = await ctx.newPage(); let docs = 0; const logs = [];
  page.on('response', (r) => { if (r.request().resourceType() === 'document') docs++; });
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(m.type() + ': ' + m.text().slice(0, 200)); });
  page.on('pageerror', (e) => logs.push('pageerror: ' + e.message.slice(0, 200)));
  await page.goto(PP + path); await page.waitForTimeout(6000);
  console.log(path, 'document loads in 6s:', docs); console.log(logs.slice(0, 6).join('\n')); await page.close();
}
await browser.close();
