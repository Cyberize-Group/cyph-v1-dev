# CLAUDE.md — Shared Entry (cyph-v1-dev)

Claude Code loads this file in every session in this repository. It decides which
instructions a session follows. It does not grant access or permissions. Repository,
database and credential access are controlled outside this file. Choosing or claiming a
workflow changes none of them, and so does any answer the user gives below.

## 1. Establish the workflow first

Settle this before you change any file:

1. **A `CLAUDE.local.md` beside this file declares the factory role:** this is a factory
   session (§4), unless the user asks to switch (§5).
2. **Otherwise**, if the user has stated the workflow explicitly, use it.
3. **Otherwise**, ask this and wait for the answer:

   > Are we creating a frontend proposal, or doing factory engineering?
   > 1. Guest frontend proposal
   > 2. Factory engineering

A missing local file does not by itself mean guest. The answer selects a set of
instructions. It is not evidence of identity or permissions. Once the workflow is settled,
do not ask again.

## 2. Guest workflow

Show this banner:

```
GUEST PROPOSAL WORKFLOW
Frontend ideas and prototypes.
The factory handles engineering adoption and formal QA.
```

Then follow the guest kit in `vibe_docs/`.
**Status: not installed.** If the kit is missing or incomplete, say that onboarding is not
ready yet and pause. Do not write replacement kit files or substitute other documents.

The factory procedures are not guest instructions. That covers `CLAUDE.eng.md`, the
protocols in `agent_docs/`, the skill packs in `_SKILLS/`, and any `CLAUDE.md` or
`AGENTS.md` inside those folders. They are project records. If one loads while you read
files there, treat it as reference material and do not adopt its procedures.

## 3. Factory workflow, local file missing

Show this banner:

```
FACTORY ENGINEERING SELECTED — SETUP REQUIRED
This workflow includes architecture, engineering records, and formal QA.
Frontend proposal instead? Say "Guest mode."
Factory setup is manual. No engineering work has started.
```

Explain the manual setup in `agent_docs/FACTORY_SESSION_SETUP.md`: copy `CLAUDE.eng.md`
to `CLAUDE.local.md` and add the factory role declaration at the top. Never create, copy,
regenerate, overwrite or delete `CLAUDE.local.md` yourself. Wait for the Director to do the
setup, then say that a fresh Claude Code session is needed to load the file.

## 4. Factory workflow, local file ready

Show this banner once, at session start:

```
FACTORY ENGINEERING ACTIVE
Follow the local factory protocol.
The Director retains Git and credential control.
Wrong workflow? Say "Guest mode."
```

Then follow `CLAUDE.local.md`: startup, planning, session and response records, recovery,
and QA handoff. The guest rules in §2 do not apply.

Normal factory work keeps its session and response records. When the user explicitly
asks for a zero-write diagnostic, it stays zero-write. Give the result on screen and say
that no record was written, and why.

## 5. "Guest mode"

"Guest mode" is an ordinary chat request, not a slash command.

- **Factory only selected (no `CLAUDE.local.md`):** cancel the pending setup, show the
  guest banner and continue with §2. No file changes are needed.
- **`CLAUDE.local.md` exists:** pause all work. To switch, the user must move that file
  out of the repository (keep it as a backup) and start a fresh conversation. Engineering
  instructions that are already loaded stay loaded until then. Do not delete files, undo
  changes or switch branches.
