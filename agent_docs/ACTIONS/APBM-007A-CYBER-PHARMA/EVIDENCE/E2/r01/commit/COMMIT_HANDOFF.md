# Two-repository commit handoff — APBM007A v1.0, E2 run apbm007a_e2_r01

Prepared by the engineering seat on 13 November 2026 for the Director. **Nothing is committed by Engineering.** No branch switch, push or deployment. Candidate = the working trees reviewed as `APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r02` plus the commit-handoff and Q1 records written since.

- Manifest: `COMMIT_MANIFEST.json`, SHA-256 `46347bbd5533cbee2f5fed9633ad57a5e942e9cb514011ea18d53b6917449658`. It lists every path with its change type, SHA-256 and git blob id (`git hash-object`, read-only); deletions carry the HEAD blob being removed.
- This folder (`agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r01/commit/`) is itself committed with the OwedBook records but is not hashed in the manifest, because the manifest cannot contain its own hash.
- Pathspec lists (one literal path per line): `owedbook-product-add.txt`, `owedbook-product-rm.txt`, `owedbook-records-add.txt`, `owedbook-records-rm.txt`, `portal-product-add.txt`, `portal-product-rm.txt`, `portal-records-add.txt`, `portal-records-rm.txt`.

## 1. Product files

### OwedBook — `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`, branch `apbm-007a`, base `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694`

58 paths: 34 added, 24 modified, 0 deleted.

