# Pre-commit review: both repos on `repair/apbm-007b-manual-qa`

**Verdict: BLOCKED, on one trivial whitespace error.** It becomes READY TO COMMIT once that is fixed (see the end). I found no secrets, debris or unrelated changes. This review was read-only: nothing was staged, committed, deleted or edited, and no migration was touched. The only writes are this report and its session-log entry.

## Scope reviewed

| Repo (HEAD) | Tracked modified | Untracked | Staged |
|---|---|---|---|
| OwedBook (`64295a7`) | 25 files (+450/−70) | 55 files | none |
| Portal (`0443fda`) | 33 files (+741/−162) | 12 files | none |

The scan covered every added line of the tracked diffs and every untracked file, including the evidence JSON, reports, session logs and `.env.example`.

## Findings by file

| # | File:line | Finding | Class | Blocks? |
|---|---|---|---|---|
| 1 | Portal `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/MANUAL_QA/TESTER_PLAN.md` (end of file) | Extra blank line at the end of the file. `git diff --check` will flag "new blank line at EOF" once the file is staged | whitespace | **yes (trivial)** |
| 2 | OwedBook `.env.example:8–9` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…` and `SUPABASE_SECRET_KEY=sb_secret_…` | **placeholders**, already at HEAD (unchanged context lines). They match no `.env.local` value. New lines in both `.env.example` files are commented variable names only | no |
| 3 | OwedBook `agent_docs/RESPONSES/response_2026-11-19_173752_manual-qa-repair-plan.md:28` | The word "Password" in prose about the Profile form rules; no value | false positive | no |
| 4 | OwedBook `agent_docs/RESPONSES/response_2026-11-19_121500_walkthrough-runtime-inspection.md:37` | A shell command that *compares* `stripe listen --print-secret` with the local config; no value present | command text, no secret | no |
| 5 | Portal `TESTER_PLAN.md` roles table, `STAGING_*` sheets | The Director's work mailbox and its `+alpha01-…` aliases, plus `no-reply@cyberizedev.com` and `support@pharmacybooks.com` | intentional tester or public addresses (the mailbox already appears in tracked `stark-deploy.yaml`) | no. Director's call |
| 6 | Many records and tests | Project refs `yrsuwikjnbmvpznrgydb` (DEV) and `ihgcsrypblqkwommrkgj` (SCRATCH) | public identifiers (also in the Supabase URLs) | no |
| 7 | Tests (both repos), `scripts/apbm007b/sql-proof.mjs` | UUIDs such as `1111…`/`aaaa…`/`0000…`; `6a6a650d-…` reused from the committed `LiveStaffPanel.hydration.test.tsx`; example emails (`example.invalid`, `.test`, `tony@stark.com`); `invoice.invalid` URLs | **synthetic fixtures** | no |
| 8 | OwedBook `EVIDENCE/apply/{dev-apply-0070,dev-apply-0071,manual-qa-0071-scratch}/catalog.json` | Byte-identical to each lane's `catalog-after.json` | the committed lane convention (`dev-apply-r05` holds the same trio) | no |
| 9 | OwedBook `EVIDENCE/apply/manual-qa-0071-scratch/sql-proof-scratch.stderr.txt` | 0 bytes | an intentional record of an empty stderr; optional to keep | no |
| 10 | OwedBook `scripts/apbm007b/sql-proof.mjs` (added line 77 of the diff) | `console.log(JSON.stringify(…))` | the script's intended summary output | no |

**Pattern sweep (every reviewed line): no matches for**
- Stripe secret and restricted keys, `whsec_`, Resend keys, `sb_secret_` values, JWTs, private keys and GCP keys;
- `postgres://` URLs, pooler and database hostnames;
- bearer tokens, `token_hash=` / `access_token` / `refresh_token` values, `/auth/v1/verify` links;
- cookie headers and values, OTP codes;
- Stripe hosted invoice, checkout or billing-portal URLs;
- real Stripe object ids.

**Debris:** none.
- The ignored files stay ignored: `.env.local`, `CLAUDE.local.md` (OwedBook), `.next/`, `node_modules/`, `test-results/`, `tsconfig.tsbuildinfo`, `next-env.d.ts`.
- No `.only`, `fit`, `debugger` or `TODO`/`FIXME` was added.

**Unrelated changes:** none. Every tracked change belongs to the APBM-007B manual-QA repairs (R1–R10, F1–F6) or their records. The OwedBook untracked set also includes earlier campaign records never committed: the 19 Nov DEV 0070 preflight and apply lanes (`dev-preflight-0070/`, `dev-apply-0070/`), the 19 Nov responses, and `session_2026-11-19.md`. They belong to the same campaign; say so in the commit message.

**Whitespace:**
- `git diff --check HEAD`: clean in both repos (exit 0).
- Untracked files, checked the same way: only finding 1.

## Migration 0071

| Check | Result |
|---|---|
| File SHA-256 | `9a91230710d5895c7bf1c6add346d83e9ffca22199e17910a3c48ec052497955` |
| 71-entry manifest (`manifest-0071.json`) | same hash |
| DEV ledger (read-only transaction, rolled back) | 71 rows; last `0071_007b_owner_settings_audit.sql`; recorded sha256 **identical**; applied 2026-11-20T03:37:36Z |
| DEV receipt `forward-apply-1795145858189.json` | PASS, committed exactly 0071 |
| 0001–0070 | no diff against HEAD; 0071 is the only untracked migration |

## Retest status

- **The final repair retest is PENDING.** Tester plan section F (F-01…F-16) has no Actual or Result entries.
- The passing jest suites, typecheck and builds are automated checks only. They are **not** recorded as manual passes anywhere.
- The only manual results recorded are the observations you reported on 20 Nov, labelled as such.

## To become READY TO COMMIT

Remove the extra trailing blank line from the tester plan. The command below keeps a single final newline:

```bash
f=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/MANUAL_QA/TESTER_PLAN.md
printf '%s\n' "$(cat "$f")" > "$f.tmp" && mv "$f.tmp" "$f"
```

Then commit with the commands from the 13:03 report, after checking `git status`.
