# QAM_RISK_REQUIREMENTS — `APBM-003-CYBER-PHARMA`

> Instantiated from TEMPLATE SET v0.3 under QAM_PLAYBOOK v1.0 §5, §7, §12, §16. **Owners: §1 QA Lead (standing, reusable — QAM-SR v1.0, adopted 2026-10-14, never edited by a module); §2 Architect (Friday; module-specific risks); §3 QA Executor (Claudy; Q1 reading).** Nothing here is a test plan; Claudy drafts the plan independently from this file, the contract, the source, recon and Cody's claims.

## 1. QA Lead standing requirements (QAM-SR v1.0; adopted by the QA Lead 2026-10-14; reusable without per-module re-review)

| # | Standing requirement | Basis | Applies |
|---|---|---|---|
| SR-1 | Every AC gets a test or a separately authorized applicability ruling; expected results independently derived, never copied from engineering claims | §8 | all |
| SR-2 | Negative controls and negative paths are planned, not only happy paths | §8, §10 | all |
| SR-3 | Evidence: every PASS/FAIL cites an evidence path with command, working directory, exit code and unfiltered output; existence checks precede greps/diffs so vacuous passes are impossible | §10 | all |
| SR-4 | Browser coverage stated as role × route/workflow × data/filter state × viewport × theme, reductions explained; rendered behavior, effective theme, keyboard/focus, errors, loading/stale/rejection states and access denials checked; screenshots supplement assertions | §12 | UI |
| SR-5 | Credentials: declared ignored file only; no `NEXT_PUBLIC_*` reuse; file proved ignored AND untracked; schema validated without emitting values; values never in build/server env, commands, logs, exceptions, screenshots, traces, JSON or ZIPs; a service-role key never substitutes for proving a user's login | §12 | auth |
| SR-6 | Privacy scanners validated with synthetic leak fixtures and clean controls; raw authenticated traces sensitive; only approved sanitized evidence retained | §12 | traces |
| SR-7 | Side effects: backend tests may mutate state or trigger cost; permitted effects and targets declared before execution | §12 | backend |
| SR-8 | Instruments: a helper that cannot fail is not an instrument; attack at least one deliberately; never weaken assertions, add hidden retries, skip tests or change product code to obtain green | §10 | all |
| SR-9 | Result labels are observations (PASS / FAIL / BLOCKED / NOT RUN / ADJUDICATE); an unresolved discrepancy never becomes PASS by relabeling | §11 | all |
| SR-10 | Human checks declared beforehand, grouped near the end, counted; never fake an unattended run | §10 | all |
| SR-11 | Regression scope named by the plan; carried-forward evidence shows applicability and original SHA/attempt | §8, §11 | all |

## 2. Architect module-specific risk input (Friday, 2026-11-05) — input to the plan, not the plan

| # | Risk / what could silently go wrong | Where to look | Why it matters | Suggested evidence shape |
|---|---|---|---|---|
| MR-1 | **Owner reach leaks across accounts.** The extended `my_business_ids()` or an owner policy returns a store of another account (bad join on `account_id`), or an owner's wrapper call for a foreign store returns rows instead of `'not a member of business'` | migrations `0048+`, `pg_policies`, wrapper bodies | D-4 is the new surface; a leak is a tenant breach | direct SQL as each cast token on SCRATCH: every cross-account read returns the refusal; the 320-cell matrix plus the E1 expected-change list, nothing else green |
| MR-2 | **Read-audit closure is only half done.** The app uses wrappers but `authenticated` still holds SELECT on `user_data` (or a policy survived), so a direct read bypasses the audit; or the revoke breaks a legitimate caller the harness/seed used | grants, policies, `../EVIDENCE/E1/RECON_REPORT.md` Q3.5 callers | D-1(a) requires both halves; CF-10 certified only if proven | direct `select from user_data` as owner/admin/member tokens → permission error (not empty set); wrapper calls succeed; service role unchanged |
| MR-3 | **Audit counts assumed, not observed.** "One screen = one event" sneaks in; retries/refetches not counted; admin reads not logged | OAC §4 operation contract | R-09 | per-operation counts observed on SCRATCH and DEV, including a forced retry; counts equal the frozen contract numbers |
| MR-4 | **Policy stacking.** A new owner SELECT policy added beside the old member policy instead of replacing it (Proto 06 F-1/F-8) | `pg_policies` per table/command | two permissive policies silently OR together | catalog assertion: one permissive policy per command per table |
| MR-5 | **Trigger correction not installed on DEV.** Chain adds OD-7 but the installed `handle_new_user()` on DEV still reads metadata (it was created outside the chain) | `pg_get_functiondef` on DEV after apply | CE-2 is the only permanent fix for A-002 | function text equals the migration; a metadata-role signup attempt lands `member` (or is rejected by DA-2 — record which) |
| MR-6 | **Seed is not synthetic.** The generator imports or templates from the legacy demo export; or seeded values are identity-shaped | `scripts/seed/**`, README field-by-field construction | D-2 | code review of the generator's sources; scanner with validated fixture/control; no reference to demo files |
| MR-7 | **"Identical state" graded on the wrong projection.** Comparator hashes timestamps/UUIDs (always differs) or excludes a business column (always matches) | comparator source | AC-201 is only as good as its projection | attack: alter one seeded money value → hash differs; alter `created_at` → hash same |
| MR-8 | **Money-rule fixtures.** Regenerated mocks or seeded rows violate a rule in an edge (negative owed clamped; fee missing on a method; method outside vocabulary; pbm_key typed) | generator self-check; RRM-002 audit script | E-13 | independent recomputation on a sample; audit script 0 failures |
| MR-9 | **Component layer drift.** The swap touches components beyond the O-04 list; or R-016 states still render zeros on error | `git diff` of `src/components`, `src/app` | the Phase 2 seam bet; CRV requires an empty diff outside O-04 | diff limited to the ruled list; forced fetch failure shows the error state |
| MR-10 | **Store picker trusts the client.** The permitted-store list is computed client-side or the wrapper accepts an arbitrary `p_business_id` the user did not get from `my_business_ids()` | service and picker code | spoof = tenant breach | edited-parameter request refused; picker offers only permitted stores for each cast identity |
| MR-11 | **Admin writes still mutate.** A "not available" control still fires a mutation (mock service replaced too eagerly) | `services/adminDemo.ts` write methods | R-06 | click every write control as `OWNER3`; DB unchanged (hash before/after) |
| MR-12 | **Harness rework weakens assertions.** Expected-change list applied by loosening instead of flipping; `prove.mjs` reports a hardcoded count | `scripts/rls-harness/**` diff | SR-8 | diff review of harness changes; one deliberate matrix corruption caught |
| MR-13 | **APPLY ran on the wrong project or twice.** Label-resolved target; second apply partially re-ran | `../EVIDENCE/apply/01`, `05` | shared dev is not disposable | project ref evidence; catalog counts equal rehearsal counts |
| MR-14 | **Deployed revision ≠ certified candidate.** Image built from a later commit; env points at SCRATCH or carries a secret key | `../EVIDENCE/deploy/`, service env var names, client bundle | Gate D | digest ↔ commit; bundle grep for key patterns (pattern scan only); env names |
| MR-15 | **Cast identities missing at checkpoint time** (E-17) | seed run evidence | plan stalls | PF-4.4 before any test names an identity |

