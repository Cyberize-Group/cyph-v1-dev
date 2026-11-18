"use client";
// APBM-007B — recipient invitations. GET lists only; Accept/Decline are explicit same-origin POSTs. A signed-out visitor
// is sent to sign in and comes back here; a different signed-in person sees nothing addressed to them and must switch.
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Invitation = { id: string; store_name: string; role: "admin" | "member"; expires_at: string };
type State = { kind: "loading" } | { kind: "signed_out" } | { kind: "error"; message: string } | { kind: "ready"; items: Invitation[] };

export default function InvitationsScreen() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/invitations/mine", { cache: "no-store" });
    if (res.status === 401) return setState({ kind: "signed_out" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return setState({ kind: "error", message: body?.error?.message ?? "Invitations are unavailable right now." });
    setState({ kind: "ready", items: body.data ?? [] });
  }, []);
  useEffect(() => { void load(); }, [load]);

  const act = async (id: string, action: "accept" | "decline") => {
    setBusy(id); setNotice(null);
    const res = await fetch(`/api/invitations/${id}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const body = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) { setNotice(body?.error?.message ?? "That did not work. Try again."); await load(); return; }
    if (action === "accept") { window.location.assign("/owedbook"); return; }
    setNotice("Invitation declined."); await load();
  };

  return (
    <section aria-labelledby="inv-title">
      <h1 id="inv-title" className="text-2xl font-semibold text-foreground">Your invitations</h1>
      {notice && <p role="status" className="mt-4 text-sm text-foreground">{notice}</p>}
      {state.kind === "loading" && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {state.kind === "signed_out" && (
        <p className="mt-6 text-sm text-foreground">
          Sign in with the email address the invitation was sent to. <Link className="underline" href="/auth">Sign in</Link>
        </p>
      )}
      {state.kind === "error" && <p role="alert" className="mt-6 text-sm text-destructive">{state.message}</p>}
      {state.kind === "ready" && state.items.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          There are no pending invitations for the address you are signed in with. If the invitation was sent to a different
          address, sign out and sign in with that one.
        </p>
      )}
      {state.kind === "ready" && state.items.length > 0 && (
        <ul className="mt-6 space-y-4">
          {state.items.map((i) => (
            <li key={i.id} className="rounded-md border border-border bg-card p-4">
              <p className="font-medium text-foreground">{i.store_name}</p>
              <p className="text-sm text-muted-foreground">
                Role: {i.role === "admin" ? "Store admin" : "Member"} · Expires {new Date(i.expires_at).toLocaleString()}
              </p>
              <div className="mt-3 flex gap-3">
                <Button type="button" disabled={busy !== null} onClick={() => act(i.id, "accept")}>Accept invitation</Button>
                <Button type="button" variant="outline" disabled={busy !== null} onClick={() => act(i.id, "decline")}>Decline</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
