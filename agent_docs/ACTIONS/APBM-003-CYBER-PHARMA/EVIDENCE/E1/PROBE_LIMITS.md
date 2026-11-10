# Probes not run, with reason and unblock action

| Probe | Why not run under current instruction | What resolves it |
|---|---|---|
| next build/dev | Writes .next, generated types and caches outside recon files | Tony authorizes build/runtime artifact writes; preserve protected source |
| Jest | Installed jest-haste-map persists cache via build/_persist; no-cache is not a zero-filesystem-write guarantee | Authorize bounded test cache/artifact directory for later verification; do not claim 36 files equals passed suites |
| Playwright/auth login/signup | Browser profiles/traces and auth state changes; signup writes identities | Scoped browser/identity-probe authorization after QA/test users established |
| rls:prove, audit:prove, audit-catalog, db-verify --probes | DB writes/reset/seeds and hardcoded historical output paths | Rework in E2, SCRATCH-only destructive proof; separate DEV-safe verification |
| OwedBook RPC instrumentation | Successful reads append audit_logs | Authorize bounded SCRATCH audit writes after target confirmed |
| SQL catalog on SCRATCH/DEV | Configured replica not certified SCRATCH; DEV SQL credential key absent; live target identity/credential validity unestablished | Tony confirms target/ref and supplies scoped read-only catalog access/receipt; no new credentials printed |
| Cloud describe/deploy/DNS | No authenticated target approval established; cloud binary is not authority; DNS not queried this run | Tony supplies target identity/read-only access or receipt before deployment planning is finalized |
| npm audit/install | Registry-dependent; package-manager logs/dependency artifacts | Separate authorized dependency verification; no package mutation in this recon |

Completed local probes: non-incremental no-emit typecheck, no-cache lint, pure in-memory fixture arithmetic, local Git/source/path/hash inspections. These do not replace omitted runtime proofs.
