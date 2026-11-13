# Engineering handoff — APBM007A v1.0, E2 run apbm007a_e2_r01

Engineering factual return, 12 November 2026 (Asia/Dhaka). Engineering seat: Claudy. **Not an independent QA result and not a Gate Q claim.** Independent Q1/Q2 remain unreleased; nothing here prefills a QA verdict.

## 1. Outcome

The v1.0 scope is implemented across both repositories and self-verified; migrations `0053`–`0060` are applied to DEV; the integrated proof passed the main paid journey, both handoff directions, owner billing with cancel and undo, permission denials and provider-wide logout. The one FAIL of 12 November (live signed-webhook delivery, caused by the portal's webhook secret setting) was **closed on 13 November**: after the Director corrected the setting, a cancel in the hosted portal and an undo in the app on the existing subscription produced two signed events, both processed, with the mirror following. That closure also exposed and fixed a third defect (the undo's idempotency key). Several cases are **NOT RUN**, most importantly the brand-new owner, which no existing identity can prove. Details: `integrated/INTEGRATED_PROOF.md`.

## 2. Source identities — candidates are UNCOMMITTED

| Repo | Path | Branch | Base commit | Candidate commit |
|---|---|---|---|---|
| OwedBook | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` | `apbm-007a` | `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` | **pending the Director's commit** |
| Payment Portal | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | `apbm-007a` | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` | **pending the Director's commit** |

Changed-path manifests (`git status --short --untracked-files=all`, operating records under `agent_docs/` excluded): `checks/owedbook_changed_paths.txt` (58 paths), `checks/portal_changed_paths.txt` (132 paths, including 20 deletions of the FFM demo routes and reviewer controls). The portal's `package.json`, `package-lock.json` and new `eslint.config.mjs` change deliberately (ESLint dev dependencies). Installed module: v1.0 pack, index SHA-256 recorded in `APBM_STATE.md`.

## 3. Database

| Target | State |
|---|---|
| DEV `yrsuwikjnbmvpznrgydb` | `0053`–`0060` applied 12 Nov 12:52 UTC under the Director's delegation; ledger 60, equal to the manifest. Receipt and verification: `../../apply/dev-0053-0060/APPLY_BUNDLE.md` §8 |
| SCRATCH `ihgcsrypblqkwommrkgj` | Fresh replay, forward resume and upgrade rehearsals PASS; left at `0060` with the APBM003 seed and labelled proof rows |
| Restore | NOT PROVEN; accepted by the Director (option B) |

## 4. Commands and results (latest run, after the two proof-time fixes)

| Check | OwedBook | Payment Portal |
|---|---|---|
| `npx tsc --noEmit` | clean | clean |
| `npx eslint .` | 0 errors, 33 warnings | 0 errors, 24 warnings |
| `npx jest` | 43 suites, 276 tests pass | 19 suites, 390 tests pass (13 Nov, after the undo-key fix) |
| `next build` in a disposable copy with placeholder settings | pass, 29 routes | pass, 34 routes |
| Client-bundle scan for canary secrets, secret names, server-only functions, Stripe API host | clean | clean |
| SCRATCH database proofs | 329 real-user checks, 82 database checks | portal server against SCRATCH: 14 of 15 (15th was a test-stub assertion, since replaced by the accepted mail-guard proof) |
| DEV post-apply authenticated smoke | 24 PASS | — |
| Integrated proof on DEV with both apps running | see §5 | see §5 |

Commands: OwedBook `npx tsc --noEmit && npx eslint . && npx jest`; portal the same. Builds: `checks/build_check.sh`. SCRATCH proofs: `npm run audit:prove` with the APBM SCRATCH environment, then `node scripts/rls-harness/apbm007a-proof.mjs`. Integrated proof: `integrated/harness/` scripts in order `a_register_pay`, `b_verify_handoff`, `d_denials_switch_billing` (they need both apps and the listener running).

## 5. Integrated proof summary

