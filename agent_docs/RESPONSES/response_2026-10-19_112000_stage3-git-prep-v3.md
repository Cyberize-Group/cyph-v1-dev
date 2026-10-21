# Stage 3 Git preparation v3 — fast-forward main while not checked out

**Why v2 failed.** `RECOVERY.md` and `session_2026-10-18.md` differ between the stale local `main` (`d2a0d13`) and the checked-out PR branch (`db5caf7`), and both carry pending edits, so `git switch main` refused to overwrite them. Correct behaviour; no records were touched.

**Fix.** Fast-forward `main` while still on the PR branch with `git fetch origin main:main` (refuses non-fast-forward by itself; the block also checks ancestry first). `main` at `f4341c2` has the same tracked versions of those files as `db5caf7`, so the switch then carries the pending edits cleanly. Reproduced the failure and the fix in a scratch clone with the same stale `main`, pending edits and an untracked record: `PREP OK`, pending set byte-identical.

No force, reset, stash or deletion; every failure stops. Supersedes §4 of the plan v2 record; everything else there stands.

```bash
(
  set -u
  REPO=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
  EXPECTED_MAIN=f4341c24559830d8488f9cf435f311c06a041d60
  BRANCH=pilot/vik-stage3-assignment-file
  stop() { echo "STOP: $*. Nothing further was run; pending records are untouched. Send this output to Claudy."; exit 1; }
  cd "$REPO" || stop "cannot enter $REPO"
  echo "== state before:"; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --short
  [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ] || stop "main is checked out; this block expects the PR branch to be checked out"
  PENDING_BEFORE=$(git status --porcelain | sha256sum)
  git fetch origin || stop "git fetch failed"
  [ "$(git rev-parse origin/main)" = "$EXPECTED_MAIN" ] || stop "origin/main is $(git rev-parse origin/main), not the expected merge commit"
  git merge-base --is-ancestor main origin/main || stop "local main cannot fast-forward to origin/main"
  git show-ref --verify --quiet "refs/heads/$BRANCH" && stop "branch $BRANCH already exists locally"
  REMOTE_HEADS=$(GIT_TERMINAL_PROMPT=0 git ls-remote --heads origin) || stop "could not query origin (network or authentication failure)"
  printf '%s\n' "$REMOTE_HEADS" | grep -q "refs/heads/$BRANCH\$" && stop "branch $BRANCH already exists on origin"
  git fetch origin main:main || stop "fast-forward of local main (not checked out) failed"
  [ "$(git rev-parse main)" = "$EXPECTED_MAIN" ] || stop "local main is $(git rev-parse main) after fast-forward, not the expected merge commit"
  git switch main || stop "switch to updated main failed"
  git switch -c "$BRANCH" || stop "branch creation failed"
  [ "$(git status --porcelain | sha256sum)" = "$PENDING_BEFORE" ] || stop "pending record set changed during preparation"
  echo "== result:"; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --short
  echo "PREP OK: $BRANCH created at $EXPECTED_MAIN; local main fast-forwarded; pending records preserved."
)
```

Expected last line: `PREP OK: pilot/vik-stage3-assignment-file created at f4341c2…; local main fast-forwarded; pending records preserved.`

```
/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/RESPONSES/response_2026-10-19_112000_stage3-git-prep-v3.md
```
