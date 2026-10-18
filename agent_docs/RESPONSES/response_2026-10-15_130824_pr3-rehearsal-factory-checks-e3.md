🟢 PLAN APPROVED — EXECUTING (preparation only, no guest session)

# PR #3 pre-merge rehearsal: factory checks and the first VM step

**Your decisions, recorded:**
- The candidate stays `0de73039d312ff49b2a61120f79c0d05521c1522`.
- The "Baseline status" line stays in the starter. The starter's SHA-256 is unchanged at `db2a3fd9…cd7d`.
- The assignment ID is `CYPH-R2-BIBO-SETUP-01`.
- All three G05 fixtures (F-a, F-b, F-c) will run.
- JARVIS reviews the independent evidence and gives the QA recommendation. Tony makes the final merge decision.

PR #3 stays Draft, sandbox work stays deferred, and External handoff ready stays **NO**. I haven't touched the Bibo VM, started the rehearsal, merged, pushed or changed any cloud setting.

## 1. Engineering checks on this factory VM

**Result: no engineering checks remain here before the Bibo VM step.** Where existing evidence was enough I used it. I checked the rest read-only between 13:04 and 13:08.

| Check | How | Result |
|---|---|---|
| PR #3 state | GitHub API | open, **Draft**, not merged. Base `main` @ `d2a0d13`, head `eda63ff`, 3 commits, 44 files |
| Remote branches | `git ls-remote` | `main` is at `d2a0d13`. The PR branch equals `refs/pull/3/head` at `eda63ff`. `guest/bibo-rehearsal-r2` is **absent** |
| Ancestry (correction 2) | `git merge-base --is-ancestor` on commits that are actually present | The candidate is an ancestor of `eda63ff`, checked in two places: in this repo, where the tip commit exists, and in a fresh clone just fetched from GitHub, whose `origin/pilot/vik-round2-onboarding` equals the `ls-remote` tip `eda63ff`. Exit 0 both times. `d2a0d13` is an ancestor of the candidate |
| Freeze (E1) holds | `git diff` from candidate to tip | One commit, touching only `RECOVERY.md` and two record files. The non-record diff is empty |
| Q1 still covers the candidate | existing evidence | I applied `sandbox-evidence/stageA_tracked.diff` to the source files at `08bfa11`. The result is byte-identical to the candidate's four source files. Kit, config, `package.json`, the lockfile and `.gitignore` are unchanged since `08bfa11`. So F01–F05 and the Stage A results still apply: jest 36 suites/178 tests, lint 0 errors, tsc, build and the three-value boot. **No rerun is needed** |
| E4 inputs | candidate blobs | I recomputed the seven key-file hashes. The candidate tree is `33e5f3a8…`, and the starter hash is unchanged |

**Remaining engineering items. None of them blocks the first VM step:**
- **G05 fixture messages:** the exact F-a, F-b and F-c messages, due before R3. F-b's near-miss SHA is confirmed absent both here and in a fresh GitHub clone.
- **Recheck before R1:** one more tip-and-ancestry check right before R1.
- **Residual risk:** the fresh clone starts on a detached HEAD at the candidate.
  - GUEST_AI_RULES §3.4 accepts that, because HEAD equals the baseline.
  - The F03 fixtures never covered a detached start, so G02 will be its first test.
  - If Vibe Cody stops on it, we record a kit finding. Nobody repairs it mid-run.

## 2. Corrections made

**Correction 1: the fresh clone stops on any failure.** E4 is now one paste-safe block, and R3's fixture clone reuses it. The block runs as a subshell, so a stop doesn't close your terminal. It prints a `STOP:` line and runs nothing further if any of these happens:
- the parent folder is missing;
- the destination already exists, even as a symlink;
- `git clone` fails. Credential prompts are turned off, so a wrong URL fails instead of asking for a login;
- checking out the candidate fails;
- after checkout, any of these doesn't match: HEAD, the tree, ancestry on the fetched PR branch, a clean status, the set of settings and instruction files, or any of the seven file hashes.

A stop never deletes or retries anything. If a checkout fails after cloning, the clone stays in place for Engineering.

I tested the exact block in the scratchpad (SHA-256 `d7881c16…23f9`). Each case changed only the destination, URL or SHA line:

| Case | Result |
|---|---|
| Destination exists as a folder | STOP before cloning; the folder is unchanged |
| Destination is a dangling symlink | STOP before cloning; the link is unchanged |
| Clone fails (wrong repository) | STOP; no folder created |
| Checkout fails (near-miss SHA) | STOP; the clone stays on `main`; nothing further runs |
| Parent folder missing | STOP; nothing created |
| Normal run | `E4 OK`: detached at the candidate, clean, 7/7 hashes OK |

