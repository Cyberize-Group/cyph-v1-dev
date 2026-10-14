# Round-Two VIK Amendment — Reconciliation Findings and Plan

**Date:** 2026-10-14 12:49 · **Branch:** `pilot/vik-round2-onboarding` @ `d2a0d13c8d3644a3171db4539ee0e59978381858` (= `main`) · tree clean except today's session log · **Mode:** Plan Mode, read-only
**Pack:** `~/Downloads/CYPH_ROUND2_AMENDMENT_PACK_2026-10-13.zip` (SHA-256 `e3ef46cc52f4462963412fe972da06e5571102a1cace852e22b4ff032d330043`), unpacked to the session scratchpad outside the repo. `MANIFEST_SHA256.json`: all 18 entries verified.
**Status:** PENDING_APPROVAL

## 1. Reconciliation (F01 source grounding)

| File | Current vs reviewed snapshot (12 Oct 17:05 ZIP) | Consequence |
| --- | --- | --- |
| `CLAUDE.md` | identical (`4e0f667a…`) | candidate's two §2 hunks apply as-is |
| `vibe_docs/README.md` | identical (`80702bd6…`) | candidate replaces it; round-one evidence line added (see 3.2) |
| `vibe_docs/START_HERE.md` | differs: 12 Oct cleanup A19 (isolation status honest) and A20 (`npm ci` wording) | candidate rewrites the file; both points carried into README/ledger, not lost |
| `vibe_docs/GUEST_AI_RULES.md` | differs: A21 (handoff NO permits setup/login) | candidate §1 already states it; preserved |
| `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | not in pack; current text names "Tony's message" (2 places) and "Cursor" as the tool line | scoped edit |
| `.cursor/rules/workflow-entry.mdc` | points only to root `CLAUDE.md` | no conflict found → no edit |
| `agent_docs/VIK/ADAPTATIONS.md` | A1–A21 + 12 Oct release sequence | append round-two section; mark supersessions |
| `next.config.js` | CommonJS, `module.exports = nextConfig`, keys `output`, `reactStrictMode`, `headers()` | add one key |
| Factory tree `CLAUDE.md` | **no** `nextjs-agent-rules` block; no `AGENTS.md` | nothing to clean in the factory; round-one block exists only in the preserved guest clone |

Toolchain: `next@16.3.7` installed; Node 22.14.0, npm 10.9.2 here (round one used Node 24.16). Scripts: `dev`=`next dev`, `lint`=`eslint .`, `test`=`jest`, `build`; no `typecheck` script.

## 2. Framework finding, verified against installed source

- `node_modules/next/dist/server/config-schema.js:496` — `agentRules: z.boolean().optional()`. The option is accepted by 16.3.7.
- `server/lib/start-server.js:419` — in dev only: `if (initResult.agentRules !== false) ensureAgentRulesForDev(dir)`.
- `server/lib/app-info-log.js:125` — writes only when an AI agent is detected (`getAgentName() !== null`) **and** no current block exists.
- `server/lib/generate-agent-files.js` — markers `<!-- BEGIN:nextjs-agent-rules -->`; prefers an existing `AGENTS.md`, else upserts into an existing `CLAUDE.md`, else creates both. No removal path in this version (consistent with the docs dating removal to 16.4).

Conclusion: `agentRules: false` in `next.config.js` is supported and stops the write at the gate. It does not remove any block already present, which is irrelevant for the factory tree (none) and must not be used on the guest clone (preserved evidence).

## 3. Plan — files

### 3.1 MODIFY
1. **`CLAUDE.md` §2 only**: the candidate's two hunks (label "VIK v0.3, round-two amendment"; replace the human-only branch paragraph with the narrow initial-preparation authorization). §1, §3, §4, §5, boxes, local-file handling untouched.
2. **`vibe_docs/README.md`**: candidate text, plus one evidence line preserving A19/A20: round-one setup/login completed on a separate guest clone (agent-reported, Tony-observed); clean-clone install, repository permissions and deployment isolation remain pending. Tool status as in the candidate (Claude Code next; Cursor bridge installed, untested; Codex unverified). Readiness fields unchanged: YES / YES (setup+login) / **NO**.
3. **`vibe_docs/START_HERE.md`**: candidate text (short human journey, Vibe Cody, private-file placement, Cyberize Engineering contact, public-repo note). No branch, SHA or install commands.
4. **`vibe_docs/GUEST_AI_RULES.md`**: candidate text (§1–§8), plus one factual anchor in §4: supported runtime is Node ≥ 20.9 (from `next@16.3.7` engines). A21 substance is candidate §1.
5. **`.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md`**: "Tony's message" → "the Cyberize Engineering assignment" (lines 5, 20); tool line → `<tool> / <model id> / <effort>` with "unknown" allowed. VPR fields, journal, checks, confirmations, intake footer unchanged.
6. **`next.config.js`**: insert `agentRules: false,` with a one-line comment inside the existing object. Module format, wrappers and other keys untouched.
7. **`agent_docs/VIK/ADAPTATIONS.md`**: append "Round-two amendment (2026-10-14)" with entries R1–Rn, and a supersession table: A4 (Cursor as tool), A7 (human creates branch), A13 (Tony as guest-facing contact), A15 (hand-made `.env.local` from three lines), A16/A17 (old README/readiness text), and the 12 Oct release sequence → replaced by the starter-message release procedure. Historical rows untouched.
8. `CHANGELOG.md`, `RECOVERY.md`, session log: records.

### 3.2 CREATE
9. **`vibe_docs/STARTER_MESSAGE_TEMPLATE.txt`**: `02_STARTER_MESSAGE_TEMPLATE.txt` verbatim (engineering template with REQUIRED markers; never sent unfilled).
10. **`agent_docs/VIK/round2-evidence/`**: raw sanitized outputs of the validation (fixture transcripts, startup hashes, `npm ci` warnings, advisory listing, check results). Report in `agent_docs/RESPONSES/`.

### 3.3 WILL NOT TOUCH
`.cursor/rules/workflow-entry.mdc` (no conflict), `.env.pilot.example` (still the names-only reference), `CLAUDE.eng.md`, `CLAUDE.local.md`, `.env*`, `package.json`, `package-lock.json`, `src/**`, `scripts/**`, `supabase/**`, `_SKILLS/**`, nested `CLAUDE.md`/`AGENTS.md`, the round-one guest VM and clone. No root `AGENTS.md`, no CODEOWNERS, no new tooling, no dependency changes, no Git mutations, no cloud/GitHub/Supabase changes, readiness stays NO.

## 4. Plan — validation (bounded; brief §5 and `04_ACCEPTANCE_AND_LESSONS.txt`)

| ID | What | Where | Owner |
| --- | --- | --- | --- |
| F01 | hashes, versions, scripts recorded | done above | agent |
| F02 | consistency read of root §2, three guest docs, starter, template, bridge, ledger: exactly one branch exception, phase gates agree, no human npm/branch/SHA step, no Cursor-only assumption, factory sections intact | read-only pass + grep | agent |
| F03 | branch-state cases in throwaway Git repos in the scratchpad (clean+absent → create; already on branch; existing local at baseline → switch; bad SHA / wrong repo / protected name → no mutation; dirty / in-progress / remote-exists / different HEAD → preserve; ignored `.env.local` metadata-only; resumed branch not reset) | scratchpad fixtures, command level, transcripts saved | agent |
| F04 | disposable checkout of the amended tree in the scratchpad; hash `CLAUDE.md`, confirm no `AGENTS.md`; `npm ci`; start `next dev` under this agent environment, stop, repeat; compare hashes; one control run **without** the option to prove the writer fires here; plain-terminal comparison with the agent-detection environment cleared (labelled as a simulation) | scratchpad | agent |
| F05 | `npm ci` leaves manifest/lockfile unchanged; capture exact peer/deprecation warnings; `npm audit --json` read-only → package, path, advisory, range, runtime/dev exposure, disposition; **no** `audit fix`, no upgrades | scratchpad checkout | agent |
| checks | `npm run build` (validates the config key), `npm run lint`, `./node_modules/.bin/tsc --noEmit`, `npm test`; pre-existing failures recorded as such | scratchpad checkout | agent |
| G01–G06 | fresh Claude session on a new clone without `CLAUDE.local.md` at the amended baseline: Hi → box → 1 → kit; starter → branch prep, install, placement, login, closeout; failure fixtures | needs a fresh session and the merged baseline | Tony (script supplied in the report) |
| P01, P02, T01, R01 | guest GitHub identity, owner workflow, Cursor, release | separate stages | Tony |

## 5. Decisions needed from Tony

1. **F04 login check** needs pilot settings in the disposable checkout. Proposed: copy the factory `.env.local` into the scratchpad checkout **without reading it** (`cp`, metadata only), run the readiness/login check, delete the copy afterwards. Alternative: F04 covers startup and instruction-file stability only, and login is covered by G04. Say which.
2. **Evidence location** `agent_docs/VIK/round2-evidence/` (tracked, sanitized). Alternative: evidence only inside the response record.
3. **Starter template location** `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt` as the brief says (public repo; markers only, no values). Confirm.

## 6. Assumptions

1. "Vibe Cody" is the guest-facing name for the AI, as in the pack.
2. The branch `pilot/vik-round2-onboarding` is the authorized amendment branch (created by Tony, verified clean).
3. The round-one `+10-line CLAUDE.md` diff lives only in the guest clone; it is not captured here because that clone is not touched.
4. The version label is "VIK v0.3 round-two amendment"; no upstream VIK release is claimed.

## 7. Risks

- F04 proves this agent environment and a simulated plain terminal; it cannot prove Bibo's environment. G-series rehearsal remains required.
- `npm audit` needs registry access; if unavailable, triage stays PENDING, never "clean".
- Project checks may surface pre-existing failures unrelated to the config change; they will be recorded, not fixed.
- Rewriting three guest documents wholesale is the largest text change in the pilot so far; F02 is the guard.

→ Awaiting approval of §3 and §4, and answers to §5, before any tracked edit.
