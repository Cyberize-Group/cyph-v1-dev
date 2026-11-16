# APBM-007A r04 commit handoff — Q4 repair F-Q4-001 (AC-011)

Prepared by the engineering seat, 16 November 2026. Nothing has been staged or committed. `COMMIT_MANIFEST.json` SHA-256: `0d3daa83ca17013dcfb3cb8032a8fe978046b9cd273a14b1a9bab5793221ee8c`.

Commits are made on **`qa/apbm-007a`**, the QA line (QAM_PLAYBOOK §11, RRM_PLAYBOOK §§7 and 9). There is no branch switch before or after.

| Repo | Branch | Reviewed base (expected HEAD) | r04 commits |
|---|---|---|---|
| Payment Portal | `qa/apbm-007a` | `357c274284f48ed5ad3bf8407ca0a14d0d9b99e8` | 2: product, then records |
| OwedBook | `qa/apbm-007a` | `f637ba4086c1e906e008b8892c880ec6489bba9a` | 1: records only (no product change) |

How the commands are controlled:
- Every path is listed in a literal pathspec file in this folder; there is no blanket `git add`.
- `verify_commit.py` compares the staged set, and then each commit, with the manifest: paths, change kind, git blob id and parent.
- Do not edit any listed file before committing, or its blob will no longer match.

## 1. Payment Portal product (2 paths, `portal-product-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `src/server/checkout.ts` | `dd1b5b4202b7ece589fe3a0cd464ef4d29f54f8f` | `f079df8d289dd24f…` |
| 2 | A | `src/__tests__/apbm007a-checkout-recovery.test.ts` | `90b5f886fc639a670a3c0200bbee8910d71d4143` | `f49b10352570978a…` |

## 2. Records

### Payment Portal operating records (3 paths, `portal-records-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `RECOVERY.md` | `f18e0b1775b9cc3f017ff75be2bdee33ca5b5fe2` | `f3496f9532f42adc…` |
| 2 | M | `agent_docs/SESSIONS/session_2026-11-16.md` | `24b3e080b63334a3e3c8f370057c17ab646c5fc2` | `031625797d08bd8d…` |
| 3 | A | `agent_docs/RESPONSES/response_2026-11-16_115000_f-q4-001-repair-handback.md` | `d885187a6e69f166534989823dedb6adec456c2f` | `47925c3721222c02…` |

### OwedBook module records (16 paths, `owedbook-records-add.txt`, plus this `commit/` folder)

Paths are under `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`.

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `APBM_JOURNAL.md` | `fce910c8c9dd7d6e8167ca21b51eacf7d7623150` | `1e82ea0c5d7461a6…` |
| 2 | M | `APBM_STATE.md` | `6512e280a69a48465fea368cfc0dbf03dc7ef241` | `2e9c2a9b42330231…` |
| 3 | M | `QAM/HANDOFFS/QA_HANDOFF.md` | `9aaeaf625c6960ed23b640240d127e07b72bb107` | `7604f601a26ec398…` |
| 4 | A | `EVIDENCE/E2/r04/REPAIR_F-Q4-001.md` | `e88627790a067ac91e283a83c08784f4e0b5ce13` | `d2d394fa352574f7…` |
| 5 | A | `EVIDENCE/E2/r04/build_pp.log` | `655cf614a251c60e774e72dfd75876d853f8e38a` | `5e1b11a551356a97…` |
| 6 | A | `EVIDENCE/E2/r04/bundle_scan.txt` | `59cffd52f92a4aaa00b8766ae70cd06fb412b5ff` | `2b78ac57e288ef5f…` |
| 7 | A | `EVIDENCE/E2/r04/candidate_control_tests.json` | `5fa9dfacea6badb26f40cb650012d34f8abde316` | `16568d9e8408c456…` |
| 8 | A | `EVIDENCE/E2/r04/focused_tests.json` | `e3ea4d1b4befa3f9116bae6990715438218522e5` | `0910d10ca6348a62…` |
| 9 | A | `EVIDENCE/E2/r04/helpers/scratch-checkout-candidate-control.cjs` | `ec3da7167c341078d222f303dccbfc94b068191b` | `fb558d0d4ea5f81c…` |
| 10 | A | `EVIDENCE/E2/r04/helpers/scratch-checkout-recovery.cjs` | `f7437311b938650bca9314d40404903000cada7d` | `1f5f37ce85e01a5a…` |
| 11 | A | `EVIDENCE/E2/r04/mutation_controls.txt` | `f83459480e3533bb38bd1c573765629da563cdae` | `865360faef3991f5…` |
| 12 | A | `EVIDENCE/E2/r04/product.patch` | `7b14d37336691e4363f5cf50e41946f79b902085` | `ea8c60acc9eded4a…` |
| 13 | A | `EVIDENCE/E2/r04/provenance.json` | `5e5f039769d4768d37ae8a6ff979b7671a93dd74` | `6ea120dda7b0d10c…` |
| 14 | A | `EVIDENCE/E2/r04/qa_preservation.json` | `581ece9576f7d82bd15a7cde66c3649e3b38a1ec` | `f5f6c983fb119b2b…` |
| 15 | A | `EVIDENCE/E2/r04/scratch_checkout_candidate_control.json` | `541394c3103ad2758e7d434908f134a5c5c57875` | `df1ef6264c5b7913…` |
| 16 | A | `EVIDENCE/E2/r04/scratch_checkout_recovery.json` | `429b87098eb231d24bb9c205945d20a3fd3ecc84` | `27ca229231e44a58…` |

