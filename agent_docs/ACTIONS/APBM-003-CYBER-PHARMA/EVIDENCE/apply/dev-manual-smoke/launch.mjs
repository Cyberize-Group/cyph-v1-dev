// Local Dev v1 frontend only. No database CLI, seed, migration or authenticated probe.
import fs from 'node:fs';import {spawn} from 'node:child_process';import dotenv from 'dotenv';import assert from 'node:assert/strict';
import {validateConfig} from '../../../../../../scripts/rls-harness/lib/env.mjs';
const raw=dotenv.parse(fs.readFileSync('.env.local'));const config=validateConfig(raw,{prefix:'APBM_DEV_',target:'dev',projectRef:'yrsuwikjnbmvpznrgydb'});
const mode=process.argv[2];assert.ok(['build','serve'].includes(mode));
const record=new URL('./BUILD.json',import.meta.url);
if(mode==='serve'){const r=JSON.parse(fs.readFileSync(record));assert.equal(r.projectRef,config.projectRef);assert.equal(r.mode,'real');assert.equal(r.buildId,fs.readFileSync('.next/BUILD_ID','utf8').trim());}
if(mode==='serve'){fs.cpSync('.next/static','.next/standalone/.next/static',{recursive:true});if(fs.existsSync('public'))fs.cpSync('public','.next/standalone/public',{recursive:true});}
const child=spawn(process.execPath,mode==='build'?['node_modules/next/dist/bin/next','build']:['.next/standalone/server.js'],{stdio:'inherit',env:{...process.env,HOSTNAME:'127.0.0.1',PORT:'3137',NEXT_PUBLIC_APBM_DATA_MODE:'real',NEXT_PUBLIC_SUPABASE_URL:config.SUPABASE_URL,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:config.PUBLISHABLE_KEY,SUPABASE_SECRET_KEY:config.SECRET_KEY,NEXT_PUBLIC_SITE_URL:'http://localhost:3137',NEXT_TELEMETRY_DISABLED:'1'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>{if(mode==='build'&&code===0)fs.writeFileSync(record,JSON.stringify({status:'PASS',projectRef:config.projectRef,mode:'real',buildId:fs.readFileSync('.next/BUILD_ID','utf8').trim(),builtAt:new Date().toISOString()},null,2)+'\n');process.exitCode=code??1;});
