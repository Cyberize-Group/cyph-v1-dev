# T-07 generator review — 2026-11-09T09:33:08+06:00
## imports / file reads in scripts/seed/*.mjs
scripts/seed/identity-scan.mjs:2:import { generate } from './generate.mjs';
scripts/seed/identity-scan.mjs:3:import { pathToFileURL } from 'node:url';
scripts/seed/identity-scan.mjs:18:if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const findings=scan(generate());console.log(JSON.stringify({findings}));if(findings.length)process.exitCode=1;}
scripts/seed/generate.mjs:3:import { createHash } from 'node:crypto';
scripts/seed/generate.mjs:4:import { writeFileSync } from 'node:fs';
scripts/seed/generate.mjs:5:import { pathToFileURL } from 'node:url';
scripts/seed/generate.mjs:14: const provenance=name=>({source_file:'SYNTHETIC-GENERATOR-v1',imported_at:vintage+'T00:00:00Z',dataset_version_id:uid('dataset:'+name)});
scripts/seed/generate.mjs:40:if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){if(!process.argv.includes('--write-mocks'))throw new Error('use --write-mocks');writeFileSync(new URL('../../src/mocks/owedbook.ts',import.meta.url),'// Generated solely by scripts/seed/generate.mjs --write-mocks. Synthetic A1; federal v1 unavailable.\nimport type { OwedBookRow } from "@/types/OwedBook";\nexport const owedBookFixtures: OwedBookRow[] = '+JSON.stringify(fixtures(),null,2)+';\n');console.log('Generated 50 synthetic A1 mock claims');}
scripts/seed/verify.mjs:2:import assert from 'node:assert/strict';
scripts/seed/verify.mjs:3:import {writeFileSync,readFileSync} from 'node:fs';
scripts/seed/verify.mjs:4:import {createHash} from 'node:crypto';
scripts/seed/verify.mjs:5:import {generate,cast,stores,uid} from './generate.mjs';
scripts/seed/verify.mjs:6:import {scan} from './identity-scan.mjs';
scripts/seed/verify.mjs:7:import {loadEnv,assertScratch,evidencePath} from '../rls-harness/lib/env.mjs';
scripts/seed/verify.mjs:8:import {pgClient} from '../rls-harness/lib/db.mjs';
scripts/seed/verify.mjs:35: const compare=process.argv.indexOf('--compare');if(compare>=0)assert.equal(contentHash,JSON.parse(readFileSync(process.argv[compare+1])).contentSHA256,'canonical reseed equality');
scripts/seed/run.mjs:2:import {writeFileSync,existsSync,lstatSync,openSync,closeSync} from 'node:fs';
scripts/seed/run.mjs:3:import {randomBytes} from 'node:crypto';
scripts/seed/run.mjs:4:import {resolve,dirname} from 'node:path';
scripts/seed/run.mjs:5:import {generate,cast,stores,uid} from './generate.mjs';
scripts/seed/run.mjs:6:import {scan} from './identity-scan.mjs';
scripts/seed/run.mjs:7:import {loadEnv,evidencePath} from '../rls-harness/lib/env.mjs';
scripts/seed/run.mjs:8:import {pgClient,serviceClient} from '../rls-harness/lib/db.mjs';
scripts/seed/reset.mjs:3:import {generate,cast,stores,uid} from './generate.mjs';
scripts/seed/reset.mjs:4:import {loadEnv,assertScratch,evidencePath} from '../rls-harness/lib/env.mjs';
scripts/seed/reset.mjs:5:import {pgClient,serviceClient} from '../rls-harness/lib/db.mjs';
scripts/seed/reset.mjs:6:import {writeFileSync} from 'node:fs';
## forbidden references (LEGACY|demo export|.xlsx|.csv|7,427|7427) in scripts/seed/*.mjs
forbidden hits=0
## PRNG / determinism: uid uses sha256 of constant 'APBM003_SYNTHETIC_V1:'+name; no Math.random in generate.mjs: 0 hits; randomBytes used only for per-run passwords in run.mjs: scripts/seed/run.mjs:3:import {randomBytes} from 'node:crypto'; scripts/seed/run.mjs:20: for(const key of cast){const email=`apbm003-${key.toLowerCase()}@example.invalid`;const password=randomBytes(24).toString('base64url');const {data:r,error}=await svc.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:`SYNTHETIC ${key}`}});if(error)throw new Error(`Auth seed ${key}: ${error.code||error.status}`);identities[key]={id:r.user.id,email,password};receipt.createdUsers.push(key);writeFileSync(credentialPath,JSON.stringify({projectRef:env.projectRef,identities},null,2)+'\n',{mode:0o600});} 
## README documents field construction and reset boundary (section grep)
3:The generator constructs every claim from integer indexes and fixed numeric reference inputs. It reads no legacy fixture, export or patien
5:NDCs are artificial `00000000001`–`00000000004`, names start SYNTHETIC, Rx identifiers contain SYNTHETIC/store/index. Patient/contact fi
7:Audited insert plan: accounts 3 + businesses 5 + junctions 8 + subscriptions 3 + dataset versions 4 + AAC 2 + WAC 4 + FUL 1 + PBM 3 + clai
9:Use complete target prefix and APBM evidence flags documented in the APPLY evidence. `run.mjs` requires a fresh private `/tmp` credential 
11:`verify.mjs` reads every seeded column and recomputes all 250 claim calculations independently in SQL. Canonical comparison excludes surr
## negative control: plant a forbidden reference in a scratchpad copy → grep must catch it
planted copy hits=1
