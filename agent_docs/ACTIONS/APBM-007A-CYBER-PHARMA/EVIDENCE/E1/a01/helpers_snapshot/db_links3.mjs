// Read-only: provider record for the 14:27 OWNER_1 link + membership check. No token values selected.
import { writeFileSync } from 'node:fs'; import { loadApp, reqOB, sqlRef, DEV_REF, W, scrub, count } from './lib.mjs'; import { cast, findUser, say, sid } from './sb_lib.mjs';
const pg = reqOB('pg'); const e = loadApp('ob'); if (sqlRef(e.APBM_DEV_DB_URL) !== DEV_REF) throw new Error('STOP: not DEV');
const user = await findUser(cast.OWNER_1); const id = user.id; const SENT = '2026-11-12T08:27:20Z';
const c = new pg.Client({ connectionString: e.APBM_DEV_DB_URL, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } }); const out = { now: new Date().toISOString(), role: 'OWNER_1', userId: sid(id) };
const q = async (s, p) => { count('supabase_read', 1, 'sql'); return (await c.query(s, p)).rows; };
try { await c.connect(); await c.query('BEGIN READ ONLY'); await c.query("SET LOCAL statement_timeout='20s'"); if ((await q('SHOW transaction_read_only'))[0].transaction_read_only !== 'on') throw new Error('STOP');
  const u = (await q("select recovery_sent_at, (recovery_token is not null and recovery_token <> '') pending, last_sign_in_at, lower(email)=$2 email_is_owner1 from auth.users where id=$1", [id, cast.OWNER_1]))[0];
  const s = await q('select created_at, user_id=$1 same_user, aal::text aal from auth.sessions where user_id=$1 order by created_at', [id]);
  const amr = await q("select s.created_at, a.authentication_method m from auth.sessions s join auth.mfa_amr_claims a on a.session_id=s.id where s.user_id=$1 and s.created_at > $2", [id, SENT]).catch(() => 'n/a');
  const others = (await q('select count(*)::int n from auth.sessions where created_at > $1 and user_id <> $2 and user_id = any($3)', [SENT, id, []]))[0].n;
  out.auth = { emailIsOwner1: u.email_is_owner1, recoverySentAt: u.recovery_sent_at, tokenStillPending: u.pending, lastSignInAt: u.last_sign_in_at, sessionsTotal: s.length, sessionsAfterSend: s.filter(x => new Date(x.created_at) > new Date(SENT)).map(x => x.created_at), methodAfterSend: amr };
  const cols = await q("select table_name t, column_name c from information_schema.columns where table_schema='public' and data_type='uuid' and (column_name ~ '(user|owner|member|profile|created_by|invited)' ) order by 1,2");
  out.membership = {};
  for (const { t, c: col } of cols) { const n = (await q(`select count(*)::int n from public.${JSON.stringify(t)} where ${JSON.stringify(col)}=$1`, [id]))[0].n; out.membership[`${t}.${col}`] = n; }
  out.platformRole = (await q('select role::text from public.user_roles where user_id=$1', [id])).map(r => r.role);
  await c.query('ROLLBACK'); } finally { await c.end().catch(() => {}); }
say(out); writeFileSync(`${W}/out/db_links3_result.json`, scrub(out));
