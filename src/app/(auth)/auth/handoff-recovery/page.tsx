import { HandoffRecovery } from "@/components/auth/AuthPages";
import { DEFAULT_RETURN } from "@/lib/appIdentity";

export const metadata = { title: "Try again" };

// Generic by design: the page never says which check failed (AUTH_HANDOFF_CONTRACT §6).
export default function HandoffRecoveryPage() {
  return <HandoffRecovery startHref={`/api/handoff/start?return=${encodeURIComponent(DEFAULT_RETURN)}`} />;
}
