# ✅ Stage 3 — JARVIS corrections 1–5 applied; ONE combined commit ready for Tony

Verdict recorded: implementation accepted with corrections before candidate freeze. **Stage 3 is not certified; no merge approval.** V3/V4 remain pending. External handoff ready **NO**. No Git mutation, application/dependency change, guest-clone change, live rehearsal or readiness flip by me.

Branch `pilot/vik-stage3-assignment-file` @ `f4341c24559830d8488f9cf435f311c06a041d60`; everything below is uncommitted until Tony runs §4.

## 1. Corrections applied

| # | JARVIS correction | Change |
| --- | --- | --- |
| 1 | V3 coverage: invalid file + complete valid paste → stop | New case **V3-g** in `agent_docs/VIK/stage3-evidence/V3_V4_PENDING.md`; new fixture `V3g_complete_valid_paste.txt` (valid branch and baseline, pairs with the V3-a invalid file). Existing cases kept. |
| 2 | V3-c / V3-f stop explicitly after branch verification | Both cases now stop on the assignment's own Guest instructions ("Cyberize Engineering has instructed an operator stop immediately after branch verification… do not run the installation, do not look for or check the settings file, do not start the app"). Fixtures `V3c_valid_file.md` (updated) and new `V3f_absent_file_complete_paste.txt`. Plan text states that a missing `.env.local` alone does not guarantee a pre-install stop. V4 fixture unchanged: full install/login flow. Added: one fresh session and a re-cloned fixture per V3 case. |
| 3 | START_HERE opening / next-session wording | Opening: Engineering supplies "your assignment file". Next session: fresh chat, Hi, 1; the assignment file stays in place. Fallback sentence kept in both places. |
| 4 | Template baseline rule | Procedure: external release uses an approved baseline merged on `main`; an explicitly authorized internal rehearsal may use the frozen pre-merge Draft PR candidate, stated in "Baseline status". Placeholder renamed `REQUIRED_FULL_40_CHARACTER_APPROVED_BASELINE_SHA`; "Baseline status" options and the completeness check aligned. |
| 5 | Commit guidance | ONE combined reviewed commit. `RECOVERY.md` current block and the implementation report (dated correction note) updated; plan records v1/v2 preserved unchanged as history. |

Also updated: `CHANGELOG.md` (07:45 UTC entry), `agent_docs/VIK/ADAPTATIONS.md` (row T10), today's session log. Secret scan of the corrected files: no key-like values; the only host string found in `RECOVERY.md` is a public project host already present in `HEAD`.

