# E1 placeholder register — observed baseline versus proposed target

Every `<<E1...>>` occurrence in the acceptance spec and contracts is indexed below by source line. `e1_placeholders.txt` retains the complete search. **No future count is represented as a disk-derived implementation fact.** JARVIS must settle design-dependent values before FINAL or explicitly define the later measurement gate.

| Source / placeholder | EVIDENCE baseline | Proposed target or GAP |
|---|---|---|
| Spec:3 and SFC:3 generic marker prose | Indexing instructions, not numeric fields | No replacement fact needed |
| Spec:23 AC-101 last number | 0047 on disk, next free 0048, 47 files | Last target migration number not knowable before resolved migration split; do not freeze 0047 as final implementation chain |
| Spec:25 AC-103 policy count | 16 created by chain + 3 bootstrap = 19 expected; not live | Removing user_data SELECT and adding accounts/subscriptions UPDATE would yield 20 before config/new policies; final count GAP |
| Spec:37 AC-203 auth users | SFC has 7 required handles, 1 optional; none live-verified | 7 proposed, 8 only if OPERATOR explicitly approved; 3 accounts, 5 stores, 8 junction rows |
| Spec:38 AC-204 independent sample | No generator yet | Recommend all 250 proposed rows independently recomputed (small enough); minimum coverage per status/sign/rate/PBM/store must be explicit |
| Spec:38 AC-204 PBMs | Current fixture 7 non-null named PBMs | Recommend 3 named synthetic PBMs + unmatched NULL rows, subject to Tony's volume/tenancy ruling |
| Spec:38 AC-204 rows per store | Page limit 25 | Recommend 50 per store = 250 total, two full pages; increase trial volume separately if required |
| Spec:41 AC-207 audit rows/run | 13 table stamps; no Target One seed | GAP: derive from final insert/update/delete operation ledger, separate fresh seed/rerun/reset counts; no single guessed count |
| Spec:51 AC-305 admin read paths | None exist on disk | Recommend admin_stores, admin_members, admin_audit, admin_billing_status; scoped store-id options for detail; FINAL names require JARVIS |
| Spec:58 AC-402 table count | 14 distinct chain-created + user_roles/profiles = 16 expected | 17 if one system_config table approved; not yet fixed or live measured |
| Spec:58 AC-402 policy count | Static 19 including bootstrap | Same unresolved final policy design as AC-103 |
| Spec:58 AC-402 helper+wrapper+audit functions | Core set 4 helpers + 4 wrappers + audit_write = 9; 11 functions defined in chain includes update_updated_at and immutable guard | At least +1 ownership helper +4 admin wrappers; possibly entitlement/config helpers. Define counting predicate; final count GAP |
| Spec:68 AC-502 permitted component paths | No delta since baseline | R016_PROPOSAL three-file list, plus separately ruled store-scope, admin guard/nav/control/presentation paths; R-016-only contract insufficient |
| Spec:97 AC-803 suites/tests | 36 test source files; tsc pass; lint 0 errors/35 warnings | Executed suites/tests/skipped GAP, build route count GAP; old 34/164/0 and 17 remain CLAIM |
| OAC:48 initial calls and events | PBM+KPI+rows mock calls; 0 audit rows today | Proposed 3 successful RPC commits, not sample's 4 |
| OAC:49 tab/filter/sort/page calls and events | Source call graph enumerated | 1 / 2 (potential 3 when filter resets page>1) / 0 / 1; instrument and rule coalescing |
| OAC:50 Summary calls and events | One getSummary | Proposed 1 successful owedbook_summary |
| OAC:51 admin calls and events | Stores 1, detail+members 2, audit 1, billing 1 mock reads | Same proposed RPC mapping, subject to contract; current audit rows 0 |
| OAC:52 refresh/retry calls and events | Refresh 0 reads; retry active rows/summary 1 | Proposed refresh 3; targeted retry per failed call. Failed transaction 0, committed lost-response retry can be 2 |
| SFC:11 reference row counts | No governed seed, no wrapper reads ful_reference | Propose 4 AAC rates + 6 WAC rates for 6 synthetic product keys, 3 PBM rows and 2 version rows; FUL 0 because wrappers do not read it, unless pricing-scenario ruling adds a ceiling case |
| SFC:40 PBM count | 7 current named PBMs; synthetic source must be new | Proposed 3 + unmatched, not a claim about future seed |
| SFC:42 row count | 25 default limit | Proposed 50/store; Tony confirms trial volume |
| SFC:49 seed audit count | No seed operation ledger | GAP as AC-207; include config stamps if new table; auth/profile writes not among 13 existing stamps |

Additional verified numbers: audit_logs 11 columns; 4 wrapper methods; 6 OwedBook service methods total; 18 admin service methods (8 reads, 10 mutation/action/internal-append methods); 6 admin pages; 12 page.tsx and 3 route.ts source endpoints; matrix 320 cells with 4 required SELECT flips and 7 write-returning collisions; 47 baseline migrations unchanged. See ADMIN_SERVICE_INVENTORY and static_counts for derivations. Runtime route count may include generated special routes and cannot be recovered from source count alone.

Future seed audit-count formula: sum affected row operations on all stamped tables across the explicitly defined run, not table cardinalities alone. Reset and upsert choices change the answer; audit rows persist by design. Direct SQL seed without request JWT context may attribute postgres rather than service_role, so use the approved service-role API path or explicitly set and prove trusted transaction attribution. Zero PHI findings must accompany documented construction; regex scan alone is insufficient.
