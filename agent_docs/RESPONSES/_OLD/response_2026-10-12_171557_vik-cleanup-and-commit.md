# VIK Documentation Cleanup and Commit Handoff

**Date:** 2026-10-12 17:15 · **Branch:** `vibe-pilot-setup` @ `2c9fd65` (preparation checkpoint) · **Status:** COMPLETE. External handoff ready stays **NO**.

## 1. Cleanup edits (Director review, four items)

| # | File | Change | Ledger |
| --- | --- | --- | --- |
| 1 | `vibe_docs/START_HERE.md` §What's isolated | Completed-checks claim replaced with status: Tony observed pilot login on the factory clone; clean guest-clone configuration, repository permissions and deployment isolation still require rehearsal verification. "We don't claim more than we checked" and the shared-database sentence kept | A19 |
| 2 | `vibe_docs/START_HERE.md` step 4 | "`npm ci` installs dependencies from the committed lockfile. Clean-clone installation and runtime verification are pending" | A20 |
| 3 | `vibe_docs/GUEST_AI_RULES.md` §Readiness first | Handoff NO permits the authorized setup/login rehearsal; the AI stops before the first application edit and keeps helping with setup and login | A21 |
| 4 | `.env.pilot.example` line 2 comment | "Coach" → "Tony". Variable names and values byte-identical to the ZIP original (diff of non-comment lines: empty) | A18; fidelity cell updated |

Everything else is unchanged: `CLAUDE.md` (still one §2 hunk; §1/§3/§4/§5 identical to HEAD), the Cursor bridge, the template, the README status table.

## 2. Document checks

| Check | Result |
| --- | --- |
| Unresolved placeholders | none ✅ |
| Leftover kit wording (Coach, Frank, "yours alone", "exactly what we tested", old readiness sentence) | none ✅ |
| `.env.pilot.example` names/values vs original | identical ✅ |
| Handoff status | README: External handoff ready **NO** ✅ |
| Credentials / hostnames in onboarding files | none ✅ |
| Scope (`CLAUDE.eng.md`, `.env.example`, `.gitignore`, `package.json`, `src/`, `scripts/`) | unchanged ✅ · `CLAUDE.local.md` mtime 10 Oct · `.env.local` mtime 16:32 (Director edit) ✅ |

## 3. Commit handoff (Tony runs; the agent runs none of it)

Branch `vibe-pilot-setup` has no upstream yet. **Excluded on purpose:** `package-lock.json` (npm install refresh) and the six 2026-10-10 archive moves (`agent_docs/RESPONSES/response_2026-10-10_*` deletions and `agent_docs/RESPONSES/_OLD/*`). No `git add -A`.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev

# 1. stage the onboarding files and today's records only
git add CLAUDE.md CHANGELOG.md RECOVERY.md \
  .cursor/rules/workflow-entry.mdc \
  .github/PULL_REQUEST_TEMPLATE/vibe_proposal.md \
  .env.pilot.example \
  vibe_docs/README.md vibe_docs/START_HERE.md vibe_docs/GUEST_AI_RULES.md \
  agent_docs/VIK/00_PACKAGE_NOTE.md agent_docs/VIK/ADAPTATIONS.md \
  agent_docs/SESSIONS/session_2026-10-12.md \
  agent_docs/RESPONSES/response_2026-10-12_155046_guest-onboarding-plan.md \
  agent_docs/RESPONSES/response_2026-10-12_163426_guest-onboarding-impl.md \
  agent_docs/RESPONSES/response_2026-10-12_164541_vik-install-plan.md \
  agent_docs/RESPONSES/response_2026-10-12_165824_vik-install-result.md \
  agent_docs/RESPONSES/response_2026-10-12_171557_vik-cleanup-and-commit.md

# 2. confirm exactly these are staged, and that package-lock.json and the _OLD moves are NOT
git status --short

# 3. commit
git commit -m "pilot: install VIK v0.3 under vibe_docs, Cursor bridge, VPR template, guest entry with readiness fields" \
  -m "Option 1 in CLAUDE.md now opens vibe_docs/; kit AGENTS.md renamed to GUEST_AI_RULES.md; 21 adaptations in agent_docs/VIK/ADAPTATIONS.md. External handoff ready: NO."

# 4. push and set the upstream
git push -u origin vibe-pilot-setup
```

Expected staged set: 3 modified (`CLAUDE.md`, `CHANGELOG.md`, `RECOVERY.md`) + 16 new. After step 2, `package-lock.json` must still show ` M` unstaged and the `_OLD/` paths must still show `??` / ` D`.

## 4. After the push (fixed order)

1. PR `vibe-pilot-setup` → `main`, Tony merges (the VPR template is served only from `main`).
2. Rehearsals: Cursor startup on a clean clone, Bibo's clone setup and login, protected-`main` rejection tests.
3. Readiness flip (External handoff ready: YES) by the factory, committed and merged to `main`.
4. Only then: Tony records the final handoff baseline SHA and sends the handoff message.
