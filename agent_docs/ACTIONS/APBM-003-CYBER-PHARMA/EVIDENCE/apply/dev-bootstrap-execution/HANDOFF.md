# APBM-003 consolidated bootstrap handoff

**Status: BLOCKED for restored-copy rehearsal and shared DEV APPLY. Executable preparation is complete.**

Current checkout: cyph-v1-dev / apbm-003 @ 49dec499d665125bb8764ccc8ea498c5fdfcdcd1, with reviewed-target and handoff changes pending Tony's commit. DEV is CyberPharma_Dev_v1 `yrsuwikjnbmvpznrgydb`; pilot `cwdzijswchlwfvxxrlzb` is excluded. SCRATCH `ihgcsrypblqkwommrkgj` remains the Director-designated disposable target and is reachable, but currently holds the previous 0052 proof state, not a restored DEV copy.

## Deliverables and current result

- Exact minimal forward-only SQL: `../dev-baseline-bootstrap/PROPOSED_BOOTSTRAP.sql` (unchanged SHA-256 ccaa16a3701752a4895705e1dca5456d5eb3171b3c8750cc43001f9ff9b4b3e4).
- Executable transaction wrapper: `bootstrap-runner.mjs` (`check`, `fault`, `apply`, `verify`). It verifies pinned source bytes and target, locks preserved tables, captures private salted row fingerprints, runs one SQL transaction, requires exact 0047 parity/data preservation before commit, and checks again afterward. Fault mode is SCRATCH-only. DEV apply requires Tony's explicit flag plus matching complete backup/restored-rehearsal receipts. Existing standard runners remain unchanged.
- `backup.mjs`: read-only version/tool check and private database-archive component. It refuses mismatched major versions, excludes credentials from argv/log output, and never calls an archive alone a complete recovery receipt.
- `owner-check.mjs`: genuine client OWNER3 proof for B2/B3 despite having no junction there; validates Owner RPC access, foreign-account denial and exactly four audit inserts.
- Exact command files: `REHEARSAL_COMMANDS.sh` and `DEV_COMMANDS.sh`. Run with bash only after prerequisites; neither write sequence was executed. Both stop at the first failure. The DEV script checks the reviewed commit and requires a Director checkpoint receipt before proceeding.
- `rehearsal-receipt.mjs` refuses to emit PASS without matching actual restore, rollback, bootstrap, independent baseline, 52-entry ledger/catalog, seed, Owner and verifier evidence.
- Current executable bundle SHA-256: `7ea2cbe960cd45232f54a4ba39a564e3dbf5d657fa908195db85b8639792d2f6`. A code change invalidates rehearsal binding and requires the affected checks to be rerun.

Actual validation: 15 proposal/static negative checks PASS; 20 runner authorization/transaction simulations PASS; all new JavaScript and shell syntax checks PASS. Simulations use a fake database and do not stand in for restoration. The final live **read-only** check matches the recorded starting catalog, then stops on `MANAGED_DEFAULT_ACL_PRIVILEGE_REQUIRED`. `REHEARSAL_RESULT.json` records all unexecuted stages. No DEV/SCRATCH database write, seed, ledger initialization, authenticated probe, reset, Git mutation or stage-6 work occurred this turn.

## Exact remaining actions for Tony/JARVIS

