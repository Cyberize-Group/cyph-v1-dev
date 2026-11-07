-- SCRATCH APPLICATION BODY ONLY. NOT RELEASED FOR DEV. No managed ACL writes.
-- APBM-003 DEV-specific bootstrap proposal. NOT EXECUTED / NOT RELEASED.
-- NO COMMIT here. A reviewed executor must compare the exact pre-catalog,
-- capture preservation fingerprints, run this body in ONE transaction,
-- then call assertAfter() from checks.mjs BEFORE deciding to COMMIT.
-- Any exception, mismatch or timeout: ROLLBACK the entire bootstrap.
-- Never use db-bootstrap-baseline.sql or a reset/replay runner on DEV.
-- This file is intentionally not executable by the current postgres role:
-- exact parity requires privileges to alter supabase_admin's defaults.

DO $guard$
BEGIN
 -- SCRATCH-only: managed ACL privilege gate evaluated separately.
 IF to_regclass('apbm_migrations.ledger') IS NOT NULL THEN
   RAISE EXCEPTION 'BOOTSTRAP BLOCKED: APBM ledger already exists';
 END IF;
 IF (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
     WHERE n.nspname='public' AND c.relkind IN ('r','p')) <> 2
 OR to_regclass('public.profiles') IS NULL OR to_regclass('public.user_roles') IS NULL THEN
   RAISE EXCEPTION 'BOOTSTRAP BLOCKED: expected the verified two-table starting state';
 END IF;
END
$guard$;

-- Remove only the three additional per-schema future-object grant entries.
-- Existing table/function/sequence ACLs and all role memberships stay untouched.

-- The privileged operator must be permitted to assume postgres; no role grant
-- is performed. Every new object must retain the approved postgres owner.
SET LOCAL ROLE postgres;

-- A short coordinated application/Auth maintenance window is prerequisite.
-- Locks prevent row changes during the preservation comparison. Do not bypass
-- permission/lock failures; abort and reschedule. Acquire before before-state
-- fingerprints in the reviewed executor (these repeated locks are harmless).
LOCK TABLE auth.users, auth.identities, public.profiles, public.user_roles
 IN SHARE ROW EXCLUSIVE MODE;

-- Profiles, user_roles, app_role, user_roles_id_seq and their 3 policies
-- already match exactly: no replacement, backfill, reseed or policy rewrite.


-- Existing functions: exact approved pg_get_functiondef text; OIDs/dependencies preserved.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  assigned_role public.app_role;
BEGIN
  IF NEW.raw_user_meta_data ->> 'role' IS NOT NULL THEN
    assigned_role := (NEW.raw_user_meta_data ->> 'role')::public.app_role;
  ELSE
    assigned_role := 'member'::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$
;
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  obj record;
BEGIN
  FOR obj IN
    SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE TABLE'
  LOOP
    IF obj.schema_name = 'public' THEN
      EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', obj.object_identity);
    END IF;
  END LOOP;
END;
$function$
;


-- Required missing helper from the approved baseline (0001 assertion replay omitted).
CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;


-- Approved source: supabase/migrations/0002_accounts.sql
-- BIM-001 · 0002_accounts — the organization/group spine (NEW, ruling R-2).
-- Sits above businesses (stores); subscription attaches HERE, not to stores.
-- No superadmin concept inside OwedBook — platform roles are MissionControl's.

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accounts enable row level security; -- deny-by-default at birth (law §6.1); ensure_rls is the net, this is the belt

create trigger set_updated_at
  before update on public.accounts
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0003_businesses.sql
-- BIM-001 · 0003_businesses — the store/tenant entity.
-- FRANK_API `businesses` verbatim (models.py:13-183 via FRANK_API-02 catalog),
-- Postgres idiom per AUTHORITY_README fidelity rule (Integer PK → uuid,
-- String(n) → text, DateTime → timestamptz). Deliberate divergences:
--   · account_id NOT NULL FK → accounts        [ruling R-2: the accounts spine]
--   · pharmacy_slug (unique)                   [TONY_DEMO adoption, TRIANGULATION §3.1]
--   · subscription-STATE fields moved OUT to subscriptions(account_id):
--     stripe_subscription_id, stripe_checkout_session_id, subscription_status,
--     promotion_code, trial_end_date, current_period_end, cancel_at_period_end
--                                              [TRIANGULATION §3.5 + ruling R-2]
--   · stripe_customer_id + has_used_trial stay here (customer identity + the
--     one-trial-per-NCPDP+NPI anti-abuse flag)  [manager §5 row 2]
--   · legacy pharmacy_profile table: never created [TRIANGULATION §3.1 — DROP]

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id),
  ncpdp text not null,                -- TEXT: leading zeros are data (law §6.3)
  npi text not null,
  pharmacy_name text not null,
  address text,
  address_line2 text,
  city text,
  state text,
  zip text,
  phone text,
  fax text,
  email text,
  pharmacy_license_number text,
  pharmacist_license text,
  contact_person text,
  contact_person_last_name text,
  business_email text,
  website_url text,
  time_zone text,
  preferred_contact_method text,
  country text,
  pharmacy_software_system text,
  role_in_pharmacy text,
  mobile_number text,
  ghl_contact_id text,
  ghl_company_id text,
  date_of_registration timestamptz,
  -- lifecycle vocabulary as documented in the catalog (pending → active; suspended valid)
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  pharmacy_slug text unique,
  stripe_customer_id text,
  has_used_trial boolean not null default false,
  activation_key text unique,        -- set NULL after consumption (catalog business.py:899)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_businesses_ncpdp_npi unique (ncpdp, npi)  -- catalog _ncpdp_npi_uc
);

create index idx_businesses_account_id on public.businesses (account_id);

alter table public.businesses enable row level security;

create trigger set_updated_at
  before update on public.businesses
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0004_user_businesses.sql
-- BIM-001 · 0004_user_businesses — the per-store membership/capability junction.
-- FRANK_API junction verbatim (models.py:306-351), with:
--   · user_id references auth.users — identity layer is Supabase Auth, the
--     custom users table does not exist in the rebuild [TRIANGULATION §3.1]
--   · role vocabulary 'admin'|'member' via TEXT + CHECK — NOT an enum; the
--     CHECK is the v2 seam for GHL-style alterable permissions. Catalog used
--     'admin'|'user' with default 'user'; 'user' → 'member'   [ruling R-3]
-- RLS membership reads THIS junction only; no policy may consult user_roles
-- (R-3). BIM-002 writes those policies — this module writes none.

create table public.user_businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  is_primary boolean not null default false,   -- one primary per user (app-enforced, per catalog)
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_user_business unique (user_id, business_id)  -- catalog uq_user_business
);

create index idx_user_businesses_user_id on public.user_businesses (user_id);
create index idx_user_businesses_business_id on public.user_businesses (business_id);

alter table public.user_businesses enable row level security;

create trigger set_updated_at
  before update on public.user_businesses
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0005_pending_registrations.sql
-- BIM-001 · 0005_pending_registrations — manual-verification onboarding.
-- FRANK_API verbatim (models.py:354-493). Built now per manager §5 row 6:
-- Frank's onboarding-approval confirm is pending; the table costs nothing empty.
-- Divergences: verified_by_user_id references auth.users (no custom users table,
-- TRIANGULATION §3.1); uuid PK per fidelity rule.

