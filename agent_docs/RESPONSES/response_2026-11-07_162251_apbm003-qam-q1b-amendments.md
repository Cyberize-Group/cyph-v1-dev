# APBM-003 QAM Q1b — amendments applied, credential reconciliation, generator + checker (Claudy, QA Executor)

Date 2026-11-07 16:25 +06 · branch `qa/apbm-003` · HEAD = candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1` (unchanged) · state → `Q1 AMENDED — AWAITING QA LEAD BINDING`. No Q2 execution, no browser run, no authenticated probe, no product/test edit, no Git mutation, `:3137` untouched, inherited dirty files preserved, cast values never opened in any output.

## Part A — amendments
**New plan SHA-256 after AM-1…AM-6:** `e8c4d5ac46635c2054e2d61073197db695ecd542a6281d4e561b0a6854bce061` (pre-amendment `8bc53eba9a80cb716c954c2bd83d149d22650c17e0694901b549cd96aaaff8a9`). Plan status row left as `DRAFT (Q1)` on purpose (Lead said "these edits and nothing else"); the Lead binds via §2.

§8 table as written into the plan:

| # | Exact edit (before → after) | Supplied by / date | Applied by / date | Material? |
|---|---|---|---|---|
| AM-1 | §"Independence rule", appended the derivation-artifact sentence (`evidence/derivations/01/<value>.md` before grading; missing/receipt-derived → `ADJUDICATE`) | Friday / 2026-11-07 | Claudy / 2026-11-07 16:10 +06 | no |
| AM-2 | T-37: removed "[+1 `admin_stores(id)` … verify from source before grading]" and "(derive from `AuditScreen.tsx` at Q2 entry)" → "; all per-operation counts fixed in `evidence/derivations/01/ui_dispatch_counts.md` from the component source at `308247a` before T-33 starts; no count is set or changed after a DEV observation" | Friday / 2026-11-07 | Claudy / 16:10 +06 | no |
| AM-3 | T-01: "≥ 36 suites / 178 … (count derived by listing `src/__tests__/**` files: 39)" → "suites = number of test files under `src/__tests__/**` at `308247a` (counted at Q2 entry, `evidence/derivations/01/board.md`); tests = Jest's reported total; **0 skipped, 0 failed**; record both. Engineering's 39/196 and 36/178 are context, not the expected value." | Friday / 2026-11-07 | Claudy / 16:10 +06 | no |
| AM-4 | T-32: "…`127.0.0.1:3137` after stopping Cody's process **only with Director consent** (otherwise port 3138)" → "QA serves on **`127.0.0.1:3138`**. Cody's `:3137` process is not stopped, signalled or inspected beyond `ss`. Any change … Director instruction in `QAM_APPROVAL.md` §3." Header identity row 3137→3138; Writes-required LOCAL row gains the clause; T-41 "curl against the QA server on `127.0.0.1:3138` (never `:3137`)" | Friday / 2026-11-07 | Claudy / 16:10 +06 | no |
| AM-5 | §5 appended: `ro-sql.sh` SQL-side ref assertion `yrsuwikjnbmvpznrgydb` + `SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY` + `BEGIN READ ONLY`; failure = `STOP-IDENTITY`; SCRATCH shim asserts `ihgcsrypblqkwommrkgj`; both attacked once, refusal logged `evidence/identity/02/` | Friday / 2026-11-07 | Claudy / 16:10 +06 | no |
| AM-6 | §1 AC-404 "DEV definition yes; DA-2 read-only only" → DEV definition + read-only `GET /auth/v1/settings` (T-31); SCRATCH live signup (expect rejection) **only if** §3 states SCRATCH signup OFF, else `BLOCKED — owner Director`, never N/A; tests column +T-31d; T-31 gains clause (d) | Friday / 2026-11-07 | Claudy / 16:10 +06 | no |

Every replacement was an exact-string match asserted to occur once; no other plan text changed. Remaining `3137` mentions in the plan are all "Cody's `:3137` untouched" clauses.

## Part B — credential reconciliation (key names only; see `QAM/evidence/env/01/credential_mapping.md`)

**B.1 declared keys → consuming tests**

| Key | Consumers | Flag |
|---|---|---|
| `QA_SCRATCH_DB_URL` | T-10…T-24 | — |
| `QA_SCRATCH_SUPABASE_URL` | T-10/12/23/24 (shim), T-17–T-20 | — |
| `QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY` | T-17–T-20, T-23/24 | ENTRY §4 name; APPROVAL §2 says `QA_SCRATCH_PUBLISHABLE_KEY` |
| `QA_SCRATCH_SECRET_KEY` | T-12, T-17, T-21, T-23 | SCRATCH only |
| `QA_DEV_SUPABASE_URL` | T-31c, T-32, T-33–T-41 | — |
| `QA_DEV_SUPABASE_PUBLISHABLE_KEY` | T-31c, T-32, T-34 | ENTRY §4 name; APPROVAL §2 says `QA_DEV_PUBLISHABLE_KEY` |
| `QA_DEV_DB_URL` | T-30, T-31a/b, T-35, T-36, T-37 | in §2 only, not ENTRY §4 → AM-7b |
| `QA_<HANDLE>_EMAIL/_PASSWORD` ×7 | T-33–T-40 (DEV) | DEV identities; SCRATCH tokens come from the T-12 seed's own cast |
| `QA_STAGING_URL` | **none** | declared, unused (no STAGING) → optional |

**B.2 source mapping** (all `.env.local` unless stated): `RLS_REPLICA_SUPABASE_URL`→`QA_SCRATCH_SUPABASE_URL` · `RLS_REPLICA_PUBLISHABLE_KEY`→`QA_SCRATCH_SUPABASE_PUBLISHABLE_KEY` · `RLS_REPLICA_SECRET_KEY`→`QA_SCRATCH_SECRET_KEY` · `RLS_REPLICA_DB_URL`→`QA_SCRATCH_DB_URL` (pooler host; ref from user `postgres.<ref>`) · `APBM_DEV_SUPABASE_URL`→`QA_DEV_SUPABASE_URL` · `APBM_DEV_PUBLISHABLE_KEY`→`QA_DEV_SUPABASE_PUBLISHABLE_KEY` · `APBM_DEV_DB_URL`→`QA_DEV_DB_URL` (**duplicated in `.env.local` with two different hosts, direct vs pooler** — generator refuses `DUPLICATE_CONFLICT`; Director chooses `--dev-db-source APBM_DEV_DB_CONNECTION_STR` or `APBM_DEV_DB_POOL`) · cast `identities.<HANDLE>.email/password` (0600 `/tmp` file; `projectRef` must equal DEV) → `QA_<HANDLE>_EMAIL/_PASSWORD`. Not used: `NEXT_PUBLIC_*`, `SUPABASE_SECRET_KEY`, `APBM_DEV_SECRET_KEY`.
**GAP:** existing `.env.qa.local` (mtime 15:51 +06, mode **664**, 139 B) holds `ADMIN_USER/ADMIN_PASS/MEMBER_USER/MEMBER_PASS` — no declared key; left untouched; the Director's generator run needs `--force` to replace it (and writes 0600).

**B.3 generator** `QAM/AUTOMATION/make-qa-env.mjs` — NOT run against real sources. Validates everything first (`MISSING_KEY`, `EMPTY_KEY`, `DUPLICATE_CONFLICT`, `REF_UNRESOLVED`, `REF_MISMATCH expected=… got=…`, `CAST_REF_MISMATCH`, `CAST_MISSING_HANDLE`, `CAST_EMPTY_FIELD`, `EXISTS`), exits non-zero with the list before touching any file; temp file 0600 + fsync + atomic rename; `--force` skips only the exists check; errors never carry a value (JSON parse errors are swallowed to a code; unexpected exceptions print only the class). **Self-test 31/31 PASS** against synthetic mkdtemp fixtures (60 planted synthetic values, none in stdout/stderr): missing key, wrong ref, duplicate conflict, existing file byte-identical on failure even with `--force`, EXISTS without `--force`, `--force` overwrite, mode 0600, unparsable cast, disallowed source, no temp leftovers. Evidence `evidence/env/01/make-qa-env_selftest.txt`.
Director command (after reading the header comment):
```
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
node agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/make-qa-env.mjs --cast /tmp/apbm003-dev-v2-cast-20261107T080333Z-1347924.json --dev-db-source APBM_DEV_DB_CONNECTION_STR --force
bash agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/AUTOMATION/check-qa-env.sh
```

**B.4 checker** `QAM/AUTOMATION/check-qa-env.sh` run now against the current file:
```
IGNORED yes
UNTRACKED yes
KEYS present=4 required=21
MISSING QA_SCRATCH_SUPABASE_URL … QA_UNRELATED_PASSWORD   (all 21)
UNDECLARED ADMIN_PASS ADMIN_USER MEMBER_PASS MEMBER_USER
RESULT FAIL
exit=1
```
Ignored by `.gitignore:28` (`.env*.local`), untracked by exit code. Key schema fails → PF-4.6 stays FAIL until the generator runs.

**B.5 AM-7 draft** — `QAM/HANDOFFS/Q1b_AM-7_DRAFT.md`, not applied. AM-7a PF-3.6: "… not read, hashed or copied by any QA helper" → "…, **except `AUTOMATION/make-qa-env.mjs` when run by the Director** (named exemption; Executor runs it only in `--self-test`; output = key names, source key names, refs, codes)". AM-7b PF-4.6 expected: "ignored; untracked; keys per `QAM_ENTRY.md` §4" → "**ignored and untracked by exit code** (`check-qa-env.sh`); **keys per `QAM_ENTRY.md` §4 + `QA_DEV_DB_URL`** (read-only use declared); `QA_STAGING_URL` optional while no STAGING; any undeclared key = FAIL". AM-7c (consequential) plan §5 `STOP-ENV` widened to "not ignored, missing or undeclared keys, or `check-qa-env.sh` ≠ PASS". **Lead must also settle the §4-vs-§2 publishable-key name discrepancy**; helpers use the §4 names.

**B.6 SQL needs** — SCRATCH SQL: T-10–T-24. SCRATCH secret key: T-12, T-17, T-21, T-23. DEV SQL (read-only, `ro-sql.sh`): T-30, T-31a/b, T-35, T-36, T-37. Template leftovers: none among these (each anchored to an AC). Declared-but-unused: `QA_STAGING_URL` (orphans nothing new; AC-701–703 already untestable) and the `OPERATOR` mention (R-08).

## Genuinely missing inputs
| Input | Purpose | Owner |
|---|---|---|
| Run `make-qa-env.mjs` (`--cast`, `--dev-db-source`, `--force`) | produce the 21 declared keys | Director |
| Choice of DEV DB source (direct vs pooler) | resolve the duplicate `APBM_DEV_DB_URL` | Director |
| Nothing else | — | — |
Release conditions already listed in §2 (R-10 confirmation, AM-6 SCRATCH signup posture, §C errata R-2/R-6, §3 statement) are decisions, not inputs.

## Separation
- **Credential setup items:** GAP file with undeclared keys and mode 664; duplicate `APBM_DEV_DB_URL`; `QA_DEV_DB_URL` missing from ENTRY §4 (AM-7b); §4/§2 name discrepancy; `QA_STAGING_URL` unused.
- **Product defects:** unchanged from Q1 — DemoMarker "Demo · mock data" and BillingScreen "no real charge … in this demo" in real mode (AC-601/602/902, outside A01; copy amendment recommended by the Lead). Nothing new found in Q1b (no execution happened).

## Deliverables
| Path | Identity |
|---|---|
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md` (AM-1…6 applied) | SHA-256 `e8c4d5ac46635c2054e2d61073197db695ecd542a6281d4e561b0a6854bce061` |
| `…/QAM/AUTOMATION/make-qa-env.mjs`, `check-qa-env.sh`, `README.md` (inventory) | helpers; self-test 31/31; checker exit 1 on GAP file |
| `…/QAM/evidence/env/01/{credential_mapping.md,check-qa-env_current.txt,make-qa-env_selftest.txt,env_qa_local_stat_names_only.txt}` | names-only evidence |
| `…/QAM/HANDOFFS/Q1b_AM-7_DRAFT.md` | AM-7 for Lead approval |
| `…/QAM/QAM_STATE.md` | entry → `Q1 AMENDED — AWAITING QA LEAD BINDING` |
| `agent_docs/SESSIONS/session_2026-11-07.md` | Q1b entries |
| `agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/QAM/HANDOFFS/APBM-003-CYBER-PHARMA_Q1b_REVIEW_01.zip` + `/home/moose/Downloads/APBM-003-CYBER-PHARMA_Q1b_REVIEW_01_20261107T162618.zip` | 17 members, SHA-256 `f26f407f7d1a641f890720fbf67adb100cb90ad67ea0408396ca0cf9c9473ed9`, privacy scan 0 hits (fixture 5/5, control 0) |
