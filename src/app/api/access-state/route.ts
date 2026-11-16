// APBM007A — the signed-in member's access state for one store: state only, no billing detail.
import { type NextRequest, NextResponse } from "next/server";
import { storeAccess, StoreAccessDeniedError } from "@/server/accessState";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const json = (body: unknown, status: number) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get("business_id") || "";
  if (!UUID.test(businessId)) return json({ error: "invalid_input" }, 400);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return json({ error: "sign_in_required" }, 401);
  try {
    return json({ access: await storeAccess(supabase, businessId) }, 200);
  } catch (e) {
    if (e instanceof StoreAccessDeniedError) return json({ error: "not_member" }, 403);
    return json({ error: "unavailable" }, 502);
  }
}
