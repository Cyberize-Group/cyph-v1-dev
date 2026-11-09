# APBM_RULINGS — APBM-003-CYBER-PHARMA (append-only ruling / erratum lane)

**Owner:** Director rules; Architect records; JARVIS (Chief Architect) may record architectural resolutions from E1. Append only. The frozen contract (`APBM_ACCEPTANCE_SPEC.md` once stamped FINAL, and `CONTRACTS/*`) is never edited in place; corrections land here with original observation, exact corrected interpretation, approving authority, date and affected ACs (QAM_PLAYBOOK §4). A plan amendment never modifies a contract.

## A. Rulings in force at authoring (recorded from Director decisions of 2026-11-05)

| ID | Ruling | Authority / date | Source record | Affects |
|---|---|---|---|---|
| R-01 | **D-1(a): close both read-audit layers in APBM-003.** OwedBook application reads use the audited `owedbook_*` wrappers AND ordinary authorized users' direct reads on `user_data` are revoked so no read bypasses the audit. BIM-002's affected isolation matrix and the `rls:prove` harness are reworked without weakening tenant-isolation assertions. CF-10 requires implementation and independent proof before Target One acceptance. | Director (Tony), 2026-11-05 | `CYBER_PHARMA_PLAN_v3_0_DIRECTOR_RULINGS_2026-11-05.md` D-1 | AC-3xx, AC-8xx, `CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md` §3 |
| R-02 | **D-2: synthetic and public data only.** No retrieval, upload or processing of Frank's real claim files anywhere in this module. Real-data validation, Heather's review and the early owed report remain deferred. The Target One seed is a documented synthetic generator; the legacy demo export (7,427 rows) is format intelligence only and is not loaded. | Director, 2026-11-05 | same, D-2 | AC-2xx, `CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` §1 |
| R-03 | **D-4: the account owner reads every store in their own account**, audited, without a separate admin/member membership per store. Cross-account isolation, existing admin/member boundaries, one admin per store and no role switching are preserved. | Director, 2026-11-05 | same, D-4 | AC-1xx, AC-5xx, ownership contract §2 |
| R-04 | **Phase-numbered module IDs.** `APBM-003-CYBER-PHARMA`; branches `apbm-003-cyber-pharma` / `qa/apbm-003-cyber-pharma`; a second module in a phase takes a letter suffix (`APBM-007B`). Historical BIM/RRM identities stay. | Director, 2026-11-05 (plan v3.0 §4) | plan v3.0 §4 | identity everywhere |
| R-05 | **Seed as the one fixture source of truth (proposed default, confirm at E1 resolution).** `src/mocks/owedbook.ts` is regenerated from the synthetic generator so mock mode and seed never disagree again (E-13: 149/150 current fixtures violate money rule 3). Mock mode stays as the kill switch. | Architect proposal (Friday); Director confirms at E1 resolution | plan v3.0 §6 step 3 | AC-205 |
| R-06 | **Admin page = read views only in this module.** Stores, members, audit viewer, billing status (read-only) read real rows; invite, settings and billing actions stay mock behind a visible "not available in this release" state. Writes belong to APBM-007. | Architect (campaign map R-7, plan v3.0 §6) | plan v3.0 §6 | AC-6xx |
| R-07 | **One module, one declared stop.** BIM-004 (seed), APPLY SESSION and BIM-005 (CRV) are succeeded by this single APBM; the APPLY checkpoint is a declared Director stop inside E2, not a separate module. | Director (plan v3.0 §16 "Phase 3 packaging"), 2026-11-05 | plan v3.0 §16, §6 | `CONTRACTS/SUCCESSION_RECORD.md` |
| R-08 | **Test cast = delivery plan page 4.** A one-store owner; a three-store owner who also administers one of the three; separate store admins; members with assigned access; an unrelated account. An internal-operator identity only for explicitly authorized tests. The older map §6 cast (owner-A/staff-A/owner-B/multi-store/superadmin) is retired. | Director (plan v3.0 §6 acceptance cast) | plan v3.0 §6 | AC-2xx, QAM coverage |
| R-09 | **Audit event counts follow an operation contract, never "one screen = one event".** E1 enumerates the wrapper calls each screen makes (including retries and refreshes); the expected row counts per operation are fixed at E1 resolution in the ownership contract §4 and are what QA grades. | Plan v3.0 §6 (Chief Architect); Director brief §6 | plan v3.0 §6 | AC-3xx |
| R-10 | **Cloud actions.** Authorized agents execute explicitly scoped deployment work after Director target approval and user-only authentication; the Director still performs every Git mutation. | Director (plan v3.0 §4 governance) | plan v3.0 §4 | stage 8, AC-7xx |

## B. Open at authoring (do not block E1; must be recorded before E2 release)

