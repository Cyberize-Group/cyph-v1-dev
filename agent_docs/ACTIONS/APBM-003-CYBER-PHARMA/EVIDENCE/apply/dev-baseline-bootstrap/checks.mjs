// Proposal verification module: exports read-only checks, never executes bootstrap.
// A later reviewed executor must own BEGIN/locks/ROLLBACK/COMMIT. No CLI apply mode.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {catalog} from '../../../../../../scripts/dev-verify.mjs';
import {repoRoot,sqlRef,apiRef,DEV_REF,SCRATCH_REF} from '../../../../../../scripts/rls-harness/lib/env.mjs';
export const plan=JSON.parse(readFileSync(new URL('./PLAN_MANIFEST.json',import.meta.url)));
const hash=value=>createHash('sha256').update(value).digest('hex');
const qi=value=>'"'+value.replaceAll('"','""')+'"';
export function verifyInputs(){
 for(const [name,expected]of Object.entries(plan.inputs))assert.equal(hash(readFileSync(join(repoRoot,name))),expected,'pinned input changed: '+name);
 assert.equal(hash(readFileSync(new URL('./PROPOSED_BOOTSTRAP.sql',import.meta.url))),plan.bootstrapSHA256,'proposed SQL changed');
}
export function assertTarget(env,target){
 const expected=target==='dev'?DEV_REF:target==='scratch'?SCRATCH_REF:null;
 assert.ok(expected,'explicit dev or scratch target required');
 assert.equal(env.target,target);assert.equal(env.projectRef,expected);
 assert.equal(sqlRef(env.DB_URL),expected);assert.equal(apiRef(env.SUPABASE_URL),expected);
}
export async function preservedTables(client){
 const rows=(await client.query("select n.nspname schema,c.relname name from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind in ('r','p') and (n.nspname='auth' or (n.nspname='public' and c.relname in ('profiles','user_roles')) or (n.nspname='supabase_migrations' and c.relname='schema_migrations')) order by n.nspname,c.relname")).rows;
 assert.ok(rows.some(r=>r.schema==='auth'&&r.name==='users'));assert.ok(rows.some(r=>r.schema==='auth'&&r.name==='identities'));
 assert.ok(rows.some(r=>r.schema==='public'&&r.name==='profiles'));assert.ok(rows.some(r=>r.schema==='public'&&r.name==='user_roles'));
 return rows;
}
export async function lockPreserved(client){
 // Proposed executor only: call after BEGIN and a short lock_timeout, before capture.
 // Must run in the approved maintenance window; no privilege bypass on failure.
 const tables=await preservedTables(client);
 await client.query('LOCK TABLE '+tables.map(r=>qi(r.schema)+'.'+qi(r.name)).join(', ')+' IN SHARE ROW EXCLUSIVE MODE');
}
export async function capturePreservation(client,privateSalt){
 assert.ok(typeof privateSalt==='string'&&privateSalt.length>=64,'private random salt required');
 const result={tables:{}};
 for(const r of await preservedTables(client)){
  // Only salted row hashes leave PostgreSQL; no row values or credentials in receipts.
  const rows=(await client.query('select encode(sha256(convert_to($1 || to_jsonb(t)::text,\'UTF8\')),\'hex\') h from '+qi(r.schema)+'.'+qi(r.name)+' t order by h',[privateSalt])).rows;
  result.tables[r.schema+'.'+r.name]={count:rows.length,sha256:hash(rows.map(r=>r.h).join('\n'))};
 }
 result.userRolesSequence=(await client.query('select last_value::text,is_called from public.user_roles_id_seq')).rows;
 result.sequenceSettings=(await client.query("select sequencename,sequenceowner,data_type,start_value::text,min_value::text,max_value::text,increment_by::text,cycle,cache_size::text from pg_sequences where schemaname='public' and sequencename='user_roles_id_seq'")).rows;
 result.authTriggers=(await client.query("select c.relname,t.tgname,pg_get_triggerdef(t.oid) definition,t.tgenabled from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='auth' and not t.tgisinternal order by c.relname,t.tgname")).rows;
 result.eventTriggers=(await client.query("select e.evtname,e.evtevent,e.evtenabled,e.evttags,pg_get_userbyid(e.evtowner) owner,n.nspname function_schema,p.proname from pg_event_trigger e join pg_proc p on p.oid=e.evtfoid join pg_namespace n on n.oid=p.pronamespace order by e.evtname")).rows;
 result.roles=(await client.query('select rolname,rolsuper,rolinherit,rolcreaterole,rolcreatedb,rolcanlogin,rolreplication,rolbypassrls,rolconnlimit,rolvaliduntil::text,rolconfig from pg_roles order by rolname')).rows;
 result.memberships=(await client.query('select r.rolname role,m.rolname member,g.rolname grantor,a.admin_option,a.inherit_option,a.set_option from pg_auth_members a join pg_roles r on r.oid=a.roleid join pg_roles m on m.oid=a.member join pg_roles g on g.oid=a.grantor order by r.rolname,m.rolname,g.rolname')).rows;
 result.globalDefaultACLs=(await client.query("select pg_get_userbyid(defaclrole) owner,defaclobjtype,defaclacl::text from pg_default_acl where defaclnamespace=0 order by 1,2")).rows;
 return result;
}
async function noLedger(client){
 assert.equal((await client.query("select to_regclass('apbm_migrations.ledger') is null absent")).rows[0].absent,true,'APBM ledger must remain absent');
}
export async function assertBefore(client){
 verifyInputs();const actual=await catalog(client);
 assert.equal(actual.sha256,plan.expectedBeforeSHA256,'starting catalog drift; no bootstrap allowed');
 await noLedger(client);
 const versions=(await client.query('select version from supabase_migrations.schema_migrations order by version')).rows.map(r=>r.version);
 assert.deepEqual(versions,plan.preservedNativeMigrationVersions,'native migration history drift');
 return actual;
}
export async function assertAfter(client,before,privateSalt){
 verifyInputs();const actual=await catalog(client);
 assert.equal(actual.sha256,plan.expectedAfterSHA256,'exact 0047 catalog parity failed');
 assert.equal(actual.snapshot.tables.filter(r=>['r','p'].includes(r.relkind)).length,16);
 assert.equal(actual.snapshot.policies.length,19);assert.equal(actual.snapshot.functions.length,13);
 await noLedger(client);
 const after=await capturePreservation(client,privateSalt);
 assert.deepEqual(after,before,'users/roles/data/sequence/Auth/native-ledger/role metadata changed');
 for(const table of plan.newTables){
  const any=(await client.query('select exists(select 1 from public.'+qi(table)+') present')).rows[0].present;
  assert.equal(any,false,'new table unexpectedly contains data: '+table);
 }
 return {status:'PASS',catalogSHA256:actual.sha256,apbmLedgerAbsent:true,preservation:'exact match',newTablesEmpty:plan.newTables.length};
}
