# Audit operation draft — source-derived, not runtime-certified

EVIDENCE: OwedBookContext.tsx:48-57; OwedBookScreen.tsx:78-129,131-154,221-247; FilterRail.tsx:68-72; admin service/screen capture. Current service uses mocks: **zero wrapper calls and zero DB audit rows today**. The table maps existing service calls to intended wrappers; numbers below are INFERENCE for a single settled production mount with successful commits, no StrictMode duplicate mount, no network retries and a selected business.

| Operation | Current service calls / proposed wrapper mapping | Proposed successful committed read_page rows |
|---|---|---|
| Initial OwedBook commercial view | getPbmOptions→owedbook_pbm_options + getKpis→owedbook_kpis + getRows→owedbook_rows | 3, not 4; Summary not preloaded |
| Switch non-summary tab | getRows→owedbook_rows; page reset batched with tab change | 1 |
| Open Summary | getSummary→owedbook_summary; existing KPI reused | 1 |
| Change filter on page 1 | getKpis + getRows OR getSummary | 2 |
| Change filter while page >1 | filter render can start getRows for old page, then page-reset effect starts page 1; KPI once | 3 possible; rule/coalesce before FINAL, do not promise 2 |
| Change current-page sort | client-side sorting only | 0; server sort is not in frozen signature |
| Change page | getRows | 1 |
| Current Retry button | active getRows OR getSummary only | 1; KPI/PBM retry absent |
| Current rail Refresh | refreshData mock delay only, no invalidation | 0 |
| Proposed shared refresh/store switch | PBM + KPI + active rows/summary after valid scope change | Recommend 3; instrument after implementation |
| Stores list | listMyStores→proposed admin_stores | 1 |
| Store detail/roster | getStore→admin_stores(scoped id) + listMembers→admin_members | 2 |
| Audit screen | listAudit→admin_audit | 1 |
| Billing screen | listBilling→admin_billing_status | 1 |
| Invite screen (deferred) | getStore + listPendingInvites | 2 mock service calls; do not imply backed invite data |
| Settings screen (deferred) | listMyStores then getSettings(first store) | 2 mock service calls; read scope needs O-06 decision |

Admin getOwner has no current screen caller found; do not add an invented initial audit call. A chosen design may consolidate store/detail calls but then this table must be updated before counts are frozen.

Failure semantics: membership rejection occurs before audit insert, so 0. SQL exception rolls back insert, so 0 committed events. Response lost after a successful commit followed by a successful retry can yield 2. A client cancellation does not cancel an already committed RPC. React strict mode is enabled; development mounts can duplicate effects. Grade recorded operation boundaries, committed RPCs and actual production behavior, with explicit failure cases. Wrapper context.fn/args is the attribution key; plan may add a safe operation correlation token only by approved contract change.

BIM-003 did not log reads of audit_logs: viewer out of scope, ordinary admin SELECT allowed. APBM AC-603 requires a new self-logging admin_audit wrapper. Recommend read bounded snapshot and append one event in same transaction; explicitly rule inclusion/exclusion of the newly written event and per-account versus per-business attribution. All wrapper calls are forbidden in this no-database-write E1; instrumented run remains GAP owned by Cody after target/effect authorization, reviewed by JARVIS.
