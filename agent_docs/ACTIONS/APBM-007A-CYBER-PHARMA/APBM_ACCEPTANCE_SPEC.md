# Canonical acceptance specification — frozen v1.0

**Operative from 13 November 2026: v1.0 as amended by "Amendment A1" at the end of this file (APBM_RULINGS.md, Amendment A1). The v1.0 rows below are preserved unchanged as the original requirement.**

AC-001–040 remain stable. The expansions below are normative, not prefilled results. Q1 maps every AC plus its expansions to independent tests. E1 evidence is reusable only for its exact provider/baseline scope; it does not certify the application build.

| ID | Area | Observable requirement |
|---|---|---|
| AC-001 | Identity | Two actual repo SHAs, canonical pack, target/config identity and approved preflight match the release; clean unrelated-work boundaries preserved. |
| AC-002 | Baseline | Fresh maintained build/type/lint/unit checks for both repos, known inherited failures explicitly dispositioned; no false inherited Gate Q. |
| AC-003 | Database | All new schema changes in the single forward chain; current ledger and migration hashes pinned; portal/bootstrap SQL cannot run through normal setup. |
| AC-004 | Database | Fresh and upgrade SCRATCH rehearsals, target mismatch rejection, reviewed backup/recovery and exact DEV apply receipt; existing rows/IDs/indexes preserved. |
| AC-005 | Identity | Required normalized valid NPI unique under concurrent attempts; duplicate/invalid NPI cannot create a second store; existing conflicts produce a stop, never deletion. |
| AC-006 | Identity | Permanent store ID and existing history preserved; optional-NCPDP decision consistently reflected in DB/UI/API/fixtures with no fabricated business rule. |
| AC-007 | Registration | Public owner-only first-store registration, declaration, safe field validation, server enforcement of one initial store and truthful deferred alternate-admin controls. |
| AC-008 | Registration | Draft/status/quote owned by secret registration context; guessed IDs/email cannot read or mutate another draft; neutral existing-email responses. |
| AC-009 | Checkout | Server-authoritative standard USD 99/49 totals under the E1-selected catalogue and quote/consent revision/expiry; browser amount/price/customer/account tampering rejected. |
| AC-010 | APA | APA possession of a server-allowlisted valid Stripe promotion code permits the approved or labeled sandbox discount; unknown/expired/non-allowlisted codes denied; quote and Stripe total agree. No membership verification. |
| AC-011 | Checkout | Concurrent double submit, new-key bypass and network timeout reconcile to one intended customer/session/operation; unknown result never instructs repay. |
| AC-012 | Payment | Signed raw-body verification rejects wrong secret/tamper/account/mode; return URL/session ID alone cannot mark paid or provision. |
| AC-013 | Payment | Authoritative matching settled first payment required; incomplete/declined/expired/unpaid flow does not create newly paid store access. |
| AC-014 | Events | Durable receipt/processing state, DB failure non-ack/retry, duplicate and distinct-equivalent events, restart recovery and concurrent replay produce one business outcome. |
| AC-015 | Events | Out-of-order and obsolete-subscription events cannot regress current subscription/paid state; missing mappings enter visible retry/attention rather than silent 200 loss. |
| AC-016 | Provisioning | Paid saga creates exactly one owner/account/store/current subscription/customer mapping and one designated admin; owner platform role remains member. |
| AC-017 | Provisioning | Failure before/after Auth and DB commit safely resumes same operation; no partial activated store without admin; no takeover by matching email/NPI. |
| AC-018 | Access | Paid owner receives a real owned-inbox link without password and lands in correct real-mode store, including true zero-claim state. Under approved D-04, operator-only DEV synthetic sample loader is labeled/idempotent/target-guarded and never runs from customer paths. |
| AC-019 | Access | Returning-link request/resend has generic responses, validation/rate limits/expiry, correct redirects and usable expired/used-link recovery; no unintended signup. |
| AC-020 | Recovery | Email failure leaves paid/provisioned record recoverable; resend cannot charge/provision again; support wrong-email procedure checks authority and removes old access safely. |
| AC-021 | Auth | App-specific cookie/storage/PKCE names in all clients; no parent-domain sharing; local PP session absent until handoff; source-alone cookie cannot mask test. |
| AC-022 | Handoff | Same reviewed destination-start state/verifier authorization-code flow works OB→PP and PP→OB; destination mints exact existing-user session only at redemption, in request memory, with no persisted provider material. |
| AC-023 | Handoff | Expired/reused/concurrent/wrong-state/verifier/audience/environment codes cannot establish unauthorized sessions; pending emailed sign-in link and handoff interaction proven in both orders, or an alternative accepted before freeze. |
| AC-024 | Handoff | CSRF/login-CSRF/open-redirect/encoded-path attacks denied under destination browser binding; no arbitrary-user minting; different-user destination requires safe explicit action. Extra source intent machinery only by stated-threat amendment. |
| AC-025 | Session | Refresh/expiry/restart preserve identity; approved simple logout rejects peer protected server requests through proved live-session validation and invalidates pending codes; direct data-API JWT residual measured/documented, not mislabeled immediate revocation. |
| AC-026 | Session | Mission Control remains separately signed in/out by its own UI and excluded from handoff; provider-wide same-identity/all-device logout impact follows explicit D-02. No promise of logout isolation; caches/peer cookies handled on contact. |
| AC-027 | Billing auth | Only the selected account owner reads detailed billing or obtains Stripe portal/cancel/undo sessions; direct API/RPC/SELECT and IDOR tests deny admin/member/unrelated owner. |
| AC-028 | Store auth | Customers cannot rewrite account_id, status, Stripe IDs, NPI/owner fields through direct table/function calls; actual grants/ACLs/search_path verified. |
| AC-029 | Billing | Frozen single graduated-price catalogue B passes actual app/Stripe portal tests; explicit configuration ID and only-card-removal behavior proved; raw quantity/price changes cannot desynchronize named stores. |
| AC-030 | Cancellation | End-period cancellation/undo uses same subscription; after paid-through provisional versioned retained-read-only + billing/support default applies; no deletion/reactivation. Final business confirmation not a freeze blocker. |
| AC-031 | Lifecycle | Prove server-computed seven-day grace, non-resetting clock, banner, owner billing recovery and write-denial hook where a real applicable write exists. Label fixture hook proof honestly where 007A has no such write. |
| AC-032 | Lifecycle | Initial unpaid vs renewal past-due/canceled/stale state follows versioned provisional policy; no browser-authoritative status or claim that read-only 007A already supplies later write features. |
| AC-033 | Audit | Supported financial/provisioning/recovery/handoff operations auditable with tenant-safe correlation IDs; secrets/raw claims/tokens absent; APBM003 read audit preserved. |
| AC-034 | UI | Approved real screens show honest pending/unknown/attention/email-failure/empty/denied states; no reviewer success buttons, persona bypass or fake Stripe stand-in reachable in released flow. |
| AC-035 | UI | Theme/375px/1440px/keyboard workflows usable; carried billing clipping fixed if present on touched surface; correct focus and errors; no horizontal overflow hiding billing actions. |
| AC-036 | Regression | Real OwedBook filters/store scope/pagination/claims/admin reads, tenant isolation, one-admin invariant and truthful unavailable actions retained; no math/import change claimed. |
| AC-037 | Privacy | OB first user-facing service-key path explicitly acknowledged under D-01, server-only/exact-user guarded; no key in client bundles/logs/exports and no Stripe secret in OB; provider handoff material memory-only; scanner controls pass. |
| AC-038 | Operations | Operator can identify/reconcile paid-but-locked-out/partial setup using exact operation IDs; no blanket SQL/reset; safe runbooks and retained limits supplied. |
| AC-039 | Evidence | Engineering factual handoff plus independent Q1 plan approval/Q2 evidence bind both candidate SHAs, DB delta and configuration; results not prefilled or reclassified. |
| AC-040 | Release | Finite two-repo manifests and integrated-tree checks; Director acceptance and Git receipts; staging deployment/Gate D separately recorded, production excluded. |


