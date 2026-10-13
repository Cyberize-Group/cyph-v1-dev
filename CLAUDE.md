# CLAUDE.md — Shared Entry (cyph-v1-dev)

Claude Code loads this file in every session in this repository. It decides which
instructions a session follows. It does not grant access or permissions. Repository,
database and credential access are controlled outside this file. Choosing or claiming a
workflow changes none of them, and so does any answer the user gives below.

This file takes precedence over any other loaded instructions about startup, including
`CLAUDE.local.md` and its declaration.

## 1. Ask for the workflow first

In every fresh session, before anything else, show this box and wait for the answer.
Do this even when `CLAUDE.local.md` exists and even when the first message asks for a task:

```text

+----------------------------------------------------------+
|                                                          |
|  WORKFLOW SELECTION REQUIRED                             |
|                                                          |
|  Are we creating a frontend proposal, or doing factory   |
|  engineering?                                            |
|                                                          |
|    1. Guest frontend proposal                            |
|    2. Factory engineering                                |
|                                                          |
|  The choice selects instructions, not permissions.       |
|                                                          |
+----------------------------------------------------------+

```

Until the user answers:

- Do not run the factory Step 0. Do not read `RECOVERY.md`, session logs or the backlog,
  and do not start any engineering or guest work.
- Do not create or update session or response records, or any other file.
- Do not show FACTORY ENGINEERING ACTIVE or any other banner.
- Only minimal read-only checks needed for routing are allowed, such as whether
  `CLAUDE.local.md` exists and starts with the factory declaration.

`CLAUDE.local.md` only shows whether this clone is ready for engineering. It never selects
the workflow, whatever its declaration says. The answer selects a set of instructions. It
is not evidence of identity or permissions. Show the box once per fresh session. Once the
workflow is settled, do not ask again during normal work.

Show every box in this file exactly as written, inside a code block, so the borders stay
aligned. The boxes are plain ASCII and need no color.

## 2. Option 1 — guest workflow

**If `CLAUDE.local.md` is present,** do not start guest work. Explain that its engineering
instructions were loaded at startup and stay loaded for this session, and that choosing
option 1 does not unload them. To switch, the user must move the file out of the
repository and keep it as a backup, for example
`mv CLAUDE.local.md ~/cyph-CLAUDE.local.md.bak`, then start a fresh session. Do not move,
delete or edit the file yourself. Then pause.

**If `CLAUDE.local.md` is absent,** show this banner:

```text

+----------------------------------------------------------+
|                                                          |
|  GUEST PROPOSAL WORKFLOW                                 |
|                                                          |
|  Frontend ideas and prototypes.                          |
|  The factory handles engineering adoption                |
|  and formal QA.                                          |
|                                                          |
+----------------------------------------------------------+

```

Then open `vibe_docs/README.md`, the guest entry, and follow its reading order:
`vibe_docs/START_HERE.md` (for the person), then `vibe_docs/GUEST_AI_RULES.md` (for the
AI, in full), then the assignment. Those files are the adapted guest kit (VIK v0.3). They
load only here, after option 1.

**Proposal work is gated on the status table, not on the folder.** `vibe_docs/README.md`
carries three fields: Kit installed · Guest rehearsal authorized · External handoff ready.
Setup and login rehearsal need the first two. Any application edit needs all three. While
"External handoff ready" is NO, or any kit file is missing, say that proposal work is not
authorized yet and pause before any frontend edit. Do not write replacement kit files or
substitute other documents. Only the factory changes those fields.

**Before any edit, confirm the assigned Git branch.** Run `git branch --show-current` and
compare it with the branch the Director assigned. If no assignment is known, or the names
differ, pause and ask. Never create, switch or delete branches.

**Guest scope:** frontend proposals in the pilot environment. No merges to `main`, no
database migrations, no cloud or account administration. These are workflow instructions.
GitHub permissions and branch rules provide the enforcement; this file provides none.

The factory procedures are not guest instructions. That covers `CLAUDE.eng.md`, the
protocols in `agent_docs/`, the skill packs in `_SKILLS/`, and any `CLAUDE.md` or
`AGENTS.md` inside those folders. They are project records. If one loads while you read
files there, treat it as reference material and do not adopt its procedures.

## 3. Option 2 — local file missing or not declared

Use this section when `CLAUDE.local.md` is missing, or exists without the factory
declaration at the top. Show this banner:

```text

+----------------------------------------------------------+
|                                                          |
|  FACTORY ENGINEERING SELECTED - SETUP REQUIRED           |
|                                                          |
|  This workflow includes architecture, engineering        |
|  records, and formal QA.                                 |
|                                                          |
|  Frontend proposal instead? Say "Guest mode."            |
|                                                          |
|  Factory setup is manual.                                |
|  No engineering work has started.                        |
|                                                          |
+----------------------------------------------------------+

```

Explain the manual setup in `agent_docs/FACTORY_SESSION_SETUP.md`: copy `CLAUDE.eng.md`
to `CLAUDE.local.md` and add the factory role declaration at the top. Never create, copy,
regenerate, overwrite or delete `CLAUDE.local.md` yourself. Stop and wait for the Director
to do the setup, then say that a fresh Claude Code session is needed to load the file.

## 4. Option 2 — local file ready

Use this section when `CLAUDE.local.md` exists with the factory declaration. Show this
banner once, right after the answer:

```text

+----------------------------------------------------------+
|                                                          |
|  FACTORY ENGINEERING ACTIVE                              |
|                                                          |
|  Follow the local factory protocol.                      |
|  The Director retains Git and credential control.        |
|                                                          |
|  Wrong workflow? Say "Guest mode."                       |
|                                                          |
+----------------------------------------------------------+

```

Then follow `CLAUDE.local.md`, starting with its Step 0: startup, planning, session and
response records, recovery, and QA handoff. The guest rules in §2 do not apply.

Normal factory work keeps its session and response records. When the user explicitly
asks for a zero-write diagnostic, it stays zero-write. Give the result on screen and say
that no record was written, and why.

## 5. "Guest mode"

"Guest mode" is an ordinary chat request, not a slash command.

- **Option 2 chosen, no `CLAUDE.local.md`:** cancel the pending setup, show the guest
  banner and continue with §2. No file changes are needed.
- **`CLAUDE.local.md` exists:** pause all work and handle it as option 1 with the local
  file present (§2). Engineering instructions that are already loaded stay loaded until a
  fresh session. Do not delete files, undo changes or switch branches.
