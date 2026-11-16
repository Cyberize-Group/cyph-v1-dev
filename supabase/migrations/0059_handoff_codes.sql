-- APBM007A 0059: auth handoff codes (AUTH_HANDOFF_CONTRACT v1.0 section 3, FC-1..FC-3). Service-role EXECUTE only.
-- The table lives in a schema the data API does not expose. Only a hash of the code is stored; no provider token ever is.
-- Functions are SECURITY DEFINER so that they, and not the service role, read auth.sessions.
create schema handoff;
revoke all on schema handoff from public, anon, authenticated;

create table handoff.codes (
  id                 uuid primary key default gen_random_uuid(),
  code_hash          bytea       not null unique,          -- sha256 of the 32-byte code; the code itself is never stored
  challenge          text        not null check (challenge ~ '^[A-Za-z0-9_-]{43}$'),
  state_hash         bytea       not null,                 -- sha256 of the destination's state
  user_id            uuid        not null,                 -- subject, taken from the source's verified session
  source_session_id  uuid        not null,
  source_app         text        not null check (source_app in ('ob','pp')),
  dest_app           text        not null check (dest_app   in ('ob','pp')),
  environment        text        not null check (environment in ('local','staging')),
  return_path        text        not null check (return_path ~ '^/([A-Za-z0-9_-][A-Za-z0-9/_-]*)?$' and return_path !~ '//'),
  attempt            smallint    not null check (attempt in (1,2)),
  created_at         timestamptz not null default now(),
  expires_at         timestamptz not null,
  claimed_at         timestamptz,
  completed_at       timestamptz,
  dest_session_id    uuid,
  invalidated_at     timestamptz,
  invalid_reason     text check (invalid_reason in ('logout','mint_failed','subject_mismatch','switch_required')),
  check (source_app <> dest_app)
);
create index codes_user_open on handoff.codes (user_id) where completed_at is null and invalidated_at is null;
alter table handoff.codes enable row level security;       -- no policy: deny-all to customers
revoke all on handoff.codes from public, anon, authenticated, service_role;

-- Issue. Called by the source after getUser(). Subject and session come from the SAME access token just validated by getUser(), never request input or an unverified decode. Decode session_id only after validating that exact token; require its subject to equal getUser().id. Fail closed if either is absent.
create function public.handoff_issue(
  p_user uuid, p_session uuid, p_source text, p_dest text, p_env text,
  p_challenge text, p_state_hash bytea, p_return text, p_code_hash bytea, p_attempt smallint
) returns text language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from auth.sessions s where s.id = p_session and s.user_id = p_user) then
    return 'source_signed_out';
  end if;
  if (select count(*) from handoff.codes c
      where c.user_id = p_user and c.created_at > now() - interval '60 seconds') >= 10 then
    return 'slow_down';
  end if;
  delete from handoff.codes where id in (
    select c.id from handoff.codes c
     where c.created_at < now() - interval '24 hours'
       and (c.completed_at is not null or c.invalidated_at is not null or c.expires_at < now())
     limit 100);
  insert into handoff.codes (code_hash, challenge, state_hash, user_id, source_session_id,
                             source_app, dest_app, environment, return_path, attempt, expires_at)
  values (p_code_hash, p_challenge, p_state_hash, p_user, p_session,
          p_source, p_dest, p_env, p_return, p_attempt, now() + interval '60 seconds');
  return 'issued';
end $$;

-- Claim. One atomic UPDATE. Every binding is part of the WHERE clause, so a wrong verifier,
-- state, audience or environment matches no row and leaves a valid code untouched.
create function public.handoff_claim(
  p_code_hash bytea, p_verifier text, p_state_hash bytea, p_dest text, p_env text
) returns table (outcome text, claim_id uuid, user_id uuid, return_path text, attempt smallint)
language plpgsql security definer set search_path = '' as $$
declare
  v_challenge text := rtrim(translate(encode(sha256(convert_to(p_verifier, 'UTF8')), 'base64'), '+/', '-_'), '=');
