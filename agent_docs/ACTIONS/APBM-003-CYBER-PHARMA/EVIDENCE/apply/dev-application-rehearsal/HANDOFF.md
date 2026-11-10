# APBM-003 — application-forward rehearsal and revised DEV APPLY path

**Narrow rehearsal PASS. Shared DEV APPLY remains BLOCKED on the independent items below.**
Director direction: defer the four Auth indexes on SCRATCH; no support ticket, clone or new project. This supersedes the old full-restore/index prerequisite for this application rehearsal. It does not authorize dropping indexes on DEV or widening the three-entry ACL exception. Branch `apbm-003`, unchanged HEAD `49dec499d665125bb8764ccc8ea498c5fdfcdcd1`; existing Stage 6 working changes retained. Tony retains Git and DEV APPLY.

## What ran and passed

On existing disposable SCRATCH `ihgcsrypblqkwommrkgj`, completed 2026-11-06 15:02:40 UTC:

| Check | Actual result |
|---|---|
| Target fence before mutation | DEV, pilot `cwdzijswchlwfvxxrlzb`, and mixed SQL/API configuration rejected; complete SCRATCH credential prefix verified |
| Source inventory | All 56 current application/source-manifest hashes match; approved 52-file migration inventory verified by forward runner |
| Synthetic starting state | DEV's two-table public catalog and exact existing function definitions represented; only the previously approved three managed default ACL entries normalized |
| Preserved fixtures | Five synthetic Auth users/identities, five profiles, five roles spanning superadmin/admin/member; one unrelated existing SCRATCH Auth identity retained |
| Native migration history | Synthetic sentinel at version `20261012053902`, preserved unchanged; not an actual copy of DEV's provider metadata |
| Bootstrap failure rehearsal | Entire application patch executed, forced SQL error `22012`, transaction rolled back; starting catalog, rows, metadata and Auth indexes exact |
| Bootstrap 0047 | Exact canonical public catalog: 16 tables, 19 policies, 13 functions; all 14 new tables empty; APBM ledger absent; all 30 preserved table fingerprints and metadata unchanged |
| Ledger + forward path | Initialize 0001–0047 only after baseline proof; apply 0048–0052 with original forward runner; exact canonical 0052 catalog and ordered hashes verified |
| Preservation through migrations | Every existing row across the 30 preserved tables unchanged; role definitions, memberships, trigger metadata and defaults unchanged |
| Seed | Seven new synthetic users; five stores; 50 claims/store, 250 total; 285 correctly attributed insert audit rows; independent arithmetic 250/250 correct; identity scan clear |
| Preservation after seed/probes | All six pre-existing Auth users/identities, five profiles, five roles, 82 Auth migration rows and the native sentinel remain byte-equivalent under salted row hashes; no existing rows changed or lost; user-role sequence not lowered |
| Owner / app access | 19 Owner checks + 154 real-client checks PASS: owner stores without junction rows, tenant denial, direct claim read denial, audited reads, scoped admin and billing RPCs |
| Index preservation | All existing SCRATCH Auth user indexes retain exact definitions and validity flags; the four DEV-only indexes remain absent, intentionally |
| ACL guard tests | 16 local controls PASS; DEV/pilot use, changed payloads, a fourth entry, partial sets, and changes to other catalog sections rejected |

Evidence: [RESULT.json](RESULT.json), [PREFLIGHT.json](PREFLIGHT.json), [POSTFLIGHT.json](POSTFLIGHT.json), [preservation-after-seed.json](preservation-after-seed.json), [preservation-after-probes.json](preservation-after-probes.json), [owner-proof.json](owner-proof.json), [authenticated-reads.json](authenticated-reads.json), [seed-verify.json](seed-verify.json).

Canonical 0047 SHA-256: `f83deb44e94e4f4ca8ac3168120477aebaef1cd8d7af3ae8644085c3c05e22ec`.
Canonical 0052 SHA-256: `66782ff92213415443d428ade161b165e04a5aba29999453cb0ab34a7160d061`.
Seed content SHA-256: `f7f1270cccbb26896cfeeef4c7326b761bfc90f4080a72d27b66574b83cfabdf`.

The effective object grants, RLS policies, function ownership/ACLs and other public catalog sections match exactly after bootstrap and 0052: no normalization exclusions were needed at those two checkpoints. Real publishable-key authenticated sessions then proved RPC access and denials. This tests effective application privileges independently of the managed-default-ACL limitation.

## Four-index dependency ruling

[INDEX_DEPENDENCY_REVIEW.json](INDEX_DEPENDENCY_REVIEW.json) pins 166 examined files: bootstrap, all five migrations, seed modules, and application TS/TSX. None names any of the four indexes. The application SQL neither creates, alters, drops nor rebuilds these Auth indexes. It creates public objects, replaces public functions and adds public foreign keys to `auth.users(id)`; those depend on the primary-key index `users_pkey`, not the four non-unique indexes. Current DEV public FK catalog confirmation is [DEV_AUTH_FK_DEPENDENCIES.json](DEV_AUTH_FK_DEPENDENCIES.json).

