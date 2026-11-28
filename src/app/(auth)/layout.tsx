import React from "react";

// ABM007_FINAL literal layout: full-bleed navy backdrop; each page renders its own shell (AuthShell).
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="pb-backdrop flex min-h-screen items-start justify-center px-2.5 py-4 sm:px-5 sm:py-10">
      {children}
    </main>
  );
};

export default AuthLayout;
