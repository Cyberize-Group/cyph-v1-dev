# APBM-003 — architect review of proposed Git closeout

Prepared for Tony's architect. This is a review artifact, not an instruction to execute the embedded script now. No staging, commit, merge, push or worktree creation has been performed by Cody.

## Requested review and delivery workflow

1. Architect reviews this file: authority, product delta, selected records, exclusions, proposed commands and integration risks.
2. Architect returns a prompt to Cody stating acceptance or exact corrections.
3. Cody checks the then-current local identities and incorporates that prompt, then prints the final commit, integration, push and merge commands visibly in chat as sequential copy-paste blocks. Tony executes those commands. The final delivery must not be only a script launcher or require Tony to perform the architect's review through interactive REVIEWED prompts.

The script reproduced below is the current proposed implementation for architectural review. Its interactive review calls describe review boundaries; they must be converted to explicit execution blocks after the architect's response. A conflict or changed remote tree can require fresh inspection of the actual result; it must not trigger an automatic reset or blind continuation.

## Authority and factual limits

Tony accepts Target One and manually approved the later pagination repair. No return to Friday or Claudy is required for this closeout. Friday's certification applies to its original candidate dc44429f466dedcf35023342f68624c6cee062f0. Pagination has engineering validation and Director manual acceptance; no renewed independent certification is claimed. Unconfirmed QA cleanup remains explicitly unconfirmed and is not an integration prerequisite. Routine local cleanup preserves Tony's testing credentials, login documents, private cast and backups.

GitHub protection is a separate constraint: the recorded policy requires a PR, one approving GitHub review, resolved threads and merge commits. An architect's review of this local file does not itself set GitHub's APPROVED state. The final commands must respect the actual server policy without promising that file review satisfies it.

## Proposed integration and review points

- Source checkout: qa/apbm-003 at c5061d9f75fa242a3d14913c08d6bbad7173c638; inherited unrelated changes remain unstaged.
- Original engineering candidate: 308247a24e6ddd455842da5cd2e21541d7eae2c1. Certified C-03 repair: dc44429f466dedcf35023342f68624c6cee062f0.
- Commit the four pagination paths separately, then the finite sanitized records list. Preserve unrelated working files and keep the source checkout on its existing branch.
- Use a separate apbm-003 worktree; reconcile remote engineering, apply only the three C-03 product paths, carry the pagination commit and restore only selected records. Do not merge the whole QA branch.
- Reconcile current remote main, run validation on the integrated tree, push engineering, use the protected-main PR route, then sync local main in a separate worktree.
- Stop on conflicts, changed identities, occupied worktree paths, unexpected staged paths or failed validation. Resolve exact paths; preserve both lines of work.
- Deployment and Gate D remain pending. Integration/merge receipts do not yet exist.

## Verification available before architect review

Bash syntax, finite manifest validation, unchanged pagination source hashes and original certificate hash passed in the preceding correction. The privacy scan inspected 2,088 files/archive members with zero hits. This document adds no product change. The checks for this review artifact are recorded below after generation; the proposed Git workflow itself has not been executed.

## Product paths

Three certified paths: src/components/admin-portal/DemoMarker.tsx, src/components/admin-portal/BillingScreen.tsx, src/components/owedbook/OwedBookContext.tsx.

Four Director-accepted pagination paths:

```text
src/components/owedbook/OwedBookScreen.tsx
src/components/owedbook/ResultsToolbar.tsx
src/__tests__/apbm-read-states.test.tsx
src/__tests__/owedbook/ResultsToolbar.test.tsx
```

## Certified product patch

```diff
diff --git a/src/components/admin-portal/BillingScreen.tsx b/src/components/admin-portal/BillingScreen.tsx
index bc76b2f..84f664b 100644
--- a/src/components/admin-portal/BillingScreen.tsx
+++ b/src/components/admin-portal/BillingScreen.tsx
@@ -5,6 +5,7 @@ import ScreenHeader from "@/components/admin-portal/ScreenHeader";
 import AddStoreButton from "@/components/admin-portal/AddStoreButton";
 import BillingRow from "@/components/admin-portal/BillingRow";
 import { billingService } from "@/services/adminDemo";
+import { isDemoMode } from "@/services/tenantScope";
 import type { BillingLine } from "@/types/adminDemo";
 
 const Skeleton = () => (
@@ -72,7 +73,9 @@ const BillingScreen = () => {
             ))}
           </div>
           <p className="mt-4 text-xs text-muted-foreground">
-            Visual only — no real charge is made in this demo.
+            {isDemoMode()
+              ? "Visual only — no real charge is made in this demo."
+              : "Billing actions are unavailable in this release"}
           </p>
         </>
       )}
diff --git a/src/components/admin-portal/DemoMarker.tsx b/src/components/admin-portal/DemoMarker.tsx
index cbc7254..53b558b 100644
--- a/src/components/admin-portal/DemoMarker.tsx
+++ b/src/components/admin-portal/DemoMarker.tsx
@@ -1,3 +1,5 @@
+import { isDemoMode } from "@/services/tenantScope";
+
 // The one net-new visual in the Admin Portal Demo Shell (FFM §3): a "Demo ·
 // mock data" pill built ENTIRELY from the existing `--warning` token — no new
 // brand colors. Lives in CONTENT next to a page title, NEVER in the navbar
@@ -5,7 +7,7 @@
 const DemoMarker = () => {
   return (
     <span className="inline-flex items-center border border-warning/40 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-warning">
-      Demo · mock data
+      {isDemoMode() ? "Demo · mock data" : "Synthetic test data"}
     </span>
   );
 };
diff --git a/src/components/owedbook/OwedBookContext.tsx b/src/components/owedbook/OwedBookContext.tsx
index 6711831..a309faa 100644
--- a/src/components/owedbook/OwedBookContext.tsx
+++ b/src/components/owedbook/OwedBookContext.tsx
@@ -39,7 +39,7 @@ export const OwedBookProvider=({children}:{children:ReactNode})=>{
  },[service,request,scopeReady]);
  const applyFilters=useCallback((f:OwedBookFilters)=>{setFilters(f);setAppliedTick(t=>t+1);},[]);
  const clearFilters=useCallback(()=>applyFilters({pbms:[]}),[applyFilters]);
- const selectStore=useCallback((id:string)=>{if(!stores.some(s=>s.id===id))return;setStoreId(id);setFilters({pbms:[]});setOptions(null);setAppliedTick(t=>t+1);},[stores]);
+ const selectStore=useCallback((id:string)=>{if(id===storeId||!stores.some(s=>s.id===id))return;setStoreId(id);setFilters({pbms:[]});setOptions(null);setAppliedTick(t=>t+1);},[stores,storeId]);
  const refresh=useCallback(()=>setRefreshTick(t=>t+1),[]);
  return <OwedBookContext.Provider value={{filters,pbmOptions:scopeReady&&options?.request===request?options.values:[],applyFilters,clearFilters,appliedTick,service,stores,storeId,selectStore,scopeLoading,scopeError,scopeReady,optionsError:options?.request===request?options.error:null,refreshTick,refresh}}>{children}</OwedBookContext.Provider>;
 };
```

## Pagination product patch (including new files)

```diff
diff --git a/src/components/owedbook/OwedBookScreen.tsx b/src/components/owedbook/OwedBookScreen.tsx
index 9122cbd..43cdf63 100644
--- a/src/components/owedbook/OwedBookScreen.tsx
+++ b/src/components/owedbook/OwedBookScreen.tsx
@@ -6,6 +6,7 @@ import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import DataTable from "@/components/common/DataTable";
 import EmptyState from "@/components/common/EmptyState";
 import StoreSelector from "./StoreSelector";
+import ResultsToolbar from "./ResultsToolbar";
 import type {
   OwedBookFilters,
   OwedBookKpis,
@@ -197,33 +198,6 @@ const OwedBookScreen = () => {
 
       {!scopeReady && !scopeLoading ? <p role="status">Select a permitted store to view KPIs.</p> : kpiReady && kpis ? <KpiTiles kpis={kpis} /> : kpiReady && kpiError ? <div role="alert">{kpiError} <button onClick={refresh}>Retry KPIs</button></div> : <div aria-busy="true" aria-label="Loading KPIs" className="grid grid-cols-2 gap-4">{["Commercial Underpaid","Scripts","Updated Difference","Owed"].map(label=><div key={label}>{label}<p>—</p></div>)}</div>}
 
-      {!isSummary && dataReady && !error && pageData && (
-        <div className="flex items-center gap-3 text-sm text-muted-foreground">
-          <span>
-            Page {pageData.page} of {Math.max(pageData.pageCount, 1)}
-          </span>
-          <button
-            type="button"
-            disabled={pageData.page <= 1}
-            onClick={() => setPage((p) => Math.max(1, p - 1))}
-            className="disabled:opacity-40 hover:text-foreground"
-          >
-            Prev
-          </button>
-          <button
-            type="button"
-            disabled={pageData.page >= pageData.pageCount}
-            onClick={() => setPage((p) => p + 1)}
-            className="disabled:opacity-40 hover:text-foreground"
-          >
-            Next
-          </button>
-          <span>
-            Limit {pageData.limit} · Total {pageData.total}
-          </span>
-        </div>
-      )}
-
       <Tabs
         value={activeTab}
         onValueChange={(v) => {
@@ -272,6 +246,13 @@ const OwedBookScreen = () => {
             getRowKey={(r) => r.id}
           />
         )}
+        {!isSummary && activeTab !== "federal_dollars" && scopeReady && dataReady && !loading && !error && pageData && (
+          <ResultsToolbar
+            results={pageData}
+            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
+            onNext={() => setPage((p) => p + 1)}
+          />
+        )}
       </div>
 
       {/* RRM-002 D3 disclosure — Summary tab only, same-filters pair only (AC-101–104). */}
diff --git a/src/components/owedbook/ResultsToolbar.tsx b/src/components/owedbook/ResultsToolbar.tsx
new file mode 100644
index 0000000..9898431
--- /dev/null
+++ b/src/components/owedbook/ResultsToolbar.tsx
@@ -0,0 +1,40 @@
+import type { OwedBookPage } from "@/types/OwedBook";
+
+interface ResultsToolbarProps {
+  results: OwedBookPage;
+  onPrevious: () => void;
+  onNext: () => void;
+}
+
+// Presentation only: the screen retains all query state and navigation handlers.
+export default function ResultsToolbar({ results, onPrevious, onNext }: ResultsToolbarProps) {
+  const { page, pageCount, limit, total, rows } = results;
+  const hasRows = total > 0 && rows.length > 0;
+  const first = hasRows ? (page - 1) * limit + 1 : 0;
+  const last = hasRows ? Math.min(first + rows.length - 1, total) : 0;
+  const buttonClass = "min-h-11 min-w-0 px-4 py-2 text-sm font-semibold border rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-foreground";
+
+  return (
+    <nav aria-label="Results pagination" className="mt-4 flex min-w-0 flex-col gap-4 border border-foreground/50 border-l-4 border-l-primary bg-card p-4 text-card-foreground lg:flex-row lg:items-center lg:justify-between">
+      <div className="min-w-0" aria-live="polite" aria-atomic="true">
+        <p className="text-sm font-semibold tabular-nums">
+          {hasRows ? `Showing ${first}–${last} of ${total} claims` : `Showing 0 of ${total} claims`}
+        </p>
+        <p className="mt-1 text-sm">{limit} claims per page</p>
+      </div>
+      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
+        <p className="text-sm font-semibold tabular-nums">
+          {total > 0 ? `Page ${page} of ${pageCount}` : "No pages"}
+        </p>
+        <div className="grid grid-cols-2 gap-3">
+          <button type="button" aria-label="Previous page" disabled={!hasRows || page <= 1} onClick={onPrevious} className={`${buttonClass} border-foreground bg-card text-card-foreground enabled:hover:bg-secondary`}>
+            <span aria-hidden="true">← </span>Previous
+          </button>
+          <button type="button" aria-label="Next page" disabled={!hasRows || page >= pageCount} onClick={onNext} className={`${buttonClass} border-foreground bg-foreground text-background enabled:hover:underline`}>
+            Next<span aria-hidden="true"> →</span>
+          </button>
+        </div>
+      </div>
+    </nav>
+  );
+}
diff --git a/src/__tests__/apbm-read-states.test.tsx b/src/__tests__/apbm-read-states.test.tsx
index 6a7f617..5def059 100644
--- a/src/__tests__/apbm-read-states.test.tsx
+++ b/src/__tests__/apbm-read-states.test.tsx
@@ -5,6 +5,7 @@ import OwedBookScreen from "@/components/owedbook/OwedBookScreen";
 import { OwedBookProvider,useOwedBook } from "@/components/owedbook/OwedBookContext";
 import { createOwedBookService } from "@/services/owedbook";
 import { listTenantStores } from "@/services/tenantScope";
+import { owedBookFixtures } from "@/mocks/owedbook";
 import type { OwedBookKpis,OwedBookPage } from "@/types/OwedBook";
 jest.mock("@/services/owedbook",()=>({owedBookService:{},createOwedBookService:jest.fn()}));
 jest.mock("@/services/tenantScope",()=>({...jest.requireActual("@/services/tenantScope"),listTenantStores:jest.fn()}));
@@ -12,7 +13,7 @@ const A="11111111-1111-4111-8111-111111111111",B="22222222-2222-4222-8222-222222
 const kpi={commercial_underpaid:42,commercial_scripts:1,updated_difference:0,owed:42};
 const empty={rows:[],page:1,pageCount:1,limit:25,total:0};
 const deferred=<T,>()=>{let resolve!:(x:T)=>void;const promise=new Promise<T>(r=>{resolve=r;});return {promise,resolve};};
-const Options=()=>{const {pbmOptions,refresh}=useOwedBook();return <><span data-testid="options">{pbmOptions.join(",")}</span><button onClick={refresh}>Refresh all</button></>;};
+const Options=()=>{const {pbmOptions,refresh,applyFilters}=useOwedBook();return <><span data-testid="options">{pbmOptions.join(",")}</span><button onClick={refresh}>Refresh all</button><button onClick={()=>applyFilters({pbms:[],filter:"new"})}>Apply test filter</button></>;};
 const renderPage=()=>render(<OwedBookProvider><Options/><OwedBookScreen/></OwedBookProvider>);
 let a:ReturnType<typeof createOwedBookService>,b:ReturnType<typeof createOwedBookService>;
 const originalMode=process.env.NEXT_PUBLIC_APBM_DATA_MODE;
@@ -31,7 +32,7 @@ describe("APBM real-mode asynchronous states",()=>{
   fireEvent.change(screen.getByRole("combobox",{name:"Store"}),{target:{value:B}});
   expect(screen.queryByText("$999.00")).not.toBeInTheDocument();
   await screen.findByText("No results");await act(async()=>{k.resolve({...kpi,commercial_underpaid:999,owed:999});r.resolve({...empty,total:999});o.resolve(["OLD STORE PBM"]);});
-  expect(screen.queryByText("$999.00")).not.toBeInTheDocument();expect(screen.queryByText(/Total 999/)).not.toBeInTheDocument();expect(screen.getByTestId("options")).not.toHaveTextContent("OLD STORE PBM");
+  expect(screen.queryByText("$999.00")).not.toBeInTheDocument();expect(screen.queryByText(/of 999 claims/)).not.toBeInTheDocument();expect(screen.getByTestId("options")).not.toHaveTextContent("OLD STORE PBM");
  });
  it("clears already visible values immediately when changing stores",async()=>{
   jest.mocked(a.getKpis).mockResolvedValue({...kpi,commercial_underpaid:999,owed:999});
@@ -54,3 +55,30 @@ describe("APBM real-mode asynchronous states",()=>{
   jest.mocked(listTenantStores).mockRejectedValue(new Error("offline"));renderPage();await screen.findByRole("button",{name:"Retry stores"});expect(a.getKpis).not.toHaveBeenCalled();expect(a.getRows).not.toHaveBeenCalled();
  });
 });
+
+
+describe("results toolbar integration",()=>{
+ it("keeps request counts, placement, filter/store resets, and non-paginated tabs",async()=>{
+  const response=(total:number,page:number):OwedBookPage=>({rows:owedBookFixtures.slice((page-1)*25,Math.min(page*25,total)),page,pageCount:Math.ceil(total/25),limit:25,total});
+  jest.mocked(a.getRows).mockImplementation(async(tab,filters,page=1)=>response(tab==="federal_dollars"?0:filters.filter?31:50,page));
+  jest.mocked(b.getRows).mockImplementation(async(_tab,_filters,page=1)=>response(50,page));
+  renderPage();await screen.findByText("Showing 1–25 of 50 claims");
+  const toolbar=screen.getByRole("navigation",{name:"Results pagination"});
+  const table=screen.getByTestId("datatable-desktop");
+  expect(table.compareDocumentPosition(toolbar)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
+  expect(table.contains(toolbar)).toBe(false);
+  expect(a.getRows).toHaveBeenCalledTimes(1);expect(a.getKpis).toHaveBeenCalledTimes(1);expect(a.getPbmOptions).toHaveBeenCalledTimes(1);
+  fireEvent.click(screen.getByRole("button",{name:"Next page"}));await screen.findByText("Showing 26–50 of 50 claims");
+  expect(a.getRows).toHaveBeenCalledTimes(2);expect(a.getKpis).toHaveBeenCalledTimes(1);expect(a.getPbmOptions).toHaveBeenCalledTimes(1);
+  fireEvent.click(screen.getByRole("button",{name:"Previous page"}));await screen.findByText("Showing 1–25 of 50 claims");
+  expect(a.getRows).toHaveBeenCalledTimes(3);
+  fireEvent.click(screen.getByRole("button",{name:"Next page"}));await screen.findByText("Showing 26–50 of 50 claims");
+  fireEvent.click(screen.getByRole("button",{name:"Apply test filter"}));await screen.findByText("Showing 1–25 of 31 claims");
+  fireEvent.click(screen.getByRole("button",{name:"Next page"}));await screen.findByText("Showing 26–31 of 31 claims");
+  fireEvent.change(screen.getByRole("combobox",{name:"Store"}),{target:{value:B}});await screen.findByText("Showing 1–25 of 50 claims");
+  fireEvent.mouseDown(screen.getByRole("tab",{name:"Summary"}),{button:0,ctrlKey:false});await waitFor(()=>expect(b.getSummary).toHaveBeenCalled());
+  expect(screen.queryByRole("navigation",{name:"Results pagination"})).not.toBeInTheDocument();
+  fireEvent.mouseDown(screen.getByRole("tab",{name:"Federal Dollars"}),{button:0,ctrlKey:false});await screen.findByText("Federal reimbursement data is unavailable in this release.");
+  expect(screen.queryByRole("navigation",{name:"Results pagination"})).not.toBeInTheDocument();
+ });
+});
diff --git a/src/__tests__/owedbook/ResultsToolbar.test.tsx b/src/__tests__/owedbook/ResultsToolbar.test.tsx
new file mode 100644
index 0000000..86eb812
--- /dev/null
+++ b/src/__tests__/owedbook/ResultsToolbar.test.tsx
@@ -0,0 +1,30 @@
+/** @jest-environment jsdom */
+import "@testing-library/jest-dom";
+import { fireEvent, render, screen } from "@testing-library/react";
+import ResultsToolbar from "@/components/owedbook/ResultsToolbar";
+import type { OwedBookPage } from "@/types/OwedBook";
+
+const result = (page: number, total: number): OwedBookPage => ({
+  page, total, limit: 25, pageCount: Math.ceil(total / 25),
+  rows: Array.from({ length: Math.max(0, Math.min(25, total - (page - 1) * 25)) }, () => ({} as OwedBookPage["rows"][number])),
+});
+
+it.each([
+  [1, 50, "Showing 1–25 of 50 claims", true, false],
+  [2, 50, "Showing 26–50 of 50 claims", false, true],
+  [2, 31, "Showing 26–31 of 31 claims", false, true],
+  [1, 0, "Showing 0 of 0 claims", true, true],
+])("reports the real range and navigation boundaries for page %s / total %s", (page, total, text, previousDisabled, nextDisabled) => {
+  const previous = jest.fn(), next = jest.fn();
+  render(<ResultsToolbar results={result(page, total)} onPrevious={previous} onNext={next} />);
+  expect(screen.getByRole("navigation", { name: "Results pagination" })).toHaveTextContent(text);
+  expect(screen.getByText("25 claims per page")).toBeInTheDocument();
+  expect(screen.getByText(total ? `Page ${page} of ${Math.ceil(total / 25)}` : "No pages")).toBeInTheDocument();
+  const prevButton = screen.getByRole("button", { name: "Previous page" });
+  const nextButton = screen.getByRole("button", { name: "Next page" });
+  expect(prevButton).toHaveProperty("disabled", previousDisabled);
+  expect(nextButton).toHaveProperty("disabled", nextDisabled);
+  fireEvent.click(prevButton); fireEvent.click(nextButton);
+  expect(previous).toHaveBeenCalledTimes(previousDisabled ? 0 : 1);
+  expect(next).toHaveBeenCalledTimes(nextDisabled ? 0 : 1);
+});
```

## Current closeout records

### CLOSEOUT.md

```text
# APBM-003 closeout — Director accepted; integration handoff prepared

2026-11-09 · Cody, Engineering Executor. Director authorizes closeout/integration/push preparation, not agent Git execution.

## Separate facts

| Fact | Status / exact evidence |
|---|---|
| DEV APPLY | PASS, Director executed 2026-11-07. `../EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json`: 52 ledger entries, 250 claims, seven synthetic users; 19 Owner / 154 client checks; original rows and four Auth indexes preserved; exact three managed default ACL exceptions. No repeated apply. |
| Gate Q | Friday CERTIFIED WITH LIMITATIONS for **dc44429f466dedcf35023342f68624c6cee062f0**, not the pagination successor. Delivered `/home/moose/Downloads/QAM_CERTIFICATION.md` installed byte-for-byte in QAM/QAM_CERTIFICATION.md. SHA-256 e7867554afc4a3f242ab09f02b048bd025d3cecb9c5e1ec79fd2e9103b588f37. |
| Correct certificate tally | **40 PASS, 1 ACCEPTED LIMITATION, 3 NOT RUN** = 44. The source's “41 PASS” matrix shorthand includes AC-401, but its Lead restatement expressly says AC-401 is not a pass. Preserve source verbatim; this closeout uses the corrected interpretation requested by Tony. Restore was accepted, not demonstrated. |
| Director acceptance | Successful Target One with limitations, on this closeout instruction; observations below. |
| Pagination successor | Four-file uncommitted product/test change, separately validated and explicitly accepted by Tony. Engineering validation and Director manual acceptance recorded; no renewed independent certification claimed. |
| QA cleanup | Phase-exit server/temp cleanup reported in Q4 report/certificate. Canonical cleanup execution/acceptance report still a template; final cleanup acceptance NOT RECORDED. Limited Cody routine cleanup recorded separately. |
| Deployment / Gate D | Deferred / NOT RUN; production readiness pending. Director acceptance is not deployment authority or a Gate D result. |
| Git/integration | No Git mutation by Cody. qa/apbm-003 HEAD c5061d9f75fa242a3d14913c08d6bbad7173c638; engineering apbm-003 at original 308247a; main/remote main af2c7e5. PR required, one approving review, resolved threads, merge commit only. |

## Director observations

Tony declares APBM-003 successful and accepts Target One with recorded limitations. Director-observed Owner smoke: admin views render correctly; OwedBook filters, store switching and pagination work; mobile passed. MEMBER_B1: filters work, mobile passed, no admin page access reported. Tony manually reviewed the pagination usability repair and explicitly approved it as beautiful/perfect. No Director UNRELATED-account test, exact picker verification or complete seven-account smoke is claimed.

## Final product reconciliation

1. Original engineering candidate: 308247a24e6ddd455842da5cd2e21541d7eae2c1.
2. Friday-certified repair: dc44429f466dedcf35023342f68624c6cee062f0. Only product changes since original: DemoMarker.tsx and BillingScreen.tsx truthful real-mode labels; OwedBookContext.tsx same-store no-op guard. CERTIFIED_PRODUCT.patch contains only these three paths.
3. dc44429f..current HEAD c5061d9: no product delta (release record only).
4. Current worktree successor: OwedBookScreen.tsx, new ResultsToolbar.tsx, apbm-read-states.test.tsx and new ResultsToolbar.test.tsx. No later admin/auth/service/script/migration/fixture/product changes found. Exact four hashes still match pagination/source-hashes.json; reuse the valid 40-suite/201-test, typecheck/build, 0-error/34-warning lint and 16-layout results. No new product work in closeout.

Source snapshots and evidence are retained separately from a certificate. SHA-256 file listings and explicit retention manifests accompany this handoff. Do not label the new product revision automatically certified.

## Director ruling and remaining integration work

- Director ruling (2026-11-09): no return to Friday or Claudy is required for this closeout. Target One is accepted and the pagination repair is manually approved. Friday's certification applies only to its original certified candidate; no renewed independent certification is claimed.
- Unconfirmed QA cleanup remains explicitly unconfirmed. Renewed cleanup acceptance is not a prerequisite for Git integration. Routine local cleanup may proceed while preserving Tony's testing credentials/documents, private cast and backups.
- Retrospective synthesis remains a follow-up, not an additional closeout approval cycle.
- Tony reviews scoped staging and integration results, pushes engineering, obtains protected-main PR review and merges via allowed merge method. Git history and remote state remain unchanged by this task.

Git integration/merge receipts remain pending. Cleanup acceptance remains unconfirmed; deployment and Gate D remain pending. APBM-004 should start from the approved, merged main revision resolved from the PR receipt, carrying FOLLOW_UPS.md and the retrospective actions. A future SHA is not invented.

## Local testing

Port 3000 is stopped per Tony's request. Intended URL after Tony starts the already-built local app: http://localhost:3000/auth, then /owedbook. From repo root: `npm run start -- --port 3000`. Use the persisted Downloads login Markdown/Documents PDF (private, excluded from Git). Old 3137 remains untouched; do not use it as the current build. No server restart performed during closeout.
```

