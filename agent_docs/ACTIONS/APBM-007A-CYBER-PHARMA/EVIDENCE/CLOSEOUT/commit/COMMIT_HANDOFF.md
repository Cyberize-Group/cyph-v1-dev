# APBM-007A closeout — Git handoff for Tony

Prepared 16 November 2026 by the engineering seat. Nothing has been staged, committed, fetched, merged or pushed by Engineering. `COMMIT_MANIFEST.json` SHA-256 `8f456523392fc0eaf07cec9cc3a4532509781785d4c1869d2e5cd2d5c5fedc4e`; the verifier prints it on every run.

**Status: closeout prepared; Director merge/push pending.** 007A becomes CLOSED once both repositories pass `pushed`.

## 1. Starting identities (inspected read-only)

| Repository | Branch | HEAD (expected base) | Local `main` = last-fetched `origin/main` | Remote |
|---|---|---|---|---|
| Payment Portal | `qa/apbm-007a` | `1a3913262ed0f8e8303823d92d2551fd9cc725b3` | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` | `ahmedmusawir/cyph-payment-portal-dev-v1` |
| OwedBook | `qa/apbm-007a` | `af1b4af04592f04689de2e4de59f28db65437f8b` | `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` | `Cyberize-Group/cyph-v1-dev` |

- Both trees were clean, with nothing staged.
- The r06 and Q5 commits are already in place and must not be repeated:
  - Portal: `516b49f`, `1a39132`.
  - OwedBook: `c554c2d`, `c59ead5`, `af1b4af`.
- In both repositories, `main` is an ancestor of `qa/apbm-007a`, so the merge cannot conflict while that still holds after the fetch. The guards stop if it doesn't.

## 2. Outstanding closeout paths (the only ones)

### Payment Portal (5 paths, `portal-closeout-add.txt`)

| # | Change | Path | git blob |
|---|---|---|---|
| 1 | M | `RECOVERY.md` | `bd6af08ff789423c4d5a440e3e9cb391834361b4` |
| 2 | M | `agent_docs/SESSIONS/session_2026-11-16.md` | `d2364de714ef2d31436a0b3c2b69b17288ac2b8d` |
| 3 | M | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA_POINTER.md` | `2abaad169cc7461ee5b640629bcd95b3823e89bf` |
| 4 | M | `CHANGELOG.md` | `3b0287e3981882db44336f9d137b7887466c37be` |
| – | A | `agent_docs/RESPONSES/response_2026-11-16_155500_apbm007a-closeout.md` | self-described (name checked only) |

### OwedBook (13 paths, `owedbook-closeout-add.txt`)

| # | Change | Path | git blob |
|---|---|---|---|
| 1 | M | `CHANGELOG.md` | `e36523a3980c4a14b7f267bc3720f9529c52e1b3` |
| 2 | A | `…/CLOSEOUT_REPORT.md` | `51c88ff3bd5aba8a8775d64a7cca67226cb38cb4` |
| 3 | M | `…/APBM_STATE.md` | `580ebbaf235d08c7caba2be3a64b390cc4e60660` |
| 4 | M | `…/APBM_JOURNAL.md` | `e353bdd2646a05d56103ab885b9e474a1f5d9130` |
| 5 | M | `…/CARRY_FORWARD_007B.md` | `a54d8348320b7b86df71ada0a9a3d99bee471930` |
| 6 | M | `…/README.md` | `ddc02961dfdef9e575ed8194f7467d02fc86b166` |
| 7 | M | `…/REVIEW_START_HERE.md` | `c6185d3ae298d27a9d111ff3acfc143c5434207f` |
| – | A | `…/EVIDENCE/CLOSEOUT/commit/COMMIT_MANIFEST.json` | self-described (name checked only) |
| – | A | `…/EVIDENCE/CLOSEOUT/commit/COMMIT_HANDOFF.md` | self-described (name checked only) |
| – | A | `…/EVIDENCE/CLOSEOUT/commit/REHEARSAL.md` | self-described (name checked only) |
| – | A | `…/EVIDENCE/CLOSEOUT/commit/verify_closeout.py` | self-described (name checked only) |
| – | A | `…/EVIDENCE/CLOSEOUT/commit/owedbook-closeout-add.txt` | self-described (name checked only) |
| – | A | `…/EVIDENCE/CLOSEOUT/commit/portal-closeout-add.txt` | self-described (name checked only) |

