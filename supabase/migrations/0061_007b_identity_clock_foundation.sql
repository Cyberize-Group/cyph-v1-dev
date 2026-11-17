-- APBM-007B 0061: permanent pharmacy identity, ownership lifecycle columns, guarded billing clock (CONTRACTS/
-- LIFECYCLE_AND_TRANSFER.md "Permanent identity", CLOCK_AND_NOTICES.md "O-1 with production-excluded time seam").
-- Existing businesses rows become ownership records; their ids and every claim/file/audit link stay unchanged.

-- 1. Preconditions: report incompatible data, never delete or normalize it.
do $$
declare dup int; nul int; clash int;
begin
 select count(*) into dup from (select npi from public.businesses group by npi having count(*) > 1) d;
 select count(*) into nul from public.businesses where npi is null;
 if dup > 0 or nul > 0 then
  raise exception 'APBM007B/0061 ASSERT: % duplicate and % null NPI values in businesses; no backfill performed', dup, nul; end if;
 if to_regclass('public.pharmacy_identities') is not null then
  raise exception 'APBM007B/0061 ASSERT: pharmacy_identities already exists'; end if;
end $$;

-- 2. Canonical pharmacy identity. For existing stores the canonical id IS the existing businesses.id.
create table public.pharmacy_identities (
 id uuid primary key default gen_random_uuid(),
 npi text not null unique,
 created_at timestamptz not null default now()
);
alter table public.pharmacy_identities enable row level security;
revoke all on public.pharmacy_identities from public, anon, authenticated;
grant select on public.pharmacy_identities to service_role;   -- written only by definer functions below and in 0062/0063

insert into public.pharmacy_identities (id, npi, created_at)
 select b.id, b.npi, b.created_at from public.businesses b;

-- 3. Ownership lifecycle on businesses (ownership-scoped records).
alter table public.businesses
 add column pharmacy_id uuid references public.pharmacy_identities (id),
 add column ownership_started_at timestamptz,
 add column ownership_ended_at timestamptz,
 add column removal_requested_at timestamptz,
 add column removal_effective_at timestamptz,
 add column removed_at timestamptz,
 add column transferred_at timestamptz,
 add column reactivated_at timestamptz;

update public.businesses b set pharmacy_id = b.id, ownership_started_at = coalesce(b.date_of_registration, b.created_at)
 where b.pharmacy_id is null;
alter table public.businesses alter column pharmacy_id set not null, alter column ownership_started_at set not null,
 alter column ownership_started_at set default now();
create index businesses_pharmacy_id on public.businesses (pharmacy_id);

-- Lifecycle status vocabulary: 'removed' and 'transferred' are terminal ownership states.
alter table public.businesses drop constraint businesses_status_check;
alter table public.businesses add constraint businesses_status_check
 check (status in ('pending', 'active', 'suspended', 'removed', 'transferred'));
alter table public.businesses add constraint businesses_ended_consistent
 check ((status in ('removed', 'transferred')) = (ownership_ended_at is not null));
alter table public.businesses add constraint businesses_removal_dates
 check (removal_effective_at is null or removal_requested_at is not null);

-- 4. Deployment identity and the test-clock context. Service-only, separate from user tables.
create table public.billing_deployment (
 singleton boolean primary key default true check (singleton),
 project_ref text not null check (project_ref ~ '^[a-z0-9]{20}$'),
 bound_at timestamptz not null default now()
);
alter table public.billing_deployment enable row level security;
revoke all on public.billing_deployment from public, anon, authenticated, service_role;
grant select on public.billing_deployment to service_role;

create table public.billing_test_contexts (
 account_id uuid primary key references public.accounts (id),
 run_label text not null check (run_label ~ '^[A-Za-z0-9][A-Za-z0-9_-]{2,60}$'),
 stripe_test_clock_id text not null check (stripe_test_clock_id ~ '^clock_[A-Za-z0-9]+$'),
 frozen_at timestamptz not null,
 enabled boolean not null default true,
 enabled_at timestamptz not null default now(),
 synced_at timestamptz not null default now(),
 disabled_at timestamptz
);
alter table public.billing_test_contexts enable row level security;
revoke all on public.billing_test_contexts from public, anon, authenticated, service_role;
grant select on public.billing_test_contexts to service_role;

-- The only project where simulated time may ever be honoured (SCRATCH). DEV/staging/production never match.
create function public.billing_test_project_ref() returns text language sql immutable set search_path = '' as $$ select 'ihgcsrypblqkwommrkgj'::text $$;
revoke all on function public.billing_test_project_ref() from public, anon, authenticated;

-- Bind the deployment identity once. The runner that calls it has verified the target by API and SQL reference.
-- A bound identity can never change, so a later call cannot turn DEV into a test-capable project.
create function public.billing_deployment_bind(p_project_ref text) returns text
language plpgsql security definer set search_path = '' as $$
declare cur text;
begin
 select d.project_ref into cur from public.billing_deployment d for update;
 if cur is null then insert into public.billing_deployment (project_ref) values (p_project_ref); return 'bound'; end if;
 if cur = p_project_ref then return 'already_bound'; end if;
 raise exception 'deployment identity is immutable' using errcode = '42501';
end $$;

-- Guarded account time. Simulated time only when the deployment is SCRATCH AND this account has an enabled context.
-- Disabling the context (or any other deployment) returns real now() even if old frozen values remain.
create function public.billing_now(p_account uuid) returns timestamptz
language sql stable security definer set search_path = '' as $$
 select coalesce((
   select c.frozen_at from public.billing_test_contexts c
    where c.account_id = p_account and c.enabled
      and exists (select 1 from public.billing_deployment d where d.project_ref = public.billing_test_project_ref())), now());
