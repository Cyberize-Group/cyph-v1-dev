# board.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Rule (jest.config.js): roots=['<rootDir>/src'], testMatch includes '**/__tests__/**/*.+(ts|tsx|js)', testPathIgnorePatterns includes '<rootDir>/src/__tests__/jest.setup.ts'.

Files under src/__tests__: 40; excluded by ignore pattern: 1 (jest.setup.ts).

**Expected Jest suites = 39.** Tests = Jest's reported total (recorded at run time, not pre-set). Required: 0 skipped, 0 failed.

- src/__tests__/actions.test.ts
- src/__tests__/admin-portal/AddStoreButton.test.tsx
- src/__tests__/admin-portal/InviteMemberForm.test.tsx
- src/__tests__/admin-portal/MemberRow.test.tsx
- src/__tests__/admin-portal/MyStoresScreen.test.tsx
- src/__tests__/admin-portal/SettingsForm.test.tsx
- src/__tests__/apbm-admin-readonly.test.tsx
- src/__tests__/apbm-read-states.test.tsx
- src/__tests__/apbm-tenant-scope.test.ts
- src/__tests__/auth/AuthPage.test.tsx
- src/__tests__/common/DataTable.keyboard.test.tsx
- src/__tests__/common/DataTable.render.test.tsx
- src/__tests__/common/DataTable.test.tsx
- src/__tests__/common/EmptyState.test.tsx
- src/__tests__/common/MultiSelect.focus.test.tsx
- src/__tests__/common/MultiSelect.test.tsx
- src/__tests__/get-user-role.test.ts
- src/__tests__/global/MobileNav.test.tsx
- src/__tests__/global/Navbar.invariant.test.tsx
- src/__tests__/global/Navbar.mobile.test.tsx
- src/__tests__/global/Navbar.switcher.test.tsx
- src/__tests__/global/UserMenu.test.tsx
- src/__tests__/instrumentation.test.ts
- src/__tests__/layout/AdminSidebar.test.tsx
- src/__tests__/layout/AuthedShell.focus.test.tsx
- src/__tests__/layout/AuthedShell.test.tsx
- src/__tests__/member/ProfileForm.test.tsx
- src/__tests__/mocks/adminDemo.seed.test.ts
- src/__tests__/owedbook/FilterRail.test.tsx
- src/__tests__/owedbook/KpiTiles.test.tsx
- src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx
- src/__tests__/owedbook/OwedBookScreen.test.tsx
- src/__tests__/owedbook/StatusChip.test.tsx
- src/__tests__/owedbook/SummaryUnattributedNote.test.tsx
- src/__tests__/owedbook/drawer-apply.integration.test.tsx
- src/__tests__/proxy.test.ts
- src/__tests__/services/adminDemo.test.ts
- src/__tests__/services/owedbook.test.ts
- src/__tests__/supabase-admin.test.ts

Context only (not the expected value): engineering 39/196; Stage-6 baseline 36/178.
