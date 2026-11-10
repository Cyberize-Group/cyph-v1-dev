# Admin service inventory

Source: src/services/adminDemo.ts, types/adminDemo.ts and numbered targeted_source_evidence.txt. All are mock-backed at E1.

| Service | Method | Kind | Current consumer / note |
|---|---|---|---|
| ownerStoresService | getOwner | read | No current screen caller found; fixture owner |
| ownerStoresService | listMyStores | read | MyStoresScreen, SettingsScreen |
| ownerStoresService | getStore | read | StoreDetailScreen, InviteScreen |
| ownerStoresService | addStore | mock mutation | AddStoreButton; adds fixture/store audit |
| storeMemberService | listMembers | read | StoreDetailScreen |
| storeMemberService | listPendingInvites | read | InviteScreen |
| storeMemberService | inviteMember | mock mutation | InviteMemberForm |
| storeMemberService | resendInvite | mock action+audit | MemberRow |
| storeMemberService | suspendMember | mock mutation | MemberRow |
| storeMemberService | unsuspendMember | mock mutation | MemberRow |
| storeMemberService | sendRecovery | mock action+audit | MemberRow |
| billingService | listBilling | read | BillingScreen |
| billingService | managePayment | mock visual action | BillingRow; no actual charge |
| billingService | cancelSubscription | mock visual action | BillingRow; no actual cancellation |
| settingsService | getSettings | read | SettingsScreen |
| settingsService | saveSettings | mock mutation | SettingsForm |
| auditService | listAudit | read | AuditScreen |
| auditService | append | internal mock mutation | Other mutating service methods |

**Count correction:** 18 methods = 8 reads + 10 actions/mutations/internal append. Screen read paths proposed for real mode: stores/list/detail, members, audit, billing status. Invite/settings scope remains O-06 decision; write controls must visibly decline rather than append misleading success events. No admin wrapper exists in migrations 0001–0047.

Role-aware navigation consumers confirmed: src/components/global/Navbar.tsx:43, UserMenu.tsx:26-27, MobileNav.tsx:41-42. They currently key off platform ADMIN, which excludes the SFC member-role account owners. Proposed scope requires coordinated tenant capabilities without changing platform user_roles semantics.
