-- APBM007A 0054: store identifiers (D-03, RA-7). NPI unique on its own; NCPDP optional. Existing values untouched.
-- No CHECK on businesses.npi: the five synthetic fixtures do not satisfy the ten-digit rule and must stay updatable.
do $$
declare dup int; nul int;
begin
 select count(*) into dup from (select npi from public.businesses group by npi having count(*)>1) d;
 select count(*) into nul from public.businesses where npi is null;
 if dup>0 or nul>0 then
  raise exception 'APBM007A/0054 ASSERT: % duplicate and % null NPI values; report conflicts, never delete or merge', dup, nul; end if;
end $$;

create unique index uq_businesses_npi on public.businesses(npi);
alter table public.businesses alter column ncpdp drop not null;

-- Ten digits and the Luhn check over 80840 + NPI. Used by the reservation table and the provisioning function.
create function public.npi_is_valid(p_npi text)
returns boolean language plpgsql immutable set search_path = '' as $$
declare s text; i int; d int; total int := 0; dbl boolean := false;
begin
 if p_npi is null or p_npi !~ '^[0-9]{10}$' then return false; end if;
 s := '80840' || p_npi;
 for i in reverse 15..1 loop
  d := substr(s, i, 1)::int;
  if dbl then d := d * 2; if d > 9 then d := d - 9; end if; end if;
  total := total + d; dbl := not dbl;
 end loop;
 return total % 10 = 0;
end $$;
revoke all on function public.npi_is_valid(text) from public,anon,authenticated;
grant execute on function public.npi_is_valid(text) to service_role;

do $$
begin
 if not public.npi_is_valid('1234567893') or public.npi_is_valid('1234567890') or public.npi_is_valid('123456789')
    or public.npi_is_valid('12345 67893') or public.npi_is_valid(null) then
  raise exception 'APBM007A/0054 ASSERT: npi_is_valid self-check failed'; end if;
 if has_function_privilege('anon','public.npi_is_valid(text)','EXECUTE') or has_function_privilege('authenticated','public.npi_is_valid(text)','EXECUTE') then
  raise exception 'APBM007A/0054 ASSERT: npi_is_valid is executable by customers'; end if;
end $$;