| Change | Path | Git blob | SHA-256 (first 16) |
|---|---|---|---|
| A | `scripts/rls-harness/apbm007a-proof.mjs` | `1722dc3f6ec84fc921b27966cbada4e9a250f463` | afb860c8ad47d564 |
| A | `scripts/seed/sample-claims.mjs` | `2e28d0a6b10d175493b94c7828032cd66530319b` | 0005283fb441f605 |
| A | `src/__tests__/apbm007a-access.test.tsx` | `28b05444c45399141d3cc4b6db8c294b73c093d1` | 7adaa0a72f09b387 |
| A | `src/__tests__/apbm007a-auth.test.ts` | `31528dee8ce2ef26a45556023a5fc24820ad130d` | 1efedb573ac562b0 |
| A | `src/__tests__/apbm007a-boundaries.test.ts` | `0b07489e861fe5141c41b23532141383e52bec8c` | 281374f122e0da59 |
| A | `src/app/(auth)/auth/confirm/page.tsx` | `d315e9cf8bc1ec260e9efb25c2424a783a0ad020` | 5e64120984cbf4d7 |
| A | `src/app/(auth)/auth/handoff-recovery/page.tsx` | `9212e221f2678dd1efabca069b021a7daf1eb3c2` | 747e5b7327521ebd |
| A | `src/app/(auth)/auth/link-expired/page.tsx` | `f1068c7cac54d6f058b512ef63d9cee87055d963` | c81c9ec6305faa08 |
| A | `src/app/(auth)/auth/sign-in-to-continue/page.tsx` | `1fb705409928fceb14d86d1146a1633d3ad5a2ef` | 3ec6b870ae9ca00a |
| A | `src/app/(auth)/auth/signed-out/page.tsx` | `b826fb57f7035561236bbd9cbde95c24ef49e224` | be3efe2ec21c6a5c |
| A | `src/app/(auth)/auth/switch/page.tsx` | `4f791ba0d64c4b8f17c94c97ac4ae0f68f535e5e` | 280f30acc2918e0a |
| A | `src/app/api/access-state/route.ts` | `fcf3285693acb8971f9eb3b6b32d3f749522cef8` | 4064c449d613e3a2 |
| A | `src/app/api/auth/link/route.ts` | `b79ecea78936b7cc339aa1d89084879d5f412b36` | 349a1edc4808a641 |
| A | `src/app/api/handoff/authorize/route.ts` | `8567b8fc26fe8d3111cb913f8263d156218893d8` | e6a6b30e3795ba4d |
| A | `src/app/api/handoff/callback/route.ts` | `7b97347f3098d3b6da5b86b10d413466e2766b15` | 3ab7014fb88bec5b |
| A | `src/app/api/handoff/start/route.ts` | `c0c6c5414c515ed32f4bf990257fbf677cccdf3a` | 29032ceee25de77e |
| A | `src/app/api/handoff/switch/route.ts` | `4e05d75eb5bc8569846586a2bcda206d8361bf50` | 58212609853d3194 |
| A | `src/components/auth/AuthPages.tsx` | `74aa9330d84b9bf51556e1b1d463ef4de90cb003` | 24cb73ae2bfdeb7d |
| A | `src/components/auth/LinkRequestForm.tsx` | `132fdb30f4e4027224af68a5eebfe11e381dded4` | b0a612eee92569fe |
| A | `src/components/owedbook/AccessBanner.tsx` | `11803d209fad76f277fa599846d286c9ccd4e7fa` | 5a5212724cb81683 |
| A | `src/lib/appIdentity.ts` | `7ea924da212f8c080676f096a83f504123b688b1` | e2ee36b92b5e7c48 |
| A | `src/server/accessState.ts` | `0f8302e111fba141b859d181754b3dbf642c05c6` | c5b1b5fac0c2521a |
| A | `src/server/afterSignIn.ts` | `e7646a1a1abb71ac69b430994f2d5d4e0dbd5a82` | c0550c3a6bd45533 |
| A | `src/server/db.ts` | `49fa21cb91df584a76af8a98e020c787e9c77606` | af89920297a6684d |
| A | `src/server/emailLink.ts` | `32f13783ee17c98fd8cae58a303ffc7a80f69c21` | 4bf39128610ebc52 |
| A | `src/server/handoff.ts` | `fe7053cdb9165542552098e1134d96480e90c64a` | f5b81fcd971fd40d |
| A | `supabase/migrations/0053_privilege_hardening.sql` | `be1b9003f465352fbafd438a1bd030f39101e375` | c79b20d48eaa0b49 |
| A | `supabase/migrations/0054_store_identifiers.sql` | `6386d4e8967681714190a08563d1c7f29be21cc1` | a2fd2ba1e1f58cb4 |
| A | `supabase/migrations/0055_billing_mirror.sql` | `18812bce6b860a5f67c8e431b28039e1b8667d3e` | 3059cd2f81c4bdfe |
| A | `supabase/migrations/0056_registration.sql` | `8753a68e9bba5ec4583c65fe26b46aca0c042317` | f64e70f804923f23 |
| A | `supabase/migrations/0057_operations_events.sql` | `ef3d5ee008f56a1778af86a17f8d6d0d77155fbc` | dd8d844b7c04cd52 |
| A | `supabase/migrations/0058_provisioning.sql` | `bd5abaf9ce1990f2e759c94964bd7cc0d7555e59` | 09464fe4c0feb45e |
| A | `supabase/migrations/0059_handoff_codes.sql` | `9851a1d48826af7d0f538882093c8fcb0ba0c920` | 33462cdaef2e466b |
| A | `supabase/migrations/0060_billing_reads.sql` | `0fcb17f938fadb8f36e567c49a13c2af20e71803` | 85e9715e9faa5cb1 |
| M | `package.json` | `d034bbdcbe48945832e3bd6aa7f366fdbc55b777` | d56432fd1d0e5530 |
| M | `scripts/apply-forward.mjs` | `441d3e38dc2b82ba27651e89f95c0afa9c911855` | f2a0f454e52e01d6 |
| M | `scripts/db-verify.mjs` | `c28fee0c1d82d5b6db6b91f9533ef691ba664fea` | a6cdb7c5b1293e45 |
| M | `scripts/dev-verify.mjs` | `702d0912b75d93d96b4aa2d67bf17841eb612626` | a39f1709737a6620 |
| M | `scripts/rls-harness/audit-catalog.mjs` | `b715abb7d79d398aa6c9a674a73d93e4c9201a1c` | 26a0eb236c04fc0c |
| M | `scripts/rls-harness/audit-session.mjs` | `9b36c159dca2abb016d56c1e803116453e856c90` | e0eb9e9f288f7514 |
| M | `scripts/rls-harness/expectations.json` | `c038facd725a55acd435b10030e5961a3a742d3a` | fa4b661830e15e41 |
| M | `scripts/rls-harness/lib/env.mjs` | `a299191cadafca207b12c46959781e9b94e43a3f` | afefb004ca142f95 |
| M | `scripts/rls-harness/seed.mjs` | `5e7619890da178523d64058e5d91feadebadb202` | 8b5e69e30536fe72 |
| M | `scripts/seed/run.mjs` | `3992cf79749fec222e60dd0d28fd541c016d002f` | 7937210a0bf6cf5d |
| M | `src/__tests__/apbm-admin-readonly.test.tsx` | `7055279e2a644f484489d347bdc421a04f23e777` | 13a34d1cee207925 |
| M | `src/__tests__/auth/AuthPage.test.tsx` | `113e82caf971cb565368d51f217d48cd648739f2` | 2be52f6b07d11969 |
| M | `src/__tests__/jest.setup.ts` | `20439693b4056fc807851e43ec89914c4c8de3ff` | c964653cc0c4e1a4 |
| M | `src/app/api/auth/confirm/route.ts` | `459047c4d90f4d99827a64a29a58a88c6a98e225` | 9125426152ad632d |
| M | `src/app/api/auth/logout/route.ts` | `c0fa2fed942e80c786d6ea68107f2c5fa5084841` | 15a070b685854e33 |
| M | `src/components/admin-portal/BillingRow.tsx` | `9c9f28f15c502c307cbdfa997e5d3e9a12a6c393` | af7dd37206f1307e |
| M | `src/components/admin-portal/BillingScreen.tsx` | `cf24acd34e0a01618fd2fc92018039f7ee6566f5` | 77c272b9320c0209 |
| M | `src/components/auth/LoginForm.tsx` | `7848fd1888e31ae78ab60ce43a80e0c28f080d0b` | 35c05c4714dd69bb |
| M | `src/components/owedbook/OwedBookScreen.tsx` | `912fbb1e6dacb73ce2a655de7a843cc69c6813c0` | 9c6802a38946805f |
| M | `src/services/adminDemo.ts` | `cf8c6d4118d989af8f527c0198f630a441aa40ee` | 67c76f5bbfac5f66 |
| M | `src/utils/supabase/admin.ts` | `02a1df92cc255019e5d4fed7f3d854937e37aa59` | 665de1c14c0c01b3 |
| M | `src/utils/supabase/client.ts` | `ef8005a5660faa6a44d9d72712f9e6c3144a588a` | 18a349b7c1c26406 |
| M | `src/utils/supabase/middleware.ts` | `689405df63249609b2b6ff886a2a9f8438cb6f2b` | f65c119ad4ded140 |
| M | `src/utils/supabase/server.ts` | `b7f6a04fe10ed997e7d2336d422944f6ec9c6ac5` | 5b191d0a1274055f |

### Payment Portal — `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`, branch `apbm-007a`, base `c89572a45210e7d6f098c2878cfabe9a1c5326f1`

131 paths: 66 added, 45 modified, 20 deleted. `package-lock.json` is included deliberately (ESLint and `eslint-config-next` dev dependencies).

