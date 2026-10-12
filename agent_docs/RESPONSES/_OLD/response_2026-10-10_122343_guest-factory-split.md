# Guest/Factory Instruction Split — Execution Report

**Date:** 2026-10-10 12:23 (+06) · **Branch:** `pilot-setup` @ `297a011` · **Origin:** `https://github.com/Cyberize-Group/cyph-v1-dev.git`. All three match the brief.
**Claude Code:** 2.1.296

## 1. Engineering master

**`CLAUDE.eng.md`** (repo root) is the only candidate. No other plausible copy exists.
Before this work it was byte-identical to the old `CLAUDE.md` (sha256 `1211204f76ca183e74f86a6b77a25f2c68d357d91e5d5f930c982dc7980cc4c1`).
It is still unchanged, untracked, and eligible for commit.

## 2. Changed files

| File | Change |
| ---- | ------ |
| `CLAUDE.md` | Replaced with a 30-line shared entry: a role table, a factory pointer to `CLAUDE.local.md`, guest rules (the `vibe_docs/` handoff, marked **pending**), and a no-permissions statement. It does **not** import or reference the master by `@`. |
| `CLAUDE.local.md` | Already existed and was identical to the master, so it was not overwritten. I prepended an 11-line factory-role declaration. The body after the declaration is byte-identical to `CLAUDE.eng.md`. The pre-edit copy is in the session scratchpad. |
| `.gitignore` | **New.** The repo had no `.gitignore`. It contains the single line `/CLAUDE.local.md`. |
| `agent_docs/FACTORY_SESSION_SETUP.md` | **New.** Covers the one-time copy, persistence between sessions, a deliberate refresh procedure, and states that guests don't need it. |
| `agent_docs/SESSIONS/session_2026-10-10.md` | **New** session log. |
| `CHANGELOG.md`, `RECOVERY.md` | Protocol entries, added at the top only. |
| This report | New. |

Untouched: `CLAUDE.eng.md`, the nested `CLAUDE.md` / `AGENTS.md` files, and all application, database, dependency and environment files. Git: read-only commands only.

## 3. Checks performed

| Check | Result |
| ----- | ------ |
| Branch / HEAD / origin | ✅ `pilot-setup` / `297a011` / expected URL |
| `CLAUDE.local.md` supported by installed version | ✅ 2.1.296. This session's own context loaded `CLAUDE.local.md`, labelled as "user's private project instructions, not checked in". That is direct evidence for this install. |
| `git check-ignore -v CLAUDE.local.md` | ✅ `.gitignore:1:/CLAUDE.local.md` |
| `git ls-files CLAUDE.local.md` | ✅ empty (not tracked) |
| `git check-ignore CLAUDE.eng.md` | ✅ exit 1 (not ignored; can be committed) |
| Master unchanged | ✅ sha256 identical to the start |
| Master relative references | ✅ `RECOVERY.md`, `CHANGELOG.md`, `agent_docs/KIP_REGISTRY.md`, `agent_docs/SESSIONS/`, `agent_docs/RESPONSES/` all resolve from root. The master marks `reference/`, `APP_BRIEF.md`, `DATA_CONTRACT.md`, `FILE_TREE.md` and `UI_SPEC.md` as "if exist", and they are absent (as before). |
| `@` imports in `CLAUDE.md` / local / master | ✅ none |
| Role wording | ✅ guest rules are scoped "to guests only". Factory sessions are told the guest rules do not apply. Both files say a role grants no access or permissions. |

## 4. Remaining instruction routes and conflicts

1. **Nested `CLAUDE.md` files load on demand.** Claude Code loads a subdirectory's `CLAUDE.md` when the session reads files in that folder. Factory procedures can therefore still reach a guest through these 12 files:
   `_SKILLS/{stark-cloud-deploy-skills, stark-kit-residue-cleaner-skill, stark-recon-skill-v1.1}/CLAUDE.md` and
   `agent_docs/ACTIONS/{BIM-000..003, FIX-001, RRM-001..004}-CYBER-PHARMA/CLAUDE.md` (several say "You are the Engineer (Claudy)").
   `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md` is also present. It is not a Claude Code memory file, but other agents read it.
   **Mitigation in place:** a guest rule in `CLAUDE.md` says to treat these as records, not instructions. This is guidance only. The real fix would be to exclude these folders from the guest clone or configure `claudeMdExcludes`, and that is your decision. I did not rewrite any module document.
2. **Self-reference in the master.** It still says "CLAUDE.md ← protocols (this file)" and "Plan Mode … per CLAUDE.md". The local declaration maps these to the master. I left the master text alone as the brief instructed.
3. **Account/machine-level, not repo:** your account exposes `anthropic-skills:*` skills (e.g. `stark-frontend-first`, `brain-drain`, both with factory doctrine). A guest test run under **your** account will still see them, and a guest on their own account will not. There is no `~/.claude/CLAUDE.md` and no parent-directory `CLAUDE.md`.
4. **No other ignore rules.** The new `.gitignore` covers only `/CLAUDE.local.md`. `node_modules/`, `.next/` and `.env*` are not ignored in this repo. That is outside this brief, but it matters before anyone runs `git add -A`.

