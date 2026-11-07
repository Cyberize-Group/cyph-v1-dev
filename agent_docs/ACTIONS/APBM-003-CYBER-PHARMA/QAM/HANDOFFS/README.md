# HANDOFFS/ — indexed checkpoint packages, external receipts, review entry notes (`APBM-003-CYBER-PHARMA`)

> Instantiated 2026-11-05 by Friday from TEMPLATE SET v0.3 (QA Lead accepted 2026-10-14) under QAM_PLAYBOOK v1.0.

This lane holds: Cody's `ENGINEERING_HANDOFF.md`; the writer-transfer log `QA_HANDOFF.md`; every review ZIP (`APBM-003-CYBER-PHARMA_<PHASE>_REVIEW_<NN>.zip`); the **external receipts** table below (ZIP SHA-256 and the reviewer's decision, recorded outside the ZIP); and the unfilled `REVIEW_START_HERE.md` / `FILE_INDEX.template.json` the Executor copies into each package. Build and verify per `../QAM_PACKAGING.md`; never rebuild a ZIP to insert its own hash.

| Package | Phase / attempt | Produced at (pre-export state entry) | Members | SHA-256 (external receipt) | Decision returned (by, date) |
|---|---|---|---|---|---|
| `APBM-003-CYBER-PHARMA_Q1_REVIEW_01.zip` | Q1 / 01 | 2026-11-07 14:56 +0600 (state entry 15:05) | 65 | `845de226ce1c3e8a608fa4a0649c3c4aa11c12b1eb09513b8ba66b3ed50770a9` | NOT RECORDED — QA Lead (JARVIS) decision pending |

Q1/01 bound inputs: plan `QAM_TEST_PLAN.md` DRAFT SHA-256 `8bc53eba9a80cb716c954c2bd83d149d22650c17e0694901b549cd96aaaff8a9`; recon `QAM_RECON_REPORT.md` SHA-256 `69244312f6222bcd408e7d6d156fca8059b617e61f9711b9d08703bf8e2bf0cf`; candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1`. Byte-identical Downloads copy: `/home/moose/Downloads/APBM-003-CYBER-PHARMA_Q1_REVIEW_01_20261107T145615.zip`.
| `APBM-003-CYBER-PHARMA_Q1b_REVIEW_01.zip` | Q1b / 01 | 2026-11-07 16:26 +0600 (state entry 16:20) | 17 | `f26f407f7d1a641f890720fbf67adb100cb90ad67ea0408396ca0cf9c9473ed9` | NOT RECORDED — QA Lead (Friday) binding pending |

Q1b/01 bound inputs: plan `QAM_TEST_PLAN.md` after AM-1…AM-6 SHA-256 `e8c4d5ac46635c2054e2d61073197db695ecd542a6281d4e561b0a6854bce061`; candidate `308247a24e6ddd455842da5cd2e21541d7eae2c1`; decision source `QAM_APPROVAL.md` §1 (Friday, APPROVED WITH EXACT AMENDMENTS, installed by the Director). Privacy scan: 5 patterns, fixture 5/5, control 0, package 0. Byte-identical Downloads copy: `/home/moose/Downloads/APBM-003-CYBER-PHARMA_Q1b_REVIEW_01_20261107T162618.zip`. Q1/01 decision returned: APPROVED WITH EXACT AMENDMENTS by Friday (QA Lead), 2026-11-07 — recorded in `QAM_APPROVAL.md` §1.

AM-7 re-bind package (Downloads only, not a review attempt): `/home/moose/Downloads/APBM-003-CYBER-PHARMA_Q1b_AM7_01_20261107T165422.zip` · 6 members · SHA-256 `e421265845178bb6e3859c4e276d1c188ddf3a8956942ed50a7dcb2f3671cc90` · plan after AM-1…7 `194538a7a7701c4b35aa731b17197f4e6ddb577d43ce4f7ac8bbdb383a5cfea4`.
