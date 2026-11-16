#!/usr/bin/env bash
W=/home/moose/NEXTJS/CYBER_PHARMA/APBM007A_E1_WORK/a01; export NEXT_TELEMETRY_DISABLED=1 CI=1 NEXT_PUBLIC_SUPABASE_URL=https://placeholder-e1-baseline.invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_placeholder NEXT_PUBLIC_SITE_URL=http://localhost:3000
cd $W/baseline/pp-head; : > $W/out/baseline_head_summary.txt
for s in "npm_ci:npm ci --no-audit --no-fund" "typecheck:npx --no-install tsc --noEmit" "jest:npx --no-install jest --ci" "build:npm run build"; do n=${s%%:*}; c=${s#*:}; $c > $W/out/baseline_pphead_$n.log 2>&1; echo "pphead_$n exit=$?" >> $W/out/baseline_head_summary.txt; done; echo DONE >> $W/out/baseline_head_summary.txt
