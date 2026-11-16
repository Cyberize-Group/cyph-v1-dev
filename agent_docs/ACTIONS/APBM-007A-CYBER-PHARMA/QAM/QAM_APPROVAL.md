# QA approval record

Source: QA Lead (Friday) via Director

Verbatim decision:

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — DECISION on Q1 a02 — 2026-11-13

DECISION: APPROVED WITH EXACT AMENDMENTS.
Bound to: package SHA-256 adfc6e473a4d7e2094c0d9cf8029ebe36a8b30852962e1dd7bbb521128020763; plan SHA-256 2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672; OwedBook 37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40; Portal 9d938f62bff6172f9332ae6c67775e4b8feea379; product repair 9322405fe0238882c21c75ef62733fc8c732fed0; contract v1.0 as amended by Spec Amendment A1. Lead verified both hashes.
Record this text verbatim in QAM_APPROVAL.md, source "QA Lead (Friday) via Director". The Director's Q2 release is recorded separately when he gives it. Any product, config or DB change after this needs my impact disposition first.

AMENDMENTS (B-series, to avoid collision with hold amendments A1–A9 and Spec Amendment A1)

B1 ENTRY GATE — no effects. Do this first, report, then STOP until I confirm.
  a. Cast file: create /home/moose/.config/cyph/apbm007a-qa-cast.env, mode 600, the 17 keys in your listed order. Fill the 14 seeded values (OWNER1, OWNER3, ADMIN_B2, ADMIN_B3, MEMBER_B1, MEMBER_B2B3, UNRELATED) from the existing APBM-003 QA env file if one holds them; if not, name the missing keys and the Director will point you to your 9 November login sheet. No guessing, no password resets. Leave QA_NEW_OWNER_EMAIL, QA_OWNER_2_EMAIL, QA_OWNER_2_PASSWORD empty; the Director fills them. Never print values. Report 17 keys FILLED/EMPTY.
  b. Runtime: the Director restarts both apps from the pinned checkouts and restarts the listener. You do not stop or start them. Then attest new PIDs, start times after the candidate commits, and build identity against a build of the pins.
  c. Listener secret: in-memory equality only, or the T-012 valid signed positive control. Never print either value.
  d. Fixture manifest, read-only: SCRATCH actual table names, current row counts, bootstrap/seed inventory; private DEV target bindings by ID. No secrets, no real inbox addresses. Send it to me.
  Until I confirm the gate: no write, sign-in, email, identity, checkout or payment. SCRATCH resets and writes stay BLOCKED until I approve the manifest.

B2 F-Q1-02 ruled: "by Q1" in the A1 evidence-impact column means "by independent QA during Q2 execution". Erratum goes to the Architect. Not blocking.
B3 F-Q1-03 ruled: your SQL and fixture proofs run on SCRATCH only. DEV gets only the application-mediated effects in the capsule. Not blocking.
B4 Effect capsule approved as written, with the clarified ceilings: 4 customers, 4 Checkout sessions, 2 subscriptions, 2 first payments, 40 Stripe mutations total, one new DEV identity, no test clock. The foreign object is created outside the app, carries no ownership marker, ID recorded.
B5 Every live DEV journey: record each event's ledger status, reason, HTTP answer and attempts. If provisioning or access completes only after operator recovery or manual redelivery, or an event is still unfinished at journey end, report a finding. Do not classify it.
B6 Any unfinished or awaiting_mapping row on DEV for an object you did not create is a finding. No recovery or dismissal without me.
B7 Reminder banner: observe in the browser in OwedBook (Chromium, both themes, 375 and 1440) using the existing synthetic past-due fixture, plus SQL. renewal_reminder record proved on SCRATCH.
B8 Placeholder Terms, Privacy, support address, price-consent: record OPEN — Director/Architect. Test honest-and-not-broken only. Not a pass.
B9 T-026: Mission Control app NOT RUN, limitation carried pending Director acceptance.
B10 T-017: mocked Auth is unit-only; real-Auth crash coverage is an explicit gap carried to certification.
B11 Stop and report immediately on any high-severity finding in payment, provisioning or tenant isolation. No cleanup, identity deletion or cleanup cancellation without my release. No self-certification.

NOW: do B1a and B1d, report, and wait for the Director's restart for B1b and B1c.

## Separate Director instruction (B1 only)

