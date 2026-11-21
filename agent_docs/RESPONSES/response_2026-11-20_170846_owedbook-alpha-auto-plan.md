# OwedBook alpha — deployment plan and approval summary (awaiting Tony's approval)

**Date:** 2026-11-20 17:08 (+06) · **Status:** PENDING APPROVAL — nothing initialized, uploaded or deployed.

## Source state (EVIDENCE, 2026-11-20 17:08)

- Branch `deploy/owedbook-alpha-prep`, HEAD `0e2b4441d3949e240ba1d6f9a9f9dac5f03100ff`, working tree clean. Local only: no upstream, not pushed.
- Four commits above `main` `0b12191`: `0a48814` origins (2 files) · `0aef527` dependencies (2 files) · `15f586d` deployment files (9 files) · `0e2b444` records (8 files). Contents match the reviewed sets. Scripts are executable in git (100755).
- `deploy.sh` pre-submit section, dry run without submitting: upload boundary clean (388 files); source identified as clean; revision `0e2b4441…` with no `-dirty`; tag form `0e2b4441d394-<UTC time>`.

## Cloud state (EVIDENCE, read-only)

- Account `moose@cyberizegroup.com`; project `cyberize-nextjs-staging`.
- Service `cyph-v1-owedbook-alpha`, secret `cyph-owedbook-alpha-supabase-secret-key`, runtime SA `sa-cyph-owedbook-alpha-runtime`: all still absent. Nothing to reuse; no mismatch.
- Build identity `524380376459-compute@developer.gserviceaccount.com`: `roles/run.admin` and `roles/editor` (act-as included).

## What approval covers (Stage A — base service only)

1. Agent runs `./init-app.sh`: verifies project infrastructure; creates the empty secret, the runtime SA, one `secretAccessor` binding for the runtime SA; act-as check. No other IAM change.
2. Tony runs `./upload-secrets.sh` (reads `SUPABASE_SECRET_KEY` from `.env.local`; the agent never sees it). Agent then checks version metadata only.
3. Agent runs `./deploy.sh`: Cloud Build builds the image from commit `0e2b444`, pushes it under a unique tag, deploys it by digest to a NEW public Cloud Run service (1Gi, 0–1 instances, port 3000), with `allUsers` as invoker.
4. Agent reads back the invoker policy, the digest, the run.app status code and `/api/build-info`.

## Not covered

Domain mapping and certificate · Supabase Auth settings · Payment Portal · migrations · push or merge · any existing service.

## Known at approval time

- Final manual retest is PENDING; it has not been run on Next.js 16.4.5.
- The run.app URL will load but sign-in will not work there (origin guard). Sign-in needs the domain mapping and the Supabase allow-list.
- zod advisory GHSA-mrhx-c7xc-m3w5 is OPEN (KIP-3), accepted for alpha.
- The Cloud Build steps (digest resolution, deploy flags) have been syntax-checked and the image built locally, but they run for the first time in this deployment.
- The service is public from the moment it deploys.
