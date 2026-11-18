/** @jest-environment jsdom */
// APBM-007B F-Q4-001 — what is typed or filled before the page finishes loading is kept, the submit button follows the
// real field values, and Show password never clears the field. Each test server-renders the form, types into the server
// HTML with no input event (React never sees it, as when the production script is still loading), then hydrates.
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { LinkRequestForm } from "@/components/auth/LinkRequestForm";
import ProfileForm from "@/app/profile/ProfileForm";
import { AppRole } from "@/utils/app-role";
import type { User } from "@supabase/supabase-js";

const mockUpdateUser = jest.fn(async (_: { password: string }) => ({ error: null }));
jest.mock("@/utils/supabase/client", () => ({ createClient: () => ({ auth: { updateUser: mockUpdateUser } }) }));
jest.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast: jest.fn() }) }));

let posts: unknown[] = [];
beforeEach(() => {
  posts = [];
  global.fetch = jest.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
    posts.push(JSON.parse(String(init?.body)));
    return { ok: true, status: 200, json: async () => ({}) };
  }) as unknown as typeof fetch;
});
afterEach(() => { document.body.innerHTML = ""; mockUpdateUser.mockClear(); });

async function typeBeforeHydration(ui: React.ReactElement, typed: (c: HTMLElement) => void) {
  const container = document.createElement("div");
  container.innerHTML = renderToString(ui);
  document.body.appendChild(container);
  const ssrSubmitDisabled = (container.querySelector("button[type=submit]") as HTMLButtonElement).disabled;
  typed(container);   // no input events: React never sees these
  let root: Root | undefined;
  await act(async () => { root = hydrateRoot(container, ui); });
  return { container, ssrSubmitDisabled, root: root as Root };
}

it("sign-in link: a typed address is kept, the button is enabled, and that address is the one sent", async () => {
  const { container, root } = await typeBeforeHydration(<LinkRequestForm />, (c) => {
    (c.querySelector("#link-email") as HTMLInputElement).value = "link-early@x.invalid";
  });
  const send = screen.getByRole("button", { name: "Email me a sign-in link" }) as HTMLButtonElement;
  expect(send.disabled).toBe(false);
  await act(async () => { fireEvent.submit(container.querySelector("form") as HTMLFormElement); });
  expect(posts).toEqual([{ email: "link-early@x.invalid" }]);
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("a sign-in link is on its way"));
  expect((container.querySelector("#link-email") as HTMLInputElement).value).toBe("link-early@x.invalid");   // survived re-renders
  act(() => root.unmount());
});

it("change password: Update is disabled in the server HTML; typed passwords survive Show password and are the ones saved", async () => {
  const user = { id: "u1", email: "owner@x.invalid", user_metadata: {} } as unknown as User;
  const ui = <ProfileForm user={user} role={AppRole.ADMIN} />;
  const { container, ssrSubmitDisabled, root } = await typeBeforeHydration(ui, (c) => {
    const [pw, confirm] = Array.from(c.querySelectorAll("input[placeholder]")).slice(-2) as HTMLInputElement[];
    pw.value = "typed-early-1"; confirm.value = "typed-early-1";
  });
  await act(async () => { fireEvent.click(screen.getAllByRole("button", { name: "Show password" })[0]); });
  const pw = screen.getByPlaceholderText("Minimum 8 characters") as HTMLInputElement;
  expect(pw.type).toBe("text");
  expect(pw.value).toBe("typed-early-1");
  expect(ssrSubmitDisabled).toBe(true);
  expect((screen.getByRole("button", { name: "Update Password" }) as HTMLButtonElement).disabled).toBe(false);
  await act(async () => { fireEvent.submit(container.querySelector("form") as HTMLFormElement); });
  expect(mockUpdateUser).toHaveBeenCalledWith({ password: "typed-early-1" });
  act(() => root.unmount());
});
