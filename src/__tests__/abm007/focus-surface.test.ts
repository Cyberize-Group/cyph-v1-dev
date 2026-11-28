/**
 * ABM007_FINAL surface-aware focus (Architect source review, 24 Nov). The focus outline reads --pb-focus-ring, which
 * each surface sets for what sits on it, so the nearest surface decides: white on navy surfaces, navy on white ones.
 * This pins the source rule; the rendered keyboard walk measures the actual ring against the actual surface.
 */
import { readFileSync } from "fs";
import { join } from "path";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const rule = (selector: string) => {
  const m = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`));
  return m ? m[1] : null;
};

describe("ABM007_FINAL surface-aware focus", () => {
  it("draws the focus outline from the nearest surface's ring", () => {
    expect(rule(":focus-visible")).toMatch(/outline:\s*2px solid hsl\(var\(--pb-focus-ring, var\(--ring\)\)\)/);
  });
  it("navy surfaces take the on-dark ring and white surfaces the light ring", () => {
    expect(rule(".pb-on-dark,\n  .pb-backdrop,\n  .pb-masthead")).toMatch(/--pb-focus-ring:\s*var\(--ring-on-dark\)/);
    expect(rule(".pb-on-light,\n  .pb-shell,\n  .pb-card,\n  .pb-notice")).toMatch(/--pb-focus-ring:\s*var\(--ring\)/);
  });
  it("no longer forces the on-dark ring onto every descendant of a dark surface", () => {
    expect(css).not.toMatch(/\.pb-on-dark\s+:focus-visible/);
  });
  it("the white mobile menus inside the navy headers are marked as light surfaces", () => {
    for (const f of ["src/components/global/Navbar.tsx", "src/components/global/MobileNav.tsx"]) {
      expect(readFileSync(join(process.cwd(), f), "utf8")).toMatch(/className="pb-on-light [^"]*bg-card/);
    }
  });
});
