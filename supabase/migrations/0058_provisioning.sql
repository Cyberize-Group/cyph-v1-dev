-- APBM007A 0058: atomic Postgres step of the provisioning saga (DATA-01). Service-role EXECUTE only.
-- Creates account, first store, the owner's designated-admin membership, the customer mapping and the subscription
-- mirror in one transaction, from a paid operation whose NPI reservation is still bound to it. Safe to repeat.
create function public.provision_paid_registration(p_operation uuid, p_owner_user uuid, p_sub jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 o public.checkout_operations%rowtype;
 d public.registration_drafts%rowtype;
 v_account uuid; v_business uuid; v_subscription uuid;
begin
 select * into o from public.checkout_operations x where x.id = p_operation for update;
 if not found then return jsonb_build_object('outcome','unknown_operation'); end if;
 if o.status = 'provisioned' then
  return jsonb_build_object('outcome','already_provisioned','account_id',o.account_id,'business_id',o.business_id);
 end if;
 if o.status not in ('paid','provisioning') then return jsonb_build_object('outcome','not_paid'); end if;
 if o.stripe_customer_id is distinct from p_sub->>'customer_id' or o.stripe_subscription_id is distinct from p_sub->>'subscription_id' then
  return jsonb_build_object('outcome','mapping_mismatch');
 end if;
 if not exists (select 1 from auth.users u where u.id = p_owner_user) then
  return jsonb_build_object('outcome','owner_missing'); end if;
 if exists (select 1 from public.accounts a where a.owner_user_id = p_owner_user) then
  return jsonb_build_object('outcome','owner_has_account'); end if;
 select * into d from public.registration_drafts x where x.id = o.draft_id for update;
 if d.npi is distinct from o.npi or not public.npi_is_valid(o.npi) then
  return jsonb_build_object('outcome','scope_changed'); end if;
 if not exists (select 1 from public.npi_reservations r where r.operation_id = o.id and r.npi = o.npi and r.status = 'checkout_bound') then
  return jsonb_build_object('outcome','reservation_lost'); end if;

 insert into public.accounts(name, owner_user_id) values (d.pharmacy_name, p_owner_user) returning id into v_account;
 insert into public.businesses(account_id, npi, ncpdp, pharmacy_name, address, city, state, zip, phone,
   pharmacy_software_system, contact_person, contact_person_last_name, business_email, status, date_of_registration)
  values (v_account, o.npi, d.ncpdp, d.pharmacy_name, d.address, d.city, d.state, d.zip, d.phone,
   d.software, d.owner_first_name, d.owner_last_name, d.owner_email, 'active', now())
  returning id into v_business;
 -- the owner is the first store's designated admin; ownership itself comes from accounts.owner_user_id
 insert into public.user_businesses(user_id, business_id, role, is_primary) values (p_owner_user, v_business, 'admin', true);
 insert into public.billing_customers(account_id, stripe_customer_id) values (v_account, p_sub->>'customer_id');
 insert into public.subscriptions(account_id, origin, stripe_customer_id, stripe_subscription_id, stripe_checkout_session_id,
   status, raw_status, quantity, stripe_price_id, stripe_subscription_item_id, current_period_start, current_period_end,
   cancel_at_period_end, cancel_at, latest_invoice_id, latest_invoice_status, promotion_code, verified_at, policy_version)
  values (v_account, 'stripe', p_sub->>'customer_id', p_sub->>'subscription_id', o.stripe_checkout_session_id,
   p_sub->>'status', p_sub->>'raw_status', (p_sub->>'quantity')::integer, p_sub->>'price_id', p_sub->>'item_id',
   (p_sub->>'current_period_start')::timestamptz, (p_sub->>'current_period_end')::timestamptz,
   coalesce((p_sub->>'cancel_at_period_end')::boolean, false), (p_sub->>'cancel_at')::timestamptz,
   p_sub->>'latest_invoice_id', p_sub->>'latest_invoice_status', o.promotion_code,
   (p_sub->>'verified_at')::timestamptz, p_sub->>'policy_version')
  returning id into v_subscription;
 update public.npi_reservations r set status = 'consumed' where r.operation_id = o.id and r.status = 'checkout_bound';
 update public.checkout_operations x set status = 'provisioned', owner_user_id = p_owner_user, account_id = v_account,
   business_id = v_business, lease_owner = null, lease_expires_at = null, last_error_code = null where x.id = o.id;
 update public.registration_drafts x set status = 'provisioned' where x.id = o.draft_id;
 return jsonb_build_object('outcome','provisioned','account_id',v_account,'business_id',v_business,'subscription_id',v_subscription);
end $$;
revoke all on function public.provision_paid_registration(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.provision_paid_registration(uuid,uuid,jsonb) to service_role;

do $$
begin
 if has_function_privilege('anon','public.provision_paid_registration(uuid,uuid,jsonb)','EXECUTE')
    or has_function_privilege('authenticated','public.provision_paid_registration(uuid,uuid,jsonb)','EXECUTE') then
  raise exception 'APBM007A/0058 ASSERT: provisioning function is executable by customers'; end if;
 if not (select prosecdef from pg_proc where oid='public.provision_paid_registration(uuid,uuid,jsonb)'::regprocedure) then
  raise exception 'APBM007A/0058 ASSERT: provisioning function is not SECURITY DEFINER'; end if;
end $$;
