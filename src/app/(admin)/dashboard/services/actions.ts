"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createService(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const duration = parseInt(formData.get("duration") as string, 10);

  if (!name || isNaN(price) || isNaN(duration)) {
    throw new Error("Missing or invalid required fields");
  }

  await prisma.service.create({
    data: {
      name,
      description,
      price,
      duration,
    },
  });

  revalidatePath("/dashboard/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard/services");
}
