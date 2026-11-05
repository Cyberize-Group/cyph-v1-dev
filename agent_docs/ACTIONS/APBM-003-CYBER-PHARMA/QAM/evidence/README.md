# evidence/ — durable measurements and attempt history (`APBM-003-CYBER-PHARMA`)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: QA Executor (Claudy)**; the Architect declared the lane and expected outputs; the QA Lead decides retention.

## Layout (attempt-scoped; prior attempts never overwritten)
```
evidence/
├── preflight/<attempt>/   PREFLIGHT_RESULTS.txt + raw outputs per row
├── identity/<attempt>/    HEAD, status, ancestry, inventory reconciliation, complete candidate→HEAD diff, migrations-0001..0047 and auth-path byte-identity diffs
├── board/<attempt>/       QA-controlled build, tsc, lint, Jest
├── schema/<attempt>/      catalog queries: policies per table/command, grants, function defs, index (AC-1xx)
├── seed/<attempt>/        comparator runs (+ attack), identity scan (+ fixture/control), money-rule recomputation sample (AC-2xx)
├── audit/<attempt>/       direct-read denials per token, wrapper successes, per-operation audit counts incl. forced retry (AC-3xx)
├── apply/<attempt>/       QA's independent re-verification of the Director's checkpoint outputs (AC-4xx)
├── reads/<attempt>/       role × store results through the app (AC-5xx), spoof refusal, R-016 states
├── admin/<attempt>/       read views per role, write-control no-mutation hashes (AC-6xx)
├── browser/<attempt>/     Playwright matrices, cropped screenshots, sanitized traces, sign-in counts
├── deploy/<attempt>/      revision↔commit, env var names, bundle pattern scan (AC-7xx); Gate D record goes to ../../EVIDENCE/deploy/GATE_D.md
├── regression/<attempt>/  rls:prove, audit:prove, db-verify (AC-8xx)
├── privacy/<attempt>/     scanner validation + scan reports (counts/locations only)
└── INVENTORY.md
```

## Rules
Every PASS/FAIL cites a path here with command, working directory, exit code and unfiltered output (or cropped screenshot / sanitized trace). Raw authenticated traces are sensitive: retain only approved sanitized evidence. Write scope: here, `AUTOMATION/`, `HANDOFFS/` and the Executor-owned files/cells in `../QAM_ENTRY.md` §3 — never product, tests, contracts, `../QAM_MANIFEST.md` or the Engineer's `../../EVIDENCE/`. Carried-forward evidence is referenced with its original SHA and attempt. No row exports of tenant tables beyond the counts/hashes the plan names.

## Inventory
| Path | Attempt | Test ID / AC | What it shows | Produced by | Sanitized? | Retention (QA Lead) |
|---|---|---|---|---|---|---|
| none yet | | | | | | NOT RECORDED |
