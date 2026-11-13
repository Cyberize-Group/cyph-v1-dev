# Integrated engineering proof — E2 r01 (work package 10), reconciled

Engineering self-verification against shared DEV with the Director's running servers (OwedBook :3000, Payment Portal :3001, both `next dev`) and Stripe CLI listener. **Not a QA result.** Browser steps ran in headless Chromium (build 1194, already on the machine; Playwright from the portal's dev dependencies). Results files: `results/*.json` (scrubbed: no address, token, key or URL with a credential). Harness: `harness/`. Screenshots stayed in the private work lane because they show a private test address.

Identities: only existing DEV identities — OWNER_1 from the approved inbox file, and the seeded APBM003 cast (`ADMIN_B2`, `MEMBER_B1`, `UNRELATED`). Sign-in for the proof used admin-generated one-time tokens delivered through each app's own confirm-button route (no email, no password touched). **No identity was created.**

## Attempt log (12 November 2026, Asia/Dhaka)

| # | Time | What happened | Outcome |
|---|---|---|---|
| 1 | 19:15 | Preflight | **Stopped**: portal `NEXT_PUBLIC_SITE_URL` was the :3000 address; portal failed closed by design. Found and fixed: OwedBook handoff start route at the wrong path. Webhook negatives passed. Director corrected the URL and restarted the portal |
| 2 | 20:23 | Scenario A first run | Failed at the confirm page: the click did not reach the POST while the dev server compiled the new routes on first hit (repeated page loads observed). Diagnosed 20:30–20:32 with probes: two with a dummy or never-valid token (no token used) and three with real OWNER_1 tokens. The flow works once routes are compiled. No product change |
| 3 | 20:33 | Scenario A | Failed on the owner step: the script typed before the page hydrated. Harness fix only |
| 4 | 20:35 | Scenario A | Reached Stripe (session 1). **Product defect found:** Stripe's account-level Adaptive Pricing showed the price in BDT, which would not match the USD quote. **Fixed:** every Checkout session now sets `adaptive_pricing: { enabled: false }`, with a guard test. The script also left the ZIP empty and counted a payment that Stripe refused (counter reconciled). Session 1 abandoned through the app |
| 5 | 20:39 | Scenario A | Session 2, now in USD ($89.10). The script did not select the card option (harness). Abandoned through the app |
| 6 | ~20:41 | Inspection of the Stripe page markup | Session 3 opened through the app, no card entered. Abandoned |
| 7 | 20:42, 20:45 | Scenario A | Sessions 4 and 5: the card option still not clicked by the script (harness). Each abandoned |
| **8** | **20:47–20:49** | **Scenario A — SUCCESSFUL ATTEMPT** | Sign-in, registration, APA code, payment with sandbox card 4242 at $89.10 USD, provisioning. Session 6 is the only paid one. Results `results/a_register_pay.json`; facts in `results/b_verify_handoff.json` |
| 9 | 20:53 | Scenario B | Facts, dashboard, billing, handoff in both directions |
| 10 | 20:55–20:57 | Scenarios D–G | Denials, switch, billing portal, logout, all on the account from attempt 8. No new checkout |

Each abandonment is proof A0 (`results/a0_abandon.json` holds the last; all five passed): Stripe session expired first, operation `expired_unpaid`, NPI released.

Stripe objects created by the app during the proof: 6 customers, 6 Checkout sessions (1 paid, 5 expired unpaid), 1 subscription. None was created outside the app.

## PASS

