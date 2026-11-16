# Canonical acceptance specification — v0.2 proposal

ACs incorporate Friday's first-readable-review amendments and remain unfrozen pending E1 plus the final full-package review. No result is claimed. Freeze v1.0 before E2; later approved changes append rulings with impact. Every independent Q1 plan maps all ACs to exact tests or explicit applicability rulings. Fixture-only proof cannot replace required real provider/browser/database checks.

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
| AC-029 | Billing | E1 compares graduated single-item vs two-item catalogue on cancellation/undo, invoice clarity, proration and coupons; selected form passes actual Stripe portal tests; raw quantity/price changes cannot desynchronize named stores. |
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
