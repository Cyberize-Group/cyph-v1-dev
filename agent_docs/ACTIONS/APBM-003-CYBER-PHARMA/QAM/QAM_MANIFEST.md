# QAM_MANIFEST — APBM-003-CYBER-PHARMA

Engineer: Cody / Codex · Recorded 2026-11-09 before Director commit. All behavior statements are engineering CLAIMs, not QA results. Working directory for every command: `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`.

## 1. Identity (facts)

| Field | Value |
|---|---|
| Baseline | `af2c7e5225d2d78925fd392e29a58b6bde830263` |
| Implementation identity | `dc44429f466dedcf35023342f68624c6cee062f0` (certified repair); the original inventory below is its pre-commit snapshot. Later pagination remains a separate uncommitted successor |
| Original engineering branch | `apbm-003` |
| Current repair / QA branch | `qa/apbm-003` (already exists) |
| HEAD at repair handoff | `4d64504e85c56f1c987a703dd94575f489cb99ce` |
| Pre-repair product candidate | `308247a24e6ddd455842da5cd2e21541d7eae2c1` |
| E1 starting HEAD | `b23372d24d79b6460f746a191e824224ba5f8900`; `5234abe` unavailable |

## 2. Complete change inventory at handoff

This includes pre-existing QA/documentation work and untracked evidence, not just Cody's current repair. It is an inventory, not blanket staging authority. No secret values or backup contents are included. Paths in this section may name private controls; their contents are not copied. Inventory is embedded here to obey the exact output-file scope. Untracked files are enumerated individually, not collapsed directories.

| Part | Command | Output | Count |
|---|---|---|---|
| 2.1 | `git diff --name-status af2c7e5225d2d78925fd392e29a58b6bde830263..HEAD` | embedded below | 447 |
| 2.2 | `git diff --cached --name-status` | embedded below | 0 |
| 2.3 | `git diff --name-status` | embedded below | 20 |
| 2.4 | `git ls-files --others --exclude-standard` | embedded below | 469 |

<details><summary>2.1 — exact path inventory</summary>

