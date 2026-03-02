"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelAppointment(id: string) {
  await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" }
  });
  
  revalidatePath("/portal");
  revalidatePath("/dashboard");
}
