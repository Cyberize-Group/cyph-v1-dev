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
| Guest rehearsal authorized | YES, setup and login only → **YES, local setup, login and frontend proposal work; no publishing** | 2026-10-12, Director Correction 2; widened 2026-10-21 (Stage 4, Director: local proposal work authorized, setup-only gate removed) |
| External handoff ready | NO | awaits Tony's explicit authorization after review; the handoff message then carries the baseline SHA and branch name |

## Release sequence (fixed order)

1. Tony reviews the adapted text.
2. The onboarding set is committed and merged to `main` (the PR template is only served from the default branch).
3. Live rehearsal: Cursor startup shows the box first; option 1 loads `vibe_docs/`; clean-clone `npm ci` on Node ≥ 20.9; login; protected-`main` rejection tests from Bibo's account.
4. Tony authorizes the handoff; the factory sets "External handoff ready: YES"; **that change is committed and merged to `main`**.
5. Only then does Tony record the final handoff baseline SHA (a `main` commit containing the kit, the fixes and the readiness flip) and send the handoff message: baseline SHA, branch name, assignment, three `.env.local` lines (privately).
6. Bibo creates the branch from that baseline; the AI verifies it and records it in the VPR.

---

# Round-two amendment (2026-10-14)

**Label:** VIK v0.3, round-two amendment. No new upstream VIK release exists. **Source:** `CYPH_ROUND2_AMENDMENT_PACK_2026-10-13.zip` (SHA-256 `e3ef46cc52f4462963412fe972da06e5571102a1cace852e22b4ff032d330043`, 18-file manifest verified), kept outside the repo. Candidate text was reconciled against the current files: `CLAUDE.md` and `README.md` matched the pack's review snapshot; `START_HERE.md` and `GUEST_AI_RULES.md` carried the 12 Oct cleanup (A19–A21), preserved in substance below.
**Branch:** `pilot/vik-round2-onboarding` from `d2a0d13c8d3644a3171db4539ee0e59978381858` (round-one baseline, historical). The round-two handoff baseline is resolved by Engineering only after this amendment is merged; it is never written into these files.

## Changes

