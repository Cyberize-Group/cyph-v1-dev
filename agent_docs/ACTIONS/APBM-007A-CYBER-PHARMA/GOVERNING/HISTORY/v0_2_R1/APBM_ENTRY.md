# Entry and workflow

This is the single engineering entry for APBM-007A-CYBER-PHARMA. Read persisted APBM_STATE.md first. Installed repository instructions and protected paths must be reconciled before execution; never edit their authority text to bypass a stop.

| State | Next allowed work |
|---|---|
| PLAN_APPROVED_E1_NOT_RELEASED (current) | Director choices/email inputs resolved; consider E1_RELEASE_REQUEST.md. No execution yet |
| E1_RELEASED | Engineer follows E1_RECON_MISSION.md and its recorded effect envelope |
| E1_RETURNED | Second/final planned architecture review covers capability evidence + protocol/SQL/API + full package/QAM; freeze after consolidated amendments |
| E2_RELEASED | Engineer executes E2_EXECUTION_INSTRUCTIONS.md on two pinned checkouts |
| E2_AT_DEV_APPLY | Director executes or explicitly delegates the reviewed APPLY_CHECKPOINT.md action; no implicit apply |
| ENGINEERING_RETURNED | Architect reviews factual handoff; Director pins two candidate commits; ownership transfer |
| Q1_READY | Independent QA follows QAM/QAM_ENTRY.md |
| Q1_RETURNED | QA Lead approves exact plan; Director releases Q2 |
| Q2_RELEASED | Independent approved campaign; conditional consolidated repair if required |
| CERTIFIED | Governed cleanup, Architect closeout and Director Git integration |
| INTEGRATED | Separate joint staging deployment and Gate D release |

Engineering read order: README → authority decisions/provenance → APBM_BRIEF → APBM_RULINGS → contracts → acceptance → environment/readiness → current pass instructions → QAM completion duties. One active writer per checkout. Engineer does not fill independent QA findings/results/approval/certificate.

Installation is documentation-only after Director instruction: unpack outside both repos; check FILE_INDEX.json; compare any existing module; preserve differences. Confirm actual checkout paths from E1. Install the canonical module in OwedBook only. The portal pointer names its absolute sibling module entry and both exact source identities. Do not copy credential files or invoke scripts as an installation step.

Review cadence: two planned architecture reviews, not an approval per E1 probe or E2 stage. The first reviewed readable v0.1 only. The post-E1 review must include the ZIP/QAM/APBM_ENTRY that Friday has not yet inspected. Genuine new authority/security failures still stop dependent work. One grouped final Director eyes-on product walk; no repetitive mandatory walks.
