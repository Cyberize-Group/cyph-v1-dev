# PRE-APBM007 CROSS-REPOSITORY RECON — 2026-11-10

Recon Engineer: Claudy (Claude Code). Audience: JARVIS (authoring APBM007A/007B), Friday (architecture review), Tony.
Scope: local, read-only inspection of three repositories under `/home/moose/NEXTJS/CYBER_PHARMA`. `ARCHIVE/` was not opened. No application was built, started or tested; no Stripe, Supabase, email or cloud call was made; no real env file was opened.

Evidence labels used throughout:

- **OBSERVED** — seen in source on disk (file:line given). Source inspection is not live proof.
- **DOCUMENTED CLAIM** — a document in the repo says so; not re-verified.
- **INFERENCE** — reasoning from observed evidence.
- **UNKNOWN** — cannot be determined locally.

Repo short names: **OB** = `cyph-v1-dev-recon-only` (OwedBook), **PP** = `cyph-payment-portal-dev-v1` (Payment Portal), **SL** = `nextjs16-supabase-stripe-subscription-2026-v1` (Stripe learning app). Paths are relative to each repo root.

---

## 1. Plain-English summary

1. **The OwedBook checkout is not the APBM003 baseline.** It has no Git history, no APBM record of any kind, and its customer admin portal is an in-memory demo. Its newest record is dated 2026-10-22. Planning 007 against this copy would plan against the wrong code. (F-01)
2. **Nothing on the purchase-to-OwedBook path exists as real code in any of the three repositories.** The Payment Portal is a complete, well-tested mock (no Stripe import, no webhook, no server state). OwedBook has an intended schema for accounts, stores, memberships and subscriptions, but its running app never reads those tables and has no invitation landing, set-password page or provisioning function. The Stripe learning app has real Stripe calls but is built per individual user and has ten previously reported defects, all still present.
3. **The intended OwedBook schema does not yet express the 007 business rules.** Account ownership confers nothing in row-level security, any store member can read the account's subscription, a store admin can rewrite a store's account link and Stripe customer id, and there is no billing-authority concept. These must be settled inside 007A, not left to 007B. (F-04, F-05)
4. **The Payment Portal dev copy can overwrite the stakeholder feedback site.** It carries the same Cloud Run service name, domain and Supabase project as the deployed mock. Running its deploy script would replace what Coach is reviewing. (F-02)
5. **A signup-role hazard sits on the shared login database.** The new-user trigger recorded as installed takes a user's global role from sign-up metadata, and the sign-up switch was last recorded as still on. This must be closed before any invitation or registration flow goes live. (F-03)
6. **Identification and pricing are undecided.** Both apps treat NCPDP as the store identity today; NPI is a secondary field. Every price, proration, trial, cancellation and grace rule in the portal is a placeholder.
7. **The two-module split is workable with four items moved into 007A**: the account-owner/billing-authority model, the invitation landing and set-password flow in OwedBook, the subscription shape that Add Store will later change, and an operator recovery path for a paid-but-locked-out owner. (Section 7)

Nothing was changed in any repository or external system (verified, Section 12).

---

## 2. Repository identity

| | OB — OwedBook | PP — Payment Portal | SL — Stripe learning app |
|---|---|---|---|
| Root | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev-recon-only` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | `/home/moose/NEXTJS/CYBER_PHARMA/nextjs16-supabase-stripe-subscription-2026-v1` |
| Git | **Not a Git repository** (no `.git`) | Git repo | Git repo |
| Remote (sanitized) | none | `github.com/ahmedmusawir/cyph-payment-portal-dev-v1` | `github.com/ahmedmusawir/nextjs16-supabase-stripe-subscription-2026-v1` |
| Branch | n/a | `main` (= `origin/main` as last fetched) | `main` (= `origin/main` as last fetched) |
| HEAD | n/a | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` | `9c2527b46d68cca1cb92ded0f30070da316d3074` |
| History | none; all file times are copy time 2026-11-10 14:49 | 2 commits, both 2026-11-10 (one bulk import of 2,228 files) | 19 commits, last 2026-09-28 |
| Tracked files | n/a (1,288 files on disk) | 2,229 | 313 |
| Working tree | n/a | one modified tracked file: `package-lock.json` (+5872/−3617); no untracked non-ignored files | clean |
| Real env files | none present | `.env.local`, `.env.qa.local` present, ignored (`.gitignore:33`), untracked, **not opened** | none present |
| Installed deps | none (`node_modules` absent) | installed | none |
| Instructions | `CLAUDE.md`, `CLAUDE.eng.md`, `.cursor/rules` | `CLAUDE.md` v3.1, `WINDSURF.md` | `CLAUDE.md` v3.0, `WINDSURF.md` v2.0 |
| Recon skill used | `_SKILLS/stark-recon-skill-v1.1/SKILL.md`, **v1.1** | `agent_docs/SKILLS/stark-recon-skill-v1.1/stark-recon/SKILL.md`, **v1.1** | **none installed** — manual equivalent, using the OB v1.1 skill as method reference only |
| Prior recon on disk | `agent_docs/RECON/RECON_cyber-pharma_phase-3_2026-08-11.md`, `RRM001_RECON_2026-09-18.md` | `agent_docs/RECON/RECON_cyph-subscription-portal_ffm-intake_2026-10-26.md` (describes the pre-FFM state; superseded on disk) | `agent_docs/RECON/2026-09-24_STRIPE_POC_CYBER_PHARMA_RECON.md` |

Notes:

- No `AGENTS.md` exists in the parent folder or any repository. No parent-level `CLAUDE.md` exists. (OBSERVED)
- The skill's rule to write reports into `agent_docs/recon/` was overridden by this assignment; all output is in the parent folder. Skill steps needing a build, install, audit or network were skipped.
- Protected paths named by repo instructions — OB: root `CLAUDE.md`, `CLAUDE.local.md` (absent), `.env.local`, `scripts/`, `agent_docs/`, `_SKILLS/`, `supabase/` (migration chain is read-only "chain law"), Git is Director-only. PP: `.env*.local`, servers on :3000 and :3457, `supabase/` ("Execute nothing from here without an explicit, separate approval", `supabase/README.md:5`), preserved design/evidence bytes under the module folder, Git is Director-only.
- PP has three tracked symlinks under `agent_docs/.claude/skills/` pointing outside the repo. They were not followed.
- Local tooling (OBSERVED): Node v22.17.0, npm 11.15.0, `gcloud` and `docker` on PATH. **Stripe CLI and Supabase CLI are not on PATH.** No process was listening on ports 3000–3003, 4242, 5432, 8080 or 54321–54323 at inspection time.

### Runtime and dependency versions

| Package | OB declared → locked | PP declared → locked (HEAD) → installed | SL declared → locked |
|---|---|---|---|
| next | 16.3.7 → 16.3.7 | ^16.2.1 → 16.4.3 → 16.4.3 | ^16.2.1 → 16.3.6 |
| react | ^19.2.4 → 19.2.4 | ^19.2.4 → 19.2.4 → 19.2.4 | ^19.2.4 → 19.2.4 |
| @supabase/supabase-js | ^2.44.0 → 2.106.1 | ^2.44.0 → 2.106.1 → 2.106.1 | ^2.44.0 → 2.106.1 |
| @supabase/ssr | ^0.6.1 → 0.6.1 | ^0.6.1 → 0.6.1 → 0.6.1 | ^0.6.1 → 0.6.1 |
| stripe | absent (removed on purpose) | ^22.1.0 → present → 22.1.0, **zero imports** | ^22.1.0 → 22.1.0 |
| typescript | ^5 → 5.5.4 | ^5 → 5.5.4 → 5.5.4 | ^5 → 5.5.4 |
| jest | ^30.0.5 → 30.4.2 | ^30.0.5 → 30.4.2 → **30.5.2** | ^30.0.5 → 30.0.5 |
| @playwright/test | ^1.59.1 → 1.59.1 (no config or specs) | ^1.59.1 → 1.59.1 → 1.59.1 | ^1.59.1 → 1.59.1 |
| zod | ^3.23.8 → 3.23.8 | ^3.23.8 → 3.25.76 (zero imports) | ^3.23.8 → 3.23.8 |

- No repository declares `engines` or `.nvmrc`. PP's `Dockerfile` pins `node:22-alpine`. OB docs name Node 22.14.0 as the verified runtime (DOCUMENTED CLAIM, `vibe_docs/GUEST_AI_RULES.md:53`).
- PP's installed tree matches its **dirty** lockfile, not the committed one. The only direct dependencies that moved are jest (30.4.2 → 30.5.2) and ts-jest (29.4.11 → 29.4.15). INFERENCE: a plain `npm install` ran in the copy at about 15:25 today, before this recon started. The recorded FFM test evidence was produced on jest 30.4.x.
- SL: a ledger claims React was fixed to 19.2.6 (`RECOVERY.md:22-23`); the lockfile has 19.2.4.

### Test and build commands, and existing evidence (none were run)

| Repo | Commands | External prerequisites | Inherited evidence (not a fresh run) |
|---|---|---|---|
| OB | `dev`, `build`, `start`, `lint` (eslint), `test` (jest), `test:e2e` (no config), `db:reset/apply/inventory/verify`, `rls:prove`, `audit:prove` | DB scripts need a direct Postgres URL; the RLS/audit harness drops the `public` schema and purges every `auth.users` row on its target (`RUN_NOTES.md:3`) | 36 test files; last recorded "jest 34/164/0"; 14 tests added 2026-10-14 with no recorded total |
| PP | `dev`, `build`, `start`, `typecheck`, `test` (jest), `test:e2e` (playwright), `lint` (`next lint`, removed in Next 16), `test:integration` (targets a folder that does not exist) | Jest needs nothing live. E2E needs an owned `next start` on :3001; the `account` project performs a **real Supabase login** from `.env.qa.local`; the logout spec is a global sign-out | REPAIR_006: build 0, tsc 0, Jest 248/248, public e2e 156/156; Gate Q PASS with one accepted failed assertion (R5-O03) and the OwedBook reference screen out of scope (`RECOVERY.md:36-37`) |
| SL | `dev`, `build`, `start`, `lint` (`next lint`), `test`, `test:integration`, `test:e2e` | E2E helpers use the service-role key against whatever `.env.local` points at and create real auth users (`e2e/helpers/supabase-admin.ts:6-13`) | Prior recon claims 118 Jest tests passed; a static count finds 112 `it(`/`test(` calls in 15 suites; 18 Playwright cases, none touching Stripe |

