// ONE fresh sign-in email to OWNER_1 against the Director's revised template. No retry, no generateLink, no exchange.
import { writeFileSync } from 'node:fs';
import { cast, say, anon, count, ceiling } from './sb_lib.mjs'; import { W, scrub } from './lib.mjs';
if (cast.OWNER_1 !== (process.env.EXPECT || '').toLowerCase()) throw new Error('STOP: Director-named address does not equal the private-file OWNER_1');
ceiling('email', 12); count('email', 1, 'signInWithOtp OWNER_1 (revised template)'); const t = Date.now();
const r = await anon().auth.signInWithOtp({ email: cast.OWNER_1, options: { shouldCreateUser: false, emailRedirectTo: 'http://localhost:3000/api/auth/confirm' } });
const out = { role: 'OWNER_1', addressMatchesPrivateFile: true, accepted: !r.error, err: r.error ? { status: r.error.status, code: r.error.code, msg: r.error.message } : null, ms: Date.now() - t, at: new Date().toISOString(), redirect: 'http://localhost:3000/api/auth/confirm', shouldCreateUser: false };
say(out); writeFileSync(`${W}/out/auth_p6_result.json`, scrub(out));
