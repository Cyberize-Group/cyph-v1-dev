#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {loadEnv,assertScratch,evidencePath} from './lib/env.mjs';
import {inspect} from '../dev-verify.mjs';
const env=loadEnv();assertScratch(env);const result=await inspect(env),s=result.snapshot;
assert.equal(s.tables.filter(t=>['r','p'].includes(t.relkind)).length,17);
assert.equal(s.policies.length,15);assert.equal(s.functions.length,19);
assert.ok(s.tables.filter(t=>['r','p'].includes(t.relkind)).every(t=>t.relrowsecurity));
assert.equal(s.triggers.filter(t=>t.definition.includes('audit_write()')).length,14);
assert.ok(!s.policies.some(p=>['user_data','audit_logs'].includes(p.tablename)));
const required=['is_owner_of_account','tenant_stores','admin_stores','admin_members','admin_audit','admin_billing_status','owedbook_kpis','owedbook_rows','owedbook_summary','owedbook_pbm_options'];
for(const name of required){const f=s.functions.find(f=>f.proname===name);assert.ok(f,`${name} exists`);assert.equal(f.owner,'postgres');assert.match(f.definition,/SECURITY DEFINER/);assert.match(f.definition,/SET search_path TO ''/);assert.ok(!/(^|\{|,)anon=X|(^|\{|,)=X\//.test(f.proacl||''),`${name} no anon/PUBLIC execute`);}
const trigger=s.functions.find(f=>f.proname==='handle_new_user');assert.equal(trigger.definition.split('$function$')[1].trim(),readFileSync('supabase/migrations/0049_signup_member.sql','utf8').split('$$')[1].trim());
writeFileSync(evidencePath('catalog-approved.json'),JSON.stringify({...result,status:'PASS',expected:{publicTables:17,policies:15,functions:19,auditStampTriggers:14},requiredRPCs:required},null,2)+'\n');console.log('Catalog PASS: 17 public tables, 15 policies, 19 functions, 14 write-audit stamps; RPC owners/search paths/grants verified');
