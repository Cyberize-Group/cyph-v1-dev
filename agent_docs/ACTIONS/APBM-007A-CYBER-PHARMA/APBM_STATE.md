# Current state — APBM007A v1.0

**E1 COMPLETE. TECHNICAL DESIGN FROZEN. E2 NOT RELEASED.**

Friday Review 3 is final E1 acceptance. FC edits are applied in this package. No provider settings, product code, live repo, database, branch or deployment was changed by package authoring.

Outstanding release checks: Git T1, complete DEV tooling block T2, privately available seeded logins, sandbox APA fixture approval, explicit engineering effect capsule. Tony reports seeded logins recovered and used; this is resolved as recovery, subject to local availability check, not a reset request. E1 F-A7 clicks confirmed Director-owned; no scanner incident established.

Historical state log follows unchanged. Its earlier statuses are superseded by this header and final rulings.

---
# State — APBM007A v0.2 R1

- Phase: PLAN_APPROVED_E1_NOT_RELEASED. Active writer: Architect, documentation only.
- Director decisions D-01–D-04: APPROVED for synthetic DEV/staging; source DIRECTOR_RULINGS_2026-11-11.md.
- Email/provider/recipient inputs: RESOLVED. Provider Resend; domain cyberizedev.com verified per Director report; proposed sender no-reply@cyberizedev.com; final four-role operator mapping supersedes earlier list. SMTP/redirect/sender usability and actual delivery remain UNVERIFIED E1 work.
- Next owner: Tony, approve/decline the bounded E1_RELEASE_REQUEST.md. No repeated request for the four settled decisions or inboxes.
- E1: NOT RELEASED; NOT RUN. E2/build: NOT RELEASED. 007A DEV apply/sample loading/deploy: NOT RELEASED.
- Architecture: first readable v0.1 review ACCEPT WITH EXACT AMENDMENTS; FA-1–FA-11 applied in v0.2. ZIP/QAM/APBM_ENTRY not independently covered by that review. One complete post-E1 protocol/SQL/API/capability/package review and technical freeze remain.
- OwedBook last recon baseline: main bc4e4336f80d2e8cdbb628d4de29d08f8fc95694; refresh at E1.
- Portal last recon baseline: c89572a45210e7d6f098c2878cfabe9a1c5326f1; current org remote/dirty lock disposition to verify at E1.
- Actual checkout paths/branches/current SHAs: pending E1/Director Git receipt.
- Independent Q1/Q2, cleanup, Gate Q, final grouped Director product walk, integration, staging deployment/Gate D: NOT STARTED for 007A.
- Production excluded; DEV password rotation remains deferred. No live target/config/probe result claimed by author.

Historical source snapshots remain unchanged. This current index supersedes earlier pending-choice statements, never supplies missing execution authority.

## Current Director release — supersedes earlier E1 status

E1_RELEASED; execution NOT STARTED.
Authority: E1_DIRECTOR_RELEASE.md.
Next owner: Claudy, after private operator input is installed.
E2/build, DEV apply, sample loading and deployment remain held.

## E1 attempt a01 — engineering status, 11 November 2026 17:02 Asia/Dhaka

E1 STARTED; read-only and local phase COMPLETE; capability capsule NOT STARTED.
Blocked on the private test-inbox input (file absent on this VM). No provider mutation, Auth identity/session, signout or email dispatched.
Interim evidence: EVIDENCE/E1/a01/ (E1_REPORT.md first). No ZIP exported. Not E1_RETURNED.
Next owner: Tony — EVIDENCE/E1/a01/ACTION_LIST.md (A1 blocking; A2–A4 scope the capsule).
Resume: EVIDENCE/E1/a01/CAPABILITY_PROBE_PLAN.md step P0. E2, DEV apply, sample loading and deployment remain held.

## E1 attempt a01 — engineering status, 12 November 2026 09:32 Asia/Dhaka (supersedes the 11 November a01 block)

Capability capsule EXECUTED within limits after the private inbox input was installed. E1 evidence RETURNED WITH OPEN ITEMS.
Open: hosted-portal probe (Director approval pending), SQL-level DEV/SCRATCH checks (no connection string), Auth email settings, one operator inbox check.
Evidence: EVIDENCE/E1/a01/ (E1_REPORT.md first). Review ZIP: QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01.zip.
Live probe objects retained on purpose: see EVIDENCE/E1/a01/EFFECT_CAPSULE.md.
Next owner: Tony — EVIDENCE/E1/a01/ACTION_LIST.md; then Architect reconciliation and Friday review. No approval or freeze is claimed here.
E2, DEV apply, sample loading and deployment remain held.

