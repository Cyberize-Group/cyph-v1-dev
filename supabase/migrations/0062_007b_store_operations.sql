-- APBM-007B 0062: Add Store quotes, durable store operations, provider invoice mapping and call intents, account
-- operation slot with lease/fencing, NPI hold extension (CONTRACTS/BILLING.md, DATA_AND_API_SHAPES.md). Service-only.

-- 1. Quotes (15 minutes). Amount and refusals are computed HERE from the account's guarded time, so the Portal's
--    display copy and the binding can never disagree.
create table public.store_quotes (
 id uuid primary key default gen_random_uuid(),
 account_id uuid not null references public.accounts (id),
 actor_user_id uuid not null,
 store_name text not null check (length(btrim(store_name)) between 1 and 200),
 npi text not null check (public.npi_is_valid(npi)),
 ncpdp text check (ncpdp is null or ncpdp ~ '^[0-9]{7}$'),
 pharmacy_id uuid references public.pharmacy_identities (id),
 transfer_id uuid,
 stripe_customer_id text not null check (stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'),
 stripe_subscription_id text not null check (stripe_subscription_id ~ '^sub_[A-Za-z0-9]+$'),
 stripe_item_id text not null check (stripe_item_id ~ '^si_[A-Za-z0-9]+$'),
 stripe_price_id text not null,
 currency text not null check (currency = 'usd'),
 additional_unit_cents integer not null check (additional_unit_cents > 0),
 period_start timestamptz not null,
 period_end timestamptz not null,
 computed_at timestamptz not null,
 amount_cents integer not null check (amount_cents >= 50),
 billable_before integer not null check (billable_before >= 1),
 billable_after integer not null,
 next_renewal_cents integer not null,
 discount_explanation text not null,
 terms_version text not null,
 expires_at timestamptz not null,
 created_at timestamptz not null default now(),
 check (period_end > period_start), check (billable_after = billable_before + 1)
);
create index store_quotes_account on public.store_quotes (account_id, created_at desc);
alter table public.store_quotes enable row level security;
revoke all on public.store_quotes from public, anon, authenticated;
grant select on public.store_quotes to service_role;

-- 2. Durable store operations. One unresolved operation per account (all kinds share the slot).
create table public.store_operations (
 id uuid primary key default gen_random_uuid(),
 account_id uuid not null references public.accounts (id),
 kind text not null check (kind in ('store_add', 'store_removal', 'store_removal_undo')),
 state text not null check (state in ('payment_setup', 'payment_pending', 'paid_pending_activation', 'activated', 'cancel_requested',
   'expired_unpaid', 'attention', 'closed_refunded_externally', 'requested', 'completed')),
 intent_key text not null check (intent_key ~ '^[A-Za-z0-9_-]{16,128}$'),
 actor_user_id uuid not null,
 quote_id uuid unique references public.store_quotes (id),
 business_id uuid references public.businesses (id),          -- removal/undo target, or the activated new store
 store_name text, npi text, ncpdp text, pharmacy_id uuid references public.pharmacy_identities (id), transfer_id uuid,
 amount_cents integer, currency text check (currency is null or currency = 'usd'),
 consented_at timestamptz, consent_terms_version text, payment_deadline timestamptz,
 stripe_customer_id text, stripe_subscription_id text, stripe_item_id text,
 period_start timestamptz, period_end timestamptz,
 target_quantity integer check (target_quantity is null or target_quantity >= 1),
 invoice_id text unique,
 hosted_invoice_url text,                                        -- sensitive capability; never returned by a user RPC
 lease_owner text, lease_until timestamptz, fencing_epoch bigint not null default 0,
 last_error_code text,
 activated_at timestamptz, closed_at timestamptz, close_reference text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique (account_id, intent_key),
 check (kind <> 'store_add' or (quote_id is not null and amount_cents >= 50 and payment_deadline is not null and npi is not null)),
 check (kind = 'store_add' or business_id is not null)
);
create unique index store_operations_one_unresolved on public.store_operations (account_id)
 where state in ('payment_setup', 'payment_pending', 'paid_pending_activation', 'cancel_requested', 'attention', 'requested');
create index store_operations_due on public.store_operations (payment_deadline) where state in ('payment_setup', 'payment_pending', 'cancel_requested');
alter table public.store_operations enable row level security;
revoke all on public.store_operations from public, anon, authenticated;
grant select on public.store_operations to service_role;
create trigger set_updated_at before update on public.store_operations for each row execute function public.update_updated_at();
create trigger audit_write after insert or update or delete on public.store_operations for each row execute function public.audit_write();

-- 3. Provider artifacts and money-call intents (append-only per operation+stage+attempt).
create table public.provider_invoice_operations (
 invoice_id text primary key check (invoice_id ~ '^in_[A-Za-z0-9]+$'),
 operation_id uuid not null references public.store_operations (id),
 artifact_kind text not null check (artifact_kind in ('store_add_invoice')),
 attempt integer not null default 1,
 stripe_customer_id text not null,
 stripe_subscription_id text,
 expected_cents integer not null,
 currency text not null check (currency = 'usd'),
 created_at timestamptz not null default now(),
 verified_at timestamptz,
 outcome text check (outcome is null or outcome in ('open', 'paid', 'void', 'attention'))
);
create index provider_invoice_operations_op on public.provider_invoice_operations (operation_id);
alter table public.provider_invoice_operations enable row level security;
revoke all on public.provider_invoice_operations from public, anon, authenticated;
grant select on public.provider_invoice_operations to service_role;

create table public.provider_call_intents (
 id bigserial primary key,
 operation_id uuid not null references public.store_operations (id),
 stage text not null check (stage in ('invoice_create', 'item_create', 'finalize', 'pay', 'void', 'quantity_update')),
 attempt integer not null check (attempt >= 1),
 idempotency_key text not null unique,
 params jsonb not null,
 interval_start timestamptz not null default now(),
 interval_end timestamptz,
 outcome text,
 created_at timestamptz not null default now(),
 unique (operation_id, stage, attempt)
);
alter table public.provider_call_intents enable row level security;
revoke all on public.provider_call_intents from public, anon, authenticated;
grant select on public.provider_call_intents to service_role;

-- 4. NPI holds for Add Store and transfer. 'op_held'/'transfer_held' are never released by time alone.
alter table public.npi_reservations alter column draft_id drop not null,
 add column store_operation_id uuid references public.store_operations (id),
 add column transfer_id uuid;
alter table public.npi_reservations drop constraint npi_reservations_status_check;
alter table public.npi_reservations add constraint npi_reservations_status_check
 check (status in ('held', 'checkout_bound', 'consumed', 'released', 'op_held', 'transfer_held'));
alter table public.npi_reservations add constraint npi_reservations_one_owner
 check (num_nonnulls(draft_id, store_operation_id, transfer_id) = 1);
drop index public.npi_reservations_one_active;
create unique index npi_reservations_one_active on public.npi_reservations (npi)
 where status in ('held', 'checkout_bound', 'op_held', 'transfer_held');

-- Registration reservation now also respects Add Store and transfer holds (same advisory lock key).
create or replace function public.npi_reserve(p_draft uuid, p_npi text)
returns table (outcome text, reservation_id uuid, blocking_operation_id uuid)
language plpgsql security definer set search_path = '' as $$
declare r public.npi_reservations%rowtype; v_id uuid;
begin
 if not public.npi_is_valid(p_npi) then
  return query select 'invalid'::text, null::uuid, null::uuid; return; end if;
 if not exists (select 1 from public.registration_drafts d where d.id = p_draft and d.status = 'draft') then
  return query select 'draft_not_editable'::text, null::uuid, null::uuid; return; end if;
 perform pg_advisory_xact_lock(hashtextextended('apbm007a:npi:' || p_npi, 0));
 update public.npi_reservations x set status = 'released'
  where x.draft_id = p_draft and x.status = 'held' and x.npi <> p_npi;
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

-- 5. Shared pure computations (BILLING.md; BP-01/BP-02). Integer arithmetic, half-up.
create function public.store_incremental_cents(p_unit integer, p_start timestamptz, p_end timestamptz, p_at timestamptz)
returns integer language plpgsql immutable set search_path = '' as $$
declare s bigint := floor(extract(epoch from p_start)); e bigint := floor(extract(epoch from p_end)); t bigint := floor(extract(epoch from p_at));
begin
 if p_unit is null or p_unit <= 0 or e <= s then raise exception 'invalid billing interval' using errcode = '22023'; end if;
 t := least(greatest(t, s), e);
 return ((p_unit::bigint * (e - t) + (e - s) / 2) / (e - s))::integer;
end $$;
-- Common end-of-period window: null when allowed, otherwise the refusal code.
create function public.store_period_window_refusal(p_unit integer, p_start timestamptz, p_end timestamptz, p_at timestamptz)
returns text language sql immutable set search_path = '' as $$
 select case when p_end - p_at < interval '90 minutes' then 'period_end_window'
             when public.store_incremental_cents(p_unit, p_start, p_end, p_at) < 50 then 'below_minimum_charge' else null end;
$$;

-- Live store predicate (ownership current, not past its removal cutoff on the account's own clock).
create function public.store_is_live(p_business uuid) returns boolean language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.businesses b where b.id = p_business and b.ownership_ended_at is null
   and b.status in ('active', 'pending', 'suspended')
   and (b.removal_effective_at is null or public.billing_now(b.account_id) < b.removal_effective_at));
$$;
-- Billable count: current ownerships of the account without a scheduled removal.
create function public.account_billable_count(p_account uuid) returns integer language sql stable security definer set search_path = '' as $$
 select count(*)::integer from public.businesses b where b.account_id = p_account and b.ownership_ended_at is null
   and b.status in ('active', 'pending', 'suspended') and b.removal_effective_at is null;
$$;

-- Account writability for owner-driven new grants and Add Store: not read-only, not in grace, not cancelling.
create function public.account_add_store_refusal(p_account uuid) returns text language plpgsql stable security definer set search_path = '' as $$
declare st jsonb := public.account_access_state(p_account);
begin
 if st->>'state' in ('read_only', 'ended') then return 'account_read_only'; end if;
 if st->>'state' in ('grace', 'past_due_reminder') then return 'account_in_grace'; end if;
 if coalesce((st->>'cancel_scheduled')::boolean, false) then return 'cancellation_scheduled'; end if;
 if st->>'state' <> 'active' then return 'account_not_active'; end if;
 return null;
end $$;

-- 6. Quote.
create function public.store_quote_create(p_account uuid, p_actor uuid, p_store_name text, p_npi text, p_ncpdp text,
  p_customer text, p_subscription text, p_item text, p_price text, p_unit integer, p_quantity integer,
  p_period_start timestamptz, p_period_end timestamptz, p_terms_version text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare a public.accounts%rowtype; v_at timestamptz; v_amount integer; v_refusal text; v_billable integer; q public.store_quotes%rowtype;
        v_identity uuid; v_sub public.subscriptions%rowtype;
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
 select * into v_sub from public.subscriptions s where s.account_id = p_account and s.origin = 'stripe' and s.status <> 'canceled'
  order by s.created_at desc limit 1;
 if not found or v_sub.stripe_subscription_id is distinct from p_subscription or v_sub.stripe_customer_id is distinct from p_customer then
  return jsonb_build_object('error', 'billing_binding_mismatch'); end if;
 v_billable := public.account_billable_count(p_account);
 if p_quantity is distinct from v_billable then return jsonb_build_object('error', 'quantity_mismatch', 'billable', v_billable, 'provider', p_quantity); end if;
 select i.id into v_identity from public.pharmacy_identities i where i.npi = p_npi;
 if v_identity is not null then
  if exists (select 1 from public.businesses b where b.pharmacy_id = v_identity and b.ownership_ended_at is null) then
   return jsonb_build_object('error', 'npi_registered'); end if;
  -- A previously owned pharmacy is re-added only through an operator authorization (transfer or reactivation).
  -- Same-account reactivation history (Director default 9) is PENDING: refused here until ruled.
  return jsonb_build_object('error', 'npi_previously_registered');
 end if;
 if exists (select 1 from public.npi_reservations x where x.npi = p_npi and x.status in ('held','checkout_bound','op_held','transfer_held')) then
  return jsonb_build_object('error', 'npi_held'); end if;
 v_at := public.billing_now(p_account);
 if p_period_start > v_at or p_period_end <= v_at then return jsonb_build_object('error', 'period_mismatch'); end if;
 v_refusal := public.store_period_window_refusal(p_unit, p_period_start, p_period_end, v_at);
 if v_refusal is not null then return jsonb_build_object('error', v_refusal); end if;
 v_amount := public.store_incremental_cents(p_unit, p_period_start, p_period_end, v_at);
 insert into public.store_quotes (account_id, actor_user_id, store_name, npi, ncpdp, stripe_customer_id, stripe_subscription_id, stripe_item_id,
   stripe_price_id, currency, additional_unit_cents, period_start, period_end, computed_at, amount_cents, billable_before, billable_after,
   next_renewal_cents, discount_explanation, terms_version, expires_at)
 values (p_account, p_actor, btrim(p_store_name), p_npi, p_ncpdp, p_customer, p_subscription, p_item, p_price, 'usd', p_unit,
   p_period_start, p_period_end, v_at, v_amount, v_billable, v_billable + 1, 9900 + p_unit * v_billable,
   'Charged only for the new store from now until your current period ends. Your existing stores and any first-store discount you already received are unchanged.',
   p_terms_version, v_at + interval '15 minutes')
 returning * into q;
 return jsonb_build_object('quote', to_jsonb(q));
end $$;

-- 7. Confirm: claim the account slot, reserve the NPI, bind consent. Same intent key resumes; conflicting intent conflicts.
create function public.store_operation_claim(p_quote uuid, p_actor uuid, p_intent text, p_terms_version text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare q public.store_quotes%rowtype; o public.store_operations%rowtype; v_at timestamptz; v_deadline timestamptz; v_refusal text;
begin
 select * into q from public.store_quotes x where x.id = p_quote;
 if not found then return jsonb_build_object('error', 'quote_not_found'); end if;
 perform 1 from public.accounts a where a.id = q.account_id for update;                -- the account billing-operation lock
 if q.actor_user_id is distinct from p_actor or not exists (select 1 from public.accounts a where a.id = q.account_id and a.owner_user_id = p_actor) then
  return jsonb_build_object('error', 'not_owner'); end if;
 select * into o from public.store_operations x where x.account_id = q.account_id and x.intent_key = p_intent;
 if found then
  if o.quote_id = q.id then return jsonb_build_object('operation', to_jsonb(o), 'resumed', true); end if;
  if o.kind = 'store_add' and o.npi = q.npi and o.store_name = q.store_name and o.state not in ('expired_unpaid','closed_refunded_externally','activated') then
   return jsonb_build_object('operation', to_jsonb(o), 'resumed', true); end if;
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
 if exists (select 1 from public.pharmacy_identities i where i.npi = q.npi) or exists (select 1 from public.businesses b where b.npi = q.npi) then
  return jsonb_build_object('error', 'npi_registered'); end if;
 if exists (select 1 from public.npi_reservations x where x.npi = q.npi and x.status in ('held','checkout_bound','op_held','transfer_held')) then
  return jsonb_build_object('error', 'npi_held'); end if;
 v_deadline := least(v_at + interval '30 minutes', q.period_end - interval '60 minutes');
 insert into public.store_operations (account_id, kind, state, intent_key, actor_user_id, quote_id, store_name, npi, ncpdp, pharmacy_id,
   amount_cents, currency, consented_at, consent_terms_version, payment_deadline, stripe_customer_id, stripe_subscription_id, stripe_item_id,
   period_start, period_end, target_quantity)
 values (q.account_id, 'store_add', 'payment_setup', p_intent, p_actor, q.id, q.store_name, q.npi, q.ncpdp, q.pharmacy_id,
   q.amount_cents, 'usd', v_at, q.terms_version, v_deadline, q.stripe_customer_id, q.stripe_subscription_id, q.stripe_item_id,
   q.period_start, q.period_end, q.billable_after)
 returning * into o;
 insert into public.npi_reservations (npi, store_operation_id, status, expires_at) values (q.npi, o.id, 'op_held', v_deadline);
 return jsonb_build_object('operation', to_jsonb(o), 'resumed', false);
end $$;

-- 8. Lease with fencing: a new epoch on every grant; every fenced write states the epoch it holds.
create function public.store_operation_lease(p_operation uuid, p_owner text, p_seconds integer)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_epoch bigint;
begin
 update public.store_operations o set lease_owner = p_owner, lease_until = now() + make_interval(secs => least(greatest(p_seconds, 5), 120)),
   fencing_epoch = o.fencing_epoch + 1
  where o.id = p_operation and (o.lease_owner is null or o.lease_until <= now() or o.lease_owner = p_owner)
  returning o.fencing_epoch into v_epoch;
 return v_epoch;
end $$;
create function public.store_operation_release(p_operation uuid, p_owner text, p_epoch bigint) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
 update public.store_operations o set lease_owner = null, lease_until = null where o.id = p_operation and o.lease_owner = p_owner and o.fencing_epoch = p_epoch;
 return found;
end $$;

-- Allowed state transitions for the Add Store saga. Every write is fenced by (owner, epoch) and re-checked here.
create function public.store_operation_transition(p_operation uuid, p_owner text, p_epoch bigint, p_to text, p_error text,
  p_invoice text, p_hosted_url text)
returns text language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found then return 'unknown_operation'; end if;
 if o.lease_owner is distinct from p_owner or o.fencing_epoch <> p_epoch or o.lease_until <= now() then return 'lease_lost'; end if;
 if not ((o.state, p_to) in (('payment_setup','payment_pending'), ('payment_setup','attention'), ('payment_setup','expired_unpaid'),
   ('payment_pending','paid_pending_activation'), ('payment_pending','attention'), ('payment_pending','expired_unpaid'), ('payment_pending','payment_pending'),
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

-- Record the money-call intent before the provider call (append-only; outcome filled once).
create function public.store_operation_intent(p_operation uuid, p_owner text, p_epoch bigint, p_stage text, p_attempt integer, p_key text, p_params jsonb)
returns text language plpgsql security definer set search_path = '' as $$
begin
 if not exists (select 1 from public.store_operations o where o.id = p_operation and o.lease_owner = p_owner and o.fencing_epoch = p_epoch and o.lease_until > now()) then
  return 'lease_lost'; end if;
 insert into public.provider_call_intents (operation_id, stage, attempt, idempotency_key, params) values (p_operation, p_stage, p_attempt, p_key, p_params)
  on conflict (operation_id, stage, attempt) do nothing;
 return 'recorded';
end $$;
create function public.store_operation_intent_outcome(p_operation uuid, p_stage text, p_attempt integer, p_outcome text)
returns void language sql security definer set search_path = '' as $$
 update public.provider_call_intents i set outcome = p_outcome, interval_end = now()
  where i.operation_id = p_operation and i.stage = p_stage and i.attempt = p_attempt and i.outcome is null;
$$;

-- Unique invoice→operation mapping, saved before any collection.
create function public.store_operation_map_invoice(p_operation uuid, p_owner text, p_epoch bigint, p_invoice text, p_customer text, p_cents integer)
returns text language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if o.lease_owner is distinct from p_owner or o.fencing_epoch <> p_epoch or o.lease_until <= now() then return 'lease_lost'; end if;
 if o.invoice_id is not null and o.invoice_id <> p_invoice then return 'already_mapped_other'; end if;
 if p_cents <> o.amount_cents or p_customer <> o.stripe_customer_id then return 'binding_mismatch'; end if;
 insert into public.provider_invoice_operations (invoice_id, operation_id, artifact_kind, stripe_customer_id, expected_cents, currency)
  values (p_invoice, p_operation, 'store_add_invoice', p_customer, p_cents, 'usd') on conflict (invoice_id) do nothing;
 if not exists (select 1 from public.provider_invoice_operations m where m.invoice_id = p_invoice and m.operation_id = p_operation) then return 'mapped_to_other_operation'; end if;
 update public.store_operations x set invoice_id = p_invoice where x.id = p_operation;
 return 'mapped';
end $$;

-- Owner abandon: records intent only; the worker voids and verifies before any release.
create function public.store_operation_cancel_request(p_operation uuid, p_actor uuid) returns text
language plpgsql security definer set search_path = '' as $$
begin
 update public.store_operations o set state = 'cancel_requested', last_error_code = 'abandoned'
  where o.id = p_operation and o.actor_user_id = p_actor and o.kind = 'store_add' and o.state in ('payment_setup', 'payment_pending');
 if found then return 'cancel_requested'; end if;
 return 'not_cancellable';
end $$;

-- Attention without a lease (used by reconciliation that found a contradiction).
create function public.store_operation_attention(p_operation uuid, p_code text) returns text
language plpgsql security definer set search_path = '' as $$
begin
 update public.store_operations o set state = 'attention', last_error_code = p_code
  where o.id = p_operation and o.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested','requested');
 if found then return 'attention'; end if;
 return 'unchanged';
end $$;

-- 9. Atomic activation: only from a paid, mapped operation with verified quantity and unchanged period.
create function public.store_add_activate(p_operation uuid, p_invoice text, p_paid_cents integer, p_currency text,
  p_quantity integer, p_period_start timestamptz, p_period_end timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype; a public.accounts%rowtype; v_identity uuid; v_business uuid; v_now timestamptz;
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
 if not exists (select 1 from public.npi_reservations r where r.store_operation_id = o.id and r.npi = o.npi and r.status = 'op_held') then
  update public.store_operations x set state = 'attention', last_error_code = 'reservation_lost' where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', 'reservation_lost'); end if;
 if exists (select 1 from public.pharmacy_identities i where i.npi = o.npi) then
  update public.store_operations x set state = 'attention', last_error_code = 'npi_registered' where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', 'npi_registered'); end if;
 v_now := public.billing_now(o.account_id);
 insert into public.pharmacy_identities (npi) values (o.npi) returning id into v_identity;
 insert into public.businesses (account_id, pharmacy_id, npi, ncpdp, pharmacy_name, status, date_of_registration, ownership_started_at)
  values (o.account_id, v_identity, o.npi, o.ncpdp, o.store_name, 'active', v_now, v_now) returning id into v_business;
 insert into public.user_businesses (user_id, business_id, role, is_primary) values (a.owner_user_id, v_business, 'admin', false);
 update public.npi_reservations r set status = 'consumed' where r.store_operation_id = o.id and r.status = 'op_held';
 update public.subscriptions s set quantity = p_quantity where s.account_id = o.account_id and s.stripe_subscription_id = o.stripe_subscription_id;
 update public.provider_invoice_operations m set outcome = 'paid', verified_at = now() where m.invoice_id = p_invoice;
 update public.store_operations x set state = 'activated', business_id = v_business, pharmacy_id = v_identity, activated_at = now(),
   lease_owner = null, lease_until = null, last_error_code = null where x.id = o.id;
 return jsonb_build_object('outcome', 'activated', 'business_id', v_business);
end $$;

-- Due work for the expiry job: deadline passed or owner abandoned.
create function public.store_operations_due() returns setof uuid language sql stable security definer set search_path = '' as $$
 select o.id from public.store_operations o where o.kind = 'store_add' and (o.state = 'cancel_requested'
   or (o.state in ('payment_setup', 'payment_pending') and o.payment_deadline <= public.billing_now(o.account_id)))
 order by o.payment_deadline limit 50;
$$;

-- 10. Grants and catalogue assertions.
do $$
declare f text;
begin
 foreach f in array array['store_incremental_cents(integer,timestamp with time zone,timestamp with time zone,timestamp with time zone)',
   'store_period_window_refusal(integer,timestamp with time zone,timestamp with time zone,timestamp with time zone)',
   'store_is_live(uuid)', 'account_billable_count(uuid)', 'account_add_store_refusal(uuid)',
   'store_quote_create(uuid,uuid,text,text,text,text,text,text,text,integer,integer,timestamp with time zone,timestamp with time zone,text)',
   'store_operation_claim(uuid,uuid,text,text)', 'store_operation_lease(uuid,text,integer)', 'store_operation_release(uuid,text,bigint)',
   'store_operation_transition(uuid,text,bigint,text,text,text,text)', 'store_operation_intent(uuid,text,bigint,text,integer,text,jsonb)',
   'store_operation_intent_outcome(uuid,text,integer,text)', 'store_operation_map_invoice(uuid,text,bigint,text,text,integer)',
   'store_operation_cancel_request(uuid,uuid)', 'store_operation_attention(uuid,text)',
   'store_add_activate(uuid,text,integer,text,integer,timestamp with time zone,timestamp with time zone)', 'store_operations_due()'] loop
  execute format('revoke all on function public.%s from public, anon, authenticated', f);
  execute format('grant execute on function public.%s to service_role', f);
 end loop;
end $$;
do $$
declare bad text;
begin
 select string_agg(t || ':' || r, ', ') into bad
  from unnest(array['store_quotes','store_operations','provider_invoice_operations','provider_call_intents']) t cross join unnest(array['anon','authenticated']) r
  where has_table_privilege(r, ('public.' || t)::regclass, 'SELECT') or has_table_privilege(r, ('public.' || t)::regclass, 'INSERT')
     or has_table_privilege(r, ('public.' || t)::regclass, 'UPDATE') or has_table_privilege(r, ('public.' || t)::regclass, 'DELETE')
     or not (select relrowsecurity from pg_class where oid = ('public.' || t)::regclass);
 if bad is not null then raise exception 'APBM007B/0062 ASSERT: table reachable by customers or RLS off: %', bad; end if;
 select string_agg(p.oid::regprocedure::text || ':' || r, ', ') into bad
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace cross join unnest(array['anon','authenticated']) r
  where n.nspname = 'public' and ((p.proname like 'store\_%' and p.proname <> 'store_access_state') or p.proname in ('account_billable_count','account_add_store_refusal','npi_reserve'))
    and has_function_privilege(r, p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007B/0062 ASSERT: function executable by customers: %', bad; end if;
 if public.store_incremental_cents(4900, '2026-11-16 00:00:00+00', '2026-12-16 00:00:00+00', '2026-12-01 00:00:00+00') <> 2450
    or public.store_period_window_refusal(4900, '2026-11-16 00:00:00+00', '2026-12-16 00:00:00+00', '2026-12-15 18:00:00+00') <> 'below_minimum_charge'
    or public.store_period_window_refusal(4900, '2026-11-16 00:00:00+00', '2026-12-16 00:00:00+00', '2026-12-15 23:00:00+00') <> 'period_end_window'
    or public.store_period_window_refusal(4900, '2026-11-16 00:00:00+00', '2026-12-16 00:00:00+00', '2026-12-15 16:00:00+00') is not null then
  raise exception 'APBM007B/0062 ASSERT: pricing self-check failed'; end if;
end $$;
