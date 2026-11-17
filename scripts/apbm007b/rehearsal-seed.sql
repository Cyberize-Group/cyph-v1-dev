-- APBM-007B LOCAL rehearsal fixtures only (loaded by migrate-rehearsal.mjs --seed after 0060). Synthetic, no real data.
-- Two accounts and a foreign account, the 007A shapes 0061+ must preserve: owner, admin, member, claims, files.
insert into auth.users (id, email, aud, role, instance_id, created_at, updated_at) values
 ('aaaaaaaa-0000-4000-8000-000000000001', 'owner-a@rehearsal.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now()),
 ('aaaaaaaa-0000-4000-8000-000000000002', 'admin-a2@rehearsal.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now()),
 ('aaaaaaaa-0000-4000-8000-000000000003', 'member-a@rehearsal.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now()),
 ('bbbbbbbb-0000-4000-8000-000000000001', 'owner-b@rehearsal.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now()),
 ('cccccccc-0000-4000-8000-000000000001', 'foreign@rehearsal.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now())
 on conflict (id) do nothing;
insert into public.accounts (id, name, owner_user_id) values
 ('a0000000-0000-4000-8000-00000000000a', 'Rehearsal A', 'aaaaaaaa-0000-4000-8000-000000000001'),
 ('b0000000-0000-4000-8000-00000000000b', 'Rehearsal B', 'bbbbbbbb-0000-4000-8000-000000000001'),
 ('c0000000-0000-4000-8000-00000000000c', 'Rehearsal Foreign', 'cccccccc-0000-4000-8000-000000000001');
insert into public.businesses (id, account_id, ncpdp, npi, pharmacy_name, status, state) values
 ('a1000000-0000-4000-8000-0000000000a1', 'a0000000-0000-4000-8000-00000000000a', '0000001', '1003000001', 'A One', 'active', 'NY'),
 ('a2000000-0000-4000-8000-0000000000a2', 'a0000000-0000-4000-8000-00000000000a', '0000002', '1003000019', 'A Two', 'active', 'NY'),
 ('b1000000-0000-4000-8000-0000000000b1', 'b0000000-0000-4000-8000-00000000000b', null, '1003000027', 'B One', 'active', 'NJ'),
 ('c1000000-0000-4000-8000-0000000000c1', 'c0000000-0000-4000-8000-00000000000c', null, '1003000035', 'Foreign One', 'active', 'CT');
insert into public.user_businesses (user_id, business_id, role, is_primary) values
 ('aaaaaaaa-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-0000000000a1', 'admin', true),
 ('aaaaaaaa-0000-4000-8000-000000000002', 'a2000000-0000-4000-8000-0000000000a2', 'admin', true),
 ('aaaaaaaa-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-0000000000a1', 'member', true),
 ('aaaaaaaa-0000-4000-8000-000000000003', 'a2000000-0000-4000-8000-0000000000a2', 'member', false),
 ('bbbbbbbb-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-0000000000b1', 'admin', true),
 ('cccccccc-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-0000000000c1', 'admin', true);
insert into public.billing_customers (account_id, stripe_customer_id) values
 ('a0000000-0000-4000-8000-00000000000a', 'cus_rehearsalA'), ('b0000000-0000-4000-8000-00000000000b', 'cus_rehearsalB');
insert into public.subscriptions (account_id, origin, stripe_customer_id, stripe_subscription_id, status, raw_status, quantity, stripe_price_id,
  stripe_subscription_item_id, current_period_start, current_period_end, cancel_at_period_end, verified_at, policy_version) values
 ('a0000000-0000-4000-8000-00000000000a', 'stripe', 'cus_rehearsalA', 'sub_rehearsalA', 'active', 'active', 2, 'price_rehearsal', 'si_rehearsalA', now() - interval '10 days', now() + interval '20 days', false, now(), 'v1'),
 ('b0000000-0000-4000-8000-00000000000b', 'stripe', 'cus_rehearsalB', 'sub_rehearsalB', 'active', 'active', 1, 'price_rehearsal', 'si_rehearsalB', now() - interval '10 days', now() + interval '20 days', false, now(), 'v1');
insert into public.user_data (business_id, drug_name, status) select b, 'SYNTHETIC ' || g, 'owed'
 from unnest(array['a1000000-0000-4000-8000-0000000000a1'::uuid, 'a2000000-0000-4000-8000-0000000000a2', 'b1000000-0000-4000-8000-0000000000b1']) b, generate_series(1, 5) g;
insert into public.report_files (business_id, file_name) values
 ('a1000000-0000-4000-8000-0000000000a1', 'synthetic-a1.csv'), ('b1000000-0000-4000-8000-0000000000b1', 'synthetic-b1.csv');
