import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND } from "@/components/global/brand";
import { LogoTile } from "@/components/global/BrandMark";

// ABM007_FINAL Help page (D-08; CONTRACTS/HELP_CONTENT.md Part B as corrected in its Engineer corrections appendix,
// H-1 to H-6). Every bold label is a control or screen name checked against the current screens. Panel inside
// navigation: masthead, then one card per section, numbered step badges for "How to do it".

const SECTIONS = [
  ["getting-around", "Getting around"],
  ["roles", "Who can do what"],
  ["my-stores", "My Stores"],
  ["inviting", "Inviting staff"],
  ["store-admin", "Changing a store admin"],
  ["removing-access", "Removing someone's access"],
  ["billing", "Billing and adding a pharmacy"],
  ["removing-pharmacy", "Removing a pharmacy"],
  ["settings", "Pharmacy settings"],
  ["audit", "Audit log"],
  ["profile", "Your profile and signing in"],
  ["claims", "Claims and uploads"],
  ["support", "Getting help"],
] as const;

type SectionId = (typeof SECTIONS)[number][0];

// Section 2 role table: one source, rendered as a table from md and as stacked labelled pairs below it.
const ROLE_NAMES = ["Owner", "Store admin", "Member"] as const;
const ROLE_ROWS: { task: string; answers: [string, string, string] }[] = [
  { task: "See a pharmacy", answers: ["All pharmacies on the account", "The pharmacies they are assigned to", "The pharmacies they are assigned to"] },
  { task: "Open My Stores", answers: ["Yes", "Yes, for their own pharmacies", `No. Members choose a pharmacy with the Store selector on the ${BRAND.app} page`] },
  { task: "Invite and remove staff", answers: ["Yes, for every pharmacy", "Members, for their own pharmacies", "No"] },
  { task: "Manage billing, add or remove a pharmacy", answers: ["Yes", "No", "No"] },
  { task: "View pharmacy settings", answers: ["Yes", "Their own pharmacies", "No"] },
  { task: "View the audit log", answers: ["Yes", "Their own pharmacies", "No"] },
];