## 3. Excluded — never staged by these commands

All **3,422** uncommitted QA paths in OwedBook (independent QA, Cody) are excluded. Engineering preserved them and did not touch them; their checksums were verified unchanged.
- Every one of the 3,422 paths (QA records, reports, evidence, helpers, automation and ZIPs) is listed in `COMMIT_MANIFEST.json` → `excluded_qa.listed_paths`. There are no regenerable trees at this inventory; QA's earlier build mirrors are gone.

Full per-file checksums are in the private backup, `~/APBM007A_QA_BACKUPS/q4_r04_20261116_114741/SHA256SUMS.before`.

Also never committed:
- both `.env.local` files and the portal's `.env.qa.local`;
- the private inbox and QA cast files;
- the portal's ignored `test-results/`;
- the work lane `ARCHIVE/APBM007A_E2_WORK/r04/`;
- the private QA backup;
- the review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REPAIR_REVIEW_r04.zip` and its receipt (a derived archive, left uncommitted like the earlier review ZIPs).

## 4. Commands

Run the blocks in order. Each block runs in a subshell and stops at the first failure without closing your terminal.

### 4.1 Payment Portal — product commit, then records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r04/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "357c274284f48ed5ad3bf8407ca0a14d0d9b99e8"
git diff --cached --quiet                       # nothing staged yet
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/portal-product-add.txt"
python3 "$C/verify_commit.py" portal product staged
git commit -m "fix: APBM007A F-Q4-001 resume checkout after a lost provider answer" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal product committed
git add --pathspec-from-file="$C/portal-records-add.txt"
python3 "$C/verify_commit.py" portal records staged
git commit -m "docs: record APBM007A r04 portal operations" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal records committed
git log --oneline -3
git status --porcelain | wc -l                  # expect 0
)
```

### 4.2 OwedBook — records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r04/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "f637ba4086c1e906e008b8892c880ec6489bba9a"
git diff --cached --quiet                       # nothing staged yet (QA's files stay unstaged)
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/owedbook-records-add.txt"
git add -- "$C"
python3 "$C/verify_commit.py" owedbook records staged
git commit -m "docs: record APBM007A r04 F-Q4-001 repair evidence" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" owedbook records committed
git log --oneline -2
git status --porcelain --untracked-files=all | wc -l   # expect 3424: QA's 3,422 paths plus the r04 review ZIP and receipt
)
```

## 5. After the commits

1. Both checkouts stay on `qa/apbm-007a`; there is nothing to switch or fast-forward. Engineering releases both checkouts to QA once the verifier reports OK for all three commits. Then rebuild and restart the portal on the repaired candidate (its runtime must serve the new product commit) before Friday binds the pair.
2. Send the three commit IDs for the state record. No commit ID is invented here.
3. New candidate pair for Friday to bind:
   - Payment Portal: the r04 records commit, with product at the r04 product commit.
   - OwedBook: the r04 records commit.

   OwedBook product code is unchanged since `dcc7b47`, and its records advance from `f637ba4`.
4. Retest impact: `EVIDENCE/E2/r04/REPAIR_F-Q4-001.md` §8.
