# PARENT_ENTRY_ROUTING — record of what was pasted into the parent entry files

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: Architect.** Kept as the record of the snippet pasted into `../CLAUDE.md` and `../AGENTS.md` (both carry it byte-identically between their markers).

## Snippet
```markdown
## Role routing

Seats for this module: Director **Tony** · Chief Architect **JARVIS** · Module Architect **Friday** · Engineering Executor **Cody** · Independent QA Executor **Claudy** · QA Lead (seat). Cody and Claudy's assignments are deliberately reversed from previous engagements: **Cody engineers, Claudy tests.**

- **Engineering** (implementing `APBM-003-CYBER-PHARMA`, seat Cody): your assignment starts at `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ENTRY.md` — read `APBM_STATE.md` first and act only on the recorded state (E1 recon, then E2 only after `E2 APPROVED`). The acceptance contract is `APBM_ACCEPTANCE_SPEC.md` plus `CONTRACTS/*` (frozen once stamped FINAL; amendments only through `APBM_RULINGS.md` §C). Completing `QAM/QAM_MANIFEST.md` and `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` is part of this assignment.
- **QA** (independent verification of `APBM-003-CYBER-PHARMA`, seat Claudy): go to `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/` and read `QAM_ENTRY.md`. Both `QAM/CLAUDE.md` and `QAM/AGENTS.md` assign the QA Executor seat and point there. A folder path authorizes Q1 only.
- Wrong seat or wrong folder: say so and name the correct entry above; do not switch branches, reset, repair or restart anything.
```

## Architect validation checklist (§6)
- [x] Parent `CLAUDE.md` contains the snippet.
- [x] Parent `AGENTS.md` contains the snippet.
- [x] `QAM/CLAUDE.md` and `QAM/AGENTS.md` routing text byte-identical (diffed at packaging: identical).
- [ ] Discovery validated in each supported runtime — **NOT VERIFIED at authoring** (no runtime access from the authoring lab). Cody validates at E1 §1.3 for the Engineering entry; Claudy validates at Q1 (PF-2.3) for the QA entry. Fallback instruction recorded in both entries.
- [x] No long custom kickoff prompt carries operating rules (`../CODY_LAUNCH_PROMPT.md` is one paragraph pointing at the entry).