```text
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/AGENTS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_LEDGER.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_SPEC.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_BRIEF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ENTRY.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_EXECUTION_PLAN.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_SKILLS_MANIFEST.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APPLY_CHECKPOINT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLAUDE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CODY_LAUNCH_PROMPT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SUCCESSION_RECORD.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E1_RECON_MISSION.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_AMENDMENT_A01.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_EXECUTION_INSTRUCTIONS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_RELEASE_MESSAGE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1_PACKAGE_RECEIPT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/CHANGE_SCOPE.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/COMMITTED_CONTRACT_HASHES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DEV_APPLY_HANDOFF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DIRECTOR_RELEASE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PACKAGE_RECEIPT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PRODUCT.diff
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/EXPECTED_MATRIX_DELTA.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/GIT_HANDOFF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/HANDOFF_SUMMARY.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/OWNED_ARTIFACTS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PROTECTED_PATH_CHECK.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_DATA_PROBE.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_RETRY.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/RELEASE_CHECKS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SCRATCH_READONLY_PREFLIGHT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STAGE_CHECKPOINTS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STARTING_TRACKED_HASHES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/build.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/tsc.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/BASELINE_0047_CATALOG.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/STAGE_0_RECEIPT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-test.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/forward-scratch-reset-1793891691098.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/migration-inventory.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/forward-apply-1793891825878.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/migration-inventory.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/forward-apply-1793891885995.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/trigger-proof.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/NO_ACCOUNT_NO_JUNCTION.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/forward-apply-1793892015163.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/GENERATOR_CONTROLS.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/MOCK_MONEY_AUDIT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/apbm-user-audit-proof.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-map.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-receipt-1793892147007.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-verify-attacked.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint-final.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/apbm-user-audit-proof.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-1.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-2.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-3.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-4.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-5.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-6.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-7.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-8.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-prove.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/catalog-approved.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/forward-scratch-reset-1793893233220.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/legacy-cast-cleanup.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-map.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-receipt-1793893280657.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-reset-1793893258075.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-verify-attacked.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/apbm-user-audit-proof.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-1.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-2.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-3.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-4.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-5.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-6.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-7.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-8.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-prove.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/catalog-approved.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/forward-scratch-reset-1793892988755.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/legacy-cast-cleanup.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/migration-inventory.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-map.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-receipt-1793893015180.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-reset-1793892997395.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-verify-attacked.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/authenticated-reads.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-runner-lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-types.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/tsc.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/CATALOG_EQUIVALENCE.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/already-applied-noop.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline-replay.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/complete.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892922977.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892925089.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892931150.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892932185.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-init-ledger-1793892918335.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-scratch-reset-1793892911758.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/init-ledger.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/inventory.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/migration-inventory.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial-failure.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/poison-manifest.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/recovery-rehearsal.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/rehearse.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-changed-inventory.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-stale-catalog.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/remaining-chain-recovery.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-map.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-receipt-1793893445623.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-reset-1793893424344.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-verify.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM-matrix_2026-11-05T1528.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED-matrix_2026-11-05T1533.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.normalised.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED-matrix_2026-11-05T1531.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.normalised.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.normalised.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_attacks_2026-11-05T1533.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_revocation_2026-11-05T1534.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_scoping_2026-11-05T1533.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1528.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1530.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1533.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892495697.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892615550.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892809067.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/migration-inventory.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/seed-map.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/runner-lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/tsc.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/GIT_COMMANDS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/HANDOFF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PLAN.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PRESERVATION.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PROTECTED_BEFORE.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/RESULT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/REVIEW_FILES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES_BEFORE_STAGE6.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/ZIP_RECEIPT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/authenticated-reads.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/baseline-tests.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-check.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filter-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filters.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results-first-pass.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/build.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-tests.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-typecheck.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/local-server.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/owner-proof.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/run-scratch-app.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-before-browser.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-verify.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/tests.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/typecheck.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/BOARD_RESULTS.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/PRE_AMENDMENT_SOURCE_HASHES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/REVIEW.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TESTS_BEFORE.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TEST_CORRECTION.diff
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/build.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/BOARD_RESULTS.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/DISCLOSURE_RUN.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/PENDING_FILE_HASHES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/REVIEW.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/SOURCE_HASHES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/build.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest-results.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/lint.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/tsc.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/tsc.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/README.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/DEV_AUTH_FK_DEPENDENCIES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/EXECUTED_RUNNER.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/HANDOFF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/INDEX_DEPENDENCY_REVIEW.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/LOCAL_FINAL_CHECKS.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/POSTFLIGHT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/PREFLIGHT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/RESULT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/SCRATCH_APPLICATION_BOOTSTRAP.sql
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/acl-controls.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-reads.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-verifier.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/baseline-0047.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/check-dev-auth-indexes.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/complete-0052.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-after-catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-after.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-before.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-before-catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-0048-0052.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-apply-1793977302069.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-init-ledger-1793977296844.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/index-guard-test.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/init-ledger.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/inspect.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner-proof.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/postflight.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-probes.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-seed.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/rehearse.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/remove-prior-synthetic-cast.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-after-catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-before-catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-map.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-receipt-1793977322480.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-reset-1793977273803.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/starting-catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/verify-0047.log
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PLAN_MANIFEST.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/checks.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/owner-check.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/BUNDLE_INPUTS.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/CONNECTION_SIGNUP.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_APPLICATION_BOOTSTRAP.sql
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_SIGNUP_CHECKPOINT.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_47.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_51.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_52.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_INPUT_PATHS.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_RELEASE_COMMANDS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/HANDOFF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/LOCK_PRIVILEGES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_PATHS.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_SHA256.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/REVIEW_SHA256.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RULING.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RUN_DEV_APPLY.sh
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/SCOPE_CHECK.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/TEST_RESULTS.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/VALIDATION.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/build-manifest.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/common.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793979737752.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980107801.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980439376.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794037368529.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/executor.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/prepare-release-scope.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/tests.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SNAPSHOT_BACKUP.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/catalog.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/MISSING_INPUTS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/PROVENANCE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AC_EVIDENCE_MATRIX.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AGENTS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/README.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/check-qa-env.sh
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/make-qa-env.mjs
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/CLAUDE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/FINDINGS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/GOVERNING/README.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1b_REVIEW_01.zip
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/ENGINEERING_HANDOFF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX.template.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1_01.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1b_01.json
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q1b_AM-7_DRAFT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/QA_HANDOFF.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/README.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/RELEASE_PASTE_2026-11-09.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1_01.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1b_01.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/PARENT_ENTRY_ROUTING.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_APPROVAL.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CERTIFICATION.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CLEANUP_REPORT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_ENTRY.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_MANIFEST.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PACKAGING.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RECON_REPORT.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/README.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/check-qa-env_current.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/credential_mapping.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/env_qa_local_stat_names_only.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/make-qa-env_selftest.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/auth_path_diff.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/baseline_to_candidate_name_status.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/branch.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/candidate_to_head_diff.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/contract_hashes_as_read.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/e1_placeholder_counts.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/head.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/inherited_dirty_baseline_status.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/lockfile_diff.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/log_baseline_to_head.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/migrations_0001_0047_diff.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/package_json_diff.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/qa_generated_paths_status.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/q2_entry_check.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/PREFLIGHT_RESULTS.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/frontend_target_check.txt
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/README.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/RETROSPECTIVE.md
A	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/REVIEW_NOTE_FOR_JARVIS.md
A	agent_docs/RESPONSES/response_2026-11-07_074800_dev-signup-checkpoint.md
A	agent_docs/RESPONSES/response_2026-11-07_145747_apbm003-qam-q1-plan.md
A	agent_docs/RESPONSES/response_2026-11-07_162251_apbm003-qam-q1b-amendments.md
A	agent_docs/RESPONSES/response_2026-11-07_165422_apbm003-qam-am7-applied.md
A	agent_docs/RESPONSES/response_2026-11-07_170316_apbm003-qam-q2-entry-hold.md
A	agent_docs/RESPONSES/response_2026-11-09_cody_transcription.md
A	agent_docs/SESSIONS/session_2026-11-07.md
A	agent_docs/SESSIONS/session_2026-11-09_cody_transcription.md
R100	_SKILLS/README.md	agent_docs/SKILLS/README.md
R100	_SKILLS/stark-cloud-deploy-skills/CLAUDE.md	agent_docs/SKILLS/stark-cloud-deploy-skills/CLAUDE.md
R100	_SKILLS/stark-cloud-deploy-skills/V3_RELEASE_NOTES.md	agent_docs/SKILLS/stark-cloud-deploy-skills/V3_RELEASE_NOTES.md
R100	_SKILLS/stark-cloud-deploy-skills/next-deploy-execute/SKILL.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-execute/SKILL.md
R100	_SKILLS/stark-cloud-deploy-skills/next-deploy-execute/examples/PHASE_0_TO_1_WALKTHROUGH.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-execute/examples/PHASE_0_TO_1_WALKTHROUGH.md
R100	_SKILLS/stark-cloud-deploy-skills/next-deploy-execute/references/ANTI_PATTERNS.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-execute/references/ANTI_PATTERNS.md
R100	_SKILLS/stark-cloud-deploy-skills/next-deploy-generate/SKILL.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-generate/SKILL.md
R100	_SKILLS/stark-cloud-deploy-skills/next-deploy-generate/references/TEMPLATES.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-generate/references/TEMPLATES.md
R100	_SKILLS/stark-cloud-deploy-skills/scripts/install-gcloud.sh	agent_docs/SKILLS/stark-cloud-deploy-skills/scripts/install-gcloud.sh
R100	_SKILLS/stark-kit-residue-cleaner-skill/CLAUDE.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/CLAUDE.md
R100	_SKILLS/stark-kit-residue-cleaner-skill/README.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/README.md
R100	_SKILLS/stark-kit-residue-cleaner-skill/SKILL.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/SKILL.md
R100	_SKILLS/stark-kit-residue-cleaner-skill/examples/mission-control-2026-07/README.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/examples/mission-control-2026-07/README.md
R100	_SKILLS/stark-kit-residue-cleaner-skill/references/ANTI_PATTERNS.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/references/ANTI_PATTERNS.md
R100	_SKILLS/stark-kit-residue-cleaner-skill/references/KIT_DEMO_MANIFEST.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/references/KIT_DEMO_MANIFEST.md
R100	_SKILLS/stark-kit-residue-cleaner-skill/workflow/00-trace.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/workflow/00-trace.md
R100	_SKILLS/stark-kit-residue-cleaner-skill/workflow/01-cleanup.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/workflow/01-cleanup.md
R100	_SKILLS/stark-recon-skill-v1.1/CLAUDE.md	agent_docs/SKILLS/stark-recon-skill-v1.1/CLAUDE.md
R100	_SKILLS/stark-recon-skill-v1.1/README.md	agent_docs/SKILLS/stark-recon-skill-v1.1/README.md
R100	_SKILLS/stark-recon-skill-v1.1/SKILL.md	agent_docs/SKILLS/stark-recon-skill-v1.1/SKILL.md
R100	_SKILLS/stark-recon-skill-v1.1/examples/cyber-pharma-v1-phase2-recon-2026-06-08.md	agent_docs/SKILLS/stark-recon-skill-v1.1/examples/cyber-pharma-v1-phase2-recon-2026-06-08.md
R100	_SKILLS/stark-recon-skill-v1.1/references/ANTI_PATTERNS.md	agent_docs/SKILLS/stark-recon-skill-v1.1/references/ANTI_PATTERNS.md
R100	_SKILLS/stark-recon-skill-v1.1/references/EVIDENCE_DISCIPLINE.md	agent_docs/SKILLS/stark-recon-skill-v1.1/references/EVIDENCE_DISCIPLINE.md
R100	_SKILLS/stark-recon-skill-v1.1/templates/RECON_MISSION.md	agent_docs/SKILLS/stark-recon-skill-v1.1/templates/RECON_MISSION.md
R100	_SKILLS/stark-recon-skill-v1.1/templates/RECON_REPORT_TEMPLATE.md	agent_docs/SKILLS/stark-recon-skill-v1.1/templates/RECON_REPORT_TEMPLATE.md
M	package.json
A	scripts/apply-forward.mjs
M	scripts/db-verify.mjs
A	scripts/dev-verify.mjs
M	scripts/rls-harness/ac8-check.mjs
M	scripts/rls-harness/attacks.mjs
M	scripts/rls-harness/audit-catalog.mjs
M	scripts/rls-harness/audit-prove.mjs
M	scripts/rls-harness/audit-seed.mjs
M	scripts/rls-harness/audit-session.mjs
M	scripts/rls-harness/audit-wrappers.mjs
M	scripts/rls-harness/expectations.json
M	scripts/rls-harness/harness.mjs
M	scripts/rls-harness/lib/env.mjs
M	scripts/rls-harness/policy-check.mjs
M	scripts/rls-harness/prove.mjs
M	scripts/rls-harness/revocation.mjs
M	scripts/rls-harness/scoping.mjs
M	scripts/rls-harness/seed.mjs
A	scripts/seed/README.md
A	scripts/seed/generate.mjs
A	scripts/seed/identity-scan.mjs
A	scripts/seed/reset.mjs
A	scripts/seed/run.mjs
A	scripts/seed/verify.mjs
A	src/__tests__/apbm-admin-readonly.test.tsx
A	src/__tests__/apbm-read-states.test.tsx
A	src/__tests__/apbm-tenant-scope.test.ts
M	src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx
M	src/__tests__/services/owedbook.test.ts
M	src/app/(admin)/layout.tsx
M	src/components/admin-portal/AddStoreButton.tsx
M	src/components/admin-portal/AuditScreen.tsx
M	src/components/admin-portal/BillingRow.tsx
M	src/components/admin-portal/InviteMemberForm.tsx
M	src/components/admin-portal/MemberRow.tsx
M	src/components/admin-portal/SettingsForm.tsx
M	src/components/admin-portal/statusPresentation.ts
M	src/components/global/MobileNav.tsx
M	src/components/global/Navbar.tsx
M	src/components/global/UserMenu.tsx
M	src/components/owedbook/FilterRail.tsx
M	src/components/owedbook/OwedBookContext.tsx
M	src/components/owedbook/OwedBookScreen.tsx
A	src/components/owedbook/StoreSelector.tsx
M	src/mocks/owedbook.ts
M	src/services/adminDemo.ts
M	src/services/owedbook.ts
A	src/services/tenantScope.ts
M	src/types/adminDemo.ts
M	src/types/supabase.ts
A	supabase/migrations/0048_ownership.sql
A	supabase/migrations/0049_signup_member.sql
A	supabase/migrations/0050_claim_read_fence.sql
A	supabase/migrations/0051_admin_reads.sql
A	supabase/migrations/0052_system_config.sql
```

