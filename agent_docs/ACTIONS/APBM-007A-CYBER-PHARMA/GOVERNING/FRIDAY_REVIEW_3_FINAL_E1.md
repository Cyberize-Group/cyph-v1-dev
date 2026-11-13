# Friday Review 3 — final E1 return
Source: Tony supplied Friday's final review in this conversation, 12 November 2026. Reviewed r6 archive SHA-256 8d2aea48...ead2.
Verdict: ACCEPT FOR TECHNICAL FREEZE. E1 complete. Amendments are freeze edits, not a new review round. This is not an E2 release.

Accepted: handoff proposal sections 2–9; RA-1 through RA-7. D1 accepted; D4 token lifetime deferred to staging; D5 commercial APA inputs to Frank.

FB-2 withdrawn: mismatch does not consume a code; every binding participates in the atomic claim. FB-15 narrowed: per-object REVOKE and catalogue assertions in 007A; schema-default-privilege change deferred.

FC-1: reject double-slash return paths in SQL and application; exact relative-path allowlist authoritative.
FC-2: revoke only the just-minted session on subject mismatch or revoked completion. Global sign-out is fallback only if individual revocation unavailable; prove individual revocation in E2.
FC-3: issue subject/session from the same access token just validated with getUser, never request input or unverified decode.
FC-4: every emailed access link uses a confirm-button page. F-A7 resolved: both clicks were the Director's. Scanner resistance remains required.
FC-5: seeded APBM003 working logins are E2/QA input. Tony subsequently recovered and used the sheet; retain privately, no reset requested.
FC-6: one effect capsule per engineering/QA pass; offer renewal-grace deferral at release with estimated saving.
FC-7: staging checklist adds redirect entries, template branches, Site URL decision and 900-second lifetime decision.

Before E2: Git T1 including remote, DEV tooling block T2, cast logins, sandbox APA fixture approval. JARVIS folds RA/FB/FC into v1.0 and requests E2 release.
