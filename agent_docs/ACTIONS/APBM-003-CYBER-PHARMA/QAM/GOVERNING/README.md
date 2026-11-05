# GOVERNING/ — applicable bodies with source, version and hash provenance

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: Architect (Friday) at packaging.** External bodies are available through the Hub (the Director's doc repo / claude.ai project "Cyber Pharma v1") as an explicitly approved accessible source; a local snapshot is **not** bundled in this pack (the Director copies governing bodies into module packs per the RRM-001 PROVENANCE lesson, never the Engineer). Hashes marked "computed" were taken from the files the Director supplied to the authoring lab on 2026-11-05; "NOT RECORDED" means the authoring lab read the body through the project connector and could not hash it — the Director records the Hub commit SHA and hash when snapshotting.

## Provenance table
| Body | Role in this QAM | Form | Version | Source location | SHA-256 | Retrieved by / at |
|---|---|---|---|---|---|---|
| QAM_PLAYBOOK | packaging and the two-shot process | approved accessible source (Hub `03_BUILD_METHODOLOGY/QAM_PLAYBOOK.md`) | v1.0 (2026-10-18) | Hub; Director-supplied copy | computed on the Director-supplied copy: `456246341096459742400af061b6605fcf1d56e9de1a09b27621a6680489c9f6` | Friday, 2026-11-05 |
| QA_PLAYBOOK | evidence discipline, severity, verdicts, independence | Hub `03_BUILD_METHODOLOGY/QA_PLAYBOOK.md` | v1.1 (reported) | Hub | NOT RECORDED | — |
| APBM_PLAYBOOK | module lifecycle (E1/E2, stops, closeout) | Hub `10x Lab/APBM_PLAYBOOK_v1_0.md` | v1.0 (2026-10-18) | Hub; Director-supplied copy | `c12ff3f9bc4355e9bd8e1c276a3917bd443f864715ab1ffb6b84edf49beb4f93` | Friday, 2026-11-05 |
| ABM_PLAYBOOK | pack shape and templates reused by APBM | Hub `10x Lab/ABM_PLAYBOOK_v1_0.md` | v1.0 (2026-10-17) | Hub; Director-supplied copy | `21f8344812a385ec0a3da8ec41e144dc07c7248814a8b0a73db4f2433c5b2051` | Friday, 2026-11-05 |
| BIM_PLAYBOOK | Engineer doctrine, contracts freeze, identity rules (restated) | Hub `03_BUILD_METHODOLOGY/BIM_PLAYBOOK.md` | v1.1 (2026-10-18) | Hub; Director-supplied copy | `18590bd643bd8e4b5b7c54de2ba1fb680faac217b9bea136e576576207496639` | Friday, 2026-11-05 |
| Eight-Phase Plan v3.0 | plan of record (D-6 adoption pending at packaging) | `CYBER_PHARMA_8_PHASE_PLAN_v3_0.md` final review draft 3 | v3.0 draft 3 (2026-11-05) | Director-supplied | `bde41648b1d0eb5b4724b12c467918d4df2940392951028369ca5eacc9e77a83` | Friday, 2026-11-05 |
| Director rulings D-1(a), D-2, D-4 | grading authority for CF-10, data scope, owner reach | `CYBER_PHARMA_PLAN_v3_0_DIRECTOR_RULINGS_2026-11-05.md` | 2026-11-05 | project `LABS/REPLAN/` | `2c53ee9ab690717540084db43f1a2c4ff22c17206e4df40347a7232b73173a00` | Friday, 2026-11-05 |
| QAM template set | this QAM's shape | Hub `03_BUILD_METHODOLOGY/_templates/QAM/` | v0.3 | Hub | NOT RECORDED (read via connector) | Friday, 2026-11-05 |
| BIM-003 WRAPPER_CONTRACT + RULINGS_ADDENDUM | wrapper return shapes; carried flags | repo `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/` | as merged at `c45949e` | repo | recorded at E1 | Cody, E1 |
| Project policies: credential policy (`.env.qa.local`), cleanup policy (QA_PLAYBOOK §14 + RRM_PLAYBOOK §10), Git policy (Director-only mutations, forward-only `qa/`) | local rules | Hub + repo root `CLAUDE.md` | as installed | repo | recorded at E1 | Cody, E1 |
| Frozen contract and ruling lane | grading authority (module-relative) | `../../APBM_ACCEPTANCE_SPEC.md`, `../../CONTRACTS/*`, `../../APBM_RULINGS.md` | DRAFT → FINAL at E1 resolution | this module | recorded at FINAL stamp | JARVIS |

## Precedence and conflicts
| Conflict observed | Source A | Source B | Owner to settle | Settled how / when |
|---|---|---|---|---|
| Engineer cloud-zero (BIM_PLAYBOOK §7) vs agent-owned scoped deployment (plan v3.0 §4) | BIM_PLAYBOOK | plan v3.0 | Director | settled 2026-11-05: R-10 in `../../APBM_RULINGS.md` (scoped cloud actions under Director authorization; Git stays Director-only) |
| "no literal SHAs in a pack" (RRM-001 lesson) vs baseline identity | RRM doctrine | this pack | Architect | settled: baseline expressed as "parent of the pack-installation commit"; full SHA recorded at E1 |
| APBM_PLAYBOOK §6 `agent_docs/ACTION/` root vs this repo's `agent_docs/ACTIONS/` | APBM_PLAYBOOK | repo convention | Architect | settled: repo convention wins (ABM_PLAYBOOK §6: do not rename an existing layout) |
