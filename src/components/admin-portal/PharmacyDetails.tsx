"use client";
// Manual QA 19 Nov 2026 (R6): real Pharmacy settings — a pharmacy selector for people who manage several, and the details
// actually stored for the selected one. Read-only: editing pharmacy details awaits an approved policy (NPI is identity and
// stays read-only), so there is no save control and nothing claims to change data.
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { formatAddress, loadStoreProfile, type StoreProfileResult } from "@/services/storeProfile";
import type { OwnedStore } from "@/types/adminDemo";

const NOT_PROVIDED = "Not provided";

export default function PharmacyDetails({ stores }: { stores: OwnedStore[] }) {
  const [selected, setSelected] = useState(stores[0]?.storeId ?? "");
  const [data, setData] = useState<StoreProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setLoading(true); setError(null);
    loadStoreProfile(selected)
      .then((r) => { if (!cancelled) { setData(r); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : "Pharmacy details unavailable."); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selected, retry]);

  const p = data?.profile;
  const detail = (v: string | null | undefined) => (data?.detailsAvailable ? (v && v.trim() ? v : NOT_PROVIDED) : "Unavailable until the database update is applied");
  const rows: { label: string; value: string; note?: string; testId: string }[] = p ? [
    { label: "Pharmacy name", value: p.name, testId: "pd-name" },
    { label: "NPI", value: p.npi || NOT_PROVIDED, note: "Read-only identifier", testId: "pd-npi" },
    { label: "NCPDP", value: p.ncpdp || NOT_PROVIDED, testId: "pd-ncpdp" },
    { label: "Address", value: detail(data?.detailsAvailable ? formatAddress(p) : null), testId: "pd-address" },
    { label: "Phone", value: detail(p.phone), testId: "pd-phone" },
    { label: "Pharmacy software", value: detail(p.pharmacy_software_system), testId: "pd-software" },
  ] : [];

  return (
    <div className="space-y-5">
      {stores.length > 1 ? (
        <div className="space-y-1">
          <Label htmlFor="pd-store">Pharmacy</Label>
          <select id="pd-store" className="flex h-10 w-full border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selected} onChange={(e) => setSelected(e.target.value)} data-testid="pd-store">
            {stores.map((s) => <option key={s.storeId} value={s.storeId}>{s.name}</option>)}
          </select>
        </div>
      ) : null}
      {error ? (
        <div className="flex items-center gap-3 text-sm text-destructive" role="alert"><span>{error}</span><button type="button" className="underline" onClick={() => setRetry((r) => r + 1)}>Retry</button></div>
      ) : loading || !p ? (
        <div className="space-y-3" aria-busy="true" data-testid="pd-loading">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-muted animate-pulse" />)}</div>
      ) : (
        <section aria-labelledby="pd-title" className="border border-border bg-card p-4 sm:p-5">
          <h2 id="pd-title" className="text-lg font-semibold text-foreground">{p.name}</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.label} className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{r.label}</dt>
                <dd className="break-words text-sm text-foreground" data-testid={r.testId}>{r.value}</dd>
                {r.note ? <p className="text-xs text-muted-foreground">{r.note}</p> : null}
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground" role="note">
            These details are read-only here. Editing pharmacy details is pending approval; to correct something now, contact support.
          </p>
        </section>
      )}
    </div>
  );
}
