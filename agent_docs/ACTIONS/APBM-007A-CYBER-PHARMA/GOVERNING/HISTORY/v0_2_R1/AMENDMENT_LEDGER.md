# Amendment ledger — Friday first review → v0.2

Source: GOVERNING/FRIDAY_REVIEW_V0_1.md, copied exactly from Tony's message. JARVIS applies the review; Director choices were pending at the first review and are now approved under R1. Original decisions snapshot is unchanged. No executed result or new independent approval is asserted.

| Amendment | Canonical changes | Acceptance/readiness impact |
|---|---|---|
| FA-1 | AUTH contract uses destination start/state/verifier → source authorize → code redemption; removes default source POST/nonce | AC-022–024, P12; browser proof/replay controls retained |
| FA-2 | Destination mints/verifies provider session in memory on code redemption; no provider token persistence/encryption key; explicit outstanding-email collision probe | AC-018/019/022–024, P12; alternative required before freeze if collision |
| FA-3 | R-03/D-01 explicitly acknowledge first OB user-facing service-key path; server-only guard and client-bundle test | AC-037; D-01 approved in R1 |
| FA-4 | Provider-wide logout proposed; Auth-server validation plus measured session liveness; access-JWT residual disclosed; registry/RLS fallback only | AC-025/026, P13; D-02 approved in R1; exact lifetime/MC impact measured |
| FA-5 | E1 compares two-item versus graduated single-item catalogue, preferring single-item on proof; config names follow selection | AC-009/029, P09 |
| FA-6 | APA eligibility is possession of a server-allowlisted valid promotion code unless Frank supplies another rule; no membership system | AC-010, P17 |
| FA-7 | Ended-cancellation retained/read-only default is provisional and versioned, not a freeze blocker; grace acceptance states real 007A limits | AC-030–032, P16 |
| FA-8 | Optional operator-run DEV sample loader with exact synthetic store/rows and no automatic customer seeding | AC-018/036/038 D-04 scope approved in R1 |
| FA-9 | Email provider/domain/DNS/owned inbox setup moved to Director prep before E1 | P11, DIRECTOR_PREP |
| FA-10 | Two planned architecture reviews: original readable review, then complete post-E1 review/freeze; one grouped final Director product walk | Entry/state/execution/QAM handoff |
| FA-11 | E1 costs engineering, QA, apply and deploy separately; old all-007 7–9 days explicitly superseded as planning assumption | E1 estimates/Director prep |

Clarification applied within FA-4: getUser() supplies authentic user identity but is not assumed to prove immediate revocation of every unexpired session. Supabase documents checking the verified session_id against auth.sessions for immediate session liveness. E1 must measure the installed behavior; no immediate-logout PASS is derived from method names. A narrow server-only liveness query is distinct from the optional session-family/RLS fallback. Direct data API retains the explicitly disclosed expiry window unless a later approved fence removes it.

Director R1 supersession: D-01–D-04 are approved; email/test-recipient inputs supplied. Earlier pending-decision entries above are historical at v0.2 preparation time; current state/rulings/prep files control. E1_RELEASE_REQUEST is still a request. Actual mailbox values are intentionally excluded from this review package.
