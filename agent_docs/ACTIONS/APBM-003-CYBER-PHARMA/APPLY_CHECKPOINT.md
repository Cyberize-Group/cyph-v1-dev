# APPLY_CHECKPOINT — DRAFT correction A01-C1

Tony alone executes this declared stop inside E2 on Cyberize-Group/cyph-v1-dev / apbm-003. Pre-pack baseline af2c7e5225d2d78925fd392e29a58b6bde830263; E1 start b23372d24d79b6460f746a191e824224ba5f8900; 5234abe unavailable. The later approved candidate/runner commit is recorded separately. Contract remains draft pending FINAL and release.

## Prerequisites

1. E2 state is E2 PAUSED — APPLY CHECKPOINT (Director). Runner fencing was implemented before the first destructive SCRATCH proof. Stage-5 proofs pass on explicitly confirmed disposable SCRATCH, with approved output paths and no fallback to DEV credentials.
2. DEV project ref is independently matched across SQL/API connections; scoped credentials and DA-2 evidence exist. Record key names only. Capture current catalog, role/function grants, trigger, migration ledger and data inventory in EVIDENCE/apply/01_TARGET_IDENTITY.txt and 02_DEV_BEFORE.txt.
3. Backup covers ALL affected DEV state: public schema and data, auth users/identities and relevant auth schema/data, ownership/grants/policies/functions/triggers, migration ledger and other dependent state identified by the impact inventory. Metadata-only backup is insufficient. Record location, timestamp, integrity verification, coverage/exclusions and restore authority without copying secrets/data into evidence, in 03_BACKUP_RECORD.md.
4. Restore that backup to a disposable target and demonstrate recoverability of affected data/auth/configuration and catalog. Rehearse the exact forward inventory, one-time seed and DEV-safe verifier there; record 04_REHEARSAL.txt. Separate destructive SCRATCH proofs are not a substitute for restore rehearsal.
5. Freeze ordered migration filenames/checksums, expected baseline and target catalog, runner/code identity and expected receipts in MIGRATION_INVENTORY.json. Confirm historic migrations unchanged. Ledger initialization requires explicit baseline-catalog reconciliation; no guessing from filenames. All counts are FINAL-design values, not copied from E1 expectations.

## Director procedure — commands are not yet issued

Cody supplies exact commands, full paths, environment-key mappings and expected output ONLY after scripts/apply-forward.mjs and scripts/dev-verify.mjs have been implemented, fenced and rehearsed in E2. These names describe approved runner design, not existing executable readiness. The legacy db:apply runner is not used on DEV.

| Step | Tony's action | Receipt |
|---|---|---|
| 1 | Reverify target/ref, clean approved runner commit, backup/rehearsal and exact ordered inventory. Reject absent/mixed prefixes, changed checksums or unexpected catalog/ledger. | 01_TARGET_IDENTITY.txt, MIGRATION_INVENTORY.json |
| 2 | Run the rehearsed forward runner: only unapplied approved migrations, one migration plus its ledger/checksum receipt atomically per transaction. No reset/bootstrap, no replay of applied files. | 05_APPLY.txt |
| 3 | DEV-safe read-only catalog verifier checks ledger/checksums, tables/policies/functions/owners/grants, default ACLs and corrected trigger. Catalog queries use read-only transactions and bounded timeouts. | 06_CATALOG.txt, 07_TRIGGER.txt, 10_ACL.txt |
| 4 | Run governed seed once under explicit Director authority; verify cast/content counts and expected seed audit writes. | 08_SEED.txt |
| 5 | Run separately declared authenticated read checks: permitted wrappers, cross-tenant refusal and direct SELECT denial. Bound login/logout session effects and successful RPC audit inserts; record actor/store/function and before/after audit counts. No business DML, reset, migration, auth-user creation or seed inside verifier. | 09_DEV_VERIFY.txt |
| 6 | Review results; commit receipts on apbm-003 personally and record full commit, target and inventory hashes. Set APPLY COMPLETE then E2 RESUMED. Cody resumes stage 6 only on that receipt. | APPLY_RECEIPT.md |

Do not invoke rls:prove or audit:prove on DEV. Destructive reset, negative mutation tests and seed-reset proofs belong only on confirmed SCRATCH. The DEV verifier must not import or spawn those orchestrators.

## Partial failure

Stop immediately on any unexpected result. Record failed migration, SQL error class, last committed ledger entry, actual catalog and transaction status in STOP.md. Failed migration transaction must roll back; earlier transactions remain committed. No automatic retry, full-chain replay, reset or manual fix-forward. Tony and JARVIS review the discrepancy and choose a separately authorized, rehearsed backup restore or exact remaining-chain recovery plan. After recovery, repeat identity/catalog/ledger/inventory checks and record approval before resuming. A backup restore is a deliberate recovery action, never a reset shortcut.

## Later tester data requests

No DEV reset or reseed-by-reset is authorized here. A later repair/additive seed request needs a separately reviewed idempotent forward data plan, affected-state backup and disposable rehearsal, explicit Tony approval, preserved audit history and a new receipt. Existing successful APPLY does not authorize repetition.
