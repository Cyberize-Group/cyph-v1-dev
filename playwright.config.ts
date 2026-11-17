import { defineConfig, devices } from "@playwright/test";

// APBM-007B — OwedBook browser checks (authored in E2; OwedBook had a test:e2e script but no config or specs).
// The app under test is an OWNED `next start` on the proof port 3100 (scripts/apbm007b/proof-serve.mjs in the Portal
// repo); Playwright never starts or stops a server. System Chrome; traces/videos/screenshots off so no signed-in state
// or credential lands in output. No global sign-out fixture.
const baseURL = process.env.OB_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL, trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "apbm007b", testMatch: /apbm007b\..*\.spec\.ts/, use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "apbm007b-firefox", testMatch: /apbm007b\..*\.spec\.ts/, use: { ...devices["Desktop Firefox"] } },
    { name: "apbm007b-webkit", testMatch: /apbm007b\..*\.spec\.ts/, use: { ...devices["Desktop Safari"] } },
  ],
});
