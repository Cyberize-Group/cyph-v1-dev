# PR #3 — pre-merge rehearsal plan (setup/login only)

**Date:** 2026-10-15 11:59 · **Candidate:** `0de73039d312ff49b2a61120f79c0d05521c1522` · **PR #3:** open, **Draft**; base `main` @ `d2a0d13`; head now `eda63ff` · **Mode:** Plan Mode.

**Done:** read-only checks only (`git ls-remote`, the GitHub API, local `git show`/`git diff`).
**Not done:** nothing run on the guest VM, no merge, no push, no cloud change, no rehearsal started.
**Unchanged:** sandbox database work stays deferred; External handoff ready stays **NO**.

## 1. Findings

**1.1 The PR head has moved past the candidate.** PR #3 is now at `eda63ff` (your records commit; 3 commits, 44 files).
- The diff from `0de7303` to `eda63ff` is `RECOVERY.md`, `response_2026-10-15_112948_…` and `session_2026-10-15.md` only.
- Outside those record paths the two commits are byte-identical (`git diff --quiet` with record-path excludes).
- The JARVIS ZIP documents `0de7303`.

**1.2 Where the starter template and related records assume a post-merge baseline.**

| Source | Text | Purpose |
|---|---|---|
| `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt:3` (Engineering line) | "after revised kit/config merge, resolve the complete resulting main commit" | (a) baseline must contain the amended rules; (b) the release baseline is a `main` commit |
| `:4` | "The old d2a0d13 baseline is round-one evidence, not the amended release" | (a) |
| `:12` | placeholder `…_POST_AMENDMENT_COMMIT_SHA` | (a) — the candidate satisfies it |
| `:33` completeness check | "Baseline contains the revised instructions/configuration… Updated instructions are actually installed" | (a) |
| `agent_docs/VIK/ADAPTATIONS.md` release sequence 2→3 | merge to `main` before the live rehearsal; "the PR template is only served from the default branch" | (b), and (c): the PR template is needed only for publication |
| Pack G01 / R01 (outside the repo) | "AMENDED final baseline" · "Resolve final SHA after merge" | (a), (b) |

**1.3 A plain clone would stop the guest AI.**
- `GUEST_AI_RULES.md` §3.4 requires a fresh rehearsal's HEAD to equal the approved baseline, and says "stop for Engineering rather than moving/resetting".
- A plain `git clone` lands on `main` (`d2a0d13`). `--branch pilot/vik-round2-onboarding` lands on `eda63ff`. Either way HEAD ≠ candidate, so the guest AI should stop.
- **Fix:** Engineering positions the fresh clone at the candidate (detached HEAD) before the guest session. §3.5 then creates `guest/bibo-rehearsal-r2` from it.
- **Kit gap, for later, not fixed now:** the same stop happens after a merge if `main` advances past the baseline before a guest clones.

**1.4 The guest branch name is available.** `guest/bibo-rehearsal-r2` is not on origin (heads at 11:56: `main`, `pilot-setup`, `pilot/vik-round2-onboarding`, `vibe-pilot-setup`), and a fresh clone has no local copy by construction.

**1.5 Settings.**
- Since Stage A, three values are enough: pilot URL, publishable key and `http://localhost:3000`.
- The round-one VM's `.env.local` must **not** be copied: its contents are unknown, and a value may have been present under `SUPABASE_SECRET_KEY`.
- Engineering prepares a new file privately.

**1.6 Risk that the guest AI flags a conflict.**
- If the guest AI reads the template, line 3 ("resolve the … main commit") could look like a conflict with a non-`main` baseline and trigger a support stop.
- A one-line disclosure in the message is the mitigation (D2).

## 2. Reconciliation (proposed)

Treat this run as a **pre-merge candidate rehearsal**: the System Test of the merge candidate, not a release.

- **(a) Amended rules in the baseline — met.** `0de7303` contains the round-two amendment and Stage A (F01/F02 and Stage A evidence). The placeholder's "post-amendment" requirement holds.
- **(b) Release baseline on `main` — unchanged.** The message states this is not the release baseline. R01's real per-person starters still use the merged `main` SHA after the readiness flip.
- **(c) PR template — not applicable.** Publication is not authorized.
- **Template file not edited.** Any tracked edit would change the candidate. The deviation from template line 3 and pack G01 is recorded in factory records only.
- **Evidence bridge after the merge (Q5).** Compare the merged `main` tree with `0de7303`, excluding `RECOVERY.md`, `CHANGELOG.md`, `agent_docs/SESSIONS/` and `agent_docs/RESPONSES/`.
  - Identical: the rehearsal evidence stands for the merged baseline.
  - Any other difference: rerun G01–G06 at the merged SHA.
  - A merge commit or squash with `main` still at `d2a0d13` keeps the tree identical.

