// APBM-007B I3 — resend (5 attempts total, 60 s apart; authority re-checked in SQL first).
import { type NextRequest } from 'next/server';
import { err, fail, resendInvitation, sameOrigin, validId } from '@/server/staff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return err(403, 'forbidden', 'Request refused.');
  const { id } = await params;
  if (!validId(id)) return fail('not_found');
  return resendInvitation(id);
}
