import React from "react";
import prisma from "@/lib/prisma";
import { MasterCalendar } from "@/components/admin/MasterCalendar";

export default async function CalendarPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      service: true,
      user: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const blockouts = await prisma.blockout.findMany({
    orderBy: {
      startTime: "asc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8 uppercase">
        Master <span className="italic font-serif text-[var(--color-primary)]">Calendar</span>
      </h1>
      
      <MasterCalendar appointments={appointments as any} blockouts={blockouts} />
    </div>
  );
}