### CLEANUP_REVIEW.md

```text
# Cleanup record — Director retention ruling

Cleanup accepted: NOT RECORDED

Friday's delivered certificate §5 supplies the cleanup point: SCRATCH may remain seeded; QA :3138 stopped; QA temp files reported shredded; DEV sessions/read_page history retained. Q4 execution report records :3138 stopped. Inspection finds no :3138 or :3000 listener. Old :3137 belongs to retained local testing and is untouched.

QAM_CLEANUP_REPORT.md still has no executed or accepted entries. Reported phase-exit hygiene is not final acceptance. Unconfirmed execution and acceptance remain explicitly unconfirmed. The Director requires no return to Claudy or Friday; renewed cleanup acceptance does not gate Git integration.

Cody completed current known-value + pattern scanning of retained pack files/ZIP members while .env.qa.local remains available: zero secret hits; seven synthetic fencing-test URL patterns reviewed under exact source-hash exceptions. Scanner control results and limitations are in VALIDATION.md/PRIVACY_SCAN.json. This is an engineering scan, not a QA certificate.

Removed only Cody-owned redundant temporary `/tmp/apbm-manual-private.json` and `/tmp/apbm-manual-sheet.html`. Retained .env.qa.local, .env.local, private DEV cast, verified private backup, Downloads login sheet and Documents PDF because Tony still needs local testing. Do not delete them to satisfy a generic cleanup template. No credential rotation, account/session cleanup, SCRATCH reset or DEV cleanup performed. No backup contents copied into repo. No local server operation during closeout.

Director ruling (2026-11-09): handle routine local cleanup within known ownership, preserving Tony's testing credentials, documents, private cast and backups. No additional seat approval is required for this closeout. No new cleanup operation or acceptance is claimed by this correction.
```

### FRIDAY_REVIEW_HANDOFF.md

```text
# Pagination successor — Director disposition

Disposition: DIRECTOR MANUALLY ACCEPTED; NO RENEWED INDEPENDENT CERTIFICATION

Director ruling 2026-11-09 supersedes the former request for Friday targeted review. No return to Friday or Claudy is required. Prior Gate Q candidate remains dc44429f466dedcf35023342f68624c6cee062f0. Tony now accepts Target One and manually approves the pagination appearance/behavior. This does not manufacture an updated QA verdict.

Exact delta since certified product: `src/components/owedbook/OwedBookScreen.tsx`, new `src/components/owedbook/ResultsToolbar.tsx`, `src/__tests__/apbm-read-states.test.tsx`, new `src/__tests__/owedbook/ResultsToolbar.test.tsx`. Source hashes: `../EVIDENCE/E2/pagination-usability/source-hashes.json`. Current HEAD after release docs is c5061d9; pagination is uncommitted.

Review `git diff dc44429f -- src` plus the two new files (untracked files are not in ordinary git diff). The toolbar moves below the active paginated table, outside scroll; range/page labels derive from existing results; buttons keep existing handlers. No Summary/Federal pagination, no changes to fetching/effect dependencies, authorization/audit, fixtures or arithmetic.

Validation retained: 40 suites / 201 tests, typecheck/build PASS, lint 0 errors/34 warnings; 16 actual-component light/dark × 1440/375 × first/last/partial/empty layouts. Text contrast ≥4.5:1, controls ≥44px, visible focus/no clipping. Integration tests assert one rows request per page navigation and no extra KPI/options requests; filter/store resets and stale-response tests remain enabled. Layout screenshots use unchanged local fixtures, not authenticated DEV sessions. Director live smoke is limited to the observations in CLOSEOUT.md.

The retained engineering validation and Director manual acceptance support this pagination successor. Friday's original certification is unchanged. Targeted Friday disposition and renewed cleanup acceptance are removed as Git integration prerequisites. No renewed independent certification is claimed.
```

### PR_BODY.md

```text
APBM-003 implements Target One scoped OwedBook/admin reads, owner reach, audited claim access, synthetic fixtures and the reviewed forward DEV runner. It carries the C-03 truthful-label/same-store repair and the Director-approved results toolbar below paginated tables, plus selected sanitized QA/closeout evidence.

Friday's Gate Q certificate remains bound to dc44429f466dedcf35023342f68624c6cee062f0: 40 PASS, 1 accepted limitation (restore not demonstrated), 3 NOT RUN. The later pagination repair has engineering validation and Director manual acceptance. No renewed independent certification is claimed. Unconfirmed QA cleanup remains unconfirmed; the Director requires no return to Friday/Claudy or renewed cleanup acceptance before Git integration. Tony accepts Target One with the documented limited Owner/MEMBER_B1 smoke and pagination approval.

Retained pagination validation: 40 suites / 201 tests, typecheck/build PASS, lint 0 errors/34 warnings, 16 layout cases. The integration workflow reruns checks on the actual merged engineering tree. See CLOSEOUT/ for identities, scoped path lists, open follow-ups and retrospective. No wholesale merge of the disposable QA branch.

Deployment deferred. Gate D and production readiness pending. C-02 restore rehearsal, C-05 privilege hardening/rotation, cross-tab sign-out and mobile billing clipping remain follow-ups. No credentials, private account sheets or backups included.
```

### EXCLUSIONS.md

```text
# Explicit exclusions / local retention

PATH_DISPOSITION.tsv lists every tracked and nonignored untracked file on disk individually. RETAIN_RECORDS.txt is the exact finite records path list; PAGINATION_PATHS.txt is the four-path repair list. No staging glob is used. Existing files already committed need not create a new diff; they are retained in the selected engineering snapshot.

Outside the records list, every changed/untracked path is LEAVE_ALONE, notably agent_docs/SESSIONS/session_2026-11-07.md and inherited agent_docs/RESPONSES files. They are not deleted or staged. The original dirty QA checkout is preserved while engineering integration uses a separate worktree. The campaign journal's inherited APBM entry is preserved along with this authorized append and deliberately retained.

Ignored/local exclusions: .env.local, .env.qa.local, CLAUDE.local.md, .next/, node_modules/, coverage/, *.tsbuildinfo and editor/browser caches remain local. No git add -f. Tracked .env.example templates outside this scope are unchanged baseline, not real credentials.

Private external artifacts kept for Tony, never Git: /tmp/apbm003-dev-v2-cast-20261107T080333Z-1347924.json; /home/moose/Downloads/APBM-003_Tony_Manual_Test_Login_Sheet_2026-11-09.md; /home/moose/Documents/APBM-003_Tony_Manual_Test_Login_Sheet_2026-11-09.pdf; original verified DEV backup at its private location in the backup receipt. Do not stage the Downloads/Documents directories or copy these into the pack. Any future credential-bearing file must be excluded even if its path resembles evidence.

Cody removed only two redundant own temp files listed in CLEANUP_OBSERVATION.json. Other /tmp execution helpers/debris stay outside the repo; no broad deletion. Sanitized helper scripts, failed-attempt logs, SHA indexes, QA ZIPs and screenshots remain durable evidence, not disposable private runtime state. Value/pattern scan verified the retained pack; exact historical archives remain unchanged.

Files added after this inventory require explicit classification/scan and a refreshed finite path list, not a broad staging command. No return to Friday or Claudy is required; do not manufacture renewed certification or cleanup acceptance.
```

### RESUME.md

```text
# Stops and resumption — same consolidated Git handoff

Do not blindly rerun GIT_HANDOFF.sh after it has created commits or worktrees: the initial HEAD guard will deliberately stop. `/tmp/apbm003-git-identities.sh` saves actual nonsecret commit IDs after the QA records commit and again before push. Source it only after inspecting it. Never invent a future SHA.

If a review prompt is declined, stop where it says; inspect the named staged diff, then continue with the next command in GIT_HANDOFF.sh after that exact prompt. Do not reset, stash or broadly stage. The original checkout's inherited work is deliberately untouched.

If a merge/cherry-pick conflicts, stay in the integration worktree, inspect `git status` and `git diff --name-only --diff-filter=U`, resolve both sides, and stage each exact resolved file. Review `git diff --cached` and confirm `git ls-files -u` is empty. Commit the reviewed resolution with the message appropriate to that step (the handoff uses --no-commit operations); then continue at the next step. If Git reports a remaining cherry-pick operation after that commit, inspect it before continuation; do not abort/reset automatically. Re-run relevant checks if resolutions changed product behavior.

If the final PR review is not yet approved, all implementation and evidence commits already exist and engineering is pushed. After the independent review/threads/checks are satisfied:

```bash
set -euo pipefail
source /tmp/apbm003-git-identities.sh
cd "$integration_dir"
test "$(git rev-parse HEAD)" = "$integration_head"
test "$(gh pr view "$pr" --repo Cyberize-Group/cyph-v1-dev --json headRefOid --jq .headRefOid)" = "$integration_head"
test "$(gh pr view "$pr" --repo Cyberize-Group/cyph-v1-dev --json reviewDecision --jq .reviewDecision)" = APPROVED
gh pr merge "$pr" --repo Cyberize-Group/cyph-v1-dev --merge --match-head-commit "$integration_head"
test "$(gh pr view "$pr" --repo Cyberize-Group/cyph-v1-dev --json state --jq .state)" = MERGED
git fetch origin refs/heads/main:refs/remotes/origin/main
git worktree add "$main_dir" main
cd "$main_dir"
git merge --ff-only origin/main
git rev-parse HEAD
```

A server-side protection failure is a stop for the required authorized reviewer/merger, not permission to use `--admin`, force push or direct main push. No branches are deleted. GitHub PR merge updates remote main; a separate `git push main` is intentionally not used. APBM-004 uses the actual resulting approved main revision and carried follow-up/lesson records.
```

### VALIDATION.md

```text
# Closeout validation — 2026-11-09

- Friday certificate copied byte-for-byte from Downloads; SHA-256 e7867554afc4a3f242ab09f02b048bd025d3cecb9c5e1ec79fd2e9103b588f37. Candidate dc44429f preserved; 40 PASS / 1 accepted limitation / 3 NOT RUN explained separately without modifying her source.
- Q2 ZIP SHA a266c5010b0775205bc88ebf6c670eafd4c9829520bf06ed7ad1d8ac594440f2 and Q4 ZIP SHA 0b89e6c9dc932d270d8db82f7915bba6e2b856e0a8719984326deb136eb8cd41 match Friday's certificate.
- All four pagination product/test hashes still match source-hashes.json. No later product/service/script/migration/dependency changes found. Reused valid 40-suite/201-test board, typecheck/build PASS, lint 0 errors/34 warnings and 16 layout cases; no unnecessary new full campaign or database probes.
- F-09 current manifest/handoff contain dc44429f; no remaining PENDING Director commit wording in those records. Historical state/evidence are preserved.
- No staged changes. HEAD/branches/remotes unchanged by Cody. Remote main inspected read-only: af2c7e5; protected-main policy is recorded in REMOTE_POLICY.json (one approval, resolved threads, merge-only PR). No bypass proposed.
- GIT_HANDOFF.sh passes bash -n; it was not executed. Director ruling removes the Friday/cleanup acceptance gates; it validates finite literal manifests before staging, scopes every commit, uses a separate engineering worktree and preserves inherited dirty QA work. Merge conflicts require manual exact-path resolution and renewed review; never automatic reset/stash/force.
- Closeout authored tracked Markdown passes scoped git diff --check. Immutable raw evidence/log whitespace is preserved, not normalized to satisfy a cosmetic check.
- Privacy scanner clean control passes; synthetic credential-URL poison control fails as intended and reports no value. Full current-value/pattern scan (including ZIP members) returns zero hits. Seven synthetic fencing-test URL patterns are exceptions only for their exact reviewed source-file hashes; real known credential values remain forbidden even there. No credential value hashes stored. Pattern/value scanning is bounded evidence, not a claim that uninspected external files are sanitized.
- Port 3000 remains stopped per Tony; :3138 absent; old :3137 untouched. No server operations during closeout. Persistent private login Markdown/PDF, cast and DEV backup retained. Two redundant Cody-owned temp credential copies removed, documented in CLEANUP_OBSERVATION.json; final QA cleanup acceptance remains unconfirmed and does not gate integration.
- PATH_DISPOSITION.tsv individually covers tracked and nonignored untracked files. Ignored dependency/build caches and external private tester/backup files are explicitly excluded in EXCLUSIONS.md. RETAIN_RECORDS.txt is the finite snapshot list, not a staging glob.

Pending: Tony Git review/PR integration; retrospective synthesis remains a follow-up. No return to Friday or Claudy is required. QA cleanup acceptance remains unconfirmed. Deployment, Gate D and production readiness remain pending. The new product does not inherit prior certification automatically.
```

## Exact retained records manifest

These are literal file paths, including already committed evidence retained in the engineering snapshot. Archives are QA review packages, not private database backups. The scanner inspects archive members. This review file is included; it is excluded from its own hash to avoid recursion.

```text
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/AGENTS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_LEDGER.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_SPEC.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_BRIEF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ENTRY.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_EXECUTION_PLAN.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_SKILLS_MANIFEST.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APPLY_CHECKPOINT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLAUDE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/ARCHITECT_REVIEW.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CERTIFIED_PRODUCT.patch
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CHANGED_SHA256.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CLEANUP_OBSERVATION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CLEANUP_REVIEW.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CLOSEOUT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/EXCLUSIONS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/FRIDAY_REVIEW_HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/GIT_HANDOFF.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/INVENTORY_COUNTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PAGINATION_PATHS.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PATH_DISPOSITION.tsv
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PRIVACY_SCAN.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PR_BODY.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/REMOTE_POLICY.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/RESUME.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/RETAIN_RECORDS.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/VALIDATION.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/privacy-check.py
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CODY_LAUNCH_PROMPT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SUCCESSION_RECORD.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E1_RECON_MISSION.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_AMENDMENT_A01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_EXECUTION_INSTRUCTIONS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_RELEASE_MESSAGE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/A01_CORRECTION/APBM_A01_CORRECTION.diff
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/A01_CORRECTION/VALIDATION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/APBM-003-CYBER-PHARMA_E1_REVIEW_01.zip
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/ADMIN_SERVICE_INVENTORY.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/AUDIT_OPERATION_CONTRACT_DRAFT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/COUNTS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/EXPECTED_CHANGE_LIST.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/FILE_INDEX.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/PROBE_LIMITS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/R016_PROPOSAL.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/RECON_REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/REVIEW_START_HERE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/USER_DATA_CALLER_INVENTORY.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/admin_gate.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/auth_factory_consumers.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/auth_hashes.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/auth_hits.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/baseline_delta.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/baseline_missing.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/bootstrap_and_audit_history.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/correct_design_inventory.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/deployment_inventory.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/design_inventory.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/e1_placeholders.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/env_key_names.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/final_deployment_checks.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/final_path_checks.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_audit_search.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_probe.cjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_probe_run.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_recomputation.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/frontend_sources.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/git_identity.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/harness_sources.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/historical_commit_gap.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/historical_paths.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/installed_versions.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/instruction_inventory.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/jest_write_evidence.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/keyboard_history.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/lint.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/migration_hashes.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/migration_sources.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/mission_coverage.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/no_direct_app_reads.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/privacy_check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/protected_delta.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/protected_final_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/remote_identity.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/root_instructions.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/routes.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/scope_check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/skill_inventory.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/skill_predicates.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/skill_sources.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/source_queries.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/source_structure.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/starting_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/static_counts.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/static_policy_inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/style_predicates.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/targeted_source_evidence.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/test_inventory.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/tracked_pack.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/typecheck.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/ui_semantics.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/userdata_hits.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1_PACKAGE_RECEIPT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/CHANGE_SCOPE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/COMMITTED_CONTRACT_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DEV_APPLY_HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DIRECTOR_RELEASE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PACKAGE_RECEIPT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PRODUCT.diff
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/EXPECTED_MATRIX_DELTA.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/GIT_HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/HANDOFF_SUMMARY.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/OWNED_ARTIFACTS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PROTECTED_PATH_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_DATA_PROBE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_RETRY.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/RELEASE_CHECKS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SCRATCH_READONLY_PREFLIGHT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STAGE_CHECKPOINTS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STARTING_TRACKED_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/README.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-empty.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-first.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-last.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-partial.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-empty.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-first.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-last.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-partial.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/full-tests.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/layout-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-empty.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-first.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-last.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-partial.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-empty.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-first.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-last.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-partial.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/runtime.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/source-hashes.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/tests.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/typecheck.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/verify-layout.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/BASELINE_0047_CATALOG.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/STAGE_0_RECEIPT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-test.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/forward-scratch-reset-1793891691098.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/forward-apply-1793891825878.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/forward-apply-1793891885995.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/trigger-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/NO_ACCOUNT_NO_JUNCTION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/forward-apply-1793892015163.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/GENERATOR_CONTROLS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/MOCK_MONEY_AUDIT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/apbm-user-audit-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-receipt-1793892147007.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-verify-attacked.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint-final.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/apbm-user-audit-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-4.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-5.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-6.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-7.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-8.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-prove.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/catalog-approved.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/forward-scratch-reset-1793893233220.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/legacy-cast-cleanup.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-receipt-1793893280657.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-reset-1793893258075.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-verify-attacked.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/apbm-user-audit-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-4.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-5.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-6.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-7.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-8.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-prove.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/catalog-approved.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/forward-scratch-reset-1793892988755.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/legacy-cast-cleanup.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-receipt-1793893015180.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-reset-1793892997395.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-verify-attacked.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/authenticated-reads.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-runner-lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-types.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/CATALOG_EQUIVALENCE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/already-applied-noop.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline-replay.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/complete.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892922977.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892925089.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892931150.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892932185.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-init-ledger-1793892918335.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-scratch-reset-1793892911758.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/init-ledger.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/inventory.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial-failure.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/poison-manifest.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/recovery-rehearsal.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/rehearse.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-changed-inventory.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-stale-catalog.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/remaining-chain-recovery.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-receipt-1793893445623.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-reset-1793893424344.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-verify.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM-matrix_2026-11-05T1528.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED-matrix_2026-11-05T1533.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.normalised.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED-matrix_2026-11-05T1531.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.normalised.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.normalised.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_attacks_2026-11-05T1533.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_revocation_2026-11-05T1534.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_scoping_2026-11-05T1533.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1528.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1530.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1533.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892495697.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892615550.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892809067.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/runner-lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/GIT_COMMANDS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PLAN.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PRESERVATION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PROTECTED_BEFORE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/RESULT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/REVIEW_FILES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES_BEFORE_STAGE6.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/ZIP_RECEIPT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/authenticated-reads.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/baseline-tests.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-check.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filter-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filters.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results-first-pass.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-tests.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-typecheck.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/local-server.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/owner-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/run-scratch-app.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-before-browser.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-verify.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/tests.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/typecheck.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/BOARD_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/PRE_AMENDMENT_SOURCE_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/REVIEW.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TESTS_BEFORE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TEST_CORRECTION.diff
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/BOARD_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/DISCLOSURE_RUN.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/PENDING_FILE_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/REVIEW.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/SOURCE_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2_AMENDMENT/VALIDATION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/README.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/RUN_CONTEXT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-reads.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-verifier-1794039202981.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-bootstrap-1794038740339.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-check-1794038634441.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-forward-1794038881799.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-ledger-1794038814674.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-prepare-1794038674081.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-probes-1794039228065.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-seed-1794039042941.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038759131.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038832790.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0052-1794038900225.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-seed-1794039080883.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-1794038865309.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-apply-1794038865020.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-init-ledger-1794038797991.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/init-ledger-1794038798263.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-1794039128076.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-1794039010338.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-receipt-1794039010043.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039018815.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039056229.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039118150.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039263167.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/DEV_AUTH_FK_DEPENDENCIES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/EXECUTED_RUNNER.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/INDEX_DEPENDENCY_REVIEW.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/LOCAL_FINAL_CHECKS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/POSTFLIGHT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/PREFLIGHT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/RESULT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/REVIEW_HASHES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/SCRATCH_APPLICATION_BOOTSTRAP.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/acl-controls.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-reads.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-verifier.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/baseline-0047.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/check-dev-auth-indexes.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/complete-0052.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-after-catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-after.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-before.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-before-catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-0048-0052.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-apply-1793977302069.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-init-ledger-1793977296844.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/index-guard-test.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/init-ledger.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/inspect.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/postflight.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-probes.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-seed.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/rehearse.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/remove-prior-synthetic-cast.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-after-catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-before-catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-receipt-1793977322480.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-reset-1793977273803.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/starting-catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/verify-0047.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/READINESS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/SOURCE_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/readiness.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/DEV_METADATA.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PLAN_MANIFEST.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSAL.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/REVIEW_FILES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/STATIC_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/checks.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/static-checks.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/DEV_COMMANDS.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/FINAL_READONLY_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READINESS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READONLY_EXECUTION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_COMMANDS.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_RESULT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REVIEW_FILES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/RUNNER_TEST_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup-tool-check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958434030.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958904994.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-runner.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/checkpoint-receipt.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/owner-check.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/rehearsal-receipt.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/runner-tests.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/BUNDLE_INPUTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/COMMITTED_RELEASE_CHECK_308247a.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/CONNECTION_SIGNUP.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_APPLICATION_BOOTSTRAP.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_SIGNUP_CHECKPOINT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_47.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_51.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_52.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_INPUT_PATHS.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_RELEASE_COMMANDS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/LOCK_PRIVILEGES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/READY_308247a.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_PATHS.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_SHA256.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/REVIEW_SHA256.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RULING.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RUN_DEV_APPLY.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/SCOPE_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/TEST_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/VALIDATION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/build-manifest.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/common.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793979737752.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980107801.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980439376.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794037368529.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794038449141.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/executor.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/prepare-release-scope.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/tests.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/BUILD.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/RUNTIME.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/SMOKE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/launch.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/CLONE_SAFETY_HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_FOLLOWUP.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/PASS_20261106T130308Z.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RECOVERY_COVERAGE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RESULT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/compare.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/outbound-check.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_RESTORE_PRIVILEGE.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_MANAGED_OBJECT_PARITY.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_RESTORE_COMPATIBILITY.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/BACKUP_EXECUTION.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CLONE_REVIEW.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CONFIG_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/DEV_API_KEYS_CHECK.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_CAPABILITIES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_PLAN_METADATA.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/REVIEW_FILES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SCRATCH_AUTH_INDEX_PREREQUISITE.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SNAPSHOT_BACKUP.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/VERDICT.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception-tests.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-archive-component.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-tool-check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/snapshot-backup.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/LOCAL_CHANGES.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/baseline-diff.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-test.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/fencing-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/preflight.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/read-only-preflight.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/FOLLOW_UPS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/MISSING_INPUTS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/PROVENANCE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AC_EVIDENCE_MATRIX.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AGENTS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/README.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/build-package.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/cast-matrix.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/check-qa-env.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/debug-pbm-options.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/derive-q4.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/derive.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/dev-apply-check.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/inventory.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/launch-dev-real.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/make-qa-env.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/money-rules.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/privacy-scan.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/q4-matrix.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-env.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-shim.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/ro-sql.sh
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/role-matrix.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/scratch-sql.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/seed-hash.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t04-allowlist.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t11_catalog.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t21-trigger.mjs
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/CLAUDE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/FINDINGS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/GOVERNING/README.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1b_REVIEW_01.zip
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q4_REVIEW_01.zip
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/ENGINEERING_HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX.template.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1_01.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1b_01.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q2_01.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q4_01.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q1b_AM-7_DRAFT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q2_ADJUDICATION_01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q4_RELEASE_RECORDS_2026-11-09.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/QA_HANDOFF.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/README.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/RELEASE_PASTE_2026-11-09.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1_01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1b_01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q2_01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q4_01.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/PARENT_ENTRY_ROUTING.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_APPROVAL.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CERTIFICATION.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CLEANUP_REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_ENTRY.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_MANIFEST.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PACKAGING.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RECON_REPORT.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/INVENTORY.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/README.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/admin/01/no_mutation.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/admin/02/no_mutation.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/dev_catalog_projection.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/handle_new_user_dev.sql
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/projection_diff_policies.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings_raw.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_run.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/admin_rpcs.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix_attack_flip.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/dev_operation_counts.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials_attack_flip.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/operation_counts.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/owner_reach.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/seed_audit.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_reset1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run2.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_before_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_grep.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_intact.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/02/dev_effects_q4.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/chain_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/ci.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/negative_controls.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/BUILD_mock.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/BUILD_real.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/build_mock.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/ci.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/jest-results.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/jest.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/lint.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/negative_controls.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/serve_mock.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/serve_real.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/tree_identity.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/tsc.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/auth_walk.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/chain2_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/debug_pbm_MEMBER_B1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_MEMBER_B1_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/counts_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B2_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B3_1440_dark.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B1_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B2B3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER1_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_UNRELATED_1440_dark.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/nomut_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/r016_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/spoof_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_store_detail_B2.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_MEMBER_B1_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_store_detail_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_store_detail_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_OWNER3_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_rerun_member_unrelated.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2_all.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/audit_window_check.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har/mockmode_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har_rpc_check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_admin_gate.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_owedbook.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/signins.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B2B3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375_drawer.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1_search.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_denied_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_store_detail_B2.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_denied_B2.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_FAIL_MEMBER_B1_filters.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_empty_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_owedbook_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_store_detail_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_empty_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_owedbook_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_store_detail_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_FAIL_UNRELATED_filters.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_admin_stores_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_audit.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_billing.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_empty_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_federal_1440.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_invite.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_owedbook_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_settings.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_store_detail_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_kpis_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_rows_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_scope_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B2B3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375_drawer.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/signins.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin_attack_flip.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin_attack_flip.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_1440_dark.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_375_dark.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_375_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/nomut_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/owedbook_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/labels/copy_modes.test.tsx.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/labels/copy_modes_component.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/labels/copy_modes_component.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/har/mockmode_OWNER3_1440_light.har
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode_run1_instrument_fail.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode_run2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/shots/mockmode_mock_FAIL.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/shots/mockmode_mock_admin_gate.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/shots/mockmode_mock_owedbook.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/signins.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/nomut.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/nomut_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run1_instrument_fail.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run2_instrument_fail.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_375_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_375_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_375_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_375_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_375_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_375_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_375_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_375_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_375_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_375_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_1440_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_375_dark.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_375_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/owedbook_OWNER3_f05_reselect_pbm_picker.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/owedbook_OWNER3_owedbook_1440_light.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/owedbook_OWNER3_stale_fence_B3.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/signins.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/carry_forward/Q2_01_carry_forward.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD_mock.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build_mock.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/bundle_scan.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server_mock.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/02/bundle_check_q4.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/board.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/cast.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/catalog_counts.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/matrix_delta.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/money_rules.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/policies.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/seed_audit.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/ui_dispatch_counts.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/02/allowlist.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/02/allowlist.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/check-qa-env_current.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/credential_mapping.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/env_qa_local_stat_names_only.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/make-qa-env_selftest.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/auth_path_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/baseline_to_candidate_name_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/branch.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/candidate_to_head_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/contract_hashes_as_read.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/e1_placeholder_counts.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/head.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/inherited_dirty_baseline_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/lockfile_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/log_baseline_to_head.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/migrations_0001_0047_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/package_json_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/qa_generated_paths_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/allowlist_check.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/dirty_diff_vs_q1.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_end.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_start.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/lockfile_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/package_json_diff.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/product_paths_baseline_to_candidate.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/q2_entry_check.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/records_check.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/ro_sql_fence_attacks.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/scratch_shim_fence_attack.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t00_repin.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t02_dependencies.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t05_auth_routes.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t06_migrations_0001_0047.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/allowlist_check_q4.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/allowlist_check_q4_attack.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/git_status_q4_entry.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/product_paths_baseline_to_repaired.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/records_check_q4.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/repair_diff_name_status_all.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/repair_diff_product.patch
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/t00_repin_q4.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/PREFLIGHT_RESULTS.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/frontend_target_check.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/automation_scan.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/automation_scan_q4.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/evidence_scan.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/evidence_scan_q4.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_clean_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_poisoned_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/seed_scan.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/grep_user_data.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_kpis_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_rows_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_scope_aborted.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/routes.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_A1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_C1.png
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA-matrix_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_CORRUPT_2026-11-09T0405.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.normalised.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_attacks_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_revocation_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_scoping_2026-11-09T0404.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X5_ac8_fresh_2026-11-09T0403.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/apbm-user-audit-proof.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-4.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-5.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-6.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-7.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-8.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-prove.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit_prove.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/catalog-approved.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify_probes.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794196996521.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794197163119.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_corruption.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff.patch
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff_review.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/inventory.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/legacy-cast-cleanup.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/rls_prove.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-receipt-1794197197146.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-reset-1794197174115.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-verify-attacked.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_replay.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_control_at_47.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195352571.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195353893.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195356328.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195955934.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195958593.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195347747.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195951557.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_48_52.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_noop.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/inventory.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_after_tamper.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_dump.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/migration-inventory.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/no_account_no_junction.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin_after.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_3.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_tamper.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_through_47.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t10_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t11_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/tamper_restore.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_touch.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/cast.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/generator_review.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb2_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb_status.txt
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_touch.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_attack.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run2.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules_baseline_control.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_seed_verify.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_0.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_2.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-map.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196267399.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196295856.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196251686.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196277074.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-verify.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run1.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run2.json
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_1.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_2_compare.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_after_touch.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_attack.log
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/README.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/RETROSPECTIVE.md
agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/REVIEW_NOTE_FOR_JARVIS.md
agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md
```

