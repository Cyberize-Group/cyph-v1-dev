"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import StoreSelector from "./StoreSelector";
import type {
  OwedBookFilters,
  OwedBookKpis,
  OwedBookPage,
  OwedBookRow,
  OwedBookSummaryRow,
  OwedTab,
} from "@/types/OwedBook";
import KpiTiles from "./KpiTiles";
import SummaryUnattributedNote from "./SummaryUnattributedNote";
import { useOwedBook, countActiveFilters } from "./OwedBookContext";
import {
  COMMERCIAL_COLUMNS,
  FEDERAL_COLUMNS,
  SUMMARY_COLUMNS,
  UPDATED_COLUMNS,
} from "./columns";

const TABS: { value: OwedTab; label: string }[] = [
  { value: "commercial_dollars", label: "Commercial Dollars" },
  { value: "updated_commercial_payments", label: "Updated Payments" },
  { value: "federal_dollars", label: "Federal Dollars" },
  { value: "summary", label: "Summary" },
];

const columnsForTab = (tab: OwedTab) =>
  tab === "federal_dollars"
    ? FEDERAL_COLUMNS
    : tab === "updated_commercial_payments"
      ? UPDATED_COLUMNS
      : COMMERCIAL_COLUMNS;

const SkeletonRows = () => (
  <div className="flex flex-col gap-2" data-testid="owedbook-skeleton">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-10 bg-muted animate-pulse" />
    ))}
  </div>
);

