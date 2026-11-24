/** @jest-environment jsdom */
/**
 * ABM007_FINAL Help (AC-H01, AC-H02 source part): thirteen sections with working in-page anchors, the approved names,
 * no forbidden terms (the scanner is proven by a seeded control first), no [VERIFY] marker, and links to app pages
 * only through existing guarded routes.
 */
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import HelpPage from "@/components/help/HelpPage";

const FORBIDDEN = [
  /4242/, /test card/i, /\btester\b/i, /\balias/i, /\+[a-z0-9]+@/i, /alpha/i, /cyberizedev/i, /run\.app/i,
  /supabase/i, /database/i, /cloud/i, /\bQA\b/, /verdict/i, /\[VERIFY\]/, /google/i, /Cyber Pharma/i,
  /within \d+ (hours|days)/i,
];
const scan = (text: string) => FORBIDDEN.filter((rx) => rx.test(text)).map(String);

describe("ABM007_FINAL Help page", () => {
  it("the forbidden-term scanner flags a seeded control", () => {
    expect(scan("Use test card 4242 on alpha (QA verdict) [VERIFY]").length).toBeGreaterThanOrEqual(5);
  });

  it("has thirteen sections, each reachable from the contents list by its anchor", () => {
    const { container } = render(<HelpPage />);
    const toc = screen.getByRole("navigation", { name: "On this page" });
    const links = within(toc).getAllByRole("link");
    expect(links).toHaveLength(13);
    for (const a of links) {
      const id = a.getAttribute("href")!.replace(/^#/, "");
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it("contains no forbidden term and uses the approved names", () => {
    const { container } = render(<HelpPage />);
    const text = container.textContent ?? "";
    expect(scan(text)).toEqual([]);
    expect(text).toContain("Pharmacy Books");
    expect(text).toContain("OwedBook");
    expect(text).toContain("Account & Billing");
    expect(text).toContain("support@pharmacybooks.com");
  });

  it("describes the real controls: Logout and Log out, Resend and Revoke, Members without My Stores", () => {
    const { container } = render(<HelpPage />);
    const text = container.textContent ?? "";
    expect(text).toContain("Logout");
    expect(text).toContain("Log out");
    expect(text).toMatch(/Resend.*Revoke/);
    expect(text).toContain("Members do not have My Stores");
    expect(text).not.toMatch(/Who can use it\.?\s*Everyone/);
  });

  it("links to app pages only through existing guarded routes", () => {
    const { container } = render(<HelpPage />);
    const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href")!);
    const appLinks = hrefs.filter((h) => h.startsWith("/"));
    expect(appLinks.sort()).toEqual(["/admin-portal", "/admin-portal/billing"]);
    expect(hrefs.filter((h) => !h.startsWith("/") && !h.startsWith("#"))).toEqual(["mailto:support@pharmacybooks.com"]);
  });

  it("gives the role table a stacked, labelled presentation with the same content for narrow screens", () => {
    render(<HelpPage />);
    const table = screen.getByRole("table", { name: "What each role can do" });
    const list = screen.getByRole("list", { name: "What each role can do" });
    const rowHeaders = within(table).getAllByRole("rowheader").map((h) => h.textContent);
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(rowHeaders.length);
    const cells = within(table).getAllByRole("row").slice(1).map((r) => within(r).getAllByRole("cell").map((c) => c.textContent));
    items.forEach((item, i) => {
      expect(item.querySelector("p")?.textContent).toBe(rowHeaders[i]);
      const terms = Array.from(item.querySelectorAll("dt")).map((d) => d.textContent);
      const values = Array.from(item.querySelectorAll("dd")).map((d) => d.textContent);
      expect(terms).toEqual(["Owner", "Store admin", "Member"]);
      expect(values).toEqual(cells[i]);
    });
    // Table from md up, stacked list below it; never both, and no minimum width that forces sideways scrolling.
    expect(table.closest("[data-testid='help-roles-table']")!.className).toMatch(/\bhidden\b.*\bmd:block\b/);
    expect(list.className).toMatch(/\bmd:hidden\b/);
    expect(table.className).not.toMatch(/min-w-/);
  });
});
