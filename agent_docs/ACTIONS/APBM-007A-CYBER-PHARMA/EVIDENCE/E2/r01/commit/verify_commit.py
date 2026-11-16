#!/usr/bin/env python3
# Checks a staged or committed change set against COMMIT_MANIFEST.json, path by path and blob by blob.
#   python3 verify_commit.py <owedbook|portal> <product|records> <staged|committed>
# Exit 0 only when the set of paths, the kind of change and every git blob id match exactly. Read-only.
import json, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
repo_key, kind, phase = sys.argv[1:4]
man = json.load(open(os.path.join(here, 'COMMIT_MANIFEST.json')))
r = man['repos'][repo_key]; repo = r['path']
expected = {e['path']: e for e in r[kind]}
if kind == 'records' and repo_key == 'owedbook':
    rel = os.path.relpath(here, repo)
    for n in sorted(os.listdir(here)): expected.setdefault(f'{rel}/{n}', {'path': f'{rel}/{n}', 'change': 'A', 'blob': None})   # this folder: present, not self-hashed
git = lambda *a: subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True, check=True).stdout
if phase == 'staged':
    rows = git('diff', '--cached', '--name-status', '--no-renames', '-z').split('\0')
    blob_of = lambda p: (git('ls-files', '-s', '--', p).split() or [None, None])[1]
else:
    rows = git('diff-tree', '--no-commit-id', '--name-status', '--no-renames', '-r', '-z', 'HEAD').split('\0')
    blob_of = lambda p: (git('ls-tree', 'HEAD', '--', p).split() or [None, None, None])[2]
    if kind == 'product' and git('rev-parse', 'HEAD~1').strip() != r['base']: sys.exit(f"FAIL: parent of HEAD is not the reviewed base {r['base']}")
rows = [x for x in rows if x]; actual = {rows[i + 1]: rows[i] for i in range(0, len(rows), 2)}
problems = []
for p in sorted(set(expected) - set(actual)): problems.append(f'missing   {p}')
for p in sorted(set(actual) - set(expected)): problems.append(f'unexpected {actual[p]} {p}')
for p, e in expected.items():
    if p not in actual: continue
    if actual[p] != e['change']: problems.append(f"change {actual[p]} != {e['change']}  {p}")
    elif e['change'] != 'D' and e.get('blob') and blob_of(p) != e['blob']: problems.append(f'blob mismatch  {p}')
if problems: print('\n'.join(problems[:60])); sys.exit(f'FAIL: {len(problems)} difference(s) for {repo_key} {kind} ({phase})')
print(f'OK: {repo_key} {kind} {phase} — {len(expected)} paths match the reviewed manifest exactly')
