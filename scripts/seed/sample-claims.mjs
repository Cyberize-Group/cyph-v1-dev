#!/usr/bin/env node
// APBM007A D-04 / FA-8 — operator-only DEV sample claims for ONE named synthetic test store.
//
//   node scripts/seed/sample-claims.mjs --store-id <store UUID> --dataset apbm007a_sample_v1 --dry-run
//   node scripts/seed/sample-claims.mjs --store-id <store UUID> --dataset apbm007a_sample_v1
//
// Environment (in addition to the usual RLS_HARNESS_PREFIX / APBM_TARGET / APBM_PROJECT_REF / APBM_EVIDENCE_DIR):
//   APBM_SAMPLE_STORE_ALLOWLIST   comma-separated store UUIDs the operator has verified as synthetic test stores
//   APBM_SAMPLE_LOAD=<project ref> explicit operator confirmation, required for a write
//   APBM_SAMPLE_REHEARSAL=<SCRATCH ref>  only to rehearse the command on SCRATCH; without it the command is DEV-only
//   APBM_TEST_INBOX_FILE          optional path of the private test-inbox file (default ~/.config/cyph/apbm007a-test-inboxes.env)
//
// It never runs from sign-up, payment, provisioning, an email callback or the customer UI. It inserts only its own
// 50 deterministic rows for the named store, through the audited service path; it never deletes, resets or imports
// a file, and it never touches another store, an owner or a subscription. Customer onboarding stays empty.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { generate, stores as fixtureStores, uid } from './generate.mjs';
import { DEV_REF, SCRATCH_REF, evidencePath, loadEnv } from '../rls-harness/lib/env.mjs';
import { pgClient } from '../rls-harness/lib/db.mjs';

