# Email delivery and link behaviour — Director observations and provider state (12 November 2026)

## Consolidated position at the E1 final return (12 November 2026, 15:30 Asia/Dhaka)

This section is the current position. Everything below it is the dated timeline it was built from, kept as written; earlier verdicts there are superseded where this section differs.

**Settings saved by the Director on DEV (reported by the Director; Engineering has no management access and did not read them):**

| Setting | Value |
|---|---|
| SMTP | Resend, `smtp.resend.com`, port 465 |
| Sender | `no-reply@cyberizedev.com`, name "Cyber Pharma" |
| Site URL | `http://localhost:3000` |
| Redirect allowlist | `http://localhost:3000/api/auth/confirm` and `http://localhost:3001/api/auth/confirm` |
| Magic-link subject | "Your Cyber Pharma sign-in link" |
| Magic-link body | Revised: explicit branches for the two exact localhost confirm addresses; links carry `token_hash` and `type=email`; any other destination shows a message with no login link |
| Not reported | Link lifetime, email rate limit, other templates |

**Dispatched by Engineering: 5 requests** (all `signInWithOtp`, `shouldCreateUser:false`, OwedBook redirect).

| # | Time (Asia/Dhaka) | To | Provider answer | Observed afterwards |
|---|---|---|---|---|
| 1 | 09:27 | OWNER_1 | Refused, 429 rate limit | — |
| 2 | 09:28 | OWNER_1 | Accepted | Arrived from the Supabase default mailer; token used five seconds later by Engineering's deliberate exchange; link reported failing, as expected |
| 3 | 09:28 | STORE_ADMIN | Accepted | Arrived from the Supabase default mailer; reported failing; token never redeemed; cause unresolved and now superseded by the settings change |
| 4 | 12:43 | OWNER_1 | Accepted | Arrived from `no-reply@cyberizedev.com`; old body. Director did not click. Redeemed at 13:38 by a Windows browser agent that Engineering did not dispatch (F-A7) |
| 5 | 14:27 | OWNER_1 | Accepted | Arrived; revised template; Director clicked at 14:35; **OwedBook opened, signed in as OWNER_1** |

**Proved:**

- Delivery to the owned inboxes through Resend with the `cyberizedev.com` sender (Director observation; headers and DKIM not inspected).
- OwedBook emailed sign-in on localhost, for an existing identity with sign-up disabled, with the revised template: browser observation plus the provider's record (token consumed, one session for OWNER_1 minted by the app's confirm route, no account or store membership).

**Not tested — stated plainly:**

| Case | Why it matters |
|---|---|
| Payment Portal emailed login (`:3001` branch of the template) | The second app's path; nothing sent with that redirect |
| The template's no-link branch (absent or non-allowlisted redirect) | Defined by the Director's template; never triggered |
| Link expiry and the configured lifetime | Unread and untested |
| A second click on a used link | Not observed in a browser |
| Request for an address with no account | Would send to a non-cast recipient |
| Staging addresses | Not on the allowlist yet; no template branch |
| Invite, recovery and other templates | Unchanged and untested |
| Mail-scanner behaviour | F-A7 is unexplained |
| Access email after a paid registration, automatic handoff, provisioning | Not built |

**Standing instruction:** no further email without the Director's next instruction. Seven of the twelve remain.

---

Sources: the Director's inbox report, and a read-only query of the provider's own records for the two identities at 05:45 UTC (no token value selected). No SMTP, template or redirect setting was changed.

## Verdicts

| Item | Verdict | Basis |
|---|---|---|
| Delivery to owned test inboxes | **PASS** | Director: both OWNER_1 and STORE_ADMIN received the email |
| Sender | **Supabase default mailer** (`mail.app.supabase.io`, "Supabase Auth") | Director's observation |
| Proposed `cyberizedev.com` sender | **NOT VERIFIED** — not in use on these emails | same |
| Resend SMTP connected to DEV Auth | **Evidence says no** for these sends; the setting itself was not read | sender domain |
| Sign-in by emailed link | **UNRESOLVED** — not a successful login; redirect behaviour not proven | below |

## What the provider recorded

Both emails were requested at 03:28 UTC (09:28 Asia/Dhaka).

| | OWNER_1 | STORE_ADMIN |
|---|---|---|
| Link token still pending at 05:45 UTC | **no — consumed** | **yes — never redeemed** |
| Session created after the email | one, at 03:28:11 UTC — the probe's deliberate exchange, seconds after the send | none |
| Last sign-in | 03:28:11 UTC (the probe) | 03:26:27 UTC (before the email; the probe) |

The provider's audit-log table is empty on this project, so there is no server record of the failed clicks themselves.

## Reading, kept to what the evidence supports

**OWNER_1.** The emailed link was deliberately superseded by a session exchange five seconds after sending. A failure is the expected outcome of that test and is consistent with finding F-A2. It is not proof on its own, because the same failure would also appear if the link had merely expired; the click time and error text are not captured.