</details>

<details><summary>2.2 — exact path inventory</summary>

```text
(empty)
```

</details>

<details><summary>2.3 — exact path inventory</summary>

```text
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AC_EVIDENCE_MATRIX.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/README.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/FINDINGS.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/ENGINEERING_HANDOFF.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/QA_HANDOFF.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/README.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_APPROVAL.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_MANIFEST.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
M	agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md
M	agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md
M	agent_docs/SESSIONS/session_2026-11-07.md
M	src/components/admin-portal/BillingScreen.tsx
M	src/components/admin-portal/DemoMarker.tsx
M	src/components/owedbook/OwedBookContext.tsx
```

</details>

<details><summary>2.4 — exact path inventory</summary>

```text
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/RUN_CONTEXT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-reads.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-verifier-1794039202981.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-bootstrap-1794038740339.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-check-1794038634441.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-forward-1794038881799.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-ledger-1794038814674.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-prepare-1794038674081.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-probes-1794039228065.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-seed-1794039042941.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038759131.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038832790.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0052-1794038900225.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-seed-1794039080883.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-1794038865309.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-apply-1794038865020.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-init-ledger-1794038797991.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/init-ledger-1794038798263.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-1794039128076.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-1794039010338.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-receipt-1794039010043.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039018815.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039056229.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039118150.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039263167.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/REVIEW_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/READINESS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/SOURCE_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/readiness.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/DEV_METADATA.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSAL.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/REVIEW_FILES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/STATIC_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/static-checks.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/DEV_COMMANDS.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/FINAL_READONLY_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READINESS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READONLY_EXECUTION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_COMMANDS.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_RESULT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REVIEW_FILES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/RUNNER_TEST_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup-tool-check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958434030.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958904994.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-runner.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/checkpoint-receipt.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/rehearsal-receipt.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/runner-tests.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/COMMITTED_RELEASE_CHECK_308247a.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/READY_308247a.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794038449141.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/BUILD.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/RUNTIME.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/SMOKE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/launch.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/CLONE_SAFETY_HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_FOLLOWUP.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/PASS_20261106T130308Z.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RECOVERY_COVERAGE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RESULT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/compare.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/outbound-check.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_RESTORE_PRIVILEGE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_MANAGED_OBJECT_PARITY.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_RESTORE_COMPATIBILITY.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/BACKUP_EXECUTION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CLONE_REVIEW.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CONFIG_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/DEV_API_KEYS_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_CAPABILITIES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_PLAN_METADATA.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/REVIEW_FILES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SCRATCH_AUTH_INDEX_PREREQUISITE.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/VERDICT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception-tests.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-archive-component.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-tool-check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/snapshot-backup.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/LOCAL_CHANGES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/baseline-diff.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-test.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/fencing-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/preflight.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/read-only-preflight.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/build-package.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/cast-matrix.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/debug-pbm-options.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/derive.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/dev-apply-check.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/inventory.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/launch-dev-real.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/money-rules.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/privacy-scan.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-env.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-shim.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/ro-sql.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/role-matrix.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/scratch-sql.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/seed-hash.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t11_catalog.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t21-trigger.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q2_01.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q2_ADJUDICATION_01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q4_RELEASE_RECORDS_2026-11-09.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q2_01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/INVENTORY.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/admin/01/no_mutation.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/dev_catalog_projection.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/handle_new_user_dev.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/projection_diff_policies.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings_raw.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_run.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/admin_rpcs.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix_attack_flip.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/dev_operation_counts.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials_attack_flip.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/operation_counts.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/owner_reach.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/seed_audit.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_reset1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run2.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_before_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_grep.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_intact.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/chain_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/ci.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/negative_controls.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/auth_walk.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/chain2_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/debug_pbm_MEMBER_B1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_MEMBER_B1_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/counts_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B2_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B3_1440_dark.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B1_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B2B3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER1_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_UNRELATED_1440_dark.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/nomut_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/r016_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/spoof_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_store_detail_B2.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_MEMBER_B1_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_store_detail_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_store_detail_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_OWNER3_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_rerun_member_unrelated.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2_all.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/audit_window_check.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har/mockmode_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har_rpc_check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_admin_gate.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_owedbook.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/signins.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B2B3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375_drawer.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1_search.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_denied_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_store_detail_B2.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_denied_B2.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_FAIL_MEMBER_B1_filters.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_empty_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_owedbook_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_store_detail_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_empty_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_owedbook_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_FAIL_UNRELATED_filters.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_empty_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_owedbook_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_store_detail_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_kpis_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_rows_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_scope_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B2B3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375_drawer.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/signins.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD_mock.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build_mock.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/bundle_scan.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server_mock.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/board.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/cast.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/catalog_counts.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/matrix_delta.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/money_rules.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/policies.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/seed_audit.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/ui_dispatch_counts.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/allowlist_check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/dirty_diff_vs_q1.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_end.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_start.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/lockfile_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/package_json_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/product_paths_baseline_to_candidate.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/records_check.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/ro_sql_fence_attacks.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/scratch_shim_fence_attack.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t00_repin.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t02_dependencies.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t05_auth_routes.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t06_migrations_0001_0047.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/automation_scan.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/evidence_scan.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_clean_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_poisoned_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/seed_scan.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/grep_user_data.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_kpis_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_rows_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_scope_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/routes.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA-matrix_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_CORRUPT_2026-11-09T0405.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.normalised.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_attacks_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_revocation_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_scoping_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X5_ac8_fresh_2026-11-09T0403.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/apbm-user-audit-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-4.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-5.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-6.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-7.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-8.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-prove.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit_prove.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/catalog-approved.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify_probes.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794196996521.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794197163119.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_corruption.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff.patch
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff_review.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/inventory.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/legacy-cast-cleanup.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/rls_prove.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-receipt-1794197197146.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-reset-1794197174115.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-verify-attacked.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_replay.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_control_at_47.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195352571.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195353893.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195356328.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195955934.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195958593.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195347747.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195951557.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_48_52.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_noop.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/inventory.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_after_tamper.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_dump.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/no_account_no_junction.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin_after.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_tamper.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_through_47.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t10_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t11_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/tamper_restore.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_touch.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/cast.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/generator_review.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb2_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_touch.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_attack.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run2.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules_baseline_control.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_seed_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_0.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196267399.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196295856.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196251686.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196277074.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-verify.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run2.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_2_compare.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_after_touch.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_attack.log
agent_docs/RESPONSES/response_2026-11-06_125533_post-restore-comparison.md
agent_docs/RESPONSES/response_2026-11-06_131203_clone-safety-handoff.md
agent_docs/RESPONSES/response_2026-11-06_142444_stage6-handoff.md
agent_docs/RESPONSES/response_2026-11-06_144408_dev-apply-resume.md
agent_docs/RESPONSES/response_2026-11-06_151244_application-rehearsal.md
agent_docs/RESPONSES/response_2026-11-06_155930_dev-executor-v2.md
agent_docs/RESPONSES/response_2026-11-07_080113_dev-ready-308247a.md
agent_docs/RESPONSES/response_2026-11-07_081351_existing-apply-diagnostic.md
agent_docs/RESPONSES/response_2026-11-07_081939_dev-manual-smoke.md
agent_docs/RESPONSES/response_2026-11-09_103618_apbm003-qam-q2-execution.md
agent_docs/RESPONSES/response_20261106_123846_apbm003-clone-review.md
```

</details>

### Commit history since baseline

```text
4d64504 APBM-003 QA: record release commit SHA
189df31 APBM-003 QA: Director Q2 release, C-01/C-02 errata, state RELEASED FOR Q2
051344c APBM-003 QA: bind plan 194538a7, Director Q2 release
308247a APBM-003: prepare reviewed Stage 6 and DEV executor v2
49dec49 APBM-003: implement stages 0-5 and approved A02 test correction
01bd66d docs(apbm-003): reconcile E2 contract and release checkpoints
b23372d skill added
7abd8a6 apbm-003 placed
```

### Consolidated path inventory

