# Workflow Startup Rules — Result

**Date:** 2026-10-10 (session 2) · **Branch:** `pilot-setup` @ `297a011` · **Origin:** `Cyberize-Group/cyph-v1-dev`
**Authority:** Director brief "factory documentation update" (scope pre-approved)

## Reboot evidence (recorded, not verified)

At the earlier zero-write diagnostic, the agent **self-reported** that `CLAUDE.md` and
`CLAUDE.local.md` were both auto-loaded and that the session was **factory**. No one
checked this independently, for example with `/memory`. No record was written at the
time because edits were forbidden. The session log now records it.

## What changed

| File | Change |
| ---- | ------ |
| `CLAUDE.md` | Rewritten, 87 lines. §1: establish the workflow (local file → explicit statement → the two-option question; a missing local file is not guest; answers grant nothing; ask only once). §2: guest banner, the `vibe_docs/` kit (not installed → pause, no invented files), factory records are not guest instructions. §3: factory with the local file missing (setup-required banner, manual setup, never touch `CLAUDE.local.md`, fresh session needed). §4: factory ready (one banner, follow the local protocol, records kept, a zero-write diagnostic stays zero-write). §5: "Guest mode" in both cases. No `@` imports. |
| `agent_docs/FACTORY_SESSION_SETUP.md` | +Declaration required, setup is manual, start a fresh session afterwards. +"Leaving factory mode": move the file out with a backup, fresh session, how to come back. |
| `agent_docs/SESSIONS/session_2026-10-10.md` | Appended: reboot evidence, plan and completion. |
| `CHANGELOG.md`, `RECOVERY.md` | Appended a top entry / top block. |

**Untouched (verified):** sha256 is unchanged for `CLAUDE.eng.md` (`1211204f…`), `CLAUDE.local.md` (`8196509f…`) and `.gitignore` (`3d1a2288…`). No application, dependency, CI or cloud files were touched. I ran no git mutations.

## Checks

- `git check-ignore -v CLAUDE.local.md` → `.gitignore:39:/CLAUDE.local.md` ✅. Not tracked ✅. `CLAUDE.eng.md` and `CLAUDE.md` are not ignored ✅. `.gitignore` was not edited.

Document walk-through. Each scenario is traced against the new `CLAUDE.md`:

| # | Scenario | Path in doc | Result |
| - | -------- | ----------- | ------ |
| 1 | Factory clone with local file | §1.1 → §4 banner once → local protocol | ✅ |
| 2 | Fresh clone, no role declared | §1.3 asks the two-option question and waits | ✅ |
| 3 | Factory selected, local file missing | §3 setup-required banner, manual steps, no auto-create, fresh session | ✅ |
| 4 | Engineering selected by mistake, then "Guest mode" | §5 first bullet → cancel → §2 | ✅ |
| 5 | "Guest mode" while local file exists | §5 second bullet: pause, move the file out with a backup, fresh conversation, nothing deleted | ✅ |
| 6 | Guest selected, `vibe_docs/` not installed | §2 status "not installed" → say onboarding is not ready, pause | ✅ (`vibe_docs/` is absent today) |

## Remaining manual launch checks (not demonstrated)

This session loaded the **previous** `CLAUDE.md`, so none of the new behaviour has run live.
Each check needs a fresh Claude Code session:

1. **Factory clone (this one):** the ACTIVE banner appears once, and the startup records are written.
2. **No local file, no statement:** move `CLAUDE.local.md` aside → the question is asked before any write.
3. **Pick 2 with no local file:** the SETUP REQUIRED banner appears and the file is not created.
4. **Then say "Guest mode":** the guest banner appears, followed by the kit-missing pause.
5. **"Guest mode" with the local file present:** the session pauses and gives move-out instructions, with no deletions.
6. **Zero-write diagnostic:** nothing is written, and the session says why.

Restore `CLAUDE.local.md` after checks 2–4.

## Next Director action

Review the diff of `CLAUDE.md` and `FACTORY_SESSION_SETUP.md`, then commit when ready. Run the launch checks above in fresh sessions. The guest kit (`vibe_docs/`) is still pending.
