-- APBM-007B manual QA repair round (Director walkthrough, 19 Nov 2026; approved 20 Nov 2026). Forward-only, additive in
-- behaviour, no data change. Replaces four existing functions and adds one read:
--   R5 owner model  — admin_members marks the account owner (and lists the owner even without a membership row);
--                     invitation_create refuses "remove" when the incumbent admin is the owner; member_remove refuses the
--                     owner's membership for EVERY caller (owner authority is accounts.owner_user_id and is never reduced).
--   R6 settings     — store_profile(p_business): the stored pharmacy details for an owner/admin of a live store (audited read).
--   R8 audit        — admin_audit gains p_include_reads (default false) and returns per-row actor and a whitelisted detail
--                     (status/role/date transitions only, never whole rows). Scoping and paging are unchanged.
-- Unchanged: invitation_accept (an owner-incumbent row is demoted to 'member' — never deleted — and the owner keeps full
-- authority through accounts.owner_user_id; Director 20 Nov 2026 accepted this ONLY with ownership authoritative), grants
-- model, search_path, the single-admin index, all tables.

-- R5: members list with the owner marked. The owner's own row may be 'admin' (default) or 'member' (after delegation).
create or replace function public.admin_members(p_business_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb; v_owner uuid;
begin
 if p_business_id is null or not exists (select 1 from public.businesses b where b.id = p_business_id and public.store_is_live(b.id)
   and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) then
  raise exception 'not an administrator of business' using errcode = '42501'; end if;
 select a.owner_user_id into v_owner from public.businesses b join public.accounts a on a.id = b.account_id where b.id = p_business_id;
 select coalesce(jsonb_agg(m order by (m->>'is_owner')::boolean desc, m->>'id'), '[]'::jsonb) into result from (
  select jsonb_build_object('id', ub.user_id, 'business_id', ub.business_id, 'name', p.full_name, 'email', p.email, 'role', ub.role,
    'is_owner', ub.user_id = v_owner, 'has_membership', true) m
   from public.user_businesses ub left join public.profiles p on p.id = ub.user_id where ub.business_id = p_business_id
  union all
  select jsonb_build_object('id', v_owner, 'business_id', p_business_id, 'name', p.full_name, 'email', p.email, 'role', 'member',
    'is_owner', true, 'has_membership', false)
   from public.profiles p where p.id = v_owner
    and not exists (select 1 from public.user_businesses ub where ub.business_id = p_business_id and ub.user_id = v_owner)) t;
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business_id, 'user_businesses', 'read_page', jsonb_build_object('fn', 'admin_members'));
 return result;
end $$;

