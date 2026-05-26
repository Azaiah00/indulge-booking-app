"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

// Wrap the app in NextAuth's SessionProvider so client components can
// use useSession(). Server components keep using getServerSession.
export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
