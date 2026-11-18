// APBM-007B I6 — the signed-in recipient's own pending invitations. Never grants or consumes anything.
import { fail, ok, userRpc } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const r = await userRpc('my_invitations', {});
  return r.code ? fail(r.code) : ok(r.data);
}
