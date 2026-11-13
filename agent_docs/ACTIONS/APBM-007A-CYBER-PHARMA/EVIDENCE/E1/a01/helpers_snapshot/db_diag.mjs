// Offline structural diagnosis of the DB URL. No connection. Prints shapes and booleans only.
import { readFileSync } from 'node:fs'; import { ROOT, DEV_REF } from './lib.mjs';
const line = readFileSync(`${ROOT}/cyph-v1-dev/.env.local`, 'utf8').split(/\r?\n/).filter(l => /^\s*APBM_DEV_DB_URL\s*=/.test(l));
const raw = line[0].replace(/^\s*APBM_DEV_DB_URL\s*=\s*/, ''); const v = raw.trim().replace(/^["']|["']$/g, '');
const o = { definitions: line.length, quoted: /^["']/.test(raw.trim()), trailingWhitespace: raw !== raw.trimEnd(), carriageReturn: /\r/.test(raw), containsSpace: /\s/.test(v), inlineHash: v.includes('#'), bracketsLeft: /[\[\]<>]/.test(v), atSigns: (v.match(/@/g) || []).length, scheme: v.split('://')[0] };
try { const u = new URL(v); const pw = u.password, dec = (() => { try { return decodeURIComponent(pw); } catch { return null; } })();
  Object.assign(o, { hostShape: u.hostname.replace(/[a-z0-9]{20}/, '<ref>').replace(/aws-\d+-[a-z0-9-]+/, 'aws-<n>-<region>'), port: u.port, path: u.pathname, userShape: u.username.replace(DEV_REF, '<DEV_REF>').replace(/[a-z0-9]{20}/, '<other-ref>'), userHasDevRef: u.username.includes(DEV_REF), passwordLength: dec?.length ?? pw.length, passwordPercentEncoded: /%[0-9A-Fa-f]{2}/.test(pw), passwordDecodeFails: dec === null, passwordHasCharsNeedingEncoding: /[^A-Za-z0-9\-._~%]/.test(pw), passwordLooksLikePlaceholder: /YOUR|PASSWORD|\[|\]/i.test(dec || pw), query: [...u.searchParams.keys()] }); } catch (e) { o.urlParse = 'FAILED'; }
console.log(JSON.stringify(o, null, 1));
