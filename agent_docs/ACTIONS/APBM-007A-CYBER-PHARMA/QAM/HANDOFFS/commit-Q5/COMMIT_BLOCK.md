# Director commit — exact paths only

Run from the OwedBook repository after inspecting the cleanup package and manifest. The verifier is read-only. No Portal change is included.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
python3 agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/commit-Q5/verify_commit.py
git --literal-pathspecs add --pathspec-from-file=agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/commit-Q5/qa-pathspec.txt
python3 agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/commit-Q5/verify_commit.py --staged
git diff --cached --stat
git commit -m "docs: record APBM007A Gate Q certificate and Q5 cleanup"
```

The certificate applies to r05 only. r06 UI is Director-accepted, not QA-certified. Review ZIPs stay outside Git; receipts point to the archive. Architect closeout follows this record commit. No deployment.
