"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidBackground } from "@/components/three/FluidBackground";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

gsap.registerPlugin(ScrollTrigger);

// Service categories shown on the homepage. These reflect Eboni's real offerings.
// Pricing and specific items are managed in the admin Services page (DB-backed).
const SERVICE_CATEGORIES = [
  {
    title: "Nail Services",
    desc:
      "Natural & artificial nails, signature manicures and pedicures, hot lava spa treatments, gel and dip.",
  },
  {
    title: "Waxing & Skin",
    desc:
      "Professional waxing for the face and body, plus relaxing skin treatments by experienced technicians.",
  },
  {
    title: "Detox & Body",
    desc:
      "Herbally based body contouring wraps that tighten, tone and firm — see results in as little as 45 minutes.",
  },
  {
    title: "Gentlemen's Spa",
    desc: "Manicures, pedicures, and grooming services tailored for the modern gentleman.",
  },
  {
    title: "Children's Spa",
    desc:
      "Kid-friendly pampering — perfect for birthdays, special days, or a fun afternoon with a little one.",
  },
];

export default function Home() {
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!servicesRef.current) return;
    const cards = servicesRef.current.querySelectorAll(".service-card");
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: servicesRef.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <FluidBackground />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-4">
              Richmond, Virginia · Since 2005
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-[var(--color-foreground)] mb-6 uppercase">
              Imagine. <br />
              <span className="italic font-serif text-[var(--color-primary)]">
                Inspire. Invigorate.
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-[var(--color-foreground)]/80 mb-10 font-light max-w-2xl mx-auto"
          >
            Pampering the mind, body, and spirit. Professional nail, waxing,
            and detox services from Eboni Mayo and the Indulge team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/book" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto uppercase tracking-widest text-sm"
              >
                Book Appointment
              </Button>
            </Link>
            <Link href="#services" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto uppercase tracking-widest text-sm"
              >
                View Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="py-20 md:py-32 px-6 md:px-12 bg-white"
        ref={servicesRef}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[var(--color-foreground)] mb-4 uppercase">
              Our <span className="italic font-serif text-[var(--color-primary)]">Services</span>
            </h2>
            <p className="text-[var(--color-foreground)]/70 max-w-2xl mx-auto">
              A full menu of beauty, wellness, and self-care — for women, men, and
              children. Book any service online in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SERVICE_CATEGORIES.map((service, idx) => (
              <Card
                key={idx}
                className="service-card border-none bg-[#faf8f5] hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-light uppercase">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--color-foreground)]/70 leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  <Link href="/book">
                    <Button
                      variant="ghost"
                      className="uppercase tracking-widest text-xs p-0 h-auto font-semibold"
                    >
                      Book This &rarr;
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT EBONI */}
      <section id="about" className="py-20 md:py-32 px-6 md:px-12 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1 h-[400px] sm:h-[500px] md:h-[600px] bg-[var(--color-primary)]/15 rounded-2xl overflow-hidden relative shadow-lg border border-black/5">
            <img
              src="/images/eboni.png"
              alt="Eboni Mayo"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-4">
              Meet The Founder
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[var(--color-foreground)] mb-6 uppercase">
              Eboni <span className="italic font-serif text-[var(--color-primary)]">Mayo</span>
            </h2>
            <p className="text-[var(--color-foreground)]/80 mb-4 leading-relaxed text-base md:text-lg font-light">
              Indulge Salon & Spa opened January 2005 under the dedicated efforts
              of Eboni Mayo — former co-owner of His & Hers Nail Spa & Academy
              and a beauty professional with over 25 years of experience.
            </p>
            <p className="text-[var(--color-foreground)]/80 mb-8 leading-relaxed text-base md:text-lg font-light">
              We believe beauty starts from the inside. Our team is here to
              pamper your mind, body, and spirit with multicultural,
              high-quality, professional service.
            </p>
            <Link href="/book">
              <Button
                size="lg"
                variant="secondary"
                className="uppercase tracking-widest text-sm w-full sm:w-auto"
              >
                Book With Eboni
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* MEMBER PERKS BANNER */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center bg-[var(--color-primary)] text-white rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70 mb-4">
            Become A Member — It's Free
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-light uppercase mb-4">
            Book as a guest, <em className="italic font-serif">or join the family</em>
          </h3>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed text-sm sm:text-base">
            You can book any service without creating an account. But our free
            members get appointment reminders, exclusive discounts, wellness
            tips, easy rescheduling, and early access to new services.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link href="/book" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full uppercase tracking-widest text-sm bg-transparent !border-white !text-white hover:!bg-white hover:!text-[var(--color-primary)]"
              >
                Book As Guest
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full uppercase tracking-widest text-sm bg-white !text-[var(--color-primary)] hover:bg-white/90"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
