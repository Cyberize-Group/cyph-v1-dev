> **Proposed A01 alignment — DRAFT:** Read `E2_AMENDMENT_A01.md` before this inherited draft. Its identity, exact file list, deferred customer writes, safe target/checkpoint rules and independent Gate Q/Gate D requirements replace contradictory proposals here only upon approval. No result, FINAL stamp or release is recorded.

# APBM_EXECUTION_PLAN — E1 recommendation

Owner: Cody. Status: **PROPOSED — awaiting JARVIS resolution and Tony E2 release**. This plan approves no effects. Director's E1 override selects Cyberize-Group/cyph-v1-dev on apbm-003.

## Baseline

- Starting HEAD: b23372d24d79b6460f746a191e824224ba5f8900; tree clean; 50 tracked pack files.
- Pack commit: 7abd8a66886a6f3a26ffbc59ba6c8c929f84790d; pre-pack parent: af2c7e5225d2d78925fd392e29a58b6bde830263. 5234abe unavailable, not silently replaced as historical equivalent.
- Recon skill: agent_docs/SKILLS/stark-recon-skill-v1.1/SKILL.md, v1.1. Used within user output/probe limits.
- 47 baseline migrations unchanged; next 0048. Static expected 16 tables/19 policies/13 audit stamps/4 read wrappers. Live targets not verified.
- Typecheck pass, lint 0 errors/35 warnings. Jest/build/browser/live proofs NOT RUN because they require prohibited writes or authenticated target setup; 36 test files is not a suite pass claim.
- Evidence: EVIDENCE/E1/RECON_REPORT.md and accompanying command/source captures; all future counts in COUNTS.md labelled proposals or gaps.

## Resolution before implementation

JARVIS resolves F01–F16 in RECON_REPORT, not by editing this plan into a contract. Highest priority: DEV reset hazard, write-returning effects of SELECT revoke, tenant owner route/nav/store scope, system_config schema, entitlement edit semantics and admin audit projection. Rule a complete permitted file list beyond R-016. Tony records D-6 adoption, fixture regeneration O-02, PBM tenancy O-03, agreed admin reads O-06, cast volume/optional OPERATOR, target identity/rotation/DA-2 and deployment O-07. A successful E1 handoff does not establish these prerequisites.

## Recommended build sequence

Keep the eight stages in their original order. A short design/target-readiness gate precedes stage 1; schema count, target-safe runners and UI allowances are dependencies, not new acceptance shortcuts.

