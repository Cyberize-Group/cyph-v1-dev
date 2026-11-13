# Environment, credentials and authorized effects

This document is an effect proposal. Authoring and Friday review confer no execution authority. Tony releases E1 and its permitted envelope explicitly; E2/DEV apply/QA/deploy have separate recorded releases.

## Configuration inventory (names, never values)

| Config | Consumer / requirement |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Both apps, same confirmed DEV project; actual installed naming wins after reconciled E1 |
| SUPABASE_SECRET_KEY | Server-only provider/Auth/provisioning capability where required; no Stripe key in OB |
| APBM_DEV_DB_URL / APBM_SCRATCH_DB_URL | Migration/catalog tools, explicit distinct target; never shipped to browser/build |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY | Portal only; Cyber Pharma sandbox, test-shaped key and authenticated identity proof |
| STRIPE_WEBHOOK_SECRET | Portal only; listener secret locally; distinct Dashboard endpoint secret on staging |
| Stripe price ID configuration (names selected at freeze) | Single graduated price ID preferred on proof; otherwise first/additional IDs. Portal only; validate tier mode/currency/interval/amount |
| APA promotion allowlist | Possession of an allowlisted valid code is eligibility unless Frank supplies another rule; no membership verifier |
| OwedBook/portal origin and app ID config | Both apps; fixed local/staging table; no browser-derived arbitrary origin |
| Distinct auth storage/cookie names | All SSR/browser/middleware clients; namespaced per app and environment |
| Handoff state/verifier/code | Generated transiently per flow; hash-only code/challenge store; provider tokens in request memory, no encryption secret |
| Email provider/SMTP sender and template config | Approved provider and sender; support inbox is NOT automatically an authenticated sending address |
| Ignored local QA/env file | Namespaced synthetic accounts, approved test inboxes and test-project identities; no values in handoff |

Protected .env.local is not opened, copied, hashed or edited by a recon agent. The normal app and an explicitly authorized local helper may load allowed credentials into process memory under the pass release. If the helper cannot prove the project/mode without violating an installed restriction, report the access gap once; never print or request secrets in chat. Use a dedicated ignored/untracked local operator config if required. CLI and application keys may select different accounts; compare authenticated identities, not only prefixes.

## Pass effect envelopes

| Pass | Permitted after its recorded release | Forbidden |
|---|---|---|
| E1 baseline | Local read-only source/Git identity; docs/helper writes in declared module/temporary lane; clean disposable dependency install/build/type/test with external-effect tests disabled; bounded read-only provider/catalog/settings inspection | Product edits, DEV schema/data writes, deploy, emails/logins/subscription mutation unless separately in the E1 probe capsule |
| E1 capability capsule | Released bounded prototype probes under amended design; includes catalogue comparison and pending-email collision. Tony names targets/recipients/limits in one E1 release; no additional routine architect review before the single post-E1 review | Unbounded account/user creation; changes to shared Auth templates/settings; destructive data tests; real payments |
| E2 | Local approved code/tests; SCRATCH reset/rehearsal if positively identified disposable; approved sandbox objects/test checkout/replays; synthetic DEV test records after reviewed apply; approved test-inbox sends | DEV resets; rewriting history or existing migrations; production; unapproved global logout; automatic deploy/Git mutation |
| Q1 | Independent inspection/local QA build/instrument control; specifically approved synthetic readiness probes only | Spend Q2 scenario budget or change product |
| Q2 | Candidate-bound synthetic DB/Stripe/email/browser tests within final approved plan | Self-expanded limits, product fixes, guessed credentials/targets |

The current E1_RELEASE_REQUEST.md names proposed targets, recipient aliases, namespaces, operations, maxima, timeouts/retry policy, counters and cleanup. It is NOT yet approved. Resolve missing exact identities read-only before any released probe; missing identity is never guessed. E2/Q2 budgets are returned from E1 evidence rather than inherited from this small prototype capsule. Freeze the E2 envelope once with tested IDs and distinct test accounts before launch.

Draft IDs/namespaces: apbm007a_<attempt> for new test objects; use explicit metadata where supported. Existing DEV users/250 fixture claims and other applications are preserved. Never delete by a broad NPI/email/prefix query without the exact owned-ID manifest. Keep sandbox objects that have evidence dependencies; archive/reconcile rather than pretending invoices/subscriptions can always be erased.

Stop wrong project/mode, credential leak, unexpected schema/candidate drift, unapproved effect, conflicting binding or a broken privacy instrument. Preserve evidence, report one consolidated blocker list, and continue unrelated safe checks. Uncertain writes are reconciled by stable operation ID, not blind retry. Scripts fail before a destructive command if identity is missing or ambiguous.

D-02 is required before a provider-wide logout probe: use only specifically named synthetic users, never the Director/internal staff identity by convenience. Shortening shared project JWT lifetime is a separate explicit settings effect, not an automatic E1 action. D-04 sample loading is DEV-only after later authorized apply and exact synthetic-store confirmation.

R1 precedence: see DIRECTOR_RULINGS_2026-11-11.md. D-01–D-04 and email/test-inbox inputs are approved/supplied; current E1_RELEASE_REQUEST.md defines the requested bounds but is not yet released. Load only the final private recipient mapping per OPERATOR_INPUTS.md. Provider/SMTP and redirect checks remain unverified. No re-asking settled choices, no legacy plus-tag fallback, no copying mailbox values to review exports.

Pending E1 exception request: E1_RELEASE_REQUEST.md explicitly asks for bounded in-memory parsing of required Stripe/Supabase fields from the two intended ignored/untracked local app env files. It does not permit raw file display/hash/copy/export/edit or unrelated key access. The exception is NOT active until Tony releases that exact request; prior read-only recon results used no such access. Other phases retain their own rules.
