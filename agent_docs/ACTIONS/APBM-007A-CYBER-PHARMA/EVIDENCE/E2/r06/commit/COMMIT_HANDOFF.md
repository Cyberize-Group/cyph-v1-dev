# APBM-007A r06 commit handoff — final UI repair U-1, U-2, U-3

Prepared by the engineering seat, 16 November 2026. Nothing has been staged or committed. `COMMIT_MANIFEST.json` SHA-256: `36a08842ae07d87bb82bc2337d1857906c0797f84a8a2fd969fcb2aa0a9eee5d`.

Commits are made on **`qa/apbm-007a`**, the QA line (QAM_PLAYBOOK §11, RRM_PLAYBOOK §§7 and 9). There is no branch switch before or after.

| Repo | Branch | Reviewed base (expected HEAD) | r06 commits |
|---|---|---|---|
| Payment Portal | `qa/apbm-007a` | `54a56b55ea7c72783d17d06ff45cd27b5426803f` | 2: product, then records |
| OwedBook | `qa/apbm-007a` | `c976968b20ee724f7390d5e0e008215f50ab6f25` | 2: product, then records |

How the commands are controlled:
- Every path is listed in a literal pathspec file in this folder; there is no blanket `git add`.
- `verify_commit.py` compares the staged set, and then each commit, with the manifest: paths, change kind, git blob id and parent.
- Do not edit any listed file before committing, or its blob will no longer match.

## 1. Product

### Payment Portal product (3 paths, `portal-product-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `src/app/login/LoginPageContent.tsx` | `e94f15defd38f7c9381cdd416c1286c2b8347cde` | `d2b6a7c66a39b90a…` |
| 2 | M | `src/components/portal/FormField.tsx` | `1646a2a1f27f45c33aaa6a1c6ae66615c7a320e0` | `a4e0c7677d984703…` |
| 3 | A | `src/__tests__/password-field.test.tsx` | `d167e5c551364cd469b1fed6f665b635161999bf` | `7a05a570b9197ffc…` |

### OwedBook product (12 paths, `owedbook-product-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `src/__tests__/apbm007a-access.test.tsx` | `227efbbff2abc110dee4bba8ac990e944767c269` | `60a359ea4ec585fb…` |
| 2 | M | `src/__tests__/auth/AuthPage.test.tsx` | `e5cd66aa28a4d524243ff391b6e9bf2b969fa9eb` | `71452e05975c0448…` |
| 3 | M | `src/__tests__/layout/AdminSidebar.test.tsx` | `e77439394479f2753fb5d9653951a8af84ce2a0e` | `3f3608994d03b351…` |
| 4 | M | `src/app/profile/ProfileForm.tsx` | `c68e2afbfb664c7032f9797e887add3fcb31acbd` | `3be42e4855abffa9…` |
| 5 | M | `src/components/admin-portal/BillingRow.tsx` | `33c4cd54f9e611d0f5531a31c29bfc59f6a6b482` | `16d771cf02950947…` |
| 6 | M | `src/components/auth/LoginForm.tsx` | `77371d9a39a49a26b387e3519df6756bd7e0bce1` | `df332bab7b9680a9…` |
| 7 | M | `src/components/layout/AdminSidebar.tsx` | `90651907c86d8950a8f00008830ea185879137ca` | `f32e429a9ded0541…` |
| 8 | M | `src/services/adminDemo.ts` | `0adb7c8763d0ab3f7f9dd04344cfd0c3058ccf62` | `094e848f9cc484ca…` |
| 9 | M | `src/types/adminDemo.ts` | `c47c0e1fa263f979037ae8ed1ccb0d6281760c63` | `089225e2ea0444c8…` |
| 10 | A | `src/__tests__/admin-portal/BillingDetails.test.tsx` | `b9275bfc63050fc7531d163eb415fb7dd496ea17` | `3664846781fd03fc…` |
| 11 | A | `src/__tests__/auth/PasswordToggle.test.tsx` | `5ff3c00bc1a20a1f316805f878263f798cff0112` | `27c372c9860abd1b…` |
| 12 | A | `src/components/ui/password-input.tsx` | `fdc6830bcedc02199b00e178be54d43d682cdb4a` | `624fd3d394316b9c…` |