| Change | Path | Git blob | SHA-256 (first 16) |
|---|---|---|---|
| A | `eslint.config.mjs` | `1b1d1bdac9a237dad892d4fbf87ee9387b588580` | f564e4ed3cb4ff30 |
| A | `scripts/operator-reconcile.mjs` | `c68361576bd84fa1692d868af3eecc878139d038` | 7c2ad30e820be387 |
| A | `scripts/stripe-catalogue.mjs` | `2e3bf05af4f582dd05c3d9be96a8088827e2eb23` | 20a27de6bb6d4614 |
| A | `src/__tests__/apbm007a-auth.test.ts` | `31528dee8ce2ef26a45556023a5fc24820ad130d` | 1efedb573ac562b0 |
| A | `src/__tests__/apbm007a-mail-guard.test.ts` | `b18fc9d61756cabc9a2423020cf7e340537eda4e` | f0e8955e745b3ec7 |
| A | `src/__tests__/apbm007a-server.test.ts` | `673f942db292939beb70f515be7daa0d2c6efeb1` | 400127c446331bc2 |
| A | `src/__tests__/portal-activation.test.tsx` | `e6ae807116594130e8ec5c565e8e96d9dd3598c8` | 80d4379e047dd433 |
| A | `src/__tests__/portal-api.test.ts` | `05a41e13ad925ad2705661499a97927f928c549d` | 4c6e904ddb59694b |
| A | `src/__tests__/portal-review.test.tsx` | `c52ca5e35aaa31c97190bd0483d9a8793893797b` | 9f40acf201250687 |
| A | `src/__tests__/portal-shell.test.tsx` | `24ea1a0beffdfadbba982557138b4b29d7ad6cae` | 83b01e5176d74237 |
| A | `src/app/(account)/billing/page.tsx` | `8f2abfdf41219e0e1300a6b4df90fc5bf3b00f60` | 9dce71c323cad825 |
| A | `src/app/(public)/register/activation/page.tsx` | `8eb1b887b8ef8a7ef421375ed5c691c65a7d7097` | 64ad4d93af8c1fb2 |
| A | `src/app/(public)/register/owner/page.tsx` | `d390529446750a0febc3ce39c445c02b57c885e4` | 44662a7310d8de71 |
| A | `src/app/(public)/register/pharmacy/page.tsx` | `3065d95de179dfea5d284d5b136d408bef091e03` | 54a9846e15f7cc83 |
| A | `src/app/(public)/register/plan/page.tsx` | `c98fe9dc07fcf6aad8cb0d74b995540875dbccfa` | 7b17c0bbf1c7d120 |
| A | `src/app/(public)/register/review/page.tsx` | `147756929432015ba046f9bb080de6e3dcaec29e` | c81774398dd83b00 |
| A | `src/app/api/auth/link/route.ts` | `b79ecea78936b7cc339aa1d89084879d5f412b36` | 349a1edc4808a641 |
| A | `src/app/api/billing/overview/route.ts` | `c63dc471fd7efdf5e2e57c6012840e64ff3ece4b` | 45ee886b16953ad4 |
| A | `src/app/api/billing/portal/route.ts` | `cad71c2abb5085c53331bf4ab6e15225271044ab` | 1fbfcc7a20d855a6 |
| A | `src/app/api/billing/undo-cancel/route.ts` | `8c98fd490d3f2661b2f4ecff484415ae34c862db` | fa3c4de1c68a5054 |
| A | `src/app/api/handoff/authorize/route.ts` | `8567b8fc26fe8d3111cb913f8263d156218893d8` | e6a6b30e3795ba4d |
| A | `src/app/api/handoff/callback/route.ts` | `7b97347f3098d3b6da5b86b10d413466e2766b15` | 3ab7014fb88bec5b |
| A | `src/app/api/handoff/start/route.ts` | `c0c6c5414c515ed32f4bf990257fbf677cccdf3a` | 29032ceee25de77e |
| A | `src/app/api/handoff/switch/route.ts` | `4e05d75eb5bc8569846586a2bcda206d8361bf50` | 58212609853d3194 |
| A | `src/app/api/operator/operations/route.ts` | `74ba0a00d217e83d599d4cf3134e87ffc9fef794` | 4f8725faed84c8aa |
| A | `src/app/api/registration/checkout/route.ts` | `7adb129f9887279de2936d2f5454a9eddd7d049e` | 91018f7a7397cc5c |
| A | `src/app/api/registration/draft/route.ts` | `70fe5f9fba565ae460dd6a4978d98f26b8f75b3a` | e3cd8e155cbf26e8 |
| A | `src/app/api/registration/quote/route.ts` | `f1a0e1c319b46a0782b585f0cd45de08fd7e8fb9` | 7faf8767974abf86 |
| A | `src/app/api/registration/status/route.ts` | `4e848093b93d97db7120be82f43503240cea5cf6` | e59824cbf82b8699 |
| A | `src/app/api/webhooks/stripe/route.ts` | `aa053eadda81cdac4455f11108b298c54ddda9f8` | 1f8b89e10984fa9b |
| A | `src/app/auth/confirm/page.tsx` | `be3b2ddafcc5b6f7780f201d64cb0212fa7b5b67` | 7f1b6964d24256b5 |
| A | `src/app/auth/handoff-recovery/page.tsx` | `81401148d0abaffa710f7d87349a8a5d03cb59c6` | 6e4bfaf8761ba7d5 |
| A | `src/app/auth/link-expired/page.tsx` | `8f5158df32c09ab4aec0360cf9c41aab281699ed` | b1121364cbfd687b |
| A | `src/app/auth/sign-in-to-continue/page.tsx` | `365e5caa9d154dd31efe5b5f0dfe57884414aa71` | 314b8f6c32b4fae3 |
| A | `src/app/auth/signed-out/page.tsx` | `2942957cb2de926e542deda5d87e0663fb605af6` | ce069436fd4722a0 |
| A | `src/app/auth/switch/page.tsx` | `0570948b0dde4d73136dd48aa4bfc9ecb3ee2ffd` | bc41babd57750add |
| A | `src/components/auth/AuthPages.tsx` | `5acab1d600a6c9dfd4d25e54c6decfc967bd5212` | 99f6d28dccacb2a4 |
| A | `src/components/auth/LinkRequestForm.tsx` | `6954d1055147346a0f263da968bf8fc8fed4e2a7` | 2725e640eafe5351 |
| A | `src/components/portal/register/useRegistrationDraft.ts` | `1ca3143147324540048773fab13f424753000dc6` | 8df22dadbba7782f |
| A | `src/integration/apbm007a-scratch.itest.ts` | `44206e8d1335dfbe9a1880994cba7d52abc12de7` | bb803bbaef86ad07 |
| A | `src/lib/appIdentity.ts` | `6cc76282222eeafd17a56939cbca0d9ea05c1c4c` | 74df3be3b09fc734 |
| A | `src/server/accessEmail.ts` | `cede19adfe5734b68496dab75fbd66c1ab5d500c` | 45ee23db23073e12 |
| A | `src/server/afterSignIn.ts` | `35f185d9daec42e40a3fb480b6ea84c0f551b5a4` | 2fedabe2d67e80ef |
| A | `src/server/billing.ts` | `e690d40f0403c16512262aad4ec5bc1bb4d9ec5d` | 064f5899cc2ce780 |
| A | `src/server/checkout.ts` | `bc6440383874fe567ac1f221f8f99abc22985853` | 20476f78e512c804 |
| A | `src/server/db.ts` | `842d682da49a9784f7b32f21a9aa2a75e7f65348` | 72348ab6aa9df251 |
| A | `src/server/emailLink.ts` | `32f13783ee17c98fd8cae58a303ffc7a80f69c21` | 4bf39128610ebc52 |
| A | `src/server/errors.ts` | `706063ff4a3d497357535c2b83104636582ba2e6` | bce453fbe6c1ce68 |
| A | `src/server/handoff.ts` | `fe7053cdb9165542552098e1134d96480e90c64a` | f5b81fcd971fd40d |
| A | `src/server/http.ts` | `c4f45dc8324a3166cd17b6550e889f9dc92e50cc` | d06109f318f47958 |
| A | `src/server/operator.ts` | `8a53a2346b49a7ae235f3d18bc81e3d6d61e808a` | 890046a33758afbe |
| A | `src/server/pricing.ts` | `1f6e0c2aaf9b71416bcb3eda84ecf6c8e0460f9e` | 07da467663adff9c |
| A | `src/server/provisioning.ts` | `05b04ff670f985941b8b0c9452c2323de0ef85f7` | 1bf02da9b7f44745 |
| A | `src/server/registration.ts` | `896828d605d167733fb0eb33a28e93a1e2986563` | 65bb6cc1266f614a |
| A | `src/server/registrationStatus.ts` | `60a0ff39fdd6eb83998d8447ab0f5386f669a48c` | 561b9c397c143ab0 |
| A | `src/server/stripeClient.ts` | `a9096fe3d60f695f26d5ff9030a481f8445b1ecf` | 1c40086ae4ad6416 |
| A | `src/server/stripeMirror.ts` | `bab174c2ff2aea430e99787d72d0cc7ea67cb8ac` | 2b8749e7ce008e5b |
| A | `src/server/webhook.ts` | `23b0788f806a7f4b5842cd744ac6177f265d4ce6` | f20fa6e9dcc22ba6 |
| A | `src/services/portal/ffm.ts` | `a3b5f8b9b10f0fdbf76218e1525f5f7730c1f121` | 299d3b3a21562526 |
| A | `src/services/portal/navigate.ts` | `d092728f819541146857d9aa878f77278780da9c` | 3133778ae5b10d65 |
| A | `src/services/portal/npi.ts` | `30e836f8ec356b497537d3c6516302c1ee8a2f55` | e3c803c21d337496 |
| A | `src/services/portal/portalApi.ts` | `d3dce0a398fe6bc3152a1d1a7035e5f5892a74d5` | bdbb8984f07eb338 |
| A | `src/services/portal/reference.ts` | `4b7274c1a805720d051c8995795f8f5cb582342a` | 2c021f46dce99f3a |
| A | `src/services/portal/registrationForm.ts` | `4a9e1e8bd3ea6fe6fdfb4e87608d59bcc765d419` | 04d87e6d419a6f49 |
| A | `src/services/portal/registrationSession.ts` | `d7517b8ca7a6d328dfbddb832740e1472d3a85c0` | 4bac09f14b5998a5 |
| A | `src/types/portal/api.ts` | `b5f3d61ba664d215651a72c7c8a00f8b4ae20efa` | 80c25f9d0b486ccb |
| D | `src/__tests__/portal-checkout-hold.test.tsx` | `7bbcf240b859068d626397949cc44c5a382d6429` (HEAD, removed) | — |
| D | `src/app/(account)/demo/references/owedbook/page.tsx` | `5add4cd37f08bfd81e060917329308b97a67caaa` (HEAD, removed) | — |
| D | `src/app/(account)/demo/stores/add/page.tsx` | `32c80c0e3ffb497f5c3b5f9f55c8ca916aec57b1` (HEAD, removed) | — |
| D | `src/app/(account)/demo/stores/confirm/page.tsx` | `43db3cf8ca943bc78ba4c922e4ea241a1ddeb484` (HEAD, removed) | — |
| D | `src/app/(account)/demo/stores/result/page.tsx` | `0fa5853010b95407eeeaeb55d4a5050422f2fa57` (HEAD, removed) | — |
| D | `src/app/(handoff)/demo/stripe/page.tsx` | `ed57d121338f1baa317a2815e273c4d24ff397a1` (HEAD, removed) | — |
| D | `src/app/(handoff)/layout.tsx` | `b85a5cbf9b1acb9189032cde6d06b3877aff5b98` (HEAD, removed) | — |
| D | `src/app/(public)/demo/access-link/page.tsx` | `ba570409bb8a3ae0e75b5c79cf74e769a191146d` (HEAD, removed) | — |
| D | `src/app/(public)/demo/activation/page.tsx` | `33f1bec27c5cc3c32555558061d4c2a24bcab42d` (HEAD, removed) | — |
| D | `src/app/(public)/demo/checkout-incomplete/page.tsx` | `75bea40091ad16eb9b82e47a187e7818a73b57e8` (HEAD, removed) | — |
| D | `src/app/(public)/demo/references/email/page.tsx` | `ae1b20c18b653fc907463e9fb5b148ca849e46c6` (HEAD, removed) | — |
| D | `src/app/(public)/demo/register/owner/page.tsx` | `e6ca810f86de69b5da217a9e7db15b585ef7d2b3` (HEAD, removed) | — |
| D | `src/app/(public)/demo/register/pharmacies/page.tsx` | `be1f85f5f4ce601f03d42ce56da4becbd51606bc` (HEAD, removed) | — |
| D | `src/app/(public)/demo/register/plan/page.tsx` | `02c81d1ea351c634f81238e62c394a14e869e0aa` (HEAD, removed) | — |
| D | `src/app/(public)/demo/register/review/page.tsx` | `127c41be122a7949f4f05e6ad1b12918ce10eba0` (HEAD, removed) | — |
| D | `src/app/demo/sign-in/page.tsx` | `603d4e70b57531db77b8e22c934aedc954aab76b` (HEAD, removed) | — |
| D | `src/components/portal/AccountStrip.tsx` | `e16dfcab1fa8d5f2f2cd4e23997cc92009e44324` (HEAD, removed) | — |
| D | `src/components/portal/PublicDemoControls.tsx` | `f624ce6477968576c8d1a9270892701f10b7afc0` (HEAD, removed) | — |
| D | `src/components/portal/handoff/CheckoutStandIn.tsx` | `6448e617dc4f3e1547d1304e9a7d3ec734abb67f` (HEAD, removed) | — |
| D | `src/components/portal/handoff/PortalStandIn.tsx` | `ceaa6e19983d6ce1e1d7ac010a630c0181d5538c` (HEAD, removed) | — |
| M | `package-lock.json` | `6785c6f32a29d4bc62b8bb58e1977acfdb53b9f3` | 28e2d2f86028a28b |
| M | `package.json` | `151e76c8075bdb91f0fc3dea842ce68d39cb4b88` | 86d46986dbe4135f |
| M | `src/__tests__/login-form.test.tsx` | `80d4daebd23dc130c8f7c59b827815ff63152316` | b114d18120ccb03c |
| M | `src/__tests__/portal-access.test.tsx` | `8c080680c7b815a0be73da6f2bb594bef4c84978` | b16b4faf2cda58a7 |
| M | `src/__tests__/portal-boundaries.test.ts` | `9f4fd77a09f226034e0d2e65f1c0b3c3debe9f4e` | d378b753eb1e7423 |
| M | `src/__tests__/portal-dashboard.test.tsx` | `834c1033952cfe44aba494d4fe943c1998bc4e45` | 8ac321ecbb123be9 |
| M | `src/__tests__/portal-owner.test.tsx` | `d407a67ec5bff2034e901ba15420489112f3bdec` | 2e262a2c63dacf28 |
| M | `src/__tests__/portal-stripe-route.test.tsx` | `8dc526022cc2f29035e9f411d2f321956130be51` | 6aff14e3fdabeb48 |
| M | `src/app/(account)/dashboard/page.tsx` | `517d6d62b5e5b7dfbdb84a0046b04c0d497d7943` | be0f025e0fec0b69 |
| M | `src/app/(account)/layout.tsx` | `fa9be6f4ad771e62595af410e07b38eb0f9f3c99` | ca235954ef8c1c99 |
| M | `src/app/(account)/loading.tsx` | `479672ed08be885deae1081fed346b2b2a7418fe` | 814508db0b4fbe5f |
| M | `src/app/(public)/layout.tsx` | `cdfe8e00415c249ba1b0fb510cc8a76f9a45eea8` | d83ba9f649e4d58b |
| M | `src/app/api/auth/confirm/route.ts` | `459047c4d90f4d99827a64a29a58a88c6a98e225` | 9125426152ad632d |
| M | `src/app/api/auth/logout/route.ts` | `c0fa2fed942e80c786d6ea68107f2c5fa5084841` | 15a070b685854e33 |
| M | `src/app/login/LoginPageContent.tsx` | `333c5882fcd0410de8d7add1411ff830a1d37536` | 796dbce6d90aa92c |
| M | `src/app/login/page.tsx` | `c6d5913060a35f7a724e9b97ed70a156d28f31d0` | f5fc5757156a17ad |
| M | `src/app/page.tsx` | `9fa6954c7026e3a1f6e1f3c71038da3d3262c927` | bb4b4795f045f767 |
| M | `src/components/portal/HandoffShell.tsx` | `1102af45ba329e022c7d0408df140d1f22578576` | 96bf5f7ef9071009 |
| M | `src/components/portal/PharmacyFields.tsx` | `1aa590cfc0974334f64290f9838ec37c3e2ef936` | a346be3e34629a2d |
| M | `src/components/portal/PublicShell.tsx` | `cd0796aad1e9d9503955a3cadfe38be5e244059d` | a90eb1aacea0b362 |
| M | `src/components/portal/RadioCard.tsx` | `f21f6d722a2d52af7d2b8556c41aa6f9f9b28661` | 18fe822fc8029c33 |
| M | `src/components/portal/Shell.tsx` | `496c153dfdb2ba3d638a79be929ec1d1f65fde88` | 6ea248dbfa59b6b6 |
| M | `src/components/portal/account/AccountGate.tsx` | `cb9e505f7c1fe05675e5c65ba7a18225ab45a0ac` | ce93789fe03aacce |
| M | `src/components/portal/account/AddStoreView.tsx` | `a18f4b51dccb183a6104f0720399dcf5d757fe68` | a2006ce011fe2ecc |
| M | `src/components/portal/account/ConfirmStoreView.tsx` | `d3103a2d6527517cfda278bfb275700c8c6cd8ff` | 598b9de734369fb6 |
| M | `src/components/portal/account/DashboardView.tsx` | `eee03c40d7f803547068a5721d2c46ece8c6f548` | 870387a9ec76f60b |
| M | `src/components/portal/account/OwedBookReferenceView.tsx` | `2d4d3aa01f41c957d1e81886457e8062cd2a2118` | bef9b536d4887346 |
| M | `src/components/portal/account/StoreResultView.tsx` | `4b9a5bde03caf1955eace6fae82488185a102b6f` | 6b4f2e1f3ddf007c |
| M | `src/components/portal/activation/AccessLinkView.tsx` | `e988cebc52d897f1e8d511078ebbc9ddc1eca27c` | 867af1a97acefa49 |
| M | `src/components/portal/activation/ActivationView.tsx` | `ec5116739c7c5e1189a2092da0dbe4113a309a88` | a327bf7a80c3bf26 |
| M | `src/components/portal/activation/CheckoutIncompleteView.tsx` | `c3b73d00c35e85d5f74b55a7f3efad57d57bb705` | fb0ce4fcac66af43 |
| M | `src/components/portal/brand.ts` | `cdb248a2438fde1fc63292b8e4a95872e7dfccca` | 14ac855f546eaf3d |
| M | `src/components/portal/references/EmailReferenceView.tsx` | `055bafd98cd15bc12b0b1b8471c1e5fa26de8e56` | 77866e43185a1449 |
| M | `src/components/portal/register/OwnerView.tsx` | `0937f97d4db7de2a11d39e30375993b5830867ac` | c83befda62e9fc2a |
| M | `src/components/portal/register/PharmacyStepView.tsx` | `5161389b106655de52f64312e5405323f43c3ec0` | be3848f5f9129fa4 |
| M | `src/components/portal/register/PlanView.tsx` | `79554586a79c25e27400f9acb40828d7fac7a903` | 71017b9629c36766 |
| M | `src/components/portal/register/ReviewView.tsx` | `10b00a7014abf2e9ad8a6af685a29fb82cb38e02` | c5d00df881b906b5 |
| M | `src/services/auth/session.ts` | `7bba6988fbffc05caf32b5fa7d7e9124b8957b4f` | e530c07138d801ba |
| M | `src/services/portal/catalog.ts` | `d7159b92768f4682eeb0ef99a67a1b2018f15877` | 577d1642143eb09d |
| M | `src/services/portal/format.ts` | `b552825a49078993507296fbe11719e688093fef` | ec69655a57a1c4e7 |
| M | `src/services/portal/index.ts` | `9bb8c18d05d2aadcbe57c129568f22e53bd22cd8` | 05bcde054622c247 |
| M | `src/types/auth.ts` | `cf2ba02421c5bf8f2daa5b574ddbb86229144097` | 1aa242f0bcb7cbab |
| M | `src/utils/supabase/client.ts` | `ef8005a5660faa6a44d9d72712f9e6c3144a588a` | 18a349b7c1c26406 |
| M | `src/utils/supabase/middleware.ts` | `1fb47c76b61219e05be364537f4615d92c4b74fd` | ce1cfca723471f11 |
| M | `src/utils/supabase/server.ts` | `b7f6a04fe10ed997e7d2336d422944f6ec9c6ac5` | 5b191d0a1274055f |

