// Close the orphaned first attempt (session created before the USD fix): "go back and edit" through the app.
import { chromium, PP, record, save, sql } from './lib.mjs';
import { readFileSync } from 'node:fs';
const st = JSON.parse(readFileSync('out/a_state.json'));
const browser = await chromium.launch({ executablePath: '/home/moose/.cache/ms-playwright/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ storageState: 'out/a_ctx.json' }); const page = await ctx.newPage(); await page.goto(PP + '/register/plan');
const r = await page.request.delete(`${PP}/api/registration/checkout`, { headers: { Origin: PP } });
const [op] = await sql('select o.status, (select status from public.npi_reservations where operation_id = o.id) res from public.checkout_operations o where o.npi = $1', [st.npi]);
record('A0 abandoning an open checkout expires the Stripe session first and releases the NPI', r.status() === 200 && op.status === 'expired_unpaid' && op.res === 'released', JSON.stringify({ http: r.status(), ...op }));
save('a0_abandon'); await browser.close();
