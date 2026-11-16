// APBM007A r03 — engineering production-browser proof for F-Q2-001. Fresh Chromium context, public registration
// from the plan step through owner and pharmacy to review with the server quote; refresh; edit/back/return.
// STOPS AT REVIEW: the checkout endpoint and every Stripe host are blocked at the network layer and counted, no
// consent box is ticked and the payment button is never pressed. Synthetic details only (example.test, a
// generated check-digit-valid NPI). No Auth identity, email, Checkout or payment. Writes sanitized evidence only.
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r03/proof-pp/package.json');
const { chromium } = require('playwright');

const BASE = 'http://localhost:3101';
const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });

// NPI check digit (Luhn over the 80840 prefix plus the first nine digits).
function npiWithCheckDigit(nine) {
  const digits = ('80840' + nine).split('').map(Number);
  let sum = 0;
  for (let i = digits.length - 1, dbl = true; i >= 0; i--, dbl = !dbl) {
    let d = digits[i];
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return nine + String((10 - (sum % 10)) % 10);
}
const NPI = npiWithCheckDigit('1' + String(Math.floor(Math.random() * 1e8)).padStart(8, '0'));
const OWNER = { first: 'Eng', last: 'Proof R03', email: 'eng.proof.r03@example.test', mobile: '(555) 010-0177' };
const PHARMACY = { name: 'R03 Synthetic Proof Pharmacy', street: '100 Test Lane', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0178', software: 'Liberty' };

const log = { started_at: new Date().toISOString(), base: BASE, viewport: '1440x1000', synthetic: { owner_email_domain: 'example.test', npi: NPI }, steps: [], routes: [], api: [], blocked: [], console_errors: [] };
const step = (name, data = {}) => { log.steps.push({ at: new Date().toISOString(), name, ...data }); console.log('step', name, JSON.stringify(data)); };

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });   // fresh: no cookies, no storage
const page = await context.newPage();

// Safety net: nothing past review can leave this browser.
await context.route('**/api/registration/checkout**', (r) => { log.blocked.push(`${r.request().method()} /api/registration/checkout`); return r.abort(); });
await context.route(/stripe\.com/, (r) => { log.blocked.push(`${r.request().method()} ${new URL(r.request().url()).host}`); return r.abort(); });

page.on('framenavigated', (f) => { if (f === page.mainFrame()) log.routes.push(new URL(f.url()).pathname); });
page.on('console', (m) => { if (m.type() === 'error') log.console_errors.push(m.text().slice(0, 200)); });
page.on('response', async (res) => {
  const u = new URL(res.url());
  if (!u.pathname.startsWith('/api/registration/')) return;
  const entry = { method: res.request().method(), path: u.pathname, status: res.status() };
  try {
    const body = await res.json();
    const d = body.draft;
    if (d === null) entry.draft = null;
    else if (d) entry.draft = { revision: d.revision, status: d.status, owner_saved: !!d.owner?.firstName, pharmacy_saved: !!d.pharmacy?.name, quote: d.quote ? { totalCents: d.quote.totalCents, currency: d.quote.currency, promotionCode: d.quote.promotionCode, expired: d.quote.expired, expiresAt: d.quote.expiresAt } : null };
    if (body.error) entry.error = body.error;
  } catch { /* non-JSON */ }
  log.api.push(entry);
});

const path = () => new URL(page.url()).pathname;
const waitPath = (p) => page.waitForURL((u) => u.pathname === p, { timeout: 20000 });
async function holdAt(p, ms = 3000) {
  await page.waitForTimeout(ms);
  if (path() !== p) throw new Error(`left ${p} for ${path()}`);
}
async function reviewWithQuote(label) {
  await waitPath('/register/review');
  const due = page.getByTestId('due-today');
  await due.waitFor({ timeout: 20000 });
  await holdAt('/register/review');
  const shot = `${OUT}/${label}.png`;
  await page.screenshot({ path: shot, fullPage: true });
  const consents = await page.$$eval('#c1, #c2, #c3', (els) => els.map((e) => e.checked));
  const data = {
    path: path(), heading: await page.getByRole('heading', { level: 1 }).textContent(),
    due_today: await due.textContent(), pharmacy: (await page.getByTestId('review-pharmacy').textContent()).includes(PHARMACY.name),
    pharmacy_text_has_npi: (await page.getByTestId('review-pharmacy').textContent()).includes(NPI),
    consents_ticked: consents, payment_button_enabled: await page.getByTestId('continue-payment').isEnabled(), screenshot: shot.split('/').pop(),
  };
  step(`review: ${label}`, data);
  return data;
}

