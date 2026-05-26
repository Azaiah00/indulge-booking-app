"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSalonSettings } from "@/lib/salon-settings";

type ActionResult = { ok: true; message: string } | { ok: false; error: string };

// Helper: only the logged-in admin can change settings.
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

// Update Eboni's admin profile (name, email, phone).
export async function updateAdminProfile(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const userId = (session.user as any).id as string;

    const name = (formData.get("name") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().toLowerCase().trim();
    const phone = (formData.get("phone") ?? "").toString().trim();

    if (!name || !email) {
      return { ok: false, error: "Name and email are required." };
    }

    // Make sure the new email isn't taken by someone else.
    const taken = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (taken) {
      return { ok: false, error: "That email is already in use." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name, email, phone: phone || null },
    });

    revalidatePath("/dashboard/settings");
    return { ok: true, message: "Profile updated successfully." };
  } catch {
    return { ok: false, error: "Could not update profile." };
  }
}

// Change the admin password (requires current password).
export async function updateAdminPassword(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const userId = (session.user as any).id as string;

    const current = (formData.get("currentPassword") ?? "").toString();
    const next = (formData.get("newPassword") ?? "").toString();
    const confirm = (formData.get("confirmPassword") ?? "").toString();

    if (!current || !next) {
      return { ok: false, error: "Please fill in all password fields." };
    }
    if (next.length < 8) {
      return { ok: false, error: "New password must be at least 8 characters." };
    }
    if (next !== confirm) {
      return { ok: false, error: "New passwords do not match." };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.password) {
      return { ok: false, error: "No password set on this account." };
    }

    const valid = await bcrypt.compare(current, user.password);
    if (!valid) {
      return { ok: false, error: "Current password is incorrect." };
    }

    const hashed = await bcrypt.hash(next, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { ok: true, message: "Password changed successfully." };
  } catch {
    return { ok: false, error: "Could not change password." };
  }
}

// Update salon business info shown on the site and in communications.
export async function updateSalonInfo(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    await getSalonSettings(); // ensures row exists

    const salonName = (formData.get("salonName") ?? "").toString().trim();
    const tagline = (formData.get("tagline") ?? "").toString().trim();
    const address = (formData.get("address") ?? "").toString().trim();
    const city = (formData.get("city") ?? "").toString().trim();
    const state = (formData.get("state") ?? "").toString().trim();
    const zip = (formData.get("zip") ?? "").toString().trim();
    const phone = (formData.get("phone") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const bio = (formData.get("bio") ?? "").toString().trim();

    if (!salonName) {
      return { ok: false, error: "Salon name is required." };
    }

    await prisma.salonSettings.update({
      where: { id: "default" },
      data: {
        salonName,
        tagline: tagline || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        phone: phone || null,
        email: email || null,
        bio: bio || null,
      },
    });

    revalidatePath("/dashboard/settings");
    return { ok: true, message: "Business info saved." };
  } catch {
    return { ok: false, error: "Could not save business info." };
  }
}

// Update booking hours and cancellation rules.
export async function updateBookingRules(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    await getSalonSettings();

    const openTime = (formData.get("openTime") ?? "09:00").toString();
    const closeTime = (formData.get("closeTime") ?? "17:00").toString();
    const slotInterval = parseInt((formData.get("slotInterval") ?? "30").toString(), 10);
    const cancelHours = parseInt((formData.get("cancelHours") ?? "24").toString(), 10);

    if (openTime >= closeTime) {
      return { ok: false, error: "Open time must be before close time." };
    }
    if (slotInterval < 15 || slotInterval > 120) {
      return { ok: false, error: "Slot interval must be between 15 and 120 minutes." };
    }
    if (cancelHours < 1 || cancelHours > 168) {
      return { ok: false, error: "Cancellation window must be between 1 and 168 hours." };
    }

    await prisma.salonSettings.update({
      where: { id: "default" },
      data: { openTime, closeTime, slotInterval, cancelHours },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/api/booking/availability");
    return { ok: true, message: "Booking rules saved." };
  } catch {
    return { ok: false, error: "Could not save booking rules." };
  }
}
