"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FluidBackground } from "@/components/three/FluidBackground";

// Login page for Indulge Members AND the admin (Eboni).
// Guests do NOT sign in — they book directly via /book.
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (res?.ok) {
        // After login, the server-rendered destination decides where they go
        // based on role. /portal works for clients; admins can navigate to
        // /dashboard once on the site. We default to a quick redirect:
        //   ADMIN -> /dashboard, anyone else -> /portal
        // The role check happens server-side in those layouts.
        const lookupRes = await fetch("/api/auth/whoami", { cache: "no-store" });
        if (lookupRes.ok) {
          const { role } = await lookupRes.json();
          if (role === "ADMIN") {
            router.push("/dashboard");
            return;
          }
        }
        router.push("/portal");
        return;
      }

      setError("Wrong email or password. Try again, or create an account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-24 pb-10">
      <FluidBackground />
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <Card className="bg-white/90 backdrop-blur-md shadow-xl border-white/20">
          <CardHeader className="text-center pb-2 pt-6 sm:pt-8">
            <CardTitle className="text-xl sm:text-2xl font-light uppercase tracking-widest text-[var(--color-primary)]">
              Member Sign In
            </CardTitle>
            <p className="text-gray-500 text-sm mt-2">
              Manage your appointments and member perks
            </p>
          </CardHeader>
          <CardContent className="p-5 sm:p-8">
            {justRegistered && (
              <p className="mb-4 text-sm text-green-700 bg-green-50 py-2 px-3 rounded-md">
                Account created. Please sign in.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white/50"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white/50"
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p
                  className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
              <p>
                New here?{" "}
                <Link
                  href="/signup"
                  className="text-[var(--color-primary)] font-medium hover:underline"
                >
                  Create a free account
                </Link>
              </p>
              <p className="text-gray-500">
                or{" "}
                <Link
                  href="/book"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  book as a guest
                </Link>{" "}
                — no account required.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
