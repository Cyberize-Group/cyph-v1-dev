# SCRATCH identity check — 12 November 2026, 14:54 Asia/Dhaka

Read-only. Helper: `helpers_snapshot/scratch_identity.mjs`, `scratch_keys.mjs`. Result: `results/scratch_identity_result.json`. No URL, host, credential or key value recorded.

### Identity

| Check | Result |
|---|---|
| Project reference in `APBM_SCRATCH_DB_URL` | Equals the recorded `ihgcsrypblqkwommrkgj` |
| Differs from the DEV reference | Yes |
| Project reference in `APBM_SCRATCH_SUPABASE_URL` | Equals the recorded reference |
| Database system identifier | SCRATCH and DEV are different clusters |
| SCRATCH API keys | New-style publishable and secret keys; both accepted by the SCRATCH API; neither equals a DEV key |
| The four E1 test identities | Present on DEV, absent on SCRATCH |

### What SCRATCH holds now

| | SCRATCH | DEV |
|---|---|---|
| PostgreSQL | 17.6 | 17.6 |
| Public tables | 17 | 17 |
| Migration ledger | 52 rows, last `0052_system_config.sql` | Same |
| Auth users | 13 | 16 |

SCRATCH is at the same migration level as DEV, so `0053` onward can be rehearsed on it. I compared the ledger's row count and last name only, not every checksum.

### One thing that differs from your note

The SCRATCH URL is on port 6543, which is the transaction pooler, not the session pooler on 5432 that DEV uses. My read-only check worked through it. An apply rehearsal may not: transaction mode does not keep session state between statements, which migration tooling and backup tools can rely on. I recommend changing the port to 5432 before any rehearsal. The repo tooling accepts either port, so it would not catch this itself.

### Still needed for a 007A rehearsal

Nothing more from the environment file. Two items remain from earlier, both E2 work and not started:
- The tooling's evidence-path allowlist only accepts the APBM-003 module.
- The DEV block (`APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY`, `APBM_DEV_SECRET_KEY`) is needed only when the tooling runs against DEV. I did not check it in this task.


## Re-verification and full ledger comparison — 12 November 2026, 15:10 Asia/Dhaka

Helper: `helpers_snapshot/scratch_ledger.mjs`. Result: `results/scratch_ledger_result.json`. Source-set digest (names and SHA-256 of the 52 files): `dcabe2e1644ae57a1c4e449d24c0a89ce90017bafe5333c33c3e59d5e23dde80`.

### Connection and identity

| Check | Result |
|---|---|
| Connection | Opened first time, inside a read-only transaction that was rolled back |
| Project reference in the URL | Equals the recorded `ihgcsrypblqkwommrkgj`; differs from DEV |
| Database cluster | Same cluster as my earlier SCRATCH check; different from DEV |
| Host and port | Pooler host, port **6543** |

### Migration ledger against source

There is no separate manifest file in the repo, so the source side is the 52 files in `supabase/migrations`, which are unmodified at HEAD `bc4e433`. I hashed each file and compared it with the ledger row of the same name.

| Check | Result |
|---|---|
| Ledger rows | 52 |
| Source files | 52 |
| Name and SHA-256 both equal | 52 of 52 |
| In source but missing from the ledger | None |
| In the ledger but not in source | None |
| Checksum mismatches | None |
| Range | `0001_baseline_acknowledge.sql` to `0052_system_config.sql` |
| Applied on SCRATCH | 9 November 2026, 10:05–10:06 Asia/Dhaka |

SCRATCH and DEV therefore both record the same 52 migrations with the same checksums. `0053` is the next free number on both.

### The port

Most likely the edit is unsaved in the editor, or it went into a different file. Once the saved file shows 5432, I can rerun the same check; it takes a few seconds. The ledger result above does not depend on the port.


## Rerun after the port change — 12 November 2026, 15:13 Asia/Dhaka

The saved `APBM_SCRATCH_DB_URL` (file modified 15:12) now parses to the pooler on port **5432** (session pooler). Connection opened first time, read-only, rolled back. Reference equals the recorded SCRATCH reference and differs from DEV; same cluster as the earlier SCRATCH checks; ledger again 52/52 names and SHA-256 equal to source, none missing, extra or mismatched. `results/scratch_ledger_result.json` now holds this run.
