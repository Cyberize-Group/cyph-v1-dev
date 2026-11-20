# Walkthrough runtime inspection — OwedBook :3000 / Portal :3001 (read-only)

Running now: OwedBook `next start` (Next 16.3.7, cwd OwedBook) · Portal `next start --port 3001` (Next 16.4.3) · `stripe listen` forwarding to :3001. Both `/api/build-info` answer (`ob`, `pp`) but report `revision: unrecorded`, `artifactId: unlabelled-build` (built without `build-check.mjs` labels).

## 1. Standalone startup

`next start` with `output: standalone` is what the project's own `proof-serve.mjs` uses; it works. True standalone (stop the current `next start` first; ports are taken):

```bash
# OwedBook
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
cd .next/standalone && PORT=3000 HOSTNAME=127.0.0.1 node --env-file=../../.env.local server.js

# Portal
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
cd .next/standalone && PORT=3001 HOSTNAME=127.0.0.1 node --env-file=../../.env.local server.js
```

Standalone `server.js` does not load `.env.local` itself (hence `--env-file`, Node 22.17). `NEXT_PUBLIC_*` are compiled in at build.

## 2. Redirects / handoff

Match. Both apps: `NEXT_PUBLIC_APP_ENV=local` → frozen table `ob http://localhost:3000`, `pp http://localhost:3001`; `NEXT_PUBLIC_SITE_URL` equals each app's own origin (`siteOriginMatches` passes). Builds contain no local-proof (3100/3101) or SCRATCH refs. Not checkable read-only: Supabase Auth Redirect URL allowlist (provider setting).

## 3. Targets

Both apps DEV `yrsuwikjnbmvpznrgydb` (env and compiled bundles; SCRATCH ref absent). Portal Stripe keys `sk_test_` / `pk_test_` (sandbox); Stripe CLI account = `STRIPE_EXPECTED_ACCOUNT`.

## 4. Stripe listener

Implementation (`src/app/api/webhooks/stripe/route.ts:2`): `stripe listen --forward-to localhost:3001/api/webhooks/stripe`. The running listener adds `--events` with exactly the 7 events the handler processes. Secret match: NOT VERIFIED — needs `stripe listen --print-secret` (Stripe API call, not run). Portal has one `STRIPE_WEBHOOK_SECRET` (whsec_, no duplicates).

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
[ "$(stripe listen --print-secret)" = "$(sed -n 's/^STRIPE_WEBHOOK_SECRET=//p' .env.local | tr -d "\"'")" ] && echo MATCH || echo MISMATCH
```

MISMATCH → put the printed value in Portal `.env.local`, restart the Portal.

## 5. Scheduler

Needed for Add Store expiry/abandon (consent deadline), stalled lifecycle, removal/transfer finalize, transfer hold expiry, due billing notices. Not running now.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
node scripts/apbm007b/jobs-run.mjs --base http://localhost:3001 --every 60
```

Notices step sends mail through Resend (bounded by `MAIL_ALLOWLIST`). Not needed for walkthroughs that do not cover expiry, removal, transfer or notices.
