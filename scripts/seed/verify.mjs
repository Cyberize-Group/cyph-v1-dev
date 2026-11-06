#!/usr/bin/env node
import assert from 'node:assert/strict';
import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {generate,cast,stores,uid} from './generate.mjs';
import {scan} from './identity-scan.mjs';
import {loadEnv,assertScratch,evidencePath} from '../rls-harness/lib/env.mjs';
import {pgClient} from '../rls-harness/lib/db.mjs';
const env=loadEnv(),db=await pgClient(env),data=generate();const attacking=process.argv.includes('--attack');if(attacking)assertScratch(env);
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const groups=[['accounts',['A','B','C'].map(a=>uid('account:'+a))],['businesses',stores.map(s=>uid('store:'+s))],['user_businesses',Array.from({length:8},(_,i)=>uid('junction:'+i))],['subscriptions',['A','B','C'].map(a=>uid('subscription:'+a))],['reference_dataset_versions',data.datasets.map(r=>r.id)],['aac_reference',data.aac.map(r=>r.id)],['wac_reference',data.wac.map(r=>r.id)],['ful_reference',data.ful.map(r=>r.id)],['pbm_info',data.pbms.map(r=>r.id)],['system_config',data.config.map(r=>r.id)],['user_data',data.claims.map(r=>r.id)]];
const result={projectRef:env.projectRef,status:'RUNNING'};
try{await db.query(attacking?'BEGIN':'BEGIN READ ONLY');
 const profiles=(await db.query('select to_jsonb(p) row from public.profiles p where email=any($1::text[]) order by email',[cast.map(k=>`apbm003-${k.toLowerCase()}@example.invalid`)])).rows.map(r=>r.row);assert.equal(profiles.length,7);
 const users=Object.fromEntries(profiles.map(p=>[p.id,p.email]));
 for(const name of ['A','B','C'])users[uid('account:'+name)]='ACCOUNT:'+name;
 for(const name of stores)users[uid('store:'+name)]='STORE:'+name;
 for(const r of data.datasets)users[r.id]='DATASET:'+r.dataset_name;const ids=profiles.map(p=>p.id);
 const collect=async()=>{const out={};for(const[table,ids]of groups){const rows=(await db.query(`select to_jsonb(t) row from public.${table} t where id=any($1::uuid[]) order by id`,[ids])).rows.map(r=>r.row);assert.equal(rows.length,ids.length,`${table} seed count`);out[table]=rows;}out.profiles=profiles;out.user_roles=(await db.query('select to_jsonb(r) row from public.user_roles r where user_id=any($1::uuid[]) order by user_id',[ids])).rows.map(r=>r.row);assert.equal(out.user_roles.length,7);assert.ok(out.user_roles.every(r=>r.role==='member'));return out;};
 const normalize=value=>{if(Array.isArray(value))return value.map(normalize).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([k])=>!['id','created_at','updated_at','joined_at'].includes(k)).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,normalize(v)]));return users[value]||value;};
 const rows=await collect();assert.deepEqual(scan(rows),[],'identity scan over every stored seeded column');
 // Independent SQL arithmetic: recompute from dated reference inputs, not generator-calculated outputs.
 const arithmetic=(await db.query(`with rates as (
 select u.*, a.aac, w.wac,w.pkg_size,w.pkg_size_mult,w.generic_indicator,f.aca_ful,
 case when a.aac is not null then 'AAC' when w.generic_indicator='B' then 'BWAC'
 when f.aca_ful is not null and w.wac/(w.pkg_size*w.pkg_size_mult)>f.aca_ful then 'FUL' else 'GWAC' end expected_method,
 round(case when a.aac is not null then a.aac when w.generic_indicator='B' then w.wac/(w.pkg_size*w.pkg_size_mult)*0.96
 else least(w.wac/(w.pkg_size*w.pkg_size_mult),coalesce(f.aca_ful,w.wac/(w.pkg_size*w.pkg_size_mult))) end,5) rate
 from public.user_data u left join public.aac_reference a on a.ndc=u.drug_ndc and a.aac_date='2026-01-01'
 join public.wac_reference w on w.ndc=u.drug_ndc and w.effective_date='2026-01-01'
 left join public.ful_reference f on f.ndc=u.drug_ndc and f.year=2026 and f.month=1 where u.id=any($1::uuid[]))
 select count(*)::int total,count(*) filter(where medicaid_rate<>rate or medicaid_method<>expected_method or expected_paid<>round(qty*rate+10.64,2) or owed<>expected_paid-total_paid or pbm_key<>((bin::integer)::text||'-'||pcn||'-'||group_field))::int failures from rates`,[data.claims.map(r=>r.id)])).rows[0];assert.equal(arithmetic.total,250);assert.equal(arithmetic.failures,0);
 const contentHash=digest(normalize(rows));result.contentSHA256=contentHash;result.counts=Object.fromEntries(Object.entries(rows).map(([k,v])=>[k,v.length]));result.independentArithmetic=arithmetic;result.identityFindings=0;
 if(attacking){await db.query('update public.user_data set owed=owed+0.01 where id=$1',[data.claims[0].id]);const poisoned=digest(normalize(await collect()));assert.notEqual(poisoned,contentHash);result.comparatorAttack='Detected one changed persisted claim value; transaction rolled back';const leak=structuredClone(rows);leak.user_data[0].customer_name='Synthetic Leak Patient';assert.ok(scan(leak).length>0);result.scannerAttack='Detected synthetic patient field';}
 const compare=process.argv.indexOf('--compare');if(compare>=0)assert.equal(contentHash,JSON.parse(readFileSync(process.argv[compare+1])).contentSHA256,'canonical reseed equality');
 result.status='PASS';await db.query('ROLLBACK');writeFileSync(evidencePath(`seed-verify${attacking?'-attacked':''}.json`),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await db.query('ROLLBACK').catch(()=>{});await db.end();}
