"use client";

// APBM007A — billing state banner for the selected store. The state comes from the server; this component only
// words it. The owner gets a link to the billing portal (handoff, no token in the link); others are told who can fix it.
import { useEffect, useState } from "react";
import { peerOrigin } from "@/lib/appIdentity";
import { isDemoMode } from "@/services/tenantScope";
import { useOwedBook } from "./OwedBookContext";

type Access = { state: "active" | "grace" | "read_only" | "ended" | "none" | "past_due_reminder"; readOnly: boolean; isOwner: boolean };

const COPY: Record<Exclude<Access["state"], "active">, { title: string; body: string; tone: "warning" | "destructive" }> = {
  grace: { title: "A payment didn't go through", body: "Access continues for now. Billing needs to be updated to avoid read-only access.", tone: "warning" },
  past_due_reminder: { title: "A payment is past due", body: "Billing needs attention for this account.", tone: "warning" },
  read_only: { title: "This store is read-only", body: "Billing needs to be fixed before anything can be changed. Your data is safe.", tone: "destructive" },
  ended: { title: "This subscription has ended", body: "Your data is kept and can be viewed, but nothing can be changed.", tone: "destructive" },
  none: { title: "No active subscription", body: "This store has no paid access.", tone: "destructive" },
};

export function AccessBanner() {
  const { storeId } = useOwedBook();
  // The answer is kept with the store it belongs to, so a store switch never shows the previous store's state.
  const [result, setResult] = useState<{ storeId: string; access: Access | null } | null>(null);

  useEffect(() => {
    if (isDemoMode() || !storeId || typeof fetch !== "function") return;   // nothing to ask: no banner
    let cancelled = false;
    fetch(`/api/access-state?business_id=${encodeURIComponent(storeId)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => { if (!cancelled) setResult({ storeId, access: body?.access ?? null }); })
      .catch(() => { if (!cancelled) setResult({ storeId, access: null }); });   // a failed check shows no banner; reads stay governed by the server
    return () => { cancelled = true; };
  }, [storeId]);

  const access = result && result.storeId === storeId ? result.access : null;
  if (!access || access.state === "active") return null;
  const copy = COPY[access.state];
  return (
    <div
      role={copy.tone === "destructive" ? "alert" : "status"}
      data-testid="access-banner"
      data-state={access.state}
      className={`border-l-[3px] p-4 ${copy.tone === "destructive" ? "border-destructive bg-destructive/10" : "border-yellow-500 bg-yellow-500/10"}`}
    >
      <p className="font-semibold">{copy.title}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {copy.body}{" "}
        {access.isOwner ? (
          <a className="underline" href={`${peerOrigin()}/api/handoff/start?return=${encodeURIComponent("/billing")}`} data-testid="access-banner-billing">
            Open billing
          </a>
        ) : (
          "Billing is managed by the account owner."
        )}
      </p>
    </div>
  );
}
