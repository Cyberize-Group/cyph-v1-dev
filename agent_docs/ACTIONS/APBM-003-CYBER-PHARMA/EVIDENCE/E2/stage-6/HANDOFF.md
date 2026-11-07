# APBM-003 Stage 6 — functional checks PASS; two copy paths pending

Engineering: Cody. Repo `Cyberize-Group/cyph-v1-dev`, branch `apbm-003`, unchanged HEAD `49dec499d665125bb8764ccc8ea498c5fdfcdcd1`. Product changes remain uncommitted for Tony. This is a Stage 6 engineering handoff, not independent Gate Q or completion of stages 7–8.

## Director sequencing and targets

The current Director instruction releases Stage 6 on existing disposable SCRATCH `ihgcsrypblqkwommrkgj`, using its existing synthetic fixtures. It supersedes the previous Stage 6 dependency on a DEV APPLY receipt. Dev v1 `yrsuwikjnbmvpznrgydb` remains the intended rollout backend. Shared DEV APPLY and restore rehearsal are deferred to DevOps and remain incomplete. No new project was created; no shared DEV connection or write, Git mutation, reset, reseed or schema change occurred in this Stage 6 execution.

## Implemented behavior

- Real mode is the default. `NEXT_PUBLIC_APBM_DATA_MODE=mock` explicitly selects the existing demo implementation. A live failure never falls back to mocks. The claim fixture module is loaded only in the mock methods.
- OwedBook calls the four existing audited RPCs through an immutable, per-store service instance. `tenant_stores` supplies permitted store IDs/capabilities. Scope is local to the mounted surface, never a shared mutable selection. Store switch clears filters/options, resets the pager and hides earlier responses immediately; request tags and cancellation reject late responses, including previously visible KPI data.
- KPI failures display an unavailable error and retry rather than fabricated zeros. Shared refresh reloads KPI, PBM options and the active rows/summary. Federal data remains genuinely absent/NULL. Upload is visibly unavailable in real mode.
- The admin layout authenticates through the unchanged protected helper, then checks tenant capabilities using the server client. Owner/admin navigation derives from the tenancy RPC, not platform user_roles; seeded Owners remain platform members.
- Admin stores, members, account-scoped audit and read-only billing use audited RPCs. The audit viewer requests up to 100 latest events per permitted account/store, avoiding duplicate Owner-account calls. No invented prices, billing dates, account statuses or pharmacy details are substituted. Write services return unavailable or reject; add-store/invite/settings/member/billing controls cannot mutate in real mode.
- The prior A02 disclosure test now verifies the approved Stage 6 KPI error state. All legacy tests remain enabled in explicit mock mode. Three approved APBM test files exercise real-mode contracts, unavailable actions, concurrent store isolation and adverse response timing.

## Actual verification

| Check | Result | Evidence |
|---|---|---|
| Baseline | 36 suites / 178 tests PASS | baseline-tests.log |
| Final local suite | **39 suites / 196 tests PASS**, zero failures/skips | tests.log |
| TypeScript | PASS | typecheck.log |
| Production build, real mode / SCRATCH config | PASS | build.log; run-scratch-app.mjs |
| Lint | 0 errors, 34 warnings (baseline 33) | lint.log |
| SCRATCH schema | Exact approved 0052 catalog: 17 tables, 15 policies, 19 functions | catalog.json |
| Seed/data | 250 claims across five stores, seven users, no Operator; canonical hash unchanged; independent arithmetic 250 checked / 0 failures | seed-before-browser.json; seed-verify.json |
| Owner proof | **19 checks PASS**; B2/B3 accessible without junctions; foreign A1 denied; exact +4 audit events | owner-proof.json |
| Seven-identity read board | **154 checks PASS**; scope, direct-read denial, admin/member distinction and audited RPCs | authenticated-reads.json |
| Browser | **30 checks PASS**, four identities: OWNER3, ADMIN_B2, MEMBER_B1, UNRELATED; Owner phone viewport; plus **4 focused checks PASS** for Updated tab, sort and date/PBM filters | browser-results.json; browser-filter-results.json |
| Stale responses/error/refresh | Adversarial component tests PASS, including late A results after switching to B and immediate clearing of visible old KPIs | apbm-read-states.test.tsx |
| Protected files / backup | **58 protected files unchanged**, including auth/proxy, 0001–0047, next.config and lockfile; both private backup hashes unchanged | PRESERVATION.json; PROTECTED_BEFORE.json |

