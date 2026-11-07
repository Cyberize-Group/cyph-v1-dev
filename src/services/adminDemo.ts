import { isDemoMode, listTenantStores, readRpc, requireStore, unavailableMessage, type RpcClient } from "./tenantScope";
import { useAdminDemoStore } from "@/store/useAdminDemoStore";
import type {
  ActionResult,
  AuditEntry,
  BillingLine,
  CurrentOwner,
  MemberRole,
  OwnedStore,
  PharmacySettings,
  StoreMember,
} from "@/types/adminDemo";

// ─────────────────────────────────────────────────────────────────────────────
// Admin Portal Demo Shell — service layer (the SOLE Phase-7 swap point).
//
// Components call ONLY these services — never the Zustand store, never /mocks.
// In the demo, bodies read/mutate the in-memory store via its vanilla getState()
// API (the same pattern Navbar uses for useAuthStore.getState()). At Phase 7 the
// bodies become Supabase + RLS + Stripe; these signatures stay FROZEN.
//
// HARD INVARIANTS held here in code (and asserted in the tests):
//   • inviteMember takes { email, role, jobTitle? } only — NEVER a password.
//   • managePayment / cancelSubscription never charge — mock result only.
//   • Everything owner-scoped — no method takes an ownerId or crosses tenants.
//   • Every STATE-MUTATING action appends an AuditEntry. (Billing actions are
//     visual-only and the AuditAction vocab has no billing verb → they append
//     nothing — deliberate, see BillingService.)
// ─────────────────────────────────────────────────────────────────────────────

// Vanilla store access (non-React call sites).
const store = () => useAdminDemoStore.getState();

// Demo-local id generators. Uniqueness only — not stable across reloads.
let memberSeq = 0;
let storeSeq = 0;
let auditSeq = 0;
const nextMemberId = () => `member-gen-${(memberSeq += 1)}`;
const nextStoreId = () => `store-gen-${(storeSeq += 1)}`;
const nextAuditId = () => `audit-gen-${(auditSeq += 1)}`;

// Avatar initials from a display name (falls back to the email's first letter).
const initialsFrom = (nameOrEmail: string): string => {
  const parts = nameOrEmail.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] ?? nameOrEmail[0] ?? "?").toUpperCase();
};

// Human label for an audit row given a member.
const memberLabel = (m: StoreMember | undefined, fallback: string): string =>
  m ? m.name || m.email : fallback;

// ── §4. Service contracts ────────────────────────────────────────────────────

export interface OwnerStoresService {
  getOwner(): Promise<CurrentOwner>;
  listMyStores(params?: { search?: string }): Promise<OwnedStore[]>;
  getStore(storeId: string): Promise<OwnedStore>;
  addStore(): Promise<OwnedStore>;
}

export interface StoreMemberService {
  listMembers(storeId: string, params?: { search?: string }): Promise<StoreMember[]>;
  listPendingInvites(storeId: string): Promise<StoreMember[]>;
  // INVITE ONLY — the input type has no password key, by design (the one hard rule).
  inviteMember(input: {
    storeId: string;
    email: string;
    role: MemberRole;
    jobTitle?: string;
  }): Promise<ActionResult>;
  resendInvite(memberId: string): Promise<ActionResult>;
  suspendMember(memberId: string): Promise<ActionResult>;
  unsuspendMember(memberId: string): Promise<ActionResult>;
  sendRecovery(memberId: string): Promise<ActionResult>;
}

export interface BillingService {
  listBilling(): Promise<BillingLine[]>;
  // VISUAL ONLY — no checkout, no charge, no state change.
  managePayment(storeId: string): Promise<ActionResult>;
  cancelSubscription(storeId: string): Promise<ActionResult>;
}

export interface SettingsService {
  getSettings(storeId: string): Promise<PharmacySettings>;
  saveSettings(settings: PharmacySettings): Promise<ActionResult>;
}

export interface AuditService {
  listAudit(): Promise<AuditEntry[]>;
  append(entry: Omit<AuditEntry, "id" | "occurredAt">): Promise<AuditEntry>;
}

// ── Audit (internal-ish: other services call append after a mutation) ─────────

export const mockAuditService: AuditService = {
  /**
   * The owner's own action ledger (newest first).
   * BACKEND_SWAP_NOTES (Phase 7): SELECT FROM audit_log WHERE owner = me, RLS-scoped.
   */
  async listAudit() {
    return store().audit;
  },

  /**
   * Stamp an id + occurredAt and record the entry. Called by the other services
   * after every state mutation — not by components.
   * BACKEND_SWAP_NOTES (Phase 7): INSERT INTO audit_log; the server stamps id/time.
   */
  async append(entry) {
    const full: AuditEntry = {
      ...entry,
      id: nextAuditId(),
      occurredAt: new Date().toISOString(),
    };
    store().appendAudit(full);
    return full;
  },
};