create table public.pending_registrations (
  id uuid primary key default gen_random_uuid(),
  ncpdp text not null,
  npi text not null,
  email text not null,
  pharmacy_name text,
  phone text,
  address text,
  address_line2 text,
  city text,
  state text,
  zip text,
  fax text,
  contact_person text,
  contact_person_last_name text,
  pharmacy_license_number text,
  pharmacist_license text,
  country text,
  pharmacy_software_system text,
  role_in_pharmacy text,
  mobile_number text,
  website_url text,
  -- desktop-converter linking (existing business gaining a new admin)
  activation_key text,
  desktop_username text,
  is_desktop_converter boolean not null default false,
  business_id uuid references public.businesses (id),
  status text not null default 'pending_verification'
    check (status in ('pending_verification', 'approved', 'rejected', 'expired', 'completed')),
  verified_by_user_id uuid references auth.users (id),
  verified_at timestamptz,
  verification_notes text,
  activation_token text unique,      -- secrets.token_urlsafe(32) grammar, 7-day TTL (catalog)
  activation_token_expires_at timestamptz,
  activation_link_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_pending_reg_email_business unique (email, ncpdp, npi)  -- catalog
);

create index idx_pending_registrations_email on public.pending_registrations (email);
create index idx_pending_registrations_status on public.pending_registrations (status);

alter table public.pending_registrations enable row level security;

