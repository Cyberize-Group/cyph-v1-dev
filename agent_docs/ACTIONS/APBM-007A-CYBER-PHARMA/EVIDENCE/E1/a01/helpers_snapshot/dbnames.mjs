// presence-only check of documented DB-URL names (from repo RUN_NOTES / APBM-003 docs)
import { readFileSync } from 'node:fs'; import { ROOT, sqlRef, say } from './lib.mjs';
const names = ['DB_URL','DEV_DB_URL','APBM_DEV_DB_URL','APBM_SCRATCH_DB_URL','SCRATCH_DB_URL','PROTO06_DB_URL','QAH_DB_URL','RLS_REPLICA_DB_URL','HARNESS_DB_URL'];
for (const [app, f] of [['ob', `${ROOT}/cyph-v1-dev/.env.local`], ['pp', `${ROOT}/cyph-payment-portal-dev-v1/.env.local`]]) {
  const out = {}; for (const line of readFileSync(f, 'utf8').split(/\r?\n/)) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/); if (m && names.includes(m[1])) out[m[1]] = `present sqlRef=${sqlRef(m[2].trim().replace(/^["']|["']$/g, ''))}`; }
  say({ app, dbUrlNamesPresent: out });
}
