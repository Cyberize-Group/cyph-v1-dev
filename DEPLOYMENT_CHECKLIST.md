# Deployment Checklist — OwedBook Alpha (run record)

Generated 2026-11-20 by next-deploy-auto v1.3; revised after JARVIS review (round 2).
**Status: PREPARED on branch `deploy/owedbook-alpha-prep` — nothing run in the cloud.**
Evidence: `agent_docs/RESPONSES/response_2026-11-20_155313_owedbook-alpha-prep-round2.md` (round 1: `…152916_owedbook-alpha-deploy-prep.md`).

## Config Summary

| Item | Value |
|---|---|
| App name (resource prefix) | `cyph-owedbook-alpha` (approved) |
| Service | `cyph-v1-owedbook-alpha` (approved) |
| Project / region | `cyberize-nextjs-staging` / `us-east1` |
| Account | `moose@cyberizegroup.com` |
| Access | public |
| Container | listens on `0.0.0.0:3000`; Cloud Run `--port 3000` |
| Final URL | `https://cyph-v1-owedbook-alpha.cyberizedev.com` |
| Peer (future) | `https://cyph-v1-payment-alpha.cyberizedev.com` |
| Runtime SA | `sa-cyph-owedbook-alpha-runtime@cyberize-nextjs-staging.iam.gserviceaccount.com` |
| Secret (runtime only) | `SUPABASE_SECRET_KEY` → `cyph-owedbook-alpha-supabase-secret-key` |
| Public vars | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| Runtime settings | `MAIL_RECIPIENT_POLICY=open` (honoured on the DEV project only); `MAIL_ALLOWLIST` and `ALLOW_SYNTHETIC_SUBSCRIPTIONS` not set |
| Image | unique tag per build; deployed by digest |
| Sizing | 1Gi, max 1, min 0 |
| Framework | Next.js 16.4.5 |

## Before deployment approval

- [x] Deployment-preparation branch created (Tony, 2026-11-20)
- [x] JARVIS review round 1; items 1–10 implemented
- [x] Alpha origins in `src/lib/appIdentity.ts` + tests
- [x] Next.js advisories resolved (16.4.5, verified 0 advisories)
- [x] Mail policy decided (`open`)
- [x] Local Docker build and container smoke test
- [x] JARVIS review round 2
- [x] Decision (Director, 2026-11-20): zod 4 migration DEFERRED for alpha. The advisory GHSA-mrhx-c7xc-m3w5 stays OPEN (`agent_docs/KIP_REGISTRY.md` KIP-3); required before production
- [x] Decision (Director, 2026-11-20): `ALLOW_SYNTHETIC_SUBSCRIPTIONS` stays unset; testers use Portal-purchased test stores
- [ ] Changes committed on the branch (deploy aborts on a dirty tree)
- [ ] Final manual retest (on Next.js 16.4.5) — PENDING
- [ ] Deployment approved by Tony

## Pre-flight evidence (2026-11-20, read-only)

- [x] Account and project match config — EVIDENCE
- [x] APIs enabled (cloudbuild, run, artifactregistry, secretmanager, iam) — EVIDENCE
- [x] Artifact Registry `cloud-run-source-deploy` in us-east1 — EVIDENCE
- [x] Build SA `524380376459-compute@developer.gserviceaccount.com` holds `roles/run.admin` — EVIDENCE
- [x] Build SA may act as service accounts in the project (`roles/editor` includes `iam.serviceAccounts.actAs`) — EVIDENCE by role content; re-checked by init on the real runtime SA
- [x] Upload boundary clean (388 files); Docker context clean (384 files); canary test clean — EVIDENCE
- [x] Docker build and container start proven locally — EVIDENCE

## Stage A — Base service (this skill)

- [ ] `./init-app.sh` exit 0 (agent): secret created empty, runtime SA created, accessor binding, act-as check ✅
- [ ] `./upload-secrets.sh` run by Tony — exit code:
- [ ] `cyph-owedbook-alpha-supabase-secret-key` has an ENABLED version (metadata only)
- [ ] IAM: runtime SA holds `secretAccessor` on the secret (build SA: not needed)
- [ ] `./deploy.sh` exit 0 from a CLEAN tree, no "Setting IAM policy failed" warning — build ID:
- [ ] Source revision (full SHA, no `-dirty`):
- [ ] Image tag:
- [ ] Image digest (`sha256:…`, read back from the service):
- [ ] `allUsers` holds `roles/run.invoker` (read back)
- [ ] run.app URL: — returns 200
- [ ] `/api/build-info` on run.app shows the same revision
- Sign-in is NOT expected to work on run.app: the app accepts only its configured origin.

## Stage B — Final-domain authentication (operator-led, outside this skill)

- [ ] Cloud Run domain mapping for `cyph-v1-owedbook-alpha.cyberizedev.com` (CNAME to `ghs.googlehosted.com` exists)
- [ ] Certificate issued; HTTPS answers
- [ ] Supabase Auth (DEV project): Site URL / redirect allow-list admits the alpha origin
- [ ] Sign-in, email links and staff actions work on the alpha domain
- [ ] Invitation mail reaches a test recipient

## Stage C — Two-app integration (later)

- [ ] Payment Portal: mirrored origin table updated to the same alpha pair (Portal repo; not done here)
- [ ] Payment Portal alpha deployed at `https://cyph-v1-payment-alpha.cyberizedev.com`
- [ ] Handoff OwedBook → Portal and Portal → OwedBook
- [ ] Billing and add-store paths
- [ ] App certification on the final URLs (a successful deploy is not Gate D)

## Day two

Code change → commit → `./deploy.sh`. New env var or secret → edit `stark-deploy.yaml` → run the skill again → upload any new secret value with the helper.
