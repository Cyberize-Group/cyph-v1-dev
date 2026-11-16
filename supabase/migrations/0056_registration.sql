-- APBM007A 0056: anonymous registration draft and NPI reservation (BILL-01, RA-7). Service-only tables.
-- A draft is owned by a secret held in an httpOnly cookie; only its hash is stored. A draft is not a store.
create table public.registration_drafts (
 id uuid primary key default gen_random_uuid(),
 secret_hash bytea not null unique,
 revision integer not null default 1 check (revision >= 1),
 status text not null default 'draft' check (status in ('draft','checkout_started','paid','provisioned','abandoned')),
 signed_in_user_id uuid,
 owner_first_name text, owner_last_name text,
 owner_email text check (owner_email is null or owner_email = lower(owner_email)),
 owner_phone text,
 owner_declaration_version text, owner_declaration_accepted_at timestamptz,
 pharmacy_name text, address text, city text,
 state text check (state is null or state ~ '^[A-Z]{2}$'),
 zip text, phone text, software text,
 npi text check (npi is null or npi ~ '^[0-9]{10}$'),
 ncpdp text check (ncpdp is null or ncpdp ~ '^[0-9]{7}$'),
 quote_revision integer, quote_subtotal_cents integer, quote_discount_cents integer, quote_total_cents integer,
 quote_currency text check (quote_currency is null or quote_currency = 'usd'),
 quote_promotion_code text, quote_price_id text, quote_expires_at timestamptz,
 consent_terms_version text, consent_revision integer, consent_accepted_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.registration_drafts enable row level security;
revoke all on public.registration_drafts from public,anon,authenticated;
grant select,insert,update on public.registration_drafts to service_role;
create trigger set_updated_at before update on public.registration_drafts
 for each row execute function public.update_updated_at();

create table public.npi_reservations (
 id uuid primary key default gen_random_uuid(),
 npi text not null check (public.npi_is_valid(npi)),
 draft_id uuid not null references public.registration_drafts(id),
 status text not null check (status in ('held','checkout_bound','consumed','released')),
 operation_id uuid,
 expires_at timestamptz not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create unique index npi_reservations_one_active on public.npi_reservations(npi) where status in ('held','checkout_bound');
create index npi_reservations_draft on public.npi_reservations(draft_id);
alter table public.npi_reservations enable row level security;
revoke all on public.npi_reservations from public,anon,authenticated;
grant select on public.npi_reservations to service_role;          -- changes go through the functions below
create trigger set_updated_at before update on public.npi_reservations
 for each row execute function public.update_updated_at();
create trigger audit_write after insert or update or delete on public.npi_reservations
 for each row execute function public.audit_write();

-- Reserve an NPI for a draft. Expiry is applied lazily here, under a per-NPI lock; there is no timer job.
-- A checkout-bound reservation is never released by time alone: the caller gets needs_proof with the operation
-- to verify against Stripe.
create function public.npi_reserve(p_draft uuid, p_npi text)
returns table (outcome text, reservation_id uuid, blocking_operation_id uuid)
language plpgsql security definer set search_path = '' as $$
declare r public.npi_reservations%rowtype; v_id uuid;
begin
 if not public.npi_is_valid(p_npi) then
  return query select 'invalid'::text, null::uuid, null::uuid; return; end if;
 if not exists (select 1 from public.registration_drafts d where d.id = p_draft and d.status = 'draft') then
  return query select 'draft_not_editable'::text, null::uuid, null::uuid; return; end if;
 perform pg_advisory_xact_lock(hashtextextended('apbm007a:npi:' || p_npi, 0));
 -- a draft that changed its NPI lets go of its earlier unbound hold
 update public.npi_reservations x set status = 'released'
  where x.draft_id = p_draft and x.status = 'held' and x.npi <> p_npi;
 if exists (select 1 from public.businesses b where b.npi = p_npi) then
  return query select 'unavailable'::text, null::uuid, null::uuid; return; end if;
 select * into r from public.npi_reservations x where x.npi = p_npi and x.status in ('held','checkout_bound') for update;
 if found then
  if r.draft_id = p_draft then
   if r.status = 'held' then
    update public.npi_reservations x set expires_at = least(x.created_at + interval '2 hours', now() + interval '30 minutes')
     where x.id = r.id;
   end if;
   return query select r.status, r.id, r.operation_id; return;
  end if;
  if r.status = 'held' and r.expires_at <= now() then
   update public.npi_reservations x set status = 'released' where x.id = r.id;
  elsif r.status = 'checkout_bound' and r.expires_at <= now() then
   return query select 'needs_proof'::text, null::uuid, r.operation_id; return;
  else
   return query select 'unavailable'::text, null::uuid, null::uuid; return;
  end if;
 end if;
 insert into public.npi_reservations(npi, draft_id, status, expires_at)
  values (p_npi, p_draft, 'held', now() + interval '30 minutes') returning id into v_id;
 return query select 'held'::text, v_id, null::uuid;
end $$;
revoke all on function public.npi_reserve(uuid,text) from public,anon,authenticated;
grant execute on function public.npi_reserve(uuid,text) to service_role;

do $$
begin
 if has_table_privilege('anon','public.registration_drafts','SELECT') or has_table_privilege('authenticated','public.registration_drafts','SELECT')
    or has_table_privilege('anon','public.npi_reservations','SELECT') or has_table_privilege('authenticated','public.npi_reservations','SELECT')
    or has_table_privilege('authenticated','public.registration_drafts','INSERT') or has_table_privilege('authenticated','public.npi_reservations','INSERT') then
  raise exception 'APBM007A/0056 ASSERT: registration tables are reachable by customers'; end if;
 if has_function_privilege('anon','public.npi_reserve(uuid,text)','EXECUTE') or has_function_privilege('authenticated','public.npi_reserve(uuid,text)','EXECUTE') then
  raise exception 'APBM007A/0056 ASSERT: npi_reserve is executable by customers'; end if;
 if exists (select 1 from pg_class c where c.oid in ('public.registration_drafts'::regclass,'public.npi_reservations'::regclass) and not c.relrowsecurity) then
  raise exception 'APBM007A/0056 ASSERT: RLS is off on a registration table'; end if;
end $$;