SCRATCH schema SHA-256: `66782ff92213415443d428ade161b165e04a5aba29999453cb0ab34a7160d061`.
Synthetic content SHA-256: `f7f1270cccbb26896cfeeef4c7326b761bfc90f4080a72d27b66574b83cfabdf`.

The browser runs used the actual Next development server and real synthetic user credentials, not service-role impersonation. Production build was checked separately. No staging, deployed-revision or independent QA claim is made. The browser request guard recorded zero requests to another Supabase project. The four-identity browser board is complemented by the seven-identity RPC board; it is not a substitute for Claudy's complete Gate Q matrix.

First local failures were missing jest-dom setup and a new mock typing issue; fixed without disabling tests. Their logs remain under first-*.log. An initial browser harness attempt was stopped before login to correct the button locator from “Log in” to the actual “Login”; no product workaround was made. The first full browser PASS is retained separately; the final full board was rerun after effect cleanup. A further focused filter/sort run completed the browser coverage.

## Declared SCRATCH effects

Owner proof: 1 login/logout session and 4 audit events. Seven-user read board: 7 sessions and 48 audit events. Two full browser validations: 8 sessions and 164 audit events. Focused filter/sort run: 1 session and 11 audit events. **Total: 17 synthetic login/logout sessions and 227 successful audited-read events.** Rejected foreign-store calls do not create audit rows. Authentication metadata may change normally. No business or schema mutation was attempted; canonical synthetic business content still matches.

## Exact outstanding scope gap

No SCRATCH prerequisite blocked the requested functional tests. Two inherited labels still incorrectly describe live admin data as demo data:

1. `src/components/admin-portal/DemoMarker.tsx`: “Demo · mock data”, used by shared admin headers.
2. `src/components/admin-portal/BillingScreen.tsx`: “Visual only — no real charge is made in this demo.”

Both files are outside A01's exact allowlist. A copy-only amendment was requested asynchronously; no approval has arrived, so both remain untouched. Required next action: Tony approves these exact two additional files, then change the labels conditionally for real/mock mode and verify them. This is a remaining truthful-display scope gap, not a failing SCRATCH test. Do not certify Stage 6 fully closed until it is resolved. No other new product file is requested.

## DevOps rollout handoff

1. Preserve the verified later private archive/proof and the recorded 30/30 post-restore comparison. Their existing private location is recorded in the earlier backup receipt; no backup contents are in this review package.
2. Confirm the full DEV credential prefix and working Session pooler in APBM_DEV_DB_URL. That variable was still direct in the last dedicated DEV preflight; this Stage 6 run uses only SCRATCH and does not infer a correction.
3. Own the supported disposable restore/rehearsal path, retaining all four Auth indexes and the exact three-entry ACL ruling. Prove preservation and the approved 0047 baseline before APBM ledger initialization, then rehearse the reviewed 0048–0052/seed/verifier sequence and recovery handling. Stage 6 does not waive those rollout gates.
4. Tony/DevOps execute shared DEV APPLY under the existing authority and record the actual receipts. DEV signup evidence/checkpoint disposition remains a separate unresolved rollout item; no setting changed here.
5. Rebuild with approved DEV public configuration only after backend readiness. The validation build here embeds SCRATCH public configuration; do not publish it as a DEV build. Complete the remaining candidate/deployment-package work and independent Gate Q, then obtain the separate staging/deployment approval and Gate D verification.

## Reproduction and review

From this checkout, local suite: `NEXT_PUBLIC_APBM_DATA_MODE=mock npm test -- --runInBand`; `npx tsc --noEmit`; `npm run lint`. The three APBM files exercise real mode explicitly. `node agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-6/run-scratch-app.mjs build` validates the explicit SCRATCH configuration and builds real mode without editing .env.local.

Live proof commands/scripts require the complete RLS_REPLICA_ prefix and the existing private 0600 synthetic cast file referenced by the scripts. Do not substitute DEV or print credentials. Reruns create the declared audit/session effects. The local server at 127.0.0.1:3137 and test browser processes were stopped; no owned process remains. Existing private backup/cast files were preserved. A helper used while editing, `/tmp/apbm_stage6_ui.py`, contains source transformations only, no credentials.

23 Stage 6 product/test paths and SHA-256 hashes are in SOURCE_HASHES.json. The current E2 manifest was updated; its prior 34-file version is preserved in SOURCE_HASHES_BEFORE_STAGE6.json. GIT_COMMANDS.md supplies exact scoped commands for Tony. Documentation paths already contained earlier uncommitted work; review their accumulated diff before staging. No commands were executed on Tony's behalf.
