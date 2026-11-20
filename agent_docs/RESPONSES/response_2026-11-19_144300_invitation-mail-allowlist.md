# Invitation mail block — diagnosis and allowlist correction (OwedBook, local)

**Recipient:** `moose+alpha01-member@cyberizegroup.com` · **UI:** "Invitation saved. Email delivery is disabled for this address in this environment."

**Cause (confirmed):** `src/server/invitationMail.ts:35` returns `blocked` only when `guardDecision` (`src/server/mailGuard.ts`) finds the normalized recipient absent from `MAIL_ALLOWLIST`. OwedBook `.env.local` line 50 had 5 valid entries, none the recipient. The guard reads `process.env.MAIL_ALLOWLIST` at runtime (not compiled into `.next`); the running OwedBook (started 12:10) loaded the 17 Nov file. Plus-addressing passes the guard's format check.

**Change:** OwedBook `.env.local` line 50 — appended `,moose+alpha01-member@cyberizegroup.com`. Entries 5 → 6; original 5 preserved in order; all other lines byte-identical; mode 664 unchanged. No wildcard, domain rule, guard change, source edit, DB change, Git action or mail send. Portal `.env.local` untouched (invitation mail is sent by OwedBook). Both pending invitations untouched.

**Restart needed, no rebuild:** stop the running OwedBook `next start` (Ctrl+C in its terminal), then:

    cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && npm start

Then resend the correct invitation through the UI; expect "Invitation email sent."
