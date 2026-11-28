/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { User as SupabaseUser } from "@supabase/auth-js";

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: Object.assign(jest.fn(), {
    getState: () => ({ logout: jest.fn().mockResolvedValue(undefined) }),
  }),
}));

import UserMenu from "@/components/global/UserMenu";
import { AppRole } from "@/utils/app-role";
import { peerOrigin } from "@/lib/appIdentity";

const tony = { email: "tony@stark.com" } as SupabaseUser;

// KIP-2 kill contract: identity is server-passed as props — the avatar (or the
// logged-out links) must be correct on the FIRST synchronous render, with no
// client fetch, no loading null-window, and no persisted-store role read.
describe("UserMenu (props-resolved identity)", () => {
  it("logged-out visitor gets Log in / Subscribe Now, no avatar", () => {
    render(<UserMenu user={null} role={null} />);
    expect(screen.getByText("Log in")).toHaveAttribute("href", "/auth");
    // RWO-01 A1-1 (ruling AM-22): the green header button opens the configured Account & Billing home page.
    expect(screen.getByText("Subscribe Now")).toHaveAttribute("href", `${peerOrigin()}/`);
    expect(screen.getByText("Subscribe Now")).toHaveClass("bg-primary", "hover:bg-primary-hover", "min-h-11");
    expect(screen.queryByText(/free trial/i)).not.toBeInTheDocument();
    expect(screen.queryByText("T")).not.toBeInTheDocument();
  });

  it("authenticated user renders the avatar synchronously, no auth links", () => {
    render(<UserMenu user={tony} role={AppRole.MEMBER} />);
    expect(screen.getByText("T")).toBeInTheDocument(); // avatar fallback
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
    expect(screen.queryByText("Subscribe Now")).not.toBeInTheDocument();
  });

  // jsdom has no real pointer events; Radix triggers open reliably on keyboard.
  const openDropdown = () =>
    fireEvent.keyDown(screen.getByRole("button", { name: "T" }), {
      key: "Enter",
    });

  it("ADMIN dropdown carries email, role label, and the Admin portal link", () => {
    render(<UserMenu user={tony} role={AppRole.ADMIN} />);
    openDropdown();
    expect(screen.getByText("tony@stark.com")).toBeInTheDocument();
    expect(screen.getByText(AppRole.ADMIN)).toBeInTheDocument();
    expect(screen.getByText("Admin portal")).toHaveAttribute("href", "/admin-portal");
  });

  it("MEMBER dropdown routes to OwedBook, never the Admin portal", () => {
    render(<UserMenu user={tony} role={AppRole.MEMBER} />);
    openDropdown();
    expect(screen.getByText("OwedBook")).toHaveAttribute("href", "/owedbook");
    expect(screen.queryByText("Admin portal")).not.toBeInTheDocument();
  });

  // RWO-01 R-06 (c): the round account button is at least 44 by 44 and stays round.
  it("the account button is a 44px round target", () => {
    render(<UserMenu user={tony} role={AppRole.MEMBER} />);
    const trigger = screen.getByRole("button", { name: "T" });
    expect(trigger).toHaveClass("rounded-full");
    expect(trigger.firstElementChild).toHaveClass("h-11", "w-11", "rounded-full");
  });
});
