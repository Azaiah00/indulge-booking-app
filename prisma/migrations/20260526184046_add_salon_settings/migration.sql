-- CreateTable
CREATE TABLE "SalonSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "salonName" TEXT NOT NULL DEFAULT 'Indulge Salon & Spa',
    "tagline" TEXT DEFAULT 'Imagine. Inspire. Invigorate.',
    "address" TEXT DEFAULT '7825 Midlothian Tpke',
    "city" TEXT DEFAULT 'Richmond',
    "state" TEXT DEFAULT 'VA',
    "zip" TEXT DEFAULT '23235',
    "phone" TEXT DEFAULT '(804) 537-0525',
    "email" TEXT DEFAULT 'indulgespa@msn.com',
    "bio" TEXT,
    "openTime" TEXT NOT NULL DEFAULT '09:00',
    "closeTime" TEXT NOT NULL DEFAULT '17:00',
    "slotInterval" INTEGER NOT NULL DEFAULT 30,
    "cancelHours" INTEGER NOT NULL DEFAULT 24,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalonSettings_pkey" PRIMARY KEY ("id")
);
