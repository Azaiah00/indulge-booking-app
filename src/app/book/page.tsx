import React from "react";
import prisma from "@/lib/prisma";
import { serializeServices } from "@/lib/serialize";
import BookingClient from "./BookingClient";

export default async function BookingPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <BookingClient services={serializeServices(services)} />;
}
