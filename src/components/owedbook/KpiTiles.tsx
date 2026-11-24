import type { OwedBookKpis } from "@/types/OwedBook";
import { usd, count } from "./format";

interface KpiTilesProps {
  kpis: OwedBookKpis;
}

interface Tile {
  label: string;
  value: string;
  rule: string; // literal so Tailwind keeps it
}

// ABM007_FINAL P-03 (brand contract 4.6): white cards, gray label, navy bold figure, a 3px top rule in the tile's
// --chart-* color. chart-1 destructive / chart-2 info / chart-3 success / chart-4 navy.
const KpiTiles = ({ kpis }: KpiTilesProps) => {
  const tiles: Tile[] = [
    { label: "Commercial Underpaid", value: usd(kpis.commercial_underpaid), rule: "border-t-chart-1" },
    { label: "Commercial Scripts", value: count(kpis.commercial_scripts), rule: "border-t-chart-2" },
    { label: "Updated Difference", value: usd(kpis.updated_difference), rule: "border-t-chart-3" },
    { label: "Owed", value: usd(kpis.owed), rule: "border-t-chart-4" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((t) => (
        <div key={t.label} className={`pb-card border-t-[3px] ${t.rule} px-4 py-3.5`}>
          <div className="text-[13px] font-medium text-muted-foreground">
            {t.label}
          </div>
          <div className="text-2xl font-bold tabular-nums mt-1 text-heading">{t.value}</div>
        </div>
      ))}
    </div>
  );
};

export default KpiTiles;
