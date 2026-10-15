# VIK v0.3 — Inspection and Revised Installation Plan

**Date:** 2026-10-12 16:45 · **Branch:** `vibe-pilot-setup` @ `2c9fd65` + uncommitted Track A · **Mode:** Plan Mode (ZIP inspected in the scratchpad only; nothing installed, nothing adapted)
**Status:** PENDING_APPROVAL

## 1. Source, preserved outside the repo

| Item | Value |
| --- | --- |
| Original | `~/Downloads/VIK_v0.3.zip`, 11,623 bytes, modified 2026-10-12 16:40 |
| SHA-256 | `840d46c98e666faa2af74edb06b6a96766271a141873cce6314b5cefdebe998e` |
| Inspection copy | session scratchpad (outside the repo, discarded with the session) |
| Contents (5 files, 245 lines) | `00_PACKAGE_NOTE.md` (factory-facing) · `START_HERE.md` (human) · `AGENTS.md` (guest AI) · `.github/pull_request_template.md` (VPR form) · `.env.pilot.example` (three names, localhost site URL, no values) |

Recommendation: Tony keeps the ZIP where it is (or copies it to a folder outside any repo). The install records its SHA-256 so the adapted copy can always be diffed against the original.

## 2. What the kit says about itself

The package note (2026-10-09, "pre-rehearsal edition") states the kit is **not onboarding-ready** until its setup fields are filled from real values and a guest launch and a factory launch have been demonstrated. It lists the fields: `<PILOT_REPO_URL>`, `<HANDOFF_BASELINE_SHA>`, `<NODE_VERSION_FLOOR>`, `<REQUESTED_CLAUDE_MODEL>`, `<REQUESTED_GPT_MODEL>`, `<INSTRUCTION_FILES_PLACED>`, the three `.env.local` lines (never in a kit file), the assignment text. Decisions baked in: branch `guest/<name>/<slug>` created by the human from the baseline SHA, AI confirms and never creates or switches; `VPR: ` title prefix; `VIBE_JOURNAL.md` at repo root appended before every commit; `npm ci` only; never-touch list; no `npx`, no installs; "stop and ask through Coach"; proposal PRs are intake, closed with a note, never merged directly.

## 3. Differences between the kit's assumptions and the pilot as it stands (verified unless marked)

| # | Kit assumes | Pilot reality | Source |
| --- | --- | --- | --- |
| D1 | "a private copy", "private pilot copy" | Repository is **public** (`visibility: public`, unauthenticated API) | GitHub API |
| D2 | Guest account is a **member**: lands on OwedBook, Admin Portal not visible | Bibo's account is **admin** with Admin Portal access | Director-reported |
| D3 | Tools: Claude Code with Opus 5.5, or GPT with "SOL 6.1"; identifiers to be confirmed | Rehearsal tool is **Cursor**; the model is whatever Cursor shows as selected. The requested identifiers are obsolete | Director brief |
| D4 | Kickoff by pasting "Read AGENTS.md, then read my assignment, then start" (step 10); AI reads root `AGENTS.md` | Startup is automatic: root `CLAUDE.md` selector (Claude Code), `.cursor/rules/workflow-entry.mdc` → `CLAUDE.md` (Cursor); option 1 loads `vibe_docs/` | Track A, on disk |
| D5 | "a test database that is yours alone" | One pilot database (`vibe-pilot` preview branch, Director-reported). Simultaneous guests would share it. Isolation from the real database is evidence-based, not promised | Director brief |
| D6 | Kit `AGENTS.md` at repo root | Must not be at root: Cursor auto-loads root `AGENTS.md`, which would bypass the selector. Guest AI rules live under `vibe_docs/` and load after option 1 | Cursor docs; brief |
| D7 | `START_HERE.md` at `docs/START_HERE.md` | Under `vibe_docs/` | brief |
| D8 | Never-touch list names `src/middleware.ts`, `next.config.js` | `src/middleware.ts` does not exist; the Next 16 file is `src/proxy.ts` (+ `src/__tests__/proxy.test.ts`). `next.config.js` exists. `src/instrumentation.ts` exists | filesystem |
| D9 | Never-touch list "mirrors Part 1 CODEOWNERS" | No `CODEOWNERS` file in the repo. No `.github/` folder at all | filesystem |
| D10 | Checks: `npm run lint`, `./node_modules/.bin/tsc --noEmit`, `npm test` | Scripts exist: `lint` = `eslint .`, `test` = `jest`; no `typecheck` script; `typescript` is a devDependency so the `tsc` binary is present after `npm ci` | package.json |
| D11 | Node floor "read from the repo" | `package.json` declares no `engines`; `next@16.3.7` declares `node >=20.9.0` (lockfile). Factory runs Node 22.14.0 / npm 10.9.2 | lockfile, local |
| D12 | PR template at `.github/pull_request_template.md` | That path is GitHub's **default** template slot; the brief keeps it free for the factory. No template of any kind exists today | GitHub docs |
| D13 | Guest = Frank, intermediary = Coach, assignment from "the Architect via Coach" | Guest = Bibo; Tony is Director, admin, reviewer and merger | records |
| D14 | Handoff baseline = post-VIK `main` SHA | Not `2c9fd65`: it predates the kit and the setup fixes. Recorded only after they are committed and on `main` | brief |

