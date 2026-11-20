/**
 * @jest-environment jsdom
 */
// Manual QA final batch (20 Nov 2026) — audit presentation (scheduled vs completed removal, owner-safe handover wording,
// system actor labels), the owner-managed store status for store admins, the access-denied state and the navbar identity.
// Presentation mappings only: stored audit rows are never changed.
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { User as SupabaseUser } from "@supabase/auth-js";
import { actorLabel, describeAudit, type RawAuditRow } from "@/components/admin-portal/auditDescribe";
import { storeNeedsAttention, storeStatusPill, subscriptionPill } from "@/components/admin-portal/statusPresentation";
import { viewerRoleLabel, viewerRoleSummary } from "@/components/admin-portal/roleLabel";
import { createAdminServices } from "@/services/adminDemo";
import { loadAuditPage } from "@/services/auditLog";
import { RpcError, type RpcClient } from "@/services/tenantScope";
import { isAccessDenied } from "@/components/admin-portal/AccessDenied";
import type { OwnedStore } from "@/types/adminDemo";

const row = (over: Partial<RawAuditRow>): RawAuditRow => ({ id: 1, occurred_at: "2026-11-19T09:25:42Z", action: "update", table_name: "x", business_id: null, ...over });
const OWNER = "11111111-1111-4111-8111-111111111111", OTHER = "22222222-2222-4222-8222-222222222222";
const A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

describe("audit wording (presentation only)", () => {
  it("a completed removal request reads as SCHEDULED; the actual removal is the pharmacy record becoming removed", () => {
    const scheduled = describeAudit(row({ table_name: "store_operations", detail: { kind: "store_removal", store: "Store 03", state_from: "requested", state_to: "completed" } }));
    expect(scheduled).toEqual({ what: "Store removal scheduled", details: "Store 03 · leaves at the end of the billing period", category: "stores" });
    expect(scheduled.what).not.toMatch(/completed/i);
    expect(describeAudit(row({ table_name: "store_operations", detail: { kind: "store_removal_undo", store: "Store 03", state_from: "requested", state_to: "completed" } })).what).toBe("Store kept (removal cancelled)");
    expect(describeAudit(row({ table_name: "businesses", detail: { store: "Store 03", status_from: "active", status_to: "removed" } }))).toEqual({ what: "Store removed", details: "Store 03", category: "stores" });
  });
  it("admin handover: the owner (known because the viewer is the owner) keeps ownership; a known non-owner shows the role change", () => {
    const handover = { table_name: "user_businesses", detail: { user_id: OWNER, role_from: "admin", role_to: "member", person_name: "Moose Dev" } };
    const owner = describeAudit(row({ ...handover, ownerUserId: OWNER }));
    expect(owner.what).toBe("Store admin role delegated");
    expect(owner.details).toBe("Moose Dev (account owner) delegated the Store admin role. Account ownership and billing are unchanged.");
    expect(owner.details).not.toMatch(/→ Member/);
    const other = describeAudit(row({ ...handover, detail: { ...handover.detail, user_id: OTHER, person_name: "Pepper" }, ownerUserId: OWNER }));
    expect(other).toMatchObject({ what: "Store admin role handed over", details: "Pepper: Store admin → Member" });
    const unknown = describeAudit(row(handover));
    expect(unknown.details).toMatch(/do not change account ownership/);
    expect(unknown.details).not.toMatch(/→ Member/);
    expect(describeAudit(row({ table_name: "user_businesses", detail: { user_id: OTHER, role_from: "member", role_to: "admin", person_name: "Happy" } })).what).toBe("Store admin appointed");
  });
  it("system actors are named from the row's table; a person is never invented", () => {
    expect(actorLabel(row({ table_name: "store_invitations", actor_kind: "system" }))).toBe("System (invitation email)");
    expect(actorLabel(row({ table_name: "subscriptions", actor_kind: "system" }))).toBe("System (billing)");
    expect(actorLabel(row({ table_name: "store_operations", actor_kind: "system" }))).toBe("System (billing or scheduler)");
    expect(actorLabel(row({ table_name: "audit_logs", actor_kind: "system" }))).toBe("System (automatic)");
    expect(actorLabel(row({ table_name: "store_invitations", actor_kind: "person", actor: { name: "Tony", email: null } }))).toBe("Tony");
    expect(actorLabel(row({ table_name: "store_invitations", actor_kind: "unknown" }))).toBe("Not recorded");
  });
  it("loadAuditPage marks the owner only in the owner's own scope", async () => {
    const calls: string[] = [];
    const client: RpcClient = { rpc: async (fn: string, args?: Record<string, unknown>) => {
      calls.push(fn);
      if (fn === "tenant_stores") return { data: [{ id: A, account_id: "acc1", name: "Store 01", capability: "owner" }, { id: B, account_id: "acc2", name: "Other 01", capability: "admin" }], error: null };
      return { data: { rows: [{ id: args?.p_business_id === A ? 9 : 8, occurred_at: "2026-11-19T09:00:00Z", action: "update", table_name: "user_businesses", business_id: args?.p_business_id, detail: {} }] }, error: null };
    } };
    // listTenantStores is mocked file-wide below (navbar tests); give it the same two scopes.
    mockTenant = [{ id: A, account_id: "acc1", name: "Store 01", capability: "owner" }, { id: B, account_id: "acc2", name: "Other 01", capability: "admin" }];
    const page = await loadAuditPage({ includeReads: false, viewerId: OWNER }, client);
    expect(page.rows.find((r) => r.business_id === A)?.ownerUserId).toBe(OWNER);
    expect(page.rows.find((r) => r.business_id === B)?.ownerUserId).toBeUndefined();
  });
});

