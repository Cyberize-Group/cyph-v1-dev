# E2 run apbm007a_e2_r01 — progress ledger

Engineering working record, updated at each hand-back point. Factual status only; not a QA result. Order follows `E2_EXECUTION_INSTRUCTIONS.md`.

| # | Work package | Status | Evidence |
|---|---|---|---|
| 0 | Release recorded; grouped local preflight | DONE 12 Nov 16:40 — PASS, no blocker | `preflight_result.json` |
| 1 | Codebase mapping of both repos (read-only) | DONE 12 Nov | two mapping reports, summarised in the journal |
| 2 | Migrations `0053`–`0060`, tooling evidence-path extension, seed update, harness expectation changes, new `scripts/rls-harness/apbm007a-proof.mjs` | DONE 12 Nov (OwedBook working tree, uncommitted) | `supabase/migrations/0053…0060`; `scripts/` changes listed below |
| 3 | SCRATCH rehearsal: fresh, forward recovery, and upgrade cycles; grants/RLS/definer/concurrency negatives | DONE 12 Nov — all PASS. 329 real-user checks and 82 database checks in each cycle; preservation comparison clean | `scratch-fresh-1/`, `scratch-upgrade-1/` |
| 4 | Portal server: registration, quote, consent, checkout, catalogue script, APA allowlist, webhook ledger, provisioning saga, reconciliation | IN PROGRESS — server modules and API routes written and typechecking (12 Nov evening). Catalogue script written and applied (see Stripe objects below); 38 server unit tests pass; boundary test updated; full portal suite 286/286. Outstanding: operator reconcile command, lint fix | Payment Portal `src/server/*`, `src/app/api/{registration,webhooks,billing}/*`, `src/lib/appIdentity.ts` |
| 5 | Auth in both apps: per-app cookie names, confirm page (GET shows, POST verifies), sign-in link request and resend, handoff routes, switch and recovery pages, provider-wide logout, password login preserved | SERVER SIDE DONE in both apps (12 Nov night): identical `src/server/{handoff,emailLink}.ts`, routes `api/handoff/{start,authorize,callback,switch}`, `api/auth/{confirm,link,logout}`, auth pages, link-request form on both logins. 44 route tests pass in each app (identical test file). Suites: Payment Portal 332/332, OwedBook 245/245 (mock mode); both typecheck. Outstanding: portal customer sign-in rule and login `next=continue` (with work package 6); browser proof (work package 10) | both repos `src/__tests__/apbm007a-auth.test.ts` |
| 6 | Portal UI wired to real operations; reviewer harness and Stripe stand-in removed from customer routes; owner billing area, portal session, cancel and undo | DONE in code (12 Nov night), browser proof pending work package 10. Routes `/register/{plan,owner,pharmacy,review,activation}`, `/dashboard`, `/billing`; every `/demo` route, the stand-in and the reviewer controls removed; any authenticated user may enter; one client API module. Built by a parallel agent under a written brief and reviewed by me; three review fixes applied (stale-operation trap in checkout, unused shell prop, duplicate field label) | `checks/CHECK_RESULTS.md`, `checks/portal_changed_paths.txt` |
| 7 | Lifecycle: grace clock, read-only enforcement hook, synthetic-subscription fence, banners | DONE for the database and OwedBook (12 Nov): grace and access state in SQL (proved on SCRATCH); OwedBook `src/server/accessState.ts`, `/api/access-state`, `AccessBanner`, owner-only billing screen with a portal link; hook proved by a labelled contract test (007A has no customer write). Portal banners are part of work package 6 | OwedBook `src/__tests__/apbm007a-access.test.tsx` |
| 8 | Operator tooling: reconciliation command, DEV sample-claims loader (D-04) | DONE (12 Nov): OwedBook `scripts/seed/sample-claims.mjs` (`npm run seed:sample-claims`), rehearsed on SCRATCH — seven refusals, dry run, load of 50, repeat is a no-op, 250 baseline unchanged; portal `scripts/operator-reconcile.mjs` with `/api/operator/operations` (derived token, exact operation ID only). The reconcile command is unexercised until the portal runs | `scratch-upgrade-1/sample-claims-*.json` |
| 9 | `APPLY_CHECKPOINT` action bundle and DEV apply | **DONE — APPLIED to DEV 12 Nov 18:52** under the Director's explicit delegation. Eight files committed, ledger 60 equal to the manifest; preservation clean; grants, policies, trigger verified; 24 authenticated checks pass. Restore NOT PROVEN (option B, accepted) | `EVIDENCE/apply/dev-0053-0060/APPLY_BUNDLE.md` §8 and receipts |
| 10 | Integrated proof | DONE. 12 Nov: main journey, handoff both directions, billing, denials, switch, logout PASS; B4 webhook FAIL (secret setting). **13 Nov: B4 CLOSED** — two signed events processed, mirror followed, subscription left active; third defect (undo idempotency key) found and fixed. NOT RUN cases unchanged (brand-new owner gap etc.) | `integrated/INTEGRATED_PROOF.md` |
| 11 | Maintained checks in both apps, bundle scan, engineering handoff, indexed E2 ZIP | DONE: rerun after the fixes (OwedBook 276, portal 389 tests; lint 0 errors; builds and bundle scan clean); `ENGINEERING_HANDOFF.md`; E2 ZIP in `QAM/HANDOFFS/` | `ENGINEERING_HANDOFF.md` |

