"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/booking/Calendar";
import { FluidBackground } from "@/components/three/FluidBackground";
import { Button } from "@/components/ui/Button";

type Step = "SERVICE" | "DATE" | "CONFIRM";

export default function BookingClient({ services }: { services: any[] }) {
  const [step, setStep] = useState<Step>("SERVICE");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: Date, time: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    setStep("DATE");
  };

  const handleDateSelect = (date: Date, time: string) => {
    setSelectedDateTime({ date, time });
    setStep("CONFIRM");
  };

  const handleCheckout = async () => {
    if (!selectedService || !selectedDateTime) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          date: format(selectedDateTime.date, "yyyy-MM-dd"),
          time: selectedDateTime.time,
          userId: "anonymous", // In a real app, you might want them to login first or pass email to checkout
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate checkout");
      }
    } catch (e) {
      console.error(e);
      alert("Error initiating checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-32 pb-20 px-6">
      <FluidBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight text-[var(--color-foreground)] mb-12 text-center uppercase">
          Book Your <span className="italic font-serif text-[var(--color-primary)]">Experience</span>
        </h1>

        {/* Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 text-sm font-medium uppercase tracking-wider">
            <span className={step === "SERVICE" ? "text-[var(--color-primary)] font-bold" : "text-gray-400"}>1. Service</span>
            <span className="text-gray-300">/</span>
            <span className={step === "DATE" ? "text-[var(--color-primary)] font-bold" : "text-gray-400"}>2. Date & Time</span>
            <span className="text-gray-300">/</span>
            <span className={step === "CONFIRM" ? "text-[var(--color-primary)] font-bold" : "text-gray-400"}>3. Confirm</span>
          </div>
        </div>

        {step === "SERVICE" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(svc => (
              <div 
                key={svc.id}
                onClick={() => handleServiceSelect(svc.id)}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors">{svc.name}</h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{svc.duration}</span>
                  <span className="font-semibold text-gray-700">{svc.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === "DATE" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-light uppercase">Select Date & Time</h2>
              <button onClick={() => setStep("SERVICE")} className="text-sm text-gray-500 hover:text-black uppercase tracking-wider">&larr; Back</button>
            </div>
            <Calendar serviceId={selectedService!} onSelectSlot={handleDateSelect} />
          </div>
        )}

        {step === "CONFIRM" && selectedDateTime && selectedService && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-light uppercase text-center mb-8">Confirm Details</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-gray-500 uppercase tracking-wider text-sm">Service</span>
                <span className="font-medium text-gray-900">{services.find(s => s.id === selectedService)?.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-gray-500 uppercase tracking-wider text-sm">Date</span>
                <span className="font-medium text-gray-900">{format(selectedDateTime.date, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-gray-500 uppercase tracking-wider text-sm">Time</span>
                <span className="font-medium text-gray-900">{selectedDateTime.time}</span>
              </div>
            </div>

            <Button size="lg" className="w-full text-lg" onClick={handleCheckout} disabled={loading}>
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
            <button onClick={() => setStep("DATE")} className="w-full text-center mt-4 text-sm text-gray-500 hover:text-black uppercase tracking-wider">
              &larr; Back to Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