From the Director: both apps were rebuilt as production builds from the pinned checkouts and restarted (OwedBook on 3000, Portal on 3001), and the Stripe listener was restarted. Do B1b and B1c now as well, together with B1a and B1d, then report and stop.

Director Q2 release: NOT GIVEN. B1 confirmation: PENDING.


## B1 gate decision — source: QA Lead (Friday) via Director

Verbatim decision:

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — B1 gate decision — 2026-11-13
Bound to B1 package SHA-256 918f25a5047a395fb2f714cf96ff66e2e0048f9cb66da429afe790c0210171b5 (Lead verified) and the a02 approval. Record this verbatim in QAM_APPROVAL.md.

ACCEPTED
- B1b runtime: new PIDs after the candidate commits, HEADs pinned, app-path manifests equal QA builds. Binary equality not required.
- B1d SCRATCH manifest (fixture_manifest.json, bootstrap_seed_inventory.json) is the approved baseline. Retained engineering fixtures above the seed are disposable QA space.
- DEV inventory matches the E2 repair record (4 accounts: 3 synthetic seed + 1 stripe; 6 stores; 6 operations; 2 events; 0 unfinished). This is the B6 baseline.

SCRATCH WRITES — approved within the a02 capsule ceilings, plus:
1. Before the first reset, take a read-only ID-level snapshot of every tenant table (IDs only).
2. A reset deletes only rows in that snapshot or created by QA after it; record deleted IDs by table.
3. No Auth identity created or deleted by reset or seed. If the scripts would do either, stop and report.
4. After each cycle: ledger 60/60 with matching hashes; reference tables equal the manifest (aac_reference 2, ful_reference 1, pbm_info 3, reference_dataset_versions 4, system_config 2, wac_reference 4); seed contract counts hold (3 accounts, 5 stores, 3 subscriptions, 250 claims) and verify.mjs passes.
5. At most 180 ledger insertions total; two cycles plus one forward-recovery restart, as planned.
6. Fixtures a reset removes are recreated within the scenario ceilings.

STILL OPEN — in order
a. Seeded cast (skip if already done): locate APBM-003_Tony_Manual_Test_Login_Sheet_2026-11-09.md under /home/moose by exact name. If none, or copies differ, stop. Fill the 14 seeded keys into /home/moose/.config/cyph/apbm007a-qa-cast.env. Do not copy the sheet or print values. Mode 600. Then tell the Director "seeded values done" and wait for him to fill his three fields. Do not touch the file while he edits it.
b. Listener (skip if already done): stripe listen --print-secret, output in memory only, compare to the running Portal's STRIPE_WEBHOOK_SECRET. Report EQUAL or NOT EQUAL. Never print, log or store either value.
c. When the Director says his fields are filled, read-only DEV binding:
   - QA_NEW_OWNER_EMAIL has NO Auth identity on DEV.
   - QA_OWNER_2_EMAIL has exactly one Auth identity, owns no account, has no store membership and no billing-customer mapping.
   - The past_due synthetic subscription 7252e65c-4616-4ece-ad1b-90883aba0cb0 exists for B7; record which seeded role owns it.
   Record user IDs only, never addresses.

CONDITIONAL CONFIRMATION
If a, b and c pass exactly (all 17 keys FILLED, except QA_OWNER_2_PASSWORD may be EMPTY only if the Director states that account has no password; listener EQUAL; binding as stated), B1 is CONFIRMED by this decision. Record it, report the key table, listener result and binding result, then wait for the Director's Q2 release. Any deviation: stop and report; gate not confirmed.

Q2 is NOT released by this message.


## B1 conditional confirmation satisfied — 2026-11-13
Source: QA Lead (Friday) via Director, conditional gate decision above; Director private-field instruction in current conversation.
Director authorized deriving the new-owner alias from the private OWNER_2 mapping and explicitly authorized EMPTY QA_OWNER_2_PASSWORD (link-only). Seeded password coverage remains separate. No private values recorded here.
Read-only evidence: evidence/B1/binding_result.json. Sixteen keys FILLED, OWNER_2_PASSWORD EMPTY by explicit exception; mode 600; listener EQUAL. New-owner alias has zero DEV Auth identities. OWNER_2 has exactly one identity, zero accounts owned, zero store memberships and zero billing-customer mappings. Required synthetic past_due fixture exists; seeded owner role UNRELATED.
B1 is CONFIRMED under the Lead's exact conditional decision, not self-approved. Director Q2 release remains NOT GIVEN. No sign-in or business-data mutation performed. Stop and await release.