### Deployment, env names, ports and URLs

| | OB | PP | SL |
|---|---|---|---|
| Deploy artifacts | none (no Dockerfile, cloudbuild or workflows); `next.config.js` sets `output: "standalone"` | `Dockerfile`, `cloudbuild.yaml`, `deploy.sh`, `init-app.sh`, `stark-deploy.yaml`, `DEPLOYMENT_CHECKLIST.md` | none |
| Target | n/a | GCP project `cyberize-nextjs-staging`, region `us-east1`, Cloud Run `cyph-sub-portal-prod`, domain `cyph-payment.cyberizedev.com` (`deploy.sh:11-20`) | docs describe Cloud Run (claim only) |
| Env names read by code | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, optional `SUPABASE_SECRET_KEY` | same four (the secret key is read only by an unimported module) | those four plus `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ENTERPRISE`, `NEXT_PUBLIC_API_BASE_URL` |
| Env names, other | scripts: `DB_URL`, `DB_RESET_ALLOW`, `RLS_HARNESS_PREFIX`, `PROTO06_DB_URL`, `<PREFIX>_DB_URL/_SUPABASE_URL/_PUBLISHABLE_KEY/_SECRET_KEY` | tests: `PORTAL_BASE_URL`, `PORTAL_ALLOW_LOGOUT`, `QA_PORTAL_ADMIN_EMAIL`, `QA_PORTAL_ADMIN_PASSWORD`. Stripe names exist only as comments in `.env.example:21-27` and are fossils, not a catalogue | no `.env.example` exists; the listener script passes `STRIPE_API_KEY` to the CLI child |
| Local port | 3000 | 3000 (dev), 3001 (e2e), container 3000 | 3000, hard-coded in the listener script and tests |
| Site URL use | cookie `secure` flag only (`src/utils/supabase/server.ts:7-8`) | cookie `secure` flag only | cookie `secure` flag only; Stripe return URLs come from the request origin |

### Shared database and auth risks to the FFM feedback deployment

- **DOCUMENTED CLAIM**: a feedback deployment is live — Cloud Run `cyph-sub-portal-prod`, deployed 2026-11-03, public, "Not Gate D" (PP `DEPLOYMENT_CHECKLIST.md`; `agent_docs/RESPONSES/response_2026-11-03_101856_deploy-result.md`). Whether it is up today is UNKNOWN.
- **OBSERVED**: PP's dev copy holds the identical deploy configuration. Nothing separates "dev copy" from "feedback site". (F-02)
- **DOCUMENTED CLAIM**: the feedback deployment's Supabase project is the one used by the deployed OwedBook (`cyber-pharma-prod`) and Mission Control (PP `agent_docs/SESSIONS/session_2026-11-03.md:40,48,70`). One `auth.users` and one `user_roles` set serve all three.
- **OBSERVED** (new): the Supabase project that the OB checkout's CLI was linked to (`supabase/.temp/linked-project.json`) is **not** the project hard-coded in PP's `deploy.sh`. Only a same/different comparison was made; neither identifier is reproduced here. INFERENCE: the OB link points at a scratch or rig project. Which project each app's real env points at is UNKNOWN.
- **INFERENCE**: any migration, trigger change, auth setting (redirect allowlist, email template, site URL, sign-up switch) or seeded user applied to the shared project affects the feedback site, OwedBook and Mission Control together. PP's logout is a global sign-out and would end the same user's OwedBook sessions.
- **OBSERVED**: the project reference and publishable key are hard-coded in tracked PP files (`deploy.sh:18-19`, `stark-deploy.yaml` public vars, and four documents). A publishable key is browser-safe by design; the impact is disclosure of which project is shared. No secret-key pattern was found in tracked text files of any repository.

---

## 3. OwedBook findings

### 3.1 Is APBM003 in this checkout? No.

| Finding | Label | Evidence |
|---|---|---|
| No `APBM-00N`/`APBM00N` identifier in any file. The single text hit is "Future QAM/ABM/APBM pre-provisioning" | OBSERVED | `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA/ONE_SHOT_QA_OBSERVATIONS.md:15` |
| `agent_docs/ACTIONS/` holds only BIM-000…003, FIX-001, PROTO06, RRM-001…004 | OBSERVED | directory listing |
| Newest CHANGELOG entry, session and response are all 2026-10-22 (guest contribution kit) | OBSERVED | `CHANGELOG.md:6-10` |
| The customer admin portal is an in-memory demo; every service body reads or mutates a Zustand store | OBSERVED | `src/services/adminDemo.ts:13-31`; `src/store/useAdminDemoStore.ts:12-15` |
| No pagination exists in admin-portal code, so no pagination repair either | OBSERVED | pagination appears only in the ledger mock, `src/services/owedbook.ts:20-24` |
| No receipt for APBM003 acceptance or its Git integration is present | OBSERVED | absence |
| This tree predates APBM003 or comes from a lineage that never received it | INFERENCE | rows above |
| Which commit this copy corresponds to | UNKNOWN | no `.git`; docs name `764e396`, `697d8f3`, `a474a19` as the latest |

APBM003's accepted closeout is not questioned here. The point is only that this directory does not contain it.

### 3.2 Migration chain and data model (intended schema)

- **Canonical chain**: `supabase/migrations/0001…0047` (47 files), replayed in filename order by `scripts/db-reset.mjs:22,49-51`. There is no migration-tracking table; each file guards itself and refuses a re-run. (OBSERVED)
- **Superseded, do not run**: `supabase/setup.sql`, `docs/setup.sql`, `docs/migration_add_profiles.sql` (banner on line 1 of each). `scripts/db-bootstrap-baseline.sql` reproduces the pre-chain baseline for scratch use only.
- **Installed state**: docs say the dev backend stays at its two-table baseline (`user_roles`, `profiles`) until a named "Phase 3 APPLY SESSION" (`agent_docs/AUTHORITY/PHASE_3_BIM_CAMPAIGN_MAP.md:29`). No record shows that session happened. Whether `accounts`, `businesses` and the rest exist on any live project is **UNKNOWN**.

Chain outline: 0001 baseline acknowledgement · 0002–0015 tables · 0016 RLS helpers · 0017–0027 policies · 0028–0030 audit log and `audit_write()` · 0031–0043 audit triggers on 13 tables · 0044–0047 audited OwedBook read functions.

| Table | Key facts (OBSERVED) | Evidence |
|---|---|---|
| `accounts` | `name NOT NULL`, `owner_user_id NOT NULL → auth.users` with no ON DELETE action. No uniqueness on owner or name. No status, billing or Stripe column | `0002_accounts.sql:5-11` |
| `businesses` (the store) | `account_id NOT NULL`; `ncpdp` and `npi` both `text NOT NULL`; `UNIQUE (ncpdp, npi)`; `status` pending/active/suspended, default pending; `pharmacy_slug` and `activation_key` unique; `stripe_customer_id` and `has_used_trial` live here | `0003_businesses.sql:17-19,45-52` |
| `user_businesses` (membership) | `role` text with CHECK `admin`/`member`; `UNIQUE (user_id, business_id)`; `is_primary` with no DB constraint; no member status column | `0004:11-21` |
| `subscriptions` | account-scoped, deliberately no store link; `stripe_subscription_id UNIQUE`; `stripe_checkout_session_id` not unique; status CHECK active/trialing/past_due/canceled/unpaid/incomplete; no uniqueness on `account_id`; no quantity or price columns | `0006:9-22` |
| `pending_registrations` | legacy manual-verification table; `UNIQUE (email, ncpdp, npi)`; RLS on with no policy; no account or Stripe session column | `0005:7-45` |
| Baseline `user_roles` | one global role per user, enum `app_role ('superadmin','admin','member')`, `UNIQUE (user_id)` | `scripts/db-bootstrap-baseline.sql:15-32` |

**Absent**: invitations, account-member or account-role table, billing-authority record, Stripe event or idempotency table, ownership-transfer or recovery table, any provisioning function. (OBSERVED across all 47 files and `src/types/supabase.ts`.)

### 3.3 Ownership helpers, RLS, audit and trusted writes

- Helpers (`0016_rls_helpers.sql`): `is_member_of`, `is_admin_of`, `my_business_ids`, `is_account_member`. All are SECURITY DEFINER and read the membership junction only.
- Stated law (`0016:4-7`, OBSERVED): "No helper or policy consults user_roles, profiles, user_metadata, raw_user_meta_data, or accounts.owner_user_id. No superadmin clause exists in OwedBook — platform oversight is the service-role path".
- There is **no** `is_superadmin`, account-owner or billing-authority helper.

| Table | Policy | Effect |
|---|---|---|
| `accounts` | SELECT if `is_account_member(id)` (`0018:16-18`) | any member of any store under the account can read the account row |
| `subscriptions` | SELECT if `is_account_member(account_id)` (`0020:14-16`) | any store member can read subscription state; the file notes Phase 7 "may tighten this to admin-only … NOT decided" |
| `businesses` | SELECT for members; UPDATE if `is_admin_of(id)` with no column restriction (`0019:23-30`) | a store admin can change `account_id`, `status`, `stripe_customer_id`, `ncpdp`, `npi` |
| `user_businesses` | SELECT own row only (`0017:19-21`) | a store admin cannot list other members of the store |
| `accounts`, `subscriptions`, `user_businesses` | no write policy | service role only |
| `audit_logs` | SELECT if `is_admin_of(business_id)` | account- and subscription-level audit rows (NULL business) are visible to no tenant |

Consequences for 007 (INFERENCE):

1. An owner with no `user_businesses` row can read nothing — ownership confers nothing at the database level.
2. "Store admins/members do not automatically gain billing authority" is not expressible today: read access to billing state is granted to every member, and there is no notion of who may manage billing.
3. A store admin's unrestricted UPDATE on `businesses` becomes a real exposure once real account links and Stripe customer ids are stored.