## 2. Records

### Payment Portal operating records (3 paths, `portal-records-add.txt`)

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `RECOVERY.md` | `49a29fccdd84ae0dfa630eb0f6b84262a5c9473b` | `edb2e07d107bddc5…` |
| 2 | M | `agent_docs/SESSIONS/session_2026-11-16.md` | `dcf38f15d1292a3a6b45b3b88c43428e4bd69652` | `15fe1dd9f17607b6…` |
| 3 | A | `agent_docs/RESPONSES/response_2026-11-16_150628_u123-ui-repair-handback.md` | `716a633f530644f1084fd86e1961fbca26a89a7b` | `f95ead4e02200031…` |

### OwedBook module records (58 paths, `owedbook-records-add.txt`, plus this `commit/` folder)

Paths are under `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`.

| # | Change | Path | git blob | SHA-256 |
|---|---|---|---|---|
| 1 | M | `APBM_JOURNAL.md` | `c347ea59b948a87790011caede6900ce8e83a20c` | `2e5090f65481b93b…` |
| 2 | M | `APBM_RULINGS.md` | `a2ac2be837e1ed049566142584a7aca06a1093c4` | `7d7cc55b36013bfa…` |
| 3 | M | `APBM_STATE.md` | `ed2114c9c1f16d5c3679bf57b473e08365fc2906` | `1f71ce4a2aba2152…` |
| 4 | M | `CARRY_FORWARD_007B.md` | `c4e15f805f99efd619f0a20bb40b031ff1df5c55` | `703b1c5059ff768e…` |
| 5 | M | `QAM/HANDOFFS/QA_HANDOFF.md` | `9fb72d0669d1dd278e26182b587c478c91369813` | `0b16b702e6a36339…` |
| 6 | M | `STAGING_RELEASE.md` | `3bcc293b9ecec08a5e8902d8fee0edda8b81816d` | `fff30f4be08b58ec…` |
| 7 | A | `EVIDENCE/E2/r06/REPAIR_U-1_U-2_U-3.md` | `6b64f318c249c3a9c279358dc0d7f41d2520e0c8` | `6e414c228934692c…` |
| 8 | A | `EVIDENCE/E2/r06/browser/fixture_requests_summary.json` | `b958f9a5075ae9a3487702e39fdcc8bb3a79fe54` | `3209dec7e5db29c9…` |
| 9 | A | `EVIDENCE/E2/r06/browser/preserved-attempts/walk_attempt1_instrument_fault.json` | `07fb6bd4e417f40dc92478b71885ae1a34f165df` | `dfaf8471b25ddcb3…` |
| 10 | A | `EVIDENCE/E2/r06/browser/preserved-attempts/walk_attempt2_instrument_fault.json` | `f0e95ca01b82e309c6848c489304845706409d48` | `e65b147370b3c192…` |
| 11 | A | `EVIDENCE/E2/r06/browser/preserved-attempts/walk_attempt3_caret_defect_found.json` | `8a9aeef03b4060055b02c5cfd71fcbd2424788d8` | `aeefc7e2332d79bb…` |
| 12 | A | `EVIDENCE/E2/r06/browser/preserved-attempts/walk_attempt4_first_caret_fix_insufficient.json` | `a55441fcb66131364cced2ef539049c86ebc823e` | `4cece1a517446aab…` |
| 13 | A | `EVIDENCE/E2/r06/browser/preserved-attempts/walk_attempt5_passed_before_race_fix.json` | `769756b80c4f0e5f4b1b36b74906e058b4df7590` | `4a21d6dd7bb4fa70…` |
| 14 | A | `EVIDENCE/E2/r06/browser/u1-dark-1440-audit.png` | `f83ef81c4bfcf102e6baff1b576892e0a944b976` | `1e4962606e3c9be4…` |
| 15 | A | `EVIDENCE/E2/r06/browser/u1-dark-1440-hover-billing.png` | `a3e9fca676e6fc2f2610cf67f749db36ac33f4ee` | `2c31ba727f3bd9da…` |
| 16 | A | `EVIDENCE/E2/r06/browser/u1-dark-1440-keyboard-focus.png` | `f2095cfaf982fbe3d4049965739102113568fd77` | `14825df8f62ccd5f…` |
| 17 | A | `EVIDENCE/E2/r06/browser/u1-dark-375-audit.png` | `4f3deb333a84bbfaa4eef8819481802dcf25d9ec` | `500708ead5ab9008…` |
| 18 | A | `EVIDENCE/E2/r06/browser/u1-light-1440-audit.png` | `2f8f63acd2d52cbe2b70b49e6517143730d8f354` | `adee557dc7370c26…` |
| 19 | A | `EVIDENCE/E2/r06/browser/u1-light-1440-hover-billing.png` | `7015dc11d2ad2b8f6689e4216e3601b3ed181fad` | `703f5185d5f146fd…` |
| 20 | A | `EVIDENCE/E2/r06/browser/u1-light-1440-keyboard-focus.png` | `b6d7f7547453606199894088777a1af05259e42f` | `772f97b66aa404e7…` |
| 21 | A | `EVIDENCE/E2/r06/browser/u1-light-375-audit.png` | `41fe6c781b0d2407c5250a46da6d2f584fead67a` | `848644c15102e976…` |
| 22 | A | `EVIDENCE/E2/r06/browser/u2-dark-1440-billing-paid.png` | `53ac700d679b4d6334be5ba83611592a5d53ccde` | `82474a21cc79141d…` |
| 23 | A | `EVIDENCE/E2/r06/browser/u2-dark-375-billing-paid.png` | `e924d80573c21b7636bd7af062e40761b3fc9c80` | `a9ed429c753599d8…` |
| 24 | A | `EVIDENCE/E2/r06/browser/u2-light-1440-billing-paid.png` | `5e9cf4fea4ffd6eed44c64192b5bb640ff26899f` | `831700d020d87fc5…` |
| 25 | A | `EVIDENCE/E2/r06/browser/u2-light-375-billing-paid.png` | `0ae3c9729af0290daca7e07c66bf2cd5d777ce02` | `7acb68a9a9219489…` |
| 26 | A | `EVIDENCE/E2/r06/browser/u2-nonowner.png` | `b799eb88af21d42e98167486295a3be0cbddb46d` | `4b153d4ad4ad8640…` |
| 27 | A | `EVIDENCE/E2/r06/browser/u2-synthetic.png` | `b09fb41a1f3b7de7c33e895cb60c81390e3443ab` | `abb572dbbaaa7348…` |
| 28 | A | `EVIDENCE/E2/r06/browser/u3-OwedBook profile new password-keyboard.png` | `e3bdc5fa26504384cb12429d3f982165ec74526e` | `253305206876db43…` |
| 29 | A | `EVIDENCE/E2/r06/browser/u3-OwedBook profile new password-shown.png` | `b933f9ebbac82debf26578f50a4ecc17bcd465da` | `a38134b470c2bed7…` |
| 30 | A | `EVIDENCE/E2/r06/browser/u3-OwedBook sign-in dark-375-keyboard.png` | `ef9571332710a2c151f8f23c277c2f56edb28b10` | `49124de3b69f110d…` |
| 31 | A | `EVIDENCE/E2/r06/browser/u3-OwedBook sign-in dark-375-shown.png` | `c1bfa5c32a157df758660358b381d9e8f7ef9968` | `72c1a0edc001d1ac…` |
| 32 | A | `EVIDENCE/E2/r06/browser/u3-OwedBook sign-in light-1440-keyboard.png` | `aa9f67759e710ff9fa606028fdf1ed214ee3ff06` | `db5eb2015715da15…` |
| 33 | A | `EVIDENCE/E2/r06/browser/u3-OwedBook sign-in light-1440-shown.png` | `ba28f31da4ac81cd029ade9b561e85549d8d577b` | `7e0e0728fa9bcca7…` |
| 34 | A | `EVIDENCE/E2/r06/browser/u3-Portal sign-in dark-375-keyboard.png` | `16e9829455f756d6a64376cac323ece7fba5a352` | `7e3829832e7430c1…` |
| 35 | A | `EVIDENCE/E2/r06/browser/u3-Portal sign-in dark-375-shown.png` | `eb94e7d0889855716c5b4e7e29b0b01afecb77a9` | `6757e6da804ef72e…` |
| 36 | A | `EVIDENCE/E2/r06/browser/u3-Portal sign-in light-1440-keyboard.png` | `8316aa2c49b08896a9f7533975b33a00f204445f` | `ac641678ac3c2e28…` |
| 37 | A | `EVIDENCE/E2/r06/browser/u3-Portal sign-in light-1440-shown.png` | `ba3909f5d403009c5d3bb945b0dee179e46c7284` | `450b2299184e7992…` |
| 38 | A | `EVIDENCE/E2/r06/browser/walk.json` | `bf62939b5ad8d58ff4fe5e57dc376b6a3b188623` | `1a8a7d2f8b2cf842…` |
| 39 | A | `EVIDENCE/E2/r06/build_ob.log` | `24bc5a3a144adecc2de496547ff4ab0bd34e576c` | `6161642cd069e10a…` |
| 40 | A | `EVIDENCE/E2/r06/build_pp.log` | `5e2c1b52ba285ff91f1d7904ef8b46fd73523ae5` | `5ebf53dd87bbfeb5…` |
| 41 | A | `EVIDENCE/E2/r06/build_proof_ob.log` | `35dcb169e3840e9565813962d16ba370667426c5` | `1de947d4cdcba401…` |
| 42 | A | `EVIDENCE/E2/r06/build_proof_pp.log` | `c7773ca5fe6cbc0f7438a5cd52f50d230d254302` | `5b09b556b8646341…` |
| 43 | A | `EVIDENCE/E2/r06/bundle_scan_ob.txt` | `abd9093e5c240bd7f35caebc093a3c6f35092d0b` | `c3e30f29447ab128…` |
| 44 | A | `EVIDENCE/E2/r06/bundle_scan_pp.txt` | `427e8681129d07aa7f85ee4d828bc17ce69007a9` | `9656d53fdc50d761…` |
| 45 | A | `EVIDENCE/E2/r06/helpers/supabase-fixture.mjs` | `9501e100e821cc7420f79f29ddc543922dcea697` | `d1244f2a9f64dfe8…` |
| 46 | A | `EVIDENCE/E2/r06/helpers/walk-u123.mjs` | `8af821569ccbb48dcae4286d517db7f40e24246e` | `44b9ac981f180d43…` |
| 47 | A | `EVIDENCE/E2/r06/product_ob.patch` | `626d23fe4d432f96938e7e3b3de34cbce2f4215a` | `8057d071ab1042e7…` |
| 48 | A | `EVIDENCE/E2/r06/product_pp.patch` | `823ffab93b57033508e8c1cf603a62303f175e96` | `e20963c3ad028d97…` |
| 49 | A | `EVIDENCE/E2/r06/proof_harness_ob.patch` | `c98fd76e6cb63a1f2e0043c15a54f407d9a5f03b` | `98faec42718cb19c…` |
| 50 | A | `EVIDENCE/E2/r06/proof_harness_pp.patch` | `383b02c9ff781e911e627931375faf7d522e4ba7` | `7f704db0512844ca…` |
| 51 | A | `EVIDENCE/E2/r06/provenance.json` | `e87688150b5db053b191053607eeb0015b1b1029` | `3307dad30a7ff75c…` |
| 52 | A | `EVIDENCE/E2/r06/qa_preservation.json` | `c7729193beb9819aefcfae49bbbbc5ae7cdab5be` | `b40f0dbfae9d8101…` |
| 53 | A | `EVIDENCE/E2/r06/tests/ob_candidate_control.json` | `fc231968430217157f0e41a53e50849bba59798e` | `79ccb209c5f633ff…` |
| 54 | A | `EVIDENCE/E2/r06/tests/ob_checkout_full.json` | `e72d36c9da9f485e93f7d7e9fa89e258e730e4bc` | `d6f20dd90b8f565c…` |
| 55 | A | `EVIDENCE/E2/r06/tests/ob_focused.json` | `aed2590d300840cf346188849c57eb65dc4b1207` | `9e074451ecf31f6a…` |
| 56 | A | `EVIDENCE/E2/r06/tests/pp_candidate_control.json` | `95faa82b851e9100979aaa380c132ffa31b939eb` | `1b47da94893599eb…` |
| 57 | A | `EVIDENCE/E2/r06/tests/pp_checkout_full.json` | `125877f9f6123d12fa84779409e40e43cbb58a80` | `6b1c0ae9022e8089…` |
| 58 | A | `EVIDENCE/E2/r06/tests/pp_focused.json` | `37c269158e64eccc1cef0765ec1a1d06a60e4bfb` | `eb461cc35fec8c24…` |

