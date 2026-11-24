// APBM-007B I6/I7/I8 — the recipient's invitations. Viewing never accepts: each invitation needs an explicit button.
import InvitationsScreen from "@/components/invitations/InvitationsScreen";
import { BrandMark } from "@/components/global/BrandMark";

export const dynamic = "force-dynamic";

export default function InvitationsPage() {
  return (
    <>
      {/* ABM007_FINAL translated layout, header only: the navy brand bar. No guard or navigation is added, so who can
          reach this page and where a signed-out visitor is sent are unchanged. */}
      <header className="bg-navbar px-4 py-2 text-navbar-foreground sm:px-6">
        <BrandMark />
      </header>
      <main className="mx-auto max-w-[640px] px-4 py-10">
        <InvitationsScreen />
      </main>
    </>
  );
}
