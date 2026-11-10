// Explicit one-off read-only mapping; does not relax the runner's complete-prefix requirement.
import { readFileSync,writeFileSync } from 'node:fs';
import { join } from 'node:path';
import dotenv from 'dotenv';
import pg from 'pg';
import { validateConfig,repoRoot,DEV_REF } from '../../../../../../scripts/rls-harness/lib/env.mjs';
import { inspect } from '../../../../../../scripts/dev-verify.mjs';
const out=join(repoRoot,'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation');
const raw=dotenv.parse(readFileSync(join(repoRoot,'.env.local')));
const result={projectRef:DEV_REF,startedAt:new Date().toISOString(),credentialMapping:{APBM_DEV_DB_URL:'APBM_DEV_DB_POOL',APBM_DEV_SUPABASE_URL:'NEXT_PUBLIC_SUPABASE_URL',APBM_DEV_PUBLISHABLE_KEY:'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',APBM_DEV_SECRET_KEY:'SUPABASE_SECRET_KEY'},declaredEffects:'SQL catalog/ledger SELECTs in read-only transactions; API health GET; no user sessions, RPCs, business reads or database writes'};
const safeError=e=>/^[A-Z0-9_]{2,40}$/.test(e?.code||'')?e.code:'READ_ONLY_CHECK_FAILED';
try{
 const mapped=Object.fromEntries(Object.entries(result.credentialMapping).map(([dest,src])=>[dest,raw[src]]));
 const env=validateConfig(mapped,{prefix:'APBM_DEV_',target:'dev',projectRef:DEV_REF});
 const catalog=await inspect(env);
 writeFileSync(join(out,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
 result.sql='PASS';result.catalogSHA256=catalog.sha256;result.transactionReadOnly=catalog.transactionReadOnly;
 const client=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000,query_timeout:15000,options:'-c default_transaction_read_only=on'});
 try{await client.connect();await client.query('BEGIN READ ONLY');
  const present=(await client.query("select to_regclass('apbm_migrations.ledger') is not null apbm_ledger, to_regclass('supabase_migrations.schema_migrations') is not null supabase_ledger")).rows[0];
  const native=present.supabase_ledger?(await client.query('select version from supabase_migrations.schema_migrations order by version')).rows:[];
  await client.query('ROLLBACK');result.ledgerPresence=present;result.nativeMigrationVersions=native.map(r=>r.version);
 }finally{await client.end();}
 try{const response=await fetch(env.SUPABASE_URL+'/auth/v1/health',{headers:{apikey:env.PUBLISHABLE_KEY},redirect:'error',signal:AbortSignal.timeout(15000)});result.api=response.ok?'PASS':'BLOCKED';result.apiHttpStatus=response.status;await response.body?.cancel();}catch(e){result.api='BLOCKED';result.apiError=safeError(e);}
 result.connectivity=result.api==='PASS'?'PASS':'BLOCKED';
}catch(e){result.connectivity='BLOCKED';result.error=safeError(e);}
result.finishedAt=new Date().toISOString();writeFileSync(join(out,'preflight.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
