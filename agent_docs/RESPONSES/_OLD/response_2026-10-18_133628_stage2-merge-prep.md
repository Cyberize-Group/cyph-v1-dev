✅ STAGE 2 PREPARATION COMPLETE (merge and Q5 remain with Tony)

# PR #3 Stage 2: JARVIS recorded, records inspected, blockers, merge commands

## 0. Genuine blocker first

**`main` is protected by the active ruleset "PROTECT MAIN": one approving review is required, review threads must be resolved, and only the merge-commit method is allowed.** PR #3's `reviewDecision` is `REVIEW_REQUIRED` with zero reviews. The author (`ahmedmusawir`) cannot approve their own PR, so leaving Draft does **not** clear it. There are no required status checks and no workflows, so nothing else blocks.
Two ways through, both Tony's choice:
- **A. Second admin approves:** the other admin account `cyberize-repo` approves the PR, then `gh pr merge` works normally.
- **B. Admin bypass:** the ruleset grants `Admin` the `pull_request` bypass mode. Tony (admin) can use "Merge without waiting for requirements" in the GitHub web UI. If `gh pr merge` is refused, use the web button.
Minor: the ruleset also requires extra approval for "unattributed" changes; all three commits are authored by Tony, and the `Co-Authored-By` trailer does not change authorship.

## 1. Recorded

JARVIS: **PASS WITH FINDINGS** for `0de73039d312ff49b2a61120f79c0d05521c1522`, with the four evidence limits recorded verbatim in `agent_docs/VIK/round2-rehearsal/00_STATUS.md` (not marked PASS; no logs invented). Status table there keeps **T01 Cursor** as an explicit later stage, plus P01/P02/R01 and the onboarding improvement. `ADAPTATIONS.md` is deliberately untouched until after the merge.

## 2. Pending records and moves (inspected 13:36)

Every pending path is inside the accepted scope (`RECOVERY.md`, `agent_docs/SESSIONS/`, `agent_docs/RESPONSES/` incl. `_OLD/`, `agent_docs/VIK/round2-rehearsal/`). Nothing outside it; no application, kit, dependency or env file. Secret grep over pending files: 0 hits. Tony's five `_OLD/` moves are kept as-is (four are tracked-file moves, one was never committed). Nothing discarded.

## 3. PR recheck (13:36)

Base `d2a0d13` = `main` · head `eda63ff` = `refs/pull/3/head` · candidate is an ancestor of the head · candidate→head non-record diff (excluding record paths and `round2-rehearsal/`) is **empty** · mergeable, state "blocked" (Draft + review) · 0 checks.

## 4. Q5 expectation

A merge commit with `main` still at `d2a0d13` yields a `main` tree equal to the head tree. Excluding only `RECOVERY.md`, `CHANGELOG.md`, `agent_docs/SESSIONS/`, `agent_docs/RESPONSES/`, `agent_docs/VIK/round2-rehearsal/`, it must be identical to the candidate. If the command prints anything but `Q5 PASS`, stop and send me the output; Stage 2 is not complete.

## 5. Commands (Tony runs; I ran none)

Step 1 commits the reviewed records and pushes (moves the PR head by records only). Step 2 marks ready. Step 3 is the review/bypass choice. Step 4 merges with a merge commit. Step 5 is Q5. Step 6 syncs the local clone.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
git add RECOVERY.md agent_docs/SESSIONS/session_2026-10-15.md agent_docs/SESSIONS/session_2026-10-18.md agent_docs/RESPONSES agent_docs/VIK/round2-rehearsal
git status --short
git commit -m "records: round-two rehearsal evidence, G05 results, JARVIS PASS WITH FINDINGS, Stage 2 prep" -m "Candidate 0de7303 unchanged outside record paths and sanitized rehearsal evidence. External handoff ready stays NO." -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push origin pilot/vik-round2-onboarding
gh pr ready 3 --repo Cyberize-Group/cyph-v1-dev
```

Step 3: either have `cyberize-repo` approve PR #3 on GitHub, or plan to use the admin bypass button. Then:

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
gh pr view 3 --repo Cyberize-Group/cyph-v1-dev --json isDraft,reviewDecision,mergeStateStatus,headRefOid
gh pr merge 3 --repo Cyberize-Group/cyph-v1-dev --merge --subject "Merge pull request #3 from Cyberize-Group/pilot/vik-round2-onboarding" --body "pilot: round-two onboarding and secret-free startup (candidate 0de7303; JARVIS PASS WITH FINDINGS)"
```

If the merge is refused for the review rule, use the web UI "Merge without waiting for requirements" with the merge-commit method, then continue:

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
git fetch origin main
git rev-parse origin/main
git diff --quiet 0de73039d312ff49b2a61120f79c0d05521c1522 origin/main -- . ':!RECOVERY.md' ':!CHANGELOG.md' ':!agent_docs/SESSIONS' ':!agent_docs/RESPONSES' ':!agent_docs/VIK/round2-rehearsal' && echo "Q5 PASS: main matches candidate outside record paths" || echo "Q5 FAIL: send this output to Claudy"
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

Send me the `origin/main` SHA and the Q5 line. Stage 2 is complete only on `Q5 PASS`; then I update the ledger, README evidence line and RECOVERY in the next cycle.

```
/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/RESPONSES/response_2026-10-18_133628_stage2-merge-prep.md
```