-- R5: same as 0064 plus one refusal — an admin invitation may not ask to REMOVE the owner when the owner is the incumbent.
create or replace function public.invitation_create(p_business uuid, p_email text, p_role text, p_disposition text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_role text := public.store_manager_role(p_business); b public.businesses%rowtype; v_email text := lower(btrim(coalesce(p_email, '')));
        v_incumbent uuid; v_target uuid; i public.store_invitations%rowtype; v_refusal text; v_owner uuid;
begin
 if v_role is null then raise exception 'not permitted' using errcode = '42501'; end if;
 if p_role not in ('admin', 'member') then raise exception 'invalid role' using errcode = '22023'; end if;
 if p_role = 'admin' and v_role <> 'owner' then raise exception 'only the owner may appoint an admin' using errcode = '42501'; end if;
 if p_role = 'admin' and coalesce(p_disposition, '') not in ('member', 'remove') then raise exception 'former admin disposition required' using errcode = '22023'; end if;
 if p_role = 'member' and p_disposition is not null then raise exception 'disposition applies to admin invitations only' using errcode = '22023'; end if;
 if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 254 then raise exception 'invalid email' using errcode = '22023'; end if;
 select * into b from public.businesses x where x.id = p_business for update;
 v_refusal := public.account_grants_refusal(b.account_id);
 if v_refusal is not null then raise exception 'account is read-only' using errcode = '42501'; end if;
 select a.owner_user_id into v_owner from public.accounts a where a.id = b.account_id;
 select u.id into v_target from auth.users u where lower(u.email) = v_email;
 if v_target is not null then
  if v_target = v_owner and p_role = 'member' then return jsonb_build_object('error', 'owner_already_manages'); end if;
  if p_role = 'member' and exists (select 1 from public.user_businesses ub where ub.business_id = p_business and ub.user_id = v_target) then
   return jsonb_build_object('error', 'already_member'); end if;
  if p_role = 'admin' and public.current_admin_of(p_business) = v_target then return jsonb_build_object('error', 'already_admin'); end if;
 end if;
 if exists (select 1 from public.store_invitations x where x.business_id = p_business and x.status = 'pending' and x.expires_at <= now()) then
  update public.store_invitations x set status = 'expired' where x.business_id = p_business and x.status = 'pending' and x.expires_at <= now();
 end if;
 if exists (select 1 from public.store_invitations x where x.business_id = p_business and x.email = v_email and x.status = 'pending') then
  return jsonb_build_object('error', 'invitation_pending'); end if;
 if p_role = 'admin' and exists (select 1 from public.store_invitations x where x.business_id = p_business and x.role = 'admin' and x.status = 'pending') then
  return jsonb_build_object('error', 'admin_invitation_pending'); end if;
 v_incumbent := case when p_role = 'admin' then public.current_admin_of(p_business) else null end;
 if p_role = 'admin' and v_incumbent is null then raise exception 'store has no effective admin; use support recovery' using errcode = '55000'; end if;
 if p_role = 'admin' and v_incumbent = v_owner and p_disposition = 'remove' then
  raise exception 'the account owner cannot be removed from a store' using errcode = '22023', hint = 'owner_protected'; end if;
 insert into public.store_invitations (business_id, account_id, email, role, inviter_user_id, incumbent_admin_user_id, former_admin_disposition, expires_at)
  values (p_business, b.account_id, v_email, p_role, auth.uid(), v_incumbent, case when p_role = 'admin' then p_disposition end, now() + interval '7 days')
  returning * into i;
 return jsonb_build_object('invitation', jsonb_build_object('id', i.id, 'status', i.status, 'role', i.role, 'email', i.email, 'expires_at', i.expires_at, 'attempts_remaining', 5 - i.dispatch_attempts));
end $$;

-- R5: member removal never removes the account owner's membership, whoever asks (0064 refused only a store-admin caller).
create or replace function public.member_remove(p_business uuid, p_user uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role text := public.store_manager_role(p_business); r public.user_businesses%rowtype; v_owner uuid;
begin
 if v_role is null then raise exception 'not permitted' using errcode = '42501'; end if;
 perform 1 from public.businesses b where b.id = p_business for update;
 select * into r from public.user_businesses ub where ub.business_id = p_business and ub.user_id = p_user for update;
 if not found then return jsonb_build_object('removed', false); end if;
 select a.owner_user_id into v_owner from public.businesses b join public.accounts a on a.id = b.account_id where b.id = p_business;
 if p_user = v_owner then raise exception 'the account owner cannot be removed from a store' using errcode = '42501', hint = 'owner_protected'; end if;
 if r.role = 'admin' then raise exception 'the effective admin cannot be removed; replace the admin first' using errcode = '55000'; end if;
 delete from public.user_businesses ub where ub.id = r.id;
 update public.store_invitations i set status = 'revoked', revoked_at = now(), status_reason = 'member_removed'
  where i.business_id = p_business and i.status = 'pending' and i.email = (select lower(u.email) from auth.users u where u.id = p_user);
 return jsonb_build_object('removed', true);
end $$;

-- R6: stored pharmacy details for the owner or the store admin of a live store. Read-only; audited like the other reads.
create function public.store_profile(p_business uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
 if auth.uid() is null or p_business is null or public.store_manager_role(p_business) is null then
  raise exception 'not an administrator of business' using errcode = '42501'; end if;
 select jsonb_build_object('id', b.id, 'name', b.pharmacy_name, 'npi', b.npi, 'ncpdp', b.ncpdp, 'address', b.address, 'address_line2', b.address_line2,
   'city', b.city, 'state', b.state, 'zip', b.zip, 'phone', b.phone, 'pharmacy_software_system', b.pharmacy_software_system, 'status', b.status,
   'removal_effective_at', b.removal_effective_at)
  into result from public.businesses b where b.id = p_business;
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business, 'businesses', 'read_page', jsonb_build_object('fn', 'store_profile'));
 return result;
end $$;

-- R8: readable audit. The detail is built from a fixed whitelist of fields per table; whole rows are never returned.
create function public.audit_detail(p_table text, p_action text, p_old jsonb, p_new jsonb) returns jsonb
language sql immutable set search_path = '' as $$
 select case p_table
  when 'store_invitations' then jsonb_strip_nulls(jsonb_build_object('email', coalesce(p_new->>'email', p_old->>'email'), 'role', coalesce(p_new->>'role', p_old->>'role'),
    'status_from', p_old->>'status', 'status_to', p_new->>'status', 'reason', p_new->>'status_reason',
    'sent', case when p_action = 'update' and (p_new->>'dispatch_attempts') is distinct from (p_old->>'dispatch_attempts') then true end))
  when 'user_businesses' then jsonb_strip_nulls(jsonb_build_object('user_id', coalesce(p_new->>'user_id', p_old->>'user_id'), 'role_from', p_old->>'role', 'role_to', p_new->>'role'))
  when 'businesses' then jsonb_strip_nulls(jsonb_build_object('store', coalesce(p_new->>'pharmacy_name', p_old->>'pharmacy_name'),
    'status_from', p_old->>'status', 'status_to', p_new->>'status',
    'removal_from', p_old->>'removal_effective_at', 'removal_to', p_new->>'removal_effective_at',
    'removal_changed', case when p_action = 'update' and (p_new->>'removal_effective_at') is distinct from (p_old->>'removal_effective_at') then true end))
  when 'subscriptions' then jsonb_strip_nulls(jsonb_build_object('status_from', p_old->>'status', 'status_to', p_new->>'status',
    'cancel_from', p_old->>'cancel_at_period_end', 'cancel_to', p_new->>'cancel_at_period_end',
    'quantity_from', p_old->>'quantity', 'quantity_to', p_new->>'quantity'))
  when 'store_operations' then jsonb_strip_nulls(jsonb_build_object('kind', coalesce(p_new->>'kind', p_old->>'kind'), 'store', coalesce(p_new->>'store_name', p_old->>'store_name'),
    'state_from', p_old->>'state', 'state_to', p_new->>'state'))
  else '{}'::jsonb end;
$$;

drop function public.admin_audit(uuid, integer, bigint);
create function public.admin_audit(p_business_id uuid, p_limit integer default 50, p_before bigint default null, p_include_reads boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare acct uuid; owner_access boolean; snapshot_id bigint; result jsonb;
begin
 select b.account_id, public.is_owner_of_account(b.account_id) into acct, owner_access from public.businesses b
  where b.id = p_business_id and public.store_is_live(b.id) and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id));
 if acct is null then raise exception 'not an administrator of business' using errcode = '42501'; end if;
 if p_limit is null or p_limit < 1 or p_limit > 100 then raise exception 'invalid limit' using errcode = '22023'; end if;
 select coalesce(max(a.id), 0) into snapshot_id from public.audit_logs a;
 select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'occurred_at', s.occurred_at, 'actor_user_id', s.actor_user_id, 'business_id', s.business_id,
   'table_name', s.table_name, 'row_id', s.row_id, 'action', s.action, 'context', s.context,
   'actor', case when s.actor_user_id is null then null else jsonb_build_object('name', ap.full_name, 'email', ap.email) end,
   'actor_kind', case when s.actor_user_id is not null then 'person' when s.actor_role = 'service_role' then 'system' else 'unknown' end,
   'detail', s.detail
     || case when s.detail ? 'user_id' then jsonb_strip_nulls(jsonb_build_object('person_name', mp.full_name, 'person_email', mp.email)) else '{}'::jsonb end
  ) order by s.id desc), '[]'::jsonb) into result
 from (
  select a.id, a.occurred_at, a.actor_user_id, a.actor_role, a.business_id, a.table_name, a.row_id, a.action, a.context,
         public.audit_detail(a.table_name, a.action, a.old_data, a.new_data) detail
  from public.audit_logs a where a.id <= snapshot_id and (p_before is null or a.id < p_before)
   and (p_include_reads or a.action <> 'read_page')
   and ((not owner_access and a.business_id = p_business_id) or (owner_access and (
    a.business_id in (select b.id from public.businesses b where b.account_id = acct and public.store_is_live(b.id))
    or (a.business_id is null and a.table_name = 'accounts' and a.row_id = acct::text)
    or (a.business_id is null and a.table_name = 'subscriptions' and (a.new_data->>'account_id' = acct::text or a.old_data->>'account_id' = acct::text)))))
  order by a.id desc limit p_limit) s
 left join public.profiles ap on ap.id = s.actor_user_id
 left join public.profiles mp on mp.id = (case when s.detail->>'user_id' ~ '^[0-9a-f-]{36}$' then (s.detail->>'user_id')::uuid end);
 insert into public.audit_logs (actor_user_id, actor_role, business_id, table_name, action, context)
 values (auth.uid(), 'authenticated', p_business_id, 'audit_logs', 'read_page', jsonb_build_object('fn', 'admin_audit', 'account_id', acct, 'snapshot_id', snapshot_id));
 return jsonb_build_object('rows', result, 'snapshot_id', snapshot_id);
