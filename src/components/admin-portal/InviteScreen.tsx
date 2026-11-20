"use client";

import { useCallback, useEffect, useState } from "react";
import Breadcrumb from "@/components/admin-portal/Breadcrumb";
import ScreenHeader from "@/components/admin-portal/ScreenHeader";
import InviteMemberForm from "@/components/admin-portal/InviteMemberForm";
import MemberRow from "@/components/admin-portal/MemberRow";
import AccessDenied, { isAccessDenied } from "@/components/admin-portal/AccessDenied";
import { ownerStoresService, storeMemberService } from "@/services/adminDemo";
import { isDemoMode } from "@/services/tenantScope";
import LiveStaffPanel from "@/components/admin-portal/LiveStaffPanel";
import type { OwnedStore, StoreMember } from "@/types/adminDemo";

const InviteScreen = ({ storeId }: { storeId: string }) => {
  const [store, setStore] = useState<OwnedStore | null>(null);
  const [pending, setPending] = useState<StoreMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setDenied(false);
    Promise.all([
      ownerStoresService.getStore(storeId),
      // APBM-007B: live invitations are listed by LiveStaffPanel through the invitation API.
      isDemoMode() ? storeMemberService.listPendingInvites(storeId) : Promise.resolve([] as StoreMember[]),
    ])
      .then(([s, p]) => {
        if (!cancelled) {
          setStore(s);
          setPending(p);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          if (isAccessDenied(e)) setDenied(true);
          else setError(e instanceof Error ? e.message : "Failed to load store");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [storeId, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  if (denied) return <AccessDenied />;

  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm text-destructive">
        <span>{error}</span>
        <button type="button" className="underline" onClick={reload}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <Breadcrumb
        items={[
          { label: "My Stores", href: "/admin-portal" },
          { label: store?.name ?? "Store", href: `/admin-portal/stores/${storeId}` },
          { label: "Invite member" },
        ]}
      />
      <ScreenHeader
        eyebrow="Invite"
        title="Invite a member"
        subtitle={`Send an invite to add someone to ${store?.name ?? "this store"}.`}
      />

      {!isDemoMode() ? (
        <div className="mt-6">
          {/* Owner-only billing facts are present only for the account owner; the server enforces every role rule. */}
          <LiveStaffPanel storeId={storeId} storeName={store?.name} canAppointAdmin={!!store && store.subscriptionStatus !== "unavailable"} />
        </div>
      ) : (<>
      <div className="mt-6">
        <InviteMemberForm storeId={storeId} onInvited={reload} />
      </div>

      <div className="mt-10 w-full max-w-[560px]">
        <h2 className="text-lg font-semibold">
          Pending invites · {pending.length}
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No pending invites.
          </p>
        ) : (
          <div className="mt-4 bg-card border border-border px-4">
            {pending.map((m) => (
              <MemberRow key={m.memberId} member={m} onChanged={reload} />
            ))}
          </div>
        )}
      </div>
      </>)}
    </div>
  );
};

export default InviteScreen;
