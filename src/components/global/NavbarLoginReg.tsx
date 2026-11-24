import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { BRAND } from "./brand";

// ABM007_FINAL: the (auth) pages now use the literal layout (AuthShell) and no longer mount this header. Kept, with its
// theme-toggle mount (D-01) and old logo reference (AC-N02) removed, pending the Director's leftovers decision.
const NavbarLoginReg = () => {
  return (
    <div className="pb-on-dark bg-navbar py-2 px-5 flex justify-between">
      <Link href={"/"} aria-label={`${BRAND.name} — Home`} className="rounded-md">
        <BrandMark />
      </Link>
    </div>
  );
};

export default NavbarLoginReg;
