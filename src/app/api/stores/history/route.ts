// APBM-007B W6 — the caller's own transferred (sold) ownerships, for owner-only archived-store selection.
import { fail, ok, userRpc } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const r = await userRpc('owner_history_stores', {});
  return r.code ? fail(r.code) : ok(r.data);
}