1. **Backup tooling:** install/use PostgreSQL **17.x** pg_dump and pg_restore (both servers are 17.6; installed clients are 16.15). Set `APBM_PG_DUMP` and `APBM_PG_RESTORE` to those executables if they are not first on PATH. No dump was attempted with the incompatible tools. psql 16.15 exists but is not used by the Node transaction runner.
2. **Managed-role prerequisite:** both current SQL connections are postgres, not superusers and not members of supabase_admin. The exact approved catalog excludes three supabase_admin-owned default ACL entries. Obtain a provider-supported privileged execution/restore path that can reconcile those defaults and assume postgres for the application DDL. Do not grant managed-role membership or edit system catalogs as a workaround. If that path is unavailable, JARVIS must explicitly rule on a narrow managed-ACL baseline exception; this handoff does not change the approved fingerprint or bypass it. The existing rls_auto_enable function reconciliation is also explicitly described in the proposal for review.
3. **Complete DEV runner credentials locally:** APBM_DEV_DB_URL still differs from the working pooler (the prior inspection found the direct host). Set it to the working APBM_DEV_DB_POOL URL. Add APBM_DEV_SUPABASE_URL, APBM_DEV_PUBLISHABLE_KEY and APBM_DEV_SECRET_KEY using the corresponding Dev v1 values. No .env file was changed. Read-only checks this turn used an explicitly recorded complete in-memory mapping; production loadEnv still has no fallback. Use genuine publishable credentials for user proofs.
4. **Signup evidence:** no DEV signup-disabled evidence or DEV checkpoint waiver is on file. Supply the evidence or an explicit Director checkpoint waiver. The earlier waiver covered launch. No signup setting or signup attempt was changed/run.
5. **Backup/restore receipt:** after tools/privileges are ready, take the consistent private affected-DEV backup and restore it on the confirmed disposable copy. Record Auth/provider configuration coverage and exclusions, role/trigger/sequence metadata and preservation verification. A generic destructive pg_restore command is intentionally not fabricated before a compatible archive and its TOC exist; review the actual archive/managed-Auth restore path first. The existing SCRATCH proof is not a DEV restore receipt.

These are prerequisites to the concrete scripts, not requests to repeat E1 or the full previous SCRATCH proof.

## Read-only and backup commands after local configuration is complete

```bash
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
export APBM_PACK="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA"
export APBM_EXEC="$APBM_PACK/EVIDENCE/apply/dev-bootstrap-execution"
export RLS_HARNESS_PREFIX=APBM_DEV_
export APBM_TARGET=dev
export APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR="$APBM_PACK/EVIDENCE/apply/DEV_BACKUP_$(date -u +%Y%m%dT%H%M%SZ)_$$"
mkdir "$APBM_EVIDENCE_DIR"
node "$APBM_EXEC/backup.mjs" check
node "$APBM_EXEC/bootstrap-runner.mjs" check
# Read-only source operation; writes the private archive only under /tmp.
# Run in the coordinated maintenance/backup window.
node "$APBM_EXEC/backup.mjs" backup
```

The backup helper creates a new private 0700 directory with 0600 files outside the repo. It captures public/Auth/native-migration schemas and data, including public defaults, but its receipt remains ARCHIVE_COMPONENT_COMPLETE, coverageComplete=false until provider settings/role inventory/exclusions and restore evidence are reviewed. Actual user data, passwords, tokens, before-proofs and archives never belong in Git or the review ZIP. Transfer the private backup to approved durable storage under Tony's control; /tmp is not durable backup storage.

## Focused rehearsal and exact shared-DEV commands

The existing `../dev-baseline-bootstrap/PROPOSAL.md` specifies restoration of the current two-table DEV, including private row/role/sequence/trigger verification. Preserve existing evidence before restoring SCRATCH. Do not reset/replay shared DEV. The required restored catalog is da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b and native migration version is 20261012053902; APBM ledger must be absent.

After actual restore verification, set APBM_RESTORE_RECEIPT and APBM_BACKUP_RECEIPT to the completed receipt paths and run:

```bash
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/REHEARSAL_COMMANDS.sh
```

Order: reject wrong targets → read-only before/privilege check → injected bootstrap failure/rollback proof → successful atomic bootstrap → independent exact baseline plus preservation check **with ledger absent** → initialize 47-entry ledger on the copy → verify ledger → forward 0048–0052 → exact final catalog → seed once → seed comparison → Owner proof → bounded verifier → aggregate actual receipt. No full destructive rls:prove/audit:prove rerun is needed for this difference-focused rehearsal. If a step fails, the script stops; do not manufacture the receipt.

