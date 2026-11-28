"use client";
import { canAdminister, isDemoMode, listTenantStores } from "@/services/tenantScope";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "../auth/Logout";
import { User as SupabaseUser } from "@supabase/auth-js";
import { AppRole } from "@/utils/app-role";
import { peerOrigin } from "@/lib/appIdentity";

// Identity is SERVER-RESOLVED and passed as props (Navbar Law — KIP-2 kill):
// no client auth fetch, no persisted-store role read, no loading window.
interface UserMenuProps {
  user: SupabaseUser | null;
  role: AppRole | null;
}

const UserMenu = ({ user, role }: UserMenuProps) => {
  const userId = user?.id;
  const [tenantAccess, setTenantAccess] = useState<{userId:string;allowed:boolean}|null>(null);
  useEffect(() => {
    if (isDemoMode() || !userId) return;
    let cancelled = false;
    listTenantStores().then(stores => { if(!cancelled)setTenantAccess({userId,allowed:canAdminister(stores)}); }).catch(() => {if(!cancelled)setTenantAccess(null);});
    return () => {cancelled=true;};
  }, [userId]);
  const hasAdminAccess = isDemoMode() ? role === AppRole.ADMIN : tenantAccess?.userId === user?.id && tenantAccess?.allowed === true;

  if (user) {
    const portalHref = hasAdminAccess ? "/admin-portal" : "/owedbook";
    const portalLabel = hasAdminAccess ? "Admin portal" : "OwedBook";

    return (
      <div className="flex items-center px-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-full">
            <Avatar className="h-11 w-11">
              <AvatarFallback>{user.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold truncate">{user.email}</span>
                {role && (
                  <span className="text-xs text-muted-foreground capitalize">{role}</span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={portalHref}>{portalLabel}</Link>
            </DropdownMenuItem>
            <Logout />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/auth"
        className="pb-nav-item inline-flex min-h-11 items-center px-4"
      >
        Log in
      </Link>
      {/* RWO-01 A1-1 (ruling AM-22): opens the Account & Billing home page at its configured address, like the
          opening page's own Subscribe Now button. */}
      <a
        href={`${peerOrigin()}/`}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-primary-foreground hover:bg-primary-hover"
      >
        Subscribe Now
      </a>
    </>
  );
};

export default UserMenu;
