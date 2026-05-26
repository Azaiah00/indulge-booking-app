// Seed the admin (Eboni) and an optional demo client account.
//
// USAGE (PowerShell):
//   $env:ADMIN_EMAIL="eboni@indulgesalonandspa.com"; `
//   $env:ADMIN_PASSWORD="ChangeMe123!"; `
//   npx tsx prisma/seed-admin.ts
//
// You can also just edit the defaults below. Re-running is safe — it updates
// the existing user's password instead of creating a duplicate.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.toLowerCase().trim() ||
  "eboni@indulgesalonandspa.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "IndulgeAdmin2026!";
const ADMIN_NAME = process.env.ADMIN_NAME || "Eboni Rufus";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "(804) 537-0525";

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: "ADMIN",
      password: hash,
      name: ADMIN_NAME,
      phone: ADMIN_PHONE,
    },
    create: {
      email: ADMIN_EMAIL,
      role: "ADMIN",
      password: hash,
      name: ADMIN_NAME,
      phone: ADMIN_PHONE,
    },
  });

  console.log("Admin ready.");
  console.log("  Email:    ", user.email);
  console.log("  Password: ", ADMIN_PASSWORD);
  console.log("  Role:     ", user.role);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