**Correction 2: ancestry is now proven, not inferred.**
- `ls-remote` now only supplies the tip SHA.
- Ancestry comes from `git merge-base --is-ancestor` against a commit that is actually present: in this repo for E2, and inside E4 against the new clone's fetched PR branch.
- I've already run the E2 version (table above), so there's nothing for you to run on this machine.

You get the exact E4 block after you send me the E3 output.

**One item for your decision:**
- **The conflict:** the plan files the rehearsal evidence under `agent_docs/VIK/round2-rehearsal/`. But the E1 freeze and the Q5 comparison only exempt `RECOVERY.md`, `CHANGELOG.md`, `agent_docs/SESSIONS/` and `agent_docs/RESPONSES/`. Committing the evidence before the merge would therefore break both.
- **Recommendation:** add that evidence folder to the exempt record paths.

## 3. Your step now: E3 on the Bibo VM (read-only)

This block takes a "before" snapshot of the Bibo VM. It creates, changes and stops nothing. It records:
- **Tools:** the git, Node, npm and Claude Code versions.
- **Layout:** what's in `~/NEXT.JS`, whether both new folder names are unused, and how much disk space is free.
- **Port 3000:** whether it's in use, and whether any `next-server` is running.
- **User-level instructions:** whether `~/.claude/CLAUDE.md` exists.
- **Round-one clone:** its branch, HEAD, status and `CLAUDE.md` hash. Git reads them without taking locks, so the clone stays preserved.
- **Remote:** a read-only `ls-remote` from the VM itself.

It never opens a settings file.

Open a terminal on the Bibo VM, paste the block, and send me the whole output:

```bash
echo "== VM";    hostname; date -Is
echo "== tools"; git --version; node -v; npm -v; claude --version
echo "== layout"; ls -la ~/NEXT.JS
for d in ~/NEXT.JS/cyph-v1-dev-r2 ~/NEXT.JS/cyph-v1-dev-r2-fx; do if [ -e "$d" ] || [ -L "$d" ]; then echo "EXISTS: $d"; else echo "unused: $d"; fi; done
df -h ~/NEXT.JS | tail -n 1
echo "== port 3000"; ss -ltn | grep ':3000 ' || echo "port 3000 free"
echo "== next-server"; pgrep -af next-server || echo "no next-server process"
echo "== user-level instructions"; ls -la ~/.claude/CLAUDE.md 2>/dev/null || echo "no user-level CLAUDE.md"
echo "== round-one clone (read-only)"
GIT_OPTIONAL_LOCKS=0 git -C ~/NEXT.JS/cyph-v1-dev rev-parse --abbrev-ref HEAD
GIT_OPTIONAL_LOCKS=0 git -C ~/NEXT.JS/cyph-v1-dev rev-parse HEAD
GIT_OPTIONAL_LOCKS=0 git -C ~/NEXT.JS/cyph-v1-dev status --short
GIT_OPTIONAL_LOCKS=0 git -C ~/NEXT.JS/cyph-v1-dev status --short | sha256sum
sha256sum ~/NEXT.JS/cyph-v1-dev/CLAUDE.md
echo "== remote (read-only)"
GIT_TERMINAL_PROMPT=0 git ls-remote https://github.com/Cyberize-Group/cyph-v1-dev.git refs/heads/main refs/heads/pilot/vik-round2-onboarding refs/heads/guest/bibo-rehearsal-r2
```

**What I expect, and when to stop:**
- **Tools:** Node 20.9.0 or newer (round one had 24.16.0). git, npm and claude each print a version.
- **Folders:** `~/NEXT.JS` lists `cyph-v1-dev`. Both `cyph-v1-dev-r2` and `cyph-v1-dev-r2-fx` show `unused`.
- **Port and server:** "port 3000 free" and "no next-server process".
- **Round-one clone:** recorded as found; this is the preservation baseline. Going by the round-one reports, I expect `guest/bibo-rehearsal` at `d2a0d13` with `CLAUDE.md` modified, but I haven't verified that.
- **Remote:** `main` at `d2a0d13`, the PR branch at `eda63ff`, and no `guest/bibo-rehearsal-r2` line.
- **If anything differs:** don't fix anything. Just send me the output.

None of this output is secret, and none of it comes from `.env.local`.

**Records:**
- **Written:** the session log (APPROVED → IN PROGRESS, plus a checkpoint), a new RECOVERY block and this record.
- **Uncommitted:** all three, alongside your `_OLD/` moves. No commit is due until the rehearsal evidence is in.
- **Plan record:** now at `agent_docs/RESPONSES/_OLD/response_2026-10-15_115917_pr3-premerge-rehearsal-plan.md`. I didn't edit it; this record carries the corrections.

```
/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/RESPONSES/response_2026-10-15_130824_pr3-rehearsal-factory-checks-e3.md
```
