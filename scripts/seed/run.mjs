#!/usr/bin/env node
import {writeFileSync,existsSync,lstatSync,openSync,closeSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {generate,cast,stores,uid} from './generate.mjs';
import {scan} from './identity-scan.mjs';
import {loadEnv,evidencePath} from '../rls-harness/lib/env.mjs';
import {pgClient,serviceClient} from '../rls-harness/lib/db.mjs';
const env=loadEnv();if(env.target==='dev'&&process.env.APBM_DIRECTOR_APPLY!==env.projectRef)throw new Error('Tony-only DEV seed confirmation required');
const credentialPath=resolve(process.env.APBM_CREDENTIAL_FILE||'');
if(!process.env.APBM_CREDENTIAL_FILE||dirname(credentialPath)!=='/tmp'||existsSync(credentialPath))throw new Error('fresh /tmp/APBM_CREDENTIAL_FILE required; never overwrite credentials');
const fd=openSync(credentialPath,'wx',0o600);closeSync(fd);
if((lstatSync(credentialPath).mode&0o777)!==0o600)throw new Error('credential file mode must be 0600');
const data=generate();if(scan(data).length)throw new Error('synthetic identity scan failed');
const svc=serviceClient(env),db=await pgClient(env);const identities={};let committed=false;const receipt={projectRef:env.projectRef,status:'RUNNING',createdUsers:[],expectedAuditedInserts:285};
try{
 // Refuse reseed/collision before creating Auth users. No deletion or reset on DEV.
 const count=(await db.query('select count(*)::int n from public.accounts where id=any($1::uuid[])',[[uid('account:A'),uid('account:B'),uid('account:C')]])).rows[0].n;if(count)throw new Error('seed already exists; no automatic reset/reseed permitted');
 const before=(await db.query('select coalesce(max(id),0)::text id from public.audit_logs')).rows[0].id;
 for(const key of cast){const email=`apbm003-${key.toLowerCase()}@example.invalid`;const password=randomBytes(24).toString('base64url');const {data:r,error}=await svc.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:`SYNTHETIC ${key}`}});if(error)throw new Error(`Auth seed ${key}: ${error.code||error.status}`);identities[key]={id:r.user.id,email,password};receipt.createdUsers.push(key);writeFileSync(credentialPath,JSON.stringify({projectRef:env.projectRef,identities},null,2)+'\n',{mode:0o600});}
 await db.query('BEGIN');await db.query("SET LOCAL request.jwt.claims = '{\"role\":\"service_role\"}'");
 const insert=async(table,rows)=>{for(const row of rows){const keys=Object.keys(row);await db.query(`insert into public.${table}(${keys.join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(row));}};
 for(const [key,user]of Object.entries(identities)){await db.query("insert into public.user_roles(user_id,role) values($1,'member') on conflict(user_id) do update set role='member'",[user.id]);await db.query('insert into public.profiles(id,email,full_name) values($1,$2,$3) on conflict(id) do update set email=excluded.email,full_name=excluded.full_name',[user.id,user.email,`SYNTHETIC ${key}`]);}
 await insert('accounts',[['A','OWNER1'],['B','OWNER3'],['C','UNRELATED']].map(([account,owner])=>({id:uid('account:'+account),name:'SYNTHETIC ACCOUNT '+account,owner_user_id:identities[owner].id})));
 await insert('businesses',stores.map((store,i)=>({id:uid('store:'+store),account_id:uid('account:'+store[0]),ncpdp:`SYNTH-${i+1}`,npi:`SYNTH-NPI-${i+1}`,pharmacy_name:'SYNTHETIC STORE '+store,state:'AL',status:'active',pharmacy_slug:'apbm003-synthetic-'+store.toLowerCase()})));
 const junctions=[['OWNER1','A1','admin'],['OWNER3','B1','admin'],['ADMIN_B2','B2','admin'],['ADMIN_B3','B3','admin'],['MEMBER_B1','B1','member'],['MEMBER_B2B3','B2','member'],['MEMBER_B2B3','B3','member'],['UNRELATED','C1','admin']];
 await insert('user_businesses',junctions.map(([user,store,role],i)=>({id:uid('junction:'+i),user_id:identities[user].id,business_id:uid('store:'+store),role,is_primary:store!=='B3'||user==='ADMIN_B3'})));
 await insert('subscriptions',['A','B','C'].map((account,i)=>({id:uid('subscription:'+account),account_id:uid('account:'+account),status:['active','trialing','past_due'][i],current_period_end:'2027-01-01T00:00:00Z'})));
 for(const [table,rows]of [['reference_dataset_versions',data.datasets],['aac_reference',data.aac],['wac_reference',data.wac],['ful_reference',data.ful],['pbm_info',data.pbms],['system_config',data.config],['user_data',data.claims]])await insert(table,rows);
 const audit=(await db.query("select count(*)::int count,count(*) filter(where actor_role='service_role' and actor_user_id is null)::int correctly_attributed from public.audit_logs where id>$1",[before])).rows[0];if(audit.count!==285||audit.correctly_attributed!==285)throw new Error('seed audit count/attribution mismatch');
 await db.query('COMMIT');committed=true;receipt.status='PASS';receipt.auditBoundaryBefore=before;receipt.observedAudit=audit;receipt.cast=cast;receipt.stores=stores;receipt.claims=250;
 writeFileSync(evidencePath('seed-map.json'),JSON.stringify({projectRef:env.projectRef,users:Object.fromEntries(Object.entries(identities).map(([k,v])=>[k,v.id])),businesses:Object.fromEntries(stores.map(s=>[s,uid('store:'+s)])),accounts:Object.fromEntries(['A','B','C'].map(a=>[a,uid('account:'+a)]))},null,2)+'\n');console.log('Synthetic seed PASS: seven users, five stores, 250 claims, 285 attributed audit rows');
}catch(e){await db.query('ROLLBACK').catch(()=>{});receipt.status='STOP_PARTIAL_SEED';receipt.reason=e.code||e.message;receipt.recovery='Public transaction rolled back unless committed; Auth identities listed by handle may remain. No automatic destructive cleanup on DEV. Director reviews private credential file and receipt.';throw e;
}finally{receipt.publicCommitted=committed;writeFileSync(evidencePath(`seed-receipt-${Date.now()}.json`),JSON.stringify(receipt,null,2)+'\n');await db.end();}
