# APBM007A CAMPAIGN JOURNAL
## E1 checkpoint — 12 November 2026

**Author:** JARVIS  
**Director:** Tony  
**Reviewing Architect:** Friday  
**Execution agent:** Claudy  
**Status:** E1 evidence collection and contract reconciliation remain open. E2 is not released.

This entry records the campaign through the latest SCRATCH session-pool verification. It combines the engineer's returns, Friday's reviews, Director decisions and manual observations. Later SCRATCH results are reported evidence, beyond the revision 5 ZIP snapshot.

This is a checkpoint entry for the canonical module journal. It does not replace existing entries, grant approval, freeze the architecture or certify a build. No live repository was changed by producing this document.

## 1. WHERE THIS RECORD BELONGS

Canonical module:

`/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`

Keep this entry there, or append its content to the existing campaign journal while preserving earlier entries. The Payment Portal repository should retain its pointer to the canonical module. Avoid maintaining two competing journals.

The module covers both repositories:

| Repository | Responsibility |
|---|---|
| `cyph-payment-portal-dev-v1` | Customer registration, purchase, owner billing and portal integration |
| `cyph-v1-dev` | OwedBook access, shared data changes, authentication and application integration |

Private inbox addresses, passwords, keys, connection strings and usable sign-in URLs are excluded. OWNER_1 and other role labels identify test actors without exposing their private inputs.

## 2. BUSINESS AND SCOPE DECISIONS

- One customer account can own multiple stores.
- Monthly pricing is USD 99 for the first store and USD 49 for each additional store.
- Each store has a permanent internal ID. NPI is required and unique in the product. NCPDP is optional metadata.
- APBM007A starts with one store and the owner as its designated administrator. Additional-store and staff-management flows belong to 007B.
- Account ownership and platform role are separate. An owner can remain a platform member.
- Billing visibility and management belong to the account owner.
- Existing password sign-in remains. Emailed sign-in is added beside it.
- Existing DEV is retained. No reset is authorized by this campaign entry.
- Sample claims require a separate operator-only DEV command. Customer registration starts empty.
- Production configuration remains outside this checkpoint.

A store sale is not a reason to delete its records or redesign the subscription foundation. Frank's answer says existing money owed stays with the seller unless transferred by agreement. Tony directed the team to proceed on the agreed foundation. This is not evidence that every transfer detail has been settled. Historical access and any agreed transfer need explicit support procedures in the later scope.

APA is a server-allowlisted promotion-code flow. The labelled 10%-once sandbox fixture is a test input, not the approved commercial offer. The eventual discount covers the invoice, including additional stores. Final commercial eligibility and amount remain business inputs.

## 3. CAMPAIGN RECORD

### CJ-01 — Installation exposed a two-repository coordination problem

The module was installed in OwedBook. The Payment Portal received a pointer file. Seeing only that pointer in the portal initially looked like an incomplete installation.

Resolution: explain the canonical document location separately from the code locations. The actual build spans both repositories. A canonical module in OwedBook does not make this an OwedBook-only project.

OwedBook initially lacked its local environment file because this checkout had been used for reconnaissance. Tony supplied it from the other VM. Both applications were brought into the same development environment for local integration.

**Lesson candidate:** name the working repository, canonical module and affected repositories in every execution handoff.

### CJ-02 — E1 preserved the existing baseline

The engineer reported both checkouts on their expected main revisions:

- OwedBook: `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694`.
- Payment Portal: `c89572a45210e7d6f098c2878cfabe9a1c5326f1`.

Existing changes were recorded and left untouched: the portal's modified `package-lock.json` and OwedBook's deleted `.env.pilot.example`.

Disposable baseline checks passed installation, type checking and builds. Portal unit tests passed 248/248. Its lint command still used `next lint`, requiring a tooling correction. OwedBook passed 201/201 tests with mock mode enabled; failures without it require fixture-aware classification.

The reported FFM comparison found no application-source differences among the identified differences. This is baseline evidence, not certification of the forthcoming integration.

**Lesson candidate:** preserve and classify inherited state before changing it. Do not describe configuration-dependent test failures as newly introduced defects.

### CJ-03 — Missing private inputs interrupted the capability work

The private inbox file was absent. E1 paused provider mutations until Tony created it outside Git with owner-only permissions.

