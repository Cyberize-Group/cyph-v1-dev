# SEED AND FIXTURE CONTRACT — APBM-003-CYBER-PHARMA

**Status:** DRAFT — CLAIM STATUS until E1 resolution stamps FINAL. Counts marked `<<E1>>` are fixed from evidence at E1 resolution and then frozen.
**Rulings applied:** R-02 (D-2 synthetic only), R-05 (seed as fixture source of truth, proposed), R-08 (test cast), CE-1, E-13, E-17.

## 1. Source: a documented synthetic generator (D-2)

- The seed is produced by a deterministic generator (`scripts/seed/` — exact path and runner fixed at E1; `npm run seed:*` scripts proposed) with a fixed random seed, so two runs produce the same content.
- **No real data.** Frank's claim files are not read, copied, referenced or used as a template. The legacy demo export is format intelligence only (`LEGACY_DEMO_FORMAT_MAP_v1_0.md` §3): NDC as text with leading zeros, money NUMERIC, `script` text as the claim key, `bin` text, status vocabulary, `effective_date` on reference rows.
- The generator documents its construction (field by field: how each value is produced) in `scripts/seed/README.md`, so "synthetic" is demonstrated, not asserted. A zero-finding identity scan is **additional** evidence, not the proof (plan v3.0 §12).
- Reference tables: a synthetic slice of `aac_reference`, `wac_reference`, `pbm_info` sufficient for AAC-hit and AAC-miss rows and several PBMs (`<<E1: row counts>>`); `ful_reference` seeded only if a tab or KPI reads it (E1 says). `system_config`: Alabama `dispensing_fee 10.64`, `brand_multiplier 0.96` (Verified Ground). PBM table tenancy per `../APBM_RULINGS.md` O-03.

## 2. The cast (R-08) — identities created server-side (CE-1)

| Handle (key-name stem for `.env.qa.local`) | Platform role (`user_roles`) | Ownership (`accounts.owner_user_id`) | Junction rows (`user_businesses`) | Purpose in tests |
|---|---|---|---|---|
| `OWNER1` | member | owns Account A (1 store: A1) | admin of A1 | one-store owner who is also its admin |
| `OWNER3` | member | owns Account B (3 stores: B1, B2, B3) | admin of B1 only | three-store owner; reads B2 and B3 by ownership alone (D-4) |
| `ADMIN_B2` | member | — | admin of B2 | separate store admin |
| `ADMIN_B3` | member | — | admin of B3 | separate store admin |
| `MEMBER_B1` | member | — | member of B1 | worker with one store |
| `MEMBER_B2B3` | member | — | member of B2 and B3 | worker with two stores, not the whole account |
| `UNRELATED` | member | owns Account C (1 store: C1) | admin of C1 | unrelated account; must see nothing of A or B |
| `OPERATOR` (optional) | superadmin | — | — | internal operator; created and used **only** for tests the plan explicitly authorizes; never a customer |

Identities are created through the Auth admin API by the seed script (the only sanctioned admin-client use, CE-1) with **explicit** `user_roles` and `profiles` writes; signup metadata never carries a role. Passwords are generated per run and written **only** to the Director's ignored credential file or delivered to testers through a secure channel; never into the repo, logs or evidence. E-17: every identity named by a QA checkpoint must exist before the checkpoint runs (preflight row PF-4.4).

## 3. Claims shape and the seven locked money rules

Every seeded `user_data` row satisfies, and the generator's self-check asserts, all of:

1. **FEE** = 10.64 on every row, point-in-time (the row's fee is the `system_config` fee in force on its fill date; only one vintage exists in the seed).
2. **EXPECTED** = `quantity × per_unit_rate + fee` for every method; `per_unit_rate` rounded to 5 decimals before multiplying.
3. **OWED** = `expected − paid`, signed, never clamped; positive means the PBM owes the pharmacy; negatives present (overpayments).
4. **PRICING ORDER**: AAC if present → WAC-derived (brand × 0.96, generic × 1.0) → FUL ceiling for generics only; U&C out of scope; the chosen method recorded in `medicaid_method`.
5. **METHOD VOCABULARY**: only `AAC`, `FUL`, `GWAC`, `BWAC`, `Take Action`, `Manual Override` (the 7-value CHECK includes NULL semantics per BIM-001 E-2: `''` → NULL).
6. **PBM KEY** computed from BIN-PCN-group, never typed (e.g. BIN `004146` → `4146`); unmatched PBMs present so the Summary's missing-PBM disclosure (RRM-002) has something to disclose.
7. **POINT-IN-TIME**: `reference-provenance` (vintage) columns populated from the seeded reference rows.

Plus coverage: every status chip (`new`, `underpaid`, `pending`, `emailed_pbm`, `recovered` — E1 confirms the live vocabulary and the Phase-2 chip set), both money signs, ≥ `<<E1>>` distinct PBMs, AAC-hit and AAC-miss rows, at least one row per store with `report_file`, `aac`, `federal_expected`, `federal_diff` NULL (the four Phase-5 fields the wrappers return NULL in v1).

Row counts: `<<E1>>` per store (enough for the pager to page: more than one page at the default page size; the delivery plan's "expected claims volume for the trial" (OW14) is not answered, so E1 proposes a count and the Director confirms).

## 4. Idempotency, reset and safe boundaries

- `seed:reset` + `seed:run` on **SCRATCH** from scratch is the proof path; on **dev** the seed runs once at the APPLY checkpoint under Director authority and is re-runnable only through the same checkpoint procedure (never from a shell habit).
- **Reset boundary**: tenant rows (`accounts`, `businesses`, `user_businesses`, `user_data`, `subscriptions`, `apa_*`, `pending_registrations`, `report_files`, reference slices, `system_config` rows the seed owns) and the seed identities. **Never** `audit_logs` (insert-only, TRUNCATE guarded — the seed must not even try), never `user_roles`/`profiles` rows of non-seed users, never Storage.
- **"Reseed twice = identical state"** is graded as: identical canonical content hash over every seeded table **excluding** `audit_logs`, generated timestamps (`created_at`/`updated_at`), auth UUIDs and any surrogate ids; the comparison script defines the canonical projection and is itself an instrument QA attacks (change one seeded value → hash differs).
- Audit rows produced by the seed carry `actor_role = service_role`, actor NULL; the expected count per run is recorded (`<<E1>>`) and QA checks it.

## 5. Fixture regeneration (R-05, pending confirmation)

`src/mocks/owedbook.ts` is regenerated from the generator's output for Account A (or the store E1 picks) so mock mode shows the same rows as real mode for that store. The regenerated fixture must pass the RRM-002 money-rule audit script (0/N failures, versus 149/150 today). If the Director freezes the old mocks instead (O-02), this section is struck by a ruling and AC-205 is ruled not applicable.

## 6. Identity scan (AC-202)

A scripted scan over every seeded column asserts the absence of patient-identity-shaped values (names, DOBs, addresses, phones, member IDs, diagnosis codes) using patterns validated with a synthetic leak fixture **and** a clean control (the scanner must fail on the fixture). Zero findings is necessary, not sufficient (§1).

🥄