| Path | Where | Status | What changed | Authority / ownership |
|---|---|---|---|---|
| `_SKILLS/README.md	agent_docs/SKILLS/README.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/CLAUDE.md	agent_docs/SKILLS/stark-cloud-deploy-skills/CLAUDE.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/V3_RELEASE_NOTES.md	agent_docs/SKILLS/stark-cloud-deploy-skills/V3_RELEASE_NOTES.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/next-deploy-execute/SKILL.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-execute/SKILL.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/next-deploy-execute/examples/PHASE_0_TO_1_WALKTHROUGH.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-execute/examples/PHASE_0_TO_1_WALKTHROUGH.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/next-deploy-execute/references/ANTI_PATTERNS.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-execute/references/ANTI_PATTERNS.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/next-deploy-generate/SKILL.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-generate/SKILL.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/next-deploy-generate/references/TEMPLATES.md	agent_docs/SKILLS/stark-cloud-deploy-skills/next-deploy-generate/references/TEMPLATES.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-cloud-deploy-skills/scripts/install-gcloud.sh	agent_docs/SKILLS/stark-cloud-deploy-skills/scripts/install-gcloud.sh` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/CLAUDE.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/CLAUDE.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/README.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/README.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/SKILL.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/SKILL.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/examples/mission-control-2026-07/README.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/examples/mission-control-2026-07/README.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/references/ANTI_PATTERNS.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/references/ANTI_PATTERNS.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/references/KIT_DEMO_MANIFEST.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/references/KIT_DEMO_MANIFEST.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/workflow/00-trace.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/workflow/00-trace.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-kit-residue-cleaner-skill/workflow/01-cleanup.md	agent_docs/SKILLS/stark-kit-residue-cleaner-skill/workflow/01-cleanup.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/CLAUDE.md	agent_docs/SKILLS/stark-recon-skill-v1.1/CLAUDE.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/README.md	agent_docs/SKILLS/stark-recon-skill-v1.1/README.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/SKILL.md	agent_docs/SKILLS/stark-recon-skill-v1.1/SKILL.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/examples/cyber-pharma-v1-phase2-recon-2026-06-08.md	agent_docs/SKILLS/stark-recon-skill-v1.1/examples/cyber-pharma-v1-phase2-recon-2026-06-08.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/references/ANTI_PATTERNS.md	agent_docs/SKILLS/stark-recon-skill-v1.1/references/ANTI_PATTERNS.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/references/EVIDENCE_DISCIPLINE.md	agent_docs/SKILLS/stark-recon-skill-v1.1/references/EVIDENCE_DISCIPLINE.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/templates/RECON_MISSION.md	agent_docs/SKILLS/stark-recon-skill-v1.1/templates/RECON_MISSION.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `_SKILLS/stark-recon-skill-v1.1/templates/RECON_REPORT_TEMPLATE.md	agent_docs/SKILLS/stark-recon-skill-v1.1/templates/RECON_REPORT_TEMPLATE.md` | 2.1 | R100 | Existing baseline-to-worktree change | Director review; outside current repair |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/AGENTS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_LEDGER.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_SPEC.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_BRIEF.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ENTRY.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_EXECUTION_PLAN.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md` | 2.1, 2.3 | A, M | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md` | 2.1, 2.3 | A, M | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_SKILLS_MANIFEST.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md` | 2.1, 2.3 | A, M | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APPLY_CHECKPOINT.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLAUDE.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CODY_LAUNCH_PROMPT.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SUCCESSION_RECORD.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` | 2.1, 2.3 | A, M | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E1_RECON_MISSION.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_AMENDMENT_A01.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_EXECUTION_INSTRUCTIONS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_RELEASE_MESSAGE.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1_PACKAGE_RECEIPT.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/CHANGE_SCOPE.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/COMMITTED_CONTRACT_HASHES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DEV_APPLY_HANDOFF.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DIRECTOR_RELEASE.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PACKAGE_RECEIPT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PRODUCT.diff` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/EXPECTED_MATRIX_DELTA.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/GIT_HANDOFF.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/HANDOFF_SUMMARY.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/OWNED_ARTIFACTS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PROTECTED_PATH_CHECK.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_DATA_PROBE.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_RETRY.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/RELEASE_CHECKS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SCRATCH_READONLY_PREFLIGHT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STAGE_CHECKPOINTS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STARTING_TRACKED_HASHES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/build.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/tsc.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/BASELINE_0047_CATALOG.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/STAGE_0_RECEIPT.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-test.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/forward-scratch-reset-1793891691098.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/migration-inventory.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/forward-apply-1793891825878.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/migration-inventory.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/forward-apply-1793891885995.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/trigger-proof.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/NO_ACCOUNT_NO_JUNCTION.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/forward-apply-1793892015163.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/GENERATOR_CONTROLS.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/MOCK_MONEY_AUDIT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/apbm-user-audit-proof.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-map.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-receipt-1793892147007.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-verify-attacked.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint-final.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/apbm-user-audit-proof.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-1.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-2.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-3.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-4.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-5.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-6.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-7.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-8.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-prove.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/catalog-approved.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/forward-scratch-reset-1793893233220.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/legacy-cast-cleanup.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-map.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-receipt-1793893280657.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-reset-1793893258075.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-verify-attacked.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/apbm-user-audit-proof.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-1.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-2.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-3.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-4.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-5.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-6.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-7.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-8.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-prove.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/catalog-approved.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/forward-scratch-reset-1793892988755.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/legacy-cast-cleanup.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/migration-inventory.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-map.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-receipt-1793893015180.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-reset-1793892997395.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-verify-attacked.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/authenticated-reads.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-runner-lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-types.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/tsc.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/CATALOG_EQUIVALENCE.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/already-applied-noop.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline-replay.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/complete.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892922977.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892925089.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892931150.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892932185.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-init-ledger-1793892918335.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-scratch-reset-1793892911758.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/init-ledger.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/inventory.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/migration-inventory.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial-failure.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/poison-manifest.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/recovery-rehearsal.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/rehearse.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-changed-inventory.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-stale-catalog.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/remaining-chain-recovery.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-map.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-receipt-1793893445623.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-reset-1793893424344.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-verify.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM-matrix_2026-11-05T1528.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED-matrix_2026-11-05T1533.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.normalised.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED-matrix_2026-11-05T1531.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.normalised.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.normalised.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_attacks_2026-11-05T1533.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_revocation_2026-11-05T1534.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_scoping_2026-11-05T1533.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1528.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1530.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1533.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892495697.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892615550.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892809067.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/migration-inventory.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/seed-map.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/runner-lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/tsc.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/GIT_COMMANDS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/HANDOFF.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PLAN.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PRESERVATION.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PROTECTED_BEFORE.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/RESULT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/REVIEW_FILES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES_BEFORE_STAGE6.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/ZIP_RECEIPT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/authenticated-reads.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/baseline-tests.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-check.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filter-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filters.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results-first-pass.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/build.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-tests.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-typecheck.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/local-server.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/owner-proof.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/run-scratch-app.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-before-browser.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-verify.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/tests.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/typecheck.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/BOARD_RESULTS.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/PRE_AMENDMENT_SOURCE_HASHES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/REVIEW.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TESTS_BEFORE.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TEST_CORRECTION.diff` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/build.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/BOARD_RESULTS.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/DISCLOSURE_RUN.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/PENDING_FILE_HASHES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/REVIEW.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/SOURCE_HASHES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/build.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest-results.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/lint.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/tsc.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/tsc.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/README.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/RUN_CONTEXT.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-reads.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-verifier-1794039202981.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/catalog.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-bootstrap-1794038740339.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-check-1794038634441.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-forward-1794038881799.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-ledger-1794038814674.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-prepare-1794038674081.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-probes-1794039228065.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-seed-1794039042941.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038759131.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038832790.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0052-1794038900225.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-seed-1794039080883.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-1794038865309.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-apply-1794038865020.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-init-ledger-1794038797991.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/init-ledger-1794038798263.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-1794039128076.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-proof.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-1794039010338.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-map.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-receipt-1794039010043.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039018815.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039056229.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039118150.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039263167.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/DEV_AUTH_FK_DEPENDENCIES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/EXECUTED_RUNNER.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/HANDOFF.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/INDEX_DEPENDENCY_REVIEW.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/LOCAL_FINAL_CHECKS.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/POSTFLIGHT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/PREFLIGHT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/RESULT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/REVIEW_HASHES.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/SCRATCH_APPLICATION_BOOTSTRAP.sql` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/acl-controls.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-reads.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-verifier.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/baseline-0047.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/check-dev-auth-indexes.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/complete-0052.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-after-catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-after.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-before.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-before-catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-0048-0052.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-apply-1793977302069.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-init-ledger-1793977296844.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/index-guard-test.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/init-ledger.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/inspect.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner-proof.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/postflight.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-probes.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-seed.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/rehearse.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/remove-prior-synthetic-cast.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-after-catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-before-catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-map.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-receipt-1793977322480.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-reset-1793977273803.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/starting-catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/verify-0047.log` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/HANDOFF.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/READINESS.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/SOURCE_CHECK.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/readiness.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/DEV_METADATA.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PLAN_MANIFEST.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSAL.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/REVIEW_FILES.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/STATIC_RESULTS.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/checks.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/static-checks.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/DEV_COMMANDS.sh` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/FINAL_READONLY_CHECK.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/HANDOFF.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READINESS.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READONLY_EXECUTION.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_COMMANDS.sh` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_RESULT.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REVIEW_FILES.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/RUNNER_TEST_RESULTS.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup-tool-check.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958434030.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958904994.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-runner.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/checkpoint-receipt.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/owner-check.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/rehearsal-receipt.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/runner-tests.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/BUNDLE_INPUTS.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/COMMITTED_RELEASE_CHECK_308247a.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/CONNECTION_SIGNUP.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_APPLICATION_BOOTSTRAP.sql` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_SIGNUP_CHECKPOINT.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_47.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_51.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_52.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_INPUT_PATHS.txt` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_RELEASE_COMMANDS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/HANDOFF.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/LOCK_PRIVILEGES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/READY_308247a.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_PATHS.txt` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_SHA256.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/REVIEW_SHA256.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RULING.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RUN_DEV_APPLY.sh` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/SCOPE_CHECK.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/TEST_RESULTS.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/VALIDATION.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/build-manifest.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/common.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793979737752.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980107801.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980439376.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794037368529.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794038449141.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/executor.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/prepare-release-scope.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/tests.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/BUILD.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/RUNTIME.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/SMOKE.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/build.log` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/launch.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/CLONE_SAFETY_HANDOFF.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_CHECK.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_FOLLOWUP.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/PASS_20261106T130308Z.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RECOVERY_COVERAGE.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/REPORT.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RESULT.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/compare.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/outbound-check.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_RESTORE_PRIVILEGE.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_MANAGED_OBJECT_PARITY.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_RESTORE_COMPATIBILITY.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/BACKUP_EXECUTION.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CLONE_REVIEW.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CONFIG_CHECK.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/DEV_API_KEYS_CHECK.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/HANDOFF.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_CAPABILITIES.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_PLAN_METADATA.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/REVIEW_FILES.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SCRATCH_AUTH_INDEX_PREREQUISITE.sql` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SNAPSHOT_BACKUP.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/VERDICT.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception-tests.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception.mjs` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-archive-component.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-tool-check.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/snapshot-backup.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/LOCAL_CHANGES.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/REPORT.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/baseline-diff.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/catalog.json` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-results.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-test.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/fencing-results.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/preflight.json` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/read-only-preflight.mjs` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/MISSING_INPUTS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/PROVENANCE.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AC_EVIDENCE_MATRIX.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AGENTS.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/README.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/build-package.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/cast-matrix.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/check-qa-env.sh` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/debug-pbm-options.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/derive.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/dev-apply-check.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/inventory.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/launch-dev-real.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/make-qa-env.mjs` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/money-rules.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/privacy-scan.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-env.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-shim.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/ro-sql.sh` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/role-matrix.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/scratch-sql.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/seed-hash.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t11_catalog.sql` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t21-trigger.mjs` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/CLAUDE.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/FINDINGS.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/GOVERNING/README.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1b_REVIEW_01.zip` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/ENGINEERING_HANDOFF.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX.template.json` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1_01.json` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1b_01.json` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q2_01.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q1b_AM-7_DRAFT.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q2_ADJUDICATION_01.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q4_RELEASE_RECORDS_2026-11-09.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/QA_HANDOFF.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/README.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/RELEASE_PASTE_2026-11-09.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1_01.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1b_01.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q2_01.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/PARENT_ENTRY_ROUTING.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_APPROVAL.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CERTIFICATION.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CLEANUP_REPORT.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_ENTRY.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_MANIFEST.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PACKAGING.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RECON_REPORT.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md` | 2.1, 2.3 | A, M | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/INVENTORY.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/README.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/admin/01/no_mutation.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/dev_catalog_projection.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/handle_new_user_dev.sql` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/projection_diff_policies.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings_raw.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_results.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_run.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/admin_rpcs.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix_attack_flip.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/dev_operation_counts.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials_attack_flip.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/operation_counts.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/owner_reach.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/seed_audit.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_reset1.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run1.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run2.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_before_run1.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_grep.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_intact.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/build.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/chain_status.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/ci.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest-results.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/lint.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/negative_controls.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/tsc.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/auth_walk.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run2.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/chain2_status.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/debug_pbm_MEMBER_B1.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_MEMBER_B1_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_OWNER3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/counts_OWNER3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B2_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B3_1440_dark.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B1_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B2B3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER1_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_UNRELATED_1440_dark.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/nomut_OWNER3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/r016_OWNER3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/spoof_OWNER3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_store_detail_B2.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_store_detail_B3.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_MEMBER_B1_federal_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_store_detail_A1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_federal_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_store_detail_B3.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_federal_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_store_detail_C1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_OWNER3_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_rerun_member_unrelated.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2_all.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/audit_window_check.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har/mockmode_OWNER3_1440_light.har` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har_rpc_check.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_admin_gate.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_owedbook.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/signins.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_1440x900_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B2B3_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375_drawer.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1_search.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_admin_stores_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_audit.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_denied_B3.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_store_detail_B2.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_admin_stores_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_audit.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_denied_B2.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_store_detail_B3.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_FAIL_MEMBER_B1_filters.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_empty_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_federal_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_owedbook_1440_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_admin_stores_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_audit.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_store_detail_A1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_admin_stores_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_audit.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_empty_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_federal_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_owedbook_1440_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_store_detail_B3.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_FAIL_UNRELATED_filters.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_admin_stores_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_audit.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_billing.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_empty_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_federal_1440.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_invite.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_owedbook_1440_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_settings.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_store_detail_C1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_kpis_aborted.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_rows_aborted.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_scope_aborted.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_1440x900_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B2B3_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375_drawer.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_dark.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_light.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_A1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_C1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/signins.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof_run1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD_mock.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build_mock.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/bundle_scan.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server_mock.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/board.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/cast.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/catalog_counts.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/matrix_delta.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/money_rules.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/policies.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/seed_audit.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/ui_dispatch_counts.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/check-qa-env_current.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/credential_mapping.md` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/env_qa_local_stat_names_only.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/make-qa-env_selftest.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/auth_path_diff.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/baseline_to_candidate_name_status.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/branch.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/candidate_to_head_diff.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/contract_hashes_as_read.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/e1_placeholder_counts.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/head.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/inherited_dirty_baseline_status.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/lockfile_diff.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/log_baseline_to_head.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/migrations_0001_0047_diff.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/package_json_diff.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/qa_generated_paths_status.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/allowlist_check.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/dirty_diff_vs_q1.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_end.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_start.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/lockfile_diff.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/package_json_diff.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/product_paths_baseline_to_candidate.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/q2_entry_check.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/records_check.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/ro_sql_fence_attacks.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/scratch_shim_fence_attack.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t00_repin.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t02_dependencies.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t05_auth_routes.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t06_migrations_0001_0047.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/PREFLIGHT_RESULTS.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/frontend_target_check.txt` | 2.1 | A | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/automation_scan.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/evidence_scan.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison_revert.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_clean_verify.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_poisoned_verify.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/seed_scan.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/grep_user_data.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_kpis_aborted.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_rows_aborted.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_scope_aborted.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/routes.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_A1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_C1.png` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA-matrix_2026-11-09T0404.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_CORRUPT_2026-11-09T0405.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.normalised.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_attacks_2026-11-09T0404.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_revocation_2026-11-09T0404.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_scoping_2026-11-09T0404.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X5_ac8_fresh_2026-11-09T0403.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/apbm-user-audit-proof.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-2.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-3.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-4.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-5.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-6.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-7.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-8.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-prove.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit_prove.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/catalog-approved.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify_probes.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794196996521.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794197163119.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_corruption.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff.patch` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff_review.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/inventory.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/legacy-cast-cleanup.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/migration-inventory.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/rls_prove.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-map.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-receipt-1794197197146.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-reset-1794197174115.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-verify-attacked.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_replay.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_control_at_47.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195352571.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195353893.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195356328.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195955934.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195958593.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195347747.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195951557.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_48_52.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_noop.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/inventory.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_after_tamper.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_dump.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/migration-inventory.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/no_account_no_junction.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin_after.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_2.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_3.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_tamper.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_through_47.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t10_status.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t11_status.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/tamper_restore.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_poison.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_revert.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_touch.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/cast.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/generator_review.md` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb2_status.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb_status.txt` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_revert.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_touch.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_attack.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run1.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run2.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules_baseline_control.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_revert.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_seed_verify.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_0.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_2.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-map.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196267399.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196295856.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196251686.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196277074.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-verify.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run1.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run2.json` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_1.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_2_compare.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_after_touch.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_attack.log` | 2.4 | ? | QA records/evidence or Engineer-owned handoff; current edits only as declared in §8 | Respective seat; Q4_RELEASE_RECORDS transcription / current instruction where applicable |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/README.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/RETROSPECTIVE.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/REVIEW_NOTE_FOR_JARVIS.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md` | 2.3 | M | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-06_125533_post-restore-comparison.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-06_131203_clone-safety-handoff.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-06_142444_stage6-handoff.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-06_144408_dev-apply-resume.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-06_151244_application-rehearsal.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-06_155930_dev-executor-v2.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_074800_dev-signup-checkpoint.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_080113_dev-ready-308247a.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_081351_existing-apply-diagnostic.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_081939_dev-manual-smoke.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_145747_apbm003-qam-q1-plan.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_162251_apbm003-qam-q1b-amendments.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_165422_apbm003-qam-am7-applied.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-07_170316_apbm003-qam-q2-entry-hold.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-09_103618_apbm003-qam-q2-execution.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_2026-11-09_cody_transcription.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/RESPONSES/response_20261106_123846_apbm003-clone-review.md` | 2.4 | ? | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/SESSIONS/session_2026-11-07.md` | 2.1, 2.3 | A, M | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `agent_docs/SESSIONS/session_2026-11-09_cody_transcription.md` | 2.1 | A | Existing pack/history/evidence plus current declared engineering records | Historical author / Director review; no new authority inferred from inclusion |
| `package.json` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/apply-forward.mjs` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/db-verify.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/dev-verify.mjs` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/ac8-check.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/attacks.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/audit-catalog.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/audit-prove.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/audit-seed.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/audit-session.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/audit-wrappers.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/expectations.json` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/harness.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/lib/env.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/policy-check.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/prove.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/revocation.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/scoping.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/rls-harness/seed.mjs` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/seed/README.md` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/seed/generate.mjs` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/seed/identity-scan.mjs` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/seed/reset.mjs` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/seed/run.mjs` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `scripts/seed/verify.mjs` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/__tests__/apbm-admin-readonly.test.tsx` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/__tests__/apbm-read-states.test.tsx` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/__tests__/apbm-tenant-scope.test.ts` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/__tests__/services/owedbook.test.ts` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/app/(admin)/layout.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/admin-portal/AddStoreButton.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/admin-portal/AuditScreen.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/admin-portal/BillingRow.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/admin-portal/BillingScreen.tsx` | 2.3 | M | C-03 label repair / F-05 guard plus prior implementation | C-03; current Director instruction |
| `src/components/admin-portal/DemoMarker.tsx` | 2.3 | M | C-03 label repair / F-05 guard plus prior implementation | C-03; current Director instruction |
| `src/components/admin-portal/InviteMemberForm.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/admin-portal/MemberRow.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/admin-portal/SettingsForm.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/admin-portal/statusPresentation.ts` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/global/MobileNav.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/global/Navbar.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/global/UserMenu.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/owedbook/FilterRail.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/owedbook/OwedBookContext.tsx` | 2.1, 2.3 | M, M | C-03 label repair / F-05 guard plus prior implementation | C-03; current Director instruction |
| `src/components/owedbook/OwedBookScreen.tsx` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/components/owedbook/StoreSelector.tsx` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/mocks/owedbook.ts` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/services/adminDemo.ts` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/services/owedbook.ts` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/services/tenantScope.ts` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/types/adminDemo.ts` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `src/types/supabase.ts` | 2.1 | M | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `supabase/migrations/0048_ownership.sql` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `supabase/migrations/0049_signup_member.sql` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `supabase/migrations/0050_claim_read_fence.sql` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `supabase/migrations/0051_admin_reads.sql` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |
| `supabase/migrations/0052_system_config.sql` | 2.1 | A | Prior APBM implementation; unchanged by this repair | A01/A02 and E2 release; historical claim, subject to independent allowlist verification |

