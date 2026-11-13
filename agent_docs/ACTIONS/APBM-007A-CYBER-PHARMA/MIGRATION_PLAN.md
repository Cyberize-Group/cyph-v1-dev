# Migration plan — v1.0

Source/DEV/SCRATCH baselines were verified through 0052. Reserve 0053–0060 for the purposes below; engineer selects descriptive filenames once and records exact bytes/hashes in the apply bundle. No historical migration is edited. No SQL has been applied by freezing this document.

## 1. Chain state

| Source | State |
|---|---|
| OwedBook `supabase/migrations/` at `bc4e433` | 52 files, `0001`–`0052`; `0053` is free in source |
| DEV ledger (`apbm_migrations.ledger`) | **VERIFIED 12 November**: 52 rows, names and SHA-256 equal to the 52 source files; none missing or extra (`DB_CHECK_RESULTS.md` §2) |
| Public tables exposed on DEV | 17, consistent with the source chain (the 15 new tables plus `user_roles`, `profiles`) |
| Runner | `scripts/apply-forward.mjs` through `scripts/rls-harness/lib/env.mjs`: needs `APBM_DEV_*` or `APBM_SCRATCH_*` blocks, an explicit target and project reference, and `APBM_DIRECTOR_APPLY` for DEV. Present now: `APBM_DEV_DB_URL` and all four `APBM_SCRATCH_*`. Still absent: `APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY`, `APBM_DEV_SECRET_KEY`, needed only when the tooling itself targets DEV |
| SCRATCH | **VERIFIED 12 November**: reference `ihgcsrypblqkwommrkgj`, distinct cluster from DEV, session pooler, ledger 52 rows with names and SHA-256 equal to source (`SCRATCH_IDENTITY.md`) |

## 2. Frozen sequence

| # | Purpose | Notes from evidence |
|---|---|---|
| 0053 | Privilege hardening | From the live ACLs (`DB_CHECK_RESULTS.md` §4): drop `business_update_admin` and revoke INSERT/UPDATE/DELETE on `businesses` from `anon`, `authenticated`; revoke TRUNCATE, REFERENCES, TRIGGER on every public table from both; revoke all table privileges from `anon` on tenant tables; revoke write privileges on `user_businesses`, `user_roles`, `profiles`, `pending_registrations`, `apa_memberships`, `report_files` from `authenticated` where no policy allows writes; revoke EXECUTE on `rls_auto_enable`, `update_updated_at`, `audit_logs_immutable`. Schema-default privilege changes are deferred; explicit per-object revokes and catalogue assertions are required |
| 0054 | Store identifiers | Unique index on `businesses.npi` (0 duplicates, 0 null today). `ncpdp` drop `NOT NULL`. Final reviewed NPI rule: no CHECK on `businesses.npi`: all 5 existing NPIs fail the ten-digit rule and a `NOT VALID` check would still fire on later updates of those rows. Format and check digit are enforced on the reservation table and in the provisioning function (RA-7) |
| 0055 | Billing mirror | Account ↔ Stripe customer mapping, unique both ways. Extend `subscriptions` (quantity, price ID, item ID, period start, cancel-at date and cancel-at-period-end flag (both, see F-S1), latest invoice and outcome, grace start, verified-at, raw status, policy version) no items table needed under the single-item catalogue (candidate B). Add `origin` (`stripe` / `synthetic_seed`) and mark the three seeded rows (RA-2). Owner-only read: replace member-or-owner SELECT on `subscriptions` with owner-only; narrow `admin_billing_status` to owner |
| 0056 | Registration | Draft table with cookie-secret hash, revision, quote and consent versions; NPI reservation with states `held` / `checkout_bound` / `consumed` / `released`, unique active reservation per NPI, lazy expiry, release of a bound reservation only on proof of an unpaid expired checkout (RA-7) |
| 0057 | Operations and events | Checkout/provisioning operation with idempotency key, lease and step status; Stripe event ledger with unique event ID; notification operations |
| 0058 | Provisioning function | One SECURITY DEFINER function, service-role EXECUTE only, fixed `search_path`, creating account, store, owner admin membership, mapping, subscription and audit rows in one transaction |
| 0059 | Handoff codes | Design SQL in `CONTRACTS/AUTH_HANDOFF_CONTRACT.md` §3: table in a non-exposed `handoff` schema; `handoff_issue`, `handoff_claim` (verifier, state, audience and environment inside one atomic UPDATE), `handoff_complete` (closes logout-after-claim), `handoff_fail`, `handoff_invalidate_user`. Service-role EXECUTE only. No general liveness helper: `getUser()` proved sufficient |
| 0060 | Billing read functions | Owner-only billing overview; redaction of billing fields in `admin_stores` for non-owners |

All new tables: RLS enabled, audited through the existing triggers where they hold business facts. **Because the live default privileges grant everything in `public` to `anon` and `authenticated` at creation (F-D4), every migration must explicitly `REVOKE ALL … FROM PUBLIC, anon, authenticated` on each new table, sequence and function, then grant only what a row above names.** A catalogue assertion at the end of each migration fails it if any new object is still granted to those roles.

## 3. Pre-apply checks to carry into `APPLY_CHECKPOINT.md`

1. Ledger equals the 52-file manifest by name and checksum.
2. NPI duplicate and null inventory re-run immediately before apply (today: 0 and 0).
3. Count of customer sessions that currently rely on `business_update_admin` (app sends no such update; confirm from audit rows).
4. Backup taken and restore rehearsed on SCRATCH.

## 4. Verified live on 12 November (was open)

Ledger and checksums; trigger body equal to `0049`; grants and default privileges; policy and index inventory; `rls_auto_enable` is the `ensure_rls` event-trigger function; `auth.sessions` is readable by `postgres` (so by a SECURITY DEFINER function it owns) and not by `service_role`.

Still open: the apply rehearsal and the backup/restore procedure on SCRATCH (the target is verified; the rehearsal is E2 work), and the seed generator/verifier update that the new `subscriptions` columns require (RA-2).
