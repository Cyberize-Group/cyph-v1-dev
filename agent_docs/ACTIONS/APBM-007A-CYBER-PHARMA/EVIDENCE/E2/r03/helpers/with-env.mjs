// Runs a command with the portal's DEV settings loaded in-process from the repo's own env file (never copied,
// printed or written), with the local origin pointed at the proof port. Usage: node with-env.mjs <cmd> [args...]
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { loadEnvConfig } = require('@next/env');
const { combinedEnv } = loadEnvConfig('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1', false, { info() {}, error() {} });
const env = { ...process.env, ...combinedEnv, NEXT_PUBLIC_SITE_URL: 'http://localhost:3101', NEXT_PUBLIC_APP_ENV: 'local', NEXT_TELEMETRY_DISABLED: '1' };
const [cmd, ...args] = process.argv.slice(2);
const r = spawnSync(cmd, args, { stdio: 'inherit', env });
process.exit(r.status ?? 1);
