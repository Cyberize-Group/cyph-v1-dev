# allowlist.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Transcribed from agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_AMENDMENT_A01.md §"Exact proposed file permissions" (in force per C-01) and APBM_RULINGS.md §A02. Machine-readable twin: allowlist.json.

A01 text excerpt hash (sha256 of the A01 file): b0a45a078cf23f7fc3887a08f7dd74ae82f1f2937b7f28f1a685f06c5d82d49e

Existing files permitted (39, "package.json scripts only" included as package.json):
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

New files (24, incl. the deployment proposal set):
- src/services/tenantScope.ts
- src/components/owedbook/StoreSelector.tsx
- scripts/dev-verify.mjs
- scripts/apply-forward.mjs
- scripts/seed/generate.mjs
- scripts/seed/run.mjs
- scripts/seed/reset.mjs
- scripts/seed/verify.mjs
- scripts/seed/identity-scan.mjs
- scripts/seed/README.md
- supabase/migrations/0048_ownership.sql
- supabase/migrations/0049_signup_member.sql
- supabase/migrations/0050_claim_read_fence.sql
- supabase/migrations/0051_admin_reads.sql
- supabase/migrations/0052_system_config.sql
- src/__tests__/apbm-tenant-scope.test.ts
- src/__tests__/apbm-read-states.test.tsx
- src/__tests__/apbm-admin-readonly.test.tsx
- Dockerfile
- cloudbuild.yaml
- deploy.sh
- deploy.config.json
- DEPLOYMENT_PLAYBOOK.md
- .dockerignore

A02 two-file test allowance:
- src/__tests__/services/owedbook.test.ts
- src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx

Protected (must show no change baseline→candidate):
- src/proxy.ts
- src/utils/supabase/
- src/app/api/auth/
- src/app/(auth)/
- src/utils/app-role.ts
- src/utils/get-user-role.ts
- supabase/migrations/0001–0047
- next.config.js
- package-lock.json
- src/components/admin-portal/DemoMarker.tsx (pending R-5)
- src/components/admin-portal/BillingScreen.tsx (pending R-5)

T-04 expectation: every product path in `git diff --name-status af2c7e5..308247a` (excluding agent_docs/ and the _SKILLS→agent_docs rename) ⊆ existing ∪ newFiles ∪ a02; DemoMarker.tsx and BillingScreen.tsx unchanged.
