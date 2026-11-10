#!/usr/bin/env bash
# TONY ONLY. Shared DEV application bootstrap/forward/seed after reviewed commit.
# No reset, Auth index DDL, managed default-ACL changes or automatic recovery.
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
: "${APBM_RELEASED_RUNNER_COMMIT:?Set the full reviewed commit after Tony commits the approved inputs}"
: "${APBM_DEV_MAINTENANCE_READY:?Set to yrsuwikjnbmvpznrgydb only when the coordinated maintenance window is active}"
[[ "$APBM_DEV_MAINTENANCE_READY" == yrsuwikjnbmvpznrgydb ]]
[[ "$(git branch --show-current)" == apbm-003 ]]
[[ "$(git rev-parse HEAD)" == "$APBM_RELEASED_RUNNER_COMMIT" ]]
git diff --quiet
git diff --cached --quiet
export APBM_EXEC_V2="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2"
export RLS_HARNESS_PREFIX=APBM_DEV_
export APBM_TARGET=dev
export APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_$(date -u +%Y%m%dT%H%M%SZ)_$$"
mkdir "$APBM_EVIDENCE_DIR"
export APBM_PRESERVATION_FILE="/tmp/apbm003-dev-v2-preservation-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
export APBM_CREDENTIAL_FILE="/tmp/apbm003-dev-v2-cast-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
unset APBM_DIRECTOR_APPLY APBM_DIRECTOR_RECOVERY APBM_AUTHENTICATED_PROBES APBM_ALLOW_DESTRUCTIVE APBM_FAULT_REHEARSAL
# Save paths only, never SQL strings, keys, passwords or Auth rows.
node --input-type=module -e 'import fs from "node:fs"; const keys=["APBM_EVIDENCE_DIR","APBM_PRESERVATION_FILE","APBM_CREDENTIAL_FILE","APBM_RELEASED_RUNNER_COMMIT"];fs.writeFileSync(process.env.APBM_EVIDENCE_DIR+"/RUN_CONTEXT.json",JSON.stringify(Object.fromEntries(keys.map(k=>[k,process.env[k]])),null,2)+"\n",{flag:"wx"});'
printf 'APBM evidence directory: %s\n' "$APBM_EVIDENCE_DIR"
# 1. Read-only current target, signup/waiver, source hashes, backup and Auth indexes.
node "$APBM_EXEC_V2/executor.mjs" check
# 2. Read-only capture of the exact preserved rows/roles/metadata and all Auth indexes.
node "$APBM_EXEC_V2/executor.mjs" prepare
# 3. Tony's write confirmation starts here. Bootstrap checks run inside ONE transaction.
export APBM_DIRECTOR_APPLY="$APBM_PROJECT_REF"
node "$APBM_EXEC_V2/executor.mjs" bootstrap
# 4. Prove 0047 with NO APBM ledger before recording history.
node "$APBM_EXEC_V2/executor.mjs" verify-0047
# 5. Initialize exact 47 migration hashes, then verify again.
node "$APBM_EXEC_V2/executor.mjs" ledger
node "$APBM_EXEC_V2/executor.mjs" verify-0047
# 6. Forward-only 0048–0052; each migration + its ledger row is one transaction.
node "$APBM_EXEC_V2/executor.mjs" forward
node "$APBM_EXEC_V2/executor.mjs" verify-0052
# 7. Recreate the approved seven test accounts/roles and synthetic slice once.
# Existing Auth users/profiles/roles are preserved; any cast collision stops.
node "$APBM_EXEC_V2/executor.mjs" seed
node "$APBM_EXEC_V2/executor.mjs" verify-seed
# 8. Real-client proofs: 8 login/logout sessions + 52 audited-read inserts.
export APBM_AUTHENTICATED_PROBES="$APBM_PROJECT_REF"
node "$APBM_EXEC_V2/executor.mjs" probes
unset APBM_AUTHENTICATED_PROBES APBM_DIRECTOR_APPLY
# 9. Read-only final receipt. Requires successful live DEV RPC/denial proofs.
node "$APBM_EXEC_V2/executor.mjs" final
printf 'DEV APPLY checks passed. Review the final receipt in %s and perform the manual app smoke.\n' "$APBM_EVIDENCE_DIR"