## Validation layers

Unit/contract tests: quote/status/policy/state transitions, grants/idempotency input rejection, expiry/time controls and provider failure simulations. DB tests: real SQL constraints/grants/RLS/functions and concurrent operations on SCRATCH, plus minimal authorized actual DEV negatives. Browser/provider: actual app builds, real sandbox checkout/signature flow, owned-inbox access, separate cookies and app navigation. Reports identify which layer proves each assertion.

Minimum identities: owner A (new paid account), owner B (unrelated account), store admin A, member A, non-member and anonymous. Service role prepares fixtures but never substitutes for customer authorization. Use distinct sentinel records for tenants and actual denied requests. Persisted test roles match the current source model.

Browser matrix input for independent plan: Chromium full critical journeys; Firefox/WebKit targeted cookie/callback/handoff/redirect flows where available; 375 and 1440 pixels; existing two portal/OwedBook themes; owner full flow, admin/member denial and unrelated-owner isolation. Explicitly justify reductions/unavailable engines. Reuse authenticated contexts safely and measure provider effects; tests must not share accidentally identical local cookies.

Staging Gate D is a separate deployed verification plan with its own release. AC-040 requires this boundary and readiness/handoff, not a fabricated deployed PASS during local Gate Q. Required deployed scenarios are listed in STAGING_RELEASE.md.


