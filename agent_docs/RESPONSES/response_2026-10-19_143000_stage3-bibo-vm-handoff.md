# Stage 3 — candidate frozen at `6f4e004c8a1278458230fc6359844408f841956d`; Bibo VM handoff prepared

PR #4 (https://github.com/Cyberize-Group/cyph-v1-dev/pull/4) verified: OPEN, **Draft**, base `main`, head `pilot/vik-stage3-assignment-file` @ `6f4e004c8a1278458230fc6359844408f841956d`; `origin/pilot/vik-stage3-assignment-file` and local HEAD equal the same SHA; working tree clean. No Git mutation, kit change, live test or readiness flip. V3/V4 pending; External handoff **NO**.

## 1. Fixtures (frozen)
Seven fixtures filled with the exact candidate SHA; "Baseline status" names Draft PR #4 as an explicitly authorized internal rehearsal, not the release baseline. V3-a keeps its deliberately invalid baseline placeholder; V3-g pairs that file with a complete valid paste. V3-c and V3-f carry the explicit operator stop after branch verification; V4 keeps the full flow. Paste fixtures (V3-d, V3-f, V3-g) are in the legacy greeting form the fallback expects. A scripted check confirmed per fixture: baseline, branch, PR #4 named, stop sentence present/absent as intended, no leftover marker, no credential pattern, correct form. Originals with the marker remain in the scratchpad untouched.

## 2. Clone block
Adapted from the Stage 2 E4 block: fail-closed, detached at the candidate, tree hash `4d60ef331eb108f2aaa8e4928614ff064a053199`, ancestry on the fetched PR branch, clean status, no settings/assignment/instruction file beyond the two examples, nine key-file hashes. Dry-run in the scratchpad: `S3 CLONE OK`, 9/9 hashes. One clone per case (`-r3-fx-a` … `-r3-fx-g`, V4 in `cyph-v1-dev-r3`); r1/r2 clones and evidence untouched; nothing is deleted between cases.

## 3. Package
`/home/moose/Downloads/CYPH_STAGE3_BIBO_VM_HANDOFF_2026-10-19_142745.zip` — SHA-256 `c079aa652a73bc8a5e85bda3011177007c41e83068f90ddaec1dddbd2a60f0f3`, 14 files: case matrix, clone block, fixtures + fixture README, manifest, secret scan (no matches). No settings files or credentials.

## 4. First Bibo VM preparation step (V3-a clone)
Copy the ZIP to the VM and unpack it anywhere outside the clones (for example `~/stage3-handoff/`). Then run exactly this in a terminal on the Bibo VM; it only clones and verifies, and stops on any mismatch without deleting anything:

```bash
# Stage 3 fresh clone (fail-closed). Change only DEST per case; nothing else.
(
  set -u
  REPO=https://github.com/Cyberize-Group/cyph-v1-dev.git
  DEST="$HOME/NEXT.JS/cyph-v1-dev-r3-fx-a"
  CANDIDATE=6f4e004c8a1278458230fc6359844408f841956d
  TREE=4d60ef331eb108f2aaa8e4928614ff064a053199
  stop() { echo "STOP: $*. Nothing further was run. Send this output to Cyberize Engineering."; exit 1; }

  [ -d "$(dirname "$DEST")" ] || stop "parent folder $(dirname "$DEST") is missing"
  if [ -e "$DEST" ] || [ -L "$DEST" ]; then stop "$DEST already exists and was left unchanged"; fi
  GIT_TERMINAL_PROMPT=0 git clone "$REPO" "$DEST" || stop "git clone failed"
  cd "$DEST" || stop "cannot enter $DEST"
  git switch --detach "$CANDIDATE" || stop "checkout of the candidate failed"

  [ "$(git rev-parse HEAD)" = "$CANDIDATE" ] || stop "HEAD is not the candidate"
  [ "$(git rev-parse 'HEAD^{tree}')" = "$TREE" ] || stop "tree differs from the candidate tree"
  git merge-base --is-ancestor "$CANDIDATE" origin/pilot/vik-stage3-assignment-file || stop "candidate is not in the fetched PR branch history"
  [ -z "$(git status --porcelain)" ] || stop "working tree is not clean"
  [ "$(ls -A | grep -E '^(\.env|CLAUDE\.local\.md$|AGENTS\.md$|VIBE_ASSIGNMENT)' | tr '\n' ' ')" = ".env.example .env.pilot.example " ] || stop "unexpected settings, assignment or instruction file present"
  printf '%s  %s\n' \
    bb6fb617d001885ea7ee9cda66bc11ffa708824996dea8a522693ee8935a1161 CLAUDE.md \
    4fbe90cc841450e963d9309e155ddfac9f293cb037c0346500219e255587328a vibe_docs/README.md \
    47ae1250892573ead882137e0d8844a34327d28585f6ae00f43ec8414cb948af vibe_docs/START_HERE.md \
    ce220b6ac29ce4a093046c31cd08fb8c79849f588b584121e274fce6fefc5a17 vibe_docs/GUEST_AI_RULES.md \
    259eabec29cdd327c38b42143205d48da6228fa4d1a47b5387d44ad3f303da5b vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md \
    e30cb9c446adbd514b7eee20b1428755ee5f09f44a77bdc86d62b1ae38edcc4c vibe_docs/STARTER_MESSAGE_TEMPLATE.txt \
    d91028e5e0449e98ef0d39f1eb10b24f7c77094b5b4c9e27c036abca2ee5d841 .gitignore \
    1523ed7f2afbccac15791a9df863dd631a7ab66c031e0fe754f971c125392915 next.config.js \
    4ee4b06deb263d6932ea754f8b22f2af60678acc3b8f6b6cd7f02c13c468279b package-lock.json \
    | sha256sum -c - || stop "a key file hash differs"
  echo "S3 CLONE OK: $DEST is at $CANDIDATE (detached HEAD), clean, 9/9 hashes match."
)
```

Send me the last line printed. Next step after `S3 CLONE OK`: copy `fixtures/V3a_invalid_placeholder.md` into the clone as `VIBE_ASSIGNMENT.local.md` (I give that exact command), then open the clone in Claude Code, fresh session, Hi → 1.

## 5. Still open
Tony refreshes `CLAUDE.local.md` from `CLAUDE.eng.md`; V3 model choice (default Opus 5.5 all cases); dependency/runtime disposition; sandbox deferred; Stage 4 Cursor T01.
