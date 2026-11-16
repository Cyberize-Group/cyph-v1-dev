# APBM-007A r02 commit handoff — F-Q1-01 repair and Amendment A1

Prepared by the engineering seat, 13 November 2026. Nothing has been staged or committed. `COMMIT_MANIFEST.json` SHA-256: `cbb15913e6b47e1b6376ea767cdc0f36622057ec5f42a26e5f326f035fcb5bb7`.

| Repo | Branch | Reviewed base | r02 commits |
|---|---|---|---|
| OwedBook | `apbm-007a` | `e30e216607f6d286452192d715ae154d2c181aaf` | 1 — records only (no product change) |
| Payment Portal | `apbm-007a` | `2bb13b9471bd19a1dc5e711dbd6ec0bf19bf2b34` | 2 — product, then records |

Every product and record path below is listed in a literal pathspec file in this folder; `verify_commit.py` compares the staged set and each commit with the manifest (paths, change kind, git blob id, parent). No blanket `git add`. Do not edit any listed file before committing, or its blob will no longer match.

## 1. Payment Portal product (8 paths, `portal-product-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `scripts/operator-reconcile.mjs` | `e6f93e62a0c3a37b71680a435181fa7ba2561ee6` | `b752e0a361b978aa…` |
| 2 | M | `src/__tests__/apbm007a-server.test.ts` | `d3a6271b4817b500d2cb57546c6e92521a463a1b` | `abbcce3de1e17d10…` |
| 3 | M | `src/app/api/operator/operations/route.ts` | `745d3aca8005a980c3bdeb3705543c68635564cd` | `6eb3235143a7f9ad…` |
| 4 | M | `src/server/checkout.ts` | `68937451aa02d1f0e935ac51a79eb96c7721c1ef` | `d4fb65662ee1d7f2…` |
| 5 | M | `src/server/operator.ts` | `f5618d5e09e093318dcb54fadef5c0d766fb3280` | `b987d3410ab2a2b0…` |
| 6 | M | `src/server/stripeMirror.ts` | `eb2c2200c7c86ad7ad1bc5d2434ea5b3a369b27e` | `016b286800d20efe…` |
| 7 | M | `src/server/webhook.ts` | `37a51a4580380ee09cd87ae8ac12c0f72e7f835b` | `3e87041c08a2e34c…` |
| 8 | A | `src/__tests__/apbm007a-webhook-recovery.test.ts` | `66a5ebb4584e431b38271276afd0bac9583fecf7` | `876121e3431f0eac…` |

## 2. Records

### Payment Portal operating records (5 paths, `portal-records-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `RECOVERY.md` | `d8db3edb852c3d686d9dc99a758ba60d13d208ac` | `54807d7ca20d5609…` |
| 2 | M | `agent_docs/SESSIONS/session_2026-11-13.md` | `fbab858b295cba0045dd638a8acd6e54b3e80242` | `998ff865c8086b62…` |
| 3 | A | `agent_docs/RESPONSES/response_2026-11-13_122840_repair-blocker.md` | `800f1814cefcc2bcc3817b90978555fac9aaf8c9` | `88566879b8aec2b5…` |
| 4 | A | `agent_docs/RESPONSES/response_2026-11-13_130120_qa-preserve-switch.md` | `56e6f81171bad7fe6ee5ff355f7492ce04ce179b` | `a99e4c56d33760b9…` |
| 5 | A | `agent_docs/RESPONSES/response_2026-11-13_133229_f-q1-01-repair.md` | `f9ee46595ec4304ccb838e050349d7eec8fc6967` | `40cdf9c260d1e7f4…` |

