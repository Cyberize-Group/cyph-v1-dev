# user_data lexical inventory

Complete rg -n user_data src scripts supabase output classified by source. Comments/types are distinguished from executable reads during RECON_REPORT Q3.5.

| Location | Class | Source text |
|---|---|---|
| supabase/migrations/0045_owedbook_rows.sql:5 | migration | -- OwedBookRow (OwedBook.ts:5-26) built from STORED user_data columns per the approved A-3 map: |
| supabase/migrations/0045_owedbook_rows.sql:18 | migration |   if to_regclass('public.user_data') is null then |
| supabase/migrations/0045_owedbook_rows.sql:19 | migration |     raise exception 'BIM-003/0045 ASSERT: public.user_data missing.'; end if; |
| supabase/migrations/0045_owedbook_rows.sql:69 | migration |     p_business_id, 'user_data', null, 'read_page', null, null, |
| supabase/migrations/0045_owedbook_rows.sql:83 | migration |   from public.user_data ud |
| supabase/migrations/0045_owedbook_rows.sql:117 | migration |     from public.user_data ud |
| scripts/db-verify.mjs:19 | harness / verification |   "user_data", "report_files", "audit_logs", |
| scripts/db-verify.mjs:26 | harness / verification |   user_data: ["medicaid_rate", "acq", "acq_net", "difference", "total_paid", "payment", |
| scripts/db-verify.mjs:34 | harness / verification |   ["drug_ndc", ["user_data"]], ["ndc", ["aac_reference", "wac_reference", "ful_reference"]], |
| scripts/db-verify.mjs:35 | harness / verification |   ["script", ["user_data"]], ["bin", ["user_data", "pbm_info"]], |
| scripts/db-verify.mjs:36 | harness / verification |   ["pcn", ["user_data", "pbm_info"]], ["group_field", ["user_data"]], |
| scripts/db-verify.mjs:171 | harness / verification |   await check("AC10 medicaid_method CHECK (7 values)", "user_data", |
| scripts/db-verify.mjs:216 | harness / verification |       await q(`insert into public.user_data (business_id, medicaid_method) |
| scripts/db-verify.mjs:219 | harness / verification |     await q(`insert into public.user_data (business_id, medicaid_method) |
| supabase/migrations/0044_owedbook_kpis.sql:4 | migration | -- updated_difference · owed. Aggregates STORED user_data columns only (A-3): no rate math. |
| supabase/migrations/0044_owedbook_kpis.sql:16 | migration |   if to_regclass('public.user_data') is null then |
| supabase/migrations/0044_owedbook_kpis.sql:17 | migration |     raise exception 'BIM-003/0044 ASSERT: public.user_data missing.'; end if; |
| supabase/migrations/0044_owedbook_kpis.sql:56 | migration |     p_business_id, 'user_data', null, 'read_page', null, null, |
| supabase/migrations/0044_owedbook_kpis.sql:72 | migration |     from public.user_data ud |
| supabase/migrations/0021_rls_user_data.sql:1 | migration | -- BIM-002 · 0021 · user_data — the PHI fact table. Full T-1 + T-2 set. |
| supabase/migrations/0021_rls_user_data.sql:18 | migration |   if to_regclass('public.user_data') is null then |
| supabase/migrations/0021_rls_user_data.sql:19 | migration |     raise exception 'BIM-002/0021 ASSERT: public.user_data missing.'; end if; |
| supabase/migrations/0021_rls_user_data.sql:20 | migration |   if not (select relrowsecurity from pg_class where oid = 'public.user_data'::regclass) then |
| supabase/migrations/0021_rls_user_data.sql:21 | migration |     raise exception 'BIM-002/0021 ASSERT: RLS not enabled on user_data.'; end if; |
| supabase/migrations/0021_rls_user_data.sql:24 | migration |   if exists (select 1 from pg_policies where schemaname='public' and tablename='user_data') then |
| supabase/migrations/0021_rls_user_data.sql:25 | migration |     raise exception 'BIM-002/0021 ASSERT: user_data already carries a policy.'; end if; |
| supabase/migrations/0021_rls_user_data.sql:28 | migration | create policy "user_data_select_member" |
| supabase/migrations/0021_rls_user_data.sql:29 | migration |   on public.user_data for select to authenticated |
| supabase/migrations/0021_rls_user_data.sql:32 | migration | create policy "user_data_insert_member" |
| supabase/migrations/0021_rls_user_data.sql:33 | migration |   on public.user_data for insert to authenticated |
| supabase/migrations/0021_rls_user_data.sql:36 | migration | create policy "user_data_update_member" |
| supabase/migrations/0021_rls_user_data.sql:37 | migration |   on public.user_data for update to authenticated |
| supabase/migrations/0021_rls_user_data.sql:41 | migration | create policy "user_data_delete_admin" |
| supabase/migrations/0021_rls_user_data.sql:42 | migration |   on public.user_data for delete to authenticated |
| scripts/rls-harness/audit-seed.mjs:5 | seed | //   · R-10 a small user_data set on A1 with insurance / new_paid / status populated, so the |
| scripts/rls-harness/audit-seed.mjs:42 | seed |     `insert into public.user_data (business_id, script, drug_name, insurance, status, total_paid, expected_paid, owed, new_paid, difference, date_dispensed) |
| scripts/rls-harness/audit-seed.mjs:48 | seed | console.log(`  r10: ${r10.length} user_data rows on A1 with insurance/new_paid/status populated (R-10)`); |
| supabase/migrations/0034_audit_stamp_user_data.sql:1 | migration | -- BIM-003-CYBER-PHARMA · 0034 · audit stamp · user_data |
| supabase/migrations/0034_audit_stamp_user_data.sql:6 | migration |   if to_regclass('public.user_data') is null then |
| supabase/migrations/0034_audit_stamp_user_data.sql:7 | migration |     raise exception 'BIM-003 STAMP ASSERT: public.user_data missing.'; end if; |
| supabase/migrations/0034_audit_stamp_user_data.sql:12 | migration |              where tgrelid = 'public.user_data'::regclass and tgname = 'audit_write') then |
| supabase/migrations/0034_audit_stamp_user_data.sql:13 | migration |     raise exception 'BIM-003 STAMP ASSERT: public.user_data already carries the audit_write trigger.'; end if; |
| supabase/migrations/0034_audit_stamp_user_data.sql:17 | migration |   after insert or update or delete on public.user_data |
| scripts/rls-harness/expectations.json:20 | harness / verification |     "user_data", |
| scripts/rls-harness/expectations.json:58 | harness / verification |       "user_data": { |
| scripts/rls-harness/expectations.json:106 | harness / verification |       "user_data": { |
| scripts/rls-harness/expectations.json:150 | harness / verification |       "user_data": { |
| scripts/rls-harness/expectations.json:195 | harness / verification |       "user_data": { |
| src/types/supabase.ts:708 | app declaration/comment (not a direct query) |       user_data: { |
| src/types/supabase.ts:870 | app declaration/comment (not a direct query) |             foreignKeyName: "user_data_business_id_fkey" |
| src/services/owedbook.ts:15 | app declaration/comment (not a direct query) |    * user_data joined with reference tables, scoped by RLS to the caller's business_id(s). |
| src/services/owedbook.ts:22 | app declaration/comment (not a direct query) |    * real impl queries user_data with WHERE/ORDER/LIMIT, RLS-scoped. |
| src/services/owedbook.ts:35 | app declaration/comment (not a direct query) |    * SELECT DISTINCT pbm FROM user_data (RLS-scoped). |
| scripts/rls-harness/payloads.mjs:22 | harness / verification |     user_data:                  { insert: { business_id: m.businesses.a1, script: "RX-PROBE", drug_name: "probe" }, patch: { drug_name: "probe-upd" }, target: m.samples.factA1 }, |
| scripts/rls-harness/payloads.mjs:30 | harness / verification |     audit_logs:                 { insert: { table_name: "user_data", action: "insert", actor_role: "authenticated" }, patch: { action: "update" }, target: 0 }, |
| scripts/rls-harness/attacks.mjs:47 | harness / verification | const factA1Drug = async () => (await svc.from("user_data").select("drug_name").eq("id", m.samples.factA1).single()).data?.drug_name; |
| scripts/rls-harness/attacks.mjs:48 | harness / verification | const factA1Biz  = async () => (await svc.from("user_data").select("business_id").eq("id", m.samples.factA1).single()).data?.business_id; |
| scripts/rls-harness/attacks.mjs:49 | harness / verification | const factA1Count = async () => (await svc.from("user_data").select("*", { count: "exact", head: true }).eq("business_id", m.businesses.a1)).count; |
| scripts/rls-harness/attacks.mjs:64 | harness / verification | await attack({ id: "A1.3", desc: "ownerB reads user_data A1 row by id", identity: "ownerB", |
| scripts/rls-harness/attacks.mjs:65 | harness / verification |   run: (c) => c.from("user_data").select("*").eq("id", m.samples.factA1) }); |
| scripts/rls-harness/attacks.mjs:72 | harness / verification | await attack({ id: "A2.1", desc: "ownerB INSERTs user_data with business_id = A1", identity: "ownerB", |
| scripts/rls-harness/attacks.mjs:73 | harness / verification |   run: (c) => c.from("user_data").insert({ business_id: m.businesses.a1, script: "ATTACK", drug_name: "attack" }).select(), |
| scripts/rls-harness/attacks.mjs:76 | harness / verification |   run: (c) => c.from("user_data").update({ drug_name: "attacked" }).eq("id", m.samples.factA1).select(), |
| scripts/rls-harness/attacks.mjs:79 | harness / verification |   run: (c) => c.from("user_data").delete().eq("id", m.samples.factA1).select(), |
| scripts/rls-harness/attacks.mjs:84 | harness / verification |   run: (c) => c.from("user_data").update({ business_id: m.businesses.b1 }).eq("id", m.samples.factA1).select(), |
| scripts/rls-harness/attacks.mjs:89 | harness / verification |   run: (c) => c.from("user_data").delete().eq("id", m.samples.factA1).select(), |
| scripts/rls-harness/attacks.mjs:92 | harness / verification |   run: (c) => c.from("user_data").delete().eq("id", m.samples.factA1).select(), |
| scripts/rls-harness/attacks.mjs:134 | harness / verification | for (const [i, t] of ["accounts", "businesses", "user_businesses", "user_data", "subscriptions"].entries()) { |
| scripts/rls-harness/seed.mjs:43 | seed | for (const t of ["user_data", "report_files", "subscriptions", "user_businesses", "businesses", |
| scripts/rls-harness/seed.mjs:92 | seed |     `insert into public.user_data (business_id, script, drug_ndc, drug_name, qty, payment, expected_paid, owed, date_dispensed) |
| scripts/rls-harness/seed.mjs:107 | seed |   (select count(*) from public.user_data)::int ud, (select count(*) from public.report_files)::int rf, |
| scripts/rls-harness/seed.mjs:110 | seed | console.log(`  rows: user_data=${counts.ud} report_files=${counts.rf} subscriptions=${counts.sb} user_roles=${counts.ur} profiles=${counts.pr} (+1 in each remaining table)`); |
| scripts/rls-harness/seed.mjs:112 | seed | const factA1 = await one(`select id from public.user_data where business_id=$1 limit 1`, [a1.id]); |
| scripts/rls-harness/seed.mjs:113 | seed | const factB1 = await one(`select id from public.user_data where business_id=$1 limit 1`, [b1.id]); |
| supabase/migrations/0047_owedbook_pbm_options.sql:7 | migration |   if to_regclass('public.user_data') is null then |
| supabase/migrations/0047_owedbook_pbm_options.sql:8 | migration |     raise exception 'BIM-003/0047 ASSERT: public.user_data missing.'; end if; |
| supabase/migrations/0047_owedbook_pbm_options.sql:38 | migration |     p_business_id, 'user_data', null, 'read_page', null, null, |
| supabase/migrations/0047_owedbook_pbm_options.sql:48 | migration |     from public.user_data ud |
| scripts/rls-harness/golden/audit_trail_expected.json:2 | harness / verification |   { "table_name": "user_data", "action": "insert", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": "<uuid>", "old_data": null, "new_data": "present", "context": null }, |
| scripts/rls-harness/golden/audit_trail_expected.json:3 | harness / verification |   { "table_name": "user_data", "action": "update", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": "<uuid>", "old_data": "present", "new_data": "present", "context": null }, |
| scripts/rls-harness/golden/audit_trail_expected.json:4 | harness / verification |   { "table_name": "user_data", "action": "delete", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": "<uuid>", "old_data": "present", "new_data": null, "context": null }, |
| scripts/rls-harness/golden/audit_trail_expected.json:6 | harness / verification |   { "table_name": "user_data", "action": "read_page", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": null, "old_data": null, "new_data": null, |
| scripts/rls-harness/golden/audit_trail_expected.json:8 | harness / verification |   { "table_name": "user_data", "action": "read_page", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": null, "old_data": null, "new_data": null, |
| scripts/rls-harness/golden/audit_trail_expected.json:10 | harness / verification |   { "table_name": "user_data", "action": "read_page", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": null, "old_data": null, "new_data": null, |
| scripts/rls-harness/golden/audit_trail_expected.json:12 | harness / verification |   { "table_name": "user_data", "action": "read_page", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": null, "old_data": null, "new_data": null, |
| scripts/rls-harness/golden/audit_trail_expected.json:14 | harness / verification |   { "table_name": "user_data", "action": "read_page", "actor_role": "authenticated", "actor_user_id": "admin-A", "business_id": "A1", "row_id": null, "old_data": null, "new_data": null, |
| scripts/rls-harness/golden/audit_trail_expected.json:16 | harness / verification |   { "table_name": "user_data", "action": "read_page", "actor_role": "authenticated", "actor_user_id": "multi", "business_id": "B1", "row_id": null, "old_data": null, "new_data": null, |
| supabase/migrations/0013_user_data.sql:1 | migration | -- BIM-001 · 0013_user_data — the PHI fact table (prescription/dispensing records). |
| supabase/migrations/0013_user_data.sql:18 | migration | create table public.user_data ( |
| supabase/migrations/0013_user_data.sql:84 | migration | create index idx_user_data_business_id on public.user_data (business_id); |
| supabase/migrations/0013_user_data.sql:86 | migration | alter table public.user_data enable row level security; |
| supabase/migrations/0013_user_data.sql:89 | migration |   before update on public.user_data |
| scripts/rls-harness/audit-session.mjs:5 | harness / verification | //   watermark → six tampering probes (AC-106) → admin-A insert/update/delete on user_data (AC-116/117) |
| scripts/rls-harness/audit-session.mjs:89 | harness / verification | say("\nAC-116/117 — admin-A INSERT → UPDATE → DELETE on user_data (A1)"); |
| scripts/rls-harness/audit-session.mjs:90 | harness / verification | const ins = await S["admin-A"].from("user_data").insert({ business_id: A1, script: "RX-SESSION", drug_name: "session" }).select().single(); |
| scripts/rls-harness/audit-session.mjs:93 | harness / verification | const upd = await S["admin-A"].from("user_data").update({ drug_name: "session-2" }).eq("id", sid).select(); |
| scripts/rls-harness/audit-session.mjs:95 | harness / verification | const del = await S["admin-A"].from("user_data").delete().eq("id", sid).select(); |
| scripts/rls-harness/audit-session.mjs:100 | harness / verification | check(t("insert")?.new_data && !t("insert")?.old_data && t("insert")?.business_id === A1 && t("insert")?.table_name === "user_data" && t("insert")?.row_id === sid, "insert: new_data only, business_id A1, table user_data, row_id = pk"); |
| scripts/rls-harness/audit-session.mjs:141 | harness / verification | const ai = await A.from("audit_logs").insert({ table_name: "user_data", action: "insert", actor_role: "authenticated" }).select(); |
| supabase/migrations/0046_owedbook_summary.sql:9 | migration |   if to_regclass('public.user_data') is null then |
| supabase/migrations/0046_owedbook_summary.sql:10 | migration |     raise exception 'BIM-003/0046 ASSERT: public.user_data missing.'; end if; |
| supabase/migrations/0046_owedbook_summary.sql:48 | migration |     p_business_id, 'user_data', null, 'read_page', null, null, |
| supabase/migrations/0046_owedbook_summary.sql:63 | migration |     from public.user_data ud |
| scripts/rls-harness/audit-wrappers.mjs:38 | harness / verification | say(`Generated ${new Date().toISOString()} by \`scripts/rls-harness/audit-wrappers.mjs\` against host \`${new URL(env.SUPABASE_URL).hostname}\` after \`seed.mjs\`. Identities: admin-A = ownerA (admin of A1), member-A = staffA (member of A1), anon. Business A = store A1, business B = store B1 (200 seeded user_data rows each).`); |
| scripts/rls-harness/x3-red-green.mjs:32 | harness / verification |   { file: "0021_rls_user_data.sql", |
| scripts/rls-harness/x3-red-green.mjs:33 | harness / verification |     delta: merge(all("user_data", "select"), |
| scripts/rls-harness/x3-red-green.mjs:34 | harness / verification |                  some(["ownerA", "staffA", "multiStore"], "user_data", "insert"), |
| scripts/rls-harness/x3-red-green.mjs:35 | harness / verification |                  some(["ownerA", "staffA", "multiStore"], "user_data", "update"), |
| scripts/rls-harness/x3-red-green.mjs:36 | harness / verification |                  some(["ownerA"], "user_data", "delete")), |
| scripts/rls-harness/revocation.mjs:36 | harness / verification | const rowsOf = async (biz) => (await c.from("user_data").select("*", { count: "exact", head: true }).eq("business_id", biz)).count; |
| scripts/rls-harness/scoping.mjs:19 | harness / verification | // Expected shape, derived from the seed cast (manager §5.3): 200 user_data rows |
| scripts/rls-harness/scoping.mjs:40 | harness / verification |   const { count } = await c.from("user_data").select("*", { count: "exact", head: true }); // F-2: counted, never inferred |
| scripts/rls-harness/scoping.mjs:55 | harness / verification | const { count: anonRows } = await anon.from("user_data").select("*", { count: "exact", head: true }); |
| scripts/rls-harness/audit-catalog.mjs:14 | harness / verification | const STAMPED = ["businesses", "user_businesses", "pending_registrations", "user_data", "report_files", |
| scripts/rls-harness/audit-catalog.mjs:79 | harness / verification |     const iRead = src.search(/from public\.user_data ud/); |
| scripts/rls-harness/audit-catalog.mjs:186 | harness / verification |   const u = (await q(`insert into public.user_data (business_id, script, drug_name) values ($1, 'RX-S1', 'smoke') returning id`, [b]))[0].id; |
| scripts/rls-harness/audit-catalog.mjs:187 | harness / verification |   await db.query(`update public.user_data set drug_name = 'smoke-2' where id = $1`, [u]); |
| scripts/rls-harness/audit-catalog.mjs:188 | harness / verification |   await db.query(`delete from public.user_data where id = $1`, [u]); |
| scripts/rls-harness/audit-catalog.mjs:195 | harness / verification |   check(byT("user_data", "insert")?.business_id === b && byT("user_data", "insert")?.row_id === u && byT("user_data", "insert")?.has_new && !byT("user_data", "insert")?.has_old, "user_data insert: business_id from row, row_id = pk, new_data only"); |
| scripts/rls-harness/audit-catalog.mjs:196 | harness / verification |   check(byT("user_data", "update")?.has_old && byT("user_data", "update")?.has_new, "user_data update: old_data AND new_data"); |
| scripts/rls-harness/audit-catalog.mjs:197 | harness / verification |   check(byT("user_data", "delete")?.has_old && !byT("user_data", "delete")?.has_new, "user_data delete: old_data only"); |