## E1 attempt a01 — continuation, 12 November 2026 10:39 Asia/Dhaka

Director continuation approval (portal configurations/sessions) executed: candidate B hosted cancel/undo PASS; probe objects cleaned up with receipts.
Exception: probe portal configuration became the sandbox default and cannot be deactivated (EVIDENCE/E1/a01/EFFECT_CAPSULE.md).
Still open: SQL-level DEV/SCRATCH checks, Auth email settings, one operator inbox check, collision decision for the review.
Review ZIP (revision 2): QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r2.zip. E2, DEV apply, sample loading and deployment remain held.

## E1 attempt a01 — DEV database check, 12 November 2026 11:28 Asia/Dhaka

APBM_DEV_DB_URL installed by Director; identity matched DEV; one read-only connection attempt REFUSED (28P01 password authentication failed). No SQL inspection performed.
Detail and the exact SCRATCH input list: EVIDENCE/E1/a01/DB_CHECK_ATTEMPT_2026-11-12.md. Next owner: Tony (correct password in the URL). E2 remains held.

## E1 attempt a01 — DEV database check COMPLETE, 12 November 2026 11:41 Asia/Dhaka

Read-only DEV SQL checks ran after the Director corrected the URL: identity matched; ledger 52/52 with checksums; trigger equals 0049; grants, policies, auth.sessions recorded (EVIDENCE/E1/a01/DB_CHECK_RESULTS.md).
Still open: SCRATCH inputs, Auth email settings, operator inbox check, collision decision for the review.
Review ZIP (revision 3): QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r3.zip. E2, DEV apply, sample loading and deployment remain held.

## E1 attempt a01 — email observations recorded, 12 November 2026 11:46 Asia/Dhaka

Director inbox report recorded: delivery PASS; sender is the Supabase default mailer; proposed cyberizedev.com sender NOT VERIFIED; emailed-link behaviour UNRESOLVED (EVIDENCE/E1/a01/EMAIL_OBSERVATIONS.md). No settings changed.
Review ZIP (revision 4): QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r4.zip. E2 remains held.

## E1 attempt a01 — one fresh OWNER_1 email sent, 12 November 2026 12:43 Asia/Dhaka

On Director instruction after the Resend SMTP / allowlist update: one sign-in email to OWNER_1 accepted by the provider at 06:43:08 UTC (email 4 of 12). Nothing generated or exchanged for OWNER_1 afterwards. PAUSED for the Director's inbox check. ZIP not rebuilt (revision 4 predates this send). E2 remains held.

## E1 attempt a01 — inbox check for the 12:43 send, 12 November 2026 13:37 Asia/Dhaka

Delivery PASS; sender "Cyber Pharma" <no-reply@cyberizedev.com> observed by the Director (VERIFIED in use); subject as configured; body still the default template. Click result not supplied; provider shows the token still pending and no new session at 13:36. Link behaviour UNRESOLVED. ZIP not rebuilt. E2 remains held.

## E1 attempt a01 — template proposal, 12 November 2026 13:45 Asia/Dhaka

Director: the 12:43 OWNER_1 link was NOT clicked; link behaviour UNRESOLVED. Magic-link template proposal returned (EVIDENCE/E1/a01/AUTH_EMAIL_TEMPLATE_PROPOSAL.md), not applied. No email, link, settings or product change. E2 remains held.

## E1 attempt a01 — OwedBook local server up for the link test, 12 November 2026 13:55 Asia/Dhaka

Owned dev server on http://localhost:3000 from the work-lane baseline copy (source identical to repo; env linked). Reachable. No email, link, settings or product change. Waiting for the Director's word to send. E2 remains held.

## E1 attempt a01 — third OWNER_1 email (revised template), 12 November 2026 14:27 Asia/Dhaka

Accepted by the provider at 08:27:24 UTC; email 5 of 12. Nothing generated or exchanged for OWNER_1 afterwards. PAUSED for the Director's click. E2 remains held.

## E1 attempt a01 — OwedBook emailed sign-in PASS, 12 November 2026 14:45 Asia/Dhaka

