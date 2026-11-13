# Grouped action list for Tony — E1 a01, final return

One list, current at the final E1 return on 12 November 2026. Detail and numbering match `E1_REPORT.md` §4.

## Done — no action

Inbox file; hosted-portal probe and Stripe cleanup; DEV database checks; SCRATCH identity and ledger on the session pooler; Resend SMTP, sender, allowlist and revised template (your settings); OwedBook emailed sign-in.

## A1 — Decisions to route to the post-E1 review

| # | Decision | My recommendation |
|---|---|---|
| D1 | One live sign-in link per user: accept one automatic restart plus a recovery page | Accept |
| D2 | Should opening an emailed link sign in directly, given the unexplained 13:38 redemption (F-A7) | Add a confirm-button page if scanning cannot be ruled out |
| D3 | Schema default privileges: change them, or keep per-object revokes | Keep per-object revokes |
| D4 | Access-token lifetime 900 seconds | Later, separate decision |
| D5 | APA discount scope across stores | Frank |
| D6 | APBM003 cast logins: the login sheet is gone from this machine | Reset on DEV before QA, or recover the sheet |

## A2 — One question only you can answer

Did anyone open the 12:43 OWNER_1 email on a Windows device at about 13:38? If nobody did, something automated used the link.

## A3 — Optional email checks (7 of 12 emails left; none will be sent without your instruction)

- Payment Portal emailed login: the portal running on port 3001 on your side, one email with the `:3001` redirect, one click.
- The template's no-link branch: one email with no redirect.
- Link lifetime and email rate limit: tell me the saved values, or leave them unreported.

## A4 — Git, after E1 and before E2 (your commands; nothing has been run)

1. Portal lock: recommended `git -C /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 restore package-lock.json` (the committed lock equals the certified one and passes the baseline).
2. OwedBook: `.env.pilot.example` is deleted in the working tree; restore it or commit the deletion.
3. Portal `origin` is a personal GitHub account; confirm or move to Cyberize-Group.
4. Create the dedicated work branches in both repos.

## A5 — Before the tooling targets DEV (not needed for the review)

Add `APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY` and `APBM_DEV_SECRET_KEY` to OwedBook's `.env.local`, with the same values as the app's three Supabase settings.

## A6 — Optional housekeeping

- The sandbox's default portal configuration is the E1 probe one. Saving your own portal settings in the Dashboard replaces it.
- `chmod 600` on both `.env.local` files (currently 664).
- The four E1 test identities stay on DEV. Say if you want them removed; Auth-user deletion was outside the E1 release.
