# Guest entry — VIK v0.3, Stage 4 onboarding

Enter only after option **1** at the shared workflow question in root `CLAUDE.md`.

| Field | Value |
| --- | --- |
| Kit installed | YES (VIK v0.3, 2026-10-12; Stage 4 onboarding 2026-10-21) |
| Guest rehearsal authorized | YES — local setup, login and frontend proposal work; no publishing |
| External handoff ready | NO |

**Evidence so far.** Round-one clean-clone installation and setup/login completed on a separate guest clone, based on the agent report and Tony's observations. Round-two setup/login rehearsal completed at candidate `0de73039d312ff49b2a61120f79c0d05521c1522` (JARVIS: PASS WITH FINDINGS, evidence limits recorded in `agent_docs/VIK/round2-rehearsal/00_STATUS.md`), merged to `main` as `f4341c24559830d8488f9cf435f311c06a041d60`. The Stage 3 assignment-file flow (now retired) was rehearsed with Claude Code at candidate `6f4e004c8a1278458230fc6359844408f841956d` (seven assignment guardrail cases and a full setup/login rehearsal; JARVIS: PASS WITH FINDINGS, evidence limits recorded in `agent_docs/VIK/stage3-evidence/00_STATUS.md`) and merged to `main` as `386ec443fb544035016457a580c19f4738f0a3d6`. Stage 4, the flow below with no assignment file, passed Tony's manual onboarding test on 2026-10-21 (Hi → 1 → custom branch name normalized, confirmed and created → "What would you like to change?"). Preview/login and Windows/Cursor are not yet tested. Repository permissions and deployment isolation remain unverified. The pilot database may be shared with other guests.

These values are factory-owned. External handoff ready is the factory's release decision for outside guests; it does not gate local work in this folder.

Read `vibe_docs/START_HERE.md`, then all of `vibe_docs/GUEST_AI_RULES.md`. Everything the AI needs ships in this repository. No assignment file, pasted starter message or guest list is needed.

After reading, follow `GUEST_AI_RULES.md` §2. The AI checks the workspace, then resumes an existing `guest/` branch or proposes a new branch name. The guest accepts it or gives another, and the AI validates, creates and verifies the branch from the latest `origin/main`. Then it asks **"What would you like to change?"** Install, settings and the dev server are handled when a preview needs them (§4–§5), not before the conversation starts.

Proposal work stays local. It is limited to the frontend paths in §6. This kit has no push, pull request, merge or deployment. A future proposal is intake for factory engineering; it is never directly merged into `main`. Branches share a working folder and may use the same pilot database; they are not separate security environments.

Claude Code is the rehearsal tool. Preferred model/effort: Opus 5.5 / High, as specified by Cyberize Engineering. Record actual tool/model/effort without inventing values. Cursor has an installed entry bridge but awaits its own rehearsal. Codex entry support also requires its own verification. Do not label tools interchangeable or tested solely because their names appear here.

Workflow instructions guide the AI. GitHub access/rules and application/database authorization enforce permissions. Selecting guest or factory mode does not grant any of those permissions.
