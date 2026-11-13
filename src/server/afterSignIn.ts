// APBM007A — what this app does right after a person signs in by emailed link. OwedBook: nothing.
// (The Payment Portal's copy attaches a waiting paid registration.)
export async function afterSignIn(_userId: string, _email: string | undefined): Promise<void> {
  return;
}
