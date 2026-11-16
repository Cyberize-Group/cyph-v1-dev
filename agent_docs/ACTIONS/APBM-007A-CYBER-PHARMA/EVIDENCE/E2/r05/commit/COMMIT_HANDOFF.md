# APBM-007A r05 commit handoff — Q4 repair F-Q4-003, F-Q4-002, F-Q4-004

Prepared by the engineering seat, 16 November 2026. Nothing has been staged or committed. `COMMIT_MANIFEST.json` SHA-256: `c5a16f7871607eb75a7c8edfa24630960888cd0aeb7803e2fee519b5116fb9e8`.

Commits are made on **`qa/apbm-007a`**, the QA line (QAM_PLAYBOOK §11, RRM_PLAYBOOK §§7 and 9). There is no branch switch before or after.

| Repo | Branch | Reviewed base (expected HEAD) | r05 commits |
|---|---|---|---|
| Payment Portal | `qa/apbm-007a` | `93add6f32be53da34ac6fb6fff7fa85076f97a1c` | 2: product, then records |
| OwedBook | `qa/apbm-007a` | `0249109f9b688e89c6a3c2bc64ab87167e89d9c9` | 1: records only (no product change) |

How the commands are controlled:
- Every path is listed in a literal pathspec file in this folder; there is no blanket `git add`.
- `verify_commit.py` compares the staged set, and then each commit, with the manifest: paths, change kind, git blob id and parent.
- Do not edit any listed file before committing, or its blob will no longer match.

## 1. Payment Portal product (6 paths, `portal-product-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `src/__tests__/apbm007a-checkout-recovery.test.ts` | `c5e1552a2a32ee6f32986c1edcc2b9b2aaf4a1f9` | `e399cb0feb5b6abc…` |
| 2 | M | `src/__tests__/apbm007a-mail-guard.test.ts` | `459e20e60de397796fa02403c83ca91dd049063a` | `105e880e3abbb412…` |
| 3 | M | `src/server/accessEmail.ts` | `e9ecd879db63d89a0ee3c93b1741a38bf1fe852b` | `e2f0c69e3e35423a…` |
| 4 | M | `src/server/checkout.ts` | `5590fd7358dae96eb26a877e141a3139a1a4cd56` | `7e049cf88b8f3bab…` |
| 5 | M | `src/server/provisioning.ts` | `072b3d748526910b97af993e686b126b8493a6fa` | `f7a1d68df46ec607…` |
| 6 | A | `src/__tests__/apbm007a-provisioning-concurrency.test.ts` | `d2a000a33e29f9b4611d1024329443974c384bc6` | `0010bb6376edd8d4…` |

## 2. Records

### Payment Portal operating records (3 paths, `portal-records-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `RECOVERY.md` | `9a8cb1b81ec8d7900ec369e55503b3e7e3e552b6` | `1a6555e38f983db0…` |
| 2 | M | `agent_docs/SESSIONS/session_2026-11-16.md` | `0b8bb41d4b8300f59f540c47a2607af8a54f4b25` | `267736014419311d…` |
| 3 | A | `agent_docs/RESPONSES/response_2026-11-16_125142_q4-r05-repair-handback.md` | `0d33d31853d641afd6c6972190afdcd9a726e726` | `c0ba91837808373f…` |

### OwedBook module records (19 paths, `owedbook-records-add.txt`, plus this `commit/` folder)

