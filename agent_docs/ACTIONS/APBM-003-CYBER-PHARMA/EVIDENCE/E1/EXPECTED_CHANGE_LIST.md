# Certified-matrix expected change list — proposed for JARVIS resolution

EVIDENCE: scripts/rls-harness/expectations.json (5×16×4 = 320), harness.mjs:45-69, payloads.mjs:1-34, migration 0021, OAC OD-1..OD-6. Historical certificate SHA is unavailable; comparison is against the tracked matrix at b23372d. No matrix run or expectation file edit occurred.

| Existing cell | Current | Required proposal | Rationale |
|---|---|---|---|
| ownerA × user_data × select | ALLOW | DENY, SQLSTATE 42501 proposed | D-1(a) revoked SELECT |
| staffA × user_data × select | ALLOW | DENY, SQLSTATE 42501 proposed | D-1(a) |
| ownerB × user_data × select | ALLOW | DENY, SQLSTATE 42501 proposed | SELECT probe is unqualified; ownerB currently sees own B rows |
| multiStore × user_data × select | ALLOW | DENY, SQLSTATE 42501 proposed | D-1(a) |
| anon × user_data × select | DENY | DENY | Preserve unauthorized boundary; record transport error separately |
| ownerA × accounts × update(name on A) | DENY | ALLOW if OD-3 safe-column policy adopted | Existing probe changes name, owned A |
| ownerB × accounts × update(name on A) | DENY | DENY | Payload targets A; do not allow merely because caller owns B |
| every subscriptions × update(status on A) | DENY | DENY | status is entitlement state; owner does not gain client entitlement edits |

**Additional exact affected cells needing ruling:** ownerA×user_data×insert/update/delete; staffA×user_data×insert/update; multiStore×user_data×insert/update — seven existing ALLOW cells. All use `.select()` returning rows. After SELECT revoke these can error, and UPDATE/DELETE row visibility also depends on SELECT policies. Preserve underlying intended permission tests with return-minimal and trusted independent state inspection only where SQL semantics allow; do not simply change seven cells to DENY or call silent no-ops PASS. New controlled write wrappers or explicitly deferred mutations require a contract decision. No live error class observed; 42501 is a proposal for privilege denial, HTTP status must be measured with agreed transport.

Required new owner/cast coverage (new tests, not silent rewrites of unrelated cells):

| Identity / target / operation | Expected |
|---|---|
| OWNER3 → allowed store discovery | exactly B1/B2/B3, no A1/C1 |
| OWNER3 without B2/B3 junction → businesses SELECT and permitted junction roster SELECT | owns B stores; no cross-account rows |
| OWNER3 → each of four owedbook wrappers on B2/B3 | ALLOW, one committed event per successful call |
| OWNER3 → wrappers on A1/C1 | reject 'not a member of business', zero audit insert |
| OWNER1/UNRELATED → own A1/C1 discovery and wrappers | only owned scope |
| ADMIN_B2 → B2 wrappers/admin reads; B1/B3/A1/C1 | own ALLOW; others DENY |
| MEMBER_B1 and MEMBER_B2B3 → assigned wrappers | exact assigned stores, no ownership widening |
| Members → admin_audit/admin roster/billing | deny per ruled O-06 access matrix |
| Any owner/admin/member → direct user_data SELECT | permission failure; service_role behavior separately unchanged |
| Owner → permitted account/subscription safe-column edit | ALLOW only after exact columns and target mapping ruled |
| Owner → owner_user_id/account_id/Stripe/entitlement modification | DENY; no tenant escape |
| Admin/member → accounts/subscriptions INSERT/UPDATE/DELETE | DENY |
| Second admin insert or role-update collision per business | unique violation; first admin and multiple members remain valid |
| Accountless, junctionless user → discovery | empty set; all wrappers denied |
| Existing live-session revocation, spoof/re-home, anon and grant-channel attacks | preserve or explicitly amend when owner retains access by ownership |

Preserve every unaffected cell and 28-attack intent, with row-level rather than nonempty-only assertions. New cast is seven required users, so a newly projected full matrix would be 8 identities including anon × final table count × 4; do not label it the old 320-cell instrument or assert a final count before schema/cast resolution. OPERATOR remains optional and unauthorized. Add account ownership revocation tests separately from junction revocation: removing a junction from an owner must not revoke ownership-derived access.
