# Stage A — startup correction: result

**Date:** 2026-10-14 19:02 · **Approval:** Stage A only (18:52). This is engineering implementation, not QA certification or release. External handoff ready stays **NO**.
**Verified before editing (18:52):** branch `pilot/vik-round2-onboarding`, HEAD `08bfa118d35e60c6c009f8f42828f50e1951aa44`.
**Not done:** no staging, commits, pushes, merges, cloud changes or credential changes. I did not open the factory `.env.local` and did not touch the round-one VM or clone.

## 1. Exact scoped diff (application code and tests)

I edited two files and added two tests. The diff below covers only these four files.

```diff
diff --git a/src/instrumentation.ts b/src/instrumentation.ts
index 5fb3809..d84f7c0 100644
--- a/src/instrumentation.ts
+++ b/src/instrumentation.ts
@@ -4,6 +4,12 @@
 // Naming convention: Supabase Q4-2025 update — `publishable` replaces `anon`,
 // `secret` replaces `service_role`. See `.env.example` for current names.
 //
+// SUPABASE_SECRET_KEY is deliberately NOT required at boot (Director decision,
+// 2026-10-14): no route, page, component or Server Action reads it. Its only
+// reader, createAdminClient() in src/utils/supabase/admin.ts, fails closed at
+// call time when the key is missing or blank. Add it back here when a runtime
+// consumer exists.
+//
 // Phase-deferred additions (add when consumed in code, not before):
 //   - Phase 6: GHL_WEBHOOK_SECRET (GoHighLevel webhook signing)
 //   - Phase 7: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_*
@@ -11,7 +17,6 @@
 const REQUIRED_ENV = [
   "NEXT_PUBLIC_SUPABASE_URL",
   "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
-  "SUPABASE_SECRET_KEY",
   "NEXT_PUBLIC_SITE_URL",
 ] as const;
 
diff --git a/src/utils/supabase/admin.ts b/src/utils/supabase/admin.ts
index aec006e..4babf07 100644
--- a/src/utils/supabase/admin.ts
+++ b/src/utils/supabase/admin.ts
@@ -21,7 +21,7 @@ export const createAdminClient = () => {
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!
 
-  if (!supabaseUrl || !supabaseServiceKey) {
+  if (!supabaseUrl?.trim() || !supabaseServiceKey?.trim()) {
     throw new Error('Missing Supabase admin credentials')
   }
 
--- /dev/null
+++ b/src/__tests__/instrumentation.test.ts
@@ -0,0 +1,59 @@
+import { register } from '@/instrumentation';
+
+// Boot-time env validation (src/instrumentation.ts). SUPABASE_SECRET_KEY is not a
+// boot requirement; the three public settings still fail closed.
+
+const PUBLIC_ENV = [
+  'NEXT_PUBLIC_SUPABASE_URL',
+  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
+  'NEXT_PUBLIC_SITE_URL',
+] as const;
+const TOUCHED_ENV = [...PUBLIC_ENV, 'SUPABASE_SECRET_KEY'] as const;
+
+function bootError(): string | null {
+  try {
+    register();
+    return null;
+  } catch (error) {
+    return (error as Error).message;
+  }
+}
+
+describe('register (boot-time env validation)', () => {
+  let savedEnv: Record<string, string | undefined>;
+
+  beforeEach(() => {
+    savedEnv = Object.fromEntries(TOUCHED_ENV.map((key) => [key, process.env[key]]));
+    // jest.setup.ts injects a placeholder secret; these tests need it absent.
+    delete process.env.SUPABASE_SECRET_KEY;
+    jest.spyOn(console, 'log').mockImplementation(() => {});
+  });
+
+  afterEach(() => {
+    for (const key of TOUCHED_ENV) {
+      if (savedEnv[key] === undefined) delete process.env[key];
+      else process.env[key] = savedEnv[key];
+    }
+    jest.restoreAllMocks();
+  });
+
+  it('boots with the three public settings and no SUPABASE_SECRET_KEY', () => {
+    expect('SUPABASE_SECRET_KEY' in process.env).toBe(false);
+    expect(bootError()).toBeNull();
+    expect(console.log).toHaveBeenCalledWith('✓ Environment validated');
+  });
+
+  it.each(PUBLIC_ENV)('fails closed when %s is missing', (key) => {
+    delete process.env[key];
+
+    const message = bootError();
+    expect(message).toContain(`  - ${key}`);
+    expect(message).not.toContain('SUPABASE_SECRET_KEY');
+  });
+
+  it.each(PUBLIC_ENV)('fails closed when %s is whitespace-only', (key) => {
+    process.env[key] = '   ';
+
+    expect(bootError()).toContain(`  - ${key}`);
+  });
+});
--- /dev/null
+++ b/src/__tests__/supabase-admin.test.ts
@@ -0,0 +1,65 @@
+jest.mock('@supabase/supabase-js', () => ({
+  createClient: jest.fn(() => ({ admin: true })),
+}));
+
+import { createClient } from '@supabase/supabase-js';
+import { createAdminClient } from '@/utils/supabase/admin';
+
+// createAdminClient is the only reader of SUPABASE_SECRET_KEY. With the key no
+// longer a boot requirement, this guard is the fail-closed point.
+
+const createClientMock = createClient as jest.MockedFunction<typeof createClient>;
+const TOUCHED_ENV = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY'] as const;
+const FIXTURE_URL = 'https://fixture.invalid';
+const FIXTURE_KEY = 'fixture-not-a-key';
+
+describe('createAdminClient (fail-closed)', () => {
+  let savedEnv: Record<string, string | undefined>;
+
+  beforeEach(() => {
+    savedEnv = Object.fromEntries(TOUCHED_ENV.map((key) => [key, process.env[key]]));
+    // jest.setup.ts injects a placeholder secret; start every test without it.
+    delete process.env.SUPABASE_SECRET_KEY;
+    process.env.NEXT_PUBLIC_SUPABASE_URL = FIXTURE_URL;
+  });
+
+  afterEach(() => {
+    for (const key of TOUCHED_ENV) {
+      if (savedEnv[key] === undefined) delete process.env[key];
+      else process.env[key] = savedEnv[key];
+    }
+  });
+
+  it('throws when SUPABASE_SECRET_KEY is unset', () => {
+    expect('SUPABASE_SECRET_KEY' in process.env).toBe(false);
+    expect(() => createAdminClient()).toThrow('Missing Supabase admin credentials');
+    expect(createClientMock).not.toHaveBeenCalled();
+  });
+
+  it.each(['', '   ', '\t\n'])('throws when SUPABASE_SECRET_KEY is blank (%j)', (value) => {
+    process.env.SUPABASE_SECRET_KEY = value;
+
+    expect(() => createAdminClient()).toThrow('Missing Supabase admin credentials');
+    expect(createClientMock).not.toHaveBeenCalled();
+  });
+
+  it.each(['', '   '])('throws when NEXT_PUBLIC_SUPABASE_URL is blank (%j)', (value) => {
+    process.env.NEXT_PUBLIC_SUPABASE_URL = value;
+    process.env.SUPABASE_SECRET_KEY = FIXTURE_KEY;
+
+    expect(() => createAdminClient()).toThrow('Missing Supabase admin credentials');
+    expect(createClientMock).not.toHaveBeenCalled();
+  });
+
+  it('creates the client when both values are present', () => {
+    process.env.SUPABASE_SECRET_KEY = FIXTURE_KEY;
+
+    createAdminClient();
+
+    expect(createClientMock).toHaveBeenCalledWith(
+      FIXTURE_URL,
+      FIXTURE_KEY,
+      expect.objectContaining({ auth: { autoRefreshToken: false, persistSession: false } }),
+    );
+  });
+});
```