Audit: write triggers cover 13 tables including `accounts`, `businesses`, `user_businesses`, `subscriptions`. `audit_logs` is append-only for every role including the service role (`0028:63-87`). The action vocabulary is `insert/update/delete/read_page` only (`0028:51`) — no business events such as "payment verified" or "ownership transferred". Only the four OwedBook read functions are audited reads.

Trusted write boundary: the single service-role factory `src/utils/supabase/admin.ts:20-34` has **zero consumers** and is documented as fenced to seeding and system jobs. The app's only real writes are login, logout and password update. The only table the app queries is `user_roles`; there is no `.rpc(` call anywhere in `src/`. (OBSERVED)

### 3.4 Admin screens and controls

The gate on `/admin-portal/*` is real (`src/app/(admin)/layout.tsx:13-15`, global role `admin`). Everything behind it is mock, carries a "Demo · mock data" pill, and resets on refresh.

| Screen or control | Status | Evidence |
|---|---|---|
| My Stores list, search, counts | MOCK read | `services/adminDemo.ts:136-141` |
| Add store dialog (name, NCPDP, NPI, address) | MOCK write; typed values are discarded; no payment | `AddStoreButton.tsx:20-24,38` |
| Store detail and member roster | MOCK read | `StoreDetailScreen.tsx:33-34` |
| Member actions: recovery, suspend, unsuspend, resend invite | MOCK write (in-memory or toast) | `MemberRow.tsx:68-97` |
| Invite member form (role hard-coded `member`) | MOCK write; no email, no auth user | `InviteMemberForm.tsx:33-36,54-59` |
| Billing page; Manage payment; Cancel subscription | MOCK; billing is modelled **per store**, unlike the account-scoped schema | `BillingRow.tsx:55,63`; `types/adminDemo.ts:71-80` |
| Settings; Audit page | MOCK (audit reads in-memory entries, not `audit_logs`) | `services/adminDemo.ts:101-103` |
| Change member role, promote to admin, remove member | ABSENT | — |
| Ownership transfer, sole-admin recovery | ABSENT | — |
| Account-level screen; store switcher | ABSENT | no `business_id` selection anywhere in `src` |
| Superadmin screens | ABSENT; superadmins are sent to `/access-denied` | `src/app/(public)/access-denied/page.tsx:20-23` |
| Registration / sign-up | ABSENT (removed in RRM-001) | `docs/AUTHENTICATION.md:57-59` |
| `/owedbook` ledger | MOCK read; Upload and Refresh fake success | `src/services/owedbook.ts:9,40-52` |
| `/profile` identity and change password | REAL read and REAL write | `ProfileForm.tsx:48,57-58` |
| Login, logout | REAL | `src/app/api/auth/login/route.ts`, `logout/route.ts` |

No control is in an "unavailable/disabled" state; the class is empty.

### 3.5 Integration points for newly provisioned stores and users

- No app path creates users, accounts, stores or memberships. The only worked example is the rig seed (`scripts/rls-harness/seed.mjs:62-88`): create auth user → insert `accounts` → `businesses` → `user_businesses` → `subscriptions`. (OBSERVED)
- To log in today a user needs only an `auth.users` row with a password and a `user_roles` row of `admin` or `member`. The running app never reads `user_businesses`, `businesses` or `accounts`, so "reaching your store" is not yet a concept in the code.
- What a provisioning service would have to write against the intended schema (INFERENCE): auth user (trigger adds `user_roles` and `profiles`) → raise `user_roles.role` if the owner needs the admin portal → `accounts` (owner must already exist) → `businesses` (NCPDP and NPI both required today) → `user_businesses` with role `admin` (without it the owner sees nothing) → `subscriptions`. There is no transaction wrapper and no function for this.
- Unique guards usable for idempotency: `subscriptions.stripe_subscription_id`, `businesses (ncpdp, npi)`, `user_businesses (user_id, business_id)`, `user_roles (user_id)`. `accounts` has no natural unique key and `stripe_checkout_session_id` is not unique.
- **Hazard**: the baseline `handle_new_user()` takes the global role from `raw_user_meta_data->>'role'` and casts it to the role enum (`scripts/db-bootstrap-baseline.sql:76-80`, confirmed on disk). It was recorded as installed on dev on 2026-09-20 (DOCUMENTED CLAIM, `agent_docs/DB_BASELINE.md`). Its permanent fix (BIM-004 rider CE-2) is unbuilt, and the Supabase "allow new users to sign up" switch was "still NOT YET" off on 2026-10-02 (`agent_docs/RRM_CAMPAIGN_MAP_v1_0.md:29`). (F-03)

### 3.6 NPI and NCPDP today

| Where | What | Evidence |
|---|---|---|
| `businesses` | both `text NOT NULL`; uniqueness is the **pair** `(ncpdp, npi)`; neither is unique alone | `0003:18-19,52` |
| `businesses.has_used_trial` | described as the "one-trial-per-NCPDP+NPI anti-abuse flag" | `0003:11-12` |
| `pending_registrations` | both NOT NULL; `UNIQUE (email, ncpdp, npi)` | `0005:9-10,44` |
| Validation | no CHECK on length, digits or check digit in any migration; no zod schema | absence |
| UI | Add-store inputs "NCPDP" and "NPI", free text, discarded; store card shows "NCPDP … · n members" | `AddStoreButton.tsx:81-93`; `StoreCard.tsx:25` |
| Tests and rig | one unit test pins both labels; seeds and verifier assume both columns | `AddStoreButton.test.tsx:49-53`; `scripts/db-verify.mjs:37` |

No replacement schema is proposed here.

### 3.7 Auth, session and roles

- User is always read with `supabase.auth.getUser()` on the server. Role comes from `public.user_roles` only (`src/utils/get-user-role.ts:16-20`); never from user metadata.
- **Two disconnected role systems** (OBSERVED): page gates use the global `user_roles` enum; RLS uses the per-store `user_businesses.role`. The app never reads the second.
- `src/proxy.ts` only refreshes the session; it never redirects (`src/utils/supabase/middleware.ts:36-37,52`).
- Cookies: Supabase defaults, `sameSite: lax`, `httpOnly: false`, `secure` when the site URL is https, **no `domain`** → host-only (`src/utils/supabase/server.ts:19-27`). A second app on another host cannot see this session.
- Login is password-only, redirects to a hard-coded `/owedbook`, and has no `next` support (`src/store/useAuthStore.ts:26-53`). The login API returns the full Supabase session object in its JSON body (`login/route.ts:42-47`).
- Logout: `signOut()` then client push to `/auth`.
- Email links: `GET /api/auth/confirm` runs `verifyOtp` for whatever type the link carries and redirects to a same-origin `next` (default `/`) with no allowlist (`confirm/route.ts:6-33`). There is no `/auth/callback`, **no set-password page for an invited user**, and no forgot-password flow. After a successful confirm with the default `next`, the user lands signed in on the public home page.
- Nothing supports cross-app login: no shared cookie domain, hand-off route, token exchange or allowed-origin list.

### 3.8 Open follow-ups recorded in OB that bear on 007

| Item | Source |
|---|---|
| `handle_new_user` permanent correction (BIM-004 rider CE-2), not built | `RRM_CAMPAIGN_MAP_v1_0.md`; ledger R-014 |
| Supabase sign-up switch OFF (DA-2), not done as of 2026-10-02 | `RRM_CAMPAIGN_MAP_v1_0.md:29` |
| Phase 3 APPLY SESSION (apply the chain to the dev backend), no record | `PHASE_3_BIM_CAMPAIGN_MAP.md:29` |
| BIM-004 seed factory and BIM-005 service swap, not started | `RRM_CAMPAIGN_MAP_v1_0.md:29` |
| Subscriptions read policy may tighten to admin-only, undecided | `0020_rls_subscriptions.sql:3` |
| V1 "one admin = the owner; second admins only via Mission Control" conflicts with 007B member management | `agent_docs/phase2.md:45`; `InviteMemberForm.tsx:28-31` |
| KIP-1: cookie adapter in `server.ts` must be modernised whenever that file is touched | `agent_docs/KIP_REGISTRY.md` |
| E-16: `protectPage` is callable as a Server Action | findings ledger |
| R-016: components cannot support a service-only swap (no error or invalidation states) | findings ledger |
| `accounts.owner_user_id` has no ON DELETE action; blocks auth-user deletion and matters for ownership transfer | `scripts/rls-harness/seed.mjs:36-41` |

### 3.9 Documentation drift in OB

- `docs/AUTHORIZATION.md:231` still describes superadmin access; no superadmin surface exists.
- Mock billing is per store; the schema is per account. Mock status vocabularies differ from the schema's.
- `businesses.stripe_customer_id` and `subscriptions.stripe_customer_id` both exist — two candidate homes for the Stripe customer.
- Decision D1 said password recovery is preserved; only password update exists.
- `src/types/supabase.ts` (generated types) is imported by nothing.

---

## 4. Payment Portal findings

### 4.1 Relation to the FFM

- Two commits, both today: an initial README commit and one bulk import of the whole tree. **No Git ancestry to the FFM repository**; none of the commits the documents cite (`f272617`, `abbbcc8`, `d6fe678` and others) resolves here. (OBSERVED)
- The Gate-Q-passed snapshot is bound to source commit `f272617…` and the deployment was built from source `main @ abbbcc8` plus uncommitted deploy files (DOCUMENTED CLAIM, `RECOVERY.md:4-7`, `DEPLOYMENT_CHECKLIST.md:20`).
- Which source commit this copy was taken from is **UNKNOWN**. INFERENCE: the source working tree at or after the 2026-11-03 deploy, because the deploy files are tracked here. Byte-equality with the Gate-Q snapshot was not proven; a retained helper and a 168-input manifest hash exist for that purpose and were not run.
- Package name is still `cyph-stripe-subscription-portal-v1`. `CHANGELOG.md` stops at 2026-10-30. Of 2,229 tracked files, 1,896 are module records under `agent_docs/ACTIONS/`.

### 4.2 Routes and services

