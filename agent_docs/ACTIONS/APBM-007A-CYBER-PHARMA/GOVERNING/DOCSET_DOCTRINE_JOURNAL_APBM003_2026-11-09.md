# Docset doctrine journal — APBM-003 lessons for sync intake

Date: 2026-11-09, Asia/Dhaka. Prepared by SOL / JARVIS for Tony.
Type: proposed standing-doctrine updates grounded in this campaign, with explicit distinction between reusable rules and engagement-specific Director rulings. This is an intake artifact, not a claim that the Factory docset is already patched.

## Problem to solve

Closeout became harder than needed because a review artifact, a certified candidate, a later accepted product repair, a disposable QA branch, inherited dirty files, private testing materials, and protected-main requirements all intersected. Tony needed final executable Git commands and an end to the module. The assistant initially missed that intent. Future closeouts should produce a concrete completion path on the first appropriate response while preserving accurate evidence and repository boundaries.

## Authority classification

The following principles are proposed for standing adoption. Tony's APBM-003 decision that no renewed Friday/Claudy visit or cleanup acceptance was needed applies to this closeout. Do not generalize it into an automatic waiver of Gate Q for every future product change. A future successor delta needs its own explicit disposition.

Likewise, the recorded PR protection belongs to this repository at that time; future commands must respect current protection. Owner reach and Target One product behavior are campaign facts, not generic Factory role policy.

## D-01 — Closeout must deliver the final operational artifact

Suggested homes: HANDOFF_PACKAGE_PLAYBOOK.md, ENGINEER_PLAYBOOK.md, QA_PLAYBOOK.md.

Proposed rule: when the Director provides a closeout for final review and Git completion, the reviewing seat reads it, resolves reviewable issues itself, and returns scoped sequential copy-paste commands plus real remaining blockers. Do not return a generic readiness response or an unnecessary “give this back to the executor” loop. A real missing live identity may be collected through a small read-only recon block or executor inspection.

The final command delivery must visibly cover staging, commits, integration, validation, push, allowed merge route, and local main synchronization. A script can accompany the commands, but a launcher alone is insufficient when the Director asks to see the steps. Avoid repetitive REVIEWED prompts when the architectural review has already occurred. Actual conflicts and changed inputs still require inspection.

Acceptance example: Tony can see exactly which paths are staged, what is integrated, where validation runs, and what establishes completion.

## D-02 — Maintain a multi-part status record

Suggested homes: QAM_PLAYBOOK.md, QA_PLAYBOOK.md, module closeout templates.

Track separately: engineering validation; independent QA verdict and candidate; Director acceptance; cleanup execution/acceptance; Git integration; deployment; Gate D; production readiness. A single CLOSED flag must not erase these distinctions.

For APBM-003: certified candidate dc44429f; later pagination Director-accepted; cleanup acceptance not recorded; Git completion Director-reported; deployment/Gate D pending. This is an example, not a template containing permanent SHAs.

## D-03 — Bind certificates to exact candidates

Suggested homes: QAM_PLAYBOOK.md, QA_PLAYBOOK.md.

Every certificate identifies its exact source revision. Subsequent product changes carry a delta list, validation, and an explicit decision: targeted independent QA, renewed broader QA, or a Director-accepted limitation/exception. Never silently inherit certification onto the successor. Keep the original certificate byte-for-byte; add explanatory records separately.

Preserve tally semantics: PASS, accepted limitation, and NOT RUN are different outcomes. If source shorthand conflates them, quote the authoritative restatement and document the interpretation without altering the source artifact. APBM-003's 44 checks are 40 PASS + 1 accepted limitation + 3 NOT RUN; restore was not demonstrated.

## D-04 — Disposable QA history is not integration history

Suggested homes: QAM_PLAYBOOK.md, ENGINEER_PLAYBOOK.md, SOFTWARE_FACTORY_PLAYBOOK.md.

Default Cody QA execution uses a separate disposable branch that is not merged wholesale. Preserve test probes and evidence deliberately. When an approved product repair exists there, isolate only the intended product paths/commit and selected sanitized evidence into engineering. Do not cherry-pick a mixed commit blindly.

Use a dedicated integration worktree when the QA checkout contains unrelated or private local work. Never switch a dirty checkout just to simplify the instructions. Do not stash/reset/delete inherited work as routine closeout. QA branch deletion is a separate cleanup decision; APBM-003 specifically retained branches/worktrees.

## D-05 — Finite manifests govern staging and evidence retention

Suggested homes: HANDOFF_PACKAGE_PLAYBOOK.md, ENGINEER_PLAYBOOK.md.

Provide literal product and records manifests; validate nonempty/unique entries, exact product set, permitted path roots, ordinary files rather than symlinks, no traversal/globs, no forbidden private/cache paths, and no product/records overlap. Check staged paths against the relevant manifest after staging. New files require classification and scanning before inclusion.

No broad git add ., directory staging, forced ignored-file additions, or blanket QA-branch merges. Ordinary git diff omits untracked new files, so explicitly inspect them. Keep inherited unrelated changes out of the retained snapshot even when their names resemble relevant docs.

## D-06 — Private test materials are retained deliberately

Suggested homes: QA_PLAYBOOK.md, QAM_PLAYBOOK.md, cleanup templates.

