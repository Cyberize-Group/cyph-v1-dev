#!/usr/bin/env node
// QAM Q2 T-12 QA canonical seed hash (Claudy). Own projection per SFC §4: every seeded table except audit_logs,
// excluding surrogate id / created_at / updated_at / joined_at, auth uuids mapped to the cast email. Runs under qa-shim.
import { createRequire } from 'node:module'; import { join } from 'node:path'; import { createHash } from 'node:crypto'; import { writeFileSync } from 'node:fs';
if (process.env.APBM_TARGET !== 'scratch' || !process.env.QAH_DB_URL) { console.error('run under qa-shim'); process.exit(2); }
const require = createRequire(join(process.cwd(), 'package.json')); const pg = require('pg');
const c = new pg.Client({ connectionString: process.env.QAH_DB_URL }); await c.connect(); await c.query('BEGIN READ ONLY');
const q = async s => (await c.query(s)).rows;
const cast = await q(`select id::text id, email from public.profiles where email like 'apbm003-%@example.invalid' order by email`);
const map = Object.fromEntries(cast.map(r => [r.id, r.email]));
const tables = ['accounts', 'businesses', 'user_businesses', 'subscriptions', 'reference_dataset_versions', 'aac_reference', 'wac_reference', 'ful_reference', 'pbm_info', 'system_config', 'user_data'];
const DROP = new Set(['id', 'created_at', 'updated_at', 'joined_at']);
const canon = v => { if (v === null) return null; if (typeof v === 'object') return v instanceof Date ? v.toISOString() : JSON.stringify(v); const s = String(v); return map[s] ?? s; };
const projection = {}; const counts = {};
for (const t of tables) { const rows = await q(`select to_jsonb(x) r from public.${t} x`); counts[t] = rows.length; projection[t] = rows.map(({ r }) => Object.keys(r).filter(k => !DROP.has(k)).sort().map(k => `${k}=${canon(r[k])}`).join('|')).sort(); }
const prof = await q(`select to_jsonb(p) r from public.profiles p where email like 'apbm003-%@example.invalid'`); projection.profiles = prof.map(({ r }) => Object.keys(r).filter(k => !DROP.has(k) && k !== 'avatar_url').sort().map(k => `${k}=${canon(r[k])}`).join('|')).sort(); counts.profiles = prof.length;
const roles = await q(`select to_jsonb(u) r from public.user_roles u where user_id in (select id from public.profiles where email like 'apbm003-%@example.invalid')`); projection.user_roles = roles.map(({ r }) => Object.keys(r).filter(k => !DROP.has(k)).sort().map(k => `${k}=${canon(r[k])}`).join('|')).sort(); counts.user_roles = roles.length;
await c.query('ROLLBACK'); await c.end();
const sha = createHash('sha256').update(JSON.stringify(projection)).digest('hex');
const out = { projectRef: process.env.APBM_PROJECT_REF, qaCanonicalSHA256: sha, counts, excluded: [...DROP], authUuidMapping: 'profile email', at: new Date().toISOString() };
const file = process.argv[2]; if (file) writeFileSync(file, JSON.stringify(out, null, 2) + '\n'); console.log(JSON.stringify(out));