## Carried observations (none blocking)

- Payment Portal `NEXT_PUBLIC_SITE_URL` is the `:3000` address; it must be `http://localhost:3001` before the integrated proof (Director setting).
- OwedBook `.env.local` holds legacy `STRIPE_*` values. The frozen design never reads Stripe configuration in OwedBook; they should be removed before the integrated proof (Director setting).
- Portal names `STRIPE_PRICE_STORES`, `STRIPE_PORTAL_CONFIGURATION`, `STRIPE_EXPECTED_ACCOUNT` do not exist yet; the catalogue step produces the values for the Director to place.

## Work package 2–3 detail (12 November)

Migrations written (OwedBook, not committed — Git is the Director's): `0053_privilege_hardening`, `0054_store_identifiers`, `0055_billing_mirror`, `0056_registration`, `0057_operations_events`, `0058_provisioning`, `0059_handoff_codes`, `0060_billing_reads`. Each ends with a catalogue assertion.

Tooling changed in `scripts/`: `rls-harness/lib/env.mjs` (three 007A evidence lanes added), `apply-forward.mjs` (SCRATCH reset now also drops the `handoff` schema), `rls-harness/expectations.json` and `seed.mjs`, `seed/run.mjs` (marks its subscriptions synthetic when the column exists), `rls-harness/audit-catalog.mjs` (pins 23 tables / 14 policies / 36 functions / 17 audit triggers), `rls-harness/audit-session.mjs` (owner-only billing, plus the RA-3 checks), `dev-verify.mjs`, `db-verify.mjs`. New: `rls-harness/apbm007a-proof.mjs`.

Intentional expectation changes (RA-3), not regressions: customer UPDATE on `businesses` denied; `subscriptions` SELECT owner-only; `admin_billing_status` owner-only; `admin_stores` omits `subscription_status` for non-owners.

Rehearsal results:

| Cycle | What ran | Result |
|---|---|---|
| Fresh 1 | Reset, replay `0001`–`0060` | Replay PASS. The catalogue step then failed on a pin I had mis-edited (my error, fixed) |
| Recovery | Second replay stopped at `0059` with 42P06: the reset did not drop the `handoff` schema left by the first replay. Runner stopped cleanly with 58 committed. Reset fixed; leftover schema dropped on SCRATCH; forward `apply` resumed `0059`–`0060` | PASS — a real partial-failure and forward-resume proof |
| Fresh 1 (completed) | Seed, catalogue, seed verify with attack, session proof, structural check, 007A proof | All PASS: 329 + 82 checks |
| Upgrade 1 | Reset to `0052`, seed as on DEV, snapshot, forward `apply` `0053`–`0060`, snapshot, all proofs | All PASS: 329 + 82 checks. 16 pre-007A tables byte-identical before and after; same Auth user set; all 43 old indexes kept, 18 added; 3 audit rows added (the three fixture subscriptions marked synthetic) |

Proved on SCRATCH among the 82: a wrong verifier, state, audience or environment leaves the code claimable; six concurrent claims give one winner; logout before claim and after claim; per-session sign-out leaves the user's other session valid (FC-2 primitive available); NPI race gives one holder; a bound reservation is never freed by time; a paid operation never frees; provisioning is exactly-once under three concurrent calls; grace does not restart on retries and a late failure does not reopen it; an ended subscription is not revived. Seed content hash is identical whether the migration or the seed marks the fixtures.

Not yet done from the acceptance list for the database: backup and restore rehearsal for the apply checkpoint (work package 9).

## Work package 4 detail (in progress)

Payment Portal files written so far (uncommitted):

| File | Purpose |
|---|---|
| `src/lib/appIdentity.ts` | App ID, frozen origin table, per-app cookie names, exact return-path allowlist |
| `src/utils/supabase/{server,client,middleware}.ts` | Per-app cookie name; server factory moved to `getAll`/`setAll` |
| `src/services/portal/npi.ts` | Shared NPI rule (ten digits, check digit) |
| `src/server/errors.ts`, `db.ts`, `http.ts` | Public error map, service-role access point, same-origin check, limiter, registration cookie |
| `src/server/stripeClient.ts`, `pricing.ts`, `stripeMirror.ts` | Test-mode client pinned to `2026-04-22.dahlia`, 10 s timeout, no auto-retry; server quote and APA allowlist; mirror mapping |
| `src/server/registration.ts`, `checkout.ts`, `registrationStatus.ts` | Draft ownership, validation, NPI hold, quote; durable checkout operation with stable idempotency keys; honest status |
| `src/server/provisioning.ts`, `webhook.ts`, `billing.ts` | Saga with lease and exactly-once database step; signature → ledger → retrieve → apply; owner billing, portal session with mandatory configuration, undo |
| `src/app/api/registration/{draft,quote,checkout,status}`, `api/webhooks/stripe`, `api/billing/{overview,portal,undo-cancel}` | Routes |

Design decisions made while building, for the handoff:

- **Existing identity, signed out at purchase:** the paid operation waits in `attention / owner_signin_required`; the sign-in email lands in the portal; signing in attaches the registration (`resumeForUser`). No second account.
- **Signed-in purchaser:** no tokened email; the notification row is recorded as an in-app notice.
- **Amendment candidate (one item, for the Director):** the frozen configuration gives the apps no way to send a free-form email. Access links go through the Auth mailer. A separate renewal-reminder email and a plain purchase notice cannot be sent without a mail-sending credential that is not in the frozen environment list. Built now: the reminder as an in-app banner plus a notification record. Safe continuation; decision needed only on whether to add a mail credential.
- **Rate limits** are per server instance (no shared store in the frozen design).

## Stripe sandbox objects created by `scripts/stripe-catalogue.mjs --apply` (12 November)

| Object | ID |
|---|---|
| Product | `prod_VcAAzWhyLzhrDD` |
| Price (graduated 9900 / 4900, lookup key `owedbook_stores_v1`) | `price_1UavqdGnEQDyu3RRcj32U2Ob` |
| Portal configuration (not the account default) | `bpc_1UavqeGnEQDyu3RR7ndiVXwt` |
| Coupon (sandbox fixture, 10% once) | `zJilviUO` |
| Promotion code `APA10SANDBOX` | `promo_1UavqfGnEQDyu3RRZMN3whuY` |

A second `--apply` run created nothing. **Director setting needed before the integrated proof** — add to the Payment Portal `.env.local`: `STRIPE_EXPECTED_ACCOUNT=acct_1RxzixGnEQDyu3RR`, `STRIPE_PRICE_STORES=price_1UavqdGnEQDyu3RRcj32U2Ob`, `STRIPE_PORTAL_CONFIGURATION=bpc_1UavqeGnEQDyu3RR7ndiVXwt`, `APA_PROMOTION_CODES=APA10SANDBOX`, `ALLOW_SYNTHETIC_SUBSCRIPTIONS=true`, `NEXT_PUBLIC_APP_ENV=local`, and set `NEXT_PUBLIC_SITE_URL=http://localhost:3001`. OwedBook `.env.local`: `NEXT_PUBLIC_APP_ENV=local`, `ALLOW_SYNTHETIC_SUBSCRIPTIONS=true`; remove the legacy `STRIPE_*` lines. `STRIPE_WEBHOOK_SECRET` must be the local listener's secret.

## Incident to report to the Director (12 November, night) — unintended email requests on SCRATCH

While running a new integration test of the portal server code against SCRATCH, the test's mail stub did not intercept the call. **Six sign-in link requests were accepted by the SCRATCH project's mailer**, addressed to reserved `…@example.invalid` addresses created by the test. Those addresses cannot receive mail and belong to nobody; no approved inbox, no real person and no DEV object was involved. It is still outside the capsule's rule that email goes only to the approved inbox aliases, so it is reported rather than waved through.

- Cause: the stub patched a class that was not the one in use. My error.
- Fix: the portal's access-email call now lives in one module (`src/server/accessEmail.ts`), and the test replaces that module. The test was not rerun.
- Result of the last full run before the fix: 14 of 15 integration checks passed against the real SCRATCH database; the fifteenth was the stub assertion itself.
- Counted: emails 6 of 24.

## Allowance position — ruled

Director ruling, 12 November: the 12 SCRATCH identities count against the 12-identity ceiling; no extension is approved; none is to be deleted. No further identity is created anywhere. The SCRATCH integration test is therefore not rerun (it creates identities). The email-stub proof (`apbm007a-mail-guard.test.ts`) is accepted as engineering evidence.

## E2 effect ledger

Counters file: `effect_counters.json`, updated after the DEV apply (sessions 45 of 100, sign-outs 21 of 30; DEV: the one authorised apply, no identity, no email). Work lane moved by the Director to `/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/`. Earlier position: SCRATCH reset cycles 3 of 4 (the fourth is unused); Auth identities 12 of 12 (all SCRATCH); session attempts about 42 of 100; sign-outs 18 of 30; emails 6 of 24 (the incident); Stripe reads 12, mutations 5; DEV writes 0; restore NOT PROVEN (accepted).
