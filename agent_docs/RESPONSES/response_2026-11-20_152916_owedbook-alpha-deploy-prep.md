# OwedBook alpha — deployment PREPARATION report (nothing deployed)

**Date:** 2026-11-20 15:29 (+06) · **Skill:** `agent_docs/SKILLS/nextjs-cloud-deploy-agent-skill` v1.3 · **Status:** PREPARED, STOPPED before init
**Not done:** init, secret upload, deploy, any cloud mutation, migrations, source edits, commit, push. Payment Portal repo and existing services untouched. Final manual retest still PENDING.

## 1. Baseline (EVIDENCE)

- Repo `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`, `main` = `origin/main` = `0b12191f77b8a78f6f7f5074865012ed8c0b0967`, tree clean at start.
- gcloud 554.0.0; active account `moose@cyberizegroup.com` (roles/owner on the project); project `cyberize-nextjs-staging` (number 524380376459, ACTIVE).
- APIs enabled: cloudbuild, run, artifactregistry, secretmanager, iam. Artifact Registry `cloud-run-source-deploy` exists in us-east1.
- Build identity (Actor B), resolved by `gcloud builds get-default-service-account`: `524380376459-compute@developer.gserviceaccount.com`; holds `roles/run.admin` (Staging Rule satisfied) and `roles/editor`.
- Service `cyph-v1-owedbook-alpha`: does not exist. Runtime SA `sa-cyph-owedbook-alpha-runtime`: does not exist. Secret `cyph-owedbook-alpha-supabase-secret-key`: does not exist.
- Domain mappings in us-east1: five, none for `cyph-v1-owedbook-alpha.cyberizedev.com`. The mapping and certificate still have to be created (operator-led; outside the skill).
- Existing services (not touched): cyber-cms-poc-1, cyber-factory-poc-1, cyber-pharma-prod, cyph-mission-ctrl-prod, cyph-sub-portal-prod.

## 2. Files generated (all uncommitted)

| File | State | Notes |
|---|---|---|
| `stark-deploy.yaml` | new | Config. All required fields filled; one optional decision block (`runtime_env`). |
| `Dockerfile` | new | Template 1. No build-time secrets. Five public ARGs plus the build-identity extension. |
| `cloudbuild.yaml` | new | Template 2B. `--allow-unauthenticated`; `--set-secrets` for the Supabase secret key; public vars on `--set-env-vars`. |
| `deploy.sh` | new | Template 3. Placeholder guard and upload-boundary guard. |
| `init-app.sh` | new | Template 4. Verifies project infrastructure; creates one empty secret, the runtime SA and one binding. |
| `upload-secrets.sh` | new | Template 6, three baked values. Operator-run only. |
| `.gcloudignore` | new | UPLOAD_BOUNDARY baseline plus `e2e/`. |
| `.dockerignore` | modified | Nine lines appended; existing rules unchanged. |
| `DEPLOYMENT_CHECKLIST.md` | new | Run record, unticked. |
| `agent_docs/SKILL_ISSUES_LEDGER_next_deploy_auto.md` | new | Four rows. |

Checks: `bash -n` OK for the three scripts; no unfilled template braces; both YAML files parse; every Cloud Build substitution is defined, used and passed by `deploy.sh`; no placeholder hit in any public value. Upload list: 389 files (was 3,348 with no `.gcloudignore`), no `.env*` or credential file; before the file existed, `.env.example` and `.env.pilot.example` would have been uploaded. Required build inputs are in the list.
**GAP:** no Docker build was run, locally or in the cloud. The Dockerfile is unproven for this app until the first build.

## 3. Configuration decisions

