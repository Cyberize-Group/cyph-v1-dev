import { register } from '@/instrumentation';

// Boot-time env validation (src/instrumentation.ts). SUPABASE_SECRET_KEY is not a
// boot requirement; the three public settings still fail closed.

const PUBLIC_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const;
const TOUCHED_ENV = [...PUBLIC_ENV, 'SUPABASE_SECRET_KEY'] as const;

function bootError(): string | null {
  try {
    register();
    return null;
  } catch (error) {
    return (error as Error).message;
  }
}

describe('register (boot-time env validation)', () => {
  let savedEnv: Record<string, string | undefined>;

  beforeEach(() => {
    savedEnv = Object.fromEntries(TOUCHED_ENV.map((key) => [key, process.env[key]]));
    // jest.setup.ts injects a placeholder secret; these tests need it absent.
    delete process.env.SUPABASE_SECRET_KEY;
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    for (const key of TOUCHED_ENV) {
      if (savedEnv[key] === undefined) delete process.env[key];
      else process.env[key] = savedEnv[key];
    }
    jest.restoreAllMocks();
  });

  it('boots with the three public settings and no SUPABASE_SECRET_KEY', () => {
    expect('SUPABASE_SECRET_KEY' in process.env).toBe(false);
    expect(bootError()).toBeNull();
    expect(console.log).toHaveBeenCalledWith('✓ Environment validated');
  });

  it.each(PUBLIC_ENV)('fails closed when %s is missing', (key) => {
    delete process.env[key];

    const message = bootError();
    expect(message).toContain(`  - ${key}`);
    expect(message).not.toContain('SUPABASE_SECRET_KEY');
  });

  it.each(PUBLIC_ENV)('fails closed when %s is whitespace-only', (key) => {
    process.env[key] = '   ';

    expect(bootError()).toContain(`  - ${key}`);
  });
});
