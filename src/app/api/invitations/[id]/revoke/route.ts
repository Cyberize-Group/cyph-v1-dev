// APBM-007B I4 — revoke a pending invitation (access reduction: allowed even when the account is read-only).
import { type NextRequest } from 'next/server';
import { err, fail, ok, sameOrigin, userRpc, validId } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return err(403, 'forbidden', 'Request refused.');
  const { id } = await params;
  if (!validId(id)) return fail('not_found');
  const r = await userRpc('invitation_revoke', { p_invitation: id });
  return r.code ? fail(r.code) : ok(r.data);
}
