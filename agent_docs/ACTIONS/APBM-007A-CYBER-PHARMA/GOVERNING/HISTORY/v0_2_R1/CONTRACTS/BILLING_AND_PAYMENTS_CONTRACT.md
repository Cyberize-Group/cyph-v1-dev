# Billing and payment contract — proposal BILL-01

## Commercial model and catalogue

One billing account, one Stripe Customer, at most one current subscription, independently identified stores. Standard monthly USD amount for N >= 1 is 9900 + 4900*(N-1) cents. N=0 ends paid coverage under the removal/cancellation contract; never leave a first-store fee on an empty account. Sale/removal UI is 007B. APA can change totals under a versioned approved discount policy.

E1 compares two catalogue candidates. Candidate A: Product A / monthly USD 9900 quantity 1 plus Product B / monthly USD 4900 quantity max(N-1,0), omitted at zero. Candidate B (preferred if it passes): one product, one licensed recurring monthly USD graduated price, first tier up_to=1 at 9900 cents/unit, second tier up_to=infinity at 4900 cents/unit, no flat fees, one subscription item with quantity=N. Use graduated, never volume pricing: N=1/2/3 must total 9900/14800/19700 cents before discounts/tax. At zero stores end coverage under the removal/cancellation contract, not a fake zero-quantity active account.

Compare portal cancellation/undo, invoice clarity, proration previews and quantity changes, and APA coupon behavior including 3→2→1 and adding/removing the first-priced position. Prefer B only if all required behaviors pass; otherwise retain A with reasons. No item per NPI and no card per store. Store coverage stays in our DB. Env names follow the selected form (one tiered price ID or first/additional IDs); do not retain irrelevant required env vars. The chosen shape is frozen before E2, supporting future 007B counts.

Prepare a repeatable sandbox catalogue script with dry-run, expected sandbox identity, stable lookup keys/version metadata and per-run lock/idempotency. Reuse exact matching objects; detect mismatching amount/currency/interval/live-mode rather than overwrite; report IDs only. Concurrent runs must not mint duplicate catalogue versions. Never use display names as uniqueness. Avoid creating a dummy additional item with quantity zero. Pin actual Stripe SDK/API/webhook versions based on installed evidence.

Stripe's hosted portal: payment method management, invoices, whole-account end-period cancellation. Disable generic price/quantity/promotion changes and immediate cancellation. Named-store operations remain ours. Compare both catalogue candidates for cancellation/undo and the required payment/invoice behavior; test multi-store quantities as well as one-store subscriptions. Portal subscription updates have documented configuration limitations, so do not infer tiered single-item compatibility without proof. If undo cannot be offered there, a narrow owner-authorized server API clears the same subscription's scheduled cancellation. No new subscription is created to undo cancellation. A subscription schedule must not unexpectedly remove required portal capabilities.

## Checkout authority

Anonymous registration uses a high-entropy, httpOnly registration cookie to own its draft. IDs and email alone are not authorization. Rate-limit draft, quote, checkout and status operations. Persist normalized owner/store fields, revision, quote expiry and terms/consent versions. Compute prices server-side from validated catalogue/APA configuration. Never accept an arbitrary amount, price ID, customer ID, subscription ID or owner user ID from a browser.

One initial store only in 007A. Reserve NPI in a race-safe registration reservation; permanent unique NPI on store creation. Timeout/abandonment may release only an unpaid reservation after checking session state. A paid operation retains its reservation through recovery. Do not conflate a draft with a real customer store.

One durable checkout operation per accepted scope/revision. Atomically claim it before the Stripe call; use stable idempotency keys for customer/session creation and retain returned IDs. A second key cannot bypass an existing unresolved operation. After timeout, reconcile the same operation; never blindly create another checkout. Bind checkout to operation/draft revision, expected account or anonymous draft, initial store, quote, USD amount/discount and sandbox mode. Metadata is a mapping aid; it cannot override trusted DB ownership.

Existing email/account: neutral public responses; prove control by sign-in before attaching purchases or opening billing. Do not create a second account/subscription just because a past-due/canceled row exists. 007A does not implement business reactivation; direct already subscribed/canceled accounts to appropriate billing/support flow. No user enumeration in error, timing or public status payload.

