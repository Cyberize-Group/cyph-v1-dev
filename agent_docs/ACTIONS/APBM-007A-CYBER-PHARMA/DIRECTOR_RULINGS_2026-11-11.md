# Director rulings — APBM007A v0.2, revision R1

Authority: Tony's explicit Director rulings supplied in chat on 11 November 2026, followed by his final replacement inbox list. This is a privacy-minimized transcription, not a claim of a byte-identical raw message. Actual mailbox mapping is an operator input supplied separately; no password or API key is included here.

Scope: current synthetic DEV/staging only. All four pending decisions are APPROVED:

1. D-01 / FA-3: OwedBook service-key use approved, server-only and limited to the guarded login handoff. No Stripe key in OwedBook. Any proposed wider service-key use requires its own scope disposition; existing read-only catalog/operator capabilities are separately governed.
2. D-02 / FA-4: simple provider-wide logout approved, accepting same-user Mission Control and other-device signout and the unexpired access-token window. E1 measures that window and proves protected-app logout behavior. No session-family/RLS fallback selected automatically; no project JWT-setting change authorized by this acceptance.
3. D-03 / IDENT-01: NCPDP optional information approved; NPI remains required and unique; existing values/internal IDs preserved.
4. D-04 / FA-8: operator-only DEV sample-claims command approved for a named synthetic test store; customer registrations start empty. This is implementation scope approval, not permission to load samples during E1.

Email inputs are specified: provider Resend; cyberizedev.com verified per Director report/screenshot; proposed From no-reply@cyberizedev.com, usability to be verified at E1. Local and staging are targeted. Include the exact allowed local destinations under http://localhost:3000 and http://localhost:3001 with the reviewed auth callback paths, plus the exact staging callback destinations. An origin alone does not prove a full callback is configured. E1 inspects whether Resend SMTP is already connected to the DEV project's Auth email; if not, lists exact settings changes and required local access without applying shared configuration or exposing credentials. Production Pharmacy Books sender is deferred.

Final test cast, superseding the earlier mapping: OWNER_1 signs up/pays/owns store; OWNER_2 is unrelated customer; STORE_ADMIN is a separately named store-admin inbox; MEMBER is a separately named member inbox. Four distinct supplied email addresses. The earlier plus-tag admin mapping is retired; do not fall back to it or infer roles from old records. Addresses are confined to the private operator input and necessary provider/test records; reviewed evidence uses aliases and redacted IDs. Ownership of an inbox does not grant the agent access to its messages.

**NOT RELEASED: E1 and the build.** Tony requested these decisions/inputs be marked resolved and a concrete E1 release request returned. No provider/API calls, emails, Auth sessions, DEV writes, Git operations or deployment are authorized by this documentation update. The pending request is E1_RELEASE_REQUEST.md. E2, DEV apply, sample loading, independent QA and deployment retain their own boundaries.
