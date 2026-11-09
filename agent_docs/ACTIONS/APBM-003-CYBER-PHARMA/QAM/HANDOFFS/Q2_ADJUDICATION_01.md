# Q2 ADJUDICATION — `APBM-003-CYBER-PHARMA` · attempt 01

**QA Lead:** Friday · **Date:** 2026-11-09 · Asia/Dhaka · **Package adjudicated:** `QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip`, SHA-256 `a266c5010b0775205bc88ebf6c670eafd4c9829520bf06ed7ad1d8ac594440f2`, 406 members (405 indexed hashes re-verified by the Lead; Lead's own secret-pattern scan 0 hits). Lead-bundle wrapper SHA-256 `8cfebb6cd572b9e1a20ccbef118737e067e3e4086f5a0ba33bb777675ec644ce`.
**Candidate:** `308247a24e6ddd455842da5cd2e21541d7eae2c1` · **Bound plan:** `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` · **Execution HEAD:** `4d64504e…` (product identical to candidate).

## 1. Verdict

**GATE Q: NOT YET CERTIFIED — one consolidated repair round (Q4) required.** No certificate is issued at attempt 01.

The product's security and data posture is proven: tenant isolation, owner reach, read-audit closure (both halves), seed integrity and the real-app behaviour all passed under independent re-derivation with attacked instruments. What blocks certification is narrow and known: one truthful-display defect in two files (F-01), unfilled engineering handoff records (F-03), and one Director-owned blocked check (F-08). Everything else is either an accepted limitation already ruled (AC-401), out of scope until Gate D (AC-7xx), or a follow-up that does not gate Target One.

Lead-verified spot checks: `direct_denials.json` 7/7 identities SQLSTATE 42501, 0 FAIL; attack-flip run 171 PASS / 2 FAIL with exit 1 as required; `rls:prove` ISOLATION PROVEN, 320 cells GREEN, 15 observed policies; corrupted-expectation run RED exit 3; Jest 39/39 suites, 196/196 tests; sign-ins 44 (OWNER3 26, MEMBER_B1 9, UNRELATED 4, MEMBER_B2B3 2, others 1); derivation artifacts present for all ten derived value sets.

## 2. Dispositions (FINDINGS.md §2 — QA Lead)

| Finding | Class (final) | Severity (final) | Disposition | Inherited-condition evidence | Affects verdict? | Routed to |
|---|---|---|---|---|---|---|
| F-01 | **acceptance failure** (product defect) | medium | Admin headers "Demo · mock data" and Billing "no real charge … in this demo" rendered over live DEV rows. A01-7 and the TRC §2 limitations promise truthful synthetic-data labelling; describing live rows as mock is the opposite. **AC-601 → FAIL; AC-602 PASS stands (label, not mutation); AC-902 truthful-display part → FAIL.** Repair in this module. | pre-known at Q1 (recon R-5); files outside A01 allowlist — scope amendment required before edit | **YES** | JARVIS §C scope amendment C-03 → Cody repair → Q4 |
| F-02 | proven pre-existing defect → follow-up finding | low | `anon`/`authenticated` hold TRUNCATE/REFERENCES/TRIGGER on `user_data` (and INSERT/TRUNCATE/REFERENCES/TRIGGER on `audit_logs`) from the BIM-001-era bootstrap default ACL. Not reachable through PostgREST or the app; needs a direct SQL session as the role, i.e. database credentials. AC-405's literal clause holds. **Not charged to this module; not repaired in this round** (would require a new migration and a second shared-DEV APPLY). Recorded as a hardening obligation with Director risk acceptance for Target One. | `evidence/schema/01/catalog.json` T-11e; `evidence/apply/01/t30_t31_results.json` plan-strict row; grants identical on DEV and at the 0047 control state | no (risk-accepted; recorded in certificate limitations) | Director (accept for Target One) → next forward-migration module (`0053_privilege_hardening`) — APBM-007 or earlier if Director prefers; journal lesson APBM-L07 |
| F-03 | acceptance failure (records) | medium | `QAM_MANIFEST.md`, `ENGINEERING_HANDOFF.md`, TRC §2, journal stage 8, `APBM_STATE.md` literal unfilled. **AC-901/902/903 FAIL stands.** Records only; no product code. | expected per plan §1 (R-1) | **YES** (AC-9xx) | Cody fills → Director commits → Q4 T-50 |
| F-04 | observation (QA process incident) | medium (handling) · exposure local-only | Executor's debug command echoed both DB connection strings into the local Claude Code transcript. Nothing in any QAM artifact (privacy scan 0 hits; Lead scan 0 hits). **Required Director actions:** rotate the SCRATCH and DEV database passwords; regenerate `.env.qa.local` via the generator; purge the transcript line. **Executor corrective action accepted:** parser fixed, failed attempts preserved. Lesson for the QAM template: debug helpers must redact values by default (QAM-SR candidate SR-12). | — | no | Director (rotate + regenerate before Q4 release); Friday (template lesson) |
| F-05 | observation (robustness) | low | Re-selecting the already-selected store nulls PBM options without refetch; unreachable by a real user via native `<select>`. Not an AC failure. | — | no | follow-up register; optional include in F-01 repair only if the fix is one line in an already-allowed file (`OwedBookContext.tsx` is on the A01 list) — Cody's call, JARVIS's ruling |
| F-06 | proven pre-existing defect → follow-up finding | low | Cross-tab sign-out not propagated for ≥15 s; bounced on next navigation by `protectPage`. Auth path byte-identical to baseline. Not a Target One blocker; **must appear in the TRC §2 tester limitations list.** | `evidence/browser/01/authwalk.json`; auth path diff 0 lines | no | TRC §2 limitation (Cody, with F-03); KIP-1 follow-up |
| F-07 | observation (plan accuracy) | — | Plan-text counts corrected by the AM-1/AM-2 derivation artifacts (sort 0, filter-from-page-1 2, store detail 2, billing 1+N, settings 2, reset +285 delete stamps, baseline control assumption, reset/apply semantics). Graded against the derivations as the bound plan instructs. **Accepted; the bound plan is not edited retroactively.** Carried as template corrections for the next QAM. | — | no | Friday (template set) |
| F-08 | observation (blocked item) | — | AC-404 SCRATCH half BLOCKED on Director's SCRATCH signup posture. **Director checks the Supabase dashboard for project `ihgcsrypblqkwommrkgj` → Authentication → "Allow new users to sign up", saves OFF if not already, and states the posture in `QAM_APPROVAL.md` §4.** Claudy then performs the live rejection attempt in Q4. | — | **YES** (until stated) | Director → Q4 |

### Matrix dispositions
| AC | Executor label | Lead disposition |
|---|---|---|
| AC-401 | ADJUDICATE | **ACCEPTED LIMITATION** per C-02: identity/ledger/catalog clauses PASS; restore clause not demonstrated; carried to Phase 8. Not FAIL. |
| AC-601 | ADJUDICATE | **FAIL** (F-01). Retest in Q4. |
| AC-404 | BLOCKED | BLOCKED stands; Q4 after Director statement. |
| AC-701/702/703 | NOT RUN | Stands; Gate D after Gate Q, Director-released. |
| AC-901/902/903 | FAIL | Stands; Q4 T-50. |
| all 35 PASS rows | PASS | **Accepted.** |
| DEV declared effects | 44 sessions vs plan estimate ≤28 | Accepted: reruns were instrument corrections (HC-1…HC-4), all logged; effects remained within the declared kinds (sessions + `read_page` only; T-36 hashes unchanged). |

## 3. Consolidated repair ruling — request to JARVIS (Chief Architect) for `APBM_RULINGS.md` §C

**C-03 (scope amendment, A01 exact list):** add `src/components/admin-portal/DemoMarker.tsx` and `src/components/admin-portal/BillingScreen.tsx` to the permitted existing-file list for the purpose of F-01 only: in real mode, remove or replace the "Demo · mock data" pill and the "Visual only — no real charge is made in this demo" footer with truthful copy (e.g. "Synthetic test data" and "Billing actions unavailable in this release"); mock mode keeps its existing copy. No other behaviour change. Optional under the same ruling, Cody's discretion: F-05 one-line guard in `OwedBookContext.selectStore` (already-allowed file) — if taken, it is declared in the manifest §8 and retested under T-33.

**Records (no ruling needed, Engineer duty):** Cody fills `QAM/QAM_MANIFEST.md` (44 CLAIM rows + four-part inventory + §8 repair amendment), `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`, `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` §2 (staging address placeholder "pending Gate D", limitations list including F-02 risk acceptance and F-06 cross-tab sign-out), `APBM_JOURNAL.md` stage 8 entry, `APBM_STATE.md` literal `E2 COMPLETE — AWAITING QA BRANCH` (historical) then `REPAIR RULED — AWAITING COMMIT`.

**Branch and writer:** repair on `qa/apbm-003` only; writer transfer Claudy → Cody recorded in `QAM/HANDOFFS/QA_HANDOFF.md`; Director commits; writer transfer back.

## 4. Q4 retest scope (plan §7 — bound here for `QAM_APPROVAL.md` §4)

| Repair | Diff paths | Affected ACs | Required regression | Carried-forward from Q2/01 | Live validation |
|---|---|---|---|---|---|
| C-03 copy fix (+ optional F-05 guard) | the two files (+ `OwedBookContext.tsx` if taken) | AC-601, AC-602, AC-902, AC-502 (allowlist re-derived with C-03) | T-00 re-pin; T-01 full board; T-04 allowlist; T-38 labels; T-33 admin leg OWNER3 desktop + 375 both themes; T-36 no-mutation (billing screen touched); T-33 OwedBook leg for OWNER3 only if `OwedBookContext.tsx` changed | all Group B SCRATCH evidence (migrations/seed/harness untouched → applicable); Group C DEV evidence except the rows named | OWNER3 real app on `:3138` |
| F-03 records | records only | AC-901, 902, 903 | T-50 | — | — |
| F-08 | — | AC-404 SCRATCH half | T-31d live signup rejection on SCRATCH after Director's statement | DEV half carried | SCRATCH only |

Q4 release conditions: Director has rotated DB passwords and regenerated `.env.qa.local` (checker PASS) **before** release; C-03 recorded; repair committed; `QAM_APPROVAL.md` §4 row filled by Lead (retest scope = this §4) and Director (release).

## 5. Certification outlook

On Q4 PASS of the rows above with no new findings: **Gate Q certified with limitations** — AC-401 restore clause (C-02), F-02 privilege hardening (Director risk acceptance, follow-up migration), F-06 cross-tab sign-out (follow-up), AC-7xx pending Gate D, and Tony's manual smoke H-1 recorded separately. Target One then proceeds to Director acceptance and the Gate D deployment decision.

🥄
