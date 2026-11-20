# Walkthrough aliases allowlisted + Gate D handoff additions

## Allowlist (local `.env.local`, git-ignored)

Aliases: `moose+alpha01-owner@`, `-member@`, `-admin@`, `-buyer@cyberizegroup.com`.

| File | Line | Entries | Added |
|---|---|---|---|
| OwedBook `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/.env.local` | 50 | 6 → 9 | owner, admin, buyer (member already present) |
| Portal `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/.env.local` | 42 | 5 → 9 | all four |

Both: original entries kept in order, no duplicates, all entries valid, every other line byte-identical, mode unchanged. No wildcard, no source change, no mail sent, no process restarted.

**Restart (no rebuild; `MAIL_ALLOWLIST` is read at runtime):** stop each `next start` with Ctrl+C, then

    cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && npm start
    cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 && npm start -- --port 3001

## Handoff

Portal `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/GATE_D_HANDOFF.md` — new §5 (22 lines appended; §1–§4 unchanged; SHA-256 `b91cbe4c…` → `acc1d32d…`). Portal `CHANGELOG.md` entry 2026-11-19 08:54 UTC.

§5 records: (1) open-recipient policy implemented and independently verified before stakeholder Alpha; (2) Supabase Auth Site URL / redirect allowlist for `https://owedbook.alpha.cyberizedev.com` and `https://payment.alpha.cyberizedev.com`; (3) tester guide: plus-alias inbox check, separate browser session per role.

**Flag:** the alpha domains differ from the `staging` origins frozen in both apps' `src/lib/appIdentity.ts` (`owedbook.cyberizedev.com`, `owedbook-payment.cyberizedev.com`). `siteOriginMatches()` fails closed on a mismatch, so serving on the alpha domains needs an approved source change in both apps (or matching domains). Recorded in §5.2.