create trigger set_updated_at
  before update on public.pending_registrations
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0006_subscriptions.sql
-- BIM-001 · 0006_subscriptions — Stripe state mirror, ACCOUNT-scoped.
-- StarkReads separate-table pattern (TRIANGULATION §3.5) with ruling R-2's
-- override: subscription attaches to the ACCOUNT, not the store —
-- account_id FK, deliberately NO business_id column (spec AC5).
-- Field set = the subscription-state fields lifted out of FRANK_API's
-- businesses embedding (models.py:13-183): status vocabulary as documented.
-- Phase 7 is the consumer; this module ships structure only.

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id),
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_checkout_session_id text,
  status text check (status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  promotion_code text,               -- audit trail of promo applied (catalog)
  trial_end_date timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_account_id on public.subscriptions (account_id);

alter table public.subscriptions enable row level security;

create trigger set_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0007_apa_memberships.sql
-- BIM-001 · 0007_apa_memberships — APA20 discount eligibility.
-- FRANK_API verbatim (models.py:573-636). license_number normalization
-- (strip spaces, uppercase) is APPLICATION-side per the catalog's @validates —
-- not a DB constraint here. discount_redeemed_business_id is a soft reference
-- by design (catalog: "Not a FK"); uuid type per the rebuild's PK idiom.

create table public.apa_memberships (
  id uuid primary key default gen_random_uuid(),
  license_number text not null unique,
  membership text not null,
  membership_expires date,
  first_name text not null,
  last_name text not null,
  discount_redeemed boolean not null default false,
  discount_redeemed_at timestamptz,
  discount_redeemed_business_id uuid,   -- soft reference, no FK (catalog)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apa_memberships enable row level security;

create trigger set_updated_at
  before update on public.apa_memberships
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0008_reference_dataset_versions.sql
-- BIM-001 · 0008_reference_dataset_versions — dataset-vintage registry.
-- FRANK_API shape (models.py:802-824): checksum + row_count + latest_upload_at
-- per dataset. Created FIRST in the reference family so the four reference
-- tables can carry their provenance FK (structural law §6.4).

create table public.reference_dataset_versions (
  id uuid primary key default gen_random_uuid(),
  dataset_name text not null unique,   -- per-dataset identity (aac / wac / ful / pbm_info)
  checksum text,
  row_count integer,
  latest_upload_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reference_dataset_versions enable row level security;

create trigger set_updated_at
  before update on public.reference_dataset_versions
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0009_aac_reference.sql
-- BIM-001 · 0009_aac_reference — Actual Acquisition Cost by NDC.
-- FRANK_API shape (models.py:865-883): UK (ndc, aac_date). aac_date IS the
-- effective/as-of-dispense-date join key (manager §5 row 11 + Format Map §3 —
-- no second date column is invented). Money NUMERIC (law §6.2); NDC TEXT (§6.3).
-- Provenance trio per law §6.4.

create table public.aac_reference (
  id uuid primary key default gen_random_uuid(),
  ndc text not null,
  aac_date date not null,            -- the effective-date join key
  aac numeric,
  drug_name text,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_aac_reference_ndc_date unique (ndc, aac_date)
);

alter table public.aac_reference enable row level security;

create trigger set_updated_at
  before update on public.aac_reference
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0010_wac_reference.sql
-- BIM-001 · 0010_wac_reference — Wholesale Acquisition Cost.
-- FRANK_API shape (models.py:737-775, UK (ndc, effective_date)) with the
-- ratified divergences:
--   · pkg_size / pkg_size_mult / generic_indicator adopted from TONY_DEMO
--     alt_rates — the WAC-derive formula inputs [TRIANGULATION §3.3 + MATH_SPEC;
--     Format Map Finding 1: alt_rates IS the WAC table]
--   · Computed column wac_by_unit DROPPED — derive in app [TRIANGULATION §3.3
--     smell resolution; cross-driver portability burn]
--   · one brand/generic name: generic_indicator; `bg` never enters (law §6.6)

create table public.wac_reference (
  id uuid primary key default gen_random_uuid(),
  ndc text not null,
  effective_date date not null,
  wac numeric,
  pkg_size numeric,
  pkg_size_mult numeric,
  generic_indicator text,
  drug_name text,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_wac_reference_ndc_date unique (ndc, effective_date)
);

alter table public.wac_reference enable row level security;

create trigger set_updated_at
  before update on public.wac_reference
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0011_ful_reference.sql
-- BIM-001 · 0011_ful_reference — Federal Upper Limit.
-- FRANK_API shape (models.py:778-799): UK (ndc, year, month); aca_ful
-- Numeric(12,6) kept at catalog precision. Provenance per law §6.4.

create table public.ful_reference (
  id uuid primary key default gen_random_uuid(),
  ndc text not null,
  year integer not null,
  month integer not null,
  aca_ful numeric(12, 6),
  drug_name text,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_ful_reference_ndc_year_month unique (ndc, year, month)
);

alter table public.ful_reference enable row level security;

create trigger set_updated_at
  before update on public.ful_reference
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0012_pbm_info.sql
-- BIM-001 · 0012_pbm_info — PBM directory.
-- FRANK_API FULL shape (models.py:851-863: bin/pbm_name/pcn/state/email —
-- the demo's subset missed pcn+state, TRIANGULATION §3.3) plus the manager's
-- ratified columns: pbm_key (the canonical match key COLUMN; its derivation
-- function `{bin}-{pcn}-{group_field}` + BIN 004146 → '4146' is Phase 5's,
-- forbidden here per manager §8) and matching_type NOT NULL.
-- bin/pcn TEXT: leading zeros are data (law §6.3). Provenance per §6.4.

create table public.pbm_info (
  id uuid primary key default gen_random_uuid(),
  bin text not null,
  pbm_name text,
  pcn text,
  state text,
  email text,
  pbm_key text,                      -- column ships; derivation logic does NOT (Phase 5)
  matching_type text not null,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pbm_info enable row level security;

create trigger set_updated_at
  before update on public.pbm_info
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0013_user_data.sql
-- BIM-001 · 0013_user_data — the PHI fact table (prescription/dispensing records).
-- FRANK_API FULL column set (models.py:661-735 via FRANK_API-02 catalog;
-- TRIANGULATION §3.2: "Use FRANK_API's column set as canonical" — the demo's
-- 11-column subset would lose the audit trail). Ratified divergences:
--   · pcn, group_field, pbm_key, owed columns added   [manager §5 row 9 — the
--     pbm_key inputs the demo-era claims never carried, Format Map Finding 2]
--   · medicaid_method NULLable + CHECK on the seven MATH_SPEC §9 values;
--     the desktop's Path-A empty-string maps to NULL AT IMPORT (importer
--     mapping documented here, IMPLEMENTED in BIM-004); 'Portal' excluded
--     (commented-out code is not vocabulary); widening only via spec AC10's
--     amendment path              [Architect ruling 2026-08-28 — medicaid_method]
--   · business_id is uuid FK; "Never accept business_id from client; always
--     derive from authenticated session" (catalog models.py:672) — service-layer
--     law for BIM-005+, recorded at the schema for the reader.
-- Money NUMERIC everywhere a dollar lives (law §6.2). NDC/script/bin/pcn/
-- group_field TEXT (law §6.3). RLS policies are BIM-002's — none here.

create table public.user_data (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),

  -- claim identity + dispensing facts (source-file-driven)
  date_dispensed date,
  script text,                       -- Rx number, de-facto claim key (dedup key in upsert, catalog)
  drug_name text,
  drug_ndc text,
  qty numeric,
  insurance text,
  source_file text,
  status text,
  bin text,
  pcn text,                          -- pbm_key input [manager §5 row 9]
  group_field text,                  -- pbm_key input [manager §5 row 9]
  pbm_key text,                      -- canonical match key COLUMN; derivation is Phase 5's

  -- money (all NUMERIC, law §6.2)
  medicaid_rate numeric,
  acq numeric,
  acq_net numeric,
  difference numeric,
  total_paid numeric,
  payment numeric,                   -- check-payments concept (Format Map §4)
  new_paid numeric,
  expected_paid numeric,
  new_owed numeric,
  owed numeric,                      -- [manager §5 row 9]

  -- medicaid method: constrained vocabulary [Architect ruling 2026-08-28]
  medicaid_method text check (medicaid_method in
    ('AAC', 'FUL', 'GWAC', 'BWAC', 'Take Action', 'Manual Override', 'Legacy')),

  -- desktop-side enrichment (catalog verbatim)
  customer_name text,
  first_name text,
  last_name text,
  customer_id text,
  day_supply integer,
  authorization_number text,
  customer_group_number text,
  script_pcn text,
  compound text,
  drug_340b text,
  drug_preferred_vendor text,
  insurance_rejection_codes text,
  primary_network_reimbursement_id text,
  gpi text,
  nadac numeric,
  awp numeric,
  payer_type text,

  -- rate-recalc audit trail (catalog verbatim; the columns the demo lost)
  aac_date_used date,
  wac_date_used date,
  ful_year_used integer,
  ful_month_used integer,
  rate_source text,
  medicaid_rate_calculated_at timestamptz,
  medicaid_rate_original numeric,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_user_data_business_id on public.user_data (business_id);

alter table public.user_data enable row level security;

create trigger set_updated_at
  before update on public.user_data
  for each row execute function public.update_updated_at();


-- Approved source: supabase/migrations/0014_report_files.sql
-- BIM-001 · 0014_report_files — generated PDF report metadata, per business.
-- FRANK_API models.py:826-849; Phase 6 consumer, built now empty (manager §5
-- row 10). TRIANGULATION §3.6: "PDF report metadata. Storage path lives in
-- Supabase Storage" — the storage_path column points INTO the Phase-6 bucket;
-- no bucket is created here (law §6.8).
-- FIDELITY FLAG (spec'd in ACCEPTANCE evidence): the extraction does not
-- enumerate this table's exact catalog columns — shape below is the minimal
-- metadata set the corpora attest (file identity, business scoping, generator);
-- verify against models.py:826-849 verbatim when the source is staged, amend
-- via spec path if it differs.

create table public.report_files (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  file_name text,
  storage_path text,                 -- Supabase Storage object path (bucket is Phase 6's)
  report_type text,
  generated_by_user_id uuid references auth.users (id),
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_report_files_business_id on public.report_files (business_id);

alter table public.report_files enable row level security;

create trigger set_updated_at
  before update on public.report_files
  for each row execute function public.update_updated_at();


-- Final audit shape from 0028, created directly because audit_logs is absent.
-- Omit obsolete 0015 and the assertion/drop prefix of 0028.
create table public.audit_logs (
  id            bigint generated always as identity primary key,
  occurred_at   timestamptz not null default now(),
  actor_user_id uuid null,                       -- auth.uid(); NULL when the service role acts
  actor_role    text not null,                   -- JWT role claim; fallback current_user
  business_id   uuid null,                       -- from the row when the table has it; NULL per R-8
  table_name    text not null,
  row_id        text null,                       -- touched row's PK as text; NULL for page reads
  action        text not null check (action in ('insert', 'update', 'delete', 'read_page')),
  old_data      jsonb null,
  new_data      jsonb null,
  context       jsonb null
);

-- Brief §4: three indexes, no more.
create index idx_audit_logs_occurred_at       on public.audit_logs (occurred_at);
create index idx_audit_logs_business_occurred on public.audit_logs (business_id, occurred_at);
create index idx_audit_logs_table_row         on public.audit_logs (table_name, row_id);

-- R-6: immutability below RLS. Unconditional. Only a migration can drop this.
create or replace function public.audit_logs_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit_logs is append-only';
end;
$$;

create trigger audit_logs_immutable
  before update or delete on public.audit_logs
  for each row execute function public.audit_logs_immutable();

-- Row triggers never see TRUNCATE; this statement trigger closes that path for every role.
create trigger audit_logs_no_truncate
  before truncate on public.audit_logs
  for each statement execute function public.audit_logs_immutable();

-- R-1: RLS enabled AND forced (the table owner is not exempt). Policies: none here.
alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;

-- RF-3: tampering by a tenant or an anonymous caller is a privilege error, not a silent no-op.
revoke update, delete on public.audit_logs from anon, authenticated;


-- Approved source: supabase/migrations/0016_rls_helpers.sql
-- BIM-002 · 0016_rls_helpers — the membership helpers. Landing order law (F-8):
-- helpers precede every policy file in the chain.
--
-- Gap-6 (BIM-001 R-3, ratified): membership is read from public.user_businesses
-- ONLY. No helper or policy consults user_roles, profiles, user_metadata,
-- raw_user_meta_data, or accounts.owner_user_id. No superadmin clause exists in
-- OwedBook — platform oversight is the service-role path, audited by BIM-003.
--
-- SECURITY DEFINER is MANDATORY, not stylistic (Proto 06 FINDINGS F-5): these
-- functions read user_businesses, which itself carries RLS (0019 restricts each
-- user to their own rows). A SECURITY INVOKER helper would evaluate membership
-- through the caller's restricted view and silently collapse every policy in the
-- system to "can only see myself". search_path is pinned to '' with every
-- reference fully qualified, or the definer becomes its own privilege hole.
--
-- is_member_of / is_admin_of: verbatim from PROTO06 TRANSFERS §1.0 (proven on the
-- rig: 80-cell matrix, 32-case attack battery, twice from scratch).
-- is_account_member: NEW per Director ruling R-A (closes Proto 06 N-6) — account
-- read access is junction-derived, never derived from accounts.owner_user_id.

-- assert-then-create (manager §6.5): the tables these helpers read must exist
-- with RLS enabled before any membership logic is introduced.
do $$
begin
  if to_regclass('public.user_businesses') is null then
    raise exception 'BIM-002/0016 ASSERT FAILED: public.user_businesses missing. Apply chain 0001-0015 first.';
  end if;
  if to_regclass('public.businesses') is null then
    raise exception 'BIM-002/0016 ASSERT FAILED: public.businesses missing. Apply chain 0001-0015 first.';
  end if;
  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname in ('user_businesses','businesses')
      and c.relrowsecurity
    having count(*) = 2
  ) then
    raise exception 'BIM-002/0016 ASSERT FAILED: user_businesses and businesses must both have RLS enabled (deny-by-default law).';
  end if;
end $$;

-- T-1/T-2 membership: is the caller a junction member of this business?
create or replace function public.is_member_of(biz uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_businesses ub
    where ub.user_id = auth.uid() and ub.business_id = biz
  );
$$;

-- T-3 role gate: is the caller an ADMIN member of this business? The role comes
-- from the junction's own role column (TEXT CHECK 'admin'|'member', BIM-001 R-3).
create or replace function public.is_admin_of(biz uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_businesses ub
    where ub.user_id = auth.uid() and ub.business_id = biz and ub.role = 'admin'
  );
$$;

-- THE TENANT SELECT PREDICATE (formulation C, adopted at X2 by evidence).
-- Returns the caller's business ids as a set, so the planner evaluates it ONCE
-- and hashes it (plan: `Filter: (ANY (business_id = (hashed SubPlan 1).col1))`)
-- instead of calling a scalar helper once per candidate row.
--   measured at 100k rows: 29.6ms vs 1685ms for is_member_of(business_id)
--   — 57x faster unqualified, 31x qualified, 1,641 vs 101,640 buffers.
-- SECURITY DEFINER is what separates this from the inline-subquery formulation:
-- an inline `select ... from user_businesses where user_id = auth.uid()` inside a
-- policy is INVOKER-evaluated and is silently blinded by the junction's own RLS,
-- returning zero rows (proven at X2 — see evidence/X2_AB_DECISION.md §7).
-- Usage: using (business_id in (select public.my_business_ids()))
create or replace function public.my_business_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select ub.business_id from public.user_businesses ub where ub.user_id = auth.uid();
$$;

-- R-A account read: any user holding a junction row on ANY business under the
-- account. Reads businesses (which carries RLS), so F-5 applies here too.
create or replace function public.is_account_member(acct uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_businesses ub
    join public.businesses b on b.id = ub.business_id
    where ub.user_id = auth.uid() and b.account_id = acct
  );
$$;

-- DIVERGENCE from TRANSFERS §1.0 (authority: BIM-002 ERRATUM E-2, ratified
-- 2026-09-01): the template's `revoke ... from anon` is a NO-OP — Postgres grants
-- EXECUTE to PUBLIC by default and anon inherits it. PUBLIC is the mechanism; the
-- revoke must target it. Proto 06 missed this because its matrix asserted table
-- access, where anon was denied anyway, masking the grant.
-- BOTH revokes are required (authority: ERRATUM E-4). `from public` alone is
-- NOT sufficient: pg_default_acl for functions in this schema grants EXECUTE to
-- anon EXPLICITLY, so a freshly created function carries `anon=X` even after
-- PUBLIC is revoked. Two independent channels, two revokes. Verified by dropping
-- and re-creating these helpers from scratch (evidence:
-- X2_FINDING_fresh_create_anon_grant.log).
revoke execute on function public.is_member_of(uuid) from public;      -- ERRATUM E-2
revoke execute on function public.is_admin_of(uuid) from public;       -- ERRATUM E-2
revoke execute on function public.is_account_member(uuid) from public; -- ERRATUM E-2
revoke execute on function public.my_business_ids() from public;       -- ERRATUM E-2
revoke execute on function public.is_member_of(uuid) from anon;        -- ERRATUM E-4
revoke execute on function public.is_admin_of(uuid) from anon;         -- ERRATUM E-4
revoke execute on function public.is_account_member(uuid) from anon;   -- ERRATUM E-4
revoke execute on function public.my_business_ids() from anon;         -- ERRATUM E-4

grant execute on function public.is_member_of(uuid) to authenticated;
grant execute on function public.is_admin_of(uuid) to authenticated;
grant execute on function public.is_account_member(uuid) to authenticated;
grant execute on function public.my_business_ids() to authenticated;


-- Approved source: supabase/migrations/0017_rls_user_businesses.sql
-- BIM-002 · 0017 · user_businesses — T-5 junction self-visibility.
-- LANDS FIRST (junction-first law, X2 decision §5.1): every other tenant policy
-- reasons about membership, and formulation B (adopted nowhere, but guarded
-- against) would be silently blinded without this. Direct auth.uid() comparison,
-- never a helper — a helper here would be self-referential (Proto 06 F-7).
-- Writes stay service-role only: no INSERT/UPDATE/DELETE policy exists, which is
-- what makes junction role-tampering structurally impossible rather than merely
-- unlikely (Gap-6 / BIM-001 R-3).
do $$
begin
  if to_regclass('public.user_businesses') is null then
    raise exception 'BIM-002/0017 ASSERT: public.user_businesses missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.user_businesses'::regclass) then
    raise exception 'BIM-002/0017 ASSERT: RLS not enabled on user_businesses (deny-by-default law).'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0017 ASSERT: a SELECT policy already exists on user_businesses (one-per-op law).'; end if;
end $$;

create policy "ub_select_self"
  on public.user_businesses for select to authenticated
  using (user_id = auth.uid());


-- Approved source: supabase/migrations/0018_rls_accounts.sql
-- BIM-002 · 0018 · accounts — R-A: read-only, junction-derived.
-- Any user holding a junction row on ANY business under the account may read it.
-- NEVER derived from accounts.owner_user_id (Gap-6 forbids it, and ownership is
-- not membership). No INSERT/UPDATE/DELETE policy for any app role in v1 —
-- account writes are billing territory (Payment Portal → service role).
do $$
begin
  if to_regclass('public.accounts') is null then
    raise exception 'BIM-002/0018 ASSERT: public.accounts missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.accounts'::regclass) then
    raise exception 'BIM-002/0018 ASSERT: RLS not enabled on accounts.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='accounts') then
    raise exception 'BIM-002/0018 ASSERT: accounts already carries a policy.'; end if;
end $$;

create policy "account_select_member"
  on public.accounts for select to authenticated
  using (public.is_account_member(id));


-- Approved source: supabase/migrations/0019_rls_businesses.sql
-- BIM-002 · 0019 · businesses — T-1 read + T-3 role-gated write.
-- SELECT is created FIRST and the write SECOND, in this file, by law:
-- Proto 06 FINDINGS F-1 — Postgres evaluates an UPDATE's WHERE under SELECT-read
-- semantics, so a write policy on a table with no SELECT policy silently affects
-- zero rows. That defect is invisible at review time and indistinguishable from
-- a legitimate deny at runtime.
-- SELECT uses formulation C (X2, adopted by evidence): the set-returning DEFINER
-- helper is hashed once by the planner instead of invoked per row.
-- UPDATE keeps the scalar helper: write predicates resolve few rows, and the role
-- gate reads the junction's role column (Gap-6), never user_roles.
do $$
begin
  if to_regclass('public.businesses') is null then
    raise exception 'BIM-002/0019 ASSERT: public.businesses missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.businesses'::regclass) then
    raise exception 'BIM-002/0019 ASSERT: RLS not enabled on businesses.'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0019 ASSERT: junction-first law — user_businesses needs its SELECT policy (0017) before any tenant policy lands.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='businesses') then
    raise exception 'BIM-002/0019 ASSERT: businesses already carries a policy.'; end if;
end $$;

create policy "business_select_member"
  on public.businesses for select to authenticated
  using (id in (select public.my_business_ids()));

create policy "business_update_admin"
  on public.businesses for update to authenticated
  using (public.is_admin_of(id))
  with check (public.is_admin_of(id));


-- Approved source: supabase/migrations/0020_rls_subscriptions.sql
-- BIM-002 · 0020 · subscriptions — R-A mirror: account-scoped read.
-- Stripe state mirror, no secrets. Writes are webhook territory (service role).
-- Phase 7 may tighten this to admin-only — flagged in the manager, NOT decided here.
do $$
begin
  if to_regclass('public.subscriptions') is null then
    raise exception 'BIM-002/0020 ASSERT: public.subscriptions missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.subscriptions'::regclass) then
    raise exception 'BIM-002/0020 ASSERT: RLS not enabled on subscriptions.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='subscriptions') then
    raise exception 'BIM-002/0020 ASSERT: subscriptions already carries a policy.'; end if;
end $$;

create policy "subscription_select_account_member"
  on public.subscriptions for select to authenticated
  using (public.is_account_member(account_id));


-- Approved source: supabase/migrations/0021_rls_user_data.sql
-- BIM-002 · 0021 · user_data — the PHI fact table. Full T-1 + T-2 set.
-- Order in this file IS the law (F-1/F-8): SELECT, then INSERT, UPDATE, DELETE.
--
-- SELECT  — formulation C (X2): hashed once by the planner. At 100k rows this is
--           29.6 ms vs 1,685 ms for the per-row scalar helper.
-- INSERT  — WITH CHECK, never USING (the classic RLS authoring error). This is
--           what makes "business_id never comes from the client" a DATABASE
--           guarantee rather than a service-layer convention: a hand-supplied
--           foreign business_id fails with 42501.
-- UPDATE  — USING gates which rows are reachable; WITH CHECK gates what they may
--           BECOME, blocking a re-home of a row into a foreign business_id.
-- DELETE  — is_admin_of, not is_member_of: claim deletion is an admin act
--           (manager §5.2 row 9, Architect's call; STANDS per Director FLAG-6).
-- Writes keep the scalar helper deliberately: they resolve few rows, and write
-- legality must not depend on what the caller can SEE.
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-002/0021 ASSERT: public.user_data missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.user_data'::regclass) then
    raise exception 'BIM-002/0021 ASSERT: RLS not enabled on user_data.'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0021 ASSERT: junction-first law — 0017 must land first.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='user_data') then
    raise exception 'BIM-002/0021 ASSERT: user_data already carries a policy.'; end if;
end $$;

create policy "user_data_select_member"
  on public.user_data for select to authenticated
  using (business_id in (select public.my_business_ids()));

create policy "user_data_insert_member"
  on public.user_data for insert to authenticated
  with check (public.is_member_of(business_id));

create policy "user_data_update_member"
  on public.user_data for update to authenticated
  using (public.is_member_of(business_id))
  with check (public.is_member_of(business_id));

create policy "user_data_delete_admin"
  on public.user_data for delete to authenticated
  using (public.is_admin_of(business_id));


-- Approved source: supabase/migrations/0022_rls_report_files.sql
-- BIM-002 · 0022 · report_files — T-1 read only.
-- The Phase 6 PDF pipeline writes via service role; no write policy in v1.
-- Carries BIM-001's fidelity flag (columns never enumerated in the FRANK
-- catalog) — untouched here, rides to BIM-004/005.
do $$
begin
  if to_regclass('public.report_files') is null then
    raise exception 'BIM-002/0022 ASSERT: public.report_files missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.report_files'::regclass) then
    raise exception 'BIM-002/0022 ASSERT: RLS not enabled on report_files.'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0022 ASSERT: junction-first law — 0017 must land first.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='report_files') then
    raise exception 'BIM-002/0022 ASSERT: report_files already carries a policy.'; end if;
