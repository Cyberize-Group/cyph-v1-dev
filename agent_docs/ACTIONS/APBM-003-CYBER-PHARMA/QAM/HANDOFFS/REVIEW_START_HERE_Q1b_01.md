# REVIEW_START_HERE — `APBM-003-CYBER-PHARMA` Q1b package (amendments + credential tooling), attempt 01

> Filled copy by Claudy (QA Executor), 2026-11-07T16:24:21+06:00. The first file a reviewer opens. Facts only; no verdict.

| Field | Value |
|---|---|
| Package | `APBM-003-CYBER-PHARMA_Q1b_REVIEW_01.zip` — SHA-256 recorded **outside** this package (`HANDOFFS/README.md`, return message, live `QAM_STATE.md`). `QAM_STATE.md` here is the pre-export snapshot. |
| Reviewer and decision requested | **QA Lead (Friday):** record amended plan SHA-256 in `QAM_APPROVAL.md` §2 → `APPROVED — NOT RELEASED`; rule AM-7 (`HANDOFFS/Q1b_AM-7_DRAFT.md`) and the §4-vs-§2 publishable-key name discrepancy. **Director:** run `AUTOMATION/make-qa-env.mjs` (`--cast`, `--dev-db-source`, `--force`), then `check-qa-env.sh`; confirm R-10, state SCRATCH signup posture (AM-6); commit §C errata R-2/R-6; record §3. |
| Identities | candidate = HEAD `308247a24e6ddd455842da5cd2e21541d7eae2c1` · plan after AM-1…6 SHA-256 `e8c4d5ac46635c2054e2d61073197db695ecd542a6281d4e561b0a6854bce061` (pre-amendment `8bc53eba…ff8a9`) · approval §1 APPROVED WITH EXACT AMENDMENTS (Friday) · §2 binding NOT RECORDED · §3 release NOT RECORDED |
| Current state | `Q1 AMENDED — AWAITING QA LEAD BINDING` |
| Active stop | none |

## Read in this order
1. `QAM_STATE.md` 2. the response artifact (`agent_docs/RESPONSES/…q1b-amendments.md`) 3. `QAM_TEST_PLAN.md` §8 then the amended cells 4. `QAM_APPROVAL.md` (as read) 5. `evidence/env/01/credential_mapping.md` 6. `AUTOMATION/make-qa-env.mjs`, `check-qa-env.sh`, `AUTOMATION/README.md` 7. `HANDOFFS/Q1b_AM-7_DRAFT.md`.

## Summary
AM-1…AM-6 applied verbatim by asserted exact-string replacement; §8 filled. Credential reconciliation by key name only; generator written and self-tested (31/31, synthetic fixtures, zero value leakage), **not run** against real sources; checker run against the inherited `.env.qa.local` → ignored + untracked, but 4 undeclared keys / 21 missing (GAP, untouched, mode 664). Duplicate `APBM_DEV_DB_URL` in `.env.local` (two hosts) needs a Director source choice. No Q2 execution. No product change. Cast values never opened.

## Not included
Credential files (`.env.local`, `.env.qa.local`, `/tmp` cast) — never packaged. Unchanged Q1 members (recon report, preflight evidence) — in `APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip`.