// ── Owner + stores ────────────────────────────────────────────────────────────

export const mockOwnerStoresService: OwnerStoresService = {
  /**
   * The single logged-in owner. Owner-scoped: there is no ownerId parameter.
   * BACKEND_SWAP_NOTES (Phase 7): derive from the authed session, not a param.
   */
  async getOwner() {
    return store().owner;
  },

  /**
   * The owner's own stores ("my stores"). No cross-tenant listing exists.
   * BACKEND_SWAP_NOTES (Phase 7): SELECT my stores, RLS-scoped; search → SQL ILIKE.
   */
  async listMyStores(params) {
    const q = params?.search?.trim().toLowerCase();
    const stores = store().stores;
    if (!q) return stores;
    return stores.filter((s) => s.name.toLowerCase().includes(q));
  },

  /**
   * One owned store by id. Fails loud if it isn't the owner's (no silent null).
   * BACKEND_SWAP_NOTES (Phase 7): SELECT … WHERE id = $1, RLS-scoped.
   */
  async getStore(storeId) {
    const found = store().stores.find((s) => s.storeId === storeId);
    if (!found) throw new Error(`Store not found: ${storeId}`);
    return found;
  },

  /**
   * MOCK: drops a fresh store card so the demo feels alive. NO Stripe, NO charge.
   * BACKEND_SWAP_NOTES (Phase 7): real add-store + Stripe checkout (payment-creates-account).
   * The demo's harvest form proposes these new-store fields — name / NCPDP / NPI /
   * address — to elicit the real requirement from the domain expert; this signature stays no-arg
   * until that contract is locked, so those typed values are not yet persisted.
   */
  async addStore() {
    const newStore: OwnedStore = {
      storeId: nextStoreId(),
      name: "New Pharmacy",
      ncpdp: "0000000",
      npi: "0000000000",
      status: "active",
      subscriptionStatus: "active",
      memberCount: 0,
    };
    store().addStore(newStore);
    await mockAuditService.append({
      action: "added_store",
      target: newStore.name,
      result: "done",
    });
    return newStore;
  },
};

// ── Members (invite-only) ─────────────────────────────────────────────────────

export const mockStoreMemberService: StoreMemberService = {
  /**
   * Roster for one store, optionally filtered by a name/email search.
   * BACKEND_SWAP_NOTES (Phase 7): SELECT members WHERE store = $1, RLS-scoped.
   */
  async listMembers(storeId, params) {
    const q = params?.search?.trim().toLowerCase();
    const rows = store().members.filter((m) => m.storeId === storeId);
    if (!q) return rows;
    return rows.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  },

  /**
   * The store's outstanding invites (accountStatus === 'invite_pending').
   * BACKEND_SWAP_NOTES (Phase 7): SELECT … WHERE status = 'invite_pending'.
   */
  async listPendingInvites(storeId) {
    return store().members.filter(
      (m) => m.storeId === storeId && m.accountStatus === "invite_pending"
    );
  },

  /**
   * THE ONE HARD RULE, IN CODE: invite by email + role only. There is NO password
   * parameter — a new member starts as 'invite_pending' with no credential.
   * BACKEND_SWAP_NOTES (Phase 7): real Supabase invite (magic link) + RLS; STILL no
   * password set here — the invitee sets their own credential out of band.
   */
  async inviteMember({ storeId, email, role, jobTitle }) {
    const member: StoreMember = {
      memberId: nextMemberId(),
      storeId,
      name: "",
      email,
      initials: initialsFrom(email),
      jobTitle,
      role,
      accountStatus: "invite_pending",
      invitedAt: new Date().toISOString(),
    };
    store().addMember(member);
    await mockAuditService.append({
      action: "invited_member",
      target: email,
      result: "done",
    });
    return { ok: true, message: `Invite sent to ${email}` };
  },

  /**
   * Re-send an outstanding invite. Mock: toast only; no credential involved.
   * BACKEND_SWAP_NOTES (Phase 7): re-trigger the Supabase invite email.
   */
  async resendInvite(memberId) {
    const m = store().members.find((x) => x.memberId === memberId);
    await mockAuditService.append({
      action: "resent_invite",
      target: memberLabel(m, memberId),
      result: "done",
    });
    return { ok: true, message: "Invite re-sent" };
  },

  /**
   * Suspend a member (flips the account pill to SUSPENDED).
   * BACKEND_SWAP_NOTES (Phase 7): UPDATE members SET status = 'suspended', RLS-scoped.
   */
  async suspendMember(memberId) {
    const m = store().members.find((x) => x.memberId === memberId);
    store().setMemberStatus(memberId, "suspended");
    await mockAuditService.append({
      action: "suspended_member",
      target: memberLabel(m, memberId),
      result: "done",
    });
    return { ok: true, message: "Member suspended" };
  },

  /**
   * Un-suspend a member (flips the pill back to ACTIVE).
   * BACKEND_SWAP_NOTES (Phase 7): UPDATE members SET status = 'active', RLS-scoped.
   */
  async unsuspendMember(memberId) {
    const m = store().members.find((x) => x.memberId === memberId);
    store().setMemberStatus(memberId, "active");
    await mockAuditService.append({
      action: "unsuspended_member",
      target: memberLabel(m, memberId),
      result: "done",
    });
    return { ok: true, message: "Member un-suspended" };
  },

  /**
   * Send an account-recovery link. Mock: toast only; no password is set or shown.
   * BACKEND_SWAP_NOTES (Phase 7): trigger Supabase password-recovery email.
   */
  async sendRecovery(memberId) {
    const m = store().members.find((x) => x.memberId === memberId);
    await mockAuditService.append({
      action: "sent_recovery",
      target: memberLabel(m, memberId),
      result: "done",
    });
    return { ok: true, message: "Recovery link sent" };
  },
};

