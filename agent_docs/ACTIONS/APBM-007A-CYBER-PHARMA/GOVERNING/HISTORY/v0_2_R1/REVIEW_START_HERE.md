# APBM007A v0.2 R1 — approved plan, E1 request pending

Tony has approved the four Director choices and supplied Resend/sender/final test-inbox inputs. See DIRECTOR_RULINGS_2026-11-11.md and DIRECTOR_PREP.md. The mailbox values remain in a private operator file, not this review ZIP. Email inputs are resolved; operational SMTP/redirect/delivery checks remain E1 work.

**Next action: Tony considers E1_RELEASE_REQUEST.md. E1 and the build are explicitly NOT RELEASED.** This revision is documentation only. Approving the plan is not executing it or freezing unproved technical details.

Friday's first verdict was ACCEPT WITH EXACT AMENDMENTS over the readable v0.1 concatenation only; ZIP/QAM/APBM_ENTRY were unseen. FA-1–FA-11 are applied in v0.2. One post-E1 full-package/capability/protocol/SQL/API review and freeze remains; no intermediate routine architecture review is added.

Current decisions: guarded server-only OB service-key handoff; simple provider-wide logout with accepted MC/all-device impact and JWT window; optional NCPDP, unique required NPI; operator-only DEV sample loader after E2 release; Resend cyberizedev.com with proposed no-reply sender, local and staging targets. Heavier session-family/RLS fencing remains fallback only if a measured stated requirement needs it. No encryption key or persistent provider bearer material in the handoff.

Read E1_RELEASE_REQUEST → E1_RECON_MISSION → PREFLIGHT_LEDGER → current contracts/acceptance. The request makes the read-only, Auth/session/email and Stripe sandbox effects explicit, including counters and cleanup. No DEV schema/tenant writes or sample loading during E1; no automatic changing of SMTP/redirect/JWT/DNS settings. Findings return together with effort estimates.
