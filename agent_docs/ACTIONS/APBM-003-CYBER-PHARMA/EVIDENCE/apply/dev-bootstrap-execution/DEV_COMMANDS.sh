#!/usr/bin/env bash
# TONY ONLY, after privileged restore/bootstrap rehearsal and prerequisites PASS.
# This script has NOT been run on shared DEV. It stops at the first failure.
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
: "${APBM_RELEASED_RUNNER_COMMIT:?Set the reviewed full commit after you commit the reviewed files}"
: "${APBM_REHEARSAL_RECEIPT:?Set the completed restored-SCRATCH rehearsal receipt path}"
: "${APBM_BACKUP_RECEIPT:?Set the complete affected-DEV backup receipt path}"
: "${APBM_DEV_CHECKPOINT_RECEIPT:?Set the Director receipt recording signup evidence or checkpoint waiver and maintenance readiness}"
test "$(git branch --show-current)" = apbm-003
test "$(git rev-parse HEAD)" = "$APBM_RELEASED_RUNNER_COMMIT"
git diff --quiet
git diff --cached --quiet
git ls-files --error-unmatch agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-runner.mjs >/dev/null
export APBM_PACK="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA"
export APBM_EXEC="$APBM_PACK/EVIDENCE/apply/dev-bootstrap-execution"
export RLS_HARNESS_PREFIX=APBM_DEV_
export APBM_TARGET=dev
export APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR="$APBM_PACK/EVIDENCE/apply/DEV_BOOTSTRAP_$(date -u +%Y%m%dT%H%M%SZ)_$$"
mkdir "$APBM_EVIDENCE_DIR"
unset APBM_DIRECTOR_APPLY APBM_DIRECTOR_BOOTSTRAP APBM_ALLOW_DESTRUCTIVE APBM_FAULT_REHEARSAL
node "$APBM_EXEC/checkpoint-receipt.mjs"
node "$APBM_EXEC/bootstrap-runner.mjs" check
# The runner independently requires matching complete backup/rehearsal receipts.
export APBM_DIRECTOR_BOOTSTRAP="$APBM_PROJECT_REF"
export APBM_PRESERVATION_FILE="/tmp/apbm003-dev-preservation-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
node "$APBM_EXEC/bootstrap-runner.mjs" apply
node "$APBM_EXEC/bootstrap-runner.mjs" verify
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json"
unset APBM_DIRECTOR_BOOTSTRAP
# The baseline and preserved-data proof must pass with NO APBM ledger first.
export APBM_DIRECTOR_APPLY="$APBM_PROJECT_REF"
node scripts/apply-forward.mjs init-ledger --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --baseline "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --through 47
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 47
node scripts/apply-forward.mjs apply --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --before "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --through 52
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/complete.json" --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 52
export APBM_CREDENTIAL_FILE="/tmp/apbm003-dev-cast-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
node scripts/seed/run.mjs
node scripts/seed/verify.mjs --compare "$APBM_PACK/EVIDENCE/E2/stage-5/reseed/seed-verify.json"
# Explicitly declared future effects: 1 Owner session + 4 audited reads.
export APBM_AUTHENTICATED_PROBES="$APBM_PROJECT_REF"
node "$APBM_EXEC/owner-check.mjs"
# Separate bounded verifier: 7 sessions + 48 audit inserts; no business mutation.
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/complete.json" --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 52 --authenticated
unset APBM_AUTHENTICATED_PROBES APBM_DIRECTOR_APPLY
# Tony records APPLY_RECEIPT.md. Cody resumes only after that receipt.
