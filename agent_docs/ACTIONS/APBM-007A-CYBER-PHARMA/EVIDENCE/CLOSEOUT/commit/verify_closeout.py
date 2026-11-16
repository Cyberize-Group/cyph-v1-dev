#!/usr/bin/env python3
"""APBM-007A closeout verifier. Run from the repository root.

usage: verify_closeout.py <owedbook|portal> <staged|committed|merged|pushed>

  staged     HEAD is the reviewed base; the staged set is exactly the manifest (paths, change kind, blob);
             nothing else is modified or untracked.
  committed  HEAD is one closeout commit on the base with exactly the manifest; tree clean.
  merged     main is a two-parent merge: first parent the pre-merge main, second parent the closeout commit,
             and its tree equals the closeout commit's tree (no byte of the certified-plus-accepted line changed).
  pushed     origin/main equals the local merge, contains the QA head, and the tree is clean. Prints full SHAs.
"""
import hashlib, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "COMMIT_MANIFEST.json")


def git(*args, check=True):
    r = subprocess.run(["git", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        fail(f"git {' '.join(args)}: {r.stderr.strip()}")
    return r.stdout.strip()


def ok(cond):
    return cond


def fail(msg):
    print(f"VERIFY FAIL: {msg}")
    sys.exit(1)


def is_ancestor(a, b):
    return subprocess.run(["git", "merge-base", "--is-ancestor", a, b]).returncode == 0


def name_status(*args):
    raw = git("diff", "--no-renames", "--name-status", "-z", *args)
    rows = [x for x in raw.split("\0") if x]
    return {rows[i + 1]: rows[i] for i in range(0, len(rows), 2)}


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("owedbook", "portal") or sys.argv[2] not in ("staged", "committed", "merged", "pushed"):
        fail(__doc__)
    repo, mode = sys.argv[1:]
    raw = open(MANIFEST, "rb").read()
    man = json.loads(raw)["repos"][repo]
    print(f"manifest sha256 {hashlib.sha256(raw).hexdigest()}  repo {repo}  mode {mode}")
    top = git("rev-parse", "--show-toplevel")
    if os.path.basename(top) != man["dir_name"]:
        fail(f"run from the {man['dir_name']} repository (got {top})")
    expected = {e["path"]: e for e in man["paths"]}
    self_paths = set(man["self_paths"])           # checked by name only: they describe themselves
    want = {**{p: e["change"] for p, e in expected.items()}, **{p: "A" for p in self_paths}}
    base = man["base"]
    for c in man["certified"]:
        if not is_ancestor(c, "HEAD"):
            fail(f"certified commit {c} is not an ancestor of HEAD")

    def check_blobs(rev_of):
        for p, e in expected.items():
            got = rev_of(p)
            if got != e["blob"]:
                fail(f"blob differs for {p}: {got} != {e['blob']} (edited after the manifest was made?)")

    if mode == "staged":
        if git("branch", "--show-current") != man["branch"]:
            fail(f"not on {man['branch']}")
        if git("rev-parse", "HEAD") != base:
            fail(f"HEAD is not the reviewed base {base}")
        staged = name_status("--cached", "HEAD")
        if staged != want:
            fail(f"staged set differs: extra {sorted(set(staged) - set(want))} missing {sorted(set(want) - set(staged))} "
                 f"kind {sorted(p for p in staged if p in want and staged[p] != want[p])}")
        check_blobs(lambda p: git("rev-parse", f":{p}"))
        if git("diff", "--name-only"):
            fail("unstaged tracked changes exist")
        if git("ls-files", "--others", "--exclude-standard"):
            fail("untracked files exist")
        print(f"OK staged: {len(want)} paths ({len(self_paths)} self-described), blobs match")

    elif mode == "committed":
        head = git("rev-parse", "HEAD")
        if git("rev-parse", "HEAD^") != base or git("rev-list", "--count", f"{base}..HEAD") != "1":
            fail(f"HEAD is not a single commit on {base}")
        if name_status(base, "HEAD") != want:
            fail("committed set differs from the manifest")
        check_blobs(lambda p: git("rev-parse", f"HEAD:{p}"))
        if git("status", "--porcelain", "--untracked-files=all"):
            fail("working tree not clean")
        print(f"OK committed: closeout commit {head} on {base}; tree clean")

    else:
        qa = git("rev-parse", f"refs/heads/{man['branch']}")
        if git("rev-parse", f"{qa}^") != base or name_status(base, qa) != want:
            fail(f"{man['branch']} is not the verified closeout commit on {base}")
        main_ref = "refs/heads/main" if mode == "merged" else "refs/remotes/origin/main"
        m = git("rev-parse", main_ref)
        parents = git("rev-list", "--parents", "-n", "1", m).split()[1:]
        if len(parents) != 2 or parents[1] != qa:
            fail(f"{main_ref} {m} is not a two-parent merge of {man['branch']} ({qa})")
        if not is_ancestor(parents[0], qa):
            fail("first parent is not an ancestor of the QA head: main had diverged")
        if git("rev-parse", f"{m}^{{tree}}") != git("rev-parse", f"{qa}^{{tree}}"):
            fail("merged tree differs from the QA head tree")
        if git("status", "--porcelain", "--untracked-files=all"):
            fail("working tree not clean")
        if mode == "merged":
            if git("branch", "--show-current") != "main":
                fail("not on main")
            print(f"OK merged (not pushed): merge {m}; first parent {parents[0]}; second parent {qa}; tree equal")
        else:
            local = git("rev-parse", "refs/heads/main")
            if local != m:
                fail(f"local main {local} != origin/main {m}")
            if not is_ancestor(qa, m):
                fail("QA head not contained in origin/main")
            print("OK pushed")
            print(f"  repo                 {repo}")
            print(f"  qa/apbm-007a head    {qa}   (closeout commit)")
            print(f"  main before merge    {parents[0]}")
            print(f"  merge commit         {m}")
            print(f"  local main           {local}")
            print(f"  origin/main          {m}")
            print(f"  merge tree           {git('rev-parse', m + '^{tree}')}   (equals the QA head tree)")
            for c in man["certified"]:
                print(f"  certified contained  {c}")


if __name__ == "__main__":
    main()
