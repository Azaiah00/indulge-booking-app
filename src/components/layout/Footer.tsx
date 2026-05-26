import React from "react";
import Link from "next/link";

// Footer with real Indulge Salon & Spa info (Eboni Mayo, Richmond, VA)
export function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <img src="/images/logo.png" alt="Indulge Salon & Spa" className="h-12 w-auto object-contain mb-4 filter brightness-0 invert" />
          <p className="text-white/80 max-w-sm mb-4 leading-relaxed">
            Founded in 2005 by Eboni Mayo, with over 25 years of professional
            experience in the beauty industry. Pampering the mind, body, and
            spirit of Richmond, VA.
          </p>
          <p className="text-white/70 italic text-sm tracking-wider">
            Imagine. Inspire. Invigorate.
          </p>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-3 text-white/80">
            <li>
              <Link href="/#services" className="hover:text-white transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-white transition-colors">
                Book Now
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Member Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3 text-white/80 text-sm">
            <li>7825 Midlothian Tpke</li>
            <li>Richmond, VA 23235</li>
            <li>
              <a href="tel:+18045370525" className="hover:text-white transition-colors">
                (804) 537-0525
              </a>
            </li>
            <li>
              <a
                href="mailto:indulgespa@msn.com"
                className="hover:text-white transition-colors"
              >
                indulgespa@msn.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
        <p>&copy; {new Date().getFullYear()} Indulge Salon & Spa. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
