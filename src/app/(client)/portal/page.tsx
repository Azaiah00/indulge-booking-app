import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { cancelAppointment } from "./actions";
import Link from "next/link";

export default async function ClientPortal() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const userId = (session.user as any).id;

  const appointments = await prisma.appointment.findMany({
    where: { userId },
    include: { service: true },
    orderBy: { startTime: "asc" },
  });

  const now = new Date();
  const upcoming = appointments.filter(a => new Date(a.startTime) >= now && a.status !== "CANCELLED");
  const past = appointments.filter(a => new Date(a.startTime) < now || a.status === "CANCELLED");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[var(--color-foreground)] mb-2 uppercase">
            Welcome, <span className="italic font-serif text-[var(--color-primary)]">{session.user.name || "Guest"}</span>
          </h1>
          <p className="text-gray-500">Manage your appointments and preferences.</p>
        </div>
        <Link href="/book">
          <Button variant="primary" size="md">Book Appointment</Button>
        </Link>
      </div>

      <h2 className="text-xl font-semibold uppercase tracking-widest text-gray-800 mb-6">Upcoming Appointments</h2>
      
      <div className="space-y-4">
        {upcoming.length === 0 ? (
          <p className="text-gray-500 italic">You have no upcoming appointments.</p>
        ) : (
          upcoming.map((app) => (
            <Card key={app.id} className="flex flex-col sm:flex-row items-center justify-between p-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{app.service.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                    app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{format(new Date(app.startTime), "MMMM d, yyyy 'at' h:mm a")}</p>
                <p className="text-gray-500 text-sm mt-1">{app.service.duration} mins &bull; ${Number(app.service.price).toFixed(2)}</p>
              </div>
              <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                <form action={async () => { "use server"; await cancelAppointment(app.id); }} className="w-full sm:w-auto">
                  <Button variant="ghost" size="sm" type="submit" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">Cancel</Button>
                </form>
              </div>
            </Card>
          ))
        )}
      </div>
      
      <h2 className="text-xl font-semibold uppercase tracking-widest text-gray-800 mt-16 mb-6">Past Services</h2>
      <div className="space-y-4">
        {past.length === 0 ? (
          <Card className="bg-gray-50 border-none shadow-none">
            <CardContent className="p-8 text-center text-gray-500">
              No past services found.
            </CardContent>
          </Card>
        ) : (
          past.map((app) => (
            <Card key={app.id} className="p-4 bg-gray-50 border-transparent">
              <div className="flex justify-between items-center opacity-70">
                <div>
                  <h3 className="font-medium text-gray-900">{app.service.name}</h3>
                  <p className="text-sm text-gray-500">{format(new Date(app.startTime), "MMM d, yyyy")}</p>
                </div>
                <span className={`text-xs font-semibold uppercase ${
                  app.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {app.status}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