## 2. Records to retain (separate commits)

### OwedBook module records — 307 hashed paths plus this folder (10 files)

Exact list: `owedbook-records-add.txt` (and this folder). Per-path hashes: manifest. By folder:

| Folder | Files |
|---|---|
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA` | 30 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/CONTRACTS` | 6 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE` | 1 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E1` | 80 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2` | 91 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/apply` | 20 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/GOVERNING` | 21 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/GOVERNING/HISTORY` | 35 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM` | 16 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/AUTOMATION` | 1 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/GOVERNING` | 1 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS` | 4 |
| `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/evidence` | 1 |

### Payment Portal operating records — 31 paths

| Change | Path | Git blob | SHA-256 (first 16) |
|---|---|---|---|
| A | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA_POINTER.md` | `6e1f7a7a476b3a4e5e237dfe38a09ce67b1edf85` | f5378eb4c6598f8a |
| A | `agent_docs/RESPONSES/response_2026-11-11_170400_e1-a01-interim.md` | `636e3924a27e357a67565783aa3a0045ef61b8e3` | 3c203b18402244c1 |
| A | `agent_docs/RESPONSES/response_2026-11-12_093400_e1-a01-return.md` | `6be0fc4c26a26c8d0e6a308c417a7965e6ebd830` | 4705db51a2c2e3fc |
| A | `agent_docs/RESPONSES/response_2026-11-12_104500_e1-a01-portal-cleanup.md` | `4dd4c00737ef908870669875e2406c2d0cf72a95` | 570ec84bd227f8b6 |
| A | `agent_docs/RESPONSES/response_2026-11-12_111500_e1-a01-db-check.md` | `da0b16fcc9b48b0efe47d52ce193431c9bf59375` | b156ff12de79268c |
| A | `agent_docs/RESPONSES/response_2026-11-12_114500_e1-a01-db-results.md` | `41cf9abb5670bdca642b875db76ec33b13189201` | c2237680ab67a5ea |
| A | `agent_docs/RESPONSES/response_2026-11-12_120000_e1-a01-email-observations.md` | `83bcf480585fbfaade47ccb1fa56a1146f798306` | 5b7ff73224e73567 |
| A | `agent_docs/RESPONSES/response_2026-11-12_124500_e1-a01-owner1-fresh-email.md` | `a50d7596c116b0b5e67eb67604ad4bce5accd901` | 8cec81a7642883c3 |
| A | `agent_docs/RESPONSES/response_2026-11-12_133700_e1-a01-owner1-inbox-check.md` | `1226022c066535f87ae376f93362a6c5ae0894e2` | 5019ad67a99aed6b |
| A | `agent_docs/RESPONSES/response_2026-11-12_134500_e1-a01-magic-link-template-proposal.md` | `7f288d2d86609e515a018f512ff349b83d400814` | 3ee6cc3c202a7ef9 |
| A | `agent_docs/RESPONSES/response_2026-11-12_135500_e1-a01-ob-server-ready.md` | `a7c9c437b264fad586a6f6ab2021dddd816af87f` | c955afe9a842be87 |
| A | `agent_docs/RESPONSES/response_2026-11-12_142800_e1-a01-owner1-revised-template-email.md` | `84b494b9c85b3acacc50f7ec08daa0c85d5b9c63` | 4747fe6f4c4f1f74 |
| A | `agent_docs/RESPONSES/response_2026-11-12_144500_e1-a01-owedbook-email-login-pass.md` | `4912aadbe5cdb3bcbc6834c4e44facb071525d78` | 1bcbd78c8a226678 |
| A | `agent_docs/RESPONSES/response_2026-11-12_150000_e1-a01-scratch-identity.md` | `dc4630441607e6206e909ef7b66c1f715d238c17` | c263b60caabe51a8 |
| A | `agent_docs/RESPONSES/response_2026-11-12_151500_e1-a01-scratch-ledger.md` | `a9ff383f1fb2db90f9cb4a7448559f0627ca3752` | df6c9051b64a6e8d |
| A | `agent_docs/RESPONSES/response_2026-11-12_154500_e1-a01-final-return.md` | `8a5f0c8dd4d97b5d618ada26150cbff3b84f623e` | 94b9e92622eb2496 |
| A | `agent_docs/RESPONSES/response_2026-11-12_160500_apbm007a-v1-install.md` | `dee1aafc7642940fc053df02c59919e88538a3f4` | 97fc1386997a53bb |
| A | `agent_docs/RESPONSES/response_2026-11-12_185000_e2-backup-prep-blocked.md` | `7febd994f3d6adce8fd405560849df4b206873e7` | e14228c6cd5e3990 |
| A | `agent_docs/RESPONSES/response_2026-11-12_190000_dev-apply-0053-0060.md` | `184d45f620221b17d55c62e3c4991e25e747b45f` | 299c77f658fb4678 |
| A | `agent_docs/RESPONSES/response_2026-11-12_191500_e2-apply-review-zip.md` | `a5b81ca11b834c4754fe2a2bf8c6544fd433bad3` | 00908f815f6e17ca |
| A | `agent_docs/RESPONSES/response_2026-11-12_191500_integrated-proof-blocked.md` | `c1aecca9009b3921098a1ce77a3114798828a4bb` | 4a7f45fc7aeecc24 |
| A | `agent_docs/RESPONSES/response_2026-11-12_195000_e2-r01-apply-checkpoint.md` | `eab81ac8424d6760f1c1867636d049b28aea977e` | 7bba59a05afe6a9f |
| A | `agent_docs/RESPONSES/response_2026-11-12_204000_e2-r01-code-complete-to-checkpoint.md` | `db54b11d472612a506091330fa175b0064690c68` | 6709120943bd178f |
| A | `agent_docs/RESPONSES/response_2026-11-12_211500_e2-engineering-return.md` | `75cb492a498e62bdd1f3a71f6320dd391d22763d` | 77140eaa86e54d30 |
| A | `agent_docs/RESPONSES/response_2026-11-13_101500_b4-closure-blocked.md` | `c6526f45e3c682476a822a5615667d17f45d480e` | d4b4248de7084d9c |
| A | `agent_docs/RESPONSES/response_2026-11-13_103000_b4-webhook-closed.md` | `56bf493587d52ff518d872760fbeb2a3cde578f7` | 38e90d1ffd048832 |
| A | `agent_docs/RESPONSES/response_2026-11-13_110000_commit-handoff.md` | `d3b5570c302ab44d60ac65a61c0cf297626c08c9` | 27bea707be247a47 |
| A | `agent_docs/SESSIONS/session_2026-11-11.md` | `c8cc2ce4a18668a90b2e306d5bdece49af744f99` | 7901e48b5994fe11 |
| A | `agent_docs/SESSIONS/session_2026-11-12.md` | `3bbfb3a2cfaeda975ada2ceeacb0ac30c2bf62e2` | eeecaf23a88c9089 |
| A | `agent_docs/SESSIONS/session_2026-11-13.md` | `2991335e174f3a33d595337d64f7862e4793ae60` | 1f7d597be2d4bf9f |
| M | `RECOVERY.md` | `577e7b86a447563f8be09137f42301963548ec72` | 3b74dea7dce07c4a |

All text records passed the package scanner (key patterns, tokens, database URLs, sign-in links, credential fields, private inbox addresses). Allowed by rule: reserved fixture domains (`.invalid`, `.test`, `.example`, `.local`), the two public addresses in the governing text, a form placeholder, browser cookie names in a result listing, and public npm author metadata in the lock file.

## 3. Excluded

### In the repositories — not to be committed

| Repo | Path | Reason |
|---|---|---|
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_APPLY_REVIEW_r01.zip` | derived review archive (contents already retained as records); sha256 3bcfb74217093eb82479f83914b8c80c6a46a07de15d0ab2a35a3cd06ba0e015 |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01.zip` | derived review archive (contents already retained as records); sha256 283f00cd517c991ad87ede7d977d8d29d33fa80659edf19175c5fc95dac110a9 |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r2.zip` | derived review archive (contents already retained as records); sha256 e30233b89a71f40666d2ee889f3433d223f0f5ec0ec009e7fb5ea4c9351e408c |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r3.zip` | derived review archive (contents already retained as records); sha256 c6b7e9552534241450a7454acc51318cc20cc4c40f74cfe318d63313986e6ec8 |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r4.zip` | derived review archive (contents already retained as records); sha256 752e34734b96354c08faf9fd80863a3f4e4163c5b76bb619d1dfb302d7510eaa |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r5.zip` | derived review archive (contents already retained as records); sha256 3c36712675c78ee1c16b4bc1811f55a0f526291419b080bee92312eab0f224de |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r6.zip` | derived review archive (contents already retained as records); sha256 8d2aea485d2d86ab3ef504f1e19a5d19156687d74c5dec1e3b9abfac86dcead2 |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r01.zip` | derived review archive (contents already retained as records); sha256 9be2a131ec74ea9928f511e40870ae392e15cab35aab28bbaed6e5117e2fda55 |
| owedbook | `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r02.zip` | derived review archive (contents already retained as records); sha256 0e39567443889cba48e62b2076164f41eaf3338b8325cba8ae7298187fc45d75 |

Also untouched and not to be added: everything already ignored by `.gitignore` (`.env*`, `.next/`, `node_modules/`, build info).

### Outside the repositories — private, never committed or packaged

| Item | Location |
|---|---|
| Application and tooling credentials | `cyph-v1-dev/.env.local`, `cyph-payment-portal-dev-v1/.env.local` (ignored) |
| Approved test inbox mapping | `/home/moose/.config/cyph/apbm007a-test-inboxes.env` |
| APBM003 seeded-cast login sheet | `/home/moose/Documents/` (private) |
| DEV logical export (pre-0053) | `/home/moose/.config/cyph/backups/` |
| SCRATCH cast credential files | `/tmp/apbm007a-e2-scratch-*.json`, `/tmp/apbm003-*` |
| Work lanes: helpers, screenshots showing a private test address, saved browser sessions | `/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E1_WORK/`, `…/ARCHIVE/APBM007A_E2_WORK/` |
| Copies handed to the Director | `/home/moose/Downloads/` |

## 4. Commands — copy and paste, one repository at a time

Each block refuses to continue if the branch or base is wrong or the index is not empty, stages only the listed paths (literal pathspecs; no blanket add), and runs the verifier after staging and after each commit. If a verifier prints FAIL, stop and do not commit; `git restore --staged .` undoes staging without touching files.

### OwedBook

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
L={L}
export GIT_LITERAL_PATHSPECS=1
[ "$(git branch --show-current)" = apbm-007a ] && [ "$(git rev-parse HEAD)" = {ob['base']} ] && git diff --cached --quiet || echo "STOP: wrong branch/base or index not empty"

# commit 1 — product
git add --pathspec-from-file="$L/owedbook-product-add.txt"
python3 "$L/verify_commit.py" owedbook product staged
git commit -m "APBM007A v1.0 E2: forward migrations 0053-0060, handoff and emailed-link auth, access state, tooling" -m "Run apbm007a_e2_r01. Reviewed as E2_ENGINEERING_r02; manifest {msha[:16]}." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$L/verify_commit.py" owedbook product committed

# commit 2 — module records
git add --pathspec-from-file="$L/owedbook-records-add.txt"
git add -- "{REL}"
python3 "$L/verify_commit.py" owedbook records staged
git commit -m "APBM007A v1.0: module records, E1 and E2 evidence, DEV apply receipts, QA handoff" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$L/verify_commit.py" owedbook records committed
git status --short   # expected left over: only the nine excluded review ZIPs
```

