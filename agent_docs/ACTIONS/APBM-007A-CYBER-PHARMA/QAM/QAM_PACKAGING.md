# Review export contract

Each E1/E2/Q1/Q2/material stop or repair return gets REVIEW_START_HERE.md, current state/identity, reports, applicable contracts/rulings, actual observations, required governing sources and sanitized supporting evidence. Use explicit payload list, no nested prior ZIPs by default.

Canonical QAM destination: HANDOFFS/APBM-007A-CYBER-PHARMA_<PHASE>_REVIEW_<ATTEMPT>.zip. FILE_INDEX.json lists path/purpose/size/SHA-256 of every member except itself. Validate safe unique paths, no symlinks/traversal, exact membership, hashes and ZIP integrity. Hash completed ZIP in an external receipt. Exclude envs/private backups/login casts/auth state/raw sensitive traces/Git/deps/builds. Scanner must pass clean/poison controls; include expanded archive contents in coverage. Do not rerun good tests just to package. Return exact absolute upload path, count/hash, factual summary and next owner/decision.
