# Factory Session Setup

**For factory workstations only. Guests do not need this setup.**

The engineering master is `CLAUDE.eng.md` at the repo root. It is tracked and travels
with the repo, and it already starts with the factory session declaration. Claude Code
does not load it automatically. A factory session uses a local, git-ignored copy named
`CLAUDE.local.md` (the ignore rule is `/CLAUDE.local.md` in `.gitignore`). The shared root
`CLAUDE.md` recognises a factory clone by the declaration on that copy's first line,
`> **FACTORY SESSION DECLARATION**`.

## Once per fresh factory clone

Start a session, answer `2`, and accept the setup offer. The agent then:

- creates the file with `cp -n CLAUDE.eng.md CLAUDE.local.md` if it is missing, or
- inserts the master's declaration block above existing content that lacks it, leaving
  that content unchanged;
- checks the declaration, `git check-ignore -v CLAUDE.local.md` and `git status --short`;
- reads the file in full and continues in the same session.

No restart is needed. Claude Code loads `CLAUDE.local.md` automatically only at startup,
so the agent reads it explicitly instead. Nothing changes without your explicit yes.

To do it by hand instead, run `cp CLAUDE.eng.md CLAUDE.local.md` from the repo root. The
copy is complete; there is nothing to paste.

## Between sessions

`CLAUDE.local.md` stays on disk, and every new session in this clone loads it. Nothing
needs to be repeated. Each session still opens with the workflow question; answer `2` to
start engineering. The file alone never selects engineering.

## After the master changes

Refresh the local copy deliberately. Never overwrite it blindly:

1. Review the change: `diff CLAUDE.eng.md CLAUDE.local.md`. Intentional local additions
   show up as extra lines.
2. Rebuild the local file as the new master (declaration included), then your intentional
   local additions. Drop anything that the new master now covers.
3. In a running session, ask the agent to read `CLAUDE.local.md` again. New sessions load
   it automatically.

## Leaving factory mode on this clone

To use this clone for the guest workflow, move `CLAUDE.local.md` out of the repo and keep
it as a backup (for example `mv CLAUDE.local.md ~/cyph-CLAUDE.local.md.bak`). Then start
a fresh session: instructions already loaded into a session cannot be removed from it.
To return to factory mode, move the file back, or answer `2` and accept the setup offer.
