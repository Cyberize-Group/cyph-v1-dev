import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/utils/get-user-role";
import { AppRole } from "@/utils/app-role";
import ProfileForm from "./ProfileForm";
import { viewerRoleLabel } from "@/components/admin-portal/roleLabel";

const ProfilePage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Canonical role from user_roles (not metadata) drives the profile badge.
  const role = (await getUserRole(user.id)) ?? AppRole.MEMBER;
  // Manual QA 19 Nov 2026 (R5/R7): the badge shows the person's role on their pharmacies (Owner / Store admin / Member),
  // read with their own session from tenant_stores (ownership comes from the account, not a membership row).
  const stores = await supabase.rpc("tenant_stores");
  const accountRole = !stores.error && Array.isArray(stores.data) ? viewerRoleLabel(stores.data as { capability: "owner" | "admin" | "member" }[]) : null;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="pb-page-title mb-6">My Profile</h1>
      <ProfileForm user={user} role={role} accountRole={accountRole} />
    </div>
  );
};

export default ProfilePage;
