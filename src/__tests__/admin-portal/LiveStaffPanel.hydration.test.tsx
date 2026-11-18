/** @jest-environment jsdom */
// APBM-007B F-Q2-002 — the staff invitation screen keeps what was typed while the page was still hydrating. In WebKit the
// fill landed on the server-rendered field without React seeing the change event; with the controlled field, the next
// re-render (the member/invitation list load) wiped it and Send stayed disabled, so no status ever appeared.
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import LiveStaffPanel from "@/components/admin-portal/LiveStaffPanel";

jest.mock("@/services/adminDemo", () => ({
  storeMemberService: { listMembers: () => new Promise((r) => setTimeout(() => r([{ memberId: "u1", name: "", email: "owner@x.invalid", role: "admin" }]), 20)) },
}));

const STORE = "6a6a650d-844e-4734-9674-e91a831d73f8";
let posts: unknown[] = [];
type Res = { ok: boolean; json: () => Promise<unknown> };
const reply = (body: unknown, ok = true): Res => ({ ok, json: async () => body });
let postImpl: () => Promise<Res>;
beforeEach(() => {
  posts = []; postImpl = async () => reply({ data: { delivery: "blocked" } });
  global.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === "POST") { posts.push(JSON.parse(String(init.body))); return postImpl(); }
    return reply({ data: [] });
  }) as unknown as typeof fetch;
});

async function serverRenderThenHydrate(typedBeforeHydration: string | null) {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<LiveStaffPanel storeId={STORE} canAppointAdmin={false} />);
  document.body.appendChild(container);
  const ssrButton = container.querySelector("button[type=submit]") as HTMLButtonElement;
  const ssrDisabled = ssrButton.disabled;
  const field = container.querySelector("#invite-email") as HTMLInputElement;
  if (typedBeforeHydration !== null) field.value = typedBeforeHydration;   // no input event: React never sees it
  let root: Root | undefined;
  await act(async () => { root = hydrateRoot(container, <LiveStaffPanel storeId={STORE} canAppointAdmin={false} />); });
  await waitFor(() => expect(screen.getByText(/owner@x\.invalid/)).toBeTruthy());   // the list load re-rendered the panel
  return { container, field, ssrDisabled, root: root as Root };
}

afterEach(() => { document.body.innerHTML = ""; });

it("Send is disabled in the server HTML, so a click before hydration cannot become a native form submission", async () => {
  const { ssrDisabled, container, root } = await serverRenderThenHydrate(null);
  expect(ssrDisabled).toBe(true);
  expect((container.querySelector("button[type=submit]") as HTMLButtonElement).disabled).toBe(false);
  act(() => root.unmount());
});

it("text typed while hydrating survives the next re-render, and Send posts it and shows the delivery status", async () => {
  const { field, container, root } = await serverRenderThenHydrate("late-typed@x.invalid");
  expect(field.value).toBe("late-typed@x.invalid");
  const send = container.querySelector("button[type=submit]") as HTMLButtonElement;
  expect(send.disabled).toBe(false);
  await act(async () => { fireEvent.submit(send.closest("form") as HTMLFormElement); });
  expect(posts).toEqual([{ email: "late-typed@x.invalid", role: "member" }]);
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Email delivery is disabled for this address"));
  act(() => root.unmount());
});

it("a failed request never leaves Send stuck: a message appears and the button is enabled again", async () => {
  postImpl = async () => { throw new TypeError("Load failed"); };
  const { field, container, root } = await serverRenderThenHydrate(null);
  field.value = "someone@x.invalid";
  await act(async () => { fireEvent.submit(container.querySelector("form") as HTMLFormElement); });
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("That did not work"));
  expect((container.querySelector("button[type=submit]") as HTMLButtonElement).disabled).toBe(false);
  act(() => root.unmount());
});
