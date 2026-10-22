# Vibe journal

## 2026-10-22 — guest/frank-2026-10-22

**Aim:** Change the homepage "BOOK A DEMO" button label to "SCHEDULE A DEMO", keeping its link, styling and behavior unchanged.

**Changes:** `src/app/(public)/HomePageContent.tsx` — button text "Book a demo" → "Schedule a demo". The button's `uppercase` class renders it as "SCHEDULE A DEMO". The `#book-demo` link, icon, classes and component structure are unchanged.

**Blocked work:** None.

**Uncertainty:** Not previewed in a browser, and no automated checks (lint, tsc, test) were run, because dependencies were not installed at the guest's request. The `#book-demo` anchor id was intentionally left as is.

**Abandoned attempts:** None.
