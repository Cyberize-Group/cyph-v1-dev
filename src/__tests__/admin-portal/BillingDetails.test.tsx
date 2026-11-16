/** @jest-environment jsdom */
// APBM007A U-2 — the owner's billing details in real mode. The read is public.owner_billing_overview (0060), the same
// owner-only, audited RPC the Payment Portal shows; the fixture below has exactly the subscription fields that function
// returns for a paid Stripe subscription (values synthetic). No network: the RPC client is a fake.
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BillingOwnerOnlyError, createAdminServices } from "@/services/adminDemo";
import BillingRow from "@/components/admin-portal/BillingRow";
import type { BillingLine } from "@/types/adminDemo";

const STORE = "11111111-1111-4111-8111-111111111111";
const OTHER_STORE = "33333333-3333-4333-8333-333333333333";
const ACCOUNT = "22222222-2222-4222-8222-222222222222";
const OTHER_ACCOUNT = "44444444-4444-4444-8444-444444444444";

// owner_billing_overview().subscription for a paid, active Stripe subscription (field set as in 0060).
const PAID = {
  id: "55555555-5555-4555-8555-555555555555", origin: "stripe", status: "active", raw_status: "active", quantity: 1,
  current_period_start: "2026-11-16T05:47:00+00:00", current_period_end: "2026-12-16T05:47:00+00:00",
  cancel_at: null, cancel_at_period_end: false, paid_through: "2026-12-16T05:47:00+00:00",
  latest_invoice_status: "paid", grace_started_at: null, verified_at: "2026-11-16T05:47:05+00:00",
};
const overview = (subscription: unknown, account_id = ACCOUNT) => ({ account_id, access: { state: "active", read_only: false }, subscription, stores: [] });

function client(sub: unknown, opts: { capability?: string; overviewAccount?: string } = {}) {
  const answers: Record<string, unknown> = {
    tenant_stores: [{ id: STORE, account_id: ACCOUNT, name: "Synthetic Main Street", capability: opts.capability ?? "owner" }],
    admin_stores: [{ id: STORE, name: "Synthetic Main Street", ncpdp: null, npi: "1234567893", status: "active", subscription_status: "active", member_count: 1 }],
    owner_billing_overview: overview(sub, opts.overviewAccount),
  };
  return { rpc: jest.fn(async (name: string) => ({ data: answers[name], error: null })) };
}
const previous = process.env.NEXT_PUBLIC_APBM_DATA_MODE;
beforeEach(() => { process.env.NEXT_PUBLIC_APBM_DATA_MODE = "real"; });
afterAll(() => { process.env.NEXT_PUBLIC_APBM_DATA_MODE = previous; });

const lineFor = async (sub: unknown, opts?: Parameters<typeof client>[1]) => {
  const c = client(sub, opts);
  const lines = await createAdminServices(c).billingService.listBilling();
  return { lines, c };
};
const rowText = (line: BillingLine) => {
  const { container, unmount } = render(<BillingRow line={line} />);
  const text = container.querySelector("p.text-\\[13px\\]")!.textContent;
  unmount();
  return text;
};

describe("U-2 — owner billing details from the owner's subscription", () => {
  it("a paid Stripe subscription shows its plan, the pharmacies covered and the next payment date", async () => {
    const { lines, c } = await lineFor(PAID);
    expect(lines).toEqual([{ storeId: STORE, storeName: "Synthetic Main Street", plan: "owedbook", coveredStores: 1, subscriptionStatus: "active",
      amountLabel: "Price shown in the billing portal", nextChargeDate: PAID.current_period_end }]);
    expect(rowText(lines[0])).toBe("OwedBook · 1 pharmacy · Price shown in the billing portal · Next payment Dec 16, 2026");
    expect(c.rpc.mock.calls.map(([n]) => n)).toEqual(["tenant_stores", "admin_stores", "owner_billing_overview"]);   // reads only
  });

  it("the row no longer reads 'Plan unavailable · Price unavailable · Billing dates unavailable' for a paid subscription", async () => {
    const { lines } = await lineFor(PAID);
    render(<BillingRow line={lines[0]} />);
    expect(screen.queryByText(/Plan unavailable/)).toBeNull();
    expect(screen.queryByText(/Billing dates unavailable/)).toBeNull();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it.each([
    ["a cancellation set for the period end", { cancel_at_period_end: true }, "Paid through Dec 16, 2026"],
    ["a cancellation set for a date", { cancel_at: "2026-12-01T00:00:00+00:00", paid_through: "2026-12-01T00:00:00+00:00" }, "Paid through Dec 1, 2026"],
    ["an ended subscription", { status: "canceled", raw_status: "canceled" }, "Paid through Dec 16, 2026"],
  ])("%s shows the date it is paid through, as the Portal does", async (_name, change, dates) => {
    const { lines } = await lineFor({ ...PAID, ...change });
    expect(rowText(lines[0])).toBe(`OwedBook · 1 pharmacy · Price shown in the billing portal · ${dates}`);
  });

  it("pharmacies are counted from the subscription quantity", async () => {
    const { lines } = await lineFor({ ...PAID, quantity: 3 });
    expect(rowText(lines[0])).toMatch(/^OwedBook · 3 pharmacies · /);
  });

  it("dates the row does not hold stay honestly unavailable; nothing is filled in", async () => {
    const { lines } = await lineFor({ ...PAID, current_period_end: null, paid_through: null, quantity: null });
    expect(lines[0].nextChargeDate).toBeUndefined();
    expect(lines[0].coveredStores).toBeUndefined();
    expect(rowText(lines[0])).toBe("OwedBook · Price shown in the billing portal · Billing dates unavailable");
  });

  it("no subscription: plan, price and dates are all unavailable", async () => {
    const { lines } = await lineFor(null);
    expect(lines[0]).toMatchObject({ plan: "unavailable", amountLabel: "Price unavailable", subscriptionStatus: "unavailable" });
    expect(rowText(lines[0])).toBe("Plan unavailable · Price unavailable · Billing dates unavailable");
  });

  it("a synthetic seed subscription is labelled as such and shows no price or dates", async () => {
    const { lines } = await lineFor({ ...PAID, origin: "synthetic_seed", raw_status: null, quantity: null, latest_invoice_status: null });
    expect(lines[0]).toMatchObject({ plan: "synthetic", amountLabel: "Not billed" });
    expect(lines[0].nextChargeDate).toBeUndefined();
    expect(rowText(lines[0])).toBe("Synthetic test subscription · Not billed · No billing dates");
  });

  it("a store of another account never shows this account's subscription", async () => {
    const { lines } = await lineFor(PAID, { overviewAccount: OTHER_ACCOUNT });
    expect(lines[0]).toMatchObject({ storeId: STORE, plan: "unavailable", amountLabel: "Price unavailable" });
    expect(OTHER_STORE).not.toBe(STORE);
  });

  it("a store admin who is not the owner still gets the plain statement and no billing read", async () => {
    const c = client(PAID, { capability: "admin" });
    await expect(createAdminServices(c).billingService.listBilling()).rejects.toBeInstanceOf(BillingOwnerOnlyError);
    expect(c.rpc.mock.calls.map(([n]) => n)).toEqual(["tenant_stores"]);
  });

  it("billing actions stay unavailable in real mode (read-only)", async () => {
    const { lines } = await lineFor(PAID);
    render(<BillingRow line={lines[0]} />);
    expect(screen.getByRole("button", { name: "Manage payment", hidden: true })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel", hidden: true })).toBeDisabled();
  });
});