## Director's Q2 release — verbatim

CODY — DIRECTOR'S Q2 RELEASE — APBM-007A — 2026-11-13

I release Q2 execution for APBM-007A. Record this verbatim in QAM_APPROVAL.md as the Director's Q2 release.

Bound to: OwedBook 37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40; Portal 9d938f62bff6172f9332ae6c67775e4b8feea379 (repair 9322405fe0238882c21c75ef62733fc8c732fed0); plan SHA-256 2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672; QA Lead approval with amendments B1–B11; B1 gate confirmed.

Run the approved plan within the approved effect capsule. Sandbox and synthetic data only; no real payments; one new DEV identity only; no test clock; no deployment.

When an action needs my inbox, stop and tell me exactly what to look for and what to click. Don't send extra emails beyond the budget.

I will not restart apps, switch branches or edit either repo while you run. If you need a restart, ask me.

Stop and report immediately on any high-severity finding in payment, provisioning or tenant isolation (B11). Otherwise run to the end, then export the Q2 results package with its SHA-256 for the QA Lead's adjudication. No cleanup, identity deletion or self-certification.


## Decision on Q2 STOP-001 — verbatim

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — decision on Q2 STOP-001 — 2026-11-13
Bound to stop package SHA-256 ce243f1ef33db95e84c4866b834da9caf594dbcbc4effcd229f1cd06a368d029. Record verbatim in QAM_APPROVAL.md.

STOP-001 upheld; stopping was correct. Decision:

1. NO reset and NO seed script on SCRATCH in 007A QA. Reset-cycle rules 1–5 in the B1 decision are withdrawn; the ID-level snapshot is still taken before your first SCRATCH write.

2. FIXTURE METHOD: QA-authored SQL inserts/updates only, each scoped by explicit IDs, attached to the existing SCRATCH Auth identities. No Auth admin API create/delete/update, no auth.* table writes. Prefer transaction-rolled-back fixtures; persistent rows recorded by ID for later cleanup. Scenario ceilings in the a02 capsule unchanged. Tooling is yours, independent of the Engineer's harness; poison and clean controls as planned. If any scenario cannot be built this way, mark it BLOCKED with the reason; do not improvise.

3. AC-004 (fresh/upgrade rehearsal): independent QA rehearsal NOT RUN by Lead decision. Grade on reused E2 engineering SCRATCH rehearsal evidence, valid because OwedBook migrations and product are unchanged from e30e216 to 37f6c0d (records-only diff, proven in your identity check), plus your independent read-only checks: ledger 60/60 with hashes on DEV and SCRATCH, catalogue/privilege/default-ACL assertions by query. Label it "reused engineering evidence + independent read-only verification". Carried as a certification limitation.

4. Sample-loader guard/idempotence test may run on SCRATCH only if the loader touches no Auth data; otherwise BLOCKED with reason.

5. All other approvals, ceilings and B5–B11 unchanged. Resume Q2.


## Run-to-completion rule — verbatim, replaces B11

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — run-to-completion rule — 2026-11-13. Record verbatim in QAM_APPROVAL.md. Replaces B11 and any earlier "stop and report" instruction of mine.

Run Q2 to the end in one pass. Product defects, however severe, are findings: record them with evidence and severity proposal, mark dependent tests BLOCKED with the finding ID, and keep going with everything else.

Stop ONLY for safety:
1. wrong target, project, environment, Stripe account or mode;
2. any real (non-sandbox) payment or real customer data;
3. an effect that would exceed an approved ceiling;
4. a secret, credential, inbox address or session leaking into evidence or output;
5. an action that would cause damage you cannot undo or that touches Auth identities outside the approved one.
For these, stop only the affected item if you can isolate it; stop the whole run only if you cannot.

Anything that would otherwise need my decision mid-run: choose the more conservative option inside the approved plan and capsule, record the choice and reason as a Lead-review item, and continue. I will ratify or reverse at adjudication.

Only pause for the Director when an action needs his inbox. Batch those requests so he is asked as few times as possible.

At the end: one Q2 results package with every finding, every Lead-review item, coverage (ran, passed, failed, blocked and why), effect ledger and SHA-256. That package is the single input for the consolidated repair.


## No Director touches — verbatim

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — no Director touches in this run — 2026-11-13. Record verbatim in QAM_APPROVAL.md.