14:27 send to OWNER_1 against the Director's revised template: link opened OwedBook (Director browser observation); provider record shows token consumed, one otp session for OWNER_1 minted by the app route at 14:35, role member, no account or store membership. Proves the OwedBook emailed-login path only; Payment Portal login, handoff and provisioning NOT proved. New finding F-A7: the 12:43 link was redeemed at 13:38 by a Windows browser agent not dispatched by Engineering; cause unresolved. Counters: emails 5/12, sessions 26/32.
Review ZIP (revision 5): QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r5.zip. E2 remains held.

## E1 attempt a01 — SCRATCH identity verified, 12 November 2026 15:00 Asia/Dhaka

Read-only: SCRATCH URL reference equals ihgcsrypblqkwommrkgj, distinct cluster from DEV, all four APBM_SCRATCH_* variables present, keys accepted, ledger at 52. Note: URL uses the transaction pooler (6543). No reset, seed, restore or apply. Review ZIP revision 5 predates this. E2 remains held.

## E1 attempt a01 — SCRATCH ledger compared, 12 November 2026 15:15 Asia/Dhaka

Read-only: SCRATCH re-verified (same cluster, distinct from DEV); ledger 52/52 names and SHA-256 equal to the source files; none missing, extra or mismatched. The saved APBM_SCRATCH_DB_URL still parses to port 6543 (file last modified 12:12). No apply, reset, seed or restore. E2 remains held.

## E1 attempt a01 — SCRATCH on session pooler confirmed, 12 November 2026 15:13 Asia/Dhaka

Rerun after the Director's port change: URL on port 5432, identity and 52/52 ledger comparison pass again, read-only. G5 now only "rehearsal not run" (E2). E2 remains held.

## E1 attempt a01 — FINAL CONSOLIDATED RETURN, 12 November 2026 15:45 Asia/Dhaka

E1 evidence returned for the post-E1 review. Added today: rapid sequential exchange proof (prototype; 4 exchanges in 4.6 s across two cookie jars), HANDOFF_CONTRACT_PROPOSAL.md (draft SQL/API, review text only), REVIEW_AMENDMENTS.md (RA-1…RA-7), consolidated email position, reconciled stale statements, dispatched-versus-observed effect ledger, estimates in agent sessions / elapsed hours / Director touches.
Counters: Stripe mutations 46/100, reads 83/200, portal configurations 1/2, portal sessions 3/12; Auth identities 4/4, sessions 30/32 (28 dispatched, 2 observed), sign-outs 3/8; emails 5/12.
Review ZIP (revision 6): QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r6.zip. Next owner: Tony (ACTION_LIST.md), then the Architect and the post-E1 review. Git preparation follows E1 and precedes E2. E2, DEV apply, sample loading and deployment remain held.

## v1.0 documentation pack installed — 12 November 2026 15:52 Asia/Dhaka

Engineering seat installed APBM-007A-CYBER-PHARMA_PACK_v1_0 (status TECHNICAL_FREEZE_E2_NOT_RELEASED) into this canonical module by compare-and-preserve. Package verified first: 185 of 185 indexed files match size and SHA-256; FILE_INDEX.json SHA-256 0f71d374b6c96b069ec57bc4458ef358edfb7b3775171942f31dbf30aea5a658 (kept as GOVERNING/PACK_v1_0_FILE_INDEX.json).
Result: 39 files added, 30 operative documents replaced, 115 already identical, nothing deleted. All E1 evidence in the pack was byte-identical to the installed evidence. Every replaced document is preserved: 22 in the pack's GOVERNING/HISTORY/v0_2_R1 snapshot, 5 as supersets of the local text (this file and four QAM files that gained only a banner), 3 QAM files under GOVERNING/HISTORY/v0_2_R1/LOCAL_PRE_V1_INSTALL. Local-only files untouched: seven portal screenshots and review ZIPs r1–r6.
No product code, Git state, provider, email, server, database, sample or deployment action. E1 COMPLETE; technical design frozen; **E2 NOT RELEASED**. Next owner: Tony — entry receipts in E2_RELEASE_REQUEST.md.

## Director ruling recorded; Git T1 satisfied — 12 November 2026 16:30 Asia/Dhaka

