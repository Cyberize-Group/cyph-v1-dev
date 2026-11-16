# APBM-007A r03 commit handoff — Q2 repair F-Q2-001 and F-Q2-002

Prepared by the engineering seat, 16 November 2026. Nothing has been staged or committed. `COMMIT_MANIFEST.json` SHA-256: `a1494098aa4c7f9c34a1d9b3ad79a9673b8e366b8688162c550cd6ed707145ae`.

Commits are made on **`qa/apbm-007a`**, the QA line (QAM_PLAYBOOK §11, RRM_PLAYBOOK §§7 and 9). There is no branch switch before or after.

| Repo | Branch | Reviewed base (expected HEAD) | r03 commits |
|---|---|---|---|
| Payment Portal | `qa/apbm-007a` | `9d938f62bff6172f9332ae6c67775e4b8feea379` | 2: product, then records |
| OwedBook | `qa/apbm-007a` | `37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40` | 1: records only (no product change) |

How the commands are controlled:
- Every path is listed in a literal pathspec file in this folder; there is no blanket `git add`.
- `verify_commit.py` compares the staged set, and then each commit, with the manifest: paths, change kind, git blob id and parent.
- Do not edit any listed file before committing, or its blob will no longer match.

## 1. Payment Portal product (5 paths, `portal-product-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `src/__tests__/apbm007a-server.test.ts` | `2f0d629f13b86cb3c9304d07e5484edca2e9d406` | `dca8e91a6cc8c975…` |
| 2 | M | `src/__tests__/portal-owner.test.tsx` | `4ef2c097c335bc9a2699f44bf6d2e5a2d340662c` | `ff5905011b493236…` |
| 3 | M | `src/components/portal/register/PharmacyStepView.tsx` | `8a5705646d4e7568b5ed95b0ab4567cb093b21e3` | `6a59849d8ecabaf8…` |
| 4 | M | `src/server/billing.ts` | `f135c4d211acb00e3cee817583f2781c766fb15b` | `1e6eae2076daa203…` |
| 5 | A | `src/__tests__/portal-registration-journey.test.tsx` | `eab120eda4970a84dc473d11f7d391a6898d5707` | `ced76353c3f7e572…` |

## 2. Records

### Payment Portal operating records (3 paths, `portal-records-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `RECOVERY.md` | `03d51e960d788201cd1aabd1c2308353235ec57c` | `e3a9239db97e9bc9…` |
| 2 | A | `agent_docs/RESPONSES/response_2026-11-16_101138_q2-repair-handback.md` | `e1a5408b0abfa911268d77f63e1b2c1beaf19097` | `a84151a7788e5bc0…` |
| 3 | A | `agent_docs/SESSIONS/session_2026-11-16.md` | `e741f881dd600afc8a7cf6b72490ae8ea1834b0f` | `2eaf40c0eb2111ef…` |

### OwedBook module records (23 paths, `owedbook-records-add.txt`, plus this `commit/` folder)

Paths are under `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`.

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `AMENDMENT_LEDGER.md` | `8505aaf6d9a67d7ffc1e98f73fd0798edbc6ffc8` | `cb8af7d2e144364d…` |
| 2 | M | `APBM_JOURNAL.md` | `c87e1d7e2ddcdd29ae153bd74fd2c6d80aaf98a7` | `5b54af699fed25c4…` |
| 3 | M | `APBM_RULINGS.md` | `f06ce9792f2647291445b265ab7601329bd8ae79` | `5eab2926a7ab363c…` |
| 4 | M | `APBM_STATE.md` | `f9a8512868de87e354e5415bb405d4eae7a5924b` | `db4a711664895cf7…` |
| 5 | M | `QAM/HANDOFFS/QA_HANDOFF.md` | `0a1202dfed27fd65c8b760b39ce0c0de9d754e25` | `1e2aa303c0ee0c09…` |
| 6 | A | `EVIDENCE/E2/r03/REPAIR_F-Q2.md` | `8bdcce001814804e017a9a47e60501d7c7efb1df` | `0c616be7365a99e5…` |
| 7 | A | `EVIDENCE/E2/r03/browser/1-first-arrival.png` | `9a5a06239cfdc7e411cd793ed06b9ac244140458` | `d68a6ec3252e2e4c…` |
| 8 | A | `EVIDENCE/E2/r03/browser/2-after-refresh.png` | `9a5a06239cfdc7e411cd793ed06b9ac244140458` | `d68a6ec3252e2e4c…` |
| 9 | A | `EVIDENCE/E2/r03/browser/3-after-pharmacy-edit.png` | `b030b28bb8cf10cda4aae30d1436b78d6efb06b0` | `2a0c9c724cbb262d…` |
| 10 | A | `EVIDENCE/E2/r03/browser/4-after-edit-back-return.png` | `b030b28bb8cf10cda4aae30d1436b78d6efb06b0` | `2a0c9c724cbb262d…` |
| 11 | A | `EVIDENCE/E2/r03/browser/walk.json` | `5ea8cb8193e3f6acb45ef5fc90a0dd8ac1feb422` | `015f83a53b0751f3…` |
| 12 | A | `EVIDENCE/E2/r03/build_proof_pp.log` | `ba8e90e847798217674b9f90fc8afba645270a51` | `f70d667f49b749c4…` |
| 13 | A | `EVIDENCE/E2/r03/bundle_scan.json` | `4a4baa03c8136fcf297279b2c2e58a8a047d81e4` | `ddb17d83a16dec1b…` |
| 14 | A | `EVIDENCE/E2/r03/focused_tests.json` | `eb03dfe503f22c285c75cf6a9c2a8ef1fafdbac7` | `d334c0fc54d65cd2…` |
| 15 | A | `EVIDENCE/E2/r03/helpers/bundle-scan.mjs` | `db9f11923e595f507a4d3b3d2d9ec4d98a8a15c1` | `259dddff4cd36c7f…` |
| 16 | A | `EVIDENCE/E2/r03/helpers/walk-registration.mjs` | `dad2b8e65bf756c1af929aa5b6a11d42fa53320d` | `b021430e06880f80…` |
| 17 | A | `EVIDENCE/E2/r03/helpers/with-env.mjs` | `1c4886b1a750e392b981c2f8e15b5c084097c0d6` | `3cdfb582137e4399…` |
| 18 | A | `EVIDENCE/E2/r03/mutation_controls.txt` | `94b8439e539ac08cacf3b34ea69f671c64eeeb31` | `763c18cde75b461f…` |
| 19 | A | `EVIDENCE/E2/r03/product.patch` | `3860552e0f1078402471d51002cef19d3bfc48e9` | `7dd89a125981a8f5…` |
| 20 | A | `EVIDENCE/E2/r03/proof_harness.patch` | `3842c260223428b98f322f1d5cc0a2344f80ddea` | `5fc35f021bf47af3…` |
| 21 | A | `EVIDENCE/E2/r03/proof_server_3101.log` | `4a5b40b0a9adffba300dd80a8748d80120bb3336` | `f7fd6347f610a044…` |
| 22 | A | `EVIDENCE/E2/r03/provenance.json` | `f5b176fe0eddc4d109d127df212af16ec0134c95` | `49a0f636c6e3b2bb…` |
| 23 | A | `EVIDENCE/E2/r03/qa_preservation.json` | `bf93a622efb2f79c0bb3591b71897e3b961621bf` | `98e7ef1b1ae18a10…` |

