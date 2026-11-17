-- APBM-007B 0063: active-ownership identity index, live-store predicate on EVERY tenant path, scheduled removal /
-- undo / finalize, operator-authorized transfer with exact-buyer hold, seller-owner historical reads
-- (CONTRACTS/LIFECYCLE_AND_TRANSFER.md incl. BP-02/BP-03, BILLING.md quantity accounting).

-- 1. One current ownership per canonical identity and per NPI; the old all-row NPI rules are replaced only now.
do $$
begin
 if exists (select 1 from public.businesses b where b.pharmacy_id is null) then raise exception 'APBM007B/0063 ASSERT: unmapped ownership'; end if;
 if exists (select 1 from (select pharmacy_id from public.businesses where ownership_ended_at is null group by 1 having count(*) > 1) d) then
  raise exception 'APBM007B/0063 ASSERT: two current ownerships of one pharmacy'; end if;
end $$;
create unique index businesses_one_current_ownership on public.businesses (pharmacy_id) where ownership_ended_at is null;
create unique index businesses_one_active_npi on public.businesses (npi) where ownership_ended_at is null;
drop index public.uq_businesses_npi;
alter table public.businesses drop constraint uq_businesses_ncpdp_npi;
alter table public.businesses add constraint businesses_npi_matches_identity_check check (npi is not null);

-- 2. Live-store predicate on every helper. Ownership rows that ended, or passed their removal cutoff on the account's
--    clock, grant nothing through membership, ownership, definer wrappers or direct RLS reads.
create or replace function public.my_business_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
 select ub.business_id from public.user_businesses ub where ub.user_id = auth.uid() and public.store_is_live(ub.business_id)
 union
 select b.id from public.businesses b where public.is_owner_of_account(b.account_id) and public.store_is_live(b.id);
$$;
create or replace function public.is_member_of(biz uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.user_businesses ub where ub.user_id = auth.uid() and ub.business_id = biz) and public.store_is_live(biz);
$$;
create or replace function public.is_admin_of(biz uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.user_businesses ub where ub.user_id = auth.uid() and ub.business_id = biz and ub.role = 'admin') and public.store_is_live(biz);
$$;
create or replace function public.is_account_member(acct uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.user_businesses ub join public.businesses b on b.id = ub.business_id
   where ub.user_id = auth.uid() and b.account_id = acct and public.store_is_live(b.id));
$$;

drop policy "user_business_select_self_or_owner" on public.user_businesses;
create policy "user_business_select_live_self_or_owner" on public.user_businesses for select to authenticated
 using (business_id in (select public.my_business_ids()) and (user_id = auth.uid() or exists (select 1 from public.businesses b
   where b.id = user_businesses.business_id and public.is_owner_of_account(b.account_id))));   -- my_business_ids() is live-only

create or replace function public.admin_stores(p_business_id uuid default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists (select 1 from public.businesses b where (p_business_id is null or b.id = p_business_id)
   and public.store_is_live(b.id) and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) then
  raise exception 'not an administrator of business' using errcode = '42501'; end if;
 select coalesce(jsonb_agg(row_data order by row_data->>'name'), '[]'::jsonb) into result from (
  select jsonb_build_object('id', b.id, 'account_id', b.account_id, 'name', b.pharmacy_name, 'ncpdp', b.ncpdp, 'npi', b.npi, 'status', b.status,
    'removal_effective_at', b.removal_effective_at,
    'member_count', (select count(*) from public.user_businesses ub where ub.business_id = b.id))
  || case when public.is_owner_of_account(b.account_id) then jsonb_build_object(
    'subscription_status', (select s.status from public.subscriptions s where s.account_id = b.account_id order by s.created_at desc, s.id limit 1))
   else '{}'::jsonb end row_data
  from public.businesses b where (p_business_id is null or b.id = p_business_id) and public.store_is_live(b.id)
   and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) scoped;
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business_id, 'businesses', 'read_page', jsonb_build_object('fn', 'admin_stores'));
 return result;
end $$;

create or replace function public.admin_members(p_business_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
 if p_business_id is null or not exists (select 1 from public.businesses b where b.id = p_business_id and public.store_is_live(b.id)
   and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) then
  raise exception 'not an administrator of business' using errcode = '42501'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id', ub.user_id, 'business_id', ub.business_id, 'name', p.full_name, 'email', p.email, 'role', ub.role) order by ub.user_id), '[]'::jsonb)
  into result from public.user_businesses ub left join public.profiles p on p.id = ub.user_id where ub.business_id = p_business_id;
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business_id, 'user_businesses', 'read_page', jsonb_build_object('fn', 'admin_members'));
 return result;
