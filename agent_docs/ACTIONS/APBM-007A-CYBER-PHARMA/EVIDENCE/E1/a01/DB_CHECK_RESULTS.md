# DEV database read-only check — results (12 November 2026)

Run after the Director corrected `APBM_DEV_DB_URL`. One connection, one `BEGIN READ ONLY` transaction (confirmed `transaction_read_only = on`), 20-second statement timeout, rolled back. No DDL, no DML, no migration. The earlier refused attempt is recorded in `DB_CHECK_ATTEMPT_2026-11-12.md`. Full sanitized output: `results/db_readonly_result.json`.

## 1. Identity (verified before any catalogue read)

| Check | Result |
|---|---|
| Project reference in the database URL | equals DEV and equals the app API project |
| Route | session pooler, port 5432, database `postgres`, role `postgres`, PostgreSQL 17.6 |
| Cross-check with the API | the 4 identities created through the Auth API on 12 November exist in this database's `auth.users` with the same IDs (4 of 4) |

## 2. Migration ledger

| Check | Result |
|---|---|
| `apbm_migrations.ledger` rows | 52 |
| Source files in `supabase/migrations/` at `bc4e433` | 52 |
| Names | `0001_baseline_acknowledge.sql` … `0052_system_config.sql`; none missing, none extra |
| SHA-256 of every source file against the ledger | **52 of 52 match** |
| Applied | 7 November 2026, 08:06:21–08:07:43 UTC |

The 7 November receipt is confirmed against live. `0053` is the next free number.

## 3. New-user trigger

| Check | Result |
|---|---|
| `public.handle_new_user` | present, SECURITY DEFINER, `search_path=""`, owner `postgres` |
| Body compared with `0049_signup_member.sql` | **identical** |
| Inserts role `member`; reads a role from user metadata | yes; no |
| EXECUTE | `postgres` and `service_role` only |
| Trigger on `auth.users` | `on_auth_user_created`, enabled |

## 4. Grants

**Tables.** `anon` and `authenticated` hold broad table-level grants; RLS is what actually restricts them.

| Group | Grants to `anon` and `authenticated` |
|---|---|
| `accounts`, `subscriptions` | SELECT, REFERENCES, TRIGGER, TRUNCATE (no INSERT/UPDATE/DELETE — as `0048` intended) |
| `user_data` | REFERENCES, TRIGGER, TRUNCATE (no SELECT — as `0050` intended) |
| `audit_logs` | INSERT, REFERENCES, TRIGGER, TRUNCATE |
| `system_config` | `authenticated` SELECT only |
| `businesses`, `user_businesses`, `user_roles`, `profiles`, `pending_registrations`, `apa_memberships`, `report_files`, `pbm_info`, the four reference tables | **all privileges**, including UPDATE, DELETE and TRUNCATE |

Findings:

- **F-D1:** `businesses` UPDATE is granted and the `business_update_admin` policy is installed, so a store admin can today update any column of their store through the data API (account link, status, NPI, Stripe customer ID). Confirms the open hardening item.
- **F-D2:** TRUNCATE, REFERENCES and TRIGGER remain granted to `anon` and `authenticated` on every table, including `accounts`, `subscriptions`, `user_data` and `audit_logs`. TRUNCATE is not governed by RLS. The data API offers no way to issue it, so this is a residual, not a live exposure, but it should be revoked.
- **F-D3:** `anon` holds the same table grants as `authenticated` on the tenant tables. RLS policies are all `to authenticated`, so `anon` reads nothing, but the grants are unnecessary.

**Default privileges.** In schema `public`, objects created by `postgres` or `supabase_admin` are automatically granted in full to `anon`, `authenticated` and `service_role` (tables, sequences and functions).

- **F-D4:** every table and function a 007A migration creates will be open to `anon` and `authenticated` at creation unless the migration revokes it explicitly. Each new object needs `REVOKE ALL … FROM PUBLIC, anon, authenticated` in the same migration, and each new function an explicit EXECUTE grant list.

**Functions** (19 in `public`).

