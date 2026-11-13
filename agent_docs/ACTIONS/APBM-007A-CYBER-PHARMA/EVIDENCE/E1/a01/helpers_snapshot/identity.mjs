// Read-only identity proof. Prints presence/classes/refs only.
import { loadApp, fileMode, say, apiRef, sqlRef, keyClass, DEV_REF, SCRATCH_REF } from './lib.mjs';
const ob = loadApp('ob'), pp = loadApp('pp');
const row = (app, e, names) => Object.fromEntries(names.map(n => [n, n.endsWith('_URL') ? (n.includes('DB_URL') ? (e[n] ? `present sqlRef=${sqlRef(e[n])} host=${(()=>{try{const h=new URL(e[n]).hostname;return h.includes('pooler')?'pooler':'direct'}catch{return '?'}})()} port=${(()=>{try{return new URL(e[n]).port}catch{return '?'}})()}` : 'ABSENT') : (e[n] ? `present apiRef=${apiRef(e[n])}` : 'ABSENT')) : keyClass(e[n])]));
say({ fileModes: { ob: fileMode('ob'), pp: fileMode('pp') },
  ob: row('ob', ob, ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SECRET_KEY','APBM_DEV_DB_URL','APBM_DEV_SUPABASE_URL','APBM_DEV_PUBLISHABLE_KEY','APBM_DEV_SECRET_KEY','APBM_SCRATCH_DB_URL','APBM_SCRATCH_SUPABASE_URL','APBM_SCRATCH_PUBLISHABLE_KEY','APBM_SCRATCH_SECRET_KEY']),
  pp: row('pp', pp, ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SECRET_KEY','STRIPE_SECRET_KEY','NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY','STRIPE_WEBHOOK_SECRET']),
  compare: {
    appUrlEqual: ob.NEXT_PUBLIC_SUPABASE_URL === pp.NEXT_PUBLIC_SUPABASE_URL,
    appPublishableEqual: ob.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY === pp.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    appSecretEqual: !!ob.SUPABASE_SECRET_KEY && ob.SUPABASE_SECRET_KEY === pp.SUPABASE_SECRET_KEY,
    obAppIsDEV: apiRef(ob.NEXT_PUBLIC_SUPABASE_URL) === DEV_REF, ppAppIsDEV: apiRef(pp.NEXT_PUBLIC_SUPABASE_URL) === DEV_REF,
    obAppIsSCRATCH: apiRef(ob.NEXT_PUBLIC_SUPABASE_URL) === SCRATCH_REF,
    devBlockMatchesApp: ob.APBM_DEV_SUPABASE_URL ? ob.APBM_DEV_SUPABASE_URL === ob.NEXT_PUBLIC_SUPABASE_URL : 'n/a',
    devSecretEqualsAppSecret: ob.APBM_DEV_SECRET_KEY ? ob.APBM_DEV_SECRET_KEY === ob.SUPABASE_SECRET_KEY : 'n/a',
  } });
