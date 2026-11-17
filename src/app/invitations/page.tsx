// APBM-007B I6/I7/I8 — the recipient's invitations. Viewing never accepts: each invitation needs an explicit button.
import InvitationsScreen from "@/components/invitations/InvitationsScreen";

export const dynamic = "force-dynamic";

export default function InvitationsPage() {
  return (
    <main className="mx-auto max-w-[640px] px-4 py-10">
      <InvitationsScreen />
    </main>
  );
}
