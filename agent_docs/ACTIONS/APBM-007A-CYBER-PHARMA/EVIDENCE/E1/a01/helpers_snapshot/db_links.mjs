// Read-only: what the provider recorded for the two emailed links. No token values are selected.
import { writeFileSync } from 'node:fs'; import { loadApp, reqOB, sqlRef, DEV_REF, W, scrub, count } from './lib.mjs'; import { cast, findUser, say } from './sb_lib.mjs';
const pg = reqOB('pg'); const e = loadApp('ob'); if (sqlRef(e.APBM_DEV_DB_URL) !== DEV_REF) throw new Error('STOP: not DEV');
const ids = {}; for (const r of ['OWNER_1', 'STORE_ADMIN']) ids[r] = (await findUser(cast[r])).id;
const c = new pg.Client({ connectionString: e.APBM_DEV_DB_URL, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } }); const out = { now: new Date().toISOString() };
const q = async (s, p) => { count('supabase_read', 1, 'sql'); return (await c.query(s, p)).rows; };
try { await c.connect(); await c.query('BEGIN READ ONLY'); await c.query("SET LOCAL statement_timeout='20s'"); if ((await q('SHOW transaction_read_only'))[0].transaction_read_only !== 'on') throw new Error('STOP');
  for (const [r, id] of Object.entries(ids)) {
    const u = (await q("select recovery_sent_at, (recovery_token is not null and recovery_token <> '') token_still_pending, last_sign_in_at, confirmation_sent_at, email_change_sent_at from auth.users where id=$1", [id]))[0];
    const s = await q('select created_at from auth.sessions where user_id=$1 order by created_at', [id]);
    const a = await q("select created_at, payload->>'action' action, payload->'traits'->>'provider' provider from auth.audit_log_entries where payload->>'actor_id'=$1 and created_at > '2026-11-12T03:27:00Z' order by created_at", [id]);
    const ot = await q("select token_type::text t, created_at, updated_at from auth.one_time_tokens where user_id=$1 order by created_at", [id]).catch(() => 'n/a');
    out[r] = { recoverySentAt: u.recovery_sent_at, tokenStillPending: u.token_still_pending, lastSignInAt: u.last_sign_in_at, sessions: s.length, sessionsCreatedAfterEmail: s.filter(x => new Date(x.created_at) > new Date('2026-11-12T03:28:06Z')).map(x => x.created_at), auditAfterEmail: a.map(x => [new Date(x.created_at).toISOString(), x.action, x.provider].filter(Boolean)), oneTimeTokens: ot === 'n/a' ? ot : ot.map(x => [x.t, new Date(x.created_at).toISOString()]) }; }
  out.auditTotalRows = (await q('select count(*)::int n from auth.audit_log_entries'))[0].n;
  await c.query('ROLLBACK'); } finally { await c.end().catch(() => {}); }
say(out); writeFileSync(`${W}/out/db_links_result.json`, scrub(out));