**How the commands are controlled:**
- Every path is literal, so there is no blanket `git add`.
- `verify_closeout.py` checks four things:
  - the staged and committed sets against the manifest (path, change kind, git blob);
  - that the certified commits are ancestors;
  - that the merge has two parents, with the closeout commit as its second;
  - that the merged tree is byte-identical to the QA head tree, so no certified or accepted byte changes in integration.
- Self-described files, such as this commit folder and the portal response record, are checked by name only.
- Do not edit a listed file before committing.

**Never committed:**
- `.env*` files;
- private backups and the QA archive `/home/moose/APBM007A_QA_ARCHIVE/`, including the restricted E2_ENGINEERING r01/r02 ZIPs and the quarantined helper;
- the Downloads copies;
- the work lane `ARCHIVE/APBM007A_E2_WORK/`.

## 3. Commands

**Order:**
1. Run the three Portal blocks, P-1 to P-3.
2. Then run the three OwedBook blocks, O-1 to O-3.

The Portal blocks use the verifier from the OwedBook checkout, which must still be on `qa/apbm-007a` while they run.

**Each block** runs in a subshell and stops at the first failure without closing your terminal. If any block prints `STOP` or `VERIFY FAIL`, stop and send the output. Don't resolve it as administrative cleanup.

**Before you start:**
- `git switch main` briefly checks out the old `main` files; the merge then restores exactly the QA head tree. It does not touch untracked or ignored files (`.env*`, `.next`, `node_modules`).
- No path tracked only on `main` exists in either working tree, so the switch cannot collide.
- The apps on 3000/3001 run built output. If you'd rather not have their source change under them for a moment, stop them first. Engineering does not touch them.

### 3.1 Payment Portal

#### P-1 — closeout records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "1a3913262ed0f8e8303823d92d2551fd9cc725b3"
git diff --cached --quiet                                   # nothing staged yet
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/portal-closeout-add.txt"
python3 "$C/verify_closeout.py" portal staged
git commit -m "docs: record APBM007A closeout (Director merge pending)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_closeout.py" portal committed
)
```

#### P-2 — refresh, ancestry guards, fast-forward `main`, `--no-ff` merge (local only)

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
python3 "$C/verify_closeout.py" portal committed      # clean tree, exact closeout commit
test "$(git rev-parse main)" = "c89572a45210e7d6f098c2878cfabe9a1c5326f1" || { echo "STOP: local main moved since inspection"; exit 1; }
git fetch origin                                            # refresh only; changes no branch
git merge-base --is-ancestor main origin/main || { echo "STOP: local main is not contained in origin/main"; exit 1; }
git merge-base --is-ancestor origin/main qa/apbm-007a || { echo "STOP: origin/main diverged from the QA line; do not resolve as cleanup; send this output"; exit 1; }
git switch main
git merge --ff-only origin/main
git merge --no-ff qa/apbm-007a -m "APBM-007A: Payment Portal subscription checkout and billing, Gate Q closeout and Director-accepted sign-in repair" -m "Gate Q PASS WITH KNOWN RISK (QA Lead) on 54a56b55ea7c72783d17d06ff45cd27b5426803f (product 6ed09ffc05685a163833cb68fcae4383c67ae349). U-3 sign-in show/hide Director-accepted, not QA-certified. No deployment." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_closeout.py" portal merged         # two parents, tree equals the QA head tree
git log --oneline --graph -4
)
```

