#!/usr/bin/env bash
# Reviewed execution on the confirmed restored disposable copy ONLY. Not run by Cody.
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
export APBM_PACK="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA"
export APBM_EXEC="$APBM_PACK/EVIDENCE/apply/dev-bootstrap-execution"
: "${APBM_RESTORE_RECEIPT:?Provide the verified DEV-to-SCRATCH restore receipt}"
: "${APBM_BACKUP_RECEIPT:?Provide the complete affected-DEV backup receipt}"
export RLS_HARNESS_PREFIX=RLS_REPLICA_
export APBM_TARGET=scratch
export APBM_PROJECT_REF=ihgcsrypblqkwommrkgj
export APBM_BOOTSTRAP_SCRATCH="$APBM_PROJECT_REF"
export APBM_EVIDENCE_DIR="$APBM_PACK/EVIDENCE/apply/RESTORED_REHEARSAL_$(date -u +%Y%m%dT%H%M%SZ)_$$"
mkdir "$APBM_EVIDENCE_DIR"
unset APBM_DIRECTOR_APPLY APBM_DIRECTOR_BOOTSTRAP APBM_ALLOW_DESTRUCTIVE APBM_FAULT_REHEARSAL
node "$APBM_EXEC/bootstrap-runner.mjs" check
export APBM_PRESERVATION_FILE="/tmp/apbm003-rollback-proof-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
node "$APBM_EXEC/bootstrap-runner.mjs" fault
export APBM_PRESERVATION_FILE="/tmp/apbm003-bootstrap-proof-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
node "$APBM_EXEC/bootstrap-runner.mjs" apply
# Independent check: exact 0047 plus preservation, with APBM ledger still absent.
node "$APBM_EXEC/bootstrap-runner.mjs" verify
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json"
# Only now may the COPY acquire an APBM ledger.
node scripts/apply-forward.mjs init-ledger --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --baseline "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --through 47
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 47
node scripts/apply-forward.mjs apply --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --before "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --through 52
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/complete.json" --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 52
export APBM_CREDENTIAL_FILE="/tmp/apbm003-restored-cast-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
node scripts/seed/run.mjs
node scripts/seed/verify.mjs --compare "$APBM_PACK/EVIDENCE/E2/stage-5/reseed/seed-verify.json"
# Explicitly declared: 1 Owner login/logout session and 4 audit inserts.
export APBM_AUTHENTICATED_PROBES="$APBM_PROJECT_REF"
node "$APBM_EXEC/owner-check.mjs"
# Separately: 7 login/logout sessions and 48 audit inserts.
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/complete.json" --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 52 --authenticated
node "$APBM_EXEC/rehearsal-receipt.mjs"
unset APBM_AUTHENTICATED_PROBES APBM_BOOTSTRAP_SCRATCH
