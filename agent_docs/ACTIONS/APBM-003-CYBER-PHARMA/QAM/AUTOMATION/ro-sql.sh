#!/usr/bin/env bash
# QAM Q2 read-only DEV SQL fence (Claudy; plan §5 / AM-5).
#   ro-sql.sh [-t] [--attack-sql-fence] < statements.sql
# Reads QA_DEV_DB_URL from .env.qa.local (never printed), asserts the URL resolves to DEV
# (host db.<ref>.supabase.co or pooler user postgres.<ref>), opens the session READ ONLY, runs
# BEGIN READ ONLY with a 15s statement timeout, asserts SQL-side that the connection holds the
# DEV cast fingerprint (7 DEV auth uids), refuses any statement that is not SELECT/WITH/SHOW/
# EXPLAIN/VALUES/TABLE, and always ROLLBACKs. Exit 0 ok; 2 env/URL fence; 3 SQL fence; 4 statement refused.
# --attack-sql-fence: skip the URL-side check and use QA_SCRATCH_DB_URL so the SQL-side fence is exercised (must refuse).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; REPO="$(cd "$HERE/../../../../.." && pwd)"
DEV_REF=yrsuwikjnbmvpznrgydb; TUPLES=""; ATTACK=0
for a in "$@"; do case "$a" in -t) TUPLES="-At";; --attack-sql-fence) ATTACK=1;; *) echo "ro-sql: unknown arg" >&2; exit 2;; esac; done
F="$REPO/.env.qa.local"; [ -f "$F" ] || { echo "ro-sql: STOP-ENV .env.qa.local absent" >&2; exit 2; }
KEY=QA_DEV_DB_URL; [ $ATTACK = 1 ] && KEY=QA_SCRATCH_DB_URL
# value forms: KEY='value'  # comment | KEY="value" | KEY=value
URL="$(awk -F= -v k="$KEY" '$1==k{sub(/^[^=]*=/,"");print;exit}' "$F" | sed -E "s/^'([^']*)'.*$/\\1/; t; s/^\"([^\"]*)\".*$/\\1/; t; s/[[:space:]]+#.*$//")"
[ -n "$URL" ] || { echo "ro-sql: STOP-ENV $KEY missing" >&2; exit 2; }
HOST="$(printf '%s' "$URL" | sed -E 's#^[a-z]+://([^@]*@)?([^/:?]+).*#\2#')"; USERP="$(printf '%s' "$URL" | sed -E 's#^[a-z]+://([^:@/]+).*#\1#')"
if [ $ATTACK = 0 ]; then
  if [ "$HOST" != "db.$DEV_REF.supabase.co" ] && ! { [[ "$HOST" =~ \.pooler\.supabase\.com$ ]] && [ "$USERP" = "postgres.$DEV_REF" ]; }; then echo "ro-sql: STOP-IDENTITY URL does not resolve to DEV ($DEV_REF)" >&2; exit 2; fi
fi
SQL="$(cat)"
# statement filter: strip comments, split on ';', each non-empty statement must start with an allowed verb
CLEAN="$(printf '%s\n' "$SQL" | sed -E 's/--.*$//')"
while IFS= read -r -d ';' stmt || [ -n "$stmt" ]; do
  s="$(printf '%s' "$stmt" | tr '\n' ' ' | sed -E 's/^[[:space:]]+//;s/[[:space:]]+$//')"; [ -z "$s" ] && continue
  if ! printf '%s' "$s" | grep -qiE '^(select|with|show|explain|values|table)\b'; then echo "ro-sql: REFUSED non-read statement: $(printf '%s' "$s" | cut -c1-40)" >&2; exit 4; fi
  if printf '%s' "$s" | grep -qiE '\b(insert|update|delete|truncate|alter|drop|create|grant|revoke|copy|call|do|set|reset|lock|vacuum|analyze|refresh|comment|security|reindex|cluster|prepare|execute|deallocate|listen|notify|load|set_config|pg_sleep)\b'; then echo "ro-sql: REFUSED keyword in statement: $(printf '%s' "$s" | cut -c1-40)" >&2; exit 4; fi
done <<< "$CLEAN"
UIDS="'eadf5edc-3f00-4151-a3e5-823990ea0300','1d512afb-abc7-4083-8b49-06e6a41a3401','1185e570-f8d7-4c06-ad40-205d232c8002','4d2b3fc9-a2a2-4540-a008-094211503dd7','1b4ffd9e-c023-4960-9e04-1eab0aa4fdd2','efe49114-095e-4d3d-8f9a-c767f34098af','c322c8da-85af-44fa-8b98-375c22385f9d'"
SCRIPT="$(mktemp)"; trap 'rm -f "$SCRIPT"' EXIT
{
  echo "SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY;"
  echo "BEGIN READ ONLY;"
  echo "SET LOCAL statement_timeout = '15s';"
  echo "\\set QUIET on"
  echo "select (select count(*) from auth.users where id in ($UIDS)) = 7 and current_setting('transaction_read_only') = 'on' as fence_ok \\gset"
  echo "\\set QUIET off"
  echo "\\if :fence_ok"
  printf '%s\n' "$SQL"
  echo "\\else"
  echo "\\echo ro-sql: STOP-IDENTITY SQL-side fence failed (DEV cast fingerprint absent or not read-only); no statement executed"
  echo "\\set QUIET on"
  echo "ROLLBACK;"
  echo "select 1/0 as fence_refusal;"
  echo "\\endif"
  echo "\\set QUIET on"
  echo "ROLLBACK;"
} > "$SCRIPT"
psql "$URL" -X -q -v ON_ERROR_STOP=1 $TUPLES -f "$SCRIPT" 2> >(sed -E 's#(postgres(ql)?://)[^ ]+#\1<redacted>#g' >&2)
