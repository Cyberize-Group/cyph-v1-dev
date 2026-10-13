# Cyber Pharma Pilot — Guest Entry (`vibe_docs/`)

> You are here because option 1 was chosen at the workflow question in the root `CLAUDE.md`.
> This folder holds the guest kit: the Vibe Intake Kit (VIK) v0.3, adapted for this pilot.
> The adaptations are listed in `agent_docs/VIK/ADAPTATIONS.md`.

## Status

| Field | Value | Meaning |
| --- | --- | --- |
| **Kit installed** | **YES** (2026-10-12) | The adapted VIK documents are in this folder. |
| **Guest rehearsal authorized** | **YES** (setup and login only) | Bibo may clone, set up `.env.local`, run the app and log in. |
| **External handoff ready** | **NO** | Proposal coding and the handoff message wait for Tony's explicit authorization after review. |

While "External handoff ready" is NO, the guest AI helps with setup and login and stops before any application edit. These lines are changed only by the factory.

## Reading order

1. `vibe_docs/START_HERE.md` — for the person. Setup, login, how to send a proposal.
2. `vibe_docs/GUEST_AI_RULES.md` — for the AI. Read it in full before doing anything else.
3. The assignment, supplied by Tony with the handoff message.

Supporting files: `.env.pilot.example` at the repo root (three variable names, no values) and the proposal form at `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md`, selected through the link in `START_HERE.md`.

## The three rules that apply from the first minute

- **Assigned branch and baseline.** Both come from Tony's handoff message. The person creates the branch once at setup; the AI only verifies it. Missing or different → stop and ask. The AI never creates, switches or deletes branches.
- **Scope.** Frontend proposals in the pilot environment. No merges to `main`, no database migrations, no dependency changes, no cloud or account administration. Proposal PRs are intake; the factory engineers them on its own branch and never merges a VPR directly.
- **Enforcement.** These are workflow instructions. GitHub permissions and branch rules are what actually stop a wrong merge. Nothing in this folder enforces anything by itself.

## Tools

In Claude Code the root `CLAUDE.md` loads automatically. In Cursor, `.cursor/rules/workflow-entry.mdc` points to the same file. Either way the session starts with the boxed workflow question. Answer `1`.
