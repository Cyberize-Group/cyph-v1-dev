import type { ReactNode } from "react";
import { BRAND } from "@/components/global/brand";
import { LogoTile } from "@/components/global/BrandMark";

/**
 * ABM007_FINAL literal layout (UI_SPEC 1, AC-L01): a centred narrow white shell on the navy backdrop
 * (the backdrop comes from the (auth) layout), a gradient masthead with the logo tile beside the
 * headline, then white cards. Used signed out, so there is no signed-in navigation.
 */
export function AuthShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="pb-shell pb-shell-narrow p-4 sm:p-7">
      <header className="pb-masthead">
        <p className="pb-eyebrow pb-masthead-text flex justify-between gap-3">
          <span>{BRAND.name}</span>
          <span>{BRAND.app}</span>
        </p>
        <div className="mt-3.5 flex items-center gap-4">
          <LogoTile height={40} />
          <h1 className="pb-headline text-[28px] sm:text-[36px]">{title}</h1>
        </div>
        {description ? <p className="pb-masthead-text mt-2.5">{description}</p> : null}
      </header>
      <div className="mt-4 grid gap-4">{children}</div>
    </div>
  );
}
