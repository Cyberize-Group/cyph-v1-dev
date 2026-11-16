# DEV database read-only check — attempt of 12 November 2026 (NOT COMPLETED)

**Result: no SQL inspection ran. The server refused the login.** Migration ledger, trigger, grants, policies and `auth.sessions` remain UNVERIFIED (gap G2 stays open).

## What was verified before connecting

| Check | Result |
|---|---|
| `APBM_DEV_DB_URL` present in OwedBook `.env.local` | yes, defined once |
| Project reference in the URL equals DEV | yes |
| Equals the project reference of the app's API URL | yes |
| Host | Supabase session pooler, port 5432, database `/postgres` |
| User | `postgres.<DEV ref>` |

## The connection

One attempt, inside a helper that opens a `BEGIN READ ONLY` transaction first. PostgreSQL answered `28P01 password authentication failed`. Nothing was read or written. No second attempt was made, to avoid tripping the pooler's failed-login protection.

## Offline diagnosis of the stored value (no connection; shapes and booleans only)

| Property | Value |
|---|---|
| Well-formed URL, one `@`, no spaces, no stray brackets, no trailing whitespace or carriage return | yes |
| Value is quoted in the file | yes (handled) |
| Password length | 16 characters |
| Password percent-encoded or containing characters that need encoding | no / no |
| Password contains the word "your" or "password" | **yes** |

Reading: the URL's structure is correct, so this is the password itself. It reads like a template placeholder, or it is an old password that no longer matches. I have not seen the value.

## To close

Put the current database password for the DEV project into that URL (Dashboard → Project Settings → Database → Connection string → Session pooler; if the password contains characters other than letters, digits, `-`, `.`, `_`, `~`, percent-encode them). Resetting the database password is a shared-project change and is not requested here.

## SCRATCH inputs still needed (exact names; none is present today)

Add to OwedBook `.env.local`. These are the names `scripts/rls-harness/lib/env.mjs` requires; it refuses a partial set.

| Name | Required form |
|---|---|
| `APBM_SCRATCH_DB_URL` | `postgresql://…/postgres` for project `ihgcsrypblqkwommrkgj`: host `db.<ref>.supabase.co`, or a pooler host with user `postgres.<ref>` |
| `APBM_SCRATCH_SUPABASE_URL` | `https://ihgcsrypblqkwommrkgj.supabase.co` exactly, no path |
| `APBM_SCRATCH_PUBLISHABLE_KEY` | `sb_publishable_…` (or the legacy anon JWT for that project) |
| `APBM_SCRATCH_SECRET_KEY` | `sb_secret_…` (or the legacy service-role JWT for that project) |

Plus one fact from you: whether that SCRATCH project still exists and is not paused. If it was deleted, a new disposable project needs a Director decision, because its reference is hard-coded in the tooling as the only permitted destructive target.

For the same tooling to run against DEV (read-only catalogue verify, later the Director apply), it also requires the full DEV block, not just the database URL: `APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY`, `APBM_DEV_SECRET_KEY` (same values as the app's three Supabase settings). My E1 helper does not need these.

Supplied at run time, not stored: `RLS_HARNESS_PREFIX=APBM_SCRATCH_`, `APBM_TARGET=scratch`, `APBM_PROJECT_REF=<scratch ref>`, `APBM_EVIDENCE_DIR=<absolute path>`. Note for E2: the tooling currently accepts evidence paths only under the APBM-003 module, so a 007A rehearsal needs that allowlist extended — a product-repo change, not made in E1.
