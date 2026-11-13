# Frozen implementation requirements — v1.0

RA-1 through RA-7 form part of the frozen acceptance contract. References to an E1 proposal describe provenance; the requirements below are now normative. Draft SQL is still subject to execution validation on SCRATCH, never pre-applied.

## RA-1 Password login is preserved

Proposal and regression tests: `HANDOFF_CONTRACT_PROPOSAL.md` §8. Both apps keep `POST /api/auth/login` and the password form. The handoff and the emailed link are additional ways in, not replacements. Evidence: both login routes call `signInWithPassword` today; the Director signed in to OwedBook by password on 12 November.

Not proved in E1: password sign-in in the Payment Portal; password sign-in after the cookie-name change (the change is not built).

## RA-2 DEV-only treatment of the existing synthetic subscriptions

**What exists.** The APBM003 seed wrote three `subscriptions` rows, one per synthetic account, with statuses `active`, `trialing` and `past_due`, period end 1 January 2027, and **no Stripe identifier of any kind** (`scripts/seed/run.mjs` line 28). They exist on DEV and SCRATCH only. No Stripe object corresponds to them.

**Proposal.**

| Aspect | Treatment |
|---|---|
| Marking | The billing-mirror migration adds `origin text not null default 'stripe' check (origin in ('stripe','synthetic_seed'))` and sets `synthetic_seed` only on the three identified APBM003 fixture rows after checking their exact account/subscription IDs, stored status and absence of all three Stripe identifiers. Assert exactly three expected matches; stop on an extra or missing row. No blanket conversion of all unlinked rows. No row is deleted or rewritten otherwise |
| Entitlement | A synthetic row grants the access its stored status implies, so the APBM003 walkthrough keeps working. `trialing` is treated as active; `past_due` shows the reminder banner without a grace clock, because there is no invoice to anchor one |
| Environment fence | Synthetic rows are honoured only when `ALLOW_SYNTHETIC_SUBSCRIPTIONS=true`, set for local and DEV/staging only. Anywhere else a synthetic row grants nothing. The apply checkpoint for any later production database asserts zero synthetic rows |
| Stripe | Never called for a synthetic row. Portal, cancel and undo routes return 409 `not_billable`. Webhooks cannot match them. Reconciliation skips them |
| Owner's billing page | "Test account — no billing" in place of plan, invoices and the portal button |
| New constraints | "One current subscription per account" is a partial unique index over non-canceled rows; the three rows satisfy it. New not-null billing columns apply only where `origin = 'stripe'` |
| New registrations | Always `origin = 'stripe'`. No code path creates a synthetic row |

**Consequence to plan for.** `scripts/seed/verify.mjs` reads every seeded column and compares a canonical hash. New columns on `subscriptions` change that comparison, so the seed generator, verifier and reset need a matching update, and the APBM003 seed regression must be rerun on SCRATCH.

E2 acceptance: the three synthetic accounts behave as before for claims reading; their owners see the test-account billing state; with the flag off they get no paid access; no Stripe call is made for them (asserted by a mocked client).

## RA-3 Intentional store-admin permission changes and their regression tests

These are deliberate reductions. They are listed so that a reviewer or tester does not read them as regressions.

| # | Today on DEV (verified, `DB_CHECK_RESULTS.md` §4–5) | After the hardening and billing migrations | Why |
|---|---|---|---|
| 1 | A store admin can UPDATE any column of their store through the data API: `businesses` UPDATE is granted and the `business_update_admin` policy is live | Policy dropped; INSERT, UPDATE and DELETE on `businesses` revoked from `anon` and `authenticated`. Store rows change only through reviewed server functions | Account link, status, NPI and the Stripe customer ID must never be customer-editable |
| 2 | Any store member can SELECT the account's `subscriptions` row | Owner-only SELECT | Billing is owner-only |
| 3 | `admin_billing_status` answers for store admins | Owner-only | Same |
| 4 | `admin_stores` returns billing fields to store admins | Billing fields redacted for non-owners | Same |
| 5 | `anon` holds the same table privileges as `authenticated` | `anon` has none on tenant tables | No anonymous use exists |
| 6 | TRUNCATE, REFERENCES and TRIGGER granted on every table | Revoked | Never needed; not reachable through the data API today |

Not changed: a store admin's claim reading, store list, member list and audited reads; the owner's authority, which comes from `accounts.owner_user_id`; platform roles.

The app sends no `businesses` update today: a search of `src/` in both apps finds none. The pre-apply check still counts audit rows for store updates by customer sessions before the policy is dropped.

Regression tests for E2:

| Test | Expected |
|---|---|
| RLS harness: store admin UPDATE on own store, any column | Denied (the harness payload for `businesses` patch flips from allowed to denied; recorded as intentional) |
| RLS harness: member and store admin SELECT on `subscriptions` | Zero rows; owner one row |
| `admin_billing_status` as `ADMIN_B2` and as `OWNER3` | Denied; allowed |
| `admin_stores` as `ADMIN_B2` | Store fields present, billing fields absent |
| `anon` on every tenant table | Denied |
| Full APBM003 harness, seed verify, and the 201-test OwedBook suite | Pass, except the expectations named above |
| Browser walk as `ADMIN_B2` and `MEMBER_B1` | Claims and stores as before; billing page shows the denied state, never owner data |
| Catalogue assertion at the end of each migration | No new object granted to `anon` or `authenticated` (F-D4) |

## RA-4 Cancellation mirror reads both fields; undo clears the actual schedule

