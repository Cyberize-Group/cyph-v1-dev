# Feature scope + sandbox database — reconciliation and implementation plan

**Date:** 2026-10-14 18:29 · **Branch:** `pilot/vik-round2-onboarding` @ `08bfa11` (pushed; `origin/main` still `d2a0d13`) · **Mode:** Plan Mode. I only inspected (read-only) and wrote three records: this file, the session log entry and RECOVERY. I opened no env-file contents, ran no cloud or Git mutation, and did not touch the round-one VM or clone. External handoff ready stays **NO**.

**Director decision (recorded):** guests may develop complete feature proposals, including new tables and migrations, inside their designated sandbox. Guests get no `SUPABASE_SECRET_KEY` and no service-role API key; work that needs one stops and goes to Cyberize Engineering. This supersedes the earlier permission to supply the sandbox secret key.

## 1. Findings

### 1.1 `SUPABASE_SECRET_KEY` — startup requirement and consumers

| Where | What | Source |
|---|---|---|
| Boot gate | `REQUIRED_ENV` lists the key. `register()` throws if any listed variable is unset or blank, so `next dev` and `next start` refuse to boot | `src/instrumentation.ts:11-32` |
| Same file's own rule | "Phase-deferred additions (add when consumed in code, not before)" | `src/instrumentation.ts:7` |
| Only runtime reader | `createAdminClient()` reads the key and throws `Missing Supabase admin credentials` if it is unset or empty | `src/utils/supabase/admin.ts:20-26` |
| Consumers of that reader | None. Nothing in `src/` or `scripts/` imports `utils/supabase/admin` or calls `createAdminClient`. The file header says it has zero consumers and is fenced to seeding and system jobs | `git grep`; `admin.ts:1-9` |
| App data path | The only live table reads (`user_roles`) use the cookie/session server client with the publishable key | `src/app/api/auth/login/route.ts:2,12,34`, `src/utils/get-user-role.ts:1,5,8` |
| Tests | `jest.setup.ts:3` injects a placeholder value; no test covers `instrumentation.ts` | `src/__tests__/jest.setup.ts` |
| Engineering scripts | `scripts/rls-harness/lib/env.mjs` requires the key (fail-closed) for factory proofs. These scripts are separate from the app and protected | `env.mjs:19,45` |

**Conclusion:** the boot gate demands a key that no running code uses, and the file's own rule says it should not be listed yet. If it comes off the boot list, the only privileged path (`createAdminClient`) still fails closed at the moment it is called.

### 1.2 Where the earlier secret-key permission stands (item 5)

- **No repository edit applies it.** The permission never reached this session. The only secret-key instruction received here was on 12 Oct: "Leave SUPABASE_SECRET_KEY empty". The installed kit says the guest file "must not contain a service-role or secret key" (`vibe_docs/GUEST_AI_RULES.md:44`), and `.env.pilot.example` holds three names, none of them secret. I checked every tracked guest-kit and config file, the round-two evidence, and this session's transcript.
- **The only four-value file I used** was the F04 nonsecret fixture (`fixture-not-a-key`) in a disposable scratchpad checkout (`agent_docs/VIK/round2-evidence/F04_startup_instruction_stability.txt:3`). It is not a key and was never given to a guest. It is a historical record and stays.
- **Outside the repo, this needs you.** Round one booted the app on the guest VM. `src/instrumentation.ts` has not changed since `297a011`, so that boot was only possible with a nonempty `SUPABASE_SECRET_KEY` in that environment, most likely in the guest `.env.local`. I cannot inspect that file and will not. If it held a real sandbox secret key, that is the earlier permission applied, and reversing it is your action (D4).
- **Reversal in this plan:** nothing in the tracked files needs reverting. The plan adds a ledger row recording the supersession and keeps the 12 Oct records as history (e.g. `CHANGELOG.md` "an empty secret key").

### 1.3 Database facts that shape the sandbox design

