"use client";
// APBM-007B — live staff management for one store (owner: members and admin replacement; store admin: members only).
// Every decision is made by the server (SQL re-derives authority from the session); this panel only shows outcomes.
//
// Manual QA 19 Nov 2026 (R2/R4/R5): each action shows a spinner and says what it is doing; removing access needs an
// explicit confirmation naming the person and the pharmacy; the account owner is labelled Owner (from the server's
// is_owner flag, 0071), never offered for removal, and never described as demoted. Appointing a store admin when the owner
// holds that role delegates store management: the owner keeps full owner access (server-enforced, 0071).
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { storeMemberService } from "@/services/adminDemo";
import type { StoreMember } from "@/types/adminDemo";
import { memberRoleLabel } from "@/components/admin-portal/roleLabel";

type Invite = { id: string; email: string; role: "admin" | "member"; status: string; expires_at: string; attempts_remaining: number; former_admin_disposition: string | null };
type Busy = { kind: "invite" | "resend" | "revoke" | "remove"; id?: string } | null;
const post = async (url: string, body: unknown = {}) => {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, data: json?.data, message: json?.error?.message as string | undefined };
};
const deliveryText = (d: string | undefined) =>
  d === "sent" ? "Invitation email sent." : d === "blocked" ? "Invitation saved. Email delivery is disabled for this address in this environment." : "Invitation saved. The email could not be sent; use Resend.";
const who = (m: { name: string; email: string }) => m.name || m.email;

// false on the server and while hydrating, true once React owns the page (no effect, no extra render).
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

function Spin({ on, text, children }: { on: boolean; text: string; children: React.ReactNode }) {
  return on ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />{text}</> : <>{children}</>;
}

