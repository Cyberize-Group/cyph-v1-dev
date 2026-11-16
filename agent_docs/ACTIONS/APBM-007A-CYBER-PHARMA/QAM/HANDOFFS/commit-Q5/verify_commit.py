#!/usr/bin/env python3
"""Read-only verification of exact Q5 paths; never stages or commits."""
import argparse,hashlib,json,subprocess,zipfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--staged',action='store_true');args=p.parse_args()
meta=Path(__file__).resolve().parent;root=Path(subprocess.check_output(['git','-C',str(meta),'rev-parse','--show-toplevel'],text=True).strip());manifest=json.loads((meta/'COMMIT_MANIFEST.json').read_text());allowed=set((meta/'qa-pathspec.txt').read_text().splitlines());prefix='agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/'
def git(*a):return subprocess.check_output(['git','-C',str(root),*a],text=True).strip()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assert git('rev-parse','HEAD')==manifest['owedbook_HEAD'],'OB HEAD moved'
portal=Path(manifest['portal_root']);assert subprocess.check_output(['git','-C',str(portal),'rev-parse','HEAD'],text=True).strip()==manifest['portal_HEAD'],'Portal HEAD moved'
assert subprocess.check_output(['git','-C',str(portal),'diff','--name-only','HEAD'],text=True).strip()=='','Portal dirty'
assert not Path('/home/moose/.config/cyph/apbm007a-qa-cast.env').exists(),'Cast still exists'
assert all(x.startswith(prefix)and'..'not in Path(x).parts for x in allowed)
for row in manifest['files']:
 f=root/row['path'];assert f.is_file()and not f.is_symlink(),row['path']
 if row.get('sha256'):assert sha(f)==row['sha256'],'Changed: '+row['path']
assert (meta/'COMMIT_MANIFEST.json').relative_to(root).as_posix()in allowed
# Completed Q5 receipt is self-referential if hashed into the ZIP/manifest; verify its semantic hash instead.
receipt=json.loads((root/manifest['Q5_receipt']).read_text());archived=Path(receipt['archived_path']);assert sha(archived)==receipt['sha256'];assert sha(Path(receipt['downloads_copy']))==receipt['sha256']
with zipfile.ZipFile(archived)as z:assert z.testzip()is None
for f in (root/prefix/'HANDOFFS').glob('*.receipt.json'):
 r=json.loads(f.read_text())
 if r.get('archived_path'):assert sha(Path(r['archived_path']))==r.get('archive_sha256',r.get('sha256')),'Archive receipt mismatch'
assert not list((root/prefix/'HANDOFFS').glob('*.zip')),'Review ZIP left in repo'
changed=set(git('diff','--name-only','HEAD').splitlines());assert changed<=allowed,'Unexpected tracked change'
untracked=set(git('ls-files','--others','--exclude-standard',prefix).splitlines());assert untracked<=allowed,'Unlisted QA path'
if args.staged:
 staged=set(git('diff','--cached','--name-only').splitlines());assert staged<=allowed,'Outside staged scope'
 expected={x for x in allowed if git('status','--porcelain','--',x)};assert staged==expected,'Staged membership differs from changed exact pathspec'
print('PASS: r06 binding, exact QAM-only scope, file hashes, cast absence and archived ZIP receipts'+(' + staged membership'if args.staged else''))
