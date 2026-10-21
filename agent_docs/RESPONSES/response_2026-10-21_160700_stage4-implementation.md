# VIK Stage 4 — implementation ready for Tony's manual test

Status: implemented, uncommitted in the factory working tree on `main` @ `697d8f3`. Nothing has been committed, pushed or merged. External handoff ready stays **NO**.

## 1. Branch for this work (one command, Tony)

`git switch -c` carries the uncommitted edits onto the new branch. Nothing is lost.

```bash
git -C /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev switch -c pilot/vik-stage4-onboarding
```

## 2. What changed

**Guest journey:** Hi → 1 → kit read → the AI proposes `guest/<first name>-<date>` → the guest says yes or gives another name → the AI validates, creates and verifies the branch → "What would you like to change?"

**The AI does automatically:**
- `git fetch origin`;
- branches from the latest `origin/main` with no upstream;
- records the baseline in local branch config (`branch.<name>.vibeBaseline`);
- tidies names into a safe form (`guest/` prefix, lowercase, hyphens);
- avoids reusing an existing name by adding `-2`.

Nothing asks the guest for a commit ID.

**Existing work is protected:**
- A returning guest on a `guest/` branch resumes in place.
- If `main` has uncommitted changes, or the session is on another branch, detached or mid-operation, the AI stops and changes nothing.
- There is no stash, reset, clean or branch deletion.
- An old assignment file is ignored and left untouched.

**Proposal work is open locally.**
- The status field now reads "Guest rehearsal authorized: YES — local setup, login and frontend proposal work; no publishing".
- The old rule that application edits needed External handoff ready is removed. That field stays NO and separate.
- Allowed paths are `src/app/**` and `src/components/**`. These are excluded: API, `(auth)`, providers, auth components, layouts and the existing protected list.

**Preview only when needed.** The runtime check, `npm ci`, the `.env.local` check (metadata only) and the dev server run only when the guest wants to see the app. Credential rules are unchanged.

**Publishing stays closed.** There is no push, PR, merge or deployment. Local checkpoint commits happen only on request, with a journal entry first.

**Files:**
- Rewritten: root `CLAUDE.md` §2, `vibe_docs/README.md`, `START_HERE.md` and `GUEST_AI_RULES.md`.
- The two assignment templates moved to `agent_docs/VIK/retired/`.
- `.gitignore`: comment only.
- PR template: assignment wording replaced.
- Ledger U1–U7 and CHANGELOG updated.
- Cursor rule unchanged.

**Checks run:**
- referenced paths and sections exist;
- the workflow boxes are identical to `HEAD`;
- no leftover references to the retired files;
- the §2 naming and branch commands dry-run in a throwaway repo, covering slugging, `check-ref-format`, `--no-track` creation, the baseline record, the ancestor check and collision detection.

These are consistency checks, not QA.

## 3. Test folder and command

`/home/moose/VIK_TEST/stage4_2026-10-21_160542/cyph-v1-dev`
- It is a clone of a local bare origin (`…/stage4_2026-10-21_160542/origin.git`) whose `main` holds one test-only commit, `63bf940`. That commit is the current kit edits on top of `697d8f3`.
- Fetch and branch creation work, and nothing can reach GitHub.
- It contains no `CLAUDE.local.md`, `.env.local` or `node_modules`.
- The kit files are byte-identical to the factory working tree.

```bash
cd /home/moose/VIK_TEST/stage4_2026-10-21_160542/cyph-v1-dev && claude
```

What to expect:
- Claude Code asks once to trust the folder.
- Say Hi, then choose 1. The suggested branch should be `guest/ahmed-2026-10-21`, taken from this VM's Git user name.
- Try accepting the name, or giving your own, for example "Claims Panel" → `guest/claims-panel`.
- Login preview needs a `.env.local` that you place yourself; I did not copy one.

After your test, tell me pass or fail. On a pass, I update the README evidence line and give you the commit → push → PR → merge → `main` sync commands.
