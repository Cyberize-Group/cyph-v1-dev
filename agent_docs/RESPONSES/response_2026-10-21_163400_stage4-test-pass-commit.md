# VIK Stage 4: manual test PASS, naming polish, Director commands

**Result (Tony, Director-supplied, 2026-10-21): PASS.** The test ran in the isolated copy at test-only commit `63bf94080ffb4198784cff5f2f218dd9c4e7123c`, which holds the kit edits on `697d8f3`. Tony said Hi, chose 1 and gave a custom branch name. The AI showed the normalized name, Tony confirmed it, and the AI created `guest/qa-my-lovely-branch-21oct2026` at that commit. It then reported the work area ready and asked "What would you like to change?". **This verifies the local onboarding flow only.** Preview/login and Windows/Cursor remain untested. External handoff ready stays **NO**.

**Polish (Director, no retest):** the default suggestion in `vibe_docs/GUEST_AI_RULES.md` §2 step 4 is now `guest/frank-<YYYY-MM-DD>`, no longer taken from Git config. This is a naming default only: the Git author and GitHub identity are neither read nor changed. Accepting a custom name, normalization and collision handling are unchanged.

**Records updated:** the README evidence line, ADAPTATIONS (Stage 4 test result), CHANGELOG, the session log and RECOVERY.

**Before you run anything:**
- The branch `pilot/vik-stage4-onboarding` (made by Tony) is at `697d8f3`, which equals `origin/main`.
- The test-only commit `63bf940` does not exist in this repository. It lives only in `/home/moose/VIK_TEST/` and is never pushed. Block A also checks this.
- Block A refuses to stage anything if the working tree holds anything beyond the 18 expected paths, so unrelated work is never swept in.
- Ignored files (`CLAUDE.local.md`, `.env.local`) are never staged.

## A. Commit, push, PR