**STORE_ADMIN.** Nothing superseded this link: the probe generated no link for this identity after the email, and the token is still pending. So the link was never successfully redeemed, and it was not consumed by a mail scanner either. The failure has three candidate causes that the present evidence cannot separate:

1. **Elapsed time.** The link was 2 hours 17 minutes old at the time of the query. The provider's default link lifetime is one hour; the configured value on DEV is unread. A click later than the lifetime fails as expired.
2. **Destination.** The request asked for `http://localhost:3000/api/auth/confirm`. Nothing is listening there, so even a correct link ends on a browser error page. But in that case the provider would have verified the token first and it would no longer be pending — which it is. This makes a purely "page did not load" explanation unlikely for a click made in time.
3. **Template or redirect configuration.** If the address is not on the allowlist, or the template builds a link shape the provider rejects, verification can fail before consumption.

No conclusion is drawn between these. The STORE_ADMIN control is **inconclusive**, not failed and not passed.

## What would resolve it (not done; needs the Director present)

One fresh send to STORE_ADMIN (email 4 of 12), clicked within five minutes. The Director reports only: the time of the click, the host and path in the address bar after the click, and any `error_code` shown (for example `otp_expired`). A failed link carries no usable token, so those are safe to relay. I then read the provider's record again. Run once more after a deliberate handoff to settle the OWNER_1 half.

## Consequences already certain

- The default Supabase mailer is what DEV uses today. It is rate-limited and not meant for product email; Resend SMTP with the `cyberizedev.com` sender still has to be connected in the project's Auth settings (a Director action, not authorized here) before the access-email acceptance criteria can be tested.
- Delivery to the four owned inboxes is not blocked.

## Second send after the Director's settings update — 12 November 2026, 12:43 Asia/Dhaka (06:43:08 UTC)

Director-reported settings (not read by Engineering): Resend SMTP saved on DEV (`smtp.resend.com`, port 465); sender `no-reply@cyberizedev.com`, name "Cyber Pharma"; Site URL `http://localhost:3000`; redirect allowlist holds `http://localhost:3000/api/auth/confirm` and `http://localhost:3001/api/auth/confirm`; magic-link subject "Your Cyber Pharma sign-in link"; body unchanged, using `ConfirmationURL`.

Action: ONE `signInWithOtp` to OWNER_1, `shouldCreateUser:false`, redirect `http://localhost:3000/api/auth/confirm`. Provider accepted it (no error, 3.4 s). Email 4 of 12. No retry. No link generation, exchange or handoff for OWNER_1 afterwards. Result file: `results/auth_p5_result.json`.

Status: **acceptance by the provider only.** Delivery, sender and link behaviour for this send are PENDING the Director's inbox check.

Read-only observations made at send time, to help read the result:
- Nothing was listening on ports 3000 or 3001. Engineering did not start a server.
- Both apps' `/api/auth/confirm` routes read `token_hash` and `type` from the query string and redirect to `/error` when either is absent. A link built from `ConfirmationURL` goes to the provider's verify endpoint first and, for a request made without PKCE as this one was, returns the session in the URL fragment, which a server route cannot read. Expected, not yet observed: the provider accepts the link, then the app route lands on `/error` (or the browser shows connection refused if no app is running). If so, that is a template-shape mismatch, not a provider rejection.
- A successfully verified link puts live session tokens in the address bar after `#`. Only the host, path and any `error`/`error_code` are to be relayed, never the fragment.

### Director inbox check for the 12:43 send (received 13:36 Asia/Dhaka)

| Item | Director observation | Verdict |
|---|---|---|
| Arrival | Yes, 12:43 PM Asia/Dhaka | Delivery PASS |
| Sender | "Cyber Pharma", `no-reply@cyberizedev.com` | Proposed sender VERIFIED in use (Director-observed; headers/DKIM not inspected) |
| Subject | "Your Cyber Pharma sign-in link" | As configured |
| Body | Default template: heading "Magic Link", "Follow this link to login:", link text "Log In" | Product template NOT yet applied |
| Click time / result | Not supplied (form fields left unfilled) | Link behaviour UNRESOLVED |

Provider record, read-only, at 13:36:29 Asia/Dhaka (07:36:29 UTC), 53 minutes after the send (`results/db_links2_result.json`; no token value read): link token still pending; no session created after the send; last sign-in unchanged from 03:28:11 UTC. So up to that moment the link had not been successfully redeemed. Whether it was clicked and rejected, or not clicked, cannot be told from the provider side (audit log empty). No link generation or handoff was run for OWNER_1 after the send. If the lifetime is the provider default of one hour, the link lapses at about 13:43 Asia/Dhaka.

### Director statement, 13:39 Asia/Dhaka: the 12:43 link was NOT clicked

There is no click result. Link behaviour remains UNRESOLVED. No further email authorized yet.

Correction to the note above: only OwedBook's confirm route fails to `/error`; the Payment Portal's fails to `/login`. Template proposal: `AUTH_EMAIL_TEMPLATE_PROPOSAL.md` (proposal only, not applied).

