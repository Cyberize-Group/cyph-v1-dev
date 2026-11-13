# PRE-APBM007 RECON — OWEDBOOK CORRECTION (DELTA) — 2026-11-10

**Corrects:** `PRE_APBM007_RECON_2026-11-10.md` (sha256 `d0bb4ada4ed057282dc1362a74ce5cbfcef6ae4addde0da94002c4ee4ac79d17`), referred to below as "the original".
**Scope:** OwedBook only, plus the cross-app conclusions that rested on it. Payment Portal (PP) and Stripe learning app (SL) findings are retained, not re-run.
**Method:** local, read-only source inspection. No code change, Git mutation, install, build, test, deployment, provider call, database operation or read of a real env file.
**APBM003:** accepted and merged. Nothing here reopens its certification.

Evidence labels used throughout:

- **SOURCE** — observed in the checkout at the stated file and line.
- **RECEIPT** — a historical record committed in the repository (what someone recorded on a past date).
- **LIVE** — current state of a database, auth setting or deployment. **Nothing in this report is LIVE-verified.**

Two housekeeping notes:

1. The original report and its ZIP are no longer in the parent folder (the folder now holds only `ARCHIVE` and the three repositories; `ARCHIVE` changed at 19:10). I did not look inside `ARCHIVE` and did not recreate the files. This delta was written against my byte-identical staging copy of the original (hash above). So "preserve the original" is satisfied only in the sense that I changed nothing; please confirm where it now lives.
2. The new checkout's `CLAUDE.md` asks every session to choose a workflow before work starts (`CLAUDE.md:10-35`). I read it and `CLAUDE.eng.md` exists; no `CLAUDE.local.md` is present. I treated them as repository records, started neither workflow, and wrote no session or response record, because this assignment is read-only with output in the parent folder.

---

## 1. Plain-English summary

The new checkout is the right baseline. It is a clean clone of `Cyberize-Group/cyph-v1-dev` at the APBM-003 merge commit, and the pagination repair is in it.

What APBM003 changed for 007:

- OwedBook and its admin read views now read real data through audited database functions. The demo is behind an explicit switch that is off by default.
- An account-owner concept exists in the database. An owner reads every store in their account without a membership row.
- The new-user trigger no longer takes a role from sign-up metadata. Every new user is a `member`.
- Customers cannot write to accounts or subscriptions. All such writes are service-role only.
- Records show the full 52-migration chain was applied to the DEV database on 7 November with sign-up disabled.

What is still missing for 007:

- Every write: provisioning, invitations, Add Store, billing actions, member management. The screens show "Not available in this release".
- Any magic-link request or invitation code. The link-landing route exists and would sign a user in without a password, but nothing sends a link and the login page is password-only.
- Billing authority as a distinct permission. Any store member can still read subscription rows, and a store admin can still update any column of their store, including its account link and Stripe customer id.
- A decision on how one sign-in covers both apps.

One new fact needs attention: **the DEV database that APBM003 applied to is the same Supabase project the portal feedback site is configured to use.** The original report said the OwedBook copy pointed somewhere else; that was true only of a stale tracked CLI link file.

---

## 2. Source identities

