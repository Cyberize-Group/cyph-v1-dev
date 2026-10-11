# Startup banner boxes + Director launch-check evidence

**Date:** 2026-10-10 14:53 (+06) · **Branch:** `pilot-setup` @ `f865ecd` (committed startup-rules checkpoint `f865ecdd37a5f15a7f355a20bcc341643604016f`)
**Brief:** Director-approved "startup banner update and evidence recording"
**Status:** COMPLETE. The work is **uncommitted**.

## 1. Banner update

`CLAUDE.md` now has 4 ASCII-bordered boxes in place of the plain banners:

| § | Box heading | Notes |
| --- | --- | --- |
| §1 step 3 | WORKFLOW SELECTION REQUIRED | The question plus options 1 and 2. Adds "The choice selects instructions, not permissions." |
| §2 | GUEST PROPOSAL WORKFLOW | Same text, wrapped |
| §3 | FACTORY ENGINEERING SELECTED - SETUP REQUIRED | Same text, wrapped. The em dash is now an ASCII hyphen. Includes "Guest mode." |
| §4 | FACTORY ENGINEERING ACTIVE | Same text. Includes "Guest mode." |

I also added one sentence to §1: show every box exactly as written, inside a code block, so the borders stay aligned. Plain ASCII, no color.

The workflow decisions, their order and the permission wording are unchanged. Only how the banners look changed.

**Checks:**
- Every box line is exactly 60 columns (8 border lines, 4 boxes) ✅
- The boxes are ASCII only, with no ANSI and no Unicode ✅
- Blank rows inside each box, and blank lines outside it within the code fence ✅
- No other non-historical doc quotes the old banners ✅
- `FACTORY_SESSION_SETUP.md` has no banner examples, so it is **unchanged** ✅
- The sha256 of `CLAUDE.eng.md`, `CLAUDE.local.md` and `.gitignore` is unchanged ✅
- The temporary clone was not touched ✅

This session loaded the *previous* `CLAUDE.md`. **The boxes have not been shown live yet.**

## 2. Director-provided observations (not executed by this agent)

The Director reported these observations from live sessions. This agent did not run them and has not verified them independently. They were made against the startup rules committed at `f865ecd`, **before** the boxes above existed.

| ID | Setup | Observed (Director) |
| --- | --- | --- |
| A | Original factory clone, `CLAUDE.local.md` present | A fresh session displayed FACTORY ENGINEERING ACTIVE and wrote its session and response records. |
| B | Temporary clone `/tmp/cyph-guest-startup-20261010` (no local file) | Saying only "hi" made the workflow question appear. |
| C | Same clone, option 2 selected | It displayed SETUP REQUIRED, explained the manual setup and paused. The AI said it would not create or edit the local file. |
| D | Same session, "Guest mode" | It cancelled the pending factory setup, displayed the guest workflow and paused because `vibe_docs/` is missing. It reported that no files were changed and refused to invent a kit or substitute factory protocols. |

## 3. Remaining live checks (not demonstrated)

1. **Filesystem verification** for C and D: confirm on disk that the temporary clone has no new or changed files, in particular no `CLAUDE.local.md`. So far only the AI's own statement covers this.
2. **Return-to-guest with the local file present:** "Guest mode" in a factory session should pause, and the user should be told to move the file out and start a fresh session.
3. **Cursor behavior** (or any non-Claude-Code tool) with the shared entry.
4. **Completed guest onboarding.** This is blocked until the `vibe_docs/` kit is installed.
5. **The new boxes rendered live** (factory active, the question, setup required, guest) in fresh sessions.

Not all launch checks are complete.

## 4. Files changed

- `CLAUDE.md`: the four banners are now boxes, plus one presentation sentence
- `agent_docs/SESSIONS/session_2026-10-10.md`: session 4 entries and observations A–D
- `RECOVERY.md`: new top block for the current pilot status
- `CHANGELOG.md`: new entry
- `agent_docs/RESPONSES/response_2026-10-10_145357_banner-boxes-evidence.md`: this report

Preserved without edits: the session 3 entry and `response_2026-10-10_142050_startup-check.md`.
