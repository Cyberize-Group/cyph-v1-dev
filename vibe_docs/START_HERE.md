# START HERE — OwedBook Pilot, for Bibo

Version 0.3, adapted for the Cyber Pharma pilot · 2026-10-12 · from the Cyberize factory · This page is for you, the person. The file called `GUEST_AI_RULES.md` next to it is for your AI coder. Read this one first.

> Everything on this page is filled in. The only values that never appear here are the ones Tony sends you directly in the handoff message: your branch name, your baseline commit and your three `.env.local` lines. If you were not given all of them, stop and ask.

## What this is

You asked to help build OwedBook with your own AI coder. This pilot is how we make that safe for everyone. You get a pilot copy of the app, a pilot test database with pretend data, and a simple way to send us ideas as code. We take each idea from there and do the engineering.

Think of it as: **you show us what you want, in working form. We make it production-grade.**

## This repository is public

The pilot repository is public on GitHub. Everything you push — your branch, your commits, your journal, your pull request and its screenshots — can be read by anyone. That is fine for pretend data and code. It is never fine for a key, a password, an `.env.local` line, or anything that looks like real patient or pharmacy data. If one of those ever ends up in a file, stop and tell Tony before pushing.

## What's isolated, and how we know

Your copy of the app is meant to talk only to the pilot test database, with pretend pharmacies and pretend claims. Here is the honest status of that: Tony has observed a successful pilot login on the factory's own clone. A clean guest clone's configuration, the repository permissions and deployment isolation have **not** been verified yet; they are checked during the rehearsal you are part of. We don't claim more than we checked. The pilot database is one database for the pilot: if more than one guest is active at the same time, you share it. If something ever looks like real patient or pharmacy data, it shouldn't be there — stop and tell Tony.

## What you can and can't reach

- You can: run the app on your computer, log in with the test account Tony gives you, change screens inside your assignment, and send us a proposal.
- You can't: change the live app, see or change the real database, add software packages, or merge anything. Those aren't permissions you're missing; they're jobs that stay with the factory on purpose.

## Your AI coder

For this rehearsal your AI coder is **Cursor**. Your AI must write the exact tool and model it used into the proposal form (there's a line for it): "Cursor" and the model Cursor shows as selected. If it can't tell, it writes "unknown" and asks you to confirm. We're not policing this; we need to know what wrote the code when we read it.

Your AI does not need a special kickoff message. When you start a chat, it reads the repository's shared instructions (`CLAUDE.md` at the top of the folder; for Cursor the pointer is `.cursor/rules/workflow-entry.mdc`) and first shows you a boxed question with two numbered options. **Answer `1`.** It then reads this folder's documents itself. If your AI shows you a different instruction file, or skips the question, tell Tony which file it read.

## Setting up (once)

1. Install Node.js **20.9 or newer** (the factory uses 22), and Git, if you don't have them.
2. Clone the pilot repo: `git clone https://github.com/Cyberize-Group/cyph-v1-dev.git` and open the folder.
3. Switch to your starting point **before** installing or running anything. **Use the exact baseline SHA and branch name supplied in Tony's handoff message. If either is missing, stop and ask.** Then run: `git checkout -b <branch name from Tony> <baseline SHA from Tony>`. Everything you install, run and change from here on is on that branch, from that commit — not from whatever the clone happened to open on. You create the branch, once; your AI never creates or switches branches.
4. Run `npm ci`. This installs dependencies from the committed lockfile. Clean-clone installation and runtime verification are pending; if it fails, that is useful information — stop and tell Tony. Don't run `npm install`.
5. **You, by hand, once:** create a file named `.env.local` in the folder and paste in the three lines Tony sends you separately. `.env.pilot.example` at the top of the folder shows the three names and nothing else. Do not add any other line, and do not add `SUPABASE_SECRET_KEY`. Never put those lines in any other file, message, screenshot or commit. Your AI is told not to create, edit, read out or copy this file — if it tries, say no.
6. Run `npm run dev`. Open `http://localhost:3000`.
7. Log in with the test account Tony gave you. It is an **admin** account at a pretend pharmacy.
8. Click around. As an admin account you can see **OwedBook**, your **Profile** page and the **Admin Portal**. The Admin Portal screens carry a "Demo · mock data" marker: in this phase they show pretend fixture data on purpose. That is not a bug and not something to fix.
9. Read your assignment (Tony sends it). It says which screen you may change and what the idea is for.
10. Start a chat with your AI, answer `1` at the boxed question, and tell it where the assignment is. That's the whole kickoff.

If step 6 or 7 fails, stop and tell Tony. Don't let your AI "fix" the login or the setup — that's always a sign something on our side needs attention, not yours.

## Working on an idea

- Your AI works only on the branch you created in step 3. It does not create another branch and does not switch branches.
- Your AI keeps a file called `VIBE_JOURNAL.md` at the top of the folder and adds a few lines before every commit: what it set out to do, what it did, what it couldn't, what it's unsure about. This file is the most useful thing you send us. It tells us what you were going for better than the code does.
- Take a screenshot or a short screen recording of the result as you see it. Attach it to the proposal.

## Sending it to us

- Your AI opens a pull request whose title starts with `VPR: ` — for example `VPR: Add a help panel to the claims list`. The `VPR: ` prefix is required; a PR without it is sent back unread.
- Open the pull request through this link, with your branch name filled in, so the right form appears:
  `https://github.com/Cyberize-Group/cyph-v1-dev/compare/main...<your branch name>?template=vibe_proposal.md&expand=1`
  If the form does not appear, do not write your own; tell Tony.
- The form is pre-filled with questions. Your AI answers them honestly, including which checks it actually ran and anything it changed outside the assignment.
- That's it. You're done. Don't keep pushing changes after you've sent it; if you have a new idea, that's a new proposal.

## What happens next

1. The factory records your proposal exactly as it arrived and freezes it at that commit. A proposal is intake: it is never merged into `main` as it is.
2. Our engineer reads your journal first, then your code, and tries to run it.
3. We decide: use your code as-is, adapt it, or rebuild the feature from your idea. All three are good outcomes. A proposal that gets rebuilt still got the feature into the product.
4. Our engineer does the work on our own branch. Our QA tests it independently. Tony merges it.
5. Tony brings you a short note: what we kept, what we changed and why, how to see the result, and one thing that would help next time. Your proposal PR is closed with that note.

You won't be asked to fix anything. If we have a question about what you meant, Tony will ask you. Code fixes are ours.

## If something feels off

Stop and tell Tony. Especially if your AI wants to touch the database, add a package, download or install a tool, change how login works, edit `.env.local`, or delete files. Those aren't yours to approve, and saying "stop" is the right move every time.

## Questions this page doesn't answer

Ask Tony.