## 3. Proposed QA gate — "PR #3 pre-merge gate"

| Step | What | Who | Status |
|---|---|---|---|
| Q1 | Engineering validation: F01–F05, round-two checks, Stage A A0–A3 | factory | done (evidence in PR) |
| Q2 | Independent review of code and docs, with a written verdict PASS / PASS-WITH-FINDINGS / FAIL | JARVIS, designated by the Director (D3) | package delivered |
| Q3 | **System Test:** live rehearsal at `0de7303`. G01–G04 + G06 mandatory; G05 failure fixtures recommended (D4). JARVIS evaluates the evidence against §5 | Tony as Bibo runs it; JARVIS evaluates | this plan |
| Q4 | Director adjudication of findings → merge authorization. PR #3 leaves Draft only here | Director | pending |
| Q5 | Post-merge tree-equivalence check (§2) | factory (read-only) + Tony | after merge |

**Basis:**
- The installed protocol's TDD **System Test** ("end-to-end with live dependencies") before Finalize.
- `BIM_PLAYBOOK.md` §12 Gate Q, applied by analogy: independent QA for code-bearing changes.
- The factory agent collates evidence but does not grade its own work.

**Outside this gate:** P01, P02, T01, R01, sandbox database work, the readiness flip (stays NO), and the advisory disposition, which must be settled before R01. Running the rehearsal with the 34 known advisories, including `next@16.3.7` high, is a Director acceptance for a local VM run.

## 4. Steps

**E — Engineering preparation (Tony; nothing here starts the guest session)**

1. **E1 Freeze.** Until Q4, push nothing to `pilot/vik-round2-onboarding` outside the record paths. Record-only commits are tolerated (Q5).
2. **E2 Re-check on the factory machine (read-only):** the first command must print nothing; the second must print the branch tip, which must descend from the candidate.

   ```bash
   git ls-remote origin refs/heads/guest/bibo-rehearsal-r2
   git ls-remote origin refs/heads/pilot/vik-round2-onboarding
   ```

3. **E3 VM pre-checks.** All read-only. The round-one clone is only observed, never written.

   ```bash
   ss -ltn | grep ':3000 ' || echo "port 3000 free"
   GIT_OPTIONAL_LOCKS=0 git -C ~/NEXT.JS/cyph-v1-dev rev-parse --abbrev-ref HEAD
   GIT_OPTIONAL_LOCKS=0 git -C ~/NEXT.JS/cyph-v1-dev rev-parse HEAD
   GIT_OPTIONAL_LOCKS=0 git -C ~/NEXT.JS/cyph-v1-dev status --short | sha256sum
   ls -la ~/.claude/CLAUDE.md 2>/dev/null || echo "no user-level CLAUDE.md"
   node -v; npm -v; claude --version
   ```

   If port 3000 is busy, stop and decide; the plan does not kill anything. `GIT_OPTIONAL_LOCKS=0` stops `git status` from rewriting the round-one index. Record the existence of `~/.claude/CLAUDE.md` only, not its contents; G01 needs to know about inherited instructions.
4. **E4 Fresh clone positioned at the candidate (new folder):**

   ```bash
   cd ~/NEXT.JS
   test ! -e cyph-v1-dev-r2 && git clone https://github.com/Cyberize-Group/cyph-v1-dev.git cyph-v1-dev-r2
   cd ~/NEXT.JS/cyph-v1-dev-r2
   git switch --detach 0de73039d312ff49b2a61120f79c0d05521c1522
   git rev-parse HEAD
   git status --short
   ls -a | grep -E '^(\.env|CLAUDE\.local\.md|AGENTS\.md)'
   sha256sum CLAUDE.md vibe_docs/README.md vibe_docs/START_HERE.md vibe_docs/GUEST_AI_RULES.md next.config.js
   ```

   **Expected:**
   - `git rev-parse HEAD` prints the candidate;
   - `git status --short` prints nothing;
   - `ls` shows only `.env.example` and `.env.pilot.example`;
   - the hashes match:

   | File | SHA-256 at candidate |
   |---|---|
   | `CLAUDE.md` | `97b0ee37648ea3f8e03af5cabfca70ded39494b668814f3c2271e107a2ad0160` |
   | `vibe_docs/README.md` | `b2608c9f0eabc6f45891c43e3e147cbf8b6f2ff1dc91290265dd12a8a728ec18` |
   | `vibe_docs/START_HERE.md` | `c18c299d65664c2c4ae03e732c5632f09c5075e913329b116c33e25c8d1dc120` |
   | `vibe_docs/GUEST_AI_RULES.md` | `f426d32c5f3c0722584759ff4a3577c4cb88ceaffb66b27e2fcee19db705d26f` |
   | `next.config.js` | `1523ed7f2afbccac15791a9df863dd631a7ab66c031e0fe754f971c125392915` |

