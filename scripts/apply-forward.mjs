#!/usr/bin/env node
// APBM: fenced SCRATCH replay; ledgered forward apply; never reset DEV.
import { readFileSync,readdirSync,writeFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';
import { loadEnv,assertScratch,evidencePath,repoRoot } from './rls-harness/lib/env.mjs';
import { sha256,catalog } from './dev-verify.mjs';
const directory=join(repoRoot,'supabase/migrations');
export function inventory() {const names=readdirSync(directory).filter(n=>/^\d{4}_.+\.sql$/.test(n)).sort();names.forEach((name,i)=>{if(Number(name.slice(0,4))!==i+1)throw new Error('migration inventory is not contiguous');});return names.map(name=>({name,sha256:sha256(readFileSync(join(directory,name)))}));}
const arg=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1];};
async function main(){
 const env=loadEnv();const command=process.argv[2];if(!['inventory','scratch-reset','apply','init-ledger'].includes(command))throw new Error('unknown forward-runner command');
 const files=inventory();
 const faultAt=arg('--fault-at');if(faultAt){assertScratch(env);if(process.env.APBM_FAULT_REHEARSAL!==env.projectRef||!files.some(f=>f.name===faultAt))throw new Error('fault injection requires explicit SCRATCH rehearsal');}
 if(command==='inventory'){writeFileSync(evidencePath('migration-inventory.json'),JSON.stringify({files,bootstrapSHA256:sha256(readFileSync(join(repoRoot,'scripts/db-bootstrap-baseline.sql')))},null,2)+'\n');console.log(`Verified contiguous inventory: ${files.length} files`);return;}
 const manifestPath=arg('--manifest');if(!manifestPath)throw new Error('approved --manifest required');
 const manifest=JSON.parse(readFileSync(manifestPath));if(JSON.stringify(manifest.files)!==JSON.stringify(files))throw new Error('migration inventory/hash mismatch');
 const through=Number(arg('--through')||files.length);if(!Number.isInteger(through)||through<1||through>files.length)throw new Error('invalid through migration');
 if(command==='scratch-reset'){assertScratch(env);if(process.env.APBM_ALLOW_DESTRUCTIVE!==env.projectRef)throw new Error('explicit destructive SCRATCH confirmation required');if(manifest.bootstrapSHA256!==sha256(readFileSync(join(repoRoot,'scripts/db-bootstrap-baseline.sql'))))throw new Error('bootstrap checksum mismatch');}
 if(env.target==='dev' && process.env.APBM_DIRECTOR_APPLY!==env.projectRef)throw new Error('DEV writes are Tony-only; explicit Director apply required');
 const client=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000});const receipt={projectRef:env.projectRef,command,startedAt:new Date().toISOString(),committed:[],status:'RUNNING'};let current=null;
 try{await client.connect();await client.query("SET statement_timeout='120s'");await client.query("SET lock_timeout='5s'");
 const locked=(await client.query("select pg_try_advisory_lock(342003,1) as locked")).rows[0].locked;if(!locked)throw new Error('another APBM migration runner holds the lock');
 if(command==='scratch-reset'){
  await client.query('BEGIN');await client.query('DROP EVENT TRIGGER IF EXISTS ensure_rls; DROP SCHEMA IF EXISTS apbm_migrations CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await client.query(`GRANT USAGE ON SCHEMA public TO postgres,anon,authenticated,service_role; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres,anon,authenticated,service_role; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres,anon,authenticated,service_role; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres,anon,authenticated,service_role;`);
  await client.query(readFileSync(join(repoRoot,'scripts/db-bootstrap-baseline.sql'),'utf8'));await client.query('COMMIT');
 }
 const ledgerExists=(await client.query("select to_regclass('apbm_migrations.ledger') is not null as yes")).rows[0].yes;
 if(!ledgerExists){
  if(command!=='scratch-reset'&&command!=='init-ledger')throw new Error('ledger absent; verified baseline init-ledger required');
  await client.query('BEGIN');
  if(command==='init-ledger'){const baselinePath=arg('--baseline');if(!baselinePath)throw new Error('approved baseline catalog required');const baseline=JSON.parse(readFileSync(baselinePath));const actual=await catalog(client);if(actual.sha256!==baseline.sha256)throw new Error('baseline catalog mismatch; ledger not initialized');if(through!==47)throw new Error('initial historical baseline must be exactly 0001–0047');}
  await client.query('CREATE SCHEMA apbm_migrations; REVOKE ALL ON SCHEMA apbm_migrations FROM public,anon,authenticated,service_role; CREATE TABLE apbm_migrations.ledger(name text PRIMARY KEY,sha256 text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now());');
  if(command==='init-ledger')for(const f of files.slice(0,47))await client.query('INSERT INTO apbm_migrations.ledger(name,sha256) VALUES($1,$2)',[f.name,f.sha256]);
  await client.query('COMMIT');
 }
 if(command==='apply'){
  const beforePath=arg('--before');if(!beforePath)throw new Error('approved --before catalog receipt required before forward apply');
  const expectedBefore=JSON.parse(readFileSync(beforePath));const actualBefore=await catalog(client);
  if(actualBefore.sha256!==expectedBefore.sha256)throw new Error('pre-apply catalog mismatch; no migration executed');
 }
 const applied=(await client.query('SELECT name,sha256 FROM apbm_migrations.ledger ORDER BY name')).rows;
 if(applied.some((f,i)=>f.name!==files[i]?.name||f.sha256!==files[i]?.sha256))throw new Error('ledger is not an unchanged ordered prefix');
 if(command!=='init-ledger')for(const f of files.slice(applied.length,through)){
  current=f.name;const sql=readFileSync(join(directory,f.name),'utf8');if(sha256(sql)!==f.sha256)throw new Error('migration changed during run');
  if(/^\s*(COMMIT|ROLLBACK|START\s+TRANSACTION)\s*;/im.test(sql))throw new Error('migration contains transaction boundary');
  await client.query('BEGIN');await client.query(sql);if(f.name===faultAt)await client.query('select 1/0');await client.query('INSERT INTO apbm_migrations.ledger(name,sha256) VALUES($1,$2)',[f.name,f.sha256]);await client.query('COMMIT');receipt.committed.push(f.name);console.log(`Committed ${f.name}`);
 }
 receipt.status='PASS';receipt.lastCommitted=(await client.query('SELECT name FROM apbm_migrations.ledger ORDER BY name DESC LIMIT 1')).rows[0]?.name;
 }catch(e){await client.query('ROLLBACK').catch(()=>{});receipt.status='STOP_PARTIAL_FAILURE';receipt.failedMigration=current;receipt.errorCode=/^[A-Z0-9_]+$/.test(e.code||'')?e.code:null;receipt.reason=receipt.errorCode?'SQL failure; failed transaction rolled back':e.message;receipt.recovery='Stop. Prior committed migrations remain. Director verifies catalog/ledger and chooses rehearsed restore or a reviewed remaining-chain recovery. Never reset/replay DEV.';throw e;
 }finally{receipt.finishedAt=new Date().toISOString();writeFileSync(evidencePath(`forward-${command}-${Date.now()}.json`),JSON.stringify(receipt,null,2)+'\n');await client.end();}
}
main().catch(e=>{console.error(`Forward runner stopped: ${/^[A-Z0-9_]+$/.test(e.code||'')?e.code:e.message}`);process.exitCode=1;});
