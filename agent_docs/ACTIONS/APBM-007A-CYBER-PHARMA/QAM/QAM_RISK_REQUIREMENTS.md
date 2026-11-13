# Architect risk input for independent QA Lead

These are module-specific required risk areas, not a fabricated QA Lead approval. Lead may amend the exact plan after Q1.

- Billing owner vs platform/store role separation; direct table/RPC/API negatives; IDOR and arbitrary portal-session/customer access.
- Anonymous checkout draft ownership, NPI reservation races, double submit/new-key bypass and unknown Stripe outcomes.
- Raw signature validation, mismatching account/mode/price/amount, unsettled checkout, duplicate/distinct-equivalent/out-of-order events, crash before/after persistence, partial provisioning and stale event overwrite.
- Owner identity takeover via email/NPI; no role elevation; atomic DB store/admin setup; orphan Auth-user recovery.
- Destination-initiated state/verifier/audience/environment/return binding, expiry/reuse/concurrent redemption, different user at destination, provider mint only at redemption with no persisted bearer material, pending-email link collision in both orders; no arbitrary-user mint.
- Simple provider-wide logout and measured server-session liveness; current token lifetime and acknowledged direct-data JWT residual; explicit Mission Control/all-device effect under D-02; pending-code/logout race. Family/RLS regression only if that fallback was selected.
- First-invoice unpaid vs renewal grace; no grace reset from retries; cancellation/undo same subscription; no data erasure; server time and policy versions.
- APA valid allowlist possession, amount/duration fixture and discount/quote mismatch, unknown/expired/non-allowlisted code denial; frozen single graduated-item catalogue and no raw quantity drift.
- Owned-inbox first link, returning links/expiry/resend/rate limits, setup/email attention and support wrong-email authority.
- Migration upgrade/fresh replay and exact DEV preservation; privilege/default-ACL/SECURITY DEFINER checks; inherited read-audit/store-isolation regression.
- Real viewport/theme/keyboard journeys, empty store, no simulation/persona controls, honest errors and carried billing clipping on touched screens.
- Clean/poison instrument controls and redacted export; no secret/claims/token traces; two-SHA/config/DB candidate identity binding.

Every risk links to canonical AC IDs in the independent plan. Test references derived independently of implementation constants. Use distinct tenants and real state transitions; identical fixtures cannot establish isolation. Gate Q proves this scope only; local proof cannot certify deployed staging.

Under approved D-04, validate DEV-only synthetic-store/sample-dataset command guards, idempotency, preserved unrelated rows and absence from customer paths. Grace proof must reflect limited actual 007A writes: server state/clock/banner/billing recovery and real hook denial where applicable, not a fictional claims-edit feature.

Final freeze risks: confirm-button GET must not redeem; POST CSRF/replay/expiry and no token telemetry; // returns and encoded variants denied; all claim bindings checked without invalid consumption; source user/session same validated token; revoke only minted session on failed completion/mismatch; deliberate different-user switch. Cover exact three-row synthetic exemption, no-Stripe behavior, private cast password regression, no CHECK on legacy NPI and paid reservation retention. Read AC expansion table and IMPLEMENTATION_REQUIREMENTS in full. E1 repeated primitive exchanges do not replace actual integrated handoff tests.
