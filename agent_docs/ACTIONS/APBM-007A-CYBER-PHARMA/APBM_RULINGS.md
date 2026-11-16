# Frozen rulings — APBM007A v1.0

Final technical authority: Friday Review 3 supplied by Tony; JARVIS reconciliation. E1 is complete; no execution release follows automatically.

1. Candidate B selected; single STRIPE_PRICE_STORES; explicit portal configuration; both cancellation fields and same-subscription undo.
2. Atomic claim checks all bindings before consumption. FB-2 burning rule withdrawn.
3. FC-1 // rejection; FC-3 same-validated-token source binding; FC-2 individual-session failure cleanup, E2 proof required.
4. FC-4 confirm button for every emailed access link; scanner incident not established; both earlier clicks were Tony's.
5. Password sign-in preserved. Logins recovered by Tony; no seeded password reset authorized or needed.
6. RA-2 legacy billing fixtures are marked only by exact identified rows, environment-fenced; no general unlinked-row exemption.
7. RA-3 permissions change explicitly; no silent APBM003 assertion weakening.
8. RA-7 no CHECK on legacy businesses.npi, including NOT VALID; new-input server/UI and reservation/provisioning validation plus unique index. This supersedes earlier FB-6 table-CHECK wording.
9. Per-object REVOKE/catalogue assertion is in scope; changing default ACLs deferred (FB-15 narrowed).
10. Lifetime remains 3600 seconds; 900-second decision on staging checklist. Owner-approved global logout impact remains accepted.
11. APA covers whole invoice. Real amount/duration to Frank; labelled 10%-once sandbox fixture awaits Director E2 approval.
12. Renewal grace remains included. FC-6 deferral offered only as an explicit scope change before release.
13. Store-sale receivables stay with seller unless agreed otherwise; support transfer/history semantics remain 007B. No record deletion by NPI.
14. DEV apply, sample loading, QA and deployment keep their own release boundaries. One E2 capsule and one independent Q2 capsule; no approval per ordinary test.

Source amendments incorporated: FA-1..11; RA-1..7; FB-1,3..14,16; FC-1..7, with explicit supersessions above. Details and acceptance are in the frozen contracts and AC expansions. Historical record follows; earlier pending/NOT RELEASED E1 statements are historical only.

---
# Rulings and review proposals

The supplied decision record is authoritative for recorded Director/business decisions. Preserve its bytes. Current technical proposals are NOT approvals.

| ID | Disposition |
|---|---|
| R-01 | Adopt existing DEV, synthetic/public data only; do not create another project or reset DEV. |
| R-02 | Honor decision 3.4: DEV credential rotation deferred to production preparation. Record this accepted limitation; no new rotation gate. Never publish credentials. |
| R-03 | Separate apps/repos; single migration chain in OwedBook. Stripe credentials/server SDK stay in portal. FA-3: OB gains its first user-facing server-only service-key consumer for handoff redemption, changing APBM003's no-consumer position. D-01 approved by Director ruling R1; server-only import guard, exact-user binding and bundle check required. |
| R-04 | Same handoff locally/staging, distinct namespaced cookies/storage and explicit allowed origins. No parent-domain session cookie. |
| R-05 | Friday accepted: 007A owner is sole initial store admin; alternate admin and extra-store entry held for 007B with truthful copy. |
| R-06 | Friday accepts optional NCPDP with Tony D-03 now approved in R1. Preserve values/IDs and check unique-NPI conflicts before migration. |
| R-07 | Build seven-day renewal grace per Coach's instruction, explicitly provisional pending Frank. NPI sharing has now been answered: no sharing for this product. Add Store proration remains a 007B provisional rule. |
| R-08 | FA-7: ended cancellation uses a provisional versioned retained-read-only + billing/support default, same standing as instructed seven-day grace. Final Frank confirmation is not a freeze blocker. No automatic deletion/reactivation/second subscription. |
| R-09 | FA-6: APA uses a server-allowlisted valid Stripe promotion code; possession is eligibility unless Frank specifies otherwise. No membership-verification feature. Real amount/duration/additional-store treatment remain open; Tony may approve a labeled sandbox fixture at freeze. Unknown/expired/non-allowlisted codes rejected. |
| R-10 | FA-5: compare two-item first+additional prices with one graduated monthly price, quantity=store count. Prefer single-item if portal cancellation/undo, invoice clarity, proration and coupons pass. Env names follow selection. Raw Stripe quantity changes never bypass named-store operations. |
| R-11 | Pull the relevant privilege-hardening follow-up into 007A. Reserve/confirm 0053 after checking current chain; allocate actual names only at freeze. Historical migration files are not edited or replayed on DEV. |
| R-12 | Existing portal staging service remains untouched until joint release. Confirm how the new requested domain attaches to that service; an old deploy.sh is not current deployment authority. |
| R-13 | One scope-specific preflight return; aggregate missing prerequisites. Routine implementation/self-verification runs continuously within the released envelope, with declared DEV apply and QA ownership checkpoints. |

