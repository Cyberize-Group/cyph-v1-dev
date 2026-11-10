# T-09 harness rework review — 2026-11-09T09:33:08+06:00
## git diff --stat af2c7e5..308247a -- scripts/rls-harness/
 scripts/rls-harness/ac8-check.mjs      |   7 +-
 scripts/rls-harness/attacks.mjs        |   9 +-
 scripts/rls-harness/audit-catalog.mjs  | 231 ++--------------------------
 scripts/rls-harness/audit-prove.mjs    |  59 ++------
 scripts/rls-harness/audit-seed.mjs     |  57 +------
 scripts/rls-harness/audit-session.mjs  | 268 +++++++++++----------------------
 scripts/rls-harness/audit-wrappers.mjs | 116 +-------------
 scripts/rls-harness/expectations.json  |  30 ++--
 scripts/rls-harness/harness.mjs        |  32 ++--
 scripts/rls-harness/lib/env.mjs        | 112 ++++++++------
 scripts/rls-harness/policy-check.mjs   |   9 +-
 scripts/rls-harness/prove.mjs          |  28 ++--
 scripts/rls-harness/revocation.mjs     |  13 +-
 scripts/rls-harness/scoping.mjs        |  14 +-
 scripts/rls-harness/seed.mjs           |  15 +-
 15 files changed, 274 insertions(+), 726 deletions(-)
## expectations.json flips (QA derivation evidence/derivations/01/matrix_delta.md)
**Expectation flips = 13** (user_data writes 7, user_data SELECT 4, audit_logs SELECT 2):
## prove.mjs: retry / catch / hard-coded 15
28:const runTs = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
prove.mjs hits (retry|catch|15): 1
## harness.mjs: try/catch swallowing or retry loops
harness.mjs hits: 0
## verdict text uses observed count variable
47:let observedPolicies = null;
53:  const policyCount=text.match(/total policies in public: (\d+)/);if(policyCount)observedPolicies=Number(policyCount[1]);
59:  : `\n[rls:prove] ✓ ISOLATION PROVEN — chain + ${observedPolicies} observed policies + AC8 + four laws + 320 cells + scoping + 28 attacks + live-session revocation, from an empty database.`;
## full diff saved separately: harness_diff.patch
## the single prove.mjs hit is:
28:const runTs = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
## assessment: it is the ISO-timestamp slice `.slice(0, 15)` used to name evidence files — not a retry loop, not a swallowed catch, not a hard-coded policy count. The verdict line prints ${observedPolicies} parsed from policy-check output.
