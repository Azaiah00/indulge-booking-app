import prisma from "./prisma";

// Default salon info used when no row exists yet in the database.
const DEFAULTS = {
  id: "default",
  salonName: "Indulge Salon & Spa",
  tagline: "Imagine. Inspire. Invigorate.",
  address: "7825 Midlothian Tpke",
  city: "Richmond",
  state: "VA",
  zip: "23235",
  phone: "(804) 537-0525",
  email: "indulgespa@msn.com",
  bio: "Founded in 2005 by Eboni Mayo, with over 25 years of professional experience in the beauty industry.",
  openTime: "09:00",
  closeTime: "17:00",
  slotInterval: 30,
  cancelHours: 24,
};

// Returns the singleton SalonSettings row, creating it with defaults if needed.
export async function getSalonSettings() {
  const existing = await prisma.salonSettings.findUnique({
    where: { id: "default" },
  });
  if (existing) return existing;

  return prisma.salonSettings.create({ data: DEFAULTS });
}
