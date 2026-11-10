// Catalog inspection only. Never executes stored functions, job commands or network requests.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import dotenv from 'dotenv';
import pg from 'pg';
import {validateConfig,sqlRef} from '../../../../../../scripts/rls-harness/lib/env.mjs';
const ref='yrsuwikjnbmvpznrgydb';
const raw=dotenv.parse(readFileSync('.env.local'));
const url=new URL(raw.APBM_DEV_DB_URL);
if(sqlRef(raw.APBM_DEV_DB_URL)!==ref||sqlRef(raw.APBM_DEV_DB_POOL)!==ref)throw new Error('TARGET_MISMATCH');
const env=validateConfig({...raw,APBM_DEV_DB_URL:raw.APBM_DEV_DB_POOL},{prefix:'APBM_DEV_',target:'dev',projectRef:ref});
const hash=x=>createHash('sha256').update(x).digest('hex');
const result={startedAt:new Date().toISOString(),projectRef:ref,status:'BLOCKED',configuration:{dbUrlUsesSessionPooler:url.hostname.endsWith('.pooler.supabase.com')&&url.port==='5432',sqlVariable:'APBM_DEV_DB_POOL',sqlApiRefMatch:true},checks:{},gaps:[]};
const client=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:15000,query_timeout:30000,options:'-c default_transaction_read_only=on -c statement_timeout=25000'});
let seq=0;
async function read(name,sql,params=[]){
 const sp='check_'+(++seq);await client.query('SAVEPOINT '+sp);
 try{const r=(await client.query(sql,params)).rows;await client.query('RELEASE SAVEPOINT '+sp);return r;}
 catch(e){await client.query('ROLLBACK TO SAVEPOINT '+sp);await client.query('RELEASE SAVEPOINT '+sp);result.gaps.push({check:name,code:/^[A-Z0-9_]+$/.test(e.code||'')?e.code:'READ_FAILED'});return null;}
}
const signals=s=>({network:/\b(net\s*\.|http[s]?\s*\(|http_(get|post|put|delete|patch|head)|http_request|dblink|curl|wget|fetch\s*\(|requests\s*\.|urllib|socket|smtp|sendgrid|resend|webhook|foreign\s+table)\b/i.test(s),urlLiteral:/https?:\/\//i.test(s),dynamicSql:/\bexecute\b/i.test(s),program:/\bcopy\b[\s\S]*\bprogram\b/i.test(s)});
try{
 await client.connect();await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');await client.query("SET LOCAL row_security=off");
 result.transaction=(await client.query("select current_setting('transaction_read_only') read_only,current_setting('transaction_isolation') isolation,current_database() database,now() observed_at")).rows[0];
 if(result.transaction.read_only!=='on')throw new Error('READ_ONLY_REQUIRED');
 result.checks.extensions=await read('extensions',"select e.extname,e.extversion,n.nspname schema from pg_extension e join pg_namespace n on n.oid=e.extnamespace order by e.extname");
 result.checks.workerSettings=await read('workerSettings',"select name,setting from pg_settings where name in ('shared_preload_libraries','session_preload_libraries','local_preload_libraries','cron.database_name','cron.launch_active_jobs','cron.timezone') order by name");
 result.checks.databases=await read('databases',"select datname,datallowconn from pg_database where not datistemplate order by datname");
 const tableNames=['cron.job','pgagent.pga_job','net.http_request_queue','net._http_response','supabase_functions.hooks','vault.secrets'];
 result.checks.optionalTables={};
 for(const table of tableNames){
  const exists=await read('exists:'+table,'select to_regclass($1) is not null present',[table]);
  if(!exists)continue;
  if(!exists[0].present){result.checks.optionalTables[table]={present:false};continue;}
  const count=await read('count:'+table,`select count(*)::int count from ${table}`);
  result.checks.optionalTables[table]={present:true,count:count?.[0]?.count??null};
  if(table==='cron.job'){
   const rows=await read('cronJobs','select jobid,active,command,database from cron.job order by jobid');
   result.checks.cronJobs=rows?.map(x=>({jobid:x.jobid,active:x.active,database:x.database,commandSHA256:hash(x.command),signals:signals(x.command)}));
  }
 }
 result.checks.foreignWrappers=await read('foreignWrappers',"select fdwname from pg_foreign_data_wrapper order by fdwname");
 result.checks.foreignServers=await read('foreignServers',"select s.srvname,w.fdwname from pg_foreign_server s join pg_foreign_data_wrapper w on w.oid=s.srvfdw order by s.srvname");
 result.checks.foreignTables=await read('foreignTables',"select n.nspname schema,c.relname,s.srvname from pg_foreign_table f join pg_class c on c.oid=f.ftrelid join pg_namespace n on n.oid=c.relnamespace join pg_foreign_server s on s.oid=f.ftserver order by 1,2");
 result.checks.subscriptions=await read('subscriptions',"select subname,subenabled,subdbid=(select oid from pg_database where datname=current_database()) current_database from pg_subscription order by subname");
 result.checks.roleStartupSettingNames=await read('roleStartupSettingNames',"select coalesce(d.datname,'ALL') database,coalesce(r.rolname,'ALL') role,split_part(v,'=',1) setting_name from pg_db_role_setting s left join pg_database d on d.oid=s.setdatabase left join pg_roles r on r.oid=s.setrole cross join lateral unnest(s.setconfig) v order by 1,2,3");
 const funcs=await read('functionDefinitions',"select p.oid::text oid,n.nspname schema,p.proname,pg_get_function_identity_arguments(p.oid) args,l.lanname,pg_get_functiondef(p.oid) definition,exists(select 1 from pg_depend d where d.classid='pg_proc'::regclass and d.objid=p.oid and d.deptype='e') extension_owned from pg_proc p join pg_namespace n on n.oid=p.pronamespace join pg_language l on l.oid=p.prolang where p.prokind in ('f','p') and n.nspname not in ('pg_catalog','information_schema') order by n.nspname,p.proname,pg_get_function_identity_arguments(p.oid)");
 result.checks.functionInventory={total:funcs?.length??null,candidates:funcs?.filter(f=>Object.values(signals(f.definition)).some(Boolean)||['plpythonu','plpython3u','plperlu','plv8'].includes(f.lanname)).map(f=>({schema:f.schema,name:f.proname,args:f.args,language:f.lanname,extensionOwned:f.extension_owned,definitionSHA256:hash(f.definition),signals:signals(f.definition)}))};
 const triggers=await read('triggerDefinitions',"select n.nspname schema,c.relname,t.tgname,t.tgenabled,p.oid::text function_oid,p.proname,fn.nspname function_schema from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace join pg_proc p on p.oid=t.tgfoid join pg_namespace fn on fn.oid=p.pronamespace where not t.tgisinternal order by 1,2,3");
 result.checks.triggers=triggers?.map(t=>({...t,functionSignals:signals(funcs?.find(f=>f.oid===t.function_oid)?.definition||''),definitionInspected:!!funcs?.some(f=>f.oid===t.function_oid)}));
 const events=await read('eventTriggers',"select e.evtname,e.evtevent,e.evtenabled,p.oid::text function_oid,n.nspname function_schema,p.proname from pg_event_trigger e join pg_proc p on p.oid=e.evtfoid join pg_namespace n on n.oid=p.pronamespace order by e.evtname");
 result.checks.eventTriggers=events?.map(t=>({...t,functionSignals:signals(funcs?.find(f=>f.oid===t.function_oid)?.definition||''),definitionInspected:!!funcs?.some(f=>f.oid===t.function_oid)}));
 // No credential values, queued bodies, job commands, FDW options, or function text are emitted.
 await client.query('ROLLBACK');result.status=result.gaps.length?'INCOMPLETE':'INSPECTION_COMPLETE_REQUIRES_REVIEW';
}catch(e){result.gaps.push({check:'connectionOrTransaction',code:/^[A-Z0-9_]+$/.test(e.code||'')?e.code:/^[A-Z0-9_]+$/.test(e.message||'')?e.message:'READ_FAILED'});}
finally{await client.query('ROLLBACK').catch(()=>{});await client.end().catch(()=>{});result.finishedAt=new Date().toISOString();writeFileSync(new URL('./OUTBOUND_CHECK.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}
