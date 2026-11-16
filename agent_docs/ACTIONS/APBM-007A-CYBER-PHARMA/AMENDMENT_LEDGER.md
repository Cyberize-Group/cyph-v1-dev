# Amendment closure ledger — v1.0

| Source | Frozen destination |
|---|---|
| FA-1/2; FB-1/2 withdrawal; FC-1/2/3 | AUTH_HANDOFF_CONTRACT: atomic bound claim, safe return, last-moment mint/complete, scoped cleanup, same-token source |
| FA-3/4; FB-7/8 | AUTH/DATA, AC-025/026/037, STAGING: narrow service consumer, simple logout and residual, source-session SCRATCH proof |
| FA-5; FB-12/13 | BILLING contract, AC-029/030: single B catalogue, both cancellation fields, explicit config |
| FA-6; FB-11 | BILLING, AC-010, E2 request: allowlist possession, whole-invoice fixture subject to Director approval |
| FA-7; FB-3/14; FC-6 | IMPLEMENTATION_REQUIREMENTS RA-2/6, AC-031/032, E2 optional scope choice |
| FA-8 | DEV_SAMPLE_CLAIMS and AC-018: loader scope only; actual loading separately held |
| FA-9/10/11; FB-9/10; FC-5/7 | E2 readiness/request, execution, staging: email/cast inputs, one capsule/pass, no calibration invented |
| FB-4/5 | RA-1/3, AC-019/027/028/036: password retained, intentional permission regression |
| FB-6 refined by RA-7 | No format CHECK on legacy businesses; unique NPI plus validated reservation/provisioning; lazy expiry |
| FB-15 narrowed | DATA/MIGRATION: explicit per-object revoke/assert; default-ACL change deferred |
| FB-16; FC-4 | AUTH/AC-018..020: non-redeeming email GET, explicit CSRF-bound button POST |

No acceptance result is claimed. All changed requirements must be independently mapped during Q1. Earlier contradictory proposal words are historical evidence only.

## Amendment A1 — 13 November 2026 (Director rulings via JARVIS; APBM_RULINGS.md "Amendment A1")

| Source | Destination (original wording preserved; A1 section operative) |
|---|---|
| A1-1 F-Q1-01 | APBM_ACCEPTANCE_SPEC "Amendment A1" (AC-014, AC-015, new expansion row 014–015); BILLING_AND_PAYMENTS_CONTRACT "Amendment A1 — durable events"; AC-038 operator event recovery |
| A1-2 G2 | APBM_ACCEPTANCE_SPEC "Amendment A1" (AC-031, AC-032, expansion 031–032); IMPLEMENTATION_REQUIREMENTS RA-6 "Amendment A1"; BILLING "Amendment A1 — lifecycle"; CARRY_FORWARD_007B O-1 |
| A1-3 G5 | APBM_ACCEPTANCE_SPEC "Amendment A1" (AC-031); BILLING "Amendment A1 — lifecycle"; CARRY_FORWARD_007B O-2 |
| A1-4 G1 | ENVIRONMENT_AND_EFFECTS "Amendment A1"; QAM/HANDOFFS/QA_HANDOFF.md |
| Explicitly unchanged | AC-029, AC-030, RA-6 only-card removal, all other ACs and expansions |

Q1 must remap AC-014, AC-015, AC-031 and AC-032 (and the 014–015 / 031–032 expansions) against the operative A1 text. No result is claimed.

## Erratum E-A1-1 — 16 November 2026

| Source | Destination |
|---|---|
| Friday B2 (F-Q1-02) and B3 (F-Q1-03), `QAM/QAM_APPROVAL.md`; JARVIS Q2 repair instruction | APBM_RULINGS.md "Erratum E-A1-1": "by Q1" / "independent Q1 evidence" in the A1 evidence-impact column means by independent QA in Q2; independent SQL proofs are SCRATCH-only. Wording only; no requirement or deferral changed |
