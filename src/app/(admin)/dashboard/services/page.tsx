import React from "react";
import prisma from "@/lib/prisma";
import { createService, deleteService } from "./actions";
import { Button } from "@/components/ui/Button";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-6 sm:mb-8 uppercase">
        Manage <span className="italic font-serif text-[var(--color-primary)]">Services</span>
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 shadow-sm mb-10 sm:mb-12">
        <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider mb-5 sm:mb-6 text-gray-800">Add New Service</h2>
        <form action={createService} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Service Name</label>
              <input type="text" name="name" required placeholder="e.g. Balayage" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Price ($)</label>
              <input type="number" name="price" step="0.01" required placeholder="120.00" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Duration (minutes)</label>
              <input type="number" name="duration" required placeholder="90" className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Description (Optional)</label>
            <textarea name="description" rows={3} placeholder="Describe the service..." className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"></textarea>
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto">Add Service</Button>
        </form>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider mb-4 text-gray-800">Current Services</h2>
          {services.length === 0 ? (
            <p className="text-gray-500 italic">No services listed yet.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {services.map((s) => (
                <div key={s.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b border-gray-100 last:border-0">
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{s.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${Number(s.price).toFixed(2)} &bull; {s.duration} mins
                    </p>
                  </div>
                  <form action={async () => { "use server"; await deleteService(s.id); }} className="sm:shrink-0">
                    <Button variant="ghost" size="sm" type="submit" className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
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
