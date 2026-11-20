// Manual QA 19 Nov 2026 (R8): turn one audit row into words an owner understands. Only what the row actually records is
// used (table, action, and the server's whitelisted before/after detail, 0071). When the record does not say enough, the
// wording falls back to an honest generic line — no actor, event or outcome is invented.
export type AuditDetail = Record<string, string | boolean | undefined>;
export type RawAuditRow = {
  id: number; occurred_at: string; action: string; table_name: string; business_id: string | null;
  actor?: { name: string | null; email: string | null } | null; actor_kind?: "person" | "system" | "unknown";
  detail?: AuditDetail | null; context?: { fn?: string } | null;
  /** The account owner's user id, set only when the viewer is that owner (so it is known, not guessed). */
  ownerUserId?: string;
};
export type AuditCategory = "people" | "stores" | "billing" | "views" | "system" | "other";
export type DescribedAudit = { what: string; details: string; category: AuditCategory };

const TABLE_WORDS: Record<string, string> = {
  store_invitations: "invitation", user_businesses: "store access", businesses: "pharmacy", subscriptions: "subscription",
  accounts: "account", store_operations: "store change", checkout_operations: "checkout", npi_reservations: "NPI reservation",
  billing_customers: "billing customer", user_data: "claims data", report_files: "report file", store_transfers: "store transfer",
  apa_memberships: "APA membership", pending_registrations: "registration",
};
const VIEW_WORDS: Record<string, string> = {
  admin_audit: "the audit log", admin_members: "the people list", admin_stores: "the store list", store_profile: "pharmacy details",
  admin_billing_status: "billing status", owner_billing_overview: "billing overview", owedbook_rows: "OwedBook rows",
  owedbook_kpis: "OwedBook totals", owedbook_summary: "the OwedBook summary", owedbook_pbm_options: "PBM options", owner_history_rows: "store history",
};
const roleWord = (r?: unknown) => (r === "admin" ? "Store admin" : r === "member" ? "Member" : typeof r === "string" ? r : "");
const person = (d: AuditDetail) => String(d.person_name || d.person_email || "a person");
const day = (iso?: unknown) => {
  if (typeof iso !== "string" || !iso) return "";
  const t = new Date(iso); return isNaN(t.getTime()) ? "" : t.toLocaleDateString(undefined, { dateStyle: "medium" });
};
const INVITE_STATUS: Record<string, string> = { accepted: "Invitation accepted", declined: "Invitation declined", expired: "Invitation expired", revoked: "Invitation revoked" };
const INVITE_REASON: Record<string, string> = { member_removed: "the person's access was removed", stale_incumbent: "the store admin changed", revoked_by_manager: "revoked by a manager" };
const OP_STATE: Record<string, string> = {
  payment_setup: "preparing payment", payment_pending: "waiting for payment", paid_pending_activation: "payment received, adding the store",
  activated: "store added (payment confirmed)", cancel_requested: "cancellation requested", expired_unpaid: "not added, nothing charged",
  attention: "needs support attention", closed_refunded_externally: "closed (refunded outside the app)", requested: "requested", completed: "completed",
};
const OP_KIND: Record<string, string> = { store_add: "Add pharmacy", store_removal: "Store removal", store_removal_undo: "Keep store (undo removal)" };