Separate sanitized durable evidence, disposable executor debris, and private operator testing materials. Credentials, login sheets, account casts, and backups remain private and outside commits. Do not delete materials the Director still needs merely to make a generic cleanup template appear complete.

A bounded scanner should inspect retained archives as well as loose files, test a clean control and poison control, and narrowly constrain synthetic exceptions by reviewed source identity. A clean scan is engineering evidence, not an independent certificate or a claim that uninspected external files are safe. Never copy secret values into journal entries, receipts, or handoffs.

## D-07 — Validate the integrated tree

Suggested homes: ENGINEER_PLAYBOOK.md, SOFTWARE_FACTORY_PLAYBOOK.md.

Recorded candidate tests do not prove a tree changed by reconciliation. After carrying approved deltas and reconciling current remote engineering/main, run appropriate repository checks on that actual integrated tree. For APBM-003 the delivered workflow used dependency install, typecheck, lint, mock-mode Jest, and real-mode build. Those modes are project-specific and do not prove live DEV isolation by themselves.

Do not rerun broad campaigns or database mutation unnecessarily when unchanged evidence already supports an unchanged candidate. New conflicts/resolutions or product changes justify targeted or full checks according to impact. Capture the final tested HEAD before push/merge and reject unexpected PR HEAD drift.

## D-08 — Respect real protected-main policy

Suggested homes: SOFTWARE_FACTORY_PLAYBOOK.md, HANDOFF_PACKAGE_PLAYBOOK.md.

An architect's local acceptance is not GitHub APPROVED state. Follow the actual PR policy, required approval/checks, resolved threads, and allowed merge strategy. Do not promise that a local review satisfies server requirements. No --admin bypass, force push, or direct main push as a fallback to a protection failure.

A PR merge updates remote main. Synchronize local main with fetch and fast-forward after verifying merged state; no additional git push main is needed. Record PR URL, reviewed/tested head, merge commit, local main identity, and any intervening main advances. Do not require origin/main to equal the PR merge SHA forever; verify containment if later work has landed.

## D-09 — Commands must be resumable without guesswork

Suggested homes: HANDOFF_PACKAGE_PLAYBOOK.md, engineering closeout template.

Visible blocks should stop on failure, label working directories, avoid assumptions hidden in a forgotten shell, and retain nonsecret identities durably enough for a later session. Capture pagination/records/integration commits and PR identity when created. Guard against occupied worktrees and unexpected staged files. Explain that rerunning the initial block after partial success is unsafe.

On conflicts: inspect unresolved paths, preserve both lines of work, resolve specific files, inspect the staged result, and continue the actual Git operation. Do not prescribe a reset or blanket rerun. Do not assert completion merely because commands were supplied.

Improvement over this campaign's compressed delivery: preserve the finite-manifest checks from Cody's proposal, save actual identities to a nonsecret receipt, and record the final merge evidence. The chat delivery depended on one live shell and did not save those identities as Cody's longer draft proposed. These are process improvements, not claims of a failed merge.

## D-10 — Record reports at the evidence level actually available

Suggested homes: journal and handoff templates.

Distinguish Director-reported complete, executor-reported PASS, certificate-reported verdict, and directly inspected live state. Tony's “done” is sufficient to move forward operationally; capture missing receipts at the next read-only opportunity without inventing SHAs or reopening accepted work.

Historical documents may correctly say pending before a later completion. Append an effective-date update; do not rewrite earlier logs to make every historical sentence match today.

## D-11 — Next module authoring begins with recon and retrospective

Suggested homes: APBM_PLAYBOOK_v1_0.md, ARCHITECT_PLAYBOOK.md.

A module number is not a feature scope. Read the current main tree, prior FOLLOW_UPS.md and RETROSPECTIVE.md, campaign map, and Director rulings before defining APBM-004. Present the next scope in plain language with acceptance boundaries. Do not call APBM-004 Phase 4 without an approved mapping.

Phase identities come from the current plan of record. The attached v2.0 plan puts reference data in Phase 4, math/imports in Phase 5, PDF/email/GHL in Phase 6, commerce/multi-store in Phase 7, and production hardening in Phase 8. Older conversational shorthand conflicts with that map and must not silently overwrite it. Surface newer amendments explicitly.

## Recommended closeout template fields

Module and target; original engineering candidate; certified candidate and certificate hash; post-certificate product paths; validation and manual-smoke limits; Director ruling; exact product/records manifests; exclusions and private retention; source/integration/main worktrees; current remote policy; integration checks; PR and actual merge identity; cleanup status; deployment/Gate D status; open follow-ups; next-lab read order and concrete starting revision.

## Doc sync implementation checklist

1. Read current versions of the named playbooks; reconcile overlaps instead of appending duplicate rules.
2. Add the closeout contract, status distinctions, exact-candidate certificate rule, manifest requirements, protected-main completion receipt, and next-module recon rule in their canonical homes.
3. Add cross-references from other playbooks to those canonical sections.
4. Mark APBM-003's no-return/cleanup decision as an engagement-specific ruling, not a universal QA waiver.
5. Preserve existing role naming: Tony is Director and retains git authority; Cody executes within authorized scope; SOL owns QA adjudication; Friday's independent verdict remains her verdict.
6. Review examples for real credentials and stale fixed identities. Use placeholders in generic templates.
7. Produce an intake disposition listing adopted/modified/deferred items and exact edited documents. Do not claim synchronization until changes are actually made.
