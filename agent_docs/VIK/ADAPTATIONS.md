# VIK v0.3 — Installation Ledger and Adaptations

**Installed:** 2026-10-12 by Claude Code (factory), per `agent_docs/RESPONSES/response_2026-10-12_164541_vik-install-plan.md` §4, approved by the Director with Corrections 1 and 2.
**Original source (kept outside the repo):** `~/Downloads/VIK_v0.3.zip`, 11,623 bytes, SHA-256 `840d46c98e666faa2af74edb06b6a96766271a141873cce6314b5cefdebe998e`. Five files, 245 lines.
**Preparation checkpoint:** `2c9fd65` (branch `vibe-pilot-setup`). It is **not** the handoff baseline.

## Where each kit file landed

| Kit file | Installed as | Fidelity |
| --- | --- | --- |
| `00_PACKAGE_NOTE.md` | `agent_docs/VIK/00_PACKAGE_NOTE.md` | verbatim (SHA-256 `fd3f1d70…684b6`) |
| `.env.pilot.example` | `.env.pilot.example` (repo root) | one-word comment change (A18); variable names and values unchanged; original SHA-256 `14ca1d30…dacec` |
| `START_HERE.md` | `vibe_docs/START_HERE.md` | adapted, see below |
| `AGENTS.md` | `vibe_docs/GUEST_AI_RULES.md` | renamed and adapted, see below |
| `.github/pull_request_template.md` | `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | relocated and adapted, see below |

Not installed anywhere: a root `AGENTS.md` (Cursor would auto-load it and bypass the workflow selector).

## Adaptations

| # | File(s) | Original | Adapted | Reason |
| --- | --- | --- | --- | --- |
| A1 | `AGENTS.md` | at repo root, auto-read by the guest tool | `vibe_docs/GUEST_AI_RULES.md`, loaded via root `CLAUDE.md` after option 1; header says so | Cursor auto-loads root and nested `AGENTS.md`; the selector must come first |
| A2 | `START_HERE.md` | "a private copy of the app", "private pilot copy" | new section "This repository is public"; "pilot copy"; public-visibility warnings in rules, template and confirmation | repository is public (GitHub API) |
| A3 | `START_HERE.md` steps 7–8; `GUEST_AI_RULES.md` §Where you work; template "How can we see it" | member account; Admin Portal not visible | admin account; OwedBook, Profile and Admin Portal visible; "Demo · mock data" marker explained; "seeing a screen does not put it in your box" | Bibo's rehearsal account is admin (Director) |
| A4 | `START_HERE.md` §Your AI coder; `GUEST_AI_RULES.md` §Reporting; template | Claude Code `<REQUESTED_CLAUDE_MODEL>` (Opus 5.5) or GPT `<REQUESTED_GPT_MODEL>` (SOL 6.1) | Cursor; report "Cursor" + the model Cursor shows as selected; "unknown" allowed; both fields removed | rehearsal tool is Cursor; obsolete identifiers dropped |
| A5 | `START_HERE.md` §Your AI coder, step 10 | pasted kickoff "Read AGENTS.md, then read my assignment, then start"; `<INSTRUCTION_FILES_PLACED>` | automatic: shared boxed question, answer `1`, AI reads `vibe_docs/` itself; files named: `CLAUDE.md`, `.cursor/rules/workflow-entry.mdc` | choice-first startup is the mechanism |
| A6 | `START_HERE.md` §What this is, §What's isolated; `GUEST_AI_RULES.md` | "a test database that is yours alone" | "a pilot test database with pretend data"; shared if more than one guest is active; "we don't claim more than we checked" kept | one pilot database; isolation is evidence-based |
| A7 | `START_HERE.md` step 3; `GUEST_AI_RULES.md` §Where you work; template Commits | `<HANDOFF_BASELINE_SHA>` field, branch `guest/<name>/<slug>` from it | "Use the exact baseline SHA and branch name supplied in Tony's handoff message. If either is missing, stop and ask." Human creates the branch once; AI verifies with `rev-parse` + `merge-base --is-ancestor` and records the baseline in the VPR | **Correction 1**: no self-referencing SHA, no two-commit chase; baseline supplied separately after the final merge |
| A8 | `GUEST_AI_RULES.md` §Never | `src/middleware.ts`; list "mirrors CODEOWNERS" | `src/proxy.ts` added, `src/middleware.ts` kept; added `_SKILLS/**`, `vibe_docs/**`, `.cursor/**`, `CHANGELOG.md`, `CLAUDE.eng.md`, `CLAUDE.local.md`; "whether or not they exist yet" | actual Next 16 file; new instruction surfaces; restrictions preserved for absent paths. No CODEOWNERS added (Director) |
| A9 | PR template | `.github/pull_request_template.md` (default slot) | `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md`; selected by `?template=vibe_proposal.md` on the compare URL written into `START_HERE.md`; "if the form does not appear, tell Tony" | keep the default slot for the factory; GitHub multi-template directory |
| A10 | `GUEST_AI_RULES.md` §Always; template Checks | `./node_modules/.bin/tsc --noEmit` "(or the repo's own type-check script)" | same command; note that this repo has no type-check script | `package.json` has `lint`, `test`, no `typecheck` |
| A11 | `START_HERE.md` step 1 | `<NODE_VERSION_FLOOR>` | "Node.js 20.9 or newer (the factory uses 22)" | `next@16.3.7` engines `node >=20.9.0`; `package.json` declares none |
| A12 | `START_HERE.md` step 2; `GUEST_AI_RULES.md` | `<PILOT_REPO_URL>` | `https://github.com/Cyberize-Group/cyph-v1-dev.git` | verified remote |
| A13 | all guest files | Frank, Coach, "the Architect via Coach", "He'll bring them to the factory" | Bibo, Tony (Director) | pilot cast |
| A14 | `START_HERE.md` §What happens next; template footer | intake wording | kept and sharpened: frozen at intake, engineered on a factory branch, QA'd, merged by Tony; the VPR is closed with a note, never merged into `main` | Director: proposal PRs are intake |
| A15 | `START_HERE.md` step 5 | three lines from Coach | three lines from Tony; points at `.env.pilot.example`; "do not add `SUPABASE_SECRET_KEY`" | Track A: no privileged key for guests |
| A16 | `vibe_docs/README.md` (Track A file, not a kit file) | setup guide with its own setup steps and a single "Kit status: NOT INSTALLED" line | guest entry: status table with three fields, reading order, three rules, tools; setup detail now only in `START_HERE.md` | **Correction 2**: Kit installed · Guest rehearsal authorized · External handoff ready; installed files are not labelled "not installed"; one setup procedure |
| A17 | `GUEST_AI_RULES.md` new §Readiness first; §Stop and ask | — | AI checks the three status fields; proposal coding needs all three; missing or unverifiable baseline is a stop condition | Correction 2; Correction 1 |
| A18 | `.env.pilot.example` line 2 | "the three lines Coach sends" | "the three lines Tony sends" | pilot cast; names and values untouched (Director cleanup, 2026-10-12) |
| A19 | `START_HERE.md` §What's isolated | "Before you got this page, the factory checked ... connection settings, who can reach the repository, and that nothing in the pilot deploys anywhere" | accurate status: Tony observed pilot login on the factory clone; clean guest-clone configuration, repository permissions and deployment isolation still require rehearsal verification | no promised checks that have not happened (Director cleanup) |
| A20 | `START_HERE.md` step 4 | "`npm ci` installs exactly what we tested with" | "installs dependencies from the committed lockfile. Clean-clone installation and runtime verification are pending" | Director cleanup |
| A21 | `GUEST_AI_RULES.md` §Readiness first | "nothing more. Say so and stop." | handoff NO permits the authorized setup/login rehearsal; the AI stops before the first application edit, not before setup help | Director cleanup |

Kept verbatim in substance: journal rule (`VIBE_JOURNAL.md`, appended before every commit), `npm ci` only, no dependency changes, no `npx` or installs, manual `.env.local` setup by the human, `VPR: ` title prefix, honest checks with "not run" valid, never-touch philosophy, "stop and ask" as the only escalation path, factory handling of proposals, the PR form's questions and confirmation boxes.

## Status fields (owner: factory)

| Field | Value | Set |
| --- | --- | --- |
| Kit installed | YES | 2026-10-12, this install |
| Guest rehearsal authorized | YES, setup and login only | 2026-10-12, Director Correction 2 |
| External handoff ready | NO | awaits Tony's explicit authorization after review; the handoff message then carries the baseline SHA and branch name |

## Release sequence (fixed order)

1. Tony reviews the adapted text.
2. The onboarding set is committed and merged to `main` (the PR template is only served from the default branch).
3. Live rehearsal: Cursor startup shows the box first; option 1 loads `vibe_docs/`; clean-clone `npm ci` on Node ≥ 20.9; login; protected-`main` rejection tests from Bibo's account.
4. Tony authorizes the handoff; the factory sets "External handoff ready: YES"; **that change is committed and merged to `main`**.
5. Only then does Tony record the final handoff baseline SHA (a `main` commit containing the kit, the fixes and the readiness flip) and send the handoff message: baseline SHA, branch name, assignment, three `.env.local` lines (privately).
6. Bibo creates the branch from that baseline; the AI verifies it and records it in the VPR.
