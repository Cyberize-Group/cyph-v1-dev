# APBM-007A — closeout report

**Status: closeout prepared; Director merge/push pending.** APBM-007A becomes CLOSED only after Tony's merge of `qa/apbm-007a` into `main` and the push are verified in **both** repositories. No merge SHA is recorded here until then. No deployment; Gate D not run.

Prepared 16 November 2026 by the engineering seat (Claude) under JARVIS's final closeout instruction. This is an administrative pass: no product, test, configuration, dependency or contract byte changes; no database, Stripe, Auth, email or payment effect; no server, deployment or fixture cleanup.

## 1. Authority and certificate

| Item | Value |
|---|---|
| Gate Q | **PASS WITH KNOWN RISK**, issued by the QA Lead (Friday), 16 November 2026 15:00 Asia/Dhaka, relayed by the Director |
| Certificate (verbatim, unchanged) | `QAM/QAM_CERTIFICATION.md`, SHA-256 `ac7d0ab2e377e207c7eba039c2ffc883bae8055889f45230c19d696e90c6b493`; JARVIS verified it byte-for-byte against Friday's certificate |
| Certified pair | OwedBook `c976968b20ee724f7390d5e0e008215f50ab6f25`; Payment Portal `54a56b55ea7c72783d17d06ff45cd27b5426803f`, certified product `6ed09ffc05685a163833cb68fcae4383c67ae349` |
| Final QA package | `Q4_REVIEW_a05`, SHA-256 `e700ab73ea2eb42e7329f8d508a84e35ddeb795e025bb1106e5d93f627ba4f4b` |
| Q5 cleanup | `QAM/QAM_CLEANUP_REPORT.md` (SHA-256 `f96d6f374c1221d4129b4373b71de9874eb3af96f8f4a77ad70c8418d8da2718`); package `APBM-007A-CYBER-PHARMA_Q5_CLEANUP_a01.zip`, SHA-256 `7c6c33edb074a9575b6817d4a782dd6a620d577f355bebfb456f4be6bd5f8e28` (392 members; JARVIS verified all 391 indexed files and no unindexed members); archived at `/home/moose/APBM007A_QA_ARCHIVE/` with an identical Downloads copy; receipt `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q5_CLEANUP_a01.receipt.json` |
| Post-certification product | U-1, U-2, U-3 (r06): **Director-accepted, not independently QA-certified** (certificate "Follow-ups"; Tony accepted without another QA run) |
| Checkouts | Cody completed Q5 and released both checkouts; Tony confirms all previously supplied commit commands were run |

## 2. Actual identities (read-only inspection, 16 November 2026)

Both repositories: branch `qa/apbm-007a`, clean index, no tracked or untracked changes before this closeout's records.

