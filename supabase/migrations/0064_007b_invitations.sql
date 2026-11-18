-- APBM-007B 0064: store invitations, atomic admin replacement, member revocation, read-only enforcement with
-- access-reduction exceptions (CONTRACTS/IDENTITY_AND_MEMBERSHIP.md, API_ROLE_MATRIX.md I1–I10).
-- User RPCs re-derive authority from auth.uid(); the server-only dispatch functions are service_role only.

create table public.store_invitations (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses (id),
 account_id uuid not null references public.accounts (id),
 email text not null check (email = lower(btrim(email)) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
 role text not null check (role in ('admin', 'member')),
 inviter_user_id uuid not null,
 incumbent_admin_user_id uuid,
 former_admin_disposition text check (former_admin_disposition is null or former_admin_disposition in ('member', 'remove')),
 status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'revoked', 'expired')),
 status_reason text,
 expires_at timestamptz not null,
 dispatch_attempts integer not null default 0 check (dispatch_attempts between 0 and 5),
 last_sent_at timestamptz,
 accepted_user_id uuid,
 accepted_at timestamptz, declined_at timestamptz, revoked_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (role = 'member' or (incumbent_admin_user_id is not null and former_admin_disposition is not null))
);
create unique index store_invitations_one_pending_email on public.store_invitations (business_id, email) where status = 'pending';
create unique index store_invitations_one_pending_admin on public.store_invitations (business_id) where status = 'pending' and role = 'admin';
alter table public.store_invitations enable row level security;
revoke all on public.store_invitations from public, anon, authenticated;
grant select on public.store_invitations to service_role;
create trigger set_updated_at before update on public.store_invitations for each row execute function public.update_updated_at();
create trigger audit_write after insert or update or delete on public.store_invitations for each row execute function public.audit_write();

-- Account writability for NEW grants and ordinary mutations (read-only and ended deny; grace allows).
create function public.account_grants_refusal(p_account uuid) returns text
language sql stable security definer set search_path = '' as $$
 select case when (public.account_access_state(p_account)->>'state') in ('read_only', 'ended') then 'account_read_only' else null end;
$$;

-- Caller's capability on a live store: 'owner', 'admin', or null.
create function public.store_manager_role(p_business uuid) returns text
language sql stable security definer set search_path = '' as $$
 select case when not public.store_is_live(p_business) or auth.uid() is null then null
             when exists (select 1 from public.businesses b where b.id = p_business and public.is_owner_of_account(b.account_id)) then 'owner'
             when public.is_admin_of(p_business) then 'admin' else null end;
$$;

create function public.current_admin_of(p_business uuid) returns uuid
language sql stable security definer set search_path = '' as $$
 select ub.user_id from public.user_businesses ub where ub.business_id = p_business and ub.role = 'admin';
$$;

-- I1/I2: create. Owner: member or admin (incumbent bound). Store admin: members of its own store only.
create function public.invitation_create(p_business uuid, p_email text, p_role text, p_disposition text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_role text := public.store_manager_role(p_business); b public.businesses%rowtype; v_email text := lower(btrim(coalesce(p_email, '')));
        v_incumbent uuid; v_target uuid; i public.store_invitations%rowtype; v_refusal text;
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
 select u.id into v_target from auth.users u where lower(u.email) = v_email;
 if v_target is not null then
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
 insert into public.store_invitations (business_id, account_id, email, role, inviter_user_id, incumbent_admin_user_id, former_admin_disposition, expires_at)
  values (p_business, b.account_id, v_email, p_role, auth.uid(), v_incumbent, case when p_role = 'admin' then p_disposition end, now() + interval '7 days')
  returning * into i;
 return jsonb_build_object('invitation', jsonb_build_object('id', i.id, 'status', i.status, 'role', i.role, 'email', i.email, 'expires_at', i.expires_at, 'attempts_remaining', 5 - i.dispatch_attempts));
end $$;

-- Authority on an existing invitation: owner of the store's account, or the store admin for MEMBER invitations.
create function public.invitation_manager_ok(p_invitation uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.store_invitations i where i.id = p_invitation
   and (public.store_manager_role(i.business_id) = 'owner' or (public.store_manager_role(i.business_id) = 'admin' and i.role = 'member')));
$$;

-- I3: resend authority check (user). The dispatch itself is claimed by the server-only module below.
create function public.invitation_resend_check(p_invitation uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare i public.store_invitations%rowtype;
begin
 if not public.invitation_manager_ok(p_invitation) then raise exception 'not permitted' using errcode = '42501'; end if;
 select * into i from public.store_invitations x where x.id = p_invitation;
 if i.status <> 'pending' or i.expires_at <= now() then return jsonb_build_object('error', 'not_pending'); end if;
 if public.account_grants_refusal(i.account_id) is not null then raise exception 'account is read-only' using errcode = '42501'; end if;
 return jsonb_build_object('ok', true);
end $$;

-- I4: revoke (access reduction: allowed even when read-only).
create function public.invitation_revoke(p_invitation uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
 if not public.invitation_manager_ok(p_invitation) then raise exception 'not permitted' using errcode = '42501'; end if;
 update public.store_invitations i set status = 'revoked', revoked_at = now(), status_reason = 'revoked_by_manager' where i.id = p_invitation and i.status = 'pending';
 return jsonb_build_object('status', (select i.status from public.store_invitations i where i.id = p_invitation));
end $$;

-- I5: list for managers. Store admins see member invitations only.
create function public.store_invitations_list(p_business uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare v_role text := public.store_manager_role(p_business);
begin
 if v_role is null then raise exception 'not permitted' using errcode = '42501'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id', i.id, 'email', i.email, 'role', i.role,
   'status', case when i.status = 'pending' and i.expires_at <= now() then 'expired' else i.status end,
   'expires_at', i.expires_at, 'attempts_remaining', 5 - i.dispatch_attempts, 'last_sent_at', i.last_sent_at, 'former_admin_disposition', i.former_admin_disposition)
   order by i.created_at desc), '[]'::jsonb)
  from public.store_invitations i where i.business_id = p_business and (v_role = 'owner' or i.role = 'member'));
