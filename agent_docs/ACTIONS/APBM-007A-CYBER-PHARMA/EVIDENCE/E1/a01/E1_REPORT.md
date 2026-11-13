# E1 report — APBM007A v0.2 R1, attempt a01 — final consolidated return

Dates: 11–12 November 2026, Asia/Dhaka. Engineering seat: Claudy. Authority: `E1_DIRECTOR_RELEASE.md` under `E1_RELEASE_REQUEST.md`, plus the Director's dated continuation instructions of 12 November.

**Status: E1 EVIDENCE RETURNED FOR THE POST-E1 REVIEW.** The authorized investigation and capability proofs are complete. The proposed design is complete as a proposal: nothing is frozen, built or applied. E2, DEV apply, sample loading and deployment remain held. No commit, push, deploy, branch switch, product-source edit, migration, database write by Engineering, or settings change was made.

Read order: this file → `CAPABILITY_RESULTS.md` → `HANDOFF_CONTRACT_PROPOSAL.md` → `REVIEW_AMENDMENTS.md` → `CONTRACT_DELTA.md` → `MIGRATION_PLAN.md` → `EMAIL_OBSERVATIONS.md` → `DB_CHECK_RESULTS.md` → `SCRATCH_IDENTITY.md` → `ENVIRONMENT_IDENTITY.md` → `BASELINE_RESULTS.md` → `EFFECT_CAPSULE.md` → `PREFLIGHT_LEDGER.md` → `ACTION_LIST.md`.

## 1. Proven

"Prototype" means a script exercised the provider or Stripe directly. No product code was changed, so nothing here is an implemented feature.

| # | Result | Kind | Where |
|---|---|---|---|
| 1 | Both checkouts on `main` at the expected revisions; existing changes recorded and untouched | Inspection | `ENVIRONMENT_IDENTITY.md` §1 |
| 2 | Both apps use the same Supabase project, the one the tooling names DEV | Inspection | §2 |
| 3 | Portal Stripe key and Stripe CLI are the same test sandbox, `acct_1RxzixGnEQDyu3RR` | Inspection | §3 |
| 4 | Baselines: both apps install, typecheck and build; portal tests 248/248; OwedBook 201/201 in mock mode | Local run in disposable copies | `BASELINE_RESULTS.md` |
| 5 | Portal source equals the certified FFM inputs; the lock change is a local reinstall | Inspection | same §4–5 |
| 6 | Both catalogue shapes give 9900 / 14800 / 19700, identical prorations and coupon results, cancel and undo by API | Prototype (Stripe sandbox) | `CAPABILITY_RESULTS.md` §1 |
| 7 | Candidate B in the hosted portal: cancel at period end and undo work; no quantity, plan or promotion control at one or three stores | Browser + API | §1a |
| 8 | Session exchange for an existing user (`generateLink` + `verifyOtp`), sign-up disabled, no email, single use, correct subject | Prototype | §3 |
| 9 | Four exchanges for one user in 4.6 seconds, alternating two separate per-app cookie jars: no refusal, no throttle, earlier sessions stay valid | Prototype | §3a |
| 10 | Distinct cookie names isolate the two apps on one host; default names do not | Prototype | §5 |
| 11 | After provider-wide sign-out, `getUser()` rejects every session of that user at once; other users unaffected | Prototype | §6 |
| 12 | Access-token lifetime 3600 seconds; the data API accepts an unexpired token after sign-out | Prototype | §6 |
| 13 | New identities get platform role `member` and a profile from the trigger, nothing more | Prototype + SQL read | §2 |
| 14 | DEV ledger: 52 rows, names and checksums equal to source; trigger equal to `0049`; grants, policies and default privileges recorded | Read-only SQL | `DB_CHECK_RESULTS.md` |
| 15 | SCRATCH: recorded reference, distinct cluster from DEV, session pooler, all four variables present, ledger 52/52 equal to source | Read-only SQL | `SCRATCH_IDENTITY.md` |
| 16 | Sign-in email delivered through Resend from `no-reply@cyberizedev.com` | Director observation | `EMAIL_OBSERVATIONS.md` |
| 17 | OwedBook emailed sign-in on localhost with the Director's revised template: OwedBook opened as OWNER_1; provider shows the token consumed and one session minted by the app's confirm route | Director browser observation + read-only SQL | same |

## 2. Findings that shape the design

