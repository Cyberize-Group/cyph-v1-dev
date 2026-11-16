// APBM007A r06 — engineering production-build browser walk for U-1, U-2 and U-3. FIXTURE PROOF: both apps run their
// production builds (disposable proof copies on 3100/3101) against helpers/supabase-fixture.mjs; no real Supabase,
// Stripe, Auth or email is reachable (the proof builds only know the fixture's address). Writes walk.json + screenshots.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r06/pp/package.json');
const { chromium } = require('playwright');

const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const OB = 'http://localhost:3100', PP = 'http://localhost:3101', FIXTURE = 'http://127.0.0.1:54399';
// Expected colours are read from the page's own tokens (attempt 2 hard-coded coral and was off by one in rounding).
let CORAL = null, WHITE = null;
async function tokens(page) {
  return page.evaluate(() => {
    const d = document.createElement('div'); document.body.appendChild(d);
    d.style.backgroundColor = 'hsl(var(--primary))'; d.style.color = 'hsl(var(--primary-foreground))';
    const cs = getComputedStyle(d); const out = { coral: cs.backgroundColor, white: cs.color }; d.remove(); return out;
  });
}
const TOKEN = 'fixture-access-token';
const USER = { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', aud: 'authenticated', role: 'authenticated', email: 'owner.fixture@example.test',
  app_metadata: { provider: 'email' }, user_metadata: { full_name: 'Fixture Owner' }, created_at: '2026-11-01T00:00:00Z' };
const sessionCookie = () => ({ name: 'cyph-ob-auth-local', domain: 'localhost', path: '/', sameSite: 'Lax',
  value: 'base64-' + Buffer.from(JSON.stringify({ access_token: TOKEN, token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'fixture-refresh', user: USER })).toString('base64url') });
const scenario = (name) => fetch(`${FIXTURE}/__scenario/${name}`).then((r) => r.json());

const log = { started_at: new Date().toISOString(), kind: 'FIXTURE PROOF (production builds against a local Supabase stand-in); not live proof', checks: [], screenshots: [], requests: [] };
const check = (name, ok, data = {}) => { log.checks.push({ name, ok: !!ok, ...data }); console.log(ok ? 'PASS' : 'FAIL', name, JSON.stringify(data).slice(0, 220)); };
const browser = await chromium.launch();

async function context({ theme, width, signedIn }) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 820 : 950 } });
  await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
  if (signedIn) await ctx.addCookies([sessionCookie()]);
  const page = await ctx.newPage();
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.port === '54399' || u.pathname.startsWith('/api/')) log.requests.push({ theme, width, method: r.method(), host: u.host, path: u.pathname });
  });
  return { ctx, page };
}
const shot = async (page, name) => { const f = `${name}.png`; await page.screenshot({ path: `${OUT}/${f}`, fullPage: false }); log.screenshots.push(f); };

/** Selection state of the Admin Portal nav that is visible now (desktop sidebar, or the drawer on a phone). */
// The links have a 150 ms colour transition; measure once it has settled (attempt 1 measured mid-transition).
async function navState(page, scope) {
  await page.waitForTimeout(400);
  return page.locator(`${scope} nav[aria-label="Admin Portal"] a`).evaluateAll((links) => links.map((a) => {
    const cs = getComputedStyle(a);
    return { label: a.textContent.trim(), current: a.getAttribute('aria-current'), bg: cs.backgroundColor, color: cs.color, border: cs.borderTopColor, boxShadow: cs.boxShadow };
  }));
}
const only = (state, label) => {
  const sel = state.filter((s) => s.current === 'page').map((s) => s.label);
  const filled = state.filter((s) => s.bg === CORAL).map((s) => s.label);
  const selectedLooksRight = state.filter((s) => s.label === label).every((s) => s.bg === CORAL && s.color === WHITE);
  return sel.length === 1 && sel[0] === label && filled.length === 1 && filled[0] === label && selectedLooksRight;
};