- **Mirror.** Store `cancel_at` and `cancel_at_period_end` as Stripe returns them. "Cancellation scheduled" is true when either is set. The paid-through date shown is `cancel_at` when present, otherwise the current period end.
- **Undo.** The owner-only route reads the live subscription and clears what is actually set: `cancel_at_period_end: false` when the flag is set; `cancel_at` cleared when the date is set; both when both. It never creates a subscription. It then re-reads and requires both to be clear before answering success.
- **Evidence.** The hosted portal sets `cancel_at` only (F-S1, browser plus API). Undo by API was proved for the flag. Undo in the hosted portal was proved for the date.
- **Not proved in E1:** clearing a portal-set `cancel_at` through the API. E2 must prove it in the sandbox before the undo route is accepted; if Stripe refuses, the route sends the owner to the portal's own renew button, which is proved.

E2 acceptance: cancel in the portal → app shows scheduled with the right date; undo in the app → Stripe shows neither field set; cancel by flag → same; a stale event cannot re-set a cleared schedule.

## RA-5 The portal configuration ID is always specified

- Every portal session is created with `configuration: <STRIPE_PORTAL_CONFIGURATION>`. There is one function that creates portal sessions and it has no path without the ID.
- Startup check: the configured ID exists in the expected account, is active, and has subscription update off, customer update off, cancellation at period end on.
- Reason: the first configuration created in an account becomes its default and cannot be deactivated (F-S2). The sandbox default is currently the E1 probe configuration.

E2 acceptance: a unit test fails if a portal session is requested without a configuration; the startup check fails on a wrong or inactive ID.

## RA-6 Only-card removal and renewal failure join the E2 acceptance

Neither was exercised in E1. The hosted portal showed "add or delete payment method"; no card was removed and no renewal was failed.

**Only-card removal.**

| Step | Expected |
|---|---|
| Owner tries to remove the only card in the portal | Record what Stripe allows; both outcomes are acceptable, but the result must be known |
| If removal is allowed | Subscription stays active to the period end; the owner's billing page shows "no payment method on file" and the route to add one; access is unchanged |
| Next renewal with no card | Follows the renewal-failure path below |
| How the app knows | The billing overview reads the customer's default payment method live from Stripe for the owner. No new webhook type is proposed |

**Renewal failure.**

| Step | Expected |
|---|---|
| Sandbox test clock advances a subscription to renewal with a failing card | `invoice.payment_failed` recorded once |
| Grace | Starts at the first failure of that invoice and does not restart on Stripe's retries |
| Days 0–7 | Normal access, reminder banner, owner can fix billing |
| After day 7 | Read-only, computed on the server from the stored grace start; no webhook is needed at day 7 |
| Owner pays | `invoice.paid` clears the same delinquency; an older failure event arriving late does not reopen it |
| First invoice of a new registration fails | No provisioning, no paid access |

Test clocks need customers created on a clock, so this is a sandbox effect for E2 or QA to request, not something E1 did.

## RA-7 NPI validation and reservation expiry

**Validation.** One shared function used by the server and the form:

1. Remove spaces and hyphens. Anything else that is not a digit is an error.
2. Exactly ten digits.
3. Check digit: the Luhn check over `80840` followed by the ten digits must pass.

The server is the authority. The database repeats the format and check-digit rule on the reservation table through an immutable SQL function. Final FB-6 refinement: there is **no** CHECK on `businesses.npi`: all five existing synthetic NPIs fail the ten-digit rule, and a `NOT VALID` check would still fire on any later update of those rows. New store rows are written only by the provisioning function, from a reservation that already passed. Uniqueness is the new unique index on `businesses.npi`.

**Reservation mechanics.**

```sql
-- DRAFT FOR REVIEW. Not a migration. Not applied anywhere.
create table public.npi_reservations (
  id            uuid primary key default gen_random_uuid(),
  npi           text not null check (public.npi_is_valid(npi)),
  draft_id      uuid not null,
  status        text not null check (status in ('held','checkout_bound','consumed','released')),
  operation_id  uuid,                       -- set when bound to a checkout operation
  expires_at    timestamptz not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index npi_reservations_one_active
  on public.npi_reservations (npi) where status in ('held','checkout_bound');
```

| State | Entered when | Leaves when |
|---|---|---|
| `held` | The draft passes validation; `expires_at` is 30 minutes ahead and moves forward on each saved revision, to a ceiling of 2 hours from creation | Bound to checkout; or expired, then released the next time anyone asks for that NPI |
| `checkout_bound` | The checkout operation is claimed; `expires_at` is the Checkout session's own expiry plus 5 minutes | Paid → `consumed` at provisioning. Unpaid → `released` only on proof: a `checkout.session.expired` event, or a live read showing the session expired and unpaid |
| `consumed` | The provisioning transaction creates the store | Never |
| `released` | As above | Never; a new reservation is a new row |

- **No timer job.** Expiry is applied lazily inside the reserve function, under an advisory lock on the NPI: it releases an expired `held` row, then tries to insert.
- **A bound reservation is never released by time alone.** If a second registrant asks for an NPI whose bound reservation is past its expiry and unreconciled, the server reads that Checkout session from Stripe once and either releases it or answers 409 `npi_unavailable`.
- **A paid operation keeps its reservation** through any recovery, however long.
- **Editing or abandoning a draft** after checkout started expires the Checkout session through Stripe before the reservation is released.
- **Public wording is neutral**: "This NPI can't be registered right now." It does not say whether a store, a reservation or a payment holds it.
- The NPI is also checked against existing stores when reserving; the unique index on `businesses.npi` is the final guard.

Implementation capability check in E2: Stripe's minimum Checkout session lifetime (believed 30 minutes), which sets the shortest possible bound window.

E2 acceptance: valid, wrong-length and wrong-check-digit NPIs; two registrants racing for one NPI, exactly one holds it; an abandoned hold frees after expiry; an unpaid expired checkout frees only after the expiry proof; a paid checkout never frees; the existing five fixtures still load and update.
