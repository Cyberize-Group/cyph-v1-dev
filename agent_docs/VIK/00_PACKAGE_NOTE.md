# VIK v0.3 — Vibe Intake Kit, package note (factory-facing; not given to the guest)

**Date:** 2026-10-09 · **Author:** Fable for Tony Stark, Director · **Status:** pre-rehearsal edition per Part 1 v1.3 checklist step 14 and the QA Lead's finalization of 2026-10-09. Lessons from Exercise B go into a later PR, not this one. VIK v0.1 and v0.2 are superseded. **Not onboarding-ready** until the pending setup fields below are filled from recon/provisioning and the guest and factory launches have been demonstrated (reconciliation review V8).

Exactly three guest documents (Part 2 v0.5 §7), plus one configuration sample:

| File | Reader | Lands in the pilot repo at |
| --- | --- | --- |
| `START_HERE.md` | Frank / Coach, the humans | `docs/START_HERE.md` (Director's choice of location) |
| `AGENTS.md` | Vibe Cody, the guest AI | repo root |
| `.github/pull_request_template.md` | the PR form, filled by Vibe Cody | `.github/pull_request_template.md` |
| `.env.pilot.example` | the human, as a reference while creating `.env.local` | repo root (names only; not a policy file) |

## Corrections applied in v0.3 (reconciliation review V8)

| Correction | Where |
| --- | --- |
| Setup order: the human checks out `guest/<name>/<slug>` from `<HANDOFF_BASELINE_SHA>` **before** `npm ci` and first startup; the AI confirms that branch and never recreates or switches it | `START_HERE.md` steps 3–4, 10; `AGENTS.md` §Where you work |
| No-download checks: `./node_modules/.bin/tsc --noEmit` (or a repo script) replaces `npx tsc`; missing binary → NOT RUN, ask through Coach; no `npx`, no global installs | `AGENTS.md` §Always, §Never; template Checks; `START_HERE.md` §If something feels off |
| The handoff commit must contain the issued VIK and every required setup fix — a factory check at onboarding, recorded in the VPR record | pending-fields table |
| Instruction-file discovery and a separate factory launch route are real setup work, demonstrated before Exercise B; writing "guest rules do not bind the factory" is not proof | pending-fields table |

## Corrections applied in v0.2 (from the 2026-10-09 finalization and the Director's list)

| Correction | Where |
| --- | --- |
| Setup screens match the supplied **MEMBER** account: lands on OwedBook, sees OwedBook and Profile, Admin Portal not visible and that is correct | `START_HERE.md` steps 6–7; `AGENTS.md` §Where you work |
| The human's permitted `.env.local` setup is explicit: created by hand once from Coach's three lines; the AI never creates, edits, reads or copies it | `START_HERE.md` step 4; `AGENTS.md` §`.env.local`; template confirmation |
| Actual repo and recorded starting commit are **setup fields** (`<PILOT_REPO_URL>`, `<HANDOFF_BASELINE_SHA>`); the branch is created from that commit, not from a moving `main` | `START_HERE.md` steps 2, 8; `AGENTS.md` §Where you work; template |
| `VPR: ` prefix required; a PR without it is returned unread | `START_HERE.md`, `AGENTS.md`, template header |
| Factory instructions separate from guest instructions: `AGENTS.md` states it binds the guest's AI only; the factory's own protocol is not in this kit | `AGENTS.md` header |
| Isolation described as **verified by the factory before access**, without absolute promises | `START_HERE.md` §What's isolated |
| Tool/model reported honestly; "unknown" acceptable; requested identifiers are setup fields confirmed at implementation | `START_HERE.md` §Your AI coder; `AGENTS.md` §Reporting |
| Node floor is a setup field read from the repo, not a copied number | `START_HERE.md` step 1 |
| `public/**`, `CLAUDE.md` and this file added to the never-touch list | `AGENTS.md` §Never |

## Setup fields implementation must supply (do not invent)

| Field | Source |
| --- | --- |
| `<PILOT_REPO_URL>` | **PENDING** — Part 1 step 4 |
| `<HANDOFF_BASELINE_SHA>` | **PENDING** — the post–Exercise A, post-VIK `main` SHA at onboarding (Part 1 steps 13–14); the factory confirms, before issue, that this commit contains the issued VIK and every required setup fix; this is VPR reference 1 |
| `<NODE_VERSION_FLOOR>` | **PENDING** — R-1 step 6: the floor the repo declares, or, if none, the installed `next`'s documented minimum confirmed at Exercise A |
| `<REQUESTED_CLAUDE_MODEL>`, `<REQUESTED_GPT_MODEL>` | **PENDING** — the exact identifiers each tool reports when the Director checks them (requested: Claude Opus 5.5 / SOL 6.1 — Director instruction 2026-10-08); never guessed |
| `<INSTRUCTION_FILES_PLACED>` | **PENDING** — R-1 step 2 reports what Claude Code actually loaded; the GPT tool's behavior is checked by the Director in the clean guest workspace; then a **demonstrated** guest launch (the guest body loads) and a **demonstrated** factory launch (the factory protocol loads, guest rules do not) are recorded before Exercise B (Part 1 step 14a). If the factory's root `CLAUDE.md` conflicts with a guest tool's auto-read, the layout is changed and re-demonstrated; on any conflicting inherited instruction the launch stops. Blocks Part 1 step 14 (VIK issue), not R-1 |
| the three `.env.local` lines | never in any VIK file; Coach delivers them once |
| the assignment text | per proposal, from the Architect via Coach |

## Known decisions baked in

- Branch naming `guest/<name>/<slug>` from the recorded baseline; PR title prefix `VPR: `; journal at repo root named `VIBE_JOURNAL.md`, appended before every commit.
- The never-touch list mirrors the Part 1 CODEOWNERS paths plus `public/**`, layouts, existing tests, `.env*`, `CLAUDE.md` and `AGENTS.md`. If CODEOWNERS changes at implementation, update `AGENTS.md` in the same PR.
- `npm ci` only; no `npm install` of any kind by the guest.
- "Stop and ask through Coach" is the only escalation path; the guest never contacts the factory seats directly.

## What Exercise B is meant to test

The rehearsal's fresh Vibe Cody session gets these files and nothing else. Whatever it misreads, skips, or works around is the revision list for v0.4. Expected weak spots: the never-touch list is long for a civilian's AI to hold; the journal habit may not survive a long session; "stop and ask" may be read as advisory; the tool may read a root instruction file we did not expect. Those are hypotheses; the rehearsal decides.
