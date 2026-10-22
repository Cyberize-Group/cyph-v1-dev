# Credential exposure during the contribution design check — work paused

**What happened.** To test isolated sign-in, I ran `gh auth git-credential get` with `GH_CONFIG_DIR` pointed at an empty scratch folder. I expected no output. gh 2.45.0 fell back to the system keyring and printed this VM's global GitHub CLI OAuth token. The token is now in this session's transcript. It is not in any repository file, scratch file or ZIP, and I have not repeated it anywhere.

**Revoke it now.**
1. GitHub → Settings → Applications → Authorized OAuth Apps → **GitHub CLI** → Revoke.
2. Run `gh auth login` again on this VM.
Until it is revoked, assume the token is exposed.

**What it means for the design.** `GH_CONFIG_DIR` alone does not isolate gh. If the guest's isolated folder has no login, gh falls back to whoever is logged in globally. On a shared machine like this one, that would let the guest flow act as Tony. The repo-local Git part works as intended: an empty local `credential.helper` hid both global helpers in a scratch test.

**Corrected approach (proposed):**
- Guest sign-in uses `gh auth login --web --insecure-storage` with `GH_CONFIG_DIR=<repo>/.git/vibe-gh`.
- Every gh call, and the repo-local Git credential helper, runs only after a guard confirms that folder holds the guest's own login. With no guest login, the guard refuses and gh never runs.
- The guest confirms the signed-in account name before anything is published.
- I will test the guard only against empty folders with gh mocked. I will not run real gh commands against the keyring again.

**Status:** paused. No kit edits, no Git changes. `main` = `origin/main` = `764e396` (PR #6 merged), clean.
