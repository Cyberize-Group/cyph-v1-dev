# VIK Stage 4 — onboarding simplification: recon and implementation/test plan

> **2026-10-21 16:02 — superseded in part.** The Director ordered implementation without the roster or transition gate ("Implement now"). See `agent_docs/VIK/ADAPTATIONS.md` (Stage 4, U1–U7) and `response_2026-10-21_160700_stage4-implementation.md`. D1–D8 below are historical.

**Status: PLAN, awaiting Director decisions D1–D8 and approval.** Nothing implemented. No commits, pushes or merges. External handoff ready stays **NO**. Stage 3 stays closed.

## 1. Checkout and recon facts

| Item | Result |
|---|---|
| Checkout | `main` @ `697d8f3bc0f6b2a44d98c4bf8acefe39b77fd25f`, clean |
| Pull-before-work | Read-only fetch: `origin/main` identical, nothing to pull. No rule with that name exists in the tracked or local instructions. The nearest is the Post-Merge Sync Rule in `CLAUDE.eng.md`, still missing from `CLAUDE.local.md` |
| Open PRs | none |
| Cursor entry | `.cursor/rules/workflow-entry.mdc` (alwaysApply) points to root `CLAUDE.md`. Exploratory event W01 shows it working on Windows |
| Lockfile | `lockfileVersion` 3; no `engines` field. npm 7+ can read it, so npm 8.7.0 is not an automatic blocker, but it is untested here |
| Active references to the assignment file or pasted starter | `CLAUDE.md` §2; `vibe_docs/README.md`; `START_HERE.md`; `GUEST_AI_RULES.md` §1–§4, §7, §8; `ASSIGNMENT_FILE_TEMPLATE.md`; `STARTER_MESSAGE_TEMPLATE.txt`; `.gitignore` comment; PR template fields "Assignment" and "Baseline commit (the SHA from the … assignment)". Records under `agent_docs/` are history and stay as they are |

**Exploratory event W01 (Director-supplied, preserved; not a test result):**
- Setup: Windows Cursor with Grok 4.6 Medium.
- Entry: Hi, then the workflow selector, then option 1, then guest mode, then a stop for the missing assignment. That stop was correct under Stage 3 rules.
- Incident: the same chat then received an Engineering preparation prompt by mistake. The agent skipped its proposed file write and reported no writes and no Git mutations.
- The session is retired. The runtime was Node 24.22.0 / npm 8.7.0, which is not certified.
- No transcript is in the records. Recorded in today's session log. The implementation will add `agent_docs/VIK/stage4-evidence/W01_exploratory_windows_cursor.md`.

## 2. Target journey

1. The guest clones through Cursor's Clone repo GUI and opens the folder.
2. In a fresh chat the guest says Hi, then chooses 1.
3. Cody reads the tracked guest kit automatically. The guest pastes nothing and places no assignment.
4. Cody checks the starting state, proposes a branch name, and the guest accepts it or gives another.
5. Cody validates the name and creates or verifies the branch.
6. Cody asks for one human action: put the privately sent settings file into the folder.
7. Cody installs, checks settings metadata and starts the app.
8. The guest logs in and confirms the screens.
9. Cody declares readiness, then either opens proposal work or explains the holding state.

## 3. Design answers to the recon questions

### 3.1 Starting commit: selected and recorded automatically
- **Selection.** Cody runs a read-only `git fetch origin` (already allowed in the rules). The baseline is the current `origin/main` commit.
  - It counts as approved by policy: PROTECT MAIN admits only PR merges, and the factory merges only reviewed kit and app states.
  - Cody also requires `origin/main`'s own README fields to say the kit is installed and guest rehearsal is authorized.
  - The guest never supplies or interprets a SHA.
- **No self-reference.** Nothing tracked contains the baseline SHA.
- **Recording (D1).** At branch creation Cody runs `git switch -c <branch> <baseline>`.
  - It then writes local, untracked repository config: `git config branch.<branch>.vibeBaseline <sha>`.
  - Git's branch reflog independently records "Created from …" as a cross-check.
  - The setup closeout reports the SHA. Later, the PR template's baseline field is read from the config value.
- **Local `main` is never moved.** Cody does not pull, fast-forward or switch to `main`. A stale local `main` is harmless because the branch starts from `origin/main`.

