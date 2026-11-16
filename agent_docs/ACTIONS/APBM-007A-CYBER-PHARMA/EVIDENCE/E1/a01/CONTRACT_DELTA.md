# Contract delta and proposed final design — E1 a01

Proposal for the one post-E1 architecture review. Nothing here is frozen or approved. **Amended on 12 November:** §1.2–§1.5 are completed and superseded by `HANDOFF_CONTRACT_PROPOSAL.md`; the seven review amendments are in `REVIEW_AMENDMENTS.md`. Where this file differs from those two, they are the proposal. Evidence references are to `CAPABILITY_RESULTS.md` (F-A1…F-A6), `ENVIRONMENT_IDENTITY.md` and `BASELINE_RESULTS.md`.

## 1. Auth handoff

### 1.1 Cookies and clients

Both apps today use the default cookie `sb-<ref>-auth-token` against the same project and would share one session on localhost (proven). Proposed:

| App | Local | Staging |
|---|---|---|
| OwedBook | `cyph-ob-auth-local` | `cyph-ob-auth-staging` |
| Portal | `cyph-pp-auth-local` | `cyph-pp-auth-staging` |

Set through `cookieOptions.name` in all three factories of each app (`utils/supabase/server.ts`, `client.ts`, `middleware.ts`), from one shared constant. Move the server factory from `get`/`set`/`remove` to `getAll`/`setAll` (the middleware already uses it). Host-only, `sameSite=lax`. Transient handoff cookie: `cyph-<app>-ho-<env>`, httpOnly, path limited to the handoff routes, 5-minute max age.

### 1.2 Routes (same in both apps; `<peer>` is the other app's fixed origin from config)

| Route | Method | Input | Behaviour | Responses |
|---|---|---|---|---|
| `/api/handoff/start` | GET | `return` (relative path, allowlisted) | Create state (32 bytes) and verifier (32 bytes); store both in the transient cookie; redirect to `<peer>/api/handoff/authorize` with `state`, `challenge` (S256), `dest` (app ID), `return` | 302; 400 `invalid_return` |
| `/api/handoff/authorize` | GET | `state`, `challenge`, `dest`, `return` | `getUser()`; if signed out, 302 to this app's sign-in with a bounded return. Validate `dest` and `return` against the fixed table. Insert code row (hash only). 302 to `<dest>/api/handoff/callback?code&state` | 302; 400 `invalid_request`; 429 |
| `/api/handoff/callback` | GET | `code`, `state` | Check state against the cookie; call `handoff_claim`; if a different user is already signed in here, stop at a confirm-switch page; mint session (1.3); clear transient cookie; 302 to `return` | 302; 400/410 generic "link expired, start again" page |
| `/api/auth/logout` | POST | — | `handoff_invalidate_user`, provider sign-out (default scope, provider-wide), clear this app's cookies | 200; 502 honest retry state |

