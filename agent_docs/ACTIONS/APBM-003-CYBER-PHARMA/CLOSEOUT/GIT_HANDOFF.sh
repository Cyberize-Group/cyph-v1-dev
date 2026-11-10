#!/usr/bin/env bash
# REVIEW DRAFT: architect reviews ARCHITECT_REVIEW.md before final commands are issued.
# Tony executes the final visible copy-paste commands after that review.
# Cody has not executed any command in this file.
# Director ruling 2026-11-09: Target One accepted; pagination manually approved.
# No return to Friday/Claudy or renewed cleanup acceptance gates integration.
# Friday certification stays bound to its original candidate; cleanup remains unconfirmed.
set -euo pipefail
source_repo=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
integration_dir=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev-apbm003-integration
main_dir=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev-main-review
repo=Cyberize-Group/cyph-v1-dev
pack=agent_docs/ACTIONS/APBM-003-CYBER-PHARMA
closeout=$source_repo/$pack/CLOSEOUT
original=308247a24e6ddd455842da5cd2e21541d7eae2c1
certified=dc44429f466dedcf35023342f68624c6cee062f0
expected_head=c5061d9f75fa242a3d14913c08d6bbad7173c638
stop() { printf '\nSTOP: %s\n' "$*" >&2; exit 1; }
review() { local answer; printf '\nREVIEW: %s\n' "$*"; read -r -p 'Type REVIEWED to continue; anything else stops: ' answer; [[ $answer == REVIEWED ]] || stop 'Stopped for Director review. No automatic continuation.'; }
merge_review() {
  local target=$1
  git merge --no-ff --no-commit "$target" || stop "Merge needs resolution in $PWD. Preserve both sides, review exact conflicted paths and stage only those resolutions. See RESUME.md; do not reset or rerun APPLY."
  if git rev-parse -q --verify MERGE_HEAD >/dev/null; then
    git diff --cached --stat
    git diff --cached
    review "Merge of $target. Resolve/review before committing."
    git commit -m "APBM-003: reconcile $target without discarding either side"
  fi
}
cd "$source_repo"
[[ $(git branch --show-current) == qa/apbm-003 ]] || stop 'Expected qa/apbm-003; do not switch this dirty checkout.'
[[ $(git rev-parse HEAD) == "$expected_head" ]] || stop 'HEAD changed; refresh this handoff identities before running.'
git diff --cached --quiet || stop 'Index is not empty; preserve and review inherited staged work separately.'
[[ ! -e $integration_dir && ! -e $main_dir ]] || stop 'Integration/main worktree path already exists; inspect it, do not overwrite.'
python3 - "$source_repo" <<'PY'
import hashlib,json,sys
from pathlib import Path
r=Path(sys.argv[1]);p=r/'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/source-hashes.json'
for name,want in json.loads(p.read_text()).items():
 assert hashlib.sha256((r/name).read_bytes()).hexdigest()==want, 'Pagination source changed: '+name
PY
python3 "$closeout/privacy-check.py"
mapfile -t pagination < "$closeout/PAGINATION_PATHS.txt"
mapfile -t records < "$closeout/RETAIN_RECORDS.txt"
# Validate literal, finite manifests before any staging; never expand directories/globs.
python3 - "$source_repo" "$closeout" <<'PY_MANIFEST'
from pathlib import Path
import sys
root=Path(sys.argv[1]); closeout=Path(sys.argv[2])
product=(closeout/'PAGINATION_PATHS.txt').read_text().splitlines()
expected={'src/components/owedbook/OwedBookScreen.tsx','src/components/owedbook/ResultsToolbar.tsx','src/__tests__/apbm-read-states.test.tsx','src/__tests__/owedbook/ResultsToolbar.test.tsx'}
assert len(product)==4 and set(product)==expected, 'Unexpected pagination manifest'
records=(closeout/'RETAIN_RECORDS.txt').read_text().splitlines()
assert records and len(records)==len(set(records)), 'Empty/duplicate records manifest'
assert not set(product)&set(records), 'Product/records overlap'
for name in product+records:
 path=Path(name)
 assert not path.is_absolute() and '..' not in path.parts and not any(ch in name for ch in '*?[]'), 'Nonliteral path'
 assert (root/path).is_file() and not (root/path).is_symlink(), 'Missing/nonregular manifest file: '+name
 assert name in expected or name.startswith('agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/') or name=='agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md', 'Unrelated manifest path: '+name
 assert not any(part.startswith('.env') or part in {'node_modules','.next','coverage','backups','private'} for part in path.parts), 'Private/cache path'
 assert path.suffix.lower() not in {'.bak','.backup','.dump','.sqlbak','.pdf','.pem','.key'}, 'Private/backup file'
