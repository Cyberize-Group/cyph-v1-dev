-- APBM-007B 0066: append-only operator audit, account-owner uniqueness, verified owner/admin recovery, paid-operation
-- external-refund close (BP-04), removed-store reactivation authorization (BP-05; history behaviour awaits Director
-- decision 9), operator resume after owner reconfirmation (CONTRACTS/LIFECYCLE_AND_TRANSFER.md, BILLING.md).

create table public.operator_actions (
 id bigserial primary key,
 action text not null check (action in ('store-transfer-authorize','store-transfer-complete','store-transfer-cancel','owner-replace','store-admin-set',
   'store-operation-reconcile','store-operation-close','quantity-check','removed-store-reactivate','event-recover','operation-recover')),
 authenticated_as text not null check (authenticated_as = 'shared_operator_v1'),
 declared_actor text not null check (length(btrim(declared_actor)) between 2 and 120),
 reason text not null check (length(btrim(reason)) between 3 and 500),
 ticket text not null check (ticket ~ '^[A-Za-z0-9][A-Za-z0-9_.:#/-]{1,79}$'),
 phase text not null check (phase in ('dry_run', 'apply')),
 target jsonb not null,
 before_state jsonb,
 after_state jsonb,
 result text not null check (result in ('planned', 'applied', 'refused', 'failed', 'partial')),
 error_code text,
 created_at timestamptz not null default now()
);
alter table public.operator_actions enable row level security;
revoke all on public.operator_actions from public, anon, authenticated;
grant select on public.operator_actions to service_role;
create function public.operator_actions_append_only() returns trigger language plpgsql set search_path = '' as $$
begin raise exception 'operator_actions is append-only' using errcode = '42501'; end $$;
create trigger operator_actions_no_update before update or delete on public.operator_actions for each row execute function public.operator_actions_append_only();

create function public.operator_action_record(p_action text, p_actor text, p_reason text, p_ticket text, p_phase text, p_target jsonb,
  p_before jsonb, p_after jsonb, p_result text, p_error text) returns bigint
language sql security definer set search_path = '' as $$
 insert into public.operator_actions (action, authenticated_as, declared_actor, reason, ticket, phase, target, before_state, after_state, result, error_code)
 values (p_action, 'shared_operator_v1', p_actor, p_reason, p_ticket, p_phase, p_target, p_before, p_after, p_result, p_error) returning id;
$$;

-- One owned account per identity (inventory found no duplicates on SCRATCH or DEV; asserted here, never normalized).
do $$
begin
 if exists (select 1 from (select owner_user_id from public.accounts group by 1 having count(*) > 1) d) then
  raise exception 'APBM007B/0066 ASSERT: duplicate account owners present; owner uniqueness not applied, disposition required'; end if;
end $$;
create unique index accounts_one_per_owner on public.accounts (owner_user_id);

