// APBM-007B I9 — remove a member (owner or store admin of that store). Never the effective admin. Allowed when read-only.
import { type NextRequest } from 'next/server';
import { err, fail, ok, sameOrigin, userRpc, validId } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; uid: string }> }) {
  if (!sameOrigin(request)) return err(403, 'forbidden', 'Request refused.');
  const { id, uid } = await params;
  if (!validId(id) || !validId(uid)) return fail('not_found');
  const r = await userRpc('member_remove', { p_business: id, p_user: uid });
  return r.code ? fail(r.code) : ok({ removed: r.data?.removed === true });
}
