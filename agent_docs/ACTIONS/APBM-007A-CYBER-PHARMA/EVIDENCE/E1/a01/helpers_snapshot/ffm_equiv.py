# Read-only: compare PP HEAD (and working tree) against the FFM Gate Q 168-input manifest. Adapted from verify-commit-inputs.py (repo path parameterized).
from pathlib import Path
import hashlib,json,subprocess
repo=Path('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1')
manifest=repo/'agent_docs/ACTIONS/cyph_subscription_portal_phase1_ffm_abm/QAM/evidence/repair006/snapshot-input-manifest.json'
mh=hashlib.sha256(manifest.read_bytes()).hexdigest()
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
rows=json.loads(manifest.read_text())['files'];bad=[];wtbad=[]
for row in rows:
 p=subprocess.run(['git','show',sha+':'+row['path']],cwd=repo,capture_output=True)
 if p.returncode or hashlib.sha256(p.stdout).hexdigest()!=row['sha256']:bad.append(row['path'])
 f=repo/row['path']
 if not f.exists() or hashlib.sha256(f.read_bytes()).hexdigest()!=row['sha256']:wtbad.append(row['path'])
tracked=subprocess.check_output(['git','ls-tree','-r','--name-only',sha],cwd=repo,text=True).splitlines()
inputs={n for n in tracked if n.startswith(('src/','e2e/','public/')) or '/' not in n and not n.endswith('.md') and not n.startswith('.env')}
extra=sorted(inputs-{x['path'] for x in rows})
print(json.dumps({'commit':sha,'manifestSHA256':mh,'manifestExpected':mh=='f7181d3c7c537e27ebc43403c8727a39084aae723ba895cb89acf7622d56e9ab','inputs':len(rows),'headMismatchedOrMissing':bad,'workingTreeMismatched':wtbad,'additionalInputs':extra,'certificationGranted':False},indent=1))
