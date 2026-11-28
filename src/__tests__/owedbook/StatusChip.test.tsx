/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusChip from "@/components/owedbook/StatusChip";

// Intent: each OwedBook status maps to its semantic status token through the ABM007_FINAL pill recipe (word, status
// border and tint; brand contract 3.4); null reads as an em dash.
describe("StatusChip", () => {
  it("renders recovered as a success-token chip", () => {
    const { container } = render(<StatusChip status="recovered" />);
    expect(screen.getByText("Recovered")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("pb-pill", "pb-tone-success");
  });

  it("renders underpaid as a destructive-token chip", () => {
    const { container } = render(<StatusChip status="underpaid" />);
    expect(screen.getByText("Underpaid")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("pb-pill", "pb-tone-destructive");
  });

  it("renders emailed_pbm as an info-token chip with a humanized label", () => {
    const { container } = render(<StatusChip status="emailed_pbm" />);
    expect(screen.getByText("Emailed PBM")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("pb-pill", "pb-tone-info");
  });

  it("renders an em dash for null status", () => {
    render(<StatusChip status={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
