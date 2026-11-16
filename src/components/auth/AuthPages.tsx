// APBM007A — pages for the sign-in confirmation button, link recovery, handoff recovery, account switch and the
// signed-out state. Server-renderable; the two forms are plain HTML POSTs, so they work without script.
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkRequestForm } from "@/components/auth/LinkRequestForm";

const primary = "inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const secondary = "inline-flex h-11 w-full items-center justify-center rounded-md border border-input bg-background px-5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Frame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="w-[400px] max-w-[calc(100vw-2rem)] mt-16">
      <div className="p-4 border-t border-border bg-card">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}

/** The button page. The token is not on this page or in its address; pressing the button is what signs in. */
export function ConfirmSignIn({ csrf }: { csrf: string }) {
  return (
    <Frame title="Finish signing in" description="You opened a sign-in link. Press the button to sign in on this browser. The link works once.">
      <form method="post" action="/api/auth/confirm">
        <input type="hidden" name="csrf" value={csrf} />
        <button type="submit" className={primary} data-testid="confirm-sign-in">Sign in</button>
      </form>
      <p className="text-xs text-muted-foreground">If you didn&apos;t ask for this link, close this page. Nothing happens unless you press the button.</p>
    </Frame>
  );
}

export function LinkExpired() {
  return (
    <Frame title="That sign-in link can't be used" description="Sign-in links work once and expire. Request a new one, or log in with your password.">
      <LinkRequestForm />
      <Link href="/auth" className={secondary}>Log in with a password</Link>
    </Frame>
  );
}

export function HandoffRecovery({ startHref }: { startHref: string }) {
  return (
    <Frame title="We couldn't move you across" description="Moving between billing and OwedBook didn't finish. Nothing was changed. You can try again, or sign in here by email.">
      <a href={startHref} className={primary} data-testid="handoff-try-again">Try again</a>
      <LinkRequestForm />
    </Frame>
  );
}

export function SwitchAccount({ currentEmailMasked, token }: { currentEmailMasked: string; token: string }) {
  return (
    <Frame title="You're signed in here as a different account" description={`This browser is signed in here as ${currentEmailMasked}. The other app is signed in as a different account. Nothing has been changed.`}>
      <Link href="/owedbook" className={secondary} data-testid="switch-stay">Stay signed in as {currentEmailMasked}</Link>
      <form method="post" action="/api/handoff/switch">
        <input type="hidden" name="t" value={token} />
        <button type="submit" className={primary} data-testid="switch-continue">Sign out here and continue as the other account</button>
      </form>
    </Frame>
  );
}

export function SignedOut() {
  return (
    <Frame title="You're signed out" description="You signed out while we were moving you across. Log in again to continue.">
      <Link href="/auth" className={primary}>Log in</Link>
    </Frame>
  );
}

export function SignInToContinue() {
  return (
    <Frame title="Log in to continue" description="Log in here first. You'll then be taken on to where you were going.">
      <Link href="/auth?next=continue" className={primary} data-testid="continue-sign-in">Log in</Link>
      <LinkRequestForm />
    </Frame>
  );
}
