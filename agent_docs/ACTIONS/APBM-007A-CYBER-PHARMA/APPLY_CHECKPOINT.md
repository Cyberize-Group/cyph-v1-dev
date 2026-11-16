# Shared DEV apply — explicit checkpoint

007A must add forward migrations to existing DEV. No replay of 0001–0052, no db:reset, no harness drop-public/purge-auth against DEV. SCRATCH target identity must be positively distinct; absence of a target is failure, not a default to DEV.

Before apply, provide one reviewable action bundle: two source SHAs, literal migration path list/order and SHA-256 per SQL file, current ledger/checksum comparison, precondition catalog results, NPI conflict inventory, SCRATCH fresh+upgrade rehearsal results, effective grant and isolation negatives, baseline row/index preservation checks, verified private backup and restoration/recovery instructions, exact forward runner command and redacted target identity. Store no database URL/password/backup in the package.

Do not claim a full restore passed because APBM003 had a backup. Its undemonstrated restore is a carried limitation. For this delta, demonstrate backup restoration on disposable SCRATCH if authorized/available, or obtain a specific Director disposition before shared apply. Never restore destructively over DEV as proof. Prefer additive migrations; irreversible changes require a reviewed recovery plan.

Tony executes the exact apply command or explicitly delegates its exact target/migrations/effects. Historical approval of APBM003 DEV apply is not permission to apply 007A. One checkpoint, not an approval per SQL file. After apply, verify actual ledger/catalog/grants, correct signup trigger, preserved pre-existing fixture/user/index identities, new constraints and smallest permitted authenticated smoke. Unexpected drift stops further dependent work.

Never solve an apply mismatch by clearing migration ledger, disabling RLS, raising a user's global role or deleting a duplicate store. Record partial state and resume only through the reviewed forward recovery path.