### OwedBook module records (14 paths, `owedbook-records-add.txt`, plus this `commit/` folder)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/AMENDMENT_LEDGER.md` | `32763e0d9c3d582d6b706e00c179220bdd7b2801` | `a257e8748d23a457…` |
| 2 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/APBM_ACCEPTANCE_SPEC.md` | `23a1336efd5be39f23ff35fe50d696ecae56d9e1` | `c9c9f65106b11068…` |
| 3 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/APBM_JOURNAL.md` | `5d3a4847b51d0fc7a279f428defc69caf10b7965` | `8030f072063ebfbb…` |
| 4 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/APBM_RULINGS.md` | `b0a5bd9c00e46085fc614fd93dfe89ff955774c5` | `b77c8d1cf17bebf0…` |
| 5 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/APBM_STATE.md` | `1620b25d586598212f39bdc3d07458e9907f9fdd` | `2971a93e6ac8c0fd…` |
| 6 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/CONTRACTS/BILLING_AND_PAYMENTS_CONTRACT.md` | `d00b45064a76436af9fe9c0d7b685f3b7fcdf84c` | `a7ef0137f6355b92…` |
| 7 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/CONTRACTS/ENVIRONMENT_AND_EFFECTS.md` | `2091baf05ea7fecd4b7a15a50d1f8f9f019ac0e3` | `f276fee4f30204d7…` |
| 8 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/CONTRACTS/IMPLEMENTATION_REQUIREMENTS.md` | `ce8dce4a6f0542237c802163159df59f2b1a2621` | `8d6ffa1cfcb24832…` |
| 9 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/QA_HANDOFF.md` | `2b70035592cafc45634d4bd405070f3c0565d10f` | `b913cd23e9b9f81b…` |
| 10 | A | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/CARRY_FORWARD_007B.md` | `7f22ede9bdddf1acf692668e41285ccde32d255a` | `48aae2557a9606b7…` |
| 11 | A | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r02/REPAIR_F-Q1-01.md` | `7f181d0cb7826b4813ccc25d7d1953f8af19df6c` | `30fea0703f858d79…` |
| 12 | A | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r02/dev_event_ledger_readonly.json` | `8a4124b484313d8d9ddc593836f5477eb26009cf` | `5d311e69bcad156b…` |
| 13 | A | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r02/focused_tests.json` | `662a9bcdb21971dcece1ce7f919fc7dedfab5d4e` | `cb47b4da45b6aafb…` |
| 14 | A | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r02/mutation_controls.txt` | `aa80da6b41085b36a95188d1c6b90ed90f6ec146` | `9f348eb50c1e568c…` |

## 3. Excluded — never staged by these commands

Independent QA's uncommitted work in OwedBook (37 paths, preserved and untouched by Engineering; checksums verified unchanged at packaging):

| Path (under the module) | Reason |
|---|---|
| `QAM/AC_EVIDENCE_MATRIX.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/REVIEW_START_HERE.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/QAM_RECON_REPORT.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/QAM_STATE.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/QAM_TEST_PLAN.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_APPLY_REVIEW_r01.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r2.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r3.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r4.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r5.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r6.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r01.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r02.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q1_REVIEW_a01.receipt.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q1_REVIEW_a01.zip` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a01/contract_hashes.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a01/identity.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a01/packaging_controls.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a01/preserved_archives.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/AC_EVIDENCE_MATRIX.md.diff` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/QAM_RECON_REPORT.md.diff` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/QAM_STATE.md.diff` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/QAM_TEST_PLAN.md.diff` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/a01_AC_EVIDENCE_MATRIX.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/a01_QAM_RECON_REPORT.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/a01_QAM_STATE.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/a01_QAM_TEST_PLAN.md` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/browsers.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/cast_schema.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/credential_schema.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/database.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/isolation.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/listener.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/processes.json` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/readiness.cjs` | independent QA (Cody) uncommitted work, preserved and untouched |
| `QAM/evidence/Q1/a02/working_plan_hash.json` | independent QA (Cody) uncommitted work, preserved and untouched |

Outside the repos, never committed: both `.env.local` files and the portal's `.env.qa.local`; the private inbox file; the work lane `ARCHIVE/APBM007A_E2_WORK/r02/` (build log, generator); the Director's QA backup.

## 4. Commands

Run each block in order. Each block runs in a subshell and stops at the first failure without closing your terminal.

### 4.1 Payment Portal — product commit, then records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r02/commit
test "$(git branch --show-current)" = "apbm-007a"
test "$(git rev-parse HEAD)" = "2bb13b9471bd19a1dc5e711dbd6ec0bf19bf2b34"
git diff --cached --quiet                       # nothing staged yet
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/portal-product-add.txt"
python3 "$C/verify_commit.py" portal product staged
git commit -m "fix: APBM007A F-Q1-01 webhook recovery and renewal reminder record" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal product committed
git add --pathspec-from-file="$C/portal-records-add.txt"
python3 "$C/verify_commit.py" portal records staged
git commit -m "docs: record APBM007A r02 portal operations" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal records committed
git log --oneline -3 )
```

### 4.2 OwedBook — records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r02/commit
test "$(git branch --show-current)" = "apbm-007a"
test "$(git rev-parse HEAD)" = "e30e216607f6d286452192d715ae154d2c181aaf"
git diff --cached --quiet                       # nothing staged yet (QA's modified files stay unstaged)
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/owedbook-records-add.txt"
git add -- "$C"
python3 "$C/verify_commit.py" owedbook records staged
git commit -m "docs: record APBM007A r02 repair evidence and Amendment A1" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" owedbook records committed
git log --oneline -2
git status --porcelain --untracked-files=all | wc -l   # expect 37: QA's files, still uncommitted
)
```

## 5. After the commits — candidate pair for QA

1. Send the three commit IDs to Engineering for the state record (no new pins are invented here).
2. Return the checkouts to QA. These commits touch none of QA's 37 files, so a fast-forward keeps them in place:

```bash
for r in /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1; do
  git -C "$r" switch qa/apbm-007a && git -C "$r" merge --ff-only apbm-007a
done
```

3. New candidate pair: OwedBook = the r02 records commit; Payment Portal = the r02 records commit (product at the r02 product commit). OwedBook product code is unchanged from `e30e216`.
4. QA's rebind needs: fresh portal install/typecheck/lint/unit/build (product changed); remap of AC-014, AC-015, AC-031, AC-032 and the 014–015 / 031–032 expansions against `APBM_ACCEPTANCE_SPEC.md` "Amendment A1"; T-015 recovery entrypoint pinned at the portal product commit (`scripts/operator-reconcile.mjs --list` / `--event <evt_ID>`); the single G1 identity under the QA capsule.
