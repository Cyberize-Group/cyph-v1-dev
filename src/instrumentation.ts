// Boot-time env validation. Runs once at server start via Next.js's
// instrumentation hook. Throw → server refuses to start (fail-closed).
//
// Naming convention: Supabase Q4-2025 update — `publishable` replaces `anon`,
// `secret` replaces `service_role`. See `.env.example` for current names.
//
// SUPABASE_SECRET_KEY is deliberately NOT required at boot (Director decision,
// 2026-10-14): no route, page, component or Server Action reads it. Its only
// reader, createAdminClient() in src/utils/supabase/admin.ts, fails closed at
// call time when the key is missing or blank. Add it back here when a runtime
// consumer exists.
//
// Phase-deferred additions (add when consumed in code, not before):
//   - Phase 6: GHL_WEBHOOK_SECRET (GoHighLevel webhook signing)
//   - Phase 7: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_*

const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
] as const;

export function register() {
  const missing = REQUIRED_ENV.filter((key) => {
    const value = process.env[key];
    return value === undefined || value.trim() === "";
  });

  if (missing.length > 0) {
    const message = [
      "❌ Missing required environment variables:",
      ...missing.map((key) => `  - ${key}`),
      "",
      "Set these in .env.local and restart the server.",
    ].join("\n");
    throw new Error(message);
  }

  console.log("✓ Environment validated");
}
