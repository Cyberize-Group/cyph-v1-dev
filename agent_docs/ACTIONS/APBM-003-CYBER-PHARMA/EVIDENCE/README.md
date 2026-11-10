# EVIDENCE/ — engineering evidence lane (APBM-003-CYBER-PHARMA)

**Owner:** Cody (E1, E2). Separate from `QAM/evidence/` (Claudy's lane) and `EVIDENCE/apply/` (Director-executed checkpoint outputs). Nothing here is independent QA evidence; it is engineering's record of what it claims.

```
EVIDENCE/
├── E1/            RECON_REPORT.md · EXPECTED_CHANGE_LIST.md · AUDIT_OPERATION_CONTRACT_DRAFT.md · R016_PROPOSAL.md · COUNTS.md · raw outputs per question
├── E2/            PREFLIGHT.md · stage-1/ … stage-8/ · CONTRACT_QUESTIONS.md · METRICS.md
├── apply/         01_TARGET_IDENTITY.txt … 10_ACL.txt · DA-2_SUPABASE_SIGNUP_DISABLED.md · 03_BACKUP_RECORD.md · 04_REHEARSAL.txt · STOP.md (if any)
├── deploy/        TARGET_APPROVAL.md · deploy run records · GATE_D.md (written by Claudy)
├── env/           ENV_NOTE.md (key NAMES only, never values)
└── *.zip          APBM-003-CYBER-PHARMA_E1_REVIEW_01.zip · _E2_COMPLETION_01.zip (indexed; hash recorded outside the ZIP)
```

Rules: every claim cites a path here with command, working directory, exit code and unfiltered output; no secret values, ever; prior attempts never overwritten; a ZIP is never rebuilt to embed its own hash.
