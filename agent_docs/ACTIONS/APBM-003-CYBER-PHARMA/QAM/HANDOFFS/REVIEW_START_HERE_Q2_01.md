# REVIEW_START_HERE — `APBM-003-CYBER-PHARMA` Q2 package (execution), attempt 01

> Filled copy by Claudy (QA Executor), 2026-11-09T10:50:00+06:00. The first file a reviewer opens. Facts only; no verdict.

| Field | Value |
|---|---|
| Package | `APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip` — SHA-256 recorded **outside** this package (`HANDOFFS/README.md`, return message, live `QAM_STATE.md`). `QAM_STATE.md` here is the pre-export snapshot. |
| Reviewer and decision requested | **QA Lead (Friday):** adjudicate `FINDINGS.md` §1 (F-01…F-08) into §2 dispositions and the 44 matrix rows (`AC_EVIDENCE_MATRIX.md`); decide AC-401 (C-02 accepted limitation) and AC-601 (F-01 demo labels over live data); decide whether F-02/F-06 (pre-existing hardening items) and F-05 route to this module or a follow-up; then `QAM_CERTIFICATION.md` or one consolidated repair ruling (§8). **Director:** SCRATCH signup posture (AC-404 SCRATCH half BLOCKED); records for AC-9xx (F-03, with Cody); rotate the two database passwords and purge the transcript line named in F-04. |
| Identities | candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1` · QA execution HEAD `4d64504e85c56f1c987a703dd94575f489cb99ce` (3 `agent_docs`-only commits above the candidate; product diff 0 lines) · bound plan SHA-256 `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` · approval §1–§2 (Friday) · release §3 (Tony, 2026-11-09, commit `189df31`) · SCRATCH `ihgcsrypblqkwommrkgj` · DEV `yrsuwikjnbmvpznrgydb` · LOCAL `127.0.0.1:3138` |
| Current state | `Q2 COMPLETE — AWAITING ADJUDICATION` |
| Active stop | none |
| Totals (44 ACs) | PASS 35 · FAIL 3 (AC-901/902/903 records) · BLOCKED 1 (AC-404 SCRATCH half) · NOT RUN 3 (AC-701/702/703) · ADJUDICATE 2 (AC-401, AC-601) |

## Read in this order
1. `QAM_STATE.md` 2. `QAM_EXECUTION_REPORT.md` (§1 entry, §2 log, §3 helper corrections, §9 summary) 3. `AC_EVIDENCE_MATRIX.md` 4. `FINDINGS.md` §1 and §3.1 5. `evidence/derivations/01/*` (the QA-derived references, written before the tests) 6. the evidence lane a row cites (`evidence/INVENTORY.md` lists all 353 files) 7. `AUTOMATION/README.md` (how each instrument was attacked) 8. `QAM_PREFLIGHT.md` Q2 cells.

## Summary
One coherent campaign on 2026-11-09 (09:15–10:45 +06). Identity gate passed; derivation artifacts preceded every graded test. Group A (board 39/196, allowlist, auth path, generator, mocks, harness diff) PASS. Group B on SCRATCH: from-scratch replay + no-op + tamper refusals + forward 0048–0052, 15-policy catalog, reseed-equality with poisoned controls, identity scan, 250-row money arithmetic, 285 attributed seed audit rows, 7-identity denial/wrapper/owner-reach/admin-RPC matrix with real logins (172 PASS; expectation-flip control FAILs), trigger correction, one-admin index, `rls:prove` (320 cells, 15 observed policies) + corrupted-expectation RED, `audit:prove` 8/8, `db-verify` + probes GREEN. Group C on DEV (read-only through `ro-sql.sh`): ledger = committed hashes, catalog projection = receipt, counts = derivations, signup disabled; real app on `:3138`: 7-identity browser matrix, spoof refusals, R-016 states, no-mutation hashes, 18/18 UI audit counts, auth walk, 14 viewport×theme cells, mock kill switch. Open: inherited demo labels over live admin data (F-01), unfilled handoff records (F-03), SCRATCH signup posture (AC-404), pre-existing hardening items (F-02 TRUNCATE grants; F-06 cross-tab sign-out), plan-text corrections (F-07), and an Executor credential-handling incident (F-04).

## Not included
`.env.qa.local`, `.env.local`, the `/tmp` cast files (seed-generated SCRATCH passwords, removed after use), auth state/cookies/tokens (HARs are body-less and header-sanitised), Playwright binaries, `node_modules`/`.next`, the QA copy tree, previous review ZIPs (Q1/Q1b). Tenant rows appear only as counts/hashes.
