#!/usr/bin/env node
// Transaction wrapper. DEV write modes are Tony-only and require a full rehearsal receipt.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,lstatSync,realpathSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {randomBytes,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import pg from 'pg';
import {loadEnv,evidencePath,repoRoot,DEV_REF,SCRATCH_REF} from '../../../../../../scripts/rls-harness/lib/env.mjs';
import {plan,verifyInputs,assertTarget,assertBefore,assertAfter,lockPreserved,capturePreservation} from '../dev-baseline-bootstrap/checks.mjs';
const sqlPath=new URL('../dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql',import.meta.url);
const sha=value=>createHash('sha256').update(value).digest('hex');
export function bundleHash(){return sha(['bootstrap-runner.mjs','../dev-baseline-bootstrap/checks.mjs','../dev-baseline-bootstrap/PLAN_MANIFEST.json','../dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql','../../../../../../scripts/dev-verify.mjs','../../../../../../scripts/rls-harness/lib/env.mjs','../../E2/SOURCE_HASHES.json','backup.mjs','owner-check.mjs','DEV_COMMANDS.sh','REHEARSAL_COMMANDS.sh','checkpoint-receipt.mjs','rehearsal-receipt.mjs'].map(p=>sha(readFileSync(new URL(p,import.meta.url)))).join('\n'));}
const fail=code=>{throw Object.assign(new Error(code),{code});};
function jsonFile(path){if(!path||lstatSync(path).isSymbolicLink()||!lstatSync(path).isFile())fail('INVALID_RECEIPT');return JSON.parse(readFileSync(path));}
export function authorize(mode,env,vars=process.env,read=jsonFile){
 if(!['check','apply','fault','verify'].includes(mode))fail('UNKNOWN_MODE');
 assertTarget(env,env.target);
 if(mode==='check'||mode==='verify')return;
 if(mode==='fault'&&env.target!=='scratch')fail('FAULT_REQUIRES_SCRATCH');
 if(env.target==='scratch'){
  if(vars.APBM_BOOTSTRAP_SCRATCH!==SCRATCH_REF)fail('SCRATCH_CONFIRMATION_REQUIRED');
  const r=read(vars.APBM_RESTORE_RECEIPT);
  if(r.status!=='PASS'||r.sourceProjectRef!==DEV_REF||r.targetProjectRef!==SCRATCH_REF||r.catalogSHA256!==plan.expectedBeforeSHA256||r.preservationVerified!==true||!r.backupSHA256)fail('RESTORED_COPY_RECEIPT_REQUIRED');
 }else{
  if(vars.APBM_DIRECTOR_BOOTSTRAP!==DEV_REF)fail('TONY_BOOTSTRAP_RELEASE_REQUIRED');
  const r=read(vars.APBM_REHEARSAL_RECEIPT),b=read(vars.APBM_BACKUP_RECEIPT);
  if(r.status!=='PASS'||r.projectRef!==SCRATCH_REF||r.bundleSHA256!==bundleHash()||r.baselineSHA256!==plan.expectedAfterSHA256||['restoreVerified','rollbackVerified','bootstrapVerified','forward52Verified','seedVerified','ownerVerified','verifierVerified'].some(k=>r[k]!==true))fail('COMPLETE_REHEARSAL_REQUIRED');
  if(b.status!=='PASS'||b.projectRef!==DEV_REF||b.coverageComplete!==true||!b.backupSHA256||r.backupSHA256!==b.backupSHA256)fail('AFFECTED_DEV_BACKUP_REQUIRED');
 }
}
function privatePath(value,fresh){
 if(!value)fail('PRIVATE_PROOF_PATH_REQUIRED');const p=resolve(value);
 if(dirname(p)!=='/tmp'||realpathSync('/tmp')!=='/tmp')fail('PRIVATE_PROOF_MUST_BE_IN_TMP');
 if(fresh&&existsSync(p))fail('PRIVATE_PROOF_ALREADY_EXISTS');
 if(!fresh&&(!existsSync(p)||lstatSync(p).isSymbolicLink()||!lstatSync(p).isFile()||(lstatSync(p).mode&0o777)!==0o600))fail('PRIVATE_PROOF_MODE_REQUIRED');
 return p;
}
async function setup(c,readOnly){await c.query(readOnly?'BEGIN READ ONLY':'BEGIN');await c.query("SET LOCAL statement_timeout='120s'");await c.query("SET LOCAL lock_timeout='5s'");await c.query("SET LOCAL TIME ZONE 'UTC'");await c.query('SET LOCAL search_path=public,pg_catalog');}
export async function main(){
 const mode=process.argv[2]||'check';verifyInputs();
 const sources=JSON.parse(readFileSync(new URL('../../E2/SOURCE_HASHES.json',import.meta.url)));
 for(const [name,expected]of Object.entries(sources))if(sha(readFileSync(resolve(repoRoot,name)))!==expected)fail('SOURCE_HASH_MISMATCH');
 const env=loadEnv();authorize(mode,env);
 const receipt={mode,projectRef:env.projectRef,bundleSHA256:bundleHash(),startedAt:new Date().toISOString(),status:'RUNNING'};
 const client=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000,query_timeout:125000});let committed=false,commitAttempted=false,proof;
 try{
  await client.connect();
  if(mode==='check'){
   await setup(client,true);await assertBefore(client);
   const p=(await client.query("select current_user,(select rolsuper from pg_roles where rolname=current_user) superuser,pg_has_role(current_user,'supabase_admin','MEMBER') managed_acl_role")).rows[0];
   receipt.catalog='PASS';receipt.privilegeAvailable=p.superuser||p.managed_acl_role;await client.query('ROLLBACK');
   if(!receipt.privilegeAvailable)fail('MANAGED_DEFAULT_ACL_PRIVILEGE_REQUIRED');receipt.status='PASS';
  }else if(mode==='verify'){
   proof=jsonFile(privatePath(process.env.APBM_PRESERVATION_FILE,false));
   if(proof.projectRef!==env.projectRef||proof.bundleSHA256!==bundleHash())fail('PRIVATE_PROOF_TARGET_OR_BUNDLE_MISMATCH');
   await setup(client,true);receipt.verification=await assertAfter(client,proof.before,proof.salt);await client.query('ROLLBACK');receipt.status='PASS';
  }else{
   const p=privatePath(process.env.APBM_PRESERVATION_FILE,true);
   await setup(client,false);
   const privilege=(await client.query("select (select rolsuper from pg_roles where rolname=current_user) or pg_has_role(current_user,'supabase_admin','MEMBER') allowed")).rows[0].allowed;
   if(!privilege)fail('MANAGED_DEFAULT_ACL_PRIVILEGE_REQUIRED');
   if(!(await client.query('select pg_try_advisory_xact_lock(342003,1) locked')).rows[0].locked)fail('APBM_RUNNER_LOCKED');
   await lockPreserved(client);await assertBefore(client);
   proof={projectRef:env.projectRef,bundleSHA256:bundleHash(),salt:randomBytes(32).toString('hex')};proof.before=await capturePreservation(client,proof.salt);
   writeFileSync(p,JSON.stringify(proof),{flag:'wx',mode:0o600});
   const sql=readFileSync(sqlPath);if(sha(sql)!==plan.bootstrapSHA256)fail('SQL_CHANGED_BEFORE_EXECUTION');
   await client.query(sql.toString());
   if(mode==='fault'){
    try{await client.query('select 1/0');fail('FAULT_NOT_RAISED');}catch(e){if(e.code!=='22012')throw e;}
    await client.query('ROLLBACK');await setup(client,true);await assertBefore(client);assert.deepEqual(await capturePreservation(client,proof.salt),proof.before,'rollback preservation mismatch');await client.query('ROLLBACK');receipt.status='PASS';receipt.rollbackVerified=true;
   }else{
    receipt.inTransactionVerification=await assertAfter(client,proof.before,proof.salt);
    commitAttempted=true;await client.query('COMMIT');committed=true;
    await setup(client,true);receipt.independentVerification=await assertAfter(client,proof.before,proof.salt);await client.query('ROLLBACK');receipt.status='PASS';receipt.bootstrapVerified=true;
   }
  }
 }catch(e){await client.query('ROLLBACK').catch(()=>{});receipt.status=committed?'COMMITTED_VERIFY_FAILED':commitAttempted?'UNKNOWN_COMMIT_OUTCOME':'BLOCKED';receipt.errorCode=/^[A-Z0-9_]{2,60}$/.test(e.code||'')?e.code:'CHECK_FAILED';receipt.nextAction=commitAttempted?'Stop; reconnect read-only and classify before/after state using the retained private proof. Never blindly rerun.':'Stop; resolve the named prerequisite or failed check. No automatic retry.';process.exitCode=1;}
 finally{await client.end().catch(()=>{});receipt.committed=committed;receipt.finishedAt=new Date().toISOString();writeFileSync(evidencePath(`bootstrap-${mode}-${Date.now()}.json`),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(JSON.stringify({status:'BLOCKED',code:/^[A-Z0-9_]{2,60}$/.test(e.code||'')?e.code:'CONFIG_OR_RECEIPT_CHECK_FAILED'}));process.exitCode=1;});
