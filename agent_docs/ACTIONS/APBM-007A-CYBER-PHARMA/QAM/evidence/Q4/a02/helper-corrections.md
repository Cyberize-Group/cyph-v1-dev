# Q4 independent helper corrections

Webhook SCRATCH attempts1/2 omitted provider session mode and client_reference_id. Candidate correctly returned attention/session_mismatch; the test expected unsettled503 for an incompletely specified fake. Preserve attempts. Correct fake to a matched sandbox subscription-mode session tied to the explicit operation; do not weaken pending/busy/recovery assertions. Not a product finding. All attempts rolled back.

Billing adapter now permits sequential flag/date clears; expected final invariant unchanged, both clear. The original one-update assertion was a Q2 adapter constraint, not the contract. Added partial provider-failure/retry controls.

Attempt3 foreign fixture mistakenly shared the owned mapped customer/subscription; candidate correctly kept it awaiting_mapping503. Foreign-only correction uses distinct unmapped customer and no subscription. Rerun only that failing control; good recovery checks not repeated.