### Payment Portal

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
L={L}
export GIT_LITERAL_PATHSPECS=1
[ "$(git branch --show-current)" = apbm-007a ] && [ "$(git rev-parse HEAD)" = {pp['base']} ] && git diff --cached --quiet || echo "STOP: wrong branch/base or index not empty"

# commit 1 — product (includes 20 deletions of the FFM demo routes and reviewer controls)
git add --pathspec-from-file="$L/portal-product-add.txt"
git rm --quiet --pathspec-from-file="$L/portal-product-rm.txt"
python3 "$L/verify_commit.py" portal product staged
git commit -m "APBM007A v1.0 E2: real registration, Stripe checkout and webhooks, provisioning, owner billing, handoff and emailed-link auth" -m "Run apbm007a_e2_r01. FFM demo routes, reviewer controls and Stripe stand-in removed. Reviewed as E2_ENGINEERING_r02; manifest {msha[:16]}." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$L/verify_commit.py" portal product committed

# commit 2 — operating records
git add --pathspec-from-file="$L/portal-records-add.txt"
python3 "$L/verify_commit.py" portal records staged
git commit -m "APBM007A: operating records (recovery, sessions, responses, module pointer)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
python3 "$L/verify_commit.py" portal records committed
git status --short   # expected: clean
```

The two repositories can be done in either order. The list files live in the OwedBook module, so the portal block reads them from there; do not edit any listed file between now and the commit, or its blob will no longer match. Record the four resulting commit IDs in `APBM_STATE.md` (or tell me and I record them). Push is outside this handoff.

## 5. For Q1

Open items are carried in `../ENGINEERING_HANDOFF.md` §11: NOT RUN N1–N13 (brand-new owner first), incomplete implementation I1–I7, risks R1–R7. R1: supported webhook events with an unresolved mapping are recorded as `ignored` (`error_code = 'unmapped'`) and answered 200, so Stripe does not retry — challenge the mapping race and retry behaviour. Outgoing checkout record: `../../../../QAM/HANDOFFS/QA_HANDOFF.md`.
