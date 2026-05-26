// Helpers to convert Prisma records into plain JSON-safe objects.
// Next.js cannot pass Prisma Decimal (or other non-plain types) from
// Server Components to Client Components — convert them here first.

type DecimalLike = { toString(): string } | number | string;

/** Convert a Prisma Decimal (or number) to a plain number. */
export function decimalToNumber(value: DecimalLike): number {
  return Number(value);
}

/** Serialize services for the booking page client component. */
export function serializeServices(
  services: Array<{
    id: string;
    name: string;
    description: string | null;
    price: DecimalLike;
    duration: number;
  }>
) {
  return services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: `$${decimalToNumber(s.price).toFixed(2)}`,
    duration: `${s.duration} mins`,
  }));
}

/** Serialize appointments for the MasterCalendar client component. */
export function serializeCalendarAppointments(
  appointments: Array<{
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
    guestName: string | null;
    guestPhone: string | null;
    service: { name: string; duration: number } | null;
    user: { name: string | null; email: string | null } | null;
  }>
) {
  return appointments.map((a) => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    guestName: a.guestName,
    guestPhone: a.guestPhone,
    service: a.service
      ? { name: a.service.name, duration: a.service.duration }
      : null,
    user: a.user ? { name: a.user.name, email: a.user.email } : null,
  }));
}

/** Serialize blockouts for the MasterCalendar client component. */
export function serializeBlockouts(
  blockouts: Array<{
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
  }>
) {
  return blockouts.map((b) => ({
    id: b.id,
    title: b.title,
    startTime: b.startTime.toISOString(),
    endTime: b.endTime.toISOString(),
  }));
}
