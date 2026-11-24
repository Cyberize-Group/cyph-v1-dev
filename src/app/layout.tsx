import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./providers/ThemeProvider";

import { BRAND, PAGE_TITLE } from "@/components/global/brand";

// ABM007_FINAL: Inter 400 to 700 via next/font (self-hosted at build), replacing Saira.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: `${BRAND.app} by ${BRAND.name}: pharmacy revenue recovery — get back every dollar you're owed.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
