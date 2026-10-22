#!/bin/sh
# Guest GitHub access for VIK contribution (vibe_docs/GUEST_AI_RULES.md §7).
# The guest's login lives only in this clone: <git dir>/vibe-gh. Global Git and gh settings
# and any existing login on the computer are never read or changed. gh falls back to the
# computer's keyring login when its config folder has no login, so every gh call below is
# refused unless this clone holds the guest's own login. Nothing here prints a token.
set -u
REPO_URL=https://github.com/Cyberize-Group/cyph-v1-dev
GIT_DIR_ABS=$(git rev-parse --absolute-git-dir) || exit 1
VG="$GIT_DIR_ABS/vibe-gh"
SELF="$(git rev-parse --show-toplevel)/vibe_docs/vibe-gh.sh"

run_gh() {
  env -u GH_TOKEN -u GITHUB_TOKEN -u GH_ENTERPRISE_TOKEN -u GITHUB_ENTERPRISE_TOKEN -u GH_HOST \
    GH_CONFIG_DIR="$VG" GIT_CONFIG_GLOBAL="$VG/gitconfig-sandbox" GH_PROMPT_DISABLED=1 gh "$@"
}
signed_in() { [ -f "$VG/hosts.yml" ] && grep -q 'oauth_token:' "$VG/hosts.yml"; }
need_login() { signed_in || { echo "NOT SIGNED IN: run 'login' first."; exit 3; }; }

case "${1:-}" in
  login)
    command -v gh >/dev/null 2>&1 || { echo "GitHub CLI (gh) is not installed."; exit 4; }
    if signed_in; then echo "ALREADY SIGNED IN"; exit 0; fi
    mkdir -p "$VG" && chmod 700 "$VG" && : > "$VG/gitconfig-sandbox" || exit 1
    nohup env -u GH_TOKEN -u GITHUB_TOKEN -u GH_ENTERPRISE_TOKEN -u GITHUB_ENTERPRISE_TOKEN -u GH_HOST \
      GH_CONFIG_DIR="$VG" GIT_CONFIG_GLOBAL="$VG/gitconfig-sandbox" \
      gh auth login --hostname github.com --web --insecure-storage </dev/null >"$VG/login.log" 2>&1 &
    echo $! > "$VG/login.pid"
    i=0; while [ $i -lt 20 ] && ! grep -q 'one-time code' "$VG/login.log" 2>/dev/null; do sleep 1; i=$((i+1)); done
    grep -o 'one-time code: [A-Z0-9-]*' "$VG/login.log" || { echo "No sign-in code yet; see support."; exit 5; }
    echo "Open: https://github.com/login/device"
    ;;
  wait)
    i=0; while [ $i -lt 900 ] && ! signed_in; do
      kill -0 "$(cat "$VG/login.pid" 2>/dev/null)" 2>/dev/null || break; sleep 2; i=$((i+2)); done
    signed_in && echo "SIGNED IN" || { echo "NOT SIGNED IN"; exit 3; }
    ;;
  whoami)
    need_login; run_gh api user --jq .login
    ;;
  setup)
    need_login
    LOGIN=$(run_gh api user --jq .login) && ID=$(run_gh api user --jq .id) || exit 1
    git config --local user.name "$LOGIN" &&
    git config --local user.email "$ID+$LOGIN@users.noreply.github.com" &&
    git config --local --unset-all credential.helper 2>/dev/null
    git config --local credential.helper "" &&
    git config --local --add credential.helper "!sh '$SELF' credential" || exit 1
    echo "identity: $LOGIN <$ID+$LOGIN@users.noreply.github.com> (this clone only)"
    echo "push access: $(run_gh api repos/Cyberize-Group/cyph-v1-dev --jq .permissions.push)"
    ;;
  credential)
    # Called by Git only. Without the guest's own login it answers nothing, so Git cannot use
    # any other credential. Never run this yourself.
    signed_in || exit 0
    run_gh auth git-credential "${2:-get}"
    ;;
  pr-create)
    need_login
    [ $# -eq 4 ] || { echo "usage: pr-create <guest-branch> <title> <body-file>"; exit 2; }
    case "$2" in guest/*) ;; *) echo "Only guest/ branches can be proposed."; exit 2;; esac
    run_gh pr create --repo "$REPO_URL" --base main --head "$2" --title "$3" --body-file "$4"
    ;;
  logout)
    rm -rf "$VG" && echo "Signed out in this clone. The guest can also revoke 'GitHub CLI' under GitHub → Settings → Applications."
    ;;
  *)
    echo "usage: sh vibe_docs/vibe-gh.sh login|wait|whoami|setup|pr-create|logout"; exit 2
    ;;
esac
