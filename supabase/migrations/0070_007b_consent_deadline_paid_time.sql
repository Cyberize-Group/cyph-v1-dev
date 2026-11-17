-- APBM-007B 0070: the Add Store consent deadline (CONTRACTS/BILLING.md) is decided on the account billing clock and by the
-- provider's paid time, and is enforced in the database (QA findings F-Q2-001 and F-Q2-004, repair ruled 17 November 2026).
-- 0061–0069 are applied and never rewritten; this file only adds and replaces.
--  * The application asks the database whether an operation's deadline has passed. billing_now(account) is real now() for
--    every real account and simulated time only in the verified SCRATCH test context, so the application never compares
--    the deadline with its own wall clock.
--  * A paid invoice is recorded through store_operation_payment_observed with the provider's paid timestamp. Paid at or
--    before the stored deadline → paid_pending_activation, whenever the payment is processed (outage, crash, redelivery).
--    Paid after it → attention 'paid_after_deadline'. No paid time → attention 'paid_time_unverified'.
--  * The direct payment_pending → paid_pending_activation transition is no longer allowed; activation refuses a payment
--    that is not proven on time, unless the operator resumed it after a recorded owner reconfirmation (close_reference).

-- 1. The provider paid time of the operation's invoice.
alter table public.store_operations add column provider_paid_at timestamptz;

