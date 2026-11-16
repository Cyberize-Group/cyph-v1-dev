CODY — FROM THE QA LEAD, VIA THE DIRECTOR — Q4 a05: provisioning retest — 2026-11-16. Record verbatim in QAM_APPROVAL.md.

DISPOSITIONS (a04, SHA-256 02dfd97f…eb6f): pair 0249109 / 93add6f FAIL. F-Q4-003 acceptance failure HIGH (AC-016/017). F-Q4-002 acceptance failure MEDIUM (AC-009). F-Q4-004 MEDIUM, engineering attributes it to the same concurrency. F-Q4-001 closed for the cases run. Repair r05 accepted as input (SHA-256 f82ea7c6b36fa4c127360125540ca33a7ba8d7a5dc0b278d4886f51f4ef20209); it is a claim.

BIND: verify HEADs against EVIDENCE/E2/r05/commit/COMMIT_MANIFEST.json (SHA-256 c5a16f7871607eb75a7c8edfa24630960888cd0aeb7803e2fee519b5116fb9e8): parents 93add6f / 0249109, portal product = exactly 6 paths, rest records. Standing preflight first.

DIRECTOR RULING: one more brand-new DEV identity and one more sandbox purchase. Cumulative ceilings now: identities 2, customers 5, Checkout 5, subscriptions 3, first payments 3. Build the address as the approved inbox plus a new unused +tag, store it in the cast file under QA_NEW_OWNER_2_EMAIL, confirm by read-only query it has no DEV identity. Never print it.

RUN IN THIS ORDER, CONTINUOUSLY
1. Portal baseline at the new product commit.
2. F-Q4-003 on real SCRATCH, your own harness: concurrent advances of one paid operation (three events plus a status poll) end with exactly one account, one store, one admin, one mapping, and one access-email claim. Poison control on the old behaviour.
3. F-Q4-002 on SCRATCH: retry after an edit, same key and different key, never returns a Checkout for an earlier revision or quote.
4. AC-038 recovery on DEV of stuck operation 25acbfb9-9969-44b1-8b45-928d71f99ad6. First confirm read-only: payment confirmed in Stripe; identity is the operation's recorded owner and was created after the operation began; buyer was not signed in; identity owns no account. Then run once: node scripts/operator-reconcile.mjs --operation 25acbfb9-9969-44b1-8b45-928d71f99ad6. Expect provisioned once for the existing identity; no new identity, email, charge or subscription. Run it a second time: no change. If a provenance check fails, do not run it; report.
5. LAST: one live new-owner purchase with the new identity. Expect paid, then provisioned: one account, one store, one admin, one mapping, exactly one access email accepted, no 429. Record each event's ledger status, reason and attempts; capture the listener's HTTP answers if you can.
6. Do not touch the OWNER_2 operation; its sign-in and email resend go to the Director session.

Everything else carries forward from earlier runs with its original pair, unless it passes through provisioning.ts, accessEmail.ts or checkout.ts.

STOPS: QAM §11 only, affected work only. A product failure is a finding; continue.

RETURN: Q4_REVIEW_a05.zip with SHA-256 and Downloads copy, plus the updated single Director session script (owner A sign-in after recovery, new owner sign-in, OWNER_2 resend and sign-in, paid-owner billing, cancel/undo live, only-card removal). No cleanup, no self-certification.
