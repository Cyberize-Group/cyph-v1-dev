# Choice-first startup correction — 2026-10-10 15:11 (session 5)

## Live observation recorded (E)
Session 5, factory clone, local file present, first message "hi": the boxed FACTORY ENGINEERING ACTIVE banner **rendered correctly**, but the required choice-first behavior **failed**. The session auto-selected factory from `CLAUDE.local.md`, ran Step 0 and wrote a session record without showing the 1/2 choice. It was following the `CLAUDE.md` rules at `77ab0d2`, which allowed that.

## CHANGES MADE
- `CLAUDE.md`: every fresh session shows the WORKFLOW SELECTION box first, even with `CLAUDE.local.md` present or a task in the first message, then waits. Before the answer: no Step 0, no RECOVERY/backlog reads, no records, no banners; only minimal read-only routing checks. The local file is a readiness check and never selects the workflow, whatever its declaration says, and the shared file takes precedence on startup. Option 2 → ACTIVE + factory Step 0 (declared local file) or SETUP REQUIRED and stop (missing/undeclared). Option 1 → guest banner + kit (pause if kit missing), or, with the local file present, explain it is already loaded, give the move-out backup command, require a fresh session, pause. "Guest mode" kept. All 4 boxes unchanged in wording, 60 columns.
- `CLAUDE.eng.md`: Session Start gains a gate — Step 0 runs only after option 2; the "before you read the user's first message" line now reads "right after option 2 is chosen". No other change.
- `agent_docs/FACTORY_SESSION_SETUP.md`: new declaration text (readiness, not selection); declaration-required note and "Between sessions" mention the startup question.
- Records: session log (observation E, approved, complete), this report, `RECOVERY.md`, `CHANGELOG.md`.

## THINGS I DIDN'T TOUCH
- `CLAUDE.local.md` (mtime 12:23, unchanged). Application code, DB, deps, credentials, cloud. No git mutations.

## MANUAL LOCAL-FILE REFRESH (Tony)
The local copy still has the old declaration ("that makes this a factory session") and the old ungated Step 0. The new `CLAUDE.md` overrides both on startup, but refresh so the files agree:

```bash
cp CLAUDE.local.md ~/cyph-CLAUDE.local.md.bak
{ sed -n '21,30p' agent_docs/FACTORY_SESSION_SETUP.md; echo; cat CLAUDE.eng.md; } > CLAUDE.local.md
diff <(tail -n +12 CLAUDE.local.md) CLAUDE.eng.md   # expect no output
head -3 CLAUDE.local.md                             # expect the new declaration
git check-ignore -v CLAUDE.local.md                 # expect the .gitignore rule
```
(The current local file has no intentional local additions — its body matched the master exactly before this change.)

## NEXT FRESH-SESSION CHECK
1. Factory clone, after refresh, fresh session, say "hi": expect only the WORKFLOW SELECTION box — no ACTIVE banner, no file reads beyond routing, no new session/response record (verify with `git status`).
2. Answer `2`: expect ACTIVE once, then Step 0 records.
3. Fresh session, answer `1` with the local file present: expect the "already loaded / move out / fresh session" explanation and a pause, no writes.
4. Temporary clone without the local file: `1` → guest banner + kit-missing pause; `2` → SETUP REQUIRED, stop.

## POTENTIAL CONCERNS
- This is a document review only. **No live success is claimed**; this session loaded the old rules.
- Startup precedence relies on the model honoring the shared file over the local declaration; refreshing the local copy removes the conflict.
- An explicit workflow statement in the first message no longer skips the box (the previous rule allowed it). Say if you want that shortcut back.
