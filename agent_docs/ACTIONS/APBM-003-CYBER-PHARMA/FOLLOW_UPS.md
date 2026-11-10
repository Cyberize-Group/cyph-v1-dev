# APBM-003 follow-up register — carried into APBM-004 planning

2026-11-09 · Engineering consolidation, not closure of deferred scope. Director accepts Target One with limitations. Nothing below is implemented by closeout.

| Item | Status | Owner / next checkpoint |
|---|---|---|
| AC-401 full restore rehearsal | OPEN — accepted limitation C-02, not demonstrated | DevOps/Director; Phase 8 production package, supported disposable restore path |
| F-02 privilege hardening | OPEN — C-05(a) risk accepted; residual non-DML privileges remain | Architect + Engineer, separately released 0053_privilege_hardening forward migration |
| F-04 credential rotation | DEFERRED by Director C-05(b); exposure not claimed remediated | Tony; rotation/reconfiguration when separately directed; credential validity still required |
| F-06 cross-tab sign-out | OPEN — next navigation enforces sign-out | KIP-1/auth follow-up; protected path requires separate scope |
| F-10 mobile billing Cancel clipping | OPEN — disabled button clipped at 375px; no mutation | APBM-007 polish or separately ruled UI repair |
| Admin writes, invitations, Add Store, billing actions | DEFERRED, unavailable in this release | APBM-007 / roadmap approval |
| Real claims/import and financial engine validation | DEFERRED; synthetic fixture calculations only | APBM-004 planning/engine scope, APBM-005 real claims/import; use actual campaign authority |
| Emails/PDF delivery | DEFERRED | APBM-006 |
| Deployment, Gate D and production readiness | PENDING; no deployment in APBM-003 | Director-approved deployment then Claudy verifies actual deployed revision; Phase 8 safeguards |
| Pagination successor targeted review | AWAITING FRIDAY; Director manual approval recorded | CLOSEOUT/FRIDAY_REVIEW_HANDOFF.md; preserve prior certificate identity |
| Final QA cleanup acceptance | NOT RECORDED | Claudy execution reconciliation + Friday acceptance; retain Tony testing materials |
| F-09 stale repaired identity | Engineering correction COMPLETE locally; commit pending | Known dc44429f now in manifest/handoff; no product retest needed for wording |
| Plan-count inaccuracies / credential-redaction / workflow lessons | CAPTURED, doctrine NOT YET UPDATED | Friday + Claudy independent responses; JARVIS synthesis before Factory Doc Sync |
| Distinct synthetic stores / useful human test journeys | Lesson for APBM-004, not a fixture change here | Architect defines visible differences and tester journeys before next handoff |
