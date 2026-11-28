/** @jest-environment jsdom */
// APBM-007B F-Q2-002 (bounds extension approved by the Director, 17 Nov 2026) — the sign-in form keeps credentials typed
// while the page was still hydrating. In WebKit the fill landed without React seeing the change event; the controlled
// field was then wiped and Login answered "Email is required".
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import LoginForm from "@/components/auth/LoginForm";

const mockLogin = jest.fn(async () => "/admin-portal");
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: (selector: (s: { login: typeof mockLogin }) => unknown) => selector({ login: mockLogin }),
}));
jest.mock("@/components/auth/LinkRequestForm", () => ({ LinkRequestForm: () => null }));

async function serverRenderThenHydrate(typed: { email: string; password: string } | null) {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<LoginForm />);
  document.body.appendChild(container);
  const ssrLoginDisabled = (screen.getByRole("button", { name: "Login" }) as HTMLButtonElement).disabled;
  if (typed) {   // no input events: React never sees these
    (container.querySelector("input[name=email]") as HTMLInputElement).value = typed.email;
    (container.querySelector("input[name=password]") as HTMLInputElement).value = typed.password;
  }
  let root: Root | undefined;
  await act(async () => { root = hydrateRoot(container, <LoginForm />); });
  return { container, ssrLoginDisabled, root: root as Root };
}
afterEach(() => { document.body.innerHTML = ""; mockLogin.mockClear(); });

it("Login is disabled in the server HTML (no native submit of credentials before hydration) and enabled after", async () => {
  const { ssrLoginDisabled, root } = await serverRenderThenHydrate(null);
  expect(ssrLoginDisabled).toBe(true);
  expect((screen.getByRole("button", { name: "Login" }) as HTMLButtonElement).disabled).toBe(false);
  act(() => root.unmount());
});

it("credentials typed while hydrating survive and are the ones submitted", async () => {
  const { container, root } = await serverRenderThenHydrate({ email: "owner@x.invalid", password: "typed-early" });
  await act(async () => { fireEvent.submit(container.querySelector("form") as HTMLFormElement); });
  await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("owner@x.invalid", "typed-early"));
  expect((container.querySelector("input[name=email]") as HTMLInputElement).value).toBe("owner@x.invalid");
  expect(screen.queryByText("Email is required")).toBeNull();
  act(() => root.unmount());
});

// RWO-01 R-03 (finding F04): while Login is in progress the button says so in words, carries aria-busy, keeps the
// spinner and still blocks a second press.
it("while signing in, Login shows progress words, is aria-busy, keeps the spinner and cannot be pressed again", async () => {
  let finish: (v: string) => void = () => {};
  mockLogin.mockImplementationOnce(() => new Promise<string>((r) => { finish = r; }));
  const { container, root } = await serverRenderThenHydrate({ email: "owner@x.invalid", password: "typed-early" });
  const resting = screen.getByRole("button", { name: "Login" });
  expect(resting.getAttribute("aria-busy")).toBe("false");
  await act(async () => { fireEvent.submit(container.querySelector("form") as HTMLFormElement); });
  const busy = await screen.findByRole("button", { name: "Logging in…" }) as HTMLButtonElement;
  expect(busy.getAttribute("aria-busy")).toBe("true");
  expect(busy.disabled).toBe(true);
  expect(container.querySelector("form [role=status]")).not.toBeNull();
  // The guard is the disabled button (unchanged by R-03): a second press reaches nothing.
  await act(async () => { fireEvent.click(busy); });
  expect(mockLogin).toHaveBeenCalledTimes(1);
  await act(async () => { finish("/admin-portal"); });
  act(() => root.unmount());
});
