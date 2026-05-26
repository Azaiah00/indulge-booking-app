"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Calendar, Briefcase, Ban, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/services", label: "Services", icon: Briefcase },
  { href: "/dashboard/blockouts", label: "Block Time", icon: Ban },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// Responsive admin shell. Sidebar is a fixed drawer on mobile (toggled by a
// hamburger in the top bar) and a static sidebar on desktop.
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes (after a nav click).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open on mobile.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      {/* Mobile top bar (shown only below lg) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="p-2 -ml-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--color-primary)]">
          Admin Panel
        </h2>
        {/* spacer to balance hamburger */}
        <div className="w-9" />
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (drawer on mobile, static on desktop) */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold tracking-widest uppercase text-[var(--color-primary)]">
            Admin Panel
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="lg:hidden p-2 -mr-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <nav className="px-2 flex-1 overflow-y-auto">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 py-3 px-4 rounded-md text-sm uppercase tracking-wider transition-colors",
                  active
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 py-3 px-4 rounded-md text-sm uppercase tracking-wider transition-colors text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Return to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
