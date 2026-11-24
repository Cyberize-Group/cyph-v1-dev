"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import MultiSelect from "@/components/common/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { owedBookService } from "@/services/owedbook";
import type { OwedBookFilters } from "@/types/OwedBook";
import { isDemoMode } from "@/services/tenantScope";
import { countActiveFilters, useOwedBook } from "./OwedBookContext";

interface FilterRailProps {
  filters: OwedBookFilters; // committed filters — seed the controls + active count
  pbmOptions: string[];
  onApply: (filters: OwedBookFilters) => void;
  onClear: () => void;
}

const EMPTY: OwedBookFilters = { pbms: [] };

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "recovered", label: "Recovered" },
  { value: "emailed_pbm", label: "Emailed PBM" },
  { value: "pending", label: "Pending" },
  { value: "underpaid", label: "Underpaid" },
  { value: "new", label: "New" },
];

// Filter rail (UI_SPEC §5.4). UI-only: Apply re-queries the service. Upload Data
// is a UI-FUNCTIONAL MOCK — opens a real picker and fakes success via the
// service, but does NOT read/parse/send the file (real ingest = Phase 5).
const FilterRail = ({ filters, pbmOptions, onApply, onClear }: FilterRailProps) => {
  const { refresh: reloadScoped, optionsError } = useOwedBook();
  const demo = isDemoMode();
  // Seed the controls from the committed filters so reopening the rail/drawer
  // shows the active selection (FilterRail re-mounts each time the drawer opens).
  const [draft, setDraft] = useState<OwedBookFilters>(filters);
  const [upload, setUpload] = useState<{ name: string; status: "uploading" | "done" } | null>(null);
  const [refresh, setRefresh] = useState<"idle" | "refreshing" | "done">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-sync the draft when committed filters change externally (e.g. the
  // main-screen "Clear filters"), so the persistent desktop rail isn't stale.
  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  // "N filters active" reflects the APPLIED (committed) set, not the draft.
  const activeCount = countActiveFilters(filters);

  const handleClear = () => {
    setDraft(EMPTY);
    onClear();
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !demo) return;
    setUpload({ name: file.name, status: "uploading" });
    await owedBookService.uploadData(file); // mock: file is NOT read/parsed/sent
    setUpload({ name: file.name, status: "done" });
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleRefresh = async () => {
    if (!demo) { reloadScoped(); return; }
    setRefresh("refreshing");
    await owedBookService.refreshData(); // mock: no real fetch
    setRefresh("done");
  };

  return (
    <aside className="flex flex-col gap-4 p-1">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={!demo}
          onClick={() => fileInputRef.current?.click()}
          className="w-full min-h-11 rounded-md bg-primary px-4 py-2 text-base font-normal text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground"
        >
          Upload Data
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFile}
          className="hidden"
          aria-label="Upload claims file"
        />
        <p className="text-xs text-muted-foreground">{demo ? "Upload your dispensing report (.csv, .xlsx)" : "Upload is not available in this release."}</p>
        {upload && (
          <p className="text-xs text-muted-foreground truncate" role="status">
            {upload.name} — {upload.status === "uploading" ? "Uploading…" : "Upload complete"}
          </p>
        )}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[13px] font-medium text-muted-foreground">From</span>
        <input
          type="date"
          value={draft.from ?? ""}
          onChange={(e) => setDraft({ ...draft, from: e.target.value || undefined })}
          className="min-h-11 rounded-md border border-input bg-card px-2.5 py-2 text-[15px] text-foreground"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[13px] font-medium text-muted-foreground">To</span>
        <input
          type="date"
          value={draft.to ?? ""}
          onChange={(e) => setDraft({ ...draft, to: e.target.value || undefined })}
          className="min-h-11 rounded-md border border-input bg-card px-2.5 py-2 text-[15px] text-foreground"
        />
      </label>

      <div className="flex flex-col gap-1 text-sm">
        <span className="text-[13px] font-medium text-muted-foreground">Filter</span>
        <Select
          value={draft.filter ?? "all"}
          onValueChange={(v) => setDraft({ ...draft, filter: v === "all" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <span className="text-[13px] font-medium text-muted-foreground">PBM</span>
        <MultiSelect
          options={pbmOptions}
          selected={draft.pbms}
          onChange={(pbms) => setDraft({ ...draft, pbms })}
          triggerLabel="PBMs"
          placeholder="Search PBMs..."
        />
      </div>

      {optionsError && <p role="alert">{optionsError}</p>}
      <p className="text-xs text-muted-foreground">{activeCount} filters active</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 min-h-11 rounded-md border border-input bg-card px-4 py-2 text-base font-normal text-heading hover:bg-accent disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="flex-1 min-h-11 rounded-md bg-primary px-4 py-2 text-base font-normal text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground"
        >
          Apply
        </button>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refresh === "refreshing"}
          className="w-full min-h-11 rounded-md border border-input bg-card px-4 py-2 text-base font-normal text-heading hover:bg-accent disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground"
        >
          Get Fresh Data
        </button>
        {refresh !== "idle" && (
          <p className="text-xs text-muted-foreground" role="status">
            {refresh === "refreshing" ? "Refreshing…" : "Done"}
          </p>
        )}
      </div>
    </aside>
  );
};

export default FilterRail;
