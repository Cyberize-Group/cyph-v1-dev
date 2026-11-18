"use client";
// APBM-007B — live staff management for one store (owner: members and admin replacement; store admin: members only).
// Every decision is made by the server (SQL re-derives authority from the session); this panel only shows outcomes.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeMemberService } from "@/services/adminDemo";
import type { StoreMember } from "@/types/adminDemo";

type Invite = { id: string; email: string; role: "admin" | "member"; status: string; expires_at: string; attempts_remaining: number; former_admin_disposition: string | null };
const post = async (url: string, body: unknown = {}) => {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, data: json?.data, message: json?.error?.message as string | undefined };
};
const deliveryText = (d: string | undefined) =>
  d === "sent" ? "Invitation email sent." : d === "blocked" ? "Invitation saved. Email delivery is disabled for this address in this environment." : "Invitation saved. The email could not be sent; use Resend.";

// false on the server and while hydrating, true once React owns the page (no effect, no extra render).
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

export default function LiveStaffPanel({ storeId, canAppointAdmin }: { storeId: string; canAppointAdmin: boolean }) {
  const [members, setMembers] = useState<StoreMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  // F-Q2-002: the email field is uncontrolled. Text typed while the page is still hydrating (seen in WebKit) is never
  // overwritten by React, and Send reads the field itself, so the button cannot be stuck behind a missed change event.
  const emailRef = useRef<HTMLInputElement>(null);
  const hydrated = useHydrated();
  const [role, setRole] = useState<"member" | "admin">("member");
  const [disposition, setDisposition] = useState<"member" | "remove">("member");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [m, i] = await Promise.all([
      storeMemberService.listMembers(storeId).catch(() => []),
      fetch(`/api/stores/${storeId}/invitations`, { cache: "no-store" }).then((r) => r.json()).then((j) => (j.data ?? []) as Invite[]).catch(() => []),
    ]);
    setMembers(m); setInvites(i);
  }, [storeId]);
  useEffect(() => { void load(); }, [load]);

  const run = async (fn: () => Promise<{ ok: boolean; data?: { delivery?: string }; message?: string }>, success: (d?: { delivery?: string }) => string) => {
    setBusy(true); setMessage(null);
    let r: Awaited<ReturnType<typeof fn>>;
    try { r = await fn(); } catch { r = { ok: false, message: "That did not work. Check your connection and try again." }; }
    finally { setBusy(false); }
    setMessage(r.ok ? success(r.data) : r.message ?? "That did not work.");
    await load();
  };

  return (
    <div className="space-y-8">
      {message && <p role="status" className="text-sm text-foreground">{message}</p>}
      <form
        className="space-y-3 rounded-md border border-border bg-card p-4"
        onSubmit={(e) => { e.preventDefault(); const email = emailRef.current?.value.trim() ?? ""; if (!email) return; void run(() => post(`/api/stores/${storeId}/invitations`, role === "admin" ? { email, role, formerAdminDisposition: disposition } : { email, role }), (d) => deliveryText(d?.delivery)); }}
      >
        <h2 className="font-semibold text-foreground">Invite someone</h2>
        <div className="space-y-1">
          <Label htmlFor="invite-email">Email address</Label>
          <Input id="invite-email" ref={emailRef} type="email" required defaultValue="" autoComplete="off" />
        </div>
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium text-foreground">Role</legend>
          <label className="mr-4 text-sm text-foreground"><input type="radio" name="role" checked={role === "member"} onChange={() => setRole("member")} /> Member</label>
          {canAppointAdmin && <label className="text-sm text-foreground"><input type="radio" name="role" checked={role === "admin"} onChange={() => setRole("admin")} /> Store admin (replaces the current admin when accepted)</label>}
        </fieldset>
        {role === "admin" && (
          <fieldset className="space-y-1">
            <legend className="text-sm font-medium text-foreground">When accepted, the current admin should</legend>
            <label className="mr-4 text-sm text-foreground"><input type="radio" name="disp" checked={disposition === "member"} onChange={() => setDisposition("member")} /> Stay as a member</label>
            <label className="text-sm text-foreground"><input type="radio" name="disp" checked={disposition === "remove"} onChange={() => setDisposition("remove")} /> Be removed from this store</label>
          </fieldset>
        )}
        {/* Disabled until hydrated, so a click can never fall through to a native form submission. */}
        <Button type="submit" disabled={busy || !hydrated}>Send invitation</Button>
      </form>

      <section aria-labelledby="pending-title">
        <h2 id="pending-title" className="font-semibold text-foreground">Invitations</h2>
        {invites.length === 0 ? <p className="text-sm text-muted-foreground">No invitations.</p> : (
          <ul className="mt-2 divide-y divide-border">
            {invites.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="text-foreground">{i.email} · {i.role === "admin" ? "Store admin" : "Member"} · {i.status}{i.status === "pending" ? ` · ${i.attempts_remaining} sends left` : ""}</span>
                {i.status === "pending" && (
                  <span className="flex gap-2">
                    <Button type="button" variant="outline" disabled={busy} onClick={() => run(() => post(`/api/invitations/${i.id}/resend`), (d) => deliveryText(d?.delivery))}>Resend</Button>
                    <Button type="button" variant="outline" disabled={busy} onClick={() => run(() => post(`/api/invitations/${i.id}/revoke`), () => "Invitation revoked.")}>Revoke</Button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="members-title">
        <h2 id="members-title" className="font-semibold text-foreground">People with access</h2>
        <ul className="mt-2 divide-y divide-border">
          {members.map((m) => (
            <li key={m.memberId} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span className="text-foreground">{m.name || m.email} · {m.role === "admin" ? "Store admin" : "Member"}</span>
              {m.role !== "admin" && (
                <Button type="button" variant="outline" disabled={busy} onClick={() => run(() => post(`/api/stores/${storeId}/members/${m.memberId}/remove`), () => "Access removed.")}>Remove access</Button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