| # | File | Change | Reason / lesson |
| --- | --- | --- | --- |
| R1 | `CLAUDE.md` §2 | Kit label "round-two amendment"; the human-only branch-check paragraph replaced by a narrow initial-preparation authorization (AI may create/switch to the exact assigned branch from the exact approved baseline only when the starter message authorizes it; otherwise verify only; never reset, discard, create extra branches or infer publication). §1, §3, §4, §5 and all boxes unchanged | Lesson 3 |
| R2 | `vibe_docs/README.md` | Rewritten: three readiness fields (unchanged values YES / YES setup+login / NO), evidence line (round-one install + setup/login completed per agent report and Tony; round-two rehearsal pending; permissions and deployment isolation unverified), local setup vs publication distinguished, complete starter required, single branch exception, tool status (Claude Code next; Cursor bridge installed but untested; Codex unverified) | Lessons 2, 5, 6, 10 |
| R3 | `vibe_docs/START_HERE.md` | Rewritten as the short human journey: Hi → 1 → paste starter → place supplied `.env.local` beside `package.json` → log in → "close the rehearsal". No branch, SHA or install commands for the human. Contact: Cyberize Engineering. Public-repo note kept | Lessons 1, 4, 5, 9 |
| R4 | `vibe_docs/GUEST_AI_RULES.md` | Rewritten (§1–§8): readiness/phase, complete assignment before setup, exact-baseline branch preparation with branch-state cases, install owned by the AI (`npm ci` only, no audit fix/upgrades), metadata-only `.env.local` check, owned dev-server lifecycle with instruction-file comparison after startup, inherited protected paths (+ Next config variants, `AGENTS.md`), future proposal/submission rules, support packet and closeout. Runtime facts added: Next 16.3.7 declares Node ≥ 20.9.0; factory verified runtime Node 22.14.0; round one used Node 24.16.0; other versions untested. §5 closeout: stop the whole process tree (`next dev` forks a `next-server` child; stopping `npm` alone leaves it listening), verify no listener and no project `next-server` process — observed during F04 validation | Lessons 1–4, 7–11 |
| R5 | `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt` | New, verbatim from the pack (`02_STARTER_MESSAGE_TEMPLATE.txt`). Engineering fills every REQUIRED value after the merge; never sent unfinished | Lesson 2 |
| R6 | `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | Contact "Tony's message" → "the Cyberize Engineering assignment" (2 places); tool line → tool / model id / effort with "unknown" allowed. VPR fields, journal, checks, confirmations, intake footer unchanged | Lessons 5, 6 |
| R7 | `next.config.js` | `agentRules: false` added inside the existing exported object with a two-line comment; module format and other keys unchanged. Installed `next@16.3.7` supports the key (config schema) and gates generation on it in `next dev`; this version has no block-removal path | Lesson 7 |
| R8 | `agent_docs/VIK/round2-evidence/` | New: sanitized validation outputs (fixtures, startup hashes, install warnings, advisories, checks) | brief §5–6 |

**Finding, not changed (protected `src/`):** `src/instrumentation.ts` fails closed unless `SUPABASE_SECRET_KEY` is set, together with the three public variables. A guest `.env.local` holding only the three public values cannot start the app. The Engineering-prepared file therefore has to satisfy startup validation, which conflicts with the kit's "no secret/service-role key" line. Resolution is an Engineering decision (relax validation to the three public names, since `admin.ts` has no consumers, or prepare the file differently); recorded in the round-two report.

Not changed: `.cursor/rules/workflow-entry.mdc` (points only to root `CLAUDE.md`; no conflict found), `.env.pilot.example` (names-only reference), `CLAUDE.eng.md`, `CLAUDE.local.md`, `.env*`, `package.json`, `package-lock.json`, `src/**`, the round-one guest VM/clone. No root `AGENTS.md`, no CODEOWNERS, no new tooling.

## Superseded by this amendment

| Entry | Was | Now |
| --- | --- | --- |
| A4 | rehearsal tool is Cursor; report "Cursor / model shown" | Claude Code is the next rehearsal tool (preferred Opus 5.5 / High); report actual tool / model / effort; Cursor bridge installed, untested |
| A7 | the human creates the branch from the baseline; the AI only verifies | the AI may prepare the exact assigned branch from the exact baseline under the narrow authorization in R1/R4; the human never runs branch commands |
| A13 | "Tony" as the guest-facing contact | "Cyberize Engineering" in guest-facing text; Tony's name stays in internal and historical records |
| A15 | the human creates `.env.local` by hand from three lines | Engineering prepares the file privately; the human places it beside `package.json`; the AI checks metadata only |
| A16, A17 | 12 Oct README/readiness wording and the "nothing more" readiness sentence | R2 and R4 §1 |
| A19, A20 | isolation-status and `npm ci` wording in `START_HERE.md` | substance moved to the README evidence line and R4 §4 |
| 12 Oct release sequence | handoff message built by hand after flipping readiness | starter-message release procedure in `STARTER_MESSAGE_TEMPLATE.txt`: merge → resolve final `main` SHA → fill every REQUIRED value → verify branch availability → send. Readiness flip still precedes the baseline |

A1–A3, A5, A6, A8–A12, A14, A18, A21 remain in force.

# Startup correction — Stage A (2026-10-14)

**Director decision (2026-10-14 18:20):** guests may develop complete feature proposals, including new tables and migrations, in a designated sandbox. This is approved in principle; access and implementation are not yet authorized. Guests get no `SUPABASE_SECRET_KEY` and no service-role API key. Work that needs one stops and goes to Cyberize Engineering. **Implemented:** Stage A only (approved 18:52). Plan: `agent_docs/RESPONSES/response_2026-10-14_182943_feature-scope-sandbox-db-plan.md`. Result: `agent_docs/RESPONSES/response_2026-10-14_185835_stageA-startup-fix-result.md`.

| # | File | Change | Reason |
| --- | --- | --- | --- |
| S1 | `src/instrumentation.ts` | `SUPABASE_SECRET_KEY` removed from `REQUIRED_ENV`, with a comment explaining why. The three public settings still fail closed when missing or blank | No runtime consumer, and the file's own rule is "add when consumed in code, not before" |
| S2 | `src/utils/supabase/admin.ts` | Guard rejects whitespace-only URL or key (`?.trim()`); message and behaviour otherwise unchanged | The only privileged reader stays fail-closed, at least as strictly as the old boot check |
| S3 | `src/__tests__/instrumentation.test.ts`, `src/__tests__/supabase-admin.test.ts` | New regression tests (14). They clear the placeholder secret that `jest.setup.ts` injects and restore the env after each test | Red against HEAD (7 fail), green with S1/S2 |
| S4 | `agent_docs/VIK/sandbox-evidence/` | Stage A evidence: npm ci, control/fix/negative startup runs, checks, red/green tests, readers, diff | Disposable clone at `08bfa11`, nonsecret fixtures only |

**Status of the round-two finding above.**
- **Startup half: resolved by S1.** A disposable-clone fixture run shows that a guest `.env.local` with the three public values now boots. The guest kit already says that file "must not contain a service-role or secret key" (`GUEST_AI_RULES.md:44`), so the kit and app startup now agree. A real login is unverified until the guest rehearsal (G04).
- **Sandbox-development half: still open.** Not implemented and not authorized:
  - Stage B
  - the migration runner
  - the provisioning runbook
  - the fourth readiness field
  - the expanded guest rules
  - any sandbox access

  These remain proposals for the next review, and D1–D4 are open.
- **Round one:** under the reported boot conditions, the app started on the guest VM. That indicates only that a nonempty value may have been available for `SUPABASE_SECRET_KEY` there. It does not show that the value was a real secret or where it came from. Its contents remain unknown, and the VM was not inspected or altered.

| Superseded | Was | Now |
| --- | --- | --- |
| Earlier Director permission to supply the sandbox secret key (given outside this session) | Engineering could give a guest the sandbox secret key | Withdrawn. Guests get no secret or service-role key. No tracked file ever applied the permission |

# Stage 2 closure and Stage 3 assignment file (2026-10-19)

**Stage 2 (PR #3) closed.** JARVIS: PASS WITH FINDINGS for candidate `0de73039d312ff49b2a61120f79c0d05521c1522` (limits: no supplied live three-value settings check, no full round-one preservation comparison, no transcripts/reading-order evidence, effort unknown). Tony merged PR #3 on 2026-10-18 with the authorized admin bypass (Director decision, not a second reviewer); merge commit `f4341c24559830d8488f9cf435f311c06a041d60`; Q5 tree comparison against the candidate PASS. Evidence: `agent_docs/VIK/round2-rehearsal/`.

**Stage 3 (Director requirement 2026-10-18):** the guest-pasted technical starter is replaced by an Engineering-prepared assignment file loaded automatically after Hi → 1. Design and corrections: `agent_docs/RESPONSES/response_2026-10-19_104500_stage3-plan-v2.md`.

| # | File | Change | Reason |
| --- | --- | --- | --- |
| T1 | `CLAUDE.md` §2 | "The assignment loads from a file" paragraph with the four source rules; branch-prep paragraph now keyed to the validated assignment | one rule set at the entry point |
| T2 | `vibe_docs/README.md` | Evidence line updated (round two completed, merged `f4341c2`; Stage 3 rehearsal pending); assignment-file paragraph with the four source rules | README is the guest entry and status authority |
| T3 | `vibe_docs/START_HERE.md` | Guest places two files before the first chat, says Hi, chooses 1; no pasting; temporary fallback sentence | nontechnical flow |
| T4 | `vibe_docs/GUEST_AI_RULES.md` §2, §4 | Source rules, read-only Git validation allowed, no tree/branch/install/server change until validation passes, no credentials in the file, ignored/untracked check, never stage; §4 placement sentence; support sentence now says "assignment" | enforcement text for the AI |
| T5 | `vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md` (new) | Fields carried over from the starter plus "Baseline status" and "Guest instructions"; completeness check | Engineering fills it; no REQUIRED markers may remain |
| T6 | `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt` | Header marked SUPERSEDED; accepted only when the file is absent, one cycle; removal scheduled for Stage 4 | compatibility fallback |
| T7 | `.gitignore` | `/VIBE_ASSIGNMENT.local.md` | file stays out of Git; forced add remains possible (documented limit, as for `.env.local`) |
| T8 | `CLAUDE.eng.md` | Post-Merge Sync Rule (Tony's standing rule): preserve pending work, sync local `main` with `origin/main`, verify full SHAs; closeout incomplete until verified; blocked → report and preserve | factory instruction only; guest Git permissions unchanged. `CLAUDE.local.md` must be refreshed by Tony from the master |
| T9 | `agent_docs/VIK/stage3-evidence/` (new) | V1 consistency, V2 disposable-checkout ignore/Git checks, V3/V4 pending cases | V1–V2 are shell checks; V3 fresh-session cases and V4 rehearsal are PENDING (Tony) |
| T10 | `START_HERE.md`, `ASSIGNMENT_FILE_TEMPLATE.md`, `V3_V4_PENDING.md`, `RECOVERY.md`, implementation report | JARVIS corrections 1–5 (2026-10-19): START_HERE opening/next-session wording on the file flow; template baseline rule (external release = merged baseline; explicitly authorized internal rehearsal = frozen pre-merge candidate) with aligned placeholder/completeness check; V3-g added (invalid file + complete valid paste → stop); V3-c/V3-f stop by explicit Engineering instruction after branch verification, V4 keeps the full flow; one combined reviewed commit | review verdict: implementation accepted with corrections; Stage 3 not certified; no merge approval |

Not changed: `src/**`, `package*.json`, `next.config.js`, `.env*`, `CLAUDE.local.md`, `supabase/**`, guest clones. No application test/build run (no application change).

**Stages:** Stage 3 gate = V1–V2 (done), V3 + V4 (pending, Bibo VM), JARVIS review, Tony merge, Q5. **Stage 4 = Cursor (T01)**: internal Cursor preparation may start after Stage 3; Frank's intake answers shape his exact setup and do not block that preparation. Dependency findings and runtime policy remain open; External handoff ready stays NO.

# Stage 3 closure (2026-10-21)

**Stage 3 (PR #4) closed.** Bibo Zorin rehearsal on 2026-10-20 at tested candidate `6f4e004c8a1278458230fc6359844408f841956d`: V3-a…g and V4 PASS (Director-supplied). JARVIS: PASS WITH FINDINGS. Tony merged PR #4 on 2026-10-21 with the authorized admin bypass (Director decision, not a second reviewer); merge commit `386ec443fb544035016457a580c19f4738f0a3d6`; Q5 PASS; local and remote `main` synced. Evidence limits, open runtime/dependency findings and next stages: `agent_docs/VIK/stage3-evidence/00_STATUS.md`.

| # | File | Change | Reason |
| --- | --- | --- | --- |
| T11 | `vibe_docs/README.md` | Evidence sentence: Stage 3 rehearsed and merged (was "rehearsal pending"); status fields unchanged | status authority must not stay stale |
| T12 | `agent_docs/VIK/stage3-evidence/00_STATUS.md` (new), `V3_V4_PENDING.md` header | Results, JARVIS verdict, evidence limits, open findings, gates, next stages; plan marked executed | post-merge record, as for Stage 2 |

**Next stages:** Coach Cowork compatibility trial (then rehearsal if supported) · Frank Cursor T01 (awaiting setup answers) · GitHub P01/P02 after the contribution-lifecycle check · R01. External handoff ready stays NO.

# Stage 4 onboarding simplification (2026-10-21)

**Director direction (2026-10-21, "Implement now"):** Clone → Open → Hi → 1 → the AI proposes a branch name → the guest accepts or changes it → the AI validates, creates and verifies the branch → "What would you like to change?". No assignment file, pasted starter, roster or extra approval machinery. Local frontend proposal work is authorized and the setup-only gate is removed. External handoff ready is unchanged (NO) and kept separate. Install, settings and server are handled when a preview needs them. This supersedes the D1–D8 plan (`response_2026-10-21_144856_stage4-onboarding-recon-plan.md`): the roster and transition gate are dropped.

| # | File | Change | Reason |
| --- | --- | --- | --- |
| U1 | `CLAUDE.md` §2 | Gate = Kit installed + Guest rehearsal authorized; External handoff ready does not gate local work; no assignment file/starter; branch flow by reference to rules §2; scope adds "no push or PR in this kit" | single entry, short |
| U2 | `vibe_docs/README.md` | Field value widened (local proposal work, no publishing); evidence line: Stage 3 flow retired, Stage 4 awaits Tony's manual test; flow summary | status authority |
| U3 | `vibe_docs/START_HERE.md` | Rewritten: clone/open → Hi → 1 → accept or change the branch name → describe the idea; settings file only when a preview needs it; coming back; publishing not switched on | nontechnical flow |
| U4 | `vibe_docs/GUEST_AI_RULES.md` | Rewritten. §2 entry-state table (resume `guest/` branches; stop on dirty `main`, other branch, detached HEAD or operation in progress), default name `guest/frank-<date>` (naming default only; Git author and GitHub identity untouched), slug + `check-ref-format`, collision suffix, create `--no-track` from `origin/main`, baseline recorded in `branch.<name>.vibeBaseline`. §3 proposal work and local checkpoint commits with journal. §4/§5 preview on demand (credential rules unchanged). §6 allowed paths `src/app/**`, `src/components/**` (minus api, (auth), providers, auth components, layouts) + protected list (+ `.gitignore`). §7 publishing closed. §8 support/closeout | enforcement text for the AI |
| U5 | `vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md`, `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt` | Moved to `agent_docs/VIK/retired/` with a README | out of the guest kit, kept for the record |
| U6 | `.gitignore` | Comment only: retired assignment file stays ignored | an old copy is never staged |
| U7 | `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | "Assignment" → "Guest branch"; baseline = recorded `vibeBaseline`; scope question names rules §6 | no assignment exists |

Not changed: `.cursor/rules/workflow-entry.mdc`, `src/**`, `package*.json`, `next.config.js`, `.env*`, `CLAUDE.local.md`, `CLAUDE.eng.md`, guest clones. Checks: path/section references, box lines identical to `HEAD`, no dangling references to retired files, §2 commands dry-run in a scratch repo. Test copy: `/home/moose/VIK_TEST/stage4_2026-10-21_160542/` (local bare origin).

**Manual test (Tony, 2026-10-21): PASS** in the test copy at test-only commit `63bf94080ffb4198784cff5f2f218dd9c4e7123c` (kit edits on `697d8f3`). Hi → 1 → custom name → normalized name shown → confirmed → `guest/qa-my-lovely-branch-21oct2026` created at that commit → work area ready → "What would you like to change?". This verifies the local onboarding flow only. Preview/login and Windows/Cursor remain untested. Post-test polish (Director, no retest): default suggestion `guest/frank-<date>` instead of the Git user name. Open: runtime policy, 33 dependency findings, `CLAUDE.local.md` refresh, Windows/Cursor run.