- **App name `cyph-owedbook-alpha` (proposal).** The service name is 22 characters; the schema limit is 19 because the runtime SA ID is capped at 30. The app name prefixes only the secret and the runtime SA. The service is `cyph-v1-owedbook-alpha` as confirmed.
- **Access: public** (Director's answer). OwedBook's sign-in still applies.
- **Public values (Director's answers):** Supabase URL = DEV project `yrsuwikjnbmvpznrgydb`; publishable key supplied. `NEXT_PUBLIC_SITE_URL` = the alpha origin. `NEXT_PUBLIC_APP_ENV=staging`: the only non-local label the code and migration 0059 accept.
- **Dynamic env access: yes.** `src/instrumentation.ts` reads `process.env[key]` at start, so public vars also ride `--set-env-vars`.
- **Not set:** `NEXT_PUBLIC_SUPPORT_EMAIL` (code default), `NEXT_PUBLIC_APBM_DATA_MODE` (unset = live data).
- **Extension, for JARVIS review:** `APBM_BUILD_REVISION` and `APBM_BUILD_ARTIFACT_ID` are passed as build args so `/api/build-info` reports the deployed revision. A build from uncommitted files is labelled `-dirty`.

## 4. Secret and runtime binding

| Env var | Secret Manager name | Scope | Reader | Accessor |
|---|---|---|---|---|
| `SUPABASE_SECRET_KEY` | `cyph-owedbook-alpha-supabase-secret-key` | runtime | `src/utils/supabase/admin.ts` via `src/server/db.ts` | Actor C `sa-cyph-owedbook-alpha-runtime` |

Wired in: `cloudbuild.yaml` (`--set-secrets …:latest`), `init-app.sh` (empty secret + `secretAccessor` for the runtime SA), `upload-secrets.sh` (mapping). No value was read, requested or printed. No existing version exists to reuse, so the value arrives through the operator-run helper after init; the agent then checks version metadata only.

## 5. Proposed cloud resources (created only after deployment approval)

| Resource | Name | Created by |
|---|---|---|
| Secret (empty) | `cyph-owedbook-alpha-supabase-secret-key` | `init-app.sh` |
| Runtime service account | `sa-cyph-owedbook-alpha-runtime@cyberize-nextjs-staging.iam.gserviceaccount.com` | `init-app.sh` |
| IAM binding | `roles/secretmanager.secretAccessor` on that secret for the runtime SA | `init-app.sh` |
| Secret version | one version of the secret | Tony, `upload-secrets.sh` |
| Image | `us-east1-docker.pkg.dev/cyberize-nextjs-staging/cloud-run-source-deploy/cyph-v1-owedbook-alpha:latest` | `deploy.sh` |
| Cloud Run service | `cyph-v1-owedbook-alpha`, us-east1, 1Gi, 0–1 instances, public | `deploy.sh` |
| IAM binding | `allUsers` → `roles/run.invoker` on the service | `deploy.sh` |
| Domain mapping + certificate | `cyph-v1-owedbook-alpha.cyberizedev.com` | operator-led, outside the skill |

Reused, unchanged: project APIs, Artifact Registry repo, build SA and its roles.

## 6. Required source changes and blockers

1. **Alpha origins (required before the alpha is usable).** `src/lib/appIdentity.ts` line 14, the `staging` row, holds `https://owedbook.cyberizedev.com` and `https://owedbook-payment.cyberizedev.com`. It must become `https://cyph-v1-owedbook-alpha.cyberizedev.com` and `https://cyph-v1-payment-alpha.cyberizedev.com`. Without it `siteOriginMatches()` is false and handoff, email links and staff actions fail closed. The `local` and `local-proof` rows stay as they are, so localhost behaviour is unchanged. No other file in this repo names those hosts. The Portal holds a mirrored copy that must change identically (agreement test); that repo was not touched. The deploy skill may not edit source, so this is a separate approved change.
2. **Dependency-security blocker.** `next` 16.3.7 is affected by critical advisories (among them GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr, GHSA-p3m5-59mp-jv5r). Proposed resolution on record (13:03 report): upgrade `next` and `eslint-config-next` to 16.4.5 in both apps, pending Director approval. Today's `npm audit --omit=dev` offers 16.4.6 as its fix version; recheck 16.4.5 against the registry at upgrade time. Also reported: `zod` < 4.6.6 (high; the fix is a breaking major), `source-map-js` (high; `npm audit fix`), `postcss-selector-parser` (moderate). A public service should not go live on 16.3.7.
3. **Mail and fixture flags (decision).** `MAIL_RECIPIENT_POLICY`, `MAIL_ALLOWLIST`, `ALLOW_SYNTHETIC_SUBSCRIPTIONS` are unset. With that, the app sends no invitation mail. Fill `runtime_env` in `stark-deploy.yaml` if alpha testers need mail.
4. **Supabase Auth settings (GAP, not checked).** The DEV project's Site URL and redirect allow-list must admit the alpha origin; this lives in the Supabase dashboard.
5. **Peer app.** The Payment Portal alpha is not deployed; cross-app handoff cannot work until it is.
6. **The run.app URL will load but cannot sign in**, because the app accepts only its configured origin. Full function needs the domain mapping and certificate.

## 7. Skill notes

- The skill's plan-before-generation stop was waived by the Director's explicit authorization of local generation. Deployment approval is still required before `init-app.sh`.
- Git: no git command that changes anything was run. The files sit uncommitted on `main`; Tony creates the branch.
