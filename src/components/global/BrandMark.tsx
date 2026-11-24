import Image from "next/image";
import { BRAND } from "./brand";

/**
 * The logo master in its white 12px tile (brand contract 4.5), scaled whole, never cropped.
 * `height` is the rendered image height in px; width follows the master's ratio.
 */
export function LogoTile({ height = 30, alt = "" }: { height?: number; alt?: string }) {
  const width = Math.round((height * BRAND.logoWidth) / BRAND.logoHeight);
  return (
    <span className="pb-logo-tile" data-testid="brand-logo-tile">
      <Image src={BRAND.logoSrc} alt={alt} width={width} height={height} priority unoptimized />
    </span>
  );
}

/** Logo tile plus "Pharmacy Books" with the app name beneath, for navy surfaces. */
export function BrandMark({ appName = BRAND.app }: { appName?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <LogoTile height={26} />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-base font-semibold text-navbar-foreground">{BRAND.name}</span>
        <span className="block truncate text-xs text-brand-ice">{appName}</span>
      </span>
    </span>
  );
}