## Retained record content identities

SHA-256 for every retained file except this review file and CHANGED_SHA256.json (self-referential metadata). These identify the reviewed snapshot; they do not certify its contents.

```text
95c277af3d5d070a8c00103229431d1cf0a49907e135a64b6ba3ad634e1f76e8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/AGENTS.md
f11f26457a00f6e2787efad105ae5fe323bc68b3c4adf44d749a780bac4a81e5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_LEDGER.md
10795161de4a6e1304ae6ac57b0823d3bb2477e9d15897e6ebf0f924058dd74d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_SPEC.md
21a8f19c2be6672ab50a889c41df2b5142cd1d07247c471aba25de399f1a08d3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_BRIEF.md
890a337cde5657ea6bd09392113395d945763c72d771452f0016109f17c20555  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ENTRY.md
3ae1cf0d8e11364d81d2c6c311753c7b4f9e0bdf49d36635abd5351ca53ac187  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_EXECUTION_PLAN.md
e01c7b76d73ce1a1598163239b97e2b0282cd6ed96a5e05077c2ff6c71cbd3ab  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_JOURNAL.md
a25e4db9db4d290fd49be952efa7cdca7632b2e949b946e9b826108c69cc028c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md
3e417c09880b10571a4f58e9081623f2aa664852ecc67206fe9121611e612610  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_SKILLS_MANIFEST.md
3a4a1cd729b7fba6feee8a2eb679eb25b749598890ff3876c13affa2fb98cd9b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_STATE.md
56e805402e87a25471be5c9871c8ab655ccd524db4b3ff130a39d91b7b26cf34  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APPLY_CHECKPOINT.md
7e2d0b625c707e319e57433240f53c7f3a60a26016ddae7afe03a0bdaf4b4474  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLAUDE.md
d0666c1d439342b8c963b27de8b5f3780501044a2d439b48d34d6c41b899f89c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CERTIFIED_PRODUCT.patch
bf080a688fc131b5f9d5901be05af2da644179409b183cdc4ce74270adb23f75  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CLEANUP_OBSERVATION.json
13aefa67c22a45e40abb2dc211018abc72f9be187ec02646bb94552f5e7ec9cc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CLEANUP_REVIEW.md
dfa4c4392eb47c80d443695128483b9df4065d6e3a0c0e2a36e06b3a03f6f7c8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/CLOSEOUT.md
5b0a1d5e545163425fa1d2273a0fda5aaa85f2a7e10d7d3e8055c6011e399e66  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/EXCLUSIONS.md
32102355aa3e777d7c1ed2d318f7253138aba70666191b51a2b36121b4fbb4ed  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/FRIDAY_REVIEW_HANDOFF.md
e489f0e4e5c7ebd962e9fbd946e3004c1e8f54d2720411aef1d0f0a0b68813c8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/GIT_HANDOFF.sh
8df7b62fb0fd17f5d4dbb2ecf9604c698031959177d38323a4512a4443100f0a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/INVENTORY_COUNTS.json
d2fa5dd9b043e451c87713cddf70cbf3c0fa3c56c50a6c3f365283cd99f0bd6a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PAGINATION_PATHS.txt
206176957c750b1a9725f88a6717d4a056fc4bf19894c606f60d8a29d9dbe9ab  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PATH_DISPOSITION.tsv
621705176d35ab5239b869b8f2e0da6107ea73d4c52a0825ef5b1bc817764b30  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PRIVACY_SCAN.json
b89901818827149abca3b24ef3aedcb176cd776abef18e2a21bbdaa2c17c3538  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/PR_BODY.md
4d84d6bf82f56e2f0c94472cdbf734ac5b64b25b7af0ee3e33361fdb5c539f8e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/REMOTE_POLICY.json
54b8023936d124810fda82bca3767536176f2b384cc348a1e6ba30a230d8a269  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/RESUME.md
00c8ab6c11d4c3a36f8086286e6096c6dccd2d0e446dfd82e1e078f14e8e1ddb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/RETAIN_RECORDS.txt
6cb4aed6f23a2b44e9956270ec82af9f611a9f1dd1cbe614a5614b5c55ff12af  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/VALIDATION.md
91da8ee4faa68aac13b027ecfe8dad6b4bb25ca26b7eb8412ee45911a023559f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CLOSEOUT/privacy-check.py
052958a429cffc6350ba8f6eeae2191b63b606f638c9f4ed7aeced1ac1414fc6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CODY_LAUNCH_PROMPT.md
f71a48b7f7b2519c086ee11cd6bb3df9eb364573c28e1120473a8266cfd58a78  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md
3fbcd12b873577ea3fe0f440b0ed07860d0dc812655a8752abd22533c6edb1f4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md
07ef12e5171390b62a79b8b248a19c3fb57d81381ad1c1ebdd45c57de01689ce  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SUCCESSION_RECORD.md
0c79159e2c983413e0b3b974d2012ec751ef0943b6669b8b20323cf7445dee93  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md
16bdf3e2195796a775a15c0bdb918f25af6836eabd387bcc3aba5d2ef71d4b1b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E1_RECON_MISSION.md
b0a45a078cf23f7fc3887a08f7dd74ae82f1f2937b7f28f1a685f06c5d82d49e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_AMENDMENT_A01.md
21ee409e20747d85fa1761bbf3f4c0bd730b2c623deef2e35fb356f394e56f60  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_EXECUTION_INSTRUCTIONS.md
f0dc710e0b1674f1f7ec6cbb1e1bdf1f3fb36ee748fa346a62b998fed864c5eb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_RELEASE_MESSAGE.md
9def39508ed72d4e33ea55b439a7cbeb3d9835c8c1d82f113c159605c8c9852a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/A01_CORRECTION/APBM_A01_CORRECTION.diff
a520dba4ac2f54cbf9a3fb77a65ab224a39db868a35c5f929b9bd4f331fbbf8a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/A01_CORRECTION/VALIDATION.json
949262c1bf5fb3ab774de93de9bd5e3bda78d76ac01af0ac4d1f70ffd96f78b5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/APBM-003-CYBER-PHARMA_E1_REVIEW_01.zip
cd36fea890cd126ebc776c0dba296868f960b3c075c1fa38e741052b49607535  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/ADMIN_SERVICE_INVENTORY.md
d06af02498bf87314b3637fe447cc128a314777c7d2782815e9b0938651baa73  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/AUDIT_OPERATION_CONTRACT_DRAFT.md
ccbf5bc20c7abaf366112fbebd5193be251cf62dc1ec0432124bc97cb74a5eb5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/COUNTS.md
06c75cd1e151507834f8cd9a027b252135538bec16197cc424f195a867e4eadc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/EXPECTED_CHANGE_LIST.md
ca0c5641df05e0065fdc2a5503f98a0e5460bc86a65aa82c032307862efc7b49  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/FILE_INDEX.json
9af7afe7b4e3aa894e2da16e58455005d2424b17891905f12ddff4d0da724fb7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/PROBE_LIMITS.md
49e60b9fbedba7ef4ec489761b122b8a9c2896c7dd1b420a051db7b21a2353a4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/R016_PROPOSAL.md
0496174510c13f6e47e19aa4c2e6eb7d30d07dd8d5aa88f66b3f147292c3db94  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/RECON_REPORT.md
761038adaaa450aab79641b35259623af0e52753f932b685660e60dc37522871  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/REVIEW_START_HERE.md
10692cfbded14482c87b1701e36107dbf126a5a170ab18876621e2321d440742  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/USER_DATA_CALLER_INVENTORY.md
dc395f597aea82d7d3b19236463a899015565e5d04ed9e53f74f4f751173ac48  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/admin_gate.txt
2e9dce48564db415f5497fb2835e640047c569da5271b1b060ae920f7e4578ca  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/auth_factory_consumers.txt
648ce77a2b399a22f038b6486b7303072356d190e3c1eb7e90da01a8bf992f93  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/auth_hashes.json
ee6e55497678316b0a3e04d7a7d80ecfcb42b9724f15023c114a60a668508d0b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/auth_hits.txt
ed9e64ba8a4954cb23aa9a36a5697a2d9eb68388b44727fedf52bf83aab38657  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/baseline_delta.txt
ee07c2127144782ad0e9f0f6c5c59d87f76eafd0caa4427b3d62d4d405eba091  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/baseline_missing.txt
f4af9001656e75758915bbe51d08ceb929d12e98591e9deb775df936a68ac684  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/bootstrap_and_audit_history.txt
64ed700894e9ca8a84e7a35094a91fd76107ac0816b6d401fee1e0beb5704628  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/correct_design_inventory.txt
ee978edec3a788a140027bfcadfc314a2176640c5b9c8464d2d091bfe8bc6834  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/deployment_inventory.txt
0973c46618ccb67753568d753ddf6ffd68c1a9b2d101dab49755caf8cb17abac  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/design_inventory.txt
1a86519ed802b7a8d302762e54eb360d38541c09d0094d76ea2788617fcbf44c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/e1_placeholders.txt
083fa38ad03a94fac2ab58dd9288f11e535a9b831b56f1d9aa865325e3636f6d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/env_key_names.json
bae7db31f1b78f265e1341ef11534cacf86569c06a93a9e833ab4d4b777b6c8a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/final_deployment_checks.txt
9dadefe3151175e54c17da59cd31f85c6a23f7dd7bc4ccc8b2de16e1d1aa87e9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/final_path_checks.txt
928751d09df8babbc11e552cd4d8c977144dbc6c9401720ae1a2ef20522fe6d0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_audit_search.txt
d63dfd8d8c9afd45107967c2593e7e379887efb2226c4464b120c110cbba90e6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_probe.cjs
84e791a564817feaad86aea46ff8b1f82a108231bbb035856b24d7dc7323cb22  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_probe_run.txt
c1a9ae9dc58c55899afc49cbf7a05bcab96cc40877bc32c0a3e1e2e3a5fa013b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/fixture_recomputation.json
5cf9a81fc2443341d4b1e9119755eec549bbf92d4989dbb69a68db3bdfe85057  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/frontend_sources.txt
53adb335f006982d6aa2322f454080397761207295bd47092ddfa68d504893cc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/git_identity.txt
57ca3fbcd8d9b517216d19b2ff6e3413bcb149c5102818f04856d42af671e64a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/harness_sources.txt
5fd19345f7fb36e2b387df71924fd931954fad2120f5033fb341f31f624f7ef9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/historical_commit_gap.txt
517eb8358e51144eb6fe14930e262347a4e02048c16090ae12c4686f80948647  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/historical_paths.txt
684bedcc4bfd037b3a9d5cf2c206f20843cf322fa43a652d86a41e9df67fb5b1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/installed_versions.json
b11d1687c4dc7b2ebc7003ab1e904bdffc9f723ce82e3619dfc9361a56cae16b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/instruction_inventory.txt
6909f15b2de15e4354f6fe70cfb3a1de1c8f693b425022b695659f29b49d691d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/jest_write_evidence.txt
9211162d6efefd4acbd6619b06f5f57bf2684905f2ed3f9b18578fb1d784a05b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/keyboard_history.txt
c03e67e9f8652fdc1d1a56808fecf50b0209026e67335035096f6d6857e12089  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/lint.txt
9dfcfc309a3a46ad4f4ec64db65cd0b279fd2e8aca54b47440e89908df9283b6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/migration_hashes.json
2b782f60ab896e98795c99e35c15fc28a93d35c106a99dc737a67540a2d3e038  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/migration_sources.txt
00236abd3122b565897b6ece77676427803ae3d899777a97fe2457f022112805  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/mission_coverage.json
4df4d9954f5c43de15bc9086cb202768a533e35b833be0dbdc5e6619ba8895f8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/no_direct_app_reads.txt
e4663206a4a4cdb17c63387c7169de6babd605e3b1d189925beefda27d1a63c8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/privacy_check.json
88c9266ac3bb74b0a8a5059bde518b693b6d886f12ebdd85c2114b51d676fc81  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/protected_delta.txt
fa493ff7e44f18573d8d67e952d51990abe54fc937db5761ac69dfe05bfc76c9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/protected_final_diff.txt
db1a5059254210acb435d90167438a6b7e9beec2a89390e87c0edf60d369279b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/remote_identity.txt
e41d65e1dc7f971fb4c5b8ee18f0ce605c7c34b6619e3ea5a8073d4269f9385d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/root_instructions.txt
88e565f76a23fa3d4ebcc0fa1210c77b5f06e8d5f5b2f0a35b6e6a98ad889b9c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/routes.txt
a10f03e770a6867f4eb0d84e7b0e6324de943e7fb9d01f1d089020818fdaa6fa  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/scope_check.json
4495acf6e84fe2159b69c19ba35efa5ac5c6556250308f598c35df6a837b3a6e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/skill_inventory.txt
3c909af0e86c82a219882f8280e72a0b8ae97699beee095fa9579c87f35102ba  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/skill_predicates.txt
ba74a04fecdf9f0b9f274c540ff511af4eaa188f4bd1605172b53271f0f153d4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/skill_sources.txt
50e9a1945ca46d7a1c60e7af7370ef1d16b66a3f4558ca9546c37b1824ef0acc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/source_queries.txt
a155dba707b3b619d5423a5ca404c1d572b85459aea3876d2ad27cac5a611b74  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/source_structure.txt
ed086cbd88946e623916d594039999ba3be430cdd2ea1e1b3ca29fe4ada0bf6b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/starting_status.txt
1a42026be99c69ab0e604e9c652aff89ed9c41f02280aaa811cd56cb03a33d48  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/static_counts.json
5391036b9b52868aad9443f10ad21043e795f3406798ebdeebf08f2af416de77  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/static_policy_inventory.json
cae39f2635e899fb4e8baf105cc38572f4de3f1f940ca0eeec0bd497b8a0e3f8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/style_predicates.txt
ba1dc51620645bb79807bd09031b6aa9a4e8daa40ab6ccc720ed398b4843a115  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/targeted_source_evidence.txt
1a06e3e6669debfe09c89797cae0407d6c0dce27307ec29e9715196fe7a8ea83  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/test_inventory.txt
cd30f3ba05f012c2d5d834c72b318bf6c650e2b3aec6c4d78b4e4abbb8a7a2d0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/tracked_pack.txt
4695beeac8e9f30571f23520f2389d73ece81e0fc25f741643ceabe901ed2c45  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/typecheck.txt
d702f58e4f8776eba778de231e0065cf927a52d6c5b7e54781ee9026a94394b4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/ui_semantics.txt
b1a23f40c362b57968164c86f23682cbe008801b90a7b33c454c2754ca68555f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1/userdata_hits.txt
fdbc587e30b25d9b38f6151845f519abf965266e57a1f9b39066c6501d5343d0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E1_PACKAGE_RECEIPT.md
a4f94895f2cc16cd094f63054d233f1183ae169922fe6536c1b9a2ba73130d7d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/CHANGE_SCOPE.json
277c0a566dd499d638ad399b81de3c130215cbfd32f38957a95b00cba9eb043e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/COMMITTED_CONTRACT_HASHES.json
5add4b4636b455618f0b4e167263f242150aadaee060d56cf0dcd4fcb7c86462  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DEV_APPLY_HANDOFF.md
c47a28dc05c690e9f301fb533240f1cbc958bce069427c813efcca51ec9d6e61  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/DIRECTOR_RELEASE.md
999369ec8e6f07d57024dd174d6c69f736a5cac0763589b7e28bceae98bb3140  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PACKAGE_RECEIPT.json
b315e81d2c6cdd271d4e9107cba9ee57b9a11d61d5a8553d26582ee30f42dda8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/E2_PRODUCT.diff
9a5c59b28bc45c1f614f9cd4f1a434103fb93c6917af9b39d7c1350c7f94afd7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/EXPECTED_MATRIX_DELTA.json
9ce220626b74ee54efc4fa05cb5ac80595197642b8845d214a8de39e3a20a7cf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/GIT_HANDOFF.md
cf30be124a73842f0e5c023338e25f3ba91147cffef8a723221adab724511c3a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/HANDOFF_SUMMARY.json
51406353523dff39f1a3efb705272b6447b1fb07aa35584edc462168fef7b1c9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/IMPLEMENTED_OPERATION_PLAN.md
6ae9098efed441fb12fa017142e2c07f43213fde70434b0477e67fa93f55a837  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/OWNED_ARTIFACTS.md
d08efdfb33a27fc96d84852ff72b84ae60a058d7c38a0d5fdc0010cd928fc239  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PROTECTED_PATH_CHECK.json
61fd03f60b00e180f9af43df7b94a4cc5a397fdb4856d309256d13665dced9e9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_DATA_PROBE.json
ac3b2de5deb5083d97fcc4b1176afb81ccca29e5c216b65f7242034185f1eb25  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/PUBLISHABLE_RETRY.json
f42219714f0e4f3f953b70026825c4bdfec53e12578701f536f9153213e80c51  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/RELEASE_CHECKS.md
88d5542b35f0ff39693c7da1a369590a0e93739a6bd05c10dfefbace23ce25c0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SCRATCH_READONLY_PREFLIGHT.json
740bbeb21dc4bcd7580a78551c3faf3b22d34adbe13afd0b4ae5313926636dc9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/SOURCE_HASHES.json
a389f7a9448a5a8236f4a9d35a8bbd3611e5fc677a7f85c6c3b9abfa3f79fa81  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STAGE_CHECKPOINTS.md
ffe9272ecc74b1fc1ea0d6f51b645075e27c252102e129fef50ac7829e836dbf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/STARTING_TRACKED_HASHES.json
e2fd77c240f4aa2aebfe523f272d9775260147be1e9ec06dbe4db754c4284625  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/build.log
65108ac6b8aa5f0806f3998051c580326f9b8e5301387fc42b2a394e1dc29b01  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest-results.json
0e116721b9a777bb734a329b60daba4fcb4ed0ce269bcbea1d0b75c22cb97155  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/jest.log
fc2b90d4c9ca3f8e831bd936cf0e368cbbd7f0e20da7ec473146b396ccbd71b3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/lint.log
2d799cb779e02212dcb019b81cfe6ecc782cf754a725cc6165983d7159801f33  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/results.json
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/baseline/tsc.log
9c38495e0aefb27a9c59e80fc3ea3ff16a3f1b2774cfbdc4d650af7d6043ab2c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/README.md
490e22d201de88cfe5f98adb7dd86d2610b1f72ef1d4d5b3ab1a31a54b9a6f12  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/build.log
e41df0a60dc6a8472ccd49f160d3ce4e1cacc761e34cdabc9ce00c900bfd5f6c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-empty.png
670383f403d997bf7ca1cf620fdf6beaafa7c4e1b52b7ac791b0a8b2240ce64f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-first.png
ab249961444d1fd1f8a4793a55e0b0cbf99e685476fd9ab4e75e7abab5228145  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-last.png
f5d4cddc0ad38b13972178d50dfd36e9865e7ee80b28cefe1e96b99c3dad1b42  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-1440-partial.png
5318b50e839f90e98301f87c2ef668f97cf8a52c32b90dd25bcfe6b585422204  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-empty.png
f9f4a769d843cebc19cf5bd103ef810d9474fcc5f9d33f1871913d9aae2cc859  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-first.png
7b7f46f4679c0e3e60c7d4f69242bd2a180bb11c0e8b1dd3735aaf0b01286253  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-last.png
79343c8b08ed38c9915b2236ac24c53b54967b2f8925415f4ab7616c6d4a830e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/dark-375-partial.png
b307f6bf3fd782ce49d6cb09e669c6ae3a386fd6f4b94e8f694387080a80a308  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/full-tests.log
6829481d4790dd9d6ca24dcdd30c5ff837bba66374eb08c69420bb2a05ee68a8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/layout-results.json
923b58f1728cbf18d469eebb5c6a949b40415f534b91169c31b2623c10b55001  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-empty.png
39bd96f83d3a273301d2f1da1a1f02fd1a684ad1d44efd4156266cb3f9d7635f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-first.png
ce174b8eae8161dde0e6bf31e1d870c0d27532e67670bf2d50449a425bfe1c0d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-last.png
ca3c88290305eb334797d80c68915bf67d727b7e47a99c3f90d02fd47222496b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-1440-partial.png
8e9a961dae91669a8755f3bda334f30417412bcff30b77e85f1a8fd3c63485c8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-empty.png
f05bb2df8950e31e1bb5a36c6298e1e0b12afa81eb5132f8358601be0bcf7a8f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-first.png
5362cb5c9a98d5983db0d99cbd9494673f95fc5598bc35a6bf9f970e0f9f1777  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-last.png
a836986a778632e336d9c1f75b4ade27171b4e47f536921eb545c82b884a2c5a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/light-375-partial.png
3f5351a0f65f4fde7828294178c2bdf3756bdc1a94c33b6ca1b0b1733abf87ea  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/lint.log
58a849510fe297934899dc03f4de004c1aa70e23c9c649a4f9db467cd2233281  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/runtime.json
8fe0dab6f11343aaa8cc0aaa34947f315a8df36c5eb2a5f4e62938eac8c43236  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/source-hashes.json
39bde770f82d41a49df1fed69299d5970d52e816d4311850cca3e2944b37c291  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/tests.log
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/typecheck.log
02e965a58da2fb788a138d83705f842f84d8e84427fe755900dcf28b5d647249  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/verify-layout.mjs
d10582aaa57f032b9e7e6a6d5c27554e5144ca7329d743f3aaf116c0d990cc4f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/BASELINE_0047_CATALOG.json
35dd3366bf32e7f2e2ce967c8204429215bec0e26f84b52efcb9a8ac927acc76  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/STAGE_0_RECEIPT.md
d10582aaa57f032b9e7e6a6d5c27554e5144ca7329d743f3aaf116c0d990cc4f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/catalog.json
2ec3c02d0b93991f998c7fdd871ea94884f6d7fdb888ba50b02df574f9987211  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-results.json
758e0190aadb7558f78f78086fb622b9252e815a6e2e6fcb7242337978e51ec4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-test.mjs
9012badbc9e0a85ee4766f30bbfb23480fc322b54326a481173c9d9851bb99e7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/forward-scratch-reset-1793891691098.json
d6ad4afe3e98bd27138e70eb66f1961743c1fa6f8112fb693c46c3e85c08394e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/migration-inventory.json
0c576215ef9352e671dbcea111fa038de2fbbaa6583f0a79b38a26aae824d75b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/catalog.json
69548d7e1a290f3f4105d2c77f0a8c07e6aaf63d21a639e48cae0699478e3e5e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/forward-apply-1793891825878.json
c0e5b26a3350e8dbab7eb3c2ef0a84cd771ef7ba67c5cce01dfa50fe3578f256  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-1/migration-inventory.json
8d42e9f3ad5984e97aa77cd3af6e97d63117ea0732858c8b78c3ee54d0629f25  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/forward-apply-1793891885995.json
361a6a9bb5f0d58460d88134caaf8b187897c92bbd1f98778f63e604d8524710  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-2/trigger-proof.json
793a4bf21ef59ca393ad531df80c3380c0468666541e15ab37f9eca19801a8d7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/NO_ACCOUNT_NO_JUNCTION.json
d1015abaa530d45205cd7afdb0440f7831eadfc4829b2abcb1b449d43a4df959  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/catalog.json
6f6d2514bfce46bee97e2b9b0b1050b2ad7196761f43425d925081eae765e627  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-3/forward-apply-1793892015163.json
f9e0541fd592c5aaa24e8888e74865e36aa9222ce23ccbfb25f805c0a5304911  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/GENERATOR_CONTROLS.json
3f307cf5be6e3fdfe8959847f5c17d1225e1b625f3886afef3cff83cb56fa83b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/MOCK_MONEY_AUDIT.json
d262dbda074d6c493ed6bd19bb2a73cbae9e12f2208d4ab54ef691185fbe2973  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/apbm-user-audit-proof.json
1bfc327a932578e9bffc868f6285b26d861ef70035f8966994597182ca9038eb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-map.json
14e11de9013d1aa179311e1aceaf566f53b14102c0db18e74ef99e6871ff26db  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-receipt-1793892147007.json
d312dc42626afa48917583421ae92fc5775d60cd03d7389e689238e5e7a02864  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-4/seed-verify-attacked.json
bee64a867657af82c080b121e4bf59ae1b2ea13049162db4e8625bcb1f8039de  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint-final.log
8d3e60446b4505aeeeb794e15f167b8e9b51006cb9b98a62956fce8c07c9b2e4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/all-runner-lint.log
66aac61f7992b6029bca31b01b0dfbdea0387276408af4a52768a2118d71be23  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/apbm-user-audit-proof.json
5f04d4a391a7a08fa9cd5f2d98ab353c7a24b8992763d0577c3b2b465b04e3d1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-1.log
b77209290af3079f50fc8d933a1d1139f561b5443d3b7b106655764cbaa81819  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-2.log
d2ded26f8a2cc6a7274ec38a017ae62aa049ba52c717cdfa103338c61d247d20  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-3.log
3e8491803ac49b97ea80115ff9d2d22248349d802bdf7dae6d4182e3580778f3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-4.log
30047de1ff1ae30f31bd88c5ee9ffaa6bc0f4b38fa22f66de756be12feab4c88  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-5.log
663633732dab8245f3334ef2a3cfd64c635adad02881c0e9dbd75df505671c85  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-6.log
0cc0362f52e45a3fd7c2a7a81b69225f5d9de2a834e4f17ab0a63c7917dab02b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-7.log
bec5f26c0c6a829cedf923d04e9544ca83f0cf6dd7059b3052aa3e185726e68f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-8.log
39dfba5ddcd7b30c4be1daea3ef5ca7988be5bbbbf6c2ae761a6a519bcf02b2b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/audit-prove.json
67431340cd137921c855b9f53fa959714a41408623a66cce499ca9d0502948d4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/catalog-approved.json
c0b1411de0ead27c82f10c17c16676cbe25e4f56c2d01a17b8ffff8a7b13f382  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/forward-scratch-reset-1793893233220.json
a4b551f99108a74177e3478b3ad74411c2dbd394f18141f3b075083b261a2b7c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/legacy-cast-cleanup.json
c0e5b26a3350e8dbab7eb3c2ef0a84cd771ef7ba67c5cce01dfa50fe3578f256  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json
dbd936cf7bbeb16acaff8ff811246a17b16879252fbf46302a7cb7b4188b5c0c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-map.json
14e11de9013d1aa179311e1aceaf566f53b14102c0db18e74ef99e6871ff26db  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-receipt-1793893280657.json
c6e24e713f947f9dbcf941e2ead9516ca554ba344601e7c5c48a7df0916ff769  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-reset-1793893258075.json
a2b54c2b8783997ae1b81469baa298bd8344f4c2eff0bf2291e24fef18cab10a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit-final/seed-verify-attacked.json
66aac61f7992b6029bca31b01b0dfbdea0387276408af4a52768a2118d71be23  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/apbm-user-audit-proof.json
5f04d4a391a7a08fa9cd5f2d98ab353c7a24b8992763d0577c3b2b465b04e3d1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-1.log
b77209290af3079f50fc8d933a1d1139f561b5443d3b7b106655764cbaa81819  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-2.log
d2ded26f8a2cc6a7274ec38a017ae62aa049ba52c717cdfa103338c61d247d20  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-3.log
3e8491803ac49b97ea80115ff9d2d22248349d802bdf7dae6d4182e3580778f3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-4.log
30047de1ff1ae30f31bd88c5ee9ffaa6bc0f4b38fa22f66de756be12feab4c88  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-5.log
663633732dab8245f3334ef2a3cfd64c635adad02881c0e9dbd75df505671c85  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-6.log
0cc0362f52e45a3fd7c2a7a81b69225f5d9de2a834e4f17ab0a63c7917dab02b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-7.log
1041e2d797aa449c9697e92e938b0ada9f6f6df7b0e9dd8ec095df1e0c09cd94  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-8.log
8342a329de485f4105818aa39e382ccc7125b72753162cc4d752e7f8508583b8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/audit-prove.json
5ecd1508fb7a435d021d54086bd875fb2c6d2d10ae15a41466c70a587a93271e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/catalog-approved.json
f95b3890f0123d97d18300410097d5ff2fe7f656ed15d7089a135aecfbfe63a9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/forward-scratch-reset-1793892988755.json
a61d9b9b3573811211ad1bb1f618fb46fee661834026114c615dd56d9cc00f70  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/legacy-cast-cleanup.json
c0e5b26a3350e8dbab7eb3c2ef0a84cd771ef7ba67c5cce01dfa50fe3578f256  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/migration-inventory.json
2ceca64f1fc807a4e6b71ffec87aaf23071d1885dd21dc039bdf5947940dcf14  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-map.json
14e11de9013d1aa179311e1aceaf566f53b14102c0db18e74ef99e6871ff26db  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-receipt-1793893015180.json
c6e24e713f947f9dbcf941e2ead9516ca554ba344601e7c5c48a7df0916ff769  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-reset-1793892997395.json
a2b54c2b8783997ae1b81469baa298bd8344f4c2eff0bf2291e24fef18cab10a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/audit/seed-verify-attacked.json
e253d390e463af6ab58935b3a7b0ad13ac933ec603734bc77e48bf007c5a8d86  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/authenticated-reads.json
b563edf480f06a0948ba95f8149aa2405254838c54c7c51bf23725de95f59a6a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/dev-safe-rehearsal/catalog.json
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-runner-lint.log
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/final-types.log
90a1055822d4ce83e014284cca64ef825670bf4a5374621542e9949917b94e4c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest-results.json
e385c005cea1825d3b31d06916661c9cde705c3980d939c1103c876eedde9a60  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/jest.log
b3cd7fdaeb40889813b2e1d8790818adde335934df9925b254cf6311bf664373  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/lint.log
3f3402387db47e51355e2c105b1c8406285c16903cf07ac98b347f5567cdf2ba  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/results.json
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/local-board/tsc.log
51028ea36096e27c649d089e4671f4d6540f60e841ab1692abd5425d38977437  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/CATALOG_EQUIVALENCE.json
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/already-applied-noop.log
40e6e51af8dbc33a9e557f05f4e52ebb098c6794fa42c7536ab6632fcdc64626  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline-replay.log
ca73f40566ebde06723de638d0d607768d3a239a2b76581d8c6fb15bac4a5d1c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/baseline.json
343419bd29d8c3092520115c7a1af617e298121ac9f64deb4aac0c97d6f30694  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/complete.json
920a4329234f2bc850a026647c0b4306b28f1dcfb9e2c25c87ea8aa8b8da779b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892922977.json
bebdbe3748e8e2acb88ea91f04e16a6a7eb1d1cb7453fea9b725652a3670e9a4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892925089.json
3a623ca6f304a9e3d6eac1a5d8fba59e3f60b493db1da553fc62325a387ac0e7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892931150.json
4258de9edb6498e72aba889f5d3b6e0b14897cd9c89a76eff07aed569055ba5d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-apply-1793892932185.json
0bc3e63238fc0291d92ee784f3b0d6386f5cee23090f2691b704130be0711695  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-init-ledger-1793892918335.json
a7871e1c415eb2e7f4dba77e5a3fe69e4ee5c790a5bb359aacf1a1fbcdf82721  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/forward-scratch-reset-1793892911758.json
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/init-ledger.log
9cd3eb153d873fe31c52de8b28e407a9d991aac2f234a582af29121f1bff9825  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/inventory.log
c0e5b26a3350e8dbab7eb3c2ef0a84cd771ef7ba67c5cce01dfa50fe3578f256  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/migration-inventory.json
04b47754369ba2e2e0587eb743d32a7f4db6715975148708ec8ebb28049e86fa  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial-failure.log
e06a5051b96e8d1134cb42bdc842d55eb3975ff69b539ccc7b4453aaa531294d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/partial.json
6e7d217fd91b24a29900e15d91436c26ed0934f508966519408e3a29825d61b5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/poison-manifest.json
8f95e9f1bc5c45b3c01adbe4550a1e44b1fa78a15b904df9609c4e1b4476b5d9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/recovery-rehearsal.json
aa37417792b2bdc1208336a33d91c43245a725cd48d33a1592d7f4ef11422855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/rehearse.mjs
9de5ef091e3f702bf6a6f05a8177a00d9f279d0dd0332a573e801120851308c8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-changed-inventory.log
f4a75f316734e4de94250217aaa1e14ad35399440c57ef29bd1e7b8d0e0cd984  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/reject-stale-catalog.log
4fe4e317b08152b390d37ee389f5538c8efb884a717c9b967cdce32fb88dcbe5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/recovery/remaining-chain-recovery.log
b563edf480f06a0948ba95f8149aa2405254838c54c7c51bf23725de95f59a6a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/catalog.json
a5160ce6bc267ec97a0bf5271cee842a23064fd62b0072c65871963a55b4bda0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-map.json
bdc2d9149b77827d45876c7510ee9840037e3e56023d1837a9d298290304af66  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-receipt-1793893445623.json
1f2636fde712658f18a4211eb8cace5820a6b6b41bf9862599224dd35ba9ca7a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-reset-1793893424344.json
9ebe44f8376f357345f57b79ef4975a53ef147978cbea6703508f89ca72228c7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/reseed/seed-verify.json
37a1290479ee30cef5ed47f3b2ea461482e4a5bd1557261e67274595d3c41072  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM-matrix_2026-11-05T1528.log
2c6ea64b3a94c6959410005489c3088071d02b90ad4abae1a61a7affd7057df7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED-matrix_2026-11-05T1533.log
dd3f48a0e2147e4d5729164ee42a804b65650e9b281c32768084f227b173209b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.log
8954a6c11813716f9ad0f39758871f1fdfb7be69656299414051c51e6e7c9811  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_BOUNDED_prove_2026-11-05T1533.normalised.log
00d9a84cdec59e4b7c63ac4803dbc200c60263e8a2701b1947009261bdde6bee  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED-matrix_2026-11-05T1531.log
0699346944d904e62a2528dcfab3af1ccd25111d193ada32a8a2507bffd90e10  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.log
b6c60571e4366e720777e0375ac8c64a058d4c62a25fdf8a9817afb232346f18  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_REPAIRED_prove_2026-11-05T1530.normalised.log
388287479069abd1eaa6a5fffa75111461a3a54bfa6a0af5a6806e80c8a36ef9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.log
58d1b20b562590c3ac2ccf37d8e68a754e5334f1b93bb87645b89cf801ddeb60  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/APBM_prove_2026-11-05T1527.normalised.log
db514cea2cfc14002f71ef0354cf42553a31a70853cfb67af26efb238a55da35  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_attacks_2026-11-05T1533.log
634fff0166881412a62b9d3bcda3828e28f885b88f1b23f6126e9da54efdd847  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_revocation_2026-11-05T1534.log
e9753222a4062b68bd5a8fb7ca57af7879c996fbd13b3f395d55bd98cbb7ffe7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X4_scoping_2026-11-05T1533.log
b9c04465320fe0bb6b47d93b71bf47f39655267da0cf27b520f7209c8dddc44c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1528.log
b9c04465320fe0bb6b47d93b71bf47f39655267da0cf27b520f7209c8dddc44c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1530.log
b9c04465320fe0bb6b47d93b71bf47f39655267da0cf27b520f7209c8dddc44c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/X5_ac8_fresh_2026-11-05T1533.log
15f22a6b7a0a8029031ec83ac2e81e05b5f0805a53005fbfb2132a24799015d4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892495697.json
3f0685d2e2db1eff2722de9e6efa648bdf4c4006ef314584a64040f63e97e269  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892615550.json
d5ae91239be1498f2bb8f7b338f1508ee9aaf0806a006adf10eb3a0ca4f0b43f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/forward-scratch-reset-1793892809067.json
c0e5b26a3350e8dbab7eb3c2ef0a84cd771ef7ba67c5cce01dfa50fe3578f256  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/migration-inventory.json
00635a0a17a2fa85e3c0bcc9b8e22ea46e15433b7eb828b5d627cfb400335fd2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/rls/seed-map.json
9d6eec40f2701fcb2cb4521336ff0b75863af8a0de913e7f706e40047d80cfc0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/runner-lint.log
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-5/tsc.log
439a28bc12cc5d9b68d660cd7354a48659f96a4d287089b8eacc7e7c1d5bb4c8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/GIT_COMMANDS.md
d899217e2b7cd7b360c6022e5912d4cf996ad253e39af63812a19fc0f9159966  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/HANDOFF.md
df4491644eb8c9418de7fb5aca90b1609712ae38bf6db485c1fdb7baef5e1cf1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PLAN.md
ea89edb0693b140d7b6ceb85df9ddcbee7e3bb8abaabbfc2c368ebac30dfd240  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PRESERVATION.json
37d57ba130872cd6db5ac9ddd03bab07b534c8830caca2b273ba885c159c6b4b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/PROTECTED_BEFORE.json
2288fd84e6eb729c3e1ef50f78c18683afec1b5cb01af336ec0918fc51cbfea4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/RESULT.json
9ef6be052138c4edd82ec4a99d64a52f92821446e0e822d4ac57721d37143ca8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/REVIEW_FILES.json
c3fd1779f3e6a83abcaeca592256aa251e2dd4c252e9b40731f8942d0e04dda0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES.json
7691efb07f0887888119cb77d35feb454068fb895a916d58bb3fda5a7393cb99  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/SOURCE_HASHES_BEFORE_STAGE6.json
09f1c2cbe19041fc73289c762b6ceb6de47aec3c5c225e57a1b8349df8cc7168  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/ZIP_RECEIPT.json
e253d390e463af6ab58935b3a7b0ad13ac933ec603734bc77e48bf007c5a8d86  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/authenticated-reads.json
51b76e8a02f4ae6dba9f2302f5d4002c5164116aa75e8989f44fb39de47afee6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/baseline-tests.log
3030d1a65a9231c091d0aebe8681d0b9442995cb97a13f6e0a5728f83512d7c8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-check.mjs
4fee25d720c3d4772c2cd9e4974d2fd3142bd50468782c1e3a1b01a719b9fd73  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filter-results.json
2254f6407777c5d5e6d683517b22d4c343ad7495a78b118c2d765eca8d89dffd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-filters.mjs
a702338997fd82de5a8b40c657c3067d1d3c748b52f9654955413595e6eec179  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results-first-pass.json
c918750987b0b67ffc08dbff5d2d3cb78492cbc8af0a9570cdeac4c04160c02c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/browser-results.json
d403d22e5b8c039f7b3d74ec8aacf880fa66f7d92bdd6d5daf5fe7cc773faf2e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/build.log
cf4b4ba5d74990a9d6afaa1a463d6ff191d398ec8512f91074adaf819a418744  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/catalog.json
b065071733e19ac45825a10afb5d1dd62b7037f83126889fc8b836274fdafb85  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-lint.log
128632a3bc447efd71180aaaf3715b769259ebd44de2b2e9c5f4fcef97a9dfaf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-tests.log
5f3e212520f06475ebda4a700890207c201b876ddaf73322d8f7976acfda48d9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/first-typecheck.log
e6030c6cec004c9bdb8a833b3469e9eb3651dbc47b25ee0c50d4271bfefd3481  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/lint.log
b7fa84eef8af033f495922a83852c7431d34e620ff6b03d338866010092af778  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/local-server.log
6519e596a2c8fa186c58e6b95b55c8ab96abc9c3509beb191fecca165afeafa4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/owner-proof.json
63bbc35ecc430be51ec70bc4bc52c3a862c659449e77f5274afe71732b48ed1e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/run-scratch-app.mjs
9ebe44f8376f357345f57b79ef4975a53ef147978cbea6703508f89ca72228c7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-before-browser.json
9ebe44f8376f357345f57b79ef4975a53ef147978cbea6703508f89ca72228c7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/seed-verify.json
9c647c53bdfe575a057d1c63a5f91cca3ed5f808c493899b063d167e33ef1afe  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/tests.log
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/typecheck.log
6af2eccb14e2204de64d9e38aa342895bd82db1932dddf10b20f0a2c8d357558  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/BOARD_RESULTS.json
63ff90f8485364ae9add66dad46845bc1471e1baadf61b29e683d67258e09ed0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/PRE_AMENDMENT_SOURCE_HASHES.json
44a5c075f270639316ab7d84a6edd3b430032c9b4b5e67e42adfe7e30a650b57  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/REVIEW.md
fde95adaccef160760aca5cc697783fd7a2b276651159e29677fedd4b257c012  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TESTS_BEFORE.json
4023f5aeb9408c3b3654dbc8515c339fbccb9f3f5cfdd7d6c00abdab2acf16bb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/TEST_CORRECTION.diff
a9d6b77846721cd48ba85daf0fff45e493d5db856edec1aa7648c4659dac7dfd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/build.log
869ec864807944a552d7430699425dec722e36bff6d02becf34facfa16e680c1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest-results.json
faacd0800f91303de70df1d018b8b17e930634ddeaac3918fddea1e14019b39c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/jest.log
b3cd7fdaeb40889813b2e1d8790818adde335934df9925b254cf6311bf664373  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/lint.log
e0dc5e0630ba4d1740c8e9f465ee16db3ae5bce204f84c6a8c8a1993bb1eb6a6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/BOARD_RESULTS.json
074db3a87ce58bf4decafccfbdba19f4958079b294cd32ef608f9975eefe41ef  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/DISCLOSURE_RUN.json
fd8c398ee60580b7ad2d8e8513e1c8a42baa3596d6f2a83ae9520e0ca65618b6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/PENDING_FILE_HASHES.json
e9f3fa7c072c52ae8501761578a8f8ecfe0414937ce3d1dd9f29362adc474cc6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/REVIEW.md
ade641496a08ee7c75f969310d0002c878504b10f0ae343698eec616dc553baf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/SOURCE_HASHES.json
7b032c7d76d565ec803c82db637bf289efa3eb921daf0f02ebbe2e89a49a1399  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/build.log
69ca59698be699d41683cf1835f640afbc48c81c8cbb159fb861a161c0cde179  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure-results.json
6936efc134010f2bf0d016e4ecdd3c6da80cbb24a0b9b367472c3e4d63ef1848  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/disclosure.log
b26c6920ec66ee5c3217a20d018015a16dfc21053ca7b28bafecc8e74782d2c6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest-results.json
814481f719b151bcb957c4dbc8c1ed89e3d929bae0e1677b23b1385eb93d7bdf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/jest.log
b3cd7fdaeb40889813b2e1d8790818adde335934df9925b254cf6311bf664373  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/lint.log
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/recheck/tsc.log
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/test-amendment-A02/tsc.log
d0773f24b47d43929ed4c658cf9defbab8a9f27747b60b4bae31317966afbd23  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2_AMENDMENT/VALIDATION.json
4cffa854cd4d92ce77cad04e488de9d7bc31efe709e0959e54cce9bd5f03d1f6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/README.md
109d7c6bab7c0f58e82823d836f328b1433328d7e901770d7c65b71820fd5e8e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/RUN_CONTEXT.json
dc71aa8874e0cff869b27dbde3db7911f367ced6ed00329f08482ecedd6f5592  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-reads.json
9964e5f240b3fee1d5f9d429844b31540ae906364917007e7ccd513e50ed5495  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/authenticated-verifier-1794039202981.log
ec7b0823b8e040ef8717f3a6f90e5654e604f4d77598c2c96f6f69b52525899b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/catalog.json
cf51bba5a52e7641559a5a9fc8fee8ab2749d6990ca2e49ff18e30b2028adabd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-bootstrap-1794038740339.json
802d4df690ec123d308fe5d5959d809f1c23253a520461ddb9bf319db90f1921  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-check-1794038634441.json
c846c737247094e91ee48dfc7693e69ce83bcc2cc93bc6e1d22d764aeee98b17  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json
5ff877cad851aac52ee36e65ed23022b32434a7e101ca490c514c59582b17b0b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-forward-1794038881799.json
b9532a5e841ed08ea7687ed216997c8626cda41b607c652df1b81daaeba57887  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-ledger-1794038814674.json
4e6ac1c69e5d47e6455f53fc1c6ac6e6e7c40baaa372d9b619503ac22165ccdf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-prepare-1794038674081.json
30f0492b2736970ed133d3c44bc12b356a1caa868020ffd5a5a96c8a38942f99  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-probes-1794039228065.json
3c65e5c466b8540e50742ae09677b32b077c346dc0d174072936d01d0eb2fa3e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-seed-1794039042941.json
7f9d77db85bde0c06d031cbbe4e23ab77b51b128eab31728a024297e1340f901  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038759131.json
8858bad829795f0de0be1b407cf1e668d4c1b97178cb11046e4a8a4f691ce93b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0047-1794038832790.json
234d4ad828feffcd598a4e89c518f33e7700a6cf6082605b63e199db7ff8d258  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-0052-1794038900225.json
f1036e112717497a9e7a82fc50923bc5724d6fd50d504c55fe341635d4109fab  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-verify-seed-1794039080883.json
04ea7138bfb805204fc7cfc75659a0920a8c4152e31e8925b89c6a2e470635ad  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-1794038865309.log
edc8cbfde436c1ecfe164e0d9981c77c4cd5da4f83f4856681439c5831c54ed9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-apply-1794038865020.json
5984f4fef9a6350d4cf41dadacdefc5deb5cbf08a95fc13bb3a34dc3b1d97c1a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/forward-init-ledger-1794038797991.json
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/init-ledger-1794038798263.log
2662094fcb6f57bbd2cb61ad2ec2fc720784a00fc8b557a15256ea594b9f9885  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-1794039128076.log
769c6a5338651526d541645c9f4403a414976996f9ff82ed241dc18f4743ccbf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/owner-proof.json
30047de1ff1ae30f31bd88c5ee9ffaa6bc0f4b38fa22f66de756be12feab4c88  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-1794039010338.log
31fbc429dd130a1b35727834bba7d1fa52e95e2b46990269efb7abbb5e367434  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-map.json
3fb0675368a24e1397e367b0be52ecb0bebd7b073e9758d77ec2f28bd85aef22  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-receipt-1794039010043.json
db2f8931f368d120a89e4e3bc45b0c0aabd160ae99f2b68b49bbe8b578a640ee  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039018815.log
db2f8931f368d120a89e4e3bc45b0c0aabd160ae99f2b68b49bbe8b578a640ee  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039056229.log
db2f8931f368d120a89e4e3bc45b0c0aabd160ae99f2b68b49bbe8b578a640ee  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039118150.log
db2f8931f368d120a89e4e3bc45b0c0aabd160ae99f2b68b49bbe8b578a640ee  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify-1794039263167.log
b850dc02c83ef53744dfec1477e51113d6452d929e80f0140dc2fa31456e60ea  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/seed-verify.json
716b8e2312cc3551dd725a89e699eec17e1367ea8748f27f2f9673f3bbdffef4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json
2166c5d8af939ca5e14365d529b41b1d119fa96343a8d1e4837700a007db51c9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/DEV_AUTH_FK_DEPENDENCIES.json
ceffecfb9f684a71573c84126f7e3b24d503bfd9541f75bbc546cbe0b57ef549  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/EXECUTED_RUNNER.json
390e03b1ae34b35b472be1bb183a0f8150fbb4a21637b51752ba2ec08c1c8139  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/HANDOFF.md
429d2ee09bc7a8c5f5475fcf92f631fb4feb3ff635d6e5247ccb19052812eb07  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/INDEX_DEPENDENCY_REVIEW.json
78f2e60015a0bea00787dc602aa32e2fd0566990f006d6821a38a7ec5fc8cfdd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/LOCAL_FINAL_CHECKS.json
53e1919b1bad47c4fab97800024555164acc12eb2e1e805270caa465d404f138  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/POSTFLIGHT.json
552fad0f701197536331c5b7f594dd60b8584bedf8e4670592a7d10a63ad97bb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/PREFLIGHT.json
5c857d9091ec78e6096a95424c1080734f7e241bacae6f2b63023da8e9bba657  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/RESULT.json
ece88c8485cd9fc788b4ab9646ba3a425bdffc6f6d36eea1555d4380116ad434  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/REVIEW_HASHES.json
e7cf5cff9f4cc8d2cffd197c81c80787e6cb70f5b6b2c7596d085897063f901c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/SCRATCH_APPLICATION_BOOTSTRAP.sql
3a761f205e83ce41540448a5da0e60538bf8669202a91cea997d01dea1279880  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/acl-controls.mjs
e253d390e463af6ab58935b3a7b0ad13ac933ec603734bc77e48bf007c5a8d86  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-reads.json
0365c48d940f29397c209c28e649eef130d94e598b695b758a4f1edab612463c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/authenticated-verifier.log
abf793ab5286a654dd03600c68401ba2678d664de8fae32625797e2ca49d5c4e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/baseline-0047.json
ee42a67ff640fc9c48cdf5754ae62ec4ae22074724e472a195a8787ce4823df1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/catalog.json
348fe8032553f49c88ac8588bd3f164a0e863394fa3a0e12fcfebcc9ba1eadfa  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/check-dev-auth-indexes.mjs
bbaa552e4ec5af1bef1f082c1cacc1c23bd17d73875bb4113c91ac8358e63ca2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/complete-0052.json
188a08a0efe7fd3341137302daa9e33a778b7714fa8b6b507271070b464357ea  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-after-catalog.json
2096e9f6ec297a6742c0acd2bb1cc1ec1fbe85307dd83160910cd4eddcb9db36  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-after.json
b37cb5c8c71ec2833522ab3a5cc0c1eec828aae4a3e83f8511c7d9d1495e1c8a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-auth-indexes-before.json
188a08a0efe7fd3341137302daa9e33a778b7714fa8b6b507271070b464357ea  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/dev-before-catalog.json
04ea7138bfb805204fc7cfc75659a0920a8c4152e31e8925b89c6a2e470635ad  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-0048-0052.log
fd087ae35ad44e627102e36b5e9b0d54c1fc546f1b5ba395045bcbb16982bfa4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-apply-1793977302069.json
027a5acfb4fcd10a7a48146089c3457d98a4d7d010859e43e5340bcef19acd7d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/forward-init-ledger-1793977296844.json
98cba2f8021add55711dbb05ff3641b7a1ef991eded3a7001cf5c23fe5323fe4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/index-guard-test.mjs
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/init-ledger.log
3d5d405312ee4404c6af86d42567583e116ecfe296bcae6c345ce47159f46cf2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/inspect.mjs
6519e596a2c8fa186c58e6b95b55c8ab96abc9c3509beb191fecca165afeafa4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner-proof.json
d41344d055d15af916cfd5ad882ff294454ac7c43797b266fb6b69c172c672ad  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/owner.log
13531c33451027a7a8ff69b5e81383610d6cbb06144b5050a61698bb2ac196ed  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/postflight.mjs
defb9f62b48b46444600907fb4a9d03a57b9173850b1e79f2bfc350fb3ef85b3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-probes.json
defb9f62b48b46444600907fb4a9d03a57b9173850b1e79f2bfc350fb3ef85b3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/preservation-after-seed.json
12897d1a3acad46df9729d6863a4ae4af292160930c4d3772c832b975200781e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/rehearse.mjs
d2ded26f8a2cc6a7274ec38a017ae62aa049ba52c717cdfa103338c61d247d20  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/remove-prior-synthetic-cast.log
bbaa552e4ec5af1bef1f082c1cacc1c23bd17d73875bb4113c91ac8358e63ca2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-after-catalog.json
bbaa552e4ec5af1bef1f082c1cacc1c23bd17d73875bb4113c91ac8358e63ca2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/scratch-before-catalog.json
4bd7c506a943e5b4ee93eaaf524b435733c8ede1f81bc437080c94047b0ec8a9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-map.json
14e11de9013d1aa179311e1aceaf566f53b14102c0db18e74ef99e6871ff26db  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-receipt-1793977322480.json
1f2636fde712658f18a4211eb8cace5820a6b6b41bf9862599224dd35ba9ca7a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-reset-1793977273803.json
9ebe44f8376f357345f57b79ef4975a53ef147978cbea6703508f89ca72228c7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.json
58e750b77057a775a84cde6df8d6f561be3fb29ec551876aadad0e94c354d172  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed-verify.log
30047de1ff1ae30f31bd88c5ee9ffaa6bc0f4b38fa22f66de756be12feab4c88  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/seed.log
8f544f9ed54a154b538a857ee4fc5d0d80584c5fb87ce3259a8b6acd2e30988d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/starting-catalog.json
bfb646fe94b5d9747591707cb7b5f182289d6ee31e0741a7983e3aa81f916946  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/verify-0047.log
751762ff6643259398e80599b8ef6095e1a9078d373c115844eac28ed32a3f30  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/HANDOFF.md
ebd0adacc84c61650a73df676cad617daae97493a295f72f164e662c0c43a952  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/READINESS.json
1906843e573448d16449dc6c4f11dd055a9995d823c25c5487fcb22593e28e39  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/SOURCE_CHECK.json
ee6d08403158b1ad84ee487ea507087ff313363166a8997f27e8f09d4715c396  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-apply-resume/readiness.mjs
8443f8e4b9dbc3e15e839f0769b73476d627eabd385351e26e899415902d005e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/DEV_METADATA.json
0dba50c5151f59113570863696e017f768e308533cc035be5676af5e2e839226  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PLAN_MANIFEST.json
7d47fa12d005081a172f1bfc305880fbf4df290b39774ac7f973d9c5ca193535  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSAL.md
ccaa16a3701752a4895705e1dca5456d5eb3171b3c8750cc43001f9ff9b4b3e4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql
7797f45d0d949014d0496ecbb5677045b2c902a0961a20454bc71bce77835cc7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/REVIEW_FILES.json
41ba0ddcaae619f7fa4005f97aa7d5c598822f9815407bf3aed32353c5898bc4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/STATIC_RESULTS.json
400b66504cf64bdcf4d7f8002149a7273c983fc57472d698c57b7d2f9b01a78e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/checks.mjs
4d45673b9374e6ceba2152e7f6c6f3086fbdcb28e8e057c224dd9e453e55a614  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/static-checks.mjs
b2357571587792411e89e18aef0ae6fb0792aa0e7ab22e314e86c4a6571b81ad  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/DEV_COMMANDS.sh
d0ed4af9452492cbbb747f5c0e333f4f2fa9ade1fda383aeaf5122d4d77aa43b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/FINAL_READONLY_CHECK.json
efe8fa8ea0581fb13dfc1ff524775b6262052825cc51198c18e8acc421902344  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/HANDOFF.md
3c6dd575c7a0ec10e90953e59342716279f2a46d3fbdb4a7d7afde8b4e7ab8eb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READINESS.json
4098665ad82c85d92e90b6f3536e58cc586a48dd07b8069aa732abe6fdfc765f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/READONLY_EXECUTION.json
9a6faa2b9b8f87472554f3a5be1c66221613cbfe81a0104cffb8e8fc9728623f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_COMMANDS.sh
17c8c99da5ccfcea77a25f8dfe9245bff852307f4fc5ef52d29e7d781ef8e713  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_RESULT.json
889c907168944a2dd063e512f9069b3bb72a3b597b32164f9988bd9aa3fb4c96  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REVIEW_FILES.json
084a583eac829cdab188ae630265247cf85d3af4d54fe91d29885fb42df9ee3d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/RUNNER_TEST_RESULTS.json
32b94dedea0f2f4403fe8a953a22a766afaf3ab057db12fb3c359983995fde80  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup-tool-check.json
1842468ce0d0c40a5fa490e5a2cb28987788c9fe964c5ee678f2d6e7a01cbc30  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/backup.mjs
bfaa46e95438d391f94f4a4bd3d4b9e746c4b24b078e2b84f2ee183594934162  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958434030.json
6ca5628ce889a6c7016c940ec3fdda9c9e159dca219cddb1415642f4a048206e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-check-1793958904994.json
6b818a411e785d4f68cfc6af844827c506c5e08283f984380266b09a229d7a26  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/bootstrap-runner.mjs
63fda9a8a4d4fbef0eedde5491c92b395b80b04f472095144d69ec4a26aa9a64  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/checkpoint-receipt.mjs
755dc74e7e54d0be0562ab98198f236992d3a8972c3d0ba98c92484d43417dc6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/owner-check.mjs
2f3af3df7516410bb43e20e8641d7772c46fa7ae79761a702d9650d1980ebd72  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/rehearsal-receipt.mjs
efc54d7e5eca920e06a84a0a1428018fc637648745ca6ed4267592d794db87a2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/runner-tests.mjs
8bdb753b4d227e4211c6ee1d0cb6a6c0048071a371e456444b0a7605cb1b0a5c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/BUNDLE_INPUTS.json
d7007e0c4e9328b9fd2ac5ea7a7d781214c188a93dea7c46081abdcc34b016f5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/COMMITTED_RELEASE_CHECK_308247a.json
544d8416a6e38f56673d41e7d4f76ee03d9739aae8e57ab8ec5304e12f2e3462  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/CONNECTION_SIGNUP.json
9878f348a8e28d685711f843e516572e8324ed24a6c99e4833db9cb4e8b0e609  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_APPLICATION_BOOTSTRAP.sql
6ac3df26d8c9dbe700b46d130b87c1be2d8c916c60108686d8d2304c09476d0d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/DEV_SIGNUP_CHECKPOINT.json
b31c97391c4c9a585a9e07b90fda288212c6e2c9f72731ac16693a4caab9397d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_47.json
7df801807ef3ccd980b44f079cd2c47c4371345ce4804815d181bd2308a356a0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_51.json
1547d32289339cd8632a8e0f0e977ba3410c7129df65fb3aafb48398bbf7f8ab  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/EXPECTED_52.json
5727f4c7ff48e2980bc62b23ae22008119cc95d3c149ea5ba157649298071ae8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_INPUT_PATHS.txt
7a66c0add4772865fcb0066a1dd5145c9188b6d5307fdc8b67345bd390f0a519  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_RELEASE_COMMANDS.md
a98f562d7e6afdc64558b8e615fd3a9f39426a3c01f9a186e83f56009819f422  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/HANDOFF.md
273e19265e19d17af7175314b04da1b33c06730fcd32eff56a0f05d2cf2a507c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/LOCK_PRIVILEGES.json
1deaa3a43f483ec7522c959a19d26ed1f22b63fedc307184a85a472b487496a0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/READY_308247a.json
2e8f6fb32c62fc64f6dde442fbaa08e0b642e5f1210e93202c4fdb8d7d51686b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh
35c629bbdd9271012042695b86b576f7e358088f1dc4ee4beb93e50b6ad37496  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_PATHS.txt
1530ad0d08680a537ee27950114bfa3f1984bb9ffe82b00c2a483e22a3adc158  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RELEASE_SHA256.json
fb93e38b48063e5276c4896078cee92c1d1b8baeaad372224a2b21121a4ceb91  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/REVIEW_SHA256.json
807d42cba79ca54c4d7a23dcc7fc17c9631d2125e893558980bd1a84f5a1bd26  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RULING.md
dad6d3b85885c3217aa04906fc1a9b0c6020f25f6e123d197f0d7988da1136ba  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RUN_DEV_APPLY.sh
ddeec65a945aeb6da4ec5e34c598b9fbbd1b404e5bc5561db2038af62aba4341  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/SCOPE_CHECK.json
472d762167de49b269378fff433fe2a6448d4330f12af0f5ee51ee3ca8735f14  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/TEST_RESULTS.json
a30bb4334301ea1edc83dae736070470c7d3fdae73b3b7e711463ce0a169f6ac  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/VALIDATION.json
f2da2f728c475edc05f602c6df1574e2f8c748e362be98f4379d165b175f359d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/build-manifest.mjs
b928fe3515528ea2cf37d7341bf320be103c3e91344cec7b79075ef73a953aa5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/common.mjs
ec02f45f712ea11d237f6ef8bb01bab412ac372dbf72b81073d0780c00f6c5d1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793979737752.json
07241cf23715821e07c7d4b17db6ca03f71a135fcbf8896f9da292e069be7dce  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980107801.json
a4a5b0e2ed8fa18a2b69692f1c86edf00027ebb13b8255df178ed5b41099118b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1793980439376.json
1445730971eeffa6fbc13de1535778d4a297c374cd583d13f09ccdc13929f46e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794037368529.json
af9ba95edffcd601f77a05c0e4015dae20227551cb5e374ad421e50841644e07  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/dev-v2-check-1794038449141.json
016a3320550d073e24df8442ff4845e2f5886a10aa63699e686cde81687f25ce  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/executor.mjs
d4ba2281954a77b01d7bd044f64feb6fc88db314ff74737312313557d6f9d2fb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/prepare-release-scope.mjs
a9a73e8e85e06b9c835c96759a6828614a847ba6113be4cba3dc92c8b48147a5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/tests.mjs
20f010ae82f2a05ddd440a07b22a6c8607eed3b608774c4b7ff297787d55651b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/BUILD.json
baeba8adb60a127e3e8de59a1e6360ee610d512897e1fcf5a48bf9a7885354b2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/RUNTIME.json
1a2531944f2fa28c3e97ad7cd63aecb00792fecb0a89e82c24512dc14cffdd74  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/SMOKE.md
39beab10ef01c922ab5274a4c2742ecf214dc2809cc9541d1e55b5da16f27982  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/build.log
05b540c510ff9cbc78c644bfbb41326e0ece71378e6546cccf52beb93cb575c5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/launch.mjs
1a4d0c512929b4934c4f1d9d581c9e7b2dee52215397e00d1b3b42079c0bef78  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/CLONE_SAFETY_HANDOFF.md
c232f252774cf78a35c457e74d339cc20b486a2a68282e469f923080e53b4427  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_CHECK.json
77a178f538dcad8169fd7342fe0b727dad19e625072de7c89f737434123e170f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/OUTBOUND_FOLLOWUP.json
d50cacaa29305482db91167fe4907480a6252f168417a05fced3f71f77e90e6b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/PASS_20261106T130308Z.json
46a13e6e489a4ec74be712b78aa5825b10cb2c17399f77b9ed4df36e35275829  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RECOVERY_COVERAGE.json
0f1510b8e814805099be149d3f6570678b1394c5e81602b94563d785244b7931  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/REPORT.md
303989121bf5e4314020bf6d05d981caabef13ee8952bfdbfa027f16b72e4bf8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/RESULT.json
20cded008f4627951ca7c65e9fa49d4f9c998f43d8b2f04f51afd22eb6113fa0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/compare.mjs
1061a79b0524ff29999100740ab7db4774e5c3a1db605220f99ce45feca2c5ab  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-post-restore/outbound-check.mjs
716b8e2312cc3551dd725a89e699eec17e1367ea8748f27f2f9673f3bbdffef4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/ACL_EXCEPTION_TEST_RESULTS.json
b2ddadec5f0e77a997adfd55a42d4fb49019747bdd759f6fd21389671ba5dbef  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_DIFFERENCES.json
10c1c4bcb2698717a76a331c8a7a719fd25f74935694740c344d56698b0f8384  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_INDEX_RESTORE_PRIVILEGE.json
8abe88ef7f7bf13dbfcd775ae3804fb76821f88b3489c4d1fe1a271814afcd12  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_MANAGED_OBJECT_PARITY.json
f8060219cd6b1774ec40a54358b940e26d7bf1ad85e869cfd87906796cef7f2b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/AUTH_RESTORE_COMPATIBILITY.json
00dbe277502b44df413aa8bfd39ebfe9ebd4f4188fbb1b57d4a367c124a78f9f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/BACKUP_EXECUTION.json
5d5f52af7e906300e90e562cabc78ce77c2258a427e145264aebae415650906d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CLONE_REVIEW.md
c6cbeca61e8df1825fde281b1606f3b2ad95b2bd757b3f8ef38842bae0e57f4d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/CONFIG_CHECK.json
70bb6595e07ab73131c0bf0254a7037c886fbed19bd9a90512bd2d7433645ded  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/DEV_API_KEYS_CHECK.json
16de82b4cce490d61096ea019e055d189dfab8fd1ef620dba4e65302fb27589f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/HANDOFF.md
b814f65c8c941c5fbe931569776f734ebc44570a3dda40170e43fc0ce4db1c18  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_CAPABILITIES.json
fb4c46b4dc98b3c374c091de6fa8e253ee4389958958adf0dd429add200747f1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/RESTORE_PLAN_METADATA.json
14cf07919c29c0249130e8dfb91790d59a53291baa56dc772cf3ef6e806c0269  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/REVIEW_FILES.json
67886fdfb87b11c6170f76792e71be4d63802b6c50ede223641a14dab21e7abf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SCRATCH_AUTH_INDEX_PREREQUISITE.sql
4c62fb9e9d7b1c164543971264df03499359ebf6fd80f11a54cdef280309e8cc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/SNAPSHOT_BACKUP.json
0d753a10236a72d050897a14282e4cce198776d91133d6d83482e03abb6b3caf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/VERDICT.json
655fdf18a2667876c2978501f1845cd9561281390061b75692e80c16e433da65  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception-tests.mjs
4f2e5bd99020699a565842999a50226a933084e18aa86d86204df5b2d785d791  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/acl-exception.mjs
fb89706cabc5f5f9ebcc87f0f54c07f3a99988c601957031a7efd88c941d9d67  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-archive-component.json
b5aa8359dc9e139f2e0a217a16a9572c2702470ba8d5abbb4ee1d36b3840f0e2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/backup-tool-check.json
ee95492dc2b118c75390cc07492c16fd826a34d9669408464fee47e556685915  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-restored-rehearsal/snapshot-backup.mjs
26a75e2945ab069ce50c5e30d92d6089c086282cc4a2c115334bdf55189d8aa8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/LOCAL_CHANGES.json
e0dabeef0ec8d4bd7901907060f162b2642e3844ce28720356a73af05332e83d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/REPORT.md
e4a248789af2a72f05750e33303987e2a096027b8d1e5d8a8a7393917ed8a72c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/baseline-diff.json
fb6c3b27f6c5427148420ba3c0773406483fd1c5910a2df1294af21c7e94b445  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/catalog.json
06f00aae5ace8a747d8d90b01a3eb341dec9e72f1be9eb48dc0e5dbb893539a7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-results.json
90852ca576bf391f7a2687869756e19291eec473deca808c93985ccddaf04931  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-test.mjs
2ec3c02d0b93991f998c7fdd871ea94884f6d7fdb888ba50b02df574f9987211  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/fencing-results.json
aa63214a1f735673a398532aee1e69ba76b728d964163b6ffb26ae5aee015aa6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/preflight.json
ce0068db30f213d465454da66437f3238660f55579b3f39f130e0cfb5beb4417  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/read-only-preflight.mjs
00d085cc94aa7788fcdea9571c1421987bec0dd4cbfb5feb51a2832fd376eca5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/FOLLOW_UPS.md
80ce92dd7290d10f69e2640d89c4fa28b02b496aa4d4c6366aa48c4ff165d910  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/MISSING_INPUTS.md
2242c7babfb6f1bf75cb7fa6a1056c10c1cac3c2945d80adc545d5b8e9b4760e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/PROVENANCE.md
8fdb22e506c725c9e99b991ec6d6388fd1aa53f35e6a90f268437e35484c1600  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AC_EVIDENCE_MATRIX.md
cf3ddf4e725b6091ec70a28468e272143a630ae50000c07cee532fc93e89a459  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AGENTS.md
7f00803edf13767e30388cc6499e4821c9d01326b6754137bc2c5ddce08c57d3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/README.md
fa9747af92ec08d7268ad78eb36b8a405889cc70c9719d30e81662643b83106b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/build-package.mjs
de13681be13d54add8e0c91a486feef6981ca253fc066fd8d561cfef92a086fd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/cast-matrix.mjs
b4f037553d4e0d31686965778e8cdc4a35d45610f06d726c15d40269af1410e0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/check-qa-env.sh
5d0b269cded3eff8e716ab365f0ee6a2ca15ca2cadb9da4a5a0cd934d0d744e2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/debug-pbm-options.mjs
d36e989efc945c901eca50df6ea83896d1633dc4192952f9a8fa57cb06cf2d05  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/derive-q4.mjs
15092fdbde0aaff139a9bc11f087cf9a4e21e85f5df9e3dae80c61f97942abaf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/derive.mjs
7cef6cfd6078b8e89bed841a74ab625e46ae6265e8c1d356095aebb14bbab185  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/dev-apply-check.mjs
b5182bd105984fea7a07648ce6a6144e40cd053b2aae269f5928a6cde9d951b8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/inventory.mjs
cb55bee1a617302fa7b8b581a1c4342d5575032550986962008dd49a1cc920ed  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/launch-dev-real.mjs
1cd40b6a7c08f56f6052e5750638cfff11bf5f01f2c18fe844d7a86e206a56f1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/make-qa-env.mjs
cf0bfa41e118626f4bdb8ae7980ff235f31ce8dfb5fc39111e17a9e63992ddf8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/money-rules.mjs
7c789c9269ff96f8505955205274455ca500973f182fe38677156eac1c8e0b0d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/privacy-scan.mjs
2bf253d0f8115e1ee23df75799f911112b0f643e59e21d0209f0f155007d42f2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/q4-matrix.mjs
2cbca53305e791bffe5bdc02225a7cea09841297f948a117f2b7208029aafcdb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-env.mjs
9ebdd223db339088aacae00c039b5a5fe0b57d221b5bd5c8f1a682c9884fb3ce  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/qa-shim.mjs
51a1dc1785983f0bb68c150d55db58676ed67e30a1c1a675d07508680142d473  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/ro-sql.sh
d70567a355f4329b5ab7c7571087423d50a927771ff5e34873ac0eb282bfbb9d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/role-matrix.mjs
d72f6b4a9661f066bf418591aeb8aaf2a8fdb2ce5c15284078e052a3db810b86  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/scratch-sql.mjs
9b1347890f3f0845163cf31e828734977204537a26fd4c0ac2a5d22c89ffa0a0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/seed-hash.mjs
503fbdd89343c689e067633af830624bdc0611597545d8cad7f046676064ebd7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t04-allowlist.mjs
fdd28e09588b689aede292690c5c5d070388f2337e2da78efd937795092e0d5d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t11_catalog.sql
88a22e8721ed0c55716fd570b307111422a21306ae45fb98ac1c07b200d130a3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/t21-trigger.mjs
105462fe92a726fe3af26b02317e5befeb1ed591f782c84fbb2e76a74470ba3d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/CLAUDE.md
3044430b4ed63b060c6f0fae63f057d8efa05a9a71cb8f3e6a92b596bcf6e377  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/FINDINGS.md
b4695114af8047ae79b1c3777deaf237f31ed631e9738ecce72a1117c8b041d1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/GOVERNING/README.md
845de226ce1c3e8a608fa4a0649c3c4aa11c12b1eb09513b8ba66b3ed50770a9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip
f26f407f7d1a641f890720fbf67adb100cb90ad67ea0408396ca0cf9c9473ed9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1b_REVIEW_01.zip
a266c5010b0775205bc88ebf6c670eafd4c9829520bf06ed7ad1d8ac594440f2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip
0b89e6c9dc932d270d8db82f7915bba6e2b856e0a8719984326deb136eb8cd41  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q4_REVIEW_01.zip
b56c2a0ccc5141b181f170082cdd7fa798232db95a1414922f98be318e1217da  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/ENGINEERING_HANDOFF.md
75d0f353228dd6871427864bfeabf0d08e15bb27aa6f64a2f89d429e1c3f1550  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX.template.json
dda6dfa8c59b268421560ff2db27ddd235a67e7c17a2aaf84232f198e2e58211  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1_01.json
80e3a89291a8b5942cd12ceb6a9ae41f37fbe2ce7873defe11fe4cbd88a6b784  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q1b_01.json
afee4ea57311ebc8bead8ed6fc5d608df74d6b1a03a08d04290240c9455738f8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q2_01.json
9ec2c71513f3df4f842ed612ae3a8b3fe77ea7133dfe495eeea0a3c33158585a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/FILE_INDEX_Q4_01.json
29b1c7c7a631630b462dc5a985e7ee82bb8c172fe02f0cfaefe77619cfaa2c5d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q1b_AM-7_DRAFT.md
df2d84be4d3411bb4e11b0a2b0cccc9f4aed783308fc77362d00fbf9c66f1fb3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q2_ADJUDICATION_01.md
0881d002a1b643176319d46adcbd3cc837b7de009606c091d722ead04c090013  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/Q4_RELEASE_RECORDS_2026-11-09.md
f47ef9f7a7fd531a2ca8fe86b15c8abd35f45bf7bb20d205492b3aa74dc4e452  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/QA_HANDOFF.md
6275bdfe038c28ed04bdaa3bf74dbdef44d70269cce3f45d0525226c3a8a00f9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/README.md
7e50c1211ae7052c17842a4a6ff7a2634205d6dee2cc1961f5326e849f257b9d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/RELEASE_PASTE_2026-11-09.md
d55406c3ea1a719cd52f29a38ccc658ec6fcf6a1e3b19e1d389b88c611bf1d4e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE.md
ed354fc8d0a28e65e1b070a046edc6ce27d4b3130e835851da7605c1961fd455  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1_01.md
479f704201afd963476e9ef0a83d23797ed2e63ce9dc27474594685ab717dc1e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q1b_01.md
1bac8bc0fc36e7719f32865c9987824391a8e8b943c13b22406a9ea3f431875d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q2_01.md
c1e6fa0807ad0d6566b68a2728b1ee19e61d9a5f908e07d840bb2e1667dafc45  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/REVIEW_START_HERE_Q4_01.md
3db9ad1ff598d5688339c1da960051d973abde2b1638caf1e4f4d69beba42d9e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/PARENT_ENTRY_ROUTING.md
dfa3a1db4087cf56dd95ad730c5597e522694a506aec7e4cb58890620c862aa7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_APPROVAL.md
e7867554afc4a3f242ab09f02b048bd025d3cecb9c5e1ec79fd2e9103b588f37  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CERTIFICATION.md
c6c87cdd3a83a735f2a04653ad9aa549f73e0532c1fe1e180891125296994064  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_CLEANUP_REPORT.md
41e2ba057f0d3749c11e018f28c3eb3684c2745d790645d7919f1d00ea45638b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_ENTRY.md
8771a0b205b0eed1b5ac6104195619c1ebcafa3c0daadd59a603614b81c3ec9f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md
033c5d96a99ecbd2510caeea5188e97f8010f8926f131cd557bdd2ccfd54df41  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_MANIFEST.md
515be2303c57bcb1f93c2f9c241cb8b37aad45cc15453fefcec41186db2fea97  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PACKAGING.md
ff49d7a68a73e4c60a27d3471f4e867b79335a94c96102daed22aa3cea8ccdec  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
69244312f6222bcd408e7d6d156fca8059b617e61f9711b9d08703bf8e2bf0cf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RECON_REPORT.md
45db80881ee01cb0e3da01fc76e2c3baaa6a53c872daebf14e611c7b2faeea92  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md
f131361618db0bd488984d204a93c28f1d2b6ed2e834e9bf417c1bade70f9172  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_STATE.md
194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md
8c56f596d3b6d404283bfc87ab68705aa4a8ac6018f17ffb65242dd64222a355  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/INVENTORY.md
376a69dc29d18694e4d628904c8d32c8c136ff65b99094e3f5ae09c349da07d3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/README.md
62dc670f6ca129af92b4fd276a8c6f79e3ff29cc017f6ce8565f1202a0ee5fc2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/admin/01/no_mutation.json
a105f974a79eee513ef845544d99b4e1d4065d92ca01361f0743a0a5cad3a321  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/admin/02/no_mutation.json
6c1e69fc99656b02847251e75bb0381c862fcf8e591c9440e03f27084aba36f7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/dev_catalog_projection.json
cffcda8624aa41b68629f833a08b6a572c5d115194fd5a51b44357dce05c36bf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/handle_new_user_dev.sql
ad8154ff9b3d11c7f37db1f9c09bffa3f7b3ff5a47dd5e0c9ca6124121bec0f0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/projection_diff_policies.txt
e0b8057b562dffca1f601607d94ddfc7a24fbc048d08a97a05ae6020e612e386  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings.json
444a017ac8b10e3c0b8d8f54563a93c14acd7d10ab8d59f9bcf27ed688b61f49  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/signup_settings_raw.json
8d5c70157637ebc6d5d3827a658d52eacc38fa43cf542cf1a30e1bec28b1f5d5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_results.json
2710dd00a6d6aa6c15539daf836c06b9ef704174741b8cbb87e596f957aeb5d8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/apply/01/t30_t31_run.log
4270b0d6b8ffa212f2e008355da82a96db4bb87eb7ce95d4426d86e2ac5612d2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/admin_rpcs.json
0d939f0460f27fb46f1374bfdf763162e7ca23ca94b4e03e3bfe4f62a0facdc6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix.log
31517281b9e210f23a718fc71def75a9c0fa937a375af346e89afd3cd56fa408  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/cast_matrix_attack_flip.log
a335af4582cda15550db2f050f381154a4acdaa2fde854717c351dc20e9bde53  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/dev_operation_counts.json
d6a3706ef4a0acb7beaf230f020cd9b9ea835c24685bffc11b69b2203fa7c2cc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials.json
0fac843d0b439f7bdb0efb90e25476e3f8eb7fafac1e998e209df57e62a1b53a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/direct_denials_attack_flip.json
b2c4417ff85a1f2ad62df2f64743335b07ac4837f942d34c71e8e6f68698d1e6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/operation_counts.json
bee6c3091a2738b35b19e2992fe012e60b897a474b7ca8a9566386a3e08b9e9e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/owner_reach.json
6cca366644d6f0c12531b87e4df6194e45479748239c19b298515657e3c9c0d1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/seed_audit.json
5178bcf5259869917e90449a36d5801ddc3f2564c5e7193a4a67ae921571deec  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_reset1.json
c3f878032da90af4a522fe6b89265675a03d4cee42774674d6b3865fef80ba90  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run1.json
674499527c68f531be64847e3fd46902b62000a0b7a82a7242ff4f157caae936  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_after_run2.json
6840e83497718ba5b0dcd59d2e9f8cf4fc83d68f8c89ec16e411872d884442b8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_before_run1.json
fdeb35968113a5390e6b045bf1ea16cba886eca3d81f2a14e889d40d29d5f4fd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_grep.txt
0a190c266e3b54db9f4bf381adefd69874ba6024ef171cd55f586206a58c4261  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/01/t16_intact.json
d9ac617e25983b5e89e9858ab8ca8c446d19725425cdfac40978a4294b3b5d3f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/audit/02/dev_effects_q4.txt
d3a0fa0dbc3d673a89a1d3af0e728ef2de89f8a9613a51b8751b9767e4b14d69  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/build.log
f577c99c5c89f9a3bc6cae427d8f36d72bf77ae489739176f3fd2d725e63f241  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/chain_status.txt
241d3153e098b15219b1541e2d6005e54ecd4ca256438c8a442c088479573f5c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/ci.log
197a090d9f35d50d3dbed2f5f0ac93c44efcbbf43595554caea616098af4fc0d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest-results.json
4f6a253e42d378c689910a15b1aced665320d3be7f9c44338404698c0900d8cc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/jest.log
1f7632807f6217e5f2d56ac83504e0a05db489fa35219e07a72a867a779d40ee  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/lint.log
9425e368ae12c6647342e13f57bb13df734dcc087b65f7e19a781e14d46ba95f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/negative_controls.txt
19eaf43821a7660ec323a87c8457bf74823beb296c39f5e01aa8a683aa50f061  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/01/tsc.log
f1bb49150c3a35a7613718026a46149f4d259c87018519178b9c6b24d3c15099  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/BUILD_mock.json
42d5c8a89e2cab01f9249c78cfad3e116b74a2369f04de9ef0a61923bddb783a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/BUILD_real.json
6e4371770d8ab45ee6fa7eb21407b9ed0e0e76a34a6c34a6c4c82d367d7996d9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/build.log
5525661ea071fc780c8fea9c8c855d50d48c1386aa5d85190cef15c3e1b77900  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/build_mock.log
1394cdccb830d24241833eef5d75aab88c118e1b5589d46af1d35e420026dd6d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/ci.log
9a72a3dce8ea449eb2a19d3066984de12003b5c6091db9e156beb6c429ca29dc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/jest-results.json
11b0736c5b7222dd85cd06604d1f2d9d4e9c0ed3724e119b1b730e64f6edf9f4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/jest.log
d69195606c87b9a90773daef3ba2245df6e6cfb6ec9681a3ce46460601d029ae  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/lint.log
1db4702bc4f160516405a25deb42df39cb071867799c4e9bcc73026706847b3c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/negative_controls.txt
16e75db69019be21fe481abd11bcda1ad0d29174710ef9f80e46f4c1fcf2e6dd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/serve_mock.log
ab25ed1a39cfa463242a27608d79047a1e11b496ca4f8fbf78c26c0c59bfaa3b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/serve_real.log
e9f52c096c5d30119631dd001721b0249d74d9520303b0554c99baa7a423441e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/tree_identity.txt
cbf7de6a7ab22aa8f3b63eed31368677222a5389d4a0bcaa112a952910051cec  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/board/02/tsc.log
00fd7ca751117381b4ffe982285664b4a9bde63e8a3b90a21e8021a6a6036ab7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/auth_walk.json
00fd7ca751117381b4ffe982285664b4a9bde63e8a3b90a21e8021a6a6036ab7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk.json
28bc9837ba8086ea250a4bd4ad15516c6f25f1e08ee0c51fdbdb5360dbe18d10  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run1.log
825763bc384c45f6283a9c9ffaf5a099b52893ee25dfd85d025ec5f48505ff6d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/authwalk_run2.log
a774eda5f9b20f37d409d8e835bc33bedc6465fc1e46aca5bfeadf9491034760  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/chain2_status.txt
a335af4582cda15550db2f050f381154a4acdaa2fde854717c351dc20e9bde53  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts.json
a1f7d87e65ce31857d90b999aee15616d7c8b67701cd57e25df8b6ca45b215d0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/counts_run1.log
16ca09effe605849039a6be4ab9582ce54efc49fb403b3984c50711aadcbf201  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/debug_pbm_MEMBER_B1.json
48d6bf195dbec574e41d8c23070b4f27fbdb65290f4f5130553bbc2cc67a8680  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_MEMBER_B1_1440_light.har
41dae12e757b97fbf586c8f79b38d6365099529598e7b6acf1caa1206e41ba09  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/authwalk_OWNER3_1440_light.har
d7aeba2fd8e7570aea8e217850235f8ead6686e3c2b4f3c3b3eddf63791a3ecf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/counts_OWNER3_1440_light.har
7eac20a69982e5ebb3a8a96139e51f2564f591a8492a933697a167d781d9fd9e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B2_1440_light.har
8c6ac1b67563287449870adc82a9bff72c8127f6480f25effac1c3995de6069c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_ADMIN_B3_1440_dark.har
3e115a17aaef3e5aba6d82552df49abd76b833ba804aad97e6f5c34f39e0fdae  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B1_1440_light.har
cb83d271fb45bfe92fb3d3a7dab06931712d238ca227b0bf23d968fccfe7d498  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_MEMBER_B2B3_1440_light.har
887e07a5142553af23b6878faa8da3bb10ad2028b060a91b7da933398b0551a0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER1_1440_light.har
04230c65ffe159cbbd445e77106131a2549a625b835d2387fe99d752a2a5bc07  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_OWNER3_1440_light.har
bef50d9748b0f75e9b9e2c43506a018c82162a5e4e2d52d0939fb09884cc5dc0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/matrix_UNRELATED_1440_dark.har
9b7122d7146e246952d4d0cb736902bd74058fa444016481355dd25ab4b6944e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/nomut_OWNER3_1440_light.har
adcf141d3db7570193a580accedb80acb2acecedec23840bfc7e8438ad289dce  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/r016_OWNER3_1440_light.har
c67ba90a70de0b701dd408fa089667636b0ddba4201ec8153c7c74edf7ca38bf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/har/spoof_OWNER3_1440_light.har
15922238aadb1255cd99dfd845914b8303f128303212ae45c0f2662f70ca588b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_billing.png
3648b4d03009d1f9340adcd0634e66a3dd655b6afe490615aa5082a762c6dcb1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_invite.png
fd9751e90ab229af077622b8830da6f470489e32cbda9665c550671e89d8a5b6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_settings.png
387ba668d77e9c73bafd90d7f750c1ad8c03d06da8da8813d76b9e7647da5b89  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B2_store_detail_B2.png
ca4f9ce4154f58f96774c6c02891786d0f552f7bec1d88cb7c8f07a4f1166b10  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_billing.png
48654a1c2cc746e3f59009b771d9f46fceefea03c98e020860ad59d43f21b1e8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_invite.png
14fcaa82a802170742a50afb2b36015344f88774be68420327002e12c0492d03  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_settings.png
d7481ae6c976b2b28848221053257a7ba7d1f86ba3e09348ae2fe8121f0748dd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_ADMIN_B3_store_detail_B3.png
a3f44a0e0e70882b96dddc72501a425a57f9ec533ae5ed2f246aa1faed5369a8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_MEMBER_B1_federal_1440.png
612f5925e5a8dc551be5beddb17496a7779587ccb76b7e37b65be21c754dfa08  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_billing.png
44cb3b243b801f4593f71cb0b9a94c96be3a3dcda0adb45faf8a57906fad2328  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_invite.png
ce28380986480bd7e22e8c688bd1f57ef69065293fdce19872b4b289aac42fae  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_settings.png
95506ac67312e0dfe810dee2cbb335d1ed94ebeebb94f1aab0bd302a827087bc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER1_store_detail_A1.png
8f3e641a8ea37c0a45b569bfbedee4552c1b1959fe9a2b0a2b4b3ebaec65832e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_billing.png
237e1ed5e2920dc3221f1fdd5fab6780f51ce4052ebea85402133481915e6ce3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_federal_1440.png
ad5f9d601393859e479e298a1dc58dd06492a629779dc1c179e01cab9c6b9338  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_invite.png
7c593b3935a18aa762b9054885a78e7c4179531a25138c6449885a4828f7309e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_settings.png
96e8e48efa2c7f9257efdec91632daed464e581a19a08e4dc9fd291a771c440c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_OWNER3_store_detail_B3.png
28e34efc957d3046b57009194c6925fc5ccba02ada8ffb693d91ed3a7682e4cf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_billing.png
616ea1f8d738f46706f8c8b2a44bf333f46e0175941302850a8e312449b94b87  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_federal_1440.png
d912a572b4cb623f734559aa87a672ae07870d23de355f3eb0a2439fd9ceae77  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_invite.png
03ee35877b9c20dbd68ae8bcf9c9854b14c563c406b53ca3d933cfaee48b8070  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_settings.png
deaf47d0ff90e6bb42b38a43e0ebb7f6a33cb0a116f4c63c4c24053f953ec7ca  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/labels/matrix_UNRELATED_store_detail_C1.png
29acf11fbd694ebee89c4e5e872de603f0f5a4573b8a4aa34c31bb301b124162  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix.json
bb7f08c3afde0a2aedffbe0d19f68136813c19286077be77ab4843221c27d37f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_OWNER3_run1.log
29acf11fbd694ebee89c4e5e872de603f0f5a4573b8a4aa34c31bb301b124162  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_rerun_member_unrelated.json
fd77f36340654b0491df496af8878eca438c86d53d2b337b860646ce497649bd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2.log
9d8fce32f935a6d672969a7028c1c821fc31d5dd0dfdbf613a49bbb9e49d2776  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run2_all.json
29acf11fbd694ebee89c4e5e872de603f0f5a4573b8a4aa34c31bb301b124162  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.json
7456c6baaa06192ecee7a32f8fcbe9de3cc035884ed56a0723512e638a3f4301  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/matrix_run3_member_unrelated.log
f401cce4d56d1b000e716f92b9fc250911da1ae6914dff2580594da0ec4752dc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/audit_window_check.txt
e027556cbb3160b93a26e60e355674305891b36ae1eb76a9f11c005a6dd36d7c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har/mockmode_OWNER3_1440_light.har
c8cda3c4ec863d6aee2411d943ac442312499339beb68f4c0f0a2258454cc4fc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/har_rpc_check.json
9c45ac9cc79ba9dda5f4e3649bd5d625c0af76f045382ff98fb8a4d82ba997d6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode.json
45070e70d65194cab40ed28a8046b37fc853a887d370376a797c0ed97147d530  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/mockmode_run1.log
e63cf388f84ca75e62fe8670aa89d39008ac43984c7ae8c15b1bf2b9d2af4710  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_admin_gate.png
e63cf388f84ca75e62fe8670aa89d39008ac43984c7ae8c15b1bf2b9d2af4710  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/shots/mockmode_mock_owedbook.png
ac9dc083bcb76ceb71d4467d719679a42292fad68177bdbcaf63f2d20b5cf70f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/mock_mode/signins.json
62dc670f6ca129af92b4fd276a8c6f79e3ff29cc017f6ce8565f1202a0ee5fc2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut.json
110e9a21d0bb1889b1feec8c56d0ce3ffe717174a44f936a8545de759b525246  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/nomut_run1.log
d3495e30902a9f673679e8f924dbedac8e996dcf419edf57eec6617d1e71daaf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016.json
76989c0975be69625c43baccf3f873a78f1e1cf65e92b301ecbda79269badfb6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/r016_run1.log
0bf32620735edde69ea556cd1136862fe67c182bcd5f97ec64606ac80d60fb3f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive.json
328e0d6ede3bd413c0fd4bf4898a3e11e8a917736466c1f813a8c3ab47647845  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_1440x900_dark.png
184905e620d1922789e0478952ea200d382c19abb63b213cbcfdaad3a81bb122  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_dark.png
90ee9807875a01865745b26ba4a38ca0795754208310630642716050afaa4b7e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B1_375x812_light.png
b8f4821ff8e46c4e73453e64b358318be328b93e0de25fdc74b7cd27a459593b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_MEMBER_B2B3_375x812_light.png
50862354bbeb8d060e6adbfd076bb2b8ee05faaa545f76c9c5d75d52a8452479  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_dark.png
58d7a78190a2750fa57785e601aa0caa88c3968acd39b63b651dfcf0ec419f5d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1280x800_light.png
9789703a2152526ea54c1ad27d50cd5e30929bc023d26c9b8cdcefdb711aee44  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_dark.png
3d718a3c11b1a6eae373e6296f2ea4d36c9635bb1725a90dfcd2a7b9622f57be  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_1440x900_light.png
c236c3ab9991e270e109b6b812f72ae6c3d7be8a6f82b86e09132350e19e662a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375_drawer.png
184905e620d1922789e0478952ea200d382c19abb63b213cbcfdaad3a81bb122  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_dark.png
90ee9807875a01865745b26ba4a38ca0795754208310630642716050afaa4b7e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_375x812_light.png
ea1db7ec3bbd76503250188a700c21f6bb57f1cb2320e28944f32cc75e5d3b0e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_dark.png
f376841a25827bbf338d02c6769afa9718ad76701bd33ac68b8058d5122e9516  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_OWNER3_768x1024_light.png
afa387203901a343015e898554332ca4b1a04ded6e76d0705bac2c9b677885a7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_dark.png
53e3938768cb101c99cd746f0f7815c01fdbf580587cbb43864c31be2a72553f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive/responsive_UNRELATED_375x812_light.png
60177e8eec9d05f2341ed83225e76ec754748d2369825a22f94cd26e29a7cc37  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run1.log
0bf32620735edde69ea556cd1136862fe67c182bcd5f97ec64606ac80d60fb3f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.json
5d66117bcba73778fe006e135993c4f1ec9f4235fc9c9f52f6f7cacebd863bf4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/responsive_run2_owner3.log
080b48f2228027ff968c3c35cf20c23cc47387879e6d99532c898038ae7acb62  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1.png
f3191aad70eb142185ea07f59c10bc4ba470dfae1803b4e7f738546104b75672  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/debug_pbm_MEMBER_B1_search.png
ed6af7aaa4963f51160f7959ac0df36f5f295d7415912a9a1e07a91127824741  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_admin_stores_1440.png
0f45ae355969734af8073b34c8a272b3bf8da17e0b4a80ecedbabddd9ea56dda  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_audit.png
15922238aadb1255cd99dfd845914b8303f128303212ae45c0f2662f70ca588b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_billing.png
7ce1de410bbd3b7834065a7ff8280bf13ddde17d541e8d75c67cc3c7355f2d83  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_denied_B3.png
3648b4d03009d1f9340adcd0634e66a3dd655b6afe490615aa5082a762c6dcb1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_invite.png
fd9751e90ab229af077622b8830da6f470489e32cbda9665c550671e89d8a5b6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_settings.png
387ba668d77e9c73bafd90d7f750c1ad8c03d06da8da8813d76b9e7647da5b89  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B2_store_detail_B2.png
6613ee9ecaf8677c8587a13e3602bf5945faf70742557e639ecb0c496d3a35a2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_admin_stores_1440.png
343083b6b79308b49f7839ce1a1f78e82cf6194b3f4908df11961f4f4f69460b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_audit.png
ca4f9ce4154f58f96774c6c02891786d0f552f7bec1d88cb7c8f07a4f1166b10  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_billing.png
098f9c438fcc9fa95bf50c0c4fe8c58b402f726b2fc498a2f30539e08a81564c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_denied_B2.png
48654a1c2cc746e3f59009b771d9f46fceefea03c98e020860ad59d43f21b1e8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_invite.png
14fcaa82a802170742a50afb2b36015344f88774be68420327002e12c0492d03  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_settings.png
d7481ae6c976b2b28848221053257a7ba7d1f86ba3e09348ae2fe8121f0748dd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_ADMIN_B3_store_detail_B3.png
9a137676686ebf22c967282e78d72d7b111e8cc6f7b95dcfe1f356376d26bec7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_FAIL_MEMBER_B1_filters.png
7d29e57b053f773072e82c09f015830e996d13083fd4dd79dfd73e6e1949e3bf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_empty_1440.png
a3f44a0e0e70882b96dddc72501a425a57f9ec533ae5ed2f246aa1faed5369a8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_federal_1440.png
7a916a1971bcc2c375b2081c9fccf825a121bb82ba0f3a4a16c3231a3d82685d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_MEMBER_B1_owedbook_1440_light.png
0bdd54680c39c92314826fbdcdf7aecff062691eadfb80164475ff7734d95a13  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_admin_stores_1440.png
4aa44701d0839bea2ebdc5d6b65793bcce42af78d0e0d525fb99270a54411102  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_audit.png
612f5925e5a8dc551be5beddb17496a7779587ccb76b7e37b65be21c754dfa08  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_billing.png
44cb3b243b801f4593f71cb0b9a94c96be3a3dcda0adb45faf8a57906fad2328  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_invite.png
ce28380986480bd7e22e8c688bd1f57ef69065293fdce19872b4b289aac42fae  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_settings.png
95506ac67312e0dfe810dee2cbb335d1ed94ebeebb94f1aab0bd302a827087bc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER1_store_detail_A1.png
09ca71e2ef388924d145965e8d9c6ef7e0cfb0052bdf96f8d3933014a22ada52  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_admin_stores_1440.png
dedeaec2c2f5e4c25776feffc924bce0c80b2ce617307bd8b0759056240c7c53  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_audit.png
8f3e641a8ea37c0a45b569bfbedee4552c1b1959fe9a2b0a2b4b3ebaec65832e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_billing.png
f0d2b134cfa33fcdca647dc84f64a2e4f949e75c68dd3024ffad692ba0090d91  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_empty_1440.png
237e1ed5e2920dc3221f1fdd5fab6780f51ce4052ebea85402133481915e6ce3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_federal_1440.png
ad5f9d601393859e479e298a1dc58dd06492a629779dc1c179e01cab9c6b9338  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_invite.png
3d718a3c11b1a6eae373e6296f2ea4d36c9635bb1725a90dfcd2a7b9622f57be  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_owedbook_1440_light.png
7c593b3935a18aa762b9054885a78e7c4179531a25138c6449885a4828f7309e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_settings.png
96e8e48efa2c7f9257efdec91632daed464e581a19a08e4dc9fd291a771c440c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_OWNER3_store_detail_B3.png
707ee77bd822319e2a7d5345590ea63d0f0b95776793a76fe9f774af2fe5634c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_FAIL_UNRELATED_filters.png
ed002e90603812168031a0c4bc0218c1851450c93aa4d72514e05ed2b7b98740  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_admin_stores_1440.png
d53fc125483a8536b2cb5f3a6cee05206d4aaaf74be53475a426656496547fa8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_audit.png
28e34efc957d3046b57009194c6925fc5ccba02ada8ffb693d91ed3a7682e4cf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_billing.png
7e55b6e071b70026d3177611f79464486c8223baae6630d4f3d2d52cd1cbeb7a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_empty_1440.png
616ea1f8d738f46706f8c8b2a44bf333f46e0175941302850a8e312449b94b87  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_federal_1440.png
d912a572b4cb623f734559aa87a672ae07870d23de355f3eb0a2439fd9ceae77  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_invite.png
7774a3088e548e78626ce6cc53ef85799682dea019571b837a29c48609ced673  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_owedbook_1440_dark.png
03ee35877b9c20dbd68ae8bcf9c9854b14c563c406b53ca3d933cfaee48b8070  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_settings.png
deaf47d0ff90e6bb42b38a43e0ebb7f6a33cb0a116f4c63c4c24053f953ec7ca  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/matrix_UNRELATED_store_detail_C1.png
09d631a377a22275cbcf7807908165f62d5bf2de7c3c69f9786a02271dda366c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_kpis_aborted.png
123a0f52f141947768c12d50be7bb82567178955f2a12d1bf2363273a8104f4f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_rows_aborted.png
e6d9240ded07ee770462b693111ffa7bce7e1382425b00a6a56aeb431ea187f2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/r016_r016_scope_aborted.png
328e0d6ede3bd413c0fd4bf4898a3e11e8a917736466c1f813a8c3ab47647845  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_1440x900_dark.png
184905e620d1922789e0478952ea200d382c19abb63b213cbcfdaad3a81bb122  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_dark.png
90ee9807875a01865745b26ba4a38ca0795754208310630642716050afaa4b7e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B1_375x812_light.png
b8f4821ff8e46c4e73453e64b358318be328b93e0de25fdc74b7cd27a459593b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_MEMBER_B2B3_375x812_light.png
50862354bbeb8d060e6adbfd076bb2b8ee05faaa545f76c9c5d75d52a8452479  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_dark.png
58d7a78190a2750fa57785e601aa0caa88c3968acd39b63b651dfcf0ec419f5d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1280x800_light.png
9789703a2152526ea54c1ad27d50cd5e30929bc023d26c9b8cdcefdb711aee44  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_dark.png
3d718a3c11b1a6eae373e6296f2ea4d36c9635bb1725a90dfcd2a7b9622f57be  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_1440x900_light.png
c236c3ab9991e270e109b6b812f72ae6c3d7be8a6f82b86e09132350e19e662a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375_drawer.png
184905e620d1922789e0478952ea200d382c19abb63b213cbcfdaad3a81bb122  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_dark.png
90ee9807875a01865745b26ba4a38ca0795754208310630642716050afaa4b7e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_375x812_light.png
ea1db7ec3bbd76503250188a700c21f6bb57f1cb2320e28944f32cc75e5d3b0e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_dark.png
f376841a25827bbf338d02c6769afa9718ad76701bd33ac68b8058d5122e9516  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_OWNER3_768x1024_light.png
afa387203901a343015e898554332ca4b1a04ded6e76d0705bac2c9b677885a7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_dark.png
53e3938768cb101c99cd746f0f7815c01fdbf580587cbb43864c31be2a72553f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/responsive_UNRELATED_375x812_light.png
5ddb812fa728f86a469af01334972623dad7c2abd94de88cdd2e6213a21eccf1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_A1.png
5ddb812fa728f86a469af01334972623dad7c2abd94de88cdd2e6213a21eccf1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/shots/spoof_spoof_C1.png
746025f9a5425019c462a657cbec4f1aaf81ab41fdcf09b2470894aeb8722ae5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/signins.json
bce7ec9b0a36e890c8f913b34b96350f3d5042ae89b67a365f164ee28b131fa3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof.json
3c5a0763349bcadd76760d6da7e9aa591bb8a7cb45f0269c1192946c1c8b550e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/01/spoof_run1.log
c9291b9b5d19e73bd8fb12b2b0070ee4c6fb0a49758e620061620d55649178fb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin.json
e138c6f8ad60f8838ada6b2fc8a5d62a6062f6084a03a292483a0261c1ae3e14  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin_attack_flip.json
dc7710dd6083f90fb0d293a66a349f7be8236dce2ba72e21ef909c28e4d1371a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin_attack_flip.log
1311b59c2bccc2d8ce5a9d0163d31ef843edda47fa832ea2a2451498ec52f138  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/admin_run1.log
d2188d0e8bf1243fe953c2772b3132808e4f121ec934f9d67167a12b70da047d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_1440_dark.har
3f3f4dfddbcf365e38290f32a8034bc643d330f86f48565d2750b6479de6864b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_1440_light.har
6b3e15a42bec3c08bdf1b66d557262e1f1d040f3d507f42814f92400f8dc325f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_375_dark.har
c51fa8b8150ce6edb59024629d52599906baa39992ee9a0ae943916900815f2b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/admin_OWNER3_375_light.har
33ac71d157f605c10a667955b882ad675fd30cca6a6abd7e5409f4b9906c6ada  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/nomut_OWNER3_1440_light.har
166b1f78b3f156b8e968a410170c2cd5910fca8fb6bc722d353f9d6361b0e27e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/har/owedbook_OWNER3_1440_light.har
027f1d68d9ff8ea37db5c39f35cb2644fe03d385c4b873252d6677e2e3a15cf7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/labels/copy_modes.test.tsx.txt
ba8490b1579df14ab86a33b93bb3b8f59197312826d3705ea5cb62b4a2b85bbe  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/labels/copy_modes_component.json
b9052f0ce995353e426a2720930a5317da444731c89588b3bbfe10dfc45c4082  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/labels/copy_modes_component.log
7e757d0f3fb8d088250d20c3d3bfa946f679dd52accdace59339e717d4d7bbb0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/har/mockmode_OWNER3_1440_light.har
2517ed57c4e6f8bc033ebb83e3fd4d972698fb101f73da4938005db765649012  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode.json
d2f24ff6e994500b3ff1e4005da45e07c470f64a3ae9905eb96678f08d073d38  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode_run1.log
206d3913dbd8f9bf0c682d7895efc8c1ee86d159d453e64f36b420715bc6f115  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode_run1_instrument_fail.json
45f18fccead6ff7b810a218961593e2768bec10d0a252ab741c4cfc1622bbce2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/mockmode_run2.log
e63cf388f84ca75e62fe8670aa89d39008ac43984c7ae8c15b1bf2b9d2af4710  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/shots/mockmode_mock_FAIL.png
e63cf388f84ca75e62fe8670aa89d39008ac43984c7ae8c15b1bf2b9d2af4710  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/shots/mockmode_mock_admin_gate.png
e63cf388f84ca75e62fe8670aa89d39008ac43984c7ae8c15b1bf2b9d2af4710  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/shots/mockmode_mock_owedbook.png
ceca0d706c305ea008f96c2a43418d96c3a371ce7ff46ed0e245e223b527e818  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/mock_mode/signins.json
a105f974a79eee513ef845544d99b4e1d4065d92ca01361f0743a0a5cad3a321  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/nomut.json
1e65a2716b6a347c38521d56eb9935a80335da68c9dda750c875a30c56bf3701  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/nomut_run1.log
09a612ad18e0ced2b0e0f987b18b453ea5d301587e88959e32e2a775ac75d475  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook.json
81b60dac833bfc87c53a757d7a6c81640a548cccfdfb8024158d6bad8d0b38de  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run1.log
d287c3db65a3aedee7ca0cdf2a641e9cbcc2c000e7ace5c5b9a5cce8d38bb68d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run1_instrument_fail.json
345c5a4d9fbd8533b85dfbc74165b888adf2d13c2b0ab9f68a39224807c4bf5e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run2.log
3de29ee98ff22c6cdb269101ac6bc3e21c9ea80873f1a87ff319c13c89ecf57c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run2_instrument_fail.json
64f50253a657ace34fd03439ea4978a81fec1f5d834edef2a30d5830d17d7461  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/owedbook_run3.log
9e1511e865cc3fdcd80878b6cca87934338ca0908e236c93b3be75e14241805e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_1440_dark.png
030f9ff3bb95822430c012116c04ab5df49dbc2506ffa2d69c853feaab9e0315  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_1440_light.png
f9d243fd8b43a747c6a7dea82f4e0888d5be3bb32510e5f3d3c9c18bf94472ad  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_375_dark.png
0fe86b33d360a69a57dd2ebf7d7139a5fea92a1de0f087737fd54eefbe9abde5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_audit_375_light.png
2b9e8666ec87a705f07dcefff37c21de8c8ebda046d250fb7d86dd416bcb471f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_1440_dark.png
25a301c3ee56454b6affe65a2c33ae5a0b5f7948d94f2db895a8751e0c4ae992  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_1440_light.png
f04323bd0f9bd5ac4512203ba7c08301edb5e2ebf791ef1937f8219670b0ad60  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_375_dark.png
ecc8f927a1b1ed56a737e8a66879587992a7e8801493766e60ae8c8b2b357372  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_billing_375_light.png
75f371e14646d776154d32f76107bf49711ed61d44776f5d67d6a144570ec9b7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_1440_dark.png
ad5f9d601393859e479e298a1dc58dd06492a629779dc1c179e01cab9c6b9338  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_1440_light.png
1f1af4fcb06c665e85e3710c3bc4b392a7d14f03547f350b86bbe27eb3759830  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_375_dark.png
7e1325d50c8793e2e0f71dbe7c7981494b6637cd7912e345fdea062857185ba8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_invite_375_light.png
2c10f1ac8ab07ffd4491f8c9c293223db7b4f35237e4438cff8ec70add1a1de4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_1440_dark.png
3a416cc020605cec6e8db5b48bbede270bb0271dfb1ef557490bcbdcf90a990a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_1440_light.png
a3e71c09c8f1dee86e396f5182283393c0f615770b802df1efdfcccf63e80eba  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_375_dark.png
229d5777a738def2182ec04ca85a00134a41826724da94179a68214a41176a13  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_settings_375_light.png
a25cba9c45c7d86e11867d0a1a3465fc0619ef3d6745e1ff88c5a2327e1d7ff4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_1440_dark.png
80da0a6dd338fce9ddaf1807cc061ec1c9299a9f790713812e764f1c11f3ee58  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_1440_light.png
20c65bd7de7dbc42d742233cd20079b96e66e274963437a28a154ddac1c34d13  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_375_dark.png
37353753cdddeb3edac7e1a63321e48efe2e194f0ae346da4024cbf0af6ab058  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_store_detail_B3_375_light.png
f44a0f6cea58c62252f537bf5c5601f89037c6258ff33e1392bc20af9f48840f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_1440_dark.png
4c411e0fbb809f8c58ea09dc1e14b1a7dd2ea07f42d8c735f1372d9ebd523c6e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_1440_light.png
6c3f7ead5e4fff213a7e62a35ff9bc33da21eeaf088421a61a36aa5c01aa0ad2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_375_dark.png
37f5adfe437ebadfd8e014b0087302afa94df1bd008a008758f9b9e4f4060db1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/admin_OWNER3_stores_375_light.png
4e2333be20bb9db2ee1eb4fb27eb0e9d6d9714d08cdc9f2b0e910d987d41d296  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/owedbook_OWNER3_f05_reselect_pbm_picker.png
3d718a3c11b1a6eae373e6296f2ea4d36c9635bb1725a90dfcd2a7b9622f57be  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/owedbook_OWNER3_owedbook_1440_light.png
22dbd119d0567c011d541ab01db092020c780f184fd4c0146ef8020ffccc1733  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/shots/owedbook_OWNER3_stale_fence_B3.png
5a496c10320cf60c47ce133ddf74f119db1252864575f635341a6cccdeb1950c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/browser/02/signins.json
3e74841b6ecdf52e3224d0f4389fd16eda39ee44815df2afd9fd48cda36c5537  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/carry_forward/Q2_01_carry_forward.md
c20d9b1eab6b14a88a8b33d7e4c6be2f7b690c1221f7c1cb2e88ebfcace2b911  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD.json
4ca13dc73769b902ef7a1e04dbccc64cb5e21ba273974c91a1b0afc45dff2fd5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/BUILD_mock.json
d3a0fa0dbc3d673a89a1d3af0e728ef2de89f8a9613a51b8751b9767e4b14d69  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build.log
9fb8f87387a6d92e4149a2373322a759ff173f09e09e34ef39b55210978f8967  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/build_mock.log
c924dc03e899ddc533d51283e793ca08a83c474cde3f32004913d8fb964ed216  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/bundle_scan.json
77b273cb8bc86285b77149e6a6a534d0e9375c882653fcf695ca45d2f639bedb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server.log
9fdbd8bdff09d25fa3923e08f200ccb841db27867df8d3bf61d4a18a71920f06  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/01/server_mock.log
ec043de1af5d59847b7aee24956dbd7c6ceb34b9f0c171d59388b80bf4dd0990  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/deploy/02/bundle_check_q4.txt
ea9b995ad0efbcb82395bf19482e7bc72ea542a08f9c8bf247711d920807e4c5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.json
89830a5bf18f7a126d1cafbacb7c9f482a596ebc614b782e6670208505be1347  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/allowlist.md
e09eac95e349dc77c962464c310c32e54cd774c63c90784e6275b53a6d55e2a5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/board.md
1d2825445d1609c42933510893ae2efa51e6ec1f979d0e5c290a62edee3b6238  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/cast.md
cf1f236661065fd2ede9042c6461d162305bb5e3d2a7e0b9337ba559b8f98319  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/catalog_counts.md
8968137876847cc3cf1c701287b269c4c65800c55439197f62f5a036f75eda6d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/matrix_delta.md
e7e576ab3b54b3ab5a2c30b1b31fa50b8468d73b56456a2ec0a85e3c92e005af  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/money_rules.md
2f48ae47f23f99e5c8308e5b86ea2b9cce10f57b2a9ed710b735ce2186ec6713  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/policies.md
b3f52dad570cd2c10df39a335c731c2357a10f619c022e924de84bc89dd6b670  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/seed_audit.md
c833c7c0e8a313eb70771d7105062a8224b3e7a552516c0f8071e7f5f01a3293  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/01/ui_dispatch_counts.md
31982e96279b66a5e4c938b7729e02272e5d689c4086d60090f810d645071ebc  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/02/allowlist.json
0b934e6571ac215469baf76683184fc2d0905a55a6d5919713848f28b7e6ff66  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/derivations/02/allowlist.md
819bfee5c1484b7263d2394cafc94216fceb118fbdbbc1b9496e830bf90bcfd4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/check-qa-env_current.txt
30f79a68e9e423443a6a418b790b5f3ad65bc2b31279a79bb345dfed96dc34f6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/credential_mapping.md
3217b86f61a1b58fe41a51d699b67efddc4de5426a84b3c0555f76e1f2c5ad98  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/env_qa_local_stat_names_only.txt
4cae26c7b2436f46c9c75702ab871735bc72d3840c279c1820b1f15324502c90  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/env/01/make-qa-env_selftest.txt
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/auth_path_diff.txt
f8678f47d20a8cd782246cf69afbab8dc3600284c04ab23c6f217ef780bf0cce  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/baseline_to_candidate_name_status.txt
95a7a78d284652db895bc06ac36dcb7b8ec4bf33919486624c5c9d0fbcc4442f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/branch.txt
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/candidate_to_head_diff.txt
7eb072b63379849c5e6a0e6b5cd3d413ce24f0416570fa012ca2b6a6bd094835  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/contract_hashes_as_read.txt
c263724dee93dac7d1718a9d3a3b3686ec726a90eebcf23be32a757118c811ff  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/e1_placeholder_counts.txt
845464fb066e8789086f8e2b8f873a71cb917fdb9f6405c1e16912c947c3cba2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/head.txt
c2e0f868e9f82fe99c0966602f6f303374bfc48283a28f84b96b40df6fb1fffa  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/inherited_dirty_baseline_status.txt
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/lockfile_diff.txt
aa287fb5c2840a92008c33efedf7e933ec6c172c747e6b44ac12ceac1ab63b04  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/log_baseline_to_head.txt
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/migrations_0001_0047_diff.txt
91360f2ae4f0688c0dbb8213d39b939134f9c0208f7922937968629ff44272c6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/package_json_diff.txt
620508485a62ed93f9cf69fbf86ac3c0fcbb44d61e84d2ff230e1902c6bb0448  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/01/qa_generated_paths_status.txt
ecb36652bc29a28c992d3a3c725ba6e8efcba9dfd8ad4be4387eebf91ffc1bc3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/allowlist_check.json
40e42a8bd236a43fdceb5d6f992b0f6b6de00e8b3f73a37b44dcce5866d6adb5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/dirty_diff_vs_q1.txt
1cc091d009f22d12ce2aef14cc6bd89d6ca4e8c4ea21524f67a51c9bcfaa5f00  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_end.txt
c35accbb0821ed4eaa4de5ccd4751b11525ae6f0823cd40c7e3c398d1e300c17  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/git_status_porcelain_q2_start.txt
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/lockfile_diff.txt
91360f2ae4f0688c0dbb8213d39b939134f9c0208f7922937968629ff44272c6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/package_json_diff.txt
ab13cc3f950f0f54013d9e3870861344d5ac21e60601b44860cdb39f260fe238  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/product_paths_baseline_to_candidate.txt
b817bb482db3f61bc73a9b26f50629f00be5f99e1158c68dcd9a043184a9b57a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/q2_entry_check.txt
1b69291f361fdb0597c6c0934195cbb8d21626a837705a09acdebd3b4a35c26b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/records_check.md
3409b67098a20b0e2ad15e23f1de1b974680f57341110f36aa3d83a73eeb2c03  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/ro_sql_fence_attacks.txt
18218a2f65d614981372fdbf957b0bd1ab205f420e19cb27ed66d5cced4e66b5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/scratch_shim_fence_attack.txt
6b409efca45413c0a54a7b90de0c6932511bc9b78965e484d7a92ecf2191ca23  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t00_repin.txt
b605e8dac17281f215e273dbc9ad1d3814f89c56df81000551ded2cb4ecd539e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t02_dependencies.txt
43f0af5d363cca9d6499895c3f63df474d88d0f7356f50010bb6d74af901abf8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t05_auth_routes.txt
20e9f0b1f8cd37e53cc9817d410e06f8f410c6dfcefa028f03caaf24ff24c6e9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/02/t06_migrations_0001_0047.txt
ed0ea2d27fb63cb3c2c9b5de445ea69c16d9550968319d753f82283721223b85  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/allowlist_check_q4.json
6b1d1fce721742e839525e2a0b9f8f2ea419a0294504803f29ddc8aa3410ef46  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/allowlist_check_q4_attack.json
92da1351d64cf2a30a4afe2b2c5dc2c0189e15295e4db0a12dd57cf5d922f808  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/git_status_q4_entry.txt
3e4d4c97e99dc24d1b5a230d445c4923df1284d707f9cc7f96fca9c656f3d0c2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/product_paths_baseline_to_repaired.txt
204e1d71ffe092560749b240bf852ee07eb16e0461e3b2f295a43a20ab6c920b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/records_check_q4.md
51c789434cd779b988f7b423a54ba190db26a578b9cda53419dbfa509317cc94  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/repair_diff_name_status_all.txt
d0666c1d439342b8c963b27de8b5f3780501044a2d439b48d34d6c41b899f89c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/repair_diff_product.patch
5805286dae139b2e3735c1446dd9c594cad3184838584c6f455180b9f969fa71  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/identity/03/t00_repin_q4.txt
3afbc90c9fba7f24d952d361e8a128146aee2c8cf0772923574b1d43229fc771  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/PREFLIGHT_RESULTS.txt
b9ceb027419259e436be8fbe721b6bd5856c4fcf97a435ceff6495b53333573f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/preflight/01/frontend_target_check.txt
a3f800f56a2936bf8a6f56059cc973e18c6f9b7df48efbe9fe5dfd1dcfe1dfa5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/automation_scan.json
06d2c5aa9c71ebc3ed81ea82d607a58f426aab41770bd40e6fbb0d086804493d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/automation_scan_q4.json
5c96cb8bcd8ffe9a452cb624c1e377abdf94054e8b9b800761711971fa222b25  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/evidence_scan.json
af8f0c4f2aff938b573764116ebe43949e19c8a1ba52a6f554e7b55454d05a5a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/evidence_scan_q4.json
ba4ccff5943294a2e4fce3fa285472307057d6f977db0690fff67ae8af25cadf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison.json
eeef85de362201ef87ceaa80906d11cc7e6685342daefc8887050ee8c63b2290  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/poison_revert.json
9724697ff4865c4af13f3fce56a2ba5876bd5b7b2e4a9c7c5a242372a5c0805d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_clean_verify.log
4c0591480bcae29e6dcceb87a6ad7d581468941f375f6ddc5c271144cb5f86e3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/scan_poisoned_verify.log
52282377571345767ed845aad658a1cda9f2c6c83c5f35f0c8a512d21d8e7516  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/privacy/01/seed_scan.log
2bd471d9d44b6d3c14700484e83598470cba0a7968f2eb7ed6d12197cdd7f513  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/grep_user_data.txt
d3495e30902a9f673679e8f924dbedac8e996dcf419edf57eec6617d1e71daaf  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016.json
09d631a377a22275cbcf7807908165f62d5bf2de7c3c69f9786a02271dda366c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_kpis_aborted.png
123a0f52f141947768c12d50be7bb82567178955f2a12d1bf2363273a8104f4f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_rows_aborted.png
e6d9240ded07ee770462b693111ffa7bce7e1382425b00a6a56aeb431ea187f2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/r016_r016_scope_aborted.png
db038caeea505cfa3c3be32aa0921162c3043110da10f7f9d2ac00b77ccd62d6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/routes.txt
bce7ec9b0a36e890c8f913b34b96350f3d5042ae89b67a365f164ee28b131fa3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof.json
5ddb812fa728f86a469af01334972623dad7c2abd94de88cdd2e6213a21eccf1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_A1.png
5ddb812fa728f86a469af01334972623dad7c2abd94de88cdd2e6213a21eccf1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/reads/01/spoof_spoof_C1.png
ea2e4cbdf8addec31dbf836046f624eeb637b523b441726a3b6a5f11e8d96b20  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA-matrix_2026-11-09T0404.log
b072738ed7d5d4d77ffc1767731a944db10d07cffd73b46f776cd2d9430bb178  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_CORRUPT_2026-11-09T0405.log
840dc3eda3c2446667bef247aba17aef2adaa995ffbfc0e4b933bd0bab1bee24  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.log
308667d188b068156271813901122b515222d046e26b0be3b6c4a9f16a78a5a5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/APBM_QA_prove_2026-11-09T0403.normalised.log
3c354d86a257b2462585db64ec3ee35fa73e2e2a336e0a2f45f71850215ac9f3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_attacks_2026-11-09T0404.log
634fff0166881412a62b9d3bcda3828e28f885b88f1b23f6126e9da54efdd847  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_revocation_2026-11-09T0404.log
e9753222a4062b68bd5a8fb7ca57af7879c996fbd13b3f395d55bd98cbb7ffe7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X4_scoping_2026-11-09T0404.log
b9c04465320fe0bb6b47d93b71bf47f39655267da0cf27b520f7209c8dddc44c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/X5_ac8_fresh_2026-11-09T0403.log
66aac61f7992b6029bca31b01b0dfbdea0387276408af4a52768a2118d71be23  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/apbm-user-audit-proof.json
5f04d4a391a7a08fa9cd5f2d98ab353c7a24b8992763d0577c3b2b465b04e3d1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-1.log
b77209290af3079f50fc8d933a1d1139f561b5443d3b7b106655764cbaa81819  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-2.log
d2ded26f8a2cc6a7274ec38a017ae62aa049ba52c717cdfa103338c61d247d20  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-3.log
3e8491803ac49b97ea80115ff9d2d22248349d802bdf7dae6d4182e3580778f3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-4.log
30047de1ff1ae30f31bd88c5ee9ffaa6bc0f4b38fa22f66de756be12feab4c88  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-5.log
663633732dab8245f3334ef2a3cfd64c635adad02881c0e9dbd75df505671c85  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-6.log
0cc0362f52e45a3fd7c2a7a81b69225f5d9de2a834e4f17ab0a63c7917dab02b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-7.log
bec5f26c0c6a829cedf923d04e9544ca83f0cf6dd7059b3052aa3e185726e68f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-8.log
520cbc16b78bf9e78c0f469e49723f6584814cb46885c354bf1beca6c45aa11d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit-prove.json
3242c19879142c7060209a68e514ed74ad3cafd814aa309be8f33acb09ecb0a2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/audit_prove.log
653ed88910e6d1dedc02012106529b42bb9eaa160faf619fbbd2cabc4bd19743  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/catalog-approved.json
2ef0c90f2a8885889b5da5ec99677ba9f0d6bcf8c07502b83e21181ff464d4f6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify.log
8e94b12aff2a114d8a4a555bafa730c00b678fc41aa33e59ee1ab8ad362f4330  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/db_verify_probes.log
28117de82c251969978163dc8362c41f88fbec68be9a0c4920f58f49952743d8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794196996521.json
1229351ee0376850f34472c0168bdc1773234f53360489286c65864989f38f74  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/forward-scratch-reset-1794197163119.json
47de636e056b96a44afdadb89d282226bbe0b15b28a621cbaefda2e559ac2411  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_corruption.log
9e66e0db4bbb19056a8b7757daa9f0048886d7cadbd44c3ef130906c58e9c9f4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff.patch
6739c8083d5de0f768ce4c71f3338acf78571d95dd96f3252450d93e81206432  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/harness_diff_review.md
bc86b80a548efb9d0394b8d78c6525347b84643346a56f68340ea3f5601c5c53  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/inventory.log
a61d9b9b3573811211ad1bb1f618fb46fee661834026114c615dd56d9cc00f70  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/legacy-cast-cleanup.json
c0e5b26a3350e8dbab7eb3c2ef0a84cd771ef7ba67c5cce01dfa50fe3578f256  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/migration-inventory.json
af4f20539d3687ef850a4bb2f7252770f14a6f7ea6d3028ce59a3158569ee4f0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/rls_prove.log
70d8589cb4c3f5fac4c546588f07b5678c67752f2f7815c579d9a3bf86a85549  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-map.json
14e11de9013d1aa179311e1aceaf566f53b14102c0db18e74ef99e6871ff26db  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-receipt-1794197197146.json
c6e24e713f947f9dbcf941e2ead9516ca554ba344601e7c5c48a7df0916ff769  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-reset-1794197174115.json
a2b54c2b8783997ae1b81469baa298bd8344f4c2eff0bf2291e24fef18cab10a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/regression/01/seed-verify-attacked.json
41b09a8f1ecaed931fa005c882019d25cc9d9ff60be02eb8cffa14de1787ff9f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog.json
e4bac57b9bb5a8fd6886e9a365b78492956beb8569a88fdfaad7206626cce14d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.json
b7a8d9bb7191f1fcfbe4ece6bd4feba4326d9c935869bccdb13868aa1ad5544e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_forward.log
b7a8d9bb7191f1fcfbe4ece6bd4feba4326d9c935869bccdb13868aa1ad5544e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_after_replay.log
3d18a200afbe8c2bcec5df526352d64c613564d5d52826913ea67e31537a4e00  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.json
af0ee526edd81b60abfe7ab9a5aacbd2d16d79ced4201256edc2f3f5d45e29ee  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_at_47.log
461aad9a9d910e84bb7c64474418f181a270b12807a4b85234b88c41209fa5f5  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/catalog_control_at_47.json
6a68c9a72b9bcda68c1730d9e8c1022d47319ee7bc272dce58add9eb711f45c2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195352571.json
6ae0a4567e2384bf33e484e308723eed9d18155f15b7ec90b0ebe8b88409fe8d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195353893.json
d3ca8d8ca29f1b73dadbe732dd273982ccf12610dcc3132d3ee9245fa4240a93  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195356328.json
df18cb588f6c2dd70bedfbb769ba017c99eca0e1c61448bc3f2ee21fbdad0e29  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195955934.json
a7154127a59a458e9542a7249b41792feac1d8bb1d52a75f6c5dcb079fd1fb39  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-apply-1794195958593.json
fda64d2cc7ef6f133351813239f80e1b478cddc617a95dedabc1c9c1a438a080  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195347747.json
b52e34a0294ec70d61a10e1208b18128f6f4d9f9deabceb1f1ad8012c8598fc3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward-scratch-reset-1794195951557.json
3b5e8197bdc1bcb14eb2067630233dc438ded4f73c22086c0ead0feb9ebc2d14  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_48_52.log
e4d92019e5f1f59688e7de933c63b6d1c2eb92c7203fcaefec078f4941f5d5cb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/forward_apply_noop.log
14262c232a4d668038cb3e25e01879911dd7960e4e29237e54acd702f6b3771d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/inventory.log
df386edaa51681290c6ac78347bd028fbf320c697a5f639f2923d88bbc3c3605  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_after_tamper.json
df386edaa51681290c6ac78347bd028fbf320c697a5f639f2923d88bbc3c3605  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/ledger_dump.json
c0e5b26a3350e8dbab7eb3c2ef0a84cd771ef7ba67c5cce01dfa50fe3578f256  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/migration-inventory.json
4639f38195c4a75bc13c56ef9bab3060868c76ffbe6b31fe75dc97a71949986e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/no_account_no_junction.json
aba5a9bc280ea6b3d265dc42c44b9a8c5a9fe5ac705521af2e62d2cb838182ad  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin.json
9021b5bf325cbe970d13c82fe87a2c57fd5aca64ddd6d46a5e02d8a23e0d6656  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/one_admin_after.json
8980d1a81cadd5a2e0d5bf23640e950f45bf1cba5b1e19631c8468f3416a20ed  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_1.log
e4d92019e5f1f59688e7de933c63b6d1c2eb92c7203fcaefec078f4941f5d5cb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_2.log
e4d92019e5f1f59688e7de933c63b6d1c2eb92c7203fcaefec078f4941f5d5cb  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_3.log
c58d75f63ffdb1f0baa5b2fd1d69858c4bbead7da557cfad528513cf14fb9a3e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_tamper.log
5eeeb773d7eeb31f364a571a10c7cc494ecd58051bbd76ea0ef99a5768333bb6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/replay_through_47.log
73fb65cf2a946dd9e0eaed15677033bd4a27e3a795e66c49983168f3b1d9f4cd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t10_status.txt
5e7858d04894b29240469b3f00bc3c011049c3bba433ca4ad8d8c87e1c6659a4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/t11_status.txt
2711770123b8f66cfb4e4d02af342494461c06cd167493da77f507acfb934ef2  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/tamper_restore.log
94ad4663eca3bd3553134a1d73fbe52b5567e2984b211f0241caf373353520c4  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.json
79842d02c534277614aed3311bf4d9a774df98e92fea3746d82b74d6a7de4f8c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/schema/01/trigger.log
9cbe47c8b0b051dd33b6df1013d710ea73f063e34e697a4d745292c9ff29cf53  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_poison.json
a3cb6795e28d394ac96d6bb44c5d1ee6bab72243bb7b9f0a29b095b1ac0160ab  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_revert.json
d4377a3487806d747e742de715c98180c646db7a9cc283ee26a9ab7d36f8532e  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/attack_touch.json
020b9b38a749709dd96a52371ee6d61e271dfeeaf095257f80ce6b785c8ba735  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/cast.json
0bbf1fa956addc70b025ae191e7e676a0d1d6384b0a6fb16556619fc32c67a75  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/generator_review.md
432fb24486626e99922925897fe367a69ae1eed9e517ef2c09650f7833706bc0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb2_status.txt
fce4ee95253713309c245fbae189886ea1ffb4e8ccedef0dcf752e61a9594cb9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/groupb_status.txt
c26010b68555c07ca31fd8fc4096ba8d97292572f418f9916c7dabeb99ad04cd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_revert.json
dbe7d3a97ecdc92a1a7e9c8b6b159e934da4d647021800e7b74bbf09c2e3a64d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_after_touch.json
ee497272540b9a9a06cde120c47ae52611e1feda0db8204630483193afc17131  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_attack.json
9165f7ca10d26ae4725df3d1c963e6dd218b9c031a8fa37c5efeb0807ac9f7f8  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run1.json
abbb02ea7ed2daadc9dc4f66eb13575bedf0dafc1438ac0b0c44b30f956fa967  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/hash_run2.json
d363555b1262033b327e5973294610258a653829828deb396b99a226e4b8a113  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules.json
92de50eb1f7d8b15328626bc406fe53479de3c3665d2191a57c11538b691958b  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/mocks_money_rules_baseline_control.json
cad3f97055566e269c24999ec6d9378c729bbcb03be18ca47666fc240fb0d38f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison.json
ddd4345ed988c1070ef3fbfc1ff87352a270b3983f5c088f95aafed1e1708057  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_revert.json
0bb70fae8360d1a2f75552d8f5a65e361d5709aff4b40cf1455a462578107ac0  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_poison_seed_verify.log
e8367d4bcb529c29fa1f0eaf1ef95fe06763275013af4de56e030a81b89b4801  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.json
4c5b30c7698b91bf29f7081d2f95347eba9807e6c669064c69d4b3b3eb7848a9  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_250.log
e8367d4bcb529c29fa1f0eaf1ef95fe06763275013af4de56e030a81b89b4801  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.json
e5074f4bbbc736a869fa8a52dbbab288ccaee13d9edfd5350163fbe7e26e98db  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_after_revert.log
cc11a394c6bc94480977da43fc816d047fae8e0932bd10a82e5beb695e4a2f42  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.json
2724752d4587dfa35a0309d2cc652423aac4c19493278e7d27ef7b334b3d34c1  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/money_rules_poison.log
6dc135a8a38973dca1262d8b427b6955967090dddd5a39c6ad37cdc831c5cd7f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_0.log
6dc135a8a38973dca1262d8b427b6955967090dddd5a39c6ad37cdc831c5cd7f  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/reset_1.log
762577dfd8c7adf03906793816c5211b930076a4efe8d28ab9d99f8bd2f27389  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_1.log
762577dfd8c7adf03906793816c5211b930076a4efe8d28ab9d99f8bd2f27389  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/run_2.log
c2480d2af6c4de15fdaaa42b67d2f2410dbceaa7a2695a51bc30888bc44790bd  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-map.json
14e11de9013d1aa179311e1aceaf566f53b14102c0db18e74ef99e6871ff26db  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196267399.json
ed0a8453007e42c1b24bcf58a2f05908c708968a5038b296d6d88b55ff10d8ef  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-receipt-1794196295856.json
c6e24e713f947f9dbcf941e2ead9516ca554ba344601e7c5c48a7df0916ff769  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196251686.json
1f2636fde712658f18a4211eb8cace5820a6b6b41bf9862599224dd35ba9ca7a  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-reset-1794196277074.json
9ebe44f8376f357345f57b79ef4975a53ef147978cbea6703508f89ca72228c7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed-verify.json
9ebe44f8376f357345f57b79ef4975a53ef147978cbea6703508f89ca72228c7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run1.json
9ebe44f8376f357345f57b79ef4975a53ef147978cbea6703508f89ca72228c7  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/seed_verify_run2.json
6d0991c8409aca1763593262d64f10f112ce6475c4267cf1afe9295920a6b154  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_1.log
9724697ff4865c4af13f3fce56a2ba5876bd5b7b2e4a9c7c5a242372a5c0805d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_2_compare.log
9724697ff4865c4af13f3fce56a2ba5876bd5b7b2e4a9c7c5a242372a5c0805d  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_after_touch.log
d551acd2ec9fc549a1ac0deb2a7987312daea9bf533516d97169041aa0b888a3  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/evidence/seed/01/verify_attack.log
2fb5e8b5681fe1362fbdb83645196a500a5c2b6086883a76a3cc4ff5e0e8936c  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/README.md
1b48db1d5b92f8867ec88d044cb0f2fda827c542fd41220397fd16d9b4b2c0c6  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/RETROSPECTIVE.md
55488e045db7c1af1e81a31e23304fcbc5956b51775dae9023c9a4c9973c0c88  agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/REVIEW_NOTE_FOR_JARVIS.md
60a1868d942fab5e7f0d51073946d77774a0abcc76b1129494a7237f3324ad6e  agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md
```

