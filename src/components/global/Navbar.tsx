"use client";
import { canAdminister, isDemoMode, listTenantStores, type TenantStore } from "@/services/tenantScope";
import { viewerRoleLabel, viewerRoleSummary } from "@/components/admin-portal/roleLabel";
import { avatarLetter, displayNameOf, NO_DISPLAY_NAME } from "./identity";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggler from "./ThemeToggler";
import Logout from "../auth/Logout";
import { User as SupabaseUser } from "@supabase/auth-js";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { AppRole } from "@/utils/app-role";

// Identity is SERVER-RESOLVED: every layout that mounts this Navbar already ran
// protectPage, which guarantees an authenticated user with an allowed role and
// passes both down as props. No client-side auth fetch → no empty-nav window on
// mount/remount, and no dev/build divergence.
interface NavbarProps {
  user: SupabaseUser;
  role: AppRole;
}

const Navbar = ({ user, role }: NavbarProps) => {
  const userId = user?.id;
  const [tenantAccess, setTenantAccess] = useState<{userId:string;stores:TenantStore[]}|null>(null);
  useEffect(() => {
    if (isDemoMode() || !userId) return;
    let cancelled = false;
    listTenantStores().then(stores => { if(!cancelled)setTenantAccess({userId,stores}); }).catch(() => {if(!cancelled)setTenantAccess(null);});
    return () => {cancelled=true;};
  }, [userId]);
  const myStores = tenantAccess && tenantAccess.userId === user?.id ? tenantAccess.stores : null;
  const hasAdminAccess = isDemoMode() ? role === AppRole.ADMIN : myStores !== null && canAdminister(myStores);

  // Manual QA 20 Nov 2026: the navbar shows the person's name and their store role (Owner / Store admin / Member), never the
  // email. The role is read from tenant_stores (ownership from the account, admin from the membership), never inferred from
  // the email address; no badge is shown until it has loaded, or in demo mode. The title states the scope behind the badge.
  const name = displayNameOf(user);
  const shownName = name ?? NO_DISPLAY_NAME;
  const roleBadge = myStores ? viewerRoleLabel(myStores) : null;
  const roleScope = myStores ? viewerRoleSummary(myStores) : "";
  const badge = roleBadge ? (
    <span
      className="shrink-0 border border-navbar-foreground/40 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide"
      title={roleScope}
      data-testid="nav-role-badge"
    >
      {roleBadge}
      <span className="sr-only">{roleScope ? ` (${roleScope})` : ""}</span>
    </span>
  ) : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // Role-aware top-level nav (UI_SPEC §E/§F): ADMIN → OwedBook · Admin Portal ·
  // Profile. MEMBER → OwedBook · Profile. Never empty. Active is route-derived
  // via usePathname.
  const pathname = usePathname() ?? "";
  const isAdmin = hasAdminAccess;

  const navLinks = [
    { label: "OwedBook", href: "/owedbook" },
    ...(isAdmin ? [{ label: "Admin Portal", href: "/admin-portal" }] : []),
    { label: "Profile", href: "/profile" },
  ];

  // Slim auth listener: identity comes from the server, so the ONLY event that
  // matters here is a sign-out from elsewhere (another tab) — bounce to /auth.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.refresh();
        router.push("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // A mobile menu must dismiss on an outside tap, not only via the X. Listen only
  // while open: close on a pointerdown outside the whole <header> (so the
  // hamburger toggle and in-panel taps don't double-fire) and on Escape. The X
  // toggle and per-link closeMenu keep working untouched.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      // Inside the navbar itself → keep open (hamburger toggle + in-panel taps).
      if (headerRef.current?.contains(target)) return;
      // Inside an open Radix popper (e.g. the theme dropdown, which portals to
      // document.body OUTSIDE the header) → keep open; that's a control of the
      // menu, not an outside tap.
      if (target.closest("[data-radix-popper-content-wrapper]")) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    try {
      await useAuthStore.getState().logout();
      router.refresh();
      router.push("/auth");
    } catch {
      console.error("Failed to log out");
    }
  };

  const navLinkClass = (href: string) => {
    const active = pathname.startsWith(href);
    return `px-3 py-1 text-sm font-medium transition-colors ${
      active
        ? "text-navbar-foreground border-b-2 border-navbar-foreground font-semibold"
        : "text-navbar-foreground/70 hover:text-navbar-foreground"
    }`;
  };

  return (
    <header ref={headerRef} className="bg-navbar text-navbar-foreground">
      <div className="py-2 px-4 sm:px-5 flex justify-between items-center gap-2">
        <Link
          href="/"
          aria-label="Cyber Pharma — Home"
          onClick={closeMenu}
          className="shrink-0"
        >
          <Image src="/brand/logo-color.svg" alt="Cyber Pharma" width={36} height={36} />
        </Link>

        {/* Desktop nav (≥ lg, role-aware) */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
              className={navLinkClass(l.href)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right cluster (≥ lg) */}
        <div className="hidden lg:flex items-center">
          <ThemeToggler />
          <span className="mx-3 flex min-w-0 items-center gap-2 text-navbar-foreground" data-testid="nav-identity">
            <span className="max-w-[14rem] truncate text-sm font-medium" title={shownName}>{shownName}</span>
            {badge}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" aria-label="Account menu">
              <Avatar>
                <AvatarFallback>{avatarLetter(name, user.email)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover max-w-[18rem]">
              <DropdownMenuLabel className="font-normal">
                <span className="block truncate text-sm font-semibold">{shownName}</span>
                <span className="block truncate text-xs text-muted-foreground" data-testid="nav-menu-email">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile hamburger (< lg) */}
        <button
          type="button"
          onClick={() => setMenuOpen((s) => !s)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="lg:hidden shrink-0 p-2 text-navbar-foreground hover:opacity-80"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile panel (< lg) — same role-aware links + account actions */}
      {menuOpen && (
        <div
          className="lg:hidden border-t border-navbar-foreground/20"
          role="dialog"
          aria-label="Menu"
        >
          <nav className="flex flex-col">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className={`px-5 py-3 text-sm font-medium border-b border-navbar-foreground/20 ${
                  pathname.startsWith(l.href) ? "font-semibold" : "text-navbar-foreground/80"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-navbar-foreground/20">
              <span className="min-w-0">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-medium">{shownName}</span>
                  {badge}
                </span>
                <span className="block truncate text-xs text-navbar-foreground/70">{user.email}</span>
              </span>
              <ThemeToggler onSelect={closeMenu} />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-5 py-3 text-sm text-left bg-secondary text-secondary-foreground"
            >
              Log out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
