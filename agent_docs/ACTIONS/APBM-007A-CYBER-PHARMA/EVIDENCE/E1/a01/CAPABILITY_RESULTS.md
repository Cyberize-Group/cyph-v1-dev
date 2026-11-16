# Capability probe results — E1 a01

Run 12 November 2026 (Asia/Dhaka) under the released capsule, after the private inbox file passed its checks (regular file, owner-only, outside Git, four distinct addresses, no plus tag). Evidence labels only; no address appears here. Raw sanitized outputs are in `results/`.

## 1. Stripe catalogue comparison (sandbox `acct_1RxzixGnEQDyu3RR`, API `2026-04-22.dahlia`)

Candidate A: two products, monthly USD 9900 (first store) and 4900 (additional store). Candidate B: one product, one licensed monthly USD graduated price, tier 1 `up_to=1` at 9900, tier 2 at 4900, quantity = store count.

| Check | Candidate A | Candidate B |
|---|---|---|
| Total at N=1 / 2 / 3 | 9900 / 14800 / 19700 | 9900 / 14800 / 19700 |
| First invoice on a real subscription (N=1, test card) | paid, 9900 | paid, 9900 |
| Invoice line wording at N=3 | "1 × … first store (at $99.00 / month)", "2 × … additional store (at $49.00 / month)" | "1 × … (Tier 1 at $99.00 / month)", "2 × … (Tier 2 at $49.00 / month)" |
| Change mechanics 1→2→3→2→1 | add an item, change its quantity, delete the item | change one quantity |
| Proration preview, net pending after each step (same instant) | +4900, +9800, +4900, 0 | +4900, +9800, +4900, 0 |
| Proration line wording | deltas on the additional-store product only | whole-quantity pairs, e.g. "Unused time on 2 × …" −14800 and "Remaining time on 3 × …" +19700 |
| Next regular invoice after each step | 14800, 19700, 14800, 9900 | 14800, 19700, 14800, 9900 |
| 10%-off once coupon, N=1 | 8910 (discount 990) | 8910 (discount 990) |
| 10%-off once coupon, N=3 | 17730 (discount 1970) | 17730 (discount 1970) |
| Promotion code applied to the live subscription | accepted; next invoice 8910 | accepted; next invoice 8910 |
| Cancel at period end by API | active, flag set, cancel date set | same |
| Undo by API on the same subscription | active, flag cleared, no new subscription | same |
| Hosted portal (browser) | not tested — B passed, so A was not needed under the Director's instruction | **PASS**, see §1a |

Reading: the two candidates are financially identical. B is simpler to operate (one item, one quantity, no item add/delete, no zero-quantity case). A reads slightly cleaner on proration lines in the API; in the hosted portal B's proration lines read clearly ("Qty 1 → 2"). All required behaviours pass for B, including the hosted portal. Proposal: **select candidate B**.

Note for 007B: the coupon discounts the whole invoice, including additional stores. That is Stripe's default; whether APA should cover additional stores is an open business rule, not a defect.

## 1a. Hosted portal — candidate B (Director approval of 12 November)

One portal configuration created by API: payment method update on, invoice history on, cancellation at period end on, subscription update off, customer update off. Three hosted sessions used of 12. Evidence type is marked per row: **BROWSER** = seen on `billing.stripe.com` in a headless Chromium driven by the probe (screenshots in `results/portal_screens/`); **API** = read back from Stripe afterwards.

| Check | Evidence | Result |
|---|---|---|
| Portal opens for the graduated-price subscription | BROWSER | yes; shows product, "$99.00 per month", next billing date, payment method, invoice history |
| Controls offered | BROWSER | Cancel subscription; Add payment method; delete payment method; invoice search and invoice link; Return. **No** update-plan, quantity or promotion-code control |
| Cancel flow | BROWSER | Confirmation page states access continues until 12 December 2026; one button |
| State after hosted cancel | API | `status` active, **`cancel_at` = 2026-12-12, `cancel_at_period_end` = false** |
| Overview after cancel | BROWSER | "Cancels Dec 12" and a "Don't cancel subscription" control |
| Hosted undo | BROWSER | "Renew your subscription" page, one button |
| State after hosted undo | API | active, `cancel_at` null, flag false; same subscription ID |
| Portal at three stores | BROWSER | "(×3)", "$197.00 per month"; upcoming invoice shows "First 1 — $99.00" and "2 and above — $98.00"; still only Cancel; no quantity control |
| Upcoming-invoice display | BROWSER | prorations shown as "Prorated charge … Qty 1 → 2 $49.00"; promotion line "(10% off)" |