The Director is unavailable for the rest of this run. Do not wait for him or ask him anything.

Every check that needs his inbox or an intentional click by him (access email, returning/expired/replayed sign-in links from a real inbox, owned-inbox delivery) moves to the grouped Director walk after the repair. Mark those checks DEFERRED-TO-DIRECTOR-WALK, not failed and not passed, and send no emails to his inboxes in this run. Everything else runs unattended to the end under the run-to-completion rule.

Finish with the single Q2 results package and SHA-256, saved to QAM/HANDOFFS and copied to Downloads. Then stop.


## Q4 release — QA Lead via Director — verbatim

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — Q4 binding and release — APBM-007A — 2026-11-16
Record verbatim in QAM_APPROVAL.md. Governing: QAM §§9–11, RRM §§7, 9, 12. No new Q1, no new plan approval. The approved plan (SHA-256 2ffbfd8b…9672) and effect capsule stay in force.

ADJUDICATION OF Q2 a01 (package 8680ff27…47f9) — record in FINDINGS.md as Lead dispositions
- Verdict on pair 37f6c0d / 9d938f6: FAIL.
- F-Q2-001: acceptance failure, HIGH (AC-007/009/034). F-Q2-002: acceptance failure, LOW-to-MEDIUM (RA-4/AC-030). Both routed to repair.
- LR-01 accepted as certification limitation. LR-02: live owned proofs from DEV journeys; fault/recovery proofs run the candidate handler in-process against real SCRATCH with mocked provider; real-Auth crash (T-017) stays a carried gap. LR-03: loader approved on SCRATCH, one synthetic store, 50 rows then 0. LR-04: required now, Executor-owned. LR-05 accepted; capture natural listener delivery for owned journeys. LR-06 open with Director/Architect. LR-07 grouped Director session. LR-08 carried limitation. LR-09 no cleanup of business/provider fixtures.

IMPACT DISPOSITION OF REPAIR r03 (package SHA-256 0e6d42dedc112d524e1352262536771b6b94dc826bd5ea307b9d5da4d44bda22)
Product change: Payment Portal only — PharmacyStepView.tsx, server/billing.ts, three test files. OwedBook product and all migrations unchanged. Accepted as the bounded repair input. Engineering's proof is a claim, not your evidence.

BIND
The Director has committed on qa/apbm-007a and rebuilt/restarted the Portal. Read both HEADs. Verify them against EVIDENCE/E2/r03/commit/COMMIT_MANIFEST.json (SHA-256 a1494098aa4c7f9c34a1d9b3ad79a9673b8e366b8688162c550cd6ed707145ae): parents 9d938f6 / 37f6c0d, portal product commit = exactly the 5 listed paths, the rest records only. Record the full SHAs as the Q4 pair. Verify the served Portal is that build. A mismatch is STOP-IDENTITY for the affected work only.

HOUSEKEEPING FIRST (your own lane)
Disk is low. Remove your disposable a02 build mirrors and npm cache under QAM/AUTOMATION/a02 and stop your two sleeping a01 helper processes (new-owner.cjs, new-owner-retry.cjs). Keep all records and evidence.

RUN, CONTINUOUSLY, ONE PASS
1. Portal baseline at the new product commit: install, typecheck, lint, unit, production build, QA-controlled.
2. F-Q2-001: fresh-context registration owner → pharmacy → review with server quote; refresh; edit/back/return; incomplete and deep-link negatives; consent gating. Chromium both themes at 375 and 1440; Firefox and WebKit at 1440.
3. Journeys that were blocked: new owner A purchase with the one approved DEV identity (payment, provisioning counts, access email sent); OWNER_2 signed-out purchase; declined card; AC-011 double-submit; live event ledger per B5. The access email is an approved product effect; send no other mail.
4. F-Q2-002: undo from flag-only, date-only, both-set if reachable, already-clear, re-read live in the sandbox; partial failure by your own unit adapter.
5. All LR-04 gaps and the LR-02 and LR-03 items above.
6. Required regression. Evidence for byte-unchanged files may carry forward with its original pair and stated applicability; anything touching billing.ts or the registration screens is rerun.

EFFECTS
Ceilings are cumulative with a01 usage. DEV drafts and reservations ceiling is 6 each. Engineering left one DEV draft and an NPI hold on 1373398746: log it as engineering's, do not use or remove it.

