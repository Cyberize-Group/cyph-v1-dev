# Stops and resumption — same consolidated Git handoff

Do not blindly rerun GIT_HANDOFF.sh after it has created commits or worktrees: the initial HEAD guard will deliberately stop. `/tmp/apbm003-git-identities.sh` saves actual nonsecret commit IDs after the QA records commit and again before push. Source it only after inspecting it. Never invent a future SHA.

If a review prompt is declined, stop where it says; inspect the named staged diff, then continue with the next command in GIT_HANDOFF.sh after that exact prompt. Do not reset, stash or broadly stage. The original checkout's inherited work is deliberately untouched.

If a merge/cherry-pick conflicts, stay in the integration worktree, inspect `git status` and `git diff --name-only --diff-filter=U`, resolve both sides, and stage each exact resolved file. Review `git diff --cached` and confirm `git ls-files -u` is empty. Commit the reviewed resolution with the message appropriate to that step (the handoff uses --no-commit operations); then continue at the next step. If Git reports a remaining cherry-pick operation after that commit, inspect it before continuation; do not abort/reset automatically. Re-run relevant checks if resolutions changed product behavior.

If the final PR review is not yet approved, all implementation and evidence commits already exist and engineering is pushed. After the independent review/threads/checks are satisfied:

```bash
set -euo pipefail
source /tmp/apbm003-git-identities.sh
cd "$integration_dir"
test "$(git rev-parse HEAD)" = "$integration_head"
test "$(gh pr view "$pr" --repo Cyberize-Group/cyph-v1-dev --json headRefOid --jq .headRefOid)" = "$integration_head"
test "$(gh pr view "$pr" --repo Cyberize-Group/cyph-v1-dev --json reviewDecision --jq .reviewDecision)" = APPROVED
gh pr merge "$pr" --repo Cyberize-Group/cyph-v1-dev --merge --match-head-commit "$integration_head"
test "$(gh pr view "$pr" --repo Cyberize-Group/cyph-v1-dev --json state --jq .state)" = MERGED
git fetch origin refs/heads/main:refs/remotes/origin/main
git worktree add "$main_dir" main
cd "$main_dir"
git merge --ff-only origin/main
git rev-parse HEAD
```

A server-side protection failure is a stop for the required authorized reviewer/merger, not permission to use `--admin`, force push or direct main push. No branches are deleted. GitHub PR merge updates remote main; a separate `git push main` is intentionally not used. APBM-004 uses the actual resulting approved main revision and carried follow-up/lesson records.