Outside current repair scope: all paths except the twelve exact paths in §8; inherited changes preserved. Untracked receipts/reports, QA automation/evidence, session/response/campaign records are not included in Cody's scoped staging commands. Director decides their separate disposition. Ignored credentials and private backups remain uncommitted. After commit, T-00 must resolve the repaired SHA and compare actual product delta; this snapshot is not a release.

## 3. Claimed behavior and self-verification — 44 rows

| Claim | Self-verification command | Engineer result | Evidence | AC |
|---|---|---|---|---|
| CLAIM PASS (SCRATCH): 52-file replay, protected 0001–0047, ledger/no-op/partial-failure recovery; stage-5/rls and stage-5/recovery. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-101 |
| CLAIM PASS (SCRATCH): owner helper/union and real no-account/no-junction negative; stage-3/NO_ACCOUNT_NO_JUNCTION.json, stage-5/audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-102 |
| CLAIM PASS (SCRATCH): 15 exact policies, one per operation, owner reach; stage-5/rls and catalog-approved.json. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-103 |
| CLAIM PASS (SCRATCH): owner/admin/member account/subscription mutation denial without RETURNING; trusted unchanged-state proof; stage-5/audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-104 |
| CLAIM PASS (SCRATCH): exact trigger body and malicious metadata role produces member; stage-2/trigger-proof.json. DEV pending. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-105 |
| CLAIM PASS (SCRATCH): duplicate admin INSERT and UPDATE rejected; stage-5/audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-106 |
| CLAIM PASS (SCRATCH/source): no new policy uses platform roles; only 0049 touches user_roles; protected platform/auth code unchanged. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-107 |
| CLAIM PASS (SCRATCH): identical canonical reseed hashes with new Auth UUIDs; comparator poison detected; stage-5/reseed and audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-201 |
| CLAIM PASS (SCRATCH/local): all stored seeded columns scanned, clean control and synthetic patient-field poison; stage-5/audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-202 |
| CLAIM PASS (SCRATCH): seven named customers/no Operator, explicit roles/profiles, 3 accounts/5 stores/8 junctions; seed receipts. Non-seed Auth users preserved. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-203 |
| CLAIM PASS engineering instrument (SCRATCH): independent SQL 0/250 money failures, all chip/sign coverage, 3 PBMs+unmatched; generator five poisoned controls. Independent Claudy arithmetic pending. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-204 |
| CLAIM: generated A1 mock has 50 synthetic rows; A02 corrected stale fixtures; current mock board passes. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/test-amendment-A02/` | AC-205 |
| CLAIM PASS source: scripts/seed/README.md and deterministic generator construction/reset boundary. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-206 |
| CLAIM PASS (SCRATCH): each seed 285 service_role/NULL-actor events, reset never deletes/truncates audit rows; seed/reset receipts. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-207 |
| CLAIM: application claim reads use audited wrappers; real service has no direct user_data read. Stage 6 implementation and source inspection evidence retained. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-301 |
| CLAIM PASS (SCRATCH): direct SELECT 42501, all customer claim writes denied, seven legacy cells flipped with trusted unchanged-state checks; stage-5/rls and audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-302 |
| CLAIM PASS (SCRATCH): OWNER3 reads B2/B3 by ownership, refuses A1; unrelated refuses A/B; stage-5/audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-303 |
| CLAIM PARTIAL: SQL RPC audit counts and stage-6 audited reads recorded; original planned per-screen counts are not asserted as actual dispatch counts. Independent operation derivation remains the grading authority. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-304 |
| CLAIM PASS (SCRATCH): four named admin RPCs scoped/audited, member/unrelated denial; stage-5/audit-final. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-305 |
| CLAIM: DEV identity/backup/preservation verified in final receipt; restoreVerified=false. Full DEV restore rehearsal not demonstrated; C-02 accepted limitation, not full PASS. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json` | AC-401 |
| CLAIM: Tony executed forward DEV APPLY; final ledger 52 and catalog parity recorded; no APPLY rerun in this repair. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json` | AC-402 |
| CLAIM: final DEV receipt records seven synthetic customers, 250 claims, 19 Owner and 154 client checks, additive preservation. No reseed/reset performed in this repair. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json` | AC-403 |
| CLAIM: final DEV receipt records disabled signup and catalog parity. SCRATCH half N/A for Target One under C-04; no signup attempt in this repair. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json` | AC-404 |
| CLAIM: direct claim read denied; residual non-DML grants remain (F-02/C-05a), deferred to 0053. Not a claim that all grants were removed. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json` | AC-405 |
| CLAIM: real scoped RPC adapter plus explicit mock kill switch; service tests and live browser PASS on SCRATCH. Evidence: EVIDENCE/E2/stage-6/. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-501 |
| CLAIM: current repair adds exactly DemoMarker.tsx and BillingScreen.tsx under C-03 and takes its optional OwedBookContext.tsx guard; protected auth/migrations remain untouched. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-502 |
| CLAIM: seven-identity RPC scope board PASS; four-identity desktop browser plus Owner phone, all tabs, filters, sort, pager PASS on SCRATCH. Independent complete cast/browser Gate Q still pending. Evidence: EVIDENCE/E2/stage-6/. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-503 |
| CLAIM: real-user audited reads verified; 227 committed events across declared SCRATCH probes/browser runs. No DEV result claimed. Evidence: EVIDENCE/E2/stage-6/. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-504 |
| CLAIM: foreign-store RPC denied and forged request renders refusal in real browser; stale scope races PASS locally. Evidence: EVIDENCE/E2/stage-6/. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-505 |
| Protected auth paths unchanged; 58-file snapshot PASS. Staging/404 verification remains pending, not claimed. Evidence: EVIDENCE/E2/stage-6/. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-506 |
| CLAIM: KPI error never fabricated zeros, shared refresh and stale-response rejection PASS in component/browser checks. Evidence: EVIDENCE/E2/stage-6/. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-507 |
| CLAIM: scoped real admin reads implemented; C-03 real header copy corrected to Synthetic test data. Stage 6 SCRATCH evidence retained; repaired real-browser checks belong to Claudy. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-601 |
| CLAIM: real admin writes unavailable; Billing footer now states Billing actions are unavailable in this release. Mock copy unchanged. No new mutation behavior. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-602 |
| CLAIM: Owner/admin audited viewer PASS; member denial PASS on seven-user RPC board and browser route. Evidence: EVIDENCE/E2/stage-6/. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `EVIDENCE/E2/stage-6/HANDOFF.md` | AC-603 |
| CLAIM NOT RUN: no staging deployment of the certified candidate; pending Gate Q and separate Director deployment approval. | Not executed; Gate D pending | Engineering claim only; retained evidence unless §8 says rerun | `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md; QAM/QAM_MANIFEST.md §8; APBM_STATE.md; APBM_JOURNAL.md` | AC-701 |
| CLAIM NOT RUN: deployed-role smoke pending staging deployment and Gate D. | Not executed; Gate D pending | Engineering claim only; retained evidence unless §8 says rerun | `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md; QAM/QAM_MANIFEST.md §8; APBM_STATE.md; APBM_JOURNAL.md` | AC-702 |
| CLAIM NOT RUN: Gate D must be recorded by independent QA after deployment. | Not executed; Gate D pending | Engineering claim only; retained evidence unless §8 says rerun | `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md; QAM/QAM_MANIFEST.md §8; APBM_STATE.md; APBM_JOURNAL.md` | AC-703 |
| CLAIM engineering PASS: rls:prove and audit:prove from scratch, 320 cells, 28 attacks, 279 APBM checks; independent QA-controlled rerun pending. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-801 |
| CLAIM PASS (SCRATCH): exact 15-policy AC7 and structural oracle; stage-5/audit-final/audit-8.log. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-802 |
| CLAIM: repaired source typecheck PASS; lint 0 errors/34 warnings; Jest 39 suites/196 tests PASS, 0 skipped. Earlier build PASS retained; repaired production build not run to preserve existing server/build state. | npx tsc --noEmit --tsBuildInfoFile /tmp/apbm-q4.tsbuildinfo; npx eslint .; NEXT_PUBLIC_APBM_DATA_MODE=mock npx jest --runInBand --ci | Engineering claim only; retained evidence unless §8 says rerun | `QAM/QAM_MANIFEST.md §8; EVIDENCE/E2/stage-6/HANDOFF.md` | AC-803 |
| CLAIM PASS: dependencies and lockfile unchanged; package scripts only. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `APBM_ACCEPTANCE_LEDGER.md; EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md; EVIDENCE/E2/stage-5/` | AC-804 |
| CLAIM: manifest and engineering handoff filled with 44 AC rows and full path inventory; certified repaired candidate dc44429f466dedcf35023342f68624c6cee062f0; pagination successor pending its own commit/review. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md; QAM/QAM_MANIFEST.md §8; APBM_STATE.md; APBM_JOURNAL.md` | AC-901 |
| CLAIM: tester limitations and pending Gate D address recorded; truthful real-mode labels repaired; independent certification not claimed. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md; QAM/QAM_MANIFEST.md §8; APBM_STATE.md; APBM_JOURNAL.md` | AC-902 |
| CLAIM: retrospective E2 completion and stage-8 no-deployment entry plus current repair entry recorded in state/journal; authority and history preserved. | Read retained engineering evidence listed here; no live rerun in this repair | Engineering claim only; retained evidence unless §8 says rerun | `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md; QAM/QAM_MANIFEST.md §8; APBM_STATE.md; APBM_JOURNAL.md` | AC-903 |