## 4. Revised installation plan (proposal; nothing executed)

### 4.1 Layout

```
vibe_docs/
  README.md                 ← Track A guide, trimmed to: Kit status · gate · reading order · pointers
  START_HERE.md             ← kit, adapted (human guide)
  GUEST_AI_RULES.md         ← kit AGENTS.md, adapted and RENAMED (see A1)
.github/
  PULL_REQUEST_TEMPLATE/
    vibe_proposal.md        ← kit PR template, adapted (see A9)
.env.pilot.example          ← kit, verbatim (root, as the kit specifies; tracked, not matched by .gitignore)
agent_docs/VIK/
  00_PACKAGE_NOTE.md        ← kit, verbatim (factory-facing provenance)
  ADAPTATIONS.md            ← ledger: original SHA-256, every change A1–A17 with before/after
```

Not installed at root: the kit's `AGENTS.md`. `CLAUDE.md` §2 gains one sentence: once Kit status reads INSTALLED, read `vibe_docs/START_HERE.md` and `vibe_docs/GUEST_AI_RULES.md`, then the assignment. The selector, boxes, manual factory setup and "Guest mode" escape are untouched.

### 4.2 Every adaptation (to be mirrored in `ADAPTATIONS.md`)

| # | File | Change | Why |
| --- | --- | --- | --- |
| A1 | `AGENTS.md` → `vibe_docs/GUEST_AI_RULES.md` | Rename and relocate; header says it loads after option 1 via `CLAUDE.md` | D6. Cursor also applies nested `AGENTS.md` to its subtree; the rename removes any auto-load path |
| A2 | `START_HERE.md` | "private copy" → "a pilot copy in a **public** repository: everything you push, including the PR and journal, is visible to anyone" | D1 |
| A3 | `START_HERE.md` steps 7–8; `GUEST_AI_RULES.md` §Where you work | Account described as **admin**: Admin Portal is reachable and shows the "Demo · mock data" marker; OwedBook and Profile also visible. No member-only navigation promised. Assignment box unchanged | D2 |
| A4 | `START_HERE.md` §Your AI coder; `GUEST_AI_RULES.md` §Reporting; PR form | Tool is Cursor. Report "Cursor / <model Cursor shows as selected>"; "unknown" allowed, guesses not. Remove Opus 5.5, SOL 6.1, GPT and both `<REQUESTED_*_MODEL>` fields | D3 |
| A5 | `START_HERE.md` step 10, §Your AI coder | Remove the pasted kickoff. New text: open the project in Cursor, start a chat, answer `1` at the workflow question; the AI then reads the guest documents itself. `<INSTRUCTION_FILES_PLACED>` → "`CLAUDE.md` at the root, and `.cursor/rules/workflow-entry.mdc` for Cursor" | D4 |
| A6 | `START_HERE.md` §What this is, §What's isolated | "yours alone" → "a pilot test database with pretend data; if more than one guest is active you share it". Keep "we don't claim more than we checked" and list what was checked at install (host, repo access, no deploys) | D5 |
| A7 | `START_HERE.md` step 3; `GUEST_AI_RULES.md` | Keep: the **human** creates `guest/bibo/<slug>` from `<HANDOFF_BASELINE_SHA>` at setup; the **AI** only confirms (`git rev-parse --abbrev-ref HEAD`, `merge-base --is-ancestor`) and never creates or switches. Add: the branch name and slug come from Tony with the assignment | brief: no automatic branch creation; consistent with `CLAUDE.md` §2 |
| A8 | `GUEST_AI_RULES.md` §Never | `src/middleware.ts` → `src/proxy.ts`; add `vibe_docs/**`, `.cursor/**`, `CLAUDE.eng.md`, `_SKILLS/**`; keep every other path | D8, new instruction files |
| A9 | `.github/pull_request_template.md` → `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | GitHub multi-template directory; the default slot stays free. Guests open the PR through the compare URL with `?template=vibe_proposal.md` (exact URL written into `START_HERE.md` and `GUEST_AI_RULES.md`). Template works only once it is on `main` | D12; GitHub docs |
| A10 | `GUEST_AI_RULES.md` §Always; PR form Checks | Keep the three commands as written (all valid here). Note the repo has no `typecheck` script, so the `./node_modules/.bin/tsc --noEmit` form is the one to use | D10 |
| A11 | `START_HERE.md` step 1 | `<NODE_VERSION_FLOOR>` → "Node.js 20.9 or newer (Next 16's declared minimum; the factory runs 22)" | D11 |
| A12 | `START_HERE.md` step 2; `GUEST_AI_RULES.md` | `<PILOT_REPO_URL>` → `https://github.com/Cyberize-Group/cyph-v1-dev.git` | verified remote |
| A13 | all three guest docs | Frank → Bibo; "Coach" → Tony (Director); "the Architect via Coach" → Tony. "Stop and ask" stays the only escalation path | D13 |
| A14 | `START_HERE.md` §What happens next; PR form footer | Keep intake wording and strengthen: a VPR is recorded, frozen at its head, engineered on a factory branch, QA'd, merged by Tony; the VPR itself is closed with a note and never merged into `main` | brief |
| A15 | `START_HERE.md` | `.env.local` step unchanged (hand-made, three lines from Tony, AI never touches it). Point at `.env.pilot.example` and say to leave `SUPABASE_SECRET_KEY` out entirely | brief, Track A |
| A16 | `vibe_docs/README.md` (Track A) | Trim to index + Kit status + gate; setup detail moves to `START_HERE.md` to avoid two setup procedures | one canonical place |
| A17 | `START_HERE.md`, `GUEST_AI_RULES.md` | Keep verbatim: journal rule, no dependency changes, no `npx`/installs, `VPR: ` prefix, honest checks ("not run" is valid), never-touch philosophy, "stop and ask" | brief: preserve |

