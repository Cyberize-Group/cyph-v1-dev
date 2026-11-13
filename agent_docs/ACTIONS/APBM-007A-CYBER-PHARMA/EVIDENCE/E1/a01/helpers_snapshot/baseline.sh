#!/usr/bin/env bash
# APBM007A E1 baseline — disposable copies only; placeholder env; no external-effect suites.
set -u
W=/home/moose/NEXTJS/CYBER_PHARMA/APBM007A_E1_WORK/a01
export NEXT_TELEMETRY_DISABLED=1 CI=1
export NEXT_PUBLIC_SUPABASE_URL=https://placeholder-e1-baseline.invalid
export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_placeholder
export NEXT_PUBLIC_SITE_URL=http://localhost:3000
step(){ # name dir cmd...
  local name=$1 dir=$2; shift 2
  local log=$W/out/baseline_$name.log
  local t0=$(date +%s)
  (cd "$dir" && "$@") >"$log" 2>&1; local rc=$?
  echo "$name exit=$rc secs=$(( $(date +%s)-t0 ))" | tee -a $W/out/baseline_summary.txt
}
: > $W/out/baseline_summary.txt
step pp_headlock_ci_dryrun $W/baseline/pp-headlock npm ci --ignore-scripts --dry-run
for a in ob pp; do
  d=$W/baseline/$a
  step ${a}_npm_ci $d npm ci --no-audit --no-fund
  step ${a}_typecheck $d npx --no-install tsc --noEmit
  step ${a}_lint $d npm run lint
  step ${a}_jest $d npx --no-install jest --ci
  step ${a}_build $d npm run build
done
echo DONE >> $W/out/baseline_summary.txt
