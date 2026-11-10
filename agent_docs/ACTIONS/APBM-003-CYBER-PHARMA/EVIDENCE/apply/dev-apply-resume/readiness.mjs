// Read-only DEV/SCRATCH readiness; no restore, role changes, Auth login or DDL.
import {readFileSync,writeFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import dotenv from 'dotenv';
import pg from 'pg';
import {validateConfig,sqlRef,apiRef} from '../../../../../../scripts/rls-harness/lib/env.mjs';
import {catalog} from '../../../../../../scripts/dev-verify.mjs';
const raw=dotenv.parse(readFileSync('.env.local'));
const receipt=JSON.parse(readFileSync(new URL('../dev-restored-rehearsal/SNAPSHOT_BACKUP.json',import.meta.url)));
const expected=JSON.parse(readFileSync(new URL('../dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json',import.meta.url))).missingOnScratch;
const result={startedAt:new Date().toISOString(),status:'RUNNING',backup:{},configuration:{},targets:{},signup:{status:'UNVERIFIED'},effects:'Read-only SQL catalogs and GET Auth settings; no database writes, user login or project creation'};
for(const [name,key]of [['dev-before.dump','backupSHA256'],['source-proof.private.json','privateProofSHA256']]){
 const file=receipt.privateDirectory+'/'+name;
 const digest=createHash('sha256').update(readFileSync(file)).digest('hex');
 result.backup[name]={sha256:digest,matchesReceipt:digest===receipt[key],mode:(statSync(file).mode&0o777).toString(8)};
 if(digest!==receipt[key])throw new Error('BACKUP_HASH_MISMATCH');
}
let u;try{u=new URL(raw.APBM_DEV_DB_URL);}catch{}
result.configuration={devSqlRef:sqlRef(raw.APBM_DEV_DB_URL)??null,devApiRef:apiRef(raw.APBM_DEV_SUPABASE_URL)??null,devDbUrlIsSessionPooler:!!u&&u.hostname.endsWith('.pooler.supabase.com')&&u.port==='5432'&&decodeURIComponent(u.username)==='postgres.yrsuwikjnbmvpznrgydb',devSqlVariablesIdentical:raw.APBM_DEV_DB_URL===raw.APBM_DEV_DB_POOL,otherRestoreVariableNames:Object.keys(raw).filter(k=>/RESTORE|CLONE/.test(k)).sort()};
async function inspect(target,prefix,ref){
 const status={projectRef:ref,status:'BLOCKED'};let c;
 try{
  const selected={...raw};
  if(target==='dev'&&!result.configuration.devDbUrlIsSessionPooler){
   if(sqlRef(raw.APBM_DEV_DB_POOL)!==ref)throw new Error('DEV_POOL_TARGET_MISMATCH');
   selected.APBM_DEV_DB_URL=raw.APBM_DEV_DB_POOL;status.explicitReadOnlySqlVariable='APBM_DEV_DB_POOL';
  }else status.explicitReadOnlySqlVariable=prefix+'DB_URL';
  const env=validateConfig(selected,{prefix,target,projectRef:ref});
  c=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:15000,query_timeout:20000,options:'-c default_transaction_read_only=on -c statement_timeout=15000'});
  await c.connect();await c.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  status.readOnly=(await c.query('show transaction_read_only')).rows[0].transaction_read_only;
  if(status.readOnly!=='on')throw new Error('READ_ONLY_NOT_EFFECTIVE');
  status.serverVersion=(await c.query('show server_version')).rows[0].server_version;
  const indexes=(await c.query("select c.relname indexname,pg_get_indexdef(i.indexrelid) indexdef,i.indisvalid,i.indisready,i.indislive from pg_index i join pg_class c on c.oid=i.indexrelid where i.indrelid='auth.users'::regclass order by c.relname")).rows;
  status.requiredFourIndexes=expected.map(x=>{const y=indexes.find(r=>r.indexname===x.indexname);return {name:x.indexname,present:!!y,exactDefinition:!!y&&y.indexdef===x.indexdef,valid:!!y?.indisvalid,ready:!!y?.indisready,live:!!y?.indislive};});
  status.restorePrivileges=(await c.query("select current_user operator, (select rolsuper from pg_roles where rolname=current_user) superuser, has_schema_privilege(current_user,'auth','CREATE') authSchemaCreate, pg_has_role(current_user,'supabase_auth_admin','MEMBER') authOwnerMember, pg_has_role(current_user,'supabase_auth_admin','USAGE') authOwnerInherited, pg_has_role(current_user,'supabase_auth_admin','SET') authOwnerSetRole, (select pg_get_userbyid(relowner) from pg_class where oid='auth.users'::regclass) authUsersOwner, pg_has_role(current_user,'supabase_admin','USAGE') managedDefaultAclOwnerInherited")).rows[0];
  const cat=await catalog(c);status.catalogSHA256=cat.sha256;
  status.apbmLedgerPresent=(await c.query("select to_regclass('apbm_migrations.ledger') is not null present")).rows[0].present;
  status.status='READ_ONLY_CHECK_PASS';await c.query('ROLLBACK');
 }catch(e){status.errorCode=/^[A-Z0-9_]+$/.test(e.code||'')?e.code:/^[A-Z0-9_]+$/.test(e.message||'')?e.message:'CONFIG_OR_CONNECTION_CHECK_FAILED';}
 finally{if(c){await c.query('ROLLBACK').catch(()=>{});await c.end().catch(()=>{});}}
 return status;
}
async function signup(){
 if(apiRef(raw.APBM_DEV_SUPABASE_URL)!=='yrsuwikjnbmvpznrgydb')return {status:'BLOCKED',reason:'API_TARGET_MISMATCH'};
 try{
  const r=await fetch(raw.APBM_DEV_SUPABASE_URL+'/auth/v1/settings',{headers:{apikey:raw.APBM_DEV_PUBLISHABLE_KEY},signal:AbortSignal.timeout(15000)});
  if(!r.ok){await r.body?.cancel();return {status:'UNVERIFIED',httpStatus:r.status};}
  const data=await r.json();return {status:typeof data.disable_signup==='boolean'?(data.disable_signup?'DISABLED_VERIFIED':'ENABLED_VERIFIED'):'UNVERIFIED',httpStatus:r.status,disableSignup:typeof data.disable_signup==='boolean'?data.disable_signup:null,observedAt:new Date().toISOString(),method:'GET /auth/v1/settings with publishable apikey; no signup attempted'};
 }catch{return {status:'UNVERIFIED',reason:'SETTINGS_READ_FAILED'};}
}
const [dev,scratch,settings]=await Promise.all([inspect('dev','APBM_DEV_','yrsuwikjnbmvpznrgydb'),inspect('scratch','RLS_REPLICA_','ihgcsrypblqkwommrkgj'),signup()]);
result.targets={dev,scratch};result.signup=settings;
result.restoreGate={approvedExistingTarget:'ihgcsrypblqkwommrkgj',missingOrChangedAuthIndexes:(scratch.requiredFourIndexes??[]).filter(i=>!i.present||!i.exactDefinition||!i.valid||!i.ready||!i.live).map(i=>i.name)};
result.status=scratch.status==='READ_ONLY_CHECK_PASS'&&!result.restoreGate.missingOrChangedAuthIndexes.length?'TARGET_INDEX_PREREQUISITE_READY':'BLOCKED';
result.finishedAt=new Date().toISOString();writeFileSync(new URL('./READINESS.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
