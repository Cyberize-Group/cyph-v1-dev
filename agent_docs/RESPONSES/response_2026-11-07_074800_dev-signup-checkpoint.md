**BLOCKED only on signup verification.** Both uncached Auth responses for `yrsuwikjnbmvpznrgydb` returned HTTP 200 with `disable_signup=false` at 07:43:38 UTC. I recorded the mismatch; no waiver was requested or recorded.

Both DB variables match the working Session pooler. All other independent checks pass: reviewed inputs, accepted rehearsal, three-entry ACL scope, backup/preserved data, grants, schema and four Auth indexes.

Next action: open [Dev v1 Auth settings](https://supabase.com/dashboard/project/yrsuwikjnbmvpznrgydb/auth/providers), turn **Allow new users to sign up** off, save, and request a recheck. This is the [global signup setting](https://supabase.com/docs/guides/auth/general-configuration).

The [full scoped Git, APPLY and recovery commands](/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/GIT_RELEASE_COMMANDS.md) are ready. To stage only the reviewed files:

```bash
set -euo pipefail
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
V2=agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2
git diff --cached --quiet
git --literal-pathspecs add --pathspec-from-file="$V2/RELEASE_PATHS.txt"
git diff --cached --check
git diff --cached
```

After reviewing that diff:

```bash
git commit -m "APBM-003: prepare reviewed Stage 6 and DEV executor v2"
```

**After signup-disabled evidence passes and the final reviewed package is committed**, run during the documented maintenance window:

```bash
export APBM_RELEASED_RUNNER_COMMIT="$(git rev-parse HEAD)"
export APBM_DEV_MAINTENANCE_READY=yrsuwikjnbmvpznrgydb
bash "$V2/RUN_DEV_APPLY.sh"
```

Expected order: bootstrap → verify 0047 before ledger → initialize ledger → apply 0048–0052 → recreate seven synthetic test accounts/roles and seed 250 claims → 19 Owner and 154 access checks → final PASS receipt. Original data and all four indexes must remain intact.

I made no Git mutations, shared DEV writes, signup attempts, or settings changes.