The final private file defines four distinct roles:

`OWNER_1`, `OWNER_2`, `STORE_ADMIN`, `MEMBER`.

An earlier inbox mapping was superseded. Checking the wrong role inbox initially made delivered emails appear missing.

**Lesson candidate:** preflight private prerequisites before starting the bounded experiment. Give the Director an unambiguous role-to-inbox reminder privately.

### CJ-04 — Stripe catalogue candidates were compared before selection

Candidate A used separate first-store and additional-store items. Candidate B used one graduated monthly price with quantity equal to the active store count.

Both produced USD 99, 148 and 197 for one, two and three stores. API experiments also compared proration, a labelled coupon and cancellation/undo.

Candidate B then passed the hosted Stripe portal test. At three stores, the page showed USD 197 and the tier breakdown. Customers could cancel and undo cancellation. The tested configuration exposed no quantity or plan control.

**Decision direction:** use candidate B in the final contract. The obsolete two-price environment shape should not be carried into the build.

The probe catalogue was archived during cleanup. Those price IDs are not the future active application catalogue. The build needs its catalogue creation/verification step.

**Lesson candidate:** prove the hosted customer interface as well as API arithmetic before freezing billing structure.

### CJ-05 — The portal test found two contract changes and a cleanup exception

Hosted cancellation set `cancel_at` while `cancel_at_period_end` was false. A mirror that reads only the boolean would miss the cancellation.

The first portal configuration became the sandbox default. Stripe refused to deactivate it. The approved non-default condition was therefore not achieved, and the engineer disclosed the exception.

The subscriptions were cancelled; three prices and products were made inactive; the promotion code was disabled; the coupon was deleted. Two customers were retained for invoice evidence. One active default configuration remained.

Friday recommended accepting that leftover. Record Tony's explicit disposition in the rulings; a recommendation does not itself grant Director approval.

Required build rules:

- Mirror both cancellation representations.
- Clear the actual schedule when undoing cancellation on the same subscription.
- Pass the intended portal configuration ID explicitly when creating a session.
- Test removal of the only payment method and the resulting renewal/grace behavior during E2.

**Lesson candidate:** cleanup plans must account for provider defaults and irreversible object states.

### CJ-06 — The handoff primitive worked, but its limitations changed the design

The capability experiment demonstrated session creation for an existing user through `generateLink` and `verifyOtp`, with sign-up disabled and no email sent by that exchange.

It also found that link generation for an unknown address could create an identity. The handoff must resolve the existing user by ID before generating the provider link.

Provider links competed for one live slot per user. A handoff invalidated a pending emailed link; a new emailed link invalidated an in-flight handoff; simultaneous exchanges could collide. Link generation also affected the email throttle.

Friday accepted bounded recovery, subject to conditions: mint only at redemption, verify immediately, allow one fresh restart, then show a clear recovery page. Rapid exchanges inside one minute still require targeted evidence.

Distinct cookie names isolated the applications on localhost. Shared default names had hidden that boundary.

**Lesson candidate:** successful use of an authentication primitive does not prove the complete two-application flow.

### CJ-07 — Logout evidence supported the simple design

The provider experiment showed `getUser()` rejection and refresh failure after provider-wide sign-out. Direct data API calls could still use an unexpired access token. The measured token lifetime was 3600 seconds.

Tony accepted provider-wide effects, including other devices and Mission Control for the same identity. A proposed shorter lifetime remains a later settings decision.

The final implementation still needs pending-code invalidation, source-session handling and race analysis. This experiment does not prove every future application guard is correct.

The heavy session-family fallback was not triggered by the evidence presented.

**Lesson candidate:** state separately what session validation rejects immediately and what an already issued bearer token can still do.

### CJ-08 — DEV inspection replaced assumptions with database evidence

Initial connection trouble was resolved using the working session-pool connection. Read-only inspection then confirmed the reported DEV migration ledger against source through 0052.

Inspection also identified:

- Existing fixture NPIs needing grandfathered treatment.
- Three synthetic subscription rows without Stripe links.
- A broader existing grant surface requiring deliberate treatment in new migrations.
- A difference between privileged SQL access and service-key access to `auth.sessions`.
- Existing users beyond the seven-person APBM003 cast.

