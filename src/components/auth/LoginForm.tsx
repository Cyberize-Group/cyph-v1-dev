"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { LinkRequestForm } from "@/components/auth/LinkRequestForm";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Please enter a valid email",
    }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

// false on the server and while hydrating, true once React owns the page (no effect, no extra render).
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // F-Q2-002: text typed while the page was still hydrating (seen in WebKit) never reached these controlled fields, and
  // the next render wiped it ("Email is required"). Adopt whatever the fields already hold once React owns them.
  const formRef = useRef<HTMLFormElement>(null);
  const hydrated = useHydrated();
  useEffect(() => {
    for (const name of ["email", "password"] as const) {
      const el = formRef.current?.elements.namedItem(name);
      if (el instanceof HTMLInputElement && el.value && el.value !== form.getValues(name)) form.setValue(name, el.value);
    }
  }, [form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);

    // Use .catch() instead of try/catch — prevents React 18 dev overlay from
    // intercepting the rejected promise before our handler processes it
    const redirectPath = await login(data.email, data.password).catch((err: Error) => {
      setError(err.message || "Login failed. Please try again.");
      setIsLoading(false);
      return null;
    });

    if (!redirectPath) return;

    // APBM007A: a sign-in that was asked for by the other app resumes that handoff (state is in an httpOnly cookie).
    if (new URLSearchParams(window.location.search).get("next") === "continue" && redirectPath !== "/access-denied") {
      // A full navigation, not router.push: the route handler answers with a redirect to the other app's origin.
      window.location.assign(new URL("/api/handoff/authorize?resume=1", window.location.origin).toString());
      return;
    }

    router.refresh();
    router.push(redirectPath);
  };

  return (
    <>
      <section className="pb-card p-5" aria-labelledby="password-sign-in-heading">
        <h2 id="password-sign-in-heading" className="pb-h2 mb-3">Sign in with your password</h2>
        <div className="space-y-2">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-normal text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"

                        placeholder="Please Enter Email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-normal text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput

                        placeholder="Please Enter password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-destructive text-sm mt-2">
                  {error}
                </div>
              )}
              {isLoading && <Spinner />}
              {/* Disabled until hydrated, so a click can never fall through to a native form submission (which would put
                  the typed credentials in the address bar). */}
              <Button
                disabled={isLoading || !hydrated}
                aria-busy={isLoading}
                className="w-full"
              >
                {isLoading ? "Logging in…" : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
      {/* APBM007A: emailed sign-in link, alongside the password form (password login is preserved). */}
      <div className="pb-card p-5">
        <LinkRequestForm />
      </div>
    </>
  );
};

export default LoginForm;
