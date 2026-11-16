// APBM007A (D-01, FA-3) — OwedBook's single service-role access point, and its FIRST user-facing use of the
// service key. Reachable only from the guarded handoff and logout server modules (src/server/handoff.ts):
// handoff codes are issued, claimed and completed through service-only SQL functions, and the destination mints
// the session of an existing user loaded by ID. Server-only by construction: it reads SUPABASE_SECRET_KEY, which
// Next never bundles for the browser; a boundary test pins the importer list. No Stripe key exists in OwedBook.
import { createAdminClient } from '@/utils/supabase/admin';

export type Admin = ReturnType<typeof createAdminClient>;
let cached: Admin | null = null;
export function admin(): Admin {
  cached ??= createAdminClient();
  return cached;
}
