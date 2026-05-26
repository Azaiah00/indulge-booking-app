"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FluidBackground } from "@/components/three/FluidBackground";

// Sign-up page for clients who want to become Indulge Members.
// Members get reminders, exclusive discounts, wellness tips, easy
// rescheduling, and early access to new services.
//
// On success it auto-signs the user in and sends them to the booking flow.
export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create the account.
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create your account.");
        setLoading(false);
        return;
      }

      // 2. Sign them in immediately.
      const signin = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signin?.ok) {
        router.push("/portal");
      } else {
        // Account was created; they can sign in from /login.
        router.push("/login?registered=1");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6">
      <FluidBackground />
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Member perks — what they get from creating an account */}
        <div className="hidden md:block sticky top-32">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-4">
            Become A Member
          </p>
          <h1 className="text-4xl font-light text-[var(--color-foreground)] mb-6 uppercase">
            Join the <span className="italic font-serif text-[var(--color-primary)]">Indulge</span> family
          </h1>
          <p className="text-[var(--color-foreground)]/70 mb-8 leading-relaxed">
            You can always book as a guest — no account needed. But our free
            members enjoy:
          </p>
          <ul className="space-y-4 text-[var(--color-foreground)]/80">
            <li className="flex gap-3">
              <span className="text-[var(--color-secondary)] font-bold">·</span>
              <span>Appointment reminders so you never miss a date</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-secondary)] font-bold">·</span>
              <span>Easy rescheduling and cancellation from your portal</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-secondary)] font-bold">·</span>
              <span>Exclusive member-only discounts and seasonal offers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-secondary)] font-bold">·</span>
              <span>Wellness tips and beauty newsletters from Eboni</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-secondary)] font-bold">·</span>
              <span>Early access to new services and limited-time promotions</span>
            </li>
          </ul>

          <div className="mt-10 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-black/5 text-sm">
            <p className="text-[var(--color-foreground)]/70">
              Just here to book once?{" "}
              <Link
                href="/book"
                className="text-[var(--color-primary)] underline font-medium"
              >
                Book as a guest instead &rarr;
              </Link>
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white/90 backdrop-blur-md shadow-xl border-white/20">
          <CardHeader className="text-center pb-2 pt-6 sm:pt-8">
            <CardTitle className="text-xl sm:text-2xl font-light uppercase tracking-widest text-[var(--color-primary)]">
              Create Account
            </CardTitle>
            <p className="text-gray-500 text-sm mt-2">
              Free forever. Cancel anytime.
            </p>
          </CardHeader>
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white/50"
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white/50"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white/50"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white/50"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-400 mt-1">At least 8 characters.</p>
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
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Free Account"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already a member?{" "}
                <Link
                  href="/login"
                  className="text-[var(--color-primary)] font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