Summary:
- `REQUIRED_ENV` keeps exactly the three public settings. They are still rejected when missing or blank.
- `createAdminClient` still throws `Missing Supabase admin credentials`, and now also does so for whitespace-only values.
- Both test files delete the secret that `jest.setup.ts` injects (`beforeEach`) and restore every env variable they touched (`afterEach`).

**Record files touched:** `agent_docs/VIK/ADAPTATIONS.md` (new Stage A section S1–S4), `CHANGELOG.md`, `RECOVERY.md`, `agent_docs/SESSIONS/session_2026-10-14.md`, and the plan record `response_2026-10-14_182943_…` (dated correction appended at the end; original text unchanged). **New:** `agent_docs/VIK/sandbox-evidence/` and this report.

**Unchanged (byte-identical to HEAD, checked):**
- `CLAUDE.md`, `vibe_docs/**`, `next.config.js`
- `.env.example`, `.env.pilot.example`
- `package.json`, `package-lock.json`
- `src/__tests__/jest.setup.ts`

## 2. Validation

**Where it ran:** a fresh disposable clone of this repo at `08bfa11` in the scratchpad, plus the four files above. The tested files are byte-identical to the factory copies (`cmp`).

**Settings:** a nonsecret fixture `.env.local` with the three public names only (`https://fixture.invalid`, `fixture-not-a-key`, `http://localhost:3000`). Every server and test run was started with `env -u SUPABASE_SECRET_KEY`. I ran nothing in the factory checkout, because that would load its `.env.local`.

