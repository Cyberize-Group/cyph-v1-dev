#!/usr/bin/env node
import { generate } from './generate.mjs';
import { pathToFileURL } from 'node:url';
export function scan(value,path='root',findings=[]){
 if(Array.isArray(value))value.forEach((v,i)=>scan(v,`${path}[${i}]`,findings));
 else if(value&&typeof value==='object')for(const [key,v]of Object.entries(value)){
  if(/^(customer_name|first_name|last_name|customer_id|date_of_birth|dob|address|address_line2|phone|fax|mobile_number|diagnosis|member_id|authorization_number|customer_group_number)$/.test(key)&&v!==null&&v!==undefined&&v!=='')findings.push({path:`${path}.${key}`,reason:'patient/contact field populated'});
  if(/^(name|full_name|drug_name|pbm_name|pharmacy_name|dataset_name)$/.test(key)&&typeof v==='string'&&!/^(SYNTHETIC|APBM-SYNTHETIC)/.test(v))findings.push({path:`${path}.${key}`,reason:'name outside synthetic construction'});
  scan(v,`${path}.${key}`,findings);
 }else if(typeof value==='string'){
  if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value)&&!value.endsWith('@example.invalid'))findings.push({path,reason:'non-reserved email'});
  if(/\b\d{3}-\d{2}-\d{4}\b/.test(value))findings.push({path,reason:'SSN-shaped value'});
  if(/(?:\+1[ -]?)?\(\d{3}\)[ -]?\d{3}[ -]?\d{4}/.test(value))findings.push({path,reason:'telephone-shaped value'});
  if(/\b\d{1,5}\s+\w+\s+(Street|Road|Avenue|Lane)\b/i.test(value))findings.push({path,reason:'address-shaped value'});
 }
 return findings;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const findings=scan(generate());console.log(JSON.stringify({findings}));if(findings.length)process.exitCode=1;}
