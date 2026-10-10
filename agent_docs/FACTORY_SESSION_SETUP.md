# Factory Session Setup

**For factory workstations only. Guests do not need this setup.**

The engineering master is `CLAUDE.eng.md` at the repo root. It is tracked and travels
with the repo. Claude Code does not load it automatically. A factory session loads it
through a local, git-ignored copy named `CLAUDE.local.md` (the ignore rule is `/CLAUDE.local.md` in `.gitignore`).

## Once per fresh factory clone

From the repo root:

```bash
cp CLAUDE.eng.md CLAUDE.local.md
```

Then paste the declaration block below at the very top of `CLAUDE.local.md`. The shared
root `CLAUDE.md` uses it to recognise a factory session.

```markdown
> **FACTORY SESSION DECLARATION** — local file, git-ignored, never committed.
> This `CLAUDE.local.md` marks this clone as a factory workstation. Under the shared root
> `CLAUDE.md`, that makes this a factory session: follow the engineering instructions below.
> The guest-only rules in `CLAUDE.md` do not apply here. The role describes which
> instructions to follow. It grants no access or permissions.
> Source: a copy of the tracked engineering master `CLAUDE.eng.md`. Where the text below says
> "CLAUDE.md (this file)" or "protocols", it means that master. To refresh this file, see
> `agent_docs/FACTORY_SESSION_SETUP.md`.

---
```

To check, run `git check-ignore -v CLAUDE.local.md`. It should print the `.gitignore` rule.

The declaration is required. Without it, the shared `CLAUDE.md` does not treat the
session as factory. Setup is manual: Claude never creates or edits this file.

Then start a **fresh** Claude Code session. The local file loads only at startup.

## Between sessions

`CLAUDE.local.md` stays on disk, and every new session in this clone loads it. Nothing
needs to be repeated.

## After the master changes

Refresh the local copy deliberately. Never overwrite it blindly:

1. Review the change: `diff CLAUDE.eng.md CLAUDE.local.md`. The declaration block and
   any intentional local additions show up as extra lines.
2. Rebuild the local file as the declaration, then the new master, then your intentional
   local additions. Drop anything that the new master now covers.
3. Start a new session. A running session keeps the instructions it loaded at startup.

## Leaving factory mode on this clone

To use this clone for the guest workflow, move `CLAUDE.local.md` out of the repo and keep
it as a backup (for example `mv CLAUDE.local.md ~/cyph-CLAUDE.local.md.bak`). Then start
a fresh session. To return to factory mode, move the file back and start a fresh session.
