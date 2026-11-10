# matrix_delta.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Method: compare expectation lookups (overrides ?? default) for every identity×table×operation between scripts/rls-harness/expectations.json at baseline af2c7e5 and at the candidate.

Cells: 5 identities × 16 tables × 4 ops = 320 (baseline 5×16×4).

**Expectation flips = 13** (user_data writes 7, user_data SELECT 4, audit_logs SELECT 2):

| identity | table | op | from → to |
|---|---|---|---|
| ownerA | user_data | select | ALLOW → DENY |
| ownerA | user_data | insert | ALLOW → DENY |
| ownerA | user_data | update | ALLOW → DENY |
| ownerA | user_data | delete | ALLOW → DENY |
| ownerA | audit_logs | select | ALLOW → DENY |
| staffA | user_data | select | ALLOW → DENY |
| staffA | user_data | insert | ALLOW → DENY |
| staffA | user_data | update | ALLOW → DENY |
| ownerB | user_data | select | ALLOW → DENY |
| ownerB | audit_logs | select | ALLOW → DENY |
| multiStore | user_data | select | ALLOW → DENY |
| multiStore | user_data | insert | ALLOW → DENY |
| multiStore | user_data | update | ALLOW → DENY |

SQL basis: 0050 drops user_data_select_member / insert_member / update_member / delete_admin and revokes select,insert,update,delete on user_data from authenticated → every previously ALLOW user_data cell flips to DENY; 0051 drops audit_logs_select_admin and revokes select → previously ALLOW audit_logs SELECT cells (junction admins) flip to DENY. 0048 replaces member-only SELECT policies on accounts/businesses/user_businesses/subscriptions with member-or-owner predicates — no BIM-002 cell flips because the BIM-002 cast reads those tables by junction membership already; 0048 also revokes insert/update/delete on accounts/subscriptions from authenticated (no BIM-002 ALLOW cells existed there).

New tables in the matrix vs baseline: none. Identities unchanged: true.