| ID | Check | Evidence |
|---|---|---|
| W1 | Webhook with no signature, and with a forged signature: 400, nothing recorded | attempt 1 |
| A0 | Go back and edit an open checkout: Stripe session expired first, operation `expired_unpaid`, NPI reservation released (five times) | `a0_abandon.json` |
| A1–A2 | Emailed-link landing: GET redirects to a clean address and creates no session (overview 401 before the button) | `a_register_pay.json` |
| A3–A4 | Button POST signs in to the portal only (`cyph-pp-auth-local`, no OwedBook cookie); not yet an owner (403) | same |
| A5 | The same link pressed again in another browser: refused (`link-expired`) | same |
| A6–A8 | Server quote $99.00; non-allowlisted code refused with one generic message; `APA10SANDBOX` gives $89.10 | same |
| A9 | Checkout refused until all three consents are given | same |
| A10–A12 | Stripe returns to the status page; operation provisioned; signed-in purchaser sees completion with no sign-in email | same |
| B1 | One account owned by OWNER_1, one active store with the registered NPI (NCPDP left empty), OWNER_1 its designated admin; OWNER_1 owns exactly one account | `b_verify_handoff.json` |
| B2 | Mirror: origin `stripe`, active, quantity 1, `APA10SANDBOX`, the configured price, customer mapping present | same |
| B3 | Platform role stays `member`; reservation `consumed`; purchase recorded as an in-app notice, no email | same |
| B5 | Stripe agrees: subscription active, first invoice paid 8,910 USD cents, one item at quantity 1 | same |
| B6–B7 | Portal dashboard shows plan and store; billing shows Visa •••• 4242 read live | same |
| B8–B11 | Portal → OwedBook handoff: OwedBook session minted under its own cookie, no code in the final address, store visible (empty claims), access state active and owner | same |
| B12 | OwedBook → portal with the same user on both sides: no session minted (`same_user`) | same |
| B13, B16 | Sequential crossings in both directions inside 60 seconds (57 s and 16 s) | same |
| B14–B15 | Fresh browser: OwedBook button sign-in, then OwedBook → portal handoff mints the portal session and lands on billing as owner | same |
| B17 | Handoff code rows are hash-only and all completed | same |
| D1–D4 | Seeded store admin: portal billing view says owner-only; overview, portal session and undo refused (403); OwedBook billing screen owner-only after a handoff; cannot read the new store's access state (403) | `d_denials_switch_billing.json` |
| D5–D7 | Unrelated owner sees only their own synthetic account; "test account — no billing"; portal refused 409 `not_billable` | same |
| D9–D10 | Member: overview refused; cross-origin POSTs refused | same |
| D11–D12 | Anonymous: overview 401, billing page goes to sign-in; protocol-relative return path refused | same |
| E1–E2 | OwedBook signed in as another user: switch page, nothing replaced; the deliberate POST signs OwedBook out locally and hands over as OWNER_1 | same |
| F1 | Stripe billing portal opened with the app's configuration: cancel offered, no plan or quantity change | same |
| F3 | Hosted-portal cancellation sets `cancel_at` on the same subscription, flag false (F-S1 confirmed) | same |
| F4–F6 | Undo through the app clears the portal-set `cancel_at` on the same subscription (**closes E1 gap U4**); mirror agrees; no new subscription | same |
| G1–G2 | Portal logout is provider-wide: OwedBook in the same browser loses its session, the portal refuses, OWNER_1 has 0 sessions; no open handoff code remains | same |

D8 passed only weakly (that browser had no OwedBook session); D4 is the real cross-tenant check.

## FAIL

| ID | Check | Cause | Effect |
|---|---|---|---|
| **B4** | Signed webhook events reach the portal and are processed | **Setting:** the portal's `STRIPE_WEBHOOK_SECRET` is not the running listener's secret (compared for equality only; values not shown). Every delivery was refused with 400, so `stripe_events` is empty. Provisioning in attempt 8 came from the status page's reconcile path, which reads Stripe directly | The live signed-webhook leg is **not proven on DEV**. Signature verification, ledger, idempotency and retry behaviour are proven by unit tests with the real Stripe library and by the SCRATCH integration run. The cancel event in F3 was likewise refused, which is why undo was exercised through the API rather than from the banner |

## NOT RUN

| Case | Why |
|---|---|
| **Brand-new owner (an address with no Auth identity)** | **Coverage gap, not passed.** All approved inboxes already have identities on DEV and no new identity is authorised. OWNER_1's existing identity proves only the existing-identity paths. Proven on SCRATCH (identity created by provisioning) before the ceiling was reached |
| Existing identity signed out at purchase → "sign in to finish" → attach | Needs a second checkout, not authorised in this run. Proven on SCRATCH |
| Declined card on Checkout | Needs a new checkout. Not run |
| Renewal failure and grace with a Stripe test clock | No test-clock seam in the checkout path, and no new checkout authorised. Grace start, non-reset on retries, clearing and the day-7 read-only switch are proven in SQL on SCRATCH and by the webhook unit tests |
| Sign-in email delivered and clicked (Resend → inbox → button) | No email sent in this run. E1 proved delivery and the GET-redeeming flow; the button flow here was driven by admin-generated tokens |
| Only-card removal (RA-6) | Observed only: the portal overview offered no delete for the only card. The payment-method screen was not opened |
| Logout timing against the direct data API (F-A5 residual) | Not re-measured; E1 measurement stands |
| Mission Control | Out of the apps under test |
| Browser matrix (Firefox, WebKit, 375 px) | Chromium desktop only |

