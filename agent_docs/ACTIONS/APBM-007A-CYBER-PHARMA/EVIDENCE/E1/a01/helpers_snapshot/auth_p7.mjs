// P7: rapid sequential session exchanges for ONE user inside 60 s, both directions, separate per-app cookie jars.
// Prototype of the redemption primitive only: no app, no server, no handoff code table. Tokens stay in memory. No email. No sign-out.
import { writeFileSync } from 'node:fs';
import { cast, say, admin, anon, findUser, sid, claims, count, ceiling, env } from './sb_lib.mjs'; import { W, scrub, reqOB } from './lib.mjs';
const { createServerClient } = reqOB('@supabase/ssr'); const A = admin(); const ROLE = 'OWNER_2';
const subject = (await findUser(cast[ROLE])).id; const errv = e => e ? { status: e.status, code: e.code, msg: e.message } : null;
const mkApp = name => { const jar = new Map(); const client = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { cookieOptions: { name }, cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: l => { for (const c of l) { if (c.value === '' || c.options?.maxAge === 0) jar.delete(c.name); else jar.set(c.name, c.value); } } } }); return { name, jar, client }; };
const OB = mkApp('cyph-ob-auth-local'), PP = mkApp('cyph-pp-auth-local'); const t0 = Date.now(); const steps = []; const tokens = [];
async function exchange(label, dest) { const s = { label, dest: dest.name, startMs: Date.now() - t0 };
  count('supabase_read', 1, 'admin getUserById'); const u = await A.auth.admin.getUserById(subject); if (u.error || !u.data.user) { s.fail = 'load-by-id'; steps.push(s); return; }   // guard 1: subject loaded by ID
  const g = await A.auth.admin.generateLink({ type: 'magiclink', email: u.data.user.email }); if (g.error) { s.fail = 'generateLink'; s.err = errv(g.error); steps.push(s); return; }
  s.linkUserIsSubject = g.data.user.id === subject;                                                                                                                                  // guard 2
  ceiling('auth_session', 32); count('auth_session', 1, `P7 ${label} verifyOtp ${ROLE}`);
  const v = await dest.client.auth.verifyOtp({ token_hash: g.data.properties.hashed_token, type: 'magiclink' }); if (v.error) { s.fail = 'verifyOtp'; s.err = errv(v.error); steps.push(s); return; }
  s.sessionUserIsSubject = v.data.user.id === subject; s.sessionId = sid(claims(v.data.session.access_token).session_id); s.endMs = Date.now() - t0; s.tookMs = s.endMs - s.startMs;      // guard 3
  tokens.push({ label, jwt: v.data.session.access_token, sessionId: claims(v.data.session.access_token).session_id }); steps.push(s); }
await exchange('1 OwedBook sign-in (stands for the source session)', OB);
const ppBefore = (await PP.client.auth.getSession()).data.session === null;
await exchange('2 OwedBook → Payment Portal', PP);
await exchange('3 Payment Portal → OwedBook', OB);
await exchange('4 OwedBook → Payment Portal again', PP);
const totalMs = Date.now() - t0;
const live = []; for (const t of tokens) { const r = await anon().auth.getUser(t.jwt); live.push({ label: t.label, stillLive: !r.error, user: r.data?.user?.id === subject }); }
const jarUser = async a => { const r = await a.client.auth.getUser(); return { cookieNames: [...a.jar.keys()].sort(), userIsSubject: r.data?.user?.id === subject, err: errv(r.error) }; };
const out = { at: new Date().toISOString(), role: ROLE, subject: sid(subject), within60s: totalMs < 60000, totalMs, portalJarEmptyBeforeFirstHandoff: ppBefore, steps,
  distinctSessions: new Set(tokens.map(t => t.sessionId)).size, earlierSessionsAfterAllExchanges: live, jars: { ob: await jarUser(OB), pp: await jarUser(PP) },
  jarsShareNoCookie: ![...OB.jar.keys()].some(k => PP.jar.has(k)) };
say(out); writeFileSync(`${W}/out/auth_p7_result.json`, scrub(out));