describe("store admins: withheld billing is not a subscription failure", () => {
  const rpcBy = (data: unknown): RpcClient => ({ rpc: async () => ({ data, error: null }) });
  it("an absent subscription field maps to owner_managed: neutral pill, never 'needs attention'", async () => {
    const [store] = await createAdminServices(rpcBy([{ id: A, name: "Store 01", ncpdp: "1234567", npi: "1234567893", status: "active", member_count: 2 }])).ownerStoresService.listMyStores();
    expect(store.subscriptionStatus).toBe("owner_managed");
    expect(storeNeedsAttention(store)).toBe(false);
    expect(storeStatusPill(store)).toEqual({ tone: "success", label: "Active" });
    expect(subscriptionPill.owner_managed).toEqual({ tone: "neutral", label: "Managed by owner" });
  });
  it("the owner's real problems still count; a suspended store still needs attention for the admin", async () => {
    const base: OwnedStore = { storeId: A, name: "S", ncpdp: "1", npi: "2", status: "active", subscriptionStatus: "past_due", memberCount: 1 };
    expect(storeNeedsAttention(base)).toBe(true);
    expect(storeNeedsAttention({ ...base, subscriptionStatus: "unavailable" })).toBe(true);
    expect(storeNeedsAttention({ ...base, subscriptionStatus: "owner_managed", status: "suspended" })).toBe(true);
  });
});

describe("access denied", () => {
  it("recognises the database refusal and store-scope refusals, but not transient failures", () => {
    expect(isAccessDenied(new RpcError("not an administrator of business", "42501"))).toBe(true);
    expect(isAccessDenied(new RpcError("permission denied", "42501"))).toBe(true);
    expect(isAccessDenied(new Error("not an administrator of business"))).toBe(true);
    expect(isAccessDenied(new Error("Select a permitted store to load data."))).toBe(true);
    expect(isAccessDenied(new Error("Failed to fetch"))).toBe(false);
    expect(isAccessDenied(new RpcError("timeout", "57014"))).toBe(false);
  });
});

// ---------------------------------------------------------------- screens
const mockStores = { getStore: jest.fn(), listMembers: jest.fn() };
jest.mock("@/services/adminDemo", () => {
  const actual = jest.requireActual("@/services/adminDemo");
  return { ...actual, ownerStoresService: { getStore: (id: string) => mockStores.getStore(id) }, storeMemberService: { listMembers: (id: string) => mockStores.listMembers(id), listPendingInvites: async () => [] } };
});
jest.mock("@/components/admin-portal/MemberRoster", () => ({ __esModule: true, default: () => <div /> }));
jest.mock("@/components/admin-portal/LiveStaffPanel", () => ({ __esModule: true, default: () => <div /> }));
jest.mock("@/components/admin-portal/InviteMemberForm", () => ({ __esModule: true, default: () => <div /> }));

import StoreDetailScreen from "@/components/admin-portal/StoreDetailScreen";
import InviteScreen from "@/components/admin-portal/InviteScreen";