## Local OwedBook server prepared for the link test — 12 November 2026, 13:54 Asia/Dhaka

Director-reported (not read by Engineering): revised magic-link body saved, with explicit branches for the two exact localhost `/api/auth/confirm` addresses, links carrying `token_hash` and `type=email`, and a no-link message for any other destination; subject unchanged.

Engineering action: started an owned OwedBook dev server (`next dev -p 3000`, Next 16.3.7) from the disposable baseline copy in the external work lane. Its `src` is identical to the repo checkout (recursive diff clean). The repo's `.env.local` is linked into the copy, not copied or printed. Port 3000 was free beforehand; the server on :3457 was not touched. No product file, Git state or setting changed. No email sent, no link generated.

Reachability (local HTTP): `/` 200; `/error` 200; `/api/auth/confirm` with no parameters 307 to `http://localhost:3000/error` (no provider call is made on that path); `/login` 404 (OwedBook has no such top-level page; not a fault).

Token hygiene: server output passes through a filter that replaces the values of `token_hash`, `token`, `code`, `access_token` and `refresh_token` before reaching the log; checked with a dummy value on `/error` (0 occurrences in the log). Note for reading the result: OwedBook's failure page is `/error` and gives no reason.

### 14:0x Asia/Dhaka — server stopped on the Director's order

The owned dev server on :3000 (process group started 13:54 from the work-lane copy) was terminated; port 3000 is free; the env link in the copy was removed. The server on :3457 was not touched. Standing rule from the Director: Engineering starts no local server outside QA testing. No email was sent and no link generated while it ran.

## Third OWNER_1 send, against the revised template — 12 November 2026, 14:27 Asia/Dhaka (08:27:24 UTC)

Director-reported: OwedBook running on `localhost:3000` (started by the Director; port confirmed listening by Engineering); revised magic-link template saved. The Director-named address was compared in memory with the private inbox file's OWNER_1 and matched; it is not written here.

Action: ONE `signInWithOtp` to OWNER_1, `shouldCreateUser:false`, redirect `http://localhost:3000/api/auth/confirm`. Provider accepted (no error, 3.0 s). Email 5 of 12. No retry. No link generation, exchange or handoff for OWNER_1 afterwards. Result: `results/auth_p6_result.json`.

Status: provider acceptance only. Delivery, template rendering and link behaviour PENDING the Director's click.

### Result of the 14:27 send — OwedBook emailed sign-in PASS (browser observation + provider record)

**Director browser observation:** after logging out of the APBM003 account, the newest OWNER_1 link opened OwedBook. No store data is shown.

**Provider record, read-only, 14:39 Asia/Dhaka (08:39:05 UTC)** (`results/db_links3_result.json`; no token or credential read):

| Check | Result |
|---|---|
| Identity | The Auth user holding the private-file OWNER_1 address (ID prefix `72521a97`) |
| Link token | Consumed |
| Session created after the send | One, at 08:35:46 UTC (14:35 Asia/Dhaka), method `otp`, client agent `node` |
| Last sign-in | 08:35:46 UTC |
| Platform role | `member` |
| `accounts.owner_user_id` | 0 rows |
| `user_businesses.user_id` | 0 rows |
| Other user-reference columns (`audit_logs`, `pending_registrations`, `report_files`) | 0 rows |

The `node` agent shows the session was minted by the OwedBook server calling `verifyOtp` with the `token_hash` from the query string, which is the route the revised template targets. "No store data" is the expected view for an identity with no account or store membership.

**Scope of this proof:** the OwedBook emailed-login path only, on localhost, for an existing identity with sign-up disabled, using the Director's revised template through Resend with the `cyberizedev.com` sender. NOT proved: Payment Portal emailed login (the `:3001` branch), automatic handoff between the apps, paid provisioning, the template's no-link branch for other destinations, and link expiry.

### Unexpected finding — the 12:43 link was redeemed at 13:38 by a Windows browser agent

The same read shows a session for OWNER_1 created at 07:38:13 UTC (13:38 Asia/Dhaka), method `otp`, with a client agent beginning `Mozilla/5.0 (Windows NT 10.0; Win64; x64`. Engineering dispatched nothing for OWNER_1 between 12:43 and 14:27, and Engineering's own exchanges all show agent `node`. The only live link at that time was the 12:43 email (old `ConfirmationURL` body), still pending at 13:36. So that link was opened through the provider's verify endpoint 55 minutes after sending, about two minutes after my 13:36 check.

This conflicts with the Director's 13:39 statement that the link had not been clicked. Engineering cannot tell from the record whether a person opened it on a Windows device or an automated mail scanner or link preview did. It matters either way: the old link shape signs in on a plain GET at the provider, so anything that opens the link consumes it. The revised template has the same property at the app route. Recorded as finding F-A7; cause UNRESOLVED.

Counters: both link-minted sessions are counted against the session allowance as observed sessions (26 of 32), although Engineering did not dispatch them.
