> **Proposed A01 alignment — DRAFT:** Read `../E2_AMENDMENT_A01.md` before this inherited draft. Its identity, exact file list, deferred customer writes, safe target/checkpoint rules and independent Gate Q/Gate D requirements replace contradictory proposals here only upon approval. No result, FINAL stamp or release is recorded.

# OWNERSHIP AND AUDIT CONTRACT — APBM-003-CYBER-PHARMA

**Status:** DRAFT — CLAIM STATUS until E1 resolution stamps FINAL. Every table, column, function and policy name below is the name **reported** by the BIM-001..003 records; Cody verifies each against `supabase/migrations/0001`–`0047` and the catalog in E1 and lists every discrepancy. Nothing here is changed by a plan edit; corrections go to `../APBM_RULINGS.md` §C.
**Rulings applied:** R-01 (D-1(a) read-audit closure), R-03 (D-4 owner reach), R-09 (audit operation contract).

## 1. The model as it exists (reported; verify at E1)

| Object | Reported shape | Verify |
|---|---|---|
| `accounts` | owner spine; `owner_user_id` (CF-1: blocks auth-user deletion); subscriptions attach here | columns, FK `ON DELETE` behavior |
| `businesses` | a store; `account_id NOT NULL` | |
| `user_businesses` | junction; `role TEXT CHECK ('admin','member')`; `is_primary` | whether any uniqueness exists on `(business_id, role='admin')` today (expected: none) |
| `user_roles` | platform roles; `superadmin` = Cyberize internal; never consulted by an OwedBook policy (Gap-6) | |
| `user_data` | claims; RLS; BIM-002 member SELECT policy via `is_member_of(business_id)` | the exact policy name and the GRANTs on the table for `authenticated` |
| `is_member_of(business_id)`, `my_business_ids()`, `is_admin_of(business_id)` | security-definer helpers, search-path pinned, anon-revoked | definitions via `pg_get_functiondef` |
| `audit_logs` | 11 columns; insert-only; BEFORE UPDATE/DELETE row trigger + BEFORE TRUNCATE guard; FORCE RLS; SELECT for junction admins via `is_admin_of` | |
| `owedbook_kpis`, `owedbook_rows`, `owedbook_summary`, `owedbook_pbm_options` | SECURITY DEFINER; `p_business_id` first; membership via `my_business_ids()` else `'not a member of business'`; one `read_page` row per call; explicit `WHERE business_id = p_business_id` | contract: `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/WRAPPER_CONTRACT.md` |
| `handle_new_user()` (installed on dev, not in the chain) | assigns role from `raw_user_meta_data`, reads `full_name` | `pg_get_functiondef` on dev (Director ran it 2026-09-20; E1 re-verifies) |

## 2. Ownership delta (D-4) — what the migrations add

| # | Change | Rule it implements | Negative case that must hold |
|---|---|---|---|
| OD-1 | Helper `is_owner_of_account(account_id)` (SECURITY DEFINER, `search_path` pinned, EXECUTE revoked from `anon`), and `my_business_ids()` extended to return the union of (a) stores where the user has a junction row and (b) every store whose `account_id` is an account the user owns. Helper landing order per Proto 06 F-8: helpers → SELECT policies → write policies. | Owner reads every store in their account without a junction row | A user who owns no account and has no junction row gets an empty set |
| OD-2 | SELECT policies for owners on `businesses`, `user_businesses`, `subscriptions` (and any account-scoped table E1 lists) via `is_owner_of_account`. One permissive policy per operation per table remains the law (Proto 06 F-1/F-8; stacking forbidden), so existing member SELECT policies are **replaced** by a single policy whose predicate covers member-or-owner, not supplemented. | Owner reach; no policy stacking | Owner of account X cannot read any row of account Y |
| OD-3 | Mutation fence: UPDATE on `accounts` and on `subscriptions` permitted only where `is_owner_of_account(account_id)`; store admins and members get no UPDATE/INSERT/DELETE on those tables; **paid entitlement fields are never client-writable** — the policy's WITH CHECK rejects changes to the entitlement columns E1 names (plan v3.0 §6). | Billing-field protection | A store admin's UPDATE on their account's subscription row is rejected at the DB; an owner's UPDATE that changes an entitlement column is rejected |
| OD-4 | At-most-one-admin per store: partial unique index on `user_businesses (business_id) WHERE role = 'admin'`. | One admin per store, no role switching | A second `admin` row for the same store fails on insert; an UPDATE that would create a second admin fails |
| OD-5 | `audit_write()` stamping extended to any new table touched (none expected; E1 confirms the 13-table stamp list still covers everything the delta writes). | Every write audited | |
| OD-6 | Owner reads of claims go **only** through the wrappers (§3); the wrappers' membership check uses the extended `my_business_ids()`, so an owner's wrapper call for one of their stores succeeds and lands the audit row; for a store outside their account it returns `'not a member of business'` exactly as today. | D-4 audited reach | Owner calling `owedbook_rows` for a store in another account is refused |
| OD-7 | `handle_new_user()` redefined in a forward migration: role fixed to `member`, `full_name` copied, SECURITY DEFINER, `search_path` pinned, no read of `raw_user_meta_data` for privilege. (CE-2) | Server-controlled privilege | A signup carrying `role: superadmin` in metadata still lands as `member` |
| OD-8 | `superadmin` meaning preserved: no policy in this delta consults `user_roles`; display label mapping for "Account Owner / Store Manager / Store Worker / Internal Operator" is a frontend concern recorded in `TARGET_ONE_RELEASE_CONTRACT.md` and never a DB rename. | Role-label collision avoided | |

