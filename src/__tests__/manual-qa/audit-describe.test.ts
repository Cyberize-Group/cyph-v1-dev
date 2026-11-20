// Manual QA 19 Nov 2026 (R8) — readable audit wording from recorded facts only, honest fallbacks, explicit timezone.
import { actorLabel, describeAudit, formatLocalTime, type RawAuditRow } from "@/components/admin-portal/auditDescribe";
const row = (over: Partial<RawAuditRow>): RawAuditRow => ({ id: 1, occurred_at: "2026-11-19T09:25:42Z", action: "update", table_name: "x", business_id: null, ...over });

describe("describeAudit", () => {
  it.each([
    [{ table_name: "store_invitations", action: "insert", detail: { email: "m@x.invalid", role: "member" } }, "Invitation sent", "m@x.invalid as Member"],
    [{ table_name: "store_invitations", detail: { email: "m@x.invalid", role: "member", status_from: "pending", status_to: "accepted" } }, "Invitation accepted", "m@x.invalid as Member"],
    [{ table_name: "store_invitations", detail: { status_from: "pending", status_to: "revoked", reason: "member_removed" } }, "Invitation revoked (the person's access was removed)", ""],
    [{ table_name: "store_invitations", detail: { email: "m@x.invalid", sent: true } }, "Invitation email sent", "m@x.invalid"],
    [{ table_name: "user_businesses", action: "delete", detail: { role_from: "member", person_email: "m@x.invalid" } }, "Access removed", "m@x.invalid (was Member)"],
    [{ table_name: "user_businesses", action: "insert", detail: { role_to: "member", person_name: "Mia" } }, "Access granted", "Mia as Member"],
    // Manual QA 20 Nov 2026: whether Tony owns the account is unknown here, so the wording never suggests ownership was lost.
    [{ table_name: "user_businesses", detail: { role_from: "admin", role_to: "member", person_name: "Tony" } }, "Store admin role handed over", "Tony is no longer this store's Store admin. Store roles do not change account ownership."],
    [{ table_name: "businesses", detail: { store: "Store 02", removal_changed: true } }, "Store removal cancelled", "Store 02"],
    [{ table_name: "subscriptions", detail: { cancel_from: "false", cancel_to: "true" } }, "Subscription cancellation scheduled", ""],
    [{ table_name: "subscriptions", detail: { cancel_from: "true", cancel_to: "false" } }, "Subscription cancellation undone", ""],
    [{ table_name: "subscriptions", detail: { quantity_from: "2", quantity_to: "1" } }, "Pharmacies billed at renewal changed", "2 → 1"],
    [{ table_name: "store_operations", detail: { kind: "store_add", store: "S2", state_from: "paid_pending_activation", state_to: "activated" } }, "Add pharmacy: store added (payment confirmed)", "S2"],
    [{ table_name: "user_businesses", detail: {} }, "Store access updated", ""],
    [{ table_name: "report_files", action: "insert" }, "Record created: report file", ""],
    [{ table_name: "mystery_table", action: "delete" }, "Record deleted: mystery table", ""],
    [{ action: "read_page", table_name: "audit_logs", context: { fn: "admin_audit" } }, "Viewed the audit log", ""],
  ])("%j", (over, what, details) => {
    const d = describeAudit(row(over as Partial<RawAuditRow>));
    expect(d.what).toBe(what); expect(d.details).toBe(details);
  });
  it("a scheduled removal names the store and the day; lease-only operation updates are system steps", () => {
    expect(describeAudit(row({ table_name: "businesses", detail: { store: "S2", removal_changed: true, removal_to: "2026-12-19T00:00:00Z" } })).details).toMatch(/^S2 · leaves on /);
    expect(describeAudit(row({ table_name: "store_operations", detail: { kind: "store_add", state_from: "payment_pending", state_to: "payment_pending" } })).category).toBe("system");
  });
});

describe("actorLabel", () => {
  it("never invents a person", () => {
    expect(actorLabel(row({ actor: { name: "Tony", email: "t@x.invalid" }, actor_kind: "person" }))).toBe("Tony");
    // Manual QA 20 Nov 2026: the automatic process is named from the row's table, or generically.
    expect(actorLabel(row({ actor: null, actor_kind: "system" }))).toBe("System (automatic)");
    expect(actorLabel(row({}))).toBe("Not recorded");
  });
});

describe("formatLocalTime", () => {
  it("converts the stored UTC instant to the viewer's zone and labels it (Dhaka is UTC+6)", () => {
    const s = formatLocalTime("2026-11-19T09:25:42Z", "Asia/Dhaka");
    expect(s).toMatch(/3:25/); expect(s).toMatch(/GMT\+6/);
    expect(formatLocalTime("2026-11-19T09:25:42Z", "UTC")).toMatch(/9:25.*UTC/);
  });
});
