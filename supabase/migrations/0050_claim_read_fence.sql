-- APBM A01-3: all customer claim access is audited reads; writes deferred.
drop policy "user_data_select_member" on public.user_data;
drop policy "user_data_insert_member" on public.user_data;
drop policy "user_data_update_member" on public.user_data;
drop policy "user_data_delete_admin" on public.user_data;
revoke select,insert,update,delete on public.user_data from public,anon,authenticated;
-- Service-role seeding remains unchanged; four existing definer wrappers survive.