Everything not listed stays byte-for-byte as shipped.

### 4.3 Order of work (after approval)

1. Write `agent_docs/VIK/00_PACKAGE_NOTE.md` (verbatim) and `ADAPTATIONS.md` (ledger skeleton with the SHA-256).
2. Install the three adapted guest documents and the PR template; `.env.pilot.example` verbatim at root.
3. Trim `vibe_docs/README.md`; add the one-sentence load order to `CLAUDE.md` §2; **Kit status stays NOT INSTALLED** until Tony reviews the adapted text.
4. Document checks: every `<FIELD>` resolved except `<HANDOFF_BASELINE_SHA>`; never-touch paths exist; no values or hostnames in any guest file; `.gitignore` does not swallow `.env.pilot.example`; `./node_modules/.bin/tsc --noEmit`, `npm run lint`, `npm test` run once from the factory clone and their results recorded (factory evidence only).
5. Report, CHANGELOG, RECOVERY, session log. Stop for review.
6. On Tony's sign-off: flip Kit status to INSTALLED, Tony commits and merges to `main`, records the merge SHA as `<HANDOFF_BASELINE_SHA>` in `START_HERE.md`, `GUEST_AI_RULES.md` and `ADAPTATIONS.md`, commits that, and that second SHA is the handoff (the PR template only works from `main`).

## 5. Remaining release fields and checks

| Field / check | Owner | Status |
| --- | --- | --- |
| `<HANDOFF_BASELINE_SHA>` | Tony | **Pending.** Recorded after the kit + setup fixes are on `main`. Not `2c9fd65` |
| Bibo's branch name `guest/bibo/<slug>` and the assignment text | Tony | Pending |
| Three `.env.local` lines delivered to Bibo privately | Tony | Pending |
| Isolation evidence written down (app host is the `vibe-pilot` preview branch; who can push; nothing deploys from the pilot) | Tony + factory at install | Pending; today Director-reported only |
| `main` protection / ruleset, Bibo's rejection tests | Tony | Configured per Director; rejection tests pending; not agent-verified |
| `CODEOWNERS` (the kit's never-touch list was meant to mirror it) | Tony | Absent. Decide: add one for GitHub-side enforcement, or accept instruction-only for the rehearsal |
| PR template on `main` | Tony | Pending the merge |
| Cursor live test: rule loads, selector first, option 1 loads `vibe_docs/`, model shown | Tony | Pending |
| Exercise A: factory walks the guest path on a clean clone (`npm ci` on Node ≥ 20.9, login, checks) | factory | Pending |
| Lockfile: `npm ci` requires the committed lockfile to match `package.json`; both the HEAD and refreshed versions do. Decide which one the handoff carries | Tony | Pending (kept outside the onboarding commit) |
| GitHub↔Supabase automatic sync | Tony | Not configured; the kit does not depend on it |

## 6. Assumptions

1. Tony approves the rename `AGENTS.md` → `GUEST_AI_RULES.md` (the one adaptation that changes a kit filename).
2. The admin account stays admin for the rehearsal; the assignment still names one screen as the box.
3. `.env.pilot.example` at root is acceptable (kit location; tracked; the 10 Oct check already expected it there). Say so if it should live under `vibe_docs/` instead.
4. The package note is kept in `agent_docs/VIK/` even though the repo is public; it contains no secrets.

## 7. Risks

- Public repo: every guest PR, journal and screenshot is world-readable. The adapted text says so, but it cannot stop a leak; the PR confirmation checklist is the last guard.
- Admin account: an admin guest reaches more UI than a member would. The box is still the assignment; the Admin Portal is fixture data in this phase.
- Two instruction surfaces (Claude Code and Cursor) reach the same `CLAUDE.md`; Cursor's handling of "show the box and wait" is unproven until the live test.
- Multi-template PRs depend on the guest using the `?template=` URL; without it the PR body is empty. `START_HERE.md` will carry the exact link.

→ Awaiting approval of §4 (especially A1, A9 and the `.env.pilot.example` location) before installing or adapting anything.
