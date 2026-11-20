// Manual QA 20 Nov 2026 (navbar identity): the name shown in the navbar comes from the person's own profile name (auth
// metadata full_name, which also seeds public.profiles). When none is set, an honest generic label is shown instead of
// the email address or anything derived from it. The full email stays in the account menu and on Profile.
export const NO_DISPLAY_NAME = "Your account";

export function displayNameOf(user: { user_metadata?: Record<string, unknown> | null } | null | undefined): string | null {
  const v = user?.user_metadata?.full_name;
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** One letter for the avatar: the name's first letter, else the email's, else "U". */
export function avatarLetter(name: string | null, email: string | null | undefined): string {
  return (name?.[0] ?? email?.[0] ?? "U").toUpperCase();
}