Portal origin stays on the personal GitHub account by Director ruling; Cyberize-Group transfer deferred and no longer an E2 blocker (APBM_RULINGS.md). Director completed Git preparation; verified read-only: both repositories on `apbm-007a` at bc4e433 / c89572a, portal lock restored, OwedBook `.env.pilot.example` restored. Original FFM repository stays preserved. Receipts appended to E2_RELEASE_REQUEST.md. Documentation only. **E2 NOT RELEASED.** Open entry items: tooling T2, private logins location, APA fixture approval, scope choice, release statement.

## E2 RELEASED — Director release recorded, 12 November 2026 16:40 Asia/Dhaka

Tony issued the E2 release in the engineering conversation: full v1.0 scope including failed-renewal grace and read-only enforcement; the labelled 10%-once whole-invoice sandbox APA fixture approved; the engineering effect capsule in E2_RELEASE_REQUEST.md approved. Personal Payment Portal origin accepted for this build.
Grouped local preflight PASSED with no blocker (EVIDENCE/E2/r01/preflight_result.json): both repositories on apbm-007a at bc4e4336f80d2e8cdbb628d4de29d08f8fc95694 / c89572a45210e7d6f098c2878cfabe9a1c5326f1 with no product change; APBM_DEV_* and APBM_SCRATCH_* blocks complete and accepted by the repo tooling guard; both apps on DEV with identical keys; private inbox file and the seven-role cast login sheet present at private paths outside Git.
Run ID: apbm007a_e2_r01. Source package: FILE_INDEX.json SHA-256 0f71d374b6c96b069ec57bc4458ef358edfb7b3775171942f31dbf30aea5a658. New E2 effect ledger starts at zero; the E1 ledger is closed and intact.
Phase: E2_IN_PROGRESS. Active writer: Claudy (engineering). Held: Git mutations (Director), DEV apply (checkpoint), sample loading, deployment, independent Q2. No local server started by Engineering outside QA testing.

## E2 r01 — code complete up to the DEV apply checkpoint, 12 November 2026 20:40 Asia/Dhaka

Phase: E2_IN_PROGRESS, **WAITING AT THE DEV APPLY CHECKPOINT**. Active writer: Claudy (engineering).
Built and self-verified, uncommitted on `apbm-007a` in both repositories: migrations 0053–0060 with harness, seed and runner updates; portal server, API, sandbox catalogue and screens; handoff, button-confirm sign-in, link request and provider-wide logout in both apps; OwedBook access banner, read-only hook and owner-only billing screen; operator sample-claims loader and reconcile command. Both apps: typecheck clean, lint 0 errors, tests 267 (OwedBook) and 371 (portal), production builds and client-bundle scan clean. SCRATCH: fresh, recovery and upgrade rehearsals PASS.
DEV: NOT touched. Apply bundle: EVIDENCE/apply/dev-0053-0060/APPLY_BUNDLE.md (preconditions met, read-only).
Reported to the Director: six unintended sign-in link requests on SCRATCH to undeliverable example.invalid addresses (test stub error; fixed); identity allowance 12 of 12 if SCRATCH harness identities count.
Next owner: **Tony** — (1) DEV apply decision with backup option A or B; (2) identity-ceiling ruling; (3) environment settings listed in EVIDENCE/E2/r01/PROGRESS.md; (4) grouped start of OwedBook :3000, portal :3001 and the Stripe listener for the integrated proof. Held: Git mutations, DEV apply, sample loading, deployment, independent Q2.

## E2 r01 — apply-review package delivered; DEV apply held for SQL review, 12 November 2026 evening

Director ruling: backup option B accepted; option A cancelled. No dump tool installed, no restore performed, no Auth data copied, no SCRATCH identity deleted, no identity extension. **Restore NOT PROVEN, explicitly accepted for this apply checkpoint.** The 12 SCRATCH identities count against the ceiling. Email-stub proof accepted.
Delivered: QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_APPLY_REVIEW_r01.zip (sanitized: eight SQL files, runner and changed helpers, inventory, DEV read-only receipts, SCRATCH rehearsal and preservation receipts, revised APPLY_BUNDLE, reconciled counters).
Phase: E2_IN_PROGRESS, waiting at the DEV apply checkpoint. Next owner: Tony — SQL review, then the apply command. **DEV apply HELD. No deployment before 007B completion.** No provider effect since the catalogue script.

## DEV APPLY DONE — migrations 0053–0060 applied, 12 November 2026 18:52 Asia/Dhaka (12:52 UTC)

