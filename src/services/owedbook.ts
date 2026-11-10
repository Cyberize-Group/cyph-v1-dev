import type {
  OwedBookFilters,
  OwedBookKpis,
  OwedBookPage,
  OwedBookRow,
  OwedBookSummaryRow,
  OwedTab,
} from "@/types/OwedBook";
import { isDemoMode, readRpc, requireStore, unavailableMessage, type RpcClient } from "./tenantScope";
const fixtures = async () => (await import("@/mocks/owedbook")).owedBookFixtures;

export interface OwedBookService {
  /**
   * KPI tile values for the current filter set.
   * BACKEND_SWAP_NOTES (Phase 3): mock aggregates fixtures; real impl aggregates
   * user_data joined with reference tables, scoped by RLS to the caller's business_id(s).
   */
  getKpis(filters: OwedBookFilters): Promise<OwedBookKpis>;

  /**
   * Paginated ledger rows for a given tab + filter set.
   * BACKEND_SWAP_NOTES (Phase 3): mock filters/paginates fixtures in-memory;
   * real impl queries user_data with WHERE/ORDER/LIMIT, RLS-scoped.
   */
  getRows(tab: OwedTab, filters: OwedBookFilters, page: number): Promise<OwedBookPage>;

  /**
   * Summary-tab aggregate (PBM -> commercial/federal dollars).
   * BACKEND_SWAP_NOTES (Phase 3): mock aggregates fixtures; real impl GROUP BY pbm.
   */
  getSummary(filters: OwedBookFilters): Promise<OwedBookSummaryRow[]>;

  /**
   * Distinct PBM names for the MultiSelect filter.
   * BACKEND_SWAP_NOTES (Phase 3): mock returns the fixture PBM list; real impl
   * SELECT DISTINCT pbm FROM user_data (RLS-scoped).
   */
  getPbmOptions(): Promise<string[]>;

  /**
   * Upload a claims file. UI-FUNCTIONAL MOCK (Phase 2): fakes success after a
   * short delay — it does NOT read, parse, send, or store the file. Explicit
   * boundary: real CSV/XLSX ingest is Phase 5. BACKEND_SWAP_NOTES (Phase 5):
   * stream `file` to the ingest endpoint here; the signature does not change.
   */
  uploadData(file: File): Promise<void>;

  /**
   * Re-pull the latest claims/reference data. UI-FUNCTIONAL MOCK (Phase 2):
   * fakes success after a short delay — no real fetch/ingest. BACKEND_SWAP_NOTES
   * (Phase 5): pull fresh data here; the signature does not change.
   */
  refreshData(): Promise<void>;
}

const DEFAULT_LIMIT = 25;
const round2 = (n: number) => +n.toFixed(2);

// Date range + PBM multiselect + the generic status "Filter" dropdown, applied
// in the service (NOT the component). Real impl pushes these into the SQL WHERE.
const applyFilters = (rows: OwedBookRow[], f: OwedBookFilters): OwedBookRow[] =>
  rows.filter((r) => {
    if (f.from && r.date < f.from) return false;
    if (f.to && r.date > f.to) return false;
    if (f.pbms.length > 0 && (!r.pbm || !f.pbms.includes(r.pbm))) return false;
    if (f.filter && r.status !== f.filter) return false;
    return true;
  });

