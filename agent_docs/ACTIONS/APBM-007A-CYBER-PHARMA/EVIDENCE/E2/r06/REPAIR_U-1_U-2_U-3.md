# U-1, U-2 and U-3 — engineering UI repair r06

| Field | Value |
|---|---|
| Seat | Engineering repair seat (Claude), on `qa/apbm-007a` in the existing checkouts |
| Authority | JARVIS final bounded UI repair U-1 / U-2 / U-3, 16 November 2026, with the Director's rulings recorded in §6 |
| Reported pair | OwedBook `c976968` → `c976968b20ee724f7390d5e0e008215f50ab6f25`; Payment Portal `54a56b5` → `54a56b55ea7c72783d17d06ff45cd27b5426803f` (both resolved with `git rev-parse` and equal to the checkouts' HEADs) |
| Verdict | Friday owns certification. No finding is closed or reopened by this record |
| Schema and services | No database change, no migration, no new provider integration. No Stripe, Auth, email or payment call in any proof |
| QA state at write | `QAM_STATE.md`: "Q4 a06 — waiting for Director check step N" (Director-gated; QA writes only on request). No QA file written from 14:21:22 until after the transfer; Engineering wrote no QA-owned file (§8) |

## 1. U-1 — route-driven Admin Portal navigation (OwedBook)

**Confirmed cause.** `src/components/layout/AdminSidebar.tsx` rendered the items as cmdk `CommandItem`s. The orange fill came from cmdk's own selection, `data-[selected=true]:bg-accent` in `ui/command.tsx`, where `--accent` is coral, not from the route:
- cmdk selects the first item by default and moves its selection with the pointer and the keyboard.
- The sidebar sits in the persistent admin layout, so that selection survives navigation. A clicked or hovered item stayed filled after leaving it.
- The route only made its own item **bold**, so two items could look selected at once.

**Repair** (`AdminSidebar.tsx`):
- **Links:** the items are plain `next/link` links in a `<nav aria-label="Admin Portal">` inside the same Command panel. The surface-aware single container is kept; the OwedBook FilterRail branch is unchanged.
- **Selection:** `selectedAdminHref(pathname)` returns the one owning item, matched by whole path segment, with a trailing slash ignored. My Stores owns `/admin-portal` and `/admin-portal/stores/*`, so a nested route selects exactly one item, and `/admin-portal/billingx` selects none.
- **Styles:**
  - selected: `bg-primary text-primary-foreground border-primary`, a solid coral fill with white text, and `aria-current="page"`;
  - unselected: `border-transparent hover:border-primary`, a coral outline on hover with no fill;
  - every item: `focus-visible:ring-2 ring-ring ring-offset-2`, a visible coral focus ring with an offset gap that also shows on the filled item.

The mobile drawer already closes on navigation (`AuthedShell`, unchanged).

## 2. U-2 — OwedBook billing details

**Confirmed cause.** Placeholders were written into the real-mode read and the row itself. No data was missing.
- `src/services/adminDemo.ts` `listBilling()` read `admin_billing_status`, kept only the latest subscription's status, and returned `plan: "unavailable"` and `amountLabel: "Price unavailable"` unconditionally.
- `src/components/admin-portal/BillingRow.tsx` set `when = "Billing dates unavailable"` whenever not in demo mode, whatever the row held.

The Payment Portal reads `owner_billing_overview()` (0060) and shows the plan, the pharmacies covered and the next-payment or paid-through date. **It shows no price**, because no price amount exists in any authorized data: the subscription mirror (0055) stores `quantity`, `stripe_price_id`, `promotion_code`, period dates and invoice status, but no amount. The only amounts in the code base are in the Portal's mock fixtures.

**Repair.** OwedBook now reads the **same** owner-only, audited RPC the Portal uses, once per screen, and presents only what the row holds:

| `owner_billing_overview().subscription` | OwedBook row |
|---|---|
| none (or a store of a different account) | "Plan unavailable · Price unavailable · Billing dates unavailable" (unchanged honest state) |
| `origin = 'synthetic_seed'` | "Synthetic test subscription · Not billed · No billing dates" (explicit synthetic label) |
| `origin = 'stripe'`, `quantity` | Plan "OwedBook · N pharmacy/pharmacies"; "OwedBook" when `quantity` is null |
| `origin = 'stripe'` | Price: "Price shown in the billing portal" (a pointer, not a value; see L1) |
| ending or ended (`status = 'canceled'`, `cancel_at` set or `cancel_at_period_end`), `paid_through` | "Paid through <date>" (as the Portal does) |
| otherwise `current_period_end` | "Next payment <date>" |
| a date the row does not hold | "Billing dates unavailable" |
| `status` | the existing status pill (unchanged vocabulary) |

**Unchanged:**
- Owner-only access: a non-owner admin still gets the plain statement and no billing read, and `owner_billing_overview` raises for non-owners anyway.
- Real-mode billing actions stay hidden; the one "Manage billing" link to the Portal remains.
- Demo mode is unchanged.

`BillingLine` gains the optional `coveredStores` and `paidThroughDate`, and `BillingPlan` gains `owedbook` and `synthetic`.

## 3. U-3 — show/hide on every password field (both apps)

**Inventory:**

| App | Field | File | `autocomplete` |
|---|---|---|---|
| OwedBook | sign-in password | `src/components/auth/LoginForm.tsx` | none (kept) |
| OwedBook | profile new password | `src/app/profile/ProfileForm.tsx` | none (kept) |
| OwedBook | profile confirm password | `src/app/profile/ProfileForm.tsx` | none (kept) |
| Payment Portal | password sign-in | `src/app/login/LoginPageContent.tsx` | `current-password` (kept) |

No other password input exists in either app (searched by `type="password"`, `current-password` and `new-password`).

**Repair.** The existing input with one toggle, built with lucide `Eye` / `EyeOff`, already used in both apps:
- **OwedBook:** new `src/components/ui/password-input.tsx` (`PasswordInput`, wrapping `ui/input`); used in the three OwedBook fields. `FormControl` still passes its id and `aria-*` to the real input.
- **Portal:** new `PasswordField` in `src/components/portal/FormField.tsx`, using the same field shell as `TextField`.

Behaviour in both:
- starts hidden;
- the button is `type="button"`, so it never submits;
- its label alternates "Show password" / "Hide password", with `aria-pressed` and `aria-controls`;
- it is keyboard-reachable with a visible focus ring;
- the value is kept, and `onMouseDown` is prevented so the caret stays in the field for pointer users;
- validation and `autocomplete` are untouched;
- nothing is logged or stored.

**Defects found by the production-browser walk and fixed:**
1. **Caret reset.** Chromium puts the caret at the start when an input's `type` changes, and again just after React's commit. Typed text then landed at the front: "abc" + toggle + "X" became "Xabc" (jsdom keeps the caret, so unit tests could not see it). Fix: remember the selection before the toggle, restore it at once, and restore it again on the next animation frame.
2. **Deferred-restore race.** The next-frame restore could land after typing had started and move the caret back: "abcdef" became "abcfde". This was found as a flaky unit test, reproduced, and fixed: the deferred restore runs on the next frame or at the first key press (restoring before the character goes in), whichever is first; a click in the field cancels it.

Deterministic tests cover both, and each fails on the version before its fix.

## 4. Finding → file → test trace

| Requirement | Files | Tests | Browser walk (§5) |
|---|---|---|---|
| U-1: route is the only selection; one item per route; nested routes | `AdminSidebar.tsx` | `layout/AdminSidebar.test.tsx`: 11 route cases; "exactly one item is selected on each admin route" | each theme and width: "on Audit log only Audit log is selected" |
| U-1: click and hover leave no highlight; Audit log ↔ Billing | `AdminSidebar.tsx` | "moving from Audit log to Billing moves the selection" | "after Audit log → Billing only Billing is selected"; "Billing → Audit log moves the selection back" |
| U-1: hover outline, no fill | `AdminSidebar.tsx` | class assertions | "hovering Billing: coral outline, no fill" (1440, both themes) |
| U-1: visible keyboard focus | `AdminSidebar.tsx` | "plain links in a labelled navigation, reachable by keyboard" | "keyboard focus on a nav link shows a visible ring" |
| U-2: plan, pharmacies, dates from the paid row | `adminDemo.ts`, `BillingRow.tsx`, `types/adminDemo.ts` | `admin-portal/BillingDetails.test.tsx` (12); `apbm007a-access.test.tsx` updated to the new RPC | "billing row shows plan, pharmacies, price pointer and next payment"; "no unavailable text" |
| U-2: honest unavailable states | same | "dates the row does not hold stay honestly unavailable"; "no subscription"; "store of another account"; `apbm-admin-readonly.test.tsx` (unchanged, passes) | — |
| U-2: synthetic labelling | same | "a synthetic seed subscription is labelled as such" | "synthetic subscription is labelled and shows no price or dates" |
| U-2: owner/non-owner access, read-only | same | "store admin who is not the owner…"; "billing actions stay unavailable" | "non-owner admin: owner-only statement"; "per-store payment actions hidden" |
| U-3: toggle, value, typing, caret, `aria-pressed`, label, no submit, keyboard | `password-input.tsx`, `LoginForm.tsx`, `ProfileForm.tsx`, `FormField.tsx`, `LoginPageContent.tsx` | `auth/PasswordToggle.test.tsx` (7); `password-field.test.tsx` (5); `auth/AuthPage.test.tsx` button list extended with the toggle | OwedBook sign-in (light-1440, dark-375), OwedBook profile, Portal sign-in (light-1440, dark-375): all U-3 checks |

## 5. Validation and provenance

`provenance.json`: every changed file is byte-identical in the QA checkout, the tested copy (`ARCHIVE/APBM007A_E2_WORK/r06/ob|pp`), the build copy and the proof-build copy.

| Check | OwedBook | Payment Portal |
|---|---|---|
| Full unit suite, tested copy | 309 of 309 (45 suites) | 468 of 468 (24 suites), two consecutive runs |
| Full unit suite, QA checkout | 309 of 309 | 468 of 468 |
| Focused suites, QA checkout | 55 of 55 (`tests/ob_focused.json`) | 13 of 13 (`tests/pp_focused.json`) |
| Candidate control | 29 of 53 fail on the candidate files: every U-1, U-2 and U-3 test plus the updated owner-billing and auth-page assertions (`tests/ob_candidate_control.json`) | 3 of 3 fail (`tests/pp_candidate_control.json`) |
| Caret and race controls | the caret test fails without the caret fix | the caret test and the deferred-restore race test each fail on the version before their fix |
| Repetition | password suite 12 runs, 0 failures | password suite 12 runs, 0 failures |
| Typecheck | clean | clean |
| Lint | 0 errors, 33 warnings (equal to the candidate) | 0 errors, 24 warnings (equal to the candidate) |
| Production build | pass, BUILD_ID `9OByFhSkF29JnwD1RgOU_` (`build_ob.log`; rebuilt after a test-only address change, §8 note) | pass, BUILD_ID `d-YT0KCkhsNaM21RNzIbb` (`build_pp.log`) |
| Client bundle scan | 0 of 9 patterns (`bundle_scan_ob.txt`) | 0 of 9 patterns (`bundle_scan_pp.txt`) |

### Production-build browser walk — FIXTURE PROOF, not live proof

`browser/walk.json` (73 of 73 checks PASS) and 24 screenshots; helpers `helpers/supabase-fixture.mjs` and `helpers/walk-u123.mjs`.

**Setup:**
- **Servers:** both apps run their production builds (`next start`) in disposable proof copies, OwedBook on 3100 (BUILD_ID `emasQGZ_Dd0jeVmF5zQYK`) and the Portal on 3101 (`phm4blmg4b9DiUdZAWxyY`).
- **Proof copies:** identical to the tested bytes except the harness-only origin line (`proof_harness_ob.patch`, `proof_harness_pp.patch`), because QA holds 3000/3001.
- **Supabase:** the builds point at a local stand-in on 127.0.0.1:54399. It answers only the session lookup, the role row and the four read RPCs from synthetic fixtures, and refuses and logs anything else.
- **Session:** a synthetic cookie holds a fixture session; no real credential exists in the proof copies.
- **Billing fixture:** the paid-subscription row has exactly the field set of `owner_billing_overview()` in 0060.

**Fixture requests** (`browser/fixture_requests_summary.json`): 186 in total, all reads (session lookup, role, `tenant_stores`, `admin_stores`, `admin_audit`, `owner_billing_overview`). 0 refused, 0 writes, no sign-in request, no password update.

| Area | Checks |
|---|---|
| U-1 (light and dark × 1440 and 375) | Theme class; exactly one selected item with the page's own `--primary` fill and `--primary-foreground` text after the transition settles; hover outline without fill; visible focus ring by keyboard; Audit log → Billing → Audit log on the desktop sidebar and in the phone drawer |
| U-2 | The paid row in all four combinations; the synthetic label; the non-owner statement; actions hidden |
| U-3 | OwedBook sign-in and Portal sign-in (light-1440, dark-375) and OwedBook profile: starts hidden, `type="button"`, `aria-pressed`, label swap, value kept, typing continues at the caret, Tab reaches the toggle with a ring, Space and Enter toggle, no submission request |

**Preserved attempts** (`browser/preserved-attempts/`):

| Attempt | Outcome | Kind |
|---|---|---|
| 1 | Measured mid-transition; ambiguous mobile locator | Instrument faults |
| 2 | A hard-coded coral constant was one unit off in rounding | Instrument fault |
| 3 | Found the caret reset | Product defect |
| 4 | Showed the first caret fix was insufficient | Product defect |
| 5 | Passed before the race fix; superseded by the final run on the final bytes | — |

## 6. Director rulings (recorded as given)

> - Mission Control is outside 007A scope: not graded and not a module limitation.
> - Placeholder Terms, Privacy, support address and price-consent wording are accepted for 007A local use.
> - Those placeholders must be resolved before any external or staging exposure.

Appended, without rewriting earlier text:
- `APBM_RULINGS.md`, "Director rulings — 16 November 2026 (final UI repair)";
- `STAGING_RELEASE.md`, a precondition;
- `CARRY_FORWARD_007B.md`, O-3.

QA's own records (`QAM_APPROVAL.md` B8/B9, `LEAD_REVIEW_ITEMS.md` LR-06/LR-08) are QA-owned and were not edited; QA and Friday reconcile them.

## 7. Effects

| Target | Effect |
|---|---|
| Stripe, Auth, email, payments, identities | None |
| DEV and SCRATCH databases | None; no query |
| Local | Engineering production servers on 3100/3101 and the fixture on 54399, all in disposable copies, started and stopped by Engineering. QA's servers on 3000/3001/3457, its Stripe listener, `.next` folders, env files and the sleeping `Q4-a04/resume-payment.cjs` helper untouched |
| Git | None |

## 8. QA work preserved

**Note on the last byte change.** The packaging scan flagged an address on a non-reserved domain (copied from the existing profile test) in the new OwedBook password test. It was changed to an address on the reserved `.test` domain in all copies; the OwedBook suite (309 of 309, tested copy and checkout), lint and production build were rerun on the final bytes. Test files are not part of the browser walk's build output.

**Inventory:** 9,805 uncommitted QA paths in OwedBook, all under `QAM/` (729 MB), plus the portal's ignored `test-results/transition-matrix.json`.

**Backup:** `~/APBM007A_QA_BACKUPS/u123_r06_20261116_150305/` (mode 700).
- Full byte copy; `SHA256SUMS.before` has 9,806 entries, SHA-256 `37fe18d8745236a8ab01a623cfcec7d14c277ebeb4cfd0b111b90724f533d5e3`.
- Env, cast, inbox, auth-state and browser-profile files were not copied or hashed.

After-work verification: `qa_preservation.json`.

## 9. Remaining limitations

| ID | Limitation |
|---|---|
| L1 | **Price amount.** No authorized data source holds a subscription price amount: the mirror has no amount column, `owner_billing_overview` returns none, and the Portal shows none. OwedBook shows "Price shown in the billing portal" for a Stripe subscription. Showing the amount would need a mirrored amount (a database change) or a provider read from OwedBook (a new integration); both are out of bounds and would need a Director ruling |
| L2 | **Fixture, not live.** The browser walk is fixture proof against production builds. Rendering of DEV's real paid subscription for a real owner session is not proved here; that is QA's narrow focused check (§10), and the row shape is exactly 0060's |
| L3 | "Plan" is the product name plus the pharmacies covered, as the Portal shows it; the billing interval is not in the row and is not shown |
| L4 | The caret is restored on the next frame or at the first key press; a pointer press in the field during that frame keeps the person's new position. Tested in Chromium (headless) only; other browsers were not run |
| L5 | `owner_billing_overview` serves the owner's first account. 007A has one account per owner; a store of any other account shows the honest unavailable state |

## 10. Retest impact for QA (short focused retest; no purchases)

| Area | Required |
|---|---|
| Runtime | Tony commits and rebuilds **both** apps; Friday binds the pair |
| U-1 | `/admin-portal/*` in both themes at 375 and 1440: one route-selected item, hover outline, keyboard focus ring, Audit log ↔ Billing, and the store drill-down |
| U-2 | `/admin-portal/billing` for the DEV owner with the real paid subscription (live): plan, pharmacies and next-payment or paid-through date match the Portal; the synthetic label where applicable; the non-owner statement; actions hidden |
| U-3 | OwedBook sign-in, the OwedBook profile (both fields) and Portal password sign-in: toggle, value and caret kept, keyboard, `aria-pressed` and label, no submission |
| Regression | The touched screens: admin sidebar on all admin routes, the OwedBook surface sidebar (FilterRail, unchanged), sign-in in both apps, profile password update, Portal login, billing screen |

Not claimed: any acceptance result, Gate Q or certification. Tony commits; Friday binds the pair; Cody retests U-1 to U-3; Friday owns certification. No deployment.