| ID | Finding | Design response |
|---|---|---|
| F-A1 | Link generation creates a user for an unknown address even with sign-up disabled | Load the user by ID first; provisioning uses the explicit create call |
| F-A2 | One live link token per user; overlapping exchanges collide | One automatic restart, then a recovery page — **review decision** |
| F-A3 | Link generation starts the user's email throttle | "Try again in a minute" state |
| F-A4 | `getUser()` is a sufficient liveness check | No extra liveness helper; no wider OwedBook server-key use than D-01 |
| F-A5 | Direct data-API residual up to 3600 seconds | Stated under D-02; 900 seconds proposed as a separate later decision |
| F-A6 | A token issued before sign-out still mints a session after it | `handoff_invalidate_user` plus `handoff_complete` after the mint |
| F-A7 | An emailed link was redeemed by a Windows browser agent Engineering did not dispatch, 55 minutes after sending; cause unknown | Decide whether the confirm step needs a button page so that opening a link alone does not sign in |
| F-D1 | A store admin can update any column of their store through the data API today | Hardening migration removes the policy and the grant (RA-3) |
| F-D2/3 | TRUNCATE and other residual grants; `anon` mirrors `authenticated` | Revoked |
| F-D4 | Schema default privileges grant every new object to `anon` and `authenticated` | Every migration revokes explicitly and asserts it |
| F-S1 | Hosted-portal cancellation sets `cancel_at`, not `cancel_at_period_end` | Mirror and read both; undo clears what is set (RA-4) |
| F-S2 | The first portal configuration created becomes the account default and cannot be deactivated | Always pass the app's own configuration ID (RA-5) |

The simple logout design passes its stated requirements. The session-family/RLS fallback is not triggered.

## 3. Proposed final design

Summary only; the documents named are the proposal.

- **Catalogue:** one graduated price, quantity = store count (candidate B). `CONTRACT_DELTA.md` §2.
- **Handoff:** destination-initiated code flow with draft SQL for issue, claim, complete, fail and invalidate; verifier, state, audience and environment checked inside one atomic claim so a bad binding never consumes a valid code; logout after claim closed by a completion step before any cookie; equality hint for a destination that already has a user; one automatic restart on collision, then recovery. `HANDOFF_CONTRACT_PROPOSAL.md`.
- **Sign-in:** emailed link and password both stay. Signed-in existing purchasers get a notice with no sign-in link. `HANDOFF_CONTRACT_PROPOSAL.md` §7–8.
- **Logout:** provider-wide sign-out, `getUser()` on every guard, pending codes invalidated; measured residual stated.
- **Billing events:** seven event types, ledger-first, retrieve-then-apply, non-2xx on unresolved failure.
- **Schema:** `0053`–`0060` in OwedBook; unique NPI; NCPDP nullable; owner-only billing reads; synthetic subscriptions marked and fenced; NPI reservation with defined expiry. `MIGRATION_PLAN.md`, `REVIEW_AMENDMENTS.md`.
- **E2 acceptance additions:** password regression, store-admin permission regression, both-field cancellation, portal configuration ID, only-card removal, renewal failure, NPI validation and reservation races. `REVIEW_AMENDMENTS.md`.

## 4. Consolidated remaining gaps

### 4.1 Decisions for the review

| # | Decision | Recommendation |
|---|---|---|
| D1 | Accept one live link per user with one automatic restart and a recovery page (F-A2) | Accept. Alternatives are costed in `CONTRACT_DELTA.md` §1.4 |
| D2 | Whether opening an emailed link should sign in directly, given F-A7 | Add a one-button confirm page in E2 if mail scanning is confirmed or cannot be ruled out |
| D3 | Change the schema default privileges, or keep revoking per object | Keep per-object revokes with the assertion; treat the default change as a separate decision |
| D4 | Shorter access-token lifetime (900 seconds) | Later, separately authorized; affects every app on the project |
| D5 | APA discount scope across stores | Frank, through Tony |
| D6 | Working logins for the seeded APBM003 cast: the login sheet is no longer on this machine | A Director-run password reset on DEV before QA, or recover the sheet |

### 4.2 Not proved in E1

| # | Gap | Closes in |
|---|---|---|
| U1 | The handoff as an app feature: routes, code table, switch and recovery pages. Only the provider primitive is proved | E2 |
| U2 | Payment Portal emailed login; the template's no-link branch; link expiry; staging addresses | One email and a Director click each; staging at deployment |
| U3 | Payment Portal password login; password login after the cookie-name change | E2 |
| U4 | Clearing a portal-set `cancel_at` through the API | E2 sandbox proof |
| U5 | Removing the only card; renewal failure and the grace clock (needs Stripe test clocks) | E2 / QA sandbox release |
| U6 | Apply rehearsal, backup and restore on SCRATCH | E2, before the apply checkpoint |
| U7 | Local-scope sign-out of a single session (used by the switch page) | E2 |
| U8 | Mission Control after provider-wide sign-out, in the app itself | QA |
| U9 | Sign-in request for an address with no account | E2 with a mocked recipient, or accept |
| U10 | Stripe's minimum Checkout session lifetime, which bounds the reservation window | E2 |
| U11 | Who or what opened the 12:43 email at 13:38 (F-A7) | Tony |
| U12 | Auth settings as actually saved: Engineering has only the Director's report; link lifetime and rate limit are unreported | Tony, or management access |