| Fact | Source |
|---|---|
| The factory chain is 47 files, `supabase/migrations/0001…0047`. `scripts/db-reset.mjs` applies them: it replays them all, keeps no history table and targets scratch or replica only. Live apply is a named Director session | `scripts/db-reset.mjs:1-14`, `RUN_NOTES.md:3` |
| `0001` asserts the baseline (`user_roles`, `profiles`, 3 policies, functions) and refuses to continue otherwise | `supabase/migrations/0001_baseline_acknowledge.sql` |
| The `ensure_rls` event trigger turns on RLS for every new `public` table. It is in the bootstrap and was confirmed live at X0. Whether the sandbox has it is unverified | `scripts/db-bootstrap-baseline.sql:105-129` |
| The tracked CLI link file points at the BIM scratch project (`Stark_Base_Free`), not the pilot | `supabase/.temp/linked-project.json` |
| This machine has no `psql`, Postgres or Docker, so there is no local database to test against | `command -v` |
| On Supabase, the `postgres` role (the database password) has `bypassrls`. A secret key maps to `service_role`, which also has `bypassrls` | Supabase RLS docs |
| Each preview branch has its own instance and its own credentials | Supabase Branching docs |
| Dashboard roles are org-scoped or project-scoped. A Developer can write the production branch and can create, update and delete any development branch. The docs describe no per-branch scope | Supabase Access Control docs |
| Custom `LOGIN` roles work over direct and pooled connections. The shared-pooler username is `role.project_ref` | Supabase Connecting docs |
| If the GitHub integration is connected, migrations in `<working dir>/supabase/migrations` run automatically on new preview branches. With "Deploy to production" on, they are applied on merge | Supabase GitHub integration docs |

**Consequences:**
- Giving a guest the sandbox `postgres` password would grant RLS bypass plus DDL. That is more power than the secret key you just withdrew, so it contradicts the decision.
- Dashboard membership cannot confine a guest to one branch. Guests get no Dashboard membership.
- Guest migrations must not go in `supabase/migrations`. If the integration is connected, now or later, it would run them automatically, and they would mix into the canonical chain.
- The real isolation boundary is the credential. A login role created inside the sandbox database exists only there, so it cannot authenticate against the parent project or another branch. Stage C proves that.

### 1.4 Rules that conflict with the new scope

