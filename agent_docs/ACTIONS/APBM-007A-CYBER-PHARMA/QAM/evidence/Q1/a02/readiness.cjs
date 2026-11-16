const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const ob='/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev',pp='/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1',out=__dirname;
const dotenv=require(ob+'/node_modules/dotenv'),{Client}=require(ob+'/node_modules/pg');
const raw=dotenv.parse(fs.readFileSync(ob+'/.env.local'));
function save(n,v){fs.writeFileSync(path.join(out,n),JSON.stringify(v,null,2))}
(async()=>{
const reports={};
for(const [target,ref] of [['DEV','yrsuwikjnbmvpznrgydb'],['SCRATCH','ihgcsrypblqkwommrkgj']]){
 const url=raw['APBM_'+target+'_DB_URL'],api=raw['APBM_'+target+'_SUPABASE_URL'];let c;
 try{
  const u=new URL(url); const sqlref=u.hostname.match(/^db\.([a-z0-9]{20})\.supabase\.co$/)?.[1]||decodeURIComponent(u.username).split('.')[1];
  if(sqlref!==ref||new URL(api).hostname!==ref+'.supabase.co')throw Object.assign(new Error(),{code:'IDENTITY_MISMATCH'});
  c=new Client({connectionString:url,connectionTimeoutMillis:10000,query_timeout:15000});await c.connect();
  await c.query('BEGIN READ ONLY');
  const id=(await c.query("SELECT current_database() AS database, current_setting('transaction_read_only') AS read_only")).rows[0];
  const ledger=(await c.query('SELECT name,sha256 FROM apbm_migrations.ledger ORDER BY name')).rows;
  const dir=ob+'/supabase/migrations';const files=fs.readdirSync(dir).filter(n=>/^\d{4}_.+\.sql$/.test(n)).sort().map(name=>({name,sha256:crypto.createHash('sha256').update(fs.readFileSync(dir+'/'+name)).digest('hex')}));
  await c.query('ROLLBACK');reports[target]={configured_project:ref,identity:id,ledger_count:ledger.length,candidate_migration_count:files.length,exact_match:JSON.stringify(ledger)===JSON.stringify(files),ledger,transaction_count:1,limitation:'SQL/API endpoint project binding plus database identity; no provider-admin identity probe'};
 }catch(e){reports[target]={status:'BLOCKED',code:/^[A-Z0-9_]+$/.test(e.code||'')?e.code:'CONNECTION_OR_CONFIG_ERROR'};}finally{if(c)await c.end().catch(()=>{});}
}
save('database.json',reports);
const checks=[];for(const root of [ob,pp])for(const file of ['.env.local','.env.qa.local']){
 const full=root+'/'+file;const exists=fs.existsSync(full);let keys=[];if(exists)keys=Object.keys(dotenv.parse(fs.readFileSync(full)));
 checks.push({repository:path.basename(root),file,exists,ignored:cp.spawnSync('git',['-C',root,'check-ignore','-q',file]).status===0,tracked:cp.spawnSync('git',['-C',root,'ls-files','--error-unmatch',file],{stdio:'pipe'}).status===0,required_tooling_fields_present:exists&&['DEV','SCRATCH'].every(t=>['DB_URL','SUPABASE_URL','PUBLISHABLE_KEY','SECRET_KEY'].every(k=>keys.includes('APBM_'+t+'_'+k)))});
}
const inbox='/home/moose/.config/cyph/apbm007a-test-inboxes.env';if(fs.existsSync(inbox)){const x=dotenv.parse(fs.readFileSync(inbox));checks.push({file:'private operator inbox file outside repos',owner_only:(fs.statSync(inbox).mode&0o077)===0,schema_four_roles:['OWNER_1','OWNER_2','STORE_ADMIN','MEMBER'].every(k=>typeof x[k]==='string'&&/^[^@\s]+@[^@\s]+$/.test(x[k])),distinct:new Set(Object.values(x)).size===Object.values(x).length,git_ignore:'not applicable: outside repository',untracked:true,new_owner_inbox:'pending private Director input; existing role inboxes not substituted'});}
save('credential_schema.json',checks);
const {chromium,firefox,webkit}=require(pp+'/node_modules/playwright');const browsers={};
for(const [name,engine]of Object.entries({chromium,firefox,webkit})){let b;try{b=await engine.launch({headless:true});const p=await b.newPage();await p.route('**/*',r=>r.abort());await p.setContent('<button onclick="this.textContent=\'checked\'">check</button>');await p.getByRole('button').click();browsers[name]={available:true,basic_interaction:await p.getByRole('button').innerText()==='checked',target:'in-memory page, all routes aborted'};}catch(e){browsers[name]={available:false,status:'GAP',reason:String(e.message).split('\n')[0].replace(/\/home\/[^ ]+/g,'[local path]')};}finally{if(b)await b.close();}}
save('browsers.json',browsers);
})().catch(()=>{save('helper_error.json',{status:'BLOCKED',reason:'readiness helper dependency or runtime failure; no values exported'});process.exitCode=1});
