> **2026-11-07 checkpoint:** signup-disabled evidence is **not confirmed**: two uncached settings reads still report `disable_signup=false` on Dev v1. No waiver is requested. Both pooler variables and all other independent v2 checks pass. See [checkpoint and scoped Git/apply commands](../apply/dev-executor-v2/GIT_RELEASE_COMMANDS.md). Tony saves the global signup-off setting in the correct project and requests recheck before running DEV APPLY.

> **Current execution path — v2 prepared:** [DEV executor v2 handoff](../apply/dev-executor-v2/HANDOFF.md) and `RUN_DEV_APPLY.sh` supersede the old full-restore wrapper. JARVIS's exact-three-managed-ACL ruling is recorded; all other baseline/preservation/index checks remain. Both SQL variables now use the same working Session pooler. Accepted narrow rehearsal reused without rerun. 67 local tests and all independent live read-only checks pass; the remaining failed check is `DEV_SIGNUP_CHECKPOINT_WAIVER_REQUIRED` because signup is enabled and no explicit DEV APPLY waiver has yet been received. Tony retains Git and runs shared DEV writes.

> **Current routing — application rehearsal PASS, DEV writes still held:** see [the revised handoff](../apply/dev-application-rehearsal/HANDOFF.md). The Director deferred SCRATCH recreation of the four Auth indexes and requested no support ticket/new project. That prerequisite is superseded for the narrower application rehearsal; historical entries below are retained. Bootstrap → 0047 → ledger → 0052 → seed/Owner/access passed on synthetic starting data. Resolve the pooler variable, DEV-specific managed-ACL and signup dispositions, then amend the matching DEV executor/receipt gate before Tony's separate write release. Do not pass this synthetic receipt to the old full-restore wrapper or run its obsolete conditional command block.

# E2 stages 1–5 — Director DEV APPLY handoff

Cody remains stopped at DEV APPLY. Tony retains Git and executes any separately cleared DEV apply/seed. Current checkout: `apbm-003` at `49dec499d665125bb8764ccc8ea498c5fdfcdcd1`. The Director corrects the DEV designation to CyberPharma_Dev_v1, `yrsuwikjnbmvpznrgydb`; `cwdzijswchlwfvxxrlzb` is the Vibe Cody pilot and is not an APBM DEV target. SCRATCH remains `ihgcsrypblqkwommrkgj`. This target correction is uncommitted. Pre-pack baseline `af2c7e5225d2d78925fd392e29a58b6bde830263`; E1 start `b23372d24d79b6460f746a191e824224ba5f8900`; `5234abe` unavailable. E1, historical SCRATCH receipts and committed design inputs remain preserved. The prior Director implementation release superseded the draft pre-coding FINAL gate; no FINAL stamp is asserted.

**BLOCKED — live DEV is not the approved 0047 baseline.** Read-only SQL and API health checks passed for the corrected target. Live public schema has 2 tables (`profiles`, `user_roles`), 3 policies and 2 functions, versus 16/19/13 expected. APBM ledger is absent; native Supabase ledger has only version `20261012053902`. Do not initialize a 47-entry ledger or execute the forward commands below against this database. JARVIS/Tony must review the exact differences and approve a separately rehearsed baseline reconciliation plan, with affected-state backup/restore evidence. Existing baseline receipts must not be rewritten to force a match. See `../apply/dev-target-reconciliation/REPORT.md` and `baseline-diff.json`.

Local prerequisite discrepancy: `APBM_DEV_DB_URL` still points to the direct host; `APBM_DEV_DB_POOL` contains the working Session pooler. `APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY` and `APBM_DEV_SECRET_KEY` are absent. Tony must populate the complete APBM_DEV_ set and use the working pooler for DB_URL. This preflight explicitly mapped the existing pooler and API variables in memory; the runner still rejects incomplete prefixes and has no fallback. No .env file was edited. DEV signup-disabled evidence is not on file; the actual signup setting remains unverified and unchanged. The prior DA-2 waiver applies to launch only.

