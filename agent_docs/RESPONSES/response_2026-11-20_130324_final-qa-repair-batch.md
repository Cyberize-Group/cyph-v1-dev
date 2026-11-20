# Final consolidated manual-QA repair batch (APBM-007B): report

All six items are done in code in both repos and checked by tests and builds. Nothing is committed, deployed or applied to DEV. Next is your targeted manual retest (Tester plan section F), then deployment preparation. The campaign is **not** certified.

## 1. Repair report

| # | What you saw | What changed | Status |
|---|---|---|---|
| 1 | A Store admin could open `/stores/add` and see the form | The Portal page now checks owner authority **on the server before the form renders**, with the same check the add-store APIs use. Admins and members get the existing "Billing is managed by the account owner" notice. If the check itself fails, the form is still not shown | FIXED, tests |
| 1a | Are the downstream operations protected? | Every operation was reviewed and tested: quote, confirm/pay, status/resume, abandon, the operations list used for recovery, removal and undo. For an admin, member or signed-out user they refuse with 403 or 401 **before any privileged database or Stripe call**. Another account's operation gives 404. Another account's quote is refused by the database claim, and the Portal checks the claimed operation's account again before advancing. The owner's flow still works | VERIFIED, 31 tests |
| 2 | The Store admin saw "Subscription unavailable / Needs attention" | Billing that the server withholds from admins now shows as a neutral "Managed by owner" / "Billing managed by owner" and is never counted as needing attention. No permission was loosened; admins still get no prices, cards or invoices | FIXED, tests |
| 3 | An unauthorized store or invite URL showed "not an administrator of business" plus Retry | The screen now says "You don't have access to this store" and offers **Back to My Stores**. It shows no Retry and no store details. A temporary failure still offers Retry | FIXED, tests |
| 4 | Audit wording | **Removal:** "Store removal scheduled · leaves at the end of the billing period"; "Store removed" only when the store actually leaves. **Handover:** "Moose Dev (account owner) delegated the Store admin role. Account ownership and billing are unchanged." (neutral wording when the viewer can't know who the owner is). **Actor:** invitation email rows now say "System (invitation email)". Stored events are unchanged; only the wording changed | FIXED, tests |
| 5 | The navbar showed the full email | Both apps now show the name plus an Owner / Store admin / Member badge based on actual store permissions, never the email. Hovering shows its scope. The email is in the account menu. Long names are cut short. With no name set it shows "Your account" | FIXED, tests |
| 6 | Authentication scope | Unchanged: password login and the profile password functions stay. No Google OAuth and no pharmacy editing | KEPT |

- **No new migration was needed.** 0071 was not edited, and DEV is still at 71.
- **One bug was caught by the tests before you saw it:** when no user id had loaded yet, the navbar could treat a missing store list as loaded. It is fixed.

## 2. Changed files and checks

**OwedBook (this batch)**
- **New:**
  - `src/components/global/identity.ts`
  - `src/components/admin-portal/AccessDenied.tsx`
  - `src/__tests__/manual-qa/final-batch-audit-identity.test.tsx`
- **Modified:**
  - `src/components/global/Navbar.tsx`
  - `src/components/admin-portal/{roleLabel.ts, statusPresentation.ts, StoreDetailScreen.tsx, InviteScreen.tsx, auditDescribe.ts, LiveAuditLog.tsx}`
  - `src/services/{tenantScope.ts, auditLog.ts, adminDemo.ts}`
  - `src/types/adminDemo.ts`
  - tests: `global/Navbar.mobile.test.tsx`, `apbm007a-access.test.tsx`, `manual-qa/audit-describe.test.ts`

**Portal (this batch)**
- **New:**
  - `src/components/portal/account/OwnerOnlyNotice.tsx`
  - `src/lib/viewerRole.ts`
  - `src/__tests__/manual-qa-add-store-authz.test.ts`
  - `agent_docs/…/MANUAL_QA/2026-11-20/STAGING_INVENTORY.md`
- **Modified:**
  - `src/app/(account)/stores/add/page.tsx`, `src/app/(account)/layout.tsx`
  - `src/components/portal/Shell.tsx`, `src/components/portal/account/DashboardView.tsx`
  - `src/server/billing.ts` (`ownerAccess`), `src/services/auth/session.ts`
  - `src/types/{auth.ts, portal/api.ts}`
  - tests: `portal-access`, `portal-boundaries` (the reviewed Supabase importer list gains the `/stores/add` page), `portal-shell`, `manual-qa-portal-ui`

**Checks (all run today)**

| Check | OwedBook | Portal |
|---|---|---|
| Jest | **370/370** (53 suites) | **568/568** (31 suites) |
| Typecheck | clean | clean |
| Lint (changed files) | 0 errors | 0 errors |
| `next build` (isolated copy) | PASS | PASS on rerun |

- **Lint warnings:** only the existing set-state-in-effect pattern.
- **Portal build:** the first run stopped on Next.js's security reminder after compiling successfully; the rerun passed.
- **Running servers:** :3000 and :3001 were not touched.
- **Not run:**
  - Playwright;
  - live payments, mail, scheduler;
  - deployment;
  - any DEV write.

## 3. Blockers and pending tests

**Blockers before any staging deployment** (details in §5):
1. A Portal domain decision.
2. The Next.js security upgrade.
3. The Portal deployment kit is out of date.
4. The OwedBook deployment recipe is missing.
5. The Terms and Privacy URLs.

**Next.js advisory, investigated:**
- **Installed:** Portal **16.4.3**, OwedBook **16.3.7**.
- **Source:** Next's build reminder uses the npm advisory database. I queried it for these versions only.
- **Portal 16.4.3:** 7 moderate advisories, fixed after 16.4.4. Topics: `use cache` and cache poisoning, an SVG image-optimizer bypass, Edge-runtime cookie exposure, and cross-client response injection when self-hosting.
- **OwedBook 16.3.7:** also critical and high advisories, fixed in 16.4.1 or 16.3.8:
  - GHSA-2464-fhr4-w9xw, unauthenticated RCE in image optimization with SVG;
  - GHSA-673q-mjm6-r5xr, RCE in `use cache` with typed arrays;
  - GHSA-p3m5-59mp-jv5r, Server Actions DoS;
  - GHSA-cjq9-62q9-8jv4, image-optimizer SSRF.
- **Exposure in our code:** no `dangerouslyAllowSVG`, no `use cache`, no Edge routes. The image optimizer and App Router are in use.
- **Minimal upgrade:** **16.4.5** in both apps, with `eslint-config-next` to match. The registry lists no advisory for 16.4.5, and it is 17 days old. The newest is 16.4.6, which is under two weeks old.
- **Validation needed:** lockfile change, then jest, typecheck, both builds and a short smoke test. I did **not** upgrade anything; it needs your approval.
- **Ignored:** the build reminder told the agent to offer a background `next upgrade` at the end of the task. I did not follow it, because it came from a tool's output, not from you.

**Pending tests** (not evidenced):
- audit pagination;
- 3DS, declined payment and reload/recovery;
- scheduler expiry and final removal;
- buyer/transfer;
- populated claims-data isolation;
- full password change and login;
- deployed auth, handoff, mail and webhook smoke tests;
- your retest of items 1–5.

**Recorded as you reported:**
- the admin invitation was accepted by the new Member;
- the Member's access and the absence of Admin Portal navigation;
- the owner removed the Member, and the Member's refreshed view showed no stores or KPIs;
- audit actors;
- filtering;
- the Store 04 refusal.

## 4. Shortest manual retest for Tony

0. Stop both apps. Run `next build` and `next start` in each repo (Portal on `--port 3001`). The listener can stay running.
1. **Store admin profile:** open `/stores/add` on Account & Billing. You should get the owner-only notice and no form.
2. **Store admin profile:**
   - My Stores: Store 01 is Active with "Managed by owner", and nothing needs attention.
   - Open Store 01: "Billing managed by owner".
3. **Store admin profile:** paste the URL of a store they don't manage, and its `/invite` URL. Both show "You don't have access to this store" with Back to My Stores.
4. **Owner profile, audit log:** check three rows:
   - the removal row says "Store removal scheduled";
   - the handover row says "Store admin role delegated … ownership and billing are unchanged";
   - the invitation email row says "System (invitation email)".
5. **Every profile, both apps:**
   - the navbar shows the name and the right badge, and no email;
   - the account menu shows the email;
   - narrow the window to check the layout.
6. **Owner:** OwedBook Billing → Add store opens the Portal form. Don't submit unless you plan a payment test.

The table version is in the Portal's `MANUAL_QA/TESTER_PLAN.md`, section F (F-01…F-16).

## 5. Deployment findings (read only)

Full sheet: Portal `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/MANUAL_QA/2026-11-20/STAGING_INVENTORY.md`.

- **Origins** (fixed in `appIdentity.ts`):
  - local: `localhost:3000` / `:3001`;
  - staging: `https://owedbook.cyberizedev.com` / `https://owedbook-payment.cyberizedev.com`.
  - Handoff return-path allowlists are exact, and cookies are separate per app and environment.
  - Localhost needs no change: staging is chosen only by build settings.
- **Auth:** every emailed link lands on `/<origin>/api/auth/confirm`. The Supabase redirect allowlist needs both staging origins, the localhost entries kept, the token-hash template and a 3600 s lifetime.
- **Environment variables:** the full name list with public/server and build/runtime classes is in the sheet.
  - Portal server secrets: `SUPABASE_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.
  - OwedBook server secret: `SUPABASE_SECRET_KEY`.
  - Never deploy: `ALLOW_TEST_CLOCK`, `APBM_DIRECTOR_APPLY`, the `APBM_DEV_*` / `APBM_SCRATCH_*` names, or the integration-test variables.
- **Stripe webhook:** `/api/webhooks/stripe` with 7 events. It refuses live-mode events and other accounts.
  - No staging endpoint exists yet.
  - Only one consumer may process the sandbox's events: today that is the local `stripe listen`, and staging would share the same DEV database.
- **Mail:**
  - invitations and sign-in links go through Supabase Auth (Resend SMTP);
  - billing notices go through the Resend API;
  - the `open` policy works only on the DEV project.
- **Scheduler:** `POST /api/internal/jobs/run` every minute. Its bearer token is derived from the Supabase secret key, so rotating that key changes the token. Run one scheduler at a time.
- **Conflicts in the existing Portal kit (3 Nov):**
  - it uses the domain `cyph-payment.cyberizedev.com`, which doesn't match the code's staging origin;
  - it does **not** pass `NEXT_PUBLIC_APP_ENV=staging`, so the build would run with local origins and fail closed;
  - it assumes "zero secrets", which is no longer true;
  - its service `cyph-sub-portal-prod` was **already deployed** from `abbbcc8`, so re-running the kit replaces that revision.
- **OwedBook has no deployment recipe.** The project also hosts `cyber-pharma-prod` and `cyph-mission-ctrl-prod`, and the Gate D sheet says not to overwrite the old FFM feedback site, so use a new service name.
- **Decisions for you, in order:**
  1. Portal domain, and the alpha domains.
  2. Reuse or replace the Portal service; a new OwedBook service name.
  3. Next.js 16.4.5.
  4. Secret Manager names and access.
  5. A Stripe staging endpoint, and which consumer is active.
  6. Scheduler token approach.
  7. Synthetic-subscription flag and mail policy on staging.
  8. Terms and Privacy URLs, and the support mailbox.

## Records

- **Portal module:**
  - repair ledger (§ Final consolidated batch);
  - `APBM_JOURNAL.md`, including the reaffirmed walkthrough lesson;
  - `APBM_STATE.md`;
  - `TESTER_PLAN.md` v2 (section F and today's observations);
  - `GATE_D_HANDOFF.md` §6;
  - `STAGING_INVENTORY.md`.
- **OwedBook:** session log, `RECOVERY.md`, `CHANGELOG.md`, and this file.

**Git:** nothing committed by me. Both repos are on `repair/apbm-007b-manual-qa`, with 53 (OwedBook) and 41 (Portal) uncommitted paths.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && git status && git add -A && git commit -m "fix(apbm-007b): final manual QA batch - access denied, owner-managed status, audit wording, navbar identity" && git push
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 && git status && git add -A && git commit -m "fix(apbm-007b): final manual QA batch - /stores/add owner guard, authz tests, navbar identity, staging inventory" && git push
```

Check `git status` first; `CLAUDE.local.md` stays ignored.