## 3. Excluded — never staged by these commands

All **9,805** uncommitted QA paths in OwedBook (independent QA, Cody) are excluded. Engineering preserved them and did not touch them; their checksums were verified unchanged.
- Every one of them is listed in `COMMIT_MANIFEST.json` → `excluded_qa.listed_paths`.
- Full per-file checksums are in the private backup, `~/APBM007A_QA_BACKUPS/u123_r06_20261116_150305/SHA256SUMS.before`.

Also never committed:
- both `.env.local` files and the portal's `.env.qa.local`;
- the private inbox and QA cast files;
- the portal's ignored `test-results/`;
- the work lane `ARCHIVE/APBM007A_E2_WORK/r06/` (disposable, build, proof and control copies, the fixture and helpers);
- the private QA backup;
- the review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_UI_REPAIR_REVIEW_r06.zip` and its receipt (a derived archive, left uncommitted like the earlier review ZIPs).

## 4. Commands

Run the blocks in order. Each block runs in a subshell and stops at the first failure without closing your terminal.

### 4.1 Payment Portal — product commit, then records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r06/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "54a56b55ea7c72783d17d06ff45cd27b5426803f"
git diff --cached --quiet                       # nothing staged yet
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/portal-product-add.txt"
python3 "$C/verify_commit.py" portal product staged
git commit -m "fix: APBM007A U-3 password show/hide on the portal sign-in" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal product committed
git add --pathspec-from-file="$C/portal-records-add.txt"
python3 "$C/verify_commit.py" portal records staged
git commit -m "docs: record APBM007A r06 portal operations" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" portal records committed
git log --oneline -3
git status --porcelain | wc -l                  # expect 0
)
```