Routes (OBSERVED, `src/app`): `/` redirects to `/demo/register/plan`. Public group: `demo/register/{plan,owner,pharmacies,review}`, `demo/activation`, `demo/checkout-incomplete`, `demo/access-link`, `demo/references/email`. Hand-off group: `demo/stripe` (a stand-in for Stripe Checkout and the Billing Portal). Account group (login-gated): `dashboard`, `demo/stores/{add,confirm,result}`, `demo/references/owedbook`. Real: `/login` and `api/auth/{login,logout,confirm}`. **There is no webhook route, no checkout or billing endpoint and no Server Action.**

Service layer: `src/services/portal/` holds two pure engines (`registration.ts`, 958 lines; `account.ts`, 553 lines) behind client facades. State lives in per-tab `sessionStorage` (zustand persist). Every call has a fixed 350 ms delay; there are no random failures — each failure is scripted by a scenario or counter. The async contract is `PortalServices` in `src/types/portal/contract.ts:90-106`.

### 4.3 States defined

| Domain | States | Defined at |
|---|---|---|
| Registration draft | editing, ready_for_checkout, checkout_pending, payment_confirmed, provisioning, access_email_ready, abandoned | `contract.ts:34` |
| Checkout record | pending, declined, abandoned, unknown, expired, paid | `state.ts:52-84` |
| Activation | payment pending/confirmed/failed/unknown; provisioning not_started/pending/ready/attention; email not_started/pending/sent/failed | `contract.ts:61-66` |
| Subscription | pending, active, past_due, cancel_scheduled, canceled | `contract.ts:6,40-44` |
| Store | draft, payment_pending, provisioning, active, attention | `contract.ts:7` |
| Invitation | not_required, pending, accepted, expired, held; delivery not_sent/pending/sent/failed | `contract.ts:8,67-70` |
| Add-store operation | pending, unknown, failed, paid_provisioning, attention, succeeded | `contract.ts:83-86` |
| Capabilities | canViewBilling, canManageBilling, canAddStore; personas prospective_owner, billing_owner, store_admin, member | `contract.ts:5,10` |

These vocabularies differ from OB's schema (for example `cancel_scheduled` versus a `cancel_at_period_end` flag; store `draft/payment_pending/provisioning/attention` versus `pending/active/suspended`). A mapping is needed in the interface contract.

### 4.4 Mocked functions and where real calls must connect

| Mock function (facade → engine line) | Real call it stands for |
|---|---|
| `saveOwner` (`registration.ts:430`) | owner email / existing-account check that must not reveal whether an account exists |
| `savePharmacy` (`:441`) | server-side uniqueness check on the agreed pharmacy identifier |
| `requestQuote` (`:565`) | server-computed price from Stripe (price, tax, proration) |
| `applyCode` (`:603`) | Stripe promotion-code validation |
| `setConsents` (`:620`) | server record of consent (document version, time, quote) |
| `startCheckout` (`:649`) | create Stripe Checkout Session with the operation key as idempotency key; redirect |
| `resolveCheckout`, `resolveUnknownPayment` (`:699`, `:740`) | **no production equivalent** — a reviewer button decides the outcome. Replaced by Stripe's hosted page, return URLs and a signed webhook |
| `readActivation`, `refreshActivation` (`:803`, `:816`) | status read / poll of payment, provisioning and invitation; `readActivation` ignores its id argument today |
| `resendAccessEmail` (`:857`) | real, rate-limited resend of the invitation or magic link; today nothing is sent |
| `useAccessLink`, `requestNewAccessLink` (`:938`, `:944`) | token verification and redirect into OwedBook; today no navigation happens |
| `getSession` (`account.ts:155`) | real user → account → billing capabilities; today it returns a synthetic persona |
| `loadAccount` (`account.ts:218-227`) | read the billing account, stores and invitations |
| `requestQuote` for Add Store (`account.ts:295`) | Stripe upcoming-invoice / proration preview |
| `confirmAddStore` (`account.ts:386`) | idempotent subscription change, then store provisioning and invitation |
| `openBillingPreview`, `returnFromPortal`, `refreshAfterHandoff` (`account.ts:508-529`) | Stripe Billing Portal session; re-read of webhook-synced state on return |
| Dashboard "Resend invitation" (`DashboardView.tsx:185-190`) | toast only — needs a new service function |

Both demo harnesses, the reviewer outcome controls and the `/demo/stripe` stand-in must be removed at integration.

### 4.5 Login guards and inherited role assumptions

- `src/proxy.ts` only refreshes the session. The account layout and every account page call a real guard (`src/app/(account)/layout.tsx:18-19`).
- The guard admits `user_roles.role` of `admin` or `superadmin` and denies `member` (`src/services/auth/access.ts:11`). This is an explicitly **temporary** Director ruling (R-008). `src/types/auth.ts:6-7` says customer-facing authorization "will be specified later and replaces this type".
- INFERENCE: today a real paying owner could enter only with a global `admin` row, which conflates store-admin role with billing authority — the opposite of the stated rule.
- `supabase/setup.sql` and `supabase/migration_add_profiles.sql` are unverified starter-kit SQL that conflict with each other and redefine `app_role`, `user_roles`, `profiles` and the `auth.users` trigger. They are not a migration chain. Run against the shared project they would fail on creates and silently replace the new-user trigger. (F-10)

### 4.6 Pending, duplicate-click, retry, saved-state and email-failure behaviour

| Area | What the mock does well (OBSERVED) | What is not real |
|---|---|---|
| Duplicate click | one operation key per attempt; same key returns the same hand-off; a second key while pending is refused; a closed checkout's key is spent forever (`registration.ts:657-668`); add-store change applies exactly once (`account.ts:349-350,394-397`) | enforced only in one browser tab's storage; no server-side idempotency |
| Pending / unknown payment | separate "processing" and "unknown" phases; a submitted payment cannot be closed, replayed or restarted (`registration.ts:244-254,764-778`); "Please don't pay again" copy; payment bound to the quoted scope | the outcome itself is chosen by a reviewer button; no session id, return-URL handling, webhook or poll |
| Retry | quote retry, account-load retry, portal hand-off retry, resume after decline with a new quote, consents and key | every retry succeeds once its scripted failure count is used |
| Saved state | survives reload in the same tab; deep links fall back to the first incomplete step | lost on tab close, new tab or other device, while copy promises "everything saved", "Saved until [HOLD PERIOD TBD]" and an emailed resume link (`CheckoutStandIn.tsx:156`; `CheckoutIncompleteView.tsx:102,147`) |
| Email failure | distinct state: paid and set up, email failed, resend offered only then (`registration.ts:857-864`; `ActivationView.tsx:272-273`) | resend always succeeds and sends nothing; no delivery signal, bounce handling or rate limit; correcting a wrong address is unsupported (`ActivationView.tsx:326`) |

The stand-in states the intended rule in copy only: "Access is never granted from the browser return alone; the real app waits for Stripe's signed payment confirmation before provisioning" (`CheckoutStandIn.tsx:218`).

### 4.7 Fields, identifiers and commercial rules

- Owner: first/last name, work email, mobile (≥10 digits), owner declaration checkbox (must be true), optional legal business name (`validation.ts:22-34`).
- Pharmacy (registration and Add Store share one form): name, street, city, state, 5-digit ZIP, **NCPDP exactly 7 digits (required)**, **NPI exactly 10 digits (required, no check-digit test)**, store phone, pharmacy software (Liberty / Pioneer / Other), store admin ("Me" or another person) (`validation.ts:50-69`, confirmed on disk).
- There are no zod schemas; validation is hand-written.
- **Identity and uniqueness are NCPDP-only** (`registration.ts:452-460`; `account.ts:280-287`). NPI is dropped from the account model after registration and never checked for uniqueness. Frank's NPI request is not recorded anywhere in this repository.
- Change surface for an identifier switch: `validation.ts:58-61`; `registration.ts:452-460,473`; `account.ts:280-287,358,447`; `contract.ts:27,46`; `state.ts:142`; fixtures; `PharmacyFields.tsx:109-119`; two Jest suites; the duplicate e2e specs; and three contract documents.

| Commercial rule | Value and location | Status |
|---|---|---|
| Plan | single "Standard", monthly, one store included (`fixtures.ts:9-18`) | marked `provisional` |
| Base price / additional store | 9900 / 4900 cents (`pricing.ts:5-6`, confirmed on disk) | placeholder ("illustrative engineering fixtures", `DATA_CONTRACT.md:127`) |
| Add-store due now | fixed 2450 cents (`pricing.ts:7`) | placeholder; "[PRORATION RULE TBD]" |
| Promo code | `DEMO10`, −1000 cents (`pricing.ts:8-9`) | demo only |
| Quote lifetime | 30 minutes (`pricing.ts:10`) | engineering default |
| Tax, trial, cancellation, grace, refunds, hold period, link lifetime, ownership transfer | bracketed `[… TBD]` placeholders throughout | open |
| Add Store paused while past due or cancel-scheduled | `account.ts:229-249` | proposed demo rule, not approved |

Recorded as stakeholder-approved (DOCUMENTED CLAIM, module `RULINGS.md`): owner-only registration with an owner declaration (Coach approved, R-011); one store admin per store, and appointing someone else transfers no ownership or billing right; public registration with account management behind login (Director, R-009). Still provisional: account-level multi-store billing — a Director decision that Coach has not confirmed (`APP_BRIEF.md:100`).

### 4.8 Cross-app links, redirects, cookies

- **No real link to OwedBook exists.** There is no OwedBook URL or env name; every "OwedBook" control goes to an internal stand-in (`DashboardView.tsx:131,158,194`). The reference screen carries "[SSO — not proven by this design]" (`OwedBookReferenceView.tsx:107`).
- `/api/auth/confirm` accepts any internal `next` path with no allowlist and cannot express a landing in another app (`route.ts:10-13`). Login always lands on `/dashboard`. No `redirectTo`/`emailRedirectTo` is passed to Supabase anywhere.
- Cookies are host-only, same settings as OB. Login copy says "Same sign-in as OwedBook" (`LoginPageContent.tsx:78`) — true only as shared credentials, not single sign-on.
- The Supabase redirect allowlist for the portal domain is recorded as deferred (`DEPLOYMENT_CHECKLIST.md`).

