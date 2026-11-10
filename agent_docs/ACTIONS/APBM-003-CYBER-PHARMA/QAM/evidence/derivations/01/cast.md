# cast.md — [QA-derived]

Derived by Claudy (QA Executor) at 2026-11-09T03:30:04.918Z from the working tree (= candidate 308247a24e6ddd455842da5cd2e21541d7eae2c1, T-00). Source files are cited; no engineering receipt was read for any value below.

Source: CONTRACTS/SEED_AND_FIXTURE_CONTRACT.md §2 (cast table) cross-read with scripts/seed/run.mjs (accounts, junctions literals) and generate.mjs (cast, stores).

- auth.users seeded: 7 (OWNER1, OWNER3, ADMIN_B2, ADMIN_B3, MEMBER_B1, MEMBER_B2B3, UNRELATED); no OPERATOR. Emails `apbm003-<handle lowercase>@example.invalid`.
- user_roles: 7 × member (explicit insert, run.mjs). profiles: 7 (explicit insert, full_name 'SYNTHETIC <HANDLE>').
- accounts 3: A owner OWNER1; B owner OWNER3; C owner UNRELATED.
- businesses 5: A1 (acct A), B1, B2, B3 (acct B), C1 (acct C); pharmacy_name 'SYNTHETIC STORE <X>'; state AL.
- user_businesses 8:

| user | store | role |
|---|---|---|
| OWNER1 | A1 | admin |
| OWNER3 | B1 | admin |
| ADMIN_B2 | B2 | admin |
| ADMIN_B3 | B3 | admin |
| MEMBER_B1 | B1 | member |
| MEMBER_B2B3 | B2 | member |
| MEMBER_B2B3 | B3 | member |
| UNRELATED | C1 | admin |

- Visible stores per identity (my_business_ids = junction ∪ owned-account stores, 0048): OWNER1 {A1}; OWNER3 {B1,B2,B3}; ADMIN_B2 {B2}; ADMIN_B3 {B3}; MEMBER_B1 {B1}; MEMBER_B2B3 {B2,B3}; UNRELATED {C1}.
- Admin capability (owner or is_admin_of): OWNER1 A1; OWNER3 B1,B2,B3; ADMIN_B2 B2; ADMIN_B3 B3; UNRELATED C1; MEMBER_B1 none; MEMBER_B2B3 none.
- raw_user_meta_data carries only full_name (run.mjs createUser user_metadata) — no role key.
- Deterministic ids: uid(name) = SHA-256('APBM003_SYNTHETIC_V1:'+name) formatted; identical on SCRATCH and DEV; auth uuids are per-run.
