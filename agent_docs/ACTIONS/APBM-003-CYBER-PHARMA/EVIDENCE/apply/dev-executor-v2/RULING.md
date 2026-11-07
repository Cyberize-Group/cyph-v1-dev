# Recorded Director / JARVIS instruction — DEV executor v2

Source: Tony's current instruction to Cody, 2026-11-06. This records the message; it is not a new FINAL stamp or a DEV write release to Cody.

- Reuse the accepted narrow synthetic application rehearsal (`dev-application-rehearsal/RESULT.json`, completed `2026-11-06T15:02:40.230Z`; handoff recorded about 9:13 PM local). Do not repeat it.
- Preserve all four existing DEV Auth indexes with exact definition and validity checks.
- JARVIS accepts exactly the three recorded `supabase_admin` public-schema default ACL differences on DEV, conditional on effective app grants/RLS, RPC access and cross-store denial proofs. No fourth, partial, changed, duplicate, other-owner or other-catalog exception is allowed.
- Keep all other baseline, source/inventory, target, backup, preservation, ledger, seed and real-client proof checks.
- DEV remains read-only for Cody. Tony executes the supplied commands and retains Git authority.
- Signup-disabled evidence or Tony's explicit DEV APPLY checkpoint waiver remains required. The request to record a waiver is not itself treated as a waiver. See the fresh check and, if issued, `DIRECTOR_SIGNUP_WAIVER.json`.

The v2 SQL retains the three ACL entries without executing the old privileged default-ACL revocations. Its SQL operations match the accepted SCRATCH application body exactly (comments/whitespace excluded), verified locally. The old full-restore wrapper is historical and is not used by the v2 commands. The receipt truthfully records `restoreVerified: false`.

Implementation note (Cody, not a further Director ruling): read-only privilege inspection finds `auth.schema_migrations` SELECT-only. The v2 wrapper uses ACCESS SHARE there and SHARE ROW EXCLUSIVE on the other 29 preserved tables, preserving every before/after row/metadata comparison. The source application SQL still takes its original four locks. Provider Auth migrations must remain paused during the maintenance window; a changed native history fingerprint stops the run. No managed privilege escalation or extra ACL exception is introduced.
