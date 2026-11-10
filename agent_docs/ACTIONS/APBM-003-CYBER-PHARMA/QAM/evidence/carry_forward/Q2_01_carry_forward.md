# Carry-forward register — Q2/01 evidence reused in Q4/01

Source of truth for member hashes: `HANDOFFS/FILE_INDEX_Q2_01.json` (package `APBM-003-CYBER-PHARMA_Q2_REVIEW_01.zip`, external SHA-256 `a266c5010b0775205bc88ebf6c670eafd4c9829520bf06ed7ad1d8ac594440f2`). Applicability basis: the repair diff `308247a2..dc44429f` touched only `DemoMarker.tsx`, `BillingScreen.tsx`, `OwedBookContext.tsx` (T-00, `identity/03/t00_repin_q4.txt`); no migration, seed, harness, service or auth path changed, so every SCRATCH (Group B) result and every DEV (Group C) result not named in QAM_APPROVAL §4 remains applicable to the repaired candidate. Integrity: every carried file re-hashed on disk against the Q2 index at Q4 packaging.

| Q2 lane | members | bytes | applicability in Q4 |
|---|---|---|---|
| `evidence/INVENTORY.md` | 1 | 86766 | carried |
| `evidence/README.md` | 1 | 2633 | carried |
| `evidence/admin/01` | 1 | 3022 | Group C DEV T-36 (re-run as admin/02) |
| `evidence/apply/01` | 7 | 26484 | Group C DEV T-30/T-31 (AC-404 DEV half carried per C-04) |
| `evidence/audit/01` | 15 | 111437 | Group B SCRATCH T-14…T-21 cast matrix + audit counts |
| `evidence/board/01` | 8 | 114441 | Group A T-01 (superseded by board/02 in Q4; retained) |
| `evidence/browser/01` | 150 | 16339826 | Group C DEV T-33…T-40 all identities (OWNER3 admin/OwedBook legs re-run as browser/02; other identities carried) |
| `evidence/deploy/01` | 7 | 7158 | T-32 QA build + bundle scan (new build recorded in board/02 + deploy/02) |
| `evidence/derivations/01` | 10 | 32526 | AM-1/AM-2 derivations (allowlist superseded by derivations/02; others carried) |
| `evidence/env/01` | 4 | 7547 | Q1b credential tooling |
| `evidence/identity/01` | 13 | 44329 | Q1 identity |
| `evidence/identity/02` | 15 | 32815 | Q2 T-00/T-04/T-50/fence attacks (T-00/T-04/T-50 re-run in identity/03; attacks carried) |
| `evidence/preflight/01` | 2 | 8893 | Q1 preflight |
| `evidence/privacy/01` | 7 | 5608 | PF-5.2 scanner validation |
| `evidence/reads/01` | 9 | 233291 | Group C DEV T-35 R-016 read states |
| `evidence/regression/01` | 35 | 409210 | Group B SCRATCH rls:prove / audit:prove / db-verify |
| `evidence/schema/01` | 33 | 363223 | Group B SCRATCH T-10/T-11 catalog |
| `evidence/seed/01` | 39 | 36020 | Group B SCRATCH T-12/T-13 seed + money rules |

Integrity check: 357 Q2 evidence members re-hashed; changed on disk = 0; missing = 0.
