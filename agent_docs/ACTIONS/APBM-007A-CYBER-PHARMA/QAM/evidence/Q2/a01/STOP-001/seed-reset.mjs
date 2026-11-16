#!/usr/bin/env node
// Deletes only the deterministic APBM seed slice. Never touches audit_logs or non-seed users.
import {generate,cast,stores,uid} from './generate.mjs';
import {loadEnv,assertScratch,evidencePath} from '../rls-harness/lib/env.mjs';
import {pgClient,serviceClient} from '../rls-harness/lib/db.mjs';
import {writeFileSync} from 'node:fs';
const env=loadEnv();assertScratch(env);if(process.env.APBM_ALLOW_DESTRUCTIVE!==env.projectRef)throw new Error('SCRATCH reset confirmation required');
const db=await pgClient(env);const svc=serviceClient(env);const data=generate();const counts={};
try{await db.query('BEGIN');await db.query("SET LOCAL request.jwt.claims='{\"role\":\"service_role\"}'");
 const groups=[['user_data',data.claims.map(r=>r.id)],['subscriptions',['A','B','C'].map(a=>uid('subscription:'+a))],['user_businesses',Array.from({length:8},(_,i)=>uid('junction:'+i))],['businesses',stores.map(s=>uid('store:'+s))],['accounts',['A','B','C'].map(a=>uid('account:'+a))],['aac_reference',data.aac.map(r=>r.id)],['wac_reference',data.wac.map(r=>r.id)],['ful_reference',data.ful.map(r=>r.id)],['pbm_info',data.pbms.map(r=>r.id)],['reference_dataset_versions',data.datasets.map(r=>r.id)],['system_config',data.config.map(r=>r.id)]];
 for(const [table,ids]of groups)counts[table]=(await db.query(`delete from public.${table} where id=any($1::uuid[])`,[ids])).rowCount;
 await db.query('COMMIT');
 // Enumerate first; deleting during pagination could skip identities.
 const users=[];for(let page=1;;page++){const r=await svc.auth.admin.listUsers({page,perPage:100});if(r.error)throw new Error('Auth enumeration failed');users.push(...r.data.users);if(r.data.users.length<100)break;}
 const emails=new Set(cast.map(k=>`apbm003-${k.toLowerCase()}@example.invalid`));let removed=0;
 for(const user of users.filter(u=>emails.has(u.email))){const r=await svc.auth.admin.deleteUser(user.id);if(r.error)throw new Error('seed auth cleanup blocked; no broad deletion attempted');removed++;}
 writeFileSync(evidencePath(`seed-reset-${Date.now()}.json`),JSON.stringify({status:'PASS',projectRef:env.projectRef,deleted:counts,seedAuthUsersRemoved:removed,auditLogsPreserved:true},null,2)+'\n');console.log('SCRATCH seed slice reset; audit and non-seed users preserved');
}finally{await db.query('ROLLBACK').catch(()=>{});await db.end();}
