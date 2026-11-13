/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthPage from "@/app/(auth)/auth/page";

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn((selector: (state: { login: jest.Mock }) => unknown) =>
    selector({ login: jest.fn() })
  ),
}));

// RRM-001 AC-202: /auth is login-only. The pattern below is the AC-203 grep
// pattern; this file is a standing AC-203 exception (RULINGS_ADDENDUM A-09).
const REMOVED_AFFORDANCE = /sign ?up|register|create (an )?account/i;

describe("/auth page (login-only)", () => {
  it("renders the login form: email, password, submit", () => {
    render(<AuthPage />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("offers no removed affordance: no tabs, no link, button or text for it", () => {
    const { container } = render(<AuthPage />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    // APBM007A (intentional): the returning-user sign-in link request is a second button. It is not a sign-up:
    // the request never creates a user (shouldCreateUser:false) and the removed-affordance pattern below still holds.
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["Login", "Email me a sign-in link"]);
    expect(container.textContent).not.toMatch(REMOVED_AFFORDANCE);
    expect(container.innerHTML).not.toMatch(REMOVED_AFFORDANCE);
  });
});
