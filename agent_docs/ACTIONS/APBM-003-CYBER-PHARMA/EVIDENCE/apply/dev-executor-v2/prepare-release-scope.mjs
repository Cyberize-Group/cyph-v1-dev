// Local packaging/read-only Git inspection. Never stages, commits or accesses a DB.
import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import dotenv from 'dotenv';import {createHash} from 'node:crypto';
const base='agent_docs/ACTIONS/APBM-003-CYBER-PHARMA',dir=base+'/EVIDENCE/apply/dev-executor-v2';
const read=p=>JSON.parse(fs.readFileSync(p));const files=new Set(Object.keys(read(dir+'/BUNDLE_INPUTS.json')));
for(const p of Object.keys(read(base+'/EVIDENCE/E2/stage-6/REVIEW_FILES.json')))files.add(p);
for(const p of Object.keys(read(base+'/EVIDENCE/apply/dev-application-rehearsal/REVIEW_HASHES.json')))files.add(p);
for(const p of fs.readdirSync(dir)){const f=dir+'/'+p;if(fs.lstatSync(f).isFile())files.add(f);}
for(const p of ['APBM_ACCEPTANCE_LEDGER.md','APBM_EXECUTION_PLAN.md','APBM_JOURNAL.md','APBM_RULINGS.md','APBM_STATE.md','EVIDENCE/E2/DEV_APPLY_HANDOFF.md','EVIDENCE/E2/GIT_HANDOFF.md','EVIDENCE/E2/SOURCE_HASHES.json','EVIDENCE/E2/stage-6/REVIEW_FILES.json','EVIDENCE/E2/stage-6/ZIP_RECEIPT.json'])files.add(base+'/'+p);
// Dependency of the preserved synthetic rehearsal's local evaluator; no replay.
files.add(base+'/EVIDENCE/apply/dev-restored-rehearsal/acl-exception.mjs');
for(const p of ['RELEASE_PATHS.txt','RELEASE_SHA256.json','SCOPE_CHECK.json'])files.add(dir+'/'+p);
const response=process.argv[2];if(response){assert.match(response,/^agent_docs\/RESPONSES\/response_[A-Za-z0-9_.-]+\.md$/);files.add(response);}
const paths=[...files].sort();const excluded=['src/components/admin-portal/DemoMarker.tsx','src/components/admin-portal/BillingScreen.tsx'];for(const p of excluded)assert.ok(!files.has(p),'pending copy-only file included');
for(const p of paths){assert.ok(!path.isAbsolute(p)&&!p.split('/').includes('..')&&!p.includes('\n')&&!p.includes('\0'));assert.ok(!p.split('/').some(x=>x.startsWith('.env')||x==='.git'));assert.ok(!/\.dump$|\.private\.|credentials|private-backup/i.test(p),'private path included');}
const changed=spawnSync('git',['ls-files','--modified','-z'],{encoding:'utf8'});assert.equal(changed.status,0);const modified=changed.stdout.split('\0').filter(Boolean);assert.ok(modified.every(p=>files.has(p)),'modified tracked file outside package');
const staged=spawnSync('git',['diff','--cached','--quiet']);assert.equal(staged.status,0,'initial index must be empty');
fs.writeFileSync(dir+'/RELEASE_PATHS.txt',paths.join('\n')+'\n');
const raw=dotenv.parse(fs.readFileSync('.env.local'));const secrets=[];for(const [k,value]of Object.entries(raw)){if(/KEY|TOKEN|PASSWORD|SECRET/.test(k)&&value.length>=16)secrets.push(value);if(/DB_URL|DB_POOL|CONNECTION_STR/.test(k)){try{const u=new URL(value);if(u.password.length>=8){secrets.push(u.password,decodeURIComponent(u.password));}}catch{}}}
for(const p of paths){if(['RELEASE_SHA256.json','SCOPE_CHECK.json'].some(n=>p===dir+'/'+n))continue;const st=fs.lstatSync(p);assert.ok(st.isFile()&&!st.isSymbolicLink());const data=fs.readFileSync(p,'utf8');assert.ok(!secrets.some(s=>data.includes(s)),'credential match in '+p);}
const result={status:'PASS',files:paths.length,modifiedTrackedFiles:modified.length,allModifiedTrackedFilesIncluded:true,indexInitiallyEmpty:true,pendingCopyOnlyFilesExcluded:excluded,credentialMatches:0,privateBackupsIncluded:false,gitMutations:false,scope:'Literal reviewed input/evidence/source paths; no globs or unrelated untracked files'};
fs.writeFileSync(dir+'/SCOPE_CHECK.json',JSON.stringify(result,null,2)+'\n');
const hashes=Object.fromEntries(paths.filter(p=>p!==dir+'/RELEASE_SHA256.json').map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));fs.writeFileSync(dir+'/RELEASE_SHA256.json',JSON.stringify(hashes,null,2)+'\n');console.log(JSON.stringify(result));
