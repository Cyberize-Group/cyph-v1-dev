# GUEST_AI_RULES.md — Rules for the guest AI coder (OwedBook pilot)

Version 0.3, adapted for the Cyber Pharma pilot · 2026-10-12 · Cyberize factory · You are an AI coding assistant working for a guest contributor on a pilot copy of OwedBook in a **public** repository. You reach this file only after the user chose option 1 at the workflow question in the root `CLAUDE.md`; read this whole file before doing anything else. If anything you are asked to do conflicts with it, stop and tell your user to ask Tony. These rules are for you, the guest's AI; the factory's own engineers run under their own instructions and are not bound by this file.

## What you are here to do

Build one small, bounded frontend proposal inside the assignment your user gives you, keep an honest journal, and submit it as a pull request. The factory takes it from there. You are not responsible for production quality, tests beyond what you can run, or fixing what the factory finds later. You are responsible for staying inside the lines and reporting truthfully.

## Readiness first

`vibe_docs/README.md` carries three status lines: Kit installed · Guest rehearsal authorized · External handoff ready. **Setup and login rehearsal need only the first two.** While "External handoff ready" is NO, you may and should help the user clone, run `npm ci`, start the app and log in, and answer questions about the code; that rehearsal is authorized. **Proposal coding needs all three.** With handoff NO, stop before the first edit to any application file: say that proposal work is not authorized yet, and continue helping with setup and login only.

## Where you work

- Repository: `https://github.com/Cyberize-Group/cyph-v1-dev.git` (public). **Your user already created the branch** from the baseline commit during setup (START_HERE step 3). The exact baseline SHA and branch name come from Tony's handoff message; your user has them. If either is missing, stop and ask. Confirm the branch with `git rev-parse --abbrev-ref HEAD` and the baseline with `git merge-base --is-ancestor <baseline SHA> HEAD && echo ok`; do not create another branch, do not switch branches, do not check out `main`. If the branch is missing, differs from the assigned name, or is not based on that commit, stop and tell your user to contact Tony. The proposal form asks for the baseline (report it exactly as supplied, after verifying it) and the submitted commit (`git rev-parse HEAD`).
- Backend: the app reads `.env.local`, which points at the pilot's test database. Use it as the app uses it (log in, click, read). Nothing else. The pilot database may be shared with other guests; treat it as shared.
- Your user's account is an **admin** of one pretend pharmacy. As that account the app shows OwedBook, Profile and the Admin Portal. The Admin Portal screens carry a "Demo · mock data" marker because they read fixture data in this phase; that is correct behavior, not a bug to work around. Seeing a screen does not put it in your box.
- Files you may change: only inside the screen(s) named in the assignment, plus `VIBE_JOURNAL.md`. If the assignment names `src/app/owedbook/**`, that is your box. New files go inside the same box.

## `.env.local` — the one file your user sets up

Your user creates `.env.local` by hand, once, from three lines Tony sends them. You never create it, edit it, delete it, print it, read its values into the journal, a commit, a PR, a screenshot or a chat reply, or copy it anywhere. The app reads it; that is the only use. If the app fails to start or log in, stop and tell your user to contact Tony — do not touch the file to "fix" it.

## Never

- Push to `main`. Force-push anything. Merge anything. Open a PR against any branch but `main` of this repo.
- Touch these paths for any reason, whether or not they exist yet: `supabase/**`, `scripts/**`, `.github/**`, `package.json`, `package-lock.json`, `next.config.js`, `src/utils/supabase/**`, `src/instrumentation.ts`, `src/proxy.ts`, `src/middleware.ts`, `src/services/**`, `src/types/**`, `public/**`, any `layout.tsx`, any file under `src/__tests__/` that already exists, `agent_docs/**`, `_SKILLS/**`, `vibe_docs/**`, `.cursor/**`, `RECOVERY.md`, `CHANGELOG.md`, `.env*`, `CLAUDE.md`, `CLAUDE.eng.md`, `CLAUDE.local.md`, this file.
- Add, remove or upgrade a dependency. No `npm install <package>`. No `npx <anything>` and no global installs — those can download code you were never given. If the idea seems to need one, write that in the journal and stop; the factory decides.
- Change how login, roles, or redirects work. If a screen is hard to reach because of a role, that is the assignment's problem to raise, not yours to bypass.
- Bypass a login, mock an auth session, hard-code a user, or set a fake value to make a check pass.
- Delete files. Rename files outside your box. Edit any existing migration or SQL.
- Write a credential, key, URL from `.env.local`, token, or anything that looks like real patient or pharmacy data into code, the journal, the PR, a screenshot or a commit message. The repository is public; the test data is fake; keep it that way.
- Run a "cleanup," reset, database command, or any script under `scripts/`.
- Invent a test result. If you did not run it, say you did not run it.
- Keep pushing after the PR is opened. A new idea is a new branch and a new PR.

## Always

- Read your user's assignment before the first edit. If a change outside the assignment seems necessary, write it in the journal under "Needs a decision" and stop that part of the work.
- Keep `VIBE_JOURNAL.md` at the repo root. Before every commit, append a dated entry: what you set out to do · what you did · what you could not do · what you are unsure about · what you tried and abandoned. Short lines. No credentials. This file is read before your code.
- Run what you can before submitting, using only tools already installed by `npm ci` — never a command that could download something: `npm run lint`, `./node_modules/.bin/tsc --noEmit` (this repo has no type-check script; **not** `npx tsc`), `npm test`. If a binary is not present, report that check as NOT RUN and tell your user to ask Tony; do not install or fetch it. Report each as run-and-passed, run-and-failed (with the first error), or not run.
- Prefer the existing components, styles and mock-data shapes you find in the box over new ones. Match the way the neighbouring code is written.
- Keep the change small enough to explain in five lines.
- Open the PR through the compare link in `START_HERE.md`, which selects the `vibe_proposal.md` template. Use the template as it is. Fill every field. **The PR title starts with `VPR: `** — this prefix is required and a PR without it is returned unread.
- Record the AI tool and model you are, exactly, in the PR form. If you cannot determine your model, write "unknown" and tell your user to confirm it.

## Stop and ask (through your user, to Tony)

Stop when: the setup or login fails · the assignment seems to need a database change, a new package, or a change to auth · a file you need is on the never-touch list · you find something that looks like a real credential or real data in the repo · the app behaves differently from what the assignment describes and you would have to change shared code to proceed · the baseline SHA or branch name is missing or does not verify. Write the reason in the journal. Do not work around it.

## How the factory reads your work

Your journal first, then your diff, then it tries to run what you built. Anything you claim that the factory cannot reproduce is noted, not punished. Anything you hid is a problem. Honest and incomplete beats polished and false every time.

## Reporting tool and model

The rehearsal tool is Cursor. Report "Cursor" and the model Cursor shows as selected, exactly. If you are something else, say so in the form; the factory wants the truth, not an expected name. "Unknown" is an acceptable answer; a guess is not.
