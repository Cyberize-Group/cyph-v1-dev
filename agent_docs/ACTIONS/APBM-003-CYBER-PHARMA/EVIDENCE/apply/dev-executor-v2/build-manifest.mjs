// Local packaging only; no database or Git mutation.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {resolve,join,relative} from 'node:path';
import {repoRoot} from '../../../../../../scripts/rls-harness/lib/env.mjs';import * as v from './common.mjs';
for(const n of [47,51,52])writeFileSync(join(v.dir,'EXPECTED_'+n+'.json'),JSON.stringify(v.materialize(n),null,2)+'\n');
const paths=new Set(Object.keys(v.read(resolve(v.dir,'../../E2/SOURCE_HASHES.json'))));
for(const p of Object.keys(v.read(resolve(v.dir,'../dev-baseline-bootstrap/PLAN_MANIFEST.json')).inputs))paths.add(p);
const local=['common.mjs','executor.mjs','tests.mjs','build-manifest.mjs','DEV_APPLICATION_BOOTSTRAP.sql','RULING.md','EXPECTED_47.json','EXPECTED_51.json','EXPECTED_52.json','RUN_DEV_APPLY.sh','RECOVERY.sh','../dev-baseline-bootstrap/checks.mjs','../dev-baseline-bootstrap/PLAN_MANIFEST.json','../dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql','../dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json','../dev-restored-rehearsal/SNAPSHOT_BACKUP.json','../dev-bootstrap-execution/owner-check.mjs','../../E2/SOURCE_HASHES.json','../../E2/stage-5/audit-final/migration-inventory.json','../../E2/stage-5/recovery/baseline.json','../../E2/stage-5/recovery/partial.json','../../E2/stage-5/recovery/complete.json','../../E2/stage-5/recovery/recovery-rehearsal.json','../../E2/stage-5/reseed/seed-verify.json'];
for(const p of local)paths.add(relative(repoRoot,resolve(v.dir,p)));
for(const p of ['RESULT.json','SCRATCH_APPLICATION_BOOTSTRAP.sql','owner-proof.json','authenticated-reads.json','seed-verify.json','preservation-after-seed.json','preservation-after-probes.json'])paths.add(relative(repoRoot,join(v.narrow,p)));
if(existsSync(join(v.dir,'DIRECTOR_SIGNUP_WAIVER.json')))paths.add(relative(repoRoot,join(v.dir,'DIRECTOR_SIGNUP_WAIVER.json')));
for(const p of ['package-lock.json','scripts/rls-harness/lib/db.mjs'])if(existsSync(join(repoRoot,p)))paths.add(p);
const hashes=Object.fromEntries([...paths].sort().map(p=>[p,v.sha(readFileSync(join(repoRoot,p)))]));writeFileSync(join(v.dir,'BUNDLE_INPUTS.json'),JSON.stringify(hashes,null,2)+'\n');
writeFileSync(join(v.dir,'GIT_INPUT_PATHS.txt'),[...Object.keys(hashes),relative(repoRoot,join(v.dir,'BUNDLE_INPUTS.json'))].sort().join('\n')+'\n');
console.log('Pinned '+paths.size+' reviewed inputs; bundle SHA-256 '+v.sha(readFileSync(join(v.dir,'BUNDLE_INPUTS.json'))));
