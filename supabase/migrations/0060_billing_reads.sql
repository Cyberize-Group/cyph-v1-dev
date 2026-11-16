-- APBM007A 0060: owner-only billing overview, member-safe access state, and billing redaction in admin_stores
-- (DATA-01, RA-3, RA-6, AC-027, AC-031). Access state is computed here from server time, never from the browser.

-- Internal: one account's access state under policy access-v1. Not callable by customers.
create function public.account_access_state(p_account uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare s public.subscriptions%rowtype; v_state text; v_grace_ends timestamptz;
begin
 select * into s from public.subscriptions x where x.account_id = p_account
  order by (x.status is distinct from 'canceled') desc, x.created_at desc, x.id limit 1;
 if not found then
  return jsonb_build_object('state','none','read_only',false,'origin',null,'policy_version','access-v1');
 end if;
 if s.origin = 'synthetic_seed' then
  v_state := case when s.status in ('active','trialing') then 'active'
                  when s.status = 'past_due' then 'past_due_reminder'    -- banner only: no invoice anchors a grace clock
                  when s.status = 'canceled' then 'ended' else 'none' end;
 elsif s.status = 'canceled' then v_state := 'ended';
 elsif s.status = 'incomplete' then v_state := 'none';
 elsif s.grace_started_at is not null then
  v_grace_ends := s.grace_started_at + interval '7 days';
  v_state := case when now() < v_grace_ends then 'grace' else 'read_only' end;
 elsif s.status = 'unpaid' then v_state := 'read_only';
 elsif s.status = 'past_due' then v_state := 'grace';
 else v_state := 'active';
 end if;
 return jsonb_build_object('state', v_state, 'read_only', v_state in ('read_only','ended'), 'origin', s.origin,
  'grace_ends_at', v_grace_ends, 'policy_version', 'access-v1',
  'cancel_scheduled', (s.status is distinct from 'canceled') and (s.cancel_at is not null or s.cancel_at_period_end));
end $$;
revoke all on function public.account_access_state(uuid) from public,anon,authenticated;
grant execute on function public.account_access_state(uuid) to service_role;

-- Any member of the store may learn its access state (for the banner and the read-only hook). No billing detail.
create function public.store_access_state(p_business_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare acct uuid; r jsonb;
begin
 select b.account_id into acct from public.businesses b
  where b.id = p_business_id and b.id in (select public.my_business_ids());
 if acct is null then raise exception 'not a member of business' using errcode='42501'; end if;
 r := public.account_access_state(acct);
 return jsonb_build_object('state', r->'state', 'read_only', r->'read_only', 'origin', r->'origin',
  'policy_version', r->'policy_version', 'is_owner', public.is_owner_of_account(acct));
end $$;
revoke all on function public.store_access_state(uuid) from public,anon;
grant execute on function public.store_access_state(uuid) to authenticated;

-- The owner's billing overview. No Stripe identifier is returned; server routes resolve those with the service role
-- after their own owner check.
create function public.owner_billing_overview()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare acct uuid; s public.subscriptions%rowtype; result jsonb; v_found boolean;
begin
 select a.id into acct from public.accounts a where a.owner_user_id = auth.uid() order by a.created_at, a.id limit 1;
 if auth.uid() is null or acct is null then raise exception 'not the owner of an account' using errcode='42501'; end if;
 select * into s from public.subscriptions x where x.account_id = acct
  order by (x.status is distinct from 'canceled') desc, x.created_at desc, x.id limit 1;
 v_found := found;
 result := jsonb_build_object('account_id', acct, 'access', public.account_access_state(acct),
  'subscription', case when v_found then jsonb_build_object('id', s.id, 'origin', s.origin, 'status', s.status, 'raw_status', s.raw_status,
    'quantity', s.quantity, 'current_period_start', s.current_period_start, 'current_period_end', s.current_period_end,
    'cancel_at', s.cancel_at, 'cancel_at_period_end', s.cancel_at_period_end,
    'paid_through', coalesce(s.cancel_at, s.current_period_end),
    'latest_invoice_status', s.latest_invoice_status, 'grace_started_at', s.grace_started_at, 'verified_at', s.verified_at) else null end,
  'stores', (select coalesce(jsonb_agg(jsonb_build_object('id', b.id, 'name', b.pharmacy_name, 'npi', b.npi, 'status', b.status)
             order by b.pharmacy_name, b.id), '[]'::jsonb) from public.businesses b where b.account_id = acct));
 insert into public.audit_logs(actor_user_id,actor_role,business_id,table_name,action,context)
 values(auth.uid(),'authenticated',null,'subscriptions','read_page',jsonb_build_object('fn','owner_billing_overview','account_id',acct));
 return result;
end $$;
revoke all on function public.owner_billing_overview() from public,anon;
grant execute on function public.owner_billing_overview() to authenticated;

-- admin_stores: the subscription status is returned to the account owner only; a store admin gets the store fields.
create or replace function public.admin_stores(p_business_id uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.businesses b where
 (p_business_id is null or b.id=p_business_id) and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) then
 raise exception 'not an administrator of business' using errcode='42501'; end if;
 select coalesce(jsonb_agg(row_data order by row_data->>'name'),'[]'::jsonb) into result from (
 select jsonb_build_object('id',b.id,'account_id',b.account_id,'name',b.pharmacy_name,'ncpdp',b.ncpdp,'npi',b.npi,'status',b.status,
 'member_count',(select count(*) from public.user_businesses ub where ub.business_id=b.id))
 || case when public.is_owner_of_account(b.account_id) then jsonb_build_object(
 'subscription_status',(select s.status from public.subscriptions s where s.account_id=b.account_id order by s.created_at desc,s.id limit 1))
 else '{}'::jsonb end row_data
 from public.businesses b where (p_business_id is null or b.id=p_business_id)
 and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) scoped;
 insert into public.audit_logs(actor_user_id,actor_role,business_id,table_name,action,context)
 values(auth.uid(),'authenticated',p_business_id,'businesses','read_page',jsonb_build_object('fn','admin_stores'));
 return result;
end; $$;
revoke all on function public.admin_stores(uuid) from public,anon;
grant execute on function public.admin_stores(uuid) to authenticated;

do $$
begin
 if has_function_privilege('anon','public.owner_billing_overview()','EXECUTE') or has_function_privilege('anon','public.store_access_state(uuid)','EXECUTE')
    or has_function_privilege('anon','public.account_access_state(uuid)','EXECUTE') or has_function_privilege('authenticated','public.account_access_state(uuid)','EXECUTE')
    or has_function_privilege('anon','public.admin_stores(uuid)','EXECUTE') then
  raise exception 'APBM007A/0060 ASSERT: a billing read function has a wrong EXECUTE grant'; end if;
 if not has_function_privilege('authenticated','public.owner_billing_overview()','EXECUTE')
    or not has_function_privilege('authenticated','public.store_access_state(uuid)','EXECUTE') then
  raise exception 'APBM007A/0060 ASSERT: a customer read function lost its EXECUTE grant'; end if;
end $$;
