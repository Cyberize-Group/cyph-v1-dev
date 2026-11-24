import type { OwedStatus } from "@/types/OwedBook";

// Status → pill recipe (ABM007_FINAL brand contract 3.4): charcoal text, a status-colored border and a 10 percent
// tint; the word carries the meaning. Class strings are literals so Tailwind keeps them. null → "—".
const STATUS: Record<OwedStatus, { label: string; className: string }> = {
  recovered: { label: "Recovered", className: "pb-tone-success" },
  emailed_pbm: { label: "Emailed PBM", className: "pb-tone-info" },
  pending: { label: "Pending", className: "pb-tone-warning" },
  underpaid: { label: "Underpaid", className: "pb-tone-destructive" },
  new: { label: "New", className: "pb-tone-neutral" },
};

interface StatusChipProps {
  status: OwedStatus | null;
}

const StatusChip = ({ status }: StatusChipProps) => {
  if (!status) return <span className="text-muted-foreground">—</span>;

  const { label, className } = STATUS[status];
  return (
    <span
      className={`pb-pill ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusChip;
