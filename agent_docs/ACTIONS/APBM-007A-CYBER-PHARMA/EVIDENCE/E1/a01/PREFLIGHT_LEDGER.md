# Build readiness ledger — E1 a01 evidence

Evidence copy; the module-root `PREFLIGHT_LEDGER.md` is unchanged for the Architect to reconcile. Only rows E1 touched are listed.

| ID | Status after a01 | Evidence |
|---|---|---|
| P01 | PARTLY EVIDENCED — roots, SHAs, branches, dirty paths recorded. Open: portal remote, lock and `.env.pilot.example` dispositions, `apbm-007a` branches (Tony) | `ENVIRONMENT_IDENTITY.md` §1; `ACTION_LIST.md` |
| P02 | EVIDENCED, with inherited tooling issues and proposed fixes | `BASELINE_RESULTS.md` |
| P03 | EVIDENCED | `ENVIRONMENT_IDENTITY.md` §1 |
| P04 | EVIDENCED — app target equality, DEV identity by API and SQL, 52-migration chain and checksums, trigger equal to `0049`, sign-up disabled, effective grants and default privileges recorded | `ENVIRONMENT_IDENTITY.md`; `DB_CHECK_RESULTS.md` |
| P05 | PARTLY EVIDENCED — SCRATCH identity verified, distinct from DEV, session pooler, ledger 52/52 equal to source. Apply rehearsal and restore not run (E2) | `SCRATCH_IDENTITY.md` |
| P06 | PROPOSED — sequence `0053`–`0060` with hardening drawn from live grants; `0053` confirmed free; NPI inventory clean | `MIGRATION_PLAN.md` |
| P07 | EVIDENCED for DEV — server key (data API, Auth admin) and read-only SQL both usable through local config; the repo tooling additionally needs the full `APBM_DEV_*` block | `CAPABILITY_RESULTS.md`; `DB_CHECK_RESULTS.md` |
| P08 | EVIDENCED — same sandbox, write permissions exercised, SDK 22.1.0 / `2026-04-22.dahlia` | `ENVIRONMENT_IDENTITY.md` §3; `CAPABILITY_RESULTS.md` §1 |
| P09 | EVIDENCED — single graduated item passes all checks including hosted portal; env names proposed | `CAPABILITY_RESULTS.md` §1, §1a; `CONTRACT_DELTA.md` §2 |
| P10 | REPORTED plan — route, port and event list stated | `CONTRACT_DELTA.md` §2 |
| P11 | EVIDENCED FOR OWEDBOOK — delivery PASS; `cyberizedev.com` sender observed in use; OwedBook emailed sign-in PASS on localhost with the revised template. Payment Portal branch, expiry and staging redirects not proved | `EMAIL_OBSERVATIONS.md`; report §4.2 U2, U11, U12 |
| P12 | EVIDENCED for the provider primitive, cookie separation and rapid sequential exchanges (prototype). Full SQL/API contract PROPOSED, not built. Collision handling needs a review decision | `CAPABILITY_RESULTS.md` §3–5; `HANDOFF_CONTRACT_PROPOSAL.md` |
| P13 | EVIDENCED — server rejection immediate; residual 3600 s measured; Mission Control app untested | `CAPABILITY_RESULTS.md` §6 |
| P18 | PROPOSED shape | `MIGRATION_PLAN.md` |
| P19 | PARTLY EVIDENCED — four identities exist under their labels; E2/QA effect limits still to freeze | `EFFECT_CAPSULE.md` |