### Module-type inputs (QAM_PLAYBOOK §16)

| Type | Supplied |
|---|---|
| BIM row | service/schema contracts: `../CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md`; environment parity: SCRATCH replay ↔ DEV apply evidence; auth/RLS/tenant negatives: MR-1, MR-2, MR-4, MR-10; fixtures: `../CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md`; allowed writes: `QAM_ENTRY.md` §3; rollback: `../APPLY_CHECKPOINT.md` §0.5/§2; regression: `rls:prove`, `audit:prove`, `db-verify`, full Jest suite |
| FFM row (Target One ships UI) | design/data contracts: existing FFM screens unchanged except O-04; frontend states: loading/empty/error/unavailable; responsive/keyboard: 375px + RRM-003 keyboard behaviors; real auth present |

### Browser coverage inputs

| Dimension | Values |
|---|---|
| Roles | `OWNER1`, `OWNER3`, `ADMIN_B2`, `MEMBER_B1`, `MEMBER_B2B3`, `UNRELATED` (`ADMIN_B3` and `OPERATOR` as the plan decides) |
| Routes / workflows | `/auth` sign-in → `/owedbook` (KPIs, four tabs, filters, sort, pager, Summary, PBM picker, store picker) → `(admin)` read views (stores, members, audit, billing status) → write controls (unavailable state) → logout |
| Data / filter states | each permitted store; default + filtered + sorted + paged; empty state (a store with zero rows if the seed provides one); error state (forced fetch failure) |
| Viewports | desktop and 375px (the FFM contract; Gate M) |
| Themes | both approved themes |
| Reductions proposed | full role × store matrix on SCRATCH-equivalent data via DEV; browser matrix at desktop+375px × both themes for `OWNER3`, `MEMBER_B1`, `UNRELATED`; remaining roles at desktop/one theme — reductions justified in the plan |

### Permitted effects and targets

| Effect | Permitted? | Target | Authority |
|---|---|---|---|
| Reads | yes | SCRATCH (direct SQL + wrappers), DEV (wrappers / app paths), STAGING (browser) | `QAM_ENTRY.md` §3 |
| Login / logout (creates session + audit rows) | yes, with cast identities; counts recorded | DEV, STAGING | plan + Director credential file |
| Writes / mutations | SCRATCH only: seed reset/run, from-scratch replay, attack inserts/updates (second admin, billing fence, spoofed params); DEV: none; STAGING: none | SCRATCH | plan |
| Cost-bearing calls | none expected; any discovered → `STOP-AUTHORITY` | — | — |

## 3. Executor's reading (Q1) — contradictions and open risk questions (Claudy)

NOT RECORDED (filled in Q1 without altering §1 or §2; contradictions go to `QAM_RECON_REPORT.md` §4 and, if grading depends on them, to `STOP-CONTRACT`).

*Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3.*
