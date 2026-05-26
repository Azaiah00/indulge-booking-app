"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Hide the public marketing Header and Footer on app shells that have
// their own chrome (admin dashboard and client portal). This avoids
// double headers and double mobile menus on small screens.
function isAppShell(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.startsWith("/dashboard") || pathname.startsWith("/portal");
}

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const appShell = isAppShell(pathname);

  return (
    <>
      {!appShell && <Header />}
      <main className="flex-1">{children}</main>
      {!appShell && <Footer />}
    </>
  );
}