## 5. VIK v0.3 and the guest handoff

**Not available locally.** I searched the whole filesystem (excluding `node_modules` / `.git`) for files and content matching VIK and `vibe_docs`. The only hits are references in `../cyber-pharma-dev-v1-phase-3/agent_docs/RECON/FRANK_PILOT/` (the R-1 recon lists "setup facts for the kit and VIK"). There is no kit file. `vibe_docs/` does not exist in this repo.
Nothing was installed or invented. **Guest onboarding remains pending.**

## 6. Next launch checks (for Tony). Not yet run.

**Factory launch** (this clone):
```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && claude
```
Then run `/memory` (or `/context`) and ask: *"Which instruction files did you load, and which role applies?"*
Expected: `CLAUDE.md` and `CLAUDE.local.md` loaded; factory role; `CLAUDE.eng.md` **not** listed (it reaches the session only through the local copy).

**Guest launch** (a fresh clone with no local file; it needs this work committed and pushed first):
```bash
git clone -b pilot-setup https://github.com/Cyberize-Group/cyph-v1-dev.git /tmp/cyph-guest-check
cd /tmp/cyph-guest-check && ls CLAUDE.local.md   # expect: No such file
claude
```
Then run `/memory` and ask the same question.
Expected: only `CLAUDE.md`; guest role; it reports the `vibe_docs/` handoff as pending.
Optional: ask it to read a file in `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/` and confirm whether the nested `CLAUDE.md` loads (route 4.1).
Caveat: running this under your account still exposes your account-level skills (4.3).

## 7. Commit reminder

```
🔔 GIT REMINDER — uncommitted work on pilot-setup:
  CLAUDE.md (modified), CLAUDE.eng.md, .gitignore, agent_docs/FACTORY_SESSION_SETUP.md,
  agent_docs/SESSIONS/session_2026-10-10.md, this report, CHANGELOG.md, RECOVERY.md
Suggested (explicit paths; no other ignore rules exist, so avoid -A):
  git add CLAUDE.md CLAUDE.eng.md .gitignore CHANGELOG.md RECOVERY.md \
    agent_docs/FACTORY_SESSION_SETUP.md agent_docs/SESSIONS/session_2026-10-10.md \
    agent_docs/RESPONSES/response_2026-10-10_122343_guest-factory-split.md
  git commit -m "Split guest/factory instructions: shared CLAUDE.md, tracked CLAUDE.eng.md master, ignored CLAUDE.local.md"
→ Your call. I will not run it.
```

---

## Addendum — 2026-10-10 12:52 · `.gitignore` restored and updated

**Context:** Tony undid the setup commit and kept the working files. State on arrival: `pilot-setup` @ `297a011`. A restored, untracked `.gitignore` (36 lines of standard Next.js rules, without `/CLAUDE.local.md`) replaces the one-line file described in §2. **§2's ".gitignore new, single line" and §4.4 are superseded by this addendum.** The `agent_docs/RESPONSES/_OLD/` moves are Tony's work, and I left them intact (18 files, shown as `D` plus `??`).

### Change

`.gitignore` was updated in place. All 36 existing lines are kept unchanged, and 3 lines were appended:

```
(blank line)
# factory-local Claude Code instructions (see agent_docs/FACTORY_SESSION_SETUP.md)
/CLAUDE.local.md
```

No other file changed in this step, apart from this addendum, the session log, and the one `RECOVERY.md` line.

### Checks

| Check | Result |
| ----- | ------ |
| `git check-ignore -v CLAUDE.local.md` | ✅ `.gitignore:39:/CLAUDE.local.md` |
| `git ls-files CLAUDE.local.md` | ✅ empty (not tracked) |
| `CLAUDE.eng.md`: commit-eligible | ✅ not ignored; listed as untracked |
| `.env.example`: commit-eligible | ✅ not ignored (`.env*.local` does not match it) |
| `.env.pilot.example`: commit-eligible | ⚠️ **file does not exist** in the working tree. No current rule would ignore it if it is created, because `.env*.local` doesn't match it. |
| `.gitignore`, `.dockerignore` | ✅ not ignored (both untracked and new to this branch) |
| `CLAUDE.local.md` declaration | ✅ still present at line 1 |

### Tracked files that should be ignored

- **`git ls-files -ci --exclude-standard`:** none. No tracked file matches any rule in the updated `.gitignore`.
- **Filename sweep** (`.env*`, keys/certs, credential/secret names, `node_modules/`, `.next/`, `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`, `.DS_Store`): none tracked.
- **Tracked `*.log`:** 169 files, all QA/engineering evidence under `agent_docs/ACTIONS/{BIM-001,BIM-002,BIM-003,RRM-001}-CYBER-PHARMA/`. No ignore rule covers them, and they look like intentional evidence. Whether guests should receive them is your call. I did not read their contents.
- **Credential-shaped content scan:** I ran a regex over all tracked files and printed paths only. Patterns covered: Supabase `sb_secret_`, JWTs, Postgres URLs with passwords, private-key blocks, Stripe `sk_`/`whsec_`, and Google API keys. Three paths matched, all on the **`sb_secret_` pattern only**:
  - `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/evidence/engineering-to-candidate.diff`
  - `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S1_greps.txt`
  - `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/repair.diff`

  It is the same value in all three: 31 characters, fingerprint `sha256:a93f8813…`. A heuristic flags it as placeholder-like, and it is shorter than a real key. **Likely a placeholder, but not confirmed.** Please check it by eye. It is in committed history at `297a011`, so ignoring the files would not remove it.
