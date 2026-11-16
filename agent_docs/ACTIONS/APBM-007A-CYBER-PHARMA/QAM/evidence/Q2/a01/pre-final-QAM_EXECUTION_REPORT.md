# STOP-002 — high-severity registration-to-payment blocker

Q2 attempt a01, 2026-11-13. B11 mandatory stop. Candidate pair and approved plan unchanged: OB 37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40; Portal 9d938f62bff6172f9332ae6c67775e4b8feea379; repair 9322405fe0238882c21c75ef62733fc8c732fed0; plan 2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672.

F-Q2-001: HIGH, core registration-to-payment journey cannot reach review/quote. Affected AC-007/009/034 and dependent new-owner AC-013/016/018. This is an observed browser-path blocker, not a claim of bad charging, tenant exposure or provisioning corruption.

Independent expected result: after valid owner/declaration and pharmacy submission, server-owned draft is saved and browser reaches review with current standard USD 99 quote; optional approved APA gives USD 89.10, then explicit consents permit sandbox checkout. No backend bypass or manually navigated review should be needed.

Actual: two isolated Chromium attempts at 1440x1000 using synthetic pharmacy data and the approved private new-owner alias. Each saves owner/pharmacy/NPI, then times out waiting for /register/review. Second attempt's live browser inspected in memory: pathname /register/owner, heading Tell us about you, no due-today control. Both server drafts remain draft, owner/pharmacy saved, quote_total_cents NULL. No checkout submission, no payment submission. QA script safe error page.waitForURL timeout 30000ms. First generic helper error retained; second safely diagnosed. QA inspector was enabled only on its own stalled helper to inspect the existing page without creating a third draft. No app restart or product edit.

Evidence:
- new-owner-attempt1.json / new-owner.json: attempt stages and submit counters.
- new-owner-runtime-observation.json / new-owner-alert.json: existing page state; empty alert, not evidence of a validation reason.
- new-owner-db-observation.json: exact two draft IDs and saved-state Booleans, no private address.
- independent helper new-owner.cjs / new-owner-retry.cjs: exact input selectors and assertion sequence.
- source PharmacyStepView.tsx: after successful save clears registration forms before router.push(review); effect can replace route with owner when ownerOk becomes false. This race is a candidate explanation, NOT independently established root cause. Engineer owns diagnosis.

Reproduce: existing QA helper contexts retained. Alternatively, authorized clean context /register/owner, fill valid synthetic owner/declaration, /register/pharmacy fill valid required fields and checksum-valid unused NPI, optional NCPDP blank, submit; observe route and saved draft. Further reproduction would spend another draft/reservation and requires Lead direction. Do not pay, manually bypass route, expire/delete drafts or release reservations now.

Stop disposition requested from QA Lead via Director: adjudicate F-Q2-001 and route to Architect for bounded Engineer diagnosis/repair or test interpretation. Any product/config/DB change needs Lead impact disposition and new pins/retest binding. No self-certification.

Prior work in this attempt:
- ID-only SCRATCH snapshot taken before first write; ledger 60/60 hash matches both targets; tenant-table privileges reviewed, dangerous grants absent. Original overbroad anon assertion and corrected scoped result both preserved. Global/reference/profile/role residual grants remain observations, not tenant leakage findings.
- Independent webhook unit adapter checks 8 PASS, including poison control and signature/owned-late-map/duplicate/foreign/busy/receipt-fault/historical recovery. Unit-only, no claim of live provider/real-DB recovery proof. First fake-row aliasing failure preserved and corrected in helper only.
- SCRATCH SQL grace and billing-role checks 14 PASS; one explicit existing subscription fixture, four updates plus audited trigger effects within rollback. No persistent fixture row, Auth write, reset or seed.
- Chromium B7 synthetic past-due banner visible both themes x 375/1440, no horizontal overflow; one seeded UNRELATED password session minted. No logout/revoke/identity deletion.
- Live raw signature negatives 400; valid signed synthetic unsupported event and duplicate 200. One QA event retained as ignored/unsupported, attempts 0. Two inherited DEV events remain processed, no unfinished rows observed. Synthetic control is not provider delivery proof.
- T-018 sample-loader write/idempotence BLOCKED: fixed 50-row dataset exceeds approved 20-row scenario ceiling; no loader execution. No Auth mutation in inspected loader, only an owner-classification read. No ceiling increase inferred.
- AC-004 independent rehearsal NOT RUN by Lead ruling; reused E2 provenance plus independent read-only verification only; certification limitation.

Counters/retention at stop:
DEV: 1 seeded login/session; 2 QA drafts and 2 reservations; 1 synthetic signed-event receipt; 0 checkout operations/sessions submitted, 0 new Stripe customers/subscriptions/payments, 0 Auth identities created, 0 access emails sent. Stripe sandbox account retrieval twice, no Stripe mutation. Browser read audit effects not yet fully reconciled; include as outstanding count reconciliation, not zero.
SCRATCH: four fixture updates rolled back; associated audit writes rolled back; no persistent fixture/auth writes. Sequence increments, if any, not rolled back by PostgreSQL and not claimed restored. No reset, seed, delete, deployment or cleanup. Both browser helpers retained, no auth-state export. No further effects after high-severity finding recognized.

Q2 INCOMPLETE. Remaining acceptance checks NOT RUN / BLOCKED by stop; no local Gate Q certification or broad PASS. Original a02/B1/STOP-001 archives untouched.
