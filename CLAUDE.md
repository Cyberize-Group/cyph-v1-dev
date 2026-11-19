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
instructions were loaded at startup (or read during §3) and stay loaded for this session,
and that choosing option 1 does not unload them. Instructions already in a conversation
cannot be removed from it, so this is the one case that needs a fresh session. To switch,
the user must move the file out of the repository and keep it as a backup, for example
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
AI, in full). Those files are the adapted guest kit (VIK v0.3, Stage 4 onboarding). They
load only here, after option 1.

**Guest work is gated on the status table, not on the folder.** `vibe_docs/README.md`
carries three fields: Kit installed · Guest rehearsal authorized · External handoff ready.
Local setup and frontend proposal work need the first two to be YES. External handoff ready
is the factory's release decision for outside guests; it does not gate local work. If a kit
file is missing or either required field is not YES, say that guest work is not available
yet and pause. Do not write replacement kit files or substitute other documents. Only the
factory changes those fields.

**Everything the guest needs ships in this repository.** No assignment file or pasted
starter message is needed. If an old one appears, ignore it and leave it untouched. After
reading the kit, follow `vibe_docs/GUEST_AI_RULES.md` §2. The AI checks the workspace, then
either resumes the guest's existing `guest/` branch or proposes a new branch name. The guest
accepts it or gives another. The AI validates the name, creates the branch from the latest
`origin/main` and verifies it, then asks what the guest would like to change. Never reset,
stash or discard work, switch away from uncommitted work or delete branches. Publish only on
the guest's explicit request. Never ask the guest to interpret a commit ID. Never read `.env.local` contents.

**Guest scope:** frontend proposals inside the allowed paths in
`vibe_docs/GUEST_AI_RULES.md` §6. On the guest's explicit request, the AI signs the guest in
to GitHub inside this clone only, then commits, pushes the guest branch and opens a pull
request (§7). Existing credentials and global settings stay untouched, and tokens are never
shown. Merging is Director-only. There is no deployment, no database migration and no cloud
or account administration. These are workflow instructions. GitHub permissions and branch rules
provide the enforcement; this file provides none.

The factory procedures are not guest instructions. That covers `CLAUDE.eng.md`, the
protocols in `agent_docs/`, the skill packs in `_SKILLS/`, and any `CLAUDE.md` or
`AGENTS.md` inside those folders. They are project records. If one loads while you read
files there, treat it as reference material and do not adopt its procedures.

## 3. Option 2 — local file missing or not declared

Use this section when `CLAUDE.local.md` is missing, or exists without the factory
declaration (a first line starting `> **FACTORY SESSION DECLARATION**`). Show this banner:

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
|  Local setup is missing or incomplete.                   |
|  No engineering work has started.                        |
|                                                          |
+----------------------------------------------------------+

```

Then offer to prepare the local file, say exactly what will change, and wait for an
explicit yes. Change nothing before it. `CLAUDE.eng.md` already starts with the declaration.

- **Missing:** create it from the master with `cp -n CLAUDE.eng.md CLAUDE.local.md`.
- **Present without the declaration:** never overwrite it. Insert the declaration block from
  the top of `CLAUDE.eng.md` (through its first `---` line and the blank line after it)
  above the existing content, and leave the rest of the file byte-for-byte unchanged. Say
  whether that content matches the master below its declaration. If it differs, name the
  differing sections and leave the refresh to the Director
  (`agent_docs/FACTORY_SESSION_SETUP.md`, "After the master changes").

After the change, verify that the first line is the declaration, that
`git check-ignore -v CLAUDE.local.md` prints the `/CLAUDE.local.md` rule, and that
`git status --short` does not list the file. If a check fails, stop and report it. Do not
edit `.gitignore`. Then read `CLAUDE.local.md` in full and continue with §4 in this same
session. No restart is needed: Claude Code loads `CLAUDE.local.md` automatically only at
startup, and reading it explicitly brings the same instructions into this session. If the
conversation is later summarized, read the file again.

On a no, or "Guest mode", stop setup and change nothing. Outside this offer, never create,
rewrite or delete `CLAUDE.local.md`, and never commit it.

## 4. Option 2 — local file ready

Use this section when `CLAUDE.local.md` exists with the factory declaration, whether it
loaded at startup or was read after §3. Show this banner once, right after the answer or
the §3 setup:

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

- **Option 2 chosen, no `CLAUDE.local.md`:** cancel the pending setup offer, show the
  guest banner and continue with §2. No file changes are needed.
- **`CLAUDE.local.md` exists:** pause all work and handle it as option 1 with the local
  file present (§2). This includes a file created or read during §3. Engineering
  instructions that are already loaded stay loaded until a fresh session. Do not delete
  files, undo changes or switch branches.