## Verified engineering evidence

- Baseline build/typecheck/lint passed; 36 suites/178 tests passed, no skips. Baseline lint: 35 warnings, zero errors.
- Stage 0: 23 target/output controls passed before destructive SCRATCH replay. SQL/API both identify `ihgcsrypblqkwommrkgj`, distinct from the then-labelled DEV `cwdzijswchlwfvxxrlzb` (now identified as the pilot; historical receipt only). Complete prefixes only; no mixed fallback. Historical evidence, path traversal, symlinks, DEV-as-SCRATCH and service keys in the user slot rejected. `PUBLISHABLE_DATA_PROBE.json` clears the key issue: zero-row data GET succeeds with `apikey`; the root schema endpoint requires a secret key.
- `stage-5/rls/APBM_BOUNDED_prove_*.log`: 320 cells green, 28 attack cases green, immediate live-session revocation/regrant green; 15 actual policies. Seven legacy claim writes, four direct-claim selects and two direct-audit selects changed to deny; remaining expectations preserved. Type-error and transport failures were retained as failed evidence, then repaired without treating them as access denials.
- `stage-5/audit-final/audit-prove.json`: complete from-scratch proof PASS, including 279 real-user checks, metadata-role trigger attack (separate stage-2 receipt), exact 17-table/15-policy/19-function catalog, 14 write-audit stamps, and `db-verify` AC7. `stage-3/NO_ACCOUNT_NO_JUNCTION.json` adds a real-session empty-scope negative. Owner FK remains NO ACTION.
- Seed: seven users/no Operator, three accounts/five stores/eight junctions, 50 claims/store. Every run appends exactly 285 service_role audit rows with NULL actor. Independent SQL money audit: 0/250 failures. Mock decimal audit: 0/50 failures. Identity scanner, changed-value comparator and five generator poisoned controls pass. `stage-5/reseed/seed-verify.json` equals the earlier canonical hash `f7f1270cccbb26896cfeeef4c7326b761bfc90f4080a72d27b66574b83cfabdf`, despite regenerated Auth UUIDs. Audit history survives seed reset.
- `stage-5/recovery/recovery-rehearsal.json`: baseline ledger initialization; injected 0052 failure rolls back its DDL and ledger receipt while 0048–0051 remain committed; explicit remaining-chain recovery passes. Inventory tampering and stale catalog rejected; already-applied chain no-ops. This is NOT a backup-restore rehearsal.
- `stage-5/dev-safe-rehearsal/authenticated-reads.json`: 154 checks PASS. The default verifier uses read-only SQL only. Its separate `--authenticated` phase uses seven genuine client login/logout sessions and 48 successful audited RPC calls; exactly 48 audit rows are expected. No business DML, auth-user creation, reset or destructive orchestrator is in that phase.

RPC names, schema counts, seed count derivation and planned UI operation counts are in `IMPLEMENTED_OPERATION_PLAN.md`. Stage-6 UI request counts remain to be checked against the actual implementation; SQL committed-success/rejection/retry semantics are already proven.

## Items Tony must clear before DEV APPLY

A02 test correction is complete: the Director approved exactly the two test paths recorded in `APBM_RULINGS.md`; the full local board passes (36 suites, 178 tests, zero failures/skips; build/typecheck/lint pass, lint 33 warnings). Prior failed logs remain historical evidence. Fresh disclosure-first recheck also passes all 8 tests, followed by the same green full board; see `test-amendment-A02/recheck/`. The KPI assertion itself passes unchanged. All 32 previously hashed product files are unchanged; the current manifest adds the two test files. The pre-stage-6 zero-KPI assertion remains enabled and passing; it must change with the stage-6 UI implementation. This does not accept that fallback as the final error behavior.

Remaining steps, in execution order:

