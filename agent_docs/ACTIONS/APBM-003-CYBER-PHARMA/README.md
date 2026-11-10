# APBM-003-CYBER-PHARMA — Phase 3 completion + Target One

**What this is.** The module package (with its embedded QAM) that closes Phase 3 of the Cyber Pharma Eight-Phase Plan v3.0 and delivers **Target One**: OwedBook and the agreed admin read views on staging, reading real rows from the shared dev Supabase, where those rows are synthetic pharmacies. Phase 3's exit gate (Controlled Read Validation) passes inside this module.
**Status at authoring (2026-11-05):** `READY FOR E1`. Not approved for E2. Contract text is DRAFT — CLAIM STATUS until E1 resolution. Plan v3.0 D-6 adoption pending (recorded, not inferred).
**Install destination:** `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/` in `Cyberize-Group/cyph-v1-dev`, on a new branch `apbm-003` cut from `main` (verified pre-pack parent `af2c7e5225d2d78925fd392e29a58b6bde830263`; E1 start `b23372d24d79b6460f746a191e824224ba5f8900`; `5234abe` unavailable). Unpack the ZIP outside the repo, copy only this folder in, commit the pack with the Director's hands, confirm `git status` clean before "go".

## Seats
Director **Tony** · Chief Architect **JARVIS** (he/him; reviews this pack) · Module Architect **Friday** (she/her; author) · **Engineering Executor Cody** · **QA Executor Claudy** · QA Lead (seat; holder recorded when it acts). Cody and Claudy are deliberately reversed from previous engagements.

## The four shots
E1 Cody recon (`E1_RECON_MISSION.md`) → resolution (JARVIS stamps the contract FINAL; Director approves E2) → E2 Cody builds continuously with one declared Director stop (`APPLY_CHECKPOINT.md`) → Director commits the candidate and cuts `qa/apbm-003` → Q1 Claudy recon + test plan (`QAM/`) → QA Lead approval, Director release → Q2 Claudy executes → adjudication → conditional repair (Cody, same QA line) → Gate Q certificate → separately approved deployment of that certified candidate → Gate D on actual deployed revision → cleanup/closeout and Director merge. E2 stage 8 prepares artifacts locally; no pre-Q deployment.

## File index
| Path | Owner | Purpose |
|---|---|---|
| `CLAUDE.md` · `AGENTS.md` | Architect | parent entry routing (byte-identical body) |
| `APBM_ENTRY.md` | Architect | canonical Engineering entry: identity, read order, dispatch by state, protected paths, lanes |
| `APBM_BRIEF.md` | Architect | objective, scope in/out, the eight E2 stages, dependencies, proposed date |
| `APBM_ACCEPTANCE_SPEC.md` | Architect seeds; JARVIS stamps FINAL | the frozen contract QA grades (AC-101..AC-903) |
| `CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md` | Architect | D-4 owner reach, D-1(a) read-audit closure, audit operation contract |
| `CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` | Architect | synthetic generator, cast, money rules, reset boundary, scan |
| `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` | Architect; Cody fills §2 | deployment target, tester handoff, label mapping, Gate D |
| `CONTRACTS/SUCCESSION_RECORD.md` | Architect | BIM-004 / APPLY / BIM-005 obligations traced into this module |
| `APBM_RULINGS.md` | Director rules; Architect records | rulings in force (R-01..R-10), open items (O-01..O-08), errata lane §C |
| `E1_RECON_MISSION.md` | Architect → Cody | Shot 1 |
| `APBM_EXECUTION_PLAN.md` | Cody at E1 | proposed sequence, blockers, schedule vs 2026-12-01 |
| `E2_EXECUTION_INSTRUCTIONS.md` | Architect → Cody | Shot 2: preflight, eight stages, stops, handoff duties |
| `APPLY_CHECKPOINT.md` | Cody prepares; Director executes | the declared stop: dev apply procedure |
| `APBM_STATE.md` · `APBM_JOURNAL.md` · `APBM_ACCEPTANCE_LEDGER.md` · `APBM_SKILLS_MANIFEST.md` · `RETROSPECTIVE.md` | per file | state index, journal, claims ledger, skills, retro |
| `EVIDENCE/` | Cody (E1/E2), Director (apply), Claudy (`deploy/GATE_D.md`) | engineering evidence lane |
| `QAM/` | per `QAM/QAM_ENTRY.md` §3 | the complete module-specific QA package (template set v0.3) |
| `MISSING_INPUTS.md` | Architect | honest register of what this pack could not verify or obtain |
| `PROVENANCE.md` | Architect | sources, versions and hashes this pack was authored from |
| `REVIEW_NOTE_FOR_JARVIS.md` | Architect → JARVIS | assumptions, decisions needed, what is ready |
| `CODY_LAUNCH_PROMPT.md` | Architect → Director | the one-paragraph E1 launch prompt |

## Fallback entry instruction
"Read `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ENTRY.md` and act on the recorded state." (QA: `…/QAM/QAM_ENTRY.md`.)

🥄
