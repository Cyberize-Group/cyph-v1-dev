// Manual QA 19 Nov 2026 (R7/R10): the contract-recorded support address (STAGING_AND_GATE_D.md), overridable with
// NEXT_PUBLIC_SUPPORT_EMAIL. Director 20 Nov 2026: use it; mailbox operation is not yet verified.
export const SUPPORT_EMAIL = (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@pharmacybooks.com").trim();
