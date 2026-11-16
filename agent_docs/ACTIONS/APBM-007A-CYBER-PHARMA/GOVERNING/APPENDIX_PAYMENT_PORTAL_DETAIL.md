# RECON FINDINGS — cyph-payment-portal-dev-v1 (Payment Portal FFM dev copy), pre-APBM007

Repo: `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` · branch `main` · HEAD `c89572a45210e7d6f098c2878cfabe9a1c5326f1` · recon date 2026-11-10
Mode: READ-ONLY. No build, install, test, deploy, network or Git mutation was run. `.env.local` / `.env.qa.local` were never opened. Paths are relative to the repo root unless absolute. "Module" = `agent_docs/ACTIONS/cyph_subscription_portal_phase1_ffm_abm/`.
Labels: **OBSERVED** (file:line or command) · **DOCUMENTED CLAIM** (a doc says so; not re-verified) · **INFERENCE** · **UNKNOWN**. Source inspection is not live proof. Recorded test results are inherited evidence, not a fresh run.

Method: recon skill `agent_docs/SKILLS/stark-recon-skill-v1.1/stark-recon/SKILL.md` — version **1.1 (2026-06-09)** per its Version History table. Followed in spirit (doc-vs-disk, labelled findings, surprises). Skipped: build route table (S0.7), `npm audit`, any live walk. Skill labels EVIDENCE/CLAIM/GAP map to OBSERVED/DOCUMENTED CLAIM/UNKNOWN here.

Protected paths / standing rules named by repo instructions (recorded for planners, not exercised):
- Root `CLAUDE.md` (v3.1): Plan Mode before any change; session file + `agent_docs/RESPONSES/` logging; `RECOVERY.md` upkeep; scope discipline. Director-only Git (`agent_docs/PROJECT_POINTER.md:14`).
- `RECOVERY.md:10`: "Never touch: servers on :3000 and :3457; Cody's /tmp/cody-r6-*; .env*.local. No Git by me."
- `supabase/README.md:5`: "Execute nothing from here without an explicit, separate approval."
- `agent_docs/PROJECT_POINTER.md:12`: engineering and QA roles "do not share write authority". Module `STATE.md:10`: "No product work is authorized. New implementation changes return for impact adjudication."
- Received design bytes (module `_design/`, `_extraction/`), `FILE_INDEX.json` and EVIDENCE zips are declared preserved history.

---

## 1. Relationship of this baseline to the FFM (Git evidence)

- **OBSERVED** `git log`: two commits only.
  - `2eb8585` · author "The Moose" · 2026-11-10 14:53:31 +0600 · "Initial commit" · 1 file (`README.md`, +2).
  - `c89572a` · author "Ahmed Rahat Musawir" · 2026-11-10 15:08:03 +0600 · "10nov2026 - cyph payment portal ffm" · **2228 files, +332,331 lines**. One bulk import of the whole FFM tree (product + all agent_docs).
- **OBSERVED** No Git ancestry to the FFM repo. `git cat-file -t` fails for every commit the docs cite: `f272617`, `abbbcc8`, `d6fe678`, `1d15918`, `94251be`, `b1fbdda`. It is a file copy, not a clone with history.
- **OBSERVED** remote: `origin https://github.com/ahmedmusawir/cyph-payment-portal-dev-v1.git` (no embedded credentials).
- **DOCUMENTED CLAIM** source identity: `package.json:2` name `cyph-stripe-subscription-portal-v1`; `RECOVERY.md:1` and `.env.example:1` the same. The Gate-Q-passed snapshot is bound to commit `f27261734fd0a3ac96253aa6c55e3b9e911125a8` and merged to source-repo `main` at `b26b4dbc…` (`RECOVERY.md:4-7`, module `STATE.md:3-8`, `agent_docs/RESPONSES/response_2026-10-30_113221_main-merge-check-ffm-abm-001.md`). The deployment was built from source `main @ abbbcc8` + uncommitted deploy files (`DEPLOYMENT_CHECKLIST.md:20`).
- **UNKNOWN** No doc states which source commit/tag this dev copy was taken from. **INFERENCE**: the source working tree at or after the 2026-11-03 deploy (deploy files dated 3 Nov are tracked here; the deploy docs say they were uncommitted in the source then). Byte-equality of `src/` with `f272617` cannot be proven from this repo's Git; the available means are the retained helper `…/QAM/AUTOMATION/repair006/verify-commit-inputs.py` and the 168-input manifest hash `f7181d3c…e9ab` (module `STATE.md:5`) — not run.
- **OBSERVED** `CHANGELOG.md` newest entry is 2026-10-30 05:23 UTC (commit binding). Nothing for the 3 Nov deploy files or for this copy.
- **OBSERVED** tracked: 2,229 files. `agent_docs/ACTIONS` 1,896 · `src/components` 58 · `agent_docs/SKILLS` 53 · `agent_docs/RESPONSES` 52 · `src/app` 31 · `e2e` 20 · `agent_docs/.claude` 18 · `agent_docs/SESSIONS` 16 · `src/__tests__` 14 · `src/services` 14 · root config/deploy files · `supabase/` 3 · `public/` 4 · `scripts/install-gcloud.sh`.
- **OBSERVED** dirty: only ` M package-lock.json` (§2). No untracked non-ignored files.
- **OBSERVED** ignored and present (names only): `.env.local`, `.env.qa.local`, `.next/` (a build dated 2026-11-10 15:25), `node_modules/`, `test-results/` (holds `transition-matrix.json`), `tsconfig.tsbuildinfo`, `next-env.d.ts`. Rules: `.gitignore:33` `.env*.local`, `:10` `/test-results/`, `:14` `/.auth/`, `:39` `*.tsbuildinfo`.

## 2. Runtime / dependency versions

No `.nvmrc`, no `.node-version`, no `engines` in `package.json` (**OBSERVED**). Local `node -v` = v22.17.0. `Dockerfile` pins `node:22-alpine` in all three stages.

| Package | Declared (`package.json`) | Locked at HEAD | Locked in working copy | Installed |
|---|---|---|---|---|
| next | ^16.2.1 | 16.4.3 | 16.4.3 | 16.4.3 |
| react / react-dom | ^19.2.4 | 19.2.4 | 19.2.4 | 19.2.4 |
| @supabase/supabase-js | ^2.44.0 | 2.106.1 | 2.106.1 | 2.106.1 |
| @supabase/ssr | ^0.6.1 | 0.6.1 | 0.6.1 | 0.6.1 |
| @supabase/auth-helpers-nextjs | not declared | – | – | absent |
| **stripe** | **^22.1.0 (`package.json:41`)** | present | present | **22.1.0** |
| @stripe/stripe-js | not declared | – | – | absent |
| typescript | ^5 | 5.5.4 | 5.5.4 | 5.5.4 |
| jest | ^30.0.5 | **30.4.2** | **30.5.2** | **30.5.2** |
| ts-jest | ^29.4.1 | 29.4.11 | 29.4.15 | 29.4.15 |
| @playwright/test | ^1.59.1 | 1.59.1 | 1.59.1 | 1.59.1 |
| zustand | ^4.5.4 | 4.5.4 | 4.5.4 | 4.5.4 |
| zod | ^3.23.8 | 3.25.76 | 3.25.76 | 3.25.76 |
| react-hook-form | ^7.51.5 | not checked | not checked | 7.52.1 |
| tailwindcss | ^3.4.1 | not checked | not checked | 3.4.6 |

- **OBSERVED** dirty `package-lock.json`: `git diff --stat` = 1 file, +5872 / −3617. `name`, `version`, `lockfileVersion: 3` and the root `""` entry are **identical** to HEAD. Package entries 648 → 775; 157 added, 30 removed, 69 version-changed. Direct dependencies that moved: **only `jest` 30.4.2→30.5.2 and `ts-jest` 29.4.11→29.4.15**. The rest is transitive: jest family 30.4.x→30.5.x, `@unrs/resolver-*` 1.12.2→1.13.0, `@parcel/watcher*` added, `@emnapi/*` and the wasm resolver removed, `babel-plugin-istanbul` 7→8, `test-exclude` 6→7.
- **INFERENCE** a plain `npm install` (not `npm ci`) ran in this copy at ~15:25 on 2026-11-10 (`node_modules/.package-lock.json` mtime 15:25:09; `.next` built 15:25). Installed tree matches the working-copy lock, not HEAD's. `Dockerfile` uses `npm ci`, so a container build follows whichever lock is committed. The recorded FFM evidence was produced on jest 30.4.x.
- **OBSERVED** Stripe: the server SDK is declared and installed but has **zero imports** in `src/` or `e2e/`. No `@stripe/stripe-js`. `zod`, `react-hook-form`, `@hookform/resolvers` likewise have zero imports — validation is hand-written (§9).
- **OBSERVED** `package.json` overrides: `postcss ^8.5.10`, `jest-mock 30.4.1` (now older than the installed jest 30.5.2 family; not exercised).

