-- APBM A01: owner reach is separate from platform roles. Owner FK stays NO ACTION.
create function public.is_owner_of_account(acct uuid)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.accounts a where a.id=acct and a.owner_user_id=auth.uid());
$$;
revoke all on function public.is_owner_of_account(uuid) from public,anon;
grant execute on function public.is_owner_of_account(uuid) to authenticated;
create or replace function public.my_business_ids()
returns setof uuid language sql stable security definer set search_path = '' as $$
 select ub.business_id from public.user_businesses ub where ub.user_id=auth.uid()
 union
 select b.id from public.businesses b where public.is_owner_of_account(b.account_id);
$$;
revoke all on function public.my_business_ids() from public,anon;
grant execute on function public.my_business_ids() to authenticated;
drop policy "account_select_member" on public.accounts;
create policy "account_select_member_or_owner" on public.accounts for select to authenticated
 using (public.is_account_member(id) or public.is_owner_of_account(id));
drop policy "business_select_member" on public.businesses;
create policy "business_select_member_or_owner" on public.businesses for select to authenticated
 using (id in (select public.my_business_ids()));
drop policy "ub_select_self" on public.user_businesses;
create policy "user_business_select_self_or_owner" on public.user_businesses for select to authenticated
 using (user_id=auth.uid() or exists(select 1 from public.businesses b where b.id=business_id and public.is_owner_of_account(b.account_id)));
drop policy "subscription_select_account_member" on public.subscriptions;
create policy "subscription_select_member_or_owner" on public.subscriptions for select to authenticated
 using (public.is_account_member(account_id) or public.is_owner_of_account(account_id));
revoke insert,update,delete on public.accounts,public.subscriptions from authenticated,anon;
create unique index user_businesses_one_admin on public.user_businesses(business_id) where role='admin';
