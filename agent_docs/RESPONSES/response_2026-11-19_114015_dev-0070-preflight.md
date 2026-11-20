# DEV migration 0070 — read-only preflight (APBM-007B)

**Verdict: TECHNICALLY READY · RELEASE BLOCKED** (2 Director items). 0070 is NOT applied on DEV. Nothing was applied.

Source: Portal `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/DEV_APPLY_0070/DEV_APPLY_0070_RELEASE.md`.
Run: 2026-11-19 11:39 Asia/Dhaka (05:39Z). Evidence: OwedBook `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-preflight-0070/` (`catalog.json`, `guard-preflight.json`; structure and digests only).

| # | Check | Result |
|---|---|---|
| 1 | Repo state | OwedBook `main` = `origin/main` = `64295a7` (PR #12). Differs from certified `855e0ad` only in `CHANGELOG.md`, `CLAUDE.eng.md`, `CLAUDE.md`, `agent_docs/FACTORY_SESSION_SETUP.md`; `supabase/migrations/` and `scripts/` identical. Workflow setup changes preserved. Working tree NOT clean (see B2) |
| 2 | Target | DEV `yrsuwikjnbmvpznrgydb`: prefix `APBM_DEV_`, API and SQL refs agree (loadEnv). SCRATCH `ihgcsrypblqkwommrkgj` distinct. No production credential set in `.env.local` (only DEV and SCRATCH prefixes); runner accepts only those two refs. Note: app `NEXT_PUBLIC_SUPABASE_URL` also points at DEV |
| 3 | Live ledger | 69, last `0069_007b_reactivation_transfer_registration.sql`; read-only `on` |
| 4 | 0001–0069 vs manifest | Ledger = unchanged ordered prefix of the 70-entry manifest. Manifest entries 1–69 and `bootstrapSHA256` byte-equal to r05 approved manifest. Catalogue `4a1c1719…35b5bf` = r05 after-catalogue; 34 tables / 14 policies / 99 functions. Preservation counts/digests all equal to r05 `guard-post.json` (including `audit_logs`: no app use since 17 Nov) |
| 5 | 0070 SHA-256 | `de0b51c61c4ef255934fc20b6c7abdc5d4b69e1129bbce4a8a15111905edce81` — match. Manifest `134d815d…d749d8f2` — match. All 70 manifest hashes match disk |
| 6 | Runner / prereqs | `dev-verify.mjs`, `dev-apply-guard.mjs`, `apply-forward.mjs`, `dev-compat-check.mjs` present; DEV write gated on `APBM_DIRECTOR_APPLY`; advisory lock 342003; `--before` catalogue gate. No node/Next/Supabase process running |

Guard `ready` / `ledger_0001_0060_unchanged` = false: by design (sheet §4 step 2).

## Blockers

- **B1 — Director release.** No written Director DEV-apply release for 0070 found in Portal records (sheet §2.1). State/closeout say "prepared, not applied".
- **B2 — Clean tree.** Sheet §3 `git status --porcelain` must print nothing. It lists `RECOVERY.md`, `agent_docs/SESSIONS/session_2026-11-19.md`, two `agent_docs/RESPONSES/` files and `EVIDENCE/apply/dev-preflight-0070/`. Director commits them (records only) before the window.
- **Note — HEAD.** Sheet expects `855e0ad` or a main merge commit whose tree equals it. `64295a7` differs only in the four PR #12 doc files; runner checks migrations only. Director to accept.

## Proposed apply (after B1 and B2; Director-run or Director-released)

OwedBook root. Re-runs steps 1–2 into the apply lane, since step 3 needs that lane's `catalog-before.json`.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
git status --porcelain        # must print nothing
git rev-parse HEAD            # 64295a7… (or later records-only commit)
sha256sum supabase/migrations/0070_007b_consent_deadline_paid_time.sql   # de0b51c6…edce81
MAN=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/DEV_APPLY_0070/approved-manifest-0070.json
sha256sum "$MAN"              # 134d815d…d749d8f2
export RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-0070
R05=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-r05
node scripts/dev-verify.mjs --expect "$R05/catalog-after.json" --manifest "$MAN" --through 69
cp "$APBM_EVIDENCE_DIR/catalog.json" "$APBM_EVIDENCE_DIR/catalog-before.json"
node scripts/apbm007b/dev-apply-guard.mjs preflight --manifest "$MAN"
# THE ONLY DEV WRITE — one transaction
APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb node scripts/apply-forward.mjs apply --manifest "$MAN" --before "$APBM_EVIDENCE_DIR/catalog-before.json"
unset APBM_DIRECTOR_APPLY
```

Step 3 must print exactly `Committed 0070_007b_consent_deadline_paid_time.sql`; receipt `forward-apply-*.json` `status` PASS. On failure: do not retry, never reset DEV (sheet §5).

## Post-apply checks (sheet §3 steps 4–7, §4 expectations)

```bash
node scripts/dev-verify.mjs --manifest "$MAN"                       # ledger 70 = manifest; new catalogSHA256
cp "$APBM_EVIDENCE_DIR/catalog.json" "$APBM_EVIDENCE_DIR/catalog-after.json"
node scripts/apbm007b/dev-apply-guard.mjs post --manifest "$MAN" --before "$APBM_EVIDENCE_DIR/guard-preflight.json"
node scripts/apbm007b/dev-compat-check.mjs --mode rolled-back
RLS_HARNESS_PREFIX=APBM_SCRATCH_ APBM_TARGET=scratch APBM_PROJECT_REF=ihgcsrypblqkwommrkgj \
  APBM_EVIDENCE_DIR="$APBM_EVIDENCE_DIR/scratch-reference" node scripts/dev-verify.mjs --manifest "$MAN"
python3 -I -c 'import json,sys;a=json.load(open(sys.argv[1]))["snapshot"];b=json.load(open(sys.argv[2]))["snapshot"];d=[k for k in a if k!="defaultACLs" and a[k]!=b[k]];print("differing sections:",d or "none")' \
  "$APBM_EVIDENCE_DIR/catalog-after.json" "$APBM_EVIDENCE_DIR/scratch-reference/catalog.json"
```

Must show: guard-post `ledger_count` 70, `ledger_last` 0070, `deployment_identity` `["yrsuwikjnbmvpznrgydb"]`, the three `[]` lists empty, every `preservation_equal` true, `test_context_enable_on_dev` `refused 42501` (`ledger_69_equals_manifest` false by design); compat receipt matches r05; SCRATCH `differing sections: none`.

## Effects of this preflight

DEV: two read-only transactions (rolled back); no write. Repo: new untracked lane `EVIDENCE/apply/dev-preflight-0070/` and this response file. No source, fixture, Git, server, provider or deployment change. No credential printed.