## 3. Scripts, test inventory, prerequisites, existing evidence

- **OBSERVED** scripts (`package.json:5-14`): `dev` next dev · `build` next build · `start` next start · `lint` next lint · `test` jest · `test:integration` jest `--testPathPatterns=__tests__/api` · `typecheck` tsc --noEmit · `test:e2e` playwright test.
  - No `src/__tests__/api` directory exists, so `test:integration` matches nothing.
  - No ESLint config or eslint dependency is present and `next lint` was removed in Next 16. **INFERENCE**: the lint script does not work (not run).
- **OBSERVED** Jest (`jest.config.js`): preset ts-jest, env `node`, roots `src` only, setup `src/__tests__/jest.setup.ts` (placeholder env values; mocks `next/navigation`, `next/cache`). No live Supabase needed.
- **OBSERVED** Jest files, 13 suites (grep counts of `it(`/`test(`; `.each` expands at run time): `portal-registration.test.ts` 90 · `portal-checkout-hold.test.tsx` 27 · `portal-account.test.ts` 20 · `portal-access.test.tsx` 15 · `get-user-role.test.ts` 6 · `portal-boundaries.test.ts` 6 · `portal-stripe-route.test.tsx` 6 · `login-form.test.tsx` 4 · `portal-components.test.tsx` 3 · `portal-owner.test.tsx` 3 · `portal-storage.test.ts` 3 · `portal-dashboard.test.tsx` 2 · `proxy.test.ts` 2.
- **OBSERVED** Playwright (`playwright.config.ts`): `testDir ./e2e`, `outputDir ./test-results`, 1 worker, 0 retries, system Chrome (`channel: "chrome"`), trace/video/screenshot off, `baseURL = PORTAL_BASE_URL ?? http://localhost:3001`. It does **not** start a server; the header comment requires an owned `next start` on :3001 built from the current tree. Projects: `public` (`public.*.spec.ts`), `gate-m-public`, `account` (`account.*.spec.ts`), and `logout` only when `PORTAL_ALLOW_LOGOUT=1`.
- **OBSERVED** e2e files (16 specs + 4 helpers): `public.repair002` 14 · `account.journeys` 10 · `account.repair` 10 · `public.journeys` 8 · `public.repair004` 7 · `public.repair004-addendum` 6 · `public.boundaries` 5 · `public.repair` 5 · `public.owner-declaration` 5 · `gate-m.public` 4 · `public.activation-scenarios` 4 · `public.repair003` 4 · `public.repair005` 4 · `public.repair006` 4 · `public.zoom` 1 · `logout.final` 1. Helpers: `auth.ts`, `helpers.ts`, `contrast.ts`, `gate-m.ts`.
- **OBSERVED** external prerequisites for e2e:
  - `public`, `gate-m-public`: a built app. Public pages still pass through `src/proxy.ts`, which calls `supabase.auth.getUser()` on every request (`src/utils/supabase/middleware.ts:37`), so the Supabase env vars must be set. Behaviour with an unreachable project is **UNKNOWN**.
  - `account`: a **real live Supabase login**. `e2e/auth.ts:15-33` signs in through the real `/login` using `QA_PORTAL_ADMIN_EMAIL` / `QA_PORTAL_ADMIN_PASSWORD` from ignored `.env.qa.local` (`e2e/helpers.ts:4-13`); throws "BLOCKED" if absent. The account must be admin or superadmin in `user_roles` in the live project.
  - `logout.final`: the inherited logout is a **global** sign-out ending every session of that account (`playwright.config.ts:27-28`, `e2e/auth.ts:7-9`). All other account contexts abort `/api/auth/logout`.
- **DOCUMENTED CLAIM** recorded results (inherited): REPAIR_006 — build 0, tsc 0, Jest 248/248, public + Gate M public 156/156, Gate M 236/0 (`RECOVERY.md:36-37`). Gate Q PASS by JARVIS / QA Lead for the frozen snapshot, with R5-O03 accepted nonblocking (strict assertion FAILED, not repaired) and C08 (OwedBook reference) outside scope with no live-auth certification (module `STATE.md:4-6`). Deployment smoke 2026-11-03: `/` 307 → `/demo/register/plan` 200; `/login` 200; `/dashboard` 307 → `/login` (`DEPLOYMENT_CHECKLIST.md`, "Access verification").
- **OBSERVED** evidence stores (names only): `test-results/transition-matrix.json` (32 checkout×activation states × 7 actions: refresh, resume, restart, outcome paid, unknown→paid, unknown→nothing charged, new checkout); module `EVIDENCE/` (E2, REPAIR_001…006, AMENDMENT_001 — logs, jsonl, screenshots, review zips); `QAM/evidence/`; `QAM/HANDOFFS/*_RECEIPT.json`; `QAM/AUTOMATION/{q2,combined001,repair002…006}`.
- **OBSERVED** `tsconfig.json` excludes `agent_docs/**`; `include` is `**/*.ts(x)`, so `e2e/` and `playwright.config.ts` are type-checked.

## 4. Deployment artifacts and the existing FFM feedback deployment

- **OBSERVED** tracked files: `Dockerfile`, `cloudbuild.yaml`, `deploy.sh`, `init-app.sh`, `stark-deploy.yaml`, `DEPLOYMENT_CHECKLIST.md`, `.gcloudignore`, `.dockerignore`, `scripts/install-gcloud.sh`. Generated by "next-deploy-auto v1.3".
- **OBSERVED** target:
  - GCP project `cyberize-nextjs-staging`, region `us-east1`, Cloud Run service **`cyph-sub-portal-prod`** — `deploy.sh:11-13`, `init-app.sh:12-13`, `cloudbuild.yaml:6-7`, `stark-deploy.yaml` (`app.name: cyph-sub-portal`, `gcp.project_id`, `gcp.region`).
  - Runtime service account `sa-cyph-sub-portal-runtime`; image repo `cloud-run-source-deploy`; `--allow-unauthenticated`; 1Gi; max 1 / min 0 (`cloudbuild.yaml`, "Deploy to Cloud Run" step).
  - `stark-deploy.yaml` notes "-prod" is a naming convention only, not a production deployment.