CF-1 (`accounts.owner_user_id` blocks auth-user deletion): E1 reports the current FK `ON DELETE` behavior; this module records the chosen semantics (recommendation: `ON DELETE RESTRICT` kept, owner deletion is an APBM-007 transfer-runbook operation, never a cascade). Recorded as a ruling in `../APBM_RULINGS.md` §C at E1 resolution.

## 3. Read-audit closure (D-1(a)) — both halves

| Half | Mechanism | Proof QA needs |
|---|---|---|
| Application | `services/owedbook.ts` calls only `owedbook_kpis`, `owedbook_rows`, `owedbook_summary`, `owedbook_pbm_options`; no `from('user_data')` anywhere in `src/` (grep, existence-checked). Admin read views call their own SECURITY DEFINER read paths (names fixed at E1 resolution; proposed `admin_stores`, `admin_members`, `admin_audit`, `admin_billing_status`), each logging one `read_page` row with the operation name in `context`. | grep evidence + audit rows observed per operation |
| Database | Ordinary authorized users cannot SELECT `user_data` directly: the BIM-002 member SELECT policy on `user_data` is dropped **and** `SELECT` privilege on `user_data` is revoked from `authenticated` (belt and braces; wrappers are owned by `postgres`, which has BYPASSRLS, so they keep working). `anon` already has nothing. Service role behavior unchanged (its reads are not user reads; logged per BIM-003 R-6 posture). | a direct `select from user_data` with an owner's, an admin's and a member's token each returns a permission error (not an empty set — E1 decides which error class is expected and QA grades literally); the same users' wrapper calls succeed |

**Expected-change list for the certified matrix.** E1 produces the exact list of BIM-002 matrix cells whose expectation flips (member/admin direct SELECT on `user_data`: allowed → denied; owner reach cells: new) so the harness rework is graded against a list, not a feeling. Every other cell keeps its certified expectation.

## 4. Audit operation contract (R-09) — fixed at E1 resolution

| Operation (app-level) | Wrapper calls made (E1 enumerates from the service code and the screens) | Audit rows expected per operation | Notes |
|---|---|---|---|
| Open OwedBook (initial load, one store selected) | `<<E1: e.g. kpis + rows(page 1) + summary + pbm_options>>` | `<<E1: one read_page per call>>` | retries on error are additional rows; QA counts actual calls |
| Change tab / filter / sort / page | `<<E1>>` | `<<E1>>` | |
| Open Summary | `<<E1>>` | `<<E1>>` | |
| Admin: stores list / members / audit viewer / billing status | `<<E1: one call each>>` | `<<E1>>` | audit viewer reads `audit_logs` under `is_admin_of` or owner policy — reading the audit log is itself logged? E1 states the BIM-003 rule and this contract records it |
| Refresh / re-fetch after error (R-016) | `<<E1>>` | `<<E1>>` | |

QA grades the literal counts recorded here, per operation, not "one screen = one event".

## 5. Attribution

Every `read_page` and every write row carries the acting `auth.uid()` (or `actor_role = service_role` for seed/system writes), the `business_id`, the object and the context the BIM-003 brief §3 defines. Seed writes run as service role with actor NULL (map §6 amendment); the seed's own audit rows are expected and are **excluded** from the "reseed twice = identical state" comparison (`SEED_AND_FIXTURE_CONTRACT.md` §4).

🥄
