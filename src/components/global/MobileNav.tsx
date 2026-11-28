"use client";
import { canAdminister, isDemoMode, listTenantStores } from "@/services/tenantScope";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { User as SupabaseUser } from "@supabase/auth-js";
import { useAuthStore } from "@/store/useAuthStore";
import { AppRole } from "@/utils/app-role";
import { peerOrigin } from "@/lib/appIdentity";

// Identity is SERVER-RESOLVED and passed as props (Navbar Law — KIP-2 kill):
// no client auth fetch, no persisted-store role read, no loading window. The
// store appears below ONLY as the logout action, mirroring the cured Navbar.
interface MobileNavProps {
  user: SupabaseUser | null;
  role: AppRole | null;
}

const MobileNav = ({ user, role }: MobileNavProps) => {
  const userId = user?.id;
  const [tenantAccess, setTenantAccess] = useState<{userId:string;allowed:boolean}|null>(null);
  useEffect(() => {
    if (isDemoMode() || !userId) return;
    let cancelled = false;
    listTenantStores().then(stores => { if(!cancelled)setTenantAccess({userId,allowed:canAdminister(stores)}); }).catch(() => {if(!cancelled)setTenantAccess(null);});
    return () => {cancelled=true;};
  }, [userId]);
  const hasAdminAccess = isDemoMode() ? role === AppRole.ADMIN : tenantAccess?.userId === user?.id && tenantAccess?.allowed === true;

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    try {
      await useAuthStore.getState().logout();
      router.refresh();
      router.push("/auth");
    } catch {
      console.error("Failed to log out");
    }
  };

  const portalHref = hasAdminAccess ? "/admin-portal" : "/owedbook";
  const portalLabel = hasAdminAccess ? "Admin portal" : "OwedBook";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-navbar-foreground/70 px-3 py-2 text-[15px] text-navbar-foreground hover:bg-navbar-foreground/10"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      {open && (
        <div
          className="pb-on-light absolute top-full left-0 right-0 bg-card text-card-foreground border-b border-border shadow-menu z-50 px-4 py-3"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-1">

            {user && (
              <>
                <Link
                  href={portalHref}
                  onClick={close}
                  className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-[15px] text-foreground hover:bg-accent"
                >
                  {portalLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-left text-[15px] text-heading hover:bg-accent"
                >
                  Log out
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  href="/auth"
                  onClick={close}
                  className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-[15px] text-foreground hover:bg-accent"
                >
                  Log in
                </Link>
                {/* RWO-01 A1-1 (ruling AM-22): opens the Account & Billing home page at its configured address. */}
                <a
                  href={`${peerOrigin()}/`}
                  onClick={close}
                  className="mt-1 flex min-h-11 items-center justify-center rounded-md bg-primary px-3 py-2.5 text-[15px] text-primary-foreground hover:bg-primary-hover"
                >
                  Subscribe Now
                </a>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
