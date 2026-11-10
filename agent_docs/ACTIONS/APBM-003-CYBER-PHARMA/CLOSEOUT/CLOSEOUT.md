# APBM-003 closeout — Director accepted; integration handoff prepared

2026-11-09 · Cody, Engineering Executor. Director authorizes closeout/integration/push preparation, not agent Git execution.

## Separate facts

| Fact | Status / exact evidence |
|---|---|
| DEV APPLY | PASS, Director executed 2026-11-07. `../EVIDENCE/apply/DEV_V2_20261107T080333Z_1347924/dev-v2-final-1794039263719.json`: 52 ledger entries, 250 claims, seven synthetic users; 19 Owner / 154 client checks; original rows and four Auth indexes preserved; exact three managed default ACL exceptions. No repeated apply. |
| Gate Q | Friday CERTIFIED WITH LIMITATIONS for **dc44429f466dedcf35023342f68624c6cee062f0**, not the pagination successor. Delivered `/home/moose/Downloads/QAM_CERTIFICATION.md` installed byte-for-byte in QAM/QAM_CERTIFICATION.md. SHA-256 e7867554afc4a3f242ab09f02b048bd025d3cecb9c5e1ec79fd2e9103b588f37. |
| Correct certificate tally | **40 PASS, 1 ACCEPTED LIMITATION, 3 NOT RUN** = 44. The source's “41 PASS” matrix shorthand includes AC-401, but its Lead restatement expressly says AC-401 is not a pass. Preserve source verbatim; this closeout uses the corrected interpretation requested by Tony. Restore was accepted, not demonstrated. |
| Director acceptance | Successful Target One with limitations, on this closeout instruction; observations below. |
| Pagination successor | Four-file uncommitted product/test change, separately validated and explicitly accepted by Tony. Engineering validation and Director manual acceptance recorded; no renewed independent certification claimed. |
| QA cleanup | Phase-exit server/temp cleanup reported in Q4 report/certificate. Canonical cleanup execution/acceptance report still a template; final cleanup acceptance NOT RECORDED. Limited Cody routine cleanup recorded separately. |
| Deployment / Gate D | Deferred / NOT RUN; production readiness pending. Director acceptance is not deployment authority or a Gate D result. |
| Git/integration | No Git mutation by Cody. qa/apbm-003 HEAD c5061d9f75fa242a3d14913c08d6bbad7173c638; engineering apbm-003 at original 308247a; main/remote main af2c7e5. PR required, one approving review, resolved threads, merge commit only. |

## Director observations

Tony declares APBM-003 successful and accepts Target One with recorded limitations. Director-observed Owner smoke: admin views render correctly; OwedBook filters, store switching and pagination work; mobile passed. MEMBER_B1: filters work, mobile passed, no admin page access reported. Tony manually reviewed the pagination usability repair and explicitly approved it as beautiful/perfect. No Director UNRELATED-account test, exact picker verification or complete seven-account smoke is claimed.

## Final product reconciliation

1. Original engineering candidate: 308247a24e6ddd455842da5cd2e21541d7eae2c1.
2. Friday-certified repair: dc44429f466dedcf35023342f68624c6cee062f0. Only product changes since original: DemoMarker.tsx and BillingScreen.tsx truthful real-mode labels; OwedBookContext.tsx same-store no-op guard. CERTIFIED_PRODUCT.patch contains only these three paths.
3. dc44429f..current HEAD c5061d9: no product delta (release record only).
4. Current worktree successor: OwedBookScreen.tsx, new ResultsToolbar.tsx, apbm-read-states.test.tsx and new ResultsToolbar.test.tsx. No later admin/auth/service/script/migration/fixture/product changes found. Exact four hashes still match pagination/source-hashes.json; reuse the valid 40-suite/201-test, typecheck/build, 0-error/34-warning lint and 16-layout results. No new product work in closeout.

Source snapshots and evidence are retained separately from a certificate. SHA-256 file listings and explicit retention manifests accompany this handoff. Do not label the new product revision automatically certified.

## Director ruling and remaining integration work

- Director ruling (2026-11-09): no return to Friday or Claudy is required for this closeout. Target One is accepted and the pagination repair is manually approved. Friday's certification applies only to its original certified candidate; no renewed independent certification is claimed.
- Unconfirmed QA cleanup remains explicitly unconfirmed. Renewed cleanup acceptance is not a prerequisite for Git integration. Routine local cleanup may proceed while preserving Tony's testing credentials/documents, private cast and backups.
- Retrospective synthesis remains a follow-up, not an additional closeout approval cycle.
- Tony reviews scoped staging and integration results, pushes engineering, obtains protected-main PR review and merges via allowed merge method. Git history and remote state remain unchanged by this task.

Git integration/merge receipts remain pending. Cleanup acceptance remains unconfirmed; deployment and Gate D remain pending. APBM-004 should start from the approved, merged main revision resolved from the PR receipt, carrying FOLLOW_UPS.md and the retrospective actions. A future SHA is not invented.

## Local testing

Port 3000 is stopped per Tony's request. Intended URL after Tony starts the already-built local app: http://localhost:3000/auth, then /owedbook. From repo root: `npm run start -- --port 3000`. Use the persisted Downloads login Markdown/Documents PDF (private, excluded from Git). Old 3137 remains untouched; do not use it as the current build. No server restart performed during closeout.
