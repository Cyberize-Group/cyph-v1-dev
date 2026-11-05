# AUTOMATION/ — approved QA helpers and instrument controls (`APBM-003-CYBER-PHARMA`)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: QA Executor (Claudy) writes helpers within this lane; the Architect declared the lane; the QA Lead approves retention at cleanup.** QA-only instruments, never product runtime dependencies.

## Lane rules
- Credentials only from `.env.qa.local` into process memory; never into commands, logs, exceptions, screenshots, traces, JSON or ZIPs. `.env.local` is never read, hashed or copied.
- Every helper states its working directory and performs existence checks before diffs, greps or counts.
- A helper that cannot fail is not an instrument: at least one deliberate attack per instrument class, non-zero failure preserved. Expected instrument classes here: direct-read probe (attack: run it against a table the user *can* read and confirm it reports "allowed"), seed comparator (attack: alter one money value), identity scanner (attack: synthetic leak fixture), audit-count probe (attack: inject a forced retry), Playwright role matrix (attack: a deliberately wrong expected store list), bundle secret-pattern scan (attack: a synthetic key fixture).
- Repairs logged in `../QAM_EXECUTION_REPORT.md` §3 with the failed attempt preserved. Never weaken an assertion, add a hidden retry or skip a test.
- Playwright browsers installed under this lane only; no persistent browser storage — if unavoidable, declare the temp path here and its cleanup step.
- SCRATCH destructive helpers must assert the project ref before any write (never run against DEV by habit).

## Helper inventory
| Helper | Purpose | Inputs (by name) | Working directory | Instrument control (how attacked) | Retained after cleanup? (QA Lead) |
|---|---|---|---|---|---|
| none yet | | | | | NOT RECORDED |