Seed creates Auth users through the provider API, causing normal index maintenance. That is data insertion, not index-definition modification. App authentication may indirectly use provider queries and benefit from these indexes; provider-internal plans and performance were not inspected. Successful seed and real-client proofs on SCRATCH establish functional behavior without them, not performance equivalence. Retain all four on DEV.

## What this narrower rehearsal does not prove

- It is **not a restoration of the private DEV backup** and is not evidence that real DEV Auth data, every historical record or the complete provider project can be restored. No `restoreVerified=true` or full-restore PASS is asserted.
- The synthetic data exercises preservation, mixed existing roles and additive seed behavior. It is not an exhaustive sample of unknown data-dependent conditions. One unrelated SCRATCH identity remains in addition to the five synthetic source identities. Twenty-four of the 30 source tables are empty; no claim of populated-table recovery coverage for those tables.
- The native ledger sentinel checks that the application leaves native history alone; its schema/content is not a provider-native restoration proof.
- The four DEV-only Auth indexes, provider internals, managed object ownership differences, external settings, storage files, recovery duration and production-like concurrency/load remain unverified by this rehearsal.
- The three managed default ACL statements were omitted from the SCRATCH application body only. Their execution with a privileged DEV operator was not rehearsed. No new role grant or ACL exception was applied to DEV.
- Earlier Stage 5 destructive/partial-migration-failure proofs and Stage 6 app/browser evidence remain retained. This run adds a focused bootstrap rollback proof; it does not relabel prior evidence as a fresh full restore or rerun the browser suite.

## DEV read-only result and backup

`yrsuwikjnbmvpznrgydb` remains the intended CyberPharma_Dev_v1 rollout target. Before and after the rehearsal, read-only checks match the retained backup's **all 30 table fingerprints and metadata**; five users/identities/profiles/roles remain unchanged. Public catalog remains `da2a46ee54a85bcc8a9e4f54eb0f14106a68d4a336e3a165170f77b17620a07b`. All DEV Auth user index definitions/flags are unchanged; each of the four designated indexes is present, valid, ready and live.

Retained private DEV archive SHA-256: `1d33881a1b49f85d20ecee6514a56f94552055efd6dc19f58942b12316dda692`.
Retained private fingerprint proof SHA-256: `da66a9e80edf45999acae890f4f933dee27d356d68c4bff260d21165012c2600`.
Both still match; files remain mode 0600. Contents stay private. Their existing `/tmp` location is temporary retention, not durable off-host backup storage. A separate private pre-rehearsal SCRATCH archive was captured before reset; it does not replace the DEV backup and was not restore-tested.

## Separate unresolved gates and exact next action

1. **Connection variable:** `.env.local` still has a direct endpoint in `APBM_DEV_DB_URL`; `APBM_DEV_DB_POOL` is the working Session pooler. Both refs match DEV, but the values differ. Tony: set `APBM_DEV_DB_URL` to the exact existing `APBM_DEV_DB_POOL` value locally. No credentials belong in chat. This run explicitly mapped the pool variable in memory for read-only checks; no `.env` edit was made.
2. **Managed ACL decision:** current `postgres` has neither inherited nor SET ROLE access to `supabase_admin`. Strict bootstrap would reject before writes. Exactly three `supabase_admin` default ACL entries remain in DEV. Recommendation for Tony/JARVIS: authorize retaining **only those same three exact payloads** on DEV and checking effective app grants/RLS/RPC access, with every other baseline check unchanged. This recommendation is **pending**, not an extension of the SCRATCH-only exception. Alternatively supply an approved privileged execution path for the strict three-statement reconciliation; that privilege-dependent operation needs its own validation. No support ticket is proposed or opened.
3. **Signup checkpoint:** fresh read-only `/auth/v1/settings` at 15:03:23 UTC reports `disable_signup=false`. Signup is enabled; this is evidence on file, not missing credentials. Tony: record either verified signup-disabled evidence after a separately authorized settings change, or an explicit **DEV APPLY checkpoint** waiver/disposition with the maintenance controls. The previous E2 launch waiver is not assumed to cover this checkpoint. Settings were left alone.
4. **Matching DEV executor/receipt adapter:** the old `dev-bootstrap-execution/bootstrap-runner.mjs` and `DEV_COMMANDS.sh` still require `restoreVerified=true`; this honest synthetic receipt must not be forged into that shape. Once item 2 is ruled, Cody must make and locally validate the smallest matching transaction/receipt-gate amendment, accepting this named narrower proof while retaining target, hash, preservation, ledger and index gates. This is a remaining engineering prerequisite, not a demand to reproduce the four indexes. The SCRATCH-only driver/body in this folder must never be used as a DEV executor.

## Shortest reviewed path to DEV APPLY