## Required expansions from final review

| AC | Additional frozen pass criteria |
|---|---|
| 005–006 | RA-7 normalization/check digit; reservation races/lazy expiry; bound reservations release only after unpaid-expiry proof; paid reservation retained; five legacy fixtures preserved and still updateable. |
| 010 | Allowlisted 10%-once fixture only after Director approval; whole-invoice discount including later additional units; commercial amount/duration remain open. |
| 018–020 | Every emailed link GET/HEAD is non-redeeming; explicit CSRF-bound button POST creates intended session; replay/expiry/no-link branch and both destinations; no token leakage. Password routes preserved. |
| 021–024 | Distinct factories/storage; source user/session from SAME just-validated access token; wrong binding leaves code available to correct caller; concurrent correct claims yield one; reject //, encoded redirect and backslash tricks. Prove sequential integrated handoffs both directions inside 60 seconds, not only E1 primitive. |
| 024–026 | Different-user switch needs deliberate POST; same-user path no mint; one fresh restart only; logout before/after claim/mint/complete. Prove isolated new-session revocation on failure without killing another login. Document fallback if unavailable; global user logout still global. |
| 027–028,036 | Explicit expected changes: store-admin UPDATE denied; member/admin subscription read denied; owner billing allowed; non-owner admin_stores redacted; claims/store/member/audit reads preserved. No relabelled failed assertion. |
| 029–030 | Explicit active configuration; wrong/missing configuration fails closed; mirror both cancel fields; clear actual schedule on same subscription and re-read; only-card removal observed. |
| 031–032 | Real sandbox renewal failure via test clock plus server-time grace/enforcement proof; retries do not reset; late failed event after paid recovery does not reopen. Initial failure never provisions. Synthetic rows have exact-ID, environment-fenced exemption and truthful not-billable UI. |
| 003–004,037 | Per-object privilege revokes and catalogue assertion each migration; source-session definer access proved on SCRATCH; no broad default-ACL mutation; backup/restore rehearsal and old fixture preservation. |

Renewal grace remains in v1.0 scope. FC-6's deferral is an optional Director change, not applied here. If selected, issue v1.1 acceptance/contract changes before release; do not merely skip AC-031 in testing.


## Amendment A1 — operative from 13 November 2026

Authority: APBM_RULINGS.md "Amendment A1" (Director rulings relayed by JARVIS). Each row below replaces the named v1.0 clause for acceptance; the v1.0 wording above stays as the original requirement and amendment history. Where a row says "unchanged", the v1.0 text applies in full. No result is claimed.