| # | Check | Result |
|---|---|---|
| A0 | `npm ci` (Node 22.14.0 / npm 10.9.2) | exit 0, 19 s; `package.json` and `package-lock.json` unchanged |
| A2-0 | **Control:** unmodified HEAD, three public values | Boot fails with "Missing required environment variables: - SUPABASE_SECRET_KEY". The server exits and `GET /` gets no response |
| A2-1 | **Fix:** three public values | "✓ Environment validated" · `GET /` → **200** |
| A2-1 | **Secret absent** | Fixture file: 0 lines name it. Launch shell: 0 entries, plus `env -u`. `/proc/<pid>/environ` for all 5 processes in the server group (npm, sh, node, next-server, worker): 0. Method check: the worker, started after Next loaded `.env.local`, shows `NEXT_PUBLIC_SUPABASE_URL`=1, so the probe does see loaded names. Next reported loading only `.env.local` |
| A2-2 | **Fix:** `NEXT_PUBLIC_SUPABASE_URL` removed | Fails closed, naming only `NEXT_PUBLIC_SUPABASE_URL`. The secret is not mentioned |
| A2 | Stop checks (each run) | Process group gone, 0 node/next-server processes with cwd in the clone, 0 listeners on :3000. Tracked status shows only the overlay; `CLAUDE.md` was not written (`agentRules: false` held) |
| A1 | New tests | **14/14 pass.** Run against unmodified HEAD, **7 fail**: 4 in instrumentation (secret still required, or named in the error) and 3 in the admin client (whitespace accepted). The tests catch the defect |
| A1 | Full jest suite | 36 suites / 178 tests pass (round two: 34 / 164) |
| A1 | `npm run lint` | 0 errors, 35 warnings (same count as the round-two baseline); the four changed files lint clean |
| A1 | `tsc --noEmit` | clean |
| A1 | `npm run build` | OK |
| A3 | Readers of `SUPABASE_SECRET_KEY` | Runtime: `src/utils/supabase/admin.ts:22` only. The admin client is imported only by its new test. `scripts/rls-harness/lib/env.mjs` (factory tooling) is unchanged |

**Evidence:** `agent_docs/VIK/sandbox-evidence/`. Files: A0_npm_ci, A1_checks, A1_new_tests_red_green, A2-0/A2-1/A2-2 startup runs, A3_readers, stageA_tracked.diff. I sanitized scratchpad paths and the LAN IP. A scan for key, connection-string and project-host patterns found nothing.

**Limits:**
- The fixture values cannot prove a real Supabase login. That stays **G04**, in the round-two guest rehearsal, at a baseline that includes this fix.
- `/proc/<pid>/environ` shows only the environment each process started with. Values that Next loads in-process are covered by the fixture-file check and by the worker method check.

## 3. Correction: round-one inference

My 18:29 plan said the round-one boot "was only possible with a nonempty `SUPABASE_SECRET_KEY` in that environment, most likely in the guest `.env.local`". That overstates the evidence. Under the reported boot conditions, startup indicates only that **a nonempty value may have been available**. It does not show that the value was a real secret, nor that it was stored in `.env.local`. **The contents remain unknown.** I have not inspected or altered the preserved guest VM. I appended this correction, dated, to the plan record, and also recorded it in ADAPTATIONS, the session log and RECOVERY.

## 4. Remaining blockers and open items

1. **Real three-value login:** unverified until G04. This needs your commit, the round-two merge and the final `main` SHA first.
2. **Sandbox feature development:** approved in principle only. These are still proposals for the next review:
   - Stage B, the migration runner and the provisioning runbook;
   - the fourth readiness field and the expanded guest rules;
   - any sandbox access;
   - decisions D1–D4, with D4 reframed as "what value, if any, was available on the round-one VM".

   The ADAPTATIONS finding is marked resolved for startup only; its sandbox half stays open.
3. **Dependency advisories (34):** disposition is still pending and unchanged by this work.
4. **Round-one clone's generated `CLAUDE.md` block:** cleanup still needs separate authorization.
5. **Kit consistency:** `GUEST_AI_RULES.md:44` ("must not contain a service-role or secret key") now matches what the app needs at startup. No guest document changed.

## 5. Records

- Session log: 18:52 APPROVED → IN PROGRESS, then COMPLETE (Stage A).
- RECOVERY top block.
- CHANGELOG entry.
- ADAPTATIONS S1–S4 plus the supersession of the withdrawn permission.
- Plan record: correction appended.
- This report.

## 6. Git (yours to run)

These commands commit the Stage A code, tests, evidence and records, including the 18:29 plan record. They push to the existing upstream of `pilot/vik-round2-onboarding`.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
git add src/instrumentation.ts src/utils/supabase/admin.ts \
  src/__tests__/instrumentation.test.ts src/__tests__/supabase-admin.test.ts \
  agent_docs/VIK/ADAPTATIONS.md agent_docs/VIK/sandbox-evidence \
  CHANGELOG.md RECOVERY.md agent_docs/SESSIONS/session_2026-10-14.md \
  agent_docs/RESPONSES/response_2026-10-14_182943_feature-scope-sandbox-db-plan.md \
  agent_docs/RESPONSES/response_2026-10-14_185835_stageA-startup-fix-result.md
git status --short
git commit -m "fix: drop SUPABASE_SECRET_KEY from boot requirements; admin client rejects blank values" \
  -m "Stage A of the feature-scope plan. Three public settings still fail closed. Sandbox DB work not implemented. External handoff ready: NO." \
  -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin pilot/vik-round2-onboarding
```

After `git status --short`, nothing should remain unstaged.
