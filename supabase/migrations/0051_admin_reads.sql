-- APBM A01: server-derived capabilities; no platform-role shortcuts.
create function public.tenant_stores()
returns table(id uuid,account_id uuid,name text,capability text)
language sql stable security definer set search_path='' as $$
 select b.id,b.account_id,b.pharmacy_name,
 case when public.is_owner_of_account(b.account_id) then 'owner'
      when public.is_admin_of(b.id) then 'admin' else 'member' end
 from public.businesses b where b.id in(select public.my_business_ids()) order by b.pharmacy_name,b.id;
$$;

create function public.admin_stores(p_business_id uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.businesses b where
 (p_business_id is null or b.id=p_business_id) and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) then
 raise exception 'not an administrator of business' using errcode='42501'; end if;
 select coalesce(jsonb_agg(row_data order by row_data->>'name'),'[]'::jsonb) into result from (
 select jsonb_build_object('id',b.id,'account_id',b.account_id,'name',b.pharmacy_name,'ncpdp',b.ncpdp,'npi',b.npi,'status',b.status,
 'member_count',(select count(*) from public.user_businesses ub where ub.business_id=b.id),
 'subscription_status',(select s.status from public.subscriptions s where s.account_id=b.account_id order by s.created_at desc,s.id limit 1)) row_data
 from public.businesses b where (p_business_id is null or b.id=p_business_id)
 and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) scoped;
 insert into public.audit_logs(actor_user_id,actor_role,business_id,table_name,action,context)
 values(auth.uid(),'authenticated',p_business_id,'businesses','read_page',jsonb_build_object('fn','admin_stores'));
 return result;
end;
$$;

create function public.admin_members(p_business_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if p_business_id is null or not exists(select 1 from public.businesses b where b.id=p_business_id
 and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id))) then
 raise exception 'not an administrator of business' using errcode='42501'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',ub.user_id,'business_id',ub.business_id,'name',p.full_name,'email',p.email,'role',ub.role) order by ub.user_id),'[]'::jsonb)
 into result from public.user_businesses ub left join public.profiles p on p.id=ub.user_id where ub.business_id=p_business_id;
 insert into public.audit_logs(actor_user_id,actor_role,business_id,table_name,action,context)
 values(auth.uid(),'authenticated',p_business_id,'user_businesses','read_page',jsonb_build_object('fn','admin_members'));
 return result;
end;
$$;

create function public.admin_billing_status(p_business_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare acct uuid; result jsonb;
begin
 select b.account_id into acct from public.businesses b where b.id=p_business_id
 and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id));
 if acct is null then raise exception 'not an administrator of business' using errcode='42501'; end if;
 select jsonb_build_object('account_id',acct,'subscriptions',coalesce(jsonb_agg(jsonb_build_object('id',s.id,'status',s.status,
 'trial_end_date',s.trial_end_date,'current_period_end',s.current_period_end,'cancel_at_period_end',s.cancel_at_period_end) order by s.created_at,s.id),'[]'::jsonb))
 into result from public.subscriptions s where s.account_id=acct;
 insert into public.audit_logs(actor_user_id,actor_role,business_id,table_name,action,context)
 values(auth.uid(),'authenticated',p_business_id,'subscriptions','read_page',jsonb_build_object('fn','admin_billing_status','account_id',acct));
 return result;
end;
$$;

create function public.admin_audit(p_business_id uuid,p_limit integer default 50,p_before bigint default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare acct uuid; owner_access boolean; snapshot_id bigint; result jsonb;
begin
 select b.account_id,public.is_owner_of_account(b.account_id) into acct,owner_access from public.businesses b
 where b.id=p_business_id and (public.is_owner_of_account(b.account_id) or public.is_admin_of(b.id));
 if acct is null then raise exception 'not an administrator of business' using errcode='42501'; end if;
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid limit' using errcode='22023'; end if;
 select coalesce(max(a.id),0) into snapshot_id from public.audit_logs a;
 select coalesce(jsonb_agg(to_jsonb(scoped) order by scoped.id desc),'[]'::jsonb) into result from (
 select a.id,a.occurred_at,a.actor_user_id,a.business_id,a.table_name,a.row_id,a.action,a.context
 from public.audit_logs a where a.id<=snapshot_id and (p_before is null or a.id<p_before)
 and ((not owner_access and a.business_id=p_business_id) or (owner_access and (
 a.business_id in(select b.id from public.businesses b where b.account_id=acct)
 or (a.business_id is null and a.table_name='accounts' and a.row_id=acct::text)
 or (a.business_id is null and a.table_name='subscriptions' and
 (a.new_data->>'account_id'=acct::text or a.old_data->>'account_id'=acct::text)))))
 order by a.id desc limit p_limit) scoped;
 insert into public.audit_logs(actor_user_id,actor_role,business_id,table_name,action,context)
 values(auth.uid(),'authenticated',p_business_id,'audit_logs','read_page',jsonb_build_object('fn','admin_audit','account_id',acct,'snapshot_id',snapshot_id));
 return jsonb_build_object('rows',result,'snapshot_id',snapshot_id);
end;
$$;
-- Audit viewer must itself be audited; direct SELECT would bypass that requirement.
drop policy "audit_logs_select_admin" on public.audit_logs;
revoke select on public.audit_logs from public,anon,authenticated;
revoke all on function public.tenant_stores(), public.admin_stores(uuid),public.admin_members(uuid),public.admin_billing_status(uuid),public.admin_audit(uuid,integer,bigint) from public,anon;
grant execute on function public.tenant_stores(), public.admin_stores(uuid),public.admin_members(uuid),public.admin_billing_status(uuid),public.admin_audit(uuid,integer,bigint) to authenticated;
