"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidBackground } from "@/components/three/FluidBackground";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const servicesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!servicesRef.current) return;
    
    const cards = servicesRef.current.querySelectorAll('.service-card');
    
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <FluidBackground />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-[var(--color-foreground)] mb-6 uppercase">
              Discover Your <br />
              <span className="italic font-serif text-[var(--color-primary)]">Inner Glow</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-[var(--color-foreground)]/80 mb-10 font-light"
          >
            A premier destination for sophisticated styling and holistic relaxation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto uppercase tracking-widest text-sm">
              Book Appointment
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto uppercase tracking-widest text-sm">
              View Services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 md:px-12 bg-white" ref={servicesRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[var(--color-foreground)] mb-4 uppercase">
              Our <span className="italic font-serif text-[var(--color-primary)]">Services</span>
            </h2>
            <p className="text-[var(--color-foreground)]/70 max-w-2xl mx-auto">
              Curated treatments tailored to elevate your natural beauty.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Hair Styling", desc: "Precision cuts, vibrant coloring, and restorative treatments." },
              { title: "Massage Therapy", desc: "Deep tissue, Swedish, and hot stone therapies for ultimate relaxation." },
              { title: "Skincare", desc: "Rejuvenating facials and advanced treatments for a radiant complexion." }
            ].map((service, idx) => (
              <Card key={idx} className="service-card border-none bg-[#faf8f5] hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-light uppercase">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--color-foreground)]/70 leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  <Button variant="ghost" className="uppercase tracking-widest text-xs p-0 h-auto font-semibold">
                    Learn More &rarr;
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="about" className="py-32 px-6 md:px-12 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 h-[600px] bg-[var(--color-primary)]/20 rounded-2xl overflow-hidden relative">
            {/* Placeholder for an image */}
            <div className="absolute inset-0 flex items-center justify-center text-[var(--color-primary)]/40 font-serif italic text-4xl">
              Atmosphere
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[var(--color-foreground)] mb-6 uppercase">
              The <span className="italic font-serif text-[var(--color-primary)]">Experience</span>
            </h2>
            <p className="text-[var(--color-foreground)]/80 mb-8 leading-relaxed text-lg font-light">
              From the moment you step through our doors, you are transported into a world of tranquility. Our expert team is dedicated to providing personalized care using the highest quality organic products, ensuring an experience that is both luxurious and sustainable.
            </p>
            <Button size="lg" variant="secondary" className="uppercase tracking-widest text-sm">
              Meet The Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
