-- APBM-007B 0068: narrow forward fix (Director ruling, 17 November 2026). 0061 made businesses.pharmacy_id NOT NULL; every
-- pre-existing inserter (007A provision_paid_registration, the RLS/audit seed harnesses) inserts stores without it. This
-- trigger keeps them working. Nothing else changes; 0061–0067 stay exactly as applied.

-- Compatibility for every existing inserter (007A provision_paid_registration, seed harnesses): a store inserted without a
-- canonical identity is a NEW pharmacy, so its identity is created with id = the new store id (the backfill convention).
-- An NPI that already has an identity is refused here: a previously registered pharmacy is never silently re-attached
-- (transfer and reactivation pass pharmacy_id explicitly through their own guarded paths).
create function public.businesses_assign_identity() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if new.pharmacy_id is null then
  if exists (select 1 from public.pharmacy_identities i where i.npi = new.npi) then
   raise exception 'pharmacy identity already exists for this NPI' using errcode = '23505'; end if;
  insert into public.pharmacy_identities (id, npi) values (new.id, new.npi);
  new.pharmacy_id := new.id;
 end if;
 if new.ownership_started_at is null then new.ownership_started_at := coalesce(new.date_of_registration, now()); end if;
 return new;
end $$;
revoke all on function public.businesses_assign_identity() from public, anon, authenticated;
create trigger businesses_assign_identity before insert on public.businesses for each row execute function public.businesses_assign_identity();

do $$
begin
 if not exists (select 1 from pg_trigger where tgname = 'businesses_assign_identity' and tgrelid = 'public.businesses'::regclass) then
  raise exception 'APBM007B/0068 ASSERT: compatibility trigger missing'; end if;
 if has_function_privilege('authenticated', 'public.businesses_assign_identity()', 'EXECUTE') or has_function_privilege('anon', 'public.businesses_assign_identity()', 'EXECUTE') then
  raise exception 'APBM007B/0068 ASSERT: trigger function executable by customers'; end if;
end $$;