### 3.2 Preserving existing work and returning sessions (entry-state table)

Cody classifies the checkout read-only before any change. "Own guest branch" means a `guest/` branch that has the `vibeBaseline` config key.

| State on entry | Action |
|---|---|
| Git operation in progress (merge, rebase, cherry-pick) | Stop with a support packet |
| On `main`, clean, no own guest branches | **Fresh**: propose a name and create the branch from the baseline |
| On `main`, clean, one or more own guest branches exist | List them by name. The guest says "continue X" or "start new". Switching to X is a plain switch on a clean tree. Never auto-pick |
| On `main` with tracked or untracked changes | Stop. Never stash, reset, clean or carry the work onto a branch. Support packet lists the paths |
| On an own guest branch, clean or with changes | **Returning**: verify the baseline is an ancestor and stay on the branch. Changes are preserved and reported, never committed automatically. No new branch |
| On any other branch, or detached HEAD | Stop. Never reuse an unrelated branch. Support packet |
| Old `VIBE_ASSIGNMENT.local.md` present, or a pasted starter | Ignored and left untouched. Cody says once that it is no longer used. It never overrides anything |

Kit drift (D5): `origin/main`'s guest kit can change after a returning branch was created. Cody stops with a packet and does not merge `main` into the branch. The contribution-lifecycle work in P01/P02 resolves this later.

### 3.3 Branch names (D3)
- **Who the guest is.** Cody asks once for the guest's first name and matches it to the roster on `origin/main`. With no match, Cody stops with a short packet and never invents an entry. A returning session reads the handle from the branch name.
- **Pattern:** `guest/<handle>/<topic>`.
  - The handle comes from the guest roster (D2), for example `keyabibo` or `fbtant-jpg`.
  - The topic is a slug of the guest's idea when they have one, or else `workspace-<YYYY-MM-DD>`.
- **Custom names.** Free text is turned into a slug (lowercase, `a-z0-9-`, max 40 characters) and prefixed. The final name is shown for a yes/no.
- **Validation.**
  - `git check-ref-format --branch`.
  - The name must start with `guest/<handle>/`.
  - Rejected names: `main`, `master`, `HEAD`, `develop`, `release*`, `pilot/*`, `records/*`, `vibe-pilot-setup`, `pilot-setup`, or any name a ruleset protects.
  - Values are passed as quoted arguments and never evaluated.
- **Collisions.**
  - An existing local name with Cody's marker becomes a returning-session offer. Without the marker, the name is rejected.
  - An existing name on `origin` after the fetch is rejected.
  - In both cases Cody proposes `-2`, `-3` and so on, and never overwrites or tracks the existing branch.
- **Network (D4).** If the fetch fails, Cody stops. The app needs the network for login anyway, and the collision and baseline checks need it.

### 3.4 Setup readiness and transition to proposal work (D2, D7)
- **Readiness is declared only when all of these hold:**
  - the branch is verified and the baseline is recorded;
  - `npm ci` exits 0 with the lockfile and manifests unchanged;
  - the settings file passes the metadata checks;
  - the server starts and tracked status is unchanged;
  - the guest confirms login, OwedBook, Profile, Admin Portal and the marker.
- **Transition.**
  - Cody reads authorization from `origin/main`, not from the branch copy. That way, a factory flip reaches returning guests without any change to their branch.
  - The source is the roster entry for the guest (phase `setup` or `proposal`) plus the README field "External handoff ready".
  - **Authorized:** in the same session, Cody asks "What would you like to improve?" and works only in the roster's scope profile.
  - **Not authorized:** Cody says setup is complete and proposal work opens when Engineering enables it. Cody checks automatically each time the guest says Hi and chooses 1. This is a known holding state, not a dead end.
- In this stage every roster entry stays at `setup` and External handoff stays NO. The mechanism is built and tested on fixtures only.

### 3.5 Credentials
- The settings file is still delivered privately. Placing it is the guest's one remaining manual step, requested by Cody at the moment it is needed (D8).
- Cody checks metadata only and never reads, creates, invents or requests values. The test login stays separate.
- The roster holds GitHub handles and display names only. The repository is public, so no emails and no secrets.

