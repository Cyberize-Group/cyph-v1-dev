#!/usr/bin/env node
// After fenced schema replay only: remove the FOUR named legacy proof identities.
import {loadEnv,assertScratch,evidencePath} from './lib/env.mjs';
import {serviceClient,pgClient} from './lib/db.mjs';
import {writeFileSync} from 'node:fs';
const env=loadEnv();assertScratch(env);const db=await pgClient(env);const svc=serviceClient(env);
try{const n=(await db.query('select count(*)::int n from public.accounts')).rows[0].n;if(n!==0)throw new Error('legacy auth cleanup requires empty replayed account tables');const wanted=new Set(['bim002-ownera@rls.local','bim002-staffa@rls.local','bim002-ownerb@rls.local','bim002-multistore@rls.local']);const users=[];for(let page=1;;page++){const r=await svc.auth.admin.listUsers({page,perPage:100});if(r.error)throw new Error('Auth enumeration failed');users.push(...r.data.users);if(r.data.users.length<100)break;}let removed=0;for(const user of users.filter(u=>wanted.has(u.email))){const r=await svc.auth.admin.deleteUser(user.id);if(r.error)throw new Error('legacy synthetic identity cleanup failed');removed++;}writeFileSync(evidencePath('legacy-cast-cleanup.json'),JSON.stringify({status:'PASS',removed,preservedOthers:true})+'\n');console.log('Legacy synthetic cast cleaned; all other identities preserved');}finally{await db.end();}
