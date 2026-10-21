<!-- Guest proposal (VPR) template. Selected with ?template=vibe_proposal.md on the compare URL; see vibe_docs/START_HERE.md. Title must start with "VPR: " — for example "VPR: Add a help panel to the claims list". A PR without that prefix is returned unread. The AI fills this form. Every field, honestly. "Unknown" and "not run" are valid answers; blanks and guesses are not. -->

## Proposal

**Guest branch:** <the `guest/` branch name>

**AI tool, model and effort actually used:** <tool / model id / effort — for example Claude Code / claude-opus-5-5 / High; "unknown" for any part you cannot verify — confirmed by user: yes/no>

**What problem does this solve for the pharmacy?**
<one or two sentences, in the user's words>

**What should the user be able to do now?**
<one or two sentences>

**How can we see it?**
<steps to reach it after `npm run dev` and login as the pilot test account, plus a screenshot or recording attached to this PR>

## Commits

**Baseline commit (`origin/main` when the AI created the branch, recorded in `git config branch.<name>.vibeBaseline`; the AI verified it with `git merge-base --is-ancestor`):** <40-character SHA>

**Submitted commit (`git rev-parse HEAD` on this branch):** <40-character SHA>

**Journal:** `VIBE_JOURNAL.md` updated before every commit: yes / no

## What the AI did and didn't do

**Files changed (all of them):**
- <path>

**Changed anything outside the allowed paths in `vibe_docs/GUEST_AI_RULES.md` §6?** <no / yes — list each path and why>

**Checks:**
| Check | Result |
| --- | --- |
| `npm run lint` | passed / failed: <first error> / not run |
| `./node_modules/.bin/tsc --noEmit` (installed binary; no download) | passed / failed: <first error> / not run |
| `npm test` | passed (<n> tests) / failed: <first error> / not run |

**What works:** <…>

**What is incomplete or unsure:** <…>

**Needs a decision from the factory (things the AI stopped on):** <none / list>

## Confirmation (AI fills, user reads)

- [ ] No credential, key, `.env.local` value, token, or real-looking data appears in this PR, the journal, the commits or the screenshots. This repository is public.
- [ ] No dependency added or changed. No file on the never-touch list in `vibe_docs/GUEST_AI_RULES.md` was touched. `.env.local` was not created, edited or read by the AI.
- [ ] Nothing was bypassed, mocked or hard-coded to make login or a check pass.
- [ ] The user has seen the screenshot and agrees it shows what they wanted.

<!-- Factory use only, below this line. The factory assigns a VPR number at intake, freezes this PR's head, and does its own engineering and QA. This PR is closed with a note when that is done; it is never merged directly into main. -->
