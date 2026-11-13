# Environments and effects — v1.0

E1 complete; E2 effect request is E2_RELEASE_REQUEST.md, not yet approved. Director R1 inputs and decisions remain in force. DEV/SCRATCH identity and ledger verification are recorded in E1 evidence. No new SMTP/JWT/template/DNS setting mutation is authorized by freezing the pack.

Configuration is read by explicitly authorized local helpers only, in memory; never display/hash/export the raw env or request credential values in chat. Required credentials stay ignored and outside artifacts. Use the intended project-specific keys, not prefix-only identity assumptions.

Both apps: actual installed Supabase URL/publishable/server-key names; separate per-app/environment auth constants. Portal only: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_STORES, STRIPE_PORTAL_CONFIGURATION, STRIPE_EXPECTED_ACCOUNT, STRIPE_WEBHOOK_SECRET and server APA allowlist. No Stripe SDK/secrets in OwedBook.

OwedBook operator tooling: complete APBM_DEV_* and APBM_SCRATCH_* blocks (DB_URL, SUPABASE_URL, PUBLISHABLE_KEY, SECRET_KEY). Use working verified session-pool URLs for SQL; do not print them. Presence and role/project identity are verified without exporting values. Tooling's APBM003-only evidence allowlist is extended narrowly in E2.

Local origins OB http://localhost:3000, PP http://localhost:3001. Staging origins https://owedbook.cyberizedev.com and https://owedbook-payment.cyberizedev.com. Same protocol, distinct cookies/PKCE; no parent-domain sharing. Resend sender no-reply@cyberizedev.com, name Cyber Pharma. Exact sender delivery and OwedBook revised-link login passed. E2 changes GET redemption to explicit confirmation POST and proves both destinations. Site URL/token lifetime changes remain staging decisions.

Approved recipients are loaded only from /home/moose/.config/cyph/apbm007a-test-inboxes.env using OWNER_1, OWNER_2, STORE_ADMIN, MEMBER. Never export addresses or restore the obsolete plus-tag mapping. No invented password/reset for an existing user.

All effects follow their recorded release. DEV apply is a separate exact-migration checkpoint; sample loading is a separate operator action; Q2 and deployment need independent release. Global logout is allowed only for named synthetic users within capsule; MC/all-device impact and direct-token residual remain explicit. No rotation, DEV reset, production or live payments.