DIRECTOR SESSION — ONE, AT THE END
Do not pause mid-run for the Director. Everything needing his inbox or his click (new-owner access link, OWNER_2 link sign-in, replay/expiry, paid-owner billing/portal/cancel/undo/only-card checks that need a real signed-in owner) goes into one ordered script. Return it with the package: what he clicks, in what order, and what you then drive in the same browser context.

STOPS
Only the QAM §11 stop types, and only for the affected work. Product failures are findings; mark dependants BLOCKED and continue. Decisions you would otherwise ask me for: take the conservative option inside the plan, log it as a Lead-review item.

RETURN
QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REVIEW_a01.zip with SHA-256 and a Downloads copy: matrix, findings, Lead-review items, effect ledger, coverage, and the Director session script. No cleanup of fixtures, no identity deletion, no self-certification. No deployment before 007B.


## Q4 binding after identity-stop resolution — 2026-11-16
Director instructed “keep going”. Git now confirms OB f637ba4086c1e906e008b8892c880ec6489bba9a; Portal357c274284f48ed5ad3bf8407ca0a14d0d9b99e8; product4cd96c82da59a093d1330307f5a27836b17f1df5. Exact five product paths and manifest hashes match; OB records-only, including the commit manifest/receipts themselves; Portal successor records-only. Q4 scope/plan unchanged. a01 stop archive immutable; continuation evidence a02. Served build verification pending QA baseline.


## Q4 a03 partial release — verbatim

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


## Standing preflight — verbatim

CODY — FROM THE DIRECTOR AND THE QA LEAD — standing preflight rule — 2026-11-16. Record verbatim in QAM_APPROVAL.md. Applies to this run and every later run in this module.

FIRST ACTION OF EVERY RUN, before any other work, within the first two minutes:
1. Both HEADs equal the bound pair.
2. Both apps are up on 3000 and 3001, and each served build is the bound commit's build.
3. The Stripe listener is running and its secret is EQUAL to the Portal's (in-memory comparison).
4. The private cast file is present, mode 600, expected keys filled.
5. DEV and SCRATCH reachable; ledgers 60/60.
6. Enough free disk for the run.

If any item the Director owns fails: STOP IMMEDIATELY and tell him in one short message: what is missing, the exact command or action to fix it, and "reply done when fixed". Do not start other work first. Do not bury it in a package. Re-run the preflight when he replies, then proceed.

If everything passes, say "preflight OK" in one line and run continuously under the existing rules.

If you are already past this point in the current run, do the preflight now, report the one-line result, and carry on.


## Q4 a04 final release — verbatim

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — Q4 final binding and full release — 2026-11-16. Record verbatim in QAM_APPROVAL.md.

LEAD DISPOSITIONS
- Q4 a03 (SHA-256 5cae2e54…4473) accepted. F-Q2-001: CLOSED by independent retest. Full per-theme journey and keyboard-only journey stay as coverage gaps to close below.
- F-Q2-002: unit proof accepted; closure needs the live sandbox check.
- F-Q4-001: repair r04 accepted as bounded repair input (package SHA-256 79613aacf2d57786f4ff23887ebe929ad55245d84f779555ee6d3007268b9046). Product change: Portal src/server/checkout.ts and one new test file. OwedBook product unchanged. Engineering proof is a claim.

BIND
Director has committed on qa/apbm-007a and rebuilt/restarted the Portal. Verify both HEADs against EVIDENCE/E2/r04/commit/COMMIT_MANIFEST.json (SHA-256 0d3daa83ca17013dcfb3cb8032a8fe978046b9cd273a14b1a9bab5793221ee8c): parents 357c274 / f637ba4, portal product commit = exactly 2 paths, rest records only. Record the pair. This is the final candidate unless a new finding requires repair.

STANDING PREFLIGHT FIRST. Director-owned failure: tell him at once.

CEILINGS RAISED (cumulative, DEV): drafts 14, reservations 14, session mints 80, global sign-outs 16, isolated revocations 8, emails 8, portal sessions 6, cancel/undo mutations 6, card mutations 4. Unchanged: 4 customers, 4 Checkout sessions, 2 subscriptions, 2 first payments, 40 Stripe mutations, ONE new DEV identity, no test clock. If the purchase set cannot fit the customer/session/payment ceilings, do not exceed them: run in the priority order below and log the remainder as a Lead-review item.

