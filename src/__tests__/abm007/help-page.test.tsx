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
    // The contents list holds the thirteen section links and nothing else (RWO-01 A2-1: no "Go to the Top" in it).
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

  // RWO-01 A2-1 (ruling AM-23, replacing AM-19 and AM-22 part 2): "Go to the Top" ends each of the thirteen articles,
  // inside the article (a white card, so the dark green link), at every width.
  it("ends every article with a Go to the Top link that follows the link rules", () => {
    const { container } = render(<HelpPage />);
    const sections = Array.from(container.querySelectorAll("section"));
    expect(sections).toHaveLength(13);
    for (const section of sections) {
      const links = Array.from(section.querySelectorAll("a"));
      const top = links[links.length - 1];
      expect(top).toHaveTextContent("Go to the Top");
      expect(top).toHaveAttribute("href", "#top");
      expect(top).toHaveClass("pb-link", "min-h-11");
      expect(section).toHaveClass("pb-card");
      // Last thing in the article, and shown at every width (no breakpoint class hides it).
      expect(section.lastElementChild).toBe(top.parentElement);
      expect(top.parentElement!.className).not.toMatch(/hidden/);
      expect(links.filter((a) => a.getAttribute("href") === "#top")).toHaveLength(1);
    }
  });

  it("has no Go to the Top in the contents menu or after the last article", () => {
    const { container } = render(<HelpPage />);
    const tops = Array.from(container.querySelectorAll("a[href='#top']"));
    expect(tops).toHaveLength(13);
    for (const a of tops) expect(a.closest("section")).not.toBeNull();
    expect(within(screen.getByRole("navigation", { name: "On this page" })).queryByText("Go to the Top")).toBeNull();
    expect(screen.queryByTestId("help-go-to-top-end")).toBeNull();
  });

  // RWO-01 A3: "#top" is a real element, the Help heading, and it can take focus. With no element behind "#top" the
  // link kept keyboard focus after activation and Firefox brought the page back down to it. The scroll margin of one
  // window height makes the browser scroll to the very top. (jsdom does not scroll or move focus on a fragment
  // navigation, so the movement itself is measured in the three browser engines, not here.)
  it("gives every Go to the Top link one real, focusable target: the Help heading", () => {
    const { container } = render(<HelpPage />);
    const targets = container.querySelectorAll("#top");
    expect(targets).toHaveLength(1);
    const heading = screen.getByRole("heading", { level: 1, name: "Help" });
    expect(targets[0]).toBe(heading);
    expect(heading).toHaveAttribute("tabindex", "-1");
    expect(heading).toHaveClass("scroll-mt-[100vh]");
    // It precedes the contents menu and every article, so focus lands above all of them.
    const toc = screen.getByRole("navigation", { name: "On this page" });
    expect(heading.compareDocumentPosition(toc) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // Focusable by script and by the browser, but not a Tab stop of its own.
    heading.focus();
    expect(document.activeElement).toBe(heading);
    for (const a of Array.from(container.querySelectorAll("section a[href='#top']"))) expect(a.getAttribute("href")).toBe(`#${heading.id}`);
  });

  // RWO-01 A1-3, kept by A2-1: a contents menu taller than the window scrolls inside itself, so its last link can be reached.
  it("lets the contents menu scroll inside itself from lg", () => {
    render(<HelpPage />);
    expect(screen.getByRole("navigation", { name: "On this page" })).toHaveClass("lg:sticky", "lg:max-h-[calc(100vh-2rem)]", "lg:overflow-y-auto");
    // RWO-01 A2-2: room for the focus outline when the menu scrolls a keyboard-focused link into view.
    expect(screen.getByRole("navigation", { name: "On this page" })).toHaveClass("lg:scroll-py-2");
  });
});
