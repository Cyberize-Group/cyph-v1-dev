# Round-Two VIK Amendment — Implementation and Validation Report

**Date:** 2026-10-14 13:33 · **Branch:** `pilot/vik-round2-onboarding` @ `d2a0d13c8d3644a3171db4539ee0e59978381858` + uncommitted amendment · **Plan:** `response_2026-10-14_124918_round2-vik-plan.md` (now under `agent_docs/RESPONSES/_OLD/`, moved by the Director at 12:59), approved with seven corrections
**Status:** COMPLETE (implementation + bounded validation). **Not** QA certification, merge or release. **External handoff ready: NO.**

## 1. Changed files and rationale

| File | Change | Why |
| --- | --- | --- |
| `CLAUDE.md` | §2 only: kit label "round-two amendment"; human-only branch rule → narrow initial-preparation authorization. §1, §3, §4, §5 byte-identical to HEAD; boxes 60 columns | Lesson 3 (R1) |
| `vibe_docs/README.md` | guest entry rewritten: readiness fields (YES / YES setup+login / **NO**), Director-corrected evidence line, setup vs publication, complete starter, single branch exception, tool status | Lessons 2, 5, 6, 10 (R2) |
| `vibe_docs/START_HERE.md` | short human journey (Hi → 1 → paste starter → place supplied `.env.local` → log in → "close the rehearsal"); no branch/SHA/install commands; Cyberize Engineering contact; public-repo note | Lessons 1, 4, 5, 9 (R3) |
| `vibe_docs/GUEST_AI_RULES.md` | rewritten §1–§8 from the candidate; runtime facts (Next 16.3.7 engines ≥ 20.9.0; factory verified Node 22.14.0; round one 24.16.0; others untested); process-tree shutdown rule added from F04 | Lessons 1–4, 7–11 (R4) |
| `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt` | new, verbatim from the pack (SHA-256 `a89ca716…`); REQUIRED markers only | Lesson 2 (R5) |
| `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | contact → Cyberize Engineering assignment (2 places); tool line → tool / model id / effort, "unknown" allowed | Lessons 5, 6 (R6) |
| `next.config.js` | `agentRules: false` + 2-line comment inside the existing object; format and other keys unchanged | Lesson 7 (R7) |
| `agent_docs/VIK/ADAPTATIONS.md` | round-two section R1–R8, supersession table (A4, A7, A13, A15, A16/A17, A19/A20, 12 Oct release sequence), findings | brief §2 |
| `agent_docs/VIK/round2-evidence/` | new: F02, F03, F04 (+ control diff), F05 (advisories, warnings, full log), checks, baseline lint, `round2_tracked.diff` | brief §5–6 |
| `CHANGELOG.md`, `RECOVERY.md`, `agent_docs/SESSIONS/session_2026-10-14.md`, this file | records | protocol |

Not changed: `.cursor/rules/workflow-entry.mdc` (points only to root `CLAUDE.md`; no conflict), `.env.pilot.example`, `CLAUDE.eng.md`, `CLAUDE.local.md`, `.env*`, `package.json`, `package-lock.json`, `src/**`, the round-one guest VM/clone. No root `AGENTS.md`, no CODEOWNERS, no tooling, no dependency change, no Git mutation. The Director's 12:59 move of six response records into `agent_docs/RESPONSES/_OLD/` is untouched and outside this change.

## 2. Diff / stat (amendment paths only; full diff in `round2-evidence/round2_tracked.diff`, 7 tracked files + 1 new)

```
 .github/PULL_REQUEST_TEMPLATE/vibe_proposal.md |   6 +-
 CLAUDE.md                                      |  15 ++--
 agent_docs/VIK/ADAPTATIONS.md                  |  38 +++++++++
 next.config.js                                 |   3 +
 vibe_docs/GUEST_AI_RULES.md                    | 103 ++++++++++++++++---------
 vibe_docs/README.md                            |  38 ++++-----
 vibe_docs/START_HERE.md                        |  84 +++++---------------
 7 files changed, 155 insertions(+), 132 deletions(-)
```

## 3. Validation evidence

| ID | Result | Evidence |
| --- | --- | --- |
| F01 source grounding | PASS. `CLAUDE.md`/`README.md` matched the pack's snapshot hashes; `START_HERE`/`GUEST_AI_RULES` carried A19–A21 (preserved). Pack manifest 18/18. Factory tree: no managed block, no `AGENTS.md` | plan record; `ADAPTATIONS.md` |
| F02 consistency | PASS. One branch exception (root §2 + rules §3); human doc has no npm/branch/SHA steps; no active Tony-as-contact or Cursor-only assumption; all 26 protected paths retained; factory sections unchanged; no secrets | `F02_consistency.txt` |
| F03 branch-state cases | PASS at command level, scratch repos only: create on clean baseline · continue when already on branch · switch to existing local branch at baseline · STOP on bad SHA, placeholder SHA, missing repo, invalid/protected name, unstaged/staged/untracked work, in-progress merge (redo), remote-only branch, HEAD ≠ baseline · ignored `.env.local` metadata-only, content hash unchanged · resumed proposal not reset. **Limit:** does not prove agent behaviour | `F03_branch_state_fixtures.txt` |
| F04 framework fix | **PASS (attempt 3 is authoritative).** Disposable checkout, nonsecret fixture env. `agentRules:false`: no write under Claude detection (3-A1, 3-A2) or with detection cleared (3-C). Control without the option: block written under Claude detection (3-B, log "Generated CLAUDE.md…", 11-line diff preserved) and under forced `AI_AGENT=cursor` (3-E); no write with detection cleared (3-D). Hash `97b0ee37…` identical before/after every fixed run; no `AGENTS.md` created. Attempts 1–2c are recorded with their faults (no env → instrumentation threw before the step; orphaned servers → later runs aborted) | `F04_startup_instruction_stability.txt`, `F04_control_generated_block.diff` |
| F05 dependency scope | `npm ci` exit 0, 854 packages, manifest/lockfile unchanged. Peer warnings: `react-remove-scroll@2.5.7` wants `react`/`@types/react` ≤18 (ERESOLVE override; installed react 19); 4 deprecations. `npm audit` (read-only): **34** (1 critical, 9 high, 24 moderate) — this run's count, not exploitability | `F05_*` |
| Checks | lint 0 errors / 35 warnings (**pre-existing**: identical 35 at pure HEAD) · tsc clean · jest 34 suites / 164 tests pass · `next build` OK with the new key | `CHECKS_*` |
| Build/startup settings | startup needs 4 variables (see finding 1); no factory `.env.local` used | F04 file |

## 4. Instruction-file hashes (factory tree)

`CLAUDE.md` before this session `4e0f667a…` (= HEAD) → after amendment `97b0ee37…`; no `AGENTS.md` before or after. Startup tests ran only in the disposable checkout.

## 5. Unresolved findings (decisions for Engineering / Tony)

1. **`src/instrumentation.ts` requires `SUPABASE_SECRET_KEY`** (fail-closed) in addition to the three public values. A guest file with only the three public names cannot start the app. Round one must have had the key in the file. Options: relax validation to the three public names (`admin.ts` has zero consumers), or Engineering prepares the file with a value and the kit's "no secret key" line is revised. Not changed here (`src/` protected).
2. **Advisories:** disposition pending. Critical `handlebars` is dev-only (jest tree). High: `next@16.3.7` (fix 16.4.0 = upgrade, separate task), `braces`/`micromatch`/`fast-glob`/`chokidar`/`tailwindcss` (runtime tree, build-time tooling), `source-map-js`. Repairs need dependency changes → separate reviewed task.
3. **Server lifecycle:** `next dev` forks `next-server`; stopping `npm` alone orphans it. Rules §5 now says stop the process tree and verify. The guest agent's tool must support that; G04–G06 verify it.
4. **Peer warning** is `react-remove-scroll` vs React 19, not "React 18.3.1 mismatch".
5. `agentRules:false` does not remove an existing block (16.3.7). The round-one guest clone keeps its +10 lines as evidence; factory cleanup of that clone needs separate authorization.

## 6. Pending (not performed, by design)

G01–G06 fresh Claude session on a new clone at the **amended merged baseline** (box first, option 1, starter, branch prep, placement, login, closeout, failure fixtures) · P01 guest GitHub identity · P02 owner workflow · T01 Cursor · R01 release. "Plain terminal" in F04 is an env-clearing simulation, not a separate terminal.

## 7. Next action for Tony

Review `round2_tracked.diff` and the three guest documents. Decide finding 1 (secret-key requirement) before the next rehearsal, since it determines what the prepared `.env.local` must contain. Then your factory Git sequence (stage the amendment paths and records; leave the `_OLD/` moves as you prefer), PR to `main`, merge, sync, resolve the final SHA, fill the starter.

🔔 GIT REMINDER — uncommitted: 7 modified + `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt`, `agent_docs/VIK/round2-evidence/`, `agent_docs/SESSIONS/session_2026-10-14.md`, this record, `CHANGELOG.md`, `RECOVERY.md`. Your call; I run no git.