| | OwedBook | Payment Portal |
|---|---|---|
| Certified HEAD | `c976968b20ee724f7390d5e0e008215f50ab6f25` | `54a56b55ea7c72783d17d06ff45cd27b5426803f` (product `6ed09ffc05685a163833cb68fcae4383c67ae349`) |
| r06 UI product (Director-accepted) | `c554c2dc9eba302cd8d4ba2da24da05990e0afd0` | `516b49f5912e31bca3bb903dd262994c0e83fcbf` |
| r06 records | `c59ead583c9d20328d1a85af60d015753b62abf7` | `1a3913262ed0f8e8303823d92d2551fd9cc725b3` |
| Q5 QA records (certificate and cleanup) | `af1b4af04592f04689de2e4de59f28db65437f8b` | none (the portal had no QA-owned changes) |
| HEAD at closeout preparation | `af1b4af04592f04689de2e4de59f28db65437f8b` | `1a3913262ed0f8e8303823d92d2551fd9cc725b3` |
| Closeout records commit | pending (the commit that adds this file; ID printed by Tony's commands) | pending (ID printed by Tony's commands) |
| Local `main` = last-fetched `origin/main` | `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` (ancestor of `qa/apbm-007a`) | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` (ancestor of `qa/apbm-007a`) |
| Remotes | `Cyberize-Group/cyph-v1-dev` | `ahmedmusawir/cyph-payment-portal-dev-v1` |
| Merge into `main` / pushed `main` | **pending (Tony)** | **pending (Tony)** |

The Q5 report's "pre-cleanup-commit heads" (OwedBook `c59ead5…`, Portal `1a39132…`) are historical checkpoints; they match the r06 records commits above.

### Successor diff from the certified pair (verified by path and blob, not by commit message)

| Repository | Since certified HEAD | Classification |
|---|---|---|
| OwedBook | 3 commits, first-parent, no merges | **12 product/test paths**, exactly the r06 manifest and byte-identical to it (`c554c2d`). **65 engineering/admin record paths** (`c59ead5`, of which one is the engineering-owned `QAM/HANDOFFS/QA_HANDOFF.md`). **378 QA record paths** under `QAM/` (`af1b4af`; nothing outside `QAM/`) |
| Payment Portal | 2 commits, no merges | **3 product/test paths**, exactly the r06 manifest (`516b49f`). **3 operating-record paths** (`1a39132`) |

So the only product deltas after certification are the Director-accepted U-1/U-2/U-3 files. Every r06 blob still equals the r06 manifest at HEAD.

## 3. History (engineering → QA → repair → certification → cleanup)

| Stage | Outcome |
|---|---|
| E1 | Recon and v1.0 technical freeze (Friday Review 3) |
| E2 r01 | Implementation in both apps; DEV migrations 0053–0060 applied under delegation; integrated proof (webhook-secret FAIL closed on 13 November) |
| Q1 a01/a02 | Recon and plan; **F-Q1-01** (webhook recovery) |
| r02 | F-Q1-01 repaired; Amendment A1 recorded |
| Q2 a01 | **FAIL** (preserved): **F-Q2-001** registration could not reach review; **F-Q2-002** undo with both cancellation fields |
| r03 | F-Q2-001 and F-Q2-002 repaired; erratum E-A1-1 |
| Q4 a01 | STOP-IDENTITY (served build), preserved |
| Q4 a02 / r04 | **F-Q4-001** lost-answer retry; repaired |
| Q4 a03 | Partial recheck; F-Q2-001 no longer reproduced |
| Q4 a04 / r05 | **F-Q4-002**, **F-Q4-003**, **F-Q4-004**; repaired (provisioning concurrency, stale checkout, single access email) |
| Q4 a05 / a06 | Final package; manual Director session with Executor verification |
| Gate Q | **PASS WITH KNOWN RISK** on OwedBook `c976968` / Portal `54a56b5` |
| r06 | U-1, U-2, U-3 UI repair; Director-accepted; Director rulings on Mission Control and placeholders |
| Q5 | Cleanup a01 complete; QA records committed (`af1b4af`); checkouts released |
| Closeout | This report; integration by Tony pending |

Every failed run and stop above is preserved in `QAM/` and the engineering evidence lanes; nothing was rewritten.

## 4. Accepted risks, limitations and carried items

Certificate risks 1–11 are carried unchanged (see `QAM/QAM_CERTIFICATION.md`, "Known risks and limitations, accepted"). Additional carried items:

| Item | Status |
|---|---|
| O-1 | Live failed-renewal and seven-day-grace journey with a Stripe test clock: **NOT RUN BY DIRECTOR RULING**, never passed; required before production billing (007B) |
| O-2 | Renewal reminder email delivery: deferred to 007B; required before production billing |
| O-3 | Placeholder Terms, Privacy, support address and price-consent wording: accepted for 007A local use only; must be resolved before any external or staging exposure |
| U-2 price | OwedBook shows no numeric price. "Price shown in the billing portal" is the accepted local presentation; **no amount was verified** and none is claimed. A numeric price needs a Director ruling (mirrored amount = database change, or a provider read) |
| U-1/U-2/U-3 | Director-accepted, not independently QA-certified; engineering evidence was fixture proof (EVIDENCE/E2/r06) |
| Mission Control | Outside this module's scope (Director ruling); not graded and not a limitation |
| Fixtures | DEV and SCRATCH test data, Stripe sandbox objects and QA identities **retained**; Q5 inventories them by ID. No deletion authority is granted; a Director fixture-cleanup ruling is required |
| Restricted archives | `APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r01.zip` (SHA-256 `9be2a131…2fda55`) and `…_r02.zip` (SHA-256 `0e395674…fc45d75`), Engineering returns of 12–13 November, each contain an exact private-cast value (Q5 value scan). They are kept immutable, mode 600 in the mode-700 archive `/home/moose/APBM007A_QA_ARCHIVE/`, outside Git, and are never copied into Git or new deliverables. This was an Engineering packaging failure, found by QA |
| Quarantined helper | QA's original `Q2-a01/npi-concurrency.cjs` is quarantined privately; a redacted copy is retained |
| Deployment / Gate D | Not done; no deployment before 007B |

## 5. Deferred work: owners and triggers

| Item | Owner | Trigger |
|---|---|---|
| O-1 live renewal and grace journey | Architect scopes in 007B; Engineering implements the test-clock seam; independent QA proves | Before production billing |
| O-2 reminder email | Architect (007B scope); Director supplies the mail-sending credential or provider template | Before production billing |
| O-3 placeholders | Director supplies final Terms, Privacy, support and price-consent content; Engineering installs; QA verifies | Before any external or staging exposure |
| U-2 numeric price | Director rules whether a price amount is shown; then Architect scopes (database mirror or provider read) | When a numeric price is wanted, or before external exposure if required |
| Independent QA of U-1/U-2/U-3 | QA Lead decides whether 007B or a later gate retests them | At the next QA gate covering these screens |
| Certificate risks 1–3 (restore, AC-004 rehearsal, real-Auth crash) | Director / QA Lead | Before production |
| Certificate risks 7–11 | QA Lead | Next relevant QA gate |
| Fixture cleanup | Director rules; QA executes | Before staging or when the Director decides |
| Restricted archives | Director (retention or destruction ruling) | Director's discretion; no automatic deletion |
| Gate D (deployment) | Director; separately scoped | With 007B staging |

## 6. Remaining integration (Tony)

Commands: `EVIDENCE/CLOSEOUT/commit/COMMIT_HANDOFF.md`.

**Per repository:**
1. Commit this closeout's records, using the guarded literal-pathspec commands and manifest verifier.
2. Refresh the remote safely.
3. Check that `origin/main` is still an ancestor of the QA head; stop if it has diverged.
4. Fast-forward local `main` to `origin/main`.
5. Merge with `git merge --no-ff qa/apbm-007a`.
6. Verify that the merged tree equals the certified-plus-accepted QA head tree, then push normally.
7. Verify that `main` equals `origin/main`, that the QA head is contained, and that the tree is clean.
8. Print the full SHAs.

**Then:** record both merge SHAs, and the module becomes CLOSED.

Branches and archives are not deleted.

## 7. Records touched and left alone

- **Updated (closeout records only):**
  - OwedBook: this report, `APBM_STATE.md`, `APBM_JOURNAL.md`, `CARRY_FORWARD_007B.md`, status banners in `README.md` and `REVIEW_START_HERE.md`, `CHANGELOG.md`, and `EVIDENCE/CLOSEOUT/commit/`.
  - Portal: `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA_POINTER.md`, `RECOVERY.md`, the session file, a response record and `CHANGELOG.md`.
- **Not touched:**
  - All `QAM/` files (QA-owned; the certificate is verbatim).
  - All product, test, configuration, dependency and contract files.
  - `RETROSPECTIVE.md`, left "NOT RUN" for the Architect: it asks for durations and intervention counts that this pass cannot source exactly.
  - The Portal's `agent_docs/PROJECT_POINTER.md`, which still names the earlier FFM-ABM-001 module as active; re-pointing it is the next Architect's routing decision.
