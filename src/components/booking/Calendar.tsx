"use client";

import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CalendarProps {
  serviceId: string;
  onSelectSlot: (date: Date, time: string) => void;
}

export function Calendar({ serviceId, onSelectSlot }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(`/api/booking/availability?date=${dateStr}&serviceId=${serviceId}`);
        const data = await res.json();
        if (data.availableSlots) {
          setAvailableSlots(data.availableSlots);
        } else {
          setAvailableSlots([]);
        }
      } catch (e) {
        console.error("Failed to fetch slots", e);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, serviceId]);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelectSlot(selectedDate, selectedTime);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Date Selector */}
      <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-5 sm:mb-6">
          <h3 className="font-semibold text-gray-800 uppercase tracking-wider text-xs sm:text-sm">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <div className="flex gap-2">
            <button onClick={handlePrevWeek} aria-label="Previous week" className="p-2 hover:bg-gray-100 rounded-full transition-colors">&larr;</button>
            <button onClick={handleNextWeek} aria-label="Next week" className="p-2 hover:bg-gray-100 rounded-full transition-colors">&rarr;</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <button
                key={i}
                onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all",
                  isSelected
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 uppercase tracking-wider text-xs sm:text-sm mb-5 sm:mb-6">
          Available on {format(selectedDate, "MMM d")}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {loading ? (
            <div className="col-span-full text-center text-sm text-gray-500 py-4">Loading slots...</div>
          ) : availableSlots.length === 0 ? (
            <div className="col-span-full text-center text-sm text-gray-500 py-4">No slots available</div>
          ) : (
            availableSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "py-2.5 sm:py-3 px-2 sm:px-4 rounded-md text-sm font-medium transition-all border",
                  selectedTime === time
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                )}
              >
                {time}
              </button>
            ))
          )}
        </div>

        <Button
          className="w-full"
          disabled={!selectedTime}
          onClick={handleConfirm}
        >
          Confirm Date & Time
        </Button>
      </div>
    </div>
  );
}
