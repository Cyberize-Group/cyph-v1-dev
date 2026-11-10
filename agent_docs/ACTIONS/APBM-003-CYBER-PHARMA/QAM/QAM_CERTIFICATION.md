# QAM_CERTIFICATION — `APBM-003-CYBER-PHARMA`

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: QA Lead.** This file records Gate Q only. Director acceptance, cleanup acceptance, Gate D and production readiness are separate facts recorded elsewhere.

## 1. Verdict

| Field | Value |
|---|---|
| **Gate Q verdict** | **CERTIFIED WITH LIMITATIONS** |
| Certified product candidate (full SHA) | `dc44429f466dedcf35023342f68624c6cee062f0` on `qa/apbm-003` (repair of original candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1`; repair diff = `src/components/admin-portal/DemoMarker.tsx`, `src/components/admin-portal/BillingScreen.tsx`, `src/components/owedbook/OwedBookContext.tsx` only, per C-03) |
| Baseline | `af2c7e5225d2d78925fd392e29a58b6bde830263` |
| Bound plan | `QAM_TEST_PLAN.md` SHA-256 `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` (AM-1…AM-7), approved `QAM_APPROVAL.md` §1–§2; Q4 scope §4 |
| Contract graded | `APBM_ACCEPTANCE_SPEC.md` + `CONTRACTS/*` at the hashes in `QAM/evidence/identity/01/contract_hashes_as_read.txt`; `E2_AMENDMENT_A01.md` in force (C-01); rulings R-01…R-10, A01–A05, C-01…C-05 |
| Packages adjudicated | Q2/01 `APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip` SHA-256 `a266c5010b0775205bc88ebf6c670eafd4c9829520bf06ed7ad1d8ac594440f2` (406 members) · Q4/01 `APBM-003-CYBER-PHARMA_Q4_REVIEW_01.zip` SHA-256 `0b89e6c9dc932d270d8db82f7915bba6e2b856e0a8719984326deb136eb8cd41` (499 members). Both: every indexed member hash re-verified by the Lead; Lead's independent secret-pattern scan 0 hits. |
| Targets | SCRATCH `ihgcsrypblqkwommrkgj` (destructive proofs, Q2/01) · DEV `yrsuwikjnbmvpznrgydb` (read-only + declared login/audited-read effects) · LOCAL QA build `127.0.0.1:3138` real mode against DEV · STAGING: none (Gate D pending) |
| Matrix | **41 PASS · 0 FAIL · 0 BLOCKED · 3 NOT RUN (AC-701/702/703, no deployment) · 0 ADJUDICATE** of 44 ACs. Q2/01 was 35 / 3 / 1 / 3 / 2; the repair round closed F-01 and F-03; C-04 closed F-08. |
| QA Lead | **Friday** · 2026-11-09 13:30 +06 · Asia/Dhaka |
| QA Executor | Claudy (Claude Code, Fable 5.1) |

### Lead restatements of Executor labels
| AC | Executor | Lead |
|---|---|---|
| AC-401 | PASS (on C-02) | **ACCEPTED LIMITATION** — identity, ledger, catalog and backup-hash clauses proven read-only; the restore-rehearsal clause was **not demonstrated** (`restoreVerified:false`). Accepted by Director ruling C-02, carried to Phase 8. It is counted among the 41 non-failing rows but is not a pass. |

## 2. What is certified

For Target One scope on candidate `dc44429f`, independent QA proved under its own derivations, with every instrument attacked at least once:

- **Tenant isolation and owner reach (D-4):** 320-cell `rls:prove` matrix GREEN with exactly the 13 ruled expectation flips; 7-identity direct-access matrix (172 checks) — every cross-account and cross-store read refused, every permitted wrapper read succeeds; owner reaches own-account stores without junction rows and nothing else.
- **Read-audit closure, both halves (D-1(a)):** zero policies on `user_data`; direct SELECT/INSERT/UPDATE/DELETE by owner/admin/member tokens → SQLSTATE 42501 (not empty set); all app reads through the four `owedbook_*` wrappers and the five `admin_*`/`tenant_stores` definer paths; one `read_page` per committed call, zero on rejection, two on lost-response retry; 18/18 UI operation counts on DEV equal to the source-derived dispatch table.
- **Schema and trigger:** from-scratch replay 0001–0052 idempotent with tamper refusal; 15 permissive policies, at most one per table×command; `handle_new_user()` on SCRATCH and DEV equals the 0049 text, metadata cannot grant privilege; one admin per store enforced (23505).
- **Synthetic seed (D-2):** generator imports nothing from legacy exports; identity scan 0 with poisoned/clean controls; 250 claims obey all seven money rules under QA's own arithmetic; reseed hash-identical with value-vs-timestamp comparator attack; 285 attributed seed audit rows.
- **DEV APPLY re-verified read-only:** ledger 52 = committed file hashes; catalog projection = receipt; 5 pre-existing users preserved + 7 cast.
- **Real app on DEV data:** picker exactness for all 7 identities; totals, tabs, filters, sort, pager, Summary; stale-store fence under inverted response order; parameter spoofing refused with +0 audit; R-016 error/loading/empty states with no silent zeros; admin read views scoped; **write controls produce zero mutations** (table hashes unchanged, no `/rest/v1/<table>` POSTs); truthful real-mode copy on every admin screen after C-03 (both themes, 1440 and 375); mock-mode kill switch renders with 0 RPCs to DEV; production-mode auth walk; 14 viewport×theme cells.
- **Board:** 39 suites / 196 tests, 0 skipped; `tsc` 0 errors; `eslint` 0 errors / 34 warnings; lockfile unchanged; migrations 0001–0047 and the auth path byte-identical to baseline; product change set ⊆ A01 + A02 + C-03.

## 3. Limitations recorded with this certificate

| # | Limitation | Basis | Owner / where it goes |
|---|---|---|---|
| L-1 | **No deployment tested.** AC-701/702/703 and the STAGING half of AC-506 are NOT RUN. Gate D is a separate, Director-released step on the deployed revision. | plan §6 | Director releases; Claudy records `EVIDENCE/deploy/GATE_D.md` |
| L-2 | **Restore rehearsal not demonstrated** on DEV (AC-401 clause). | C-02 | Phase 8 production package |
| L-3 | **Residual non-DML grants** (TRUNCATE/REFERENCES/TRIGGER on `user_data`; INSERT/TRUNCATE/REFERENCES/TRIGGER on `audit_logs`) to `anon`/`authenticated` from the BIM-001 bootstrap default ACL. Not reachable via PostgREST or the app. | F-02; C-05(a) | migration `0053_privilege_hardening` in the next forward-migration module |
| L-4 | **Cross-tab sign-out** not propagated for ≥15 s; enforced on next navigation. Pre-existing; auth path protected. | F-06; C-05(c) | KIP-1 follow-up; TRC §2 tester limitation |
| L-5 | **Credential exposure incident** confined to the Director's local transcript; DB password rotation deferred by the Director. | F-04; C-05(b) | Director; QAM template lesson APBM-L08 |
| L-6 | **Cosmetic:** at 375 px the disabled "Cancel" button on billing rows is clipped at the card edge. | F-10 (Q4) | follow-up register; TRC §2 limitation |
| L-7 | **Records:** manifest §1 and handoff header still read "PENDING Director commit" for the repaired SHA. | F-09 (Q4) | Cody, closeout commit (no retest) |
| L-8 | **Director manual smoke (H-1) DEFERRED — not waived, not PASS.** Independent QA ran before it under the Director's 2026-11-07 sequencing exception. **Director acceptance of Target One is NOT granted by this certificate.** | Director ruling 2026-11-07 | Tony records his smoke and his acceptance separately |
| L-9 | Plan-text inaccuracies corrected by derivation artifacts (F-07) — bound plan not edited retroactively. | AM-1/AM-2 | QAM template set v0.4 |

## 4. Evidence identity

| Item | Path |
|---|---|
| Adjudication Q2/01 | `QAM/HANDOFFS/Q2_ADJUDICATION_01.md` |
| Dispositions | `QAM/FINDINGS.md` §2 (F-01…F-08); F-09, F-10 dispositioned here as L-7, L-6 |
| Evidence matrix | `QAM/AC_EVIDENCE_MATRIX.md` (Q4/01 with Q2/01 carry-forward table) |
| Execution reports | `QAM/QAM_EXECUTION_REPORT.md` (Q2/01, Q4/01) |
| Evidence lane | `QAM/evidence/**` (Q2: 355 files; Q4: +~90; all inventoried, privacy scan 0 hits) |
| Helpers | `QAM/AUTOMATION/**` (18 helpers, each with its attack control) |

## 5. Next facts (not QA's to record)

1. **Cleanup:** Lead's cleanup point — SCRATCH may be left in its reseeded state (disposable); QA `:3138` server stopped; QA temp files shredded; no DEV cleanup required (declared effects only: sessions + `read_page` rows, retained as audit history). Executor records `QAM_CLEANUP_REPORT.md`; Lead accepts.
2. **Closeout commit** (Director): QA lane + F-09 record fix; `QAM_STATE.md` → `CLEANUP ACCEPTED — RELEASED TO CLOSEOUT`.
3. **Director manual smoke + Director acceptance** (Tony, when recovered).
4. **Gate D** (Director-released): deploy `dc44429f` (or its Director-designated successor commit on the engineering line) to `cyber-pharma.cyberizedev.com`; Claudy verifies AC-701/702/703 on the live revision.
5. **Chief Architect review** (JARVIS) of this certificate and the Q4 package.

*Certified by Friday, QA Lead, 2026-11-09 · Asia/Dhaka.* 🥄
