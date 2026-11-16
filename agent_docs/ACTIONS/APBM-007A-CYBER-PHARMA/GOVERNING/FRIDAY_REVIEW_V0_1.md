FRIDAY REVIEW — APBM007A PLAN v0.1 — 2026-11-11
Reviewed: readable concatenation only (ZIP, QAM files and APBM_ENTRY not seen).
VERDICT: ACCEPT WITH EXACT AMENDMENTS. Not an E1/E2 release.

ACCEPTED AS PROPOSED
- SCOPE-01 / R-05: one initial store, owner as designated admin, alternate admin deferred to 007B with truthful copy.
- DATA-01: owner-only billing read and manage authority; owner stays platform member.
- IDENT-01 / R-06: required unique NPI, stable internal store ID, NCPDP retained as optional metadata (pending Director yes).
- PREP-01 / R-01, R-02, R-12: existing DEV, no reset, rotation deferred, staging mock untouched until joint release.
- Billing contract: server-authoritative pricing, signed raw-body verification plus authoritative retrieval, durable event ledger, synchronous bounded processing with non-2xx on unresolved failure, provisioning saga.
- Apply checkpoint, closeout and staging sections.

AMENDMENTS

FA-1 (AUTH-01; AC-022..024). Simplify to the standard destination-initiated authorization-code shape with a destination-held verifier: destination start route sets state + verifier cookie -> source authorize route checks its own live session and issues a single-use, short-TTL, audience-bound code tied to the challenge -> destination callback redeems. Drop the source-side POST intent and source-browser nonce unless E1 names a threat that only they cover. Keep: exact origin and path allowlists, hash-only code storage, atomic single redemption, no-store/no-referrer, different-user-at-destination handling.

FA-2 (AUTH-01 step 6). Mint the destination session at redemption time on the destination server; do not persist provider token material, so no encryption key is needed. E1 must prove generateLink + verifyOtp for an existing user with signup disabled, AND its interaction with an outstanding emailed sign-in link for the same user (does a handoff invalidate a pending email link, or the reverse). If they collide, return an alternative before freeze.

FA-3 (R-03). Record explicitly that OwedBook gains service-key use in a user-facing request path for the first time. This changes the APBM-003 position that the service factory has no app consumer. Needs Director acknowledgement in the rulings, plus a server-only guard and bundle check in AC-037.

FA-4 (AUTH-02; AC-025, AC-026; P13). Default to the simple design: logout calls provider sign-out for the user's sessions, clears local cookies, invalidates pending handoff codes; every server guard validates the session with the auth server, not the JWT alone. Document the residual: direct data-API calls with an unexpired access token until expiry; E1 reports the configured lifetime and proposes shortening it. The session-family registry with RLS/RPC fencing becomes a fallback, adopted only if E1 shows the simple design fails a stated requirement, with a costed APBM-003 regression plan. Mission Control impact of provider-wide sign-out (internal staff who also hold a customer login) goes to the Director as an explicit choice.

FA-5 (BILL-01; R-10; AC-029; P09). Add a second catalogue candidate to the E1 capability proof: one product, one graduated tiered monthly price (first unit 9900, each further unit 4900), quantity = active store count, single subscription item. Compare against the two-item proposal on portal cancellation/undo, invoice clarity, proration on quantity change and coupon behaviour. Prefer the single-item form if it passes. Env var names follow the chosen form.

FA-6 (APA-01; R-09; AC-010; P17). Scope APA to a server-allowlisted Stripe promotion code. Possession of an allowlisted code is the eligibility rule unless Frank supplies another. Do not build membership verification. Keep negative cases for unknown, expired and non-allowlisted codes. Director may approve the labelled sandbox fixture at freeze.

FA-7 (LIFE-01; R-08; AC-030..032; P16). Treat the ended-cancellation policy as a provisional versioned default, same standing as the seven-day grace; not a freeze blocker. State the AC-031 pass criterion honestly: 007A has almost no customer writes, so prove server-computed state, the grace clock not resetting, banner and owner billing recovery, and that the enforcement hook denies a write where one exists.

FA-8 (Brief; AC-018). Keep the real empty state for customer flows. Add a labelled, operator-run, DEV-only command that loads synthetic sample claims into a named test store, outside the customer path, so stakeholder testing has something to look at. Pending Director yes.

FA-9 (P11). Move email sender setup to a Director prep item starting now, ahead of E1: provider, sending domain and DNS, owned test inboxes. It is the longest-lead dependency and access is by emailed link.

FA-10 (Execution plan). Fix the review cadence at two architect reviews: this one, and one after E1 covering capability evidence plus final protocol, SQL and API together. Declare the Director's single eyes-on walk once, grouped with the final usable build.

FA-11 (E1 item 8). E1 must return effort estimates for engineering, QA, apply and deploy. Note for the Director that this scope exceeds the inherited 7-9 working-day figure for all of APBM-007.

NEXT OWNER: JARVIS applies FA-1..FA-11 as v0.2 or rulings; Tony rules FA-3, FA-4 (Mission Control choice), FA-8, NCPDP optional, and names the email sender; then Tony releases E1.