### 3.6 Publishing
- No change in permissions. Publishing stays unauthorized through onboarding.
- The rules will name P01/P02 as the future gate: verified intended GitHub identity, approved scope and installed contribution rules. Bibo's account `keyabibo` now has Write access, but the publishing path is untested.
- Cody never merges, deploys, force-pushes or uses an admin bypass.

### 3.7 Tool notes (Frank: Windows Cursor)
- In Ask or Plan mode Cody cannot write. It says so in one sentence and asks the guest to switch to Agent mode for setup steps.
- Frequent fresh agents rely on the returning-session row in §3.2.
- Windows settings filename: the file must be `.env.local` exactly, with no `.txt` suffix.

## 4. Proposed file changes

| File | Change |
|---|---|
| `CLAUDE.md` §2 | Replace the "assignment loads from a file" and "initial branch preparation" paragraphs with three short sentences: setup is automatic; follow `vibe_docs/GUEST_AI_RULES.md` §2–§3; never ask the guest for a SHA, assignment or pasted message. §2 gets shorter |
| `vibe_docs/README.md` | Reading order without "assignment"; evidence line adds "Stage 4 pending"; replace the assignment paragraph with the roster pointer. The three status fields stay unchanged |
| `vibe_docs/START_HERE.md` | Rewrite to the §2 journey; next-session text: open the folder, Hi, 1, and Cody resumes; settings-file step at Cody's request; remove the fallback sentence |
| `vibe_docs/GUEST_AI_RULES.md` | §1: transition rule (§3.4). §2 becomes "Starting state and baseline" (§3.1–3.2). §3 becomes "Guest branch" (§3.3). §4: settings request timing. §7: publication gate names P01/P02. §8: packet drops "assignment ID" in favour of branch plus baseline. Prohibitions in §6 are unchanged |
| `vibe_docs/GUESTS.md` (new, if D2 accepted) | Table: display name, GitHub handle, tool, phase (`setup`/`proposal`), scope profile. Initial rows Bibo/`keyabibo` and Frank/`fbtant-jpg`, both `setup` |
| `vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md`, `STARTER_MESSAGE_TEMPLATE.txt` | Retire (D6): move to `agent_docs/VIK/retired/` with a header. Tony runs the move as `git mv` |
| `.gitignore` | Keep `/VIBE_ASSIGNMENT.local.md` ignored so old clones stay safe; update the comment to "retired" |
| `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | "Assignment" becomes "Guest / roster handle"; baseline from `branch.<b>.vibeBaseline`. This file is in the guest-protected scope, so the edit is factory-only |
| `.cursor/rules/workflow-entry.mdc` | No change |
| `agent_docs/VIK/ADAPTATIONS.md`, `CHANGELOG.md`, new `agent_docs/VIK/stage4-evidence/` | Ledger entries, W01 record, fixture builder, test plan and results |

Not touched: `src/**`, `package*.json`, `next.config.js`, `.env*`, `CLAUDE.local.md`, `CLAUDE.eng.md`, `supabase/**`, and every existing clone (the old Windows clone included).

## 5. Acceptance criteria

1. No active guest-facing file asks the guest to receive, fill, paste or place an assignment or starter. An E1 grep check proves it; records are excluded.
2. A fresh entry reaches a created `guest/<handle>/<topic>` branch at the current `origin/main`, with the `vibeBaseline` config set and the reflog agreeing, without the guest typing any technical value.
3. Invalid, protected and colliding names are never created. Existing branches are never overwritten, reset or silently reused.
4. Pre-existing tracked and untracked changes are byte-identical after every case. No stash, reset, clean or `main` checkout ever runs.
5. Readiness appears only after all §3.4 checks. The transition follows `origin/main`'s roster: open proposal work when authorized, the holding message otherwise.
6. Settings are checked by metadata only. No credential is read, requested or written.
7. No publish, merge or deploy happens. Status fields are unchanged and External handoff is NO.
8. `CLAUDE.md` §2 is shorter than today, and START_HERE fits on one screen.

## 6. Isolated test approach (Zorin VM, no Bibo VM)

**Fixture builder** (`agent_docs/VIK/stage4-evidence/build_fixtures.sh`, scratch only):
- It makes a bare local "origin" from the candidate commit.
- Each case gets its own clone under `~/vik-s4-fixtures/<case>/`, with no `CLAUDE.local.md`.
- The `origin` URL stays the canonical GitHub URL. A local `url.<bare>.insteadOf` rule sends fetches to the bare repo, so nothing touches GitHub. Cody could notice that rule; this is a recorded fixture limitation.
- Roster and README variants are fixture-only commits in the bare origin and are never pushed.
- Settings come from a non-secret fixture file, as in Stage A.

**Runner:** an independent fresh Claude Code session per case (Cody, or a fresh Claudy acting as guest), Opus 5.5. The operator gives scripted guest replies. Afterwards one terminal block records the current branch, HEAD, `vibeBaseline`, `git branch -a`, status and preserved-file hashes.

| Case | Setup | Guest says | Expected |
|---|---|---|---|
| L1 fresh, accept | clean clone on `main` | Hi, 1, "yes" | Branch `guest/keyabibo/workspace-<date>` at the baseline, config set, settings requested, `npm ci`, start. Readiness waits on the human login, which the fixture cannot provide; Cody reports technical setup ready and login unverified |
| L2 custom name | clean | Hi, 1, "call it My Cool Idea!!" | `guest/keyabibo/my-cool-idea` shown, confirmed and created |
| L3 invalid/protected | clean | "main", then "../x", then "release/1" | Each rejected in plain words; nothing created; then the accepted default |
| L4 collisions | local unmarked `guest/keyabibo/workspace-<date>`; same name also in origin under a second topic | accept default | Both rejected; `-2` proposed; nothing overwritten |
| L5 dirty `main` | modified tracked file plus untracked file | Hi, 1 | Stop with packet; file hashes unchanged |
| L6 returning | on own branch with uncommitted edit | Hi, 1 | Resumes on the branch; no new branch; edit preserved |
| L7 choose existing | on `main`, two own branches | "continue the second one" | Lists both; switches only on a clean tree |
| L8 unrelated branch | on `feature/x` without marker | Hi, 1 | Stop; branch not reused |
| L9 legacy inputs | stale assignment file plus pasted old starter | Hi, 1, paste | Both ignored; normal flow; file untouched |
| L10 transition | origin roster: `proposal` for one fixture, `setup` for another | finish setup | "What would you like to improve?" versus the holding message |

**Engineering shell checks:** E1 consistency grep for active references; E2 ignore rules unchanged; E3 baseline recoverable from config and reflog in an L1 clone.

Linux results do not certify Windows Cursor. After revision, independent QA and Director integration, Tony preserves the old Windows clone and makes a fresh one for the real Windows run.

## 7. Decisions for the Director

| # | Decision | Recommendation |
|---|---|---|
| D1 | How the baseline is recorded | Local `git config branch.<b>.vibeBaseline`, plus the reflog and the closeout report |
| D2 | How each guest is authorized and identified without an assignment | Tracked roster `vibe_docs/GUESTS.md` with handles only. Alternative: README global field only, with no per-guest phase or name |
| D3 | Branch pattern | `guest/<handle>/<topic>`, default topic `workspace-<date>` |
| D4 | Fetch unavailable | Stop (fail closed) |
| D5 | Kit changed on `main` after a branch was created | Stop with a packet now; solve in P01/P02 |
| D6 | Legacy template and starter files | Move to `agent_docs/VIK/retired/` |
| D7 | Default proposal scope profile (allowed paths when a guest reaches `proposal`) | Needs a Director/JARVIS list. Starting point: `src/app/owedbook/**`, `src/app/profile/**`, `src/components/owedbook/**`, `src/components/common/**`, excluding any `layout.tsx` and §6-protected paths. Mechanism built now; every entry stays `setup` |
| D8 | Settings delivery | The guest still places `.env.local`, requested by Cody when needed. No alternative without secret access |

## 8. Next action

The Director answers D1–D8 and approves, possibly with corrections. Tony then creates `pilot/vik-stage4-onboarding` from `main`; I will supply a fail-closed block. I then implement, run E1–E3, build the fixtures, and hand L1–L10 to an independent session.

## 9. JARVIS package
`/home/moose/Downloads/CYPH_STAGE4_RECON_PLAN_2026-10-21_145022.zip`, SHA-256 `c90085643b88ef816a2a5d978f455422788fa2c8e1852a1f2f616ca1bdb0308f`, 25 files. Secret scan: no matches.
