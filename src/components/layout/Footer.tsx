import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold tracking-widest uppercase mb-4">Indulge Salon & Spa</h3>
          <p className="text-white/80 max-w-sm mb-6 leading-relaxed">
            A sanctuary for beauty and relaxation. Experience world-class treatments in an environment designed to rejuvenate your body and mind.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-3 text-white/80">
            <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="#gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Client Portal</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3 text-white/80">
            <li>123 Luxury Lane</li>
            <li>Beverly Hills, CA 90210</li>
            <li>(555) 123-4567</li>
            <li>hello@indulgesalon.com</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
        <p>&copy; {new Date().getFullYear()} Indulge Salon & Spa. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
