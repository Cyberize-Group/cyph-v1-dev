// LOCAL SIMULATION ONLY. pg.Client is replaced before main(); no network or DB writes.
import assert from 'node:assert/strict';import pg from 'pg';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';import {randomBytes} from 'node:crypto';
import {authorize,bundleHash,main} from './bootstrap-runner.mjs';
import {plan} from '../dev-baseline-bootstrap/checks.mjs';
const checks=[],test=async(name,fn)=>{await fn();checks.push({name,status:'PASS'});};
const config=ref=>({target:'dev',projectRef:ref,DB_URL:`postgres://postgres.${ref}:synthetic@aws-1-us-east-1.pooler.supabase.com:5432/postgres`,SUPABASE_URL:`https://${ref}.supabase.co`});
const dev=config(plan.devProjectRef),scratch={...config(plan.scratchProjectRef),target:'scratch'};
await test('DEV apply requires Director release',()=>assert.throws(()=>authorize('apply',dev,{}),/TONY_BOOTSTRAP/));
await test('DEV fault injection always rejected',()=>assert.throws(()=>authorize('fault',dev,{}),/FAULT_REQUIRES/));
await test('pilot as DEV rejected',()=>assert.throws(()=>authorize('check',config(plan.pilotRejected),{})));
await test('SCRATCH as DEV rejected',()=>assert.throws(()=>authorize('check',config(plan.scratchProjectRef),{})));
await test('SCRATCH apply requires explicit confirmation',()=>assert.throws(()=>authorize('apply',scratch,{}),/SCRATCH_CONFIRMATION/));
await test('SCRATCH apply requires verified restored copy',()=>assert.throws(()=>authorize('apply',scratch,{APBM_BOOTSTRAP_SCRATCH:plan.scratchProjectRef},()=>({})),/RESTORED_COPY/));
const rehearsal={status:'PASS',projectRef:plan.scratchProjectRef,bundleSHA256:bundleHash(),baselineSHA256:plan.expectedAfterSHA256,restoreVerified:true,rollbackVerified:true,bootstrapVerified:true,forward52Verified:true,seedVerified:true,ownerVerified:true,verifierVerified:true,backupSHA256:'synthetic-backup'};
const backup={status:'PASS',projectRef:plan.devProjectRef,coverageComplete:true,backupSHA256:'synthetic-backup'};
const vars={APBM_DIRECTOR_BOOTSTRAP:plan.devProjectRef,APBM_REHEARSAL_RECEIPT:'rehearsal',APBM_BACKUP_RECEIPT:'backup'};
for(const flag of['restoreVerified','rollbackVerified','bootstrapVerified','forward52Verified','seedVerified','ownerVerified','verifierVerified'])await test('DEV rejects missing rehearsal '+flag,()=>assert.throws(()=>authorize('apply',dev,vars,p=>p==='backup'?backup:{...rehearsal,[flag]:false}),/COMPLETE_REHEARSAL/));
await test('DEV rejects stale bundle',()=>assert.throws(()=>authorize('apply',dev,vars,p=>p==='backup'?backup:{...rehearsal,bundleSHA256:'old'}),/COMPLETE_REHEARSAL/));
await test('DEV rejects unmatched backup',()=>assert.throws(()=>authorize('apply',dev,vars,p=>p==='backup'?{...backup,backupSHA256:'different'}:rehearsal),/AFFECTED_DEV_BACKUP/));
await test('complete reviewed receipts permit authorization only',()=>authorize('apply',dev,vars,p=>p==='backup'?backup:rehearsal));
const before=JSON.parse(readFileSync(new URL('../dev-target-reconciliation/catalog.json',import.meta.url))).snapshot;
const after=JSON.parse(readFileSync(new URL('../../E2/stage-5/recovery/baseline.json',import.meta.url))).snapshot;
const prefixes=[['select table_name,column_name','columns'],['select c.relname,c.relkind','tables'],['select tablename,policyname','policies'],['select p.proname,','functions'],['select c.relname,k.conname','constraints'],['select tablename,indexname','indexes'],['select c.relname,t.tgname','triggers'],['select pg_get_userbyid(d.defaclrole)','defaultACLs'],['select t.typname,e.enumlabel','enums']];
const originalClient=pg.Client,originalEnv={...process.env},originalArgs=process.argv,originalLog=console.log;
let instance,scenario;
class FakeClient{
 constructor(){instance=this;this.persist=before;this.state=before;this.commands=[];}
 async connect(){}async end(){}
 async query(sql){this.commands.push(sql);
  if(sql.startsWith('BEGIN')){this.state=this.persist;return {rows:[]};}
  if(sql==='COMMIT'){this.persist=this.state;if(scenario==='commit-unknown')throw Object.assign(new Error('synthetic'),{code:'ECONNRESET'});return {rows:[]};}
  if(sql==='ROLLBACK'){this.state=this.persist;return {rows:[]};}
  if(sql.includes('APBM-003 DEV-specific bootstrap proposal')){this.state=structuredClone(after);if(scenario==='bad-catalog')this.state.policies=[];return {rows:[]};}
  if(sql==='select 1/0')throw Object.assign(new Error('synthetic'),{code:'22012'});
  if(sql.startsWith('select c.relname,t.tgname')&&sql.includes("n.nspname='auth'"))return {rows:[]};
  const item=prefixes.find(([prefix])=>sql.startsWith(prefix));if(item)return {rows:this.state[item[1]]};
  if(sql.startsWith('select n.nspname schema'))return {rows:[{schema:'auth',name:'users'},{schema:'auth',name:'identities'},{schema:'public',name:'profiles'},{schema:'public',name:'user_roles'}]};
  if(sql.includes("to_regclass('apbm_migrations.ledger')"))return {rows:[{absent:true}]};
  if(sql.startsWith('select version'))return {rows:[{version:'20261012053902'}]};
  if(sql.includes('pg_try_advisory_xact_lock'))return {rows:[{locked:true}]};
  if(sql.startsWith('select (select rolsuper'))return {rows:[{allowed:true}]};
  if(sql.startsWith('select exists(select 1'))return {rows:[{present:false}]};
  return {rows:[]};
 }
}
try{
 pg.Client=FakeClient;console.log=()=>{};
 for(const[mode,which,expected]of[['fault','fault','PASS'],['apply','success','PASS'],['apply','bad-catalog','BLOCKED'],['apply','commit-unknown','UNKNOWN_COMMIT_OUTCOME']]){
  const id=randomBytes(5).toString('hex'),dir=resolve('agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/local-simulation-'+id),restore='/tmp/apbm003-unit-restore-'+id+'.json',proof='/tmp/apbm003-unit-proof-'+id+'.json';mkdirSync(dir);
  writeFileSync(restore,JSON.stringify({status:'PASS',sourceProjectRef:plan.devProjectRef,targetProjectRef:plan.scratchProjectRef,catalogSHA256:plan.expectedBeforeSHA256,preservationVerified:true,backupSHA256:'synthetic-backup'}),{mode:0o600});
  Object.assign(process.env,{RLS_HARNESS_PREFIX:'RLS_REPLICA_',APBM_TARGET:'scratch',APBM_PROJECT_REF:plan.scratchProjectRef,APBM_EVIDENCE_DIR:dir,APBM_BOOTSTRAP_SCRATCH:plan.scratchProjectRef,APBM_RESTORE_RECEIPT:restore,APBM_PRESERVATION_FILE:proof,RLS_REPLICA_DB_URL:scratch.DB_URL,RLS_REPLICA_SUPABASE_URL:scratch.SUPABASE_URL,RLS_REPLICA_PUBLISHABLE_KEY:'sb_publishable_synthetic',RLS_REPLICA_SECRET_KEY:'sb_secret_synthetic'});
  scenario=which;process.argv=['node','bootstrap-runner.mjs',mode];process.exitCode=0;
  try{await main();const receipt=JSON.parse(readFileSync(resolve(dir,readdirSync(dir)[0])));if(receipt.status!==expected)originalLog(JSON.stringify({scenario:which,receipt,lastQueries:instance.commands.slice(-6).map(s=>s.slice(0,100))}));assert.equal(receipt.status,expected);
   if(which==='fault'||which==='bad-catalog'){assert.equal(instance.persist,before);assert.ok(!instance.commands.includes('COMMIT'));}
   if(which==='success'){assert.equal(receipt.committed,true);assert.equal(receipt.independentVerification.status,'PASS');}
   checks.push({name:'synthetic transaction '+which,status:'PASS'});
  }finally{rmSync(dir,{recursive:true,force:true});rmSync(restore,{force:true});rmSync(proof,{force:true});process.exitCode=0;}
 }
}finally{pg.Client=originalClient;console.log=originalLog;process.argv=originalArgs;for(const k of Object.keys(process.env))if(!(k in originalEnv))delete process.env[k];Object.assign(process.env,originalEnv);}
writeFileSync(new URL('./RUNNER_TEST_RESULTS.json',import.meta.url),JSON.stringify({status:'PASS',kind:'local synthetic simulation; not a database rehearsal',checks},null,2)+'\n');console.log(`${checks.length} runner guard/transaction simulations PASS (no network)`);