### 4.2 OwedBook — product commit, then records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r06/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "c976968b20ee724f7390d5e0e008215f50ab6f25"
git diff --cached --quiet                       # nothing staged yet (QA's files stay unstaged)
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/owedbook-product-add.txt"
python3 "$C/verify_commit.py" owedbook product staged
git commit -m "fix: APBM007A U-1 route-driven admin navigation, U-2 billing details, U-3 password show/hide" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" owedbook product committed
git add --pathspec-from-file="$C/owedbook-records-add.txt"
git add -- "$C"
python3 "$C/verify_commit.py" owedbook records staged
git commit -m "docs: record APBM007A r06 UI repair evidence and Director rulings" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_commit.py" owedbook records committed
git log --oneline -3
git status --porcelain --untracked-files=all | wc -l   # expect 9807: QA's 9,805 paths plus the r06 review ZIP and receipt
)
```

## 5. After the commits

1. Both checkouts stay on `qa/apbm-007a`; there is nothing to switch or fast-forward. Engineering releases both checkouts to QA once the verifier reports OK for all four commits.
2. Rebuild and restart **both** apps on the repaired pair before Friday binds it.
3. Send the four commit IDs for the state record. No commit ID is invented here.
4. New candidate pair for Friday to bind:
   - Payment Portal: the r06 records commit, with product at the r06 product commit.
   - OwedBook: the r06 records commit, with product at the r06 product commit.
5. Retest impact: `EVIDENCE/E2/r06/REPAIR_U-1_U-2_U-3.md` §10.
