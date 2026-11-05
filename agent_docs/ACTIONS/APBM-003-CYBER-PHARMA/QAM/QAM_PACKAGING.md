# QAM_PACKAGING — automatic review packages for `APBM-003-CYBER-PHARMA`

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0. **Owner: QA Executor (Claudy) builds every package; the Architect set the module-specific exclusions below.** Instructions, not a tool. The Director never asks "which files?".

## 1. When
Every Q1 return, Q2 return, material stop and Q4 return. Packaging does not rerun passed tests.

## 2. Destination and naming
`QAM/HANDOFFS/APBM-003-CYBER-PHARMA_<PHASE>_REVIEW_<NN>.zip`, `<PHASE>` ∈ Q1, Q2, Q4, STOP; two-digit attempt per phase. Module copy canonical; a byte-identical Downloads copy allowed when requested. Never nest previous ZIPs. Return: absolute path, member count, SHA-256, exact decision requested.

## 3. Inclusion list (per phase)
| Member | Q1 | Q2 / Q4 | STOP |
|---|---|---|---|
| `REVIEW_START_HERE.md` (filled copy) | ✔ | ✔ | ✔ |
| `FILE_INDEX.json` | ✔ | ✔ | ✔ |
| `QAM_STATE.md` — immutable pre-export snapshot | ✔ | ✔ | ✔ |
| `QAM_ENTRY.md` | ✔ | ✔ | ✔ |
| Frozen contract + rulings (copies or exact references with hashes): `../APBM_ACCEPTANCE_SPEC.md`, `../CONTRACTS/*.md`, `../APBM_RULINGS.md` | ✔ | ✔ | ✔ |
| `GOVERNING/README.md` | ✔ | ✔ | ✔ |
| `QAM_MANIFEST.md`, `HANDOFFS/ENGINEERING_HANDOFF.md` | ✔ | ✔ | as relevant |
| `QAM_PREFLIGHT.md` + `evidence/preflight/<attempt>/` | ✔ | rechecked rows | ✔ |
| `QAM_RECON_REPORT.md` (actual recon files) | ✔ | ✔ | as relevant |
| `QAM_TEST_PLAN.md` (draft / bound) | ✔ | ✔ | as relevant |
| `QAM_APPROVAL.md` | — | ✔ | as relevant |
| `QAM_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, `FINDINGS.md` | — | ✔ | partial, as safe |
| `evidence/**` sanitized + `AUTOMATION/` helper sources | identity evidence | ✔ | partial |
| `../EVIDENCE/apply/**` (Director checkpoint evidence, indexed by path) | ✔ | ✔ | as relevant |
| Exact certification / approval text when instructed to transcribe | — | ✔ when present | — |
| Repo-required response/session records (indexed by path) | ✔ | ✔ | ✔ |

## 4. Exclusions (always)
`.env.qa.local`, every `.env*`, auth state (`storageState`, cookies, tokens), browser profiles, Playwright browser binaries, `node_modules/`, `.next/`, caches, Git internals, disposable mirrors, raw authenticated traces, image bodies beyond the approved sanitized set. **Module-specific:** any dump or row export of `user_data`, `accounts`, `profiles` or `auth.users` beyond the counts and hashes the plan names (synthetic or not — the habit matters); the seed's generated password material; cloud credentials or service descriptions containing secrets.

## 5. Build and verify
1. Pre-export state entry in `QAM_STATE.md` (no ZIP hash yet). 2. Assemble the inclusion list; existence check first. 3. `FILE_INDEX.json` with archive path, source path, purpose, bytes, SHA-256 per member except itself. 4. ZIP with one top-level folder named after the stem. 5. Verify membership, hashes, safe paths, no duplicates, archive integrity, privacy scan of selected contents **and** expanded members. 6. ZIP SHA-256 computed outside the ZIP; recorded in `HANDOFFS/README.md`, the return message, and a subsequent live `QAM_STATE.md` entry.

## 6. Snapshot rule
The archived `QAM_STATE.md` cannot contain its own package hash; the later live entry supplies it. Never rebuild a ZIP to insert its hash. Privacy rules apply to every package including partial and stop packages.
