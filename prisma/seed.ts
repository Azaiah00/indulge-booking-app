// Prisma seed script for Indulge Salon & Spa
// Loads Eboni Mayo's service menu into the database.
//
// HOW TO RUN:
//   npx tsx prisma/seed.ts
//
// SAFE TO RE-RUN: uses upsert by service name, so it won't create duplicates.
//
// IMPORTANT: Prices and durations below are placeholders that match the
// service categories on indulgesalonandspa.com. Verify exact prices with
// Eboni and update them in the Admin > Services page when she confirms.
// The only price confirmed from her public website is the $35 detox wrap.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Each service: name (unique), description, price (USD), duration (minutes)
const services = [
  // NAIL SERVICES — natural & artificial
  {
    name: "Express Manicure",
    description: "Quick, polished nails when you're on the go.",
    price: 18.0,
    duration: 30,
  },
  {
    name: "Signature Manicure",
    description: "Trim, shape, cuticle care, hand massage, and polish.",
    price: 32.0,
    duration: 45,
  },
  {
    name: "Gel Manicure",
    description: "Long-lasting gel polish manicure for chip-free shine.",
    price: 48.0,
    duration: 60,
  },
  {
    name: "Deluxe Hot Lava Manicure",
    description: "Luxurious manicure with warming hot lava treatment.",
    price: 52.0,
    duration: 60,
  },
  {
    name: "Gentleman's Manicure",
    description: "Clean, well-groomed nails designed for men.",
    price: 28.0,
    duration: 30,
  },
  {
    name: "Express Pedicure",
    description: "A quick pedicure to refresh tired feet.",
    price: 25.0,
    duration: 30,
  },
  {
    name: "Signature Pedicure",
    description: "Full pedicure with soak, exfoliation, massage, and polish.",
    price: 48.0,
    duration: 60,
  },
  {
    name: "Deluxe Hot Lava Pedicure",
    description: "Premium pedicure with warming hot lava therapy.",
    price: 62.0,
    duration: 75,
  },
  {
    name: "Deluxe Hot Lava Mani/Pedi",
    description: "The full Indulge experience — hot lava manicure + pedicure.",
    price: 105.0,
    duration: 120,
  },

  // WAXING
  {
    name: "Eyebrow Wax",
    description: "Clean, shaped brows that frame your face.",
    price: 15.0,
    duration: 15,
  },
  {
    name: "Lip Wax",
    description: "Smooth upper lip wax.",
    price: 10.0,
    duration: 10,
  },
  {
    name: "Full Face Wax",
    description: "Complete face waxing service.",
    price: 45.0,
    duration: 30,
  },
  {
    name: "Underarm Wax",
    description: "Quick, clean underarm waxing.",
    price: 25.0,
    duration: 20,
  },
  {
    name: "Half Leg Wax",
    description: "Waxing for lower or upper half of the leg.",
    price: 40.0,
    duration: 30,
  },
  {
    name: "Full Leg Wax",
    description: "Full leg waxing — smooth from thigh to ankle.",
    price: 65.0,
    duration: 60,
  },
  {
    name: "Brazilian Wax",
    description: "Professional Brazilian waxing service.",
    price: 60.0,
    duration: 45,
  },

  // DETOX & BODY (confirmed: $35 Ultimate Body Applicator)
  {
    name: "Ultimate Body Applicator Detox Wrap",
    description:
      "Herbally based body contouring wrap. Tightens, tones, and firms — results in as little as 45 minutes.",
    price: 35.0,
    duration: 60,
  },
  {
    name: "Detox Wrap Series (Set of 4)",
    description: "Four detox wraps to maximize tightening and toning results.",
    price: 120.0,
    duration: 60,
  },

  // CHILDREN'S SPA (10 and under)
  {
    name: "Kid's Manicure",
    description: "Kid-friendly manicure for children 10 and under.",
    price: 15.0,
    duration: 30,
  },
  {
    name: "Kid's Pedicure",
    description: "Kid-friendly pedicure for children 10 and under.",
    price: 25.0,
    duration: 30,
  },
];

// Service names that should NOT be in the catalog (Eboni does not offer
// hair services). We delete these from the DB on every seed run so old
// rows from earlier seeds are cleaned up.
const removedServiceNames = [
  "Women's Hair Cut",
  "Men's Hair Cut",
  "Hair Wash & Style",
  "Kid's Hair Cut",
];

async function main() {
  console.log("Seeding services for Indulge Salon & Spa...");

  // First, remove any retired services (e.g. hair services Eboni doesn't offer).
  const deleted = await prisma.service.deleteMany({
    where: { name: { in: removedServiceNames } },
  });
  if (deleted.count > 0) {
    console.log(`Removed ${deleted.count} retired service(s).`);
  }

  for (const svc of services) {
    // Upsert by name keeps the script safe to re-run.
    const existing = await prisma.service.findFirst({ where: { name: svc.name } });
    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: svc,
      });
    } else {
      await prisma.service.create({ data: svc });
    }
  }

  console.log(`Done. Seeded ${services.length} services.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
