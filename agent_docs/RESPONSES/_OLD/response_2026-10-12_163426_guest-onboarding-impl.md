# Guest Onboarding — Track A Implementation Report

**Date:** 2026-10-12 16:34 · **Branch:** `vibe-pilot-setup` @ `2c9fd65` (uncommitted work on top) · **Plan:** `response_2026-10-12_155046_guest-onboarding-plan.md`, approved with eight amendments
**Status:** COMPLETE (documents). Live Cursor behaviour NOT tested.

## Changes made

| File | Change |
| --- | --- |
| `CLAUDE.md` (§2 only, lines 76–92) | Option 1 opens `vibe_docs/README.md`, named as the pilot setup guide and explicitly not the VIK. Proposal work gated on the guide's "Kit status" line (NOT INSTALLED → setup and login rehearsal only, then pause). Assigned-branch check before any edit; no assignment or mismatch → pause; never create, switch or delete branches. Guest scope (frontend proposals, pilot environment; no `main` merges, migrations, cloud or account admin). Enforcement sentence: GitHub permissions and branch rules enforce; the file provides none. |
| `.cursor/rules/workflow-entry.mdc` (new) | `alwaysApply: true` with a description. Body: read the root `CLAUDE.md` first, show its workflow question in a code block, wait for the answer, start nothing before it. States that `CLAUDE.md` is the single canonical instruction and the rule adds nothing. |
| `vibe_docs/README.md` (new) | Header "PILOT SETUP GUIDE", explicitly not the VIK. Sections: Kit status (**VIK: NOT INSTALLED**, folder ≠ ready), allowed now (clone, env, run, login, read), waits for the kit (any application edit, proposal branches, PRs), setup (no `CLAUDE.local.md`; copy `.env.example`; fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`; leave `SUPABASE_SECRET_KEY` empty; `npm ci`, `npm run dev`), demo-marker note, login rehearsal done-criteria, rules (assigned branch, scope, enforcement, tools), empty Kit documents list. No values, hosts or keys appear in it. |
| `CHANGELOG.md` | Entry at 10:34 UTC. |
| `RECOVERY.md` | New top block. |
| `agent_docs/SESSIONS/session_2026-10-12.md` | APPROVED and COMPLETE entries. |

## Document checks (run, all pass)

| Check | Result |
| --- | --- |
| Tracked files outside scope unchanged (`CLAUDE.eng.md`, `.env.example`, `.gitignore`, `package.json`, `src/`, `scripts/`, nested `AGENTS.md`) | `git diff --stat` empty ✅ |
| `CLAUDE.md` diff confined to §2 | single hunk `@@ -76,3 +76,17 @@` ✅ |
| ASCII boxes intact | every box line 60 columns ✅ |
| `.mdc` frontmatter | `description` + `alwaysApply: true`, `.mdc` extension (plain `.md` is ignored by Cursor) ✅ |
| Credential scan on new and edited files | no key patterns, no Supabase hostnames ✅ |
| New files not caught by `.gitignore` | not ignored ✅ |
| `CLAUDE.local.md` untouched | mtime 2026-10-10 15:18 ✅ |
| `.env.local` untouched by this agent | ignored (`.gitignore:28`) and untracked ✅. Its mtime is 2026-10-12 16:32:03, before approval arrived; none of this session's commands wrote to it (Director edit, by the timeline). |
| `package-lock.json`, `_OLD/` moves | untouched ✅ |

## Not claimed

- Cursor loading the rule, showing the box and waiting: **untested**. The rule is written per the official docs page only.
- GitHub ruleset on `main`: **not agent-verified** (`gh` unauthenticated). Per the Director's account, PR #1 merged successfully after protection was configured.
- Whether the configured host is the `vibe-pilot` preview branch: Director-reported.

## Rehearsal checklist (corrected per amendment 7)

Legend: ✅ observed by the Director · ⏳ pending · ❌ blocked

**Tony — factory path**
- ✅ Choice-first startup in Claude Code on this clone (10 Oct, 12 Oct).
- ✅ Factory readiness (`CLAUDE.local.md` present, ignored, declared).
- ✅ `main` protection configured by Tony, then PR #1 merged successfully through it (Director's account; ruleset not agent-verified).
- ⏳ Cursor startup without a pasted prompt: rule loads, box first, nothing before the answer.
- ⏳ Final merge path repeated on Bibo's proposal PR under protection.

**Bibo — guest path**
- ⏳ Separate guest clone, no `CLAUDE.local.md`; option 1 shows the guest banner and opens `vibe_docs/README.md`; the agent reports NOT INSTALLED and allows setup only.
- ⏳ Assigned branch confirmed before any edit; missing assignment → pause observed.
- ✅ Pilot database configuration and ✅ Bibo login + Admin Portal access on this clone (Director-reported) · ⏳ repeat on Bibo's clone with the three public variables only.
- ⏳ Protected-`main` rejection tests from Bibo's account (direct push, merge without review).
- ❌ Frontend proposal work: blocked until the approved VIK is supplied and installed, and the Kit status line is flipped.

## Things I did not touch

`CLAUDE.eng.md`, `CLAUDE.local.md`, `.env.local`, `.env.example`, `.gitignore`, `package.json`, `package-lock.json`, `src/**`, `scripts/**`, nested `CLAUDE.md` and `AGENTS.md` files, `_SKILLS/`, the `_OLD/` moves. No git mutations, no GitHub, Supabase, Cursor or account changes.

## Potential concerns

- The Kit-status gate relies on an agent reading one line; Cursor or Claude Code could misread it. The live guest test should confirm the agent pauses.
- The existing `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md` is loaded by Cursor only for files under that subtree. Left alone; watch for it in the Cursor test.

## Next

1. Tony: review, then commit the onboarding set **without** `package-lock.json` and the `_OLD/` moves (handle those separately).
2. Tony: supply the approved VIK v0.3 files → factory installs verbatim under `vibe_docs/`, fills "Kit documents", flips Kit status to INSTALLED.
3. Live tests: Cursor startup, Bibo's clone, protected-`main` rejections.
