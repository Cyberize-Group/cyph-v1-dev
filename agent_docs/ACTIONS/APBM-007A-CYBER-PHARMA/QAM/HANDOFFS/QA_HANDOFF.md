# Checkout ownership transfer

## Outgoing Engineer record — 13 November 2026 (Asia/Dhaka)

| Field | Value |
|---|---|
| Outgoing writer | Claudy (engineering seat), run apbm007a_e2_r01 |
| OwedBook checkout | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`, branch `apbm-007a`, base `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694`; candidate commits pending the Director (lists and hashes: `EVIDENCE/E2/r01/commit/`) |
| Payment Portal checkout | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`, branch `apbm-007a`, base `c89572a45210e7d6f098c2878cfabe9a1c5326f1`; candidate commits pending the Director |
| Processes | None owned by Engineering. OwedBook :3000, portal :3001 and the Stripe listener are the Director's; the server on :3457 is unrelated and untouched |
| Controlled resources retained | Stripe sandbox catalogue, OWNER_1's active test subscription, 6 test customers; DEV rows of OWNER_1's account and store; SCRATCH proof rows and 12 harness identities |
| Open items for QA | `EVIDENCE/E2/r01/ENGINEERING_HANDOFF.md` §11 (NOT RUN, incomplete items, risks R1–R7) |
| Release | Engineering releases both checkouts once the Director's commits verify against the manifest. No engineering writer after that without a recorded repair assignment |

## Incoming independent QA Executor

NOT RECORDED. Verify both commit identities and accept both checkouts before Q1.

## Engineering repair r02 record — 13 November 2026 (Asia/Dhaka)

Recorded by the engineering seat under the JARVIS repair assignment. QA (Cody) was paused by the Director; the Director backed up QA's 37 uncommitted OwedBook files and reported them verified unchanged and switched both checkouts from `qa/apbm-007a` to `apbm-007a` at the same commits. Engineering did not edit, stage or move any QA file.

| Field | Value |
|---|---|
| Repair | F-Q1-01 webhook recovery; record `EVIDENCE/E2/r02/REPAIR_F-Q1-01.md` |
| Product change | Payment Portal only (8 paths). OwedBook product unchanged |
| Bases | OwedBook `e30e216`, Payment Portal `2bb13b9`; new commits pending the Director (`EVIDENCE/E2/r02/commit/`) |
| Recovery entrypoint to pin for T-015 | `node scripts/operator-reconcile.mjs --list` and `--event <evt_ID>` (portal), backed by `recoverEvent` / `listUnfinishedEvents` in `src/server/webhook.ts` |
| Operative acceptance | APBM_ACCEPTANCE_SPEC.md "Amendment A1": AC-014, AC-015, new expansion 014–015, AC-031, AC-032, expansion 031–032 and RA-6 amended; AC-029 and AC-030 unchanged |
| Deferred, never passed | Live failed-renewal / grace journey: NOT RUN BY DIRECTOR RULING (CARRY_FORWARD_007B.md O-1). Reminder email deferred (O-2); 007A expects banner plus `renewal_reminder` record |
| Identity allowance for QA | Exactly one new DEV Auth identity, Director-controlled private inbox, for QA's new-owner journey only (A1-4). Not created by Engineering; no access email sent |
| QA files to re-map | QA-owned AC_EVIDENCE_MATRIX, QAM_TEST_PLAN, QAM_RECON_REPORT and QAM_STATE reference the pre-amendment wording; Engineering left them untouched for QA to update |
| Processes | None started by Engineering. The servers on :3000/:3001 are the Director's; changed portal source may have hot-reloaded in the Director's dev server |
| Release | Engineering releases both checkouts once the Director's r02 commits verify against `EVIDENCE/E2/r02/commit/COMMIT_MANIFEST.json` |

## Engineering repair r03 record — 16 November 2026 (Asia/Dhaka)

Recorded by the engineering seat under JARVIS's Q2 repair instruction. The repair was made on `qa/apbm-007a` in the existing checkouts; no branch switch, worktree, stash or Git mutation. QA's uncommitted work (5,011 OwedBook paths, one ignored portal output) was backed up privately and verified unchanged; Engineering edited none of it.

| Field | Value |
|---|---|
| Findings repaired | F-Q2-001 (AC-007, AC-009, AC-034 and dependent purchase proofs); F-Q2-002 (RA-4 / AC-030). Record `EVIDENCE/E2/r03/REPAIR_F-Q2.md` |
| Verdict | Friday's Q2 a01 FAIL stands. Engineering evidence closes no finding |
| Product change | Payment Portal only, 5 paths (`PharmacyStepView.tsx`, `billing.ts`, three test files). OwedBook product unchanged |
| Bases | Payment Portal `9d938f6`, OwedBook `37f6c0d`; new commits pending the Director (`EVIDENCE/E2/r03/commit/`) |
| QA backup | `~/APBM007A_QA_BACKUPS/q2_r03_20261116_100605/`, manifest `SHA256SUMS.before` (5,012 entries) |
| Running QA helpers | `Q2-a01/new-owner.cjs` and `new-owner-retry.cjs` (sleeping, no sockets) left running for QA to dispose of |
| DEV effects for QA's ledger | 1 synthetic draft (owner `eng.proof.r03@example.test`, NPI `1373398746`, 3 revisions, 3 quotes) and its NPI hold, left in place; no identity, email, checkout, payment or Stripe mutation |
| Identity allowance | The one approved new DEV identity is untouched and still reserved for QA's new-owner journey |
| Retest impact | REPAIR_F-Q2.md §11 |
| Release | Engineering releases both checkouts to QA once the Director's r03 commits verify against `EVIDENCE/E2/r03/commit/COMMIT_MANIFEST.json` |