end $$;

create policy "report_files_select_member"
  on public.report_files for select to authenticated
  using (business_id in (select public.my_business_ids()));


-- Approved source: supabase/migrations/0023_rls_aac_reference.sql
-- BIM-002 · 0023 · aac_reference — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.aac_reference') is null then
    raise exception 'BIM-002/0023 ASSERT: public.aac_reference missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.aac_reference'::regclass) then
    raise exception 'BIM-002/0023 ASSERT: RLS not enabled on aac_reference.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='aac_reference') then
    raise exception 'BIM-002/0023 ASSERT: aac_reference already carries a policy.'; end if;
end $$;

create policy "aac_reference_select_authenticated"
  on public.aac_reference for select to authenticated
  using (true);


-- Approved source: supabase/migrations/0024_rls_wac_reference.sql
-- BIM-002 · 0024 · wac_reference — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.wac_reference') is null then
    raise exception 'BIM-002/0024 ASSERT: public.wac_reference missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.wac_reference'::regclass) then
    raise exception 'BIM-002/0024 ASSERT: RLS not enabled on wac_reference.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='wac_reference') then
    raise exception 'BIM-002/0024 ASSERT: wac_reference already carries a policy.'; end if;
end $$;

create policy "wac_reference_select_authenticated"
  on public.wac_reference for select to authenticated
  using (true);