const mockOwedBookService: OwedBookService = {
  async getKpis(filters) {
    const owedBookFixtures = await fixtures();
    const rows = applyFilters(owedBookFixtures, filters);
    const underpaid = round2(
      rows.filter((r) => r.owed > 0).reduce((s, r) => s + r.owed, 0)
    );
    return {
      commercial_underpaid: underpaid,
      commercial_scripts: rows.length,
      updated_difference: round2(
        rows.reduce((s, r) => s + (r.updated_difference ?? 0), 0)
      ),
      owed: underpaid,
    };
  },

  async getRows(tab, filters, page) {
    const owedBookFixtures = await fixtures();
    let rows = applyFilters(owedBookFixtures, filters);
    // Per-tab dataset (UI_SPEC §5.3). Commercial = all; Updated = engineered
    // new-paid subset; Federal = rows that carry real federal data.
    if (tab === "updated_commercial_payments") {
      rows = rows.filter((r) => r.new_paid !== null);
    } else if (tab === "federal_dollars") {
      rows = rows.filter((r) => r.federal_expected !== null);
    }

    const total = rows.length;
    const pageCount = Math.max(1, Math.ceil(total / DEFAULT_LIMIT));
    const safePage = Math.min(Math.max(1, page), pageCount);
    const start = (safePage - 1) * DEFAULT_LIMIT;

    return {
      rows: rows.slice(start, start + DEFAULT_LIMIT),
      page: safePage,
      pageCount,
      limit: DEFAULT_LIMIT,
      total,
    };
  },

  async getSummary(filters) {
    const owedBookFixtures = await fixtures();
    const rows = applyFilters(owedBookFixtures, filters);
    const byPbm = new Map<string, OwedBookSummaryRow>();
    for (const r of rows) {
      if (!r.pbm) continue;
      const entry =
        byPbm.get(r.pbm) ?? { pbm: r.pbm, commercial_dollars: 0, federal_dollars: 0 };
      entry.commercial_dollars += r.owed > 0 ? r.owed : 0;
      entry.federal_dollars += r.federal_diff && r.federal_diff > 0 ? r.federal_diff : 0;
      byPbm.set(r.pbm, entry);
    }
    return Array.from(byPbm.values())
      .map((e) => ({
        ...e,
        commercial_dollars: round2(e.commercial_dollars),
        federal_dollars: round2(e.federal_dollars),
      }))
      .sort((a, b) => b.commercial_dollars - a.commercial_dollars);
  },

  async getPbmOptions() {
    const owedBookFixtures = await fixtures();
    return Array.from(
      new Set(owedBookFixtures.map((r) => r.pbm).filter((p): p is string => Boolean(p)))
    ).sort();
  },

  // UI-functional mock — the file is intentionally NEVER read/parsed/sent/stored.
  async uploadData(_file: File): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
  },

  // UI-functional mock — no real re-pull happens.
  async refreshData(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

// RPCs retain the server's tenant fence and audit exactly once per successful call.
export function createOwedBookService(businessId?: string, client?: RpcClient): OwedBookService {
  const args = (f: OwedBookFilters) => ({ p_business_id: requireStore(businessId), p_from: f.from || null, p_to: f.to || null, p_pbms: f.pbms, p_filter: f.filter || null });
  return {
    async getKpis(filters) {
      const rows = await readRpc<OwedBookKpis[]>("owedbook_kpis", args(filters), client);
      if (rows.length !== 1 || ["commercial_underpaid", "commercial_scripts", "updated_difference", "owed"].some(key => rows[0][key as keyof OwedBookKpis] == null || !Number.isFinite(Number(rows[0][key as keyof OwedBookKpis])))) throw new Error("KPI data unavailable. Please retry.");
      return { commercial_underpaid: Number(rows[0].commercial_underpaid), commercial_scripts: Number(rows[0].commercial_scripts), updated_difference: Number(rows[0].updated_difference), owed: Number(rows[0].owed) };
    },
    getRows: (tab, filters, page) => readRpc<OwedBookPage>("owedbook_rows", { ...args(filters), p_tab: tab, p_page: page, p_limit: 25 }, client),
    getSummary: filters => readRpc<OwedBookSummaryRow[]>("owedbook_summary", args(filters), client),
    getPbmOptions: () => readRpc<string[]>("owedbook_pbm_options", { p_business_id: requireStore(businessId) }, client),
    async uploadData() { throw new Error(unavailableMessage); },
    async refreshData() { throw new Error("Use the scoped screen refresh to reload KPIs, filters and rows."); },
  };
}
// Explicit demo kill switch; never fall back to mock data after a live error.
export const owedBookService: OwedBookService = Object.fromEntries(
  Object.keys(mockOwedBookService).map(key => [key, (...args: unknown[]) => {
    const service = isDemoMode() ? mockOwedBookService : createOwedBookService();
    return (service[key as keyof OwedBookService] as (...values: unknown[]) => unknown)(...args);
  }])
) as unknown as OwedBookService;
