// APBM-007B — OwedBook staff, invitation and seller-history operations (CONTRACTS/IDENTITY_AND_MEMBERSHIP.md,
// API_ROLE_MATRIX.md I1–I10, W6). Authority is re-derived in SQL from auth.uid() through the cookie-bound client; the
// service key is used only by src/server/invitationMail.ts after that check. Responses are { data } or
// { error: { code, message } } with no SQL text, no other tenant's facts and no other recipient's full address.
import { NextResponse, type NextRequest } from 'next/server';
import { ownOrigin, siteOriginMatches } from '@/lib/appIdentity';
import { createClient } from '@/utils/supabase/server';
import { dispatchInvitation } from '@/server/invitationMail';

const HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache', 'Referrer-Policy': 'no-referrer' };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const ok = (data: unknown, status = 200) => NextResponse.json({ data }, { status, headers: HEADERS });
export const err = (status: number, code: string, message: string) => NextResponse.json({ error: { code, message } }, { status, headers: HEADERS });

const MESSAGES: Record<string, [number, string]> = {
  not_permitted: [403, 'You do not have permission for this store.'],
  sign_in_required: [401, 'Sign in to continue.'],
  not_found: [404, 'Not found.'],
  invalid_input: [422, 'Check the details and try again.'],
  account_read_only: [409, 'This account is read-only until billing is updated. You can still remove access.'],
  already_member: [409, 'That person is already a member of this store.'],
  already_admin: [409, 'That person is already the admin of this store.'],
  invitation_pending: [409, 'An invitation to that address is already pending.'],
  admin_invitation_pending: [409, 'An admin invitation for this store is already pending.'],
  not_pending: [410, 'This invitation is no longer pending.'],
  expired: [410, 'This invitation has expired. Ask for a new one.'],
  stale_incumbent: [409, 'The store admin changed since this invitation was sent. Ask the owner for a new invitation.'],
  store_unavailable: [410, 'This store is no longer available.'],
  admin_protected: [409, 'The store admin cannot be removed. Replace the admin first.'],
  no_admin: [409, 'This store has no admin. Contact support.'],
};
export const fail = (code: string) => { const [s, m] = MESSAGES[code] ?? [409, 'This change could not be made.']; return err(s, code, m); };

export function sameOrigin(request: NextRequest): boolean {
  return siteOriginMatches() && request.headers.get('origin') === ownOrigin();
}
export const validId = (v: string) => UUID.test(v);

/** Map a PostgREST/SQL error to a safe code. */
function sqlCode(e: { code?: string; message?: string } | null): string {
  if (!e) return 'invalid_input';
  if (e.code === '42501') return /read-only/.test(e.message ?? '') ? 'account_read_only' : 'not_permitted';
  if (e.code === '42704') return 'not_found';
  if (e.code === '22023') return 'invalid_input';
  if (e.code === '55000') return /effective admin/.test(e.message ?? '') ? 'admin_protected' : 'no_admin';
  return 'invalid_input';
}

export async function userRpc(fn: string, args: Record<string, unknown>): Promise<{ data?: Record<string, unknown> & { error?: string }; code?: string }> {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { code: 'sign_in_required' };
  const r = await supabase.rpc(fn, args);
  if (r.error) return { code: sqlCode(r.error) };
  return { data: r.data as Record<string, unknown> & { error?: string } };
}

export async function createInvitation(storeId: string, body: Record<string, unknown>) {
  const role = body.role, email = body.email, disposition = body.formerAdminDisposition ?? null;
  if ((role !== 'admin' && role !== 'member') || typeof email !== 'string' || email.length > 254 || (disposition !== null && disposition !== 'member' && disposition !== 'remove')) return fail('invalid_input');
  const r = await userRpc('invitation_create', { p_business: storeId, p_email: email, p_role: role, p_disposition: role === 'admin' ? disposition : null });
  if (r.code) return fail(r.code);
  if (r.data?.error) return fail(String(r.data.error));
  const inv = r.data?.invitation as { id: string; status: string; expires_at: string; attempts_remaining: number };
  const sent = await dispatchInvitation(inv.id);
  return ok({ invitationId: inv.id, status: inv.status, expiresAt: inv.expires_at, delivery: sent.status, attemptsRemaining: sent.attemptsRemaining ?? inv.attempts_remaining }, 201);
}

export async function resendInvitation(invitationId: string) {
  const r = await userRpc('invitation_resend_check', { p_invitation: invitationId });
  if (r.code) return fail(r.code);
  if (r.data?.error) return fail(String(r.data.error));
  const sent = await dispatchInvitation(invitationId);
  if (sent.status === 'refused') return fail(sent.reason === 'too_soon' ? 'invalid_input' : String(sent.reason));
  return ok({ invitationId, delivery: sent.status, attemptsRemaining: sent.attemptsRemaining ?? null });
}