- **Limitation:** this is a regex sweep, not a secrets scanner. No scanner is installed, and git history beyond the working tree was not scanned.

### Commit reminder (replaces §7)

```
🔔 GIT REMINDER — uncommitted work on pilot-setup:
  .gitignore (restored + /CLAUDE.local.md), CLAUDE.md, CLAUDE.eng.md, .env.example, .dockerignore,
  CHANGELOG.md, RECOVERY.md, agent_docs/FACTORY_SESSION_SETUP.md, session log, this report,
  and your RESPONSES → RESPONSES/_OLD/ moves
Suggested: git add -A && git status   # review that CLAUDE.local.md is absent, then commit
→ Your call. I will not run it.
```

Live launch checks: still **not run**.

---

## Addendum 2 — 2026-10-10 12:55 · Gitleaks scan and placeholder investigation

**Correction:** Addendum 1 said "no scanner installed". That was wrong. Gitleaks **8.30.1** is installed at `~/.local/bin/gitleaks`. It is not on `PATH`, and I had relied on the R-1 recon statement instead of checking that path.

### `CLAUDE.local.md`

`git check-ignore -v` → `.gitignore:39:/CLAUDE.local.md`. `git ls-files CLAUDE.local.md` → empty. ✅ It is ignored and untracked.

### `sb_secret_`-shaped value (3 RRM-001 evidence files)

The value was never printed. I checked it in private with masked context and true/false tests only.

| Evidence | Result |
| -------- | ------ |
| Context in all 3 files | The `SUPABASE_SECRET_KEY=` line of a captured `.env.example` template, under the comment "Supabase — from your project's API settings". Its neighbours are the explicit placeholders `https://your-project-ref.supabase.co` and `sb_publishable_your_publishable_key`. |
| Every location of the exact value | `.env.example` (untracked template) plus the 3 evidence files. Nowhere else in the working tree. |
| History | Only in `297a011` (the clone commit) |
| Form | Matches `^sb_secret_your_[a-z_]+$`: an all-lowercase "your_…" word suffix, the same convention as the publishable-key placeholder |
| Gitleaks | Not flagged in the working-tree or history scan |

**Classification: documented template placeholder.** The evidence is its position in the env template, the template's "your-…" placeholder convention, and its word-based suffix. Length and shape were not used as proof. **No further investigation needed.**

### Gitleaks scans

The commands ran with default rules, no `.gitleaks.toml`, no `.gitleaksignore`, and no suppressions. The reports went to the session scratchpad, outside the repo.

| Scan | Scope | Exit | Findings |
| ---- | ----- | ---- | -------- |
| `gitleaks dir . --redact` | Working files, including untracked and ignored ones (`node_modules/` and `.next/` are absent) | 1 (leaks found; not a tool error) | **5** |
| `gitleaks git . --redact --log-opts=--all` | All refs; 2 commits (`2b0d37c`, `297a011`) | 1 (leaks found; not a tool error) | **5** (the same 5, all introduced in `297a011`) |

All 5 findings use rule `generic-api-key`. I classified them privately: an unredacted report was compared in the scratchpad and only true/false results were printed.

| Path | Line(s) | Classification | Basis |
| ---- | ------- | -------------- | ----- |
| `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs` | 103, 123 | **False positive** | The matched value equals the second string argument of a `check(...)` assertion label, made of the words "byte", "identical", "true". It was flagged because the neighbouring label contains `TOKEN`. The code compares `access_token === originalToken` and contains no credential literal. |
| `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs` | 222, 254 | **False positive** | Same pattern as above. |
| `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/evidence/QAM_Q1B_DOCUMENT_CHECKS.json` | 201 | **False positive** | The value is a 64-hex string that **equals the SHA-256 of the existing file named by its key** (`…/qf16_auth_probe.cjs`). It is a document-integrity hash. |

**Totals:** 5 findings, 0 confirmed secrets, 5 false positives, 0 needing further investigation. **I did not mark the scan "clean"**, because both runs reported findings. I classified them and suppressed nothing. Whether to add a `.gitleaksignore` entry for these 5 fingerprints is your call.

**Limits:** these are the default gitleaks rules only. History covers the 2 local commits on all refs; other remote branches that are not fetched into this clone were not scanned. The raw reports, including one unredacted report used for the private comparison, are in this session's scratchpad (`…/scratchpad/gitleaks/`), outside the repo. I did not delete them.