## 4. Reproduction (exact commands)

All commands run from `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`. Listed reproduction commands are not permission to run database writes or deployment; none were executed in this repair except the local board.

| Step | Command / condition |
|---|---|
| Install | `npm ci` in an isolated clean checkout at Director's repaired SHA; not run here |
| Mock build | `NEXT_PUBLIC_APBM_DATA_MODE=mock npm run build` in an isolated checkout; not run here |
| Real build | `NEXT_PUBLIC_APBM_DATA_MODE=real npm run build` with Director-provided public Dev v1 configuration in isolated checkout; not run here |
| Serve mock artifact | `npm run start -- --hostname 127.0.0.1 --port 3140` in that isolated checkout; no server started here |
| SCRATCH fencing | `export RLS_HARNESS_PREFIX=RLS_REPLICA_ APBM_TARGET=scratch APBM_PROJECT_REF=ihgcsrypblqkwommrkgj APBM_ALLOW_DESTRUCTIVE=ihgcsrypblqkwommrkgj`; `export APBM_EVIDENCE_DIR="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reproduction"`; requires separate QA authorization and complete scoped credentials |
| Replay on SCRATCH only | `node scripts/apply-forward.mjs scratch-reset --manifest agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/migration-inventory.json`; `node scripts/apply-forward.mjs apply --manifest agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/migration-inventory.json` (ledger/no-op check) |
| Seed on SCRATCH only | `export APBM_CREDENTIAL_FILE="/tmp/apbm003-scratch-cast-$(date -u +%Y%m%dT%H%M%SZ).json"`; `npm run seed:reset`; `npm run seed:run`; `npm run seed:verify`; fresh private cast output path must not already exist; seed writes generated credentials with mode 0600, never logged |
| Proofs on SCRATCH only | `npm run rls:prove`; `npm run audit:prove`; `npm run db:verify` (authorized independent runtime only; not part of this repair) |
| Local repair board | `npx tsc --noEmit --tsBuildInfoFile /tmp/apbm-q4.tsbuildinfo`; `npx eslint .`; `NEXT_PUBLIC_APBM_DATA_MODE=mock npx jest --runInBand --ci` |
| Deployment package | Source handoff only for repaired candidate; no rebuilt repaired image/digest. Prior local build evidence retained. Gate Q, separate target approval and certified-candidate build/deploy precede Gate D. No deployment claimed. |

