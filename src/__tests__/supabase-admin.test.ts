jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ admin: true })),
}));

import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/utils/supabase/admin';

// createAdminClient is the only reader of SUPABASE_SECRET_KEY. With the key no
// longer a boot requirement, this guard is the fail-closed point.

const createClientMock = createClient as jest.MockedFunction<typeof createClient>;
const TOUCHED_ENV = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY'] as const;
const FIXTURE_URL = 'https://fixture.invalid';
const FIXTURE_KEY = 'fixture-not-a-key';

describe('createAdminClient (fail-closed)', () => {
  let savedEnv: Record<string, string | undefined>;

  beforeEach(() => {
    savedEnv = Object.fromEntries(TOUCHED_ENV.map((key) => [key, process.env[key]]));
    // jest.setup.ts injects a placeholder secret; start every test without it.
    delete process.env.SUPABASE_SECRET_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = FIXTURE_URL;
  });

  afterEach(() => {
    for (const key of TOUCHED_ENV) {
      if (savedEnv[key] === undefined) delete process.env[key];
      else process.env[key] = savedEnv[key];
    }
  });

  it('throws when SUPABASE_SECRET_KEY is unset', () => {
    expect('SUPABASE_SECRET_KEY' in process.env).toBe(false);
    expect(() => createAdminClient()).toThrow('Missing Supabase admin credentials');
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it.each(['', '   ', '\t\n'])('throws when SUPABASE_SECRET_KEY is blank (%j)', (value) => {
    process.env.SUPABASE_SECRET_KEY = value;

    expect(() => createAdminClient()).toThrow('Missing Supabase admin credentials');
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it.each(['', '   '])('throws when NEXT_PUBLIC_SUPABASE_URL is blank (%j)', (value) => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = value;
    process.env.SUPABASE_SECRET_KEY = FIXTURE_KEY;

    expect(() => createAdminClient()).toThrow('Missing Supabase admin credentials');
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('creates the client when both values are present', () => {
    process.env.SUPABASE_SECRET_KEY = FIXTURE_KEY;

    createAdminClient();

    expect(createClientMock).toHaveBeenCalledWith(
      FIXTURE_URL,
      FIXTURE_KEY,
      expect.objectContaining({ auth: { autoRefreshToken: false, persistSession: false } }),
    );
  });
});
