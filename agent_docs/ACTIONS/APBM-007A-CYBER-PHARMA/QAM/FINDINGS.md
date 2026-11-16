# Q2 findings — adjudication requested

Candidate pair: OB37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40 / PP9d938f62bff6172f9332ae6c67775e4b8feea379. Severity proposals are Executor observations, not Lead classification. No product repair made.

## F-Q2-001 — proposed HIGH — registration cannot reach review
Expected AC-007/009/034: valid owner and pharmacy submission reaches server quote/review, then explicit consent permits checkout. In two independent Chromium1440 attempts, owner/pharmacy/NPI saved but browser returned to /register/owner; quote_total_cents remained NULL. No Checkout or payment submitted. Two retained draft IDs are in new-owner-db-observation.json. Optional NCPDP blank. Private email and session are omitted.

Reproduction: approved public registration, valid synthetic pharmacy fields and unused checksum-valid NPI; submit pharmacy and observe route plus saved-state Booleans. Helpers new-owner.cjs/new-owner-retry.cjs capture selectors and stages. Do not spend a further draft without retest authorization. Source clearForms-before-navigation race is a candidate explanation only; Engineer owns diagnosis. Evidence STOP-002/REPORT.md and new-owner*.json. Dependent live purchases/provisioning/paid billing blocked. Original B11 stop correctly occurred; later run-to-completion rule supersedes the whole-run stop. Owner: QA Lead disposition, Architect repair scope, Engineer repair.

## F-Q2-002 — proposed MEDIUM — undo fails with both cancellation fields
Expected RA-4/AC-030 explicitly requires clearing both cancel_at_period_end and cancel_at on the same subscription and re-reading both clear. Independent mutable provider fake starts flag=true and date set. Actual candidate billing.ts issues only flag=false, then returns provider_unavailable while date stays set. Flag-only and date-only controls pass. No live Stripe mutation in this test. Evidence billing-independent.json and billing-unit.cjs.

Live reachability of both fields simultaneously has not been proved. This is a unit-observed explicit-contract mismatch, not a claimed observed customer billing incident. Owner: QA Lead classification and Architect explanation/bounded repair. Do not dismiss by assuming the state impossible.

No finding is silently waived. Product/config/DB changes require Lead impact disposition and newly pinned retest. No deployment before007B.


## QA Lead dispositions — 2026-11-16 — via Director

 (package 8680ff27…47f9) — record in FINDINGS.md as Lead dispositions
- Verdict on pair 37f6c0d / 9d938f6: FAIL.
- F-Q2-001: acceptance failure, HIGH (AC-007/009/034). F-Q2-002: acceptance failure, LOW-to-MEDIUM (RA-4/AC-030). Both routed to repair.
- LR-01 accepted as certification limitation. LR-02: live owned proofs from DEV journeys; fault/recovery proofs run the candidate handler in-process against real SCRATCH with mocked provider; real-Auth crash (T-017) stays a carried gap. LR-03: loader approved on SCRATCH, one synthetic store, 50 rows then 0. LR-04: required now, Executor-owned. LR-05 accepted; capture natural listener delivery for owned journeys. LR-06 open with Director/Architect. LR-07 grouped Director session. LR-08 carried limitation. LR-09 no cleanup of business/provider fixtures.

These are the Lead dispositions, superseding Executor severity proposals. F-Q2-001 and F-Q2-002 remain acceptance failures until independent Q4 retest and Lead re-adjudication. Q4 a01 has STOP-IDENTITY before product execution; no repair verdict.


## F-Q4-001 — proposed HIGH — different-key retry duplicates provider objects after unknown outcome

Pair: OwedBook f637ba4086c1e906e008b8892c880ec6489bba9a; Portal 357c274284f48ed5ad3bf8407ca0a14d0d9b99e8; product 4cd96c82da59a093d1330307f5a27836b17f1df5. AC-011 acceptance observation; QA Lead classification pending. Portal checkout.ts is byte-unchanged by r03; finding is newly demonstrated, not attributed as an r03 regression.

Independent expected result: after a provider creates a Checkout session but its response is lost, retrying with a changed operation key must not create a second intended customer/Checkout. Either recover the same operation or reject the changed key while the outcome is unknown.

Actual: candidate registration.ts/checkout.ts ran against real SCRATCH tables and RPCs, with a QA-authored provider adapter retaining objects by each idempotency key. The adapter created customer1/session1 then threw QA_TIMEOUT_AFTER_CREATE before returning the session. A different-key retry changed the old operation to expired_unpaid although no provider expiry had been proved, then created customer2/session2 under a new operation. Counts2/2; old session remains open in the adapter. Same-key control retained customer1/session1 and passed. No live Stripe objects, payments, Auth identities or mail involved. Both SQL runs rolled back.

Evidence: evidence/Q4/a02/checkout-timeout.json, checkout-timeout-same-key.json; AUTOMATION/Q4-a02/checkout-timeout*.cjs. Reproduction needs one valid quoted SCRATCH draft, one intercepted after-create response failure, then retry with a distinct valid key. Exact operation/draft IDs retained in receipts; no secret cookie or address exported. Scope: real database operation handling + modeled provider idempotency, not a live network-loss claim.

