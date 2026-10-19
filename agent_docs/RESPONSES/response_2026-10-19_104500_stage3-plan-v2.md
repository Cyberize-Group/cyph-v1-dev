🔵 PLAN MODE — Stage 3 plan v2 (JARVIS corrections applied; not implemented)

# Stage 3 plan v2: assignment file auto-load

Supersedes §1, §3 and §6 of `response_2026-10-19_100810_stage3-assignment-file-plan.md`; §2 (files), §4 (branch/PR scope) and the D1/D3/D4/D5 recommendations stand. External handoff NO.

## 1. Assignment source rules (one rule set, applied verbatim in CLAUDE.md §2, README, START_HERE, GUEST_AI_RULES §2, the template, and every fixture)

1. If `VIBE_ASSIGNMENT.local.md` exists: validate it and use it. An invalid or unreadable file **stops** the session; pasted text never overrides it.
2. If the file is absent: accept a **complete** pasted starter (one-cycle compatibility fallback, D2).
3. If neither exists: stop with the simple Engineering support message.
4. If both exist and any value differs: stop.
Read-only Git validation (branch/HEAD/status inspection, read-only `ls-remote`/fetch of the baseline) is allowed during validation. Every failure stops **before any Git change, installation or server startup**, names the exact item, and asks the guest only to forward it. *(JARVIS correction 2, 11:05.)*

## 2. Verification (proportionate; no parser or runtime code)

- **V1** document consistency review across the five kit docs + template: the four source rules above appear once, identically; one branch exception; Stage 4 Cursor visible.
- **V2** disposable-checkout Git checks: `git check-ignore -v VIBE_ASSIGNMENT.local.md`, `git add -A --dry-run` shows neither local file, `git status` clean with both files present.
- **V3** fresh AI sessions (Opus 5.5, fixture clone at the frozen candidate): valid file → values accepted; invalid file + valid paste → stop; file absent + complete paste → accepted (fallback); neither → stop; file + conflicting paste → stop.
- **V4** one full setup/login rehearsal at the frozen Stage 3 candidate (`~/NEXT.JS/cyph-v1-dev-r3`, `guest/bibo-rehearsal-r3`), JARVIS review, Tony decides, Q5 tree comparison.
- Application lint/test/build: **skipped** unless implementation touches application behaviour or a repository requirement demands it (expected: `.gitignore` + docs only).
- **Stage 4 — Cursor (T01):** visible and next; Frank's answers shape his exact setup but do not block internal Cursor preparation.

## 3. Pending paths (refreshed 10:45)

`RECOVERY.md` · `agent_docs/SESSIONS/session_2026-10-18.md` · `agent_docs/VIK/round2-rehearsal/00_STATUS.md` · `agent_docs/RESPONSES/response_2026-10-18_141848_q5-result.md` · `agent_docs/RESPONSES/response_2026-10-19_100810_stage3-assignment-file-plan.md` · `agent_docs/SESSIONS/session_2026-10-19.md` · plus this record and the RECOVERY/session edits of this turn. All go into commit 1 on the new branch.

## 4. Git preparation — fail-closed, paste-safe (Tony)

Runs in a subshell; stops on any failed command or mismatch, never resets, stashes or deletes. It records the pending set, fetches, requires `origin/main` = `f4341c24559830d8488f9cf435f311c06a041d60`, refuses if the branch already exists locally or on origin, fast-forwards `main`, verifies `main` equals that commit, creates the branch, then verifies the pending set is byte-identical. Tested in a scratch clone: success path prints `PREP OK`; a rerun stops at the existing-branch guard.

```bash
(
  set -u
  REPO=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
  EXPECTED_MAIN=f4341c24559830d8488f9cf435f311c06a041d60
  BRANCH=pilot/vik-stage3-assignment-file
  stop() { echo "STOP: $*. Nothing further was run; pending records are untouched. Send this output to Claudy."; exit 1; }
  cd "$REPO" || stop "cannot enter $REPO"
  echo "== pending records before:"; git status --short
  PENDING_BEFORE=$(git status --porcelain | sha256sum)
  git fetch origin || stop "git fetch failed"
  [ "$(git rev-parse origin/main)" = "$EXPECTED_MAIN" ] || stop "origin/main is $(git rev-parse origin/main), not the expected merge commit"
  git show-ref --verify --quiet "refs/heads/$BRANCH" && stop "branch $BRANCH already exists locally"
  REMOTE_HEADS=$(GIT_TERMINAL_PROMPT=0 git ls-remote --heads origin) || stop "could not query origin (network or authentication failure)"
  printf '%s
' "$REMOTE_HEADS" | grep -q "refs/heads/$BRANCH\$" && stop "branch $BRANCH already exists on origin"
  git switch main || stop "switch to main failed"
  git pull --ff-only origin main || stop "fast-forward of main failed"
  [ "$(git rev-parse HEAD)" = "$EXPECTED_MAIN" ] || stop "local main is $(git rev-parse HEAD), not the expected merge commit"
  git switch -c "$BRANCH" || stop "branch creation failed"
  [ "$(git status --porcelain | sha256sum)" = "$PENDING_BEFORE" ] || stop "pending record set changed during preparation"
  echo "== result:"; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --short
  echo "PREP OK: $BRANCH created at $EXPECTED_MAIN; pending records preserved."
)
```

Send me the full output. Expected last line: `PREP OK: pilot/vik-stage3-assignment-file created at f4341c2…; pending records preserved.` On any `STOP:` line, send the output and run nothing else.

→ Awaiting the prep output before implementation.

```
/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/RESPONSES/response_2026-10-19_104500_stage3-plan-v2.md
```
