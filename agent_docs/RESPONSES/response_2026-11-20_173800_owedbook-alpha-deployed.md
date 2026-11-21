# OwedBook alpha — DEPLOYED (Stage A base service) + domain mapping created

**Date:** 2026-11-20 17:38 (+06) · **Result:** base service DEPLOYED and VERIFIED · domain mapping CREATED, certificate PENDING
**Not a certification:** manual acceptance is PENDING; a successful deploy is not Gate D.

## Deployment (EVIDENCE)

| Item | Value |
|---|---|
| Service | `cyph-v1-owedbook-alpha`, `cyberize-nextjs-staging`, us-east1 |
| Revision | `cyph-v1-owedbook-alpha-00001-qrp` (ready) |
| LIVE NOW | `https://cyph-v1-owedbook-alpha-hr465ynfuq-ue.a.run.app` |
| Source | branch `deploy/owedbook-alpha-prep`, commit `ef4cebccae68499bee7d4a53b230e31474a17f52`, clean (no `-dirty`) |
| Build | `5d840fee-51cc-4c9f-ab03-9b9f97c191e4`, SUCCESS, 4m43s, run as `524380376459-compute@developer.gserviceaccount.com` |
| Image tag | `ef4cebccae68-20261120t111951z` |
| Image digest | `sha256:db2d37b44ce76fde9ed426da2feef5f91bae4eaa18170e9410cdfda8a9408348` — the same in the build results, the push step and the service spec |
| Runtime SA | `sa-cyph-owedbook-alpha-runtime@cyberize-nextjs-staging.iam.gserviceaccount.com` |
| Container port | 3000; log shows `Network: http://0.0.0.0:3000` |
| Service labels | `source-revision`, `image-tag` set |

## Verification (read back)

- **Access:** `allUsers` holds `roles/run.invoker`; "Setting IAM Policy … done", no failure warning. Matches `access.invoker: public`.
- **HTTP on run.app:** `/` 200 · `/api/build-info` 200 · `/owedbook` 307 → `/auth`.
- **Build identity:** `/api/build-info` returns revision `ef4cebcc…7f52` and artifact `owedbook-alpha-ef4cebccae68-20261120t111951z`.
- **Runtime settings:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_ENV=staging`, `NEXT_PUBLIC_SUPABASE_URL` (DEV), `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `MAIL_RECIPIENT_POLICY=open`; `SUPABASE_SECRET_KEY` mounted from secret `cyph-owedbook-alpha-supabase-secret-key:latest`. `MAIL_ALLOWLIST` and `ALLOW_SYNTHETIC_SUBSCRIPTIONS` not set.
- **Logs:** Next.js 16.4.5 ready; "Environment validated"; no error lines.
- **Secret:** version 1 ENABLED; only the runtime SA holds `secretAccessor`. Metadata proves a value exists, not that it is correct; no database call using the secret key has been exercised yet.
- **Other services:** the five existing services show their previous revisions and timestamps; untouched.

## Init (two runs)

Run 1 exited 1 on a false "Act-as MISSING" from an agent script defect (`grep -q` under pipefail); it had already created the empty secret and the runtime SA. No grant was made. Fixed in `ef4cebc`; run 2 exit 0. Ledger row written.

## Domain mapping (approved by Tony: "map the domain after verification")

- Created: `cyph-v1-owedbook-alpha.cyberizedev.com` → `cyph-v1-owedbook-alpha` (us-east1).
- Google expects: CNAME `cyph-v1-owedbook-alpha` → `ghs.googlehosted.com.` Public DNS (8.8.8.8) returns exactly that. Match.
- Status at creation: `DomainRoutable` True; certificate `CertificatePending`. HTTPS on the alpha domain is not confirmed yet.

## Cloud resources created today

1 secret (1 version, uploaded by Tony) · 1 service account · 1 secret-level IAM binding · 1 image · 1 Cloud Run service with public invoker · 1 domain mapping. Nothing deleted; nothing existing modified.

## Not done

- Certificate issuance and HTTPS on the alpha domain (in progress on Google's side).
- Supabase Auth (DEV): Site URL / redirect allow-list for the alpha origin — Tony, dashboard. Sign-in is expected to fail until then.
- Sign-in, email links, staff actions, invitation mail on the alpha domain — not exercised.
- Payment Portal: mirrored origins and Portal alpha deployment; two-app handoff.
- Final manual retest / acceptance — PENDING.
- zod 4 before production (KIP-3, OPEN).
- Branch is local only: not pushed, not merged. Records since `ef4cebc` are uncommitted.

## Update — HTTPS on the alpha domain (EVIDENCE, 2026-11-20 ~18:00 +06)

- Mapping `Ready` True, `CertificateProvisioned` True. HTTPS began answering a few minutes later.
- Certificate: subject `cyph-v1-owedbook-alpha.cyberizedev.com`, issuer Google Trust Services (WR3), verify ok, expires 2027-02-18.
- `https://cyph-v1-owedbook-alpha.cyberizedev.com/` 200 · `/api/build-info` 200, revision `ef4cebcc…7f52` · `/owedbook` 307 → `/auth` on the alpha host · plain http 302 → https.
- Still not verified: sign-in, email links, staff actions, invitation mail (Supabase allow-list pending); manual acceptance PENDING.