## Engineering repair r04 record — 16 November 2026 (Asia/Dhaka)

Recorded by the engineering seat under JARVIS's single bounded repair for F-Q4-001 / AC-011. The repair was made on `qa/apbm-007a` in the existing checkouts; no branch switch, worktree, stash or Git mutation. QA's uncommitted work (3,422 OwedBook paths, one ignored portal output) was backed up privately and verified unchanged; Engineering edited none of it.

| Field | Value |
|---|---|
| Finding repaired | F-Q4-001 (AC-011). Record `EVIDENCE/E2/r04/REPAIR_F-Q4-001.md` |
| Verdict | Friday's disposition stands. Engineering evidence closes no finding |
| Product change | Payment Portal `src/server/checkout.ts` and one new test file. OwedBook product unchanged |
| Bases | Payment Portal `357c274` (product `4cd96c8`), OwedBook `f637ba4`; new commits pending the Director (`EVIDENCE/E2/r04/commit/`) |
| QA backup | `~/APBM007A_QA_BACKUPS/q4_r04_20261116_114741/`, manifest `SHA256SUMS.before` (3,423 entries) |
| For QA's instruments | A provider adapter must compare parameters on a repeated idempotency key, as Stripe does, to measure the same-key path faithfully |
| Effects | Two rolled-back SCRATCH transactions; no DEV, Stripe, Auth, email, checkout or payment effect |
| Runtime | After the commits the portal must be rebuilt and restarted on the repaired candidate before Friday binds the pair |
| Retest impact | REPAIR_F-Q4-001.md §8 |
| Release | Engineering releases both checkouts to QA once the Director's r04 commits verify against `EVIDENCE/E2/r04/commit/COMMIT_MANIFEST.json` |

## Engineering repair r05 record — 16 November 2026 (Asia/Dhaka)

Recorded by the engineering seat under JARVIS's consolidated repair for F-Q4-003, F-Q4-002 and the F-Q4-004 diagnosis. The repair was made on `qa/apbm-007a` in the existing checkouts; no branch switch, worktree, stash or Git mutation. QA's uncommitted work (6,613 OwedBook paths, one ignored portal output) was backed up privately and verified unchanged; Engineering edited none of it.

| Field | Value |
|---|---|
| Record | `EVIDENCE/E2/r05/REPAIR_F-Q4-003_F-Q4-002_F-Q4-004.md` |
| Verdict | Friday's FAIL stands. Engineering evidence closes no finding |
| Product change | Payment Portal `src/server/provisioning.ts`, `src/server/checkout.ts`, `src/server/accessEmail.ts` plus tests. No migration. OwedBook product unchanged |
| Bases | Payment Portal `93add6f` (product `c638f79`), OwedBook `0249109`; new commits pending the Director (`EVIDENCE/E2/r05/commit/`) |
| DEV 25acbfb9 | Not repaired, advanced, resent or deleted. QA's recovery under AC-038: REPAIR §6 (needs the rebuilt and restarted portal) |
| QA backup | `~/APBM007A_QA_BACKUPS/q4_r05_20261116_124823/`, manifest `SHA256SUMS.before` (6,614 entries) |
| Pending | The proposed additional QA identity and sandbox purchase remain PENDING Director confirmation; not consumed |
| Runtime | Rebuild and restart the portal on the repaired candidate before Friday binds the pair |
| Retest impact | REPAIR §10 |
| Release | Engineering releases both checkouts to QA once the Director's r05 commits verify against `EVIDENCE/E2/r05/commit/COMMIT_MANIFEST.json` |

## Engineering repair r06 record — 16 November 2026 (Asia/Dhaka)

Recorded by the engineering seat under JARVIS's final bounded UI repair (U-1, U-2, U-3). The repair was made on `qa/apbm-007a` in the existing checkouts; no branch switch, worktree, stash or Git mutation. QA's uncommitted work (9,805 OwedBook paths, one ignored portal output) was backed up privately and verified unchanged; Engineering edited none of it. QA was in the Director-gated a06 wait throughout.

| Field | Value |
|---|---|
| Record | `EVIDENCE/E2/r06/REPAIR_U-1_U-2_U-3.md` |
| Product change | OwedBook: `AdminSidebar.tsx`, `BillingRow.tsx`, `services/adminDemo.ts`, `types/adminDemo.ts`, `LoginForm.tsx`, `ProfileForm.tsx`, new `ui/password-input.tsx`. Portal: `FormField.tsx`, `LoginPageContent.tsx`. Plus tests. No database change |
| Bases | OwedBook `c976968`, Portal `54a56b5`; new commits pending the Director (`EVIDENCE/E2/r06/commit/`) |
| QA backup | `~/APBM007A_QA_BACKUPS/u123_r06_20261116_150305/`, manifest `SHA256SUMS.before` (9,806 entries) |
| Live check for QA | U-2 rendering of DEV's real paid subscription for the real owner (the engineering walk is fixture proof) |
| Director rulings | Mission Control out of scope; placeholders accepted for local use, resolved before staging (APBM_RULINGS.md) |
| Runtime | Rebuild **both** apps on the repaired pair before Friday binds |
| Retest impact | REPAIR §10 |
| Release | Engineering releases both checkouts to QA once the Director's r06 commits verify against `EVIDENCE/E2/r06/commit/COMMIT_MANIFEST.json` |