The tsBuildInfoFile override keeps compiler cache out of the checkout and existing running builds. Database proof commands are for separately released disposable SCRATCH only; never substitute shared DEV. Exact DEV run and recovery are historical in `EVIDENCE/apply/dev-executor-v2/HANDOFF.md`; do not rerun APPLY.

## 5. Environment (names only)

| Item | Fact |
|---|---|
| Targets | SCRATCH `ihgcsrypblqkwommrkgj`; intended rollout DEV `yrsuwikjnbmvpznrgydb`; staging pending Gate D |
| State | Recorded DEV ledger 52, synthetic seven-user cast, 250 claims/five stores. No live recheck this round. |
| Cast | OWNER1, OWNER3, ADMIN_B2, ADMIN_B3, MEMBER_B1, MEMBER_B2B3, UNRELATED; no Operator |
| Credentials | Director-managed `.env.qa.local`, declared names per QAM_ENTRY.md §4; existing validity per C-05b still requires `check-qa-env.sh` PASS at Q4 entry. Engineering SCRATCH prefix RLS_REPLICA_; no values read or recorded this round |
| Resources | Existing :3137 / :3138 untouched. Independent QA owns its build and port. Reproduction example uses 3140 in isolation only |
| Toolchain observed | Node v22.14.0; TypeScript 5.5.4; dependencies locked in package-lock.json |