end $$;

-- Verified email of the caller (Auth-confirmed only).
create function public.caller_verified_email() returns text
language sql stable security definer set search_path = '' as $$
 select lower(u.email) from auth.users u where u.id = auth.uid() and u.email_confirmed_at is not null;
$$;

-- I6: the caller's own pending invitations. Never reveals another recipient's address.
create function public.my_invitations() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare v_email text := public.caller_verified_email();
begin
 if auth.uid() is null then raise exception 'not authenticated' using errcode = '42501'; end if;
 if v_email is null then return '[]'::jsonb; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id', i.id, 'store_name', b.pharmacy_name, 'role', i.role, 'expires_at', i.expires_at) order by i.created_at desc), '[]'::jsonb)
  from public.store_invitations i join public.businesses b on b.id = i.business_id
  where i.email = v_email and i.status = 'pending' and i.expires_at > now() and public.store_is_live(i.business_id));
end $$;

-- I7/I10: accept. Locks the invitation and the store, re-checks everything, then grants exactly the intended role.
create function public.invitation_accept(p_invitation uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare i public.store_invitations%rowtype; v_email text := public.caller_verified_email(); v_uid uuid := auth.uid(); v_admin uuid; v_owner uuid; v_business uuid;
begin
 if v_uid is null then raise exception 'not authenticated' using errcode = '42501'; end if;
 -- Lock order everywhere: store row first, then the invitation (avoids deadlock between concurrent acceptances).
 select x.business_id into v_business from public.store_invitations x where x.id = p_invitation;
 if v_business is null then raise exception 'invitation not found' using errcode = '42704'; end if;
 perform 1 from public.businesses b where b.id = v_business for update;
 select * into i from public.store_invitations x where x.id = p_invitation for update;
 if not found or v_email is null or i.email <> v_email then raise exception 'invitation not found' using errcode = '42704'; end if;
 if i.status <> 'pending' then return jsonb_build_object('error', 'not_pending', 'status', i.status); end if;
 if i.expires_at <= now() then update public.store_invitations x set status = 'expired' where x.id = i.id; return jsonb_build_object('error', 'expired'); end if;
 if not public.store_is_live(i.business_id) then return jsonb_build_object('error', 'store_unavailable'); end if;
 if public.account_grants_refusal(i.account_id) is not null then return jsonb_build_object('error', 'account_read_only'); end if;
 select a.owner_user_id into v_owner from public.accounts a where a.id = i.account_id;
 if i.role = 'member' then
  insert into public.user_businesses (user_id, business_id, role, is_primary) values (v_uid, i.business_id, 'member', false)
   on conflict (user_id, business_id) do nothing;
 else
  v_admin := public.current_admin_of(i.business_id);
  if v_admin is distinct from i.incumbent_admin_user_id then
   update public.store_invitations x set status = 'revoked', revoked_at = now(), status_reason = 'stale_incumbent' where x.id = i.id;
   return jsonb_build_object('error', 'stale_incumbent');
  end if;
  if v_admin <> v_uid then
   if i.former_admin_disposition = 'remove' and v_admin <> v_owner then
    delete from public.user_businesses ub where ub.business_id = i.business_id and ub.user_id = v_admin;
   else
    update public.user_businesses ub set role = 'member' where ub.business_id = i.business_id and ub.user_id = v_admin;
   end if;
  end if;
  insert into public.user_businesses (user_id, business_id, role, is_primary) values (v_uid, i.business_id, 'admin', false)
   on conflict (user_id, business_id) do update set role = 'admin';
 end if;
 if (select count(*) from public.user_businesses ub where ub.business_id = i.business_id and ub.role = 'admin') <> 1 then
  raise exception 'admin invariant violated' using errcode = '55000'; end if;
 update public.store_invitations x set status = 'accepted', accepted_at = now(), accepted_user_id = v_uid where x.id = i.id;
 -- any other pending admin invitation for this store is now stale
 update public.store_invitations x set status = 'revoked', revoked_at = now(), status_reason = 'stale_incumbent'
  where i.role = 'admin' and x.business_id = i.business_id and x.status = 'pending' and x.role = 'admin' and x.id <> i.id;
 return jsonb_build_object('status', 'accepted', 'business_id', i.business_id, 'role', i.role);
end $$;

-- I8: decline by the exact recipient.
create function public.invitation_decline(p_invitation uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_email text := public.caller_verified_email();
begin
 if auth.uid() is null or v_email is null then raise exception 'not authenticated' using errcode = '42501'; end if;
 update public.store_invitations i set status = 'declined', declined_at = now() where i.id = p_invitation and i.email = v_email and i.status = 'pending';
 if not found then raise exception 'invitation not found' using errcode = '42704'; end if;
 return jsonb_build_object('status', 'declined');
end $$;

-- I9: member removal (access reduction; allowed when read-only). Never removes the effective admin; an admin may not
-- remove the account owner's membership.
create function public.member_remove(p_business uuid, p_user uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role text := public.store_manager_role(p_business); r public.user_businesses%rowtype; v_owner uuid;
begin
 if v_role is null then raise exception 'not permitted' using errcode = '42501'; end if;
 perform 1 from public.businesses b where b.id = p_business for update;
 select * into r from public.user_businesses ub where ub.business_id = p_business and ub.user_id = p_user for update;
 if not found then return jsonb_build_object('removed', false); end if;
 if r.role = 'admin' then raise exception 'the effective admin cannot be removed; replace the admin first' using errcode = '55000'; end if;
 select a.owner_user_id into v_owner from public.businesses b join public.accounts a on a.id = b.account_id where b.id = p_business;
 if v_role = 'admin' and p_user = v_owner then raise exception 'not permitted' using errcode = '42501'; end if;
 delete from public.user_businesses ub where ub.id = r.id;
 update public.store_invitations i set status = 'revoked', revoked_at = now(), status_reason = 'member_removed'
  where i.business_id = p_business and i.status = 'pending' and i.email = (select lower(u.email) from auth.users u where u.id = p_user);
 return jsonb_build_object('removed', true);
end $$;

-- Server-only dispatch claim (narrow privileged module): pending, unexpired, at most 5 attempts, 60 s apart.
-- Every claim is an attempt and is recorded before the provider call.
create function public.invitation_dispatch_claim(p_invitation uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare i public.store_invitations%rowtype;
begin
 select * into i from public.store_invitations x where x.id = p_invitation for update;
 if not found then return jsonb_build_object('error', 'unknown'); end if;
 if i.status <> 'pending' then return jsonb_build_object('error', 'not_pending'); end if;
 if i.expires_at <= now() then update public.store_invitations x set status = 'expired' where x.id = i.id; return jsonb_build_object('error', 'expired'); end if;
 if i.dispatch_attempts >= 5 then return jsonb_build_object('error', 'attempts_exhausted'); end if;
 if i.last_sent_at is not null and i.last_sent_at > now() - interval '60 seconds' then return jsonb_build_object('error', 'too_soon'); end if;
 update public.store_invitations x set dispatch_attempts = x.dispatch_attempts + 1, last_sent_at = now() where x.id = i.id;
 return jsonb_build_object('email', i.email, 'attempt', i.dispatch_attempts + 1, 'attempts_remaining', 4 - i.dispatch_attempts, 'expires_at', i.expires_at);
end $$;

-- Grants.
do $$
declare f text;
begin
 foreach f in array array['invitation_create(uuid,text,text,text)', 'invitation_resend_check(uuid)', 'invitation_revoke(uuid)', 'store_invitations_list(uuid)',
   'my_invitations()', 'invitation_accept(uuid)', 'invitation_decline(uuid)', 'member_remove(uuid,uuid)'] loop
  execute format('revoke all on function public.%s from public, anon', f);
  execute format('grant execute on function public.%s to authenticated, service_role', f);
 end loop;
 foreach f in array array['account_grants_refusal(uuid)', 'store_manager_role(uuid)', 'current_admin_of(uuid)', 'invitation_manager_ok(uuid)',
   'caller_verified_email()', 'invitation_dispatch_claim(uuid)'] loop
  execute format('revoke all on function public.%s from public, anon, authenticated', f);
  execute format('grant execute on function public.%s to service_role', f);
 end loop;
end $$;
do $$
begin
 if has_table_privilege('authenticated', 'public.store_invitations', 'SELECT') or has_table_privilege('anon', 'public.store_invitations', 'SELECT')
    or has_table_privilege('authenticated', 'public.user_businesses', 'INSERT') or has_table_privilege('authenticated', 'public.user_businesses', 'UPDATE')
    or has_table_privilege('authenticated', 'public.user_businesses', 'DELETE') then
  raise exception 'APBM007B/0064 ASSERT: direct invitation/membership writes reachable by customers'; end if;
 if has_function_privilege('authenticated', 'public.invitation_dispatch_claim(uuid)', 'EXECUTE') then
  raise exception 'APBM007B/0064 ASSERT: dispatch claim executable by customers'; end if;
end $$;