Use Stripe-hosted card Checkout only in this scope. Persist cancellation/success URLs from configured exact origins. A return URL and checkout session ID are not proof of payment or authorization. Poll our protected status record; show pending/unknown and advise against paying again until reconciled.

## APA

Support a server-allowlisted Stripe APA promotion code. Possession of an allowlisted valid code is the eligibility rule unless Frank supplies an additional rule; do not build an APA membership-verification system. Amount/percent, duration and future additional-store treatment must be explicit in the final real policy. Until then Tony may approve a labeled sandbox fixture at freeze. Negative cases: unknown, expired and non-allowlisted codes (including valid Stripe codes outside our allowlist). Do not invent production pricing. Keep actual Stripe discount/quote/consent consistent. No live checkout may be enabled from this pack.

## Durable events and fulfillment

Verify the signature over raw request bytes using the correct local or staging signing secret before processing. Reject wrong secrets/mutated bytes. Reject wrong account/mode and unexpected price/currency/customer/session mappings. Record each event ID uniquely before applying a supported event. Handle checkout completion/expiry, payment success/failure, invoice paid/failed, subscription update/deletion and other events required by the frozen SDK flow. Log unsupported verified event types safely as ignored, with no business mutation.

Provision only after a verified event plus authoritative current Stripe retrieval establishes the agreed invoice/session really paid for this operation. checkout.session.completed alone is insufficient if payment is not settled. No browser-selected outcomes, no entitlement before verified payment. Reconciliation can use authenticated Stripe retrieval but cannot trust a browser success flag.

Baseline recovery design: supported event processing is bounded and synchronous, with a durable event/operation ledger and idempotent database transition. Return non-2xx on unresolved required persistence/provisioning failure so Stripe retries. Duplicate completed events return 2xx with no duplicate action. Never mark received as processed before the required transition commits. A 2xx-after-enqueue alternative requires an actually deployed, tested durable worker/retry mechanism approved at freeze; an outbox table alone is not a worker.

Email failure after successful provisioning may return 2xx only when paid/provisioned state and a retryable notification task are committed and resend/operator recovery is implemented. A crash between receipt and processing must be recovered by retry or the approved reconciliation command. Old or concurrent events cannot regress a newer authoritative state or replace a current subscription with an obsolete ID. Test distinct event IDs representing the same business outcome, not only identical event replay.

## Lifecycle and access

Mirror raw provider status separately from our UI/entitlement states. Persist subscription/customer/item IDs, prices/quantities, period boundaries, scheduled cancellation, latest invoice/outcome, grace-start and verification time. First invoice failure does not provision paid access. Renewal failure starts one grace window anchored to the unpaid renewal, not a fresh seven days per retry. A confirmed recovery clears the same delinquency window; old events do not re-open it.

| State | Customer-app behavior |
|---|---|
| Active paid | Normal applicable capabilities; account/store permissions still apply |
| Cancel scheduled, paid period valid | Normal capabilities to paid-through; owner can undo and manage billing |
| Failed renewal, within seven days | Normal applicable access, reminder, owner billing recovery |
| Failed renewal after seven days | Read-only, owner billing recovery, no new paid mutations |
| Canceled after paid-through | Provisional versioned retained read-only + billing/support; final business confirmation not a freeze blocker |
| Initial incomplete/unpaid/unknown | No newly paid store access; show recovery status |

FA-7 acceptance is deliberately narrow: 007A has almost no customer writes. Prove the server-computed state, non-resetting grace clock, correct banner and owner billing recovery, plus denial by the enforcement hook on an actual existing write where one exists. Where no applicable customer write exists, use a controlled hook contract test clearly labeled as such; do not invent a working upload/claim-edit feature or call a disabled button proof of write enforcement. Grace expiry must be evaluated server-side by time, not require a new webhook at day seven or trust the browser clock. Stage reminders are sent only to approved test inboxes. Access mirrors must not silently grant paid writes from stale state.
