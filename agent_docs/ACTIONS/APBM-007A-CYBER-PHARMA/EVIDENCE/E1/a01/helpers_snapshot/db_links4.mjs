// Read-only: OWNER_1 session timestamps and methods only.
import { loadApp, reqOB, sqlRef, DEV_REF, count } from './lib.mjs'; import { cast, findUser } from './sb_lib.mjs';
const pg = reqOB('pg'); const e = loadApp('ob'); if (sqlRef(e.APBM_DEV_DB_URL) !== DEV_REF) throw new Error('STOP');
const id = (await findUser(cast.OWNER_1)).id; const c = new pg.Client({ connectionString: e.APBM_DEV_DB_URL, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } });
try { await c.connect(); await c.query('BEGIN READ ONLY'); count('supabase_read', 1, 'sql');
  const r = await c.query("select s.created_at, s.refreshed_at, s.not_after, (select string_agg(a.authentication_method,',') from auth.mfa_amr_claims a where a.session_id=s.id) m, left(coalesce(s.user_agent,''),40) ua from auth.sessions s where s.user_id=$1 order by s.created_at", [id]);
  for (const x of r.rows) console.log(new Date(x.created_at).toISOString(), x.m, x.refreshed_at ? 'refreshed ' + new Date(x.refreshed_at).toISOString() : '', '|', x.ua);
  await c.query('ROLLBACK'); } finally { await c.end().catch(() => {}); }