-- 2. The deadline on the account's billing clock (the same clock store_operations_due uses).
create function public.store_operation_deadline_passed(p_operation uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select o.payment_deadline is not null and o.payment_deadline <= public.billing_now(o.account_id)
  from public.store_operations o where o.id = p_operation;
$$;

-- 3. Record a paid invoice and route the operation by the provider's paid time against the stored deadline. Fenced.
create function public.store_operation_payment_observed(p_operation uuid, p_owner text, p_epoch bigint, p_invoice text,
  p_paid_cents integer, p_currency text, p_paid_at timestamptz)
returns text language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype; v_to text; v_code text;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found or o.kind <> 'store_add' then return 'unknown_operation'; end if;
 if o.lease_owner is distinct from p_owner or o.fencing_epoch <> p_epoch or o.lease_until <= now() then return 'lease_lost'; end if;
 -- Already decided (or resumed by the operator after owner reconfirmation): nothing to re-decide.
 if o.state = 'paid_pending_activation' and (o.provider_paid_at is not null or o.close_reference is not null) then return o.state; end if;
 if o.state not in ('payment_pending', 'cancel_requested', 'paid_pending_activation') then return 'transition_refused'; end if;
 if o.invoice_id is distinct from p_invoice or p_paid_cents is distinct from o.amount_cents or p_currency is distinct from 'usd'
    or not exists (select 1 from public.provider_invoice_operations m where m.invoice_id = p_invoice and m.operation_id = o.id) then
  v_to := 'attention'; v_code := 'payment_mismatch';
 elsif o.state = 'cancel_requested' then v_to := 'attention'; v_code := 'paid_after_abandon';
 elsif p_paid_at is null then v_to := 'attention'; v_code := 'paid_time_unverified';
 elsif p_paid_at > o.payment_deadline then v_to := 'attention'; v_code := 'paid_after_deadline';
 else v_to := 'paid_pending_activation'; v_code := null;
 end if;
 update public.store_operations x set state = v_to, last_error_code = v_code, provider_paid_at = coalesce(p_paid_at, x.provider_paid_at)
  where x.id = o.id;
 return v_to;
end $$;

-- 4. Saga transitions (0062) without the direct payment_pending → paid_pending_activation pair; a paid invoice goes
-- through store_operation_payment_observed. Every other pair and effect is unchanged.
create or replace function public.store_operation_transition(p_operation uuid, p_owner text, p_epoch bigint, p_to text, p_error text,
  p_invoice text, p_hosted_url text)
returns text language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found then return 'unknown_operation'; end if;
 if o.lease_owner is distinct from p_owner or o.fencing_epoch <> p_epoch or o.lease_until <= now() then return 'lease_lost'; end if;
 if not ((o.state, p_to) in (('payment_setup','payment_pending'), ('payment_setup','attention'), ('payment_setup','expired_unpaid'),
   ('payment_pending','attention'), ('payment_pending','expired_unpaid'), ('payment_pending','payment_pending'),
   ('cancel_requested','expired_unpaid'), ('cancel_requested','attention'), ('cancel_requested','paid_pending_activation'),
   ('paid_pending_activation','attention'), ('payment_setup','payment_setup'))) then
  return 'transition_refused'; end if;
 if p_to = 'paid_pending_activation' and o.state = 'cancel_requested' then p_to := 'attention'; p_error := coalesce(p_error, 'paid_after_abandon'); end if;
 update public.store_operations x set state = p_to, last_error_code = p_error,
   invoice_id = coalesce(x.invoice_id, p_invoice), hosted_invoice_url = coalesce(p_hosted_url, x.hosted_invoice_url),
   closed_at = case when p_to = 'expired_unpaid' then now() else x.closed_at end
  where x.id = p_operation;
 if p_to = 'expired_unpaid' then
  update public.npi_reservations r set status = 'released' where r.store_operation_id = p_operation and r.status = 'op_held';
 end if;
 return p_to;
end $$;

-- 5. Atomic activation (0069 body) with the deadline backstop: only an on-time provider payment, or an operator resume
-- after a recorded owner reconfirmation, may activate.
create or replace function public.store_add_activate(p_operation uuid, p_invoice text, p_paid_cents integer, p_currency text,
  p_quantity integer, p_period_start timestamptz, p_period_end timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype; a public.accounts%rowtype; v_identity uuid; v_business uuid; v_now timestamptz; t public.store_transfers%rowtype;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found or o.kind <> 'store_add' then return jsonb_build_object('outcome', 'unknown_operation'); end if;
 if o.state = 'activated' then return jsonb_build_object('outcome', 'already_activated', 'business_id', o.business_id); end if;
 if o.state <> 'paid_pending_activation' then return jsonb_build_object('outcome', 'not_paid_pending'); end if;
 -- 0070: consent deadline backstop (provider paid time on or before the stored deadline, or an operator resume).
 if o.close_reference is null and (o.provider_paid_at is null or o.provider_paid_at > o.payment_deadline) then
  update public.store_operations x set state = 'attention',
    last_error_code = case when o.provider_paid_at is null then 'paid_time_unverified' else 'paid_after_deadline' end where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', case when o.provider_paid_at is null then 'paid_time_unverified' else 'paid_after_deadline' end); end if;
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

-- 6. Grants and assertions.
revoke all on function public.store_operation_deadline_passed(uuid),
 public.store_operation_payment_observed(uuid, text, bigint, text, integer, text, timestamptz) from public, anon, authenticated;
grant execute on function public.store_operation_deadline_passed(uuid),
 public.store_operation_payment_observed(uuid, text, bigint, text, integer, text, timestamptz) to service_role;
do $$
declare bad text;
begin
 select string_agg(p.oid::regprocedure::text || ':' || r, ', ') into bad
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace cross join unnest(array['anon','authenticated']) r
  where n.nspname = 'public' and p.proname in ('store_operation_deadline_passed','store_operation_payment_observed','store_operation_transition','store_add_activate')
    and has_function_privilege(r, p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007B/0070 ASSERT: executable by customers: %', bad; end if;
 select string_agg(p.oid::regprocedure::text, ', ') into bad
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname in ('store_operation_deadline_passed','store_operation_payment_observed','store_operation_transition','store_add_activate')
    and not has_function_privilege('service_role', p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007B/0070 ASSERT: not executable by service_role: %', bad; end if;
 if (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname in ('store_operation_transition','store_add_activate')) <> 2 then
  raise exception 'APBM007B/0070 ASSERT: replaced functions must not gain overloads'; end if;
end $$;
