#!/usr/bin/env bash
# Read-only diagnosis by default. Only explicit resume-0052 is a write action.
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
: "${APBM_EVIDENCE_DIR:?Set the ORIGINAL failed run directory printed by RUN_DEV_APPLY.sh}"
# Recover only path/commit metadata from the original run context. No credentials.
export APBM_PRESERVATION_FILE="$(node --input-type=module -e 'import fs from "node:fs";const x=JSON.parse(fs.readFileSync(process.env.APBM_EVIDENCE_DIR+"/RUN_CONTEXT.json"));if(x.APBM_EVIDENCE_DIR!==process.env.APBM_EVIDENCE_DIR)process.exit(1);process.stdout.write(x.APBM_PRESERVATION_FILE);')"
export APBM_CREDENTIAL_FILE="$(node --input-type=module -e 'import fs from "node:fs";const x=JSON.parse(fs.readFileSync(process.env.APBM_EVIDENCE_DIR+"/RUN_CONTEXT.json"));process.stdout.write(x.APBM_CREDENTIAL_FILE);')"
export APBM_EXEC_V2="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2"
export RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
case "${1:-inspect}" in
 inspect)
  unset APBM_DIRECTOR_APPLY APBM_DIRECTOR_RECOVERY APBM_AUTHENTICATED_PROBES
  node "$APBM_EXEC_V2/executor.mjs" recover-inspect
  ;;
 resume-0052)
  # Only after inspect reports MATCH_51 and Tony reviews the original failure.
  : "${APBM_RELEASED_RUNNER_COMMIT:?Reviewed full commit required}"
  : "${APBM_DEV_MAINTENANCE_READY:?Maintenance confirmation required}"
  : "${APBM_DIRECTOR_RECOVERY:?Set yrsuwikjnbmvpznrgydb for this reviewed remaining-chain action}"
  export APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb
  node "$APBM_EXEC_V2/executor.mjs" resume-0052
  node "$APBM_EXEC_V2/executor.mjs" verify-0052
  unset APBM_DIRECTOR_APPLY APBM_DIRECTOR_RECOVERY
  ;;
 *) printf 'Only inspect or explicitly approved resume-0052 is supported.\n' >&2; exit 2;;
esac
