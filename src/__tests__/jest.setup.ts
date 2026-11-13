process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'publishable-key';
process.env.SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 'service-role-key';
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
// APBM007A tooling fix (E1 baseline finding): the suite was written against mock data. Tests that exercise real
// mode set NEXT_PUBLIC_APBM_DATA_MODE themselves; everything else now runs in mock mode without an external flag.
process.env.NEXT_PUBLIC_APBM_DATA_MODE = process.env.NEXT_PUBLIC_APBM_DATA_MODE || 'mock';

jest.mock('next/navigation', () => ({
  redirect: jest.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