- **OBSERVED** URLs and ports: `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` = `https://cyph-payment.cyberizedev.com` (`deploy.sh:17,20`; `stark-deploy.yaml` `urls.custom_domain` and `public_vars`). Container port 3000 (`Dockerfile` `ENV PORT=3000`, `EXPOSE 3000`). Local: `next dev` default :3000; e2e expects :3001; `.env.example:14` `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- **OBSERVED** env variable NAMES:
  - Read by code: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`src/utils/supabase/client.ts:5-6`, `server.ts:11-12`, `middleware.ts:10-11`); `NEXT_PUBLIC_SITE_URL` (`server.ts:7`, cookie `secure` flag only); `SUPABASE_SECRET_KEY` (`src/utils/supabase/admin.ts:16`; module has no importer).
  - Test only: `PORTAL_BASE_URL`, `PORTAL_ALLOW_LOGOUT` (`playwright.config.ts`); `QA_PORTAL_ADMIN_EMAIL`, `QA_PORTAL_ADMIN_PASSWORD` (`e2e/helpers.ts:12-13`).
  - Build arg only, read by no source file: `NEXT_PUBLIC_APP_URL` (`Dockerfile`, `cloudbuild.yaml`).
  - Reserved, commented out in `.env.example:21-27` ("No code reads these today"): `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ENTERPRISE`. Module `_project/APP_BRIEF.md:106`: "no Starter/Pro/Enterprise inference from old env names" — fossil names, not a plan catalogue.
  - Deploy secrets: none (`stark-deploy.yaml` `secrets.items: []`).
- **DOCUMENTED CLAIM — a live FFM feedback deployment exists.** `agent_docs/RESPONSES/response_2026-11-03_101856_deploy-result.md` and `DEPLOYMENT_CHECKLIST.md`: service `cyph-sub-portal-prod` deployed 2026-11-03, public, revision `cyph-sub-portal-prod-00001-jc5`, custom domain mapped, certificate ready 10:33, smoke OK, "Not Gate D". `APP_BRIEF.md:11`: the FFM is "ready for Coach's review before real billing and provisioning are built". Liveness today is **UNKNOWN** (no network call made).
- **OBSERVED + INFERENCE — this dev copy can disturb it.** The copy carries the identical deploy config: same project, region, service name, domain and Supabase project. Running `./deploy.sh` here would build this tree and roll a new revision onto `cyph-sub-portal-prod`, replacing the stakeholder mock. Nothing in the files separates "dev copy" from "feedback deployment". `deploy.sh:59` and `init-app.sh:23-24` also change local gcloud config.
- **DOCUMENTED CLAIM — shared Supabase project with OwedBook.**
  - `agent_docs/SESSIONS/session_2026-11-03.md:40`: Tony pasted the Supabase URL + publishable key "from the cyber-pharma-prod … deploy" ("same Supabase project").
  - Same file `:48` and `:70`, and `response_2026-11-03_095928_auto-plan.md:32`: `cyber-pharma-prod` (cyber-pharma.cyberizedev.com) **is OwedBook**; `cyph-mission-ctrl-prod` is Mission Control.
  - Auto-plan `:89` R1: the app "shares Supabase project … with the earlier deploy Tony referenced (shared users/data)".
  - `.env.example:5-8`: intended FFM connection is "the SHARED Cyber Pharma dev Supabase project (same project the Mission Control FFM used; 'CyberPharma_Dev_v1' label)".
  - **INFERENCE**: the deployed mock, OwedBook and Mission Control authenticate against one Supabase project and one `auth.users` / `user_roles` set. Whether this copy's `.env.local` points at the same project is **UNKNOWN** (not opened by rule).
- **INFERENCE — consequences for 007:**
  - Any migration, auth-config change (redirect allowlist, email templates, site URL), trigger change or seeded test user applied against that project affects OwedBook and the feedback deployment at once.
  - Supabase Auth redirect allowlist for the portal domain is **deferred / not done** (`DEPLOYMENT_CHECKLIST.md` "Handoff"; auto-plan `:90` R2). Magic-link and invitation flows depend on it.
  - The portal's logout is a global sign-out (§7), so it ends the same user's OwedBook sessions.
- **OBSERVED** `.gcloudignore` excludes `.env*`, `agent_docs/`, `e2e/`, `test-results/`, `node_modules/`, `.next/`; `deploy.sh:34-48` has an upload-boundary guard.

## 5. Routes, layouts, services, types, mocks, stores, state inventories

### 5.1 Route tree (`src/app`, OBSERVED)
```
src/app/
  layout.tsx            root: Saira font, ThemeProvider (dark default), Toaster; title "Cyber Pharma — Subscription Portal" (:11)
  page.tsx              "/" → redirect("/demo/register/plan")  (:11, force-dynamic)
  not-found.tsx, globals.scss, favicon.ico, icon.png, providers/ThemeProvider.tsx
  login/page.tsx + LoginPageContent.tsx        REAL login in PublicShell; staff already signed in → /dashboard (:12-13)
  demo/sign-in/page.tsx                        retired → redirect("/login")
  api/auth/login/route.ts    POST  REAL signInWithPassword + user_roles lookup
  api/auth/logout/route.ts   POST  REAL signOut
  api/auth/confirm/route.ts  GET   REAL verifyOtp(token_hash,type), then redirect to `next`
  (public)/layout.tsx        PublicShell, no auth lookup
    demo/register/plan         C01 PlanView
    demo/register/owner        C02 OwnerView
    demo/register/pharmacies   C03 PharmacyStepView (?store=N 1-based, ?notice=missing_context)
    demo/register/review       C04 ReviewView
    demo/activation            C06 ActivationView
    demo/checkout-incomplete   C14 CheckoutIncompleteView
    demo/access-link           AccessLinkView
    demo/references/email      EmailReferenceView (?variant=owner|store_admin|checkout_unfinished|expired_resend)
  (handoff)/layout.tsx       HandoffShell, not protected
    demo/stripe                C05 CheckoutStandIn (public) | PortalStandIn (account; ?mode=portal|card&purpose=…)
  (account)/layout.tsx       getPortalStaffUser() gate → AccountDemoProvider + Shell (:18-24)
    loading.tsx
    dashboard                  C12 DashboardView ("Account & Billing")
    demo/stores/add            AddStoreView
    demo/stores/confirm        ConfirmStoreView (?quote=error, ?card=updated|unchanged)
    demo/stores/result         StoreResultView
    demo/references/owedbook   C08/C15 OwedBookReferenceView
