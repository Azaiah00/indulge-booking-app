"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Calendar } from "@/components/booking/Calendar";
import { FluidBackground } from "@/components/three/FluidBackground";
import { Button } from "@/components/ui/Button";

type Step = "SERVICE" | "DATE" | "CONFIRM";

export default function BookingClient({ services }: { services: any[] }) {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>("SERVICE");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: Date, time: string } | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill contact info for signed-in members when they reach confirm.
  useEffect(() => {
    if (session?.user?.name && !clientName) {
      setClientName(session.user.name);
    }
  }, [session, clientName]);

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

    const name = clientName.trim();
    const phone = clientPhone.trim();

    // Every booking needs a name and phone so Eboni can reach the client.
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          date: format(selectedDateTime.date, "yyyy-MM-dd"),
          time: selectedDateTime.time,
          guestName: name,
          guestPhone: phone,
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to initiate checkout.");
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6">
      <FluidBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-foreground)] mb-8 md:mb-12 text-center uppercase">
          Book Your <span className="italic font-serif text-[var(--color-primary)]">Experience</span>
        </h1>

        {/* Stepper */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm font-medium uppercase tracking-wider">
            <span className={step === "SERVICE" ? "text-[var(--color-primary)] font-bold" : "text-gray-400"}>1. Service</span>
            <span className="text-gray-300">/</span>
            <span className={step === "DATE" ? "text-[var(--color-primary)] font-bold" : "text-gray-400"}>2. Date & Time</span>
            <span className="text-gray-300">/</span>
            <span className={step === "CONFIRM" ? "text-[var(--color-primary)] font-bold" : "text-gray-400"}>3. Confirm</span>
          </div>
        </div>

        {step === "SERVICE" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {services.map(svc => (
              <div
                key={svc.id}
                onClick={() => handleServiceSelect(svc.id)}
                className="bg-white p-5 sm:p-6 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-[var(--color-primary)] hover:shadow-md transition-all group active:scale-[0.98]"
              >
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors">{svc.name}</h3>
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
              <h2 className="text-lg sm:text-xl font-light uppercase">Select Date & Time</h2>
              <button onClick={() => setStep("SERVICE")} className="text-sm text-gray-500 hover:text-black uppercase tracking-wider">&larr; Back</button>
            </div>
            <Calendar serviceId={selectedService!} onSelectSlot={handleDateSelect} />
          </div>
        )}

        {step === "CONFIRM" && selectedDateTime && selectedService && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-5 sm:p-8 rounded-xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-light uppercase text-center mb-6 sm:mb-8">Confirm Details</h2>

            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 sm:pb-4 gap-3">
                <span className="text-gray-500 uppercase tracking-wider text-xs sm:text-sm shrink-0">Service</span>
                <span className="font-medium text-gray-900 text-right">{services.find(s => s.id === selectedService)?.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 sm:pb-4 gap-3">
                <span className="text-gray-500 uppercase tracking-wider text-xs sm:text-sm shrink-0">Date</span>
                <span className="font-medium text-gray-900 text-right">{format(selectedDateTime.date, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 sm:pb-4 gap-3">
                <span className="text-gray-500 uppercase tracking-wider text-xs sm:text-sm shrink-0">Time</span>
                <span className="font-medium text-gray-900 text-right">{selectedDateTime.time}</span>
              </div>
            </div>

            {/* Contact info — required before payment so Eboni can reach the client. */}
            <div className="space-y-4 mb-8">
              <p className="text-sm text-gray-600 text-center">
                Enter your contact details so we can confirm your appointment.
              </p>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white"
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white"
                  placeholder="(804) 555-0123"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            {error && (
              <p
                className="mb-4 text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md text-center"
                role="alert"
              >
                {error}
              </p>
            )}

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
