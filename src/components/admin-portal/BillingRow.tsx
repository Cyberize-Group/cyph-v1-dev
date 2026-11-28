"use client";
import { isDemoMode } from "@/services/tenantScope";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import StatusPill from "@/components/admin-portal/StatusPill";
import { subscriptionPill } from "@/components/admin-portal/statusPresentation";
import { formatChargeDate } from "@/components/admin-portal/format";
import { billingService } from "@/services/adminDemo";
import type { ActionResult, BillingLine, BillingPlan } from "@/types/adminDemo";

const PLAN_LABEL: Record<BillingPlan, string> = {
  unavailable: "Plan unavailable",
  standard: "Standard",
  concierge: "Concierge",
  owedbook: "OwedBook",
  synthetic: "Synthetic test subscription",
};

// Real mode (U-2): the plan with the pharmacies it covers, and the dates the subscription row holds. A value the row
// does not hold is said to be unavailable; nothing is filled in.
const planText = (line: BillingLine) =>
  line.plan === "owedbook" && line.coveredStores
    ? `${PLAN_LABEL.owedbook} · ${line.coveredStores} ${line.coveredStores === 1 ? "pharmacy" : "pharmacies"}`
    : PLAN_LABEL[line.plan];
const realDates = (line: BillingLine) =>
  line.plan === "synthetic" ? "No billing dates"
    : line.paidThroughDate ? `Paid through ${formatChargeDate(line.paidThroughDate)}`
      : line.nextChargeDate ? `Next payment ${formatChargeDate(line.nextChargeDate)}`
        : "Billing dates unavailable";

// One billing line. Manage payment / Cancel are VISUAL ONLY — they toast a
// "demo — no charge" message and change no state (the service never charges).
const BillingRow = ({ line }: { line: BillingLine }) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const pill = subscriptionPill[line.subscriptionStatus];

  const when = !isDemoMode() ? realDates(line) : line.nextChargeDate
    ? `Next charge ${formatChargeDate(line.nextChargeDate)}`
    : line.retryDate
      ? `Retry ${formatChargeDate(line.retryDate)}`
      : "No upcoming charge";

  const run = async (fn: () => Promise<ActionResult>) => {
    setBusy(true);
    try {
      const res = await fn();
      toast({ title: res.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-card p-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="font-semibold text-heading">{line.storeName}</p>
        <p className="text-[13px] text-muted-foreground">
          {planText(line)} · {line.amountLabel} · {when}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 md:justify-end">
        <StatusPill tone={pill.tone}>{pill.label}</StatusPill>
        {/* APBM007A: in real mode billing actions live in the billing portal (one link on the screen), not per store. */}
        <div className={isDemoMode() ? "flex gap-2" : "hidden"}>
          <Button
            variant="secondary"
            size="sm"
            disabled={busy || !isDemoMode()}
            onClick={() => run(() => billingService.managePayment(line.storeId))}
          >
            Manage payment
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={busy || !isDemoMode()}
            onClick={() => run(() => billingService.cancelSubscription(line.storeId))}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingRow;
