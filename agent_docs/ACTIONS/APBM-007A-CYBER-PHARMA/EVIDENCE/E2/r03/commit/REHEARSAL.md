# Commit rehearsal — 16 November 2026 (engineering seat)

Before handing over, blocks 4.1 and 4.2 of `COMMIT_HANDOFF.md` were run exactly as written in throwaway shared clones (`git clone --shared --no-checkout` in the work lane), with `GIT_DIR` pointing at the clone and `GIT_WORK_TREE` at the real checkout. The real repositories' `.git`, index, HEAD and branches were not written; HEAD and index timestamps were compared before and after, and the clones were then deleted.

| Block | Result |
|---|---|
| 4.1 portal product | branch and HEAD guards passed; `verify_commit.py portal product staged` OK, 5 paths; committed OK |
| 4.1 portal records | staged OK, 3 paths; committed OK (parent is the product commit, grandparent is the base); working tree then clean |
| 4.2 OwedBook records | branch and HEAD guards passed; staged OK and committed OK (23 listed paths plus this folder); QA's 5,011 paths remained unstaged |

Rehearsal commit IDs are throwaway and must not be cited. The real commit IDs exist only after Tony runs the blocks.
