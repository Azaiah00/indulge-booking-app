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

// Eboni's real admin credentials. Change here (or via env vars) any time.
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.toLowerCase().trim() || "ebonimayo444@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Vivian444";
const ADMIN_NAME = process.env.ADMIN_NAME || "Eboni Mayo";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "(804) 537-0525";

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // Clean up any stale admin accounts created earlier (e.g. the placeholder
  // "eboni@indulgesalonandspa.com" used during initial setup). We delete any
  // ADMIN-role user whose email is NOT the current one so we don't leave
  // multiple admins floating around.
  const stale = await prisma.user.deleteMany({
    where: {
      role: "ADMIN",
      NOT: { email: ADMIN_EMAIL },
    },
  });
  if (stale.count > 0) {
    console.log(`Removed ${stale.count} stale admin account(s).`);
  }

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
