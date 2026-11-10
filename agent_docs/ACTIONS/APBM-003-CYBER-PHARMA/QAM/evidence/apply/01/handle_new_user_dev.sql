CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 insert into public.user_roles(user_id,role) values(new.id,'member'::public.app_role)
 on conflict(user_id) do nothing;
 insert into public.profiles(id,email,full_name) values(new.id,new.email,new.raw_user_meta_data->>'full_name')
 on conflict(id) do nothing;
 return new;
end;
$function$

