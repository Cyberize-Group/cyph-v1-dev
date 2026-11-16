# Obligations carried from 007A to 007B

Opened 13 November 2026 by Amendment A1 (APBM_RULINGS.md). Each item must be closed with evidence in 007B, or by a later Director ruling recorded in APBM_RULINGS.md. None of them is a 007A pass.

| ID | Obligation | Source | 007A status | Required before |
|---|---|---|---|---|
| O-1 | Live failed-renewal and seven-day-grace journey in the Stripe sandbox, with a test-clock seam: failure recorded once, grace not restarted by retries, read-only after day 7 by server time, payment clears the same delinquency, late failure does not reopen | A1-2 (G2); AC-031, AC-032, expansion 031–032, RA-6 renewal failure | **NOT RUN BY DIRECTOR RULING**; never passed. SQL and unit checks retained | Production billing |
| O-2 | Renewal reminder email delivery to the owner (needs a mail-sending credential or provider template; currently none in the frozen configuration) | A1-3 (G5); BILLING "Lifecycle and access" | Deferred. 007A has the in-app banner and a `pending` `renewal_reminder` notification record (`last_error_code` `email_deferred_007b`) | Production billing |
| O-3 | Replace the placeholder Terms, Privacy, support address and price-consent wording with final content | Director ruling, 16 November 2026 (APBM_RULINGS.md) | Accepted for 007A local use only | Any external or staging exposure |