1. **Git/runner identity:** The stage-0–5/A02 checkpoint is now committed at `49dec499d665125bb8764ccc8ea498c5fdfcdcd1`; review and commit this target correction separately. The current source manifest differs only in `scripts/rls-harness/lib/env.mjs`.  review and commit the exact product/docs changes yourself; record the resulting full runner commit and verify `SOURCE_HASHES.json` (34 sources). No agent Git mutation occurred. Exact scoped review/staging/commit commands are in `GIT_HANDOFF.md`; A02 is included.
2. **DEV identity and credentials:** provide a complete `APBM_DEV_` set in `.env.local`: `APBM_DEV_DB_URL`, `APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY`, `APBM_DEV_SECRET_KEY`. SQL/API must both identify `yrsuwikjnbmvpznrgydb`. No fallback to NEXT_PUBLIC/other prefixes. Use genuine publishable user credentials for user proofs. Run the first read-only command block below and record target/current catalog/ledger evidence under `EVIDENCE/apply/`.
3. **DEV baseline reconciliation and checkpoint DA-2:** compare actual DEV catalog and migration inventory/ledger with the approved, rehearsed 0047 baseline; reconcile differences with JARVIS before ledger initialization. Never infer applied history from filenames. Record remaining DEV checkpoint DA-2 evidence or an explicit Director checkpoint ruling. The existing DA-2 waiver covered E2 launch only; signup settings were left alone.
4. **Affected-state backup:** cover affected public schema/data, Auth users/identities and relevant Auth state, roles/grants/policies/functions/triggers, migration ledger and dependencies. Record location/time/integrity/coverage/exclusions without secrets or data in the pack.
5. **Disposable restore and rehearsal:** restore that backup on a Director-confirmed disposable target; demonstrate affected data/Auth/catalog recovery and rehearse the exact forward inventory, seed and verifier against that restored state. This environment has no executable pg_dump/pg_restore/psql; no backup/restore claim or speculative restore command is supplied. Existing SCRATCH partial-failure recovery does not substitute for this evidence.
6. **Freeze and execute:** bind the reviewed runner commit, source hashes, migration inventory, baseline approval and backup/restore receipts. Tony alone executes the applicable ledger initialization (only if absent), forward apply through 0052, post-apply verification, one-time seed, seed comparison and separately declared authenticated reads. Stop at any failure using the recovery instructions below. Return the APPLY receipt before Cody resumes stages 6–8.

Do not apply while these readiness items are unresolved. DEV APPLY is the declared Director stop inside E2, not a deployment or QA release.

## Conditional runner commands — BLOCKED pending approved baseline reconciliation

Do not run the write block below on the current DEV schema. These executables and argument forms were exercised on SCRATCH. The DEV target/prefix below is intentionally different and has not been used by Cody. Run from the current checkout after committing and verifying the runner identity. Use the immutable reviewed inventory supplied in this handoff; do not regenerate an inventory merely to accept changed migration bytes.

```bash
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
export APBM_PACK="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA"
export RLS_HARNESS_PREFIX=APBM_DEV_
export APBM_TARGET=dev
export APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR="$APBM_PACK/EVIDENCE/apply/DEV_$(date -u +%Y%m%dT%H%M%SZ)"
unset APBM_ALLOW_DESTRUCTIVE APBM_FAULT_REHEARSAL

# Read-only current target/catalog. Review catalog.json, including any existing ledger.
node scripts/dev-verify.mjs

# Must match the independently rehearsed 0047 baseline. Stop on any mismatch.
node scripts/dev-verify.mjs --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json"
```

If and only if the inspected DEV baseline has no APBM ledger, initialize it after the backup/restore and baseline approval. If a ledger already exists, verify its ordered checksums instead; never drop/reinitialize it.

