> **Current scoped Git handoff:** use [dev-executor-v2/GIT_RELEASE_COMMANDS.md](../apply/dev-executor-v2/GIT_RELEASE_COMMANDS.md) and its finite `RELEASE_PATHS.txt`. The older target-only commands below are historical and do not cover the accepted Stage 6 work and v2 release package. Signup verification is currently BLOCKED; no waiver requested or DEV write executed.

# Tony-only Git handoff — DEV target correction

Current checkpoint is 49dec499d665125bb8764ccc8ea498c5fdfcdcd1 on apbm-003. Previous stages 0–5/A02 are already committed. The target correction, its APBM evidence and the proposed DEV-specific bootstrap are pending. The executable bootstrap/rehearsal handoff is prepared; shared DEV execution is blocked until its prerequisite receipts pass. Source hash verification passes for the updated 34-file manifest; only env.mjs changes product bytes. No agent Git mutation occurred. This commit does not clear the blocked live baseline or release DEV writes.

Review the read-only findings at ../apply/dev-target-reconciliation/REPORT.md. The live two-table schema does not match the 0047 baseline.

```bash
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
test "$(git branch --show-current)" = apbm-003
test "$(git rev-parse HEAD)" = 49dec499d665125bb8764ccc8ea498c5fdfcdcd1
git diff --cached --quiet
git diff --check
git diff -- scripts/rls-harness/lib/env.mjs
git add -- \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DEV_APPLY_HANDOFF.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/GIT_HANDOFF.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/DEV_METADATA.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PLAN_MANIFEST.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSAL.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/REVIEW_FILES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/STATIC_RESULTS.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/checks.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/static-checks.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/DEV_COMMANDS.sh \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/FINAL_READONLY_CHECK.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/HANDOFF.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READINESS.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READONLY_EXECUTION.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_COMMANDS.sh \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_RESULT.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REVIEW_FILES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/RUNNER_TEST_RESULTS.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup-tool-check.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958434030.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958904994.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-runner.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/checkpoint-receipt.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/owner-check.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/rehearsal-receipt.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/runner-tests.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_RESTORE_PRIVILEGE.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_MANAGED_OBJECT_PARITY.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_RESTORE_COMPATIBILITY.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/BACKUP_EXECUTION.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CONFIG_CHECK.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/DEV_API_KEYS_CHECK.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/HANDOFF.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_CAPABILITIES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_PLAN_METADATA.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/REVIEW_FILES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SCRATCH_AUTH_INDEX_PREREQUISITE.sql \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SNAPSHOT_BACKUP.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/VERDICT.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception-tests.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-archive-component.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-tool-check.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/snapshot-backup.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/LOCAL_CHANGES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/REPORT.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/baseline-diff.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/catalog.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-test.mjs \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/fencing-results.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/preflight.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/read-only-preflight.mjs \
  scripts/rls-harness/lib/env.mjs
git diff --cached --check
git diff --cached --stat
git diff --cached
```

After reviewing those exact staged files, Tony may run:

```bash
git commit -m "APBM-003: correct DEV target and propose preserved-data baseline bootstrap"
git rev-parse HEAD
git status --short
```

No push or DEV operation is included. Baseline reconciliation, affected-state backup/restore rehearsal and complete runner credentials remain pending.
