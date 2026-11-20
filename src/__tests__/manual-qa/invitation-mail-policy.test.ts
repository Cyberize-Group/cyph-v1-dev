// Manual QA 19 Nov 2026 (R10) — the OwedBook invitation path under the explicit DEV-only open policy: a plus-alias
// recipient goes through the normal claim → identity → Supabase Auth sign-in send; on any other project the guard blocks
// before any claim (no dispatch attempt consumed, no Auth call).
const mockRpc = jest.fn(async () => ({ data: { attempts_remaining: 4 }, error: null }));
const mockCreateUser = jest.fn(async () => ({ error: { status: 422, message: 'already registered' } }));
const mockOtp = jest.fn(async () => ({ error: null }));
jest.mock('@/server/db', () => ({ admin: () => ({
  from: () => { const q = { select: () => q, eq: () => q, maybeSingle: async () => ({ data: { email: 'moose+alpha01-member@cyberizegroup.com', status: 'pending' }, error: null }) }; return q; },
  rpc: mockRpc, auth: { admin: { createUser: mockCreateUser } },
}) }));
jest.mock('@supabase/supabase-js', () => ({ createClient: () => ({ auth: { signInWithOtp: mockOtp } }) }));
import { dispatchInvitation } from '@/server/invitationMail';

const env = { ...process.env };
afterEach(() => { process.env = { ...env }; jest.clearAllMocks(); });
const set = (url: string) => Object.assign(process.env, { MAIL_ALLOWLIST: '', MAIL_RECIPIENT_POLICY: 'open', NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test', NEXT_PUBLIC_APP_ENV: 'local' });

it('DEV/alpha project + open: plus alias is claimed and sent through Supabase Auth', async () => {
  set('https://yrsuwikjnbmvpznrgydb.supabase.co');
  expect(await dispatchInvitation('inv-1')).toEqual({ status: 'sent', attemptsRemaining: 4 });
  expect(mockRpc).toHaveBeenCalledWith('invitation_dispatch_claim', { p_invitation: 'inv-1' });
  expect(mockOtp).toHaveBeenCalledWith(expect.objectContaining({ email: 'moose+alpha01-member@cyberizegroup.com' }));
});
it('any other project + open: blocked before the claim; no attempt used and no Auth call', async () => {
  set('https://ihgcsrypblqkwommrkgj.supabase.co');
  expect(await dispatchInvitation('inv-1')).toEqual({ status: 'blocked', reason: 'blocked_not_allowlisted' });
  expect(mockRpc).not.toHaveBeenCalled(); expect(mockOtp).not.toHaveBeenCalled();
});
