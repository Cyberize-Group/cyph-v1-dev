CODY — FROM THE QA LEAD, VIA THE DIRECTOR — Q4 binding and release — APBM-007A — 2026-11-16
Record verbatim in QAM_APPROVAL.md. Governing: QAM §§9–11, RRM §§7, 9, 12. No new Q1, no new plan approval. The approved plan (SHA-256 2ffbfd8b…9672) and effect capsule stay in force.

ADJUDICATION OF Q2 a01 (package 8680ff27…47f9) — record in FINDINGS.md as Lead dispositions
- Verdict on pair 37f6c0d / 9d938f6: FAIL.
- F-Q2-001: acceptance failure, HIGH (AC-007/009/034). F-Q2-002: acceptance failure, LOW-to-MEDIUM (RA-4/AC-030). Both routed to repair.
- LR-01 accepted as certification limitation. LR-02: live owned proofs from DEV journeys; fault/recovery proofs run the candidate handler in-process against real SCRATCH with mocked provider; real-Auth crash (T-017) stays a carried gap. LR-03: loader approved on SCRATCH, one synthetic store, 50 rows then 0. LR-04: required now, Executor-owned. LR-05 accepted; capture natural listener delivery for owned journeys. LR-06 open with Director/Architect. LR-07 grouped Director session. LR-08 carried limitation. LR-09 no cleanup of business/provider fixtures.

IMPACT DISPOSITION OF REPAIR r03 (package SHA-256 0e6d42dedc112d524e1352262536771b6b94dc826bd5ea307b9d5da4d44bda22)
Product change: Payment Portal only — PharmacyStepView.tsx, server/billing.ts, three test files. OwedBook product and all migrations unchanged. Accepted as the bounded repair input. Engineering's proof is a claim, not your evidence.

BIND
The Director has committed on qa/apbm-007a and rebuilt/restarted the Portal. Read both HEADs. Verify them against EVIDENCE/E2/r03/commit/COMMIT_MANIFEST.json (SHA-256 a1494098aa4c7f9c34a1d9b3ad79a9673b8e366b8688162c550cd6ed707145ae): parents 9d938f6 / 37f6c0d, portal product commit = exactly the 5 listed paths, the rest records only. Record the full SHAs as the Q4 pair. Verify the served Portal is that build. A mismatch is STOP-IDENTITY for the affected work only.

HOUSEKEEPING FIRST (your own lane)
Disk is low. Remove your disposable a02 build mirrors and npm cache under QAM/AUTOMATION/a02 and stop your two sleeping a01 helper processes (new-owner.cjs, new-owner-retry.cjs). Keep all records and evidence.

RUN, CONTINUOUSLY, ONE PASS
1. Portal baseline at the new product commit: install, typecheck, lint, unit, production build, QA-controlled.
2. F-Q2-001: fresh-context registration owner → pharmacy → review with server quote; refresh; edit/back/return; incomplete and deep-link negatives; consent gating. Chromium both themes at 375 and 1440; Firefox and WebKit at 1440.
3. Journeys that were blocked: new owner A purchase with the one approved DEV identity (payment, provisioning counts, access email sent); OWNER_2 signed-out purchase; declined card; AC-011 double-submit; live event ledger per B5. The access email is an approved product effect; send no other mail.
4. F-Q2-002: undo from flag-only, date-only, both-set if reachable, already-clear, re-read live in the sandbox; partial failure by your own unit adapter.
5. All LR-04 gaps and the LR-02 and LR-03 items above.
6. Required regression. Evidence for byte-unchanged files may carry forward with its original pair and stated applicability; anything touching billing.ts or the registration screens is rerun.

EFFECTS
Ceilings are cumulative with a01 usage. DEV drafts and reservations ceiling is 6 each. Engineering left one DEV draft and an NPI hold on 1373398746: log it as engineering's, do not use or remove it.

DIRECTOR SESSION — ONE, AT THE END
Do not pause mid-run for the Director. Everything needing his inbox or his click (new-owner access link, OWNER_2 link sign-in, replay/expiry, paid-owner billing/portal/cancel/undo/only-card checks that need a real signed-in owner) goes into one ordered script. Return it with the package: what he clicks, in what order, and what you then drive in the same browser context.

STOPS
Only the QAM §11 stop types, and only for the affected work. Product failures are findings; mark dependants BLOCKED and continue. Decisions you would otherwise ask me for: take the conservative option inside the plan, log it as a Lead-review item.

RETURN
QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REVIEW_a01.zip with SHA-256 and a Downloads copy: matrix, findings, Lead-review items, effect ledger, coverage, and the Director session script. No cleanup of fixtures, no identity deletion, no self-certification. No deployment before 007B.
