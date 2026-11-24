"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { AppRole } from "@/utils/app-role";
import { SUPPORT_EMAIL } from "@/lib/support";

interface Props {
  user: SupabaseUser;
  /** Canonical platform role from `user_roles` (fetched server-side in the page). */
  role: AppRole;
  /**
   * Manual QA 19 Nov 2026 (R5/R7): the person's role on their pharmacies (tenant_stores capability): Owner if they own an
   * account, else Store admin, else Member. The platform role says 'member' for every customer, so it never shows Owner.
   */
  accountRole?: "Owner" | "Store admin" | "Member" | null;
}

// false on the server and while hydrating, true once React owns the page (no effect, no extra render).
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

const ProfileForm = ({ user, role, accountRole = null }: Props) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();
  // F-Q4-001: a password typed before the page finished loading never reached this state, and the next re-render (e.g.
  // Show password) wiped it. Adopt what the fields hold once React owns them; Update stays disabled until then, so an
  // early click cannot become a native form submission.
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const hydrated = useHydrated();
  useEffect(() => {
    if (passwordRef.current?.value) setPassword(passwordRef.current.value);
    if (confirmRef.current?.value) setConfirmPassword(confirmRef.current.value);
  }, []);

  const displayName: string =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Member";

  const initials = displayName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Role-aware badge + avatar accent (deterministic — no raw role string in UI).
  const isPrivileged = role === AppRole.ADMIN || role === AppRole.SUPERADMIN || accountRole === "Owner" || accountRole === "Store admin";
  const roleLabel =
    role === AppRole.SUPERADMIN ? "Superadmin" : accountRole ?? (role === AppRole.ADMIN ? "Admin" : "Member");
  // ABM007_FINAL P-04 / AC-B09: roles are neutral and told apart by the word; status colors never carry a role.
  void isPrivileged;
  const accent = { bg: "bg-accent", text: "text-heading", border: "border-heading" };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Password updated successfully" });
      setPassword("");
      setConfirmPassword("");
      setValidationError(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar + identity card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            {/* Placeholder avatar */}
            <div
              className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center border-2 ${accent.bg} ${accent.border}`}
            >
              {initials ? (
                <span className={`text-2xl font-bold ${accent.text}`}>{initials}</span>
              ) : (
                <User className={`w-8 h-8 ${accent.text}`} />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xl font-bold text-heading">{displayName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <span
                className="pb-role"
              >
                {roleLabel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-[13px] font-medium text-muted-foreground">
              Full Name
            </Label>
            <Input
              className="mt-2 cursor-not-allowed bg-disabled"
              value={displayName}
              disabled
            />
          </div>
          <div>
            <Label className="text-[13px] font-medium text-muted-foreground">
              Email
            </Label>
            <Input
              className="mt-2 cursor-not-allowed bg-disabled"
              value={user.email ?? "—"}
              disabled
            />
            <p className="text-sm text-muted-foreground mt-1">
              Name and email changes aren&apos;t self-service yet. To change them, contact support at{" "}
              <a className="font-semibold underline underline-offset-2" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password update */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <Label className="text-[13px] font-medium text-muted-foreground">
                New Password
              </Label>
              <PasswordInput
                ref={passwordRef}
                className="mt-2"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[13px] font-medium text-muted-foreground">
                Confirm New Password
              </Label>
              <PasswordInput
                ref={confirmRef}
                className="mt-2"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {validationError && (
                <p className="text-sm font-semibold text-destructive mt-1">{validationError}</p>
              )}
            </div>
            <Button type="submit" disabled={loading || !hydrated} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
