"use client";
// Manual QA 19 Nov 2026 (R8): readable audit log — who did what, to which person or pharmacy, and when (in the viewer's
// timezone, labelled). Meaningful changes first: view events and internal processing steps are hidden unless asked for.
// A category filter and "Load older" make older actions reachable beyond the first page.
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Loader2, ScrollText } from "lucide-react";
import ScreenHeader from "@/components/admin-portal/ScreenHeader";
import DataTable, { type ColumnDef } from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { actorLabel, describeAudit, formatLocalTime, type AuditCategory } from "@/components/admin-portal/auditDescribe";
import { loadAuditPage, type AuditRow } from "@/services/auditLog";

type Row = { id: string; time: string; who: string; what: string; place: string; details: string; category: AuditCategory };
const COLUMNS: ColumnDef<Row>[] = [
  { key: "time", label: "When" },
  { key: "what", label: "What happened", hero: true },
  { key: "who", label: "Who" },
  { key: "place", label: "Pharmacy" },
  { key: "details", label: "Details" },
];
const FILTERS: { value: "all" | AuditCategory; label: string }[] = [
  { value: "all", label: "All changes" }, { value: "people", label: "People and invitations" }, { value: "stores", label: "Pharmacies" }, { value: "billing", label: "Billing" },
];

const noSubscribe = () => () => {};

export default function LiveAuditLog() {
  const [raw, setRaw] = useState<AuditRow[] | null>(null);
  const [cursors, setCursors] = useState<Record<string, number | null>>({});
  const [detailed, setDetailed] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | AuditCategory>("all");
  const [loading, setLoading] = useState(true);
  const [older, setOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The viewer's timezone, known only in the browser (null during server render and hydration).
  const zone = useSyncExternalStore(noSubscribe, () => Intl.DateTimeFormat().resolvedOptions().timeZone || null, () => null);
  const [reload, setReload] = useState(0);
  // The signed-in person's id, read once from their own session (manual QA 20 Nov 2026: owner-aware handover wording).
  const viewer = useRef<Promise<string | null> | null>(null);
  const viewerId = useCallback(() => (viewer.current ??= import("@/utils/supabase/client")
    .then((m) => m.createClient().auth.getUser()).then((r) => r.data.user?.id ?? null).catch(() => null)), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    viewerId().then((id) => loadAuditPage({ includeReads: showAll, viewerId: id }))
      .then((p) => { if (!cancelled) { setRaw(p.rows); setCursors(p.cursors); setDetailed(p.detailed); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : "Failed to load audit log"); setLoading(false); } });
    return () => { cancelled = true; };
  }, [showAll, reload, viewerId]);

  const loadOlder = useCallback(async () => {
    setOlder(true);
    try {
      const p = await loadAuditPage({ includeReads: showAll, cursors, viewerId: await viewerId() });
      setRaw((prev) => [...(prev ?? []), ...p.rows.filter((r) => !(prev ?? []).some((x) => x.id === r.id))]);
      setCursors((c) => ({ ...c, ...p.cursors }));
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to load older events"); }
    finally { setOlder(false); }
  }, [cursors, showAll, viewerId]);

  const rows = useMemo<Row[]>(() => (raw ?? []).map((r) => {
    const d = describeAudit(r);
    return { id: String(r.id), time: formatLocalTime(r.occurred_at), who: actorLabel(r), what: d.what, place: r.place, details: d.details, category: d.category };
  }).filter((r) => (showAll || (r.category !== "views" && r.category !== "system")) && (filter === "all" || r.category === filter)), [raw, showAll, filter]);
  const more = Object.values(cursors).some((c) => c != null);

  return (
    <div>
      <ScreenHeader title="Audit log" subtitle={`Changes across the pharmacies you manage, newest first.${zone ? ` Times are shown in your timezone (${zone}).` : ""}`} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <Label htmlFor="audit-filter">Show</Label>
          <select id="audit-filter" className="flex min-h-11 rounded-md border border-input bg-card px-2.5 text-[15px] text-foreground" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            {FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <label className="flex min-h-10 items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} data-testid="audit-show-all" /> Include views and system steps
        </label>
      </div>
      {!detailed && <p className="mt-2 text-xs text-muted-foreground" role="note">Detailed descriptions need the latest database update; some events show generic wording.</p>}
      <div className="mt-4">
        {error ? (
          <div className="pb-notice pb-tone-destructive text-sm" role="alert">{error} <button className="font-semibold underline underline-offset-2" onClick={() => setReload((r) => r + 1)}>Retry audit</button></div>
        ) : loading ? (
          <div className="space-y-2" data-testid="audit-skeleton" aria-busy="true">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 rounded-md bg-disabled animate-pulse" />)}</div>
        ) : (<>
          <DataTable<Row> columns={COLUMNS} rows={rows} getRowKey={(r) => r.id}
            emptyState={<EmptyState icon={<ScrollText className="h-10 w-10" />} headline="No matching activity" subcopy={more ? "Load older events to look further back." : "Changes across your pharmacies will show up here."} />} />
          {more && (
            <div className="mt-4">
              <Button type="button" variant="outline" disabled={older} aria-busy={older} onClick={() => void loadOlder()}>
                {older ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Loading older events…</> : "Load older events"}
              </Button>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}