export const DATASET = 'apbm007a_sample_v1';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const stop = (m) => { throw new Error(`REFUSED: ${m}`); };
const arg = (n) => { const i = process.argv.indexOf(n); return i < 0 ? undefined : process.argv[i + 1]; };
const rowId = (store, i) => { const h = createHash('sha256').update(`${DATASET}:${store}:${i}`).digest('hex'); return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`; };

/** The fixed reviewed dataset: the generator's 50 single-store claims, re-keyed and re-labelled for the named store. */
export function sampleRows(storeId) {
  const template = generate().claims.filter((r) => r.business_id === uid('store:A1'));
  if (template.length !== 50) stop('dataset template changed');
  return template.map((r, i) => ({ ...r, id: rowId(storeId, i), business_id: storeId, script: `SAMPLE-APBM007A-${String(i + 1).padStart(3, '0')}`, source_file: 'APBM007A-SAMPLE-v1' }));
}

async function main() {
  const storeId = (arg('--store-id') || '').toLowerCase(), dataset = arg('--dataset'), dryRun = process.argv.includes('--dry-run');
  if (!UUID.test(storeId)) stop('--store-id <internal store UUID> is required; an NPI or a name is not accepted');
  if (dataset !== DATASET) stop(`--dataset must be ${DATASET}`);
  const env = loadEnv();
  const rehearsal = env.target === 'scratch' && env.projectRef === SCRATCH_REF && process.env.APBM_SAMPLE_REHEARSAL === SCRATCH_REF;
  if (!(env.target === 'dev' && env.projectRef === DEV_REF) && !rehearsal) stop('this command runs only against the identified DEV project');
  const allowlist = (process.env.APBM_SAMPLE_STORE_ALLOWLIST || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!allowlist.includes(storeId)) stop('the store is not on the operator-verified synthetic test-store allowlist');
  if (fixtureStores.some((s) => uid('store:' + s) === storeId)) stop('the APBM003 fixture stores already hold the 250-claim baseline and are not sample targets');
  if (!dryRun && process.env.APBM_SAMPLE_LOAD !== env.projectRef) stop('explicit operator confirmation APBM_SAMPLE_LOAD=<project ref> is required to write');

  // Synthetic classification: the owner's address is a reserved example.invalid address or one of the approved test inboxes.
  const inboxFile = process.env.APBM_TEST_INBOX_FILE || join(homedir(), '.config/cyph/apbm007a-test-inboxes.env');
  const testInboxes = existsSync(inboxFile) ? readFileSync(inboxFile, 'utf8').split(/\r?\n/).map((l) => l.match(/^\s*[A-Z0-9_]+\s*=\s*(.+)$/)?.[1]?.trim().replace(/^['"]|['"]$/g, '').toLowerCase()).filter(Boolean) : [];
  const rows = sampleRows(storeId), ids = rows.map((r) => r.id);
  const db = await pgClient(env);
  const receipt = { projectRef: env.projectRef, command: 'sample-claims', dataset: DATASET, storeId, dryRun, status: 'RUNNING' };
  try {
    const store = (await db.query(`select b.id, b.pharmacy_name, b.status, b.account_id, lower(u.email) owner_email,
        (select count(*)::int from public.checkout_operations o where o.business_id = b.id and o.status = 'provisioned') provisioned_ops,
        (select count(*)::int from public.businesses x where x.account_id = b.account_id) account_stores
      from public.businesses b join public.accounts a on a.id = b.account_id join auth.users u on u.id = a.owner_user_id where b.id = $1`, [storeId])).rows[0];
    if (!store) stop('store not found on this target');
    if (store.status !== 'active') stop('store is not active');
    if (store.provisioned_ops !== 1) stop('store was not created by one 007A paid registration; it is not a classified test store');
    if (!(store.owner_email.endsWith('@example.invalid') || testInboxes.includes(store.owner_email))) stop('the store owner is not an approved synthetic or test identity');
    const present = (await db.query('select count(*)::int n from public.user_data where id = any($1::uuid[]) and business_id = $2', [ids, storeId])).rows[0].n;
    const elsewhere = (await db.query('select count(*)::int n from public.user_data where id = any($1::uuid[]) and business_id <> $2', [ids, storeId])).rows[0].n;
    const foreign = (await db.query('select count(*)::int n from public.user_data where business_id = $1 and not (id = any($2::uuid[]))', [storeId, ids])).rows[0].n;
    if (elsewhere) stop('dataset rows exist under another store; store/dataset mismatch');
    if (foreign) stop('the store already holds claims that are not this dataset; nothing is added to an unclassified store');
    Object.assign(receipt, { storeName: store.pharmacy_name, datasetRows: rows.length, alreadyPresent: present, toInsert: rows.length - present });
    if (dryRun) { receipt.status = 'DRY_RUN'; console.log(JSON.stringify({ target: env.target, storeId, storeName: store.pharmacy_name, dataset: DATASET, datasetRows: rows.length, alreadyPresent: present, wouldInsert: rows.length - present })); return; }
    if (present === rows.length) { receipt.status = 'ALREADY_LOADED'; console.log(`Sample ${DATASET} already loaded for this store: 50 rows, nothing changed`); return; }

    const others = async () => (await db.query('select count(*)::int n from public.user_data where business_id <> $1', [storeId])).rows[0].n;
    const baseline = await others();
    await db.query('BEGIN'); await db.query("SET LOCAL request.jwt.claims = '{\"role\":\"service_role\"}'");
    const before = (await db.query('select coalesce(max(id),0)::text id from public.audit_logs')).rows[0].id;
    const existing = new Set((await db.query('select id::text from public.user_data where id = any($1::uuid[])', [ids])).rows.map((r) => r.id));
    let inserted = 0;
    for (const row of rows.filter((r) => !existing.has(r.id))) {   // restore only this dataset's own missing rows
      const keys = Object.keys(row);
      await db.query(`insert into public.user_data(${keys.join(',')}) values(${keys.map((_, i) => '$' + (i + 1)).join(',')})`, Object.values(row)); inserted++;
    }
    const audit = (await db.query("select count(*)::int n, count(*) filter (where actor_role = 'service_role' and actor_user_id is null and table_name = 'user_data' and business_id = $2)::int ok from public.audit_logs where id > $1", [before, storeId])).rows[0];
    const now = (await db.query('select count(*)::int n from public.user_data where business_id = $1', [storeId])).rows[0].n;
    if (audit.n !== inserted || audit.ok !== inserted || now !== rows.length || (await others()) !== baseline) { await db.query('ROLLBACK'); stop('post-insert verification failed; transaction rolled back'); }
    await db.query('COMMIT');
    Object.assign(receipt, { status: 'LOADED', inserted, auditRows: audit.n, storeClaims: now, otherStoresClaims: baseline });
    console.log(`Sample ${DATASET} loaded: ${inserted} rows inserted for one store; ${baseline} claims in other stores unchanged`);
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {}); receipt.status = receipt.status === 'RUNNING' ? 'STOPPED' : receipt.status; receipt.reason = String(e.message).slice(0, 200); throw e;
  } finally {
    writeFileSync(evidencePath(`sample-claims-${Date.now()}.json`), JSON.stringify(receipt, null, 2) + '\n'); await db.end();
  }
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main().catch((e) => { console.error(e.message.startsWith('REFUSED:') || e.message.startsWith('FAIL-CLOSED:') ? e.message : `Sample loader stopped: ${e.code || 'error'}`); process.exitCode = 1; });