```bash
set -euo pipefail
export APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb
node scripts/apply-forward.mjs init-ledger \
  --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" \
  --baseline "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --through 47

node scripts/dev-verify.mjs \
  --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" \
  --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 47

node scripts/apply-forward.mjs apply \
  --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" \
  --before "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/baseline.json" --through 52

node scripts/dev-verify.mjs \
  --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/complete.json" \
  --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" --through 52

# Once only. Creates a fresh 0600 private file; it refuses to overwrite one.
export APBM_CREDENTIAL_FILE="/tmp/apbm003-dev-cast-$(date -u +%Y%m%dT%H%M%SZ)-$$.json"
node scripts/seed/run.mjs
node scripts/seed/verify.mjs \
  --compare "$APBM_PACK/EVIDENCE/E2/stage-5/reseed/seed-verify.json"

# Separately declared auth/session + audited-read effects: 7 sessions, 48 audit inserts.
node scripts/dev-verify.mjs \
  --expect "$APBM_PACK/EVIDENCE/E2/stage-5/recovery/complete.json" \
  --manifest "$APBM_PACK/EVIDENCE/E2/stage-5/audit-final/migration-inventory.json" \
  --through 52 --authenticated
unset APBM_DIRECTOR_APPLY
```

Expected final schema fingerprint: `66782ff92213415443d428ade161b165e04a5aba29999453cb0ab34a7160d061`. Expected ledger: all 52 exact inventory entries. Expected seed: 285 newly appended attributed audit rows and the counts above. Default verification creates no sessions/audit rows; only `--authenticated` has those bounded effects. Private credential files are never Git/ZIP/evidence contents. Securely retain or transfer them under Tony's control.

## Partial failure and receipt

On any nonzero command: stop. Do not proceed to the next command, seed, full-chain replay or reset. `forward-*.json` records the failed migration/error class and this run's prior committed files. Use the read-only verifier to record actual catalog/ledger. Failed transaction DDL/DML/ledger insertion rolls back; earlier commits remain. Tony/JARVIS choose a separately approved backup restore or exact remaining-chain recovery, with a newly reviewed partial catalog and unchanged migration inventory. The injected failure receipt demonstrates that behavior; no fault flag belongs in DEV commands.

Seed failure has a separate boundary: public inserts are transactional, but prior Auth user creation is not. The private file and receipt identify created synthetic handles. Stop for reviewed cleanup/recovery; no automated DEV reset or blind seed retry.

After all checks pass, Tony records `EVIDENCE/apply/APPLY_RECEIPT.md` with full runner commit, DEV project ref, inventory/source hashes, backup/restore and DA-2/ruling references, forward/ledger/catalog/seed/trigger/ACL/read-probe evidence paths, and session/audit effect totals. Paste:

> Cody, DEV APPLY COMPLETE on yrsuwikjnbmvpznrgydb. Runner commit: [full SHA]. Receipt: agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/APPLY_RECEIPT.md. All prerequisite and apply/seed/read-verifier evidence is linked there, including declared session/audit writes. Resume E2 stages 6–8 under the approved allowlist including recorded A02, then hand the identified candidate and deployment package to Claudy for Gate Q. No staging deployment is released.

Estimate remains 11.5–16 engineering days + 2–3 independent QA/review + 1–2 reserve (14.5–21 total planning range), excluding waits. Actual completion depends on DEV backup/restore/catalog readiness, Tony's APPLY receipt, stage-6 UI work and independent Gate Q. Staging deployment still requires separate approval after Gate Q; Gate D verifies the deployed revision.


## Proposed DEV-specific baseline bootstrap — not released

The Director requested the smallest forward-only bootstrap for the corrected DEV. Exact SQL, pinned inputs, executable checks and focused restore plan: `../apply/dev-baseline-bootstrap/PROPOSAL.md`. Existing profiles/user_roles and their three policies are assertion-only; create the 14 missing tables directly in final form. Strict parity remains blocked by supabase_admin-owned default ACLs that the current postgres role cannot alter. No baseline exception, ledger initialization, reset or shared-DEV write is approved by preparing this proposal. Obtain the supported privileged path and focused affected-state restore proof, then Tony/JARVIS review the separately built transaction wrapper before any DEV APPLY.


## Consolidated executable bootstrap handoff

