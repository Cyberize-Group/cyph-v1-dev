# OwedBook alpha — preparation round 2 (JARVIS review items 1–10) — nothing deployed

**Date:** 2026-11-20 15:53 (+06) · **Branch:** `deploy/owedbook-alpha-prep` (from `main` `0b12191`), all changes uncommitted
**Not done:** init, secret upload, deploy, any cloud mutation, Supabase settings, migrations, commit, push. Payment Portal repo untouched. Final manual retest PENDING.
**Previous report:** `response_2026-11-20_152916_owedbook-alpha-deploy-prep.md`.

## 1. Result per review item

| # | Item | Result |
|---|---|---|
| 1 | Alpha origins | DONE. `src/lib/appIdentity.ts` staging row → `https://cyph-v1-owedbook-alpha.cyberizedev.com` / `https://cyph-v1-payment-alpha.cyberizedev.com`. One line. Local, local-proof, return paths and guards untouched. New `src/__tests__/alpha-origins.test.ts` (4 tests). |
| 2 | Advisories | DONE for Next.js. `next` and `eslint-config-next` 16.3.7 → 16.4.5; lockfile-only updates of `source-map-js` 1.2.4 and `handlebars` 4.7.10. `zod` needs a breaking major: NOT done, reported (§3). |
| 3 | Bind address and port | DONE. `ENV HOSTNAME=0.0.0.0` in the runner; `--port 3000` on the deploy step. Proven in a local container (listens on `0.0.0.0:3000`). |
| 4 | Ignore files | DONE. Nested and case-insensitive env/credential patterns in `.dockerignore` and `.gcloudignore`. Canary test found and closed one gap (§4). |
| 5 | Image identity | DONE. Unique tag per build, digest resolved after push, Cloud Run deploys the digest, `deploy.sh` reads it back. Dirty source aborts unless `ALLOW_DIRTY=1`, and is then labelled `-dirty`. |
| 6 | Act-as | VERIFIED, no binding needed (§5). Report-only check added to `init-app.sh`. |
| 7 | Mail policy | DONE. `MAIL_RECIPIENT_POLICY=open` in `stark-deploy.yaml` and in `--set-env-vars`. DEV-only enforcement in `src/server/mailGuard.ts` untouched. `ALLOW_SYNTHETIC_SUBSCRIPTIONS` unset (§6). |
| 8 | Secret | UNCHANGED and confirmed: runtime-only via `--set-secrets`; not a build arg; not in the image (image env names and file scan clean). Value never read. |
| 9 | Comments and checklist | DONE. Stale `main` wording removed from `stark-deploy.yaml`; checklist rewritten in three readiness stages. |
| 10 | Validation | DONE (§7). |

## 2. Source and dependency diff summary

- `src/lib/appIdentity.ts`: 1 line changed (the staging origin pair).
- `src/__tests__/alpha-origins.test.ts`: new. Alpha pair resolves under `staging`; site-URL guard accepts only the exact alpha origin (rejects the peer, the old host, http, a look-alike suffix, localhost, empty); local and local-proof rows unchanged; an unknown label never selects the deployed row; return-path allowlists identical and exact.
- `package.json`: 2 lines (`next`, `eslint-config-next` → `16.4.5`, exact pins as before).
- `package-lock.json`: 76 insertions, 66 deletions (Next 16.4.5 and its platform packages, `eslint-config-next`, `source-map-js`, `handlebars`).
- No other source file changed. No migration. `next.config.js` untouched.

**Portal mirror — recorded for later, NOT edited:** the Payment Portal's copy of the address table (`src/lib/appIdentity.ts`, staging row) must carry the same pair, with its own tests updated, before two-app integration. Until then the two tables disagree for the deployed environment.

## 3. Advisory verification (GitHub Advisory Database, queried 2026-11-20)

- **`next` 16.3.7:** 16 advisories, 2 critical (GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr), 2 high. First patched versions: 16.3.8 for six of them, 16.4.1 for the critical/high group, **16.4.5** for the last six (≤ 16.4.4 affected). No 16.3.x release fixes all of them.
- **`next` 16.4.5:** 0 advisories. **16.4.6:** 0 advisories. 16.4.5 is the lowest unaffected version, so it is the minimal change; the earlier proposal is confirmed by evidence, not adopted on trust. It is a minor-line move (16.3 → 16.4); typecheck, tests and build pass on it.
- **`source-map-js` 1.2.1 → 1.2.4** (GHSA-68fv-2mgg-jv7q, high) and **`handlebars` 4.7.9 → 4.7.10** (two critical, dev-only via ts-jest): lockfile-only, within existing ranges.
- **`zod` 3.23.8 — BREAKING, not applied.** GHSA-mrhx-c7xc-m3w5 (high) affects every version below 4.6.6; there is no 3.x fix (3.25.76 is still affected). The only fix is zod 4, a major upgrade that also touches `@hookform/resolvers`. Exposure here: zod is imported only by three client form components (`LoginForm`, `InviteMemberForm`, `SettingsForm`); no server code validates request data with it, so a remote user cannot use it against the server. Recommendation: accept for alpha, schedule the zod 4 migration as its own change. **Decision needed.**
- **`postcss-selector-parser` 6.0.10 (moderate) — not applied.** `@tailwindcss/typography` pins that exact version and every typography release ≥ 0.5.5 is affected; the "fix" npm offers is a downgrade to 0.5.4. It runs only at build time on our own CSS and is not in the runtime image. Forcing it with an override risks prose styling. Left as is.
- **Dev-only moderates (jest 30 chain: `glob`, `minimatch`; typescript-eslint):** npm's fix is a downgrade to jest 29 (breaking). Not applied; not in the image.
- After remediation: `npm audit --omit=dev` = 3 (1 high zod, 2 moderate typography chain); full audit 19 (0 critical, 1 high, 18 moderate). Before: 22 (2 critical, 2 high).