**Finding F-S1:** a cancellation made in the hosted portal is recorded as a `cancel_at` date with `cancel_at_period_end` left false on this API version. A cancellation made by our API call sets the flag. The subscription mirror and the "cancel scheduled" state must read `cancel_at`, not only the flag.

**Finding F-S2:** the first portal configuration created in an account that has none becomes that account's **default** configuration. The probe configuration was intended to be non-default; Stripe made it the default and refuses to deactivate it. See `EFFECT_CAPSULE.md`.

Not covered in the browser: adding or deleting a payment method, and opening an invoice PDF (controls seen, not exercised). Candidate A in the hosted portal was not tested.

Cleanup is complete; receipts are in `EFFECT_CAPSULE.md`.

## 2. Test identities

All four addresses were absent from Auth. Four identities created (the ceiling), by three different routes to learn their behaviour:

| Label | Route | Result |
|---|---|---|
| OWNER_1 | admin create, pre-confirmed | created; trigger gave platform role `member` and a profile; no membership |
| STORE_ADMIN | admin create, pre-confirmed | same |
| OWNER_2 | admin `generateLink` type `magiclink` for an address with no identity | **created a user** and returned a `signup`-type link, despite sign-up being disabled; the link redeemed into a session |
| MEMBER | admin `generateLink` type `invite` | created a user and returned an `invite`-type link; redeemed into a session |

Platform role rows went from 12 to 16. No role, password, account, store or membership was written by the probe. No email was sent by any of these calls.

**Finding F-A1:** the admin link generator is not safe to call with an address that may not exist. It creates the user. The sign-up switch does not stop it.

## 3. Handoff session primitive (existing user, sign-up disabled)

| Check | Result |
|---|---|
| `generateLink(magiclink)` then server-side `verifyOtp(token_hash)` | real session; subject equals the intended user; `aal1`, method `otp`, role `authenticated` |
| Same token a second time | refused (`otp_expired`) |
| `verifyOtp` type `email` instead of `magiclink` | also works |
| Earlier session of the same user after later exchanges | still valid |
| Email sent by the exchange | none |
| Access-token lifetime | 3600 seconds |

## 3a. Rapid sequential exchanges, both directions (12 November, OWNER_2)

Prototype only: a script alternated two `@supabase/ssr` server clients with separate cookie jars and the proposed cookie names. No app route, no handoff code table, no browser and no server took part. Each exchange loaded the user by ID first, checked that the link's user and the session's user equal the subject, and sent no email. `results/auth_p7_result.json`.

| Step | Destination jar | Result | Time |
|---|---|---|---|
| 1 OwedBook sign-in (stands for the source session) | `cyph-ob-auth-local` | session for the subject | 1.16 s |
| 2 OwedBook → Payment Portal | `cyph-pp-auth-local` (empty beforehand) | session for the subject | 1.14 s |
| 3 Payment Portal → OwedBook | `cyph-ob-auth-local` | session for the subject | 1.15 s |
| 4 OwedBook → Payment Portal again | `cyph-pp-auth-local` | session for the subject | 1.14 s |

All four finished inside 4.6 seconds, well within 60. No refusal and no throttle. Four distinct sessions; all four were still accepted by `getUser()` afterwards, so a later exchange does not end an earlier session. Each jar held only its own cookie.

Reading: back-to-back crossings by one user do not collide. The collision in §4 needs two link tokens to be outstanding at the same moment. What this does not show: the routes, the code table, state and verifier checks, restart and switch pages — none exists yet.

## 4. Link collisions — one live token per user

A stand-in admin-generated token plays the "outstanding emailed link" (both use the same single token slot on the user).

| Order | Result |
|---|---|
| Emailed link outstanding → handoff exchange → use the emailed link | handoff succeeds; **the earlier link is dead** (`otp_expired`) |
| Handoff token issued → new link issued → redeem the handoff token | **handoff token is dead**; the newer link works |
| Same token redeemed twice concurrently | exactly one session |
| Two tokens issued concurrently, both redeemed concurrently | exactly one succeeds |
| Another user's token churn | no effect |
| Real email outstanding (OWNER_1) → handoff exchange | exchange succeeded and consumed the token (provider record); the Director reports the emailed link fails — consistent with F-A2, but not conclusive because click time and error were not captured |