#### P-3 — normal push and final verification

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
C=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit
test "$(git branch --show-current)" = "main"
python3 "$C/verify_closeout.py" portal merged
git push origin main                                        # normal push: no force, no bypass
git fetch origin
python3 "$C/verify_closeout.py" portal pushed         # prints the full SHAs for the receipt
git status --short --branch
)
```

### 3.2 OwedBook

#### O-1 — closeout records commit

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
test "$(git rev-parse HEAD)" = "af1b4af04592f04689de2e4de59f28db65437f8b"
git diff --cached --quiet                                   # nothing staged yet
export GIT_LITERAL_PATHSPECS=1
git add --pathspec-from-file="$C/owedbook-closeout-add.txt"
python3 "$C/verify_closeout.py" owedbook staged
git commit -m "docs: record APBM007A closeout (Director merge pending)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_closeout.py" owedbook committed
)
```

#### O-2 — refresh, ancestry guards, fast-forward `main`, `--no-ff` merge (local only)

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit
test "$(git branch --show-current)" = "qa/apbm-007a"
python3 "$C/verify_closeout.py" owedbook committed      # clean tree, exact closeout commit
test "$(git rev-parse main)" = "bc4e4336f80d2e8cdbb628d4de29d08f8fc95694" || { echo "STOP: local main moved since inspection"; exit 1; }
git fetch origin                                            # refresh only; changes no branch
git merge-base --is-ancestor main origin/main || { echo "STOP: local main is not contained in origin/main"; exit 1; }
git merge-base --is-ancestor origin/main qa/apbm-007a || { echo "STOP: origin/main diverged from the QA line; do not resolve as cleanup; send this output"; exit 1; }
git switch main
git merge --ff-only origin/main
git merge --no-ff qa/apbm-007a -m "APBM-007A: OwedBook subscription access, billing and authentication, Gate Q closeout and Director-accepted UI repair" -m "Gate Q PASS WITH KNOWN RISK (QA Lead) on c976968b20ee724f7390d5e0e008215f50ab6f25. U-1/U-2/U-3 Director-accepted, not QA-certified. Q5 QA cleanup recorded. No deployment." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$C/verify_closeout.py" owedbook merged         # two parents, tree equals the QA head tree
git log --oneline --graph -4
)
```

#### O-3 — normal push and final verification

```bash
( set -e
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
C=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit
test "$(git branch --show-current)" = "main"
python3 "$C/verify_closeout.py" owedbook merged
git push origin main                                        # normal push: no force, no bypass
git fetch origin
python3 "$C/verify_closeout.py" owedbook pushed         # prints the full SHAs for the receipt
git status --short --branch
)
```

In O-2 the commit folder disappears with `git switch main` and returns with the merge. The verifier is only called after the merge.

## 4. If the push is rejected (protected `main`)

`main` protection could not be read from here; OwedBook's previous module (APBM-003) reached `main` through PR #9.

If P-3 or O-3 is rejected:
1. **Do not** force-push, use `--admin` or bypass protection. Nothing remote has changed, and the merge exists only locally.
2. **PR route (your choice):**
   1. Push the QA branch: `git push origin qa/apbm-007a`.
   2. Open a PR from `qa/apbm-007a` into `main` and merge it with **"Create a merge commit"**. Squash or rebase would break the second-parent check.
   3. Run `git fetch origin && git switch qa/apbm-007a && git branch -f main origin/main`. This drops only the unpushed local merge commit, which the reflog keeps.
   4. Run `python3 "$C/verify_closeout.py" <repo> pushed` and `git status --short --branch`.
   5. Send the PR URL as well.

## 5. What to send back

For each repository:
- the full output of the `pushed` verifier, including the manifest SHA, QA head (closeout commit), main before the merge, merge commit, local main, origin/main, merge tree, and the certified commits contained;
- the `git status --short --branch` line.

Engineering then records the closeout commit and merge SHAs and marks 007A **CLOSED**. Branches and archives stay. No deployment.
