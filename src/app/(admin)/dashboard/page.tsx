import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export default async function AdminDashboard() {
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  // Fetch today's appointments
  const todaysAppointments = await prisma.appointment.findMany({
    where: {
      startTime: { gte: start, lte: end },
    },
    include: {
      service: true,
      user: true,
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  // Calculate today's revenue (from confirmed/completed appointments)
  const todaysRevenue = todaysAppointments
    .filter(app => app.status === "CONFIRMED" || app.status === "COMPLETED")
    .reduce((total, app) => total + Number(app.service?.price ?? 0), 0);

  // Fetch all pending requests across all dates
  const pendingRequestsCount = await prisma.appointment.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-6 sm:mb-8 uppercase">
        Admin <span className="italic font-serif text-[var(--color-primary)]">Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm text-gray-500 uppercase">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-light">{todaysAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm text-gray-500 uppercase">Revenue (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-light">${todaysRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm text-gray-500 uppercase">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-light">{pendingRequestsCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider mb-4 sm:mb-6 text-gray-800">Today's Schedule</h2>
          {todaysAppointments.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg text-center px-4">
              <p>No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {todaysAppointments.map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-gray-100 rounded-lg hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="text-center px-3 py-2 bg-gray-50 rounded-md min-w-[80px] sm:min-w-[100px] shrink-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {app.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{app.service?.name ?? "Service"}</h4>
                      <p className="text-sm text-gray-500 truncate">
                        {app.user?.name || app.user?.email || app.guestName || "Guest"}
                        {app.guestPhone ? ` · ${app.guestPhone}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:ml-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${
                      app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm h-fit">
          <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider mb-4 text-gray-800">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/calendar" className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between">
              <span>View Master Calendar</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/dashboard/services" className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between">
              <span>Manage Services</span>
              <span>&rarr;</span>
            </Link>
            <Link href="/dashboard/blockouts" className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between">
              <span>Block Time / Add Vacation</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}