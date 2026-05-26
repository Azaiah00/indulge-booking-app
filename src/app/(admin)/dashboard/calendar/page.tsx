import React from "react";
import prisma from "@/lib/prisma";
import { MasterCalendar } from "@/components/admin/MasterCalendar";
import {
  serializeCalendarAppointments,
  serializeBlockouts,
} from "@/lib/serialize";

export default async function CalendarPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      // Only fetch fields the calendar needs — avoids passing Decimal price.
      service: { select: { name: true, duration: true } },
      user: { select: { name: true, email: true } },
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
      <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-6 sm:mb-8 uppercase">
        Master <span className="italic font-serif text-[var(--color-primary)]">Calendar</span>
      </h1>

      <MasterCalendar
        appointments={serializeCalendarAppointments(appointments)}
        blockouts={serializeBlockouts(blockouts)}
      />
    </div>
  );
}
