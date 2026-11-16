# Automatic handoff — AUTH-01, FA-1–FA-4 applied

First readable architecture review accepted with exact amendments. Actual provider/session behavior is not yet proved; final protocol/SQL/API freezes at the one post-E1 review. Product implementation is held. Prototype capability work belongs in the governed prototype lane under the E1 effect release.

## Addresses and separation

| App | Local | Staging |
|---|---|---|
| OB | http://localhost:3000 | https://owedbook.cyberizedev.com |
| PP | http://localhost:3001 | https://owedbook-payment.cyberizedev.com |

No parent-domain cookie. Proposed app auth keys cyph-ob-auth and cyph-pp-auth, namespaced by environment, must agree across server/browser/middleware refresh, chunking, PKCE and cleanup. Localhost ports do not isolate cookies: prove that the destination starts without a session and acquires it only through handoff. Distinct names do not defend against a malicious same-host local application; use controlled clean contexts. Magic-link login authenticates; handoff navigates between apps. Account/store/billing authority remains independently checked at destination.

## Destination-initiated authorization-code flow

1. A navigation link leads to the destination's fixed start route with only an allowlisted source-app identifier and relative return path. Destination creates cryptographic state and a high-entropy verifier, stores transient state/verifier in its host-only httpOnly cookie, and constructs an S256 challenge. It redirects to the configured source authorization route with state, challenge, destination app and exact callback/return binding.
2. Source checks its live authenticated session, exact destination origin/path, environment and allowed challenge form. No user/email/account from request input can select the subject. If source is signed out, provide the normal magic-link login with a bounded safe return path; never mint an anonymous handoff. An attacker-selected arbitrary host is rejected.
3. Source issues a high-entropy single-use authorization code, proposed TTL 60 seconds, stored only as a hash. Bind verified user ID, source session ID, destination audience, exact callback/return path, environment and verifier challenge. Redirect only to the configured destination callback with opaque code and state. No provider access/refresh/login token travels through the browser URL. Drop v0.1's source POST-intent/source-browser nonce; add such machinery only if E1 identifies a specific unmet threat and the final review accepts it.
4. Destination requires matching state and cookie verifier and the exact audience/environment. Its server atomically claims the code against the stored challenge/expiry; wrong verifier/audience must not consume an innocent grant. At most one concurrent correct redemption wins. Reused/expired codes fail without establishing a session. Revalidate source session/liveness and pending-code invalidation around the exchange to prevent a logout race from resurrecting access.
5. At redemption only, destination uses its server-only Supabase admin capability to generate a magic-link token for the exact existing server-resolved user and immediately verify it server-side through the supported installed verifyOtp API/type. Provider token material stays in request memory: no database persistence, no encryption key, no exported tokens. Fail closed on timeout/uncertain exchange; start a new deliberate flow instead of making a consumed code reusable. Resulting user ID must match the code subject before cookies are emitted.
6. If destination already holds another user's session, do not silently replace it: require safe explicit account-switch confirmation or reject and offer a deliberate new sign-in. Write only destination cookies, clear transient state, remove code/state from the final URL and check destination permissions anew. Store admins/members can receive a denied billing page, never owner data.

Security controls: exact origin and relative-path allowlists, encoded/protocol-relative redirect rejection, no-store/no-referrer, no third-party callback analytics, scrubbed application/access logs, staging HTTPS and exact local HTTP exception, rate limits and generic failures. State and verifier are mandatory browser-binding controls, not cosmetic. No arbitrary-user mint endpoint, client-supplied identity or source refresh-token sharing. Both directions use the same flow.

## Provider capability gate — FA-2/FA-3

E1 must prove generateLink + verifyOtp creates the expected real session for an existing user with signup disabled, without sending an unsolicited email or creating an unintended user. Test outstanding emailed link → handoff → use email, and handoff issuance/redemption → newly issued emailed link → redemption, plus concurrent same-user attempts. Record whether either operation invalidates the other and whether existing sessions/links survive as required. If they collide, present a supported alternative before freeze; do not hide it behind a generic fresh-link error or implement a broken primitive.

OwedBook gains service-key use in a user-facing request path for the first time (D-01 approved in R1). Its formerly unused service factory becomes reachable through a narrowly guarded server module. Enforce server-only imports, safe logging, exact user binding and client-bundle exclusion. Stripe secrets remain portal-only. Need no extra handoff encryption secret under this amended design.

## Simple logout default — FA-4, D-02 approved in R1

Propose provider-wide signOut for the same user's sessions, clear current app cookies/storage/cache and invalidate that user's pending handoff codes. Peer cookies are cleared on subsequent contact; do not claim that one host remotely deletes another host's cookies. Both apps' protected server routes perform authoritative Auth-server validation rather than trusting a locally decoded JWT. Network/provider failures deny sensitive access and show an honest retry state.

Important liveness qualification: getUser() establishes authentic identity but must not be assumed to prove that every unexpired JWT belongs to a still-live session. E1 tests the installed behavior after signOut. For immediate protected-app rejection, use the narrowest reviewed server-side check that the verified session_id still exists/is active in auth.sessions (or a documented equivalent), with minimum safe return data and a fixed privileged helper. This is not the v0.1 family/RLS registry. Provider signout does not instantly invalidate access JWTs.

Explicit proposed accepted residual: direct Supabase data-API calls may continue under the normal RLS permissions until an already issued JWT expires, unless an approved additional fence is chosen. E1 reports configured lifetime, observed remaining lifetime of pre-logout tokens, and proposes a shorter sensible value with refresh/network cost. A project JWT setting change requires explicit authority, affects other apps and does not retroactively shorten previously issued tokens. Never describe this residual as immediate data-API revocation.

Provider-wide signout can log the same internal staff identity out of Mission Control and other devices on that Supabase project. MC keeps its separate sign-in/cookies and is never automatically handed into, but logout independence is a Director choice, not a promise. D-02 has accepted this impact/window under R1. E1 mutation probes still require the separate E1 release.

The session-family registry plus RLS/RPC fencing is fallback only. Adopt it only if E1 shows the simple design fails a stated requirement or D-02 requires isolation/immediate direct-data revocation; provide costed APBM003 regression and the exact scope at the final review. Do not build that machinery by default. Measure pending-code/logout races and server session-liveness behavior; a fresh minted session surviving a logout race is not waived by acknowledging the direct-data JWT window.

## E1 return / final review

Sequence diagram, endpoint/request/response schema, threat and code state table, concrete atomic SQL/grants, cookie adapters, provider collision receipts, measured logout/server/direct-data/MC behavior and residuals, rate/TTL values, effect totals and failure tests. One post-E1 architecture review covers this with final DB/API design, full QAM and estimates. No product implementation before freeze and release.

R1 authority boundary: D-01 approves OB service-key use only for the guarded handoff. If the proposed general server-liveness check would require broader OB service-key use outside that route, E1 must name that extension and an alternative in the final review; it is not silently granted by D-01. Operator read-only capability probes remain separately bounded by the E1 request.