end $$;

create or replace function public.admin_billing_status(p_business_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare acct uuid; result jsonb;
begin
 select b.account_id into acct from public.businesses b where b.id = p_business_id and public.store_is_live(b.id) and public.is_owner_of_account(b.account_id);
 if acct is null then raise exception 'not the owner of account' using errcode = '42501'; end if;
 select jsonb_build_object('account_id', acct, 'subscriptions', coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'status', s.status,
   'trial_end_date', s.trial_end_date, 'current_period_end', s.current_period_end, 'cancel_at_period_end', s.cancel_at_period_end,
   'cancel_at', s.cancel_at, 'origin', s.origin) order by s.created_at, s.id), '[]'::jsonb))
  into result from public.subscriptions s where s.account_id = acct;
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business_id, 'subscriptions', 'read_page', jsonb_build_object('fn', 'admin_billing_status', 'account_id', acct));
 return result;
end $$;

create or replace function public.admin_audit(p_business_id uuid, p_limit integer default 50, p_before bigint default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare acct uuid; owner_access boolean; snapshot_id bigint; result jsonb;
begin
 select b.account_id, public.is_owner_of_account(b.account_id) into acct, owner_access from public.businesses b
  where b.id = p_business_id and public.store_is_live(b.id) and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id));
 if acct is null then raise exception 'not an administrator of business' using errcode = '42501'; end if;
 if p_limit is null or p_limit < 1 or p_limit > 100 then raise exception 'invalid limit' using errcode = '22023'; end if;
 select coalesce(max(a.id), 0) into snapshot_id from public.audit_logs a;
 select coalesce(jsonb_agg(to_jsonb(scoped) order by scoped.id desc), '[]'::jsonb) into result from (
  select a.id, a.occurred_at, a.actor_user_id, a.business_id, a.table_name, a.row_id, a.action, a.context
  from public.audit_logs a where a.id <= snapshot_id and (p_before is null or a.id < p_before)
   and ((not owner_access and a.business_id = p_business_id) or (owner_access and (
    a.business_id in (select b.id from public.businesses b where b.account_id = acct and public.store_is_live(b.id))
    or (a.business_id is null and a.table_name = 'accounts' and a.row_id = acct::text)
    or (a.business_id is null and a.table_name = 'subscriptions' and (a.new_data->>'account_id' = acct::text or a.old_data->>'account_id' = acct::text)))))
  order by a.id desc limit p_limit) scoped;
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business_id, 'audit_logs', 'read_page', jsonb_build_object('fn', 'admin_audit', 'account_id', acct, 'snapshot_id', snapshot_id));
 return jsonb_build_object('rows', result, 'snapshot_id', snapshot_id);
end $$;

create or replace function public.owner_billing_overview()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare acct uuid; s public.subscriptions%rowtype; result jsonb; v_found boolean;
begin
 select a.id into acct from public.accounts a where a.owner_user_id = auth.uid() order by a.created_at, a.id limit 1;
 if auth.uid() is null or acct is null then raise exception 'not the owner of an account' using errcode = '42501'; end if;
 select * into s from public.subscriptions x where x.account_id = acct order by (x.status is distinct from 'canceled') desc, x.created_at desc, x.id limit 1;
 v_found := found;
 result := jsonb_build_object('account_id', acct, 'access', public.account_access_state(acct),
  'subscription', case when v_found then jsonb_build_object('id', s.id, 'origin', s.origin, 'status', s.status, 'raw_status', s.raw_status,
    'quantity', s.quantity, 'current_period_start', s.current_period_start, 'current_period_end', s.current_period_end,
    'cancel_at', s.cancel_at, 'cancel_at_period_end', s.cancel_at_period_end, 'paid_through', coalesce(s.cancel_at, s.current_period_end),
    'latest_invoice_status', s.latest_invoice_status, 'grace_started_at', s.grace_started_at, 'verified_at', s.verified_at) else null end,
  'billable_count', public.account_billable_count(acct),
  'stores', (select coalesce(jsonb_agg(jsonb_build_object('id', b.id, 'name', b.pharmacy_name, 'npi', b.npi, 'status', b.status,
     'removal_effective_at', b.removal_effective_at) order by b.pharmacy_name, b.id), '[]'::jsonb)
   from public.businesses b where b.account_id = acct and public.store_is_live(b.id)));
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', null, 'subscriptions', 'read_page', jsonb_build_object('fn', 'owner_billing_overview', 'account_id', acct));
 return result;
