# STOP-001 — Q2 pre-execution reset/seed authority conflict

Phase Q2, attempt a01. Director release recorded verbatim in QAM_APPROVAL.md. Full candidate heads and approved plan SHA verified unchanged before effects.
OwedBook 37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40; Portal 9d938f62bff6172f9332ae6c67775e4b8feea379; plan 2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672.

Binding stop rule: Lead B1 gate decision, SCRATCH WRITES item 3: "No Auth identity created or deleted by reset or seed. If the scripts would do either, stop and report."

Source observation, not executed failure:
- OwedBook scripts/seed/reset.mjs enumerates Auth users then calls svc.auth.admin.deleteUser for seeded identities after committing public-row deletion.
- OwedBook scripts/seed/run.mjs calls svc.auth.admin.createUser for every seeded cast member and generates passwords before rebuilding public fixture rows.
These entrypoints violate the new no-Auth-mutation condition if executed as written. QA did not execute them, substitute a harness, patch product, or widen the allowance.

Affected T-004 fresh/upgrade/recovery rehearsals and fixture-dependent SQL tests. No ID snapshot yet because stop is detected before the first reset. No reset, seed, SQL mutation, provider call, login/session, signout, email, checkout, payment, identity creation/deletion, restart, deployment or cleanup occurred in this Q2 attempt. All effect counters zero.

Classification: mandatory permission/fixture-entry stop, not a newly graded high-severity product finding. No product acceptance verdict or certification.

Owner: QA Lead via Director; Architect/Engineer if candidate tooling changes are required. Decision needed: approve an exact QA-owned public-row-only fixture/reset method that reuses existing SCRATCH Auth IDs and meets snapshot/deleted-ID/seed-verifier obligations, or supply reviewed compatible tooling with the required candidate impact disposition. Do not infer authorization to modify or run current Auth-mutating scripts.

Safe resume: only after attributable Lead disposition, recheck binding/approved method, take required ID-only tenant snapshot, then proceed within accepted limits. Q2 release exists but execution is stopped under its binding Lead condition.
