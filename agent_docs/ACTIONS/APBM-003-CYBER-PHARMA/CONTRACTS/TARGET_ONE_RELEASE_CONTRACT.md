# TARGET ONE RELEASE CONTRACT — APBM-003-CYBER-PHARMA

**Status:** DRAFT — CLAIM STATUS until E1 resolution stamps FINAL. The deployment facts in §1 are **reported** (portal brief 2026-11-05 screenshot; plan v3.0 §6) and are verified by Cody at E1 (O-07).

## 1. Deployment target (reported; verify)

| Item | Reported value | E1 verifies |
|---|---|---|
| Staging URL | `cyber-pharma.cyberizedev.com` | DNS, certificate, current revision |
| Platform | Google Cloud Run, project/region shown as `cyberize-nextjs-staging`, `us-east1`; service name shown as `cyber-pharma-prod` (the `-prod` suffix does not make it production; it is staging) | actual project id, service name, current image, env var names |
| Backend | Shared dev Supabase project "Cyber Pharma Dev v1" | project ref; the service's env var names for URL / publishable key; **no secret/service-role key in the frontend service** |
| Build | `next build`, `output: "standalone"` (RRM-004 state) | Dockerfile / cloudbuild as present in the repo; `DEPLOYMENT_PLAYBOOK.md` applicability |
| Deployment workflow | Agent-owned under Director authorization (R-10): inspect what exists → one discoverable configuration file → explain only missing values → user-only authentication by the Director → execute approved work → record evidence | the actual command set and the approval the Director gives (recorded in `../EVIDENCE/deploy/`) |

## 2. What testers receive (filled by Cody at E2 completion; approved by the Director before release)

| Item | Content |
|---|---|
| Staging address | NOT RECORDED (Cody fills at E2 from the verified target) |
| Accounts | the cast of `SEED_AND_FIXTURE_CONTRACT.md` §2, passwords delivered through a secure channel the Director chooses (never in this file, the repo, email body or chat) |
| Scenarios | (a) sign in as `OWNER3`, open OwedBook, confirm B1/B2/B3 are the only stores offered and each shows rows; (b) sign in as `MEMBER_B1`, confirm only B1; (c) sign in as `UNRELATED`, confirm only C1; (d) walk KPIs, four tabs, filters, sort, pager, Summary on desktop and phone, both themes; (e) open the admin read views; (f) try every write control and confirm it says it is not available in this release |
| Known limitations (the honest list) | Calculation values are prepared fixtures, not the engine · no payment, registration, invitations, Add Store (APBM-007) · no imports, no real claims (APBM-005; D-2) · no emails, no PDFs (APBM-006) · admin write actions unavailable (R-06) · Google OAuth not available · this is staging on synthetic data; nothing here is production or patient data |
| Reset / support | how a tester asks for a reseed (Director-executed through `../APPLY_CHECKPOINT.md` §5 re-run procedure) |
| Feedback route | one consolidated register (OW14): defects against the published scope · business corrections · preferences · new scope — triaged per plan v3.0 §5 |

## 3. Display-label mapping (OD-8; no DB rename)

| What the DB has | What the screen says |
|---|---|
| `accounts.owner_user_id` = the signed-in user | "Account Owner" |
| `user_businesses.role = 'admin'` | "Store Manager" (the delivery plan's "admin") |
| `user_businesses.role = 'member'` | "Store Worker" / "Member" |
| `user_roles.superadmin` | never shown to customers; internal operator only |

## 4. Gate D (independent, Claudy, after Gate Q and certified-candidate deployment)

E2 delivers the candidate and deployment package locally. Claudy tests that identified candidate for Gate Q; QA Lead certifies. Tony then separately approves deployment of that certified product identity, and Gate D verifies the actual deployed revision. Staging is not a Gate-Q precondition.

Verifies on the deployed revision: the running image is the certified candidate's build; sign-in works for each cast identity; supported reads return the right stores; role boundaries hold through the real browser; the limitations list matches what the screens actually do; no secret appears in the client bundle or response headers. Gate D is a separate claim from Gate Q (`../QAM/QAM_CERTIFICATION.md` §3) and is recorded in `../EVIDENCE/deploy/GATE_D.md` by the QA Executor with its own evidence.

🥄