| Repo | Remote (sanitised) | Branch | HEAD | Working tree |
|---|---|---|---|---|
| OwedBook `cyph-v1-dev-apbm007-recon` | `github.com/Cyberize-Group/cyph-v1-dev` | `main`, tracking `origin/main`, not ahead or behind the local remote ref | `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` (2026-11-10 18:40 +06:00) | clean; 2,339 tracked files; no stash; one worktree |
| Payment Portal `cyph-payment-portal-dev-v1` | `github.com/ahmedmusawir/cyph-payment-portal-dev-v1` (personal account) | `main` | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` | `package-lock.json` modified, diff sha256 `8d341667…` — unchanged since the original |
| Stripe learning app | `github.com/ahmedmusawir/nextjs16-supabase-stripe-subscription-2026-v1` | `main` | `9c2527b46d68cca1cb92ded0f30070da316d3074` | clean — unchanged |

No fetch was run, so "matches `origin/main`" means the local remote-tracking ref, not GitHub as of now.

### Why `main` at `bc4e433` is the APBM003 baseline (not assumed from the branch name)

| Check | Evidence | Label |
|---|---|---|
| HEAD is the merge of PR #9, titled "APBM-003: OwedBook database integration, QA closeout and pagination repair" | `git log -1` | SOURCE |
| 12 APBM-003 commits sit between the pre-pack baseline `af2c7e5` and HEAD; the closeout names `af2c7e5` as the baseline and `308247a`, `dc44429`, `c5061d9` as candidate, certified repair and QA head — all three are ancestors in this history | `git log`; `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CLOSEOUT.md:14,22-25` | SOURCE + RECEIPT |
| Implementation present: migrations `0048`–`0052`, `src/services/tenantScope.ts`, real branches in `src/services/adminDemo.ts` and `src/services/owedbook.ts`; 59 product files changed since `af2c7e5` (+2,316 / −1,099) | `git diff --stat af2c7e5..HEAD -- src supabase scripts` | SOURCE |
| Pagination repair present: the four paths in the closeout list all exist; `ResultsToolbar.tsx` renders "Showing a–b of n claims", "Page x of y", Previous / Next | `CLOSEOUT/PAGINATION_PATHS.txt`; `src/components/owedbook/ResultsToolbar.tsx:10-39`; commit `6c58289` | SOURCE |
| Closeout record present | `CLOSEOUT/CLOSEOUT.md`, `FOLLOW_UPS.md`, `QAM/QAM_CERTIFICATION.md`, `APBM_RULINGS.md` | RECEIPT |

Certification scope, as the closeout itself states it (RECEIPT, `CLOSEOUT.md:9-12`): Friday's certificate is bound to `dc44429`; the pagination successor has engineering validation and Director manual approval, with no renewed independent certification claimed. Deployment and Gate D were not run. I report this as recorded and do not re-grade it.

---

## 3. OwedBook re-inspection

### 3.1 Migrations, ownership helpers and role model

The chain is now `0001`–`0052` (SOURCE, `supabase/migrations/`). `0001`–`0047` are unchanged from the tree described in the original; APBM003 added five files.

| Migration | What it does | Evidence |
|---|---|---|
| `0048_ownership` | New helper `is_owner_of_account(acct)` reading `accounts.owner_user_id = auth.uid()`. `my_business_ids()` now returns stores the user is a member of **plus** every store in an account they own. SELECT policies on `accounts`, `businesses`, `user_businesses`, `subscriptions` replaced with member-or-owner versions. INSERT/UPDATE/DELETE on `accounts` and `subscriptions` revoked from `authenticated` and `anon`. Unique index: at most one `admin` per store | `0048_ownership.sql:2-5, 8-13, 16-27, 28, 29` |
| `0049_signup_member` | `handle_new_user()` redefined; see 3.2 | `0049_signup_member.sql:2-12` |
| `0050_claim_read_fence` | All direct customer access to `user_data` removed; claims are reachable only through the four audited `owedbook_*` functions | `0050_claim_read_fence.sql:2-6` |
| `0051_admin_reads` | `tenant_stores()` returns each reachable store with a server-derived capability `owner` / `admin` / `member`. Audited read functions `admin_stores`, `admin_members`, `admin_billing_status`, `admin_audit`, each refusing callers who are neither account owner nor store admin. Direct SELECT on `audit_logs` removed | `0051_admin_reads.sql:2-9, 11-28, 30-43, 45-59, 61-83, 85-86` |
| `0052_system_config` | Dated, state-scoped configuration table; service-role writes only | `0052_system_config.sql:2-18` |

Role model as it now stands (SOURCE):

- **Platform role** (`user_roles`, enum `superadmin` / `admin` / `member`) only decides whether a signed-in user may open a page group: `/owedbook` and `/profile` admit `admin` and `member` (`src/app/owedbook/layout.tsx:17`; `src/app/profile/layout.tsx:15`).
- **Tenant capability** decides what they can see. The admin portal no longer needs the platform `admin` role in real mode: it admits any signed-in user for whom `tenant_stores()` returns at least one `owner` or `admin` capability (`src/app/(admin)/layout.tsx:15-23`; `src/services/tenantScope.ts:13-20`). The nav shows the admin link on the same test (`src/components/global/Navbar.tsx:38-43`).
- The original's "two disconnected role systems" is therefore largely closed: the app now reads tenant capability. The platform role is still a page gate, and a `superadmin` is still refused at `/owedbook`.
- The stated law that no policy consults `user_roles` or metadata is unchanged (`0016_rls_helpers.sql:4-7`). Note its text still says no helper consults `accounts.owner_user_id`; `0048` deliberately superseded that part.

### 3.2 New-user trigger and trusted role assignment

- **SOURCE:** `handle_new_user()` now inserts `user_roles.role = 'member'` unconditionally, copies only `full_name` from metadata, and has EXECUTE revoked from `public`, `anon`, `authenticated` (`0049_signup_member.sql:5, 7, 12`). The harness asserts the installed function body equals this file (`scripts/rls-harness/audit-catalog.mjs:14`).
- **SOURCE (residual):** three superseded files still contain the metadata-role version: `scripts/db-bootstrap-baseline.sql:76-77`, `docs/migration_add_profiles.sql:83-84`, and PP's `supabase/migration_add_profiles.sql` (original F-10). Running any of them on a migrated project would silently restore the hazard.
- **RECEIPT:** DEV APPLY passed on 2026-11-07, Director-executed, ledger at 52 entries, corrected trigger verified (`CLOSEOUT.md:9`; `APBM_STATE.md` entry 2026-11-07T08:19; receipt `EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json`).
- **RECEIPT:** sign-up on DEV. At 07:43 UTC on 7 November a read-only check returned sign-up still enabled and the step was recorded BLOCKED (`APBM_STATE.md:129-131`). The apply entry 36 minutes later records "Signup disabled", and ruling C-04 records the DEV half as PASS on a read-only settings GET (`APBM_RULINGS.md:48`).
- **LIVE:** not verified. Whether the trigger and the sign-up switch are still as recorded today is unknown.
- **Consequence for 007:** a provisioned owner arrives as platform `member` and needs nothing more. Their admin access comes from `accounts.owner_user_id`. No code path should ever write a role into user metadata, and none needs to raise `user_roles.role`.

### 3.3 Account, store and member permissions; billing authority

Effective customer permissions by source (policies plus functions):

| Object | Account owner | Store admin | Store member | Evidence |
|---|---|---|---|---|
| `accounts` row | read | read | read | `0048:17-18` (member-or-owner) |
| `subscriptions` rows (direct) | read | read | **read** | `0048:26-27` |
| Billing status view (`admin_billing_status`) | read | **read** | refused | `0051:49-51` |
| Stores list and detail (`admin_stores`) | all stores in account | own store | refused | `0051:15-17` |
| Member roster (`admin_members`) | every store in account | own store | refused | `0051:34-36`; direct roster read for owners `0048:23-24` |
| Audit (`admin_audit`) | whole account, including account and subscription rows | own store only | refused | `0051:65-77` |
| `accounts`, `subscriptions` writes | none | none | none | `0048:28` |
| `businesses` UPDATE | **none** (owner is not covered unless also store admin) | **any column** | none | `0019_rls_businesses.sql:27-30`, not altered by `0048`–`0052` |
| `user_businesses` writes | none | none | none | no write policy |
| Claims | audited functions only | same | same | `0050` |

Findings:

1. **Ownership now confers reach.** The original's "an owner with no membership row can read nothing" is resolved (`0048:8-13`).
2. **Billing authority is partly in place.** Who the billing owner is can now be answered (`is_owner_of_account`), and no customer can write billing rows. But nothing restricts billing *reads* to the owner: every store member can select subscription rows directly, and store admins are admitted to the billing status function. There is also no function or policy that expresses "may manage billing". The business rule "store admins and members do not automatically gain billing authority" is enforced for writes and not for reads.
3. **Store update is unchanged and now inconsistent.** A store admin may still update every column of their store — `account_id`, `status`, `stripe_customer_id`, `ncpdp`, `npi` — while the account owner may not update it at all (`0019:27-30`). The app sends no such update (3.4), so exposure is through the database API only. Whether table-level UPDATE is actually granted on the installed database is a LIVE question; ruling C-05(a) records residual non-DML grants and schedules a `0053_privilege_hardening` migration (`APBM_RULINGS.md:49`; `FOLLOW_UPS.md` F-02).
4. **One admin per store is now a database constraint** (`0048:29`). This shapes 007: PP's registration lets an owner name "someone else" as store admin, and promote/replace flows must respect the single slot.
5. **Owner deletion remains blocked by design** (`0048:1`, "Owner FK stays NO ACTION"); the ownership contract defers owner change to an "APBM-007 transfer-runbook operation" (RECEIPT, `CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md`, CF-1 paragraph).
6. Unchanged from the original: no invitations table, account-role table, Stripe event or idempotency table, transfer or recovery table, or provisioning function; `subscriptions` has no quantity, price or per-store columns; `businesses.stripe_customer_id` and `subscriptions.stripe_customer_id` both exist; `(ncpdp, npi)` pair uniqueness.

### 3.4 Real OwedBook and admin service connections

Mode switch: `isDemoMode()` is true only when `NEXT_PUBLIC_APBM_DATA_MODE === "mock"` (`src/services/tenantScope.ts:4`). The variable is absent from `.env.example`, so the default is real mode. The service comment states "never fall back to mock data after a live error" (`src/services/owedbook.ts:167`).

| Surface | Real mode behaviour | Evidence |
|---|---|---|
| Store list and capability | REAL — `tenant_stores` RPC; first reachable store auto-selected; store selector | `tenantScope.ts:13-19`; `OwedBookContext.tsx:27-33` |
| OwedBook KPIs, rows, summary, PBM options | REAL — `owedbook_kpis`, `owedbook_rows` (25 per page), `owedbook_summary`, `owedbook_pbm_options`, each scoped to the selected store | `src/services/owedbook.ts:152-162` |
| Upload data | UNAVAILABLE — throws "Not available in this release." | `owedbook.ts:163` |
| Admin: My Stores, store detail | REAL read — `admin_stores` | `src/services/adminDemo.ts:368-375` |
| Admin: members | REAL read — `admin_members` | `adminDemo.ts:381-383` |
| Admin: billing | REAL read of status only — `admin_billing_status`; plan shown as "unavailable", price as "Price unavailable", dates as "Billing dates unavailable" | `adminDemo.ts:390-395`; `BillingRow.tsx:26` |
| Admin: audit | REAL read — `admin_audit`, account-wide for owners | `adminDemo.ts:401-406` |
| Admin: settings | name is real; other fields "Unavailable"; editing unavailable | `adminDemo.ts:412-413`; `SettingsForm.tsx:68` |
| Invite member, resend, suspend, unsuspend, recovery, pending invites | UNAVAILABLE | `adminDemo.ts:387`; `InviteMemberForm.tsx:72`; `MemberRow.tsx:63-98` |
| Add store | UNAVAILABLE — disabled button | `AddStoreButton.tsx:57` |
| Manage payment, cancel subscription | UNAVAILABLE — disabled | `adminDemo.ts:398`; `BillingRow.tsx:52-65` |

Still true (SOURCE):

- The app performs **no customer data write**. Its only writes are sign-in, sign-out and password change.
- The service-role factory `src/utils/supabase/admin.ts:20` still has no consumer in `src/`. Seeding and apply are scripts (`scripts/seed/*`, `scripts/apply-forward.mjs`), not app paths.
- The mock services remain in the bundle for demo mode. In demo mode the admin gate falls back to the platform `admin` role (`(admin)/layout.tsx:19-20`).
- Billing is still presented per store in the UI while the schema is per account; in real mode each store row shows its account's latest subscription status.

RECEIPT: the data behind these reads on DEV is synthetic — seven synthetic users and 250 claims (`CLOSEOUT.md:9`). No real customer account exists in any record I read.

### 3.5 Invitation, magic-link, callback and session behaviour

APBM003 did not touch the auth path (no auth file appears in the 59-file diff). SOURCE findings:

| Topic | Current behaviour | Evidence |
|---|---|---|
| Sign-in | password only; no "email me a link" control | `src/app/api/auth/login/route.ts:14`; `src/store/useAuthStore.ts:26-31` |
| Magic-link request | **no code anywhere**: no `signInWithOtp`, `inviteUserByEmail`, `generateLink` or `resetPasswordForEmail` in `src/`. The only mention is a comment that Phase 7 will be a "real Supabase invite (magic link)" | grep of `src/`; `adminDemo.ts:211` |
| Link landing | `GET /api/auth/confirm` calls `verifyOtp` with whatever `type` and `token_hash` the link carries, which establishes a session cookie, then redirects to `next` (default `/`) on the same origin. Failure goes to `/error` | `src/app/api/auth/confirm/route.ts:6-33` |
| `/auth/callback` (code exchange) | absent; no `exchangeCodeForSession` | route tree |
| Invitation landing, first-run or store-landing page | absent. With the default `next`, a confirmed user lands signed in on the public home page | `confirm/route.ts:10` |
| Set-password or forgot-password page | absent. Password change exists only for an already signed-in user | `src/app/profile/ProfileForm.tsx:58` |
| Post-login destination | hard-coded `/owedbook`; no return-to | `useAuthStore.ts:49-52` |
| Session cookie | host-only (no `domain`), `sameSite: lax`, `httpOnly: false`, `secure` when the site URL is https | `src/utils/supabase/server.ts:18-27` |
| Session refresh | `proxy` refreshes and never redirects | `src/utils/supabase/middleware.ts:36-37, 52` |
| Sign-out | `signOut()` with default scope (ends the user's sessions everywhere on that project), then cache purge | `src/app/api/auth/logout/route.ts:7, 14` |
| Known limitation | cross-tab sign-out is not propagated until the next navigation | RECEIPT, `FOLLOW_UPS.md` F-06 |
| Login response | still returns the full session object in JSON | `login/route.ts:42-47` |

What this means for the stated magic-link requirement:

- The landing half already works in principle without a password: a link of type `magiclink` or `invite` that points at `/api/auth/confirm?token_hash=…&type=…&next=/owedbook` signs the user in. **No password is required by the code**, and this report does not propose making one mandatory. The original's wording "set-password page" (S4, F-08, checklist 13) is withdrawn as a requirement; a password becomes an optional convenience the owner may set later from `/profile`.
- The sending half does not exist. Actual dependencies:
  1. Something must issue the link: a service-role call from the provisioning side for the first invitation, and a "send me a sign-in link" request for returning users.
  2. A request control on OwedBook's sign-in page (and PP's), since today a user with no password cannot get in at all.
  3. Supabase email templates that point at the confirm route with `token_hash`, and both origins in the redirect allowlist (LIVE, unverified).
  4. An email sender with acceptable deliverability and rate limits (LIVE, unverified).
  5. With sign-up recorded as disabled, self-service link requests work only for users that already exist, which is the desired behaviour; users must be created by the trusted server path. (INFERENCE from Supabase behaviour; confirm by probe.)
  6. Link lifetime, single-use behaviour and what an expired or already-used link shows — a rule to obtain, plus an error page that offers a fresh link.
  7. `next` handling: the route assigns `next` to the path only, so it cannot leave the origin; an explicit allowlist is still advisable.

### 3.6 Integration points for provisioning and paid-owner recovery

Provisioning (no function or app path exists; SOURCE absence). Against the schema as it now stands, a trusted server path would write:

1. Auth user for the owner (service role). The trigger adds `user_roles = member` and a `profiles` row (`0049`).
2. `accounts` with `owner_user_id` — this alone gives the owner reach to every store in the account (`0048`).
3. `businesses` under that account (NCPDP and NPI both still required; pair-unique).
4. `user_businesses` — **optional for the owner**. Needed only for a store admin or member who is not the owner; at most one `admin` per store.
5. `subscriptions` mirror row on the account.
6. Invitation or magic link to the owner.

Changes from the original's list: no global-role elevation step; no owner membership row; and writes to `accounts` and `subscriptions` are now impossible for any customer session, so the provisioning caller must be service role or a new SECURITY DEFINER function. All write triggers still audit these tables, and an owner can now see account and subscription audit rows through `admin_audit` (`0051:73-77`).

Worked examples exist as scripts, not app code: `scripts/seed/run.mjs`, `scripts/rls-harness/seed.mjs`. Idempotency anchors are unchanged from the original (`subscriptions.stripe_subscription_id` unique; store pair; membership pair; one role row per user); `accounts` still has no natural unique key.

Paid-owner recovery — what exists and what does not:

| Situation | Today | Dependency |
|---|---|---|
| Owner paid, link never arrived or expired | nothing; no resend path, and no self-service request control | resend from the provisioning side, plus the sign-in link request in 3.5 |
| Owner paid with a mistyped email | nothing; changing the auth user's email is a service-role operation with no screen or runbook | operator procedure with identity check and audit |
| Provisioning half-finished after payment | no operation record; partial rows would be visible only to the service role | idempotent, re-runnable provisioning keyed to the payment |
| Owner must be replaced | blocked by FK; deferred to a transfer runbook (RECEIPT, CF-1) | 007B transfer design |
| Operator visibility | no superadmin surface in OwedBook; "platform oversight is the service-role path" (`0016:4-7`) | Mission Control or a scripted operator path — owner undecided |

---

## 4. Database and deployment identity — source, receipts, live

| Statement | Label |
|---|---|
| APBM003 records name three Supabase projects: DEV ("CyberPharma_Dev_v1"), a pilot project excluded from DEV, and a disposable SCRATCH (`APBM_RULINGS.md` A03, lines 79-81) | RECEIPT |
| The project URL hard-coded in PP's `deploy.sh` is the **same project** the APBM003 records call DEV. (Same/different comparison only; identifiers not reproduced.) | SOURCE comparison of a SOURCE value with a RECEIPT value |
| So the portal feedback site, as configured, authenticates against the database that received the 52-migration chain, the corrected trigger, seven synthetic users and 250 synthetic claims on 7 November | INFERENCE from the two rows above |
| OwedBook's tracked `supabase/.temp/linked-project.json` points at a fourth project that is none of DEV, pilot or SCRATCH. It is committed to Git, so it is a stale artefact, not this machine's configuration | SOURCE |
| The original's statement that "the OB checkout is linked to a different project" came from that file and overstated its meaning | correction |
| Which project the deployed OwedBook, Mission Control and each local env file point at today | LIVE — unknown |
| OwedBook holds no deploy script, Dockerfile or cloudbuild file outside `agent_docs`; APBM003 did no deployment; Gate D not run (`CLOSEOUT.md:13`) | SOURCE + RECEIPT |
| OwedBook's documented public host and PP's configured host are sibling subdomains of one parent domain (`APBM_RULINGS.md:30`; PP `deploy.sh:20`) | RECEIPT + SOURCE |
| DEV database and other credentials were exposed in a local transcript; rotation deferred by the Director (`APBM_RULINGS.md:49`, C-05(b)) | RECEIPT — relevant because 007 will add Stripe and service-role secrets to the same environment |

---

## 5. Finding-by-finding correction table

Status meanings: **CONFIRMED** — still true in the new tree. **RESOLVED BY APBM003** — no longer true. **CHANGED** — partly resolved or materially different. **STILL UNKNOWN** — cannot be settled from source.
Findings that never depended on the OwedBook tree are marked **RETAINED** and were not re-inspected.

### 5.1 Prioritised findings (original Section 9)

| ID | Original claim | Status | Correction and evidence |
|---|---|---|---|
| F-01 | OwedBook checkout has no APBM003, pagination or Git | **RESOLVED** (by the new checkout) | Section 2. The claim described an outdated copy |
| F-02 | PP dev copy carries the feedback site's deploy target | **RETAINED — still open** | Not re-inspected beyond HEAD and status; nothing changed. Weight increases: that deployment's database is the APBM003 DEV database (Section 4) |
| F-03 | Trigger takes role from sign-up metadata; sign-up on; fix unbuilt | **RESOLVED BY APBM003** in source and by receipt; live state **STILL UNKNOWN** | `0049:5`; DEV apply and sign-up receipts (3.2). Residual: three superseded SQL files still carry the old trigger |
| F-04 | No owner or billing-authority concept; any member reads account and subscription; owner without membership reads nothing | **CHANGED** | Owner concept and reach: resolved (`0048:2-13`). Billing writes fenced (`0048:28`). Still open: every store member can read subscription rows (`0048:26-27`); store admins see billing status (`0051:49-51`); no "may manage billing" check exists |
| F-05 | Store admins may update every `businesses` column | **CONFIRMED** | `0019:27-30`, untouched. Now also inconsistent: owner cannot update, store admin can. Effective grants are LIVE-unknown |
| F-06 | Apps documented as sharing one project; OB linked to a different one | **CHANGED** | APBM003 DEV equals PP's configured project (Section 4). The "different project" was a stale tracked file. Per-app live inventory **STILL UNKNOWN**. The warning stands and is sharper: OwedBook's destructive harness scripts must never target DEV (the records fence them to SCRATCH, `APPLY_CHECKPOINT.md` closing rule) |
| F-07 | PP has no Stripe, webhook, server state or provisioning | **RETAINED** | — |
| F-08 | No invitation landing, set-password, forgot-password or store landing; no return-to | **CHANGED** | Store landing now exists for anyone with reach (`/owedbook` auto-selects a store). Still absent: link sending, link request control, first-run landing, return-to. "Set-password page" withdrawn as a requirement (3.5) |
| F-09 | App reads only `user_roles`; chain not applied; BIM-004/005 not started | **RESOLVED BY APBM003** | Real reads (3.4); chain applied to DEV by receipt (3.2); APBM003 succeeded BIM-004, the apply session and BIM-005 (`APBM_RULINGS.md` R-07) |
| F-10 | PP's SQL files redefine shared objects and the trigger | **RETAINED — impact raised** | On the migrated DEV project they would now overwrite the corrected trigger. The same is true of OB's own `scripts/db-bootstrap-baseline.sql` and `docs/migration_add_profiles.sql` |
| F-11 | SL unsafe as a foundation | **RETAINED** | — |
| F-12 | Two global-role gates stand in for customer authorization | **CHANGED** | OB half resolved: admin portal gates on tenant capability (`(admin)/layout.tsx:15-23`). PP half retained: still platform `admin`/`superadmin` |
| F-13 | Both apps key on NCPDP; NPI format-only or half a composite key | **CONFIRMED** | `0003` unchanged; `admin_stores` returns both (`0051:19`) |
| F-14 | Commercial values are placeholders | **RETAINED** | OB real mode shows "Price unavailable" |
| F-15 | Host-only cookies, no cross-app link, global logout | **CONFIRMED** | `server.ts:18-27`; `logout/route.ts:7`. Cross-tab sign-out delay recorded as F-06 follow-up |
| F-16 | PP lockfile modified and unexplained | **RETAINED — still open** | Same diff hash as the original |
| F-17 | PP copy over-promises | **RETAINED** | — |
| F-18 | Login returns the full session; cookies readable by script | **CONFIRMED** for OB | `login/route.ts:42-47`; `server.ts:25` |
| F-19 | Audit vocabulary lacks business events; account-level rows visible to no tenant | **CHANGED** | Second half resolved: owners read account and subscription audit rows (`0051:73-77`). First half confirmed: actions remain insert/update/delete/read_page |
| F-20 | PP hard-codes project reference and publishable key | **RETAINED** | APBM003 records also name project references in tracked documents; identifiers, not secrets |
| F-21 | PP tooling noise | **RETAINED** | — |
| F-22 | SL service-role helpers lack a test-project guard | **RETAINED** | — |

New findings from this delta:

| ID | Pri | Finding | Evidence | Label |
|---|---|---|---|---|
| D-01 | P0 | APBM003's DEV database is the project PP's deploy configuration uses. Schema, auth-setting, template, allowlist or seed changes for 007 on DEV will be felt by the feedback site, and a PP deploy from the dev copy would point 007 code at the APBM003 data | Section 4 | SOURCE + RECEIPT; live unverified |
| D-02 | P1 | Magic-link access is required but only the landing half exists; password is the only way in today | 3.5 | SOURCE |
| D-03 | P1 | Billing reads are not restricted to the billing owner; store-admin store update is unrestricted and the owner has none | 3.3 | SOURCE |
| D-04 | P1 | One-admin-per-store is now a hard constraint that PP's "someone else as store admin" and any 007B role change must fit | `0048:29` | SOURCE |
| D-05 | P2 | Superseded SQL files that reinstall the metadata-role trigger remain in OB and PP | 3.2 | SOURCE |
| D-06 | P2 | Recorded credential exposure with rotation deferred, in the environment 007 will add payment secrets to | `APBM_RULINGS.md:49` | RECEIPT |
| D-07 | P2 | Privilege hardening (`0053`) is scheduled but not written; the next free migration numbers are therefore contested between that follow-up and 007 | `FOLLOW_UPS.md` F-02 | RECEIPT |
| D-08 | P3 | Tracked `supabase/.temp/linked-project.json` points at an unrelated project and can mislead tooling and readers | Section 4 | SOURCE |
| D-09 | P3 | OB's shared `CLAUDE.md` forces a workflow prompt on every session; cross-repo read-only work has no defined path through it | `CLAUDE.md:10-35` | SOURCE |

### 5.2 Readiness rows (original Section 8)

| # | Item | Original | Now | Note |
|---|---|---|---|---|
| 1 | OwedBook baseline with APBM003 identified | GAP | **RESOLVED** — READY | `bc4e433` |
| 2 | OwedBook Git identity | GAP | **RESOLVED** — READY | clean clone of the organisation repository |
| 3 | PP baseline tied to Gate-Q snapshot | NOT VERIFIED | RETAINED | — |
| 4 | PP lockfile state | DECISION NEEDED | RETAINED — unexplained | not touched |
| 5 | PP deploy target separate from feedback site | GAP | RETAINED — GAP | not touched |
| 6 | Supabase project for 007 engineering | DECISION NEEDED | **CHANGED** — DECISION NEEDED | the choice is now concrete: build on DEV, which the feedback site shares, or on a dedicated project |
| 7 | Installed schema on that project | NOT VERIFIED | **CHANGED** — receipt says 52 migrations on DEV as of 7 Nov; live STILL UNKNOWN | — |
| 8 | Sign-up off and trigger corrected | NOT VERIFIED | **RESOLVED BY APBM003** in source and by receipt; live STILL UNKNOWN | — |
| 9 | Single migration chain agreed | DECISION NEEDED | **CHANGED** | OB's chain is now a forward-only ledger with a runner (`scripts/apply-forward.mjs`) and a Director apply checkpoint; a de-facto single chain exists. Decision narrows to where PP's billing tables go and who takes `0053` |
| 10 | Account-owner and billing-authority model | GAP + DECISION | **CHANGED** | owner exists; billing-read scope and "manage billing" authority still to decide |
| 11 | Store update column restriction | GAP | **CONFIRMED** — GAP | — |
| 12 | Provisioning function or contract | GAP | **CONFIRMED** — GAP | simpler than first described (3.6) |
| 13 | Invitation landing, set-password, store landing in OB | GAP | **CHANGED** | store landing exists; magic-link sending and request are the gap; set-password dropped |
| 14 | OB app reads real store data | GAP | **RESOLVED BY APBM003** | — |
| 15–18 | Stripe sandbox, CLI, PP integration, webhook design | as original | RETAINED | — |
| 19 | Pharmacy identifier decision | DECISION NEEDED | **CONFIRMED** | — |
| 20–21 | Commercial rules; multi-store billing confirmation | DECISION NEEDED | RETAINED | — |
| 22 | Email sender and templates | GAP | **CONFIRMED** — now on the critical path because access is by emailed link | — |
| 23 | Redirect allowlist for both origins | NOT VERIFIED | **STILL UNKNOWN** | — |
| 24 | Cross-app login model | DECISION NEEDED, with a recommendation | **CHANGED** — DECISION NEEDED, recommendation withdrawn | see 6.2 |
| 25 | Logout scope | DECISION NEEDED | **CONFIRMED** | both apps sign out globally |
| 26, 28 | PP specification value; SL reusable parts | READY | RETAINED | — |
| 27 | OB schema, helpers, audit as a base | READY as source only | **CHANGED** — READY, and applied to DEV by receipt | — |
| 29 | Fresh build, type-check, test results | NOT VERIFIED | **CONFIRMED** NOT VERIFIED | APBM003 receipts report 40 suites / 201 tests passing at closeout; inherited, not re-run |
| 30 | Feedback deployment live and undisturbed | NOT VERIFIED | **STILL UNKNOWN** | — |

### 5.3 Seams (original Section 7.4)

| # | Seam | Status | Now |
|---|---|---|---|
| S1 | Billing-owner model | **CHANGED** | Owner helper exists. Remaining 007A work: restrict billing reads to those meant to see them, and define the manage-billing check |
| S2 | Store update policy | **CONFIRMED** | Still needed before real account links and Stripe ids are stored |
| S3 | Subscription shape for multiple stores | **CONFIRMED** | `subscriptions` unchanged |
| S4 | Invitation landing and set-password in OB | **CHANGED** | Becomes "magic-link issue, request and landing". No mandatory password |
| S5 | Owner's global role | **RESOLVED BY APBM003** | Owner stays platform `member`; authority comes from ownership |
| S6 | Locked-out paid owner | **CONFIRMED** | Nothing exists (3.6) |
| S7 | Store-admin invitation at registration | **CHANGED** | Still a scope decision, now constrained by one admin per store, and the owner already has full reach without being store admin |
| S8 | Lifecycle effects on access | **CONFIRMED** | Status is displayed read-only; no access effect coded |
| S9 | OB backend readiness | **RESOLVED BY APBM003** for reads | Writes remain entirely unbuilt and deferred to 007 by `FOLLOW_UPS.md` |

### 5.4 Questions (original Section 10)

- **Answered:** Q-T1 (baseline located). Q-J4 (owner's platform role: `member`; pages gate on capability). Q-J9 (OwedBook backend reads were delivered by APBM003).
- **Partly answered by receipt, live confirmation still wanted:** Q-T6 (chain applied to DEV; sign-up recorded off). Q-T5 (DEV and PP's configured project are the same; the rest of the inventory is open).
- **Reframed:** Q-J1 — ownership is derived from `accounts.owner_user_id`; the open part is whether billing authority is exactly "owner" and how transfer will work. Q-J2 — adds "who takes migration `0053`". Q-J6 — see 6.2; the earlier recommendation is withdrawn. Q-J10 — owners can now read account-level audit rows; business-event vocabulary remains open.
- **Unchanged:** all other Tony, JARVIS/Friday and Coach/Frank questions.

---

## 6. Revised cross-app conclusions

### 6.1 Purchase-to-OwedBook path (only the steps that changed)

| Step | Original | Now |
|---|---|---|
| 7. Provision account, store, membership, subscription | no function; tables exist only as unapplied migrations | no function; tables exist and are applied to DEV by receipt; owner needs no membership row or role change; customer sessions cannot write account or subscription rows |
| 8. Create owner login and send link | no send code in any repository | unchanged; trigger now safe by source |
| 9. Owner opens link and reaches their store | confirm route only; no set-password; app never reads store tables | confirm route signs the owner in without a password; `/owedbook` then loads their first store with real data. Missing: `next` set to `/owedbook` in the link, an error path offering a fresh link |
| 10. Owner returns to manage billing | two separate mocks, no link | OB shows real read-only billing status with actions disabled; PP dashboard is still a mock; no link either way |
| 11. Lifecycle reflected in access | none | status shown; no access effect |

Ownership of operations is unchanged from the original, with one clarification: OwedBook now owns real customer admin **read** views; all admin **writes** are unassigned and unbuilt.

### 6.2 One sign-in across both apps — options and dependencies (no option is approved here)

The original recommended shared credentials with a separate session and sign-in on each host. **That recommendation is withdrawn.** It amounts to separate cross-app sign-ins and assumed a password. The facts and options:

Facts (SOURCE): both apps use host-only cookies; neither has a hand-off route; both sign out globally. Both hosts are recorded as siblings under one parent domain. Both use the same Supabase project by configuration and receipt.

| Option | What the user experiences | Actual dependencies | Main risks |
|---|---|---|---|
| A. Separate session per app, each by magic link | two emailed links, one per app | link request control in each app; both origins allowlisted | two sign-ins — the thing not approved; double email dependency |
| B. Shared session cookie on the parent domain | one sign-in covers both | both apps on sibling hosts of the same parent (recorded so); same Supabase project (so same cookie name); a `domain` option added in both apps' cookie handling — in OB that is `server.ts`, which carries the KIP-1 "modernise when touched" rider; coordinated refresh and sign-out | cookie is sent to every other app on that parent domain; cookies are script-readable today (`httpOnly: false`); local development needs a different arrangement |
| C. Server-side hand-off | one sign-in; moving between apps is a redirect that silently establishes the second session | a server route in the app the user is leaving that mints a one-time token for the signed-in user (service-role capability) and redirects to the other app's confirm route; strict target allowlist; short lifetime | introduces service-role use in a user-facing request path; must be audited and rate-limited |
| D. Single origin for both apps (path routing) | one site, one session | load balancer or proxy in front of two Cloud Run services; base-path changes in one app | infrastructure change; touches the feedback site's address |

Dependencies common to every option: the magic-link sending half (3.5), the email sender, the redirect allowlist, a logout-scope decision, and return-to support so a link can drop the user on the page they were heading for.

### 6.3 Migration chain

OwedBook's chain is, in practice, already the single chain for the shared schema: forward-only, ledgered, with a rehearsed runner and a Director-only apply checkpoint (SOURCE `scripts/apply-forward.mjs`; RECEIPT `APPLY_CHECKPOINT.md`). 007 inherits that procedure, including its backup and rehearsal expectations and the recorded limitation that a full restore was never demonstrated (`APBM_RULINGS.md` C-02). Open: placement of PP's billing-side tables, and the numbering clash with the scheduled `0053_privilege_hardening`.

---

## 7. Revised 007A / 007B dependencies

### 007A — owner registration to first store

| Area | Dependency | Was |
|---|---|---|
| OB schema | restrict billing reads; manage-billing authority check; column-restricted or function-based store update; account-level Stripe customer home; identifier constraint per decision; privilege hardening sequenced with it | trigger correction and owner concept are no longer needed — delivered |
| OB app | magic-link landing with `next=/owedbook` and a fresh-link error path; "send me a sign-in link" on the sign-in page; link to billing in PP; return-to support | "set-password page" removed; "store landing" and "read store membership" delivered |
| Provisioning | idempotent service-role operation: auth user → account → store(s) → optional non-owner store admin → subscription mirror → link | no role elevation, no owner membership |
| PP | unchanged from the original 7.2, except its staff gate should move to tenant capability via `tenant_stores()` or an equivalent, matching what OB now does | — |
| Cross-app | choose among options A–D in 6.2 **before** 007A is scoped; it decides whether cookie code in both apps changes | previously assumed |
| Recovery | resend link; operator correction of a wrong owner email; visibility of half-finished provisioning | unchanged |
| Environment | database choice given D-01; live confirmation of trigger, sign-up switch, allowlist, templates, sender | sharper |

### 007B — growth and governance

Unchanged in substance: paid Add Store, member and store-admin management, sole-admin recovery, ownership transfer, lifecycle access effects. Adjustments: OB's read views for these already exist, so 007B on the OwedBook side is mostly turning disabled controls into audited writes; every role change must respect one admin per store; owner transfer must work with the owner FK that deliberately blocks deletion.

### Split assessment

The two-module split still holds. Of the six seams the original wanted pulled into 007A, **S5 is delivered and S1 and S4 are smaller**; S2, S3 and S6 still belong in 007A. S9 is no longer a hidden dependency. The new item that must be settled before either module is scoped is the sign-in model (6.2).

---

## 8. Smallest remaining preparation list

In order; none of it was done during this recon.

1. **Portal deploy target** — retarget or disable the deploy files in the PP dev copy so it cannot overwrite the FFM feedback site. (Tony)
2. **Portal Git remote** — the dev copy's origin is a personal account, not Cyberize-Group; decide and move before 007 commits land. (Tony)
3. **Portal lockfile** — the pre-existing `package-lock.json` modification is still unexplained; keep or restore, then record why. (Tony)
4. **Database for 007** — decide whether 007 builds on DEV, which the feedback site shares, or on a dedicated project; record which project each deployed app and env file uses. (Tony, with JARVIS)
5. **Live confirmation, read-only** — on the chosen project: migration ledger at 52, `handle_new_user` body, sign-up switch, effective grants on `businesses`, redirect allowlist, email templates and sender. (Tony authorises; probes L1–L3 of the original)
6. **Sign-in model** — choose among options A–D with magic link as the access method. (JARVIS/Friday propose; Tony decides)
7. **Schema-shaping decisions** — billing-read scope and manage-billing authority; store update restriction; subscription shape for multiple stores; billing-table placement and who takes migration `0053`. (JARVIS/Friday)
8. **Business rules** — NPI versus NCPDP; link lifetime; "someone else as store admin" under one admin per store; pricing and lifecycle. (Coach/Frank)
9. **Stripe sandbox and email sender** — verify and record, as in the original. (Tony)
10. **Credential rotation** — decide whether the deferred rotation happens before payment secrets join the environment. (Tony)

Items 1–6 are the minimum before JARVIS can write 007A against a fixed target.

---

## 9. Limits and checks not run

- No fetch: remote state is the local tracking ref only.
- No build, type-check, lint or test was run; APBM003's passing results are inherited receipts.
- No database, Supabase, Stripe, Cloud Run or email call was made. Every statement about installed schema, sign-up, grants, templates or deployments is SOURCE or RECEIPT.
- Real env files were not opened. Project identifiers were compared for equality only and are not reproduced.
- I read the APBM003 state, rulings, closeout, follow-up, apply-checkpoint and ownership-contract records in part (first lines of long entries), not every evidence file; the 2,705-line architect review was not read.
- Effective table grants (relevant to F-05) come from default privileges, not from migration text, so source alone cannot settle them.
- PP and SL were re-checked only for HEAD, status, diff hash and remote.

**Integrity at close:** OwedBook `bc4e433…`, clean, unchanged. PP `c89572a…` with the same single pre-existing lockfile diff. SL `9c2527b…`, clean. The only file written is this report.
