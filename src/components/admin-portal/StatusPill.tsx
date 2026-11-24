import type { ReactNode } from "react";

// Generic status pill for the Admin Portal screens — mirrors owedbook's
// StatusChip pattern (literal class strings so Tailwind's scanner keeps them)
// but tone-driven so each surface maps its own vocab → tone + label. Matches the
// mockup `.pill` styling; built from existing semantic tokens (no new colors).
export type PillTone = "success" | "warning" | "destructive" | "info" | "neutral";

// ABM007_FINAL pill recipe (brand contract 3.4): charcoal text, status border, 10 percent tint; the word carries meaning.
const TONE: Record<PillTone, string> = {
  success: "pb-tone-success",
  warning: "pb-tone-warning",
  destructive: "pb-tone-destructive",
  info: "pb-tone-info",
  neutral: "pb-tone-neutral",
};

interface StatusPillProps {
  tone: PillTone;
  children: ReactNode;
}

const StatusPill = ({ tone, children }: StatusPillProps) => {
  return (
    <span
      className={`pb-pill ${TONE[tone]}`}
    >
      {children}
    </span>
  );
};

export default StatusPill;
