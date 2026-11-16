CODY — FROM THE QA LEAD, VIA THE DIRECTOR — Q4 resume, partial — 2026-11-16. Record verbatim in QAM_APPROVAL.md.

Q4 a02 received (SHA-256 c989104b…4c33). Lead dispositions:
- F-Q4-001: acceptance failure against AC-011, MEDIUM, not an r03 regression. Routed to the Architect for bounded repair or a Director risk ruling. Decision pending.
- STOP-IDENTITY and STOP-ENV were correct and correctly isolated.

The Director reports both apps rebuilt and restarted and the Stripe listener started. Re-verify: served Portal build matches the bound product commit 4cd96c8, listener present, listener secret EQUAL by in-memory comparison. A mismatch stops only the affected work.

RESUME NOW, continuously — live work that does not pass through checkout:
1. F-Q2-001 retest: fresh-context registration owner → pharmacy → review with server quote; refresh; edit/back/return; incomplete and deep-link negatives; consent gating. Stop at review. Do not press pay. Chromium both themes at 375 and 1440; Firefox and WebKit at 1440.
2. Remaining LR-04 live coverage that needs no purchase: draft-context attack, handoff and redirect negatives in the browser, keyboard and focus, theme matrix on reachable screens, AC-008, AC-023/024 browser subcases.
3. Required regression on reachable screens.

HOLD until I release them: every purchase (new owner A, OWNER_2, declined card, double-submit), the new DEV identity, all paid-owner billing checks, and the Director session. Checkout code may change; live purchase evidence belongs on the final candidate (QAM §11).

Ceilings cumulative. Drafts used here count toward the DEV ceiling of 6. Return one package Q4_REVIEW_a03 with SHA-256 and a Downloads copy.
