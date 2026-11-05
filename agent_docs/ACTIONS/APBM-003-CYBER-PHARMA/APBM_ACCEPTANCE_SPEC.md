> **DRAFT A01 review overlay:** `E2_AMENDMENT_A01.md` proposes the replacement contract and safe APPLY requirements. Not FINAL or released. Its revised AC-104/403/502 and checkpoint rules supersede contradictory draft prose for review.

# APBM_ACCEPTANCE_SPEC — APBM-003-CYBER-PHARMA

**Status:** **DRAFT — CLAIM STATUS.** Stamped FINAL by JARVIS at E1 resolution after every `<<E1>>` count and every reported name is replaced with disk evidence (BIM_PLAYBOOK §6 L1 rule 3; BIM-003 lesson: verify every "new"/"count" claim against disk before it enters an AC). After the stamp, this text is frozen; corrections go to `APBM_RULINGS.md` §C.
**Owner:** Architect (Friday) seeds; JARVIS stamps; Cody maintains the ledger (`APBM_ACCEPTANCE_LEDGER.md`), never this text. **This is the contract QA grades. It is not the test plan** — Claudy authors that independently in Q1.
**Contracts referenced:** `CONTRACTS/OWNERSHIP_AND_AUDIT_CONTRACT.md` (OAC), `CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md` (SFC), `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` (TRC), `CONTRACTS/SUCCESSION_RECORD.md`.
**Environments:** SCRATCH = disposable Supabase project (destructive proofs authorized) · DEV = shared dev project (applied once at the checkpoint; QA reads + bounded login probes) · STAGING = the deployed service (Gate D). Each AC names where it is proven.

## 0. Environment and setup prerequisites (called out first; BIM_PLAYBOOK §8)

| # | Prerequisite | Owner | Evidence |
|---|---|---|---|
| P-1 | Pack installed at `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/`, committed on `apbm-003`, `git status` clean before "go" | Director | commit receipt |
| P-2 | SCRATCH credentials in `.env.local` (throwaway scope only) with their own env prefix (CF-8), rotated since last use | Director | `EVIDENCE/env/ENV_NOTE.md` (key names only) |
| P-3 | DA-2: "Allow new users to sign up" OFF on DEV and SCRATCH, curl proof | Director | `EVIDENCE/apply/DA-2_SUPABASE_SIGNUP_DISABLED.md` |
| P-4 | Recon skill present in the repo; path recorded | Director / Cody | `APBM_SKILLS_MANIFEST.md` |
| P-5 | `.env.qa.local` declared, ignored, untracked, with the key names in `QAM/QAM_ENTRY.md` §4 (created before Q2 release) | Director | QAM preflight PF-4.6 |
| P-6 | After Gate Q, separate staging approval binds certified candidate/digest, service/project/region, DEV backend and config names, authentication and rollback; not needed to execute Gate Q | Director | EVIDENCE/deploy/TARGET_APPROVAL.md |

## 1. Schema, permissions and trigger (AC-1xx) — proven on SCRATCH from a from-scratch replay; re-verified on DEV at the checkpoint

| AC | Requirement (observable) | Negative / no-break | Where |
|---|---|---|---|
| AC-101 | Migrations `0001`–`<<E1: last number>>` replay clean from an empty project; `0001`–`0047` are byte-identical to the baseline (`git diff <baseline> -- supabase/migrations/0001..0047` empty) | a second replay on the same project fails or no-ops exactly as `db:apply` semantics define (never a silent partial) | SCRATCH |
| AC-102 | `is_owner_of_account(account_id)` exists, SECURITY DEFINER, `search_path` pinned, EXECUTE revoked from `anon`; `my_business_ids()` returns junction stores ∪ owned-account stores (OAC OD-1) | a user with no account and no junction gets an empty set | SCRATCH |
| AC-103 | Exactly one permissive policy per operation on each tenant table E1 lists (no stacking); owner reach present on `businesses`, `user_businesses`, `subscriptions` (OAC OD-2); policy count = `<<E1>>` | `pg_policies` shows no table with two permissive policies for the same command | SCRATCH |
| AC-104 | **A01 proposal:** customer account/subscription INSERT, UPDATE and DELETE are denied to owners, store admins and members; billing is read-only, entitlement changes remain trusted-server-only | Safe-field and entitlement-field attempts fail on SCRATCH with independent unchanged-row verification | SCRATCH |
| AC-105 | `handle_new_user()` on the target assigns `member` regardless of signup metadata, copies `full_name`, is SECURITY DEFINER with pinned `search_path` (`pg_get_functiondef` matches the migration text) | a signup payload carrying `role: superadmin` lands as `member` | SCRATCH, then DEV (AC-404) |
| AC-106 | Partial unique index enforces at most one `admin` per `business_id` (OAC OD-4) | second admin insert fails; update creating a second admin fails | SCRATCH |
| AC-107 | `user_roles.superadmin` semantics unchanged: no new policy references `user_roles`; grep of the delta migrations for `user_roles` = 0 hits outside OD-7 | — | SCRATCH |

## 2. Seed and fixtures (AC-2xx) — SCRATCH

