# Capability probe plan — E1 a01 (EXECUTED except hosted portal; see CAPABILITY_RESULTS.md)

Resume here once `ACTION_LIST.md` A1 is done. Helpers live in `/home/moose/NEXTJS/CYBER_PHARMA/APBM007A_E1_WORK/a01/helpers/`; nothing is written to either product repo. Every dispatched call increments a counter in `out/counters.json` before it is sent, and a helper refuses to send once a ceiling is reached. Stripe SDK runs with `maxNetworkRetries: 0` and a 30-second timeout. All new objects carry metadata `apbm007a_e1_a01`.

## P0 — Gates before any write

1. Inbox file: outside Git, mode 600, exactly `OWNER_1`, `OWNER_2`, `STORE_ADMIN`, `MEMBER`, four distinct addresses, no plus tag. Fail closed otherwise.
2. Re-assert Supabase project = DEV reference and Stripe account = `acct_1RxzixGnEQDyu3RR`, test key.
3. Re-read both repos' HEAD and status; stop on drift.
4. Look up each of the four addresses in Auth (admin lookup by exact address, no listing). An address that already has an identity with accounts, stores, memberships or a non-member role is held, not used.

## P1 — Stripe catalogue comparison (no inbox dependency in the data; gated only by instruction)

| Step | Calls |
|---|---|
| Candidate A: product "first store" + monthly USD 9900; product "additional store" + monthly USD 4900 | 4 creates |
| Candidate B: one product + one monthly USD graduated price, tier 1 `up_to=1` 9900, tier 2 `up_to=inf` 4900, licensed | 2 creates |
| One 10%-off once-only coupon and one promotion code, labelled `E1_ONLY` | 2 creates |
| Two test customers with a test card payment method; one subscription each (A: items 1+0 → start at N=1; B: quantity 1) | about 8 |
| Per candidate: invoice totals at N=1/2/3 via invoice preview (expect 9900/14800/19700); proration previews 1→2→3→2→1; apply quantity changes; coupon at N=1 and N=3; cancel at period end and undo by API | previews are reads; about 10 mutations each |
| Hosted portal: sessions per candidate with quantity/price/promotion updates disabled, end-of-period cancellation enabled (needs A2) | up to 12 sessions |
| Exit: cancel both subscriptions, archive prices/products, delete coupon, deactivate portal configurations; record surviving IDs | about 12 |

Budget: 3 products, 3 prices, 2 customers, 2 subscriptions, 1 coupon, 1 promotion code, at most 12 portal sessions, expected 60–75 of 100 mutations and under 120 of 200 reads. Pass rule for preferring B: correct three totals, clear invoice lines, correct proration both directions, coupon applies as expected, cancel/undo works, and the hosted portal offers no quantity change.

Limit to declare: hosted-portal behaviour is seen through session creation and configuration only. Clicking through the hosted page needs a browser; if that cannot be done headlessly without storing auth state, it is reported as untested and added to the operator check.

## P2 — Auth handoff primitive (needs A1)

1. Create only the absent identities among the four (at most 4), through the admin API with sign-up disabled, no password, no role change. Confirm the trigger gave each a `member` role row and profile.
2. For `OWNER_1`: `generateLink(magiclink)` then server-side `verifyOtp(token_hash)`; confirm a real session, subject equals the intended user, no email was sent, no new user appeared.
3. Negative: `generateLink` for an address with no identity must not create one.
4. Collision order 1: request an emailed sign-in link, then run a handoff exchange, then check whether the emailed link's token still verifies (using a second admin-generated token as the stand-in when the real email cannot be read; the real-email half goes to the operator check).
5. Collision order 2: handoff exchange first, then a newly issued link, then redeem it; then two concurrent exchanges for the same user.
6. Cookie separation: two `@supabase/ssr` server clients with `cookieOptions.name` `cyph-ob-auth-local` and `cyph-pp-auth-local` over one shared in-memory cookie jar; show the second starts empty and that neither overwrites the other; repeat with default names to show the collision.

Budget: at most 4 identities, expected 14–20 of 32 sessions.

## P3 — Logout and residual (needs A1; uses only the four test identities)

1. Hold two sessions for one identity (standing in for the two apps) and one for a second identity as a control.
2. Record `iat`/`exp` of the access token: this is the measured JWT lifetime.
3. Global `signOut` from session 1. Then, with session 2's still-unexpired token: `getUser()`, a refresh attempt, and one harmless RLS-scoped data-API GET. Record each result and the seconds of validity left.
4. Repeat the data-API GET at intervals up to the token's expiry or 10 polls, whichever is first; if the lifetime is longer than the polling window, report the remaining window as computed, not observed.
5. Control identity must be unaffected.
6. If A3 is available, read `auth.sessions` for the test identities before and after.

Budget: expected 3–4 of 8 signouts. Mission Control UI will not be exercised (no eligible identity there); provider-wide effect is shown at provider level and the Mission Control app check is labelled untested.

## P4 — Email (needs A1; depends on A4/G3 findings)

1. One sign-in link request to `OWNER_1` through the project's configured mailer. Record provider acceptance and any rate-limit or SMTP error.
2. One to `STORE_ADMIN` only if the first is accepted.
3. A request for an address with no identity, to observe the sign-up-disabled response (uses a non-cast address only if that can be done without a send; otherwise skipped and reported).
4. Hand Tony the grouped inbox check: which alias, expected sender, link target path.

Budget: expected 2–4 of 12 sends. If SMTP is not connected, no retries; the exact settings needed are listed instead.

## P5 — Exit

Reconcile every created ID against the counters, clean up Stripe objects as above, leave Auth identities in place (no deletion is authorized), remove helper-held tokens from memory and delete any transient state files, then write the final reports, contract freeze proposal, estimates and the indexed ZIP.
