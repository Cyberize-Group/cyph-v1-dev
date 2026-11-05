> **Proposed A01 alignment — DRAFT:** Read `../E2_AMENDMENT_A01.md` before this inherited draft. Its identity, exact file list, deferred customer writes, safe target/checkpoint rules and independent Gate Q/Gate D requirements replace contradictory proposals here only upon approval. No result, FINAL stamp or release is recorded.

# QAM_ENTRY — `APBM-003-CYBER-PHARMA`

> Instantiated from TEMPLATE SET v0.3 (`03_BUILD_METHODOLOGY/_templates/QAM/`, QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0 §§2, 5, 6, 7, 15. **Owner: Architect (Friday)**; resolved at packaging 2026-11-05. Canonical entry both `CLAUDE.md` and `AGENTS.md` point to. References authority; grants none. The dispatch table in §5 is a document instruction read by the arriving agent, not a dispatcher.

## 1. Module identity

| Field | Value |
|---|---|
| Module ID / type | `APBM-003-CYBER-PHARMA` / APBM (Application Phase Build Module, Phase 3 completion + Target One). Module-type adaptation: this QAM applies the **BIM** row of QAM_PLAYBOOK §16 (schema/RLS/tenant negatives/fixtures/allowed writes/rollback/regression) **plus** the FFM row (frontend states, responsive/keyboard, real auth) because Target One ships both |
| Repository | `Cyberize-Group/cyph-v1-dev` (Director's checkout `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`; remote per Director) |
| Module directory (repo-relative) | `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA` — this QAM lives at `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/` |
| Engineering branch | `apbm-003` |
| QA branch (continuing; Director creates it **at the completed engineering candidate commit** after the engineering handoff; Director-merged into `main`) | `qa/apbm-003` |
| Baseline commit (full SHA) | `af2c7e5225d2d78925fd392e29a58b6bde830263` (verified pre-pack parent); E1 start `b23372d24d79b6460f746a191e824224ba5f8900`; `5234abe` unavailable |
| Candidate (tested product identity) | `PENDING` — resolved by the QA Executor in Q1 from the Director's commit receipt / read-only Git evidence and reconciled against `QAM_MANIFEST.md` §2; never invented |
| Playbook governing this QAM | QAM_PLAYBOOK v1.0 (Hub `03_BUILD_METHODOLOGY/QAM_PLAYBOOK.md`, dated 2026-10-18) — provenance in `GOVERNING/README.md` |
| Seats | **QA Executor: Claudy** · QA Lead: the QA Lead seat (holder recorded in `QAM_APPROVAL.md` when it acts; never inferred from a model name) · Engineer: Cody · Architect: Friday · Chief Architect: JARVIS · Director: Tony. Cody and Claudy are deliberately reversed from previous engagements |

## 2. Governing contract (linked, not duplicated)

| Item | Module-relative path | Identity |
|---|---|---|
| Frozen acceptance spec | `../APBM_ACCEPTANCE_SPEC.md` + `../CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md`, `../CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md`, `../CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` | DRAFT at packaging; FINAL stamp + SHA-256 recorded by JARVIS at E1 resolution (Q1 records the hashes it reads) |
| Ruling / erratum lane (append-only) | `../APBM_RULINGS.md` | R-01..R-10 in force; §C errata appended at resolution |
| Implementation assignment (Engineering entry) | `../APBM_ENTRY.md` → `../E1_RECON_MISSION.md` / `../E2_EXECUTION_INSTRUCTIONS.md` | — |
| Succession from BIM-004 / APPLY / BIM-005 | `../CONTRACTS/SUCCESSION_RECORD.md` | — |
| Other governing bodies | `GOVERNING/README.md` | per-source version + hash |

Frozen AC text is never changed by a plan edit (RUL-04). A contract question is a `STOP-CONTRACT` for the Architect/Director, not a reinterpretation.

## 3. Seats and write permissions (single permission table)

| Seat | May write | May not |
|---|---|---|
| QA Executor (Claudy) | `QAM_RECON_REPORT.md`, `QAM_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, `FINDINGS.md` §1 and §3.1, `QAM_CLEANUP_REPORT.md` execution rows, `evidence/**`, `AUTOMATION/**`, `HANDOFFS/**` (packages, filled `REVIEW_START_HERE.md` copies, `FILE_INDEX.json`, receipts table), `../EVIDENCE/deploy/GATE_D.md`. Executor-recorded parts of other seats' files: Result/Evidence cells of `QAM_PREFLIGHT.md`; `QAM_RISK_REQUIREMENTS.md` §3; the `QAM_TEST_PLAN.md` draft and the application of the QA Lead's **exact** amendments (§8); own dated entries in `QAM_STATE.md`. Transcription only when expressly instructed, attributed | product code, tests, contract files, Engineer's evidence, `QAM_MANIFEST.md`; composing any approval, disposition, retention decision or verdict; Git mutation; deployment |
| Engineer (Cody) | `QAM_MANIFEST.md` (incl. §8 amendments), `HANDOFFS/ENGINEERING_HANDOFF.md`, own `QAM_STATE.md` entries; ruled repair paths on `qa/apbm-003` only | QA results, plan approval, dispositions, certificate |
| QA Lead | `QAM_APPROVAL.md` decisions, `FINDINGS.md` §2 dispositions, retention/cleanup-acceptance in `QAM_CLEANUP_REPORT.md`, `QAM_CERTIFICATION.md`, `QAM_RISK_REQUIREMENTS.md` §1 adoption, own `QAM_STATE.md` entries | product changes; inventing evidence |
| Architect (Friday) / Chief Architect (JARVIS) | this file, `QAM_PREFLIGHT.md` rows, `QAM_RISK_REQUIREMENTS.md` §2, `GOVERNING/`, `PARENT_ENTRY_ROUTING.md`, closeout instruction, own `QAM_STATE.md` entries | QA results; substituting an engineering-green result for independent QA |
| Director (Tony) | release references in `QAM_APPROVAL.md` §3/§4; credential file `.env.qa.local`; all Git actions; risk decisions; the APPLY checkpoint; own `QAM_STATE.md` entries | — (does not have to perform repeatable UI checks) |

**Protected paths (never written by any QA seat):** `src/**` (except nothing), `scripts/**` product code, `supabase/migrations/**`, `package.json`, lockfile, `next.config.*`, `tests/**` product tests, `RECOVERY.md`, `agent_docs/SESSIONS/**`, `agent_docs/AUTHORITY/**`, every historical module folder, `.env*` (the QA credential file is written by the Director only).
**Sequence:** E2 ends with identified candidate and local deployment package, not deployment. Claudy independently plans and tests Gate Q against that candidate on `qa/apbm-003`; QA Lead certifies. Then Tony separately approves staging deployment of the certified candidate; Claudy verifies actual revision/digest and behavior in Gate D. Staging availability is not a Gate-Q prerequisite. Repaired product requires candidate re-binding and Gate-Q retest before deployment.

**Permitted effects on targets:** SCRATCH — destructive QA authorized (from-scratch replay, seed reset, direct-read attacks, concurrent-admin attacks) under the plan; DEV — read-only plus bounded login/logout probes with the cast identities and the wrapper reads the plan declares (these create session and audit rows, acknowledged); STAGING — browser-only through the real app with cast identities (Gate D). Anything else is `STOP-AUTHORITY`.

Authority rule (playbook §6): being pointed at this folder and asked to start authorizes **Q1 only**, within the declared scope.

## 4. Target and prerequisites (summary; executable rows in `QAM_PREFLIGHT.md`)

| Item | Value |
|---|---|
| Targets and how resolved | SCRATCH: project ref from the `QA_SCRATCH_*` env keys (CF-8 prefix) · DEV: project ref recorded at the APPLY checkpoint (`../EVIDENCE/apply/01_TARGET_IDENTITY.txt`) · STAGING: the URL and Cloud Run revision recorded in `../EVIDENCE/deploy/`. A label never resolves a target; the ref/URL/revision does |
| Roles / identities required (by handle; existence verified by the Director via the seed run, E-17) | `OWNER1`, `OWNER3`, `ADMIN_B2`, `ADMIN_B3`, `MEMBER_B1`, `MEMBER_B2B3`, `UNRELATED`; `OPERATOR` only for explicitly authorized tests (`../CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` §2) |
| Test data | the synthetic seed as applied (SCRATCH from scratch; DEV at the checkpoint); counts per the FINAL spec |
| Toolchain | Node + npm versions per `../EVIDENCE/E1/COUNTS.md`; Playwright for the browser matrix (QA-controlled install in the QA lane); `psql`/Supabase CLI for catalog and direct-read probes; the repo's `rls:prove` / `audit:prove` / `db-verify` instruments |
| Credential file (ignored, untracked; Director creates before Q2 release; values never recorded) | `.env.qa.local` with keys: `QA_SCRATCH_SUPABASE_URL`, `QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY`, `QA_SCRATCH_SECRET_KEY`, `QA_SCRATCH_DB_URL`, `QA_DEV_SUPABASE_URL`, `QA_DEV_SUPABASE_PUBLISHABLE_KEY`, `QA_STAGING_URL`, and per cast handle `QA_<HANDLE>_EMAIL` / `QA_<HANDLE>_PASSWORD`. Key names confirmed at E1 (`../APBM_RULINGS.md` §C if they change). No `NEXT_PUBLIC_*` reuse |

## 5. Read order and phase dispatch

Read, in order: `QAM_STATE.md` → this file → the contract and ruling lane (§2) → `GOVERNING/README.md` → `QAM_RISK_REQUIREMENTS.md` → `QAM_MANIFEST.md` + `HANDOFFS/ENGINEERING_HANDOFF.md` (claims) → `QAM_PREFLIGHT.md` → the phase file for the recorded state. Before acting, compare the recorded state's prerequisites with disk and current identity (playbook §15).

| Recorded state in `QAM_STATE.md` | Next owner | What the arriving QA Executor does |
|---|---|---|
| `READY FOR ENGINEERING` | Engineer | Nothing to test yet. Report that engineering is pending and no handoff exists; do not run preflight against an unfinished candidate |
| `ENGINEERING COMPLETE — AWAITING QA BRANCH` | Director | Report that the handoff exists and the Director has not yet committed the candidate and created `qa/apbm-003` at it. Do not start Q1 |
| `READY FOR RECON` | QA Executor | Introduce the role briefly; run `QAM_PREFLIGHT.md`; resolve the candidate from the Director's receipt and reconcile it against the handoff inventory; write `QAM_RECON_REPORT.md`; draft `QAM_TEST_PLAN.md`; build the Q1 package; record `Q1 COMPLETE — AWAITING QA LEAD REVIEW`; stop |
| `Q1 COMPLETE — AWAITING QA LEAD REVIEW` | QA Lead | Return the existing Q1 package and the decision needed. Do not rerun Q1 |
| `Q1 AMENDMENTS REQUESTED` | QA Executor | Apply **only** the exact edits in `QAM_APPROVAL.md` §1; record in plan §8 with the diff; re-bind (new SHA-256); record `Q1 AMENDED — AWAITING QA LEAD BINDING`; return |
| `Q1 AMENDED — AWAITING QA LEAD BINDING` | QA Lead | Return the amended plan and hash; wait |
| `HOLD` | per the HOLD record | Report blockers, owners, resolutions. Nothing else |
| `APPROVED — NOT RELEASED` | Director | Name the missing Director release (`QAM_APPROVAL.md` §3). Do not start Q2 |
| `RELEASED FOR Q2` | QA Executor | Verify approval ↔ candidate binding, full HEAD, product identity, targets; review the complete candidate→HEAD diff; recheck changeable readiness rows; execute the approved plan; build the Q2 package; record `Q2 COMPLETE — AWAITING ADJUDICATION` |
| `Q2 COMPLETE — AWAITING ADJUDICATION` | QA Lead | Return the Q2 package; do not re-execute |
| `STOPPED (STOP-*)` | per the stop record | Report the stop; resume only from the recorded resume point after the owner records the resolution |
| `REPAIR RULED — AWAITING COMMIT` | Engineer (Cody), then Director | **Waiting state. Do not retest.** Report the ruling ID, allowed paths, and that the repaired candidate does not exist until the Director commits |
| `RETEST SCOPE APPROVED — NOT RELEASED` | Director | Report that the Q4 scope approval exists and the release is missing |
| `RELEASED FOR Q4` | QA Executor | Verify repaired candidate vs receipt, QA Lead retest-scope approval (`QAM_APPROVAL.md` §4 ↔ plan §7), Director release; re-pin; run Q4 (repair diff + affected ACs + full required regression); package; record `Q4 COMPLETE — AWAITING ADJUDICATION` |
| `Q4 COMPLETE — AWAITING ADJUDICATION` | QA Lead | Return the Q4 package; wait |
| `VERDICT ISSUED — CLEANUP PENDING` | QA Lead → QA Executor | When the QA Lead has recorded the cleanup point and retention decisions (`QAM_CLEANUP_REPORT.md` §0/§3), execute cleanup, record evidence, record `CLEANUP EXECUTED — AWAITING ACCEPTANCE` |
| `CLEANUP EXECUTED — AWAITING ACCEPTANCE` | QA Lead, then Director | Return the cleanup report; wait |
| `CLEANUP ACCEPTED — RELEASED TO CLOSEOUT` | Architect | QA complete. Report the certificate and that the closeout instruction is next; do not restart testing or cleanup. **Gate D** (`../CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` §4) is a separately authorized step the Director releases after Gate Q; its record is `../EVIDENCE/deploy/GATE_D.md` |
| `CLOSED` | — | Show the verdict and merge receipt; do nothing |
| unknown / missing / inconsistent | the owner of the inconsistent record | Return the exact discrepancy and next owner. Do not guess, repair or proceed |
| wrong folder / wrong role | — | Explain the correct entry (`PARENT_ENTRY_ROUTING.md`); ask only if intent remains ambiguous |

## 6. Outputs and return

Every Q1, Q2, material stop and Q4 return produces one indexed ZIP at `HANDOFFS/APBM-003-CYBER-PHARMA_<PHASE>_REVIEW_<NN>.zip` per `QAM_PACKAGING.md`, with absolute path, member count, SHA-256 (external receipt) and the exact decision requested. The `QAM_STATE.md` inside a package is the immutable pre-export snapshot. Repository-required response/session records stay at their governed paths and are indexed, not moved.

## 7. Engineer completion duties (pointer)

Cody completes `QAM_MANIFEST.md` (incl. the four-part change inventory) and `HANDOFFS/ENGINEERING_HANDOFF.md` as part of E2, before the Director commits, and records `ENGINEERING COMPLETE — AWAITING QA BRANCH` here (mirrored as `E2 COMPLETE — AWAITING QA BRANCH` in `../APBM_STATE.md`). The Engineer fills no QA result, decision or certificate.

## 8. Reworks (conditional; same QA line; explicit handoffs)

QA Lead adjudication → one consolidated repair instruction (JARVIS, in `../APBM_RULINGS.md` §C + `FINDINGS.md` §3.2) → Cody repairs on `qa/apbm-003` (one active writer; ownership transfer recorded in `HANDOFFS/QA_HANDOFF.md`) → Director commits → Claudy re-pins and retests (repair diff + affected ACs + full required regression). Findings consolidated into one repair assignment where practical; repeat only when evidence requires it. No disposable QA branches; no transfer back to the engineering branch.

*Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3.*
