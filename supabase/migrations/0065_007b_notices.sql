-- APBM-007B 0065: billing notices on the durable notification ledger (CONTRACTS/CLOCK_AND_NOTICES.md "O-2").
-- renewal_payment_failed at the first failure of a subscription_cycle invoice; renewal_read_only_warning at grace start
-- + 5 days. One row per (invoice, kind); claims are fenced and re-validate grace under the account lock; legacy
-- deferred renewal reminders are suppressed with their history kept. Nothing is dispatched by this migration.

alter table public.notification_operations drop constraint notification_operations_kind_check;
alter table public.notification_operations add constraint notification_operations_kind_check
 check (kind in ('access_link','access_link_resend','purchase_notice','renewal_reminder','renewal_payment_failed','renewal_read_only_warning'));
alter table public.notification_operations drop constraint notification_operations_status_check;
alter table public.notification_operations add constraint notification_operations_status_check
 check (status in ('pending','sent','failed','sending','suppressed','attention'));
alter table public.notification_operations
 add column invoice_id text,
 add column notice_kind text check (notice_kind is null or notice_kind in ('renewal_payment_failed','renewal_read_only_warning')),
 add column due_at timestamptz,
 add column claim_owner text,
 add column claim_until timestamptz,
 add column fencing_epoch bigint not null default 0,
 add column payload_fingerprint text,
 add column amount_due_cents integer,
 add column first_attempt_at timestamptz,
 add column provider_message_id text,
 add column finished_at timestamptz,
 add column suppression_reason text,
 add column attention_reason text,
 add constraint notification_notice_shape check (notice_kind is null or (invoice_id is not null and due_at is not null and kind = notice_kind));
create unique index notification_operations_one_notice on public.notification_operations (invoice_id, notice_kind) where notice_kind is not null;
create index notification_operations_due on public.notification_operations (due_at) where notice_kind is not null and status = 'pending';

-- Legacy 007A deferred reminders: suppressed, history preserved (no dispatch).
update public.notification_operations n set status = 'suppressed', suppression_reason = 'superseded_by_007b_notices'
 where n.kind = 'renewal_reminder' and n.status = 'pending';

-- Schedule both notices for the invoice that started grace. Idempotent; never moves an existing due time.
create function public.notice_schedule_for_failure(p_stripe_subscription_id text, p_invoice text, p_grace_started timestamptz, p_amount_due integer)
returns text language plpgsql security definer set search_path = '' as $$
declare s public.subscriptions%rowtype; v_owner uuid;
begin
 select * into s from public.subscriptions x where x.stripe_subscription_id = p_stripe_subscription_id and x.origin = 'stripe';
 if not found then return 'unknown_subscription'; end if;
 select a.owner_user_id into v_owner from public.accounts a where a.id = s.account_id;
 insert into public.notification_operations (kind, notice_kind, dedupe_key, account_id, user_id, status, invoice_id, due_at, amount_due_cents)
  values ('renewal_payment_failed', 'renewal_payment_failed', 'renewal_payment_failed:' || p_invoice, s.account_id, v_owner, 'pending', p_invoice, p_grace_started, p_amount_due),
         ('renewal_read_only_warning', 'renewal_read_only_warning', 'renewal_read_only_warning:' || p_invoice, s.account_id, v_owner, 'pending', p_invoice, p_grace_started + interval '5 days', p_amount_due)
  on conflict do nothing;
 return 'scheduled';
end $$;

-- Recovery (same invoice paid) suppresses anything not yet dispatched. Shares the account lock with claims.
create function public.notice_suppress_for_invoice(p_invoice text, p_reason text) returns integer
language plpgsql security definer set search_path = '' as $$
declare n integer; v_account uuid;
begin
 select x.account_id into v_account from public.notification_operations x where x.invoice_id = p_invoice limit 1;
 if v_account is null then return 0; end if;
 perform 1 from public.accounts a where a.id = v_account for update;
 update public.notification_operations x set status = 'suppressed', suppression_reason = p_reason, finished_at = now()
  where x.invoice_id = p_invoice and x.notice_kind is not null and x.status = 'pending';
 get diagnostics n = row_count;
 return n;
end $$;

create function public.notices_due() returns setof uuid language sql stable security definer set search_path = '' as $$
 select n.id from public.notification_operations n
  where n.notice_kind is not null and (n.status = 'pending' or (n.status = 'sending' and n.claim_until <= now()))
    and n.due_at <= public.billing_now(n.account_id)
  order by n.due_at limit 50;
$$;

