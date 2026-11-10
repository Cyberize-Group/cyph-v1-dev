# money_rules.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Source: SFC §3 rules 1–7 restated as checks; reference inputs per generate.mjs (vintage 2026-01-01; aac_date = vintage; wac effective_date = vintage; ful year 2026 month 1); config fee 10.64, brand multiplier 0.96.

For every user_data row r joined to aac (ndc, aac_date=vintage), wac (ndc, effective_date=vintage), ful (ndc, 2026/1):
1. FEE: expected_paid − round(qty × medicaid_rate, 2) = 10.64 (one vintage).
2. EXPECTED: expected_paid = round(qty × rate + 10.64, 2) with rate = round(rate_raw, 5).
3. OWED: owed = expected_paid − total_paid (signed; negatives present per store).
4. PRICING ORDER: rate_raw = aac if present; else wac/(pkg_size×pkg_size_mult) × (0.96 if generic_indicator='B' else 1.0); for generics (not 'B') with a FUL row and rate_raw > aca_ful → rate = aca_ful and method 'FUL'. Method: AAC / BWAC / GWAC / FUL accordingly; medicaid_rate = round(rate,5).
5. METHOD VOCABULARY ⊆ {AAC, FUL, GWAC, BWAC, Take Action, Manual Override}.
6. PBM KEY: pbm_key = int(bin) + '-' + pcn + '-' + group_field (BIN leading zeros stripped); unmatched rows (insurance NULL) present.
7. POINT-IN-TIME: aac_date_used/wac_date_used/ful_*_used populated consistent with the method; rate_source non-null.

Coverage per store: 50 rows; statuses {new, underpaid, pending, emailed_pbm, recovered} all present; owed both signs; ≥3 distinct PBMs + NULL-insurance rows; four Phase-5 fields NULL in wrapper output (report_file, aac, federal_expected, federal_diff).

Mocks (src/mocks/owedbook.ts, A1 only, 50 rows): fields available are expected, original_paid, owed, medicaid_rate, qty, method, pbm; rules 1–3 and 5 checked; rule 6 not applicable to the mock shape (no bin/pbm_key) — recorded as not applicable, not PASS.