### 4.3 Director items before E2

| # | Item |
|---|---|
| T1 | Git, deferred by instruction until E1 finishes: restore the portal lock, settle `.env.pilot.example`, confirm the portal remote, create work branches in both repos |
| T2 | Tooling inputs when the repo tooling targets DEV: `APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY`, `APBM_DEV_SECRET_KEY`; and the tooling's evidence-path allowlist, which accepts only the APBM-003 module today (an E2 change) |
| T3 | The sandbox's default portal configuration is the E1 probe one; replace it in the Dashboard if wanted |
| T4 | E1 allowance left: 2 sessions, 5 sign-outs, 7 emails, 54 Stripe mutations, 9 portal sessions, 1 portal configuration. Any E2 or QA effects need their own release |

Closed since the first return: inbox file, DEV SQL, hosted portal, user count, SCRATCH identity and ledger, SMTP and sender, OwedBook emailed sign-in.

## 5. Estimates

No commitment and no deadline. Three units, as asked:

- **Agent session:** one continuous agent working session of roughly two to four hours, ending at a natural hand-back.
- **Elapsed hours:** working hours on the clock, including the waits for the Director inside a lane, excluding nights and DNS propagation.
- **Director touch:** one point where Tony must decide, supply something, run something or observe something.

Calibration from E1 itself, approximate: about 3 agent sessions, about 10 elapsed working hours over two days, about 20 Director touches. E1 was touch-heavy because every provider effect was individually released.

| Lane | Agent sessions | Elapsed hours | Director touches | Basis |
|---|---|---|---|---|
| Post-E1 review support and freeze edits | 1–2 | 3–5 | 4–6 | Answering D1–D6, folding rulings into the contracts |
| Engineering (E2) | 21–28 | 65–90 | 12–18 | Hardening and schema 4–5; registration, Checkout, webhook ledger, provisioning 6–8; handoff, switch and recovery pages, sign-in, logout 5–6; billing area, portal, undo 2–3; lifecycle and grace 2–3; tooling, seed update and self-verification 2–3 |
| Independent QA (Q1 + Q2) | 9–12 | 28–40 | 10–14 | Two apps, two providers, browser matrix, email checkpoints, test-clock renewal cases; one repair round not included |
| Shared DEV apply and recovery | 2–3 | 5–8 | 5–7 | Backup, SCRATCH rehearsal, Director-run apply, verification |
| Joint staging deployment and Gate D | 3–5 | 10–16 | 8–12 | Two services, new domain, allowlist and template branches, public webhook endpoint, cross-app walk; DNS wait not counted |

The first return gave engineering as 13–17 working days. This figure covers that scope plus about two sessions for the completed handoff contract, the synthetic-subscription treatment and seed update, and the added acceptance cases. The scope still exceeds the inherited 7–9 working-day figure for all of APBM007.

What moves the numbers: a decision against D1 (+7–10 engineering sessions, +3 QA); a confirm-button page under D2 (+1 engineering, +1 QA); Stripe refusing the API clear of `cancel_at` (−1, the route defers to the portal); fewer Director touches if E2 effects are released as one capsule instead of one at a time.

## 6. Effects

Within every ceiling; none was reset. Dispatched calls and observed effects are separated in `EFFECT_CAPSULE.md`.

| Surface | Used | Ceiling | Of which |
|---|---|---|---|
| Stripe mutations | 46 | 100 | 44 accepted, 2 refused |
| Stripe reads | 83 | 200 | |
| Portal configurations | 1 | 2 | |
| Portal sessions | 3 | 12 | |
| Auth identities | 4 | 4 | |
| Auth sessions | 30 | 32 | 28 dispatched by Engineering (22 minted, 6 expected refusals); 2 observed from emailed links |
| Provider sign-outs | 3 | 8 | |
| Emails | 5 | 12 | 4 accepted and delivered, 1 refused |

Stripe cleanup is complete with read-back receipts, with one exception: the probe portal configuration is the sandbox default and cannot be deactivated (F-S2). One owned local dev server ran on port 3000 from 13:54 to 13:57 on 12 November and was stopped on the Director's order; Engineering starts no local server outside QA testing.

## 7. Next owner

**Tony:** `ACTION_LIST.md`, then the Architect's reconciliation and the post-E1 review and freeze. Git preparation follows E1 and precedes E2. No automatic E2.