**PASS (live, DEV, browser plus database plus Stripe reads):** button-confirm sign-in with GET non-redeeming and replay refused; server quote, allowlisted APA code, consents; Stripe-hosted payment in USD; provisioning of exactly one account, store, designated admin, mapping and mirrored subscription; dashboard and live card display; handoff portal → OwedBook and OwedBook → portal, sequential within 60 s, `same_user` without a new session; different-user switch with deliberate POST; store-admin, member, unrelated-owner and anonymous denials including a cross-tenant read; synthetic fixture shown as test account and refused by the portal; hosted-portal cancel sets `cancel_at` and the app's undo clears it on the same subscription (closes E1 gap U4); provider-wide logout ends the session in both apps.

**FAIL (12 Nov, kept on record) → CLOSED (13 Nov):** B4 — signed webhook delivery. Cause on 12 Nov: the portal's `STRIPE_WEBHOOK_SECRET` was not the listener's; on 13 Nov the file still held the old value on a second line, which Next.js loads in preference; the Director removed it. Closure (H0–H10): signed `customer.subscription.updated` events for the cancel and for the undo, both `processed`, mirror set and then cleared, the banner's Undo working, subscription left active. Not redelivered on DEV: checkout-completion and invoice events.

**NOT RUN:** brand-new owner (**coverage gap**; no new identity authorised; OWNER_1 is an existing identity and proves only the existing-identity paths); existing identity signed out at purchase; declined card; renewal failure with a test clock; real sign-in email delivery and click in this run; only-card removal beyond an observation; data-API residual re-measurement; Mission Control; browser matrix beyond desktop Chromium.

## 6. Test and recipient cast (no secrets)

DEV: OWNER_1 (approved inbox identity) holds the one paid test account; the APBM003 seeded cast (`OWNER1`, `OWNER3`, `ADMIN_B2`, `ADMIN_B3`, `MEMBER_B1`, `MEMBER_B2B3`, `UNRELATED`) with their three synthetic subscriptions. Logins for the seeded cast are in the Director's private sheet. OWNER_2, STORE_ADMIN and MEMBER are unused by this run. No email was sent by the integrated proof.

## 7. Effects

`effect_counters.json` (reconciled). Highlights: Auth identities 12 of 12 (all SCRATCH, ceiling reached, none created on DEV); sessions about 64 of 100; sign-outs 23 of 30; emails 6 of 24 (the SCRATCH incident, none since); Stripe mutations 26 of 250; customers 6 of 12; Checkout sessions 6 of 12 (1 paid); subscriptions 1 of 12; portal sessions 2 of 24; sessions about 67 of 100; webhook events on DEV 2, both processed; test clocks 0 of 2.

## 8. Objects left in place

| Where | Object | Note |
|---|---|---|
| Stripe sandbox | Price `price_1UavqdGnEQDyu3RRcj32U2Ob`, product, portal configuration `bpc_1UavqeGnEQDyu3RR7ndiVXwt`, APA fixture `APA10SANDBOX` | The app's catalogue; keep |
| Stripe sandbox | One active subscription for OWNER_1 (renews monthly at $99; cancelled and restored once on 12 Nov and once on 13 Nov; left active with no schedule), 6 customers, 5 expired sessions | Keep for the Director's product walk; cancel after QA |
| DEV | OWNER_1's account and store `SYNTHETIC E2 STORE 9666`; five abandoned drafts (`expired_unpaid`); handoff codes; audit rows | Ordinary application rows |
| SCRATCH | Labelled proof rows and 12 harness identities | Ruling: count, do not delete |
| Private | DEV logical export under `/home/moose/.config/cyph/backups/` | Never packaged |

OWNER_1 was signed out everywhere by the logout check. No process owned by Engineering is running: the headless browsers closed with each script; the servers and listener are the Director's and were not touched. Both checkouts are released.

## 9. Known issues and decisions for the Director

1. ~~Webhook secret setting~~ — closed 13 Nov. Third defect found in the closure and fixed: the undo's idempotency key was derived from the schedule, so a second undo of the same period end within 24 hours was answered from Stripe's cache and changed nothing.
2. **Brand-new-owner coverage gap**; closing it on DEV needs one identity extension, or acceptance of the SCRATCH proof.
3. **Renewal failure with a test clock** needs a sandbox-only test-clock seam in checkout (not built) and a new checkout.
4. **Reminder email:** the frozen configuration has no free-form mail credential; reminders are an in-app banner plus a notification record (amendment candidate).
5. **Copy:** price-change consent sentence written during the build; Terms, Privacy and support address are placeholders.
6. **Portal Playwright specs** in `e2e/` target removed routes; the integrated harness here is not a maintained test suite.
7. **Dead code left in place:** the FFM mock engine, its services and unmounted views (listed in `PROGRESS.md`).
8. **Dev-server first compile:** the first request to a newly added route can reload the page while it compiles; seen once on the confirm page, gone once compiled. Not seen in production builds.

