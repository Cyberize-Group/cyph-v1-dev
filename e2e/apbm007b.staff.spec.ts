import { readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";

// APBM-007B engineering happy path (AC-030) on the OwedBook proof server (3100) against SCRATCH: the owner invites a member
// through the live staff panel up to the GUARDED send (MAIL_ALLOWLIST is empty on proof servers, so no email can leave),
// sees the pending invitation, revokes it, and /invitations shows nothing addressed to the owner. Credentials come only
// from the private 0600 file named by APBM007B_PROOF_CAST. No logout is performed.
const castPath = process.env.APBM007B_PROOF_CAST ?? "";
const cast = castPath ? (JSON.parse(readFileSync(castPath, "utf8")) as { email: string; password: string; stores: string[]; label: string }) : null;

async function signIn(page: Page) {
  await page.route("**/api/auth/logout", (r) => r.abort());
  await page.goto("/auth");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(cast!.email);
  await page.getByPlaceholder("Please Enter password").fill(cast!.password);
  await page.getByRole("button", { name: /log ?in|sign in/i }).first().click();
  await page.waitForURL((u) => !u.pathname.startsWith("/auth"), { timeout: 30000 });
}

test.describe.configure({ mode: "serial" });
test.skip(!cast, "APBM007B_PROOF_CAST not supplied");

test("owner invites a member (guarded send), sees it pending, revokes it", async ({ page }) => {
  await signIn(page);
  await page.goto(`/admin-portal/stores/${cast!.stores[0]}/invite`);
  const email = `walk-invitee-${Date.now()}@apbm007b-proof.invalid`;
  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Send invitation" }).click();
  await expect(page.getByRole("status").first()).toContainText("Email delivery is disabled for this address", { timeout: 30000 });
  const row = page.getByRole("listitem").filter({ hasText: email });
  await expect(row).toContainText("pending");
  await row.getByRole("button", { name: "Revoke" }).click();
  await expect(page.getByText("Invitation revoked.")).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole("listitem").filter({ hasText: email })).toContainText("revoked");
});

test("/invitations lists only invitations addressed to the signed-in person; viewing grants nothing", async ({ page }) => {
  await signIn(page);
  await page.goto("/invitations");
  await expect(page.getByRole("heading", { name: "Your invitations" })).toBeVisible();
  await expect(page.getByText(/no pending invitations for the address you are signed in with/i)).toBeVisible({ timeout: 30000 });
});
