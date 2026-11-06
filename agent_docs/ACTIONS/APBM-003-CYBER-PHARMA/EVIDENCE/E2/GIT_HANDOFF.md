# Tony-only Git handoff — A02 included

These commands are for Tony to review and execute; Cody performed no Git mutation. They stage the 34 enumerated product/test files and the exact current APBM evidence/documents. No directory path or wildcard broadens product scope. Prior ZIP 01 is historical; current test results and hashes supersede its test blocker. Do not use the starting HEAD as the identity of uncommitted implementation bytes.

```bash
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
test "$(git branch --show-current)" = apbm-003
test "$(git rev-parse HEAD)" = 01bd66d13b0951a0d0553f1fba0609c0f05e2855
# Stop if anything is already staged; review it separately.
git diff --cached --quiet
git diff --check
git status --short
python3 - <<'VERIFY_SOURCE_HASHES'
import hashlib, json, pathlib
p = pathlib.Path('agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json')
for name, expected in json.loads(p.read_text()).items():
    assert hashlib.sha256(pathlib.Path(name).read_bytes()).hexdigest() == expected, name
print('PASS: all 34 source hashes match')
VERIFY_SOURCE_HASHES
git add -- \
  package.json \
  scripts/apply-forward.mjs \
  scripts/db-verify.mjs \
  scripts/dev-verify.mjs \
  scripts/rls-harness/ac8-check.mjs \
  scripts/rls-harness/attacks.mjs \
  scripts/rls-harness/audit-catalog.mjs \
  scripts/rls-harness/audit-prove.mjs \
  scripts/rls-harness/audit-seed.mjs \
  scripts/rls-harness/audit-session.mjs \
  scripts/rls-harness/audit-wrappers.mjs \
  scripts/rls-harness/expectations.json \
  scripts/rls-harness/harness.mjs \
  scripts/rls-harness/lib/env.mjs \
  scripts/rls-harness/policy-check.mjs \
  scripts/rls-harness/prove.mjs \
  scripts/rls-harness/revocation.mjs \
  scripts/rls-harness/scoping.mjs \
  scripts/rls-harness/seed.mjs \
  scripts/seed/README.md \
  scripts/seed/generate.mjs \
  scripts/seed/identity-scan.mjs \
  scripts/seed/reset.mjs \
  scripts/seed/run.mjs \
  scripts/seed/verify.mjs \
  src/mocks/owedbook.ts \
  src/types/supabase.ts \
  supabase/migrations/0048_ownership.sql \
  supabase/migrations/0049_signup_member.sql \
  supabase/migrations/0050_claim_read_fence.sql \
  supabase/migrations/0051_admin_reads.sql \
  supabase/migrations/0052_system_config.sql \
  src/__tests__/services/owedbook.test.ts \
  src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_LEDGER.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/CHANGE_SCOPE.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/COMMITTED_CONTRACT_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DEV_APPLY_HANDOFF.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DIRECTOR_RELEASE.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PACKAGE_RECEIPT.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PRODUCT.diff \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/EXPECTED_MATRIX_DELTA.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/GIT_HANDOFF.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/HANDOFF_SUMMARY.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/OWNED_ARTIFACTS.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PROTECTED_PATH_CHECK.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_DATA_PROBE.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_RETRY.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/RELEASE_CHECKS.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SCRATCH_READONLY_PREFLIGHT.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STAGE_CHECKPOINTS.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STARTING_TRACKED_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/build.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/lint.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/tsc.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/BASELINE_0047_CATALOG.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/STAGE_0_RECEIPT.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/catalog.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-test.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/forward-scratch-reset-1793891691098.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/migration-inventory.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/catalog.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/forward-apply-1793891825878.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/migration-inventory.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/forward-apply-1793891885995.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/trigger-proof.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/NO_ACCOUNT_NO_JUNCTION.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/catalog.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/forward-apply-1793892015163.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/GENERATOR_CONTROLS.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/MOCK_MONEY_AUDIT.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/apbm-user-audit-proof.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-map.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-receipt-1793892147007.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-verify-attacked.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint-final.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/apbm-user-audit-proof.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-1.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-2.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-3.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-4.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-5.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-6.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-7.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-8.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-prove.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/catalog-approved.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/forward-scratch-reset-1793892988755.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/legacy-cast-cleanup.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/migration-inventory.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-map.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-receipt-1793893015180.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-reset-1793892997395.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-verify-attacked.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/apbm-user-audit-proof.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-1.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-2.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-3.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-4.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-5.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-6.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-7.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-8.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-prove.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/catalog-approved.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/forward-scratch-reset-1793893233220.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/legacy-cast-cleanup.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-map.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-receipt-1793893280657.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-reset-1793893258075.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-verify-attacked.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/authenticated-reads.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/catalog.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-runner-lint.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-types.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/lint.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/tsc.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/CATALOG_EQUIVALENCE.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/already-applied-noop.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline-replay.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/complete.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892922977.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892925089.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892931150.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892932185.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-init-ledger-1793892918335.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-scratch-reset-1793892911758.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/init-ledger.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/inventory.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/migration-inventory.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial-failure.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/poison-manifest.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/recovery-rehearsal.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/rehearse.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-changed-inventory.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-stale-catalog.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/remaining-chain-recovery.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/catalog.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-map.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-receipt-1793893445623.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-reset-1793893424344.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-verify.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM-matrix_2026-11-05T1528.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED-matrix_2026-11-05T1533.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.normalised.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED-matrix_2026-11-05T1531.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.normalised.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.normalised.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_attacks_2026-11-05T1533.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_revocation_2026-11-05T1534.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_scoping_2026-11-05T1533.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1528.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1530.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1533.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892495697.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892615550.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892809067.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/migration-inventory.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/seed-map.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/runner-lint.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/tsc.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/BOARD_RESULTS.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/PRE_AMENDMENT_SOURCE_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/REVIEW.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TESTS_BEFORE.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TEST_CORRECTION.diff \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/build.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/lint.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/BOARD_RESULTS.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/DISCLOSURE_RUN.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/PENDING_FILE_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/REVIEW.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/SOURCE_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/build.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/lint.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/tsc.log \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/tsc.log
git diff --cached --check
git diff --cached --stat
git diff --cached --name-only
# Review the staged diff before executing the commit command below.
git diff --cached
```

After reviewing the staged paths/content:

```bash
git commit -m "APBM-003: implement stages 0-5 and approved A02 test correction"
git rev-parse HEAD
git status --short
```

Record the resulting full SHA in the DEV APPLY receipt as the reviewed runner commit. This checkpoint commit authorizes neither DEV apply before its prerequisites nor stage 6 before Tony's APPLY receipt. No push, branch switch or reset is requested.
