# allowlist.md — [QA-derived] Q4

Derived by Claudy (QA Executor) at 2026-11-09T06:18:15.594Z for Q4 from evidence/derivations/01/allowlist.json (A01 transcription, C-01) plus APBM_RULINGS.md §C C-03 (sha256 of APBM_RULINGS.md: dabbb3e6c773aae688154c6729a75fa61e99d40ed1c2d111352606cb83afd6ae).

C-03 text as read:

> **C-03 (scope amendment, A01 exact list):** add `src/components/admin-portal/DemoMarker.tsx` and `src/components/admin-portal/BillingScreen.tsx` to the permitted existing-file list for the purpose of F-01 only: in real mode, remove or replace the "Demo · mock data" pill and the "Visual only — no real charge is made in this demo" footer with truthful copy (e.g. "Synthetic test data" and "Billing actions unavailable in this release"); mock mode keeps its existing copy. No other behaviour change. Optional under the same ruling, Cody's discretion: F-05 one-line guard in `OwedBookContext.selectStore` (already-allowed file) — if taken, it is declared in the manifest §8 and retested under T-33.

Existing files permitted (41 = A01 39 + C-03 2):
- src/services/owedbook.ts
- src/services/adminDemo.ts
- src/types/OwedBook.ts
- src/types/adminDemo.ts
- src/types/supabase.ts
- src/mocks/owedbook.ts
- src/components/owedbook/OwedBookScreen.tsx
- src/components/owedbook/OwedBookContext.tsx
- src/components/owedbook/FilterRail.tsx
- src/app/(admin)/layout.tsx
- src/components/global/Navbar.tsx
- src/components/global/UserMenu.tsx
- src/components/global/MobileNav.tsx
- src/components/admin-portal/AddStoreButton.tsx
- src/components/admin-portal/InviteMemberForm.tsx
- src/components/admin-portal/MemberRow.tsx
- src/components/admin-portal/SettingsForm.tsx
- src/components/admin-portal/BillingRow.tsx
- src/components/admin-portal/AuditScreen.tsx
- src/components/admin-portal/statusPresentation.ts
- scripts/db-verify.mjs
- scripts/rls-harness/prove.mjs
- scripts/rls-harness/audit-prove.mjs
- scripts/rls-harness/harness.mjs
- scripts/rls-harness/expectations.json
- scripts/rls-harness/payloads.mjs
- scripts/rls-harness/scoping.mjs
- scripts/rls-harness/attacks.mjs
- scripts/rls-harness/revocation.mjs
- scripts/rls-harness/seed.mjs
- scripts/rls-harness/audit-seed.mjs
- scripts/rls-harness/audit-session.mjs
- scripts/rls-harness/audit-wrappers.mjs
- scripts/rls-harness/audit-catalog.mjs
- scripts/rls-harness/policy-check.mjs
- scripts/rls-harness/ac8-check.mjs
- scripts/rls-harness/lib/env.mjs
- scripts/rls-harness/lib/db.mjs
- package.json
- src/components/admin-portal/DemoMarker.tsx
- src/components/admin-portal/BillingScreen.tsx

New files (24, unchanged from Q2): see allowlist.json.

A02: src/__tests__/services/owedbook.test.ts, src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx.

Protected (must show no change baseline→repaired candidate):
- src/proxy.ts
- src/utils/supabase/
- src/app/api/auth/
- src/app/(auth)/
- src/utils/app-role.ts
- src/utils/get-user-role.ts
- supabase/migrations/0001–0047
- next.config.js
- package-lock.json

T-04 expectation (Q4): every product path in `git diff --name-only af2c7e5..dc44429f` (excluding agent_docs/) ⊆ existing ∪ newFiles ∪ a02; the repair diff 308247a2..dc44429f product paths = exactly the two C-03 files + OwedBookContext.tsx; no migration, seed, harness, service, auth or test path in the repair diff (else STOP-CONTRACT).
