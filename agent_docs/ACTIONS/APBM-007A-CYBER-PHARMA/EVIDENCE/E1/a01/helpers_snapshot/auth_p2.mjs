// P2: identities, generateLink+verifyOtp primitive, link collisions, cookie separation. Tokens stay in memory only.
import { writeFileSync } from 'node:fs';
import { cast, say, admin, anon, findUser, adminGet, sid, claims, count, ceiling, env } from './sb_lib.mjs'; import { reqOB, W, scrub } from './lib.mjs';
const A = admin(); const out = { identities: {}, primitive: {}, collisions: {}, cookies: {} };
const errv = e => e ? { name: e.name, status: e.status, code: e.code, msg: e.message } : null;
const usersBefore = (await adminGet('/rest/v1/user_roles?select=user_id')).body.length;
// ---- identities
async function ensure(role, how) { const email = cast[role]; let u = await findUser(email); if (u) return { u, created: false };
  ceiling('auth_identity', 4); count('auth_identity', 1, `${role} via ${how}`); let r;
  if (how === 'createUser') r = await A.auth.admin.createUser({ email, email_confirm: true, user_metadata: { apbm: 'apbm007a_e1_a01' } });
  else r = await A.auth.admin.generateLink({ type: how, email });
  u = await findUser(email); return { u, created: !!u, how, err: errv(r.error), linkType: r.data?.properties?.verification_type, linkToken: r.data?.properties?.hashed_token }; }
