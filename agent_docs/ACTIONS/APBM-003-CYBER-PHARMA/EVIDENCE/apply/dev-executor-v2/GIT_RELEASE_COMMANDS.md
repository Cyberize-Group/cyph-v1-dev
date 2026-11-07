# Tony — exact scoped commit, then conditional DEV APPLY

Current project `yrsuwikjnbmvpznrgydb`; branch `apbm-003`; starting HEAD `49dec499d665125bb8764ccc8ea498c5fdfcdcd1`. No agent Git mutations or DEV writes occurred. The package is reviewable, but DEV APPLY is **BLOCKED**: both fresh uncached settings responses still say `disable_signup=false`. `DEV_SIGNUP_CHECKPOINT.json` records the mismatch, not a waiver or a disabled-signup PASS.

The pooler variables are identical and working. All other independent executor checks pass. Preserve the original accepted narrow rehearsal and exact three-entry ACL ruling; no fresh rehearsal or broader exception is required.

## Stage and review the finite file list

These commands do not apply to DEV. They stage only paths enumerated in `RELEASE_PATHS.txt`, including the approved Stage 6 changes and required evidence. No directory glob, `.env`, backup, private cast file or pending copy-only file is included. Stop if the initial index check fails; review your existing staged work before continuing.

```bash
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
V2=agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2
test "$(git branch --show-current)" = apbm-003
test "$(git rev-parse HEAD)" = 49dec499d665125bb8764ccc8ea498c5fdfcdcd1
git diff --cached --quiet
git diff --check
node --input-type=module -e 'import fs from "node:fs";import crypto from "node:crypto";const p=process.argv[1];for(const [file,h] of Object.entries(JSON.parse(fs.readFileSync(p)))){if(crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")!==h)throw new Error("Reviewed bytes changed: "+file);}console.log("Scoped package hashes PASS");' "$V2/RELEASE_SHA256.json"
git --literal-pathspecs add --pathspec-from-file="$V2/RELEASE_PATHS.txt"
git diff --cached --check
git diff --cached --stat
git diff --cached
```

Review that diff, then commit exactly this staged package:

```bash
git commit -m "APBM-003: prepare reviewed Stage 6 and DEV executor v2"
git diff --quiet
git diff --cached --quiet
git rev-parse HEAD
git status --short
```

Unrelated untracked historical reports may remain; none is silently staged. The runtime input files are all included and become tracked. The commit records preparation and the current blocked checkpoint; it does **not** assert successful DEV APPLY or disabled signup. Do not push or apply automatically.

## Clear the specific failed checkpoint

Open [the intended project's Auth settings](https://supabase.com/dashboard/project/yrsuwikjnbmvpznrgydb/auth/providers). Turn **Allow new users to sign up** off, save, and request read-only verification. [Supabase documents that global switch separately from Confirm Email](https://supabase.com/docs/guides/auth/general-configuration). No waiver is needed. If the dashboard already displays the switch off, re-save it and report the persistence mismatch; the runtime must return `disable_signup=true` before the disabled-evidence gate passes.

A later successful evidence receipt/doc update should be reviewed and committed before execution; that avoids the executor's dirty tracked-worktree stop. Do not change runtime inputs or regenerate the reviewed bundle casually.

## Ordered DEV APPLY — only after disabled-signup PASS and your review commit

In the coordinated maintenance window, with app/Auth user activity and provider migrations paused:

```bash
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
export APBM_RELEASED_RUNNER_COMMIT="$(git rev-parse HEAD)"
export APBM_DEV_MAINTENANCE_READY=yrsuwikjnbmvpznrgydb
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RUN_DEV_APPLY.sh
```

The reviewed script orders: read-only check → private preservation capture → transaction bootstrap → 0047 verification with no ledger → initialize 47 ledger hashes → verify → apply 0048–0052 → verify → recreate approved synthetic test accounts/roles and seed once → verify seed → Owner and real-client access/denial proofs → final read-only receipt.

Expected results:

- Every phase receipt PASS; exact three managed default ACL entries retained; all other catalog checks exact.
- 0047: 16 tables / 19 policies / 13 functions, all 14 new tables empty, no APBM ledger until verification passes.
- 0052: 52 correctly hashed ledger entries, 17 tables / 15 policies / 19 functions.
- Seven new synthetic accounts with global member roles; scoped owners/admins/members and five stores; 250 synthetic claims, 50/store; no Operator account. Original users/profiles/roles/data preserved.
- Seed: 285 attributed insert audit rows. Real-client proof: 19 Owner + 154 access checks, including RPC and cross-store/direct-read denial; eight login/logout sessions and 52 audited read rows.
- Four original Auth indexes unchanged and valid/ready/live. Final receipt satisfies the conditional DEV ACL acceptance; Tony's manual app smoke and Gate Q/D remain separate.

## Recovery — stop on any failed phase

Use the original run directory printed by the script. Do not rerun the entire apply script, reset DEV, delete ledger rows or rerun seed blindly.

```bash
export APBM_EVIDENCE_DIR='/absolute/original/DEV_V2_run_directory'
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh inspect
```

This is read-only; it loads the original proof/cast paths from `RUN_CONTEXT.json`, classifies catalog/ledger state and checks preservation/indexes. Bootstrap pre-commit failures roll back. Unknown COMMIT outcomes must be inspected; forward failures preserve earlier successful commits.

Only if inspection reports exact `MATCH_51` and you approve the already rehearsed remaining 0052 step:

```bash
export APBM_RELEASED_RUNNER_COMMIT="$(git rev-parse HEAD)"
export APBM_DEV_MAINTENANCE_READY=yrsuwikjnbmvpznrgydb
export APBM_DIRECTOR_RECOVERY=yrsuwikjnbmvpznrgydb
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/RECOVERY.sh resume-0052
```

Other partial boundaries or partial seed require scoped review. Full actual DEV restore was not certified by the narrow rehearsal; no automatic restore is included. Full test-account/role recreation details and recovery classifications remain in `HANDOFF.md`.
