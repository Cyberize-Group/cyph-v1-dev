# Engineering checks — E2 r01, 12 November 2026 (before the DEV apply and the integrated proof)

Self-verification by the engineering seat. Not a QA result. Every figure below was produced by the command named.

| Check | OwedBook | Payment Portal |
|---|---|---|
| Typecheck (`npx tsc --noEmit`) | clean | clean |
| Lint (`npx eslint .`) | 0 errors, 33 warnings (34 at the E1 baseline) | 0 errors, 24 warnings. Lint did not run at all at baseline; a flat config and two dev dependencies were added, with three narrow exceptions for inherited kit files |
| Unit and contract tests (`npx jest`) | 43 suites, 267 tests, all pass, without the external mock-mode flag the baseline needed | 18 suites, 371 tests, all pass |
| Production build, disposable copy, placeholder settings | pass, 29 routes | pass, 34 routes; no `/demo` route remains |
| Client bundle scan for canary secret values, secret names and server-only function names | none found. One file contains `generateLink`: the Supabase browser library's own admin API text, present in the E1 baseline build as well | none found |

Database and provider checks are in `../scratch-fresh-1/`, `../scratch-upgrade-1/` and `../PROGRESS.md`.

## Tests intentionally changed (not regressions)

| Repo | Test | Change and reason |
|---|---|---|
| OwedBook | `auth/AuthPage.test.tsx` | Expects two buttons: the returning-user sign-in link request was added beside the password form |
| OwedBook | `apbm-admin-readonly.test.tsx` | Billing fixture now states the owner capability: the billing read is owner-only (RA-3) |
| OwedBook | `jest.setup.ts` | Defaults the suite to mock mode, fixing the baseline's 47 failures without a flag |
| OwedBook | harness `expectations.json`, `audit-session.mjs`, `audit-catalog.mjs`, `dev-verify.mjs`, `db-verify.mjs` | RA-3 denials and the new object counts |
| Portal | `portal-boundaries.test.ts` | Stripe SDK and service role now allowed in `src/server` only; reviewed Supabase-importer list; mock surface must be unreachable from routes |
| Portal | `portal-owner`, `portal-dashboard`, `portal-access`, `login-form` tests | Rewritten against the real API with `fetch` mocked; staff-only entry replaced by any authenticated user |
| Portal | `portal-checkout-hold.test.tsx` | Deleted: it drove the removed Stripe stand-in and reviewer controls. The engine-level hold rules remain covered by `portal-registration.test.ts` |
| Portal | `portal-stripe-route.test.tsx` | Page-level cases removed with the route; pure classifier cases kept |

## Not run

Browser tests. The portal's `e2e/` Playwright specs target the removed `/demo` routes and reviewer controls; they compile but would fail and need rewriting for the real flow (not done). No server was started by Engineering.
