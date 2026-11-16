# Obligations carried from 007A to 007B

Opened 13 November 2026 by Amendment A1 (APBM_RULINGS.md). Each item must be closed with evidence in 007B, or by a later Director ruling recorded in APBM_RULINGS.md. None of them is a 007A pass.

| ID | Obligation | Source | 007A status | Required before |
|---|---|---|---|---|
| O-1 | Live failed-renewal and seven-day-grace journey in the Stripe sandbox, with a test-clock seam: failure recorded once, grace not restarted by retries, read-only after day 7 by server time, payment clears the same delinquency, late failure does not reopen | A1-2 (G2); AC-031, AC-032, expansion 031–032, RA-6 renewal failure | **NOT RUN BY DIRECTOR RULING**; never passed. SQL and unit checks retained | Production billing |
| O-2 | Renewal reminder email delivery to the owner (needs a mail-sending credential or provider template; currently none in the frozen configuration) | A1-3 (G5); BILLING "Lifecycle and access" | Deferred. 007A has the in-app banner and a `pending` `renewal_reminder` notification record (`last_error_code` `email_deferred_007b`) | Production billing |
| O-3 | Replace the placeholder Terms, Privacy, support address and price-consent wording with final content | Director ruling, 16 November 2026 (APBM_RULINGS.md) | Accepted for 007A local use only | Any external or staging exposure |

## Carried at closeout, 16 November 2026

Status of 007A: closeout prepared; Director merge/push pending. O-1, O-2 and O-3 above stay open. These items also carry forward; they are not new 007A passes.

| Item | Carried | Owner / trigger |
|---|---|---|
| Certificate risks 1–11 | Accepted as written in `QAM/QAM_CERTIFICATION.md` (restore not proven; AC-004 rehearsal reuse; real-Auth crash simulated only; O-1/O-2; Mission Control; placeholders; listener HTTP answers; email and Stripe request counts; generic-form link not ledgered; idempotency-key window L2; keyboard, theme and promotion-variant coverage not exhausted) | Director / QA Lead; before production, or at the next QA gate covering them |
| U-2 price | OwedBook billing shows no numeric price. "Price shown in the billing portal" is the accepted local presentation; no amount was verified and none is claimed | Director rules; then Architect scopes a database mirror or a provider read |
| U-1, U-2, U-3 | Director-accepted, not independently QA-certified (engineering fixture proof only) | QA Lead, at the next gate covering these screens |
| Mission Control | Outside 007A scope by Director ruling; not graded, not a limitation | Separate scope if wanted |
| Fixtures | DEV and SCRATCH data, Stripe sandbox objects and QA identities are retained and inventoried by ID (`QAM/evidence/Q5/a01/`). No deletion authority is granted | Director fixture-cleanup ruling; QA executes |
| Restricted archives | `APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r01.zip` and `_r02.zip` contain an exact private-cast value. Kept immutable and restricted in `/home/moose/APBM007A_QA_ARCHIVE/`, outside Git, never re-exported | Director retention ruling |
