# DEV apply checkpoint — migrations 0053–0060 (APBM007A v1.0, run apbm007a_e2_r01)

**Status: READY FOR SQL REVIEW. NOT APPLIED. DEV APPLY HELD until the SQL review.** One checkpoint for the eight files together. Engineering has made no write to DEV. Prepared 12 November 2026 by the engineering seat; revised the same evening for the Director's backup ruling (option B).

## 1. What is being applied

Target: shared DEV, project reference `yrsuwikjnbmvpznrgydb` (database URL and credentials are in OwedBook's ignored `.env.local`; none is recorded here). Forward only. No replay of `0001`–`0052`, no reset.

Source: OwedBook checkout `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`, branch `apbm-007a`, base commit `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694`. The eight files are new and uncommitted; they are pinned by content hash here and in `migration-inventory.json`. Payment Portal base commit `c89572a45210e7d6f098c2878cfabe9a1c5326f1` (no SQL in the portal is run; its two legacy SQL files stay out of every setup path).

| Order | File | SHA-256 |
|---|---|---|
| 1 | `supabase/migrations/0053_privilege_hardening.sql` | `c79b20d48eaa0b4907a2733da7ec3025ab8eaa6ccc218679b88665b340b0239e` |
| 2 | `supabase/migrations/0054_store_identifiers.sql` | `a2fd2ba1e1f58cb455325921c481011f3942d994ae3abe1a5e639fa2447c37ae` |
| 3 | `supabase/migrations/0055_billing_mirror.sql` | `3059cd2f81c4bdfef5fb829908cabb065ec31ae70d2b8744b1d1ad1e2cba8fea` |
| 4 | `supabase/migrations/0056_registration.sql` | `f64e70f804923f2376a49dc5d3d0751721d04c545f66410f987c2bc58176f172` |
| 5 | `supabase/migrations/0057_operations_events.sql` | `dd8d844b7c04cd52def51a17e7b3ee9cb5b8a60eb6b3f4159e696cb3c0df3281` |
| 6 | `supabase/migrations/0058_provisioning.sql` | `09464fe4c0feb45e82a79ce16e0a84c5846f28eef250b29c472556ce508c6126` |
| 7 | `supabase/migrations/0059_handoff_codes.sql` | `33462cdaef2e466b68575c8c31a20f682c8af3438f8267c67b4f5974237394b7` |
| 8 | `supabase/migrations/0060_billing_reads.sql` | `85e9715e9faa5cb1b52981b83d7467fcc817a91e3d35d8f247a841e0be1940a6` |

Each file runs in its own transaction and ends with a catalogue assertion that fails the file if a privilege or object is not as intended. A failure leaves DEV at the last fully applied file.

What changes for existing data: nothing is deleted. `0055` adds columns to `subscriptions` and sets `origin = 'synthetic_seed'` on exactly the three APBM003 fixture rows (three audit rows result). `0054` makes `ncpdp` nullable without touching a value. Everything else is new objects, policy and privilege changes.

Intentional behaviour changes on DEV after apply (RA-3), so that nobody reads them as faults: a store admin can no longer UPDATE a store through the data API; `subscriptions` and `admin_billing_status` become owner-only; `admin_stores` omits `subscription_status` for non-owners; `anon` loses its grants on tenant tables.

## 2. Current DEV state (read-only, 12 November, `dev-preconditions.json`, `catalog-before-at-0052.json`)

| Check | Result |
|---|---|
| Ledger | 52 rows, last `0052_system_config.sql`; names and checksums equal the first 52 inventory entries (verifier `--manifest … --through 52` passed) |
| Catalogue fingerprint before apply | `e2f4ab8b2ec2ef0195c3412a01064d869374682c59e656942e92d337ec23e186` — the runner refuses to apply if DEV no longer matches it |
| NPI inventory | 5 stores, 0 duplicates, 0 null |
| `business_update_admin` policy | present (the migration requires it) |
| Customer store updates recorded in the audit log | 0 — no customer session relies on the policy being dropped |
| `subscriptions` | 3 rows, 0 Stripe-linked, 3 of 3 exact fixture matches, no account with two current rows |
| Name collisions with the new tables, indexes, functions, or a `handoff` schema | none |
| Owners with more than one account | 0 |
| `auth.sessions` readable by the migration owner role | yes |
| DEV versus SCRATCH catalogue at `0052` | columns, tables, policies, functions, constraints, indexes, triggers and enums identical. DEV has three extra default-privilege rows for objects created by `supabase_admin`; the migrations create objects as `postgres`, so they do not apply |

## 3. Rehearsal on SCRATCH (`../../E2/r01/`, project `ihgcsrypblqkwommrkgj`, distinct cluster)

| Cycle | Result |
|---|---|
| Fresh replay `0001`–`0060` | PASS |
| Forced-by-accident partial failure at `0059`, then forward resume | Runner stopped cleanly with 58 committed; resumed and applied `0059`–`0060`. Cause was the reset tool, since fixed; the migration was not changed |
| Upgrade: reset to `0052`, seed as on DEV, forward apply `0053`–`0060` | PASS. Catalogue assertions passed in every file |
| Preservation across the upgrade | 16 pre-007A tables byte-identical before and after; same Auth user set; 43 old indexes kept, 18 added; 3 audit rows added |
| Real-user access and audit proof | 329 checks PASS, including the RA-3 denials |
| 007A database proof | 82 checks PASS: handoff bindings and races, per-session sign-out, NPI reservation, exactly-once provisioning, mirror, grace, access state |
| Seed verification with attack | PASS; content hash identical whether the migration or the seed marks the fixtures |
| Portal server code against the real `0060` schema | 14 of 15 integration checks passed; the fifteenth asserted a test stub (see `../../E2/r01/PROGRESS.md`, incident) |

## 4. Backup and recovery — Director disposition: option B accepted; restore NOT PROVEN

**Ruling (Tony, 12 November 2026, recorded in `APBM_RULINGS.md`):** for this synthetic DEV delta the Director accepts the existing logical export, the SCRATCH upgrade and preservation evidence and the forward-recovery proof. Option A (install `pg_dump`, dump, restore-rehearse) was cancelled. **Restore is NOT PROVEN, and that is explicitly accepted for this apply checkpoint.**

What exists:

| Item | State |
|---|---|
| Private logical export of DEV | Taken read-only on 12 November: the 17 `public` tables and the migration ledger, 1,733 rows, as compressed JSON at an owner-only path outside every repository. Receipt with size and SHA-256: `dev-logical-export-receipt.json`. The content is not in this package |
| What the export covers | Row content of `public` tables; the ledger's names, checksums and apply times; the list of Auth user IDs |
| What it does NOT cover | Auth users' data, password hashes and sessions; roles; grants and default privileges; functions, policies, triggers and indexes as restorable objects; the event trigger; any other schema. It is not a `pg_dump` and cannot be replayed by a restore tool |
| Full dump | Not taken. `pg_dump` 17 is not installed on this VM and, by ruling, will not be |
| Restore rehearsal | **Not performed, full or partial. NOT PROVEN.** APBM-003's undemonstrated full restore stays a carried limitation |
| Forward recovery | Proven on SCRATCH: a file that fails rolls back alone; the runner stopped cleanly at `0059` with 58 committed and resumed forward to `0060` |
| Preservation | Proven on SCRATCH across the upgrade from a seeded `0052`: 16 pre-007A tables byte-identical, same Auth user set, all old indexes kept |

Recovery design, unchanged: forward only. The files are additive. No step clears the ledger, disables RLS or deletes a store. If DEV data were ever damaged beyond what a forward fix can repair, the logical export allows row content to be compared or re-entered by hand; it does not give a one-command restore.

## 5. The exact command (you run it, or delegate it explicitly)

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
export RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR="$PWD/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/apply/dev-0053-0060"
export APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb
node scripts/apply-forward.mjs apply \
  --manifest "$APBM_EVIDENCE_DIR/migration-inventory.json" \
  --before   "$APBM_EVIDENCE_DIR/catalog-before-at-0052.json"
```

The runner refuses to start if any migration file differs from the manifest, if DEV's catalogue differs from the recorded fingerprint, if the ledger is not an unchanged prefix, or if another runner holds the lock. It writes a receipt `forward-apply-<time>.json` into the same folder. Expected last line: `Committed 0060_billing_reads.sql`.

If it stops part-way: do not retry blindly and do not edit the ledger. Send me the receipt name; the recovery is a forward resume of the same command after the cause is understood.

## 6. Verification after apply (Engineering, read-only plus the smallest authenticated smoke)

1. Ledger shows 60 rows equal to the manifest; catalogue recorded.
2. Preservation snapshot compared with `preserve-dev-before-at-0052.json`: pre-007A tables unchanged, same Auth users, old indexes kept.
3. Grants and policies as asserted; trigger `handle_new_user` unchanged.
4. Authenticated smoke with three seeded cast identities, using sessions minted without touching their passwords: owner reads one `subscriptions` row, store admin and member read none; a store update is denied; `admin_billing_status` is owner-only; `store_access_state` and `owner_billing_overview` answer correctly. About three sessions and no data change.

Unexpected drift stops all dependent work.

## 7. Not part of this checkpoint

Sample-claims loading, the integrated two-app proof, deployment and independent QA each keep their own release.

## 8. APPLY RESULT — applied 12 November 2026, 18:52 Asia/Dhaka (12:52 UTC)

**Authority:** the Director delegated the apply to the engineering seat ("DIRECTOR — RELEASE DEV APPLY, APBM007A 0053–0060"), for project `yrsuwikjnbmvpznrgydb`, scope the eight migrations pinned in `APPLY_REVIEW_r01` (ZIP SHA-256 `3bcfb74217093eb82479f83914b8c80c6a46a07de15d0ab2a35a3cd06ba0e015`), option B standing, restore NOT PROVEN and accepted.

**Checks immediately before execution — all matched; no baseline was regenerated:**

| Check | Result |
|---|---|
| Review ZIP hash equals the release | yes |
| The eight SQL files, the runner and the changed helpers on disk equal the ZIP's copies | yes, none differs |
| Inventory and catalogue receipt on disk equal the ZIP's copies | yes |
| Target identity | `yrsuwikjnbmvpznrgydb`, through the repo guard |
| Ledger | 52 rows, an unchanged prefix of the manifest |
| Live DEV catalogue fingerprint | `e2f4ab8b…23e186`, equal to the recorded one (`catalog-live-precheck-at-0052.json`) |
| Migration preconditions | re-read and unchanged |

**Execution:** the exact command in section 5, run once. Exit 0. Receipt `forward-apply-1794487961050.json`: status PASS, eight files committed in order, last committed `0060_billing_reads.sql`, 12:52:24–12:52:41 UTC. No retry, no reset, no ledger edit.

**Final ledger position:** 60 rows; every name and SHA-256 equals the manifest (`dev-postconditions.json`).

**Verification after apply (read-only unless stated):**

| Area | Result | Receipt |
|---|---|---|
| Catalogue | 23 tables, 14 policies, 36 functions; fingerprint `fab5247f…952e6a`. Columns, tables, policies, functions, constraints, indexes, triggers and enums identical to the rehearsed SCRATCH result | `catalog-after-at-0060.json`, `catalog-dev-vs-scratch-at-0060.json` |
| Preservation | 16 pre-007A tables byte-identical before and after; same 16 Auth users; all 43 old indexes kept, 18 added; audit rows 1,364 → 1,367 (the three fixture subscriptions marked synthetic) | `preserve-dev-comparison.json` |
| Grants | No customer INSERT/UPDATE/DELETE on `businesses` (SELECT kept); 0 residual TRUNCATE/REFERENCES/TRIGGER grants; 0 `anon` grants on tenant tables; 0 customer grants on the six new tables; `handoff.codes` unreachable, also for the service role directly | `dev-postconditions.json` |
| Functions | 15 service-only functions: none executable by `anon` or `authenticated`, all executable by the service role; the two customer reads executable by `authenticated` only; the three trigger functions no longer directly callable | same |
| Policies | `business_update_admin` gone; `subscriptions` has only `subscription_select_owner` | same |
| Sign-up trigger | `handle_new_user` body still equals `0049`; trigger enabled; not executable by customers | same |
| RLS | Enabled on all 23 public tables and on `handoff.codes` | same |
| Data | 3 subscriptions, all `synthetic_seed`; 5 stores, NPI unique index present, `ncpdp` nullable with no value changed; the six new tables and `handoff.codes` empty | same |
| Authenticated smoke | 24 checks PASS with OWNER3, ADMIN_B2 and MEMBER_B1: owner reads one subscription row, admin and member none; store updates denied and stores unchanged; billing status and overview owner-only; `admin_stores` without the billing field for the store admin; member access state without billing detail; service-only functions and new tables refused; existing claims, store-scope and member reads still work | `dev-authenticated-smoke.json` |

**Effects of the verification:** 3 sessions minted from admin-generated one-time tokens (no password read or changed, no email), 3 local sign-outs, 0 identities created. The audited read functions appended their ordinary audit rows. One UPDATE was attempted per test identity and was denied.

**Restore:** NOT PROVEN, accepted by the Director for this checkpoint (section 4). Nothing was installed, dumped or restored.

**Not done, still held:** sample loading, integrated two-app proof, deployment (none before 007B completion), independent QA.
