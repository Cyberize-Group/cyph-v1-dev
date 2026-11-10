// Read-only comparison with retained pre-restore fingerprints. No Auth/API probes.
import {readFileSync,writeFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import pg from 'pg';
import dotenv from 'dotenv';
import {catalog} from '../../../../../../scripts/dev-verify.mjs';
import {validateConfig,sqlRef} from '../../../../../../scripts/rls-harness/lib/env.mjs';
import {capturePreservation} from '../dev-baseline-bootstrap/checks.mjs';

const hash=b=>createHash('sha256').update(b).digest('hex');
const read=name=>JSON.parse(readFileSync(new URL('../dev-restored-rehearsal/'+name,import.meta.url)));
const canonical=x=>JSON.stringify(x===null||typeof x!=='object'?x:Array.isArray(x)?x.map(v=>JSON.parse(canonical(v))).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))):Object.fromEntries(Object.keys(x).sort().map(k=>[k,JSON.parse(canonical(x[k]))])));
const eq=(a,b)=>canonical(a)===canonical(b);
const delta=(a,b)=>({equal:eq(a,b),beforeCount:a.length,afterCount:b.length,removed:a.filter(x=>!b.some(y=>eq(x,y))),added:b.filter(x=>!a.some(y=>eq(x,y)))});
const receipt=read('SNAPSHOT_BACKUP.json');
const result={checkedAt:new Date().toISOString(),projectRef:'yrsuwikjnbmvpznrgydb',directorReportedRestorePoint:'2026-11-06T07:37:54Z',referenceSnapshotFinishedAt:receipt.finishedAt,status:'BLOCKED',effects:'SQL reads only; no Auth/API calls, imports, migrations, seed or ledger writes',backup:{}};
let client;
try{
 for(const [name,key] of [['dev-before.dump','backupSHA256'],['source-proof.private.json','privateProofSHA256']]){
  const file=receipt.privateDirectory+'/'+name;
  result.backup[name]={sha256:hash(readFileSync(file)),matchesReceipt:false,mode:(statSync(file).mode&0o777).toString(8)};
  result.backup[name].matchesReceipt=result.backup[name].sha256===receipt[key];
  if(!result.backup[name].matchesReceipt)throw new Error('BACKUP_HASH_MISMATCH');
 }
 const before=JSON.parse(readFileSync(receipt.privateDirectory+'/source-proof.private.json'));
 if(before.projectRef!==result.projectRef)throw new Error('PRIVATE_PROOF_TARGET_MISMATCH');
 const raw=dotenv.parse(readFileSync('.env.local'));
 // Explicit source selection recorded; never modify .env or silently fall back after a failure.
 const usePool=Boolean(raw.APBM_DEV_DB_POOL);
 if(usePool&&sqlRef(raw.APBM_DEV_DB_POOL)!==result.projectRef)throw new Error('POOL_TARGET_MISMATCH');
 if(raw.APBM_DEV_DB_URL&&sqlRef(raw.APBM_DEV_DB_URL)!==result.projectRef)throw new Error('DB_URL_TARGET_MISMATCH');
 const env=validateConfig({...raw,...(usePool?{APBM_DEV_DB_URL:raw.APBM_DEV_DB_POOL}:{})},{prefix:'APBM_DEV_',target:'dev',projectRef:result.projectRef});
 result.target={sqlAndApiRefMatch:true,sqlVariable:usePool?'APBM_DEV_DB_POOL (explicit in-memory mapping)':'APBM_DEV_DB_URL'};
 client=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:15000,query_timeout:30000,options:'-c default_transaction_read_only=on -c statement_timeout=25000'});
 await client.connect();
 await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 await client.query("SET LOCAL TIME ZONE 'UTC'");
 result.connection=(await client.query("select current_setting('transaction_read_only') read_only,current_setting('transaction_isolation') isolation,current_setting('server_version') server_version,now() observed_at")).rows[0];
 if(result.connection.read_only!=='on')throw new Error('READ_ONLY_NOT_EFFECTIVE');
 const current=await catalog(client);
 result.publicCatalog={beforeSHA256:before.catalog.sha256,afterSHA256:current.sha256,equal:before.catalog.sha256===current.sha256,sections:{}};
 for(const [key,rows]of Object.entries(before.catalog.snapshot))result.publicCatalog.sections[key]=delta(rows,current.snapshot[key]);
 const after=await capturePreservation(client,before.salt);
 result.tables=Object.fromEntries([...new Set([...Object.keys(before.preserved.tables),...Object.keys(after.tables)])].sort().map(name=>{
  const a=before.preserved.tables[name],b=after.tables[name];
  return [name,{beforeCount:a?.count??null,afterCount:b?.count??null,equal:!!a&&!!b&&eq(a,b),status:!a?'ADDED_TABLE':!b?'MISSING_TABLE':eq(a,b)?'MATCH':'DIFFERENT'}];
 }));
 result.preservedMetadata={};
 for(const key of Object.keys(before.preserved).filter(k=>k!=='tables')){
  const a=before.preserved[key],b=after[key];
  // Role configuration may contain sensitive configuration; expose names/changed fields only.
  const d=delta(a,b);
  result.preservedMetadata[key]={equal:d.equal,beforeCount:d.beforeCount,afterCount:d.afterCount};
  if(!d.equal)result.preservedMetadata[key].differences={removed:d.removed.map(x=>Object.fromEntries(Object.entries(x).filter(([k])=>!['rolconfig'].includes(k)))),added:d.added.map(x=>Object.fromEntries(Object.entries(x).filter(([k])=>!['rolconfig'].includes(k))))};
 }
 const sequences=[];
 for(const row of(await client.query("select sequencename from pg_sequences where schemaname='auth' order by sequencename")).rows){
  if(!/^[a-z_]+$/.test(row.sequencename))throw new Error('UNEXPECTED_SEQUENCE_NAME');
  sequences.push({name:row.sequencename,...(await client.query(`select last_value::text,is_called from auth."${row.sequencename}"`)).rows[0]});
 }
 result.authSequences=delta(before.authSequences,sequences);
 const authQueries={
  columns:"select table_name,column_name,ordinal_position,data_type,udt_name,is_nullable,column_default,is_generated,generation_expression from information_schema.columns where table_schema='auth' order by table_name,ordinal_position",
  constraints:"select c.relname,k.conname,pg_get_constraintdef(k.oid) definition from pg_constraint k join pg_class c on c.oid=k.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='auth' order by c.relname,k.conname",
  triggers:"select c.relname,t.tgname,pg_get_triggerdef(t.oid) definition from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='auth' and not t.tgisinternal order by c.relname,t.tgname",
  relations:"select c.relname,c.relkind,pg_get_userbyid(c.relowner) owner,c.relacl::text,c.relrowsecurity,c.relforcerowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='auth' and c.relkind in ('r','p','S','v') order by c.relname",
  functions:"select p.proname,pg_get_function_identity_arguments(p.oid) args,pg_get_functiondef(p.oid) definition,p.proacl::text,pg_get_userbyid(p.proowner) owner from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='auth' and p.prokind='f' order by p.proname,pg_get_function_identity_arguments(p.oid)",
  policies:"select tablename,policyname,permissive,roles,cmd,qual,with_check from pg_policies where schemaname='auth' order by tablename,policyname",
  indexes:"select tablename,indexname,indexdef from pg_indexes where schemaname='auth' order by tablename,indexname"
 };
 const oldAuth={...read('AUTH_RESTORE_COMPATIBILITY.json').metadata.dev,...read('AUTH_MANAGED_OBJECT_PARITY.json').metadata.dev};
 result.authCatalog={};
 for(const[key,sql]of Object.entries(authQueries))result.authCatalog[key]=delta(oldAuth[key],(await client.query(sql)).rows);
 const expectedIndexes=read('AUTH_INDEX_DIFFERENCES.json').missingOnScratch;
 const indexes=(await client.query("select c.relname indexname,pg_get_indexdef(i.indexrelid) indexdef,i.indisvalid,i.indisready,i.indislive,i.indisunique from pg_index i join pg_class c on c.oid=i.indexrelid where i.indrelid='auth.users'::regclass order by c.relname")).rows;
 result.requiredFourIndexes=expectedIndexes.map(x=>{const y=indexes.find(r=>r.indexname===x.indexname);return {indexname:x.indexname,present:!!y,definitionMatches:!!y&&x.indexdef===y.indexdef,valid:!!y?.indisvalid,ready:!!y?.indisready,live:!!y?.indislive,nonunique:y? !y.indisunique:false};});
 result.apbmLedgerPresent=(await client.query("select to_regclass('apbm_migrations.ledger') is not null present")).rows[0].present;
 await client.query('ROLLBACK');
 result.summary={tablesChecked:Object.keys(result.tables).length,tablesMatched:Object.values(result.tables).filter(x=>x.equal).length,tablesDifferent:Object.entries(result.tables).filter(([,x])=>!x.equal).map(([name])=>name)};
 const allEqual=result.publicCatalog.equal&&Object.values(result.tables).every(x=>x.equal)&&Object.values(result.preservedMetadata).every(x=>x.equal)&&result.authSequences.equal&&Object.values(result.authCatalog).every(x=>x.equal)&&result.requiredFourIndexes.every(x=>x.present&&x.definitionMatches&&x.valid&&x.ready&&x.live&&x.nonunique)&&!result.apbmLedgerPresent;
 result.status=allEqual?'PASS':'DIFFERENCES';
}catch(error){
 result.error={code:/^[A-Z0-9_]+$/.test(error.code||'')?error.code:/^[A-Z0-9_]+$/.test(error.message||'')?error.message:'READ_ONLY_COMPARISON_FAILED'};
}finally{
 if(client){await client.query('ROLLBACK').catch(()=>{});await client.end().catch(()=>{});}
 result.finishedAt=new Date().toISOString();
 writeFileSync(new URL('./RESULT.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({status:result.status,projectRef:result.projectRef,backupVerified:Object.values(result.backup).length===2&&Object.values(result.backup).every(x=>x.matchesReceipt),connection:result.connection,summary:result.summary,publicCatalogEqual:result.publicCatalog?.equal,authCatalog:result.authCatalog&&Object.fromEntries(Object.entries(result.authCatalog).map(([k,v])=>[k,{equal:v.equal,beforeCount:v.beforeCount,afterCount:v.afterCount}])),error:result.error},null,2));
}
