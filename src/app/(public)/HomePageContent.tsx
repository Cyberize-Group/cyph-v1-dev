import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield } from "lucide-react";
import { BRAND } from "@/components/global/brand";

const HomePageContent = () => {
  return (
    <section className="px-7 py-10 lg:px-14 lg:py-20 max-w-[960px] mx-auto">
      {/* Copy column */}
      <div>
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="block w-3 h-3 rounded-sm bg-brand-green" />
          <span className="pb-eyebrow text-heading">
            Pharmacy revenue recovery
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-brand text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight text-heading">
          Get back every dollar you&apos;re{" "}
          <span className="text-primary">owed</span>
        </h1>

        {/* Lead */}
        <p className="text-muted-foreground text-lg leading-relaxed mt-7 mb-10 max-w-[500px]">
          {BRAND.app} audits every claim against expected reimbursement and flags
          PBM underpayments to the cent — so independent pharmacies recover what
          they&apos;re owed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-12">
          <Button
            asChild
            size="lg"
          >
            <Link href="/auth">
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 bg-card text-[13px] font-medium py-2 px-4"
          >
            <Shield className="h-3.5 w-3.5 text-primary" />
            HIPAA-ready
          </Badge>
          <span className="text-[13px] font-medium text-muted-foreground">
            Trusted by 200+ independent pharmacies
          </span>
        </div>
      </div>

      {/* ABM007_FINAL P-08: the stale product screenshot is removed. A clean mock-mode capture of the rebranded
          dashboard needs a signed-in session, which this module could not use (ruling AM-08 (5)); P-08 allows removal. */}
    </section>
  );
};

export default HomePageContent;
