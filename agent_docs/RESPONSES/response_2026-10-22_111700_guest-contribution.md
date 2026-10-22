# VIK guest contribution: implemented, PR for Director merge

**What a guest gets.** The guest says "share my changes" and Cody asks them to confirm, because the work becomes public.

On the first share, Cody signs the guest in to GitHub:
- It shows a one-time code and the link github.com/login/device. The guest approves there.
- The guest confirms that the signed-in GitHub name is theirs.
- Cody sets this clone's commit identity to that name with GitHub's private noreply address.

Cody then commits, pushes only the `guest/` branch and opens a `VPR:` pull request, and gives the guest the link. Later shares update the same PR. "Sign me out of GitHub" removes the clone's login.

**How the login is kept separate.** Everything goes through `vibe_docs/vibe-gh.sh`. The guest's login lives only in `.git/vibe-gh` inside the clone. The wrapper refuses every `gh` call until that folder holds the guest's own login, which closes the keyring fallback behind yesterday's incident. Git credentials are routed through the wrapper by repo-local config only. Global Git and gh settings and existing logins are never read or changed, and token commands are prohibited.

**Unchanged.** Merging is Director-only. There is no force push, `main` push, deployment or settings change. Only allowed paths can be committed. External handoff ready stays NO.

**Checks.** A syntax check and a fake-`gh` wiring test, with no real gh and no keyring. A real sign-in, push and PR need Tony's manual test.

**Known limits:**
- The guest needs GitHub CLI installed. On Windows, the wrapper also needs Git for Windows' `sh`/`bash`.
- The guest's GitHub account needs write access to the repository. There is no fork route.
- The guest's token sits in plain text inside `.git/vibe-gh`, protected by file permissions; it is removed on sign-out.
- The non-interactive `gh auth login --web` behaviour is untested with a real account.