Only after the complete rehearsal passes and Tony commits/reviews this bundle, set APBM_RELEASED_RUNNER_COMMIT, APBM_REHEARSAL_RECEIPT, APBM_BACKUP_RECEIPT and APBM_DEV_CHECKPOINT_RECEIPT, then Tony alone may run:

```bash
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/DEV_COMMANDS.sh
```

This file contains every exact command in order. The handoff is **not** a claim that those commands are rehearsed yet or a release to run them now. It requires bootstrap/preservation verification before APBM ledger initialization. It then uses the existing forward runner, seed and verifier; no DEV reset or destructive legacy proof appears. Original users/roles/data are proved unchanged at the 0047 boundary. The seed adds only the approved seven synthetic users/no Operator and 250 claims across five stores.

Declared future effects: seed appends 285 attributed audit rows; Owner proof adds one login/logout session and four audit rows; the existing verifier adds seven sessions and 48 audit rows. Total expected new audit rows for those three operations: 337, separate from any other preexisting history. These authenticated operations were not run this turn.

## Receipt fields — actual evidence only

No placeholder receipt with PASS is supplied. Existing evidence must substantiate every field:

- Backup receipt: status PASS, projectRef DEV, coverageComplete true, backupSHA256; include private storage/integrity/time/coverage/exclusion and provider-state references.
- Restore receipt: status PASS, sourceProjectRef DEV, targetProjectRef SCRATCH, catalogSHA256 equal to the recorded two-table catalog, preservationVerified true, matching backupSHA256, actual restore references.
- Rehearsal receipt: generated by rehearsal-receipt.mjs from the completed run; includes matching bundle/backup hashes and all required successful phases.
- Director checkpoint receipt: status PASS, projectRef DEV, director Tony, maintenanceReady true, signupDisposition either evidence or director-checkpoint-waiver, and a nonempty signupReference. This records the existing checkpoint decision; it does not authorize Cody to write DEV.

## Recovery and proof reuse

Bootstrap: all proposed DDL/default ACL/function changes are inside one transaction; any failed check rolls it back. The private before-proof is retained. If COMMIT outcome is unknown, stop, reconnect read-only and classify exact before/after state; never blindly rerun. The runner tests cover this control flow locally.

Forward 0048–0052: existing per-migration transaction semantics remain. On partial failure, stop; earlier committed migrations remain. Tony/JARVIS review the catalog/ledger and choose the rehearsed restore or exact remaining-chain recovery. Seed Auth creation remains outside its public-data transaction: on failure, stop with the private cast file and receipt; no automatic DEV cleanup/retry.

Reuse preserved E2 stage-5 evidence: 320 RLS cells/28 attacks, 279 real-user/audit checks, synthetic seed canonical hash f7f1270cccbb26896cfeeef4c7326b761bfc90f4080a72d27b66574b83cfabdf, 154 DEV-safe checks and the injected 0052 rollback/recovery. These remain valid historical implementation evidence; they do not prove restoration of this DEV's current data or solve the managed-ACL privilege requirement.

After Tony's eventual successful DEV run, record APPLY_RECEIPT.md with reviewed runner commit, bundle/backup/restore references, baseline-before-ledger proof, forward/seed/Owner/verifier receipts and declared audit/session totals. Stage 6 resumes only on Tony's receipt. No staging deployment is released.


## Latest PostgreSQL 17 continuation

Current verdict/evidence: `../dev-restored-rehearsal/HANDOFF.md`. Tools now pass at 17.11 and a private consistent database backup exists. Fresh restore is BLOCKED by four missing Auth indexes and lack of owner privileges; no restored-copy or forward/seed PASS exists. The Director permits evaluation of the three default ACL entries only on SCRATCH. The old strict write runner is not yet integrated with that experimental evaluator. No shared-DEV write/exception is released.