export default function LiveStaffPanel({ storeId, storeName, canAppointAdmin }: { storeId: string; storeName?: string; canAppointAdmin: boolean }) {
  const [members, setMembers] = useState<StoreMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  // F-Q2-002: the email field is uncontrolled. Text typed while the page is still hydrating (seen in WebKit) is never
  // overwritten by React, and Send reads the field itself, so the button cannot be stuck behind a missed change event.
  const emailRef = useRef<HTMLInputElement>(null);
  const hydrated = useHydrated();
  const [role, setRole] = useState<"member" | "admin">("member");
  const [disposition, setDisposition] = useState<"member" | "remove">("member");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [confirmRemove, setConfirmRemove] = useState<StoreMember | null>(null);
  const pharmacy = storeName || "this pharmacy";

  const load = useCallback(async () => {
    const [m, i] = await Promise.all([
      storeMemberService.listMembers(storeId).catch(() => []),
      fetch(`/api/stores/${storeId}/invitations`, { cache: "no-store" }).then((r) => r.json()).then((j) => (j.data ?? []) as Invite[]).catch(() => []),
    ]);
    setMembers(m); setInvites(i);
  }, [storeId]);
  useEffect(() => { void load(); }, [load]);

  const run = async (kind: NonNullable<Busy>, fn: () => Promise<{ ok: boolean; data?: { delivery?: string }; message?: string }>, success: (d?: { delivery?: string }) => string) => {
    if (busy) return false;
    setBusy(kind); setMessage(null);
    let r: Awaited<ReturnType<typeof fn>>;
    try { r = await fn(); } catch { r = { ok: false, message: "That did not work. Check your connection and try again." }; }
    finally { setBusy(null); }
    setMessage(r.ok ? success(r.data) : r.message ?? "That did not work.");
    await load();
    return r.ok;
  };

  const admin = members.find((m) => m.role === "admin");
  const adminIsOwner = !!admin?.isOwner;
  const sendAdmin = role === "admin";
  const working = busy !== null;
  const busyText = busy?.kind === "invite" ? "Sending invitation." : busy?.kind === "remove" ? "Removing access." : busy?.kind === "resend" ? "Resending invitation." : busy?.kind === "revoke" ? "Revoking invitation." : "";

  return (
    <div className="space-y-8">
      {message && <p role="status" className="text-sm text-foreground">{message}</p>}
      <p className="sr-only" aria-live="polite">{busyText}</p>
      <form
        className="space-y-3 pb-card p-4"
        onSubmit={(e) => {
          e.preventDefault(); const email = emailRef.current?.value.trim() ?? ""; if (!email) return;
          // When the owner holds the store admin role, the only allowed disposition is to keep the owner (server-enforced).
          const body = sendAdmin ? { email, role, formerAdminDisposition: adminIsOwner ? "member" : disposition } : { email, role };
          void run({ kind: "invite" }, () => post(`/api/stores/${storeId}/invitations`, body), (d) => deliveryText(d?.delivery));
        }}
      >
        <h2 className="pb-h2">Invite someone</h2>
        <div className="space-y-1">
          <Label htmlFor="invite-email">Email address</Label>
          <Input id="invite-email" ref={emailRef} type="email" required defaultValue="" autoComplete="off" />
        </div>
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium text-foreground">Role</legend>
          <label className="mr-4 inline-flex min-h-11 items-center gap-2 text-sm text-foreground"><input type="radio" name="role" checked={role === "member"} onChange={() => setRole("member")} /> Member</label>
          {canAppointAdmin && <label className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground"><input type="radio" name="role" checked={role === "admin"} onChange={() => setRole("admin")} /> Store admin</label>}
        </fieldset>
        {sendAdmin && (adminIsOwner ? (
          <p className="text-sm text-muted-foreground" data-testid="delegation-note">
            You manage {pharmacy} as the account owner. When this person accepts, they become its store admin and can manage its
            people. You stay the Owner with full access to every pharmacy on your account, and billing stays with you.
          </p>
        ) : (
          <fieldset className="space-y-1">
            <legend className="text-sm font-medium text-foreground">
              {admin ? `${who(admin)} is the current store admin. When the invitation is accepted, ${who(admin)} should` : "When accepted, the current store admin should"}
            </legend>
            <label className="mr-4 text-sm text-foreground"><input type="radio" name="disp" checked={disposition === "member"} onChange={() => setDisposition("member")} /> Stay as a member</label>
            <label className="text-sm text-foreground"><input type="radio" name="disp" checked={disposition === "remove"} onChange={() => setDisposition("remove")} /> Lose access to {pharmacy}</label>
          </fieldset>
        ))}
        {/* Disabled until hydrated, so a click can never fall through to a native form submission. */}
        <Button type="submit" disabled={working || !hydrated} aria-busy={busy?.kind === "invite"}>
          <Spin on={busy?.kind === "invite"} text="Sending invitation…">Send invitation</Spin>
        </Button>
      </form>

      <section aria-labelledby="pending-title" className="pb-card p-4">
        <h2 id="pending-title" className="pb-h2">Invitations</h2>
        {invites.length === 0 ? <p className="text-sm text-muted-foreground">No invitations.</p> : (
          <ul className="mt-2 divide-y divide-border">
            {invites.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="text-foreground">{i.email} · {i.role === "admin" ? "Store admin" : "Member"} · {i.status}{i.status === "pending" ? ` · ${i.attempts_remaining} sends left` : ""}</span>
                {i.status === "pending" && (
                  <span className="flex gap-2">
                    <Button type="button" variant="outline" disabled={working} aria-busy={busy?.kind === "resend" && busy.id === i.id} onClick={() => void run({ kind: "resend", id: i.id }, () => post(`/api/invitations/${i.id}/resend`), (d) => deliveryText(d?.delivery))}>
                      <Spin on={busy?.kind === "resend" && busy.id === i.id} text="Resending…">Resend</Spin>
                    </Button>
                    <Button type="button" variant="outline" disabled={working} aria-busy={busy?.kind === "revoke" && busy.id === i.id} onClick={() => void run({ kind: "revoke", id: i.id }, () => post(`/api/invitations/${i.id}/revoke`), () => "Invitation revoked.")}>
                      <Spin on={busy?.kind === "revoke" && busy.id === i.id} text="Revoking…">Revoke</Spin>
                    </Button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="members-title" className="pb-card p-4">
        <h2 id="members-title" className="pb-h2">People with access</h2>
        <ul className="mt-2 divide-y divide-border">
          {members.map((m) => (
            <li key={m.memberId} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span className="text-foreground">{who(m)} · <span data-testid={`role-${m.memberId}`}>{memberRoleLabel(m)}</span></span>
              {!m.isOwner && m.role !== "admin" && (
                <Button type="button" variant="outline" disabled={working} onClick={() => setConfirmRemove(m)} data-testid={`remove-${m.memberId}`}>Remove access</Button>
              )}
            </li>
          ))}
        </ul>
        {members.some((m) => m.role === "admin" && !m.isOwner) && <p className="mt-2 text-xs text-muted-foreground">To change the store admin, invite a new store admin. The account owner always keeps access.</p>}
      </section>

      <Dialog open={confirmRemove !== null} onOpenChange={(o) => { if (!o && !working) setConfirmRemove(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {confirmRemove ? who(confirmRemove) : ""} from {pharmacy}?</DialogTitle>
            <DialogDescription>
              {confirmRemove ? who(confirmRemove) : "They"} will lose access to {pharmacy}&apos;s data from their next action in OwedBook, and any
              pending invitations to them for this pharmacy are cancelled. Their access to other pharmacies is not changed. You can invite them again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" disabled={working} onClick={() => setConfirmRemove(null)}>Cancel</Button>
            <Button type="button" variant="destructive" disabled={working} aria-busy={busy?.kind === "remove"} data-testid="confirm-remove-access"
              onClick={async () => {
                const m = confirmRemove; if (!m) return;
                await run({ kind: "remove", id: m.memberId }, () => post(`/api/stores/${storeId}/members/${m.memberId}/remove`), () => `${who(m)} no longer has access to ${pharmacy}.`);
                setConfirmRemove(null);
              }}>
              <Spin on={busy?.kind === "remove"} text="Removing access…">Remove access</Spin>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
