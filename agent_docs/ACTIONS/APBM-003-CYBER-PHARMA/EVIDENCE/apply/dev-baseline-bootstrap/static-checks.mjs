import assert from 'node:assert/strict';import {readFileSync,writeFileSync} from 'node:fs';
import {plan,verifyInputs,assertTarget,assertBefore,assertAfter,capturePreservation} from './checks.mjs';
const checks=[];const test=async(name,fn)=>{await fn();checks.push({name,status:'PASS'});};
await test('all approved inputs and SQL hash pinned',()=>verifyInputs());
const config=ref=>({target:'dev',projectRef:ref,DB_URL:`postgres://postgres.${ref}:synthetic@aws-1-us-east-1.pooler.supabase.com:5432/postgres`,SUPABASE_URL:`https://${ref}.supabase.co`});
await test('DEV target accepted',()=>assertTarget(config(plan.devProjectRef),'dev'));
for(const ref of[plan.scratchProjectRef,plan.pilotRejected])await test('reject non-DEV '+ref,()=>assert.throws(()=>assertTarget(config(ref),'dev')));
const sql=readFileSync(new URL('./PROPOSED_BOOTSTRAP.sql',import.meta.url),'utf8');
// Remove comments, quoted strings and dollar-quoted function bodies, leaving top-level DDL.
const tokens=sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\/|\$([A-Za-z_][A-Za-z0-9_]*)?\$[\s\S]*?\$\1\$|'(?:''|[^'])*'/g,' ');
await test('no top-level data mutation, DROP, COMMIT, ledger creation or seed',()=>{
 assert.doesNotMatch(tokens,/(?:^|;)\s*(?:DROP|TRUNCATE|INSERT|UPDATE|DELETE|COMMIT)\b/i);
 assert.doesNotMatch(tokens,/CREATE\s+(?:TABLE|SCHEMA)\s+apbm_migrations/i);
});
const created=[...tokens.matchAll(/create\s+table\s+public\.([a-z_]+)/gi)].map(m=>m[1]).sort();
await test('exactly the 14 missing tables; no replacement of existing tables',()=>assert.deepEqual(created,[...plan.newTables].sort()));
await test('16 missing policies; existing 3 policies untouched',()=>assert.equal([...tokens.matchAll(/create\s+policy\b/gi)].length,16));
await test('13 function definitions: 11 missing plus 2 reconciliations',()=>assert.equal([...tokens.matchAll(/create\s+(?:or\s+replace\s+)?function\s+public\./gi)].length,13));
await test('old audit shape and drop/recreate path excluded',()=>{assert.doesNotMatch(tokens,/record_id|idx_audit_logs_table_record/);assert.match(tokens,/id\s+bigint\s+generated\s+always\s+as\s+identity/i);});
await test('all 3 managed default ACL changes explicitly scoped',()=>assert.equal([...tokens.matchAll(/ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public/gi)].length,3));
const live=JSON.parse(readFileSync(new URL('../dev-target-reconciliation/catalog.json',import.meta.url)));
const groups=['columns','tables','policies','functions','constraints','indexes','triggers','defaultACLs','enums'];
function mockCatalog(snapshot,tail=[]){let i=0;return {query:async()=>({rows:i<groups.length?snapshot[groups[i++]]:tail[i++-groups.length]??[]})};}
await test('before check rejects catalog drift',async()=>{const bad=structuredClone(live.snapshot);bad.policies=[];await assert.rejects(assertBefore(mockCatalog(bad)),/starting catalog drift/);});
await test('before check rejects pre-existing APBM ledger',async()=>await assert.rejects(assertBefore(mockCatalog(live.snapshot,[[{absent:false}]])),/ledger must remain absent/));
await test('after check rejects unbootstrapped catalog',async()=>await assert.rejects(assertAfter(mockCatalog(live.snapshot),{},'x'.repeat(64)),/exact 0047/));
const baseline=JSON.parse(readFileSync(new URL('../../E2/stage-5/recovery/baseline.json',import.meta.url)));
function matchingClient(catalogFirst=true){let i=catalogFirst?0:9;return {query:async sql=>{
 if(i<9)return {rows:baseline.snapshot[groups[i++]]};
 if(sql.includes("to_regclass('apbm_migrations.ledger')"))return {rows:[{absent:true}]};
 if(sql.startsWith('select n.nspname schema'))return {rows:[{schema:'auth',name:'users'},{schema:'auth',name:'identities'},{schema:'public',name:'profiles'},{schema:'public',name:'user_roles'}]};
 if(sql.startsWith('select exists(select 1'))return {rows:[{present:false}]};
 return {rows:[]};
}};}
const privateSalt='x'.repeat(64),preserved=await capturePreservation(matchingClient(false),privateSalt);
await test('after check rejects changed data even with matching schema',async()=>await assert.rejects(assertAfter(matchingClient(),{...preserved,tables:{}},privateSalt),/changed/));
await test('after check accepts matching schema plus preservation and empty new tables',async()=>assert.equal((await assertAfter(matchingClient(),preserved,privateSalt)).status,'PASS'));
writeFileSync(new URL('./STATIC_RESULTS.json',import.meta.url),JSON.stringify({status:'PASS',kind:'local static and negative-control checks; not a database rehearsal',checks},null,2)+'\n');console.log(`${checks.length} local proposal checks PASS`);
