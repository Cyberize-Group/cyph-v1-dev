import { cast, say, findUser, adminGet, sid } from './sb_lib.mjs'; import { dirMode } from './cast.mjs';
const out = { castOk: true, dirMode: dirMode(), domainsDistinctCount: new Set(Object.values(cast).map(e => e.split('@')[1])).size, users: {} };
for (const [role, email] of Object.entries(cast)) { const u = await findUser(email); if (!u) { out.users[role] = 'ABSENT'; continue; }
  const [roles, mem, acct] = await Promise.all([adminGet(`/rest/v1/user_roles?select=role&user_id=eq.${u.id}`), adminGet(`/rest/v1/user_businesses?select=role&user_id=eq.${u.id}`), adminGet(`/rest/v1/accounts?select=id&owner_user_id=eq.${u.id}`)]);
  out.users[role] = { id: sid(u.id), created: u.created_at?.slice(0, 10), lastSignIn: u.last_sign_in_at?.slice(0, 10) || null, confirmed: !!u.email_confirmed_at, hasPasswordIdentity: (u.identities || []).length, appMetaKeys: Object.keys(u.app_metadata || {}), userMetaKeys: Object.keys(u.user_metadata || {}), platformRoles: roles.body?.map(r => r.role) ?? `status ${roles.status}`, memberships: mem.body?.map(r => r.role) ?? `status ${mem.status}`, ownsAccounts: acct.body?.length ?? `status ${acct.status}` }; }
say(out);