Append accepted amendments with authority, date, original wording, affected ACs/contracts and evidence impact. Do not overwrite frozen acceptance after seeing test outcomes. No exceptions from APBM003 automatically waive 007A acceptance.

| R-14 | FA-1/2: destination-initiated state/verifier authorization-code flow; mint provider session only in destination redemption memory. No persisted provider material/encryption key. Outstanding-email/handoff collision probe required. |
| R-15 | FA-4: simple provider-wide logout is the proposed default, with D-02 acknowledgement of Mission Control/all-device impact and residual direct-data access JWT lifetime approved in R1. Session-family/RLS fence is fallback only, with costed regression if a stated requirement needs it. |
| R-16 | FA-8: optional DEV synthetic sample loader scope approved under D-04 in R1; no automatic customer seed. |
| R-17 | FA-9/10/11: email prep starts before E1; two planned architecture reviews, one final grouped Director walk, separate E1 effort estimates; inherited 7–9 days for all 007 does not cover this scope. |


## Director R1 — effective 11 November 2026

D-01–D-04 are now APPROVED for synthetic DEV/staging, superseding any historical pending proposal wording above: first OB guarded handoff service-key path; simple provider-wide logout/MC/all-device impact and access-token residual; optional NCPDP; operator-only DEV sample-loader scope. Email provider/domain/proposed sender and final four-recipient cast are supplied. Full attribution/privacy handling is in DIRECTOR_RULINGS_2026-11-11.md and OPERATOR_INPUTS.md.

E1 and E2 are explicitly NOT RELEASED. No SMTP/redirect/JWT/DNS settings change, provider probe or DEV apply has occurred. E1_RELEASE_REQUEST.md is the requested bounded permission, not authority by itself. Production remains deferred.

## Director ruling — Payment Portal remote and Git T1, 12 November 2026

Supplied by Tony in the engineering conversation on 12 November 2026; transcribed by the engineering seat, documentation only.

1. The Payment Portal `origin` stays at `https://github.com/ahmedmusawir/cyph-payment-portal-dev-v1.git`. Transfer to Cyberize-Group is DEFERRED and is **no longer an E2 entry blocker**. This supersedes the "portal remote confirmed under Cyberize-Group" wording in the Git T1 row of E2_RELEASE_REQUEST.md. The remote is not to be changed.
2. Git preparation is complete (Director-executed): `apbm-007a` branches created in both repositories; Payment Portal `package-lock.json` restored; OwedBook `.env.pilot.example` restored.
3. The original FFM repository, `cyph-stripe-subscription-portal-v1`, stays preserved.

E2 remains NOT RELEASED. The other entry items in E2_RELEASE_REQUEST.md are unchanged by this ruling.

## Director rulings — backup preparation and identity ceiling, 12 November 2026 (evening)

Supplied by Tony in the engineering conversation; transcribed by the engineering seat.

1. Backup option A is chosen: install `postgresql-client-17`, take a scoped private DEV backup, restore-rehearse only on the positively identified SCRATCH project within the remaining rehearsal cycle, record exactly what the backup covers and excludes (Auth data, roles, grants, functions, migration ledger), and verify the restored state. A public-table-only restore is not to be called full recovery.
2. **The 12 SCRATCH Auth identities count against the 12-identity ceiling. No more are to be created.** If the rehearsal needs more identities or another exhausted allowance, Engineering returns one exact minimum extension request before that effect.
3. Before the integration test is rerun, the corrected email stub must be proved to intercept the real call path. No further sends to unapproved recipients.
4. Engineering returns a sanitized apply-review ZIP (updated bundle, the eight SQL files, the runner and changed helpers, inventory, preservation and rehearsal receipts, backup and restore receipts with scope and limits, reconciled counters). No credentials, backup contents or usable sign-in links in it.
5. **DEV apply remains HELD. No deployment before 007B is complete.**

## Director ruling — backup option B accepted; option A cancelled, 12 November 2026 (supersedes the option A instruction above)

Supplied by Tony in the engineering conversation; transcribed by the engineering seat.

1. Option A is CANCELLED: no PostgreSQL tools are installed; no full or partial restore is performed; no DEV Auth users or password hashes are copied; no SCRATCH identities are deleted; **no identity extension is approved**.
2. **Option B is ACCEPTED for this synthetic DEV delta:** the existing private logical export, the SCRATCH upgrade and preservation evidence, and the forward-recovery proof. **Restore is recorded as NOT PROVEN and is explicitly accepted by the Director for this apply checkpoint.**
3. The email-stub proof is accepted as engineering evidence and is not to be repeated.
4. No further restore-related work and no provider effects. **DEV apply remains HELD until the SQL review. No deployment before 007B completion.**

## Amendment A1 — Director rulings recorded under JARVIS's instruction, 13 November 2026

