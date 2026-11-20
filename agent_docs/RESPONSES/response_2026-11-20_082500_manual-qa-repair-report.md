# Manual QA repair round R1–R10: report

All ten findings are repaired in code in both repos and checked: tests, typecheck, builds and a SCRATCH SQL proof. Nothing is committed. DEV is still at migration 70; your retest needs the separate 0071 release on DEV first.

## 1. Baseline and changed files

| Repo | Baseline (branch `main` = `origin/main`) | Changes (uncommitted, in the working tree) |
|---|---|---|
| OwedBook | `64295a742aa25e46fdf8b3f31e18b561c86ee596` | 17 modified, 12 new |
| Portal | `0443fda34217b2eb94d44b19b4a106e107a1c2e8` | 17 modified, 4 new |

The repair branch did not exist yet, so the edits sit on `main` in both working trees.

**OwedBook — new files**
- `supabase/migrations/0071_007b_owner_settings_audit.sql`
- `src/components/admin-portal/{LiveAuditLog.tsx, PharmacyDetails.tsx, auditDescribe.ts, roleLabel.ts}`
- `src/services/{auditLog.ts, storeProfile.ts}`
- `src/lib/support.ts`
- tests: `mail-recipient-policy.test.ts`, `manual-qa/{audit-describe, invitation-mail-policy, owner-staff-settings}`

**OwedBook — modified files**
- `AddStoreButton`, `BillingScreen`, `LiveStaffPanel`, `MemberRow`, `InviteScreen`, `SettingsScreen`, `SettingsForm`, `AuditScreen`
- `profile/{page,ProfileForm}`
- `server/{mailGuard,staff}.ts`
- `services/adminDemo.ts`, `types/adminDemo.ts`
- `scripts/apbm007b/sql-proof.mjs` (26 checks for 0071)
- one updated test, `.env.example`

**Portal — new files**
- `components/portal/BusyLabel.tsx`
- tests: `mail-recipient-policy`, `manual-qa-add-store-states`, `manual-qa-portal-ui`

**Portal — modified files**
- `server/storeOperations.ts`, `server/mailGuard.ts`
- `AddStoreFlow`, `StoreRemovalControl`, `DashboardView`
- `brand.ts`, `Footer`, `PharmacyFields`
- `register/{Review,Plan,PharmacyStep}View`
- 4 test files, the e2e removal spec, `.env.example`

## 2. Status of each finding

| # | Status | In one line |
|---|---|---|
| R1 Add pharmacy | **FIXED** | OwedBook "Add store" opens the Portal's form through the existing secure handoff (owner only); the Portal has a prominent button; the "not available" copy is gone |
| R2 Loading states | **FIXED** | Spinner, action text and `aria-busy` on every action listed; errors restore the controls |
| R3 Payment journey | **FIXED** (live Stripe retest pending) | **Root cause from the DEV record:** the single charge failed with Stripe `missing` because the card lives on the subscription, not on the customer. The charge now uses the subscription's card. Payment states are distinct; Stripe opens in a new tab with a big manual button; polling is bounded; reload resumes; the completion screen appears only after the server confirms. Verified that Stripe's hosted invoice has no return URL |
| R4 Confirm removal | **FIXED** | Dialog names the person and pharmacy, with Cancel and "Remove access" |
| R5 Owner model | **FIXED** (needs DEV 0071 for list badges) | Owner shown everywhere; owner never removable (server, any caller); delegation wording is right; delegated admin gets no billing (proven on SCRATCH) |
| R6 Settings | **FIXED** (needs DEV 0071 for address, phone and software) | Pharmacy selector plus stored details, read-only; "Not provided"; no fake save |
| R7 Profile | **FIXED** | Owner / Store admin / Member badge; accurate support guidance; full password tests are in the plan |
| R8 Audit | **FIXED** (needs DEV 0071 for full wording) | Who, what, pharmacy, details; local time with timezone label; views hidden by default; filter; "Load older" |
| R9 Removal | **FIXED** | Named dialog with date and policy; "Pharmacies with access now" vs "Billed at next renewal" (billing values were already correct) |
| R10 Content and mail | **PARTIAL** | Support address configured. Terms and Privacy show "(link not yet published)" until you supply them. A DEV-only open recipient policy is in code, but staging is not configured |

## 3. Checks actually run

- **Jest:** OwedBook 355/355 (52 suites); Portal 533/533 (30 suites), including new tests for every repair.
- **Typecheck:** clean in both repos.
- **Lint:** no new errors in changed files.
- **Builds:** `next build` passed for both apps, run in isolated copies so your running :3000/:3001 servers were not touched. Twice, Next.js stopped the Portal build after it finished, to show a security advisory for the installed Next.js version; the rerun completed. I did not upgrade anything.
- **SQL proof:** 0071 run on SCRATCH inside transactions that were rolled back, 180/180. Then the committed SCRATCH apply passed, then the committed proof, 180/180. That is 154 existing checks plus 26 new ones covering owner authority after delegation, no billing for the delegated admin, owner removal refused, the scope of the pharmacy-details read, audit details and privileges.
- **DEV:** one read-only transaction, rolled back.
- **Not run:**
  - Playwright (it would write to DEV);
  - live Stripe payments;
  - mail sends;
  - deployment.
