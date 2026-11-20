// Manual QA 19 Nov 2026 (R6): stored pharmacy details for the Settings page, read through the audited, scoped
// store_profile RPC (0071: owner or store admin of a live store). Never writes. Before 0071 is applied the RPC does not
// exist; the page then shows only what admin_stores already returns and says the rest is unavailable (never "Not provided").
import { readRpc, requireStore, type RpcClient } from "./tenantScope";

export type StoreProfile = {
  id: string; name: string; npi: string | null; ncpdp: string | null;
  address: string | null; address_line2: string | null; city: string | null; state: string | null; zip: string | null;
  phone: string | null; pharmacy_software_system: string | null;
};
export type StoreProfileResult = { profile: StoreProfile; detailsAvailable: boolean };

const missingFunction = (e: unknown) => e instanceof Error && /Could not find the function|schema cache|PGRST202/i.test(e.message);

export async function loadStoreProfile(id: string, client?: RpcClient): Promise<StoreProfileResult> {
  const storeId = requireStore(id);
  try {
    return { profile: await readRpc<StoreProfile>("store_profile", { p_business: storeId }, client), detailsAvailable: true };
  } catch (e) {
    if (!missingFunction(e)) throw e;
    const rows = await readRpc<{ id: string; name: string; npi: string | null; ncpdp: string | null }[]>("admin_stores", { p_business_id: storeId }, client);
    const s = rows.find((r) => r.id === storeId);
    if (!s) throw new Error("Store unavailable.");
    return { profile: { id: s.id, name: s.name, npi: s.npi, ncpdp: s.ncpdp, address: null, address_line2: null, city: null, state: null, zip: null, phone: null, pharmacy_software_system: null }, detailsAvailable: false };
  }
}

/** "1 Main St, Suite 2, Albany, NY 12207" from whatever parts are stored; null when nothing is stored. */
export function formatAddress(p: Pick<StoreProfile, "address" | "address_line2" | "city" | "state" | "zip">): string | null {
  const cityLine = [p.city, [p.state, p.zip].filter(Boolean).join(" ")].filter((x) => x && String(x).trim()).join(", ");
  const parts = [p.address, p.address_line2, cityLine].map((x) => (x ?? "").trim()).filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}