| AC | Requirement | Negative / no-break | Where |
|---|---|---|---|
| AC-201 | `seed:reset` + `seed:run` twice yields an identical canonical content hash (SFC §4 projection); the comparison instrument fails when one seeded value is altered | instrument attack recorded | SCRATCH |
| AC-202 | Scripted identity scan over all seeded columns: 0 findings; the scanner fails on the synthetic leak fixture and passes the clean control (SFC §6) | — | SCRATCH |
| AC-203 | The R-08 cast exists exactly: `<<E1: n>>` auth users, each with explicit `user_roles` and `profiles` rows written by the seed (not by trigger metadata); accounts A (1 store), B (3 stores), C (1 store); junction rows as SFC §2 | no cast user has a role from metadata; `OPERATOR` only if authorized | SCRATCH |
| AC-204 | Every seeded `user_data` row satisfies the seven money rules (SFC §3) by the generator's self-check **and** by an independent QA re-computation on a sample of `<<E1>>` rows; distribution covers every status chip, both signs, ≥ `<<E1>>` PBMs, AAC-hit and AAC-miss, with ≥ `<<E1>>` rows per store (> one page) | a deliberately wrong row fails the self-check | SCRATCH |
| AC-205 | (R-05, pending O-02) `src/mocks/owedbook.ts` regenerated from the generator passes the RRM-002 money-rule audit with 0 failures; mock mode renders | if O-02 freezes the mocks: ruled not applicable | local |
| AC-206 | `scripts/seed/README.md` documents field-by-field construction and the reset boundary; SFC §1 provenance | — | repo |
| AC-207 | Seed writes land in `audit_logs` with `actor_role = service_role`, actor NULL, count per run = `<<E1>>`; the seed never touches `audit_logs` directly (TRUNCATE guard untriggered; no DELETE attempted) | reset leaves prior audit rows intact | SCRATCH |

## 3. Read-audit closure, both halves (AC-3xx; D-1(a)) — SCRATCH, re-verified on DEV

| AC | Requirement | Negative / no-break | Where |
|---|---|---|---|
| AC-301 | Application half: `grep` (existence-checked) of `src/**` finds 0 occurrences of a direct `user_data` read (`from('user_data')`, raw SQL, or equivalent E1 enumerates); `services/owedbook.ts` calls only the four wrappers | — | repo |
| AC-302 | **A01 proposal:** owner/admin/member direct user_data SELECT denied with measured permission-error class; same identities can call wrappers for permitted stores. Customer INSERT/UPDATE/DELETE also denied; seven legacy ALLOW mutation cases explicitly replaced by denial/unchanged-state checks on SCRATCH | Trusted service-role seed behavior unchanged; no relaxation of unrelated matrix cells | SCRATCH |
| AC-303 | Owner reach through wrappers (D-4): `OWNER3` → `owedbook_rows(B2)` succeeds and lands a `read_page` row; `OWNER3` → `owedbook_rows(A1)` returns `'not a member of business'`; `UNRELATED` → any A or B store refused | — | SCRATCH |
| AC-304 | Audit operation contract (OAC §4): for each listed operation the observed `read_page` count equals the contract's number, including a forced retry case | a count that differs is FAIL, not reinterpreted | SCRATCH → DEV |
| AC-305 | Admin read paths (`<<E1: names>>`) are SECURITY DEFINER, membership/ownership-checked, each logging one `read_page` with the operation name; `UNRELATED` gets nothing | — | SCRATCH |

## 4. APPLY checkpoint (AC-4xx) — DEV; Director-executed; evidence in `EVIDENCE/apply/`

| AC | Requirement | Where |
|---|---|---|
| AC-401 | DEV identity/current catalog and affected-state inventory verified; backup covers affected public/auth data, schema, grants and ledger; restore and forward-apply/seed/verifier rehearsal on disposable target demonstrated | DEV readiness + disposable rehearsal |
| AC-402 | Tony applies only the verified inventory using rehearsed scripts/apply-forward.mjs design: target fencing, checksum ledger, unapplied files only, atomic migration+receipt per transaction; stop on partial failure per APPLY_CHECKPOINT. Post-apply catalog/ledger matches FINAL counts and definitions. Legacy db:apply is not a DEV command. | DEV |
| AC-403 | Tony seeds once, verifies cast/counts, and runs rehearsed DEV-safe catalog verifier plus separately bounded authenticated read checks. Declare login/logout session effects and successful wrapper audit inserts; no business DML, reset, reseed-by-reset or destructive proof orchestrators in verifier. | DEV |
| AC-404 | `handle_new_user()` on DEV matches the migration text (AC-105 re-check); DA-2 evidence file present | DEV |
| AC-405 | E-4's default-ACL premise re-verified on DEV (what `authenticated`/`anon` can see by default on the new tables = nothing) | DEV |

## 5. OwedBook reads (AC-5xx) — DEV through the real app; browser at desktop and 375px, both themes

