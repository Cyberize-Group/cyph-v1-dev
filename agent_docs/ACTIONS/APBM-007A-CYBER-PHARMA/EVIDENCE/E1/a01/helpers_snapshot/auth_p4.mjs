import { writeFileSync } from 'node:fs';
import { cast, say, admin, anon, count, ceiling } from './sb_lib.mjs'; import { W, scrub } from './lib.mjs';
const out = {}; const errv = e => e ? { status: e.status, code: e.code, msg: e.message } : null;
await new Promise(r => setTimeout(r, 75000)); // per-user email interval observed; wait it out once (single controlled retry)
for (const role of ['OWNER_1', 'STORE_ADMIN']) { ceiling('email', 12); count('email', 1, 'signInWithOtp ' + role); const t = Date.now();
  const r = await anon().auth.signInWithOtp({ email: cast[role], options: { shouldCreateUser: false, emailRedirectTo: 'http://localhost:3000/api/auth/confirm' } });
  out[role] = { accepted: !r.error, err: errv(r.error), ms: Date.now() - t, at: new Date().toISOString() }; if (r.error) break; }
if (out.OWNER_1?.accepted) { // handoff-style exchange AFTER the email is outstanding; also shows whether admin generateLink is throttled by the email interval
  const g = await admin().auth.admin.generateLink({ type: 'magiclink', email: cast.OWNER_1 }); out.generateLinkRightAfterEmail = { err: errv(g.error) };
  if (!g.error) { ceiling('auth_session', 32); count('auth_session', 1, 'verifyOtp OWNER_1 after email'); const v = await anon().auth.verifyOtp({ token_hash: g.data.properties.hashed_token, type: 'magiclink' }); out.owner1ExchangeAfterEmail = { ok: !v.error, err: errv(v.error) }; } }
say(out); writeFileSync(`${W}/out/auth_p4_result.json`, scrub(out));
