/** @jest-environment jsdom */
// Manual QA 19 Nov 2026 — OwedBook repairs R4 (confirm member removal), R5 (Owner labels and protection, delegation
// wording), R6 (pharmacy details and selector), R7 (Profile role and guidance).
import "@testing-library/jest-dom";
import { act } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

class RO { observe() {} unobserve() {} disconnect() {} }
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = RO;
Element.prototype.scrollIntoView = () => {};
Element.prototype.hasPointerCapture = () => false;

const mockMembers = jest.fn();
jest.mock("@/services/adminDemo", () => ({ storeMemberService: { listMembers: (...a: unknown[]) => mockMembers(...a) } }));
jest.mock("@/utils/supabase/client", () => ({ createClient: jest.fn(() => ({ auth: { updateUser: jest.fn() } })) }));
const mockProfile = jest.fn();
jest.mock("@/services/storeProfile", () => ({ ...jest.requireActual("@/services/storeProfile"), loadStoreProfile: (...a: unknown[]) => mockProfile(...a) }));

import LiveStaffPanel from "@/components/admin-portal/LiveStaffPanel";
import PharmacyDetails from "@/components/admin-portal/PharmacyDetails";
import ProfileForm from "@/app/profile/ProfileForm";
import { AppRole } from "@/utils/app-role";
import { memberRoleLabel, viewerRoleLabel } from "@/components/admin-portal/roleLabel";
import type { OwnedStore, StoreMember } from "@/types/adminDemo";

const STORE = "6a6a650d-844e-4734-9674-e91a831d73f8";
const m = (id: string, name: string, role: "admin" | "member", isOwner = false): StoreMember =>
  ({ memberId: id, storeId: STORE, name, email: `${id}@x.invalid`, initials: "X", role, isOwner, accountStatus: "unavailable" });
let posts: { url: string; body: unknown }[] = [];
beforeEach(() => {
  posts = [];
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    if (init?.method === "POST") { posts.push({ url, body: JSON.parse(String(init.body)) }); return { ok: true, json: async () => ({ data: { removed: true, delivery: "sent" } }) }; }
    return { ok: true, json: async () => ({ data: [] }) };
  }) as unknown as typeof fetch;
});

describe("role labels", () => {
  it("the account owner is always Owner, whatever the membership row says", () => {
    expect(memberRoleLabel({ role: "admin", isOwner: true })).toBe("Owner");
    expect(memberRoleLabel({ role: "member", isOwner: true })).toBe("Owner");
    expect(memberRoleLabel({ role: "admin" })).toBe("Store admin");
    expect(memberRoleLabel({ role: "member" })).toBe("Member");
    expect(viewerRoleLabel([{ capability: "member" }, { capability: "owner" }])).toBe("Owner");
    expect(viewerRoleLabel([{ capability: "admin" }])).toBe("Store admin");
    expect(viewerRoleLabel([])).toBeNull();
  });
});