| AC | Requirement | Negative / no-break | Where |
|---|---|---|---|
| AC-501 | `services/owedbook.ts` imports nothing from `mocks/owedbook*` (grep = 0) in real mode; every method resolves to a wrapper call; the service contract (method names, return types `src/types/OwedBook.ts`) unchanged | mock mode still works behind its flag (kill switch) | repo |
| AC-502 | **A01 proposal:** component/app delta is limited to the exact permitted paths in E2_AMENDMENT_A01.md, including tenant guard/navigation/store scope, R-016 and unavailable admin controls | Any additional path requires a recorded amendment; protected auth implementation remains byte-identical | repo |
| AC-503 | `OWNER1` sees A1 only; `OWNER3` sees exactly B1, B2, B3 (B2 and B3 by ownership alone); `ADMIN_B2` sees B2 only; `MEMBER_B1` sees B1 only; `MEMBER_B2B3` sees B2 and B3; `UNRELATED` sees C1 only — across KPIs, all four tabs, filters, sort, pager and Summary | no cross-account row anywhere; the store picker offers only permitted stores | DEV + browser |
| AC-504 | Every read in AC-503 lands audit rows per OAC §4 with the acting user's id, the business id and the operation | — | DEV |
| AC-505 | Spoof: a request for a store outside the user's permitted set (edited parameter) is refused with the wrapper's refusal and renders the ruled error state, never another tenant's data | — | DEV |
| AC-506 | `/moose-portal` absent (404) and no public signup route; the auth path files are byte-identical to baseline | — | repo + STAGING |
| AC-507 | R-016 states: a failed KPI/rows fetch renders the ruled error state (never zeros as if real); loading and empty states render; refresh re-fetches and lands new audit rows | — | DEV + browser |

## 6. Admin read views (AC-6xx; R-06) — DEV

| AC | Requirement | Negative | Where |
|---|---|---|---|
| AC-601 | The agreed read views (O-06; proposed: stores, members, audit viewer, billing status) show real rows for the signed-in user's permitted scope: `OWNER3` sees Account B's three stores, their members, B's audit entries and B's billing status read-only | `UNRELATED` sees only Account C; `MEMBER_B1` cannot open the admin views for B2 | DEV + browser |
| AC-602 | Every write control on the admin screens (invite, settings, billing actions) is visibly marked not available in this release and performs no mutation (DB unchanged after click) | — | DEV + browser |
| AC-603 | Audit viewer: visible to owners and store admins only (`is_admin_of` or ownership), never to members; viewing it lands its own audit row per OAC §4 | member denied | DEV |

## 7. Deployment and Gate D (AC-7xx) — STAGING

| AC | Requirement | Where |
|---|---|---|
| AC-701 | The deployed revision is built from the certified candidate (image digest ↔ commit recorded); the service points at DEV (env var names only); no secret or service-role key in the client bundle or response headers | STAGING |
| AC-702 | Sign-in works for every cast identity at the staging URL; AC-503 role boundaries hold through the real browser on the deployed service | STAGING |
| AC-703 | Gate D recorded by the QA Executor in `EVIDENCE/deploy/GATE_D.md` as a separate claim from Gate Q | STAGING |

## 8. Board and regression (AC-8xx)

| AC | Requirement | Where |
|---|---|---|
| AC-801 | `rls:prove` and `audit:prove` green from a QA-controlled run; the isolation matrix equals the certified BIM-002 matrix **plus** the E1 expected-change list (OAC §3) and nothing else; sub-runners write to a QA evidence root (CF-8); `prove.mjs` verdict text reports the actual policy count | SCRATCH |
| AC-802 | `scripts/db-verify.mjs` AC7 re-baselined to the certified policy set: green (CF-9) | SCRATCH |
| AC-803 | Build, typecheck, lint (0 errors), full suite green: suites/tests = `<<E1: baseline numbers>>` or higher with the delta tests added; 0 skipped | repo |
| AC-804 | No dependency changes (lockfile diff empty) unless ruled | repo |

## 9. Handoff (AC-9xx)

| AC | Requirement |
|---|---|
| AC-901 | `QAM/QAM_MANIFEST.md` and `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` complete per QAM_PLAYBOOK §7: every AC has a CLAIM row; change inventory (committed/staged/unstaged/untracked) present; no secret values |
| AC-902 | `TRC` §2 filled: accounts delivered securely (never in the repo), scenarios, limitations list matching actual screens, feedback route |
| AC-903 | `APBM_JOURNAL.md` has one entry per stage; `EVIDENCE/` indexed; `APBM_STATE.md` = `E2 COMPLETE — AWAITING QA BRANCH` |

## 10. Manual-only acceptance points

The Director's eyes-on walk (CRV): sign in as `OWNER3`, `MEMBER_B1`, `UNRELATED` on STAGING, desktop and phone, both themes; confirm AC-503 by eye. Declared once, grouped with the final usable release (QAM §16), counted as one Director touch.

## 11. Known limitations and follow-ups not in this contract

Calculation engine, imports, real data, payments, emails, PDFs, production, Google OAuth, sole-admin recovery/transfer, admin writes, Storage policies, overpayments view, unmatched-PBM queue (`CONTRACTS/SUCCESSION_RECORD.md`; plan v3.0 §16).

🥄