RUN, CONTINUOUSLY, ONE PASS
1. Portal baseline at the new product commit, QA-controlled build.
2. F-Q4-001 on real SCRATCH with your own provider stand-in, now comparing parameters on a repeated key: lost answer then different-key retry, same-key retry, concurrent double submit, lost answer then draft edit. One customer, one session, one operation; nothing marked unpaid without provider proof.
3. Engineering limitation L5 (pre-existing): same-key retry after the draft was edited resumes the earlier revision's operation. Test it, including a promotion-code change between attempts. Report as a finding if a buyer can reach a Checkout whose total or consent does not match the current revision.
4. Live purchases on DEV, in this priority: (a) new owner A with the one approved identity: payment, provisioning counts, access email sent; (b) declined card, no identity, no provisioning; (c) OWNER_2 signed-out purchase; (d) live double submit. Record every event's ledger status, reason, HTTP answer and attempts from the natural listener.
5. Remaining gaps: full owner → pharmacy → review journey in dark theme and at 375; keyboard-only journey; swapped valid-cookie draft attacks (AC-008); any LR-04 item still open.
6. Required regression. Carry forward evidence for byte-unchanged files with its original pair and stated scope; rerun anything through checkout.ts.

DIRECTOR SESSION — ONE, AT THE END
Everything needing his inbox or click, plus paid-owner billing, portal, cancel/undo (F-Q2-002 live), only-card removal. Return the ordered script with the package. Send no mail beyond product-generated access emails.

STOPS: QAM §11 types only, affected work only. Product failures are findings; continue.

RETURN: QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REVIEW_a04.zip, SHA-256, Downloads copy, with the Director session script. No fixture cleanup, no identity deletion, no self-certification.


## Q4 a05 release — verbatim

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


## Director session release — verbatim

CODY — FROM THE QA LEAD, VIA THE DIRECTOR — Director session release — 2026-11-16. Record verbatim in QAM_APPROVAL.md.

a05 accepted (SHA-256 e700ab73ea2eb42e7329f8d508a84e35ddeb795e025bb1106e5d93f627ba4f4b). Lead dispositions: F-Q4-003 CLOSED. F-Q4-002 CLOSED (promotion-change variant noted as a narrow untested case). F-Q4-001 CLOSED. F-Q4-004 closed as the same concurrency, subject to the OWNER_2 resend below. The execution-order deviation is accepted.

The Director is present now. Run the single Director session from QAM/DIRECTOR_SESSION_Q4.md, steps 1 to 7, on the bound pair c976968 / 54a56b5. Standing preflight first.

HOW TO RUN IT
- Open a visible browser window for each owner. Tell the Director one action at a time, in plain words: which inbox, which email subject, what to paste or click. Wait for him. Then you drive.
- If a sign-in link has expired, use the product's own resend. Authorized: one resend each for owner A, the new owner and OWNER_2, within the email ceiling of 8.
- Session allowance for Stripe: 6 cancel/undo mutations, 6 portal sessions, 2 card mutations. No purchase, no new identity, no test clock.
- F-Q2-002 live: schedule cancellation, undo, re-read both fields clear on the same subscription; both-set only if reachable.
- Only-card removal: once; record what Stripe allows.
- A failed step is a finding; mark dependants blocked and continue with the rest.
- At step 7 ask the Director two questions and record his exact answers: (1) does he accept that the Mission Control app was not run in 007A; (2) does he accept placeholder Terms, Privacy, support address and price-consent wording for 007A.

RETURN: Q4_REVIEW_a06.zip with SHA-256 and Downloads copy: session results, findings if any, final effect ledger, final coverage matrix with every limitation listed. No cleanup, no self-certification.


## Director manual-session method — 2026-11-16

Director change of method: close QA-opened browser windows; Director performs manual walk in own browser guided by QA Lead. Executor does not drive. Record port3000 page-not-found observation. Wait for "check step N"; read-only DEV verification, reply two lines: observation and match. No emails/resends/Stripe actions unless asked.


## Director ruling — option B — verbatim

"UI changes U-1, U-2, U-3 (Engineering r06) are merged with 007A under the Director's written acceptance on his own visual walk-through. They are not QA-certified. The QA Lead recommended merging the certified bytes first."

Director ruling: Mission Control outside 007A scope; placeholders accepted for local 007A. Gate Q issued by Lead on r05 pair only; r06 visual changes accepted by Director, no QA retest.
