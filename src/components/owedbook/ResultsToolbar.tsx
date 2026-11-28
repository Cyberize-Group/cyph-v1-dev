import type { OwedBookPage } from "@/types/OwedBook";

interface ResultsToolbarProps {
  results: OwedBookPage;
  onPrevious: () => void;
  onNext: () => void;
}

// Presentation only: the screen retains all query state and navigation handlers.
export default function ResultsToolbar({ results, onPrevious, onNext }: ResultsToolbarProps) {
  const { page, pageCount, limit, total, rows } = results;
  const hasRows = total > 0 && rows.length > 0;
  const first = hasRows ? (page - 1) * limit + 1 : 0;
  const last = hasRows ? Math.min(first + rows.length - 1, total) : 0;
  const buttonClass = "min-h-11 min-w-0 px-4 py-2 text-base font-normal border rounded-md disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground";

  return (
    <nav aria-label="Results pagination" className="pb-card mt-4 flex min-w-0 flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0" aria-live="polite" aria-atomic="true">
        <p className="text-sm font-semibold tabular-nums">
          {hasRows ? `Showing ${first}–${last} of ${total} claims` : `Showing 0 of ${total} claims`}
        </p>
        <p className="mt-1 text-sm">{limit} claims per page</p>
      </div>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        <p className="text-sm font-semibold tabular-nums">
          {total > 0 ? `Page ${page} of ${pageCount}` : "No pages"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" aria-label="Previous page" disabled={!hasRows || page <= 1} onClick={onPrevious} className={`${buttonClass} border-input bg-card text-heading enabled:hover:bg-accent`}>
            <span aria-hidden="true">← </span>Previous
          </button>
          <button type="button" aria-label="Next page" disabled={!hasRows || page >= pageCount} onClick={onNext} className={`${buttonClass} border-transparent bg-primary text-primary-foreground enabled:hover:bg-primary-hover`}>
            Next<span aria-hidden="true"> →</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