## 10. Where to start

`integrated/INTEGRATED_PROOF.md` → `checks/CHECK_RESULTS.md` → `../../apply/dev-0053-0060/APPLY_BUNDLE.md` → `PROGRESS.md` → `effect_counters.json`.

## 11. Carried into Q1 — everything not proven, incomplete or risky (13 November 2026)

Independent QA should treat each row as open. Nothing here is a QA verdict.

### NOT RUN in the integrated proof

| # | Case | State |
|---|---|---|
| N1 | Brand-new owner (address with no Auth identity) on DEV | Coverage gap. Proven only on SCRATCH; no identity authorised on DEV |
| N2 | Existing identity signed out at purchase → "sign in to finish" → attach | SCRATCH only |
| N3 | Declined card and other failed first payments on Checkout | Not run anywhere live |
| N4 | Renewal failure and the 7-day grace with real provider events | SQL on SCRATCH and webhook unit tests only; no test clock |
| N5 | Access email delivered by Resend and clicked through the button page | Not run in E2 (E1 proved delivery of the earlier template) |
| N6 | Removing the only card in the billing portal | Observed only: no delete offered on the overview page |
| N7 | `checkout.session.*` and `invoice.*` events delivered to DEV | Not redelivered; DEV provisioning came through the reconcile path; subscription-update events proven live on 13 Nov |
| N8 | Data-API residual after logout | E1 measurement only (up to 3,600 s) |
| N9 | Mission Control after provider-wide logout | Not run |
| N10 | Firefox, WebKit, 375 px layouts | Not run; desktop Chromium only |
| N11 | DEV sample-claims loader on DEV | Rehearsed on SCRATCH only; loading on DEV is separately held |
| N12 | Operator reconcile command against the running portal | Not exercised |
| N13 | Staging configuration (staging cookie names and origins, Site URL, redirect allowlist, template branches) | Not built or tested; staging is a later release |

### Incomplete implementation

| # | Item |
|---|---|
| I1 | Renewal reminder email: no free-form mail credential in the frozen configuration; implemented as an in-app banner plus a notification record only (amendment candidate) |
| I2 | No sandbox test-clock seam in checkout, so N4 cannot be run end to end |
| I3 | Portal Playwright specs in `e2e/` target removed routes; not rewritten |
| I4 | FFM mock engine, its services and unmounted views left in place as dead code |
| I5 | Copy: price-change consent sentence unapproved; Terms, Privacy and support address are placeholders |
| I6 | Rate limits are per server instance (no shared store) |
| I7 | Lint warnings remain (OwedBook 33, portal 24; 0 errors) |

### Q1 risks to challenge

| # | Risk |
|---|---|
| **R1** | **Supported webhook events with an unresolved mapping are recorded as `ignored` with `error_code = 'unmapped'` and answered 200** (`src/server/webhook.ts`, the `unmapped` branches). If an event arrives before its operation or subscription is mapped (for example `customer.subscription.created` or `invoice.paid` racing the reconcile path), Stripe is told it was handled and will not retry. Challenge the mapping race and the retry behaviour: whether such events should answer non-2xx, or be swept by the reconcile or operator path |
| R2 | Provisioning depends on either the webhook or the status page's reconcile; a purchaser who closes the browser before returning relies entirely on the webhook (and on R1) |
| R3 | The status page reconciles on every load (one Stripe read per load, rate-limited per instance) |
| R4 | Undo previously reused an idempotency key; fixed with a fresh key per undo. Challenge other Stripe calls for keys derived from recurring state (customer and session keys are per operation) |
| R5 | Dev-server first compile reloaded the confirm page once; not seen in builds. Recheck in a production start |
| R6 | Stripe account settings outside the code (for example Adaptive Pricing) can change the customer's experience; the app now disables Adaptive Pricing per session, but other account features were not audited |
| R7 | The handoff relies on `auth.sessions` reads inside definer functions; behaviour on other Supabase plan or version changes is untested |
