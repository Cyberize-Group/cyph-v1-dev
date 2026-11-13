// APBM007A — store access state for the banner and the read-only enforcement hook (AC-031, AC-032, RA-2).
// The state is computed in the database from server time (public.store_access_state, policy access-v1); nothing
// here trusts the browser or its clock. Synthetic fixture subscriptions are honoured only where the environment
// flag is on; anywhere else they grant nothing.
export type AccessState = 'active' | 'grace' | 'read_only' | 'ended' | 'none' | 'past_due_reminder';
export interface StoreAccess { state: AccessState; readOnly: boolean; isOwner: boolean; policyVersion: string }
type RpcClient = { rpc(name: string, args?: Record<string, unknown>): PromiseLike<{ data: unknown; error: { message: string; code?: string } | null }> };

export class StoreAccessDeniedError extends Error { constructor() { super('not a member of business'); } }
export class StoreReadOnlyError extends Error {
  constructor(readonly state: AccessState) { super(state === 'none' ? 'This store has no active subscription.' : 'This store is read-only until billing is fixed.'); }
}

export const syntheticAllowed = (): boolean => process.env.ALLOW_SYNTHETIC_SUBSCRIPTIONS === 'true';
const STATES: readonly AccessState[] = ['active', 'grace', 'read_only', 'ended', 'none', 'past_due_reminder'];

/** `supabase` is the caller's own cookie-bound client: membership is checked by the function, under auth.uid(). */
export async function storeAccess(supabase: RpcClient, businessId: string): Promise<StoreAccess> {
  const { data, error } = await supabase.rpc('store_access_state', { p_business_id: businessId });
  if (error) {
    if (error.code === '42501') throw new StoreAccessDeniedError();
    throw new Error('Access state unavailable. Please retry.');
  }
  const r = data as { state?: string; read_only?: boolean; origin?: string | null; is_owner?: boolean; policy_version?: string };
  if (!r || !STATES.includes(r.state as AccessState)) throw new Error('Access state unavailable. Please retry.');
  const fenced = r.origin === 'synthetic_seed' && !syntheticAllowed();
  return { state: fenced ? 'none' : (r.state as AccessState), readOnly: fenced ? false : r.read_only === true, isOwner: r.is_owner === true, policyVersion: r.policy_version ?? 'access-v1' };
}

/**
 * The enforcement hook for any paid customer write. 007A itself adds no customer write to OwedBook (claims are
 * read-only in this release), so today this is exercised by a labelled contract test only; a later write path
 * must call it before mutating. Denies when the store is read-only, ended, or has no paid access.
 */
export async function assertStoreWritable(supabase: RpcClient, businessId: string): Promise<void> {
  const access = await storeAccess(supabase, businessId);
  if (access.readOnly || access.state === 'none') throw new StoreReadOnlyError(access.state);
}