end $$;

-- 3. Scheduled removal and undo (one shared window predicate, bound period, verified commit).
create function public.store_lifecycle_request(p_kind text, p_account uuid, p_actor uuid, p_business uuid, p_intent text,
  p_customer text, p_subscription text, p_item text, p_unit integer, p_quantity integer, p_period_start timestamptz, p_period_end timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare b public.businesses%rowtype; o public.store_operations%rowtype; v_at timestamptz; v_refusal text; v_billable integer; st jsonb; v_sub public.subscriptions%rowtype;
begin
 if p_kind not in ('store_removal', 'store_removal_undo') then return jsonb_build_object('error', 'invalid_kind'); end if;
 perform 1 from public.accounts a where a.id = p_account for update;
 if not exists (select 1 from public.accounts a where a.id = p_account and a.owner_user_id = p_actor) then return jsonb_build_object('error', 'not_owner'); end if;
 select * into o from public.store_operations x where x.account_id = p_account and x.intent_key = p_intent;
 if found then
  if o.kind = p_kind and o.business_id = p_business then return jsonb_build_object('operation', to_jsonb(o) - 'hosted_invoice_url', 'resumed', true); end if;
  return jsonb_build_object('error', 'intent_conflict');
 end if;
 select * into b from public.businesses x where x.id = p_business and x.account_id = p_account for update;
 if not found or not public.store_is_live(b.id) then return jsonb_build_object('error', 'store_not_found'); end if;
 if exists (select 1 from public.store_transfers t where t.source_business_id = b.id and t.status in ('authorized', 'buyer_reserved', 'attention')) then
  return jsonb_build_object('error', 'transfer_in_progress'); end if;
 st := public.account_access_state(p_account);
 if st->>'state' in ('read_only', 'ended') then return jsonb_build_object('error', 'account_read_only'); end if;
 if exists (select 1 from public.store_operations x where x.account_id = p_account
   and x.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested','attention','requested')) then
  return jsonb_build_object('error', 'operation_unresolved'); end if;
 select * into v_sub from public.subscriptions s where s.account_id = p_account and s.origin = 'stripe' and s.status <> 'canceled' order by s.created_at desc limit 1;
 if not found or v_sub.stripe_subscription_id is distinct from p_subscription or v_sub.stripe_customer_id is distinct from p_customer then
  return jsonb_build_object('error', 'billing_binding_mismatch'); end if;
 v_billable := public.account_billable_count(p_account);
 if p_quantity is distinct from v_billable then return jsonb_build_object('error', 'quantity_mismatch'); end if;
 v_at := public.billing_now(p_account);
 if p_period_start > v_at or p_period_end <= v_at then return jsonb_build_object('error', 'period_mismatch'); end if;
 v_refusal := public.store_period_window_refusal(p_unit, p_period_start, p_period_end, v_at);
 if v_refusal is not null then return jsonb_build_object('error', v_refusal); end if;
 if p_kind = 'store_removal' then
  if b.removal_effective_at is not null then return jsonb_build_object('error', 'already_scheduled'); end if;
  if v_billable <= 1 then return jsonb_build_object('error', 'last_store'); end if;
 else
  if b.removal_effective_at is null then return jsonb_build_object('error', 'not_scheduled'); end if;
  if v_at >= b.removal_effective_at then return jsonb_build_object('error', 'cutoff_passed'); end if;
  if b.removal_effective_at <> p_period_end then return jsonb_build_object('error', 'period_mismatch'); end if;
 end if;
 insert into public.store_operations (account_id, kind, state, intent_key, actor_user_id, business_id, stripe_customer_id, stripe_subscription_id,
   stripe_item_id, period_start, period_end, target_quantity)
 values (p_account, p_kind, 'requested', p_intent, p_actor, b.id, p_customer, p_subscription, p_item, p_period_start, p_period_end,
   case when p_kind = 'store_removal' then v_billable - 1 else v_billable + 1 end)
 returning * into o;
 return jsonb_build_object('operation', to_jsonb(o) - 'hosted_invoice_url', 'resumed', false);
end $$;

-- Commit after the provider quantity change was re-read. A changed period or quantity enters attention.
create function public.store_lifecycle_commit(p_operation uuid, p_owner text, p_epoch bigint, p_quantity integer,
  p_period_start timestamptz, p_period_end timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype; v_at timestamptz;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found or o.kind not in ('store_removal', 'store_removal_undo') then return jsonb_build_object('outcome', 'unknown_operation'); end if;
 if o.state = 'completed' then return jsonb_build_object('outcome', 'already_completed'); end if;
 if o.state <> 'requested' then return jsonb_build_object('outcome', 'not_requested'); end if;
 if o.lease_owner is distinct from p_owner or o.fencing_epoch <> p_epoch or o.lease_until <= now() then return jsonb_build_object('outcome', 'lease_lost'); end if;
 perform 1 from public.accounts a where a.id = o.account_id for update;
 if p_period_start <> o.period_start or p_period_end <> o.period_end then
  update public.store_operations x set state = 'attention', last_error_code = 'period_changed' where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', 'period_changed'); end if;
 if p_quantity <> o.target_quantity then
  update public.store_operations x set state = 'attention', last_error_code = 'quantity_mismatch' where x.id = o.id;
  return jsonb_build_object('outcome', 'attention', 'code', 'quantity_mismatch'); end if;
 v_at := public.billing_now(o.account_id);
 if o.kind = 'store_removal' then
  update public.businesses b set removal_requested_at = v_at, removal_effective_at = o.period_end where b.id = o.business_id and b.removal_effective_at is null;
 else
  if v_at >= o.period_end then
   update public.store_operations x set state = 'attention', last_error_code = 'cutoff_passed' where x.id = o.id;
   return jsonb_build_object('outcome', 'attention', 'code', 'cutoff_passed'); end if;
  update public.businesses b set removal_requested_at = null, removal_effective_at = null where b.id = o.business_id;
 end if;
 update public.subscriptions s set quantity = p_quantity where s.account_id = o.account_id and s.stripe_subscription_id = o.stripe_subscription_id;
 update public.store_operations x set state = 'completed', lease_owner = null, lease_until = null, last_error_code = null, closed_at = now() where x.id = o.id;
 return jsonb_build_object('outcome', 'completed', 'effective_at', o.period_end, 'billable', public.account_billable_count(o.account_id));
end $$;

-- Lifecycle requests that never committed (crash between request and commit) are reconciled by the job.
create function public.store_lifecycle_due() returns setof uuid language sql stable security definer set search_path = '' as $$
 select o.id from public.store_operations o where o.kind in ('store_removal', 'store_removal_undo') and o.state = 'requested'
   and o.updated_at < now() - interval '2 minutes' order by o.created_at limit 50;
$$;

-- Boundary finalize: idempotent housekeeping. Access already ended at the cutoff by store_is_live.
create function public.store_removal_finalize(p_business uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare b public.businesses%rowtype; v_transfer uuid;
begin
 select * into b from public.businesses x where x.id = p_business for update;
 if not found or b.ownership_ended_at is not null then return 'already_final'; end if;
 if b.removal_effective_at is null or public.billing_now(b.account_id) < b.removal_effective_at then return 'not_due'; end if;
 select t.id into v_transfer from public.store_transfers t where t.source_business_id = b.id and t.status = 'authorized' for update;
 update public.businesses x set ownership_ended_at = b.removal_effective_at, removed_at = now(),
   status = case when v_transfer is null then 'removed' else 'transferred' end,
   transferred_at = case when v_transfer is null then null else b.removal_effective_at end
  where x.id = b.id;
 delete from public.user_businesses ub where ub.business_id = b.id;
 if v_transfer is not null then
  perform pg_advisory_xact_lock(hashtextextended('apbm007a:npi:' || b.npi, 0));
  insert into public.npi_reservations (npi, transfer_id, status, expires_at)
   select b.npi, t.id, 'transfer_held', t.hold_expires_at from public.store_transfers t where t.id = v_transfer;
  update public.store_transfers t set status = 'buyer_reserved', source_ended_at = b.removal_effective_at where t.id = v_transfer;
 end if;
 return case when v_transfer is null then 'removed' else 'transferred' end;
end $$;
create function public.store_removals_due() returns setof uuid language sql stable security definer set search_path = '' as $$
 select b.id from public.businesses b where b.ownership_ended_at is null and b.removal_effective_at is not null
   and b.removal_effective_at <= public.billing_now(b.account_id) order by b.removal_effective_at limit 100;
$$;

-- 4. Operator-authorized transfer (exact IDs). Seller access ends at the effective time; the buyer is held from then.
create table public.store_transfers (
 id uuid primary key default gen_random_uuid(),
 pharmacy_id uuid not null references public.pharmacy_identities (id),
 source_business_id uuid not null references public.businesses (id),
 source_account_id uuid not null references public.accounts (id),
 buyer_account_id uuid not null references public.accounts (id),
 effective_at timestamptz not null,
 hold_expires_at timestamptz not null,
 status text not null check (status in ('authorized', 'buyer_reserved', 'completed', 'canceled', 'attention')),
 source_ended_at timestamptz,
 buyer_business_id uuid references public.businesses (id),
 operator_action_ref text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (buyer_account_id <> source_account_id), check (hold_expires_at > effective_at)
);
create unique index store_transfers_one_open on public.store_transfers (pharmacy_id) where status in ('authorized', 'buyer_reserved', 'attention');
alter table public.store_transfers enable row level security;
revoke all on public.store_transfers from public, anon, authenticated;
grant select on public.store_transfers to service_role;
create trigger set_updated_at before update on public.store_transfers for each row execute function public.update_updated_at();
create trigger audit_write after insert or update or delete on public.store_transfers for each row execute function public.audit_write();
alter table public.npi_reservations add constraint npi_reservations_transfer_fk foreign key (transfer_id) references public.store_transfers (id);
alter table public.store_quotes add constraint store_quotes_transfer_fk foreign key (transfer_id) references public.store_transfers (id);
alter table public.store_operations add constraint store_operations_transfer_fk foreign key (transfer_id) references public.store_transfers (id);

-- Authorize: the seller's removal is scheduled for the effective time by the caller's verified provider step
-- (operator command), recorded here atomically with the transfer. Never the seller's last billable store.
create function public.store_transfer_authorize(p_source_business uuid, p_buyer_account uuid, p_effective_at timestamptz, p_hold_hours integer, p_ref text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare b public.businesses%rowtype; t public.store_transfers%rowtype;
begin
 select * into b from public.businesses x where x.id = p_source_business for update;
 if not found or not public.store_is_live(b.id) then return jsonb_build_object('error', 'source_not_live'); end if;
 perform 1 from public.accounts a where a.id = b.account_id for update;
 if not exists (select 1 from public.accounts a where a.id = p_buyer_account) or p_buyer_account = b.account_id then return jsonb_build_object('error', 'invalid_buyer'); end if;
 if b.removal_effective_at is not null then return jsonb_build_object('error', 'removal_already_scheduled'); end if;
 if public.account_billable_count(b.account_id) <= 1 then return jsonb_build_object('error', 'source_last_store'); end if;
 if p_effective_at <= public.billing_now(b.account_id) then return jsonb_build_object('error', 'effective_in_past'); end if;
 if exists (select 1 from public.store_transfers x where x.pharmacy_id = b.pharmacy_id and x.status in ('authorized', 'buyer_reserved', 'attention')) then
  return jsonb_build_object('error', 'transfer_open'); end if;
 if exists (select 1 from public.store_operations x where x.account_id = b.account_id
   and x.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested','attention','requested')) then
  return jsonb_build_object('error', 'operation_unresolved'); end if;
 insert into public.store_transfers (pharmacy_id, source_business_id, source_account_id, buyer_account_id, effective_at, hold_expires_at, status, operator_action_ref)
  values (b.pharmacy_id, b.id, b.account_id, p_buyer_account, p_effective_at, p_effective_at + make_interval(hours => least(greatest(coalesce(p_hold_hours, 48), 1), 168)), 'authorized', p_ref)
  returning * into t;
 update public.businesses x set removal_requested_at = public.billing_now(b.account_id), removal_effective_at = p_effective_at where x.id = b.id;
 return jsonb_build_object('transfer', to_jsonb(t));
end $$;

-- Cancel only before the effective time and before any buyer payment; the source removal is cleared.
create function public.store_transfer_cancel(p_transfer uuid, p_ref text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare t public.store_transfers%rowtype;
begin
 select * into t from public.store_transfers x where x.id = p_transfer for update;
 if not found then return jsonb_build_object('error', 'unknown_transfer'); end if;
 if t.status <> 'authorized' then return jsonb_build_object('error', 'not_cancellable', 'status', t.status); end if;
 if public.billing_now(t.source_account_id) >= t.effective_at then return jsonb_build_object('error', 'effective_time_passed'); end if;
 update public.businesses b set removal_requested_at = null, removal_effective_at = null where b.id = t.source_business_id and b.ownership_ended_at is null;
 update public.store_transfers x set status = 'canceled', operator_action_ref = coalesce(p_ref, x.operator_action_ref) where x.id = t.id;
 return jsonb_build_object('transfer_id', t.id, 'status', 'canceled');
end $$;

-- Hold expiry without buyer payment goes to attention; the NPI stays held (never released to the public by time).
create function public.store_transfers_expired() returns setof uuid language sql stable security definer set search_path = '' as $$
 select t.id from public.store_transfers t where t.status = 'buyer_reserved' and t.hold_expires_at <= now()
   and not exists (select 1 from public.store_operations o where o.transfer_id = t.id and o.state in ('payment_setup','payment_pending','paid_pending_activation','cancel_requested'));
$$;
create function public.store_transfer_mark_attention(p_transfer uuid, p_code text) returns text
language sql security definer set search_path = '' as $$
 update public.store_transfers t set status = 'attention' where t.id = p_transfer and t.status = 'buyer_reserved' returning 'attention';
$$;

-- 5. Add Store quote/claim/activation extended for the exact buyer of a transfer (replaces the 0062 bodies).
create or replace function public.store_quote_create(p_account uuid, p_actor uuid, p_store_name text, p_npi text, p_ncpdp text,
  p_customer text, p_subscription text, p_item text, p_price text, p_unit integer, p_quantity integer,
  p_period_start timestamptz, p_period_end timestamptz, p_terms_version text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare a public.accounts%rowtype; v_at timestamptz; v_amount integer; v_refusal text; v_billable integer; q public.store_quotes%rowtype;
        v_identity uuid; v_sub public.subscriptions%rowtype; t public.store_transfers%rowtype;
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
  if not found then return jsonb_build_object('error', 'npi_previously_registered'); end if;   -- default 9 pending; no reactivation history reuse
  if v_at < t.effective_at then return jsonb_build_object('error', 'transfer_not_effective'); end if;
  if now() >= t.hold_expires_at then return jsonb_build_object('error', 'transfer_hold_expired'); end if;
 elsif exists (select 1 from public.npi_reservations x where x.npi = p_npi and x.status in ('held','checkout_bound','op_held','transfer_held')) then
  return jsonb_build_object('error', 'npi_held');
 end if;
 if p_period_start > v_at or p_period_end <= v_at then return jsonb_build_object('error', 'period_mismatch'); end if;
 v_refusal := public.store_period_window_refusal(p_unit, p_period_start, p_period_end, v_at);
 if v_refusal is not null then return jsonb_build_object('error', v_refusal); end if;
 v_amount := public.store_incremental_cents(p_unit, p_period_start, p_period_end, v_at);
 insert into public.store_quotes (account_id, actor_user_id, store_name, npi, ncpdp, pharmacy_id, transfer_id, stripe_customer_id, stripe_subscription_id, stripe_item_id,
   stripe_price_id, currency, additional_unit_cents, period_start, period_end, computed_at, amount_cents, billable_before, billable_after,
   next_renewal_cents, discount_explanation, terms_version, expires_at)
 values (p_account, p_actor, btrim(p_store_name), p_npi, p_ncpdp, v_identity, t.id, p_customer, p_subscription, p_item, p_price, 'usd', p_unit,
   p_period_start, p_period_end, v_at, v_amount, v_billable, v_billable + 1, 9900 + p_unit * v_billable,
   'Charged only for the new store from now until your current period ends. Your existing stores and any first-store discount you already received are unchanged.',
   p_terms_version, v_at + interval '15 minutes')
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
 if q.transfer_id is null then
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
   period_start, period_end, target_quantity)
 values (q.account_id, 'store_add', 'payment_setup', p_intent, p_actor, q.id, q.store_name, q.npi, q.ncpdp, q.pharmacy_id, q.transfer_id,
   q.amount_cents, 'usd', v_at, q.terms_version, v_deadline, q.stripe_customer_id, q.stripe_subscription_id, q.stripe_item_id,
   q.period_start, q.period_end, q.billable_after)
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
 if o.transfer_id is null then
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

-- 6. Seller-owner historical reads: transferred ownerships of the caller's own account only. Staff, buyer, foreign
--    and ordinary removed stores get nothing.
create function public.owner_history_stores() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
 if auth.uid() is null then raise exception 'not authenticated' using errcode = '42501'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id', b.id, 'name', b.pharmacy_name, 'npi', b.npi, 'transferred_at', b.transferred_at) order by b.transferred_at desc), '[]'::jsonb)
  from public.businesses b join public.accounts a on a.id = b.account_id
  where a.owner_user_id = auth.uid() and b.status = 'transferred' and b.ownership_ended_at is not null);
end $$;
create function public.owner_history_rows(p_business_id uuid, p_limit integer default 100, p_offset integer default 0) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists (select 1 from public.businesses b join public.accounts a on a.id = b.account_id
   where b.id = p_business_id and a.owner_user_id = auth.uid() and b.status = 'transferred') then
  raise exception 'not the source owner of this transferred store' using errcode = '42501'; end if;
 if p_limit is null or p_limit < 1 or p_limit > 500 or p_offset is null or p_offset < 0 then raise exception 'invalid page' using errcode = '22023'; end if;
 select jsonb_build_object('business_id', p_business_id, 'read_only', true,
   'total_owed', (select coalesce(sum(u.owed), 0) from public.user_data u where u.business_id = p_business_id),
   'rows', coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'date_dispensed', r.date_dispensed, 'script', r.script, 'drug_name', r.drug_name,
     'insurance', r.insurance, 'status', r.status, 'total_paid', r.total_paid, 'owed', r.owed) order by r.date_dispensed desc nulls last, r.id), '[]'::jsonb))
  into result from (select * from public.user_data u where u.business_id = p_business_id order by u.date_dispensed desc nulls last, u.id limit p_limit offset p_offset) r;
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business_id, 'user_data', 'read_page', jsonb_build_object('fn', 'owner_history_rows', 'scope', 'seller_history'));
 return result;
end $$;

-- 7. Grants and assertions.
do $$
declare f text;
begin
 foreach f in array array['store_lifecycle_request(text,uuid,uuid,uuid,text,text,text,text,integer,integer,timestamp with time zone,timestamp with time zone)',
   'store_lifecycle_commit(uuid,text,bigint,integer,timestamp with time zone,timestamp with time zone)', 'store_lifecycle_due()',
   'store_removal_finalize(uuid)', 'store_removals_due()', 'store_transfer_authorize(uuid,uuid,timestamp with time zone,integer,text)',
   'store_transfer_cancel(uuid,text)', 'store_transfers_expired()', 'store_transfer_mark_attention(uuid,text)'] loop
  execute format('revoke all on function public.%s from public, anon, authenticated', f);
  execute format('grant execute on function public.%s to service_role', f);
 end loop;
 revoke all on function public.owner_history_stores(), public.owner_history_rows(uuid, integer, integer) from public, anon;
 grant execute on function public.owner_history_stores(), public.owner_history_rows(uuid, integer, integer) to authenticated, service_role;
end $$;
do $$
declare bad text;
begin
 if has_table_privilege('authenticated', 'public.store_transfers', 'SELECT') or has_table_privilege('anon', 'public.store_transfers', 'SELECT') then
  raise exception 'APBM007B/0063 ASSERT: store_transfers readable by customers'; end if;
 select string_agg(p.oid::regprocedure::text || ':' || r, ', ') into bad
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace cross join unnest(array['anon','authenticated']) r
  where n.nspname = 'public' and ((p.proname like 'store\_%' and p.proname <> 'store_access_state') or p.proname like 'account\_billable%')
    and has_function_privilege(r, p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007B/0063 ASSERT: lifecycle function executable by customers: %', bad; end if;
 if has_function_privilege('anon', 'public.owner_history_rows(uuid,integer,integer)', 'EXECUTE') then raise exception 'APBM007B/0063 ASSERT: history readable by anon'; end if;
 -- every policy or definer wrapper that reached businesses via membership/ownership now carries the live predicate
 select string_agg(p.proname, ', ') into bad from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname in ('my_business_ids','is_member_of','is_admin_of','is_account_member','admin_stores','admin_members','admin_billing_status','admin_audit','owner_billing_overview')
    and pg_get_functiondef(p.oid) not like '%store_is_live%';
 if bad is not null then raise exception 'APBM007B/0063 ASSERT: tenant path without live predicate: %', bad; end if;
end $$;
