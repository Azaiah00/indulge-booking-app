import React from "react";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { createBlockout, deleteBlockout } from "./actions";
import { Button } from "@/components/ui/Button";

export default async function BlockoutsPage() {
  const blockouts = await prisma.blockout.findMany({
    orderBy: {
      startTime: "asc",
    },
  });

  const now = new Date();
  const upcomingBlockouts = blockouts.filter(b => new Date(b.endTime) >= now);
  const pastBlockouts = blockouts.filter(b => new Date(b.endTime) < now);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-6 sm:mb-8 uppercase">
        Block <span className="italic font-serif text-[var(--color-primary)]">Time</span>
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 shadow-sm mb-10 sm:mb-12">
        <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider mb-5 sm:mb-6 text-gray-800">Add New Blockout</h2>
        <form action={createBlockout} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Title / Reason</label>
            <input type="text" name="title" required placeholder="e.g. Lunch Break, Vacation" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Start Date</label>
              <input type="date" name="startDate" required className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Start Time</label>
              <input type="time" name="startTime" required className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">End Date</label>
              <input type="date" name="endDate" required className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">End Time</label>
              <input type="time" name="endTime" required className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto">Add Blockout</Button>
        </form>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider mb-4 text-gray-800">Upcoming Blockouts</h2>
          {upcomingBlockouts.length === 0 ? (
            <p className="text-gray-500 italic">No upcoming blockouts.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {upcomingBlockouts.map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b border-gray-100 last:border-0">
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{b.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(b.startTime), "MMM d, yyyy h:mm a")} - {format(new Date(b.endTime), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <form action={async () => { "use server"; await deleteBlockout(b.id); }} className="sm:shrink-0">
                    <Button variant="ghost" size="sm" type="submit" className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
