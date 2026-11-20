"use client";
import { isDemoMode } from "@/services/tenantScope";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ownerStoresService } from "@/services/adminDemo";
import { peerOrigin } from "@/lib/appIdentity";

// Manual QA 19 Nov 2026 (R1): in real mode the owner adds a paid pharmacy in Account & Billing. This opens the Portal's
// Add a pharmacy form directly through the existing destination-verified handoff (same signed-in person, no token in
// the link; the Portal accepts /stores/add as a return path and re-checks owner and subscription before any price).
export function AddStoreHandoffLink() {
  const [opening, setOpening] = useState(false);
  return (
    <div className="flex max-w-xs flex-col items-stretch gap-1 sm:items-end">
      <Button asChild aria-busy={opening}>
        <a href={`${peerOrigin()}/api/handoff/start?return=${encodeURIComponent("/stores/add")}`} onClick={() => setOpening(true)} data-testid="add-store-handoff">
          {opening ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Opening Account &amp; Billing…</> : <><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Add store</>}
        </a>
      </Button>
      <p className="text-xs text-muted-foreground sm:text-right">
        Adds a paid pharmacy to your subscription in Account &amp; Billing. You see the price and confirm before paying. Needs an active subscription with no overdue payment or scheduled cancellation.
      </p>
      <span className="sr-only" aria-live="polite">{opening ? "Opening Account and Billing." : ""}</span>
    </div>
  );
}

// Mock "add a store" harvest form. The four fields (name / NCPDP / NPI / address)
// are local-state ONLY — they exist to show the domain expert the intended new-store field set
// and harvest the real requirement. They deliberately do NOT flow to addStore()
// (its signature is the frozen Phase-7 swap point); submit drops the generic mock
// card. NO Stripe, NO charge. Caller reloads its list via onAdded.
const AddStoreButton = ({ onAdded }: { onAdded: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [ncpdp, setNcpdp] = useState("");
  const [npi, setNpi] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const store = await ownerStoresService.addStore();
      toast({ title: `${store.name} added (demo — no charge)` });
      setName("");
      setNcpdp("");
      setNpi("");
      setAddress("");
      setOpen(false);
      onAdded();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Failed to add store",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  if (!isDemoMode()) return <AddStoreHandoffLink />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add store
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a store</DialogTitle>
          <DialogDescription>
            Demo only — real add-store + subscription checkout is Phase 7.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="add-store-name">Store name</Label>
            <Input
              id="add-store-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-store-ncpdp">NCPDP</Label>
            <Input
              id="add-store-ncpdp"
              value={ncpdp}
              onChange={(e) => setNcpdp(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-store-npi">NPI</Label>
            <Input
              id="add-store-npi"
              value={npi}
              onChange={(e) => setNpi(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-store-address">Address</Label>
            <Textarea
              id="add-store-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Adding…" : "Add store"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStoreButton;
