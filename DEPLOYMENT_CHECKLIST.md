# Deployment Checklist — OwedBook Alpha (run record)

Generated 2026-11-20 by next-deploy-auto v1.3; revised after JARVIS review (round 2).
**Status: Stage A DEPLOYED and verified 2026-11-20 (commit `ef4cebc`). Stage B: domain mapping and certificate live; sign-in NOT yet verified (Supabase allow-list pending). Manual acceptance PENDING.**
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
- [x] Changes committed on the branch (Tony; HEAD `ef4cebc`)
- [ ] Final manual retest (on Next.js 16.4.5) — PENDING
- [x] Deployment approved by Tony (2026-11-20 17:15)

## Pre-flight evidence (2026-11-20, read-only)

- [x] Account and project match config — EVIDENCE
- [x] APIs enabled (cloudbuild, run, artifactregistry, secretmanager, iam) — EVIDENCE
- [x] Artifact Registry `cloud-run-source-deploy` in us-east1 — EVIDENCE
- [x] Build SA `524380376459-compute@developer.gserviceaccount.com` holds `roles/run.admin` — EVIDENCE
- [x] Build SA may act as service accounts in the project (`roles/editor` includes `iam.serviceAccounts.actAs`) — EVIDENCE by role content; re-checked by init on the real runtime SA
- [x] Upload boundary clean (388 files); Docker context clean (384 files); canary test clean — EVIDENCE
- [x] Docker build and container start proven locally — EVIDENCE

## Stage A — Base service (this skill)

- [x] `./init-app.sh` exit 0 (agent, second run; first run stopped on a false act-as alarm, fixed in `ef4cebc`): secret created empty, runtime SA created, accessor binding, act-as check ✅
- [x] `./upload-secrets.sh` run by Tony — reported "Secrets done"
- [x] `cyph-owedbook-alpha-supabase-secret-key` has an ENABLED version (version 1; metadata only)
- [x] IAM: runtime SA holds `secretAccessor` on the secret (build SA: not needed) — EVIDENCE
- [x] `./deploy.sh` exit 0 from a CLEAN tree, no "Setting IAM policy failed" warning — build ID: `5d840fee-51cc-4c9f-ab03-9b9f97c191e4`
- [x] Source revision (full SHA, no `-dirty`): `ef4cebccae68499bee7d4a53b230e31474a17f52`
- [x] Image tag: `ef4cebccae68-20261120t111951z`
- [x] Image digest (read back from the service): `sha256:db2d37b44ce76fde9ed426da2feef5f91bae4eaa18170e9410cdfda8a9408348`
- [x] `allUsers` holds `roles/run.invoker` (read back)
- [x] run.app URL: `https://cyph-v1-owedbook-alpha-hr465ynfuq-ue.a.run.app` — returns 200
- [x] `/api/build-info` on run.app shows the same revision
- Sign-in is NOT expected to work on run.app: the app accepts only its configured origin.

## Stage B — Final-domain authentication (operator-led, outside this skill)

- [x] Cloud Run domain mapping for `cyph-v1-owedbook-alpha.cyberizedev.com` created 2026-11-20 (Tony approved); Google expects CNAME → `ghs.googlehosted.com.`, public DNS matches
- [x] Certificate issued; HTTPS answers (2026-11-20: Google Trust Services, verify ok, expires 2027-02-18; `/` 200; `/api/build-info` shows `ef4cebc`; http redirects to https)
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
