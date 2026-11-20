// Manual QA 19 Nov 2026 (R8): the Admin Portal audit log, one page at a time per permitted scope (the owner: once per
// account; a store admin: once per managed store), newest first. View events are excluded unless asked for. "Load older"
// continues each scope from its oldest loaded row (admin_audit p_before). Before 0071 the extra argument does not exist:
// the old call is used and view events are filtered from the loaded page only (detailed = false).
import type { RawAuditRow } from "@/components/admin-portal/auditDescribe";
import { listTenantStores, readRpc, type RpcClient } from "./tenantScope";

export const AUDIT_PAGE = 50;
export type AuditRow = RawAuditRow & { place: string };
export type AuditPage = { rows: AuditRow[]; cursors: Record<string, number | null>; detailed: boolean };
const missingSignature = (e: unknown) => e instanceof Error && /Could not find the function|schema cache|PGRST202/i.test(e.message);

// viewerId (manual QA 20 Nov 2026): in the owner's scope the account owner is the viewer, so rows carry ownerUserId there and
// the handover wording can say "account owner" truthfully. In a store admin's scope it is left unknown.
export async function loadAuditPage(opts: { includeReads: boolean; cursors?: Record<string, number | null>; viewerId?: string | null }, client?: RpcClient): Promise<AuditPage> {
  const scope = (await listTenantStores(client)).filter((s) => s.capability !== "member");
  if (!scope.length) throw new Error("Audit access unavailable for this account.");
  const seen = new Set<string>();
  const selected = scope.filter((s) => { const key = s.capability === "owner" ? s.account_id : s.id; if (seen.has(key)) return false; seen.add(key); return true; })
    .filter((s) => !opts.cursors || opts.cursors[s.id] != null);
  let detailed = true;
  const pages = await Promise.all(selected.map(async (s) => {
    const before = opts.cursors?.[s.id] ?? null;
    let rows: RawAuditRow[];
    try {
      rows = (await readRpc<{ rows: RawAuditRow[] }>("admin_audit", { p_business_id: s.id, p_limit: AUDIT_PAGE, p_before: before, p_include_reads: opts.includeReads }, client)).rows;
    } catch (e) {
      if (!missingSignature(e)) throw e;
      detailed = false;
      rows = (await readRpc<{ rows: RawAuditRow[] }>("admin_audit", { p_business_id: s.id, p_limit: AUDIT_PAGE, p_before: before }, client)).rows;
      if (!opts.includeReads) rows = rows.filter((r) => r.action !== "read_page");
    }
    const ids = rows.map((r) => Number(r.id));
    if (s.capability === "owner" && opts.viewerId) rows = rows.map((r) => ({ ...r, ownerUserId: opts.viewerId as string }));
    return { scopeId: s.id, rows, next: ids.length && (rows.length >= AUDIT_PAGE || !detailed) ? Math.min(...ids) : null };
  }));
  const names = new Map(scope.map((s) => [s.id, s.name]));
  const cursors: Record<string, number | null> = {};
  for (const p of pages) cursors[p.scopeId] = p.next;
  const rows = pages.flatMap((p) => p.rows.map((r) => ({ ...r, place: (r.business_id && names.get(r.business_id)) || "Account" })))
    .sort((x, y) => Number(y.id) - Number(x.id));
  return { rows, cursors, detailed };
}
