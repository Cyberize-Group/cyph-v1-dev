# Director prep — decisions resolved, E1 release requested

APBM007A v0.2 R1 · 11 November 2026. See DIRECTOR_RULINGS_2026-11-11.md for the approval scope and privacy-minimized source record.

| Item | Disposition | Remaining verification |
|---|---|---|
| D-01 server-only OB handoff service key | APPROVED | E1 validates exact guarded primitive; AC-037 server-only/bundle proof remains |
| D-02 provider-wide logout, MC/all-device impact and JWT window | APPROVED | E1 measures actual liveness/window; shortening shared project token lifetime still requires an explicit settings action |
| D-03 optional NCPDP, unique required NPI | APPROVED | E1 inventories existing data and final migration/API shape |
| D-04 DEV-only operator sample loader | APPROVED SCOPE | Implement after E2 release; no sample claims inserted in E1 |
| Email provider | INPUT RESOLVED: Resend | Existing DEV SMTP connectivity/delivery not yet verified |
| Sending domain | INPUT RESOLVED: cyberizedev.com, verified per Director | Confirm sending permission/configuration; no new domain by default |
| Sending address | INPUT RESOLVED: proposed no-reply@cyberizedev.com | Verify sender usable in E1; do not silently substitute noreply or support address |
| Owned test inboxes | INPUT RESOLVED: final four-role list | Private operator mapping; no plus-tag fallback; no mailbox-reading permission |
| Auth redirect destinations | TARGETS RESOLVED: local 3000/3001 and requested staging hosts | E1 verifies exact callback paths/templates and lists missing settings |

No repeated approval request for these four choices or a new email-provider selection. Inspect existing Resend/Supabase SMTP before asking for keys/DNS changes. Provider verification inputs are complete; actual operation can still fail and must be reported accurately. Production sender/rotation remain deferred.

Next Director action: review E1_RELEASE_REQUEST.md and explicitly release the stated bounded E1 envelope. No E1 release is implied by approving the plan or sending inboxes. Product build remains held for the complete post-E1 architecture review/freeze and E2 release.

The inherited 7–9 working-day all-007 estimate does not cover this expanded scope. E1 returns separate engineering, independent QA, apply/recovery and joint deployment/Gate D estimates. One final grouped Director eyes-on product walk remains; setup/apply decisions are operational checkpoints.
