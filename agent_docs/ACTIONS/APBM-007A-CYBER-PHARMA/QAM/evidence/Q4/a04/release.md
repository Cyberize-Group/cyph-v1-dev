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
