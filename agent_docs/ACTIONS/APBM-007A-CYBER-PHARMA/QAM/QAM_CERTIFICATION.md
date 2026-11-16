# QAM certification — APBM-007A-CYBER-PHARMA

Issued 16 November 2026, 15:00 Asia/Dhaka, by the QA Lead (Friday), relayed by the Director. Executor: Cody. To be transcribed verbatim into `QAM/QAM_CERTIFICATION.md` at cleanup.

## Verdict

**GATE Q: PASS WITH KNOWN RISK.** The listed risks were accepted by the Director.

## Certified candidate

| Item | Value |
|---|---|
| OwedBook | `c976968b20ee724f7390d5e0e008215f50ab6f25` (`qa/apbm-007a`) |
| Payment Portal | `54a56b55ea7c72783d17d06ff45cd27b5426803f` (`qa/apbm-007a`), product `6ed09ffc05685a163833cb68fcae4383c67ae349` |
| Contract | v1.0 as amended by Spec Amendment A1 and erratum E-A1-1 |
| Approved plan | SHA-256 `2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672` |
| Final QA package | `Q4_REVIEW_a05`, SHA-256 `e700ab73ea2eb42e7329f8d508a84e35ddeb795e025bb1106e5d93f627ba4f4b` |
| Director session | Manual, 16 November 13:45–14:25, real inbox, DEV, with Executor read-only verification of each step |

This certificate covers only this pair. It does not cover deployment (Gate D), the later UI changes U-1 to U-3, or any later commit.

## Findings closed by independent evidence

| ID | Closed by |
|---|---|
| F-Q1-01 webhook recovery | Unit and real SCRATCH recovery proofs; live foreign event; operator recovery of a real stuck paid operation (AC-038) |
| F-Q2-001 registration cannot reach review | Three engines, both themes, 375 and 1440 |
| F-Q2-002 undo with both cancellation fields | Unit proof plus Director's live Stripe portal cancel and app undo; Stripe read-back shows both fields clear on the same subscription |
| F-Q4-001 lost answer then new-key retry | Real SCRATCH with a parameter-comparing provider stand-in |
| F-Q4-002 stale Checkout after edit | Real SCRATCH, same and different key |
| F-Q4-003 paid new owner not provisioned | Real SCRATCH concurrent advances; live new-owner purchase provisioned once; operator recovery of the stuck operation, idempotent on rerun |
| F-Q4-004 access email 429 | Live new-owner email accepted with no 429; OWNER_2 provisioned on sign-in after a Director-requested link |

## Live journeys passed (Director-observed, Executor-verified)

Expired link recovery page. Emailed link with explicit confirm, landing in the correct empty store. OwedBook to Portal handoff. Owner billing. Stripe portal cancel at period end, app banner, app undo. Only-card removal refused by Stripe. Existing-owner signed-out purchase completed by sign-in, store created once, account isolation holds. Declined card created nothing.

## Known risks and limitations, accepted

1. Full DEV restore not proven (Director option B).
2. AC-004 graded on reused engineering rehearsal plus independent read-only verification; no independent reset.
3. Real Supabase Auth crash coverage (T-017) not proven; simulated only.
4. Live failed-renewal and seven-day grace journey with a test clock deferred to 007B (O-1). Reminder email deferred to 007B (O-2). Required before production billing.
5. Mission Control outside 007A scope by Director ruling.
6. Placeholder Terms, Privacy, support address and price-consent wording accepted for local 007A. Must be resolved before any external or staging exposure.
7. Natural Stripe listener HTTP answers not captured; durable ledger rows are the evidence.
8. Exact cumulative email count and request-level Stripe mutation count not fully ledgered. Known: at least 3 emails within a ceiling of 8; purchase objects equal their ceilings and none was exceeded.
9. A sign-in link requested from the generic portal form is not recorded in the notification ledger; the original failed 429 row is kept as history.
10. Stripe idempotency keys last at least 24 hours; a retry after that window could create a second unpaid session (engineering L2). The buyer never saw the lost session.
11. Not exhausted: a keyboard-only journey through every step, the full theme by viewport matrix on every screen, and the promotion-change variant of F-Q4-002.

## Follow-ups

- U-1, U-2 and U-3 (navigation highlight, OwedBook admin billing fields, password show/hide) are merged with 007A under the Director's written acceptance. They are not QA-certified.
- Retained test data on DEV and SCRATCH stays until the Director rules on fixture cleanup.

## Still required before closeout

QAM §14 cleanup by the Executor once Engineering releases the checkouts: delete the private QA credential file, close owned browsers and processes, record what is retained. Then the Director commits the records, the Architect writes the closeout, and the Director merges.

No deployment before 007B.
