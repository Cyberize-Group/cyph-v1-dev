-- APBM007A 0057: durable checkout/provisioning operation, Stripe event ledger, notification operations (BILL-01, DATA-01).
-- Service-only. No raw webhook body, token or address is stored here.
create table public.checkout_operations (
 id uuid primary key default gen_random_uuid(),
 idempotency_key text not null unique check (idempotency_key ~ '^[A-Za-z0-9_-]{16,128}$'),
 draft_id uuid not null references public.registration_drafts(id),
 draft_revision integer not null,
 npi text not null,
 expected_total_cents integer not null check (expected_total_cents >= 0),
 expected_currency text not null check (expected_currency = 'usd'),
 expected_price_id text not null,
 promotion_code text,
 status text not null default 'created'
  check (status in ('created','checkout_open','paid','provisioning','provisioned','expired_unpaid','attention')),
 stripe_customer_id text,
 stripe_checkout_session_id text unique,
 stripe_subscription_id text unique,
 stripe_invoice_id text,
 checkout_expires_at timestamptz,
 owner_user_id uuid,
 owner_was_existing boolean,
 account_id uuid references public.accounts(id),
 business_id uuid references public.businesses(id),
 lease_owner text, lease_expires_at timestamptz,
 attempts integer not null default 0,
 last_error_code text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
-- one unresolved operation per draft: a second key cannot bypass it
create unique index checkout_operations_one_open on public.checkout_operations(draft_id)
 where status in ('created','checkout_open','paid','provisioning','attention');
alter table public.checkout_operations enable row level security;
revoke all on public.checkout_operations from public,anon,authenticated;
grant select,insert,update on public.checkout_operations to service_role;
create trigger set_updated_at before update on public.checkout_operations
 for each row execute function public.update_updated_at();
create trigger audit_write after insert or update or delete on public.checkout_operations
 for each row execute function public.audit_write();
alter table public.npi_reservations
 add constraint npi_reservations_operation_fk foreign key (operation_id) references public.checkout_operations(id);

create table public.stripe_events (
 event_id text primary key check (event_id ~ '^evt_[A-Za-z0-9]+$'),
 type text not null,
 livemode boolean not null,
 stripe_account text,
 event_created timestamptz not null,
 object_id text,
 status text not null default 'received' check (status in ('received','processed','ignored','failed')),
 attempts integer not null default 0,
 operation_id uuid references public.checkout_operations(id),
 error_code text,
 received_at timestamptz not null default now(),
 processed_at timestamptz
);
alter table public.stripe_events enable row level security;
revoke all on public.stripe_events from public,anon,authenticated;
grant select,insert,update on public.stripe_events to service_role;

create table public.notification_operations (
 id uuid primary key default gen_random_uuid(),
 kind text not null check (kind in ('access_link','access_link_resend','purchase_notice','renewal_reminder')),
 dedupe_key text not null unique,
 operation_id uuid references public.checkout_operations(id),
 account_id uuid references public.accounts(id),
 user_id uuid not null,
 status text not null default 'pending' check (status in ('pending','sent','failed')),
 attempts integer not null default 0,
 last_error_code text,
 next_attempt_at timestamptz,
 sent_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.notification_operations enable row level security;
revoke all on public.notification_operations from public,anon,authenticated;
grant select,insert,update on public.notification_operations to service_role;
create trigger set_updated_at before update on public.notification_operations
 for each row execute function public.update_updated_at();

-- Bind the draft's hold to its checkout operation. The window is the Checkout session's own expiry plus five minutes.
create function public.npi_bind(p_draft uuid, p_operation uuid, p_checkout_expires timestamptz)
returns text language plpgsql security definer set search_path = '' as $$
begin
 update public.npi_reservations x
    set status = 'checkout_bound', operation_id = p_operation, expires_at = p_checkout_expires + interval '5 minutes'
  where x.draft_id = p_draft and x.status in ('held','checkout_bound')
    and (x.operation_id is null or x.operation_id = p_operation)
    and exists (select 1 from public.checkout_operations o where o.id = p_operation and o.draft_id = p_draft and o.npi = x.npi);
 if found then return 'bound'; end if;
 return 'no_reservation';
end $$;

-- Release a bound reservation. Only for an operation already recorded as expired and unpaid; never by time alone,
-- and never for a paid operation.
create function public.npi_release_unpaid(p_operation uuid)
returns text language plpgsql security definer set search_path = '' as $$
begin
 if not exists (select 1 from public.checkout_operations o where o.id = p_operation and o.status = 'expired_unpaid') then
  return 'not_proven_unpaid'; end if;
 update public.npi_reservations x set status = 'released'
  where x.operation_id = p_operation and x.status in ('held','checkout_bound');
 if found then return 'released'; end if;
 return 'nothing_to_release';
end $$;

-- Bounded lease so that one worker at a time advances an operation. Returns true to the caller that holds it.
create function public.operation_lease(p_operation uuid, p_owner text, p_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
 update public.checkout_operations o
    set lease_owner = p_owner, lease_expires_at = now() + make_interval(secs => least(greatest(p_seconds, 5), 120)),
        attempts = o.attempts + 1
  where o.id = p_operation
    and (o.lease_owner is null or o.lease_owner = p_owner or o.lease_expires_at <= now());
 return found;
end $$;

-- Mirror the authoritative subscription object the server just read from Stripe. p_verified_at is the time of that
-- read; an older read can never overwrite a newer one, and an ended subscription is never revived.
create function public.subscription_mirror_apply(p_stripe_subscription_id text, p jsonb, p_verified_at timestamptz)
returns text language plpgsql security definer set search_path = '' as $$
begin
 update public.subscriptions s set
   raw_status = p->>'raw_status',
   status = p->>'status',
   quantity = (p->>'quantity')::integer,
   stripe_price_id = p->>'price_id',
   stripe_subscription_item_id = p->>'item_id',
   current_period_start = (p->>'current_period_start')::timestamptz,
   current_period_end = (p->>'current_period_end')::timestamptz,
   cancel_at_period_end = coalesce((p->>'cancel_at_period_end')::boolean, false),
   cancel_at = (p->>'cancel_at')::timestamptz,
   latest_invoice_id = p->>'latest_invoice_id',
   latest_invoice_status = p->>'latest_invoice_status',
   verified_at = p_verified_at
  where s.stripe_subscription_id = p_stripe_subscription_id and s.origin = 'stripe'
    and (s.verified_at is null or s.verified_at <= p_verified_at)
    and (s.status is distinct from 'canceled' or p->>'status' = 'canceled');
 if found then return 'applied'; end if;
 if exists (select 1 from public.subscriptions s where s.stripe_subscription_id = p_stripe_subscription_id) then return 'stale'; end if;
 return 'unknown_subscription';
end $$;

-- Grace starts at the first failure of a renewal invoice and never restarts on retries of the same invoice.
create function public.subscription_grace_start(p_stripe_subscription_id text, p_invoice text, p_failed_at timestamptz)
returns text language plpgsql security definer set search_path = '' as $$
begin
 update public.subscriptions s set grace_invoice_id = p_invoice, grace_started_at = p_failed_at
  where s.stripe_subscription_id = p_stripe_subscription_id and s.origin = 'stripe'
    and s.grace_invoice_id is distinct from p_invoice;
 if found then return 'started'; end if;
 return 'unchanged';
end $$;

-- Payment of that same invoice clears the delinquency. A different invoice does not.
create function public.subscription_grace_clear(p_stripe_subscription_id text, p_invoice text)
returns text language plpgsql security definer set search_path = '' as $$
begin
 update public.subscriptions s set grace_started_at = null
  where s.stripe_subscription_id = p_stripe_subscription_id and s.origin = 'stripe'
    and s.grace_invoice_id = p_invoice and s.grace_started_at is not null;
 if found then return 'cleared'; end if;
 return 'unchanged';
end $$;

revoke all on function public.npi_bind(uuid,uuid,timestamptz),public.npi_release_unpaid(uuid),public.operation_lease(uuid,text,integer),
 public.subscription_mirror_apply(text,jsonb,timestamptz),public.subscription_grace_start(text,text,timestamptz),
 public.subscription_grace_clear(text,text) from public,anon,authenticated;
grant execute on function public.npi_bind(uuid,uuid,timestamptz),public.npi_release_unpaid(uuid),public.operation_lease(uuid,text,integer),
 public.subscription_mirror_apply(text,jsonb,timestamptz),public.subscription_grace_start(text,text,timestamptz),
 public.subscription_grace_clear(text,text) to service_role;

do $$
declare bad text;
begin
 select string_agg(t||':'||r, ', ') into bad
 from unnest(array['checkout_operations','stripe_events','notification_operations']) t cross join unnest(array['anon','authenticated']) r
 where has_table_privilege(r, ('public.'||t)::regclass, 'SELECT') or has_table_privilege(r, ('public.'||t)::regclass, 'INSERT')
    or has_table_privilege(r, ('public.'||t)::regclass, 'UPDATE') or has_table_privilege(r, ('public.'||t)::regclass, 'DELETE')
    or not (select relrowsecurity from pg_class where oid=('public.'||t)::regclass);
 if bad is not null then raise exception 'APBM007A/0057 ASSERT: table reachable by customers or RLS off: %', bad; end if;
 select string_agg(p.oid::regprocedure::text||':'||r, ', ') into bad
 from pg_proc p join pg_namespace n on n.oid=p.pronamespace cross join unnest(array['anon','authenticated']) r
 where n.nspname='public' and p.proname in ('npi_bind','npi_release_unpaid','operation_lease','subscription_mirror_apply','subscription_grace_start','subscription_grace_clear')
   and has_function_privilege(r, p.oid, 'EXECUTE');
 if bad is not null then raise exception 'APBM007A/0057 ASSERT: function executable by customers: %', bad; end if;
end $$;
