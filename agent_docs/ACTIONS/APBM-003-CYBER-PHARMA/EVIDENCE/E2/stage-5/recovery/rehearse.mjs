import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {loadEnv,assertScratch,evidencePath,repoRoot} from '../../../../../../../scripts/rls-harness/lib/env.mjs';
import {pgClient} from '../../../../../../../scripts/rls-harness/lib/db.mjs';
import {inspect} from '../../../../../../../scripts/dev-verify.mjs';
const env=loadEnv();assertScratch(env);const results=[];
function run(label,args,want=0,extra={}){const r=spawnSync(process.execPath,['scripts/apply-forward.mjs',...args],{cwd:repoRoot,env:{...process.env,...extra},encoding:'utf8',timeout:180000});writeFileSync(evidencePath(label+'.log'),(r.stdout||'')+(r.stderr||''));assert.equal(r.status,want,label);results.push({label,exit:r.status});console.log(`${label}: expected exit ${want}`);}
run('inventory',['inventory']);const manifest=evidencePath('migration-inventory.json');
run('baseline-replay',['scratch-reset','--manifest',manifest,'--through','47']);
const baseline=await inspect(env);writeFileSync(evidencePath('baseline.json'),JSON.stringify(baseline,null,2)+'\n');
// Simulate existing unledgered DEV baseline ONLY on the disposable SCRATCH.
let db=await pgClient(env);await db.query('DROP SCHEMA apbm_migrations CASCADE');await db.end();
run('init-ledger',['init-ledger','--manifest',manifest,'--baseline',evidencePath('baseline.json'),'--through','47']);
run('partial-failure',['apply','--manifest',manifest,'--before',evidencePath('baseline.json'),'--through','52','--fault-at','0052_system_config.sql'],1,{APBM_FAULT_REHEARSAL:env.projectRef});
const partial=await inspect(env);assert.equal(partial.ledger.at(-1).name,'0051_admin_reads.sql');assert.ok(!partial.snapshot.tables.some(t=>t.relname==='system_config'));writeFileSync(evidencePath('partial.json'),JSON.stringify(partial,null,2)+'\n');
run('remaining-chain-recovery',['apply','--manifest',manifest,'--before',evidencePath('partial.json'),'--through','52']);
const complete=await inspect(env);assert.equal(complete.ledger.length,52);assert.ok(complete.snapshot.tables.some(t=>t.relname==='system_config'));writeFileSync(evidencePath('complete.json'),JSON.stringify(complete,null,2)+'\n');
run('already-applied-noop',['apply','--manifest',manifest,'--before',evidencePath('complete.json'),'--through','52']);
const poison=JSON.parse(readFileSync(manifest));poison.files[51].sha256='0'.repeat(64);writeFileSync(evidencePath('poison-manifest.json'),JSON.stringify(poison));
run('reject-changed-inventory',['apply','--manifest',evidencePath('poison-manifest.json'),'--before',evidencePath('complete.json')],1);
run('reject-stale-catalog',['apply','--manifest',manifest,'--before',evidencePath('baseline.json')],1);
const after=await inspect(env);assert.equal(after.sha256,complete.sha256);assert.deepEqual(after.ledger,complete.ledger);
writeFileSync(evidencePath('recovery-rehearsal.json'),JSON.stringify({status:'PASS',projectRef:env.projectRef,results,failedMigration:'0052_system_config.sql',expectedError:'22012',lastPriorCommit:'0051_admin_reads.sql',failedDDLAbsent:true,recovery:'explicit remaining-chain application from verified partial catalog',backupRestoreRehearsal:false,limitation:'Does not prove restoration of affected DEV data/Auth. Director backup plus disposable restore evidence remains required at APPLY.'},null,2)+'\n');
