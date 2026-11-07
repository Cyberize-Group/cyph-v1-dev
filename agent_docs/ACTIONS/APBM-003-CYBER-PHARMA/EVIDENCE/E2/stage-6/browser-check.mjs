import {readFileSync,writeFileSync} from 'node:fs';
import {chromium,expect} from '@playwright/test';
import pg from 'pg';import dotenv from 'dotenv';
import {validateConfig,assertScratch} from '../../../../../../scripts/rls-harness/lib/env.mjs';
const raw=dotenv.parse(readFileSync('.env.local'));
const env=validateConfig(raw,{prefix:'RLS_REPLICA_',target:'scratch',projectRef:'ihgcsrypblqkwommrkgj'});assertScratch(env);
const cast=JSON.parse(readFileSync('/tmp/apbm003-final-cast-1793893419.json'));
if(cast.projectRef!==env.projectRef)throw new Error('CAST_TARGET_MISMATCH');
const db=new pg.Client({connectionString:env.DB_URL,connectionTimeoutMillis:10000,options:'-c default_transaction_read_only=on'});
const result={startedAt:new Date().toISOString(),projectRef:env.projectRef,mode:'real',server:'127.0.0.1:3137 development build',status:'RUNNING',checks:[],failures:[],sessions:0,unexpectedBackendRequests:0};
let browser,step='connect';
const pass=name=>result.checks.push(name);
try{
 await db.connect();const before=Number((await db.query('select count(*) n from public.audit_logs')).rows[0].n);
 const stores=Object.fromEntries((await db.query('select id,pharmacy_name from public.businesses')).rows.map(s=>[s.pharmacy_name.replace('SYNTHETIC STORE ',''),s.id]));
 browser=await chromium.launch({headless:true});
 for(const [who,names,admin] of [['OWNER3',['B1','B2','B3'],true],['ADMIN_B2',['B2'],true],['MEMBER_B1',['B1'],false],['UNRELATED',['C1'],true]]){
  const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();page.setDefaultTimeout(30000);
  await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname.endsWith('.supabase.co')&&u.hostname!==new URL(env.SUPABASE_URL).hostname){result.unexpectedBackendRequests++;await route.abort();}else await route.continue();});
  let signed=false;
  try{
   step=who+' browser login';await page.goto('http://127.0.0.1:3137/auth');
   await page.getByLabel('Email',{exact:true}).fill(cast.identities[who].email);await page.getByLabel('Password',{exact:true}).fill(cast.identities[who].password);
   await page.getByRole('button',{name:'Login',exact:true}).click();
   await page.waitForURL('**/owedbook');signed=true;result.sessions++;
   step=who+' store scope';const selector=page.getByRole('combobox',{name:'Store',exact:true});await expect(selector).toBeEnabled();
   await expect(selector.locator('option:not([disabled])')).toHaveText(names.map(n=>'SYNTHETIC STORE '+n));pass(who+' exact store picker scope');
   for(const name of names){
    step=who+' '+name+' scoped rows';await selector.selectOption(stores[name]);await expect(page.getByText('Limit 25 · Total 50',{exact:true})).toBeVisible();pass(who+' '+name+' 50 claims');
   }
   if(who==='OWNER3'){
    step='OWNER3 pagination';await page.getByRole('button',{name:'Next',exact:true}).click();await expect(page.getByText('Page 2 of 2')).toBeVisible();pass(step);
    step='OWNER3 switch resets pager';await selector.selectOption(stores.B2);await expect(page.getByText('Page 1 of 2')).toBeVisible();pass(step);
    step='OWNER3 summary';await page.getByRole('tab',{name:'Summary',exact:true}).click();await expect(page.getByTestId('summary-unattributed-note')).toBeVisible();pass(step);
    step='OWNER3 federal unavailable';await page.getByRole('tab',{name:'Federal Dollars'}).click();await expect(page.getByText('Federal reimbursement data is unavailable in this release.')).toBeVisible();await expect(page.getByText('No results',{exact:true})).toBeVisible();pass(step);
    await page.getByRole('tab',{name:'Commercial Dollars',exact:true}).click();await expect(page.getByText('Limit 25 · Total 50',{exact:true})).toBeVisible();
    step='OWNER3 forged foreign store rejected in UI';
    await page.route('**/rest/v1/rpc/owedbook_rows',async route=>{const body=route.request().postDataJSON();await route.continue({postData:JSON.stringify({...body,p_business_id:stores.A1})});});
    await page.getByRole('button',{name:'Get Fresh Data',exact:true}).click();await expect(page.getByText('not a member of business',{exact:true})).toBeVisible();pass(step);
    await page.unroute('**/rest/v1/rpc/owedbook_rows');await page.getByRole('button',{name:'Retry',exact:true}).click();await expect(page.getByText('Limit 25 · Total 50',{exact:true})).toBeVisible();
    step='OWNER3 upload disabled';await expect(page.getByRole('button',{name:'Upload Data',exact:true})).toBeDisabled();pass(step);
   }
   step=who+' admin route';await page.goto('http://127.0.0.1:3137/admin-portal');
   if(!admin){await page.waitForURL('**/owedbook');pass(who+' admin route denied');}
   else{
    await expect(page.getByRole('heading',{name:'My Stores',exact:true})).toBeVisible();
    for(const name of names)await expect(page.getByRole('heading',{name:'SYNTHETIC STORE '+name,exact:true})).toBeVisible();pass(who+' scoped admin stores');
    step=who+' member roster';await page.goto('http://127.0.0.1:3137/admin-portal/stores/'+stores[names.at(-1)]);await expect(page.getByRole('heading',{name:'SYNTHETIC STORE '+names.at(-1),exact:true})).toBeVisible();await expect(page.getByText(/Members ·/)).toBeVisible();pass(step);
    step=who+' read-only billing';await page.goto('http://127.0.0.1:3137/admin-portal/billing');await expect(page.getByText(/Price unavailable/).first()).toBeVisible();await expect(page.getByRole('button',{name:'Manage payment',exact:true}).first()).toBeDisabled();await expect(page.getByRole('button',{name:'Add store',exact:true})).toBeDisabled();pass(step);
    step=who+' audited viewer';await page.goto('http://127.0.0.1:3137/admin-portal/audit');await expect(page.getByRole('heading',{name:'Audit log'})).toBeVisible();await expect(page.getByTestId('audit-skeleton')).toHaveCount(0);await expect(page.getByText('Viewed data',{exact:true}).first()).toBeVisible();pass(step);
   }
   if(who==='OWNER3'){
    step='OWNER3 phone scope';await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:3137/owedbook');await expect(page.getByRole('combobox',{name:'Store',exact:true})).toBeEnabled();await expect(page.getByText('Limit 25 · Total 50',{exact:true})).toBeVisible();pass(step);
   }
  }catch(e){result.failures.push({step,error:e.name||'BROWSER_ASSERTION_FAILED',path:new URL(page.url()).pathname});}
  finally{if(signed){const response=await context.request.post('http://127.0.0.1:3137/api/auth/logout');if(!response.ok())result.failures.push({step:who+' logout',status:response.status()});}await context.close();}
 }
 const after=Number((await db.query('select count(*) n from public.audit_logs')).rows[0].n);result.auditDelta=after-before;
 result.auditFunctions=(await db.query("select context->>'fn' fn,count(*)::int count from public.audit_logs where occurred_at >= $1::timestamptz and action='read_page' group by 1 order by 1",[result.startedAt])).rows;
 result.status=result.failures.length||result.unexpectedBackendRequests?'BLOCKED':'PASS';
}catch(e){result.status='BLOCKED';result.failures.push({step,error:e.name||'BROWSER_RUN_FAILED'});}
finally{await browser?.close();await db.end().catch(()=>{});result.finishedAt=new Date().toISOString();writeFileSync(new URL('./browser-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}
