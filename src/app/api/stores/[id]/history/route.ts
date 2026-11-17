// APBM-007B W6 — seller-owner read-only history of a TRANSFERRED ownership. Buyer, staff, foreign and ordinary removed
// stores are refused in SQL (owner_history_rows).
import { type NextRequest } from 'next/server';
import { fail, ok, userRpc, validId } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return fail('not_found');
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') ?? 100) || 100, 1), 500);
  const offset = Math.max(Number(request.nextUrl.searchParams.get('offset') ?? 0) || 0, 0);
  const r = await userRpc('owner_history_rows', { p_business_id: id, p_limit: limit, p_offset: offset });
  return r.code ? fail(r.code === 'not_permitted' ? 'not_found' : r.code) : ok(r.data);
}