$$;

create function public.billing_test_context_enable(p_account uuid, p_run text, p_clock text, p_frozen timestamptz) returns text
language plpgsql security definer set search_path = '' as $$
begin
 if not exists (select 1 from public.billing_deployment d where d.project_ref = public.billing_test_project_ref()) then
  raise exception 'test clock context is refused on this deployment' using errcode = '42501'; end if;
 insert into public.billing_test_contexts (account_id, run_label, stripe_test_clock_id, frozen_at)
  values (p_account, p_run, p_clock, p_frozen)
  on conflict (account_id) do update set run_label = excluded.run_label, stripe_test_clock_id = excluded.stripe_test_clock_id,
   frozen_at = excluded.frozen_at, enabled = true, enabled_at = now(), synced_at = now(), disabled_at = null;
 return 'enabled';
end $$;

-- Sync mirrors the provider clock's authoritative frozen time; it can only move forward.
create function public.billing_test_context_sync(p_account uuid, p_clock text, p_frozen timestamptz) returns text
language plpgsql security definer set search_path = '' as $$
begin
 if not exists (select 1 from public.billing_deployment d where d.project_ref = public.billing_test_project_ref()) then
  raise exception 'test clock context is refused on this deployment' using errcode = '42501'; end if;
 update public.billing_test_contexts c set frozen_at = p_frozen, synced_at = now()
  where c.account_id = p_account and c.enabled and c.stripe_test_clock_id = p_clock and c.frozen_at <= p_frozen;
 if found then return 'synced'; end if;
 return 'refused';
end $$;

create function public.billing_test_context_disable(p_account uuid) returns text
language plpgsql security definer set search_path = '' as $$
begin
 update public.billing_test_contexts c set enabled = false, disabled_at = now() where c.account_id = p_account and c.enabled;
 if found then return 'disabled'; end if;
 return 'not_enabled';
end $$;

revoke all on function public.billing_deployment_bind(text), public.billing_now(uuid),
 public.billing_test_context_enable(uuid, text, text, timestamptz), public.billing_test_context_sync(uuid, text, timestamptz),
 public.billing_test_context_disable(uuid) from public, anon, authenticated;
grant execute on function public.billing_deployment_bind(text), public.billing_now(uuid),
 public.billing_test_context_enable(uuid, text, text, timestamptz), public.billing_test_context_sync(uuid, text, timestamptz),
 public.billing_test_context_disable(uuid) to service_role;

-- 5. Access state uses the account's guarded time (unchanged policy access-v1 otherwise).
create or replace function public.account_access_state(p_account uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare s public.subscriptions%rowtype; v_state text; v_grace_ends timestamptz; v_now timestamptz := public.billing_now(p_account);
begin
 select * into s from public.subscriptions x where x.account_id = p_account
  order by (x.status is distinct from 'canceled') desc, x.created_at desc, x.id limit 1;
 if not found then
  return jsonb_build_object('state','none','read_only',false,'origin',null,'policy_version','access-v1');
 end if;
 if s.origin = 'synthetic_seed' then
  v_state := case when s.status in ('active','trialing') then 'active'
                  when s.status = 'past_due' then 'past_due_reminder'
                  when s.status = 'canceled' then 'ended' else 'none' end;
 elsif s.status = 'canceled' then v_state := 'ended';
 elsif s.status = 'incomplete' then v_state := 'none';
 elsif s.grace_started_at is not null then
  v_grace_ends := s.grace_started_at + interval '7 days';
  v_state := case when v_now < v_grace_ends then 'grace' else 'read_only' end;
 elsif s.status = 'unpaid' then v_state := 'read_only';
 elsif s.status = 'past_due' then v_state := 'grace';
 else v_state := 'active';
 end if;
 return jsonb_build_object('state', v_state, 'read_only', v_state in ('read_only','ended'), 'origin', s.origin,
  'grace_ends_at', v_grace_ends, 'policy_version', 'access-v1',
  'cancel_scheduled', (s.status is distinct from 'canceled') and (s.cancel_at is not null or s.cancel_at_period_end));
end $$;

-- 6. Catalogue assertions.
do $$
declare bad text;
begin
 if exists (select 1 from public.businesses b where b.pharmacy_id is distinct from b.id) then
  raise exception 'APBM007B/0061 ASSERT: backfill did not map every existing store to its own canonical id'; end if;
 if (select count(*) from public.pharmacy_identities) <> (select count(*) from public.businesses) then
  raise exception 'APBM007B/0061 ASSERT: identity count differs from ownership count'; end if;
 select string_agg(t || ':' || r, ', ') into bad
  from unnest(array['pharmacy_identities','billing_deployment','billing_test_contexts']) t cross join unnest(array['anon','authenticated']) r
  where has_table_privilege(r, ('public.' || t)::regclass, 'SELECT') or has_table_privilege(r, ('public.' || t)::regclass, 'INSERT')
     or has_table_privilege(r, ('public.' || t)::regclass, 'UPDATE') or has_table_privilege(r, ('public.' || t)::regclass, 'DELETE')
     or not (select relrowsecurity from pg_class where oid = ('public.' || t)::regclass);
 if bad is not null then raise exception 'APBM007B/0061 ASSERT: table reachable by customers or RLS off: %', bad; end if;
 select string_agg(p.oid::regprocedure::text || ':' || r, ', ') into bad
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace cross join unnest(array['anon','authenticated']) r
  where n.nspname = 'public' and p.proname like 'billing\_%' and has_function_privilege(r, p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007B/0061 ASSERT: clock function executable by customers: %', bad; end if;
end $$;
