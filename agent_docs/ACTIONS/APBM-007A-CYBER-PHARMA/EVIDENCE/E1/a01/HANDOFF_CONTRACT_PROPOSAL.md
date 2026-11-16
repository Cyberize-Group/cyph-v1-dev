# Handoff SQL and API contract — E1 a01 final proposal

Proposal for the post-E1 architecture review. Nothing here is frozen, applied or implemented. **The SQL below is draft text for review only**; no migration file exists and nothing was run against DEV or SCRATCH. This document completes and supersedes `CONTRACT_DELTA.md` §1.2–§1.5; where the two differ, this one is the proposal.

Evidence it rests on: `CAPABILITY_RESULTS.md` §3 (session primitive), §3a (rapid sequential exchanges), §4 (collisions, F-A2), §5 (cookies), §6 (logout, F-A4–F-A6), `DB_CHECK_RESULTS.md` §7 (`auth.sessions` readable by a `postgres`-owned definer function, not by `service_role`).

## 1. What is proved and what is not

| | Status |
|---|---|
| Minting a session for an existing user by ID-loaded `generateLink` + `verifyOtp`, sign-up disabled, no email | Proved (prototype) |
| Four such exchanges for one user in 4.6 seconds, alternating two separate per-app cookie jars, no throttle, no session lost | Proved (prototype, `auth_p7_result.json`) |
| Overlapping exchanges for one user: one fails | Proved (F-A2) |
| Provider-wide sign-out makes `getUser()` reject at once | Proved (F-A4) |
| The routes, code table, claim/complete functions, restart and switch pages below | **Not built. Not proved.** E2 work |

The prototype exercised the provider primitive from a script. No app route, no code table and no browser took part. It is not an implemented handoff.

## 2. Flow

`D` is the destination app (where the user is going), `S` the source app (where the user is signed in). Both directions use the same flow.

1. **D `/api/handoff/start`** creates `state` and `verifier` (32 random bytes each, base64url), stores them with `attempt` (1 or 2) and the return path in D's transient httpOnly cookie, and redirects to S `/api/handoff/authorize` with `state`, `challenge = base64url(sha256(verifier))`, `dest`, `return`, `attempt`, and `hint` when D already holds a session (§5).
2. **S `/api/handoff/authorize`** calls `getUser()`. Signed out: redirect to S's sign-in with a bounded return. Signed in: evaluate `hint`; if a code is warranted, call `handoff_issue` and redirect to D `/api/handoff/callback?code&state`.
3. **D `/api/handoff/callback`** compares `state` with its cookie, then calls `handoff_claim` with the code hash, the verifier from its cookie, the state hash, its own app ID and environment.
4. **D mints** the session in request memory (§4), then calls `handoff_complete`.
5. Only if `handoff_complete` returns `ok` does D write its session cookie, clear the transient cookie and redirect to the return path.

No provider token is stored or sent through the browser. The browser carries only `state`, `challenge`, the opaque `code` and the equality `hint`.

## 3. Draft SQL (review text only)

The table sits in a schema the data API does not expose. The functions are in `public` so the server key can call them, with EXECUTE for `service_role` only. All are `SECURITY DEFINER`, owned by `postgres`, with a fixed `search_path`.

```sql
-- DRAFT FOR REVIEW. Not a migration. Not applied anywhere.
create schema if not exists handoff;
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
  return_path        text        not null check (return_path ~ '^/[A-Za-z0-9/_-]*$'),
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
revoke all on handoff.codes from public, anon, authenticated;

-- Issue. Called by the source after getUser(). Subject and session come from the verified token, never from request input.
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
```

How the draft meets each required property:

| Requirement | Where |
|---|---|
| Explicit destination verifier validation | `handoff_claim` recomputes the S256 challenge from the verifier and requires equality |
| Atomic single redemption | One `UPDATE … WHERE claimed_at IS NULL`; the row lock lets one concurrent caller win, the other re-reads and matches nothing |
| Invalid browser binding or verifier must not consume a valid code | State, verifier, audience and environment are in the same `WHERE`; a mismatch updates nothing |
| Logout before claim | `handoff_invalidate_user` marks the code; the source-session check also fails |
| Logout after claim, before session creation completes | `handoff_complete` fails; no cookie is written (§4 step 6) |
| Reuse, expiry | `claimed_at IS NULL`, `expires_at > now()` |