export function describeAudit(r: RawAuditRow): DescribedAudit {
  const d: AuditDetail = r.detail ?? {};
  const a = r.action;
  if (a === "read_page") return { what: `Viewed ${VIEW_WORDS[r.context?.fn ?? ""] ?? "data"}`, details: "", category: "views" };
  switch (r.table_name) {
    case "store_invitations": {
      const who = [d.email, d.role ? `as ${roleWord(d.role)}` : ""].filter(Boolean).join(" ");
      if (a === "insert") return { what: "Invitation sent", details: who, category: "people" };
      if (a === "update" && d.status_to && d.status_to !== d.status_from) {
        const reason = typeof d.reason === "string" && INVITE_REASON[d.reason] ? ` (${INVITE_REASON[d.reason]})` : "";
        return { what: (INVITE_STATUS[String(d.status_to)] ?? `Invitation ${d.status_to}`) + reason, details: who, category: "people" };
      }
      if (a === "update" && d.sent) return { what: "Invitation email sent", details: who, category: "people" };
      return { what: a === "delete" ? "Invitation deleted" : "Invitation updated", details: who, category: "people" };
    }
    case "user_businesses": {
      if (a === "insert") return { what: "Access granted", details: `${person(d)}${d.role_to ? ` as ${roleWord(d.role_to)}` : ""}`, category: "people" };
      if (a === "delete") return { what: "Access removed", details: `${person(d)}${d.role_from ? ` (was ${roleWord(d.role_from)})` : ""}`, category: "people" };
      if (d.role_from && d.role_to && d.role_from !== d.role_to) {
        if (d.role_to === "admin") return { what: "Store admin appointed", details: `${person(d)}: ${roleWord(d.role_from)} → ${roleWord(d.role_to)}`, category: "people" };
        // Manual QA 20 Nov 2026: handing over the Store admin role never changes account ownership (accounts.owner_user_id).
        // The owner is named as such only when that is known (the viewer is the owner); otherwise the wording stays neutral.
        const known = r.ownerUserId !== undefined;
        const isOwner = known && typeof d.user_id === "string" && d.user_id === r.ownerUserId;
        const details = isOwner
          ? `${person(d)} (account owner) delegated the Store admin role. Account ownership and billing are unchanged.`
          : known
            ? `${person(d)}: ${roleWord(d.role_from)} → ${roleWord(d.role_to)}`
            : `${person(d)} is no longer this store's Store admin. Store roles do not change account ownership.`;
        return { what: isOwner ? "Store admin role delegated" : "Store admin role handed over", details, category: "people" };
      }
      return { what: "Store access updated", details: d.person_name || d.person_email ? person(d) : "", category: "people" };
    }
    case "businesses": {
      const store = typeof d.store === "string" ? d.store : "";
      if (a === "insert") return { what: "Pharmacy added", details: store, category: "stores" };
      if (d.removal_changed) return d.removal_to
        ? { what: "Store removal scheduled", details: `${store}${day(d.removal_to) ? ` · leaves on ${day(d.removal_to)}` : ""}`, category: "stores" }
        : { what: "Store removal cancelled", details: store, category: "stores" };
      // The actual removal (at the period end) is the pharmacy record changing to "removed" — distinct from scheduling it.
      if (d.status_to === "removed" && d.status_from !== "removed") return { what: "Store removed", details: store, category: "stores" };
      if (d.status_to && d.status_to !== d.status_from) return { what: "Store status changed", details: `${store}: ${d.status_from ?? "?"} → ${d.status_to}`, category: "stores" };
      return { what: a === "delete" ? "Pharmacy deleted" : "Pharmacy record updated", details: store, category: "stores" };
    }
    case "subscriptions": {
      if (a === "insert") return { what: "Subscription started", details: "", category: "billing" };
      if (d.cancel_from !== undefined && d.cancel_to !== undefined && d.cancel_from !== d.cancel_to)
        return { what: d.cancel_to === "true" ? "Subscription cancellation scheduled" : "Subscription cancellation undone", details: "", category: "billing" };
      if (d.quantity_from !== undefined && d.quantity_to !== undefined && d.quantity_from !== d.quantity_to)
        return { what: "Pharmacies billed at renewal changed", details: `${d.quantity_from} → ${d.quantity_to}`, category: "billing" };
      if (d.status_to && d.status_to !== d.status_from) return { what: "Subscription status changed", details: `${d.status_from ?? "?"} → ${d.status_to}`, category: "billing" };
      return { what: "Subscription record updated", details: "", category: "system" };
    }
    case "store_operations": {
      const kind = OP_KIND[String(d.kind)] ?? "Store change"; const store = typeof d.store === "string" ? d.store : "";
      if (a === "insert") return { what: `${kind} started`, details: store, category: "stores" };
      // Manual QA 20 Nov 2026: a completed removal request means the removal was SCHEDULED for the end of the billing period;
      // the store itself leaves later (shown by the pharmacy's own record). An undo that completes keeps the store.
      if (d.state_to === "completed" && d.kind === "store_removal") return { what: "Store removal scheduled", details: `${store}${store ? " · " : ""}leaves at the end of the billing period`, category: "stores" };
      if (d.state_to === "completed" && d.kind === "store_removal_undo") return { what: "Store kept (removal cancelled)", details: store, category: "stores" };
      if (d.state_to && d.state_to !== d.state_from) return { what: `${kind}: ${OP_STATE[String(d.state_to)] ?? d.state_to}`, details: store, category: d.state_to === "activated" || d.state_to === "completed" || d.state_to === "expired_unpaid" || d.state_to === "attention" ? "stores" : "system" };
      return { what: `${kind}: processing step`, details: store, category: "system" };
    }
    default: {
      const word = TABLE_WORDS[r.table_name] ?? r.table_name.replace(/_/g, " ");
      const verb = a === "insert" ? "created" : a === "delete" ? "deleted" : "changed";
      return { what: `Record ${verb}: ${word}`, details: "", category: "other" };
    }
  }
}

const SYSTEM_ACTOR: Record<string, string> = {
  store_invitations: "System (invitation email)", subscriptions: "System (billing)", billing_customers: "System (billing)",
  checkout_operations: "System (billing)", store_operations: "System (billing or scheduler)", businesses: "System (billing or scheduler)",
};
export function actorLabel(r: RawAuditRow): string {
  if (r.actor && (r.actor.name || r.actor.email)) return String(r.actor.name || r.actor.email);
  // Manual QA 20 Nov 2026: name the automatic process from what the row records (its table), never a guessed person.
  if (r.actor_kind === "system") return SYSTEM_ACTOR[r.table_name] ?? "System (automatic)";
  return "Not recorded";
}

/** Local time with an explicit timezone label, e.g. "Nov 19, 2026, 3:25 PM GMT+6". The stored timestamp is not altered. */
export function formatLocalTime(iso: string, timeZone?: string): string {
  const t = new Date(iso);
  if (isNaN(t.getTime())) return iso;
  // dateStyle/timeStyle cannot be combined with timeZoneName (TypeError), so the parts are listed explicitly.
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short", ...(timeZone ? { timeZone } : {}) }).format(t);
}
