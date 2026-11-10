# Tony manual smoke — DEV APPLY complete

Final receipt: `dev-v2-final-1794039263719.json` in `../DEV_V2_20261107T080333Z_1347924/`, PASS at 2026-11-07T08:14:23.719Z. Full 52-entry ledger, retained exact three ACL differences, unchanged original rows/Auth indexes, 250 synthetic claims, 19 Owner and 154 access checks. Tony executed the writes; no apply/seed rerun occurred here.

## Local launch

App is already running at **http://127.0.0.1:3137/auth** on stark. Use a fresh private browser window and this hostname consistently. If browsing from another machine, forward local port 3137 to stark; server binds loopback only.

After stopping this local server, the exact restart command is:

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
node agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-manual-smoke/launch.mjs serve
```

The wrapper checks the recorded build ID, selects the standalone server, and pins real-service mode, Dev v1 URL/public key, and the matching server key in process environment. No .env changes. Do not run the historical SCRATCH wrapper. If application code changes, first run the same wrapper with `build`, then `serve`.

Build inspection found stale SCRATCH bytes initially. New build PASS; browser/server JS contains Dev v1 references and **zero SCRATCH refs**. Login route HTTP 200. This is runtime readiness, not a signed-in manual-smoke PASS. No Cody authenticated app probe was run.

## Accounts and passwords

Approved cast credentials are stored privately at:
`/tmp/apbm003-dev-v2-cast-20261107T080333Z-1347924.json`

Verified project ref Dev v1 and file mode 0600. Open locally in your editor; passwords are under `identities.<HANDLE>.password`. Do not paste the file into chat, logs or Git. These are the DEV identities from this APPLY, not the old SCRATCH cast. All seven global roles are member; ownership and tenant admin privileges come from the approved account/junction relationships. No Operator account.

| Handle / email | Expected access and short test |
|---|---|
| OWNER1 — apbm003-owner1@example.invalid | Only A1. OwedBook loads real claims and Owner/admin read views; no B/C access. |
| OWNER3 — apbm003-owner3@example.invalid | B1/B2/B3, including owner access to B2/B3 without added junctions. Switch rapidly between stores; no stale claims/KPIs or incorrect selection. |
| ADMIN_B2 — apbm003-admin_b2@example.invalid | Only B2; scoped admin members/audit/stores/billing reads. No B1/B3 access. |
| ADMIN_B3 — apbm003-admin_b3@example.invalid | Only B3; same scoped read-only admin checks. |
| MEMBER_B1 — apbm003-member_b1@example.invalid | Only B1 OwedBook; admin controls/pages denied or absent. |
| MEMBER_B2B3 — apbm003-member_b2b3@example.invalid | B2/B3 OwedBook and safe store switching; no B1/admin access. |
| UNRELATED — apbm003-unrelated@example.invalid | Only C1; no A/B data or access. |

For each role, log out before the next login. Check `/owedbook` and, where permitted, `/admin-portal`. Verify filters/pagination and displayed totals change consistently; 50 claims/store is the seeded total, not necessarily the current filtered/tab count. Navigate back/refresh after a store switch; denied views must not show another tenant's cached data. Billing stays read-only; invite/add-store/settings/payment/claim-write actions remain unavailable. Federal values must remain truthfully unavailable. Do not test by submitting real writes. Two copy-only changes remain unapproved and untouched.

In browser DevTools, Supabase requests must go to `yrsuwikjnbmvpznrgydb.supabase.co`, never SCRATCH. Manual logins create Auth sessions; successful audited RPC reads append audit rows. These expected effects are distinct from business writes.

Record role-by-role PASS/FAIL, browser/viewport, routes, target ref and any errors without tokens/passwords. Tony manual smoke is **PENDING**. Independent QA remains **PENDING / NOT RELEASED** until Tony completes this smoke and directs the next handoff. No Gate Q or Gate D result is claimed.
