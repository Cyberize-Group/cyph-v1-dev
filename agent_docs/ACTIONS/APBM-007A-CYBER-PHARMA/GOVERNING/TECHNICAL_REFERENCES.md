# Official technical references checked for this proposal

Retrieved 11 November 2026. These establish API capabilities/limitations, not tested behavior of the installed versions. E1 must pin actual SDK/API versions and verify the proposed use. No long source text or credentials reproduced.

- Stripe keys: https://docs.stripe.com/keys — API key types differ from webhook signing secrets.
- Stripe customer portal: https://docs.stripe.com/customer-management — multi-product subscription update limits; cancellation/payment/invoice capabilities require exact configuration proof.
- Stripe quantities/items: https://docs.stripe.com/billing/subscriptions/quantities — multiple prices/quantities can share a subscription/invoice.
- Stripe webhook verification: https://docs.stripe.com/events/manage-webhook-endpoints — raw-body signature verification and distinct local/Dashboard signing secrets.
- Supabase generateLink: https://supabase.com/docs/reference/javascript/auth-admin-generatelink — server-side link generation, including magic links; not itself a complete cross-app SSO protocol.
- Supabase verifyOtp: https://supabase.com/docs/reference/javascript/auth-verifyotp — token-hash verification establishes an actual auth session; verify installed API/type.
- Supabase sessions: https://supabase.com/docs/guides/auth/sessions — verified JWT session_id claim; refresh/session lifetimes must be considered.
- Supabase signOut: https://supabase.com/docs/reference/javascript/auth-signout — global/local scope and access-token validity require explicit logout design.
- MDN cookies: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies — domain/path/security semantics; localhost ports do not supply cookie isolation.

The handoff is amended by Friday's first review. Simple provider-wide logout is the proposed default pending Director acknowledgement; session-family/RLS fencing is fallback only. No encryption key or provider bearer persistence is required. Official API availability is not proof the proposed composed protocol is safe or works. Provider link-generation side effects and direct-data revocation require capability evidence before freeze.

Additional official references checked for FA-4/FA-5: https://supabase.com/docs/guides/auth/sessions (session_id/auth.sessions liveness and token-expiry limits); https://supabase.com/docs/reference/javascript/auth-getuser (authentic identity network check is not assumed to prove immediate session revocation); https://docs.stripe.com/subscriptions/pricing-models/tiered-pricing (graduated rather than volume tiers). Installed behavior remains E1 proof, not a claim of tested success.
