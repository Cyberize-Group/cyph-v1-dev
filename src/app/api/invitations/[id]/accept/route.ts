// APBM-007B I7 — explicit, same-origin acceptance by the exact verified recipient. GET never accepts anything.
import { type NextRequest } from 'next/server';
import { err, fail, ok, sameOrigin, userRpc, validId } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return err(403, 'forbidden', 'Request refused.');
  const { id } = await params;
  if (!validId(id)) return fail('not_found');
  const r = await userRpc('invitation_accept', { p_invitation: id });
  if (r.code) return fail(r.code);
  if (r.data?.error) return fail(String(r.data.error));
  return ok({ status: 'accepted', businessId: r.data?.business_id, role: r.data?.role });
}