```
No `src/middleware.ts`; `src/proxy.ts` is the Next 16 proxy. Only three API routes, all auth. No webhook route, no server action, no checkout or billing endpoint.

### 5.2 Service layer (`src/services`)
- `portal/index.ts` — the only import surface for portal UI.
- `portal/registration.ts` (958 lines) — pure registration engine, no I/O.
- `portal/registrationService.ts` (152) — client facade; zustand store persisted to `sessionStorage`.
- `portal/account.ts` (553) — pure account engine.
- `portal/accountService.tsx` (140) — client facade + `AccountDemoProvider` context; per-admin namespace.
- `portal/pricing.ts`, `catalog.ts`, `validation.ts`, `format.ts`, `latency.ts`, `storage.ts`, `stripeRoute.ts`.
- `auth/session.ts` (REAL, server-only), `auth/access.ts` (pure predicate).
- Contract: `src/types/portal/contract.ts:90-106` `PortalServices` (15 async methods); `:108-113` `DemoHarness`. Header `:1`: "copied from the module's `_project/portal-contract.ts` (v1.2, R-011)".

### 5.3 Types
`src/types/portal/contract.ts` (frozen view-model contract, 113 lines) · `src/types/portal/state.ts` (internal mock-state shapes, 195 lines) · `src/types/auth.ts` (`PortalStaffRole = 'superadmin' | 'admin'`, `PortalStaffUser`) · `tailwind-merge.d.ts`.

### 5.4 Mocks and stores
- `src/mocks/portal/fixtures.ts` — the only mock file: `PLAN` (:9-18), `OWNER_JORDAN` (:20-30), `ADMIN_SAM` (:32), `PHARMACY_MAIN/RIVERSIDE/HILLSIDE` (:34-75), `NCPDP_REGISTERED_ELSEWHERE='0000099'` (:78), `EMAIL_EXISTING_ACCOUNT` (:80), `US_STATES` (:82-91), `DATES` (:93-98), `twoStoreAccount()` (:128-143), `oneStoreAccount()` (:145-152), `DUPLICATE_REGISTRY` (:154).
- No `src/store/` directory. Two zustand vanilla stores with `persist` → `sessionStorage`:
  - `registrationStore`, key `cyph-portal-demo:v1:public`, persist version 3 with a migrate step (`registrationService.ts:32-56`; key in `storage.ts:9`).
  - per-admin account store, key `cyph-portal-demo:v1:account:<16 hex of sha256(user.id)>`, version 1 (`accountService.tsx:32-47`; `storage.ts:10-15`; `auth/session.ts:72-74`).
- No `localStorage`, no cookie written by portal code, no server-side state.

### 5.5 State inventories
| Domain | States | Defined at |
|---|---|---|
| Registration draft | `editing · ready_for_checkout · checkout_pending · payment_confirmed · provisioning · access_email_ready · abandoned` | `contract.ts:34` |
| Checkout record | `pending · declined · abandoned · unknown · expired · paid`; `closedReason: details_changed · owner_declaration`; `scope` | `state.ts:52-84` |
| Payment phase (derived) | `none · open · processing · unknown · paid · failed · not_charged` | `registration.ts:268-285` |
| Checkout hold | `owner_declaration · scope_changed · details_incomplete` | `registration.ts:483-505` |
| Activation | `paymentState: pending · confirmed · failed · unknown`; `provisioningState: not_started · pending · ready · attention`; `emailState: not_started · pending · sent · failed`; `retryAvailable`; `supportMessage?` | `contract.ts:61-66` |
| Activation demo plan | `ready · delayed · email_failed · payment_failed` | `state.ts:87-88` |
| Access link | `valid · expired · used`; request `idle · request_sent · error` | `state.ts:105-107` |
| Quote | status `loading · ready · expired · error`; kind `initial · add_store`; `isIllustrative: true` | `contract.ts:9,54-60` |
| Subscription | `pending · active · past_due · cancel_scheduled · canceled`; `billingIssue?`, `cancelAtPeriodEnd?`, `accessEndsAt?`, `nextPaymentAt?` | `contract.ts:6,40-44` |
| Store | `draft · payment_pending · provisioning · active · attention` | `contract.ts:7` |
| Invitation | `not_required · pending · accepted · expired · held`; delivery `not_sent · pending · sent · failed` | `contract.ts:8,67-70` |
| Add-store operation | `pending · unknown · failed · paid_provisioning · attention · succeeded`; `applied` flag | `contract.ts:83-86`; `state.ts:156-161` |
| Add-store availability | `allowed · paused_past_due · paused_cancel_scheduled · unavailable_canceled` | `account.ts:229-242` |
| Portal return | outcome `no_change · cancel_scheduled · canceled · resumed · card_updated`; `returnStatus none · refreshing · unchanged · updated` | `state.ts:134-139,172` |
| Personas / capabilities | `prospective_owner · billing_owner · store_admin · member`; `canViewBilling · canManageBilling · canAddStore` | `contract.ts:5,10`; `account.ts:145-147`; `state.ts:186-195` |
| Billing purposes | `manage · cancel · resume · change_card · invoices` | `account.ts:505-506` |
| Registration scenarios (18) | fresh; prefilled_{one,two,three}_store; quote_unavailable; checkout_{abandoned,declined,unknown,expired}; activation_{waiting,provisioning,delayed,email_failed,payment_failed,ready}; link_{expired,used,request_error} | `state.ts:30-49`; seeded at `registration.ts:120-194` |
| Account scenarios (9) | two_store_active, one_store_active, past_due, cancel_scheduled, canceled, no_pharmacies, load_error, handoff_error, add_draft_restored | `state.ts:115-125`; seeded at `account.ts:69-125` |
| Error codes | `validation · denied · duplicate · quote_expired · quote_unavailable · conflict · missing_context` | `contract.ts:81-82` |

**Member management: none exists (OBSERVED).** No screen, service function or state for listing, inviting, removing or re-roling members, sole-admin recovery, or ownership transfer. The only related pieces: one store-admin assignment per pharmacy at entry (`AdminAssignment`, `contract.ts:24`); `acceptInvitation` demo control (`account.ts:492-499`); a "Resend invitation" toast (`DashboardView.tsx:185-190`); a denied view for non-owner personas (`DashboardView.tsx:144-166`); placeholder copy `[OWNERSHIP TRANSFER PROCESS TBD]` (`DashboardView.tsx:166`, and ~:474). 007B member/admin management, sole-admin recovery and ownership transfer are greenfield.

## 6. What is mocked, and the swap points

Everything under `src/services/portal/**` is mock. Common mechanism: pure engine `(state, deps) → {state, result}`; the facade commits the new state to the sessionStorage-backed store. `later()` adds a fixed **350 ms** delay (`latency.ts:2`); `sync()` adds none. **There are no random failures anywhere**: every failure is deterministic, driven by a chosen scenario, a counter (`quoteFailuresRemaining`, `loadFailuresRemaining`) or a one-shot flag (`handoffFailNext`, `accessRequestFailNext`). `deps.now()` = `Date.now() + clockOffsetMs` (demo clock).

### 6.1 Public registration (facade `registrationService.ts`; engine `registration.ts`)
| Function / signature | Facade : engine line | Mock behaviour | Real call it stands for |
|---|---|---|---|
| `getRegistrationDraft(): Promise<RegistrationDraft>` | :79 | reads store, no delay | load server-side draft / resume |
| `saveRegistrationDraft(input: RegistrationDraft): Promise<Result<RegistrationDraft>>` | :82-94 | replays setStoreCount + saveOwner + savePharmacy, no delay | persist whole draft |
| `setStoreCount(n: number)` | :113 → :334 | sync; truncates pharmacies; `touch()` (:224) bumps revision, drops quote, clears consents, closes an open checkout | draft update + quote invalidation |
| `storeCountDiscards(n): string[]` | :112 → :327 | pure read | client-only |
| `saveOwner(owner: Partial<OwnerDraft>)` | :115 → :430 | 350 ms; validates; `conflict` only for the single fixture email (:436-437) | **owner email / existing-account check** (must not enumerate) |
| `keepOwner(owner)`, `keepPharmacy(index, pharmacy)` | :116-117 → :398, :419 | sync, no validation (Back / navigate away) | draft autosave |
| `savePharmacy(index, pharmacy: Partial<PharmacyDraft>)` | :118 → :441 | 350 ms; validates; `duplicate` if NCPDP is in the one-value `DUPLICATE_REGISTRY` or repeats within the draft (:452-460) | **pharmacy identifier uniqueness check against real stores** |
| `retryPricing()` | :114 → :560 | 350 ms; decrements simulated failure counter | retry price fetch |
| `requestQuote(): Promise<Result<QuoteView>>` | :119 → :565 | 350 ms; local arithmetic; 30-min expiry; `prorationCents: 0`; no `taxCents`; `isIllustrative: true`; clears consents | **server-computed price** (Stripe price / invoice preview, tax) |
| `applyCode({draftId, code})` | :95 → :603 | 350 ms; only `DEMO10` valid; re-quotes | Stripe promotion code validation |
| `removeCode()` | :120 → :615 | 350 ms; re-quotes | same |
| `setConsents({termsAccepted, recurringChargeAccepted})` | :121 → :620 | sync; sessionStorage only | **record consent server-side** (document version, timestamp, quote id) |
| `startCheckout({draftId, quoteId, consents, operationKey}): Promise<Result<HandoffView>>` | :96 → :649 | 350 ms; checks key, quote id, revision, expiry, consents; records `checkout{status:'pending', scope}`; returns `{destination:'stripe_checkout', isDemo:true}`; UI then `router.push('/demo/stripe')` (`ReviewView.tsx:147-150`) | **create Stripe Checkout Session** (idempotency key = operationKey), redirect to `session.url` |
| `resolveCheckout(outcome: 'paid'|'processing'|'declined'|'back'|'unknown')` | :122 → :699 | 350 ms; **a reviewer button decides the payment outcome** | no production equivalent: Stripe-hosted page + `success_url`/`cancel_url` return + **signed webhook** |
| `resolveUnknownPayment(outcome: 'paid'|'not_charged')` | :123 → :740 | 350 ms; reviewer buttons | **server status poll** / webhook arrival |
| `readActivation(operationId: string): Promise<Result<ActivationView>>` | :97-99 → :803 | no delay; **ignores `operationId`**, reads tab state | GET activation status by id |
| `refreshActivation(): Promise<Result<ActivationView>>` | :127 → :816 | 350 ms; each call advances one stage per `activationPlan` | poll provisioning (account + first store + invitation) |
| `resendAccessEmail()` | :128 → :857 | 350 ms; sets `emailState: 'sent'`, stamps time; **nothing is sent** | **resend invitation / magic link**, rate-limited |
| `requestAccessEmailPreview(contextId: string)` | :100-106 | 350 ms; always `request_received`; preview built from tab state (`accessEmailPreviews`, :887) | none (reference only) |
| `useAccessLink()` | :129 → :938 | 350 ms; link → `used`; **no navigation to any other app** | token verification + redirect into account setup / OwedBook |
| `requestNewAccessLink()` | :130 → :944 | 350 ms; neutral `request_received`; fails once if `accessRequestFailNext` | request new magic link (keep the neutral response) |
| `resumeSignup()` | :124 → :760 | sync; clears checkout, spends its key, forces fresh quote + consents | resume after decline / abandon |
| `restoreSubmittedScope()` | :125 → :512 | sync; puts draft back to the paid-for scope | "use the details I paid for" |
| `restartSignup()` | :126 → :775 | sync; new fresh draft; refused when submitted or paid | discard expired draft |
| `registrationHarness.{selectScenario, setActivationPlan, setLinkState, advanceClock, reset}` | :134-140 | demo controls | delete at integration |

### 6.2 Account (facade `accountService.tsx:53-108`; engine `account.ts`)
| Function / signature | Facade : engine line | Mock behaviour | Real call it stands for |
|---|---|---|---|
| `getSession(): Promise<PortalSessionView>` | :70 → :155 | returns the **synthetic persona** (Jordan / Sam / Casey), `isDemo: true`, never the real signed-in user | real user → account membership → billing capabilities |
| `loadAccount()`, `retryLoadAccount()`, `peekAccount()` | :86-89 → :218-227 | 350 ms (peek: none); fixture account; `denied` payload for non-owner personas; a load failure persists until explicit retry | GET billing account (subscription, stores, invitations) |
| `getAddStoreDraft(): Promise<AddStoreDraft>` | :73 | reads store | load add-store draft |
| `saveAddStoreDraft(input: AddStoreDraft)` / `savePharmacy(pharmacy)` | :76, :91 → :268 | 350 ms; guard `canAddStore` + availability (:244-249); validation; duplicate vs own account (:280-283) and vs registry (:284-287) | persist add-store draft; uniqueness check |
| `keepDraft(pharmacy)`, `startOver()` | :92-93 → :256, :263 | sync | autosave / discard |
| `requestQuote(): Promise<Result<QuoteView>>` | :94 → :295 | 350 ms; `newRecurring = current + 4900`; `prorationCents = dueNowCents = 2450` fixed (:313-316) | **Stripe upcoming-invoice / proration preview** |
| `setConsent(accepted: boolean): Result<ConsentView>` | :95 → :325 | sync; `priceChangeAccepted` | record price-change consent |
| `confirmAddStore({draftId, quoteId, consents, operationKey}): Promise<Result<OperationView>>` | :77 → :386 | 350 ms; outcome taken from the `nextAddOutcome` demo setting (:407); on succeeded/attention appends a pharmacy and adds 4900 to the recurring total exactly once (`applyFinancialChange`, :349-380) | **subscription quantity/item update charged to the card on file** (idempotent), then store provisioning + invitation |
| `readOperation(operationId: string): Promise<Result<OperationView>>` | :78-80 → :432 | no delay; actually keyed by `operationKey` | poll add-store operation |
| `openBillingPreview(purpose): Promise<Result<HandoffView>>` | :81 → :508 | 350 ms; returns `{destination:'stripe_portal'}`; UI routes to `/demo/stripe?mode=portal…`; one-shot failure if `handoffFailNext` | **create Stripe Billing Portal session**, redirect |
| `returnFromPortal(outcome: PortalOutcome)` | :96 → :523 | sync; a reviewer button states what "happened" in the portal | none: replaced by portal `return_url` |
| `refreshAfterHandoff(context: ReturnContext)` | :90 → :529 | 350 ms; applies the pending demo outcome to subscription status; ignores `context` | re-read webhook-synced subscription after return |
| `acceptInvitation(pharmacyId)` | :97 → :492 | sync demo control | happens in the other app when the invitee accepts |
| `harness.{selectScenario, selectPersona, setNextAddOutcome, resolveOperation, advanceClock, reset}` | :98-106 | demo controls | delete at integration |
| Dashboard "Resend invitation" | `DashboardView.tsx:185-190` | **toast only**, not a service call | resend store-admin invitation — needs a new service function |

### 6.3 Not mocked (real today)
`src/services/auth/session.ts` (`getPortalStaffUser` :27, `requireAccountUser` :62, `accountKeyFor` :72) · `src/utils/get-user-role.ts` · `src/utils/supabase/{server,middleware,client,admin}.ts` · `src/app/api/auth/{login,logout,confirm}/route.ts` · `src/proxy.ts`.

### 6.4 Structural note (INFERENCE)
The engines are synchronous reducers over browser state and the facades are `"use client"` modules. Swapping to a backend means: (a) new server endpoints/actions for each row above; (b) replacing engine-computed state with server-fetched state; (c) deleting the `resolve*` / `returnFromPortal` / harness entry points. `PortalServices` (`contract.ts:90-106`) is already async and shaped for this, but the step-level functions the screens actually call (`setStoreCount`, `keepOwner`, `saveOwner`, `resolveCheckout`, `refreshActivation`, etc.) are outside that interface.

## 7. Guards, roles, real Supabase usage, `supabase/` folder

- **OBSERVED** `src/proxy.ts:4-12` runs `updateSession` on every non-static path. `src/utils/supabase/middleware.ts:36-37` only refreshes the session ("don't redirect - let layouts handle auth"). The proxy protects nothing.
- **OBSERVED** guard chain for account pages:
  - `src/app/(account)/layout.tsx:18-19`: `getPortalStaffUser()` → `redirect("/login")`.
  - Each page also calls `requireAccountUser()` (`dashboard/page.tsx:10`, `demo/stores/confirm/page.tsx:9`, `demo/references/owedbook/page.tsx:8`, and the other store pages), because Next renders pages in parallel with layouts.
  - `/demo/stripe` guards by mode: `classifyStripeStandIn` (`src/services/portal/stripeRoute.ts:22-30`, fail-closed) used at `src/app/(handoff)/demo/stripe/page.tsx:17-26`.
- **OBSERVED** role rule — TEMPORARY, Director ruling R-008 (module `RULINGS.md:37-48`): admit `user_roles.role ∈ {admin, superadmin}`; deny `member` and role-less. Code: `src/services/auth/access.ts:11-15`; `src/types/auth.ts:3-7`; role read only from `public.user_roles` (`src/utils/get-user-role.ts:22-26`), never `user_metadata` (only `full_name` for display, `session.ts:42-45`). The login form signs a non-staff user straight back out (`src/app/login/LoginPageContent.tsx:62-67`).
- **OBSERVED** inherited starter-kit assumptions: one global role per user, enum `app_role ('superadmin','admin','member')` (`supabase/setup.sql:15`; `get-user-role.ts:4-8`); `.single()` on `user_roles` by `user_id` — no account or store scope. `src/types/auth.ts:6-7`: "Customer-facing authorization will be specified later and replaces this type — do not extend it ad hoc."
- **INFERENCE (matters for 007)**: today's gate admits internal/staff-style roles from the shared project and shows them a synthetic account. A real paying owner would get in only with a global `admin` row, which conflates store-admin role with billing authority — the opposite of the stated business rule. Superadmin entry is "retained provisionally" (R-009 item 5).
- **OBSERVED** real Supabase auth calls: `signInWithPassword` (`api/auth/login/route.ts:14`); `signOut()` default scope (`api/auth/logout/route.ts:7`; documented as global); `verifyOtp({type, token_hash})` (`api/auth/confirm/route.ts:20`); `auth.getUser()` (proxy and `session.ts:30-32`). The login route returns the whole Supabase `data` object (session tokens) plus role in its JSON body (`login/route.ts:42-47`) — inherited behaviour.
- **OBSERVED** no sign-up, password reset, invite, or magic-link *sending* code exists. `/api/auth/confirm` is the only token-consuming endpoint; its comment (:30-31) says recovery is "Supabase-console-only in v1".
- **OBSERVED** `src/utils/supabase/admin.ts` (service-role client) and `client.ts` (browser client) have no importers.
- **OBSERVED** `supabase/` contents: `README.md`; `setup.sql` (129 lines: `app_role` enum :15, `user_roles` :24 with own-row RLS, `profiles` :50, `handle_new_user()` :87, trigger `on_auth_user_created` :111); `migration_add_profiles.sql` (126 lines: `profiles` :13, superadmin-aware policies :30/:41, backfill insert :58, a different `handle_new_user()` :72, drops two triggers :111-112 and recreates one :114). No `supabase/migrations/`, no `config.toml`, no CLI link.
- **DOCUMENTED CLAIM** `supabase/README.md:3-13`: both files are "UNVERIFIED reference" from the starter kit / Mission Control lineage; they **conflict with each other**; "which one is live is unknown"; the app reads only `public.user_roles`; "The Subscription Portal schema will be specified in its own phase."
- **INFERENCE — competition with OwedBook's migration chain**: these files are not a chain (no timestamps, no ordering, plain `CREATE TYPE` / `CREATE TABLE`). They define objects the shared project almost certainly already has. Run against it, the `CREATE` statements would fail and the `CREATE OR REPLACE FUNCTION` / `DROP TRIGGER` statements would silently replace the new-user trigger OwedBook relies on. Treat as reference only; 007 schema belongs in the OwedBook-owned chain or an explicitly separate schema. Live schema state is **UNKNOWN**.

## 8. Pending/unknown payment, duplicate click, retry, saved state, email failure — as mocked

### Duplicate click / double submit
- **OBSERVED** client side:
  - `useOperationKey` (`src/components/portal/hooks.ts:6-22`): one random key per attempt, stable across double-clicks, renewed only deliberately.
  - Review: `submit` returns early when `leaving` (`ReviewView.tsx:138`), sets `leaving` (:146); the submit button is disabled on `!ready || leaving || checkout?.status === "pending" || submitted` (~:401).
  - Add store: `confirm` returns early when `confirming` (`ConfirmStoreView.tsx:84`), button disabled on `!ready || confirming` (:235).
  - Stand-in outcome buttons are disabled while one is busy (`CheckoutStandIn.tsx:219-224`).
- **OBSERVED** mock service side:
  - `startCheckout`: same key + pending → same handoff, no second checkout (`registration.ts:657-661`); another key while pending/unknown → `conflict` (:662-663); already paid → `conflict` (:664); a closed checkout's key is spent forever (`spentCheckoutKeys`, :667-668).
  - `confirmAddStore`: same key → same result, never a second store (`account.ts:394-395`); any pending/unknown operation blocks a new one (:396-397); the financial change applies exactly once (`applied`, :349-350).
- **Truthful vs fake**: the idempotency design is sound and tested, but it is enforced in one tab's sessionStorage. Two tabs, two devices or a cleared tab are independent. **No server-side idempotency exists.**

### Pending / unknown payment
- **OBSERVED** `processing` (checkout pending + activation pending) and `unknown` (returned before confirmation) are separate phases (`registration.ts:268-285`).
- **OBSERVED** a submitted payment cannot be closed, replayed or restarted from our side: `isSubmitted` (:244-247), `SUBMITTED_MESSAGE` (:254), `restartSignup` refusal (:777-778), `resumeSignup` refusal (:764-766). Copy: "Please don't pay again" (`CheckoutIncompleteView.tsx:86-87`; `ReviewView.tsx:178`; `CheckoutStandIn.tsx:98-101`).
- **OBSERVED** a payment is bound to the scope it was quoted for (`CheckoutScope`, `state.ts:66-75`; `scopeOf`/`inScope`, `registration.ts:290-313`). Later edits put it on hold (`checkoutHold`, :494-499); "Use the details I paid for" restores it (:512-525; button `ActivationView.tsx:59`).
- **OBSERVED** the checkout record governs; a stale activation flag never advances or discards it (`paymentPhase`; `consistentActivation`, :793-801; `refreshActivation` guard :823-825).
- **Fake**: the outcome itself. Success, decline, processing and unknown are picked by reviewer buttons (`CheckoutStandIn.tsx:219-224`); unknown is resolved by "Stripe confirms payment → activation" / "Stripe confirms nothing charged" (`CheckoutIncompleteView.tsx:127-128`). No return-URL handling, session id, webhook or server poll exists. The stand-in states the intended rule (`CheckoutStandIn.tsx:218`): "Access is never granted from the browser return alone; the real app waits for Stripe's signed payment confirmation before provisioning" — design intent, not implemented.
- **OBSERVED** `expired` exists only as a seeded scenario (`registration.ts:137-147`); nothing expires a checkout by time. Hold period is `[HOLD PERIOD TBD]`.

### Retry
- **OBSERVED** quote failure → "Try again" consumes one simulated failure (`retryPricing`, :560). Account load failure persists until explicit retry (`account.ts:213-227`). Billing-portal handoff error is one-shot with a retry button (`account.ts:512-513`; `DashboardView.tsx:327-334`). Declined initial payment → resume with new quote, fresh consents and a new key (`resumeSignup`, :760-772; key renewal `ReviewView.tsx:49-51`). Add-store failure → `opKey.renew()` (`ConfirmStoreView.tsx:103-105`). Provisioning "attention" → refresh advances it (:836-845).
- **Fake**: every retry succeeds once the scripted failure count is used up.

### Saved state (refresh mid-flow, back button)
- **OBSERVED** state survives reload **in the same tab** (sessionStorage; `registrationService.ts:50`); a `hydrated` flag gates rendering (:144-151). It does **not** survive tab close, a new tab, another browser or device.
- **OBSERVED** Back / navigate-away keeps typed values without validating (`keepOwner` :398, `keepPharmacy` :419). Deep links to later steps redirect to the first incomplete step (`firstIncomplete`, :467-477; `ReviewView.tsx:54-64`). Revisiting the stand-in never changes state (`CheckoutStandIn.tsx:15-17`).
- **OBSERVED** persisted-state migrations v1→v3 (`migrateRegistration` :375, `bindLegacyScope` :536) exist only for old demo-tab data.
- **Over-promising copy**: "use Stripe's back link to return here with everything saved" (`CheckoutStandIn.tsx:156`); "Saved until [HOLD PERIOD TBD]" (`CheckoutIncompleteView.tsx:102`); "We also email this link to the owner when a checkout is left unfinished" (`:147`). A same-tab Stripe round trip would keep sessionStorage, but cross-device resume, an emailed resume link, or return after tab close have no backing. `resumeAvailable` is a flag only.
- **OBSERVED** owner email, mobile and pharmacy details sit in sessionStorage in clear. `storage.ts:6` ("No … real email is ever written here") holds only while inputs are synthetic.

### Email failure
- **OBSERVED** scenario `activation_email_failed` / plan `email_failed`: provisioning `ready`, `emailState: 'failed'`, `retryAvailable: true` (`registration.ts:164-170`, :839-841). UI: "We couldn't send your access email … Your payment and setup are fine — only the email failed" (`ActivationView.tsx:272-273`). Resend is allowed only when paid **and** setup is ready (:857-864).
- **Fake**: resend always succeeds and nothing is sent (:856). New-link request returns "If an account matches this link, a new access link is on its way … (Simulated — nothing is sent.)" (`AccessLinkView.tsx:63`). No delivery-status source, bounce handling or rate limit. Wrong-address correction is explicitly unsupported (`ActivationView.tsx:326`).
- **OBSERVED** a store-admin invitation is `held` while its store needs attention and released on recovery (`account.ts:363`, :482).

### Activation order as mocked
payment pending → confirmed → provisioning pending → (attention) → ready → email sent / failed → access link valid → used → "downstream setup" panel. `ActivationView.tsx:296`: "We don't sign you in from this page, and this demo never creates an account." `registration.ts:6`: "Mock payment never creates a user, grants a role or signs anyone in."

## 9. Form fields, validation, identifiers, uniqueness, commercial rules

**OBSERVED — there are no zod schemas.** Validation is hand-written in `src/services/portal/validation.ts` and runs at the mock-service boundary; forms use controlled inputs.

### Owner (C02) — `validation.ts:22-34`; fields `register/OwnerView.tsx:135-154`
| Field | Rule |
|---|---|
| First name, Last name | non-blank (:24-25) |
| Work email | non-blank + regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` (:7, :26-27) |
| Mobile phone | ≥ 10 digits after stripping non-digits (:28) |
| Owner declaration checkbox | must be exactly `true` (:31-32); exact text in `catalog.ts:19-20` |
| Legal business name | optional, no validation |
Existing-account check: one fixture email → `conflict` "This email may already have a Pharmacy Books account." (`registration.ts:436-437`). No email verification before payment.

### Pharmacy — registration C03 and Add Store share `components/portal/PharmacyFields.tsx:102-170` and `validatePharmacy` (`validation.ts:50-69`)
| Field | Rule |
|---|---|
| Pharmacy name, Street, City | non-blank (:52-54) |
| State | non-blank (:55); select of 50 states + DC (`fixtures.ts:82-91`) |
| ZIP | exactly 5 digits (:56-57); `maxLength={5}` |
| **NCPDP number** | **required, exactly 7 digits**, string (:58-59); `maxLength={7}` |
| **NPI** | **required, exactly 10 digits**, string, **no checksum** (:60-61); help "10 digits." |
| Store phone | ≥ 10 digits (:62) |
| Pharmacy software | `Liberty · Pioneer · Other` (:8, :63-64); Other requires a name (:65-66) |
| Store admin | `owner` ("Me") or `other` → full name + valid email (`validateAdmin`, :36-48) |
Add-store defaults the admin to `other` with blank fields (`account.ts:66`). Operation keys must match `^[A-Za-z0-9_-]{8,64}$` (`validation.ts:76-78`).

### NPI vs NCPDP (for Frank's request)
- **OBSERVED** NCPDP is the pharmacy identity key; NPI is a format-checked attribute only.
  - Duplicate detection is NCPDP-only: registry and in-draft checks (`registration.ts:452-460`; also `firstIncomplete` :473); add-store vs own account and vs registry (`account.ts:280-287`); demo hint `duplicateNcpdp` (`catalog.ts:9`); fixtures (`fixtures.ts:78,154`).
  - Display identity is NCPDP: `PharmacyView.ncpdpDisplay` (`contract.ts:46`); `` `NCPDP ${ncpdp} · ${city}` `` (`fixtures.ts:104,117`; `account.ts:358,447`); `PharmacyRecord.ncpdp` (`state.ts:142`).
  - **NPI is not carried into `PharmacyView` or `PharmacyRecord`** — the account model drops it after registration. NPI is never checked for uniqueness.
  - Error copy is NCPDP-worded ("Same NCPDP as pharmacy N.", "Already registered. Check the number or contact support.").
- **DOCUMENTED CLAIM** module `_project/UI_SPEC.md:84`: NCPDP "identifies the pharmacy; not proof of ownership". `DATA_CONTRACT.md:64`: formats are "for UI demonstration. Do not label either 'ownership verified.'" `DATA_CONTRACT.md:34`: use invalid-checksum NPI examples; never send to external systems. `APP_BRIEF.md:70`: "NPI ownership verification" is out of scope.
- **OBSERVED** Frank's NPI request is not recorded in the module's `_project/*`, `RULINGS.md` or `ACCEPTANCE_SPEC.md` (the only "Frank" there is `APP_BRIEF.md:106` "Coach/Frank own final offer"). **UNKNOWN**: whether NCPDP is dropped, optional or kept; organisational vs individual NPI; whether one NPI may cover several stores.
- **INFERENCE — change surface for an NPI switch**: `validation.ts:58-61`; `registration.ts:452-460,473`; `account.ts:280-287,358,447`; `contract.ts:27,46`; `state.ts:142`; `fixtures.ts` identifiers / `ncpdpDisplay` / registry; `catalog.ts:9`; `PharmacyFields.tsx:109-119`; `ReviewView.tsx` NCPDP/NPI rows (~:253-254); Jest `portal-registration`, `portal-account`; e2e duplicate specs; contract docs (`DATA_CONTRACT` §4/§5, `UI_SPEC` C03/C16, `ACCEPTANCE_SPEC` AC-06).

### Uniqueness assumptions (all mock)
One NCPDP ↔ one store globally; no duplicate inside one signup; an owner email maps to at most one existing account (fixture); the duplicate response discloses no owner identity (`UI_SPEC.md:86`); one store admin per store (R-011 item 4).

### Commercial rules — where hard-coded, and status
| Rule | Value and location | Status |
|---|---|---|
| Plan | single plan `Standard`, id `demo_plan_standard`, monthly, 1 store included (`fixtures.ts:9-18`) | `commercialStatus: 'provisional'` (:17); benefits `"[What's included: TBD]"` (:16) |
| Base price | 9900 cents (`pricing.ts:5`; duplicated `fixtures.ts:14`, :149) | placeholder — `DATA_CONTRACT.md:127` "illustrative engineering fixtures, not proposed commercial pricing" |
| Additional store | 4900 cents / month (`pricing.ts:6`; `fixtures.ts:15`, :124) | placeholder |
| Initial formula | `9900 + 4900·(N−1)` (`pricing.ts:23-27`) | placeholder; no business cap on N (:12-17 — an "unapproved 20" cap was removed) |
| Two-store total | 14800 cents hard-coded (`fixtures.ts:138`) | fixture |
| Add-store due-now | fixed 2450 cents, reported as `prorationCents` (`pricing.ts:7`; `account.ts:314-316`) | placeholder — "never a production proration formula" (`DATA_CONTRACT.md:160`); UI `[PRORATION RULE TBD]`, `[EFFECTIVE DATE RULE TBD]` (`ConfirmStoreView.tsx:171`) |
| Promo code | `DEMO10` → −1000 cents on initial due-now only (`pricing.ts:8-9,33-36`) | demo-only, "no APA claim" (`DATA_CONTRACT.md:140`) |
| Quote lifetime | 30 minutes (`pricing.ts:10`) | engineering default |
| Tax | never computed; "Tax calculated at checkout if it applies" (`PlanView.tsx:153`; `ReviewView.tsx` ~:358) | undecided |
| Trial | none anywhere | not specified |
| Cancellation / end of period | `[CANCELLATION TERMS TBD]` (`ReviewView.tsx` ~:311); `[POLICY TBD]` ×5 (`DashboardView.tsx:360,365,422` …); `cancelAtPeriodEnd` / access date deliberately omitted (`RULINGS.md:19-20`, R-005) | open |
| Grace period | `[GRACE POLICY TBD]`, `[MEMBER ACCESS DURING GRACE PERIOD TBD]` (`OwedBookReferenceView.tsx:53,57`) | open |
| Add-store paused while past_due / cancel_scheduled | `account.ts:229-249`; "Proposed rule" pill (`AccountGate.tsx:36`) | proposed demo rule, not approved (R-005) |
| Refunds, retention, reactivation | none assumed (`DATA_CONTRACT.md:100`) | open |
| Draft hold period, link lifetime | `[HOLD PERIOD TBD]` (`CheckoutIncompleteView.tsx:93,102`); `[LINK LIFETIME TBD]` (`registration.ts:904,913,932`; `ActivationView.tsx:296`) | open |
| Terms / privacy links, support email, sending address | `[LINK TBD]` (`ReviewView.tsx` ~:294); `[SUPPORT EMAIL]` ×16; `[SENDING ADDRESS TBD]`, `[COMPANY MAILING ADDRESS TBD]` (email previews) | open |
| Ownership transfer | `[OWNERSHIP TRANSFER PROCESS TBD]`; no self-service (`DashboardView.tsx:166`) | open |
No Stripe sandbox object IDs (price, product, coupon) exist in the repo.

**Recorded as stakeholder-approved (DOCUMENTED CLAIM):**
- Owner-only registration with an explicit owner declaration; job-title dropdown removed — "Coach approved", implementation authorised by the Director (`RULINGS.md:76-91`, R-011, 29 Oct 2026). Appointing "Someone else" as store admin transfers no ownership, billing or right to buy more stores; one admin per store. Neither email nor payment proves ownership.
- Public registration with no login; account management behind real login (Director ruling R-009, `RULINGS.md:50-66`).
- Software options Liberty / Pioneer / Other "from Coach" (`DATA_CONTRACT.md:65`).
**Assumption:** customer-facing brand "Pharmacy Books", destination product "OwedBook" (`APP_BRIEF.md:104`), pending Tony/Coach.
**Provisional (Director decision, Coach unconfirmed):** account-level multi-store billing — one account, one owner, one subscription, many pharmacies (`APP_BRIEF.md:100`; `DATA_CONTRACT.md:15`); the "one-subscription-per-store conflict" is still with Coach. Collecting N pharmacy records for N stores before payment is a "proposed resolution" (`APP_BRIEF.md:105`). Module `STATE.md:9`: "Coach confirmations: still pending … none invented."
**Everything in the table above is placeholder or sandbox default.**

## 10. Cross-app links to OwedBook, redirects, cookies, session sharing

- **OBSERVED** there is **no real link to OwedBook**. No external URL in `src/` (the only `http` hits are an SVG namespace and the `https://` prefix test at `server.ts:8`). No env name for an OwedBook URL. Every "OwedBook" control goes to the internal stand-in `/demo/references/owedbook`: "Back to OwedBook" (`DashboardView.tsx:131,158`), "Open in OwedBook" (:194), "Return to OwedBook" (`StoreResultView.tsx:124`), nav link (`Shell.tsx:82,141`).
- **OBSERVED** `account/OwedBookReferenceView.tsx:13-14`: "Only the panel is designed; the frame stands in for OwedBook's existing shell. No SSO claim." Line :107 carries `[SSO — not proven by this design]`. It previews billing banners plus "Manage billing" (:80) and "Add a store" (:84) entries the OwedBook side would host — a design reference for work in the other repo. Gate Q left this screen out of scope.
- **OBSERVED** the access-link "continue" ends in a panel "Downstream · not designed here — Account setup" (`AccessLinkView.tsx:44-46`): the owner "sets a password and sign-in protection in the account setup flow [DOWNSTREAM SETUP — not designed here], then lands in OwedBook." No navigation happens; `/demo/access-link` takes no token.
- **OBSERVED** login copy: "Same sign-in as OwedBook. Use your existing account to manage your subscription." (`LoginPageContent.tsx:78`). **INFERENCE**: true only as shared credentials in a shared Supabase project (§4), not single sign-on.
- **OBSERVED** redirects and `next`:
  - `/api/auth/confirm` reads `next` (default `/`) and assigns it to `redirectTo.pathname` on a clone of the request URL (`route.ts:10-13`). The host cannot change, so no redirect to another origin — but there is **no allowlist**: any internal path is accepted and unrelated query params pass through. A landing in OwedBook cannot be expressed through this handler as written.
  - Failure → `/login` (:32-33).
  - Login success → hard-coded `/dashboard` (`LoginPageContent.tsx:69`); no return-to parameter. `/login` reads only `reason=session_expired` (`login/page.tsx:14-17`).
  - No `redirectTo` / `emailRedirectTo` is passed to Supabase anywhere.
  - Portal query params are enum-validated and can only add restrictions (`stripeRoute.ts:22-30`; `demo/stores/confirm/page.tsx:10-11`; `demo/register/pharmacies/page.tsx:9-11`).
- **OBSERVED** cookies: Supabase SSR auth cookies only. `server.ts:21-27` sets `secure` (when `NEXT_PUBLIC_SITE_URL` starts with `https://`), `sameSite: 'lax'`, `httpOnly: false`, and **no `domain`** → host-only. The proxy passes Supabase's own options through (`middleware.ts:24-26`). Cookie name is Supabase's default for the project.
- **INFERENCE — session sharing**: with host-only cookies, a portal session is not visible to OwedBook's host, even under the same parent domain and Supabase project. 007A cross-app access needs an explicit design: a parent-domain cookie (both apps must agree on domain and cookie name), a token / magic-link handoff, or a separate sign-in. With a parent-domain cookie, the global `signOut()` and shared cookie name become cross-app concerns. The redirect allowlist for the portal domain is not configured (§4).
- **OBSERVED** `next.config.js` sets `Cache-Control: no-store` on every route and `output: "standalone"`; `images.remotePatterns` allows `res.cloudinary.com` (unused residue).

## 11. Reusable design and tests; changes needed for truthful states

### Reusable (INFERENCE from source)
- Design system: `src/app/globals.scss` tokens, `tailwind.config.ts`, `src/components/ui/*`, and shared `src/components/portal/*` — `Alert`, `Pill`, `Stepper`, `FormField`, `ErrorSummary`, `DataTable`, `EmptyState`, `Counter`, `RadioCard`, `PageHeader`, `ExternalHandoffPanel`, `Shell`, `PublicShell`, `HandoffShell`, `Brand`, `PharmacyFields`.
- Screens with their state copy: Plan, Owner, Pharmacy step, Review, Activation (payment / setup / email tracks), Checkout-incomplete, Access-link, Dashboard, Add / Confirm / Result store, email previews (`references/EmailPreview.tsx`, four variants).
- Rules worth carrying to the backend unchanged: operation-key idempotency; quote bound to draft revision and expiry; consents cleared on any material change; checkout scope captured at open and immutable; "checkout record governs" precedence; a submitted payment can never be closed, replayed or restarted client-side; invitation held until provisioning completes; neutral responses that do not reveal account existence; capabilities (`canViewBilling / canManageBilling / canAddStore`) separate from store role.
- Types: `contract.ts` view models and `PortalServices` are a ready draft API contract.
- Tests: `portal-registration.test.ts`, `portal-checkout-hold.test.tsx`, `portal-account.test.ts` encode the state-machine rules against pure engines and can be re-pointed at a server implementation. `portal-access`, `portal-stripe-route`, `proxy`, `get-user-role`, `login-form` cover the real guard. `test-results/transition-matrix.json` is a compact oracle. Public e2e journeys are reusable once the outcome buttons become Stripe test-mode steps; account journeys need a real seeded account.

### Changes needed for a real Stripe + provisioning backend (INFERENCE)
1. **Server authority.** Move draft, quote, checkout, activation and operation state from sessionStorage to server records keyed by registration / operation id; enforce idempotency server-side.
2. **Remove outcome choosers.** Delete `resolveCheckout`, `resolveUnknownPayment`, `returnFromPortal`, `acceptInvitation`, both harnesses, `PublicDemoControls`, the `AccountStrip` scenario/persona controls, `DemoNotice`, and the `/demo/stripe` stand-in. Replace with Checkout Session creation and redirect; return pages that only *read* status; a signed webhook endpoint as the only writer of `paid`.
3. **Make unknown / processing real.** These are what the return page shows until the webhook lands; "Check status" becomes a real poll; `expired` comes from Stripe session expiry and the approved hold period.
4. **Provisioning truth.** `provisioningState` and `emailState` must reflect actual account creation, first-store provisioning in OwedBook's data model and actual invitation delivery; `attention` needs an operator path. Copy for the partial-failure case already exists (`ActivationView.tsx:118-121`).
5. **Identity and authorization.** Replace the temporary `PortalStaffRole` gate with account-scoped ownership and billing capability from real tables; keep internal superadmin semantics separate. `getSession` must return the real user. Remove the "real account / demo account" strip.
6. **Quotes and prices.** Replace local arithmetic with Stripe-sourced amounts (price, tax, proration preview); drop `isIllustrative` and "illustrative" copy only once commercial rules are approved.
7. **Identifier and uniqueness.** Real server-side uniqueness for whichever identifier is finalised (§9), plus owner-email handling that does not enumerate accounts.
8. **Email.** Real send, rate-limited resend, a delivery-failure signal and the link lifetime; an allowlist and cross-app destination for `/api/auth/confirm` `next`; configure the Supabase redirect allowlist.
9. **Routes and copy.** `/demo/*` paths, mixed titles ("Pharmacy Books" vs "Cyber Pharma — Subscription Portal"), and the bracketed placeholders need final values.
10. **New surfaces for 007B** (none exist): member / admin management, sole-admin recovery, ownership transfer, a resend-invitation service call.
11. **Over-promising copy** to correct or back with real behaviour: "everything saved", "Saved until…", "We also email this link…", "Same sign-in as OwedBook", "you stay signed in".

## 12. Doc-vs-source drift and surprises

1. **Deploy collision risk (highest).** The dev copy ships the feedback deployment's exact deploy config (§4).
2. **Shared Supabase project with OwedBook** (DOCUMENTED CLAIM). That project's ref and publishable key are hard-coded in tracked files: `deploy.sh:18-19`, `stark-deploy.yaml` `public_vars` block, and also appear in `agent_docs/RESPONSES/response_2026-08-01_191842_showcase-security-sweep-part1.md` and `response_2026-11-03_095928_auto-plan.md` (the ref occurs in 6 tracked text files). A publishable key is browser-safe by design; the impact is disclosure of which project the apps share. Values not reproduced.
3. **No secret-key patterns in tracked text files** (OBSERVED: 0 hits for Supabase secret keys, Stripe secret / webhook keys, JWT-shaped strings, PEM private keys). The superadmin credential the 26 Oct recon flagged in `RECOVERY.md` is no longer present. The ~20 review zips under module `EVIDENCE/` and `QAM/HANDOFFS/` were not opened — contents UNKNOWN.
4. **Stripe SDK installed, never imported**; same for zod and react-hook-form (§2).
5. **Docs say deployment "NOT DONE" while a deployment is recorded.** `agent_docs/PROJECT_POINTER.md:7`, module `STATE.md:8`, `RECOVERY.md:8` vs `RECOVERY.md:12-14` and `DEPLOYMENT_CHECKLIST.md`. Accurate reading: deployed to staging for feedback; Gate D (final-URL certification) not done.
6. **`CHANGELOG.md` stops at 30 Oct**; the deploy files and this copy are unrecorded.
7. **Commit references in docs do not resolve here** (§1).
8. **Naming drift.** Repo `cyph-payment-portal-dev-v1`; package `cyph-stripe-subscription-portal-v1`; module "FFM-ABM-001-SUBSCRIPTION-PORTAL"; Cloud Run `cyph-sub-portal-prod`; domain `cyph-payment…`; root title "Cyber Pharma — Subscription Portal"; customer copy "Pharmacy Books"; destination "OwedBook". `README.md` says "The Stripe subscription integrated Cyber Pharma Payment Portal" — there is no Stripe integration.
9. **Dirty lockfile and an installed tree that differs from the tested one**; a `.next` build from 10 Nov 15:25 sits in the copy.
10. **Dangling symlinks tracked in Git:** `agent_docs/.claude/skills/{frontend-design,skill-creator,webapp-testing}` point at Windows-style absolute paths outside the repo (not followed). `session_2026-11-03.md:48` records they crashed the gcloud upload listing until `agent_docs/` was excluded.
11. **Orphans / dead bits:** `src/utils/supabase/admin.ts` and `client.ts` (no importers); `test:integration` targets a missing folder; `lint` uses removed `next lint`; `NEXT_PUBLIC_APP_URL` build arg read by nothing; fossil `STRIPE_PRICE_STARTER/PRO/ENTERPRISE` names; `res.cloudinary.com` image pattern; `PlanView.tsx:112` `value={confirm ? count : count}` (identical branches); `setActivationPlan` cleanup "deferred" (`RECOVERY.md:9`). `components/common/SpinnerLarge.tsx`, `components/global/ThemeToggler.tsx` and some `components/ui/*` look unused — INFERENCE, not traced.
12. **Lineage residue in docs:** June–August RESPONSES and SESSIONS (Mission Control build and deploy), `agent_docs/RECON/RECON_cyber-pharma_phase1_2026-06-28.md`, `agent_docs/STARTER_KIT/*`, `agent_docs/CYBER_PHARMA_8_PHASE_PLAN_v1_2.md` (OwedBook strategic plan; names real people), `agent_docs/SKILLS/CLOUD_DEPLOYMENT_SKILLS`, `SKILL_ISSUES_LEDGER_cloud_deployment.md`. `PROJECT_POINTER.md:14` calls these "lineage, not active instructions". The existing recon `RECON_cyph-subscription-portal_ffm-intake_2026-10-26.md` describes the **pre-FFM** state (repo was Mission Control byte-for-byte; deploy files aimed at Mission Control; credential in RECOVERY.md) — superseded on disk; useful only for its auth-plumbing and design-token observations.
13. **`CLAUDE.md` is a generic factory prompt** with Python / FastAPI / ADK / pytest rules that do not apply here. It says the session file lives in the project root; actual session files are in `agent_docs/SESSIONS/`. `WINDSURF.md` is the older v2.0 sibling without the module pointer.
14. **Forbidden-zone greps (OBSERVED):** one `as any` (`src/utils/supabase/server.ts:6`); no `dangerouslySetInnerHTML`; no role read from `user_metadata`.
15. **Contract ambiguity:** `readActivation(operationId)` ignores its argument; `readOperation` is keyed by `operationKey` although named `operationId`.
16. **Login route returns the full Supabase auth payload** (tokens) to the client (`api/auth/login/route.ts:42-47`).
17. **Volume:** 1,896 of 2,229 tracked files are under `agent_docs/ACTIONS/`; repo-walking tools should exclude `agent_docs/`.

## Open questions for the planning report
1. Which source commit was this copy taken from, and is `src/` byte-identical to the Gate-Q snapshot (`f272617`)?
2. Should the working-copy `package-lock.json` (jest 30.5.2) be committed, or the tested lock restored?
3. Will 007 deploy to a **new** Cloud Run service and domain, leaving `cyph-sub-portal-prod` as the stakeholder mock? The deploy files need retargeting before anyone runs them.
4. Does this copy's `.env.local` point at the Supabase project OwedBook uses? Should 007 use a separate dev project?
5. Who owns schema migrations for accounts / stores / subscriptions — the OwedBook chain? `supabase/*.sql` here should not be run.
6. NPI: replace NCPDP or sit alongside it? Uniqueness scope? Checksum validation? Organisational NPI only?
7. Session model between portal and OwedBook: parent-domain cookie, token handoff, or separate sign-in? What does logout do across apps?
8. Which commercial rules are approved? Recorded as approved today: owner-only registration (Coach) and the access model (Director). Pricing, proration, trial, cancellation, grace, hold period and link lifetime are all placeholders.
9. Is account-level multi-store billing (one subscription, many stores) confirmed by Coach, or still the Director's provisional choice?