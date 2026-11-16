#!/usr/bin/env bash
# Production build of each app in a disposable copy (never in the repo, never with real credentials), then a scan of
# the emitted client bundle for server-secret names and Stripe/service-role usage.
set -u
ROOT=/home/moose/NEXTJS/CYBER_PHARMA; W=$ROOT/ARCHIVE/APBM007A_E2_WORK/r01
for app in ob:cyph-v1-dev pp:cyph-payment-portal-dev-v1; do
  k=${app%%:*}; repo=${app##*:}; dst=$W/build/$k
  rm -rf "$dst"; mkdir -p "$dst"
  rsync -a --exclude node_modules --exclude .next --exclude .git --exclude agent_docs --exclude '.env*' --exclude test-results --exclude playwright-report "$ROOT/$repo/" "$dst/"
  cp -al "$ROOT/$repo/node_modules" "$dst/node_modules"   # hard links: Turbopack refuses a symlink that leaves the project root
  ( cd "$dst" && env -i PATH="$PATH" HOME="$HOME" NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 \
      NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_placeholder \
      NEXT_PUBLIC_SITE_URL=$([ $k = ob ] && echo http://localhost:3000 || echo http://localhost:3001) NEXT_PUBLIC_APP_ENV=local NEXT_PUBLIC_APBM_DATA_MODE=real \
      SUPABASE_SECRET_KEY=SERVERKEY_CANARY_7f3a9 STRIPE_SECRET_KEY=sk_test_CANARY7f3a9 STRIPE_WEBHOOK_SECRET=whsec_CANARY7f3a9 \
      ./node_modules/.bin/next build > "$W/out/build_$k.log" 2>&1 ); rc=$?
  echo "$k build exit $rc: $(grep -E 'Compiled successfully|Failed to compile|error' "$W/out/build_$k.log" | head -2 | tr '\n' ' ')"
  [ $rc -ne 0 ] && { tail -25 "$W/out/build_$k.log"; continue; }
  client="$dst/.next/static"
  echo "  client files: $(find "$client" -type f | wc -l)"
  for pat in 'SERVERKEY_CANARY' 'sk_test_CANARY' 'whsec_CANARY' 'SUPABASE_SECRET_KEY' 'STRIPE_SECRET_KEY' 'STRIPE_WEBHOOK_SECRET' 'handoff_issue' 'handoff_claim' 'provision_paid_registration' 'generateLink' 'createAdminClient' 'api.stripe.com'; do
    n=$(grep -rl -- "$pat" "$client" 2>/dev/null | wc -l); echo "  client bundle contains '$pat': $n file(s)"
  done
  grep -E "^(┌|├|└) (○|ƒ|●)" "$W/out/build_$k.log" | sed 's/  */ /g' | cut -c1-60 > "$W/out/routes_$k.txt"; echo "  routes: $(wc -l < "$W/out/routes_$k.txt")"
done
