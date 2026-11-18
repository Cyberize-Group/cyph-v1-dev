// APBM-007B I1/I2/I5 — create (owner: member or admin; store admin: member of own store) and list invitations.
import { type NextRequest } from 'next/server';
import { createInvitation, err, fail, ok, sameOrigin, userRpc, validId } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return fail('not_found');
  const r = await userRpc('store_invitations_list', { p_business: id });
  return r.code ? fail(r.code) : ok(r.data);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return err(403, 'forbidden', 'Request refused.');
  const { id } = await params;
  if (!validId(id)) return fail('not_found');
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Object.keys(body).some((k) => !['email', 'role', 'formerAdminDisposition'].includes(k))) return fail('invalid_input');
  return createInvitation(id, body as Record<string, unknown>);
}