Open points in the draft, for the review: retention (proposed: delete rows older than 24 hours in the issue function, 1 call in 100); whether to count failed claims (proposed: no; the code is 256 bits and a counter would be a write on the failure path); the per-IP callback limit from the earlier draft is dropped because it needs a shared store and adds nothing against a 256-bit code. The schema default privileges (F-D4) do not reach the `handoff` schema, but the explicit revokes stay.

## 4. Session mint at the destination

1. `handoff_claim` returns `claimed` with the subject. Anything else: generic expired page (§6).
2. If D already holds a live session (`getUser()` on D's cookie): same user → call `handoff_complete(claim, existing session id)` and redirect, no mint. Different user → `handoff_fail(claim, 'switch_required')` and show the switch page (§5).
3. Load the subject by ID with the admin API. Absent → `handoff_fail(claim, 'mint_failed')`.
4. `generateLink({type:'magiclink', email: <loaded user's email>})`. Require the returned user ID to equal the subject (F-A1).
5. `verifyOtp` on a **non-persisting** server client, so nothing reaches the cookie yet. Require the session's user ID to equal the subject; otherwise provider-wide sign-out of that user, `handoff_fail(claim, 'subject_mismatch')`.
6. `handoff_complete(claim, new session id)`. On `revoked`: provider-wide sign-out for the subject (the user has just logged out, so this is what they asked for), write no cookie, show the signed-out page.
7. On `ok`: set the session on D's cookie-bound client under D's own cookie name, clear the transient cookie, `303` to the return path.
8. Provider error or timeout at step 4 or 5: `handoff_fail(claim, 'mint_failed')`, then the restart rule (§6). The code is never made reusable.

**Logout after claim but before completion, case by case.** Logout runs `handoff_invalidate_user` and then the provider-wide sign-out.

| Logout lands | Result |
|---|---|
| Before the claim | Claim rejected |
| After the claim, before the mint | The code is marked `logout`; the mint may still succeed (F-A6); `handoff_complete` returns `revoked`; D signs the subject out and writes no cookie |
| After the mint, before `handoff_complete` | The provider sign-out removes the new session too; `handoff_complete` returns `revoked` |
| After `handoff_complete` | The new session already exists at the provider, so the provider-wide sign-out removes it; D's cookie holds a dead session and the next `getUser()` rejects it |
| Sign-out from elsewhere (Mission Control, another device) without our function | The source session row is gone, so claim or complete fails on the `auth.sessions` check |

In no ordering does a session minted by a handoff outlive the logout. The direct data-API residual (F-A5, up to 3600 seconds on an already issued token) is unchanged and is stated, not fixed.

## 5. A different user already signed in at the destination

The destination tells the source who it already has, without revealing the identity:

- At `/start`, if D's `getUser()` succeeds, D adds `hint = base64url(sha256(user_id || state))`.
- At `/authorize`, S computes the same value from its own user and the received `state`.

| Destination has | Source does | Destination then |
|---|---|---|
| No session | Issues a code | Normal flow |
| The same user | Issues no code; redirects to callback with `result=same_user` and `state` | Verifies its own session with `getUser()`, goes to the return path |
| A different user | Issues no code; redirects with `result=switch_required` and `state` | Switch page |

The switch page says which account is signed in here and offers two deliberate choices: stay as the current account, or continue as the account from the other app. The second is a POST with a CSRF token that clears D's cookie and local-scope signs out D's session, then starts a new handoff with no hint. Nothing is replaced silently, and no code is consumed to find this out.

The callback repeats the check after a claim (§4 step 2), because the destination's session can change between start and callback.

`result=same_user` and `result=switch_required` are bound to `state`, so they cannot be replayed into another browser, and neither grants anything: D always re-checks its own session.

## 6. Collision: one fresh automatic restart, then clear recovery

A mint can fail because another link token for the same user was issued in the same moment (F-A2): two tabs crossing together, or a sign-in email requested mid-handoff. Sequential crossings do not collide (§3a of the capability results).

- `attempt` travels in D's transient cookie and is recorded on the code.
- Mint failure on attempt 1: D redirects to its own `/start` with the same return path and `attempt=2`. That creates new state, a new verifier and a new code. It happens once, with no user action.
- Mint failure on attempt 2, or any rejected claim: no further automatic redirect. The recovery page offers two actions: "Try again" (a new attempt-1 flow started by the user) and "Sign in here by email". If the provider answers 429 to the email request (F-A3), the page shows "wait a minute and try again".
- The per-user issue limit (10 per minute) bounds a user who reloads repeatedly.

Public failure pages are generic and do not say which check failed. The reason is recorded on the code row for the operator.

## 7. Existing users — no assumption that the purchaser is signed out

| Purchaser's state | Behaviour |
|---|---|
| New address, signed out | Provisioning creates the identity with the admin create call, sends one access email with a sign-in link. No handoff precedes it |
| Existing identity, signed out | Neutral public response; the purchase attaches only after the person proves control by signing in (emailed link **or password**, §8). No second account |
| Existing identity, signed in to the portal while purchasing | The purchase attaches to the signed-in owner. **No sign-in link is emailed**; the confirmation email is a plain notice with an ordinary app address. Crossing to OwedBook uses the handoff |
| Existing identity, signed in to OwedBook only | The portal's protected routes start a handoff from OwedBook before the purchase page |
| Signed in at the destination as someone else | Switch page (§5) |
| Signed in at both apps as the same user | `same_user`; no mint |

The earlier statement in `CONTRACT_DELTA.md` §1.4 that the first access email cannot collide "because the owner is not signed in anywhere" holds only for a new, signed-out purchaser. For a signed-in existing user the design avoids the collision by not sending a tokened link at all.

## 8. Password login is preserved

- Both apps keep `POST /api/auth/login` (`signInWithPassword`) and their password forms. The Director verified APBM003 password login on OwedBook on 12 November.
- The handoff mint does not read, set or reset a password. `generateLink` of type `magiclink` leaves the stored password hash untouched.
- Provisioning creates new owners without a known password; they sign in by emailed link. A provisioning retry must not reset an existing user's password.
- The cookie-name change applies to password sessions too, so a password sign-in lands in the same per-app cookie as a link sign-in.
- Regression (E2 acceptance): seeded-cast password sign-in in each app after the cookie change; password sign-in still works for a user who has crossed apps by handoff; sign-out after password sign-in is provider-wide like any other.

## 9. API summary

| Route | Method | Input | Success | Failures |
|---|---|---|---|---|
| `/api/handoff/start` | GET | `return`, optional `attempt` (own redirects only) | 302 to peer `/authorize` | 400 `invalid_return` |
| `/api/handoff/authorize` | GET | `state`, `challenge`, `dest`, `return`, `attempt`, optional `hint` | 302 to peer `/callback` with `code` or `result` | 302 to sign-in when signed out; 400 `invalid_request`; 429 `slow_down` |
| `/api/handoff/callback` | GET | `state`, and `code` or `result` | 303 to `return` | Restart once (attempt 1 mint failure); switch page; recovery page; signed-out page |
| `/api/handoff/switch` | POST | CSRF token, `return` | 303 to `/api/handoff/start` | 403 |
| `/api/auth/logout` | POST | — | 200 after `handoff_invalidate_user` and provider sign-out | 502 with an honest retry state |
| `/api/auth/login` | POST | email, password | Unchanged | Unchanged |
| `/api/auth/confirm` | GET | `token_hash`, `type`, `next` | Unchanged; `next` restricted to an allowlist | Unchanged |

All handoff routes: `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, exact peer origin from configuration, relative return paths from an allowlist, no query values in logs.

## 10. Tests E2 must add for this contract

Wrong verifier, wrong state, wrong audience and wrong environment each leave the code claimable by the right caller afterwards. Two concurrent correct claims: exactly one wins. Expired and reused codes fail. Logout at each of the five points in §4. Different-user and same-user destination cases. Forced mint failure: one automatic restart, then the recovery page on the second failure. Password sign-in regression. The five functions are not executable by `anon` or `authenticated`, and the table is unreachable through the data API.
