# Tony-only review/commit commands

No Git mutation was performed. These documentation paths already contained earlier uncommitted work; review those accumulated changes before staging. Two copy-only files remain outside scope and are not included. Resolve the copy amendment before treating Stage 6 as fully closed.

```bash
git diff --check
git diff --stat
git add -A -- \
  src/__tests__/apbm-admin-readonly.test.tsx \
  src/__tests__/apbm-read-states.test.tsx \
  src/__tests__/apbm-tenant-scope.test.ts \
  src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx \
  'src/app/(admin)/layout.tsx' \
  src/components/admin-portal/AddStoreButton.tsx \
  src/components/admin-portal/AuditScreen.tsx \
  src/components/admin-portal/BillingRow.tsx \
  src/components/admin-portal/InviteMemberForm.tsx \
  src/components/admin-portal/MemberRow.tsx \
  src/components/admin-portal/SettingsForm.tsx \
  src/components/admin-portal/statusPresentation.ts \
  src/components/global/MobileNav.tsx \
  src/components/global/Navbar.tsx \
  src/components/global/UserMenu.tsx \
  src/components/owedbook/FilterRail.tsx \
  src/components/owedbook/OwedBookContext.tsx \
  src/components/owedbook/OwedBookScreen.tsx \
  src/components/owedbook/StoreSelector.tsx \
  src/services/adminDemo.ts \
  src/services/owedbook.ts \
  src/services/tenantScope.ts \
  src/types/adminDemo.ts \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_LEDGER.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DEV_APPLY_HANDOFF.md \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json \
  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6
git diff --cached --stat
git commit -m "APBM-003: wire scoped Stage 6 reads and unavailable actions"
```