1. Tony clears the local pooler variable, managed-ACL ruling and DEV signup/checkpoint disposition above. No clone or index recreation is needed for the accepted application rehearsal.
2. Cody pins the ruling-specific DEV executor and truthful synthetic receipt adapter; verifies its fail-closed checks and exact reviewed inputs. Tony reviews/commits the scoped files under his Git authority. No contract/receipt is silently marked FINAL.
3. In the approved maintenance window, recheck SQL/API identity and source hashes; recompare the retained backup fingerprints to live DEV (refresh affected-state backup if drift exists), record four-index **before** definitions/flags, and capture private preservation fingerprints. Confirm the recovery decision described below before writes.
4. **Tony's separate write release:** run the reviewed forward-only bootstrap in one transaction. Abort on any failure, changed preservation hash, unexpected catalog difference or index change. Prove 0047 and no APBM ledger first. Run the read-only index guard again after bootstrap.
5. Initialize the APBM ledger with the verified 47 input hashes; then run the existing forward runner through 0052. Compare exact catalog/ledger under the specifically approved ACL treatment. Run the read-only index guard after migrations.
6. Run the approved additive synthetic seed once; verify 250 claims/seed hash, audit attribution, and preservation of all original users/profiles/roles/rows. No reset or reseed-by-reset on DEV. Run the index guard after seed.
7. On Tony's explicit authenticated-probe release, run Owner + bounded verifier: eight login/logout sessions and 52 audited read inserts are expected, in addition to seven seed identities and 285 seed insert audit rows. Repeat preservation/index checks, then record APPLY receipt. Tony's manual application smoke remains separate; Gate Q/Gate D sequence and the two pending copy-only changes remain unchanged.

**Recovery is bounded:** bootstrap failure rolls back the transaction. A failure after migration commits means STOP; earlier commits remain, failed migration transaction rolls back. Inspect the actual ledger/catalog read-only and prepare a reviewed remaining-chain continuation; the existing Stage 5 partial-failure proof applies. Never reset/replay DEV or blindly retry an unknown COMMIT. The narrower rehearsal does not certify a full-backup restore as recovery; if restore is necessary, Tony/DevOps must arrange a separately verified recovery procedure. Partial seed may leave Auth identities even if its public transaction rolled back: preserve the private cast receipt, inspect and resolve explicitly, never rerun/reset automatically.

## Read-only index commands for the DEV runbook

After the pooler variable correction, with a complete `APBM_DEV_*` prefix, select an absolute evidence directory in the APBM apply lane. These commands themselves make no database writes:

```bash
export RLS_HARNESS_PREFIX=APBM_DEV_
export APBM_TARGET=dev
export APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/DEV_INDEX_RECEIPTS"
APBM_INDEX_GUARD="$PWD/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-application-rehearsal/check-dev-auth-indexes.mjs"
node "$APBM_INDEX_GUARD" before
# After each separately released phase, compare against the same original receipt:
node "$APBM_INDEX_GUARD" after-bootstrap "$APBM_EVIDENCE_DIR/dev-auth-indexes-before.json"
node "$APBM_INDEX_GUARD" after-migrations "$APBM_EVIDENCE_DIR/dev-auth-indexes-before.json"
node "$APBM_INDEX_GUARD" after-seed "$APBM_EVIDENCE_DIR/dev-auth-indexes-before.json"
node "$APBM_INDEX_GUARD" after-probes "$APBM_EVIDENCE_DIR/dev-auth-indexes-before.json"
```

The guard checks each exact expected definition and `indisvalid`, `indisready`, `indislive`, and non-unique status, then compares **all** Auth user indexes against the original receipt. It was exercised against DEV read-only before/after this rehearsal. For dashboard SQL inspection, the underlying query is:

```sql
BEGIN READ ONLY;
SELECT c.relname AS indexname, pg_get_indexdef(i.indexrelid) AS indexdef,
       i.indisvalid, i.indisready, i.indislive, i.indisunique
FROM pg_index i JOIN pg_class c ON c.oid = i.indexrelid
WHERE i.indrelid = 'auth.users'::regclass
  AND c.relname IN ('idx_users_created_at_desc', 'idx_users_email',
                   'idx_users_last_sign_in_at_desc', 'idx_users_name')
ORDER BY c.relname;
ROLLBACK;
```

Require four rows and exact equality with the retained definition receipt before/after. Never repair, omit or recreate one automatically.

## Effects and operating handoff

Only APBM evidence/docs and factory response records changed locally; product files, `.env`, Git and shared DEV stayed untouched. No support ticket/project created. On SCRATCH only: backed up prior state, removed the previous deterministic seed cast/slice, rebuilt the synthetic starting public schema, created five preservation identities and a native-ledger sentinel, ran bootstrap/ledger/migrations/seed, then bounded authenticated proofs. Other existing Auth identity retained. SCRATCH now has 13 Auth users/identities and 12 profiles/roles (five preservation users + seven cast users, plus one unrelated Auth-only identity).

The prior Stage 6 cast credentials no longer identify the refreshed seven SCRATCH users. Use the new private 0600 cast file path recorded in `RESULT.json` for tomorrow's SCRATCH smoke; no passwords are in this evidence. Historical Stage 6 evidence remains intact. `rehearse.mjs` is a one-shot SCRATCH artifact and refuses to overwrite its completed receipt; do not rerun the fixture setup as a DEV command.
