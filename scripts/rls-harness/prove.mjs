#!/usr/bin/env node
// BIM-002 · rls-harness/prove.mjs — THE ONE COMMAND.  npm run rls:prove
//
//   wipe (F-6 order) → chain 0001–0027 → seed → AC8 (from-scratch, E-5)
//   → policy-check → matrix → scoping → attacks → revocation
//
// Exits non-zero the moment any stage fails. Writes one consolidated evidence
// file per run plus a NORMALISED twin (uuids and timestamps masked) so two runs
// can be diffed for real equivalence rather than eyeballed.
//
// All replay goes through the fenced APBM forward runner. DEV is rejected.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { evidencePath, assertScratch, safeLabel, loadEnv, harnessRoot, repoRoot } from "./lib/env.mjs";

// Phase label: names this run's evidence files. Defaults to X5 for the gate that
// introduced the command; X6 and later pass their own so cross-target runs are
// self-describing (BIM-002 X6 §6 — sub-logs previously inherited a hardcoded label).
//   node scripts/rls-harness/prove.mjs [phaseLabel]
const PHASE = safeLabel(process.argv[2] ?? "APBM");

const env = loadEnv();
assertScratch(env);
process.env.APBM_CAST_PASSWORD ??= randomBytes(24).toString("base64url");
if (process.env.APBM_ALLOW_DESTRUCTIVE !== env.projectRef) throw new Error("explicit SCRATCH destructive confirmation required");
const runTs = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
const out = [];
const say = (s) => { out.push(s); console.log(s); };

const H = (f) => join(harnessRoot, f);
const STAGES = [
  { name: "1/8 FENCED SCRATCH REPLAY", cmd: "node", args: [join(repoRoot, "scripts/apply-forward.mjs"), "scratch-reset", "--manifest", evidencePath("migration-inventory.json")],
    env: {} },
  { name: "2/8 SEED (cast + FK-safe reset)", cmd: "node", args: [H("seed.mjs")] },
  { name: "3/8 AC8 helper shape, FROM SCRATCH (E-5)", cmd: "node", args: [H("ac8-check.mjs")] },
  { name: "4/8 POLICY-CHECK (L1-L4)", cmd: "node", args: [H("policy-check.mjs")] },
  { name: "5/8 MATRIX (320 cells)", cmd: "node", args: [H("harness.mjs"), `${PHASE}-matrix`], env: { RLS_QUIET: "1" } },
  { name: "6/8 SCOPING (row-level)", cmd: "node", args: [H("scoping.mjs")] },
  { name: "7/8 ATTACK BATTERY", cmd: "node", args: [H("attacks.mjs")] },
  { name: "8/8 REVOCATION (R-C)", cmd: "node", args: [H("revocation.mjs")] },
];

say(`[rls:prove] full isolation proof from an empty scratch — ${runTs}`);
let failedAt = null;
let observedPolicies = null;
for (const s of STAGES) {
  say(`\n═══ ${s.name} ═══`);
  const r = spawnSync(s.cmd, s.args, { cwd: repoRoot, encoding: "utf8", env: { ...process.env, ...(s.env ?? {}) } });
  const text = ((r.stdout || "") + (r.stderr || "")).trimEnd();
  say(text);
  const policyCount=text.match(/total policies in public: (\d+)/);if(policyCount)observedPolicies=Number(policyCount[1]);
  if (r.status !== 0) { failedAt = `${s.name} (exit ${r.status})`; break; }
}

const verdict = failedAt
  ? `\n[rls:prove] ✗ FAILED at ${failedAt}`
  : `\n[rls:prove] ✓ ISOLATION PROVEN — chain + ${observedPolicies} observed policies + AC8 + four laws + 320 cells + scoping + 28 attacks + live-session revocation, from an empty database.`;
say(verdict);

const raw = out.join("\n") + "\n";
writeFileSync(evidencePath(`${PHASE}_prove_${runTs}.log`), raw);

// Normalised twin: mask uuids, timestamps and timings, so SAME-target run-to-run
// equivalence is a byte comparison rather than a judgement call.
const normalise = (s) => s
  .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "<uuid>")
  .replace(/\d{4}-\d{2}-\d{2}T\d{4,6}/g, "<ts>")
  .replace(/\d+(\.\d+)?\s?ms\b/g, "<ms>")
  .replace(/fingerprint \S+/g, "fingerprint <token>")
  .replace(/in \d+s\b/g, "in <s>s");
writeFileSync(evidencePath(`${PHASE}_prove_${runTs}.normalised.log`), normalise(raw));

// --compare-behaviour: for CROSS-TARGET comparison. Strips the env-source banner
// and the count of pre-existing identities purged (both are properties of the
// target, not of policy behaviour) — but NEVER the pooler host. Masking which
// database ran would make a cross-target diff look clean while destroying the one
// line that proves where it ran (BIM-002 X6 §4).
if (process.argv.includes("--compare-behaviour")) {
  const behavioural = normalise(raw)
    .split("\n")
    .filter((l) => !/^\[env\] .* fallback in use/.test(l))
    .map((l) => l.replace(/purged \d+ pre-existing auth\.users/, "purged <n> pre-existing auth.users"))
    .join("\n");
  writeFileSync(evidencePath(`${PHASE}_prove_${runTs}.behaviour.log`), behavioural);
  console.log(`[rls:prove] behaviour-only twin written (host line retained by design)`);
}

console.log(`[rls:prove] evidence → evidence/${PHASE}_prove_${runTs}.log (+ .normalised.log)`);
process.exit(failedAt ? 8 : 0);