-- Approved source: supabase/migrations/0025_rls_ful_reference.sql
-- BIM-002 · 0025 · ful_reference — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.ful_reference') is null then
    raise exception 'BIM-002/0025 ASSERT: public.ful_reference missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.ful_reference'::regclass) then
    raise exception 'BIM-002/0025 ASSERT: RLS not enabled on ful_reference.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='ful_reference') then
    raise exception 'BIM-002/0025 ASSERT: ful_reference already carries a policy.'; end if;
end $$;

create policy "ful_reference_select_authenticated"
  on public.ful_reference for select to authenticated
  using (true);


-- Approved source: supabase/migrations/0026_rls_pbm_info.sql
-- BIM-002 · 0026 · pbm_info — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.pbm_info') is null then
    raise exception 'BIM-002/0026 ASSERT: public.pbm_info missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.pbm_info'::regclass) then
    raise exception 'BIM-002/0026 ASSERT: RLS not enabled on pbm_info.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='pbm_info') then
    raise exception 'BIM-002/0026 ASSERT: pbm_info already carries a policy.'; end if;
end $$;

create policy "pbm_info_select_authenticated"
  on public.pbm_info for select to authenticated
  using (true);


-- Approved source: supabase/migrations/0027_rls_reference_dataset_versions.sql
-- BIM-002 · 0027 · reference_dataset_versions — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.reference_dataset_versions') is null then
    raise exception 'BIM-002/0027 ASSERT: public.reference_dataset_versions missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.reference_dataset_versions'::regclass) then
    raise exception 'BIM-002/0027 ASSERT: RLS not enabled on reference_dataset_versions.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='reference_dataset_versions') then
    raise exception 'BIM-002/0027 ASSERT: reference_dataset_versions already carries a policy.'; end if;
end $$;