Owner: Lead adjudication, Architect bounded diagnosis/repair, Engineer implementation. Do not silently waive or fix in QA.

## Q4 repair observations (not Lead closure)

F-Q2-002: independent unit adapter now passes flag-only/date-only/both-set/already-clear, sequential partial-failure retry and unsafe portal configuration controls. Live sandbox undo remains BLOCKED by served-build STOP-IDENTITY and required owner session. F-Q2-001: no live repaired-screen retest, same served-build stop. Both prior Lead acceptance failures remain open until required proof and re-adjudication. Engineering/maintained tests do not close them.

## Q4 stops — no product classification

Committed identity resolved after a01; actual new pair above verified. Live Portal PID2381957 runs an on-disk build retaining pre-r03 mutually exclusive flag/date clearing; BUILD_ID and relevant file timestamps unchanged from November13. Independent new build lacks that old branch. No Stripe listener process found. STOP-IDENTITY affects live repaired Portal/browser work; STOP-ENV affects natural listener payment journeys. Unaffected baseline, SQL and in-process proofs continued. Director owns build/restart/listener resolution; no app started/stopped by QA.


## QA Lead disposition 2026-11-16 — Q4 a03
F-Q4-001: acceptance failure AC-011, MEDIUM, not r03 regression; Architect bounded repair or Director risk ruling pending. STOP-IDENTITY/STOP-ENV correct and isolated. Purchases/new identity/paid billing/Director session HELD.


## Q4 a03 independent observations
Original F-Q2-001 no longer reproduced: all3 engines reach review/serverquote, refresh/edit/backreturn passed. Lead closure pending, full theme/keyboard limitations inexecution report. F-Q2-002 live billing HELD. No new finding this run. F-Q4-001 Lead MEDIUM remains open; no purchase evidence generated.


## F-Q4-002 — L5 current-revision mismatch — proposed MEDIUM
Boundr04 productc638f79b8e40b8fbddc269634c96cd2c05ef7807. Actualcandidate withrealSCRATCH andparameter-comparing providerstandin: lostsessionanswer theneditdraft andchange currentpromotionquote to8910, samekeyretry returnsopenCheckoutoperationrevision1,total9900 whilecurrentdraftrevision2,total8910,consent_revisionNULL. ReachableoldCheckout violatescurrentquote/consent invariant AC009/011. Evidencecheckout-promotion-edit-same.json andindependenthelper. Promotionrevision fixture setthroughscopedSQL afteractualsaveDraft/requestQuote; liveAPA change notclaimed. No realcharge. Leadclassificationpending.


## Lead disposition a04
F-Q2-001 CLOSED by independent retest (Lead). F-Q2-002 unit accepted, live closure pending. r04 accepted bounded input for F-Q4-001; no independent closure declared.

## F-Q4-003 — proposed HIGH — paid new owner remains without account/store
DEV actual UI sandbox journey: Checkout complete/paid8910USD cents, active subscription and paid invoice verified by read-onlyStripe; exactlyone newAuthidentity created, access_link notification sent attempts1. Operation25acbfb9-9969-44b1-8b45-928d71f99ad6 endsattention/not_paid, owner_was_existing=true, account_id/business_idNULL. Accounts4/businesses6 unchanged. Three natural payment events markedprocessed/attempts0. Expected AC016 paidnewowner getsone account/store/admin/mapping. No manualrecovery, deletion or secondidentity. Rootcause unconfirmed. Evidence live-results/provider-readback/draft-retention. Source/race explanation is not proof. Lead classify and Architect scope repair.

## F-Q4-004 — proposed MEDIUM — OWNER_2 access email attempt failed429
Existing-identity signedout purchase paid8910, operationattention/owner_signin_required (expected until sign-in), notificationaccess_link failed attempts1 last_error429. Noresend. Provideracceptance/delivery notproved. Ownercannot complete sign-in thisrun. Recordobserved mailfailure, Lead decides product/environment classification. Director-session prerequisite explicit.


## QA Lead a05 dispositions and independent retest observations
Lead: a04 pair0249109/93add6f FAIL; F-Q4-003 HIGH AC016/017, F-Q4-002 MEDIUM AC009, F-Q4-004 MEDIUM; F-Q4-001 closed for cases run. r05 is accepted repair input only.

Independent r05 observations: real-SCRATCH concurrent three events plus poll yield one account/store/admin/mapping/access-mail claim; both edited-draft keys return current revision with current consent; DEV owner-A exact-ID recovery provisioned once, second invocation unchanged; new-owner live paid and provisioned with one access-email attempt accepted, no429. No new product finding observed in these cases. Prior failure closure is the Lead's decision. OWNER_2 historical failed429 retained and untouched. No real inbox delivery/sign-in or live billing closure is claimed.


## Lead a06 dispositions
F-Q4-003 CLOSED, F-Q4-002 CLOSED with narrowpromotionchangevariantuntested, F-Q4-001 CLOSED. F-Q4-004 closedassameconcurrency subjectOWNER_2resend. Executionorderdeviationaccepted. NoQAselfclosure.
