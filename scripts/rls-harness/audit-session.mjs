#!/usr/bin/env node
// APBM independent user-session proof: real publishable client + Auth access token.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,lstatSync} from 'node:fs';
import {loadEnv,assertScratch,evidencePath} from './lib/env.mjs';
import {anonClient,serviceClient,pgClient} from './lib/db.mjs';
const env=loadEnv();assertScratch(env);const privatePath=process.env.APBM_CREDENTIAL_FILE;
if(!privatePath||!privatePath.startsWith('/tmp/')||lstatSync(privatePath).isSymbolicLink()||(lstatSync(privatePath).mode&0o077))throw new Error('private 0600 cast credentials required');
const credentials=JSON.parse(readFileSync(privatePath));assert.equal(credentials.projectRef,env.projectRef);
const m=JSON.parse(readFileSync(evidencePath('seed-map.json')));const db=await pgClient(env);const clients={};const checks=[];
const visible={OWNER1:['A1'],OWNER3:['B1','B2','B3'],ADMIN_B2:['B2'],ADMIN_B3:['B3'],MEMBER_B1:['B1'],MEMBER_B2B3:['B2','B3'],UNRELATED:['C1']};
const admin={OWNER1:['A1'],OWNER3:['B1','B2','B3'],ADMIN_B2:['B2'],ADMIN_B3:['B3'],MEMBER_B1:[],MEMBER_B2B3:[],UNRELATED:['C1']};
const auditCount=async()=>Number((await db.query('select count(*)::int n from public.audit_logs')).rows[0].n);
const snapshot=async table=>(await db.query(`select coalesce(jsonb_agg(to_jsonb(t) order by id),'[]')::text value from public.${table} t`)).rows[0].value;
const check=(name,condition)=>{assert.ok(condition,name);checks.push({name,status:'PASS'});};
async function rpc(who,name,args,allowed=true){const before=await auditCount();const r=await clients[who].rpc(name,args);if(allowed){assert.equal(r.error,null,`${who} ${name} error ${r.error?.code}`);assert.equal(await auditCount()-before,name==='tenant_stores'?0:1,`${name} audit count`);}else{assert.ok(['42501','P0001','22023'].includes(r.error?.code),`expected denial ${who} ${name}, got ${r.error?.code}`);assert.equal(await auditCount(),before,'rejection must not append audit');}checks.push({name:`${who} ${name} ${args.p_business_id||'scope'} ${allowed?'allow + exact audit':'deny + zero audit'}`,status:'PASS'});return r.data;}
try{
 for(const [key,user]of Object.entries(credentials.identities)){const c=anonClient(env);const r=await c.auth.signInWithPassword({email:user.email,password:user.password});assert.equal(r.error,null,`login ${key}`);assert.equal(r.data.user.id,m.users[key]);const claims=JSON.parse(Buffer.from(r.data.session.access_token.split('.')[1],'base64url').toString());assert.equal(claims.role,'authenticated');assert.equal(claims.sub,m.users[key]);clients[key]=c;}
 clients.anon=anonClient(env);
 for(const [who,allowed]of Object.entries(visible)){
  const scopes=await rpc(who,'tenant_stores',{});assert.deepEqual(scopes.map(s=>s.id).sort(),allowed.map(s=>m.businesses[s]).sort());
  const direct=await clients[who].from('user_data').select('id').limit(1);check(`${who} direct claim read 42501`,direct.error?.code==='42501');
  const auditDirect=await clients[who].from('audit_logs').select('id').limit(1);check(`${who} direct audit read 42501`,auditDirect.error?.code==='42501');
  for(const [store,business]of Object.entries(m.businesses)){
   const yes=allowed.includes(store);const kpis=await rpc(who,'owedbook_kpis',{p_business_id:business},yes);if(yes)assert.equal(Number(kpis[0].commercial_scripts),50);
   const rows=await rpc(who,'owedbook_rows',{p_business_id:business,p_tab:'commercial_dollars'},yes);if(yes){assert.equal(rows.total,50);assert.equal(rows.rows.length,25);assert.ok(rows.rows.every(r=>r.script.includes(`-${store}-`)&&r.federal_expected===null&&r.report_file===null));}
  }
  const cfg=await clients[who].from('system_config').select('key,value');check(`${who} scoped config read`,!cfg.error&&cfg.data.length===2);
  const own=m.businesses[allowed[0]];
  const options=await rpc(who,'owedbook_pbm_options',{p_business_id:own});assert.equal(options.length,3);
  const summary=await rpc(who,'owedbook_summary',{p_business_id:own});assert.equal(summary.length,3);
  const federal=await rpc(who,'owedbook_rows',{p_business_id:own,p_tab:'federal_dollars'});assert.equal(federal.total,0);
  for(const fn of ['admin_stores','admin_members','admin_billing_status','admin_audit']){
   const yes=admin[who].length>0;const result=await rpc(who,fn,{p_business_id:own},yes);
   if(yes&&fn==='admin_audit'){
    assert.ok(result.rows.every(r=>Number(r.id)<=Number(result.snapshot_id)),'viewer excludes own new event');
    const businessSet=who==='OWNER3'?['B1','B2','B3']:allowed;
    assert.ok(result.rows.every(r=>r.business_id===null||businessSet.some(s=>m.businesses[s]===r.business_id)),'audit tenant scope');
   }
   await rpc(who,fn,{p_business_id:m.businesses[who==='UNRELATED'?'A1':'C1']},false);
  }
 }
 // Unqualified admin store selection still derives its list from server capabilities.
 const allOwner=await rpc('OWNER3','admin_stores',{});assert.deepEqual(allOwner.map(r=>r.id).sort(),['B1','B2','B3'].map(k=>m.businesses[k]).sort());
 const allAdmin=await rpc('ADMIN_B2','admin_stores',{});assert.deepEqual(allAdmin.map(r=>r.id),[m.businesses.B2]);
 // Two committed retries are two rows; invalid calls/rolled-back transactions are zero.
 const beforeRetry=await auditCount();for(let i=0;i<2;i++)await rpc('OWNER3','owedbook_kpis',{p_business_id:m.businesses.B2});check('lost-response retry counts two commits',await auditCount()-beforeRetry===2);
 await rpc('OWNER3','admin_audit',{p_business_id:m.businesses.B2,p_limit:101},false);
 const beforeRollback=await auditCount();await db.query('BEGIN');await db.query('SET LOCAL ROLE authenticated');await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({role:'authenticated',sub:m.users.OWNER3})]);await db.query('select public.owedbook_kpis($1)',[m.businesses.B2]);await db.query('ROLLBACK');check('rolled-back successful wrapper appends zero committed events',await auditCount()===beforeRollback);
 // Mutations omit RETURNING: absence of SELECT cannot manufacture a false denial.
 for(const who of ['OWNER3','ADMIN_B2','MEMBER_B1'])for(const table of ['user_data','accounts','subscriptions']){
  const before=await snapshot(table);const business=m.businesses.B2,account=m.accounts.B;
  const row=(await db.query(`select id from public.${table} ${table==='user_data'?'where business_id=$1':table==='subscriptions'?'where account_id=$1':'where id=$1'} limit 1`,[table==='user_data'?business:account])).rows[0];
  const input=table==='user_data'?{business_id:business,script:'SYNTHETIC-DENIED'}:table==='accounts'?{name:'SYNTHETIC-DENIED',owner_user_id:m.users[who]}:{account_id:account,status:'active'};
  const patch=table==='user_data'?{owed:999}:table==='accounts'?{name:'SYNTHETIC-DENIED'}:{status:'canceled',cancel_at_period_end:true};
  for(const [op,request]of [['insert',()=>clients[who].from(table).insert(input)],['update',()=>clients[who].from(table).update(patch).eq('id',row.id)],['delete',()=>clients[who].from(table).delete().eq('id',row.id)]]){
   const r=await request();check(`${who} ${table} ${op} no RETURNING denied`,r.error?.code==='42501');check(`${who} ${table} ${op} trusted unchanged`,await snapshot(table)===before);
  }
 }
 // Account-wide NULL-business evidence comes from actual trigger-stamped rows, not caller context.
 await rpc('OWNER3','admin_audit',{p_business_id:m.businesses.B2,p_limit:100});
 const subscriptionEvent=(await db.query("select id from public.audit_logs where table_name='subscriptions' and action='insert' and new_data->>'account_id'=$1 order by id desc limit 1",[m.accounts.B])).rows[0];
 const early=await rpc('OWNER3','admin_audit',{p_business_id:m.businesses.B2,p_limit:100,p_before:Number(subscriptionEvent.id)+1});check('owner sees own account-scoped subscription insert',early.rows.some(r=>String(r.id)===String(subscriptionEvent.id)));
 const managerEarly=await rpc('ADMIN_B2','admin_audit',{p_business_id:m.businesses.B2,p_limit:100,p_before:Number(subscriptionEvent.id)+1});check('store admin cannot see NULL-business account events',managerEarly.rows.every(r=>r.business_id===m.businesses.B2));
 // Untrusted context alone must not confer account visibility.
 const forged=(await db.query("insert into public.audit_logs(actor_role,table_name,action,context) values('service_role','unattributed_probe','insert',$1) returning id",[JSON.stringify({account_id:m.accounts.B})])).rows[0].id;
 const noForged=await rpc('OWNER3','admin_audit',{p_business_id:m.businesses.B2,p_limit:100});check('context-only account claim excluded',!noForged.rows.some(r=>String(r.id)===String(forged)));
 // Live session membership removal, no token refresh and no owner entitlement involved.
 const member=clients.MEMBER_B2B3;const token=(await member.auth.getSession()).data.session.access_token;const junction=(await db.query('select * from public.user_businesses where user_id=$1 and business_id=$2',[m.users.MEMBER_B2B3,m.businesses.B3])).rows[0];
 await db.query('delete from public.user_businesses where id=$1',[junction.id]);try{await rpc('MEMBER_B2B3','owedbook_rows',{p_business_id:m.businesses.B3,p_tab:'commercial_dollars'},false);await rpc('MEMBER_B2B3','owedbook_kpis',{p_business_id:m.businesses.B2});check('revocation uses unchanged real access token',(await member.auth.getSession()).data.session.access_token===token);}finally{await db.query('insert into public.user_businesses(id,user_id,business_id,role,is_primary,joined_at,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7,$8)',Object.values(junction));}
 // Configuration is read-only for every customer and anonymous clients.
 for(const who of ['OWNER3','ADMIN_B2','MEMBER_B1','anon']){
  const before=await snapshot('system_config');
  for(const [op,request]of [['insert',()=>clients[who].from('system_config').insert({key:'dispensing_fee',state:'AL',value:999,effective_date:'2099-01-01'})],['update',()=>clients[who].from('system_config').update({value:999}).eq('state','AL')],['delete',()=>clients[who].from('system_config').delete().eq('state','AL')]]){const r=await request();check(`${who} config ${op} denied`,r.error?.code==='42501');assert.equal(await snapshot('system_config'),before);}
 }
 // Six inherited API tamper cases retain independent trusted unchanged-state checks.
 const service=serviceClient(env);const firstAudit=(await db.query('select id from public.audit_logs order by id limit 1')).rows[0].id;
 for(const [who,c]of [['service_role',service],['owner',clients.OWNER3],['anon',clients.anon]])for(const op of ['update','delete']){
  const before=await snapshot('audit_logs');const r=await (op==='update'?c.from('audit_logs').update({action:'delete'}).eq('id',firstAudit):c.from('audit_logs').delete().eq('id',firstAudit));check(`${who} audit ${op} denied`,['42501','P0001'].includes(r.error?.code));assert.equal(await snapshot('audit_logs'),before);
 }
 // Unconditional audit immutability, including trusted SQL, and unique admin index.
 const first=(await db.query('select id from public.audit_logs order by id limit 1')).rows[0].id;
 for(const sql of ['update public.audit_logs set action=action where id=$1','delete from public.audit_logs where id=$1','truncate public.audit_logs']){await db.query('BEGIN');let code;try{await db.query(sql,sql.includes('$1')?[first]:[]);}catch(e){code=e.code;}finally{await db.query('ROLLBACK');}check('audit immutable '+sql.split(' ')[0],code==='P0001');}
 await db.query('BEGIN');let duplicate;try{await db.query("insert into public.user_businesses(user_id,business_id,role) values($1,$2,'admin')",[m.users.MEMBER_B1,m.businesses.B2]);}catch(e){duplicate=e.code;}finally{await db.query('ROLLBACK');}check('second store admin rejected',duplicate==='23505');
 await db.query('BEGIN');let duplicateUpdate;try{await db.query("update public.user_businesses set role='admin' where user_id=$1 and business_id=$2",[m.users.MEMBER_B2B3,m.businesses.B2]);}catch(e){duplicateUpdate=e.code;}finally{await db.query('ROLLBACK');}check('second store admin via UPDATE rejected',duplicateUpdate==='23505');
 const fk=(await db.query("select confdeltype from pg_constraint where conrelid='public.accounts'::regclass and contype='f'")).rows;check('owner foreign key remains NO ACTION',fk.length===1&&fk[0].confdeltype==='a');
 for(const fn of ['tenant_stores','admin_stores','admin_members','admin_audit','admin_billing_status','owedbook_kpis','owedbook_rows','owedbook_pbm_options','owedbook_summary']){const args=fn==='tenant_stores'?{}:{p_business_id:m.businesses.A1,...(fn==='owedbook_rows'?{p_tab:'commercial_dollars'}:{})};await rpc('anon',fn,args,false);}
 writeFileSync(evidencePath('apbm-user-audit-proof.json'),JSON.stringify({status:'PASS',projectRef:env.projectRef,realUserCredentials:true,checks},null,2)+'\n');console.log(`${checks.length} APBM real-user access/audit/unchanged-state checks PASS`);
}catch(e){writeFileSync(evidencePath('apbm-user-audit-proof.json'),JSON.stringify({status:'FAIL',completed:checks,error:e.code||e.message},null,2)+'\n');throw e;}finally{await db.query('ROLLBACK').catch(()=>{});for(const c of Object.values(clients))await c.auth.signOut().catch(()=>{});await db.end();}
