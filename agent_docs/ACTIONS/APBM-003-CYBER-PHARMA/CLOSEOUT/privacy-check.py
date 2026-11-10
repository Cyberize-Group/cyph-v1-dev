#!/usr/bin/env python3
"""Read-only retention scan; reports paths/counts, never credentials or their hashes."""
import io,json,re,subprocess,sys,zipfile,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[4]
pack=root/'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA'
# dotenv's parser handles the repository's quoted values and trailing comments.
js="const fs=require('fs'),d=require('dotenv');const out={};for(const f of ['.env.local','.env.qa.local'])if(fs.existsSync(f))Object.assign(out,d.parse(fs.readFileSync(f)));process.stdout.write(JSON.stringify(out));"
env=json.loads(subprocess.check_output(['node','-e',js],cwd=root,text=True))
values=[v.encode() for k,v in env.items() if re.search(r'PASSWORD|SECRET|TOKEN|KEY|DB_URL|DB_POOL|CONNECTION_STR',k,re.I) and len(v)>=12]
cast=Path('/tmp/apbm003-dev-v2-cast-20261107T080333Z-1347924.json')
if cast.exists():
 for v in json.loads(cast.read_text()).get('identities',{}).values():
  if v.get('password'):values.append(v['password'].encode())
patterns=[rb'postgres(?:ql)?://[^\s:/]+:[^\s@]+@',rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',rb'sb_secret_[A-Za-z0-9_-]{20,}',rb'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}']
reviewed_fixture_sources={'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-baseline-bootstrap/static-checks.mjs': '4d45673b9374e6ceba2152e7f6c6f3086fbdcb28e8e057c224dd9e453e55a614', 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-bootstrap-execution/runner-tests.mjs': 'efc54d7e5eca920e06a84a0a1428018fc637648745ca6ed4267592d794db87a2', 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-executor-v2/tests.mjs': 'a9a73e8e85e06b9c835c96759a6828614a847ba6113be4cba3dc92c8b48147a5', 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/apply/dev-target-reconciliation/dev-fencing-test.mjs': '90852ca576bf391f7a2687869756e19291eec473deca808c93985ccddaf04931', 'agent_docs/ACTIONS/APBM-003-CYBER-PHARMA/EVIDENCE/E2/stage-0/fencing-test.mjs': '758e0190aadb7558f78f78086fb622b9252e815a6e2e6fcb7242337978e51ec4'}
hits=[];count=0;fixture_matches=0

def scan(label,data,depth=0):
 global count,fixture_matches
 count+=1
 if data.startswith(b'PK\x03\x04') and depth<3:
  with zipfile.ZipFile(io.BytesIO(data)) as z:
   for member in z.infolist():
    if not member.is_dir():scan(label+'!'+member.filename,z.read(member),depth+1)
  return
 known=any(v in data for v in values)
 selected=patterns
 if reviewed_fixture_sources.get(label)==hashlib.sha256(data).hexdigest():
  fixture_matches+=len(re.findall(patterns[0],data));selected=patterns[1:]
 if known or any(re.search(p,data) for p in selected):hits.append(label)
paths=[Path(x) for x in sys.argv[1:]] if len(sys.argv)>1 else [x for x in pack.rglob('*') if x.is_file() and '.git' not in x.parts]
for f in paths:
 if f.is_symlink():hits.append(str(f)+':SYMLINK_REVIEW_REQUIRED');continue
 scan(str(f.relative_to(root) if f.is_absolute() and f.is_relative_to(root) else f),f.read_bytes())
print(json.dumps({'filesAndArchiveMembersScanned':count,'knownCredentialSourcesPresent':'.env.qa.local' in [p.name for p in root.glob('.env.qa.local')],'reviewedSyntheticURLPatterns':fixture_matches,'hitCount':len(hits),'locations':hits,'scope':'Current known credential values plus password-URL/private-key/token patterns; no credential hashes retained'},indent=2))
sys.exit(1 if hits else 0)
