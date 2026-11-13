# Optional DEV sample claims — FA-8 / D-04 approved in R1

D-04 implementation scope is approved; E1/E2 execution remains unreleased. Deliver after E2 release a labeled operator-run DEV-only command (proposed `seed:sample-claims --store-id <internal UUID> --dataset <synthetic fixture ID> --dry-run`). Final syntax is frozen in E1; do not pretend this command exists now.

Require positive exact DEV project identity, explicit store UUID, a separately verified synthetic test-store allowlist and operator authority. NPI alone is insufficient. Refuse production, SCRATCH confusion, a real/unclassified store, missing target and cross-account ambiguity. Dry-run shows safe store/dataset identity/count only. Use service-only controlled writes through the reviewed audit path; never turn customer claim-table writes back on.

Use a fixed reviewed synthetic dataset with provenance, deterministic dataset/row IDs and idempotent repeat handling. Insert/restore only its own exact rows; no account-wide reset, arbitrary SQL/file import, deletion of existing claims or changes to owner/subscription. A repeat run does not double rows; a store/dataset mismatch stops. Counts/labels make sample nature visible in the test evidence and UI where needed. Preserve existing 250-claim baseline and other stores.

Test refusal outside DEV, wrong store, non-synthetic classification, duplicate run and preserved unrelated rows. Operator supplies explicit target after a paid test store is provisioned. No real PHI or transfer history is loaded. D-04 is approved in R1, so this command is in E2 scope; real empty-state customer acceptance remains mandatory. This conditional item never licenses a customer upload path.
