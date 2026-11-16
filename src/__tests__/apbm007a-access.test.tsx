/**
 * @jest-environment jsdom
 */
// APBM007A — access state, the read-only enforcement hook, the banner and owner-only billing (AC-027, AC-031, AC-032, RA-2, RA-3).
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { assertStoreWritable, storeAccess, StoreAccessDeniedError, StoreReadOnlyError } from "@/server/accessState";
import { createAdminServices, BillingOwnerOnlyError } from "@/services/adminDemo";
import { AccessBanner } from "@/components/owedbook/AccessBanner";

jest.mock("@/components/owedbook/OwedBookContext", () => ({ useOwedBook: () => ({ storeId: "11111111-1111-4111-8111-111111111111" }) }));

const A = "11111111-1111-4111-8111-111111111111", ACCOUNT = "22222222-2222-4222-8222-222222222222";
const client = (data: unknown, error: { message: string; code?: string } | null = null) => ({ rpc: jest.fn(async () => ({ data, error })) });
const row = (over: Record<string, unknown> = {}) => ({ state: "active", read_only: false, origin: "stripe", is_owner: false, policy_version: "access-v1", ...over });

describe("store access state", () => {
  afterEach(() => { delete process.env.ALLOW_SYNTHETIC_SUBSCRIPTIONS; });
  it("passes the database state through and asks only for the requested store", async () => {
    const c = client(row({ state: "grace" }));
    await expect(storeAccess(c, A)).resolves.toEqual({ state: "grace", readOnly: false, isOwner: false, policyVersion: "access-v1" });
    expect(c.rpc).toHaveBeenCalledWith("store_access_state", { p_business_id: A });
  });
  it("a synthetic fixture grants nothing unless the environment flag is on (RA-2)", async () => {
    await expect(storeAccess(client(row({ origin: "synthetic_seed" })), A)).resolves.toMatchObject({ state: "none" });
    process.env.ALLOW_SYNTHETIC_SUBSCRIPTIONS = "true";
    await expect(storeAccess(client(row({ origin: "synthetic_seed" })), A)).resolves.toMatchObject({ state: "active" });
    await expect(storeAccess(client(row({ origin: "synthetic_seed", state: "past_due_reminder" })), A)).resolves.toMatchObject({ state: "past_due_reminder", readOnly: false });
  });
  it("a non-member is refused, and an unknown answer is never treated as active", async () => {
    await expect(storeAccess(client(null, { message: "not a member of business", code: "42501" }), A)).rejects.toBeInstanceOf(StoreAccessDeniedError);
    await expect(storeAccess(client({ state: "surprise" }), A)).rejects.toThrow("Access state unavailable");
    await expect(storeAccess(client(null, { message: "boom" }), A)).rejects.toThrow("Access state unavailable");
  });
});

// HOOK CONTRACT TEST — labelled as such. 007A adds no customer write to OwedBook, so there is no real write to deny
// in this release; this proves the hook that a later write path must call. It is not evidence of a working write feature.
describe("read-only enforcement hook (contract test; no 007A customer write exists)", () => {
  it.each(["active", "grace", "past_due_reminder"])("allows a write while the state is %s", async (state) => {
    await expect(assertStoreWritable(client(row({ state })), A)).resolves.toBeUndefined();
  });
  it.each([["read_only", true], ["ended", true], ["none", false]])("denies a write when the state is %s", async (state, read_only) => {
    await expect(assertStoreWritable(client(row({ state, read_only })), A)).rejects.toBeInstanceOf(StoreReadOnlyError);
  });
  it("denies when the state cannot be read: failure never opens a write", async () => {
    await expect(assertStoreWritable(client(null, { message: "down" }), A)).rejects.toThrow();
  });
});

describe("owner-only billing read (RA-3)", () => {
  const rpcBy = (answers: Record<string, unknown>) => ({ rpc: jest.fn(async (name: string) => ({ data: answers[name], error: null })) });
  it("a store admin who is not the owner gets a plain statement and no billing call", async () => {
    const c = rpcBy({ tenant_stores: [{ id: A, account_id: ACCOUNT, name: "A", capability: "admin" }] });
    await expect(createAdminServices(c).billingService.listBilling()).rejects.toBeInstanceOf(BillingOwnerOnlyError);
    expect(c.rpc.mock.calls.map(([n]) => n)).toEqual(["tenant_stores"]);
  });
  it("the owner's billing lines are read for owned stores only", async () => {
    const c = rpcBy({
      tenant_stores: [{ id: A, account_id: ACCOUNT, name: "A", capability: "owner" }],
      admin_stores: [{ id: A, name: "A", ncpdp: null, npi: "1234567893", status: "active", subscription_status: "active", member_count: 1 }],
      // U-2: the owner's current subscription comes from owner_billing_overview (0060), as in the Payment Portal.
      owner_billing_overview: { account_id: ACCOUNT, subscription: { origin: "stripe", status: "active", quantity: 1, current_period_end: null, cancel_at: null, cancel_at_period_end: false, paid_through: null } },
    });
    const lines = await createAdminServices(c).billingService.listBilling();
    expect(lines).toEqual([expect.objectContaining({ storeId: A, subscriptionStatus: "active" })]);
    expect(c.rpc.mock.calls.map(([n]) => n)).toEqual(["tenant_stores", "admin_stores", "owner_billing_overview"]);
  });
  it("a store row without a billing field (non-owner redaction) maps to unavailable, not to a guess", async () => {
    const c = rpcBy({ admin_stores: [{ id: A, name: "A", ncpdp: null, npi: "1234567893", status: "active", member_count: 1 }] });
    const [store] = await createAdminServices(c).ownerStoresService.listMyStores();
    expect(store.subscriptionStatus).toBe("unavailable");
    expect(store.ncpdp).toBe("Unavailable");   // NCPDP is optional now (D-03)
  });
});

describe("access banner", () => {
  const previous = process.env.NEXT_PUBLIC_APBM_DATA_MODE;
  beforeAll(() => { process.env.NEXT_PUBLIC_APBM_DATA_MODE = "real"; });
  afterAll(() => { process.env.NEXT_PUBLIC_APBM_DATA_MODE = previous; });
  const mount = (access: unknown, ok = true) => {
    global.fetch = jest.fn(async () => ({ ok, json: async () => ({ access }) })) as unknown as typeof fetch;
    return render(<AccessBanner />);
  };
  it("shows nothing while access is active", async () => {
    const { container } = mount({ state: "active", readOnly: false, isOwner: true });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(`/api/access-state?business_id=${A}`, { cache: "no-store" }));
    expect(container).toBeEmptyDOMElement();
  });
  it("tells the owner about a failed renewal and links to billing without a token", async () => {
    mount({ state: "grace", readOnly: false, isOwner: true });
    expect(await screen.findByTestId("access-banner")).toHaveAttribute("data-state", "grace");
    expect(screen.getByTestId("access-banner-billing")).toHaveAttribute("href", "http://localhost:3001/api/handoff/start?return=%2Fbilling");
  });
  it("tells a non-owner who manages billing and offers no billing link", async () => {
    mount({ state: "read_only", readOnly: true, isOwner: false });
    expect(await screen.findByRole("alert")).toHaveTextContent("Billing is managed by the account owner.");
    expect(screen.queryByTestId("access-banner-billing")).not.toBeInTheDocument();
  });
  it("shows no banner when the check fails", async () => {
    const { container } = mount(null, false);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