All four: `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, generic error bodies. Limits: authorize 10 per user per minute; callback 20 per IP per minute; code TTL 60 seconds.

### 1.3 Session mint at redemption (proven primitive, with three guards the probes showed are required)

1. `handoff_claim` returns the subject user ID. Load the user by ID with the admin API; refuse if absent. **Never pass an address that came from a request, and never call the link generator for a user that was not just loaded by ID** — it creates users (F-A1).
2. `generateLink({type:'magiclink', email: <loaded user's email>})`; require the returned user ID to equal the subject.
3. `verifyOtp({token_hash, type:'magiclink'})` on the destination's cookie-bound server client; require the session subject to equal the code subject before responding. Otherwise sign that session out and fail.
4. On any provider error or timeout: fail closed; the code stays consumed; the user starts a new flow.

Nothing from the provider is stored. No encryption key.

### 1.4 Collision behaviour — needs an architecture decision

Proven: one live link token per user (F-A2), and link generation starts the email throttle (F-A3). Consequences for the product:

| Situation | What happens | Proposed handling |
|---|---|---|
| Owner's first access email after purchase | No collision for a new, signed-out purchaser. An existing user who is signed in while purchasing could collide | Signed-in existing users get a plain notice with no sign-in link (`HANDOFF_CONTRACT_PROPOSAL.md` §7) |
| Signed-in user crosses apps while an older emailed link sits unread | That emailed link stops working | Expired-link page offers "send a new link" |
| User requests an emailed link during an in-flight handoff | The handoff fails at step 3 | Fail closed; destination restarts the handoff once automatically |
| Two tabs cross at the same moment | One fails | Same automatic single restart |
| User crosses apps, then asks for an emailed link within a minute | 429 from the provider | Show "try again in a minute" |

I recommend accepting this with the handling above; the failure cases are narrow and recoverable. If the review does not accept it, the supported alternatives are:

| Alternative | Cost | Note |
|---|---|---|
| No automatic handoff; each app signs in by its own emailed link | −3 engineering days | Fails the "without another login" outcome |
| Session-family design with our own destination session tokens and RLS fencing | +4–6 engineering days, +2 QA days, APBM003 regression | The fallback already costed in the contract |
| Shared parent-domain cookie | — | Excluded by R-04; does not work on localhost |

### 1.5 Logout and liveness

- Guards: every protected server component, route and action calls `getUser()`. Proven sufficient: it rejects all of the user's sessions immediately after provider-wide sign-out (F-A4). No `getSession()` or locally decoded claims as authority.
- **No extension of OwedBook's server-key use beyond D-01 is needed** for liveness. The server key is used only in the callback route (1.3) and inside the two handoff database functions.
- Residual, measured: direct data-API access continues until token expiry, at most 3600 seconds (F-A5). Proposal for a later, separately authorized settings change: 900 seconds. Cost: a refresh roughly every 15 minutes per active tab; affects every app on the project; does not shorten tokens already issued.
- Logout race (F-A6): the provider keeps pending link tokens alive across sign-out. Our design never holds a provider token between requests, so the exposure is the 60-second handoff code. Closed by (a) `handoff_invalidate_user` at logout in either app and (b) `handoff_claim` refusing when the source session recorded on the code no longer exists. (b) needs the claim function to read `auth.sessions`. Verified on DEV: the table is readable by `postgres` and not by `service_role`, and sign-out deletes the session rows — so the check works inside a SECURITY DEFINER function owned by `postgres` (`DB_CHECK_RESULTS.md` §7).
- An emailed sign-in link issued before a sign-out remains usable until it expires. That is inherent to emailed links and is stated, not fixed.

### 1.6 Sign-in, landing and invitations

- Returning user: `signInWithOtp` with `shouldCreateUser:false`. Provider accepted this for existing users with sign-up disabled.
- First access after purchase: provisioning creates the user with the admin create call (never by link generation for an unknown address), then issues the access email.
- `/api/auth/confirm`: accept only `magiclink`, `email` and `invite`; `next` from an allowlist; both `magiclink` and `email` verify types work.
- Password sign-in stays in both apps (`REVIEW_AMENDMENTS.md` RA-1).
- Delivery, sender and template: OwedBook emailed sign-in passed on 12 November through Resend with the `cyberizedev.com` sender and the Director's revised template; Payment Portal not yet tested (`EMAIL_OBSERVATIONS.md`).

## 2. Billing

| Item | Proposal |
|---|---|
| Catalogue | **Candidate B**: one product, one graduated licensed monthly price (9900 then 4900), one item, quantity = active store count. All required behaviours passed, including hosted-portal cancel and undo |
| Config names | `STRIPE_PRICE_STORES` (one ID), `STRIPE_PORTAL_CONFIGURATION`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_EXPECTED_ACCOUNT`. Remove `STRIPE_PRICE_STARTER/PRO/ENTERPRISE` from the example file |
| Catalogue script | Asserts account ID and test mode; finds by lookup key `owedbook_stores_v1`; verifies currency, interval, scheme, tiers; creates only when absent; never edits a mismatch; idempotency key per run |
| API version | Pin `2026-04-22.dahlia` in the client and on the staging webhook endpoint |
| Portal | The app creates and stores its own configuration and **always passes its ID** when creating a session: payment method update on, invoice history on, cancellation at period end on, subscription update off, customer update off. Proven in the hosted portal. Never rely on the account default (F-S2) |
| Cancel-scheduled state | Derived from `cancel_at` **or** `cancel_at_period_end`; the hosted portal sets only `cancel_at` (F-S1). Mirror both fields |
| Undo cancellation | Owner-only server route clears whichever schedule is actually set, the flag or the `cancel_at` date, on the same subscription. Clearing the flag is proven by API; clearing a portal-set date by API is not yet proven (RA-4) |
| Quantity | Only our named-store operations change quantity, with `proration_behavior: create_prorations` (007B) |
| APA | Promotion code from a server allowlist, applied at Checkout. Fixture proposal for freeze: 10% once. It discounts all stores on the invoice — flag for Frank |
| Webhook route | `POST /api/webhooks/stripe` on the portal, raw body, Node runtime. Local: `stripe listen --forward-to localhost:3001/api/webhooks/stripe` |
| Events | `checkout.session.completed`, `checkout.session.expired`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. Others: verified, logged as ignored |
| Processing | Insert event ID (unique) → retrieve current object from Stripe → apply idempotent transition in one database call → mark processed. Non-2xx on unresolved failure. Timeout 10 s per Stripe call, no SDK auto-retry on mutations |
| Reconciliation | Operator command re-reads one operation's Checkout session and subscription and reapplies the same transition |

Status and error map (portal API): 200 ok; 202 pending; 400 `invalid_input`; 401 `sign_in_required`; 403 `not_owner`; 404 generic; 409 `operation_in_progress` or `npi_unavailable`; 410 `expired`; 422 `promotion_not_accepted`; 429 `slow_down`; 502 `provider_unavailable`. Public responses never reveal whether an email or account exists.

## 3. Data

See `MIGRATION_PLAN.md`. Settled by evidence: unique NPI can be added now (0 duplicates, 0 null); a ten-digit rule cannot be a validated table constraint (all 5 existing fixtures fail it); NCPDP becomes nullable without touching values; the old `pending_registrations` and `apa_memberships` tables are not reused; store-level `stripe_customer_id` is never read or written.

Live database facts that shape the migrations are in `DB_CHECK_RESULTS.md`: broad table grants and open default privileges (F-D1…F-D4), member-readable `subscriptions`, no unique index on NPI alone. The 12 pre-existing users are classified there (7 synthetic cast, 5 older accounts with no tenant standing).

## 4. Tooling changes to include in E2

Portal ESLint (replace `next lint`); OwedBook jest setup sets mock mode; Node 22 pin in both; cookie-name agreement test.

## 5. Gaps with owner and bounded alternative

| Gap | Owner | If it stays open |
|---|---|---|
| Sandbox default portal configuration is now the E1 probe one (F-S2) | Tony | Harmless while the app passes its own ID; replace by saving portal settings in the Dashboard if wanted |
| Apply rehearsal on SCRATCH (identity and ledger now verified) | E2 | Restore procedure unproven until rehearsed |
| Payment Portal emailed login, staging allowlist and template branches | Tony + E2 | OwedBook path is proven; the portal path is not |
| Collision acceptance (1.4) | Friday / JARVIS | Choose an alternative from the table |
| APA scope across stores | Frank, via Tony | Sandbox fixture only |
