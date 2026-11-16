# Environment identity — E1 a01 (sanitized)

No credential value, credential hash or private address appears here. Project references below are already present in tracked OwedBook source.

## 1. Checkouts (read-only Git; nothing changed)

| | OwedBook | Payment Portal |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` |
| Branch | `main` | `main` |
| HEAD | `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` |
| Matches expected baseline | yes | yes |
| `origin` | `github.com/Cyberize-Group/cyph-v1-dev` | `github.com/ahmedmusawir/cyph-payment-portal-dev-v1` — **not Cyberize-Group** |
| Local branches | `main` only | `main` only (2 commits in history) |
| Existing changes | ` D .env.pilot.example` (tracked file deleted, unstaged); untracked `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/` (this module) | ` M package-lock.json`; untracked `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA_POINTER.md` |
| Staged | none | none |
| Stashes | 0 | 0 |
| `.env.local` | ignored (`.gitignore:28`), untracked, mode 664 | ignored (`.gitignore:33`), untracked, mode 664 |
| Other ignored local files | — | `.env.qa.local`, `.next/`, `test-results/` (not opened) |
| Proposed E2 branch | `apbm-007a` (Tony creates) | `apbm-007a` (Tony creates) |

Canonical module: OwedBook `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`. Peer pointer: portal `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA_POINTER.md`; its two recorded HEADs match the table. Archived predecessor of the portal: `ARCHIVE/cyph-stripe-subscription-portal-v1` at `abbbcc8`.

Toolchain: Node 22.17.0, npm 11.15.0, Stripe CLI 1.55.10, Docker and gcloud present. Supabase CLI and `psql` are not installed. Port 3457 is held by another process (left alone); 3000 and 3001 were free.

## 2. Supabase target

Method: the E1 helper parsed only the named connection and API-key fields from each app's `.env.local` into process memory and printed presence, key class and project reference.

| Check | Result |
|---|---|
| OwedBook app URL project | `yrsuwikjnbmvpznrgydb` |
| Portal app URL project | `yrsuwikjnbmvpznrgydb` |
| Equals `DEV_REF` in `scripts/rls-harness/lib/env.mjs` (CyberPharma_Dev_v1) | yes, both |
| Equals `SCRATCH_REF` (`ihgcsrypblqkwommrkgj`) | no |
| URL, publishable key, server key identical across the two apps | yes, all three |
| Key formats | `sb_publishable_…`, `sb_secret_…` (new-style, not legacy JWT) |
| Tracked `supabase/.temp/linked-project.json` | names a different project (`jmzwhgny…`); stale, ignored for identity |
| `APBM_DEV_*` and `APBM_SCRATCH_*` blocks used by the repo tooling | absent |
| Any documented Postgres URL name (`DB_URL`, `DEV_DB_URL`, `APBM_DEV_DB_URL`, `APBM_SCRATCH_DB_URL`, `SCRATCH_DB_URL`, `PROTO06_DB_URL`, `QAH_DB_URL`, `RLS_REPLICA_DB_URL`, `HARNESS_DB_URL`) in either file | none present |
| Data API exposed schemas | `public`, `graphql_public` only; `apbm_migrations` and `auth` refused (PGRST106) |

**Superseded on 12 November:** `APBM_DEV_DB_URL` and all four `APBM_SCRATCH_*` variables were added by the Director; DEV SQL identity is verified in `DB_CHECK_RESULTS.md` and SCRATCH in `SCRATCH_IDENTITY.md`. The rows above describe 11 November. Consequence at that time: SQL-level identity (ledger, trigger, grants, policies, `auth.sessions`) was unverified. `NEXT_PUBLIC_SITE_URL` and the data-mode variable were deliberately not read.

## 3. Stripe target

| Check | Result |
|---|---|
| Portal secret key class | `sk_test_…` |
| Portal publishable key class | `pk_test_…` |
| Webhook secret | present, `whsec_…` (origin unknown; no endpoint or running listener is implied) |
| Account from the app key (`GET /v1/account`) | `acct_1RxzixGnEQDyu3RR`, display "Cyber Pharma", US, USD, standard |
| Stripe CLI profile `default` | `acct_1RxzixGnEQDyu3RR`, "Cyber Pharma" |
| App key and CLI same account | yes |
| SDK | `stripe` 22.1.0, pinned API `2026-04-22.dahlia` (portal only; OwedBook has no Stripe dependency) |
| Products / prices / coupons / promotion codes | 0 / 0 / 0 / 0 |
| Billing-portal configurations | 0 |
| Webhook endpoints | 0 |

Customers and subscriptions were not listed.

## 4. DEV Auth and data (read-only)

Public Auth settings: `disable_signup` true; `mailer_autoconfirm` true; external providers: email only; anonymous users off; phone off.

Data API, GET only, server key, counts and aggregates only:

| Table | Rows |
|---|---|
| accounts | 3 |
| businesses | 5 |
| user_businesses | 8 |
| subscriptions | 3 (statuses active, trialing, past_due; 0 with a Stripe subscription ID) |
| pending_registrations | 0 |
| apa_memberships | 0 |
| user_roles / profiles | 12 / 12 |
| user_data | 250 |
| audit_logs | 1361 |
| system_config | 2 |

Stores: 5 across 3 accounts, all `active`; NPI null 0, duplicate values 0, not ten digits 5; NCPDP null 0; store-level `stripe_customer_id` set 0.

Exposed functions: `admin_audit`, `admin_billing_status`, `admin_members`, `admin_stores`, `is_account_member`, `is_admin_of`, `is_member_of`, `is_owner_of_account`, `my_business_ids`, `owedbook_kpis`, `owedbook_pbm_options`, `owedbook_rows`, `owedbook_summary`, `rls_auto_enable`, `tenant_stores`. None was called.

`subscriptions` columns: id, account_id, stripe_customer_id, stripe_subscription_id, stripe_checkout_session_id, status, promotion_code, trial_end_date, current_period_end, cancel_at_period_end, created_at, updated_at. No quantity, price, item or period-start column.

## 5. Installed versions (from clean installs)

| Package | OwedBook | Portal |
|---|---|---|
| next | 16.3.7 | 16.4.3 |
| @supabase/supabase-js / auth-js | 2.106.1 | 2.106.1 |
| @supabase/ssr | 0.6.1 | 0.6.1 |
| stripe | — | 22.1.0 |
| pg | 8.23.0 | — |
| @playwright/test | 1.59.1 | 1.59.1 |
