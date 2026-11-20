# DEV migration 0071 — apply result

**Result: APPLIED. All prescribed checks pass. DEV is at 71.** Done under the Director release of 20 Nov 2026: 0071 only, on `yrsuwikjnbmvpznrgydb`, following Portal `MANUAL_QA/2026-11-19/DEV_APPLY_0071_PREPARED.md`.
Evidence: OwedBook `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-0071/`.

## Pre-write record

| Item | Value |
|---|---|
| OwedBook | branch `repair/apbm-007b-manual-qa`, HEAD `64295a742aa25e46fdf8b3f31e18b561c86ee596`, 43 uncommitted paths (the permitted repair changes and records) |
| Portal | branch `repair/apbm-007b-manual-qa`, HEAD `0443fda34217b2eb94d44b19b4a106e107a1c2e8`, 28 uncommitted paths |
| Processes | no app, Stripe listener or scheduler running |
| Target | DEV `yrsuwikjnbmvpznrgydb` (loadEnv prefix `APBM_DEV_`; API and SQL refs agree) |
| 0071 SHA-256 | `9a91230710d5895c7bf1c6add346d83e9ffca22199e17910a3c48ec052497955`. Matches the sheet |
| Manifest SHA-256 | `403e27b18c51afbb53777c8f7ddac80ec94d170a1c4ff70388fbeffd6aec9c99`. Matches. Entries 1–70 and the bootstrap hash are byte-equal to `approved-manifest-0070.json` (`134d815d…`); all 71 disk hashes match |
| Migrations 0001–0070 | unchanged (no diff against HEAD; the only untracked migration is 0071) |
| Tooling (identical to HEAD) | `apply-forward.mjs` `f2a0f454…759e`, `dev-verify.mjs` `a39f1709…cf9`, `dev-apply-guard.mjs` `d92ce1d2…904419`, `dev-compat-check.mjs` `1293381b…2ec8`, `rls-harness/lib/env.mjs` `c9bded70…b7c`, `db-bootstrap-baseline.sql` `52324e91…d144` |

## Results

| Step | Result |
|---|---|
| 1. DEV = post-0070 baseline | `dev-verify --expect dev-apply-0070/catalog-after.json`: **PASS**. Catalogue `21c2e80d…ddfdee1` (34 / 14 / 101), ledger 70 = manifest prefix |
| 2. Guard preflight | inventory = manifest (71), read-only on, ledger 70, unchanged prefix, last 0070. `ready` false by design: the guard hard-codes 69 files and branch `apbm-007b`, exactly as at the 0070 apply |
| 2a. Data since the 0070 post-check | Differences against `dev-apply-0070/guard-post.json` were checked read-only, table by table. Total minus rows created after 05:54:12Z on 19 Nov equals the post-0070 count in every table (accounts +1, stores +2, memberships +3, subscriptions +1, billing customers +1, checkout +1, notifications +1). The single membership delete is the walkthrough's member removal. No pre-0070 row was deleted. Audit rows are append-only. **Expected walkthrough data, not drift** |
| 3. Apply (the only DEV write) | `Committed 0071_007b_owner_settings_audit.sql`. Receipt `forward-apply-1795145858189.json` (SHA-256 `f76ba305…85`): status **PASS**, committed `["0071_007b_owner_settings_audit.sql"]`, 03:37:31Z → 03:37:38Z |
| 4. Ledger / after-catalogue | ledger **71 = manifest**, last 0071. Catalogue `849b7699…f69e` (34 tables / 14 policies / **103** functions, +2 = `store_profile`, `audit_detail`) |
| 5. Guard post | **PASS**.<br>• ledger 71, unchanged prefix<br>• deployment identity `["yrsuwikjnbmvpznrgydb"]`, test ref constant<br>• 0 enabled test contexts; `billing_now` real time<br>• no table without RLS; no new-table customer grant; no unpinned SECURITY DEFINER<br>• businesses without identity 0<br>• **every `preservation_equal` true** (all 12, incl. `audit_logs`)<br>• **DEV test-clock enable refused 42501**<br>`ledger_69_equals_manifest` false by design |
| 6. Compatibility (rolled back) | **PASS**: members 13, scope equal 13, **no scope diffs**; `owedbook_rows` ok 17; `owedbook_summary` ok 17; `owner_billing_overview` ok 8; access active 7 / past_due_reminder 1. Higher than the 0070 receipt (11/14/14/7/6) only because of the walkthrough's new owner, stores and member |
| 7. Against SCRATCH (after 0071) | differing schema sections: **none**, apart from `defaultACLs` (the three pre-existing platform default ACLs already noted at 0061–0069 and 0070) |

## Failed or incomplete

None.

## Mail policy (local configuration)

`MAIL_RECIPIENT_POLICY=open` was added to both `.env.local` files, directly after `MAIL_ALLOWLIST`:
- OwedBook: 50 → 51 lines.
- Portal: 42 → 43 lines.

No other line changed and file modes are unchanged (664). Both files point at the DEV project, so the policy takes effect there. The existing exact allowlist entries are kept. The policy is read at runtime, so the next app start picks it up. No secret was printed.

## Effects

- **DEV:** one committed transaction (0071 plus its ledger row). Every other step was read-only or rolled back.
- **Not done:** no reset, no retry, no other migration; no source change; no commit, push, merge, deployment or app start; no payment or mail test. No credential was printed.

## Next

1. **Start both apps** from the current branch builds (`next start`; the Portal on `--port 3001`), the Stripe listener, and, only for time-based tests, the scheduler.
2. **Retest:** follow Portal `MANUAL_QA/TESTER_PLAN.md`. Owner badges in staff lists, the Settings details and the readable audit log are now live on DEV.
3. **Commit:** Tony commits today's records and the evidence lane `EVIDENCE/apply/dev-apply-0071/` with the repair branch.