describe("access-denied screens", () => {
  beforeEach(() => { mockStores.getStore.mockReset(); mockStores.listMembers.mockReset(); });
  it.each([["store detail", StoreDetailScreen], ["invite", InviteScreen]])("%s: a clear denied state with Back to My Stores, no Retry, no store details", async (_n, Screen) => {
    mockStores.getStore.mockRejectedValue(new RpcError("not an administrator of business", "42501"));
    mockStores.listMembers.mockRejectedValue(new RpcError("not an administrator of business", "42501"));
    render(<Screen storeId={A} />);
    const denied = await screen.findByTestId("access-denied");
    expect(within(denied).getByText("You don't have access to this store")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to My Stores" })).toHaveAttribute("href", "/admin-portal");
    expect(screen.queryByText(/not an administrator/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
  });
  it("a transient failure keeps the Retry action", async () => {
    mockStores.getStore.mockRejectedValue(new Error("Failed to fetch"));
    mockStores.listMembers.mockResolvedValue([]);
    render(<StoreDetailScreen storeId={A} />);
    expect(await screen.findByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(screen.queryByTestId("access-denied")).not.toBeInTheDocument();
  });
  it("a store admin sees 'Billing managed by owner', not a subscription warning", async () => {
    mockStores.getStore.mockResolvedValue({ storeId: A, name: "Store 01", ncpdp: "1234567", npi: "1234567893", status: "active", subscriptionStatus: "owner_managed", memberCount: 2 });
    mockStores.listMembers.mockResolvedValue([]);
    render(<StoreDetailScreen storeId={A} />);
    expect(await screen.findByText("Billing managed by owner")).toBeInTheDocument();
    expect(screen.queryByText(/Subscription Unavailable/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------- navbar identity
let mockTenant: unknown[] | Error = [];
jest.mock("@/services/tenantScope", () => {
  const actual = jest.requireActual("@/services/tenantScope");
  return { ...actual, isDemoMode: () => false, listTenantStores: async () => { if (mockTenant instanceof Error) throw mockTenant; return mockTenant; } };
});
jest.mock("@/store/useAuthStore", () => ({ useAuthStore: Object.assign(jest.fn(), { getState: () => ({ logout: jest.fn() }) }) }));
jest.mock("@/components/global/ThemeToggler", () => ({ __esModule: true, default: () => <span /> }));
jest.mock("@/utils/supabase/client", () => ({ createClient: () => ({ auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) } }) }));
import Navbar from "@/components/global/Navbar";
import { AppRole } from "@/utils/app-role";

describe("navbar identity", () => {
  const user = (over: Partial<SupabaseUser>) => ({ id: OWNER, email: "moose+alpha01-owner@example.invalid", user_metadata: {}, ...over }) as SupabaseUser;
  it("shows the name and the role from tenant_stores, never the email in the bar; the email stays in the menu", async () => {
    mockTenant = [{ id: A, account_id: "acc1", name: "Store 01", capability: "owner" }, { id: B, account_id: "acc2", name: "Other", capability: "member" }];
    render(<Navbar user={user({ user_metadata: { full_name: "Moose Dev" } })} role={AppRole.MEMBER} />);
    const bar = screen.getByTestId("nav-identity");
    expect(within(bar).getByText("Moose Dev")).toBeInTheDocument();
    const badge = await within(bar).findByTestId("nav-role-badge");
    expect(badge).toHaveTextContent("Owner");
    expect(badge).toHaveAttribute("title", "Owner of 1 pharmacy · Member of 1 pharmacy");
    expect(within(bar).queryByText(/@/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(within(screen.getByRole("dialog")).getByText("moose+alpha01-owner@example.invalid")).toBeInTheDocument();
  });
  it("an alias that looks like an admin is not given a badge it lacks: the badge follows tenant_stores only", async () => {
    mockTenant = [{ id: A, account_id: "acc1", name: "Store 01", capability: "member" }];
    render(<Navbar user={user({ email: "moose+alpha01-admin@example.invalid" })} role={AppRole.ADMIN} />);
    expect(await screen.findAllByTestId("nav-role-badge")).not.toHaveLength(0);
    for (const b of screen.getAllByTestId("nav-role-badge")) expect(b).toHaveTextContent(/^Member/);
    expect(screen.getAllByText("Your account").length).toBeGreaterThan(0);   // honest fallback, not the email local-part
    expect(screen.queryByRole("link", { name: "Admin Portal" })).not.toBeInTheDocument();
  });
  it("no badge when the role cannot be read", async () => {
    mockTenant = new Error("Store access is unavailable. Please retry.");
    render(<Navbar user={user({})} role={AppRole.MEMBER} />);
    await waitFor(() => expect(screen.queryByTestId("nav-role-badge")).not.toBeInTheDocument());
  });
  it("role label and scope helpers", () => {
    expect(viewerRoleLabel([{ capability: "admin" }, { capability: "member" }])).toBe("Store admin");
    expect(viewerRoleSummary([{ capability: "admin" }, { capability: "admin" }])).toBe("Store admin of 2 pharmacies");
    expect(viewerRoleLabel([])).toBeNull();
  });
});
