import { ReactNode } from "react";
import { protectPage } from "@/utils/supabase/actions";
import { AppRole } from "@/utils/app-role";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { canAdminister, listTenantStores, isDemoMode } from "@/services/tenantScope";
import AuthedShell from "@/components/layout/AuthedShell";

interface LayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: LayoutProps) {
  // Authenticate with the existing protected helper; tenant capabilities grant admin access.
  const { user, role } = await protectPage([AppRole.ADMIN, AppRole.MEMBER, AppRole.SUPERADMIN], {
    unauthorizedRedirect: "/owedbook",
  });

  if (isDemoMode()) {
    if (role !== AppRole.ADMIN) redirect("/owedbook");
  } else if (!canAdminister(await listTenantStores(await createClient()))) {
    redirect("/owedbook");
  }

  // Content-column gutter for every admin-portal screen — the designer's `.main`
  // padding (mockup: 26px 30px desktop, 18px 16px ≤900px ≈ below lg, where the
  // sidebar stops being fixed). Applied here (admin-portal-only group) rather than
  // in the shared AuthedShell so /owedbook + /moose-portal are physically out of
  // scope. One place → all six screens (+ loading/error/not-found) inherit it.
  return (
    <AuthedShell user={user} role={role}>
      <div className="px-4 py-[18px] lg:px-[30px] lg:py-[26px]">{children}</div>
    </AuthedShell>
  );
}