| # | Location | Current rule | Conflict |
|---|---|---|---|
| C1 | `CLAUDE.md:97-98` §2 Guest scope | "frontend proposals … no database migrations" | blocks migrations |
| C2 | `CLAUDE.md:85` §2 gate | "pause before any frontend edit" | gate covers frontend only |
| C3 | `CLAUDE.md:68` §2 banner | "Frontend ideas and prototypes." | wrong label for the new scope |
| C4 | `vibe_docs/README.md:5-9,19,21` | three fields; one shared pilot DB; "Proposal coding requires all three fields" | no database gate; shared DB |
| C5 | `vibe_docs/GUEST_AI_RULES.md:7` §1 | readiness = three fields | no database gate |
| C6 | `GUEST_AI_RULES.md:38` §4 | "do not execute scripts under the protected scripts directory" | the apply command lives there |
| C7 | `GUEST_AI_RULES.md:44` §4 | settings file holds three values only | the DB credential needs a home |
| C8 | `GUEST_AI_RULES.md:64` §6 | "Do not alter … database policies, SQL or migrations" | blocks new migrations |
| C9 | `GUEST_AI_RULES.md:68` §7 | edits only in allowed paths + `VIBE_JOURNAL.md` | migration folder not listed |
| C10 | `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | no database section; checklist says nothing on databases | migrations not captured |
| C11 | `vibe_docs/START_HERE.md` §Later | no mention of data or tables | guest-facing description |

**These stay as they are:** the setup/login rehearsal rules (`GUEST_AI_RULES.md:9,54`) and the starter message block; the protected list (`supabase/**`, editing `scripts/**`, `src/utils/supabase/**`, `src/instrumentation.ts`, `src/proxy.ts`, `src/types/**`, `src/services/**`); and the rules against secret keys, merges, and cloud or account administration.

## 2. Proposed design

**2.1 Startup fix.** Remove `SUPABASE_SECRET_KEY` from `REQUIRED_ENV` and rewrite the comment to explain why. In `createAdminClient`, treat a blank key as missing (`?.trim()`), so its fail-closed guard is at least as strict as the boot check was. No other source change.

**2.2 Sandbox and credential.** Engineering provisions these later, after you authorize it.
- **Sandbox:** one designated sandbox per guest assignment, a Supabase preview branch (D1). Its project ref is a nonsecret value written into the assignment.
- **Role:** one login role per guest, created by Engineering inside that sandbox only.
  - Attributes: `NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS NOREPLICATION`.
  - Not a member of `postgres`, `service_role` or `authenticated`.
  - Holds `CREATE` + `USAGE` on `public` and owns a `guest_sandbox` ledger schema.
  - Has a connection limit and a statement timeout.
  - Gets extra grants (`REFERENCES`, `EXECUTE` on RLS helpers) only on request.
- **Effective privilege:**
  - It can create new objects and alter or drop only what it owns.
  - Without a grant, it has no read or write access to existing tables, `auth`, `storage` or other schemas.
  - It cannot alter existing objects, roles, or RLS on tables it does not own.
  - Limits, kept inside the sandbox and treated as review items: as owner, it bypasses RLS on its own tables, and views or `SECURITY DEFINER` functions it creates run with its rights.
- **Delivery:** a separate private file `.env.sandbox.local` holding one name, `GUEST_SANDBOX_DB_URL`, the session-pooler string for that role.
  - `.gitignore:28` (`.env*.local`) already ignores the file.
  - Next.js does not load it, so the dev server never holds the database credential.
  - The AI checks metadata only, as it does for `.env.local`.
- **Not issued:** no Dashboard membership, personal access token or Management API access. No `supabase link`/`--linked` and no SQL editor.

**2.3 Capture and apply (item 4).**
- **Where migrations live:** with the proposal, outside the canonical chain, at `vibe_proposals/<assignment-id>/migrations/NNNN_<slug>.sql`. The guest AI creates them during an authorized database phase. I create none now.
- **Approved command:** one, `node --env-file=.env.sandbox.local scripts/guest-sandbox-migrate.mjs <assignment-id> --expect-ref <sandbox-ref> [--dry-run]`. This is a new factory script of about 120 lines. It uses the existing `pg` devDependency, so nothing changes in dependencies or the lockfile.
- **The script refuses unless:**
  - the README field "Sandbox database changes authorized" reads YES;
  - the assignment ID and the filenames are well formed;
  - the target ref parsed from the connection string equals `--expect-ref`;
  - the server-side `current_user` is not `postgres`, `service_role` or `supabase_*`, has no superuser, bypassrls or createrole attribute, and is not a member of `postgres` or `service_role`.
- **What it does:**
  - applies each pending file in its own transaction;
  - records filename + SHA-256 in `guest_sandbox.applied_migrations`;
  - refuses if an applied file's hash has changed ("write a new migration");
  - prints only the ref, the role and filenames, never the connection string.
- **Rules:**
  - Every sandbox change goes through a migration file and that command. No ad hoc SQL.
  - Never edit an applied migration.
  - New objects only. Every new table gets RLS, explicit policies and explicit grants.
  - Work that needs any of these stops with an Engineering packet: a secret or service-role key, `auth` or `storage` changes, triggers on existing tables, extensions, cron, roles.
- **Nothing promotes automatically:**
  - The files sit outside `supabase/migrations`, and the VPR is never merged.
  - Engineering reproduces the files on its own scratch database after the canonical chain, reviews them, and renumbers them into the chain on a factory branch only after QA.
  - The sandbox itself is never promoted.

**2.4 Gate.** A new fourth README field, **Sandbox database changes authorized: NO**. The setup/login rehearsal is unchanged. Application edits still need the first three fields plus an assignment. Database changes additionally need the fourth field, an assignment naming the sandbox ref, and a pass on the Stage C checks.

## 3. Exact file scope (implementation, after approval)

**MODIFY**

| File | Change |
|---|---|
| `src/instrumentation.ts` | drop `"SUPABASE_SECRET_KEY"` from `REQUIRED_ENV`; new comment: not required at boot because nothing reads it at runtime, the privileged path fails closed in `admin.ts`, add it back when a runtime consumer exists |
| `src/utils/supabase/admin.ts` | guard becomes `if (!supabaseUrl?.trim() \|\| !supabaseServiceKey?.trim())`; header comment unchanged |
| `CLAUDE.md` (§2 only) | C1–C3: banner line becomes "Feature ideas and prototypes." (60-column box kept); gate becomes "before any application or database edit"; Guest scope paragraph rewritten for the new scope. §1, §3, §4 and §5 stay byte-identical, including the selector label "Guest frontend proposal" |
| `vibe_docs/README.md` | C4: fourth field (NO); evidence line adds "sandbox database isolation unverified"; lines 19 and 21 rewritten for the per-assignment sandbox and the database gate |
| `vibe_docs/GUEST_AI_RULES.md` | C5–C9: §1 adds the database gate and the rule that work needing a secret or service-role key stops; §4 adds the `.env.sandbox.local` metadata rule and the one allowed script; §6 line 64 limits the ban to *existing* objects and migrations and points to §7; §7 gets a new subsection "Database changes (sandbox only)" with the rules from 2.3 |
| `vibe_docs/START_HERE.md` | C11: two sentences under "Later": the guest has their own test database, every change is recorded for Engineering, and a second private settings file may be supplied |
| `.github/PULL_REQUEST_TEMPLATE/vibe_proposal.md` | C10: a "Database changes" block (migration files + SHA-256, sandbox ref, apply result, or "none"); new checklist line: "every sandbox change is in the listed migration files; no secret/service-role key, `postgres` password or token used" |
| `vibe_docs/STARTER_MESSAGE_TEMPLATE.txt` | engineering notes only (FUTURE HANDOFF paragraph): proposal assignments state the database phase and the sandbox ref. The message block between BEGIN and END is unchanged |
| `agent_docs/VIK/ADAPTATIONS.md` | new section: Director decision 2026-10-14 18:20, rows R9 onward; supersessions (secret-key permission withdrawn; "no database migrations" becomes sandbox migrations); line-84 finding marked resolved |
| `CHANGELOG.md`, `RECOVERY.md`, `agent_docs/SESSIONS/session_2026-10-14.md` | records |

**CREATE**

| File | Purpose |
|---|---|
| `src/__tests__/instrumentation.test.ts` | boots with the three public variables and no secret key; throws and names any missing or blank public variable |
| `src/__tests__/supabase-admin.test.ts` | `createAdminClient` throws when the key is unset, empty or whitespace |
| `scripts/guest-sandbox-migrate.mjs` | the approved apply command (D3) |
| `agent_docs/VIK/SANDBOX_DB_PROVISIONING.md` | Engineering runbook: role SQL template (no passwords), grants, ledger schema, credential delivery, isolation checks V1–V8, revocation (`reassign owned` / `drop owned` / `drop role`) |
| `agent_docs/VIK/sandbox-evidence/` | validation outputs |
| `agent_docs/RESPONSES/response_…_feature-scope-result.md` | report |

**NOT TOUCHED:**
- env files: all `.env*` (including `.env.example` and `.env.pilot.example`) and the factory `.env.local`
- instruction files: `CLAUDE.local.md`, `CLAUDE.eng.md`, `.cursor/**`, `_SKILLS/**`, `_OLD/`
- `package.json`, `package-lock.json`, `next.config.js`
- `supabase/**`, including the tracked `.temp/linked-project.json` (flagged above only)
- `src/types/**`, `src/services/**`, `src/__tests__/jest.setup.ts`
- other `scripts/**`
- the round-one VM and clone

## 4. Validation plan

**Stage A — startup fix (local, this machine).**
- **A1:** the new tests pass; the full jest suite is green (36 suites expected); lint shows 0 errors and the 35 baseline warnings; `tsc --noEmit` is clean; `next build` succeeds.
- **A2:** in a disposable scratchpad checkout, with a nonsecret fixture `.env.local` holding only the three public names, `next dev` logs "✓ Environment validated" and serves `/`. With `NEXT_PUBLIC_SUPABASE_URL` removed, it throws and names that variable. Starts and stops by process group, with zero leftover processes.
- **A3:** `git grep` shows the readers of `SUPABASE_SECRET_KEY` are unchanged (`admin.ts` only).
- **Limit:** fixture values cannot prove a real login. That stays G04, in the guest rehearsal.

**Stage B — script, offline (no database here).**
- **B1:** refusals that happen before any connection: README field NO, bad assignment ID, bad filename, missing env file, ref mismatch, non-Supabase host. Each must exit non-zero, connect to nothing and print no credential.
- **B2:** dry-run listing and hashing against a fixture folder.
- **Limit:** apply, the ledger and the role checks remain unproven until Stage C.

**Stage C — cloud steps that need your separate authorization (not part of this approval).**
- **V1:** sandbox ref is neither the parent/production ref nor the scratch ref; recorded in the assignment.
- **V2:** role provisioned in the sandbox only, per the runbook.
- **V3:** the guest credential fails against the parent project and against another branch.
- **V4:** role probe: no superuser, bypassrls or createrole attribute; no `postgres` or `service_role` membership.
- **V5:** negative probes: `select` on `auth.users` and on existing tables denied; `alter` on `user_roles` denied.
- **V6:** probe migration through the script: table created, RLS on, ledger row written, hash-change refusal confirmed, then cleanup.
- **V7:** GitHub integration status: connected? automatic branching? deploy to production?
- **V8:** org and project member lists show no guest membership and no guest personal access token.
- **Then:** Engineering replays the probe migration on scratch after the canonical chain.

**Stage D.** Round-two G01–G06 stays unchanged (setup/login only). A separate database-phase rehearsal comes only after Stage C, and after the factory commits the flip of the fourth field.

## 5. Director decisions needed

| # | Decision | Recommendation |
|---|---|---|
| D1 | **Sandbox designation:** one preview branch per guest, or the shared `vibe-pilot` branch with one role per guest? Also, which project is `vibe-pilot`'s parent (production?) | One branch per guest. With DDL allowed, a shared sandbox lets one guest's tables collide with or break another's |
| D2 | **Credential:** a dedicated least-privilege login role, or the sandbox `postgres` password? | Dedicated role. `postgres` has `bypassrls`, more power than the withdrawn secret key |
| D3 | **New tooling:** approve `scripts/guest-sandbox-migrate.mjs`? Your earlier "no new tooling" covered round two. The alternative is Supabase CLI `db push --db-url`, which has no target guard and uses the CLI history table | Approve the script |
| D4 | **Round-one VM:** what value did its guest `.env.local` hold for `SUPABASE_SECRET_KEY`? If it was a real key, revoke or rotate it in Supabase (your cloud action). Removing the line from the VM would touch preserved evidence | Rotate if real; otherwise preserve the VM |

**Defaults I'll apply unless you say otherwise:**
- Data-access code and types for a guest feature stay inside the assignment's feature folder. `src/services/**` and `src/types/**` stay protected, and Engineering relocates that code at adoption.
- The database credential goes in a separate `.env.sandbox.local`.
- The selector label "Guest frontend proposal" is unchanged.

## 6. Sequencing and Git

- **This approval** covers Stages A and B plus the doc and rule changes. Stage C needs your separate go and your cloud actions. The fourth field stays NO.
- **Branch:** `pilot/vik-round2-onboarding` is pushed at `08bfa11`, and `origin/main` is still `d2a0d13`. If the round-two PR is not merged yet, this work can go on the same branch, so the round-two rehearsal baseline already boots with three values. Your call. I run no Git.

Sources:
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase — Branching](https://supabase.com/docs/guides/deployment/branching)
- [Supabase — Access Control](https://supabase.com/docs/guides/platform/access-control)
- [Supabase — Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase — Branching GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration)
- [Supabase — Postgres roles](https://supabase.com/docs/guides/database/postgres/roles)

→ Awaiting approval.

---

**Correction (Director, 2026-10-14 18:52), appended; the text above is left as written.** In §1.2, "that boot was only possible with a nonempty `SUPABASE_SECRET_KEY` in that environment, most likely in the guest `.env.local`" overstates the evidence. Under the reported boot conditions, startup indicates only that a nonempty value may have been available. It does not show that the value was a real secret, nor that it came from `.env.local`. Its contents remain unknown, and the preserved guest VM is not inspected or altered. D4 is reframed accordingly. **Approval at 18:52:** Stage A only. Stage B, the runner, the runbook, the fourth field and the expanded guest rules remain proposals. The sandbox-development intent is approved in principle, but access and implementation are not authorized.
