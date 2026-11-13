# Brief and scope

The deployed frontend mock has finished stakeholder review. APBM003 supplies ownership, audited real reads and truthful unavailable controls. 007A connects the portal's approved experience to real sandbox billing and safe account provisioning; 007B adds paid store expansion and staff governance. Together they contribute Phase 7 / Target Two. 007A alone is not completion of Target Two, the eight-phase campaign, Gate Two or production.

## Included outcome

Public owner registration for exactly one store; owner declaration; required unique NPI and stable store ID; server records/quote/consent; Stripe-hosted card Checkout in sandbox; durable signed event handling; account-level customer/subscription mirror; recoverable trusted provisioning; passwordless first and returning access; app-pair handoff; owner billing area and Stripe Billing Portal; scheduled cancellation/undo; failed-renewal lifecycle; email reminder/resend and paid-owner recovery; owner-only billing access; store-update privilege hardening; retained OwedBook/admin reads; actual-browser verification.

The owner is the initial store's designated admin in 007A, with a per-store admin membership for the one-admin invariant. Ownership authority itself does not depend on that membership. No platform role elevation. Naming a different admin is explicitly unavailable until 007B; Friday accepted this scope choice in the first review. The first store may have zero claims; show the real empty state, never inject fabricated customer claims to make onboarding look populated.

Preserve approved portal tokens, theme and responsive design. Use the FFM contract and transition tests as specification inputs, replacing browser-memory authority with server operations. Remove reviewer outcome controls, persona bypasses and Stripe stand-in from the working customer flow. Preserve original FFM evidence and source history.

## Deferred to 007B

Paid Add Store, multi-store purchase UI, staff invitations/role replacement/suspension/recovery, customer store-removal scheduling and support-assisted sale/ownership transfer. Design their account, count, pricing and history seams now; do not claim those operations work in 007A. Every visible deferred control is disabled/unavailable with truthful copy. First-owner access recovery remains in 007A.

## Outside this assignment

Live billing, real claims, imports/math engine, reference vendors, report PDFs/email, Google login, Mission Control implementation, per-store cards/invoices, refunds through the app, trials, general discounts, GHL/manual assisted onboarding, existing-customer migration, automated store sale/data transfer and production decisions. APA is the named promotion exception and is included. Current operational support is a constrained audited runbook/command, not a new Mission Control app.

## Targets

Local: OwedBook http://localhost:3000, portal http://localhost:3001. Staging: https://owedbook.cyberizedev.com and https://owedbook-payment.cyberizedev.com. Existing DEV database; disposable SCRATCH for destructive rehearsal only. Same auth handoff protocol in both environments, separate app cookies. Mission Control keeps independent sign-in. Joint staging deployment follows integration under its own release, not as a side effect of E2.

## Completion boundary

Engineering self-verification + separate independent Q1/Q2 + Director acceptance + exact-candidate Gate Q + governed cleanup and integration. Staging Gate D separately proves both actual deployments, email callbacks, public webhook and cross-app behavior. No inherited FFM or APBM003 certificate certifies these new seams.

Conditional FA-8 scope: under Tony-approved D-04, include the operator-only DEV sample-data command in CONTRACTS/DEV_SAMPLE_CLAIMS.md. It loads labeled synthetic rows into an explicitly named test store only; customer onboarding remains empty. Optional NCPDP is approved under D-03 in R1.
