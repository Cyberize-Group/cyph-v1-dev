import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/components/global/brand";

export const metadata = {
  title: `Access Denied — ${BRAND.name}`,
};

export default function AccessDeniedPage() {
  return (
    <main className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="font-brand text-3xl font-normal">Access Denied</CardTitle>
          <CardDescription className="text-muted-foreground">
            You don&apos;t have permission to view that page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            If you administer Pharmacy Books at the platform level, sign in to the
            Super Admin Portal — it lives in its own application.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth">Sign in as different user</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
