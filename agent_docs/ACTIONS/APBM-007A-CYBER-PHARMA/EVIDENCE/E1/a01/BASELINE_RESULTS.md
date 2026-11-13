# Baseline results — E1 a01

All runs were in disposable copies under `/home/moose/NEXTJS/CYBER_PHARMA/APBM007A_E1_WORK/a01/baseline/`, made without `.git`, `node_modules`, `.next`, any `.env*` file or `agent_docs`. Placeholder Supabase URL and key only (an `.invalid` host). No E2E, integration, seed, reset or database script was run. Logs: `APBM007A_E1_WORK/a01/out/baseline_*.log`.

## 1. Tooling

Package manager npm 11.15.0 with `package-lock.json` in both repos; Node 22.17.0; neither repo pins a Node version (`engines`, `.nvmrc` absent).

Scripts inspected first. Not run because they touch a database, Auth or a browser: OwedBook `db:*`, `rls:prove`, `audit:prove`, `seed:*`, `dev:verify`, `test:e2e*`; portal `test:e2e`. Portal `test:integration` selects `__tests__/api`, which does not exist in the portal, so it was not run.

## 2. Results

| Step | OwedBook (`bc4e433`) | Portal, working-tree lock | Portal, committed lock |
|---|---|---|---|
| `npm ci` | pass | pass | pass |
| `tsc --noEmit` | pass | pass | pass |
| lint | pass (`eslint .`) | **fail** | not run (same script) |
| jest | **47 failed / 154 passed** of 201 (14 of 40 suites) as-is; **201/201** with `NEXT_PUBLIC_APBM_DATA_MODE=mock` | 248/248 (13 suites) | 248/248 |
| `next build` | pass | pass | pass |

## 3. Inherited tooling issues and proposed fixes (for E2, not applied)

| Issue | Cause | Proposed fix |
|---|---|---|
| Portal lint fails immediately: "Invalid project directory … /lint" | Script is `next lint`, which Next 16 no longer provides; the portal has no `eslint` dependency | Adopt OwedBook's flat ESLint config and `eslint .` script in the portal |
| OwedBook unit tests fail without an environment variable | 14 suites assume mock data mode; `jest.setup.ts` does not set it and real mode is the default | Set `NEXT_PUBLIC_APBM_DATA_MODE=mock` in `src/__tests__/jest.setup.ts`; suites that need real mode already set it themselves |
| Portal `test:integration` matches no files | Path pattern inherited from the template | Remove or repoint when API route tests are added in E2 |
| No Node version pin in either repo | — | Add `engines` and `.nvmrc` at 22.x |

## 4. Portal lock file provenance

- Committed lock (`HEAD`) is byte-identical to the lock at `HEAD` of the archived certified repository `ARCHIVE/cyph-stripe-subscription-portal-v1`.
- The working-tree lock differs by 5,872 insertions and 3,617 deletions. Its modification time (10 November 2026 15:25:09 +06) equals that of `node_modules/.package-lock.json`, so it was rewritten by a local `npm install` after cloning.
- Top-level versions are unchanged (`next` 16.4.3, `stripe` 22.1.0); transitive dev dependencies moved (for example the Jest 30.4 → 30.5 family).
- Both locks install, typecheck, test and build identically.

Disposition is Tony's. Recommendation: restore the committed lock before branching, so the E2 starting point equals the certified dependency set. Not done here.

## 5. FFM certificate equivalence

Manifest: portal `agent_docs/ACTIONS/cyph_subscription_portal_phase1_ffm_abm/QAM/evidence/repair006/snapshot-input-manifest.json`, SHA-256 `f7181d3c…e9ab` as recorded in the Gate Q decision. Decision file: same module, `QAM/HANDOFFS/CYPH_SUBSCRIPTION_PORTAL_GATE_Q_DECISION_2026-10-30.md`. The original verifier hard-codes the old repository path, so a path-parameterized copy was run from the work lane.

| | Result at portal `c89572a` |
|---|---|
| Manifest inputs | 168 |
| Matching at HEAD | 163 |
| Differing at HEAD | 5: `.dockerignore`, `Dockerfile`, `cloudbuild.yaml`, `deploy.sh`, `init-app.sh` |
| Extra inputs not in the manifest | 2: `.gcloudignore`, `stark-deploy.yaml` |
| Differing in the working tree only | `package-lock.json` |
| Files under `src/`, `e2e/`, `public/` that differ | 0 |

Reading: the application source is the certified FFM source. The deployment files were changed by the 3 November staging deployment after Gate Q. This checkout is therefore not the certified snapshot by name; it is a **fresh candidate baseline** whose application inputs are equal to it. The FFM certificate is not inherited by 007A.
