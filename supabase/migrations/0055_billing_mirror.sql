-- APBM007A 0055: account-level billing mirror (BILL-01, RA-2, RA-3, RA-4). Owner-only billing reads.
-- One Stripe customer per account; subscriptions gain the mirrored fields; the three APBM003 fixture rows are
-- marked synthetic by exact identity. Nothing is deleted.

-- 1. Account <-> Stripe customer, unique both ways. Service-only.
create table public.billing_customers (
 id uuid primary key default gen_random_uuid(),
 account_id uuid not null unique references public.accounts(id),
 stripe_customer_id text not null unique check (stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'),
 created_at timestamptz not null default now()
);
alter table public.billing_customers enable row level security;   -- no policy: deny-all to customers
revoke all on public.billing_customers from public,anon,authenticated;
grant select,insert,update on public.billing_customers to service_role;
create trigger audit_write after insert or update or delete on public.billing_customers
 for each row execute function public.audit_write();

-- 2. Mirror columns. raw_status is Stripe's word; status stays our six-value vocabulary.
alter table public.subscriptions
 add column origin text not null default 'stripe' check (origin in ('stripe','synthetic_seed')),
 add column raw_status text,
 add column quantity integer check (quantity is null or quantity >= 1),
 add column stripe_price_id text,
 add column stripe_subscription_item_id text,
 add column current_period_start timestamptz,
 add column cancel_at timestamptz,
 add column latest_invoice_id text,
 add column latest_invoice_status text,
 add column grace_invoice_id text,
 add column grace_started_at timestamptz,
 add column verified_at timestamptz,
 add column policy_version text;

-- 3. Mark the APBM003 fixtures. Either the table holds no unlinked row (fresh chain; the seed marks its own rows)
--    or it holds exactly the three known rows. Anything else stops the migration.
do $$
declare n_unlinked int; n_match int; n_linked int;
begin
 select count(*) into n_linked from public.subscriptions
  where stripe_customer_id is not null or stripe_subscription_id is not null or stripe_checkout_session_id is not null;
 if n_linked > 0 then
  raise exception 'APBM007A/0055 ASSERT: % Stripe-linked subscription rows exist before 007A; stop for disposition', n_linked; end if;
 select count(*) into n_unlinked from public.subscriptions;
 select count(*) into n_match from public.subscriptions s
  where (s.id, s.account_id, s.status) in (
   ('f273325d-14b7-4921-aa99-9b4dda4eed1f'::uuid,'a6d4b0a2-62fe-4dc0-ab57-5a2255d6b129'::uuid,'active'),
   ('324794d8-c96d-4cbb-a146-e2d83c371492'::uuid,'fcb3c889-26ae-4e5e-a003-4b5186aab94b'::uuid,'trialing'),
   ('7252e65c-4616-4ece-ad1b-90883aba0cb0'::uuid,'6d6c91c3-93fc-4d61-a2b7-234944ffd51a'::uuid,'past_due'));
 if n_unlinked = 0 then
  null;
 elsif n_unlinked = 3 and n_match = 3 then
  update public.subscriptions set origin = 'synthetic_seed'
   where id in ('f273325d-14b7-4921-aa99-9b4dda4eed1f','324794d8-c96d-4cbb-a146-e2d83c371492','7252e65c-4616-4ece-ad1b-90883aba0cb0');
 else
  raise exception 'APBM007A/0055 ASSERT: expected none or exactly the three APBM003 fixture subscriptions, found % rows with % matching', n_unlinked, n_match;
 end if;
end $$;

-- 4. A Stripe row must be fully linked; a synthetic row must carry no Stripe identifier.
alter table public.subscriptions
 add constraint subscriptions_stripe_linked check (origin <> 'stripe' or
  (stripe_customer_id is not null and stripe_subscription_id is not null and stripe_price_id is not null
   and quantity is not null and raw_status is not null)),
 add constraint subscriptions_synthetic_unlinked check (origin <> 'synthetic_seed' or
  (stripe_customer_id is null and stripe_subscription_id is null and stripe_checkout_session_id is null));

-- 5. One current subscription per account; ended subscriptions are kept as history.
create unique index subscriptions_one_current on public.subscriptions(account_id) where status <> 'canceled';

-- 6. Billing rows are owner-only (was: any store member).
drop policy "subscription_select_member_or_owner" on public.subscriptions;
create policy "subscription_select_owner" on public.subscriptions for select to authenticated
 using (public.is_owner_of_account(account_id));

create or replace function public.admin_billing_status(p_business_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare acct uuid; result jsonb;
begin
 select b.account_id into acct from public.businesses b where b.id=p_business_id
 and public.is_owner_of_account(b.account_id);
 if acct is null then raise exception 'not the owner of account' using errcode='42501'; end if;
 select jsonb_build_object('account_id',acct,'subscriptions',coalesce(jsonb_agg(jsonb_build_object('id',s.id,'status',s.status,
 'trial_end_date',s.trial_end_date,'current_period_end',s.current_period_end,'cancel_at_period_end',s.cancel_at_period_end,
 'cancel_at',s.cancel_at,'origin',s.origin) order by s.created_at,s.id),'[]'::jsonb))
 into result from public.subscriptions s where s.account_id=acct;
 insert into public.audit_logs(actor_user_id,actor_role,business_id,table_name,action,context)
 values(auth.uid(),'authenticated',p_business_id,'subscriptions','read_page',jsonb_build_object('fn','admin_billing_status','account_id',acct));
 return result;
end; $$;
revoke all on function public.admin_billing_status(uuid) from public,anon;
grant execute on function public.admin_billing_status(uuid) to authenticated;

-- Catalogue assertion.
do $$
begin
 if has_table_privilege('anon','public.billing_customers','SELECT') or has_table_privilege('authenticated','public.billing_customers','SELECT')
    or has_table_privilege('authenticated','public.billing_customers','INSERT') then
  raise exception 'APBM007A/0055 ASSERT: billing_customers is reachable by customers'; end if;
 if not (select relrowsecurity from pg_class where oid='public.billing_customers'::regclass) then
  raise exception 'APBM007A/0055 ASSERT: RLS is off on billing_customers'; end if;
 if exists (select 1 from pg_policies where schemaname='public' and tablename='subscriptions' and policyname<>'subscription_select_owner') then
  raise exception 'APBM007A/0055 ASSERT: unexpected policy on subscriptions'; end if;
 if has_function_privilege('anon','public.admin_billing_status(uuid)','EXECUTE') then
  raise exception 'APBM007A/0055 ASSERT: anon can execute admin_billing_status'; end if;
end $$;
