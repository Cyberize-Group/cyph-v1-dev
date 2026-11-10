# ui_dispatch_counts.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Source files: src/components/owedbook/OwedBookContext.tsx, OwedBookScreen.tsx, FilterRail.tsx, StoreSelector.tsx; src/services/owedbook.ts, adminDemo.ts, tenantScope.ts; src/components/admin-portal/{MyStoresScreen,StoreDetailScreen,AuditScreen,BillingScreen,SettingsScreen,InviteScreen}.tsx; src/components/global/{Navbar,UserMenu,MobileNav}.tsx; src/app/(admin)/layout.tsx; migrations 0044–0047 and 0051 (one read_page insert per successful wrapper/admin RPC; tenant_stores inserts none).

Audit rows (action='read_page') per UI operation on a signed-in identity; every row carries context.fn = RPC name, actor_user_id = auth.uid(), business_id = p_business_id (NULL for admin_stores() without argument).

| Operation | RPC calls dispatched (source) | read_page rows |
|---|---|---|
| Login (/api/auth/login) | none audited (user_roles read is not stamped) | 0 |
| Scope load (tenant_stores via OwedBookContext + Navbar; admin layout server-side) | tenant_stores ×N | 0 |
| Open /owedbook, commercial tab, page 1 | OwedBookContext options effect → owedbook_pbm_options; OwedBookScreen kpis effect → owedbook_kpis; rows effect → owedbook_rows | 3 |
| Tab change (commercial ↔ updated ↔ federal) | rows effect dep activeTab → owedbook_rows | 1 |
| Tab → Summary | rows effect → owedbook_summary | 1 |
| Page change (Next/Prev) | rows effect dep page → owedbook_rows | 1 |
| Sort (column header) | handleSort → setSort only; client-side sort of the current page; no service call | **0** (plan text said 1; corrected by source, AM-2) |
| Filter apply from page 1 | filters change → kpis effect (+1) and rows effect (+1); options effect deps [service, request(service,refreshTick), scopeReady] do not include filters | **2** (plan text said 3) |
| Filter apply while on page ≥2 | as above + setPage(1) effect re-runs the rows effect; the first owedbook_rows call is cancelled client-side but already committed server-side | 3 |
| Refresh (FilterRail "Get Fresh Data" → reloadScoped → refreshTick+1; or Retry buttons calling refresh) | tenant_stores (0) + options (+1) + kpis (+1) + rows/summary (+1) | 3 |
| Store switch from page 1 (selectStore: setStoreId, setFilters({}), setOptions(null), appliedTick+1 — one batched render) | new service → options (+1), kpis (+1), rows (+1) | 3 (from page ≥2: 4) |
| /admin-portal (My Stores) | listMyStores → admin_stores() | 1 |
| /admin-portal/stores/[id] (store detail) | Promise.all([getStore → admin_stores(id), listMembers → admin_members(id)]) | **2** (plan text said +1 admin_members; AM-2 fixes from source) |
| /admin-portal/stores/[id]/invite | getStore → admin_stores(id) (+1); listPendingInvites is the denied stub → throws, screen shows error state | 1 (then "Not available in this release." error with Retry) |
| /admin-portal/audit | listAudit → tenant_stores (0) → admin_audit once per selected scope (owner: one per account; admin: one per store) | OWNER3 1; ADMIN_B2 1; ADMIN_B3 1; UNRELATED 1; OWNER1 1 |
| /admin-portal/billing | listBilling → listMyStores admin_stores() (+1) + admin_billing_status per permitted store | 1 + stores (OWNER3 4; ADMIN_B2 2; UNRELATED 2) |
| /admin-portal/settings | listMyStores admin_stores() (+1) + getSettings → getStore → admin_stores(id) (+1) | 2 |
| Refused spoof RPC (not a member / not an administrator) | exception before the audit insert | 0 |
| Aborted request (Playwright route abort) | request never reaches PostgREST | 0 |

Notes: (a) KPI tiles show '—' with aria-busy while loading and 'KPIs unavailable. Please retry.' with role=alert on failure (OwedBookScreen); (b) a lost-response retry (same call twice) commits two rows (wrappers insert before returning); (c) these numbers are fixed before T-33 starts and are not changed after any DEV observation.