try {
  // ── U-1 and U-2 in both themes at 1440 and 375 ──
  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 375]) {
      await scenario('paid');
      const tag = `${theme}-${width}`;
      const { ctx, page } = await context({ theme, width, signedIn: true });
      await page.goto(`${OB}/admin-portal/audit`);
      check(`[${tag}] dark class matches theme`, (await page.evaluate(() => document.documentElement.classList.contains('dark'))) === (theme === 'dark'));
      ({ coral: CORAL, white: WHITE } = await tokens(page));
      log.tokens = { ...(log.tokens || {}), [tag]: { primary: CORAL, primaryForeground: WHITE } };
      let scope = '[data-testid="desktop-sidebar"]';
      if (width < 500) {
        await page.getByRole('button', { name: 'Open Menu', exact: true }).click();
        scope = '[data-testid="sidebar-drawer"]';
      }
      await page.locator(`${scope} nav[aria-label="Admin Portal"]`).waitFor();
      let st = await navState(page, scope);
      check(`[${tag}] on Audit log only Audit log is selected (coral fill, white text)`, only(st, 'Audit log'), { st });
      await shot(page, `u1-${tag}-audit`);

      const billing = page.locator(`${scope} nav[aria-label="Admin Portal"] a`, { hasText: 'Billing' });
      if (width >= 500) {
        await billing.hover();
        st = await navState(page, scope);
        const b = st.find((s) => s.label === 'Billing');
        check(`[${tag}] hovering Billing: coral outline, no fill; Audit log stays the only selection`, b.border === CORAL && b.bg !== CORAL && only(st, 'Audit log'), { billing: b });
        await shot(page, `u1-${tag}-hover-billing`);
        // keyboard: Tab until a nav link has focus, then check its visible ring
        await page.mouse.move(5, 5);
        await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
        let focused = null;
        for (let i = 0; i < 40 && !focused; i++) {
          await page.keyboard.press('Tab');
          focused = await page.evaluate(() => { const a = document.activeElement; return a && a.closest('nav[aria-label="Admin Portal"]') ? { label: a.textContent.trim(), boxShadow: getComputedStyle(a).boxShadow, focusVisible: a.matches(':focus-visible') } : null; });
        }
        check(`[${tag}] keyboard focus on a nav link shows a visible ring`, !!focused && focused.focusVisible && focused.boxShadow !== 'none', { focused });
        await shot(page, `u1-${tag}-keyboard-focus`);
      }
      await billing.click();
      await page.waitForURL(/\/admin-portal\/billing$/);
      if (width < 500) { await page.locator(scope).waitFor({ state: 'detached' }); await page.getByRole('button', { name: 'Open Menu', exact: true }).click(); }   // the drawer closes on navigation
      await page.locator(`${scope} nav[aria-label="Admin Portal"]`).waitFor();
      st = await navState(page, scope);
      check(`[${tag}] after Audit log → Billing only Billing is selected; Audit log keeps no highlight`, only(st, 'Billing'), { st });
      if (width < 500 && await page.locator(scope).count()) await page.locator(`${scope} button[aria-label="Close"]`).click();

      // ── U-2: billing details from the paid-subscription shape ──
      const row = page.locator('p.text-\\[13px\\]').first();
      await row.waitFor();
      const text = (await row.textContent()).trim();
      check(`[${tag}] billing row shows plan, pharmacies, price pointer and next payment`, text === 'OwedBook · 1 pharmacy · Price shown in the billing portal · Next payment Dec 16, 2026', { text });
      check(`[${tag}] no unavailable text for the paid subscription`, !/Plan unavailable|Billing dates unavailable/.test(await page.locator('main, body').first().textContent()));
      check(`[${tag}] real mode: per-store payment actions hidden; one Manage billing link`, (await page.getByRole('button', { name: 'Manage payment' }).count()) === 0 || !(await page.getByRole('button', { name: 'Manage payment' }).first().isVisible()), {});
      await shot(page, `u2-${tag}-billing-paid`);

      // back to Audit log by the nav, then the selection follows
      if (width < 500) await page.getByRole('button', { name: 'Open Menu', exact: true }).click();
      await page.locator(`${scope} nav[aria-label="Admin Portal"] a`, { hasText: 'Audit log' }).click();
      await page.waitForURL(/\/admin-portal\/audit$/);
      if (width < 500) { await page.locator(scope).waitFor({ state: 'detached' }); await page.getByRole('button', { name: 'Open Menu', exact: true }).click(); }
      await page.locator(`${scope} nav[aria-label="Admin Portal"]`).waitFor();
      check(`[${tag}] Billing → Audit log moves the selection back`, only(await navState(page, scope), 'Audit log'));
      await ctx.close();
    }
  }

  // ── U-2: synthetic labelling and owner-only access (1440 light) ──
  {
    const { ctx, page } = await context({ theme: 'light', width: 1440, signedIn: true });
    await scenario('synthetic');
    await page.goto(`${OB}/admin-portal/billing`);
    const row = page.locator('p.text-\\[13px\\]').first(); await row.waitFor();
    const text = (await row.textContent()).trim();
    check('[synthetic] synthetic subscription is labelled and shows no price or dates', text === 'Synthetic test subscription · Not billed · No billing dates', { text });
    await shot(page, 'u2-synthetic');
    await scenario('nonowner');
    await page.goto(`${OB}/admin-portal/billing`);
    ({ coral: CORAL, white: WHITE } = await tokens(page));
    const note = page.getByTestId('billing-owner-only'); await note.waitFor();
    check('[non-owner admin] billing shows the owner-only statement and no billing details', (await note.textContent()).includes('Billing is managed by the account owner') && (await page.locator('p.text-\\[13px\\]').count()) === 0);
    check('[non-owner admin] nav still selects only Billing', only(await navState(page, '[data-testid="desktop-sidebar"]'), 'Billing'));
    await shot(page, 'u2-nonowner');
    await scenario('paid');
    await ctx.close();
  }

  // ── U-3: password toggles in both apps ──
  async function passwordChecks(tag, page, input, { submitPath }) {
    const before = log.requests.length;
    await input.fill('');
    await input.type('Fixture-Pass-1');
    const toggle = page.getByRole('button', { name: 'Show password' }).first();
    check(`[${tag}] starts hidden; toggle is type=button, aria-pressed=false`, (await input.getAttribute('type')) === 'password' && (await toggle.getAttribute('type')) === 'button' && (await toggle.getAttribute('aria-pressed')) === 'false');
    await toggle.click();
    const hide = page.getByRole('button', { name: 'Hide password' }).first();
    check(`[${tag}] click shows it: type=text, value kept, label Hide password, aria-pressed=true, focus stays in the field`,
      (await input.getAttribute('type')) === 'text' && (await input.inputValue()) === 'Fixture-Pass-1' && (await hide.getAttribute('aria-pressed')) === 'true' && (await input.evaluate((el) => el === document.activeElement)));
    await page.keyboard.type('X');
    check(`[${tag}] typing continues after the toggle`, (await input.inputValue()) === 'Fixture-Pass-1X');
    await shot(page, `u3-${tag}-shown`);
    await input.focus(); await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => { const a = document.activeElement; return { label: a.getAttribute('aria-label'), boxShadow: getComputedStyle(a).boxShadow, fv: a.matches(':focus-visible') }; });
    check(`[${tag}] Tab from the field reaches the toggle with a visible focus ring`, focused.label === 'Hide password' && focused.fv && focused.boxShadow !== 'none', { focused });
    await page.keyboard.press('Space');
    check(`[${tag}] Space hides it again; value kept`, (await input.getAttribute('type')) === 'password' && (await input.inputValue()) === 'Fixture-Pass-1X');
    await page.keyboard.press('Enter');
    check(`[${tag}] Enter on the toggle shows it and submits nothing`, (await input.getAttribute('type')) === 'text');
    await page.waitForTimeout(500);
    const after = log.requests.slice(before).filter((r) => r.method !== 'GET' && (submitPath.test(r.path)));
    check(`[${tag}] no submission request while toggling`, after.length === 0, { after });
    await shot(page, `u3-${tag}-keyboard`);
  }
  for (const [theme, width] of [['light', 1440], ['dark', 375]]) {
    const { ctx, page } = await context({ theme, width, signedIn: false });
    await page.goto(`${OB}/auth`);
    await passwordChecks(`OwedBook sign-in ${theme}-${width}`, page, page.getByLabel('Password', { exact: true }), { submitPath: /\/auth\/v1\/token|\/api\/auth\/login/ });
    await ctx.close();
    const pp = await context({ theme, width, signedIn: false });
    await pp.page.goto(`${PP}/login`);
    await passwordChecks(`Portal sign-in ${theme}-${width}`, pp.page, pp.page.getByLabel('Password', { exact: true }), { submitPath: /\/api\/auth\/login|\/auth\/v1\/token/ });
    await pp.ctx.close();
  }
  {
    const { ctx, page } = await context({ theme: 'light', width: 1440, signedIn: true });
    await page.goto(`${OB}/profile`);
    const fields = [page.getByPlaceholder('Minimum 8 characters'), page.getByPlaceholder('Re-enter new password')];
    await fields[0].waitFor();
    check('[OwedBook profile] two password fields, each with its own toggle', (await page.getByRole('button', { name: 'Show password' }).count()) === 2);
    await passwordChecks('OwedBook profile new password', page, fields[0], { submitPath: /\/auth\/v1\/user$/ });
    check('[OwedBook profile] the confirm field stayed hidden while the first was shown', (await fields[1].getAttribute('type')) === 'password');
    const puts = log.requests.filter((r) => r.method === 'PUT' && r.path === '/auth/v1/user');
    check('[OwedBook profile] no password update was sent', puts.length === 0);
    await ctx.close();
  }
} catch (e) {
  log.failure = String(e.message).slice(0, 400);
  console.log('STOP', log.failure);
} finally {
  log.finished_at = new Date().toISOString();
  log.summary = { checks: log.checks.length, passed: log.checks.filter((c) => c.ok).length, failed: log.checks.filter((c) => !c.ok).map((c) => c.name) };
  writeFileSync(`${OUT}/walk.json`, JSON.stringify(log, null, 1));
  console.log(JSON.stringify(log.summary));
  await browser.close();
}