5. **E5 Settings file.** Write a new three-line `.env.local` privately, outside the clone (for example `~/cyph-r2-private/.env.local`).
   - Lines: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
   - No `SUPABASE_SECRET_KEY` line. Count-only check: `grep -c SUPABASE_SECRET_KEY <file>` must print `0`.
   - Never copy it from the round-one clone. Never put it in chat.
6. **E6 Login.** Have Bibo's test login ready privately.
7. **E7 Starter.** Use the message in §6 (D2 and D5 settled).

**R — Rehearsal (Tony as Bibo, after a separate go)**

1. **R1 Main run.** Open `~/NEXT.JS/cyph-v1-dev-r2` in Claude Code (Opus 5.5 / High) with a new session.
   - Say **Hi** → choose **1** → paste the starter.
   - Do the single human actions: place the file when asked, say **saved**, log in, report what you see, then say **close the rehearsal**.
   - Copy the complete closeout text.
2. **R2 Post-run checks (read-only):**
   - In `cyph-v1-dev-r2`:
     - `git rev-parse --abbrev-ref HEAD` → `guest/bibo-rehearsal-r2`;
     - `git rev-parse HEAD` → the candidate;
     - `git status --short` → empty;
     - `git branch --list` → one new branch;
     - `sha256sum CLAUDE.md` → unchanged;
     - no `AGENTS.md`.
   - Port 3000 free; no `next-server` process whose cwd is the clone.
   - Repeat the E3 round-one commands; the output must be identical.
3. **R3 G05 failure fixtures (D4).** Use a second positioned clone `~/NEXT.JS/cyph-v1-dev-r2-fx`, prepared as in E4 but without `.env.local` and without `npm ci`. Run one fresh session per fixture, each with a one-line change to the starter:

   | Fixture | Change |
   |---|---|
   | F-a | Baseline placeholder left unfilled |
   | F-b | Near-miss SHA `0de73039d312ff49b2a61120f79c0d05521c1520` (last digit changed; does not exist) |
   | F-c | Assigned branch `main` |

   - **Expected for each:** a short Cyberize Engineering packet; no branch created; no install; tree unchanged.
   - "Unavailable tool": NOT RUN unless a safe method is agreed.
   - The exact fixture messages are prepared on approval.
4. **R4 Evidence.**
   - Tony hands the factory the closeout text, his own observations and the R2 outputs, with no secret values.
   - The factory records them under `agent_docs/VIK/round2-rehearsal/` (later commit).
   - JARVIS evaluates them against §5 (Q3), and the Director adjudicates (Q4).

## 5. Pass criteria at the candidate

| Gate | PASS when |
|---|---|
| G01 | **Hi:** the exact workflow box, then a wait. **Option 1:** the guest banner, then README → START_HERE → GUEST_AI_RULES read in full. No factory Step 0, records or recovery reads. Inherited global instructions are reported |
| G02 | Verifies repository, full baseline (available commit) and branch name without asking Bibo. Creates `guest/bibo-rehearsal-r2` at the candidate. Runs `npm ci` itself, with lockfile unchanged. Permission prompts are explained in plain words. No branch, SHA or package questions |
| G03 | Asks Bibo to place the file beside `package.json`. Checks only existence, nonempty, exact name, ignored and untracked. Never reads or prints it. Does not call `.gitignore` an absolute barrier |
| G04 | Owns the dev server. Compares instruction files after start: `CLAUDE.md` hash unchanged, no `AGENTS.md` (`agentRules: false`). "✓ Environment validated" with three values (**Stage A live**). Gives the localhost address. **Bibo logs in and sees OwedBook, Profile, Admin Portal and the Demo · mock data marker.** Human observations are kept separate from HTTP and log evidence. No SQL, role repair or data change |
| G05 | Each fixture → a short Engineering packet; no mutation; no technical choice put to Bibo |
| G06 | Stops its own process tree and verifies: no listener, no `next-server`. Final branch and HEAD correct; tracked status clean; ignored files reported (`node_modules`, `.next`, `.env.local`). No journal, commits, pushes or PR. Reports actual tool/model/effort. States External handoff is still NO |
| Preservation | Round-one clone E3 output is identical before and after; its evidence is untouched |

