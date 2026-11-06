# E2 release prerequisite check — BLOCKED

UTC: 2026-11-05T14:51:54.537439+00:00. CWD: /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev.

PASS: branch apbm-003, full HEAD 01bd66d13b0951a0d0553f1fba0609c0f05e2855, initial `git --no-optional-locks status --porcelain` empty. All ten governing files below match their committed bytes. E1 complete; no fresh recon. Verified pre-pack baseline remains af2c7e5225d2d78925fd392e29a58b6bde830263, E1 start b23372d24d79b6460f746a191e824224ba5f8900. No historical equivalence to unavailable 5234abe inferred.

Director authority now recorded: Tony's current message adopts plan v3.0 and approves corrected A01 scope and exact allowlist; E2 release is conditional on these prerequisite checks passing. That approval does not need to be requested again. No JARVIS FINAL authority is inferred from it.

## Consolidated blockers and exact next actions

| Blocker | Verified observation | Owner / exact next action |
|---|---|---|
| 1. FINAL receipt and contract binding missing | APBM_ACCEPTANCE_SPEC.md:5 still DRAFT; unresolved E1 placeholders remain. APBM_RULINGS.md records proposed A01, not JARVIS FINAL binding. Filename search across agent_docs and APBM receipt/FINAL-content review found no APBM FINAL receipt. | JARVIS: resolve remaining schema/count/capability/audit definitions, finalize the governing contract and approved ruling precedence, and issue a dated FINAL receipt binding final committed paths and SHA-256 values. Hashes below identify today's draft inputs, not a FINAL stamp; recalculate any changed files. |
| 2. Disposable SCRATCH identity and credential readiness unverified | EVIDENCE/env/ENV_NOTE.md absent. .env.local has nonempty RLS_REPLICA_DB_URL, RLS_REPLICA_SUPABASE_URL, RLS_REPLICA_PUBLISHABLE_KEY, RLS_REPLICA_SECRET_KEY names; no confirmation that this replica is the disposable SCRATCH, or that keys are rotated/scoped. Values never printed. | Tony: record the approved disposable project ref and explicit destruction authorization, matching SQL/API target identity, chosen complete prefix, credential rotation date and key names in EVIDENCE/env/ENV_NOTE.md. Either explicitly bind the existing replica prefix to that disposable target or provision a dedicated prefix; no fallback to DEV. Then Cody can verify read-only connectivity/catalog access before any proof. |
| 3. SCRATCH DA-2 proof missing | EVIDENCE/apply/DA-2_SUPABASE_SIGNUP_DISABLED.md absent; no current APBM SCRATCH signup-disabled receipt found. Historical records do not prove current setting. | Tony: disable public signups on the confirmed SCRATCH and provide dated project-bound setting/negative-signup evidence at that path, with no secret values. Do not conflate SCRATCH proof with future DEV proof. |

Tony retains Git: commit finalized prerequisites/docs when ready and provide the resulting approved successor HEAD if changes move past 01bd66d13b0951a0d0553f1fba0609c0f05e2855; this pinned commit contains draft contracts and cannot simultaneously contain later finalized edits. The existing conditional release remains understood; identity must be rebound to the committed prerequisite package. Clean-check evidence above predates the new release-check records written by this run.

Not current release blockers: DEV APPLY backup/restore rehearsal, final migration inventory and built/rehearsed forward/DEV-safe runners; these are stage-5 checkpoint deliverables. Staging credentials/target/digest/rollback approval belong after Gate Q. The runners' absence is expected before E2 stage 0, not an additional prerequisite. Baseline execution and runner implementation were not started because FINAL/target prerequisites failed. No database/API/cloud call, build, test, product edit or Git mutation occurred.

## Committed input paths and hashes for JARVIS

Commit: `01bd66d13b0951a0d0553f1fba0609c0f05e2855`. SHA-256 over exact `git show <commit>:<path>` bytes; working files matched. These are **DRAFT input hashes**. Do not sign a receipt claiming finalized content without resolving the remaining draft text and recomputing hashes.

| Committed path | SHA-256 |
|---|---|
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ACCEPTANCE_SPEC.md` | `10795161de4a6e1304ae6ac57b0823d3bb2477e9d15897e6ebf0f924058dd74d` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_RULINGS.md` | `b7b35f290fc82e48ef6929debb3bcfd02ac404574a8f8d6e8eb8b97407549eb4` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_AMENDMENT_A01.md` | `b0a45a078cf23f7fc3887a08f7dd74ae82f1f2937b7f28f1a685f06c5d82d49e` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_EXECUTION_INSTRUCTIONS.md` | `21ee409e20747d85fa1761bbf3f4c0bd730b2c623deef2e35fb356f394e56f60` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APPLY_CHECKPOINT.md` | `56e805402e87a25471be5c9871c8ab655ccd524db4b3ff130a39d91b7b26cf34` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/E2_RELEASE_MESSAGE.md` | `f0dc710e0b1674f1f7ec6cbb1e1bdf1f3fb36ee748fa346a62b998fed864c5eb` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md` | `f71a48b7f7b2519c086ee11cd6bb3df9eb364573c28e1120473a8266cfd58a78` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` | `3fbcd12b873577ea3fe0f440b0ed07860d0dc812655a8752abd22533c6edb1f4` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/SUCCESSION_RECORD.md` | `07ef12e5171390b62a79b8b248a19c3fb57d81381ad1c1ebdd45c57de01689ce` |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` | `3d7fb159ac936fcd85993678bc86a02cbb1ebd0248176df31098a308b0276610` |