create policy "reference_dataset_versions_select_authenticated"
  on public.reference_dataset_versions for select to authenticated
  using (true);


-- Approved source: supabase/migrations/0029_rls_audit_logs.sql
-- BIM-003-CYBER-PHARMA · 0029 · audit_logs — R-1: the ONE policy.
-- Junction ADMIN of the row's business may SELECT; member denied; no tenant INSERT,
-- UPDATE or DELETE policy exists (writes land only via the SECURITY DEFINER logging
-- functions or the service role; mutation is stopped below RLS by 0028's guard).
-- Reuses BIM-002's role-gated helper (TV-3: public.is_admin_of, 0016) — no new helper.
-- Rows with business_id NULL (R-8 platform/reference writes) are visible to no tenant:
-- is_admin_of(NULL) is false by construction.
do $$
begin
  if to_regclass('public.audit_logs') is null then
    raise exception 'BIM-003/0029 ASSERT: public.audit_logs missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0029 ASSERT: audit_logs is not in the 0028 shape — 0028 must land first.'; end if;
  if not (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.audit_logs'::regclass) then
    raise exception 'BIM-003/0029 ASSERT: RLS must be ENABLED and FORCED on audit_logs (0028).'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'is_admin_of') then
    raise exception 'BIM-003/0029 ASSERT: public.is_admin_of(uuid) missing — 0016 must land first.'; end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'audit_logs') then
    raise exception 'BIM-003/0029 ASSERT: audit_logs already carries a policy (one-per-op law).'; end if;
end $$;

create policy "audit_logs_select_admin"
  on public.audit_logs for select to authenticated
  using (public.is_admin_of(business_id));


-- Approved source: supabase/migrations/0030_audit_write.sql
-- BIM-003-CYBER-PHARMA · 0030 · audit_write() — the ONE write-audit trigger function (R-2).
-- Stamped AFTER INSERT OR UPDATE OR DELETE FOR EACH ROW on thirteen tables (0031-0043).
--
-- SECURITY DEFINER is mandatory: tenants hold no INSERT policy on audit_logs (R-1) and RLS
-- is FORCED there, so the insert must run as the function owner, whose BYPASSRLS carries it
-- (RISK-1 verified). search_path is pinned to '' and every reference is schema-qualified.
--
-- business_id (R-8 + the approved businesses special-case):
--   · the row's own business_id when the table carries that column
--   · businesses: the row's own id IS the business (0019's predicate uses id the same way)
--   · otherwise NULL, with the identifying key carried in context {id, account_id?}
-- actor_role: the JWT role claim when the write came through PostgREST/supabase-js
--   (authenticated / service_role / anon); the session role otherwise (e.g. postgres for a
--   direct connection). actor_user_id = auth.uid(), NULL when no user is behind the write.
-- old_data/new_data: to_jsonb(OLD)/to_jsonb(NEW) per action (Brief §3). Payloads ARE PHI and
-- are protected by R-1 (admin-only read) and R-6 (no mutation); redaction is Phase 8.

do $$
begin
  if to_regclass('public.audit_logs') is null then
    raise exception 'BIM-003/0030 ASSERT: public.audit_logs missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0030 ASSERT: audit_logs is not in the 0028 shape — 0028 must land first.'; end if;
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003/0030 ASSERT: public.audit_write() already exists — refusing to redefine outside a migration edit.'; end if;
end $$;

create function public.audit_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  j             jsonb;
  v_old         jsonb;
  v_new         jsonb;
  v_business_id uuid;
  v_context     jsonb;
  v_role        text;
begin
  if tg_op = 'DELETE' then
    j := to_jsonb(old);  v_old := j;              v_new := null;
  elsif tg_op = 'UPDATE' then
    j := to_jsonb(new);  v_old := to_jsonb(old);  v_new := j;
  else
    j := to_jsonb(new);  v_old := null;           v_new := j;
  end if;

  if tg_table_name = 'businesses' then
    v_business_id := (j ->> 'id')::uuid;
    v_context     := null;
  elsif j ? 'business_id' then
    v_business_id := (j ->> 'business_id')::uuid;
    v_context     := null;
  else
    v_business_id := null;                                              -- R-8
    v_context     := jsonb_strip_nulls(jsonb_build_object('id', j ->> 'id', 'account_id', j ->> 'account_id'));
  end if;

  v_role := coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    current_user::text
  );

  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values
    (auth.uid(), v_role, v_business_id, tg_table_name, j ->> 'id', lower(tg_op), v_old, v_new, v_context);

  return null;  -- AFTER trigger: the return value is ignored
end;
$$;

-- Both channels closed (BIM-002 E-2/E-4 law): PUBLIC's default EXECUTE and the schema's
-- explicit default-ACL grant to anon. Trigger firing never checks EXECUTE, so nothing
-- legitimate depends on either grant.
revoke execute on function public.audit_write() from public;
revoke execute on function public.audit_write() from anon;


-- Approved source: supabase/migrations/0031_audit_stamp_businesses.sql
-- BIM-003-CYBER-PHARMA · 0031 · audit stamp · businesses
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.businesses') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.businesses missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.businesses'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.businesses already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.businesses
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0032_audit_stamp_user_businesses.sql
-- BIM-003-CYBER-PHARMA · 0032 · audit stamp · user_businesses
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.user_businesses') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.user_businesses missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.user_businesses'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.user_businesses already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.user_businesses
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0033_audit_stamp_pending_registrations.sql
-- BIM-003-CYBER-PHARMA · 0033 · audit stamp · pending_registrations
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.pending_registrations') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.pending_registrations missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.pending_registrations'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.pending_registrations already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.pending_registrations
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0034_audit_stamp_user_data.sql
-- BIM-003-CYBER-PHARMA · 0034 · audit stamp · user_data
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.user_data'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.user_data already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.user_data
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0035_audit_stamp_report_files.sql
-- BIM-003-CYBER-PHARMA · 0035 · audit stamp · report_files
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.report_files') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.report_files missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.report_files'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.report_files already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.report_files
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0036_audit_stamp_accounts.sql
-- BIM-003-CYBER-PHARMA · 0036 · audit stamp · accounts
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.accounts') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.accounts missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.accounts'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.accounts already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.accounts
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0037_audit_stamp_subscriptions.sql
-- BIM-003-CYBER-PHARMA · 0037 · audit stamp · subscriptions
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.subscriptions') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.subscriptions missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.subscriptions'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.subscriptions already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.subscriptions
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0038_audit_stamp_apa_memberships.sql
-- BIM-003-CYBER-PHARMA · 0038 · audit stamp · apa_memberships
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.apa_memberships') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.apa_memberships missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.apa_memberships'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.apa_memberships already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.apa_memberships
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0039_audit_stamp_reference_dataset_versions.sql
-- BIM-003-CYBER-PHARMA · 0039 · audit stamp · reference_dataset_versions
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.reference_dataset_versions') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.reference_dataset_versions missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.reference_dataset_versions'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.reference_dataset_versions already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.reference_dataset_versions
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0040_audit_stamp_aac_reference.sql
-- BIM-003-CYBER-PHARMA · 0040 · audit stamp · aac_reference
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.aac_reference') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.aac_reference missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.aac_reference'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.aac_reference already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.aac_reference
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0041_audit_stamp_wac_reference.sql
-- BIM-003-CYBER-PHARMA · 0041 · audit stamp · wac_reference
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.wac_reference') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.wac_reference missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.wac_reference'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.wac_reference already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.wac_reference
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0042_audit_stamp_ful_reference.sql
-- BIM-003-CYBER-PHARMA · 0042 · audit stamp · ful_reference
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.ful_reference') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.ful_reference missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.ful_reference'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.ful_reference already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.ful_reference
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0043_audit_stamp_pbm_info.sql
-- BIM-003-CYBER-PHARMA · 0043 · audit stamp · pbm_info
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.pbm_info') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.pbm_info missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.pbm_info'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.pbm_info already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.pbm_info
  for each row execute function public.audit_write();


