# VIK v0.3 — Installation Report

**Date:** 2026-10-12 16:58 · **Branch:** `vibe-pilot-setup` @ `2c9fd65` (preparation checkpoint; uncommitted work on top) · **Plan:** `response_2026-10-12_164541_vik-install-plan.md` §4, approved with Corrections 1 and 2
**Status:** COMPLETE (documents). Kit installed. Guest rehearsal authorized for setup and login. External handoff NOT ready.

## 1. Files changed

| File | Change |
| --- | --- |
| `vibe_docs/START_HERE.md` | new; kit `START_HERE.md` adapted (78 lines) |
| `vibe_docs/GUEST_AI_RULES.md` | new; kit `AGENTS.md` renamed and adapted (57 lines) |
| `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | new; kit PR template relocated and adapted (53 lines). Default slot `.github/pull_request_template.md` left free |
| `.env.pilot.example` | new at root; verbatim (SHA-256 matches the ZIP copy) |
| `agent_docs/VIK/00_PACKAGE_NOTE.md` | new; verbatim (SHA-256 matches) |
| `agent_docs/VIK/ADAPTATIONS.md` | new; ledger with the ZIP's SHA-256, landing table, A1–A17, status fields, pending list |
| `vibe_docs/README.md` | rewritten as the guest entry: status table, reading order, three rules, tools |
| `CLAUDE.md` §2 (lines 76–94) | reading order after option 1; three-field gate; everything else unchanged |
| `CHANGELOG.md`, `RECOVERY.md`, `agent_docs/SESSIONS/session_2026-10-12.md` | records |

Not created: root `AGENTS.md`, `CODEOWNERS`, `VIBE_JOURNAL.md` (the guest writes it on the proposal branch).

## 2. Adaptations

Seventeen, each recorded with original, adapted text and reason in `agent_docs/VIK/ADAPTATIONS.md`. In short: A1 rename/relocate the AI rules · A2 public repository · A3 admin account and demo marker · A4 Cursor, honest model reporting, obsolete identifiers removed · A5 automatic choice-first startup, no pasted kickoff · A6 shared pilot database, evidence-based isolation · A7 baseline SHA and branch name from Tony's handoff message, AI verifies and records (Correction 1) · A8 protected paths corrected (`src/proxy.ts`) and extended, absent paths still restricted · A9 named PR template with `?template=` link · A10 check commands confirmed against `package.json` · A11 Node 20.9 floor from `next@16.3.7` · A12 repo URL · A13 Bibo/Tony cast · A14 VPR is intake, never merged directly · A15 three env lines, no secret key · A16 README as entry with three status fields (Correction 2) · A17 readiness check and baseline stop-condition in the AI rules.

Preserved: journal, `npm ci` only, no dependency changes, no `npx`, manual `.env.local`, `VPR: ` prefix, honest checks, never-touch philosophy, stop-and-ask, factory handling of proposals, the form's questions and confirmations.

## 3. Document checks

| Check | Result |
| --- | --- |
| Unresolved `<FIELD>` placeholders in guest files | none (the explanatory sentence in `START_HERE.md` reworded) ✅ |
| Links and paths referenced by the guest files and `CLAUDE.md` | all existing targets resolve. Absent names are intentional: original kit filenames in the ledger, `src/middleware.ts` and `layout.tsx` as protected patterns, `VIBE_JOURNAL.md` created by the guest ✅ |
| Reading order | `CLAUDE.md` §2 → `vibe_docs/README.md` → `START_HERE.md` → `GUEST_AI_RULES.md` → assignment; same order stated in README and the rules ✅ |
| Template selection | `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` present; compare link with `?template=vibe_proposal.md` in `START_HERE.md`; default slot free ✅ (works only once on `main`) |
| Protected paths | 22 of 23 exist; `src/middleware.ts` absent and still listed; rules say "whether or not they exist yet" ✅ |
| Instruction conflicts | no root `AGENTS.md`; no guest doc tells the AI to read `AGENTS.md`; no "Coach", "Frank", "yours alone", "private copy", Opus, SOL, GPT or `REQUESTED_` wording left ✅ |
| `CLAUDE.md` integrity | single hunk inside §2; §1, §3, §4, §5 byte-identical to HEAD; all box lines 60 columns; no banner or "Guest mode" line touched ✅ |
| Credentials and hostnames in new files | none ✅ |
| Scope | `CLAUDE.eng.md`, `.env.example`, `.gitignore`, `package.json`, `src/`, `scripts/`, `supabase/`, `agent_docs/ACTIONS/` unchanged; `CLAUDE.local.md` mtime 10 Oct; `.env.local` mtime 16:32 (Director edit, not this session) ✅ |
| `.gitignore` | none of the new files ignored; `.env.pilot.example` tracked as intended ✅ |
| Not run, by instruction | application tests, clean-clone `npm ci`, runtime checks (belong to the rehearsal) |

## 4. Status fields (in `vibe_docs/README.md`)

| Field | Value |
| --- | --- |
| Kit installed | YES |
| Guest rehearsal authorized | YES, setup and login only |
| External handoff ready | NO |

## 5. Next live rehearsal steps

1. **Tony reviews** the adapted text (`vibe_docs/`, the template, the ledger).
2. **Tony commits** the onboarding set and merges it to `main` (without `package-lock.json` and the `_OLD/` moves, which stay separate). The PR template becomes active only then.
3. **Cursor test** (Tony, Hobby account, clean clone without `CLAUDE.local.md`): the rule loads, the boxed question appears first, `1` opens `vibe_docs/README.md`, the AI reports "External handoff ready: NO" and offers setup only; the model shown is noted.
4. **Bibo's clone**: Node ≥ 20.9, `npm ci`, hand-made `.env.local` with three lines, `npm run dev`, login, Admin Portal with the demo marker. Report the result; no fixes.
5. **Protected-`main` tests** from Bibo's account: direct push rejected; merge without review rejected. Tony's merge path works.
6. **Readiness flip**: Tony authorizes; the factory sets "External handoff ready: YES" in `vibe_docs/README.md`; Tony commits that change and merges it to `main`.
7. **Baseline**: only after that merge, Tony records the final handoff baseline SHA (a commit on `main` that already contains the kit, the fixes and the readiness flip) and sends Bibo the handoff message (baseline SHA, branch name, assignment, env lines privately).
8. Bibo creates the branch from that baseline; the AI verifies it and records it in the VPR.

**Order is fixed:** kit + fixes committed and merged → Cursor and clone rehearsals → readiness flip committed and merged → baseline SHA recorded → handoff message. The baseline is never recorded before the readiness change is on `main`.

## 6. Things I did not touch

`CLAUDE.eng.md`, `CLAUDE.local.md`, `.env.local`, `.env.example`, `.gitignore`, `package.json`, `package-lock.json`, the `_OLD/` moves, `src/**`, `scripts/**`, `supabase/**`, nested `CLAUDE.md`/`AGENTS.md`, `_SKILLS/`. No git mutations, no GitHub, Supabase, Cursor or account changes, no CODEOWNERS.