-- Claim one notice for dispatch. Under the account lock: grace must still be anchored on this invoice, otherwise the
-- notice is suppressed; attempts are bounded (5) and inside the provider's idempotency horizon (stop before 23 h).
create function public.notice_claim(p_notice uuid, p_owner text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare n public.notification_operations%rowtype; s public.subscriptions%rowtype; v_email text; v_epoch bigint; v_grace_ends timestamptz;
begin
 select * into n from public.notification_operations x where x.id = p_notice;
 if not found or n.notice_kind is null then return jsonb_build_object('error', 'unknown'); end if;
 perform 1 from public.accounts a where a.id = n.account_id for update;
 select * into n from public.notification_operations x where x.id = p_notice for update;
 if n.status not in ('pending', 'sending') or (n.status = 'sending' and n.claim_until > now()) then return jsonb_build_object('error', 'not_claimable', 'status', n.status); end if;
 select * into s from public.subscriptions x where x.account_id = n.account_id and x.origin = 'stripe' order by (x.status is distinct from 'canceled') desc, x.created_at desc limit 1;
 if not found or s.grace_invoice_id is distinct from n.invoice_id or s.grace_started_at is null then
  update public.notification_operations x set status = 'suppressed', suppression_reason = 'recovered_or_not_in_grace', finished_at = now() where x.id = n.id;
  return jsonb_build_object('error', 'suppressed'); end if;
 if n.attempts >= 5 then
  update public.notification_operations x set status = 'attention', attention_reason = 'attempts_exhausted' where x.id = n.id;
  return jsonb_build_object('error', 'attention'); end if;
 if n.first_attempt_at is not null and now() >= n.first_attempt_at + interval '23 hours' then
  update public.notification_operations x set status = 'attention', attention_reason = 'idempotency_horizon' where x.id = n.id;
  return jsonb_build_object('error', 'attention'); end if;
 select lower(u.email) into v_email from auth.users u where u.id = n.user_id;
 if v_email is null then
  update public.notification_operations x set status = 'attention', attention_reason = 'owner_email_missing' where x.id = n.id;
  return jsonb_build_object('error', 'attention'); end if;
 v_grace_ends := s.grace_started_at + interval '7 days';
 update public.notification_operations x set status = 'sending', claim_owner = p_owner, claim_until = now() + interval '2 minutes',
   fencing_epoch = x.fencing_epoch + 1, attempts = x.attempts + 1, first_attempt_at = coalesce(x.first_attempt_at, now())
  where x.id = n.id returning x.fencing_epoch into v_epoch;
 return jsonb_build_object('id', n.id, 'epoch', v_epoch, 'kind', n.notice_kind, 'invoice_id', n.invoice_id, 'to', v_email,
   'grace_ends_at', v_grace_ends, 'amount_due_cents', n.amount_due_cents, 'attempt', n.attempts + 1, 'account_id', n.account_id);
end $$;

-- Finish a claimed dispatch: sent (provider accepted), retry (definite refusal, bounded backoff), or attention.
create function public.notice_finish(p_notice uuid, p_owner text, p_epoch bigint, p_outcome text, p_message_id text, p_error text, p_fingerprint text)
returns text language plpgsql security definer set search_path = '' as $$
begin
 if p_outcome not in ('sent', 'retry', 'attention') then raise exception 'invalid outcome' using errcode = '22023'; end if;
 update public.notification_operations x set
   status = case p_outcome when 'sent' then 'sent' when 'retry' then 'pending' else 'attention' end,
   provider_message_id = coalesce(p_message_id, x.provider_message_id), last_error_code = p_error,
   payload_fingerprint = coalesce(x.payload_fingerprint, p_fingerprint),
   sent_at = case when p_outcome = 'sent' then now() else x.sent_at end,
   finished_at = case when p_outcome in ('sent', 'attention') then now() else null end,
   due_at = case when p_outcome = 'retry' then greatest(x.due_at, now() + make_interval(mins => least(60, 5 * x.attempts))) else x.due_at end,
   attention_reason = case when p_outcome = 'attention' then p_error else x.attention_reason end,
   claim_owner = null, claim_until = null
  where x.id = p_notice and x.claim_owner = p_owner and x.fencing_epoch = p_epoch and x.status = 'sending';
 if found then return 'recorded'; end if;
 return 'lease_lost';
end $$;

do $$
declare f text;
begin
 foreach f in array array['notice_schedule_for_failure(text,text,timestamp with time zone,integer)', 'notice_suppress_for_invoice(text,text)',
   'notices_due()', 'notice_claim(uuid,text)', 'notice_finish(uuid,text,bigint,text,text,text,text)'] loop
  execute format('revoke all on function public.%s from public, anon, authenticated', f);
  execute format('grant execute on function public.%s to service_role', f);
 end loop;
 if has_table_privilege('authenticated', 'public.notification_operations', 'SELECT') then raise exception 'APBM007B/0065 ASSERT: notices readable by customers'; end if;
 if exists (select 1 from public.notification_operations n where n.kind = 'renewal_reminder' and n.status = 'pending') then
  raise exception 'APBM007B/0065 ASSERT: legacy reminder left pending'; end if;
end $$;
