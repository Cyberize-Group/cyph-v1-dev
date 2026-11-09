# QA_HANDOFF — writer transfers on `qa/apbm-003-cyber-pharma` (`APBM-003-CYBER-PHARMA`)

One active writer per checkout (APBM_PLAYBOOK §4). Every transfer of the checkout between Claudy (QA) and Cody (repair) is recorded here before the incoming seat writes anything. The outgoing seat stops its owned servers and browsers, records release, and pauses; the incoming seat verifies identity and accepts.

| Date / time | Outgoing seat | Release note (owned processes stopped, temp paths, HEAD) | Incoming seat | Acceptance (HEAD verified, scope accepted) | Authority (ruling / release reference) |
|---|---|---|---|---|---|
| NOT RECORDED | | | | | |

| Date / time | From → To | Branch | Scope transferred | Forbidden | Recorded by |
|---|---|---|---|---|---|
| 2026-11-09 · Asia/Dhaka (on Director commit of C-03..C-05) | Claudy (QA Executor) → Cody (Engineer) | `qa/apbm-003` | Repair per C-03: `src/components/admin-portal/DemoMarker.tsx`, `src/components/admin-portal/BillingScreen.tsx`; optional F-05 guard in `src/components/owedbook/OwedBookContext.tsx` (declare in manifest §8 if taken). Engineering records: `QAM/QAM_MANIFEST.md` (44 CLAIM rows, four-part inventory, §8 amendment), `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`, `CONTRACTS/TARGET_ONE_RELEASE_CONTRACT.md` §2 (staging address "pending Gate D"; limitations incl. F-02, F-06, AC-401 restore clause), `APBM_JOURNAL.md` stage-8 entry + repair entry, `APBM_STATE.md` → `REPAIR RULED — AWAITING COMMIT`. | Any other product/test/migration file; any QA result file; `.env*`; Git mutation; the `:3137` server stays Cody's but the QA `:3138` build is not started by Cody | Friday (QA Lead) |
| (filled on Director commit of the repair) | Cody → Claudy | `qa/apbm-003` | Q4 retest per `QAM_APPROVAL.md` §4 | product edits | Friday |

transcribed by Cody from Q4_RELEASE_RECORDS_2026-11-09.md
