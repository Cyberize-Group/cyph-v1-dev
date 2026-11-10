#!/usr/bin/env node
// All values constructed here; no patient/legacy input is read.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export const cast=['OWNER1','OWNER3','ADMIN_B2','ADMIN_B3','MEMBER_B1','MEMBER_B2B3','UNRELATED'];
export const stores=['A1','B1','B2','B3','C1'];
export const vintage='2026-01-01';
export const uid = name => {const h=createHash('sha256').update('APBM003_SYNTHETIC_V1:'+name).digest('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;};
export const round=(value,places=2)=>Number(value.toFixed(places));
export const pbmKey=(bin,pcn,group)=>`${String(Number(bin))}-${pcn}-${group}`;
export function generate(){
 const datasets=['aac','wac','ful','pbm_info'].map(name=>({id:uid('dataset:'+name),dataset_name:'APBM-SYNTHETIC-'+name,checksum:'constructed-v1',row_count:{aac:2,wac:4,ful:1,pbm_info:3}[name],latest_upload_at:vintage+'T00:00:00Z'}));
 const provenance=name=>({source_file:'SYNTHETIC-GENERATOR-v1',imported_at:vintage+'T00:00:00Z',dataset_version_id:uid('dataset:'+name)});
 const ndcs=['00000000001','00000000002','00000000003','00000000004'];
 const aac=[0.123456,0.654321].map((value,i)=>({id:uid('aac:'+i),ndc:ndcs[i],aac_date:vintage,aac:value,drug_name:`SYNTHETIC DRUG ${i+1}`,...provenance('aac')}));
 const wac=[15,40,70,120].map((value,i)=>({id:uid('wac:'+i),ndc:ndcs[i],effective_date:vintage,wac:value,pkg_size:100,pkg_size_mult:1,generic_indicator:i===3?'B':'G',drug_name:`SYNTHETIC DRUG ${i+1}`,...provenance('wac')}));
 const ful=[{id:uid('ful:2'),ndc:ndcs[2],year:2026,month:1,aca_ful:0.5,drug_name:'SYNTHETIC DRUG 3',...provenance('ful')}];
 const pbms=[0,1,2].map(i=>({id:uid('pbm:'+i),bin:`00414${i+6}`,pcn:'SYNTH',pbm_name:`SYNTHETIC PBM ${i+1}`,state:'AL',email:`pbm${i+1}@example.invalid`,pbm_key:pbmKey(`00414${i+6}`,'SYNTH','SYNTHETIC'),matching_type:'bin_pcn_group',...provenance('pbm_info')}));
 const claims=stores.flatMap(store=>Array.from({length:50},(_,i)=>{
  const d=i%4;const isBrand=wac[d].generic_indicator==='B';const a=aac.find(a=>a.ndc===ndcs[d]);let rate=round(a?.aac??(wac[d].wac/(wac[d].pkg_size*wac[d].pkg_size_mult)*(isBrand?0.96:1)),5);let method=a?'AAC':isBrand?'BWAC':'GWAC';const ceiling=ful.find(f=>f.ndc===ndcs[d]);if(!a&&!isBrand&&ceiling&&rate>ceiling.aca_ful){rate=round(ceiling.aca_ful,5);method='FUL';}
  const qty=[10,30,60,90,15][i%5];const expected=round(qty*rate+10.64);const owed=i%3===0?-2.5:round(1+(i%11)*0.37);const paid=round(expected-owed);const pbm=i%4===3?null:pbms[i%4];const newPaid=i%3===1?round(paid+0.5):null;
  return {id:uid(`claim:${store}:${i}`),business_id:uid('store:'+store),date_dispensed:`2026-06-${String(i%28+1).padStart(2,'0')}`,script:`SYNTHETIC-${store}-${String(i+1).padStart(3,'0')}`,drug_name:`SYNTHETIC DRUG ${d+1}`,drug_ndc:ndcs[d],qty,insurance:pbm?.pbm_name??null,source_file:'SYNTHETIC-GENERATOR-v1',status:['new','underpaid','pending','emailed_pbm','recovered'][i%5],bin:pbm?.bin??'009999',pcn:'SYNTH',group_field:'SYNTHETIC',pbm_key:pbmKey(pbm?.bin??'009999','SYNTH','SYNTHETIC'),medicaid_rate:rate,total_paid:paid,expected_paid:expected,owed,new_paid:newPaid,difference:newPaid===null?null:round(newPaid-paid),medicaid_method:method,aac_date_used:a?vintage:null,wac_date_used:a?null:vintage,ful_year_used:method==='FUL'?2026:null,ful_month_used:method==='FUL'?1:null,rate_source:`SYNTHETIC-${method}-2026-01`,medicaid_rate_calculated_at:vintage+'T00:00:00Z'};
 }));
 const config=[['dispensing_fee',10.64],['brand_multiplier',0.96]].map(([key,value])=>({id:uid('config:'+key),key,value,state:'AL',effective_date:vintage}));
 const result={datasets,aac,wac,ful,pbms,claims,config};validateGenerated(result);return result;
}
export function validateGenerated(data){
 if(data.claims.length!==250)throw new Error('synthetic claim count');
 for(const row of data.claims){
  if(round(row.qty*row.medicaid_rate+10.64)!==row.expected_paid||round(row.expected_paid-row.total_paid)!==row.owed)throw new Error('synthetic money rule');
  if(row.pbm_key!==pbmKey(row.bin,row.pcn,row.group_field))throw new Error('synthetic PBM key');
  if(!['AAC','FUL','GWAC','BWAC','Take Action','Manual Override'].includes(row.medicaid_method))throw new Error('synthetic method vocabulary');
  if(row.medicaid_rate!==round(row.medicaid_rate,5))throw new Error('synthetic rate precision');
 }
 for(const store of stores){const rows=data.claims.filter(r=>r.business_id===uid('store:'+store));if(rows.length!==50||!rows.some(r=>r.owed<0)||!rows.some(r=>r.owed>0)||new Set(rows.map(r=>r.status)).size!==5)throw new Error('synthetic coverage');}
 return true;
}
export function fixtures(){return generate().claims.filter(r=>r.business_id===uid('store:A1')).map(r=>({id:r.id,date:r.date_dispensed,script:r.script,qty:r.qty,pbm:r.insurance,status:r.status,report_file:null,original_paid:r.total_paid,medicaid_rate:r.medicaid_rate,method:r.medicaid_method,expected:r.expected_paid,owed:r.owed,new_paid:r.new_paid,updated_difference:r.difference,aac:null,federal_expected:null,federal_diff:null}));}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){if(!process.argv.includes('--write-mocks'))throw new Error('use --write-mocks');writeFileSync(new URL('../../src/mocks/owedbook.ts',import.meta.url),'// Generated solely by scripts/seed/generate.mjs --write-mocks. Synthetic A1; federal v1 unavailable.\nimport type { OwedBookRow } from "@/types/OwedBook";\nexport const owedBookFixtures: OwedBookRow[] = '+JSON.stringify(fixtures(),null,2)+';\n');console.log('Generated 50 synthetic A1 mock claims');}