**Finding F-A2:** each new link for a user invalidates that user's previous unredeemed link, in both directions. A handoff therefore kills a pending emailed sign-in link, and requesting an emailed link kills an in-flight handoff. Two simultaneous handoffs for one user: one fails.

**Finding F-A3:** link generation starts the user's email throttle. The first emailed-link request for OWNER_1 was refused with HTTP 429 `over_email_send_rate_limit` because an admin link had been generated for that user less than a minute earlier. After waiting, it was accepted.

## 5. Cookie separation

Two `@supabase/ssr` 0.6.1 server clients sharing one cookie jar (as two localhost ports do):

| Setup | Result |
|---|---|
| Names `cyph-ob-auth-local` and `cyph-pp-auth-local` | second app starts with no session; after both sign in, two cookies, each app sees only its own user |
| Default names (today's code) | one cookie `sb-<ref>-auth-token`; the second app sees the first app's user |

## 6. Logout and residual (MEMBER, two sessions; STORE_ADMIN as control)

| After one provider-wide sign-out | Result |
|---|---|
| Sign-out call | succeeded in 322 ms |
| `getUser()` with the signed-out session's token | refused ("Auth session missing") |
| `getUser()` with the **other** session's unexpired token | refused |
| Refresh with the other session's refresh token | refused (`refresh_token_not_found`) |
| Data API read with the other session's unexpired token | **still HTTP 200 with the user's row**, at +0 s and at five polls up to +14 s |
| Remaining life of that token at sign-out | about 3600 s (it had just been issued) |
| Control user | unaffected |

**Finding F-A4:** `getUser()` is an effective liveness check on this project: it rejects every session of the user immediately after provider-wide sign-out. No separate `auth.sessions` helper is needed for page and route guards.

**Finding F-A5 (the accepted residual, now measured):** direct data-API calls keep working under RLS until the token expires — up to 3600 seconds. Observed for 14 seconds; the rest is computed from the token's expiry, not watched.

**Finding F-A6 (logout race):** a link token issued before the sign-out and redeemed after it still mints a new session. The provider does not cancel pending tokens on sign-out.

Not tested: Mission Control UI (no eligible identity there). Provider-level behaviour implies a staff member signed in to both would be signed out of both; the Mission Control app itself is untested.

## 7. Email

| Step | Result |
|---|---|
| Sign-in link request to OWNER_1 (first attempt) | refused 429, see F-A3; counted |
| Sign-in link request to OWNER_1 (after 75 s) | accepted by the provider at 03:28:04 UTC |
| Sign-in link request to STORE_ADMIN | accepted at 03:28:05 UTC |
| Requested redirect | `http://localhost:3000/api/auth/confirm` (whether the allowlist honours it is visible only in the email) |
| Delivered | **PASS** — both arrived (Director observation) |
| Sender | Supabase default mailer, `mail.app.supabase.io`; proposed `cyberizedev.com` sender **NOT VERIFIED** |
| Link behaviour, first two emails (default template) | **UNRESOLVED** — both reported failing; error and redirect not captured |
| After the Director's settings update (Resend SMTP, allowlist, subject) | 12:43 send to OWNER_1 delivered from `no-reply@cyberizedev.com`, "Cyber Pharma": proposed sender **VERIFIED in use** (Director observation; headers not inspected) |
| After the Director's revised template (`token_hash`, `type=email`) | 14:27 send to OWNER_1: **OwedBook emailed sign-in PASS** — browser observation plus provider record (token consumed; one `otp` session for OWNER_1 minted by the app server; no account or store membership) |
| F-A7 | The 12:43 link was redeemed at 13:38 by a Windows browser agent that Engineering did not dispatch; person or mail scanner unresolved |
| Not proved | Payment Portal emailed login, handoff, provisioning, the template's no-link branch, link expiry |

Provider acceptance is not delivery. Detail and timeline: `EMAIL_OBSERVATIONS.md`.

## 8. Not run

Link request for a non-existent address (would dispatch to a non-cast recipient). Payment Portal emailed login. Any implemented handoff (none exists). Mission Control. Card removal and renewal failure in Stripe. The SQL reads listed here in the first return were completed on 12 November (`DB_CHECK_RESULTS.md`), and the Director walked OwedBook by emailed link (`EMAIL_OBSERVATIONS.md`).