try {
  await page.goto(`${BASE}/register/plan`);
  await page.getByRole('button', { name: 'Continue' }).click();
  await waitPath('/register/owner');
  await page.getByLabel(/First name/).waitFor();
  step('owner step reached from plan', { path: path() });

  await page.getByLabel(/First name/).fill(OWNER.first);
  await page.getByLabel(/Last name/).fill(OWNER.last);
  await page.getByLabel(/Work email/).fill(OWNER.email);
  await page.getByLabel(/Mobile phone/).fill(OWNER.mobile);
  await page.locator('#owner-declaration').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await waitPath('/register/pharmacy');
  await page.getByLabel(/NCPDP number/).waitFor();
  step('owner submitted, pharmacy step shown', { path: path() });

  await page.getByLabel(/Pharmacy name/).fill(PHARMACY.name);
  await page.getByLabel(/Street address/).fill(PHARMACY.street);
  await page.getByLabel(/^City/).fill(PHARMACY.city);
  await page.locator('#ph-state').selectOption(PHARMACY.state);
  await page.getByLabel(/^ZIP/).fill(PHARMACY.zip);
  await page.getByLabel(/^NPI/).fill(NPI);
  await page.getByLabel(/Store phone/).fill(PHARMACY.phone);
  await page.locator('#ph-software').selectOption(PHARMACY.software);
  await page.getByRole('button', { name: 'Continue to review' }).click();
  const first = await reviewWithQuote('1-first-arrival');

  await page.reload();
  const refreshed = await reviewWithQuote('2-after-refresh');

  await page.getByRole('link', { name: 'Edit pharmacy' }).click();
  await waitPath('/register/pharmacy');
  const prefilled = await page.getByLabel(/Pharmacy name/).inputValue();
  step('edit pharmacy from review', { path: path(), prefilled_name_matches: prefilled === PHARMACY.name, prefilled_npi_matches: (await page.getByLabel(/^NPI/).inputValue()) === NPI });
  PHARMACY.name = `${PHARMACY.name} East`;
  await page.getByLabel(/Pharmacy name/).fill(PHARMACY.name);
  await page.getByRole('button', { name: 'Continue to review' }).click();
  const edited = await reviewWithQuote('3-after-pharmacy-edit');

  await page.getByRole('link', { name: 'Edit billing owner' }).click();
  await waitPath('/register/owner');
  await page.getByLabel(/First name/).waitFor();
  step('edit owner from review', { path: path(), prefilled_first_matches: (await page.getByLabel(/First name/).inputValue()) === OWNER.first, declaration_still_ticked: await page.locator('#owner-declaration').isChecked() });
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await waitPath('/register/pharmacy');
  await page.getByLabel(/NCPDP number/).waitFor();
  await page.getByRole('button', { name: 'Back' }).click();
  await waitPath('/register/owner');
  await page.getByLabel(/First name/).waitFor();
  step('back from pharmacy to owner', { path: path(), first_name_kept: (await page.getByLabel(/First name/).inputValue()) === OWNER.first });
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await waitPath('/register/pharmacy');
  await page.getByLabel(/NCPDP number/).waitFor();
  step('pharmacy again', { path: path(), name_kept: (await page.getByLabel(/Pharmacy name/).inputValue()) === PHARMACY.name });
  await page.getByRole('button', { name: 'Continue to review' }).click();
  const returned = await reviewWithQuote('4-after-edit-back-return');

  log.result = {
    reached_review_with_quote: [first, refreshed, edited, returned].every((r) => r.path === '/register/review' && /\$\d/.test(r.due_today)),
    no_consent_ticked: [first, refreshed, edited, returned].every((r) => r.consents_ticked.every((c) => c === false)),
    checkout_requests_attempted: log.blocked.length,
    stopped_at: path(),
  };
  step('STOP at review — no consent ticked, payment not pressed', log.result);
} catch (e) {
  log.failure = { message: String(e.message).slice(0, 300), path: path() };
  await page.screenshot({ path: `${OUT}/failure.png`, fullPage: true }).catch(() => {});
  console.log('FAILED', log.failure);
} finally {
  log.finished_at = new Date().toISOString();
  writeFileSync(`${OUT}/walk.json`, JSON.stringify(log, null, 1));
  await browser.close();
}
