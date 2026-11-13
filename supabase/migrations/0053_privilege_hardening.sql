-- APBM007A 0053: privilege hardening (RA-3, F-D1..F-D3). Intentional reductions; no data change.
-- Store rows stop being customer-editable; residual table privileges and anon grants on tenant tables go.
do $$
begin
 if not exists (select 1 from pg_policies where schemaname='public' and tablename='businesses' and policyname='business_update_admin') then
  raise exception 'APBM007A/0053 ASSERT: policy business_update_admin not found; chain is not at the expected state'; end if;
end $$;

drop policy "business_update_admin" on public.businesses;
revoke insert,update,delete on public.businesses from anon,authenticated;

-- TRUNCATE is not governed by RLS; REFERENCES and TRIGGER are never needed by customers.
do $$
declare t record;
begin
 for t in select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
          where n.nspname='public' and c.relkind in ('r','p') order by c.relname loop
  execute format('revoke truncate,references,trigger on public.%I from anon,authenticated', t.relname);
 end loop;
end $$;

-- anon has no use on tenant tables: every policy is "to authenticated".
revoke all on public.accounts,public.businesses,public.user_businesses,public.subscriptions,public.user_data,
 public.report_files,public.audit_logs,public.pending_registrations,public.apa_memberships from anon;

-- No policy permits these writes; remove the table privilege as well.
revoke insert,update,delete on public.user_businesses,public.user_roles,public.pending_registrations,
 public.apa_memberships,public.report_files from authenticated;
revoke insert,delete on public.profiles from authenticated;   -- the owner-or-superadmin UPDATE policy stays

-- Trigger functions are not meant to be called directly.
revoke all on function public.rls_auto_enable(),public.update_updated_at(),public.audit_logs_immutable()
 from public,anon,authenticated;

-- Catalogue assertion: fail the migration if any reduction did not take effect.
do $$
declare bad text;
begin
 select string_agg(c.relname||':'||r.rolname||':'||p.priv, ', ') into bad
 from pg_class c join pg_namespace n on n.oid=c.relnamespace
 cross join (select rolname from pg_roles where rolname in ('anon','authenticated')) r
 cross join (values ('TRUNCATE'),('REFERENCES'),('TRIGGER')) p(priv)
 where n.nspname='public' and c.relkind in ('r','p') and has_table_privilege(r.rolname, c.oid, p.priv);
 if bad is not null then raise exception 'APBM007A/0053 ASSERT: residual privileges remain: %', bad; end if;

 select string_agg(t||':'||p, ', ') into bad
 from unnest(array['accounts','businesses','user_businesses','subscriptions','user_data','report_files','audit_logs','pending_registrations','apa_memberships']) t
 cross join unnest(array['SELECT','INSERT','UPDATE','DELETE']) p
 where has_table_privilege('anon', ('public.'||t)::regclass, p);
 if bad is not null then raise exception 'APBM007A/0053 ASSERT: anon still holds tenant-table privileges: %', bad; end if;

 if has_table_privilege('authenticated','public.businesses','INSERT') or has_table_privilege('authenticated','public.businesses','UPDATE')
    or has_table_privilege('authenticated','public.businesses','DELETE') then
  raise exception 'APBM007A/0053 ASSERT: authenticated can still write businesses'; end if;
 if not has_table_privilege('authenticated','public.businesses','SELECT') then
  raise exception 'APBM007A/0053 ASSERT: authenticated lost the businesses read it must keep'; end if;
 if has_function_privilege('authenticated','public.update_updated_at()','EXECUTE') or has_function_privilege('anon','public.rls_auto_enable()','EXECUTE')
    or has_function_privilege('authenticated','public.audit_logs_immutable()','EXECUTE') then
  raise exception 'APBM007A/0053 ASSERT: a trigger function is still directly executable by customers'; end if;
end $$;
