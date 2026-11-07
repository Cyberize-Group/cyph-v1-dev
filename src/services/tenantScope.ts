// Tenant scope is passed per surface/request; never stored in a global selector.
export type TenantStore = { id: string; account_id: string; name: string; capability: "owner" | "admin" | "member" };
export type RpcClient = { rpc(name: string, args?: Record<string, unknown>): PromiseLike<{ data: unknown; error: { message: string } | null }> };
export const isDemoMode = () => process.env.NEXT_PUBLIC_APBM_DATA_MODE === "mock";
export const unavailableMessage = "Not available in this release.";
export async function readRpc<T>(name: string, args: Record<string, unknown> = {}, client?: RpcClient): Promise<T> {
  const connection: RpcClient = client ?? (await import("@/utils/supabase/client")).createClient() as unknown as RpcClient;
  const { data, error } = await connection.rpc(name, args);
  if (error) throw new Error(error.message);
  if (data == null) throw new Error("Data unavailable. Please retry.");
  return data as T;
}
export async function listTenantStores(client?: RpcClient): Promise<TenantStore[]> {
  const stores = await readRpc<TenantStore[]>("tenant_stores", {}, client);
  if (!Array.isArray(stores) || stores.some(s => !s.id || !s.account_id || !s.name || !["owner", "admin", "member"].includes(s.capability))) {
    throw new Error("Store access is unavailable. Please retry.");
  }
  return stores;
}
export const canAdminister = (stores: TenantStore[]) => stores.some(s => s.capability === "owner" || s.capability === "admin");
export function requireStore(id?: string): string {
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new Error("Select a permitted store to load data.");
  return id;
}
