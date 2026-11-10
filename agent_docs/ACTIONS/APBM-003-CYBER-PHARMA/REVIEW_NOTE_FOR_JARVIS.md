# REVIEW NOTE FOR JARVIS — APBM-003-CYBER-PHARMA pack (Friday, 2026-11-05)

**Ask:** architecture review of this package before the Director releases E1. Return findings against file and section, with severity and a proposed correction, the way we did for plan v3.0.

## 1. What is ready

- The parent module: entry routing (both runtimes, byte-identical bodies verified by diff), brief, acceptance spec (44 ACs, DRAFT — CLAIM STATUS), four contracts, rulings lane with R-01..R-10 applied, E1 mission, E2 instructions with the eight stages and the declared APPLY stop, the APPLY checkpoint procedure, state/journal/ledger/skills/retro skeletons, evidence lane.
- The QAM: all twenty-four files instantiated from template set v0.3 with module identity resolved; Architect-owned content filled (entry, preflight rows, fifteen module risks, governing provenance with computed hashes where the file was in hand, packaging exclusions, routing record); every Executor-, Engineer- and Lead-owned field left `NOT RUN` / `NOT RECORDED` / `PENDING`. No PASS, approval, certificate, SHA or credential anywhere.
- Honest registers: `MISSING_INPUTS.md` (16 rows), `PROVENANCE.md`.

## 2. Assumptions I made that you should test

| # | Assumption | Where | If wrong |
|---|---|---|---|
| A-1 | D-1(a)'s database half is implemented as **drop the member SELECT policy on `user_data` + revoke SELECT from `authenticated`**, relying on the wrappers' `postgres` ownership (BYPASSRLS). | OAC §3 | If the wrappers are not owned by `postgres` or the harness's own reads depend on the member policy, the mechanism changes; E1 Q3.1/Q3.5 will show |
| A-2 | Owner reach is delivered by **extending `my_business_ids()`** rather than adding owner branches inside each wrapper, so the four wrappers stay byte-stable except for the helper they already call | OAC OD-1, OD-6 | If BIM-003's wrapper contract pins the helper's semantics, this is an amendment to that contract (append to its addendum, not a rewrite) |
| A-3 | "Replace, don't stack" policies: the owner predicate is folded into the single SELECT policy per table rather than added as a second permissive policy | OAC OD-2 | Non-negotiable per Proto 06 F-1/F-8; flag if you disagree |
| A-4 | Admin read views need **new** security-definer read paths (proposed `admin_*`) rather than reusing `owedbook_*` | OAC §3 | If the admin screens can be served by existing wrappers plus direct policy-governed reads of `businesses`/`user_businesses`, the scope shrinks; E1 Q5.2 decides |
| A-5 | The seed creates auth users through the Auth admin API from a script run **by the Director** at the checkpoint (DEV) and by Cody on SCRATCH; no Moose portal, no public signup | SFC §2 | DA-2 interacts: with signup off, the admin API path must still work (it does; it is not "signup") — E1 confirms |
| A-6 | Eight E2 stages in the order written, with the APPLY stop after stage 5 and stages 6–8 against DEV | E2 §2 | Astra's draft prefers integration evidence on the disposable target first; that is what stages 1–5 are. If you want stage 6's swap also proven on SCRATCH before DEV, add a SCRATCH app-run to stage 5 |
| A-7 | Playwright is the browser matrix tool for Claudy (RRM-era QA lesson) | QAM risks | If the QA Lead wants a different driver, it is a plan matter, not a pack matter |
| A-8 | The delivery-plan cast (page 4) maps to the seven handles in SFC §2, with `OWNER3` admin of exactly one of her three stores | SFC §2 | If Coach's "owner may also be a store's admin" answer differs, one row changes |
| A-9 | 18 working days exist between 2026-11-06 and 2026-12-01; the 11–15 allowance fits on paper only if E1 starts this week and the Director is exclusive | BRIEF §7 | E1 §8.6 is where Cody says so with evidence |

## 3. Decisions needed (not mine to make)

| # | Decision | Owner | Blocks |
|---|---|---|---|
| D-A | D-6 adoption of plan v3.0 | Director | E2 approval |
| D-B | O-02 regenerate mocks (R-05) · O-03 PBM tenancy · O-06 agreed admin read views · O-07 deploy target approval · MI-15 `OPERATOR` in the cast · MI-9 per-store volume | Director at E1 resolution | FINAL stamp |
| D-C | O-04 the permitted R-016 component file list, from Cody's E1 proposal | JARVIS at E1 resolution | FINAL stamp; AC-502/507 |
| D-D | CF-1 `ON DELETE` semantics | JARVIS proposes, Director rules | §C ruling |
| D-E | QA Lead seat holder for this module | Director | before Q1 |
| D-F | Whether the absence of the APBM companion templates (MI-13) is acceptable | JARVIS | review |

## 4. Where I deliberately held back

- No literal SHAs, no project refs, no URLs beyond the publicly known staging host, no key values, no counts I could not derive from disk (`<<E1>>` everywhere a number belongs).
- No test plan: `QAM/QAM_TEST_PLAN.md` is the template; Claudy drafts it. The fifteen risks in `QAM/QAM_RISK_REQUIREMENTS.md` §2 are input, not tests.
- No E2 approval language anywhere; `APBM_STATE.md` says `READY FOR E1` and nothing more.

## 5. What happens after your review

You return findings → I apply the ones that are mine → the Director rules D-A..D-F that are his → `APBM_STATE.md` stays `READY FOR E1` → the Director installs the pack, cuts the branch, confirms P-1..P-4 → pastes `CODY_LAUNCH_PROMPT.md`.

🥄
