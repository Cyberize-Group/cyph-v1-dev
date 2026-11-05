# APBM_ENTRY — APBM-003-CYBER-PHARMA (canonical Engineering entry)

Both `CLAUDE.md` and `AGENTS.md` in this folder route here. This file references authority; it grants none. Read `APBM_STATE.md` first, then act only on the recorded state (§3).

## 1. Identity

| Field | Value |
|---|---|
| Module | `APBM-003-CYBER-PHARMA` — Phase 3 completion + Target One |
| Repo / module dir | `cyber-pharma-dev-v1-phase-3` / `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/` |
| Branches | `apbm-003-cyber-pharma` (engineering) · `qa/apbm-003-cyber-pharma` (QA, forward-only, Director-cut at the completed candidate) |
| Baseline | parent of the pack-installation commit (expected `5234abe`; full SHA recorded at E1) |
| Seats | Director Tony · Chief Architect JARVIS (he/him) · Architect Friday (she/her) · **Engineering Executor Cody** · **QA Executor Claudy** · QA Lead (seat; holder recorded when it acts) |

## 2. Read order (Engineering)

`APBM_STATE.md` → this file → `APBM_BRIEF.md` → `APBM_RULINGS.md` → `APBM_ACCEPTANCE_SPEC.md` + `CONTRACTS/*` → `APBM_SKILLS_MANIFEST.md` → the phase file for the recorded state (`E1_RECON_MISSION.md` / `E2_EXECUTION_INSTRUCTIONS.md` / `APPLY_CHECKPOINT.md`) → the repo root `CLAUDE.md` (root rules win on placement of responses/sessions/changelog; report conflicts, do not resolve them yourself).

## 3. Dispatch by recorded state

| `APBM_STATE.md` phase | Next owner | What the arriving Engineer does |
|---|---|---|
| `READY FOR E1` | Cody | Run `E1_RECON_MISSION.md` in full; return the E1 package; set `E1 COMPLETE — AWAITING RESOLUTION`; stop |
| `E1 COMPLETE — AWAITING RESOLUTION` | JARVIS, then Director | Nothing. Report that the E1 package exists and resolution is pending. Do not start E2 |
| `E2 APPROVED` | Cody | Verify the FINAL stamp and the approval reference; run `E2_EXECUTION_INSTRUCTIONS.md` §1 preflight, then stages 1–5 |
| `E2 PAUSED — APPLY CHECKPOINT (Director)` | Director | Nothing. Report the checkpoint is pending and point to `APPLY_CHECKPOINT.md` |
| `APPLY COMPLETE` / `E2 RESUMED` | Cody | Resume at stage 6 against DEV |
| `E2 COMPLETE — AWAITING QA BRANCH` | Director | Nothing. The handoff exists; the Director commits the candidate and cuts `qa/apbm-003-cyber-pharma`. QA then starts from `QAM/QAM_ENTRY.md` |
| `REPAIR RULED — AWAITING COMMIT` (from QAM) | Cody (repair), Director (commit) | Repair only the ruled paths, on `qa/apbm-003-cyber-pharma`, per the consolidated repair instruction in `QAM/FINDINGS.md` §3 and the ruling in `APBM_RULINGS.md` §C; amend `QAM/QAM_MANIFEST.md` §8; stop for the Director's commit. Nobody retests in this state |
| `CLOSEOUT INSTRUCTED` | Cody | Bounded closeout per JARVIS's instruction (journal, ledger, changelog, campaign-journal append, map status line text for the Director); stop for the Director's merge |
| `CLOSED` | — | Show the certificate and merge receipt; do nothing |
| `STOPPED (STOP-*)` | per the stop record | Report the stop, owner and resolution; resume only from the recorded resume point |
| unknown / inconsistent | the owner of the inconsistent record | Return the exact discrepancy; do not guess, do not repair the record |
| wrong seat (QA arriving here) | — | Go to `QAM/QAM_ENTRY.md`; a folder path authorizes Q1 only |

## 4. Protected paths and permitted effects

**Never written by Engineering in this module:** `supabase/migrations/0001`–`0047` · `src/proxy.ts` · `utils/supabase/**` · `app/api/auth/**` · the `protectPage` Server Action · `next.config.*` · `package.json` dependencies and the lockfile (scripts may be added) · `RECOVERY.md` · `agent_docs/SESSIONS/**` · every historical module folder under `agent_docs/ACTIONS/` · `agent_docs/AUTHORITY/**` (the Director stages map/journal changes himself) · `.env*`.
**Permitted effects:** SCRATCH: full destructive proofs. DEV: nothing from an agent, ever; the Director applies at the checkpoint. STAGING: the authorized deploy at stage 8 only. Cloud: read-only recon unless the Director authenticates and approves a scoped action (R-10).

## 5. Writable lanes

`EVIDENCE/**` (engineering evidence, E1/E2 packages) · `APBM_EXECUTION_PLAN.md` · `APBM_ACCEPTANCE_LEDGER.md` · `APBM_JOURNAL.md` · `APBM_SKILLS_MANIFEST.md` (verified facts) · own dated entries in `APBM_STATE.md` · `QAM/QAM_MANIFEST.md` and `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` (Engineer-owned QAM files) · `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` §2 (filled at E2 completion) · product paths named per stage in `E2_EXECUTION_INSTRUCTIONS.md` §2 · repo-governed `agent_docs/RESPONSES/` and `CHANGELOG.md` per root rules.

## 6. Fallback instruction

If a runtime does not auto-load `CLAUDE.md`/`AGENTS.md`: **"Read `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/APBM_ENTRY.md` and act on the recorded state."** No long kickoff prompt carries operating rules; they live here.

🥄
