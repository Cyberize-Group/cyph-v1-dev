/** @jest-environment jsdom */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ResultsToolbar from "@/components/owedbook/ResultsToolbar";
import type { OwedBookPage } from "@/types/OwedBook";

const result = (page: number, total: number): OwedBookPage => ({
  page, total, limit: 25, pageCount: Math.ceil(total / 25),
  rows: Array.from({ length: Math.max(0, Math.min(25, total - (page - 1) * 25)) }, () => ({} as OwedBookPage["rows"][number])),
});

it.each([
  [1, 50, "Showing 1–25 of 50 claims", true, false],
  [2, 50, "Showing 26–50 of 50 claims", false, true],
  [2, 31, "Showing 26–31 of 31 claims", false, true],
  [1, 0, "Showing 0 of 0 claims", true, true],
])("reports the real range and navigation boundaries for page %s / total %s", (page, total, text, previousDisabled, nextDisabled) => {
  const previous = jest.fn(), next = jest.fn();
  render(<ResultsToolbar results={result(page, total)} onPrevious={previous} onNext={next} />);
  expect(screen.getByRole("navigation", { name: "Results pagination" })).toHaveTextContent(text);
  expect(screen.getByText("25 claims per page")).toBeInTheDocument();
  expect(screen.getByText(total ? `Page ${page} of ${Math.ceil(total / 25)}` : "No pages")).toBeInTheDocument();
  const prevButton = screen.getByRole("button", { name: "Previous page" });
  const nextButton = screen.getByRole("button", { name: "Next page" });
  expect(prevButton).toHaveProperty("disabled", previousDisabled);
  expect(nextButton).toHaveProperty("disabled", nextDisabled);
  fireEvent.click(prevButton); fireEvent.click(nextButton);
  expect(previous).toHaveBeenCalledTimes(previousDisabled ? 0 : 1);
  expect(next).toHaveBeenCalledTimes(nextDisabled ? 0 : 1);
});
