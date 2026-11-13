# E2 release request — APBM007A v1.0

**REQUEST ONLY. E2 NOT RELEASED.** Technical freeze is complete; the following entry receipts and Director release are still required. No DEV apply, sample loading, Git mutation, deployment or QA certification is authorized by receiving this file.

## Scope recommendation and optional FC-6 choice

Recommended: retain full v1.0, including failed-renewal grace, server read-only hook and real renewal test-clock proof. It is already a customer-facing billing rule and the architecture is settled.

Optional: defer only RA-6 failed-renewal grace/enforcement/test-clock path to 007B. Planning saving: roughly 2–3 engineering sessions (from E1's lifecycle lane) and 1–2 QA sessions (architect estimate, not measured APBM003 calibration). First-invoice no-access, cancellation state, owner billing recovery and only-card-removal observation remain required. This option does not authorize a false grace/read-only promise. If Tony chooses it, JARVIS issues v1.1 contracts/ACs with the temporary past-due access policy stated before E2 release. Do not build an ambiguous half-deferred policy.

## Entry receipts — fill locally, no secrets

| Item | Receipt required |
|---|---|
| Two checkouts | Actual source paths/SHAs, expected OB bc4e4336f80d2e8cdbb628d4de29d08f8fc95694 and PP c89572a45210e7d6f098c2878cfabe9a1c5326f1; explain drift rather than discard |
| Git T1 | Portal lock disposition, OwedBook .env.pilot.example disposition, apbm-007a branches, portal remote confirmed under Cyberize-Group; Director executes Git |
| Tooling T2 | OwedBook local APBM_DEV_DB_URL, APBM_DEV_SUPABASE_URL, APBM_DEV_PUBLISHABLE_KEY, APBM_DEV_SECRET_KEY present and identity-consistent; SCRATCH four-name block already verified; no values exported |
| Private logins | Tony recovered and used APBM003 sheet; confirm private local availability for engineering and Q1, no reset and no export |
| APA | Tony approves labelled 10%-once whole-invoice sandbox fixture; possession of allowlisted valid code is eligibility; no commercial claim |
| Source package | This v1.0 FILE_INDEX and archive SHA attached to release receipt |

## Proposed single engineering effect capsule

Targets: existing synthetic DEV project (verified by SQL/API identity), distinct recorded SCRATCH project ihgcsrypblqkwommrkgj, and Stripe test account acct_1RxzixGnEQDyu3RR. Missing/mismatching identity stops dependent effects. No second Stripe sandbox, production target or external recipient.

These are requested E2 limits, not existing authority or measured resource forecasts. Sized above E1's 46 Stripe mutation/83 read/30 session/5 email attempt snapshot for integrated retry/negative cases. New engineering ledger starts explicitly at release; E1 cumulative ledger remains intact.

| Surface | Proposed E2 maximum and restriction |
|---|---|
| Stripe API reads | 1000 calls |
| Stripe API mutation attempts | 250, including refused calls/retries; exact owned objects only |
| Stripe customers/subscriptions | 12 of each; tag owned objects, max 12 Checkout sessions; reconcile rather than create another on timeout |
| Stripe portal configs/sessions | 2 configs, 24 sessions; always explicit config; default-object exception disclosed rather than destructive account reset |
| Stripe clocks | 2 owned clocks; bounded advances for renewal and retry/grace proof; record automatic resulting effects |
| Catalogue/promotion | 1 intended catalogue version; at most 2 products/prices if recovery requires recorded replacement; 1 labelled fixture coupon/promotion pair |
| Auth | 12 new owned synthetic identities; 100 session-mint/verification-exchange attempts plus 1000 read-only Auth validation calls, 30 sign-out attempts on named synthetic users only; existing cast not reset |
| Email | 24 attempts, only aliases from private approved inbox file; log acceptance vs delivery separately |
| SCRATCH | 2 fresh and 2 upgrade/recovery rehearsal cycles, disposable target positively identified; exact command/manifest, backup retained privately |
| DEV | No schema apply in this capsule. After a separately authorized apply, at most 12 owned synthetic account/store fixtures via normal reviewed paths; preserve existing rows/users. No sample command until its explicit loading release |
| Local tools | Approved product/test/doc changes in both work branches; dependency/build/type/lint/unit checks; tooling evidence-path extension narrowly for this module. No commits, push, merge, remote change or deploy by agent |

Count browser-induced and test-clock effects in an owned-object ledger alongside dispatched API calls; do not hide them or equate one clock advance with one business mutation. Refused calls count. Stripe object limits and call ceilings both apply. Stop before any limit, report exact consumed/remaining, and request only the specific necessary extension.

Use 10-second provider-call timeouts, no blind mutation auto-retry, stable idempotency and reconciliation. New object namespace apbm007a_e2_<run>; capture exact owned IDs before cleanup. Existing E1 objects are not automatically owned by this capsule. Archive/cancel only owned disposable objects after evidence dependencies are met; disclose provider default restrictions. Never delete unrelated objects/users by prefix.

Director starts local servers/listener as a grouped step, unless explicitly delegating their lifecycle. Agent stops only its own expressly delegated processes. Separate QA will request one Q2 capsule after Q1; it does not inherit this budget.

## Release statement — Tony only, after receipts

"Release E2 for APBM007A v1.0, full scope, under E2_RELEASE_REQUEST.md and its effect capsule. Entry receipts are recorded. Approve the labelled 10%-once whole-invoice sandbox APA fixture. DEV apply, sample loading, deployment and independent Q2 remain separately held."

Do not record the quoted statement as approved until Tony actually issues it. At release record archive hash, two starting SHAs, receipt location and run ID in APBM_STATE and APBM_JOURNAL.

## Local entry receipts — appended by the engineering seat, no secrets

The request text above is unchanged. Receipts are appended here as they are recorded.

| Date | Item | Receipt |
|---|---|---|
| 12 November 2026 16:29 Asia/Dhaka | Two checkouts | OwedBook `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` at `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694`; Payment Portal `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` at `c89572a45210e7d6f098c2878cfabe9a1c5326f1`. Both equal the expected SHAs; no drift. Read-only check |
| same | Git T1 | SATISFIED under the Director ruling of 12 November (APBM_RULINGS.md). Both repositories on branch `apbm-007a`, created by the Director at the SHAs above; portal lock restored (no longer modified); OwedBook `.env.pilot.example` restored (no longer deleted). Portal remote stays on the personal account by ruling; transfer deferred; not a blocker. Remaining working-tree differences are operating records only: portal `RECOVERY.md` and untracked `agent_docs` records; the untracked module folder in OwedBook |

Still open: Tooling T2, private logins location, APA fixture approval, scope choice, source-package hash on the release receipt, and the Director's release statement.
| 12 November 2026 16:40 Asia/Dhaka | Tooling T2 | SATISFIED. APBM_DEV_* and APBM_SCRATCH_* four-name blocks complete; the repo guard (`validateConfig`) accepts both; DEV block equals the app settings; SCRATCH on port 5432. No value exported |
| same | Private logins | SATISFIED. Seven-role APBM003 sheet present at a private path outside Git; structure checked in memory; no reset, no export |
| same | APA | APPROVED by the Director in the release statement: labelled 10%-once whole-invoice sandbox fixture |
| same | Source package | v1.0 FILE_INDEX.json SHA-256 0f71d374b6c96b069ec57bc4458ef358edfb7b3775171942f31dbf30aea5a658 |
| same | **Release** | **E2 RELEASED by Tony, full v1.0 scope, under this request and its effect capsule. Run ID apbm007a_e2_r01. DEV apply, sample loading, deployment and independent Q2 remain separately held** |
