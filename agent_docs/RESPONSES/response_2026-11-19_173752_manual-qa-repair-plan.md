# Manual QA repair round (19 Nov 2026) — baseline and plan

PENDING APPROVAL. Nothing has been edited yet. The source is the Director's consolidated repair order from Tony and JARVIS's manual walkthrough, 19 November 2026.

## 0. Baseline (read-only, 17:31 Asia/Dhaka)

| Repo | Branch | HEAD | `origin/main` | Working tree |
|---|---|---|---|---|
| OwedBook `cyph-v1-dev` | `main` | `64295a742aa25e46fdf8b3f31e18b561c86ee596` | same | today's records only: `RECOVERY.md` modified; untracked session, 7 responses, 2 evidence lanes |
| Portal `cyph-payment-portal-dev-v1` | `main` | `0443fda34217b2eb94d44b19b4a106e107a1c2e8` | same | `CHANGELOG.md`, `GATE_D_HANDOFF.md` modified (§5 of today) |

- **DEV:** migration 70. Both apps run `next start` against DEV (:3000/:3001), with Stripe test mode and `stripe listen` running. The jobs runner is not running.
- **Campaign records:** these live in the Portal at `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/` (`APBM_STATE.md`, `APBM_JOURNAL.md`, `APBM_RULINGS.md`, `AMENDMENT_LEDGER.md`, `CONTRACTS/`).
  - Gate Q was certified as PASS WITH KNOWN RISK on the pair `ba66534`/`855e0ad`, and that pair is now merged to `main`.
  - Gate D is pending.
  - No tester plan for Coach and Frank exists yet. `QAM/QAM_TEST_PLAN.md` is Cody's executed Q1 plan and is historical.

## 1. Root causes found (code and schema read)

| # | Finding | Actual cause |
|---|---|---|
| R1 | OwedBook "Add store" disabled | `AddStoreButton.tsx:57` hard-codes a disabled button in real mode. The Portal already accepts `/stores/add` as a handoff destination (`appIdentity.ts:53`, in both apps). Signup screens still say "not available yet" in 5 places (`ReviewView.tsx:254`, `PlanView.tsx:60`, `PharmacyStepView.tsx:139`, `PharmacyFields.tsx:169,172`). |
| R2 | No busy feedback | These controls only set `disabled={busy}`: `AddStoreFlow.tsx` (quote, pay, cancel), `StoreRemovalControl.tsx`, and OwedBook `LiveStaffPanel.tsx` (invite, resend, revoke, remove). The DashboardView portal/undo buttons already show spinners. |
| R3 | Add-store payment ambiguity | `settlePayment` (`storeOperations.ts:325-343`) makes **one** off-session `invoices.pay`. It records Stripe's error code in `provider_call_intents`, but `payment_pending` is shown the same way for 3DS, decline and processing (`AddStoreFlow.tsx:116-121`). The hosted invoice page has no return URL, and the operation id lives only in React memory, so leaving the page loses it. `GET /api/stores/operations` exists but nothing calls it. |
| R4 | Remove member without confirmation | `LiveStaffPanel.tsx:108` posts immediately. The server (`member_remove`, 0064:205) already checks authority, refuses the admin, and refuses a store admin removing the owner. |
| R5 | Owner shown as Member/Store admin | **Labels:** Profile uses the platform `user_roles` table ('member' for everyone, 0049). The owner's store row is `'admin'` (0069:185, 0070:141), so lists say "Store admin". "Owner" appears nowhere in the UI. **Authority:** the owner's power comes from `accounts.owner_user_id` and `store_manager_role()` returns 'owner' before 'admin', so the owner keeps owner authority in every RPC. **Real gap:** `invitation_accept` demotes an owner-incumbent row to 'member' (owner removal is already blocked at 0064:174). The UI offers "remove" for the owner and never says who the incumbent is. `admin_members` and `store_invitations_list` do not say who the owner is, so an admin's screen cannot label the owner. |
| R6 | Settings placeholder | `SettingsScreen` reads only the first store, and `getSettings` hard-codes "Unavailable". `businesses` holds address, city, state, zip, phone and `pharmacy_software_system` (registration persists these, 0069:178-183). Add Store collects only name, NPI and NCPDP. No RPC returns the other fields. RLS would allow a direct, unaudited table read; I will not use it. |
| R7 | Profile | The badge comes from `user_roles` (see R5). Name and email are disabled with "Contact an admin…", but no admin workflow exists. Password: client `updateUser`, minimum 8 characters, matching confirmation, a visibility toggle, and a spinner already. |
| R8 | Audit unreadable | `admin_audit` returns only `table_name`/`action`/`context`, with no old/new data and no actor name. The client hard-codes "done" and slices the ISO string (`format.ts:16`), which shows UTC with no label: the 6-hour gap to Dhaka. Every read RPC logs `read_page`, and these crowd the 100-row page. `p_before` paging exists but is unused. |
| R9 | Removal presentation | `window.confirm` "OK" (`StoreRemovalControl.tsx:12`). "Pharmacies covered" = `subscriptions.quantity`, which is set to the next-renewal quantity at scheduling (0063:214). The stores list still holds the scheduled store. The **billing values are correct; the label is wrong.** |
| R10 | Placeholders and mail | `BRAND.supportEmail = "[SUPPORT EMAIL]"` (Portal `brand.ts:9`) appears in about 8 places; Terms and Privacy show `[LINK TBD]` (`Footer.tsx`, `ReviewView.tsx:267`). `STAGING_AND_GATE_D.md` records `support@pharmacybooks.com` as the business address. App guard: an exact allowlist in OwedBook (invitations) and the Portal (billing notices). Sign-in and access links use Supabase Auth custom SMTP, which no app guard covers. |