## Verification scope

Commands: git rev-parse HEAD; git symbolic-ref --short HEAD; git --no-optional-locks status --porcelain; git show HEAD:<governing path>; find APBM/EVIDENCE; rg filename searches for FINAL/RECEIPT/ENV_NOTE/DA-2/SCRATCH across agent_docs; content review of release/state/spec/rulings. Credential inspection parsed key names/nonempty status only. Presence is not credential validity, target identity or rotation proof. No connection attempted to an unconfirmed target.

Stop: prerequisite checks blocked. Next owner JARVIS/Tony. Resume release checks on completed records, then baseline and stage-0 safeguards before first destructive SCRATCH proof. E1 evidence untouched.


## 2026-11-05T15:02:39.627169+00:00 — Director SCRATCH designation and DA-2 launch waiver; read-only verification

This entry supersedes the earlier target-designation and DA-2 launch blockers. Tony designates the project under RLS_REPLICA_* as disposable SCRATCH and explicitly waives public-signup status and DA-2 evidence as E2 launch prerequisites. No signup setting was inspected or changed. This ruling addresses launch only; later DEV APPLY requirements remain at their checkpoint.

HEAD remains 01bd66d13b0951a0d0553f1fba0609c0f05e2855 on apbm-003. Preflight began with only the previous APBM_STATE and EVIDENCE/E2 check records dirty; product files unchanged. All ten governing working files still match the committed input hashes. E1 preserved.

SCRATCH SQL/API project ref: ihgcsrypblqkwommrkgj. Shared DEV configured project ref: cwdzijswchlwfvxxrlzb (NEXT_PUBLIC_SUPABASE_URL). They are distinct. SQL project identity was extracted from the configured Supabase host/pooler username and matched to the API hostname before connection. No connection to DEV was made.

Keys: RLS_REPLICA_DB_URL, RLS_REPLICA_SUPABASE_URL, RLS_REPLICA_PUBLISHABLE_KEY, RLS_REPLICA_SECRET_KEY. Values never logged. SQL connected and catalog SELECTs ran under BEGIN READ ONLY (transaction_read_only=on), followed by ROLLBACK. Startup default_transaction_read_only was observed off despite the requested startup option; explicit transaction mode was verified on before catalog queries. Future runner fencing must verify effective modes rather than trusting startup options. Catalog: 16 public tables, all RLS enabled; 18 policies, 7 public functions, 14 noninternal triggers; public.system_config and supabase_migrations.schema_migrations absent. These are observations, not migration-history certification.

API health GET returned 200. REST schema GET with RLS_REPLICA_SECRET_KEY returned 200. REST schema GET with RLS_REPLICA_PUBLISHABLE_KEY returned 401 on two attempts. The returned error did not expose a recognized SQL permission/JWT error code; no claim that this proves invalid key or expected RLS denial. Publishable-key readiness remains unresolved. API health alone does not establish all key capabilities. No signup/authentication session, wrapper RPC, business-data request, destructive proof or database mutation was attempted. Evidence: EVIDENCE/E2/SCRATCH_READONLY_PREFLIGHT.json.

Remaining release checks / exact next actions:
1. JARVIS: supply the FINAL receipt binding final contract/ruling paths and SHA-256 values, including the Director launch waiver. Current committed spec remains DRAFT with unresolved placeholders; committed input hashes are in COMMITTED_CONTRACT_HASHES.json and above. Recompute changed bytes on finalization.
2. Tony: verify the SCRATCH publishable key in the local credential configuration and provide corrected scoped credentials if required; Cody then repeats read-only verification. Do not broaden database permissions merely to make a schema GET succeed; if the denial is intentional, provide the target-bound permission rationale and an approved read-only key-validity check.
3. Tony: provide dated evidence that the scoped SCRATCH credentials were rotated since last use (key names only). Successful SQL/secret-key access cannot establish rotation. No repeat rotation required if the required rotation has already occurred and can be evidenced.
4. Tony retains Git authority: commit the finalized prerequisite records and identify the approved successor HEAD if it changes. Earlier initial-clean receipt remains valid for 01bd66; current dirt is the documented preflight evidence.

E2 remains STOPPED (STOP-CONTRACT / STOP-ENV). No baseline/build/product work started. Once these remaining release checks pass, honor the existing conditional release: baseline, stage-0 target/output fencing before any destructive SCRATCH proof, stages 1–5, then Tony's DEV APPLY stop. No fresh E1.
