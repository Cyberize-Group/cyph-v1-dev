# Open invitation mail for stakeholder testing — inspection and proposal (no source change)

## 1. Existing setting? NO

`src/server/mailGuard.ts` (same logic in both apps): exact normalized `MAIL_ALLOWLIST` entries only; absent/empty = deny all; entries containing `*` are discarded; `MAIL_GUARD=off` is ignored. `apbm007b-store.test.ts:43` asserts that `*@example.com` and `MAIL_GUARD=off` do not open it. Contract `CONTRACTS/CLOCK_AND_NOTICES.md:23` (Portal 007B) states the same rule ("MAIL_GUARD=off is not authorized"). No other `MAIL_*` runtime switch exists.

## Mail paths

| App | Path | Sender | App allowlist? | Other safeguards |
|---|---|---|---|---|
| OwedBook | Invitation send/resend (`invitationMail.ts`) | Supabase Auth OTP | **YES** | SQL authority (`invitation_create` / `invitation_resend_check`), dispatch claim (5 attempts, 60 s), guard before claim, `shouldCreateUser:false` after admin identity create |
| OwedBook | Sign-in link `POST /api/auth/link` (`emailLink.ts`) | Supabase Auth OTP | no | same-origin, 5/min per IP, existing users only, generic answer |
| OwedBook / Portal | Handoff `generateLink` (`handoff.ts`) | none (no mail) | — | — |
| Portal | Sign-in link (`emailLink.ts`) | Supabase Auth OTP | no | as OwedBook |
| Portal | Access link after purchase (`provisioning.ts` → `accessEmail.ts`) | Supabase Auth OTP | no | dedupe key, claim, 1/min, existing users only; status route 5/min |
| Portal | Billing notices (`billingNotices.ts`, jobs runner) | Resend API direct | **YES** | durable claim, SQL grace re-check, idempotency key |

Supabase Auth restrictions (provider-side, separate from the app guard): DEV uses custom SMTP `smtp.resend.com:465`, sender `no-reply@cyberizedev.com` on a verified domain (Director-reported, 007A E1), so Supabase's team-only default mailer limit does not apply. Still in force: Auth email rate limit (project setting), redirect allowlist (local `localhost:3000/3001/api/auth/confirm` reported; staging origins `https://owedbook.cyberizedev.com` and `https://owedbook-payment.cyberizedev.com` must be added there), OTP templates.

## 3. Proposal — explicit, restrictive by default

New runtime setting **`MAIL_RECIPIENT_POLICY`** = `allowlist` (default; absent, empty or any other value) | `open`. `open` is honoured only when the app's Supabase project is the alpha DEV project `yrsuwikjnbmvpznrgydb` (local DEV and alpha staging both use it; SCRATCH/local-proof and any other project fall back to the allowlist). `MAIL_GUARD=off` and `*` stay ignored. Per-app env, so OwedBook invitations can open while Portal billing notices stay allowlisted.

`src/server/mailGuard.ts`, both apps (~10 lines):

```ts
const ALPHA_DEV_REF = 'yrsuwikjnbmvpznrgydb';
const VALID = /^[^@\s,*]+@[^@\s,*]+\.[^@\s,*]+$/;
function openPolicy(): boolean {
  if ((process.env.MAIL_RECIPIENT_POLICY || '').trim().toLowerCase() !== 'open') return false;
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname === `${ALPHA_DEV_REF}.supabase.co`; } catch { return false; }
}
export function guardDecision(address: string) {
  if (mailAllowed(address)) return { allowed: true, reason: 'allowlisted' as const };
  if (openPolicy() && VALID.test(normalize(address))) return { allowed: true, reason: 'open_policy' as const };
  return { allowed: false, reason: 'blocked_not_allowlisted' as const };
}
```

Tests (both apps): absent/empty/`allowlist`/garbage → blocked; `open` + DEV ref → allowed; `open` + SCRATCH ref → blocked; `open` + malformed address → blocked; `*` and `MAIL_GUARD=off` still ignored (existing assertion kept).

Untouched: auth, SQL role checks, claims, attempt limits, rate limiters, idempotency, `shouldCreateUser:false`, the UI "blocked" message (still shown in allowlist mode).

Requires: Director ruling amending `CLOCK_AND_NOTICES.md:23`; source change + tests through the normal plan/QA path; rebuild not needed for the setting itself (server-only env), but the code change needs a build.

Configuration once implemented:
- Local: OwedBook `.env.local` add `MAIL_RECIPIENT_POLICY=open`, restart OwedBook (`npm start`). Portal: leave unset (notices stay allowlisted) unless notices should also open.
- Alpha staging: same variable on the OwedBook service's runtime environment (not `NEXT_PUBLIC_`, not a build arg), then a new revision/restart; plus the Supabase Auth redirect allowlist entries above.

Nothing implemented; no mail, deployment or database change.