const ids = {};
for (const [role, how] of [['OWNER_1', 'createUser'], ['STORE_ADMIN', 'createUser'], ['OWNER_2', 'magiclink'], ['MEMBER', 'invite']]) {
  const r = await ensure(role, how); ids[role] = r.u?.id; if (!r.u && how !== 'createUser') { const r2 = await ensure(role, 'createUser'); ids[role] = r2.u?.id; out.identities[role + '_fallback'] = { created: r2.created, err: r2.err }; }
  const [roles, prof, mem] = await Promise.all([adminGet(`/rest/v1/user_roles?select=role&user_id=eq.${ids[role]}`), adminGet(`/rest/v1/profiles?select=id&id=eq.${ids[role]}`), adminGet(`/rest/v1/user_businesses?select=role&user_id=eq.${ids[role]}`)]);
  out.identities[role] = { id: sid(r.u?.id), createdNow: r.created, via: r.how, err: r.err, linkTypeReturned: r.linkType, confirmed: !!r.u?.email_confirmed_at, platformRoles: roles.body?.map(x => x.role), profileRows: prof.body?.length, memberships: mem.body?.length };
  if (r.linkToken) ids[role + '_creationToken'] = { t: r.linkToken, type: r.linkType };
}
out.identities.userRoleRowsBeforeAfter = [usersBefore, (await adminGet('/rest/v1/user_roles?select=user_id')).body.length];
// ---- helpers
const gen = async role => { const r = await A.auth.admin.generateLink({ type: 'magiclink', email: cast[role] }); if (r.error) throw new Error('generateLink: ' + r.error.message); return { t: r.data.properties.hashed_token, type: r.data.properties.verification_type, uid: r.data.user.id }; };
const verify = async (t, type = 'magiclink', client = anon()) => { ceiling('auth_session', 32); count('auth_session', 1, 'verifyOtp'); const r = await client.auth.verifyOtp({ token_hash: t, type }); return r.error ? { ok: false, err: errv(r.error) } : { ok: true, session: r.data.session, c: claims(r.data.session.access_token) }; };
const brief = (v, uid) => v.ok ? { ok: true, subjectMatches: v.c.sub === uid, sessionId: sid(v.c.session_id), aal: v.c.aal, amr: v.c.amr?.map(a => a.method), role: v.c.role, lifetimeSec: v.c.exp - v.c.iat, isAnon: v.c.is_anonymous } : v;
// ---- primitive on OWNER_1
const g1 = await gen('OWNER_1'); const v1 = await verify(g1.t, 'magiclink'); out.primitive.exchange = { linkType: g1.type, generatedForExpectedUser: g1.uid === ids.OWNER_1, ...brief(v1, ids.OWNER_1) };
out.primitive.reuseSameToken = brief(await verify(g1.t, 'magiclink'), ids.OWNER_1);
const g1b = await gen('OWNER_1'); out.primitive.verifyAsTypeEmail = brief(await verify(g1b.t, 'email'), ids.OWNER_1);
const gu = await anon().auth.getUser(v1.session.access_token); out.primitive.firstSessionStillValidAfterLaterExchanges = !gu.error && gu.data.user.id === ids.OWNER_1;
// ---- creation-path tokens: can the link returned while creating a user be redeemed?
for (const role of ['OWNER_2', 'MEMBER']) { const ct = ids[role + '_creationToken']; if (ct) out.identities[role].creationLinkRedeem = brief(await verify(ct.t, ct.type), ids[role]); }
// ---- collisions on OWNER_2 (T1 stands in for an outstanding emailed link)
const T1 = await gen('OWNER_2'); const T2 = await gen('OWNER_2'); const r2 = await verify(T2.t); const r1 = await verify(T1.t);
out.collisions.order1_emailLinkThenHandoff = { handoffExchange: brief(r2, ids.OWNER_2), earlierLinkAfterwards: brief(r1, ids.OWNER_2) };
const T3 = await gen('OWNER_2'); const T4 = await gen('OWNER_2'); const r3 = await verify(T3.t); const r4 = await verify(T4.t);
out.collisions.order2_handoffIssuedThenNewLink = { earlierHandoffToken: brief(r3, ids.OWNER_2), newerLink: brief(r4, ids.OWNER_2) };
const T5 = await gen('OWNER_2'); const [c1, c2] = await Promise.all([verify(T5.t), verify(T5.t)]);
out.collisions.concurrentSameToken = [brief(c1, ids.OWNER_2), brief(c2, ids.OWNER_2)];
const [T6, T7] = await Promise.all([gen('OWNER_2'), gen('OWNER_2')]); const [c6, c7] = await Promise.all([verify(T6.t), verify(T7.t)]);
out.collisions.concurrentTwoIssues = [brief(c6, ids.OWNER_2), brief(c7, ids.OWNER_2)];
out.collisions.crossUserIsolation = 'OWNER_1 exchanges above were unaffected by OWNER_2 token churn: ' + (!(await anon().auth.getUser(v1.session.access_token)).error);
// ---- cookie separation with @supabase/ssr over ONE shared jar (localhost has no port isolation)
const { createServerClient } = reqOB('@supabase/ssr'); const jar = new Map();
const mk = name => createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { ...(name ? { cookieOptions: { name } } : {}), cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: list => { for (const c of list) { if (c.value === '' || c.options?.maxAge === 0) jar.delete(c.name); else jar.set(c.name, c.value); } } } });
const names = () => [...jar.keys()].sort();
const ob = mk('cyph-ob-auth-local'), pp = mk('cyph-pp-auth-local');
const gA = await gen('STORE_ADMIN'); const vA = await verify(gA.t, 'magiclink', ob);
const ppBefore = (await pp.auth.getSession()).data.session; const jarAfterOb = names();
const gB = await gen('OWNER_1'); const vB = await verify(gB.t, 'magiclink', pp);
const obU = (await ob.auth.getUser()).data.user?.id, ppU = (await pp.auth.getUser()).data.user?.id;
out.cookies.named = { obLogin: vA.ok, jarAfterObLogin: jarAfterOb, ppStartsWithoutSession: ppBefore === null, ppLogin: vB.ok, jarAfterBoth: names(), obStillStoreAdmin: obU === ids.STORE_ADMIN, ppIsOwner1: ppU === ids.OWNER_1 };
// default names: reuse the two sessions just minted (setSession mints nothing new)
const jar2Names = []; jar.clear(); const d1 = mk(null), d2 = mk(null);
await d1.auth.setSession({ access_token: vA.session.access_token, refresh_token: vA.session.refresh_token }); jar2Names.push(names());
const d2Sees = (await d2.auth.getUser()).data.user?.id; 
out.cookies.defaultNames = { cookieNamesAfterFirstAppLogin: names().map(n => n.replace(/sb-[a-z0-9]{20}/, 'sb-<ref>')), secondAppSeesFirstAppsUser: d2Sees === ids.STORE_ADMIN };
say(out); writeFileSync(`${W}/out/auth_p2_result.json`, scrub(out));
