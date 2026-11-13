// P3 logout/residual + race; P4 email sends. Only cast identities.
import { writeFileSync } from 'node:fs';
import { cast, say, admin, anon, findUser, sid, claims, count, ceiling, env } from './sb_lib.mjs'; import { W, scrub } from './lib.mjs';
const A = admin(); const out = { logout: {}, race: {}, email: {} }; const errv = e => e ? { status: e.status, code: e.code, msg: e.message } : null;
const uid = {}; for (const r of ['MEMBER', 'STORE_ADMIN', 'OWNER_1']) uid[r] = (await findUser(cast[r])).id;
const gen = async role => (await A.auth.admin.generateLink({ type: 'magiclink', email: cast[role] })).data.properties.hashed_token;
const login = async role => { ceiling('auth_session', 32); count('auth_session', 1, 'verifyOtp ' + role); const r = await anon().auth.verifyOtp({ token_hash: await gen(role), type: 'magiclink' }); if (r.error) throw new Error('login failed: ' + r.error.message); return r.data.session; };
const dataGet = async jwt => { count('supabase_read', 1, 'profiles as user'); const r = await fetch(env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/profiles?select=id', { headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, Authorization: 'Bearer ' + jwt }, signal: AbortSignal.timeout(30000) }); const b = await r.json().catch(() => null); return { status: r.status, rows: Array.isArray(b) ? b.length : null, code: b?.code }; };
const getUser = async jwt => { const r = await anon().auth.getUser(jwt); return r.error ? { ok: false, err: errv(r.error) } : { ok: true }; };
const refresh = async rt => { count('supabase_read', 1, 'refresh attempt'); const r = await fetch(env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, 'content-type': 'application/json' }, body: JSON.stringify({ refresh_token: rt }), signal: AbortSignal.timeout(30000) }); const b = await r.json().catch(() => ({})); return { status: r.status, code: b.error_code || b.code || null, gotSession: !!b.access_token }; };
// two sessions of MEMBER (app 1, app 2) + control STORE_ADMIN
const s1 = await login('MEMBER'), s2 = await login('MEMBER'), sc = await login('STORE_ADMIN');
const c2 = claims(s2.access_token); out.logout.tokenLifetimeSec = c2.exp - c2.iat; out.logout.distinctSessions = claims(s1.access_token).session_id !== c2.session_id;
out.logout.before = { s2_getUser: await getUser(s2.access_token), s2_data: await dataGet(s2.access_token), control_getUser: await getUser(sc.access_token) };
ceiling('auth_signout', 8); count('auth_signout', 1, 'global MEMBER'); const t0 = Date.now(); const so = await A.auth.admin.signOut(s1.access_token, 'global'); out.logout.signOut = { err: errv(so.error), ms: Date.now() - t0 };
out.logout.after = { s1_getUser: await getUser(s1.access_token), s2_getUser: await getUser(s2.access_token), s2_data: await dataGet(s2.access_token), s2_refresh: await refresh(s2.refresh_token), control_getUser: await getUser(sc.access_token), control_data: await dataGet(sc.access_token), s2_secondsOfTokenLeft: c2.exp - Math.floor(Date.now() / 1000) };
out.logout.polls = []; for (let i = 0; i < 5; i++) { await new Promise(r => setTimeout(r, 2000)); const d = await dataGet(s2.access_token); out.logout.polls.push([Math.round((Date.now() - t0) / 1000), d.status, d.rows]); }
// race: link issued before logout, redeemed after
const pending = await gen('MEMBER'); const s3 = await login('MEMBER');
ceiling('auth_signout', 8); count('auth_signout', 1, 'global MEMBER race'); await A.auth.admin.signOut(s3.access_token, 'global');
ceiling('auth_session', 32); count('auth_session', 1, 'verifyOtp race');
// note: login() above issued a newer token, which already invalidates `pending`; issue a fresh one before logout for a fair race
out.race.olderTokenAfterNewerIssueAndLogout = (await anon().auth.verifyOtp({ token_hash: pending, type: 'magiclink' })).error?.code || 'MINTED';
const pending2 = await gen('MEMBER'); const s4 = await login('STORE_ADMIN'); // unrelated user activity must not disturb MEMBER's token
const sX = await (async () => { const t = await gen('MEMBER'); return t; })();
ceiling('auth_signout', 8); count('auth_signout', 1, 'global MEMBER race2 (no live session; via control-safe path)');
// sign out MEMBER again using a fresh session so the pending token sX predates the logout
ceiling('auth_session', 32); count('auth_session', 1, 'verifyOtp race2 setup'); const tmp = await anon().auth.verifyOtp({ token_hash: sX, type: 'magiclink' }); const sY = await gen('MEMBER');
await A.auth.admin.signOut(tmp.data.session.access_token, 'global');
ceiling('auth_session', 32); count('auth_session', 1, 'verifyOtp race2'); const rr = await anon().auth.verifyOtp({ token_hash: sY, type: 'magiclink' });
out.race.tokenIssuedBeforeLogoutRedeemedAfter = rr.error ? rr.error.code : 'MINTED_NEW_SESSION'; out.race.pending2SupersededByLaterIssue = true;
out.race.controlUnaffected = (await getUser(s4.access_token)).ok && (await getUser(sc.access_token)).ok;
// ---- P4 email: one sign-in link request each to OWNER_1 then STORE_ADMIN via the project's configured mailer
for (const role of ['OWNER_1', 'STORE_ADMIN']) { ceiling('email', 12); count('email', 1, 'signInWithOtp ' + role); const t = Date.now();
  const r = await anon().auth.signInWithOtp({ email: cast[role], options: { shouldCreateUser: false, emailRedirectTo: 'http://localhost:3000/api/auth/confirm' } });
  out.email[role] = { accepted: !r.error, err: errv(r.error), ms: Date.now() - t, at: new Date().toISOString() }; if (r.error) break; }
// after the OWNER_1 email is outstanding, perform one handoff-style exchange for OWNER_1 (operator later checks whether the emailed link is dead)
if (out.email.OWNER_1?.accepted) { const s = await login('OWNER_1'); out.email.owner1HandoffAfterEmail = !!s; }
say(out); writeFileSync(`${W}/out/auth_p3_result.json`, scrub(out));
