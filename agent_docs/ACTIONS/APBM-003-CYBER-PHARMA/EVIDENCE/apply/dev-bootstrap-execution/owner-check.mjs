#!/usr/bin/env node
// Explicit authenticated proof: 1 login/logout session, 4 audited RPC successes.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,lstatSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createClient} from '@supabase/supabase-js';
import pg from 'pg';
import {loadEnv,evidencePath} from '../../../../../../scripts/rls-harness/lib/env.mjs';
async function main(){
 const env=loadEnv();if(process.env.APBM_AUTHENTICATED_PROBES!==env.projectRef)throw new Error('explicit authenticated-probe release required');
 if(env.target==='dev'&&process.env.APBM_DIRECTOR_APPLY!==env.projectRef)throw new Error('Tony-only DEV proof');
 const path=resolve(process.env.APBM_CREDENTIAL_FILE||'');if(dirname(path)!=='/tmp'||lstatSync(path).isSymbolicLink()||(lstatSync(path).mode&0o777)!==0o600)throw new Error('private 0600 cast file required');
 const cast=JSON.parse(readFileSync(path));assert.equal(cast.projectRef,env.projectRef);const user=cast.identities.OWNER3;assert.ok(user);
 const db=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000,query_timeout:15000,options:'-c default_transaction_read_only=on'});
 const client=createClient(env.SUPABASE_URL,env.PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const receipt={projectRef:env.projectRef,status:'RUNNING',declaredEffects:'1 login/logout session; 4 successful audited RPCs append 4 audit rows; tenant_stores read and one denied foreign-store RPC; no business writes',checks:[]};let signed=false;
 const check=(v,name)=>{assert.ok(v,name);receipt.checks.push(name);};
 try{await db.connect();await db.query('BEGIN READ ONLY');await db.query("SET LOCAL statement_timeout='15s'");
  const rows=(await db.query("select b.id,b.pharmacy_name,a.owner_user_id from public.businesses b join public.accounts a on a.id=b.account_id where b.pharmacy_name in ('SYNTHETIC STORE A1','SYNTHETIC STORE B1','SYNTHETIC STORE B2','SYNTHETIC STORE B3')")).rows;
  const stores=Object.fromEntries(rows.map(r=>[r.pharmacy_name.replace('SYNTHETIC STORE ',''),r]));check(Object.keys(stores).length===4,'four expected stores');
  for(const name of['B1','B2','B3'])check(stores[name].owner_user_id===user.id,name+' account owned by OWNER3');
  const junctions=(await db.query('select count(*)::int n from public.user_businesses where user_id=$1 and business_id=any($2::uuid[])',[user.id,[stores.B2.id,stores.B3.id]])).rows[0].n;check(junctions===0,'OWNER3 has no B2/B3 junction');
  const auditCount=async()=>Number((await db.query("select count(*) n from public.audit_logs where actor_user_id=$1 and action='read_page'",[user.id])).rows[0].n);const before=await auditCount();
  const auth=await client.auth.signInWithPassword({email:user.email,password:user.password});check(!auth.error&&auth.data.user?.id===user.id,'real OWNER3 client login');signed=true;
  const jwt=JSON.parse(Buffer.from(auth.data.session.access_token.split('.')[1],'base64url').toString());check(jwt.role==='authenticated'&&jwt.sub===user.id,'authenticated user JWT');
  const scope=await client.rpc('tenant_stores');check(!scope.error&&JSON.stringify(scope.data.map(r=>r.id).sort())===JSON.stringify(['B1','B2','B3'].map(k=>stores[k].id).sort()),'exact owner store scope');
  for(const name of['B2','B3'])for(const fn of['owedbook_rows','admin_members']){
   const n=await auditCount();const r=await client.rpc(fn,{p_business_id:stores[name].id,...(fn==='owedbook_rows'?{p_tab:'commercial_dollars'}:{})});check(!r.error,name+' '+fn+' allowed without junction');check(await auditCount()===n+1,name+' '+fn+' exact audit +1');
  }
  const n=await auditCount();const denied=await client.rpc('owedbook_rows',{p_business_id:stores.A1.id,p_tab:'commercial_dollars'});check(denied.error?.message==='not a member of business','foreign account denied');check(await auditCount()===n,'foreign denial audit +0');
  receipt.auditDelta=await auditCount()-before;check(receipt.auditDelta===4,'exact aggregate audit +4');await db.query('ROLLBACK');receipt.status='PASS';
 }catch(e){receipt.status='BLOCKED';receipt.errorCode=/^[A-Z0-9_]{2,60}$/.test(e.code||'')?e.code:'OWNER_PROOF_FAILED';process.exitCode=1;}
 finally{if(signed){const r=await client.auth.signOut();if(r.error){receipt.status='BLOCKED';receipt.signOut='FAILED';process.exitCode=1;}}await db.query('ROLLBACK').catch(()=>{});await db.end().catch(()=>{});writeFileSync(evidencePath('owner-proof.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));}
}
main().catch(()=>{console.error(JSON.stringify({status:'BLOCKED',code:'OWNER_PROOF_CONFIG_REQUIRED'}));process.exitCode=1;});
