# MISSING_INPUTS — what this pack could not verify or obtain at authoring (2026-11-05)

Nothing below was invented. Each row names the owner and the moment it is resolved.

| # | Missing input | Why it matters | Owner | Resolved at |
|---|---|---|---|---|
| MI-1 | The engineering recon skill: name, path, version, capabilities | E1 §0 depends on it | Director (makes it available) → Cody (discovers) | E1 |
| MI-2 | Full baseline SHA (only the short `5234abe` is known) and the pack-installation commit | identity rows everywhere | Director (installs pack) → Cody | E1 |
| MI-3 | Disk truth for every "reported" fact: table/policy/function names, grants, the member SELECT policy name on `user_data`, `accounts.owner_user_id` FK behavior, the audit `read_page` convention, the 320-cell matrix location, harness scripts, test counts, route count, fixture count | every `<<E1>>` in the spec; the expected-change list; the audit operation contract | Cody | E1 (`EVIDENCE/E1/COUNTS.md`) |
| MI-4 | Current DEV state and whether DA-2 is done | APPLY prerequisites | Director (DA-2) → Cody (observes) | E1 / before APPLY |
| MI-5 | The Cloud Run project id, service name, current revision/image, env var names behind `cyber-pharma.cyberizedev.com`; the deploy workflow's actual commands and the approval the Director gives | stage 8, AC-7xx | Cody (recon, read-only if access given) → Director (approval) | E1 / O-07 |
| MI-6 | Which admin demo screens are the "agreed admin read views" | AC-6xx scope | Director | E1 resolution (O-06) |
| MI-7 | PBM table tenancy for the seed | seed shape | Director | E1 resolution (O-03) |
| MI-8 | Confirmation of R-05 (regenerate `mocks/owedbook.ts`) | AC-205 applicability | Director | E1 resolution (O-02) |
| MI-9 | Per-store claim volume for the trial (delivery plan OW14 unanswered) | seed row counts | Director proposes a number at E1 resolution; Frank's answer if it arrives | E1 resolution |
| MI-10 | The exact error class a denied direct read returns after the revoke (permission denied vs policy-empty) | AC-302 literal expectation | Cody observes on SCRATCH at E2 stage 3; recorded as a §C ruling | E2 |
| MI-11 | QA Lead seat holder for this module | approval and certificate attribution | Director | before Q1 |
| MI-12 | Hashes and Hub commit SHAs for governing bodies read through the project connector (QA_PLAYBOOK, template set) | `QAM/GOVERNING/README.md` | Director (snapshot step) | before Q1 |
| MI-13 | The APBM playbook's companion template set (`TEMPLATES/RECON_ASSIGNMENT.md`, folder spec) — not present in the Hub | E1 mission authored from APBM_PLAYBOOK §5 instead | JARVIS (confirm the absence is acceptable) | review |
| MI-14 | Runtime auto-discovery of `CLAUDE.md`/`AGENTS.md` at the module and QAM levels — not verifiable from the authoring lab | PARENT_ENTRY_ROUTING checklist row | Cody (E1 §1.3), Claudy (Q1 PF-2.3) | E1 / Q1 |
| MI-15 | Whether the Director wants `OPERATOR` (internal superadmin) seeded at all for Target One | cast; MR-15 | Director | E1 resolution |
| MI-16 | Plan v3.0 D-6 adoption | E2 may not start without it | Director | before E2 approval |