## Proposed command implementation — review only

```bash
#!/usr/bin/env bash
# REVIEW DRAFT: architect reviews ARCHITECT_REVIEW.md before final commands are issued.
# Tony executes the final visible copy-paste commands after that review.
# Cody has not executed any command in this file.
# Director ruling 2026-11-09: Target One accepted; pagination manually approved.
# No return to Friday/Claudy or renewed cleanup acceptance gates integration.
# Friday certification stays bound to its original candidate; cleanup remains unconfirmed.
set -euo pipefail
source_repo=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
integration_dir=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev-apbm003-integration
main_dir=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev-main-review
repo=Cyberize-Group/cyph-v1-dev
pack=agent_docs/ACTIONS/APBM-003-CYBER-PHARMA
closeout=$source_repo/$pack/CLOSEOUT
original=308247a24e6ddd455842da5cd2e21541d7eae2c1
certified=dc44429f466dedcf35023342f68624c6cee062f0
expected_head=c5061d9f75fa242a3d14913c08d6bbad7173c638
stop() { printf '\nSTOP: %s\n' "$*" >&2; exit 1; }
review() { local answer; printf '\nREVIEW: %s\n' "$*"; read -r -p 'Type REVIEWED to continue; anything else stops: ' answer; [[ $answer == REVIEWED ]] || stop 'Stopped for Director review. No automatic continuation.'; }
merge_review() {
  local target=$1
  git merge --no-ff --no-commit "$target" || stop "Merge needs resolution in $PWD. Preserve both sides, review exact conflicted paths and stage only those resolutions. See RESUME.md; do not reset or rerun APPLY."
  if git rev-parse -q --verify MERGE_HEAD >/dev/null; then
    git diff --cached --stat
    git diff --cached
    review "Merge of $target. Resolve/review before committing."
    git commit -m "APBM-003: reconcile $target without discarding either side"
  fi
}
cd "$source_repo"
[[ $(git branch --show-current) == qa/apbm-003 ]] || stop 'Expected qa/apbm-003; do not switch this dirty checkout.'
[[ $(git rev-parse HEAD) == "$expected_head" ]] || stop 'HEAD changed; refresh this handoff identities before running.'
git diff --cached --quiet || stop 'Index is not empty; preserve and review inherited staged work separately.'
[[ ! -e $integration_dir && ! -e $main_dir ]] || stop 'Integration/main worktree path already exists; inspect it, do not overwrite.'
python3 - "$source_repo" <<'PY'
import hashlib,json,sys
from pathlib import Path
r=Path(sys.argv[1]);p=r/'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/source-hashes.json'
for name,want in json.loads(p.read_text()).items():
 assert hashlib.sha256((r/name).read_bytes()).hexdigest()==want, 'Pagination source changed: '+name
PY
python3 "$closeout/privacy-check.py"
mapfile -t pagination < "$closeout/PAGINATION_PATHS.txt"
mapfile -t records < "$closeout/RETAIN_RECORDS.txt"
# Validate literal, finite manifests before any staging; never expand directories/globs.
python3 - "$source_repo" "$closeout" <<'PY_MANIFEST'
from pathlib import Path
import sys
root=Path(sys.argv[1]); closeout=Path(sys.argv[2])
product=(closeout/'PAGINATION_PATHS.txt').read_text().splitlines()
expected={'src/components/owedbook/OwedBookScreen.tsx','src/components/owedbook/ResultsToolbar.tsx','src/__tests__/apbm-read-states.test.tsx','src/__tests__/owedbook/ResultsToolbar.test.tsx'}
assert len(product)==4 and set(product)==expected, 'Unexpected pagination manifest'
records=(closeout/'RETAIN_RECORDS.txt').read_text().splitlines()
assert records and len(records)==len(set(records)), 'Empty/duplicate records manifest'
assert not set(product)&set(records), 'Product/records overlap'
for name in product+records:
 path=Path(name)
 assert not path.is_absolute() and '..' not in path.parts and not any(ch in name for ch in '*?[]'), 'Nonliteral path'
 assert (root/path).is_file() and not (root/path).is_symlink(), 'Missing/nonregular manifest file: '+name
 assert name in expected or name.startswith('agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/') or name=='agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md', 'Unrelated manifest path: '+name
 assert not any(part.startswith('.env') or part in {'node_modules','.next','coverage','backups','private'} for part in path.parts), 'Private/cache path'
 assert path.suffix.lower() not in {'.bak','.backup','.dump','.sqlbak','.pdf','.pem','.key'}, 'Private/backup file'
PY_MANIFEST
# Step 1: isolate the new approved product repair in its own commit.
git add -- "${pagination[@]}"
git diff --cached --check
git diff --cached --stat
git diff --cached
review 'Only the four pagination source/test paths may be staged. Prior certificate remains bound to dc44429f.'
git commit --only -m "APBM-003: approved OwedBook pagination usability repair" -- "${pagination[@]}"
pagination_commit=$(git rev-parse HEAD)
# Step 2: retain the exact sanitized evidence/closeout path manifest, not a broad glob.
git add --pathspec-from-file="$closeout/RETAIN_RECORDS.txt"
python3 - "$closeout/RETAIN_RECORDS.txt" <<'PY'
import subprocess,sys
allowed=set(open(sys.argv[1]).read().splitlines())
staged=set(subprocess.check_output(['git','diff','--cached','--name-only'],text=True).splitlines())
assert staged<=allowed, 'Unexpected staged path; stop without resetting it'
PY
# Immutable raw QA logs/archives retain original whitespace; check authored closeout prose only.
git diff --cached --check -- "$pack/APBM_STATE.md" "$pack/APBM_JOURNAL.md" "$pack/RETROSPECTIVE.md" "$pack/FOLLOW_UPS.md" "$pack/CLOSEOUT/CLOSEOUT.md"
git diff --cached --stat
review 'Review the complete staged records diff (git diff --cached). Credentials/backups/local login documents excluded; inherited unrelated work remains unstaged.'
git commit -m "APBM-003: retain QA certificate, evidence, Director acceptance and closeout"
qa_records=$(git rev-parse HEAD)
printf 'Pagination commit: %s\nRecords commit: %s\n' "$pagination_commit" "$qa_records"
# Save nonsecret identities for resuming a deliberate stop; outside Git.
printf 'pagination_commit=%q\nqa_records=%q\nintegration_dir=%q\nmain_dir=%q\n' "$pagination_commit" "$qa_records" "$integration_dir" "$main_dir" > /tmp/apbm003-git-identities.sh
# Step 3: fresh remote relationships, separate engineering worktree; no dirty QA switch.
git fetch origin refs/heads/main:refs/remotes/origin/main refs/heads/apbm-003:refs/remotes/origin/apbm-003
git merge-base --is-ancestor "$original" apbm-003 || stop 'Engineering no longer contains expected original; re-review ancestry.'
git worktree add "$integration_dir" apbm-003
cd "$integration_dir"
merge_review origin/apbm-003
# Transfer only C-03 product bytes; never cherry-pick its mixed records commit or merge QA.
git diff --binary "$original" "$certified" -- \
  src/components/admin-portal/DemoMarker.tsx \
  src/components/admin-portal/BillingScreen.tsx \
  src/components/owedbook/OwedBookContext.tsx > /tmp/apbm003-certified-product.patch
git apply --check /tmp/apbm003-certified-product.patch
git apply --index /tmp/apbm003-certified-product.patch
git diff --cached --stat
git diff --cached
review 'Only the three certified C-03 product paths are staged on engineering.'
git commit -m "APBM-003: carry certified C-03 product repair onto engineering"
# The new pagination commit is product/test-only.
git cherry-pick --no-commit "$pagination_commit" || stop 'Pagination cherry-pick conflict; review exact resolutions, then use RESUME.md.'
git diff --cached --stat
git diff --cached
review 'Four pagination paths only; review the cherry-pick result.'
git commit -m "APBM-003: carry Director-approved pagination repair onto engineering"
# Deliberate selected records snapshot; no wholesale QA history/branch merge.
git restore --source="$qa_records" --staged --worktree --pathspec-from-file="$closeout/RETAIN_RECORDS.txt"
git diff --cached --check -- "$pack/APBM_STATE.md" "$pack/APBM_JOURNAL.md" "$pack/RETROSPECTIVE.md" "$pack/FOLLOW_UPS.md" "$pack/CLOSEOUT/CLOSEOUT.md"
git diff --cached --stat
review 'Selected sanitized QA/closeout records on engineering; inspect git diff --cached.'
git commit -m "APBM-003: retain selected QA evidence and closeout on engineering"
# Step 4: reconcile current remote main before PR. No rebase/reset/force push.
merge_review origin/main
git diff --stat origin/main...HEAD
review 'Full engineering versus main integration diff. Preserve both lines; no QA wholesale merge.'
# Run the board on the actual integrated tree. Environment link stays ignored/untracked.
[[ ! -e .env.local ]] || stop 'Unexpected environment file in fresh integration worktree; inspect before replacing anything.'
ln -s "$source_repo/.env.local" .env.local
git check-ignore -q .env.local || stop 'Environment link is not ignored.'
npm ci
npx tsc --noEmit --tsBuildInfoFile /tmp/apbm003-integration.tsbuildinfo
npx eslint .
NEXT_PUBLIC_APBM_DATA_MODE=mock npx jest --runInBand --ci
NEXT_PUBLIC_APBM_DATA_MODE=real npm run build
git diff --quiet && git diff --cached --quiet || stop 'Validation changed tracked files; inspect before push.'
[[ -z $(git ls-files --others --exclude-standard) ]] || stop 'Unexpected untracked integration files; classify them before push.'
integration_head=$(git rev-parse HEAD)
printf 'integration_head=%q\n' "$integration_head" >> /tmp/apbm003-git-identities.sh
# Step 5: protected-main PR route; no direct main push or protection bypass.
git push -u origin apbm-003
pr=$(gh pr list --repo "$repo" --base main --head apbm-003 --state open --json number --jq '.[0].number // empty')
if [[ -z $pr ]]; then
  gh pr create --repo "$repo" --base main --head apbm-003 --title 'APBM-003: Target One implementation and accepted closeout' --body-file "$closeout/PR_BODY.md"
  pr=$(gh pr list --repo "$repo" --base main --head apbm-003 --state open --json number --jq '.[0].number // empty')
fi
[[ -n $pr ]] || stop 'No PR found after creation; inspect GitHub before retrying.'
printf 'pr=%q\n' "$pr" >> /tmp/apbm003-git-identities.sh
gh pr view "$pr" --repo "$repo" --json url,headRefOid,reviewDecision,mergeStateStatus
review 'STOP for an independent approving PR review and resolved threads. Wait here; do not bypass protection. Review current CI/status in GitHub.'
[[ $(gh pr view "$pr" --repo "$repo" --json headRefOid --jq .headRefOid) == "$integration_head" ]] || stop 'PR HEAD changed; re-review the new identity.'
[[ $(gh pr view "$pr" --repo "$repo" --json reviewDecision --jq .reviewDecision) == APPROVED ]] || stop 'Required approving review absent; use RESUME.md after approval.'
gh pr merge "$pr" --repo "$repo" --merge --match-head-commit "$integration_head"
[[ $(gh pr view "$pr" --repo "$repo" --json state --jq .state) == MERGED ]] || stop 'PR not merged; inspect remaining protected-branch requirements.'
# Step 6: sync local main in another worktree; never discard the original dirty checkout.
git fetch origin refs/heads/main:refs/remotes/origin/main
git worktree add "$main_dir" main
cd "$main_dir"
git merge --ff-only origin/main
printf 'APBM-004 starting main revision: '
git rev-parse HEAD
git status --short
# Keep all branches/worktrees and private testing materials. No branch deletion/deployment.
```

## Architect return prompt

Return acceptance or exact required corrections to Cody. Ask Cody to incorporate the review, recheck current identities, and print the final sequential copy-paste Git commands visibly for Tony. Do not require renewed Friday/Claudy certification or cleanup acceptance. Identify any required GitHub reviewer action separately from acceptance of this file.