These findings affect migration safety and regression expectations. Synthetic rows must not silently become read-only or become a general production billing bypass.

The proposed eight-migration sequence remains a design until actual SQL, permissions and application contracts are reconciled.

**Lesson candidate:** inspect existing fixtures, grants and ledger integrity before writing migrations.

### CJ-09 — SMTP delivery and callback correctness were different problems

Initial messages arrived through the default Supabase sender. A verified Resend domain alone had not connected Resend to Supabase Auth.

Tony configured custom SMTP and the Cyber Pharma sender. Fresh delivery subsequently showed the intended sender domain.

The default `ConfirmationURL` template did not match the current server confirmation route's expected query parameters. Tony saved a revised template with exact local destination branches and `token_hash` plus `type=email`.

Exact localhost confirmation redirects were added for ports 3000 and 3001. Staging destinations still require their own deployment preparation.

**Lesson candidate:** prove sender, delivery, template, redirect and application redemption separately.

### CJ-10 — Manual access required recovering the private APBM003 login sheet

Tony needed the seeded password-login cast to enter the existing application. The documented private credential copies were missing from this machine.

The team avoided resetting the cast merely to recover access. Tony recovered the login information and entered OwedBook.

**Lesson candidate:** include private credential portability in a VM handoff. A repository pointer to a private file is not a usable access handoff when that file is absent.

### CJ-11 — OwedBook emailed sign-in passed

Tony received a fresh message, clicked the revised link and entered OwedBook. The provider record showed a consumed token and a new session for the intended test identity.

That identity had platform role member, no owned account and no store membership. Empty store data and no owner/admin experience were therefore expected.

**Verified milestone:** the local OwedBook emailed sign-in path works.

**Not proved:** Payment Portal emailed sign-in, automatic application handoff, Checkout, provisioning, full billing lifecycle or an integrated paid owner experience.

An earlier link was also redeemed by a Windows-identifying browser. The cause remains unresolved. The user-agent record does not establish who clicked it or prove scanner activity. Record the ambiguity without inventing a security incident.

### CJ-12 — SCRATCH became a verified rehearsal target

Later engineer reports confirmed the recorded SCRATCH project was alive and distinct from DEV, with different clusters and accepted project-specific API keys.

The initial SCRATCH transaction-pool URL worked for reads. Tony replaced it with the session-pool URL on port 5432.

The subsequent read-only check connected successfully and compared all 52 migration names and SHA-256 checksums to source. No entries were missing, extra or mismatched.

**Closed:** connection, identity separation and baseline ledger checks.

**Not run:** backup/restore or migration rehearsal. Those are authorized execution stages, not consequences of proving the connection.

## 4. STATUS AT THIS CHECKPOINT

| Area | Evidence now | Still required |
|---|---|---|
| Stripe catalogue | Candidate B arithmetic and hosted portal passed | Application catalogue and integration |
| Authentication | Provider exchange and cookie isolation demonstrated | Final protocol reconciliation and integrated handoff |
| Logout | Provider behavior and residual token window observed | Application guards, races and acceptance proof |
| Email | Intended sender delivered; OwedBook local sign-in passed | Portal branch, recovery, expiry and later staging proof |
| DEV | Reported ledger and structural inspection completed | Final migration SQL and controlled apply checkpoint |
| SCRATCH | Session connection, distinct identity and all 52 checksums verified | Actual rehearsal |
| Git | Baselines and inherited changes recorded | Explicit file dispositions, branches and remote resolution |
| Release | E1 authorized | E1 completion return, freeze and Director E2 release |

E2 has not started. DEV apply, sample loading and deployment remain held.

## 5. EVIDENCE AND EFFECT ACCOUNTING

Latest reviewed package recorded in this campaign:

`APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r5.zip`

SHA-256:

`3c36712675c78ee1c16b4bc1811f55a0f526291419b080bee92312eab0f224de`

It contains 85 members, with 83 indexed. The later SCRATCH checks are not included in that snapshot and must enter the next package.

Primary evidence documents include `E1_REPORT.md`, `CAPABILITY_RESULTS.md`, `CONTRACT_DELTA.md`, `MIGRATION_PLAN.md`, `EFFECT_CAPSULE.md`, `EMAIL_OBSERVATIONS.md` and `SCRATCH_IDENTITY.md`.

