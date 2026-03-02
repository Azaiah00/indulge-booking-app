"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FluidBackground } from "@/components/three/FluidBackground";

export default function LoginPage() {
  const router = useRouter();
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
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        if (email.includes("admin")) {
          router.push("/dashboard");
        } else {
          router.push("/portal");
        }
        return;
      }
      // Show why sign-in failed
      setError(res?.error ?? "Sign-in failed. Check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <FluidBackground />
      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="bg-white/90 backdrop-blur-md shadow-xl border-white/20">
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-2xl font-light uppercase tracking-widest text-[var(--color-primary)]">
              Client Portal
            </CardTitle>
            <p className="text-gray-500 text-sm mt-2">Sign in to manage your appointments</p>
          </CardHeader>
          <CardContent className="p-8">
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
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              For demo: use <strong className="text-gray-800">admin@test.com</strong> for Admin, <br/>
              or any other email for Client.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