begin
  return query
  update handoff.codes c
     set claimed_at = now()
   where c.code_hash   = p_code_hash
     and c.challenge   = v_challenge          -- explicit destination verifier validation (S256)
     and c.state_hash  = p_state_hash         -- browser binding
     and c.dest_app    = p_dest               -- audience
     and c.environment = p_env
     and c.claimed_at is null                 -- single redemption
     and c.invalidated_at is null
     and c.expires_at > now()
     and exists (select 1 from auth.sessions s
                 where s.id = c.source_session_id and s.user_id = c.user_id)   -- source still signed in
  returning 'claimed', c.id, c.user_id, c.return_path, c.attempt;
  if not found then
    return query select 'rejected'::text, null::uuid, null::uuid, null::text, null::smallint;
  end if;
end $$;

-- Complete. Called after the session is minted and before any cookie is written.
-- Fails if the user logged out, or the source session ended, between claim and mint.
create function public.handoff_complete(p_claim_id uuid, p_dest_session uuid)
returns text language plpgsql security definer set search_path = '' as $$
begin
  update handoff.codes c
     set completed_at = now(), dest_session_id = p_dest_session
   where c.id = p_claim_id
     and c.claimed_at is not null
     and c.completed_at is null
     and c.invalidated_at is null
     and exists (select 1 from auth.sessions s
                 where s.id = c.source_session_id and s.user_id = c.user_id);
  if found then return 'ok'; end if;
  return 'revoked';
end $$;

-- Fail. Records why a claimed code did not produce a session. Never makes the code reusable.
create function public.handoff_fail(p_claim_id uuid, p_reason text)
returns void language sql security definer set search_path = '' as $$
  update handoff.codes set invalidated_at = now(), invalid_reason = p_reason
   where id = p_claim_id and completed_at is null and invalidated_at is null;
$$;

-- Logout. Called by either app before the provider sign-out. Covers unclaimed AND claimed-but-incomplete codes.
create function public.handoff_invalidate_user(p_user uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  update handoff.codes set invalidated_at = now(), invalid_reason = 'logout'
   where user_id = p_user and completed_at is null and invalidated_at is null;
  get diagnostics n = row_count;
  return n;
end $$;

revoke all on function public.handoff_issue(uuid,uuid,text,text,text,text,bytea,text,bytea,smallint),
                       public.handoff_claim(bytea,text,bytea,text,text),
                       public.handoff_complete(uuid,uuid),
                       public.handoff_fail(uuid,text),
                       public.handoff_invalidate_user(uuid)
  from public, anon, authenticated;
grant execute on function public.handoff_issue(uuid,uuid,text,text,text,text,bytea,text,bytea,smallint),
                          public.handoff_claim(bytea,text,bytea,text,text),
                          public.handoff_complete(uuid,uuid),
                          public.handoff_fail(uuid,text),
                          public.handoff_invalidate_user(uuid)
  to service_role;


do $$
declare bad text;
begin
 select string_agg(p.oid::regprocedure::text||':'||r, ', ') into bad
 from pg_proc p join pg_namespace n on n.oid=p.pronamespace cross join unnest(array['anon','authenticated']) r
 where n.nspname='public' and p.proname in ('handoff_issue','handoff_claim','handoff_complete','handoff_fail','handoff_invalidate_user')
   and has_function_privilege(r, p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007A/0059 ASSERT: handoff function executable by customers: %', bad; end if;
 if (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
     where n.nspname='public' and p.proname like 'handoff\_%' and p.prosecdef and p.proconfig @> array['search_path=""']) <> 5 then
  raise exception 'APBM007A/0059 ASSERT: expected five SECURITY DEFINER handoff functions with an empty search_path'; end if;
 if has_schema_privilege('anon','handoff','USAGE') or has_schema_privilege('authenticated','handoff','USAGE')
    or has_table_privilege('anon','handoff.codes','SELECT') or has_table_privilege('authenticated','handoff.codes','SELECT')
    or has_table_privilege('service_role','handoff.codes','SELECT') or has_table_privilege('service_role','handoff.codes','UPDATE') then
  raise exception 'APBM007A/0059 ASSERT: handoff.codes is reachable outside its functions'; end if;
 if not (select relrowsecurity from pg_class where oid='handoff.codes'::regclass) then
  raise exception 'APBM007A/0059 ASSERT: RLS is off on handoff.codes'; end if;
end $$;
