// Experimental evaluator: confirmed SCRATCH only. Strict DEV checks are unchanged.
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const source=JSON.parse(readFileSync(new URL('../dev-target-reconciliation/catalog.json',import.meta.url)));
export const allowed=source.snapshot.defaultACLs.filter(r=>r.owner==='supabase_admin'&&r.namespace==='public'&&['S','f','r'].includes(r.defaclobjtype));
assert.equal(allowed.length,3);
export function normalize(snapshot,{target,projectRef}){
 assert.equal(target,'scratch','exception evaluation is SCRATCH-only');assert.equal(projectRef,'ihgcsrypblqkwommrkgj','only confirmed disposable target permitted');
 const result=structuredClone(snapshot),seen=[];
 result.defaultACLs=result.defaultACLs.filter(row=>{
  if(row.owner!=='supabase_admin')return true;
  const match=allowed.find(a=>a.owner===row.owner&&a.namespace===row.namespace&&a.defaclobjtype===row.defaclobjtype);
  assert.ok(match,'unapproved managed default ACL');assert.deepEqual(row,match,'managed ACL payload changed');seen.push(row.defaclobjtype);return false;
 });
 assert.ok(seen.length===0||(seen.length===3&&new Set(seen).size===3),'partial or duplicate managed ACL exception rejected');
 return {snapshot:result,excluded:seen.sort(),sha256:createHash('sha256').update(JSON.stringify(result)).digest('hex')};
}
export function compare(actual,expected,context){const a=normalize(actual,context),e=normalize(expected,context);assert.deepEqual(a.snapshot,e.snapshot,'catalog differs outside the three authorized default ACL entries');return {status:'PASS',normalizedSHA256:a.sha256,excludedActualEntries:a.excluded,excludedExpectedEntries:e.excluded};}
