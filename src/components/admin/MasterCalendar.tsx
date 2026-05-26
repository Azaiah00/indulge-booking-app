"use client";

import React, { useState } from "react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns";

type Appointment = {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  service: { name: string; duration: number } | null;
  user: { name: string | null; email: string | null } | null;
  guestName?: string | null;
  guestPhone?: string | null;
};

export function MasterCalendar({ appointments, blockouts }: { appointments: Appointment[], blockouts: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold uppercase tracking-wider text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200">&larr; Prev</button>
          <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200">Next &rarr;</button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        {weekDays.map((day, i) => {
          const dayAppointments = appointments.filter(app => isSameDay(new Date(app.startTime), day));
          const dayBlockouts = blockouts.filter(b => isSameDay(new Date(b.startTime), day));
          return (
            <div key={i} className="min-h-[400px] flex flex-col">
              <div className={`p-3 text-center border-b border-gray-200 ${isSameDay(day, new Date()) ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50'}`}>
                <div className="text-xs uppercase font-semibold">{format(day, "EEE")}</div>
                <div className="text-xl font-light">{format(day, "d")}</div>
              </div>
              <div className="p-2 flex-1 overflow-y-auto space-y-2">
                {dayAppointments.length === 0 && dayBlockouts.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-4">No Bookings</div>
                ) : (
                  <>
                    {dayBlockouts.map((b: any) => (
                      <div key={b.id} className="p-2 text-xs rounded border border-red-100 bg-red-50 shadow-sm flex flex-col gap-1">
                        <div className="font-semibold text-red-900">{format(new Date(b.startTime), "h:mm a")} - {format(new Date(b.endTime), "h:mm a")}</div>
                        <div className="text-red-700 font-medium">Blocked: {b.title}</div>
                      </div>
                    ))}
                    {dayAppointments.map((app) => (
                    <div key={app.id} className="p-2 text-xs rounded border border-gray-100 bg-white shadow-sm flex flex-col gap-1">
                      <div className="font-semibold text-gray-900">{format(new Date(app.startTime), "h:mm a")}</div>
                      <div className="text-gray-700 truncate">{app.service?.name ?? "Service"}</div>
                      <div className="text-gray-500 truncate">
                        {app.user?.name || app.user?.email || app.guestName || "Guest"}
                        {app.guestPhone ? ` · ${app.guestPhone}` : ""}
                      </div>
                      <div className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium w-max ${
                        app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {app.status}
                      </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
