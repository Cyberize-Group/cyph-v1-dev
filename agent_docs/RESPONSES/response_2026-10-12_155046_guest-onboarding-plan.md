# Guest Onboarding Preparation — Findings and Proposed Plan

**Date:** 2026-10-12 · **Branch:** `vibe-pilot-setup` @ `2c9fd65` · **Mode:** Plan Mode (read-only inspection; only session, response and RECOVERY records written)
**Status:** PENDING_APPROVAL

---

## 1. Checkout and current changes (verified, read-only Git)

| Item | Result |
| --- | --- |
| Branch | `vibe-pilot-setup` @ `2c9fd65` (= `origin/main`, the PR #1 merge). No upstream configured for this branch. |
| Remote branches | `origin/main`, `origin/pilot-setup`. No `vibe-pilot*` branch on origin yet. |
| Uncommitted, preserved | Six 2026-10-10 response records moved by the Director to `agent_docs/RESPONSES/_OLD/` (show as D at the old path, ?? at the new). `package-lock.json` modified. `agent_docs/SESSIONS/session_2026-10-12.md` created at Step 0. |
| GitHub protection / collaborators | **Not verifiable from this machine**: `gh` is not authenticated. Branch protection and Bibo's access remain Director-reported. |

Nothing was reverted, moved or staged.

### Lockfile diff explained

- `package.json` is unchanged. `lockfileVersion` 3 unchanged.
- `package-lock.json` and `node_modules/.package-lock.json` were both rewritten today at 15:27 local, ten minutes before this session opened. That is the signature of an `npm install` (not `npm ci`) run in this clone.
- The diff is a transitive re-resolution inside the existing semver ranges: 1184 version lines change, with no new direct dependency. Examples: `jest` 30.4.2 → 30.5.2, `@emnapi/core` 1.4.5 → 1.10.0, plus many de-duplicated jest/ansi sub-trees.
- `npm ls` reports two extraneous optional packages (`@emnapi/runtime`, `@img/sharp-wasm32`). Harmless, consistent with the refresh.
- **Recommendation:** keep it out of the onboarding commit. Either restore it (`git checkout -- package-lock.json && npm ci`) or commit it on its own as a lockfile refresh after `npm run build` and `npm test` pass. Both are the Director's call. Toolchain seen: node 22.14.0, npm 10.9.2.

## 2. Approved VIK / guest kit source — NOT FOUND

Searched (content and filenames) for VIK, `vibe_docs`, "guest kit", "vibe instruction": this repo including `_OLD/` records, `../ARCHIVE`, `../cyber-pharma-dev-v1-phase-3`, `../nextjs16-supabase-stripe-subscription-2026-v1`. The only hits are the 10 Oct records saying it is pending. The `agent_docs/RECON/FRANK_PILOT/` folder that the 10 Oct search cited in the sibling repo no longer exists there either.

**What we need from Tony:** the approved VIK v0.3 files themselves (a folder, zip or repo link), including the name of its entry document. Without them, installing a kit would be reconstruction, which the records forbid. The plan below separates what can be done now from what is blocked on this source.

## 3. Environment variables (source inspection; no values printed)

Read by application source (`src/`):

| Variable | Where | Needed by a guest? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `client.ts`, `server.ts`, `middleware.ts`, `admin.ts` | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `client.ts`, `server.ts`, `middleware.ts` | Yes |
| `NEXT_PUBLIC_SITE_URL` | `server.ts` (redirect base; falls back to `""`) | Yes, localhost value |
| `SUPABASE_SECRET_KEY` | `src/utils/supabase/admin.ts` only | **No** — `admin.ts` has zero importers in `src/` and `scripts/` (confirmed by grep; the file header says the same). No route, page or action reaches it. |

Read only by `scripts/` harnesses (not the app): `DB_URL`, `DB_RESET_ALLOW`, `RLS_HARNESS_PREFIX`, `RLS_QUIET`.

`.env.local` in this clone: ignored by `.gitignore:28` (`.env*.local`) and untracked. Active variable names: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `RLS_REPLICA_*` (four), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Configured app Supabase host: **`cwdzijswchlwfvxxrlzb.supabase.co`**. Whether that host is the `vibe-pilot` preview branch is Director-reported, not verified here. `NEXT_PUBLIC_API_BASE_URL`, the Stripe key and the `RLS_REPLICA_*` set are not read anywhere in `src/` (the replica topic stays closed).

**Conclusion:** the guest kit needs three variables: the Supabase URL, the publishable key and a localhost site URL. No privileged key. `.env.example` already lists exactly these plus `SUPABASE_SECRET_KEY`; the guest instructions say to leave that line empty.

## 4. Cursor startup mechanism (official docs, cursor.com/docs/context/rules)

- Cursor loads **`.cursor/rules/*.mdc`** (plain `.md` there is ignored) and **`AGENTS.md`** in the project root and subdirectories. Rule types come from frontmatter: `alwaysApply: true` applies to every chat session.
- **`CLAUDE.md` is not mentioned anywhere.** Nothing in the docs says Cursor loads it, so the shared entry needs a bridge.
- `.cursorrules` is not mentioned on that page; not relied upon.
- The repo already has one nested `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md`. Cursor would apply it only for files under that subtree. It is a project record, not guest guidance. Left alone, noted for the live test.
- The repo has no `.cursor/` folder today.

## 5. Pilot state (Director-reported, recorded as reported)

Supabase preview branch `vibe-pilot` created · this clone's `.env.local` configured for the pilot · Bibo's Auth user, admin role and profile provisioned · local login and Admin Portal access observed by Tony · GitHub↔Supabase automatic sync not configured. None of these were tested by this agent.

**Admin Portal "Demo · mock data":** this is by design, not a defect. `src/components/admin-portal/DemoMarker.tsx` renders the pill, and the admin-portal screens read through `src/services/adminDemo.ts`, which serves `src/mocks/adminDemo.ts` fixtures (frontend-first service layer; the backend swap is a later module). Guests will see the marker on the pilot too.

## 6. Proposed implementation (bounded)

### Track A — doable now (no kit source needed)

1. **`CLAUDE.md` §2 wiring.** Change "Then follow the guest kit in `vibe_docs/`" to name the entry document `vibe_docs/README.md`, replace the "Status: not installed" line once the folder exists, and add two guest-only rules: (a) before editing, confirm the assigned Git branch with `git branch --show-current`; no assignment known → pause and ask; never create or switch branches; (b) scope: frontend proposals on the pilot environment only; no `main` merges, migrations or cloud administration. State in one sentence that these are workflow guidance and that GitHub permissions and rules are the enforcement. §1 (choice first, boxes), §3 (manual factory setup) and §5 ("Guest mode") stay exactly as they are.
2. **Cursor bridge: `.cursor/rules/workflow-entry.mdc`** with `alwaysApply: true` and a short body: read the repository root `CLAUDE.md` first and follow it, beginning with its workflow question; do not start work before the answer. No rules are duplicated. `CLAUDE.md` stays the single canonical place. Alternative considered: a root `AGENTS.md`. Rejected for now because nested `AGENTS.md` precedence would interact with the existing QAM record and because the `.mdc` always-apply type is the explicit documented mechanism.
3. **`vibe_docs/README.md` — pilot guest entry (factory-authored, thin, clearly labelled as not the VIK).** Contents limited to what the Director's brief already states: who guests are, the assigned-branch confirmation rule, the scope limits, environment setup (copy `.env.example` to `.env.local`, fill the three variables from the pilot values Tony hands over out-of-band, leave `SUPABASE_SECRET_KEY` empty), `npm ci` / `npm run dev`, the demo-marker note, and a "Kit documents" section that lists the VIK files once installed. **Decision for Tony:** approve this thin entry now, or wait and let the VIK's own entry document take that role. If you prefer waiting, step 1 keeps the "not installed" pause and only the branch/scope rules land.
4. `CHANGELOG.md` entry, `RECOVERY.md` top block, session log (records).

### Track B — blocked on the VIK source

5. Copy the approved VIK v0.3 files verbatim into `vibe_docs/`, then point `vibe_docs/README.md` (or `CLAUDE.md` §2 directly, if the VIK has its own entry) at them. No edits to the kit's content.

### Files

- **MODIFY:** `CLAUDE.md` (§2 only), `CHANGELOG.md`, `RECOVERY.md`, `agent_docs/SESSIONS/session_2026-10-12.md`.
- **CREATE:** `.cursor/rules/workflow-entry.mdc`, `vibe_docs/README.md` (if approved), later `vibe_docs/<VIK files>`.
- **WILL NOT TOUCH:** `CLAUDE.eng.md`, `CLAUDE.local.md`, `.env.local`, `.env.example`, `.gitignore`, `package.json`, `package-lock.json`, `src/**`, `scripts/**`, nested `CLAUDE.md`/`AGENTS.md`, `_SKILLS/`, the `_OLD/` moves. No git mutations, no GitHub, Supabase or Cursor account changes.

### Assumptions

1. Guests use Cursor on a separate clone with no `CLAUDE.local.md`; this factory clone is not the guest clone.
2. The pilot Supabase values are handed to Bibo out-of-band by Tony; nothing in the repo carries them.
3. Bibo's assigned branch name is decided by Tony and told to Bibo; the kit never names a default branch.
4. `vibe_docs/README.md` is a pilot entry only. The VIK remains the approved kit and is installed verbatim when supplied.

### Risks

- Cursor behaviour (showing the box, waiting for the answer, honouring the pause) is unverified until the live Hobby-account test. The `.mdc` rule only guarantees the pointer is loaded.
- Without `gh` auth, `main` protection cannot be confirmed from here; the rehearsal step "guest cannot merge main" must be observed on GitHub.
- The lockfile change, if committed with onboarding, would mix a dependency refresh into a docs commit.

## 7. Rehearsal checklist

Legend: ✅ observed by the Director · ⏳ pending · ❌ blocked

**Tony — factory path**
- ✅ Choice-first startup in Claude Code on this clone (box → `2` → ACTIVE → Step 0), observed 10 Oct and again today.
- ✅ Factory readiness: `CLAUDE.local.md` present, ignored, declaration at top.
- ⏳ Cursor startup on this clone or a test clone without a pasted prompt: the `.mdc` rule loads, the box appears first, nothing runs before the answer.
- ⏳ Final merge path: Bibo's PR → Tony reviews → Tony merges to `main` (PR #1 proved the merge mechanics once, not under protection).

**Bibo — guest path**
- ⏳ Separate guest clone with no `CLAUDE.local.md`; option 1 shows the guest banner and opens `vibe_docs/README.md`.
- ⏳ Assigned branch confirmed before any edit (`git branch --show-current` matches Tony's assignment); missing assignment → pause observed.
- ✅ Pilot database configuration (this clone, Director-reported) · ⏳ same on Bibo's clone with the three guest variables only.
- ✅ Bibo login and Admin Portal access (this clone, Director-reported) · ⏳ repeat from Bibo's clone.
- ⏳ Guest cannot push to or merge `main` (protection or ruleset on GitHub, observed from Bibo's account).
- ❌ Full VIK-guided onboarding: blocked until the kit source arrives.

→ Awaiting approval (Track A steps 1–4, and the `vibe_docs/README.md` decision) before any onboarding change.