| Stage | Proposed paths / work | Internal proof before advancing | Effects after E2 release | Working days at ~6 protected hours/day |
|---|---|---|---|---|
| 1 Ownership/permissions | Append 0048+ SQL; define ownership helper, union business discovery, single policies, owner mutation fence, partial admin index; approved system_config schema | Fresh SCRATCH replay, PUBLIC+anon execute denial, owner/store/member/cross-account checks, safe-column and entitlement negatives, one-admin insert/update collisions | Repo + confirmed disposable SCRATCH | 1.5–2 |
| 2 Signup correction | Forward migration for fixed member role/full_name; no auth path edits | Forged metadata still member; exact function definition, owner/search_path; all baseline auth hashes unchanged | Repo + SCRATCH | 0.5 |
| 3 Read-audit closure | Drop direct claim SELECT policy/revoke privilege; four audited admin wrappers and approved projections; retain owedbook return shapes | User direct-read error class and wrapper success, spoof denial, per-success audit count, audit-view visibility including account events; resolve write-returning tests explicitly | Repo + SCRATCH | 1.5–2.5 |
| 4 Synthetic seed/fixtures | scripts/seed/**, money/identity/hash instruments, governed mock regeneration; explicit role/profile writes | 7 required users/3 accounts/5 stores/8 junctions if confirmed; deterministic hash twice, attacked hash/scanner controls, independent money recomputation, exact audit delta, no audit deletion | Repo + SCRATCH only; no real claims | 2–2.5 |
| 5 Harness/rehearsal | scripts/rls-harness/** and db-verify; parameterized evidence/target, updated matrix and attacks; separate destructive SCRATCH and DEV-safe entry points | Full fresh replay, matrix delta approval, all 28 legacy attack intents plus owner negatives, golden audit trail, deliberately corrupted controls fail; no mixed env fallback | Repo + SCRATCH | 2–2.5 |
| APPLY stop | Prepare exact per-step commands and expected counts under EVIDENCE/apply | Target fingerprint, DA-2, backup/restore rehearsal, confirmed forward semantics; **never current rls:prove on DEV** | Tony alone applies/seeds/verifies DEV and records resolution | Director availability, budget up to 0.5 day within stage-5 allowance |
| 6 Service/UI swap | src/services, approved store scope and tenant guard/nav, three R-016 files, authorized admin read/unavailable/type paths | Wrapper-only reads, cache isolation, store switch, error/loading/empty/retry, no fake actions, exact scope and parity, operation count instrumentation | Repo; authorized DEV reads append audit events only, no business mutations by agent | 2–3 |
| 7 Board/regression | Delta tests and approved instrumentation | Full Jest, build/typecheck/lint, protected-path hashes, direct caller scan, 375px/desktop both themes, keyboard+auth walks, allowed-path diff | Repo build/test artifacts; no deployment | 1–1.5 |
| 8 Candidate/deployment-package handoff | Exact stage-8 file list; prepare local deploy/config/rollback package and factual handoff | Local artifact validation; Tony commits identified candidate for Claudy Gate Q; no deployment yet | Local only | 1–1.5 (includes later deployment support; separate approval) |

Estimate: **11.5–16 engineering working days**, plus **2–3 days independent QA/review and 1–2 days rework/reserve** = **14.5–21 working days**, excluding unbounded waits for credentials/decisions. The original 11–15 allowance is achievable only near the lower end with prompt architectural resolution and no unexpected target drift. Missing store scope and deployment artifacts are substantive work, not a one-line service swap.

## Schedule assessment

From 2026-11-06 through 2026-12-01 inclusive there are 18 Monday–Friday working days (local holiday/leave calendar unverified). **December 1 is credible only with conditions, not a commitment:** E2 release/targets ready near Nov 6, ~6 protected hours/day, JARVIS decisions before build, prompt APPLY/deploy availability, and QA overlapping preparation without inspecting/reusing engineering proof as its own. Low-case 15 rounded days fits; high-case 21 days reaches roughly Dec 4 on this calendar. Delayed start shifts delivery day-for-day; unknown target drift can add more. Preserve acceptance; if resolution or proofs consume reserve, move the date instead of dropping isolation, audit, browser or independent QA gates.

Recommended milestones: resolve identity/scope/targets first; finish SCRATCH stages before scheduling APPLY; lock real-read behavior before candidate deployment; reserve QA/Gate D and rework before testers. No claim that this schedule proves current staging readiness.

## Aggregated blockers and owners

| Item | Owner / resolution | Needed by |
|---|---|---|
| Final contract, component/type/deploy allowlist, SELECT/write semantics, config schema, admin audit access | JARVIS records rulings, fills design-dependent counts and FINAL | E2 |
| D-6/O-02/O-03/O-06, cast volume, CF-1 default NO ACTION vs explicit RESTRICT | Tony decides; JARVIS records | E2 |
| SCRATCH/DEV identity, rotated keys, DA-2, read-only live catalog and ACLs | Tony supplies verified access/receipts; Cody observes with scoped authorization | Before target effects; DA-2 no later than APPLY |
| Fresh Jest/build/browser numbers | Cody under authorized artifact-writing probes | Final baseline/implementation gates; historical claims insufficient |
| DEV-safe proof mode and migration recovery | JARVIS approves; Cody implements/tests on disposable clone | Before APPLY |
| Real deployed target/domain/revision/build inputs and deploy-file authority | Tony authenticates/approves scoped target; Cody records | After Gate Q, before separately approved deployment |
| QA Lead holder, independent test plan and release | Tony/QA Lead/Claudy | Q1/Q2 as pack dispatch requires |

## Factual E2 handoff owed later

QAM/QAM_MANIFEST.md and QAM/HANDOFFS/ENGINEERING_HANDOFF.md, release contract §2, AC claims with evidence and full change inventory, E2 metrics, secure tester credential delivery outside repo. They are not filled with invented E1 acceptance results. E1 package is ready for JARVIS review; **no E2 approval or FINAL stamp recorded**.


## 2026-11-06 — application-focused DEV APPLY amendment

Director defers the four Auth indexes on SCRATCH and prohibits a new project/support ticket. Existing SCRATCH synthetic-start rehearsal is complete: see `EVIDENCE/apply/dev-application-rehearsal/HANDOFF.md` and `RESULT.json`. This replaces the full DEV clone/index-reproduction prerequisite for the application path; it does not certify real-backup restoration. Preserve all four existing DEV indexes with read-only definition/validity checks before and after each apply phase. Keep the three-entry managed-ACL decision separate and scoped, and obtain a DEV signup/checkpoint disposition (signup currently enabled). After those rulings and the local pooler correction, prepare the matching fail-closed DEV executor/receipt amendment and Tony-reviewed commands. Tony alone releases and executes DEV writes. Stage 6 remains passed on SCRATCH; independent Gate Q precedes approved deployment and Gate D. No pending copy-only edits are included.


## 2026-11-06 — accepted ACL ruling and DEV executor v2

JARVIS's exact-three-entry DEV default-ACL ruling is now recorded from Tony's instruction. Reuse the accepted narrow synthetic rehearsal; do not recreate Auth indexes or repeat rehearsal. Execute the separately reviewed v2 path in `EVIDENCE/apply/dev-executor-v2/HANDOFF.md`: read-only readiness and preservation capture → transaction bootstrap with all other baseline/index/data checks → 0047 before ledger → ledger 47 → forward 0048–0052 → additive test-account/role seed → effective grants/RLS and real-client Owner/RPC/denial proofs → final receipt. Disabled signup or explicit DEV-checkpoint waiver remains required; current signup is enabled. The final live proof satisfies the conditional ACL acceptance, not this preparation receipt. No shared DEV write authority granted to Cody.
