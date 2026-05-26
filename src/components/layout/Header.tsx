"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/book", label: "Book" },
  { href: "/login", label: "Sign In" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12",
          isScrolled || menuOpen
            ? "bg-[#faf8f5]/95 backdrop-blur-md shadow-sm border-b border-black/5"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <img
              src="/images/logo.png"
              alt="Indulge Salon & Spa"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors"
            >
              Sign In
            </Link>
            <Link href="/book">
              <Button variant="primary" size="sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile: Book Now + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/book" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" size="sm">
                Book Now
              </Button>
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-md text-[var(--color-foreground)] hover:bg-black/5 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden={!menuOpen}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-down panel */}
          <nav className="absolute top-[72px] left-0 right-0 bg-[#faf8f5] border-b border-black/10 shadow-lg px-6 py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-base uppercase tracking-wider font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] border-b border-black/5 last:border-0 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/book" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
