// Runs the portal's SCRATCH integration test with the SCRATCH API settings supplied in memory only.
// Reads the named values from OwedBook's .env.local, checks the project reference, and never prints a value.
import { readFileSync } from 'node:fs'; import { spawnSync } from 'node:child_process';
const ROOT = '/home/moose/NEXTJS/CYBER_PHARMA'; const SCRATCH = 'ihgcsrypblqkwommrkgj';
const env = Object.fromEntries(readFileSync(`${ROOT}/cyph-v1-dev/.env.local`, 'utf8').split(/\r?\n/).map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].trim().replace(/^(['"])(.*)\1$/, '$2')]));
const url = env.APBM_SCRATCH_SUPABASE_URL || ''; if (new URL(url).hostname !== `${SCRATCH}.supabase.co`) throw new Error('STOP: not SCRATCH');
if (url === env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('STOP: SCRATCH equals the app project');
const r = spawnSync('npx', ['jest', '--testMatch', '**/src/integration/apbm007a-scratch.itest.ts', '--runInBand', '--verbose'], { cwd: `${ROOT}/cyph-payment-portal-dev-v1`, encoding: 'utf8', timeout: 600000,
  env: { ...process.env, APBM_ITEST_SCRATCH: SCRATCH, NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: env.APBM_SCRATCH_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY: env.APBM_SCRATCH_SECRET_KEY } });
const scrub = (s) => (s || '').replace(/sb_(secret|publishable)_[A-Za-z0-9_-]+/g, 'sb_$1_<REDACTED>').replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '<JWT>');
console.log(scrub(r.stdout)); console.log(scrub(r.stderr)); process.exitCode = r.status ?? 1;