end $$;

-- Grants: the same model as 0051/0064 (customer RPCs to authenticated; helper not executable by customers).
revoke all on function public.admin_audit(uuid, integer, bigint, boolean) from public, anon;
grant execute on function public.admin_audit(uuid, integer, bigint, boolean) to authenticated;
revoke all on function public.store_profile(uuid) from public, anon;
grant execute on function public.store_profile(uuid) to authenticated, service_role;
revoke all on function public.audit_detail(text, text, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.audit_detail(text, text, jsonb, jsonb) to service_role;

-- Assertions over what this migration touches.
do $$
begin
 if has_function_privilege('anon', 'public.admin_audit(uuid,integer,bigint,boolean)', 'EXECUTE')
    or has_function_privilege('anon', 'public.store_profile(uuid)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.audit_detail(text,text,jsonb,jsonb)', 'EXECUTE') then
  raise exception 'APBM007B/0071 ASSERT: privilege leak'; end if;
 if to_regprocedure('public.admin_audit(uuid,integer,bigint)') is not null then raise exception 'APBM007B/0071 ASSERT: old admin_audit overload remains'; end if;
 if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'
    and p.proname in ('admin_members', 'invitation_create', 'member_remove', 'store_profile', 'admin_audit', 'audit_detail')
    and not coalesce(p.proconfig @> array['search_path=""'], false)) then
  raise exception 'APBM007B/0071 ASSERT: search_path not pinned'; end if;
end $$;
