# Effect capsule ledger — E1 a01 (final)

A dispatched call counts whether or not it succeeded. Counters are cumulative across 11–12 November; none was reset. Source: `results/counters.json`.

| Surface | Ceiling | Used | Detail |
|---|---|---|---|
| Stripe read requests | 200 | 83 | lists, account re-checks, 22 invoice previews (create nothing; counted as reads), retrievals and cleanup read-backs |
| Stripe products / prices created | 3 / 3 | 3 / 3 | |
| Stripe test customers / subscriptions | 2 / 2 | 2 / 2 | |
| Stripe portal configurations | 2 | 1 | candidate B only |
| Stripe hosted portal sessions | 12 | 3 | |
| Stripe coupon / promotion code | 1 / 1 | 1 / 1 | |
| Stripe mutating requests | 100 | 46 | 28 before the portal probe; then 1 configuration, 1 clear-cancel, 3 sessions, 1 quantity change, 10 cleanup calls, and 2 refused calls (below) |
| Supabase Auth identities created | 4 | 4 | |
| Supabase Auth sessions | 32 | 30 | **Dispatched by Engineering: 28** — 22 sessions minted (18 in the first capsule, 4 in the rapid-exchange proof on 12 November) and 6 expected refusals. **Observed, not dispatched: 2** — sessions minted by emailed links (13:38 by an unidentified Windows browser agent; 14:35 by the Director's click). Both are charged to the allowance. Remaining: 2 |
| Provider-wide signout calls | 8 | 3 | all dispatched by Engineering |
| Emails | 12 | 5 | **Dispatched: 5** — 1 refused by rate limit, 4 accepted (OWNER_1 ×3, STORE_ADMIN ×1). **Observed:** all 4 accepted emails arrived (Director) |

Two Stripe calls were refused with HTTP 400 and are counted: a coupon delete sent with a malformed option by my helper (corrected and retried once, succeeded), and the portal-configuration deactivation (refused by Stripe, not retried).

The two hosted-portal actions (cancel, renew) were performed in the browser on Stripe's page; they changed the probe subscription and are not API requests from the probe.

## Cleanup receipts (read back from Stripe after cleanup)

| Object | ID | State |
|---|---|---|
| Subscription A | `sub_1UaobwGnEQDyu3RR6nd3Oulo` | canceled, ended |
| Subscription B | `sub_1UaobzGnEQDyu3RRr923vkuQ` | canceled, ended |
| Price A first | `price_1UaobRGnEQDyu3RRYgKzFlpV` | inactive |
| Price A additional | `price_1UaobRGnEQDyu3RRsgJq8Hdj` | inactive |
| Price B graduated | `price_1UaobSGnEQDyu3RR90PY7tFT` | inactive |
| Product A first | `prod_Vc2g2nPOYSTauF` | inactive |
| Product A additional | `prod_Vc2gxOVANjYaVU` | inactive |
| Product B | `prod_Vc2gMGvRFE0Za6` | inactive |
| Promotion code | `promo_1UaobTGnEQDyu3RRPquD3f2X` | inactive |
| Coupon | `TOkaCg0S` | deleted; no longer retrievable |
| Portal configuration | `bpc_1UapfzGnEQDyu3RR3M3rwV9q` | **still active — is the sandbox default; Stripe refuses deactivation** |
| Customers | `cus_Vc2gXzFpAOl8jv`, `cus_Vc2gm7iPPE6cTx` | retained (invoice evidence) |

Sandbox after cleanup: 0 active products, 0 active prices, 0 coupons, 1 active portal configuration.

**Could not be removed:** the portal configuration. The approval was for non-default configurations; because the sandbox had none, Stripe promoted this one to default. It allows payment-method update, invoice history and end-of-period cancellation only, and is tagged `apbm007a_e1_a01`. It can be replaced by saving portal settings in the sandbox Dashboard. No further call was attempted.

## Supabase

Uncapped read-only activity: 147 requests across both days — data API and Auth lookups, the read-only SQL transactions on DEV (12 November) and SCRATCH (three runs, 12 November), and two API reads on SCRATCH. No RPC. No row written by Engineering in either database.

Observed consequences on DEV, not written directly by Engineering: 4 role rows and 4 profile rows from the new-user trigger; Auth session rows for the sessions above; the provider's own token and sign-in timestamps.

Retained on DEV: four test identities, by label only (no known password — the provider stored a generated hash; platform role `member`; no account, store or membership). OWNER_2 holds four unexpired sessions from the rapid-exchange proof and OWNER_1 holds the Director's browser session; Engineering's tokens existed only in process memory and are gone. Emailed links: OWNER_1's are all consumed; STORE_ADMIN's was never redeemed and is past the default lifetime.

SCRATCH: read only. Nothing created, reset, seeded or applied.

## Local

Disposable copies, helpers and logs under `/home/moose/NEXTJS/CYBER_PHARMA/APBM007A_E1_WORK/a01/`. The headless browser used a fresh context with no stored state; portal session URLs were never written to disk. One owned OwedBook dev server ran on port 3000 from the disposable copy between 13:54 and 13:57 on 12 November, then was stopped on the Director's order (standing rule: no local server outside QA testing); the env link placed in the copy was removed. No other server or listener started. Nothing written to tracked product files.

## Credential and privacy handling

Both `.env.local` files proven ignored and untracked; only named fields parsed, in memory; output scrubbed. No credential, credential hash, private address or token is in any evidence file; the package scan confirms it.
