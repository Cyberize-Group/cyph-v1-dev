# Credential reconciliation — KEY NAMES ONLY (Q1b, 2026-11-07, Claudy)

No value was printed, hashed, copied or compared. Sources inspected: key names in `.env.local` (first field before `=`), URL **hosts** of the DB/Supabase URLs (to classify ref derivation), the cast file's JSON **structure** (top-level keys, handle names, field names). The current `.env.qa.local` (mtime 2026-11-07 15:51 +06, mode 664, 139 bytes) holds `ADMIN_USER`, `ADMIN_PASS`, `MEMBER_USER`, `MEMBER_PASS` — none declared → **GAP**, left untouched.

## 1. Declared QA_* keys → consuming tests
| Key | Declared in | Consumed by | Note |
|---|---|---|---|
| `QA_SCRATCH_DB_URL` | ENTRY §4, APPROVAL §2 | T-10, T-11, T-12, T-13, T-14, T-15, T-16, T-17, T-18, T-19, T-20, T-21, T-22, T-23, T-24 | all SCRATCH SQL; shim asserts ref before destructive steps (AM-5) |
| `QA_SCRATCH_SUPABASE_URL` | ENTRY §4, APPROVAL §2 | T-10/T-12/T-23/T-24 (harness prefix shim), T-17, T-18, T-19, T-20 (PostgREST/RPC with tokens) | ref `ihgcsrypblqkwommrkgj` |
| `QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY` | ENTRY §4 (§2 says `QA_SCRATCH_PUBLISHABLE_KEY`) | T-17, T-18, T-19, T-20 (token login), T-23/T-24 (shim) | **name discrepancy §4 vs §2** |
| `QA_SCRATCH_SECRET_KEY` | ENTRY §4, APPROVAL §2 | T-12 (`seed:run` harness), T-17 (post-denial verification read), T-21 (`auth.admin.createUser` on SCRATCH), T-23 (`rls:prove`/`audit:prove` harness) | SCRATCH only; never DEV; never in client env (T-32) |
| `QA_DEV_SUPABASE_URL` | ENTRY §4, APPROVAL §2 | T-31c, T-32 (build env), T-33–T-41 (app) | ref `yrsuwikjnbmvpznrgydb` |
| `QA_DEV_SUPABASE_PUBLISHABLE_KEY` | ENTRY §4 (§2 says `QA_DEV_PUBLISHABLE_KEY`) | T-31c (`apikey`), T-32 (build env), T-34 (curl with session token) | **name discrepancy §4 vs §2** |
| `QA_DEV_DB_URL` | APPROVAL §2 (NOT in ENTRY §4; recon R-4) | T-30, T-31a/b, T-35 (audit delta), T-36 (no-mutation hashes), T-37 (per-operation counts) | read-only use declared; `ro-sql.sh` fence (AM-5); AM-7b adds it to PF-4.6 |
| `QA_<HANDLE>_EMAIL` / `QA_<HANDLE>_PASSWORD` ×7 | ENTRY §4, APPROVAL §2 | T-33, T-34, T-35, T-36, T-37, T-38, T-39, T-40 (DEV browser/API) | **DEV identities** (cast `projectRef` = DEV). SCRATCH tokens for T-17–T-20 come from the cast the QA-shimmed `seed:run` produces in T-12 (same handles), not from these keys |
| `QA_STAGING_URL` | ENTRY §4 only | **no test** (AC-701–703 untestable; STAGING not deployed) | declared, unused → optional in `check-qa-env.sh`; generator does not write it |
| `OPERATOR` identity | ENTRY §4 mention | **no test** (R-08 cast has no OPERATOR) | not a key; informational |

## 2. Required variable → existing authorised source (by key name)
| QA key written | Source key | Source file | Ref check |
|---|---|---|---|
| `QA_SCRATCH_SUPABASE_URL` | `RLS_REPLICA_SUPABASE_URL` | `.env.local` | host `<ref>.supabase.co` = `ihgcsrypblqkwommrkgj` |
| `QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY` | `RLS_REPLICA_PUBLISHABLE_KEY` | `.env.local` | — |
| `QA_SCRATCH_SECRET_KEY` | `RLS_REPLICA_SECRET_KEY` | `.env.local` | — |
| `QA_SCRATCH_DB_URL` | `RLS_REPLICA_DB_URL` | `.env.local` | pooler host → ref from user `postgres.<ref>` = `ihgcsrypblqkwommrkgj` |
| `QA_DEV_SUPABASE_URL` | `APBM_DEV_SUPABASE_URL` | `.env.local` | host = `yrsuwikjnbmvpznrgydb.supabase.co` |
| `QA_DEV_SUPABASE_PUBLISHABLE_KEY` | `APBM_DEV_PUBLISHABLE_KEY` | `.env.local` | — (not `NEXT_PUBLIC_*`, per ENTRY §4) |
| `QA_DEV_DB_URL` | `APBM_DEV_DB_URL` (default) — **appears twice in `.env.local` with different hosts** (`db.<ref>.supabase.co` direct and `aws-1-us-east-1.pooler.supabase.com`); the generator refuses `DUPLICATE_CONFLICT APBM_DEV_DB_URL` and the Director picks `--dev-db-source APBM_DEV_DB_CONNECTION_STR` (direct host) or `APBM_DEV_DB_POOL` (pooler) | `.env.local` | either form resolves to `yrsuwikjnbmvpznrgydb` |
| `QA_<HANDLE>_EMAIL` / `_PASSWORD` | `identities.<HANDLE>.email` / `.password` for OWNER1, OWNER3, ADMIN_B2, ADMIN_B3, MEMBER_B1, MEMBER_B2B3, UNRELATED | `/tmp/apbm003-dev-v2-cast-20261107T080333Z-1347924.json` (0600; structure read only) | cast `projectRef` must equal `yrsuwikjnbmvpznrgydb` |

Not used as sources (by design): `NEXT_PUBLIC_SUPABASE_*` (ENTRY §4 forbids reuse), `SUPABASE_SECRET_KEY`, `APBM_DEV_SECRET_KEY` (no DEV secret key in QA; DEV is read-only), `ENCODED_PASSWORD`, `NEXT_PUBLIC_STRIPE_*`.

## 3. Which approved tests need SCRATCH SQL / SCRATCH secret key / DEV SQL
- **SCRATCH SQL (`QA_SCRATCH_DB_URL`):** T-10–T-24 (all of Group B). Anchors: AC-101–107, 302, 304, 105, 201–203, 303.
- **SCRATCH secret key (`QA_SCRATCH_SECRET_KEY`):** T-12 (seed), T-17 (verification read after denied writes — RETURNING is never trusted), T-21 (admin createUser probe), T-23 (`rls:prove`/`audit:prove` harness).
- **DEV SQL (`QA_DEV_DB_URL`, read-only through `ro-sql.sh`):** T-30 (AC-401/402/403/405), T-31a/b (AC-404/405), T-35 (AC-507 audit delta), T-36 (AC-403 no-mutation), T-37 (AC-304/403/504).
- **Template leftovers:** none among the SQL requirements — each row above is anchored to an AC. The only declared-but-unused inputs are `QA_STAGING_URL` (would orphan nothing: AC-701–703 are already untestable without a deployment) and the `OPERATOR` mention (R-08 excludes it).
