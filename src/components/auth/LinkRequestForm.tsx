"use client";

// APBM007A — "email me a sign-in link". The answer is deliberately the same for every address.
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LinkRequestForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "slow" | "error">("idle");
  // F-Q4-001: an address typed before the page finished loading never reached this state, and the next re-render wiped
  // it. Adopt what the field holds once React owns it.
  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (emailRef.current?.value) setEmail(emailRef.current.value);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/auth/link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    setState(!res ? "error" : res.status === 429 ? "slow" : res.ok ? "sent" : "error");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3" data-testid="link-request-form">
      <Label htmlFor="link-email" className="uppercase text-xs font-bold text-muted-foreground">Email me a sign-in link</Label>
      <Input ref={emailRef} id="link-email" type="email" autoComplete="email" className="p-6 bg-muted" placeholder="Please Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" variant="outline" className="w-full" disabled={state === "sending" || email.trim().length === 0}>
        {state === "sending" ? "Sending…" : "Email me a sign-in link"}
      </Button>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground min-h-[1.25rem]">
        {state === "sent" ? "If that address has an account, a sign-in link is on its way. It works once. You can ask for another in a minute." : null}
        {state === "slow" ? "Wait a minute and try again." : null}
        {state === "error" ? "Could not reach the server. Try again." : null}
      </p>
    </form>
  );
}
