# OwedBook alpha — pre-commit review and commit commands (commit preparation only)

**Date:** 2026-11-20 16:00 (+06) · **Branch:** `deploy/owedbook-alpha-prep` at `0b12191`, everything uncommitted
**Nothing staged, committed, pushed, initialized or deployed. Manual retest: PENDING.**

## 1. Director decisions recorded (2026-11-20)

- **zod:** the breaking zod 4 upgrade is DEFERRED for this alpha, on the reported client-only usage. Advisory GHSA-mrhx-c7xc-m3w5 (high) remains **OPEN, not resolved**. Recorded as `agent_docs/KIP_REGISTRY.md` KIP-3 with triggers: before any production deployment; before zod is imported by server-side code; at the next `@hookform/resolvers` upgrade. Also noted on `DEPLOYMENT_CHECKLIST.md`.
- **`ALLOW_SYNTHETIC_SUBSCRIPTIONS`:** stays unset; testers use Portal-purchased test stores. Recorded in `stark-deploy.yaml` and the checklist.

## 2. Pre-commit checks (8 tracked changes + 13 untracked files)

| Check | Result |
|---|---|
| `git diff --check HEAD` (tracked) | clean |
| Untracked files: trailing whitespace, space-before-tab, CRLF, missing or extra final newline, binary content | clean |
| Secret patterns (Supabase secret key, JWT, private key block, Stripe keys, Google and GitHub tokens, DB connection string with password, magic-link tokens, cookies, assigned secret-looking values) | no secret. Two pattern matches, both verified as the secret NAME mapping `SUPABASE_SECRET_KEY=cyph-owedbook-alpha-supabase-secret-key` (`cloudbuild.yaml` line 101, `upload-secrets.sh` line 22), not a value |
| Public Supabase publishable key | present in `deploy.sh` and `stark-deploy.yaml` only. Intended: it is a browser key and ships in client JS |
| `.env*` files in the change set | none |
| Debris (`.orig`, `.rej`, `.bak`, temp, logs), large files | none |
| Debug or conflict markers (`console.log`, `debugger`, `FIXME`, `<<<<<<<`, `set -x`) | none |
| Unrelated changes | none. Lockfile version changes are limited to `next` and its packages (16.4.5), `eslint-config-next`, `handlebars` 4.7.10, `source-map-js` 1.2.4, `postcss-selector-parser` 6.1.4 → 6.1.6 |
| Script modes | `deploy.sh`, `init-app.sh`, `upload-secrets.sh` executable |
| Validation still current | typecheck clean, jest 374/374, local Docker build and container smoke test PASS (round-2 report) |

No value of any secret was read or printed. Matches were reported by pattern name and line only.

**Verdict: READY TO COMMIT.**

## 3. Commit commands (Tony runs them; four commits, separately reviewable)

Check the branch first:

```
git branch --show-current
```

Commit 1 — alpha origins (source):

```
git add src/lib/appIdentity.ts src/__tests__/alpha-origins.test.ts && git commit -m "feat(alpha): point OwedBook deployed origins at the alpha hosts" -m "Staging row of the address table: cyph-v1-owedbook-alpha and cyph-v1-payment-alpha on cyberizedev.com. Local and local-proof rows, return paths and guards unchanged. New alpha-origins test. The Payment Portal mirror still needs the same pair."
```

Commit 2 — dependency security remediation:

```
git add package.json package-lock.json && git commit -m "fix(deps): next 16.4.5 security remediation" -m "next and eslint-config-next 16.3.7 -> 16.4.5 (lowest version with no advisory; 16 advisories on 16.3.7, 2 critical). Lockfile-only: source-map-js 1.2.4, handlebars 4.7.10. zod 3.x advisory GHSA-mrhx-c7xc-m3w5 stays OPEN (zod 4 is breaking; deferred for alpha, KIP-3)."
```

Commit 3 — deployment files:

```
git add stark-deploy.yaml Dockerfile cloudbuild.yaml deploy.sh init-app.sh upload-secrets.sh .gcloudignore .dockerignore DEPLOYMENT_CHECKLIST.md && git commit -m "chore(deploy): OwedBook alpha Cloud Run deployment files" -m "next-deploy-auto v1.3 output for service cyph-v1-owedbook-alpha (cyberize-nextjs-staging, us-east1), revised after JARVIS review: 0.0.0.0:3000, unique image tag, deploy by digest, dirty-source abort, act-as check, MAIL_RECIPIENT_POLICY=open, nested and case-insensitive ignore rules. SUPABASE_SECRET_KEY is runtime-only via Secret Manager. Nothing deployed."
```

Commit 4 — records:

```
git add RECOVERY.md CHANGELOG.md agent_docs/KIP_REGISTRY.md agent_docs/SKILL_ISSUES_LEDGER_next_deploy_auto.md agent_docs/SESSIONS/session_2026-11-20.md agent_docs/RESPONSES/response_2026-11-20_152916_owedbook-alpha-deploy-prep.md agent_docs/RESPONSES/response_2026-11-20_155313_owedbook-alpha-prep-round2.md agent_docs/RESPONSES/response_2026-11-20_160040_owedbook-alpha-precommit.md && git commit -m "docs(records): OwedBook alpha deployment preparation records" -m "Session log, recovery state, changelog, preparation reports, skill ledger, KIP-3 (zod advisory open). Manual retest pending; nothing deployed."
```

Then confirm the tree is clean:

```
git status --short && git log --oneline -5
```

## 4. Still pending after the commits

Final manual retest (on Next.js 16.4.5) · deployment approval · init (agent) · `upload-secrets.sh` (Tony) · deploy · domain mapping and Supabase Auth allow-list · Portal mirror and Portal alpha · zod 4 before production (KIP-3).
