# Q1 independent recon — a01, 2026-11-13
Scope: source/Git/document inspection only. No acceptance campaign, provider requests, login, email, checkout, database change, install, build or server start. QA Executor independent of engineering; Tony is Director; Lead reached only through Tony and this ZIP.

Both qa/apbm-007a pins match the Director's corrected invocation: OwedBook e30e216607f6d286452192d715ae154d2c181aaf; Portal 2bb13b9471bd19a1dc5e711dbd6ec0bf19bf2b34. Full ancestry/inventories are evidence/Q1/a01/identity.json. Nine prior untracked ZIPs deliberately excluded, preserved and unstaged; hashes recorded. No Git mutations. Engineer release: EVIDENCE/E2/r01/ENGINEERING_HANDOFF.md §8; Director transfers Q1 in this conversation. Historical pending-SHA and unreleased-Q1 text is superseded only for this Q1 invocation.

Canonical contract is frozen v1.0, not the stale v0.2 draft in packed QAM_STATE. Exact hashes recorded. Final expansion table and RA-1–7 govern. Restore NOT PROVEN remains the Director's recorded option-B exception, not a QA restore PASS. E2 receipt reports DEV ledger 60; this was not independently queried.

Independent source observation F-Q1-01 (high-risk candidate concern, not executed failure): Portal src/server/webhook.ts lines 39,48–49,61,80,94,100,117 mark supported unmapped events ignored and return 200; duplicates short-circuit. AC-014/015 require recoverable missing mappings. Also subscription event busy outcome becomes pending then processed (lines 119–120), requiring crash/race challenge. Owner: Engineer for explanation/repair through Architect; QA Lead for test priority/adjudication. No repair performed.

Readiness: Node v22.17.0, npm 11.15.0. Both manifests provide build/lint/test/e2e scripts; Portal has typecheck, OB can use local tsc --noEmit. Ports 3000/3001 already listening; engineering attributes servers/listener to Director, ownership/runtime SHA not independently proven. Do not kill/restart them. No provider or database readiness inferred from open ports. Source search found customer creation in Portal checkout.ts and no test_clock reference in searched server/API paths, corroborating the reported missing seam, not proving a universal absence.

Grouped open gaps:
G1 Director: approve exactly one new DEV Auth identity for brand-new owner or retain blocked coverage. Existing OWNER_1 cannot prove new-owner creation.
G2 Director/Architect/Engineer: retain v1.0 renewal scope and supply reviewed sandbox test-clock seam/new candidate, or issue explicit v1.1 change before release. AC-031/032 remain required and blocked. QA cannot patch the product.
G3 Director/operator + Executor: resolve actual DEV/SCRATCH/account/config/API/listener identities, ledger hashes, runtime candidate, private cast availability/ignored status and separate credentials without exporting values. Not verified in Q1; gate all live work.
G4 Executor/Lead: independent harness, browser binaries/basic interactions and mail/DB/provider interception controls not yet established. Existing Portal e2e specs are reported stale; do not use Engineer integrated harness as proof. Build/test execution deferred to Q2 approval.
G5 Architect/Director: reminder-email mismatch, placeholder Terms/Privacy/support and price-consent approval require disposition against frozen contract. Commercial APA values remain open; only labeled sandbox fixture considered.
G6 Director/Lead: full live effect budget and private exact target/cast binding need approval. Proposed bounded subset is in plan; broader effects remain explicit gaps, not implied allowances.
G7 Lead: retained engineering build/rehearsal/apply evidence is provenance only; decide reuse scope and independent SCRATCH obligations. No restore PASS inferred.
G8 Director: Mission Control target/session availability and separate staging release unavailable; local QA cannot certify Gate D.

No engineering PASS has been promoted to independent evidence. No private env/cast read or credential value scan claimed. Export uses explicit textual/source allowlist, synthetic clean/poison pattern controls and expanded-member scan; limitations retained in packaging receipt.
