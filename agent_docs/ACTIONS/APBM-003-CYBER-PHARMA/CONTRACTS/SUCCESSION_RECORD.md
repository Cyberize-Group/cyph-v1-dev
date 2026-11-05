# SUCCESSION RECORD — BIM-004 / APPLY SESSION / BIM-005 → APBM-003-CYBER-PHARMA

**Purpose:** plan v3.0 §4 requires an explicit succession record mapping the unfinished Phase 3 obligations into this module. Historical records, certificates and identities are preserved unchanged; nothing is renamed. BIM-004 and BIM-005 were planned (campaign map v1.0 §6–§7, v1.2 amendments) and **never authored as packs**; the APPLY SESSION was declared (map v1.1) and **never run**.

## 1. Obligation map

| Predecessor obligation | Source of record | Successor in APBM-003 | Closure requirement |
|---|---|---|---|
| BIM-004 seed: two believable pharmacies, scrubbed demo rows split across tenants | map v1.0 §6 | Stage 4; `SEED_AND_FIXTURE_CONTRACT.md` | **Superseded in method** (D-2): synthetic generator, demo rows not loaded. Same acceptance intent: AC-201..AC-207 |
| BIM-004 seed users: owner-A, staff-A, owner-B, multi-store, superadmin | map v1.0 §6 (cast amended v1.2 drops superadmin) | R-08 cast | Replaced by the delivery-plan cast; AC-203 |
| BIM-004 AC1 reseed idempotent · AC2 zero identity values · AC3 distribution across statuses/signs · AC4 reads via wrappers · AC5 provenance documented | map v1.0 §6 | AC-201, AC-202, AC-204, AC-501, AC-206 | literal |
| CE-1 seed identities via admin API + explicit `user_roles`/`profiles` writes | RRM-001 D-rulings 09-20; State brief §4.1 | Stage 4; AC-203 | |
| CE-2 `handle_new_user()` trigger correction migration, verified at APPLY | State brief §3, §4.1 | Stage 2 (OD-7); AC-105; APPLY checkpoint verifies on dev | |
| E-13 fixtures violate money rule 3 (149/150) | RRM-002 audit | Stage 4; R-05; AC-205 | |
| E-17 seed identities are the QA identities; verify before any checkpoint names them | RRM-004 lesson | QAM preflight PF-4.4 | |
| BIM-004 pre-flight rulings 1–7 (seed source · seed through audit trail · reference tables · `system_config` rows · CF-1 · idempotency/reset · `insurance/new_paid/status` shapes) | handoff Part 5 §5 | Ruled or routed: R-02 · §5 of ownership contract · seed contract §1 · seed contract §1 · ownership contract §2 (CF-1 at E1 resolution) · seed contract §4 · seed contract §3 | |
| APPLY SESSION: chains `0001`–`0047` + seed onto the dev backend with `db:apply`, catalog check after each, harness run, trigger verified; re-verify E-4's default-ACL premise | map v1.1 LIVE APPLY DEFERRED; handoff Part 5 §1 | **Stage 5 declared stop**; `../APPLY_CHECKPOINT.md` | AC-401..AC-405 |
| DA-2 Supabase signup OFF on dev + SCRATCH with curl proof + evidence file | RRM-001 AC-206; State brief §5 | `../APBM_RULINGS.md` O-08; `../APPLY_CHECKPOINT.md` §1 | evidence file present before apply |
| BIM-005 CRV: `services/owedbook.ts` → wrappers; component diff empty; eyes-on walk; every read in `audit_logs`; spoof rejected; isolation suite green | map v1.0 §7 + v1.2 | Stages 6–7; AC-5xx; Director eyes-on walk declared once in QAM | AC-501..AC-507 |
| CE-3: AC2 baseline is post-RRM `main`; AC5 adds `/moose-portal` absent; parity notes for the swap (Summary tiebreak, empty-string PBM, JS-vs-SQL rounding) | State brief §4.3 | AC-502, AC-506; parity notes carried into the seed contract §3 and the swap stage | |
| R-016 (A-006): rule component invalidation and error states before real reads (a KPI fetch error must not render zeros) | State brief §4.3 | O-04 at E1 resolution; AC-507 | |
| CF-10 direct `user_data` SELECT bypasses read-audit | BIM-003 D-1 | **Closed in full** by D-1(a): ownership contract §3; AC-301..AC-305 | both halves proven independently |
| CF-8 harness evidence root / env prefix / "18 policies" text | BIM-003 addendum | Stage 5; AC-801 | |
| CF-9 `db-verify` AC7 red since BIM-002 | BIM-003 addendum | Stage 5; AC-802 (re-baseline to the certified policy set) | |
| CF-1 `accounts.owner_user_id` blocks auth-user deletion | BIM-003 addendum | ownership contract §2 (semantics ruled at E1 resolution); transfer runbook → APBM-007 | |
| BIM-005 "moose-portal intact" AC | superseded 09-20 | AC-506 asserts `/moose-portal` absent instead | |
| Storage policies (Proto 01) · `report_files` fidelity | deferred | APBM-006 | not this module |
| E-4 default-ACL premise re-verify on dev | handoff Part 5 §4 | `../APPLY_CHECKPOINT.md` §3 | |

## 2. Preserved history (read, never edited)

`agent_docs/ACTIONS/BIM-000..003-CYBER-PHARMA/**`, `agent_docs/ACTIONS/RRM-001..004-CYBER-PHARMA/**`, `agent_docs/ACTIONS/PROTO06/**`, `agent_docs/AUTHORITY/PHASE_3_BIM_CAMPAIGN_MAP.md` (v1.2; this module records in the campaign journal that it succeeds BIM-004/APPLY/BIM-005; the map body is not rewritten), `PHASE_3_CAMPAIGN_JOURNAL.md` (append-only), certificates for BIM-003 `c45949e` and RRM-004 `2fbc72f`.

🥄
