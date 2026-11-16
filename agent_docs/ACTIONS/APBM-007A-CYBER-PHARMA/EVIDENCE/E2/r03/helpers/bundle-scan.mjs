// Counts client-bundle files containing any server-only secret VALUE or forbidden name. Prints counts only.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const SECRET_NAMES = ['SUPABASE_SECRET_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
const files = []; const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); });
walk('.next/static');
const text = files.map((f) => readFileSync(f, 'utf8'));
const count = (needle) => text.filter((t) => t.includes(needle)).length;
const out = { client_files: files.length };
for (const n of SECRET_NAMES) out[`value_of_${n}`] = process.env[n] ? count(process.env[n]) : 'not set';
for (const n of [...SECRET_NAMES, 'api.stripe.com', 'createAdminClient', 'service_role']) out[`name_${n}`] = count(n);
console.log(JSON.stringify(out, null, 1));
