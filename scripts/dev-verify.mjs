#!/usr/bin/env node
// Catalog-only verifier. No orchestrator imports, auth sessions, RPCs or business writes.
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync, lstatSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { loadEnv, evidencePath, repoRoot } from './rls-harness/lib/env.mjs';
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export async function catalog(client) {
 const queries = {
  columns: `select table_name,column_name,ordinal_position,data_type,udt_name,is_nullable,column_default,is_identity,identity_generation from information_schema.columns where table_schema='public' order by table_name,ordinal_position`,
  tables: `select c.relname,c.relkind,c.relrowsecurity,c.relforcerowsecurity,pg_get_userbyid(c.relowner) owner,c.relacl::text from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind in ('r','p','S','v') order by c.relname`,
  policies: `select tablename,policyname,permissive,roles,cmd,qual,with_check from pg_policies where schemaname='public' order by tablename,policyname`,
  functions: `select p.proname,pg_get_function_identity_arguments(p.oid) args,pg_get_functiondef(p.oid) definition,pg_get_userbyid(p.proowner) owner,p.proacl::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prokind='f' order by p.proname,pg_get_function_identity_arguments(p.oid)`,
  constraints: `select c.relname,k.conname,pg_get_constraintdef(k.oid) definition from pg_constraint k join pg_class c on c.oid=k.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' order by c.relname,k.conname`,
  indexes: `select tablename,indexname,indexdef from pg_indexes where schemaname='public' order by tablename,indexname`,
  triggers: `select c.relname,t.tgname,pg_get_triggerdef(t.oid) definition from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and not t.tgisinternal order by c.relname,t.tgname`,
  defaultACLs: `select pg_get_userbyid(d.defaclrole) owner,coalesce(n.nspname,'') namespace,d.defaclobjtype,d.defaclacl::text from pg_default_acl d left join pg_namespace n on n.oid=d.defaclnamespace where n.nspname='public' order by 1,2,3`,
  enums: `select t.typname,e.enumlabel,e.enumsortorder from pg_enum e join pg_type t on t.oid=e.enumtypid join pg_namespace n on n.oid=t.typnamespace where n.nspname='public' order by t.typname,e.enumsortorder`,
 };
 const snapshot={};for (const [name,sql] of Object.entries(queries)) snapshot[name]=(await client.query(sql)).rows;
 return {snapshot,sha256:sha256(JSON.stringify(snapshot))};
}
export async function inspect(env) {
 const client=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000});
 try {await client.connect();await client.query('BEGIN READ ONLY');await client.query("SET LOCAL statement_timeout='15s'");const mode=(await client.query('SHOW transaction_read_only')).rows[0].transaction_read_only;if(mode!=='on')throw new Error('read-only mode not effective');const result=await catalog(client);const ledger=(await client.query("select to_regclass('apbm_migrations.ledger') is not null as present")).rows[0].present;result.ledger=ledger?(await client.query('select name,sha256,applied_at from apbm_migrations.ledger order by name')).rows:[];await client.query('ROLLBACK');return {projectRef:env.projectRef,transactionReadOnly:mode,...result};}finally{await client.end();}
}
// Opt-in bounded authentication/read phase: auth session writes and one audit insert
// per successful audited RPC are declared effects. No business DML or admin API.
export async function authenticatedReads(env) {
 const path=process.env.APBM_CREDENTIAL_FILE;
 if(!path?.startsWith('/tmp/')||lstatSync(path).isSymbolicLink()||(lstatSync(path).mode&0o077))throw new Error('private 0600 cast credential file required');
 const credentials=JSON.parse(readFileSync(path));if(credentials.projectRef!==env.projectRef)throw new Error('cast credential target mismatch');
 const expected={OWNER1:['A1'],OWNER3:['B1','B2','B3'],ADMIN_B2:['B2'],ADMIN_B3:['B3'],MEMBER_B1:['B1'],MEMBER_B2B3:['B2','B3'],UNRELATED:['C1']};
 const db=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000});const checks=[];
 const requireCheck=(condition,name)=>{if(!condition)throw new Error(name);checks.push(name);};
 try{await db.connect();await db.query('BEGIN READ ONLY');await db.query("SET LOCAL statement_timeout='15s'");
 const storeRows=(await db.query("select id,pharmacy_name from public.businesses where pharmacy_name like 'SYNTHETIC STORE %'")).rows;
 const stores=Object.fromEntries(storeRows.map(r=>[r.pharmacy_name.replace('SYNTHETIC STORE ',''),r.id]));
 const count=async(user,fn)=>(await db.query("select count(*)::int n from public.audit_logs where actor_user_id=$1 and action='read_page' and context->>'fn'=$2",[user,fn])).rows[0].n;
 for(const [who,scopes]of Object.entries(expected)){
  const identity=credentials.identities[who];if(!identity)throw new Error('cast identity missing');
  const c=createClient(env.SUPABASE_URL,env.PUBLISHABLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
  try{const signed=await c.auth.signInWithPassword({email:identity.email,password:identity.password});requireCheck(!signed.error&&signed.data.user.id===identity.id,who+' genuine client identity');
   const tokenClaims=JSON.parse(Buffer.from(signed.data.session.access_token.split('.')[1],'base64url').toString());requireCheck(tokenClaims.role==='authenticated'&&tokenClaims.sub===identity.id,who+' authenticated JWT');
   const scope=await c.rpc('tenant_stores');requireCheck(!scope.error&&JSON.stringify(scope.data.map(r=>r.id).sort())===JSON.stringify(scopes.map(s=>stores[s]).sort()),who+' exact stores');
   const direct=await c.from('user_data').select('id').limit(1);requireCheck(direct.error?.code==='42501',who+' direct SELECT denied');
   for(const fn of ['owedbook_kpis','owedbook_rows','owedbook_summary','owedbook_pbm_options','admin_stores','admin_members','admin_audit','admin_billing_status']){
    const before=await count(identity.id,fn);const allowed=!fn.startsWith('admin_')||!who.startsWith('MEMBER_');
    const r=await c.rpc(fn,{p_business_id:stores[scopes[0]],...(fn==='owedbook_rows'?{p_tab:'commercial_dollars'}:{})});
    requireCheck(allowed?!r.error:['42501','P0001'].includes(r.error?.code),who+' '+fn+' capability');requireCheck(await count(identity.id,fn)-before===(allowed?1:0),who+' '+fn+' exact audit delta');
   }
   const outside=Object.keys(stores).find(s=>!scopes.includes(s));const before=await count(identity.id,'owedbook_rows');const denied=await c.rpc('owedbook_rows',{p_business_id:stores[outside],p_tab:'commercial_dollars'});requireCheck(denied.error?.message==='not a member of business',who+' foreign store refused');requireCheck(await count(identity.id,'owedbook_rows')===before,who+' rejection audit delta zero');
  }finally{const signedOut=await c.auth.signOut();if(signedOut.error)throw new Error('bounded sign-out failed');}
 }
 await db.query('ROLLBACK');const receipt={status:'PASS',projectRef:env.projectRef,declaredEffects:'seven login/logout sessions; 48 successful audited RPCs append 48 audit rows; no business mutation',checks};writeFileSync(evidencePath('authenticated-reads.json'),JSON.stringify(receipt,null,2)+'\n');console.log(`Bounded authenticated reads PASS: ${checks.length} checks`);
 }finally{await db.end();}
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
 try {const env=loadEnv();const result=await inspect(env);const expectedArg=process.argv.indexOf('--expect');if(expectedArg!==-1){const expected=JSON.parse(readFileSync(process.argv[expectedArg+1]));if(result.sha256!==expected.sha256)throw new Error('catalog fingerprint mismatch');}const manifestArg=process.argv.indexOf('--manifest');if(manifestArg!==-1){const manifest=JSON.parse(readFileSync(process.argv[manifestArg+1]));for(const file of manifest.files){if(!/^\d{4}_[A-Za-z0-9_]+\.sql$/.test(file.name)||sha256(readFileSync(join(repoRoot,'supabase/migrations',file.name)))!==file.sha256)throw new Error('migration inventory checksum mismatch');}const throughArg=process.argv.indexOf('--through');const through=throughArg<0?manifest.files.length:Number(process.argv[throughArg+1]);if(result.ledger.length!==through||result.ledger.some((r,i)=>r.name!==manifest.files[i]?.name||r.sha256!==manifest.files[i]?.sha256))throw new Error('ordered migration ledger mismatch');result.migrationInventoryVerified=true;}
 writeFileSync(evidencePath('catalog.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({projectRef:result.projectRef,readOnly:result.transactionReadOnly,catalogSHA256:result.sha256,tables:result.snapshot.tables.filter(t=>['r','p'].includes(t.relkind)).length,policies:result.snapshot.policies.length,functions:result.snapshot.functions.length}));if(process.argv.includes('--authenticated'))await authenticatedReads(env);}catch(e){console.error(`Verifier failed: ${/^[A-Z0-9_]+$/.test(e.code||'')?e.code:e.message?.startsWith('FAIL-CLOSED:')?e.message:'catalog check failed; inspect target configuration'}`);process.exitCode=1;}
}
