/** @jest-environment jsdom */
/**
 * ABM007_FINAL FINAL-01 / AC-F01 (unit part): "No permitted stores" appears only with zero permitted stores, never
 * beside selectable stores; "Loading stores…" only while loading. The selector shows exactly the stores it is given.
 */
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

const ctx = { stores: [] as { id: string; name: string }[], storeId: undefined as string | undefined, selectStore: jest.fn(), scopeLoading: false, scopeError: null as string | null, refresh: jest.fn() };
jest.mock("@/services/tenantScope", () => ({ isDemoMode: () => false }));
jest.mock("@/components/owedbook/OwedBookContext", () => ({ useOwedBook: () => ctx }));

import StoreSelector from "@/components/owedbook/StoreSelector";

const options = () => within(screen.getByRole("combobox", { name: "Store" })).queryAllByRole("option").map((o) => o.textContent);

describe("StoreSelector placeholder (AC-F01)", () => {
  beforeEach(() => Object.assign(ctx, { stores: [], storeId: undefined, scopeLoading: false, scopeError: null }));

  it("zero stores: only the 'No permitted stores' placeholder, disabled", () => {
    render(<StoreSelector />);
    expect(options()).toEqual(["No permitted stores"]);
    expect(screen.getByRole("combobox", { name: "Store" })).toBeDisabled();
  });

  it("one store: the store alone, no placeholder", () => {
    Object.assign(ctx, { stores: [{ id: "a", name: "Main Street Pharmacy" }], storeId: "a" });
    render(<StoreSelector />);
    expect(options()).toEqual(["Main Street Pharmacy"]);
  });

  it("several stores: exactly those stores, no placeholder", () => {
    Object.assign(ctx, { stores: [{ id: "a", name: "Main Street Pharmacy" }, { id: "b", name: "Riverside Pharmacy" }], storeId: "b" });
    render(<StoreSelector />);
    expect(options()).toEqual(["Main Street Pharmacy", "Riverside Pharmacy"]);
    expect(screen.queryByText("No permitted stores")).not.toBeInTheDocument();
  });

  it("loading: only 'Loading stores…'", () => {
    Object.assign(ctx, { scopeLoading: true });
    render(<StoreSelector />);
    expect(options()).toEqual(["Loading stores…"]);
  });
});
