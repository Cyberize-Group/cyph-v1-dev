import { isDemoMode } from "@/services/tenantScope";

// The one net-new visual in the Admin Portal Demo Shell (FFM §3): a "Demo ·
// mock data" pill built ENTIRELY from the existing `--warning` token — no new
// brand colors. Lives in CONTENT next to a page title, NEVER in the navbar
// (the navbar is fixed chrome). Mirrors the mockup's `.demo-pill`.
const DemoMarker = () => {
  return (
    <span className="pb-pill pb-tone-warning">
      {isDemoMode() ? "Demo · mock data" : "Synthetic test data"}
    </span>
  );
};

export default DemoMarker;
