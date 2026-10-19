🔵 ENTERING PLAN MODE
Task: Stage 3 — auto-loaded Engineering assignment replaces the pasted starter (planning only)

# Stage 3 plan: assignment file instead of a pasted starter

## 0. State inspected (10:08, read-only)

- Branch `pilot/vik-round2-onboarding` @ `db5caf7` (merged PR head). **Local `main` is NOT synced:** local `main` and the `origin/main` tracking ref are still `d2a0d13`; GitHub `main` is `f4341c2`.
- Uncommitted, preserved: `RECOVERY.md`, `session_2026-10-18.md`, `agent_docs/VIK/round2-rehearsal/00_STATUS.md`, `response_2026-10-18_141848_q5-result.md`, new `session_2026-10-19.md`. All record paths; they carry across a branch switch because `db5caf7`'s tree is in `main`.
- Stale docs now false on `main`: `vibe_docs/README.md` "round-two rehearsal remains pending"; `ADAPTATIONS.md` has no Stage 2 section; `CHANGELOG.md` lacks the 15–18 Oct record entries.

## 1. Design

**Mechanism.** Engineering prepares one non-secret file, `VIBE_ASSIGNMENT.local.md`, with the same fields the starter carried (assignment ID, phase, repository, full baseline SHA, assigned branch, authorization lines, tool/model/effort, human checks, delivery notes, support contact). The guest places it beside `package.json` together with `.env.local`, before the first chat. Guest flow becomes: **Hi → 1 → done**; the AI reads the file itself.

**Why a local ignored file, not a tracked one.** A tracked assignment would be public, per-guest, and would change the very SHA it names. An ignored file (`/VIBE_ASSIGNMENT.local.md` added to `.gitignore`) stays out of Git, is delivered through the same private channel as the settings file, and can name the exact baseline.

**Guardrails preserved, unchanged in substance.** GUEST_AI_RULES §2 (complete assignment), §3 (exact baseline/branch, no `main`, no reset), §4 (install, settings metadata only), §5–§8. Only the *source* of the values changes. The template becomes `vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md`; the completeness check and "no REQUIRED markers" rule stay.

**Failure behaviour.** File missing, unreadable, placeholder left, SHA not a commit, branch invalid/`main`, phase not authorized, or **both** a file and a pasted starter that disagree → stop before any Git/npm action with the existing support sentence: "Your workspace is missing something Cyberize Engineering needs to supply. Please forward this:" + exact item. No technical question to the guest.

**Credentials.** The assignment file must contain no credentials. `.env.local` stays metadata-only and unread. If the AI sees a key-like value in the assignment file it stops and reports without reproducing it.

## 2. Files

**Modify (kit + config):** `CLAUDE.md` §2 (assignment loads from the file after kit reading; pasted starter no longer required) · `vibe_docs/README.md` (evidence line: round-two rehearsal completed at `0de7303`, merged as `f4341c2`; assignment-file mechanism; fields unchanged, handoff NO) · `vibe_docs/START_HERE.md` (steps: place two files, say Hi, choose 1; no pasting) · `vibe_docs/GUEST_AI_RULES.md` §2 (+ one sentence in §4 on the file's metadata/credential rule) · `.gitignore` (+`/VIBE_ASSIGNMENT.local.md`).
**Create:** `vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md` (fields from the starter, REQUIRED markers, completeness check).
**Rename/retire:** `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt` → kept one more cycle, marked superseded at the top (so an in-flight pasted starter still works as the fallback when no file exists).
**Records:** `ADAPTATIONS.md` (Stage 2 section: JARVIS PASS WITH FINDINGS, bypass merge, Q5 PASS; Stage 3 section S3-1…; T01 Cursor listed as **Stage 4, pending**) · `CHANGELOG.md` · `RECOVERY.md` · session logs · the pending Q5 records.
**Not touched:** `src/**`, `package*.json`, `next.config.js`, `.env*`, `CLAUDE.local.md`, `CLAUDE.eng.md`, `supabase/**`, round-one/round-two guest clones.

## 3. Verification (small)

- **V1 consistency:** F02-style read of CLAUDE.md §2, README, START_HERE, GUEST_AI_RULES, template: exactly one assignment source order (file first, pasted fallback), one branch exception.
- **V2 command-level fixtures (scratch repos only):** file present/valid → values parsed; file missing; placeholder left; near-miss SHA; branch `main`; file + conflicting paste; `.env.local` present and unread. Expected: no mutation on failures.
- **V3 ignore check:** `git check-ignore -v VIBE_ASSIGNMENT.local.md` in a disposable checkout; `git add -A --dry-run` shows neither local file.
- **V4 project checks:** lint/tsc/jest/build unchanged (no code change expected; run to prove it).
- **V5 live rehearsal (Tony as Bibo, Opus 5.5, new clone `~/NEXT.JS/cyph-v1-dev-r3` at the Stage 3 merge candidate):** Hi → 1 → auto-load → branch `guest/bibo-rehearsal-r3` → install → settings → login → closeout. Plus two fresh-session fixtures: file missing; near-miss SHA. JARVIS reviews; Tony decides. Same gate shape as Stage 2 (Q1–Q5).
- **Stage 4 — Cursor (T01):** explicitly later, after Stage 3 passes; needs Frank's intake answers.

## 4. Branch / PR scope

One branch from synced `main`: `pilot/vik-stage3-assignment-file`. Commit 1: pending Q5 records + stale-doc updates (README evidence line, ADAPTATIONS Stage 2, CHANGELOG). Commit 2+: Stage 3 kit changes + fixtures evidence. One PR to `main`, merge commit, Draft until the Stage 3 gate. The old branch `pilot/vik-round2-onboarding` is kept.

## 5. Decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | File name/location | `VIBE_ASSIGNMENT.local.md` at repo root, beside `.env.local` |
| D2 | Keep pasted starter as fallback for one cycle | yes, marked superseded; remove in Stage 4 |
| D3 | Branch name | `pilot/vik-stage3-assignment-file` |
| D4 | Rehearsal scope V5 | full setup/login + 2 fixtures, Opus 5.5 |
| D5 | Record Stage 2 closure in README/ADAPTATIONS in commit 1 | yes |

## 6. Git preparation (Tony; before any implementation)

Syncs local `main` to the merge commit and opens the Stage 3 branch. The uncommitted records travel as working-tree changes. Expected: first `rev-parse` prints `f4341c24559830d8488f9cf435f311c06a041d60`; `status` still lists the five record paths.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
git switch -c pilot/vik-stage3-assignment-file
git status --short
```

No commit yet: commit 1 happens after I apply the stale-doc updates on approval.

→ Awaiting approval (D1–D5).

```
/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/RESPONSES/response_2026-10-19_100810_stage3-assignment-file-plan.md
```
