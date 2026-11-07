// Local application process only, with all backend values explicitly pinned to SCRATCH.
import {readFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import dotenv from 'dotenv';
import {validateConfig,assertScratch} from '../../../../../../scripts/rls-harness/lib/env.mjs';
const raw=dotenv.parse(readFileSync('.env.local'));
const config=validateConfig(raw,{prefix:'RLS_REPLICA_',target:'scratch',projectRef:'ihgcsrypblqkwommrkgj'});assertScratch(config);
const mode=process.argv[2];if(!['build','serve'].includes(mode))throw new Error('EXPLICIT_LOCAL_MODE_REQUIRED');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next',...(mode==='build'?['build']:['dev','--hostname','127.0.0.1','--port','3137'])],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_APBM_DATA_MODE:'real',NEXT_PUBLIC_SUPABASE_URL:config.SUPABASE_URL,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:config.PUBLISHABLE_KEY,SUPABASE_SECRET_KEY:config.SECRET_KEY,NEXT_TELEMETRY_DISABLED:'1'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>{process.exitCode=code??1;});
