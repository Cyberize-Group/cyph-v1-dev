#!/usr/bin/env node
// QAM Q2 money-rule recomputation (Claudy; T-08 mocks, T-15 SCRATCH). QA arithmetic per evidence/derivations/01/money_rules.md.
//   node money-rules.mjs --mocks [<path to owedbook.ts>] [--out file]      (static; no connection)
//   node money-rules.mjs --scratch [--out file]                            (under qa-shim; reads user_data + references via QAH_DB_URL)
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
const a = process.argv.slice(2); const opt = n => { const i = a.indexOf(n); return i < 0 ? undefined : a[i + 1]; };
const r2 = v => Math.round((v + Number.EPSILON) * 100) / 100, r5 = v => Math.round((v + Number.EPSILON) * 1e5) / 1e5;
const FEE = 10.64, METHODS = new Set(['AAC', 'FUL', 'GWAC', 'BWAC', 'Take Action', 'Manual Override']);
const near = (x, y) => Math.abs(x - y) < 0.0051; // cents tolerance for numeric→float
let report;
if (a.includes('--mocks')) {
  const path = opt('--mocks') && !opt('--mocks').startsWith('--') ? opt('--mocks') : 'src/mocks/owedbook.ts';
  const src = readFileSync(path, 'utf8'); const start = src.indexOf('= [') + 2; const end = src.lastIndexOf('];') + 1;
  let rows; try { rows = JSON.parse(src.slice(start, end)); } catch { // baseline fixtures are JS object literals: load them as a module from a scratch copy
    const { writeFileSync: w } = await import('node:fs'); const { tmpdir } = await import('node:os'); const tmp = join(process.env.QA_SCRATCHPAD || tmpdir(), `mocks-${process.pid}.mjs`); w(tmp, 'export const rows = ' + src.slice(start, end) + ';\n'); rows = (await import('file://' + tmp)).rows; }
  const failures = [];
  for (const r of rows) {
    const f = [];
    if (r.medicaid_rate !== r5(r.medicaid_rate)) f.push('rate not 5dp');
    if (!near(r.expected, r2(r.qty * r5(r.medicaid_rate)) + FEE)) f.push(`rule1/2 expected ${r.expected} ≠ round(qty×rate,2)+10.64 = ${r2(r2(r.qty * r5(r.medicaid_rate)) + FEE)}`);
    if (!near(r.owed, r.expected - r.original_paid)) f.push(`rule3 owed ${r.owed} ≠ expected−paid ${r2(r.expected - r.original_paid)}`);
    if (!METHODS.has(r.method)) f.push(`rule5 method ${r.method}`);
    if (f.length) failures.push({ script: r.script, failures: f });
  }
  const statuses = new Set(rows.map(r => r.status)), pbms = new Set(rows.map(r => r.pbm).filter(Boolean));
  report = { mode: 'mocks', file: path, rows: rows.length, failures: failures.length, failing: failures.slice(0, 20), coverage: { statuses: [...statuses].sort(), distinctPbms: pbms.size, nullPbmRows: rows.filter(r => !r.pbm).length, negativeOwed: rows.filter(r => r.owed < 0).length, positiveOwed: rows.filter(r => r.owed > 0).length, federalNull: rows.every(r => r.federal_expected === null && r.federal_diff === null && r.aac === null && r.report_file === null) }, rule6: 'not applicable to the mock shape (no bin/pbm_key)', result: failures.length === 0 ? 'PASS' : 'FAIL' };
} else if (a.includes('--scratch')) {
  if (process.env.APBM_TARGET !== 'scratch' || !process.env.QAH_DB_URL) { console.error('run under qa-shim'); process.exit(2); }
  const require = createRequire(join(process.cwd(), 'package.json')); const pg = require('pg');
  pg.types.setTypeParser(1082, v => v); // DATE as text
  const c = new pg.Client({ connectionString: process.env.QAH_DB_URL }); await c.connect(); await c.query('BEGIN READ ONLY');
  const q = async s => (await c.query(s)).rows;
  const claims = await q(`select u.*, b.pharmacy_name from public.user_data u join public.businesses b on b.id=u.business_id order by b.pharmacy_name, u.script`);
  const aac = await q(`select ndc, aac_date::text, aac::float8 aac from public.aac_reference`), wac = await q(`select ndc, effective_date::text, wac::float8 wac, pkg_size::float8 pkg_size, pkg_size_mult::float8 pkg_size_mult, generic_indicator from public.wac_reference`), ful = await q(`select ndc, year, month, aca_ful::float8 aca_ful from public.ful_reference`), cfg = await q(`select key, state, value::float8 value, effective_date::text from public.system_config`);
  await c.query('ROLLBACK'); await c.end();
  const fee = cfg.find(x => x.key === 'dispensing_fee')?.value, brand = cfg.find(x => x.key === 'brand_multiplier')?.value;
  const failures = []; const perStore = {};
  for (const r of claims) {
    const f = []; const qty = Number(r.qty), rate = Number(r.medicaid_rate), exp = Number(r.expected_paid), paid = Number(r.total_paid), owed = Number(r.owed);
    const A = aac.find(x => x.ndc === r.drug_ndc && x.aac_date === '2026-01-01'), W = wac.find(x => x.ndc === r.drug_ndc && x.effective_date === '2026-01-01'), F = ful.find(x => x.ndc === r.drug_ndc && x.year === 2026 && x.month === 1);
    let raw, method;
    if (A) { raw = A.aac; method = 'AAC'; } else if (W) { const unit = W.wac / (W.pkg_size * W.pkg_size_mult); if (W.generic_indicator === 'B') { raw = unit * brand; method = 'BWAC'; } else { raw = unit; method = 'GWAC'; if (F && r5(raw) > F.aca_ful) { raw = F.aca_ful; method = 'FUL'; } } } else f.push('no reference row');
    if (raw !== undefined && !near(rate, r5(raw))) f.push(`rule4 rate ${rate} ≠ ${r5(raw)}`);
    if (method && r.medicaid_method !== method) f.push(`rule4 method ${r.medicaid_method} ≠ ${method}`);
    if (!near(exp - r2(qty * r5(rate)), fee)) f.push(`rule1 fee ${r2(exp - r2(qty * r5(rate)))} ≠ ${fee}`);
    if (!near(exp, r2(qty * r5(rate) + fee))) f.push('rule2 expected');
    if (!near(owed, exp - paid)) f.push('rule3 owed');
    if (!METHODS.has(r.medicaid_method)) f.push('rule5 vocabulary');
    if (r.pbm_key !== `${Number(r.bin)}-${r.pcn}-${r.group_field}`) f.push(`rule6 pbm_key ${r.pbm_key}`);
    const d10 = v => v == null ? null : (v instanceof Date ? v.toISOString() : String(v)).slice(0, 10);
    if (method === 'AAC' && d10(r.aac_date_used) !== '2026-01-01') f.push(`rule7 aac_date_used ${d10(r.aac_date_used)}`);
    if (method && method !== 'AAC' && d10(r.wac_date_used) !== '2026-01-01') f.push(`rule7 wac_date_used ${d10(r.wac_date_used)}`);
    if (method === 'FUL' && (r.ful_year_used !== 2026 || r.ful_month_used !== 1)) f.push('rule7 ful vintage');
    if (!r.rate_source) f.push('rule7 rate_source');
    if (f.length) failures.push({ store: r.pharmacy_name, script: r.script, failures: f });
    const s = perStore[r.pharmacy_name] ||= { rows: 0, statuses: new Set(), pbms: new Set(), nullPbm: 0, neg: 0, pos: 0 };
    s.rows++; s.statuses.add(r.status); if (r.insurance) s.pbms.add(r.insurance); else s.nullPbm++; if (owed < 0) s.neg++; if (owed > 0) s.pos++;
  }
  const coverage = Object.fromEntries(Object.entries(perStore).map(([k, v]) => [k, { rows: v.rows, statuses: [...v.statuses].sort(), distinctPbms: v.pbms.size, nullPbmRows: v.nullPbm, negativeOwed: v.neg, positiveOwed: v.pos }]));
  const covOk = Object.values(coverage).every(s => s.rows === 50 && s.statuses.length === 5 && s.distinctPbms >= 3 && s.nullPbmRows >= 1 && s.negativeOwed >= 1 && s.positiveOwed >= 1);
  report = { mode: 'scratch', rows: claims.length, references: { aac: aac.length, wac: wac.length, ful: ful.length, config: cfg.map(x => `${x.key}=${x.value} ${x.state} ${x.effective_date}`) }, failures: failures.length, failing: failures.slice(0, 20), coverage, coverageOk: covOk, result: failures.length === 0 && claims.length === 250 && covOk ? 'PASS' : 'FAIL' };
}
const out = opt('--out'); if (out) writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ mode: report.mode, rows: report.rows, failures: report.failures, result: report.result }));
process.exit(report.result === 'PASS' ? 0 : 1);
