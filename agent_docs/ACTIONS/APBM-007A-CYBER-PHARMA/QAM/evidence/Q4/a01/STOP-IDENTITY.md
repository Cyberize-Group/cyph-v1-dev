# Q4 a01 — STOP-IDENTITY before candidate-dependent execution

Observed 2026-11-16. Seat: CODY, QA Executor. The Q4 release is recorded verbatim in QAM_APPROVAL.md. No new plan or Q1 requested; approved plan SHA256 remains 2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672.

Manifest SHA256 matches a1494098aa4c7f9c34a1d9b3ad79a9673b8e366b8688162c550cd6ed707145ae. Both repos are on qa/apbm-007a, but HEADs are still the stated pre-repair parents:
- OwedBook: 37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40.
- Portal: 9d938f62bff6172f9332ae6c67775e4b8feea379.

There is no committed r03 product/records successor to bind. The five Portal product files match the manifest on disk, but four tracked files are modified and the new registration test is absent at HEAD. Worktree byte agreement is not a product commit. OwedBook r03 records likewise remain uncommitted. No Git mutation performed.

Ports3000/3001 are owned by PIDs2015772/2015203, the same PIDs recorded in B1. The on-disk build IDs also match B1. Current ps timestamps are captured exactly in runtime.json (their wall-clock presentation differs from historical B1 timestamps); no repaired served build is attested. No app was stopped/restarted and no test request sent. A new production build cannot be attributed to a nonexistent r03 commit.

Affected scope: the new Portal baseline, all repaired-screen/billing tests, new live journeys and Q4 acceptance/required regressions that must be bound to the indivisible candidate pair. They are BLOCKED STOP-IDENTITY, not failed or passed. Prior byte-unchanged evidence remains historical only; applicability will be checked after actual commits exist. This stop is not a new product finding and does not reopen the plan.

Unaffected work completed: recorded release/adjudications, verified manifest and worktree product hashes, captured runtime metadata, removed only build-owedbook/build-portal/.npm under QAM/AUTOMATION/a02, and SIGTERM stopped only new-owner.cjs/new-owner-retry.cjs QA helper processes. All196 other QA records/evidence/archive files checked before/after housekeeping were unchanged. Free space rose from299442176 to2145300480 bytes (about1.72GiB reclaimed). Scripts and evidence retained; no business/provider fixture cleanup.

Q4 product effects zero: no login, Auth identity, email, checkout, payment, provider mutation, database read/write or sample loader. Cumulative Q2 effects retained. Engineering's reported NPI1373398746 is logged as engineering-owned, unverified against DEV in this stopped attempt, never used or removed.

Safe resume point: Director completes the approved r03 commits and Portal rebuild/restart; QA re-reads HEADs, proves exact five-path product delta and records-only successors, verifies served identity, then resumes this released Q4 scope. No new Q1/plan approval required. Director controls Git and app restart. No fixture cleanup/deletion/certification/deployment authorized.

This is the required safe partial Q4 package. Director-session script is preparatory, not a claim that payment or access email already occurred. Lead receives the stopped coverage/effects; Director resolves candidate identity. No further effects in this attempt.
