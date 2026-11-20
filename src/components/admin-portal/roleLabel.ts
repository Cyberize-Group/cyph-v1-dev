// Manual QA 19 Nov 2026 (R5): one wording for people's roles everywhere in the Admin Portal. The account owner is always
// "Owner" (accounts.owner_user_id, surfaced by the server as is_owner) — whatever their store membership row says.
import type { StoreMember } from "@/types/adminDemo";
import type { TenantStore } from "@/services/tenantScope";

export const memberRoleLabel = (m: Pick<StoreMember, "role" | "isOwner">): "Owner" | "Store admin" | "Member" =>
  m.isOwner ? "Owner" : m.role === "admin" ? "Store admin" : "Member";

/** The signed-in person's own role across their stores: Owner if they own any, else Store admin if they manage any. */
export const viewerRoleLabel = (stores: Pick<TenantStore, "capability">[]): "Owner" | "Store admin" | "Member" | null =>
  stores.some((s) => s.capability === "owner") ? "Owner" : stores.some((s) => s.capability === "admin") ? "Store admin" : stores.length ? "Member" : null;

/**
 * Manual QA 20 Nov 2026 (navbar identity): the scope behind the badge, e.g. "Owner of 3 pharmacies · Member of 1 pharmacy",
 * so a single badge never implies authority over stores where the person holds a lesser role.
 */
export const viewerRoleSummary = (stores: Pick<TenantStore, "capability">[]): string => {
  const words: [TenantStore["capability"], string][] = [["owner", "Owner"], ["admin", "Store admin"], ["member", "Member"]];
  return words
    .map(([cap, word]) => [word, stores.filter((s) => s.capability === cap).length] as const)
    .filter(([, n]) => n > 0)
    .map(([word, n]) => `${word} of ${n} ${n === 1 ? "pharmacy" : "pharmacies"}`)
    .join(" · ");
};