Authority: the Director's approved rulings, relayed by JARVIS in the consolidated repair instruction to Engineering on 13 November 2026, after the Q1 Lead decision (QA A1–A9/RETURN). Transcribed by the engineering seat. The original v1.0 wording is preserved unchanged in APBM_ACCEPTANCE_SPEC.md, the contracts and CONTRACTS/IMPLEMENTATION_REQUIREMENTS.md; each carries an "Amendment A1" section that is operative from this date. This also issues the acceptance and contract changes that APBM_ACCEPTANCE_SPEC.md requires before any renewal-grace deferral ("do not merely skip AC-031 in testing").

| Ruling | Original v1.0 wording (preserved) | Amended requirement | Affected | Evidence impact |
|---|---|---|---|---|
| A1-1 F-Q1-01 webhook recovery | AC-015: "missing mappings enter visible retry/attention rather than silent 200 loss"; BILLING "Durable events": non-2xx on unresolved failure, duplicates of completed events 2xx | Repair required and proven: distinguish app-owned, foreign and unresolved objects by trusted server-side evidence (a missing mapping is not foreign); owned/unresolved and busy events stay visibly retryable; duplicates keep recovery open until completion; 2xx for unfinished work only with genuine durable retry responsibility, otherwise retryable non-2xx; idempotent; bounded, history-preserving recovery of rows finalised incorrectly; proofs a–f | AC-014, AC-015; expansion row 014–015 (new); BILLING_AND_PAYMENTS_CONTRACT "Durable events"; AC-038 recovery entrypoint | r01 webhook evidence stays valid for signature, ordering and B4. AC-014/015 need fresh independent Q1 evidence on the repaired candidate. Engineering unit proof: EVIDENCE/E2/r02/REPAIR_F-Q1-01.md |
| A1-2 G2 renewal failure and seven-day grace | AC-031 "Prove server-computed seven-day grace…"; expansion 031–032 "Real sandbox renewal failure via test clock…"; RA-6 renewal-failure table | Test-clock seam and the live failed-renewal / seven-day-grace journey deferred to 007B. 007A keeps and tests the SQL and unit checks (grace start once per invoice, no restart on retries, clear by payment of the same invoice, server-time evaluation, late failure after payment does not reopen, initial failure never provisions). The live journey is **NOT RUN BY DIRECTOR RULING**, has never passed, and must be proven before production billing. Tracked as a 007B obligation (CARRY_FORWARD_007B.md, O-1) | AC-031, AC-032; expansion 031–032; RA-6 (renewal-failure half only); BILLING "Lifecycle and access" | No 007A evidence may report the live journey as PASS. Existing SQL/unit evidence is retained |
| A1-3 G5 renewal reminder | BILLING "Stage reminders are sent only to approved test inboxes"; AC-031 "banner"; DATA notification operations "Access email/reminder attempt" | For 007A, test and require the in-app reminder banner plus the recorded notification (`notification_operations`, kind `renewal_reminder`). Reminder-email delivery is deferred and stays tracked (CARRY_FORWARD_007B.md, O-2) | AC-031; BILLING "Lifecycle and access"; DATA "notification operations" | Banner and notification record must be shown by Q1; no reminder email is expected or claimed |
| A1-4 G1 new-owner identity for QA | Identity ceiling 12/12, consumed on SCRATCH (rulings of 12 November) | Exactly **one** additional brand-new DEV Auth identity is approved, for independent QA's new-owner journey under Cody's approved QA capsule, using a privately identified Director-controlled inbox. Not for engineering consumption. Engineering does not pre-create the user or send its access email | ENVIRONMENT_AND_EFFECTS; QA capsule; AC-016/AC-018 new-owner journey (r01 NOT RUN item N1) | The brand-new-owner path may be proved only by QA with that identity; OWNER_1's existing identity still does not count |

Unchanged by A1: AC-029 (explicit configuration, only-card removal, raw quantity/price), AC-030 (end-period cancellation and same-subscription undo), the only-card-removal half of RA-6, every other AC, and every other expansion row. No acceptance result is claimed by recording these rulings.

### Erratum E-A1-1 — 16 November 2026 (recorded by the engineering seat)

Source: QA Lead (Friday) ruling B2 on F-Q1-02 and ruling B3 on F-Q1-03 (`QAM/QAM_APPROVAL.md`), relayed again in JARVIS's Q2 repair instruction. The A1 table above keeps its original words.

| Location | Original words (preserved) | Read as |
|---|---|---|
| A1-1, Evidence impact | "AC-014/015 need fresh independent Q1 evidence on the repaired candidate" | fresh evidence by independent QA in Q2 on the repaired candidate |
| A1-3, Evidence impact | "Banner and notification record must be shown by Q1" | shown by independent QA in Q2 |
| Any A1 evidence that independent QA proves in SQL | (not stated) | Independent SQL and fixture proofs are SCRATCH-only; DEV receives only the application-mediated effects in the approved capsule |

No requirement, deferral or result changes. A1-2 (G2, NOT RUN BY DIRECTOR RULING), A1-3's reminder-email deferral and CARRY_FORWARD_007B O-1/O-2 stand as approved.
