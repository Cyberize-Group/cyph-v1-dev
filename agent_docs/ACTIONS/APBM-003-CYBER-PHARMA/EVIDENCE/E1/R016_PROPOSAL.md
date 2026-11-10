# R-016 proposal — O-04 decision required

Evidence: `targeted_source_evidence.txt`; current code unchanged.

| Minimum file | Observed issue | Proposed authorized E2 change |
|---|---|---|
| src/components/owedbook/OwedBookScreen.tsx:66,83-101,103-129,193,237-247 | Initial/error KPI state is zeros; KPI effect excludes reloadKey; retry only refetches rows/summary | Separate KPI loading/error/data states; render loading/error instead of KpiTiles on failure, retain real zero only after successful empty result. Share explicit refresh generation; cancel stale resolutions; retry the failed aggregate/data scope; prevent stale page indicators during scope changes. Keep KpiTiles API unchanged. |
| src/components/owedbook/OwedBookContext.tsx:18-24,48-57 | PBM error swallowed; load-once options; no shared invalidation | Expose PBM loading/error/retry and a refresh generation; reset and refetch when permitted business changes once the separate store-scope design is approved. |
| src/components/owedbook/FilterRail.tsx:16-21,68-72 | Refresh delays and claims success without invalidating reads | Connect refresh to shared invalidation, show pending/failure/complete truthfully; expose PBM failure/retry distinctly from genuinely empty options. |

This is the smallest credible error/invalidation set: three files. Existing row skeleton/error/empty and KpiTiles can be reused. Do not modify DataTable, MultiSelect or drawer focus primitives unless a separately evidenced defect requires a ruling. Verify failed KPI never renders zero, empty success renders truthful zeros, PBM error is not empty, retries refetch correct scope, stale filter/store responses cannot overwrite new data, and keyboard/mobile behavior survives.

Separate necessary scope decisions (not R-016): store selection UI/context/service scope; `src/app/(admin)/layout.tsx` capability gate; `src/components/global/UserMenu.tsx`, `Navbar.tsx` and `MobileNav.tsx` role-based navigation; admin write-unavailable controls (`AddStoreButton`, `InviteMemberForm`, `MemberRow`, `SettingsForm`, `BillingRow` and enclosing screens as needed); AuditAction/type/presentation mapping. Their platform-role branches are confirmed in ui_semantics.txt; JARVIS must approve the exact capability plumbing and allowed paths. AC-502's R-016-only restriction cannot coexist with these requirements without a ruling. No authorization is manufactured by this proposal.
