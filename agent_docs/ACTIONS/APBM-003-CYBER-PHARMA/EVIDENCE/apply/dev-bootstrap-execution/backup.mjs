#!/usr/bin/env node
// Read-only source backup. Private dump/log never enter the repository or ZIP.
import {spawnSync} from 'node:child_process';
import {mkdirSync,chmodSync,writeFileSync,readFileSync,openSync,closeSync,realpathSync} from 'node:fs';
import {createHash,randomBytes} from 'node:crypto';
import {join} from 'node:path';
import pg from 'pg';
import {loadEnv,DEV_REF,evidencePath} from '../../../../../../scripts/rls-harness/lib/env.mjs';
const fail=code=>{throw Object.assign(new Error(code),{code});};
const sha=x=>createHash('sha256').update(x).digest('hex');
async function main(){
 const mode=process.argv[2]||'check';if(!['check','backup'].includes(mode))fail('UNKNOWN_MODE');const env=loadEnv();if(env.target!=='dev'||env.projectRef!==DEV_REF)fail('DEV_SOURCE_REQUIRED');
 const tools={pg_dump:process.env.APBM_PG_DUMP||'pg_dump',pg_restore:process.env.APBM_PG_RESTORE||'pg_restore'};const versions={};
 for(const[name,tool]of Object.entries(tools)){const r=spawnSync(tool,['--version'],{encoding:'utf8'});if(r.status!==0)fail('BACKUP_TOOL_UNAVAILABLE');const m=r.stdout.match(/PostgreSQL\)?\s+(\d+)\./);if(!m)fail('BACKUP_TOOL_VERSION_UNKNOWN');versions[name]=Number(m[1]);}
 const c=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000,options:'-c default_transaction_read_only=on'});let serverMajor;
 try{await c.connect();await c.query('BEGIN READ ONLY');serverMajor=Math.floor(Number((await c.query('show server_version_num')).rows[0].server_version_num)/10000);await c.query('ROLLBACK');}finally{await c.end();}
 const receipt={projectRef:DEV_REF,serverMajor,tools:versions,checkedAt:new Date().toISOString(),mode};
 if(Object.values(versions).some(v=>v!==serverMajor)){receipt.status='BLOCKED';receipt.reason='MATCHING_MAJOR_BACKUP_TOOLS_REQUIRED';writeFileSync(evidencePath('backup-tool-check.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));process.exitCode=1;return;}
 if(mode==='check'){receipt.status='PASS';writeFileSync(evidencePath('backup-tool-check.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));return;}
 // This is the database archive component only; provider settings, role inventory
 // and restore proof must be added before any overall backup receipt is PASS.
 if(realpathSync('/tmp')!=='/tmp')fail('PRIVATE_DIRECTORY_UNSAFE');const dir=join('/tmp','apbm003-dev-backup-'+Date.now()+'-'+randomBytes(5).toString('hex'));mkdirSync(dir,{mode:0o700});
 const file=join(dir,'dev-before.dump'),log=join(dir,'pg-dump.private.log');const fd=openSync(log,'wx',0o600);const u=new URL(env.DB_URL);
 const childEnv={...process.env,PGHOST:u.hostname,PGPORT:u.port||'5432',PGUSER:decodeURIComponent(u.username),PGPASSWORD:decodeURIComponent(u.password),PGDATABASE:u.pathname.slice(1),PGOPTIONS:'-c default_transaction_read_only=on',PGCONNECT_TIMEOUT:'10',PGSSLMODE:'require',PGAPPNAME:'apbm003-readonly-backup'};
 // Refuse extra connection parameters rather than silently ignoring a certificate/service configuration.
 if(u.search)fail('BACKUP_URL_PARAMETERS_REQUIRE_REVIEW');
 const dump=spawnSync(tools.pg_dump,['--format=custom','--schema=public','--schema=auth','--schema=supabase_migrations','--no-publications','--no-subscriptions','--file='+file],{env:childEnv,stdio:['ignore',fd,fd]});closeSync(fd);
 if(dump.status!==0)fail('PG_DUMP_FAILED_PRIVATE_LOG');chmodSync(file,0o600);const list=spawnSync(tools.pg_restore,['--list',file],{encoding:'utf8'});if(list.status!==0)fail('DUMP_ARCHIVE_UNREADABLE');writeFileSync(join(dir,'archive.private.list'),list.stdout,{mode:0o600,flag:'wx'});
 Object.assign(receipt,{status:'ARCHIVE_COMPONENT_COMPLETE',coverageComplete:false,privateDirectory:dir,backupSHA256:sha(readFileSync(file)),coverage:['public schema/data/default ACLs','Auth schema/data','native migration schema/data'],remainingCoverage:['private provider Auth configuration and exclusions','role/trigger/sequence metadata inventory','focused restore verification']});writeFileSync(evidencePath('backup-archive-component.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
}
main().catch(e=>{console.error(JSON.stringify({status:'BLOCKED',code:/^[A-Z0-9_]{2,60}$/.test(e.code||'')?e.code:'BACKUP_CHECK_FAILED'}));process.exitCode=1;});
