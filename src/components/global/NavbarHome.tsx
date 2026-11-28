import Link from "next/link";
import { User as SupabaseUser } from "@supabase/auth-js";
import MobileNav from "./MobileNav";
import NavAuthRefresh from "./NavAuthRefresh";
import UserMenu from "./UserMenu";
import { BrandMark } from "./BrandMark";
import { BRAND } from "./brand";
import { AppRole } from "@/utils/app-role";

// Identity arrives server-resolved from (public)/layout.tsx (Navbar Law: props,
// never client-persisted state). Both may be null — logged-out visitors are a
// first-class state on the public nav.
// ABM007_FINAL (P-08): navy public header with the logo tile; the three links to
// sections that do not exist (#features, #how-it-works, #pricing) and the theme
// toggle (D-01) are removed.
interface NavbarHomeProps {
  user: SupabaseUser | null;
  role: AppRole | null;
}

const NavbarHome = ({ user, role }: NavbarHomeProps) => {
  return (
    <header className="pb-on-dark relative flex items-center min-h-[72px] bg-navbar text-navbar-foreground px-4 sm:px-7">
      <Link href="/" className="flex items-center rounded-md" aria-label={`${BRAND.name} — Home`}>
        <BrandMark />
      </Link>

      <nav aria-label="Account" className="ml-auto hidden lg:flex items-center gap-2 text-[15px]">
        <UserMenu user={user} role={role} />
      </nav>

      <div className="ml-auto flex items-center lg:hidden">
        <MobileNav user={user} role={role} />
      </div>

      {/* Single cross-tab listener — both nav variants are always mounted
          (CSS-hidden), so the listener lives once up here, not per component. */}
      <NavAuthRefresh />
    </header>
  );
};

export default NavbarHome;
