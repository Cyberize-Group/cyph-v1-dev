#!/usr/bin/env bash
# check-qa-env.sh — proves `.env.qa.local` is git-ignored (any rule) AND untracked, and that its KEY NAMES
# match the declared QA_* set (QAM_ENTRY §4 + QA_DEV_DB_URL). Prints key names and verdicts only. Never a value.
# WD: repo root (derived). Exit 0 = PASS, 1 = FAIL, 2 = file absent.
set -u
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "RESULT FAIL not-a-git-repo"; exit 1; }
cd "$ROOT" || exit 1
FILE=".env.qa.local"
REQUIRED=(QA_SCRATCH_SUPABASE_URL QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY QA_SCRATCH_SECRET_KEY QA_SCRATCH_DB_URL
          QA_DEV_SUPABASE_URL QA_DEV_SUPABASE_PUBLISHABLE_KEY QA_DEV_DB_URL)
for h in OWNER1 OWNER3 ADMIN_B2 ADMIN_B3 MEMBER_B1 MEMBER_B2B3 UNRELATED; do REQUIRED+=("QA_${h}_EMAIL" "QA_${h}_PASSWORD"); done
OPTIONAL=(QA_STAGING_URL)   # declared in QAM_ENTRY §4; no deployed STAGING, no consuming test (Gate D out of scope)
fail=0
if git check-ignore -q -- "$FILE"; then echo "IGNORED yes"; else echo "IGNORED no"; fail=1; fi
if git ls-files --error-unmatch -- "$FILE" >/dev/null 2>&1; then echo "UNTRACKED no (TRACKED)"; fail=1; else echo "UNTRACKED yes"; fi
if [ ! -f "$FILE" ]; then echo "FILE absent"; echo "RESULT FAIL"; exit 2; fi
# key names only: field before the first '='; values are never read into a variable
mapfile -t PRESENT < <(grep -E '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=' "$FILE" \
  | sed -E 's/^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=.*/\2/' | sort -u)
missing=(); undeclared=()
for k in "${REQUIRED[@]}"; do printf '%s\n' "${PRESENT[@]}" | grep -qx -- "$k" || missing+=("$k"); done
for k in "${PRESENT[@]}"; do
  printf '%s\n' "${REQUIRED[@]}" "${OPTIONAL[@]}" | grep -qx -- "$k" || undeclared+=("$k")
done
echo "KEYS present=${#PRESENT[@]} required=${#REQUIRED[@]}"
if [ ${#missing[@]} -gt 0 ]; then echo "MISSING ${missing[*]}"; fail=1; fi
if [ ${#undeclared[@]} -gt 0 ]; then echo "UNDECLARED ${undeclared[*]}"; fail=1; fi
[ $fail -eq 0 ] && echo "RESULT PASS" || echo "RESULT FAIL"
exit $fail
