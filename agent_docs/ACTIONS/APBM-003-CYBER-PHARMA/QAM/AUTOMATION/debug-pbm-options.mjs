#!/usr/bin/env node
// QAM Q2 investigation helper (Claudy): why is the PBM picker empty for single-store identities on the QA server?
// Logs: pbm_options RPC responses (status + option count, no bodies kept), the options alert text, and the picker contents
// before and after Refresh. Credentials in memory only; DEV effects = 1 login + declared RPC reads.
import { createRequire } from 'node:module'; import { join, resolve } from 'node:path'; import { writeFileSync } from 'node:fs';
import { loadQaEnv, assertTarget } from './qa-env.mjs';
const a = process.argv.slice(2); const opt = n => { const i = a.indexOf(n); return i < 0 ? undefined : a[i + 1]; };
const tree = resolve(opt('--tree')); const who = opt('--who') || 'MEMBER_B1'; const out = opt('--out'); const BASE = 'http://127.0.0.1:3138';
const env = loadQaEnv(); assertTarget(env, 'dev'); const { chromium } = createRequire(join(tree, 'package.json'))('@playwright/test');
const browser = await chromium.launch({ headless: true }); const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const log = { who, rpc: [], console: [], steps: [] };
page.on('console', m => { if (['error', 'warning'].includes(m.type())) log.console.push(m.type() + ': ' + m.text().slice(0, 200)); });
page.on('response', async r => { if (r.url().includes('/rest/v1/rpc/owedbook_pbm_options')) { let n = null; try { const j = await r.json(); n = Array.isArray(j) ? j.length : typeof j; } catch {} log.rpc.push({ fn: 'owedbook_pbm_options', status: r.status(), optionCount: n, at: new Date().toISOString() }); } });
await page.goto(`${BASE}/auth`); await page.getByLabel('Email', { exact: true }).fill(env[`QA_${who}_EMAIL`]); await page.getByLabel('Password', { exact: true }).fill(env[`QA_${who}_PASSWORD`]); await page.getByRole('button', { name: 'Login', exact: true }).click(); await page.waitForURL('**/owedbook');
await page.getByText('Limit 25 · Total 50', { exact: true }).waitFor({ timeout: 30000 }); await page.waitForTimeout(1500);
const readPicker = async label => { const rail = page.locator('aside').last(); const alert = await page.getByRole('alert').allTextContents(); await rail.getByRole('button', { name: /PBMs/ }).click(); const opts = await page.locator('aside').last().locator('[role=option], label, li').allTextContents().catch(() => []); const noOpt = await page.getByText('No options', { exact: true }).isVisible().catch(() => false); await page.keyboard.press('Escape'); log.steps.push({ label, alerts: alert, optionTexts: opts.filter(t => /SYNTHETIC/.test(t)).slice(0, 5), noOptionsShown: noOpt }); };
await readPicker('after initial load');
if (a.includes('--sequence')) { // replay the matrix filter sequence step by step and read the picker after each
  const rail = () => page.locator('aside').last();
  const apply = async (fn, label) => { await fn(); await page.waitForTimeout(1200); await readPicker(label); };
  await apply(async () => { await rail().getByRole('combobox').first().click(); await page.getByRole('option', { name: 'Underpaid', exact: true }).click(); await rail().getByRole('button', { name: 'Apply', exact: true }).click(); await page.getByText('Limit 25 · Total 10', { exact: true }).waitFor(); }, 'after status filter Underpaid');
  await apply(async () => { await rail().getByRole('button', { name: 'Clear', exact: true }).click(); await page.getByText('Limit 25 · Total 50', { exact: true }).waitFor(); }, 'after Clear');
  await apply(async () => { await rail().locator('input[type=date]').nth(0).fill('2026-06-10'); await rail().locator('input[type=date]').nth(1).fill('2026-06-12'); await rail().getByRole('button', { name: 'Apply', exact: true }).click(); await page.getByText('Limit 25 · Total 6', { exact: true }).waitFor(); }, 'after date filter');
  await apply(async () => { await rail().getByRole('button', { name: 'Clear', exact: true }).click(); await page.getByText('Limit 25 · Total 50', { exact: true }).waitFor(); }, 'after Clear 2');
  await apply(async () => { await rail().locator('input[type=date]').nth(0).fill('2026-07-01'); await rail().locator('input[type=date]').nth(1).fill('2026-07-31'); await rail().getByRole('button', { name: 'Apply', exact: true }).click(); await page.getByText('No results', { exact: true }).waitFor(); }, 'after empty-range filter (No results)');
  await apply(async () => { await rail().getByRole('button', { name: 'Clear', exact: true }).click(); await page.getByText('Limit 25 · Total 50', { exact: true }).waitFor(); }, 'after Clear 3');
  await rail().getByRole('button', { name: /PBMs/ }).click(); await page.getByPlaceholder('Search PBMs...').fill('SYNTHETIC PBM 1'); await page.waitForTimeout(500); log.steps.push({ label: 'after typing search', noOptionsShown: await page.getByText('No options', { exact: true }).isVisible().catch(() => false), visibleOptions: await page.locator('aside').last().locator('[role=option], label, li').allTextContents().catch(() => []) }); await page.screenshot({ path: join(out, 'shots', `debug_pbm_${who}_search.png`) }); await page.keyboard.press('Escape');
}
await page.locator('aside').last().getByRole('button', { name: 'Get Fresh Data', exact: true }).click(); await page.waitForTimeout(2500); await page.getByText('Limit 25 · Total 50', { exact: true }).waitFor();
await readPicker('after Refresh');
await page.reload(); await page.getByText('Limit 25 · Total 50', { exact: true }).waitFor({ timeout: 30000 }); await page.waitForTimeout(1500); await readPicker('after hard reload');
await page.screenshot({ path: join(out, 'shots', `debug_pbm_${who}.png`) });
await ctx.request.post(`${BASE}/api/auth/logout`); await browser.close();
writeFileSync(join(out, `debug_pbm_${who}.json`), JSON.stringify(log, null, 2) + '\n'); console.log(JSON.stringify(log, null, 1));