// ── Billing (VISUAL ONLY — never charges) ─────────────────────────────────────

export const mockBillingService: BillingService = {
  /**
   * Per-store billing lines (display strings — demo, not real money).
   * BACKEND_SWAP_NOTES (Phase 7): join Stripe subscriptions; amounts become real.
   */
  async listBilling() {
    return store().billing;
  },

  /**
   * VISUAL ONLY. Opens a mock "manage payment" dialog — no checkout, no charge,
   * no state change, no audit entry (the AuditAction vocab has no billing verb).
   * BACKEND_SWAP_NOTES (Phase 7): open the real Stripe customer portal.
   */
  async managePayment(_storeId) {
    return { ok: true, message: "Opening payment management (demo — no charge)" };
  },

  /**
   * VISUAL ONLY. Mock cancel dialog — no real cancellation, no charge, no state
   * change, no audit entry.
   * BACKEND_SWAP_NOTES (Phase 7): real Stripe subscription cancel.
   */
  async cancelSubscription(_storeId) {
    return { ok: true, message: "Subscription cancel (demo — no charge)" };
  },
};

// ── Settings (in-memory) ──────────────────────────────────────────────────────

export const mockSettingsService: SettingsService = {
  /**
   * One store's pharmacy settings. Fails loud if missing (no silent null).
   * BACKEND_SWAP_NOTES (Phase 7): SELECT settings WHERE store = $1, RLS-scoped.
   */
  async getSettings(storeId) {
    const found = store().settings.find((s) => s.storeId === storeId);
    if (!found) throw new Error(`Settings not found for store: ${storeId}`);
    return found;
  },

  /**
   * Save edits in-memory (refresh resets — by design).
   * BACKEND_SWAP_NOTES (Phase 7): UPDATE pharmacy_settings, RLS-scoped.
   */
  async saveSettings(settings) {
    store().setSettings(settings);
    await mockAuditService.append({
      action: "updated_settings",
      target: settings.pharmacyName,
      result: "done",
    });
    return { ok: true, message: "Settings saved" };
  },
};

