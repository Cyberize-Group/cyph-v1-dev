-- APBM OD-7: metadata supplies display name only, never privilege.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.user_roles(user_id,role) values(new.id,'member'::public.app_role)
 on conflict(user_id) do nothing;
 insert into public.profiles(id,email,full_name) values(new.id,new.email,new.raw_user_meta_data->>'full_name')
 on conflict(id) do nothing;
 return new;
end;
$$;
revoke all on function public.handle_new_user() from public,anon,authenticated;
