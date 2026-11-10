#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {loadEnv,assertScratch,evidencePath,repoRoot} from './lib/env.mjs';
const env=loadEnv();assertScratch(env);if(process.env.APBM_ALLOW_DESTRUCTIVE!==env.projectRef)throw new Error('explicit SCRATCH destructive confirmation required');
process.env.APBM_CREDENTIAL_FILE??=`/tmp/apbm003-audit-${process.pid}-${Date.now()}.json`;
const steps=[['fenced replay','scripts/apply-forward.mjs','scratch-reset','--manifest',evidencePath('migration-inventory.json')],['legacy cast cleanup','scripts/rls-harness/audit-seed.mjs'],['seed slice reset','scripts/seed/reset.mjs'],['catalog','scripts/rls-harness/audit-catalog.mjs'],['synthetic seed','scripts/seed/run.mjs'],['seed arithmetic','scripts/seed/verify.mjs','--attack'],['real-user audit proof','scripts/rls-harness/audit-session.mjs'],['DB structural oracle','scripts/db-verify.mjs']];
const results=[];let failed=false;
for(const [name,file,...args]of steps){console.log(`Starting ${name}`);const r=spawnSync(process.execPath,[join(repoRoot,file),...args],{cwd:repoRoot,env:process.env,encoding:'utf8',timeout:600000,maxBuffer:8*1024*1024});const output=(r.stdout||'')+(r.stderr||'');writeFileSync(evidencePath(`audit-${results.length+1}.log`),output);results.push({name,exit:r.status});console.log(`${name}: ${r.status===0?'PASS':'FAIL'}`);if(r.status!==0){failed=true;break;}}
writeFileSync(evidencePath('audit-prove.json'),JSON.stringify({projectRef:env.projectRef,status:failed?'FAIL':'PASS',results,credentialFile:process.env.APBM_CREDENTIAL_FILE},null,2)+'\n');process.exitCode=failed?1:0;