## 4. Ignore files — validation

- **Canary test:** a scratch folder with planted files at several depths (`.env`, `.env.local`, `.envrc`, nested `.env.*`, `.pem`, `.p12`, `.key`, service-account and credentials JSON, `.auth/`), checked against both ignore files with a real `docker build` context listing and `gcloud meta list-files-for-upload`.
- **Finding:** `sub/serviceAccount.json` (capital A) reached BOTH the Docker context and the upload list: the baseline patterns are case-sensitive. Fixed with case-insensitive patterns in both files. Re-test, including `ServiceAccount.JSON`, `GCP-Credentials.json`, `Server.PEM`, `CERT.P12`, `TLS.KEY`: none get through either boundary.
- **Real repo:** upload list 388 files, no env or credential name; Docker context 384 files, no env or credential name, no `agent_docs/`, `e2e/`, `node_modules/` or `.git/`; required build inputs present in both. File names only were inspected; no `.env*` content was read.
- `RECOVERY.md`, `CHANGELOG.md`, `DEPLOYMENT_CHECKLIST.md` are now excluded from the upload (factory records, not build inputs).

## 5. Cloud Build identity and act-as (read-only)

- Build identity (resolved): `524380376459-compute@developer.gserviceaccount.com`.
- It holds `roles/editor` on the project. `gcloud iam roles describe roles/editor` lists `iam.serviceAccounts.actAs` (EVIDENCE). The grant is project-wide, so it covers `sa-cyph-owedbook-alpha-runtime` once that account exists. `roles/run.admin` does not include the permission by itself.
- No deny policy is attached to the project.
- **No missing permission; no binding proposed.** INFERENCE (not a live test): the runtime SA does not exist yet, so the check is by role content. `init-app.sh` now re-checks after creating the SA and stops with the narrowest fix command if it fails.
- Observation only: `roles/editor` on the default compute account is broad. Not changed; out of scope.

## 6. `ALLOW_SYNTHETIC_SUBSCRIPTIONS`

Unset. Effect (`src/server/accessState.ts`): a store whose subscription origin is `synthetic_seed` is reported as having no subscription. Stores registered through the Payment Portal with a Stripe test subscription are not affected. So the flag is needed only if alpha testers are meant to use seeded fixture stores. **GAP:** DEV data was not queried, so whether the intended alpha stores are seeded or Portal-registered is not established. Tony or JARVIS to confirm which stores testers will use.

## 7. Validation results

| Check | Result |
|---|---|
| Typecheck (`tsc --noEmit`) | clean |
| Jest | 374/374, 54 suites (370 before + 4 new) |
| Lint | 0 errors, 38 warnings (baseline not compared) |
| `bash -n` on the three scripts | OK |
| Template braces, YAML parse, substitutions defined = used = passed | clean |
| `deploy.sh` pre-submit section, dry run (nothing submitted) | aborts on the current uncommitted tree and lists the paths; with `ALLOW_DIRTY=1` yields revision `0b12191…-dirty`, tag `0b12191f77b8-dirty-<UTC time>` |
| Local `docker build` of the real Dockerfile (isolated; no local server was running; repo `.next` untouched) | exit 0; Next.js 16.4.5; 17 static pages generated |
| Image | 87 MB; user `nextjs`; env names: PATH, NODE_VERSION, YARN_VERSION, NODE_ENV, NEXT_TELEMETRY_DISABLED, PORT, HOSTNAME; no `.env*` or credential file in `/app` |
| Local container, no secret supplied | listens on `0.0.0.0:3000`; `/` 200; `/owedbook` and `/admin-portal` 307 → `/auth`; `/api/build-info` returns `{"app":"ob","revision":"0b12191…-dirty","artifactId":"owedbook-alpha-local-validation"}` |

The test containers and the local image were removed afterwards. **Not validated:** the Cloud Build steps themselves (digest resolution, `gcloud run deploy` flags) run only in the cloud; they are syntax-checked, not executed. Sign-in was not exercised.

**Observation (existing app behaviour, not changed):** started with no environment at all, the container logs the "Missing required environment variables" error but the process keeps running. On Cloud Run a revision with a missing public variable would therefore start and serve errors rather than fail its startup. The generated config always sets all three required values.

## 8. Remaining blockers and decisions

1. **zod 4 migration** — accept for alpha or do it first (§3).
2. **Seeded vs Portal-registered alpha stores** — decides `ALLOW_SYNTHETIC_SUBSCRIPTIONS` (§6).
3. **Supabase Auth (DEV project):** Site URL and redirect allow-list must admit the alpha origin. Not checked, not changed.
4. **Domain mapping and certificate** for `cyph-v1-owedbook-alpha.cyberizedev.com`: not created.
5. **Portal:** mirrored origin table, and the Portal alpha deployment, before any cross-app handoff works.
6. **Commit** on this branch before deployment (deploy aborts on a dirty tree by design). Suggested as two commits so they stay separately reviewable: (a) origins + Next.js remediation, (b) deployment files and records.
7. **Final manual retest** — still pending, now on Next.js 16.4.5.
8. **Deployment approval** — then init (agent) → `upload-secrets.sh` (Tony) → deploy.

## 9. Readiness stages

- **A. Base service:** image builds, service deploys by digest, run.app answers 200, `/api/build-info` shows the clean commit. Sign-in is NOT expected to work on run.app (the app accepts only its configured origin).
- **B. Final-domain authentication:** domain mapping + certificate + Supabase allow-list; sign-in, email links and staff actions on the alpha domain.
- **C. Two-app integration:** Portal alpha deployed with the mirrored origins; handoff in both directions; billing paths.