-- owner-replace: verified same-account identity recovery (not a sale). The old identity loses every access-granting
-- membership on this account and its pending invitation/handoff authority; stores keep exactly one admin.
create function public.owner_replace(p_account uuid, p_new_owner uuid, p_ref text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare a public.accounts%rowtype; v_old uuid; r record;
begin
 select * into a from public.accounts x where x.id = p_account for update;
 if not found then return jsonb_build_object('error', 'unknown_account'); end if;
 v_old := a.owner_user_id;
 if v_old = p_new_owner then return jsonb_build_object('outcome', 'already_owner'); end if;
 if not exists (select 1 from auth.users u where u.id = p_new_owner and u.email_confirmed_at is not null) then return jsonb_build_object('error', 'new_owner_not_confirmed'); end if;
 if exists (select 1 from public.accounts x where x.owner_user_id = p_new_owner) then return jsonb_build_object('error', 'new_owner_has_account'); end if;
 update public.accounts x set owner_user_id = p_new_owner where x.id = p_account;
 for r in select b.id from public.businesses b where b.account_id = p_account and b.ownership_ended_at is null loop
  perform 1 from public.businesses b where b.id = r.id for update;
  if exists (select 1 from public.user_businesses ub where ub.business_id = r.id and ub.user_id = v_old and ub.role = 'admin') then
   delete from public.user_businesses ub where ub.business_id = r.id and ub.user_id = v_old;
   insert into public.user_businesses (user_id, business_id, role, is_primary) values (p_new_owner, r.id, 'admin', false)
    on conflict (user_id, business_id) do update set role = 'admin';
  else
   delete from public.user_businesses ub where ub.business_id = r.id and ub.user_id = v_old;
  end if;
 end loop;
 update public.store_invitations i set status = 'revoked', revoked_at = now(), status_reason = 'owner_replaced'
  where i.account_id = p_account and i.status = 'pending' and i.inviter_user_id = v_old;
 if to_regprocedure('public.handoff_invalidate_user(uuid)') is not null then perform public.handoff_invalidate_user(v_old); end if;
 return jsonb_build_object('outcome', 'replaced', 'old_owner', v_old, 'new_owner', p_new_owner);
end $$;

-- store-admin-set: support recovery when the owner cannot act. Exactly one admin afterwards.
create function public.store_admin_set(p_business uuid, p_user uuid, p_disposition text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_owner uuid;
begin
 if p_disposition not in ('member', 'remove') then return jsonb_build_object('error', 'invalid_disposition'); end if;
 perform 1 from public.businesses b where b.id = p_business for update;
 if not public.store_is_live(p_business) then return jsonb_build_object('error', 'store_not_live'); end if;
 if not exists (select 1 from auth.users u where u.id = p_user and u.email_confirmed_at is not null) then return jsonb_build_object('error', 'user_not_confirmed'); end if;
 select a.owner_user_id into v_owner from public.businesses b join public.accounts a on a.id = b.account_id where b.id = p_business;
 select ub.user_id into v_admin from public.user_businesses ub where ub.business_id = p_business and ub.role = 'admin';
 if v_admin = p_user then return jsonb_build_object('outcome', 'already_admin'); end if;
 if v_admin is not null then
  if p_disposition = 'remove' and v_admin <> v_owner then delete from public.user_businesses ub where ub.business_id = p_business and ub.user_id = v_admin;
  else update public.user_businesses ub set role = 'member' where ub.business_id = p_business and ub.user_id = v_admin; end if;
 end if;
 insert into public.user_businesses (user_id, business_id, role, is_primary) values (p_user, p_business, 'admin', false)
  on conflict (user_id, business_id) do update set role = 'admin';
 update public.store_invitations i set status = 'revoked', revoked_at = now(), status_reason = 'stale_incumbent'
  where i.business_id = p_business and i.status = 'pending' and i.role = 'admin';
 return jsonb_build_object('outcome', 'admin_set', 'previous_admin', v_admin);
end $$;

-- store-operation-close (BP-04): only on full provider refund/credit proof verified by the operator command; terminal.
create function public.store_operation_close(p_operation uuid, p_invoice text, p_paid_cents integer, p_refunded_cents integer, p_credited_cents integer,
  p_currency text, p_proof_ref text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found or o.kind <> 'store_add' then return jsonb_build_object('error', 'unknown_operation'); end if;
 if o.state = 'closed_refunded_externally' then return jsonb_build_object('outcome', 'already_closed', 'close_reference', o.close_reference); end if;
 if o.state not in ('paid_pending_activation', 'attention') then return jsonb_build_object('error', 'not_closable', 'state', o.state); end if;
 if o.invoice_id is distinct from p_invoice or p_currency <> 'usd' or p_paid_cents <> o.amount_cents then return jsonb_build_object('error', 'proof_mismatch'); end if;
 if coalesce(p_refunded_cents, 0) + coalesce(p_credited_cents, 0) < p_paid_cents then return jsonb_build_object('error', 'partial_proof'); end if;
 if p_proof_ref is null or length(btrim(p_proof_ref)) < 3 then return jsonb_build_object('error', 'proof_reference_required'); end if;
 update public.store_operations x set state = 'closed_refunded_externally', closed_at = now(), close_reference = p_proof_ref, lease_owner = null, lease_until = null where x.id = o.id;
 update public.npi_reservations r set status = 'released' where r.store_operation_id = o.id and r.status = 'op_held';
 update public.provider_invoice_operations m set outcome = 'paid', verified_at = now() where m.invoice_id = p_invoice;
 return jsonb_build_object('outcome', 'closed', 'close_reference', p_proof_ref);
end $$;

-- store-operation-reconcile resume: a late-paid operation in attention returns to activation ONLY after a recorded owner
-- reconfirmation; activation itself re-verifies amount, period and quantity (no override of amount or time).
create function public.store_operation_resume(p_operation uuid, p_paid_cents integer, p_reconfirmation_ref text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare o public.store_operations%rowtype;
begin
 select * into o from public.store_operations x where x.id = p_operation for update;
 if not found or o.kind <> 'store_add' then return jsonb_build_object('error', 'unknown_operation'); end if;
 if o.state <> 'attention' then return jsonb_build_object('error', 'not_in_attention', 'state', o.state); end if;
 if p_paid_cents <> o.amount_cents then return jsonb_build_object('error', 'not_paid_in_full'); end if;
 if p_reconfirmation_ref is null or length(btrim(p_reconfirmation_ref)) < 3 then return jsonb_build_object('error', 'reconfirmation_required'); end if;
 if not exists (select 1 from public.npi_reservations r where r.store_operation_id = o.id and r.status = 'op_held') and o.transfer_id is null then
  return jsonb_build_object('error', 'reservation_lost'); end if;
 update public.store_operations x set state = 'paid_pending_activation', last_error_code = null, close_reference = p_reconfirmation_ref where x.id = o.id;
 return jsonb_build_object('outcome', 'resumed');
end $$;

-- removed-store-reactivate (BP-05): authorization only. The paid re-add path and its history behaviour await Director
-- decision 9; until ruled, Add Store refuses a previously registered NPI (quote error npi_previously_registered).
create table public.store_reactivations (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses (id),
 account_id uuid not null references public.accounts (id),
 status text not null default 'authorized' check (status in ('authorized', 'used', 'withdrawn')),
 operator_action_ref text,
 created_at timestamptz not null default now()
);
create unique index store_reactivations_one_open on public.store_reactivations (business_id) where status = 'authorized';
alter table public.store_reactivations enable row level security;
revoke all on public.store_reactivations from public, anon, authenticated;
grant select on public.store_reactivations to service_role;

create function public.store_reactivation_authorize(p_business uuid, p_ref text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare b public.businesses%rowtype;
begin
 select * into b from public.businesses x where x.id = p_business for update;
 if not found then return jsonb_build_object('error', 'unknown_store'); end if;
 if b.status <> 'removed' then return jsonb_build_object('error', case when b.status = 'transferred' then 'transferred_store' else 'not_removed' end); end if;
 if exists (select 1 from public.businesses x where x.pharmacy_id = b.pharmacy_id and x.ownership_ended_at is null) then return jsonb_build_object('error', 'npi_active_elsewhere'); end if;
 insert into public.store_reactivations (business_id, account_id, operator_action_ref) values (b.id, b.account_id, p_ref)
  on conflict do nothing;
 return jsonb_build_object('outcome', 'authorized', 'policy', 'paid re-add pending Director decision 9; no access or quantity granted');
end $$;

do $$
declare f text;
begin
 foreach f in array array['operator_action_record(text,text,text,text,text,jsonb,jsonb,jsonb,text,text)', 'owner_replace(uuid,uuid,text)',
   'store_admin_set(uuid,uuid,text)', 'store_operation_close(uuid,text,integer,integer,integer,text,text)', 'store_operation_resume(uuid,integer,text)',
   'store_reactivation_authorize(uuid,text)', 'operator_actions_append_only()'] loop
  execute format('revoke all on function public.%s from public, anon, authenticated', f);
  execute format('grant execute on function public.%s to service_role', f);
 end loop;
 if has_table_privilege('authenticated', 'public.operator_actions', 'SELECT') then raise exception 'APBM007B/0066 ASSERT: operator audit readable by customers'; end if;
end $$;