### 4.9 Reusable design and tests

Reusable: the design system and shared portal components; every screen with its state copy; the state-machine rules (operation keys, quote bound to draft revision, consents cleared on change, immutable checkout scope, "checkout record governs", invitation held until provisioning completes, neutral responses); `contract.ts` as a draft API contract; the three engine test suites as an executable specification; `test-results/transition-matrix.json` as a compact oracle.

Needed to make states truthful: move all state to server records; make the signed webhook the only writer of "paid"; turn "processing/unknown" into what the return page shows until the webhook lands; make provisioning and email states reflect real work; replace the temporary staff gate with account-scoped capabilities; source prices from Stripe; correct the over-promising copy listed in 4.6.

---

## 5. Stripe learning-app findings and reuse matrix

### 5.1 Reconciliation with the 2026-09-24 recon

The HEAD commit changed only the recon report, the listener script and the lockfile; no application source changed. **Every prior finding is still present.** No subscriptions playbook exists in this repository; the nearest document is `docs/SUBSCRIPTION_SYSTEM.md`.

| Prior | What it was | Status now | Current evidence |
|---|---|---|---|
| R1 (P0) | privileged Server Actions lack authorization | STILL PRESENT (confirmed on disk: no `getUser` or role check before `createAdminClient()`) | `(admin)/admin-portal/actions.ts:23,91,122,157,173`; `(superadmin)/superadmin-portal/actions.ts:23,91,126,167,211` |
| R2 (P1) | webhook acknowledges failures with 200 | STILL PRESENT (confirmed: "Always return 200 to prevent Stripe retries") | `api/webhooks/stripe/route.ts:129-134` |
| R3 (P1) | no API-version pin; payload shape depends on event version | STILL PRESENT; actual versions cannot be told locally | `src/lib/stripe/stripe.ts:3-5`; `route.ts:82,96-97` |
| R4 (P1) | no event ledger, no idempotency keys, duplicate checkout possible | STILL PRESENT | `api/checkout/route.ts:49,57,73,100` |
| R5 (P1) | schema not reproducible; trigger drift | STILL PRESENT; live database cannot be told | `supabase/setup.sql`; `docs/DATABASE_SCHEMA.md:397-445` |
| R6 (P1) | only `active` grants access | STILL PRESENT | `src/services/userService.ts:32`; `subscriptionService.ts:71` |
| R7 (P1) | user deletion not coordinated with Stripe | STILL PRESENT | `admin-portal/actions.ts:157-168` |
| R8 (P2) | checkout error leaves the button loading | STILL PRESENT | `components/subscriptions/PlanCard.tsx:25-36` |
| R9 (P2) | unvalidated price map; optimistic success page | STILL PRESENT | `lib/stripe/tierResolver.ts:3-16`; `SubscribeSuccessContent.tsx:41,147-153` |
| R10 | unauthenticated echo route; client-readable cookies; no `server-only` | STILL PRESENT | `api/ghl/hooktest/route.ts:10-19`; `utils/supabase/server.ts:25` |
| Ledger #5 | payment bypass | still fixed in inspected paths | `userService.ts:32` |
| Ledger #6 | paid tier written before payment | STILL PRESENT | `api/checkout/route.ts:79-87` |

New since that report:

- **N1** (INFERENCE, high impact if true): `docs/STARTER KIT DOCS/migration_add_profiles.sql:82-87` defines a trigger taking `role` from sign-up metadata, and app comments assume it is live (`superadmin-portal/actions.ts:157-158`). Same pattern as OB's F-03.
- **N2**: only `active` is special-cased at checkout, so a `past_due` or `trialing` subscriber is sent to a new Checkout Session and can acquire a second subscription (`api/checkout/route.ts:49`).
- **N3**: the proposed status CHECK omits `paused` and `incomplete_expired`, which the webhook writes raw; with always-200 those updates would be lost.
- **N4**: Stripe Subscription objects carry no application identifier (no `subscription_data.metadata`, no `client_reference_id`).
- **N6**: E2E helpers run service-role mutations against the `.env.local` project with no test-project guard.
- **N7**: the app runtime has no test/live key guard; only the listener script does.

### 5.2 Findings by topic

