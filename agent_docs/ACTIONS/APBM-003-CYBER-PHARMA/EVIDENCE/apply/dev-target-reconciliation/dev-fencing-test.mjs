// Synthetic config only: no network calls or database operations.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {validateConfig,assertScratch,DEV_REF,SCRATCH_REF} from '../../../../../../scripts/rls-harness/lib/env.mjs';
const pilot='cwdzijswchlwfvxxrlzb',options={prefix:'APBM_DEV_',target:'dev',projectRef:DEV_REF};
const config=ref=>({APBM_DEV_DB_URL:`postgres://postgres.${ref}:synthetic@aws-1-us-east-1.pooler.supabase.com:5432/postgres`,APBM_DEV_SUPABASE_URL:`https://${ref}.supabase.co`,APBM_DEV_PUBLISHABLE_KEY:'sb_publishable_synthetic',APBM_DEV_SECRET_KEY:'sb_secret_synthetic'});
const checks=[];const test=(name,fn)=>{fn();checks.push({name,status:'PASS'});};
test('confirmed DEV accepted',()=>assert.equal(validateConfig(config(DEV_REF),options).projectRef,DEV_REF));
for(const ref of[pilot,SCRATCH_REF]){
 test(`${ref} declared as DEV rejected`,()=>assert.throws(()=>validateConfig(config(ref),{...options,projectRef:ref}),/Director-approved/));
 test(`${ref} credentials with DEV declaration rejected`,()=>assert.throws(()=>validateConfig(config(ref),options),/identity mismatch/));
 for(const key of['APBM_DEV_DB_URL','APBM_DEV_SUPABASE_URL'])test(`${ref} mismatched ${key} rejected`,()=>assert.throws(()=>validateConfig({...config(DEV_REF),[key]:config(ref)[key]},options),/identity mismatch/));
}
for(const name of Object.keys(config(DEV_REF)))test(`DEV missing ${name} rejected`,()=>{const c=config(DEV_REF);delete c[name];assert.throws(()=>validateConfig(c,options),/missing/);});
test('DEV destructive SCRATCH guard rejected',()=>assert.throws(()=>assertScratch(validateConfig(config(DEV_REF),options)),/confirmed SCRATCH/));
writeFileSync(new URL('./dev-fencing-results.json',import.meta.url),JSON.stringify({status:'PASS',checks},null,2)+'\n');console.log(`${checks.length} DEV target checks PASS`);