PY_MANIFEST
# Step 1: isolate the new approved product repair in its own commit.
git add -- "${pagination[@]}"
git diff --cached --check
git diff --cached --stat
git diff --cached
review 'Only the four pagination source/test paths may be staged. Prior certificate remains bound to dc44429f.'
git commit --only -m "APBM-003: approved OwedBook pagination usability repair" -- "${pagination[@]}"
pagination_commit=$(git rev-parse HEAD)
# Step 2: retain the exact sanitized evidence/closeout path manifest, not a broad glob.
git add --pathspec-from-file="$closeout/RETAIN_RECORDS.txt"
python3 - "$closeout/RETAIN_RECORDS.txt" <<'PY'
import subprocess,sys
allowed=set(open(sys.argv[1]).read().splitlines())
staged=set(subprocess.check_output(['git','diff','--cached','--name-only'],text=True).splitlines())
assert staged<=allowed, 'Unexpected staged path; stop without resetting it'
PY
# Immutable raw QA logs/archives retain original whitespace; check authored closeout prose only.
git diff --cached --check -- "$pack/APBM_STATE.md" "$pack/APBM_JOURNAL.md" "$pack/RETROSPECTIVE.md" "$pack/FOLLOW_UPS.md" "$pack/CLOSEOUT/CLOSEOUT.md"
git diff --cached --stat
review 'Review the complete staged records diff (git diff --cached). Credentials/backups/local login documents excluded; inherited unrelated work remains unstaged.'
git commit -m "APBM-003: retain QA certificate, evidence, Director acceptance and closeout"
qa_records=$(git rev-parse HEAD)
printf 'Pagination commit: %s\nRecords commit: %s\n' "$pagination_commit" "$qa_records"
# Save nonsecret identities for resuming a deliberate stop; outside Git.
printf 'pagination_commit=%q\nqa_records=%q\nintegration_dir=%q\nmain_dir=%q\n' "$pagination_commit" "$qa_records" "$integration_dir" "$main_dir" > /tmp/apbm003-git-identities.sh
# Step 3: fresh remote relationships, separate engineering worktree; no dirty QA switch.
git fetch origin refs/heads/main:refs/remotes/origin/main refs/heads/apbm-003:refs/remotes/origin/apbm-003
git merge-base --is-ancestor "$original" apbm-003 || stop 'Engineering no longer contains expected original; re-review ancestry.'
git worktree add "$integration_dir" apbm-003
cd "$integration_dir"
merge_review origin/apbm-003
# Transfer only C-03 product bytes; never cherry-pick its mixed records commit or merge QA.
git diff --binary "$original" "$certified" -- \
  src/components/admin-portal/DemoMarker.tsx \
  src/components/admin-portal/BillingScreen.tsx \
  src/components/owedbook/OwedBookContext.tsx > /tmp/apbm003-certified-product.patch
