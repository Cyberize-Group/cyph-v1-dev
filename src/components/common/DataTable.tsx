"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export type SemanticColor = "success" | "destructive" | "foreground";

export interface ColumnDef<TRow extends Record<string, unknown>> {
  key: Extract<keyof TRow, string>;
  label: string;
  align?: "left" | "right";
  numeric?: boolean;
  hero?: boolean;
  semanticColor?: (row: TRow, value: unknown) => SemanticColor;
  format?: (value: unknown, row: TRow) => string;
  /**
   * Custom cell renderer for non-text cells (e.g. the status chip). Takes
   * precedence over `format`/`semanticColor`. The returned node owns its own
   * styling — use for badges/chips that a formatted string can't express.
   */
  render?: (row: TRow) => ReactNode;
}

export interface DataTableProps<TRow extends Record<string, unknown>> {
  columns: ColumnDef<TRow>[];
  rows: TRow[];
  sort?: { key: string; direction: "asc" | "desc" };
  onSort?: (key: string) => void;
  emptyState?: ReactNode;
  getRowKey?: (row: TRow, index: number) => string | number;
}

const colorClass = (color: SemanticColor | undefined) => {
  if (color === "success") return "text-success";
  if (color === "destructive") return "text-destructive";
  return "text-foreground";
};

export function DataTable<TRow extends Record<string, unknown>>({
  columns,
  rows,
  sort,
  onSort,
  emptyState,
  getRowKey,
}: DataTableProps<TRow>) {
  const heroColumn = useMemo(() => columns.find((c) => c.hero), [columns]);

  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <div data-testid="datatable-desktop" className="pb-card hidden md:block overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-muted text-muted-foreground">
            <tr>
              {columns.map((col) => {
                const isSorted = sort?.key === col.key;
                const sortIcon = !onSort ? null : !isSorted ? (
                  <ChevronsUpDown className="inline h-3 w-3 ml-1" />
                ) : sort.direction === "asc" ? (
                  <ChevronUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="inline h-3 w-3 ml-1" />
                );
                return (
                  <th
                    key={col.key}
                    onClick={onSort ? () => onSort(col.key) : undefined}
                    className={`border-b border-border px-3 py-2.5 text-[13px] uppercase font-medium tracking-[0.04em] ${
                      col.align === "right" ? "text-right" : "text-left"
                    } ${onSort ? "cursor-pointer select-none" : ""}`}
                    aria-sort={
                      isSorted
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    {/* Keyboard access (R-010): a native button, only when sortable.
                        No handler of its own — its click (incl. Enter/Space
                        activation) bubbles to the <th> onClick, so sort fires once. */}
                    {onSort ? (
                      <button
                        type="button"
                        className="inline-flex min-h-8 items-center rounded-sm uppercase font-medium tracking-[0.04em]"
                      >
                        {col.label}
                        {sortIcon}
                      </button>
                    ) : (
                      <>
                        {col.label}
                        {sortIcon}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={getRowKey?.(row, idx) ?? idx} className="border-b border-border last:border-b-0">
                {columns.map((col) => {
                  const value = row[col.key];
                  const color = col.semanticColor?.(row, value);
                  const content = col.render
                    ? col.render(row)
                    : col.format
                      ? col.format(value, row)
                      : String(value ?? "—");
                  return (
                    <td
                      key={col.key}
                      className={`px-3 py-3 text-[15px] ${
                        col.align === "right" ? "text-right" : "text-left"
                      } ${col.numeric ? "tabular-nums" : ""} ${colorClass(color)}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div data-testid="datatable-mobile" className="md:hidden flex flex-col gap-3">
        {rows.map((row, idx) => {
          const heroValue = heroColumn ? row[heroColumn.key] : null;
          const heroFormatted = heroColumn?.format
            ? heroColumn.format(heroValue, row)
            : String(heroValue ?? "—");
          const heroColor = heroColumn?.semanticColor?.(row, heroValue);
          const restColumns = columns.filter((c) => !c.hero);

          return (
            <div
              key={getRowKey?.(row, idx) ?? idx}
              className="pb-card p-4 flex flex-col gap-3"
            >
              {heroColumn && (
                <div
                  className={`text-3xl font-bold tabular-nums ${colorClass(heroColor)}`}
                >
                  {heroFormatted}
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                {restColumns.map((col) => {
                  const value = row[col.key];
                  const color = col.semanticColor?.(row, value);
                  const content = col.render
                    ? col.render(row)
                    : col.format
                      ? col.format(value, row)
                      : String(value ?? "—");
                  return (
                    <div key={col.key} className="contents">
                      {/* ABM007_FINAL AC-L04: long unbroken values (addresses, identifiers) wrap inside the card
                          instead of widening the page at 375 px (found by the signed-in audit check). */}
                      <div className="min-w-0 text-[13px] text-muted-foreground [overflow-wrap:anywhere]">
                        {col.label}
                      </div>
                      <div
                        className={`min-w-0 [overflow-wrap:anywhere] ${col.numeric ? "tabular-nums" : ""} ${colorClass(color)}`}
                      >
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DataTable;