// Main pane only (UI_SPEC v1.4 §A.1/§5.1). The filter rail lives in the left
// sidebar (AdminSidebar); this consumes the shared filter state via context.
const OwedBookScreen = () => {
  const { filters, clearFilters, service, scopeReady, scopeLoading, refreshTick, refresh, optionsError } = useOwedBook();
  const request = useMemo(() => ({}), [filters, service, refreshTick]);
  const activeFilterCount = countActiveFilters(filters);
  const [activeTab, setActiveTab] = useState<OwedTab>("commercial_dollars");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" }>();
  const [kpis, setKpis] = useState<OwedBookKpis | null>(null);
  const [pageData, setPageData] = useState<OwedBookPage | null>(null);
  const [summaryRows, setSummaryRows] = useState<OwedBookSummaryRow[]>([]);
  // RRM-002 AC-103: which `filters` reference each aggregate was resolved for.
  // The disclosure renders only when both tags === the current `filters`.
  const [kpiFilters, setKpiFilters] = useState<OwedBookFilters | null>(null);
  const [summaryFilters, setSummaryFilters] = useState<OwedBookFilters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpiRequest, setKpiRequest] = useState<object | null>(null);
  const [kpiError, setKpiError] = useState<string | null>(null);
  const dataRequest = useMemo(() => ({}), [request, activeTab, page]);
  const [resolvedData, setResolvedData] = useState<object | null>(null);
  const kpiReady = scopeReady && kpiRequest === request;
  const dataReady = scopeReady && resolvedData === dataRequest;

  const isSummary = activeTab === "summary";

  // A new filter set resets to the first page.
  useEffect(() => {
    setPage(1);
  }, [filters, service]);

  // KPI tiles react to the filter set.
  useEffect(() => {
    if (!scopeReady) return;
    let cancelled = false;
    service
      .getKpis(filters)
      .then((k) => {
        if (cancelled) return;
        setKpis(k);
        setKpiError(null);
        setKpiFilters(filters);
        setKpiRequest(request);
      })
      .catch(() => {
        if (cancelled) return;
        setKpis(null);
        setKpiError("KPIs unavailable. Please retry.");
        setKpiRequest(request);
        setKpiFilters(null);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, service, request, scopeReady]);

  // Ledger rows / summary react to tab + filters + page.
  useEffect(() => {
    if (!scopeReady) return;
    let cancelled = false;
    (async () => {
      try {
        if (activeTab === "summary") {
          const s = await service.getSummary(filters);
          if (!cancelled) {
            setError(null);
            setSummaryRows(s);
            setPageData(null);
            setSummaryFilters(filters);
          }
        } else {
          const p = await service.getRows(activeTab, filters, page);
          if (!cancelled) { setError(null); setPageData(p); }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        if (!cancelled) { setLoading(false); setResolvedData(dataRequest); }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, filters, page, service, request, dataRequest, scopeReady]);

  const handleSort = useCallback((key: string) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }, []);

  // Client-side sort of the current page (server-side sort is a Phase-3 concern
  // — the service contract takes no sort param yet).
  const rows = pageData?.rows ?? [];
  const sortedRows = sort
    ? [...rows].sort((a, b) => {
        const av = a[sort.key as keyof OwedBookRow];
        const bv = b[sort.key as keyof OwedBookRow];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
        return sort.direction === "asc" ? cmp : -cmp;
      })
    : rows;

  const emptyState = (
    <EmptyState
      icon={<Inbox className="w-10 h-10 text-muted-foreground" />}
      headline="No results"
      subcopy="No rows match the current filters. Adjust or clear them to see data."
      action={{ label: "Clear filters", onClick: clearFilters }}
    />
  );

  return (
    <div className="flex flex-col gap-6 min-w-0 p-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Dashboard</p>
        <h1 className="text-3xl font-bold mt-1">OwedBook</h1>
        <p className="text-muted-foreground mt-1">
          Ledger-level clarity on every dollar you&apos;re owed.
        </p>
      </header>

      <StoreSelector />
      {optionsError && <p role="alert">{optionsError}</p>}

      {/* At-a-glance active-filter badge (UI_SPEC §5.4) — reflects the APPLIED set. */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-3" data-testid="active-filters">
          <span className="inline-flex items-center bg-chart-5 text-white px-2.5 py-1 text-xs font-semibold">
            {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} active
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="text-primary text-xs underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {!scopeReady && !scopeLoading ? <p role="status">Select a permitted store to view KPIs.</p> : kpiReady && kpis ? <KpiTiles kpis={kpis} /> : kpiReady && kpiError ? <div role="alert">{kpiError} <button onClick={refresh}>Retry KPIs</button></div> : <div aria-busy="true" aria-label="Loading KPIs" className="grid grid-cols-2 gap-4">{["Commercial Underpaid","Scripts","Updated Difference","Owed"].map(label=><div key={label}>{label}<p>—</p></div>)}</div>}

      {!isSummary && dataReady && !error && pageData && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Page {pageData.page} of {Math.max(pageData.pageCount, 1)}
          </span>
          <button
            type="button"
            disabled={pageData.page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="disabled:opacity-40 hover:text-foreground"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={pageData.page >= pageData.pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40 hover:text-foreground"
          >
            Next
          </button>
          <span>
            Limit {pageData.limit} · Total {pageData.total}
          </span>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as OwedTab);
          setPage(1);
        }}
      >
        <TabsList className="max-w-full justify-start overflow-x-auto">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="shrink-0">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activeTab === "federal_dollars" && <p className="text-sm text-muted-foreground">Federal reimbursement data is unavailable in this release.</p>}
      <div>
        {!scopeReady && !scopeLoading ? <p role="status">No store data is available until a permitted store is selected.</p> : dataReady && error ? (
          <div className="flex items-center gap-3 text-sm text-destructive">
            <span>{error}</span>
            <button
              type="button"
              onClick={refresh}
              className="underline"
            >
              Retry
            </button>
          </div>
        ) : loading || !dataReady ? (
          <SkeletonRows />
        ) : isSummary ? (
          <DataTable<OwedBookSummaryRow>
            columns={SUMMARY_COLUMNS}
            rows={summaryRows}
            emptyState={emptyState}
            getRowKey={(r) => r.pbm}
          />
        ) : (
          <DataTable<OwedBookRow>
            columns={columnsForTab(activeTab)}
            rows={sortedRows}
            sort={sort}
            onSort={handleSort}
            emptyState={emptyState}
            getRowKey={(r) => r.id}
          />
        )}
      </div>

      {/* RRM-002 D3 disclosure — Summary tab only, same-filters pair only (AC-101–104). */}
      {isSummary && dataReady && kpiReady && kpis && !loading && !error && kpiFilters === filters && summaryFilters === filters && (
        <SummaryUnattributedNote underpaid={kpis.commercial_underpaid} summary={summaryRows} />
      )}
    </div>
  );
};

export default OwedBookScreen;
