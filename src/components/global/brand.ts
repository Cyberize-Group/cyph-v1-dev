// Customer-facing brand text for OwedBook — the ONE place these names live
// (ABM007_FINAL, D-03, AC-N01). Mirrors the Portal's src/components/portal/brand.ts.
// Internal identifiers, repository names and comments elsewhere are not brand text.
export const BRAND = {
  name: "Pharmacy Books",
  app: "OwedBook",
  billingApp: "Account & Billing",
  supportEmail: "support@pharmacybooks.com",
  logoSrc: "/brand/pharmacy-books-logo-primary.png",
  logoAlt: "Pharmacy Books",
  /** Intrinsic size of the logo master (1024 x 543), used for next/image ratio. */
  logoWidth: 1024,
  logoHeight: 543,
} as const;

export const PAGE_TITLE = `${BRAND.app} · ${BRAND.name}`;
