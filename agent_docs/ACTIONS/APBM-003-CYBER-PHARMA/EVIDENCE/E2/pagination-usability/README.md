# OwedBook results toolbar — Director manual-smoke repair

2026-11-09 · Engineer Cody · branch qa/apbm-003 · base HEAD c5061d9f75fa242a3d14913c08d6bbad7173c638. Uncommitted product change under Tony's explicit repair instruction. Prior repaired candidate dc44429f466dedcf35023342f68624c6cee062f0 remains historical; no certificate identity changed. Treat this as a post-certification product change requiring Friday's targeted review. QAM_CERTIFICATION.md on disk still has NOT RECORDED fields; no certification is inferred or manufactured.

## Change and scope

- New pure ResultsToolbar component derives actual range from returned page, limit, total and rows.length, and displays page count. Empty result: Showing 0 of 0 claims / No pages / both controls disabled.
- OwedBookScreen renders it directly after DataTable/empty state, outside the desktop horizontal-scroll wrapper, with a 16px gap. Normal flow, no floating/sticky positioning. Summary and unavailable Federal have no toolbar; pending/stale/error/unscoped results retain existing guards.
- Existing Previous/Next state handlers and all fetch effects/dependencies are unchanged. No new data hook, service, query or RPC in the toolbar.
- Square card panel, visible border, narrow coral accent, foreground/background token fill for Next, outlined Previous. Disabled buttons retain full readable text with muted fill; visible focus rings; minimum 44px height. Desktop result count left, controls right; mobile stacked.
- No global styles, fixtures, calculations, auth, admin, services, scripts, migrations or database state changed. No deployment or Git mutations.

## Exact source/test paths

- `src/components/owedbook/OwedBookScreen.tsx`
- `src/components/owedbook/ResultsToolbar.tsx`
- `src/__tests__/apbm-read-states.test.tsx`
- `src/__tests__/owedbook/ResultsToolbar.test.tsx`

Documentation edited: APBM_RULINGS.md (Director scope), QAM/QAM_MANIFEST.md §8 amendment, APBM_JOURNAL.md. New engineering evidence is confined to this directory: README.md, source-hashes.json, verify-layout.mjs, layout-results.json, runtime.json, tests.log, full-tests.log, typecheck.log, lint.log, build.log and the 16 named PNGs listed in layout-results.json. No independent QA record edited.

## Actual validation

| Check | Result | Evidence |
|---|---|---|
| Relevant existing/new OwedBook tests + async states | 9 suites / 35 tests PASS | tests.log |
| Full local board | 40 suites / 201 tests PASS; none skipped | full-tests.log |
| Typecheck | PASS, exit 0 | typecheck.log |
| Lint | PASS, 0 errors / 34 warnings | lint.log |
| Production real-mode build | PASS | build.log |
| Layouts | 16 PASS: light/dark × 1440/375 × first/last/partial/empty | layout-results.json, PNGs |
| Accessibility measurements | Panel/button text contrast ≥4.5:1, buttons ≥44px, visible keyboard focus, native disabled boundaries | layout-results.json |
| Placement | Outside scroll container, ≥12px gap, no horizontal overflow or clipped buttons in every layout | layout-results.json |
| Request behavior | Initial 1 rows + 1 KPI + 1 options; Next/Previous each +1 rows only. Filter and store changes reset page; stale guards preserved. Toolbar rendering initiates no request | apbm-read-states.test.tsx; tests.log |
| Runtime | /auth HTTP 200; new toolbar asset HTTP 200 and byte-identical; only Dev v1 URL among client Supabase refs | runtime.json |

Commands from repository root:

```bash
NEXT_PUBLIC_APBM_DATA_MODE=mock npx jest --runInBand --ci src/__tests__/owedbook src/__tests__/apbm-read-states.test.tsx
npx tsc --noEmit --tsBuildInfoFile /tmp/apbm-pagination.tsbuildinfo
npx eslint .
NEXT_PUBLIC_APBM_DATA_MODE=real npm run build
node agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/pagination-usability/verify-layout.mjs
NEXT_PUBLIC_APBM_DATA_MODE=mock npx jest --runInBand --ci
```

The screenshots render the actual React DataTable, commercial columns and new toolbar using existing local fixtures and production CSS. They are component-layout evidence, not a signed-in application/DEV browser proof. The 31-row partial-page case is a local slice of unchanged fixture data; no fixture file was changed. All browser network requests were blocked; zero requests occurred. Event behavior, filtering and store changes are verified in mounted screen/provider integration tests. No authenticated probes were run in this repair, so no sessions or audit rows were created by verification. Tony's live smoke and Friday's targeted review remain required.

## Local manual test

Open http://localhost:3000/owedbook (login via /auth if needed). Hard-refresh an existing tab to load the new chunks. No Tony restart is needed now. Port 3000 was inspected before any restart: initially absent, then a concurrently started process predated the completed build and returned 404 for the toolbar chunk. That specific stale process was gracefully stopped; the updated build is now served on the same port. Port 3137 and QA port 3138 were not restarted. No competing port-3000 server was launched.

Use OWNER3 and a permitted store. Commercial Dollars, June 1–30 2026, status All, unrestricted PBMs:

1. Scroll below the last row/card and find the results toolbar: Showing 1–25 of 50 claims; Previous disabled.
2. Next → Showing 26–50 of 50 claims; Next disabled.
3. Previous → first page again. Tab through controls and check visible focus.
4. Apply a filter: page resets, displayed range follows filtered total. A zero-match filter shows zero claims and disabled navigation.
5. Switch B1/B2/B3: page resets and no previous store's ranges/rows linger.
6. Repeat in light/dark and phone width. Summary/Federal must not gain pagination. Check Updated Payments uses its actual subset totals.

If the server is later stopped, restart the completed local build with `npm run start -- --port 3000` from the repository. Local build only; no deployment.

## Review boundary

Friday should review AC-502/503/507/803/902 narrowly: placement/contrast/accessibility, first/last/partial/empty ranges, both paginated tabs, filter/store resets and stale/error behavior, unchanged request counts and protected-path diff. Tony owns the commit and manual acceptance. The new revision is not automatically certified by the prior candidate's review.