| Topic | Finding (OBSERVED unless noted) | Evidence |
|---|---|---|
| Checkout creation | Route handler `POST /api/checkout`, `getUser()` auth, no role check; hosted Checkout in subscription mode; no idempotency key; no session id in the success URL; URLs from request origin | `api/checkout/route.ts:11-107` |
| Customer identity | customer created with `metadata.supabase_user_id`; looked up only in the local table; upsert result unchecked | `route.ts:39-46,73-87` |
| Billing ownership | one `subscriptions` row per auth user (`onConflict: 'user_id'`); no account, organisation or store entity anywhere | `route.ts:43,86` |
| Pricing | server-authoritative: client sends a tier name, server maps to env price ids; map unvalidated (a missing env becomes the key `"undefined"`); display prices hard-coded separately; first subscription item only | `lib/stripe/tierResolver.ts:3-16` |
| Webhook verification | correct: raw `request.text()`, `constructEvent`, 400 on failure; no guard for an unset secret | `api/webhooks/stripe/route.ts:6-24` |
| Events | `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` only; no invoice, async-payment, expired or created events | `route.ts:30,80,110` |
| API version | SDK `stripe` 22.1.0, no `apiVersion` pin; period fields read from the subscription item in the event snapshot | `lib/stripe/stripe.ts:3-5` |
| Durability | no event storage, no event-id dedup, no ordering check, zero-row updates undetected, no reconciliation job | `route.ts:28-134` |
| Status vs access | only `status === 'active'` grants a tier; `trialing` and `past_due` get nothing; `cancel_at_period_end` stored but never read; no staleness check; enforcement in layouts and pages, not RLS | `userService.ts:32-44` |
| Customer Portal | customer resolved server-side from the caller's own row; safe per user; authority is "own row" | `api/customer-portal/route.ts:6-33` |
| Server Actions | no authorization at all before the service-role client (delete user, create user with arbitrary role, change role) | R1 above |
| Database | `supabase/setup.sql` is one non-idempotent file with **no `subscriptions` table**; that table exists only as "PROPOSED" SQL in a document | `docs/DATABASE_SCHEMA.md:397-445` |
| Listener | `scripts/start_stripe_webhook.sh` reads `.env.local` as data, refuses non-test keys, passes the key to the CLI as `STRIPE_API_KEY` (overriding the CLI's saved login), targets port 3000, prints the signing secret for manual paste and never edits env | `scripts/start_stripe_webhook.sh:22-102` |
| Recovery | success page polls the caller's own row 5 × 2 s, is not tied to a session, and says "Your payment was received!" on timeout; a missed webhook has no recovery path | `SubscribeSuccessContent.tsx:20-21,41,138-168` |

Documentation drift: `docs/SUBSCRIPTION_SYSTEM.md:121,172` and `docs/ARCHITECTURE.md:86` claim privileged actions re-check role server-side (false); `README.md:51` calls the webhook idempotent (it is only overwrite-tolerant).

### 5.3 Reuse matrix

| Component | Source | Verdict | Reason | Required changes for CyPh | Proposed verification |
|---|---|---|---|---|---|
| Webhook signature block | `api/webhooks/stripe/route.ts:6-24` | **REUSE** | raw body + `constructEvent` + 400 is correct | add missing-secret guard; explicit Node runtime | tampered body, wrong secret, missing header → 400 |
| Listener script | `scripts/start_stripe_webhook.sh` | **REUSE** | test-key guard; env read as data; key redaction; no env writes | parameterise port and price names; optional event allowlist | run with missing env, live-shaped key (must refuse), wrong port; confirm env file unchanged |
| `safeRedirect` | `src/lib/safeRedirect.ts` | **REUSE** | small, strict, unit-tested | none | existing tests plus encoded-slash cases |
| Checkout creation | `api/checkout/route.ts` | **ADAPT** | sound skeleton; identity is per user and non-durable | key on the registration/account record; add `client_reference_id` and subscription metadata; idempotency keys; session id in success URL; write no entitlement before payment; configured origin | concurrent double-submit → one customer and one session |
| Price configuration | `lib/stripe/tierResolver.ts` | **ADAPT** | server-authoritative map is right; unvalidated and single-item | fail-closed startup validation; model base plan plus stores; single source for displayed price | missing/duplicate/malformed env tests; sandbox check each id is an active recurring price |
| Status → access principle | `userService.ts:32-44`; `lib/auth/requireSubscriptionTier.ts` | **ADAPT** | fail-closed idea is worth keeping; binary and per user | entitlement per account consumed through store membership; explicit rules for trialing, past due, cancel-at-period-end; staleness bound; enforced in OwedBook | table-driven status tests; cross-account denial |
| Portal session | `api/customer-portal/route.ts` | **ADAPT** | customer resolved server-side | authorize the account's billing owner; deny store admins and members; configured return URL | owner 200; store admin and member 403; other account 403/404 |
| Stripe client | `lib/stripe/stripe.ts` | **ADAPT** | three lines | pin `apiVersion`; refuse live keys outside production; `server-only` | guard unit test; event version matches the pin |
| Test scaffolding | `src/__tests__/api/*.test.ts` | **ADAPT** | mock scaffolding is reusable; assertions encode current behaviour | rewrite for durable processing; add denial, replay and concurrency tests; guarded test project | new suites must fail against the current handler |
| UI pieces | `PlanCard.tsx`, `SubscribeSuccessContent.tsx` | **ADAPT** (low value: PP's own screens are further along) | generic patterns | success page must verify the session server-side | delayed and missing webhook cases |
| Customer mapping | `route.ts:39-46,73-87` | **REPLACE** | one row mixes customer, subscription and tier per user | account ↔ customer mapping, unique both ways, recoverable from Stripe metadata | constraint test; orphan-customer recovery |
| Event handlers | `route.ts:28-134` | **REPLACE** | always-200, three events, snapshot-dependent | store event first; non-2xx until stored; re-fetch the authoritative object; add lifecycle events; provision only from verified paid state | duplicate, out-of-order and DB-failure replay tests |
| Idempotency / dedup | none exists | **REPLACE** (build new) | nothing to reuse | unique event-id table; idempotency keys; provisioning key | same event N times in parallel → one state change |
| DB schema, RLS, triggers | `supabase/setup.sql` | **REPLACE** | not reproducible; per user; trigger drift | use OwedBook's chain | fresh install from migrations alone |
| User-management Server Actions | `(admin)/…/actions.ts`, `(superadmin)/…/actions.ts` | **REPLACE** | no authorization | authenticate, authorize by account/store, validate, audit; invitations instead of admin-set passwords | direct-invocation denial tests |
| Live schema, Stripe account settings, portal configuration | — | **UNKNOWN** | not inspectable locally | — | authorized live probes (Section 11) |

Do not carry over: `api/ghl/hooktest`, the legacy posts/booking/template code. The learning app's individual-user model is not a design input for CyPh.

---

## 6. Cross-app integration map

### 6.1 Proposed purchase-to-OwedBook path against actual code

| Step | Proposed owner | Exists today? | Evidence |
|---|---|---|---|
| 1. Owner fills registration (owner, stores, declaration) | PP | UI and rules: yes (mock, per tab). Server record: no | PP `registration.ts` |
| 2. Identifier and existing-account checks | PP calling shared data | No real check | PP `registration.ts:436-460` |
| 3. Server-computed quote and consent record | PP | No | PP `registration.ts:565,620` |
| 4. Create Stripe customer and Checkout Session | PP | No (SDK installed, zero imports). Reference: SL `api/checkout/route.ts` | — |
| 5. Stripe-hosted payment and return | Stripe → PP | Stand-in only | PP `/demo/stripe` |
| 6. Signed webhook, durable event record, "paid" decision | PP | No route. Reference block: SL `route.ts:6-24` | — |
| 7. Provision account, first store, owner membership, subscription mirror | PP (service role) writing OB-owned tables | No function; tables exist only as unapplied migrations | OB `0002–0006` |
| 8. Create owner login and send invitation / magic link | PP via Supabase Auth admin | No send code in any repo | — |
| 9. Owner opens link, sets password, lands in their store | **OB** | Confirm route exists; no set-password page, no store landing, app never reads store tables | OB `api/auth/confirm/route.ts:6-33` |
| 10. Owner returns to manage billing | PP, linked from OB | PP dashboard is mock; OB billing page is a separate mock; no link either way | PP `DashboardView.tsx`; OB `BillingRow.tsx` |
| 11. Subscription lifecycle (past due, cancel) reflected in access | PP writes mirror; OB decides access | No | — |

### 6.2 Proposed ownership of operations

| Operation | Owner | Reason |
|---|---|---|
| Registration draft, quote, consent, checkout, webhook, Stripe event ledger, billing portal session, provisioning orchestration, invitation send and resend | **PP** | OB's own doctrine: "account writes are billing territory (Payment Portal → service role)" (OB `0018_rls_accounts.sql:4-5`); OB removed Stripe on purpose |
| Schema, RLS, helpers, audit triggers for accounts, stores, memberships, subscriptions | **OB migration chain** | it is the only real chain; PP's SQL files are unverified starter residue |
| Invitation landing, set-password, store selection, in-store access decisions | **OB** | the session must be created on OB's host |
| Customer admin screens (stores, members) | **OB** (as APBM003 established; verify in the true baseline) | — |
| Billing screens and Add Store purchase | **PP**, entered from OB by link | keeps billing authority and Stripe in one app |
| Internal superadmin oversight | Mission Control / service role (unchanged) | OB law `0016:4-7` |

### 6.3 Migration ownership — one chain

Recommendation: **OwedBook's chain is the single migration chain for the shared `public` schema.** New billing-side tables that PP needs (Stripe event ledger, registration/checkout records, provisioning operations, invitation tracking) are authored as numbered migrations in that chain, or placed in a separate Postgres schema that only PP's service role touches — one of the two, decided once (Q-J2). PP's `supabase/*.sql` are never run. Prerequisite: the chain has never been recorded as applied to the dev backend, and its files refuse re-runs, so the apply procedure and target project must be settled first.

### 6.4 Shared data and interface contracts needed

1. **Account / owner / billing authority**: who is the billing owner, how the database knows, and what a store admin may read.
2. **Provisioning contract**: one idempotent operation keyed by the Stripe checkout session or subscription id that creates or completes account, store(s), owner membership, subscription mirror; safe to re-run after partial failure; audit-visible.
3. **Status vocabulary map** between PP's contract states and OB's schema values (4.3).
4. **Pharmacy identifier contract**: which identifier is unique, at what scope, and its validation — owned by the schema, consumed by PP.
5. **Stripe customer home**: account-level, not `businesses.stripe_customer_id`.
6. **Invitation contract**: link type, lifetime, landing URL in OB, resend rules, what happens to an expired or used link.
7. **Global role rule**: what `user_roles.role` a provisioned owner receives, and that it is set explicitly by the service role, never through user metadata.

### 6.5 Minimum shared-login behaviour for 007A

Recommended minimum (INFERENCE from the code as it stands): **one Supabase project, one set of credentials, a separate session on each host.** The invitation link lands on OwedBook, which establishes its own session and a password. Moving to PP for billing is a link plus a normal sign-in on PP if no session exists there. This needs:

- an agreed landing URL and an allowlisted `next` in OB's confirm route;
- a set-password page in OB reachable by an invited user;
- `next`/return-to support on both login pages so a cross-app link returns the user to where they were going;
- both app origins in the Supabase redirect allowlist;
- a decision on logout scope, because PP's logout is global today.

Parent-domain cookie sharing is not required for 007A and would make cookie name, domain, `httpOnly: false` and global sign-out into cross-app concerns. It can be assessed in 007B under "expanded session coverage".

### 6.6 Email, auth and provider dependencies

Supabase Auth (invite or magic-link generation; templates must point at `/api/auth/confirm?token_hash=…&type=…`), an email sender with a sending address and delivery signal (none configured in any repository; placeholders `[SENDING ADDRESS TBD]`, `[SUPPORT EMAIL]`), Stripe sandbox (keys, catalogue, webhook endpoint, Billing Portal configuration), Cloud Run service and domain for the 007 portal, and Stripe CLI on the engineering machine.

### 6.7 What local inspection proves and does not prove

| Proven locally | Requires an authorized live probe |
|---|---|
| Source, intended schema and policies as written | Which schema, policies and trigger are installed on each Supabase project |
| Which code paths are mock or real | Whether the three apps truly share one project today |
| Declared, locked and (PP) installed versions | Whether builds, type checks and tests pass now |
| Deploy configuration on disk | Whether the feedback deployment is live and what it serves |
| That no Stripe configuration exists in PP or OB | The Stripe sandbox: keys, products, prices, webhook endpoint, API version, portal settings |
| Auth route behaviour as coded | Supabase Auth settings: sign-up switch, redirect allowlist, site URL, email templates, sender |

---

## 7. Proposed 007A / 007B scope and dependencies

### 7.1 Preconditions for either module (not new modules — preparation)

1. Produce the true OwedBook baseline that contains APBM003 and the pagination repair, with its Git identity, and re-check Sections 3.3–3.7 against it. (F-01)
2. Retarget or disable PP's deploy configuration in the dev copy. (F-02)
3. Decide the Supabase project for 007 engineering and record which project each env file points at. (F-06)
4. Close the sign-up role hazard on that project. (F-03)
5. Verify the Stripe sandbox and record its catalogue and API version.
6. Obtain the decisions marked DECISION NEEDED in Section 8 that shape schema: identifier, billing-owner model, subscription shape for multiple stores.

### 7.2 007A — owner registration to first store

| Repo | Required changes |
|---|---|
| **OB** | Apply-ready migrations: billing-owner concept and helper; subscription read restricted to those with billing authority; column-restricted store update; account-level Stripe customer; identifier constraint per decision; new-user trigger correction. Invitation landing with allowlisted `next`, set-password page, store landing for a provisioned owner (requires the app to read store membership — BIM-005-class work). Link to PP billing. Return-to support on login. |
| **PP** | Server-side registration, quote, consent and checkout records; Stripe client with pinned version and test-key guard; Checkout Session creation; webhook route with durable event record and dedup; provisioning orchestrator (idempotent, service role, server-only); real invitation send and rate-limited resend; real activation status; Billing Portal session for the billing owner; replace the temporary staff gate with account-scoped capabilities; remove demo harnesses and the Stripe stand-in; correct over-promising copy; new deploy target. |
| **SL** | No changes. Reference only, per the reuse matrix. |

Recovery inside 007A: payment unknown or webhook delayed (status page reads the server record; reconciliation from Stripe by session id); provisioning partial failure (re-runnable operation, operator-visible "attention" state); email failure (resend; operator path to correct a wrong owner email after payment — currently unsupported); abandoned and expired checkout.

### 7.3 007B — growth and governance

Paid Add Store (subscription change with proration preview, idempotent, then store provisioning and store-admin invitation); member and admin management in OB (list, invite, change role, remove — requires membership read policies beyond self-select); sole-admin recovery; ownership transfer (`accounts.owner_user_id` change, billing-owner hand-over in Stripe, audit); expanded cross-app permission and session coverage (logout scope, optional shared cookie, session expiry behaviour); lifecycle access effects once commercial rules are approved.

### 7.4 Assessment of the split — missing dependencies and unsafe seams

| # | Seam | Why it is unsafe if left to 007B | Recommendation |
|---|---|---|---|
| S1 | Billing-owner model | 007A stores real subscription data that every store member can read, and "billing management" needs an authority check that does not exist | define owner/billing authority and tighten the two read policies in 007A |
| S2 | Store update policy | a store admin could repoint a store's account or Stripe customer id the moment real data exists | column restriction in 007A |
| S3 | Subscription shape | if 007A creates a single-item subscription and 007B needs per-store quantity or items, live subscriptions must be migrated | decide the catalogue shape (base + per-store) before 007A, even though Add Store ships in 007B |
| S4 | Invitation landing and set-password in OB | "owner reaches their store" cannot be accepted without it; it is OB work, easily missed because the module is portal-led | name it explicitly in 007A scope |
| S5 | Owner's global role | provisioning must give the owner a global role to pass OB's page gates; choosing `admin` now bakes in the admin-equals-owner conflation that 007B must undo | decide the role model once in 007A; set roles explicitly by service role |
| S6 | Locked-out paid owner | sole-admin recovery is 007B, but a paid owner with a wrong or undeliverable email is a 007A outcome | minimal operator recovery procedure in 007A |
| S7 | Store-admin invitations at registration | PP's registration lets the owner name another person as store admin per store; that is an invitation to a non-owner, which looks like 007B member management | either defer "someone else" to 007B or include that single invitation path in 007A — decide |
| S8 | Lifecycle effects | 007A mirrors status; whether `past_due` or `canceled` blocks store access is a commercial rule not yet approved | 007A stores and displays status only; access effects wait for the rule, default stated explicitly |
| S9 | OB backend readiness | OB's app has no real data path (BIM-004/005 not started, chain never recorded as applied); 007A silently depends on that work | size it inside 007A or schedule it first; do not assume it exists |

With S1–S6 pulled into 007A and S7–S9 decided, the two-module boundary is sound.

---

## 8. Readiness checklist

| # | Item | Status | Note |
|---|---|---|---|
| 1 | OwedBook baseline containing APBM003 identified | **GAP** | this checkout does not contain it (F-01) |
| 2 | OwedBook Git identity | **GAP** | no `.git` in the checkout |
| 3 | Payment Portal baseline tied to the Gate-Q snapshot | **NOT VERIFIED** | no shared history; equality helper not run |
| 4 | PP lockfile state | **DECISION NEEDED** | commit the new lock or restore the tested one |
| 5 | PP deploy target separate from the feedback site | **GAP** | identical config (F-02) |
| 6 | Supabase project for 007 engineering | **DECISION NEEDED** | shared versus dedicated (F-06) |
| 7 | Installed schema on that project | **NOT VERIFIED** | docs say two-table baseline only |
| 8 | Sign-up switch off and new-user trigger corrected | **NOT VERIFIED** (last recorded: not done) | F-03 |
| 9 | Single migration chain agreed | **DECISION NEEDED** | recommendation in 6.3 |
| 10 | Account-owner / billing-authority model | **GAP** + **DECISION NEEDED** | F-04 |
| 11 | Store update column restriction | **GAP** | F-05 |
| 12 | Provisioning function / contract | **GAP** | none exists |
| 13 | Invitation landing, set-password, store landing in OB | **GAP** | F-08 |
| 14 | OB app reads real store data | **GAP** | BIM-004/005 not started |
| 15 | Stripe sandbox keys, catalogue, webhook, API version, portal config | **NOT VERIFIED** | reported created by Tony; nothing in any repo |
| 16 | Stripe CLI on the engineering machine | **GAP** | not on PATH |
| 17 | Stripe integration code in PP | **GAP** | SDK installed, zero imports |
| 18 | Durable webhook processing design | **GAP** | learning app offers nothing reusable beyond signature check |
| 19 | Pharmacy identifier (NPI vs NCPDP), uniqueness and scope | **DECISION NEEDED** | both apps are NCPDP-keyed today |
| 20 | Pricing, proration, tax, trial, cancellation, grace, hold period, link lifetime | **DECISION NEEDED** | all placeholders |
| 21 | Account-level multi-store billing confirmed by Coach | **DECISION NEEDED** | Director provisional only |
| 22 | Email sender, sending address, support address, templates | **GAP** | placeholders |
| 23 | Supabase redirect allowlist for both origins | **NOT VERIFIED** (recorded as deferred) | — |
| 24 | Cross-app login model for 007A | **DECISION NEEDED** | recommendation in 6.5 |
| 25 | Logout scope across apps | **DECISION NEEDED** | PP logout is global |
| 26 | PP UI, state rules and engine tests as a specification | **READY** | reusable as described in 4.9 |
| 27 | OB intended schema, RLS helpers and audit triggers as a base | **READY** (as source; not as installed) | needs the changes in 7.2 |
| 28 | Webhook signature block and listener script from SL | **READY** to reuse | per matrix |
| 29 | Fresh build / type-check / test results for any repo | **NOT VERIFIED** | none run by instruction |
| 30 | Feedback deployment currently live and undisturbed | **NOT VERIFIED** | no network call made |

---

## 9. Prioritized findings

| ID | Pri | Repo | Finding | Impact | Evidence | Recommendation |
|---|---|---|---|---|---|---|
| F-01 | P0 | OB | The OwedBook checkout contains no APBM003 work, no pagination repair, no Git history; its admin portal is an in-memory demo | 007 would be authored against the wrong baseline; every OB statement in this report describes a pre-APBM003 tree | no APBM token anywhere; `agent_docs/ACTIONS/` listing; `CHANGELOG.md:6-10`; `src/services/adminDemo.ts:13-31` | Tony to supply the merged baseline with Git identity; re-run Section 3 checks 3.3–3.7 against it before release |
| F-02 | P0 | PP | Dev copy carries the feedback deployment's exact deploy target | one `./deploy.sh` replaces the stakeholder mock; `deploy.sh:59` also changes local gcloud config | `deploy.sh:11-20`; `cloudbuild.yaml:6-7`; `stark-deploy.yaml` | retarget to a new service and domain, or disable the script, before any engineering starts |
| F-03 | P0 | OB / shared DB | New-user trigger takes the global role from sign-up metadata; sign-up switch last recorded as on; fix unbuilt | on a project with open sign-up, anyone with the publishable key could self-assign `superadmin`; any invite passing a role in metadata sets the global role | OB `scripts/db-bootstrap-baseline.sql:76-80`; `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md:29`; SL `docs/STARTER KIT DOCS/migration_add_profiles.sql:82-87` | live probe of trigger body and sign-up switch; correct both before any registration or invitation flow |
| F-04 | P1 | OB | No account-owner or billing-authority concept in RLS; any store member can read account and subscription rows; an owner without a membership row reads nothing | the business rule "store admins/members do not automatically gain billing authority" cannot be enforced; real subscription data would be over-exposed | `0016_rls_helpers.sql:4-7`; `0018:16-18`; `0020:14-16` | define the model and tighten policies inside 007A (S1) |
| F-05 | P1 | OB | Store admins may update every `businesses` column | a store admin could change `account_id`, `status` or `stripe_customer_id` | `0019_rls_businesses.sql:27-30` | column-restricted update or a function, in 007A (S2) |
| F-06 | P1 | PP / OB | Feedback mock, deployed OwedBook and Mission Control are documented as sharing one Supabase project; the OB checkout is linked to a different project | schema, trigger, auth-setting or seed changes hit all apps; OB's RLS harness wipes `auth.users` on its target; uncertainty about which project is which | PP `agent_docs/SESSIONS/session_2026-11-03.md:40,48,70`; OB `RUN_NOTES.md:3`, `scripts/rls-harness/lib/env.mjs:15-20`; comparison of OB `supabase/.temp/linked-project.json` with PP `deploy.sh` | name the 007 engineering project; inventory which env points where; never run OB harness scripts against a shared project |
| F-07 | P1 | PP | No Stripe integration, webhook, server state or provisioning exists; payment outcomes are chosen by reviewer buttons | the whole 007A backend is new work; the mock's guarantees hold only within one browser tab | `package.json:41` with zero imports; `registration.ts:699,740`; route tree | treat PP's engines and tests as the specification; build server records and webhook as in 7.2 |
| F-08 | P1 | OB | No invitation landing, set-password page, forgot-password flow or store landing; login has no return-to | "owner reaches their store" cannot be delivered without OB work | `src/app/api/auth/confirm/route.ts:6-33`; `src/store/useAuthStore.ts:26-53` | include explicitly in 007A scope (S4) |
| F-09 | P1 | OB | The running app reads only `user_roles`; schema chain not recorded as applied; BIM-004/005 not started | 007A depends on unbuilt OB backend work | `src/utils/get-user-role.ts:16-20`; `agent_docs/AUTHORITY/PHASE_3_BIM_CAMPAIGN_MAP.md:29` | size inside 007A or schedule first (S9) |
| F-10 | P1 | PP | `supabase/setup.sql` and `migration_add_profiles.sql` redefine shared objects and the new-user trigger | running them on the shared project would break or silently replace OB's trigger | PP `supabase/setup.sql:15,87,111`; `supabase/migration_add_profiles.sql:72,111-114`; `supabase/README.md:3-13` | never run; single chain owned by OB (6.3) |
| F-11 | P1 | SL | Privileged Server Actions have no authorization; webhook returns 200 on every failure; no event ledger; schema not reproducible | the learning app is unsafe as a foundation; only small parts are reusable | `(admin)/admin-portal/actions.ts:23-178`; `api/webhooks/stripe/route.ts:129-134` | follow the reuse matrix; do not copy handlers, actions or schema |
| F-12 | P1 | PP / OB | Two global-role gates (`admin`/`superadmin` in PP; `admin`/`member` in OB) stand in for customer authorization | provisioning an owner as global `admin` conflates store admin with billing owner; superadmins are admitted to PP's account area | PP `src/services/auth/access.ts:11`; OB `src/app/(admin)/layout.tsx:13-15` | decide the role model in 007A (S5) |
| F-13 | P2 | PP / OB | Both apps key pharmacy identity on NCPDP; NPI is format-only in PP and half of a composite key in OB; no check-digit validation anywhere | Frank's NPI request touches schema constraints, validation, copy, fixtures and tests in both repos | PP `validation.ts:58-61`, `registration.ts:452-460`; OB `0003_businesses.sql:18-19,52` | obtain the definition (Q-C1) before schema work |
| F-14 | P2 | PP | Every commercial value is a placeholder; multi-store account billing is unconfirmed by Coach | catalogue cannot be built; subscription shape undecided (S3) | `pricing.ts:5-10`; `fixtures.ts:9-18`; `APP_BRIEF.md:100` | sandbox defaults may be proposed but must be labelled as such |
| F-15 | P2 | PP / OB | Host-only cookies, no cross-app link, no redirect allowlist, global logout in PP | no shared session today; cross-app behaviour is undefined | PP `src/utils/supabase/server.ts:21-27`, `api/auth/logout/route.ts:7`; OB `src/utils/supabase/server.ts:19-27` | adopt the 6.5 minimum for 007A |
| F-16 | P2 | PP | Lockfile modified and installed tree differs from the tested one; baseline not tied to the Gate-Q commit | inherited test evidence does not describe the installed tree | `git diff --stat`; jest 30.4.2 → 30.5.2 | decide (Q-T3); run a fresh suite when authorized |
| F-17 | P2 | PP | Copy promises behaviour that does not exist (saved everywhere, emailed resume link, same sign-in) | misleading to reviewers and, later, customers | `CheckoutStandIn.tsx:156`; `CheckoutIncompleteView.tsx:102,147`; `LoginPageContent.tsx:78` | back with real behaviour or reword in 007A |
| F-18 | P2 | OB / PP | Login routes return the full Supabase session object in the response body; auth cookies are `httpOnly: false` | tokens are readable by page scripts; relevant once real customers sign in | OB `api/auth/login/route.ts:42-47`; PP `api/auth/login/route.ts:42-47` | review with KIP-1 when `server.ts` is touched |
| F-19 | P2 | OB | Audit action vocabulary has no business events; account-level audit rows are visible to no tenant | payment, provisioning and ownership events have no audit expression | `0028:51`; `0029:24-26` | decide audit needs with the provisioning contract |
| F-20 | P3 | PP | Supabase project reference and publishable key hard-coded in tracked files | discloses which project is shared; not a secret | `deploy.sh:18-19`; `stark-deploy.yaml` | move to build-time configuration when retargeting |
| F-21 | P3 | PP | Tracked dangling symlinks; `lint` and `test:integration` scripts do not work; unused dependencies | tooling noise; symlinks previously broke a cloud upload | `agent_docs/.claude/skills/*`; `package.json:5-14` | clean up when the repo is next touched |
| F-22 | P3 | SL | Service-role E2E helpers have no test-project guard; no `.env.example` | running its E2E against a shared project would create users there | `e2e/helpers/supabase-admin.ts:6-13` | do not run against any shared project |

---

## 10. Consolidated questions

### For Tony

- **Q-T1** Where is the OwedBook tree that contains APBM003 and the pagination repair (repository, branch, commit)? Can it be placed here as a Git checkout?
- **Q-T2** Which source commit was the Payment Portal dev copy taken from, and should byte-equality with the Gate-Q snapshot be proven?
- **Q-T3** Should the modified `package-lock.json` be kept (jest 30.5.2) or the tested lock restored?
- **Q-T4** Will 007 deploy to a new Cloud Run service and domain, leaving `cyph-sub-portal-prod` as the feedback site? What names?
- **Q-T5** Which Supabase project does each app use today (feedback site, deployed OwedBook, Mission Control, PP `.env.local`, the project the OB checkout is linked to)? Is a dedicated 007 engineering project wanted?
- **Q-T6** Has the OwedBook migration chain been applied to any project? Is the sign-up switch now off?
- **Q-T7** Stripe sandbox: account name, where keys are held, whether products, prices, a webhook endpoint and Billing Portal configuration exist, and the account's API version.
- **Q-T8** Email: which provider and sending address will carry invitations? Is custom SMTP configured in Supabase?
- **Q-T9** Final URLs for OwedBook and the portal in the 007 environment (needed for the redirect allowlist and Stripe return URLs).
- **Q-T10** May the Stripe CLI be installed on the engineering machine?

### For JARVIS / Friday

- **Q-J1** Billing-authority model: is it derived from `accounts.owner_user_id`, or a separate account-role record that also serves later ownership transfer?
- **Q-J2** New billing-side tables: numbered migrations in OwedBook's chain, or a separate schema owned by the portal's service role?
- **Q-J3** Provisioning: a single database function called by the portal, or ordered service-role writes with a recorded operation? What is the idempotency key?
- **Q-J4** What global `user_roles.role` does a provisioned owner receive, and does OwedBook keep gating pages on the global role?
- **Q-J5** Subscription shape for multiple stores (one item with quantity, or base plus per-store item) — to be fixed before 007A.
- **Q-J6** Is the 6.5 minimum (shared credentials, separate sessions, link hand-off) accepted for 007A? What should logout do across apps?
- **Q-J7** Does 007A include the "someone else as store admin" invitation from registration, or is that deferred to 007B?
- **Q-J8** Which lifecycle events must 007A handle beyond checkout completion (invoice failure, cancellation, expiry), and what is the default access effect while commercial rules are pending?
- **Q-J9** Where does the OwedBook backend work (apply chain, real store reads) sit — inside 007A or before it?
- **Q-J10** Audit: are business events (payment verified, provisioned, invitation sent) required in `audit_logs`, and who can read account-level audit rows?

### For Coach / Frank

- **Q-C1** NPI: does it replace NCPDP or sit beside it? Organisational NPI only? May one NPI cover several locations, and may one location hold more than one? What is the uniqueness rule, and is check-digit validation wanted?
- **Q-C2** What does "account" mean commercially — one legal owner, one business entity, or a group — and how do locations map to it?
- **Q-C3** Is one subscription per account covering many stores confirmed?
- **Q-C4** Pricing: base price, per-store price, billing interval, tax handling, promotion codes, trial.
- **Q-C5** Add Store: proration and effective-date rule; is Add Store blocked while past due or cancel-scheduled?
- **Q-C6** Cancellation, grace period, refunds, reactivation, and what store staff can do during a billing problem.
- **Q-C7** How long an unfinished registration is held, and how long an access link stays valid.
- **Q-C8** Since neither NPI possession nor payment proves ownership, what verification, if any, is required before or after provisioning?
- **Q-C9** Ownership transfer and sole-admin recovery: who may request, and what proof is required?
- **Q-C10** Customer-facing names ("Pharmacy Books", "OwedBook"), support email, terms and privacy links.

---

## 11. Next steps and live probes to propose

### Exact next steps (smallest preparation before engineering release)

1. Tony supplies the APBM003-bearing OwedBook checkout (Q-T1). A short delta recon re-checks Sections 3.3–3.7 and 3.4 against it.
2. Neutralise F-02: retarget or disable the deploy files in the PP dev copy.
3. Record the project inventory (Q-T5) and choose the 007 engineering project.
4. Run the authorized live probes below; convert each NOT VERIFIED row in Section 8.
5. Collect the schema-shaping decisions: Q-C1, Q-C2, Q-C3, Q-J1, Q-J2, Q-J5.
6. JARVIS drafts the interface contracts in 6.4; Friday reviews the seams in 7.4.
7. Release 007A with S1–S6 in scope and S7–S9 decided.

### Live probes to propose (none performed; each needs explicit authorization)

| Probe | Type | Answers |
|---|---|---|
| L1 List tables, policies, functions and triggers on the chosen Supabase project; read the body of `handle_new_user` | read-only SQL | checklist 7, 8; F-03 |
| L2 Read Supabase Auth settings: sign-up switch, site URL, redirect allowlist, email templates, SMTP sender | read-only dashboard | checklist 8, 22, 23 |
| L3 Confirm which project each deployed app and env file uses (project references only) | read-only | F-06 |
| L4 Stripe sandbox: list products, prices, webhook endpoints, Billing Portal configuration, account API version; confirm keys are test-mode | read-only API / dashboard | checklist 15 |
| L5 `gcloud run services describe` for the feedback service and OwedBook service | read-only | checklist 30; F-02 |
| L6 Fresh `npm ci`, type-check, build and Jest in a scratch clone of each repo | local, no external calls for PP and OB Jest | checklist 29 |
| L7 PP public e2e against a locally owned server; account e2e only against a dedicated test project | local plus test project | regression baseline |
| L8 Stripe CLI listener against a local webhook with a sandbox key, after the webhook route exists | sandbox | signature and event-version handling |
| L9 One sandbox end-to-end: checkout → webhook → provisioning → invitation → OwedBook landing, on the dedicated project | sandbox plus test project | acceptance rehearsal for 007A |

---

## 12. Inspection limits and checks not run

**Not run, by instruction**: installs, builds, dev servers, type checks, lint, Jest, Playwright, `npm audit`, migration, seed, reset or harness scripts, Stripe CLI, `gcloud`, any network request. No account was created, no login performed, no email sent.

**Not read**: PP `.env.local` and `.env.qa.local` (existence and ignore status only); `ARCHIVE/`; the targets of PP's three out-of-repo symlinks; roughly twenty review zip archives under PP's module `EVIDENCE/` and `QAM/HANDOFFS/` (contents unknown); values inside OB `supabase/.temp/linked-project.json` and PP `deploy.sh` were used only for a same/different comparison and are not reproduced.

**Limits**:

- OwedBook findings describe a tree that is not the APBM003 baseline (F-01).
- Migrations show intended schema, not the installed one. Every statement about installed triggers, switches or shared projects is a documented claim or an inference.
- Test counts are static counts of test declarations or figures quoted from documents; none is a fresh result.
- Line numbers were taken from the files as they stood at 15:44–16:05 local time on 2026-11-10.
- The secret-pattern scans were regex scans of tracked text files and are not exhaustive.
- Detailed per-repository inspection was carried out by three parallel read-only passes; the highest-impact claims (F-01, F-02, F-03, F-04, F-05, F-11, F-13 and the pricing constants) were re-checked directly against the files.

**Integrity check at close**: see `evidence/INTEGRITY_CHECK.txt` in the package. Result: PP HEAD, status and working-tree diff hash unchanged; SL HEAD and clean status unchanged; OB file manifest (1,288 files) hash unchanged. No concurrent change was observed during the recon. The PP lockfile modification and the `.next` build pre-date this recon and were left as found.

**Supporting files in the package**: `evidence/APPENDIX_PAYMENT_PORTAL_DETAIL.md` (full per-function swap-point tables, state inventories and field rules for PP), `evidence/INTEGRITY_CHECK.txt`, `PACKAGE_INDEX.txt`.
