import assert from 'node:assert/strict';
import { writeFileSync, symlinkSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { validateConfig,evidenceRoot,evidencePath,safeLabel,repoRoot,SCRATCH_REF,DEV_REF } from '../../../../../../scripts/rls-harness/lib/env.mjs';
const base={RLS_REPLICA_DB_URL:`postgres://postgres.${SCRATCH_REF}:dummy@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,RLS_REPLICA_SUPABASE_URL:`https://${SCRATCH_REF}.supabase.co`,RLS_REPLICA_PUBLISHABLE_KEY:'sb_publishable_synthetic',RLS_REPLICA_SECRET_KEY:'sb_secret_synthetic'};
const options={prefix:'RLS_REPLICA_',target:'scratch',projectRef:SCRATCH_REF,sharedDevRef:DEV_REF};const checks=[];
function test(name,fn){fn();checks.push({name,status:'PASS'});}
test('matching complete target accepted',()=>assert.equal(validateConfig(base,options).projectRef,SCRATCH_REF));
for(const name of Object.keys(base))test(`missing ${name} rejected`,()=>{const raw={...base};delete raw[name];assert.throws(()=>validateConfig(raw,options));});
test('missing explicit prefix rejected',()=>assert.throws(()=>validateConfig(base,{...options,prefix:undefined})));
test('mismatched SQL rejected',()=>assert.throws(()=>validateConfig({...base,RLS_REPLICA_DB_URL:base.RLS_REPLICA_DB_URL.replace(SCRATCH_REF,DEV_REF)},options)));
test('mismatched API rejected',()=>assert.throws(()=>validateConfig({...base,RLS_REPLICA_SUPABASE_URL:`https://${DEV_REF}.supabase.co`},options)));
test('DEV-as-SCRATCH rejected',()=>assert.throws(()=>validateConfig(base,{...options,projectRef:DEV_REF})));
test('same DEV target rejected',()=>assert.throws(()=>validateConfig(base,{...options,sharedDevRef:SCRATCH_REF})));
test('secret key in user slot rejected',()=>assert.throws(()=>validateConfig({...base,RLS_REPLICA_PUBLISHABLE_KEY:base.RLS_REPLICA_SECRET_KEY},options)));
test('unknown DB host rejected',()=>assert.throws(()=>validateConfig({...base,RLS_REPLICA_DB_URL:'postgres://postgres:dummy@localhost/postgres'},options)));
test('historical evidence rejected',()=>assert.throws(()=>evidenceRoot(join(repoRoot,'agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence'))));
test('relative evidence rejected',()=>assert.throws(()=>evidenceRoot('evidence')));
test('traversal evidence rejected',()=>assert.throws(()=>evidenceRoot(join(process.env.APBM_EVIDENCE_DIR,'../../../../../../../../tmp'))));
test('filename traversal rejected',()=>assert.throws(()=>evidencePath('../escape')));
test('label traversal rejected',()=>assert.throws(()=>safeLabel('../../escape')));
const link=join(process.env.APBM_EVIDENCE_DIR,'symlink-attack');symlinkSync('/tmp',link);
try{test('symlink output ancestor rejected',()=>assert.throws(()=>evidenceRoot(join(link,'nested'))));test('symlink output file rejected',()=>assert.throws(()=>evidencePath('symlink-attack')));}finally{unlinkSync(link);}
for(const runner of ['prove.mjs','audit-prove.mjs','seed.mjs','audit-catalog.mjs'])test(`${runner} rejects DEV before connection`,()=>{const result=spawnSync(process.execPath,[join(repoRoot,'scripts/rls-harness',runner)],{env:{...process.env,APBM_PROJECT_REF:DEV_REF},encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/FAIL-CLOSED/);});
writeFileSync(evidencePath('fencing-results.json'),JSON.stringify({status:'PASS',checks},null,2)+'\n');console.log(`${checks.length} target/output fencing checks PASS`);