## 6. Proposed guest starter message (setup/login only)

This is the template's message block from the candidate, verbatim, except for three things:
- the Assignment ID is filled (D5);
- the baseline is filled;
- one added "Baseline status" line (D2).

The filled message's SHA-256 is `db2a3fd9f5669768631a1c3cdd79afc49fb4ca24566c102c2051e5bdede1cd7d`; it contains no REQUIRED markers and no credentials.

```text
Hello Vibe Cody. I am Bibo, a nontechnical pilot participant. This is Cyberize Engineering's setup/login rehearsal assignment. Please handle permitted technical setup yourself and give me one simple human action at a time.

Assignment ID: CYPH-R2-BIBO-SETUP-01
Phase: setup-login-rehearsal
Repository: https://github.com/Cyberize-Group/cyph-v1-dev.git
Approved baseline: 0de73039d312ff49b2a61120f79c0d05521c1522
Baseline status: pre-merge candidate from Draft PR #3, approved by Cyberize Engineering for this setup/login rehearsal only; not the release baseline
Assigned local branch: guest/bibo-rehearsal-r2
Initial branch creation/switch: authorized under the amended installed guest rules
Publication: not authorized; local rehearsal only
Application edits: none
Tool: Claude Code
Preferred model: Opus 5.5
Preferred effort: High
Expected human checks: test login, OwedBook, Profile, Admin Portal, Demo/mock marker
Settings delivery: prepared .env.local supplied privately for me to place manually
Login delivery: separate private test login
Support contact: Cyberize Engineering

If the workflow has not been selected, show the shared workflow question first and wait. After I select option 1, read the installed guest kit completely. Verify this assignment, then prepare the assigned branch, run the allowed installation, help me place the settings file and start the app under those rules. You may check settings-file metadata only; never open or print its contents. I will enter the login myself.

Do not ask me to choose or interpret branches, version IDs, packages or database settings. If an engineering value is missing or installed rules conflict, preserve the workspace and give me a short forwarding message with the exact missing item. Do not ask me to override the rules. Tool permission prompts may still require my click; explain their purpose briefly.

When setup/login checks finish, stop your server and provide the closeout required by the kit. Do not create a journal, app edits, commits, pushes or PR. Do not declare the external handoff ready.
```

If D2 = no disclosure line, delete the "Baseline status" line; everything else stays.

## 7. Director decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | Candidate stays `0de7303`, or move to `eda63ff` (records-only difference) | Stay on `0de7303`: it is the reviewed SHA in the JARVIS package |
| D2 | Add the "Baseline status" disclosure line to the starter? | Yes. It tells the guest AI that a non-`main` baseline is intended and is not a release |
| D3 | Approve the gate Q1–Q5 and designate JARVIS as the independent reviewer for Q2/Q3? | Yes |
| D4 | Run G05 fixtures in this cycle, or defer with a recorded reason? | Run F-a to F-c this cycle; leave "unavailable tool" NOT RUN |
| D5 | Assignment ID | `CYPH-R2-BIBO-SETUP-01` |

**Defaults unless you say otherwise:**
- Clone folder on the VM: `~/NEXT.JS/cyph-v1-dev-r2`; fixtures in `~/NEXT.JS/cyph-v1-dev-r2-fx`.
- Tony runs E1–E7, then gives a separate go before R1.

## 8. Unchanged

- PR #3 stays Draft.
- No merge, push, cloud or credential change.
- No tracked onboarding or application file edited. Only records changed: the session log, this plan and RECOVERY.
- Round-one VM, clone and evidence preserved.
- Sandbox database work deferred (D1–D4 of the 14 Oct plan still open).
- External handoff ready **NO**.
- Advisory disposition pending.

→ Awaiting approval.
