"use client";

import LoginForm from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";
import React from "react";

const AuthPage = () => {
  return (
    <AuthShell title="Login" description="Log into your account with your credentials, or ask for a sign-in link.">
      <LoginForm />
    </AuthShell>
  );
};

export default AuthPage;
