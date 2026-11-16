import os,subprocess,tarfile,io,json,time
from pathlib import Path
q=Path(__file__).resolve().parents[2]; e=q/'evidence/Q4/a02'; w=q/'AUTOMATION/Q4-a02'
roots={'portal':Path('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1')}
results={}
for name,root in roots.items():
 dst=w/('build-'+name);dst.mkdir(exist_ok=True)
 data=subprocess.check_output(['git','-C',str(root),'archive','4cd96c82da59a093d1330307f5a27836b17f1df5'])
 with tarfile.open(fileobj=io.BytesIO(data)) as t:
  members=[m for m in t.getmembers() if not m.name.startswith(('agent_docs/','.git')) and not any(p.startswith('.env') for p in Path(m.name).parts)]
  t.extractall(dst,members=members,filter='data')
 env={'PATH':os.environ['PATH'],'npm_config_cache':str(w/'.npm'),'NEXT_TELEMETRY_DISABLED':'1','CI':'1','NEXT_PUBLIC_SUPABASE_URL':'https://qa.invalid','NEXT_PUBLIC_SUPABASE_ANON_KEY':'placeholder','SUPABASE_SERVICE_ROLE_KEY':'placeholder','NEXT_PUBLIC_SITE_URL':'https://qa.invalid','NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY':'pk_test_placeholder','STRIPE_SECRET_KEY':'sk_test_placeholder','STRIPE_WEBHOOK_SECRET':'whsec_placeholder','NEXT_PUBLIC_APP_ENV':'local'}
 result={'head':subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True).strip(),'env_files':list(str(p.relative_to(dst)) for p in dst.glob('.env*')),'commands':[]}
 commands=[('install',['npm','ci','--ignore-scripts','--no-audit','--no-fund','--registry=https://registry.npmjs.org']),('typecheck',['./node_modules/.bin/tsc','--noEmit']),('lint',['npm','run','lint']),('unit',['npm','test','--','--runInBand']),('build',['npm','run','build'])]
 for label,cmd in commands:
  runenv=env.copy()
  if label!='install':runenv.update(NODE_OPTIONS='--require='+str(w/'network-guard.cjs'),QA_NETWORK_LOG=str(e/(name+'-network.jsonl')))
  with (e/(name+'-'+label+'.log')).open('w') as log:
   try:r=subprocess.run(cmd,cwd=dst,env=runenv,stdout=log,stderr=subprocess.STDOUT,timeout=300);code=r.returncode
   except subprocess.TimeoutExpired:code='TIMEOUT'
  result['commands'].append({'step':label,'command':cmd,'exit':code})
  results[name]=result;(e/'build_results.json').write_text(json.dumps(results,indent=2))
  if label=='install' and code!=0:break