Authority: Tony's explicit delegation of the DEV apply to the engineering seat, target yrsuwikjnbmvpznrgydb, scope the eight migrations pinned in APPLY_REVIEW_r01 (ZIP SHA-256 3bcfb74217093eb82479f83914b8c80c6a46a07de15d0ab2a35a3cd06ba0e015). Option B stands; restore NOT PROVEN and accepted.
Pre-checks matched (ZIP hash, file hashes, target, ledger prefix 52, live catalogue fingerprint). Exact bundle command run once: PASS, eight files committed, last 0060_billing_reads.sql. Ledger 60, equal to the manifest by name and checksum.
Verified after apply: 16 pre-007A tables byte-identical, same 16 Auth users, old indexes kept; grants, policies, RLS and the sign-up trigger as intended; DEV catalogue identical to the rehearsed SCRATCH result; 24 authenticated checks PASS with three seeded identities (3 sessions, 3 local sign-outs, no identity created, no email).
Record: EVIDENCE/apply/dev-0053-0060/APPLY_BUNDLE.md §8 and receipts.
Phase: E2_IN_PROGRESS. Next owner: Tony — environment settings and the grouped start of OwedBook :3000, portal :3001 and the Stripe listener, for the integrated proof. Held: Git mutations, sample loading, deployment (none before 007B completion), independent Q2.

## E2 r01 — ENGINEERING RETURN, 12 November 2026 21:10 Asia/Dhaka

Integrated proof on DEV with the Director's servers: main paid journey (OWNER_1, existing identity, signed in, APA fixture, USD $89.10), provisioning, both handoff directions, owner billing with cancel and undo, denials, switch and provider-wide logout PASS. FAIL: live signed-webhook delivery (portal STRIPE_WEBHOOK_SECRET differs from the listener's; provisioning came from the reconcile path). NOT RUN: brand-new owner (coverage gap; no identity authorised), signed-out existing identity, declined card, test-clock renewal, email click, only-card removal. Two defects found and fixed during the proof. Checks rerun: OwedBook 276 and portal 389 tests, lint 0 errors, builds and bundle scan clean.
Handoff: EVIDENCE/E2/r01/ENGINEERING_HANDOFF.md; ZIP QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r01.zip. Candidates uncommitted; candidate SHAs pending the Director. Next owner: Tony (webhook secret, gap decisions, commit), then independent Q1. No deployment before 007B.

## E2 r01 — webhook failure closed, 13 November 2026 10:25 Asia/Dhaka

After the Director removed a duplicate STRIPE_WEBHOOK_SECRET line (the old value had been winning at runtime) and restarted the portal, a cancel in the hosted portal and an undo from the app on OWNER_1's existing subscription produced two signed customer.subscription.updated events, both processed; the mirror set and cleared cancel_at; the subscription is left active. The 12 November FAIL stays on record as closed. A third defect was found and fixed: the undo's idempotency key was derived from the schedule and was replayed by Stripe within 24 hours. Portal tests 390 pass. No checkout, payment or identity. Handoff and ZIP revised (r02). E2 remains at engineering return; next owner Tony (gap decisions, commit), then independent Q1. No deployment before 007B.

## E2 r01 — commit handoff prepared for Q1, 13 November 2026 11:00 Asia/Dhaka

Engineering prepared the two-repository commit handoff: finite product lists (OwedBook 58 paths; Payment Portal 131 paths including 20 deletions), finite record lists (OwedBook module records; portal operating records), exclusions, SHA-256 and git blob ids, copy-paste staging and commit commands with a verification script (EVIDENCE/E2/r01/commit/). Q1 carry-over (NOT RUN N1–N13, incomplete I1–I7, risks R1–R7 including unmapped webhook events answered 200) added to ENGINEERING_HANDOFF.md §11; outgoing checkout record filled in QAM/HANDOFFS/QA_HANDOFF.md. Nothing committed by Engineering. Next owner: Tony (commit by the lists), then independent Q1. No deployment before 007B.

## E2 r02 — F-Q1-01 repair and Amendment A1, 13 November 2026 13:50 Asia/Dhaka