git apply --check /tmp/apbm003-certified-product.patch
git apply --index /tmp/apbm003-certified-product.patch
git diff --cached --stat
git diff --cached
review 'Only the three certified C-03 product paths are staged on engineering.'
git commit -m "APBM-003: carry certified C-03 product repair onto engineering"
# The new pagination commit is product/test-only.
git cherry-pick --no-commit "$pagination_commit" || stop 'Pagination cherry-pick conflict; review exact resolutions, then use RESUME.md.'
git diff --cached --stat
git diff --cached
review 'Four pagination paths only; review the cherry-pick result.'
git commit -m "APBM-003: carry Director-approved pagination repair onto engineering"
# Deliberate selected records snapshot; no wholesale QA history/branch merge.
git restore --source="$qa_records" --staged --worktree --pathspec-from-file="$closeout/RETAIN_RECORDS.txt"
git diff --cached --check -- "$pack/APBM_STATE.md" "$pack/APBM_JOURNAL.md" "$pack/RETROSPECTIVE.md" "$pack/FOLLOW_UPS.md" "$pack/CLOSEOUT/CLOSEOUT.md"
git diff --cached --stat
review 'Selected sanitized QA/closeout records on engineering; inspect git diff --cached.'
git commit -m "APBM-003: retain selected QA evidence and closeout on engineering"
# Step 4: reconcile current remote main before PR. No rebase/reset/force push.
merge_review origin/main
git diff --stat origin/main...HEAD
review 'Full engineering versus main integration diff. Preserve both lines; no QA wholesale merge.'
# Run the board on the actual integrated tree. Environment link stays ignored/untracked.
[[ ! -e .env.local ]] || stop 'Unexpected environment file in fresh integration worktree; inspect before replacing anything.'
ln -s "$source_repo/.env.local" .env.local
git check-ignore -q .env.local || stop 'Environment link is not ignored.'
npm ci
npx tsc --noEmit --tsBuildInfoFile /tmp/apbm003-integration.tsbuildinfo
npx eslint .
NEXT_PUBLIC_APBM_DATA_MODE=mock npx jest --runInBand --ci
NEXT_PUBLIC_APBM_DATA_MODE=real npm run build
git diff --quiet && git diff --cached --quiet || stop 'Validation changed tracked files; inspect before push.'
[[ -z $(git ls-files --others --exclude-standard) ]] || stop 'Unexpected untracked integration files; classify them before push.'
integration_head=$(git rev-parse HEAD)
printf 'integration_head=%q\n' "$integration_head" >> /tmp/apbm003-git-identities.sh
# Step 5: protected-main PR route; no direct main push or protection bypass.
git push -u origin apbm-003
pr=$(gh pr list --repo "$repo" --base main --head apbm-003 --state open --json number --jq '.[0].number // empty')
if [[ -z $pr ]]; then
  gh pr create --repo "$repo" --base main --head apbm-003 --title 'APBM-003: Target One implementation and accepted closeout' --body-file "$closeout/PR_BODY.md"
  pr=$(gh pr list --repo "$repo" --base main --head apbm-003 --state open --json number --jq '.[0].number // empty')
fi
[[ -n $pr ]] || stop 'No PR found after creation; inspect GitHub before retrying.'
printf 'pr=%q\n' "$pr" >> /tmp/apbm003-git-identities.sh
gh pr view "$pr" --repo "$repo" --json url,headRefOid,reviewDecision,mergeStateStatus
review 'STOP for an independent approving PR review and resolved threads. Wait here; do not bypass protection. Review current CI/status in GitHub.'
[[ $(gh pr view "$pr" --repo "$repo" --json headRefOid --jq .headRefOid) == "$integration_head" ]] || stop 'PR HEAD changed; re-review the new identity.'
[[ $(gh pr view "$pr" --repo "$repo" --json reviewDecision --jq .reviewDecision) == APPROVED ]] || stop 'Required approving review absent; use RESUME.md after approval.'
gh pr merge "$pr" --repo "$repo" --merge --match-head-commit "$integration_head"
[[ $(gh pr view "$pr" --repo "$repo" --json state --jq .state) == MERGED ]] || stop 'PR not merged; inspect remaining protected-branch requirements.'
# Step 6: sync local main in another worktree; never discard the original dirty checkout.
git fetch origin refs/heads/main:refs/remotes/origin/main
git worktree add "$main_dir" main
cd "$main_dir"
git merge --ff-only origin/main
printf 'APBM-004 starting main revision: '
git rev-parse HEAD
git status --short
# Keep all branches/worktrees and private testing materials. No branch deletion/deployment.