-- Approved source: supabase/migrations/0044_owedbook_kpis.sql
-- BIM-003-CYBER-PHARMA · 0044 · owedbook_kpis — read wrapper 1 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getKpis(filters) → OwedBookKpis (src/services/owedbook.ts:17,
-- src/types/OwedBook.ts:35-40). One row: commercial_underpaid · commercial_scripts ·
-- updated_difference · owed. Aggregates STORED user_data columns only (A-3): no rate math.
--   commercial_underpaid = sum(owed) where owed > 0      (mock: owedbook.ts:72-74)
--   commercial_scripts   = count(*)                      (mock: :77)
--   updated_difference   = sum(difference)               (mock: sum(updated_difference ?? 0), :78-80)
--   owed                 = commercial_underpaid           (mock: :81)
-- Shape rules (Brief §5): SECURITY DEFINER · search_path '' · first statement = membership
-- via my_business_ids() else RAISE 'not a member of business' · second = ONE read_page audit
-- row (R-7) · third = the read, with an explicit business_id fence (a DEFINER bypasses RLS —
-- the WHERE is the boundary). Filters mirror applyFilters (owedbook.ts:60-67):
--   from/to on date_dispensed · pbms on insurance (A-3: pbm ← insurance) · filter on status.
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0044 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0044 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0044 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_kpis' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0044 ASSERT: public.owedbook_kpis already exists.'; end if;
end $$;

create function public.owedbook_kpis(
  p_business_id uuid,
  p_from        date   default null,
  p_to          date   default null,
  p_pbms        text[] default '{}',
  p_filter      text   default null
)
returns table (
  commercial_underpaid numeric,
  commercial_scripts   bigint,
  updated_difference   numeric,
  owed                 numeric
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- 1. membership (R-4): junction membership via the DEFINER set helper; NULL is not a member
  if p_business_id is null or not (p_business_id in (select public.my_business_ids())) then
    raise exception 'not a member of business';
  end if;

  -- 2. log-then-return (R-7): exactly one read_page row per call
  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values (
    auth.uid(),
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user::text),
    p_business_id, 'user_data', null, 'read_page', null, null,
    jsonb_build_object(
      'fn',      'owedbook_kpis',
      'args',    jsonb_build_object('p_business_id', p_business_id, 'p_from', p_from, 'p_to', p_to,
                                    'p_pbms', to_jsonb(p_pbms), 'p_filter', p_filter),
      'filters', jsonb_build_object('from', p_from, 'to', p_to, 'pbms', to_jsonb(p_pbms), 'filter', p_filter)
    )
  );

  -- 3. the read — explicit tenant fence, stored columns only
  return query
    select
      round(coalesce(sum(ud.owed) filter (where ud.owed > 0), 0), 2)::numeric,
      count(*)::bigint,
      round(coalesce(sum(ud.difference), 0), 2)::numeric,
      round(coalesce(sum(ud.owed) filter (where ud.owed > 0), 0), 2)::numeric
    from public.user_data ud
    where ud.business_id = p_business_id
      and (p_from   is null or ud.date_dispensed >= p_from)
      and (p_to     is null or ud.date_dispensed <= p_to)
      and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
      and (p_filter is null or ud.status = p_filter);
end;
$$;

-- Both channels closed (E-2/E-4 law), then the one grant.
revoke execute on function public.owedbook_kpis(uuid, date, date, text[], text) from public;
revoke execute on function public.owedbook_kpis(uuid, date, date, text[], text) from anon;
grant  execute on function public.owedbook_kpis(uuid, date, date, text[], text) to authenticated;