function Section({ id, n, children }: { id: SectionId; n: number; children: ReactNode }) {
  const title = SECTIONS.find(([key]) => key === id)![1];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="pb-card scroll-mt-24 p-5 sm:p-6">
      <h2 id={`${id}-title`} className="pb-h2 text-xl">
        {n}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="pb-step-badge" aria-hidden="true">{i + 1}</span>
          <span className="pt-0.5">
            <span className="sr-only">Step {i + 1}: </span>
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Part({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-heading">{label}</h3>
      <div className="mt-1 space-y-2">{children}</div>
    </div>
  );
}

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold">{children}</strong>;

export default function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="pb-masthead">
        <p className="pb-eyebrow pb-masthead-text flex justify-between gap-3">
          <span>{BRAND.name}</span>
          <span>{BRAND.app}</span>
        </p>
        <div className="mt-3.5 flex items-center gap-4">
          <LogoTile height={40} />
          <h1 className="pb-headline text-[28px] sm:text-[36px]">Help</h1>
        </div>
        <p className="pb-masthead-text mt-2.5">Short answers for owners, store admins and members.</p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <nav aria-label="On this page" className="pb-card p-4 lg:sticky lg:top-4">
          <h2 className="pb-eyebrow text-muted-foreground">On this page</h2>
          <ol className="mt-2 space-y-0.5 text-[15px]">
            {SECTIONS.map(([id, title], i) => (
              <li key={id}>
                <a href={`#${id}`} className="flex min-h-11 items-center rounded-md px-2 text-heading underline-offset-2 hover:bg-accent hover:underline">
                  {i + 1}. {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-4">
          <Section id="getting-around" n={1}>
            <p>{BRAND.name} has two parts that work together.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <B>{BRAND.app}</B> is where you work day to day: your pharmacies, your staff, settings and the audit log.
              </li>
              <li>
                <B>{BRAND.billingApp}</B> is where the account owner manages the subscription: adding a pharmacy, payment
                details and invoices.
              </li>
            </ul>
            <p>You sign in once. Moving from one part to the other does not ask you to sign in again.</p>
            <p>
              Payment details and invoices are handled on Stripe&apos;s secure billing page. When you finish there, use the
              return link at the top of the Stripe page to come back to {BRAND.billingApp}.
            </p>
          </Section>

          <Section id="roles" n={2}>
            <p>Every person has one role for each pharmacy they can see.</p>
            {/* One source for both presentations (UI_SPEC "tables stack as labelled pairs below their fit breakpoint",
                the same md breakpoint as the app's data tables). Only one is displayed at a time. */}
            <div className="hidden overflow-x-auto rounded-md border border-border md:block" data-testid="help-roles-table">
              <table className="w-full border-collapse text-left text-[15px]">
                <caption className="sr-only">What each role can do</caption>
                <thead className="bg-muted text-[13px] uppercase tracking-[0.04em] text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 font-medium"><span className="sr-only">Task</span></th>
                    {ROLE_NAMES.map((r) => (
                      <th key={r} scope="col" className="px-3 py-2.5 font-medium">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&_td]:border-t [&_td]:border-border [&_td]:px-3 [&_td]:py-2.5 [&_th]:border-t [&_th]:border-border [&_th]:px-3 [&_th]:py-2.5 [&_th]:font-medium [&_th]:text-heading">
                  {ROLE_ROWS.map((row) => (
                    <tr key={row.task}>
                      <th scope="row">{row.task}</th>
                      {row.answers.map((a, i) => <td key={ROLE_NAMES[i]}>{a}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="flex flex-col gap-3 md:hidden" aria-label="What each role can do" data-testid="help-roles-stacked">
              {ROLE_ROWS.map((row) => (
                <li key={row.task} className="rounded-md border border-border p-3">
                  <p className="font-medium text-heading">{row.task}</p>
                  <dl className="mt-2 grid grid-cols-1 gap-y-2 text-[15px]">
                    {row.answers.map((a, i) => (
                      <div key={ROLE_NAMES[i]}>
                        <dt className="text-[13px] font-medium uppercase tracking-[0.04em] text-muted-foreground">{ROLE_NAMES[i]}</dt>
                        <dd className="break-words">{a}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
            <Part label="Things to know">
              <ul className="list-disc space-y-1 pl-5">
                <li>There is one Owner for the account. The Owner is the person who pays for the subscription.</li>
                <li>Making someone a Store admin does not hand over the account or the billing. The Owner keeps full access.</li>
                <li>The Owner cannot be removed from a pharmacy by a Store admin.</li>
                <li>
                  If a Store admin opens a pharmacy they are not assigned to, a short message explains that, with a link back to{" "}
                  <B>My Stores</B>. A Member who opens a My Stores page is taken to the {BRAND.app} page.
                </li>
              </ul>
            </Part>
          </Section>

          <Section id="my-stores" n={3}>
            <Part label="What it does"><p>Lists every pharmacy you manage.</p></Part>
            <Part label="Who can use it"><p>Owners and Store admins. Members do not have My Stores; they choose a pharmacy with the <B>Store</B> selector at the top of the {BRAND.app} page.</p></Part>
            <Part label="How to use it">
              <Steps items={[
                <>Open <B>Admin Portal</B> from the menu. <B>My Stores</B> is its first page (<Link className="pb-link" href="/admin-portal">open My Stores</Link>).</>,
                <>Each pharmacy shows as a card with its status.</>,
                <>Open a pharmacy to see its people.</>,
              ]} />
            </Part>
            <Part label="What you should see"><p>Owners see every pharmacy on the account. Store admins see only the pharmacies they were invited to. A new pharmacy starts with no claims; that is expected.</p></Part>
          </Section>

          <Section id="inviting" n={4}>
            <Part label="What it does"><p>Gives a person access to one pharmacy.</p></Part>
            <Part label="Who can use it"><p>The Owner, or the Store admin of that pharmacy.</p></Part>
            <Part label="How to do it">
              <Steps items={[
                <>Open <B>My Stores</B> and open the pharmacy.</>,
                <>Choose <B>Invite member</B>.</>,
                <>Enter the person&apos;s email address.</>,
                <>Choose their role: <B>Member</B> or <B>Store admin</B>. The role you choose decides what they can do. Their email address does not. The Store admin choice appears only when you are allowed to appoint one.</>,
                <>Choose <B>Send invitation</B>.</>,
              ]} />
            </Part>
            <Part label="What should happen"><p>The person receives an email with a sign-in link. Until they accept, the invitation is listed under <B>Invitations</B> as pending. After they accept, they appear under <B>People with access</B> and see only that pharmacy.</p></Part>
            <Part label="If you chose the wrong role"><p>Invite them again with the correct role. The earlier invitation stays in the history.</p></Part>
            <Part label="Resending or revoking an invitation"><p>While an invitation is pending, you can choose <B>Resend</B> or <B>Revoke</B> next to it in the <B>Invitations</B> list. The person you invited can also decline it from their invitations page.</p></Part>
          </Section>

          <Section id="store-admin" n={5}>
            <Part label="What it does"><p>Lets someone else manage staff for one pharmacy.</p></Part>
            <Part label="Who can use it"><p>The Owner.</p></Part>
            <Part label="How to do it">
              <Steps items={[
                <>Open the pharmacy from <B>My Stores</B> and choose <B>Invite member</B>.</>,
                <>Invite the person with the role <B>Store admin</B>. If the pharmacy already has a Store admin, the form asks what should happen to the current one.</>,
                <>They accept the invitation from their email.</>,
              ]} />
            </Part>
            <Part label="What should happen"><p>The new Store admin can invite and remove Members for that pharmacy. The Owner still sees every pharmacy and still controls billing. The Store admin cannot remove the Owner and cannot see billing details.</p></Part>
          </Section>

          <Section id="removing-access" n={6}>
            <Part label="What it does"><p>Takes away a Member&apos;s access to one pharmacy.</p></Part>
            <Part label="Who can use it"><p>The Owner, or the Store admin of that pharmacy.</p></Part>
            <Part label="How to do it">
              <Steps items={[
                <>Open the pharmacy from <B>My Stores</B> and choose <B>Invite member</B>; the people for that pharmacy are listed there.</>,
                <>Find the person under <B>People with access</B> and choose <B>Remove access</B>.</>,
                <>Read the confirmation. It names the person and the pharmacy.</>,
                <>Choose <B>Remove access</B> to confirm, or <B>Cancel</B> to leave things as they are.</>,
              ]} />
            </Part>
            <Part label="What should happen"><p>If you cancel, nothing changes. If you confirm, the person can still sign in but no longer sees that pharmacy. Other people in the pharmacy are not affected. The removal is recorded in the audit log. The Owner and a Store admin are not removed this way.</p></Part>
          </Section>

          <Section id="billing" n={7}>
            <Part label="Who can use it"><p>The Owner only. Store admins see a short message that billing is managed by the account owner.</p></Part>
            <Part label="The price"><p>The first pharmacy is $99.00 a month. Each additional pharmacy is $49.00 a month. Any tax or approved discount is shown before you pay.</p></Part>
            <Part label="To see your subscription">
              <Steps items={[
                <>In {BRAND.app}, open <B>Admin Portal</B>, then <B>Billing</B> (<Link className="pb-link" href="/admin-portal/billing">open Billing</Link>), then choose <B>Manage billing</B>. You arrive in {BRAND.billingApp}, already signed in.</>,
                <>Your plan, your pharmacies and your monthly total are shown, with two counts: <B>Pharmacies with access now</B> and <B>Billed at next renewal</B>. They differ only when a pharmacy has been scheduled for removal.</>,
                <>To change your card or see invoices, choose <B>Manage billing</B> in {BRAND.billingApp} to open the Stripe billing page. Use the return link on the Stripe page when you are done.</>,
              ]} />
            </Part>
            <Part label="To add a pharmacy">
              <Steps items={[
                <>In {BRAND.billingApp}, choose <B>Add a pharmacy</B>. (In {BRAND.app}, <B>Add store</B> on the Billing page takes you there.)</>,
                <>Enter the pharmacy&apos;s name and its NPI. The NPI is required and must not already be registered. NCPDP is optional.</>,
                <>Review the price. You will see the amount due today and your new monthly total. The amount due today covers the rest of the current billing period, so it changes from day to day.</>,
                <>Tick the confirmation and pay.</>,
              ]} />
            </Part>
            <Part label="What should happen"><p>When the payment succeeds, the new pharmacy shows as active in both {BRAND.app} and {BRAND.billingApp}, and your invoice appears in your billing history. If your bank asks you to confirm the payment, follow its prompt.</p></Part>
            <Part label="If the payment does not go through"><p>The pharmacy is not added and your plan does not change. Check the message on screen before trying again. Do not pay twice for the same pharmacy.</p></Part>
          </Section>

          <Section id="removing-pharmacy" n={8}>
            <Part label="What it does"><p>Stops billing for one pharmacy from the next renewal.</p></Part>
            <Part label="Who can use it"><p>The Owner.</p></Part>
            <Part label="How to do it">
              <Steps items={[
                <>In {BRAND.billingApp}, find the pharmacy and choose <B>Remove at period end</B>.</>,
                <>Read the confirmation. It shows the date access ends.</>,
                <>Confirm, or cancel to leave things as they are.</>,
              ]} />
            </Part>
            <Part label="What should happen"><p>The pharmacy stays fully usable until the date shown. <B>Billed at next renewal</B> goes down by one. <B>Pharmacies with access now</B> does not change yet.</p></Part>
            <Part label="Changed your mind?"><p>Any time before that date, choose <B>Keep this store</B>. The removal is cancelled and your renewal count goes back up.</p></Part>
            <p>Removing one pharmacy is not the same as cancelling your whole subscription, which affects every pharmacy on the account. Cancelling the subscription is done on the Stripe billing page, and takes effect at the end of the current billing period.</p>
          </Section>

          <Section id="settings" n={9}>
            <Part label="What it does"><p>Shows the details saved for each pharmacy.</p></Part>
            <Part label="Who can use it"><p>The Owner, for every pharmacy. A Store admin, for their own pharmacies.</p></Part>
            <Part label="How to use it">
              <Steps items={[
                <>Open <B>Admin Portal</B>, then <B>Settings</B>.</>,
                <>Choose a pharmacy from the list.</>,
              ]} />
            </Part>
            <Part label="What you should see"><p>The saved details, including the NPI. These details are read-only in this release. A field that was never filled in shows &quot;Not provided&quot;. To correct a saved detail, contact support.</p></Part>
          </Section>

          <Section id="audit" n={10}>
            <Part label="What it does"><p>Shows who did what, to which pharmacy, and when.</p></Part>
            <Part label="Who can use it"><p>The Owner, for every pharmacy. A Store admin, for their own pharmacies.</p></Part>
            <Part label="How to use it">
              <Steps items={[
                <>Open <B>Admin Portal</B>, then <B>Audit log</B>.</>,
                <>Use <B>Show</B> to narrow the list: <B>People and invitations</B>, <B>Pharmacies</B> or <B>Billing</B>. <B>All changes</B> shows everything.</>,
                <>Turn on <B>Include views and system steps</B> to see more detail.</>,
                <>Choose <B>Load older events</B> to see earlier entries.</>,
              ]} />
            </Part>
            <Part label="How to read an entry"><p>Each entry shows the person, the action, the pharmacy and the time in your local time zone. An entry that says a removal was scheduled means the pharmacy is still active until the date shown. Some entries are made by the system, such as a payment update, and show no person&apos;s name.</p></Part>
          </Section>

          <Section id="profile" n={11}>
            <Part label="Your profile"><p>Open <B>Profile</B> from the menu or the account menu. The page, <B>My Profile</B>, shows your name, email address and role. Your name and email are read-only here; to change them, contact support. You can set a new password on the same page.</p></Part>
            <Part label="Signing in"><p>Enter your email address and we send you a sign-in link. Open the link, then press the button on the page to finish signing in. Each link works once. If you set a password, you can sign in with it instead.</p></Part>
            <Part label="If a link has expired or was already used"><p>Ask for a new one from the sign-in page. The newest link is the one that works.</p></Part>
            <Part label="Signing out"><p>Open the account menu (your initial at the top right) and choose <B>Logout</B>. On a phone, open <B>Menu</B> and choose <B>Log out</B>. In {BRAND.billingApp} the same action is called <B>Sign out</B>. Signing out of {BRAND.app} also ends your session in {BRAND.billingApp}.</p></Part>
            <Part label="If you can sign in but see no pharmacies"><p>Your access may have been removed, or your invitation may not be accepted yet. Ask your Owner or Store admin.</p></Part>
          </Section>

          <Section id="claims" n={12}>
            <p>Guidance for uploading claims and reading results will be added here in a later release.</p>
          </Section>

          <Section id="support" n={13}>
            <p>
              Email <a className="pb-link font-semibold" href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. Tell us the
              pharmacy name and what you were trying to do. Please do not include patient information in your message.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
