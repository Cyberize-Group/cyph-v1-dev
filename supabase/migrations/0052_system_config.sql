-- APBM A01-6: dated shared non-PHI configuration, trusted-server writes only.
create table public.system_config (
 id uuid primary key default gen_random_uuid(),
 key text not null check(key in ('dispensing_fee','brand_multiplier')),
 state text not null check(state ~ '^[A-Z]{2}$'),
 value numeric not null check(value>=0),
 effective_date date not null,
 created_at timestamptz not null default now(),
 unique(key,state,effective_date)
);
alter table public.system_config enable row level security;
revoke all on public.system_config from public,anon,authenticated;
grant select on public.system_config to authenticated;
grant all on public.system_config to service_role;
create policy "config_select_scoped_state" on public.system_config for select to authenticated
 using(exists(select 1 from public.businesses b where b.id in(select public.my_business_ids()) and b.state=system_config.state));
create trigger audit_stamp after insert or update or delete on public.system_config
 for each row execute function public.audit_write();
