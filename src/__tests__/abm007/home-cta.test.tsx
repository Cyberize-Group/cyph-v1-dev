/** @jest-environment jsdom */
/**
 * RWO-01 R-01 (ruling AM-18): the public opening page offers "Subscribe Now" (green, to the Account & Billing home page
 * at its configured address) and an equally sized navy "Log in" (to OwedBook login). The navy fill is an exception for
 * this one button, so it must not become a Button variant.
 */
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePageContent from "@/app/(public)/HomePageContent";
import { peerOrigin } from "@/lib/appIdentity";
import { buttonVariants } from "@/components/ui/button";

describe("OwedBook public opening page buttons", () => {
  it("Subscribe Now opens the configured Account & Billing home page", () => {
    render(<HomePageContent />);
    const subscribe = screen.getByRole("link", { name: "Subscribe Now" });
    expect(subscribe).toHaveAttribute("href", `${peerOrigin()}/`);
    expect(subscribe).toHaveClass("bg-primary", "hover:bg-primary-hover", "h-14", "rounded-md");
    expect(screen.queryByText("Start free trial")).toBeNull();
  });

  it("Log in opens OwedBook login, in navy from the brand token, with a hover state", () => {
    render(<HomePageContent />);
    const login = screen.getByRole("link", { name: "Log in" });
    expect(login).toHaveAttribute("href", "/auth");
    expect(login).toHaveClass("bg-brand-navy", "hover:bg-brand-navy-deep", "text-primary-foreground", "h-14", "rounded-md");
    expect(login).not.toHaveClass("bg-primary");
  });

  it("the two buttons share one row rule, so they are the same size side by side or stacked", () => {
    render(<HomePageContent />);
    const row = screen.getByTestId("home-cta");
    expect(row).toHaveClass("flex", "flex-wrap");
    const links = within(row).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Subscribe Now", "Log in"]);
    for (const a of links) expect(a).toHaveClass("flex-1", "basis-64");
  });

  it("navy stays an exception: no Button variant carries it", () => {
    for (const variant of ["default", "destructive", "outline", "secondary", "ghost", "link"] as const) {
      expect(buttonVariants({ variant })).not.toMatch(/navy/);
    }
  });
});
