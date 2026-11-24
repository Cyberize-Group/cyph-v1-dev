import { ReactNode } from "react";
import Navbar from "@/components/global/Navbar";
import { protectPage } from "@/utils/supabase/actions";
import { AppRole } from "@/utils/app-role";

// ABM007_FINAL Help (D-08, AC-H01): the same guard as /profile, so a signed-out visitor is sent to sign in and every
// customer role (Owner, Store admin, Member) can read it. Panel inside navigation (D-02): the signed-in header stays.
export default async function HelpLayout({ children }: { children: ReactNode }) {
  const { user, role } = await protectPage([AppRole.ADMIN, AppRole.MEMBER]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} role={role} />
      <main id="main" className="flex-1">{children}</main>
    </div>
  );
}