| ID | Question | Owner | Needed by |
|---|---|---|---|
| O-01 | D-6: adoption of plan v3.0 draft 3 as plan of record | Director | before E2 approval (E1 may run under the Director's authoring/recon instruction) |
| O-02 | Confirm R-05 (regenerate `mocks/owedbook.ts`) or freeze the current mocks as legacy | Director at E1 resolution | E2 approval |
| O-03 | PBM reference table tenancy for the seed: global PHI-free directory (plan v3.0 §10 recommendation) vs per-tenant | Director | E2 approval (seed shape depends on it) |
| O-04 | The exact set of component files permitted for R-016 error/loading/empty states (from E1's inventory of current fetch handling) | JARVIS at E1 resolution | E2 approval; AC-507 |
| O-05 | Recon skill: actual path, version and capabilities | Cody reports at E1 | E1 return |
| O-06 | Which of the current admin demo screens are "agreed admin read views" for Target One (stores, members, audit, billing status proposed) | Director at E1 resolution | E2 approval; AC-6xx |
| O-07 | Deployment: the actual Cloud Run service/project/region behind `cyber-pharma.cyberizedev.com` and the dev-Supabase environment variables the service needs | Cody reports at E1; Director approves target | E2 approval; AC-7xx |
| O-08 | Director confirms DA-2 done on dev and SCRATCH with evidence (`EVIDENCE/apply/DA-2_SUPABASE_SIGNUP_DISABLED.md`) | Director | before the APPLY checkpoint at the latest |

## C. Errata and post-freeze rulings (append below; never edit above)

| ID | Erratum | Authority | Date | Effect |
|---|---|---|---|---|
| C-01 | `E2_AMENDMENT_A01.md` (rulings A01-1…A01-7 and its exact file list) is **in force** as the grading text for AC-104, AC-302, AC-403 and AC-502, and resolves the `<<E1>>` placeholders in the spec, OAC and SFC through the QA plan's derivation artifacts (QAM_APPROVAL AM-1). The §D "DRAFT / NOT IN FORCE" label is superseded. | Director (Tony); recorded on QA Lead request (recon R-2) | 2026-11-09 | QA grades against A01; no FINAL stamp is manufactured retroactively |
| C-02 | AC-401's "restore … rehearsal on disposable target demonstrated" clause is **accepted as a limitation, not met**: the DEV APPLY receipt records `restoreVerified: false` (synthetic application rehearsal; SCRATCH lacks four `auth.users` indexes). QA grades AC-401's other clauses and records the restore clause as ACCEPTED LIMITATION. Carried to the Phase 8 production package. | Director (Tony); recon R-6 | 2026-11-09 | AC-401 cannot PASS in full; it is not FAIL |

Transcribed by Cody on Director instruction, 2026-11-09; authored by Director/QA Lead per QAM_APPROVAL.md §3.

**C-03 (scope amendment, A01 exact list):** add `src/components/admin-portal/DemoMarker.tsx` and `src/components/admin-portal/BillingScreen.tsx` to the permitted existing-file list for the purpose of F-01 only: in real mode, remove or replace the "Demo · mock data" pill and the "Visual only — no real charge is made in this demo" footer with truthful copy (e.g. "Synthetic test data" and "Billing actions unavailable in this release"); mock mode keeps its existing copy. No other behaviour change. Optional under the same ruling, Cody's discretion: F-05 one-line guard in `OwedBookContext.selectStore` (already-allowed file) — if taken, it is declared in the manifest §8 and retested under T-33.

Authority: Director (Tony). Adjudication: Friday (QA Lead), 2026-11-09. Transcribed from `QAM/HANDOFFS/Q2_ADJUDICATION_01.md` §3 on Director instruction.

| ID | Erratum | Authority | Date | Effect |
|---|---|---|---|---|
| C-04 | AC-404 SCRATCH half ruled **N/A for Target One**: SCRATCH `ihgcsrypblqkwommrkgj` is a disposable engineering target with no tester exposure; the DEV half (`disable_signup: true`, read-only GET) PASS stands. Finding F-08 closed. Supersedes the BLOCKED label in Q2 attempt 01 and the AM-6 conditional. | Director (Tony), 2026-11-09, on QA Lead adjudication | 2026-11-09 | AC-404 grades PASS (DEV) / N/A (SCRATCH) in Q4 without a signup attempt |
| C-05 | Director risk acceptances for Target One: (a) **F-02** residual TRUNCATE/REFERENCES/TRIGGER grants to `anon`/`authenticated` (and INSERT/TRUNCATE/REFERENCES/TRIGGER on `audit_logs`) from the BIM-001 bootstrap default ACL — not reachable through PostgREST or the app; hardening migration `0053_privilege_hardening` scheduled for the next forward-migration module; (b) **F-04** local-transcript credential exposure — rotation of SCRATCH/DEV database passwords **deferred by the Director**; exposure confined to the Director's own machine; `.env.qa.local` remains valid; (c) **F-06** cross-tab sign-out delay — pre-existing, auth path protected, recorded in the TRC §2 tester limitations. | Director (Tony), 2026-11-09 | 2026-11-09 | None of (a)(b)(c) gates Gate Q; all three appear in `QAM_CERTIFICATION.md` limitations |

transcribed by Cody from Q4_RELEASE_RECORDS_2026-11-09.md

🥄

## D. Proposed amendment A01 — NOT IN FORCE

User reports JARVIS accepts E1; Cody was instructed to prepare documentation. A01-1 through A01-7, exact paths, AC replacements and Director recommendations are consolidated in E2_AMENDMENT_A01.md. Pending Tony decisions and JARVIS FINAL binding. No approval inferred.


## A02 — Director-approved two-file test allowance — 2026-11-06

Authority: Tony's current message explicitly adds exactly these files to the APBM-003 E2 ceiling:

- `src/__tests__/services/owedbook.test.ts`
- `src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx`

This is an additive exception to A01's finite file list and its stage assignments: stage-5 checkpoint correction may update stale fixture expectations in these two files; stage 6 may update the KPI failure expectation when its approved UI behavior is implemented. Keep every test enabled and preserve coverage. Approved fixture volume remains 50 per store / 250 total, A1 mocks 50, three synthetic PBMs plus unmatched claims, federal v1 data NULL/empty. No production/UI change, DEV write, Git mutation or stage-6 execution is authorized by this correction. The contract remains draft under the already-recorded Director implementation release. Affected ACs: 205, 502, 507 (future stage 6), 803. Evidence and board: `EVIDENCE/E2/test-amendment-A02/`.


## A03 — Director DEV project correction — 2026-11-06

Director confirms CyberPharma_Dev_v1 `yrsuwikjnbmvpznrgydb` as DEV. `cwdzijswchlwfvxxrlzb` belongs to the Vibe Cody pilot and is excluded from DEV; SCRATCH remains `ihgcsrypblqkwommrkgj`. Authorization is to correct runner/handoff target fencing and perform a read-only preflight. No DEV APPLY, historical baseline initialization, seeding, authenticated probes or Git mutation is released. Exact product path changed: `scripts/rls-harness/lib/env.mjs`; no fallback or complete-prefix relaxation. Full findings: EVIDENCE/apply/dev-target-reconciliation/REPORT.md. Prior target labels in historical evidence remain historical, not current DEV authority.


## A04 — Proposed DEV-specific baseline bootstrap — preparation only

Director requests the smallest forward-only reconciliation to the approved 0047 baseline while preserving users, roles and data. Proposal lives only in EVIDENCE/apply/dev-baseline-bootstrap/. No historical migration edits, baseline fingerprint exception, managed-role membership change, authenticated probe, shared-DEV SQL write or ledger initialization is released. Exact reconciliation includes two existing function definitions and three supabase_admin-owned future-object ACL entries; managed-role privilege is a recorded blocker. Existing matched public objects/policies are preserved. See PROPOSAL.md for exact changes and the checks required before commit and before any APBM ledger initialization.


## A05 — Director-authorized disposable-copy ACL exception evaluation

Director authorizes read-only DEV backup and restore to confirmed disposable ihgcsrypblqkwommrkgj, followed by evaluation of only the three identified supabase_admin default ACL entries while retaining all other 0047 checks and proving effective app grants/RLS/RPC access. No shared-DEV exception or write is released. The evaluator and negative controls are in EVIDENCE/apply/dev-restored-rehearsal/. Restore is blocked by four missing auth.users indexes and absent owner/SET ROLE privileges; no broader exception is inferred. See that directory's HANDOFF.md for exact next action.


## 2026-11-06T13:58:13.834974+00:00 — Director releases Stage 6 on existing SCRATCH

Director explicitly authorizes Stage 6 using confirmed SCRATCH ihgcsrypblqkwommrkgj and existing synthetic fixtures. This supersedes the earlier DEV APPLY dependency for this stage only. Dev v1 yrsuwikjnbmvpznrgydb remains intended rollout target; shared DEV APPLY and restore rehearsal are deferred to DevOps, not marked complete or waived for rollout. No project creation, shared DEV writes, Git mutations or reset/reseed. Verify schema and real Owner access, implement the existing Stage 6 exact allowlist plus prior two-test amendment, run checks, continue independent work around specific blockers. Session/audit effects from SCRATCH authenticated reads are declared; preserve all backup and historical evidence. Stop at Stage 6 report.
