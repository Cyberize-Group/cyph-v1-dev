CODY — FROM THE DIRECTOR AND THE QA LEAD — standing preflight rule — 2026-11-16. Record verbatim in QAM_APPROVAL.md. Applies to this run and every later run in this module.

FIRST ACTION OF EVERY RUN, before any other work, within the first two minutes:
1. Both HEADs equal the bound pair.
2. Both apps are up on 3000 and 3001, and each served build is the bound commit's build.
3. The Stripe listener is running and its secret is EQUAL to the Portal's (in-memory comparison).
4. The private cast file is present, mode 600, expected keys filled.
5. DEV and SCRATCH reachable; ledgers 60/60.
6. Enough free disk for the run.

If any item the Director owns fails: STOP IMMEDIATELY and tell him in one short message: what is missing, the exact command or action to fix it, and "reply done when fixed". Do not start other work first. Do not bury it in a package. Re-run the preflight when he replies, then proceed.

If everything passes, say "preflight OK" in one line and run continuously under the existing rules.

If you are already past this point in the current run, do the preflight now, report the one-line result, and carry on.