Last reported bounded counters:

| Surface | Used | Ceiling |
|---|---:|---:|
| Stripe API mutation calls | 46 | 100 |
| Stripe reads | 83 | 200 |
| Portal configurations | 1 | 2 |
| Portal sessions | 3 | 12 |
| Auth identities | 4 | 4 |
| Auth session calls/accounted sessions | 26 | 32 |
| Provider sign-outs | 3 | 8 |
| Email attempts | 5 | 12 |

These are reported snapshots, not freshly queried totals. Preserve failed calls and browser-observed effects in the ledger. Distinguish agent-dispatched calls from Director browser activity. Do not reset ceilings when packaging another revision.

## 6. REMAINING WORK AND OWNERS

**Claudy — finish the consolidated E1 return**

- Preserve completed evidence and avoid repeating resolved probes.
- Return the rapid-exchange result within remaining authorization, or identify the exact unresolved limit.
- Reconcile protocol, SQL and API contracts together.
- Address different-user destination handling and logout/redemption races.
- Preserve password access and explicitly list intended APBM003 permission changes.
- Define fixture subscription treatment and NPI reservation expiry behavior.
- Carry cancellation, undo, configuration selection and card-removal requirements into acceptance.
- Package later SCRATCH evidence and accurate remaining gaps.
- Restate estimates in agent sessions, elapsed execution hours and Director touches, grounded in the prior campaign.

**JARVIS and Friday — reconcile, then freeze**

The wrong-state/verifier code-consumption policy has competing recommendations. Resolve it explicitly. Do not silently treat every amendment as applied.

Do not reopen broad reconnaissance for already settled facts. Review the final combined contract and targeted unresolved evidence.

**Tony — Git preparation and release authority**

Resolve the inherited file changes, create the intended branches and settle the portal remote before the relevant build/push gates. Avoid blanket restore, stash or add commands.

Issue E2 release only against the identified frozen package. Completion of a connection check does not release the build.

## 7. DOCTRINE CANDIDATES FOR LATER DOC SYNC

These are proposed lessons. They have not been adopted into Factory doctrine or synced to the main documentation.

| ID | Proposed rule | Evidence from this campaign |
|---|---|---|
| DC-01 | Preflight private inputs before bounded provider experiments. | Missing inbox file delayed the capsule. |
| DC-02 | Every prompt names its destination and affected repositories. | Canonical-module and portal-pointer confusion. |
| DC-03 | Verify connection identity and ledger checksums before rehearsal. | DEV/SCRATCH separation and 52-file comparison. |
| DC-04 | Include provider defaults in cleanup design. | First portal configuration could not be disabled. |
| DC-05 | Prove hosted behavior alongside API behavior. | Portal cancellation populated a different field. |
| DC-06 | Separate capability proof from application acceptance. | Provider exchange passed before app handoff existed. |
| DC-07 | Test actual callback templates with the existing route. | Delivery worked before redemption did. |
| DC-08 | Make fixture exceptions explicit and environment-bound. | Legacy NPIs and unlinked synthetic subscriptions. |
| DC-09 | Transfer private login material securely with VM access. | Missing APBM003 login sheets. |
| DC-10 | Update package state monotonically and label stale snapshots. | Later SCRATCH evidence was absent from r5. |
| DC-11 | Keep approvals, recommendations and observations distinct. | Cleanup exception and unresolved protocol amendment. |
| DC-12 | Consolidate execution work without promising zero interruptions. | Provider limits and Director checkpoints remain real. |

At module closeout, derive a separate doctrine journal. Each promoted rule should include the failure it prevents, its evidence, the target playbook, an owner and a proposed amendment. Record rejected candidates too. Main doc sync should apply approved amendments with provenance.

## 8. NEXT JOURNAL ENTRY

Append after the consolidated E1 return. Record:

1. Exact package name and fingerprint.
2. Remaining gaps closed or explicitly deferred.
3. Final protocol rulings and acceptance changes.
4. Git preparation actually completed.
5. Director's release decision and its scope.
6. New lessons supported by evidence.

The next checkpoint should make it possible to answer: what is authorized, what was proved, what remains and who acts next.

