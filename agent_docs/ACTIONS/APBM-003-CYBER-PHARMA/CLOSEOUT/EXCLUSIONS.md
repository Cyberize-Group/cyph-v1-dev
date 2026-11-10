# Explicit exclusions / local retention

PATH_DISPOSITION.tsv lists every tracked and nonignored untracked file on disk individually. RETAIN_RECORDS.txt is the exact finite records path list; PAGINATION_PATHS.txt is the four-path repair list. No staging glob is used. Existing files already committed need not create a new diff; they are retained in the selected engineering snapshot.

Outside the records list, every changed/untracked path is LEAVE_ALONE, notably agent_docs/SESSIONS/session_2026-11-07.md and inherited agent_docs/RESPONSES files. They are not deleted or staged. The original dirty QA checkout is preserved while engineering integration uses a separate worktree. The campaign journal's inherited APBM entry is preserved along with this authorized append and deliberately retained.

Ignored/local exclusions: .env.local, .env.qa.local, CLAUDE.local.md, .next/, node_modules/, coverage/, *.tsbuildinfo and editor/browser caches remain local. No git add -f. Tracked .env.example templates outside this scope are unchanged baseline, not real credentials.

Private external artifacts kept for Tony, never Git: /tmp/apbm003-dev-v2-cast-20261107T080333Z-1347924.json; /home/moose/Downloads/APBM-003_Tony_Manual_Test_Login_Sheet_2026-11-09.md; /home/moose/Documents/APBM-003_Tony_Manual_Test_Login_Sheet_2026-11-09.pdf; original verified DEV backup at its private location in the backup receipt. Do not stage the Downloads/Documents directories or copy these into the pack. Any future credential-bearing file must be excluded even if its path resembles evidence.

Cody removed only two redundant own temp files listed in CLEANUP_OBSERVATION.json. Other /tmp execution helpers/debris stay outside the repo; no broad deletion. Sanitized helper scripts, failed-attempt logs, SHA indexes, QA ZIPs and screenshots remain durable evidence, not disposable private runtime state. Value/pattern scan verified the retained pack; exact historical archives remain unchanged.

Files added after this inventory require explicit classification/scan and a refreshed finite path list, not a broad staging command. No return to Friday or Claudy is required; do not manufacture renewed certification or cleanup acceptance.