Assignment: JARVIS consolidated repair after Q1 finding F-Q1-01. Director paused QA and returned both checkouts to apbm-007a (QA's files backed up; untouched).
Repair (Payment Portal, 8 paths): unfinished supported events are never processed or 2xx; owned/unresolved/foreign classified from database mappings and the application's marker; busy and unsettled stay retryable; guarded ledger writes; exact-ID audited recovery of unfinished and pre-repair suspect events; checkout marker now names its database. Added the G5 renewal_reminder record (r01 I1 had overstated it). Unit proofs a–f PASS; portal 412/412, typecheck clean, lint 0 errors, disposable build and bundle scan clean; 7 poison controls caught. DEV read-only: 2 events, 0 suspect, 0 unfinished. No schema change, no live effect beyond that read.
Amendment A1 recorded: APBM_RULINGS, AMENDMENT_LEDGER, ACCEPTANCE_SPEC, BILLING, IMPLEMENTATION_REQUIREMENTS RA-6, ENVIRONMENT_AND_EFFECTS, QA_HANDOFF, CARRY_FORWARD_007B (O-1 live renewal/grace NOT RUN BY DIRECTOR RULING; O-2 reminder email).
Record: EVIDENCE/E2/r02/REPAIR_F-Q1-01.md; commit handoff EVIDENCE/E2/r02/commit/. Next owner: Tony (two commits per repo, verify), then QA rebinds the candidate pair. No deployment before 007B.

## Q2 repair r03 — F-Q2-001 and F-Q2-002, 16 November 2026 (engineering seat)

Recorded r02 commits (from Git): portal product `9322405fe0238882c21c75ef62733fc8c732fed0`, portal records `9d938f62bff6172f9332ae6c67775e4b8feea379`, OwedBook records `37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40`. These are the pair QA ran Q2 a01 against. Friday adjudicated Q2 a01 **FAIL** (relayed by JARVIS; QA's records still say awaiting adjudication and are untouched).
Repair on `qa/apbm-007a` (QA line; no branch switch), Payment Portal only, 5 paths:
- F-Q2-001: the pharmacy step adopts the saved server draft before clearing its temporary input, and a completed save can no longer trigger the stale owner guard.
- F-Q2-002: undo clears the flag, re-reads, clears the date if still set, re-reads, and reports success only when both are clear.
Checks: portal 429/429 (tested copy and QA checkout), focused 69/69, typecheck clean, lint 0 errors, production build and bundle scan clean, poison controls caught. Production-browser walk on a disposable build reached review with the server's $99.00 quote, survived refresh and edit/back/return, and stopped before checkout.
Effects: DEV 1 synthetic draft (3 saves, 3 quotes) and 1 NPI hold; nothing else.
QA's 5,011 uncommitted paths backed up privately and verified unchanged. Erratum E-A1-1 recorded.
Record: EVIDENCE/E2/r03/REPAIR_F-Q2.md; commit handoff EVIDENCE/E2/r03/commit/. Next owner: Tony (portal product and records commits, OwedBook records commit, verified), then Cody binds the new pair and retests under Friday. No deployment before 007B.

## Q4 repair r04 — F-Q4-001 / AC-011, 16 November 2026 (engineering seat)

Recorded r03 commits (from Git): portal product `4cd96c82da59a093d1330307f5a27836b17f1df5`, portal records `357c274284f48ed5ad3bf8407ca0a14d0d9b99e8`, OwedBook records `f637ba4086c1e906e008b8892c880ec6489bba9a`. QA Q4 a03 ran on this pair. Friday: F-Q4-001 acceptance failure AC-011, MEDIUM, not an r03 regression.
Cause: a retry with a different operation key treated a `created` operation with no recorded session as unpaid, released it and opened a new operation, so Stripe created a second customer and session. Every retry also recomputed the session expiry, which real Stripe refuses under a repeated key.
Repair (`checkout.ts` only, on `qa/apbm-007a`): an unknown-outcome attempt is resumed under its own keys with the stored planned expiry; it is never released on a missing reference; an edited draft settles the earlier attempt with Stripe first and keeps the customer.
Checks: portal 444/444 (tested copy and QA checkout), focused 15/15 (9 fail on the candidate), 9 poison controls caught, typecheck clean, lint 0 errors, production build and bundle scan clean; rolled-back SCRATCH proof PASS (candidate control FAIL).
Effects: none outside two rolled-back SCRATCH transactions.
QA's 3,422 paths backed up privately and verified unchanged.
Record: EVIDENCE/E2/r04/REPAIR_F-Q4-001.md; commit handoff EVIDENCE/E2/r04/commit/. Next owner: Tony (commits, then rebuild and restart the portal on the repaired candidate); then Friday binds the pair and retests. No deployment before 007B.
