// Read-only DEV index guard: no DDL, login or business writes.
import assert from 'node:assert/strict';import {readFileSync,writeFileSync} from 'node:fs';import pg from 'pg';
import {loadEnv,evidencePath,DEV_REF} from '../../../../../../scripts/rls-harness/lib/env.mjs';
const expected=JSON.parse(readFileSync(new URL('../dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json',import.meta.url))).missingOnScratch;
const label=process.argv[2];assert.match(label||'',/^[a-z0-9-]+$/);const env=loadEnv();assert.equal(env.target,'dev');assert.equal(env.projectRef,DEV_REF);
const c=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:15000,options:'-c default_transaction_read_only=on -c statement_timeout=15000'});
try{await c.connect();await c.query('BEGIN READ ONLY');assert.equal((await c.query('show transaction_read_only')).rows[0].transaction_read_only,'on');
const all=(await c.query("select c.relname indexname,pg_get_indexdef(i.indexrelid) indexdef,i.indisvalid,i.indisready,i.indislive,i.indisunique from pg_index i join pg_class c on c.oid=i.indexrelid where i.indrelid='auth.users'::regclass order by c.relname")).rows;
for(const x of expected){const y=all.find(r=>r.indexname===x.indexname);assert.ok(y,'missing '+x.indexname);assert.equal(y.indexdef,x.indexdef,'definition changed '+x.indexname);assert.ok(y.indisvalid&&y.indisready&&y.indislive&&!y.indisunique,'flags changed '+x.indexname);}
if(process.argv[3]){const before=JSON.parse(readFileSync(process.argv[3]));assert.equal(before.projectRef,env.projectRef);assert.equal(before.status,'PASS');assert.deepEqual(all,before.allAuthUserIndexes,'any Auth users index changed');}
await c.query('ROLLBACK');writeFileSync(evidencePath('dev-auth-indexes-'+label+'.json'),JSON.stringify({status:'PASS',projectRef:env.projectRef,checkedAt:new Date().toISOString(),readOnly:true,fourDefinitionsAndValidityExact:true,allAuthUserIndexes:all},null,2)+'\n',{flag:'wx'});console.log('PASS: four DEV Auth index definitions/validity exact; optional full before/after comparison passed');
}catch(e){console.error('BLOCKED: DEV Auth index check '+(/^[A-Z0-9_]+$/.test(e.code||'')?e.code:'definition, validity, configuration, or connection mismatch'));process.exitCode=1;}finally{await c.end().catch(()=>{});}