Paths are under `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`.

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `APBM_JOURNAL.md` | `0e1cd99bf5c66ff87e1fc60de785c1c54652f496` | `9fbb916f2741cd5e…` |
| 2 | M | `APBM_STATE.md` | `dbb8e5d5022d92f8a70b4d6a53fcea6f46ce347a` | `1a528db6b0e3efed…` |
| 3 | M | `QAM/HANDOFFS/QA_HANDOFF.md` | `af35d3757cd31c7170be6d116f356cccb20a1a64` | `f6ac3c4502c842a9…` |
| 4 | A | `EVIDENCE/E2/r05/REPAIR_F-Q4-003_F-Q4-002_F-Q4-004.md` | `8d4274eb723331fd6c8032cf473d719e825eff99` | `d15ca4fe77705c56…` |
| 5 | A | `EVIDENCE/E2/r05/build_pp.log` | `1881af83cbcc06bedb84d7ebdff8363af428a4d9` | `6bf06bdd915b2500…` |
| 6 | A | `EVIDENCE/E2/r05/bundle_scan.txt` | `bf1c8c0e409f9ce02078d95045434027f057d3c0` | `e704087ede7d1240…` |
| 7 | A | `EVIDENCE/E2/r05/candidate_control_tests.json` | `672461f01396e3a705cfe8c48bbd0b9c6ff0e3c9` | `469cfa9e8faa6c55…` |
| 8 | A | `EVIDENCE/E2/r05/focused_tests.json` | `a3057b648927f3ad2624b1ca91235ea3d3c6a467` | `c08b46789fbfe326…` |
| 9 | A | `EVIDENCE/E2/r05/helpers/scratch-r05.cjs` | `d3c6d6c881dc417927098d74953c0977eb71c800` | `302fbb83a688823e…` |
| 10 | A | `EVIDENCE/E2/r05/mutation_controls.txt` | `24530ac76a4a97effe3b693f4a3b24305a280f98` | `a594f0ccf212dfbe…` |
| 11 | A | `EVIDENCE/E2/r05/product.patch` | `6795f4ce1c417255303f98beab47bd16262bd7d0` | `ba2fd1f252c6684e…` |
| 12 | A | `EVIDENCE/E2/r05/provenance.json` | `9dea8a2abf7aab8c15aa583785e413786509bcad` | `a1dce62976c75fa2…` |
| 13 | A | `EVIDENCE/E2/r05/qa_preservation.json` | `8557dfef455e627c08fccd72318799cb74c7d63f` | `e6866a1cc48c08d9…` |
| 14 | A | `EVIDENCE/E2/r05/scratch/scratch_r05_candidate_control.json` | `061065cab167682b33f45128490b7621cd1a3399` | `3675e19b3abcf1f0…` |
| 15 | A | `EVIDENCE/E2/r05/scratch/scratch_r05_candidate_control_attempt1_timing.json` | `5d5eaa6944042e448d40f69bba5adff3cb498a82` | `10efbcb4c91783ca…` |
| 16 | A | `EVIDENCE/E2/r05/scratch/scratch_r05_candidate_control_attempt2_partial.json` | `6fc5c381a53996b261a84bf978a96febe5132017` | `a6089910d3d1f51a…` |
| 17 | A | `EVIDENCE/E2/r05/scratch/scratch_r05_repair.json` | `4c41f45976629134eaf323b01759a43d1ce49cef` | `5d82932a51b009d5…` |
| 18 | A | `EVIDENCE/E2/r05/scratch/scratch_r05_repair_attempt1_instrument_fault.json` | `a7308c02dd36246046688859507e527c74274d81` | `5b17a52688d130ee…` |
| 19 | A | `EVIDENCE/E2/r05/scratch/scratch_r05_repair_attempt2_instrument_fault.json` | `58acd707a3b10316afe7f248c6efbbdfa3170050` | `1156006b80c6d020…` |

## 3. Excluded — never staged by these commands

All **6,613** uncommitted QA paths in OwedBook (independent QA, Cody) are excluded. Engineering preserved them and did not touch them; their checksums were verified unchanged.
- Every one of the 6,613 paths (QA records, reports, evidence, helpers, automation, build mirrors, npm caches and ZIPs) is listed in `COMMIT_MANIFEST.json` → `excluded_qa.listed_paths`.

Full per-file checksums are in the private backup, `~/APBM007A_QA_BACKUPS/q4_r05_20261116_124823/SHA256SUMS.before`.

Also never committed:
- both `.env.local` files and the portal's `.env.qa.local`;
- the private inbox and QA cast files;
- the portal's ignored `test-results/`;
- the work lane `ARCHIVE/APBM007A_E2_WORK/r05/`;
- the private QA backup;
- the review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REPAIR_REVIEW_r05.zip` and its receipt (a derived archive, left uncommitted like the earlier review ZIPs).

## 4. Commands

Run the blocks in order. Each block runs in a subshell and stops at the first failure without closing your terminal.

### 4.1 Payment Portal — product commit, then records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r05/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "93add6f32be53da34ac6fb6fff7fa85076f97a1c"
git diff --cached --quiet                       # nothing staged yet
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/portal-product-add.txt"
python3 "$C/verify_commit.py" portal product staged
git commit -m "fix: APBM007A F-Q4-003 provisioning concurrency, F-Q4-002 stale checkout, F-Q4-004 single access email" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal product committed
git add --pathspec-from-file="$C/portal-records-add.txt"
python3 "$C/verify_commit.py" portal records staged
git commit -m "docs: record APBM007A r05 portal operations" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal records committed
git log --oneline -3
git status --porcelain | wc -l                  # expect 0
)
```

### 4.2 OwedBook — records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r05/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "0249109f9b688e89c6a3c2bc64ab87167e89d9c9"
git diff --cached --quiet                       # nothing staged yet (QA's files stay unstaged)
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/owedbook-records-add.txt"
git add -- "$C"
python3 "$C/verify_commit.py" owedbook records staged
git commit -m "docs: record APBM007A r05 F-Q4-003, F-Q4-002 and F-Q4-004 repair evidence" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" owedbook records committed
git log --oneline -2
git status --porcelain --untracked-files=all | wc -l   # expect 6615: QA's 6,613 paths plus the r05 review ZIP and receipt
)
```

## 5. After the commits

1. Both checkouts stay on `qa/apbm-007a`; there is nothing to switch or fast-forward. Engineering releases both checkouts to QA once the verifier reports OK for all three commits. Then rebuild and restart the portal on the repaired candidate (its runtime must serve the new product commit) before Friday binds the pair.
2. Send the three commit IDs for the state record. No commit ID is invented here.
3. New candidate pair for Friday to bind:
   - Payment Portal: the r05 records commit, with product at the r05 product commit.
   - OwedBook: the r05 records commit.

   OwedBook product code is unchanged since `dcc7b47`, and its records advance from `0249109`.
4. Retest impact: `EVIDENCE/E2/r05/REPAIR_F-Q4-003_F-Q4-002_F-Q4-004.md` §10. DEV operation 25acbfb9 is recovered by QA only, after the rebuild (§6 of that record).
