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

| ID | Date | Original observation (file:line / evidence) | Exact corrected interpretation | Authority | Affected ACs |
|---|---|---|---|---|---|
| (none yet) | | | | | |

🥄

## D. Proposed amendment A01 — NOT IN FORCE

User reports JARVIS accepts E1; Cody was instructed to prepare documentation. A01-1 through A01-7, exact paths, AC replacements and Director recommendations are consolidated in E2_AMENDMENT_A01.md. Pending Tony decisions and JARVIS FINAL binding. No approval inferred.