## 6. Limitations, preserved paths and rollback

Synthetic data only; calculation values are fixtures; admin write actions unavailable; cross-tab sign-out takes effect on next navigation (F-06/C-05c); restore rehearsal not demonstrated on DEV (AC-401/C-02); residual non-DML grants pending 0053_privilege_hardening (F-02/C-05a). Database password rotation deferred under Director risk acceptance (F-04/C-05b); no claim of rotation or remediation. Credential validity and the QA environment checker remain required. Manual smoke, independent certification and Gate D remain pending their respective owners.

Protected auth paths, migrations 0001–0047, services, scripts, dependencies/lockfile and environment files were not changed by this repair. Read-only comparison of lockfile, auth/proxy and next config to baseline returned no delta. No DB or cloud access this round. Backups remain private and intact by non-interference; no new hash verification claimed. Rollback is a Director-reviewed forward repair; database recovery follows the retained executor runbook and private backup receipt, never automatic reset. No staging artifact or deployed-revision result exists for this repaired candidate yet.

## 7. Meaning of engineering evidence

| Evidence | Meaning (CLAIM) | Independent re-derivation |
|---|---|---|
| `../EVIDENCE/E2/stage-5/` | Original migration, RLS, audit, seed and adversarial runner checks | Separate authorized SCRATCH proofs |
| `../EVIDENCE/E2/stage-6/HANDOFF.md` | Original source/UI/role-read engineering checks and preserved-path snapshot | Candidate source review and independent role/browser tests |
| `../EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json` | Director DEV APPLY receipt; narrow synthetic rehearsal; restoreVerified false | Inspect receipt and permitted independent DEV checks |
| §8 below | Current local repair board, source hashes and exact changed paths | Re-pin Director commit; rerun board and approved Q4 scope |

## 8. Factual amendments after handoff — 2026-11-09, Cody

C-03 amendment: `src/components/admin-portal/DemoMarker.tsx` and `src/components/admin-portal/BillingScreen.tsx` use the existing isDemoMode predicate; real copy corrected, mock copy unchanged. **Optional F-05 guard TAKEN** in `src/components/owedbook/OwedBookContext.tsx`: same-store selection returns before clearing filters/options; callback includes storeId dependency. No other product files changed; no tests updated, added, skipped or disabled. Required independent T-33 OwedBook leg therefore applies. This record does not release Q4.

Exact current-session files (including transcriptions and engineering records):

- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/QA_HANDOFF.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_APPROVAL.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_MANIFEST.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/ENGINEERING_HANDOFF.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md`
- `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md`
- `src/components/admin-portal/DemoMarker.tsx`
- `src/components/admin-portal/BillingScreen.tsx`
- `src/components/owedbook/OwedBookContext.tsx`

| Product path | SHA-256 after repair |
|---|---|
| `src/components/admin-portal/DemoMarker.tsx` | `644adf25a48f5c4a4e84827ec6d44a0e0dcbad85d734dfc3fb0e79b7d3ccd269` |
| `src/components/admin-portal/BillingScreen.tsx` | `f1771545492d95dc432b2f7edf7b9a9cdc89811022b167a10ceda52118911fad` |
| `src/components/owedbook/OwedBookContext.tsx` | `80b8705f43aecb73c7ff3141ffc6db70a7d45fa95dcb98e38b6065ca5f33e954` |

Local board results (engineering, not QA):

| Check | Exit | Result | Log SHA-256 (private machine /tmp, not committed) |
|---|---|---|---|
| tsc | 0 | PASS; no diagnostics | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| eslint | 0 | PASS; 0 errors / 34 warnings | `399d0ad4b1c16dd2cb82a2859cd2310a311977198527548f6d93f0d7908f3f93` |
| jest | 0 | PASS; 39/39 suites, 196/196 tests, 0 skipped | `626a7ffd0d236e82d531f213f1b4d34ae65d340f171e6395ab4310261665f676` |

Current board log excerpts (durable factual record):

```text
TypeScript: exit 0; no diagnostics
✖ 34 problems (0 errors, 34 warnings)
Test Suites: 39 passed, 39 total
Tests:       196 passed, 196 total
Snapshots:   0 total
Time:        6.048 s, estimated 9 s
Ran all test suites.
```

### 2026-11-09 — Director-approved pagination presentation repair (Cody)

New product revision after prior candidate dc44429f466dedcf35023342f68624c6cee062f0; Friday targeted review required. The previous certificate/candidate identity is preserved, not extended. Director-authorized exact source/test paths: `src/components/owedbook/OwedBookScreen.tsx`, `src/components/owedbook/ResultsToolbar.tsx`, `src/__tests__/owedbook/ResultsToolbar.test.tsx`, `src/__tests__/apbm-read-states.test.tsx`. Documentation paths: APBM_RULINGS.md, this manifest §8, APBM_JOURNAL.md; new evidence confined to EVIDENCE/E2/pagination-usability/ (enumerated in its README).

CLAIM: prominent results toolbar below active paginated table, outside horizontal scroll, dynamic actual ranges, readable disabled native buttons, responsive light/dark token styling. Existing handlers/query effects untouched; no Summary/Federal pagination. Local board 40 suites/201 tests PASS, typecheck/build PASS, lint 0 errors/34 warnings. Sixteen isolated actual-component layouts PASS; all button/panel text contrast ≥4.5, controls ≥44px, no overflow and visible focus. Integration verifies no extra rows/KPI/options requests, filter/store resets, partial/empty results and hidden non-paginated toolbar. Source hashes, logs, screenshots and exact reproduction in `../EVIDENCE/E2/pagination-usability/`. No DB writes/authenticated probes, no Git mutation, no deployment. Updated local app at http://localhost:3000; refresh required. Live manual smoke and independent targeted review remain pending.


## 2026-11-09 closeout reconciliation — Cody

F-09 repaired identity is now explicit. Tony accepts Target One with limitations and reports Owner admin views, filters, store switching, pagination and mobile working; MEMBER_B1 filters/mobile working with no admin access reported; pagination usability approved as beautiful/perfect. No Director UNRELATED test, exact picker verification or full seven-account smoke is claimed. Friday's unchanged certificate binds dc44429f only: 40 PASS, 1 ACCEPTED LIMITATION (AC-401 restore not demonstrated), 3 NOT RUN. Pagination successor requires Friday's targeted disposition; cleanup acceptance remains unrecorded. DEV APPLY succeeded; deployment deferred; Gate D/production readiness pending. See CLOSEOUT/CLOSEOUT.md, FOLLOW_UPS.md and RETROSPECTIVE.md at module root/closeout paths.
