# Data, ownership and provisioning contract — proposal DATA-01

## Migration ownership

All schema changes, including portal/auth operation tables, are numbered forward migrations in OwedBook. Actual file allocation follows E1 current-head inspection. Include the relevant 0053 privilege-hardening follow-up, avoiding an assumed free number. Portal SQL/bootstrap files are fenced from every normal setup/deploy path; old metadata-role trigger SQL is visibly deprecated or guarded without editing historical migrations/certified evidence.

Proposed records (final SQL/types/indexes/grants returned by E1 and frozen before E2):

| Record | Purpose / invariant |
|---|---|
| accounts / businesses / user_businesses | Existing owner/store/member identities; stable internal IDs; unique required normalized NPI; no destructive key rewrite |
| billing customer mapping | One account ↔ one sandbox Stripe customer, unique both ways; deprecated store-level Stripe IDs never used for authority |
| subscriptions + billing items/coverage | One current subscription per account, historical subscriptions retained; raw statuses, quantities, prices, periods, discounts and versioned policy |
| registration draft + NPI reservation | Anonymous draft ownership, revision, retention, checkout-bound immutable scope and concurrency-safe reservation |
| checkout/provisioning operations | Stable idempotency key, Stripe IDs, step status/lease, partial-failure recovery, expected amounts and account/store links |
| event ledger | Unique provider event ID, mode, processing status/attempts, normalized safe event facts, reconciliation history |
| notification operations | Access email/reminder attempt, retry state and provider message ID; no bearer links in logs |
| handoff codes/revocation | Hash-only single-use code, destination challenge/audience, TTL and pending-code invalidation; provider material never persisted. Session-family tables are fallback only, not default |

Store identifiers: never attach claims/audit history solely to an editable NPI. Preserve current internal store IDs and historic data. Validate NPI ten digits and check digit in server/UI; identify synthetic fixtures explicitly. Unique constraint must be checked for existing duplicates before apply; report conflicts rather than delete/merge. Proposed optional NCPDP retains existing values; do not irreversibly remove the field. A sale/identifier change is not implemented by deletion.

## Authorization

Owner authority derives from accounts.owner_user_id and is checked on the server for each selected account. Platform member is the normal role for the new owner; no metadata role trust or elevation. Keep existing internal superadmin semantics; no universal platform bypass in tenant/billing APIs. An internal operator uses an explicitly authorized service-only runbook.

Billing overview/details, customer/session/subscription IDs, invoices and manage-billing sessions are owner-only. Store admins/members cannot get them through direct SELECT, views, RPCs or customer API routes. Redact billing fields from admin_stores/admin_billing_status and related UI for non-owners. Public checkout status exposes only the draft's minimal status under its secret cookie. Account owner checks are not satisfied by generic tenant_stores(owner OR admin).

Revoke broad customer UPDATE on businesses and constrain permitted columns through narrowly granted functions, or use reviewed column grants with RLS. account_id, status, Stripe mapping, NPI, ownership and activation identifiers are never customer-editable through general UPDATE. In 007A no new store settings edit is needed; reject writes rather than add unrequested UI. Review effective grants/default ACLs/SECURITY DEFINER ownership and fixed search_path, including callable function EXECUTE grants. Preserve APBM003 claim-read fencing and audited reads.

## Provisioning saga

Stripe, Supabase Auth, Postgres and email cannot share one atomic transaction. Use one durable recoverable operation with idempotent external steps and an atomic Postgres provisioning step, not a claim of a global transaction.

1. Verify paid checkout against its immutable trusted operation. Lock/claim that operation with bounded lease and stable identity.
2. Create or resolve the owner's Auth identity through a server-only path. An existing email requires possession proof before attaching control. New-user trigger supplies member/profile; retry may discover an already created user but must not reset roles/passwords or take over an account.
3. In one database transaction create/recover account, first store, owner's designated-admin membership, billing mapping/subscription/items/coverage and audit records. Require operation uniqueness, NPI reservation and mapping consistency. At commit there is one designated admin for each newly activated store. Existing owner authority does not depend on the membership.
4. Record paid/provisioned state before attempting access email. Generate a single-use link through the trusted provider, with fixed app landing and no mandatory password. Resend is an independent rate-limited notification operation, never another payment/provisioning operation.
5. Return honest status: payment confirmed + setup pending / setup attention / ready + email pending/failed/sent. Provider acceptance of email is not proof of inbox delivery. No hard-coded success timeout.

Each step records safe IDs and progress. Test timeouts before/after external success, process restart, duplicate/concurrent events, unique conflicts and database rollback. Recover by the same operation key. Do not delete a paid registration or silently charge again. Operator can inspect and retry exact pending operations, not issue arbitrary SQL as customer recovery.

## Recovery and audit

Resend owner access link; returning-user request; expired/used link path; setup retry; wrong-email correction with verified operator authorization and audit. Email correction must first resolve identity/ownership and revoke old access, pending handoffs and prior links as supported; if provider revocation cannot be proved, hold in attention and require a safe recovery path. Never simply change owner_user_id because someone knows an NPI/checkout ID.

Audit verified payment, mapping changes, provisioning transition, notification attempt/recovery, billing action and handoff outcome using correlation IDs and a reviewed event vocabulary. Preserve existing audit protections and read wrappers. No passwords, tokens, secrets, raw claims or full auth/webhook bodies in public logs or audit rows. Owner-visible audit stays account-scoped; diagnostic event/operation internals are service-only. Retention windows are configuration decisions returned by E1; no automatic deletion of financial/store history.

FA-8 sample-data command, if approved, follows CONTRACTS/DEV_SAMPLE_CLAIMS.md. It never runs from signup, payment, provisioning, email callback or customer UI. Original customer empty states remain real.
