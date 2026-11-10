-- Confirmed SCRATCH ihgcsrypblqkwommrkgj ONLY.
-- Execute through a provider-supported auth.users owner/sufficiently privileged path.
-- Current postgres role lacks table ownership, membership and SET ROLE permission.
-- No shared DEV change. No role grants or system-catalog changes are proposed.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';
CREATE INDEX idx_users_created_at_desc ON auth.users USING btree (created_at DESC);
CREATE INDEX idx_users_email ON auth.users USING btree (email);
CREATE INDEX idx_users_last_sign_in_at_desc ON auth.users USING btree (last_sign_in_at DESC);
CREATE INDEX idx_users_name ON auth.users USING btree (((raw_user_meta_data ->> 'name'::text))) WHERE ((raw_user_meta_data ->> 'name'::text) IS NOT NULL);
COMMIT;