## Defects found and fixed during the proof

1. OwedBook handoff start route at the wrong path (fixed; agreement test).
2. Checkout sessions offered a converted local currency through Stripe's Adaptive Pricing (fixed: disabled per session; guard test).

## Needed to finish the webhook leg

Put the value shown by `stripe listen --print-secret` into the portal's `STRIPE_WEBHOOK_SECRET` and restart the portal. Then one portal-side action that produces an event, for example a cancel and undo in the billing portal on the existing subscription, proves delivery, ledger and mirror without a new checkout.

## B4 closure attempt 1 — 13 November 2026, 10:10 Asia/Dhaka — STOPPED AT CONFIGURATION CHECK

Before any Stripe action, the runtime configuration was checked (values never shown; equality and length only):

| Check | Result |
|---|---|
| Portal restarted | yes, 10:06 |
| Listener running, forwarding to `localhost:3001/api/webhooks/stripe` | yes; CLI profile is the Cyber Pharma sandbox account |
| `stripe listen --print-secret` equals a `STRIPE_WEBHOOK_SECRET` line in the portal `.env.local` | **yes, line 12** (quoted) |
| Number of `STRIPE_WEBHOOK_SECRET` lines in that file | **2: line 12 (new, correct) and line 39 (the old value)** |
| Value the portal actually loads (Next.js environment loader, which keeps the last definition) | **the old value from line 39; does not equal the listener secret** |
| Unsigned webhook still refused | yes, 400 |

So the portal at runtime still holds the old secret, and every signed delivery would still be refused. No cancellation or undo was attempted; no Stripe object or DEV row changed. **Needed:** delete line 39 (the older `STRIPE_WEBHOOK_SECRET`) so only the listener's value remains, then restart the portal.

## B4 closure — 13 November 2026, 10:13–10:21 Asia/Dhaka — **CLOSED (PASS)**; the earlier FAIL is kept above

Preconditions, checked after the Director removed the duplicate line and restarted the portal (10:13): one `STRIPE_WEBHOOK_SECRET` line; the value Next.js loads equals `stripe listen --print-secret`; listener running. Account: OWNER_1's existing paid subscription from attempt 8. **No checkout, no payment, no identity.** Results: `results/h_webhook_cancel_undo.json`, `results/h2_undo_banner.json`.

| ID | Check | Result |
|---|---|---|
| H0 | Starting point: subscription active, no schedule | PASS |
| H1 | Cancel in the hosted billing portal schedules `cancel_at` on the same subscription | PASS |
| **H2** | **Signed `customer.subscription.updated` delivered by the listener, verified, recorded and processed** | **PASS** (ledger row 04:15:41 UTC, status `processed`) |
| **H3** | **Mirror updated by the webhook: `cancel_at` set, flag false, active, newer verification time** | **PASS** |
| H4 | The app's billing page shows the scheduled end and an Undo button, from the webhook-updated mirror | PASS |
| H5 (first two tries) | Undo from the banner | **FAIL → defect found:** the app answered 502. The undo's idempotency key was derived from the subscription and its `cancel_at`. Yesterday's undo (F4) had cleared the same `cancel_at`, so Stripe replayed that cached answer for today's call and changed nothing; the app's re-read then correctly refused to claim success. **Fixed:** a fresh key per undo (clearing is harmless to repeat), with a unit test. The running dev server picked up the change |
| H5a, H5 | Undo from the banner after the fix: app answers 200, Stripe shows neither field set, same subscription, active | PASS |
| **H6** | **Second signed event from the undo, recorded and processed** | **PASS** (04:20:55 UTC) |
| H7–H8 | Mirror ends clear and active; the billing page no longer shows a cancellation | PASS |
| H9, H10 | No event failed or stayed unprocessed; still exactly one subscription, active, nothing charged | PASS |

The DEV webhook ledger now holds exactly these two events, both `processed`, `attempts` 0. **The subscription is left active with no cancellation scheduled.**

What this does and does not add: the live signed-webhook leg (signature, durable receipt, retrieve-then-apply, mirror) is now proven on DEV for subscription updates. Checkout-completion and invoice events were not redelivered; provisioning on DEV was proven through the reconcile path (attempt 8), and through webhooks on SCRATCH and in unit tests.
