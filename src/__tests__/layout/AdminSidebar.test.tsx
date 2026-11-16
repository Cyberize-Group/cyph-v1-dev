/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { usePathname } from "next/navigation";

// cmdk (the Command primitive the sidebar is built on) uses ResizeObserver,
// which jsdom doesn't provide. Minimal no-op polyfill, test-scoped.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;
// cmdk also scrolls the active item into view; jsdom has no layout engine.
Element.prototype.scrollIntoView = () => {};

import { fireEvent } from "@testing-library/react";
import AdminSidebar, { selectedAdminHref } from "@/components/layout/AdminSidebar";

// next/navigation is globally mocked in jest.setup; override usePathname per test.
const mockUsePathname = usePathname as jest.Mock;

// Intent: ONE surface-aware component, ONE container (UI_SPEC v1.4 §A.1/§C) —
// only the content below the command input differs. Admin shows nav items;
// OwedBook shows the FilterRail. Wrong content on a surface = a leak.
describe("AdminSidebar surface-awareness", () => {
  it("on /owedbook renders the filter rail, not nav items", () => {
    mockUsePathname.mockReturnValue("/owedbook");
    render(<AdminSidebar />);
    expect(screen.getByText("Upload Data")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(screen.getByText("Get Fresh Data")).toBeInTheDocument();
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("on /admin-portal renders the owner-scoped nav items, not the filter rail", () => {
    mockUsePathname.mockReturnValue("/admin-portal");
    render(<AdminSidebar />);
    expect(screen.getByText("My Stores")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Audit log")).toBeInTheDocument();
    expect(screen.queryByText("Upload Data")).not.toBeInTheDocument();
    // Route takeover (Phase 2.2): the old user-CRUD nav is gone.
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
  });

  // Intent: a section owns more than its own href — My Stores stays active
  // through the store drill-down, and only one item is active at a time.
  it("marks My Stores active on a /stores/* drill-down, not Billing", () => {
    mockUsePathname.mockReturnValue("/admin-portal/stores/store-1");
    render(<AdminSidebar />);
    expect(screen.getByRole("link", { name: "My Stores" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Billing" })).not.toHaveAttribute("aria-current");
  });
});

// U-1: the route is the only source of the selected item.
describe("AdminSidebar route-driven selection (U-1)", () => {
  const links = () => screen.getAllByRole("link");
  const selectedLinks = () => links().filter((l) => l.getAttribute("aria-current") === "page");
  const expectOnlySelected = (label: string) => {
    expect(selectedLinks().map((l) => l.textContent)).toEqual([label]);
    for (const l of links()) {
      const on = l.textContent === label;
      // Selected: solid coral fill with white text. Every other item: no fill, a coral outline on hover only.
      expect(l.className.includes("bg-primary")).toBe(on);
      expect(l.className.includes("text-primary-foreground")).toBe(on);
      expect(l.className.includes("hover:border-primary")).toBe(!on);
      expect(l).toHaveClass("focus-visible:ring-2");   // a visible keyboard focus ring on every item
    }
  };

  it.each([
    ["/admin-portal", "/admin-portal"],
    ["/admin-portal/", "/admin-portal"],
    ["/admin-portal/stores/abc", "/admin-portal"],
    ["/admin-portal/stores/abc/invite", "/admin-portal"],
    ["/admin-portal/billing", "/admin-portal/billing"],
    ["/admin-portal/billing/", "/admin-portal/billing"],
    ["/admin-portal/settings", "/admin-portal/settings"],
    ["/admin-portal/audit", "/admin-portal/audit"],
    ["/admin-portal/billingx", null],
    ["/admin-portal/unknown", null],
    ["/owedbook", null],
  ])("%s selects %s", (path, href) => {
    expect(selectedAdminHref(path)).toBe(href);
  });

  it("exactly one item is selected on each admin route, and it is the route's own", () => {
    for (const [path, label] of [["/admin-portal", "My Stores"], ["/admin-portal/billing", "Billing"], ["/admin-portal/settings", "Settings"], ["/admin-portal/audit", "Audit log"], ["/admin-portal/stores/s1/invite", "My Stores"]]) {
      mockUsePathname.mockReturnValue(path);
      const { unmount } = render(<AdminSidebar />);
      expectOnlySelected(label);
      unmount();
    }
  });

  it("moving from Audit log to Billing moves the selection; nothing stays highlighted from the click", () => {
    mockUsePathname.mockReturnValue("/admin-portal/audit");
    const { rerender } = render(<AdminSidebar />);
    expectOnlySelected("Audit log");
    const billing = screen.getByRole("link", { name: "Billing" });
    fireEvent.pointerMove(billing); fireEvent.mouseEnter(billing); fireEvent.focus(billing); fireEvent.click(billing);
    expectOnlySelected("Audit log");   // pointer, focus and click do not select anything: only the route does
    mockUsePathname.mockReturnValue("/admin-portal/billing");   // the navigation lands (the layout keeps the sidebar mounted)
    rerender(<AdminSidebar />);
    expectOnlySelected("Billing");
    mockUsePathname.mockReturnValue("/admin-portal/audit");
    rerender(<AdminSidebar />);
    expectOnlySelected("Audit log");
  });

  it("the items are plain links in a labelled navigation, reachable by keyboard", () => {
    mockUsePathname.mockReturnValue("/admin-portal/billing");
    render(<AdminSidebar />);
    expect(screen.getByRole("navigation", { name: "Admin Portal" })).toBeInTheDocument();
    expect(links().map((l) => l.getAttribute("href"))).toEqual(["/admin-portal", "/admin-portal/billing", "/admin-portal/settings", "/admin-portal/audit"]);
    for (const l of links()) { l.focus(); expect(document.activeElement).toBe(l); }
    expect(document.querySelectorAll("[cmdk-item]")).toHaveLength(0);   // no command-palette selection state remains
  });
});
