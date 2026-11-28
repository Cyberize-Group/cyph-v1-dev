"use client";
import { isDemoMode } from "@/services/tenantScope";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import StatusPill from "@/components/admin-portal/StatusPill";
import { memberStatusPill } from "@/components/admin-portal/statusPresentation";
import { storeMemberService } from "@/services/adminDemo";
import type { ActionResult, StoreMember } from "@/types/adminDemo";
import Link from "next/link";
import { memberRoleLabel } from "@/components/admin-portal/roleLabel";

interface MemberRowProps {
  member: StoreMember;
  // Re-fetch the roster after a state-changing action (suspend/un-suspend).
  onChanged: () => void;
}

// One roster row. Actions are derived from accountStatus (DATA_CONTRACT §2.3):
//   active → [Send recovery, Suspend] · invite_pending → [Resend invite]
//   suspended → [Un-suspend]. Secondary line shows email · jobTitle (demo-only).
const MemberRow = ({ member, onChanged }: MemberRowProps) => {
  const storeId = member.storeId;
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const pill = memberStatusPill[member.accountStatus];
  const display = member.name || member.email;

  const run = async (fn: () => Promise<ActionResult>) => {
    setBusy(true);
    try {
      const res = await fn();
      toast({ title: res.message, variant: res.ok ? "default" : "destructive" });
      onChanged();
    } catch (e) {
      toast({
        title: e instanceof Error ? e.message : "Action failed",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border-b border-border py-3.5 last:border-0 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-accent text-heading">
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold text-heading">{display}</p>
          <p className="truncate text-[13px] text-muted-foreground">
            {member.email}
            {member.jobTitle ? ` · ${member.jobTitle}` : ""}
          </p>
        </div>
      </div>
      {/* Manual QA 19 Nov 2026 (R5): real mode shows the person's role (Owner is the account owner) and points to the
          People page, where access is managed; the demo-only account actions are not shown. */}
      {!isDemoMode() ? (
        <div className="flex items-center justify-between gap-3 md:justify-end">
          {/* ABM007_FINAL P-04: one neutral outlined role label, told apart by the word. */}
          <span className="pb-role">{memberRoleLabel(member)}</span>
          {storeId && !member.isOwner ? <Link className="pb-link text-sm" href={`/admin-portal/stores/${storeId}/invite`}>Manage access</Link> : null}
        </div>
      ) : (
      <div className="flex items-center justify-between gap-3 md:justify-end">
        <StatusPill tone={pill.tone}>{pill.label}</StatusPill>
        <div className="flex gap-2">
          {member.accountStatus === "active" && (
            <>
              <Button
                variant="secondary"
                size="sm"
                disabled={busy || !isDemoMode()}
                onClick={() => run(() => storeMemberService.sendRecovery(member.memberId))}
              >
                Send recovery
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={busy || !isDemoMode()}
                onClick={() => run(() => storeMemberService.suspendMember(member.memberId))}
              >
                Suspend
              </Button>
            </>
          )}
          {member.accountStatus === "invite_pending" && (
            <Button
              variant="secondary"
              size="sm"
              disabled={busy || !isDemoMode()}
              onClick={() => run(() => storeMemberService.resendInvite(member.memberId))}
            >
              Resend invite
            </Button>
          )}
          {member.accountStatus === "suspended" && (
            <Button
              variant="secondary"
              size="sm"
              disabled={busy || !isDemoMode()}
              onClick={() => run(() => storeMemberService.unsuspendMember(member.memberId))}
            >
              Un-suspend
            </Button>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default MemberRow;
