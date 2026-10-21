# ASSIGNMENT FILE TEMPLATE — Cyberize Engineering fills this; the guest never edits it

Engineering procedure: copy this file to `VIBE_ASSIGNMENT.local.md`, fill every REQUIRED value, verify the assigned branch is unused, deliver it to the guest privately together with `.env.local`, and keep both out of chat. Baseline rule: an external release (a guest outside Engineering's own rehearsals) uses an approved baseline that is merged on `main`; only an internal rehearsal that Engineering has explicitly authorized may use the frozen pre-merge candidate commit of a Draft PR, and "Baseline status" must say so. The file is git-ignored (`/VIBE_ASSIGNMENT.local.md`) and must contain no credentials. The guest places it beside `package.json` before the first chat, says Hi, and chooses 1. The AI validates it under `vibe_docs/GUEST_AI_RULES.md` §2 and stops with a short support message if anything is missing or invalid.

----- BEGIN ASSIGNMENT (everything below this line is the assignment) -----
Assignment ID: REQUIRED_ENGINEERING_ASSIGNMENT_ID
Phase: setup-login-rehearsal
Repository: https://github.com/Cyberize-Group/cyph-v1-dev.git
Approved baseline: REQUIRED_FULL_40_CHARACTER_APPROVED_BASELINE_SHA
Baseline status: REQUIRED (approved release baseline merged on main | frozen pre-merge candidate from Draft PR #N, explicitly authorized internal rehearsal only)
Assigned local branch: REQUIRED_guest/<name>-rehearsal-rN
Initial branch creation/switch: authorized under the installed guest rules
Publication: not authorized; local rehearsal only
Application edits: none
Tool: Claude Code
Preferred model: Opus 5.5
Preferred effort: High
Expected human checks: test login, OwedBook, Profile, Admin Portal, Demo/mock marker
Settings delivery: prepared .env.local supplied privately, placed by the guest beside package.json
Login delivery: separate private test login
Support contact: Cyberize Engineering
Guest instructions: Handle permitted technical setup yourself and give me one simple human action at a time. Verify this assignment, prepare the assigned branch, run the allowed installation, confirm the settings file by metadata only, start the app under the installed rules and tell me the local address; I enter the login myself. Do not ask me to choose or interpret branches, version IDs, packages or database settings. If a value is missing or the installed rules conflict, preserve the workspace and give me a short forwarding message. When the checks finish, stop your server and give the closeout required by the kit. No journal, app edits, commits, pushes or PR. Do not declare the external handoff ready.
----- END ASSIGNMENT -----

ENGINEERING COMPLETENESS CHECK
No REQUIRED markers remain. Baseline is a full 40-character SHA that exists on the stated repository and contains the installed kit. Baseline status matches the use: merged on main for any external release; a frozen Draft PR candidate only for an explicitly authorized internal rehearsal, named as such. Branch is unique, not main or another protected branch. Phase, tool and actor are correct. No credentials, URLs with tokens, or private data. Settings file and login prepared and delivered separately.
