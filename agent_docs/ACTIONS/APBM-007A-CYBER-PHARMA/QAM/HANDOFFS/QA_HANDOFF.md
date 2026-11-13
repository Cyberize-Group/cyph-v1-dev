# Checkout ownership transfer

## Outgoing Engineer record — 13 November 2026 (Asia/Dhaka)

| Field | Value |
|---|---|
| Outgoing writer | Claudy (engineering seat), run apbm007a_e2_r01 |
| OwedBook checkout | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`, branch `apbm-007a`, base `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694`; candidate commits pending the Director (lists and hashes: `EVIDENCE/E2/r01/commit/`) |
| Payment Portal checkout | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`, branch `apbm-007a`, base `c89572a45210e7d6f098c2878cfabe9a1c5326f1`; candidate commits pending the Director |
| Processes | None owned by Engineering. OwedBook :3000, portal :3001 and the Stripe listener are the Director's; the server on :3457 is unrelated and untouched |
| Controlled resources retained | Stripe sandbox catalogue, OWNER_1's active test subscription, 6 test customers; DEV rows of OWNER_1's account and store; SCRATCH proof rows and 12 harness identities |
| Open items for QA | `EVIDENCE/E2/r01/ENGINEERING_HANDOFF.md` §11 (NOT RUN, incomplete items, risks R1–R7) |
| Release | Engineering releases both checkouts once the Director's commits verify against the manifest. No engineering writer after that without a recorded repair assignment |

## Incoming independent QA Executor

NOT RECORDED. Verify both commit identities and accept both checkouts before Q1.
