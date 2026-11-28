"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Command } from "@/components/ui/command";
import { Store, CreditCard, Settings, ScrollText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FilterRail from "@/components/owedbook/FilterRail";
import { useOwedBook } from "@/components/owedbook/OwedBookContext";

interface NavItem {
  icon: ReactNode;
  label: string;
  href: string;
  // The routes this item owns. A section can own more than its own href (My Stores owns the store drill-down at
  // /admin-portal/stores/*). Matching is by whole path segment, so /admin-portal/billingx is not Billing.
  owns: (pathname: string) => boolean;
}

const under = (p: string, base: string) => p === base || p.startsWith(`${base}/`);

// Surface-aware sidebar (UI_SPEC v1.4 §A.1/§C): ONE component, ONE container (the same Command panel). Only the
// CONTENT differs: the Admin Portal shows nav items; OwedBook shows the FilterRail.
// Owner-scoped nav (Phase 2.2 route takeover): My Stores · Billing · Settings · Audit.
const ADMIN_ITEMS: NavItem[] = [
  {
    icon: <Store className="mr-2 h-4 w-4" aria-hidden="true" />,
    label: "My Stores",
    href: "/admin-portal",
    owns: (p) => p === "/admin-portal" || under(p, "/admin-portal/stores"),
  },
  {
    icon: <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />,
    label: "Billing",
    href: "/admin-portal/billing",
    owns: (p) => under(p, "/admin-portal/billing"),
  },
  {
    icon: <Settings className="mr-2 h-4 w-4" aria-hidden="true" />,
    label: "Settings",
    href: "/admin-portal/settings",
    owns: (p) => under(p, "/admin-portal/settings"),
  },
  {
    icon: <ScrollText className="mr-2 h-4 w-4" aria-hidden="true" />,
    label: "Audit log",
    href: "/admin-portal/audit",
    owns: (p) => under(p, "/admin-portal/audit"),
  },
];

/**
 * The one item the current route selects, or none. The route is the only source: the items are plain links, not
 * command-palette options, so no pointer or keyboard selection can survive a navigation and leave a second item
 * highlighted (U-1). The first owner wins, so a nested route can never select two items.
 */
export const selectedAdminHref = (pathname: string): string | null => {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return ADMIN_ITEMS.find((item) => item.owns(p))?.href ?? null;
};

const AdminSidebar = () => {
  const pathname = usePathname() ?? "";
  const onAdmin = pathname.startsWith("/admin-portal");
  const { filters, pbmOptions, applyFilters, clearFilters } = useOwedBook();
  const selected = selectedAdminHref(pathname);

  return (
    <Command className="rounded-lg border border-border bg-card shadow-card">
      {onAdmin ? (
        <nav aria-label="Admin Portal" className="px-3 py-3">
          <p className="pb-eyebrow px-3 py-1.5 text-muted-foreground">Admin Portal</p>
          <ul className="space-y-1">
            {ADMIN_ITEMS.map((item) => {
              const active = item.href === selected;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    data-selected={active ? "true" : undefined}
                    className={cn(
                      // Selected (brand contract 4.8): ice fill, navy text, navy rule on the left edge.
                      // Unselected hover: ice fill. Keyboard focus: the shared 2px outline.
                      "flex min-h-11 items-center rounded-md px-3 py-2 text-[15px] transition-colors",
                      active
                        ? "pb-rail-active"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : (
        <div className="px-4 py-3">
          <FilterRail
            filters={filters}
            pbmOptions={pbmOptions}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>
      )}
    </Command>
  );
};

export default AdminSidebar;
