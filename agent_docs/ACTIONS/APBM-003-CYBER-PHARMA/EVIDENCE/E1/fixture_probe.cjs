// Read-only probe: prints aggregate counts; no filesystem writes or network.
// Run from repo root: node agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_probe.cjs
const fs = require('fs'), vm = require('vm');
const ts = require(process.cwd() + '/node_modules/typescript');
const file = 'src/mocks/owedbook.ts';
const source = fs.readFileSync(file, 'utf8');
const code = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const box = {exports:{}}; vm.runInNewContext(code, box);
const rows = box.exports.owedBookFixtures;
const round2 = n => +n.toFixed(2);
console.log(JSON.stringify({rows:rows.length,
 expected_formula_pass:rows.filter(r=>Math.abs(r.expected-round2(r.qty*r.medicaid_rate+10.64))<1e-8).length,
 expected_formula_fail:rows.filter(r=>Math.abs(r.expected-round2(r.qty*r.medicaid_rate+10.64))>=1e-8).length,
 owed_formula_pass:rows.filter(r=>Math.abs(r.owed-round2(r.expected-r.original_paid))<1e-8).length},null,2));