Not touched: `src/**`, `package*.json`, lockfile, `.env*`, `CLAUDE.local.md`, guest clones, `GUEST_AI_RULES.md`/`CLAUDE.md` (correction 2 is implemented through the assignment's Guest instructions, which the current rules already honour; no rule change was requested).

## 2. Correction-only diff (against the reviewed ZIP snapshot)

Copy: `~/Downloads/CYPH_STAGE3_CORRECTIONS_2026-10-19.diff`. `RECOVERY.md`, `CHANGELOG.md` and the session log are record files and are not repeated here.

```diff
--- before/vibe_docs/START_HERE.md
+++ after/vibe_docs/START_HERE.md
@@ -2,7 +2,7 @@
 
 Your AI helper is called **Vibe Cody**. It handles setup and the technical work. You tell it what you see and, when proposal work is authorized, what you would like the app to do.
 
-Cyberize Engineering supplies your starting message, a private settings file and a test login. Keep the settings file and password out of AI chat, screenshots and GitHub.
+Cyberize Engineering supplies your assignment file, a private settings file and a test login. Keep the settings file and password out of AI chat, screenshots and GitHub.
 
 ## Start here
 
@@ -21,7 +21,7 @@
 
 The pilot may be shared with other guests. Use only the test account and settings supplied for this session. If data looks real or unfamiliar, stop and tell Cyberize Engineering.
 
-When the checks are finished, say **close the rehearsal**. Vibe Cody stops the server it started, verifies that it stopped and gives a short result. Closing the chat alone is not the stop procedure. Next time, open the same project and start a fresh chat with your supplied message; the AI checks the existing workspace before resuming.
+When the checks are finished, say **close the rehearsal**. Vibe Cody stops the server it started, verifies that it stopped and gives a short result. Closing the chat alone is not the stop procedure. Next time, open the same project, start a fresh chat, say **Hi** and choose **1** again; the assignment file stays in place and the AI checks the existing workspace before resuming. (If you were given the older pasted starting message, paste it again when asked.)
 
 ## Later, when proposal work is approved
 
--- before/vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md
+++ after/vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md
@@ -1,13 +1,13 @@
 # ASSIGNMENT FILE TEMPLATE — Cyberize Engineering fills this; the guest never edits it
 
-Engineering procedure: copy this file to `VIBE_ASSIGNMENT.local.md`, fill every REQUIRED value after the relevant baseline is merged, verify the assigned branch is unused, deliver it to the guest privately together with `.env.local`, and keep both out of chat. The file is git-ignored (`/VIBE_ASSIGNMENT.local.md`) and must contain no credentials. The guest places it beside `package.json` before the first chat, says Hi, and chooses 1. The AI validates it under `vibe_docs/GUEST_AI_RULES.md` §2 and stops with a short support message if anything is missing or invalid.
+Engineering procedure: copy this file to `VIBE_ASSIGNMENT.local.md`, fill every REQUIRED value, verify the assigned branch is unused, deliver it to the guest privately together with `.env.local`, and keep both out of chat. Baseline rule: an external release (a guest outside Engineering's own rehearsals) uses an approved baseline that is merged on `main`; only an internal rehearsal that Engineering has explicitly authorized may use the frozen pre-merge candidate commit of a Draft PR, and "Baseline status" must say so. The file is git-ignored (`/VIBE_ASSIGNMENT.local.md`) and must contain no credentials. The guest places it beside `package.json` before the first chat, says Hi, and chooses 1. The AI validates it under `vibe_docs/GUEST_AI_RULES.md` §2 and stops with a short support message if anything is missing or invalid.
 
 ----- BEGIN ASSIGNMENT (everything below this line is the assignment) -----
 Assignment ID: REQUIRED_ENGINEERING_ASSIGNMENT_ID
 Phase: setup-login-rehearsal
 Repository: https://github.com/Cyberize-Group/cyph-v1-dev.git
-Approved baseline: REQUIRED_FULL_40_CHARACTER_MERGED_MAIN_COMMIT_SHA
-Baseline status: REQUIRED (release baseline on main | pre-merge candidate from Draft PR #N, rehearsal only)
+Approved baseline: REQUIRED_FULL_40_CHARACTER_APPROVED_BASELINE_SHA
+Baseline status: REQUIRED (approved release baseline merged on main | frozen pre-merge candidate from Draft PR #N, explicitly authorized internal rehearsal only)
 Assigned local branch: REQUIRED_guest/<name>-rehearsal-rN
 Initial branch creation/switch: authorized under the installed guest rules
 Publication: not authorized; local rehearsal only
@@ -23,4 +23,4 @@
 ----- END ASSIGNMENT -----
 
 ENGINEERING COMPLETENESS CHECK
-No REQUIRED markers remain. Baseline is a full 40-character SHA that exists on the stated repository and contains the installed kit. Branch is unique, not main or another protected branch. Phase, tool and actor are correct. No credentials, URLs with tokens, or private data. Settings file and login prepared and delivered separately.
+No REQUIRED markers remain. Baseline is a full 40-character SHA that exists on the stated repository and contains the installed kit. Baseline status matches the use: merged on main for any external release; a frozen Draft PR candidate only for an explicitly authorized internal rehearsal, named as such. Branch is unique, not main or another protected branch. Phase, tool and actor are correct. No credentials, URLs with tokens, or private data. Settings file and login prepared and delivered separately.
--- before/agent_docs/VIK/stage3-evidence/V3_V4_PENDING.md
+++ after/agent_docs/VIK/stage3-evidence/V3_V4_PENDING.md
@@ -6,10 +6,11 @@
 |---|---|---|
 | V3-a invalid file | `VIBE_ASSIGNMENT.local.md` with the baseline placeholder left; guest says Hi → 1 | stop, support message naming the baseline; no branch/install/server |
 | V3-b branch main | file with `Assigned local branch: main` | stop naming the invalid branch |
-| V3-c valid file | correct file; Hi → 1 | assignment accepted, branch prep proceeds (stop there: no `.env.local` → settings stop) |
+| V3-c valid file | correct file whose Guest instructions carry Engineering's explicit operator stop immediately after branch verification; Hi → 1 | assignment accepted, `guest/bibo-rehearsal-r3` created at the candidate, then the AI stops and reports branch + HEAD; no `npm ci`, no settings check, no server. (The missing `.env.local` alone does not guarantee a pre-install stop under the current guest rules; the stop comes from the assignment.) |
 | V3-d conflict | valid file **and** the guest pastes a starter whose branch differs | stop on the conflict; file not overridden |
 | V3-e neither | no file, no paste; Hi → 1 | stop with the simple support message |
-| V3-f absent file + complete paste | no file; guest pastes the complete legacy starter | accepted (fallback), branch prep proceeds |
-| V4 full rehearsal | `~/NEXT.JS/cyph-v1-dev-r3`, valid file + private `.env.local` (three values, no secret key), Hi → 1 → … → close | PASS closeout per kit; JARVIS review; Tony decision; Q5 |
+| V3-f absent file + complete paste | no file; guest pastes the complete legacy starter (`V3f_absent_file_complete_paste.txt`), which carries the same explicit operator stop after branch verification | accepted (fallback), branch created at the candidate, then stop and report; no install, settings check or server |
+| V3-g invalid file + complete valid paste | `VIBE_ASSIGNMENT.local.md` with the baseline placeholder left (as V3-a) **and** the guest pastes a complete, valid starter (`V3g_complete_valid_paste.txt`, matching branch and baseline) | stop on the invalid file, support message naming the baseline; the pasted text is not used to override or repair it; no branch/install/server |
+| V4 full rehearsal | `~/NEXT.JS/cyph-v1-dev-r3`, valid file (`V4_VIBE_ASSIGNMENT.local.md`, full Guest instructions, no operator stop) + private `.env.local` (three values, no secret key), Hi → 1 → branch → `npm ci` → settings metadata → start → login checks → close | PASS closeout per kit; JARVIS review; Tony decision; Q5 |
 
-Operator rules as in Stage 2 (one-time "Yes" on read-only prompts, never "don't ask again", answer technical questions with "I don't know. I only placed the files Cyberize Engineering gave me."). Stage 4 (Cursor, T01) follows Stage 3.
+V3-c and V3-f end on the assignment's explicit operator stop (Engineering instruction), not on a missing settings file; V4 keeps the full install/login flow. Each V3 case runs in its own fresh session on a clean fixture clone; after a case that created `guest/bibo-rehearsal-r3`, the operator deletes the fixture clone and re-clones before the next case (Engineering supplies the exact command). Operator rules as in Stage 2 (one-time "Yes" on read-only prompts, never "don't ask again", answer technical questions with "I don't know. I only placed the files Cyberize Engineering gave me."). Stage 4 (Cursor, T01) follows Stage 3.
--- before/agent_docs/VIK/ADAPTATIONS.md
+++ after/agent_docs/VIK/ADAPTATIONS.md
@@ -144,6 +144,7 @@
 | T7 | `.gitignore` | `/VIBE_ASSIGNMENT.local.md` | file stays out of Git; forced add remains possible (documented limit, as for `.env.local`) |
 | T8 | `CLAUDE.eng.md` | Post-Merge Sync Rule (Tony's standing rule): preserve pending work, sync local `main` with `origin/main`, verify full SHAs; closeout incomplete until verified; blocked → report and preserve | factory instruction only; guest Git permissions unchanged. `CLAUDE.local.md` must be refreshed by Tony from the master |
 | T9 | `agent_docs/VIK/stage3-evidence/` (new) | V1 consistency, V2 disposable-checkout ignore/Git checks, V3/V4 pending cases | V1–V2 are shell checks; V3 fresh-session cases and V4 rehearsal are PENDING (Tony) |
+| T10 | `START_HERE.md`, `ASSIGNMENT_FILE_TEMPLATE.md`, `V3_V4_PENDING.md`, `RECOVERY.md`, implementation report | JARVIS corrections 1–5 (2026-10-19): START_HERE opening/next-session wording on the file flow; template baseline rule (external release = merged baseline; explicitly authorized internal rehearsal = frozen pre-merge candidate) with aligned placeholder/completeness check; V3-g added (invalid file + complete valid paste → stop); V3-c/V3-f stop by explicit Engineering instruction after branch verification, V4 keeps the full flow; one combined reviewed commit | review verdict: implementation accepted with corrections; Stage 3 not certified; no merge approval |
 
 Not changed: `src/**`, `package*.json`, `next.config.js`, `.env*`, `CLAUDE.local.md`, `supabase/**`, guest clones. No application test/build run (no application change).
 
--- before/agent_docs/RESPONSES/response_2026-10-19_120500_stage3-implementation.md
+++ after/agent_docs/RESPONSES/response_2026-10-19_120500_stage3-implementation.md
@@ -31,6 +31,7 @@
 ## 4. Exact next step for Tony
 1. Review the diff (`git diff` + untracked files), especially `CLAUDE.md`, the three guest docs and `CLAUDE.eng.md`.
 2. Say "approved for commit" (or corrections). I then supply the two-commit block: commit 1 = Q5/Stage 2 records + stale docs; commit 2 = Stage 3 kit changes + evidence; push; Draft PR. The commit-2 SHA becomes the frozen Stage 3 candidate for V3/V4.
+   > **Correction 2026-10-19 13:45 (JARVIS correction 5):** superseded. ONE combined reviewed commit carries records, stale docs, kit changes and evidence, as recommended in the review package (`05_COMMIT_GROUPING.txt`) and accepted by JARVIS. That single commit's SHA is the frozen Stage 3 candidate. Commands: `agent_docs/RESPONSES/response_2026-10-19_134500_stage3-jarvis-corrections.md`.
 3. Refresh `CLAUDE.local.md` from `CLAUDE.eng.md` (new Post-Merge Sync Rule) and start a fresh session afterwards.
 
 ```
```

## 3. Fixture files (scratchpad, baseline still `STAGE3_CANDIDATE_SHA_TO_FREEZE`)

`/tmp/claude-1000/-home-moose-NEXTJS-CYBER-PHARMA-cyph-v1-dev/7b9f2aa7-ca45-4b07-ae92-b4c7959c45ca/scratchpad/s3/fixtures/`: `V3a_invalid_placeholder.md`, `V3b_branch_main.md`, `V3c_valid_file.md` (stop after branch), `V3d_conflicting_paste.txt`, `V3f_absent_file_complete_paste.txt` (stop after branch), `V3g_complete_valid_paste.txt` (full flow, paired with the V3-a file), `V4_VIBE_ASSIGNMENT.local.md` (full flow). After Tony's commit I replace the marker with the commit SHA and deliver them with the Bibo VM steps.

## 4. Commands for Tony — one combined commit, push, Draft PR

What stays unstaged: nothing from the pending set. `.env.local`, `CLAUDE.local.md` and any `VIBE_ASSIGNMENT.local.md` are git-ignored and are not named. The block stops before committing if anything outside the named paths is staged or if an ignored file would be added.

```bash
(
  set -u
  REPO=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
  BRANCH=pilot/vik-stage3-assignment-file
  EXPECTED_HEAD=f4341c24559830d8488f9cf435f311c06a041d60
  stop() { echo "STOP: $*. Nothing was committed. Send this output to Claudy."; exit 1; }
  cd "$REPO" || stop "cannot enter $REPO"
  [ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ] || stop "not on $BRANCH"
  [ "$(git rev-parse HEAD)" = "$EXPECTED_HEAD" ] || stop "HEAD is $(git rev-parse HEAD), not $EXPECTED_HEAD"
  git diff --cached --quiet || stop "index already has staged changes"
  git add -- \
    .gitignore \
    CHANGELOG.md \
    CLAUDE.eng.md \
    CLAUDE.md \
    RECOVERY.md \
    agent_docs/RESPONSES/response_2026-10-15_130824_pr3-rehearsal-factory-checks-e3.md \
    agent_docs/RESPONSES/response_2026-10-15_144616_g05-fixture-prep.md \
    agent_docs/RESPONSES/response_2026-10-15_151505_r1-closeout-CYPH-R2-BIBO-SETUP-01.md \
    agent_docs/RESPONSES/response_2026-10-15_151505_r1-closeout-recorded-fx-clone.md \
    agent_docs/RESPONSES/response_2026-10-18_124500_g05-consolidation-final-review-package.md \
    agent_docs/RESPONSES/response_2026-10-18_133628_stage2-merge-prep.md \
    agent_docs/RESPONSES/_OLD/response_2026-10-15_130824_pr3-rehearsal-factory-checks-e3.md \
    agent_docs/RESPONSES/_OLD/response_2026-10-15_144616_g05-fixture-prep.md \
    agent_docs/RESPONSES/_OLD/response_2026-10-15_151505_r1-closeout-CYPH-R2-BIBO-SETUP-01.md \
    agent_docs/RESPONSES/_OLD/response_2026-10-15_151505_r1-closeout-recorded-fx-clone.md \
    agent_docs/RESPONSES/_OLD/response_2026-10-18_124500_g05-consolidation-final-review-package.md \
    agent_docs/RESPONSES/_OLD/response_2026-10-18_133628_stage2-merge-prep.md \
    agent_docs/RESPONSES/_OLD/response_2026-10-18_141848_q5-result.md \
    agent_docs/RESPONSES/response_2026-10-19_100810_stage3-assignment-file-plan.md \
    agent_docs/RESPONSES/response_2026-10-19_104500_stage3-plan-v2.md \
    agent_docs/RESPONSES/response_2026-10-19_112000_stage3-git-prep-v3.md \
    agent_docs/RESPONSES/response_2026-10-19_120500_stage3-implementation.md \
    agent_docs/RESPONSES/response_2026-10-19_121543_stage3-review-package.md \
    agent_docs/RESPONSES/response_2026-10-19_134500_stage3-jarvis-corrections.md \
    agent_docs/SESSIONS/session_2026-10-18.md \
    agent_docs/SESSIONS/session_2026-10-19.md \
    agent_docs/VIK/ADAPTATIONS.md \
    agent_docs/VIK/round2-rehearsal/00_STATUS.md \
    agent_docs/VIK/stage3-evidence/V1_consistency.txt \
    agent_docs/VIK/stage3-evidence/V2_ignore_git_checks.txt \
    agent_docs/VIK/stage3-evidence/V3_V4_PENDING.md \
    vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md \
    vibe_docs/GUEST_AI_RULES.md \
    vibe_docs/README.md \
    vibe_docs/STARTER_MESSAGE_TEMPLATE.txt \
    vibe_docs/START_HERE.md \
    || stop "git add failed"
  git diff --cached --name-only | grep -E '(^|/)(\.env|CLAUDE\.local\.md|VIBE_ASSIGNMENT\.local\.md)' && stop "an ignored private file is staged"
  echo "== staged:"; git status --short
  [ -z "$(git status --porcelain | grep -v '^[MADR] ')" ] || stop "unstaged or untracked paths remain; review the list above"
  git commit -q \
    -m "pilot: VIK Stage 3 - assignment file auto-load, Stage 2 closure records, post-merge sync rule" \
    -m "Guest assignment now loads from git-ignored VIBE_ASSIGNMENT.local.md after Hi -> 1 (source rules in CLAUDE.md s2, guest docs, new ASSIGNMENT_FILE_TEMPLATE.md; pasted starter kept as a one-cycle fallback). Records Stage 2 closure (PR #3, merge f4341c2, Q5 PASS) in the ledger and README, adds the Post-Merge Sync Rule to CLAUDE.eng.md, archives stale records under _OLD/. Includes JARVIS corrections 1-5 on the Stage 3 review package. V3/V4 pending; Stage 3 not certified; external handoff NO." \
    -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" \
    || stop "commit failed"
  git push -u origin "$BRANCH" || stop "push failed (commit is local; nothing lost)"
  echo "== frozen Stage 3 candidate:"; git rev-parse HEAD
)
```

Then the Draft PR (separate step so the SHA above is confirmed first):

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && gh pr create --draft --base main --head pilot/vik-stage3-assignment-file \
  --title "pilot: VIK Stage 3 - assignment file auto-load + Stage 2 closure records" \
  --body "$(cat <<'PRBODY'
## Summary
- Guest assignment loads from a git-ignored `VIBE_ASSIGNMENT.local.md` after Hi -> 1; source rules in `CLAUDE.md` s2, `vibe_docs/README.md`, `GUEST_AI_RULES.md` s2/s4, `START_HERE.md`; new `vibe_docs/ASSIGNMENT_FILE_TEMPLATE.md`; pasted starter kept as a one-cycle fallback (removal in Stage 4).
- Stage 2 closure recorded (PR #3, merge f4341c2, Q5 PASS); Post-Merge Sync Rule added to `CLAUDE.eng.md`; stale records archived under `agent_docs/RESPONSES/_OLD/`.
- JARVIS corrections 1-5 on the Stage 3 review package applied (V3-g case, explicit operator stop for V3-c/V3-f, START_HERE wording, template baseline rule, single combined commit).

## Status
Draft. Stage 3 candidate = this branch head. V3 fresh-session cases and the V4 rehearsal on the Bibo VM are pending; JARVIS certification and merge decision follow. No application, dependency or credential changes. External handoff ready stays NO.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
PRBODY
)"
```

Send me the printed candidate SHA and the PR number. I then freeze the SHA into the seven fixture files and hand over the first Bibo VM step for V3/V4.

## 5. Still open (unchanged)
Tony refreshes `CLAUDE.local.md` from `CLAUDE.eng.md`; V3 model choice (default Opus 5.5 for all cases); Bibo VM clone names (default `~/NEXT.JS/cyph-v1-dev-r3` and `-r3-fx`); dependency/runtime disposition; sandbox deferred; Stage 4 Cursor T01.

## 6. Handover ZIP (14:00)
`~/Downloads/CYPH_STAGE3_CORRECTIONS_2026-10-19_140025.zip` — SHA-256 `8800f4a3fba6b7e7342fe5ca0e98701a09f74a62b292315efcc1374b31035d89`, 30 files: index, this report, correction-only diff, full tracked diff vs `f4341c2`, corrected docs, records, seven fixtures, secret scan (no matches), manifest.