## 2. Plan

**Precondition (Tony, Git):** before I edit, create a repair branch in both repos. OwedBook `main` is protected.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && git switch -c repair/apbm-007b-manual-qa
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 && git switch -c repair/apbm-007b-manual-qa
```

Today's uncommitted records move with the branch unchanged.

### Step A — Forward migration `0071_007b_owner_settings_audit.sql` (OwedBook)

It is required for R5, R6 and R8: the browser cannot learn the owner, the store profile or the audit details without it. It is additive, forward-only, and has no data changes. It **replaces** existing functions and adds one new function:

1. **`admin_members` and `store_invitations_list`:** add `is_owner` per member, plus the incumbent admin's identity on the list (`current_admin`: id, name, email, is_owner). Scope and authorization are unchanged.
2. **`invitation_create`:** when the incumbent admin is the account owner, accept only disposition `member`.
3. **`invitation_accept`:** same rule when the incumbent admin is the owner. Owner authority stays with `accounts.owner_user_id`, and the owner's store row stays in place. Today's demotion of the owner's row is what the single-admin index requires, and owner rights already survive it. I will keep that, and record it in the amendment as "owner row becomes member; owner authority unchanged". Adding an `'owner'` row role would mean redesigning the role system.
4. **`member_remove`:** refuse the account owner's row for **any** caller (`owner_protected`). Today only a store-admin caller is refused.
5. **New `store_profile(p_business)`:** for an owner/admin/member of a live store. Returns name, NPI, NCPDP, address, address_line2, city, state, zip, phone, pharmacy_software_system, and records an audited `read_page`.
6. **`admin_audit`:** keep the signature and add optional `p_include_reads boolean default false`. Per row it adds:
   - `actor` (name/email from `profiles`, or null);
   - `detail`, built from a whitelist only: invitation `status` before→after, role, recipient email; membership role before→after plus the member's name/email; store `removal_effective_at`/`status` before→after; subscription `cancel_at_period_end`/`quantity` before→after.
   It returns no other old/new fields, and scoping is unchanged.

Everything else stays the same: definer functions, empty `search_path`, grants, the scoping rules, and no new table. The SQL proof runs on **SCRATCH** (see §4). The DEV apply is a **separate Director release**, needed before the retest, because both local apps use DEV. The app degrades honestly while 0071 is absent: Owner labels only for the signed-in owner, Settings shows only name/NPI/NCPDP plus "Details unavailable until the database update", and audit shows basic labels.

### Step B — OwedBook app

| Repair | Change |
|---|---|
| R1 | `AddStoreButton` real mode becomes a link button to `${peerOrigin()}/api/handoff/start?return=/stores/add`, built through the existing secure handoff and the configured origins. It shows a spinner and "Opening Account & Billing…" on click. Eligibility text: "Adds a paid pharmacy to your subscription. Needs an active subscription with no overdue payment or scheduled cancellation." The Portal re-checks and explains if not. Owner-only (Billing is already owner-only). Remove `unavailableMessage` where it now misleads. |
| R2 | `LiveStaffPanel`: per-action spinner plus action text ("Sending invitation…", "Removing access…", "Resending…", "Revoking…"). `aria-busy` on the button, an `aria-live` result region, and controls restored after errors. |
| R4 | Confirmation dialog with the existing `ui/dialog.tsx`: "Remove {name or email} from {pharmacy}?", the consequence ("They lose access to this pharmacy's data at their next action. Pending invitations to them for this store are revoked."), Cancel and **Remove access**, with progress and the result. |
| R5 | Display role = **Owner** when `is_owner` (or the user is the signed-in owner), else Store admin / Member. Owner rows get no remove action. On the admin invite, the incumbent is named. If the incumbent is the owner: "You stay the owner with full access. {invitee} becomes this store's admin." The disposition options are hidden and `member` is sent. Otherwise the options stay, naming the person. `InvitationsScreen` and other badges get the same label. |
| R6 | Settings: a pharmacy selector (every store from `admin_stores`), then a read-only details card: name, NPI ("read-only"), NCPDP, address, phone, software, with "Not provided" for empty values. No save control. One line: "Changes to these details aren't available yet. Contact support." No fake edit. |
| R7 | Profile badge from `tenant_stores` capability: Owner if any store is owned, else Store admin, else Member (Superadmin kept). Name/email guidance: "Name and email changes aren't self-service yet. Contact support." This is a decision for Tony (§5). The password form keeps its behaviour; the weak-password message from Auth is surfaced as it is today. |
| R8 | Audit: semantic labels from `table_name` + `detail`, for example "Invitation sent / accepted / revoked / expired", "Member removed", "Admin changed", "Store removal scheduled / cancelled", "Subscription cancellation scheduled / undone". There is an honest fallback ("Record changed: {plain table name}") when the detail is insufficient. Also: an actor column ("Unknown" if null); time in the browser's timezone with an explicit zone label (`Intl`, client-rendered); "Show view events" off by default; "Load older" through `p_before`. The result column becomes "Recorded", because there is no outcome field to report. |

### Step C — Portal app

| Repair | Change |
|---|---|
| R1 | Billing page: "Add a pharmacy" becomes a primary `Button` with an icon in the "Pharmacies on this account" header, full-width on mobile. Signup/review/plan copy: "You can add more pharmacies from Billing after this one is active." The disabled "Someone else" admin option is replaced by: "You'll be this pharmacy's admin. After activation you can invite a store admin from OwedBook." This is the supported path (owner-only admin invitation in OwedBook). |
| R2 | AddStoreFlow: spinner plus "Calculating price…", "Processing payment…", "Cancelling…". StoreRemovalControl: "Scheduling removal…", "Keeping store…". Undo cancellation already has a spinner; add "Undoing cancellation…" text. All get `aria-busy`, are restored on error, keep the single `busy` guard, and use `aria-live`. |
| R3 | **Server:** `statusFor` adds `paymentIssue`, derived from the recorded `pay` outcome code: `authentication_required` (`invoice_payment_intent_requires_action`, `authentication_required`), `declined` (`card_declined`, `insufficient_funds`, `expired_card`, …), `processing`, or `none`. I verify the code values against the Stripe SDK 22 error codes and the DEV record of Tony's operation (read-only). No new Stripe call, no retry, no second payment. **UI:** the copy is separated by `paymentIssue` (processing → "Payment processing…"; bank confirmation → "Your bank needs you to confirm this payment"; declined → "Your card was declined. Pay with another card on Stripe's secure page"). The hosted page opens in a **new tab**, from a prominent primary button (a user click, so the browser does not block it), while the app tab keeps polling the server. When the server sees `paid` → `activated`, the tab shows a completion screen: "{store} added", the charged amount, and links "Back to billing" and "Open OwedBook". The op id is saved in `sessionStorage`, and on load `/stores/add` resumes any unresolved add-store operation through `GET /api/stores/operations` (server state). So returning manually or reloading also reconciles. Completion stays server-verified; no redirect is trusted. **Tradeoff:** Stripe's hosted invoice page cannot redirect back. An in-app Stripe.js `confirmCardPayment` with a `return_url` would need a new dependency and lockfile change, which is not approved. So the new tab plus resume is the supported approach. |
| R9 | Removal confirmation uses the existing `ui/alert-dialog.tsx`: "Remove {pharmacy} on {period-end date}?", "It stays fully usable until then. No refund or credit is given." (existing policy copy), with Cancel / **Schedule removal**. Coverage labels: "Active pharmacies now: N" (live stores) and "Billed at next renewal: M" (`subscriptions.quantity`), with "(1 leaving on {date})" when scheduled. No billing logic change. |
| R10 | `BRAND.supportEmail`, Terms and Privacy URLs read `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_TERMS_URL` and `NEXT_PUBLIC_PRIVACY_URL`. When a value is unset, the text says "(not configured)" rather than a bracket placeholder, and links are omitted; nothing is invented. Add them to the env-name templates and the staging checklist. The value `support@pharmacybooks.com` (contract-recorded) needs your confirmation (§5). |

### Step D — Mail policy (both apps; amends `CLOCK_AND_NOTICES.md` §O-2 line 23 per your order)

`mailGuard.ts` (same in both apps) gets `MAIL_RECIPIENT_POLICY=allowlist|open`:

- The default is `allowlist`. `open` is honoured only when `NEXT_PUBLIC_SUPABASE_URL` is the DEV/alpha project `yrsuwikjnbmvpznrgydb`, so any other project, including production, stays allowlist-only.
- Under `open`, a recipient must be a syntactically valid address (no `*`, `,` or spaces). Plus aliases pass.
- `*` and `MAIL_GUARD=off` stay ignored.
- Existing rate protections are kept: invitations allow 5 attempts with 60 s spacing; notices keep their idempotency and 5 attempts.

Unit tests cover the default, the wrong project, `open` with a plus alias, invalid addresses, `*`, and an empty allowlist. Staging instructions cover the app env, Supabase Auth SMTP (Resend `smtp.resend.com:465`, sender `no-reply@cyberizedev.com`, Auth email rate limit), Site URL and redirect URLs, and the Resend domain verification. They are recorded as "not verified".

### Step E — Records

- **Portal campaign folder:**
  - new `MANUAL_QA/2026-11-19/REPAIR_LEDGER.md`, listing each finding, cause, change, check and status;
  - new `MANUAL_QA/TESTER_PLAN.md` for Coach and Frank: one action per row, expected result, actual/evidence, PASS/FAIL/BLOCKED/SKIPPED, browser-profile separation, full Profile coverage, every repair, the outstanding scenarios marked NOT RUN, and resume instructions;
  - appended entries in `APBM_JOURNAL.md`, `APBM_STATE.md`, `APBM_RULINGS.md` (your product decisions, verbatim summary) and `AMENDMENT_LEDGER.md` (the owner model vs `IDENTITY_AND_MEMBERSHIP.md`; the mail policy vs `CLOCK_AND_NOTICES.md`; a migration beyond the 0061–0067 path list);
  - the process lesson (Director manual walkthrough required before release approval).
- **Kept as written:** historical certification and evidence. The unconfirmed member logout is recorded as unconfirmed.
- **Also:** both CHANGELOGs, the session log and `RECOVERY.md`.

## 3. Files

**OwedBook**
- new `supabase/migrations/0071_007b_owner_settings_audit.sql`
- `src/components/admin-portal/{AddStoreButton,LiveStaffPanel,SettingsScreen,SettingsForm,AuditScreen,BillingScreen,statusPresentation,format}.tsx/ts`
- `src/components/invitations/InvitationsScreen.tsx`
- `src/services/adminDemo.ts` (real-mode mappers)
- `src/types/adminDemo.ts`
- `src/app/profile/{page,ProfileForm}.tsx`
- `src/server/mailGuard.ts`
- tests under `src/__tests__/`
- the generated-types delta for the new RPC args
- the 0071 manifest entry is prepared by the apply release, not by me

**Portal**
- `src/components/portal/account/{DashboardView,AddStoreFlow,StoreRemovalControl}.tsx`
- `src/components/portal/{brand.ts,Footer.tsx,PharmacyFields.tsx}`
- `src/components/portal/register/{ReviewView,PlanView,PharmacyStepView}.tsx`
- `src/server/storeOperations.ts` (`statusFor` only)
- `src/server/mailGuard.ts`
- tests
- env-name template

**Not touched**
- applied migrations 0001–0070
- `.env.local` values
- lockfiles
- payment/idempotency/lease/webhook/provisioning logic, other than the read-only `paymentIssue` derivation
- `appIdentity.ts` origins (the alpha-domain decision is pending)
- historical evidence and certificates
- unrouted demo views

## 4. Checks and what needs you

- **I run (no authorization needed):** typecheck, lint and jest in both repos; new unit tests (mail policy, `paymentIssue` mapping, role label, audit labels, the timezone formatter, and the confirmation-dialog flows through Testing Library).
- **Builds:** `next build` in both repos **overwrites `.next` used by your running `next start` servers**. Stop both apps first, or tell me to skip builds until you do. Restart them after.
- **Needs your release (I ask; I will not assume):**
  1. **SCRATCH:** apply 0071 and run the SQL proof: owner protection, scoping, the `store_profile` and `admin_audit` negatives, grants and `search_path`. This is a SCRATCH write.
  2. **DEV read-only:** read Tony's second-store operation and its `provider_call_intents` outcome, to establish what actually happened (no Stripe call).
  3. **DEV apply of 0071** (separate release, after review), needed before the retest.
- **Not run:** Playwright on DEV (it would add DEV data), and anything with a Stripe write, mail send, deployment or Git.

## 5. Decisions needed (repairs proceed meanwhile)

1. **Support email:** use `support@pharmacybooks.com` (recorded in `STAGING_AND_GATE_D.md`)? Terms and Privacy URLs are still missing.
2. **Name/email self-service:** keep it read-only with "contact support" (my recommendation), or allow self-service name edits? An email change needs an Auth confirmation flow and is a policy decision.
3. **Pharmacy detail edits:** still deferred, read-only for now. NPI stays read-only.
4. **Owner-row demotion at admin delegation:** the owner's authority is unchanged, but the database row becomes `member`. Accept, or require a role-model change (outside the scope given)?
5. **Releases:** SCRATCH 0071 proof (§4.1) and the DEV read-only record check (§4.2), now; DEV 0071 apply later.

## 6. Assumptions and risks

- The repair branch is created by you before I edit. If you would rather I edit on `main` locally, say so.
- R3 classification depends on Stripe error codes that were recorded at the time. Operations with an `error` outcome show the generic "needs your action" text.
- 0071 replaces six live functions on DEV once applied. The rollback compatibility of 007A with DEV at 71 must be re-checked in the apply release.
- This is a large batch, about 30 files. I will report in one result with the ledger and tester plan.

→ Awaiting approval before proceeding.
