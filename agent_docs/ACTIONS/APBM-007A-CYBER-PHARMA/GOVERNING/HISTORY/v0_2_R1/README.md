# APBM-007A-CYBER-PHARMA — owner purchase to OwedBook

Version 0.2 · 11 November 2026, Asia/Dhaka · Author: JARVIS · Reviewer: Friday · Director: Tony.

**STATUS: APPROVED PLANNING BASELINE v0.2 R1. DIRECTOR CHOICES/EMAIL INPUTS RESOLVED. E1 RELEASE REQUESTED, NOT GRANTED; E2/DEV APPLY/QA/DEPLOY NOT RELEASED.**

This package turns the combined decisions into a concrete 007A proposal and a focused E1 preparation assignment. The earlier cross-repository code recon is retained. E1 closes operational gaps; it is not a restart of APBM003 or a full repeated code recon. E2 is held until the readiness ledger is evidenced, the handoff design is reviewed, contracts are frozen and Tony releases execution.

Outcome: one owner purchases one pharmacy in the Cyber Pharma Stripe sandbox, receives a passwordless access link, sees that store in real-mode OwedBook, crosses between apps without another login, and manages billing. Payment uncertainty, duplicate events, interrupted provisioning and failed email have recoverable states.

Read E1_RELEASE_REQUEST.md for the pending Director action, DIRECTOR_PREP.md for resolved inputs and APBM_ENTRY.md for dispatch. REVIEW_START_HERE.md records the first-review limitation and cadence. The acceptance contract is APBM_ACCEPTANCE_SPEC.md. Proposed technical choices are in CONTRACTS/; the accepted first-review amendments govern this draft; final provider/SQL/API choices become accepted at the one post-E1 architecture review and freeze. No independent result or approval is prefilled.

The existing DEV project is retained. Password rotation is deferred by Director decision 3.4; this package does not reimpose it as an entry blocker. Synthetic/public data only. Production is outside scope.

Canonical installed module: OwedBook `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`. Payment Portal receives a small pointer to that same workspace module after installation; do not maintain two independently editable packs. All migrations remain in OwedBook. No application repositories were available to this author; source assertions below are attributed to supplied recon and receipts.