Current operational handoff: `../apply/dev-bootstrap-execution/HANDOFF.md`. It supplies the executable transaction wrapper, private backup helper, Owner proof and exact conditional restored-copy/DEV command files. 20 local transaction simulations and 15 proposal checks pass. Fresh rehearsal remains BLOCKED: servers 17.6 vs installed backup tools 16.15, no managed-default-ACL privilege, incomplete DEV prefix and missing DEV signup evidence/waiver. No restored-copy PASS or shared-DEV write is claimed. Do not use the older conditional forward block until the new bootstrap/baseline proof and receipt gates pass.


## Latest PostgreSQL 17 continuation

Current verdict/evidence: `../apply/dev-restored-rehearsal/HANDOFF.md`. Tools now pass at 17.11 and a private consistent database backup exists. Fresh restore is BLOCKED by four missing Auth indexes and lack of owner privileges; no restored-copy or forward/seed PASS exists. The Director permits evaluation of the three default ACL entries only on SCRATCH. The old strict write runner is not yet integrated with that experimental evaluator. No shared-DEV write/exception is released.

## 2026-11-06 — post-restore comparison and physical-clone preflight

Current handoff: `../apply/dev-post-restore/CLONE_SAFETY_HANDOFF.md`. After Tony's in-place restoration of DEV to the scheduled 07:37:54 UTC backup, the read-only 13:03 UTC comparison passed all 30 retained table fingerprints, roles, sequences, migration records and public/Auth catalogs. All four required Auth indexes match and are valid/ready/live. The later private archive and fingerprint proof remain intact and hash-verified; the exact result is now recorded in `../apply/dev-post-restore/PASS_20261106T130308Z.json`.

The read-only outbound-action inspection passed: no configured scheduled jobs, webhook hooks, HTTP queue, foreign servers or logical subscriptions; provider trigger findings were reviewed. See the handoff for inspection limits. Tony's next dashboard step is Database → Backups → Restore to a New Project → scheduled backup 2026-11-06 07:37:54 UTC → cost review before confirmation. No clone has been created. APBM_DEV_DB_URL still points to the direct endpoint and must be set locally to the existing working Session pooler value before standard runner use. This source-preservation PASS is not a disposable-copy rehearsal or 0047 baseline PASS. DEV APPLY, ledger initialization and stage 6 remain stopped; the four indexes and exact three-entry ACL exception remain required.


## Director sequencing amendment — Stage 6 on SCRATCH; rollout deferred to DevOps

The Director explicitly releases Stage 6 against existing SCRATCH ihgcsrypblqkwommrkgj without waiting for DEV APPLY. Functional implementation/proofs: stage-6/HANDOFF.md. CyberPharma_Dev_v1 yrsuwikjnbmvpznrgydb remains the intended rollout backend. Shared DEV bootstrap/APPLY, preservation/restore rehearsal, baseline-before-ledger proof and recovery receipt are deferred to DevOps, not declared complete. Preserve the private backup and the recorded 30/30 post-restore PASS. No new project is requested or created by this Stage 6 work. DevOps must establish a supported restore path, retain all four Auth indexes and the exact three-entry ACL ruling, verify 0047 before ledger initialization, then follow the reviewed forward/seed procedure under the Director authority. Rebuild with approved DEV public configuration after readiness; the local validation build is pinned to SCRATCH.


## Latest DEV APPLY resume readiness

See `../apply/dev-apply-resume/HANDOFF.md` and READINESS.json (2026-11-06 14:41 UTC). Restore gate remains BLOCKED: four Auth indexes absent on existing SCRATCH and no owner privilege. DEV standard DB_URL is still direct; working pooler is DB_POOL. Fresh read-only signup evidence reports disable_signup=false; checkpoint disposition is required. The strict managed-ACL execution prerequisite remains unresolved. Backup and all 56 source hashes verified. Existing command templates are not released for execution. No paid project, shared DEV write, Git mutation or copy-only change occurred.