-- Approved source: supabase/migrations/0045_owedbook_rows.sql
-- BIM-003-CYBER-PHARMA · 0045 · owedbook_rows — read wrapper 2 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getRows(tab, filters, page) → OwedBookPage (src/services/owedbook.ts:24,
-- src/types/OwedBook.ts:55-61). Returns the page ENVELOPE as jsonb — {rows, page, pageCount,
-- limit, total} — because an envelope is not a row set; each element of rows is an
-- OwedBookRow (OwedBook.ts:5-26) built from STORED user_data columns per the approved A-3 map:
--   id←id::text · date←date_dispensed · script · qty · pbm←insurance · status ·
--   original_paid←total_paid · medicaid_rate · method←medicaid_method · expected←expected_paid ·
--   owed · new_paid · updated_difference←difference ·
--   report_file, aac, federal_expected, federal_diff → NULL (Phase 5 joins/math; keys kept so
--   BIM-005's swap stays one line).
-- Tabs mirror owedbook.ts:89-93: commercial/summary = all · updated = new_paid is not null ·
-- federal = federal_expected is not null → empty in v1 (that field is NULL by A-3).
-- Pager mirrors owedbook.ts:95-98: pageCount = max(1, ceil(total/limit)); page clamped.
-- Order: date desc, then id (the fixtures are date-descending). DEFAULT_LIMIT = 25 (:55).
-- One read_page audit row per CALL regardless of page size (R-7, AC-208).
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0045 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0045 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0045 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_rows' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0045 ASSERT: public.owedbook_rows already exists.'; end if;
end $$;

create function public.owedbook_rows(
  p_business_id uuid,
  p_tab         text,
  p_from        date    default null,
  p_to          date    default null,
  p_pbms        text[]  default '{}',
  p_filter      text    default null,
  p_page        integer default 1,
  p_limit       integer default 25
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit      integer := greatest(coalesce(p_limit, 25), 1);
  v_req_page   integer := greatest(coalesce(p_page, 1), 1);
  v_total      bigint;
  v_page_count integer;
  v_page       integer;
  v_offset     integer;
  v_rows       jsonb;
begin
  -- 1. membership (R-4)
  if p_business_id is null or not (p_business_id in (select public.my_business_ids())) then
    raise exception 'not a member of business';
  end if;
  if p_tab is null or p_tab not in ('commercial_dollars', 'updated_commercial_payments', 'federal_dollars', 'summary') then
    raise exception 'unknown tab: %', p_tab;
  end if;

  -- 2. log-then-return (R-7): one row per call, not per row returned — and BEFORE any read
  --    (Brief §5). The row carries the REQUESTED page/limit/offset; the page actually served
  --    after clamping (owedbook.ts:95-98) is in the returned envelope.
  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values (
    auth.uid(),
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user::text),
    p_business_id, 'user_data', null, 'read_page', null, null,
    jsonb_build_object(
      'fn',      'owedbook_rows',
      'args',    jsonb_build_object('p_business_id', p_business_id, 'p_tab', p_tab, 'p_from', p_from, 'p_to', p_to,
                                    'p_pbms', to_jsonb(p_pbms), 'p_filter', p_filter, 'p_page', p_page, 'p_limit', p_limit),
      'page',    v_req_page,
      'limit',   v_limit,
      'offset',  (v_req_page - 1) * v_limit,
      'filters', jsonb_build_object('from', p_from, 'to', p_to, 'pbms', to_jsonb(p_pbms), 'filter', p_filter, 'tab', p_tab)
    )
  );

  -- 3. the read — pager arithmetic (owedbook.ts:95-98), then the page; explicit tenant fence
  select count(*) into v_total
  from public.user_data ud
  where ud.business_id = p_business_id
    and (p_from   is null or ud.date_dispensed >= p_from)
    and (p_to     is null or ud.date_dispensed <= p_to)
    and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
    and (p_filter is null or ud.status = p_filter)
    and (p_tab <> 'updated_commercial_payments' or ud.new_paid is not null)
    and (p_tab <> 'federal_dollars');                       -- federal_expected is NULL in v1 (A-3)
  v_page_count := greatest(1, ceil(v_total::numeric / v_limit)::integer);
  v_page       := least(v_req_page, v_page_count);
  v_offset     := (v_page - 1) * v_limit;

  -- OwedBookRow shape per A-3
  select coalesce(jsonb_agg(r.row_obj), '[]'::jsonb) into v_rows
  from (
    select jsonb_build_object(
             'id',                 ud.id::text,
             'date',               ud.date_dispensed,
             'script',             ud.script,
             'qty',                ud.qty,
             'pbm',                ud.insurance,
             'status',             ud.status,
             'report_file',        null::text,
             'original_paid',      ud.total_paid,
             'medicaid_rate',      ud.medicaid_rate,
             'method',             ud.medicaid_method,
             'expected',           ud.expected_paid,
             'owed',               ud.owed,
             'new_paid',           ud.new_paid,
             'updated_difference', ud.difference,
             'aac',                null::numeric,
             'federal_expected',   null::numeric,
             'federal_diff',       null::numeric
           ) as row_obj
    from public.user_data ud
    where ud.business_id = p_business_id
      and (p_from   is null or ud.date_dispensed >= p_from)
      and (p_to     is null or ud.date_dispensed <= p_to)
      and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
      and (p_filter is null or ud.status = p_filter)
      and (p_tab <> 'updated_commercial_payments' or ud.new_paid is not null)
      and (p_tab <> 'federal_dollars')
    order by ud.date_dispensed desc nulls last, ud.id
    offset v_offset limit v_limit
  ) r;

  return jsonb_build_object(
    'rows',      v_rows,
    'page',      v_page,
    'pageCount', v_page_count,
    'limit',     v_limit,
    'total',     v_total
  );
end;
$$;

revoke execute on function public.owedbook_rows(uuid, text, date, date, text[], text, integer, integer) from public;
revoke execute on function public.owedbook_rows(uuid, text, date, date, text[], text, integer, integer) from anon;
grant  execute on function public.owedbook_rows(uuid, text, date, date, text[], text, integer, integer) to authenticated;


-- Approved source: supabase/migrations/0046_owedbook_summary.sql
-- BIM-003-CYBER-PHARMA · 0046 · owedbook_summary — read wrapper 3 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getSummary(filters) → OwedBookSummaryRow[] (src/services/owedbook.ts:30,
-- src/types/OwedBook.ts:64-68): one row per PBM — commercial_dollars = sum(owed) where owed > 0
-- (mock :116), federal_dollars = sum(federal_diff) where > 0 (mock :117) → 0 in v1 because
-- federal_diff is NULL by A-3. Rows with no PBM are skipped (mock :113). Ordered by
-- commercial_dollars desc (mock :126). Rounded to 2 places (mock :122-125).
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0046 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0046 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0046 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_summary' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0046 ASSERT: public.owedbook_summary already exists.'; end if;
end $$;

create function public.owedbook_summary(
  p_business_id uuid,
  p_from        date   default null,
  p_to          date   default null,
  p_pbms        text[] default '{}',
  p_filter      text   default null
)
returns table (
  pbm                text,
  commercial_dollars numeric,
  federal_dollars    numeric
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- 1. membership (R-4)
  if p_business_id is null or not (p_business_id in (select public.my_business_ids())) then
    raise exception 'not a member of business';
  end if;

  -- 2. log-then-return (R-7)
  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values (
    auth.uid(),
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user::text),
    p_business_id, 'user_data', null, 'read_page', null, null,
    jsonb_build_object(
      'fn',      'owedbook_summary',
      'args',    jsonb_build_object('p_business_id', p_business_id, 'p_from', p_from, 'p_to', p_to,
                                    'p_pbms', to_jsonb(p_pbms), 'p_filter', p_filter),
      'filters', jsonb_build_object('from', p_from, 'to', p_to, 'pbms', to_jsonb(p_pbms), 'filter', p_filter)
    )
  );

  -- 3. the read — explicit tenant fence, grouped by PBM (insurance, A-3)
  return query
    select
      ud.insurance::text,
      round(coalesce(sum(ud.owed) filter (where ud.owed > 0), 0), 2)::numeric,
      0::numeric                                            -- federal_diff is NULL in v1 (A-3)
    from public.user_data ud
    where ud.business_id = p_business_id
      and ud.insurance is not null
      and (p_from   is null or ud.date_dispensed >= p_from)
      and (p_to     is null or ud.date_dispensed <= p_to)
      and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
      and (p_filter is null or ud.status = p_filter)
    group by ud.insurance
    order by 2 desc, 1;
end;
$$;

revoke execute on function public.owedbook_summary(uuid, date, date, text[], text) from public;
revoke execute on function public.owedbook_summary(uuid, date, date, text[], text) from anon;
grant  execute on function public.owedbook_summary(uuid, date, date, text[], text) to authenticated;


-- Approved source: supabase/migrations/0047_owedbook_pbm_options.sql
-- BIM-003-CYBER-PHARMA · 0047 · owedbook_pbm_options — read wrapper 4 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getPbmOptions() → string[] (src/services/owedbook.ts:37, :129-133):
-- distinct non-null PBM names, sorted. The service signature takes no filters; the wrapper
-- adds only the mandatory p_business_id (R-4). pbm ← insurance (A-3).
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0047 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0047 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0047 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_pbm_options' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0047 ASSERT: public.owedbook_pbm_options already exists.'; end if;
end $$;

create function public.owedbook_pbm_options(
  p_business_id uuid
)
returns setof text
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- 1. membership (R-4)
  if p_business_id is null or not (p_business_id in (select public.my_business_ids())) then
    raise exception 'not a member of business';
  end if;

  -- 2. log-then-return (R-7)
  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values (
    auth.uid(),
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user::text),
    p_business_id, 'user_data', null, 'read_page', null, null,
    jsonb_build_object(
      'fn',   'owedbook_pbm_options',
      'args', jsonb_build_object('p_business_id', p_business_id)
    )
  );

  -- 3. the read — explicit tenant fence
  return query
    select distinct ud.insurance::text
    from public.user_data ud
    where ud.business_id = p_business_id
      and ud.insurance is not null
    order by 1;
end;
$$;

revoke execute on function public.owedbook_pbm_options(uuid) from public;
revoke execute on function public.owedbook_pbm_options(uuid) from anon;
grant  execute on function public.owedbook_pbm_options(uuid) to authenticated;


-- Read-only verification must run in this SAME transaction next:
-- catalog SHA f83deb44e94e4f4ca8ac3168120477aebaef1cd8d7af3ae8644085c3c05e22ec;
-- exact preservation fingerprints; 14 newly created tables empty;
-- APBM ledger absent; native migration ledger unchanged.
-- NO APBM ledger initialization or 0048+ migration is included.
