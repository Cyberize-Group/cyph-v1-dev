# APBM-003-CYBER-PHARMA — Q4 round records (source of truth for transcription)

Prepared by Friday (QA Lead, coordinating the repair round under Director delegation of 2026-11-09 11:47 +06). Every block below is pasted verbatim into the named file by the named seat. Nobody composes; Tony commits.

---

## Block 1 — `APBM_RULINGS.md` §C (append after C-03; transcriber: Cody or Claudy, attributed)

| ID | Erratum | Authority | Date | Effect |
|---|---|---|---|---|
| C-04 | AC-404 SCRATCH half ruled **N/A for Target One**: SCRATCH `ihgcsrypblqkwommrkgj` is a disposable engineering target with no tester exposure; the DEV half (`disable_signup: true`, read-only GET) PASS stands. Finding F-08 closed. Supersedes the BLOCKED label in Q2 attempt 01 and the AM-6 conditional. | Director (Tony), 2026-11-09, on QA Lead adjudication | 2026-11-09 | AC-404 grades PASS (DEV) / N/A (SCRATCH) in Q4 without a signup attempt |
| C-05 | Director risk acceptances for Target One: (a) **F-02** residual TRUNCATE/REFERENCES/TRIGGER grants to `anon`/`authenticated` (and INSERT/TRUNCATE/REFERENCES/TRIGGER on `audit_logs`) from the BIM-001 bootstrap default ACL — not reachable through PostgREST or the app; hardening migration `0053_privilege_hardening` scheduled for the next forward-migration module; (b) **F-04** local-transcript credential exposure — rotation of SCRATCH/DEV database passwords **deferred by the Director**; exposure confined to the Director's own machine; `.env.qa.local` remains valid; (c) **F-06** cross-tab sign-out delay — pre-existing, auth path protected, recorded in the TRC §2 tester limitations. | Director (Tony), 2026-11-09 | 2026-11-09 | None of (a)(b)(c) gates Gate Q; all three appear in `QAM_CERTIFICATION.md` limitations |

---

## Block 2 — `QAM/HANDOFFS/QA_HANDOFF.md` (writer transfers; append rows)

| Date / time | From → To | Branch | Scope transferred | Forbidden | Recorded by |
|---|---|---|---|---|---|
| 2026-11-09 · Asia/Dhaka (on Director commit of C-03..C-05) | Claudy (QA Executor) → Cody (Engineer) | `qa/apbm-003` | Repair per C-03: `src/components/admin-portal/DemoMarker.tsx`, `src/components/admin-portal/BillingScreen.tsx`; optional F-05 guard in `src/components/owedbook/OwedBookContext.tsx` (declare in manifest §8 if taken). Engineering records: `QAM/QAM_MANIFEST.md` (44 CLAIM rows, four-part inventory, §8 amendment), `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`, `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` §2 (staging address "pending Gate D"; limitations incl. F-02, F-06, AC-401 restore clause), `APBM_JOURNAL.md` stage-8 entry + repair entry, `APBM_STATE.md` → `REPAIR RULED — AWAITING COMMIT`. | Any other product/test/migration file; any QA result file; `.env*`; Git mutation; the `:3137` server stays Cody's but the QA `:3138` build is not started by Cody | Friday (QA Lead) |
| (filled on Director commit of the repair) | Cody → Claudy | `qa/apbm-003` | Q4 retest per `QAM_APPROVAL.md` §4 | product edits | Friday |

---

## Block 3 — `QAM/QAM_APPROVAL.md` §4 (append one row; Lead columns filled now, Director columns at release)

| Date | QA Lead decision (retest scope approved; plan §7 SHA-256) | Repaired candidate (full SHA) | Director release for Q4 | Recorded by |
|---|---|---|---|---|
| 2026-11-09 | **Q4 retest scope APPROVED (Friday):** T-00 re-pin on the repaired candidate; T-01 full board; T-04 allowlist re-derived with C-03 (+ `OwedBookContext.tsx` if the F-05 guard was taken); T-38 labels; T-33 admin leg OWNER3 desktop + 375, light + dark; T-36 no-mutation; T-33 OwedBook leg OWNER3 only if `OwedBookContext.tsx` changed; T-50 records. AC-404 per C-04 (no signup attempt). Carried forward from Q2/01: all Group B SCRATCH evidence and all Group C DEV evidence not named above (repair diff must touch no migration, seed, harness or service file — verified at T-00; otherwise `STOP-CONTRACT`). Credential file: existing `.env.qa.local` valid per C-05(b); `check-qa-env.sh` must PASS at Q4 entry. Plan §7 is the bound plan's §7 (plan SHA `194538a7…cfea4`, unchanged). | `<Director fills after repair commit>` | `<Director fills: "Q4 released", date>` | Friday / Tony |

---

## Block 4 — `QAM/QAM_STATE.md` transition log (append; one row now, one at each later step)

| 2026-11-09 · Asia/Dhaka | QA Lead (Friday) | `Q2 COMPLETE — AWAITING ADJUDICATION` → `REPAIR RULED — AWAITING COMMIT` | candidate `308247a2…` (pre-repair); plan `194538a7…cfea4` | `QAM/HANDOFFS/Q2_ADJUDICATION_01.md`; `APBM_RULINGS.md` C-03..C-05; `FINDINGS.md` §2 |
| (on Director commit of repair) | Director (Tony) | `REPAIR RULED — AWAITING COMMIT` → `RETEST SCOPE APPROVED — NOT RELEASED` → `RELEASED FOR Q4` | repaired candidate `<SHA>` | `QAM_APPROVAL.md` §4 |

Current-state table: Phase = `REPAIR RULED — AWAITING COMMIT`; Next owner = Engineer (Cody); Next permitted action = repair per C-03 + engineering records; Active stop = none.

---

## Block 5 — `APBM_JOURNAL.md` (campaign journal entry; transcriber: Cody with his repair entry)

**2026-11-09 — Q2 attempt 01 adjudicated (Friday, QA Lead).** Independent QA executed the bound plan 09:15–10:45 +06 against candidate `308247a2…`: 35 PASS / 3 FAIL (records) / 1 BLOCKED / 3 NOT RUN (Gate D) / 2 ADJUDICATE. Isolation, owner reach, read-audit closure (both halves), seed integrity and the real-app matrix proven under independent derivation with attacked instruments. Gate Q **not yet certified**: one consolidated repair round ruled — F-01 truthful-display copy (C-03), F-03 engineering records. Director rulings C-04 (SCRATCH signup N/A) and C-05 (risk acceptances F-02/F-04/F-06). Lesson candidates: **APBM-L07** bootstrap default ACL leaves non-DML grants to client roles — add a default-privilege hardening step to the BIM/APBM schema template; **APBM-L08** executor debug helpers must redact credential values by default (QAM-SR candidate SR-12); **APBM-L09** release records must exist on disk, not in chat, before a QA shot is launched (two Q2 entry holds on 2026-11-07 and the C-04/C-05 gap on 2026-11-09 were both chat-only records). Next: Cody repair → Director commit → Q4.
