# Closeout Git rehearsal — 16 November 2026

The six blocks in `COMMIT_HANDOFF.md` were extracted verbatim and run in throwaway clones under `ARCHIVE/APBM007A_E2_WORK/closeout/`.
- The clones were `git clone --shared` of each checkout at `qa/apbm-007a`, with local `main` set to the inspected `main`.
- `origin` was a local bare stand-in holding the inspected `origin/main`.
- Only the repository paths were substituted.
- Nothing was run against the real checkouts or GitHub.

| Attempt | What | Result |
|---|---|---|
| a1 | P-1 | Stopped by the verifier's repository-name guard (`VERIFY FAIL: run from the cyph-payment-portal-dev-v1 repository`), because the clones were named `ob`/`pp`. Instrument fault; preserved |
| a2 | P-1 → P-3, O-1 → O-3 | **All six pass.** Portal: staged 5 / committed / merged (two parents, first `c89572a…`, tree equal) / pushed. OwedBook: staged 13 / committed / merged (first `bc4e433…`, tree equal) / pushed. Each `pushed` printed local main = origin/main = merge, QA head contained, certified commits contained, clean tree |
| c1 | Control: a listed file (`RECOVERY.md`) edited after the manifest | P-1 stops at `staged`: blob differs. Nothing committed |
| c2 | Control: a stray untracked file | P-1 stops at `staged`: untracked files exist |
| c3 | Control: foreign commit on remote main | Instrument fault: the foreign commit was made in a clone with no branch checked out and was rejected, so no divergence occurred; O-2 merged normally. Preserved |
| c4 | Control: foreign commit on remote main (corrected) | O-2 prints `STOP: origin/main diverged from the QA line` and exits before `git switch main`; branch stays `qa/apbm-007a`, `main` unchanged, tree clean |

The commit and merge SHAs in the rehearsal (for example `fdcbe8a`, `3b59dc2`, `36c39cd`, `3d67eeb`) are rehearsal-only. Real SHAs differ because commit times differ, so nothing here pre-records them.
