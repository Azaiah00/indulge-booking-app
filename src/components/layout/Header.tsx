"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12",
        isScrolled
          ? "bg-[#faf8f5]/80 backdrop-blur-md shadow-sm border-b border-black/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-widest uppercase text-[var(--color-primary)]">
            Indulge
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#services" className="text-sm uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors">Services</Link>
          <Link href="#gallery" className="text-sm uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors">Gallery</Link>
          <Link href="#about" className="text-sm uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors">
            Sign In
          </Link>
          <Button variant="primary" size="sm">Book Now</Button>
        </div>
      </div>
    </header>
  );
}
