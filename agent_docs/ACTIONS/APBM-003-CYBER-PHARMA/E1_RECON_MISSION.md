# E1_RECON_MISSION — APBM-003-CYBER-PHARMA (Shot 1 of 4)

**Seat:** Cody, Engineering Executor. **Authorizes:** declared read-only recon and the bounded probes listed in §6. **Does not authorize:** product implementation, migrations on any shared target, resets, seeds on DEV, deployment, Git mutation. **Return:** one consolidated evidence package (§8) and stop for JARVIS's architectural resolution and the Director's E2 approval.
**Method:** APBM_PLAYBOOK v1.0 §5 (comprehensive recon before implementation). Read the actual code and runtime evidence before deciding anything. Documents in this pack are inputs, not proof that the deployed system matches them. Return EVIDENCE / INFERENCE / CLAIM / GAP / QUESTION clearly labelled.

## 0. Before anything: the recon skill

The Director has made an engineering recon skill available in the repository. **Discover it** (look in the repo's skills location(s) and `README.md`/`CLAUDE.md`; do not assume a path), read its SKILL.md, record its actual path, version and declared capabilities in `APBM_SKILLS_MANIFEST.md`, and **use it** for the general recon it covers. This mission adds the APBM-003-specific questions and required outputs below; do not duplicate the skill's whole process in your report, and do not invent capabilities it does not have. If the skill is absent or unreadable, record that as a GAP (owner: Director) and continue with the questions below by hand.

## 1. Repository and instructions

| Q | Record |
|---|---|
| 1.1 | Repo root, remote URL (name only), current branch, full HEAD, `git status --porcelain`, whether the working tree is clean |
| 1.2 | The pack-installation commit and its parent (the baseline). Confirm the parent is the commit shown short as `5234abe`; record the full SHA |
| 1.3 | Installed instruction files at root and in `agent_docs/` (`CLAUDE.md`, `AGENTS.md`, `README.md`, `RUN_NOTES.md`, `RECOVERY.md`, `agent_docs/AUTHORITY/*`, `agent_docs/RESPONSES/`, `agent_docs/SESSIONS/`), and every rule in them that bears on this module (placement rules, protected paths, response-log location, session-log rules). Report any instruction that **conflicts** with this pack (pack-vs-root protocol: root `CLAUDE.md` wins; say where) |
| 1.4 | Available skills (path, name, version) |
| 1.5 | Historical module folders present (`BIM-000..003`, `PROTO06`, `RRM-001..004`) — confirm untouched; locate `BIM-003 …/evidence/WRAPPER_CONTRACT.md`, `RULINGS_ADDENDUM.md`, `RRM_FINDINGS_DISPOSITION_LEDGER.md`, `RRM_DIRECTOR_DECISIONS.md` and record their paths |

## 2. Database state on each authorized target (observed, not reported)

| Q | Record |
|---|---|
| 2.1 | **SCRATCH**: project ref (from env, never the key), whether it is paused, current migration state (list applied versions), catalog counts (tables, policies by table and command, functions, triggers), `handle_new_user()` text via `pg_get_functiondef` |
| 2.2 | **DEV**: the same, read-only. Expected: 2 tables (`user_roles`, `profiles`), 3 policies, the metadata-reading trigger. Record what is actually there. Record whether "Allow new users to sign up" is OFF (DA-2) if observable; otherwise GAP for the Director |
| 2.3 | The migration chain on disk: files `0001`–last, their names; confirm `0028`–`0047` match BIM-003's record; the next free number |
| 2.4 | `db:apply` ritual: what script/command implements it (`package.json`, `scripts/`), its semantics (forward-only? idempotent?), and what the APPLY checkpoint will actually run |
| 2.5 | Env contract: `.env.example`, `.env.local` key **names** (never values), the scratch/replica prefixes (CF-8), `set -a; source .env.local; set +a` requirement |

## 3. Ownership, grants, policies, wrappers, callers (the audit-closure recon)

| Q | Record |
|---|---|
| 3.1 | Exact definitions (via `pg_get_functiondef` on SCRATCH and the migration text): `is_member_of`, `my_business_ids`, `is_admin_of`, `audit_write`, the four `owedbook_*` wrappers; their owners, SECURITY DEFINER flag, `search_path`, EXECUTE grants per role |
| 3.2 | `pg_policies` for every tenant table: policy name, command, roles, `qual`, `with_check`. Identify the BIM-002 member SELECT policy on `user_data` by name |
| 3.3 | Table privileges (`information_schema.role_table_grants`) for `authenticated` and `anon` on `user_data`, `businesses`, `user_businesses`, `accounts`, `subscriptions`, `audit_logs` |
| 3.4 | `accounts` columns; `owner_user_id` FK and its `ON DELETE` action (CF-1); `businesses.account_id` constraint; `user_businesses` constraints (any uniqueness today?) |
| 3.5 | **Every caller** that reads `user_data` directly: grep `src/**`, `scripts/**`, `supabase/**` for `user_data` and classify each hit (app read / harness / seed / migration). This is the list D-1(a) must close |
| 3.6 | The BIM-002 isolation matrix: where it lives, how cells are expressed (320 cells + 28 attacks reported), and the **expected-change list** D-1(a) and D-4 cause (which cells flip, which are new). Produce it as a table |
| 3.7 | `audit_logs` shape (11 columns reported), the `read_page` convention, how `context` is used; the BIM-003 rule on whether reading `audit_logs` is itself logged |
| 3.8 | Draft the audit operation contract rows (OAC §4): for each OwedBook screen operation, which wrapper calls `services/owedbook.ts` and the components actually make, including retries and refetches. Count from code, confirm with one instrumented run on SCRATCH |

## 4. Authentication and privilege boundaries

| Q | Record |
|---|---|
| 4.1 | The auth path files (`src/proxy.ts`, `utils/supabase/**`, `app/api/auth/**`, `protectPage`) and their hashes at baseline (byte-identical requirement) |
| 4.2 | Where `user_roles` is read in the app; confirm no component gates OwedBook tenancy on it (Gap-6) |
| 4.3 | How the app obtains `business_id` (from auth context, never client-chosen) and how the store picker decides which stores to offer (today: mocks; tomorrow: `my_business_ids()` — where does that call land?) |
| 4.4 | Trusted backend access: any server-side admin client remaining after RRM-001 (expected: none in `src/`; seed/system only) — grep `createAdminClient`, `GoTrueAdminApi`, `service_role` |
| 4.5 | Session handling that affects the CRV walk: cookie names, refresh behavior, logout landing (`/auth`, A-13) |

## 5. Frontend state: fixtures, seams, admin screens, tests, harness

| Q | Record |
|---|---|
| 5.1 | `services/owedbook.ts`: every method, its `BACKEND_SWAP_NOTES`, return types; `src/types/OwedBook.ts` mirror of the wrapper shapes; the four NULL-in-v1 fields |
| 5.2 | `services/adminDemo.ts`: every method; which admin screens read which methods; which are reads vs writes (R-06 split); route list under `(admin)` |
| 5.3 | `mocks/owedbook.ts`: fixture count (150 reported), the RRM-002 money-rule audit script path and its current result (149/150 reported) |
| 5.4 | Current fetch/error handling in the OwedBook components: where a failed KPI fetch renders zeros (R-016); the smallest set of files a truthful error/loading/empty state would touch — **propose the O-04 list with file:line** |
| 5.5 | Test board: suites/tests/skipped, lint, tsc, build route count (34/164/0 · 0 · 17 reported) — run them read-only and record actual numbers |
| 5.6 | Harness: `scripts/rls-harness/*`, `scripts/db-verify.mjs`, `npm run rls:prove` / `audit:prove` / `audit:catalog`; CF-8 (hardcoded evidence path, "18 policies" text, env prefix) and CF-9 (`db-verify` AC7 red) as observed |
| 5.7 | Themes and viewports the FFM actually supports (both themes; 375px) and the keyboard behaviors RRM-003 certified (sort headers, drawer, PBM picker) |

## 6. Build and deployment procedure (bounded probes only)

| Q | Record |
|---|---|
| 6.1 | Deployment artifacts in the repo (Dockerfile, cloudbuild, deploy scripts, `DEPLOYMENT_PLAYBOOK.md` applicability); `output: "standalone"` |
| 6.2 | The staging service behind `cyber-pharma.cyberizedev.com`: read-only inspection only if the Director has provided authenticated cloud access for recon (`gcloud run services describe …` read-only); otherwise record what the repo and DNS show and GAP the rest (owner: Director). Record project id, region, service name, current revision/image, env var **names** |
| 6.3 | What Target One's deploy needs that does not exist yet: env var names for DEV Supabase on the service, build config, domain mapping status, the exact approval the Director must give (O-07) |

## 7. Carried findings and closure evidence

For each row of `CONTRACTS/SUCCESSION_RECORD.md` §1: observed on disk / not observed / contradicts the record. In particular: CE-2 trigger text, E-13 fixture result, CF-8 and CF-9 as reproduced, CF-10 callers (3.5), R-016 (5.4), `/moose-portal` absence (grep), E-4 default ACL on SCRATCH.

## 8. What E1 returns (one package)

1. `EVIDENCE/E1/RECON_REPORT.md` — every question above answered with EVIDENCE (command, working dir, output path) / INFERENCE / CLAIM / GAP / QUESTION labels; discrepancies against the pack listed in one table with file:line (these become `APBM_RULINGS.md` §C rows at resolution).
2. `EVIDENCE/E1/EXPECTED_CHANGE_LIST.md` — the matrix cells D-1(a)/D-4 flip (3.6).
3. `EVIDENCE/E1/AUDIT_OPERATION_CONTRACT_DRAFT.md` — OAC §4 rows filled from code (3.8).
4. `EVIDENCE/E1/R016_PROPOSAL.md` — the smallest permitted component change set (5.4).
5. `EVIDENCE/E1/COUNTS.md` — every `<<E1>>` placeholder in the spec and contracts with its disk-derived value.
6. `APBM_EXECUTION_PLAN.md` — the proposed implementation sequence (the eight stages of `APBM_BRIEF.md` §3, re-ordered only with a stated reason), internal checks per stage, effect boundaries, genuine blockers aggregated, and a **realistic schedule** against the 11–15 working-day allowance and the proposed 2026-12-01 Target One date: state whether the date is credible, what it depends on, and what it costs if it is not. Do not reduce acceptance requirements to fit the date.
7. `APBM_SKILLS_MANIFEST.md` updated with the recon skill's verified facts.
8. `APBM_STATE.md` → `E1 COMPLETE — AWAITING RESOLUTION`; `APBM_JOURNAL.md` entry.
9. One indexed ZIP `EVIDENCE/APBM-003-CYBER-PHARMA_E1_REVIEW_01.zip` (`REVIEW_START_HERE.md`, `FILE_INDEX.json` with path/purpose/bytes/SHA-256 per member, exclusions listed; ZIP hash recorded in the return message and the next state entry, never inside the ZIP), plus a short human summary and the exact decisions requested of JARVIS and the Director.

## 9. Stops

Stop the affected question (not the whole recon) and record owner + exact resolution for: wrong repo/branch/HEAD; a credential or secret value that would have to be printed; a required target unreachable; an instruction conflict that changes grading; any step that would mutate product, Git, a shared target or the cloud. Aggregate independent blockers and continue the rest.

🥄
