// APBM-007B — runtime mail guard, identical in both apps (CONTRACTS/CLOCK_AND_NOTICES.md). Default ON and not switchable
// off: an address may receive mail only if listed exactly (normalized) in MAIL_ALLOWLIST; absent/empty denies all.
const normalize = (a: string) => a.trim().toLowerCase();

export function mailAllowlist(): Set<string> {
  return new Set((process.env.MAIL_ALLOWLIST || '').split(',').map(normalize).filter((a) => /^[^@\s,*]+@[^@\s,*]+\.[^@\s,*]+$/.test(a)));
}
export function mailAllowed(address: string): boolean {
  return mailAllowlist().has(normalize(address));
}
export function guardDecision(address: string): { allowed: boolean; reason: 'allowlisted' | 'blocked_not_allowlisted' } {
  return mailAllowed(address) ? { allowed: true, reason: 'allowlisted' } : { allowed: false, reason: 'blocked_not_allowlisted' };
}