| AC / row | Change | Operative requirement |
|---|---|---|
| AC-014 | Amended (A1-1) | v1.0 text, plus: an unfinished supported event (no mapping yet, operation busy, payment not yet settled, provider or database failure) is never recorded as processed and never answered 2xx unless a durable retry mechanism actually exists (none exists in 007A); it answers retryable non-2xx and stays visible as unfinished with its reason. A duplicate delivery of an unfinished event is processed again; only a duplicate of a finished event answers 2xx without a second action. Recovery never duplicates provisioning or billing effects. |
| AC-015 | Amended (A1-1) | v1.0 text, plus: a missing mapping alone is not evidence of foreign ownership. App-owned, genuinely foreign and unresolved objects are distinguished by trusted server-side evidence (this database's mappings; the application's ownership marker on the object as retrieved from Stripe with the server key). Only a positively foreign object, an unsupported type or an event with nothing to apply may be finalised as ignored with 2xx. Events finalised as ignored or processed without completion before the repair are recoverable through a bounded, exact-ID procedure that preserves their history; the ledger is not blindly reset. |
| 014–015 (new expansion) | Added (A1-1) | Prove: (a) late mapping followed by successful recovery; (b) duplicate delivery before and after recovery; (c) busy operation followed by recovery; (d) a genuinely foreign sandbox object; (e) recovery of incorrectly finalised historical events with history preserved; (f) no duplicate provisioning or billing effects. Late mapping and foreign outcomes are proved separately, never assumed interchangeable. The recovery entrypoint is the operator command `--event <evt_ID>` (with `--list`), pinned by the candidate pair. |
| AC-029 | Unchanged | Explicit configuration, wrong/missing configuration fails closed, only-card-removal behaviour proved, raw quantity/price changes cannot desynchronise stores. |
| AC-030 | Unchanged | End-period cancellation and same-subscription undo; provisional retained-read-only default after paid-through. |
| AC-031 | Amended (A1-2, A1-3) | Prove in 007A: server-computed seven-day grace from the stored start, non-resetting clock (one start per invoice, retries do not reset), clearing by payment of the same invoice, a late failure after payment does not reopen, server-time evaluation, the write-denial hook (labelled contract test where 007A has no write), the in-app reminder banner, and one recorded reminder notification per failed renewal invoice (`notification_operations`, kind `renewal_reminder`). Proof layers: SQL (SCRATCH/DEV) and unit/contract tests. The live sandbox failed-renewal / seven-day-grace journey with a test clock is **NOT RUN BY DIRECTOR RULING**, has never passed, is not a 007A pass criterion, and must be proven before production billing (007B obligation O-1). Reminder email delivery is deferred and tracked (O-2); no reminder email is expected in 007A. |
| AC-032 | Amended (A1-2) | v1.0 text applies, except that renewal past-due behaviour is proved at the SQL/unit layer only in 007A; the live renewal journey follows AC-031's deferral. "Initial failure never provisions" remains a live 007A requirement. |
| 029–030 expansion | Unchanged | As v1.0. |
| 031–032 expansion | Amended (A1-2) | "Real sandbox renewal failure via test clock" moves to 007B (O-1). Retained for 007A: server-time grace/enforcement proof at SQL/unit layer; retries do not reset; late failed event after paid recovery does not reopen; initial failure never provisions; synthetic rows keep exact-ID, environment-fenced exemption and truthful not-billable UI. |
| RA-6 | Split (A1-2) | Only-card removal: unchanged, required in 007A (AC-029). Renewal failure: SQL/unit checks in 007A; live test-clock journey deferred to 007B (see CONTRACTS/IMPLEMENTATION_REQUIREMENTS.md, RA-6 "Amendment A1"). |

The closing note above ("Renewal grace remains in v1.0 scope … do not merely skip AC-031 in testing") is satisfied by this amendment for the live journey only: grace itself stays in 007A scope at the SQL/unit layer.