- **The test that matters most on retest:** R3-03, a real add-store payment by an owner whose card was saved at registration.

## 4. Steps for you (Tony)

1. **Branch and commit** both repos. OwedBook `main` is protected, so it goes through a PR. Commands are below.
2. **DEV 0071 release:** follow `MANUAL_QA/2026-11-19/DEV_APPLY_0071_PREPARED.md` in the Portal module.
   - 0071 SHA-256: `9a912307…7955`
   - manifest: `403e27b1…9c99`
3. **Rebuild and restart both apps.** The source changed, so `next build` and then `next start` in each repo, after stopping the current servers. 0071 itself needs no rebuild.
4. **Optional:** set `MAIL_RECIPIENT_POLICY=open` in both `.env.local` files so any plus alias works; this only takes effect on DEV.
5. **For time-based tests only:** start the scheduler (command in the tester plan).

## 5. Inputs and decisions still needed

- Terms of Service URL and Privacy Policy URL: required before any outside exposure.
- Confirmation that `support@pharmacybooks.com` is a monitored mailbox.
- Alpha domains versus the frozen staging origins in `appIdentity.ts`: a source change, or matching domains.
- The DEV 0071 release.
- Whether to schedule the Next.js security upgrade. It is out of scope here, and the lockfile change needs approval.

## 6. Where the records are (Portal `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/`)

- **Repair ledger:** `MANUAL_QA/2026-11-19/REPAIR_LEDGER.md`
- **Tester plan (Coach, Frank, Tony):** `MANUAL_QA/TESTER_PLAN.md`
- **DEV 0071 evidence and steps:** `MANUAL_QA/2026-11-19/DEV_APPLY_0071_PREPARED.md`
- **Staging mail and Auth sheet:** `MANUAL_QA/2026-11-19/STAGING_MAIL_AND_AUTH.md`
- **Appended:**
  - `APBM_JOURNAL.md` (includes the mandatory Director-walkthrough lesson)
  - `APBM_STATE.md`
  - `APBM_RULINGS.md` (your decisions)
  - `AMENDMENT_LEDGER.md` (AM-MQ-01…04)
  - `GATE_D_HANDOFF.md` §5 note
- **SCRATCH evidence:** OwedBook `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/manual-qa-0071-scratch/`

## 7. Retest checklist (Tony and JARVIS, in order)

1. **Profile:** the owner's badge says **Owner**, and the support guidance text is correct.
2. **OwedBook Billing:** press **Add store**. The Portal's Add a pharmacy form opens without a new sign-in.
3. **Add a store** with the registered card. You should see:
   - "Calculating price…" then "Processing payment…";
   - the completion screen;
   - both counts up by one;
   - one charge in Stripe.
4. **Add a store with a 3DS or declining test card:**
   - correct wording;
   - Stripe opens in a new tab (or the blocked-tab button shows);
   - the app shows completion after paying;
   - reloading mid-payment resumes it.
5. **People** (after DEV 0071):
   - the owner shows Owner, with no remove option;
   - removing a member asks for confirmation naming the person and pharmacy;
   - choosing Store admin shows the delegation text;
   - invite and accept an admin alias;
   - the admin has no billing access and cannot remove the owner.
6. **Settings:** the selector works and the stored details show; there is no save button.
7. **Audit:** readable rows in your timezone with a label; the filter works; view events show only when included.
8. **Store removal:**
   - the dialog names the store and date;
   - after scheduling, access-now stays the same and billed-at-renewal drops by one;
   - "Keep this store" works;
   - "Undo cancellation" shows busy text.
9. **Footer:** shows the support email and "(link not yet published)" for Terms and Privacy.
10. **Invite a brand-new plus alias** with `open` set: the email arrives.

## 8. Git status (no commits, pushes or merges by me)

- **OwedBook `main`:**
  - modified: product files, `.env.example`, `CHANGELOG.md`, `RECOVERY.md`;
  - untracked: new product files, 0071, the evidence lanes and all session and response records.
- **Portal `main`:**
  - modified: product files, `.env.example`, `CHANGELOG.md`, `GATE_D_HANDOFF.md` and four module records;
  - untracked: new files and `MANUAL_QA/`.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && git switch -c repair/apbm-007b-manual-qa && git add -A && git commit -m "fix(apbm-007b): manual QA R1-R10 - owner model, settings, audit, add store, mail policy (0071 SCRATCH only)" && git push -u origin repair/apbm-007b-manual-qa
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 && git switch -c repair/apbm-007b-manual-qa && git add -A && git commit -m "fix(apbm-007b): manual QA R1-R10 - add store payment journey, busy states, removal dialog, content, mail policy" && git push -u origin repair/apbm-007b-manual-qa
```

Check `git status` before `git add -A`. `CLAUDE.local.md` stays ignored.
