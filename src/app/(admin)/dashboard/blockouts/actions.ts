"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBlockout(formData: FormData) {
  const title = formData.get("title") as string;
  const startDateStr = formData.get("startDate") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endDateStr = formData.get("endDate") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!title || !startDateStr || !startTimeStr || !endDateStr || !endTimeStr) {
    throw new Error("Missing required fields");
  }

  const startTime = new Date(`${startDateStr}T${startTimeStr}`);
  const endTime = new Date(`${endDateStr}T${endTimeStr}`);

  await prisma.blockout.create({
    data: {
      title,
      startTime,
      endTime,
    },
  });

  revalidatePath("/dashboard/blockouts");
  revalidatePath("/dashboard/calendar");
}

export async function deleteBlockout(id: string) {
  await prisma.blockout.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard/blockouts");
  revalidatePath("/dashboard/calendar");
}