| Group | State |
|---|---|
| The 4 `admin_*`, 4 `owedbook_*`, 5 helper functions, `tenant_stores`, `audit_write` | SECURITY DEFINER, `search_path=""`, `authenticated` may execute, `anon` may not |
| `handle_new_user` | neither `anon` nor `authenticated` |
| `rls_auto_enable`, `update_updated_at`, `audit_logs_immutable` | executable by `anon` and `authenticated`; the first two have no fixed `search_path` |

`rls_auto_enable` is the function behind the `ensure_rls` event trigger (`ddl_command_end`); it is a trigger function and does nothing useful when called directly. Revoke EXECUTE on the three in the hardening migration for tidiness.

## 5. Row-level security and policies

RLS is enabled on all 17 tables; `audit_logs` is also forced. Tables with no policy (deny-all to customers): `apa_memberships`, `audit_logs`, `pending_registrations`, `user_data`.

| Table | Policies |
|---|---|
| `accounts` | `account_select_member_or_owner` (SELECT) |
| `businesses` | `business_select_member_or_owner` (SELECT); `business_update_admin` (UPDATE) |
| `subscriptions` | `subscription_select_member_or_owner` (SELECT) — any store member can read billing rows |
| `user_businesses` | `user_business_select_self_or_owner` (SELECT) |

## 6. Indexes relevant to 007A

- `businesses`: unique `(ncpdp, npi)`, unique `pharmacy_slug`, unique `activation_key`, index on `account_id`. **No unique index on `npi` alone.**
- `subscriptions`: unique `stripe_subscription_id`, index on `account_id`. No uniqueness on account or on Stripe customer.
- `user_businesses`: unique `(user_id, business_id)`; partial unique one-admin-per-store (`user_businesses_one_admin`).
- `accounts`: primary key only.

## 7. `auth.sessions`

| Check | Result |
|---|---|
| Readable by role `postgres` | yes |
| SELECT privilege: `postgres` / `service_role` / `authenticated` | yes / no / no |
| Has a `session id` column matching the token's `session_id` claim, plus `user_id`, `not_after`, `refreshed_at` | yes |
| Sessions for MEMBER (signed out provider-wide twice, then one session minted in the race test) | **1** — the sign-outs removed the earlier rows |
| Sessions for OWNER_1 / OWNER_2 / STORE_ADMIN (never signed out) | 4 / 5 / 3 |
| Sessions in the whole project | 17 |

Consequences: the provider deletes session rows on sign-out, which is why `getUser()` rejects at once. A SECURITY DEFINER function owned by `postgres` can test whether a given session ID still exists, so the handoff claim's source-session check is feasible. The service role cannot read the table directly, so the check must live in that function. Twelve probe sessions remain for three test identities; they expire unused.

## 8. User population (no addresses read out)

| Created | Users | Platform roles | With store membership | Own an account |
|---|---|---|---|---|
| 15 May 2026 | 1 | member | 0 | 0 |
| 26 May 2026 | 2 | 1 admin, 1 superadmin | 0 | 0 |
| 23 June 2026 | 1 | member | 0 | 0 |
| 2 August 2026 | 1 | member | 0 | 0 |
| 7 November 2026 | 7 | member | 7 | 3 |
| 12 November 2026 | 4 | member | 0 | 0 |

The earlier "12 users against 7 recorded" question is answered: 7 are the APBM003 synthetic cast, and 5 are older accounts from May–August with no tenant standing (one superadmin, one admin, three members). The 4 from 12 November are the E1 test identities.

Correction to earlier E1 text: the four test identities do carry a stored password hash, generated by the provider at creation. Nobody knows it and none was set by the probe. "No password" should read "no known password".

## 9. Still unverified

Nothing in this file's scope. Closed later on 12 November: SCRATCH identity and ledger (`SCRATCH_IDENTITY.md`); inbox delivery and OwedBook emailed sign-in (`EMAIL_OBSERVATIONS.md`). Auth settings are Director-reported, not read by Engineering.