describe("LiveStaffPanel", () => {
  it("labels the owner, never offers to remove the owner, and confirms a removal naming the person and pharmacy", async () => {
    mockMembers.mockResolvedValue([m("own", "Tony Owner", "admin", true), m("mem", "Mia Member", "member")]);
    render(<LiveStaffPanel storeId={STORE} storeName="Stark Test Pharmacy 01" canAppointAdmin />);
    expect(await screen.findByTestId("role-own")).toHaveTextContent("Owner");
    expect(screen.getByTestId("role-mem")).toHaveTextContent("Member");
    expect(screen.queryByTestId("remove-own")).toBeNull();
    fireEvent.click(screen.getByTestId("remove-mem"));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Remove Mia Member from Stark Test Pharmacy 01?")).toBeInTheDocument();
    expect(within(dialog).getByText(/lose access to Stark Test Pharmacy 01/)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(posts).toHaveLength(0);
    fireEvent.click(screen.getByTestId("remove-mem"));
    await act(async () => { fireEvent.click(within(await screen.findByRole("dialog")).getByTestId("confirm-remove-access")); });
    expect(posts).toEqual([{ url: `/api/stores/${STORE}/members/mem/remove`, body: {} }]);
    expect(await screen.findByRole("status")).toHaveTextContent("Mia Member no longer has access to Stark Test Pharmacy 01.");
  });
  it("delegating when the owner holds the admin role: no demote/remove choice, owner keeps full access, sends 'member'", async () => {
    mockMembers.mockResolvedValue([m("own", "Tony Owner", "admin", true)]);
    const { container } = render(<LiveStaffPanel storeId={STORE} storeName="Store 01" canAppointAdmin />);
    await screen.findByTestId("role-own");
    fireEvent.click(screen.getByLabelText("Store admin"));
    expect(screen.getByTestId("delegation-note")).toHaveTextContent(/You stay the Owner with full access/);
    expect(screen.queryByText(/Lose access/)).toBeNull();
    (container.querySelector("#invite-email") as HTMLInputElement).value = "delegate@x.invalid";
    await act(async () => { fireEvent.submit(container.querySelector("form") as HTMLFormElement); });
    expect(posts[0]).toEqual({ url: `/api/stores/${STORE}/invitations`, body: { email: "delegate@x.invalid", role: "admin", formerAdminDisposition: "member" } });
  });
  it("replacing a delegated (non-owner) admin names that person in the choice", async () => {
    mockMembers.mockResolvedValue([m("own", "Tony Owner", "member", true), m("adm", "Ada Admin", "admin")]);
    render(<LiveStaffPanel storeId={STORE} storeName="Store 01" canAppointAdmin />);
    await screen.findByTestId("role-adm");
    expect(screen.getByTestId("role-own")).toHaveTextContent("Owner");
    expect(screen.queryByTestId("remove-own")).toBeNull();
    fireEvent.click(screen.getByLabelText("Store admin"));
    expect(screen.getByText(/Ada Admin is the current store admin/)).toBeInTheDocument();
  });
});

describe("PharmacyDetails", () => {
  const stores = [{ storeId: "a", name: "Store A" }, { storeId: "b", name: "Store B" }] as OwnedStore[];
  const profile = (id: string, over: Record<string, unknown> = {}) => ({ profile: { id, name: id === "a" ? "Store A" : "Store B", npi: "1003000043", ncpdp: null, address: "1 Main St", address_line2: null,
    city: "Albany", state: "NY", zip: "12207", phone: null, pharmacy_software_system: "Liberty", ...over }, detailsAvailable: true });
  it("shows stored details read-only, 'Not provided' for empty values, and switches pharmacy", async () => {
    mockProfile.mockImplementation(async (id: string) => profile(id));
    render(<PharmacyDetails stores={stores} />);
    expect(await screen.findByTestId("pd-address")).toHaveTextContent("1 Main St, Albany, NY 12207");
    expect(screen.getByTestId("pd-ncpdp")).toHaveTextContent("Not provided");
    expect(screen.getByTestId("pd-phone")).toHaveTextContent("Not provided");
    expect(screen.getByTestId("pd-software")).toHaveTextContent("Liberty");
    expect(screen.getByText("Read-only identifier")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save/i })).toBeNull();
    expect(screen.getByText(/Editing pharmacy details is pending approval/)).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("pd-store"), { target: { value: "b" } });
    await waitFor(() => expect(screen.getByRole("heading", { name: "Store B" })).toBeInTheDocument());
    expect(mockProfile).toHaveBeenLastCalledWith("b");
  });
  it("before the database update, unavailable details are not called 'Not provided'", async () => {
    mockProfile.mockResolvedValue({ ...profile("a", { address: null, pharmacy_software_system: null }), detailsAvailable: false });
    render(<PharmacyDetails stores={[stores[0]]} />);
    expect(await screen.findByTestId("pd-address")).toHaveTextContent(/Unavailable until the database update/);
    expect(screen.queryByTestId("pd-store")).toBeNull();
  });
});

describe("ProfileForm role and guidance", () => {
  const user = { id: "u", email: "owner@x.invalid", user_metadata: { full_name: "Tony Owner" }, app_metadata: {}, aud: "authenticated", created_at: "" } as never;
  it("shows Owner for the account owner and accurate name/email guidance (no admin workflow is implied)", () => {
    render(<ProfileForm user={user} role={AppRole.MEMBER} accountRole="Owner" />);
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.queryByText("Member")).toBeNull();
    expect(screen.queryByText(/Contact an admin/)).toBeNull();
    expect(screen.getByText(/aren.t self-service yet/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "support@pharmacybooks.com" })).toHaveAttribute("href", "mailto:support@pharmacybooks.com");
  });
  it("store admins and members get their own labels", () => {
    const { unmount } = render(<ProfileForm user={user} role={AppRole.MEMBER} accountRole="Store admin" />);
    expect(screen.getByText("Store admin")).toBeInTheDocument(); unmount();
    render(<ProfileForm user={user} role={AppRole.MEMBER} accountRole="Member" />);
    expect(screen.getByText("Member")).toBeInTheDocument();
  });
});
