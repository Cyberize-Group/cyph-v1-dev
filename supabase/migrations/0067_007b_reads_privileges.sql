-- APBM-007B 0067: owner read contracts and final privilege/catalogue assertions over every 007B object.

-- A3: the owner's own store operations, safe fields only (no provider capability URL, no intent key, no lease data).
create function public.owner_store_operations() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare acct uuid;
begin
 select a.id into acct from public.accounts a where a.owner_user_id = auth.uid();
 if auth.uid() is null or acct is null then raise exception 'not the owner of an account' using errcode = '42501'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id', o.id, 'kind', o.kind, 'state', o.state, 'store_name', o.store_name,
   'business_id', o.business_id, 'amount_cents', o.amount_cents, 'currency', o.currency, 'payment_deadline', o.payment_deadline,
   'error_code', o.last_error_code, 'created_at', o.created_at) order by o.created_at desc), '[]'::jsonb)
  from (select * from public.store_operations x where x.account_id = acct order by x.created_at desc limit 20) o);
end $$;
revoke all on function public.owner_store_operations() from public, anon;
grant execute on function public.owner_store_operations() to authenticated, service_role;

-- Final assertions over the 007B surface.
do $$
declare bad text;
begin
 -- every new table: RLS on and no customer privilege
 select string_agg(t || ':' || r, ', ') into bad
  from unnest(array['pharmacy_identities','billing_deployment','billing_test_contexts','store_quotes','store_operations','provider_invoice_operations',
    'provider_call_intents','store_transfers','store_invitations','operator_actions','store_reactivations']) t
  cross join unnest(array['anon','authenticated']) r
  where has_table_privilege(r, ('public.' || t)::regclass, 'SELECT') or has_table_privilege(r, ('public.' || t)::regclass, 'INSERT')
     or has_table_privilege(r, ('public.' || t)::regclass, 'UPDATE') or has_table_privilege(r, ('public.' || t)::regclass, 'DELETE')
     or not (select relrowsecurity from pg_class where oid = ('public.' || t)::regclass);
 if bad is not null then raise exception 'APBM007B/0067 ASSERT: %', bad; end if;
 -- every SECURITY DEFINER function in public pins an empty search_path
 select string_agg(p.oid::regprocedure::text, ', ') into bad from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.prosecdef and not coalesce(p.proconfig @> array['search_path=""'], false);
 if bad is not null then raise exception 'APBM007B/0067 ASSERT: definer without empty search_path: %', bad; end if;
 -- nothing new is executable by anon
 select string_agg(p.oid::regprocedure::text, ', ') into bad from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'EXECUTE')
    and p.proname in (select unnest(array['billing_now','store_quote_create','store_operation_claim','store_add_activate','store_lifecycle_request',
      'invitation_create','invitation_accept','member_remove','my_invitations','owner_history_rows','owner_history_stores','owner_store_operations',
      'notice_claim','owner_replace','store_admin_set','store_operation_close','store_transfer_authorize']));
 if bad is not null then raise exception 'APBM007B/0067 ASSERT: executable by anon: %', bad; end if;
 -- the user-callable 007B surface is exactly this set
 select string_agg(p.proname, ', ' order by p.proname) into bad from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and has_function_privilege('authenticated', p.oid, 'EXECUTE')
    and (p.proname like 'store\_%' or p.proname like 'invitation\_%' or p.proname like 'notice%' or p.proname like 'billing\_%' or p.proname like 'owner\_%'
         or p.proname in ('member_remove', 'my_invitations', 'store_invitations_list'))
    and p.proname not in ('store_access_state', 'owner_billing_overview', 'owner_history_stores', 'owner_history_rows', 'owner_store_operations',
      'invitation_create', 'invitation_resend_check', 'invitation_revoke', 'invitation_accept', 'invitation_decline', 'member_remove', 'my_invitations', 'store_invitations_list');
 if bad is not null then raise exception 'APBM007B/0067 ASSERT: unexpected user-callable 007B functions: %', bad; end if;
end $$;
