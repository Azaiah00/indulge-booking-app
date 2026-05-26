import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSalonSettings } from "@/lib/salon-settings";
import { startOfDay, endOfDay, addMinutes, isBefore, isAfter, format, parse } from "date-fns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date"); // YYYY-MM-DD
  const serviceId = searchParams.get("serviceId");

  if (!dateStr) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  try {
    const targetDate = new Date(dateStr);
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    let duration = 60; // default to 60 mins
    if (serviceId) {
      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (service) duration = service.duration;
    }

    // Fetch existing appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: { gte: start },
        endTime: { lte: end },
        status: { in: ["CONFIRMED", "PENDING"] }
      }
    });

    // Fetch blockouts (vacation, lunch, etc.)
    const blockouts = await prisma.blockout.findMany({
      where: {
        startTime: { gte: start },
        endTime: { lte: end }
      }
    });

    // Business hours from admin settings (fallback: 9 AM – 5 PM, 30-min slots).
    const salonSettings = await getSalonSettings();
    const allSlots: string[] = [];
    let currentSlot = parse(salonSettings.openTime, "HH:mm", targetDate);
    const endOfDayTime = parse(salonSettings.closeTime, "HH:mm", targetDate);
    const slotStep = salonSettings.slotInterval;

    while (isBefore(currentSlot, endOfDayTime) || currentSlot.getTime() === endOfDayTime.getTime()) {
      const slotEnd = addMinutes(currentSlot, duration);

      if (isAfter(slotEnd, endOfDayTime)) {
        break; // Service doesn't fit before closing
      }

      // Check overlap with appointments
      const overlapsAppointment = appointments.some(app => {
        return (isBefore(currentSlot, app.endTime) && isAfter(slotEnd, app.startTime));
      });

      // Check overlap with blockouts
      const overlapsBlockout = blockouts.some(b => {
        return (isBefore(currentSlot, b.endTime) && isAfter(slotEnd, b.startTime));
      });

      if (!overlapsAppointment && !overlapsBlockout) {
        // Only return future slots if date is today
        const now = new Date();
        if (isAfter(currentSlot, now) || startOfDay(currentSlot).getTime() !== startOfDay(now).getTime()) {
          allSlots.push(format(currentSlot, "h:mm a"));
        }
      }

      // Increment by configured slot interval (default 30 min).
      currentSlot = addMinutes(currentSlot, slotStep);
    }

    return NextResponse.json({ availableSlots: allSlots });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