// Real admin reads are capability-scoped server RPCs. No client business mutation.
export function createAdminServices(client?: RpcClient) {
  const unavailable = async (): Promise<ActionResult> => ({ ok: false, message: unavailableMessage });
  const denied = async (): Promise<never> => { throw new Error(unavailableMessage); };
  type StoreRecord = { id: string; name: string; ncpdp: string | null; npi: string | null; status: string; subscription_status: string | null; member_count: number };
  const subscription = (value: string | null): OwnedStore["subscriptionStatus"] =>
    ["active", "past_due", "canceled", "trialing", "unpaid", "incomplete", "incomplete_expired", "paused"].includes(value || "") ? value as OwnedStore["subscriptionStatus"] : "unavailable";
  const mapStore = (s: StoreRecord): OwnedStore => ({ storeId: s.id, name: s.name, ncpdp: s.ncpdp ?? "Unavailable", npi: s.npi ?? "Unavailable", status: s.status === "active" || s.status === "suspended" ? s.status : "unavailable", subscriptionStatus: subscription(s.subscription_status), memberCount: Number(s.member_count) });
  const stores: OwnerStoresService = {
    async getOwner() {
      const connection = (await import("@/utils/supabase/client")).createClient();
      const {data, error} = await connection.auth.getUser();
      if (error || !data.user) throw new Error("Sign in to view your stores.");
      return { ownerId: data.user.id, name: data.user.user_metadata?.full_name || data.user.email || "Account", email: data.user.email || "", initials: initialsFrom(data.user.email || "Account") };
    },
    async listMyStores(params) {
      const rows = (await readRpc<StoreRecord[]>("admin_stores", {}, client)).map(mapStore);
      const search = params?.search?.trim().toLowerCase();
      return search ? rows.filter(s => s.name.toLowerCase().includes(search)) : rows;
    },
    async getStore(id) {
      const rows = await readRpc<StoreRecord[]>("admin_stores", {p_business_id: requireStore(id)}, client);
      if (rows.length !== 1 || rows[0].id !== id) throw new Error("Store unavailable.");
      return mapStore(rows[0]);
    },
    addStore: denied,
  };
  const members: StoreMemberService = {
    async listMembers(id, params) {
      const rows = await readRpc<{id:string;business_id:string;name:string|null;email:string|null;role:MemberRole}[]>("admin_members", {p_business_id: requireStore(id)}, client);
      const mapped = rows.map(m => ({memberId:m.id,storeId:m.business_id,name:m.name || "",email:m.email || "Unavailable",initials:initialsFrom(m.name || m.email || "?"),role:m.role,accountStatus:"unavailable" as const}));
      const q = params?.search?.trim().toLowerCase();
      return q ? mapped.filter(m => (m.name+" "+m.email).toLowerCase().includes(q)) : mapped;
    },
    listPendingInvites: denied, inviteMember: unavailable, resendInvite: unavailable, suspendMember: unavailable, unsuspendMember: unavailable, sendRecovery: unavailable,
  };
  const billing: BillingService = {
    async listBilling() {
      const permitted = await stores.listMyStores();
      return Promise.all(permitted.map(async s => {
        const b = await readRpc<{account_id:string;subscriptions:{status:string;current_period_end:string|null}[]}>("admin_billing_status", {p_business_id:s.storeId}, client);
        const latest = b.subscriptions.at(-1);
        return {storeId:s.storeId,storeName:s.name,plan:"unavailable" as const,subscriptionStatus:subscription(latest?.status ?? null),amountLabel:"Price unavailable"};
      }));
    },
    managePayment: unavailable, cancelSubscription: unavailable,
  };
  const audit: AuditService = {
    async listAudit() {
      const scope = (await listTenantStores(client)).filter(s => s.capability !== "member");
      if (!scope.length) throw new Error("Audit access unavailable for this account.");
      const seen = new Set<string>();
      const selected = scope.filter(s => {const key=s.capability === "owner" ? s.account_id : s.id; if(seen.has(key)) return false; seen.add(key);return true;});
      const results = await Promise.all(selected.map(s => readRpc<{rows:{id:number;occurred_at:string;action:AuditEntry["action"];table_name:string;business_id:string|null}[]}>("admin_audit", {p_business_id:s.id,p_limit:100}, client)));
      return results.flatMap(r=>r.rows.map(a=>({id:String(a.id),occurredAt:a.occurred_at,action:a.action,target:a.table_name+" · "+(scope.find(s=>s.id===a.business_id)?.name || "Account event"),result:"done" as const}))).sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));
    },
    append: denied,
  };
  const settings: SettingsService = {
    async getSettings(id) {const s=await stores.getStore(id);return {storeId:id,pharmacyName:s.name,contactPerson:"Unavailable",phone:"Unavailable",address:"Unavailable",pharmacySoftware:"Unavailable"};},
    saveSettings: unavailable,
  };
  return {ownerStoresService:stores,storeMemberService:members,billingService:billing,auditService:audit,settingsService:settings};
}
const real = createAdminServices();
function selectService<T extends object>(demo:T, live:T):T {
  return new Proxy(demo,{get(target,key){return Reflect.get(isDemoMode()?target:live,key);}});
}
export const ownerStoresService = selectService(mockOwnerStoresService,real.ownerStoresService);
export const storeMemberService = selectService(mockStoreMemberService,real.storeMemberService);
export const billingService = selectService(mockBillingService,real.billingService);
export const auditService = selectService(mockAuditService,real.auditService);
export const settingsService = selectService(mockSettingsService,real.settingsService);
