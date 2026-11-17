-- APBM-007B 0069: Director rulings of 17 November 2026 that need SQL (0061–0067 are applied and never rewritten).
--  * Decision 9 APPROVED: a same-owner PAID re-add of a removed store (operator-authorized, BP-05) restores the ORIGINAL
--    ownership record and its history. Access returns only in the atomic activation after verified payment. A transferred
--    (sold) store can never be reactivated, so a buyer never reaches seller history.
--  * Ruling 3: the transfer buyer may come through normal REGISTRATION (identified by the exact buyer email), as well as
--    through Add Store from an existing account. The transfer hold is never released to the public.

-- 1. Schema additions
alter table public.store_quotes add column reactivation_business_id uuid references public.businesses (id);
alter table public.store_operations add column reactivation_business_id uuid references public.businesses (id);
alter table public.store_transfers alter column buyer_account_id drop not null,
 add column buyer_email text check (buyer_email is null or (buyer_email = lower(btrim(buyer_email)) and buyer_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
 add constraint store_transfers_buyer_identified check (buyer_account_id is not null or buyer_email is not null);
-- A transfer hold may additionally point at the buyer's registration draft (and its checkout operation).
alter table public.npi_reservations drop constraint npi_reservations_one_owner;
alter table public.npi_reservations add constraint npi_reservations_one_owner check (
 num_nonnulls(draft_id, store_operation_id, transfer_id) = 1 or (transfer_id is not null and store_operation_id is null and status in ('transfer_held', 'consumed')));

-- 2. Transfer authorization for a buyer identified by email (registration path). Same rules as the account form (0063).
create function public.store_transfer_authorize(p_source_business uuid, p_buyer_account uuid, p_buyer_email text, p_effective_at timestamptz, p_hold_hours integer, p_ref text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare b public.businesses%rowtype; t public.store_transfers%rowtype; v_email text := lower(btrim(coalesce(p_buyer_email, ''))); v_account uuid := p_buyer_account;
begin
 if v_account is null then
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return jsonb_build_object('error', 'invalid_buyer'); end if;
  -- an email that already owns an account must use that account (Add Store path)
  select a.id into v_account from public.accounts a join auth.users u on u.id = a.owner_user_id where lower(u.email) = v_email;
  if v_account is not null then return jsonb_build_object('error', 'buyer_has_account', 'buyer_account_id', v_account); end if;
  if exists (select 1 from public.businesses x join public.accounts a on a.id = x.account_id join auth.users u on u.id = a.owner_user_id
      where x.id = p_source_business and lower(u.email) = v_email) then return jsonb_build_object('error', 'invalid_buyer'); end if;
 end if;
 select * into b from public.businesses x where x.id = p_source_business for update;
 if not found or not public.store_is_live(b.id) then return jsonb_build_object('error', 'source_not_live'); end if;
 perform 1 from public.accounts a where a.id = b.account_id for update;
 if p_buyer_account is not null and (not exists (select 1 from public.accounts a where a.id = p_buyer_account) or p_buyer_account = b.account_id) then
  return jsonb_build_object('error', 'invalid_buyer'); end if;
 if b.removal_effective_at is not null then return jsonb_build_object('error', 'removal_already_scheduled'); end if;
 if public.account_billable_count(b.account_id) <= 1 then return jsonb_build_object('error', 'source_last_store'); end if;
 if p_effective_at <= public.billing_now(b.account_id) then return jsonb_build_object('error', 'effective_in_past'); end if;
 if exists (select 1 from public.store_transfers x where x.pharmacy_id = b.pharmacy_id and x.status in ('authorized', 'buyer_reserved', 'attention')) then
  return jsonb_build_object('error', 'transfer_open'); end if;
 if exists (select 1 from public.store_operations x where x.account_id = b.account_id
   and x.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested','attention','requested')) then
  return jsonb_build_object('error', 'operation_unresolved'); end if;
 insert into public.store_transfers (pharmacy_id, source_business_id, source_account_id, buyer_account_id, buyer_email, effective_at, hold_expires_at, status, operator_action_ref)
  values (b.pharmacy_id, b.id, b.account_id, p_buyer_account, case when p_buyer_account is null then v_email end, p_effective_at,
   p_effective_at + make_interval(hours => least(greatest(coalesce(p_hold_hours, 48), 1), 168)), 'authorized', p_ref)
  returning * into t;
 update public.businesses x set removal_requested_at = public.billing_now(b.account_id), removal_effective_at = p_effective_at where x.id = b.id;
 return jsonb_build_object('transfer', to_jsonb(t));
end $$;
revoke all on function public.store_transfer_authorize(uuid,uuid,text,timestamp with time zone,integer,text) from public, anon, authenticated;
grant execute on function public.store_transfer_authorize(uuid,uuid,text,timestamp with time zone,integer,text) to service_role;

-- Hold expiry → attention also waits for a buyer registration checkout that is still open.
create or replace function public.store_transfers_expired() returns setof uuid language sql stable security definer set search_path = '' as $$
 select t.id from public.store_transfers t where t.status = 'buyer_reserved' and t.hold_expires_at <= now()
   and not exists (select 1 from public.store_operations o where o.transfer_id = t.id and o.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested'))
   and not exists (select 1 from public.npi_reservations r join public.checkout_operations co on co.id = r.operation_id
     where r.transfer_id = t.id and co.status in ('created','checkout_open','paid','provisioning','attention'));
$$;

-- 3. Replaced bodies (exact applied text with the ruling changes; grants are preserved by create or replace)
create or replace function public.npi_reserve(p_draft uuid, p_npi text)
returns table (outcome text, reservation_id uuid, blocking_operation_id uuid)
language plpgsql security definer set search_path = '' as $$
declare r public.npi_reservations%rowtype; v_id uuid; v_email text; t public.store_transfers%rowtype;
begin
 if not public.npi_is_valid(p_npi) then
  return query select 'invalid'::text, null::uuid, null::uuid; return; end if;
 if not exists (select 1 from public.registration_drafts d where d.id = p_draft and d.status = 'draft') then
  return query select 'draft_not_editable'::text, null::uuid, null::uuid; return; end if;
 perform pg_advisory_xact_lock(hashtextextended('apbm007a:npi:' || p_npi, 0));
 update public.npi_reservations x set status = 'released'
  where x.draft_id = p_draft and x.status = 'held' and x.npi <> p_npi;
 -- Ruling 3: the exact transfer buyer may register this NPI from the transfer's effective time until its hold expiry.
 select lower(d.owner_email) into v_email from public.registration_drafts d where d.id = p_draft;
 select x.* into t from public.store_transfers x join public.pharmacy_identities i on i.id = x.pharmacy_id
  where i.npi = p_npi and x.status = 'buyer_reserved' and x.buyer_account_id is null and x.buyer_email = v_email for update of x;
 if found then
  if now() >= t.hold_expires_at or public.billing_now(t.source_account_id) < t.effective_at then
   return query select 'unavailable'::text, null::uuid, null::uuid; return; end if;
  update public.npi_reservations x set draft_id = p_draft where x.transfer_id = t.id and x.status = 'transfer_held' returning x.id into v_id;
  if v_id is null then return query select 'unavailable'::text, null::uuid, null::uuid; return; end if;
  return query select 'held'::text, v_id, null::uuid; return;
 end if;
 if exists (select 1 from public.pharmacy_identities i where i.npi = p_npi)
    or exists (select 1 from public.businesses b where b.npi = p_npi)
    or exists (select 1 from public.npi_reservations x where x.npi = p_npi and x.status in ('op_held', 'transfer_held')) then
  return query select 'unavailable'::text, null::uuid, null::uuid; return; end if;
 select * into r from public.npi_reservations x where x.npi = p_npi and x.status in ('held','checkout_bound') for update;
 if found then
  if r.draft_id = p_draft then
   if r.status = 'held' then
    update public.npi_reservations x set expires_at = least(x.created_at + interval '2 hours', now() + interval '30 minutes') where x.id = r.id;
   end if;
   return query select r.status, r.id, r.operation_id; return;
  end if;
  if r.status = 'held' and r.expires_at <= now() then
   update public.npi_reservations x set status = 'released' where x.id = r.id;
  elsif r.status = 'checkout_bound' and r.expires_at <= now() then
   return query select 'needs_proof'::text, null::uuid, r.operation_id; return;
  else
   return query select 'unavailable'::text, null::uuid, null::uuid; return;
  end if;
 end if;
 insert into public.npi_reservations(npi, draft_id, status, expires_at)
  values (p_npi, p_draft, 'held', now() + interval '30 minutes') returning id into v_id;
 return query select 'held'::text, v_id, null::uuid;
end $$;

create or replace function public.npi_bind(p_draft uuid, p_operation uuid, p_checkout_expires timestamptz)
returns text language plpgsql security definer set search_path = '' as $$
begin
 update public.npi_reservations x
    set status = 'checkout_bound', operation_id = p_operation, expires_at = p_checkout_expires + interval '5 minutes'
  where x.draft_id = p_draft and x.status in ('held','checkout_bound')
    and (x.operation_id is null or x.operation_id = p_operation)
    and exists (select 1 from public.checkout_operations o where o.id = p_operation and o.draft_id = p_draft and o.npi = x.npi);
 if found then return 'bound'; end if;
 -- transfer buyer: the transfer hold is linked to the checkout operation; status and expiry remain the transfer's.
 update public.npi_reservations x set operation_id = p_operation
  where x.draft_id = p_draft and x.status = 'transfer_held' and (x.operation_id is null or x.operation_id = p_operation)
    and exists (select 1 from public.checkout_operations o where o.id = p_operation and o.draft_id = p_draft and o.npi = x.npi);
 if found then return 'bound'; end if;
 return 'no_reservation';
end $$;

create or replace function public.npi_release_unpaid(p_operation uuid)
returns text language plpgsql security definer set search_path = '' as $$
begin
 if not exists (select 1 from public.checkout_operations o where o.id = p_operation and o.status = 'expired_unpaid') then
  return 'not_proven_unpaid'; end if;
 update public.npi_reservations x set status = 'released'
  where x.operation_id = p_operation and x.status in ('held','checkout_bound');
 if found then return 'released'; end if;
 -- a transfer hold is never released to the public: it is detached and stays held for the exact buyer
 update public.npi_reservations x set operation_id = null, draft_id = null where x.operation_id = p_operation and x.status = 'transfer_held';
 if found then return 'released'; end if;
 return 'nothing_to_release';
end $$;

create or replace function public.provision_paid_registration(p_operation uuid, p_owner_user uuid, p_sub jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 t public.store_transfers%rowtype; v_transfer boolean := false;
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
  -- Ruling 3: a transfer buyer's registration consumes the transfer hold and becomes the successor ownership.
  select x.* into t from public.store_transfers x join public.npi_reservations r on r.transfer_id = x.id
   where r.operation_id = o.id and r.npi = o.npi and r.status = 'transfer_held' for update of x;
  if not found then return jsonb_build_object('outcome','reservation_lost'); end if;
  if t.status <> 'buyer_reserved' or t.buyer_email is distinct from lower(d.owner_email)
     or exists (select 1 from public.businesses b where b.pharmacy_id = t.pharmacy_id and b.ownership_ended_at is null) then
   return jsonb_build_object('outcome','transfer_state'); end if;
  v_transfer := true;
 end if;

 insert into public.accounts(name, owner_user_id) values (d.pharmacy_name, p_owner_user) returning id into v_account;
 insert into public.businesses(account_id, npi, ncpdp, pharmacy_name, address, city, state, zip, phone,
   pharmacy_software_system, contact_person, contact_person_last_name, business_email, status, date_of_registration, pharmacy_id)
  values (v_account, o.npi, d.ncpdp, d.pharmacy_name, d.address, d.city, d.state, d.zip, d.phone,
   d.software, d.owner_first_name, d.owner_last_name, d.owner_email, 'active', now(), case when v_transfer then t.pharmacy_id end)
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
 update public.npi_reservations r set status = 'consumed' where r.operation_id = o.id and r.status in ('checkout_bound', 'transfer_held');
 if v_transfer then update public.store_transfers x set status = 'completed', buyer_account_id = v_account, buyer_business_id = v_business where x.id = t.id; end if;
 update public.checkout_operations x set status = 'provisioned', owner_user_id = p_owner_user, account_id = v_account,
   business_id = v_business, lease_owner = null, lease_expires_at = null, last_error_code = null where x.id = o.id;
 update public.registration_drafts x set status = 'provisioned' where x.id = o.draft_id;
 return jsonb_build_object('outcome','provisioned','account_id',v_account,'business_id',v_business,'subscription_id',v_subscription);
end $$;

create or replace function public.store_quote_create(p_account uuid, p_actor uuid, p_store_name text, p_npi text, p_ncpdp text,
  p_customer text, p_subscription text, p_item text, p_price text, p_unit integer, p_quantity integer,
  p_period_start timestamptz, p_period_end timestamptz, p_terms_version text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare a public.accounts%rowtype; v_at timestamptz; v_amount integer; v_refusal text; v_billable integer; q public.store_quotes%rowtype;
        v_identity uuid; v_sub public.subscriptions%rowtype; t public.store_transfers%rowtype; v_react uuid;
begin
 select * into a from public.accounts x where x.id = p_account;
 if not found or a.owner_user_id is distinct from p_actor then return jsonb_build_object('error', 'not_owner'); end if;
 if not public.npi_is_valid(p_npi) then return jsonb_build_object('error', 'invalid_npi'); end if;
 if p_ncpdp is not null and p_ncpdp !~ '^[0-9]{7}$' then return jsonb_build_object('error', 'invalid_ncpdp'); end if;
 v_refusal := public.account_add_store_refusal(p_account);
 if v_refusal is not null then return jsonb_build_object('error', v_refusal); end if;
 if exists (select 1 from public.store_operations o where o.account_id = p_account
   and o.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested','attention','requested')) then
  return jsonb_build_object('error', 'operation_unresolved'); end if;
 select * into v_sub from public.subscriptions s where s.account_id = p_account and s.origin = 'stripe' and s.status <> 'canceled' order by s.created_at desc limit 1;
 if not found or v_sub.stripe_subscription_id is distinct from p_subscription or v_sub.stripe_customer_id is distinct from p_customer then
  return jsonb_build_object('error', 'billing_binding_mismatch'); end if;
 v_billable := public.account_billable_count(p_account);
 if p_quantity is distinct from v_billable then return jsonb_build_object('error', 'quantity_mismatch'); end if;
 v_at := public.billing_now(p_account);
 select i.id into v_identity from public.pharmacy_identities i where i.npi = p_npi;
 if v_identity is not null then
  if exists (select 1 from public.businesses b where b.pharmacy_id = v_identity and b.ownership_ended_at is null) then
   if exists (select 1 from public.store_transfers x where x.pharmacy_id = v_identity and x.buyer_account_id = p_account and x.status = 'authorized') then
    return jsonb_build_object('error', 'transfer_not_effective'); end if;
   return jsonb_build_object('error', 'npi_registered'); end if;
  select * into t from public.store_transfers x where x.pharmacy_id = v_identity and x.buyer_account_id = p_account and x.status = 'buyer_reserved';
  if found then
   if v_at < t.effective_at then return jsonb_build_object('error', 'transfer_not_effective'); end if;
   if now() >= t.hold_expires_at then return jsonb_build_object('error', 'transfer_hold_expired'); end if;
  else
   -- Director decision 9: the SAME account re-adds its own removed store (operator-authorized) and gets the original record back.
   select b.id into v_react from public.store_reactivations r join public.businesses b on b.id = r.business_id
    where b.pharmacy_id = v_identity and b.account_id = p_account and b.status = 'removed' and r.account_id = p_account and r.status = 'authorized';
   if v_react is null then return jsonb_build_object('error', 'npi_previously_registered'); end if;
   if exists (select 1 from public.npi_reservations x where x.npi = p_npi and x.status in ('held','checkout_bound','op_held','transfer_held')) then
    return jsonb_build_object('error', 'npi_held'); end if;
  end if;
 elsif exists (select 1 from public.npi_reservations x where x.npi = p_npi and x.status in ('held','checkout_bound','op_held','transfer_held')) then
  return jsonb_build_object('error', 'npi_held');
 end if;
 if p_period_start > v_at or p_period_end <= v_at then return jsonb_build_object('error', 'period_mismatch'); end if;
 v_refusal := public.store_period_window_refusal(p_unit, p_period_start, p_period_end, v_at);
 if v_refusal is not null then return jsonb_build_object('error', v_refusal); end if;
 v_amount := public.store_incremental_cents(p_unit, p_period_start, p_period_end, v_at);
 insert into public.store_quotes (account_id, actor_user_id, store_name, npi, ncpdp, pharmacy_id, transfer_id, stripe_customer_id, stripe_subscription_id, stripe_item_id,
   stripe_price_id, currency, additional_unit_cents, period_start, period_end, computed_at, amount_cents, billable_before, billable_after,
   next_renewal_cents, discount_explanation, terms_version, expires_at, reactivation_business_id)
 values (p_account, p_actor, btrim(p_store_name), p_npi, p_ncpdp, v_identity, t.id, p_customer, p_subscription, p_item, p_price, 'usd', p_unit,
   p_period_start, p_period_end, v_at, v_amount, v_billable, v_billable + 1, 9900 + p_unit * v_billable,
   'Charged only for the new store from now until your current period ends. Your existing stores and any first-store discount you already received are unchanged.',
   p_terms_version, v_at + interval '15 minutes', v_react)
 returning * into q;
 return jsonb_build_object('quote', to_jsonb(q));
end $$;

create or replace function public.store_operation_claim(p_quote uuid, p_actor uuid, p_intent text, p_terms_version text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare q public.store_quotes%rowtype; o public.store_operations%rowtype; v_at timestamptz; v_deadline timestamptz; v_refusal text;
begin
 select * into q from public.store_quotes x where x.id = p_quote;
 if not found then return jsonb_build_object('error', 'quote_not_found'); end if;
 perform 1 from public.accounts a where a.id = q.account_id for update;
 if q.actor_user_id is distinct from p_actor or not exists (select 1 from public.accounts a where a.id = q.account_id and a.owner_user_id = p_actor) then
  return jsonb_build_object('error', 'not_owner'); end if;
 select * into o from public.store_operations x where x.account_id = q.account_id and x.intent_key = p_intent;
 if found then
  if o.quote_id = q.id then return jsonb_build_object('operation', to_jsonb(o) - 'hosted_invoice_url', 'resumed', true); end if;
  if o.kind = 'store_add' and o.npi = q.npi and o.store_name = q.store_name and o.state not in ('expired_unpaid','closed_refunded_externally','activated') then
   return jsonb_build_object('operation', to_jsonb(o) - 'hosted_invoice_url', 'resumed', true); end if;
  return jsonb_build_object('error', 'intent_conflict');
 end if;
 if exists (select 1 from public.store_operations x where x.quote_id = q.id) then return jsonb_build_object('error', 'quote_used'); end if;
 v_at := public.billing_now(q.account_id);
 if v_at >= q.expires_at then return jsonb_build_object('error', 'quote_expired'); end if;
 if p_terms_version is distinct from q.terms_version then return jsonb_build_object('error', 'terms_changed'); end if;
 v_refusal := public.account_add_store_refusal(q.account_id);
 if v_refusal is not null then return jsonb_build_object('error', v_refusal); end if;
 if public.account_billable_count(q.account_id) <> q.billable_before then return jsonb_build_object('error', 'quantity_changed'); end if;
 v_refusal := public.store_period_window_refusal(q.additional_unit_cents, q.period_start, q.period_end, v_at);
 if v_refusal is not null then return jsonb_build_object('error', v_refusal); end if;
 if exists (select 1 from public.store_operations x where x.account_id = q.account_id
   and x.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested','attention','requested')) then
  return jsonb_build_object('error', 'operation_unresolved'); end if;
 perform pg_advisory_xact_lock(hashtextextended('apbm007a:npi:' || q.npi, 0));
 if q.reactivation_business_id is not null then
  if not exists (select 1 from public.store_reactivations r join public.businesses b on b.id = r.business_id where r.business_id = q.reactivation_business_id
      and r.status = 'authorized' and r.account_id = q.account_id and b.status = 'removed' and b.account_id = q.account_id)
     or exists (select 1 from public.businesses b where b.npi = q.npi and b.ownership_ended_at is null) then
   return jsonb_build_object('error', 'reactivation_not_authorized'); end if;
  if exists (select 1 from public.npi_reservations x where x.npi = q.npi and x.status in ('held','checkout_bound','op_held','transfer_held')) then
   return jsonb_build_object('error', 'npi_held'); end if;
 elsif q.transfer_id is null then
  if exists (select 1 from public.pharmacy_identities i where i.npi = q.npi) or exists (select 1 from public.businesses b where b.npi = q.npi) then
   return jsonb_build_object('error', 'npi_registered'); end if;
  if exists (select 1 from public.npi_reservations x where x.npi = q.npi and x.status in ('held','checkout_bound','op_held','transfer_held')) then
   return jsonb_build_object('error', 'npi_held'); end if;
 else
  if not exists (select 1 from public.store_transfers t where t.id = q.transfer_id and t.buyer_account_id = q.account_id and t.status = 'buyer_reserved'
      and v_at >= t.effective_at and now() < t.hold_expires_at) then return jsonb_build_object('error', 'transfer_not_reserved'); end if;
  if exists (select 1 from public.businesses b where b.npi = q.npi and b.ownership_ended_at is null) then return jsonb_build_object('error', 'npi_registered'); end if;
 end if;
 v_deadline := least(v_at + interval '30 minutes', q.period_end - interval '60 minutes');
 insert into public.store_operations (account_id, kind, state, intent_key, actor_user_id, quote_id, store_name, npi, ncpdp, pharmacy_id, transfer_id,
   amount_cents, currency, consented_at, consent_terms_version, payment_deadline, stripe_customer_id, stripe_subscription_id, stripe_item_id,
   period_start, period_end, target_quantity, reactivation_business_id)
 values (q.account_id, 'store_add', 'payment_setup', p_intent, p_actor, q.id, q.store_name, q.npi, q.ncpdp, q.pharmacy_id, q.transfer_id,
   q.amount_cents, 'usd', v_at, q.terms_version, v_deadline, q.stripe_customer_id, q.stripe_subscription_id, q.stripe_item_id,
   q.period_start, q.period_end, q.billable_after, q.reactivation_business_id)
 returning * into o;
 if q.transfer_id is null then
  insert into public.npi_reservations (npi, store_operation_id, status, expires_at) values (q.npi, o.id, 'op_held', v_deadline);
 end if;   -- a transfer buyer keeps the transfer hold; it is consumed at activation
 return jsonb_build_object('operation', to_jsonb(o) - 'hosted_invoice_url', 'resumed', false);
end $$;

create or replace function public.store_add_activate(p_operation uuid, p_invoice text, p_paid_cents integer, p_currency text,
  p_quantity integer, p_period_start timestamptz, p_period_end timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype; a public.accounts%rowtype; v_identity uuid; v_business uuid; v_now timestamptz; t public.store_transfers%rowtype;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found or o.kind <> 'store_add' then return jsonb_build_object('outcome', 'unknown_operation'); end if;
 if o.state = 'activated' then return jsonb_build_object('outcome', 'already_activated', 'business_id', o.business_id); end if;
 if o.state <> 'paid_pending_activation' then return jsonb_build_object('outcome', 'not_paid_pending'); end if;
 select * into a from public.accounts x where x.id = o.account_id for update;
 if not exists (select 1 from public.provider_invoice_operations m where m.invoice_id = p_invoice and m.operation_id = o.id)
    or o.invoice_id is distinct from p_invoice or p_paid_cents <> o.amount_cents or p_currency <> 'usd' then
  update public.store_operations x set state = 'attention', last_error_code = 'payment_mismatch' where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', 'payment_mismatch'); end if;
 if p_period_start <> o.period_start or p_period_end <> o.period_end then
  update public.store_operations x set state = 'attention', last_error_code = 'period_changed' where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', 'period_changed'); end if;
 if p_quantity <> o.target_quantity or public.account_billable_count(o.account_id) + 1 <> o.target_quantity then
  update public.store_operations x set state = 'attention', last_error_code = 'quantity_mismatch' where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', 'quantity_mismatch'); end if;
 perform pg_advisory_xact_lock(hashtextextended('apbm007a:npi:' || o.npi, 0));
 v_now := public.billing_now(o.account_id);
 if o.reactivation_business_id is not null then
  if not exists (select 1 from public.npi_reservations r where r.store_operation_id = o.id and r.npi = o.npi and r.status = 'op_held')
     or not exists (select 1 from public.store_reactivations r join public.businesses b on b.id = r.business_id where r.business_id = o.reactivation_business_id
       and r.status = 'authorized' and b.status = 'removed' and b.account_id = o.account_id)
     or exists (select 1 from public.businesses b where b.npi = o.npi and b.ownership_ended_at is null) then
   update public.store_operations x set state = 'attention', last_error_code = 'reactivation_state' where x.id = o.id;
   return jsonb_build_object('outcome', 'attention', 'code', 'reactivation_state'); end if;
  -- Decision 9: only now, after payment and quantity reconciliation, the original record and its history return.
  update public.businesses b set status = 'active', ownership_ended_at = null, removal_requested_at = null, removal_effective_at = null,
    reactivated_at = v_now where b.id = o.reactivation_business_id;
  insert into public.user_businesses (user_id, business_id, role, is_primary) values (a.owner_user_id, o.reactivation_business_id, 'admin', false)
   on conflict (user_id, business_id) do update set role = 'admin';
  update public.npi_reservations r set status = 'consumed' where r.store_operation_id = o.id and r.status = 'op_held';
  update public.store_reactivations r set status = 'used' where r.business_id = o.reactivation_business_id and r.status = 'authorized';
  update public.subscriptions s set quantity = p_quantity where s.account_id = o.account_id and s.stripe_subscription_id = o.stripe_subscription_id;
  update public.provider_invoice_operations m set outcome = 'paid', verified_at = now() where m.invoice_id = p_invoice;
  update public.store_operations x set state = 'activated', business_id = o.reactivation_business_id, activated_at = now(),
    lease_owner = null, lease_until = null, last_error_code = null where x.id = o.id;
  return jsonb_build_object('outcome', 'activated', 'business_id', o.reactivation_business_id, 'reactivated', true);
 elsif o.transfer_id is null then
  if not exists (select 1 from public.npi_reservations r where r.store_operation_id = o.id and r.npi = o.npi and r.status = 'op_held') then
   update public.store_operations x set state = 'attention', last_error_code = 'reservation_lost' where x.id = o.id;
   return jsonb_build_object('outcome', 'attention', 'code', 'reservation_lost'); end if;
  if exists (select 1 from public.pharmacy_identities i where i.npi = o.npi) then
   update public.store_operations x set state = 'attention', last_error_code = 'npi_registered' where x.id = o.id;
   return jsonb_build_object('outcome', 'attention', 'code', 'npi_registered'); end if;
  insert into public.pharmacy_identities (npi) values (o.npi) returning id into v_identity;
 else
  select * into t from public.store_transfers x where x.id = o.transfer_id for update;
  if t.status not in ('buyer_reserved', 'attention') or t.buyer_account_id <> o.account_id
     or exists (select 1 from public.businesses b where b.pharmacy_id = t.pharmacy_id and b.ownership_ended_at is null)
     or not exists (select 1 from public.npi_reservations r where r.transfer_id = t.id and r.status = 'transfer_held') then
   update public.store_operations x set state = 'attention', last_error_code = 'transfer_state' where x.id = o.id;
   return jsonb_build_object('outcome', 'attention', 'code', 'transfer_state'); end if;
  v_identity := t.pharmacy_id;
 end if;
 insert into public.businesses (account_id, pharmacy_id, npi, ncpdp, pharmacy_name, status, date_of_registration, ownership_started_at)
  values (o.account_id, v_identity, o.npi, o.ncpdp, o.store_name, 'active', v_now, v_now) returning id into v_business;
 insert into public.user_businesses (user_id, business_id, role, is_primary) values (a.owner_user_id, v_business, 'admin', false);
 update public.npi_reservations r set status = 'consumed' where (r.store_operation_id = o.id and r.status = 'op_held') or (o.transfer_id is not null and r.transfer_id = o.transfer_id and r.status = 'transfer_held');
 if o.transfer_id is not null then update public.store_transfers x set status = 'completed', buyer_business_id = v_business where x.id = o.transfer_id; end if;
 update public.subscriptions s set quantity = p_quantity where s.account_id = o.account_id and s.stripe_subscription_id = o.stripe_subscription_id;
 update public.provider_invoice_operations m set outcome = 'paid', verified_at = now() where m.invoice_id = p_invoice;
 update public.store_operations x set state = 'activated', business_id = v_business, pharmacy_id = v_identity, activated_at = now(),
   lease_owner = null, lease_until = null, last_error_code = null where x.id = o.id;
 return jsonb_build_object('outcome', 'activated', 'business_id', v_business);
end $$;

-- 4. Assertions
do $$
declare bad text;
begin
 select string_agg(p.oid::regprocedure::text || ':' || r, ', ') into bad
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace cross join unnest(array['anon','authenticated']) r
  where n.nspname = 'public' and p.proname in ('store_transfer_authorize','store_transfers_expired','npi_reserve','npi_bind','npi_release_unpaid',
    'provision_paid_registration','store_quote_create','store_operation_claim','store_add_activate') and has_function_privilege(r, p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007B/0069 ASSERT: executable by customers: %', bad; end if;
 if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'store_operations' and column_name = 'reactivation_business_id') then
  raise exception 'APBM007B/0069 ASSERT: reactivation column missing'; end if;
end $$;
