import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RpcError } from "@/services/tenantScope";

// Manual QA 20 Nov 2026: a store page the person may not open shows a plain access-denied state with a way back, instead
// of the raw database message and an ineffective Retry. Nothing about the requested store is shown.
const DENIED = /not an administrator of business|Select a permitted store|^Store unavailable\.$/i;

/** True when a failed load means "not permitted" (42501 or the store-scope refusals), not a transient failure. */
export function isAccessDenied(e: unknown): boolean {
  if (e instanceof RpcError && e.code === "42501") return true;
  return e instanceof Error && DENIED.test(e.message);
}

const AccessDenied = () => (
  <div className="mx-auto max-w-[560px] pb-card p-6" role="alert" data-testid="access-denied">
    <div className="flex items-start gap-3">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div>
        <h1 className="text-lg font-medium text-heading">You don&apos;t have access to this store</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This page is only available to the account owner and the store&apos;s admin. If you think you should have access, ask the account owner.
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin-portal" data-testid="back-to-stores">Back to My Stores</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default AccessDenied;