```bash
(
  set -u
  export GIT_TERMINAL_PROMPT=0
  REPO=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
  BR=pilot/vik-stage4-onboarding
  BASE=697d8f3bc0f6b2a44d98c4bf8acefe39b77fd25f
  TEST=63bf94080ffb4198784cff5f2f218dd9c4e7123c
  stop() { echo "STOP: $*. Nothing further was run."; exit 1; }
  PATHS=(
    .github/PULL_REQUEST_TEMPLATE/vibe_proposal.md
    .gitignore
    CHANGELOG.md
    CLAUDE.md
    RECOVERY.md
    agent_docs/RESPONSES/response_2026-10-21_144856_stage4-onboarding-recon-plan.md
    agent_docs/RESPONSES/response_2026-10-21_160700_stage4-implementation.md
    agent_docs/RESPONSES/response_2026-10-21_163400_stage4-test-pass-commit.md
    agent_docs/SESSIONS/session_2026-10-21.md
    agent_docs/VIK/ADAPTATIONS.md
    agent_docs/VIK/retired/ASSIGNMENT_FILE_TEMPLATE.md
    agent_docs/VIK/retired/README.md
    agent_docs/VIK/retired/STARTER_MESSAGE_TEMPLATE.txt
    vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md
    vibe_docs/GUEST_AI_RULES.md
    vibe_docs/README.md
    vibe_docs/STARTER_MESSAGE_TEMPLATE.txt
    vibe_docs/START_HERE.md
  )
  EXPECTED="$(printf '%s\n' "${PATHS[@]}" | sort)"

  cd "$REPO" || stop "cannot enter $REPO"
  [ "$(git branch --show-current)" = "$BR" ] || stop "not on $BR"
  [ "$(git rev-parse HEAD)" = "$BASE" ] || stop "HEAD is not $BASE"
  git fetch origin || stop "fetch failed"
  [ "$(git rev-parse origin/main)" = "$BASE" ] || stop "origin/main moved since $BASE; tell Claudy"
  git ls-remote --exit-code --heads origin "$BR" >/dev/null; rc=$?
  [ "$rc" -eq 2 ] || stop "remote $BR already exists or ls-remote failed (rc=$rc)"
  if git cat-file -e "$TEST" 2>/dev/null; then stop "test-only commit $TEST is in this repository"; fi
  [ "$(git status --porcelain --untracked-files=all | cut -c4- | sort)" = "$EXPECTED" ] || stop "working tree differs from the expected 18 paths; nothing staged"

  git add -- "${PATHS[@]}" || stop "git add failed"
  [ "$(git diff --cached --name-only --no-renames | sort)" = "$EXPECTED" ] || stop "staged set differs from the expected 18 paths (unstage with: git restore --staged .)"
  git status --short

  git commit \
    -m "pilot: VIK Stage 4 onboarding without assignment file" \
    -m "Hi -> 1 -> the AI proposes guest/frank-<date> (or the guest's own name), validates, creates and verifies the branch from origin/main, records the baseline in branch.<name>.vibeBaseline, then asks what to change. No assignment file, pasted starter or roster; legacy templates retired to agent_docs/VIK/retired/. Local frontend proposal work authorized; publishing closed; External handoff ready stays NO. Tony's manual onboarding test passed 2026-10-21 (local flow only; preview and Windows pending)." \
    -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || stop "commit failed"
  git push -u origin "$BR" || stop "push failed"

  BODY=$(cat <<'EOF'
## VIK Stage 4: onboarding without an assignment file

**Guest journey:** Clone → Open → Hi → 1 → the AI proposes `guest/frank-<YYYY-MM-DD>` → the guest accepts or gives another name → the AI normalizes, validates, creates and verifies the branch from `origin/main` → "What would you like to change?"

- No assignment file, pasted starter or roster. Templates retired to `agent_docs/VIK/retired/`.
- Baseline is recorded locally in `branch.<name>.vibeBaseline`. Collisions get `-2`. Existing work is preserved: the AI resumes `guest/` branches and stops on dirty `main`, other branches, detached HEAD or an operation in progress.
- Local frontend proposal work is authorized (`src/app/**`, `src/components/**`, minus protected paths). Install, settings and server are handled only when a preview needs them. Credential rules are unchanged.
- Publishing is closed: no push, PR, merge or deployment by guests. **External handoff ready stays NO.**

**Evidence:** Tony's manual onboarding test PASSED on 2026-10-21 in an isolated copy (local flow only). Preview/login and Windows/Cursor are not yet tested. Record: `agent_docs/RESPONSES/response_2026-10-21_163400_stage4-test-pass-commit.md`.

Documentation and kit only; no application, dependency or credential changes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)
  gh pr create --base main --head "$BR" --title "VIK Stage 4: onboarding without assignment file" --body "$BODY" || stop "PR creation failed (commit and push are done)"
  echo "A OK: $BR @ $(git rev-parse HEAD) pushed; PR $(gh pr view "$BR" --json url -q .url)"
)
```

## B. Merge (merge commit, PROTECT MAIN)

This needs one approving review. `ADMIN="--admin"` is only for a Director bypass decision.

```bash
(
  set -u
  REPO=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
  BR=pilot/vik-stage4-onboarding
  ADMIN=""   # set ADMIN="--admin" only if you authorize the PROTECT MAIN bypass (as in Stage 3)
  stop() { echo "STOP: $*. Nothing further was run."; exit 1; }

  cd "$REPO" || stop "cannot enter $REPO"
  HEAD_SHA=$(git rev-parse "$BR") || stop "no local $BR"
  [ "$(gh pr view "$BR" --json state -q .state)" = "OPEN" ] || stop "PR for $BR is not open"
  [ "$(gh pr view "$BR" --json headRefOid -q .headRefOid)" = "$HEAD_SHA" ] || stop "PR head differs from local $BR"
  gh pr merge "$BR" --merge $ADMIN --match-head-commit "$HEAD_SHA" || stop "merge refused (PROTECT MAIN needs one approving review, or ADMIN=--admin as a Director decision)"
  [ "$(gh pr view "$BR" --json state -q .state)" = "MERGED" ] || stop "PR is not MERGED"
  echo "B OK: merge commit $(gh pr view "$BR" --json mergeCommit -q .mergeCommit.oid)"
)
```

## C. Sync local main (Post-Merge Sync Rule)

```bash
(
  set -u
  export GIT_TERMINAL_PROMPT=0
  REPO=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
  BR=pilot/vik-stage4-onboarding
  stop() { echo "STOP: $*. Nothing further was run; work is preserved."; exit 1; }

  cd "$REPO" || stop "cannot enter $REPO"
  [ -z "$(git status --porcelain)" ] || stop "working tree is not clean; not switching"
  M=$(gh pr view "$BR" --json mergeCommit -q .mergeCommit.oid); [ -n "$M" ] || stop "no merge commit found"
  git fetch origin || stop "fetch failed"
  [ "$(git rev-parse origin/main)" = "$M" ] || stop "origin/main is not the merge commit $M"
  [ "$(git rev-parse "$M^2")" = "$(git rev-parse "$BR")" ] || stop "merge second parent is not local $BR"
  [ "$(git rev-parse "$M^{tree}")" = "$(git rev-parse "$BR^{tree}")" ] || stop "merged tree differs from the $BR tree"
  git switch main || stop "switch to main failed"
  git merge --ff-only origin/main || stop "local main cannot fast-forward"
  [ "$(git rev-parse main)" = "$M" ] || stop "local main is not $M"
  echo "C OK: main = origin/main = $M; tree identical to $BR"
)
```

After C: refresh `CLAUDE.local.md` from `CLAUDE.eng.md` (still pending since Stage 3). Next comes the Frank Windows/Cursor run, plus the preview/login check.
