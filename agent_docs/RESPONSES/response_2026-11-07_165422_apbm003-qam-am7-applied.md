# APBM-003 QAM — AM-7 applied, plan re-hashed (Claudy, 2026-11-07 16:54 +06)

**Plan SHA-256 after AM-1…AM-7:** `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` (supersedes `e8c4d5ac46635c2054e2d61073197db695ecd542a6281d4e561b0a6854bce061`). State unchanged: `Q1 AMENDED — AWAITING QA LEAD BINDING`.

| Edit | Where | Result |
|---|---|---|
| AM-7a | `QAM_PREFLIGHT.md` PF-3.6 Check | named Director-run exemption for `AUTOMATION/make-qa-env.mjs`; Executor only `--self-test` |
| AM-7b | `QAM_PREFLIGHT.md` PF-4.6 Expected (+ Result/Evidence refreshed) | ignored and untracked by exit code via `check-qa-env.sh`; keys per `QAM_ENTRY.md` §4 + `QA_DEV_DB_URL`; `QA_STAGING_URL` optional; undeclared key = FAIL. Result stays FAIL until the Director's generator run |
| AM-7c | `QAM_TEST_PLAN.md` §5 `STOP-ENV` | widened to not-ignored / undeclared keys / checker ≠ PASS |
| §8 | `QAM_TEST_PLAN.md` | row AM-7 recorded; Material? no |

Authority: Director instruction "Apply AM-7 as approved" (chat). `QAM_APPROVAL.md` has no AM-7 line or amended hash yet; the Lead records `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4` in §2. Still open for the Lead: §4 vs §2 publishable-key names (helpers use §4 forms). No product/test code, Git, server or credential file touched.