## 3. Excluded — never staged by these commands

All **5011** uncommitted QA paths in OwedBook (independent QA, Cody) are excluded. Engineering preserved them and did not touch them; their checksums were verified unchanged.
- **180 QA records, reports, evidence, helpers and ZIPs:** listed one by one in `COMMIT_MANIFEST.json` → `excluded_qa.listed_paths`.
- **Regenerable trees:**

| Root (under the module) | Files | Digest of the sorted path list |
|---|---|---|
| `QAM/AUTOMATION/a02/.npm/` | 1701 | `071242d6c3f6f279…` |
| `QAM/AUTOMATION/a02/build-owedbook/` | 1521 | `ff2276eabafe2193…` |
| `QAM/AUTOMATION/a02/build-portal/` | 1609 | `695a2cb39bb4473f…` |

Full per-file checksums are in the private backup, `~/APBM007A_QA_BACKUPS/q2_r03_20261116_100605/SHA256SUMS.before`.

Also never committed:
- both `.env.local` files and the portal's `.env.qa.local`;
- the private inbox and QA cast files;
- the portal's ignored `test-results/`;
- the work lane `ARCHIVE/APBM007A_E2_WORK/r03/`;
- the private QA backup;
- the review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q2_REPAIR_REVIEW_r03.zip` and its receipt (a derived archive, left uncommitted like the earlier review ZIPs).

## 4. Commands

Run the blocks in order. Each block runs in a subshell and stops at the first failure without closing your terminal.

### 4.1 Payment Portal — product commit, then records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r03/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "9d938f62bff6172f9332ae6c67775e4b8feea379"
git diff --cached --quiet                       # nothing staged yet
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/portal-product-add.txt"
python3 "$C/verify_commit.py" portal product staged
git commit -m "fix: APBM007A F-Q2-001 registration review and F-Q2-002 undo cancellation" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal product committed
git add --pathspec-from-file="$C/portal-records-add.txt"
python3 "$C/verify_commit.py" portal records staged
git commit -m "docs: record APBM007A r03 portal operations" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal records committed
git log --oneline -3
git status --porcelain | wc -l                  # expect 0
)
```

### 4.2 OwedBook — records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r03/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40"
git diff --cached --quiet                       # nothing staged yet (QA's files stay unstaged)
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/owedbook-records-add.txt"
git add -- "$C"
python3 "$C/verify_commit.py" owedbook records staged
git commit -m "docs: record APBM007A r03 Q2 repair evidence and erratum E-A1-1" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" owedbook records committed
git log --oneline -2
git status --porcelain --untracked-files=all | wc -l   # expect 5013: QA's 5011 paths plus the r03 review ZIP and receipt
)
```

## 5. After the commits

1. Both checkouts stay on `qa/apbm-007a`; there is nothing to switch or fast-forward. Engineering releases both checkouts to QA once the verifier reports OK for all three commits.
2. Send the three commit IDs for the state record. No commit ID is invented here.
3. New candidate pair for Cody to bind under Friday's authority:
   - Payment Portal: the r03 records commit, with product at the r03 product commit.
   - OwedBook: the r03 records commit.

   OwedBook product code is unchanged since `dcc7b47`, and its records advance from `37f6c0d`.
4. Retest impact: `EVIDENCE/E2/r03/REPAIR_F-Q2.md` §11.
